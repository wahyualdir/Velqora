-- ============================================================
-- Migration 011: Seed Catatan Kurikulum — 6 Kategori AI Tambahan
-- (Reinforcement Learning, Speech & Audio AI, Recommendation System,
--  Expert System, Knowledge Representation, Multimodal AI)
-- Velqora Academic Knowledge Base
-- ============================================================

DO $SEED_REMAINING_AI_NOTES$
DECLARE
  v_cat_rl UUID;
  v_cat_speech UUID;
  v_cat_recsys UUID;
  v_cat_expert UUID;
  v_cat_knowrep UUID;
  v_cat_multimodal UUID;

  -- 1. Reinforcement Learning IDs (Prefix 0006)
  v_id_mdp UUID := '00000000-0000-0000-0006-000000000001';
  v_id_qlearning UUID := '00000000-0000-0000-0006-000000000002';
  v_id_ppo UUID := '00000000-0000-0000-0006-000000000003';

  -- 2. Speech & Audio AI IDs (Prefix 0007)
  v_id_mfcc UUID := '00000000-0000-0000-0007-000000000001';
  v_id_tts UUID := '00000000-0000-0000-0007-000000000002';
  v_id_audio_clf UUID := '00000000-0000-0000-0007-000000000003';

  -- 3. Recommendation System IDs (Prefix 0008)
  v_id_cf UUID := '00000000-0000-0000-0008-000000000001';
  v_id_content_based UUID := '00000000-0000-0000-0008-000000000002';
  v_id_hybrid_recsys UUID := '00000000-0000-0000-0008-000000000003';

  -- 4. Expert System IDs (Prefix 0009)
  v_id_expert_arch UUID := '00000000-0000-0000-0009-000000000001';
  v_id_forward_backward UUID := '00000000-0000-0000-0009-000000000002';
  v_id_csp UUID := '00000000-0000-0000-0009-000000000003';

  -- 5. Knowledge Representation IDs (Prefix 0010)
  v_id_kg_triples UUID := '00000000-0000-0000-0010-000000000001';
  v_id_first_order_logic UUID := '00000000-0000-0000-0010-000000000002';
  v_id_semantic_frames UUID := '00000000-0000-0000-0010-000000000003';

  -- 6. Multimodal AI IDs (Prefix 0011)
  v_id_clip UUID := '00000000-0000-0000-0011-000000000001';
  v_id_image_captioning UUID := '00000000-0000-0000-0011-000000000002';

  -- Referensi Catatan Sebelumnya
  v_id_agent_fund UUID := '00000000-0000-0000-0001-000000000010'; -- Prinsip Dasar Kecerdasan Buatan & Agen Cerdas
  v_id_mlp UUID := '00000000-0000-0000-0001-000000000004';        -- Multilayer Perceptron & Backpropagation
  v_id_cnn UUID := '00000000-0000-0000-0001-000000000007';        -- Convolutional Neural Network (CNN)
  v_id_transformer UUID := '00000000-0000-0000-0004-000000000001';-- Self-Attention & Arsitektur Transformer
  v_id_linreg UUID := '00000000-0000-0000-0001-000000000001';     -- Regresi Linear
BEGIN
  -- Resolusi ID Kategori
  SELECT id INTO v_cat_rl FROM categories WHERE LOWER(name) LIKE '%reinforcement learning%' LIMIT 1;
  SELECT id INTO v_cat_speech FROM categories WHERE LOWER(name) LIKE '%speech%' OR LOWER(name) LIKE '%audio%' LIMIT 1;
  SELECT id INTO v_cat_recsys FROM categories WHERE LOWER(name) LIKE '%recommendation%' LIMIT 1;
  SELECT id INTO v_cat_expert FROM categories WHERE LOWER(name) LIKE '%expert system%' LIMIT 1;
  SELECT id INTO v_cat_knowrep FROM categories WHERE LOWER(name) LIKE '%knowledge representation%' LIMIT 1;
  SELECT id INTO v_cat_multimodal FROM categories WHERE LOWER(name) LIKE '%multimodal%' LIMIT 1;

  -- ============================================================
  -- 1. REINFORCEMENT LEARNING (3 Catatan)
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_mdp,
    v_cat_rl,
    'markov-decision-process-mdp',
    'Markov Decision Process (MDP) & Bellman Equation',
    $md$# Markov Decision Process (MDP) & Bellman Equation

Kerangka matematis formal untuk memodelkan pengambilan keputusan sekuensial di mana hasil dari suatu tindakan sebagian bersifat acak dan sebagian dikendalikan oleh agen. Berbeda dengan supervised learning statis, pembelajaran berbasis reward memerlukan pemahaman dinamika transisi lingkungan.

Kaitan dengan konsep agen rasional dapat dipelajari kembali di [[Prinsip Dasar Kecerdasan Buatan & Agen Cerdas]].

