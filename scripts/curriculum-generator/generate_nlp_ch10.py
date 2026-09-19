# -*- coding: utf-8 -*-
"""
Generator untuk Bab 10: Transformer Encoder & Model Pemahaman Bahasa Alami (BERT, RoBERTa, DeBERTa) (10 Subbab)
Topik: Natural Language Processing (22-natural-language-processing.ts)
Mematuhi standar substantif: >= 200 kata per subbab, LaTeX KaTeX lengkap,
kode mandiri dieksekusi dengan output nyata, 7 komponen lengkap, dan rujukan primer Jacob Devlin et al. (NAACL-HLT 2019).
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
# Subbab 10.1: Arsitektur Transformer Encoder
# ==============================================================================
code_10_1 = r'''import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V
    """
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
    if mask is not None:
        scores = np.where(mask == 0, -1e9, scores)
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    attn_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    output = np.matmul(attn_weights, V)
    return output, attn_weights

np.random.seed(42)
seq_len = 3
d_model = 4
Q = np.random.randn(seq_len, d_model)
K = np.random.randn(seq_len, d_model)
V = np.random.randn(seq_len, d_model)

out, weights = scaled_dot_product_attention(Q, K, V)
print("Operasi Scaled Dot-Product Self-Attention (Vaswani et al. 2017):")
print("-" * 65)
print(f"Bentuk Matriks Output : {out.shape} (seq_len x d_model)")
print("Matriks Bobot Atensi (Attention Weights Softmax):")
print(np.round(weights, 4))
print("-" * 65)
print("Jumlah Probabilitas per Baris (Harus 1.0):", np.round(np.sum(weights, axis=-1), 4))
'''

subchapters.append({
    "id": "nlp-10-1-transformer-encoder-architecture",
    "chapterId": "natural-language-processing-ch-10",
    "title": "Arsitektur Transformer Encoder: Multi-Head Self-Attention, Positional Encoding, dan Residual Pre/Post-LN",
    "description": "Prinsip kerja Transformer Encoder: mekanisme atensi berskala, proyeksi multi-head, fungsi aktivasi posisi sinusoidal, serta komparasi stabilitas gradien Pre-LN vs Post-LN.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Arsitektur **Transformer Encoder**, yang diperkenalkan oleh Ashish Vaswani et al. (2017) dalam makalah monumental *'Attention Is All You Need'*, membuang sepenuhnya ketergantungan pada sel rekuren (RNN/LSTM) dan operasi konvolusi temporal. Sebaliknya, Transformer mengandalkan mekanisme **Self-Attention** yang memungkinkan pemodelan interaksi antarkata secara langsung dengan kompleksitas jalur komputasi $O(1)$ antartoken berjarak arbitrer.\n\n"
            "Fondasi komputasi inti adalah **Scaled Dot-Product Attention**. Diberikan tiga matriks yang diproyeksikan dari representasi kata masukan—yaitu Matriks Kueri ($Q \\in \\mathbb{R}^{n \\times d_k}$), Matriks Kunci ($K \\in \\mathbb{R}^{m \\times d_k}$), dan Matriks Nilai ($V \\in \\mathbb{R}^{m \\times d_v}$)—fungsi atensi dihitung sebagai:\n"
            "$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^\\top}{\\sqrt{d_k}} \\right) V$$\n"
            "Faktor penskalaan $\\frac{1}{\\sqrt{d_k}}$ berperan sangat krusial: pada dimensi $d_k$ yang besar, produk skalar dot-product cenderung bertumbuh besar nilainya, mendorong fungsi softmax ke wilayah dengan gradien yang sangat kecil (*vanishing gradient*). Penskalaan ini menstabilkan variansi skor ke angka satu.\n\n"
            "Untuk memperkaya kapasitas representasi, **Multi-Head Attention** memproyeksikan $Q, K, V$ ke dalam $h$ subruang representasi terpisah secara paralel, menangkap berbagai tipe relasi gramatikal dan semantik yang berbeda secara simultan:\n"
            "$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O, \\quad \\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$\n\n"
            "Karena self-attention tidak memiliki urutan bawaan (*permutation invariant*), **Positional Encoding** sinusoidal atau terpelajar ditambahkan ke vektor embedding masukan:\n"
            "$$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d_{model}}}\\right), \\quad PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d_{model}}}\\right)$$\n"
            "Dalam blok encoder, sub-lapisan atensi dan Feed-Forward Network (FFN) disambungkan melalui koneksi residual dan Layer Normalization. Evolusi modern menunjukkan bahwa arsitektur **Pre-LN** (di mana normalisasi diterapkan sebelum atensi dan FFN: $x + \\text{Sublayer}(\\text{LN}(x))$) jauh lebih stabil secara numerik dan memungkinkan pelatihan jaringan sangat dalam tanpa memerlukan fase warmup yang panjang dibandingkan standar Post-LN klasik."
        ),
        "codeSnippet": code_10_1,
        "codeSnippetOutput": run_code_capture_output(code_10_1),
        "realWorldApplication": "Pondasi utama representasi bahasa pada model BERT, encoder pada mesin pencari Google, modul visual patch embedding pada Vision Transformer (ViT), dan ekstraksi fitur dokumen teks panjang.",
        "commonPitfalls": [
            "Lupa menerapkan faktor pembagi sqrt(d_k) yang mengakibatkan softmax menjenuh (*saturates*) dan nilai gradien mendekati nol saat backpropagation.",
            "Mengabaikan positional encodings sehingga urutan kata teracak tanpa memengaruhi representasi keluaran model (masalah bag-of-words terselubung).",
            "Menerapkan Post-LN pada transformer lebih dari 20 lapis tanpa learning rate warmup yang sangat hati-hati, memicu divergensi gradien awal."
        ],
        "caseStudy": "Sebuah model Transformer Encoder 12-layer dengan Post-LN mengalami divergensi nilai gradien (NaN loss) pada 500 iterasi pertama pelatihan. Mengapa migrasi ke arsitektur Pre-LN berhasil menstabilkan kurva konvergensi tanpa membutuhkan penurunan drastis base learning rate?",
        "academicReferences": [
            "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. In Advances in Neural Information Processing Systems (NeurIPS 2017), pages 5998–6008.",
            "Xiong, R., Yang, Y., He, D., Zheng, K., Zheng, S., Xing, C., Zhang, H., Lan, Y., Wang, L., & Liu, T. (2020). On layer normalization in the transformer architecture. In International Conference on Machine Learning (ICML 2020).",
            "Ba, J. L., Kiros, J. R., & Hinton, G. E. (2016). Layer normalization. arXiv preprint arXiv:1607.06450."
        ]
    }
})

# ==============================================================================
# Subbab 10.2: SPOT-CHECK DEVLIN ET AL. 2019 (BERT)
# ==============================================================================
code_10_2 = r'''import numpy as np

# Simulasi Prosedur Masking 80-10-10 BERT (Devlin et al., NAACL-HLT 2019)
def bert_masking_simulation(tokens, mask_prob=0.15, seed=42):
    np.random.seed(seed)
    output_tokens = tokens.copy()
    masked_indices = []
    
    for i, tok in enumerate(tokens):
        if tok in ["[CLS]", "[SEP]"]:
            continue
        prob = np.random.rand()
        if prob < mask_prob:
            masked_indices.append(i)
            sub_prob = np.random.rand()
            if sub_prob < 0.80:
                output_tokens[i] = "[MASK]"       # 80% diganti [MASK]
            elif sub_prob < 0.90:
                output_tokens[i] = "kucing"       # 10% diganti token acak
            else:
                pass                              # 10% dipertahankan (unchanged)
                
    return output_tokens, masked_indices

kalimat = ["[CLS]", "analis", "keuangan", "memprediksi", "pertumbuhan", "ekonomi", "positif", "[SEP]"]
corrupted, indices = bert_masking_simulation(kalimat, mask_prob=0.4) # prob dinaikkan untuk demonstrasi

print("Simulasi Masked Language Model (Aturan 80-10-10 Devlin et al. 2019):")
print("-" * 75)
print(f"Tokens Asli      : {' '.join(kalimat)}")
print(f"Tokens Terkorupsi: {' '.join(corrupted)}")
print(f"Indeks Terpilih  : {indices}")
for idx in indices:
    print(f"  Posisi {idx} ({kalimat[idx]}) -> Ditransformasi menjadi: '{corrupted[idx]}'")
