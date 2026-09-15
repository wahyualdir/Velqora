import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: EXPERT SYSTEM (TOPIK 14)
 * Rujukan Utama:
 * - Giarratano, J. C., & Riley, G. (2005). Expert Systems: Principles and Programming (4th ed.). Thomson/Course Technology.
 * - Shortliffe, E. H. (1976). Computer-Based Medical Consultations: MYCIN. Elsevier.
 * - Forgy, C. L. (1982). Rete: A fast algorithm for the many pattern/many object pattern match problem. Artificial Intelligence, 19(1), 17-37.
 * - Jackson, P. (1998). Introduction to Expert Systems (3rd ed.). Addison-Wesley.
 * - Buchanan, B. G., & Shortliffe, E. H. (1984). Rule-Based Expert Systems: The MYCIN Experiments. Addison-Wesley.
 */
export const expertSystemCurriculum: AcademicCurriculum = {
  id: "expert-system",
  slug: "expert-system",
  title: "Expert System",
  category: "Kecerdasan Buatan",
  level: "pemula",
  description: "Kurikulum komprehensif sistem pakar berbasis pengetahuan dan aturan produksi (*production rules*): arsitektur pemisahan basis pengetahuan (*Knowledge Base*) dan mesin inferensi (*Inference Engine*), kompilasi jaringan pencocokan pola algoritma Rete, strategi penalaran maju (*Forward Chaining*) dan mundur (*Backward Chaining*), penalaran dalam ketidakpastian (*Certainty Factors* model MYCIN), fasilitas eksplanasi (*Explanation Facility*), serta perancangan sistem diagnosa terapan.",
  estimatedHours: 48,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Expert Systems: Principles and Programming (4th Edition)",
      authors: ["Joseph C. Giarratano", "Gary D. Riley"],
      type: "book",
      url: "https://www.cengage.com/",
      relevance: "Buku teks definitif sistem berbasis aturan CLIPS, representasi fakta, algoritma Rete, dan strategi resolusi konflik.",
      year: 2005,
      publisherOrVenue: "Course Technology / Cengage Learning",
    },
    {
      title: "Computer-Based Medical Consultations: MYCIN",
      authors: ["Edward H. Shortliffe"],
      type: "book",
      url: "https://www.sciencedirect.com/book/9780444001795/computer-based-medical-consultations-mycin",
      relevance: "Karya perintis sistem pakar diagnostik infeksi darah bakterial dan formulasi matematis Certainty Factors.",
      year: 1976,
      publisherOrVenue: "Elsevier",
    },
    {
      title: "Rete: A fast algorithm for the many pattern/many object pattern match problem",
      authors: ["Charles L. Forgy"],
      type: "paper",
      url: "https://www.sciencedirect.com/science/article/pii/0004370282900200",
      doi: "10.1016/0004-3702(82)90020-0",
      relevance: "Algoritma kompilasi jaringan graf diskriminasi Alpha/Beta memory untuk pencocokan fakta berkecepatan tinggi tanpa pencarian linier.",
      year: 1982,
      publisherOrVenue: "Artificial Intelligence Journal",
    },
  ],
  chapters: [
    {
      id: "es-bab-1",
      slug: "paradigma-sistem-pakar-dan-arsitektur-inti",
      title: "BAB 1: Paradigma Sistem Pakar & Pemisahan Pengetahuan",
      orderIndex: 1,
      description: "Evolusi komputasi berbasis algoritma prosedural menuju komputasi berbasis pengetahuan deklaratif, anatomi tiga komponen (Working Memory, Rule Base, Inference Engine), dan peran Knowledge Engineer.",
      subchapters: [
        {
          id: "es-bab-1-1",
          slug: "dekomposisi-arsitektur-sistem-pakar",
          title: "1.1. Dekomposisi Arsitektur: Working Memory, Rule Base, dan Inference Engine",
          orderIndex: 1,
          description: "Prinsip pemisahan domain knowledge dari inference mechanism yang memungkinkan modifikasi aturan tanpa mengubah kode program.",
          content_markdown: `# 1.1. Dekomposisi Arsitektur: Working Memory, Rule Base, dan Inference Engine

## 1. Tujuan Pembelajaran
Mahasiswa mampu:
1. Membedakan pemrograman algoritmik prosedural konvensional ($Data + Algoritma = Program$) dengan sistem pakar ($Pengetahuan + Inferensi = Sistem$).
2. Menguraikan tiga modul inti: **Working Memory** (memori kerja dinamis), **Knowledge Base** (basis aturan permanen), dan **Inference Engine** (mesin penalaran).
3. Menganalisis peran *Knowledge Engineer* dalam akuisisi pengetahuan dari pakar manusia.

## 2. Paradigma Deklaratif vs Prosedural
Dalam sistem perangkat lunak tradisional:
$$\\text{Traditional Software}: \\quad \\text{Knowledge and Control are interwoven} \\implies \\text{Sulit dimodifikasi}$$

Dalam sistem pakar:
$$\\text{Expert System}: \\quad \\text{Knowledge Base (What)} \\quad \\perp \\quad \\text{Inference Engine (How to reason)}$$

- **Working Memory (WM)**: Menyimpan status fakta saat ini yang diketahui benar tentang masalah spesifik yang sedang dianalisis ($F_1, F_2, \\dots, F_k$).
- **Rule Base (KB)**: Kumpulan aturan inferensi domain umum berbentuk produksi IF-THEN ($R_1, R_2, \\dots, R_m$).
- **Inference Engine**: Modul pengendali yang mencocokkan fakta dalam WM dengan premis aturan di KB, memilih aturan yang terpicu, dan mengeksekusi konklusinya.

## 3. Latihan Konsep
1. Jelaskan mengapa penambahan aturan baru pada sistem pakar tidak merusak eksekusi aturan lama, berbeda dengan penambahan blok \`if-else\` bertingkat pada kode prosedural!
`,
        },
      ],
    },
    {
      id: "es-bab-2",
      slug: "representasi-pengetahuan-aturan-produksi",
      title: "BAB 2: Representasi Pengetahuan: Aturan Produksi & Fakta",
      orderIndex: 2,
      description: "Sintaks formal aturan produksi IF (Antecedent) THEN (Consequent), representasi fakta relasional dan atribut-nilai (Attribute-Value-Uncertainty triplets).",
      subchapters: [
        {
          id: "es-bab-2-1",
          slug: "struktur-aturan-produksi-dan-fakta",
          title: "2.1. Struktur Formal Aturan Produksi & Validasi Semantik",
          orderIndex: 1,
          description: "Premis majemuk konjungtif dan disjungtif, aksi konsekuen asertif (ASSERT) dan retraksi fakta (RETRACT).",
          content_markdown: `# 2.1. Struktur Formal Aturan Produksi & Validasi Semantik

## 1. Struktur Standar Aturan Produksi
Sebuah aturan produksi $R_i$ didefinisikan sebagai:

$$R_i: \\quad \\text{IF } P_1 \\land P_2 \\land \\dots \\land P_k \\quad \\Longrightarrow \\quad \\text{THEN } C_1, C_2, \\dots, C_m$$

Di mana:
- **Antecedent (LHS - Left Hand Side)**: Kondisi atau pola fakta yang harus terpenuhi dalam memori kerja.
- **Consequent (RHS - Right Hand Side)**: Tindakan yang dieksekusi ketika aturan diaktifkan.

Aksi RHS standar:
1. $\\text{ASSERT}(F)$: Menambahkan fakta baru $F$ ke dalam memori kerja.
2. $\\text{RETRACT}(F)$: Menghapus fakta usang $F$ yang tidak lagi valid dari memori kerja.
3. $\\text{MODIFY}(F, attr, val)$: Memperbarui nilai atribut fakta yang ada.
`,
        },
      ],
    },
    {
      id: "es-bab-3",
      slug: "mesin-inferensi-forward-chaining-dan-rete",
      title: "BAB 3: Mesin Inferensi Forward Chaining & Algoritma Rete",
      orderIndex: 3,
      description: "Siklus eksekusi Match-Resolve-Act, strategi resolusi konflik (Salience, Recency, Specificity), dan optimasi pencocokan pola jaringan Rete Forgy.",
      subchapters: [
        {
          id: "es-bab-3-1",
          slug: "siklus-match-resolve-act-dan-resolusi-konflik",
          title: "3.1. Siklus Match-Resolve-Act & Strategi Resolusi Konflik",
          orderIndex: 1,
          description: "Mengelola conflict set ketika beberapa aturan terpicu secara bersamaan dalam satu siklus penalaran.",
          content_markdown: `# 3.1. Siklus Match-Resolve-Act & Strategi Resolusi Konflik

## 1. Siklus Tiga Fase Inferensi Maju
1. **Match**: Membandingkan fakta saat ini di Working Memory dengan seluruh kondisi LHS aturan untuk menghasilkan **Conflict Set** (himpunan aturan aktif).
2. **Resolve (Conflict Resolution)**: Jika conflict set berisi $> 1$ aturan, terapkan heuristik seleksi:
   - *Salience / Priority*: Aturan dengan bobot prioritas tertinggi dieksekusi terlebih dahulu.
   - *Recency*: Aturan yang dicocokkan oleh fakta paling baru dieksekusi duluan.
   - *Specificity*: Aturan dengan jumlah premis terbanyak (paling spesifik) lebih diutamakan daripada aturan umum.
3. **Act**: Eksekusi aksi RHS dari aturan terpilih, memperbarui memori kerja, dan mengulang siklus hingga conflict set kosong (*quiescence*).
`,
        },
        {
          id: "es-bab-3-2",
          slug: "algoritma-kompilasi-jaringan-rete",
          title: "3.2. Algoritma Rete: Kompilasi Jaringan Alpha & Beta Memory",
          orderIndex: 2,
          description: "Mencegah evaluasi ulang berulang $\\mathcal{O}(R \\cdot F)$ melalui pemanfaatan node diskriminasi pola Alpha Memory dan penggabungan Beta Memory bertahap.",
          content_markdown: `# 3.2. Algoritma Rete: Kompilasi Jaringan Alpha & Beta Memory (Forgy, 1982)

## 1. Masalah Bottleneck Pencocokan Naif
Pada sistem dengan 10.000 aturan dan 5.000 fakta, pencocokan naif membutuhkan pengujian berulang di setiap siklus:

$$\\text{Kompleksitas Naif}: \\quad \\mathcal{O}(|R| \\cdot |F|^k)$$

## 2. Inovasi Jaringan Rete
Forgy memanfaatkan dua sifat sistem berbasis aturan:
1. **Temporal Redundancy**: Antara dua siklus berturut-turut, hanya sebagian kecil fakta di Working Memory yang berubah (biasanya $< 1\\%$).
2. **Structural Similarity**: Banyak aturan berbagi kondisi premis yang identik.

Jaringan Rete terdiri dari:
- **Root Node**: Pintu masuk seluruh token fakta yang dimasukkan/dihapus.
- **1-input Nodes (Alpha Memory)**: Menguji kondisi pada atribut fakta tunggal (misal: \`suhu > 38\`).
- **2-input Nodes (Beta Memory)**: Menguji konsistensi variabel antar-fakta majemuk (misal: \`pasien.id == rekam_medis.pasien_id\`).
- **Terminal Node**: Berkorespondensi dengan aturan siap eksekusi di agenda.
`,
        },
      ],
    },
    {
      id: "es-bab-4",
      slug: "backward-chaining-dan-goal-driven-reasoning",
      title: "BAB 4: Inferensi Mundur (Backward Chaining) & Goal-Stacking",
      orderIndex: 4,
      description: "Penalaran berorientasi tujuan (*goal-driven*), struktur pohon pembuktian AND/OR Graph, penelusuran rekursif sub-goals, dan interaksi tanya-jawab adaptif dengan pengguna.",
      subchapters: [
        {
          id: "es-bab-4-1",
          slug: "penalaran-goal-driven-dan-and-or-graph",
          title: "4.1. Algoritma Backward Chaining & Representasi AND/OR Tree",
          orderIndex: 1,
          description: "Pembuktian hipotesis dengan menelusuri premis secara rekursif hingga mencapai fakta dasar atau menanyakan fakta yang belum diketahui ke pengguna.",
          content_markdown: `# 4.1. Algoritma Backward Chaining & Representasi AND/OR Tree

## 1. Cara Kerja Backward Chaining
1. Diberikan hipotesis target $G$ yang ingin dibuktikan kebenarannya.
2. Periksa apakah $G$ sudah ada di Working Memory:
   - Jika YA: Hipotesis terbukti benar!
3. Jika TIDAK: Cari semua aturan $R$ di KB yang konsekuensinya ($RHS$) memuat $G$.
4. Untuk setiap aturan kandidat:
   - Tetapkan setiap premis $LHS$ sebagai **Sub-Goal** baru.
   - Panggil backward chaining secara rekursif untuk membuktikan setiap sub-goal.
5. Jika tidak ada aturan yang dapat membuktikan sub-goal dan fakta tidak ada di memori:
   - Sistem mengajukan pertanyaan terarah secara interaktif kepada pengguna.

## 2. Implementasi Python: Mesin Backward Chaining Interaktif
\`\`\`python
from typing import Dict, List, Optional

class BackwardChainingSystem:
    def __init__(self):
        # Format aturan: Goal -> List of required sub-premises
        self.rules: Dict[str, List[List[str]]] = {}
        self.known_facts: Dict[str, bool] = {}

    def add_rule(self, conclusion: str, premises: List[str]):
        if conclusion not in self.rules:
            self.rules[conclusion] = []
        self.rules[conclusion].append(premises)

    def set_fact(self, fact: str, val: bool):
        self.known_facts[fact] = val

    def prove(self, goal: str, depth: int = 0) -> bool:
        indent = "  " * depth
        print(f"{indent}--> Mencoba membuktikan: '{goal}'")
        
        # 1. Cek fakta yang sudah diketahui
        if goal in self.known_facts:
            status = self.known_facts[goal]
            print(f"{indent}[FAKTA DIKETAHUI] '{goal}' = {status}")
            return status

        # 2. Cek apakah ada aturan yang menghasilkan goal ini
        if goal in self.rules:
            for rule_premises in self.rules[goal]:
                print(f"{indent}[EVALUASI ATURAN] Untuk '{goal}', butuh premis: {rule_premises}")
                all_subgoals_met = True
                for p in rule_premises:
                    if not self.prove(p, depth + 1):
                        all_subgoals_met = False
                        break
                if all_subgoals_met:
                    print(f"{indent}[TERBUKTI] '{goal}' bernilai TRUE via aturan!")
                    self.known_facts[goal] = True
                    return True

        # 3. Jika fakta belum ada dan tak ada aturan, tanyakan pengguna
        print(f"{indent}[TANYA USER] Apakah '{goal}' bernilai benar? (Simulasi auto-jawab)")
        # Simulasi input user
        user_val = False
        self.known_facts[goal] = user_val
        return user_val

# Uji Coba Backward Chaining Diagnostik
kb = BackwardChainingSystem()
kb.add_rule("infeksi_paru", ["demam_tinggi", "batuk_berdahak", "rontgen_infiltrat"])
kb.add_rule("demam_tinggi", ["suhu_diatas_38"])

kb.set_fact("suhu_diatas_38", True)
kb.set_fact("batuk_berdahak", True)
kb.set_fact("rontgen_infiltrat", True)

is_infected = kb.prove("infeksi_paru")
print(f"\\nHasil Diagnosa Akhir 'infeksi_paru': {is_infected}")
\`\`\`
`,
        },
      ],
    },
    {
      id: "es-bab-5",
      slug: "penalaran-ketidakpastian-certainty-factors-mycin",
      title: "BAB 5: Penalaran dalam Ketidakpastian: Certainty Factors (CF)",
      orderIndex: 5,
      description: "Model ketidakpastian Shortliffe-Buchanan MYCIN: Measure of Belief (MB), Measure of Disbelief (MD), perambatan CF aturan berantai, kombinasi bukti independen ganda, dan perbandingan dengan Teori Dempster-Shafer.",
      subchapters: [
        {
          id: "es-bab-5-1",
          slug: "matematika-certainty-factors-mycin",
          title: "5.1. Penurunan Matematis Certainty Factors & Hukum Kombinasi",
          orderIndex: 1,
          description: "Membuktikan rumus kombinasi aturan konjungtif, disjungtif, berantai, dan paralel tanpa melanggar batasan probabilitas interval $[-1, +1]$.",
          content_markdown: `# 5.1. Penurunan Matematis Certainty Factors & Hukum Kombinasi

## 1. Definisi Matematis Certainty Factor
Diberikan hipotesis $H$ dan bukti $E$:

$$\\text{CF}(H, E) = \\text{MB}(H, E) - \\text{MD}(H, E)$$

Di mana $\\text{MB}$ mengukur peningkatan keyakinan terhadap $H$ karena adanya $E$, dan $\\text{MD}$ mengukur peningkatan ketidakyakinan:

$$\\text{MB}(H, E) = \\begin{cases} 1 & \\text{jika } P(H) = 1 \\\\ \\frac{\\max(P(H|E), P(H)) - P(H)}{1 - P(H)} & \\text{lainnya} \\end{cases}$$

## 2. Tiga Kasus Perhitungan Kombinasi CF

### Kasus 1: Premis Tunggal Berantai (Serial Rule Chaining)
Jika aturan memiliki keyakinan internal $\\text{CF}_{\\text{rule}}$ dan premis bukti $E$ didukung dengan keyakinan $\\text{CF}(E)$:

$$\\text{CF}(H) = \\text{CF}_{\\text{rule}} \\times \\max(0, \\text{CF}(E))$$

### Kasus 2: Premis Majemuk (AND / OR)
- **Konjungsi ($E_1 \\land E_2$)**: $\\text{CF}(E_1 \\land E_2) = \\min\\left(\\text{CF}(E_1), \\text{CF}(E_2)\\right)$
- **Disjungsi ($E_1 \\lor E_2$)**: $\\text{CF}(E_1 \\lor E_2) = \\max\\left(\\text{CF}(E_1), \\text{CF}(E_2)\\right)$

### Kasus 3: Kombinasi Bukti Independen Paralel (Co-concurrence)
Dua aturan berbeda $R_1$ dan $R_2$ menyimpulkan hipotesis $H$ yang sama dengan keyakinan $\\text{CF}_1$ dan $\\text{CF}_2$:

$$\\text{CF}_{\\text{kombinasi}} = \\begin{cases}
\\text{CF}_1 + \\text{CF}_2 - (\\text{CF}_1 \\cdot \\text{CF}_2) & \\text{jika } \\text{CF}_1 > 0 \\text{ dan } \\text{CF}_2 > 0 \\\\
\\text{CF}_1 + \\text{CF}_2 + (\\text{CF}_1 \\cdot \\text{CF}_2) & \\text{jika } \\text{CF}_1 < 0 \\text{ dan } \\text{CF}_2 < 0 \\\\
\\frac{\\text{CF}_1 + \\text{CF}_2}{1 - \\min(|\\text{CF}_1|, |\\text{CF}_2|)} & \\text{jika berlawanan tanda}
\\end{cases}$$
`,
        },
      ],
    },
    {
      id: "es-bab-6",
      slug: "praktikum-sistem-pakar-end-to-end",
      title: "BAB 6: Praktikum & Proyek Akhir: Diagnostic Engine with Explanation Facility",
      orderIndex: 6,
      description: "Membangun sistem diagnosa kerusakan teknis atau konsultasi medis end-to-end dengan penelusuran jejak inferensi (*HOW and WHY questions*).",
      subchapters: [
        {
          id: "es-bab-6-1",
          slug: "proyek-mesin-diagnosa-dengan-fasilitas-eksplanasi",
          title: "6.1. Proyek Akhir: Implementasi Mesin Konsultasi Lengkap dengan Audit Trail",
          orderIndex: 1,
          description: "Membangun modul Python produksi yang memuat aturan JSON, mengkalkulasi CF komparatif, dan menyajikan penjelasan logis pohon pembuktian.",
          content_markdown: `# 6.1. Proyek Akhir: Implementasi Mesin Konsultasi Lengkap dengan Audit Trail

## 1. Spesifikasi Proyek
Mahasiswa membangun sistem pakar lengkap dengan spesifikasi:
1. **Knowledge Representation**: Membaca basis aturan produksi berbobot CF dari berkas JSON.
2. **Fasilitas Interaksi**: Mengajukan pertanyaan gejala secara cerdas dan menerima keyakinan user (skala $-1.0$ s.d. $+1.0$).
3. **Akumulasi CF**: Menerapkan kombinasi serial dan paralel secara akurat.
4. **Explanation Facility**:
   - Menjawab pertanyaan **WHY**: Mengapa sistem menanyakan gejala tertentu (menampilkan aturan aktif yang sedang diuji).
   - Menjawab pertanyaan **HOW**: Bagaimana sistem mencapai kesimpulan akhir (menampilkan rantai deduksi).

## 2. Kode Solusi Acuan Proyek
\`\`\`python
import json

class ProductionRule:
    def __init__(self, rule_id: str, premises: list, conclusion: str, cf: float, description: str = ""):
        self.rule_id = rule_id
        self.premises = premises
        self.conclusion = conclusion
        self.cf = cf
        self.description = description

class DiagnosticExpertSystem:
    def __init__(self):
        self.rules = []
        self.evidence = {}
        self.inferred = {}
        self.audit_trail = []

    def add_rule(self, rule: ProductionRule):
        self.rules.append(rule)

    def set_user_evidence(self, symptom: str, user_cf: float):
        self.evidence[symptom] = max(-1.0, min(1.0, user_cf))

    def evaluate(self):
        for rule in self.rules:
            # Evaluasi premis (AND)
            premise_cfs = [self.evidence.get(p, 0.0) for p in rule.premises]
            min_premise_cf = min(premise_cfs) if premise_cfs else 0.0

            if min_premise_cf > 0.2:
                # Perhitungan CF berantai
                rule_yield_cf = rule.cf * min_premise_cf
                conc = rule.conclusion
                
                # Kombinasi paralel jika sudah ada bukti sebelumnya
                if conc in self.inferred:
                    cf1 = self.inferred[conc]
                    cf2 = rule_yield_cf
                    if cf1 > 0 and cf2 > 0:
                        combined = cf1 + cf2 - (cf1 * cf2)
                    elif cf1 < 0 and cf2 < 0:
                        combined = cf1 + cf2 + (cf1 * cf2)
                    else:
                        combined = (cf1 + cf2) / (1.0 - min(abs(cf1), abs(cf2)))
                    self.inferred[conc] = combined
                else:
                    self.inferred[conc] = rule_yield_cf

                self.audit_trail.append({
                    "rule": rule.rule_id,
                    "premises": rule.premises,
                    "yield_cf": round(rule_yield_cf, 3),
                    "conclusion": conc
                })

    def explain_how(self, conclusion: str):
        print(f"\\n[EXPLANATION FACILITY - HOW '{conclusion}' WAS INFERRED]:")
        steps = [s for s in self.audit_trail if s["conclusion"] == conclusion]
        for idx, s in enumerate(steps, 1):
            print(f"  {idx}. Aturan {s['rule']} terpicu karena premis {s['premises']} terpenuhi -> kontribusi CF: {s['yield_cf']}")

# Eksekusi Demo Diagnostik
diag = DiagnosticExpertSystem()
diag.add_rule(ProductionRule("R1", ["suhu_tinggi", "batuk"], "influenza", 0.8))
diag.add_rule(ProductionRule("R2", ["nyeri_otot", "sakit_kepala"], "influenza", 0.6))
diag.add_rule(ProductionRule("R3", ["batuk", "sesak_napas"], "bronkitis", 0.85))

# Masukan Pasien
diag.set_user_evidence("suhu_tinggi", 0.9)
diag.set_user_evidence("batuk", 0.8)
diag.set_user_evidence("nyeri_otot", 0.7)
diag.set_user_evidence("sakit_kepala", 0.85)

diag.evaluate()
print("Hasil Diagnosa Terindikasi:")
for disease, cf in sorted(diag.inferred.items(), key=lambda x: x[1], reverse=True):
    print(f"  - {disease.upper()}: Tingkat Kepastian = {cf * 100:.1f}%")

diag.explain_how("influenza")
\`\`\`
`,
        },
      ],
    },
  ],
};