### Komponen Tuple 5-Elemen MDP: $\langle S, A, P, R, \gamma \rangle$
1. **$S$ (State Space)**: Himpunan seluruh kondisi lingkungan yang mungkin diamati.
2. **$A$ (Action Space)**: Himpunan tindakan yang dapat diambil oleh agen pada suatu state.
3. **$P(s' \mid s, a)$ (Transition Probability)**: Probabilitas transisi ke state berikutnya $s'$ jika mengambil aksi $a$ pada state $s$.
4. **$R(s, a, s')$ (Reward Function)**: Umpan balik skalar numerik yang diterima setelah melakukan transisi.
5. **$\gamma \in [0, 1)$ (Discount Factor)**: Faktor diskonto yang menentukan seberapa besar nilai reward di masa depan dibandingkan reward saat ini.

### Persamaan Nilai Bellman (Bellman Expectation Equation)
Nilai state di bawah kebijakan $\pi$ dinyatakan secara rekursif:

$$V^\pi(s) = \sum_{a \in A} \pi(a \mid s) \sum_{s' \in S} P(s' \mid s, a) \left[ R(s, a, s') + \gamma V^\pi(s') \right]$$

```python
import numpy as np

# Simulasi sederhana Value Iteration pada Grid MDP 1D
n_states = 5
V = np.zeros(n_states)
rewards = np.array([0, 0, 0, 0, 10.0])  # Goal di state ke-4
gamma = 0.9

for step in range(50):
    V_new = np.copy(V)
    for s in range(n_states - 1):
        # Aksi: maju ke s+1 (deterministik)
        V_new[s] = rewards[s+1] + gamma * V[s+1]
    V = V_new

print("Estimasi Value State V(s):", np.round(V, 2))
```

#reinforcement-learning #mdp #bellman-equation$md$,
    1,
    'zap'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_qlearning,
    v_cat_rl,
    'q-learning-temporal-difference',
    'Q-Learning & Temporal Difference Update',
    $md$# Q-Learning & Temporal Difference Update

Metode *Model-Free Reinforcement Learning* berbasis *Off-Policy Temporal Difference (TD)*. Agen tidak memerlukan pengetahuan awal tentang matriks probabilitas transisi lingkungan $P(s' \mid s, a)$, melainkan belajar langsung dari pengalaman aksi dan observasi reward.

Konsep nilai state-action $Q(s, a)$ diperbarui secara bertahap menuju solusi optimal Bellman.

### Formula Pembaruan TD Q-Learning:
$$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]$$

Di mana $\alpha$ adalah learning rate, $\gamma$ adalah discount factor, dan suku $\left[ r + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]$ disebut **TD Error**.

### Eksplorasi vs Eksploitasi ($\epsilon$-Greedy)
Agar agen tidak terjebak pada reward lokal suboptimal, strategi $\epsilon$-greedy memilih aksi acak dengan probabilitas $\epsilon$ dan aksi terbaik ($\arg\max Q$) dengan probabilitas $1-\epsilon$.

```python
import numpy as np

# Inisialisasi Q-Table: 4 States, 2 Actions (0: Kiri, 1: Kanan)
Q = np.zeros((4, 2))
alpha, gamma, epsilon = 0.1, 0.9, 0.2

state, action, reward, next_state = 1, 1, 1.0, 2

# Temporal Difference Update
best_next_action = np.argmax(Q[next_state])
td_target = reward + gamma * Q[next_state, best_next_action]
td_error = td_target - Q[state, action]
Q[state, action] += alpha * td_error

print("Q-Value terbarui untuk (state=1, action=1):", round(Q[state, action], 4))
```

#reinforcement-learning #q-learning #temporal-difference$md$,
    2,
    'brain'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_ppo,
    v_cat_rl,
    'policy-gradient-ppo',
    'Policy Gradient & Proximal Policy Optimization (PPO)',
    $md$# Policy Gradient & Proximal Policy Optimization (PPO)

Dalam lingkungan dengan ruang aksi kontinu (*continuous action spaces*) seperti kendali robotik atau kendali gerak kendaraan otonom, Q-table diskrit tidak lagi dapat digunakan. Pendekatan **Policy Gradient** memparameterisasi kebijakan $\pi_\theta(a \mid s)$ langsung menggunakan jaringan saraf tiruan (seperti konsep dasar di [[Multilayer Perceptron (MLP) & Backpropagation]]).

### Mengapa PPO (Proximal Policy Optimization)?
Metode dasar *REINFORCE* sering mengalami instabilitas pelatihan yang parah ketika bobot $\theta$ melonjak terlalu jauh ke wilayah performa buruk (*policy collapse*). PPO mengatasi kelemahan ini dengan memperkenalkan **Clipped Surrogate Objective**:

$$L^{CLIP}(\theta) = \hat{\mathbb{E}}_t \left[ \min\left( r_t(\theta) \hat{A}_t, \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon) \hat{A}_t \right) \right]$$

Di mana rasio probabilitas kebijakan didefinisikan sebagai $r_t(\theta) = \frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_{old}}(a_t \mid s_t)}$ dan $\hat{A}_t$ adalah Advantage function yang mengukur seberapa jauh aksi tersebut lebih baik dibanding rata-rata ekspektasi nilai state.

```python
import torch

def ppo_clipped_loss(log_prob, old_log_prob, advantages, epsilon=0.2):
    ratio = torch.exp(log_prob - old_log_prob)
    surr1 = ratio * advantages
    surr2 = torch.clamp(ratio, 1.0 - epsilon, 1.0 + epsilon) * advantages
    loss = -torch.min(surr1, surr2).mean()
    return loss

# Contoh kalkulasi PPO Loss sederhana
ratios = torch.tensor([1.05, 1.35, 0.92])
adv = torch.tensor([0.8, 1.2, -0.5])
print("Surrogate Loss:", ppo_clipped_loss(torch.log(ratios), torch.zeros_like(ratios), adv).item())
```

#reinforcement-learning #ppo #policy-gradient$md$,
    3,
    'activity'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- ============================================================
  -- 2. SPEECH & AUDIO AI (3 Catatan)
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_mfcc,
    v_cat_speech,
    'audio-signal-processing-mfcc',
    'Pemrosesan Sinyal Audio & Ekstraksi Fitur MFCC',
    $md$# Pemrosesan Sinyal Audio & Ekstraksi Fitur MFCC

