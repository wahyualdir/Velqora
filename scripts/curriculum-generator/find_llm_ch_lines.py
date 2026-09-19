import re

with open("src/lib/curriculum/topics/18-large-language-model.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for idx, line in enumerate(lines, start=1):
    if "id: \"large-language-model-ch-" in line or "BAB " in line:
        print(f"Line {idx}: {line.strip()}")