print("-" * 75)
print("Fungsi: Menghilangkan mismatch representasi antara fase pre-training dan fine-tuning.")
'''

subchapters.append({
    "id": "nlp-10-2-bert-pretraining-devlin-spotcheck",
    "chapterId": "natural-language-processing-ch-10",
    "title": "Spot-Check Literatur Primer (Jacob Devlin et al., NAACL-HLT 2019): BERT (Bidirectional Encoder Representations from Transformers)",
    "description": "Verifikasi rujukan primer paper Jacob Devlin et al. (2019) mengenai pre-training BERT, aturan masking 80-10-10, Next Sentence Prediction (NSP), dan penyatuan representasi embedding.",
    "estimatedMinutes": 35,
    "order": 2,
    "content": {
        "theory": (
            "Kutipan verbatim berikut diambil secara langsung dari publikasi ilmiah primer:\n\n"
            "> **Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova (2019)**. "
            "*BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*. "
            "In Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: "
            "Human Language Technologies (NAACL-HLT), Volume 1 (Long and Short Papers), Minneapolis, Minnesota, June 2-7, 2019, pages 4171–4186. "
            "Published by Association for Computational Linguistics (ACL).\n\n"
            "**1. Verbatim Masked Language Model & Aturan 80-10-10 (Section 3: BERT, Subsection 3.1: Pre-training BERT, Task #1: Masked LM, hal. 4174, kolom 1-2):**\n"
            "\"In order to train a deep bidirectional representation, we simply mask some percentage of the input tokens at random, and then predict those masked tokens. "
            "We refer to this procedure as a 'masked LM' (MLM), although it is often referred to as a Cloze task in the literature (Taylor, 1953). "
            "In this case, the final hidden vectors corresponding to the mask tokens are fed into an output softmax over the vocabulary, as in a standard LM. "
            "In all of our experiments, we mask 15% of all WordPiece tokens in each sequence at random.\n\n"
            "Although this allows us to obtain a bidirectional pre-trained model, a downside is that we are creating a mismatch between pre-training and fine-tuning, "
            "since the [MASK] token does not appear during fine-tuning. To mitigate this, we do not always replace 'masked' words with the actual [MASK] token. "
            "The training data generator chooses 15% of the token positions at random for prediction. If the $i$-th token is chosen, we replace the $i$-th token with:\n"
            "(1) the [MASK] token 80% of the time\n"
            "(2) a random token 10% of the time\n"
            "(3) the unchanged $i$-th token 10% of the time.\n"
            "Then, $T_i$ will be used to predict the original token with cross entropy loss.\"\n\n"
            "**2. Verbatim Next Sentence Prediction (Section 3.1: Pre-training BERT, Task #2: Next Sentence Prediction (NSP), hal. 4174, kolom 2):**\n"
            "\"Many important downstream tasks such as Question Answering (QA) and Natural Language Inference (NLI) are based on understanding the relationship between two sentences, "
            "which is not directly captured by language modeling. In order to train a model that understands sentence relationships, we pre-train for a binarized next sentence prediction task "
            "that can be trivially generated from any monolingual corpus. Specifically, when choosing the sentences $A$ and $B$ for each pre-training example, 50% of the time $B$ is the actual next sentence "
            "that follows $A$ (labeled as IsNext), and 50% of the time it is a random sentence from the corpus (labeled as NotNext).\"\n\n"
            "**3. Verbatim Representasi Masukan (Section 3: BERT, hal. 4173, kolom 2):**\n"
            "\"For a given token, its input representation is constructed by summing the corresponding token, segment, and position embeddings. "
            "A visual representation of this construction can be seen in Figure 2.\"\n\n"
            "Kombinasi elegan antara arsitektur Transformer Encoder, Masked Language Model dua arah penuh tanpa kebocoran informasi masa depan, "
            "dan fine-tuning berbasis satu lapisan linear tambahan memecahkan rekor state-of-the-art pada 11 tugas pemrosesan bahasa alami secara serentak, "
            "termasuk mendorong skor GLUE ke angka 80.5% dan MultiNLI ke 86.7%."
        ),
        "codeSnippet": code_10_2,
        "codeSnippetOutput": run_code_capture_output(code_10_2),
        "realWorldApplication": "Mesin perutean kueri pencarian Google Search (memproses lebih dari 70 bahasa), klasifikasi dokumen hukum berskala korporat, dan sistem penjawab pertanyaan otomatis.",
        "commonPitfalls": [
            "Memasukkan token [MASK] pada tahap fine-tuning (token [MASK] hanya eksis selama fase pre-training).",
            "Mengabaikan segment embeddings saat memproses tugas pasangan kalimat (NLI/QA) sehingga model kehilangan batas pemisah antar premis dan hipotesis.",
            "Menerapkan cross-entropy loss pada seluruh token kalimat (loss MLM hanya dihitung pada 15% token terpilih, bukan pada 85% token yang tidak dimask)."
        ],
        "caseStudy": "Mengapa model bahasa autoregresif kiri-ke-kanan standar (seperti GPT-1) tidak dapat langsung diubah menjadi dua arah dengan hanya menggabungkan representasi LSTM backward seperti ELMo pada tingkat representasi Transformer tanpa memicu kebocoran siklis trivial?",
        "academicReferences": [
            "Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In NAACL-HLT 2019, pages 4171–4186.",
            "Taylor, W. L. (1953). 'Cloze procedure': A new tool for measuring readability. Journalism Bulletin, 30(4), 415-433.",
            "Radford, A., Narasimhan, K., Salimans, T., & Sutskever, I. (2018). Improving language understanding by generative pre-training. OpenAI Technical Report."
        ]
    }
})

# ==============================================================================
# Subbab 10.3: Tokenisasi WordPiece & Token Khusus
# ==============================================================================
code_10_3 = r'''# Simulasi Pemecahan Token Subkata WordPiece (Awalan '##')
vocab = {"[CLS]": 0, "[SEP]": 1, "[UNK]": 2, "tele": 3, "##komunikasi": 4, "indonesia": 5, "ber": 6, "##kembang": 7}

def tokenize_wordpiece(word, vocabulary):
    tokens = []
    start = 0
    while start < len(word):
        end = len(word)
        cur_substr = None
        while start < end:
            sub = word[start:end]
            if start > 0:
                sub = "##" + sub
            if sub in vocabulary:
                cur_substr = sub
                break
            end -= 1
        if cur_substr is None:
            return ["[UNK]"]
        tokens.append(cur_substr)
        start = end
    return tokens

words = ["telekomunikasi", "indonesia", "berkembang"]
all_tokens = ["[CLS]"]
for w in words:
    all_tokens.extend(tokenize_wordpiece(w, vocab))
all_tokens.append("[SEP]")

