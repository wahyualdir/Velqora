-- ============================================================
-- Migration 009: Seed Catatan Kurikulum — Generative AI, LLM, AI Agent
-- Velqora Academic Knowledge Base
-- ============================================================

DO $SEED_GENAI_LLM_AGENT$
DECLARE
  v_cat_genai UUID;
  v_cat_llm UUID;
  v_cat_agent UUID;

  v_id_gan UUID := '00000000-0000-0000-0003-000000000001';
  v_id_vae UUID := '00000000-0000-0000-0003-000000000002';
  v_id_diffusion UUID := '00000000-0000-0000-0003-000000000003';

  v_id_transformer UUID := '00000000-0000-0000-0004-000000000001';
  v_id_prompt UUID := '00000000-0000-0000-0004-000000000002';
  v_id_rag UUID := '00000000-0000-0000-0004-000000000003';

  v_id_toolcall UUID := '00000000-0000-0000-0005-000000000001';
  v_id_react UUID := '00000000-0000-0000-0005-000000000002';
  v_id_multiagent UUID := '00000000-0000-0000-0005-000000000003';

  v_id_agent_fund UUID := '00000000-0000-0000-0001-000000000010'; -- note lama: Prinsip Dasar Kecerdasan Buatan & Agen Cerdas
  v_id_mlp UUID := '00000000-0000-0000-0001-000000000004';        -- note lama: MLP & Backpropagation
  v_id_tokenisasi UUID := '00000000-0000-0000-0001-000000000006'; -- note lama: Tokenisasi & Word Embeddings
BEGIN
  SELECT id INTO v_cat_genai FROM categories WHERE LOWER(name) LIKE '%generative ai%' LIMIT 1;
  SELECT id INTO v_cat_llm FROM categories WHERE LOWER(name) LIKE '%large language model%' OR LOWER(name) LIKE '%llm%' LIMIT 1;
  SELECT id INTO v_cat_agent FROM categories WHERE LOWER(name) = 'ai agent' OR LOWER(name) LIKE '%ai agent%' LIMIT 1;

  -- ============================================================
  -- KATEGORI: GENERATIVE AI
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_gan,
    v_cat_genai,
    'generative-adversarial-network-gan',
    'Generative Adversarial Network (GAN)',
    $md$# Generative Adversarial Network (GAN)

Arsitektur pembelajaran generatif yang terdiri dari dua jaringan saraf yang saling berkompetisi: **Generator** (membuat data palsu dari noise acak) dan **Discriminator** (membedakan data asli vs palsu). Keduanya dilatih bersamaan dalam skema *minimax game* hingga generator mampu menghasilkan data yang sulit dibedakan dari data asli.

Fondasi jaringan generator/discriminator memakai lapisan dense yang sama seperti di [[Multilayer Perceptron (MLP) & Backpropagation]].

```python
import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, noise_dim, out_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(noise_dim, 128),
            nn.ReLU(),
            nn.Linear(128, out_dim),
            nn.Tanh()
        )

    def forward(self, z):
        return self.net(z)

class Discriminator(nn.Module):
    def __init__(self, in_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, 128),
            nn.LeakyReLU(0.2),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

noise_dim, data_dim = 16, 32
gen = Generator(noise_dim, data_dim)
disc = Discriminator(data_dim)

z = torch.randn(8, noise_dim)
data_palsu = gen(z)
skor_asli_vs_palsu = disc(data_palsu)
print("Bentuk data palsu:", data_palsu.shape)
print("Skor discriminator (mendekati 1 = dianggap asli):", skor_asli_vs_palsu.squeeze().detach().numpy())
```

#generative-ai #gan #deep-learning$md$,
    1,
    'Sparkles'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_vae,
    v_cat_genai,
    'variational-autoencoder-vae',
    'Variational Autoencoder (VAE)',
    $md$# Variational Autoencoder (VAE)

Model generatif berbasis *encoder-decoder* yang memetakan data input ke distribusi probabilistik di ruang laten (bukan satu titik tetap seperti autoencoder biasa), lalu men-decode sampel dari distribusi itu kembali menjadi data. Teknik *reparameterization trick* dipakai supaya proses sampling tetap bisa dilatih dengan backpropagation.

