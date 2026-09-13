// Velqora AI Curriculum - Batch 6 Defaults (Expanded 3 Topics: Speech & Audio AI, Time Series Forecasting, Vector Database)
// Generated automatically for Velqora Knowledge System

import { ModuleSection } from "@/types/module-drive";

export function getSpeechAudioAiSections(): ModuleSection[] {
  return [
    {
      id: "speech-sec-1",
      title: "BAB 1: Dasar Sinyal Audio",
      orderIndex: 1,
      isCompleted: false,
      description:
        "Representasi sinyal audio kontinu dan diskrit: Formasi Waveform 1D, Spectrogram frekuensi-waktu, konsep Sampling Rate (Nyquist-Shannon theorem, 16kHz vs 44.1kHz), Bit Depth (16-bit vs 24-bit), transformasi Fourier (FFT & STFT), komputasi Mel-Frequency Cepstral Coefficients (MFCC) yang memodelkan persepsi koklea manusia, dan Wavelet Transform untuk resolusi multi-skala.",
      codeSnippets: [
        {
          id: "speech-sec-1-snip",
          language: "python",
          caption: "audio_signal_mfcc.py",
          code: "import numpy as np\n\n# 1. Sintesis sinyal audio sinusoidal 440 Hz (Nada A4)\nsample_rate = 16000  # 16 kHz\nduration = 1.0       # 1 detik\nt = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)\nwaveform = 0.6 * np.sin(2 * np.pi * 440 * t)\n\n# 2. Komputasi STFT (Short-Time Fourier Transform) sederhana\nframe_size = 512\nhop_size = 256\nwindow = np.hanning(frame_size)\nnum_frames = (len(waveform) - frame_size) // hop_size + 1\n\nstft_matrix = []\nfor i in range(num_frames):\n    start = i * hop_size\n    frame = waveform[start:start + frame_size] * window\n    spectrum = np.fft.rfft(frame)\n    stft_matrix.append(np.abs(spectrum))\n\nspectrogram = np.array(stft_matrix).T\nprint(\"Dimensi Waveform:\", waveform.shape)\nprint(\"Dimensi Spectrogram (Freq Bins x Frames):\", spectrogram.shape)\nprint(f\"Resolusi Frekuensi per Bin: {sample_rate / frame_size:.2f} Hz\")",
        },
      ],
    },
    {
      id: "speech-sec-2",
      title: "BAB 2: Preprocessing Audio",
      orderIndex: 2,
      isCompleted: false,
      description:
        "Teknik preprocessing audio tingkat lanjut: Noise Reduction berbasis spectral gating dan Wiener filtering, Voice Activity Detection (VAD) menggunakan energi gelombang & zero-crossing rate untuk segmentasi ujaran aktif, Audio Augmentation (pitch shifting, time stretching, background noise injection, SpecAugment), Feature Extraction (Log-mel filterbanks, Chroma features, Spectral Centroid), serta Acoustic Echo Cancellation (AEC) dan normalisasi volume (EBU R128).",
      codeSnippets: [
        {
          id: "speech-sec-2-snip",
          language: "python",
          caption: "voice_activity_vad.py",
          code: "import numpy as np\n\ndef energy_based_vad(signal, frame_len=320, hop_len=160, threshold_factor=1.5):\n    # Segmentasi frame dan hitung energi rata-rata\n    num_frames = (len(signal) - frame_len) // hop_len + 1\n    energies = np.array([\n        np.sum(signal[i*hop_len : i*hop_len + frame_len] ** 2) / frame_len\n        for i in range(num_frames)\n    ])\n    baseline_noise_energy = np.percentile(energies, 15)\n    threshold = baseline_noise_energy * threshold_factor\n    voice_flags = energies > threshold\n    return voice_flags, energies\n\nnp.random.seed(42)\naudio = np.random.randn(16000) * 0.05\naudio[4000:10000] += np.sin(np.linspace(0, 50, 6000)) * 0.8  # Segmen bicara\n\nvad_mask, energy_curve = energy_based_vad(audio)\nspeech_ratio = np.mean(vad_mask) * 100\nprint(f\"Total Frame Analisis: {len(vad_mask)}\")\nprint(f\"Deteksi Frame Suara Aktif (VAD): {np.sum(vad_mask)} frame ({speech_ratio:.1f}%)\")",
        },
      ],
    },
    {
      id: "speech-sec-3",
      title: "BAB 3: Automatic Speech Recognition (ASR)",
      orderIndex: 3,
      isCompleted: false,
      description:
        "Evolusi arsitektur Automatic Speech Recognition: Fondasi statistik Hidden Markov Model (HMM) + Gaussian Mixture Models (GMM), era Deep Speech end-to-end, Connectionist Temporal Classification (CTC Loss) untuk alignment tanpa anotasi per-frame, revolusi arsitektur Encoder-Decoder Transformer modern (Whisper, Conformer), serta mekanisme Streaming ASR latensi rendah dan adaptasi multibahasa.",
      codeSnippets: [
        {
          id: "speech-sec-3-snip",
          language: "python",
          caption: "ctc_greedy_decoder.py",
          code: "import numpy as np\n\ndef ctc_greedy_decode(logits, vocab, blank_idx=0):\n    # Logits: (Time, Num_Classes)\n    best_tokens = np.argmax(logits, axis=-1)\n    decoded_indices = []\n    prev_token = None\n    for token in best_tokens:\n        if token != blank_idx and token != prev_token:\n            decoded_indices.append(token)\n        prev_token = token\n    return \"\".join([vocab[idx] for idx in decoded_indices])\n\nvocab_list = [\"<blank>\", \"h\", \"a\", \"l\", \"o\", \" \", \"d\", \"u\", \"n\", \"i\"]\n# Simulasi output probabilitas emisi ASR 8 langkah waktu\nlogits_sim = np.random.randn(8, len(vocab_list))\nlogits_sim[1, 1] = 5.0  # 'h'\nlogits_sim[2, 1] = 4.0  # duplikat 'h'\nlogits_sim[3, 2] = 5.5  # 'a'\nlogits_sim[4, 0] = 6.0  # blank\nlogits_sim[5, 3] = 4.8  # 'l'\nlogits_sim[6, 4] = 5.2  # 'o'\n\ntranscription = ctc_greedy_decode(logits_sim, vocab_list, blank_idx=0)\nprint(\"Hasil CTC Greedy Decoding Transkripsi:\", transcription)",
        },
      ],
    },
    {
      id: "speech-sec-4",
      title: "BAB 4: Text-to-Speech (TTS)",
      orderIndex: 4,
      isCompleted: false,
      description:
        "Sistem sintesis suara modern: Perbandingan Concatenative TTS (penyambungan rekaman unit fosil) vs Parametric TTS (pemodelan statistik HMM), Neural TTS revolusioner 2-tahap (Acoustic model seperti Tacotron 2 / FastSpeech 2 menghasilkan mel-spectrogram, dipadukan dengan Neural Vocoder seperti WaveNet / HiFi-GAN), Zero-Shot Voice Cloning menggunakan speaker conditioning embedding, dan ekspresi emosi prosodi.",
      codeSnippets: [
        {
          id: "speech-sec-4-snip",
          language: "python",
          caption: "mel_spectral_vocoder_pipeline.py",
          code: "import numpy as np\n\ndef generate_mel_spectrogram_stub(text_tokens, hidden_dim=80):\n    # Simulasi acoustic model (FastSpeech) menghasilkan mel-frames\n    seq_len = len(text_tokens) * 8  # ekspansi durasi fonem\n    mel_frames = np.sin(np.outer(np.linspace(0, 10, seq_len), np.linspace(1, 4, hidden_dim)))\n    return mel_frames\n\ndef mock_hifi_gan_vocoder(mel_spectrogram, upsample_factor=256):\n    # Neural vocoder mengubah representasi frekuensi menjadi audio waveform 1D\n    num_frames, _ = mel_spectrogram.shape\n    audio_samples = num_frames * upsample_factor\n    synthesized_waveform = np.sin(np.linspace(0, 200, audio_samples)) * 0.7\n    return synthesized_waveform\n\ntext = \"Halo selamat datang di Velqora\"\nmel = generate_mel_spectrogram_stub(text.split())\naudio_out = mock_hifi_gan_vocoder(mel)\nprint(f\"Teks Input: '{text}'\")\nprint(f\"Dimensi Mel-Spectrogram: {mel.shape}\")\nprint(f\"Hasil Sintesis Gelombang Audio: {audio_out.shape} sampel (~{len(audio_out)/22050:.2f} detik @ 22kHz)\")",
        },
      ],
    },
    {
      id: "speech-sec-5",
      title: "BAB 5: Speaker Recognition & Verification",
      orderIndex: 5,
      isCompleted: false,
      description:
        "Biometrik suara tingkat lanjut: Speaker Identification (klasifikasi 1-to-N pembicara), Speaker Verification (autentikasi 1-to-1 menggunakan cosine similarity ambang batas), Speaker Diarization (\"siapa berbicara kapan\" menggunakan VAD + X-Vectors + Spectral Clustering), representasi embedding suara (i-vector, d-vector, ECAPA-TDNN), dan mitigasi serangan Anti-Spoofing (deteksi deepfake voice & replay attack).",
      codeSnippets: [
        {
          id: "speech-sec-5-snip",
          language: "python",
          caption: "speaker_verification_cosine.py",
          code: "import numpy as np\n\ndef speaker_verification(enrolled_embedding, test_embedding, threshold=0.75):\n    # Hitung cosine similarity antara speaker embedding\n    norm_a = np.linalg.norm(enrolled_embedding)\n    norm_b = np.linalg.norm(test_embedding)\n    cosine_sim = np.dot(enrolled_embedding, test_embedding) / (norm_a * norm_b)\n    is_authenticated = bool(cosine_sim >= threshold)\n    return is_authenticated, float(cosine_sim)\n\n# Simulasi embedding ECAPA-TDNN (dimensi 192)\nnp.random.seed(101)\nuser_profile_embed = np.random.randn(192)\ngenuine_attempt = user_profile_embed + np.random.randn(192) * 0.2\nimpostor_attempt = np.random.randn(192)\n\nauth1, score1 = speaker_verification(user_profile_embed, genuine_attempt)\nauth2, score2 = speaker_verification(user_profile_embed, impostor_attempt)\n\nprint(f\"Percobaan Pengguna Sah -> Skor: {score1:.3f}, Status: {'DITERIMA' if auth1 else 'DITOLAK'}\")\nprint(f\"Percobaan Impostor    -> Skor: {score2:.3f}, Status: {'DITERIMA' if auth2 else 'DITOLAK'}\")",
        },
      ],
    },
    {
      id: "speech-sec-6",
      title: "BAB 6: Audio Classification & Event Detection",
      orderIndex: 6,
      isCompleted: false,
      description:
        "Klasifikasi sinyal audio dan deteksi event: Klasifikasi genre musik dan pengenalan emosi ujaran (Speech Emotion Recognition / SER), Sound Event Detection (SED) dengan lokalisasi temporal (anjing menggonggong, sirene ambulans, pecahan kaca), Music Information Retrieval (MIR: beat tracking, chord recognition, pitch detection), dan Acoustic Scene Classification (ASC) untuk persepsi lingkungan cerdas.",
      codeSnippets: [
        {
          id: "speech-sec-6-snip",
          language: "python",
          caption: "audio_event_detector.py",
          code: "import numpy as np\n\nclasses = [\"Background\", \"Sirene Darurat\", \"Pecahan Kaca\", \"Percakapan Manusia\"]\n\ndef frame_level_sound_event_detector(feature_matrix):\n    # Simulasi model CRNN (Convolutional Recurrent Neural Network)\n    probabilities = np.exp(feature_matrix) / np.sum(np.exp(feature_matrix), axis=-1, keepdims=True)\n    predicted_events = []\n    for t_idx, prob in enumerate(probabilities):\n        top_class = np.argmax(prob)\n        if top_class != 0 and prob[top_class] > 0.6:  # filter background\n            predicted_events.append((t_idx * 0.5, classes[top_class], float(prob[top_class])))\n    return predicted_events\n\n# Simulasi 10 jendela waktu (5 detik)\nmock_logits = np.random.randn(10, len(classes))\nmock_logits[3:5, 1] += 4.0  # Ada sirene di detik 1.5 - 2.0\nmock_logits[7, 2] += 5.0    # Pecahan kaca di detik 3.5\n\nevents = frame_level_sound_event_detector(mock_logits)\nprint(\"Event Audio Terdeteksi:\")\nfor timestamp, label, conf in events:\n    print(f\"- Waktu: {timestamp:.1f}s | Event: {label} | Keyakinan: {conf*100:.1f}%\")",
        },
      ],
    },
    {
      id: "speech-sec-7",
      title: "BAB 7: Model & Arsitektur Audio Modern",
      orderIndex: 7,
      isCompleted: false,
      description:
        "Arsitektur audio deep learning modern: Self-Supervised Audio Representation Learning menggunakan kontrasif mask (Wav2Vec 2.0), representasi klaster diskrit (HuBERT), arsitektur sequence-to-sequence multilingual global (OpenAI Whisper), Audio Spectrogram Transformer (AST) yang mengadaptasi Vision Transformer ke domain spektogram, dan transfer learning representasi audio universal.",
      codeSnippets: [
        {
          id: "speech-sec-7-snip",
          language: "python",
          caption: "audio_spectrogram_patching.py",
          code: "import numpy as np\n\ndef extract_spectrogram_patches(spec, patch_h=16, patch_w=16):\n    # AST (Audio Spectrogram Transformer): potong spectrogram menjadi patch 2D\n    H, W = spec.shape\n    assert H % patch_h == 0 and W % patch_w == 0\n    patches = []\n    for r in range(0, H, patch_h):\n        for c in range(0, W, patch_w):\n            patch = spec[r:r+patch_h, c:c+patch_w].flatten()\n            patches.append(patch)\n    return np.array(patches)\n\nspectrogram_dummy = np.random.randn(128, 512)  # 128 Mel bins, 512 frames\npatch_tokens = extract_spectrogram_patches(spectrogram_dummy, 16, 16)\nprint(\"Dimensi Spektogram Asli:\", spectrogram_dummy.shape)\nprint(\"Token Patch untuk Audio Transformer:\", patch_tokens.shape)\nprint(f\"Jumlah Token Urutan: {patch_tokens.shape[0]}, Dimensi per Token: {patch_tokens.shape[1]}\")",
        },
      ],
    },
    {
      id: "speech-sec-8",
      title: "BAB 8: Voice Conversion & Speech Enhancement",
      orderIndex: 8,
      isCompleted: false,
      description:
        "Peningkatan kualitas dan konversi suara: Voice Conversion (mengubah karakteristik timbre suara sumber ke pembicara target tanpa mengubah isi kata), Speech Enhancement berbasis deep learning (menghilangkan background noise ekstrem, isolasi suara vokal), Dereverberation untuk meniadakan gema akustik ruangan tertutup, dan evaluasi PESQ (Perceptual Evaluation of Speech Quality).",
      codeSnippets: [
        {
          id: "speech-sec-8-snip",
          language: "python",
          caption: "spectral_mask_speech_enhancement.py",
          code: "import numpy as np\n\ndef ideal_ratio_mask_enhancement(noisy_spectrum, noise_estimate):\n    # Menghitung Ideal Ratio Mask (IRM) untuk Speech Enhancement\n    speech_power = np.maximum(noisy_spectrum ** 2 - noise_estimate ** 2, 1e-6)\n    irm = speech_power / (speech_power + noise_estimate ** 2)\n    irm = np.clip(irm, 0.0, 1.0)\n    enhanced_spectrum = noisy_spectrum * irm\n    return enhanced_spectrum, irm\n\nnoisy_mag = np.array([2.5, 4.0, 1.2, 3.8, 0.5])\nnoise_est = np.array([2.1, 1.0, 1.1, 0.8, 0.4])\n\nenhanced_mag, mask = ideal_ratio_mask_enhancement(noisy_mag, noise_est)\nprint(\"Spektrum Bising Asli :\", noisy_mag)\nprint(\"Mask IRM Terhitung   :\", np.round(mask, 3))\nprint(\"Spektrum Hasil Bersih:\", np.round(enhanced_mag, 3))",
        },
      ],
    },
    {
      id: "speech-sec-9",
      title: "BAB 9: Generasi Musik & Audio",
      orderIndex: 9,
      isCompleted: false,
      description:
        "Pemodelan generatif domain audio & musik: Text-to-Music Generation (MusicGen dari Meta, Suno, Udio), Neural Audio Synthesis berbasis discrete token representation (EnCodec, SoundStream), model autoregressive audio tokens (AudioLM, MusicLM), teknik Conditioning terhadap melodi kontrol dan genre, serta sintesis efek suara (SFX) prosedural untuk game/film.",
      codeSnippets: [
        {
          id: "speech-sec-9-snip",
          language: "python",
          caption: "residual_vector_quantization.py",
          code: "import numpy as np\n\ndef mock_residual_vector_quantization(latent_vector, num_codebooks=4):\n    # EnCodec RVQ: Kuantisasi bertingkat residual vektor laten audio\n    residual = latent_vector.copy()\n    quantized_indices = []\n    reconstructed = np.zeros_like(latent_vector)\n    \n    for c in range(num_codebooks):\n        # Simulasi pencarian codebook terdekat\n        code_idx = int(np.round(np.mean(residual) * 10)) % 1024\n        quantized_indices.append(code_idx)\n        step_contrib = np.ones_like(latent_vector) * (code_idx / 1024.0)\n        reconstructed += step_contrib\n        residual -= step_contrib\n        \n    return quantized_indices, reconstructed\n\nlatent_audio = np.array([0.45, 0.82, 0.31, 0.95])\ntokens, recon = mock_residual_vector_quantization(latent_audio)\nprint(\"Indeks Token Discrete RVQ (4 Tingkat):\", tokens)\nprint(\"Error Rekonstruksi Laten Audio:\", np.linalg.norm(latent_audio - recon))",
        },
      ],
    },
    {
      id: "speech-sec-10",
      title: "BAB 10: Real-Time & Conversational Audio AI",
      orderIndex: 10,
      isCompleted: false,
      description:
        "Arsitektur sistem suara percakapan interaktif berlatensi rendah: Pipeline Speech-to-Speech terintegrasi (Streaming ASR -> Low-Latency LLM Streaming -> Streaming Neural Vocoder TTS), optimasi chunk-based audio streaming via WebSockets / WebRTC, Voice Activity Detection interupsi dinamis (barge-in capability), dan reduksi latensi end-to-end hingga di bawah 300 ms.",
      codeSnippets: [
        {
          id: "speech-sec-10-snip",
          language: "python",
          caption: "streaming_audio_buffer.py",
          code: "import time\n\nclass RealTimeAudioPipeline:\n    def __init__(self, chunk_duration_ms=100, sample_rate=16000):\n        self.chunk_size = int(sample_rate * (chunk_duration_ms / 1000))\n        self.sample_rate = sample_rate\n        self.buffer = []\n\n    def push_audio_chunk(self, chunk_data):\n        self.buffer.extend(chunk_data)\n        if len(self.buffer) >= self.chunk_size:\n            process_data = self.buffer[:self.chunk_size]\n            self.buffer = self.buffer[self.chunk_size:]\n            return self._process_streaming_asr(process_data)\n        return None\n\n    def _process_streaming_asr(self, chunk):\n        # Simulasi inferensi ASR streaming\n        return f\"ASR-Processed ({len(chunk)} samples)\"\n\npipeline = RealTimeAudioPipeline(chunk_duration_ms=50)\nmock_stream = [0.01] * 2000  # 2000 sampel masuk bertahap\nresult = pipeline.push_audio_chunk(mock_stream)\nprint(\"Status Pipeline Real-time:\", result)\nprint(f\"Sampel tersisa dalam buffer buffer: {len(pipeline.buffer)}\")",
        },
      ],
    },
    {
      id: "speech-sec-11",
      title: "BAB 11: Evaluasi Model Speech & Audio",
      orderIndex: 11,
      isCompleted: false,
      description:
        "Metrik evaluasi kuantitatif dan kualitatif sistem audio: Word Error Rate (WER: Substitusi, Delesi, Insersi), Character Error Rate (CER) untuk bahasa berkarakter nonsyllabic, Mean Opinion Score (MOS) 1-5 untuk uji persepsi pendengaran manusia, Perceptual Evaluation of Speech Quality (PESQ), Short-Time Objective Intelligibility (STOI), dan benchmark terstandar LibriSpeech & VoxCeleb.",
      codeSnippets: [
        {
          id: "speech-sec-11-snip",
          language: "python",
          caption: "calculate_wer_metrics.py",
          code: "def calculate_wer(reference_words, hypothesis_words):\n    # Dynamic Programming Levenshtein Distance untuk WER\n    r = reference_words\n    h = hypothesis_words\n    d = [[0] * (len(h) + 1) for _ in range(len(r) + 1)]\n    \n    for i in range(len(r) + 1): d[i][0] = i\n    for j in range(len(h) + 1): d[0][j] = j\n    \n    for i in range(1, len(r) + 1):\n        for j in range(1, len(h) + 1):\n            if r[i - 1] == h[j - 1]:\n                d[i][j] = d[i - 1][j - 1]\n            else:\n                d[i][j] = min(d[i - 1][j] + 1,      # Deletion\n                              d[i][j - 1] + 1,      # Insertion\n                              d[i - 1][j - 1] + 1)  # Substitution\n                              \n    errors = d[len(r)][len(h)]\n    wer = (errors / len(r)) * 100\n    return wer, errors\n\nref = \"kecerdasan buatan untuk pemrosesan sinyal suara\".split()\nhyp = \"kecerdasan buatan untuk proses sinyal suara\".split()\n\nwer_score, err_count = calculate_wer(ref, hyp)\nprint(f\"Kalimat Referensi : {' '.join(ref)}\")\nprint(f\"Kalimat Hipotesis : {' '.join(hyp)}\")\nprint(f\"Jumlah Kesalahan : {err_count}, Skor Word Error Rate (WER): {wer_score:.2f}%\")",
        },
      ],
    },
    {
      id: "speech-sec-12",
      title: "BAB 12: Aplikasi Speech & Audio AI",
      orderIndex: 12,
      isCompleted: false,
      description:
        "Implementasi aplikasi industri berskala nyata: Asisten Suara Pintar enterprise (Siri, Alexa, custom on-premise voice bots), Transkripsi Notulensi Rapat Real-Time dengan diarization otomatis, Speech-to-Speech Translation lintas bahasa, Automasi Call Center (sentiment analysis suara, routing pintar, deteksi fraud), dan Teknologi Aksesibilitas bagi tuna rungu dan disabilitas wicara.",
      codeSnippets: [
        {
          id: "speech-sec-12-snip",
          language: "python",
          caption: "enterprise_voice_assistant_router.py",
          code: "class VoiceAssistantRouter:\n    def __init__(self):\n        self.routes = {\n            \"jadwal\": self.handle_calendar,\n            \"analisis\": self.handle_analytics,\n            \"bantuan\": self.handle_support\n        }\n\n    def route_transcription(self, transcription_text):\n        text = transcription_text.lower()\n        for keyword, handler in self.routes.items():\n            if keyword in text:\n                return handler(transcription_text)\n        return \"Respon Default: Pertanyaan diteruskan ke LLM General Assistant.\"\n\n    def handle_calendar(self, text):\n        return f\"Membuka modul Jadwal Kalender untuk permintaan: '{text}'\"\n\n    def handle_analytics(self, text):\n        return f\"Menjalankan query Analisis Finansial sesuai instruksi: '{text}'\"\n\n    def handle_support(self, text):\n        return f\"Menghubungkan ke Customer Support Agent untuk isu: '{text}'\"\n\nrouter = VoiceAssistantRouter()\nreq = \"Tolong periksa jadwal rapat tim hari ini\"\nprint(\"Input Suara Terekam  :\", req)\nprint(\"Aksi Otomatis Sistem :\", router.route_transcription(req))",
        },
      ],
    },
  ];
}