print("Simulasi Tokenisasi Subword WordPiece (BERT Standard):")
print("-" * 65)
print("Teks Asli        : 'telekomunikasi indonesia berkembang'")
print(f"Token Terbentuk  : {all_tokens}")
print(f"Token IDs        : {[vocab[t] for t in all_tokens]}")
print("-" * 65)
print("Penanda '##' mengindikasikan bahwa subkata adalah lanjutan morfem dari kata sebelumnya.")
'''

subchapters.append({
    "id": "nlp-10-3-wordpiece-tokenization-special-tokens",
    "chapterId": "natural-language-processing-ch-10",
    "title": "Mekanisme Tokenisasi Subword WordPiece pada BERT: Penanganan Kosakata Terbatas dan Token Khusus",
    "description": "Algoritma segmentasi subkata WordPiece, penanda kontinuitas morfem '##', fungsi token khusus [CLS], [SEP], [MASK], serta mitigasi Out-of-Vocabulary.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Efektivitas representasi Transformer Encoder pada teks korpus terbuka sangat bergantung pada strategi tokenisasi masukan. Tokenisasi tingkat kata (*word-level*) mengalami kelemahan fatal berupa ledakan ukuran kosakata yang memicu masalah memori matriks embedding serta ketidakmampuan menangani kata di luar kosakata (*Out-of-Vocabulary* / OOV). Sebaliknya, tokenisasi tingkat karakter (*character-level*) menghasilkan sekuens yang terlalu panjang dan kehilangan kepadatan semantik leksikal.\n\n"
            "BERT menjembatani dikotomi ini dengan mengadopsi algoritma **WordPiece** (Schuster & Nakajima, 2012; Wu et al., 2016) dengan ukuran kosakata tetap sebesar 30.522 token (pada model bahasa Inggris). WordPiece membangun kosakata subkata berbasis korpus teks masif dengan memprioritaskan penggabungan pasangan karakter yang memaksimalkan kemungkinan (*likelihood*) pemodelan unigram bahasa.\n\n"
            "Ciri khas WordPiece adalah konvensi prefiks **'##'**: jika sebuah subkata berada di tengah atau di akhir suatu kata (bukan awal kata leksikal), subkata tersebut diberi prefiks `##` (misal: kata *'unwanted'* dipecah menjadi `['un', '##want', '##ed']`). Pola ini memungkinkan rekonstruksi teks asli secara deterministik tanpa kehilangan informasi spasi.\n\n"
            "Selain token leksikal dan subkata, BERT menyertakan serangkaian **Token Khusus (*Special Tokens*)** struktural:\n"
            "1. `[CLS]` (*Classification*): Selalu disisipkan pada posisi indeks pertama ($pos = 0$). Vektor representasi status akhir dari token ini ($C \\in \\mathbb{R}^H$) diagregasikan sebagai representasi ringkasan kalimat untuk klasifikasi teks hilir.\n"
            "2. `[SEP]` (*Separator*): Bertindak sebagai pembatas batas kalimat, baik untuk memisahkan premis dan hipotesis pada tugas pasangan kalimat ($[\\text{CLS}]\\ \\text{Kalimat A}\\ [\\text{SEP}]\\ \\text{Kalimat B}\\ [\\text{SEP}]$) maupun sebagai penanda akhir kalimat tunggal.\n"
            "3. `[MASK]`: Token pengganti khusus yang hanya muncul selama pre-training Masked Language Model.\n"
            "4. `[UNK]`: Token fallback untuk karakter tunggal langka yang tidak tercakup dalam tabel grafem Unicode kosakata."
        ),
        "codeSnippet": code_10_3,
        "codeSnippetOutput": run_code_capture_output(code_10_3),
        "realWorldApplication": "Prapemrosesan teks standar pada seluruh model seri BERT, RoBERTa, DistilBERT, dan pipeline tokenisasi produksi Hugging Face Tokenizers.",
        "commonPitfalls": [
            "Lupa menambahkan token khusus [CLS] dan [SEP] sebelum mengumpankan array token ID ke model BERT (menghilangkan representasi pooling klasifikasi).",
            "Menerapkan lowercase secara keliru pada model BERT-cased (misal 'Apple' perusahaan menjadi 'apple' buah), yang menghancurkan fitur kapitalisasi NER.",
            "Tokenisasi manual string mentah tanpa normalisasi Unicode NFC/NFKC yang memicu token [UNK] berlebihan pada karakter tanda kutip atau aksen khusus."
        ],
        "caseStudy": "Sebuah pipeline klasifikasi sentimen mengalami penurunan F1 sebesar 8% saat beralih dari BERT-uncased ke BERT-cased pada ulasan produk e-commerce. Mengapa variasi penulisan pengguna yang penuh kesalahan kapitalisasi acak membuat model cased rentan menghasilkan subkata [UNK]?",
        "academicReferences": [
            "Wu, Y., et al. (2016). Google's neural machine translation system: Bridging the gap between human and machine translation. arXiv preprint arXiv:1609.08144 (WordPiece).",
            "Schuster, M., & Nakajima, K. (2012). Japanese and Korean voice search. In ICASSP 2012, pages 5149–5152.",
            "Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In NAACL-HLT 2019."
        ]
    }
})

# ==============================================================================
# Subbab 10.4: RoBERTa
# ==============================================================================
code_10_4 = r'''# Perbandingan Keputusan Desain Pelatihan: BERT vs RoBERTa (Liu et al., 2019)
design_matrix = [
    ("Dimensi Pelatihan", "BERT Asli (Devlin 2019)", "RoBERTa (Liu et al. 2019)"),
    ("Strategi Masking", "Statis (1 pola mask per epoch)", "Dinamis (pola mask berbeda tiap epoch)"),
    ("Objektif NSP", "Digunakan (Next Sentence Prediction)", "Dihapus sepenuhnya (Hanya Full-Sentences MLM)"),
    ("Ukuran Batch", "256 sekuens", "8.192 sekuens (Mini-batch raksasa)"),
    ("Ukuran Korpus", "16 GB (BooksCorpus + Wikipedia)", "160 GB (Ditambah CC-News, OpenWebText, Stories)"),
    ("Skema Tokenizer", "WordPiece 30K token", "Byte-Level BPE 50K token"),
    ("Langkah Pelatihan", "1.000.000 steps", "500.000 steps (dengan batch besar)")
]

print("Analisis Komparatif Desain Pra-Pelatihan BERT vs RoBERTa:")
print("-" * 80)
print(f"{design_matrix[0][0]:<20} | {design_matrix[0][1]:<32} | {design_matrix[0][2]}")
print("-" * 80)
for row in design_matrix[1:]:
    print(f"{row[0]:<20} | {row[1]:<32} | {row[2]}")
print("-" * 80)
print("Temuan Utama: RoBERTa membuktikan BERT mengalami under-training yang signifikan.")
'''

subchapters.append({
    "id": "nlp-10-4-roberta-optimized-pretraining",
    "chapterId": "natural-language-processing-ch-10",
    "title": "Re-evaluasi RoBERTa (Yinhan Liu et al., 2019): Dynamic Masking, Eliminasi NSP, dan Skala Korpus",
    "description": "Analisis kritis replikasi empiris model BERT oleh tim Meta AI: penghapusan Next Sentence Prediction (NSP), dynamic masking, mini-batch raksasa, dan byte-level BPE.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "Ketika BERT pertama kali dipublikasikan pada tahun 2018, komunitas riset kecerdasan buatan menyimpulkan bahwa keunggulannya berasal dari kombinasi fungsi objektif Masked Language Model (MLM) dan Next Sentence Prediction (NSP). Namun, studi empiris ekstensif dan cermat yang dilakukan oleh Yinhan Liu et al. (Meta AI, 2019) dalam makalah **RoBERTa** (*A Robustly Optimized BERT Pretraining Approach*) mengungkap temuan mengejutkan: BERT asli mengalami kondisi pelatihan yang kurang optimal (*significantly under-trained*).\n\n"
            "Secara formal, RoBERTa menyederhanakan fungsi objektif optimasi dengan mengeliminasi penuh kehilangan NSP, memfokuskan kapasitas representasi murni pada fungsi rugi *Masked Language Modeling* dinamis:\n"
            "$$\\mathcal{L}_{\\text{RoBERTa}} = - \\sum_{i \\in \\mathcal{M}} \\log p(x_i \\mid \\tilde{\\mathbf{x}})$$\n"
            "di mana $\\mathcal{M}$ adalah himpunan indeks posisi token yang disembunyikan secara stokastik pada setiap langkah waktu, dan $\\tilde{\\mathbf{x}}$ adalah sekuens teks berderau.\n\n"
            "Melalui serangkaian eksperimen kontrol variabel terkendali, tim RoBERTa merumuskan empat modifikasi fundamental pada resep pra-pelatihan:\n"
            "1. **Dynamic Masking**: BERT asli melakukan proses masking secara statis sekali saja selama fase persiapan data, sehingga model melihat pola mask yang persis sama pada setiap epoch. RoBERTa menerapkan *dynamic masking*, di mana pola mask di-generate secara acak setiap kali suatu sekuens diumpankan ke model, meningkatkan variasi pembelajaran secara dramatis saat melatih hingga ratusan epoch.\n"
            "2. **Eliminasi Next Sentence Prediction (NSP)**: RoBERTa membuktikan bahwa membuang objektif NSP justru sedikit meningkatkan performa pada tugas hilir. Model dilatih menggunakan format teks *FULL-SENTENCES* yang mengambil teks bersambung melintasi batas dokumen hingga mencapai panjang maksimum $T = 512$ token, mempertahankan koherensi wacana jarak jauh.\n"
            "3. **Pelatihan dengan Mini-Batch Raksasa**: RoBERTa menaikkan ukuran batch pelatihan dari $\\mathcal{B} = 256$ sekuens (pada BERT) menjadi $\\mathcal{B} = 8.192$ sekuens per langkah waktu dengan laju pembelajaran $\\eta = 6 \\times 10^{-4}$. Peningkatan ukuran batch ini menstabilkan estimasi gradien optimasi Adam, mempercepat laju konvergensi, dan memungkinkan peningkatan learning rate puncak secara aman.\n"
            "4. **Skala Data Masif & Byte-Level BPE**: Korpus diperluas 10 kali lipat dari 16 GB teks menjadi 160 GB teks tanpa label (mencakup CommonCrawl News, OpenWebText, dan Stories), dipadukan dengan kamus Byte-Pair Encoding berukuran $|V| = 50.000$ token subkata.\n\n"
            "Tanpa mengubah satu pun parameter arsitektur inti Transformer Encoder BERT, RoBERTa berhasil melampaui seluruh varian BERT pada benchmark GLUE (mencapai 88.5 poin) dan SQuAD, membuktikan bahwa desain pra-pelatihan dan skala data memegang peranan krusial setara dengan inovasi arsitektur."
        ),
        "codeSnippet": code_10_4,
        "codeSnippetOutput": run_code_capture_output(code_10_4),
        "realWorldApplication": "Model dasar (*backbone*) terpopuler di industri untuk tugas pemahaman teks (NLU), analisis sentimen dokumen finansial, ekstraksi entitas kontrak legal, dan peringkat pencarian semantik.",
        "commonPitfalls": [
            "Mengasumsikan RoBERTa memiliki token segment [SEP] yang identik dengan BERT (RoBERTa menggunakan penandaan token ganda </s></s> untuk memisahkan pasangan kalimat).",
            "Menerapkan tokenizer WordPiece BERT pada bobot pre-trained RoBERTa (RoBERTa menggunakan Byte-Level BPE dengan kosakata 50K yang tidak kompatibel dengan WordPiece 30K).",
            "Melakukan fine-tuning RoBERTa tanpa learning rate warmup yang memadai pada batch size kecil yang dapat memicu catastrophic forgetting pada epoch pertama."
        ],
        "caseStudy": "Sebuah sistem ekstraksi opini ulasan pelanggan beralih dari BERT-base ke RoBERTa-base tanpa mengubah hyperparameter fine-tuning. Akurasi model justru turun 3%. Analisis menunjukkan format delimiter pasangan kalimat dan learning rate terlalu agresif. Bagaimana penyesuaian format </s></s> dan LR warmup membalikkan keadaan menjadi peningkatan akurasi +4.5%?",
        "academicReferences": [
            "Liu, Y., Ott, M., Goyal, N., Du, J., Joshi, M., Chen, D., Levy, O., Lewis, M., Zettlemoyer, L., & Stoyanov, V. (2019). RoBERTa: A robustly optimized BERT pretraining approach. arXiv preprint arXiv:1907.11692.",
            "Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In NAACL-HLT 2019.",
            "Wang, A., et al. (2018). GLUE: A multi-task benchmark and analysis platform for natural language understanding. In EMNLP 2018."
        ]
    }
})

# ==============================================================================
# Subbab 10.5: ALBERT
# ==============================================================================
code_10_5 = r'''# Perhitungan Penghematan Parameter ALBERT: Factorized Embedding & Weight Sharing
V = 30000     # Ukuran Kosakata
H = 768       # Hidden Dimension Transformer
E = 128       # Factorized Embedding Dimension ALBERT
L = 12        # Jumlah Lapisan Encoder

