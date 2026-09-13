import { ModuleSection } from "@/types/module-drive";

/**
 * Kurikulum Lengkap: Multimodal AI (10 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getMultimodalAiSections(): ModuleSection[] {
  return [
    {
      id: "multi-sec-1",
      title: "BAB 1: Konsep Dasar Multimodal AI",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi & jenis modalitas (teks, gambar, audio, video, sensor spasial), tantangan alignment temporal/semantik, dan heterogenitas representasi data.",
      codeSnippets: [{
        id: "multi-snip-1",
        language: "python",
        caption: "modality_tensor_shapes.py",
        code: "import numpy as np\n\n# Representasi dimensi tensor berbagai modalitas data AI\nmodalities = {\n    \"Teks\": np.zeros((1, 128)),            # Batch, Token Seq Len\n    \"Gambar\": np.zeros((1, 3, 224, 224)),   # Batch, Channels, Height, Width\n    \"Audio\": np.zeros((1, 1, 16000)),       # Batch, Channels, Audio Samples (1s @ 16kHz)\n    \"Video\": np.zeros((1, 16, 3, 224, 224)) # Batch, Frames, Channels, Height, Width\n}\n\nprint(\"Bentuk Tensor Representasi Modalitas Standar:\")\nfor name, tensor in modalities.items():\n    print(f\"- {name}: {tensor.shape}\")",
      }],
    },
    {
      id: "multi-sec-2",
      title: "BAB 2: Representasi & Fusion Multimodal",
      orderIndex: 2,
      isCompleted: false,
      description: "Strategi penggabungan modalitas: Early Fusion (fitur mentah), Late Fusion (skor keputusan), Joint Embedding Space, dan Cross-Modal Attention.",
      codeSnippets: [{
        id: "multi-snip-2",
        language: "python",
        caption: "cross_modal_attention.py",
        code: "import numpy as np\n\ndef cross_modal_attention(text_queries, image_keys, image_values):\n    # Q berasal dari teks, K & V berasal dari patch citra\n    d_k = text_queries.shape[-1]\n    scores = np.dot(text_queries, image_keys.T) / np.sqrt(d_k)\n    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))\n    attention_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)\n    return np.dot(attention_weights, image_values), attention_weights\n\nQ_text = np.random.randn(2, 64)   # 2 text tokens\nK_img = np.random.randn(16, 64)   # 16 visual patches\nV_img = np.random.randn(16, 64)\n\nfused_tokens, attn = cross_modal_attention(Q_text, K_img, V_img)\nprint(\"Bentuk Hasil Cross-Modal Attention:\", fused_tokens.shape)\nprint(\"Distribusi Perhatian Token Teks Pertama terhadap Visual Patch:\\n\", np.round(attn[0][:4], 3))",
      }],
    },
    {
      id: "multi-sec-3",
      title: "BAB 3: Model Vision-Language",
      orderIndex: 3,
      isCompleted: false,
      description: "Arsitektur Vision-Language: CLIP (Contrastive Language-Image Pretraining), BLIP & BLIP-2 (Q-Former bridge), Visual Question Answering (VQA), dan Image Captioning.",
      codeSnippets: [{
        id: "multi-snip-3",
        language: "python",
        caption: "clip_similarity_metric.py",
        code: "import numpy as np\n\ndef compute_clip_score(image_embed, text_embeds):\n    # Cosine similarity di ruang embedding bersama (Joint Latent Space)\n    img_norm = image_embed / np.linalg.norm(image_embed)\n    txt_norm = text_embeds / np.linalg.norm(text_embeds, axis=1, keepdims=True)\n    return np.dot(txt_norm, img_norm)\n\nimage_vec = np.array([0.9, 0.1, 0.2])\ntext_candidates = np.array([\n    [0.85, 0.15, 0.25], # \"Foto seekor kucing tidur di sofa\"\n    [-0.5, 0.7, 0.4]    # \"Mobil balap melaju di sirkuit\"\n])\n\nscores = compute_clip_score(image_vec, text_candidates)\nprint(\"Skor Kesesuaian CLIP Teks 1 (Kucing):\", round(scores[0], 4))\nprint(\"Skor Kesesuaian CLIP Teks 2 (Mobil):\", round(scores[1], 4))",
      }],
    },
    {
      id: "multi-sec-4",
      title: "BAB 4: Model Text-to-Image & Text-to-Video",
      orderIndex: 4,
      isCompleted: false,
      description: "Generasi visual multimodal: conditioned diffusion models, arsitektur cross-attention DALL-E & Stable Diffusion, dan konsistensi temporal pada Text-to-Video (Sora-style).",
      codeSnippets: [{
        id: "multi-snip-4",
        language: "python",
        caption: "text_conditioned_diffusion_step.py",
        code: "import numpy as np\n\ndef mock_denoising_step(noisy_latents, text_conditioning, timestep=50):\n    # Simulasi estimasi noise terpandu teks (Classifier-Free Guidance)\n    estimated_noise = 0.6 * noisy_latents + 0.4 * text_conditioning\n    cleaned_latents = noisy_latents - (0.02 * estimated_noise)\n    return cleaned_latents\n\nlatents = np.random.randn(4, 4)\ntext_prompt_emb = np.ones((4, 4)) * 0.5\ndenoised = mock_denoising_step(latents, text_prompt_emb)\n\nprint(\"Latent Citra sebelum Denoising:\\n\", np.round(latents[:2], 3))\nprint(\"Latent Citra setelah Denoising Terpandu Teks:\\n\", np.round(denoised[:2], 3))",
      }],
    },
    {
      id: "multi-sec-5",
      title: "BAB 5: Model Audio-Visual",
      orderIndex: 5,
      isCompleted: false,
      description: "Integrasi audio dan visual: Lip Reading (pembacaan bibir otomatis), Audio-Visual Speech Recognition (AVSR) tahan derau, dan Video Captioning tersinkronisasi audio.",
      codeSnippets: [{
        id: "multi-snip-5",
        language: "python",
        caption: "avsr_feature_fusion.py",
        code: "import numpy as np\n\n# Fusion fitur video gerakan bibir + spektrogram audio\nvisual_mouth_features = np.array([0.75, 0.82, 0.90]) # Deteksi bentuk bibir\naudio_spectral_features = np.array([0.70, 0.80, 0.88]) # Spektrum frekuensi suara\n\n# Gated fusion\ngate_weight = 0.6 # Bobot prioritas audio dalam kondisi low-noise\nfused_representation = (gate_weight * audio_spectral_features) + ((1 - gate_weight) * visual_mouth_features)\n\nprint(\"Fitur Visual Bibir:\", visual_mouth_features)\nprint(\"Fitur Audio Akustik:\", audio_spectral_features)\nprint(\"Representasi Audio-Visual Terfusi:\", np.round(fused_representation, 3))",
      }],
    },
    {
      id: "multi-sec-6",
      title: "BAB 6: Large Multimodal Model (LMM)",
      orderIndex: 6,
      isCompleted: false,
      description: "Model Vision-Language Skala Besar (GPT-4V, Claude 3.5, LLaVA), Model Multimodal Native (Gemini-style interleaved token), dan arsitektur Multimodal Transformer.",
      codeSnippets: [{
        id: "multi-snip-6",
        language: "python",
        caption: "llava_projection_bridge.py",
        code: "import numpy as np\n\n# Simulasi modul proyeksi MLP LLaVA: memetakan visual features ke LLM token dimension\nvisual_encoder_dim = 1024\nllm_dim = 4096\n\nW_mlp_proj = np.random.randn(visual_encoder_dim, llm_dim) * 0.02\nclip_visual_tokens = np.random.randn(576, visual_encoder_dim) # 24x24 patches\n\nllm_visual_tokens = clip_visual_tokens @ W_mlp_proj\nprint(\"Visual Tokens dari Vision Transformer (ViT):\", clip_visual_tokens.shape)\nprint(\"Visual Tokens siap di-prepend ke LLM Embedding:\", llm_visual_tokens.shape)",
      }],
    },
    {
      id: "multi-sec-7",
      title: "BAB 7: Model Native Multimodal & Unified",
      orderIndex: 7,
      isCompleted: false,
      description: "Unified Tokenization lintas modalitas (VQ-VAE/SoundStream untuk diskritisasi token audio-visual) dan model yang memproses teks, gambar, suara, dan video dalam satu kamus kosakata terpadu.",
      codeSnippets: [{
        id: "multi-snip-7",
        language: "python",
        caption: "unified_tokenizer_concept.py",
        code: "class UnifiedTokenizer:\n    def __init__(self):\n        self.text_vocab_range = (0, 32000)\n        self.image_codebook_range = (32001, 40192)\n        self.audio_codebook_range = (40193, 44288)\n\n    def decode_token_type(self, token_id):\n        if self.text_vocab_range[0] <= token_id <= self.text_vocab_range[1]:\n            return \"Modalitas: TEKS\"\n        elif self.image_codebook_range[0] <= token_id <= self.image_codebook_range[1]:\n            return \"Modalitas: CITRA (Visual Codebook)\"\n        elif self.audio_codebook_range[0] <= token_id <= self.audio_codebook_range[1]:\n            return \"Modalitas: AUDIO (Acoustic Codebook)\"\n        return \"Unknown\"\n\ntok = UnifiedTokenizer()\nfor tid in [1542, 35000, 42000]:\n    print(f\"Token ID {tid} -> {tok.decode_token_type(tid)}\")",
      }],
    },
    {
      id: "multi-sec-8",
      title: "BAB 8: Multimodal Reasoning",
      orderIndex: 8,
      isCompleted: false,
      description: "Multimodal Chain-of-Thought (CoT), spatial and diagrammatic reasoning, grounding deteksi koordinat kotak pembatas (bounding box), dan penalaran gambar-teks terpadu.",
      codeSnippets: [{
        id: "multi-snip-8",
        language: "python",
        caption: "multimodal_cot_bbox.py",
        code: "def parse_multimodal_reasoning(cot_output):\n    # Contoh output reasoning berlandaskan bounding box (grounded CoT)\n    steps = [\n        \"1. Identifikasi objek target: rambu lalu lintas di [ymin: 120, xmin: 340, ymax: 210, xmax: 430]\",\n        \"2. Deteksi teks OCR pada rambu: terbaca 'STOP'\",\n        \"3. Kesimpulan: Kendaraan otonom harus berhenti penuh sebelum garis henti.\"\n    ]\n    return \"\\n\".join(steps)\n\nprint(\"[Multimodal Chain-of-Thought]:\")\nprint(parse_multimodal_reasoning(\"Analisis gambar jalan raya\"))",
      }],
    },
    {
      id: "multi-sec-9",
      title: "BAB 9: Evaluasi Model Multimodal",
      orderIndex: 9,
      isCompleted: false,
      description: "Benchmark standar (MMBench, MME, MathVista, VQA-v2), metrik evaluasi cross-modal (CIDEr, SPICE, BLEU-4, Image-Text Recall@K), dan deteksi halusinasi visual.",
      codeSnippets: [{
        id: "multi-snip-9",
        language: "python",
        caption: "vqa_accuracy_eval.py",
        code: "def calculate_vqa_accuracy(predictions, ground_truths_list):\n    # Metrik standar VQA: min(count(jawaban sesuai) / 3, 1.0)\n    scores = []\n    for pred, gts in zip(predictions, ground_truths_list):\n        matches = sum(1 for gt in gts if gt.lower() == pred.lower())\n        score = min(matches / 3.0, 1.0)\n        scores.append(score)\n    return np.mean(scores)\n\npreds = [\"kucing\", \"merah\"]\ngts = [[\"kucing\", \"kucing\", \"anak kucing\"], [\"merah\", \"merah\", \"merah\", \"oranye\"]]\nprint(f\"Akurasi VQA Standar: {calculate_vqa_accuracy(preds, gts) * 100:.2f}%\")",
      }],
    },
    {
      id: "multi-sec-10",
      title: "BAB 10: Aplikasi Multimodal AI",
      orderIndex: 10,
      isCompleted: false,
      description: "Implementasi industri: asisten virtual multimodal interaktif, mesin pencari multimodal (Image-Text Retrieval), robotika persepsi lingkungan, dan analisis medis radiologi-laporan terpadu.",
      codeSnippets: [{
        id: "multi-snip-10",
        language: "python",
        caption: "multimodal_search_engine.py",
        code: "class MultimodalSearchIndex:\n    def __init__(self):\n        self.catalog = [\n            {\"id\": 1, \"title\": \"Sepatu Lari Merah\", \"features\": np.array([0.9, 0.2, 0.1])},\n            {\"id\": 2, \"title\": \"Kemeja Formal Putih\", \"features\": np.array([0.1, 0.8, 0.3])}\n        ]\n\n    def search_by_query_embedding(self, query_emb):\n        best_item = max(self.catalog, key=lambda item: np.dot(item[\"features\"], query_emb))\n        return best_item\n\nsearcher = MultimodalSearchIndex()\nquery_features = np.array([0.85, 0.25, 0.05]) # Gambar sepatu yang diunggah pengguna\nres = searcher.search_by_query_embedding(query_features)\nprint(f\"Hasil Pencarian Multimodal Relevan: {res['title']} (ID: {res['id']})\")",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Recommendation System (12 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getRecommendationSystemSections(): ModuleSection[] {
  return [
    {
      id: "recsys-sec-1",
      title: "BAB 1: Dasar Sistem Rekomendasi",
      orderIndex: 1,
      isCompleted: false,
      description: "Konsep & tujuan Recommendation System, explicit rating vs implicit clicks/watch time, penanganan Cold Start Problem untuk pengguna/item baru, serta personalisasi vs kurasi trending.",
      codeSnippets: [{
        id: "recsys-snip-1",
        language: "python",
        caption: "implicit_interaction_matrix.py",
        code: "import numpy as np\n\n# Matriks interaksi pengguna vs item (Implicit Clicks & Duration)\nusers = [\"User1\", \"User2\", \"User3\"]\nitems = [\"ItemA\", \"ItemB\", \"ItemC\", \"ItemD\"]\n\n# Nilai mewakili intensitas interaksi (misal: jumlah klik / detik tayang)\ninteraction_matrix = np.array([\n    [5, 0, 2, 0],\n    [0, 8, 0, 1],\n    [3, 0, 4, 7]\n])\n\nprint(\"Tingkat Sparsitas Matriks Interaksi:\", \n      f\"{100 * (1 - np.count_nonzero(interaction_matrix) / interaction_matrix.size):.1f}%\")",
      }],
    },
    {
      id: "recsys-sec-2",
      title: "BAB 2: Content-Based Filtering",
      orderIndex: 2,
      isCompleted: false,
      description: "Representasi profil item (TF-IDF metadata, dense embedding katalog), pembentukan profil pengguna berdasarkan riwayat interaksi, dan perhitungan similarity (Cosine, Jaccard).",
      codeSnippets: [{
        id: "recsys-snip-2",
        language: "python",
        caption: "content_based_similarity.py",
        code: "from sklearn.metrics.pairwise import cosine_similarity\nimport numpy as np\n\n# Fitur item (Genre Film: [Aksi, Komedi, Drama, Sci-Fi])\nitems_profiles = np.array([\n    [1, 0, 0, 1], # Interstellar\n    [1, 1, 0, 0], # Deadpool\n    [0, 1, 1, 0]  # The Grand Budapest Hotel\n])\n\n# Profil preferensi pengguna (suka Aksi dan Sci-Fi)\nuser_profile = np.array([[0.8, 0.1, 0.0, 0.9]])\n\nscores = cosine_similarity(user_profile, items_profiles)[0]\nprint(\"Skor Kesesuaian Konten:\")\nprint(f\"- Interstellar: {scores[0]:.4f}\")\nprint(f\"- Deadpool: {scores[1]:.4f}\")\nprint(f\"- The Grand Budapest: {scores[2]:.4f}\")",
      }],
    },
    {
      id: "recsys-sec-3",
      title: "BAB 3: Collaborative Filtering",
      orderIndex: 3,
      isCompleted: false,
      description: "User-Based vs Item-Based Collaborative Filtering, Matrix Factorization (Singular Value Decomposition SVD, Alternating Least Squares ALS), dan pemodelan feedback implisit.",
      codeSnippets: [{
        id: "recsys-snip-3",
        language: "python",
        caption: "matrix_factorization_svd.py",
        code: "import numpy as np\n\n# Matriks rating R (3 Pengguna x 3 Film)\nR = np.array([\n    [5, 3, 0],\n    [4, 0, 0],\n    [1, 1, 5]\n], dtype=float)\n\n# Dekomposisi SVD: R ~ U * Sigma * Vt\nU, sigma, Vt = np.linalg.svd(R, full_matrices=False)\nk = 2 # Dimensi laten\nR_reconstructed = np.dot(U[:, :k] * sigma[:k], Vt[:k, :])\n\nprint(\"Matriks Rating Asli:\\n\", R)\nprint(\"Prediksi Rating Pasca Rekonstruksi SVD:\\n\", np.round(R_reconstructed, 2))",
      }],
    },
    {
      id: "recsys-sec-4",
      title: "BAB 4: Hybrid Recommendation",
      orderIndex: 4,
      isCompleted: false,
      description: "Strategi menggabungkan kekuatan metode: Weighted Hybrid, Switching Hybrid, Feature Combination, dan Cascade Hybrid (penyaringan bertahap coarse-to-fine).",
      codeSnippets: [{
        id: "recsys-snip-4",
        language: "python",
        caption: "weighted_hybrid_recsys.py",
        code: "def weighted_hybrid_score(cf_score, content_score, weight_cf=0.6):\n    return (weight_cf * cf_score) + ((1 - weight_cf) * content_score)\n\nitems = [\"Film A\", \"Film B\", \"Film C\"]\ncf_preds = [4.2, 3.1, 4.8]\ncontent_preds = [3.8, 4.5, 3.9]\n\nhybrid_rankings = [\n    (item, weighted_hybrid_score(cf, cnt))\n    for item, cf, cnt in zip(items, cf_preds, content_preds)\n]\nhybrid_rankings.sort(key=lambda x: x[1], reverse=True)\n\nprint(\"Peringkat Rekomendasi Hybrid Terpadu:\")\nfor rank, (item, score) in enumerate(hybrid_rankings, 1):\n    print(f\"{rank}. {item} (Skor: {score:.2f})\")",
      }],
    },
    {
      id: "recsys-sec-5",
      title: "BAB 5: Deep Learning untuk Rekomendasi",
      orderIndex: 5,
      isCompleted: false,
      description: "Neural Collaborative Filtering (NCF), Autoencoder untuk rekomendasi (AutoRec), arsitektur Wide & Deep (Google), serta Two-Tower Model untuk embedding-based retrieval skala besar.",
      codeSnippets: [{
        id: "recsys-snip-5",
        language: "python",
        caption: "two_tower_retrieval_model.py",
        code: "import numpy as np\n\ndef two_tower_dot_product(user_tower_output, item_tower_outputs):\n    # Menghitung kesamaan dot-product antara vektor user dan kandidat item\n    return np.dot(item_tower_outputs, user_tower_output)\n\nuser_embedding = np.array([0.5, -0.2, 0.8]) # Output dari User Tower (DNN)\nitems_catalog = np.array([\n    [0.6, -0.1, 0.7],  # Item 1\n    [-0.3, 0.8, -0.2], # Item 2\n    [0.4, -0.3, 0.9]   # Item 3\n])\n\ncandidate_scores = two_tower_dot_product(user_embedding, items_catalog)\nbest_item_idx = np.argmax(candidate_scores)\n\nprint(\"Skor Dot-Product Two-Tower:\", np.round(candidate_scores, 3))\nprint(f\"Item Terbaik Direkomendasikan: Item {best_item_idx + 1}\")",
      }],
    },
    {
      id: "recsys-sec-6",
      title: "BAB 6: Sequential & Session-Based Recommendation",
      orderIndex: 6,
      isCompleted: false,
      description: "Rekomendasi berbasis urutan waktu interaksi: model sekuensial RNN/GRU4Rec, Transformer untuk rekomendasi (SASRec, BERT4Rec), dan prediksi Next-Item dalam satu sesi aktif.",
      codeSnippets: [{
        id: "recsys-snip-6",
        language: "python",
        caption: "sasrec_self_attention_demo.py",
        code: "import numpy as np\n\n# Simulasi self-attention sederhana pada riwayat sesi belanja\ndef session_self_attention(session_items_emb):\n    # session_items_emb: (Seq_Len, Dim)\n    scores = np.dot(session_items_emb, session_items_emb.T)\n    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)\n    next_intent_vector = np.dot(weights[-1], session_items_emb) # Representasi intent item terakhir\n    return next_intent_vector\n\nsession_history = np.array([\n    [0.1, 0.9], # Klik: Smartphone\n    [0.2, 0.8], # Klik: Casing HP\n    [0.3, 0.85] # Klik: Screen Protector\n])\n\nintent = session_self_attention(session_history)\nprint(\"Vektor Intent Sesi Terkini:\", np.round(intent, 3))",
      }],
    },
    {
      id: "recsys-sec-7",
      title: "BAB 7: Graph-Based Recommendation",
      orderIndex: 7,
      isCompleted: false,
      description: "Rekomendasi graf interaksi pengguna-item (bipartite graph): Graph Neural Network (PinSage, LightGCN) dan pemanfaatan Knowledge Graph untuk memperkaya konteks rekomendasi.",
      codeSnippets: [{
        id: "recsys-snip-7",
        language: "python",
        caption: "lightgcn_message_passing.py",
        code: "import numpy as np\n\n# LightGCN menyederhanakan GCN tanpa non-linear activation atau feature transformation\n# E^(l+1) = (D^-1/2 * A * D^-1/2) * E^(l)\nadj_normalized = np.array([\n    [0.0, 0.5, 0.5],\n    [0.5, 0.0, 0.5],\n    [0.5, 0.5, 0.0]\n])\ninitial_embeddings = np.array([[1.0, 0.0], [0.0, 1.0], [0.5, 0.5]])\n\nlayer_1_emb = adj_normalized @ initial_embeddings\nfinal_emb = 0.5 * initial_embeddings + 0.5 * layer_1_emb\n\nprint(\"Representasi Embedding LightGCN Layer 1:\\n\", np.round(layer_1_emb, 3))\nprint(\"Final Combined Representation:\\n\", np.round(final_emb, 3))",
      }],
    },
    {
      id: "recsys-sec-8",
      title: "BAB 8: LLM & Generative Recommendation",
      orderIndex: 8,
      isCompleted: false,
      description: "Paradigma Generative Recommender: Large Language Model sebagai recommender zero-shot/few-shot, Conversational Recommendation agent, dan prompt-based reasoning untuk rekomendasi.",
      codeSnippets: [{
        id: "recsys-snip-8",
        language: "python",
        caption: "llm_recommender_prompt.py",
        code: "def build_recsys_prompt(user_history, candidates):\n    return f\"\"\"### SYSTEM: Anda adalah asisten kurasi rekomendasi belanja personal.\n### RIWAYAT PENGGUNA: {', '.join(user_history)}\n### DAFTAR KANDIDAT: {', '.join(candidates)}\n### TUGAS: Pilih 2 produk terbaik beserta alasan singkat mengapa pengguna akan menyukainya!\n### REKOMENDASI:\"\"\"\n\nprompt = build_recsys_prompt(\n    [\"Mechanical Keyboard\", \"Ergonomic Mouse\", \"Monitor Arm\"],\n    [\"Wrist Rest\", \"Desk Mat\", \"Coffee Mug\", \"Gaming Chair\"]\n)\nprint(\"[Contoh Prompt LLM-as-a-Recommender]:\\n\" + prompt)",
      }],
    },
    {
      id: "recsys-sec-9",
      title: "BAB 9: Evaluasi Sistem Rekomendasi",
      orderIndex: 9,
      isCompleted: false,
      description: "Metrik offline akurasi ranking (Precision@K, Recall@K, NDCG@K, Mean Average Precision MAP), metrik non-akurasi (Diversity, Novelty, Coverage), dan pengujian online A/B testing.",
      codeSnippets: [{
        id: "recsys-snip-9",
        language: "python",
        caption: "ndcg_evaluation_metric.py",
        code: "import numpy as np\n\ndef compute_ndcg_at_k(relevance_scores, k=3):\n    relevance = np.array(relevance_scores[:k])\n    dcg = np.sum(relevance / np.log2(np.arange(2, len(relevance) + 2)))\n    \n    ideal_relevance = np.sort(relevance)[::-1]\n    idcg = np.sum(ideal_relevance / np.log2(np.arange(2, len(ideal_relevance) + 2)))\n    \n    return dcg / idcg if idcg > 0 else 0.0\n\n# Skor relevansi item rekomendasi (1: Relevan, 0: Tidak)\nrec_relevance = [1, 0, 1, 1, 0]\nndcg_3 = compute_ndcg_at_k(rec_relevance, k=3)\nprint(f\"NDCG@3 Score: {ndcg_3:.4f}\")",
      }],
    },
    {
      id: "recsys-sec-10",
      title: "BAB 10: Context-Aware & RL Recommendation",
      orderIndex: 10,
      isCompleted: false,
      description: "Rekomendasi peka konteks (waktu, cuaca, lokasi, perangkat), Multi-Armed Bandit (Upper Confidence Bound, Thompson Sampling) untuk eksplorasi vs eksploitasi, dan Reinforcement Learning.",
      codeSnippets: [{
        id: "recsys-snip-10",
        language: "python",
        caption: "thompson_sampling_recsys.py",
        code: "import numpy as np\n\n# Multi-Armed Bandit (Thompson Sampling) untuk memilih banner rekomendasi terbaik\nsuccesses = np.array([12, 8, 25])  # Jumlah konversi/klik per banner\nfailures = np.array([88, 92, 75])  # Jumlah tayang tanpa klik\n\n# Sample dari distribusi Beta(alpha, beta)\nsampled_probs = np.random.beta(successes + 1, failures + 1)\nchosen_banner = np.argmax(sampled_probs)\n\nprint(f\"Peluang Estimat Thompson Sampling: {np.round(sampled_probs, 4)}\")\nprint(f\"Banner Terpilih untuk Pengguna: Banner #{chosen_banner + 1}\")",
      }],
    },
    {
      id: "recsys-sec-11",
      title: "BAB 11: Explainability & Fairness",
      orderIndex: 11,
      isCompleted: false,
      description: "Sistem rekomendasi yang dapat dijelaskan (Explainable AI: \"Karena Anda membeli X...\"), mitigasi bias popularitas (Popularity Bias), keadilan algoritma (Fairness across providers/users), dan transparansi.",
      codeSnippets: [{
        id: "recsys-snip-11",
        language: "python",
        caption: "item_explanation_generator.py",
        code: "def generate_explanation(recommended_item, trigger_item, similarity_feature):\n    return (\n        f\"Kami merekomendasikan '{recommended_item}' karena Anda baru saja membeli \"\n        f\"'{trigger_item}' yang memiliki kesamaan dalam kategori {similarity_feature}.\"\n    )\n\nprint(\"[Explainable Recommendation Message]:\")\nprint(generate_explanation(\"Kabel HDMI 2.1\", \"Monitor Gaming 144Hz\", \"Aksesoris Tampilan\"))",
      }],
    },
    {
      id: "recsys-sec-12",
      title: "BAB 12: Skalabilitas & Deployment",
      orderIndex: 12,
      isCompleted: false,
      description: "Infrastruktur industri: arsitektur multi-tahap (Retrieval 10k items -> Heavy Scoring/Ranking 100 items -> Re-ranking & Business Rules), real-time serving low latency, dan Feature Store.",
      codeSnippets: [{
        id: "recsys-snip-12",
        language: "python",
        caption: "recsys_multistage_pipeline.py",
        code: "stages = [\n    (\"Stage 1: Retrieval / Candidate Generation\", \"Menyaring 1,000,000 produk menjadi 500 kandidat via ANN Two-Tower\"),\n    (\"Stage 2: Scoring & Ranking\", \"Menghitung probabilitas CTR/CVR menggunakan Deep Model pada 500 kandidat\"),\n    (\"Stage 3: Re-ranking & Diversity\", \"Menerapkan aturan bisnis, deduping, novelty boost, dan kuota sponsor\")\n]\n\nprint(\"=== ARSITEKTUR PIPELINE REKOMENDASI SKALA BESAR ===\")\nfor stage, desc in stages:\n    print(f\"{stage}:\\n  -> {desc}\")",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Natural Language Processing (14 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getNaturalLanguageProcessingSections(): ModuleSection[] {
  return [
    {
      id: "nlp-sec-1",
      title: "BAB 1: Dasar Pemrosesan Bahasa Alami",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi & ruang lingkup NLP, tantangan inheren bahasa manusia (ambiguitas leksikal/sintaksis, ketergantungan konteks, pragmatik), dan tingkatan analisis linguistik.",
      codeSnippets: [{
        id: "nlp-snip-1",
        language: "python",
        caption: "ambiguity_detection_demo.py",
        code: "# Contoh fenomena ambiguitas sintaktis dalam bahasa alami\nkalimat_ambigu = \"Ilmuwan melihat bintang dengan teleskop.\"\ninterpretasi_1 = \"Ilmuwan menggunakan teleskop sebagai instrumen untuk melihat bintang.\"\ninterpretasi_2 = \"Ilmuwan melihat bintang yang sedang membawa teleskop (makna harfiah tidak wajar).\"\n\nprint(\"Tantangan Ambiguitas NLP:\\nKalimat:\", kalimat_ambigu)\nprint(\"Interpretasi Utama (Pragmatik):\", interpretasi_1)",
      }],
    },
    {
      id: "nlp-sec-2",
      title: "BAB 2: Text Preprocessing",
      orderIndex: 2,
      isCompleted: false,
      description: "Tokenization, Stemming & Lemmatization, Stopword Removal, Part-of-Speech (POS) Tagging, dan algoritma Subword Tokenization mutakhir (Byte-Pair Encoding BPE, WordPiece, SentencePiece).",
      codeSnippets: [{
        id: "nlp-snip-2",
        language: "python",
        caption: "bpe_subword_tokenization.py",
        code: "def mock_bpe_tokenize(word, vocab_merges):\n    tokens = list(word) + [\"</w>\"]\n    for pair in vocab_merges:\n        bigram = \"\".join(pair)\n        i = 0\n        new_tokens = []\n        while i < len(tokens):\n            if i < len(tokens) - 1 and tokens[i] == pair[0] and tokens[i+1] == pair[1]:\n                new_tokens.append(bigram)\n                i += 2\n            else:\n                new_tokens.append(tokens[i])\n                i += 1\n        tokens = new_tokens\n    return tokens\n\nmerges = [(\"e\", \"r\"), (\"er\", \"k\")]\nprint(\"Hasil BPE Tokenizer kata 'rekursif':\", mock_bpe_tokenize(\"rekursif\", merges))",
      }],
    },
    {
      id: "nlp-sec-3",
      title: "BAB 3: Representasi Teks",
      orderIndex: 3,
      isCompleted: false,
      description: "Vektorisasi teks: Bag of Words (BoW) & TF-IDF, Static Word Embeddings (Word2Vec CBOW/Skip-gram, GloVe, FastText), dan Contextual Embedding dinamis (ELMo).",
      codeSnippets: [{
        id: "nlp-snip-3",
        language: "python",
        caption: "tfidf_custom_vectorizer.py",
        code: "import numpy as np\n\ndocs = [\"data science menyenangkan\", \"machine learning dan data science\"]\nterms = [\"data\", \"learning\", \"machine\", \"menyenangkan\", \"science\"]\n\n# Perhitungan manual matriks Term Frequency (TF)\ntf_matrix = np.array([\n    [1/3, 0, 0, 1/3, 1/3],\n    [1/5, 1/5, 1/5, 0, 1/5]\n])\n# Inverse Document Frequency (IDF)\nidf = np.log((1 + 2) / (1 + np.array([2, 1, 1, 1, 2]))) + 1\ntfidf = tf_matrix * idf\n\nprint(\"Matriks TF-IDF Dokumen:\\n\", np.round(tfidf, 3))",
      }],
    },
    {
      id: "nlp-sec-4",
      title: "BAB 4: Model Sekuensial untuk NLP",
      orderIndex: 4,
      isCompleted: false,
      description: "Pemodelan data sekuens berurutan: Recurrent Neural Network (RNN vanilla, vanishing gradient), Long Short-Term Memory (LSTM cell gates), GRU, dan arsitektur Sequence-to-Sequence (Seq2Seq).",
      codeSnippets: [{
        id: "nlp-snip-4",
        language: "python",
        caption: "lstm_cell_equations.py",
        code: "import numpy as np\n\ndef sigmoid(x): return 1 / (1 + np.exp(-x))\n\ndef lstm_step(x_t, h_prev, c_prev, W_f, W_i, W_o, W_c):\n    # Gabungan x_t dan hidden state sebelumnya\n    concat = np.concatenate([x_t, h_prev])\n    f_t = sigmoid(np.dot(W_f, concat))  # Forget gate\n    i_t = sigmoid(np.dot(W_i, concat))  # Input gate\n    c_tilde = np.tanh(np.dot(W_c, concat))\n    c_t = f_t * c_prev + i_t * c_tilde  # Cell state update\n    o_t = sigmoid(np.dot(W_o, concat))  # Output gate\n    h_t = o_t * np.tanh(c_t)            # Hidden state\n    return h_t, c_t\n\nprint(\"Formula LSTM Cell Gate berhasil didefinisikan untuk forward pass sekuens.\")",
      }],
    },
    {
      id: "nlp-sec-5",
      title: "BAB 5: Transformer & Model Bahasa",
      orderIndex: 5,
      isCompleted: false,
      description: "Mekanisme Scaled Dot-Product Attention, arsitektur Multi-Head Transformer, Encoder-only models (BERT, RoBERTa), dan Decoder-only autoregressive models (GPT family).",
      codeSnippets: [{
        id: "nlp-snip-5",
        language: "python",
        caption: "transformer_attention_head.py",
        code: "import numpy as np\n\ndef scaled_dot_product_attention(Q, K, V, mask=None):\n    d_k = Q.shape[-1]\n    scores = np.matmul(Q, K.swapaxes(-2, -1)) / np.sqrt(d_k)\n    if mask is not None:\n        scores = np.where(mask == 0, -1e9, scores)\n    weights = np.exp(scores - np.max(scores, axis=-1, keepdims=True))\n    weights = weights / np.sum(weights, axis=-1, keepdims=True)\n    return np.matmul(weights, V)\n\ntokens = np.random.randn(1, 4, 32) # Batch 1, Seq 4, Dim 32\nattn_out = scaled_dot_product_attention(tokens, tokens, tokens)\nprint(\"Output Transformer Self-Attention Head:\", attn_out.shape)",
      }],
    },
    {
      id: "nlp-sec-6",
      title: "BAB 6: Sintaksis & Parsing",
      orderIndex: 6,
      isCompleted: false,
      description: "Analisis struktur gramatikal kalimat: Syntactic Parsing, Dependency Parsing (head-dependent relations), dan Constituency Parsing (Phrase Structure Grammar).",
      codeSnippets: [{
        id: "nlp-snip-6",
        language: "python",
        caption: "dependency_parse_tree.py",
        code: "# Contoh relasi ketergantungan sintaktis (Dependency Tuple: Head -> Relasi -> Dependent)\ndep_relations = [\n    (\"makan\", \"nsubj\", \"Budi\"),       # Subjek nominal\n    (\"makan\", \"dobj\", \"nasi goreng\"), # Objek langsung\n    (\"makan\", \"advmod\", \"lahap\")      # Adverbial modifier\n]\n\nprint(\"Relasi Dependency Parsing Kalimat:\")\nfor head, rel, dep in dep_relations:\n    print(f\"[{head}] ---({rel})---> [{dep}]\")",
      }],
    },
    {
      id: "nlp-sec-7",
      title: "BAB 7: Information Extraction",
      orderIndex: 7,
      isCompleted: false,
      description: "Ekstraksi informasi terstruktur dari korpus bebas: Named Entity Recognition (NER), Relation Extraction, Event Extraction, dan Coreference Resolution (resolusi kata ganti).",
      codeSnippets: [{
        id: "nlp-snip-7",
        language: "python",
        caption: "ner_iob_tagging.py",
        code: "tokens = [\"Presiden\", \"Jokowi\", \"berkunjung\", \"ke\", \"IKN\", \"Nusantara\"]\niob_tags = [\"B-PER\", \"I-PER\", \"O\", \"O\", \"B-LOC\", \"I-LOC\"]\n\nprint(\"Anotasi Named Entity Recognition (Format IOB2):\")\nfor tok, tag in zip(tokens, iob_tags):\n    print(f\"{tok:12} -> {tag}\")",
      }],
    },
    {
      id: "nlp-sec-8",
      title: "BAB 8: Pemahaman & Generasi Bahasa",
      orderIndex: 8,
      isCompleted: false,
      description: "Tugas-tugas inti NLP praktis: Neural Machine Translation (NMT), Text Summarization (abstraktif vs ekstraktif), Question Answering (QA), serta Sentiment Analysis & Emotion Detection.",
      codeSnippets: [{
        id: "nlp-snip-8",
        language: "python",
        caption: "text_summarization_metrics.py",
        code: "def mock_extractive_summary(text_paragraphs, top_n=2):\n    sentences = text_paragraphs.split(\". \")\n    # Ranking kalimat sederhana berdasarkan panjang dan posisi awal\n    scored = sorted(sentences, key=lambda s: len(s), reverse=True)\n    return \". \".join(scored[:top_n]) + \".\"\n\ncorpus = \"Velqora adalah platform belajar kecerdasan buatan terpadu. Materi mencakup puluhan topik mutakhir dari dasar hingga tingkat lanjut. Setiap topik dilengkapi kode praktikum Python.\"\nprint(\"[Ringkasan Ekstraktif]:\\n\" + mock_extractive_summary(corpus, top_n=2))",
      }],
    },
    {
      id: "nlp-sec-9",
      title: "BAB 9: Dialogue & Conversational AI",
      orderIndex: 9,
      isCompleted: false,
      description: "Arsitektur sistem percakapan: Task-Oriented Dialogue Systems (NLU, DST - Dialogue State Tracking, Policy Manager, NLG), dan Open-Domain Neural Chatbots.",
      codeSnippets: [{
        id: "nlp-snip-9",
        language: "python",
        caption: "dialogue_state_tracker.py",
        code: "class DialogueStateTracker:\n    def __init__(self):\n        self.slots = {\"asal\": None, \"tujuan\": None, \"tanggal\": None}\n\n    def update_state(self, user_intent, extracted_entities):\n        for k, v in extracted_entities.items():\n            if k in self.slots:\n                self.slots[k] = v\n\n    def is_ready_to_book(self):\n        return all(v is not None for v in self.slots.values())\n\ndst = DialogueStateTracker()\ndst.update_state(\"pesan_tiket\", {\"asal\": \"Jakarta\", \"tujuan\": \"Surabaya\"})\nprint(\"Slot Terisi Saat Ini:\", dst.slots)\nprint(\"Siap Eksekusi Pemesanan?\", dst.is_ready_to_book())",
      }],
    },
    {
      id: "nlp-sec-10",
      title: "BAB 10: Large Language Model dalam NLP",
      orderIndex: 10,
      isCompleted: false,
      description: "Peran LLM sebagai backbone NLP modern: evolusi dari transfer learning BERT ke paradigma pretraining, instruction fine-tuning, in-context prompt engineering, dan RAG.",
      codeSnippets: [{
        id: "nlp-snip-10",
        language: "python",
        caption: "nlp_task_via_prompt.py",
        code: "def perform_nlp_task(task_type, text_input):\n    prompt_template = {\n        \"ner\": f\"Ekstrak nama orang dan lokasi dari teks: '{text_input}'\",\n        \"sentiment\": f\"Klasifikasikan sentimen (Positif/Negatif/Netral): '{text_input}'\",\n        \"translation\": f\"Terjemahkan ke bahasa Inggris: '{text_input}'\"\n    }\n    return f\"[Prompt ke LLM]: {prompt_template.get(task_type, '')}\"\n\nprint(perform_nlp_task(\"sentiment\", \"Aplikasi belajar ini sangat cepat dan menyenangkan!\"))",
      }],
    },
    {
      id: "nlp-sec-11",
      title: "BAB 11: NLP Multibahasa & Cross-Lingual",
      orderIndex: 11,
      isCompleted: false,
      description: "Multilingual Language Models (mBERT, XLM-RoBERTa), teknik Cross-Lingual Transfer (zero-shot transfer bahasa lintas sumber), dan strategi pengembangan untuk Low-Resource Languages.",
      codeSnippets: [{
        id: "nlp-snip-11",
        language: "python",
        caption: "cross_lingual_embedding.py",
        code: "import numpy as np\n\n# Simulasi penyelarasan ruang vektor antar bahasa (Shared Multilingual Space)\nv_indo_apel = np.array([0.45, 0.88, 0.12])\nv_eng_apple = np.array([0.44, 0.89, 0.10])\n\nsim = np.dot(v_indo_apel, v_eng_apple) / (np.linalg.norm(v_indo_apel) * np.linalg.norm(v_eng_apple))\nprint(f\"Cosine Similarity kata 'Apel' (ID) dan 'Apple' (EN): {sim:.4f}\")",
      }],
    },
    {
      id: "nlp-sec-12",
      title: "BAB 12: Evaluasi NLP",
      orderIndex: 12,
      isCompleted: false,
      description: "Metrik evaluasi generatif dan klasifikasi: BLEU Score, ROUGE (1/2/L), Perplexity (PPL), serta benchmark komprehensif GLUE & SuperGLUE.",
      codeSnippets: [{
        id: "nlp-snip-12",
        language: "python",
        caption: "rouge_l_evaluator.py",
        code: "def compute_lcs_length(seq1, seq2):\n    m, n = len(seq1), len(seq2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m):\n        for j in range(n):\n            if seq1[i] == seq2[j]: dp[i+1][j+1] = dp[i][j] + 1\n            else: dp[i+1][j+1] = max(dp[i+1][j], dp[i][j+1])\n    return dp[m][n]\n\nref = \"model transformer sangat efisien untuk pengolahan teks\".split()\nhyp = \"transformer model sangat efisien dalam pengolahan teks\".split()\nlcs = compute_lcs_length(ref, hyp)\nrouge_l_recall = lcs / len(ref)\n\nprint(f\"Panjang Longest Common Subsequence (LCS): {lcs}\")\nprint(f\"ROUGE-L Recall: {rouge_l_recall * 100:.2f}%\")",
      }],
    },
    {
      id: "nlp-sec-13",
      title: "BAB 13: Bias, Fairness & Interpretability NLP",
      orderIndex: 13,
      isCompleted: false,
      description: "Bias sosial dan gender dalam word embeddings, toxic content moderation, dan interpretabilitas model bahasa menggunakan Attention Visualization & Integrated Gradients.",
      codeSnippets: [{
        id: "nlp-snip-13",
        language: "python",
        caption: "embedding_bias_check.py",
        code: "import numpy as np\n\ndef cosine_distance(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\n# Pemeriksaan bias analogi kata pada representasi vektor\nv_doctor = np.array([0.7, 0.2])\nv_nurse = np.array([0.6, 0.3])\nv_gender_dir = np.array([0.1, 0.9]) # Sumbu gender terindikasi\n\nprint(\"Proyeksi Pekerjaan pada Sumbu Gender:\")\nprint(\"Dokter:\", round(cosine_distance(v_doctor, v_gender_dir), 3))\nprint(\"Perawat:\", round(cosine_distance(v_nurse, v_gender_dir), 3))",
      }],
    },
    {
      id: "nlp-sec-14",
      title: "BAB 14: Topik Lanjutan NLP",
      orderIndex: 14,
      isCompleted: false,
      description: "Riset lanjutan: analisis sentimen berbasis aspek (ABSA), Stylometry (atribusi kepenulisan teks), dan Controlled Text Generation dengan Classifier-Guided Decoding.",
      codeSnippets: [{
        id: "nlp-snip-14",
        language: "python",
        caption: "absa_aspect_sentiment.py",
        code: "def extract_aspect_sentiment(review):\n    aspects = {}\n    if \"layanan\" in review:\n        aspects[\"Layanan\"] = \"Positif\" if \"cepat\" in review or \"ramah\" in review else \"Negatif\"\n    if \"harga\" in review:\n        aspects[\"Harga\"] = \"Negatif\" if \"mahal\" in review else \"Positif\"\n    return aspects\n\nrev = \"Layanan restoran ini sangat ramah dan cepat, tetapi harga agak mahal.\"\nprint(\"Hasil Aspect-Based Sentiment Analysis (ABSA):\")\nprint(extract_aspect_sentiment(rev))",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Reinforcement Learning (13 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getReinforcementLearningSections(): ModuleSection[] {
  return [
    {
      id: "rl-sec-1",
      title: "BAB 1: Konsep Dasar Reinforcement Learning",
      orderIndex: 1,
      isCompleted: false,
      description: "Komponen siklus RL (Agent, Environment, State, Action, Reward, Policy), perbedaan mendasar RL dengan Supervised/Unsupervised Learning, dan dilemma eksplorasi-eksploitasi.",
      codeSnippets: [{
        id: "rl-snip-1",
        language: "python",
        caption: "rl_agent_env_loop.py",
        code: "class SimpleEnvironment:\n    def __init__(self):\n        self.state = 0\n    def step(self, action):\n        self.state += action\n        reward = 1.0 if self.state == 3 else -0.1\n        done = (self.state >= 3)\n        return self.state, reward, done\n\nenv = SimpleEnvironment()\nfor step in range(4):\n    next_s, r, done = env.step(action=1)\n    print(f\"Langkah {step+1}: State = {next_s}, Reward = {r}, Selesai = {done}\")\n    if done: break",
      }],
    },
    {
      id: "rl-sec-2",
      title: "BAB 2: Markov Decision Process (MDP)",
      orderIndex: 2,
      isCompleted: false,
      description: "Formulasi matematis MDP (State space S, Action space A, Transition probability P, Reward function R, Discount factor gamma), Policy & Value Function, serta Persamaan Bellman.",
      codeSnippets: [{
        id: "rl-snip-2",
        language: "python",
        caption: "bellman_expectation_equation.py",
        code: "import numpy as np\n\n# Evaluasi Nilai State Bellman: V(s) = sum_a pi(a|s) * [R(s,a) + gamma * sum_s' P(s'|s,a) V(s')]\nV = np.zeros(3) # 3 States\ngamma = 0.9\nrewards = np.array([0.0, 1.0, 10.0])\n\nfor iteration in range(10):\n    V_new = np.copy(V)\n    for s in range(2): # state 2 adalah terminal\n        V_new[s] = rewards[s] + gamma * V[s+1]\n    V = V_new\n\nprint(\"Value Function V(s) hasil iterasi Bellman:\", np.round(V, 2))",
      }],
    },
    {
      id: "rl-sec-3",
      title: "BAB 3: Dynamic Programming",
      orderIndex: 3,
      isCompleted: false,
      description: "Penyelesaian MDP berpengetahuan sempurna: Policy Evaluation, Policy Iteration (perbaikan kebijakan berulang), dan Value Iteration (optimasi nilai maksimum Bellman).",
      codeSnippets: [{
        id: "rl-snip-3",
        language: "python",
        caption: "value_iteration_algorithm.py",
        code: "import numpy as np\n\n# Value Iteration pada 4-state linear chain\nV = np.zeros(4)\ngamma = 0.95\nR = np.array([-1, -1, -1, 10]) # Goal state di index 3\n\nfor it in range(20):\n    for s in range(3):\n        # Aksi Kanan mengantar ke s+1\n        V[s] = R[s] + gamma * V[s+1]\n\nprint(\"State Values terkonvergensi:\", np.round(V, 2))",
      }],
    },
    {
      id: "rl-sec-4",
      title: "BAB 4: Model-Free Prediction & Control",
      orderIndex: 4,
      isCompleted: false,
      description: "Pembelajaran tanpa model transisi: Monte Carlo Methods (evaluasi berbasis episode lengkap), Temporal Difference Learning (TD(0)), Q-Learning (Off-Policy), dan SARSA (On-Policy).",
      codeSnippets: [{
        id: "rl-snip-4",
        language: "python",
        caption: "qlearning_vs_sarsa.py",
        code: "import numpy as np\n\n# Pembaruan Q-Learning (Off-policy TD Control)\n# Q(s, a) = Q(s, a) + alpha * [R + gamma * max_a' Q(s', a') - Q(s, a)]\nQ = np.zeros((2, 2))\ns, a, r, s_next = 0, 1, 5.0, 1\nalpha, gamma = 0.1, 0.9\n\ntarget = r + gamma * np.max(Q[s_next])\nQ[s, a] += alpha * (target - Q[s, a])\n\nprint(\"Tabel Q-Learning setelah satu update:\\n\", Q)",
      }],
    },
    {
      id: "rl-sec-5",
      title: "BAB 5: Deep Reinforcement Learning",
      orderIndex: 5,
      isCompleted: false,
      description: "Deep Q-Network (DQN: estimasi fungsi nilai dengan neural network), Double DQN (mengatasi overestimasi nilai Q), Dueling DQN (memisahkan Value & Advantage), dan Experience Replay Buffer.",
      codeSnippets: [{
        id: "rl-snip-5",
        language: "python",
        caption: "replay_buffer_dqn.py",
        code: "import random\nfrom collections import deque\n\nclass ReplayBuffer:\n    def __init__(self, capacity=1000):\n        self.buffer = deque(maxlen=capacity)\n    def push(self, state, action, reward, next_state, done):\n        self.buffer.append((state, action, reward, next_state, done))\n    def sample(self, batch_size):\n        return random.sample(self.buffer, batch_size)\n\nbuf = ReplayBuffer(100)\nbuf.push([0.5, 0.2], 1, 1.0, [0.6, 0.3], False)\nbatch = buf.sample(1)\nprint(\"Sampel Mini-batch dari Replay Buffer:\", batch[0])",
      }],
    },
    {
      id: "rl-sec-6",
      title: "BAB 6: Policy Gradient Methods",
      orderIndex: 6,
      isCompleted: false,
      description: "Optimasi kebijakan langsung: Teorema Policy Gradient, REINFORCE Algorithm (Monte Carlo Policy Gradient), metode Actor-Critic, dan Advantage Actor-Critic (A2C/A3C).",
      codeSnippets: [{
        id: "rl-snip-6",
        language: "python",
        caption: "reinforce_loss_calculation.py",
        code: "import numpy as np\n\n# Perhitungan gradien REINFORCE: grad = -log_prob * Discounted_Return\nlog_prob_action = -0.693 # log(0.5)\ndiscounted_return = 8.5   # G_t\n\npolicy_loss = -log_prob_action * discounted_return\nprint(f\"Policy Gradient Loss (REINFORCE): {policy_loss:.4f}\")",
      }],
    },
    {
      id: "rl-sec-7",
      title: "BAB 7: Metode RL Lanjutan",
      orderIndex: 7,
      isCompleted: false,
      description: "Algoritma state-of-the-art continuous control: Proximal Policy Optimization (PPO clipped objective), Trust Region Policy Optimization (TRPO), dan Soft Actor-Critic (SAC maximum entropy).",
      codeSnippets: [{
        id: "rl-snip-7",
        language: "python",
        caption: "ppo_clipped_objective.py",
        code: "import numpy as np\n\ndef ppo_clipped_loss(prob_ratio, advantage, epsilon=0.2):\n    surr1 = prob_ratio * advantage\n    surr2 = np.clip(prob_ratio, 1.0 - epsilon, 1.0 + epsilon) * advantage\n    return -np.minimum(surr1, surr2)\n\nratio = 1.3 # Kebijakan baru menghasilkan probabilitas lebih tinggi\nadv = 2.0   # Advantage positif\nloss = ppo_clipped_loss(ratio, adv)\n\nprint(f\"PPO Clipped Objective Loss: {loss:.4f} (Dibatasi oleh batas epsilon clip)\")",
      }],
    },
    {
      id: "rl-sec-8",
      title: "BAB 8: Model-Based Reinforcement Learning",
      orderIndex: 8,
      isCompleted: false,
      description: "Konsep Model-Based RL: mempelajari model dinamika lingkungan (World Models), simulasi perencanaan imajinasi masa depan (Dyna-Q, MuZero), dan efisiensi sampel data.",
      codeSnippets: [{
        id: "rl-snip-8",
        language: "python",
        caption: "world_model_transition.py",
        code: "class WorldModel:\n    def __init__(self):\n        # Model dinamika mempelajari transisi f(s, a) -> s'\n        pass\n    def predict_next_state_and_reward(self, current_state, action):\n        next_state = current_state + (0.5 * action)\n        reward = 1.0 if next_state > 2.0 else 0.0\n        return next_state, reward\n\nwm = WorldModel()\npred_s, pred_r = wm.predict_next_state_and_reward(1.0, action=2)\nprint(f\"Prediksi State Masa Depan oleh World Model: {pred_s}, Reward: {pred_r}\")",
      }],
    },
    {
      id: "rl-sec-9",
      title: "BAB 9: Offline Reinforcement Learning",
      orderIndex: 9,
      isCompleted: false,
      description: "Pelatihan agen RL dari dataset historis statis tanpa interaksi aktif dengan lingkungan: tantangan Out-of-Distribution Actions dan Distributional Shift (Conservative Q-Learning CQL).",
      codeSnippets: [{
        id: "rl-snip-9",
        language: "python",
        caption: "offline_cql_penalty.py",
        code: "import numpy as np\n\n# Conservative Q-Learning (CQL) menambahkan penalti regularisasi untuk aksi OOD\nq_values = np.array([2.5, 4.8, 1.2]) # Prediksi nilai Q tiap aksi\nood_penalty_alpha = 0.5\ncql_loss_regularizer = ood_penalty_alpha * (np.log(np.sum(np.exp(q_values))) - q_values[0])\n\nprint(f\"Penalti Regularisasi CQL untuk mencegah overestimasi offline: {cql_loss_regularizer:.4f}\")",
      }],
    },
    {
      id: "rl-sec-10",
      title: "BAB 10: Multi-Agent Reinforcement Learning",
      orderIndex: 10,
      isCompleted: false,
      description: "MARL: kooperasi, kompetisi, dan koordinasi antar agen mandiri (Cooperative vs Competitive), Game Theory dalam RL (Nash Equilibrium), dan arsitektur MAPPO.",
      codeSnippets: [{
        id: "rl-snip-10",
        language: "python",
        caption: "multi_agent_payoff_matrix.py",
        code: "# Payoff Matrix Dilema Tahanan (Prisoner's Dilemma)\n# (Reward Agen 1, Reward Agen 2)\npayoff = {\n    (\"Kerjasama\", \"Kerjasama\"): (3, 3),\n    (\"Kerjasama\", \"Khianat\"): (0, 5),\n    (\"Khianat\", \"Kerjasama\"): (5, 0),\n    (\"Khianat\", \"Khianat\"): (1, 1)\n}\n\nprint(\"Nash Equilibrium MARL (Keduanya Berkhianat):\", payoff[(\"Khianat\", \"Khianat\")])",
      }],
    },
    {
      id: "rl-sec-11",
      title: "BAB 11: RL untuk Model Bahasa",
      orderIndex: 11,
      isCompleted: false,
      description: "Reinforcement Learning from Human Feedback (RLHF): pelatihan Reward Model dari preferensi manusia, optimasi kebijakan LLM via PPO dengan KL-divergence penalty, dan RLAIF.",
      codeSnippets: [{
        id: "rl-snip-11",
        language: "python",
        caption: "rlhf_kl_penalty.py",
        code: "import numpy as np\n\ndef calculate_rlhf_reward(raw_reward, logprob_active, logprob_ref, beta=0.1):\n    # Penalti KL Divergence agar LLM tidak menyimpang dari model referensi\n    kl_divergence = logprob_active - logprob_ref\n    penalized_reward = raw_reward - (beta * kl_divergence)\n    return penalized_reward\n\npen_r = calculate_rlhf_reward(raw_reward=2.5, logprob_active=-1.2, logprob_ref=-1.8, beta=0.2)\nprint(f\"Reward Akhir Terpenalti KL (RLHF): {pen_r:.4f}\")",
      }],
    },
    {
      id: "rl-sec-12",
      title: "BAB 12: Exploration Strategies dalam RL",
      orderIndex: 12,
      isCompleted: false,
      description: "Strategi eksplorasi tingkat lanjut: Epsilon-Greedy, Upper Confidence Bound (UCB), Thompson Sampling, Intrinsic Motivation, dan Curiosity-Driven Exploration (ICM).",
      codeSnippets: [{
        id: "rl-snip-12",
        language: "python",
        caption: "curiosity_driven_intrinsic_reward.py",
        code: "import numpy as np\n\ndef compute_intrinsic_reward(actual_next_state, predicted_next_state, eta=0.01):\n    # Curiosity-driven reward berbasis prediksi error lingkungan\n    prediction_error = np.mean((actual_next_state - predicted_next_state)**2)\n    intrinsic_reward = (eta / 2.0) * prediction_error\n    return intrinsic_reward\n\ns_actual = np.array([1.2, 0.5])\ns_pred = np.array([0.8, 0.4])\nr_intrinsic = compute_intrinsic_reward(s_actual, s_pred)\nprint(f\"Bonus Reward Rasa Ingin Tahu (Intrinsic Reward): {r_intrinsic:.6f}\")",
      }],
    },
    {
      id: "rl-sec-13",
      title: "BAB 13: Aplikasi Reinforcement Learning",
      orderIndex: 13,
      isCompleted: false,
      description: "Implementasi RL industri: Game AI otonom (AlphaGo, Dota 2 OpenAI Five), kontrol robotika adaptif, pendinginan pusat data dan optimasi alokasi daya energi.",
      codeSnippets: [{
        id: "rl-snip-13",
        language: "python",
        caption: "datacenter_cooling_rl.py",
        code: "class DatacenterEnergyManager:\n    def __init__(self):\n        self.server_temp = 32.0 # Derajat Celcius\n    def step(self, chiller_power_action):\n        self.server_temp -= (chiller_power_action * 0.8)\n        energy_cost = chiller_power_action * 1.5\n        temp_penalty = 10.0 if self.server_temp > 35.0 else 0.0\n        reward = -(energy_cost + temp_penalty)\n        return self.server_temp, reward\n\nmanager = DatacenterEnergyManager()\ntemp, reward = manager.step(chiller_power_action=2)\nprint(f\"Suhu Server Pasca Aksi RL: {temp:.1f}C, Reward Efisiensi Energi: {reward:.2f}\")",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Robotics & Embodied AI (13 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getRoboticsEmbodiedAiSections(): ModuleSection[] {
  return [
    {
      id: "robo-sec-1",
      title: "BAB 1: Konsep Dasar Robotika",
      orderIndex: 1,
      isCompleted: false,
      description: "Komponen sistem robotik (Actuators, Sensors, Controllers, End-Effectors), jenis robot (Manipulator Arms, Mobile AMR/AGV, Humanoid, Quadruped), dan ruang lingkup Embodied AI.",
      codeSnippets: [{
        id: "robo-snip-1",
        language: "python",
        caption: "robot_component_hierarchy.py",
        code: "robot_spec = {\n    \"name\": \"Velqora Mobile Manipulator\",\n    \"dof\": 6, # Degrees of Freedom\n    \"actuators\": [\"Brushless DC Motor\", \"Harmonic Drive Gearbox\"],\n    \"sensors\": [\"LiDAR 2D\", \"RGB-D Camera Intel RealSense\", \"6-Axis IMU\"],\n    \"payload_kg\": 5.0\n}\n\nprint(f\"Spesifikasi Robot: {robot_spec['name']}\")\nprint(f\"Derajat Kebebasan (DoF): {robot_spec['dof']}\")\nprint(f\"Sensor Terpasang: {', '.join(robot_spec['sensors'])}\")",
      }],
    },
    {
      id: "robo-sec-2",
      title: "BAB 2: Kinematika & Dinamika Robot",
      orderIndex: 2,
      isCompleted: false,
      description: "Kinematika Maju (Forward Kinematics dengan parameter Denavit-Hartenberg DH), Kinematika Mundur (Inverse Kinematics IK), Matriks Jacobian, dan Dinamika Gerak Newton-Euler/Lagrangian.",
      codeSnippets: [{
        id: "robo-snip-2",
        language: "python",
        caption: "forward_kinematics_2link.py",
        code: "import numpy as np\n\ndef forward_kinematics_2d(l1, l2, theta1_deg, theta2_deg):\n    t1 = np.radians(theta1_deg)\n    t2 = np.radians(theta2_deg)\n    x = l1 * np.cos(t1) + l2 * np.cos(t1 + t2)\n    y = l1 * np.sin(t1) + l2 * np.sin(t1 + t2)\n    return x, y\n\n# Panjang link robot (cm) dan sudut sendi (derajat)\nee_x, ee_y = forward_kinematics_2d(l1=20, l2=15, theta1_deg=45, theta2_deg=30)\nprint(f\"Posisi Ujung Robot (End-Effector): X = {ee_x:.2f} cm, Y = {ee_y:.2f} cm\")",
      }],
    },
    {
      id: "robo-sec-3",
      title: "BAB 3: Persepsi Robot",
      orderIndex: 3,
      isCompleted: false,
      description: "Sensor lingkungan robotik (LiDAR Point Cloud, RGB-D Stereo Camera, IMU), computer vision untuk deteksi pose objek (6D Pose Estimation), dan Sensor Fusion (Extended Kalman Filter EKF).",
      codeSnippets: [{
        id: "robo-snip-3",
        language: "python",
        caption: "pointcloud_downsampling_voxel.py",
        code: "import numpy as np\n\n# Simulasi penyaringan point cloud LiDAR dengan Voxel Grid Filter\nraw_points = np.random.randn(1000, 3) # 1000 titik koordinat 3D (X, Y, Z)\nvoxel_size = 0.5\nvoxel_indices = np.floor(raw_points / voxel_size).astype(int)\nunique_voxels = np.unique(voxel_indices, axis=0)\n\nprint(f\"Jumlah Titik Point Cloud Awal: {len(raw_points)}\")\nprint(f\"Jumlah Titik setelah Voxel Grid Filter: {len(unique_voxels)}\")",
      }],
    },
    {
      id: "robo-sec-4",
      title: "BAB 4: Lokalisasi & Pemetaan",
      orderIndex: 4,
      isCompleted: false,
      description: "Simultaneous Localization and Mapping (SLAM: Visual SLAM, LiDAR SLAM), Occupancy Grid Mapping, dan algoritma Path Planning navigasi otonom (A*, Dijkstra, RRT/RRT*).",
      codeSnippets: [{
        id: "robo-snip-4",
        language: "python",
        caption: "astar_grid_path_planning.py",
        code: "import heapq\n\ndef astar_grid(start, goal):\n    # Path planning grid 2D sederhana\n    queue = [(0, start, [start])]\n    visited = set()\n    while queue:\n        cost, curr, path = heapq.heappop(queue)\n        if curr == goal: return path\n        if curr in visited: continue\n        visited.add(curr)\n        x, y = curr\n        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:\n            nxt = (x + dx, y + dy)\n            if 0 <= nxt[0] <= 5 and 0 <= nxt[1] <= 5 and nxt not in visited:\n                heuristic = abs(nxt[0] - goal[0]) + abs(nxt[1] - goal[1])\n                heapq.heappush(queue, (cost + 1 + heuristic, nxt, path + [nxt]))\n    return []\n\npath = astar_grid((0, 0), (3, 3))\nprint(\"Jalur Navigasi A* untuk Robot:\", path)",
      }],
    },
    {
      id: "robo-sec-5",
      title: "BAB 5: Kontrol Robot",
      orderIndex: 5,
      isCompleted: false,
      description: "Sistem kontrol gerak aktuator: Proportional-Integral-Derivative (PID Controller) untuk kontrol posisi/kecepatan sendi, Model Predictive Control (MPC), dan Impedance/Admittance Control.",
      codeSnippets: [{
        id: "robo-snip-5",
        language: "python",
        caption: "pid_motor_controller.py",
        code: "class PIDController:\n    def __init__(self, kp=1.2, ki=0.05, kd=0.1):\n        self.kp, self.ki, self.kd = kp, ki, kd\n        self.prev_error = 0.0\n        self.integral = 0.0\n\n    def compute(self, target, current, dt=0.1):\n        error = target - current\n        self.integral += error * dt\n        derivative = (error - self.prev_error) / dt\n        self.prev_error = error\n        return (self.kp * error) + (self.ki * self.integral) + (self.kd * derivative)\n\npid = PIDController()\nu = pid.compute(target=90.0, current=30.0)\nprint(f\"Sinyal Kontrol Motor PWM (Target 90 Derajat): {u:.2f}\")",
      }],
    },
    {
      id: "robo-sec-6",
      title: "BAB 6: Reinforcement Learning untuk Robotika",
      orderIndex: 6,
      isCompleted: false,
      description: "Robot Learning from Demonstration (LfD / Behavioral Cloning), Reward Shaping untuk manuver kompleks, dan penguatan kebijakan kontrol motor kontinu menggunakan SAC/PPO.",
      codeSnippets: [{
        id: "robo-snip-6",
        language: "python",
        caption: "reward_shaping_robot_reach.py",
        code: "import numpy as np\n\ndef compute_robot_reaching_reward(ee_pos, target_pos, prev_dist, action_effort):\n    curr_dist = np.linalg.norm(ee_pos - target_pos)\n    progress_reward = (prev_dist - curr_dist) * 10.0 # Reward bergerak mendekati target\n    effort_penalty = 0.01 * np.sum(action_effort**2)\n    success_bonus = 50.0 if curr_dist < 0.02 else 0.0\n    return progress_reward - effort_penalty + success_bonus\n\nr = compute_robot_reaching_reward(np.array([0.1, 0.2]), np.array([0.1, 0.25]), 0.1, np.array([0.5, 0.5]))\nprint(f\"Reward Shaping Reaching Task: {r:.4f}\")",
      }],
    },
    {
      id: "robo-sec-7",
      title: "BAB 7: Foundation Model untuk Robotika",
      orderIndex: 7,
      isCompleted: false,
      description: "Vision-Language-Action (VLA) models (RT-1, RT-2, OpenVLA, Octo), model generalis untuk manipulasi robotik otonom berbasis bahasa manusia dan persepsi visual kamera.",
      codeSnippets: [{
        id: "robo-snip-7",
        language: "python",
        caption: "vla_action_token_decoder.py",
        code: "def decode_vla_action_tokens(action_tokens):\n    # VLA memetakan token diskrit ke aksi fisik end-effector (x, y, z, roll, pitch, yaw, gripper)\n    action_vector = {\n        \"delta_x\": (action_tokens[0] - 128) / 100.0,\n        \"delta_y\": (action_tokens[1] - 128) / 100.0,\n        \"delta_z\": (action_tokens[2] - 128) / 100.0,\n        \"gripper_close\": action_tokens[3] > 128\n    }\n    return action_vector\n\ntokens = [135, 120, 110, 200]\nprint(\"Aksi Fisik Robot dari Output VLA Token:\", decode_vla_action_tokens(tokens))",
      }],
    },
    {
      id: "robo-sec-8",
      title: "BAB 8: Embodied AI & Simulasi",
      orderIndex: 8,
      isCompleted: false,
      description: "Filosofi Embodied Cognition (kecerdasan melalui interaksi fisik tubuh agen dengan lingkungan), dan lingkungan simulasi fisika robotik (Isaac Sim, MuJoCo, Gazebo, PyBullet).",
      codeSnippets: [{
        id: "robo-snip-8",
        language: "python",
        caption: "mujoco_simulation_step.py",
        code: "# Simulasi loop fisika robotik\nsim_time = 0.0\ndt = 0.002 # 500 Hz Physics Step\n\nfor step in range(5):\n    sim_time += dt\n    # physics_engine.step()\n    print(f\"Simulasi Waktu Fisika t = {sim_time:.3f}s (Kontrol Gravitasi & Kontak Aktif)\")",
      }],
    },
    {
      id: "robo-sec-9",
      title: "BAB 9: Sim-to-Real Transfer",
      orderIndex: 9,
      isCompleted: false,
      description: "Mengatasi Reality Gap (perbedaan gesekan, latensi, dan pencahayaan dunia nyata): Domain Randomization (fisika, visual), Domain Adaptation, dan kalibrasi sistemik.",
      codeSnippets: [{
        id: "robo-snip-9",
        language: "python",
        caption: "domain_randomization.py",
        code: "import numpy as np\n\ndef sample_randomized_physics():\n    return {\n        \"friction_coefficient\": np.random.uniform(0.4, 1.2),\n        \"link_mass_scale\": np.random.uniform(0.9, 1.1),\n        \"actuator_delay_ms\": np.random.uniform(5.0, 25.0)\n    }\n\nprint(\"Parameter Fisika Acak untuk Sim-to-Real:\")\nprint(sample_randomized_physics())",
      }],
    },
    {
      id: "robo-sec-10",
      title: "BAB 10: Human-Robot Interaction",
      orderIndex: 10,
      isCompleted: false,
      description: "Interaksi Alami Manusia-Robot (HRI): pengenalan gestur tangan, antarmuka suara, shared autonomy (kendali kolaboratif), dan kepatuhan standar keselamatan ISO 10218/TS 15066.",
      codeSnippets: [{
        id: "robo-snip-10",
        language: "python",
        caption: "safety_zone_monitoring.py",
        code: "def check_human_robot_safety(human_distance_meter):\n    if human_distance_meter < 0.5:\n        return \"EMERGENCY STOP (Jarak kritis < 0.5m)\"\n    elif human_distance_meter < 1.5:\n        return \"SLOW DOWN (Mode kolaboratif aman)\"\n    return \"NORMAL SPEED (Jalur bebas aman)\"\n\nfor dist in [2.0, 1.2, 0.3]:\n    print(f\"Jarak Manusia {dist}m -> Status: {check_human_robot_safety(dist)}\")",
      }],
    },
    {
      id: "robo-sec-11",
      title: "BAB 11: Humanoid Robot & Manipulasi Kompleks",
      orderIndex: 11,
      isCompleted: false,
      description: "Desain robot humanoid (bipedal locomotion, Zero Moment Point ZMP, Whole-Body Control) dan manipulasi multi-jari tangan robotik (Dexterous Multi-Fingered Hands).",
      codeSnippets: [{
        id: "robo-snip-11",
        language: "python",
        caption: "zmp_bipedal_balance.py",
        code: "def check_zmp_stability(zmp_x, zmp_y, support_polygon):\n    # Memeriksa apakah Zero Moment Point (ZMP) berada dalam poligon tumpuan kaki\n    x_min, x_max, y_min, y_max = support_polygon\n    is_stable = (x_min <= zmp_x <= x_max) and (y_min <= zmp_y <= y_max)\n    return is_stable\n\nfootprint = (-10, 10, -5, 5) # Batas telapak kaki (cm)\nprint(\"Stabilitas Keseimbangan Bipedal Humanoid:\")\nprint(\"Status ZMP (0, 0):\", \"STABIL\" if check_zmp_stability(0, 0, footprint) else \"JATUH\")\nprint(\"Status ZMP (15, 0):\", \"STABIL\" if check_zmp_stability(15, 0, footprint) else \"JATUH\")",
      }],
    },
    {
      id: "robo-sec-12",
      title: "BAB 12: Keamanan & Etika Robotika",
      orderIndex: 12,
      isCompleted: false,
      description: "Keselamatan fisik robot kolaboratif (Cobots), fail-safe power and force limiting (PFL), etika penggunaan sistem robotik otonom di ruang publik, dan tanggung jawab hukum.",
      codeSnippets: [{
        id: "robo-snip-12",
        language: "python",
        caption: "force_limiting_monitor.py",
        code: "def monitor_contact_force(measured_torque_nm, max_safe_threshold=20.0):\n    if measured_torque_nm > max_safe_threshold:\n        return f\"SAFETY TRIGGERED: Torsi {measured_torque_nm} Nm melampaui batas aman! Hentikan aktuator.\"\n    return \"Operasi dalam batas daya aman.\"\n\nprint(monitor_contact_force(15.2))\nprint(monitor_contact_force(26.8))",
      }],
    },
    {
      id: "robo-sec-13",
      title: "BAB 13: Aplikasi Robotika & Embodied AI",
      orderIndex: 13,
      isCompleted: false,
      description: "Implementasi riil robotik: robot manufaktur cerdas industri 4.0, robot logistik gudang pergudangan otonom, robot bedah presisi medis, dan kendaraan otonom level 4/5.",
      codeSnippets: [{
        id: "robo-snip-13",
        language: "python",
        caption: "autonomous_warehouse_agv.py",
        code: "class WarehouseAGV:\n    def __init__(self, agv_id):\n        self.agv_id = agv_id\n        self.battery = 95\n        self.status = \"IDLE\"\n\n    def assign_order(self, shelf_id, station_id):\n        self.status = f\"MOVING: Mengambil Rak {shelf_id} ke Stasiun {station_id}\"\n        self.battery -= 5\n        return self.status\n\nagv = WarehouseAGV(\"AGV-04\")\nprint(\"Status Awal:\", agv.status)\nprint(agv.assign_order(shelf_id=\"B-12\", station_id=\"PACKING-1\"))\nprint(f\"Sisa Baterai: {agv.battery}%\")",
      }],
    },
  ];
}

export const CURRICULUM_BATCH5_MAP: Record<string, () => ModuleSection[]> = {
  "multimodal-ai": getMultimodalAiSections,
  "multimodal": getMultimodalAiSections,
  "recommendation-system": getRecommendationSystemSections,
  "recommendation": getRecommendationSystemSections,
  "natural-language-processing": getNaturalLanguageProcessingSections,
  "nlp": getNaturalLanguageProcessingSections,
  "reinforcement-learning": getReinforcementLearningSections,
  "reinforcement": getReinforcementLearningSections,
  "robotics-embodied-ai": getRoboticsEmbodiedAiSections,
  "robotics": getRoboticsEmbodiedAiSections,
};

export function getBatch5CurriculumNote(slug: string): { title: string; content_markdown: string; category_name: string } | null {
  const clean = slug.toLowerCase().trim();
  const allGroups = [
    { name: "Multimodal AI", sections: getMultimodalAiSections() },
    { name: "Recommendation System", sections: getRecommendationSystemSections() },
    { name: "Natural Language Processing", sections: getNaturalLanguageProcessingSections() },
    { name: "Reinforcement Learning", sections: getReinforcementLearningSections() },
    { name: "Robotics & Embodied AI", sections: getRoboticsEmbodiedAiSections() },
  ];

  for (const group of allGroups) {
    for (const sec of group.sections) {
      const sSlug = sec.title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
      if (sSlug === clean || clean.includes(sSlug) || sSlug.includes(clean)) {
        const code = sec.codeSnippets?.[0]?.code || '# Contoh kode materi';
        const caption = sec.codeSnippets?.[0]?.caption || 'script.py';
        const codeBlock = String.fromCharCode(96, 96, 96) + 'python\n# ' + caption + '\n' + code + '\n' + String.fromCharCode(96, 96, 96);
        const content = '# ' + sec.title + '\n\n' + sec.description + '\n\n## Konsep Utama\n- Memahami teori dan metodologi fundamental terkait ' + sec.title + '.\n- Penerapan praktis dengan arsitektur modern dan standar industri AI.\n- Analisis performa, kelebihan, dan limitasi teknis implementasi.\n\n## Implementasi Kode Praktikum\n\n' + codeBlock + '\n\n## Rangkuman Materi\nTopik ini memberikan dasar komprehensif bagi praktisi data dan AI dalam menguasai kompetensi sesuai kurikulum standar industri Velqora.';
        return {
          title: sec.title,
          content_markdown: content,
          category_name: group.name,
        };
      }
    }
  }
  return null;
}
