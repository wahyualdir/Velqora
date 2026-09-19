import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for ch in range(14, 19):
    ch_m = re.search(rf'id:\s*["\']computer-vision-ch-{ch}["\'],\s*slug:\s*["\'][^"\']+["\'],\s*title:\s*["\']([^"\']+)["\']', text)
    title = ch_m.group(1) if ch_m else f"BAB {ch}"
    print(f"\n========================================================")
    print(f"{title}")
    print(f"========================================================")
    subs = re.findall(rf'id:\s*["\']computer-vision-ch{ch}-sub\d+["\'],\s*slug:\s*["\'][^"\']+["\'],\s*title:\s*["\']([^"\']+)["\']', text)
    for idx, s_title in enumerate(subs, 1):
        print(f"  {ch}.{idx}: {s_title}")