Sinyal suara merupakan gelombang akustik kontinu 1-dimensi yang merepresentasikan fluktuasi tekanan udara terhadap waktu. Agar model pembelajaran mesin dapat memproses sinyal audio, gelombang tersebut diubah menjadi representasi frekuensi waktu (*time-frequency spectrogram*).

### Tahapan Pipeline Ekstraksi MFCC:
1. **Framing & Windowing (Hamming Window)**: Memecah gelombang kontinu menjadi frame pendek (20-40 ms) agar sinyal bersifat kuasi-stasioner.
2. **Short-Time Fourier Transform (STFT)**: Mengubah domain waktu menjadi domain frekuensi Fourier.
3. **Mel-Scale Filterbank**: Mengonversi frekuensi Hertz linear $f$ ke skala non-linear Mel $m$ yang meniru sensitivitas telinga pendengaran manusia:
   $$m = 2595 \cdot \log_{10}\left(1 + \frac{f}{700}\right)$$
4. **Log Spectrum**: Mengambil nilai logaritma dari daya spektral untuk meniru persepsi volume suara.
5. **Discrete Cosine Transform (DCT)**: Mengurangi korelasi antar filter bank dan menghasilkan koefisien cepstral (umumnya 12-20 koefisien teratas).

```python
import numpy as np

def hz_to_mel(hz):
    return 2595 * np.log10(1 + hz / 700.0)

def mel_to_hz(mel):
    return 700 * (10**(mel / 2595.0) - 1)

# Uji rentang frekuensi percakapan manusia (300 Hz s/d 3400 Hz)
freqs = [300, 1000, 2000, 3400]
print("Frekuensi (Hz) ke Skala Mel:")
for f in freqs:
    print(f"{f} Hz -> {hz_to_mel(f):.2f} Mel")
```

#speech-ai #audio-processing #mfcc$md$,
    1,
    'mic'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_tts,
    v_cat_speech,
    'text-to-speech-vocoder',
    'Arsitektur Text-to-Speech (TTS) & Neural Vocoder',
    $md$# Arsitektur Text-to-Speech (TTS) & Neural Vocoder

Sistem sintesis suara modern (*Text-to-Speech*) memetakan teks tertulis langsung menjadi bentuk gelombang audio berkualitas tinggi yang terdengar alami. Arsitektur end-to-end modern umumnya dipisahkan menjadi dua subsistem utama:

### 1. Acoustic Model (Text to Mel-Spectrogram)
Mengubah barisan fonem teks menjadi representasi spektrogram mel. Model terkenal:
- **Tacotron 2**: Menggunakan arsitektur seq2seq dengan mekanisme attention berulang.
- **FastSpeech 2**: Model non-autoregressive berbasis feed-forward transformer yang memprediksi durasi, pitch, dan energi secara eksplisit sehingga sintesis berjalan sangat cepat.

### 2. Neural Vocoder (Spectrogram to Waveform)
Mengonversi spektrogram mel 2-dimensi menjadi gelombang sinyal audio 1-dimensi mentah (*raw waveform*).
- **HiFi-GAN**: Memakai multi-scale discriminator dan multi-period discriminator untuk menghasilkan audio dengan fidelitas tinggi pada kecepatan inferensi realtime.
- **WaveNet**: Arsitektur autoregressive berbasis dilated causal convolutions.

```python
# Skema representasi fonem teks sebelum masuk ke acoustic model
phonemes = ["H", "EH", "L", "OW", "W", "ER", "L", "D"]
phoneme_durations_ms = [60, 120, 80, 150, 70, 110, 90]
total_duration_ms = sum(phoneme_durations_ms)

print("Jumlah Fonem:", len(phonemes))
print("Durasi Prediksi Sintesis:", total_duration_ms, "ms")
```

#speech-ai #tts #neural-vocoder$md$,
    2,
    'radio'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_audio_clf,
    v_cat_speech,
    'audio-classification-speech-recognition',
    'Klasifikasi Audio & Automatic Speech Recognition (ASR)',
    $md$# Klasifikasi Audio & Automatic Speech Recognition (ASR)

Automatic Speech Recognition (ASR) bertugas menyalin sinyal suara percakapan lisan menjadi teks terstruktur. Representasi spektrogram audio 2D dapat diproses secara efektif menggunakan jaringan konvolusi seperti pada [[Convolutional Neural Network (CNN)]].

### Metode Utama ASR Modern:
1. **CTC (Connectionist Temporal Classification)**:
   Menangani masalah ketidakselarasan (*alignment*) antara panjang frame audio (yang berdurasi ribuan langkah waktu) dengan panjang karakter kalimat. Karakter khusus $\epsilon$ (blank) diperkenalkan untuk merepresentasikan jeda atau pengulangan fonem.
2. **Encoder-Decoder Whisper (OpenAI)**:
   Model fondasi ASR yang dilatih secara weakly supervised pada 680.000 jam data audio multilingual. Menggunakan encoder audio berbasis Transformer untuk memproses spektrogram mel 80-channel dan autoregressive decoder untuk memprediksi token teks.

```python
# Simulasi penyusunan decoding CTC sederhana
def ctc_greedy_decode(predictions, blank_token=0):
    raw_tokens = [p for p in predictions]
    collapsed = []
    prev = None
    for token in raw_tokens:
        if token != prev:
            if token != blank_token:
                collapsed.append(token)
            prev = token
    return collapsed

# Contoh: frame audio memprediksi token berulang dengan blank
preds = [0, 1, 1, 0, 2, 2, 2, 0, 3] # 1: 'a', 2: 'b', 3: 'c'
vocab = {1: 'a', 2: 'b', 3: 'c'}
tokens = ctc_greedy_decode(preds)
print("Hasil CTC Decoding:", "".join([vocab[t] for t in tokens]))
```

