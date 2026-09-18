with open('scripts/curriculum-generator/generate_cv_ch5.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('c5_1_md = """', 'c5_1_md = r"""')
text = text.replace('c5_2_md = """', 'c5_2_md = r"""')
text = text.replace('c5_3_md = """', 'c5_3_md = r"""')
text = text.replace('c5_4_md = """', 'c5_4_md = r"""')
text = text.replace('c5_5_md = """', 'c5_5_md = r"""')
text = text.replace('c5_6_md = """', 'c5_6_md = r"""')
text = text.replace('c5_7_md = """', 'c5_7_md = r"""')
text = text.replace('c5_8_md = """', 'c5_8_md = r"""')
text = text.replace('c5_9_md = """', 'c5_9_md = r"""')
text = text.replace('c5_10_md = """', 'c5_10_md = r"""')

# Also for pitfalls containing latex backslashes
text = text.replace('"Menghaluskan citra dari citra asli', 'r"Menghaluskan citra dari citra asli')
text = text.replace('"Mengabaikan blur bawaan', 'r"Mengabaikan blur bawaan')
text = text.replace('"Memilih nilai $k$ terlalu besar', 'r"Memilih nilai $k$ terlalu besar')
text = text.replace('"Mengabaikan titik pelana', 'r"Mengabaikan titik pelana')
text = text.replace('Pada skala titik kunci', 'r"Pada skala titik kunci')
text = text.replace('"Kelemahan fatal BRIEF', 'r"Kelemahan fatal BRIEF')

with open('scripts/curriculum-generator/generate_cv_ch5.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned raw strings in generate_cv_ch5.py.')
