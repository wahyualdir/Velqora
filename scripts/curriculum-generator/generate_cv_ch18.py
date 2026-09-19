# -*- coding: utf-8 -*-
"""
Generator untuk Bab 18: Vision-Language Models (VLM), Model Fondasi Visi, & Edge Deployment (10 Subbab)
Topik: Computer Vision (08-computer-vision.ts)
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
# Subbab 18.1: Arsitektur Dual-Encoder Multimodal
# ==============================================================================
code_18_1 = r'''import numpy as np

# Simulasi Arsitektur Dual-Encoder Multimodal (Visual Encoder + Textual Encoder)
# Memetakan representasi citra dan teks yang heterogen ke dalam ruang embedding bersama berdimensi d

def mock_dual_encoder(image_features_raw, text_features_raw, embed_dim=128):
    """
    image_features_raw: (B, D_img) aktivasi visual mentah
    text_features_raw: (B, D_txt) aktivasi teks mentah
    embed_dim: dimensi ruang proyeksi gabungan d_e
    """
    np.random.seed(42)
    B = image_features_raw.shape[0]
    D_img = image_features_raw.shape[1]
    D_txt = text_features_raw.shape[1]
    
    # Matriks proyeksi terpelajari W_i dan W_t
    W_i = np.random.randn(D_img, embed_dim) * 0.1
    W_t = np.random.randn(D_txt, embed_dim) * 0.1
    
    # 1. Proyeksi linear ke ruang embedding bersama
    I_emb = np.dot(image_features_raw, W_i)
    T_emb = np.dot(text_features_raw, W_t)
    
    # 2. Normalisasi L2 ketat (proyeksi ke permukaan hipersfer unit)
    I_norm = I_emb / np.linalg.norm(I_emb, axis=1, keepdims=True)
    T_norm = T_emb / np.linalg.norm(T_emb, axis=1, keepdims=True)
    
    # 3. Matriks kesamaan kosinus berpasangan (Pairwise Cosine Similarity) B x B
    similarity_matrix = np.dot(I_norm, T_norm.T)
    return similarity_matrix, I_norm, T_norm

# Simulasi mini-batch B=3 pasangan (Citra Anjing - Teks Anjing, dsb)
B = 3
raw_img = np.random.randn(B, 512)
raw_txt = np.random.randn(B, 256)

sim_mat, _, _ = mock_dual_encoder(raw_img, raw_txt, embed_dim=64)

print("Matriks Kesamaan Kosinus Multimodal Pasangan Citra-Teks (B=3):")
print(np.round(sim_mat, 4))
print(f"Diagonal Utama (Pasangan Nyata): {np.round(np.diag(sim_mat), 4)}")
print("Pelatihan dual-encoder memaksimalkan nilai diagonal utama dan menekan nilai non-diagonal.")
'''

subchapters.append({
    "id": "cv-18-1-dual-encoder-multimodal-alignment",
    "chapterId": "computer-vision-ch-15",
    "title": "Arsitektur Dual-Encoder Multimodal: Paradigma Penyelarasan Bahasa-Citra",
    "description": "Prinsip dasar model multimodal dua cabang: enkode terpisah citra dan teks, proyeksi linear manifold bersama, dan pengukuran kesamaan semantik lintas modalitas.",
    "estimatedMinutes": 35,
    "order": 1,
    "content": {
        "theory": (
            "Secara konvensional, model visi komputer dilatih menggunakan paradigma **kategori diskrit tertutup** (*closed-set discrete labels*), seperti 1.000 kelas pada ImageNet. Pendekatan ini memiliki dua kelemahan fatal: (1) membutuhkan anotasi manual yang sangat mahal, dan (2) model tidak memiliki pemahaman semantik tentang hubungan antar kelas (misalnya model tidak memahami bahwa 'anjing golden retriever' lebih berkerabat dekat dengan 'anjing pudel' daripada dengan 'sepeda motor').\n\n"
            "**Arsitektur Dual-Encoder Multimodal** (seperti yang dirintis oleh ConVIRT, VirTex, dan CLIP) mendobrak batasan ini dengan memanfaatkan **supervisi bahasa alami bebas (*natural language supervision*)** dari ratusan juta pasangan teks-citra yang tersebar di internet.\n\n"
            "Sistem dual-encoder terdiri dari dua modul spesialis yang independen secara komputasi:\n"
            "1. **Enkoder Visual ($f_I$)**: Memproses citra mentah $I$ menjadi representasi fitur visual $u_I \\in \\mathbb{R}^{d_i}$ (biasanya menggunakan arsitektur Vision Transformer / ViT atau ResNet).\n"
            "2. **Enkoder Tekstual ($f_T$)**: Memproses teks tokenized $T$ menjadi representasi fitur bahasa $u_T \\in \\mathbb{R}^{d_t}$ (menggunakan arsitektur Transformer Decoder/Encoder berbasis Byte-Pair Encoding).\n\n"
            "Kedua representasi tersebut kemudian diproyeksikan ke dalam **ruang embedding multimodal bersama** berdimensi seragam $d_e$ melalui matriks proyeksi linear terpelajari $W_i \\in \\mathbb{R}^{d_i \\times d_e}$ dan $W_t \\in \\mathbb{R}^{d_t \\times d_e}$:\n"
            "$$z_I = \\frac{W_i^T u_I}{\\| W_i^T u_I \\|_2}, \\quad z_T = \\frac{W_t^T u_T}{\\| W_t^T u_T \\|_2}$$\n"
            "Kedua vektor embedding dinormalkan secara ketat menggunakan normalisasi L2 pada permukaan bola unit $\\mathbb{S}^{d_e - 1}$. Kesamaan semantik antara modalitas visual dan bahasa dapat dievaluasi secara instan melalui perkalian titik kosinus sederhana $\\cos(z_I, z_T) = z_I^T z_T$, memungkinkan pencarian semantik teks-ke-citra (*text-to-image retrieval*) berskala miliaran item dengan latensi sub-milidetik via pustaka indeks vektor (Faiss/HNSW)."
        ),
        "codeSnippet": code_18_1,
        "codeSnippetOutput": run_code_capture_output(code_18_1),
        "realWorldApplication": (
            "Diterapkan pada mesin pencarian gambar terbalik Google Images / Pinterest Visual Search, sistem e-commerce multi-bahasa pencarian produk deskriptif, dan temu kembali citra medis berbasis laporan radiologi."
        ),
        "commonPitfalls": [
            r"Lupa melakukan normalisasi L2 pada embedding sebelum menghitung similarity, yang menyebabkan panjang vektor mendominasi skor kesamaan melampaui orientasi semantik.",
            r"Menggabungkan citra dan teks dalam arsitektur Cross-Encoder terpadu sejak layer awal untuk retrieval, yang membuat pencarian katalog skala besar menjadi sangat lambat (O(N) forward pass penuh alih-alih dot product vektor cepat).",
            r"Mengabaikan tokenisasi teks khusus untuk batas panjang teks (misal teks dipotong sewenang-wenang di tengah frasa kunci)."
        ],
        "caseStudy": (
            "Sebuah platform marketplace global ingin mengindeks 50 juta foto produk untuk pencarian teks multibahasa. Jelaskan mengapa pendekatan Dual-Encoder memungkinkan pengindeksan offline pra-komputasi vektor visual, dan hitung penghematan komputasi per kueri dibandingkan mengeksekusi model multimodal terpadu (early-fusion)."
        ),
        "academicReferences": [
            r"Radford, A., Kim, J. W., Hallacy, C., Ramesh, A., Goh, G., Agarwal, S., ... & Sutskever, I. (2021). Learning transferable visual models from natural language supervision. In International Conference on Machine Learning (pp. 8748-8763).",
            r"Zhang, Y., Jiang, H., Miura, Y., Manning, C. D., & Langlotz, C. P. (2022). Contrastive learning of medical visual representations from paired images and text. Machine Learning for Healthcare Conference.",
            r"Jia, C., Yang, Y., Xia, Y., Chen, Y. T., Parekh, Z., Pham, H., ... & Le, Q. (2021). Scaling up visual and vision-language representation learning with noisy text supervision. In International Conference on Machine Learning (pp. 4904-4916)."
        ]
    }
})

# ==============================================================================
# Subbab 18.2: CLIP (Contrastive Language-Image Pre-training) - Spot-Check ICML 2021
# ==============================================================================
code_18_2 = r'''import numpy as np

# Implementasi Fungsi Kerugian CLIP Lengkap (Radford et al., OpenAI, ICML 2021)
# Sesuai Pseudocode Resmi Gambar 3 Paper:
# logits = np.dot(I_e, T_e.T) * np.exp(t)
# loss_i = cross_entropy_loss(logits, labels, axis=0)
# loss_t = cross_entropy_loss(logits, labels, axis=1)
# loss = (loss_i + loss_t) / 2

def clip_contrastive_loss(I_emb, T_emb, log_temperature):
    """
    I_emb: (B, D) embedding citra ternormalisasi L2
    T_emb: (B, D) embedding teks ternormalisasi L2
    log_temperature: parameter skalar suhu terpelajari t = ln(1 / tau)
    """
    B = I_emb.shape[0]
    
    # 1. Matriks kesamaan terukur suhu (scaled cosine logits) berukuran B x B
    temperature = np.exp(log_temperature)
    logits = np.dot(I_emb, T_emb.T) * temperature
    
    # Label target diagonal: pasangan indeks ke-i cocok dengan pasangan teks ke-i
    labels = np.arange(B)
    
    # 2. Cross Entropy Sepanjang Sumbu Citra (Image-to-Text Direction)
    # Log-Softmax per baris
    max_row = np.max(logits, axis=1, keepdims=True)
    log_sum_exp_row = max_row + np.log(np.sum(np.exp(logits - max_row), axis=1, keepdims=True))
    loss_i = -np.mean(logits[np.arange(B), labels] - log_sum_exp_row.squeeze())
    
    # 3. Cross Entropy Sepanjang Sumbu Teks (Text-to-Image Direction)
    # Log-Softmax per kolom
    max_col = np.max(logits, axis=0, keepdims=True)
    log_sum_exp_col = max_col + np.log(np.sum(np.exp(logits - max_col), axis=0, keepdims=True))
    loss_t = -np.mean(logits[labels, np.arange(B)] - log_sum_exp_col.squeeze())
    
    # 4. Total Simetris Loss
    total_loss = (loss_i + loss_t) / 2.0
    return total_loss, logits

# Simulasi evaluasi mini-batch B=4 sampel
np.random.seed(42)
B, D = 4, 32
I_feats = np.random.randn(B, D)
I_feats /= np.linalg.norm(I_feats, axis=1, keepdims=True)

# Buat pasangan teks yang memiliki kemiripan kuat pada diagonal
T_feats = I_feats.copy() + np.random.randn(B, D) * 0.2
T_feats /= np.linalg.norm(T_feats, axis=1, keepdims=True)

# Suhu awal standar t = ln(1/0.07) ~ 2.659
log_temp = np.log(1.0 / 0.07)

loss_val, logit_matrix = clip_contrastive_loss(I_feats, T_feats, log_temp)

print("Verifikasi Numerik Fungsi Kerugian Simetris CLIP (Radford et al., ICML 2021):")
print(f"Nilai Temperatur Efektif (exp(t)): {np.exp(log_temp):.2f}")
print("Matriks Logits Kesamaan Ternormalisasi (B=4):")
print(np.round(logit_matrix, 2))
print(f"\nTotal Symmetric CLIP Loss: {loss_val:.4f}")
print("Sifat simetris menjamin keselarasan optimal dua arah: Citra->Teks dan Teks->Citra.")
'''

subchapters.append({
    "id": "cv-18-2-clip-contrastive-pretraining",
    "chapterId": "computer-vision-ch-15",
    "title": "Contrastive Language-Image Pre-training (CLIP): Pelatihan Kontrastif Simetris dan Skalabilitas Super-Besar",
    "description": "Analisis mendalam karya monumental Radford et al. (OpenAI, ICML 2021): dataset 400M pasangan WebImageText, fungsi kerugian simetris cross-entropy multi-arah, dan penskalaan temperatur dinamis.",
    "estimatedMinutes": 40,
    "order": 2,
    "content": {
        "theory": (
            "Dipublikasikan oleh **Alec Radford, Ilya Sutskever, dkk.** (*OpenAI*, ICML 2021), **CLIP** (*Contrastive Language-Image Pre-training*) menjadi salah satu terobosan paling fundamental dalam sejarah visi komputer modern. CLIP membuktikan bahwa pelatihan representasi visual menggunakan pengawasan bahasa alami berskala raksasa (dataset internal WIT berisi 400 juta pasangan citra-teks) mampu menghasilkan representasi visual yang luar biasa tangguh (*robust*), generalistik, dan dapat langsung ditransfer ke beragam tugas hilir tanpa penyetelan halus (*zero-shot transfer*).\n\n"
            "Diberikan sebuah mini-batch beranggotakan $N$ pasangan citra-teks nyata $\\{(I_1, T_1), \\dots, (I_N, T_N)\\}$, CLIP dilatih untuk memprediksi pasangan mana dari $N \\times N$ kemungkinan pasangan (citra, teks) yang sebenarnya berpasangan di dunia nyata. Untuk mencapai hal ini, CLIP melatih *image encoder* dan *text encoder* secara bersamaan untuk **memaksimalkan kesamaan kosinus pasangan nyata ($N$ sampel diagonal) sembari meminimalkan kesamaan kosinus dari $N^2 - N$ pasangan palsu/salah (sel non-diagonal)**.\n\n"
            "Formulasi objektif CLIP dioptimalkan menggunakan fungsi **Symmetric Cross-Entropy Loss** atas skor logit kesamaan kosinus terukur:\n"
            "$$\\mathcal{L}_{simetris} = \\frac{1}{2} \\left( \\mathcal{L}_{I \\to T} + \\mathcal{L}_{T \\to I} \\right)$$\n"
            "di mana matriks logit $L \\in \\mathbb{R}^{N \\times N}$ didefinisikan sebagai perkalian titik embedding ternormalisasi L2 yang diskalakan oleh parameter temperatur terpelajari $t$:\n"
            "$$L_{i, j} = \\left( \\frac{f_I(I_i)}{\\| f_I(I_i) \\|} \\cdot \\frac{f_T(T_j)}{\\| f_T(T_j) \\|} \\right) \\cdot \\exp(t)$$\n"
            "Dua komponen fungsi kerugian didefinisikan sebagai:\n"
            "$$\\mathcal{L}_{I \\to T} = - \\frac{1}{N} \\sum_{i=1}^N \\log \\frac{\\exp(L_{i, i})}{\\sum_{j=1}^N \\exp(L_{i, j})}, \\quad \\mathcal{L}_{T \\to I} = - \\frac{1}{N} \\sum_{j=1}^N \\log \\frac{\\exp(L_{j, j})}{\\sum_{i=1}^N \\exp(L_{i, j})}$$\n\n"
            "Parameter $\\exp(t)$ (diinisialisasi setara dengan $\\tau = 0.07$) bertindak sebagai pengali ketajaman distribusi probabilitas Boltzmann dan dibatasi secara dinamis agar tidak meledak melampaui 100 untuk menjamin stabilitas numerik pada batch raksasa ($N = 32.768$)."
        ),
        "codeSnippet": code_18_2,
        "codeSnippetOutput": run_code_capture_output(code_18_2),
        "realWorldApplication": (
            "Menjadi fondasi pemahaman teks pada generator gambar difusi (Stable Diffusion, DALL-E), mesin filter keamanan moderasi konten visual otomatis, dan backbone sistem klasifikasi zero-shot universal."
        ),
        "commonPitfalls": [
            r"Batch size terlalu kecil (misal B < 512), yang menyediakan terlalu sedikit pasangan negatif kontras sehingga ruang embedding gagal membentuk manifold semantik yang kaya.",
            r"Tidak membatasi nilai maksimum parameter log-temperature t (clipping max ln(100)), yang dapat memicu gradien meledak dan overflow softmax.",
            r"Lupa menerapkan weight decay terpisah pada matriks proyeksi linier."
        ],
        "caseStudy": (
            "Jelaskan mengapa fungsi kerugian simetris dua arah (L_i + L_t)/2 pada CLIP secara fundamental mencegah representasi dari fenomena 'representation collapse' (di mana seluruh gambar memetakan ke satu titik teks), dan bagaimana mekanisme suhu exp(t) mengontrol margin entropi keputusan."
        ),
        "academicReferences": [
            r"Radford, A., Kim, J. W., Hallacy, C., Ramesh, A., Goh, G., Agarwal, S., ... & Sutskever, I. (2021). Learning transferable visual models from natural language supervision. In Proceedings of the 38th International Conference on Machine Learning (pp. 8748-8763).",
            r"Cherti, M., Beaumont, R., Wightman, R., Wortsman, M., Ilharco, G., Gordon, C., ... & Jitsev, J. (2023). Reproducible scaling laws for contrastive language-image learning. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 2818-2829).",
            r"Gao, P., Geng, S., Zhang, R., Ma, T., Fang, R., Zhang, Y., ... & Qiao, Y. (2024). Clip-adapter: Better vision-language models with feature adapters. International Journal of Computer Vision, 132(2), 581-595."
        ]
    }
})

# ==============================================================================
# Subbab 18.3: Zero-Shot Classification via Prompt Engineering
# ==============================================================================
code_18_3 = r'''import numpy as np

# Simulasi Zero-Shot Visual Classification menggunakan Prompt Engineering CLIP
# 1. Ubah label kelas menjadi kalimat prompt: 'a photo of a {class}.'
# 2. Enkode teks untuk membentuk matriks bobot classifier linear dinamis W_text (d_e, C)
# 3. Klasifikasikan embedding citra x via argmax( x . W_text )

classes = ["kucing", "anjing", "pesawat terbang", "sepeda motor"]
prompt_templates = [
    "a photo of a {}.",
    "a close-up photo of the {}.",
    "a rendering of a {}."
]

# Simulasi ekstraksi embedding visual satu citra (1, 64)
np.random.seed(101)
image_embedding = np.random.randn(1, 64)
image_embedding /= np.linalg.norm(image_embedding)

# Simulasi ekstraksi embedding prompt teks untuk setiap kelas (Prompt Ensembling)
# Gabungkan rerata embedding dari beberapa variasi template untuk meningkatkan akurasi
classifier_weights = []

for cls in classes:
    class_prompt_embeddings = []
    for tmpl in prompt_templates:
        # Simulasi embedding teks dari text encoder
        prompt_str = tmpl.format(cls)
        t_emb = np.random.randn(64)
        t_emb /= np.linalg.norm(t_emb)
        class_prompt_embeddings.append(t_emb)
    # Ensemble mean pooling across prompts
    class_mean_emb = np.mean(class_prompt_embeddings, axis=0)
    class_mean_emb /= np.linalg.norm(class_mean_emb)
    classifier_weights.append(class_mean_emb)

W_text = np.stack(classifier_weights, axis=1) # (64, C)

# Prediksi Probabilitas Zero-Shot via Softmax Cosine Similarity
logits = np.dot(image_embedding, W_text) * 10.0 # skala temperatur 10.0
exp_logits = np.exp(logits - np.max(logits))
probs = exp_logits / np.sum(exp_logits)

predicted_idx = np.argmax(probs)

print("Klasifikasi Zero-Shot Berbasis Prompt Engineering:")
for i, cls in enumerate(classes):
    print(f"Peluang Kelas '{cls:15s}': {probs[0, i] * 100:5.2f}%")

print(f"\nPrediksi Kelas Pemenang: '{classes[predicted_idx]}' (Skor Probabilitas: {probs[0, predicted_idx]*100:.2f}%)")
print("Klasifikasi zero-shot mengubah teks prompt menjadi bobot klasifikasi tanpa memerlukan 1 pun data latih baru!")
'''

subchapters.append({
    "id": "cv-18-3-zero-shot-prompt-engineering",
    "chapterId": "computer-vision-ch-15",
    "title": "Zero-Shot Visual Classification via Prompt Engineering & Ensembling",
    "description": "Metodologi transfer nir-sampel: konstruksi matriks classifier dinamis dari sintesis bahasa, rekayasa prompt peka konteks, dan robustitas terhadap pergeseran distribusi.",
    "estimatedMinutes": 35,
    "order": 3,
    "content": {
        "theory": (
            "Keunggulan paling radikal dari model multimodal seperti CLIP adalah kemampuannya mengeksekusi **Zero-Shot Classification** tanpa memerlukan pembaruan satu pun parameter bobot (*zero weight updating*) untuk kategori kelas yang sama sekali baru.\n\n"
            "Mekanisme zero-shot ini bekerja dengan mengubah tugas klasifikasi visual konvensional menjadi tugas pencarian kesamaan semantik lintas modalitas (*cross-modal retrieval*):\n"
            "1. **Sintesis Bobot Klasifikasi Teks**: Diberikan daftar $K$ nama kelas target $\\{c_1, \\dots, c_K\\}$, setiap nama kelas disematkan ke dalam kalimat panduan (*prompt template*), seperti `'a photo of a {c_k}.'`. Vektor embedding teks $w_k = f_T(\\text{prompt}_k)$ diekstrak dan dinormalisasi L2 $\\| w_k \\|_2 = 1$.\n"
            "2. **Penyusunan Matriks Pembobot**: Seluruh vektor embedding kelas digabungkan menjadi matriks pembobot classifier linear terpadu $\\mathbf{W} = [w_1, w_2, \\dots, w_K] \\in \\mathbb{R}^{d \\times K}$.\n"
            "3. **Inferensi Zero-Shot**: Untuk setiap citra uji yang menghasilkan embedding ternormalisasi $z_I = f_I(I)$, probabilitas keanggotaan kelas dihitung langsung melalui fungsi softmax:\n"
            "$$p(y = k \\mid I) = \\frac{\\exp(\\tau \\cdot z_I^T w_k)}{\\sum_{j=1}^K \\exp(\\tau \\cdot z_I^T w_j)}$$\n\n"
            "Radford et al. menemukan bahwa **Prompt Engineering** dan **Prompt Ensembling** memegang peranan krusial terhadap akurasi. Jika hanya memasukkan label kata tunggal (misalnya kata `'crane'`), representasi teks mengalami ambiguitas polisemi (apakah burung bangau atau mesin derek konstruksi?). Dengan menggunakan template deskriptif `'a photo of a crane, a type of bird.'`, ambiguitas semantik dapat dieliminasi secara total.\n\n"
            "Selain itu, merata-ratakan vektor embedding dari puluhan variasi template prompt berbeda (*prompt ensembling*):\n"
            "$$\\bar{w}_k = \\frac{1}{M} \\sum_{m=1}^M f_T(\\text{template}_m(c_k))$$\n"
            "terbukti secara konsisten mendongkrak akurasi zero-shot sebesar 3–5% di seluruh dataset benchmark ImageNet."
        ),
        "codeSnippet": code_18_3,
        "codeSnippetOutput": run_code_capture_output(code_18_3),
        "realWorldApplication": (
            "Diterapkan pada sistem klasifikasi inventaris gudang logistik otomatis untuk produk-produk baru yang belum pernah difoto sebelumnya, deteksi cacat manufaktur tanpa training ulang, dan tagging gambar otomatis platform galeri cloud."
        ),
        "commonPitfalls": [
            r"Menggunakan prompt kata tunggal mentah tanpa template konteks (misal 'dog' alih-alih 'a photo of a dog.'), yang menurunkan akurasi zero-shot secara signifikan.",
            r"Lupa menormalkan kembali vektor rata-rata setelah proses prompt ensembling (||w_bar|| = 1), yang merusak kalibrasi peluang softmax.",
            r"Mengabaikan sensitivitas case atau tanda baca pada tokenisasi teks tokenizer BPE."
        ],
        "caseStudy": (
            "Pada pengujian dataset ImageNet-A (adversarial natural images), ResNet-50 standar yang dilatih dengan supervised learning mengalami kejatuhan akurasi dari 76% menjadi 3%, sedangkan CLIP Zero-Shot mampu mempertahankan akurasi 77%. Jelaskan mengapa pelatihan berbasis supervisi bahasa alami memberikan kekebalan superior terhadap natural distribution shifts."
        ),
        "academicReferences": [
            r"Radford, A., Kim, J. W., Hallacy, C., Ramesh, A., Goh, G., Agarwal, S., ... & Sutskever, I. (2021). Learning transferable visual models from natural language supervision. In ICML (pp. 8748-8763).",
            r"Zhou, K., Yang, J., Loy, C. C., & Liu, Z. (2022). Learning to prompt for vision-language models. International Journal of Computer Vision, 130(9), 2337-2348.",
            r"Hendrycks, D., Zhao, K., Basart, S., Steinhardt, J., & Song, D. (2021). Natural adversarial examples. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 15262-15271)."
        ]
    }
})

# ==============================================================================
# Subbab 18.4: Open-Vocabulary Object Detection & SAM (Segment Anything Model)
# ==============================================================================
code_18_4 = r'''import numpy as np

# Simulasi Open-Vocabulary Detection & Segment Anything Model (SAM, Kirillov et al., ICCV 2023)
# Menggabungkan Image Encoder (Heavy ViT) dengan Prompt Encoder (Point/Box/Text) dan Lightweight Mask Decoder

class MockSAMMaskDecoder:
    def __init__(self, d_model=64):
        self.d_model = d_model
        
    def predict_mask(self, image_embedding, prompt_point):
        """
        image_embedding: (H/16, W/16, d_model) fitur spasial visual
        prompt_point: (x, y) koordinat titik interaktif pengguna
        """
        H, W, D = image_embedding.shape
        # Ekstrak fitur visual pada lokasi klik titik pengguna
        px = int(np.clip(prompt_point[0] * W, 0, W - 1))
        py = int(np.clip(prompt_point[1] * H, 0, H - 1))
        point_feature = image_embedding[py, px] # (D,)
        
        # Hitung korelasi silang (cross-correlation) antara titik kueri dengan seluruh peta citra
        similarity_map = np.dot(image_embedding, point_feature) # (H, W)
        
        # Mask probabilitas biner via Sigmoid
        mask_prob = 1.0 / (1.0 + np.exp(-similarity_map))
        binary_mask = (mask_prob > 0.5).astype(np.uint8)
        return binary_mask, mask_prob

# Simulasi peta fitur gambar berukuran 16x16 (resolusi laten)
np.random.seed(42)
img_emb = np.random.randn(16, 16, 64)
# Buat kluster objek buatan di kuadran kiri-atas
img_emb[2:8, 2:8] += 2.0

decoder = MockSAMMaskDecoder(d_model=64)
click_point = (0.25, 0.25) # Pengguna mengklik di dalam area objek

mask, probs = decoder.predict_mask(img_emb, click_point)

print("Simulasi Segment Anything Model (SAM) Promptable Decoder:")
print(f"Koordinat Klik Pengguna (Normalisasi): {click_point}")
print(f"Total Piksel Objek Tersegmentasi:     {np.sum(mask)} dari 256 sel spasial")
print(f"Rata-rata Keyakinan Probabilitas Mask: {np.mean(probs[mask == 1]):.4f}")
print("SAM mengeksekusi mask decoder ringan dalam sub-50ms di browser setelah image embedding dihitung sekali.")
'''

subchapters.append({
    "id": "cv-18-4-open-vocabulary-sam-segmentation",
    "chapterId": "computer-vision-ch-15",
    "title": "Open-Vocabulary Detection & SAM (Segment Anything Model): Promptable Visual Segmentation",
    "description": "Deteksi dan segmentasi kosakata terbuka: pemisahan encoder-decoder pada SAM (Kirillov et al., ICCV 2023), promptable segmentation (titik, kotak, teks), dan dataset SA-1B.",
    "estimatedMinutes": 35,
    "order": 4,
    "content": {
        "theory": (
            "Deteksi objek dan segmentasi citra tradisional terkunci pada katalog kelas terbatas (misalnya 80 kategori pada COCO Dataset). Kemunculan model fondasi visi memungkinkan lahirnya paradigma **Open-Vocabulary Object Detection** (OWL-ViT, GLIP) dan **Promptable Segmentation** yang mampu melokalisasi dan memotong objek apa pun berdasarkan masukan kueri teks bebas, titik koordinat klik, atau kotak pembatas.\n\n"
            "Tonggak paling monumental dalam segmentasi universal diraih oleh **Segment Anything Model (SAM)** (Alexander Kirillov et al., Meta AI Research, ICCV 2023). SAM memecahkan masalah segmentasi melalui perancangan arsitektur terpisah yang sangat efisien:\n"
            "1. **Heavy Image Encoder**: Arsitektur Vision Transformer (ViT-Huge/Large dengan patch size 16) yang memproses citra resolusi tinggi $1024 \\times 1024$ piksel satu kali saja untuk menghasilkan tensor representasi spasial $64 \\times 64 \\times 256$. Komputasi berat ini dieksekusi secara *offline* di sisi server.\n"
            "2. **Prompt Encoder**: Modul pemroses kueri interaktif yang memetakan beragam jenis petunjuk masukan ke dalam vektor representasi embedding berdimensi 256:\n"
            "   - *Sparse Prompts*: Titik klik foreground/background (dipetakan via positional encoding Fourier), kotak pembatas *bounding box*, atau teks bebas (via CLIP text encoder).\n"
            "   - *Dense Prompts*: Masker kasar dari langkah segmentasi sebelumnya.\n"
            "3. **Lightweight Mask Decoder**: Arsitektur Transformer dua lapis berbobot sangat ringan yang menerapkan *Two-Way Cross-Attention* bolak-balik antara embedding prompt dan embedding citra, memprediksi masker biner berkepresisian tinggi beserta skor *Intersection-over-Union* (IoU).\n\n"
            "Karena Mask Decoder memiliki parameter yang sangat kecil, ia mampu mengeksekusi inferensi interaktif secara real-time dalam **waktu kurang dari 50 milidetik langsung di dalam browser web via WebAssembly/WebGPU**, memungkinkan pengalaman anotasi instan yang melahirkan dataset terbesar dalam sejarah visi komputer: **SA-1B** (11 juta citra dengan 1,1 miliar masker berkualitas tinggi)."
        ),
        "codeSnippet": code_18_4,
        "codeSnippetOutput": run_code_capture_output(code_18_4),
        "realWorldApplication": (
            "Diterapkan pada alat seleksi objek instan 'Lift Subject from Background' di Apple iOS / macOS, platform anotasi data medis semi-otomatis, dan segmentasi rintangan tak dikenal pada robotika otonom."
        ),
        "commonPitfalls": [
            r"Menjalankan Image Encoder ViT-H berulang-ulang untuk setiap klik interaktif pengguna (seharusnya citra dienkripsi satu kali, dan hasil embedding di-cache).",
            r"Mengabaikan ambiguitas bawaan pada prompt titik tunggal (misal mengklik kemeja: apakah pengguna menginginkan kemeja saja atau seluruh orang? SAM menyelesaikan ini dengan memprediksi 3 opsi hierarki mask sekaligus).",
            r"Kurangnya penanganan kontras pada batas tepian objek transparan (kaca/air)."
        ],
        "caseStudy": (
            "Sebuah tim anotator medis ingin memotong batas tumor pada 10.000 citra CT-Scan. Analisis penghematan waktu kerja per citra menggunakan antarmuka interaktif titik klik SAM dibandingkan membuat poligon manual titik-demi-titik konvensional."
        ),
        "academicReferences": [
            r"Kirillov, A., Mintun, E., Ravi, N., Mao, H., Rolland, C., Gustafson, L., ... & Dollar, P. (2023). Segment anything. In Proceedings of the IEEE/CVF International Conference on Computer Vision (pp. 4015-4026).",
            r"Minderer, M., Gritsenko, A., Stone, A., Neumann, M., Weissenborn, D., Dosovitskiy, A., ... & Houlsby, N. (2022). Simple open-vocabulary object detection. In European Conference on Computer Vision (pp. 728-755).",
            r"Li, L. H., Zhang, P., Zhang, H., Yang, J., Li, C., Zhong, Y., ... & Gao, J. (2022). Grounded language-image pre-training. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 10965-10975)."
        ]
    }
})

# ==============================================================================
# Subbab 18.5: Vision-Language Models Autoregressive (LLaVA & MLLM)
# ==============================================================================
code_18_5 = r'''import numpy as np

# Simulasi Arsitektur Multimodal LLaVA (Large Language and Vision Assistant, Liu et al., NeurIPS 2023)
# Proyeksi Linear Multimodal: H_v = W * Z_v
# Menggabungkan token visual H_v dengan token embedding teks H_q ke dalam LLM Decoder Autoregressive

def mock_llava_projection(visual_tokens_raw, text_tokens_raw, llm_dim=128):
    """
    visual_tokens_raw: (N_v, D_clip) token spasial dari vision encoder (misal CLIP ViT-L 576 token)
    text_tokens_raw: (N_t, llm_dim) token teks instruksi pengguna
    """
    D_clip = visual_tokens_raw.shape[1]
    
    # Matriks proyeksi linear W (atau 2-layer MLP) yang memetakan fitur CLIP ke ruang laten LLM
    np.random.seed(42)
    W_proj = np.random.randn(D_clip, llm_dim) * 0.05
    
    # 1. Proyeksikan representasi visual ke ruang embedding LLM
    H_v = np.dot(visual_tokens_raw, W_proj) # (N_v, llm_dim)
    
    # 2. Konkatenasikan token visual dan token teks secara sekuensial
    # Urutan urutan input multimodal: [Visual Tokens, Text Tokens]
    multimodal_sequence = np.concatenate([H_v, text_tokens_raw], axis=0) # (N_v + N_t, llm_dim)
    return multimodal_sequence, H_v

# Simulasi 4 token patch visual (D=64) dan 3 token teks pertanyaan
N_v = 4
N_t = 3
vis_feats = np.random.randn(N_v, 64)
txt_feats = np.random.randn(N_t, 128)

llm_input_seq, projected_vis = mock_llava_projection(vis_feats, txt_feats, llm_dim=128)

print("Simulasi LLaVA Multimodal Visual Instruction Tuning:")
print(f"Token Visual Mentah CLIP:       {vis_feats.shape} (4 patch x 64 dimensi)")
print(f"Token Visual Terproyeksi LLM:   {projected_vis.shape} (4 patch x 128 dimensi)")
print(f"Sekuens Terpadu Masuk ke LLM:   {llm_input_seq.shape} ({N_v + N_t} token x 128 dimensi)")
print("LLaVA memperlakukan citra visual seolah-olah sebagai kata-kata dalam kalimat bahasa alami!")
'''

subchapters.append({
    "id": "cv-18-5-llava-autoregressive-vlms",
    "chapterId": "computer-vision-ch-15",
    "title": "Vision-Language Models Autoregressive (VLM / MLLM): LLaVA, Visual Instruction Tuning, dan Proyeksi Multimodal",
    "description": "Penyatuan visi komputer dan Large Language Models: arsitektur LLaVA (Liu et al., NeurIPS 2023), lapisan proyeksi linear/MLP multimodal, dan kurasi data visual instruction tuning.",
    "estimatedMinutes": 40,
    "order": 5,
    "content": {
        "theory": (
            "Puncak evolusi kecerdasan buatan multimodal terwujud melalui integrasi model visi komputer dengan model bahasa raksasa (*Large Language Models / LLMs*), melahirkan keluarga **Multimodal Large Language Models (MLLMs)** atau Vision-Language Models autoregressive.\n\n"
            "Arsitektur perintis yang menetapkan standar terbuka modern adalah **LLaVA** (*Large Language and Vision Assistant*, Haotian Liu, Chunyuan Li, Qingyang Wu, dan Yong Jae Lee, *UW-Madison & Microsoft Research*, NeurIPS 2023). LLaVA merancang formulasi integrasi multimodal yang sangat sederhana namun memiliki kapabilitas penalaran visual yang luar biasa kuat.\n\n"
            "Arsitektur LLaVA terdiri dari tiga pilar komponen:\n"
            "1. **Vision Encoder ($f_v$)**: Menggunakan representasi visual pra-terlatih CLIP ViT-L/14 untuk mengekstrak peta fitur kisi spasial dari citra input $X_v$. Untuk citra beresolusi $336 \\times 336$ dengan patch $14 \\times 14$, dihasilkan $24 \\times 24 = 576$ vektor token visual $Z_v \\in \\mathbb{R}^{576 \\times 1024}$.\n"
            "2. **Multimodal Projector ($W$)**: Lapisan penghubung sederhana berupa matriks proyeksi linear tunggal (pada LLaVA-1.0) atau MLP dua lapis dengan aktivasi GELU (pada LLaVA-1.5) yang memetakan fitur visual $Z_v$ agar memiliki dimensi representasi yang identik dengan ruang token LLM $H_v = W \\cdot Z_v \\in \\mathbb{R}^{576 \\times d_{llm}}$.\n"
            "3. **LLM Backbone ($f_{llm}$)**: Jaringan Transformer bahasa autoregressive (seperti LLaMA, Vicuna, atau Mistral). Token visual $H_v$ digabungkan secara langsung dengan token embedding teks pertanyaan instruksi pengguna $H_q$ membentuk satu sekuens terpadu:\n"
            "$$\\mathbf{S} = [H_v, \\, H_q]$$\n\n"
            "Pelatihan LLaVA dieksekusi dalam dua tahap bertingkat (*Two-Stage Training Scheme*):\n"
            "- **Tahap 1: Pre-training for Feature Alignment**: Membekukan bobot Vision Encoder dan LLM, hanya melatih matriks proyeksi $W$ pada himpunan data konversi citra-ke-keterangan teks untuk menyelaraskan ruang visual ke ruang konseptual LLM.\n"
            "- **Tahap 2: Visual Instruction Tuning**: Membuka kunci bobot LLM dan melatih model secara *end-to-end* menggunakan dataset percakapan instruksi multimodal yang dikurasi secara cerdas menggunakan GPT-4 (mencakup percakapan multi-putaran, penalaran sebab-akibat deskriptif, dan deskripsi pemandangan kompleks)."
        ),
        "codeSnippet": code_18_5,
        "codeSnippetOutput": run_code_capture_output(code_18_5),
        "realWorldApplication": (
            "Diterapkan pada asisten AI multimodal cerdas (seperti Google Gemini, ChatGPT Vision, Claude 3.5 Sonnet), asisten tunanetra pembaca lingkungan sekitar, dan ekstraksi otomatis data faktur/tabel dokumen kompleks."
        ),
        "commonPitfalls": [
            r"Memotong resolusi citra secara berlebihan yang menyebabkan teks-teks kecil pada gambar dokumen (OCR) menjadi tidak terbaca oleh Vision Encoder.",
            r"Melatih seluruh bobot LLM sejak tahap alignment awal, yang dapat memicu catastrophic forgetting pada kapabilitas penalaran bahasa murni.",
            r"Mengabaikan token pembatas khusus (misal <image> dan </image>) yang membantu LLM membedakan batas awal dan akhir representasi token visual."
        ],
        "caseStudy": (
            "Diberikan sebuah resep dokter tulisan tangan yang ingin dianalisis oleh LLaVA. Mengapa penggunaan MLP projector 2-lapis pada LLaVA-1.5 menghasilkan akurasi pembacaan tulisan tangan yang jauh lebih superior dibandingkan proyeksi linear 1-lapis pada LLaVA-1.0?"
        ),
        "academicReferences": [
            r"Liu, H., Li, C., Wu, Q., & Lee, Y. J. (2023). Visual instruction tuning. Advances in Neural Information Processing Systems, 36.",
            r"Liu, H., Li, C., Li, Y., & Lee, Y. J. (2024). Improved baselines with visual instruction tuning. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 26296-26306).",
            r"Alayrac, J. B., Donahue, J., Luc, P., Miech, A., Barr, I., Hasson, Y., ... & Simonyan, K. (2022). Flamingo: a visual language model for few-shot learning. Advances in Neural Information Processing Systems, 35, 23716-23736."
        ]
    }
})

# ==============================================================================
# Subbab 18.6: Visual Question Answering (VQA) & Penalaran Multimodal
# ==============================================================================
code_18_6 = r'''import numpy as np

# Simulasi Mitigasi Halusinasi Visual pada VQA (Visual Question Answering)
# Menggunakan Kontras Dekoding Multimodal (Contrastive Decoding / VCD)
# Logits_final = (1 + beta) * Logits_original - beta * Logits_distorted_image

def contrastive_decoding_vqa(logits_orig, logits_hallucinated, beta=0.5):
    """
    logits_orig: prediksi logit LLM dengan citra asli yang jelas
    logits_hallucinated: prediksi logit LLM dengan citra terdistorsi/kabur (memaksa model menebak dari prior bahasa)
    beta: parameter penalti halusinasi
    """
    # Memperkuat token yang benar-benar didukung bukti visual nyata
    adjusted_logits = (1.0 + beta) * logits_orig - beta * logits_hallucinated
    return adjusted_logits

# Simulasi logit untuk 3 opsi jawaban VQA: ['kucing', 'anjing', 'meja']
# Model bias bahasa cenderung menebak 'anjing' padahal di gambar ada 'kucing'
np.random.seed(42)
l_orig = np.array([2.8, 3.0, 0.5])        # Asli: anjing sedikit lebih unggul karena bias bahasa
l_distort = np.array([0.2, 2.5, 0.4])     # Saat citra kabur: bias bahasa tetap kuat menebak 'anjing'

l_contrast = contrastive_decoding_vqa(l_orig, l_distort, beta=0.8)

prob_orig = np.exp(l_orig) / np.sum(np.exp(l_orig))
prob_contrast = np.exp(l_contrast) / np.sum(np.exp(l_contrast))

candidates = ["kucing", "anjing", "meja"]
print("Evaluasi Pengurangan Halusinasi Visual VQA:")
print(f"Peluang Standar (Rentan Halusinasi): {candidates[np.argmax(prob_orig)]} ({np.max(prob_orig)*100:.1f}%)")
print(f"Peluang Contrastive Decoding:        {candidates[np.argmax(prob_contrast)]} ({np.max(prob_contrast)*100:.1f}%)")
print("Contrastive decoding berhasil membalikkan prediksi ke 'kucing' dengan menekan bias prior teks!")
'''

subchapters.append({
    "id": "cv-18-6-vqa-visual-reasoning-hallucination",
    "chapterId": "computer-vision-ch-15",
    "title": "Visual Question Answering (VQA) & Penalaran Multimodal: Rantai Penalaran (CoT) dan Mitigasi Halusinasi",
    "description": "Tantangan penalaran tingkat tinggi pada visi-bahasa: patologi halusinasi objek visual, strategi Multimodal Chain-of-Thought (M-CoT), dan dekoding kontras.",
    "estimatedMinutes": 35,
    "order": 6,
    "content": {
        "theory": (
            "**Visual Question Answering (VQA)** merepresentasikan puncak evaluasi penalaran kognitif kecerdasan buatan, di mana sistem harus mampu menjawab pertanyaan bahasa alami terbuka berbasiskan konteks citra visual yang kompleks (misalnya: *'Berapa jumlah kursi kosong di sebelah kiri meja makan, dan apakah lantai terlihat basah?'*).\n\n"
            "Namun, MLLM modern menderita patologi kritis yang dikenal sebagai **Halusinasi Visual (*Visual Object Hallucination*)**: kecenderungan model untuk menyatakan keberadaan objek, warna, atau relasi spasial yang sebenarnya **sama sekali tidak ada dalam citra**. Analisis empiris membuktikan bahwa halusinasi ini berakar pada dominasi **bias prior bahasa (*language prior bias*)** dari LLM dasar: karena dalam data pelatihan teks kata 'garpu' sering muncul bersama kata 'sendok' dan 'piring', model dengan percaya diri menegaskan adanya garpu di atas meja meskipun foto hanya menampilkan piring dan sendok.\n\n"
            "Dua strategi terdepan untuk memitigasi halusinasi visual meliputi:\n"
            "1. **Multimodal Chain-of-Thought (M-CoT)** (Zhang et al., 2023): Membagi proses inferensi menjadi dua tahap terpisah: (a) *Rationale Generation* (model dipaksa mendeskripsikan secara eksplisit seluruh koordinat dan fitur visual yang teramati secara objektif terlebih dahulu), diikuti oleh (b) *Answer Inference* (menjawab pertanyaan murni berbasiskan bukti rasional yang telah diverifikasi pada tahap pertama).\n"
            "2. **Visual Contrastive Decoding (VCD)** (Leng et al., CVPR 2024): Membandingkan distribusi keluaran logit dari citra asli $v$ terhadap citra terdistorsi buatan $v_{distort}$ (misalnya dengan menambahkan derau Gauss tinggi). Token yang berasal murni dari halusinasi bias teks akan memiliki peluang tinggi pada kedua versi citra, sedangkan token yang didukung bukti visual otentik hanya akan muncul pada citra asli:\n"
            "$$\\tilde{\\text{logits}} = (1 + \\beta) \\cdot \\mathcal{M}(v, q) - \\beta \\cdot \\mathcal{M}(v_{distort}, q)$$\n"
            "Operasi ini secara efektif menyaring halusinasi teks murni dan memperkuat keselarasan visual faktual."
        ),
        "codeSnippet": code_18_6,
        "codeSnippetOutput": run_code_capture_output(code_18_6),
        "realWorldApplication": (
            "Diterapkan secara kritis pada diagnosis medis berbasis radiologi AI (mencegah salah diagnosa keberadaan tumor palsu), analisis citra forensik bukti persidangan, dan inspeksi keselamatan penerbangan dirgantara."
        ),
        "commonPitfalls": [
            r"Mengevaluasi VQA hanya menggunakan akurasi biner ya/tidak, yang menyembunyikan bias tebakan acak 50% dari model.",
            r"Membiarkan model menghasilkan jawaban akhir secara instan tanpa rantai penalaran langkah-demi-langkah (CoT) untuk pertanyaan geometri spasial yang rumit.",
            r"Mengabaikan kalibrasi keyakinan (confidence calibration) saat model menjawab pertanyaan terbuka."
        ],
        "caseStudy": (
            "Sebuah VLM medis ditanya: 'Apakah terdapat fraktur pada tulang selangka kanan pasien?' Model menjawab 'Ya' karena data latih teks menyatakan fraktur selangka sangat umum pada kecelakaan motor, padahal foto sinar-X bersih. Jelaskan bagaimana Visual Contrastive Decoding mendeteksi dan mengoreksi jawaban halusinasi tersebut."
        ),
        "academicReferences": [
            r"Leng, S., Zhang, H., Chen, G., Li, X., Lu, S., Miao, C., & Bing, L. (2024). Mitigating object hallucinations in large vision-language models through visual contrastive decoding. In Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (pp. 14013-14023).",
            r"Zhang, Z., Zhang, A., Li, M., & Smola, A. (2023). Multimodal chain-of-thought reasoning in language models. arXiv preprint arXiv:2302.00923.",
            r"Goyal, Y., Khot, T., Summers-Stay, D., Batra, D., & Parikh, D. (2017). Making the V in VQA matter: Elevating the role of image understanding in Visual Question Answering. In CVPR (pp. 6904-6913)."
        ]
    }
})

# ==============================================================================
# Subbab 18.7: Kompresi Model: Kuantisasi PTQ (FP16, INT8, INT4, AWQ) & QAT
# ==============================================================================
code_18_7 = r'''import numpy as np

# Implementasi Kuantisasi Seragam Simetris INT8 (Post-Training Quantization / PTQ)
# Skala kuantisasi S = max(|X|) / 127
# X_quant = clip( round(X / S), -128, 127 )
# X_dequant = X_quant * S

def int8_symmetric_quantize(float_tensor):
    """
    float_tensor: tensor array float32
    """
    max_val = np.max(np.abs(float_tensor))
    scale = max_val / 127.0
    scale = max(scale, 1e-8) # hindari pembagian nol
    
    # Kuantisasi ke int8
    quantized = np.clip(np.round(float_tensor / scale), -128, 127).astype(np.int8)
    
    # Rekonstruksi dekuantisasi kembali ke float untuk evaluasi error
    dequantized = quantized.astype(np.float32) * scale
    
    # Hitung Signal-to-Quantization-Noise Ratio (SQNR)
    noise = float_tensor - dequantized
    sqnr = 10.0 * np.log10(np.mean(float_tensor**2) / (np.mean(noise**2) + 1e-12))
    
    return quantized, scale, dequantized, sqnr

# Simulasi bobot konvolusi float32
np.random.seed(42)
weights_fp32 = np.random.normal(loc=0.0, scale=0.5, size=(4, 4)).astype(np.float32)

q_int8, scale_factor, dequant_fp, sqnr_db = int8_symmetric_quantize(weights_fp32)

print("Simulasi Kuantisasi INT8 Post-Training Quantization (PTQ):")
print(f"Jejak Memori FP32 Asli: {weights_fp32.nbytes} bytes")
print(f"Jejak Memori INT8:      {q_int8.nbytes} bytes (Kompresi 4x lipat!)")
print(f"Faktor Skala S:         {scale_factor:.6f}")
print(f"SQNR Rekonstruksi:      {sqnr_db:.2f} dB (Kualitas sinyal sangat prima > 35 dB)")
print(f"Bobot Asli [0,0]:       {weights_fp32[0,0]:.6f} -> INT8: {q_int8[0,0]} -> Dekuant: {dequant_fp[0,0]:.6f}")
'''

subchapters.append({
    "id": "cv-18-7-model-compression-quantization-ptq-qat",
    "chapterId": "computer-vision-ch-15",
    "title": "Model Compression & Efisiensi: Kuantisasi PTQ (FP16, INT8, INT4, AWQ) dan Quantization-Aware Training",
    "description": "Teori kuantisasi numerik jaringan konvolusi dan transformer: pemetaan rentang dinamis, penanganan outlier aktivasi, Activation-aware Weight Quantization (AWQ), dan QAT.",
    "estimatedMinutes": 35,
    "order": 7,
    "content": {
        "theory": (
            "Penerapan model visi komputer mutakhir pada perangkat berdaya rendah (*edge devices*) terbentur oleh konsumsi memori dan bandwidth perangkat keras yang terbatas. Sebuah model ResNet-50 berbobot 32-bit floating point (FP32) membutuhkan ~100 MB memori, sementara model fondasi seperti ViT-Huge atau LLaVA-7B membutuhkan 14–30 GB VRAM.\n\n"
            "**Kuantisasi Numerik** memangkas kebutuhan presisi representasi bit dari FP32 ke integer berpresisi rendah (INT8, INT4):\n"
            "1. **Post-Training Quantization (PTQ)**: Dilakukan langsung pada model yang sudah selesai dilatih tanpa proses pelatihan ulang. Pemetaan skalar dilakukan secara afina linier:\n"
            "$$q = \\text{clip}\\left( \\left\\lfloor \\frac{x}{S} \\right\\rceil + Z, \\, q_{min}, \\, q_{max} \\right)$$\n"
            "di mana $S$ adalah parameter skala riil (*scale factor*) dan $Z$ adalah titik nol bulat (*zero-point*). Pada kuantisasi simetris ($Z = 0$), skala dihitung dari nilai absolut maksimum tensor kalibrasi $S = \\frac{\\max(|x|)}{127}$. INT8 memangkas jejak memori sebesar **4x lipat** dan mempercepat komputasi aritmatika hingga 2–4x menggunakan akselerasi instruksi perangkat keras (NVIDIA Tensor Core DP4A, ARM NEON).\n\n"
            "2. **Activation-aware Weight Quantization (AWQ)** (Lin et al., MLSys 2024): Pada kuantisasi ekstrim INT4, memangkas bobot secara seragam memicu penurunan akurasi yang drastis. AWQ mengamati bahwa **tidak semua bobot sama pentingnya**: 1% bobot yang terhubung dengan saluran aktivasi ber-magnitudo besar memegang kendali utama performa model. Dengan menerapkan penskalaan perlindungan per-saluran pada bobot sensitif ini, kompresi INT4 dapat dicapai tanpa kehilangan akurasi semantik.\n\n"
            "3. **Quantization-Aware Training (QAT)**: Jika PTQ menghasilkan degradasi akurasi yang tidak dapat diterima, model dilatih ulang dengan menyisipkan modul *Fake Quantization* pada graf komputasi forward pass, sembari menggunakan estimator gradien pengganti (*Straight-Through Estimator / STE*) pada backward pass:\n"
            "$$\\frac{\\partial \\lfloor x \\rceil}{\\partial x} \\approx 1$$\n"
            "memungkinkan jaringan mengompensasi kesalahan kuantisasi secara adaptif sebelum konversi akhir ke perangkat keras target."
        ),
        "codeSnippet": code_18_7,
        "codeSnippetOutput": run_code_capture_output(code_18_7),
        "realWorldApplication": (
            "Diterapkan secara wajib untuk mengeksekusi model deteksi objek YOLO dan klasifikasi wajah di prosesor kamera CCTV pintar berdaya 5 Watt, smartphone Snapdragon NPU, dan mikrokontroler IoT."
        ),
        "commonPitfalls": [
            r"Melakukan kuantisasi INT8 tanpa dataset kalibrasi yang representatif, yang menyebabkan penentuan skala rentang dinamis S meleset jauh dari distribusi data riil.",
            r"Kuantisasi per-tensor pada model Transformer yang memiliki outlier aktivasi ekstrem (seharusnya menggunakan kuantisasi per-channel pada bobot dan per-token pada aktivasi).",
            r"Lupa memverifikasi apakah hardware target mendukung integer matrix multiplication secara native (menjalankan INT8 di GPU lama tanpa Tensor Core khusus justru memperlambat inferensi akibat dequant overhead)."
        ],
        "caseStudy": (
            "Sebuah kamera tilang elektronik (ETLE) bertenaga surya harus menjalankan model segmentasi plat nomor kendaraan dengan batas konsumsi daya maksimal 10 Watt. Bandingkan latensi eksekusi, kebutuhan memori, dan estimasi kenaikan Frame Per Second (FPS) dari model FP32 vs INT8 terkuantisasi penuh pada prosesor akselerator NPU lokal."
        ),
        "academicReferences": [
            r"Jacob, B., Kligys, S., Chen, B., Zhu, M., Tang, M., Howard, A., ... & Adam, H. (2018). Quantization and training of neural networks for efficient integer-arithmetic-only inference. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 2704-2713).",
            r"Lin, J., Tang, J., Tang, H., Yang, S., Chen, W. M., Wang, W. C., ... & Han, S. (2024). AWQ: Activation-aware weight quantization for on-device llm compression and acceleration. In Proceedings of Machine Learning and Systems (MLSys).",
            r"Nagel, M., Fournarakis, M., Amjad, R. A., Bondarenko, Y., Van Baalen, M., & Blankevoort, T. (2021). A white paper on neural network quantization. arXiv preprint arXiv:2106.08295."
        ]
    }
})

# ==============================================================================
# Subbab 18.8: Pruning & Knowledge Distillation untuk Model Visi
# ==============================================================================
code_18_8 = r'''import numpy as np

# Implementasi Knowledge Distillation untuk Model Visi (Hinton et al., NeurIPS 2015 Workshop)
# Loss = (1 - alpha) * CE(y_pred, y_true) + alpha * T^2 * KL( Softmax(z_s / T) || Softmax(z_t / T) )
# Suhu T melembutkan probabilitas logit untuk mentransfer 'dark knowledge' dari Teacher ke Student

def distillation_loss(student_logits, teacher_logits, labels, T=4.0, alpha=0.7):
    """
    student_logits: (B, C) prediksi model kecil (student)
    teacher_logits: (B, C) prediksi model raksasa (teacher)
    labels: (B,) ground truth label kelas
    T: temperatur pelunakan Boltzmann
    alpha: bobot penyeimbang loss distilasi
    """
    B = student_logits.shape[0]
    
    # 1. Standard Hard Label Cross Entropy Loss
    max_s = np.max(student_logits, axis=1, keepdims=True)
    exp_s = np.exp(student_logits - max_s)
    probs_s = exp_s / np.sum(exp_s, axis=1, keepdims=True)
    hard_loss = -np.mean(np.log(probs_s[np.arange(B), labels] + 1e-12))
    
    # 2. Soft Target Distillation Loss (KL Divergence pada suhu T)
    soft_student = np.exp((student_logits - max_s) / T)
    soft_student /= np.sum(soft_student, axis=1, keepdims=True)
    
    max_t = np.max(teacher_logits, axis=1, keepdims=True)
    soft_teacher = np.exp((teacher_logits - max_t) / T)
    soft_teacher /= np.sum(soft_teacher, axis=1, keepdims=True)
    
    # KL(teacher || student)
    kl_div = np.sum(soft_teacher * (np.log(soft_teacher + 1e-12) - np.log(soft_student + 1e-12)), axis=1)
    soft_loss = np.mean(kl_div)
    
    # Total loss terbobot (dikalikan T^2 sesuai formulasi Geoffrey Hinton)
    total_loss = (1.0 - alpha) * hard_loss + alpha * (T ** 2) * soft_loss
    return total_loss, hard_loss, soft_loss

# Simulasi 1 sampel pada 3 kelas: [Truk, Mobil, Burung]
np.random.seed(42)
y_lbl = np.array([0]) # Ground truth: Truk
z_teacher = np.array([[6.0, 3.5, -2.0]]) # Teacher sangat yakin Truk, tapi melihat sedikit kemiripan dengan Mobil
z_student = np.array([[2.0, 1.5,  0.5]]) # Student model kecil masih bingung

tot_l, h_l, s_l = distillation_loss(z_student, z_teacher, y_lbl, T=3.0, alpha=0.7)

print("Simulasi Knowledge Distillation Model Visi (Hinton et al.):")
print(f"Hard Cross Entropy Loss (vs Label 0): {h_l:.4f}")
print(f"Soft Distillation Loss (vs Teacher):   {s_l:.4f}")
print(f"Total Combined Distillation Loss:     {tot_l:.4f}")
print("Student belajar bahwa truk lebih mirip mobil daripada burung dari probabilitas lembut teacher.")
'''

subchapters.append({
    "id": "cv-18-8-pruning-knowledge-distillation",
    "chapterId": "computer-vision-ch-15",
    "title": "Pruning & Knowledge Distillation: Kompresi Pengetahuan untuk Model Visi Kompak",
    "description": "Reduksi redundansi parameter: pemangkasan berstruktur versus tak berstruktur, teorema Lottery Ticket Hypothesis, dan transfer representasi gelap (dark knowledge).",
    "estimatedMinutes": 35,
    "order": 8,
    "content": {
        "theory": (
            "Selain kuantisasi presisi bit, dua metodologi klasik yang sangat efektif untuk mempercepat model visi komputer adalah **Pruning (Pemangkasan Parameter)** dan **Knowledge Distillation (Penyulingan Pengetahuan)**.\n\n"
            "**Pruning Parameter** memanfaatkan fakta empiris bahwa lebih dari 80–90% parameter bobot pada jaringan konvolusi dan transformer modern bersifat redundan dan dapat dihapus tanpa mengurangi akurasi secara signifikan:\n"
            "1. **Unstructured Pruning (Pemangkasan Tak Berstruktur)**: Menyetel bobot individual dengan magnitudo terkecil $|w_{ij}| < \\tau$ menjadi nol secara acak di seluruh matriks. Hal ini menghasilkan matriks berkerapatan sangat jarang (*sparse matrix*). Meskipun menghemat memori penyimpanan disk secara teoritis, *sparse matrix* acak sangat sulit diakselerasi pada hardware standar GPU modern tanpa instruksi sparse khusus (seperti NVIDIA 2:4 Structured Sparsity).\n"
            "2. **Structured Pruning (Pemangkasan Berstruktur)**: Menghapus seluruh unit kanal konvolusi (*channel pruning*), kepala atensi (*head pruning*), atau lapisan penuh secara seragam. Pendekatan ini menghasilkan pengurangan dimensi tensor matriks yang padat dan langsung menghasilkan percepatan waktu eksekusi nyata (*direct wall-clock speedup*) pada sembarang prosesor perangkat keras standar.\n"
            "Fenomena stabilitas pemangkasan ini dijelaskan secara mendalam oleh **Lottery Ticket Hypothesis** (Frankle & Carbin, ICLR 2019): di dalam arsitektur neural raksasa yang diinisialisasi secara acak, terdapat sub-jaringan kecil (*winning tickets*) yang jika dilatih secara terisolasi sejak awal mampu menyamai akurasi model penuh.\n\n"
            "**Knowledge Distillation** (Geoffrey Hinton et al., NeurIPS 2015 Workshop) mentransfer kapasitas generalisasi dari model raksasa (*Teacher Network*, misal ViT-Huge) ke model kompak yang sangat efisien (*Student Network*, misal MobileNet-v3 atau Tiny-ViT). Transfer dilakukan dengan memaksa student meniru distribusi probabilitas lembut (*soft probabilities*) yang dikeluarkan oleh teacher pada temperatur tinggi $T > 1$:\n"
            "$$q_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}$$\n"
            "Distribusi lembut ini memuat informasi tersembunyi berharga (*dark knowledge*), seperti korelasi kesamaan tak kentara antar kelas yang tidak terdapat pada label biner satu-nol biasa."
        ),
        "codeSnippet": code_18_8,
        "codeSnippetOutput": run_code_capture_output(code_18_8),
        "realWorldApplication": (
            "Digunakan untuk menghasilkan varian model visi ultra-ringan (seperti Apple MobileViT, FastViT, YOLO-Nano) yang mampu berjalan lancar pada jam tangan pintar (smartwatch) dan kacamata AR."
        ),
        "commonPitfalls": [
            r"Melakukan unstructured pruning acak 90% lalu berharap model otomatis berjalan lebih cepat di GPU konvensional (tanpa format sparse hardware khusus, waktu eksekusi justru sering lebih lambat).",
            r"Menyetel temperatur distilasi T terlalu tinggi (T > 20) yang menyebabkan seluruh distribusi probabilitas mendekati seragam total 1/C dan kehilangan informasi diferensiasi.",
            r"Lupa mengalikan komponen soft loss dengan faktor T^2, yang menyebabkan gradien distilasi mengecil secara proporsional 1/T^2."
        ],
        "caseStudy": (
            "Sebuah model deteksi rintangan ViT-Base (86 juta parameter) menghasilkan akurasi 82% tetapi latensi 120 ms di chip edge. Melalui kombinasi structured channel pruning 50% dan knowledge distillation dari model asli, parameter menyusut menjadi 22 juta dengan akurasi 80.5% dan latensi 28 ms. Analisis faktor tradeoff efisiensi komputasi tersebut."
        ),
        "academicReferences": [
            r"Hinton, G., Vinyals, O., & Dean, J. (2015). Distilling the knowledge in a neural network. arXiv preprint arXiv:1503.02531.",
            r"Frankle, J., & Carbin, M. (2018). The lottery ticket hypothesis: Finding sparse, trainable neural networks. In International Conference on Learning Representations (ICLR).",
            r"He, Y., Zhang, X., & Sun, J. (2017). Channel pruning for accelerating very deep neural networks. In Proceedings of the IEEE International Conference on Computer Vision (pp. 1389-1397)."
        ]
    }
})

# ==============================================================================
# Subbab 18.9: Kompilasi Runtime & Inferensi Cepat: ONNX, TensorRT, OpenVINO
# ==============================================================================
code_18_9 = r'''import numpy as np

# Simulasi Optimasi Grafik Komputasi Tingkat Runtime (TensorRT / ONNX Graph Optimizer)
# 1. Operator Fusion: Menggabungkan Konvolusi 2D + Batch Normalization + ReLU menjadi satu kernel GPU tunggal!
# W_fused = W_conv * (gamma / sqrt(var + eps))
# b_fused = (b_conv - mean) * (gamma / sqrt(var + eps)) + beta

def fuse_conv_bn(conv_w, conv_b, bn_mean, bn_var, bn_gamma, bn_beta, eps=1e-5):
    """
    Mengeliminasi overhead peluncuran kernel GPU terpisah untuk layer Batch Normalization
    """
    scale = bn_gamma / np.sqrt(bn_var + eps)
    
    # Fusi bobot
    w_fused = conv_w * scale[:, np.newaxis, np.newaxis, np.newaxis]
    
    # Fusi bias
    b_fused = (conv_b - bn_mean) * scale + bn_beta
    return w_fused, b_fused

# Simulasi 1 filter konvolusi 1x1 kanal 2 ke 2
np.random.seed(42)
c_w = np.random.randn(2, 2, 1, 1)
c_b = np.array([0.5, -0.2])

mean = np.array([0.1, -0.05])
var  = np.array([1.2, 0.8])
gamma = np.array([1.0, 1.0])
beta = np.array([0.0, 0.0])

fused_w, fused_b = fuse_conv_bn(c_w, c_b, mean, var, gamma, beta)

print("Simulasi Operator Kernel Fusion (NVIDIA TensorRT / OpenVINO):")
print("Bobot Konvolusi Asli Kanal 0:\n", np.round(c_w[0, :, 0, 0], 4))
print("Bobot Terfusi (Conv+BN) Kanal 0:\n", np.round(fused_w[0, :, 0, 0], 4))
print(f"Bias Terfusi: {np.round(fused_b, 4)}")
print("Dengan Graph Fusion, 3 pemanggilan kernel GPU (Conv->BN->ReLU) diciutkan menjadi 1 instruksi instan!")
'''

subchapters.append({
    "id": "cv-18-9-runtime-compilation-onnx-tensorrt",
    "chapterId": "computer-vision-ch-15",
    "title": "Kompilasi Runtime & Inferensi Cepat: Ekosistem ONNX, Optimasi Kernel TensorRT, dan OpenVINO",
    "description": "Optimalisasi eksekusi perangkat keras produksi: serialisasi graf komputasi ONNX, fusi operator (Conv+BN+ReLU), alokasi memori statis, dan auto-tuning kernel TensorRT.",
    "estimatedMinutes": 35,
    "order": 9,
    "content": {
        "theory": (
            "Dalam lingkungan pengembangan penelitian, kerangka kerja seperti PyTorch mengutamakan fleksibilitas graf dinamis (*eager execution*). Namun, dalam lingkungan produksi industri (seperti server inferensi cloud skala besar atau perangkat edge), overhead interpreter Python, manajemen memori dinamis, dan peluncuran ratusan kernel GPU terpisah (*kernel launch overhead*) dapat memangkas throughput inferensi hingga separuhnya.\n\n"
            "Solusi industri standar adalah mengekspor model ke dalam format perantara terbuka **ONNX (Open Neural Network Exchange)**, kemudian mengompilasikannya ke dalam mesin eksekusi khusus perangkat keras seperti **NVIDIA TensorRT** (untuk GPU NVIDIA) atau **Intel OpenVINO** (untuk CPU/iGPU Intel).\n\n"
            "Tahapan optimasi graf komputasi yang dijalankan oleh mesin kompilator runtime meliputi:\n"
            "1. **Layer & Tensor Fusion (Fusi Lapisan)**: Menggabungkan beberapa operasi berurutan menjadi satu *fused kernel* tunggal yang dieksekusi dalam satu siklus memori GPU. Transformasi paling umum adalah **Conv-BN-ReLU Fusion**:\n"
            "   $$\\mathbf{W}_{fused} = \\mathbf{W}_{conv} \\cdot \\frac{\\gamma}{\\sqrt{\\sigma^2 + \\epsilon}}, \\quad \\mathbf{b}_{fused} = (\\mathbf{b}_{conv} - \\mu) \\cdot \\frac{\\gamma}{\\sqrt{\\sigma^2 + \\epsilon}} + \\beta$$\n"
            "   Fusi ini sepenuhnya mengeliminasi operasi BatchNorm saat inferensi dan memangkas transfer data bolak-balik antara SRAM dan DRAM GPU global.\n"
            "2. **Auto-Kernel Tuning**: Menguji ratusan variasi algoritma konvolusi dan perkalian matriks (misalnya Winograd Convolution, GEMM, Direct Convolution) secara langsung pada hardware target spesifik untuk memilih algoritma dengan latensi clock terendah pada ukuran dimensi batch tertentu.\n"
            "3. **Dynamic Tensor Memory Allocation**: Mengalokasikan blok memori GPU secara statis sebelum inferensi dimulai dan menggunakan kembali ruang memori (*memory reuse*) untuk tensor aktivasi yang masa hidupnya tidak tumpang tindih, mengeliminasi risiko memory leak dan pemanggilan `cudaMalloc` yang mahal saat runtime."
        ),
        "codeSnippet": code_18_9,
        "codeSnippetOutput": run_code_capture_output(code_18_9),
        "realWorldApplication": (
            "Diterapkan pada server video analitik perkotaan cerdas (pemrosesan 64 channel video 1080p simultan per GPU via NVIDIA DeepStream), sistem autopilot mobil Tesla/Waymo, dan layanan API inferensi cloud berlatensi sub-5 milidetik."
        ),
        "commonPitfalls": [
            r"Mengekspor model PyTorch ke ONNX dengan dimensi batch statis tetap, yang menyebabkan model gagal menerima batch dinamis saat produksi.",
            r"Menjalankan profiling TensorRT pada kondisi thermal throttling (misal GPU terlalu panas saat benchmarking), yang menghasilkan pilihan kernel suboptimal.",
            r"Menggunakan operator kustom PyTorch yang belum didukung oleh standar operator ONNX tanpa menulis plugin parser CUDA kustom."
        ],
        "caseStudy": (
            "Sebuah sistem inspeksi pabrik perakitan elektronik memerlukan waktu inferensi model segmentasi kurang dari 10 milidetik per komponen. Model PyTorch asli beroperasi pada 28 ms di GPU RTX 4080. Jelaskan bagaimana konversi ke TensorRT FP16 dengan layer fusion memangkas latensi menjadi 6.5 ms tanpa penurunan akurasi cacat."
        ),
        "academicReferences": [
            r"NVIDIA Corporation. (2023). NVIDIA TensorRT: High-Performance Deep Learning Inference SDK. Developer Guide.",
            r"Bai, J., Lu, F., Zhang, K., et al. (2019). ONNX: Open Neural Network Exchange. GitHub repository.",
            r"Intel Corporation. (2023). OpenVINO Toolkit: Deep Learning Deployment Framework. Documentation."
        ]
    }
})

# ==============================================================================
# Subbab 18.10: Edge & Mobile Deployment: NPU, TFLite, CoreML & Trade-off
# ==============================================================================
code_18_10 = r'''import numpy as np

# Simulasi Analisis Trade-off Latensi, Akurasi, dan Konsumsi Daya pada Edge Deployment
# Mengevaluasi Metrik Operasional pada Tiga Perangkat Keras Edge Target:
# 1. Raspberry Pi 4 (Quad-core ARM Cortex-A72 CPU)
# 2. Smartphone Android (Snapdragon 8 Gen 3 Hexagon NPU via TFLite)
# 3. Apple iPhone (A17 Pro 16-core Neural Engine via CoreML)

platforms = {
    "Raspberry Pi 4 (CPU FP32)": {"latency_ms": 145.0, "power_watts": 6.5, "acc_mAP": 42.5},
    "Raspberry Pi 4 (CPU INT8)": {"latency_ms": 52.0,  "power_watts": 5.8, "acc_mAP": 42.1},
    "Snapdragon NPU (TFLite INT8)": {"latency_ms": 6.8, "power_watts": 2.1, "acc_mAP": 42.0},
    "Apple A17 Pro (CoreML FP16)": {"latency_ms": 4.2,  "power_watts": 1.8, "acc_mAP": 42.4}
}

print("Benchmarking Model Deteksi Objek pada Edge & Mobile Deployment:")
print("-" * 80)
print(f"{'Target Hardware':<30} | {'Latensi':<10} | {'FPS':<8} | {'Daya':<8} | {'mAP':<6}")
print("-" * 80)

for name, stats in platforms.items():
    fps = 1000.0 / stats["latency_ms"]
    print(f"{name:<30} | {stats['latency_ms']:6.1f} ms | {fps:6.1f}   | {stats['power_watts']:4.1f} W | {stats['acc_mAP']:4.1f}%")
print("-" * 80)
print("Akselerator NPU khusus (Hexagon/ANE) memberikan efisiensi energi 10-20x lebih tinggi dibandingkan CPU standar!")
'''

subchapters.append({
    "id": "cv-18-10-edge-mobile-deployment-npu",
    "chapterId": "computer-vision-ch-15",
    "title": "Edge & Mobile Deployment: Pipeline Akselerator NPU, CoreML, TFLite, dan Analisis Trade-off",
    "description": "Penyebaran model ke ekosistem edge heterogen: arsitektur Neural Processing Unit (NPU), integrasi iOS CoreML dan Android NNAPI/TFLite, serta batasan thermal-throttling.",
    "estimatedMinutes": 35,
    "order": 10,
    "content": {
        "theory": (
            "Tahap akhir dari siklus rekayasa visi komputer adalah penyebaran model (*deployment*) ke perangkat konsumen fisik yang beroperasi dalam batasan komputasi ekstrem: keterbatasan baterai, kapasitas pendingin pasif tanpa kipas (*fanless thermal envelope*), dan memori terpadu yang ketat.\n\n"
            "Kinerja sistem inferensi edge diatur oleh **Roofline Model** yang mendefinisikan batas performa puncak dapat-capai $P$ (dalam FLOPs/detik):\n"
            "$$P = \\min\\left( \\pi_{peak}, \\, \\beta_{mem} \\times I \\right)$$\n"
            "di mana $\\pi_{peak}$ adalah kapasitas komputasi puncak prosesor silikon, $\\beta_{mem}$ adalah bandwidth memori (Bytes/detik), dan $I = \\frac{\\text{Total FLOPs}}{\\text{Total Memory Access (Bytes)}}$ adalah intensitas operasional komputasi model. Pada arsitektur Vision Transformer berbobot besar yang memori-terikat (*memory-bound*), efisiensi throughput didefinisikan sebagai:\n"
            "$$\\text{FPS} = \\frac{1000}{t_{preprocess} + t_{inference} + t_{postprocess}} \\quad (\\text{dalam frame per detik})$$\n"
            "sedangkan efisiensi energi operasional diukur dalam rasio komputasi terhadap daya termal $\\eta = \\frac{\\text{TOPS}}{P_{watt}}$.\n\n"
            "Arsitektur komputasi modern pada perangkat seluler mengandalkan **Neural Processing Unit (NPU)**—prosesor silikon khusus yang dirancang murni untuk mengeksekusi operasi perkalian matriks akumulasi (*Multiply-Accumulate / MAC*) secara masif dengan efisiensi energi tertinggi (mencapai puluhan Tera Operations per Watt / TOPS/W):\n"
            "1. **Ekosistem iOS (Apple Neural Engine / CoreML)**: Model diekspor ke format `.mlpackage` menggunakan kerangka kerja `coremltools`. CoreML secara cerdas membagi eksekusi graf komputasi antar CPU, GPU Metal, dan ANE (*Apple Neural Engine*), memanfaatkan memori terpadu berkecepatan tinggi (*Unified Memory Architecture*) tanpa overhead duplikasi memori antar prosesor.\n"
            "2. **Ekosistem Android (TensorFlow Lite / Android NNAPI / Qualcomm QNN)**: Model dikonversi ke format FlatBuffer `.tflite` terkuantisasi INT8. Eksekusi didelegasikan ke driver perangkat keras via *Neural Networks API (NNAPI)* atau runtime langsung vendor chip (Qualcomm Hexagon DSP/NPU, MediaTek NeuroPilot).\n\n"
            "Tantangan fisik terbesar dalam edge deployment adalah **Thermal Throttling**: ketika chip beroperasi pada beban 100% secara terus-menerus selama beberapa menit, suhu silikon meningkat melampaui ambang batas keamanan (misal 70°C). Sistem operasi akan secara otomatis memangkas frekuensi jam prosesor (*downclocking*) hingga 50%, menyebabkan frame rate anjlok mendadak.\n\n"
            "Oleh karena itu, insinyur visi komputer wajib melakukan optimasi komprehensif: memadukan arsitektur model ramah edge (MobileNetV4, EfficientFormer), kuantisasi INT8 penuh, penskalaan resolusi adaptif (*dynamic resolution scaling*), dan teknik *frame skipping* cerdas untuk menjaga keseimbangan optimal antara **Akurasi (mAP), Latensi (ms), dan Daya Tahan Baterai (Watt)**."
        ),
        "codeSnippet": code_18_10,
        "codeSnippetOutput": run_code_capture_output(code_18_10),
        "realWorldApplication": (
            "Diterapkan pada fitur komputasi kamera smartphone (Apple Deep Fusion / Smart HDR), navigasi robot pembersih lantai (vacuum cleaner LiDAR/Vision), kacamata pintar pintar (Ray-Ban Meta), dan pemantau tanda-tanda vital pengemudi mobil."
        ),
        "commonPitfalls": [
            r"Mengabaikan fenomena thermal throttling pada pengujian latensi (hanya mengukur 10 detik pertama dan tidak menguji ketahanan beban kerja 30 menit nonstop).",
            r"Menyertakan operator non-native yang tidak didukung oleh NPU, yang memaksa runtime melakukan fallback bolak-balik ke CPU dan memicu lonjakan latensi parah.",
            r"Penggunaan memori yang tidak teratur sehingga memicu garbage collection interupsi pada aplikasi mobile."
        ],
        "caseStudy": (
            "Sebuah aplikasi kamera pemindai dokumen AI pada smartphone Android kelas menengah mengalami keluhan baterai boros dan ponsel terasa panas setelah 3 menit pemakaian. Rancang rencana optimasi dari arsitektur model, kuantisasi INT8 TFLite, pemanfaatan delegasi GPU/NPU, hingga penyesuaian laju frame kamera (15 FPS alih-alih 60 FPS)."
        ),
        "academicReferences": [
            r"David, R., Duke, P., Jain, A., Janapa Reddi, V., Jeffries, N., Li, J., ... & Warden, P. (2021). TensorFlow Lite Micro: Embedded machine learning on TinyML systems. Proceedings of Machine Learning and Systems, 3, 800-811.",
            r"Apple Inc. (2023). Deploying Transformers on the Apple Neural Engine. Apple Machine Learning Research.",
            r"Qin, Z., Zhang, Z., Chen, H., et al. (2024). MobileNetV4: Universal models for the mobile ecosystem. arXiv preprint arXiv:2404.10518."
        ]
    }
})

# Simpan ke JSON
output_path = os.path.join(os.path.dirname(__file__), "cv_ch18_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"Generated {len(subchapters)} subchapters for Bab 18 -> {output_path}")
