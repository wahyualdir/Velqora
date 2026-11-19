#!/usr/bin/env python3
"""
Velqora ML v5.0 — Isolated Python Code Execution & Stdout Verifier (Gates G1 & G2)

Loads any ML chapter TypeScript file via `npx tsx`, extracts every `codeExamples[]`
block, executes each block in a CLEAN isolated Python subprocess (guaranteeing zero
cross-tab variable leakage / NameError), validates Pyodide-safe imports for
`pyodide-ready` examples, and verifies that `expectedOutput` matches real stdout
(zero fake '# Output ...' placeholders).

Usage:
  python scripts/validation/verify-ml-v5-code.py --chapter src/lib/curriculum/topics/machine-learning/ch01-problem-framing.ts
  python scripts/validation/verify-ml-v5-code.py --chapter ch01-problem-framing --print-outputs
  python scripts/validation/verify-ml-v5-code.py --all
"""

from __future__ import annotations

import argparse
import ast
from concurrent.futures import ThreadPoolExecutor
import glob
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
ML_DIR = REPO_ROOT / "src" / "lib" / "curriculum" / "topics" / "machine-learning"

# Standard Pyodide v0.27.x scientific Python ecosystem available natively in browser
PYODIDE_THIRD_PARTY_ALLOWED = {
    "numpy",
    "scipy",
    "pandas",
    "sklearn",
    "matplotlib",
    "statsmodels",
    "PIL",
    "sympy",
    "networkx",
}

STDLIB_MODULES = set(getattr(sys, "stdlib_module_names", set())) | {
    "math",
    "random",
    "statistics",
    "json",
    "time",
    "datetime",
    "collections",
    "itertools",
    "functools",
    "hashlib",
    "typing",
    "dataclasses",
    "abc",
    "re",
    "io",
    "os",
    "sys",
    "pathlib",
    "warnings",
    "copy",
    "heapq",
    "bisect",
    "decimal",
    "fractions",
    "enum",
    "inspect",
}

FAKE_OUTPUT_PATTERNS = [
    r"^#\s*output\b",
    r"\[placeholder\]",
    r"todo:",
    r"output belum dibuat",
]


def resolve_chapter_files(chapter_arg: str | None, run_all: bool) -> list[Path]:
    if run_all:
        ch_files = sorted(ML_DIR.glob("ch[0-9][0-9]-*.ts"))
        if not ch_files:
            ch_files = sorted(ML_DIR.glob("chunk*-ch*.ts"))
        return ch_files

    if not chapter_arg:
        raise SystemExit("ERROR: Specify --chapter <name-or-path> or --all")

    candidate = Path(chapter_arg)
    if candidate.exists():
        return [candidate.resolve()]

    in_ml = ML_DIR / chapter_arg
    if in_ml.exists():
        return [in_ml.resolve()]

    if not chapter_arg.endswith(".ts"):
        in_ml_ts = ML_DIR / f"{chapter_arg}.ts"
        if in_ml_ts.exists():
            return [in_ml_ts.resolve()]

    matches = sorted(ML_DIR.glob(f"*{chapter_arg}*.ts"))
    if matches:
        return [m.resolve() for m in matches]

    raise SystemExit(f"ERROR: Could not locate chapter file matching '{chapter_arg}'")