# 1. Parameter Embedding Matriks
param_bert_emb = V * H
param_albert_emb = (V * E) + (E * H)

# 2. Parameter Layer Transformer (Atensi + FFN per layer)
# Self-Attention (4 * H^2) + FFN (2 * H * 4H) = 12 * H^2 per layer
param_per_layer = 12 * (H ** 2)
param_bert_layers = L * param_per_layer
param_albert_layers = 1 * param_per_layer # Di-share di seluruh 12 layer!

total_bert = param_bert_emb + param_bert_layers
total_albert = param_albert_emb + param_albert_layers

print("Komparasi Efisiensi Parameter: BERT-base vs ALBERT-base:")
print("-" * 65)
print(f"Parameter Embedding  : BERT = {param_bert_emb:,} | ALBERT = {param_albert_emb:,} (Hemat {(1 - param_albert_emb/param_bert_emb)*100:.1f}%)")
print(f"Parameter Lapisan L  : BERT = {param_bert_layers:,} | ALBERT = {param_albert_layers:,} (Hemat {(1 - param_albert_layers/param_bert_layers)*100:.1f}%)")
print("-" * 65)
print(f"Total Parameter Inti : BERT = {total_bert:,} (~{total_bert/1e6:.1f}M)")
print(f"Total Parameter Inti : ALBERT = {total_albert:,} (~{total_albert/1e6:.1f}M)")
print(f"Faktor Reduksi Ukuran: Model ALBERT {total_bert / total_albert:.1f}x lipat lebih ramping!")
'''

subchapters.append({
    "id": "nlp-10-5-albert-parameter-reduction",
    "chapterId": "natural-language-processing-ch-10",
    "title": "ALBERT (Lan et al., 2020): Reduksi Parameter via Factorized Embedding dan Cross-Layer Weight Sharing",
    "description": "Dua inovasi pemangkasan parameter ALBERT: faktorisasi dekomposisi embedding V x E dan pembagian bobot lintas layer, serta tugas Sentence Order Prediction (SOP).",
    "estimatedMinutes": 35,
    "order": 5,
    "content": {
        "theory": (
            "Seiring bertambahnya ukuran model Transformer untuk mendongkrak performa, konsumsi memori GPU dan waktu pelatihan meledak secara eksponensial. **ALBERT** (*A Lite BERT*), yang diperkenalkan oleh Zhenzhong Lan et al. (Google Research & Toyota Technological Institute at Chicago, ICLR 2020), memecahkan kendala skalabilitas ini dengan memperkenalkan dua teknik reduksi parameter berbasis aljabar linier tanpa mengorbankan kapasitas representasi:\n\n"
            "1. **Factorized Embedding Parameterization**: Pada model BERT klasik, dimensi representasi kata leksikal $E$ dipaksa identik dengan dimensi tersembunyi blok Transformer $H$ ($E \equiv H$, misal 768 dimensi). Hal ini tidak optimal dari kacamata teori representasi: embedding kata hanya perlu menangkap informasi leksikal bebas konteks (*context-independent*), sedangkan hidden states bertugas menangkap representasi kontekstual yang sangat rumit (*context-dependent*). ALBERT mendekomposisi matriks embedding berukuran $V \\times H$ menjadi dua matriks berdimensi rendah terfaktorisasi: $V \\times E$ dilanjutkan proyeksi $E \\times H$, di mana $E \\ll H$ (misal $E = 128$). Langkah ini memangkas jumlah parameter embedding dari $O(V \\times H)$ menjadi $O(V \\times E + E \\times H)$, menghasilkan penghematan parameter hingga 80% pada lapisan input.\n\n"
            "2. **Cross-Layer Parameter Sharing**: Seluruh $L$ lapisan Transformer Encoder dalam ALBERT berbagi bobot parameter yang persis sama (*weight sharing*), baik pada sub-lapisan self-attention multi-head maupun pada Feed-Forward Network (FFN). Bobot tidak lagi direplikasi sebanyak 12 atau 24 kali, sehingga model ALBERT-base hanya memiliki sekitar 12 juta parameter (dibandingkan 110 juta parameter pada BERT-base).\n\n"
            "3. **Sentence Order Prediction (SOP)**: Menyadari kelemahan objektif NSP pada BERT yang terlalu mudah ditebak karena mencampuradukkan topik dan koherensi, ALBERT menggantikannya dengan tugas **SOP**. Pasangan kalimat positif diambil dari dua kalimat berurutan asli dalam dokumen, sedangkan pasangan negatif dibentuk dengan menukar urutan kalimat tersebut ($B$ diikuti $A$). Model dipaksa mempelajari penanda koherensi wacana kausalitas yang jauh lebih subtil."
        ),
        "codeSnippet": code_10_5,
        "codeSnippetOutput": run_code_capture_output(code_10_5),
        "realWorldApplication": "Penerapan model pemahaman bahasa berkapasitas memori hemat pada perangkat edge, aplikasi seluler offline, dan server inferensi beranggaran memori terbatas.",
        "commonPitfalls": [
            "Mengasumsikan ALBERT berjalan 10 kali lebih cepat saat komputasi inferensi (meskipun parameternya 10x lebih kecil, jumlah floating point operations / FLOPs tetap setara dengan BERT karena struktur lapisan tetap dihitung bertingkat).",
            "Menerapkan learning rate yang terlalu tinggi pada model ALBERT-xxlarge yang rentan mengalami ketidakstabilan representasi akibat weight sharing.",
            "Lupa menaikkan dimensi proyeksi E ke H pada arsitektur custom sebelum masuk ke multi-head attention."
        ],
        "caseStudy": "Sebuah aplikasi medis berbasis smartphone membutuhkan model NLP on-device dengan batas ukuran biner maksimal 50 MB. Mengapa ALBERT-base (berukuran hanya ~45 MB) mampu dimuat ke memori perangkat sementara BERT-base (~420 MB) ditolak oleh sistem operasi?",
        "academicReferences": [
            "Lan, Z., Chen, M., Goodman, S., Gimpel, K., Sharma, P., & Soricut, R. (2020). ALBERT: A lite BERT for self-supervised learning of language representations. In International Conference on Learning Representations (ICLR 2020).",
            "Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In NAACL-HLT 2019.",
            "Joshi, M., Chen, D., Liu, Y., Weld, D. S., Zettlemoyer, L., & Stoyanov, V. (2020). SpanBERT: Improving pre-training by representing and predicting spans. Transactions of the Association for Computational Linguistics (TACL), 8, 64-77."
        ]
    }
})

# ==============================================================================
# Subbab 10.6: DeBERTa
# ==============================================================================
code_10_6 = r'''import numpy as np

# Simulasi Mekanisme Disentangled Self-Attention DeBERTa (He et al., ICLR 2021)
# Skor Atensi dipecah menjadi 4 komponen:
# Score(i, j) = c_i * c_j^T + c_i * p_{j|i}^T + p_{i|j} * c_j^T + p_{i|j} * p_{j|i}^T (komponen ke-4 redundan)

dim = 4
np.random.seed(42)
c_i = np.random.randn(dim) # Content vector token i
c_j = np.random.randn(dim) # Content vector token j
p_rel_ij = np.random.randn(dim) # Relative position vector (j relatif thd i)
p_rel_ji = np.random.randn(dim) # Relative position vector (i relatif thd j)

