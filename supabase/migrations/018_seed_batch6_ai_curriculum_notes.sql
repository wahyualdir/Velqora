-- Migration 018: Seed Batch 6 AI Curriculum Notes
-- Mencakup 3 Topik Lengkap (Total 35 Bab):
-- 1. Speech & Audio AI (12 Bab)
-- 2. Time Series Forecasting & Anomaly Detection (12 Bab)
-- 3. Vector Database & Retrieval System (11 Bab)
-- Menuntaskan seluruh 28 Modul Kurikulum Kecerdasan Buatan Velqora

DO $$
DECLARE
  v_user_id UUID;
  v_parent_id UUID;
  v_cat_id UUID;
  v_has_user_id BOOLEAN;
  v_has_icon BOOLEAN;
  v_has_parent BOOLEAN;
BEGIN
  -- Dapatkan ID Kategori Induk 'Kecerdasan Buatan' dan User ID-nya
  SELECT id, user_id INTO v_parent_id, v_user_id FROM public.categories WHERE name = 'Kecerdasan Buatan' LIMIT 1;

  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.users ORDER BY created_at ASC LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    SELECT user_id INTO v_user_id FROM public.categories WHERE user_id IS NOT NULL LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    SELECT created_by INTO v_user_id FROM public.notes WHERE created_by IS NOT NULL LIMIT 1;
  END IF;

  -- Periksa kolom pada tabel categories untuk kompatibilitas skema dinamis
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'user_id'
  ) INTO v_has_user_id;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'icon'
  ) INTO v_has_icon;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'parent_id'
  ) INTO v_has_parent;
  ------------------------------------------------------------
  -- BAGIAN 1: SPEECH & AUDIO AI (12 Bab)
  ------------------------------------------------------------
  SELECT id INTO v_cat_id FROM public.categories WHERE name = 'Speech & Audio AI' LIMIT 1;
  IF v_cat_id IS NULL THEN
    v_cat_id := gen_random_uuid();
    IF v_has_user_id THEN
      IF v_has_icon AND v_has_parent THEN
        EXECUTE 'INSERT INTO public.categories (id, user_id, name, icon, parent_id) VALUES ($1, $2, $3, $4, $5)'
        USING v_cat_id, v_user_id, 'Speech & Audio AI', 'speech', v_parent_id;
      ELSIF v_has_icon THEN
        EXECUTE 'INSERT INTO public.categories (id, user_id, name, icon) VALUES ($1, $2, $3, $4)'
        USING v_cat_id, v_user_id, 'Speech & Audio AI', 'speech';
      ELSE
        EXECUTE 'INSERT INTO public.categories (id, user_id, name) VALUES ($1, $2, $3)'
        USING v_cat_id, v_user_id, 'Speech & Audio AI';
      END IF;
    ELSE
      IF v_has_icon AND v_has_parent THEN
        EXECUTE 'INSERT INTO public.categories (id, name, icon, parent_id) VALUES ($1, $2, $3, $4)'
        USING v_cat_id, 'Speech & Audio AI', 'speech', v_parent_id;
      ELSIF v_has_icon THEN
        EXECUTE 'INSERT INTO public.categories (id, name, icon) VALUES ($1, $2, $3)'
        USING v_cat_id, 'Speech & Audio AI', 'speech';
      ELSE
        EXECUTE 'INSERT INTO public.categories (id, name) VALUES ($1, $2)'
        USING v_cat_id, 'Speech & Audio AI';
      END IF;
    END IF;
  END IF;

  -- BAB 1: Dasar Sinyal Audio
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-1-dasar-sinyal-audio',
    'BAB 1: Dasar Sinyal Audio',
    '# BAB 1: Dasar Sinyal Audio

Representasi sinyal audio kontinu dan diskrit: Formasi Waveform 1D, Spectrogram frekuensi-waktu, konsep Sampling Rate (Nyquist-Shannon theorem, 16kHz vs 44.1kHz), Bit Depth (16-bit vs 24-bit), transformasi Fourier (FFT & STFT), komputasi Mel-Frequency Cepstral Coefficients (MFCC) yang memodelkan persepsi koklea manusia, dan Wavelet Transform untuk resolusi multi-skala.

### Implementasi Praktikum: `audio_signal_mfcc.py`
```python
import numpy as np

# 1. Sintesis sinyal audio sinusoidal 440 Hz (Nada A4)
sample_rate = 16000  # 16 kHz
duration = 1.0       # 1 detik
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
waveform = 0.6 * np.sin(2 * np.pi * 440 * t)

# 2. Komputasi STFT (Short-Time Fourier Transform) sederhana
frame_size = 512
hop_size = 256
window = np.hanning(frame_size)
num_frames = (len(waveform) - frame_size) // hop_size + 1

stft_matrix = []
for i in range(num_frames):
    start = i * hop_size
    frame = waveform[start:start + frame_size] * window
    spectrum = np.fft.rfft(frame)
    stft_matrix.append(np.abs(spectrum))

spectrogram = np.array(stft_matrix).T
print("Dimensi Waveform:", waveform.shape)
print("Dimensi Spectrogram (Freq Bins x Frames):", spectrogram.shape)
print(f"Resolusi Frekuensi per Bin: {sample_rate / frame_size:.2f} Hz")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    1,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 2: Preprocessing Audio
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-2-preprocessing-audio',
    'BAB 2: Preprocessing Audio',
    '# BAB 2: Preprocessing Audio

Teknik preprocessing audio tingkat lanjut: Noise Reduction berbasis spectral gating dan Wiener filtering, Voice Activity Detection (VAD) menggunakan energi gelombang & zero-crossing rate untuk segmentasi ujaran aktif, Audio Augmentation (pitch shifting, time stretching, background noise injection, SpecAugment), Feature Extraction (Log-mel filterbanks, Chroma features, Spectral Centroid), serta Acoustic Echo Cancellation (AEC) dan normalisasi volume (EBU R128).

### Implementasi Praktikum: `voice_activity_vad.py`
```python
import numpy as np

def energy_based_vad(signal, frame_len=320, hop_len=160, threshold_factor=1.5):
    # Segmentasi frame dan hitung energi rata-rata
    num_frames = (len(signal) - frame_len) // hop_len + 1
    energies = np.array([
        np.sum(signal[i*hop_len : i*hop_len + frame_len] ** 2) / frame_len
        for i in range(num_frames)
    ])
    baseline_noise_energy = np.percentile(energies, 15)
    threshold = baseline_noise_energy * threshold_factor
    voice_flags = energies > threshold
    return voice_flags, energies

np.random.seed(42)
audio = np.random.randn(16000) * 0.05
audio[4000:10000] += np.sin(np.linspace(0, 50, 6000)) * 0.8  # Segmen bicara

vad_mask, energy_curve = energy_based_vad(audio)
speech_ratio = np.mean(vad_mask) * 100
print(f"Total Frame Analisis: {len(vad_mask)}")
print(f"Deteksi Frame Suara Aktif (VAD): {np.sum(vad_mask)} frame ({speech_ratio:.1f}%)")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    2,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 3: Automatic Speech Recognition (ASR)
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-3-automatic-speech-recognition-asr',
    'BAB 3: Automatic Speech Recognition (ASR)',
    '# BAB 3: Automatic Speech Recognition (ASR)

Evolusi arsitektur Automatic Speech Recognition: Fondasi statistik Hidden Markov Model (HMM) + Gaussian Mixture Models (GMM), era Deep Speech end-to-end, Connectionist Temporal Classification (CTC Loss) untuk alignment tanpa anotasi per-frame, revolusi arsitektur Encoder-Decoder Transformer modern (Whisper, Conformer), serta mekanisme Streaming ASR latensi rendah dan adaptasi multibahasa.

