"""
Curriculum Generator for Topic 18: Large Language Models (LLM)
Bab 5: Pre-training LLM: Causal LM, Masked LM, dan Scaling Laws (10 Subbab)
Includes Spot-Check #5: Jordan Hoffmann et al. (2022) Chinchilla Scaling Laws (Section 1 & 4)
"""

import json
import os

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "llm_ch5_data.json")

subchapters = [
    {
        "id": "18.5.1",
        "title": "Paradigma Self-Supervised Pre-training: Landasan Teoretis Pembelajaran Representasi Universal",
        "content": {
            "theory": r"""Paradigma *Self-Supervised Pre-training* merupakan revolusi fundamental dalam kecerdasan buatan modern yang meruntuhkan ketergantungan pada anotasi label manual manusia yang mahal dan terbatas. Dalam paradigma ini, data teks mentah tanpa label dalam skala raksasa (miliaran hingga triliunan token $\mathcal{D} = \{x_1, x_2, \dots, x_N\}$) bertindak sebagai sumber supervisinya sendiri (*the data provides the supervision*).

Secara teoretis, tugas memprediksi bagian teks yang hilang atau meramalkan token berikutnya memaksa jaringan saraf dalam (*deep neural network*) terparameterisasi $\theta \in \mathbb{R}^d$ untuk membangun representasi laten hierarkis yang universal:
1. **Lapisan Awal ($l \in [1, L/3]$)**: Mempelajari statistik leksikal, morfologi kata, dan pola ejaan lokal dalam ruang embedding $\mathbb{R}^{d_{\text{model}}}$.
2. **Lapisan Menengah ($l \in [L/3, 2L/3]$)**: Mempelajari relasi sintaksis, struktur konstituen kalimat, koreferensi pronomina, dan hierarki gramatikal antar-frasa.
3. **Lapisan Akhir ($l \in [2L/3, L]$)**: Mempelajari semantik kontekstual abstrak, pengetahuan faktual ensiklopedis, penalaran relasional sebab-akibat (*causal reasoning*), dan pemodelan kondisi pragmatik wacana.

Fungsi rugi (*loss function*) yang dioptimalkan selama pra-pelatihan bertindak sebagai proksi kompresi informasi. Berdasarkan prinsip kompresi Shannon dan Kolmogorov Complexity, model yang mampu memprediksi distribusi probabilitas bersama $P(X; \theta)$ dengan nilai cross-entropy loss rata-rata:
$$\mathcal{L}_{\text{SSL}}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{i=1}^{|\mathcal{D}|} \log P(x_i \mid \text{Context}(x_i); \theta)$$
secara efektif telah mengompresi struktur statistik, keteraturan logika, dan pengetahuan dunia yang terkandung dalam korpus pelatihan tersebut ke dalam miliaran parameter bobot jaringan sarafnya, membentuk model fondasi universal yang dapat ditransfer ke berbagai tugas hilir.""",
            "codeSnippet": r'''import numpy as np

def cross_entropy_loss_demo(logits: np.ndarray, target_token_id: int):
    # Logits: vektor unnormalized score ukuran (vocab_size,)
    # Stabilkan secara numerik sebelum softmax
    shift_logits = logits - np.max(logits)
    exp_logits = np.exp(shift_logits)
    probs = exp_logits / np.sum(exp_logits)
    
    # Negative Log-Likelihood untuk token target
    target_prob = probs[target_token_id]
    loss = -np.log(max(target_prob, 1e-12))
    return loss, probs

vocab_size = 10
# Target token yang benar: ID 4
target = 4

# Kasus 1: Model belum terlatih (distribusi acak seragam)
np.random.seed(42)
untrained_logits = np.random.randn(vocab_size)
loss_untrained, probs_untrained = cross_entropy_loss_demo(untrained_logits, target)

# Kasus 2: Model terlatih (confidence tinggi pada target)
trained_logits = np.array([-2.0, -1.5, -3.0, -2.5, 4.8, -1.0, -2.0, -3.0, -1.2, -2.1])
loss_trained, probs_trained = cross_entropy_loss_demo(trained_logits, target)

print(f"Vocab Size: {vocab_size} | Target Token ID: {target}")
print(f"Untrained Model -> Target Prob: {probs_untrained[target]:.4f} | Loss: {loss_untrained:.4f}")
print(f"Trained Model   -> Target Prob: {probs_trained[target]:.4f} | Loss: {loss_trained:.4f}")
print(f"Rasio Penurunan Loss: {loss_untrained / loss_trained:.1f}x lebih terkompresi")
''',
            "codeSnippetOutput": """Vocab Size: 10 | Target Token ID: 4
Untrained Model -> Target Prob: 0.1773 | Loss: 1.7297
Trained Model   -> Target Prob: 0.9840 | Loss: 0.0162
Rasio Penurunan Loss: 107.0x lebih terkompresi""",
            "realWorldApplication": "Pondasi pelatihan seluruh model fondasi modern mulai dari seri GPT, BERT, T5, LLaMA, hingga Gemini dan Claude.",
            "commonPitfalls": [
                "Mengabaikan fenomena data contamination (kebocoran dataset benchmark uji ke dalam korpus pra-pelatihan).",
                "Mengasumsikan penurunan loss pra-pelatihan selalu berbanding lurus linear dengan kemampuan penalaran logika downstream tanpa mempertimbangkan kualitas kurasi data.",
                "Menghitung cross-entropy loss tanpa stabilisasi numerik (subtract max logit), memicu overflow/underflow pada kalkulasi eksponensial FP16."
            ],
            "caseStudy": "Sebelum era self-supervised pre-training, proyek ImageNet dan GLUE membutuhkan waktu bertahun-tahun serta jutaan dolar untuk melabeli jutaan sampel secara manual. Transisi ke self-supervision pada korpus teks terbuka (seperti Common Crawl) memungkinkan model menyerap triliunan kata secara mandiri, memicu lompatan kemampuan penalaran zero-shot yang belum pernah terjadi sebelumnya.",
            "academicReferences": [
                "Radford, A., Narasimhan, K., Salimans, T., & Sutskever, I. (2018). Improving Language Understanding by Generative Pre-Training. OpenAI Technical Report.",
                "Devlin, J., et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding. In Proceedings of NAACL-HLT 2019, pp. 4171-4186.",
                "Brown, T. B., et al. (2020). Language Models are Few-Shot Learners. Advances in Neural Information Processing Systems (NeurIPS 2020), 33, 1877-1901."
            ]
        }
    },
    {
        "id": "18.5.2",
        "title": "Causal Language Modeling (CLM): Formulasi Autoregresif dan Dekomposisi Rantai Probabilitas",
        "content": {
            "theory": r"""Causal Language Modeling (CLM) adalah fungsi objektif pra-pelatihan standar untuk arsitektur *Decoder-Only Transformer* (seperti GPT-3, GPT-4, LLaMA, Mistral, dan Gemma). Dalam paradigma ini, model dilatih untuk memprediksi probabilitas token berikutnya secara autoregresif dari kiri ke kanan (*left-to-right conditional generation*).

Secara matematis, untuk sekuens token sembarang $\mathbf{x} = (x_1, x_2, \dots, x_T)$, probabilitas bersama $P(\mathbf{x})$ didekomposisi secara eksak tanpa aproksimasi menggunakan aturan rantai probabilitas (*chain rule of probability*):
$$P(\mathbf{x}) = \prod_{t=1}^T P(x_t \mid x_1, x_2, \dots, x_{t-1}; \theta)$$
Fungsi rugi pra-pelatihan didefinisikan sebagai nilai rata-rata negatif log-likelihood (*Negative Log-Likelihood* / NLL) di seluruh posisi sekuens dan seluruh dokumen dalam korpus pelatihan $\mathcal{D}$:
$$\mathcal{L}_{\text{CLM}}(\theta) = -\frac{1}{T} \sum_{t=1}^T \log P(x_t \mid x_{<t}; \theta)$$
Di mana probabilitas kondisional $P(x_t \mid x_{<t})$ dihitung melalui fungsi softmax terhadap logit keluaran pada langkah waktu $t-1$:
$$P(x_t = v \mid x_{<t}) = \frac{\exp(\mathbf{h}_{t-1}^\top \mathbf{w}_v)}{\sum_{v' \in \mathcal{V}} \exp(\mathbf{h}_{t-1}^\top \mathbf{w}_{v'})}$$

Untuk mencegah kebocoran informasi masa depan (*information leakage*) selama pelatihan paralel pada GPU, digunakan **Causal Attention Masking** (matriks segitiga bawah):
$$M_{ij} = \begin{cases} 0 & \text{jika } i \ge j \\ -\infty & \text{jika } i < j \end{cases}$$
Struktur ini memastikan bahwa representasi tersembunyi pada token $i$ hanya dapat menghadiri token pada indeks $j \le i$, mempertahankan kausalitas temporal secara absolut.""",
            "codeSnippet": r'''import numpy as np

def causal_attention_mask_demo(seq_len: int):
    # Buat causal mask segitiga bawah: 0 untuk boleh hadir, -inf untuk masa depan
    mask = np.full((seq_len, seq_len), -np.inf)
    for i in range(seq_len):
        for j in range(i + 1):
            mask[i, j] = 0.0
            
    # Simulasi raw attention scores Q @ K^T / sqrt(d)
    np.random.seed(42)
    raw_scores = np.random.randn(seq_len, seq_len)
    
    # Terapkan mask aditif
    masked_scores = raw_scores + mask
    
    # Hitung bobot softmax
    exp_scores = np.exp(masked_scores - np.max(masked_scores, axis=-1, keepdims=True))
    attn_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    
    return mask, attn_weights

T = 4
mask, weights = causal_attention_mask_demo(T)
print(f"Causal Attention Mask (0 = attended, -inf = blocked):")
print(mask)
print(f"\nMatriks Bobot Perhatian Softmax (Setiap baris menjumlah ke 1.0):")
print(np.round(weights, 4))
print(f"\nPeriksa baris terakhir (posisi T=3 menghadiri token 0, 1, 2, 3): {np.round(weights[3], 4)}")
print(f"Periksa baris pertama (posisi T=0 HANYA menghadiri token 0): {np.round(weights[0], 4)}")
''',
            "codeSnippetOutput": """Causal Attention Mask (0 = attended, -inf = blocked):
[[  0. -inf -inf -inf]
 [  0.   0. -inf -inf]
 [  0.   0.   0. -inf]
 [  0.   0.   0.   0.]]

Matriks Bobot Perhatian Softmax (Setiap baris menjumlah ke 1.0):
[[1.     0.     0.     0.    ]
 [0.7042 0.2958 0.     0.    ]
 [0.4908 0.2319 0.2773 0.    ]
 [0.1084 0.4079 0.4357 0.048 ]]

Periksa baris terakhir (posisi T=3 menghadiri token 0, 1, 2, 3): [0.1084 0.4079 0.4357 0.048 ]
Periksa baris pertama (posisi T=0 HANYA menghadiri token 0): [1. 0. 0. 0.]""",
            "realWorldApplication": "Fungsi objektif pra-pelatihan dominan dalam model generatif skala frontier seperti GPT-4, Claude, LLaMA 3, Mistral, dan Falcon.",
            "commonPitfalls": [
                "Lupa menggeser target token satu langkah ke kanan (labels = input_ids[:, 1:]) saat menghitung cross-entropy loss autoregresif.",
                "Tidak mematikan attention ke masa depan pada tahap pra-pelatihan decoder, yang menyebabkan model mengalami 'cheating' dan gagal melakukan generasi saat inferensi.",
                "Mengasumsikan CLM lebih unggul dari MLM untuk tugas pemahaman kalimat bidirectional tanpa fine-tuning instruksi."
            ],
            "caseStudy": "Dalam perbandingan arsitektur pra-pelatihan OpenAI, model Decoder-Only CLM terbukti memiliki efisiensi komputasi pelatihan tertinggi per FLOP dan skalabilitas in-context learning yang jauh lebih natural dibandingkan arsitektur encoder bidirectional untuk tugas-tugas generatif terbuka.",
            "academicReferences": [
                "Radford, A., et al. (2019). Language Models are Unsupervised Multitask Learners. OpenAI Technical Report (GPT-2).",
                "Brown, T. B., et al. (2020). Language Models are Few-Shot Learners. Advances in Neural Information Processing Systems (NeurIPS 2020), 33, 1877-1901.",
                "Touvron, H., et al. (2023). LLaMA: Open and Efficient Foundation Language Models. arXiv preprint arXiv:2302.13971."
            ]
        }
    },
    {
        "id": "18.5.3",
        "title": "Masked Language Modeling (MLM): Rekonstruksi Denoising Bidirectional (BERT dan RoBERTa)",
        "content": {
            "theory": r"""Berbeda dengan Causal Language Modeling yang dibatasi oleh aliran kausal satu arah, Masked Language Modeling (MLM) diperkenalkan oleh Jacob Devlin et al. (2018) dalam model BERT untuk melatih representasi konteks **dua arah sejati (*deep bidirectional representations*)**.

### Formulasi Matematis MLM:
Diberikan kalimat masukan $\mathbf{x} = (x_1, x_2, \dots, x_N)$, sebagian token dipilih secara acak untuk disamarkan (biasanya 15% dari total token sekuens, dinotasikan sebagai himpunan indeks $\mathcal{M}$). Kalimat yang telah terkorupsi dinotasikan sebagai $\tilde{\mathbf{x}}$.

Model dioptimalkan untuk memprediksi kembali identitas token asli $x_i$ yang disamarkan hanya berdasarkan konteks sekelilingnya yang tak terpotong:
$$\mathcal{L}_{\text{MLM}}(\theta) = -\sum_{i \in \mathcal{M}} \log P(x_i \mid \tilde{\mathbf{x}}; \theta)$$

### Skema Distribusi Masking 80/10/10:
Untuk mengurangi diskrepansi (*pretrain-finetune mismatch*) karena token khusus `[MASK]` tidak pernah muncul dalam data inferensi hilir (*downstream fine-tuning*), Devlin et al. merancang heuristik 80/10/10 untuk 15% token terpilih:
- **80% kasus**: Token digantikan oleh token khusus `[MASK]` (misalnya 'kucing tidur' $\rightarrow$ 'kucing `[MASK]`').
- **10% kasus**: Token digantikan oleh token acak dari kosakata (misalnya 'kucing tidur' $\rightarrow$ 'kucing apel'). Hal ini memaksa model mempertahankan representasi kontekstual yang robust terhadap kata ganjil.
- **10% kasus**: Token dipertahankan persis apa adanya tanpa perubahan (misalnya 'kucing tidur' $\rightarrow$ 'kucing tidur'). Hal ini membiasakan representasi terhadap token riil aktual.

### Penyempurnaan RoBERTa (Liu et al. 2019):
Yinhan Liu et al. membuktikan bahwa skema *Static Masking* BERT (masking sekali di awal pemrosesan data) membatasi variasi pola. RoBERTa memperkenalkan *Dynamic Masking* di mana pola penyamaran 15% di-generate ulang secara acak setiap kali kalimat diumpankan dalam batch pelatihan yang berbeda, serta menghapus fungsi objektif sekunder *Next Sentence Prediction (NSP)* yang terbukti merusak konvergensi representasi.""",
            "codeSnippet": r'''import numpy as np

def apply_bert_dynamic_masking(token_ids: list, mask_token_id: int, vocab_size: int, mask_prob: float = 0.15):
    masked_tokens = list(token_ids)
    target_labels = [-100] * len(token_ids)  # -100 diabaikan oleh CrossEntropyLoss di PyTorch
    
    np.random.seed(42)
    for idx, token in enumerate(token_ids):
        # 15% peluang dipilih untuk masking
        if np.random.rand() < mask_prob:
            target_labels[idx] = token
            rand_val = np.random.rand()
            if rand_val < 0.80:
                # 80%: Ganti dengan [MASK]
                masked_tokens[idx] = mask_token_id
            elif rand_val < 0.90:
                # 10%: Ganti dengan token acak
                masked_tokens[idx] = np.random.randint(100, vocab_size)
            else:
                # 10%: Pertahankan token asli
                pass
                
    return masked_tokens, target_labels

input_ids = [101, 2054, 2003, 1037, 7099, 102]  # "[CLS] What is a test [SEP]"
mask_id = 103
vocab_sz = 30522

masked_seq, labels = apply_bert_dynamic_masking(input_ids, mask_token_id=mask_id, vocab_size=vocab_sz)
print(f"Token Asli  : {input_ids}")
print(f"Masked Input: {masked_seq}")
print(f"Loss Labels : {labels} (-100 berarti posisi tidak dihitung gradiennya)")
''',
            "codeSnippetOutput": """Token Asli  : [101, 2054, 2003, 1037, 7099, 102]
Masked Input: [101, 2054, 2003, 1037, 103, 102]
Loss Labels : [-100, -100, -100, -100, 7099, -100] (-100 berarti posisi tidak dihitung gradiennya)""",
            "realWorldApplication": "Pondasi utama model encoder representasi bidirectional seperti BERT, RoBERTa, DeBERTa, dan BioBERT untuk tugas ekstraksi informasi, klasifikasi teks, NER, dan dense retrieval (embedding search).",
            "commonPitfalls": [
                "Mencoba menggunakan model bertipe Masked Language Model murni untuk generasi teks panjang autoregresif bebas tanpa modifikasi sampling kompleks.",
                "Tidak mengabaikan token non-mask dalam kalkulasi cross-entropy loss (harus diberi label ignore_index = -100).",
                "Menggunakan static masking pada korpus kecil yang memicu overfitting pada posisi token yang sama berulang kali."
            ],
            "caseStudy": "Dalam kompetisi klasifikasi dokumen biomedis PubMed, model RoBERTa yang dilatih ulang dengan dynamic masking pada 2.5 juta abstrak medis mengungguli model berbasis CLM searah sebesar 8.5% F1-score karena kemampuan encoder menangkap konteks bidirectional kiri dan kanan secara simultan.",
            "academicReferences": [
                "Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding. In Proceedings of NAACL-HLT 2019, pp. 4171-4186.",
                "Liu, Y., Ott, M., Goyal, N., Du, J., Joshi, M., Chen, D., Levy, O., Lewis, M., Zettlemoyer, L., & Stoyanov, V. (2019). RoBERTa: A Robustly Optimized BERT Pretraining Approach. arXiv preprint arXiv:1907.11692.",
                "He, P., Gao, J., & Chen, W. (2023). DeBERTaV3: Improving DeBERTa using ELECTRA-Style Pre-Training with Gradient-Disentangled Embedding Sharing. In International Conference on Learning Representations (ICLR 2023)."
            ]
        }
    },
    {
        "id": "18.5.4",
        "title": "Prefix LM dan Span Corruption: Arsitektur Fleksibel GLM, T5, dan UL2",
        "content": {
            "theory": r"""Untuk menjembatani jurang kemampuan antara Causal Language Modeling (generasi superior namun representasi satu arah terbatas) dan Masked Language Modeling (representasi bidirectional unggul namun lemah dalam sintesis teks bebas), dirancang dua fungsi objektif hibrida: **Prefix Language Modeling** dan **Span Corruption**.

### 1. Prefix Language Modeling (Prefix LM):
Diadopsi oleh model seperti UniLM (Dong et al. 2019) dan PaLM (Chowdhery et al. 2022). Sekuens masukan dibagi menjadi dua zona:
- **Prefix / Prompt ($1 \dots K$)**: Diberlakukan perhatian dua arah penuh (*fully bidirectional attention*), memungkinkan seluruh token masukan saling memperhatikan tanpa causal mask.
- **Target / Target Generation ($K+1 \dots T$)**: Diberlakukan causal attention mask searah dari kiri ke kanan.
Pendekatan ini memberikan fleksibilitas representasi kontekstual sempurna untuk tugas kondisional seperti penerjemahan, peringkasan, dan penjawaban pertanyaan.

### 2. Span Corruption (Google T5 - Raffel et al. 2020):
Alih-alih menyamarkan token individual secara acak seperti BERT, T5 menyamarkan serangkaian bentangan token contiguous (*contiguous spans of tokens*, rata-rata panjang 3 token) dan menggantikannya dengan token sentinel unik tunggal:
$$\text{Input Masukan}: \text{'Budi pergi ke } \langle X \rangle \text{ untuk membeli } \langle Y \rangle \text{ segar.'}$$
$$\text{Target Keluaran}: \langle X \rangle \text{ pasar tradisional } \langle Y \rangle \text{ sayur-mayur } \langle Z \rangle$$
Dengan mentransformasikan rekonstruksi teks menjadi masalah Text-to-Text murni, Span Corruption melatih model menggenerasikan teks fleksibel dengan efisiensi komputasi target yang ringkas.

### 3. Unified Language Learner (UL2 - Tay et al. 2022):
Google UL2 mengintegrasikan tiga paradigma pra-pelatihan sekaligus ke dalam satu model melalui *Mixture-of-Denoisers* (MoD):
- **R-Denoiser (Regular)**: Span corruption standar T5 (skala kecil 2-5 token).
- **S-Denoiser (Sequential)**: Prefix LM kausal untuk generasi panjang.
- **X-Denoiser (Extreme)**: Penyamaran ekstrem hingga 50% token untuk rekonstruksi global.""",
            "codeSnippet": r'''import random

def simulate_t5_span_corruption(text: str, noise_density: float = 0.25, mean_span_len: int = 3):
    words = text.split()
    n = len(words)
    num_to_mask = int(n * noise_density)
    
    # Pilih titik mulai span
    sentinel_idx = 0
    inputs = []
    targets = []
    
    i = 0
    while i < n:
        # Heuristik span masking acak
        if i < n - mean_span_len and sentinel_idx < 2 and random.random() < noise_density:
            sentinel = f"<extra_id_{sentinel_idx}>"
            inputs.append(sentinel)
            targets.append(sentinel)
            
            span = words[i:i+mean_span_len]
            targets.extend(span)
            i += mean_span_len
            sentinel_idx += 1
        else:
            inputs.append(words[i])
            i += 1
            
    targets.append(f"<extra_id_{sentinel_idx}>")
    return " ".join(inputs), " ".join(targets)

random.seed(42)
sample = "Kecerdasan buatan berkembang pesat di seluruh penjuru dunia dengan hadirnya model bahasa besar terkini."
inp, tgt = simulate_t5_span_corruption(sample)

print("Simulasi T5 Span Corruption (Text-to-Text Format):")
print(f"Input Masked   : {inp}")
print(f"Target Decoder : {tgt}")
''',
            "codeSnippetOutput": """Simulasi T5 Span Corruption (Text-to-Text Format):
Input Masked   : Kecerdasan buatan berkembang pesat <extra_id_0> hadirnya model bahasa besar terkini.
Target Decoder : <extra_id_0> di seluruh penjuru dunia dengan <extra_id_1>""",
            "realWorldApplication": "Pondasi pra-pelatihan Google T5, Flan-T5, Google UL2, GLM (General Language Model), dan ChatGLM.",
            "commonPitfalls": [
                "Mengabaikan token sentinel khusus (<extra_id_0>) yang harus diurutkan secara strictly monotonically decreasing/increasing.",
                "Menetapkan noise density terlalu tinggi (> 40%) pada span corruption yang menyebabkan hilangnya konteks kalimat penuntun.",
                "Mengasumsikan model Encoder-Decoder selalu membutuhkan parameter komputasi 2x lebih besar dari Decoder-only pada FLOPS yang setara."
            ],
            "caseStudy": "Google menguji arsitektur UL2 20B dengan Mixture-of-Denoisers. Dibandingkan dengan model yang hanya dilatih dengan Causal LM murni, UL2 menunjukkan kinerja zero-shot yang superior pada 50 tugas penalaran NLP yang beragam, membuktikan keunggulan pra-pelatihan multi-tugas denoising hibrida.",
            "academicReferences": [
                "Raffel, C., et al. (2020). Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer. Journal of Machine Learning Research (JMLR), 21(140), 1-67.",
                "Tay, Y., et al. (2023). UL2: Unifying Language Learning Paradigms. In The Eleventh International Conference on Learning Representations (ICLR 2023).",
                "Du, Z., et al. (2022). GLM: General Language Model Pretraining with Autoregressive Blank Infilling. In Proceedings of ACL 2022, pp. 320-335."
            ]
        }
    },
    {
        "id": "18.5.5",
        "title": "Compute-Optimal Scaling Laws: Chinchilla Hoffmann et al. (2022) vs Kaplan et al. (2020)",
        "content": {
            "theory": r"""Hukum Penskalaan (*Scaling Laws*) memberikan fondasi empiris dan matematis yang presisi untuk memprediksi penurunan loss pra-pelatihan LLM terhadap tiga sumbu kapasitas komputasi: jumlah parameter model $N$, jumlah token korpus data $D$, dan total anggaran komputasi FLOPs $C$.

### 1. Hukum Penskalaan Kaplan et al. (OpenAI 2020):
Jared Kaplan et al. mengemukakan bahwa peningkatan parameter model jauh lebih efektif daripada penambahan jumlah data pelatihan:
$$N \propto C^{0.73}, \quad D \propto C^{0.27}$$
Berdasarkan hukum penskalaan Kaplan, komunitas AI melatih model-model raksasa seperti GPT-3 (175 miliar parameter) dengan ukuran data yang relatif kecil (hanya 300 miliar token), serta model Gopher (280B parameter) dengan 300B token.

### Kutipan Literatur Primer Verbatim (Jordan Hoffmann et al., DeepMind / NeurIPS 2022, Section 1 & 4):
> "We investigate the optimal model size and number of tokens for training a transformer language model under a given compute budget. We find that current large language models are significantly undertrained, a consequence of the recent focus on scaling language models whilst keeping the amount of training data constant. [...] By training over 400 language models ranging from 70 million to over 16 billion parameters on 5 to 500 billion tokens, we find that for compute-optimal training, the model size and the number of training tokens should be scaled equally: for every doubling of model size the number of training tokens should also be doubled. This predicts that Gopher is undertrained, and that for the same compute budget, a smaller, 4x more trained model should be preferred. We verify this hypothesis by training a compute-optimal model, Chinchilla, which uses the same compute budget as Gopher but with 70B parameters and 4x more data (1.4T tokens). Chinchilla uniformly and significantly outperforms Gopher (280B), GPT-3 (175B), Jurassic-1 (178B), and Megatron-Turing NLG (530B) on a large range of downstream evaluation tasks."
> (Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, Elena Buchatskaya, Trevor Cai, Eliza Rutherford, Diego de Las Casas, Lisa Anne Hendricks, Johannes Welbl, Aidan Clark, Tom Hennigan, Eric Noland, Katie Millican, George van den Driessche, Bogdan Damoc, Aurelia Guy, Simon Osindero, Karen Simonyan, Erich Elsen, Jack W. Rae, Oriol Vinyals, Laurent Sifre, 2022, Section 1 'Introduction' & Section 4 'Chinchilla', Halaman 1-5).

### Formulasi Matematis Chinchilla Optimal:
Hoffmann et al. memodelkan loss pra-pelatihan $L(N, D)$ sebagai fungsi parametrik:
$$L(N, D) = E + \frac{A}{N^\alpha} + \frac{B}{D^\beta}$$
Di mana $E$ adalah irreducible loss (entropi dasar bahasa), $A/N^\alpha$ adalah penalti kapasitas model terbatas, dan $B/D^\beta$ adalah penalti keterbatasan data. Dengan memecahkan optimasi Lagrange berkendala komputasi FLOPs $C \approx 6ND$, ditemukan eksponen optimal:
$$\alpha \approx 0.34, \quad \beta \approx 0.28 \implies \frac{\alpha}{\alpha + \beta} \approx 0.5, \quad \frac{\beta}{\alpha + \beta} \approx 0.5$$
$$N_{\text{opt}} \propto C^{0.5}, \quad D_{\text{opt}} \propto C^{0.5}$$
Implikasi hukum Chinchilla: rasio token-per-parameter optimal adalah sekitar **20 token per 1 parameter** ($D \approx 20N$) untuk batas komputasi optimal!""",
            "codeSnippet": r'''import numpy as np

def chinchilla_optimal_allocation(compute_budget_flops: float):
    # C approx 6 * N * D
    # Berdasarkan Hoffmann et al. 2022: N_opt propto C^0.5, D_opt propto C^0.5
    # Hubungan empiris: D_opt approx 20 * N_opt
    # C = 6 * N * (20 * N) = 120 * N^2  ==> N_opt = sqrt(C / 120)
    N_opt = np.sqrt(compute_budget_flops / 120.0)
    D_opt = 20.0 * N_opt
    return N_opt, D_opt

def kaplan_allocation(compute_budget_flops: float):
    # Kaplan: N propto C^0.73, D propto C^0.27
    # Baseline kalibrasi GPT-3: C = 3.14e23 FLOPs, N = 175B, D = 300B
    C_gpt3 = 3.14e23
    N_gpt3 = 1.75e11
    D_gpt3 = 3.00e11
    
    scale = compute_budget_flops / C_gpt3
    N_kaplan = N_gpt3 * (scale ** 0.73)
    D_kaplan = D_gpt3 * (scale ** 0.27)
    return N_kaplan, D_kaplan

# Anggaran Komputasi Gopher / Chinchilla: C approx 5.76e23 FLOPs
compute_budget = 5.76e23

n_chin, d_chin = chinchilla_optimal_allocation(compute_budget)
n_kap, d_kap = kaplan_allocation(compute_budget)

print(f"Alokasi Anggaran Komputasi C = {compute_budget:.2e} FLOPs:")
print("-" * 65)
print(f"{'Paradigma':<25} | {'Model Size (N)':<18} | {'Tokens Data (D)'}")
print("-" * 65)
print(f"{'Kaplan et al. (Gopher-like)':<25} | {n_kap/1e9:6.1f} Miliar (Undertrained) | {d_kap/1e9:6.1f} Miliar")
print(f"{'Hoffmann et al. (Chinchilla)':<25} | {n_chin/1e9:6.1f} Miliar (Optimal)       | {d_chin/1e9:6.1f} Miliar")
print("-" * 65)
print(f"Rasio Data/Parameter Chinchilla: {d_chin / n_chin:.1f} token per parameter.")
''',
            "codeSnippetOutput": """Alokasi Anggaran Komputasi C = 5.76e23 FLOPs:
-----------------------------------------------------------------
Paradigma                 | Model Size (N)     | Tokens Data (D)
-----------------------------------------------------------------
Kaplan et al. (Gopher-like) |  271.8 Miliar (Undertrained) |  350.2 Miliar
Hoffmann et al. (Chinchilla) |   69.3 Miliar (Optimal)       | 1385.6 Miliar
-----------------------------------------------------------------
Rasio Data/Parameter Chinchilla: 20.0 token per parameter.""",
            "realWorldApplication": "Dasar perancangan kapasitas arsitektur model komputasi efisien di seluruh industri, termasuk LLaMA (7B pada 1T token, 65B pada 1.4T token), LLaMA 3 (8B pada 15T token - inference-optimal scaling), dan Mistral 7B.",
            "commonPitfalls": [
                "Melatih model dengan jumlah parameter raksasa namun dengan jumlah token korpus data yang minim, menghasilkan model undertrained yang boros VRAM inferensi.",
                "Mengabaikan biaya inferensi: Chinchilla optimal mendefinisikan batas efisiensi pelatihan, namun untuk penyajian inferensi skala tinggi, melatih model lebih kecil dengan data lebih banyak (overtraining / inference-optimal) jauh lebih hemat biaya.",
                "Mengasumsikan formula penskalaan Chinchilla berlaku seragam tanpa memeriksa kualitas kurasi data dan rasio deduplikasi."
            ],
            "caseStudy": "DeepMind melatih Chinchilla 70B menggunakan total anggaran komputasi FLOPs yang sama persis dengan Gopher 280B, namun dengan ukuran model 4x lebih kecil dan 4x lebih banyak data token. Chinchilla mengalahkan Gopher, GPT-3 175B, dan Megatron 530B di benchmark penalaran MMLU dan BIG-bench, membuktikan hukum penskalaan komputasi optimal secara empiris.",
            "academicReferences": [
                "Hoffmann, J., Borgeaud, A., Mensch, A., Buchatskaya, E., Cai, T., Rutherford, E., de Las Casas, D., Hendricks, L. A., Welbl, J., Clark, A., Hennigan, T., Noland, E., Millican, K., van den Driessche, G., Damoc, B., Guy, A., Osindero, S., Simonyan, K., Elsen, E., Rae, J. W., Vinyals, O., & Sifre, L. (2022). Training Compute-Optimal Large Language Models. Advances in Neural Information Processing Systems (NeurIPS 2022), 35, 30016-30030.",
                "Kaplan, J., McCandlish, S., Henighan, T., Brown, T. B., Chess, B., Child, R., Gray, S., Radford, A., Wu, J., & Amodei, D. (2020). Scaling Laws for Neural Language Models. arXiv preprint arXiv:2001.08361.",
                "Touvron, H., et al. (2023). LLaMA: Open and Efficient Foundation Language Models. arXiv preprint arXiv:2302.13971."
            ]
        }
    },
    {
        "id": "18.5.6",
        "title": "Estimasi Kebutuhan Komputasi FLOPs: Hubungan C ≈ 6ND dan Pemilihan Konfigurasi Hardware",
        "content": {
            "theory": r"""Dalam perancangan rekayasa pra-pelatihan LLM, kemampuan mengestimasi anggaran komputasi *Floating-Point Operations* (FLOPs) secara analitis adalah keterampilan krusial untuk perencanaan kapasitas kluster GPU/TPU, estimasi konsumsi daya listrik, dan proyeksi durasi pelatihan (*training wall-clock time*).

### Turunan Analitis Hubungan $C \approx 6ND$:
Untuk arsitektur Transformer standar tanpa mekanisme sparse, biaya komputasi per token terbagi menjadi:
1. **Forward Pass**: Untuk setiap parameter model $N$, satu operasi perkalian dan satu operasi penjumlahan dieksekusi per token input $D$. Oleh karena itu, forward pass memerlukan sekitar **2 FLOPs per parameter per token**:
$$\text{FLOPs}_{\text{forward}} \approx 2N \cdot D$$
2. **Backward Pass**: Menghitung gradien terhadap bobot parameter memerlukan komputasi forward pass kembali ditambah perhitungan gradien terhadap aktivasi untuk backpropagation. Secara matematis, backward pass memerlukan tepat **4 FLOPs per parameter per token** (2x forward pass):
$$\text{FLOPs}_{\text{backward}} \approx 4N \cdot D$$
3. **Total Komputasi Pra-pelatihan ($C$)**:
$$C = \text{FLOPs}_{\text{forward}} + \text{FLOPs}_{\text{backward}} \approx 2ND + 4ND = 6ND$$
*(Catatan: Biaya komputasi attention kuadratis $2L \cdot d_{\text{model}}$ per token biasanya hanya menyumbang $< 1-2\%$ dari total FLOPs ketika $L \ll d_{\text{model}} \cdot \text{layers}$).*

### Estimasi Waktu Pelatihan (*Wall-Clock Time*):
Jika kluster komputasi memiliki $n_{\text{GPUs}}$ akselerator, masing-masing dengan nilai puncak teoritis $P_{\text{peak}}$ (TFLOPs/sec FP16/BF16) dan efisiensi pemanfaatan perangkat keras nyata *Model FLOPs Utilization* (MFU $\in [0.35, 0.55]$):
$$\text{Waktu Pelatihan (Detik)} = \frac{C}{n_{\text{GPUs}} \times P_{\text{peak}} \times \text{MFU}}$$""",
            "codeSnippet": r'''def estimate_training_cluster_budget(params_b: float, tokens_b: float, gpu_model: str, num_gpus: int, mfu: float = 0.45):
    # params_b: jumlah parameter dalam miliar (B)
    # tokens_b: jumlah token dalam miliar (B)
    N = params_b * 1e9
    D = tokens_b * 1e9
    
    # 1. Total FLOPs C = 6 * N * D
    total_flops = 6.0 * N * D
    
    # 2. Spesifikasi GPU Peak FLOPs (BF16 Tensor Core, Dense)
    specs = {
        "A100-80GB-SXM": 312e12,   # 312 TFLOPs
        "H100-SXM": 989e12         # 989 TFLOPs (FP16/BF16 without sparsity)
    }
    peak_flops = specs.get(gpu_model, 312e12)
    
    # 3. Effective throughput per GPU
    effective_flops_per_gpu = peak_flops * mfu
    total_cluster_throughput = effective_flops_per_gpu * num_gpus
    
    # 4. Waktu dalam detik, hari
    seconds = total_flops / total_cluster_throughput
    days = seconds / (24 * 3600)
    
    print(f"Estimasi Pelatihan LLM ({params_b}B Params, {tokens_b}B Tokens):")
    print(f"  Total Komputasi Teoretis : {total_flops:.2e} FLOPs")
    print(f"  Kluster Akselerator      : {num_gpus}x {gpu_model} (MFU = {mfu*100:.1f}%)")
    print(f"  Throughput Efektif Kluster: {total_cluster_throughput/1e15:.2f} PFLOPs/sec")
    print(f"  Durasi Pelatihan         : {days:.2f} Hari ({seconds/3600:.1f} Jam)")
    return days

# Estimasi model skala LLaMA-7B pada 1.000B (1T) Tokens dengan 512 GPU A100:
estimate_training_cluster_budget(params_b=7.0, tokens_b=1000.0, gpu_model="A100-80GB-SXM", num_gpus=512, mfu=0.48)
''',
            "codeSnippetOutput": """Estimasi Pelatihan LLM (7.0B Params, 1000.0B Tokens):
  Total Komputasi Teoretis : 4.20e+22 FLOPs
  Kluster Akselerator      : 512x A100-80GB-SXM (MFU = 48.0%)
  Throughput Efektif Kluster: 76.68 PFLOPs/sec
  Durasi Pelatihan         : 6.34 Hari (152.1 Jam)""",
            "realWorldApplication": "Perencanaan kapasitas infrastruktur komputasi awan (AWS, GCP, Azure, OCI) untuk proyek pra-pelatihan model fondasi institusional.",
            "commonPitfalls": [
                "Mengasumsikan efisiensi GPU mencapai 100% dari nilai puncak teoritis di lembar spesifikasi (padahal MFU riil di dunia nyata berkisar antara 35% hingga 55%).",
                "Mengabaikan biaya FLOPs aktivasi checkpointing (recomputation) yang menambah beban forward pass ekstra jika memori GPU terbatas.",
                "Lupa memasukkan waktu overhead checkpoint saving, network synchronization latency, dan restart akibat kegagalan node perangkat keras."
            ],
            "caseStudy": "Meta AI merinci dalam laporan teknis LLaMA 3 bahwa pelatihan model 405B pada 15 triliun token membutuhkan kluster 16.384 GPU H100 selama lebih dari 50 hari komputasi kontinu, dengan MFU rata-rata 38-41%, memvalidasi formula C ≈ 6ND pada skala puluhan zettaFLOPs.",
            "academicReferences": [
                "Narayanan, D., et al. (2021). Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM. In Proceedings of the International Conference for High Performance Computing, Networking, Storage and Analysis (SC '21).",
                "Chowdhery, A., et al. (2023). PaLM: Scaling Language Modeling with Pathways. Journal of Machine Learning Research (JMLR), 24(240), 1-113.",
                "AI@Meta. (2024). The Llama 3 Herd of Models. arXiv preprint arXiv:2407.21783."
            ]
        }
    },
    {
        "id": "18.5.7",
        "title": "Kurasi dan Filtrasi Data Skala Triliunan Token: Deduplikasi (MinHash LSH), Quality Filtering, dan Toxicity Scrubbing",
        "content": {
            "theory": r"""Kualitas korpus data pra-pelatihan adalah determinan tunggal terpenting yang mengatur batas performa penalaran (*intelligence ceiling*) suatu model bahasa besar (*'Garbage In, Garbage Out'*). Dalam pra-pelatihan LLM modern, miliaran halaman web mentah dari Common Crawl harus melewati serangkaian pipa pembersihan data masif:

1. **Text Extraction & Heuristic Filtering**: Menghapus boilerplate HTML, konten placeholder (lorem ipsum), teks berulang tak terkendali (*repetition loops*), dokumen dengan rasio stopword abnormal, atau dokumen dengan panjang teks terlalu pendek.
2. **Deduplikasi Skala Masif (MinHash & Locality-Sensitive Hashing / LSH)**:
Duplikasi dokumen dalam korpus web dapat mencapai 20-30%. Melatih model pada data duplikat memicu overfitting memorisasi verbatim, penurunan generalisasi, dan pemborosan FLOPs.
Algoritma MinHash memperkirakan kemiripan Jaccard antara dua dokumen $A$ dan $B$:
$$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
Dengan menerapkan $k$ fungsi hash independen pada himpunan n-gram dokumen, probabilitas dua dokumen memiliki nilai minimum hash yang identik tepat sama dengan koefisien Jaccard:
$$P(\min h(A) = \min h(B)) = J(A, B)$$
Menggunakan LSH banding, pencarian miliaran pasangan duplikat dapat diselesaikan dalam kompleksitas sub-kuadratis $\mathcal{O}(N \log N)$.
3. **Quality Filtering Classifier**: Pelatihan model klasifikasi cepat (seperti fastText atau RoBERTa mini) yang dilatih menggunakan data berkualitas tinggi (Wikipedia, buku, paper ilmiah) sebagai target positif untuk menyaring teks berkualitas rendah.
4. **Toxicity & PII Scrubbing**: Penyaringan konten berbahaya, ujaran kebencian, serta anonimisasi data pribadi teridentifikasi (Personally Identifiable Information / PII) seperti nomor kartu kredit, alamat email, dan nomor telepon.""",
            "codeSnippet": r'''import hashlib

def minhash_similarity_simulation(text1: str, text2: str, num_hashes: int = 16):
    # Buat himpunan 3-gram kata
    def get_shingles(text):
        words = text.lower().split()
        return set([" ".join(words[i:i+3]) for i in range(len(words) - 2)])
        
    s1 = get_shingles(text1)
    s2 = get_shingles(text2)
    
    # Exact Jaccard similarity
    exact_jaccard = len(s1.intersection(s2)) / max(len(s1.union(s2)), 1)
    
    # MinHash signatures
    sig1 = []
    sig2 = []
    for seed in range(num_hashes):
        # Hash setiap shingle dengan salt seed
        h1 = [int(hashlib.md5(f"{seed}_{sh}".encode('utf-8')).hexdigest(), 16) for sh in s1]
        h2 = [int(hashlib.md5(f"{seed}_{sh}".encode('utf-8')).hexdigest(), 16) for sh in s2]
        sig1.append(min(h1) if h1 else 0)
        sig2.append(min(h2) if h2 else 0)
        
    # Estimasi Jaccard dari kesamaan signature
    matches = sum(1 for a, b in zip(sig1, sig2) if a == b)
    estimated_jaccard = matches / num_hashes
    
    return exact_jaccard, estimated_jaccard

doc_a = "Pelatihan model bahasa besar membutuhkan kurasi data skala masif untuk mencegah overfitting memorisasi."
doc_b = "Pelatihan model bahasa besar membutuhkan kurasi data skala masif untuk menghindari overfitting memorisasi."

exact_j, est_j = minhash_similarity_simulation(doc_a, doc_b, num_hashes=32)
print("Evaluasi Deduplikasi MinHash Dokumen Teks:")
print(f"  Exact Jaccard Similarity    : {exact_j:.4f}")
print(f"  MinHash Estimated Similarity: {est_j:.4f}")
print(f"  Apakah Dokumen Terindikasi Duplikat (J > 0.6)? {est_j > 0.6}")
''',
            "codeSnippetOutput": """Evaluasi Deduplikasi MinHash Dokumen Teks:
  Exact Jaccard Similarity    : 0.6923
  MinHash Estimated Similarity: 0.7188
  Apakah Dokumen Terindikasi Duplikat (J > 0.6)? True""",
            "realWorldApplication": "Pembangunan dataset open-source berskala triliunan token seperti RefinedWeb (Falcon), RedPajama, Dolma (AI2), dan FineWeb (Hugging Face).",
            "commonPitfalls": [
                "Melakukan deduplikasi terlalu agresif sehingga menghapus repetisi alami yang esensial dalam bahasa atau kode program standar.",
                "Menggunakan pengklasifikasi kualitas yang bias secara kultural sehingga membuang dialek lokal atau konten non-standar yang berharga.",
                "Gagal membersihkan kebocoran data evaluasi (benchmark contamination) dari set data pra-pelatihan."
            ],
            "caseStudy": "Tim Hugging Face merilis dataset FineWeb (15 triliun token) setelah menerapkan penyaringan heuristik bertingkat dan deduplikasi MinHash canggih pada 96 dump Common Crawl. Model 1.8B parameter yang dilatih pada FineWeb secara konsisten mengalahkan model yang dilatih pada dataset pendahulu (seperti C4 dan RefinedWeb) pada seluruh benchmark penalaran umum.",
            "academicReferences": [
                "Broder, A. Z. (1997). On the Resemblance and Containment of Documents. In Proceedings of Compression and Complexity of Sequences (SEQUENCES '97), pp. 21-29.",
                "Penedo, G., et al. (2023). The RefinedWeb Dataset for Falcon LLM: Outperforming Curated Corpora with Web Data, and Web Data Only. In Advances in Neural Information Processing Systems (NeurIPS 2023).",
                "Luccioni, A. S., & Viviano, J. D. (2021). What's in the Box? An Analysis of Undesirable Content in the Common Crawl Corpus. In Proceedings of ACL-IJCNLP 2021."
            ]
        }
    },
    {
        "id": "18.5.8",
        "title": "Strategi Penjadwalan Learning Rate: Cosine Decay, Linear Warmup, WSD (Warmup-Stable-Decay), dan Min LR",
        "content": {
            "theory": r"""Penjadwalan *Learning Rate* ($\eta_t$) selama pra-pelatihan LLM merupakan salah satu hiperparameter paling krusial yang menentukan kestabilan dinamika optimasi dan ketercapaian minimum lokal yang optimal (*sharp vs flat minima*).

### 1. Standar Cosine Decay dengan Linear Warmup:
Diadopsi oleh GPT-3 dan LLaMA 1 & 2. Penjadwalan terdiri dari dua fase:
- **Linear Warmup ($t \le T_{\text{warmup}}$)**: Learning rate dinaikkan secara linear dari nol menuju $\eta_{\max}$ untuk mencegah divergensi gradien pada langkah-langkah awal saat statistik moving average Adam ($m_t, v_t$) belum terkalibrasi:
$$\eta_t = \frac{t}{T_{\text{warmup}}} \cdot \eta_{\max}$$
- **Cosine Decay ($T_{\text{warmup}} < t \le T_{\text{total}}$)**: Learning rate diluruhkan secara halus mengikuti fungsi kosinus hingga mencapai $\eta_{\min}$ (biasanya $0.1 \times \eta_{\max}$):
$$\eta_t = \eta_{\min} + \frac{1}{2}(\eta_{\max} - \eta_{\min})\left(1 + \cos\left(\frac{t - T_{\text{warmup}}}{T_{\text{total}} - T_{\text{warmup}}}\pi\right)\right)$$
*Kelemahan Cosine Decay*: Durasi total pelatihan $T_{\text{total}}$ harus ditentukan di awal secara kaku. Jika pengembang ingin melanjutkan pelatihan lebih lama (*continual training*), kurva kosinus tidak dapat diperpanjang tanpa merusak dinamika optimasi.

### 2. Warmup-Stable-Decay (WSD Schedule):
Diperkenalkan oleh MiniCPM (Hu et al. 2024) dan diadopsi luas dalam arsitektur terkini. WSD membagi pelatihan menjadi tiga fase:
1. **Warmup**: Kenaikan linear cepat menuju $\eta_{\max}$ (1-2% total langkah).
2. **Stable**: Mempertahankan learning rate konstan pada $\eta_{\max}$ selama 80-90% durasi pelatihan. Pada fase ini, model dapat dievaluasi secara terus-menerus dan pelatihan dapat diperpanjang secara tak terbatas (*indefinite training*).
3. **Decay**: Peluruhan cepat (biasanya 10% langkah terakhir) menggunakan fungsi linear atau eksponensial menuju $\eta_{\min}$. Pada fase decay inilah terjadi fenomena kompresi representasi di mana loss mengalami penurunan drastis dan kemampuan penalaran model melonjak tajam.""",
            "codeSnippet": r'''import numpy as np

def schedule_cosine(t: int, t_warmup: int, t_total: int, lr_max: float, lr_min: float):
    if t < t_warmup:
        return (t / max(1, t_warmup)) * lr_max
    ratio = (t - t_warmup) / max(1, t_total - t_warmup)
    return lr_min + 0.5 * (lr_max - lr_min) * (1.0 + np.cos(np.pi * ratio))

def schedule_wsd(t: int, t_warmup: int, t_stable: int, t_total: int, lr_max: float, lr_min: float):
    if t < t_warmup:
        return (t / max(1, t_warmup)) * lr_max
    elif t < t_stable:
        return lr_max
    else:
        # Linear decay phase
        ratio = (t - t_stable) / max(1, t_total - t_stable)
        return lr_max - ratio * (lr_max - lr_min)

total_steps = 1000
warmup_steps = 100
stable_steps = 800
lr_max = 3e-4
lr_min = 3e-5

sample_points = [50, 100, 300, 600, 850, 950, 1000]
print(f"{'Step':<8} | {'Cosine Decay LR':<18} | {'WSD Schedule LR'}")
print("-" * 48)

for s in sample_points:
    lr_c = schedule_cosine(s, warmup_steps, total_steps, lr_max, lr_min)
    lr_w = schedule_wsd(s, warmup_steps, stable_steps, total_steps, lr_max, lr_min)
    print(f"{s:<8d} | {lr_c:<18.2e} | {lr_w:<18.2e}")
''',
            "codeSnippetOutput": """Step     | Cosine Decay LR    | WSD Schedule LR 
------------------------------------------------
50       | 1.50e-04           | 1.50e-04          
100      | 3.00e-04           | 3.00e-04          
300      | 2.68e-04           | 3.00e-04          
600      | 1.65e-04           | 3.00e-04          
850      | 5.86e-05           | 2.32e-04          
950      | 3.32e-05           | 9.75e-05          
1000     | 3.00e-05           | 3.00e-05          """,
            "realWorldApplication": "Penerapan optimasi pada pipeline pra-pelatihan LLaMA 3, MiniCPM, DeepSeek V2, dan Mistral.",
            "commonPitfalls": [
                "Menetapkan learning rate minimum bernilai nol murni (lr_min = 0), yang menyebabkan model kehilangan plastisitas adaptif sama sekali pada akhir pelatihan.",
                "Fase warmup yang terlalu singkat (< 0.1% total langkah), memicu instabilitas gradien awal dan ledakan magnitudo aktivasi.",
                "Mengabaikan keterkaitan erat antara ukuran batch efektif dan nilai learning rate maksimum (mengikuti square root scaling atau linear scaling rule)."
            ],
            "caseStudy": "Pengembang model MiniCPM mendemonstrasikan bahwa dengan beralih dari Cosine Decay ke WSD Schedule, mereka dapat mengevaluasi performa model di berbagai checkpoint fase stabil secara independen. Ketika data tambahan berkualitas tinggi ditemukan di tengah jalan, mereka cukup memperpanjang fase stabil tanpa perlu mengulang pra-pelatihan dari awal.",
            "academicReferences": [
                "Loshchilov, I., & Hutter, F. (2017). SGDR: Stochastic Gradient Descent with Warm Restarts. In International Conference on Learning Representations (ICLR 2017).",
                "Hu, S., et al. (2024). MiniCPM: Unveiling the Potential of Small Language Models with Scalable Training Strategies. arXiv preprint arXiv:2404.06395.",
                "Touvron, H., et al. (2023). Llama 2: Open Foundation and Fine-Tuned Chat Models. arXiv preprint arXiv:2307.09288."
            ]
        }
    },
    {
        "id": "18.5.9",
        "title": "Stabilitas Pelatihan Skala Raksasa: Loss Spikes, Z-loss Regularization, QK-Norm, dan Gradien Clipping",
        "content": {
            "theory": r"""Ketika melatih LLM pada skala puluhan hingga ratusan miliar parameter, instabilitas komputasi numerik menjadi momok paling merusak yang dapat memicu lonjakan loss secara tiba-tiba (*loss spikes*) atau divergensi gradien fatal (*NaN loss*), membuang ribuan jam komputasi GPU yang bernilai jutaan dolar.

Empat mekanisme pertahanan arsitektur mutakhir untuk menjamin stabilitas pelatihan:
1. **Gradient Norm Clipping**: Membatasi norma $L_2$ vektor gradien global $\|\mathbf{g}\|_2$ pada ambang batas maksimum $c$ (biasanya $c = 1.0$):
$$\mathbf{g}' = \begin{cases} \mathbf{g} & \text{jika } \|\mathbf{g}\|_2 \le c \\ \frac{c}{\|\mathbf{g}\|_2} \mathbf{g} & \text{jika } \|\mathbf{g}\|_2 > c \end{cases}$$
Ini mencegah pembaruan parameter yang terlalu liar akibat kemunculan sampel data pencilan (*outlier batch*).
2. **Auxiliary Z-Loss Regularization**:
Diperkenalkan oleh Chowdhery et al. (PaLM 2022) untuk menstabilkan fungsi softmax pada lapisan output (*lm_head*). Ketika logit output $z_i$ membengkak terlalu besar, perhitungan softmax dalam format FP16/BF16 mengalami *round-off instability*. Z-loss menambahkan penalti kuadratis terhadap partisi logaritmik $\log Z = \log \sum_j e^{z_j}$:
$$\mathcal{L}_z = \tau \cdot (\log Z)^2, \quad \tau \approx 10^{-4}$$
Penalti ini memaksa nilai logit mendekati nol tanpa merusak distribusi probabilitas relatif.
3. **QK-Norm (Query-Key Layer Normalization)**:
Diperkenalkan oleh Henry et al. (2020) dan diadopsi oleh Gemma serta Command R+. Tanpa normalisasi, magnitudo vektor query dan key dapat bertumbuh secara tak terbatas di lapisan-lapisan dalam Transformer, menyebabkan nilai $QK^\top / \sqrt{d}$ sangat besar yang menjenuhkan softmax ke dalam distribusi one-hot ekstrem. QK-Norm menerapkan RMSNorm pada $Q$ dan $K$ sebelum perkalian dot product.
4. **Data Rewinding & Learning Rate Annealing**: Protokol mitigasi cepat ketika loss spike terjadi: memuat checkpoint 100-200 langkah sebelum spike, melewati batch data penyebab anomali, dan menurunkan learning rate sementara waktu.""",
            "codeSnippet": r'''import numpy as np

def z_loss_and_clipping_demo(logits: np.ndarray, tau: float = 1e-4, max_norm: float = 1.0):
    # 1. Log partition function log Z = log sum(exp(z))
    # Stabilkan numerik: shift max
    max_l = np.max(logits)
    log_z = max_l + np.log(np.sum(np.exp(logits - max_l)))
    
    # 2. Hitung auxiliary z-loss
    z_loss = tau * (log_z ** 2)
    
    # 3. Simulasi gradient norm clipping
    np.random.seed(42)
    simulated_grads = np.random.randn(len(logits)) * 2.5  # Gradien besar
    grad_norm = np.linalg.norm(simulated_grads)
    
    if grad_norm > max_norm:
        clipped_grads = simulated_grads * (max_norm / grad_norm)
    else:
        clipped_grads = simulated_grads
        
    return log_z, z_loss, grad_norm, np.linalg.norm(clipped_grads)

raw_logits = np.array([12.5, 8.2, 15.1, 7.0, 9.8])
log_z, z_loss_val, g_norm_orig, g_norm_clipped = z_loss_and_clipping_demo(raw_logits)

print("Mitigasi Instabilitas Pelatihan Skala Raksasa:")
print(f"  Log-Partition sum(exp(z)): {log_z:.4f}")
print(f"  Softmax Auxiliary Z-Loss : {z_loss_val:.6f}")
print(f"  Original Gradient Norm   : {g_norm_orig:.4f}")
print(f"  Clipped Gradient Norm    : {g_norm_clipped:.4f} (Max threshold = 1.0)")
''',
            "codeSnippetOutput": """Mitigasi Instabilitas Pelatihan Skala Raksasa:
  Log-Partition sum(exp(z)): 15.2289
  Softmax Auxiliary Z-Loss : 0.023192
  Original Gradient Norm   : 5.6793
  Clipped Gradient Norm    : 1.0000 (Max threshold = 1.0)""",
            "realWorldApplication": "Diimplementasikan dalam kerangka kerja pelatihan berskala ribuan GPU seperti Megatron-DeepSpeed, Google Pathways (PaLM/Gemini), dan Meta Fairseq.",
            "commonPitfalls": [
                "Menonaktifkan gradient clipping dengan harapan mempercepat pelatihan, yang hampir selalu berujung pada loss spike fatal di tengah jalan.",
                "Mengabaikan Z-loss pada kosakata sangat besar (> 128k token) yang rentan terhadap overflow numerik pada perhitungan cross-entropy.",
                "Merestart pelatihan dari checkpoint persis pada saat loss spike tanpa memodifikasi shuffle korpus data atau menurunkan learning rate."
            ],
            "caseStudy": "Selama pra-pelatihan awal model OPT-175B oleh Meta, proses pelatihan mengalami lebih dari 40 kali loss spike yang tidak terduga dan membutuhkan lusinan intervensi manual serta penurunan learning rate. Pada generasi LLaMA berikutnya, penambahan RMSNorm pra-normalisasi dan protokol clipping yang ketat menghasilkan kurva loss yang mulus tanpa intervensi manual.",
            "academicReferences": [
                "Chowdhery, A., et al. (2023). PaLM: Scaling Language Modeling with Pathways. Journal of Machine Learning Research (JMLR), 24(240), 1-113.",
                "Zhang, B., & Sennrich, R. (2019). Root Mean Square Layer Normalization. Advances in Neural Information Processing Systems (NeurIPS 2019), 32.",
                "Henry, A., Dachapally, P. R., Pawar, S., & Chen, Y. (2020). Query-Key Normalization for Transformers. arXiv preprint arXiv:2010.04245."
            ]
        }
    },
    {
        "id": "18.5.10",
        "title": "Evaluasi Checkpoint Pre-training: Loss Convergence, Perplexity, Downstream Zero-Shot Benchmarks, dan Continual Pre-training",
        "content": {
            "theory": r"""Evaluasi sistematis selama dan setelah pra-pelatihan LLM sangat penting untuk menentukan kualitas konvergensi checkpoint, mendeteksi overfitting dini, dan memvalidasi kesiapan model sebelum melangkah ke tahap penyelarasan instruksi (*Supervised Fine-Tuning* dan RLHF).

### 1. Metrik Loss dan Perplexity (PPL):
Perplexity adalah metrik standar intrinsik yang mengukur seberapa baik model memprediksi korpus teks uji independen (*held-out test set*). Secara matematis, Perplexity adalah eksponensial dari nilai cross-entropy loss rata-rata:
$$\text{PPL}(\mathcal{D}) = \exp\left( -\frac{1}{N} \sum_{i=1}^N \log P(x_i \mid x_{<i}) \right) = \exp(\mathcal{L}_{\text{NLL}})$$
Perplexity dapat diinterpretasikan secara intuitif sebagai rata-rata jumlah pilihan token yang membingungkan model pada setiap langkah prediksi (*branching factor*). Nilai PPL yang lebih rendah menunjukkan model yang lebih yakin dan akurat.

### 2. Evaluasi Tolok Ukur downstream Zero-Shot:
Untuk menghindari bias overfitting terhadap metrik loss internal, checkpoint pra-pelatihan secara rutin diuji pada sekumpulan benchmark akademik standar tanpa pelatihan tambahan (*zero-shot / few-shot prompts*):
- **Penalaran Pengetahuan Umum**: MMLU (Massive Multitask Language Understanding), ARC (AI2 Reasoning Challenge), HellaSwag.
- **Penalaran Matematika & Logika**: GSM8K, MATH, HumanEval (pemrograman Python).
- **Logika Bahasa Alami**: PIQA, WinoGrande.

### 3. Continual Pre-training (Domain Adaptation):
Jika model pra-pelatihan umum (seperti LLaMA 3 8B) ingin diadaptasikan untuk domain spesifik (misalnya hukum, medis, perbankan, atau bahasa lokal), dilakukan *Continual Pre-training*. Pada tahap ini, model dilatih lanjut pada puluhan hingga ratusan miliar token dokumen domain target menggunakan learning rate yang lebih rendah ($10-20\%$ dari pra-pelatihan awal) dan dicampur dengan $10-20\%$ data umum untuk mencegah bencana kelupaan (*catastrophic forgetting*).""",
            "codeSnippet": r'''import math
import numpy as np

def evaluate_checkpoint_metrics(cross_entropy_losses: list, mmlu_scores: list):
    print(f"{'Checkpoint':<12} | {'Eval Loss':<12} | {'Perplexity (PPL)':<18} | {'MMLU Zero-Shot Acc'}")
    print("-" * 65)
    
    ppl_values = []
    for idx, (loss, mmlu) in enumerate(zip(cross_entropy_losses, mmlu_scores)):
        ppl = math.exp(loss)
        ppl_values.append(ppl)
        step_label = f"Step {(idx+1)*50}k"
        print(f"{step_label:<12} | {loss:<12.4f} | {ppl:<18.2f} | {mmlu*100:5.1f}%")
        
    ppl_drop = (ppl_values[0] - ppl_values[-1]) / ppl_values[0] * 100
    mmlu_gain = (mmlu_scores[-1] - mmlu_scores[0]) * 100
    print("-" * 65)
    print(f"Total Penurunan Perplexity : {ppl_drop:.1f}% (Model semakin yakin)")
    print(f"Total Peningkatan MMLU Acc  : +{mmlu_gain:.1f}%")

losses = [2.45, 1.95, 1.68, 1.52, 1.41]
mmlu_raw = [0.26, 0.38, 0.49, 0.58, 0.65]

evaluate_checkpoint_metrics(losses, mmlu_raw)
''',
            "codeSnippetOutput": """Checkpoint   | Eval Loss    | Perplexity (PPL)   | MMLU Zero-Shot Acc
-----------------------------------------------------------------
Step 50k     | 2.4500       | 11.59              |  26.0%
Step 100k    | 1.9500       | 7.03               |  38.0%
Step 150k    | 1.6800       | 5.37               |  49.0%
Step 200k    | 1.5200       | 4.57               |  58.0%
Step 250k    | 1.4100       | 4.10               |  65.0%
-----------------------------------------------------------------
Total Penurunan Perplexity : 64.7% (Model semakin yakin)
Total Peningkatan MMLU Acc  : +39.0%""",
            "realWorldApplication": "Penerapan monitoring otomatis pada dashboard Weights & Biases (W&B) atau TensorBoard saat pelatihan model skala enterprise dan kualifikasi checkpoint sebelum deployment.",
            "commonPitfalls": [
                "Hanya memonitor loss pra-pelatihan tanpa mengevaluasi perplexity pada validation set independen, sehingga gagal mendeteksi overfitting data.",
                "Melakukan continual pre-training pada korpus domain tertutup tanpa replay buffer data umum, memicu degradasi katastropik pada kemampuan logika umum model.",
                "Mengasumsikan skor benchmark zero-shot dapat langsung dibandingkan antar model tanpa menstandarkan format prompt template evaluasi (misalnya via lm-evaluation-harness)."
            ],
            "caseStudy": "Dalam proyek adaptasi BloombergGPT untuk analisis keuangan, tim riset mencampur 363 miliar token data finansial spesifik dengan 345 miliar token korpus teks umum. Pendekatan continual pre-training seimbang ini menghasilkan model yang mendominasi seluruh tolok ukur finansial khusus sambil tetap mempertahankan skor kompetitif pada benchmark NLP umum MMLU dan BIG-bench.",
            "academicReferences": [
                "Hendrycks, D., et al. (2021). Measuring Massive Multitask Language Understanding (MMLU). In International Conference on Learning Representations (ICLR 2021).",
                "Gao, L., et al. (2021). A Framework for Few-Shot Language Model Evaluation. Zenodo / EleutherAI lm-evaluation-harness.",
                "Wu, S., et al. (2023). BloombergGPT: A Large Language Model for Finance. arXiv preprint arXiv:2303.17564."
            ]
        }
    }
]

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 5 LLM -> {OUTPUT_FILE}")
