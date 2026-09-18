import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/curriculum-generator/cv_ch1_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} subchapters from cv_ch1_data.json:")
for sub in data:
    print(f"  {sub['id']}: {sub['title']}")
    print(f"    Expected output sample: {sub['expectedOutput'][:60]}...")