### Implementasi Praktikum: `ctc_greedy_decoder.py`
```python
import numpy as np

def ctc_greedy_decode(logits, vocab, blank_idx=0):
    # Logits: (Time, Num_Classes)
    best_tokens = np.argmax(logits, axis=-1)
    decoded_indices = []
    prev_token = None
    for token in best_tokens:
        if token != blank_idx and token != prev_token:
            decoded_indices.append(token)
        prev_token = token
    return "".join([vocab[idx] for idx in decoded_indices])

vocab_list = ["<blank>", "h", "a", "l", "o", " ", "d", "u", "n", "i"]
# Simulasi output probabilitas emisi ASR 8 langkah waktu
logits_sim = np.random.randn(8, len(vocab_list))
logits_sim[1, 1] = 5.0  # ''h''
logits_sim[2, 1] = 4.0  # duplikat ''h''
logits_sim[3, 2] = 5.5  # ''a''
logits_sim[4, 0] = 6.0  # blank
logits_sim[5, 3] = 4.8  # ''l''
logits_sim[6, 4] = 5.2  # ''o''

transcription = ctc_greedy_decode(logits_sim, vocab_list, blank_idx=0)
print("Hasil CTC Greedy Decoding Transkripsi:", transcription)
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    3,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 4: Text-to-Speech (TTS)
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-4-text-to-speech-tts',
    'BAB 4: Text-to-Speech (TTS)',
    '# BAB 4: Text-to-Speech (TTS)

Sistem sintesis suara modern: Perbandingan Concatenative TTS (penyambungan rekaman unit fosil) vs Parametric TTS (pemodelan statistik HMM), Neural TTS revolusioner 2-tahap (Acoustic model seperti Tacotron 2 / FastSpeech 2 menghasilkan mel-spectrogram, dipadukan dengan Neural Vocoder seperti WaveNet / HiFi-GAN), Zero-Shot Voice Cloning menggunakan speaker conditioning embedding, dan ekspresi emosi prosodi.

### Implementasi Praktikum: `mel_spectral_vocoder_pipeline.py`
```python
import numpy as np

def generate_mel_spectrogram_stub(text_tokens, hidden_dim=80):
    # Simulasi acoustic model (FastSpeech) menghasilkan mel-frames
    seq_len = len(text_tokens) * 8  # ekspansi durasi fonem
    mel_frames = np.sin(np.outer(np.linspace(0, 10, seq_len), np.linspace(1, 4, hidden_dim)))
    return mel_frames

def mock_hifi_gan_vocoder(mel_spectrogram, upsample_factor=256):
    # Neural vocoder mengubah representasi frekuensi menjadi audio waveform 1D
    num_frames, _ = mel_spectrogram.shape
    audio_samples = num_frames * upsample_factor
    synthesized_waveform = np.sin(np.linspace(0, 200, audio_samples)) * 0.7
    return synthesized_waveform

text = "Halo selamat datang di Velqora"
mel = generate_mel_spectrogram_stub(text.split())
audio_out = mock_hifi_gan_vocoder(mel)
print(f"Teks Input: ''{text}''")
print(f"Dimensi Mel-Spectrogram: {mel.shape}")
print(f"Hasil Sintesis Gelombang Audio: {audio_out.shape} sampel (~{len(audio_out)/22050:.2f} detik @ 22kHz)")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    4,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 5: Speaker Recognition & Verification
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-5-speaker-recognition-verification',
    'BAB 5: Speaker Recognition & Verification',
    '# BAB 5: Speaker Recognition & Verification

Biometrik suara tingkat lanjut: Speaker Identification (klasifikasi 1-to-N pembicara), Speaker Verification (autentikasi 1-to-1 menggunakan cosine similarity ambang batas), Speaker Diarization ("siapa berbicara kapan" menggunakan VAD + X-Vectors + Spectral Clustering), representasi embedding suara (i-vector, d-vector, ECAPA-TDNN), dan mitigasi serangan Anti-Spoofing (deteksi deepfake voice & replay attack).

### Implementasi Praktikum: `speaker_verification_cosine.py`
```python
import numpy as np

def speaker_verification(enrolled_embedding, test_embedding, threshold=0.75):
    # Hitung cosine similarity antara speaker embedding
    norm_a = np.linalg.norm(enrolled_embedding)
    norm_b = np.linalg.norm(test_embedding)
    cosine_sim = np.dot(enrolled_embedding, test_embedding) / (norm_a * norm_b)
    is_authenticated = bool(cosine_sim >= threshold)
    return is_authenticated, float(cosine_sim)

# Simulasi embedding ECAPA-TDNN (dimensi 192)
np.random.seed(101)
user_profile_embed = np.random.randn(192)
genuine_attempt = user_profile_embed + np.random.randn(192) * 0.2
impostor_attempt = np.random.randn(192)

auth1, score1 = speaker_verification(user_profile_embed, genuine_attempt)
auth2, score2 = speaker_verification(user_profile_embed, impostor_attempt)

print(f"Percobaan Pengguna Sah -> Skor: {score1:.3f}, Status: {''DITERIMA'' if auth1 else ''DITOLAK''}")
print(f"Percobaan Impostor    -> Skor: {score2:.3f}, Status: {''DITERIMA'' if auth2 else ''DITOLAK''}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'BookOpen',
    5,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 6: Audio Classification & Event Detection
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-6-audio-classification-event-detection',
    'BAB 6: Audio Classification & Event Detection',
    '# BAB 6: Audio Classification & Event Detection

Klasifikasi sinyal audio dan deteksi event: Klasifikasi genre musik dan pengenalan emosi ujaran (Speech Emotion Recognition / SER), Sound Event Detection (SED) dengan lokalisasi temporal (anjing menggonggong, sirene ambulans, pecahan kaca), Music Information Retrieval (MIR: beat tracking, chord recognition, pitch detection), dan Acoustic Scene Classification (ASC) untuk persepsi lingkungan cerdas.

### Implementasi Praktikum: `audio_event_detector.py`
```python
import numpy as np

classes = ["Background", "Sirene Darurat", "Pecahan Kaca", "Percakapan Manusia"]

def frame_level_sound_event_detector(feature_matrix):
    # Simulasi model CRNN (Convolutional Recurrent Neural Network)
    probabilities = np.exp(feature_matrix) / np.sum(np.exp(feature_matrix), axis=-1, keepdims=True)
    predicted_events = []
    for t_idx, prob in enumerate(probabilities):
        top_class = np.argmax(prob)
        if top_class != 0 and prob[top_class] > 0.6:  # filter background
            predicted_events.append((t_idx * 0.5, classes[top_class], float(prob[top_class])))
    return predicted_events

# Simulasi 10 jendela waktu (5 detik)
mock_logits = np.random.randn(10, len(classes))
mock_logits[3:5, 1] += 4.0  # Ada sirene di detik 1.5 - 2.0
mock_logits[7, 2] += 5.0    # Pecahan kaca di detik 3.5

events = frame_level_sound_event_detector(mock_logits)
print("Event Audio Terdeteksi:")
for timestamp, label, conf in events:
    print(f"- Waktu: {timestamp:.1f}s | Event: {label} | Keyakinan: {conf*100:.1f}%")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    6,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 7: Model & Arsitektur Audio Modern
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-7-model-arsitektur-audio-modern',
    'BAB 7: Model & Arsitektur Audio Modern',
    '# BAB 7: Model & Arsitektur Audio Modern

Arsitektur audio deep learning modern: Self-Supervised Audio Representation Learning menggunakan kontrasif mask (Wav2Vec 2.0), representasi klaster diskrit (HuBERT), arsitektur sequence-to-sequence multilingual global (OpenAI Whisper), Audio Spectrogram Transformer (AST) yang mengadaptasi Vision Transformer ke domain spektogram, dan transfer learning representasi audio universal.

