import json
import glob
import re

for ch_num in range(1, 14):
    fname = f"scripts/curriculum-generator/de_ch{ch_num}_data.json"
    try:
        with open(fname, "r", encoding="utf-8") as f:
            subs = json.load(f)
    except FileNotFoundError:
        continue
    
    for sub in subs:
        theory = sub.get("content", {}).get("theory", "")
        # Find block quotes or quotes enclosed in "" or > ""
        # Match quotes that look like academic citations or long English passages
        quotes = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', theory)
        for q in quotes:
            # check if it's an English quote (> 40 chars and has english words)
            if len(q) > 60 and any(w in q.lower() for w in [" we ", " the ", " in ", " of ", " this paper", " our ", " that "]):
                print(f"[{sub['id']}] {sub['title']}")
                print(f"LEN: {len(q)}")
                print(f"QUOTE: {q}")
                print("-" * 80)
