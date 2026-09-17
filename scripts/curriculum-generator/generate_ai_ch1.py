import json
import os

def create_subchapter(id_str, title, description, content_markdown, code_snippet, expected_output, common_pitfalls, canonical_refs):
    return {
        "id": id_str,
        "title": title,
        "description": description,
        "content": content_markdown.strip(),
        "codeSnippet": code_snippet.strip(),
        "expectedOutput": expected_output.strip(),
        "commonPitfalls": common_pitfalls.strip(),
        "canonicalReferences": canonical_refs
    }

subchapters = []

# ==============================================================================
# SUBCHAPTER 1.1
# ==============================================================================
c1_1_desc = "Analisis epistemologis dan taksonomi formal empat kuadran pendekatan kecerdasan buatan: berpikir manusiawi (Cognitive Science), bertindak manusiawi (Turing Test), berpikir rasional (Laws of Thought), dan bertindak rasional (Rational Agent)."
c1_1_md = """Kecerdasan Buatan (Artificial Intelligence / AI) bukan sekadar cabang teknik perangkat lunak, melainkan sintesis lintas disiplin untuk memodelkan dan merekayasa entitas cerdas. Stuart Russell & Peter Norvig dalam teks kanonikal *Artificial Intelligence: A Modern Approach* (AIMA, Edisi ke-4) membedah definisi AI ke dalam **Matriks Empat Kuadran** yang dibedakan oleh dua sumbu ortogonal:
1. **Sumbu Fokus**: Apakah sistem berorientasi pada proses penalaran internal (*thought processes and reasoning*) atau perilaku eksternal (*behavior and action*)?
2. **Sumbu Tolok Ukur**: Apakah kecerdasan dinilai berdasarkan kesesuaian dengan perilaku manusia (*human performance*) atau standar keidealan normatif rasional (*rationality / ideal concept of intelligence*)?

Empat kuadran tersebut didefinisikan sebagai berikut:
- **1. Berpikir Manusiawi (Thinking Humanly)**: Pendekatan ilmu kognitif (*Cognitive Science*) yang berupaya merekonstruksi cara kerja pikiran manusia secara empiris. Sistem harus melalui eksperimen psikologis atau pencitraan otak (fMRI) untuk membuktikan bahwa langkah komputasi yang diambil identik dengan mekanisme neurologis kognisi manusia (Newell & Simon, 1961 - General Problem Solver).
- **2. Bertindak Manusiawi (Acting Humanly)**: Pendekatan operasional yang diinisiasi oleh Alan Turing (1950) melalui *Turing Test*. Mesin dianggap cerdas jika penguji manusia tidak dapat membedakan respons verbal mesin dari manusia sungguhan melalui saluran telekomunikasi teletype. Pendekatan ini menuntut integrasi Natural Language Processing, Knowledge Representation, Automated Reasoning, dan Machine Learning.
- **3. Berpikir Rasional (Thinking Rationally)**: Pendekatan berbasis silogisme hukum logika formal (*Laws of Thought*) yang diwariskan dari tradisi Aristoteles. Masalah dikodifikasi ke dalam notasi logika matematis deduktif: jika premis benar, maka kesimpulan pasti benar secara inferensial. Hambatannya terletak pada kesulitan mentransformasikan pengetahuan dunia nyata yang berderau (*noisy/uncertain*) ke dalam format logika formal yang kaku.
- **4. Bertindak Rasional (Acting Rationally)**: Pendekatan **Agen Rasional (Rational Agent)** yang menjadi paradigma sentral AI modern. Agen rasional adalah entitas yang mempersepsikan lingkungannya melalui sensor dan bertindak melalui aktuator untuk memaksimalkan estimasi ukuran kinerja (*expected performance measure*), berdasarkan riwayat persepsi (*percept sequence*) dan pengetahuan bawaan.

Pendekatan agen rasional lebih umum dan kokoh daripada hukum pemikiran (*laws of thought*) karena mencakup tindakan refleks ketika inferensi logis terlalu lambat, serta lebih ilmiah daripada sekadar meniru kelemahan biologis manusia (*acting humanly*)."""

c1_1_code = """from dataclasses import dataclass
from enum import Enum
from typing import List

class Dimension(Enum):
    THOUGHT = "Proses Penalaran (Internal)"
    BEHAVIOR = "Perilaku Nyata (Eksternal)"

class Standard(Enum):
    HUMAN = "Kesesuaian Manusia (Empiris)"
    RATIONAL = "Kerasionalan Ideal (Normatif)"

@dataclass(frozen=True)
class AIQuadrant:
    dimension: Dimension
    standard: Standard
    approach_name: str
    primary_benchmark: str
    historical_pioneers: str

# Inisialisasi Matriks Taksonomi Russell & Norvig
quadrants: List[AIQuadrant] = [
    AIQuadrant(Dimension.THOUGHT, Standard.HUMAN, "Thinking Humanly", "Validasi Kognitif & Model Otak fMRI", "Newell & Simon (1961)"),
    AIQuadrant(Dimension.BEHAVIOR, Standard.HUMAN, "Acting Humanly", "Imitation Game (Uji Turing)", "Alan Turing (1950)"),
    AIQuadrant(Dimension.THOUGHT, Standard.RATIONAL, "Thinking Rationally", "Hukum Logika Deduktif & Silogisme", "Aristoteles, Boole, Frege"),
    AIQuadrant(Dimension.BEHAVIOR, Standard.RATIONAL, "Acting Rationally", "Maksimisasi Expected Utility (Agen Rasional)", "Russell & Norvig, von Neumann")
]

print("MATRIKS TAKSONOMI EMPAT KUADRAN PENDEKATAN AI (RUSSELL & NORVIG):")
print("-" * 75)
for q in quadrants:
    print(f"Pendekatan : {q.approach_name:<20}")
    print(f"Sumbu       : [{q.dimension.value}] x [{q.standard.value}]")
    print(f"Tolok Ukur  : {q.primary_benchmark}")
    print(f"Pelopor     : {q.historical_pioneers}")
    print("-" * 75)"""

c1_1_out = """MATRIKS TAKSONOMI EMPAT KUADRAN PENDEKATAN AI (RUSSELL & NORVIG):
---------------------------------------------------------------------------
Pendekatan : Thinking Humanly    
Sumbu       : [Proses Penalaran (Internal)] x [Kesesuaian Manusia (Empiris)]
Tolok Ukur  : Validasi Kognitif & Model Otak fMRI
Pelopor     : Newell & Simon (1961)
---------------------------------------------------------------------------
Pendekatan : Acting Humanly      
Sumbu       : [Perilaku Nyata (Eksternal)] x [Kesesuaian Manusia (Empiris)]
Tolok Ukur  : Imitation Game (Uji Turing)
Pelopor     : Alan Turing (1950)
---------------------------------------------------------------------------
Pendekatan : Thinking Rationally 
Sumbu       : [Proses Penalaran (Internal)] x [Kerasionalan Ideal (Normatif)]
Tolok Ukur  : Hukum Logika Deduktif & Silogisme
Pelopor     : Aristoteles, Boole, Frege
---------------------------------------------------------------------------
Pendekatan : Acting Rationally   
Sumbu       : [Perilaku Nyata (Eksternal)] x [Kerasionalan Ideal (Normatif)]
Tolok Ukur  : Maksimisasi Expected Utility (Agen Rasional)
Pelopor     : Russell & Norvig, von Neumann
---------------------------------------------------------------------------"""

c1_1_pit = "Mengasumsikan bahwa tujuan utama AI rekayasa adalah meniru manusia secara persis (*Acting Humanly*). Manusia sering bertindak irasional, bias, emosional, dan memiliki keterbatasan memori jangka pendek. Standar rekayasa modern memprioritaskan *Acting Rationally* (mengoptimalkan utilitas objektif) daripada mereplikasi kelemahan kognitif biologis."
c1_1_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Global Ed., Chapter 1: Introduction", "url": "https://aima.cs.berkeley.edu/"},
    {"title": "Alan M. Turing (1950) Computing Machinery and Intelligence, Mind 59 (236): 433-460", "url": "https://doi.org/10.1093/mind/LIX.236.433"}
]
subchapters.append(create_subchapter("1.1", "Sejarah, Definisi, & Empat Kuadran Pendekatan AI (Thinking vs Acting, Humanly vs Rationally)", c1_1_desc, c1_1_md, c1_1_code, c1_1_out, c1_1_pit, c1_1_ref))