# Komponen Atensi DeBERTa: Content-to-Content, Content-to-Position, Position-to-Content
s_cc = np.dot(c_i, c_j)
s_cp = np.dot(c_i, p_rel_ij)
s_pc = np.dot(p_rel_ji, c_j)
total_disentangled_score = (s_cc + s_cp + s_pc) / np.sqrt(3 * dim)

print("Kalkulasi Skor Disentangled Attention DeBERTa (Pengcheng He et al. 2021):")
print("-" * 65)
print(f"1. Content-to-Content (c_i * c_j)   : {s_cc:6.3f}")
print(f"2. Content-to-Position (c_i * p_j|i): {s_cp:6.3f}")
print(f"3. Position-to-Content (p_i|j * c_j): {s_pc:6.3f}")
print("-" * 65)
print(f"Skor Atensi Gabungan Ternormalisasi : {total_disentangled_score:6.3f}")
'''

subchapters.append({
    "id": "nlp-10-6-deberta-disentangled-attention",
    "chapterId": "natural-language-processing-ch-10",
    "title": "DeBERTa (Pengcheng He et al., 2021): Disentangled Attention Mechanism dan Enhanced Mask Decoder",
    "description": "Arsitektur DeBERTa: pemisahan vektor konten dan posisi relatif, formulasi 4-komponen disentangled attention, dan Enhanced Mask Decoder (EMD).",
    "estimatedMinutes": 35,
    "order": 6,
    "content": {
        "theory": (
            "Meskipun RoBERTa dan ALBERT mengoptimalkan proses pelatihan dan efisiensi parameter, keduanya tetap mempertahankan formulasi representasi masukan BERT klasik di mana vektor konten kata dan vektor posisi langsung dijumlahkan secara element-wise ($x_i = e_i + p_i$). Penjumlahan dini ini memaksa ruang fitur konten dan posisi bercampur baur secara terikat (*entangled*).\n\n"
            "**DeBERTa** (*Decoding-enhanced BERT with disentangled attention*), yang dipublikasikan oleh Pengcheng He et al. (Microsoft Research, ICLR 2021), memecahkan kelemahan ini dengan memperkenalkan representasi terurai (**disentangled representation**):\n"
            "Setiap token pada posisi $i$ direpresentasikan oleh dua vektor terpisah: vektor konten $\\mathbf{c}_i$ dan vektor posisi relatif $\\mathbf{p}_{i|j}$. Matriks atensi antartoken ke-$i$ dan ke-$j$ diuraikan menjadi penjumlahan empat komponen interaksi:\n"
            "$$A_{i, j} = \\mathbf{c}_i \\mathbf{c}_j^\\top + \\mathbf{c}_i \\mathbf{p}_{j|i}^\\top + \\mathbf{p}_{i|j} \\mathbf{c}_j^\\top + \\mathbf{p}_{i|j} \\mathbf{p}_{j|i}^\\top$$\n"
            "Di mana:\n"
            "- $\\mathbf{c}_i \\mathbf{c}_j^\\top$ merepresentasikan interaksi **Content-to-Content** (hubungan semantik murni antarkata).\n"
            "- $\\mathbf{c}_i \\mathbf{p}_{j|i}^\\top$ merepresentasikan interaksi **Content-to-Position** (seberapa relevan kata $i$ mencari pengubah pada jarak relatif tertentu).\n"
            "- $\\mathbf{p}_{i|j} \\mathbf{c}_j^\\top$ merepresentasikan interaksi **Position-to-Content** (seberapa relevan posisi asal terhadap kata tujuan).\n"
            "(Suku keempat $\\mathbf{p}_{i|j} \\mathbf{p}_{j|i}^\\top$ dihilangkan karena tidak memuat informasi kontekstual baru di luar jarak konstan).\n\n"
            "Inovasi kedua DeBERTa adalah **Enhanced Mask Decoder (EMD)**. Dalam model BERT, prediksi token `[MASK]` hanya memanfaatkan representasi kontekstual lapisan teratas yang mengabaikan posisi absolut kata dalam kalimat. EMD menyuntikkan kembali vektor posisi absolut tepat sebelum layer softmax proyeksi keluaran, memungkinkan model membedakan peran sintaksis kata yang bergantung erat pada letak absolutnya (seperti subjek di awal kalimat vs objek di akhir kalimat).\n\n"
            "Dengan perbaikan struktural ini, model DeBERTa berskala 1.5 miliar parameter (DeBERTa-v3) berhasil melampaui rata-rata performa manusia (*human baseline*) pada benchmark SuperGLUE (skor 90.3 vs 89.8 manusia)."
        ),
        "codeSnippet": code_10_6,
        "codeSnippetOutput": run_code_capture_output(code_10_6),
        "realWorldApplication": "Model pemenang kompetisi NLU tingkat lanjut (Kaggle NLP Competitions), ekstraksi relasi informasi biomedis bernilai akurasi kritis, dan mesin penilai esai otomatis.",
        "commonPitfalls": [
            "Memaksa menggunakan implementasi standard attention kernel GPU pada DeBERTa tanpa pustaka khusus, yang memicu lonjakan alokasi memori akibat ekspansi matriks posisi relatif.",
            "Mengabaikan Enhanced Mask Decoder saat membangun custom pre-training head dari checkpoint DeBERTa.",
            "Menggunakan learning rate BERT standar yang terlalu tinggi (DeBERTa-v3 sangat sensitif terhadap learning rate, membutuhkan LR halus sekitar 1e-5 hingga 2e-5)."
        ],
        "caseStudy": "Pada kompetisi ekstraksi argumen teks hukum, DeBERTa-v3-large mengungguli RoBERTa-large sebesar 2.8% F1-score. Mengapa pemisahan interaksi Content-to-Position sangat krusial dalam mendeteksi klausa sanggahan yang letak jaraknya terpisah jauh dari klausa utama?",
        "academicReferences": [
            "He, P., Liu, X., Gao, J., & Chen, W. (2021). DeBERTa: Decoding-enhanced BERT with disentangled attention. In International Conference on Learning Representations (ICLR 2021).",
            "He, P., Gao, J., & Chen, W. (2023). DeBERTaV3: Improving DeBERTa using ELECTRA-style pre-training with gradient-disentangled embedding sharing. In ICLR 2023.",
            "Wang, A., et al. (2019). SuperGLUE: A stickier benchmark for general-purpose language understanding systems. In NeurIPS 2019."
        ]
    }
})

# ==============================================================================
# Subbab 10.7: Fine-Tuning BERT Downstream Tasks
# ==============================================================================
code_10_7 = r'''# Klasifikasi Pola Arsitektur Output Head Fine-Tuning BERT
tasks_architecture = [
    ("Tugas NLU", "Format Masukan", "Representasi yang Digunakan", "Lapisan Proyeksi Keluaran"),
    ("Sentimen / Klasifikasi Teks", "[CLS] Kalimat [SEP]", "Vektor Pooling h_[CLS] in R^H", "Linear(H -> K) + Softmax"),
    ("NLI / Premis-Hipotesis", "[CLS] Premis [SEP] Hipotesis [SEP]", "Vektor Pooling h_[CLS] in R^H", "Linear(H -> 3) + Softmax"),
    ("NER / Token POS Tagging", "[CLS] Token_1 ... Token_T [SEP]", "Vektor per token h_1...h_T in R^H", "Linear(H -> |Tagset|) per token"),
    ("SQuAD Question Answering", "[CLS] Pertanyaan [SEP] Konteks [SEP]", "Vektor konteks h_c in R^H", "Dua Linear: Start Logits & End Logits")
]

print("Pola Kepala Proyeksi (Output Heads) Fine-Tuning BERT:")
print("-" * 85)
print(f"{tasks_architecture[0][0]:<25} | {tasks_architecture[0][1]:<32} | {tasks_architecture[0][3]}")
print("-" * 85)
for row in tasks_architecture[1:]:
    print(f"{row[0]:<25} | {row[1]:<32} | {row[3]}")
