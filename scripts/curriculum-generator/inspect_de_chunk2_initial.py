import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

target_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src/lib/curriculum/topics/10-data-engineering-ai.ts"))

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

print("=== AUDIT AWAL BAB 6 - 9 TOPIK 10 ===")
for ch in range(6, 10):
    ch_id = f"data-engineering-ai-ch-{ch}"
    ch_pattern = r'id:\s*["\']' + ch_id + r'["\'],\s*slug:\s*["\']([^"\']+)["\'],\s*title:\s*["\']([^"\']+)["\']'
    m = re.search(ch_pattern, content)
    if m:
        print(f"\n=== Bab {ch}: {m.group(2)} ===")
    
    sub_pattern = r'id:\s*["\']data-engineering-ai-ch' + str(ch) + r'-sub(\d+)["\'],\s*slug:\s*["\']([^"\']+)["\'],\s*title:\s*["\']([^"\']+)["\']'
    subs = re.findall(sub_pattern, content)
    for s_idx, s_slug, s_title in subs:
        print(f"  10.{ch}.{s_idx}: {s_title}")

# Cek berapa yang sudah substantive-verified di Bab 6-9
ch6_to_9_start = content.find('"data-engineering-ai-ch-6"')
ch10_start = content.find('"data-engineering-ai-ch-10"')

chunk2_content = content[ch6_to_9_start:ch10_start]
verified_count = chunk2_content.count('"substantive-verified"')
print(f"\nTotal subbab berstatus 'substantive-verified' di Bab 6-9 saat ini: {verified_count}/40")