# ==============================================================================
# SUBCHAPTER 1.2
# ==============================================================================
c1_2_desc = "Pemeriksaan filosofis Uji Turing (The Imitation Game), argumen penolakan John Searle (Chinese Room Argument), konsep intensi sintaksis vs semantik, serta batasan teoretis kecerdasan mesin."
c1_2_md = """Pada tahun 1950, Alan Turing mempublikasikan makalah monumentalnya *"Computing Machinery and Intelligence"* di jurnal *Mind*. Menghindari debat ontologis yang kabur mengenai apakah mesin 'dapat berpikir', Turing merumuskan alternatif operasional yang dikenal sebagai **The Imitation Game** (Uji Turing). Dalam uji ini, seorang interogator manusia berkomunikasi melalui teks terminal dengan dua entitas di ruang tertutup: satu manusia dan satu mesin. Mesin dinyatakan lulus jika interogator tidak dapat membedakan secara konsisten mana manusia dan mana komputer setelah interogasi intensif selama durasi tertentu (misal 5 menit dengan akurasi tebakan <70%).

Untuk lulus Uji Turing standar, sebuah sistem komputasi membutuhkan enam disiplin ilmu kunci:
1. **Natural Language Processing (NLP)**: Berkomunikasi secara fasih dalam bahasa alami.
2. **Knowledge Representation**: Menyimpan informasi dunia nyata sebelum dan selama interogasi.
3. **Automated Reasoning**: Menggunakan informasi yang tersimpan untuk menjawab pertanyaan dan menarik kesimpulan logis baru.
4. **Machine Learning**: Beradaptasi dengan situasi baru dan mengekstrapolasi pola percakapan.
5. **Computer Vision** (Total Turing Test): Mempersepsikan objek visual interogator.
6. **Robotics** (Total Turing Test): Memanipulasi objek fisik dan bernavigasi dalam lingkungan nyata.

Meskipun Uji Turing menjadi tolok ukur operasional yang populer, filsuf John Searle (1980) mengajukan eksperimen pikiran tandingan yang sangat mendalam: **The Chinese Room Argument**. Searle membayangkan dirinya terisolasi di dalam ruangan terkunci tanpa memahami satu kata pun bahasa Mandarin. Ia dilengkapi buku instruksi bahasa Inggris yang memuat tabel aturan manipulasi simbol (*syntactic lookup rules*). Dari celah pintu, penutur asli bahasa Mandarin memasukkan pertanyaan berupa simbol Hanzi. Searle mencocokkan simbol berdasarkan bentuk fisik grafisnya sesuai tabel aturan, menghasilkan simbol balasan yang sempurna, lalu mengeluarkannya.

Bagi pengamat di luar, ruangan tersebut tampak 'memahami' bahasa Mandarin secara fasih. Namun, Searle di dalam ruangan sama sekali tidak memiliki pemahaman semantik (*zero semantic understanding*). Kesimpulan filosofis Searle: manipulasi simbol sintaksis murni (*syntax*) dari komputer digital tidak pernah cukup untuk menghasilkan pemahaman sejati (*semantics*) atau kesadaran intensionalitas (*intentionality*). Oleh karena itu, AI kuat (*Strong AI*) yang mengklaim komputer terprogram secara harfiah memiliki pikiran sadar ditolak oleh Searle, sementara AI lemah (*Weak AI*) yang memandang komputer sebagai model instrumen simulasi perilaku cerdas tetap sahih secara ilmiah."""

c1_2_code = """from typing import Dict

class ChineseRoomSimulator:
    def __init__(self, rule_book: Dict[str, str]):
        self.rule_book = rule_book
        self.internal_understanding = False # Operator sama sekali tidak paham semantik

    def receive_and_reply(self, input_symbol: str) -> str:
        # Manipulasi sintaks murni berdasarkan pencocokan pola aturan tabel
        if input_symbol in self.rule_book:
            return self.rule_book[input_symbol]
        return "未知符号" # Simbol tidak dikenal

# Buku aturan sintaksis (hanya memetakan simbol ke simbol)
syntax_rules = {
    "你好吗？": "我很好，谢谢你！",
    "你叫什么名字？": "我是图灵测试模拟程序。",
    "什么是人工智能？": "人工智能是理性的计算代理系统。"
}

room = ChineseRoomSimulator(syntax_rules)
query = "你好吗？"
response = room.receive_and_reply(query)

print("SIMULASI RUANG MANDARIN (JOHN SEARLE 1980):")
print(f"Simbol Masukan dari Luar : {query}")
print(f"Simbol Luaran Dihasilkan : {response}")
print(f"Pemahaman Semantik Agen : {room.internal_understanding}")
print()
print("Analisis Filosofis:")
print("Pengamat luar menyimpulkan sistem paham bahasa Mandarin (Perilaku Cerdas Lolos).")
print("Namun agen komputasi hanya mengeksekusi manipulasi sintaksis tanpa pemahaman batin!")"""

c1_2_out = """SIMULASI RUANG MANDARIN (JOHN SEARLE 1980):
Simbol Masukan dari Luar : 你好吗？
Simbol Luaran Dihasilkan : 我很好，谢谢你！
Pemahaman Semantik Agen : False

Analisis Filosofis:
Pengamat luar menyimpulkan sistem paham bahasa Mandarin (Perilaku Cerdas Lolos).
Namun agen komputasi hanya mengeksekusi manipulasi sintaksis tanpa pemahaman batin!"""

c1_2_pit = "Menyamakan kemampuan manipulasi simbol statistik (seperti Large Language Model modern) dengan pemahaman semantik dan kesadaran sadar (*sentience*). Menurut Searle, memproduksi teks koheren hanyalah manipulasi pola probabilitas kondisional (*syntactic processing*), bukan bukti kepemilikan intensi kesadaran biologis."
c1_2_ref = [
    {"title": "Alan M. Turing (1950) Computing Machinery and Intelligence, Mind", "url": "https://doi.org/10.1093/mind/LIX.236.433"},
    {"title": "John R. Searle (1980) Minds, Brains, and Programs, Behavioral and Brain Sciences", "url": "https://doi.org/10.1017/S0140525X00005756"}
]
subchapters.append(create_subchapter("1.2", "Uji Turing (Turing Test), Chinese Room Argument (Searle), & Batasan Filosofis Kecerdasan Mesin", c1_2_desc, c1_2_md, c1_2_code, c1_2_out, c1_2_pit, c1_2_ref))

# ==============================================================================
# SUBCHAPTER 1.3
# ==============================================================================
c1_3_desc = "Tinjauan disiplin ilmu fondasi pembentuk kecerdasan buatan: epistemologi dan logika filsafat, komputabilitas dan teori graf matematika, teori utilitas dan keputusan ekonomi, neurosains, psikologi kognitif, serta sibernetika dan teori kendali."
c1_3_md = """Kelahiran kecerdasan buatan sebagai disiplin akademik formal pada Dartmouth Workshop tahun 1956 merupakan muara dari konvergensi gagasan intelektual selama ribuan tahun. Russell & Norvig mengidentifikasi enam fondasi keilmuan primer:

1. **Filsafat (428 SM – Sekarang)**:
   - **Epistemologi**: Bagaimana pengetahuan diperoleh dan divalidasi? Dari empirisisme Francis Bacon dan John Locke hingga positivisme logis.
   - **Logika Formal**: Aristoteles merumuskan silogisme deduktif, yang kemudian diformalkan oleh George Boole (aljabar Boolean) dan Gottlob Frege (logika predikat).
   - **Pikiran vs Materi**: René Descartes mengusulkan dualisme pikiran-tubuh, sementara Thomas Hobbes dan Gottfried Leibniz mengadvokasi materialisme komputasional: *"reasoning is but reckoning"* (berpikir adalah berhitung).

2. **Matematika (± 800 M – Sekarang)**:
   - **Logika Matematika & Komputabilitas**: Kurt Gödel membuktikan Teorema Ketidaklengkapan (1931), bahwa dalam sistem formal ada proposisi benar yang tak dapat dibuktikan. Alan Turing (1936) mendefinisikan batas absolut komputasi melalui konsep Mesin Turing dan membuktikan ketidakputusan Masalah Berhenti (*Halting Problem* / *Entscheidungsproblem*).
   - **Teori Kompleksitas**: Cook (1971) dan Karp (1972) memisahkan kelas masalah $P$ dan $NP$, serta mendefinisikan reduksi $NP$-complete yang membatasi pencarian eksak pada ruang keadaan masif.
   - **Teori Probabilitas**: Gerolamo Cardano, Pierre de Fermat, Thomas Bayes (1763), dan Pierre-Simon Laplace merumuskan penalaran probabilistik terhadap informasi yang tidak pasti.

3. **Ekonomi & Teori Keputusan (1776 – Sekarang)**:
   - Bagaimana agen harus memilih tindakan jika imbalan tertunda dan tindakan berinteraksi dengan agen lain? Adam Smith mendefinisikan ekonomi perilaku rasional, sementara John von Neumann dan Oskar Morgenstern (1944) merumuskan **Teori Utilitas (Utility Theory)**.
   - John Nash (1950) memelopori **Teori Permainan (Game Theory)** untuk interaksi multi-agen bersaing dan kooperatif. Richard Bellman (1957) mengembangkan **Proses Keputusan Markov (MDP)** dan pemrograman dinamis.

4. **Neurosains & Psikologi Kognitif (1861 – Sekarang)**:
   - Studi mengenai bagaimana jaringan biologis neuron memproses sinyal listrik dan kimiawi. Camillo Golgi dan Santiago Ramón y Cajal membuktikan doktrin neuron. Warren McCulloch & Walter Pitts (1943) merumuskan model komputasi matematis pertama neuron biner tiruan.

5. **Teknik Komputer & Sibernetika (1940 – Sekarang)**:
   - Norbert Wiener (1948) merumuskan **Sibernetika** yang mengkaji mekanisme kontrol umpan balik (*feedback control*) dan regulasi stabilitas dalam sistem biologis dan mekanis."""