print("-" * 85)
print("Keunggulan BERT: Satu arsitektur pre-trained dapat diadaptasikan ke seluruh variasi tugas.")
'''

subchapters.append({
    "id": "nlp-10-7-bert-downstream-finetuning-patterns",
    "chapterId": "natural-language-processing-ch-10",
    "title": "Pola Fine-Tuning BERT untuk Berbagai Pola Downstream: Klasifikasi, NLI, NER, dan SQuAD",
    "description": "Protokol adaptasi transfer learning BERT ke berbagai arsitektur tugas: klasifikasi kalimat tunggal, klasifikasi pasangan kalimat, pelabelan token, dan ekstraksi rentang jawaban.",
    "estimatedMinutes": 35,
    "order": 7,
    "content": {
        "theory": (
            "Salah satu inovasi paling transformatif dari BERT adalah kemampuannya menyediakan antarmuka terpadu untuk menyelesaikan keberagaman tugas pemrosesan bahasa alami hanya dengan menambahkan satu lapisan proyeksi linier minimal (*task-specific output layer*) di atas representasi encoder terpra-latih.\n\n"
            "Berdasarkan struktur ruang masukan dan keluaran, fine-tuning BERT dikelompokkan ke dalam empat paradigma arsitektural kanonikal:\n"
            "1. **Klasifikasi Kalimat Tunggal (*Single Sentence Classification*)**: Pada tugas analisis sentimen atau deteksi topik, masukan dienkapsulasi sebagai $[\\text{CLS}]\\ x_1 \\dots x_n\\ [\\text{SEP}]$. Vektor representasi status akhir simpul pertama $\\mathbf{h}_{[\\text{CLS}]} \\in \\mathbb{R}^H$ diteruskan ke lapisan linear berbobot $W \\in \\mathbb{R}^{K \\times H}$ untuk memprediksi probabilitas kelas: $P = \\text{softmax}(W \\mathbf{h}_{[\\text{CLS}]} + b)$.\n"
            "2. **Klasifikasi Pasangan Kalimat (*Sentence Pair Classification*)**: Pada tugas *Natural Language Inference* (NLI) dan kemiripan semantik (STS), dua kalimat dirangkai menjadi satu urutan sekuens $[\\text{CLS}]\\ A\\ [\\text{SEP}]\\ B\\ [\\text{SEP}]$ dengan segment embedding $E_A$ dan $E_B$ yang berbeda. Mekanisme cross-attention di seluruh lapisan encoder memungkinkan interaksi komparatif intensif antara kedua kalimat sebelum klasifikasi dieksekusi di atas token `[CLS]`.\n"
            "3. **Pelabelan Urutan Token (*Sequence Labeling: NER / POS Tagging*)**: Vektor status tersembunyi dari setiap token $\\mathbf{h}_i \\in \\mathbb{R}^H$ (di luar token khusus) diumpankan secara independen ke linear classifier $W \\in \\mathbb{R}^{|T| \\times H}$ untuk menghasilkan prediksi tag BIOES atau POS.\n"
            "4. **Penjawab Pertanyaan Ekstraktif (*Question Answering / SQuAD*)**: Pertanyaan $Q$ dan paragraf konteks $C$ dikonkatenasikan. Model mempelajari dua vektor parameter baru: vektor awal $\\mathbf{S} \\in \\mathbb{R}^H$ dan vektor akhir $\\mathbf{E} \\in \\mathbb{R}^H$. Probabilitas token ke-$i$ dalam konteks menjadi batas awal span jawaban dihitung sebagai produk skalar $P_i^{start} = \\frac{\\exp(\\mathbf{S} \\cdot \\mathbf{h}_i)}{\\sum_j \\exp(\\mathbf{S} \\cdot \\mathbf{h}_j)}$, dan posisi akhir dimodelkan secara serupa oleh $\\mathbf{E}$."
        ),
        "codeSnippet": code_10_7,
        "codeSnippetOutput": run_code_capture_output(code_10_7),
        "realWorldApplication": "Standardisasi seluruh pustaka pipeline NLU modern (Hugging Face AutoModelForSequenceClassification, AutoModelForTokenClassification, AutoModelForQuestionAnswering).",
        "commonPitfalls": [
            "Hanya memperbarui bobot lapisan linear baru dan membekukan bobot BERT (fine-tuning penuh seluruh parameter menghasilkan akurasi yang jauh lebih tinggi).",
            "Salah memetakan label BIO pada token subkata pecahan WordPiece (konvensi standar: hanya token subkata pertama yang dilabeli, sisanya diberi label abaikan -100 pada PyTorch loss).",
            "Menggunakan learning rate default Adam (1e-3) yang langsung menghancurkan bobot pre-trained (wajib menggunakan AdamW dengan LR 2e-5 s.d. 5e-5 dan weight decay 0.01)."
        ],
        "caseStudy": "Dalam evaluasi SQuAD QA, sebuah model memprediksi indeks akhir span jawaban yang mendahului indeks awal span (end_idx < start_idx). Bagaimana mekanisme constraint filtering pasca-inferensi start_idx <= end_idx <= start_idx + max_len memecahkan anomali ini?",
        "academicReferences": [
            "Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In NAACL-HLT 2019.",
            "Rajpurkar, P., Zhang, J., Lopyrev, K., & Liang, P. (2016). SQuAD: 100,000+ questions for machine comprehension of text. In EMNLP 2016.",
            "Loshchilov, I., & Hutter, F. (2019). Decoupled weight decay regularization (AdamW). In ICLR 2019."
        ]
    }
})

# ==============================================================================
# Subbab 10.8: Kompresi & Distilasi Model (DistilBERT)
# ==============================================================================
code_10_8 = r'''import numpy as np

# Simulasi Knowledge Distillation Loss (Hinton et al. 2015 / DistilBERT Sanh et al. 2019)
def distillation_loss(student_logits, teacher_logits, temperature=2.0):
    # Soften probabilities menggunakan Temperature T
    p_student = np.exp(student_logits / temperature) / np.sum(np.exp(student_logits / temperature))
    p_teacher = np.exp(teacher_logits / temperature) / np.sum(np.exp(teacher_logits / temperature))
    
    # Kullback-Leibler Divergence Loss
    kl_div = np.sum(p_teacher * np.log(np.maximum(p_teacher / np.maximum(p_student, 1e-12), 1e-12)))
    return kl_div * (temperature ** 2), p_student, p_teacher

t_logits = np.array([3.5, 1.2, -0.8]) # Prediksi Teacher (BERT-base)
s_logits = np.array([2.1, 0.9, -0.4]) # Prediksi Student (DistilBERT)

loss_kd, p_s, p_t = distillation_loss(s_logits, t_logits, temperature=3.0)

