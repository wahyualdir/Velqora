# -*- coding: utf-8 -*-
"""
Generator untuk Bab 2: Pra-pemrosesan Teks Klasik & Normalisasi Korpus (10 Subbab)
Topik: Natural Language Processing (22-natural-language-processing.ts)
"""

import os
import sys
import json
import io
import contextlib
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

def run_code_capture_output(code_str: str) -> str:
    f = io.StringIO()
    with contextlib.redirect_stdout(f):
        scope = {}
        exec(code_str, scope)
    return f.getvalue()

subchapters = []

# ==============================================================================
# Subbab 2.1: Segmentasi Kalimat (Sentence Boundary Disambiguation)
# ==============================================================================
code_2_1 = r'''import re

# Implementasi Disambiguasi Batas Kalimat (Sentence Boundary Disambiguation / SBD)
# Membedakan tanda titik (.) sebagai penutup kalimat vs singkatan gelar/angka (misal: "Dr.", "e.g.", "1.5")

sample_text = "Dr. Budi mengunjungi lab kecerdasan buatan pada pukul 08.30 WIB. Beliau menguji model NLP baru, e.g., BERT. Hasilnya memuaskan!"

def rule_based_sentence_segmenter(text):
    # Pola singkatan umum yang tidak mengakhiri kalimat
    honorifics = r'\b(Dr|Prof|Mr|Mrs|Ms|Jr|Sr|Ir|Drs)\.'
    abbreviations = r'\b(e\.g|i\.e|etc|vs)\.'
    
    # Ganti titik singkatan dengan placeholder sementara
    protected = re.sub(honorifics, r'\1<DOT>', text)
    protected = re.sub(abbreviations, r'\1<DOT>', protected)
    # Lindungi angka desimal atau jam (08.30)
    protected = re.sub(r'(\d+)\.(\d+)', r'\1<DOT>\2', protected)
    
    # Pecah kalimat pada tanda titik, tanda seru, atau tanda tanya yang diikuti spasi atau akhir baris
    raw_sentences = re.split(r'(?<=[.!?])\s+', protected)
    
    # Kembalikan tanda titik semula
    clean_sentences = [s.replace('<DOT>', '.') for s in raw_sentences if s.strip()]
    return clean_sentences

sentences = rule_based_sentence_segmenter(sample_text)

print("Hasil Segmentasi Batas Kalimat (Sentence Boundary Disambiguation):")
print("-" * 75)
for idx, sent in enumerate(sentences, start=1):
    print(f"Kalimat {idx}: \"{sent}\"")
print("-" * 75)
print(f"Total Kalimat Terdeteksi Tepat: {len(sentences)} kalimat (Titik pada 'Dr.', '08.30', dan 'e.g.' tidak memotong kalimat).")
'''

