---
kategori: "Natural Language Processing"
title: "Tokenisasi & Lemmatisasi Teks"
tags: [nlp, preprocessing, tokenization, lemmatization]
---

# Tokenisasi & Lemmatisasi Teks

Pemrosesan awal teks (*text preprocessing*) merupakan langkah fundamental dalam pemrosesan bahasa alami (Natural Language Processing). Tujuan utamanya adalah menyederhanakan data teks mentah tanpa struktur menjadi representasi token diskrit yang dapat diproses oleh model komputasi.

## 1. Konsep Tokenisasi
Tokenisasi adalah proses memecah korpus dokumen $D$ menjadi urutan token $T = (t_1, t_2, \dots, t_n)$:

- **Word Tokenization**: Pemisahan berdasarkan spasi dan tanda baca kata.
- **Subword Tokenization (BPE / WordPiece)**: Pemecahan kata langka menjadi unit sub-kata untuk menghindari masalah kosakata di luar kamus (*Out-Of-Vocabulary / OOV*).

## 2. Stemming vs. Lemmatisasi
- **Stemming**: Pemotongan afiks secara heuristik berbasis aturan (*rule-based suffix stripping*, e.g., Porter Stemmer). Dapat menghasilkan kata yang bukan lema kamus sah.
- **Lemmatisasi**: Normalisasi morfologis penuh berdasarkan leksikon dan analisis konteks part-of-speech (POS) untuk mengembalikan bentuk kanonik kamus (*lemma*).

$$f_{\text{lemma}}(\text{"running"}, \text{POS}=\text{VERB}) \to \text{"run"}$$

## 3. Implementasi Kode Python

```python
import re

def simple_whitespace_tokenize(text: str) -> list[str]:
    """Tokenisasi sederhana menggunakan ekspresi reguler."""
    clean_text = re.sub(r"[^\w\s]", "", text.lower())
    return [token for token in clean_text.split() if token]

sample_sentence = "Agen cerdas memproses token teks secara berurutan dan terstruktur."
tokens = simple_whitespace_tokenize(sample_sentence)
print(f"Hasil Tokenisasi ({len(tokens)} token):", tokens)
```

## 4. Tautan Konsep Terkait
- Teori representasi kata lanjut: [[Self-Attention & Arsitektur Transformer]]
- Fondasi kecerdasan komputasi: [[Prinsip Dasar Kecerdasan Buatan & Agen Cerdas]]
