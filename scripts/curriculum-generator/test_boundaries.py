import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    text = f.read()

ch1_marker = 'chapters: ['
ch6_marker = 'id: "computer-vision-ch-6"'

idx_ch1 = text.find(ch1_marker)
idx_ch6 = text.find(ch6_marker)

print("Index chapters: [ ->", idx_ch1)
print("Index Chapter 6 ->", idx_ch6)

# The preamble is text[:idx_ch1 + len(ch1_marker)]
preamble = text[:idx_ch1 + len(ch1_marker)]
print("Preamble ends with:", repr(preamble[-30:]))

# Find the start of Chapter 6 object '{' before idx_ch6
idx_ch6_brace = text.rfind('{', 0, idx_ch6)
print("Chapter 6 brace at:", idx_ch6_brace)
print("Text between preamble and Chapter 6 starts with:", repr(text[idx_ch1 + len(ch1_marker):idx_ch1 + len(ch1_marker) + 50]))
print("Text before Chapter 6 brace:", repr(text[idx_ch6_brace-20:idx_ch6_brace+50]))