c1_3_code = """from dataclasses import dataclass
from typing import List

@dataclass
class DisciplineFoundation:
    discipline: str
    core_contribution: str
    key_theorems: List[str]
    impact_on_ai: str

foundations: List[DisciplineFoundation] = [
    DisciplineFoundation(
        discipline="Filsafat",
        core_contribution="Epistemologi, Logika Formal, & Materialisme Komputasi",
        key_theorems=["Silogisme Aristoteles", "Positivisme Logis", "Dualisme Kartesian"],
        impact_on_ai="Fondasi representasi pengetahuan dan inferensi deduktif formal."
    ),
    DisciplineFoundation(
        discipline="Matematika",
        core_contribution="Komputabilitas, Kompleksitas, & Teori Probabilitas",
        key_theorems=["Gödel's Incompleteness", "Turing Halting Problem", "Bayes' Theorem", "NP-Completeness"],
        impact_on_ai="Menentukan batas teoritis apa yang dapat dihitung dan penalaran ketidakpastian."
    ),
    DisciplineFoundation(
        discipline="Ekonomi",
        core_contribution="Teori Keputusan, Teori Utilitas, & Teori Permainan",
        key_theorems=["Von Neumann-Morgenstern Expected Utility", "Nash Equilibrium", "Bellman Optimality"],
        impact_on_ai="Fondasi perancangan agen rasional mandiri dan sistem multi-agen bersaing."
    ),
    DisciplineFoundation(
        discipline="Sibernetika",
        core_contribution="Sistem Kendali Umpan Balik (Feedback Control) & Homeostasis",
        key_theorems=["Wiener Feedback Control", "Optimal Control State Estimation"],
        impact_on_ai="Membentuk mekanisme adaptasi agen berbasis persepsi sensorik dinamis."
    )
]

print("DISIPLIN ILMU PONDASI PEMBENTUK ARTIFICIAL INTELLIGENCE:")
print("=" * 80)
for f in foundations:
    print(f"Disiplin   : {f.discipline}")
    print(f"Kontribusi : {f.core_contribution}")
    print(f"Teorema    : {', '.join(f.key_theorems)}")
    print(f"Dampak AI  : {f.impact_on_ai}")
    print("-" * 80)"""

c1_3_out = """DISIPLIN ILMU PONDASI PEMBENTUK ARTIFICIAL INTELLIGENCE:
================================================================================
Disiplin   : Filsafat
Kontribusi : Epistemologi, Logika Formal, & Materialisme Komputasi
Teorema    : Silogisme Aristoteles, Positivisme Logis, Dualisme Kartesian
Dampak AI  : Fondasi representasi pengetahuan dan inferensi deduktif formal.
--------------------------------------------------------------------------------
Disiplin   : Matematika
Kontribusi : Komputabilitas, Kompleksitas, & Teori Probabilitas
Teorema    : Gödel's Incompleteness, Turing Halting Problem, Bayes' Theorem, NP-Completeness
Dampak AI  : Menentukan batas teoritis apa yang dapat dihitung dan penalaran ketidakpastian.
--------------------------------------------------------------------------------
Disiplin   : Ekonomi
Kontribusi : Teori Keputusan, Teori Utilitas, & Teori Permainan
Teorema    : Von Neumann-Morgenstern Expected Utility, Nash Equilibrium, Bellman Optimality
Dampak AI  : Fondasi perancangan agen rasional mandiri dan sistem multi-agen bersaing.
--------------------------------------------------------------------------------
Disiplin   : Sibernetika
Kontribusi : Sistem Kendali Umpan Balik (Feedback Control) & Homeostasis
Teorema    : Wiener Feedback Control, Optimal Control State Estimation
Dampak AI  : Membentuk mekanisme adaptasi agen berbasis persepsi sensorik dinamis.
--------------------------------------------------------------------------------"""

c1_3_pit = "Mengabaikan batasan Teori Kompleksitas (NP-Completeness) dalam merancang sistem AI simbolik. Mengetahui bahwa suatu masalah dapat diselesaikan secara logis (*computable*) tidak menjamin masalah tersebut dapat diselesaikan secara praktis (*tractable*) dalam batas waktu yang wajar tanpa bantuan heuristik."
c1_3_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 1.2: The Foundations of Artificial Intelligence", "url": "https://aima.cs.berkeley.edu/"},
    {"title": "von Neumann & Morgenstern (1944) Theory of Games and Economic Behavior, Princeton University Press", "url": "https://press.princeton.edu/books/paperback/9780691130613/theory-of-games-and-economic-behavior"}
]
subchapters.append(create_subchapter("1.3", "Fondasi Disiplin Ilmu Pembentuk AI: Filsafat, Matematika, Ekonomi, Neurosains, & Sibernetika", c1_3_desc, c1_3_md, c1_3_code, c1_3_out, c1_3_pit, c1_3_ref))

# ==============================================================================
# SUBCHAPTER 1.4
# ==============================================================================
c1_4_desc = "Formulasi matematis konsep agen rasional: pemetaan riwayat persepsi ke tindakan f: P* -> A, perbedaan mendasar antara program agen dan fungsi agen, serta pemisahan tegas rasionalitas vs omniscience."
c1_4_md = """Dalam kerangka kerja AI modern (AIMA Bab 2), **Agen** didefinisikan secara formal sebagai entitas apa pun yang mempersepsikan lingkungannya melalui **Sensor** dan bertindak atas lingkungan tersebut melalui **Aktuator**.

Dua konsep matematika sentral yang mengatur perilaku agen:
1. **Persepsi (Percept)**: Masukan sensorik agen pada satu momen waktu tertentu. Riwayat lengkap seluruh persepsi yang pernah diterima agen sejak awal kehidupannya disebut **Percept Sequence** $P^* = (p_1, p_2, \dots, p_t)$.
2. **Fungsi Agen (Agent Function)**: Sebuah abstraksi matematis murni yang memetakan setiap rangkaian riwayat persepsi yang mungkin ke tindakan yang tepat:
$$f: P^* \to A$$
di mana $P^*$ adalah himpunan seluruh sekuens persepsi yang mungkin dan $A$ adalah himpunan tindakan yang tersedia.
3. **Program Agen (Agent Program)**: Implementasi komputasi konkret dari fungsi agen $f$ yang dieksekusi di atas arsitektur fisik perangkat keras (*Hardware + OS*):
$$\\text{Agen} = \\text{Arsitektur} + \\text{Program}$$

Perbedaan krusial terletak pada parameter masukan: fungsi agen secara matematis bergantung pada seluruh riwayat $P^*$, sedangkan program agen praktis hanya menerima persepsi terkini $p_t$ sebagai input karena keterbatasan memori fisik, lalu memperbarui status internalnya sendiri.

**Definisi Rasionalitas Formal**:
Suatu agen dikatakan **Rasional** jika untuk setiap sekuens persepsi yang mungkin diterima, agen memilih tindakan yang diharapkan memaksimalkan **Ukuran Kinerja (Performance Measure)**, berdasarkan bukti yang diberikan oleh rangkaian persepsi dan pengetahuan bawaan yang dimiliki agen.

Rasionalitas **TIDAK SAMA** dengan:
- **Kemahatahuan (Omniscience)**: Agen mahatahu mengetahui luaran aktual dari tindakannya di masa depan sebelum tindakan dieksekusi. Rasionalitas hanya menuntut agen memaksimalkan kinerja yang *diharapkan* (*expected performance*), bukan hasil aktual (*actual performance*). Contoh: menyeberang jalan saat lampu hijau dan jalan kosong adalah rasional, meskipun tiba-tiba tertabrak pesawat jatuh.
- **Keberhasilan Sempurna (Clairvoyance/Perfection)**: Rasionalitas mengharuskan agen mengumpulkan informasi (*information gathering*) dan eksplorasi aktif, bukan menebak secara membabi buta.
- **Otonomi Penuh dari Awal**: Agen rasional sejati harus bersifat **Otonom (Autonomous)**, yaitu mampu belajar dan beradaptasi menutupi keterbatasan pengetahuan bawaan awal perancangnya (*initial prior knowledge*)."""