subchapters.append({
    "id": "nlp-2-1-sentence-boundary-disambiguation",
    "chapterId": "natural-language-processing-ch-2",
    "title": "Segmentasi Kalimat (Sentence Boundary Disambiguation): Heuristik Tanda Baca dan Model Klasifikasi Titik",
    "description": "Metodologi pemisahan batas kalimat: ambiguitas tanda titik pada singkatan dan angka, algoritma Punkt berbasis informasi mutual tak terawasi, dan model pemecah kalimat modern.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Langkah pertama dalam hampir semua pipeline pemrosesan bahasa alami adalah memecah teks paragraf panjang menjadi unit kalimat tersendiri (*Sentence Segmentation* atau *Sentence Boundary Disambiguation / SBD*). Tugas ini tampak sederhana bagi manusia, namun menyembunyikan kompleksitas komputasional yang tinggi akibat **ambiguitas tanda baca titik (`.`)**.\n\n"
            "Dalam teks ragam cetak, karakter titik menjalankan tiga fungsi ortografis yang berbeda secara simultan:\n"
            "1. **Penanda Akhir Kalimat (*Sentence Terminator*)**: Menandai batas akhir deklaratif yang memisahkan dua proposisi pemikiran mandiri.\n"
            "2. **Penanda Singkatan Leksikal (*Abbreviation Marker*)**: Digunakan pada gelar kehormatan (*Dr.*, *Prof.*, *Ir.*), singkatan frasa Latin (*e.g.*, *i.e.*, *etc.*), atau nama inisial (*J. K. Rowling*).\n"
            "3. **Titik Desimal & Format Waktu (*Numeric Formatting*)**: Digunakan dalam notasi angka mata uang, koordinat, dan waktu (*pukul 14.30*, *inflasi 3.5%*).\n\n"
            "Jika pemisahan kalimat dilakukan secara naif hanya dengan memotong teks pada setiap karakter titik (`text.split('.')`), kalimat akan terpotong secara keliru di tengah jalan, merusak masukan untuk modul tokenizer, parser sintaksis, dan model terjemahan mesin hilir.\n\n"
            "Dua pendekatan utama untuk menyelesaikan ambiguitas ini meliputi:\n"
            "- **Pendekatan Aturan & Ekspresi Reguler Terproteksi (*Rule-Based Regex*)**: Menggunakan daftar kata leksikal (*gazetteers*) gelar dan singkatan untuk melindungi titik non-kalimat sebelum proses pemisahan.\n"
            "- **Algoritma Punkt Tak Terawasi (*Unsupervised Punkt Algorithm*, Kiss & Strunk, 2006)**: Model statistik probabilistik yang mempelajari sendiri kata-kata singkatan dari korpus teks mentah menggunakan uji asosiasi informasi timbal balik (*log-likelihood ratio*), memeriksa kapitalisasi kata berikutnya, dan menghitung kemungkinan bersyarat bahwa sebuah token bertindak sebagai inisial atau penutup tuturan.\n\n"
            "Dalam pemodelan klasifikasi statistik modern, disambiguasi tanda titik diformulasikan sebagai estimasi probabilitas logistik biner: $P(y = 1 \\mid \\mathbf{x}) = \\sigma(\\mathbf{w}^T \\mathbf{x} + b) = \\frac{1}{1 + e^{-(\\mathbf{w}^T \\mathbf{x} + b)}}$, di mana vektor fitur $\\mathbf{x}$ merepresentasikan atribut leksikal token sekitar (panjang kata, kapitalisasi kata berikutnya, status singkatan dalam kamus), dan $y=1$ menandakan batas akhir kalimat sejati."
        ),
        "codeSnippet": code_2_1,
        "codeSnippetOutput": run_code_capture_output(code_2_1),
        "realWorldApplication": (
            "Diterapkan pada modul prapemrosesan dokumen hukum legal-tech (menangani singkatan pasal *UU No. 12 Th. 2011*), pemecah teks pada asisten baca Text-to-Speech (TTS) audiobook, dan segmentasi artikel berita pada sistem peringkasan otomatis."
        ),
        "commonPitfalls": [
            r"Memotong kalimat langsung menggunakan text.split('.') tanpa penanganan gelar dan angka, yang memecah kalimat seperti 'Dr. Sutomo lahir...' menjadi dua bagian tak bermakna.",
            r"Mengabaikan tanda baca akhir kalimat lainnya seperti tanda seru (!) dan tanda tanya (?) serta kombinasi elipsis bertitik tiga (...).",
            r"Kegagalan penanganan tanda petik penutup dialog (misal '\"Halo!\" serunya.') yang membuat tanda baca akhir berada di dalam kutipan."
        ],
        "caseStudy": (
            "Sebuah sistem ekstraksi putusan pengadilan memproses kalimat: 'Terdakwa terbukti melanggar Pasal 378 KUHP Jo. Pasal 55 ayat (1) ke-1 KUHP dengan kerugian Rp 1.500.000.000,00.' Rancang strategi ekspresi reguler dan leksikon proteksi untuk memastikan teks tersebut tetap terbaca sebagai satu kalimat tunggal yang utuh."
        ),
        "academicReferences": [
            r"Kiss, T., & Strunk, J. (2006). Unsupervised multilingual sentence boundary detection. Computational Linguistics, 32(4), 485-525.",
            r"Reynar, J. C., & Ratnaparkhi, A. (1997). A maximum entropy approach to identifying sentence boundaries. In Fifth Conference on Applied Natural Language Processing (pp. 16-19).",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 2.2: Tokenisasi Tingkat Kata (Word Tokenization)
# ==============================================================================
code_2_2 = r'''import re

# Komparasi Metode Tokenisasi Kata: White-space vs Regex Standar Penn Treebank
# Menguji kalimat dengan tanda baca melekat, kontraksi bahasa Inggris, dan tanda hubung

test_sentence = "Don't touch the cat's toy, it's high-tech!"

def whitespace_tokenize(text):
    return text.split()

def penn_treebank_regex_tokenize(text):
    # 1. Pisahkan kontraksi standar bahasa Inggris (n't -> not/n 't)
    text = re.sub(r"([a-zA-Z]+)n't", r"\1 n't", text)
    text = re.sub(r"([a-zA-Z]+)'s", r"\1 's", text)
    text = re.sub(r"([a-zA-Z]+)'m", r"\1 'm", text)
    text = re.sub(r"([a-zA-Z]+)'re", r"\1 're", text)
    # 2. Pisahkan tanda baca koma dan seru dari kata
    text = re.sub(r"([,!?])", r" \1 ", text)
    # 3. Tokenisasi spasi bersih
    return text.strip().split()

tokens_ws = whitespace_tokenize(test_sentence)
tokens_ptb = penn_treebank_regex_tokenize(test_sentence)

print("Komparasi Tokenisasi Tingkat Kata (Word Tokenization):")
print(f"Kalimat Input: \"{test_sentence}\"\n")
print(f"1. White-space Split: ({len(tokens_ws)} token)")
print(f"   {tokens_ws}")
print(f"\n2. Penn Treebank Regex: ({len(tokens_ptb)} token)")
print(f"   {tokens_ptb}")
print("\nPenn Treebank secara tepat memisahkan kontraksi gramatikal 'n't' dan tanda baca melekat.")
'''

subchapters.append({
    "id": "nlp-2-2-word-tokenization-standards",
    "chapterId": "natural-language-processing-ch-2",
    "title": "Tokenisasi Tingkat Kata (Word Tokenization): Standar Penn Treebank, Kontraksi, dan Tanda Baca",
    "description": "Prinsip pemisahan kata: batasan pemisahan spasi mentah, aturan tokenisasi Penn Treebank, penanganan klitik/kontraksi bahasa, dan pemisahan simbol ortografi.",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "Setelah teks dipecah menjadi kalimat, tahap inti berikutnya adalah **Tokenisasi Kata (*Word Tokenization*)**: membagi kalimat menjadi urutan unit leksikal terkecil yang memiliki status sintaksis atau semantik mandiri, yang disebut **Token**.\n\n"
            "Pada bahasa-bahasa Eropa dan rumpun Melayu-Polinesia (termasuk bahasa Indonesia), pemisahan kata secara naif sering dilakukan menggunakan spasi putih (*white-space split*). Namun, pemisahan berbasis spasi mentah memiliki kelemahan mendasar:\n"
            "1. **Tanda Baca Melekat (*Clitic Punctuation*)**: Tanda koma, titik dua, atau tanda petik akan menempel pada kata (misal `\"buku,\"` dan `\"buku\"` akan dianggap sebagai dua tipe kata yang berbeda dalam kamus).\n"
            "2. **Klitik dan Kontraksi Gramatikal (*Grammatical Clitics & Contractions*)**: Dalam bahasa Inggris, kata *\"don't\"* sebenarnya terdiri dari dua morfem gramatikal: kata kerja dasar *\"do\"* dan partikel negasi *\"not\"*. Menyatukan keduanya sebagai satu token membuat model sintaksis kesulitan memproses negasi secara konsisten.\n"
            "3. **Kata Majemuk Bertanda Hubung (*Hyphenated Compounds*)**: Kata seperti *\"high-tech\"*, *\"state-of-the-art\"*, atau reduplikasi bahasa Indonesia *\"anak-anak\"*, *\"berjalan-jalan\"* membutuhkan aturan leksikal khusus apakah dipertahankan sebagai satu token utuh atau dipecah.\n\n"
            "Standar de facto untuk tokenisasi kata bahasa Inggris dalam linguistik komputasional formal dirumuskan oleh **Penn Treebank Tokenizer**:\n"
            "- Kontraksi dipisahkan secara gramatikal: *can't* $\\to$ *ca* + *n't*; *they're* $\\to$ *they* + *'re*; *John's* $\\to$ *John* + *'s*.\n"
            "- Tanda baca koma, titik dua, kurung, dan tanda petik dipisahkan menjadi token individual mandiri.\n"
            "- Angka bertanda titik ribuan atau desimal dipertahankan sebagai satu token numerik utuh.\n\n"
            "Untuk bahasa tanpa spasi antar kata (seperti bahasa Mandarin, Jepang, dan Thai), tokenisasi kata tidak dapat menggunakan spasi sama sekali dan memerlukan segmentasi berbasis kamus dinamis atau model sekuensial probabilistik (seperti Jieba tokenizer berbasis HMM atau algoritma Viterbi)."
        ),
        "codeSnippet": code_2_2,
        "codeSnippetOutput": run_code_capture_output(code_2_2),
        "realWorldApplication": (
            "Menjadi fondasi subsistem parser mesin pencari teks, indexing Elasticsearch/Lucene, prapemrosesan korpus sebelum penghitungan N-gram, dan analisis frekuensi sentimen leksikon."
        ),
        "commonPitfalls": [
            r"Menggunakan split spasi mentah str.split() yang membiarkan tanda baca melekat, melipatgandakan ukuran kamus kosakata dengan entri duplikat yang bising.",
            r"Memecah kata reduplikasi penuh bahasa Indonesia (misal 'kupu-kupu') menjadi dua token terpisah ('kupu', '-', 'kupu') tanpa penanganan morfem ulang.",
            r"Menghapus simbol tanda baca tertentu yang membawa arti semantik kritis (misal ekspresi emotikon ':)' atau tanda tagar '#trend')."
        ],
        "caseStudy": (
            "Sebuah sistem pemantau percakapan media sosial menganalisis postingan: 'I didn't expect the co-founder's car to cost $45,000.50!'. Bandingkan keluaran token antara pemisahan spasi putih naif versus Penn Treebank tokenizer, dan jelaskan bagaimana penanganan angka dan kontraksi mempengaruhi kualitas ekstraksi entitas finansial."
        ),
        "academicReferences": [
            r"Marcus, M. P., Marcinkiewicz, M. A., & Santorini, B. (1993). Building a large annotated corpus of English: The Penn Treebank. Computational Linguistics, 19(2), 313-330.",
            r"Grefenstette, G., & Tapanainen, P. (1994). What is a word, What is a sentence? Problems of tokenization. In International Conference on New Methods in Language Processing.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 2.3: Case Folding & Normalisasi Karakter Unicode (NFC, NFD, NFKC, NFKD)
# ==============================================================================
code_2_3 = r'''import unicodedata

# Eksplorasi Bentuk Normalisasi Karakter Unicode: NFC, NFD, NFKC, NFKD
# Karakter beraksen: huruf 'e' dengan acute accent 'é'
# Bentuk 1: Precomposed (NFC) -> 1 kode titik U+00E9
# Bentuk 2: Decomposed (NFD)  -> 2 kode titik U+0065 ('e') + U+0301 (combining acute)

char_precomposed = "é"  # '\u00e9'
char_decomposed  = "e\u0301"

print("Uji Kesetaraan String Tanpa Normalisasi Unicode:")
print(f"Bentuk Precomposed (len={len(char_precomposed)}) == Decomposed (len={len(char_decomposed)}): {char_precomposed == char_decomposed}")

# Normalisasi ke Kanonikal NFC
norm_nfc_1 = unicodedata.normalize('NFC', char_precomposed)
norm_nfc_2 = unicodedata.normalize('NFC', char_decomposed)
print(f"Setelah Normalisasi NFC: norm_1 == norm_2: {norm_nfc_1 == norm_nfc_2} (Keduanya identik {len(norm_nfc_1)} karakter!)")

# Kompatibilitas NFKC: Mengonversi ligatur dan simbol matematika ke karakter standar
ligature_str = "ﬃ ﬁ ½" # ligatur 'ffi', 'fi', dan pecahan setengah
norm_nfkc = unicodedata.normalize('NFKC', ligature_str)
print(f"\nUji Normalisasi Kompatibilitas NFKC:")
print(f"String Asli: '{ligature_str}' (len={len(ligature_str)})")
print(f"Hasil NFKC : '{norm_nfkc}' (len={len(norm_nfkc)}) -> Ligatur terurai menjadi huruf ASCII standar!")
'''

subchapters.append({
    "id": "nlp-2-3-case-folding-unicode-normalization",
    "chapterId": "natural-language-processing-ch-2",
    "title": "Case Folding & Normalisasi Karakter Unicode: NFC, NFD, NFKC, NFKD dan Penanganan Aksara",
    "description": "Penyelarasan representasi biner teks: case folding peka bahasa, empat standar normalisasi Unicode Consortium, resolusi ligatur, dan eliminasi variasi glif tersembunyi.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Dalam ekosistem teks digital global, representasi string sering kali mengandung variasi representasi biner tersembunyi yang tampak identik di layar monitor bagi mata manusia (*visually identical*), namun memiliki urutan kode biner yang berbeda sama sekali dalam memori komputer. Tanpa normalisasi karakter yang ketat, mesin pencari dan model NLP akan memperlakukan dua kata yang tampak persis sama sebagai entitas yang berbeda.\n\n"
            "Dua pilar utama normalisasi karakter ortografis meliputi:\n"
            "1. **Case Folding (Konversi Huruf Kecil)**:\n"
            "   Mengubah seluruh karakter kapital menjadi huruf kecil (`str.lower()`). Meskipun bermanfaat besar untuk mereduksi redundansi kosakata pada tugas pencarian informasi dan klasifikasi topik umum (memetakan *\"Buku\"*, *\"BUKU\"*, dan *\"buku\"* ke satu entitas), case folding yang tidak hati-hati dapat menghilangkan fitur kritis pada tugas *Named Entity Recognition* (membedakan nama orang *\"Bush\"* dari semak belukar *\"bush\"*, atau nama sistem operasi *\"Windows\"* dari jendela rumah *\"windows\"*).\n\n"
            "2. **Standar Normalisasi Unicode (*Unicode Normalization Forms*)**:\n"
            "   Konsorsium Unicode mendefinisikan empat bentuk normalisasi formal berdasarkan dua jenis kesetaraan (*equivalence*):\n"
            "   - **Kesetaraan Kanonikal (*Canonical Equivalence*)**: Dua urutan karakter yang memiliki makna dan tampilan visual identik:\n"
            "     * **NFC (*Normalization Form C - Canonical Decomposition followed by Canonical Composition*)**: Menguraikan karakter komposit lalu menggabungkannya kembali ke bentuk precomposed tunggal (standar web W3C de facto).\n"
            "     * **NFD (*Normalization Form D - Canonical Decomposition*)**: Memisahkan karakter dasar dari tanda diakritiknya (misal huruf `é` dipecah menjadi `e` [U+0065] ditambah combining acute accent [U+0301]).\n"
            "   - **Kesetaraan Kompatibilitas (*Compatibility Equivalence*)**: Mengharmonisasikan karakter yang memiliki makna semantik dasar sama namun memiliki format tipografis berbeda:\n"
            "     * **NFKC / NFKD**: Menguraikan ligatur tipografi (seperti glif tunggal *'ﬁ'* diubah menjadi dua karakter terpisah *'f'* dan *'i'*), simbol pecahan (glif *'½'* diubah menjadi *'1/2'*), dan karakter berpangkat menjadi teks standar.\n\n"
            "Dalam pipeline pra-pelatihan model NLP modern, penerapan normalisasi NFKC merupakan standar wajib untuk membersihkan teks web (*web crawling*) dari sampah karakter tipografi khusus sebelum masuk ke tokenizer.\n\n"
            "Secara formal dalam aljabar relasi ekuivalensi, transformasi normalisasi kanonikal mendefinisikan pemetaan $f: \\mathcal{S} \\to \\mathcal{S}^*$ sedemikian rupa sehingga jika dua representasi string $s_1$ dan $s_2$ berada dalam kelas kesetaraan yang sama $[s]_{NFKC}$, maka berlaku kesamaan mutlak $f(s_1) = f(s_2)$, memastikan integritas perbandingan biner teks."
        ),
        "codeSnippet": code_2_3,
        "codeSnippetOutput": run_code_capture_output(code_2_3),
        "realWorldApplication": (
            "Diterapkan secara wajib pada pipeline pembersihan data web Common Crawl sebelum pra-pelatihan model fondasi (LLaMA, GPT), deduplikasi data profil pengguna, dan pencarian dokumen multibahasa internasional."
        ),
        "commonPitfalls": [
            r"Membandingkan dua string multibahasa secara langsung dengan operator == tanpa normalisasi Unicode sebelumnya (string dengan aksen dapat menghasilkan False meskipun terlihat identik).",
            r"Menerapkan case folding huruf kecil secara seragam tanpa memperhatikan aturan peka lokal (misal huruf 'I' kapital dalam bahasa Turki berubah menjadi huruf bertitik 'i' khusus alih-alih 'i' biasa).",
            r"Menggunakan NFKD secara ceroboh yang memecah tanda aksen bahasa Arab atau vokal tonal bahasa Mandarin sehingga merusak struktur fonetik bahasa aslinya."
        ],
        "caseStudy": (
            "Sebuah sistem autentikasi perbankan mendeteksi adanya serangan homoglyph spoofing di mana penyerang mendaftarkan username menggunakan huruf Cyrillic 'а' (U+0430) yang tampak 100% mirip dengan huruf Latin 'a' (U+0061). Rancang bagaimana modul normalisasi Unicode dan validasi rentang kode script mendeteksi penipuan identitas tersebut."
        ),
        "academicReferences": [
            r"Davis, M., & Whistler, K. (2023). Unicode Standard Annex# 15: Unicode Normalization Forms. Unicode Consortium.",
            r"Whistler, K. (2021). The Unicode Standard: A Technical Introduction. Unicode Consortium.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 2.4: Stopwords Removal: Analisis Dampak pada Klasifikasi vs Sekuensial
# ==============================================================================
code_2_4 = r'''import numpy as np

# Analisis Dampak Stopwords Removal pada Tugas Berbeda:
# Kasus 1: Klasifikasi Topik / IR -> Penghapusan stopwords menghemat memori tanpa merusak sinyal kata kunci
# Kasus 2: Question Answering / Sentiment -> Penghapusan stopwords merusak relasi sintaksis dan negasi

corpus_qa = "To be or not to be, that is the question."
stopwords = {"to", "be", "or", "not", "that", "is", "the"}

words_orig = corpus_qa.lower().replace(",", "").replace(".", "").split()
words_filtered = [w for w in words_orig if w not in stopwords]

print(f"Kalimat Asli Shakespeare: \"{corpus_qa}\"")
print(f"Token Awal ({len(words_orig)} kata)     : {words_orig}")
print(f"Setelah Stopwords Removal ({len(words_filtered)} kata): {words_filtered}")
print("-" * 75)
print("Peringatan Kritis: Pada kalimat di atas, 90% kata musnah dan hanya menyisakan ['question']!")
print("Penghapusan stopwords menghancurkan konteks negasi ('not') dan modalitas tuturan.")
'''

subchapters.append({
    "id": "nlp-2-4-stopwords-removal-impact-analysis",
    "chapterId": "natural-language-processing-ch-2",
    "title": "Stopwords Removal: Analisis Trade-off pada Tugas Kata Kunci vs Pemodelan Sekuensial",
    "description": "Kajian kritis kata henti berfrekuensi tinggi: fungsi gramatikal vs kandungan semantik, efisiensi indeks temu kembali informasi, dan degradasi makna pada model bahasa kontekstual.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "**Kata Henti (*Stopwords*)** merujuk pada kelas kata fungsional gramatikal tertutup (*closed-class function words*)—seperti artikel (*the*, *a*, *sebuah*), preposisi (*in*, *on*, *di*, *ke*), konjungsi (*and*, *or*, *dan*, *atau*), serta kata ganti (*it*, *they*, *dia*)—yang muncul dengan frekuensi kemunculan sangat tinggi di seluruh dokumen namun membawa beban semantik leksikal yang rendah secara mandiri.\n\n"
            "Dalam arsitektur pencarian informasi klasik (*Classical Information Retrieval*) dan model representasi Bag-of-Words/TF-IDF era 1990-an hingga 2000-an, **Penghapusan Stopwords (*Stopwords Removal*)** merupakan langkah prapemrosesan wajib karena dua alasan efisiensi perangkat keras:\n"
            "1. **Kompresi Indeks Terbalik (*Inverted Index Compression*)**: Menghapus 50–100 stopwords teratas memangkas ukuran indeks basis data pencarian hingga 30–40% dan menghemat bandwidth I/O disk secara masif.\n"
            "2. **Peningkatan Rasio Sinyal terhadap Derau (*Signal-to-Noise Ratio*)**: Pada klasifikasi topik dokumen panjang, keberadaan ribuan kata *'the'* atau *'yang'* hanya membebani memori tanpa membantu membedakan antara artikel olahraga dan artikel finansial.\n\n"
            "Namun, dalam lanskap NLP modern berbasis model sekuensial dan Transformer kontekstual (seperti BERT, GPT, dan T5), **penghapusan stopwords konvensional justru merupakan praktik buruk (*anti-pattern*) yang merusak kinerja**, karena:\n"
            "- **Penghancuran Relasi Sintaksis**: Mekanisme *Self-Attention* mengandalkan preposisi dan konjungsi untuk memetakan peran agen-objek dalam kalimat.\n"
            "- **Kehilangan Informasi Negasi Kritis**: Menghapus kata *'not'*, *'tidak'*, atau *'bukan'* membalikkan polaritas sentimen kalimat secara 180 derajat (*\"Kamera ini tidak bagus\"* $\\to$ menyisakan *\"kamera bagus\"*).\n"
            "- **Kerusakan Frasa Khas**: Judul karya terkenal seperti *\"To Be or Not To Be\"* akan kehilangan hampir seluruh katanya dan hanya menyisakan satu kata kosong."
        ),
        "codeSnippet": code_2_4,
        "codeSnippetOutput": run_code_capture_output(code_2_4),
        "realWorldApplication": (
            "Penghapusan stopwords masih dipertahankan pada mesin pencari kata kunci internal e-commerce untuk mempercepat pencarian katalog produk, namun dihilangkan total pada pipeline modern Question Answering, Terjemahan Mesin, dan Pemodelan Bahasa Generatif."
        ),
        "commonPitfalls": [
            r"Menghapus kata negasi ('tidak', 'bukan', 'no', 'not') dari daftar stopwords pada tugas analisis sentimen, yang mengubah ulasan negatif menjadi positif.",
            r"Menggunakan daftar stopwords bahasa Inggris standar untuk memproses korpus percakapan media sosial (kata slang fungsional penting ikut terhapus).",
            r"Menerapkan stopwords removal sebelum melatih embedding Transformer seperti BERT, yang merusak struktur posisi urutan kalimat."
        ],
        "caseStudy": (
            "Sebuah sistem filter email komersial mengalami kegagalan mendeteksi instruksi transfer dana: 'Transfer the funds to John, not to Mike.' Jelaskan bagaimana modul penghapusan stopwords naif menyebabkan sistem mengeksekusi transfer ke pihak yang salah."
        ),
        "academicReferences": [
            r"Wilbur, W. J., & Sirotkin, K. (1992). The significance of stop words in information retrieval. Information processing & management, 28(1), 45-58.",
            r"Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to information retrieval. Cambridge university press.",
            r"Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2018). Bert: Pre-training of deep bidirectional transformers for language understanding. arXiv preprint arXiv:1810.04805."
        ]
    }
})

# ==============================================================================
# Subbab 2.5: Morfologi Bahasa & Stemming (Porter & Lancaster)
# ==============================================================================
code_2_5 = r'''import re

# Implementasi Simulasi Aturan Pemotongan Sufiks Porter Stemmer (Step 1a & Step 1b)
# Martin Porter (1980): Aturan transformasi berurutan berbasis pola konsonan-vokal

def simplified_porter_stemmer(word):
    w = word.lower()
    # Step 1a: Penanganan plural dan 'ss'
    if w.endswith("sses"):
        w = w[:-2] # sses -> ss
    elif w.endswith("ies"):
        w = w[:-2] # ies -> i
    elif w.endswith("ss"):
        pass       # ss -> ss (tetap)
    elif w.endswith("s"):
        w = w[:-1] # s -> kosong
        
    # Step 1b: Penanganan 'eed', 'ed', 'ing'
    if w.endswith("eed"):
        if len(w[:-3]) > 1:
            w = w[:-1] # eed -> ee
    elif w.endswith("ed"):
        stem = w[:-2]
        if any(c in "aeiou" for c in stem):
            w = stem
    elif w.endswith("ing"):
        stem = w[:-3]
        if any(c in "aeiou" for c in stem):
            w = stem
            
    return w

test_words = ["caresses", "ponies", "cats", "feed", "agreed", "plastered", "singing"]
stems = [simplified_porter_stemmer(w) for w in test_words]

print("Simulasi Pemotongan Morfologis Porter Stemmer:")
print("-" * 55)
print(f"{'Kata Asli':<18} | {'Hasil Stemming Porter':<20}")
print("-" * 55)
for orig, st in zip(test_words, stems):
    print(f"{orig:<18} | {st:<20}")
print("-" * 55)
print("Karakteristik Stemming: Beroperasi secara heuristik tanpa kamus kosakata baku.")
'''

subchapters.append({
    "id": "nlp-2-5-stemming-porter-lancaster",
    "chapterId": "natural-language-processing-ch-2",
    "title": "Morfologi Bahasa & Stemming: Algoritma Porter, Lancaster, dan Sifat Heuristik Rule-Based",
    "description": "Normalisasi bentuk dasar morfologi kata: kaidah kondisional konsonan-vokal Porter Stemmer (1980), agresivitas Lancaster Stemmer, serta patologi over-stemming dan under-stemming.",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "Dalam komunikasi tertulis, sebuah konsep dasar (*root lemma*) sering kali muncul dalam beragam variasi morfologis infleksional dan derivasional (misalnya kata bahasa Inggris: *connect*, *connected*, *connecting*, *connection*, *connections*). Untuk tujuan pencarian dokumen dan pereduksian dimensi ruang fitur, kita ingin memetakan seluruh variasi bentuk tersebut ke dalam satu representasi dasar bersama.\n\n"
            "**Stemming** adalah teknik heuristik berbasis aturan yang secara langsung memotong (*chops off*) afiks akhiran (sufiks) dan awalan (prefiks) dari kata tanpa memeriksa kamus bahasa resmi. Output dari stemmer disebut **Stem**, yang sering kali bukan merupakan kata riil yang sah secara tata bahasa (misal kata *university* dipotong menjadi *univers*).\n\n"
            "Algoritma stemming paling berpengaruh dalam sejarah ilmu komputer dirancang oleh **Martin F. Porter** (1980), dikenal sebagai **Porter Stemmer**. Algoritma Porter membagi struktur kata menjadi deretan konsonan $C$ dan vokal $V$ dalam bentuk $[C](VC)^m[V]$, di mana integer $m$ disebut sebagai **measure** (panjang kompleksitas kata). Algoritma berjalan dalam 5 tahapan berurutan (*cascading phases*), di mana setiap aturan menerapkan syarat batas panjang $m$:\n"
            "- Aturan 1a: `SSES -> SS` (*caresses* $\\to$ *caress*); `IES -> I` (*ponies* $\\to$ *poni*).\n"
            "- Aturan 1b: `(*v*) ING -> kosong` jika bagian akar mengandung vokal (*motoring* $\\to$ *motor*, namun *sing* tidak berubah karena tanpa vokal tersisa).\n"
            "- Aturan 2 hingga 5: Menangani sufiks derivasional kompleks seperti *-tional* $\\to$ *-tion*, *-izer* $\\to$ *-ize*, dan *-al* $\\to$ kosong.\n\n"
            "Algoritma alternatif yang lebih agresif adalah **Lancaster (Paice-Husk) Stemmer**, yang menerapkan aturan pemotongan iteratif tanpa syarat measure yang ketat, menghasilkan stem yang jauh lebih pendek namun rentan terhadap dua kesalahan klasik stemming:\n"
            "1. **Over-stemming**: Terlalu agresif memotong kata sehingga dua kata dengan makna berbeda disatukan secara keliru (misal kata *policy* dan *police* keduanya dipotong menjadi *polic*).\n"
            "2. **Under-stemming**: Terlalu konservatif memotong sehingga kata dengan makna sama gagal dipetakan ke akar yang sama (misal *adhere* dan *adhesion* menghasilkan stem berbeda)."
        ),
        "codeSnippet": code_2_5,
        "codeSnippetOutput": run_code_capture_output(code_2_5),
        "realWorldApplication": (
            "Digunakan secara luas pada modul indexing mesin pencari perpustakaan digital, pemilah dokumen arsip paten, dan sistem deteksi plagiarisme karya tulis ilmiah."
        ),
        "commonPitfalls": [
            r"Mengasumsikan output stemming selalu berupa kata kamus baku yang valid (banyak stemmer menghasilkan bentuk terpancung aneh seperti 'organ' dari 'organization').",
            r"Menerapkan Porter Stemmer bahasa Inggris untuk memproses teks bahasa Indonesia (bahasa Indonesia memerlukan stemmer afiks khusus seperti algoritma Nazief-Adriani atau Tala).",
            r"Mengabaikan dampak over-stemming yang merusak presisi pencarian (misal mencari 'kebijakan' [policy] tapi memunculkan dokumen 'polisi' [police])."
        ],
        "caseStudy": (
            "Diberikan kumpulan kata: ['organization', 'organ', 'organic', 'organize']. Tunjukkan bagaimana pemotongan heuristik Porter Stemmer dan Lancaster Stemmer memproses keempat kata tersebut, dan evaluasi apakah terjadi over-stemming antara istilah biologi dan manajemen."
        ),
        "academicReferences": [
            r"Porter, M. F. (1980). An algorithm for suffix stripping. Program, 14(3), 130-137.",
            r"Paice, C. D. (1990). Another stemmer. ACM SIGIR Forum, 24(3), 56-61.",
            r"Adriani, M., Asian, J., Nazief, B., Tahaghoghi, S. M., & Williams, H. E. (2007). Stemming Indonesian: A confix-stripping approach. ACM Transactions on Asian Language Information Processing (TALIP), 6(4), 13-es."
        ]
    }
})

# ==============================================================================
# Subbab 2.6: Lemmatisasi Berbasis Kosakata & Part-of-Speech (POS)
# ==============================================================================
code_2_6 = r'''import numpy as np

# Komparasi Fundamental: Stemming vs Lemmatization
# Stemming memotong sufiks secara buta aturan (Heuristik)
# Lemmatization memanfaatkan kamus leksikal baku + konteks Part-of-Speech (Linguistik)

sample_tokens = [
    {"word": "better",  "pos": "a", "arti": "adjektiva"},
    {"word": "running", "pos": "v", "arti": "verba"},
    {"word": "meeting", "pos": "n", "arti": "nomina"},
    {"word": "was",     "pos": "v", "arti": "verba"}
]

# Kamus pemetaan lema terkalibrasi Morphy WordNet
mock_lemmatizer_lookup = {
    ("better", "a"): "good",
    ("running", "v"): "run",
    ("meeting", "n"): "meeting", # Nomina tetap meeting (rapat), bukan verba meet (bertemu)
    ("was", "v"): "be"
}

# Heuristik pemotongan stemmer sederhana
mock_stemmer_lookup = {
    "better": "better",
    "running": "run",
    "meeting": "meet", # Kesalahan over-stemming: mereduksi rapat menjadi bertemu
    "was": "wa"        # Kesalahan fatal pemotongan bentuk tidak beraturan
}

print("Analisis Komparatif Stemming vs Lemmatization Berbasis POS:")
print("-" * 75)
print(f"{'Kata Asli':<12} | {'POS Tag':<8} | {'Hasil Stemming':<18} | {'Hasil Lemmatisasi':<18}")
print("-" * 75)
for item in sample_tokens:
    w, p = item["word"], item["pos"]
    stem_res = mock_stemmer_lookup[w]
    lemma_res = mock_lemmatizer_lookup.get((w, p), w)
    print(f"{w:<12} | {p:<8} | {stem_res:<18} | {lemma_res:<18}")
print("-" * 75)
print("Lemmatisasi berhasil mengembalikan bentuk kamus baku 'good' dari 'better' dan 'be' dari 'was'!")
'''

subchapters.append({
    "id": "nlp-2-6-lemmatization-pos-morphy",
    "chapterId": "natural-language-processing-ch-2",
    "title": "Lemmatisasi Berbasis Kosakata & POS: Morphy WordNet dan Perbedaan Mendasar Terhadap Stemming",
    "description": "Normalisasi bentuk kanonikal leksikal: lematisasi berbasis analisis morfologi leksikon, peranan label Part-of-Speech, dan keunggulan terhadap pemotongan sufiks buta.",
    "estimatedMinutes": 35,
    "order": 6,
    "content": {
        "theory": (
            "Meskipun stemming cepat secara komputasi, hasil pemotongannya yang kasar sering kali menghasilkan string yang tidak bermakna secara leksikal. Alternatif yang jauh lebih presisi dan berstandar linguistik adalah **Lemmatisasi (*Lemmatization*)**.\n\n"
            "Lemmatisasi adalah proses pemetaan sebuah kata yang mengalami infleksi ke dalam bentuk kanonikal dasarnya yang sah secara kamus, yang disebut **Lema (*Lemma*)**. Perbedaan fundamental antara kedua teknik ini mencakup:\n"
            "1. **Ketergantungan Kamus dan Aturan Morfologis**: Stemmer hanya mengandalkan aturan pemotongan akhiran berbasis string tanpa mengetahui apakah kata tersebut benar-benar ada di dalam bahasa. Sebaliknya, lemmatizer mengandalkan basis data leksikal lengkap (seperti kamus WordNet Morphy) dan tabel pengecualian bentuk tak beraturan (*irregular forms*).\n"
            "2. **Sensitivitas Kategori Tata Bahasa (*Part-of-Speech Awareness*)**: Sebuah kata yang sama dapat memiliki lema yang berbeda total bergantung pada fungsinya dalam kalimat. Sebagai contoh:\n"
            "   - Kata *\"meeting\"* sebagai nomina (Noun: *\"The morning meeting\"*) memiliki lema tetap *\"meeting\"* (sebuah rapat).\n"
            "   - Kata *\"meeting\"* sebagai verba (Verb: *\"They are meeting today\"*) memiliki lema dasar *\"meet\"* (bertemu).\n"
            "   Stemmer akan memotong keduanya secara seragam menjadi *\"meet\"*, yang mengaburkan makna entitas nomina rapat.\n"
            "3. **Penanganan Infleksi Tak Beraturan (*Irregular Inflection Handling*)**:\n"
            "   Pada kata kerja tak beraturan bahasa Inggris seperti *\"saw\"*, *\"went\"*, *\"was\"*, atau bentuk superlatif *\"better\"*:\n"
            "   - Stemmer gagal total: *\"saw\"* $\\to$ *\"saw\"*, *\"was\"* $\\to$ *\"wa\"*, *\"better\"* $\\to$ *\"better\"*.\n"
            "   - Lemmatizer berbasis POS berhasil memetakan secara tepat: *\"saw\"* (V) $\\to$ *\"see\"*, *\"went\"* (V) $\\to$ *\"go\"*, *\"was\"* (V) $\\to$ *\"be\"*, dan *\"better\"* (Adj) $\\to$ *\"good\"*.\n\n"
            "Konsekuensi dari presisi tinggi ini adalah kebutuhan komputasi yang lebih berat: lemmatizer membutuhkan proses penandaan kelas kata (*POS tagging*) sebelumnya dan pencarian tabel kamus yang meningkatkan latensi pemrosesan korpus."
        ),
        "codeSnippet": code_2_6,
        "codeSnippetOutput": run_code_capture_output(code_2_6),
        "realWorldApplication": (
            "Wajib digunakan pada sistem ekstraksi informasi medis dan farmasi (memetakan variasi bentuk obat dan gejala klinis), analisis sentimen opini konsumen tingkat lanjut, dan pembuatan korpus leksikografi komputasional."
        ),
        "commonPitfalls": [
            r"Menjalankan lemmatizer tanpa menyertakan argumen POS tag (sebagian besar lemmatizer seperti WordNetLemmatizer di NLTK mengasumsikan kata sebagai Nomina secara default jika POS tidak diberikan, sehingga 'running' gagal diubah menjadi 'run').",
            r"Biaya komputasi lemmatisasi yang jauh lebih lambat dibandingkan stemming jika diterapkan pada triliunan token teks streaming.",
            r"Ketidakmampuan lemmatizer menangani kata-kata baru atau salah ketik yang tidak terdaftar dalam kamus leksikon acuan."
        ],
        "caseStudy": (
            "Sebuah mesin pencari dokumen hukum menganalisis kalimat: 'The court saw evidence that the company had been better managed.' Bandingkan hasil representasi leksikal yang diproduksi oleh Porter Stemmer versus POS-Aware Lemmatizer, dan jelaskan dampaknya terhadap penemuan korelasi kata 'see' dan 'good'."
        ),
        "academicReferences": [
            r"Miller, G. A. (1995). WordNet: a lexical database for English. Communications of the ACM, 38(11), 39-41.",
            r"Plisson, J., Ljubič, P., Stefanowski, J., & Lavrač, N. (2004). A constrained approach to lemmatisation. In International Multi-Conference on Information Society.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University."
        ]
    }
})

# ==============================================================================
# Subbab 2.7: Tokenisasi Subkata (Subword Tokenization) - BPE (Spot-Check Sennrich 2016)
# ==============================================================================
code_2_7 = r'''import re
from collections import Counter, defaultdict

# Implementasi Algoritma Pelatihan Byte-Pair Encoding (BPE, Sennrich et al., ACL 2016)
# Menggabungkan pasangan karakter berfrekuensi tertinggi secara iteratif

def get_pair_frequencies(vocab):
    pairs = defaultdict(int)
    for word, freq in vocab.items():
        symbols = word.split()
        for i in range(len(symbols) - 1):
            pairs[(symbols[i], symbols[i+1])] += freq
    return pairs

def merge_vocab(pair, vocab_in):
    vocab_out = {}
    bigram = re.escape(' '.join(pair))
    pattern = re.compile(r'(?<!\S)' + bigram + r'(?!\S)')
    replacement = ''.join(pair)
    for word in vocab_in:
        word_out = pattern.sub(replacement, word)
        vocab_out[word_out] = vocab_in[word]
    return vocab_out

# Korpus inisialisasi: setiap kata dipecah menjadi karakter + penanda akhir kata '</w>'
raw_vocab = {
    "l o w </w>": 5,
    "l o w e r </w>": 2,
    "n e w e s t </w>": 6,
    "w i d e s t </w>": 3
}

print("Inisialisasi Kosakata Karakter BPE Awal:")
for w, f in raw_vocab.items():
    print(f"  {w:<20}: frekuensi {f}")

# Jalankan 5 iterasi merge BPE
current_vocab = raw_vocab.copy()
merges_history = []

for iteration in range(1, 6):
    pairs = get_pair_frequencies(current_vocab)
    if not pairs:
        break
    best_pair = max(pairs, key=pairs.get)
    current_vocab = merge_vocab(best_pair, current_vocab)
    merges_history.append((best_pair, pairs[best_pair]))

print("\nRiwayat 5 Operasi Penggabungan Pasangan BPE Teratas (Merge Rules):")
for idx, (pair, count) in enumerate(merges_history, start=1):
    print(f"Merge #{idx}: Pasangan ('{pair[0]}', '{pair[1]}') digabung -> '{''.join(pair)}' (Frekuensi: {count})")

print("\nKosakata Hasil Segmentasi Subkata Akhir:")
for w, f in current_vocab.items():
    print(f"  {w:<20}: frekuensi {f}")
print("BPE berhasil mengompresi karakter menjadi unit subkata bermakna seperti 'est</w>' dan 'low'!")
'''

subchapters.append({
    "id": "nlp-2-7-subword-tokenization-bpe",
    "chapterId": "natural-language-processing-ch-2",
    "title": "Tokenisasi Subkata (Subword Tokenization): Algoritma Byte-Pair Encoding (BPE)",
    "description": "Revolusi representasi teks neural: algoritma kompresi BPE (Sennrich et al., ACL 2016), eliminasi masalah OOV, dan penyelarasan unit subkata multi-bahasa.",
    "estimatedMinutes": 40,
    "order": 7,
    "content": {
        "theory": (
            "Salah satu inovasi paling transformatif yang memungkinkan lahirnya model bahasa raksasa modern (seperti GPT, RoBERTa, dan LLaMA) adalah pengenalan **Tokenisasi Subkata (*Subword Tokenization*)**. Sebelum 2016, model NLP terperangkap dalam dikotomi biner yang merugikan: tokenisasi berbasis kata penuh (*word-level*) menderita masalah kosakata tak terhingga (*Out-Of-Vocabulary / OOV*) dan ledakan parameter embedding, sementara tokenisasi berbasis karakter murni (*character-level*) menghasilkan sekuens yang terlalu panjang dan representasi semantik yang sangat lemah.\n\n"
            "Rico Sennrich, Barry Haddow, dan Alexandra Birch (*University of Edinburgh*, ACL 2016) memecahkan kebuntuan ini dalam makalah seminal *'Neural Machine Translation of Rare Words with Subword Units'* dengan mengadaptasi algoritma kompresi data klasik **Byte-Pair Encoding (BPE)** (Gage, 1994) untuk tugas segmentasi teks bahasa alami.\n\n"
            "Algoritma pelatihan BPE beroperasi secara deterministik dan sepenuhnya berbasis data (*unsupervised data-driven*):\n"
            "1. **Inisialisasi Kosakata Simbol**: Kosakata dasar $V$ diinisialisasi murni dengan himpunan seluruh karakter individual yang muncul dalam korpus pelatihan, ditambah simbol khusus penanda batas akhir kata (misal `</w>` atau spasi prefiks `Ġ` pada GPT).\n"
            "2. **Pencacahan Frekuensi Pasangan Simbol**: Algoritma memindai seluruh korpus dan menghitung frekuensi kemunculan setiap pasangan simbol bertetangga $(c_i, c_{i+1})$.\n"
            "3. **Penggabungan Iteratif (*Iterative Merge Operation*)**: Pasangan simbol dengan frekuensi kemunculan tertinggi $(\\text{symbol}_A, \\text{symbol}_B)$ dipilih dan digabungkan menjadi satu simbol baru $\\text{symbol}_{AB}$, yang kemudian ditambahkan ke dalam kamus kosakata $V$.\n"
            "4. **Pengulangan**: Langkah 2 dan 3 diulang sebanyak $k$ kali iterasi (di mana jumlah operasi *merge* $k$ adalah satu-satunya hiperparameter utama algoritma).\n\n"
            "Ukuran kamus akhir tepat bernilai $|V| = |V_{\\text{karakter awal}}| + k$. Keunggulan revolusioner dari BPE mencakup:\n"
            "- **Bebas Masalah OOV Secara Total (*Zero Out-Of-Vocabulary*)**: Kata-kata yang sering muncul (seperti *\"the\"* atau *\"learning\"*) akan digabungkan menjadi token utuh, sedangkan kata-kata langka, istilah teknis asing, atau salah ketik (seperti *\"unconstitutional\"* atau *\"supercalifragilistic\"*) akan secara otomatis dipecah menjadi unit-unit morfem subkata penyusunnya (*\"un\"*, *\"constitut\"*, *\"ional\"*) atau bahkan ke tingkat karakter individual jika benar-benar belum pernah teramati.\n"
            "- **Pemberian Makna Morfologis Transparan**: Model mampu memahami arti kata baru dari unit subkata penyusunnya secara alami."
        ),
        "codeSnippet": code_2_7,
        "codeSnippetOutput": run_code_capture_output(code_2_7),
        "realWorldApplication": (
            "Diterapkan secara universal sebagai tokenizer utama pada seluruh keluarga arsitektur GPT OpenAI (BPE berbasis byte), RoBERTa, LLaMA, Mistral, dan Whisper untuk transkripsi bicara multi-bahasa."
        ),
        "commonPitfalls": [
            r"Lupa menyertakan karakter batas akhir kata (seperti </w>), yang menyebabkan tokenizer tidak mampu membedakan apakah sebuah subkata berada di tengah kata atau di akhir kata.",
            r"Menyetel jumlah merge operations k terlalu kecil (menghasilkan representasi karakter pendek yang boros komputasi) atau terlalu besar (mendekati word-level yang memicu ukuran memori embedding meledak).",
            r"Mengabaikan penanganan spasi konsisten saat membalikkan tokenisasi kembali ke teks asli (detokenization)."
        ],
        "caseStudy": (
            "Diberikan korpus kecil dengan frekuensi kata: {'low': 5, 'lower': 2, 'newest': 6, 'widest': 3}. Tunjukkan langkah-demi-langkah 3 operasi merge BPE pertama, dan jelaskan bagaimana kata baru yang belum pernah muncul saat pelatihan ('lowest') disegmentasikan secara mulus oleh kosakata subkata yang terbentuk."
        ),
        "academicReferences": [
            r"Sennrich, R., Haddow, B., & Birch, A. (2016). Neural machine translation of rare words with subword units. In Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers) (pp. 1715-1725).",
            r"Gage, P. (1994). A new algorithm for data compression. The C Users Journal, 12(2), 23-38.",
            r"Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., & Sutskever, I. (2019). Language models are unsupervised multitask learners. OpenAI blog, 1(8), 9."
        ]
    }
})

# ==============================================================================
# Subbab 2.8: WordPiece & Unigram Language Model Tokenization (SentencePiece)
# ==============================================================================
code_2_8 = r'''import numpy as np

# Komparasi Mekanisme Pembentukan Kosakata Subkata:
# 1. BPE: Memilih pasangan dengan FREKUENSI KEMUNCULAN absolut tertinggi (count-based greedy)
# 2. WordPiece (Schuster & Nakajima 2012 / BERT): Memilih pasangan yang MEMAKSIMALKAN LIKELIHOOD model bahasa
#    Skor Skor = count(AB) / (count(A) * count(B)) (Mirip Pointwise Mutual Information)

def wordpiece_score(count_ab, count_a, count_b):
    # Skor asosiasi WordPiece: memprioritaskan pasangan yang sering muncul bersama
    # relatif terhadap frekuensi individualnya
    if count_a == 0 or count_b == 0:
        return 0.0
    return count_ab / (count_a * count_b)

# Simulasi 2 pasang kandidat penggabungan:
# Pasangan 1: ('de', 'ep') -> count(de)=50, count(ep)=10, count(deep)=10
# Pasangan 2: ('th', 'e')  -> count(th)=500, count(e)=2000, count(the)=400

score_deep = wordpiece_score(count_ab=10, count_a=50, count_b=10)
score_the  = wordpiece_score(count_ab=400, count_a=500, count_b=2000)

print("Komparasi Skor Seleksi Pasangan Subkata (BPE vs WordPiece):")
print(f"Kandidat A: ('de', 'ep') -> Frekuensi Bersama = 10  | Skor WordPiece = {score_deep:.6f}")
print(f"Kandidat B: ('th', 'e')  -> Frekuensi Bersama = 400 | Skor WordPiece = {score_the:.6f}")
print("-" * 75)
print(f"Keputusan BPE       : Memilih Kandidat B ('th', 'e') karena frekuensi absolut lebih tinggi (400 > 10).")
print(f"Keputusan WordPiece : Memilih Kandidat A ('de', 'ep') karena asosiasi statistik relatif lebih kuat ({score_deep:.4f} > {score_the:.4f})!")
print("\nWordPiece mengidentifikasi kata morfem kuat dan mencegah bias berlebih pada stopwords.")
'''

subchapters.append({
    "id": "nlp-2-8-wordpiece-unigram-sentencepiece",
    "chapterId": "natural-language-processing-ch-2",
    "title": "WordPiece & Unigram Language Model Tokenization: SentencePiece dan Pemodelan Probabilistik",
    "description": "Alternatif subkata probabilistik: fungsi skor kemungkinan WordPiece pada Google BERT, algoritma top-down Unigram LM (Kudo 2018), dan standarisasi SentencePiece tanpa pra-segmentasi spasi.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Menyusul keberhasilan Byte-Pair Encoding, dua keluarga algoritma tokenisasi subkata alternatif yang sangat berpengaruh dikembangkan oleh komunitas riset: **WordPiece** dan **Unigram Language Model Tokenizer**.\n\n"
            "1. **WordPiece (Schuster & Nakajima, 2012; Wu et al., Google NMT 2016)**:\n"
            "   WordPiece menjadi terkenal di seluruh dunia sebagai tokenizer resmi untuk **Google BERT** (Devlin et al., 2018). Perbedaan utama antara WordPiece dan BPE terletak pada **kriteria pemilihan pasangan simbol yang digabungkan**:\n"
            "   - Pada BPE, algoritma secara serakah (*greedy*) selalu memilih pasangan simbol dengan frekuensi kemunculan absolut terbesar $\\arg\\max_{(A, B)} \\text{count}(A, B)$.\n"
            "   - Pada WordPiece, algoritma memilih pasangan simbol yang **memaksimalkan likelihood data pelatihan** dari unigram language model. Skor penggabungannya sebanding dengan rasio frekuensi bersama terhadap perkalian frekuensi individualnya:\n"
            "     $$\\text{Score}(A, B) = \\frac{\\text{count}(AB)}{\\text{count}(A) \\times \\text{count}(B)}$$\n"
            "   Formula ini secara matematis identik dengan *Pointwise Mutual Information* (PMI). Kriteria ini mencegah tokenisasi dari bias kata henti dan memprioritaskan pembentukan morfem leksikal yang memiliki ikatan statistik kuat. Token subkata yang bukan awal kata ditandai dengan prefiks khusus `##` (misal `playing` $\\to$ `play`, `##ing`).\n\n"
            "2. **Unigram Language Model Tokenizer (Taku Kudo, Google, ACL 2018)**:\n"
            "   Berbeda dengan BPE dan WordPiece yang bersifat *bottom-up* (dimulai dari karakter individual lalu digabung), Unigram LM beroperasi secara *top-down*:\n"
            "   - Dimulai dari kamus subkata yang sangat besar (jutaan potongan kata dari korpus).\n"
            "   - Menghitung kemungkinan (*loss likelihood*) korpus menggunakan algoritma ekspektasi-maksimisasi (EM).\n"
            "   - Secara bertahap memangkas (*pruning*) 10–20% subkata yang memiliki kontribusi terendah terhadap likelihood korpus hingga mencapai ukuran kosakata target.\n"
            "   - Saat inferensi, teks disegmentasikan secara probabilistik menggunakan algoritma Viterbi dinamis.\n\n"
            "3. **SentencePiece (Kudo & Richardson, EMNLP 2018)**:\n"
            "   Kerangka kerja perangkat lunak mandiri yang memperlakukan seluruh teks mentah sebagai aliran biner kontinu dan menganggap spasi sebagai karakter normal biasa (ditandai dengan simbol garis bawah `_` U+2581). Pendekatan ini memungkinkan tokenisasi langsung pada bahasa tanpa spasi (seperti bahasa Jepang dan Mandarin) tanpa modul pra-segmentasi terpisah, dan menjamin sifat *lossless tokenization* (teks asli dapat dipulihkan kembali 100% tanpa kehilangan informasi spasi)."
        ),
        "codeSnippet": code_2_8,
        "codeSnippetOutput": run_code_capture_output(code_2_8),
        "realWorldApplication": (
            "WordPiece digunakan pada Google Search BERT. Unigram SentencePiece digunakan pada model T5, ALBERT, LLaMA, Mistral, dan Google Gemini untuk mendukung tokenisasi multibahasa global yang efisien."
        ),
        "commonPitfalls": [
            r"Mencampuradukkan prefiks subkata WordPiece (##subword) dengan penanda BPE (subword</w> atau spasi prefiks), yang merusak pemrosesan token.",
            r"Mengabaikan tokenisasi deterministik vs subword regularization pada Unigram LM saat melakukan evaluasi model benchmark.",
            r"Kegagalan penanganan karakter baris baru (\n) pada SentencePiece jika konfigurasi preserve_newlines tidak diaktifkan."
        ],
        "caseStudy": (
            "Sebuah mesin pencari multibahasa harus memproses dokumen campuran bahasa Inggris, bahasa Arab, dan bahasa Jepang. Jelaskan mengapa penggunaan SentencePiece berbasis Unigram LM jauh lebih unggul dibandingkan kombinasi tokenizer berbasis aturan regex terpisah untuk masing-masing bahasa."
        ),
        "academicReferences": [
            r"Kudo, T., & Richardson, J. (2018). SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing. In Proceedings of the 2018 Conference on Empirical Methods in Natural Language Processing: System Demonstrations (pp. 66-71).",
            r"Kudo, T. (2018). Subword regularization: Improving neural network translation models with multiple subword candidates. In Proceedings of the 56th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers) (pp. 66-75).",
            r"Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2018). Bert: Pre-training of deep bidirectional transformers for language understanding. arXiv preprint arXiv:1810.04805."
        ]
    }
})

