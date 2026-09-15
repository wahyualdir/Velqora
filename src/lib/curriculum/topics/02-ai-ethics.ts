import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: AI ETHICS & RESPONSIBLE AI (TOPIK 2) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Barocas, S., Hardt, M., & Narayanan, A. (2023). Fairness and Machine Learning: Limitations and Opportunities. MIT Press.
 * - Dwork, C., et al. (2006). Calibrating Noise to Sensitivity in Private Data Analysis. TCC 2006.
 * - Kleinberg, J., Mullainathan, S., & Raghavan, M. (2016). Inherent Trade-Offs in the Fair Determination of Risk Scores. Innovations in Theoretical Computer Science (ITCS).
 * - Hardt, M., Price, E., & Srebro, N. (2016). Equality of Opportunity in Supervised Learning. NeurIPS 2016.
 * - UNESCO (2021). Recommendation on the Ethics of Artificial Intelligence.
 */
export const aiEthicsCurriculum: AcademicCurriculum = {
  id: "ai-ethics",
  slug: "ai-ethics-responsible-ai",
  title: "AI Ethics & Responsible AI",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Landasan etika dan rekayasa AI bertanggung jawab: formulasi matematis keadilan (Demographic Parity, Equalized Odds, Disparate Impact), Teorema Impossibility of Fairness, mitigasi bias (Pre/In/Post-processing), Privasi Diferensial formal (Laplace & Gaussian Mechanism), hak atas penjelasan (GDPR Article 22 & Model Cards), serta audit etika terverifikasi.",
  estimatedHours: 48,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Fairness and Machine Learning: Limitations and Opportunities",
      authors: ["Solon Barocas", "Moritz Hardt", "Arvind Narayanan"],
      type: "book",
      url: "https://fairmlbook.org/",
      relevance: "Buku teks rujukan utama konsep formal keadilan matematis, diskriminasi statistik, dan batasannya.",
      year: 2023,
      publisherOrVenue: "MIT Press",
    },
    {
      title: "Inherent Trade-Offs in the Fair Determination of Risk Scores",
      authors: ["Jon Kleinberg", "Sendhil Mullainathan", "Manish Raghavan"],
      type: "paper",
      url: "https://arxiv.org/abs/1609.05807",
      doi: "10.48550/arXiv.1609.05807",
      relevance: "Membuktikan ketidakmungkinan matematis memenuhi kalibrasi dalam kelompok dan equalized odds secara bersamaan.",
      year: 2016,
      publisherOrVenue: "ITCS 2017",
    },
    {
      title: "Calibrating Noise to Sensitivity in Private Data Analysis",
      authors: ["Cynthia Dwork", "Frank McSherry", "Kobbi Nissim", "Adam Smith"],
      type: "paper",
      url: "https://link.springer.com/chapter/10.1007/11681878_14",
      doi: "10.1007/11681878_14",
      relevance: "Perumusan formal Privasi Diferensial (Differential Privacy) dan Mekanisme Laplace.",
      year: 2006,
      publisherOrVenue: "TCC 2006",
    },
  ],
  chapters: [
    {
      id: "eth-bab-1",
      slug: "fondasi-filosofis-dan-prinsip-responsible-ai",
      title: "BAB 1: Fondasi Filosofis & Prinsip Responsible AI",
      orderIndex: 1,
      description: "Prinsip etika universal UNESCO dan OECD, tinjauan filosofis (Utilitarianisme Bentham/Mill, Deontologi Kantian, dan Etika Kebajikan Aristotelian) dalam pengambilan keputusan otomatis, serta pengawasan manusia (Human-in-the-Loop).",
      subchapters: [
        {
          id: "eth-bab-1-1",
          slug: "prinsip-etika-unesco-dan-kerangka-filosofis",
          title: "1.1. Rekomendasi Etika UNESCO & Tiga Kerangka Moral Klasik",
          orderIndex: 1,
          description: "Menganalisis dilema etika kecerdasan buatan dari perspektif konsekuensialis vs imperatif kategoris.",
          content_markdown: `# 1.1. Rekomendasi Etika UNESCO & Tiga Kerangka Moral Klasik

## 1. Tiga Kerangka Filosofis Moral dalam Sistem Keputusan AI
1. **Utilitarianisme (Consequentialism)**:
   Keputusan dinilai bermoral jika memaksimalkan fungsi utilitas total bagi jumlah individu terbesar:
   $$\\max \\sum_{i=1}^N U(a, x_i)$$
   *Bahaya dalam AI*: Dapat menjustifikasi diskriminasi kelompok minoritas demi keuntungan agregat mayoritas.
2. **Deontologi (Kantian Duty Ethics)**:
   Menekankan kewajiban mutlak (*categorical imperative*). Manusia tidak boleh diperlakukan semata-mata sebagai instrumen komputasi untuk mencapai tujuan lain. Mengharuskan penghormatan mutlak terhadap hak asasi tanpa kompromi efisiensi.
3. **Etika Kebajikan (Virtue Ethics)**:
   Berfokus pada karakter dan integritas moral pengembang dan institusi pencipta AI.

## 2. Prinsip Inti Rekomendasi UNESCO (2021)
- **Proporsionalitas & Ketiadaan Kerusakan (*Do No Harm*)**: Penggunaan AI tidak boleh melebihi kebutuhan tujuan yang sah.
- **Keadilan & Non-Diskriminasi**: Menjamin seluruh lapisan masyarakat memiliki akses setara dan bebas bias sistemik.
- **Transparansi & Dapat Dijelaskan (*Explainability*)**: Setiap keputusan yang mempengaruhi harkat manusia wajib dapat diaudit dan dijelaskan alasannya.
- **Keberlanjutan Lingkungan**: Memperhitungkan jejak karbon pelatihan model fondasi raksasa.
`,
        },
      ],
    },
    {
      id: "eth-bab-2",
      slug: "formulasi-matematika-keadilan-algoritmik",
      title: "BAB 2: Formulasi Matematika Keadilan Algoritmik (Fairness)",
      orderIndex: 2,
      description: "Definisi matematis keadilan: Demographic Parity, Equalized Odds, Equal Opportunity, Disparate Impact (aturan 80% EEOC), dan Teorema Ketidakmungkinan Keadilan (Kleinberg et al. 2016).",
      subchapters: [
        {
          id: "eth-bab-2-1",
          slug: "definisi-fairness-dan-teorema-kleinberg",
          title: "2.1. Definisi Formal Metrik Keadilan & Teorema Impossibility Kleinberg",
          orderIndex: 1,
          description: "Penurunan matematis konflik mutlak antara Demographic Parity, Equalized Odds, dan Predictive Value Calibration.",
          content_markdown: `# 2.1. Definisi Formal Metrik Keadilan & Teorema Impossibility Kleinberg

## 1. Notasi Matematika
- $X \\in \\mathbb{R}^d$: Vektor fitur input individu.
- $A \\in \\{0, 1\\}$: Atribut terlindungi / sensitif (*protected attribute*, misal: gender, ras).
- $Y \\in \\{0, 1\\}$: Label ground-truth nyata.
- $\\hat{Y} \\in \\{0, 1\\}$: Prediksi biner model.
- $R \\in [0, 1]$: Skor risiko kontinu model ($P(\\hat{Y}=1 \\mid X)$).

## 2. Tiga Definisi Keadilan Statistik Utama
1. **Demographic Parity (Statistical Parity)**:
   Tingkat penerimaan keputusan harus independen dari kelompok sensitif:
   $$P(\\hat{Y} = 1 \\mid A = 0) = P(\\hat{Y} = 1 \\mid A = 1)$$
   *Kelemahan*: Mengabaikan perbedaan kualifikasi riil ($Y$) antar kelompok jika terdapat ketimpangan historis.
2. **Equal Opportunity (Hardt et al., 2016)**:
   Tingkat True Positive Rate (TPR) harus setara antar kelompok yang memang berkualifikasi ($Y = 1$):
   $$P(\\hat{Y} = 1 \\mid A = 0, Y = 1) = P(\\hat{Y} = 1 \\mid A = 1, Y = 1)$$
3. **Equalized Odds**:
   Mengharuskan kesetaraan simultan untuk True Positive Rate (TPR) dan False Positive Rate (FPR):
   $$P(\\hat{Y} = 1 \\mid A = 0, Y = y) = P(\\hat{Y} = 1 \\mid A = 1, Y = y), \\quad \\forall y \\in \\{0, 1\\}$$

## 3. Teorema Ketidakmungkinan Keadilan (Kleinberg et al., 2016)
Jika prevalensi dasar kedua kelompok berbeda ($P(Y=1 \\mid A=0) \\neq P(Y=1 \\mid A=1)$), secara matematis **TIDAK MUNGKIN** bagi suatu model untuk memenuhi ketiga kondisi berikut secara serentak:
1. *Sufficiency* (Kalibrasi probabilitas antar kelompok sama).
2. *Separation* (Equalized Odds).
3. *Independence* (Demographic Parity).
Pengembang AI **wajib memilih trade-off etika** yang sesuai dengan konteks hukum dan sosial.
`,
        },
      ],
    },
    {
      id: "eth-bab-3",
      slug: "mitigasi-bias-algoritmik",
      title: "BAB 3: Teknik Mitigasi Bias: Pre-, In-, dan Post-Processing",
      orderIndex: 3,
      description: "Intervensi rekayasa penanggulangan bias: Reweighing data latih (Pre-processing), Adversarial Debiasing & optimasi berkendala (In-processing), dan Penyetelan ambang batas Equalized Odds (Post-processing).",
      subchapters: [
        {
          id: "eth-bab-3-1",
          slug: "tiga-tahap-mitigasi-bias",
          title: "3.1. Taksonomi Intervensi Mitigasi Bias Algoritmik",
          orderIndex: 1,
          description: "Kelebihan dan kekurangan intervensi pada data mentah, fungsi objektif pelatihan, dan kalibrasi ambang batas keluaran.",
          content_markdown: `# 3.1. Taksonomi Intervensi Mitigasi Bias Algoritmik

## 1. Pre-Processing: Reweighing (Kamiran & Calders, 2012)
Mengubah bobot sampel $W(X, A, Y)$ pada data latih tanpa memodifikasi algoritma:

$$W(a, y) = \\frac{P(A = a) \\cdot P(Y = y)}{P(A = a, Y = y)}$$
Membuat atribut sensitif $A$ dan label target $Y$ menjadi independen secara statistik sebelum proses pembelajaran dimulai.

## 2. In-Processing: Adversarial Debiasing (Zhang et al., 2018)
Dua model dilatih bersamaan dalam kerangka minimax:
- **Predictor Model**: Memprediksi target $Y$ dari fitur non-sensitif $X$.
- **Adversary Model**: Berusaha memprediksi atribut sensitif $A$ dari representasi tersembunyi atau prediksi $\\hat{Y}$.
Predictor dioptimalkan untuk meminimalkan loss klasifikasi target sekaligus memaksimalkan entropi/kebingungan Adversary.

## 3. Post-Processing: Threshold Moving (Hardt et al., 2016)
Model dilatih secara standar tanpa modifikasi. Saat inferensi, kita menetapkan ambang batas keputusan (*threshold*) yang berbeda untuk masing-masing kelompok:
$$\\tau_0 \\neq \\tau_1$$
Sehingga $\\hat{Y}_a = \\mathbf{1}_{R > \\tau_a}$ memenuhi kriteria Equalized Odds atau Equal Opportunity secara presisi.
`,
        },
      ],
    },
    {
      id: "eth-bab-4",
      slug: "privasi-diferensial-dan-keamanan-data",
      title: "BAB 4: Privasi Diferensial & Keamanan Data Algoritmik",
      orderIndex: 4,
      description: "Jaminan privasi matematis provable: formulasi $(\\epsilon, \\delta)$-Differential Privacy (Dwork et al. 2006), sensitivitas global $\\Delta f$, Mekanisme Laplace, Mekanisme Gaussian, dan DP-SGD.",
      subchapters: [
        {
          id: "eth-bab-4-1",
          slug: "definisi-differential-privacy-dan-laplace",
          title: "4.1. Formulasi Matematika $(\\epsilon, \\delta)$-DP & Mekanisme Laplace",
          orderIndex: 1,
          description: "Membatasi rasio probabilitas keluaran pada dua dataset tetangga yang berselisih tepat satu individu, dan penambahan derau terkalibrasi.",
          content_markdown: `# 4.1. Formulasi Matematika $(\\epsilon, \\delta)$-DP & Mekanisme Laplace

## 1. Definisi Formal Privasi Diferensial (Cynthia Dwork et al., 2006)
Algoritma acak $\\mathcal{M}$ dikatakan memenuhi **$(\\epsilon, \\delta)$-Differential Privacy** jika untuk setiap pasangan dataset tetangga $D, D'$ yang berselisih paling banyak satu rekaman individu ($\\|D - D'\\|_1 \\le 1$), dan untuk setiap himpunan kemungkinan keluaran $S \\subseteq \\text{Range}(\\mathcal{M})$:

$$P(\\mathcal{M}(D) \\in S) \\le e^\\epsilon \\cdot P(\\mathcal{M}(D') \\in S) + \\delta$$

Di mana:
- $\\epsilon > 0$ (*Privacy Budget*): Mengatur kebocoran privasi maksimum (nilai kecil $\\implies$ privasi sangat ketat).
- $\\delta \\ge 0$: Probabilitas toleransi kegagalan jaminan privasi (umumnya $\\delta \\ll \\frac{1}{|D|}$). Jika $\\delta = 0$, disebut *Pure $\\epsilon$-DP*.

## 2. Sensitivitas Global & Mekanisme Laplace
Sensitivitas $L_1$ dari suatu fungsi kueri $f: \\mathcal{D} \\to \\mathbb{R}^k$ didefinisikan sebagai perubahan keluaran maksimum akibat penambahan/penghapusan 1 orang:
$$\\Delta f = \\max_{D, D': \\|D - D'\\| \\le 1} \\|f(D) - f(D')\\|_1$$

**Mekanisme Laplace**: Menambahkan derau dari distribusi Laplace terpusat nol dengan parameter skala $b = \\frac{\\Delta f}{\\epsilon}$:

$$\\mathcal{M}(D) = f(D) + \\text{Laplace}\\left( 0, \\; \\frac{\\Delta f}{\\epsilon} \\right)$$

Jaminan matematis: Mekanisme ini memenuhi pure $\\epsilon$-Differential Privacy secara ketat.
`,
        },
      ],
    },
    {
      id: "eth-bab-5",
      slug: "hak-atas-penjelasan-dan-model-cards",
      title: "BAB 5: Hak Atas Penjelasan, Transparansi & Model Cards",
      orderIndex: 5,
      description: "Regulasi hak atas penjelasan (GDPR Article 22), standar dokumentasi akuntabilitas Model Cards for Model Reporting (Mitchell et al. 2019), dan Datasheets for Datasets (Gebru et al.).",
      subchapters: [
        {
          id: "eth-bab-5-1",
          slug: "gdpr-article-22-dan-standar-model-cards",
          title: "5.1. Regulasi Hak Penjelasan (GDPR) & Spesifikasi Model Cards",
          orderIndex: 1,
          description: "Persyaratan hukum penolakan keputusan otomatis dan 9 seksi standar dokumentasi model transparansi industri.",
          content_markdown: `# 5.1. Regulasi Hak Penjelasan (GDPR) & Spesifikasi Model Cards

## 1. Regulasi GDPR Article 22 (European Union)
Setiap warga negara berhak untuk **tidak tunduk** pada keputusan yang semata-mata didasarkan pada pemrosesan otomatis (termasuk pembuatan profil) yang menimbulkan dampak hukum signifikan baginya.
Jika keputusan otomatis digunakan:
1. Individu berhak memperoleh **penjelasan yang bermakna** mengenai logika pengambilan keputusan (*meaningful information about the logic involved*).
2. Individu berhak meminta **intervensi manusia** (*human intervention*) untuk meninjau kembali keputusan tersebut.

## 2. Standar Model Cards for Model Reporting (Mitchell et al., 2019)
Setiap model AI yang dirilis ke publik atau enterprise wajib disertai dokumen akuntabilitas yang mencakup:
1. **Model Details**: Versi, jenis arsitektur, dan tanggal pembuatan.
2. **Intended Use**: Kasus penggunaan yang diizinkan (*in-scope*) dan yang dilarang (*out-of-scope*).
3. **Factors & Demographic Subgroups**: Karakteristik populasi yang dianalisis.
4. **Metrics**: Pengukuran performa melintasi sub-grup demografis berbeda.
5. **Training & Evaluation Data**: Asal-usul data dan metode pembersihan.
6. **Ethical Considerations & Limitations**: Batasan operasional dan potensi risiko sosial.
`,
        },
      ],
    },
    {
      id: "eth-bab-6",
      slug: "proyek-audit-fairness-dan-differential-privacy",
      title: "BAB 6: Proyek Terapan: Framework Audit Keadilan Algoritmik & DP Mechanism",
      orderIndex: 6,
      description: "Membangun sistem audit etika AI mandiri: implementasi metrik Disparate Impact dan Equalized Odds dari nol pada dataset keputusan penerimaan, serta simulasi mekanisme Privasi Diferensial Laplace.",
      subchapters: [
        {
          id: "eth-bab-6-1",
          slug: "proyek-akhir-fairness-audit-dan-dp-python",
          title: "6.1. Proyek Akhir: Engine Audit Disparate Impact & Pelindung Privasi Laplace",
          orderIndex: 1,
          description: "Kode Python mandiri: kalkulasi rasio disparate impact, pengujian aturan 80% EEOC, evaluasi perbedaan TPR/FPR, dan injeksi derau privasi diferensial.",
          content_markdown: `# 6.1. Proyek Akhir: Engine Audit Disparate Impact & Pelindung Privasi Laplace

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
import numpy as np
from typing import Dict, Any

class AlgorithmicFairnessAuditor:
    """Engine Audit Keadilan Algoritmik Terstandarisasi."""
    def __init__(self, y_true: np.ndarray, y_pred: np.ndarray, protected_attr: np.ndarray):
        self.y_true = y_true.astype(int)
        self.y_pred = y_pred.astype(int)
        self.prot = protected_attr.astype(int)

    def audit_disparate_impact(self) -> Dict[str, float]:
        """
        Menghitung Rasio Disparate Impact (Demographic Parity):
        DI = P(Y_hat=1 | A=0) / P(Y_hat=1 | A=1)
        Berdasarkan aturan 4/5 (80%) EEOC, DI < 0.80 mengindikasikan diskriminasi merugikan.
        """
        mask_unprot = (self.prot == 1) # Kelompok Mayoritas
        mask_prot = (self.prot == 0)   # Kelompok Minoritas / Terlindungi

        rate_unprot = np.mean(self.y_pred[mask_unprot])
        rate_prot = np.mean(self.y_pred[mask_prot])

        di_ratio = rate_prot / (rate_unprot + 1e-12)
        return {
            "rate_privileged": float(rate_unprot),
            "rate_unprivileged": float(rate_prot),
            "disparate_impact_ratio": float(di_ratio),
            "is_adverse_impact": bool(di_ratio < 0.80)
        }

    def audit_equalized_odds(self) -> Dict[str, float]:
        """Menghitung perbedaan True Positive Rate (TPR) dan False Positive Rate (FPR) antar kelompok."""
        tpr_diff = abs(
            np.mean(self.y_pred[(self.prot == 1) & (self.y_true == 1)]) -
            np.mean(self.y_pred[(self.prot == 0) & (self.y_true == 1)])
        )
        fpr_diff = abs(
            np.mean(self.y_pred[(self.prot == 1) & (self.y_true == 0)]) -
            np.mean(self.y_pred[(self.prot == 0) & (self.y_true == 0)])
        )
        return {
            "tpr_gap": float(tpr_diff),
            "fpr_gap": float(fpr_diff),
            "equalized_odds_violation": float(max(tpr_diff, fpr_diff))
        }

class DifferentiallyPrivateAggregator:
    """Mekanisme Laplace untuk agregasi data sensitif dengan jaminan epsilon-DP."""
    def __init__(self, epsilon: float = 0.5):
        self.epsilon = epsilon

    def private_count(self, true_count: int) -> float:
        # Sensitivitas L1 dari fungsi penghitungan jumlah individu adalah delta f = 1
        scale = 1.0 / self.epsilon
        noise = np.random.laplace(0.0, scale)
        return float(true_count + noise)

# --- Demonstrasi Uji Audit Etika & Privasi ---
np.random.seed(42)
n_applicants = 1000

# 60% Mayoritas (A=1), 40% Minoritas (A=0)
A = np.random.choice([0, 1], size=n_applicants, p=[0.40, 0.60])
# Kualifikasi ground-truth Y (setara di kedua kelompok: rata-rata 50%)
Y_true = np.random.choice([0, 1], size=n_applicants, p=[0.50, 0.50])

# Simulasi Model yang Memiliki Bias Diskriminatif:
# Model lebih cenderung meluluskan kelompok Mayoritas A=1
Y_pred = np.where(
    A == 1,
    np.random.choice([0, 1], size=n_applicants, p=[0.30, 0.70]), # 70% diluluskan
    np.random.choice([0, 1], size=n_applicants, p=[0.65, 0.35])  # Hanya 35% diluluskan
)

# 1. Jalankan Audit Keadilan
auditor = AlgorithmicFairnessAuditor(Y_true, Y_pred, A)
di_metrics = auditor.audit_disparate_impact()
eq_metrics = auditor.audit_equalized_odds()

print("=== HASIL AUDIT KEADILAN ALGORITMIK ===")
print(f"Tingkat Kelulusan Kelompok Mayoritas : {di_metrics['rate_privileged']*100:.2f}%")
print(f"Tingkat Kelulusan Kelompok Minoritas : {di_metrics['rate_unprivileged']*100:.2f}%")
print(f"Rasio Disparate Impact (DI)          : {di_metrics['disparate_impact_ratio']:.4f}")
print(f"Pelanggaran Aturan 80% EEOC         : {di_metrics['is_adverse_impact']} (DISKRIANATIF)")
print(f"Kesenjangan True Positive Rate (TPR) : {eq_metrics['tpr_gap']:.4f}")

assert di_metrics["is_adverse_impact"] is True, "Model bias harus terdeteksi oleh audit."

# 2. Uji Pelindung Privasi Diferensial Laplace
dp_guard = DifferentiallyPrivateAggregator(epsilon=0.5)
real_approved_count = int(np.sum(Y_pred))
priv_approved_count = dp_guard.private_count(real_approved_count)

print("\\n=== HASIL PRIVASI DIFERENSIAL (EPSILON = 0.5) ===")
print(f"Jumlah Asli yang Diluluskan    : {real_approved_count}")
print(f"Jumlah Terproteksi Derau DP    : {priv_approved_count:.2f}")
print("=== VERIFIKASI AUDIT ETIKA & PRIVASI SUKSES ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Ketepatan Rumus Disparate Impact & Equalized Odds (35%)**: Pembagian probabilitas kondisional yang tepat dan kepatuhan pada aturan 80% EEOC.
- **Implementasi Mekanisme Laplace DP (35%)**: Kalkulasi skala derau $b = \\Delta f / \\epsilon$ yang presisi dan pemahaman privasi formal.
- **Analisis Kritis Trade-Off (15%)**: Pembahasan mengenai Teorema Ketidakmungkinan Kleinberg.
- **Kualitas Kerapian Arsitektur Kode (15%)**: Kode Python modular dengan penanganan pembagian nol dan assertion terverifikasi.
`,
        },
      ],
    },
  ],
};
