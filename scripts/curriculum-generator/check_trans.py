import json

with open(r"C:\Users\ACER\.gemini\antigravity-ide\brain\e2bd74ab-7472-484e-98b1-4b69868e0b5e\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if i in range(58, 65):
            step = json.loads(line)
            t = step.get("type")
            c = str(step.get("content", ""))[:150]
            print(f"Step {i}: type={t} content={c}")
