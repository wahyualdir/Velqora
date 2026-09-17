import json

for i in range(1, 6):
    d = json.load(open(f'scripts/curriculum-generator/ai_ch{i}_data.json', encoding='utf-8'))
    print(f"=== Bab {i}: {d['title']} ({len(d['subchapters'])} subs) ===")
    for s in d['subchapters'][:3]:
        print(f"  [{s['id']}] {s['title']}")
    print(f"  ... and {len(d['subchapters']) - 3} more")