export function getTimeSeriesForecastingSections(): ModuleSection[] {
  return [
    {
      id: "ts-sec-1",
      title: "BAB 1: Konsep Dasar Data Time Series",
      orderIndex: 1,
      isCompleted: false,
      description:
        "Fondasi analitik deret waktu: Karakteristik temporal (urutan sekuensial, autokorelasi, keterikatan waktu), dekomposisi komponen time series klasik (Trend jangka panjang, Seasonality siklus periodik musiman, Cyclical fluktuasi ekonomi makro, dan Irregular Noise residual acak), representasi additive vs multiplicative decomposition, dan lag plots.",
      codeSnippets: [
        {
          id: "ts-sec-1-snip",
          language: "python",
          caption: "timeseries_decomposition.py",
          code: "import numpy as np\n\n# Simulasi data deret waktu dengan Trend + Seasonality + Noise\nt = np.linspace(0, 4 * np.pi, 120)\ntrend = 0.5 * t\nseasonality = 2.0 * np.sin(2 * t)\nnoise = np.random.normal(0, 0.3, len(t))\ntime_series = trend + seasonality + noise\n\nprint(f\"Total Observasi Data Time Series: {len(time_series)}\")\nprint(f\"Komponen Nilai Rata-rata: {np.mean(time_series):.3f}\")\nprint(f\"Varians Noise Teramati  : {np.var(noise):.3f}\")\nprint(\"5 Titik Data Pertama    :\", np.round(time_series[:5], 2))",
        },
      ],
    },
    {
      id: "ts-sec-2",
      title: "BAB 2: Preprocessing Time Series",
      orderIndex: 2,
      isCompleted: false,
      description:
        "Penanganan data deret waktu mentah: Strategi imputasi missing values tanpa lookahead bias (Forward Fill, Backward Fill, Linear/Spline Interpolation), uji stasioneritas formal (Augmented Dickey-Fuller / ADF test, KPSS test), teknik differencing orde-1 dan seasonal differencing, serta normalisasi adaptif (Rolling Min-Max, Z-score scaling berbasis window historis).",
      codeSnippets: [
        {
          id: "ts-sec-2-snip",
          language: "python",
          caption: "stationarity_differencing.py",
          code: "import numpy as np\n\ndef compute_differencing(series, lag=1):\n    # Menghitung selisih (differencing) untuk menghilangkan tren (stasionerisasi)\n    return np.array([series[i] - series[i - lag] for i in range(lag, len(series))])\n\nraw_data = np.array([100, 103, 107, 112, 118, 125, 133, 142])  # Tren naik kuadratik\ndiff_1 = compute_differencing(raw_data, lag=1)\ndiff_2 = compute_differencing(diff_1, lag=1)\n\nprint(\"Data Mentah (Non-Stasioner):\", raw_data)\nprint(\"Differencing Orde-1         :\", diff_1)\nprint(\"Differencing Orde-2 (Stabil):\", diff_2)",
        },
      ],
    },
    {
      id: "ts-sec-3",
      title: "BAB 3: Model Statistik untuk Forecasting",
      orderIndex: 3,
      isCompleted: false,
      description:
        "Model statistik parametrik untuk peramalan: Autoregressive Integrated Moving Average (ARIMA(p,d,q)), Seasonal ARIMA (SARIMA(p,d,q)(P,D,Q)m), metode Exponential Smoothing (Simple, Holt Linear Trend, Holt-Winters Seasonal), dan algoritma Facebook Prophet (pemodelan kurva pertumbuhan piece-wise logistic/linear + seasonal fourier series + efek libur nasional).",
      codeSnippets: [
        {
          id: "ts-sec-3-snip",
          language: "python",
          caption: "exponential_smoothing_forecast.py",
          code: "import numpy as np\n\ndef simple_exponential_smoothing(series, alpha=0.3):\n    # Formula pemulusan eksponensial: S_t = alpha * Y_t + (1 - alpha) * S_{t-1}\n    forecast = [series[0]]\n    for t in range(1, len(series)):\n        val = alpha * series[t] + (1 - alpha) * forecast[-1]\n        forecast.append(val)\n    next_step = forecast[-1]\n    return np.array(forecast), next_step\n\nsales_history = np.array([120, 135, 128, 142, 150, 148, 160])\nsmoothed, next_pred = simple_exponential_smoothing(sales_history, alpha=0.4)\n\nprint(\"Data Historis Penjualan :\", sales_history)\nprint(\"Hasil Pemulusan Model    :\", np.round(smoothed, 1))\nprint(f\"Prediksi Periode Berikut : {next_pred:.2f}\")",
        },
      ],
    },
    {
      id: "ts-sec-4",
      title: "BAB 4: Machine Learning untuk Time Series",
      orderIndex: 4,
      isCompleted: false,
      description:
        "Transformasi time series menjadi supervised learning: Feature Engineering berbasis jendela geser (Lag features Y_{t-1}, rolling mean/std/min/max, expanding window), ekstraksi fitur kalender (hari dalam minggu, bulan, hari libur), model regresi linier teratur (Ridge, Lasso), dan Gradient Boosting Trees (LightGBM, XGBoost, CatBoost) untuk multi-step recursive & direct forecasting.",
      codeSnippets: [
        {
          id: "ts-sec-4-snip",
          language: "python",
          caption: "lag_feature_builder.py",
          code: "import numpy as np\n\ndef create_lagged_dataset(series, n_lags=3):\n    X, y = [], []\n    for i in range(n_lags, len(series)):\n        X.append(series[i - n_lags : i])\n        y.append(series[i])\n    return np.array(X), np.array(y)\n\nts_values = np.array([21.0, 22.5, 20.8, 23.1, 24.0, 23.8, 25.2, 26.1])\nX_mat, y_vec = create_lagged_dataset(ts_values, n_lags=3)\n\nprint(\"Matriks Fitur Lag (X) [t-3, t-2, t-1]:\\n\", X_mat)\nprint(\"Target Prediksi (y) [t]:\", y_vec)",
        },
      ],
    },
    {
      id: "ts-sec-5",
      title: "BAB 5: Deep Learning untuk Time Series",
      orderIndex: 5,
      isCompleted: false,
      description:
        "Arsitektur deep learning sekuensial untuk deret waktu: Recurrent Neural Networks (RNN dasar, mitigasi vanishing gradient dengan LSTM & GRU gates), Temporal Convolutional Networks (TCN) dengan causal dilated convolutions dan receptive field eksponensial, serta adaptasi Transformer untuk data numerik kontinu (Informer, Autoformer, PatchTST).",
      codeSnippets: [
        {
          id: "ts-sec-5-snip",
          language: "python",
          caption: "lstm_cell_simulation.py",
          code: "import numpy as np\n\ndef mock_lstm_step(x_t, h_prev, c_prev):\n    # Simulasi perhitungan gerbang LSTM (Forget, Input, Candidate, Output)\n    def sigmoid(x): return 1 / (1 + np.exp(-x))\n    \n    f_gate = sigmoid(np.dot(x_t, 0.5) + np.dot(h_prev, 0.1))\n    i_gate = sigmoid(np.dot(x_t, 0.4) + np.dot(h_prev, 0.2))\n    c_tilde = np.tanh(np.dot(x_t, 0.6) + np.dot(h_prev, 0.3))\n    c_next = f_gate * c_prev + i_gate * c_tilde\n    o_gate = sigmoid(np.dot(x_t, 0.3) + np.dot(h_prev, 0.4))\n    h_next = o_gate * np.tanh(c_next)\n    return h_next, c_next\n\nh, c = 0.0, 0.0\ninputs = [1.2, -0.5, 2.1]\nfor t_idx, x in enumerate(inputs):\n    h, c = mock_lstm_step(x, h, c)\n    print(f\"Langkah {t_idx+1} | Input: {x:4.1f} | Hidden State: {h:.4f} | Cell State: {c:.4f}\")",
        },
      ],
    },
    {
      id: "ts-sec-6",
      title: "BAB 6: Foundation Model untuk Time Series",
      orderIndex: 6,
      isCompleted: false,
      description:
        "Era baru foundation model untuk deret waktu: Model zero-shot pretrained berskala masif (TimeGPT dari Nixtla, Chronos dari Amazon, Lag-Llama, Moment), representasi patch kontinu dan tokenisasi deret angka, transfer learning lintas domain vertikal tanpa perlu pelatihan ulang dari nol, dan fine-tuning efisien berbasis LoRA untuk deret waktu.",
      codeSnippets: [
        {
          id: "ts-sec-6-snip",
          language: "python",
          caption: "zero_shot_time_series_prompt.py",
          code: "import numpy as np\n\ndef zero_shot_forecast_stub(context_window, horizon=4):\n    # Simulasi estimasi Time Series Foundation Model (Chronos / TimeGPT)\n    mean_val = np.mean(context_window)\n    slope = (context_window[-1] - context_window[0]) / len(context_window)\n    predictions = [context_window[-1] + slope * (i + 1) for i in range(horizon)]\n    return np.array(predictions)\n\ncontext = np.array([45.0, 47.2, 49.0, 52.1, 54.8])\npred_horizon = zero_shot_forecast_stub(context, horizon=3)\n\nprint(\"Konteks Historis Deret Waktu :\", context)\nprint(\"Hasil Prediksi Zero-Shot (H=3):\", np.round(pred_horizon, 2))",
        },
      ],
    },
    {
      id: "ts-sec-7",
      title: "BAB 7: Probabilistic & Uncertainty Forecasting",
      orderIndex: 7,
      isCompleted: false,
      description:
        "Kuantifikasi ketidakpastian dalam peramalan: Prediksi deterministik titik tunggal vs distribusi probabilitas penuh, Prediction Intervals (interval keyakinan 80% & 95%), Quantile Regression (optimasi pinball loss / quantile loss untuk kuantil P10, P50, P90), dan simulasi Monte Carlo untuk proyeksi risiko ekstrem dalam rantai pasok dan portofolio.",
      codeSnippets: [
        {
          id: "ts-sec-7-snip",
          language: "python",
          caption: "quantile_pinball_loss.py",
          code: "import numpy as np\n\ndef pinball_loss(y_true, y_pred, quantile=0.9):\n    # Kuantile loss: q * e jika e > 0, (q - 1) * e jika e <= 0\n    error = y_true - y_pred\n    return np.maximum(quantile * error, (quantile - 1) * error)\n\ny_actual = np.array([100.0, 105.0, 98.0])\np90_prediction = np.array([108.0, 104.0, 102.0])\n\nloss_p90 = pinball_loss(y_actual, p90_prediction, quantile=0.9)\nprint(\"Nilai Aktual     :\", y_actual)\nprint(\"Prediksi Kuantil 90% (P90) :\", p90_prediction)\nprint(\"Rata-rata Pinball Loss P90 :\", np.mean(loss_p90))",
        },
      ],
    },
    {
      id: "ts-sec-8",
      title: "BAB 8: Anomaly Detection",
      orderIndex: 8,
      isCompleted: false,
      description:
        "Deteksi anomali pada deret waktu: Anomali titik (point anomalies), anomali kontekstual (misal lonjakan suhu di musim dingin), dan anomali kolektif (pola abnormal berdurasi panjang). Metode statistik (Z-score, IQR, Rolling MAD), algoritma machine learning (Isolation Forest, One-Class SVM, Local Outlier Factor), dan Deep Learning berbasis Autoencoder rekonstruksi error.",
      codeSnippets: [
        {
          id: "ts-sec-8-snip",
          language: "python",
          caption: "isolation_anomaly_detector.py",
          code: "import numpy as np\n\ndef rolling_zscore_anomaly_detector(series, window=5, threshold=2.5):\n    anomalies = []\n    for i in range(window, len(series)):\n        sub = series[i - window : i]\n        mean = np.mean(sub)\n        std = np.std(sub) + 1e-6\n        z_score = abs(series[i] - mean) / std\n        if z_score > threshold:\n            anomalies.append((i, series[i], z_score))\n    return anomalies\n\ndata_stream = np.array([10, 11, 10, 12, 11, 10, 11, 58, 10, 11, 12])  # 58 adalah lonjakan outlier\ndetected = rolling_zscore_anomaly_detector(data_stream, window=4, threshold=3.0)\n\nprint(f\"Data Aliran: {data_stream}\")\nprint(\"Anomali Terdeteksi:\")\nfor idx, val, z in detected:\n    print(f\"- Titik Indeks {idx}: Nilai={val}, Skor Z={z:.2f} (OUTLIER)\")",
        },
      ],
    },
    {
      id: "ts-sec-9",
      title: "BAB 9: Multivariate & Hierarchical Time Series",
      orderIndex: 9,
      isCompleted: false,
      description:
        "Pemodelan deret waktu multi-variabel dan struktur hierarkis: Vector Autoregression (VAR) untuk interaksi timbal balik antar sinyal, Spatio-Temporal Graph Neural Networks, dan Hierarchical Forecasting Reconciliation (metode Bottom-Up, Top-Down, Middle-Out, serta optimal MinT / Minimum Trace reconciliation yang menjamin agregasi total konsisten di semua level cabang toko/wilayah).",
      codeSnippets: [
        {
          id: "ts-sec-9-snip",
          language: "python",
          caption: "hierarchical_bottom_up.py",
          code: "import numpy as np\n\n# Rekonsiliasi hierarki penjualan: Total Toko = Produk A + Produk B\nsales_product_a = np.array([12, 15, 14, 18])\nsales_product_b = np.array([25, 28, 22, 30])\n\ndef reconcile_bottom_up(children_series):\n    # Bottom-up menjamin konsistensi agregasi level atas\n    return np.sum(children_series, axis=0)\n\nreconciled_total = reconcile_bottom_up([sales_product_a, sales_product_b])\nprint(\"Prediksi Penjualan Produk A :\", sales_product_a)\nprint(\"Prediksi Penjualan Produk B :\", sales_product_b)\nprint(\"Hasil Rekonsiliasi Total Toko:\", reconciled_total)",
        },
      ],
    },
    {
      id: "ts-sec-10",
      title: "BAB 10: Evaluasi Model Time Series",
      orderIndex: 10,
      isCompleted: false,
      description:
        "Strategi validasi dan metrik performa time series: Larangan penggunaan K-Fold silang acak standar untuk menghindari kebocoran masa depan (lookahead bias), teknik Time Series Split (Expanding Window vs Sliding Window Cross-Validation / Purged Backtesting), dan metrik evaluasi komprehensif (MAE, RMSE, MAPE, Symmetric MAPE / SMAPE, dan MASE / Mean Absolute Scaled Error).",
      codeSnippets: [
        {
          id: "ts-sec-10-snip",
          language: "python",
          caption: "timeseries_backtesting_metrics.py",
          code: "import numpy as np\n\ndef evaluate_forecast(y_true, y_pred):\n    mae = np.mean(np.abs(y_true - y_pred))\n    rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))\n    mape = np.mean(np.abs((y_true - y_pred) / (y_true + 1e-6))) * 100\n    smape = np.mean(2 * np.abs(y_pred - y_true) / (np.abs(y_true) + np.abs(y_pred) + 1e-6)) * 100\n    return {\"MAE\": mae, \"RMSE\": rmse, \"MAPE\": mape, \"SMAPE\": smape}\n\nactuals = np.array([100.0, 110.0, 125.0, 130.0])\nforecasts = np.array([102.0, 108.0, 120.0, 135.0])\n\nmetrics = evaluate_forecast(actuals, forecasts)\nfor k, v in metrics.items():\n    print(f\"Metrik {k:5s}: {v:.2f}\")",
        },
      ],
    },
    {
      id: "ts-sec-11",
      title: "BAB 11: Deployment Model Forecasting",
      orderIndex: 11,
      isCompleted: false,
      description:
        "Operasionalisasi model peramalan di lingkungan produksi: Pola inferensi Batch Processing vs Real-Time Streaming (Kafka + Flink), penjadwalan retraining otomatis berbasis deteksi Concept Drift temporal (ADWIN, Kolmogorov-Smirnov test), caching prediksi horizon tinggi, pemantauan degradasi performa model seiring perubahan tren musiman.",
      codeSnippets: [
        {
          id: "ts-sec-11-snip",
          language: "python",
          caption: "drift_monitor_serving.py",
          code: "import numpy as np\n\nclass TimeSeriesModelMonitor:\n    def __init__(self, baseline_mean, baseline_std):\n        self.base_mean = baseline_mean\n        self.base_std = baseline_std\n\n    def check_drift(self, incoming_batch):\n        batch_mean = np.mean(incoming_batch)\n        drift_distance = abs(batch_mean - self.base_mean) / (self.base_std + 1e-6)\n        needs_retrain = bool(drift_distance > 2.0)\n        return {\n            \"batch_mean\": batch_mean,\n            \"drift_sigma\": drift_distance,\n            \"trigger_retraining\": needs_retrain\n        }\n\nmonitor = TimeSeriesModelMonitor(baseline_mean=100.0, baseline_std=5.0)\nnormal_batch = [101.2, 99.5, 102.0, 98.8]\nshifted_batch = [118.5, 122.0, 116.2, 120.1]\n\nprint(\"Batch Normal :\", monitor.check_drift(normal_batch))\nprint(\"Batch Shifted:\", monitor.check_drift(shifted_batch))",
        },
      ],
    },
    {
      id: "ts-sec-12",
      title: "BAB 12: Aplikasi Time Series",
      orderIndex: 12,
      isCompleted: false,
      description:
        "Studi kasus implementasi industri: Peramalan Permintaan (Demand Forecasting & Inventory Optimization di e-commerce), Predictive Maintenance & Deteksi Anomali pada Turbin Industri & IoT sensor, Prediksi Finansial (Volatility modelling, Algorithmic Trading, Manajemen Risiko Kredit), dan estimasi konsumsi energi pada Smart Grid.",
      codeSnippets: [
        {
          id: "ts-sec-12-snip",
          language: "python",
          caption: "smart_grid_load_forecaster.py",
          code: "class SmartGridLoadManager:\n    def __init__(self, capacity_mw=500.0):\n        self.capacity = capacity_mw\n\n    def allocate_power(self, predicted_load_mw, confidence_interval_mw):\n        max_expected_load = predicted_load_mw + confidence_interval_mw\n        reserve_margin = self.capacity - max_expected_load\n        \n        status = \"NORMAL\"\n        if reserve_margin < 20.0:\n            status = \"PERINGATAN: CADANGAN DAYA KRITIS - NYALAKAN GENERATOR CADANGAN\"\n            \n        return {\n            \"Beban_Prediksi_MW\": predicted_load_mw,\n            \"Beban_Maksimal_Risiko_MW\": max_expected_load,\n            \"Sisa_Kapasitas_MW\": reserve_margin,\n            \"Status_Sistem\": status\n        }\n\ngrid = SmartGridLoadManager(capacity_mw=400.0)\ndecision = grid.allocate_power(predicted_load_mw=360.0, confidence_interval_mw=25.0)\nfor key, val in decision.items():\n    print(f\"- {key}: {val}\")",
        },
      ],
    },
  ];
}

