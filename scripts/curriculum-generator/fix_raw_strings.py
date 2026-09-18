with open('scripts/curriculum-generator/generate_cv_ch1.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('_code = """import', '_code = r"""import')

with open('scripts/curriculum-generator/generate_cv_ch1.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated generate_cv_ch1.py successfully.')
