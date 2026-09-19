# -*- coding: utf-8 -*-
import re

with open('src/lib/curriculum/topics/22-natural-language-processing.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m14 = re.search(r'\{\s*id:\s*["\']natural-language-processing-ch-14["\']', text)
print('Bab 14 match index:', m14.start() if m14 else 'Not found')

# Cari kemunculan Bab 14 sampai 18
for ch in range(14, 19):
    pattern = r'\{\s*id:\s*["\']natural-language-processing-ch-' + str(ch) + r'["\']'
    m = re.search(pattern, text)
    print(f'Bab {ch} match index:', m.start() if m else 'Not found')

ch14_start = m14.start()
print('Characters before Bab 14:')
print(repr(text[ch14_start - 50:ch14_start + 50]))

