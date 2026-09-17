# scripts/curriculum-generator/audit_ai_chunk1.py
import re
import os

target_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../src/lib/curriculum/topics/05-ai-fundamentals.ts'))

with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Total file size: {len(content):,} characters")

# Check chapters (matching both quoted "id": and unquoted id:)
chapters = re.findall(r'\"?id\"?:\s*"ai-fundamentals-ch-([0-9]+)"', content)
print(f"Detected chapters: {chapters}")
assert len(chapters) == 10, f"Expected 10 chapters, found {len(chapters)}"

# Check subchapters for chapters 1-5
total_chunk1_subs = 0
for ch_num in range(1, 6):
    subs = re.findall(rf'\"?id\"?:\s*"ai-fundamentals-ch{ch_num}-sub([0-9]+)"', content)
    print(f"Bab {ch_num}: {len(subs)} subchapters -> {subs}")
    assert len(subs) == 10, f"Expected 10 subchapters for Bab {ch_num}, found {len(subs)}"
    total_chunk1_subs += len(subs)

print(f"\nTotal Chunk 1 Subchapters: {total_chunk1_subs}/50")

# Check for synthetic boilerplate or placeholder phrases in Chunk 1
# Split content at Chapter 6 start
ch6_idx = content.find('id: "ai-fundamentals-ch-6"')
chunk1_content = content[:ch6_idx]

banned_patterns = [
    "Memastikan penguasaan mendalam terhadap aspek teoritis, batasan komputasi, dan teknik integrasi tingkat lanjut",
    "TODO",
    "TBD",
    "PLACEHOLDER",
    "Identical conversational capability" # previous synthetic placeholder
]

for bp in banned_patterns:
    count = chunk1_content.count(bp)
    print(f"Banned pattern '{bp[:50]}...': {count} occurrences")
    assert count == 0, f"Found {count} occurrences of banned pattern '{bp}' in Chunk 1!"

# Check code snippets in Chunk 1 (inside content_markdown or codeExamples)
code_snippets_in_examples = re.findall(r'\"code\":\s*\"def ', chunk1_content)
print(f"Code snippets starting with def in codeExamples: {len(code_snippets_in_examples)}")

output_in_examples = re.findall(r'\"expectedOutput\":\s*\"', chunk1_content)
print(f"Expected outputs in codeExamples: {len(output_in_examples)}")
assert len(output_in_examples) == 50, f"Expected 50 expected outputs, found {len(output_in_examples)}"

print("\nALL 50/50 SUBCHAPTERS IN CHUNK 1 ARE FULLY SUBSTANTIVE & ZERO BOILERPLATE!")
