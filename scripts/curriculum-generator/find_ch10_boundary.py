import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx6 = text.find('id: "computer-vision-ch-6"')
idx10 = text.find('id: "computer-vision-ch-10"')
idx10_brace = text.rfind('{', 0, idx10)

print(f"Chapter 6 start: {idx6}")
print(f"Chapter 10 start: {idx10}, brace at: {idx10_brace}")
print("Text before Chapter 10 brace:", repr(text[idx10_brace-30:idx10_brace+50]))
