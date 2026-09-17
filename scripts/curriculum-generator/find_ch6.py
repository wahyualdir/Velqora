with open('src/lib/curriculum/topics/05-ai-fundamentals.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id: "ai-fundamentals-ch-6"')
brace_idx = text.rfind('{', 0, idx)
end_idx = text.rfind('  ]\n};')
ch6_10 = text[brace_idx:end_idx].rstrip()
print('First 100 chars of ch6_10:\n', ch6_10[:100])
print('Last 100 chars of ch6_10:\n', ch6_10[-100:])