export function getVectorDatabaseRetrievalSections(): ModuleSection[] {
  return [
    {
      id: "vdb-sec-1",
      title: "BAB 1: Konsep Dasar Vector Database",
      orderIndex: 1,
      isCompleted: false,
      description:
        "Revolusi basis data vektor untuk AI: Kebutuhan pencarian semantik tak terstruktur (teks, gambar, audio, graph), perbedaan arsitektur mendasar antara Database Tradisional RDBMS/NoSQL (pencarian exact-match berbasis B-Tree indeks skalar) vs Vector Database (pencarian Approximate Nearest Neighbor / ANN dalam ruang vektor berdimensi tinggi), dan siklus hidup embedding data.",
      codeSnippets: [
        {
          id: "vdb-sec-1-snip",
          language: "python",
          caption: "traditional_vs_vector_search.py",
          code: "import numpy as np\n\n# Perbedaan komparatif: Pencarian tepat (Exact Match) vs Kedekatan Vektor (Cosine Sim)\ndatabase_records = {\n    \"doc1\": {\"text\": \"belajar machine learning\", \"vector\": np.array([0.9, 0.1, 0.2])},\n    \"doc2\": {\"text\": \"tutorial deep learning\", \"vector\": np.array([0.85, 0.15, 0.25])},\n    \"doc3\": {\"text\": \"resep masakan nusantara\", \"vector\": np.array([0.05, 0.95, 0.1])}\n}\n\nquery_vector = np.array([0.88, 0.12, 0.18])  # query semantik: \"kursus kecerdasan buatan\"\n\nprint(\"Pencarian Berdasarkan Cosine Similarity:\")\nfor doc_id, data in database_records.items():\n    sim = np.dot(query_vector, data[\"vector\"]) / (np.linalg.norm(query_vector) * np.linalg.norm(data[\"vector\"]))\n    print(f\"- {doc_id} ('{data['text']}'): Kemiripan = {sim:.4f}\")",
        },
      ],
    },
    {
      id: "vdb-sec-2",
      title: "BAB 2: Representasi Vektor (Embedding)",
      orderIndex: 2,
      isCompleted: false,
      description:
        "Mekanisme penciptaan embedding: Konsep ruang representasi laten berdimensi tinggi (768, 1536, atau 3072 dimensi), Model Embedding Teks (BERT, OpenAI text-embedding-3, Cohere embed, BGE), Model Embedding Gambar (CLIP ViT, DINOv2), Model Embedding Audio (CLAP), serta normalisasi L2 untuk efisiensi komputasi dot product.",
      codeSnippets: [
        {
          id: "vdb-sec-2-snip",
          language: "python",
          caption: "embedding_l2_normalization.py",
          code: "import numpy as np\n\ndef l2_normalize(vector):\n    norm = np.linalg.norm(vector)\n    if norm == 0: return vector\n    return vector / norm\n\nraw_embedding = np.array([3.0, 4.0, 0.0, 5.0])\nunit_vector = l2_normalize(raw_embedding)\n\nprint(\"Embedding Mentah:\", raw_embedding)\nprint(\"Norm Sebelum Normalisasi:\", np.linalg.norm(raw_embedding))\nprint(\"Embedding L2 Normalized:\", np.round(unit_vector, 4))\nprint(\"Norm Setelah Normalisasi:\", np.linalg.norm(unit_vector))",
        },
      ],
    },
    {
      id: "vdb-sec-3",
      title: "BAB 3: Algoritma Pencarian Kemiripan",
      orderIndex: 3,
      isCompleted: false,
      description:
        "Fondasi metrik jarak dan algoritma pencarian kemiripan: Metrik jarak fundamental (Cosine Similarity, Euclidean Distance / L2 norm, Dot Product / Inner Product, Manhattan Distance), tantangan kutukan dimensi tinggi (Curse of Dimensionality), konsep Approximate Nearest Neighbor (ANN), dan algoritma graf state-of-the-art HNSW (Hierarchical Navigable Small World) dengan navigasi multi-lapisan.",
      codeSnippets: [
        {
          id: "vdb-sec-3-snip",
          language: "python",
          caption: "hnsw_graph_traversal_concept.py",
          code: "import numpy as np\n\ndef euclidean_distance(v1, v2):\n    return np.sqrt(np.sum((v1 - v2) ** 2))\n\ndef cosine_similarity(v1, v2):\n    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))\n\nvec_a = np.array([1.0, 2.0, 3.0])\nvec_b = np.array([1.2, 1.9, 3.1])\nvec_c = np.array([-2.0, 0.5, 1.0])\n\nprint(\"Jarak Euclidean A ke B :\", round(euclidean_distance(vec_a, vec_b), 4))\nprint(\"Cosine Similarity A ke B:\", round(cosine_similarity(vec_a, vec_b), 4))\nprint(\"Cosine Similarity A ke C:\", round(cosine_similarity(vec_a, vec_c), 4))",
        },
      ],
    },
    {
      id: "vdb-sec-4",
      title: "BAB 4: Indexing pada Vector Database",
      orderIndex: 4,
      isCompleted: false,
      description:
        "Struktur indexing untuk pencarian vektor berskala miliaran data: Flat Index (pencarian brute-force linear 100% akurasi namun mahal O(N)), Inverted File Index (IVF: partisi ruang ke Voronoi cells menggunakan K-Means clustering), Product Quantization (PQ: kompresi vektor menjadi sub-vektor byte diskrit untuk efisiensi RAM drastis), dan kombinasi IVF-PQ.",
      codeSnippets: [
        {
          id: "vdb-sec-4-snip",
          language: "python",
          caption: "ivf_clustering_concept.py",
          code: "import numpy as np\n\ndef assign_to_ivf_clusters(vectors, centroids):\n    # IVF: Petakan setiap vektor ke centroid Voronoi terdekat\n    assignments = {}\n    for idx, vec in enumerate(vectors):\n        distances = [np.linalg.norm(vec - c) for c in centroids]\n        best_cluster = int(np.argmin(distances))\n        assignments.setdefault(best_cluster, []).append(idx)\n    return assignments\n\nnp.random.seed(42)\ndataset = np.random.randn(20, 4)\ncentroids = np.array([[1, 1, 1, 1], [-1, -1, -1, -1]], dtype=float)\n\nclusters = assign_to_ivf_clusters(dataset, centroids)\nprint(\"Partisi IVF Centroid Clusters:\")\nfor cluster_id, doc_ids in clusters.items():\n    print(f\"- Cluster {cluster_id}: Berisi {len(doc_ids)} vektor -> {doc_ids}\")",
        },
      ],
    },
    {
      id: "vdb-sec-5",
      title: "BAB 5: Hybrid Search & Reranking",
      orderIndex: 5,
      isCompleted: false,
      description:
        "Teknik pencarian hibrida modern: Menggabungkan kekuatan Dense Retrieval (pencarian makna semantik mendalam via embeddings) dengan Sparse Retrieval (pencarian kata kunci leksikal presisi tinggi via BM25 / SPLADE), metode fusi peringkat Reciprocal Rank Fusion (RRF), serta Cross-Encoder model Reranking (Cohere Rerank, BGE-Reranker) untuk menyaring dokumen teratas.",
      codeSnippets: [
        {
          id: "vdb-sec-5-snip",
          language: "python",
          caption: "reciprocal_rank_fusion.py",
          code: "def reciprocal_rank_fusion(dense_ranks, sparse_ranks, k=60):\n    # Formula RRF: Skor = SUM( 1 / (k + rank_i) )\n    scores = {}\n    for rank, doc in enumerate(dense_ranks):\n        scores[doc] = scores.get(doc, 0.0) + (1.0 / (k + rank + 1))\n    for rank, doc in enumerate(sparse_ranks):\n        scores[doc] = scores.get(doc, 0.0) + (1.0 / (k + rank + 1))\n    return sorted(scores.items(), key=lambda x: x[1], reverse=True)\n\ndense_results = [\"doc_A\", \"doc_B\", \"doc_C\", \"doc_D\"]\nsparse_results = [\"doc_B\", \"doc_A\", \"doc_E\", \"doc_C\"]\n\nfused = reciprocal_rank_fusion(dense_results, sparse_results, k=60)\nprint(\"Hasil Peringkat Hybrid Search (RRF):\")\nfor rank_idx, (doc_id, score) in enumerate(fused):\n    print(f\"{rank_idx + 1}. {doc_id} -> Skor RRF: {score:.5f}\")",
        },
      ],
    },
    {
      id: "vdb-sec-6",
      title: "BAB 6: Platform Vector Database",
      orderIndex: 6,
      isCompleted: false,
      description:
        "Ekosistem dan arsitektur platform vector database modern: Library komputasi in-memory tingkat rendah (FAISS dari Meta), database cloud native terkelola (Pinecone serverless), database open-source fleksibel (Chroma, Weaviate dengan GraphQL & modularitas multi-media, Milvus terdistribusi horizontal), serta ekstensi PostgreSQL pgvector untuk arsitektur terpadu.",
      codeSnippets: [
        {
          id: "vdb-sec-6-snip",
          language: "python",
          caption: "mock_vector_store_crud.py",
          code: "class SimpleVectorStore:\n    def __init__(self):\n        self.storage = {}\n\n    def insert(self, id_str, vector, metadata=None):\n        self.storage[id_str] = {\"vector\": np.array(vector), \"metadata\": metadata or {}}\n\n    def search(self, query_vec, top_k=2):\n        results = []\n        q = np.array(query_vec)\n        for doc_id, item in self.storage.items():\n            sim = np.dot(q, item[\"vector\"]) / (np.linalg.norm(q) * np.linalg.norm(item[\"vector\"]))\n            results.append((doc_id, sim, item[\"metadata\"]))\n        results.sort(key=lambda x: x[1], reverse=True)\n        return results[:top_k]\n\nv_store = SimpleVectorStore()\nv_store.insert(\"doc_1\", [1.0, 0.0, 0.0], {\"title\": \"Pengantar AI\"})\nv_store.insert(\"doc_2\", [0.0, 1.0, 0.0], {\"title\": \"Masak Nasi Goreng\"})\nv_store.insert(\"doc_3\", [0.8, 0.2, 0.0], {\"title\": \"Dasar Machine Learning\"})\n\nquery = [0.9, 0.1, 0.0]\nhits = v_store.search(query, top_k=2)\nprint(\"Hasil Pencarian Top-2 Vector DB:\")\nfor hid, score, meta in hits:\n    print(f\"- [{hid}] '{meta['title']}' | Kemiripan: {score:.4f}\")",
        },
      ],
    },
    {
      id: "vdb-sec-7",
      title: "BAB 7: Integrasi Vector Database dengan LLM",
      orderIndex: 7,
      isCompleted: false,
      description:
        "Arsitektur Retrieval-Augmented Generation (RAG): Mengatasi halusinasi model bahasa dengan grounding fakta eksternal, pipeline RAG end-to-end (Document Chunking dinamis, embedding ingestion, vector similarity search, context prompt enrichment, synthesis respon LLM), strategi chunking (fixed-size vs semantic recursive chunking), dan penanganan batas token konteks.",
      codeSnippets: [
        {
          id: "vdb-sec-7-snip",
          language: "python",
          caption: "rag_context_builder.py",
          code: "def build_rag_prompt(user_query, retrieved_chunks):\n    # Merakit context augmentation untuk prompt LLM\n    context_text = \"\\n\\n\".join([f\"[Konteks {i+1}]: {c}\" for i, c in enumerate(retrieved_chunks)])\n    prompt = f\"\"\"Gunakan konteks berikut untuk menjawab pertanyaan dengan akurat tanpa halusinasi.\n\nKONTEKS TERSEDIA:\n{context_text}\n\nPERTANYAAN PENGGUNA:\n{user_query}\n\nJAWABAN SISTEM:\"\"\"\n    return prompt\n\nquery = \"Bagaimana arsitektur Transformer menangani input sekuensial?\"\nchunks = [\n    \"Transformer menggunakan mekanisme Self-Attention untuk memproses semua token secara paralel.\",\n    \"Positional Encoding ditambahkan ke embedding input agar model mengenali urutan posisi kata.\"\n]\n\nprompt_output = build_rag_prompt(query, chunks)\nprint(prompt_output)",
        },
      ],
    },
    {
      id: "vdb-sec-8",
      title: "BAB 8: Multimodal Vector Search",
      orderIndex: 8,
      isCompleted: false,
      description:
        "Pencarian kemiripan lintas modalitas data: Pemetaan teks, citra, audio, dan dokumen terstruktur ke dalam satu ruang vektor bersama (Joint Multimodal Embedding Space), query teks untuk mencari gambar/video yang relevan (\"image retrieval by text\"), query gambar untuk mencari produk serupa dalam e-commerce, dan pencarian audio berbasis humming query.",
      codeSnippets: [
        {
          id: "vdb-sec-8-snip",
          language: "python",
          caption: "cross_modal_retrieval.py",
          code: "import numpy as np\n\n# Simulasi Joint Embedding Space (CLIP 4 Dimensi)\nimage_gallery = {\n    \"img_kucing.jpg\": np.array([0.72, 0.15, 0.65, 0.10]),\n    \"img_mobil.jpg\":   np.array([0.10, 0.90, 0.20, 0.35]),\n    \"img_pantai.jpg\":  np.array([0.30, 0.25, 0.88, 0.20])\n}\n\n# Query teks dalam ruang CLIP yang sama: \"anak kucing lucu bermain\"\ntext_query_vector = np.array([0.70, 0.18, 0.62, 0.12])\n\nscores = []\nfor name, img_vec in image_gallery.items():\n    sim = np.dot(text_query_vector, img_vec) / (np.linalg.norm(text_query_vector) * np.linalg.norm(img_vec))\n    scores.append((name, sim))\n\nscores.sort(key=lambda x: x[1], reverse=True)\nprint(\"Hasil Pencarian Gambar Berdasarkan Kueri Teks (CLIP Joint Space):\")\nfor img_name, sim_score in scores:\n    print(f\"- {img_name}: Skor Kemiripan = {sim_score:.4f}\")",
        },
      ],
    },
    {
      id: "vdb-sec-9",
      title: "BAB 9: Skalabilitas & Optimasi",
      orderIndex: 9,
      isCompleted: false,
      description:
        "Rekayasa performa vector database tingkat produksi: Sharding horizontal (pemisahan partisi data vektor berdasarkan hash kunci atau metadata tenants), replikasi multi-node untuk ketersediaan tinggi (High Availability), strategi caching embedding query panas, dan manajemen trade-off krusial antara Akurasi Pencarian (Recall@K) vs Kecepatan Latensi (QPS) vs Konsumsi Memori RAM.",
      codeSnippets: [
        {
          id: "vdb-sec-9-snip",
          language: "python",
          caption: "vector_sharding_router.py",
          code: "import hashlib\n\nclass DistributedVectorRouter:\n    def __init__(self, shard_nodes):\n        self.nodes = shard_nodes\n\n    def get_shard_for_tenant(self, tenant_id):\n        # Konsisten hashing untuk sharding multi-tenant\n        hash_val = int(hashlib.md5(tenant_id.encode()).hexdigest(), 16)\n        selected_shard = self.nodes[hash_val % len(self.nodes)]\n        return selected_shard\n\nrouter = DistributedVectorRouter([\"shard_ap_southeast_1\", \"shard_us_east_1\", \"shard_eu_central_1\"])\nclients = [\"tenant_fintech_01\", \"tenant_healthcare_88\", \"tenant_ecommerce_03\"]\n\nfor client in clients:\n    assigned = router.get_shard_for_tenant(client)\n    print(f\"Klien: {client} -> Dialokasikan ke Node: {assigned}\")",
        },
      ],
    },
    {
      id: "vdb-sec-10",
      title: "BAB 10: Keamanan & Privasi Vector Database",
      orderIndex: 10,
      isCompleted: false,
      description:
        "Proteksi aset data vektor dan kepatuhan regulasi: Kontrol Akses Berbasis Peran (RBAC) pada level dokumen & koleksi vektor, enkripsi data vektor saat transit (TLS) dan at-rest (AES-256), pencegahan kebocoran data sensitif melalui vektor (Vector Reconstruction Attacks & Inversion), serta kepatuhan GDPR untuk hak penghapusan data embedding.",
      codeSnippets: [
        {
          id: "vdb-sec-10-snip",
          language: "python",
          caption: "metadata_role_filtering.py",
          code: "def secure_vector_filter(raw_results, user_role, user_department):\n    # Memfilter hasil pencarian vektor berdasarkan hak akses RBAC\n    authorized_results = []\n    for doc in raw_results:\n        required_role = doc[\"metadata\"].get(\"min_role\", \"viewer\")\n        dept = doc[\"metadata\"].get(\"department\", \"all\")\n        \n        # Validasi izin departemen dan level peran\n        role_levels = {\"viewer\": 1, \"editor\": 2, \"admin\": 3}\n        if role_levels.get(user_role, 0) >= role_levels.get(required_role, 1):\n            if dept == \"all\" or dept == user_department:\n                authorized_results.append(doc[\"id\"])\n    return authorized_results\n\nresults = [\n    {\"id\": \"doc_publik\", \"metadata\": {\"min_role\": \"viewer\", \"department\": \"all\"}},\n    {\"id\": \"doc_rahasia_finansial\", \"metadata\": {\"min_role\": \"admin\", \"department\": \"finance\"}},\n    {\"id\": \"doc_engineering\", \"metadata\": {\"min_role\": \"editor\", \"department\": \"engineering\"}}\n]\n\nallowed_docs = secure_vector_filter(results, user_role=\"editor\", user_department=\"engineering\")\nprint(\"Dokumen yang Boleh Diakses Pengguna (Editor Engineering):\", allowed_docs)",
        },
      ],
    },
    {
      id: "vdb-sec-11",
      title: "BAB 11: Aplikasi Vector Database",
      orderIndex: 11,
      isCompleted: false,
      description:
        "Penerapan skala besar di ekosistem enterprise: Sistem Pencarian Semantik perusahaan pada repositori dokumen knowledge base, Mesin Rekomendasi Berbasis Kemiripan Vektor perilaku pengguna secara real-time, Sistem Deduplikasi Data masif (deteksi plagiarisme dan kesamaan produk duplikat), serta Question Answering pintar terintegrasi.",
      codeSnippets: [
        {
          id: "vdb-sec-11-snip",
          language: "python",
          caption: "vector_deduplication_engine.py",
          code: "import numpy as np\n\ndef detect_duplicates(new_vector, existing_vectors, similarity_threshold=0.98):\n    for doc_id, vec in existing_vectors.items():\n        sim = np.dot(new_vector, vec) / (np.linalg.norm(new_vector) * np.linalg.norm(vec))\n        if sim >= similarity_threshold:\n            return True, doc_id, sim\n    return False, None, 0.0\n\ndb_vectors = {\n    \"prod_101\": np.array([0.99, 0.12, 0.05]),\n    \"prod_102\": np.array([0.15, 0.88, 0.45])\n}\n\nincoming_item = np.array([0.989, 0.122, 0.049])  # Hampir identik dengan prod_101\nis_dupe, match_id, score = detect_duplicates(incoming_item, db_vectors)\n\nif is_dupe:\n    print(f\"Peringatan Duplikasi: Item baru ditolak! Identik dengan '{match_id}' (Kemiripan: {score:.5f})\")\nelse:\n    print(\"Item baru unik, disimpan ke dalam basis data.\")",
        },
      ],
    },
  ];
}

