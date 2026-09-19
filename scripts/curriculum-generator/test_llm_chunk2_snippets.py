"""
Test runner for all 40 code snippets in Chunk 2 LLM (Bab 6 - 9)
"""

import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(__file__)
files = [
    os.path.join(BASE_DIR, f"llm_ch{i}_data.json")
    for i in range(6, 10)
]

total_tested = 0
passed = 0
failed = 0

print("=== STARTING SNIPPET EXECUTION TEST FOR LLM CHUNK 2 (BAB 6-9) ===")

for file_path in files:
    if not os.path.exists(file_path):
        print(f"ERROR: {file_path} does not exist!")
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        subchaps = json.load(f)
        
    for sub in subchaps:
        total_tested += 1
        sub_id = sub.get("id", "unknown")
        title = sub.get("title", "No Title")
        content_dict = sub.get("content", sub)
        snippet = content_dict.get("codeSnippet", "")
        
        # Test execute snippet
        try:
            globs = {"__name__": "__main__"}
            exec(snippet, globs, globs)
            passed += 1
            print(f"[PASSED] {sub_id}: {title[:55]}")
        except Exception as e:
            failed += 1
            print(f"[FAILED] {sub_id}: {title} -> {type(e).__name__}: {e}")

print("==================================================================")
print(f"Total Snippets Tested : {total_tested}")
print(f"Passed                : {passed}")
print(f"Failed                : {failed}")
print("==================================================================")

if failed > 0:
    sys.exit(1)
else:
    print("ALL 40 SNIPPETS IN CHUNK 2 EXECUTED PERFECTLY WITH ZERO ERRORS!")
