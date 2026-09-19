# -*- coding: utf-8 -*-
"""
Perbaikan snippet Bab 11:
1. Menambahkan prefix raw string r\"\"\" pada setiap string snippet code
"""

import re

def fix_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Pastikan code_... = """ diganti menjadi code_... = r"""
    content = re.sub(r'(code_\d+_\d+\s*=\s*)"""', r'\1r"""', content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_file("scripts/curriculum-generator/generate_nlp_ch11.py")