Berbeda dari [[Generative Adversarial Network (GAN)]] yang melatih dua jaringan saling berkompetisi, VAE melatih satu jaringan tunggal dengan fungsi loss gabungan (reconstruction loss + KL divergence).

```python
import torch
import torch.nn as nn

class VAEEncoder(nn.Module):
    def __init__(self, in_dim, latent_dim):
        super().__init__()
        self.fc = nn.Linear(in_dim, 64)
        self.fc_mu = nn.Linear(64, latent_dim)
        self.fc_logvar = nn.Linear(64, latent_dim)

    def forward(self, x):
        h = torch.relu(self.fc(x))
        return self.fc_mu(h), self.fc_logvar(h)

def reparameterize(mu, logvar):
    std = torch.exp(0.5 * logvar)
    eps = torch.randn_like(std)
    return mu + eps * std

encoder = VAEEncoder(in_dim=32, latent_dim=8)
x = torch.randn(4, 32)
mu, logvar = encoder(x)
z_sample = reparameterize(mu, logvar)
print("Bentuk vektor laten hasil sampling:", z_sample.shape)
```

#generative-ai #vae #deep-learning$md$,
    2,
    'Layers3'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_diffusion,
    v_cat_genai,
    'diffusion-model-text-to-image',
    'Diffusion Model & Text-to-Image Generation',
    $md$# Diffusion Model & Text-to-Image Generation

Model generatif yang bekerja dengan dua proses: *forward process* (menambahkan noise Gaussian secara bertahap ke data asli sampai jadi noise murni) dan *reverse process* (jaringan saraf belajar membalikkan proses itu, mendenoise langkah demi langkah dari noise murni menjadi data baru). Mendasari model text-to-image populer seperti Stable Diffusion dan DALL-E.

Dibandingkan [[Generative Adversarial Network (GAN)]] dan [[Variational Autoencoder (VAE)]], diffusion model umumnya menghasilkan kualitas gambar lebih stabil meski butuh lebih banyak langkah komputasi saat inferensi.

```python
import numpy as np

def forward_diffusion(x0, timesteps=10, beta_start=0.01, beta_end=0.2):
    betas = np.linspace(beta_start, beta_end, timesteps)
    x = x0.copy()
    trajectory = [x.copy()]
    for beta in betas:
        noise = np.random.randn(*x.shape)
        x = np.sqrt(1 - beta) * x + np.sqrt(beta) * noise
        trajectory.append(x.copy())
    return trajectory

data_asli = np.array([1.0, -0.5, 0.8, 0.2])
hasil_forward = forward_diffusion(data_asli, timesteps=5)
print("Data di setiap tahap forward diffusion (asli -> makin noise):")
for t, step in enumerate(hasil_forward):
    print(f"  t={t}: {np.round(step, 3)}")
```

#generative-ai #diffusion-model #text-to-image$md$,
    3,
    'Wand2'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- ============================================================
  -- KATEGORI: LARGE LANGUAGE MODEL
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_transformer,
    v_cat_llm,
    'arsitektur-transformer-self-attention',
    'Arsitektur Transformer & Self-Attention',
    $md$# Arsitektur Transformer & Self-Attention

Arsitektur dasar di balik hampir semua Large Language Model modern (GPT, BERT, LLaMA). Mekanisme **self-attention** memungkinkan setiap token dalam sebuah kalimat "melihat" dan memberi bobot relevansi ke token lain, terlepas dari jaraknya dalam urutan teks — mengatasi keterbatasan model sekuensial lama seperti RNN.

Input token diproses dari hasil [[Tokenisasi & Word Embeddings (Word2Vec / BERT)]], kemudian lapisan attention dan feed-forward-nya secara struktural mirip dengan [[Multilayer Perceptron (MLP) & Backpropagation]] yang disusun berulang (*stacked layers*).

```python
import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    weights = np.exp(scores) / np.exp(scores).sum(axis=-1, keepdims=True)
    output = weights @ V
    return output, weights

seq_len, d_model = 4, 8
Q = np.random.randn(seq_len, d_model)
K = np.random.randn(seq_len, d_model)
V = np.random.randn(seq_len, d_model)

output, attn_weights = scaled_dot_product_attention(Q, K, V)
print("Bentuk output attention:", output.shape)
print("Matriks bobot attention (baris = token query, kolom = token key):\n", np.round(attn_weights, 3))
```