print("Mekanisme Distilasi Pengetahuan DistilBERT (Sanh et al. 2019):")
print("-" * 65)
print(f"Probabilitas Lembut Teacher (T=3.0): {np.round(p_t, 4)}")
print(f"Probabilitas Lembut Student (T=3.0): {np.round(p_s, 4)}")
print("-" * 65)
print(f"Distillation Loss (T^2 * KL-Div)   : {loss_kd:.4f}")
print("Efek Suhu (T): Mengamplifikasi 'dark knowledge' pada probabilitas kelas non-target.")
'''

subchapters.append({
    "id": "nlp-10-8-distilbert-model-compression",
    "chapterId": "natural-language-processing-ch-10",
    "title": "Model Kompresi & Distilasi Pengetahuan: DistilBERT (Sanh et al., 2019) dan TinyBERT",
    "description": "Metodologi kompresi model Transformer via Knowledge Distillation: triple loss function, transfer representasi hidden states dan matriks atensi, serta kompromi kecepatan vs akurasi.",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Meskipun model Transformer Encoder berskala besar menyajikan akurasi luar biasa, ukuran parameternya yang masif (110M parameter pada BERT-base hingga ratusan juta pada RoBERTa-large) menimbulkan latensi inferensi tinggi dan footprint memori yang berat untuk deployment waktu-nyata (*real-time production latency*).\n\n"
            "**Knowledge Distillation** (Hinton et al., 2015) memecahkan kendala ini dengan mentransfer pengetahuan komprehensif dari model besar yang bertindak sebagai guru (**Teacher**) ke model yang lebih kompak dan ramping yang bertindak sebagai murid (**Student**). Model **DistilBERT** (Victor Sanh et al., Hugging Face, 2019) mereduksi separuh lapisan BERT-base (dari 12 layer menjadi 6 layer), memangkas 40% parameter dan mempercepat waktu inferensi hingga 60%, sambil tetap mempertahankan 97% kemampuan pemahaman bahasa aslinya.\n\n"
            "DistilBERT dilatih menggunakan fungsi rugi terpadu **Triple Loss Function**:\n"
            "$$\\mathcal{L}_{total} = \\alpha_{ce} \\mathcal{L}_{ce} + \\alpha_{mlm} \\mathcal{L}_{mlm} + \\alpha_{cos} \\mathcal{L}_{cos}$$\n"
            "1. **Distillation Loss ($\\mathcal{L}_{ce}$)**: Meminimalkan divergensi Kullback-Leibler antara distribusi probabilitas lunak student dan teacher pada suhu $T$:\n"
            "$$p_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}, \\quad \\mathcal{L}_{ce} = T^2 \\sum_i p_i^{\\text{teacher}} \\log \\left( \\frac{p_i^{\\text{teacher}}}{p_i^{\\text{student}}} \\right)$$\n"
            "Penskalaan suhu $T > 1$ melunakkan distribusi probabilitas, mengungkap *'dark knowledge'* berupa korelasi relatif antar kelas yang tidak terdeteksi pada target one-hot keras.\n"
            "2. **Masked Language Modeling Loss ($\\mathcal{L}_{mlm}$)**: Kerugian standar cross-entropy terhadap label kebenaran dasar token yang dimask.\n"
            "3. **Cosine Distance Loss ($\\mathcal{L}_{cos}$)**: Menyelaraskan arah geometris antara vektor status tersembunyi lapisan keluaran student dan teacher.\n\n"
            "Model tingkat lanjut seperti **TinyBERT** (Jiao et al., 2020) memperluas distilasi ini hingga mencakup perataan matriks bobot atensi multi-head dan representasi intermediate embedding layer."
        ),
        "codeSnippet": code_10_8,
        "codeSnippetOutput": run_code_capture_output(code_10_8),
        "realWorldApplication": "Sistem inferensi latensi rendah pada keyboard ponsel cerdas, mesin perutean pesan instan CS otomatis, dan layanan mikro pemeringkat dokumen berbasis CPU.",
        "commonPitfalls": [
            "Melakukan distilasi tanpa penskalaan faktor T^2 pada loss gradient, yang menyebabkan gradien distilasi mengecil secara drastis saat suhu dinaikkan.",
            "Memulai inisialisasi bobot student secara acak (DistilBERT menginisialisasi student dengan menyalin 1 dari setiap 2 lapisan teacher secara bergantian).",
            "Mengabaikan kompresi tokenizer (pada model bertaraf kecil, matriks embedding kosakata sering memakan lebih dari 60% total ukuran memori model)."
        ],
        "caseStudy": "Sebuah aplikasi checkout online mensyaratkan latensi inferensi NLP di bawah 15 milidetik per request. BERT-base membutuhkan 38 ms pada CPU server standar, memicu timeout transaksi. Mengapa mengganti arsitektur ke DistilBERT memangkas latensi menjadi 11 ms dengan degradasi akurasi kurang dari 1.2%?",
        "academicReferences": [
            "Sanh, V., Debut, L., Chaumond, J., & Wolf, T. (2019). DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter. In NeurIPS 2019 EMC^2 Workshop.",
            "Hinton, G., Vinyals, O., & Dean, J. (2015). Distilling the knowledge in a neural network. In NeurIPS 2014 Deep Learning Workshop.",
            "Jiao, X., Yin, Y., Shang, L., Jiang, X., Chen, X., Li, L., Wang, F., & Liu, Q. (2020). TinyBERT: Distilling BERT for natural language understanding. In Findings of EMNLP 2020."
        ]
    }
})

# ==============================================================================
# Subbab 10.9: BERTology
# ==============================================================================
code_10_9 = r'''# Ringkasan Temuan Diagnostik Empiris BERTology (Rogers et al., TACL 2020)
bertology_insights = [
    ("Tingkatan Lapisan BERT", "Informasi Linguistik yang Terkodekan", "Rujukan Temuan Probing"),
    ("Lapisan Bawah (1-3)", "Morfologi permukaan, ejaan subkata, dan representasi posisi linier", "Tenney et al. (2019)"),
    ("Lapisan Tengah (4-7)", "Sintaksis gramatikal: dependensi kepala, pelabelan POS, dan struktur konstituen", "Hewitt & Manning (2019)"),
    ("Lapisan Atas (8-12)", "Semantik tingkat tinggi: peran semantik, coreference resolution, dan relasi wacana", "Jawahar et al. (2019)"),
    ("Atensi Head Khusus", "Head tertentu mengkhususkan diri pada token [SEP] atau tanda titik sebagai penampung", "Clark et al. (2019)")
]

print("Taksonomi Representasi Internal BERT (Disiplin BERTology):")
print("-" * 80)
print(f"{bertology_insights[0][0]:<22} | {bertology_insights[0][1]:<45} | {bertology_insights[0][2]}")
print("-" * 80)
for row in bertology_insights[1:]:
    print(f"{row[0]:<22} | {row[1]:<45} | {row[2]}")
print("-" * 80)
print("Kesimpulan Ilmiah: BERT mereplikasi Classical NLP Pipeline secara spontan dari bawah ke atas!")
'''

subchapters.append({
    "id": "nlp-10-9-bertology-internal-representations",
    "chapterId": "natural-language-processing-ch-10",
    "title": "Analisis Representasi Internal BERT (BERTology): Apa yang Sebenarnya Dipelajari oleh Atensi Multi-Head?",
    "description": "Kajian empiris bidang BERTology: dekonstruksi lapisan representasi linguistik, pohon dependensi dalam ruang Euclidean tersembunyi, dan analisis peran fungsional attention heads.",
    "estimatedMinutes": 35,
    "order": 9,
    "content": {
        "theory": (
            "Keberhasilan luar biasa BERT memicu lahirnya cabang studi empiris baru dalam pemrosesan bahasa alami yang dikenal sebagai **BERTology** (Rogers et al., TACL 2020). Bidang interdisipliner ini membedah arsitektur internal kotak hitam (*black-box*) model untuk mengungkap representasi linguistik apa saja yang sebenarnya dipelajari oleh parameter Transformer selama pra-pelatihan tanpa supervisi.\n\n"
            "Melalui serangkaian metodologi diagnostik (*probing tasks*, *attention visualization*, dan *structural probes*), para peneliti mengungkap temuan-temuan ilmiah yang menakjubkan:\n"
            "1. **Replikasi Pipeline NLP Klasik Secara Spontan (*Classical NLP Pipeline Pipeline in a Model*)**: Tenney et al. (2019) dan Jawahar et al. (2019) menemukan bahwa representasi hierarkis bertingkat dalam lapisan-lapisan BERT mereplikasi tahapan pipeline pemrosesan bahasa alami tradisional secara berurutan:\n"
            "   - **Lapisan 1–3 (Bawah)**: Mengkodekan fitur permukaan (*surface features*), bentuk morfologis subkata, dan posisi linear token.\n"
            "   - **Lapisan 4–7 (Tengah)**: Mengkhususkan diri pada sintaksis murni (*syntactic abstractions*), seperti pelabelan kelas kata part-of-speech dan relasi pohon dependensi.\n"
            "   - **Lapisan 8–12 (Atas)**: Mengonsolidasikan makna semantik kompleks, peran semantik (*Semantic Role Labeling*), relasi koreferensi entitas, dan ketergantungan pragmatik wacana global.\n"
            "2. **Pohon Sintaksis dalam Ruang Geometris Tersembunyi**: John Hewitt dan Christopher D. Manning (NAACL 2019) membuktikan melalui *Structural Probe* bahwa pohon dependensi sintaksis tertanam secara inheren dalam geometri ruang tersembunyi BERT: jarak kuadratik Euclidean antar representasi kata $\\|\\mathbf{h}_i - \\mathbf{h}_j\\|^2$ berbanding lurus secara linier dengan jarak jalur pohon sintaksis acuan pada Penn Treebank.\n"
            "3. **Spesialisasi Kepala Atensi (*Attention Heads Specialization*)**: Clark et al. (2019) membuktikan bahwa kepala-kepala atensi individu mengembangkan fungsi terarah spesifik: terdapat head yang secara konsisten menghubungkan kata kerja ke objek langsungnya, head yang mengaitkan kata sifat ke kata bendanya, dan sejumlah head yang bertindak sebagai *delimiter absorbers* (mengarahkan atensi dominan ke token `[SEP]` ketika tidak ada relasi lokal yang kuat)."
        ),
        "codeSnippet": code_10_9,
        "codeSnippetOutput": run_code_capture_output(code_10_9),
        "realWorldApplication": "Pengembangan teknik interpretasi kecerdasan buatan (*Explainable AI* / XAI), audit bias representasi gender/sosial pada model korporat, dan pemangkasan kepala atensi redundan (*head pruning*).",
        "commonPitfalls": [
            "Menafsirkan bobot matriks atensi secara langsung sebagai penjelasan kausal mutlak tanpa verifikasi gradien (perdebatan ilmiah 'Attention is not Explanation').",
            "Mengasumsikan setiap kepala atensi memiliki peran linguistik yang bermakna (sebagian besar head atensi bersifat redundan dan dapat dipangkas tanpa penurunan akurasi).",
            "Mengabaikan fakta bahwa representasi lapisan puncak BERT sangat terspesialisasi pada tugas pre-training (MLM) sehingga lapisan kedua dari atas sering menghasilkan fitur transfer yang lebih baik."
        ],
        "caseStudy": "Dalam audit kepatuhan AI perbankan, regulator menuntut penjelasan mengapa model penilai kredit teks menolak aplikasi pinjaman. Bagaimana visualisasi atensi multi-head dan analisis representasi internal membantu membuktikan bahwa keputusan model tidak bias terhadap entitas demografis tertentu?",
        "academicReferences": [
            "Rogers, A., Kovaleva, O., & Rumshisky, A. (2020). A primer in BERTology: What we know about how BERT works. Transactions of the Association for Computational Linguistics (TACL), 8, 842–866.",
            "Hewitt, J., & Manning, C. D. (2019). A structural probe for finding syntax in word representations. In NAACL-HLT 2019, pages 4129–4138.",
            "Clark, K., Khandelwal, U., Levy, O., & Manning, C. D. (2019). What does BERT look with at? An analysis of BERT's attention. In ACL 2019 Workshop BlackboxNLP."
        ]
    }
})

# ==============================================================================
# Subbab 10.10: Implementasi Sederhana Multi-Head Attention & Encoder Block
# ==============================================================================
code_10_10 = r'''import numpy as np

