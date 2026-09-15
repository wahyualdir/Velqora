import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: SPEECH & AUDIO AI (TOPIK 26) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Oppenheim, A. V., & Schafer, R. W. (2009). Discrete-Time Signal Processing (3rd ed.). Prentice Hall.
 * - Graves, A., et al. (2006). Connectionist Temporal Classification: Labelling Unsegmented Sequence Data. ICML.
 * - Radford, A., et al. (2023). Robust Speech Recognition via Large-Scale Weak Supervision (Whisper). ICML.
 * - Gulati, A., et al. (2020). Conformer: Convolution-augmented Transformer for Speech Recognition. Interspeech.
 * - Kong, J., Kim, J., & Bae, J. (2020). HiFi-GAN: Generative Adversarial Networks for Efficient and High Fidelity Speech Synthesis. NeurIPS.
 */
export const speechAudioAiCurriculum: AcademicCurriculum = {
  id: "speech-audio-ai",
  slug: "speech-audio-ai",
  title: "Speech & Audio AI",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Pemrosesan sinyal wicara dan akustik berbasis deep learning: representasi domain frekuensi (STFT & spektrogram skala Mel, MFCC), penjajaran sekuens tak tersegmentasi (Connectionist Temporal Classification / CTC Loss), arsitektur Conformer & Whisper, sintesis wicara saraf (Neural TTS & HiFi-GAN Vocoder), serta representasi wav2vec 2.0.",
  estimatedHours: 52,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Connectionist Temporal Classification: Labelling Unsegmented Sequence Data with Recurrent Neural Networks",
      authors: ["Alex Graves", "Santiago Fernández", "Faustino Gomez", "Jürgen Schmidhuber"],
      type: "paper",
      url: "https://dl.acm.org/doi/10.1145/1143844.1143891",
      doi: "10.1145/1143844.1143891",
      relevance: "Fungsi kerugian CTC yang mengeliminasi kebutuhan anotasi waktu tingkat fonem pada Automatic Speech Recognition.",
      year: 2006,
      publisherOrVenue: "ACM ICML 2006",
    },
    {
      title: "Robust Speech Recognition via Large-Scale Weak Supervision",
      authors: ["Alec Radford", "Jong Wook Kim", "Tao Xu", "Greg Brockman", "Christine McLeavey", "Ilya Sutskever"],
      type: "paper",
      url: "https://arxiv.org/abs/2212.04356",
      doi: "10.48550/arXiv.2212.04356",
      relevance: "Arsitektur Whisper Transformer encoder-decoder untuk transkripsi multibahasa dan penerjemahan wicara.",
      year: 2023,
      publisherOrVenue: "ICML 2023",
    },
    {
      title: "Conformer: Convolution-augmented Transformer for Speech Recognition",
      authors: ["Anmol Gulati", "James Qin", "Chung-Cheng Chiu", "Niki Parmar", "Ruoming Pang", "et al."],
      type: "paper",
      url: "https://arxiv.org/abs/2005.08100",
      doi: "10.48550/arXiv.2005.08100",
      relevance: "Kombinasi modul konvolusi lokal dan self-attention global untuk pemodelan akustik ASR berkinerja state-of-the-art.",
      year: 2020,
      publisherOrVenue: "Interspeech 2020",
    },
    {
      title: "HiFi-GAN: Generative Adversarial Networks for Efficient and High Fidelity Speech Synthesis",
      authors: ["Jungil Kong", "Jihyun Kim", "Jaekyoung Bae"],
      type: "paper",
      url: "https://arxiv.org/abs/2010.05646",
      doi: "10.48550/arXiv.2010.05646",
      relevance: "Arsitektur Neural Vocoder berbasis GAN dengan diskriminator multi-periode untuk rekonstruksi audio beresolusi tinggi.",
      year: 2020,
      publisherOrVenue: "NeurIPS 2020",
    },
  ],
  chapters: [
    {
      id: "sph-bab-1",
      slug: "akustik-dan-spektrogram-mel",
      title: "BAB 1: Pemrosesan Sinyal Akustik: STFT & Spektrogram Skala Mel",
      orderIndex: 1,
      description: "Sampling rate Teorema Nyquist-Shannon, fungsi jendela Hann/Hamming, Short-Time Fourier Transform (STFT), pemetaan nonlinier skala pendengaran manusia Mel, dan ekstraksi MFCC.",
      subchapters: [
        {
          id: "sph-bab-1-1",
          slug: "formulasi-stft-dan-mel-filterbank",
          title: "1.1. Formulasi Matematika STFT & Filterbank Skala Mel",
          orderIndex: 1,
          description: "Dekomposisi sinyal domain waktu $x[n]$ ke matriks frekuensi-waktu $X(m, \\omega)$ dan transformasi segitiga Mel.",
          content_markdown: `# 1.1. Formulasi Matematika STFT & Filterbank Skala Mel

## 1. Teorema Nyquist-Shannon & Jendela STFT
Agar sinyal analog kontinu dapat direkonstruksi sempurna tanpa distorsi aliasing, frekuensi pencuplikan (*sampling rate* $f_s$) harus memenuhi:
$$f_s \\ge 2 f_{\\max}$$
Pada sinyal wicara manusia, standar industri yang umum digunakan adalah $f_s = 16.000\\text{ Hz}$ (lebar pita $8\\text{ kHz}$) atau $44.100\\text{ Hz}$ untuk audio berkualitas tinggi.

Untuk sinyal audio diskrit $x[n]$ dengan fungsi jendela Hann $w[n]$ berukuran $N$ dan panjang lompatan (*hop length* $H$):
$$X(m, \\omega) = \\sum_{n=0}^{N-1} x[n + mH] \\cdot w[n] \\cdot e^{-j \\omega n}$$

Spektrogram magnitudo daya didefinisikan sebagai:
$$P(m, \\omega) = |X(m, \\omega)|^2$$

## 2. Skala Perseptual Mel (Stevens, Volkmann, & Newman, 1937)
Pendengaran manusia memiliki resolusi frekuensi tinggi yang memburuk pada frekuensi di atas 1000 Hz. Skala Mel memetakan frekuensi fisik Hertz ($f$) ke skala persepsi pitch ($m$):

$$m = 2595 \\cdot \\log_{10}\\left( 1 + \\frac{f}{700} \\right) = 1127 \\cdot \\ln\\left( 1 + \\frac{f}{700} \\right)$$

Spektrogram Mel dihasilkan dengan mengalikan matriks daya spektrum dengan bank filter berbentuk segitiga tumpang tindih (*triangular filterbank*) sebanyak $M$ pita frekuensi (umumnya $M = 80$ atau $M = 128$).
`,
        },
      ],
    },
    {
      id: "sph-bab-2",
      slug: "automatic-speech-recognition-ctc-loss",
      title: "BAB 2: Automatic Speech Recognition (ASR) & CTC Loss",
      orderIndex: 2,
      description: "Penjajaran sekuens wicara tak berlabel: algoritma Connectionist Temporal Classification (CTC) Graves et al. 2006, token blank $\\epsilon$, pemrograman dinamis Forward-Backward, dan Beam Search Decoding.",
      subchapters: [
        {
          id: "sph-bab-2-1",
          slug: "formulasi-ctc-loss-dan-pemrograman-dinamis",
          title: "2.1. Formulasi Matematika CTC Loss & Pemrograman Dinamis Forward-Backward",
          orderIndex: 1,
          description: "Menghitung probabilitas marginal seluruh jalur penjajaran yang valid menggunakan operasi collapse $\\mathcal{B}$ dan token blank.",
          content_markdown: `# 2.1. Formulasi Matematika CTC Loss & Pemrograman Dinamis Forward-Backward

## 1. Masalah Penjajaran pada ASR
Panjang frame audio masukan $T$ (misal: 1000 frame) jauh lebih panjang daripada jumlah karakter/kata transkripsi $U$ (misal: 25 huruf), dan kita tidak memiliki anotasi batas waktu setiap fonem.

## 2. Pemetaan Collapse $\\mathcal{B}$
CTC memperkenalkan token kosong (*blank token* $\\epsilon$). Operator $\\mathcal{B}$ menghapus token berulang yang bersebelahan, lalu menghapus seluruh token blank:
$$\\mathcal{B}(\\text{h } \\text{h } \\epsilon \\text{ e } \\text{ l } \\text{ l } \\epsilon \\text{ l } \\text{ o}) = \\text{"hello"}$$

## 3. Probabilitas Rantai dan CTC Loss
Probabilitas target transkripsi $\\mathbf{y}$ adalah jumlah probabilitas seluruh jalur alignment $\\pi$ yang jika di-*collapse* menghasilkan $\\mathbf{y}$:

$$P(\\mathbf{y} \\mid \\mathbf{x}) = \\sum_{\\pi \\in \\mathcal{B}^{-1}(\\mathbf{y})} P(\\pi \\mid \\mathbf{x}) = \\sum_{\\pi \\in \\mathcal{B}^{-1}(\\mathbf{y})} \\prod_{t=1}^T P(\\pi_t \\mid \\mathbf{x}_t)$$

CTC Loss didefinisikan sebagai negative log-likelihood:
$$\\mathcal{L}_{\\text{CTC}} = -\\ln P(\\mathbf{y} \\mid \\mathbf{x})$$

Menggunakan algoritma Forward-Backward dinamis berorde $\\mathcal{O}(T \\cdot U)$, gradien $\\frac{\\partial \\mathcal{L}_{\\text{CTC}}}{\\partial z_t^k}$ dapat dihitung secara analitik untuk setiap frame $t$ dan karakter $k$.
`,
        },
      ],
    },
    {
      id: "sph-bab-3",
      slug: "arsitektur-modern-conformer-dan-whisper",
      title: "BAB 3: Arsitektur Modern ASR: Conformer & OpenAI Whisper",
      orderIndex: 3,
      description: "Model representasi wicara skala industri: modul hibrida Conformer (Macaron FFN, Self-Attention, Depthwise Convolution) dan Whisper multitask sequence-to-sequence Transformer.",
      subchapters: [
        {
          id: "sph-bab-3-1",
          slug: "arsitektur-conformer-dan-whisper",
          title: "3.1. Arsitektur Blok Conformer & Skema Multitask Whisper",
          orderIndex: 1,
          description: "Struktur interleaving modul konvolusi berbobot mendalam untuk menangkap konteks lokal fonetik dan self-attention untuk pemodelan konteks kalimat global.",
          content_markdown: `# 3.1. Arsitektur Blok Conformer & Skema Multitask Whisper

## 1. Blok Conformer (Gulati et al., Interspeech 2020)
Transformer standar unggul menangkap relasi global namun kurang peka terhadap konteks lokal fonetik sinyal audio. Conformer mengintegrasikan keduanya ke dalam struktur *Macaron-style*:

$$y_i^{(1)} = x_i + \\frac{1}{2} \\text{FFN}(x_i)$$
$$y_i^{(2)} = y_i^{(1)} + \\text{MultiHeadSelfAttention}(y_i^{(1)})$$
$$y_i^{(3)} = y_i^{(2)} + \\text{ConvolutionModule}(y_i^{(2)})$$
$$\\text{Output}_i = \\text{LayerNorm}\\left( y_i^{(3)} + \\frac{1}{2} \\text{FFN}(y_i^{(3)}) \\right)$$

Modul konvolusi menggunakan *Depthwise Separable Convolution* dengan aktivasi Swish/GLU untuk membatasi kompleksitas komputasi.

## 2. Skema Multitask Token conditioning Whisper (Radford et al., 2023)
Whisper menggunakan arsitektur Encoder-Decoder standar yang dilatih pada 680.000 jam audio multi-bahasa. Decoder diarahkan menggunakan token kondisi khusus:
$$\\langle|\\text{startoftranscript}|\\rangle \\to \\langle|\\text{language}|\\rangle \\to \\langle|\\text{task}|\\rangle \\to \\langle|\\text{notimestamps}|\\rangle \\to \\text{Tokens}$$
Memungkinkan satu model tunggal melakukan identifikasi bahasa, deteksi aktivitas suara (VAD), ASR, dan penerjemahan wicara langsung ke bahasa Inggris.
`,
        },
      ],
    },
    {
      id: "sph-bab-4",
      slug: "neural-tts-dan-vocoder-hifi-gan",
      title: "BAB 4: Neural Text-to-Speech (TTS) & Vocoder Akustik (HiFi-GAN)",
      orderIndex: 4,
      description: "Generasi wicara sintetis beresolusi tinggi: konversi fonem ke spektrogram Mel (FastSpeech, VITS) dan rekonstruksi bentuk gelombang audio mentah menggunakan HiFi-GAN Vocoder.",
      subchapters: [
        {
          id: "sph-bab-4-1",
          slug: "diskriminator-multi-periode-hifi-gan",
          title: "4.1. Arsitektur Generator & Multi-Period Discriminator (HiFi-GAN)",
          orderIndex: 1,
          description: "Mengapa algoritma klasik Griffin-Lim menghasilkan suara robotik, dan bagaimana diskriminator berbasis periodisitas menghasilkan wicara alami secara real-time.",
          content_markdown: `# 4.1. Arsitektur Generator & Multi-Period Discriminator (HiFi-GAN)

## 1. Masalah Inversi Spektrogram
Spektrogram Mel hanya menyimpan informasi magnitudo $|X(m, \\omega)|$, sedangkan informasi fase $\\angle X(m, \\omega)$ dibuang. Inversi konvensional (*Griffin-Lim Algorithm*) mengestimasi fase secara iteratif lambat dan menghasilkan derau latar berupa desisan artifisial (*phase mismatch*).

## 2. Inovasi HiFi-GAN (Kong et al., NeurIPS 2020)
HiFi-GAN menggunakan arsitektur GAN berkemampuan eksekusi sangat cepat:
- **Generator**: Menggunakan konvolusi transpose 1D untuk melakukan upsampling spektrogram 80-bin Mel ke laju sampel audio penuh (misal: faktor 256x).
- **Multi-Period Discriminator (MPD)**: Terdiri dari beberapa sub-diskriminator yang mencuplik sinyal audio 1D menjadi matriks 2D dengan periode prima diskrit ($p \\in \\{2, 3, 5, 7, 11\\}$) untuk menangkap struktur harmonik nada vokal.
- **Multi-Scale Discriminator (MSD)**: Mengevaluasi bentuk gelombang pada resolusi waktu yang berbeda untuk menjamin konsistensi kontinuitas audio.
`,
        },
      ],
    },
    {
      id: "sph-bab-5",
      slug: "self-supervised-speech-wav2vec2",
      title: "BAB 5: Self-Supervised Audio Representations & Verifikasi Pembicara",
      orderIndex: 5,
      description: "Pembelajaran representasi audio tanpa label: arsitektur Wav2Vec 2.0 (Baevski et al., 2020), kuantisasi vektor laten Gumbel-Softmax, dan verifikasi pembicara (Speaker Verification ECAPA-TDNN).",
      subchapters: [
        {
          id: "sph-bab-5-1",
          slug: "kuantisasi-gumbel-softmax-dan-wav2vec2",
          title: "5.1. Kuantisasi Vektor Gumbel-Softmax & Kontrastif wav2vec 2.0",
          orderIndex: 1,
          description: "Membangun representasi 'kamus fonetik laten' tanpa teks transkripsi menggunakan masking sekuens temporal dan contrastive loss.",
          content_markdown: `# 5.1. Kuantisasi Vektor Gumbel-Softmax & Kontrastif wav2vec 2.0

## 1. Arsitektur wav2vec 2.0
1. **Feature Encoder**: Lapisan konvolusi temporal yang memetakan bentuk gelombang mentah $\\mathcal{X}$ menjadi representasi laten $Z = z_1, \\dots, z_T$.
2. **Context Network (Transformer)**: Mengolah vektor $Z$ yang sebagian di-masking secara acak untuk memprediksi konteks temporal global $C = c_1, \\dots, c_T$.
3. **Quantization Module**: Mengubah representasi kontinu $z_t$ menjadi token diskrit $q_t$ menggunakan $G$ grup codebook berukuran $V$ entri dengan relaksasi **Gumbel-Softmax**:

$$p_{g, v} = \\frac{\\exp\\left( (l_{g, v} + g_{g, v}) / \\tau \\right)}{\\sum_{k=1}^V \\exp\\left( (l_{g, k} + g_{g, k}) / \\tau \\right)}$$

## 2. Metrik Evaluasi ASR: Word Error Rate (WER)
Dihitung berbasis jarak Levenshtein pada tingkat kata:
$$\\text{WER} = \\frac{S + D + I}{N} = \\frac{\\text{Substitutions} + \\text{Deletions} + \\text{Insertions}}{\\text{Total Words in Reference}}$$
`,
        },
      ],
    },
    {
      id: "sph-bab-6",
      slug: "proyek-transkripsi-dan-ekstraksi-audio",
      title: "BAB 6: Proyek Terapan: Pipeline Transkripsi & Ekstraksi Akustik",
      orderIndex: 6,
      description: "Membangun pipeline pengolahan audio lengkap: sintesis nada uji, ekstraksi spektrogram Mel dengan filterbank segitiga, decoding CTC, dan kalkulasi jarak edit Levenshtein WER.",
      subchapters: [
        {
          id: "sph-bab-6-1",
          slug: "lab-spektrogram-dan-wer-python",
          title: "6.1. Proyek Akhir: Ekstraktor Spektrogram Mel & Evaluator WER",
          orderIndex: 1,
          description: "Kode Python mandiri: sintesis sinyal multi-frekuensi, ekstraksi spektrogram daya STFT, dan kalkulasi metrik Word Error Rate.",
          content_markdown: `# 6.1. Proyek Akhir: Ekstraktor Spektrogram Mel & Evaluator WER

## 1. Kode Implementasi Pipa Akustik Terverifikasi
\`\`\`python
import numpy as np

def hz_to_mel(hz: float) -> float:
    """Mengonversi frekuensi Hertz ke skala Mel."""
    return 2595.0 * np.log10(1.0 + hz / 700.0)

def mel_to_hz(mel: float) -> float:
    """Mengonversi skala Mel kembali ke frekuensi Hertz."""
    return 700.0 * (10.0 ** (mel / 2595.0) - 1.0)

def compute_wer(reference: str, hypothesis: str) -> float:
    """Menghitung Word Error Rate (WER) berbasis pemrograman dinamis Levenshtein Distance."""
    ref_words = reference.strip().split()
    hyp_words = hypothesis.strip().split()
    
    n_r = len(ref_words)
    n_h = len(hyp_words)
    
    if n_r == 0:
        return float(n_h)
        
    dp = np.zeros((n_r + 1, n_h + 1), dtype=int)
    for i in range(n_r + 1):
        dp[i, 0] = i
    for j in range(n_h + 1):
        dp[0, j] = j
        
    for i in range(1, n_r + 1):
        for j in range(1, n_h + 1):
            if ref_words[i - 1] == hyp_words[j - 1]:
                dp[i, j] = dp[i - 1, j - 1]
            else:
                substitution = dp[i - 1, j - 1] + 1
                insertion = dp[i, j - 1] + 1
                deletion = dp[i - 1, j] + 1
                dp[i, j] = min(substitution, insertion, deletion)
                
    wer = dp[n_r, n_h] / float(n_r)
    return round(wer, 4)

# 1. Uji Konversi Skala Mel
f_sample = 1000.0
mel_val = hz_to_mel(f_sample)
recovered_hz = mel_to_hz(mel_val)
print(f"Frekuensi Asli : {f_sample:.1f} Hz")
print(f"Nilai Skala Mel: {mel_val:.2f} Mel")
print(f"Rekonstruksi   : {recovered_hz:.1f} Hz")
assert abs(f_sample - recovered_hz) < 1e-4, "Konversi Mel bolak-balik harus presisi."

# 2. Uji Evaluasi Metrik ASR: Word Error Rate (WER)
ref_text = "kecerdasan buatan dan pemrosesan suara modern"
hyp_text = "kecerdasan buatan pada pemrosesan suara modern" # 1 substitusi ('dan' -> 'pada')

wer_score = compute_wer(ref_text, hyp_text)
print(f"\\nKalimat Referensi : '{ref_text}'")
print(f"Kalimat Hipotesis : '{hyp_text}'")
print(f"Word Error Rate   : {wer_score * 100:.2f}% (1 error dari 6 kata)")
assert wer_score == round(1 / 6, 4)
print("=== VERIFIKASI METRIK ASR SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Presisi Transformasi Sinyal (30%)**: Ketepatan rumus konversi frekuensi logaritmik dan penanganan floating point.
- **Implementasi Jarak Levenshtein Dynamic Programming (35%)**: Algoritma penghitungan substitusi, insersi, dan delesi yang efisien $\\mathcal{O}(M \\times N)$.
- **Pemahaman Konseptual Arsitektur ASR (20%)**: Analisis kelemahan transkripsi dan interpretasi metrik WER.
- **Kebersihan Kode & Dokumentasi (15%)**: Struktur kode Python modular dan terdokumentasi rapi.
`,
        },
      ],
    },
  ],
};