#llm #transformer #self-attention$md$,
    1,
    'Network'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_prompt,
    v_cat_llm,
    'prompt-engineering-in-context-learning',
    'Prompt Engineering & In-Context Learning',
    $md$# Prompt Engineering & In-Context Learning

Teknik menyusun instruksi teks (*prompt*) untuk mengarahkan perilaku LLM tanpa mengubah bobot modelnya. Beberapa pola umum: **zero-shot** (langsung bertanya tanpa contoh), **few-shot** (menyisipkan beberapa contoh soal-jawaban di dalam prompt), dan **chain-of-thought** (meminta model menjabarkan langkah penalaran sebelum menjawab).

Efektivitas teknik ini bertumpu langsung pada bagaimana [[Arsitektur Transformer & Self-Attention]] memproses seluruh konteks yang diberikan dalam satu window sekaligus.

```python
def buat_prompt_few_shot(contoh_list, pertanyaan_baru):
    prompt = "Klasifikasikan sentimen kalimat berikut sebagai Positif atau Negatif.\n\n"
    for teks, label in contoh_list:
        prompt += f"Kalimat: \"{teks}\"\nSentimen: {label}\n\n"
    prompt += f"Kalimat: \"{pertanyaan_baru}\"\nSentimen:"
    return prompt

contoh = [
    ("Platform ini sangat membantu proses belajar saya", "Positif"),
    ("Materinya membingungkan dan sulit diikuti", "Negatif"),
]
prompt_final = buat_prompt_few_shot(contoh, "Fitur pencarian catatannya sangat cepat")
print(prompt_final)
```

#llm #prompt-engineering #in-context-learning$md$,
    2,
    'MessageSquareText'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_rag,
    v_cat_llm,
    'retrieval-augmented-generation-rag',
    'Retrieval-Augmented Generation (RAG) & Fine-Tuning',
    $md$# Retrieval-Augmented Generation (RAG) & Fine-Tuning

Dua pendekatan utama untuk membuat LLM menjawab dengan pengetahuan spesifik di luar data pelatihannya. **Fine-tuning** melatih ulang sebagian/seluruh bobot model dengan data baru (mahal, tapi pengetahuan "menyatu" ke dalam model). **RAG** mengambil dokumen relevan dari basis pengetahuan eksternal saat inferensi (via pencarian kemiripan vektor embedding), lalu menyisipkannya ke dalam prompt sebagai konteks tambahan — tanpa perlu melatih ulang model sama sekali.

Proses retrieval bergantung pada representasi vektor kata/dokumen, konsep yang sama dengan [[Tokenisasi & Word Embeddings (Word2Vec / BERT)]].

```python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Simulasi embedding dokumen (basis pengetahuan) dan query pengguna
dokumen = {
    "Cara reset password Velqora": np.array([0.9, 0.1, 0.2]),
    "Panduan menambahkan modul baru": np.array([0.2, 0.8, 0.1]),
    "Struktur kurikulum AI Velqora": np.array([0.1, 0.2, 0.9]),
}
query_embedding = np.array([0.85, 0.15, 0.25])  # Query: "bagaimana reset kata sandi saya?"

hasil = sorted(
    dokumen.items(),
    key=lambda item: cosine_similarity(query_embedding, item[1]),
    reverse=True
)
print("Dokumen paling relevan untuk di-retrieve ke dalam prompt:", hasil[0][0])
```

#llm #rag #fine-tuning #retrieval$md$,
    3,
    'Database'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- ============================================================
  -- KATEGORI: AI AGENT
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_toolcall,
    v_cat_agent,
    'agentic-workflow-tool-use-function-calling',
    'Agentic Workflow & Tool Use (Function Calling)',
    $md$# Agentic Workflow & Tool Use (Function Calling)

Kemampuan AI Agent untuk memutuskan kapan dan bagaimana memanggil alat/fungsi eksternal (kalkulator, pencarian web, database, API) di luar kemampuan bawaan LLM, lalu menggunakan hasilnya untuk melanjutkan penalaran atau menjawab pengguna. Ini yang membedakan "agent" dari sekadar chatbot — agent bisa **bertindak**, bukan cuma menjawab teks.