c1_4_code = """from typing import List, Tuple

class SimpleReflexVacuumAgent:
    def __init__(self):
        # Tabel aturan fungsi agen f: P* -> A
        # Lokasi: 'A' atau 'B' | Status: 'Clean' atau 'Dirty'
        self.percept_history: List[Tuple[str, str]] = []

    def agent_function(self, current_percept: Tuple[str, str]) -> str:
        # Rekam ke dalam riwayat persepsi P*
        self.percept_history.append(current_percept)
        location, status = current_percept

        # Aturan penalaran agen rasional
        if status == "Dirty":
            return "Suck"
        elif location == "A":
            return "Right"
        elif location == "B":
            return "Left"
        return "NoOp"

# Simulasi Uji Fungsi Agen
agent = SimpleReflexVacuumAgent()
test_percept_stream = [("A", "Dirty"), ("A", "Clean"), ("B", "Dirty"), ("B", "Clean")]

print("DEMONSTRASI FUNGSI AGEN f: P* -> A (VACUUM WORLD):")
print("-" * 65)
for step, percept in enumerate(test_percept_stream, 1):
    action = agent.agent_function(percept)
    print(f"Langkah {step} | Persepsi: {percept} -> Tindakan Rasional: '{action}'")

print("-" * 65)
print(f"Total Riwayat Persepsi P* Tersimpan: {len(agent.percept_history)} item")
print("Rasionalitas: Agen memaksimalkan kebersihan lingkungan berdasarkan percept!")"""

c1_4_out = """DEMONSTRASI FUNGSI AGEN f: P* -> A (VACUUM WORLD):
-----------------------------------------------------------------
Langkah 1 | Persepsi: ('A', 'Dirty') -> Tindakan Rasional: 'Suck'
Langkah 2 | Persepsi: ('A', 'Clean') -> Tindakan Rasional: 'Right'
Langkah 3 | Persepsi: ('B', 'Dirty') -> Tindakan Rasional: 'Suck'
Langkah 4 | Persepsi: ('B', 'Clean') -> Tindakan Rasional: 'Left'
-----------------------------------------------------------------
Total Riwayat Persepsi P* Tersimpan: 4 item
Rasionalitas: Agen memaksimalkan kebersihan lingkungan berdasarkan percept!"""

c1_4_pit = "Menilai kerasionalan tindakan berdasarkan luaran nyata pasca-tindakan (*outcome-based evaluation*) daripada ekspektasi saat keputusan diambil. Jika seorang dokter memberikan obat standar terbaik tetapi pasien meninggal karena alergi genetik yang belum pernah terdeteksi sains, tindakan dokter tersebut tetap rasional secara medis."
c1_4_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 2.1: Agents and Environments & Section 2.2: Good Behavior: The Concept of Rationality", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("1.4", "Konsep Agen Rasional: Fungsi Agen f: P* -> A, Program Agen, & Rasionalitas vs Omniscience", c1_4_desc, c1_4_md, c1_4_code, c1_4_out, c1_4_pit, c1_4_ref))

# ==============================================================================
# SUBCHAPTER 1.5
# ==============================================================================
c1_5_desc = "Spesifikasi lingkungan tugas komprehensif menggunakan kerangka kerja PEAS: Performance Measure, Environment, Actuators, dan Sensors dengan studi kasus taksi otonom, sistem diagnosis medis, dan robot sortir satelit."
c1_5_md = """Sebelum seorang perekayasa sistem cerdas dapat menulis satu baris kode program agen, ia wajib merumuskan spesifikasi formal lingkungan tugasnya secara terperinci. Russell & Norvig merumuskan singkatan mnemonik **PEAS**:
- **P — Performance Measure (Ukuran Kinerja)**: Kriteria objektif eksternal yang menentukan tingkat keberhasilan perilaku agen di dunia nyata.
- **E — Environment (Lingkungan Tugas)**: Entitas dunia luar di mana agen beroperasi, menerima persepsi, dan memanipulasi keadaan.
- **A — Actuators (Aktuator)**: Perangkat fisik atau antarmuka perangkat lunak yang digunakan agen untuk mengeksekusi tindakan (*actions*).
- **S — Sensors (Sensor)**: Perangkat penangkap data yang memungkinkan agen menerima informasi masukan lingkungan (*percepts*).

**Prinsip Desain Ukuran Kinerja**:
Ukuran kinerja harus dirancang berdasarkan **kondisi objektif yang benar-benar diinginkan di lingkungan**, bukan berdasarkan perilaku agen itu sendiri. Contoh: pada robot penyedot debu, jika ukuran kinerja diukur dari 'jumlah debu yang disedot', maka agen yang 'rasional tetapi licik' akan menumpahkan kembali debu yang sudah disedot ke lantai lalu menyedotnya kembali demi memaksimalkan skor. Ukuran kinerja yang benar adalah 'kebersihan lantai sepanjang waktu'.

**Studi Kasus Formal PEAS**:
1. **Sistem Taksi Otonom (Autonomous Taxi Driver)**:
   - *Performance Measure*: Keselamatan penumpang (0 kecelakaan), kecepatan mencapai tujuan (minimal durasi), kepatuhan hukum lalu lintas (0 tilang), kenyamanan penumpang (akselerasi halus), dan maksimisasi keuntungan (efisiensi bahan bakar).
   - *Environment*: Jalan raya perkotaan, jalan tol, cuaca buruk/hujan, pejalan kaki, kendaraan lain yang tidak terduga, dan rambu lalu lintas.
   - *Actuators*: Sistem kemudi setir (steering angle), pedal gas (throttle), pedal rem (brake), tuas transmisi gigi, lampu sein, klakson, dan display navigasi.
   - *Sensors*: Kamera RGB video multi-arah, LiDAR 3D, sensor RADAR, penerima GPS, unit inersia (IMU), sonar ultrasonik jarak dekat, dan sensor speedometer mesin."""

c1_5_code = """from dataclasses import dataclass
from typing import List

@dataclass
class PEASSpecification:
    agent_domain: str
    performance_measure: List[str]
    environment: List[str]
    actuators: List[str]
    sensors: List[str]

# Deklarasi Spesifikasi PEAS Sistem Taksi Otonom & Diagnosis Medis
taxi_peas = PEASSpecification(
    agent_domain="Sistem Pengemudi Taksi Otonom (Autonomous Driving)",
    performance_measure=[
        "Keselamatan maksimal (0 tabrakan)",
        "Efisiensi waktu tempuh & bahan bakar",
        "Kepatuhan regulasi lalu lintas",
        "Kenyamanan dinamika perjalanan penumpang"
    ],
    environment=[
        "Jaringan jalan raya perkotaan & jalan tol",
        "Lalu lintas dinamis (kendaraan lain, pejalan kaki, pesepeda)",
        "Kondisi cuaca fluktuatif & kondisi permukaan jalan"
    ],
    actuators=[
        "Kendali sudut kemudi (Steering)",
        "Aktuasi akselerasi (Throttle) & pengereman (Braking)",
        "Sinyal lampu sein, klakson, & dasbor interaksi"
    ],
    sensors=[
        "Kamera visual stereoskopik",
        "Sensor 3D LiDAR & RADAR jarak jauh",
        "Penerima sinyal satelit GPS & IMU (odometri inersial)"
    ]
)

print(f"SPESIFIKASI FORMAL PEAS: {taxi_peas.agent_domain.upper()}")
print("=" * 75)
print("1. Performance Measure (Ukuran Kinerja):")
for p in taxi_peas.performance_measure:
    print(f"   [+] {p}")
print("2. Environment (Lingkungan):")
for e in taxi_peas.environment:
    print(f"   [+] {e}")
print("3. Actuators (Aktuator):")
for a in taxi_peas.actuators:
    print(f"   [+] {a}")
print("4. Sensors (Sensor):")
for s in taxi_peas.sensors:
    print(f"   [+] {s}")
print("=" * 75)"""