export const getSpeechAudioAISections = getSpeechAudioAiSections;
export const getTimeSeriesForecastingAnomalyDetectionSections = getTimeSeriesForecastingSections;
export const getVectorDatabaseRetrievalSystemSections = getVectorDatabaseRetrievalSections;

export function getBatch6CurriculumNote(slug: string): { title: string; category: string; description: string; code: string; caption: string } | null {
  const cleanSlug = slug.toLowerCase().trim();
  if (cleanSlug === "bab-1-dasar-sinyal-audio" || cleanSlug === "speech-sec-1") {
    return {
      title: "BAB 1: Dasar Sinyal Audio",
      category: "Speech & Audio AI",
      description: "Representasi sinyal audio kontinu dan diskrit: Formasi Waveform 1D, Spectrogram frekuensi-waktu, konsep Sampling Rate (Nyquist-Shannon theorem, 16kHz vs 44.1kHz), Bit Depth (16-bit vs 24-bit), transformasi Fourier (FFT & STFT), komputasi Mel-Frequency Cepstral Coefficients (MFCC) yang memodelkan persepsi koklea manusia, dan Wavelet Transform untuk resolusi multi-skala.",
      code: "import numpy as np\n\n# 1. Sintesis sinyal audio sinusoidal 440 Hz (Nada A4)\nsample_rate = 16000  # 16 kHz\nduration = 1.0       # 1 detik\nt = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)\nwaveform = 0.6 * np.sin(2 * np.pi * 440 * t)\n\n# 2. Komputasi STFT (Short-Time Fourier Transform) sederhana\nframe_size = 512\nhop_size = 256\nwindow = np.hanning(frame_size)\nnum_frames = (len(waveform) - frame_size) // hop_size + 1\n\nstft_matrix = []\nfor i in range(num_frames):\n    start = i * hop_size\n    frame = waveform[start:start + frame_size] * window\n    spectrum = np.fft.rfft(frame)\n    stft_matrix.append(np.abs(spectrum))\n\nspectrogram = np.array(stft_matrix).T\nprint(\"Dimensi Waveform:\", waveform.shape)\nprint(\"Dimensi Spectrogram (Freq Bins x Frames):\", spectrogram.shape)\nprint(f\"Resolusi Frekuensi per Bin: {sample_rate / frame_size:.2f} Hz\")",
      caption: "audio_signal_mfcc.py",
    };
  }
  if (cleanSlug === "bab-2-preprocessing-audio" || cleanSlug === "speech-sec-2") {
    return {
      title: "BAB 2: Preprocessing Audio",
      category: "Speech & Audio AI",
      description: "Teknik preprocessing audio tingkat lanjut: Noise Reduction berbasis spectral gating dan Wiener filtering, Voice Activity Detection (VAD) menggunakan energi gelombang & zero-crossing rate untuk segmentasi ujaran aktif, Audio Augmentation (pitch shifting, time stretching, background noise injection, SpecAugment), Feature Extraction (Log-mel filterbanks, Chroma features, Spectral Centroid), serta Acoustic Echo Cancellation (AEC) dan normalisasi volume (EBU R128).",
      code: "import numpy as np\n\ndef energy_based_vad(signal, frame_len=320, hop_len=160, threshold_factor=1.5):\n    # Segmentasi frame dan hitung energi rata-rata\n    num_frames = (len(signal) - frame_len) // hop_len + 1\n    energies = np.array([\n        np.sum(signal[i*hop_len : i*hop_len + frame_len] ** 2) / frame_len\n        for i in range(num_frames)\n    ])\n    baseline_noise_energy = np.percentile(energies, 15)\n    threshold = baseline_noise_energy * threshold_factor\n    voice_flags = energies > threshold\n    return voice_flags, energies\n\nnp.random.seed(42)\naudio = np.random.randn(16000) * 0.05\naudio[4000:10000] += np.sin(np.linspace(0, 50, 6000)) * 0.8  # Segmen bicara\n\nvad_mask, energy_curve = energy_based_vad(audio)\nspeech_ratio = np.mean(vad_mask) * 100\nprint(f\"Total Frame Analisis: {len(vad_mask)}\")\nprint(f\"Deteksi Frame Suara Aktif (VAD): {np.sum(vad_mask)} frame ({speech_ratio:.1f}%)\")",
      caption: "voice_activity_vad.py",
    };
  }
  if (cleanSlug === "bab-3-automatic-speech-recognition-asr" || cleanSlug === "speech-sec-3") {
    return {
      title: "BAB 3: Automatic Speech Recognition (ASR)",
      category: "Speech & Audio AI",
      description: "Evolusi arsitektur Automatic Speech Recognition: Fondasi statistik Hidden Markov Model (HMM) + Gaussian Mixture Models (GMM), era Deep Speech end-to-end, Connectionist Temporal Classification (CTC Loss) untuk alignment tanpa anotasi per-frame, revolusi arsitektur Encoder-Decoder Transformer modern (Whisper, Conformer), serta mekanisme Streaming ASR latensi rendah dan adaptasi multibahasa.",
      code: "import numpy as np\n\ndef ctc_greedy_decode(logits, vocab, blank_idx=0):\n    # Logits: (Time, Num_Classes)\n    best_tokens = np.argmax(logits, axis=-1)\n    decoded_indices = []\n    prev_token = None\n    for token in best_tokens:\n        if token != blank_idx and token != prev_token:\n            decoded_indices.append(token)\n        prev_token = token\n    return \"\".join([vocab[idx] for idx in decoded_indices])\n\nvocab_list = [\"<blank>\", \"h\", \"a\", \"l\", \"o\", \" \", \"d\", \"u\", \"n\", \"i\"]\n# Simulasi output probabilitas emisi ASR 8 langkah waktu\nlogits_sim = np.random.randn(8, len(vocab_list))\nlogits_sim[1, 1] = 5.0  # 'h'\nlogits_sim[2, 1] = 4.0  # duplikat 'h'\nlogits_sim[3, 2] = 5.5  # 'a'\nlogits_sim[4, 0] = 6.0  # blank\nlogits_sim[5, 3] = 4.8  # 'l'\nlogits_sim[6, 4] = 5.2  # 'o'\n\ntranscription = ctc_greedy_decode(logits_sim, vocab_list, blank_idx=0)\nprint(\"Hasil CTC Greedy Decoding Transkripsi:\", transcription)",
      caption: "ctc_greedy_decoder.py",
    };
  }
  if (cleanSlug === "bab-4-text-to-speech-tts" || cleanSlug === "speech-sec-4") {
    return {
      title: "BAB 4: Text-to-Speech (TTS)",
      category: "Speech & Audio AI",
      description: "Sistem sintesis suara modern: Perbandingan Concatenative TTS (penyambungan rekaman unit fosil) vs Parametric TTS (pemodelan statistik HMM), Neural TTS revolusioner 2-tahap (Acoustic model seperti Tacotron 2 / FastSpeech 2 menghasilkan mel-spectrogram, dipadukan dengan Neural Vocoder seperti WaveNet / HiFi-GAN), Zero-Shot Voice Cloning menggunakan speaker conditioning embedding, dan ekspresi emosi prosodi.",
      code: "import numpy as np\n\ndef generate_mel_spectrogram_stub(text_tokens, hidden_dim=80):\n    # Simulasi acoustic model (FastSpeech) menghasilkan mel-frames\n    seq_len = len(text_tokens) * 8  # ekspansi durasi fonem\n    mel_frames = np.sin(np.outer(np.linspace(0, 10, seq_len), np.linspace(1, 4, hidden_dim)))\n    return mel_frames\n\ndef mock_hifi_gan_vocoder(mel_spectrogram, upsample_factor=256):\n    # Neural vocoder mengubah representasi frekuensi menjadi audio waveform 1D\n    num_frames, _ = mel_spectrogram.shape\n    audio_samples = num_frames * upsample_factor\n    synthesized_waveform = np.sin(np.linspace(0, 200, audio_samples)) * 0.7\n    return synthesized_waveform\n\ntext = \"Halo selamat datang di Velqora\"\nmel = generate_mel_spectrogram_stub(text.split())\naudio_out = mock_hifi_gan_vocoder(mel)\nprint(f\"Teks Input: '{text}'\")\nprint(f\"Dimensi Mel-Spectrogram: {mel.shape}\")\nprint(f\"Hasil Sintesis Gelombang Audio: {audio_out.shape} sampel (~{len(audio_out)/22050:.2f} detik @ 22kHz)\")",
      caption: "mel_spectral_vocoder_pipeline.py",
    };
  }
  if (cleanSlug === "bab-5-speaker-recognition-verification" || cleanSlug === "speech-sec-5") {
    return {
      title: "BAB 5: Speaker Recognition & Verification",
      category: "Speech & Audio AI",
      description: "Biometrik suara tingkat lanjut: Speaker Identification (klasifikasi 1-to-N pembicara), Speaker Verification (autentikasi 1-to-1 menggunakan cosine similarity ambang batas), Speaker Diarization (\"siapa berbicara kapan\" menggunakan VAD + X-Vectors + Spectral Clustering), representasi embedding suara (i-vector, d-vector, ECAPA-TDNN), dan mitigasi serangan Anti-Spoofing (deteksi deepfake voice & replay attack).",
      code: "import numpy as np\n\ndef speaker_verification(enrolled_embedding, test_embedding, threshold=0.75):\n    # Hitung cosine similarity antara speaker embedding\n    norm_a = np.linalg.norm(enrolled_embedding)\n    norm_b = np.linalg.norm(test_embedding)\n    cosine_sim = np.dot(enrolled_embedding, test_embedding) / (norm_a * norm_b)\n    is_authenticated = bool(cosine_sim >= threshold)\n    return is_authenticated, float(cosine_sim)\n\n# Simulasi embedding ECAPA-TDNN (dimensi 192)\nnp.random.seed(101)\nuser_profile_embed = np.random.randn(192)\ngenuine_attempt = user_profile_embed + np.random.randn(192) * 0.2\nimpostor_attempt = np.random.randn(192)\n\nauth1, score1 = speaker_verification(user_profile_embed, genuine_attempt)\nauth2, score2 = speaker_verification(user_profile_embed, impostor_attempt)\n\nprint(f\"Percobaan Pengguna Sah -> Skor: {score1:.3f}, Status: {'DITERIMA' if auth1 else 'DITOLAK'}\")\nprint(f\"Percobaan Impostor    -> Skor: {score2:.3f}, Status: {'DITERIMA' if auth2 else 'DITOLAK'}\")",
      caption: "speaker_verification_cosine.py",
    };
  }
  if (cleanSlug === "bab-6-audio-classification-event-detection" || cleanSlug === "speech-sec-6") {
    return {
      title: "BAB 6: Audio Classification & Event Detection",
      category: "Speech & Audio AI",
      description: "Klasifikasi sinyal audio dan deteksi event: Klasifikasi genre musik dan pengenalan emosi ujaran (Speech Emotion Recognition / SER), Sound Event Detection (SED) dengan lokalisasi temporal (anjing menggonggong, sirene ambulans, pecahan kaca), Music Information Retrieval (MIR: beat tracking, chord recognition, pitch detection), dan Acoustic Scene Classification (ASC) untuk persepsi lingkungan cerdas.",
      code: "import numpy as np\n\nclasses = [\"Background\", \"Sirene Darurat\", \"Pecahan Kaca\", \"Percakapan Manusia\"]\n\ndef frame_level_sound_event_detector(feature_matrix):\n    # Simulasi model CRNN (Convolutional Recurrent Neural Network)\n    probabilities = np.exp(feature_matrix) / np.sum(np.exp(feature_matrix), axis=-1, keepdims=True)\n    predicted_events = []\n    for t_idx, prob in enumerate(probabilities):\n        top_class = np.argmax(prob)\n        if top_class != 0 and prob[top_class] > 0.6:  # filter background\n            predicted_events.append((t_idx * 0.5, classes[top_class], float(prob[top_class])))\n    return predicted_events\n\n# Simulasi 10 jendela waktu (5 detik)\nmock_logits = np.random.randn(10, len(classes))\nmock_logits[3:5, 1] += 4.0  # Ada sirene di detik 1.5 - 2.0\nmock_logits[7, 2] += 5.0    # Pecahan kaca di detik 3.5\n\nevents = frame_level_sound_event_detector(mock_logits)\nprint(\"Event Audio Terdeteksi:\")\nfor timestamp, label, conf in events:\n    print(f\"- Waktu: {timestamp:.1f}s | Event: {label} | Keyakinan: {conf*100:.1f}%\")",
      caption: "audio_event_detector.py",
    };
  }
  if (cleanSlug === "bab-7-model-arsitektur-audio-modern" || cleanSlug === "speech-sec-7") {
    return {
      title: "BAB 7: Model & Arsitektur Audio Modern",
      category: "Speech & Audio AI",
      description: "Arsitektur audio deep learning modern: Self-Supervised Audio Representation Learning menggunakan kontrasif mask (Wav2Vec 2.0), representasi klaster diskrit (HuBERT), arsitektur sequence-to-sequence multilingual global (OpenAI Whisper), Audio Spectrogram Transformer (AST) yang mengadaptasi Vision Transformer ke domain spektogram, dan transfer learning representasi audio universal.",
      code: "import numpy as np\n\ndef extract_spectrogram_patches(spec, patch_h=16, patch_w=16):\n    # AST (Audio Spectrogram Transformer): potong spectrogram menjadi patch 2D\n    H, W = spec.shape\n    assert H % patch_h == 0 and W % patch_w == 0\n    patches = []\n    for r in range(0, H, patch_h):\n        for c in range(0, W, patch_w):\n            patch = spec[r:r+patch_h, c:c+patch_w].flatten()\n            patches.append(patch)\n    return np.array(patches)\n\nspectrogram_dummy = np.random.randn(128, 512)  # 128 Mel bins, 512 frames\npatch_tokens = extract_spectrogram_patches(spectrogram_dummy, 16, 16)\nprint(\"Dimensi Spektogram Asli:\", spectrogram_dummy.shape)\nprint(\"Token Patch untuk Audio Transformer:\", patch_tokens.shape)\nprint(f\"Jumlah Token Urutan: {patch_tokens.shape[0]}, Dimensi per Token: {patch_tokens.shape[1]}\")",
      caption: "audio_spectrogram_patching.py",
    };
  }
  if (cleanSlug === "bab-8-voice-conversion-speech-enhancement" || cleanSlug === "speech-sec-8") {
    return {
      title: "BAB 8: Voice Conversion & Speech Enhancement",
      category: "Speech & Audio AI",
      description: "Peningkatan kualitas dan konversi suara: Voice Conversion (mengubah karakteristik timbre suara sumber ke pembicara target tanpa mengubah isi kata), Speech Enhancement berbasis deep learning (menghilangkan background noise ekstrem, isolasi suara vokal), Dereverberation untuk meniadakan gema akustik ruangan tertutup, dan evaluasi PESQ (Perceptual Evaluation of Speech Quality).",
      code: "import numpy as np\n\ndef ideal_ratio_mask_enhancement(noisy_spectrum, noise_estimate):\n    # Menghitung Ideal Ratio Mask (IRM) untuk Speech Enhancement\n    speech_power = np.maximum(noisy_spectrum ** 2 - noise_estimate ** 2, 1e-6)\n    irm = speech_power / (speech_power + noise_estimate ** 2)\n    irm = np.clip(irm, 0.0, 1.0)\n    enhanced_spectrum = noisy_spectrum * irm\n    return enhanced_spectrum, irm\n\nnoisy_mag = np.array([2.5, 4.0, 1.2, 3.8, 0.5])\nnoise_est = np.array([2.1, 1.0, 1.1, 0.8, 0.4])\n\nenhanced_mag, mask = ideal_ratio_mask_enhancement(noisy_mag, noise_est)\nprint(\"Spektrum Bising Asli :\", noisy_mag)\nprint(\"Mask IRM Terhitung   :\", np.round(mask, 3))\nprint(\"Spektrum Hasil Bersih:\", np.round(enhanced_mag, 3))",
      caption: "spectral_mask_speech_enhancement.py",
    };
  }
  if (cleanSlug === "bab-9-generasi-musik-audio" || cleanSlug === "speech-sec-9") {
    return {
      title: "BAB 9: Generasi Musik & Audio",
      category: "Speech & Audio AI",
      description: "Pemodelan generatif domain audio & musik: Text-to-Music Generation (MusicGen dari Meta, Suno, Udio), Neural Audio Synthesis berbasis discrete token representation (EnCodec, SoundStream), model autoregressive audio tokens (AudioLM, MusicLM), teknik Conditioning terhadap melodi kontrol dan genre, serta sintesis efek suara (SFX) prosedural untuk game/film.",
      code: "import numpy as np\n\ndef mock_residual_vector_quantization(latent_vector, num_codebooks=4):\n    # EnCodec RVQ: Kuantisasi bertingkat residual vektor laten audio\n    residual = latent_vector.copy()\n    quantized_indices = []\n    reconstructed = np.zeros_like(latent_vector)\n    \n    for c in range(num_codebooks):\n        # Simulasi pencarian codebook terdekat\n        code_idx = int(np.round(np.mean(residual) * 10)) % 1024\n        quantized_indices.append(code_idx)\n        step_contrib = np.ones_like(latent_vector) * (code_idx / 1024.0)\n        reconstructed += step_contrib\n        residual -= step_contrib\n        \n    return quantized_indices, reconstructed\n\nlatent_audio = np.array([0.45, 0.82, 0.31, 0.95])\ntokens, recon = mock_residual_vector_quantization(latent_audio)\nprint(\"Indeks Token Discrete RVQ (4 Tingkat):\", tokens)\nprint(\"Error Rekonstruksi Laten Audio:\", np.linalg.norm(latent_audio - recon))",
      caption: "residual_vector_quantization.py",
    };
  }
  if (cleanSlug === "bab-10-real-time-conversational-audio-ai" || cleanSlug === "speech-sec-10") {
    return {
      title: "BAB 10: Real-Time & Conversational Audio AI",
      category: "Speech & Audio AI",
      description: "Arsitektur sistem suara percakapan interaktif berlatensi rendah: Pipeline Speech-to-Speech terintegrasi (Streaming ASR -> Low-Latency LLM Streaming -> Streaming Neural Vocoder TTS), optimasi chunk-based audio streaming via WebSockets / WebRTC, Voice Activity Detection interupsi dinamis (barge-in capability), dan reduksi latensi end-to-end hingga di bawah 300 ms.",
      code: "import time\n\nclass RealTimeAudioPipeline:\n    def __init__(self, chunk_duration_ms=100, sample_rate=16000):\n        self.chunk_size = int(sample_rate * (chunk_duration_ms / 1000))\n        self.sample_rate = sample_rate\n        self.buffer = []\n\n    def push_audio_chunk(self, chunk_data):\n        self.buffer.extend(chunk_data)\n        if len(self.buffer) >= self.chunk_size:\n            process_data = self.buffer[:self.chunk_size]\n            self.buffer = self.buffer[self.chunk_size:]\n            return self._process_streaming_asr(process_data)\n        return None\n\n    def _process_streaming_asr(self, chunk):\n        # Simulasi inferensi ASR streaming\n        return f\"ASR-Processed ({len(chunk)} samples)\"\n\npipeline = RealTimeAudioPipeline(chunk_duration_ms=50)\nmock_stream = [0.01] * 2000  # 2000 sampel masuk bertahap\nresult = pipeline.push_audio_chunk(mock_stream)\nprint(\"Status Pipeline Real-time:\", result)\nprint(f\"Sampel tersisa dalam buffer buffer: {len(pipeline.buffer)}\")",
      caption: "streaming_audio_buffer.py",
    };
  }
  if (cleanSlug === "bab-11-evaluasi-model-speech-audio" || cleanSlug === "speech-sec-11") {
    return {
      title: "BAB 11: Evaluasi Model Speech & Audio",
      category: "Speech & Audio AI",
      description: "Metrik evaluasi kuantitatif dan kualitatif sistem audio: Word Error Rate (WER: Substitusi, Delesi, Insersi), Character Error Rate (CER) untuk bahasa berkarakter nonsyllabic, Mean Opinion Score (MOS) 1-5 untuk uji persepsi pendengaran manusia, Perceptual Evaluation of Speech Quality (PESQ), Short-Time Objective Intelligibility (STOI), dan benchmark terstandar LibriSpeech & VoxCeleb.",
      code: "def calculate_wer(reference_words, hypothesis_words):\n    # Dynamic Programming Levenshtein Distance untuk WER\n    r = reference_words\n    h = hypothesis_words\n    d = [[0] * (len(h) + 1) for _ in range(len(r) + 1)]\n    \n    for i in range(len(r) + 1): d[i][0] = i\n    for j in range(len(h) + 1): d[0][j] = j\n    \n    for i in range(1, len(r) + 1):\n        for j in range(1, len(h) + 1):\n            if r[i - 1] == h[j - 1]:\n                d[i][j] = d[i - 1][j - 1]\n            else:\n                d[i][j] = min(d[i - 1][j] + 1,      # Deletion\n                              d[i][j - 1] + 1,      # Insertion\n                              d[i - 1][j - 1] + 1)  # Substitution\n                              \n    errors = d[len(r)][len(h)]\n    wer = (errors / len(r)) * 100\n    return wer, errors\n\nref = \"kecerdasan buatan untuk pemrosesan sinyal suara\".split()\nhyp = \"kecerdasan buatan untuk proses sinyal suara\".split()\n\nwer_score, err_count = calculate_wer(ref, hyp)\nprint(f\"Kalimat Referensi : {' '.join(ref)}\")\nprint(f\"Kalimat Hipotesis : {' '.join(hyp)}\")\nprint(f\"Jumlah Kesalahan : {err_count}, Skor Word Error Rate (WER): {wer_score:.2f}%\")",
      caption: "calculate_wer_metrics.py",
    };
  }
  if (cleanSlug === "bab-12-aplikasi-speech-audio-ai" || cleanSlug === "speech-sec-12") {
    return {
      title: "BAB 12: Aplikasi Speech & Audio AI",
      category: "Speech & Audio AI",
      description: "Implementasi aplikasi industri berskala nyata: Asisten Suara Pintar enterprise (Siri, Alexa, custom on-premise voice bots), Transkripsi Notulensi Rapat Real-Time dengan diarization otomatis, Speech-to-Speech Translation lintas bahasa, Automasi Call Center (sentiment analysis suara, routing pintar, deteksi fraud), dan Teknologi Aksesibilitas bagi tuna rungu dan disabilitas wicara.",
      code: "class VoiceAssistantRouter:\n    def __init__(self):\n        self.routes = {\n            \"jadwal\": self.handle_calendar,\n            \"analisis\": self.handle_analytics,\n            \"bantuan\": self.handle_support\n        }\n\n    def route_transcription(self, transcription_text):\n        text = transcription_text.lower()\n        for keyword, handler in self.routes.items():\n            if keyword in text:\n                return handler(transcription_text)\n        return \"Respon Default: Pertanyaan diteruskan ke LLM General Assistant.\"\n\n    def handle_calendar(self, text):\n        return f\"Membuka modul Jadwal Kalender untuk permintaan: '{text}'\"\n\n    def handle_analytics(self, text):\n        return f\"Menjalankan query Analisis Finansial sesuai instruksi: '{text}'\"\n\n    def handle_support(self, text):\n        return f\"Menghubungkan ke Customer Support Agent untuk isu: '{text}'\"\n\nrouter = VoiceAssistantRouter()\nreq = \"Tolong periksa jadwal rapat tim hari ini\"\nprint(\"Input Suara Terekam  :\", req)\nprint(\"Aksi Otomatis Sistem :\", router.route_transcription(req))",
      caption: "enterprise_voice_assistant_router.py",
    };
  }
  if (cleanSlug === "bab-1-konsep-dasar-data-time-series" || cleanSlug === "ts-sec-1") {
    return {
      title: "BAB 1: Konsep Dasar Data Time Series",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Fondasi analitik deret waktu: Karakteristik temporal (urutan sekuensial, autokorelasi, keterikatan waktu), dekomposisi komponen time series klasik (Trend jangka panjang, Seasonality siklus periodik musiman, Cyclical fluktuasi ekonomi makro, dan Irregular Noise residual acak), representasi additive vs multiplicative decomposition, dan lag plots.",
      code: "import numpy as np\n\n# Simulasi data deret waktu dengan Trend + Seasonality + Noise\nt = np.linspace(0, 4 * np.pi, 120)\ntrend = 0.5 * t\nseasonality = 2.0 * np.sin(2 * t)\nnoise = np.random.normal(0, 0.3, len(t))\ntime_series = trend + seasonality + noise\n\nprint(f\"Total Observasi Data Time Series: {len(time_series)}\")\nprint(f\"Komponen Nilai Rata-rata: {np.mean(time_series):.3f}\")\nprint(f\"Varians Noise Teramati  : {np.var(noise):.3f}\")\nprint(\"5 Titik Data Pertama    :\", np.round(time_series[:5], 2))",
      caption: "timeseries_decomposition.py",
    };
  }
  if (cleanSlug === "bab-2-preprocessing-time-series" || cleanSlug === "ts-sec-2") {
    return {
      title: "BAB 2: Preprocessing Time Series",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Penanganan data deret waktu mentah: Strategi imputasi missing values tanpa lookahead bias (Forward Fill, Backward Fill, Linear/Spline Interpolation), uji stasioneritas formal (Augmented Dickey-Fuller / ADF test, KPSS test), teknik differencing orde-1 dan seasonal differencing, serta normalisasi adaptif (Rolling Min-Max, Z-score scaling berbasis window historis).",
      code: "import numpy as np\n\ndef compute_differencing(series, lag=1):\n    # Menghitung selisih (differencing) untuk menghilangkan tren (stasionerisasi)\n    return np.array([series[i] - series[i - lag] for i in range(lag, len(series))])\n\nraw_data = np.array([100, 103, 107, 112, 118, 125, 133, 142])  # Tren naik kuadratik\ndiff_1 = compute_differencing(raw_data, lag=1)\ndiff_2 = compute_differencing(diff_1, lag=1)\n\nprint(\"Data Mentah (Non-Stasioner):\", raw_data)\nprint(\"Differencing Orde-1         :\", diff_1)\nprint(\"Differencing Orde-2 (Stabil):\", diff_2)",
      caption: "stationarity_differencing.py",
    };
  }
  if (cleanSlug === "bab-3-model-statistik-untuk-forecasting" || cleanSlug === "ts-sec-3") {
    return {
      title: "BAB 3: Model Statistik untuk Forecasting",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Model statistik parametrik untuk peramalan: Autoregressive Integrated Moving Average (ARIMA(p,d,q)), Seasonal ARIMA (SARIMA(p,d,q)(P,D,Q)m), metode Exponential Smoothing (Simple, Holt Linear Trend, Holt-Winters Seasonal), dan algoritma Facebook Prophet (pemodelan kurva pertumbuhan piece-wise logistic/linear + seasonal fourier series + efek libur nasional).",
      code: "import numpy as np\n\ndef simple_exponential_smoothing(series, alpha=0.3):\n    # Formula pemulusan eksponensial: S_t = alpha * Y_t + (1 - alpha) * S_{t-1}\n    forecast = [series[0]]\n    for t in range(1, len(series)):\n        val = alpha * series[t] + (1 - alpha) * forecast[-1]\n        forecast.append(val)\n    next_step = forecast[-1]\n    return np.array(forecast), next_step\n\nsales_history = np.array([120, 135, 128, 142, 150, 148, 160])\nsmoothed, next_pred = simple_exponential_smoothing(sales_history, alpha=0.4)\n\nprint(\"Data Historis Penjualan :\", sales_history)\nprint(\"Hasil Pemulusan Model    :\", np.round(smoothed, 1))\nprint(f\"Prediksi Periode Berikut : {next_pred:.2f}\")",
      caption: "exponential_smoothing_forecast.py",
    };
  }
  if (cleanSlug === "bab-4-machine-learning-untuk-time-series" || cleanSlug === "ts-sec-4") {
    return {
      title: "BAB 4: Machine Learning untuk Time Series",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Transformasi time series menjadi supervised learning: Feature Engineering berbasis jendela geser (Lag features Y_{t-1}, rolling mean/std/min/max, expanding window), ekstraksi fitur kalender (hari dalam minggu, bulan, hari libur), model regresi linier teratur (Ridge, Lasso), dan Gradient Boosting Trees (LightGBM, XGBoost, CatBoost) untuk multi-step recursive & direct forecasting.",
      code: "import numpy as np\n\ndef create_lagged_dataset(series, n_lags=3):\n    X, y = [], []\n    for i in range(n_lags, len(series)):\n        X.append(series[i - n_lags : i])\n        y.append(series[i])\n    return np.array(X), np.array(y)\n\nts_values = np.array([21.0, 22.5, 20.8, 23.1, 24.0, 23.8, 25.2, 26.1])\nX_mat, y_vec = create_lagged_dataset(ts_values, n_lags=3)\n\nprint(\"Matriks Fitur Lag (X) [t-3, t-2, t-1]:\\n\", X_mat)\nprint(\"Target Prediksi (y) [t]:\", y_vec)",
      caption: "lag_feature_builder.py",
    };
  }
  if (cleanSlug === "bab-5-deep-learning-untuk-time-series" || cleanSlug === "ts-sec-5") {
    return {
      title: "BAB 5: Deep Learning untuk Time Series",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Arsitektur deep learning sekuensial untuk deret waktu: Recurrent Neural Networks (RNN dasar, mitigasi vanishing gradient dengan LSTM & GRU gates), Temporal Convolutional Networks (TCN) dengan causal dilated convolutions dan receptive field eksponensial, serta adaptasi Transformer untuk data numerik kontinu (Informer, Autoformer, PatchTST).",
      code: "import numpy as np\n\ndef mock_lstm_step(x_t, h_prev, c_prev):\n    # Simulasi perhitungan gerbang LSTM (Forget, Input, Candidate, Output)\n    def sigmoid(x): return 1 / (1 + np.exp(-x))\n    \n    f_gate = sigmoid(np.dot(x_t, 0.5) + np.dot(h_prev, 0.1))\n    i_gate = sigmoid(np.dot(x_t, 0.4) + np.dot(h_prev, 0.2))\n    c_tilde = np.tanh(np.dot(x_t, 0.6) + np.dot(h_prev, 0.3))\n    c_next = f_gate * c_prev + i_gate * c_tilde\n    o_gate = sigmoid(np.dot(x_t, 0.3) + np.dot(h_prev, 0.4))\n    h_next = o_gate * np.tanh(c_next)\n    return h_next, c_next\n\nh, c = 0.0, 0.0\ninputs = [1.2, -0.5, 2.1]\nfor t_idx, x in enumerate(inputs):\n    h, c = mock_lstm_step(x, h, c)\n    print(f\"Langkah {t_idx+1} | Input: {x:4.1f} | Hidden State: {h:.4f} | Cell State: {c:.4f}\")",
      caption: "lstm_cell_simulation.py",
    };
  }
  if (cleanSlug === "bab-6-foundation-model-untuk-time-series" || cleanSlug === "ts-sec-6") {
    return {
      title: "BAB 6: Foundation Model untuk Time Series",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Era baru foundation model untuk deret waktu: Model zero-shot pretrained berskala masif (TimeGPT dari Nixtla, Chronos dari Amazon, Lag-Llama, Moment), representasi patch kontinu dan tokenisasi deret angka, transfer learning lintas domain vertikal tanpa perlu pelatihan ulang dari nol, dan fine-tuning efisien berbasis LoRA untuk deret waktu.",
      code: "import numpy as np\n\ndef zero_shot_forecast_stub(context_window, horizon=4):\n    # Simulasi estimasi Time Series Foundation Model (Chronos / TimeGPT)\n    mean_val = np.mean(context_window)\n    slope = (context_window[-1] - context_window[0]) / len(context_window)\n    predictions = [context_window[-1] + slope * (i + 1) for i in range(horizon)]\n    return np.array(predictions)\n\ncontext = np.array([45.0, 47.2, 49.0, 52.1, 54.8])\npred_horizon = zero_shot_forecast_stub(context, horizon=3)\n\nprint(\"Konteks Historis Deret Waktu :\", context)\nprint(\"Hasil Prediksi Zero-Shot (H=3):\", np.round(pred_horizon, 2))",
      caption: "zero_shot_time_series_prompt.py",
    };
  }
  if (cleanSlug === "bab-7-probabilistic-uncertainty-forecasting" || cleanSlug === "ts-sec-7") {
    return {
      title: "BAB 7: Probabilistic & Uncertainty Forecasting",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Kuantifikasi ketidakpastian dalam peramalan: Prediksi deterministik titik tunggal vs distribusi probabilitas penuh, Prediction Intervals (interval keyakinan 80% & 95%), Quantile Regression (optimasi pinball loss / quantile loss untuk kuantil P10, P50, P90), dan simulasi Monte Carlo untuk proyeksi risiko ekstrem dalam rantai pasok dan portofolio.",
      code: "import numpy as np\n\ndef pinball_loss(y_true, y_pred, quantile=0.9):\n    # Kuantile loss: q * e jika e > 0, (q - 1) * e jika e <= 0\n    error = y_true - y_pred\n    return np.maximum(quantile * error, (quantile - 1) * error)\n\ny_actual = np.array([100.0, 105.0, 98.0])\np90_prediction = np.array([108.0, 104.0, 102.0])\n\nloss_p90 = pinball_loss(y_actual, p90_prediction, quantile=0.9)\nprint(\"Nilai Aktual     :\", y_actual)\nprint(\"Prediksi Kuantil 90% (P90) :\", p90_prediction)\nprint(\"Rata-rata Pinball Loss P90 :\", np.mean(loss_p90))",
      caption: "quantile_pinball_loss.py",
    };
  }
  if (cleanSlug === "bab-8-anomaly-detection" || cleanSlug === "ts-sec-8") {
    return {
      title: "BAB 8: Anomaly Detection",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Deteksi anomali pada deret waktu: Anomali titik (point anomalies), anomali kontekstual (misal lonjakan suhu di musim dingin), dan anomali kolektif (pola abnormal berdurasi panjang). Metode statistik (Z-score, IQR, Rolling MAD), algoritma machine learning (Isolation Forest, One-Class SVM, Local Outlier Factor), dan Deep Learning berbasis Autoencoder rekonstruksi error.",
      code: "import numpy as np\n\ndef rolling_zscore_anomaly_detector(series, window=5, threshold=2.5):\n    anomalies = []\n    for i in range(window, len(series)):\n        sub = series[i - window : i]\n        mean = np.mean(sub)\n        std = np.std(sub) + 1e-6\n        z_score = abs(series[i] - mean) / std\n        if z_score > threshold:\n            anomalies.append((i, series[i], z_score))\n    return anomalies\n\ndata_stream = np.array([10, 11, 10, 12, 11, 10, 11, 58, 10, 11, 12])  # 58 adalah lonjakan outlier\ndetected = rolling_zscore_anomaly_detector(data_stream, window=4, threshold=3.0)\n\nprint(f\"Data Aliran: {data_stream}\")\nprint(\"Anomali Terdeteksi:\")\nfor idx, val, z in detected:\n    print(f\"- Titik Indeks {idx}: Nilai={val}, Skor Z={z:.2f} (OUTLIER)\")",
      caption: "isolation_anomaly_detector.py",
    };
  }
  if (cleanSlug === "bab-9-multivariate-hierarchical-time-series" || cleanSlug === "ts-sec-9") {
    return {
      title: "BAB 9: Multivariate & Hierarchical Time Series",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Pemodelan deret waktu multi-variabel dan struktur hierarkis: Vector Autoregression (VAR) untuk interaksi timbal balik antar sinyal, Spatio-Temporal Graph Neural Networks, dan Hierarchical Forecasting Reconciliation (metode Bottom-Up, Top-Down, Middle-Out, serta optimal MinT / Minimum Trace reconciliation yang menjamin agregasi total konsisten di semua level cabang toko/wilayah).",
      code: "import numpy as np\n\n# Rekonsiliasi hierarki penjualan: Total Toko = Produk A + Produk B\nsales_product_a = np.array([12, 15, 14, 18])\nsales_product_b = np.array([25, 28, 22, 30])\n\ndef reconcile_bottom_up(children_series):\n    # Bottom-up menjamin konsistensi agregasi level atas\n    return np.sum(children_series, axis=0)\n\nreconciled_total = reconcile_bottom_up([sales_product_a, sales_product_b])\nprint(\"Prediksi Penjualan Produk A :\", sales_product_a)\nprint(\"Prediksi Penjualan Produk B :\", sales_product_b)\nprint(\"Hasil Rekonsiliasi Total Toko:\", reconciled_total)",
      caption: "hierarchical_bottom_up.py",
    };
  }
  if (cleanSlug === "bab-10-evaluasi-model-time-series" || cleanSlug === "ts-sec-10") {
    return {
      title: "BAB 10: Evaluasi Model Time Series",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Strategi validasi dan metrik performa time series: Larangan penggunaan K-Fold silang acak standar untuk menghindari kebocoran masa depan (lookahead bias), teknik Time Series Split (Expanding Window vs Sliding Window Cross-Validation / Purged Backtesting), dan metrik evaluasi komprehensif (MAE, RMSE, MAPE, Symmetric MAPE / SMAPE, dan MASE / Mean Absolute Scaled Error).",
      code: "import numpy as np\n\ndef evaluate_forecast(y_true, y_pred):\n    mae = np.mean(np.abs(y_true - y_pred))\n    rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))\n    mape = np.mean(np.abs((y_true - y_pred) / (y_true + 1e-6))) * 100\n    smape = np.mean(2 * np.abs(y_pred - y_true) / (np.abs(y_true) + np.abs(y_pred) + 1e-6)) * 100\n    return {\"MAE\": mae, \"RMSE\": rmse, \"MAPE\": mape, \"SMAPE\": smape}\n\nactuals = np.array([100.0, 110.0, 125.0, 130.0])\nforecasts = np.array([102.0, 108.0, 120.0, 135.0])\n\nmetrics = evaluate_forecast(actuals, forecasts)\nfor k, v in metrics.items():\n    print(f\"Metrik {k:5s}: {v:.2f}\")",
      caption: "timeseries_backtesting_metrics.py",
    };
  }
  if (cleanSlug === "bab-11-deployment-model-forecasting" || cleanSlug === "ts-sec-11") {
    return {
      title: "BAB 11: Deployment Model Forecasting",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Operasionalisasi model peramalan di lingkungan produksi: Pola inferensi Batch Processing vs Real-Time Streaming (Kafka + Flink), penjadwalan retraining otomatis berbasis deteksi Concept Drift temporal (ADWIN, Kolmogorov-Smirnov test), caching prediksi horizon tinggi, pemantauan degradasi performa model seiring perubahan tren musiman.",
      code: "import numpy as np\n\nclass TimeSeriesModelMonitor:\n    def __init__(self, baseline_mean, baseline_std):\n        self.base_mean = baseline_mean\n        self.base_std = baseline_std\n\n    def check_drift(self, incoming_batch):\n        batch_mean = np.mean(incoming_batch)\n        drift_distance = abs(batch_mean - self.base_mean) / (self.base_std + 1e-6)\n        needs_retrain = bool(drift_distance > 2.0)\n        return {\n            \"batch_mean\": batch_mean,\n            \"drift_sigma\": drift_distance,\n            \"trigger_retraining\": needs_retrain\n        }\n\nmonitor = TimeSeriesModelMonitor(baseline_mean=100.0, baseline_std=5.0)\nnormal_batch = [101.2, 99.5, 102.0, 98.8]\nshifted_batch = [118.5, 122.0, 116.2, 120.1]\n\nprint(\"Batch Normal :\", monitor.check_drift(normal_batch))\nprint(\"Batch Shifted:\", monitor.check_drift(shifted_batch))",
      caption: "drift_monitor_serving.py",
    };
  }
  if (cleanSlug === "bab-12-aplikasi-time-series" || cleanSlug === "ts-sec-12") {
    return {
      title: "BAB 12: Aplikasi Time Series",
      category: "Time Series Forecasting & Anomaly Detection",
      description: "Studi kasus implementasi industri: Peramalan Permintaan (Demand Forecasting & Inventory Optimization di e-commerce), Predictive Maintenance & Deteksi Anomali pada Turbin Industri & IoT sensor, Prediksi Finansial (Volatility modelling, Algorithmic Trading, Manajemen Risiko Kredit), dan estimasi konsumsi energi pada Smart Grid.",
      code: "class SmartGridLoadManager:\n    def __init__(self, capacity_mw=500.0):\n        self.capacity = capacity_mw\n\n    def allocate_power(self, predicted_load_mw, confidence_interval_mw):\n        max_expected_load = predicted_load_mw + confidence_interval_mw\n        reserve_margin = self.capacity - max_expected_load\n        \n        status = \"NORMAL\"\n        if reserve_margin < 20.0:\n            status = \"PERINGATAN: CADANGAN DAYA KRITIS - NYALAKAN GENERATOR CADANGAN\"\n            \n        return {\n            \"Beban_Prediksi_MW\": predicted_load_mw,\n            \"Beban_Maksimal_Risiko_MW\": max_expected_load,\n            \"Sisa_Kapasitas_MW\": reserve_margin,\n            \"Status_Sistem\": status\n        }\n\ngrid = SmartGridLoadManager(capacity_mw=400.0)\ndecision = grid.allocate_power(predicted_load_mw=360.0, confidence_interval_mw=25.0)\nfor key, val in decision.items():\n    print(f\"- {key}: {val}\")",
      caption: "smart_grid_load_forecaster.py",
    };
  }
  if (cleanSlug === "bab-1-konsep-dasar-vector-database" || cleanSlug === "vdb-sec-1") {
    return {
      title: "BAB 1: Konsep Dasar Vector Database",
      category: "Vector Database & Retrieval System",
      description: "Revolusi basis data vektor untuk AI: Kebutuhan pencarian semantik tak terstruktur (teks, gambar, audio, graph), perbedaan arsitektur mendasar antara Database Tradisional RDBMS/NoSQL (pencarian exact-match berbasis B-Tree indeks skalar) vs Vector Database (pencarian Approximate Nearest Neighbor / ANN dalam ruang vektor berdimensi tinggi), dan siklus hidup embedding data.",
      code: "import numpy as np\n\n# Perbedaan komparatif: Pencarian tepat (Exact Match) vs Kedekatan Vektor (Cosine Sim)\ndatabase_records = {\n    \"doc1\": {\"text\": \"belajar machine learning\", \"vector\": np.array([0.9, 0.1, 0.2])},\n    \"doc2\": {\"text\": \"tutorial deep learning\", \"vector\": np.array([0.85, 0.15, 0.25])},\n    \"doc3\": {\"text\": \"resep masakan nusantara\", \"vector\": np.array([0.05, 0.95, 0.1])}\n}\n\nquery_vector = np.array([0.88, 0.12, 0.18])  # query semantik: \"kursus kecerdasan buatan\"\n\nprint(\"Pencarian Berdasarkan Cosine Similarity:\")\nfor doc_id, data in database_records.items():\n    sim = np.dot(query_vector, data[\"vector\"]) / (np.linalg.norm(query_vector) * np.linalg.norm(data[\"vector\"]))\n    print(f\"- {doc_id} ('{data['text']}'): Kemiripan = {sim:.4f}\")",
      caption: "traditional_vs_vector_search.py",
    };
  }
  if (cleanSlug === "bab-2-representasi-vektor-embedding" || cleanSlug === "vdb-sec-2") {
    return {
      title: "BAB 2: Representasi Vektor (Embedding)",
      category: "Vector Database & Retrieval System",
      description: "Mekanisme penciptaan embedding: Konsep ruang representasi laten berdimensi tinggi (768, 1536, atau 3072 dimensi), Model Embedding Teks (BERT, OpenAI text-embedding-3, Cohere embed, BGE), Model Embedding Gambar (CLIP ViT, DINOv2), Model Embedding Audio (CLAP), serta normalisasi L2 untuk efisiensi komputasi dot product.",
      code: "import numpy as np\n\ndef l2_normalize(vector):\n    norm = np.linalg.norm(vector)\n    if norm == 0: return vector\n    return vector / norm\n\nraw_embedding = np.array([3.0, 4.0, 0.0, 5.0])\nunit_vector = l2_normalize(raw_embedding)\n\nprint(\"Embedding Mentah:\", raw_embedding)\nprint(\"Norm Sebelum Normalisasi:\", np.linalg.norm(raw_embedding))\nprint(\"Embedding L2 Normalized:\", np.round(unit_vector, 4))\nprint(\"Norm Setelah Normalisasi:\", np.linalg.norm(unit_vector))",
      caption: "embedding_l2_normalization.py",
    };
  }
  if (cleanSlug === "bab-3-algoritma-pencarian-kemiripan" || cleanSlug === "vdb-sec-3") {
    return {
      title: "BAB 3: Algoritma Pencarian Kemiripan",
      category: "Vector Database & Retrieval System",
      description: "Fondasi metrik jarak dan algoritma pencarian kemiripan: Metrik jarak fundamental (Cosine Similarity, Euclidean Distance / L2 norm, Dot Product / Inner Product, Manhattan Distance), tantangan kutukan dimensi tinggi (Curse of Dimensionality), konsep Approximate Nearest Neighbor (ANN), dan algoritma graf state-of-the-art HNSW (Hierarchical Navigable Small World) dengan navigasi multi-lapisan.",
      code: "import numpy as np\n\ndef euclidean_distance(v1, v2):\n    return np.sqrt(np.sum((v1 - v2) ** 2))\n\ndef cosine_similarity(v1, v2):\n    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))\n\nvec_a = np.array([1.0, 2.0, 3.0])\nvec_b = np.array([1.2, 1.9, 3.1])\nvec_c = np.array([-2.0, 0.5, 1.0])\n\nprint(\"Jarak Euclidean A ke B :\", round(euclidean_distance(vec_a, vec_b), 4))\nprint(\"Cosine Similarity A ke B:\", round(cosine_similarity(vec_a, vec_b), 4))\nprint(\"Cosine Similarity A ke C:\", round(cosine_similarity(vec_a, vec_c), 4))",
      caption: "hnsw_graph_traversal_concept.py",
    };
  }
  if (cleanSlug === "bab-4-indexing-pada-vector-database" || cleanSlug === "vdb-sec-4") {
    return {
      title: "BAB 4: Indexing pada Vector Database",
      category: "Vector Database & Retrieval System",
      description: "Struktur indexing untuk pencarian vektor berskala miliaran data: Flat Index (pencarian brute-force linear 100% akurasi namun mahal O(N)), Inverted File Index (IVF: partisi ruang ke Voronoi cells menggunakan K-Means clustering), Product Quantization (PQ: kompresi vektor menjadi sub-vektor byte diskrit untuk efisiensi RAM drastis), dan kombinasi IVF-PQ.",
      code: "import numpy as np\n\ndef assign_to_ivf_clusters(vectors, centroids):\n    # IVF: Petakan setiap vektor ke centroid Voronoi terdekat\n    assignments = {}\n    for idx, vec in enumerate(vectors):\n        distances = [np.linalg.norm(vec - c) for c in centroids]\n        best_cluster = int(np.argmin(distances))\n        assignments.setdefault(best_cluster, []).append(idx)\n    return assignments\n\nnp.random.seed(42)\ndataset = np.random.randn(20, 4)\ncentroids = np.array([[1, 1, 1, 1], [-1, -1, -1, -1]], dtype=float)\n\nclusters = assign_to_ivf_clusters(dataset, centroids)\nprint(\"Partisi IVF Centroid Clusters:\")\nfor cluster_id, doc_ids in clusters.items():\n    print(f\"- Cluster {cluster_id}: Berisi {len(doc_ids)} vektor -> {doc_ids}\")",
      caption: "ivf_clustering_concept.py",
    };
  }
  if (cleanSlug === "bab-5-hybrid-search-reranking" || cleanSlug === "vdb-sec-5") {
    return {
      title: "BAB 5: Hybrid Search & Reranking",
      category: "Vector Database & Retrieval System",
      description: "Teknik pencarian hibrida modern: Menggabungkan kekuatan Dense Retrieval (pencarian makna semantik mendalam via embeddings) dengan Sparse Retrieval (pencarian kata kunci leksikal presisi tinggi via BM25 / SPLADE), metode fusi peringkat Reciprocal Rank Fusion (RRF), serta Cross-Encoder model Reranking (Cohere Rerank, BGE-Reranker) untuk menyaring dokumen teratas.",
      code: "def reciprocal_rank_fusion(dense_ranks, sparse_ranks, k=60):\n    # Formula RRF: Skor = SUM( 1 / (k + rank_i) )\n    scores = {}\n    for rank, doc in enumerate(dense_ranks):\n        scores[doc] = scores.get(doc, 0.0) + (1.0 / (k + rank + 1))\n    for rank, doc in enumerate(sparse_ranks):\n        scores[doc] = scores.get(doc, 0.0) + (1.0 / (k + rank + 1))\n    return sorted(scores.items(), key=lambda x: x[1], reverse=True)\n\ndense_results = [\"doc_A\", \"doc_B\", \"doc_C\", \"doc_D\"]\nsparse_results = [\"doc_B\", \"doc_A\", \"doc_E\", \"doc_C\"]\n\nfused = reciprocal_rank_fusion(dense_results, sparse_results, k=60)\nprint(\"Hasil Peringkat Hybrid Search (RRF):\")\nfor rank_idx, (doc_id, score) in enumerate(fused):\n    print(f\"{rank_idx + 1}. {doc_id} -> Skor RRF: {score:.5f}\")",
      caption: "reciprocal_rank_fusion.py",
    };
  }
  if (cleanSlug === "bab-6-platform-vector-database" || cleanSlug === "vdb-sec-6") {
    return {
      title: "BAB 6: Platform Vector Database",
      category: "Vector Database & Retrieval System",
      description: "Ekosistem dan arsitektur platform vector database modern: Library komputasi in-memory tingkat rendah (FAISS dari Meta), database cloud native terkelola (Pinecone serverless), database open-source fleksibel (Chroma, Weaviate dengan GraphQL & modularitas multi-media, Milvus terdistribusi horizontal), serta ekstensi PostgreSQL pgvector untuk arsitektur terpadu.",
      code: "class SimpleVectorStore:\n    def __init__(self):\n        self.storage = {}\n\n    def insert(self, id_str, vector, metadata=None):\n        self.storage[id_str] = {\"vector\": np.array(vector), \"metadata\": metadata or {}}\n\n    def search(self, query_vec, top_k=2):\n        results = []\n        q = np.array(query_vec)\n        for doc_id, item in self.storage.items():\n            sim = np.dot(q, item[\"vector\"]) / (np.linalg.norm(q) * np.linalg.norm(item[\"vector\"]))\n            results.append((doc_id, sim, item[\"metadata\"]))\n        results.sort(key=lambda x: x[1], reverse=True)\n        return results[:top_k]\n\nv_store = SimpleVectorStore()\nv_store.insert(\"doc_1\", [1.0, 0.0, 0.0], {\"title\": \"Pengantar AI\"})\nv_store.insert(\"doc_2\", [0.0, 1.0, 0.0], {\"title\": \"Masak Nasi Goreng\"})\nv_store.insert(\"doc_3\", [0.8, 0.2, 0.0], {\"title\": \"Dasar Machine Learning\"})\n\nquery = [0.9, 0.1, 0.0]\nhits = v_store.search(query, top_k=2)\nprint(\"Hasil Pencarian Top-2 Vector DB:\")\nfor hid, score, meta in hits:\n    print(f\"- [{hid}] '{meta['title']}' | Kemiripan: {score:.4f}\")",
      caption: "mock_vector_store_crud.py",
    };
  }
  if (cleanSlug === "bab-7-integrasi-vector-database-dengan-llm" || cleanSlug === "vdb-sec-7") {
    return {
      title: "BAB 7: Integrasi Vector Database dengan LLM",
      category: "Vector Database & Retrieval System",
      description: "Arsitektur Retrieval-Augmented Generation (RAG): Mengatasi halusinasi model bahasa dengan grounding fakta eksternal, pipeline RAG end-to-end (Document Chunking dinamis, embedding ingestion, vector similarity search, context prompt enrichment, synthesis respon LLM), strategi chunking (fixed-size vs semantic recursive chunking), dan penanganan batas token konteks.",
      code: "def build_rag_prompt(user_query, retrieved_chunks):\n    # Merakit context augmentation untuk prompt LLM\n    context_text = \"\\n\\n\".join([f\"[Konteks {i+1}]: {c}\" for i, c in enumerate(retrieved_chunks)])\n    prompt = f\"\"\"Gunakan konteks berikut untuk menjawab pertanyaan dengan akurat tanpa halusinasi.\n\nKONTEKS TERSEDIA:\n{context_text}\n\nPERTANYAAN PENGGUNA:\n{user_query}\n\nJAWABAN SISTEM:\"\"\"\n    return prompt\n\nquery = \"Bagaimana arsitektur Transformer menangani input sekuensial?\"\nchunks = [\n    \"Transformer menggunakan mekanisme Self-Attention untuk memproses semua token secara paralel.\",\n    \"Positional Encoding ditambahkan ke embedding input agar model mengenali urutan posisi kata.\"\n]\n\nprompt_output = build_rag_prompt(query, chunks)\nprint(prompt_output)",
      caption: "rag_context_builder.py",
    };
  }
  if (cleanSlug === "bab-8-multimodal-vector-search" || cleanSlug === "vdb-sec-8") {
    return {
      title: "BAB 8: Multimodal Vector Search",
      category: "Vector Database & Retrieval System",
      description: "Pencarian kemiripan lintas modalitas data: Pemetaan teks, citra, audio, dan dokumen terstruktur ke dalam satu ruang vektor bersama (Joint Multimodal Embedding Space), query teks untuk mencari gambar/video yang relevan (\"image retrieval by text\"), query gambar untuk mencari produk serupa dalam e-commerce, dan pencarian audio berbasis humming query.",
      code: "import numpy as np\n\n# Simulasi Joint Embedding Space (CLIP 4 Dimensi)\nimage_gallery = {\n    \"img_kucing.jpg\": np.array([0.72, 0.15, 0.65, 0.10]),\n    \"img_mobil.jpg\":   np.array([0.10, 0.90, 0.20, 0.35]),\n    \"img_pantai.jpg\":  np.array([0.30, 0.25, 0.88, 0.20])\n}\n\n# Query teks dalam ruang CLIP yang sama: \"anak kucing lucu bermain\"\ntext_query_vector = np.array([0.70, 0.18, 0.62, 0.12])\n\nscores = []\nfor name, img_vec in image_gallery.items():\n    sim = np.dot(text_query_vector, img_vec) / (np.linalg.norm(text_query_vector) * np.linalg.norm(img_vec))\n    scores.append((name, sim))\n\nscores.sort(key=lambda x: x[1], reverse=True)\nprint(\"Hasil Pencarian Gambar Berdasarkan Kueri Teks (CLIP Joint Space):\")\nfor img_name, sim_score in scores:\n    print(f\"- {img_name}: Skor Kemiripan = {sim_score:.4f}\")",
      caption: "cross_modal_retrieval.py",
    };
  }
  if (cleanSlug === "bab-9-skalabilitas-optimasi" || cleanSlug === "vdb-sec-9") {
    return {
      title: "BAB 9: Skalabilitas & Optimasi",
      category: "Vector Database & Retrieval System",
      description: "Rekayasa performa vector database tingkat produksi: Sharding horizontal (pemisahan partisi data vektor berdasarkan hash kunci atau metadata tenants), replikasi multi-node untuk ketersediaan tinggi (High Availability), strategi caching embedding query panas, dan manajemen trade-off krusial antara Akurasi Pencarian (Recall@K) vs Kecepatan Latensi (QPS) vs Konsumsi Memori RAM.",
      code: "import hashlib\n\nclass DistributedVectorRouter:\n    def __init__(self, shard_nodes):\n        self.nodes = shard_nodes\n\n    def get_shard_for_tenant(self, tenant_id):\n        # Konsisten hashing untuk sharding multi-tenant\n        hash_val = int(hashlib.md5(tenant_id.encode()).hexdigest(), 16)\n        selected_shard = self.nodes[hash_val % len(self.nodes)]\n        return selected_shard\n\nrouter = DistributedVectorRouter([\"shard_ap_southeast_1\", \"shard_us_east_1\", \"shard_eu_central_1\"])\nclients = [\"tenant_fintech_01\", \"tenant_healthcare_88\", \"tenant_ecommerce_03\"]\n\nfor client in clients:\n    assigned = router.get_shard_for_tenant(client)\n    print(f\"Klien: {client} -> Dialokasikan ke Node: {assigned}\")",
      caption: "vector_sharding_router.py",
    };
  }
  if (cleanSlug === "bab-10-keamanan-privasi-vector-database" || cleanSlug === "vdb-sec-10") {
    return {
      title: "BAB 10: Keamanan & Privasi Vector Database",
      category: "Vector Database & Retrieval System",
      description: "Proteksi aset data vektor dan kepatuhan regulasi: Kontrol Akses Berbasis Peran (RBAC) pada level dokumen & koleksi vektor, enkripsi data vektor saat transit (TLS) dan at-rest (AES-256), pencegahan kebocoran data sensitif melalui vektor (Vector Reconstruction Attacks & Inversion), serta kepatuhan GDPR untuk hak penghapusan data embedding.",
      code: "def secure_vector_filter(raw_results, user_role, user_department):\n    # Memfilter hasil pencarian vektor berdasarkan hak akses RBAC\n    authorized_results = []\n    for doc in raw_results:\n        required_role = doc[\"metadata\"].get(\"min_role\", \"viewer\")\n        dept = doc[\"metadata\"].get(\"department\", \"all\")\n        \n        # Validasi izin departemen dan level peran\n        role_levels = {\"viewer\": 1, \"editor\": 2, \"admin\": 3}\n        if role_levels.get(user_role, 0) >= role_levels.get(required_role, 1):\n            if dept == \"all\" or dept == user_department:\n                authorized_results.append(doc[\"id\"])\n    return authorized_results\n\nresults = [\n    {\"id\": \"doc_publik\", \"metadata\": {\"min_role\": \"viewer\", \"department\": \"all\"}},\n    {\"id\": \"doc_rahasia_finansial\", \"metadata\": {\"min_role\": \"admin\", \"department\": \"finance\"}},\n    {\"id\": \"doc_engineering\", \"metadata\": {\"min_role\": \"editor\", \"department\": \"engineering\"}}\n]\n\nallowed_docs = secure_vector_filter(results, user_role=\"editor\", user_department=\"engineering\")\nprint(\"Dokumen yang Boleh Diakses Pengguna (Editor Engineering):\", allowed_docs)",
      caption: "metadata_role_filtering.py",
    };
  }
  if (cleanSlug === "bab-11-aplikasi-vector-database" || cleanSlug === "vdb-sec-11") {
    return {
      title: "BAB 11: Aplikasi Vector Database",
      category: "Vector Database & Retrieval System",
      description: "Penerapan skala besar di ekosistem enterprise: Sistem Pencarian Semantik perusahaan pada repositori dokumen knowledge base, Mesin Rekomendasi Berbasis Kemiripan Vektor perilaku pengguna secara real-time, Sistem Deduplikasi Data masif (deteksi plagiarisme dan kesamaan produk duplikat), serta Question Answering pintar terintegrasi.",
      code: "import numpy as np\n\ndef detect_duplicates(new_vector, existing_vectors, similarity_threshold=0.98):\n    for doc_id, vec in existing_vectors.items():\n        sim = np.dot(new_vector, vec) / (np.linalg.norm(new_vector) * np.linalg.norm(vec))\n        if sim >= similarity_threshold:\n            return True, doc_id, sim\n    return False, None, 0.0\n\ndb_vectors = {\n    \"prod_101\": np.array([0.99, 0.12, 0.05]),\n    \"prod_102\": np.array([0.15, 0.88, 0.45])\n}\n\nincoming_item = np.array([0.989, 0.122, 0.049])  # Hampir identik dengan prod_101\nis_dupe, match_id, score = detect_duplicates(incoming_item, db_vectors)\n\nif is_dupe:\n    print(f\"Peringatan Duplikasi: Item baru ditolak! Identik dengan '{match_id}' (Kemiripan: {score:.5f})\")\nelse:\n    print(\"Item baru unik, disimpan ke dalam basis data.\")",
      caption: "vector_deduplication_engine.py",
    };
  }
  return null;
}