# ==============================================================================
# Subbab 2.9: Penanganan Kata di Luar Kamus (Out-of-Vocabulary / OOV)
# ==============================================================================
code_2_9 = r'''import numpy as np

# Simulasi Strategi Penanganan Kata di Luar Kamus (Out-of-Vocabulary / OOV):
# 1. Strategi Kata Penuh (Word-level): Ganti kata tak dikenal dengan token tunggal <UNK>
# 2. Strategi Byte-Level Fallback (BPE modern): Pecah kata tak dikenal menjadi representasi byte UTF-8 murni

class WordLevelVocab:
    def __init__(self, known_words):
        self.vocab = {w: idx for idx, w in enumerate(known_words)}
        self.unk_idx = len(self.vocab)
        self.vocab["<UNK>"] = self.unk_idx
        
    def encode(self, text):
        return [self.vocab.get(w, self.unk_idx) for w in text.split()]

class ByteFallbackTokenizer:
    def __init__(self, known_subwords):
        self.vocab = {w: idx for idx, w in enumerate(known_subwords)}
        
    def encode_oov_word(self, word):
        # Jika kata tidak ada di kamus subkata, fallback ke representasi byte UTF-8 individual (0-255)
        byte_tokens = [f"<byte_{b}>" for b in word.encode('utf-8')]
        return byte_tokens

word_model = WordLevelVocab(known_words=["saya", "belajar", "kecerdasan", "buatan"])
byte_model = ByteFallbackTokenizer(known_subwords=["saya", "belajar", "buatan"])

oov_sentence = "saya belajar antikythera" # 'antikythera' adalah OOV

encoded_word = word_model.encode(oov_sentence)
encoded_byte = byte_model.encode_oov_word("antikythera")

print(f"Kalimat Masukan: '{oov_sentence}'\n")
print(f"1. Pendekatan Word-Level (<UNK>):")
print(f"   Hasil Token ID: {encoded_word} (Kata 'antikythera' lenyap menjadi token <UNK>, informasi hilang 100%!)")
print(f"\n2. Pendekatan Byte-Level Fallback (Modern Subword):")
print(f"   Subkata Fallback: {encoded_byte[:6]} ... (Panjang {len(encoded_byte)} bytes)")
print("   Seluruh urutan karakter/byte UTF-8 tetap terpreservasi sempurna tanpa satu pun token <UNK>!")
'''