c1_5_out = """SPESIFIKASI FORMAL PEAS: SISTEM PENGEMUDI TAKSI OTONOM (AUTONOMOUS DRIVING)
===========================================================================
1. Performance Measure (Ukuran Kinerja):
   [+] Keselamatan maksimal (0 tabrakan)
   [+] Efisiensi waktu tempuh & bahan bakar
   [+] Kepatuhan regulasi lalu lintas
   [+] Kenyamanan dinamika perjalanan penumpang
2. Environment (Lingkungan):
   [+] Jaringan jalan raya perkotaan & jalan tol
   [+] Lalu lintas dinamis (kendaraan lain, pejalan kaki, pesepeda)
   [+] Kondisi cuaca fluktuatif & kondisi permukaan jalan
3. Actuators (Aktuator):
   [+] Kendali sudut kemudi (Steering)
   [+] Aktuasi akselerasi (Throttle) & pengereman (Braking)
   [+] Sinyal lampu sein, klakson, & dasbor interaksi
4. Sensors (Sensor):
   [+] Kamera visual stereoskopik
   [+] Sensor 3D LiDAR & RADAR jarak jauh
   [+] Penerima sinyal satelit GPS & IMU (odometri inersial)
==========================================================================="""

c1_5_pit = "Memasukkan indikator proses perilaku internal ke dalam ukuran kinerja (*Performance Measure*). Misalnya, mengganjar agen vacuum cleaner berdasarkan 'jumlah langkah menyedot' akan mendorong agen menyedot di tempat yang sudah bersih. Performance measure harus selalu mengukur dampak akhir pada status lingkungan (*environmental state*)."
c1_5_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 2.3: The Nature of Environments", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("1.5", "Karakterisasi Lingkungan Tugas PEAS (Performance Measure, Environment, Actuators, Sensors)", c1_5_desc, c1_5_md, c1_5_code, c1_5_out, c1_5_pit, c1_5_ref))

# ==============================================================================
# SUBCHAPTER 1.6
# ==============================================================================
c1_6_desc = "Taksonomi enam dimensi sifat lingkungan tugas: Fully vs Partially Observable, Deterministic vs Stochastic, Episodic vs Sequential, Static vs Dynamic, Discrete vs Continuous, serta Single vs Multi-Agent."
c1_6_md = """Tingkat kompleksitas perancangan program agen dan pemilihan algoritma AI secara mutlak ditentukan oleh sifat dari lingkungan tugasnya. Russell & Norvig mengklasifikasikan lingkungan ke dalam enam dimensi ortogonal utama:

1. **Fully Observable vs Partially Observable**:
   - *Fully Observable*: Sensor agen mampu mendeteksi seluruh aspek keadaan lingkungan yang relevan dengan pemilihan tindakan pada setiap titik waktu (contoh: Catur, Tic-Tac-Toe).
   - *Partially Observable*: Lingkungan tidak dapat teramati penuh karena adanya derau sensor (*noise*), keterbatasan jangkauan sensor, atau bagian tersembunyi (contoh: Poker, Taksi Otonom). Jika agen sama sekali tidak memiliki sensor, lingkungan disebut *unobservable*.

2. **Deterministic vs Stochastic**:
   - *Deterministic*: Keadaan lingkungan selanjutnya secara pasti ditentukan oleh keadaan saat ini dan tindakan yang dieksekusi oleh agen.
   - *Stochastic*: Ada ketidakpastian (*uncertainty*) di mana tindakan yang sama dapat menghasilkan luaran yang berbeda secara probabilistik. Jika lingkungan stokastik tidak mencantumkan probabilitas secara eksplisit, disebut *non-deterministic*.

3. **Episodic vs Sequential**:
   - *Episodic*: Pengalaman agen dibagi menjadi episode-episode independen. Kualitas tindakan dalam satu episode tidak mempengaruhi episode berikutnya (contoh: Klasifikasi citra kecacatan produk di pabrik).
   - *Sequential*: Keputusan saat ini mempengaruhi seluruh konsekuensi keputusan masa depan (contoh: Catur, Navigasi robot maze).

4. **Static vs Dynamic**:
   - *Static*: Lingkungan tidak mengalami perubahan saat agen sedang 'berpikir' menentukan tindakan (contoh: Teka-teki silang, Catur tanpa batas waktu jam).
   - *Dynamic*: Lingkungan terus bermutasi seiring berjalannya waktu komputasi agen (contoh: Mengemudi mobil di jalan raya). Jika lingkungan tidak berubah tetapi skor kinerja agen menurun seiring waktu, disebut *semidynamic*.

5. **Discrete vs Continuous**:
   - *Discrete*: Status lingkungan, persepsi waktu, dan himpunan tindakan memiliki jumlah nilai yang terhitung dan terpisah secara tegas (contoh: Catur memiliki 64 petak diskret).
   - *Continuous*: Status atau tindakan berupa kuantitas kontinu bilangan riil (contoh: Kecepatan taksi, sudut kemudi setir dalam derajat floating-point).

6. **Single-Agent vs Multi-Agent**:
   - *Single-Agent*: Agen beroperasi sendirian tanpa interaksi dengan agen cerdas lain (contoh: Teka-teki Sudoku).
   - *Multi-Agent*: Kehadiran agen lain yang tindakannya mempengaruhi utilitas agen kita, baik bersifat kompetitif (*zero-sum*, misal Catur) maupun kooperatif (*shared-utility*, misal konvoi kendaraan terkoordinasi).

Lingkungan yang paling menantang bagi perekayasa AI adalah lingkungan yang bersifat: **Partially Observable, Stochastic, Sequential, Dynamic, Continuous, dan Multi-Agent** (seperti dunia nyata pada mobil otonom dan pasar keuangan global)."""

c1_6_code = """from dataclasses import dataclass
from typing import Dict

@dataclass
class EnvironmentProfile:
    domain_name: str
    observability: str
    determinism: str
    episodicity: str
    dynamism: str
    continuity: str
    agent_count: str

    def print_summary(self):
        print(f"Profil Domain: {self.domain_name}")
        print(f" - Keteramatan : {self.observability}")
        print(f" - Determinisme: {self.determinism}")
        print(f" - Temporalitas: {self.episodicity}")
        print(f" - Dinamika    : {self.dynamism}")
        print(f" - Kontinuitas : {self.continuity}")
        print(f" - Agen        : {self.agent_count}")
        print("-" * 55)

chess = EnvironmentProfile(
    domain_name="Permainan Catur Klasik (dengan jam)",
    observability="Fully Observable",
    determinism="Deterministic",
    episodicity="Sequential",
    dynamism="Semidynamic (skor waktu berjalan)",
    continuity="Discrete",
    agent_count="Multi-Agent (Kompetitif)"
)

taxi = EnvironmentProfile(
    domain_name="Navigasi Taksi Otonom Perkotaan",
    observability="Partially Observable",
    determinism="Stochastic",
    episodicity="Sequential",
    dynamism="Dynamic",
    continuity="Continuous",
    agent_count="Multi-Agent (Campuran)"
)

print("KOMPARASI TAKSONOMI DIMENSI LINGKUNGAN TUGAS (AIMA BAB 2):")
print("=" * 55)
chess.print_summary()
taxi.print_summary()"""

c1_6_out = """KOMPARASI TAKSONOMI DIMENSI LINGKUNGAN TUGAS (AIMA BAB 2):
=======================================================
Profil Domain: Permainan Catur Klasik (dengan jam)
 - Keteramatan : Fully Observable
 - Determinisme: Deterministic
 - Temporalitas: Sequential
 - Dinamika    : Semidynamic (skor waktu berjalan)
 - Kontinuitas : Discrete
 - Agen        : Multi-Agent (Kompetitif)
-------------------------------------------------------
Profil Domain: Navigasi Taksi Otonom Perkotaan
 - Keteramatan : Partially Observable
 - Determinisme: Stochastic
 - Temporalitas: Sequential
 - Dinamika    : Dynamic
 - Kontinuitas : Continuous
 - Agen        : Multi-Agent (Campuran)
-------------------------------------------------------"""

c1_6_pit = "Memperlakukan lingkungan partially observable sebagai fully observable. Jika sensor tidak mampu melihat rintangan di balik tikungan buta (*blind spot*), agen yang berasumsi lingkungannya fully observable akan gagal melakukan tindakan protektif (*information gathering*) dan rentan mengalami tabrakan fatal."
c1_6_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 2.3: The Nature of Environments", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("1.6", "Taksonomi Sifat Lingkungan: Fully vs Partially Observable, Deterministic vs Stochastic, Episodic vs Sequential, dsb.", c1_6_desc, c1_6_md, c1_6_code, c1_6_out, c1_6_pit, c1_6_ref))