Konsep ini memperluas gagasan agen rasional yang sudah dibahas di [[Prinsip Dasar Kecerdasan Buatan & Agen Cerdas]], dengan LLM sebagai "otak" pengambil keputusan alat mana yang dipanggil.

```python
def cari_cuaca(kota):
    return f"Cuaca di {kota}: cerah, 29°C"

def hitung_kalkulator(ekspresi):
    return eval(ekspresi)

tools = {
    "cari_cuaca": cari_cuaca,
    "hitung_kalkulator": hitung_kalkulator,
}

def jalankan_agent(nama_tool, argumen):
    if nama_tool not in tools:
        return f"Tool '{nama_tool}' tidak dikenali."
    return tools[nama_tool](argumen)

# Simulasi keputusan agent: LLM memilih tool "cari_cuaca" dengan argumen "Pekanbaru"
keputusan_agent = ("cari_cuaca", "Pekanbaru")
hasil = jalankan_agent(*keputusan_agent)
print("Hasil eksekusi tool:", hasil)
```

#ai-agent #tool-use #function-calling$md$,
    1,
    'Bot'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_react,
    v_cat_agent,
    'react-reasoning-acting-loop',
    'ReAct: Reasoning + Acting Loop',
    $md$# ReAct: Reasoning + Acting Loop

Pola desain AI Agent yang menggabungkan penalaran (*Thought*) dan tindakan (*Action*) secara berulang: agent berpikir tentang langkah berikutnya, mengeksekusi satu aksi (misalnya memanggil tool), mengamati hasilnya (*Observation*), lalu mengulangi siklus itu sampai tugas selesai. Pola ini memperbaiki agent yang cuma menjawab langsung tanpa mengecek hasil tindakannya.

ReAct pada dasarnya adalah bentuk konkret dari [[Agentic Workflow & Tool Use (Function Calling)]] yang disusun sebagai loop eksplisit dengan jejak penalaran yang bisa dilacak.

```python
def agent_react_loop(tugas, tools, max_langkah=3):
    riwayat = []
    for langkah in range(1, max_langkah + 1):
        thought = f"Langkah {langkah}: mempertimbangkan cara menyelesaikan '{tugas}'"
        # Simulasi sederhana: agent memilih tool pertama yang tersedia
        nama_tool = list(tools.keys())[0]
        action_result = tools[nama_tool]()
        observation = f"Observasi: hasil dari '{nama_tool}' adalah -> {action_result}"
        riwayat.append({"thought": thought, "action": nama_tool, "observation": observation})
        if "selesai" in str(action_result).lower():
            break
    return riwayat

tools_tersedia = {"cek_status_tugas": lambda: "tugas selesai"}
jejak = agent_react_loop("menyelesaikan laporan mingguan", tools_tersedia)
for i, entri in enumerate(jejak, start=1):
    print(f"[{i}] {entri['thought']}")
    print(f"    {entri['observation']}")
```

#ai-agent #react #reasoning-acting$md$,
    2,
    'Repeat'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_multiagent,
    v_cat_agent,
    'multi-agent-system-orchestration',
    'Multi-Agent System & Orchestration',
    $md$# Multi-Agent System & Orchestration

Pendekatan yang memecah tugas kompleks ke beberapa agent khusus (misalnya: *Planner* yang menyusun rencana, *Executor* yang menjalankan langkah, *Critic* yang mengevaluasi hasil), dikoordinasikan oleh satu *orchestrator*. Pendekatan ini lebih mudah di-debug dan diskalakan dibanding satu agent monolitik yang mencoba melakukan semuanya sendiri.

Setiap agent dalam sistem ini biasanya tetap menjalankan siklus [[ReAct: Reasoning + Acting Loop]] miliknya sendiri, dan bisa memanggil tool lewat mekanisme [[Agentic Workflow & Tool Use (Function Calling)]] yang sama.