### Implementasi Praktikum: `audio_spectrogram_patching.py`
```python
import numpy as np

def extract_spectrogram_patches(spec, patch_h=16, patch_w=16):
    # AST (Audio Spectrogram Transformer): potong spectrogram menjadi patch 2D
    H, W = spec.shape
    assert H % patch_h == 0 and W % patch_w == 0
    patches = []
    for r in range(0, H, patch_h):
        for c in range(0, W, patch_w):
            patch = spec[r:r+patch_h, c:c+patch_w].flatten()
            patches.append(patch)
    return np.array(patches)

spectrogram_dummy = np.random.randn(128, 512)  # 128 Mel bins, 512 frames
patch_tokens = extract_spectrogram_patches(spectrogram_dummy, 16, 16)
print("Dimensi Spektogram Asli:", spectrogram_dummy.shape)
print("Token Patch untuk Audio Transformer:", patch_tokens.shape)
print(f"Jumlah Token Urutan: {patch_tokens.shape[0]}, Dimensi per Token: {patch_tokens.shape[1]}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Layers',
    7,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 8: Voice Conversion & Speech Enhancement
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-8-voice-conversion-speech-enhancement',
    'BAB 8: Voice Conversion & Speech Enhancement',
    '# BAB 8: Voice Conversion & Speech Enhancement

Peningkatan kualitas dan konversi suara: Voice Conversion (mengubah karakteristik timbre suara sumber ke pembicara target tanpa mengubah isi kata), Speech Enhancement berbasis deep learning (menghilangkan background noise ekstrem, isolasi suara vokal), Dereverberation untuk meniadakan gema akustik ruangan tertutup, dan evaluasi PESQ (Perceptual Evaluation of Speech Quality).

### Implementasi Praktikum: `spectral_mask_speech_enhancement.py`
```python
import numpy as np

def ideal_ratio_mask_enhancement(noisy_spectrum, noise_estimate):
    # Menghitung Ideal Ratio Mask (IRM) untuk Speech Enhancement
    speech_power = np.maximum(noisy_spectrum ** 2 - noise_estimate ** 2, 1e-6)
    irm = speech_power / (speech_power + noise_estimate ** 2)
    irm = np.clip(irm, 0.0, 1.0)
    enhanced_spectrum = noisy_spectrum * irm
    return enhanced_spectrum, irm

noisy_mag = np.array([2.5, 4.0, 1.2, 3.8, 0.5])
noise_est = np.array([2.1, 1.0, 1.1, 0.8, 0.4])

enhanced_mag, mask = ideal_ratio_mask_enhancement(noisy_mag, noise_est)
print("Spektrum Bising Asli :", noisy_mag)
print("Mask IRM Terhitung   :", np.round(mask, 3))
print("Spektrum Hasil Bersih:", np.round(enhanced_mag, 3))
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    8,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 9: Generasi Musik & Audio
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-9-generasi-musik-audio',
    'BAB 9: Generasi Musik & Audio',
    '# BAB 9: Generasi Musik & Audio

Pemodelan generatif domain audio & musik: Text-to-Music Generation (MusicGen dari Meta, Suno, Udio), Neural Audio Synthesis berbasis discrete token representation (EnCodec, SoundStream), model autoregressive audio tokens (AudioLM, MusicLM), teknik Conditioning terhadap melodi kontrol dan genre, serta sintesis efek suara (SFX) prosedural untuk game/film.

### Implementasi Praktikum: `residual_vector_quantization.py`
```python
import numpy as np

def mock_residual_vector_quantization(latent_vector, num_codebooks=4):
    # EnCodec RVQ: Kuantisasi bertingkat residual vektor laten audio
    residual = latent_vector.copy()
    quantized_indices = []
    reconstructed = np.zeros_like(latent_vector)
    
    for c in range(num_codebooks):
        # Simulasi pencarian codebook terdekat
        code_idx = int(np.round(np.mean(residual) * 10)) % 1024
        quantized_indices.append(code_idx)
        step_contrib = np.ones_like(latent_vector) * (code_idx / 1024.0)
        reconstructed += step_contrib
        residual -= step_contrib
        
    return quantized_indices, reconstructed

latent_audio = np.array([0.45, 0.82, 0.31, 0.95])
tokens, recon = mock_residual_vector_quantization(latent_audio)
print("Indeks Token Discrete RVQ (4 Tingkat):", tokens)
print("Error Rekonstruksi Laten Audio:", np.linalg.norm(latent_audio - recon))
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    9,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 10: Real-Time & Conversational Audio AI
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-10-real-time-conversational-audio-ai',
    'BAB 10: Real-Time & Conversational Audio AI',
    '# BAB 10: Real-Time & Conversational Audio AI

Arsitektur sistem suara percakapan interaktif berlatensi rendah: Pipeline Speech-to-Speech terintegrasi (Streaming ASR -> Low-Latency LLM Streaming -> Streaming Neural Vocoder TTS), optimasi chunk-based audio streaming via WebSockets / WebRTC, Voice Activity Detection interupsi dinamis (barge-in capability), dan reduksi latensi end-to-end hingga di bawah 300 ms.

### Implementasi Praktikum: `streaming_audio_buffer.py`
```python
import time

class RealTimeAudioPipeline:
    def __init__(self, chunk_duration_ms=100, sample_rate=16000):
        self.chunk_size = int(sample_rate * (chunk_duration_ms / 1000))
        self.sample_rate = sample_rate
        self.buffer = []

    def push_audio_chunk(self, chunk_data):
        self.buffer.extend(chunk_data)
        if len(self.buffer) >= self.chunk_size:
            process_data = self.buffer[:self.chunk_size]
            self.buffer = self.buffer[self.chunk_size:]
            return self._process_streaming_asr(process_data)
        return None

    def _process_streaming_asr(self, chunk):
        # Simulasi inferensi ASR streaming
        return f"ASR-Processed ({len(chunk)} samples)"

