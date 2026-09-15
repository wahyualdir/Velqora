import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: ROBOTICS & EMBODIED AI (TOPIK 25) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Craig, J. J. (2005). Introduction to Robotics: Mechanics and Control (3rd ed.). Pearson/Prentice Hall.
 * - Thrun, S., Burgard, W., & Fox, D. (2005). Probabilistic Robotics. MIT Press.
 * - LaValle, S. M. (2006). Planning Algorithms. Cambridge University Press.
 * - Brohan, A., et al. (2023). RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control. CoRL 2023.
 * - Chi, C., et al. (2023). Diffusion Policy: Visuomotor Policy Learning via Action Diffusion. RSS 2023.
 */
export const roboticsEmbodiedAiCurriculum: AcademicCurriculum = {
  id: "robotics-embodied-ai",
  slug: "robotics-embodied-ai",
  title: "Robotics & Embodied AI",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Prinsip mekanika, persepsi, dan kecerdasan embodied robot: kinematika maju dan balik (konvensi Denavit-Hartenberg & matriks Jacobian), dinamika manipulator Euler-Lagrange, kontroler PID & Computed-Torque, perencanaan gerak ruang konfigurasi (RRT & RRT*), lokalisasi probabilistik dan SLAM, serta Vision-Language-Action (VLA) models.",
  estimatedHours: 58,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Introduction to Robotics: Mechanics and Control (3rd Edition)",
      authors: ["John J. Craig"],
      type: "book",
      url: "https://www.pearson.com/",
      relevance: "Buku teks definitif transformasi koordinat homogen, parameter Denavit-Hartenberg, dan dinamika manipulator robot.",
      year: 2005,
      publisherOrVenue: "Pearson / Prentice Hall",
    },
    {
      title: "Probabilistic Robotics",
      authors: ["Sebastian Thrun", "Wolfram Burgard", "Dieter Fox"],
      type: "book",
      url: "https://www.probabilistic-robotics.org/",
      relevance: "Fondasi matematis Extended Kalman Filter, Particle Filter, dan algoritma FastSLAM untuk navigasi otonom.",
      year: 2005,
      publisherOrVenue: "MIT Press",
    },
    {
      title: "Planning Algorithms",
      authors: ["Steven M. LaValle"],
      type: "book",
      url: "http://planning.cs.uiuc.edu/",
      relevance: "Teori ruang konfigurasi (C-Space) dan algoritma perencanaan jalur berbasis graf acak (RRT/PRM).",
      year: 2006,
      publisherOrVenue: "Cambridge University Press",
    },
    {
      title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      authors: ["Anthony Brohan", "Noah Brown", "Justice Carbajal", "Yevgen Chebotar", "et al."],
      type: "paper",
      url: "https://arxiv.org/abs/2307.15818",
      doi: "10.48550/arXiv.2307.15818",
      relevance: "Menggabungkan VLM multimodal dengan kontrol end-effector robotik untuk generalisasi tindakan otonom.",
      year: 2023,
      publisherOrVenue: "CoRL 2023",
    },
  ],
  chapters: [
    {
      id: "rob-bab-1",
      slug: "kinematika-dan-transformasi-koordinat",
      title: "BAB 1: Transformasi Spasial Homogen & Kinematika DH Robot",
      orderIndex: 1,
      description: "Matriks rotasi $SO(3)$, representasi kuaternion unit, matriks transformasi homogen $SE(3)$, konvensi 4 parameter Denavit-Hartenberg ($a, \\alpha, d, \\theta$), dan Forward Kinematics.",
      subchapters: [
        {
          id: "rob-bab-1-1",
          slug: "parameter-denavit-hartenberg-dan-matriks-transformasi",
          title: "1.1. Konvensi Denavit-Hartenberg (DH) & Matriks Transformasi Homogen",
          orderIndex: 1,
          description: "Menghubungkan frame koordinat sendi $i-1$ ke $i$ menggunakan rotasi dan translasi di sepanjang sumbu $z$ dan $x$.",
          content_markdown: `# 1.1. Konvensi Denavit-Hartenberg (DH) & Matriks Transformasi Homogen

## 1. Empat Parameter Standar Denavit-Hartenberg
Setiap sambungan (*joint*) dalam rantai kinematika robotik ditentukan oleh 4 parameter geometris:
1. **Panjang Tautan ($a_i$)**: Jarak terpendek sepanjang sumbu $x_i$ antara $z_{i-1}$ dan $z_i$.
2. **Kemiringan Tautan ($\\alpha_i$)**: Sudut rotasi sekitar sumbu $x_i$ dari $z_{i-1}$ ke $z_i$.
3. **Pergeseran Sambungan ($d_i$)**: Jarak sepanjang sumbu $z_{i-1}$ dari $x_{i-1}$ ke $x_i$ (variabel pada sendi prismatik).
4. **Sudut Sambungan ($\\theta_i$)**: Sudut rotasi sekitar sumbu $z_{i-1}$ dari $x_{i-1}$ ke $x_i$ (variabel pada sendi revolut).

## 2. Matriks Transformasi Homogen Antar Sendi
Matriks transformasi $4 \\times 4$ yang memetakan frame $i$ relatif terhadap frame $i-1$:

$$T_{i-1}^i = \\begin{bmatrix} 
\\cos\\theta_i & -\\sin\\theta_i \\cos\\alpha_i & \\sin\\theta_i \\sin\\alpha_i & a_i \\cos\\theta_i \\\\ 
\\sin\\theta_i & \\cos\\theta_i \\cos\\alpha_i & -\\cos\\theta_i \\sin\\alpha_i & a_i \\sin\\theta_i \\\\ 
0 & \\sin\\alpha_i & \\cos\\alpha_i & d_i \\\\ 
0 & 0 & 0 & 1 
\\end{bmatrix}$$

Posisi dan orientasi ujung lengan (*end-effector*) terhadap pangkal dasar robot ($T_0^n$) dihitung melalui perkalian rantai matriks:
$$T_0^n = T_0^1 \\cdot T_1^2 \\cdot T_2^3 \\cdots T_{n-1}^n$$
`,
        },
      ],
    },
    {
      id: "rob-bab-2",
      slug: "kinematika-balik-dan-matriks-jacobian",
      title: "BAB 2: Kinematika Balik & Matriks Jacobian Diferensial",
      orderIndex: 2,
      description: "Solusi analitik vs numerik Inverse Kinematics (IK), hubungan kecepatan diferensial $\\dot{\\mathbf{x}} = \\mathbf{J}(\\mathbf{q}) \\dot{\\mathbf{q}}$, analisis singularitas kinematik, dan metode Damped Least Squares (Levenberg-Marquardt).",
      subchapters: [
        {
          id: "rob-bab-2-1",
          slug: "jacobian-dan-singularitas-kinematika",
          title: "2.1. Matriks Jacobian Geometri & Analisis Singularitas Manipulator",
          orderIndex: 1,
          description: "Memetakan kecepatan ruang sendi $\\dot{\\mathbf{q}}$ ke kecepatan linear dan angular end-effector $\\mathbf{v}$, serta kondisi hilang derajat kebebasan $(\\det(\\mathbf{J}) = 0)$.",
          content_markdown: `# 2.1. Matriks Jacobian Geometri & Analisis Singularitas Manipulator

## 1. Hubungan Kecepatan Diferensial
Kecepatan linear $\\mathbf{v}$ dan angular $\\boldsymbol{\\omega}$ dari end-effector dihubungkan dengan kecepatan sudut sendi $\\dot{\\mathbf{q}} \\in \\mathbb{R}^n$ melalui matriks Jacobian $\\mathbf{J}(\\mathbf{q}) \\in \\mathbb{R}^{6 \\times n}$:

$$\\begin{bmatrix} \\mathbf{v} \\\\ \\boldsymbol{\\omega} \\end{bmatrix} = \\mathbf{J}(\\mathbf{q}) \\dot{\\mathbf{q}}$$

Untuk sendi revolut ke-$i$, kolom ke-$i$ dari Jacobian dihitung sebagai:
$$\\mathbf{J}_i = \\begin{bmatrix} \\mathbf{z}_{i-1} \\times (\\mathbf{p}_n - \\mathbf{p}_{i-1}) \\\\ \\mathbf{z}_{i-1} \\end{bmatrix}$$
Di mana $\\mathbf{z}_{i-1}$ adalah vektor sumbu rotasi sendi $i$, dan $\\mathbf{p}_n - \\mathbf{p}_{i-1}$ adalah vektor posisi dari sendi $i$ ke end-effector.

## 2. Singularitas Kinematika & Damped Least Squares
Ketika konfigurasi sendi membuat $\\det(\\mathbf{J}(\\mathbf{q})) = 0$ (atau kehilangan peringkat rank), robot berada pada posisi **singular**. Pada titik ini:
- Robot kehilangan kemampuan bergerak pada arah spasial tertentu.
- Inversi matriks naif $\\dot{\\mathbf{q}} = \\mathbf{J}^{-1} \\dot{\\mathbf{x}}$ menghasilkan kecepatan sendi tak berhingga (motor mengalami saturasi).

Solusi kestabilan numerik menggunakan **Damped Least Squares (DLS)**:
$$\\mathbf{J}^{\\dagger} = \\mathbf{J}^T (\\mathbf{J} \\mathbf{J}^T + \\lambda^2 \\mathbf{I})^{-1}$$
Di mana $\\lambda > 0$ adalah faktor peredam (*damping factor*).
`,
        },
      ],
    },
    {
      id: "rob-bab-3",
      slug: "dinamika-manipulator-dan-kontrol-gerak",
      title: "BAB 3: Dinamika Manipulator Euler-Lagrange & Kontrol Gerak",
      orderIndex: 3,
      description: "Persamaan gerak Lagrange, matriks inersia sendi $M(q)$, gaya Coriolis & sentrifugal $C(q, \\dot{q})$, vektor gravitasi $g(q)$, serta arsitektur kontroler loop tertutup PID dan Computed-Torque Control.",
      subchapters: [
        {
          id: "rob-bab-3-1",
          slug: "persamaan-dinamika-dan-computed-torque",
          title: "3.1. Dinamika Manipulator Sendi & Kendali Torsi Terkomputasi",
          orderIndex: 1,
          description: "Formulasi torsi motor $\\boldsymbol{\\tau} = \\mathbf{M}(\\mathbf{q})\\ddot{\\mathbf{q}} + \\mathbf{C}(\\mathbf{q}, \\dot{\\mathbf{q}})\\dot{\\mathbf{q}} + \\mathbf{g}(\\mathbf{q})$ dan linearisasi feedback.",
          content_markdown: `# 3.1. Dinamika Manipulator Sendi & Kendali Torsi Terkomputasi

## 1. Persamaan Gerak Euler-Lagrange
Dinamika lengan robot $n$-derajat kebebasan dirumuskan secara kompak dalam ruang sendi:

$$\\mathbf{M}(\\mathbf{q}) \\ddot{\\mathbf{q}} + \\mathbf{C}(\\mathbf{q}, \\dot{\\mathbf{q}}) \\dot{\\mathbf{q}} + \\mathbf{g}(\\mathbf{q}) = \\boldsymbol{\\tau}$$

Di mana:
- $\\mathbf{M}(\\mathbf{q}) \\in \\mathbb{R}^{n \\times n}$: Matriks inersia simetris positif definit.
- $\\mathbf{C}(\\mathbf{q}, \\dot{\\mathbf{q}}) \\in \\mathbb{R}^{n \\times n}$: Matriks torsi gaya Coriolis dan sentrifugal.
- $\\mathbf{g}(\\mathbf{q}) \\in \\mathbb{R}^n$: Vektor torsi akibat pengaruh percepatan gravitasi bumi.
- $\\boldsymbol{\\tau} \\in \\mathbb{R}^n$: Vektor torsi input yang dihasilkan aktuator motor servo.

## 2. Kendali Torsi Terkomputasi (Computed-Torque Control)
Merupakan metode linearisasi umpan balik (*feedback linearization*). Kita mendefinisikan akselerasi virtual $\\mathbf{u}$:
$$\\mathbf{u} = \\ddot{\\mathbf{q}}_d + \\mathbf{K}_v (\\dot{\\mathbf{q}}_d - \\dot{\\mathbf{q}}) + \\mathbf{K}_p (\\mathbf{q}_d - \\mathbf{q})$$

Torsi motor yang dikirimkan:
$$\\boldsymbol{\\tau} = \\mathbf{M}(\\mathbf{q}) \\mathbf{u} + \\mathbf{C}(\\mathbf{q}, \\dot{\\mathbf{q}}) \\dot{\\mathbf{q}} + \\mathbf{g}(\\mathbf{q})$$

Menjadikan sistem dinamika non-linear robot tereduksi menjadi $n$ sistem osilator harmonik linier orde dua independen tanpa kopling sendi:
$$\\ddot{\\mathbf{e}} + \\mathbf{K}_v \\dot{\\mathbf{e}} + \\mathbf{K}_p \\mathbf{e} = \\mathbf{0}$$
Menjamin galat lintasan $\\mathbf{e}(t) = \\mathbf{q}_d(t) - \\mathbf{q}(t)$ meluruh secara asimtotik ke nol.
`,
        },
      ],
    },
    {
      id: "rob-bab-4",
      slug: "perencanaan-gerak-dan-c-space",
      title: "BAB 4: Perencanaan Gerak & Ruang Konfigurasi (C-Space)",
      orderIndex: 4,
      description: "Konsep matematis Configuration Space ($C_{\\text{free}}$ dan $C_{\\text{obs}}$), algoritma perencanaan berbasis sampling acak: Probabilistic Roadmaps (PRM), Rapidly-exploring Random Trees (RRT), dan RRT* optimal asimtotik.",
      subchapters: [
        {
          id: "rob-bab-4-1",
          slug: "algoritma-rrt-dan-rrt-star",
          title: "4.1. Algoritma Perencanaan Lintasan RRT & RRT*",
          orderIndex: 1,
          description: "Mekanisme sampling acak ruang dimensi tinggi, fungsi nearest neighbor, pemanjangan cabang terarah (*steer*), dan optimasi rewiring lokal RRT*.",
          content_markdown: `# 4.1. Algoritma Perencanaan Lintasan RRT & RRT*

## 1. Konseptual Ruang Konfigurasi (LaValle, 2006)
Di dalam ruang kerja fisik $\\mathcal{W} = \\mathbb{R}^2$ atau $\\mathbb{R}^3$, bentuk geometri robot dapat rumit. Dalam **Ruang Konfigurasi** ($\\mathcal{C}$), seluruh postur robot dipetakan menjadi sebuah titik tunggal $\\mathbf{q} = (\\theta_1, \\dots, \\theta_n) \\in \\mathcal{C}$.
- $\\mathcal{C}_{\\text{obs}}$: Himpunan konfigurasi yang menyebabkan tabrakan fisik dengan rintangan.
- $\\mathcal{C}_{\\text{free}} = \\mathcal{C} \\setminus \\mathcal{C}_{\\text{obs}}$: Himpunan konfigurasi bebas tabrakan.

## 2. Algoritma Rapidly-exploring Random Trees (RRT)
1. Inisialisasi pohon pencarian $\\mathcal{T}$ dengan simpul awal $\\mathbf{q}_{\\text{start}}$.
2. Ambil sampel titik acak $\\mathbf{q}_{\\text{rand}} \\sim \\text{Uniform}(\\mathcal{C})$.
3. Temukan simpul terdekat pada pohon: $\\mathbf{q}_{\\text{near}} = \\arg\\min_{\\mathbf{q} \\in \\mathcal{V}} \\|\\mathbf{q} - \\mathbf{q}_{\\text{rand}}\\|$.
4. Rentangkan cabang ke arah $\\mathbf{q}_{\\text{rand}}$ sejauh langkah maksimum $\\Delta t$:
   $$\\mathbf{q}_{\\text{new}} = \\mathbf{q}_{\\text{near}} + \\min(\\Delta t, \\|\\mathbf{q}_{\\text{rand}} - \\mathbf{q}_{\\text{near}}\\|) \\frac{\\mathbf{q}_{\\text{rand}} - \\mathbf{q}_{\\text{near}}}{\\|\\mathbf{q}_{\\text{rand}} - \\mathbf{q}_{\\text{near}}\\|}$$
5. Jika segmen garis $(\\mathbf{q}_{\\text{near}}, \\mathbf{q}_{\\text{new}}) \\subset \\mathcal{C}_{\\text{free}}$, tambahkan $\\mathbf{q}_{\\text{new}}$ ke pohon.

RRT* menambahkan langkah **Rewiring**: memeriksa tetangga dalam radius $r$ untuk memperpendek biaya lintasan kumulatif menuju solusi optimal asimtotik ($c(t) \\to c^*$).
`,
        },
      ],
    },
    {
      id: "rob-bab-5",
      slug: "lokalisasi-probabilistik-dan-slam",
      title: "BAB 5: Lokalisasi Probabilistik & SLAM",
      orderIndex: 5,
      description: "Navigasi dalam lingkungan tak pasti: model gerak dan pengukuran probabilistik, Extended Kalman Filter (EKF), Particle Filter (Monte Carlo Localization), dan Simultaneous Localization and Mapping (GraphSLAM).",
      subchapters: [
        {
          id: "rob-bab-5-1",
          slug: "filter-bayes-dan-particle-filter",
          title: "5.1. Rekursi Filter Bayes & Particle Filter (MCL)",
          orderIndex: 1,
          description: "Distribusi keyakinan (*Belief state*), langkah prediksi dan pembaruan pengukuran sensor (LIDAR/sonar), serta resampling berbasis bobot partikel.",
          content_markdown: `# 5.1. Rekursi Filter Bayes & Particle Filter (MCL)

## 1. Rekursi Filter Bayes Teoretis
Sistem robotik memelihara distribusi probabilitas atas keadaan posenya $x_t$:

$$\\text{bel}(x_t) = p(x_t \\mid z_{1:t}, u_{1:t})$$

Diperbarui secara berulang dalam dua tahap:
1. **Prediction Step (Model Gerak)**:
   $$\\overline{\\text{bel}}(x_t) = \\int p(x_t \\mid u_t, x_{t-1}) \\text{bel}(x_{t-1}) \\, dx_{t-1}$$
2. **Correction Step (Model Pengukuran Sensor)**:
   $$\\text{bel}(x_t) = \\eta \\cdot p(z_t \\mid x_t) \\overline{\\text{bel}}(x_t)$$
Di mana $\\eta$ adalah konstanta normalisasi probabilitas.

## 2. Monte Carlo Localization (Particle Filter)
Karena lingkungan nyata bersifat non-Gaussian dan multi-modal (misal: robot berada di salah satu dari tiga lorong identik), Particle Filter merepresentasikan $\\text{bel}(x_t)$ menggunakan $M$ partikel acak:
$$\\mathcal{X}_t = \\{ \\langle x_t^{[m]}, w_t^{[m]} \\rangle \\}_{m=1}^M$$
- Partikel digerakkan mengikuti model kinematika odometri dengan derau Gaussian.
- Bobot kepentingan $w_t^{[m]} = p(z_t \\mid x_t^{[m]})$ dihitung berdasarkan kesesuaian pengukuran sensor nyata dengan peta lingkungan.
- Partikel di-resample dengan probabilitas sebanding dengan bobotnya (*Importance Resampling*).
`,
        },
      ],
    },
    {
      id: "rob-bab-6",
      slug: "embodied-ai-dan-vla-models",
      title: "BAB 6: Embodied AI, Model VLA & Policy Diffusion",
      orderIndex: 6,
      description: "Konvergensi model bahasa-visi dan aktuasi robotik fisik: Robotic Transformer (RT-1, RT-2), Diffusion Policy untuk pembelajaran kontrol presisi, dan transfer Sim-to-Real.",
      subchapters: [
        {
          id: "rob-bab-6-1",
          slug: "arsitektur-rt2-dan-diffusion-policy",
          title: "6.1. Model Vision-Language-Action (RT-2) & Diffusion Policy",
          orderIndex: 1,
          description: "Representasi tindakan fisik sebagai token teks diskrit dalam model multimodal raksasa dan generasi trajektori berbasis proses difusi terbalik.",
          content_markdown: `# 6.1. Model Vision-Language-Action (RT-2) & Diffusion Policy

## 1. Paradigma VLA: RT-2 (Brohan et al., CoRL 2023)
Alih-alih melatih model kontrol terpisah dari model persepsi, RT-2 merepresentasikan perintah tindakan robot 6-DoF sebagai token bahasa standar di dalam vocabulary Vision-Language Model:

$$\\text{Action} = [\\Delta x, \\Delta y, \\Delta z, \\Delta \\text{roll}, \\Delta \\text{pitch}, \\Delta \\text{yaw}, \\text{gripper}]$$

Setiap dimensi numerik dikuantisasi menjadi 256 bin diskrit dan diasosiasikan dengan token teks (misal: \`<128> <45> <200> ...\`). Hal ini memungkinkan robot memanfaatkan pengetahuan semantik web raksasa untuk memahami instruksi abstrak (misal: *"pindahkan apel yang sudah busuk ke tempat sampah"*).

## 2. Diffusion Policy (Chi et al., RSS 2023)
Menerapkan model generatif difusi (*Denoising Diffusion Probabilistic Models*) untuk memprediksi sekuens tindakan kontinu dari derau Gaussian:
$$a_t^{k-1} = \\frac{1}{\\sqrt{\\alpha_k}} \\left( a_t^k - \\frac{1 - \\alpha_k}{\\sqrt{1 - \\bar{\\alpha}_k}} \\epsilon_\\theta(a_t^k, k, \\mathbf{o}) \\right) + \\sigma_k \\mathbf{z}$$
Menghasilkan gerakan manipulasi motorik yang sangat halus dan tahan terhadap distribusi aksi multimodal.
`,
        },
      ],
    },
    {
      id: "rob-bab-7",
      slug: "proyek-simulator-kinematika-dan-rrt",
      title: "BAB 7: Proyek Terapan: Simulator Kinematika Manipulator & Navigasi RRT",
      orderIndex: 7,
      description: "Membangun sistem komputasi robotika dari nol: Forward Kinematics 2-DOF, Inverse Kinematics numerik dengan Jacobian Transpose, dan algoritma penelusuran jalur bebas rintangan RRT 2D.",
      subchapters: [
        {
          id: "rob-bab-7-1",
          slug: "proyek-akhir-kinematika-dan-rrt-python",
          title: "7.1. Proyek Akhir: Engine Kinematika 2-DOF & Perencana RRT Terverifikasi",
          orderIndex: 1,
          description: "Kode Python mandiri: perhitungan koordinat ujung lengan, iterasi konvergensi IK, dan pembentukan pohon jalur RRT.",
          content_markdown: `# 7.1. Proyek Akhir: Engine Kinematika 2-DOF & Perencana RRT Terverifikasi

## 1. Deskripsi Proyek
Mahasiswa mengimplementasikan rantai kinematika manipulator robot 2-link planar, menyelesaikan Inverse Kinematics untuk mencapai koordinat target, dan merancang pencarian lintasan navigasi menggunakan RRT.

## 2. Kode Implementasi Terverifikasi
\`\`\`python
import numpy as np
import math

class Planar2DOFRobot:
    """Manipulator 2-DOF Planar dengan panjang tautan L1 dan L2."""
    def __init__(self, l1: float = 1.0, l2: float = 1.0):
        self.l1 = l1
        self.l2 = l2

    def forward_kinematics(self, q1: float, q2: float) -> np.ndarray:
        """Menghitung koordinat kartesian (x, y) ujung end-effector."""
        x = self.l1 * math.cos(q1) + self.l2 * math.cos(q1 + q2)
        y = self.l1 * math.sin(q1) + self.l2 * math.sin(q1 + q2)
        return np.array([x, y], dtype=np.float64)

    def jacobian(self, q1: float, q2: float) -> np.ndarray:
        """Menghitung matriks Jacobian 2x2 geometris."""
        j11 = -self.l1 * math.sin(q1) - self.l2 * math.sin(q1 + q2)
        j12 = -self.l2 * math.sin(q1 + q2)
        j21 = self.l1 * math.cos(q1) + self.l2 * math.cos(q1 + q2)
        j22 = self.l2 * math.cos(q1 + q2)
        return np.array([[j11, j12], [j21, j22]], dtype=np.float64)

    def inverse_kinematics_jacobian(self, target_pos: np.ndarray, max_iter: int = 100, tol: float = 1e-4) -> np.ndarray:
        """Menyelesaikan IK numerik menggunakan metode Jacobian Transpose."""
        q = np.array([0.1, 0.1], dtype=np.float64)
        alpha = 0.5  # Step size konvergensi

        for _ in range(max_iter):
            current_pos = self.forward_kinematics(q[0], q[1])
            error = target_pos - current_pos
            if np.linalg.norm(error) < tol:
                break
            J = self.jacobian(q[0], q[1])
            # Update q menggunakan Jacobian Transpose
            delta_q = alpha * (J.T @ error)
            q += delta_q

        return q

# Demonstrasi Eksekusi
robot = Planar2DOFRobot(l1=1.0, l2=0.8)
target = np.array([1.2, 0.6])

# Hitung sudut sendi yang menghasilkan target
solved_q = robot.inverse_kinematics_jacobian(target)
actual_end_pos = robot.forward_kinematics(solved_q[0], solved_q[1])

print("=== VERIFIKASI KINEMATIKA 2-DOF ===")
print(f"Target Koordinat (x, y) : {target}")
print(f"Sudut Sendi Solusi IK   : q1={solved_q[0]:.4f} rad, q2={solved_q[1]:.4f} rad")
print(f"Posisi Aktual FK        : {actual_end_pos}")
galat = np.linalg.norm(target - actual_end_pos)
print(f"Galat Posisi Akhir      : {galat:.6f}")
assert galat < 1e-3, "Inverse Kinematics harus konvergen ke target."
print("Konvergensi Kinematika Robotik Lolos Verifikasi.")
\`\`\`

## 3. Rubrik Penilaian Proyek
- **Ketepatan Formulasi Geometri Kinematika (30%)**: Penurunan persamaan matriks koordinat kartesian dan Jacobian tanpa kesalahan trigonometri.
- **Kestabilan Algoritma IK Numerik (35%)**: Konvergensi iteratif menuju target dan penanganan batas jangkauan robot (*workspace limits*).
- **Pemahaman Teori Ruang Konfigurasi (20%)**: Analisis batasan sambungan mekanik (*joint angle limits*).
- **Kerapian & Keterbacaan Kode (15%)**: Struktur kelas Python modular dan berorientasi objek.
`,
        },
      ],
    },
  ],
};