```python
class Orchestrator:
    def __init__(self):
        self.agents = {
            "planner": lambda tugas: f"Rencana untuk '{tugas}': bagi jadi 3 sub-tugas",
            "executor": lambda rencana: f"Mengeksekusi -> {rencana}",
            "critic": lambda hasil: f"Evaluasi -> {hasil} sudah memenuhi kriteria",
        }

    def jalankan(self, tugas):
        rencana = self.agents["planner"](tugas)
        hasil = self.agents["executor"](rencana)
        evaluasi = self.agents["critic"](hasil)
        return {"rencana": rencana, "hasil": hasil, "evaluasi": evaluasi}

orch = Orchestrator()
laporan = orch.jalankan("membuat ringkasan kurikulum AI")
for tahap, isi in laporan.items():
    print(f"{tahap.upper()}: {isi}")
```

#ai-agent #multi-agent #orchestration$md$,
    3,
    'Users'
  ) ON CONFLICT (slug) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

  -- ============================================================
  -- Precomputed Links (note_links)
  -- ============================================================
  DELETE FROM note_links WHERE source_note_id IN (
    v_id_gan, v_id_vae, v_id_diffusion,
    v_id_transformer, v_id_prompt, v_id_rag,
    v_id_toolcall, v_id_react, v_id_multiagent
  );

  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw) VALUES
    (v_id_gan, v_id_mlp, 'Multilayer Perceptron (MLP) & Backpropagation'),
    (v_id_vae, v_id_gan, 'Generative Adversarial Network (GAN)'),
    (v_id_diffusion, v_id_gan, 'Generative Adversarial Network (GAN)'),
    (v_id_diffusion, v_id_vae, 'Variational Autoencoder (VAE)'),
    (v_id_transformer, v_id_tokenisasi, 'Tokenisasi & Word Embeddings (Word2Vec / BERT)'),
    (v_id_transformer, v_id_mlp, 'Multilayer Perceptron (MLP) & Backpropagation'),
    (v_id_prompt, v_id_transformer, 'Arsitektur Transformer & Self-Attention'),
    (v_id_rag, v_id_tokenisasi, 'Tokenisasi & Word Embeddings (Word2Vec / BERT)'),
    (v_id_toolcall, v_id_agent_fund, 'Prinsip Dasar Kecerdasan Buatan & Agen Cerdas'),
    (v_id_react, v_id_toolcall, 'Agentic Workflow & Tool Use (Function Calling)'),
    (v_id_multiagent, v_id_react, 'ReAct: Reasoning + Acting Loop'),
    (v_id_multiagent, v_id_toolcall, 'Agentic Workflow & Tool Use (Function Calling)')
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- Tags (note_tags)
  -- ============================================================
  DELETE FROM note_tags WHERE note_id IN (
    v_id_gan, v_id_vae, v_id_diffusion,
    v_id_transformer, v_id_prompt, v_id_rag,
    v_id_toolcall, v_id_react, v_id_multiagent
  );

  INSERT INTO note_tags (note_id, tag) VALUES
    (v_id_gan, 'generative-ai'), (v_id_gan, 'gan'), (v_id_gan, 'deep-learning'),
    (v_id_vae, 'generative-ai'), (v_id_vae, 'vae'), (v_id_vae, 'deep-learning'),
    (v_id_diffusion, 'generative-ai'), (v_id_diffusion, 'diffusion-model'), (v_id_diffusion, 'text-to-image'),
    (v_id_transformer, 'llm'), (v_id_transformer, 'transformer'), (v_id_transformer, 'self-attention'),
    (v_id_prompt, 'llm'), (v_id_prompt, 'prompt-engineering'), (v_id_prompt, 'in-context-learning'),
    (v_id_rag, 'llm'), (v_id_rag, 'rag'), (v_id_rag, 'fine-tuning'), (v_id_rag, 'retrieval'),
    (v_id_toolcall, 'ai-agent'), (v_id_toolcall, 'tool-use'), (v_id_toolcall, 'function-calling'),
    (v_id_react, 'ai-agent'), (v_id_react, 'react'), (v_id_react, 'reasoning-acting'),
    (v_id_multiagent, 'ai-agent'), (v_id_multiagent, 'multi-agent'), (v_id_multiagent, 'orchestration')
  ON CONFLICT DO NOTHING;

END $SEED_GENAI_LLM_AGENT$;
