import re

with open('src/lib/curriculum/topics/05-ai-fundamentals.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'id:\s*"(ai-fundamentals-ch-[0-9]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"', text)
for m in matches:
    print(m)
