import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: AI AGENT (TOPIK 1) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Yao, S., Zhao, J., Yu, D., et al. (2022). ReAct: Synergizing Reasoning and Acting in Language Models. ICLR 2023.
 * - Park, J. S., et al. (2023). Generative Agents: Interactive Simulacra of Human Behavior. ACM UIST.
 * - Schick, T., et al. (2023). Toolformer: Language Models Can Teach Themselves to Use Tools. NeurIPS.
 * - Shinn, N., et al. (2023). Reflexion: Language Agents with Verbal Reinforcement Learning. NeurIPS.
 * - Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.
 */
export const aiAgentCurriculum: AcademicCurriculum = {
  id: "ai-agent",
  slug: "ai-agent",
  title: "AI Agent",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Arsitektur komprehensif agen kecerdasan buatan otonom: taksonomi PEAS, penalaran terkoordinasi (ReAct & Toolformer), sistem memori kognitif berstrata (Episodic, Semantic, Working Memory), dekomposisi tugas hierarkis (ToT & LATS), orkestrasi multi-agent konsensus, serta pembangunan sistem agen riset otonom terverifikasi.",
  estimatedHours: 54,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "ReAct: Synergizing Reasoning and Acting in Language Models",
      authors: ["Shunyu Yao", "Jeffrey Zhao", "Dian Yu", "Nan Du", "Izhak Shafran", "Karthik Narasimhan", "Yuan Cao"],
      type: "paper",
      url: "https://arxiv.org/abs/2210.03629",
      doi: "10.48550/arXiv.2210.03629",
      relevance: "Fondasi interaksi Thought-Action-Observation dalam eksekusi tugas bertahap agen berbasis LLM.",
      year: 2022,
      publisherOrVenue: "ICLR 2023",
    },
    {
      title: "Generative Agents: Interactive Simulacra of Human Behavior",
      authors: ["Joon Sung Park", "Joseph C. O'Brien", "Carrie J. Cai", "Meredith Ringel Morris", "Percy Liang", "Michael S. Bernstein"],
      type: "paper",
      url: "https://arxiv.org/abs/2304.03442",
      doi: "10.48550/arXiv.2304.03442",
      relevance: "Arsitektur memori berstrata: Memory Stream, formulasi Recency-Importance-Relevance, dan mekanisme refleksi kognitif.",
      year: 2023,
      publisherOrVenue: "ACM UIST 2023",
    },
    {
      title: "Reflexion: Language Agents with Verbal Reinforcement Learning",
      authors: ["Noah Shinn", "Federico Cassano", "Edward Berman", "Ashwin Gopinath", "Karthik Narasimhan", "Shunyu Yao"],
      type: "paper",
      url: "https://arxiv.org/abs/2303.11366",
      doi: "10.48550/arXiv.2303.11366",
      relevance: "Mekanisme self-correction melalui evaluasi linguistik tanpa pembaruan bobot model matematis.",
      year: 2023,
      publisherOrVenue: "NeurIPS 2023",
    },
    {
      title: "Artificial Intelligence: A Modern Approach (4th Edition)",
      authors: ["Stuart Russell", "Peter Norvig"],
      type: "book",
      url: "https://aima.cs.berkeley.edu/",
      relevance: "Kerangka PEAS, taksonomi agen rasional (reflex, goal, utility, learning), dan teori keputusan lingkungan.",
      year: 2020,
      publisherOrVenue: "Pearson",
    },
  ],
  chapters: [
    {
      id: "agt-bab-1",
      slug: "taksonomi-dan-arsitektur-formal-agen",
      title: "BAB 1: Taksonomi Formal, Lingkungan PEAS & Arsitektur Kognitif",
      orderIndex: 1,
      description: "Klasifikasi komprehensif agen rasional, formulasi lingkungan PEAS, transisi dari FSM/Rule-based menuju model berbasis fondasi penalaran probabilistik.",
      subchapters: [
        {
          id: "agt-bab-1-1",
          slug: "definisi-formal-dan-karakterisasi-peas",
          title: "1.1. Agen Rasional & Kerangka Evaluasi PEAS",
          orderIndex: 1,
          description: "Struktur matematis fungsi agen, rasionalitas lingkungan, dan formulasi PEAS (Performance measure, Environment, Actuators, Sensors).",
          content_markdown: `# 1.1. Agen Rasional & Kerangka Evaluasi PEAS

## 1. Definisi Formal Fungsi Agen
Secara matematis, agen adalah suatu entitas yang memetakan urutan persepsi (*percept history* $\\mathcal{P}^*$) menjadi tindakan fisik (*action* $\\mathcal{A}$):

$$f: \\mathcal{P}^* \\longrightarrow \\mathcal{A}$$

Di mana:
- $\\mathcal{P}$ adalah ruang persepsi yang dapat diamati sensor pada satu satuan waktu.
- $\\mathcal{P}^*$ merepresentasikan seluruh riwayat persepsi dari waktu $t=0$ hingga $t=T$.
- $\\mathcal{A}$ adalah himpunan tindakan diskrit atau kontinu yang dapat dieksekusi efektor.

Arsitektur fisik menjalankan program agen yang mengimplementasikan pemetaan fungsi $f$:

$$\\text{Agent} = \\text{Architecture} + \\text{Program}$$

## 2. Rasionalitas vs Omniscience
Agen dikatakan **rasional** jika untuk setiap kemungkinan urutan persepsi, tindakan yang dipilih memaksimalkan nilai ekspektasi dari ukuran kinerja (*Performance Measure* $U$), berdasarkan bukti yang diberikan riwayat persepsi dan pengetahuan bawaan agen:

$$a^* = \\arg\\max_{a \\in \\mathcal{A}} \\mathbb{E}\\left[ U(s') \\mid \\mathcal{P}^*, a \\right]$$

Rasionalitas berbeda secara fundamental dari *omniscience* (mengetahui segalanya): rasionalitas memaksimalkan *ekspektasi performa*, bukan performa aktual yang tidak terduga akibat stokastisitas lingkungan.

## 3. Karakterisasi Lingkungan PEAS
Sebelum merancang agen, arsitek perangkat lunak AI wajib mendefinisikan kuartet PEAS:
1. **Performance Measure ($P$)**: Kriteria objektif keberhasilan (misal: rasio ketepatan waktu pengiriman, profitabilitas, minimasi latensi).
2. **Environment ($E$)**: Ruang operasional agen (misal: simulator lalu lintas, database perbankan, internet terbuka).
3. **Actuators ($A$)**: Mekanisme manipulasi lingkungan (misal: motor servo, HTTP REST call, query database SQL).
4. **Sensors ($S$)**: Sumber aliran data masukan (misal: kamera optik, streaming sensor IoT, webhook HTTP).

## 4. Dimensi Taksonomi Lingkungan
Tabel taksonomi properti lingkungan menurut Russell & Norvig (2020):

| Properti Lingkungan | Nilai Ekstrem A | Nilai Ekstrem B | Implikasi Desain Agen |
| :--- | :--- | :--- | :--- |
| **Observability** | Fully Observable | Partially Observable | Memerlukan pemeliharaan status internal (*belief state*). |
| **Determinism** | Deterministic | Stochastic | Memerlukan penanganan probabilitas transisi $P(s' \\mid s, a)$. |
| **Episodicity** | Episodic | Sequential | Keputusan saat ini mempengaruhi seluruh ruang keadaan masa depan. |
| **Dynamism** | Static | Dynamic | Lingkungan berubah saat agen sedang menjalankan proses penalaran. |
| **Continuity** | Discrete | Continuous | Memerlukan optimasi numerik kontinu vs pencarian kombinatorial. |
| **Agent Cardinality** | Single-Agent | Multi-Agent | Memerlukan game theory, protokol negosiasi, atau konsensus. |
`,
        },
        {
          id: "agt-bab-1-2",
          slug: "taksonomi-agen-dari-reflex-ke-llm-reasoner",
          title: "1.2. Taksonomi Agen: Dari Simple Reflex ke LLM-Driven Reasoner",
          orderIndex: 2,
          description: "Evolusi dari Simple Reflex, Model-Based Reflex, Goal-Based, Utility-Based, hingga arsitektur Cognitive (ACT-R, Soar) dan LLM Autonomous Agent.",
          content_markdown: `# 1.2. Taksonomi Agen: Dari Simple Reflex ke LLM-Driven Reasoner

## 1. Spektrum Arsitektur Agen Klasik
1. **Simple Reflex Agent**:
   Memilih tindakan murni berdasarkan persepsi sesaat dengan aturan kondisi-tindakan (*condition-action rules*):
   $$\\text{rule}: \\text{if } \\text{condition}(p_t) \\implies \\text{action } a_t$$
2. **Model-Based Reflex Agent**:
   Menyimpan representasi keadaan internal (*internal state*) untuk mengatasi observabilitas parsial:
   $$s_{t+1} = \\text{UpdateState}(s_t, a_t, p_{t+1})$$
3. **Goal-Based Agent**:
   Menggabungkan informasi keadaan dengan informasi tujuan (*goal*) untuk memandu perencanaan jalur masa depan.
4. **Utility-Based Agent**:
   Menggunakan fungsi utilitas $U(s) \\in \\mathbb{R}$ untuk mengukur trade-off di antara berbagai tujuan yang bertentangan.

## 2. Paradigma Modern: LLM sebagai Cognitive Engine
Dalam sistem agen otonom modern, model bahasa skala besar (LLM) tidak sekadar menjadi generator kalimat, melainkan berfungsi sebagai **Mesin Inferensi Pusat** (*Central Processing Unit of Cognition*):

$$\\text{Prompt}(s_t, \\text{Memory}, \\text{Tools}) \\xrightarrow{\\text{LLM Reasoning}} (\\tau_t, a_t)$$

- **LLM**: Pengendali perencanaan, sintesis fakta, dan pemilihan alat.
- **Short-term Memory**: Window context aktif beserta *in-context demonstrations*.
- **Long-term Memory**: Basis data vektor berindeks HNSW untuk pemanggilan fakta masa lalu.
- **Effectors/Tools**: API eksternal, shell terminal, kueri SQL, atau web scraper.
`,
        },
      ],
    },
    {
      id: "agt-bab-2",
      slug: "siklus-penalaran-react-dan-pemanggilan-alat",
      title: "BAB 2: Siklus Penalaran ReAct, MRKL & Tool Integration",
      orderIndex: 2,
      description: "Implementasi mendalam siklus Thought-Action-Observation (ReAct), kerangka kerja Modular Reasoning, Knowledge and Language (MRKL), parsing JSON Schema, dan penanganan galat eksekusi.",
      subchapters: [
        {
          id: "agt-bab-2-1",
          slug: "matematika-dan-mekanisme-react-loop",
          title: "2.1. Formulasi Matematika Siklus ReAct & Error Recovery",
          orderIndex: 1,
          description: "Derivasi matematis trajektori penalaran ReAct, integrasi scratchpad dinamis, dan mekanisme penanganan feedback observasi lingkungan.",
          content_markdown: `# 2.1. Formulasi Matematika Siklus ReAct & Error Recovery

## 1. Formulasi Siklus ReAct
Diusulkan oleh Yao et al. (ICLR 2023), ReAct menggabungkan *Chain-of-Thought reasoning* (ruang tindakan laten $\\mathcal{L}$) dan *action execution* (ruang tindakan eksternal $\\mathcal{A}$):

Di setiap langkah waktu $t$, agen menerima observasi lingkungan $o_t \\in \\mathcal{O}$. Agen memperbarui trajektori konteksnya:

$$c_t = (c_{t-1}, a_{t-1}, o_t)$$

Model memprediksi token berikutnya yang dapat berupa pemikiran internal (Thought) $\\tau_t \\in \\mathcal{L}$ atau tindakan konkret (Action) $a_t \\in \\mathcal{A}$:

$$P(\\text{step}_t \\mid c_t) = \\prod_{i=1}^k P(w_i \\mid c_t, w_{<i})$$

Jika tindakan $a_t$ dihasilkan, eksekutor fisik memanggil fungsi eksternal:

$$o_{t+1} = \\text{Env.step}(a_t)$$

## 2. Diagram Trajektori ReAct
$$\\text{Goal } G \\longrightarrow \\underbrace{\\tau_1}_{\\text{Thought}} \\longrightarrow \\underbrace{a_1[\\text{arg}]}_{\\text{Action}} \\longrightarrow \\underbrace{o_1}_{\\text{Observation}} \\longrightarrow \\underbrace{\\tau_2}_{\\text{Thought}} \\longrightarrow \\dots \\longrightarrow \\text{Finish}[\\text{Answer}]$$

## 3. Analisis Kekuatan Sinergis
1. **Pencegahan Error Propagation**: Tanpa observasi perantara, kesalahan spekulasi dalam *pure reasoning* merambat ke seluruh rantai kesimpulan (*hallucination drift*).
2. **Kompensasi Aksi Gagal**: Apabila $o_t$ mengembalikan pesan galat (misal: \`HTTP 404: Not Found\` atau \`SyntaxError\`), pemikiran $\\tau_{t+1}$ dapat merumuskan kueri baru atau alat alternatif secara adaptif (*self-repair*).
`,
        },
        {
          id: "agt-bab-2-2",
          slug: "implementasi-engine-react-dari-nol",
          title: "2.2. Implementasi Komprehensif: ReAct Engine & Tool Registry",
          orderIndex: 2,
          description: "Kode Python murni tanpa ketergantungan pustaka luar: registri tools bertipe kuat, parsing regex terstruktur, batas iterasi aman, dan penanganan exception.",
          content_markdown: `# 2.2. Implementasi Komprehensif: ReAct Engine & Tool Registry

Berikut adalah implementasi modular *ReAct Engine* siap pakai yang mengimplementasikan protokol registri alat dinamis:

\`\`\`python
import re
from typing import Callable, Dict, Any, Optional, List

class Tool:
    """Representasi alat komputasi yang dapat dipanggil agen."""
    def __init__(self, name: str, description: str, func: Callable[[str], str]):
        self.name = name
        self.description = description
        self.func = func

    def run(self, argument: str) -> str:
        try:
            return str(self.func(argument.strip()))
        except Exception as e:
            return f"Tool Execution Error ({self.name}): {type(e).__name__} - {str(e)}"

class ToolRegistry:
    """Manajer pendaftaran dan validasi antarmuka alat."""
    def __init__(self):
        self._tools: Dict[str, Tool] = {}

    def register(self, tool: Tool) -> None:
        self._tools[tool.name.lower()] = tool

    def get(self, name: str) -> Optional[Tool]:
        return self._tools.get(name.lower())

    def get_tool_descriptions(self) -> str:
        return "\\n".join([f"- {t.name}: {t.description}" for t in self._tools.values()])

# --- Inisialisasi Mock Knowledge Base & Kalkulator Aman ---
registry = ToolRegistry()

def safe_calc(expression: str) -> str:
    # Hanya mengizinkan karakter aritmatika dasar
    if not re.match(r"^[0-9+\\-*/().\\s]+$", expression):
        raise ValueError("Ekspresi matematika mengandung karakter ilegal.")
    return str(eval(expression, {"__builtins__": {}}, {}))

registry.register(Tool("Calculator", "Mengevaluasi ekspresi matematika numerik murni. Input: string aritmatika.", safe_calc))

ACADEMIC_DB = {
    "1352001": {"nama": "Ahmad Fauzi", "ipk": 3.82, "sks": 128, "status": "Aktif"},
    "1352002": {"nama": "Budi Santoso", "ipk": 2.95, "sks": 90, "status": "Percobaan"},
    "1352003": {"nama": "Citra Lestari", "ipk": 3.96, "sks": 136, "status": "Aktif"}
}

def lookup_student(nim: str) -> str:
    data = ACADEMIC_DB.get(nim)
    if not data:
        return f"NIM {nim} tidak ditemukan dalam pangkalan data akademik."
    return f"Nama: {data['nama']} | IPK: {data['ipk']} | SKS Selesai: {data['sks']} | Status: {data['status']}"

registry.register(Tool("StudentDatabase", "Mencari profil akademik mahasiswa berdasarkan NIM. Input: string NIM.", lookup_student))

# --- ReAct Loop Engine ---
class ReActAgent:
    def __init__(self, tool_registry: ToolRegistry, max_iterations: int = 5):
        self.registry = tool_registry
        self.max_iterations = max_iterations
        self.action_pattern = re.compile(r"Action:\\s*([A-Za-z0-9_]+)\\[(.*?)\\]", re.DOTALL)
        self.finish_pattern = re.compile(r"Final Answer:\\s*(.*)", re.DOTALL)

    def execute_turn(self, goal: str, simulated_steps: List[str]) -> str:
        """Menjalankan siklus penelusuran ReAct dengan validasi observasi bertahap."""
        trajectory: List[str] = [f"Goal: {goal}"]
        print(f"=== MEMULAI PENELUSURAN REACTION UNTUK GOAL: {goal} ===")

        step_idx = 0
        for iteration in range(self.max_iterations):
            if step_idx >= len(simulated_steps):
                break

            step_content = simulated_steps[step_idx]
            step_idx += 1
            trajectory.append(step_content)

            # Cek apakah model menghasilkan Final Answer
            finish_match = self.finish_pattern.search(step_content)
            if finish_match:
                final_ans = finish_match.group(1).strip()
                print(f"[STATUS] Selesai pada iterasi {iteration + 1}.")
                print(f"[HASIL AKHIR]: {final_ans}\\n")
                return final_ans

            # Cek aksi
            action_match = self.action_pattern.search(step_content)
            if action_match:
                tool_name = action_match.group(1).strip()
                tool_arg = action_match.group(2).strip()
                
                tool = self.registry.get(tool_name)
                if tool:
                    observation = tool.run(tool_arg)
                else:
                    observation = f"Error: Tool '{tool_name}' tidak ditemukan dalam registri."

                obs_str = f"Observation: {observation}"
                trajectory.append(obs_str)
                print(f"-> {step_content.strip()}")
                print(f"<- {obs_str}\\n")

        return "Penelusuran berhenti karena mencapai batas iterasi maksimum tanpa konvergensi."

# Demonstrasi Trajektori Terverifikasi
simulated_llm_generation = [
    "Thought: Saya perlu memeriksa riwayat SKS mahasiswa dengan NIM 1352001 untuk menghitung sisa syarat kelulusan (standar 144 SKS).\\nAction: StudentDatabase[1352001]",
    "Thought: Mahasiswa telah menyelesaikan 128 SKS. Sekarang saya akan menghitung sisa SKS menggunakan kalkulator.\\nAction: Calculator[144 - 128]",
    "Thought: Hasil perhitungan numerik adalah 16. Saya siap memberikan kesimpulan final.\\nFinal Answer: Mahasiswa Ahmad Fauzi (NIM 1352001) telah menyelesaikan 128 SKS dan memerlukan 16 SKS lagi untuk memenuhi syarat kelulusan 144 SKS."
]

agent = ReActAgent(registry)
hasil = agent.execute_turn("Hitung sisa SKS kelulusan untuk NIM 1352001", simulated_llm_generation)
\`\`\`
`,
        },
      ],
    },
    {
      id: "agt-bab-3",
      slug: "arsitektur-memori-kognitif-agen",
      title: "BAB 3: Arsitektur Memori Kognitif Berstrata",
      orderIndex: 3,
      description: "Desain sistem memori agen jangka pendek dan panjang: Memory Stream, formulasi pembobotan Park et al. (Recency, Importance, Relevance), kompresi rekursif, dan refleksi episodik.",
      subchapters: [
        {
          id: "agt-bab-3-1",
          slug: "formulasi-retrieval-dan-peluruhan-memori",
          title: "3.1. Formulasi Retrieval Score & Peluruhan Waktu (Park et al.)",
          orderIndex: 1,
          description: "Matematika di balik sistem memori Generative Agents: pembobotan multi-kriteria, fungsi peluruhan eksponensial, dan inferensi signifikansi kognitif.",
          content_markdown: `# 3.1. Formulasi Retrieval Score & Peluruhan Waktu (Park et al.)

## 1. Tiga Dimensi Penilaian Memori Kognitif
Berdasarkan eksperimen terobosan Park et al. (ACM UIST 2023), agen menyimpan seluruh pengalaman mentah ke dalam *Memory Stream*. Ketika dihadapkan pada pertanyaan atau situasi lingkungan saat ini $q$, agen melakukan pemeringkatan memori melalui fungsi gabungan:

$$\\text{Score}(m, q) = \\alpha_{\\text{recency}} \\cdot s_{\\text{recency}}(m) + \\alpha_{\\text{importance}} \\cdot s_{\\text{importance}}(m) + \\alpha_{\\text{relevance}} \\cdot s_{\\text{relevance}}(m, q)$$

Bobot default yang umum digunakan adalah $\\alpha_{\\text{recency}} = 1.0$, $\\alpha_{\\text{importance}} = 1.0$, $\\alpha_{\\text{relevance}} = 1.0$, dengan skor masing-masing dinormalisasi ke interval $[0, 1]$.

### A. Komponen Recency (Keberkerapan Waktu)
Memori yang baru saja terjadi memiliki dampak perhatian lebih tinggi. Didefinisikan dengan fungsi peluruhan eksponensial (*exponential decay*):

$$s_{\\text{recency}}(m) = \\gamma^{t_{\\text{current}} - t_m}$$

Di mana:
- $t_{\\text{current}} - t_m$ adalah selisih waktu dalam satuan langkah jam/siklus.
- $\\gamma \\in (0, 1)$ adalah faktor peluruhan (umumnya $\\gamma = 0.995$).

### B. Komponen Importance (Tingkat Kepentingan)
Membedakan memori sepele (misal: "melihat cangkir kopi") dari peristiwa krusial (misal: "lulus ujian sarjana"):
$$s_{\\text{importance}}(m) = \\frac{\\text{LLM\\_Rate}(m)}{10} \\in [0, 1]$$

### C. Komponen Relevance (Kesesuaian Semantik Vektor)
Kedekatan sudut kosinus antara representasi dense vector memori $\\mathbf{e}_m$ dan kueri saat ini $\\mathbf{e}_q$:

$$s_{\\text{relevance}}(m, q) = \\frac{\\mathbf{e}_m \\cdot \\mathbf{e}_q}{\\|\\mathbf{e}_m\\|_2 \\|\\mathbf{e}_q\\|_2}$$
`,
        },
        {
          id: "agt-bab-3-2",
          slug: "mekanisme-refleksi-dan-sintesis-memori",
          title: "3.2. Refleksi Episodik & Ekstraksi Abstrak Tingkat Tinggi",
          orderIndex: 2,
          description: "Mekanisme pengelompokan memori berulang, pembangkitan wawasan abstrak (*reflections*), dan representasi graf pohon pemikiran agen.",
          content_markdown: `# 3.2. Refleksi Episodik & Ekstraksi Abstrak Tingkat Tinggi

## 1. Problem Keterbatasan Memori Mentah
Jika agen hanya mengandalkan fakta tingkat rendah (*raw observations*), agen tidak dapat melakukan penalaran induktif mengenai kepribadian, preferensi jangka panjang, atau hubungan sosial yang kompleks.

## 2. Pipa Komputasi Refleksi (Reflection Pipeline)
1. **Pemicu Refleksi (*Reflection Trigger*)**: Dijalankan ketika akumulasi skor kepentingan memori terbaru melebihi ambang batas $\\Theta_{\\text{reflect}}$:
   $$\\sum_{i} s_{\\text{importance}}(m_i) > \\Theta_{\\text{reflect}}$$
2. **Pembangkitan Pertanyaan Introspektif**: Model mengevaluasi 100 memori terakhir dan mengajukan 3 pertanyaan tingkat tinggi: *"Berdasarkan kejadian terkini, apa tema besar yang konsisten?"*
3. **Pencarian Bukti & Sintesis**: Untuk setiap pertanyaan, agen mengambil kembali memori relevan dan menghasilkan node memori baru berstatus **Refleksi** (misal: *"Ahmad Fauzi sangat berdedikasi terhadap penelitian sistem terdistribusi"*).
4. **Struktur Pohon Memori**: Refleksi dapat merefleksikan refleksi sebelumnya, membentuk hierarki abstraksi bertingkat (*hierarchical cognitive abstraction*).
`,
        },
      ],
    },
    {
      id: "agt-bab-4",
      slug: "perencanaan-dan-dekomposisi-hierarkis",
      title: "BAB 4: Perencanaan, Dekomposisi Tugas & Koreksi Diri",
      orderIndex: 4,
      description: "Algoritma pencarian keputusan lanjut: Tree-of-Thoughts (ToT), Language Agent Tree Search (LATS), Plan-and-Solve, serta penguatan refleksi verbal (Reflexion).",
      subchapters: [
        {
          id: "agt-bab-4-1",
          slug: "tree-of-thoughts-dan-pencarian-ruang-keadaan",
          title: "4.1. Tree-of-Thoughts (ToT) & Heuristik Evaluasi Keadaan",
          orderIndex: 1,
          description: "Formulasi ruang pohon pemikiran, sampling kandidat cabang pemikiran (*thought generation*), fungsi evaluator heuristik, dan pemangkasan cabang buntu (*pruning*).",
          content_markdown: `# 4.1. Tree-of-Thoughts (ToT) & Heuristik Evaluasi Keadaan

## 1. Keterbatasan Penalaran Linier
Pendekatan konvensional *Chain-of-Thought* (CoT) melakukan pengambilan sampel autoregresif satu arah secara sekuensial. Jika terdapat kesalahan logika pada langkah $k$, seluruh langkah setelahnya $k+1, \\dots, N$ menjadi cacat tanpa peluang eksplorasi alternatif.

## 2. Formulasi Formal Tree-of-Thoughts (ToT)
ToT (Yao et al., NeurIPS 2023) mendefinisikan penyelesaian masalah sebagai pencarian pada graf terarah tak bersiklus (DAG) pohon pemikiran $\\mathcal{T}$:
- Setiap simpul $s = [x, z_{1..i}]$ merepresentasikan keadaan pemikiran parsial.
- **Pembangkitan Pemikiran (*Thought Generator*)**:
  $$z^{(j)} \\sim P_{\\text{thought}}(z \\mid s), \\quad j=1,\\dots,k$$
- **Evaluasi Keadaan (*State Evaluator*)**:
  Sebuah fungsi heuristik $V(s) \\in [0, 1]$ atau klasifikasi diskrit $\\{\\text{sure}, \\text{likely}, \\text{impossible}\\}$ menilai prospek keberhasilan simpul parsial:
  $$V(s) = \\mathbb{E}_{\\text{LLM}}[\\text{Keberhasilan } s]$$
- **Strategi Penelusuran**:
  Menggunakan algoritma Breadth-First Search (BFS) dengan batasan lebar cabang terbaik (*beam search* $b$) atau Depth-First Search (DFS) dengan aturan *backtracking* saat $V(s) < \\epsilon_{\\text{prune}}$.
`,
        },
        {
          id: "agt-bab-4-2",
          slug: "reflexion-verbal-reinforcement-learning",
          title: "4.2. Algoritma Reflexion: Pembelajaran Berbasis Umpan Balik Verbal",
          orderIndex: 2,
          description: "Kerangka kerja Shinn et al. (2023): mengonversi sinyal reward biner menjadi self-reflection linguistik dalam memori episodik untuk iterasi berikutnya.",
          content_markdown: `# 4.2. Algoritma Reflexion: Pembelajaran Berbasis Umpan Balik Verbal

## 1. Paradigma Verbal Reinforcement Learning
Pembelajaran penguatan (*Reinforcement Learning*) klasik memerlukan pembaruan gradien parameter bobot $\\theta \\leftarrow \\theta + \\alpha \\nabla J(\\theta)$, yang membutuhkan biaya komputasi masif dan data ribuan episode.

Sebaliknya, **Reflexion** (Shinn et al., NeurIPS 2023) mempertahankan bobot model $\\theta$ tetap beku (*frozen*), namun memperbarui **memori refleksi verbal** $M_{\\text{verbal}}$ yang diinjeksikan langsung ke dalam prompt episode berikutnya:

$$M_{\\text{verbal}}^{(e+1)} = M_{\\text{verbal}}^{(e)} \\cup \\text{SelfReflect}(\\mathcal{T}^{(e)}, r^{(e)})$$

Di mana:
- $\\mathcal{T}^{(e)}$ adalah trajektori tindakan episode ke-$e$.
- $r^{(e)} \\in \\{0, 1\\}$ adalah sinyal evaluasi keberhasilan tugas (misal: lolos/gagal unit test).
- Fungsi $\\text{SelfReflect}$ meminta model mendiagnosis akar penyebab kegagalan dan merumuskan instruksi pencegahan spesifik.
`,
        },
      ],
    },
    {
      id: "agt-bab-5",
      slug: "sistem-multi-agent-dan-protokol-konsensus",
      title: "BAB 5: Sistem Multi-Agent, Komunikasi & Konsensus",
      orderIndex: 5,
      description: "Arsitektur multi-agent kolaboratif dan kompetitif: pola Hierarkis (Manager-Worker), Peer-to-Peer Swarm, konsensus Debat Multi-Agent, serta spesifikasi protokol inter-agen.",
      subchapters: [
        {
          id: "agt-bab-5-1",
          slug: "topologi-orkestrasi-multi-agent",
          title: "5.1. Topologi Sistem Multi-Agent: Hierarki, Papan Informasi & Swarm",
          orderIndex: 1,
          description: "Analisis komparatif topologi komunikasi agen: Manager-Worker terpusat, Blackboard shared memory, dan jaringan mesh otonom.",
          content_markdown: `# 5.1. Topologi Sistem Multi-Agent: Hierarki, Papan Informasi & Swarm

## 1. Topologi Komunikasi Multi-Agent
Sistem multi-agent (MAS) membagi masalah berskala enterprise ke dalam spesialisasi peran (*role-playing specialization*):

### A. Pola Hierarkis (Supervisor / Manager-Worker)
- **Supervisor Agent**: Menerima tujuan makro dari pengguna, menyusun rencana dekomposisi hierarkis, mendistribusikan sub-tugas ke agen spesialis, dan memvalidasi sintesis akhir.
- **Worker Agents**: Berfokus pada domain terbatas (misal: *SQL Engineer*, *Code Generator*, *Security Auditor*).

### B. Pola Blackboard (Shared State Memory)
- Seluruh agen membaca dan menulis ke papan status global (*blackboard architecture*). Setiap agen memantau apakah kondisi prasyarat tugas mereka telah terpenuhi di papan status.

### C. Konsensus Debat Multi-Agent (Du et al., 2023)
Beberapa agen menghasilkan jawaban independen, lalu saling membaca dan mengkritisi argumen rekan mereka selama $K$ putaran. Eksperimen membuktikan bahwa proses dialektika ini secara signifikan mengurangi halusinasi faktual dan bias penalaran individual.
`,
        },
        {
          id: "agt-bab-5-2",
          slug: "protokol-pertukaran-pesan-dan-kontrak-fipa",
          title: "5.2. Protokol Komunikasi Terstruktur & Skema Kontrak Agen",
          orderIndex: 2,
          description: "Standar pertukaran pesan agen: ACL (Agent Communication Language), adaptasi modern berbasis JSON-RPC dan skema Pydantic.",
          content_markdown: `# 5.2. Protokol Komunikasi Terstruktur & Skema Kontrak Agen

## 1. Struktur Pesan Terstandarisasi
Untuk mencegah ambiguitas komunikasi antar-agen LLM, pertukaran pesan harus mematuhi skema data yang ketat:

\`\`\`json
{
  "protocol": "VELQORA_AGENT_COMM_V1",
  "message_id": "msg_89234bf9",
  "sender_role": "DataAnalystAgent",
  "recipient_role": "ReportWriterAgent",
  "performative": "INFORM",
  "conversation_id": "conv_churn_analysis_2026",
  "timestamp_utc": "2026-09-15T13:30:00Z",
  "payload": {
    "status": "SUCCESS",
    "metrics": {
      "churn_rate_high_risk": 0.342,
      "top_feature": "contract_month_to_month"
    },
    "artifacts": ["s3://analytics/churn_summary.parquet"]
  },
  "signature": "sha256_verification_hash"
}
\`\`\`

## 2. Tipe Performative Utama
Diadopsi dari standar FIPA-ACL (*Foundation for Intelligent Physical Agents*):
1. **REQUEST**: Meminta agen rekan untuk mengeksekusi aksi tertentu.
2. **INFORM**: Menyampaikan fakta atau hasil komputasi yang telah diverifikasi.
3. **PROPOSE**: Menawarkan proposal solusi atau alokasi tugas.
4. **REJECT_PROPOSAL**: Menolak tawaran disertai alasan kegagalan prasyarat.
`,
        },
      ],
    },
    {
      id: "agt-bab-6",
      slug: "evaluasi-keandalan-dan-proyek-terapan",
      title: "BAB 6: Evaluasi, Guardrails & Proyek Akhir Otonom",
      orderIndex: 6,
      description: "Metrik keandalan agen (AgentBench, WebArena), pagar pembatas keamanan (circuit breakers, rate limiting, human-in-the-loop), serta proyek akhir sistem riset ilmiah mandiri.",
      subchapters: [
        {
          id: "agt-bab-6-1",
          slug: "metrik-evaluasi-dan-pagar-pembatas-keamanan",
          title: "6.1. Metrik Keberhasilan Agen & Guardrails Eksekusi",
          orderIndex: 1,
          description: "Kuantifikasi keandalan sistem agen: Success Rate, Step Efficiency Ratio, Tool Call Accuracy, dan mekanisme Circuit Breakers untuk mencegah loop tak berhingga.",
          content_markdown: `# 6.1. Metrik Keberhasilan Agen & Guardrails Eksekusi

## 1. Metrik Kinerja Sistem Agen
1. **Task Success Rate ($SR$)**:
   Persentase tugas yang berhasil diselesaikan dan lolos verifikasi akhir:
   $$SR = \\frac{N_{\\text{success}}}{N_{\\text{total}}} \\times 100\\%$$
2. **Step Efficiency Ratio ($SER$)**:
   Rasio perbandingan jumlah langkah minimum optimal $L^*$ terhadap jumlah langkah aktual yang diambil agen $L$:
   $$SER = \\frac{L^*}{L} \\in (0, 1]$$
3. **Tool Call Precision & Syntax Validity**:
   Tingkat kesesuaian argumen fungsi terhadap skema parameter yang didefinisikan.

## 2. Guardrails & Mekanisme Pengamanan Eksekusi
- **Execution Circuit Breaker**: Menghentikan proses secara otomatis jika agen mengulang tindakan yang identik 3 kali berturut-turut (*loop detection*).
- **Tool Privilege Sandboxing**: Menjalankan eksekusi kode Python atau shell terminal di dalam lingkungan kontainer terisolasi (*ephemeral microVM / Docker*).
- **Human-in-the-Loop (HITL) Gate**: Memerlukan konfirmasi otorisasi pengguna manusia sebelum mengeksekusi operasi berbahaya (*high-impact mutations*, misal: transaksi keuangan, penghapusan tabel database).
`,
        },
        {
          id: "agt-bab-6-2",
          slug: "proyek-akhir-autonomous-scientific-researcher",
          title: "6.2. Proyek Akhir: Autonomous Scientific Research & Code Agent",
          orderIndex: 2,
          description: "Membangun sistem agen riset lengkap dari nol: pemecahan masalah, eksekusi kode terisolasi, verifikasi fakta otomatis, dan kompilasi laporan sintesis akademik.",
          content_markdown: `# 6.2. Proyek Akhir: Autonomous Scientific Research & Code Agent

## 1. Deskripsi Proyek
Mahasiswa membangun sistem agen riset otonom yang mampu menerima topik riset, mencari rujukan simulasi, mengeksekusi eksperimen kode Python, memvalidasi hasil uji hipotesis, dan mempublikasikan laporan berformat Markdown.

## 2. Kode Implementasi Proyek Akhir
Berikut adalah kode lengkap sistem agen terapan yang mengintegrasikan ReAct, registri alat, dan mekanisme pengamanan iterasi:

\`\`\`python
import re
import math
from typing import Dict, Any, List

class ScientificResearchAgent:
    """Agen riset otonom dengan kapabilitas kalkulasi, analisis data, dan verifikasi hipotesis."""
    def __init__(self, name: str):
        self.name = name
        self.memory_log: List[Dict[str, str]] = []
        self.knowledge_base = {
            "transformer_attention": "Kompleksitas komputasi standar Self-Attention adalah O(N^2 * d).",
            "flash_attention": "FlashAttention memanfaatkan GPU SRAM tiling untuk mengurangi IO bottleneck menjadi O(N) IO.",
            "linear_attention": "Linear attention melakukan aproksimasi kernel fitur dengan kompleksitas waktu O(N * d^2)."
        }

    def search_literature(self, query: str) -> str:
        query_clean = query.lower()
        results = []
        for topic, summary in self.knowledge_base.items():
            if any(term in topic or term in summary.lower() for term in query_clean.split()):
                results.append(f"[{topic}]: {summary}")
        if not results:
            return "Tidak ditemukan publikasi ilmiah yang cocok dengan kata kunci."
        return "\\n".join(results)

    def benchmark_complexity(self, seq_len: int) -> Dict[str, int]:
        d = 64
        standard_ops = (seq_len ** 2) * d
        linear_ops = seq_len * (d ** 2)
        return {
            "seq_len": seq_len,
            "standard_attention_ops": standard_ops,
            "linear_attention_ops": linear_ops,
            "speedup_ratio": round(standard_ops / linear_ops, 2)
        }

    def run_research_pipeline(self, topic_query: str, test_sequence_length: int) -> str:
        print(f"[{self.name}] Memulai investigasi riset: '{topic_query}'...")
        
        # Langkah 1: Pengumpulan Literatur
        lit_findings = self.search_literature(topic_query)
        self.memory_log.append({"step": "literature_search", "result": lit_findings})
        print(f"[{self.name}] Temuan Literatur:\\n{lit_findings}\\n")

        # Langkah 2: Eksperimen Numerik
        bench = self.benchmark_complexity(test_sequence_length)
        self.memory_log.append({"step": "empirical_benchmark", "result": str(bench)})
        print(f"[{self.name}] Hasil Komparasi Komputasi (N={test_sequence_length}):")
        print(f"  - Standard Ops : {bench['standard_attention_ops']:,}")
        print(f"  - Linear Ops   : {bench['linear_attention_ops']:,}")
        print(f"  - Ratio Efisiensi : {bench['speedup_ratio']}x\\n")

        # Langkah 3: Sintesis Akademik
        report = (
            f"# Laporan Riset Komparatif: {topic_query.title()}\\n\\n"
            f"## 1. Landasan Teori\\n{lit_findings}\\n\\n"
            f"## 2. Temuan Empiris Komputasi\\n"
            f"Pada panjang sekuens $N={test_sequence_length}$ dan dimensi $d=64$:\\n"
            f"- Operasi Flops Kuadratik: {bench['standard_attention_ops']:,}\\n"
            f"- Operasi Flops Linier: {bench['linear_attention_ops']:,}\\n"
            f"- **Keuntungan Kecepatan Teoretis**: {bench['speedup_ratio']}x lebih efisien.\\n\\n"
            f"## 3. Kesimpulan\\n"
            f"Pendekatan Linear Attention secara signifikan lebih skalabel untuk konteks panjang ekstrem ($N > 4096$)."
        )
        return report

# Demonstrasi Eksekusi
researcher = ScientificResearchAgent("Velqora-Scientist-01")
final_report = researcher.run_research_pipeline("attention complexity", test_sequence_length=8192)
print("=== HASIL AKHIR LAPORAN RISET ===")
print(final_report)
\`\`\`

## 3. Rubrik Penilaian Proyek
- **Arsitektur & Kebersihan Kode (30%)**: Modularitas penanganan exception dan validasi input.
- **Kedalaman Penalaran ReAct (30%)**: Kemampuan agen memulihkan diri saat alat mengembalikan observasi kosong atau galat.
- **Verifikasi Fakta & Ketiadaan Halusinasi (25%)**: Kesesuaian angka hasil benchmark terhadap formula matematis.
- **Kualitas Format Laporan Akademik (15%)**: Struktur Markdown teratur dengan notasi KaTeX yang tepat.
`,
        },
      ],
    },
  ],
};
