with open('scripts/curriculum-generator/generate_cv_ch1.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace escaped triple quotes with single quotes inside snippets
text = text.replace(r'\"\"\"', "'''")

with open('scripts/curriculum-generator/generate_cv_ch1.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned escaped triple quotes in generate_cv_ch1.py.')
