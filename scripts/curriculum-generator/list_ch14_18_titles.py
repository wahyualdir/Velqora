import re

with open('src/lib/curriculum/topics/22-natural-language-processing.ts', 'r', encoding='utf-8') as f:
    content = f.read()

chapters = re.findall(r'id:\s*["\'](natural-language-processing-ch-(14|15|16|17|18))["\'],\s*slug:[^,]+,\s*title:\s*["\']([^"\']+)["\']', content)

for ch_id, ch_num, ch_title in chapters:
    print(f"\n=== {ch_title} ({ch_id}) ===")
    pattern = rf'id:\s*["\']{ch_id}["\'].*?(?=id:\s*["\']natural-language-processing-ch-\d+["\']|\Z)'
    m = re.search(pattern, content, re.DOTALL)
    if m:
        sub_titles = re.findall(r'title:\s*["\'](\d+\.\d+\.?\s*[^"\']+)["\']', m.group(0))
        for st in sub_titles:
            print(f"  - {st}")
