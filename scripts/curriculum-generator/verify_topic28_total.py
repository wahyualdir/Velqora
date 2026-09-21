import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/28-vector-database-retrieval.ts', 'r', encoding='utf-8') as f:
    text = f.read()

verified = re.findall(r'"contentStatus": "substantive-verified"', text)
all_subs = re.findall(r'"id": "(vector-database-retrieval-ch\d+-sub\d+)"', text)
old_subs = re.findall(r'id:\s*"(vector-database-retrieval-ch\d+-sub\d+)"', text)

total_subs = len(all_subs) + len(old_subs)
print(f"Total Subbab di Topik 28: {total_subs}")
print(f"Substantive Verified: {len(verified)}/150 ({len(verified)/150*100:.1f}%)")
