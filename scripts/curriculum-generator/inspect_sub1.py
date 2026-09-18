import re

with open('src/lib/curriculum/topics/05-ai-fundamentals.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect subchapters in Chapter 6
# Check one subchapter in Chapter 6, e.g., ai-fundamentals-ch6-sub1
sub1_match = re.search(r'id:\s*\"ai-fundamentals-ch6-sub1\"[\s\S]*?(?=id:\s*\"ai-fundamentals-ch6-sub2\"|$)', text)
if sub1_match:
    sub1_text = sub1_match.group(0)
    print("Length of sub1:", len(sub1_text))
    print("--- First 1500 chars of sub1 ---")
    print(sub1_text[:1500])
    print("--- Snippet around codeExamples in sub1 ---")
    ce_pos = sub1_text.find('codeExamples')
    if ce_pos != -1:
        print(sub1_text[ce_pos:ce_pos+1500])
    else:
        print("No codeExamples found!")