def load_chapter_via_tsx(chapter_path: Path) -> dict[str, Any]:
    """Serialize exported AcademicChapter object from TS file to JSON using tsx."""
    rel = chapter_path.resolve().as_posix()
    loader_code = (
        f"import * as mod from 'file:///{rel}';"
        "const val = Object.values(mod).find((v) => v && typeof v === 'object' && 'subchapters' in v);"
        "if (!val) { console.error('No chapter export found'); process.exit(2); }"
        "process.stdout.write(JSON.stringify(val));"
    )
    proc = subprocess.run(
        ["npx", "tsx", "-e", loader_code],
        cwd=str(REPO_ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        shell=(os.name == "nt"),
        timeout=60,
    )
    if proc.returncode != 0:
        raise RuntimeError(
            f"Failed to load TS chapter {chapter_path.name} via tsx:\n{proc.stderr}"
        )
    return json.loads(proc.stdout)


def extract_top_level_imports(code: str) -> set[str]:
    imports: set[str] = set()
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return imports

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.add(alias.name.split(".")[0])
        elif isinstance(node, ast.ImportFrom) and node.module:
            imports.add(node.module.split(".")[0])
    return imports


def is_fake_output(expected: str) -> bool:
    stripped = (expected or "").strip().lower()
    for pat in FAKE_OUTPUT_PATTERNS:
        if re.search(pat, stripped, flags=re.IGNORECASE | re.MULTILINE):
            return True
    return len(stripped) < 12


def normalize_output_for_compare(text: str) -> str:
    """Normalize line endings and trailing whitespace; strip timing noise lines."""
    lines = []
    for line in (text or "").replace("\r\n", "\n").strip().splitlines():
        cleaned = line.rstrip()
        # Ignore volatile wall-clock timing lines if prefixed cleanly
        if re.search(r"\b\d+(\.\d+)?\s*(ms|detik|sec|s)\b", cleaned, flags=re.IGNORECASE):
            cleaned = re.sub(r"\b\d+(\.\d+)?\s*(ms|detik|sec|s)\b", "<TIME>", cleaned, flags=re.IGNORECASE)
        lines.append(cleaned)
    return "\n".join(lines).strip()


def run_isolated_python(code: str, timeout_sec: int = 25) -> tuple[int, str, str, int]:
    """Execute snippet in a clean Python subprocess with non-interactive Agg backend."""
    preamble = (
        "import os, warnings\n"
        "os.environ['MPLBACKEND'] = 'Agg'\n"
        "warnings.filterwarnings('ignore')\n"
        "try:\n"
        "    import matplotlib\n"
        "    matplotlib.use('Agg')\n"
        "    import matplotlib.pyplot as _plt\n"
        "    _plt.show = lambda *a, **kw: None\n"
        "except Exception:\n"
        "    pass\n\n"
    )
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".py", delete=False, encoding="utf-8"
    ) as tmp:
        tmp.write(preamble + code)
        tmp_path = tmp.name

    t0 = time.perf_counter()
    try:
        proc = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout_sec,
            env={**os.environ, "MPLBACKEND": "Agg", "PYTHONUTF8": "1"},
        )
        elapsed_ms = int((time.perf_counter() - t0) * 1000)
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip(), elapsed_ms
    except subprocess.TimeoutExpired:
        elapsed_ms = int((time.perf_counter() - t0) * 1000)
        return 124, "", f"TIMEOUT after {timeout_sec}s", elapsed_ms
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass


