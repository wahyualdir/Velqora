# Velqora — Technical & Pedagogical Limitations Report

**Document**: System Limitations, Architectural Boundaries, and Risk Register  
**Audit Date**: September 16, 2026  
**Status**: ACTIVE TECHNICAL SPECIFICATION

---

## 1. Executive Purpose

To maintain absolute academic honesty and technical integrity, this document explicitly records all known limitations, operational boundaries, and postponed capabilities of the Velqora platform following the Academic Module & Notebook Reader Rebuild. 

Velqora explicitly rejects unsubstantiated claims of universal completion. While the Data Science Chapter 1 pilot has attained gold standard status, the wider system operates within well-defined constraints.

---

## 2. Curriculum & Scope Limitations

### 2.1 Single-Chapter Gold Standard Coverage
- **Status**: Only **Topic 11 (Data Science), Chapter 1** (6 subchapters, 49 AST units, 7 execution groups) is currently migrated to the substantive academic notebook AST.
- **Ecosystem State**: The remaining 27 topics (comprising 372 chapters and 3,674 subchapters) are rendered via the backward-compatibility layer (`NoteRenderer`) using legacy markdown strings.
- **Pedagogical Gap**: Legacy subchapters lack `LessonFlow` specialization, structured variable tables, isolated execution provenance, and progressive exercise accordions.

### 2.2 Strict Batch 2 Implementation Lock
- **Status**: **READY FOR REVIEW ONLY**.
- **Scope**: AI Fundamentals (Topic 01) and Machine Learning Foundations (Topic 02).
- **Constraint**: Although the prerequisite DAG and chapter taxonomies have been designed and audited, **no code migration, unit authoring, or AST conversion may occur** without explicit stakeholder sign-off.

---

## 3. Computational Execution Limitations

### 3.1 Offline Subprocess Execution Model
- **Mechanism**: The 7 code snippets in the pilot are executed offline via `scripts/curriculum-generator/validate-notebook-code.py` running in an isolated Python 3.12.10 sub-process.
- **Limitation**: The frontend reader displays **pre-computed, verified execution outputs** with cryptographic machine signatures. It does **not** currently evaluate Python code in real-time within the client browser.
- **Roadmap Mitigation**: Evaluation of WebAssembly-based Python runtimes (Pyodide) or backend containerized execution sandboxes (gVisor/Firecracker) is reserved for Phase 4.

### 3.2 Dataset Scale Constraints
- **Subchapter 1.6**: Evaluates the 1990 California Housing census dataset (20,640 rows, 1.42 MB in memory).
- **Limitation**: In-memory exploratory analysis in the notebook is currently tailored for tabular data $< 50\text{ MB}$. Distributed out-of-core computing (e.g., Apache Spark, Dask) is discussed conceptually but not executed in-memory.

---

## 4. Assessment & Interactive Grading Limitations

### 4.1 Exercise Evaluation Model
- **Mechanism**: Exercises in the pilot feature multi-tier problem framing with interactive, collapsible accordions for hints, mathematical strategies, and canonical reference solutions.
- **Limitation**: There is no automated online judge or unit-test execution runner that dynamically parses, executes, and grades arbitrary student code submissions in the browser.
- **Pedagogical Role**: Current exercises function as self-directed formative assessments rather than summative automated exams.

---

## 5. Source Traceability Depth Limitations

### 5.1 Primary Source Granularity
- **Pilot Scope**: 100% of claims, equations, and code cells in Data Science Chapter 1 are mapped to specific chapter, section, and page numbers in primary literature.
- **Wider Curriculum**: The remaining 102 cataloged primary sources in `source-registry.ts` are mapped at the topic and chapter level (`SOURCE-LISTED`), but have not undergone granular, paragraph-by-paragraph academic audit.

---

## 6. Rendering & Aesthetic Boundaries

### 6.1 Mathematical Typesetting
- **Mechanism**: Formulas are rendered via KaTeX with variable glossaries.
- **Limitation**: KaTeX supports standard LaTeX math macros; dynamic commutative category theory diagrams (TikZ-CD) or WebGL interactive 3D visualizations are outside the current rendering pipeline scope.

---

## 7. Summary Risk & Mitigation Table

| Area | Limitation | Current Impact | Mitigation in Place | Target Milestone |
|---|---|---|---|:---:|
| **Curriculum** | 3,674 legacy subchapters unmigrated | High variance in content depth outside pilot | Robust fallback renderer (`NoteRenderer`) | Batches 2–5 |
| **Execution** | No client-side Python REPL | Output is static verified provenance | Execution evidence badge & exact stdout | Phase 4 (Pyodide) |
| **Grading** | Self-assessed exercises only | No automated grading feedback | Accordion hints & reference solutions | Phase 3 (Judge0) |
| **Sources** | Page mapping limited to pilot | Claims in legacy topics unverified | Clear status distinction (`SOURCE-LISTED`) | Batch migrations |