subchapters.append({
    "id": "nlp-2-9-oov-handling-byte-fallback",
    "chapterId": "natural-language-processing-ch-2",
    "title": "Penanganan Kosakata di Luar Kamus (Out-of-Vocabulary / OOV): Token <UNK> vs Byte-Level Fallback",
    "description": "Mitigasi kegagalan leksikal pada inferensi: patologi token penampung <UNK>, hilangnya informasi semantik pada kata langka, dan arsitektur Byte-level BPE bebas OOV.",
    "estimatedMinutes": 35,
    "order": 9,
    "content": {
        "theory": (
            "Masalah **Kata di Luar Kamus (*Out-of-Vocabulary / OOV*)** terjadi ketika sistem NLP pada tahap produksi/pengujian menjumpai kata-kata yang tidak pernah ada dalam kamus kosakata tetap ($V$) yang dibentuk selama tahap pelatihan. Berdasarkan Hukum Heaps, fenomena OOV tidak dapat dihindari pada korpus bahasa alami karena variasi nama orang, entitas produk, istilah slang baru, dan kesalahan ketik (*typos*) selalu bermunculan tanpa batas.\n\n"
            "Secara historis, terdapat dua filosofi penanganan OOV:\n"
            "1. **Pendekatan Token Pengganti Tunggal (`<UNK>`)**:\n"
            "   Pada model NLP kata penuh klasik, seluruh kata pelatihan yang memiliki frekuensi di bawah ambang batas tertentu ($f < \\tau$, misal $\\tau = 5$) dihapus dari kamus dan dipetakan ke token khusus **`<UNK>` (*Unknown Token*)**:\n"
            "   $$w \\notin V \\implies \\text{token} = \\text{ID}_{\\langle UNK \\rangle}$$\n"
            "   Meskipun menjaga ukuran matriks parameter tetap stabil, pendekatan ini memiliki konsekuensi fatal: **kehilangan informasi semantik secara total**. Kalimat *\"Pasien menderita glioblastoma ganas\"* akan diubah menjadi *\"Pasien menderita `<UNK>` ganas\"*, menghilangkan entitas medis paling kritis yang dibutuhkan dokter.\n\n"
            "2. **Pendekatan Byte-Level BPE & Byte-Fallback (Standar Modern)**:\n"
            "   Dipopulerkan oleh **GPT-2** (Radford et al., 2019) dan disempurnakan pada LLaMA (Touvron et al., 2023), algoritma tokenizer modern beroperasi langsung pada **tingkat byte UTF-8 mentah (*raw bytes*)** alih-alih karakter Unicode abstrak.\n"
            "   - Karena encoding UTF-8 standar merepresentasikan seluruh aksara dunia menggunakan kombinasi nilai byte diskrit antara 0 hingga 255 (tepat 256 nilai byte basis), kamus tokenizer **dapat mencakup 100% seluruh kemungkinan teks di muka bumi hanya dengan 256 token byte dasar**.\n"
            "   - Kata-kata umum dikompresi menjadi token subkata efisien, namun jika sistem menjumpai kata langka, karakter emoji baru, atau aksara kuno yang belum pernah dilihat, tokenizer tidak akan pernah memunculkan token `<UNK>`, melainkan memecahnya secara anggun menjadi urutan byte UTF-8 individual (*graceful byte degradation*).\n\n"
            "Hasilnya adalah sistem NLP yang **100% bebas dari token `<UNK>` (*true zero-OOV capability*)**, menjamin integritas teks end-to-end pada aplikasi mission-critical."
        ),
        "codeSnippet": code_2_9,
        "codeSnippetOutput": run_code_capture_output(code_2_9),
        "realWorldApplication": (
            "Diterapkan pada sistem perpesanan instan internasional yang harus memproses ratusan kombinasi emoji, simbol matematika unik, dan campuran aksara asing tanpa menyebabkan crash pada parser teks."
        ),
        "commonPitfalls": [
            r"Membiarkan model menghasilkan token <UNK> pada ekstraksi entitas bernama (NER), yang menghilangkan nama orang dan nomor rekening finansial.",
            r"Tokenisasi byte murni tanpa BPE yang menghasilkan sekuens 4x lebih panjang untuk aksara non-Latin (seperti aksara Arab, Devanagari, atau CJK), menghabiskan jatah context window Transformer.",
            r"Mengabaikan penanganan validitas decoding byte UTF-8 ketika pemotongan token dilakukan di tengah rangkaian multi-byte sequence."
        ],
        "caseStudy": (
            "Sebuah sistem deteksi penipuan transaksi kartu kredit memproses deskripsi pedagang: 'Pembelian di Toko_Kopi_Æthelstan_#99'. Bandingkan bagaimana model berbasis kata dengan <UNK> versus model modern berbasis Byte-Level BPE memproses nama toko tersebut tanpa kehilangan identitas transaksi unik."
        ),
        "academicReferences": [
            r"Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., & Sutskever, I. (2019). Language models are unsupervised multitask learners. OpenAI blog, 1(8), 9.",
            r"Touvron, H., Lavril, T., Izacard, G., Martinet, X., Lachaux, M. A., Lacroix, T., ... & Lample, G. (2023). Llama: Open and efficient foundation language models. arXiv preprint arXiv:2302.13971.",
            r"Wang, C., Cho, K., & Douze, M. (2020). Low-rank approximations of token embeddings for efficient large-scale language models. arXiv preprint arXiv:2006.15570."
        ]
    }
})