pipeline = RealTimeAudioPipeline(chunk_duration_ms=50)
mock_stream = [0.01] * 2000  # 2000 sampel masuk bertahap
result = pipeline.push_audio_chunk(mock_stream)
print("Status Pipeline Real-time:", result)
print(f"Sampel tersisa dalam buffer buffer: {len(pipeline.buffer)}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    10,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 11: Evaluasi Model Speech & Audio
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-11-evaluasi-model-speech-audio',
    'BAB 11: Evaluasi Model Speech & Audio',
    '# BAB 11: Evaluasi Model Speech & Audio

Metrik evaluasi kuantitatif dan kualitatif sistem audio: Word Error Rate (WER: Substitusi, Delesi, Insersi), Character Error Rate (CER) untuk bahasa berkarakter nonsyllabic, Mean Opinion Score (MOS) 1-5 untuk uji persepsi pendengaran manusia, Perceptual Evaluation of Speech Quality (PESQ), Short-Time Objective Intelligibility (STOI), dan benchmark terstandar LibriSpeech & VoxCeleb.

### Implementasi Praktikum: `calculate_wer_metrics.py`
```python
def calculate_wer(reference_words, hypothesis_words):
    # Dynamic Programming Levenshtein Distance untuk WER
    r = reference_words
    h = hypothesis_words
    d = [[0] * (len(h) + 1) for _ in range(len(r) + 1)]
    
    for i in range(len(r) + 1): d[i][0] = i
    for j in range(len(h) + 1): d[0][j] = j
    
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1):
            if r[i - 1] == h[j - 1]:
                d[i][j] = d[i - 1][j - 1]
            else:
                d[i][j] = min(d[i - 1][j] + 1,      # Deletion
                              d[i][j - 1] + 1,      # Insertion
                              d[i - 1][j - 1] + 1)  # Substitution
                              
    errors = d[len(r)][len(h)]
    wer = (errors / len(r)) * 100
    return wer, errors

ref = "kecerdasan buatan untuk pemrosesan sinyal suara".split()
hyp = "kecerdasan buatan untuk proses sinyal suara".split()

wer_score, err_count = calculate_wer(ref, hyp)
print(f"Kalimat Referensi : {'' ''.join(ref)}")
print(f"Kalimat Hipotesis : {'' ''.join(hyp)}")
print(f"Jumlah Kesalahan : {err_count}, Skor Word Error Rate (WER): {wer_score:.2f}%")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    11,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 12: Aplikasi Speech & Audio AI
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-12-aplikasi-speech-audio-ai',
    'BAB 12: Aplikasi Speech & Audio AI',
    '# BAB 12: Aplikasi Speech & Audio AI

Implementasi aplikasi industri berskala nyata: Asisten Suara Pintar enterprise (Siri, Alexa, custom on-premise voice bots), Transkripsi Notulensi Rapat Real-Time dengan diarization otomatis, Speech-to-Speech Translation lintas bahasa, Automasi Call Center (sentiment analysis suara, routing pintar, deteksi fraud), dan Teknologi Aksesibilitas bagi tuna rungu dan disabilitas wicara.

### Implementasi Praktikum: `enterprise_voice_assistant_router.py`
```python
class VoiceAssistantRouter:
    def __init__(self):
        self.routes = {
            "jadwal": self.handle_calendar,
            "analisis": self.handle_analytics,
            "bantuan": self.handle_support
        }

    def route_transcription(self, transcription_text):
        text = transcription_text.lower()
        for keyword, handler in self.routes.items():
            if keyword in text:
                return handler(transcription_text)
        return "Respon Default: Pertanyaan diteruskan ke LLM General Assistant."

    def handle_calendar(self, text):
        return f"Membuka modul Jadwal Kalender untuk permintaan: ''{text}''"

    def handle_analytics(self, text):
        return f"Menjalankan query Analisis Finansial sesuai instruksi: ''{text}''"

    def handle_support(self, text):
        return f"Menghubungkan ke Customer Support Agent untuk isu: ''{text}''"

router = VoiceAssistantRouter()
req = "Tolong periksa jadwal rapat tim hari ini"
print("Input Suara Terekam  :", req)
print("Aksi Otomatis Sistem :", router.route_transcription(req))
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Speech & Audio AI.*',
    'Mic',
    12,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  ------------------------------------------------------------
  -- BAGIAN 2: TIME SERIES FORECASTING & ANOMALY DETECTION (12 Bab)
  ------------------------------------------------------------
  SELECT id INTO v_cat_id FROM public.categories WHERE name = 'Time Series Forecasting & Anomaly Detection' LIMIT 1;
  IF v_cat_id IS NULL THEN
    v_cat_id := gen_random_uuid();
    IF v_has_user_id THEN
      IF v_has_icon AND v_has_parent THEN
        EXECUTE 'INSERT INTO public.categories (id, user_id, name, icon, parent_id) VALUES ($1, $2, $3, $4, $5)'
        USING v_cat_id, v_user_id, 'Time Series Forecasting & Anomaly Detection', 'time_series', v_parent_id;
      ELSIF v_has_icon THEN
        EXECUTE 'INSERT INTO public.categories (id, user_id, name, icon) VALUES ($1, $2, $3, $4)'
        USING v_cat_id, v_user_id, 'Time Series Forecasting & Anomaly Detection', 'time_series';
      ELSE
        EXECUTE 'INSERT INTO public.categories (id, user_id, name) VALUES ($1, $2, $3)'
        USING v_cat_id, v_user_id, 'Time Series Forecasting & Anomaly Detection';
      END IF;
    ELSE
      IF v_has_icon AND v_has_parent THEN
        EXECUTE 'INSERT INTO public.categories (id, name, icon, parent_id) VALUES ($1, $2, $3, $4)'
        USING v_cat_id, 'Time Series Forecasting & Anomaly Detection', 'time_series', v_parent_id;
      ELSIF v_has_icon THEN
        EXECUTE 'INSERT INTO public.categories (id, name, icon) VALUES ($1, $2, $3)'
        USING v_cat_id, 'Time Series Forecasting & Anomaly Detection', 'time_series';
      ELSE
        EXECUTE 'INSERT INTO public.categories (id, name) VALUES ($1, $2)'
        USING v_cat_id, 'Time Series Forecasting & Anomaly Detection';
      END IF;
    END IF;
  END IF;

  -- BAB 1: Konsep Dasar Data Time Series
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-1-konsep-dasar-data-time-series',
    'BAB 1: Konsep Dasar Data Time Series',
    '# BAB 1: Konsep Dasar Data Time Series

Fondasi analitik deret waktu: Karakteristik temporal (urutan sekuensial, autokorelasi, keterikatan waktu), dekomposisi komponen time series klasik (Trend jangka panjang, Seasonality siklus periodik musiman, Cyclical fluktuasi ekonomi makro, dan Irregular Noise residual acak), representasi additive vs multiplicative decomposition, dan lag plots.

### Implementasi Praktikum: `timeseries_decomposition.py`
```python
import numpy as np

# Simulasi data deret waktu dengan Trend + Seasonality + Noise
t = np.linspace(0, 4 * np.pi, 120)
trend = 0.5 * t
seasonality = 2.0 * np.sin(2 * t)
noise = np.random.normal(0, 0.3, len(t))
time_series = trend + seasonality + noise

print(f"Total Observasi Data Time Series: {len(time_series)}")
print(f"Komponen Nilai Rata-rata: {np.mean(time_series):.3f}")
print(f"Varians Noise Teramati  : {np.var(noise):.3f}")
print("5 Titik Data Pertama    :", np.round(time_series[:5], 2))
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    1,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 2: Preprocessing Time Series
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-2-preprocessing-time-series',
    'BAB 2: Preprocessing Time Series',
    '# BAB 2: Preprocessing Time Series

Penanganan data deret waktu mentah: Strategi imputasi missing values tanpa lookahead bias (Forward Fill, Backward Fill, Linear/Spline Interpolation), uji stasioneritas formal (Augmented Dickey-Fuller / ADF test, KPSS test), teknik differencing orde-1 dan seasonal differencing, serta normalisasi adaptif (Rolling Min-Max, Z-score scaling berbasis window historis).

### Implementasi Praktikum: `stationarity_differencing.py`
```python
import numpy as np

def compute_differencing(series, lag=1):
    # Menghitung selisih (differencing) untuk menghilangkan tren (stasionerisasi)
    return np.array([series[i] - series[i - lag] for i in range(lag, len(series))])

raw_data = np.array([100, 103, 107, 112, 118, 125, 133, 142])  # Tren naik kuadratik
diff_1 = compute_differencing(raw_data, lag=1)
diff_2 = compute_differencing(diff_1, lag=1)

print("Data Mentah (Non-Stasioner):", raw_data)
print("Differencing Orde-1         :", diff_1)
print("Differencing Orde-2 (Stabil):", diff_2)
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    2,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 3: Model Statistik untuk Forecasting
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-3-model-statistik-untuk-forecasting',
    'BAB 3: Model Statistik untuk Forecasting',
    '# BAB 3: Model Statistik untuk Forecasting

Model statistik parametrik untuk peramalan: Autoregressive Integrated Moving Average (ARIMA(p,d,q)), Seasonal ARIMA (SARIMA(p,d,q)(P,D,Q)m), metode Exponential Smoothing (Simple, Holt Linear Trend, Holt-Winters Seasonal), dan algoritma Facebook Prophet (pemodelan kurva pertumbuhan piece-wise logistic/linear + seasonal fourier series + efek libur nasional).

### Implementasi Praktikum: `exponential_smoothing_forecast.py`
```python
import numpy as np

def simple_exponential_smoothing(series, alpha=0.3):
    # Formula pemulusan eksponensial: S_t = alpha * Y_t + (1 - alpha) * S_{t-1}
    forecast = [series[0]]
    for t in range(1, len(series)):
        val = alpha * series[t] + (1 - alpha) * forecast[-1]
        forecast.append(val)
    next_step = forecast[-1]
    return np.array(forecast), next_step

sales_history = np.array([120, 135, 128, 142, 150, 148, 160])
smoothed, next_pred = simple_exponential_smoothing(sales_history, alpha=0.4)

print("Data Historis Penjualan :", sales_history)
print("Hasil Pemulusan Model    :", np.round(smoothed, 1))
print(f"Prediksi Periode Berikut : {next_pred:.2f}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    3,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 4: Machine Learning untuk Time Series
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-4-machine-learning-untuk-time-series',
    'BAB 4: Machine Learning untuk Time Series',
    '# BAB 4: Machine Learning untuk Time Series

Transformasi time series menjadi supervised learning: Feature Engineering berbasis jendela geser (Lag features Y_{t-1}, rolling mean/std/min/max, expanding window), ekstraksi fitur kalender (hari dalam minggu, bulan, hari libur), model regresi linier teratur (Ridge, Lasso), dan Gradient Boosting Trees (LightGBM, XGBoost, CatBoost) untuk multi-step recursive & direct forecasting.

### Implementasi Praktikum: `lag_feature_builder.py`
```python
import numpy as np

def create_lagged_dataset(series, n_lags=3):
    X, y = [], []
    for i in range(n_lags, len(series)):
        X.append(series[i - n_lags : i])
        y.append(series[i])
    return np.array(X), np.array(y)

ts_values = np.array([21.0, 22.5, 20.8, 23.1, 24.0, 23.8, 25.2, 26.1])
X_mat, y_vec = create_lagged_dataset(ts_values, n_lags=3)

print("Matriks Fitur Lag (X) [t-3, t-2, t-1]:\n", X_mat)
print("Target Prediksi (y) [t]:", y_vec)
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    4,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 5: Deep Learning untuk Time Series
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-5-deep-learning-untuk-time-series',
    'BAB 5: Deep Learning untuk Time Series',
    '# BAB 5: Deep Learning untuk Time Series

Arsitektur deep learning sekuensial untuk deret waktu: Recurrent Neural Networks (RNN dasar, mitigasi vanishing gradient dengan LSTM & GRU gates), Temporal Convolutional Networks (TCN) dengan causal dilated convolutions dan receptive field eksponensial, serta adaptasi Transformer untuk data numerik kontinu (Informer, Autoformer, PatchTST).

### Implementasi Praktikum: `lstm_cell_simulation.py`
```python
import numpy as np

def mock_lstm_step(x_t, h_prev, c_prev):
    # Simulasi perhitungan gerbang LSTM (Forget, Input, Candidate, Output)
    def sigmoid(x): return 1 / (1 + np.exp(-x))
    
    f_gate = sigmoid(np.dot(x_t, 0.5) + np.dot(h_prev, 0.1))
    i_gate = sigmoid(np.dot(x_t, 0.4) + np.dot(h_prev, 0.2))
    c_tilde = np.tanh(np.dot(x_t, 0.6) + np.dot(h_prev, 0.3))
    c_next = f_gate * c_prev + i_gate * c_tilde
    o_gate = sigmoid(np.dot(x_t, 0.3) + np.dot(h_prev, 0.4))
    h_next = o_gate * np.tanh(c_next)
    return h_next, c_next

h, c = 0.0, 0.0
inputs = [1.2, -0.5, 2.1]
for t_idx, x in enumerate(inputs):
    h, c = mock_lstm_step(x, h, c)
    print(f"Langkah {t_idx+1} | Input: {x:4.1f} | Hidden State: {h:.4f} | Cell State: {c:.4f}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'Brain',
    5,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 6: Foundation Model untuk Time Series
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-6-foundation-model-untuk-time-series',
    'BAB 6: Foundation Model untuk Time Series',
    '# BAB 6: Foundation Model untuk Time Series

Era baru foundation model untuk deret waktu: Model zero-shot pretrained berskala masif (TimeGPT dari Nixtla, Chronos dari Amazon, Lag-Llama, Moment), representasi patch kontinu dan tokenisasi deret angka, transfer learning lintas domain vertikal tanpa perlu pelatihan ulang dari nol, dan fine-tuning efisien berbasis LoRA untuk deret waktu.

### Implementasi Praktikum: `zero_shot_time_series_prompt.py`
```python
import numpy as np

def zero_shot_forecast_stub(context_window, horizon=4):
    # Simulasi estimasi Time Series Foundation Model (Chronos / TimeGPT)
    mean_val = np.mean(context_window)
    slope = (context_window[-1] - context_window[0]) / len(context_window)
    predictions = [context_window[-1] + slope * (i + 1) for i in range(horizon)]
    return np.array(predictions)

context = np.array([45.0, 47.2, 49.0, 52.1, 54.8])
pred_horizon = zero_shot_forecast_stub(context, horizon=3)

print("Konteks Historis Deret Waktu :", context)
print("Hasil Prediksi Zero-Shot (H=3):", np.round(pred_horizon, 2))
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    6,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 7: Probabilistic & Uncertainty Forecasting
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-7-probabilistic-uncertainty-forecasting',
    'BAB 7: Probabilistic & Uncertainty Forecasting',
    '# BAB 7: Probabilistic & Uncertainty Forecasting

Kuantifikasi ketidakpastian dalam peramalan: Prediksi deterministik titik tunggal vs distribusi probabilitas penuh, Prediction Intervals (interval keyakinan 80% & 95%), Quantile Regression (optimasi pinball loss / quantile loss untuk kuantil P10, P50, P90), dan simulasi Monte Carlo untuk proyeksi risiko ekstrem dalam rantai pasok dan portofolio.

### Implementasi Praktikum: `quantile_pinball_loss.py`
```python
import numpy as np

def pinball_loss(y_true, y_pred, quantile=0.9):
    # Kuantile loss: q * e jika e > 0, (q - 1) * e jika e <= 0
    error = y_true - y_pred
    return np.maximum(quantile * error, (quantile - 1) * error)

y_actual = np.array([100.0, 105.0, 98.0])
p90_prediction = np.array([108.0, 104.0, 102.0])

loss_p90 = pinball_loss(y_actual, p90_prediction, quantile=0.9)
print("Nilai Aktual     :", y_actual)
print("Prediksi Kuantil 90% (P90) :", p90_prediction)
print("Rata-rata Pinball Loss P90 :", np.mean(loss_p90))
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    7,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 8: Anomaly Detection
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-8-anomaly-detection',
    'BAB 8: Anomaly Detection',
    '# BAB 8: Anomaly Detection

Deteksi anomali pada deret waktu: Anomali titik (point anomalies), anomali kontekstual (misal lonjakan suhu di musim dingin), dan anomali kolektif (pola abnormal berdurasi panjang). Metode statistik (Z-score, IQR, Rolling MAD), algoritma machine learning (Isolation Forest, One-Class SVM, Local Outlier Factor), dan Deep Learning berbasis Autoencoder rekonstruksi error.

### Implementasi Praktikum: `isolation_anomaly_detector.py`
```python
import numpy as np

def rolling_zscore_anomaly_detector(series, window=5, threshold=2.5):
    anomalies = []
    for i in range(window, len(series)):
        sub = series[i - window : i]
        mean = np.mean(sub)
        std = np.std(sub) + 1e-6
        z_score = abs(series[i] - mean) / std
        if z_score > threshold:
            anomalies.append((i, series[i], z_score))
    return anomalies

data_stream = np.array([10, 11, 10, 12, 11, 10, 11, 58, 10, 11, 12])  # 58 adalah lonjakan outlier
detected = rolling_zscore_anomaly_detector(data_stream, window=4, threshold=3.0)

print(f"Data Aliran: {data_stream}")
print("Anomali Terdeteksi:")
for idx, val, z in detected:
    print(f"- Titik Indeks {idx}: Nilai={val}, Skor Z={z:.2f} (OUTLIER)")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'AlertTriangle',
    8,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 9: Multivariate & Hierarchical Time Series
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-9-multivariate-hierarchical-time-series',
    'BAB 9: Multivariate & Hierarchical Time Series',
    '# BAB 9: Multivariate & Hierarchical Time Series

Pemodelan deret waktu multi-variabel dan struktur hierarkis: Vector Autoregression (VAR) untuk interaksi timbal balik antar sinyal, Spatio-Temporal Graph Neural Networks, dan Hierarchical Forecasting Reconciliation (metode Bottom-Up, Top-Down, Middle-Out, serta optimal MinT / Minimum Trace reconciliation yang menjamin agregasi total konsisten di semua level cabang toko/wilayah).

### Implementasi Praktikum: `hierarchical_bottom_up.py`
```python
import numpy as np

# Rekonsiliasi hierarki penjualan: Total Toko = Produk A + Produk B
sales_product_a = np.array([12, 15, 14, 18])
sales_product_b = np.array([25, 28, 22, 30])

def reconcile_bottom_up(children_series):
    # Bottom-up menjamin konsistensi agregasi level atas
    return np.sum(children_series, axis=0)

reconciled_total = reconcile_bottom_up([sales_product_a, sales_product_b])
print("Prediksi Penjualan Produk A :", sales_product_a)
print("Prediksi Penjualan Produk B :", sales_product_b)
print("Hasil Rekonsiliasi Total Toko:", reconciled_total)
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    9,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 10: Evaluasi Model Time Series
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-10-evaluasi-model-time-series',
    'BAB 10: Evaluasi Model Time Series',
    '# BAB 10: Evaluasi Model Time Series

Strategi validasi dan metrik performa time series: Larangan penggunaan K-Fold silang acak standar untuk menghindari kebocoran masa depan (lookahead bias), teknik Time Series Split (Expanding Window vs Sliding Window Cross-Validation / Purged Backtesting), dan metrik evaluasi komprehensif (MAE, RMSE, MAPE, Symmetric MAPE / SMAPE, dan MASE / Mean Absolute Scaled Error).

### Implementasi Praktikum: `timeseries_backtesting_metrics.py`
```python
import numpy as np

def evaluate_forecast(y_true, y_pred):
    mae = np.mean(np.abs(y_true - y_pred))
    rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))
    mape = np.mean(np.abs((y_true - y_pred) / (y_true + 1e-6))) * 100
    smape = np.mean(2 * np.abs(y_pred - y_true) / (np.abs(y_true) + np.abs(y_pred) + 1e-6)) * 100
    return {"MAE": mae, "RMSE": rmse, "MAPE": mape, "SMAPE": smape}

