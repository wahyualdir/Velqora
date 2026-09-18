import os
import glob

brain_dir = r"C:\Users\ACER\.gemini\antigravity-ide\brain"
for root, dirs, files in os.walk(brain_dir):
    for f in files:
        if f.endswith('.jsonl') or f.endswith('.md'):
            fpath = os.path.join(root, f)
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                    if 'Korf' in content:
                        print(f"Found 'Korf' in: {fpath} (size: {len(content):,})")
            except Exception as e:
                pass
