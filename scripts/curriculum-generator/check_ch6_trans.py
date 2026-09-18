import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx6 = text.find('id: "computer-vision-ch-6"')
print("Surrounding text around Chapter 6 start:")
print(repr(text[idx6-60:idx6+60]))