#speech-ai #asr #whisper$md$,
    3,
    'headphones'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- ============================================================
  -- 3. RECOMMENDATION SYSTEM (3 Catatan)
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_cf,
    v_cat_recsys,
    'collaborative-filtering-matrix-factorization',
    'Collaborative Filtering & Matrix Factorization',
    $md$# Collaborative Filtering & Matrix Factorization

Sistem rekomendasi berbasis *Collaborative Filtering* (CF) memprediksi preferensi atau rating suatu item bagi pengguna target berdasarkan kesamaan riwayat interaksi pengguna lain (*wisdom of the crowd*).

Sistem ini memiliki keterkaitan matematis dengan teknik optimasi gradien pada [[Regresi Linear]].

### Matrix Factorization & SVD
Matriks interaksi user-item $R \in \mathbb{R}^{|U| \times |I|}$ sering kali sangat renggang (*sparse*). *Matrix Factorization* memproyeksikan user dan item ke dalam ruang laten berdimensi rendah $k \ll \min(|U|, |I|)$:

$$\hat{r}_{ui} = \mu + b_u + b_i + \mathbf{p}_u^T \mathbf{q}_i$$

Di mana:
- $\mu$: Nilai rata-rata rating global di seluruh dataset.
- $b_u, b_i$: Bias spesifik masing-masing user dan item.
- $\mathbf{p}_u \in \mathbb{R}^k$: Vektor representasi laten preferensi user.
- $\mathbf{q}_i \in \mathbb{R}^k$: Vektor representasi laten karakteristik item.

Fungsi objektif diminimalkan dengan regularisasi $L_2$:
$$\min_{\mathbf{p}, \mathbf{q}, b} \sum_{(u, i) \in R} (r_{ui} - \hat{r}_{ui})^2 + \lambda (\|\mathbf{p}_u\|^2 + \|\mathbf{q}_i\|^2 + b_u^2 + b_i^2)$$

```python
import numpy as np

# Simulasi dot product vektor laten User dan Item
dim_laten = 3
p_user = np.array([0.8, -0.2, 0.5])   # Minat user pada genre/aspek
q_item = np.array([0.7, -0.1, 0.6])   # Kandungan genre item
mu, b_u, b_i = 3.5, 0.2, -0.1

prediksi_rating = mu + b_u + b_i + np.dot(p_user, q_item)
print(f"Prediksi Rating Skala 1-5: {prediksi_rating:.2f}")
```

#recommendation-system #collaborative-filtering #matrix-factorization$md$,
    1,
    'star'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_content_based,
    v_cat_recsys,
    'content-based-filtering',
    'Content-Based Filtering & Item Profiling',
    $md$# Content-Based Filtering & Item Profiling

Jika Collaborative Filtering bergantung pada interaksi pengguna lain, *Content-Based Filtering* berfokus pada kecocokan antara profil atribut intrinsik item (seperti metadata, genre, deskripsi tekstual) dengan riwayat konsumsi spesifik pengguna tersebut.

### Keunggulan Content-Based Filtering:
1. **Mengatasi Item Cold-Start**: Item baru yang baru dimasukkan ke katalog tetap dapat direkomendasikan seketika selama memiliki deskripsi fitur/metadata.
2. **Transparansi & Explainability**: Sangat mudah menjelaskan kepada pengguna mengapa suatu item direkomendasikan (*"Direkomendasikan karena Anda membaca modul Machine Learning"*).

### Perhitungan Kemiripan Kosinus (Cosine Similarity):
$$\text{Cosine Similarity}(\mathbf{u}, \mathbf{v}_i) = \frac{\mathbf{u} \cdot \mathbf{v}_i}{\|\mathbf{u}\| \|\mathbf{v}_i\|}$$

```python
import numpy as np

def cosine_similarity(v1, v2):
    dot = np.dot(v1, v2)
    norm = np.linalg.norm(v1) * np.linalg.norm(v2)
    return dot / norm if norm > 0 else 0.0

# Vektor profil minat user vs 2 item buku berbeda (fitur: [AI, Web, Database])
user_profile = np.array([0.9, 0.1, 0.2])
item_a = np.array([0.8, 0.0, 0.3]) # Buku Deep Learning
item_b = np.array([0.1, 0.9, 0.4]) # Buku React & Frontend

print("Kemiripan dengan Item A:", round(cosine_similarity(user_profile, item_a), 3))
print("Kemiripan dengan Item B:", round(cosine_similarity(user_profile, item_b), 3))
```

#recommendation-system #content-based #tf-idf$md$,
    2,
    'file-text'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_hybrid_recsys,
    v_cat_recsys,
    'hybrid-deep-learning-recsys',
    'Hybrid & Deep Learning Recommender (Two-Tower Architecture)',
    $md$# Hybrid & Deep Learning Recommender (Two-Tower Architecture)

Sistem rekomendasi berskala industri modern (seperti YouTube, Netflix, atau TikTok) menggunakan arsitektur hybrid multi-stage:
1. **Candidate Generation (Retrieval)**: Memilih ~100 kandidat teratas dari jutaan item dalam hitungan milidetik.
2. **Ranking**: Memberikan skor probabilitas klik/konversi presisi tinggi menggunakan model deep neural network yang kompleks.

