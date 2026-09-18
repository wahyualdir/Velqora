import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

target_file = 'src/lib/curriculum/topics/08-computer-vision.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Locate Chunk 1 (Bab 1 to 5)
idx_ch1 = text.find('"computer-vision-ch-1"')
if idx_ch1 == -1:
    idx_ch1 = text.find('computer-vision-ch-1')
idx_ch6 = text.find('"computer-vision-ch-6"')
if idx_ch6 == -1:
    idx_ch6 = text.find('computer-vision-ch-6')
assert idx_ch1 != -1 and idx_ch6 != -1, "Boundary chapters not found!"

chunk1_text = text[idx_ch1:idx_ch6]

print("================================================================================")
print("AUDIT INTEGRITAS KONTEN: COMPUTER VISION CHUNK 1 (BAB 1-5)")
print("================================================================================\n")

# 1. Check for banned boilerplate phrases
banned_phrases = [
    "Status eksekusi: Komputasi berhasil dan output metrik valid.",
    "Pembahasan fokus mengenai",
    "Memastikan penguasaan mendalam terhadap aspek teoritis, batasan komputasi, dan teknik integrasi tingkat lanjut.",
    "Berikut adalah kode implementasi runnable yang memvalidasi konsep",
    "Skrip ini mengimplementasikan fungsi",
    "secara terstruktur dengan penanganan input dan komputasi metrik performa.",
    "Latihan Mandiri Berjenjang",
    "Level 1 (Pemahaman)",
    "Level 4 (Mini-Project)",
    "Menghindari manipulasi data tanpa validasi tipe dan batas nilai (*boundary checks*).",
    "TODO",
    "FIXME",
    "placeholder"
]

violations = []
for phrase in banned_phrases:
    count = chunk1_text.count(phrase)
    if count > 0:
        violations.append((phrase, count))

print(f"1. Audit Frasa Terlarang & Boilerplate Sintetis:")
if violations:
    print("   ❌ DITEMUKAN PELANGGARAN BOILERPLATE:")
    for p, c in violations:
        print(f"      - '{p}': {c} kemunculan")
else:
    print("   ✅ BERSIH 100%: 0 frasa terlarang / placeholder ditemukan.")

# 2. Check subchapters count
sub_ids = re.findall(r'"?id"?:\s*"computer-vision-ch[1-5]-sub\d+"', chunk1_text)
print(f"\n2. Jumlah Subbab Terdaftar:")
print(f"   Total Subbab Bab 1-5: {len(sub_ids)}/50 subbab")

# 3. Check code snippets count
code_ids = re.findall(r'"?id"?:\s*"computer-vision-ch[1-5]-sub\d+-code"', chunk1_text)
print(f"\n3. Jumlah Cuplikan Kode Terdaftar:")
print(f"   Total Cuplikan Kode: {len(code_ids)}/50 cuplikan")

# 4. Check word count & KaTeX markers
katex_inlines = len(re.findall(r'\$[^\$]+\$', chunk1_text))
katex_blocks = len(re.findall(r'\$\$[^\$]+\$\$', chunk1_text))
word_count = len(re.findall(r'\b\w+\b', chunk1_text))

print(f"\n4. Metrik Substantif & Matematika:")
print(f"   Total Kata Bab 1-5: {word_count:,} kata")
print(f"   Rumus KaTeX Inline ($...$): {katex_inlines} rumus")
print(f"   Rumus KaTeX Block ($$...$$): {katex_blocks} rumus")

# 5. Check references
refs = re.findall(r'"?id"?:\s*"src-cv-ch[1-5]-sub\d+-ref\d+"', chunk1_text)
print(f"\n5. Rujukan Sitasi Akademik Terdaftar:")
print(f"   Total Sitasi: {len(refs)} referensi terpetakan")

print("\n================================================================================")
if not violations and len(sub_ids) == 50 and len(code_ids) == 50:
    print("STATUS AUDIT: LULUS PENUH (100% SUBSTANTIF, ZERO BOILERPLATE)")
else:
    print("STATUS AUDIT: GAGAL")
    sys.exit(1)
print("================================================================================")