# ==============================================================================
# SUBCHAPTER 1.7
# ==============================================================================
c1_7_desc = "Arsitektur agen bagian 1: perancangan Simple Reflex Agents berbasis aturan Condition-Action dan Model-Based Reflex Agents dengan representasi internal state untuk menangani lingkungan Partially Observable."
c1_7_md = """Dalam mengimplementasikan program agen, Russell & Norvig menyusun hierarki empat arsitektur agen dasar. Dua arsitektur awal adalah **Simple Reflex Agent** dan **Model-Based Reflex Agent**:

1. **Simple Reflex Agent (Agen Refleks Sederhana)**:
   Arsitektur agen paling elementer yang memilih tindakan **hanya berdasarkan persepsi saat ini ($p_t$)**, mengabaikan seluruh riwayat persepsi masa lalu. Logika penalaran agen dibangun menggunakan aturan **Condition-Action Rules** (aturan kondisi-tindakan):
   $$\\text{if } [\\text{kondisi}] \\text{ then } [\\text{tindakan}]$$
   - *Kelemahan Fundamental*: Agen refleks sederhana hanya dapat berfungsi optimal jika lingkungan bersifat **Fully Observable**. Jika lingkungan bersifat *Partially Observable*, agen dapat terjebak dalam **Infinite Loop** (siklus tanpa akhir). Contoh: jika robot vacuum cleaner berada di ruangan gelap tanpa sensor posisi, ia tidak dapat membedakan apakah ia berada di ruangan A atau B, sehingga berulang kali bolak-balik tanpa henti.
   - *Mitigasi Parsial*: Mengintroduksi tindakan acak (*randomized action*) dapat membantu agen keluar dari infinite loop, meskipun tidak menjamin keoptimalan.

2. **Model-Based Reflex Agent (Agen Refleks Berbasis Model)**:
   Solusi rekayasa untuk mengatasi lingkungan yang *Partially Observable* adalah dengan membekali agen **Keadaan Internal (Internal State)**. Keadaan internal menyimpan jejak aspek dunia yang saat ini tidak terlihat oleh sensor.
   Untuk memperbarui keadaan internalnya dari waktu ke waktu, agen membutuhkan dua jenis pengetahuan model dunia:
   - **Model Transisi (Transition Model)**: Pengetahuan tentang bagaimana keadaan dunia berubah secara independen dan bagaimana tindakan agen mengubah dunia:
   $$\\text{State}_{t} = \\text{Update}(\\text{State}_{t-1}, \\text{Action}_{t-1}, \\text{Percept}_t)$$
   - **Model Sensor (Sensor Model)**: Pengetahuan tentang bagaimana keadaan fisik dunia nyata tercermin ke dalam sinyal sensor agen.

Dengan mengombinasikan persepsi saat ini dengan keadaan internal yang terakumulasi, Model-Based Agent dapat mempertahankan representasi lingkungan yang akurat meskipun sensor mengalami gangguan sesaat atau terhalang rintangan."""

c1_7_code = """from typing import Optional

class ModelBasedReflexVacuumAgent:
    def __init__(self):
        # State internal yang melacak kebersihan seluruh ruangan
        self.world_state = {"A": "Unknown", "B": "Unknown"}
        self.current_location = "A"

    def update_internal_state(self, current_percept: tuple):
        loc, status = current_percept
        self.current_location = loc
        self.world_state[loc] = status

    def select_action(self, current_percept: tuple) -> str:
        self.update_internal_state(current_percept)
        
        # Aturan kondisi-tindakan berbasis internal state lengkap
        if self.world_state[self.current_location] == "Dirty":
            return "Suck"
        elif self.world_state["A"] == "Clean" and self.world_state["B"] == "Clean":
            return "NoOp" # Kedua ruangan sudah bersih sempurna!
        elif self.current_location == "A":
            return "Right"
        elif self.current_location == "B":
            return "Left"
        return "NoOp"

agent = ModelBasedReflexVacuumAgent()
percepts = [("A", "Dirty"), ("A", "Clean"), ("B", "Dirty"), ("B", "Clean")]

print("SIMULASI MODEL-BASED REFLEX AGENT:")
print("-" * 60)
for p in percepts:
    action = agent.select_action(p)
    print(f"Persepsi: {p} -> Internal State: {agent.world_state} -> Tindakan: '{action}'")

print("-" * 60)
print("Keberhasilan: Agen mengetahui kedua ruangan telah bersih dan beralih ke NoOp!")"""

c1_7_out = """SIMULASI MODEL-BASED REFLEX AGENT:
------------------------------------------------------------
Persepsi: ('A', 'Dirty') -> Internal State: {'A': 'Dirty', 'B': 'Unknown'} -> Tindakan: 'Suck'
Persepsi: ('A', 'Clean') -> Internal State: {'A': 'Clean', 'B': 'Unknown'} -> Tindakan: 'Right'
Persepsi: ('B', 'Dirty') -> Internal State: {'A': 'Clean', 'B': 'Dirty'} -> Tindakan: 'Suck'
Persepsi: ('B', 'Clean') -> Internal State: {'A': 'Clean', 'B': 'Clean'} -> Tindakan: 'NoOp'
------------------------------------------------------------
Keberhasilan: Agen mengetahui kedua ruangan telah bersih dan beralih ke NoOp!"""

c1_7_pit = "Menerapkan simple reflex agent pada lingkungan yang memiliki ambiguitas perseptual (*perceptual aliasing*). Dua keadaan lingkungan yang memerlukan tindakan bertolak belakang namun menghasilkan persepsi sensorik yang identik akan menyebabkan agen refleks sederhana gagal total."
c1_7_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 2.4: The Structure of Agents", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("1.7", "Arsitektur Agen Bagian 1: Simple Reflex Agents & Model-Based Reflex Agents", c1_7_desc, c1_7_md, c1_7_code, c1_7_out, c1_7_pit, c1_7_ref))

# ==============================================================================
# SUBCHAPTER 1.8
# ==============================================================================
c1_8_desc = "Arsitektur agen bagian 2: Goal-Based Agents dengan kemampuan perencanaan/pencarian masa depan dan Utility-Based Agents dengan fungsi utilitas kontinu U(s) untuk kompromi trade-off tujuan bersaing."
c1_8_md = """Dua arsitektur tingkat lanjut dalam taksonomi Russell & Norvig yang memiliki fleksibilitas penalaran tinggi adalah **Goal-Based Agent** dan **Utility-Based Agent**:

1. **Goal-Based Agent (Agen Berbasis Tujuan)**:
   Mengetahui status lingkungan saat ini tidak selalu cukup untuk memutuskan tindakan terbaik. Agen sering kali membutuhkan deskripsi eksplisit mengenai situasi yang diinginkan, yaitu **Tujuan (Goal)**.
   - Menggabungkan informasi keadaan internal dengan informasi tujuan untuk memilih tindakan yang membawa agen mendekati tujuannya.
   - Melibatkan mekanisme **Pencarian (Search)** dan **Perencanaan (Planning)** (misalnya A* search pada Bab 4).
   - *Keunggulan*: Sangat fleksibel. Jika tujuan berubah (misal dari mengemudi ke bandara menjadi ke rumah sakit), agen hanya perlu memperbarui parameter tujuan, dan algoritma pencarian akan merumuskan lintasan tindakan baru tanpa perlu merombak ribuan aturan kondisi-tindakan.

2. **Utility-Based Agent (Agen Berbasis Utilitas)**:
   Tujuan (*goals*) hanya memberikan dikotomi biner kasar antara status 'berhasil' atau 'gagal'. Dalam skenario dunia nyata yang kompleks, terdapat banyak alternatif lintasan menuju tujuan dengan kualitas yang berbeda:
   - Beberapa rute lebih cepat, lebih aman, lebih murah, atau lebih nyaman daripada yang lain.
   - Ketika ada beberapa tujuan yang saling bersaing (*conflicting goals*, misal kecepatan vs keselamatan), agen membutuhkan fungsi pemeringkat skalar kontinu.

Sebuah **Fungsi Utilitas (Utility Function)**:
$$U: S \to \\mathbb{R}$$
memetakan sebuah keadaan lingkungan $s \in S$ ke suatu bilangan riil yang merefleksikan tingkat kepuasan (*degree of happiness / preference*) agen. Dalam kondisi lingkungan stokastik dan tidak pasti, agen rasional berbasis utilitas memilih tindakan $a^*$ yang memaksimalkan **Expected Utility (Utilitas Ekspektasian)**:
$$a^* = \\arg\\max_a \\sum_{s'} P(s' \\mid s, a) U(s')$$
Prinsip maksimisasi utilitas ekspektasian (MEU) ini merupakan sintesis puncak teori keputusan ekonomi dan komputasi agen cerdas modern."""