### Arsitektur Two-Tower (Dual Encoder)
Arsitektur ini terdiri dari dua neural network terpisah:
- **Query / User Tower**: Menerima fitur pengguna (demografi, riwayat klik, konteks waktu) dan menghasilkan embedding $\mathbf{u} \in \mathbb{R}^d$.
- **Candidate / Item Tower**: Menerima fitur item (judul, tag, video embedding) dan menghasilkan embedding $\mathbf{v} \in \mathbb{R}^d$.

Skor kecocokan dihitung melalui dot product:
$$\text{Score}(u, i) = \langle \mathbf{u}, \mathbf{v}_i \rangle$$

Karena item embedding dapat dihitung sebelumnya (*offline indexing*), tahap retrieval dapat memanfaatkan pencarian tetangga terdekat berkecepatan tinggi (*Approximate Nearest Neighbor* / ANN seperti FAISS atau HNSW).

```python
import torch
import torch.nn as nn

class TwoTowerSimple(nn.Module):
    def __init__(self, emb_dim=32):
        super().__init__()
        self.user_tower = nn.Sequential(nn.Linear(64, emb_dim), nn.ReLU())
        self.item_tower = nn.Sequential(nn.Linear(64, emb_dim), nn.ReLU())

    def score(self, user_features, item_features):
        u = self.user_tower(user_features)
        v = self.item_tower(item_features)
        return torch.sum(u * v, dim=-1)

model = TwoTowerSimple()
user_f = torch.randn(1, 64)
item_f = torch.randn(1, 64)
print("Logit Skor Rekomendasi Two-Tower:", round(model.score(user_f, item_f).item(), 4))
```

#recommendation-system #deep-learning #two-tower$md$,
    3,
    'layers'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- ============================================================
  -- 4. EXPERT SYSTEM (3 Catatan)
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_expert_arch,
    v_cat_expert,
    'arsitektur-expert-system-knowledge-base',
    'Arsitektur Sistem Pakar & Knowledge Base',
    $md$# Arsitektur Sistem Pakar & Knowledge Base

Sistem Pakar (*Expert System*) adalah program komputer berbasis AI simbolik yang mengemulasi kemampuan pengambilan keputusan seorang pakar manusia dalam domain pengetahuan yang spesifik (misalnya diagnosis medis, analisis kegagalan mesin, atau audit kepatuhan hukum).

### 5 Komponen Inti Sistem Pakar:
1. **Knowledge Base (Basis Pengetahuan)**: Berisi fakta-fakta domain dan aturan heuristik (*rules* dalam bentuk premis `IF ... THEN ...`).
2. **Working Memory (Memori Kerja)**: Menyimpan fakta-fakta aktif yang diberikan oleh pengguna selama sesi konsultasi berlangsung.
3. **Inference Engine (Mesin Inferensi)**: Otak komputasi yang mencocokkan fakta dalam working memory dengan aturan di knowledge base untuk menurunkan kesimpulan baru.
4. **Explanation Facility (Fasilitas Penjelas)**: Menjelaskan alasan mengapa sistem meminta suatu fakta (*Why*) dan bagaimana suatu kesimpulan akhir dapat dicapai (*How*).
5. **User Interface (Antarmuka Pengguna)**: Fasilitas dialog interaktif antara pengguna non-pakar dengan sistem konsultasi.

```python
class SimpleKnowledgeBase:
    def __init__(self):
        self.facts = set()
        self.rules = [
            ({"demam", "batuk"}, "gejala_flu"),
            ({"gejala_flu", "kehilangan_penciuman"}, "indikasi_covid")
        ]

kb = SimpleKnowledgeBase()
kb.facts.update(["demam", "batuk", "kehilangan_penciuman"])
print("Fakta aktif awal:", kb.facts)
```

#expert-system #knowledge-base #inference-engine$md$,
    1,
    'shield'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_forward_backward,
    v_cat_expert,
    'forward-chaining-backward-chaining',
    'Inferensi Rule-Based: Forward vs Backward Chaining',
    $md$# Inferensi Rule-Based: Forward vs Backward Chaining

Dua strategi penalaran utama yang digunakan oleh *Inference Engine* untuk menurunkan kesimpulan logis:

### 1. Forward Chaining (Data-Driven Reasoning)
Dimulai dari fakta-fakta yang diketahui di memori kerja dan bergerak maju menggunakan aturan implikasi (*Modus Ponens*) hingga mencapai kesimpulan baru atau solusi.
- **Karakteristik**: Sangat ideal untuk masalah perencanaan (*planning*), sintesis desain, dan monitoring sistem.

### 2. Backward Chaining (Goal-Driven Reasoning)
Dimulai dari hipotesis tujuan akhir yang ingin dibuktikan (*goal*), kemudian bergerak mundur mencari aturan-aturan yang konklusinya cocok dengan goal tersebut, lalu memverifikasi apakah premis-premis pendukungnya terpenuhi.
- **Karakteristik**: Sangat efisien untuk masalah diagnosis penyakit atau troubleshooting teknis di mana tujuan dugaan spesifik telah ditentukan terlebih dahulu.

```python
def forward_chaining(facts, rules):
    inferred = set(facts)
    changed = True
    while changed:
        changed = False
        for antecedents, consequent in rules:
            if antecedents.issubset(inferred) and consequent not in inferred:
                inferred.add(consequent)
                changed = True
    return inferred

aturan = [
    ({"A", "B"}, "C"),
    ({"C", "D"}, "E"),
]
fakta_awal = {"A", "B", "D"}
hasil_inferensi = forward_chaining(fakta_awal, aturan)
print("Fakta Baru yang Berhasil Diturunkan:", hasil_inferensi - fakta_awal)
```