def verify_chapter(chapter_path: Path, print_outputs: bool = False) -> dict[str, Any]:
    chapter = load_chapter_via_tsx(chapter_path)
    ch_id = chapter.get("id", chapter_path.stem)
    ch_title = chapter.get("title", chapter_path.name)

    results: list[dict[str, Any]] = []
    failures: list[str] = []

    print(f"\n=== VERIFY PYTHON CODE: {ch_title} ({chapter_path.name}) ===", flush=True)

    tasks: list[tuple[str, int, dict[str, Any]]] = []
    for sub in chapter.get("subchapters", []):
        sub_id = sub.get("id", "?")
        for idx, ex in enumerate(sub.get("codeExamples", [])):
            if (ex.get("language") or "python").lower() == "python":
                tasks.append((sub_id, idx, ex))

    def eval_one(item: tuple[str, int, dict[str, Any]]) -> dict[str, Any]:
        sub_id, idx, ex = item
        ex_id = ex.get("id", f"{sub_id}-code-{idx+1}")
        code = ex.get("code", "")
        expected = ex.get("expectedOutput", "")
        runtime_badge = ex.get("runtimeBadge") or (
            "pyodide-ready" if idx < 2 else "production-env"
        )

        imports = extract_top_level_imports(code)
        non_pyodide = sorted(
            imp
            for imp in imports
            if imp not in STDLIB_MODULES and imp not in PYODIDE_THIRD_PARTY_ALLOWED
        )

        pyodide_violation = runtime_badge == "pyodide-ready" and len(non_pyodide) > 0
        rc, stdout, stderr, elapsed_ms = run_isolated_python(code, timeout_sec=60)

        missing_optional_pkg = (
            runtime_badge == "production-env"
            and rc != 0
            and "ModuleNotFoundError" in stderr
            and len(non_pyodide) > 0
        )

        fake_out = is_fake_output(expected)
        norm_actual = normalize_output_for_compare(stdout)
        norm_expected = normalize_output_for_compare(expected)
        output_matches = (not fake_out) and (norm_actual == norm_expected)

        status = "PASS"
        reasons: list[str] = []

        if pyodide_violation:
            status = "FAIL"
            reasons.append(f"Pyodide violation: non-Pyodide imports {non_pyodide}")

        if rc != 0 and not missing_optional_pkg:
            status = "FAIL"
            err_tail = (stderr.splitlines()[-1] if stderr else f"exit={rc}")
            reasons.append(f"Runtime error ({err_tail})")

        if fake_out:
            status = "FAIL"
            reasons.append("Fake/placeholder expectedOutput detected")
        elif rc == 0 and not output_matches:
            status = "FAIL"
            reasons.append("expectedOutput mismatch against real stdout")

        if missing_optional_pkg and not fake_out:
            status = "ENV_SKIP"
            reasons.append(f"Optional production package {non_pyodide} not installed locally")

        return {
            "subchapterId": sub_id,
            "codeId": ex_id,
            "runtimeBadge": runtime_badge,
            "status": status,
            "exitCode": rc,
            "elapsedMs": elapsed_ms,
            "nonPyodideImports": non_pyodide,
            "fakeOutput": fake_out,
            "outputMatches": output_matches,
            "stdout": stdout,
            "stderr": stderr,
            "reasons": reasons,
        }

    with ThreadPoolExecutor(max_workers=2) as pool:
        for res in pool.map(eval_one, tasks):
            tag = f"[{res['status']:8s}]"
            print(f"  {tag} {res['codeId']} ({res['runtimeBadge']}, {res['elapsedMs']}ms)", flush=True)
            for r in res["reasons"]:
                print(f"             -> {r}", flush=True)
            if print_outputs and res["exitCode"] == 0:
                print("    --- REAL STDOUT ---")
                for line in res["stdout"].splitlines():
                    print(f"    | {line}")
                print("    -------------------")
            if res["status"] == "FAIL":
                failures.append(f"{res['codeId']}: {'; '.join(res['reasons'])}")
            results.append(res)

    return {
        "chapterId": ch_id,
        "chapterFile": chapter_path.name,
        "totalChecked": len(results),
        "failedCount": len(failures),
        "failures": failures,
        "results": results,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify ML v5.0 Python code blocks.")
    parser.add_argument("--chapter", help="Chapter file name, stem, or path")
    parser.add_argument("--all", action="store_true", help="Verify all ML chapters")
    parser.add_argument(
        "--print-outputs",
        action="store_true",
        help="Print actual stdout for each runnable snippet",
    )
    parser.add_argument("--report", help="Optional path to save JSON report")
    args = parser.parse_args()

    files = resolve_chapter_files(args.chapter, args.all)
    reports = []
    total_checked = 0
    total_failed = 0

    for path in files:
        rep = verify_chapter(path, print_outputs=args.print_outputs)
        reports.append(rep)
        total_checked += rep["totalChecked"]
        total_failed += rep["failedCount"]

    print(
        f"\nSUMMARY: Checked {total_checked} Python code blocks across {len(files)} chapter(s). "
        f"Failed: {total_failed}."
    )

    if args.report:
        Path(args.report).write_text(json.dumps(reports, indent=2), encoding="utf-8")
        print(f"Saved report to {args.report}")

    return 0 if total_failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