# Implementasi Lengkap Transformer Encoder Block Mandiri Berbasis NumPy
class SimpleTransformerEncoderBlock:
    def __init__(self, d_model=16, num_heads=2, d_ff=32, seed=42):
        np.random.seed(seed)
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        self.d_ff = d_ff
        
        # Proyeksi Linear Multi-Head Attention
        self.W_q = np.random.randn(d_model, d_model) * 0.1
        self.W_k = np.random.randn(d_model, d_model) * 0.1
        self.W_v = np.random.randn(d_model, d_model) * 0.1
        self.W_o = np.random.randn(d_model, d_model) * 0.1
        
        # Feed-Forward Network
        self.W_ff1 = np.random.randn(d_model, d_ff) * 0.1
        self.b_ff1 = np.zeros(d_ff)
        self.W_ff2 = np.random.randn(d_ff, d_model) * 0.1
        self.b_ff2 = np.zeros(d_model)
        
    def layer_norm(self, x, eps=1e-5):
        mean = np.mean(x, axis=-1, keepdims=True)
        var = np.var(x, axis=-1, keepdims=True)
        return (x - mean) / np.sqrt(var + eps)
        
    def forward(self, x):
        # 1. Multi-Head Attention + Residual Connection (Pre-LN Scheme)
        norm_x = self.layer_norm(x)
        T, D = x.shape
        Q = np.dot(norm_x, self.W_q)
        K = np.dot(norm_x, self.W_k)
        V = np.dot(norm_x, self.W_v)
        
        # Split Heads
        Q_h = Q.reshape(T, self.num_heads, self.d_k).transpose(1, 0, 2)
        K_h = K.reshape(T, self.num_heads, self.d_k).transpose(1, 0, 2)
        V_h = V.reshape(T, self.num_heads, self.d_k).transpose(1, 0, 2)
        
        scores = np.matmul(Q_h, K_h.transpose(0, 2, 1)) / np.sqrt(self.d_k)
        weights = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
        weights /= np.sum(weights, axis=-1, keepdims=True)
        attn_out = np.matmul(weights, V_h).transpose(1, 0, 2).reshape(T, D)
        attn_proj = np.dot(attn_out, self.W_o)
        
        x_res1 = x + attn_proj
        
        # 2. Feed-Forward Network + Residual Connection
        norm_x2 = self.layer_norm(x_res1)
        ff_hidden = np.maximum(0, np.dot(norm_x2, self.W_ff1) + self.b_ff1) # ReLU activation
        ff_out = np.dot(ff_hidden, self.W_ff2) + self.b_ff2
        
        out = x_res1 + ff_out
        return out

encoder = SimpleTransformerEncoderBlock(d_model=16, num_heads=2, d_ff=32)
seq_input = np.random.randn(4, 16) # 4 token, embedding 16-d
encoded_output = encoder.forward(seq_input)

print("Eksekusi Blok Transformer Encoder Mandiri (NumPy Implementation):")
print("-" * 65)
print(f"Bentuk Input Tensor  : {seq_input.shape} (T=4 token, d_model=16)")
print(f"Bentuk Output Tensor : {encoded_output.shape} (T=4 token, d_model=16)")
print("-" * 65)
print(f"Norm L2 Input Tensor : {np.linalg.norm(seq_input):.4f}")
print(f"Norm L2 Output Tensor: {np.linalg.norm(encoded_output):.4f}")
print("Verifikasi: Koneksi residual dan layer norm menjaga stabilitas nilai aktivasi.")
'''

subchapters.append({
    "id": "nlp-10-10-transformer-encoder-numpy-implementation",
    "chapterId": "natural-language-processing-ch-10",
    "title": "Implementasi Sederhana Multi-Head Self-Attention dan Transformer Encoder Block Mandiri Berbasis NumPy",
    "description": "Konstruksi komprehensif blok Transformer Encoder dari nol menggunakan aljabar matriks NumPy: proyeksi multi-head, layer normalization, residual stream, dan feed-forward network.",
    "estimatedMinutes": 35,
    "order": 10,
    "content": {
        "theory": (
            "Guna memahami mekanisme internal model bahasa berbasis Transformer secara mendalam tanpa terdistorsi oleh abstraksi pustaka tingkat tinggi, pengembang kecerdasan buatan harus mampu merekonstruksi alur komputasi blok **Transformer Encoder** dari prinsip matematika pertama (*first principles*) menggunakan operasi dasar aljabar linier matriks.\n\n"
            "Sebuah blok Transformer Encoder lengkap terdiri dari dua sub-lapisan inti yang dirangkai secara berurutan dalam skema koneksi residual dan normalisasi lapisan:\n"
            "1. **Sub-Lapisan Multi-Head Self-Attention**: Menerima tensor representasi tersembunyi masukan $\\mathbf{X} \\in \\mathbb{R}^{T \\times d_{model}}$. Tensor ini diproyeksikan secara linear menjadi tiga representasi melalui matriks terpelajar $W_Q, W_K, W_V \\in \\mathbb{R}^{d_{model} \\times d_{model}}$. Tensor tersebut kemudian dipecah (*split*) ke dalam $h$ kepala independen berdimensi $d_k = d_{model} / h$. Untuk setiap kepala, matriks probabilitas atensi dihitung menggunakan fungsi softmax berskala $\\text{softmax}(Q_i K_i^\\top / \\sqrt{d_k})$. Seluruh hasil kepala dikonkatenasikan kembali dan diproyeksikan melalui matriks keluaran $W_O$.\n\n"
            "2. **Sub-Lapisan Feed-Forward Network (FFN)**: Bekerja secara independen pada setiap posisi token (*position-wise*), mentransformasikan representasi melalui ekspansi ruang laten non-linear dua lapis:\n"
            "$$\\text{FFN}(\\mathbf{x}) = \\max(0, \\mathbf{x} W_1 + b_1) W_2 + b_2$$\n"
            "di mana dimensi perantara biasanya diperluas empat kali lipat ($d_{ff} = 4 \\times d_{model}$).\n\n"
            "3. **Skema Normalisasi Pre-LN & Residual Stream**: Mengalirkan sinyal masukan secara aditif melintasi sub-lapisan ($\\mathbf{x} + \\text{Sublayer}(\\text{LN}(\\mathbf{x}))$). Normalisasi lapisan (*Layer Normalization*) menghitung rata-rata $\\mu$ dan variansi $\\sigma^2$ pada dimensi fitur independen untuk setiap token:\n"
            "$$\\text{LN}(\\mathbf{x}) = \\frac{\\mathbf{x} - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}} \\odot \\gamma + \\beta$$\n"
            "menjaga stabilitas gradien selama perambatan mundur pada jaringan multi-lapis."
        ),
        "codeSnippet": code_10_10,
        "codeSnippetOutput": run_code_capture_output(code_10_10),
        "realWorldApplication": "Pondasi konseptual arsitektur internal runtime inferensi ONNX, perancangan custom kernel atensi pada akselerator AI edge, dan optimasi kuantisasi bobot model.",
        "commonPitfalls": [
            "Salah melakukan reshape dimensi saat pemisahan head atensi (urutan transpose yang keliru mencampuradukkan data antarlangkah waktu time-steps).",
            "Menerapkan normalisasi batch (BatchNorm) alih-alih LayerNorm (BatchNorm gagal pada teks sekuensial akibat variasi panjang kalimat dan batch size kecil).",
            "Lupa menambahkan skalar stabilitas numerik epsilon pada penyebut LayerNorm yang memicu pembagian nol jika variansi fitur homogen."
        ],
        "caseStudy": "Sebuah tim engineer merancang inferensi Transformer khusus menggunakan C++/NumPy tanpa PyTorch. Mengapa kesalahan urutan transpose pada tensor multi-head [batch, time, head, dim] menghasilkan teks acak meskipun pembobotan bobot pre-trained sudah disalin dengan benar?",
        "academicReferences": [
            "Vaswani, A., et al. (2017). Attention is all you need. In NeurIPS 2017.",
            "Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In NAACL-HLT 2019.",
            "Ba, J. L., Kiros, J. R., & Hinton, G. E. (2016). Layer normalization. arXiv preprint arXiv:1607.06450."
        ]
    }
})

def main():
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(output_dir, "nlp_ch10_data.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(subchapters, f, indent=2, ensure_ascii=False)
    print(f"Generated {len(subchapters)} subchapters for Bab 10 NLP -> {output_file}")

if __name__ == "__main__":
    main()
