import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: REINFORCEMENT LEARNING (TOPIK 24)
 * Rujukan Utama:
 * - Sutton, R. S., & Barto, A. G. (2018). Reinforcement Learning: An Introduction (2nd ed.). MIT Press.
 * - Mnih, V., et al. (2015). Human-level control through deep reinforcement learning (DQN). Nature, 518(7540), 529-533.
 * - Schulman, J., Wolski, F., Dhariwal, P., Radford, A., & Klimov, O. (2017). Proximal Policy Optimization Algorithms (PPO). arXiv:1707.06347.
 * - Watkins, C. J., & Dayan, P. (1992). Q-learning. Machine Learning, 8(3-4), 279-292.
 */
export const reinforcementLearningCurriculum: AcademicCurriculum = {
  id: "reinforcement-learning",
  slug: "reinforcement-learning",
  title: "Reinforcement Learning",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Teori dan algoritma pembelajaran penguatan (*Reinforcement Learning*): Proses Keputusan Markov (*Markov Decision Processes* / MDP), penurunan persamaan eksak Bellman (*Bellman Expectation and Optimality Equations*), metode Temporal Difference (TD-Learning, Q-Learning, SARSA), Deep Q-Networks (DQN dengan Experience Replay), serta algoritma Policy Gradients (REINFORCE, PPO terpotong).",
  estimatedHours: 54,
  version: "2.4.0",
  primaryReferences: [
    {
      title: "Reinforcement Learning: An Introduction (2nd Edition)",
      authors: ["Richard S. Sutton", "Andrew G. Barto"],
      type: "book",
      url: "http://incompleteideas.net/book/the-book-2nd.html",
      relevance: "Buku teks kanonikal proses keputusan Markov, pemrograman dinamis, integrasi Monte Carlo dan TD, serta estimasi fungsi nilai.",
      year: 2018,
      publisherOrVenue: "MIT Press",
    },
    {
      title: "Human-level control through deep reinforcement learning",
      authors: ["Volodymyr Mnih", "Koray Kavukcuoglu", "David Silver", "Andrei A. Rusu", "Joel Veness", "Marc G. Bellemare", "Alex Graves", "Martin Riedmiller", "Andreas K. Fidjeland", "Georg Ostrovski", "Stig Petersen", "Charles Beattie", "Sadik Sadik", "Anton Antonoglou", "Helen King", "Dharshan Kumaran", "Daan Wierstra", "Shane Legg", "Demis Hassabis"],
      type: "paper",
      url: "https://www.nature.com/articles/nature14236",
      doi: "10.1038/nature14236",
      relevance: "Karya terobosan Deep Q-Networks (DQN) yang menstabilkan aproksimasi fungsi nilai non-linear dengan Target Network.",
      year: 2015,
      publisherOrVenue: "Nature",
    },
    {
      title: "Proximal Policy Optimization Algorithms",
      authors: ["John Schulman", "Filip Wolski", "Prafulla Dhariwal", "Alec Radford", "Oleg Klimov"],
      type: "paper",
      url: "https://arxiv.org/abs/1707.06347",
      doi: "10.48550/arXiv.1707.06347",
      relevance: "Standar industri algoritma policy gradient dengan pemotongan rasio peluang objektif terpotong (Clipped Surrogate Objective).",
      year: 2017,
      publisherOrVenue: "arXiv:1707.06347",
    },
  ],
  chapters: [
    {
      id: "rl-bab-1",
      slug: "proses-keputusan-markov-dan-persamaan-bellman",
      title: "BAB 1: Markov Decision Processes (MDP) & Persamaan Bellman",
      orderIndex: 1,
      description: "Tupel formal $\\langle S, A, P, R, \\gamma \\rangle$, sifat memori Markovian, fungsi nilai keadaan $V^\\pi(s)$, fungsi nilai aksi $Q^\\pi(s, a)$, dan penurunan analitik persamaan Bellman.",
      subchapters: [
        {
          id: "rl-bab-1-1",
          slug: "penurunan-matematis-persamaan-bellman",
          title: "1.1. Penurunan Matematis Persamaan Ekspektasi & Optimalitas Bellman",
          orderIndex: 1,
          description: "Membuktikan hubungan rekursif antara nilai keadaan saat ini dan nilai masa depan berdiskon $\\gamma$.",
          content_markdown: `# 1.1. Penurunan Matematis Persamaan Ekspektasi & Optimalitas Bellman

## 1. Tujuan Pembelajaran
Mahasiswa mampu:
1. Mendefinisikan tupel Proses Keputusan Markov $\\mathcal{M} = (\\mathcal{S}, \\mathcal{A}, \\mathcal{P}, \\mathcal{R}, \\gamma)$.
2. Menurunkan persamaan ekspektasi Bellman untuk $V^\\pi(s)$ dan $Q^\\pi(s, a)$.
3. Menjelaskan Teorema Kebijakan Optimal Bellman.

## 2. Definisi Return Terdiskon
Return total kumulatif $G_t$ dari langkah waktu $t$ dengan faktor diskon $\\gamma \\in [0, 1)$:

$$G_t = \\sum_{k=0}^\\infty \\gamma^k R_{t+k+1} = R_{t+1} + \\gamma G_{t+1}$$

## 3. Penurunan Persamaan Ekspektasi Bellman
Fungsi nilai keadaan $V^\\pi(s)$ didefinisikan sebagai ekspektasi return jika agen mengikuti kebijakan $\\pi$:

$$V^\\pi(s) = \\mathbb{E}_\\pi [G_t \\mid S_t = s]$$

Substitusi dekomposisi rekursif $G_t = R_{t+1} + \\gamma G_{t+1}$:

$$V^\\pi(s) = \\mathbb{E}_\\pi \\left[ R_{t+1} + \\gamma G_{t+1} \\mid S_t = s \\right]$$

Dengan mengekspresikan ekspektasi melalui probabilitas kebijakan $\\pi(a|s)$ dan dinamika transisi lingkungan $P(s', r \\mid s, a)$:

$$V^\\pi(s) = \\sum_{a \\in \\mathcal{A}} \\pi(a \\mid s) \\sum_{s' \\in \\mathcal{S}, r} P(s', r \\mid s, a) \\left[ r + \\gamma V^\\pi(s') \\right]$$

## 4. Persamaan Optimalitas Bellman (Bellman Optimality)
Untuk kebijakan optimal $\\pi^*$:

$$V^*(s) = \\max_{a \\in \\mathcal{A}} \\sum_{s', r} P(s', r \\mid s, a) \\left[ r + \\gamma V^*(s') \\right]$$

$$Q^*(s, a) = \\sum_{s', r} P(s', r \\mid s, a) \\left[ r + \\gamma \\max_{a'} Q^*(s', a') \\right]$$
`,
        },
      ],
    },
    {
      id: "rl-bab-2",
      slug: "q-learning-dan-deep-q-networks",
      title: "BAB 2: Temporal Difference Learning, Q-Learning & DQN",
      orderIndex: 2,
      description: "Metode bebas-model (*model-free*), galat temporal difference $R + \\gamma \\max Q - Q$, eksplorasi $\\epsilon$-greedy, penstabil Experience Replay dan Target Network.",
      subchapters: [
        {
          id: "rl-bab-2-1",
          slug: "q-learning-dan-dqn-stabilization",
          title: "2.1. Algoritma Q-Learning & Stabilisasi Deep Q-Networks (Mnih et al., 2015)",
          orderIndex: 1,
          description: "Mengapa regresi kuadrat biasa gagal pada RL mendalam dan bagaimana Experience Replay memutus korelasi serial data.",
          content_markdown: `# 2.1. Algoritma Q-Learning & Stabilisasi Deep Q-Networks (Mnih et al., 2015)

## 1. Aturan Pembaruan Tabular Q-Learning (Watkins, 1989)
Pembaruan matriks nilai aksi $Q(s, a)$ dengan laju belajar $\\alpha$:

$$Q(s, a) \\leftarrow Q(s, a) + \\alpha \\left[ R + \\gamma \\max_{a'} Q(s', a') - Q(s, a) \\right]$$

Suku di dalam tanda kurung $\\delta_t = R + \\gamma \\max_{a'} Q(s', a') - Q(s, a)$ disebut **Galat Temporal Difference (TD-Error)**.

## 2. Dua Inovasi Stabilisasi DQN
Saat menggunakan neural network $Q_\\theta(s, a)$ sebagai aproksimator fungsi, pelatihan standar tidak stabil atau divergen karena:
1. Sampel transisi berurutan berkorelasi tinggi secara temporal (melanggar asumsi I.I.D.).
2. Target bergerak seiring pembaruan bobot model itu sendiri.

Mnih et al. (Nature 2015) memperkenalkan:
1. **Experience Replay Memory $\\mathcal{D}$**: Transisi $(s, a, r, s')$ disimpan dalam buffer memori siklis berukuran besar, lalu sampel mini-batch diambil secara acak seragam untuk memutus autokorelasi serial.
2. **Frozen Target Network $Q_{\\theta^-}$**: Target komputasi dihitung menggunakan bobot terpisah $\\theta^-$ yang hanya disalin secara periodik setiap $C$ langkah, mencegah osilasi umpan balik destruktif:
   $$\\mathcal{L}(\\theta) = \\mathbb{E}_{(s, a, r, s') \\sim \\mathcal{D}} \\left[ \\left( r + \\gamma \\max_{a'} Q_{\\theta^-}(s', a') - Q_\\theta(s, a) \\right)^2 \\right]$$
`,
        },
      ],
    },
    {
      id: "rl-bab-3",
      slug: "policy-gradients-dan-ppo",
      title: "BAB 3: Metode Policy Gradients & Proximal Policy Optimization (PPO)",
      orderIndex: 3,
      description: "Teorema Gradien Kebijakan, algoritma REINFORCE dengan baseline, Advantage Actor-Critic (A2C), dan fungsi objektif Clipped Surrogate PPO.",
      subchapters: [
        {
          id: "rl-bab-3-1",
          slug: "formulasi-matematika-ppo-clipped-loss",
          title: "3.1. Formulasi Matematika Clipped Surrogate Objective PPO (Schulman et al., 2017)",
          orderIndex: 1,
          description: "Membatasi rasio probabilitas kebijakan $r_t(\\theta) = \\frac{\\pi_\\theta(a_t|s_t)}{\\pi_{\\theta_{\\text{old}}}(a_t|s_t)}$ pada interval $[1-\\epsilon, 1+\\epsilon]$ untuk mencegah degradasi performa drastis.",
          content_markdown: `# 3.1. Formulasi Matematika Clipped Surrogate Objective PPO (Schulman et al., 2017)

## 1. Rasio Probabilitas Kebijakan
$$r_t(\\theta) = \\frac{\\pi_\\theta(a_t \\mid s_t)}{\\pi_{\\theta_{\\text{old}}}(a_t \\mid s_t)}$$

## 2. Formulasi Loss PPO-Clip
PPO memodifikasi fungsi objektif surrogate dengan operasi pemotongan (*clipping*):

$$\\mathcal{L}^{\\text{CLIP}}(\\theta) = \\hat{\\mathbb{E}}_t \\left[ \\min\\left( r_t(\\theta) \\hat{A}_t, \\; \\text{clip}(r_t(\\theta), 1 - \\epsilon, 1 + \\epsilon) \\hat{A}_t \\right) \\right]$$

Di mana:
- $\\hat{A}_t$: Estimasi fungsi keuntungan (*Advantage Function*), mengukur seberapa baik tindakan $a_t$ dibanding rata-rata nilai tindakan di keadaan tersebut.
- $\\epsilon$: Hiperparameter pemotongan (biasanya $\\epsilon = 0.2$).

Jika tindakan menghasilkan keuntungan positif ($\\hat{A}_t > 0$), rasio $r_t$ dibatasi maksimum $1 + \\epsilon$, mencegah kebijakan berubah terlalu drastis dalam satu batch data.
`,
        },
      ],
    },
    {
      id: "rl-bab-4",
      slug: "praktikum-reinforcement-learning",
      title: "BAB 4: Praktikum Implementasi Q-Learning & Gym Environment",
      orderIndex: 4,
      description: "Membangun agen pembelajaran penguatan tabular untuk menavigasi lingkungan GridWorld/FrozenLake dengan kurva konvergensi reward.",
      subchapters: [
        {
          id: "rl-bab-4-1",
          slug: "proyek-q-learning-gridworld",
          title: "4.1. Proyek: Implementasi Tabular Q-Learning pada GridWorld Dinamis",
          orderIndex: 1,
          description: "Membangun loop pelatihan agen interaktif dengan jadwal peluruhan eksplorasi $\\epsilon$-decay dan visualisasi matriks nilai Q.",
          content_markdown: `# 4.1. Proyek: Implementasi Tabular Q-Learning pada GridWorld Dinamis

## 1. Spesifikasi Proyek RL
Mahasiswa membuat modul:
1. Lingkungan GridWorld $4 \\times 4$ dengan keadaan awal, jebakan lubang, dan tujuan akhir.
2. Inisialisasi tabel $Q(s, a)$ berdimensi $16 \\times 4$.
3. Kebijakan aksi $\\epsilon$-greedy dengan peluruhan $\\epsilon_{t+1} = \\max(0.01, \\epsilon_t \\times 0.995)$.
4. Melacak kurva akumulasi reward per episode.
5. Mengekstrak rute kebijakan deterministik terbaik setelah konvergensi.
`,
        },
      ],
    },
  ],
};
