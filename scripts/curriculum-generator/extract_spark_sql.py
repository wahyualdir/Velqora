import sys
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

reader = pypdf.PdfReader('spark_sql.pdf')
text = reader.pages[0].extract_text()
abstract_idx = text.find("ABSTRACT")
intro_idx = text.find("1. INTRODUCTION")
if abstract_idx != -1 and intro_idx != -1:
    print("=== EXACT ABSTRACT OF SPARK SQL (SIGMOD 2015) ===")
    print(text[abstract_idx:intro_idx].strip())
else:
    print(text[:1500])
