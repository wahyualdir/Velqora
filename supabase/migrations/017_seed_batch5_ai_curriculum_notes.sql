-- ============================================================
-- Migration 017: Seed AI Curriculum Notes (Batch 5 - 5 Topik)
-- Topik:
-- 1. Multimodal AI (10 Bab)
-- 2. Recommendation System (12 Bab)
-- 3. Natural Language Processing (14 Bab)
-- 4. Reinforcement Learning (13 Bab)
-- 5. Robotics & Embodied AI (13 Bab)
-- Total: 62 Bab Catatan Lengkap Kurikulum & Praktikum AI
-- ============================================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;

DO $$
DECLARE
  v_user_id UUID;
  v_parent_ai_id UUID;
  v_cat_multi UUID;
  v_cat_recsys UUID;
  v_cat_nlp UUID;
  v_cat_rl UUID;
  v_cat_robo UUID;
  v_has_icon BOOLEAN;
  v_has_parent BOOLEAN;
BEGIN
  -- 1. Dapatkan user admin/owner atau user pertama yang ada di sistem
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'wahyualdiriyanto80@gmail.com' LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'icon'
  ) INTO v_has_icon;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'parent_id'
  ) INTO v_has_parent;

  -- Dapatkan ID Kategori Induk Kecerdasan Buatan
  SELECT id INTO v_parent_ai_id FROM categories WHERE name = 'Kecerdasan Buatan' LIMIT 1;
  IF v_parent_ai_id IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (''Kecerdasan Buatan'', ''#8B5CF6'', ''machine_learning'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_parent_ai_id;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Kecerdasan Buatan', '#8B5CF6', v_user_id) RETURNING id INTO v_parent_ai_id;
    END IF;
  END IF;

  -- Kategori: Multimodal AI
  SELECT id INTO v_cat_multi FROM categories WHERE name = 'Multimodal AI' LIMIT 1;
  IF v_cat_multi IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Multimodal AI') || ', ''#F59E0B'', ''generative_ai'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_multi;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Multimodal AI') || ', ''#F59E0B'', ''generative_ai'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_multi;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Multimodal AI', '#F59E0B', v_user_id) RETURNING id INTO v_cat_multi;
    END IF;
  END IF;

  -- Kategori: Recommendation System
  SELECT id INTO v_cat_recsys FROM categories WHERE name = 'Recommendation System' LIMIT 1;
  IF v_cat_recsys IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Recommendation System') || ', ''#8B5CF6'', ''machine_learning'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_recsys;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Recommendation System') || ', ''#8B5CF6'', ''machine_learning'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_recsys;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Recommendation System', '#8B5CF6', v_user_id) RETURNING id INTO v_cat_recsys;
    END IF;
  END IF;

  -- Kategori: Natural Language Processing
  SELECT id INTO v_cat_nlp FROM categories WHERE name = 'Natural Language Processing' LIMIT 1;
  IF v_cat_nlp IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Natural Language Processing') || ', ''#10B981'', ''nlp'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_nlp;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Natural Language Processing') || ', ''#10B981'', ''nlp'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_nlp;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Natural Language Processing', '#10B981', v_user_id) RETURNING id INTO v_cat_nlp;
    END IF;
  END IF;

  -- Kategori: Reinforcement Learning
  SELECT id INTO v_cat_rl FROM categories WHERE name = 'Reinforcement Learning' LIMIT 1;
  IF v_cat_rl IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Reinforcement Learning') || ', ''#8B5CF6'', ''reinforcement'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_rl;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Reinforcement Learning') || ', ''#8B5CF6'', ''reinforcement'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_rl;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Reinforcement Learning', '#8B5CF6', v_user_id) RETURNING id INTO v_cat_rl;
    END IF;
  END IF;

  -- Kategori: Robotics & Embodied AI
  SELECT id INTO v_cat_robo FROM categories WHERE name = 'Robotics & Embodied AI' LIMIT 1;
  IF v_cat_robo IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Robotics & Embodied AI') || ', ''#EF4444'', ''robotics'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_robo;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Robotics & Embodied AI') || ', ''#EF4444'', ''robotics'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_robo;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Robotics & Embodied AI', '#EF4444', v_user_id) RETURNING id INTO v_cat_robo;
    END IF;
  END IF;

  -- ------------------------------------------------------------
  -- BAGIAN 1: MULTIMODAL AI (10 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Multimodal AI',
    'bab-1-konsep-dasar-multimodal-ai',
    '# BAB 1: Konsep Dasar Multimodal AI

Definisi & jenis modalitas (teks, gambar, audio, video, sensor spasial), tantangan alignment temporal/semantik, dan heterogenitas representasi data.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Multimodal AI dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# modality_tensor_shapes.py
import numpy as np

# Representasi dimensi tensor berbagai modalitas data AI
modalities = {
    "Teks": np.zeros((1, 128)),            # Batch, Token Seq Len
    "Gambar": np.zeros((1, 3, 224, 224)),   # Batch, Channels, Height, Width
    "Audio": np.zeros((1, 1, 16000)),       # Batch, Channels, Audio Samples (1s @ 16kHz)
    "Video": np.zeros((1, 16, 3, 224, 224)) # Batch, Frames, Channels, Height, Width
}

print("Bentuk Tensor Representasi Modalitas Standar:")
for name, tensor in modalities.items():
    print(f"- {name}: {tensor.shape}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Multimodal AI** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    1,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Representasi & Fusion Multimodal',
    'bab-2-representasi-fusion-multimodal',
    '# BAB 2: Representasi & Fusion Multimodal

Strategi penggabungan modalitas: Early Fusion (fitur mentah), Late Fusion (skor keputusan), Joint Embedding Space, dan Cross-Modal Attention.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Representasi & Fusion Multimodal dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# cross_modal_attention.py
import numpy as np

def cross_modal_attention(text_queries, image_keys, image_values):
    # Q berasal dari teks, K & V berasal dari patch citra
    d_k = text_queries.shape[-1]
    scores = np.dot(text_queries, image_keys.T) / np.sqrt(d_k)
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    attention_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    return np.dot(attention_weights, image_values), attention_weights

Q_text = np.random.randn(2, 64)   # 2 text tokens
K_img = np.random.randn(16, 64)   # 16 visual patches
V_img = np.random.randn(16, 64)

fused_tokens, attn = cross_modal_attention(Q_text, K_img, V_img)
print("Bentuk Hasil Cross-Modal Attention:", fused_tokens.shape)
print("Distribusi Perhatian Token Teks Pertama terhadap Visual Patch:\n", np.round(attn[0][:4], 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Representasi & Fusion Multimodal** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    2,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Model Vision-Language',
    'bab-3-model-vision-language',
    '# BAB 3: Model Vision-Language

Arsitektur Vision-Language: CLIP (Contrastive Language-Image Pretraining), BLIP & BLIP-2 (Q-Former bridge), Visual Question Answering (VQA), dan Image Captioning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Model Vision-Language dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# clip_similarity_metric.py
import numpy as np

def compute_clip_score(image_embed, text_embeds):
    # Cosine similarity di ruang embedding bersama (Joint Latent Space)
    img_norm = image_embed / np.linalg.norm(image_embed)
    txt_norm = text_embeds / np.linalg.norm(text_embeds, axis=1, keepdims=True)
    return np.dot(txt_norm, img_norm)

image_vec = np.array([0.9, 0.1, 0.2])
text_candidates = np.array([
    [0.85, 0.15, 0.25], # "Foto seekor kucing tidur di sofa"
    [-0.5, 0.7, 0.4]    # "Mobil balap melaju di sirkuit"
])

scores = compute_clip_score(image_vec, text_candidates)
print("Skor Kesesuaian CLIP Teks 1 (Kucing):", round(scores[0], 4))
print("Skor Kesesuaian CLIP Teks 2 (Mobil):", round(scores[1], 4))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Model Vision-Language** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    3,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Model Text-to-Image & Text-to-Video',
    'bab-4-model-text-to-image-text-to-video',
    '# BAB 4: Model Text-to-Image & Text-to-Video

Generasi visual multimodal: conditioned diffusion models, arsitektur cross-attention DALL-E & Stable Diffusion, dan konsistensi temporal pada Text-to-Video (Sora-style).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Model Text-to-Image & Text-to-Video dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# text_conditioned_diffusion_step.py
import numpy as np

def mock_denoising_step(noisy_latents, text_conditioning, timestep=50):
    # Simulasi estimasi noise terpandu teks (Classifier-Free Guidance)
    estimated_noise = 0.6 * noisy_latents + 0.4 * text_conditioning
    cleaned_latents = noisy_latents - (0.02 * estimated_noise)
    return cleaned_latents

latents = np.random.randn(4, 4)
text_prompt_emb = np.ones((4, 4)) * 0.5
denoised = mock_denoising_step(latents, text_prompt_emb)

print("Latent Citra sebelum Denoising:\n", np.round(latents[:2], 3))
print("Latent Citra setelah Denoising Terpandu Teks:\n", np.round(denoised[:2], 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Model Text-to-Image & Text-to-Video** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    4,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Model Audio-Visual',
    'bab-5-model-audio-visual',
    '# BAB 5: Model Audio-Visual

Integrasi audio dan visual: Lip Reading (pembacaan bibir otomatis), Audio-Visual Speech Recognition (AVSR) tahan derau, dan Video Captioning tersinkronisasi audio.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Model Audio-Visual dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# avsr_feature_fusion.py
import numpy as np

# Fusion fitur video gerakan bibir + spektrogram audio
visual_mouth_features = np.array([0.75, 0.82, 0.90]) # Deteksi bentuk bibir
audio_spectral_features = np.array([0.70, 0.80, 0.88]) # Spektrum frekuensi suara

# Gated fusion
gate_weight = 0.6 # Bobot prioritas audio dalam kondisi low-noise
fused_representation = (gate_weight * audio_spectral_features) + ((1 - gate_weight) * visual_mouth_features)

print("Fitur Visual Bibir:", visual_mouth_features)
print("Fitur Audio Akustik:", audio_spectral_features)
print("Representasi Audio-Visual Terfusi:", np.round(fused_representation, 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Model Audio-Visual** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    5,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Large Multimodal Model (LMM)',
    'bab-6-large-multimodal-model-lmm',
    '# BAB 6: Large Multimodal Model (LMM)

Model Vision-Language Skala Besar (GPT-4V, Claude 3.5, LLaVA), Model Multimodal Native (Gemini-style interleaved token), dan arsitektur Multimodal Transformer.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Large Multimodal Model (LMM) dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# llava_projection_bridge.py
import numpy as np

# Simulasi modul proyeksi MLP LLaVA: memetakan visual features ke LLM token dimension
visual_encoder_dim = 1024
llm_dim = 4096

W_mlp_proj = np.random.randn(visual_encoder_dim, llm_dim) * 0.02
clip_visual_tokens = np.random.randn(576, visual_encoder_dim) # 24x24 patches

llm_visual_tokens = clip_visual_tokens @ W_mlp_proj
print("Visual Tokens dari Vision Transformer (ViT):", clip_visual_tokens.shape)
print("Visual Tokens siap di-prepend ke LLM Embedding:", llm_visual_tokens.shape)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Large Multimodal Model (LMM)** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    6,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Model Native Multimodal & Unified',
    'bab-7-model-native-multimodal-unified',
    '# BAB 7: Model Native Multimodal & Unified

Unified Tokenization lintas modalitas (VQ-VAE/SoundStream untuk diskritisasi token audio-visual) dan model yang memproses teks, gambar, suara, dan video dalam satu kamus kosakata terpadu.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Model Native Multimodal & Unified dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# unified_tokenizer_concept.py
class UnifiedTokenizer:
    def __init__(self):
        self.text_vocab_range = (0, 32000)
        self.image_codebook_range = (32001, 40192)
        self.audio_codebook_range = (40193, 44288)

    def decode_token_type(self, token_id):
        if self.text_vocab_range[0] <= token_id <= self.text_vocab_range[1]:
            return "Modalitas: TEKS"
        elif self.image_codebook_range[0] <= token_id <= self.image_codebook_range[1]:
            return "Modalitas: CITRA (Visual Codebook)"
        elif self.audio_codebook_range[0] <= token_id <= self.audio_codebook_range[1]:
            return "Modalitas: AUDIO (Acoustic Codebook)"
        return "Unknown"

tok = UnifiedTokenizer()
for tid in [1542, 35000, 42000]:
    print(f"Token ID {tid} -> {tok.decode_token_type(tid)}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Model Native Multimodal & Unified** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    7,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Multimodal Reasoning',
    'bab-8-multimodal-reasoning',
    '# BAB 8: Multimodal Reasoning

Multimodal Chain-of-Thought (CoT), spatial and diagrammatic reasoning, grounding deteksi koordinat kotak pembatas (bounding box), dan penalaran gambar-teks terpadu.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Multimodal Reasoning dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# multimodal_cot_bbox.py
def parse_multimodal_reasoning(cot_output):
    # Contoh output reasoning berlandaskan bounding box (grounded CoT)
    steps = [
        "1. Identifikasi objek target: rambu lalu lintas di [ymin: 120, xmin: 340, ymax: 210, xmax: 430]",
        "2. Deteksi teks OCR pada rambu: terbaca ''STOP''",
        "3. Kesimpulan: Kendaraan otonom harus berhenti penuh sebelum garis henti."
    ]
    return "\n".join(steps)

print("[Multimodal Chain-of-Thought]:")
print(parse_multimodal_reasoning("Analisis gambar jalan raya"))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Multimodal Reasoning** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    8,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Evaluasi Model Multimodal',
    'bab-9-evaluasi-model-multimodal',
    '# BAB 9: Evaluasi Model Multimodal

Benchmark standar (MMBench, MME, MathVista, VQA-v2), metrik evaluasi cross-modal (CIDEr, SPICE, BLEU-4, Image-Text Recall@K), dan deteksi halusinasi visual.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Evaluasi Model Multimodal dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vqa_accuracy_eval.py
def calculate_vqa_accuracy(predictions, ground_truths_list):
    # Metrik standar VQA: min(count(jawaban sesuai) / 3, 1.0)
    scores = []
    for pred, gts in zip(predictions, ground_truths_list):
        matches = sum(1 for gt in gts if gt.lower() == pred.lower())
        score = min(matches / 3.0, 1.0)
        scores.append(score)
    return np.mean(scores)

preds = ["kucing", "merah"]
gts = [["kucing", "kucing", "anak kucing"], ["merah", "merah", "merah", "oranye"]]
print(f"Akurasi VQA Standar: {calculate_vqa_accuracy(preds, gts) * 100:.2f}%")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Evaluasi Model Multimodal** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    9,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Aplikasi Multimodal AI',
    'bab-10-aplikasi-multimodal-ai',
    '# BAB 10: Aplikasi Multimodal AI

Implementasi industri: asisten virtual multimodal interaktif, mesin pencari multimodal (Image-Text Retrieval), robotika persepsi lingkungan, dan analisis medis radiologi-laporan terpadu.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Aplikasi Multimodal AI dalam domain Multimodal AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# multimodal_search_engine.py
class MultimodalSearchIndex:
    def __init__(self):
        self.catalog = [
            {"id": 1, "title": "Sepatu Lari Merah", "features": np.array([0.9, 0.2, 0.1])},
            {"id": 2, "title": "Kemeja Formal Putih", "features": np.array([0.1, 0.8, 0.3])}
        ]

    def search_by_query_embedding(self, query_emb):
        best_item = max(self.catalog, key=lambda item: np.dot(item["features"], query_emb))
        return best_item

searcher = MultimodalSearchIndex()
query_features = np.array([0.85, 0.25, 0.05]) # Gambar sepatu yang diunggah pengguna
res = searcher.search_by_query_embedding(query_features)
print(f"Hasil Pencarian Multimodal Relevan: {res[''title'']} (ID: {res[''id'']})")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Aplikasi Multimodal AI** merupakan pilar fundamental dalam spesialisasi Multimodal AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Video',
    10,
    v_cat_multi,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 2: RECOMMENDATION SYSTEM (12 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Dasar Sistem Rekomendasi',
    'bab-1-dasar-sistem-rekomendasi',
    '# BAB 1: Dasar Sistem Rekomendasi

Konsep & tujuan Recommendation System, explicit rating vs implicit clicks/watch time, penanganan Cold Start Problem untuk pengguna/item baru, serta personalisasi vs kurasi trending.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Dasar Sistem Rekomendasi dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# implicit_interaction_matrix.py
import numpy as np

# Matriks interaksi pengguna vs item (Implicit Clicks & Duration)
users = ["User1", "User2", "User3"]
items = ["ItemA", "ItemB", "ItemC", "ItemD"]

# Nilai mewakili intensitas interaksi (misal: jumlah klik / detik tayang)
interaction_matrix = np.array([
    [5, 0, 2, 0],
    [0, 8, 0, 1],
    [3, 0, 4, 7]
])

print("Tingkat Sparsitas Matriks Interaksi:", 
      f"{100 * (1 - np.count_nonzero(interaction_matrix) / interaction_matrix.size):.1f}%")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Dasar Sistem Rekomendasi** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Compass',
    1,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Content-Based Filtering',
    'bab-2-content-based-filtering',
    '# BAB 2: Content-Based Filtering

Representasi profil item (TF-IDF metadata, dense embedding katalog), pembentukan profil pengguna berdasarkan riwayat interaksi, dan perhitungan similarity (Cosine, Jaccard).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Content-Based Filtering dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# content_based_similarity.py
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Fitur item (Genre Film: [Aksi, Komedi, Drama, Sci-Fi])
items_profiles = np.array([
    [1, 0, 0, 1], # Interstellar
    [1, 1, 0, 0], # Deadpool
    [0, 1, 1, 0]  # The Grand Budapest Hotel
])

# Profil preferensi pengguna (suka Aksi dan Sci-Fi)
user_profile = np.array([[0.8, 0.1, 0.0, 0.9]])

scores = cosine_similarity(user_profile, items_profiles)[0]
print("Skor Kesesuaian Konten:")
print(f"- Interstellar: {scores[0]:.4f}")
print(f"- Deadpool: {scores[1]:.4f}")
print(f"- The Grand Budapest: {scores[2]:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Content-Based Filtering** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    2,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Collaborative Filtering',
    'bab-3-collaborative-filtering',
    '# BAB 3: Collaborative Filtering

User-Based vs Item-Based Collaborative Filtering, Matrix Factorization (Singular Value Decomposition SVD, Alternating Least Squares ALS), dan pemodelan feedback implisit.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Collaborative Filtering dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# matrix_factorization_svd.py
import numpy as np

# Matriks rating R (3 Pengguna x 3 Film)
R = np.array([
    [5, 3, 0],
    [4, 0, 0],
    [1, 1, 5]
], dtype=float)

# Dekomposisi SVD: R ~ U * Sigma * Vt
U, sigma, Vt = np.linalg.svd(R, full_matrices=False)
k = 2 # Dimensi laten
R_reconstructed = np.dot(U[:, :k] * sigma[:k], Vt[:k, :])

print("Matriks Rating Asli:\n", R)
print("Prediksi Rating Pasca Rekonstruksi SVD:\n", np.round(R_reconstructed, 2))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Collaborative Filtering** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    3,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Hybrid Recommendation',
    'bab-4-hybrid-recommendation',
    '# BAB 4: Hybrid Recommendation

Strategi menggabungkan kekuatan metode: Weighted Hybrid, Switching Hybrid, Feature Combination, dan Cascade Hybrid (penyaringan bertahap coarse-to-fine).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Hybrid Recommendation dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# weighted_hybrid_recsys.py
def weighted_hybrid_score(cf_score, content_score, weight_cf=0.6):
    return (weight_cf * cf_score) + ((1 - weight_cf) * content_score)

items = ["Film A", "Film B", "Film C"]
cf_preds = [4.2, 3.1, 4.8]
content_preds = [3.8, 4.5, 3.9]

hybrid_rankings = [
    (item, weighted_hybrid_score(cf, cnt))
    for item, cf, cnt in zip(items, cf_preds, content_preds)
]
hybrid_rankings.sort(key=lambda x: x[1], reverse=True)

print("Peringkat Rekomendasi Hybrid Terpadu:")
for rank, (item, score) in enumerate(hybrid_rankings, 1):
    print(f"{rank}. {item} (Skor: {score:.2f})")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Hybrid Recommendation** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    4,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Deep Learning untuk Rekomendasi',
    'bab-5-deep-learning-untuk-rekomendasi',
    '# BAB 5: Deep Learning untuk Rekomendasi

Neural Collaborative Filtering (NCF), Autoencoder untuk rekomendasi (AutoRec), arsitektur Wide & Deep (Google), serta Two-Tower Model untuk embedding-based retrieval skala besar.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Deep Learning untuk Rekomendasi dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# two_tower_retrieval_model.py
import numpy as np

def two_tower_dot_product(user_tower_output, item_tower_outputs):
    # Menghitung kesamaan dot-product antara vektor user dan kandidat item
    return np.dot(item_tower_outputs, user_tower_output)

user_embedding = np.array([0.5, -0.2, 0.8]) # Output dari User Tower (DNN)
items_catalog = np.array([
    [0.6, -0.1, 0.7],  # Item 1
    [-0.3, 0.8, -0.2], # Item 2
    [0.4, -0.3, 0.9]   # Item 3
])

candidate_scores = two_tower_dot_product(user_embedding, items_catalog)
best_item_idx = np.argmax(candidate_scores)

print("Skor Dot-Product Two-Tower:", np.round(candidate_scores, 3))
print(f"Item Terbaik Direkomendasikan: Item {best_item_idx + 1}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Deep Learning untuk Rekomendasi** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Brain',
    5,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Sequential & Session-Based Recommendation',
    'bab-6-sequential-session-based-recommendation',
    '# BAB 6: Sequential & Session-Based Recommendation

Rekomendasi berbasis urutan waktu interaksi: model sekuensial RNN/GRU4Rec, Transformer untuk rekomendasi (SASRec, BERT4Rec), dan prediksi Next-Item dalam satu sesi aktif.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Sequential & Session-Based Recommendation dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# sasrec_self_attention_demo.py
import numpy as np

# Simulasi self-attention sederhana pada riwayat sesi belanja
def session_self_attention(session_items_emb):
    # session_items_emb: (Seq_Len, Dim)
    scores = np.dot(session_items_emb, session_items_emb.T)
    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)
    next_intent_vector = np.dot(weights[-1], session_items_emb) # Representasi intent item terakhir
    return next_intent_vector

session_history = np.array([
    [0.1, 0.9], # Klik: Smartphone
    [0.2, 0.8], # Klik: Casing HP
    [0.3, 0.85] # Klik: Screen Protector
])

intent = session_self_attention(session_history)
print("Vektor Intent Sesi Terkini:", np.round(intent, 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Sequential & Session-Based Recommendation** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    6,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Graph-Based Recommendation',
    'bab-7-graph-based-recommendation',
    '# BAB 7: Graph-Based Recommendation

Rekomendasi graf interaksi pengguna-item (bipartite graph): Graph Neural Network (PinSage, LightGCN) dan pemanfaatan Knowledge Graph untuk memperkaya konteks rekomendasi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Graph-Based Recommendation dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# lightgcn_message_passing.py
import numpy as np

# LightGCN menyederhanakan GCN tanpa non-linear activation atau feature transformation
# E^(l+1) = (D^-1/2 * A * D^-1/2) * E^(l)
adj_normalized = np.array([
    [0.0, 0.5, 0.5],
    [0.5, 0.0, 0.5],
    [0.5, 0.5, 0.0]
])
initial_embeddings = np.array([[1.0, 0.0], [0.0, 1.0], [0.5, 0.5]])

layer_1_emb = adj_normalized @ initial_embeddings
final_emb = 0.5 * initial_embeddings + 0.5 * layer_1_emb

print("Representasi Embedding LightGCN Layer 1:\n", np.round(layer_1_emb, 3))
print("Final Combined Representation:\n", np.round(final_emb, 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Graph-Based Recommendation** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    7,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: LLM & Generative Recommendation',
    'bab-8-llm-generative-recommendation',
    '# BAB 8: LLM & Generative Recommendation

Paradigma Generative Recommender: Large Language Model sebagai recommender zero-shot/few-shot, Conversational Recommendation agent, dan prompt-based reasoning untuk rekomendasi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: LLM & Generative Recommendation dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# llm_recommender_prompt.py
def build_recsys_prompt(user_history, candidates):
    return f"""### SYSTEM: Anda adalah asisten kurasi rekomendasi belanja personal.
### RIWAYAT PENGGUNA: {'', ''.join(user_history)}
### DAFTAR KANDIDAT: {'', ''.join(candidates)}
### TUGAS: Pilih 2 produk terbaik beserta alasan singkat mengapa pengguna akan menyukainya!
### REKOMENDASI:"""

prompt = build_recsys_prompt(
    ["Mechanical Keyboard", "Ergonomic Mouse", "Monitor Arm"],
    ["Wrist Rest", "Desk Mat", "Coffee Mug", "Gaming Chair"]
)
print("[Contoh Prompt LLM-as-a-Recommender]:\n" + prompt)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: LLM & Generative Recommendation** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    8,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Evaluasi Sistem Rekomendasi',
    'bab-9-evaluasi-sistem-rekomendasi',
    '# BAB 9: Evaluasi Sistem Rekomendasi

Metrik offline akurasi ranking (Precision@K, Recall@K, NDCG@K, Mean Average Precision MAP), metrik non-akurasi (Diversity, Novelty, Coverage), dan pengujian online A/B testing.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Evaluasi Sistem Rekomendasi dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# ndcg_evaluation_metric.py
import numpy as np

def compute_ndcg_at_k(relevance_scores, k=3):
    relevance = np.array(relevance_scores[:k])
    dcg = np.sum(relevance / np.log2(np.arange(2, len(relevance) + 2)))
    
    ideal_relevance = np.sort(relevance)[::-1]
    idcg = np.sum(ideal_relevance / np.log2(np.arange(2, len(ideal_relevance) + 2)))
    
    return dcg / idcg if idcg > 0 else 0.0

# Skor relevansi item rekomendasi (1: Relevan, 0: Tidak)
rec_relevance = [1, 0, 1, 1, 0]
ndcg_3 = compute_ndcg_at_k(rec_relevance, k=3)
print(f"NDCG@3 Score: {ndcg_3:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Evaluasi Sistem Rekomendasi** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
    9,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Context-Aware & RL Recommendation',
    'bab-10-context-aware-rl-recommendation',
    '# BAB 10: Context-Aware & RL Recommendation

Rekomendasi peka konteks (waktu, cuaca, lokasi, perangkat), Multi-Armed Bandit (Upper Confidence Bound, Thompson Sampling) untuk eksplorasi vs eksploitasi, dan Reinforcement Learning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Context-Aware & RL Recommendation dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# thompson_sampling_recsys.py
import numpy as np

# Multi-Armed Bandit (Thompson Sampling) untuk memilih banner rekomendasi terbaik
successes = np.array([12, 8, 25])  # Jumlah konversi/klik per banner
failures = np.array([88, 92, 75])  # Jumlah tayang tanpa klik

# Sample dari distribusi Beta(alpha, beta)
sampled_probs = np.random.beta(successes + 1, failures + 1)
chosen_banner = np.argmax(sampled_probs)

print(f"Peluang Estimat Thompson Sampling: {np.round(sampled_probs, 4)}")
print(f"Banner Terpilih untuk Pengguna: Banner #{chosen_banner + 1}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Context-Aware & RL Recommendation** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    10,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Explainability & Fairness',
    'bab-11-explainability-fairness',
    '# BAB 11: Explainability & Fairness

Sistem rekomendasi yang dapat dijelaskan (Explainable AI: "Karena Anda membeli X..."), mitigasi bias popularitas (Popularity Bias), keadilan algoritma (Fairness across providers/users), dan transparansi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Explainability & Fairness dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# item_explanation_generator.py
def generate_explanation(recommended_item, trigger_item, similarity_feature):
    return (
        f"Kami merekomendasikan ''{recommended_item}'' karena Anda baru saja membeli "
        f"''{trigger_item}'' yang memiliki kesamaan dalam kategori {similarity_feature}."
    )

print("[Explainable Recommendation Message]:")
print(generate_explanation("Kabel HDMI 2.1", "Monitor Gaming 144Hz", "Aksesoris Tampilan"))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Explainability & Fairness** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'ShieldCheck',
    11,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Skalabilitas & Deployment',
    'bab-12-skalabilitas-deployment',
    '# BAB 12: Skalabilitas & Deployment

Infrastruktur industri: arsitektur multi-tahap (Retrieval 10k items -> Heavy Scoring/Ranking 100 items -> Re-ranking & Business Rules), real-time serving low latency, dan Feature Store.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Skalabilitas & Deployment dalam domain Recommendation System.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# recsys_multistage_pipeline.py
stages = [
    ("Stage 1: Retrieval / Candidate Generation", "Menyaring 1,000,000 produk menjadi 500 kandidat via ANN Two-Tower"),
    ("Stage 2: Scoring & Ranking", "Menghitung probabilitas CTR/CVR menggunakan Deep Model pada 500 kandidat"),
    ("Stage 3: Re-ranking & Diversity", "Menerapkan aturan bisnis, deduping, novelty boost, dan kuota sponsor")
]

print("=== ARSITEKTUR PIPELINE REKOMENDASI SKALA BESAR ===")
for stage, desc in stages:
    print(f"{stage}:\n  -> {desc}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Skalabilitas & Deployment** merupakan pilar fundamental dalam spesialisasi Recommendation System.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Server',
    12,
    v_cat_recsys,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 3: NATURAL LANGUAGE PROCESSING (14 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Dasar Pemrosesan Bahasa Alami',
    'bab-1-dasar-pemrosesan-bahasa-alami',
    '# BAB 1: Dasar Pemrosesan Bahasa Alami

Definisi & ruang lingkup NLP, tantangan inheren bahasa manusia (ambiguitas leksikal/sintaksis, ketergantungan konteks, pragmatik), dan tingkatan analisis linguistik.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Dasar Pemrosesan Bahasa Alami dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# ambiguity_detection_demo.py
# Contoh fenomena ambiguitas sintaktis dalam bahasa alami
kalimat_ambigu = "Ilmuwan melihat bintang dengan teleskop."
interpretasi_1 = "Ilmuwan menggunakan teleskop sebagai instrumen untuk melihat bintang."
interpretasi_2 = "Ilmuwan melihat bintang yang sedang membawa teleskop (makna harfiah tidak wajar)."

print("Tantangan Ambiguitas NLP:\nKalimat:", kalimat_ambigu)
print("Interpretasi Utama (Pragmatik):", interpretasi_1)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Dasar Pemrosesan Bahasa Alami** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    1,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Text Preprocessing',
    'bab-2-text-preprocessing',
    '# BAB 2: Text Preprocessing

Tokenization, Stemming & Lemmatization, Stopword Removal, Part-of-Speech (POS) Tagging, dan algoritma Subword Tokenization mutakhir (Byte-Pair Encoding BPE, WordPiece, SentencePiece).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Text Preprocessing dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# bpe_subword_tokenization.py
def mock_bpe_tokenize(word, vocab_merges):
    tokens = list(word) + ["</w>"]
    for pair in vocab_merges:
        bigram = "".join(pair)
        i = 0
        new_tokens = []
        while i < len(tokens):
            if i < len(tokens) - 1 and tokens[i] == pair[0] and tokens[i+1] == pair[1]:
                new_tokens.append(bigram)
                i += 2
            else:
                new_tokens.append(tokens[i])
                i += 1
        tokens = new_tokens
    return tokens

merges = [("e", "r"), ("er", "k")]
print("Hasil BPE Tokenizer kata ''rekursif'':", mock_bpe_tokenize("rekursif", merges))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Text Preprocessing** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    2,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Representasi Teks',
    'bab-3-representasi-teks',
    '# BAB 3: Representasi Teks

Vektorisasi teks: Bag of Words (BoW) & TF-IDF, Static Word Embeddings (Word2Vec CBOW/Skip-gram, GloVe, FastText), dan Contextual Embedding dinamis (ELMo).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Representasi Teks dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# tfidf_custom_vectorizer.py
import numpy as np

docs = ["data science menyenangkan", "machine learning dan data science"]
terms = ["data", "learning", "machine", "menyenangkan", "science"]

# Perhitungan manual matriks Term Frequency (TF)
tf_matrix = np.array([
    [1/3, 0, 0, 1/3, 1/3],
    [1/5, 1/5, 1/5, 0, 1/5]
])
# Inverse Document Frequency (IDF)
idf = np.log((1 + 2) / (1 + np.array([2, 1, 1, 1, 2]))) + 1
tfidf = tf_matrix * idf

print("Matriks TF-IDF Dokumen:\n", np.round(tfidf, 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Representasi Teks** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    3,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Model Sekuensial untuk NLP',
    'bab-4-model-sekuensial-untuk-nlp',
    '# BAB 4: Model Sekuensial untuk NLP

Pemodelan data sekuens berurutan: Recurrent Neural Network (RNN vanilla, vanishing gradient), Long Short-Term Memory (LSTM cell gates), GRU, dan arsitektur Sequence-to-Sequence (Seq2Seq).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Model Sekuensial untuk NLP dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# lstm_cell_equations.py
import numpy as np

def sigmoid(x): return 1 / (1 + np.exp(-x))

def lstm_step(x_t, h_prev, c_prev, W_f, W_i, W_o, W_c):
    # Gabungan x_t dan hidden state sebelumnya
    concat = np.concatenate([x_t, h_prev])
    f_t = sigmoid(np.dot(W_f, concat))  # Forget gate
    i_t = sigmoid(np.dot(W_i, concat))  # Input gate
    c_tilde = np.tanh(np.dot(W_c, concat))
    c_t = f_t * c_prev + i_t * c_tilde  # Cell state update
    o_t = sigmoid(np.dot(W_o, concat))  # Output gate
    h_t = o_t * np.tanh(c_t)            # Hidden state
    return h_t, c_t

print("Formula LSTM Cell Gate berhasil didefinisikan untuk forward pass sekuens.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Model Sekuensial untuk NLP** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    4,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Transformer & Model Bahasa',
    'bab-5-transformer-model-bahasa',
    '# BAB 5: Transformer & Model Bahasa

Mekanisme Scaled Dot-Product Attention, arsitektur Multi-Head Transformer, Encoder-only models (BERT, RoBERTa), dan Decoder-only autoregressive models (GPT family).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Transformer & Model Bahasa dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# transformer_attention_head.py
import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.swapaxes(-2, -1)) / np.sqrt(d_k)
    if mask is not None:
        scores = np.where(mask == 0, -1e9, scores)
    weights = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = weights / np.sum(weights, axis=-1, keepdims=True)
    return np.matmul(weights, V)

tokens = np.random.randn(1, 4, 32) # Batch 1, Seq 4, Dim 32
attn_out = scaled_dot_product_attention(tokens, tokens, tokens)
print("Output Transformer Self-Attention Head:", attn_out.shape)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Transformer & Model Bahasa** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Layers',
    5,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Sintaksis & Parsing',
    'bab-6-sintaksis-parsing',
    '# BAB 6: Sintaksis & Parsing

Analisis struktur gramatikal kalimat: Syntactic Parsing, Dependency Parsing (head-dependent relations), dan Constituency Parsing (Phrase Structure Grammar).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Sintaksis & Parsing dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# dependency_parse_tree.py
# Contoh relasi ketergantungan sintaktis (Dependency Tuple: Head -> Relasi -> Dependent)
dep_relations = [
    ("makan", "nsubj", "Budi"),       # Subjek nominal
    ("makan", "dobj", "nasi goreng"), # Objek langsung
    ("makan", "advmod", "lahap")      # Adverbial modifier
]

print("Relasi Dependency Parsing Kalimat:")
for head, rel, dep in dep_relations:
    print(f"[{head}] ---({rel})---> [{dep}]")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Sintaksis & Parsing** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    6,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Information Extraction',
    'bab-7-information-extraction',
    '# BAB 7: Information Extraction

Ekstraksi informasi terstruktur dari korpus bebas: Named Entity Recognition (NER), Relation Extraction, Event Extraction, dan Coreference Resolution (resolusi kata ganti).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Information Extraction dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# ner_iob_tagging.py
tokens = ["Presiden", "Jokowi", "berkunjung", "ke", "IKN", "Nusantara"]
iob_tags = ["B-PER", "I-PER", "O", "O", "B-LOC", "I-LOC"]

print("Anotasi Named Entity Recognition (Format IOB2):")
for tok, tag in zip(tokens, iob_tags):
    print(f"{tok:12} -> {tag}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Information Extraction** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    7,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Pemahaman & Generasi Bahasa',
    'bab-8-pemahaman-generasi-bahasa',
    '# BAB 8: Pemahaman & Generasi Bahasa

Tugas-tugas inti NLP praktis: Neural Machine Translation (NMT), Text Summarization (abstraktif vs ekstraktif), Question Answering (QA), serta Sentiment Analysis & Emotion Detection.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Pemahaman & Generasi Bahasa dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# text_summarization_metrics.py
def mock_extractive_summary(text_paragraphs, top_n=2):
    sentences = text_paragraphs.split(". ")
    # Ranking kalimat sederhana berdasarkan panjang dan posisi awal
    scored = sorted(sentences, key=lambda s: len(s), reverse=True)
    return ". ".join(scored[:top_n]) + "."

corpus = "Velqora adalah platform belajar kecerdasan buatan terpadu. Materi mencakup puluhan topik mutakhir dari dasar hingga tingkat lanjut. Setiap topik dilengkapi kode praktikum Python."
print("[Ringkasan Ekstraktif]:\n" + mock_extractive_summary(corpus, top_n=2))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Pemahaman & Generasi Bahasa** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    8,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Dialogue & Conversational AI',
    'bab-9-dialogue-conversational-ai',
    '# BAB 9: Dialogue & Conversational AI

Arsitektur sistem percakapan: Task-Oriented Dialogue Systems (NLU, DST - Dialogue State Tracking, Policy Manager, NLG), dan Open-Domain Neural Chatbots.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Dialogue & Conversational AI dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# dialogue_state_tracker.py
class DialogueStateTracker:
    def __init__(self):
        self.slots = {"asal": None, "tujuan": None, "tanggal": None}

    def update_state(self, user_intent, extracted_entities):
        for k, v in extracted_entities.items():
            if k in self.slots:
                self.slots[k] = v

    def is_ready_to_book(self):
        return all(v is not None for v in self.slots.values())

dst = DialogueStateTracker()
dst.update_state("pesan_tiket", {"asal": "Jakarta", "tujuan": "Surabaya"})
print("Slot Terisi Saat Ini:", dst.slots)
print("Siap Eksekusi Pemesanan?", dst.is_ready_to_book())
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Dialogue & Conversational AI** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    9,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Large Language Model dalam NLP',
    'bab-10-large-language-model-dalam-nlp',
    '# BAB 10: Large Language Model dalam NLP

Peran LLM sebagai backbone NLP modern: evolusi dari transfer learning BERT ke paradigma pretraining, instruction fine-tuning, in-context prompt engineering, dan RAG.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Large Language Model dalam NLP dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# nlp_task_via_prompt.py
def perform_nlp_task(task_type, text_input):
    prompt_template = {
        "ner": f"Ekstrak nama orang dan lokasi dari teks: ''{text_input}''",
        "sentiment": f"Klasifikasikan sentimen (Positif/Negatif/Netral): ''{text_input}''",
        "translation": f"Terjemahkan ke bahasa Inggris: ''{text_input}''"
    }
    return f"[Prompt ke LLM]: {prompt_template.get(task_type, '''')}"

print(perform_nlp_task("sentiment", "Aplikasi belajar ini sangat cepat dan menyenangkan!"))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Large Language Model dalam NLP** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    10,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: NLP Multibahasa & Cross-Lingual',
    'bab-11-nlp-multibahasa-cross-lingual',
    '# BAB 11: NLP Multibahasa & Cross-Lingual

Multilingual Language Models (mBERT, XLM-RoBERTa), teknik Cross-Lingual Transfer (zero-shot transfer bahasa lintas sumber), dan strategi pengembangan untuk Low-Resource Languages.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: NLP Multibahasa & Cross-Lingual dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# cross_lingual_embedding.py
import numpy as np

# Simulasi penyelarasan ruang vektor antar bahasa (Shared Multilingual Space)
v_indo_apel = np.array([0.45, 0.88, 0.12])
v_eng_apple = np.array([0.44, 0.89, 0.10])

sim = np.dot(v_indo_apel, v_eng_apple) / (np.linalg.norm(v_indo_apel) * np.linalg.norm(v_eng_apple))
print(f"Cosine Similarity kata ''Apel'' (ID) dan ''Apple'' (EN): {sim:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: NLP Multibahasa & Cross-Lingual** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    11,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Evaluasi NLP',
    'bab-12-evaluasi-nlp',
    '# BAB 12: Evaluasi NLP

Metrik evaluasi generatif dan klasifikasi: BLEU Score, ROUGE (1/2/L), Perplexity (PPL), serta benchmark komprehensif GLUE & SuperGLUE.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Evaluasi NLP dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# rouge_l_evaluator.py
def compute_lcs_length(seq1, seq2):
    m, n = len(seq1), len(seq2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m):
        for j in range(n):
            if seq1[i] == seq2[j]: dp[i+1][j+1] = dp[i][j] + 1
            else: dp[i+1][j+1] = max(dp[i+1][j], dp[i][j+1])
    return dp[m][n]

ref = "model transformer sangat efisien untuk pengolahan teks".split()
hyp = "transformer model sangat efisien dalam pengolahan teks".split()
lcs = compute_lcs_length(ref, hyp)
rouge_l_recall = lcs / len(ref)

print(f"Panjang Longest Common Subsequence (LCS): {lcs}")
print(f"ROUGE-L Recall: {rouge_l_recall * 100:.2f}%")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Evaluasi NLP** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
    12,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Bias, Fairness & Interpretability NLP',
    'bab-13-bias-fairness-interpretability-nlp',
    '# BAB 13: Bias, Fairness & Interpretability NLP

Bias sosial dan gender dalam word embeddings, toxic content moderation, dan interpretabilitas model bahasa menggunakan Attention Visualization & Integrated Gradients.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Bias, Fairness & Interpretability NLP dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# embedding_bias_check.py
import numpy as np

def cosine_distance(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Pemeriksaan bias analogi kata pada representasi vektor
v_doctor = np.array([0.7, 0.2])
v_nurse = np.array([0.6, 0.3])
v_gender_dir = np.array([0.1, 0.9]) # Sumbu gender terindikasi

print("Proyeksi Pekerjaan pada Sumbu Gender:")
print("Dokter:", round(cosine_distance(v_doctor, v_gender_dir), 3))
print("Perawat:", round(cosine_distance(v_nurse, v_gender_dir), 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Bias, Fairness & Interpretability NLP** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    13,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Topik Lanjutan NLP',
    'bab-14-topik-lanjutan-nlp',
    '# BAB 14: Topik Lanjutan NLP

Riset lanjutan: analisis sentimen berbasis aspek (ABSA), Stylometry (atribusi kepenulisan teks), dan Controlled Text Generation dengan Classifier-Guided Decoding.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 14: Topik Lanjutan NLP dalam domain Natural Language Processing.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# absa_aspect_sentiment.py
def extract_aspect_sentiment(review):
    aspects = {}
    if "layanan" in review:
        aspects["Layanan"] = "Positif" if "cepat" in review or "ramah" in review else "Negatif"
    if "harga" in review:
        aspects["Harga"] = "Negatif" if "mahal" in review else "Positif"
    return aspects

rev = "Layanan restoran ini sangat ramah dan cepat, tetapi harga agak mahal."
print("Hasil Aspect-Based Sentiment Analysis (ABSA):")
print(extract_aspect_sentiment(rev))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 14: Topik Lanjutan NLP** merupakan pilar fundamental dalam spesialisasi Natural Language Processing.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    14,
    v_cat_nlp,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 4: REINFORCEMENT LEARNING (13 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Reinforcement Learning',
    'bab-1-konsep-dasar-reinforcement-learning',
    '# BAB 1: Konsep Dasar Reinforcement Learning

Komponen siklus RL (Agent, Environment, State, Action, Reward, Policy), perbedaan mendasar RL dengan Supervised/Unsupervised Learning, dan dilemma eksplorasi-eksploitasi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Reinforcement Learning dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# rl_agent_env_loop.py
class SimpleEnvironment:
    def __init__(self):
        self.state = 0
    def step(self, action):
        self.state += action
        reward = 1.0 if self.state == 3 else -0.1
        done = (self.state >= 3)
        return self.state, reward, done

env = SimpleEnvironment()
for step in range(4):
    next_s, r, done = env.step(action=1)
    print(f"Langkah {step+1}: State = {next_s}, Reward = {r}, Selesai = {done}")
    if done: break
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Reinforcement Learning** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Compass',
    1,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Markov Decision Process (MDP)',
    'bab-2-markov-decision-process-mdp',
    '# BAB 2: Markov Decision Process (MDP)

Formulasi matematis MDP (State space S, Action space A, Transition probability P, Reward function R, Discount factor gamma), Policy & Value Function, serta Persamaan Bellman.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Markov Decision Process (MDP) dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# bellman_expectation_equation.py
import numpy as np

# Evaluasi Nilai State Bellman: V(s) = sum_a pi(a|s) * [R(s,a) + gamma * sum_s'' P(s''|s,a) V(s'')]
V = np.zeros(3) # 3 States
gamma = 0.9
rewards = np.array([0.0, 1.0, 10.0])

for iteration in range(10):
    V_new = np.copy(V)
    for s in range(2): # state 2 adalah terminal
        V_new[s] = rewards[s] + gamma * V[s+1]
    V = V_new

print("Value Function V(s) hasil iterasi Bellman:", np.round(V, 2))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Markov Decision Process (MDP)** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Compass',
    2,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Dynamic Programming',
    'bab-3-dynamic-programming',
    '# BAB 3: Dynamic Programming

Penyelesaian MDP berpengetahuan sempurna: Policy Evaluation, Policy Iteration (perbaikan kebijakan berulang), dan Value Iteration (optimasi nilai maksimum Bellman).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Dynamic Programming dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# value_iteration_algorithm.py
import numpy as np

# Value Iteration pada 4-state linear chain
V = np.zeros(4)
gamma = 0.95
R = np.array([-1, -1, -1, 10]) # Goal state di index 3

for it in range(20):
    for s in range(3):
        # Aksi Kanan mengantar ke s+1
        V[s] = R[s] + gamma * V[s+1]

print("State Values terkonvergensi:", np.round(V, 2))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Dynamic Programming** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    3,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Model-Free Prediction & Control',
    'bab-4-model-free-prediction-control',
    '# BAB 4: Model-Free Prediction & Control

Pembelajaran tanpa model transisi: Monte Carlo Methods (evaluasi berbasis episode lengkap), Temporal Difference Learning (TD(0)), Q-Learning (Off-Policy), dan SARSA (On-Policy).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Model-Free Prediction & Control dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# qlearning_vs_sarsa.py
import numpy as np

# Pembaruan Q-Learning (Off-policy TD Control)
# Q(s, a) = Q(s, a) + alpha * [R + gamma * max_a'' Q(s'', a'') - Q(s, a)]
Q = np.zeros((2, 2))
s, a, r, s_next = 0, 1, 5.0, 1
alpha, gamma = 0.1, 0.9

target = r + gamma * np.max(Q[s_next])
Q[s, a] += alpha * (target - Q[s, a])

print("Tabel Q-Learning setelah satu update:\n", Q)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Model-Free Prediction & Control** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    4,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Deep Reinforcement Learning',
    'bab-5-deep-reinforcement-learning',
    '# BAB 5: Deep Reinforcement Learning

Deep Q-Network (DQN: estimasi fungsi nilai dengan neural network), Double DQN (mengatasi overestimasi nilai Q), Dueling DQN (memisahkan Value & Advantage), dan Experience Replay Buffer.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Deep Reinforcement Learning dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# replay_buffer_dqn.py
import random
from collections import deque

class ReplayBuffer:
    def __init__(self, capacity=1000):
        self.buffer = deque(maxlen=capacity)
    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))
    def sample(self, batch_size):
        return random.sample(self.buffer, batch_size)

buf = ReplayBuffer(100)
buf.push([0.5, 0.2], 1, 1.0, [0.6, 0.3], False)
batch = buf.sample(1)
print("Sampel Mini-batch dari Replay Buffer:", batch[0])
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Deep Reinforcement Learning** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Compass',
    5,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Policy Gradient Methods',
    'bab-6-policy-gradient-methods',
    '# BAB 6: Policy Gradient Methods

Optimasi kebijakan langsung: Teorema Policy Gradient, REINFORCE Algorithm (Monte Carlo Policy Gradient), metode Actor-Critic, dan Advantage Actor-Critic (A2C/A3C).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Policy Gradient Methods dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# reinforce_loss_calculation.py
import numpy as np

# Perhitungan gradien REINFORCE: grad = -log_prob * Discounted_Return
log_prob_action = -0.693 # log(0.5)
discounted_return = 8.5   # G_t

policy_loss = -log_prob_action * discounted_return
print(f"Policy Gradient Loss (REINFORCE): {policy_loss:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Policy Gradient Methods** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sliders',
    6,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Metode RL Lanjutan',
    'bab-7-metode-rl-lanjutan',
    '# BAB 7: Metode RL Lanjutan

Algoritma state-of-the-art continuous control: Proximal Policy Optimization (PPO clipped objective), Trust Region Policy Optimization (TRPO), dan Soft Actor-Critic (SAC maximum entropy).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Metode RL Lanjutan dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# ppo_clipped_objective.py
import numpy as np

def ppo_clipped_loss(prob_ratio, advantage, epsilon=0.2):
    surr1 = prob_ratio * advantage
    surr2 = np.clip(prob_ratio, 1.0 - epsilon, 1.0 + epsilon) * advantage
    return -np.minimum(surr1, surr2)

ratio = 1.3 # Kebijakan baru menghasilkan probabilitas lebih tinggi
adv = 2.0   # Advantage positif
loss = ppo_clipped_loss(ratio, adv)

print(f"PPO Clipped Objective Loss: {loss:.4f} (Dibatasi oleh batas epsilon clip)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Metode RL Lanjutan** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    7,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Model-Based Reinforcement Learning',
    'bab-8-model-based-reinforcement-learning',
    '# BAB 8: Model-Based Reinforcement Learning

Konsep Model-Based RL: mempelajari model dinamika lingkungan (World Models), simulasi perencanaan imajinasi masa depan (Dyna-Q, MuZero), dan efisiensi sampel data.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Model-Based Reinforcement Learning dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# world_model_transition.py
class WorldModel:
    def __init__(self):
        # Model dinamika mempelajari transisi f(s, a) -> s''
        pass
    def predict_next_state_and_reward(self, current_state, action):
        next_state = current_state + (0.5 * action)
        reward = 1.0 if next_state > 2.0 else 0.0
        return next_state, reward

wm = WorldModel()
pred_s, pred_r = wm.predict_next_state_and_reward(1.0, action=2)
print(f"Prediksi State Masa Depan oleh World Model: {pred_s}, Reward: {pred_r}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Model-Based Reinforcement Learning** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Compass',
    8,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Offline Reinforcement Learning',
    'bab-9-offline-reinforcement-learning',
    '# BAB 9: Offline Reinforcement Learning

Pelatihan agen RL dari dataset historis statis tanpa interaksi aktif dengan lingkungan: tantangan Out-of-Distribution Actions dan Distributional Shift (Conservative Q-Learning CQL).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Offline Reinforcement Learning dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# offline_cql_penalty.py
import numpy as np

# Conservative Q-Learning (CQL) menambahkan penalti regularisasi untuk aksi OOD
q_values = np.array([2.5, 4.8, 1.2]) # Prediksi nilai Q tiap aksi
ood_penalty_alpha = 0.5
cql_loss_regularizer = ood_penalty_alpha * (np.log(np.sum(np.exp(q_values))) - q_values[0])

print(f"Penalti Regularisasi CQL untuk mencegah overestimasi offline: {cql_loss_regularizer:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Offline Reinforcement Learning** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Compass',
    9,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Multi-Agent Reinforcement Learning',
    'bab-10-multi-agent-reinforcement-learning',
    '# BAB 10: Multi-Agent Reinforcement Learning

MARL: kooperasi, kompetisi, dan koordinasi antar agen mandiri (Cooperative vs Competitive), Game Theory dalam RL (Nash Equilibrium), dan arsitektur MAPPO.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Multi-Agent Reinforcement Learning dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# multi_agent_payoff_matrix.py
# Payoff Matrix Dilema Tahanan (Prisoner''s Dilemma)
# (Reward Agen 1, Reward Agen 2)
payoff = {
    ("Kerjasama", "Kerjasama"): (3, 3),
    ("Kerjasama", "Khianat"): (0, 5),
    ("Khianat", "Kerjasama"): (5, 0),
    ("Khianat", "Khianat"): (1, 1)
}

print("Nash Equilibrium MARL (Keduanya Berkhianat):", payoff[("Khianat", "Khianat")])
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Multi-Agent Reinforcement Learning** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Compass',
    10,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: RL untuk Model Bahasa',
    'bab-11-rl-untuk-model-bahasa',
    '# BAB 11: RL untuk Model Bahasa

Reinforcement Learning from Human Feedback (RLHF): pelatihan Reward Model dari preferensi manusia, optimasi kebijakan LLM via PPO dengan KL-divergence penalty, dan RLAIF.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: RL untuk Model Bahasa dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# rlhf_kl_penalty.py
import numpy as np

def calculate_rlhf_reward(raw_reward, logprob_active, logprob_ref, beta=0.1):
    # Penalti KL Divergence agar LLM tidak menyimpang dari model referensi
    kl_divergence = logprob_active - logprob_ref
    penalized_reward = raw_reward - (beta * kl_divergence)
    return penalized_reward

pen_r = calculate_rlhf_reward(raw_reward=2.5, logprob_active=-1.2, logprob_ref=-1.8, beta=0.2)
print(f"Reward Akhir Terpenalti KL (RLHF): {pen_r:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: RL untuk Model Bahasa** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    11,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Exploration Strategies dalam RL',
    'bab-12-exploration-strategies-dalam-rl',
    '# BAB 12: Exploration Strategies dalam RL

Strategi eksplorasi tingkat lanjut: Epsilon-Greedy, Upper Confidence Bound (UCB), Thompson Sampling, Intrinsic Motivation, dan Curiosity-Driven Exploration (ICM).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Exploration Strategies dalam RL dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# curiosity_driven_intrinsic_reward.py
import numpy as np

def compute_intrinsic_reward(actual_next_state, predicted_next_state, eta=0.01):
    # Curiosity-driven reward berbasis prediksi error lingkungan
    prediction_error = np.mean((actual_next_state - predicted_next_state)**2)
    intrinsic_reward = (eta / 2.0) * prediction_error
    return intrinsic_reward

s_actual = np.array([1.2, 0.5])
s_pred = np.array([0.8, 0.4])
r_intrinsic = compute_intrinsic_reward(s_actual, s_pred)
print(f"Bonus Reward Rasa Ingin Tahu (Intrinsic Reward): {r_intrinsic:.6f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Exploration Strategies dalam RL** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    12,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Aplikasi Reinforcement Learning',
    'bab-13-aplikasi-reinforcement-learning',
    '# BAB 13: Aplikasi Reinforcement Learning

Implementasi RL industri: Game AI otonom (AlphaGo, Dota 2 OpenAI Five), kontrol robotika adaptif, pendinginan pusat data dan optimasi alokasi daya energi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Aplikasi Reinforcement Learning dalam domain Reinforcement Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# datacenter_cooling_rl.py
class DatacenterEnergyManager:
    def __init__(self):
        self.server_temp = 32.0 # Derajat Celcius
    def step(self, chiller_power_action):
        self.server_temp -= (chiller_power_action * 0.8)
        energy_cost = chiller_power_action * 1.5
        temp_penalty = 10.0 if self.server_temp > 35.0 else 0.0
        reward = -(energy_cost + temp_penalty)
        return self.server_temp, reward

manager = DatacenterEnergyManager()
temp, reward = manager.step(chiller_power_action=2)
print(f"Suhu Server Pasca Aksi RL: {temp:.1f}C, Reward Efisiensi Energi: {reward:.2f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Aplikasi Reinforcement Learning** merupakan pilar fundamental dalam spesialisasi Reinforcement Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Compass',
    13,
    v_cat_rl,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 5: ROBOTICS & EMBODIED AI (13 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Robotika',
    'bab-1-konsep-dasar-robotika',
    '# BAB 1: Konsep Dasar Robotika

Komponen sistem robotik (Actuators, Sensors, Controllers, End-Effectors), jenis robot (Manipulator Arms, Mobile AMR/AGV, Humanoid, Quadruped), dan ruang lingkup Embodied AI.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Robotika dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# robot_component_hierarchy.py
robot_spec = {
    "name": "Velqora Mobile Manipulator",
    "dof": 6, # Degrees of Freedom
    "actuators": ["Brushless DC Motor", "Harmonic Drive Gearbox"],
    "sensors": ["LiDAR 2D", "RGB-D Camera Intel RealSense", "6-Axis IMU"],
    "payload_kg": 5.0
}

print(f"Spesifikasi Robot: {robot_spec[''name'']}")
print(f"Derajat Kebebasan (DoF): {robot_spec[''dof'']}")
print(f"Sensor Terpasang: {'', ''.join(robot_spec[''sensors''])}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Robotika** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    1,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Kinematika & Dinamika Robot',
    'bab-2-kinematika-dinamika-robot',
    '# BAB 2: Kinematika & Dinamika Robot

Kinematika Maju (Forward Kinematics dengan parameter Denavit-Hartenberg DH), Kinematika Mundur (Inverse Kinematics IK), Matriks Jacobian, dan Dinamika Gerak Newton-Euler/Lagrangian.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Kinematika & Dinamika Robot dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# forward_kinematics_2link.py
import numpy as np

def forward_kinematics_2d(l1, l2, theta1_deg, theta2_deg):
    t1 = np.radians(theta1_deg)
    t2 = np.radians(theta2_deg)
    x = l1 * np.cos(t1) + l2 * np.cos(t1 + t2)
    y = l1 * np.sin(t1) + l2 * np.sin(t1 + t2)
    return x, y

# Panjang link robot (cm) dan sudut sendi (derajat)
ee_x, ee_y = forward_kinematics_2d(l1=20, l2=15, theta1_deg=45, theta2_deg=30)
print(f"Posisi Ujung Robot (End-Effector): X = {ee_x:.2f} cm, Y = {ee_y:.2f} cm")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Kinematika & Dinamika Robot** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    2,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Persepsi Robot',
    'bab-3-persepsi-robot',
    '# BAB 3: Persepsi Robot

Sensor lingkungan robotik (LiDAR Point Cloud, RGB-D Stereo Camera, IMU), computer vision untuk deteksi pose objek (6D Pose Estimation), dan Sensor Fusion (Extended Kalman Filter EKF).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Persepsi Robot dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# pointcloud_downsampling_voxel.py
import numpy as np

# Simulasi penyaringan point cloud LiDAR dengan Voxel Grid Filter
raw_points = np.random.randn(1000, 3) # 1000 titik koordinat 3D (X, Y, Z)
voxel_size = 0.5
voxel_indices = np.floor(raw_points / voxel_size).astype(int)
unique_voxels = np.unique(voxel_indices, axis=0)

print(f"Jumlah Titik Point Cloud Awal: {len(raw_points)}")
print(f"Jumlah Titik setelah Voxel Grid Filter: {len(unique_voxels)}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Persepsi Robot** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    3,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Lokalisasi & Pemetaan',
    'bab-4-lokalisasi-pemetaan',
    '# BAB 4: Lokalisasi & Pemetaan

Simultaneous Localization and Mapping (SLAM: Visual SLAM, LiDAR SLAM), Occupancy Grid Mapping, dan algoritma Path Planning navigasi otonom (A*, Dijkstra, RRT/RRT*).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Lokalisasi & Pemetaan dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# astar_grid_path_planning.py
import heapq

def astar_grid(start, goal):
    # Path planning grid 2D sederhana
    queue = [(0, start, [start])]
    visited = set()
    while queue:
        cost, curr, path = heapq.heappop(queue)
        if curr == goal: return path
        if curr in visited: continue
        visited.add(curr)
        x, y = curr
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            nxt = (x + dx, y + dy)
            if 0 <= nxt[0] <= 5 and 0 <= nxt[1] <= 5 and nxt not in visited:
                heuristic = abs(nxt[0] - goal[0]) + abs(nxt[1] - goal[1])
                heapq.heappush(queue, (cost + 1 + heuristic, nxt, path + [nxt]))
    return []

path = astar_grid((0, 0), (3, 3))
print("Jalur Navigasi A* untuk Robot:", path)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Lokalisasi & Pemetaan** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    4,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Kontrol Robot',
    'bab-5-kontrol-robot',
    '# BAB 5: Kontrol Robot

Sistem kontrol gerak aktuator: Proportional-Integral-Derivative (PID Controller) untuk kontrol posisi/kecepatan sendi, Model Predictive Control (MPC), dan Impedance/Admittance Control.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Kontrol Robot dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# pid_motor_controller.py
class PIDController:
    def __init__(self, kp=1.2, ki=0.05, kd=0.1):
        self.kp, self.ki, self.kd = kp, ki, kd
        self.prev_error = 0.0
        self.integral = 0.0

    def compute(self, target, current, dt=0.1):
        error = target - current
        self.integral += error * dt
        derivative = (error - self.prev_error) / dt
        self.prev_error = error
        return (self.kp * error) + (self.ki * self.integral) + (self.kd * derivative)

pid = PIDController()
u = pid.compute(target=90.0, current=30.0)
print(f"Sinyal Kontrol Motor PWM (Target 90 Derajat): {u:.2f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Kontrol Robot** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    5,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Reinforcement Learning untuk Robotika',
    'bab-6-reinforcement-learning-untuk-robotika',
    '# BAB 6: Reinforcement Learning untuk Robotika

Robot Learning from Demonstration (LfD / Behavioral Cloning), Reward Shaping untuk manuver kompleks, dan penguatan kebijakan kontrol motor kontinu menggunakan SAC/PPO.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Reinforcement Learning untuk Robotika dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# reward_shaping_robot_reach.py
import numpy as np

def compute_robot_reaching_reward(ee_pos, target_pos, prev_dist, action_effort):
    curr_dist = np.linalg.norm(ee_pos - target_pos)
    progress_reward = (prev_dist - curr_dist) * 10.0 # Reward bergerak mendekati target
    effort_penalty = 0.01 * np.sum(action_effort**2)
    success_bonus = 50.0 if curr_dist < 0.02 else 0.0
    return progress_reward - effort_penalty + success_bonus

r = compute_robot_reaching_reward(np.array([0.1, 0.2]), np.array([0.1, 0.25]), 0.1, np.array([0.5, 0.5]))
print(f"Reward Shaping Reaching Task: {r:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Reinforcement Learning untuk Robotika** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    6,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Foundation Model untuk Robotika',
    'bab-7-foundation-model-untuk-robotika',
    '# BAB 7: Foundation Model untuk Robotika

Vision-Language-Action (VLA) models (RT-1, RT-2, OpenVLA, Octo), model generalis untuk manipulasi robotik otonom berbasis bahasa manusia dan persepsi visual kamera.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Foundation Model untuk Robotika dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vla_action_token_decoder.py
def decode_vla_action_tokens(action_tokens):
    # VLA memetakan token diskrit ke aksi fisik end-effector (x, y, z, roll, pitch, yaw, gripper)
    action_vector = {
        "delta_x": (action_tokens[0] - 128) / 100.0,
        "delta_y": (action_tokens[1] - 128) / 100.0,
        "delta_z": (action_tokens[2] - 128) / 100.0,
        "gripper_close": action_tokens[3] > 128
    }
    return action_vector

tokens = [135, 120, 110, 200]
print("Aksi Fisik Robot dari Output VLA Token:", decode_vla_action_tokens(tokens))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Foundation Model untuk Robotika** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    7,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Embodied AI & Simulasi',
    'bab-8-embodied-ai-simulasi',
    '# BAB 8: Embodied AI & Simulasi

Filosofi Embodied Cognition (kecerdasan melalui interaksi fisik tubuh agen dengan lingkungan), dan lingkungan simulasi fisika robotik (Isaac Sim, MuJoCo, Gazebo, PyBullet).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Embodied AI & Simulasi dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# mujoco_simulation_step.py
# Simulasi loop fisika robotik
sim_time = 0.0
dt = 0.002 # 500 Hz Physics Step

for step in range(5):
    sim_time += dt
    # physics_engine.step()
    print(f"Simulasi Waktu Fisika t = {sim_time:.3f}s (Kontrol Gravitasi & Kontak Aktif)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Embodied AI & Simulasi** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    8,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Sim-to-Real Transfer',
    'bab-9-sim-to-real-transfer',
    '# BAB 9: Sim-to-Real Transfer

Mengatasi Reality Gap (perbedaan gesekan, latensi, dan pencahayaan dunia nyata): Domain Randomization (fisika, visual), Domain Adaptation, dan kalibrasi sistemik.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Sim-to-Real Transfer dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# domain_randomization.py
import numpy as np

def sample_randomized_physics():
    return {
        "friction_coefficient": np.random.uniform(0.4, 1.2),
        "link_mass_scale": np.random.uniform(0.9, 1.1),
        "actuator_delay_ms": np.random.uniform(5.0, 25.0)
    }

print("Parameter Fisika Acak untuk Sim-to-Real:")
print(sample_randomized_physics())
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Sim-to-Real Transfer** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    9,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Human-Robot Interaction',
    'bab-10-human-robot-interaction',
    '# BAB 10: Human-Robot Interaction

Interaksi Alami Manusia-Robot (HRI): pengenalan gestur tangan, antarmuka suara, shared autonomy (kendali kolaboratif), dan kepatuhan standar keselamatan ISO 10218/TS 15066.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Human-Robot Interaction dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# safety_zone_monitoring.py
def check_human_robot_safety(human_distance_meter):
    if human_distance_meter < 0.5:
        return "EMERGENCY STOP (Jarak kritis < 0.5m)"
    elif human_distance_meter < 1.5:
        return "SLOW DOWN (Mode kolaboratif aman)"
    return "NORMAL SPEED (Jalur bebas aman)"

for dist in [2.0, 1.2, 0.3]:
    print(f"Jarak Manusia {dist}m -> Status: {check_human_robot_safety(dist)}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Human-Robot Interaction** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    10,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Humanoid Robot & Manipulasi Kompleks',
    'bab-11-humanoid-robot-manipulasi-kompleks',
    '# BAB 11: Humanoid Robot & Manipulasi Kompleks

Desain robot humanoid (bipedal locomotion, Zero Moment Point ZMP, Whole-Body Control) dan manipulasi multi-jari tangan robotik (Dexterous Multi-Fingered Hands).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Humanoid Robot & Manipulasi Kompleks dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# zmp_bipedal_balance.py
def check_zmp_stability(zmp_x, zmp_y, support_polygon):
    # Memeriksa apakah Zero Moment Point (ZMP) berada dalam poligon tumpuan kaki
    x_min, x_max, y_min, y_max = support_polygon
    is_stable = (x_min <= zmp_x <= x_max) and (y_min <= zmp_y <= y_max)
    return is_stable

footprint = (-10, 10, -5, 5) # Batas telapak kaki (cm)
print("Stabilitas Keseimbangan Bipedal Humanoid:")
print("Status ZMP (0, 0):", "STABIL" if check_zmp_stability(0, 0, footprint) else "JATUH")
print("Status ZMP (15, 0):", "STABIL" if check_zmp_stability(15, 0, footprint) else "JATUH")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Humanoid Robot & Manipulasi Kompleks** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    11,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Keamanan & Etika Robotika',
    'bab-12-keamanan-etika-robotika',
    '# BAB 12: Keamanan & Etika Robotika

Keselamatan fisik robot kolaboratif (Cobots), fail-safe power and force limiting (PFL), etika penggunaan sistem robotik otonom di ruang publik, dan tanggung jawab hukum.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Keamanan & Etika Robotika dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# force_limiting_monitor.py
def monitor_contact_force(measured_torque_nm, max_safe_threshold=20.0):
    if measured_torque_nm > max_safe_threshold:
        return f"SAFETY TRIGGERED: Torsi {measured_torque_nm} Nm melampaui batas aman! Hentikan aktuator."
    return "Operasi dalam batas daya aman."

print(monitor_contact_force(15.2))
print(monitor_contact_force(26.8))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Keamanan & Etika Robotika** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    12,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Aplikasi Robotika & Embodied AI',
    'bab-13-aplikasi-robotika-embodied-ai',
    '# BAB 13: Aplikasi Robotika & Embodied AI

Implementasi riil robotik: robot manufaktur cerdas industri 4.0, robot logistik gudang pergudangan otonom, robot bedah presisi medis, dan kendaraan otonom level 4/5.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Aplikasi Robotika & Embodied AI dalam domain Robotics & Embodied AI.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# autonomous_warehouse_agv.py
class WarehouseAGV:
    def __init__(self, agv_id):
        self.agv_id = agv_id
        self.battery = 95
        self.status = "IDLE"

    def assign_order(self, shelf_id, station_id):
        self.status = f"MOVING: Mengambil Rak {shelf_id} ke Stasiun {station_id}"
        self.battery -= 5
        return self.status

agv = WarehouseAGV("AGV-04")
print("Status Awal:", agv.status)
print(agv.assign_order(shelf_id="B-12", station_id="PACKING-1"))
print(f"Sisa Baterai: {agv.battery}%")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Aplikasi Robotika & Embodied AI** merupakan pilar fundamental dalam spesialisasi Robotics & Embodied AI.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Bot',
    13,
    v_cat_robo,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

END $$;