#expert-system #forward-chaining #rule-based$md$,
    2,
    'git-branch'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_csp,
    v_cat_expert,
    'constraint-satisfaction-problems-csp',
    'Constraint Satisfaction Problems (CSP) & Backtracking Search',
    $md$# Constraint Satisfaction Problems (CSP) & Backtracking Search

Banyak masalah penalaran dan optimasi dalam kecerdasan buatan dapat dirumuskan sebagai *Constraint Satisfaction Problem* (CSP). Berbeda dengan pencarian jalur standar pada [[Ruang Keadaan & Algoritma A*]], state dalam CSP didefinisikan sebagai himpunan variabel yang harus memenuhi sejumlah batasan (*constraints*).

### Komponen Formal CSP: $\langle X, D, C \rangle$
1. **$X = \{X_1, X_2, \dots, X_n\}$**: Himpunan variabel yang perlu diberi nilai.
2. **$D = \{D_1, D_2, \dots, D_n\}$**: Domain nilai yang valid untuk tiap variabel $X_i$.
3. **$C = \{C_1, C_2, \dots, C_m\}$**: Batasan-batasan relasional yang membatasi kombinasi nilai yang diizinkan.

### Algoritma Pemecahan:
- **Backtracking Search**: Pencarian depth-first yang menguji penugasan satu variabel per langkah dan mundur jika melanggar constraint.
- **Heuristik MRV (Minimum Remaining Values)**: Memilih variabel berikutnya yang memiliki sisa nilai domain paling sedikit.
- **Arc Consistency (Algoritma AC-3)**: Memangkas domain inkonsisten sebelum pencarian untuk mempercepat konvergensi.

```python
def csp_is_valid(assignment, var, val, neighbors):
    for neighbor in neighbors.get(var, []):
        if neighbor in assignment and assignment[neighbor] == val:
            return False
    return True

# Simulasi pewarnaan peta 3 wilayah bertetangga (A-B dan B-C)
variables = ["A", "B", "C"]
domain = ["Merah", "Hijau", "Biru"]
neighbors = {"A": ["B"], "B": ["A", "C"], "C": ["B"]}

penugasan = {"A": "Merah", "B": "Hijau"}
print("Apakah C boleh bernilai 'Hijau'?", csp_is_valid(penugasan, "C", "Hijau", neighbors))
print("Apakah C boleh bernilai 'Merah'?", csp_is_valid(penugasan, "C", "Merah", neighbors))
```

#expert-system #csp #backtracking$md$,
    3,
    'check-circle'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- ============================================================
  -- 5. KNOWLEDGE REPRESENTATION (3 Catatan)
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_kg_triples,
    v_cat_knowrep,
    'knowledge-graph-rdf-triples',
    'Knowledge Graph & RDF Triples (Subject-Predicate-Object)',
    $md$# Knowledge Graph & RDF Triples (Subject-Predicate-Object)

Knowledge Graph merepresentasikan data keterhubungan dunia nyata dalam bentuk struktur graf berarah berlabel (*labeled property graph*). Entitas direpresentasikan sebagai node, sedangkan relasi semantik antar entitas direpresentasikan sebagai edge.

### Struktur RDF Triples
Standar W3C mendefinisikan fakta pengetahuan sebagai triple yang terdiri dari 3 bagian:
$$\langle \text{Subject}, \text{Predicate}, \text{Object} \rangle$$

Contoh:
- $\langle \text{Geoffrey Hinton}, \text{penerimaPenghargaan}, \text{Turing Award} \rangle$
- $\langle \text{Turing Award}, \text{diberikanOleh}, \text{ACM} \rangle$

### Bahasa Kueri SPARQL
Graf semantik dikueri menggunakan bahasa deklaratif SPARQL dengan pola pencocokan graf (*graph pattern matching*).

```python
class SimpleKnowledgeGraph:
    def __init__(self):
        self.triples = []

    def add_fact(self, sub, pred, obj):
        self.triples.append((sub, pred, obj))

    def query(self, sub=None, pred=None, obj=None):
        return [
            t for t in self.triples
            if (sub is None or t[0] == sub) and
               (pred is None or t[1] == pred) and
               (obj is None or t[2] == obj)
        ]

kg = SimpleKnowledgeGraph()
kg.add_fact("Alan Turing", "pencetus", "Turing Test")
kg.add_fact("Turing Test", "domain", "Artificial Intelligence")

print("Fakta tentang Alan Turing:", kg.query(sub="Alan Turing"))
```

#knowledge-representation #knowledge-graph #rdf$md$,
    1,
    'network'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_first_order_logic,
    v_cat_knowrep,
    'first-order-logic-ontologi',
    'First-Order Logic (FOL) & Representasi Ontologi',
    $md$# First-Order Logic (FOL) & Representasi Ontologi

Jika logika proposisional hanya mampu menyatakan kebenaran atomik ($P \wedge Q$), **First-Order Logic (Logika Predikat Tingkat Pertama)** menyediakan daya ekspresi representasi pengetahuan yang jauh lebih kaya melalui objek, relasi (predikat), fungsi, dan kuantor.

### Elemen Formal First-Order Logic:
1. **Konstanta & Variabel**: Merepresentasikan objek spesifik (misal: $\text{Socrates}$) atau entitas arbitrer ($x$).
2. **Predikat**: Properti dari suatu objek atau relasi antar objek (misal: $\text{Manusia}(x)$, $\text{Ayah}(x, y)$).
3. **Kuantor Universal ($\forall$)**: *"Untuk semua $x$"*.
4. **Kuantor Eksistensial ($\exists$)**: *"Ada setidaknya satu $x$"*.