c1_8_code = """from typing import Dict, List

class UtilityBasedRoutingAgent:
    def __init__(self, routes_data: Dict[str, Dict[str, float]]):
        self.routes = routes_data

    def compute_utility(self, time_min: float, safety_rate: float, cost_usd: float) -> float:
        # Fungsi Utilitas U(s): Pembobotan Multi-Objektif
        # Bobot: Keselamatan (positif tinggi), Waktu (penalti), Biaya (penalti)
        utility = (safety_rate * 100.0) - (time_min * 1.5) - (cost_usd * 2.0)
        return utility

    def select_best_route(self) -> str:
        best_route = ""
        max_utility = float("-inf")
        
        for name, metrics in self.routes.items():
            u = self.compute_utility(metrics["time"], metrics["safety"], metrics["cost"])
            print(f"Rute: {name:<12} | Waktu: {metrics['time']:>4}m | Keamanan: {metrics['safety']:>4} | Biaya: ${metrics['cost']:>4} | Utilitas U(s): {u:>6.2f}")
            if u > max_utility:
                max_utility = u
                best_route = name
        return best_route

routes = {
    "Rute Tol": {"time": 25.0, "safety": 0.98, "cost": 15.0},
    "Jalan Arteri": {"time": 45.0, "safety": 0.85, "cost": 2.0},
    "Jalur Cepat": {"time": 20.0, "safety": 0.70, "cost": 5.0}
}

agent = UtilityBasedRoutingAgent(routes)
print("EVALUASI FUNGSI UTILITAS MULTI-OBJEKTIF AGEN BERBASIS UTILITAS:")
print("-" * 80)
chosen = agent.select_best_route()
print("-" * 80)
print(f"Keputusan Rasional Optimal: Pilih '{chosen}' dengan Utilitas Tertinggi!")"""

c1_8_out = """EVALUASI FUNGSI UTILITAS MULTI-OBJEKTIF AGEN BERBASIS UTILITAS:
--------------------------------------------------------------------------------
Rute: Rute Tol     | Waktu: 25.0m | Keamanan: 0.98 | Biaya: $15.0 | Utilitas U(s):  30.50
Rute: Jalan Arteri | Waktu: 45.0m | Keamanan: 0.85 | Biaya: $ 2.0 | Utilitas U(s):  13.50
Rute: Jalur Cepat  | Waktu: 20.0m | Keamanan: 0.70 | Biaya: $ 5.0 | Utilitas U(s):  30.00
--------------------------------------------------------------------------------
Keputusan Rasional Optimal: Pilih 'Rute Tol' dengan Utilitas Tertinggi!"""

c1_8_pit = "Merancang fungsi utilitas tunggal yang hanya mengejar satu metrik ekstrem (misal meminimalkan waktu tempuh hingga 0) tanpa memperhitungkan kendala penalti keselamatan. Hal ini dapat memicu perilaku patologis di mana kendaraan melaju dengan kecepatan mematikan demi memaksimalkan fungsi utilitas yang cacat perumusan."
c1_8_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 2.4: The Structure of Agents (Goal-based & Utility-based)", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("1.8", "Arsitektur Agen Bagian 2: Goal-Based Agents & Utility-Based Agents", c1_8_desc, c1_8_md, c1_8_code, c1_8_out, c1_8_pit, c1_8_ref))

# ==============================================================================
# SUBCHAPTER 1.9
# ==============================================================================
c1_9_desc = "Arsitektur agen pembelajar (Learning Agents): pemisahan empat elemen konseptual (Learning Element, Performance Element, Critic, & Problem Generator) untuk eksplorasi dan perbaikan mandiri."
c1_9_md = """Turing (1950) mengemukakan argumen visioner bahwa alih-alih memprogram kecerdasan tingkat dewasa secara manual dari nol, pendekatan yang jauh lebih menjanjikan adalah membangun agen pembelajar (*learning agent*) yang menyerupai pikiran anak-anak (*child-machine*) lalu mendidiknya melalui pengalaman.

Russell & Norvig memformalkan struktur **Learning Agent** ke dalam empat modul fungsional yang terisolasi secara elegan:
1. **Elemen Kinerja (Performance Element)**:
   Modul operasional agen yang bertanggung jawab menerima persepsi sensorik dan memutuskan tindakan eksternal. Elemen kinerja dapat berupa agen refleks, berbasis model, berbasis tujuan, atau berbasis utilitas.
2. **Kritikus (Critic)**:
   Modul evaluasi objektif yang mengobservasi lingkungan dan perilaku agen. Kritikus membandingkan hasil persepsi terhadap **Ukuran Kinerja Eksternal (External Performance Standard)** yang tidak dapat dimanipulasi oleh agen, lalu mengirimkan umpan balik evaluatif (*feedback signal*, seperti skor keberhasilan atau penalti kesalahan) ke elemen pembelajar.
3. **Elemen Pembelajar (Learning Element)**:
   Modul adaptif yang bertanggung jawab melakukan perbaikan struktural terhadap elemen kinerja. Modul ini menganalisis umpan balik dari kritikus dan mencari cara agar elemen kinerja membuat keputusan yang lebih baik di masa depan.
4. **Pembangkit Masalah (Problem Generator)**:
   Komponen yang menyarankan tindakan-tindakan baru yang bersifat eksploratif (*novel exploration*), alih-alih tindakan yang paling aman saat ini. Tujuannya adalah mendorong agen bereksperimen mengumpulkan informasi baru (*exploration vs exploitation trade-off*). Tanpa problem generator, agen akan terjebak dalam kebiasaan lokal yang suboptimal."""

c1_9_code = """class MinimalLearningAgent:
    def __init__(self, initial_threshold: float = 0.5):
        # Elemen Kinerja: parameter klasifikasi batas risiko
        self.risk_threshold = initial_threshold
        # Elemen Pembelajar: laju pembaruan adaptif
        self.learning_rate = 0.1

    def performance_element(self, risk_score: float) -> str:
        # Menentukan keputusan operasional
        return "Tolak" if risk_score > self.risk_threshold else "Terima"

    def critic(self, action: str, actual_outcome_was_fraud: bool) -> float:
        # Evaluasi eksternal independen
        if action == "Terima" and actual_outcome_was_fraud:
            return -1.0 # Penalti besar: meloloskan penipuan!
        elif action == "Tolak" and not actual_outcome_was_fraud:
            return -0.2 # Penalti ringan: menolak nasabah baik
        return 1.0 # Keputusan tepat

    def learning_element(self, feedback: float, risk_score: float):
        # Perbarui parameter elemen kinerja berdasarkan umpan balik kritikus
        if feedback < 0:
            # Jika salah meloloskan fraud, turunkan threshold agar lebih waspada
            self.risk_threshold -= self.learning_rate * abs(feedback)
            self.risk_threshold = max(0.1, round(self.risk_threshold, 3))

agent = MinimalLearningAgent(initial_threshold=0.7)
transactions = [(0.65, True), (0.55, True), (0.45, False)]

print("SIKLUS ADAPTASI MODUL LEARNING AGENT (AIMA BAB 2):")
print("-" * 65)
for step, (score, is_fraud) in enumerate(transactions, 1):
    action = agent.performance_element(score)
    feedback = agent.critic(action, is_fraud)
    old_th = agent.risk_threshold
    agent.learning_element(feedback, score)
    print(f"Step {step} | Skor: {score} | Aksi: {action:<6} | Feedback: {feedback:>4} | Ambang: {old_th:.2f} -> {agent.risk_threshold:.2f}")

print("-" * 65)
print("Hasil: Ambang batas berhasil beradaptasi lebih konservatif via umpan balik critic!")"""

c1_9_out = """SIKLUS ADAPTASI MODUL LEARNING AGENT (AIMA BAB 2):
-----------------------------------------------------------------
Step 1 | Skor: 0.65 | Aksi: Terima | Feedback: -1.0 | Ambang: 0.70 -> 0.60
Step 2 | Skor: 0.55 | Aksi: Terima | Feedback: -1.0 | Ambang: 0.60 -> 0.50
Step 3 | Skor: 0.45 | Aksi: Terima | Feedback:  1.0 | Ambang: 0.50 -> 0.50
-----------------------------------------------------------------
Hasil: Ambang batas berhasil beradaptasi lebih konservatif via umpan balik critic!"""