actuals = np.array([100.0, 110.0, 125.0, 130.0])
forecasts = np.array([102.0, 108.0, 120.0, 135.0])

metrics = evaluate_forecast(actuals, forecasts)
for k, v in metrics.items():
    print(f"Metrik {k:5s}: {v:.2f}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    10,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 11: Deployment Model Forecasting
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-11-deployment-model-forecasting',
    'BAB 11: Deployment Model Forecasting',
    '# BAB 11: Deployment Model Forecasting

Operasionalisasi model peramalan di lingkungan produksi: Pola inferensi Batch Processing vs Real-Time Streaming (Kafka + Flink), penjadwalan retraining otomatis berbasis deteksi Concept Drift temporal (ADWIN, Kolmogorov-Smirnov test), caching prediksi horizon tinggi, pemantauan degradasi performa model seiring perubahan tren musiman.

### Implementasi Praktikum: `drift_monitor_serving.py`
```python
import numpy as np

class TimeSeriesModelMonitor:
    def __init__(self, baseline_mean, baseline_std):
        self.base_mean = baseline_mean
        self.base_std = baseline_std

    def check_drift(self, incoming_batch):
        batch_mean = np.mean(incoming_batch)
        drift_distance = abs(batch_mean - self.base_mean) / (self.base_std + 1e-6)
        needs_retrain = bool(drift_distance > 2.0)
        return {
            "batch_mean": batch_mean,
            "drift_sigma": drift_distance,
            "trigger_retraining": needs_retrain
        }

monitor = TimeSeriesModelMonitor(baseline_mean=100.0, baseline_std=5.0)
normal_batch = [101.2, 99.5, 102.0, 98.8]
shifted_batch = [118.5, 122.0, 116.2, 120.1]

print("Batch Normal :", monitor.check_drift(normal_batch))
print("Batch Shifted:", monitor.check_drift(shifted_batch))
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    11,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 12: Aplikasi Time Series
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-12-aplikasi-time-series',
    'BAB 12: Aplikasi Time Series',
    '# BAB 12: Aplikasi Time Series

Studi kasus implementasi industri: Peramalan Permintaan (Demand Forecasting & Inventory Optimization di e-commerce), Predictive Maintenance & Deteksi Anomali pada Turbin Industri & IoT sensor, Prediksi Finansial (Volatility modelling, Algorithmic Trading, Manajemen Risiko Kredit), dan estimasi konsumsi energi pada Smart Grid.

### Implementasi Praktikum: `smart_grid_load_forecaster.py`
```python
class SmartGridLoadManager:
    def __init__(self, capacity_mw=500.0):
        self.capacity = capacity_mw

    def allocate_power(self, predicted_load_mw, confidence_interval_mw):
        max_expected_load = predicted_load_mw + confidence_interval_mw
        reserve_margin = self.capacity - max_expected_load
        
        status = "NORMAL"
        if reserve_margin < 20.0:
            status = "PERINGATAN: CADANGAN DAYA KRITIS - NYALAKAN GENERATOR CADANGAN"
            
        return {
            "Beban_Prediksi_MW": predicted_load_mw,
            "Beban_Maksimal_Risiko_MW": max_expected_load,
            "Sisa_Kapasitas_MW": reserve_margin,
            "Status_Sistem": status
        }

grid = SmartGridLoadManager(capacity_mw=400.0)
decision = grid.allocate_power(predicted_load_mw=360.0, confidence_interval_mw=25.0)
for key, val in decision.items():
    print(f"- {key}: {val}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Time Series Forecasting & Anomaly Detection.*',
    'TrendingUp',
    12,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  ------------------------------------------------------------
  -- BAGIAN 3: VECTOR DATABASE & RETRIEVAL SYSTEM (11 Bab)
  ------------------------------------------------------------
  SELECT id INTO v_cat_id FROM public.categories WHERE name = 'Vector Database & Retrieval System' LIMIT 1;
  IF v_cat_id IS NULL THEN
    v_cat_id := gen_random_uuid();
    IF v_has_user_id THEN
      IF v_has_icon AND v_has_parent THEN
        EXECUTE 'INSERT INTO public.categories (id, user_id, name, icon, parent_id) VALUES ($1, $2, $3, $4, $5)'
        USING v_cat_id, v_user_id, 'Vector Database & Retrieval System', 'vector_db', v_parent_id;
      ELSIF v_has_icon THEN
        EXECUTE 'INSERT INTO public.categories (id, user_id, name, icon) VALUES ($1, $2, $3, $4)'
        USING v_cat_id, v_user_id, 'Vector Database & Retrieval System', 'vector_db';
      ELSE
        EXECUTE 'INSERT INTO public.categories (id, user_id, name) VALUES ($1, $2, $3)'
        USING v_cat_id, v_user_id, 'Vector Database & Retrieval System';
      END IF;
    ELSE
      IF v_has_icon AND v_has_parent THEN
        EXECUTE 'INSERT INTO public.categories (id, name, icon, parent_id) VALUES ($1, $2, $3, $4)'
        USING v_cat_id, 'Vector Database & Retrieval System', 'vector_db', v_parent_id;
      ELSIF v_has_icon THEN
        EXECUTE 'INSERT INTO public.categories (id, name, icon) VALUES ($1, $2, $3)'
        USING v_cat_id, 'Vector Database & Retrieval System', 'vector_db';
      ELSE
        EXECUTE 'INSERT INTO public.categories (id, name) VALUES ($1, $2)'
        USING v_cat_id, 'Vector Database & Retrieval System';
      END IF;
    END IF;
  END IF;

  -- BAB 1: Konsep Dasar Vector Database
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-1-konsep-dasar-vector-database',
    'BAB 1: Konsep Dasar Vector Database',
    '# BAB 1: Konsep Dasar Vector Database

Revolusi basis data vektor untuk AI: Kebutuhan pencarian semantik tak terstruktur (teks, gambar, audio, graph), perbedaan arsitektur mendasar antara Database Tradisional RDBMS/NoSQL (pencarian exact-match berbasis B-Tree indeks skalar) vs Vector Database (pencarian Approximate Nearest Neighbor / ANN dalam ruang vektor berdimensi tinggi), dan siklus hidup embedding data.

### Implementasi Praktikum: `traditional_vs_vector_search.py`
```python
import numpy as np

# Perbedaan komparatif: Pencarian tepat (Exact Match) vs Kedekatan Vektor (Cosine Sim)
database_records = {
    "doc1": {"text": "belajar machine learning", "vector": np.array([0.9, 0.1, 0.2])},
    "doc2": {"text": "tutorial deep learning", "vector": np.array([0.85, 0.15, 0.25])},
    "doc3": {"text": "resep masakan nusantara", "vector": np.array([0.05, 0.95, 0.1])}
}

query_vector = np.array([0.88, 0.12, 0.18])  # query semantik: "kursus kecerdasan buatan"

print("Pencarian Berdasarkan Cosine Similarity:")
for doc_id, data in database_records.items():
    sim = np.dot(query_vector, data["vector"]) / (np.linalg.norm(query_vector) * np.linalg.norm(data["vector"]))
    print(f"- {doc_id} (''{data[''text'']}''): Kemiripan = {sim:.4f}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Database',
    1,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 2: Representasi Vektor (Embedding)
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-2-representasi-vektor-embedding',
    'BAB 2: Representasi Vektor (Embedding)',
    '# BAB 2: Representasi Vektor (Embedding)

Mekanisme penciptaan embedding: Konsep ruang representasi laten berdimensi tinggi (768, 1536, atau 3072 dimensi), Model Embedding Teks (BERT, OpenAI text-embedding-3, Cohere embed, BGE), Model Embedding Gambar (CLIP ViT, DINOv2), Model Embedding Audio (CLAP), serta normalisasi L2 untuk efisiensi komputasi dot product.

### Implementasi Praktikum: `embedding_l2_normalization.py`
```python
import numpy as np

def l2_normalize(vector):
    norm = np.linalg.norm(vector)
    if norm == 0: return vector
    return vector / norm

raw_embedding = np.array([3.0, 4.0, 0.0, 5.0])
unit_vector = l2_normalize(raw_embedding)

print("Embedding Mentah:", raw_embedding)
print("Norm Sebelum Normalisasi:", np.linalg.norm(raw_embedding))
print("Embedding L2 Normalized:", np.round(unit_vector, 4))
print("Norm Setelah Normalisasi:", np.linalg.norm(unit_vector))
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Sparkles',
    2,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 3: Algoritma Pencarian Kemiripan
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-3-algoritma-pencarian-kemiripan',
    'BAB 3: Algoritma Pencarian Kemiripan',
    '# BAB 3: Algoritma Pencarian Kemiripan

Fondasi metrik jarak dan algoritma pencarian kemiripan: Metrik jarak fundamental (Cosine Similarity, Euclidean Distance / L2 norm, Dot Product / Inner Product, Manhattan Distance), tantangan kutukan dimensi tinggi (Curse of Dimensionality), konsep Approximate Nearest Neighbor (ANN), dan algoritma graf state-of-the-art HNSW (Hierarchical Navigable Small World) dengan navigasi multi-lapisan.

### Implementasi Praktikum: `hnsw_graph_traversal_concept.py`
```python
import numpy as np

def euclidean_distance(v1, v2):
    return np.sqrt(np.sum((v1 - v2) ** 2))

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

vec_a = np.array([1.0, 2.0, 3.0])
vec_b = np.array([1.2, 1.9, 3.1])
vec_c = np.array([-2.0, 0.5, 1.0])

print("Jarak Euclidean A ke B :", round(euclidean_distance(vec_a, vec_b), 4))
print("Cosine Similarity A ke B:", round(cosine_similarity(vec_a, vec_b), 4))
print("Cosine Similarity A ke C:", round(cosine_similarity(vec_a, vec_c), 4))
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Search',
    3,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 4: Indexing pada Vector Database
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-4-indexing-pada-vector-database',
    'BAB 4: Indexing pada Vector Database',
    '# BAB 4: Indexing pada Vector Database

Struktur indexing untuk pencarian vektor berskala miliaran data: Flat Index (pencarian brute-force linear 100% akurasi namun mahal O(N)), Inverted File Index (IVF: partisi ruang ke Voronoi cells menggunakan K-Means clustering), Product Quantization (PQ: kompresi vektor menjadi sub-vektor byte diskrit untuk efisiensi RAM drastis), dan kombinasi IVF-PQ.

### Implementasi Praktikum: `ivf_clustering_concept.py`
```python
import numpy as np

def assign_to_ivf_clusters(vectors, centroids):
    # IVF: Petakan setiap vektor ke centroid Voronoi terdekat
    assignments = {}
    for idx, vec in enumerate(vectors):
        distances = [np.linalg.norm(vec - c) for c in centroids]
        best_cluster = int(np.argmin(distances))
        assignments.setdefault(best_cluster, []).append(idx)
    return assignments

np.random.seed(42)
dataset = np.random.randn(20, 4)
centroids = np.array([[1, 1, 1, 1], [-1, -1, -1, -1]], dtype=float)

clusters = assign_to_ivf_clusters(dataset, centroids)
print("Partisi IVF Centroid Clusters:")
for cluster_id, doc_ids in clusters.items():
    print(f"- Cluster {cluster_id}: Berisi {len(doc_ids)} vektor -> {doc_ids}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Database',
    4,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 5: Hybrid Search & Reranking
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-5-hybrid-search-reranking',
    'BAB 5: Hybrid Search & Reranking',
    '# BAB 5: Hybrid Search & Reranking

Teknik pencarian hibrida modern: Menggabungkan kekuatan Dense Retrieval (pencarian makna semantik mendalam via embeddings) dengan Sparse Retrieval (pencarian kata kunci leksikal presisi tinggi via BM25 / SPLADE), metode fusi peringkat Reciprocal Rank Fusion (RRF), serta Cross-Encoder model Reranking (Cohere Rerank, BGE-Reranker) untuk menyaring dokumen teratas.

### Implementasi Praktikum: `reciprocal_rank_fusion.py`
```python
def reciprocal_rank_fusion(dense_ranks, sparse_ranks, k=60):
    # Formula RRF: Skor = SUM( 1 / (k + rank_i) )
    scores = {}
    for rank, doc in enumerate(dense_ranks):
        scores[doc] = scores.get(doc, 0.0) + (1.0 / (k + rank + 1))
    for rank, doc in enumerate(sparse_ranks):
        scores[doc] = scores.get(doc, 0.0) + (1.0 / (k + rank + 1))
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

dense_results = ["doc_A", "doc_B", "doc_C", "doc_D"]
sparse_results = ["doc_B", "doc_A", "doc_E", "doc_C"]

fused = reciprocal_rank_fusion(dense_results, sparse_results, k=60)
print("Hasil Peringkat Hybrid Search (RRF):")
for rank_idx, (doc_id, score) in enumerate(fused):
    print(f"{rank_idx + 1}. {doc_id} -> Skor RRF: {score:.5f}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Search',
    5,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 6: Platform Vector Database
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-6-platform-vector-database',
    'BAB 6: Platform Vector Database',
    '# BAB 6: Platform Vector Database

Ekosistem dan arsitektur platform vector database modern: Library komputasi in-memory tingkat rendah (FAISS dari Meta), database cloud native terkelola (Pinecone serverless), database open-source fleksibel (Chroma, Weaviate dengan GraphQL & modularitas multi-media, Milvus terdistribusi horizontal), serta ekstensi PostgreSQL pgvector untuk arsitektur terpadu.

### Implementasi Praktikum: `mock_vector_store_crud.py`
```python
class SimpleVectorStore:
    def __init__(self):
        self.storage = {}

    def insert(self, id_str, vector, metadata=None):
        self.storage[id_str] = {"vector": np.array(vector), "metadata": metadata or {}}

    def search(self, query_vec, top_k=2):
        results = []
        q = np.array(query_vec)
        for doc_id, item in self.storage.items():
            sim = np.dot(q, item["vector"]) / (np.linalg.norm(q) * np.linalg.norm(item["vector"]))
            results.append((doc_id, sim, item["metadata"]))
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

v_store = SimpleVectorStore()
v_store.insert("doc_1", [1.0, 0.0, 0.0], {"title": "Pengantar AI"})
v_store.insert("doc_2", [0.0, 1.0, 0.0], {"title": "Masak Nasi Goreng"})
v_store.insert("doc_3", [0.8, 0.2, 0.0], {"title": "Dasar Machine Learning"})

query = [0.9, 0.1, 0.0]
hits = v_store.search(query, top_k=2)
print("Hasil Pencarian Top-2 Vector DB:")
for hid, score, meta in hits:
    print(f"- [{hid}] ''{meta[''title'']}'' | Kemiripan: {score:.4f}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Database',
    6,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 7: Integrasi Vector Database dengan LLM
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-7-integrasi-vector-database-dengan-llm',
    'BAB 7: Integrasi Vector Database dengan LLM',
    '# BAB 7: Integrasi Vector Database dengan LLM

Arsitektur Retrieval-Augmented Generation (RAG): Mengatasi halusinasi model bahasa dengan grounding fakta eksternal, pipeline RAG end-to-end (Document Chunking dinamis, embedding ingestion, vector similarity search, context prompt enrichment, synthesis respon LLM), strategi chunking (fixed-size vs semantic recursive chunking), dan penanganan batas token konteks.

### Implementasi Praktikum: `rag_context_builder.py`
```python
def build_rag_prompt(user_query, retrieved_chunks):
    # Merakit context augmentation untuk prompt LLM
    context_text = "\n\n".join([f"[Konteks {i+1}]: {c}" for i, c in enumerate(retrieved_chunks)])
    prompt = f"""Gunakan konteks berikut untuk menjawab pertanyaan dengan akurat tanpa halusinasi.

KONTEKS TERSEDIA:
{context_text}

PERTANYAAN PENGGUNA:
{user_query}

JAWABAN SISTEM:"""
    return prompt

query = "Bagaimana arsitektur Transformer menangani input sekuensial?"
chunks = [
    "Transformer menggunakan mekanisme Self-Attention untuk memproses semua token secara paralel.",
    "Positional Encoding ditambahkan ke embedding input agar model mengenali urutan posisi kata."
]

prompt_output = build_rag_prompt(query, chunks)
print(prompt_output)
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Database',
    7,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 8: Multimodal Vector Search
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-8-multimodal-vector-search',
    'BAB 8: Multimodal Vector Search',
    '# BAB 8: Multimodal Vector Search

Pencarian kemiripan lintas modalitas data: Pemetaan teks, citra, audio, dan dokumen terstruktur ke dalam satu ruang vektor bersama (Joint Multimodal Embedding Space), query teks untuk mencari gambar/video yang relevan ("image retrieval by text"), query gambar untuk mencari produk serupa dalam e-commerce, dan pencarian audio berbasis humming query.

### Implementasi Praktikum: `cross_modal_retrieval.py`
```python
import numpy as np

# Simulasi Joint Embedding Space (CLIP 4 Dimensi)
image_gallery = {
    "img_kucing.jpg": np.array([0.72, 0.15, 0.65, 0.10]),
    "img_mobil.jpg":   np.array([0.10, 0.90, 0.20, 0.35]),
    "img_pantai.jpg":  np.array([0.30, 0.25, 0.88, 0.20])
}

# Query teks dalam ruang CLIP yang sama: "anak kucing lucu bermain"
text_query_vector = np.array([0.70, 0.18, 0.62, 0.12])

scores = []
for name, img_vec in image_gallery.items():
    sim = np.dot(text_query_vector, img_vec) / (np.linalg.norm(text_query_vector) * np.linalg.norm(img_vec))
    scores.append((name, sim))

scores.sort(key=lambda x: x[1], reverse=True)
print("Hasil Pencarian Gambar Berdasarkan Kueri Teks (CLIP Joint Space):")
for img_name, sim_score in scores:
    print(f"- {img_name}: Skor Kemiripan = {sim_score:.4f}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Database',
    8,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 9: Skalabilitas & Optimasi
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-9-skalabilitas-optimasi',
    'BAB 9: Skalabilitas & Optimasi',
    '# BAB 9: Skalabilitas & Optimasi

Rekayasa performa vector database tingkat produksi: Sharding horizontal (pemisahan partisi data vektor berdasarkan hash kunci atau metadata tenants), replikasi multi-node untuk ketersediaan tinggi (High Availability), strategi caching embedding query panas, dan manajemen trade-off krusial antara Akurasi Pencarian (Recall@K) vs Kecepatan Latensi (QPS) vs Konsumsi Memori RAM.

### Implementasi Praktikum: `vector_sharding_router.py`
```python
import hashlib

class DistributedVectorRouter:
    def __init__(self, shard_nodes):
        self.nodes = shard_nodes

    def get_shard_for_tenant(self, tenant_id):
        # Konsisten hashing untuk sharding multi-tenant
        hash_val = int(hashlib.md5(tenant_id.encode()).hexdigest(), 16)
        selected_shard = self.nodes[hash_val % len(self.nodes)]
        return selected_shard

router = DistributedVectorRouter(["shard_ap_southeast_1", "shard_us_east_1", "shard_eu_central_1"])
clients = ["tenant_fintech_01", "tenant_healthcare_88", "tenant_ecommerce_03"]

for client in clients:
    assigned = router.get_shard_for_tenant(client)
    print(f"Klien: {client} -> Dialokasikan ke Node: {assigned}")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Sliders',
    9,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 10: Keamanan & Privasi Vector Database
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-10-keamanan-privasi-vector-database',
    'BAB 10: Keamanan & Privasi Vector Database',
    '# BAB 10: Keamanan & Privasi Vector Database

Proteksi aset data vektor dan kepatuhan regulasi: Kontrol Akses Berbasis Peran (RBAC) pada level dokumen & koleksi vektor, enkripsi data vektor saat transit (TLS) dan at-rest (AES-256), pencegahan kebocoran data sensitif melalui vektor (Vector Reconstruction Attacks & Inversion), serta kepatuhan GDPR untuk hak penghapusan data embedding.

### Implementasi Praktikum: `metadata_role_filtering.py`
```python
def secure_vector_filter(raw_results, user_role, user_department):
    # Memfilter hasil pencarian vektor berdasarkan hak akses RBAC
    authorized_results = []
    for doc in raw_results:
        required_role = doc["metadata"].get("min_role", "viewer")
        dept = doc["metadata"].get("department", "all")
        
        # Validasi izin departemen dan level peran
        role_levels = {"viewer": 1, "editor": 2, "admin": 3}
        if role_levels.get(user_role, 0) >= role_levels.get(required_role, 1):
            if dept == "all" or dept == user_department:
                authorized_results.append(doc["id"])
    return authorized_results

results = [
    {"id": "doc_publik", "metadata": {"min_role": "viewer", "department": "all"}},
    {"id": "doc_rahasia_finansial", "metadata": {"min_role": "admin", "department": "finance"}},
    {"id": "doc_engineering", "metadata": {"min_role": "editor", "department": "engineering"}}
]

allowed_docs = secure_vector_filter(results, user_role="editor", user_department="engineering")
print("Dokumen yang Boleh Diakses Pengguna (Editor Engineering):", allowed_docs)
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Database',
    10,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

  -- BAB 11: Aplikasi Vector Database
  INSERT INTO public.notes (
    id, category_id, slug, title, content_markdown, icon, order_index, is_folder, created_by, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_cat_id,
    'bab-11-aplikasi-vector-database',
    'BAB 11: Aplikasi Vector Database',
    '# BAB 11: Aplikasi Vector Database

Penerapan skala besar di ekosistem enterprise: Sistem Pencarian Semantik perusahaan pada repositori dokumen knowledge base, Mesin Rekomendasi Berbasis Kemiripan Vektor perilaku pengguna secara real-time, Sistem Deduplikasi Data masif (deteksi plagiarisme dan kesamaan produk duplikat), serta Question Answering pintar terintegrasi.

### Implementasi Praktikum: `vector_deduplication_engine.py`
```python
import numpy as np

def detect_duplicates(new_vector, existing_vectors, similarity_threshold=0.98):
    for doc_id, vec in existing_vectors.items():
        sim = np.dot(new_vector, vec) / (np.linalg.norm(new_vector) * np.linalg.norm(vec))
        if sim >= similarity_threshold:
            return True, doc_id, sim
    return False, None, 0.0

db_vectors = {
    "prod_101": np.array([0.99, 0.12, 0.05]),
    "prod_102": np.array([0.15, 0.88, 0.45])
}

incoming_item = np.array([0.989, 0.122, 0.049])  # Hampir identik dengan prod_101
is_dupe, match_id, score = detect_duplicates(incoming_item, db_vectors)

if is_dupe:
    print(f"Peringatan Duplikasi: Item baru ditolak! Identik dengan ''{match_id}'' (Kemiripan: {score:.5f})")
else:
    print("Item baru unik, disimpan ke dalam basis data.")
```

---
*Catatan kurikulum akademik Velqora — Silabus Resmi Vector Database & Retrieval System.*',
    'Database',
    11,
    false,
    v_user_id,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, public.notes.category_id),
    updated_at = now();

END $$;