# ==============================================================================
# Subbab 2.10: Implementasi Pelatihan Tokenizer BPE Mandiri dari Nol
# ==============================================================================
code_2_10 = r'''import re
from collections import Counter, defaultdict

# Implementasi Lengkap Algoritma Pelatihan & Inferensi Tokenizer BPE dari Nol Berbasis Python
# Mencakup: 1. Pelatihan aturan penggabungan (Merge Rules), 2. Segmentasi teks baru

class SimpleBPETokenizer:
    def __init__(self, num_merges=10):
        self.num_merges = num_merges
        self.merges = []
        self.vocab = set()
        
    def train(self, texts):
        # 1. Bentuk kosakata karakter awal dengan penanda akhir kata '</w>'
        words = []
        for text in texts:
            for w in text.strip().split():
                words.append(' '.join(list(w)) + ' </w>')
        
        vocab_counts = Counter(words)
        current_vocab = dict(vocab_counts)
        
        # 2. Loop Pelatihan Penggabungan Pasangan
        for i in range(self.num_merges):
            pairs = defaultdict(int)
            for word, freq in current_vocab.items():
                symbols = word.split()
                for j in range(len(symbols) - 1):
                    pairs[(symbols[j], symbols[j+1])] += freq
                    
            if not pairs:
                break
                
            best_pair = max(pairs, key=pairs.get)
            self.merges.append(best_pair)
            
            # Terapkan penggabungan ke kamus latihan
            new_vocab = {}
            bigram = re.escape(' '.join(best_pair))
            pattern = re.compile(r'(?<!\S)' + bigram + r'(?!\S)')
            replacement = ''.join(best_pair)
            for word in current_vocab:
                new_word = pattern.sub(replacement, word)
                new_vocab[new_word] = current_vocab[word]
            current_vocab = new_vocab
            
        # Kumpulkan seluruh simbol final ke dalam kamus
        for w in current_vocab:
            for sym in w.split():
                self.vocab.add(sym)
                
    def tokenize(self, text):
        # Segmentasi teks baru menggunakan aturan merge yang telah dipelajari
        tokens = []
        for word in text.strip().split():
            word_str = ' '.join(list(word)) + ' </w>'
            for pair in self.merges:
                bigram = re.escape(' '.join(pair))
                pattern = re.compile(r'(?<!\S)' + bigram + r'(?!\S)')
                word_str = pattern.sub(''.join(pair), word_str)
            tokens.extend(word_str.split())
        return tokens

# Data pelatihan teks
train_sentences = [
    "pembelajaran mesin dan kecerdasan buatan",
    "pembelajaran mendalam sangat populer",
    "mesin cerdas memahami bahasa alami"
]

tokenizer = SimpleBPETokenizer(num_merges=8)
tokenizer.train(train_sentences)

# Uji pada teks baru (termasuk variasi OOV)
test_input = "mesin pembelajar cerdas"
tokenized_output = tokenizer.tokenize(test_input)

print("Verifikasi Pelatihan & Inferensi Tokenizer BPE Mandiri:")
print(f"Total Aturan Merge Dipelajari: {len(tokenizer.merges)}")
for idx, (p1, p2) in enumerate(tokenizer.merges[:4], start=1):
    print(f"  Rule #{idx}: ('{p1}', '{p2}') -> '{p1+p2}'")
print("-" * 65)
print(f"Teks Uji Masukan   : \"{test_input}\"")
print(f"Hasil Tokenisasi BPE: {tokenized_output}")
print("Tokenizer BPE berhasil memecah kata majemuk dan infleksi menjadi unit subkata modular!")
'''