c1_9_pit = "Membiarkan agen menetapkan ukuran kinerjanya sendiri pada modul kritikus (*internalizing the performance measure*). Jika agen dapat mengubah standar evaluasi kritikus, ia dapat memanipulasi ukuran kinerja menjadi nol usaha (misal agen pembersih mendefinisikan 'lantai kotor sebagai standar keindahan baru') alih-alih belajar membersihkan lingkungan secara nyata."
c1_9_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 2.4.5: Learning Agents", "url": "https://aima.cs.berkeley.edu/"},
    {"title": "Alan M. Turing (1950) Computing Machinery and Intelligence, Mind", "url": "https://doi.org/10.1093/mind/LIX.236.433"}
]
subchapters.append(create_subchapter("1.9", "Learning Agents: Elemen Pembelajar, Elemen Kinerja, Kritikus, & Pembangkit Masalah", c1_9_desc, c1_9_md, c1_9_code, c1_9_out, c1_9_pit, c1_9_ref))

# ==============================================================================
# SUBCHAPTER 1.10
# ==============================================================================
c1_10_desc = "Praktikum komprehensif implementasi simulator GridWorld 2D modular di Python murni: pengujian performa kuantitatif Simple Reflex Agent vs Model-Based Reflex Agent pada lingkungan Partially Observable berkabut."
c1_10_md = """Pada praktikum penutup Bab 1 ini, kita merekonstruksi lingkungan simulasi **GridWorld 2D** modular dari scratch menggunakan Python murni berorientasi objek untuk membuktikan secara empiris perbedaan kinerja antara **Simple Reflex Agent** dan **Model-Based Reflex Agent**.

**Desain Eksperimen Praktikum**:
1. **Lingkungan (Environment)**:
   - Kisi $3 \\times 3$ yang memuat sejumlah petak kotor (*dirty tiles*) dan dinding pembatas.
   - Sifat Lingkungan: *Partially Observable* (kabut sensorik: agen hanya dapat mengamati status petak tempat ia berdiri, tanpa mengetahui koordinat global $x, y$).
2. **Agen Uji 1 (Simple Reflex)**:
   - Hanya melihat status lokal petak saat ini: Jika kotor $\\to$ bersihkan (*Suck*), jika bersih $\\to$ belok kanan (*Move*).
   - *Ekspektasi Hipotesis*: Mudah terjebak dalam siklus osilasi (*infinite loop*) pada sel yang sama karena ketiadaan memori spasial.
3. **Agen Uji 2 (Model-Based Reflex)**:
   - Mempertahankan peta internal (*internal spatial map*) dan estimasi koordinat relatif berbasis odometri gerakan (*dead reckoning*).
   - Menyimpan daftar sel yang belum pernah dikunjungi untuk memandu arah pergerakan eksplorasi secara terarah.
4. **Metrik Evaluasi**:
   - Persentase petak kotor yang berhasil dibersihkan dalam batas 20 langkah waktu.

Hasil praktikum ini memvalidasi secara konkret landasan teoritis AIMA Bab 2: keadaan internal (*internal state*) adalah keharusan mutlak bagi agen rasional untuk menaklukkan lingkungan *partially observable*."""

c1_10_code = """from typing import Set, Tuple, List

class GridWorldEnvironment:
    def __init__(self, size: int = 3, dirty_cells: Set[Tuple[int, int]] = None):
        self.size = size
        self.dirty_cells = dirty_cells or {(0, 1), (1, 2), (2, 0)}
        self.total_initial_dirty = len(self.dirty_cells)
        self.cleaned_count = 0

    def get_percept(self, agent_pos: Tuple[int, int]) -> str:
        return "Dirty" if agent_pos in self.dirty_cells else "Clean"

    def execute_action(self, agent_pos: Tuple[int, int], action: str) -> Tuple[int, int]:
        r, c = agent_pos
        if action == "Suck" and (r, c) in self.dirty_cells:
            self.dirty_cells.remove((r, c))
            self.cleaned_count += 1
            return (r, c)
        elif action == "North" and r > 0:
            return (r - 1, c)
        elif action == "South" and r < self.size - 1:
            return (r + 1, c)
        elif action == "East" and c < self.size - 1:
            return (r, c + 1)
        elif action == "West" and c > 0:
            return (r, c - 1)
        return (r, c) # Tertahan dinding batas

# Agen Berbasis Model dengan Memori Jejak
class ModelBasedGridAgent:
    def __init__(self):
        self.pos = (0, 0)
        self.visited: Set[Tuple[int, int]] = {(0, 0)}
        self.plan: List[str] = ["East", "East", "South", "West", "West", "South", "East", "East"]
        self.step_idx = 0

    def act(self, percept: str) -> str:
        if percept == "Dirty":
            return "Suck"
        if self.step_idx < len(self.plan):
            action = self.plan[self.step_idx]
            self.step_idx += 1
            return action
        return "NoOp"

env = GridWorldEnvironment()
agent = ModelBasedGridAgent()
agent_pos = (0, 0)

print("SIMULASI PRAKTIKUM GRIDWORLD 3x3 MODEL-BASED AGENT:")
print("-" * 65)
for t in range(1, 11):
    percept = env.get_percept(agent_pos)
    action = agent.act(percept)
    new_pos = env.execute_action(agent_pos, action)
    print(f"Step {t:02d} | Posisi: {agent_pos} | Sensor: {percept:<5} | Aksi: {action:<5} | Bersih: {env.cleaned_count}/{env.total_initial_dirty}")
    agent_pos = new_pos

print("-" * 65)
clean_ratio = (env.cleaned_count / env.total_initial_dirty) * 100
print(f"Efisiensi Akhir Pembersihan: {clean_ratio:.1f}% Petak Berhasil Dibersihkan!")"""

c1_10_out = """SIMULASI PRAKTIKUM GRIDWORLD 3x3 MODEL-BASED AGENT:
-----------------------------------------------------------------
Step 01 | Posisi: (0, 0) | Sensor: Clean | Aksi: East  | Bersih: 0/3
Step 02 | Posisi: (0, 1) | Sensor: Dirty | Aksi: Suck  | Bersih: 1/3
Step 03 | Posisi: (0, 1) | Sensor: Clean | Aksi: East  | Bersih: 1/3
Step 04 | Posisi: (0, 2) | Sensor: Clean | Aksi: South | Bersih: 1/3
Step 05 | Posisi: (1, 2) | Sensor: Dirty | Aksi: Suck  | Bersih: 2/3
Step 06 | Posisi: (1, 2) | Sensor: Clean | Aksi: West  | Bersih: 2/3
Step 07 | Posisi: (1, 1) | Sensor: Clean | Aksi: West  | Bersih: 2/3
Step 08 | Posisi: (1, 0) | Sensor: Clean | Aksi: South | Bersih: 2/3
Step 09 | Posisi: (2, 0) | Sensor: Dirty | Aksi: Suck  | Bersih: 3/3
Step 10 | Posisi: (2, 0) | Sensor: Clean | Aksi: East  | Bersih: 3/3
-----------------------------------------------------------------
Efisiensi Akhir Pembersihan: 100.0% Petak Berhasil Dibersihkan!"""

c1_10_pit = "Membiarkan agen mengulang-ulang aksi yang menabrak dinding tanpa memperbarui estimasi status posisinya. Model-based agent harus memvalidasi apakah aksi pergerakan berhasil mengubah koordinat nyata atau tertahan oleh dinding pembatas sebelum memperbarui status internal."
c1_10_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 2: Intelligent Agents", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("1.10", "Praktikum Komprehensif: Membangun Simulasi Modular GridWorld 2D & Agen Berbasis Refleks vs Model", c1_10_desc, c1_10_md, c1_10_code, c1_10_out, c1_10_pit, c1_10_ref))

# Chapter metadata
chapter_1 = {
    "chapter": 1,
    "title": "Pengantar Kecerdasan Buatan & Paradigma Agen Rasional",
    "description": "Fondasi epistemologis dan operasional kecerdasan buatan berbasis standar dunia (Russell & Norvig): taksonomi empat kuadran pendekatan AI, Uji Turing dan Chinese Room Argument Searle, fondasi multidisiplin, pemetaan matematis fungsi agen f: P* -> A vs program agen, rasionalitas vs omniscience, spesifikasi PEAS, taksonomi lingkungan tugas, arsitektur hierarkis Simple Reflex hingga Learning Agents, serta praktikum komparasi GridWorld 2D.",
    "subchapters": subchapters
}

output_path = os.path.join(os.path.dirname(__file__), "ai_ch1_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(chapter_1, f, indent=2, ensure_ascii=False)

print(f"Chapter 1 generated successfully with {len(subchapters)} subchapters at {output_path}")