Contoh Silogisme Klasik dalam FOL:
$$\forall x (\text{Manusia}(x) \rightarrow \text{Fana}(x))$$
$$\text{Manusia}(\text{Socrates}) \vdash \text{Fana}(\text{Socrates})$$

### Ontologi & Web Ontology Language (OWL)
Ontologi mendefinisikan taksonomi hierarkis konsep dan batasan semantik relasi dalam suatu domain (misal: sebuah mobil harus memiliki roda, dan setiap mahasiswa terdaftar di universitas).

```python
# Evaluasi silogisme logika sederhana dengan Python
facts_human = {"Socrates", "Plato", "Aristoteles"}

def is_mortal(entity):
    # Rule: Semua manusia adalah fana
    return entity in facts_human

print("Apakah Socrates Fana?", is_mortal("Socrates"))
print("Apakah Angka 42 Fana?", is_mortal("42"))
```

#knowledge-representation #first-order-logic #ontology$md$,
    2,
    'book-open'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_semantic_frames,
    v_cat_knowrep,
    'semantic-network-frame-systems',
    'Semantic Network & Frame-Based Systems',
    $md$# Semantic Network & Frame-Based Systems

Struktur data representasi pengetahuan psikologis dan kognitif yang pertama kali dicetuskan oleh Marvin Minsky (1974) untuk menangkap ekspektasi umum manusia mengenai suatu konsep atau situasi stereotipik.

### Komponen Frame System:
- **Frame**: Struktur kumpulan atribut yang merepresentasikan sebuah objek atau konsep prototipikal (misalnya frame `Kendaraan`, frame `Mobil`).
- **Slots**: Atribut atau properti yang dimiliki oleh frame (misal: `jumlah_roda`, `mesin`, `pemilik`).
- **Facets / Demons**: Prosedur terikat yang otomatis dijalankan saat slot dibaca atau diubah (`if-needed`, `if-added`).
- **Relasi Inheritance (IS-A)**: Pewarisan karakteristik dari frame induk ke anak secara terstruktur.

```python
class Frame:
    def __init__(self, name, parent=None):
        self.name = name
        self.parent = parent
        self.slots = {}

    def get(self, slot_name):
        if slot_name in self.slots:
            return self.slots[slot_name]
        if self.parent:
            return self.parent.get(slot_name) # Warisan IS-A
        return None

# Definisi frame bertingkat
frame_kendaraan = Frame("Kendaraan")
frame_kendaraan.slots["bergerak"] = True
frame_kendaraan.slots["memiliki_roda"] = True

frame_sepeda = Frame("Sepeda", parent=frame_kendaraan)
frame_sepeda.slots["jumlah_roda"] = 2

print("Sepeda bergerak?", frame_sepeda.get("bergerak"))
print("Jumlah roda sepeda:", frame_sepeda.get("jumlah_roda"))
```

#knowledge-representation #semantic-network #frames$md$,
    3,
    'box'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- ============================================================
  -- 6. MULTIMODAL AI (2 Catatan)
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_clip,
    v_cat_multimodal,
    'clip-contrastive-vision-language',
    'Contrastive Language-Image Pre-training (CLIP)',
    $md$# Contrastive Language-Image Pre-training (CLIP)

Model fondasi multimodal terobosan yang dikembangkan oleh OpenAI untuk mempelajari representasi bersama (*joint embedding space*) antara citra visual dan teks bahasa alami secara *zero-shot*.

Model ini menggabungkan prinsip konvolusi visual dari [[Convolutional Neural Network (CNN)]] dengan prinsip self-attention dari [[Self-Attention & Arsitektur Transformer]].

### Arsitektur Dual-Encoder CLIP:
1. **Image Encoder**: Vision Transformer (ViT) atau ResNet yang memetakan gambar $I$ ke vektor embedding $e_I \in \mathbb{R}^d$.
2. **Text Encoder**: Transformer teks yang memetakan kalimat/prompt $T$ ke vektor embedding $e_T \in \mathbb{R}^d$.

### Fungsi Objektif Contrastive InfoNCE:
Untuk setiap batch berukuran $N$ pasangan $\langle \text{gambar}_i, \text{teks}_i \rangle$, model memaksimalkan kemiripan kosinus $N$ pasangan positif yang cocok dan meminimalkan kemiripan $N^2 - N$ pasangan negatif yang tidak cocok:

$$\mathcal{L}_{contrastive} = -\frac{1}{2N} \sum_{i=1}^N \left[ \log \frac{\exp(\text{sim}(e_{I_i}, e_{T_i}) / \tau)}{\sum_j \exp(\text{sim}(e_{I_i}, e_{T_j}) / \tau)} + \log \frac{\exp(\text{sim}(e_{I_i}, e_{T_i}) / \tau)}{\sum_j \exp(\text{sim}(e_{I_j}, e_{T_i}) / \tau)} \right]$$

```python
import torch
import torch.nn.functional as F

# Simulasi Zero-Shot Image Classification menggunakan Skor Kosinus CLIP
image_emb = torch.randn(1, 512) # Embedding dari gambar seekor kucing
image_emb = F.normalize(image_emb, dim=-1)

prompts = ["a photo of a dog", "a photo of a cat", "a photo of a car"]
text_emb = torch.randn(3, 512)
text_emb = F.normalize(text_emb, dim=-1)

similarities = (image_emb @ text_emb.T).squeeze(0)
probs = F.softmax(similarities * 100.0, dim=-1) # Suhu temperature tau

for p, prob in zip(prompts, probs):
    print(f"Probabilitas '{p}': {prob.item() * 100:.2f}%")
```

