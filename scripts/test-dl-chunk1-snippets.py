# scripts/test-dl-chunk1-snippets.py
import re
import sys
import os

target_file = os.path.join(os.path.dirname(__file__), '../src/lib/curriculum/topics/12-deep-learning.ts')

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract code from JSON structure
# Find the start of JSON after '= {'
start_idx = content.find('= {') + 2
json_text = content[start_idx:content.rfind('}')+1]
import json
data = json.loads(json_text)

code_blocks = []
for ch in data['chapters']:
    for sub in ch['subchapters']:
        for ce in sub.get('codeExamples', []):
            code_blocks.append((sub['title'], ce['code']))

print(f"Total code snippets found in 12-deep-learning.ts: {len(code_blocks)}")

syntax_errors = []
for i, (title, code) in enumerate(code_blocks):
    try:
        compile(code, f"<snippet-{i+1}>", "exec")
    except SyntaxError as e:
        syntax_errors.append((i+1, title, str(e), code[:100]))

if syntax_errors:
    print(f"FAIL: Found {len(syntax_errors)} syntax errors!")
    for idx, title, err, preview in syntax_errors:
        print(f"Snippet {idx} ({title}): {err}\nPreview: {preview}\n")
    sys.exit(1)
else:
    print(f"SUCCESS: All {len(code_blocks)} code snippets passed Python 3 syntax compilation cleanly!")