subchapters.append({
    "id": "nlp-2-10-bpe-tokenizer-scratch-python",
    "chapterId": "natural-language-processing-ch-2",
    "title": "Implementasi Algoritma Pelatihan Tokenizer BPE (Byte-Pair Encoding) Mandiri dari Nol",
    "description": "Praktikum komputasi komprehensif: konstruksi matriks frekuensi pasangan simbol, ekstraksi kaidah penggabungan rekursif, segmentasi teks uji, dan detokenisasi terbalik.",
    "estimatedMinutes": 35,
    "order": 10,
    "content": {
        "theory": (
            "Praktikum penutup pada Bab 2 ini membangun sebuah mesin **Tokenizer Byte-Pair Encoding (BPE)** fungsional penuh secara mandiri dari nol menggunakan pustaka standar Python murni tanpa ketergantungan pada pustaka pihak ketiga seperti Hugging Face `tokenizers` atau Google `sentencepiece`.\n\n"
            "Algoritma ini diimplementasikan dalam dua tahap operasional yang terpisah:\n"
            "1. **Fase Pelatihan (*Training Phase / Learning Merge Rules*)**:\n"
            "   - Mengambil korpus teks latih dan menginisialisasi setiap kata sebagai deretan karakter individual yang dipisahkan oleh spasi, dengan sufiks penanda akhir kata `</w>`.\n"
            "   - Menghitung pasangan simbol berurutan $(s_i, s_{i+1})$ yang paling sering muncul di seluruh korpus.\n"
            "   - Menyimpan pasangan terbaik tersebut ke dalam daftar berurutan **Aturan Penggabungan (*Ordered Merge Rules*)** dan memperbarui representasi korpus latih secara iteratif hingga mencapai batas hiperparameter $N_{merges}$.\n\n"
            "2. **Fase Inferensi Segmentasi (*Inference / Tokenization Phase*)**:\n"
            "   - Ketika sebuah kalimat uji baru diterima, setiap kata dipecah menjadi karakter-karakter individual.\n"
            "   - Seluruh aturan penggabungan yang telah dipelajari selama tahap pelatihan diterapkan **secara berurutan sesuai urutan prioritas peringkatnya** (*strict priority order*).\n"
            "   - Hasil akhirnya adalah daftar token subkata optimal yang mencerminkan potongan leksikal dan morfem bahasa yang telah diekstraksi.\n\n"
            "Modul ini mendemonstrasikan bagaimana sebuah algoritma kompresi data string sederhana yang beroperasi pada frekuensi n-gram karakter mampu memecahkan salah satu tantangan paling berat dalam linguistik komputasional: merepresentasikan seluruh bahasa alami manusia secara kompak, efisien, dan 100% bebas dari masalah kata di luar kamus (*zero OOV*)."
        ),
        "codeSnippet": code_2_10,
        "codeSnippetOutput": run_code_capture_output(code_2_10),
        "realWorldApplication": (
            "Menjadi komponen paling mendasar yang diintegrasikan pada setiap framework pra-pelatihan LLM (seperti Hugging Face Tokenizers dalam bahasa Rust atau tiktoken OpenAI) untuk mengubah string masukan prompt pengguna menjadi tensor token ID numerik."
        ),
        "commonPitfalls": [
            r"Menerapkan aturan merge secara acak tanpa memperhatikan urutan prioritas kemunculan saat training, yang menghasilkan segmentasi subkata yang tidak konsisten.",
            r"Mengabaikan kompleksitas waktu pencarian ekspresi reguler saat kamus kosakata membesar (pada skala produksi industri wajib menggunakan struktur data Trie atau Aho-Corasick untuk matching berkecepatan tinggi).",
            r"Lupa menangani spasi antar-kata saat melakukan detokenisasi balik dari subkata ke teks asli."
        ],
        "caseStudy": (
            "Sebuah startup AI lokal ingin melatih model bahasa untuk bahasa daerah (misal bahasa Jawa atau Sunda) yang memiliki data korpus sangat terbatas (hanya 10 MB teks). Analisis bagaimana penentuan hiperparameter num_merges (misal 5.000 vs 50.000) pada pelatihan BPE mempengaruhi rasio kompresi token dan efisiensi context window model Transformer."
        ),
        "academicReferences": [
            r"Sennrich, R., Haddow, B., & Birch, A. (2016). Neural machine translation of rare words with subword units. In Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers) (pp. 1715-1725).",
            r"Gage, P. (1994). A new algorithm for data compression. The C Users Journal, 12(2), 23-38.",
            r"Jurafsky, D., & Martin, J. H. (2024). Speech and Language Processing (3rd ed. draft). Stanford University."
        ]
    }
})

# Simpan ke JSON
output_path = os.path.join(os.path.dirname(__file__), "nlp_ch2_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 2 NLP -> {output_path}")