#multimodal-ai #clip #vision-language$md$,
    1,
    'eye'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_image_captioning,
    v_cat_multimodal,
    'image-captioning-visual-qa',
    'Image Captioning & Visual Question Answering (VQA)',
    $md$# Image Captioning & Visual Question Answering (VQA)

Tugas kecerdasan buatan multimodal tingkat tinggi di mana model tidak hanya mengklasifikasikan citra, tetapi juga mampu menghasilkan narasi deskriptif lengkap (*Image Captioning*) atau menjawab pertanyaan berbasis konten gambar secara mendalam (*Visual Question Answering* / VQA).

### Evolusi Arsitektur Modern (Vision-Language Models / VLM):
1. **Klasik (CNN + LSTM)**: CNN mengekstrak kisi fitur spasial, dan LSTM menghasilkan kata demi kata.
2. **Modern (LLaVA / Flamingo / PaLM-E)**:
   - **Visual Projection**: Proyeksi linier atau Q-Former (seperti BLIP-2) mengubah output visual encoder menjadi sejumlah token visual (*visual soft tokens*).
   - **LLM Backbone**: Token visual digabungkan langsung dengan token teks prompt ke dalam model bahasa besar (seperti Llama atau Mistral) untuk memprediksi token berikutnya secara autoregressive.

```python
import torch

# Skema proyeksi token visual ke ruang dimensi Large Language Model
visual_features = torch.randn(1, 49, 768)  # 49 patch visual dari ViT
linear_projection = torch.nn.Linear(768, 4096) # Proyeksi ke dimensi LLM 4096

llm_visual_tokens = linear_projection(visual_features)
print("Dimensi Token Visual Siap Masuk ke LLM Backbone:", tuple(llm_visual_tokens.shape))
```

#multimodal-ai #vqa #image-captioning$md$,
    2,
    'message-square'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index,
    category_id = EXCLUDED.category_id;

  -- ============================================================
  -- SEED TAGS & NOTE_LINKS
  -- ============================================================

  -- Tags
  INSERT INTO note_tags (note_id, tag) VALUES
    (v_id_mdp, 'reinforcement-learning'), (v_id_mdp, 'mdp'), (v_id_mdp, 'bellman-equation'),
    (v_id_qlearning, 'reinforcement-learning'), (v_id_qlearning, 'q-learning'), (v_id_qlearning, 'temporal-difference'),
    (v_id_ppo, 'reinforcement-learning'), (v_id_ppo, 'ppo'), (v_id_ppo, 'policy-gradient'),
    (v_id_mfcc, 'speech-ai'), (v_id_mfcc, 'audio-processing'), (v_id_mfcc, 'mfcc'),
    (v_id_tts, 'speech-ai'), (v_id_tts, 'tts'), (v_id_tts, 'neural-vocoder'),
    (v_id_audio_clf, 'speech-ai'), (v_id_audio_clf, 'asr'), (v_id_audio_clf, 'whisper'),
    (v_id_cf, 'recommendation-system'), (v_id_cf, 'collaborative-filtering'), (v_id_cf, 'matrix-factorization'),
    (v_id_content_based, 'recommendation-system'), (v_id_content_based, 'content-based'), (v_id_content_based, 'tf-idf'),
    (v_id_hybrid_recsys, 'recommendation-system'), (v_id_hybrid_recsys, 'deep-learning'), (v_id_hybrid_recsys, 'two-tower'),
    (v_id_expert_arch, 'expert-system'), (v_id_expert_arch, 'knowledge-base'), (v_id_expert_arch, 'inference-engine'),
    (v_id_forward_backward, 'expert-system'), (v_id_forward_backward, 'forward-chaining'), (v_id_forward_backward, 'rule-based'),
    (v_id_csp, 'expert-system'), (v_id_csp, 'csp'), (v_id_csp, 'backtracking'),
    (v_id_kg_triples, 'knowledge-representation'), (v_id_kg_triples, 'knowledge-graph'), (v_id_kg_triples, 'rdf'),
    (v_id_first_order_logic, 'knowledge-representation'), (v_id_first_order_logic, 'first-order-logic'), (v_id_first_order_logic, 'ontology'),
    (v_id_semantic_frames, 'knowledge-representation'), (v_id_semantic_frames, 'semantic-network'), (v_id_semantic_frames, 'frames'),
    (v_id_clip, 'multimodal-ai'), (v_id_clip, 'clip'), (v_id_clip, 'vision-language'),
    (v_id_image_captioning, 'multimodal-ai'), (v_id_image_captioning, 'vqa'), (v_id_image_captioning, 'image-captioning')
  ON CONFLICT DO NOTHING;

  -- Inter-Note Links (Wiki-Links)
  INSERT INTO note_links (source_note_id, target_note_id, raw_link_text) VALUES
    (v_id_mdp, v_id_agent_fund, 'Prinsip Dasar Kecerdasan Buatan & Agen Cerdas'),
    (v_id_ppo, v_id_mlp, 'Multilayer Perceptron (MLP) & Backpropagation'),
    (v_id_audio_clf, v_id_cnn, 'Convolutional Neural Network (CNN)'),
    (v_id_cf, v_id_linreg, 'Regresi Linear'),
    (v_id_clip, v_id_cnn, 'Convolutional Neural Network (CNN)'),
    (v_id_clip, v_id_transformer, 'Self-Attention & Arsitektur Transformer')
  ON CONFLICT DO NOTHING;

END $SEED_REMAINING_AI_NOTES$;
