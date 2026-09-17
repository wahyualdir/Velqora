# scripts/curriculum-generator/generate_ai_ch2.py
import json
import os
import sys

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
# SUBCHAPTER 2.1
# ==============================================================================
c2_1_desc = "Paradigma agen pemecah masalah (Problem-Solving Agents), formulasi tujuan (Goal Formulation), dan formulasi masalah (Problem Formulation) dalam kerangka kerja AIMA."
c2_1_md = """Dalam domain kecerdasan buatan klasik, **Problem-Solving Agent** adalah agen berbasis tujuan (*goal-based agent*) yang memutuskan apa yang harus dilakukan dengan menemukan urutan tindakan (*sequences of actions*) yang mengarah ke status yang diinginkan. Berbeda dengan agen refleks sederhana yang hanya merespons kondisi saat ini, problem-solving agent merencanakan rangkaian langkah ke depan (*lookahead*) sebelum mengambil tindakan fisik pertama.

Proses pemecahan masalah terdiri dari empat fase sistematis:
1. **Goal Formulation (Formulasi Tujuan)**: Agen mengorganisasi tujuan berdasarkan situasi saat ini dan ukuran kinerja objektif. Tujuan membatasi ruang lingkup pencarian dengan mendefinisikan himpunan kondisi akhir yang dapat diterima (*satisfying states*).
2. **Problem Formulation (Formulasi Masalah)**: Proses memutuskan status (*states*) dan tindakan (*actions*) apa yang perlu dipertimbangkan, setelah tujuan ditetapkan. Formulasi masalah adalah tindakan abstraksi: mengeliminasi detail-detail dunia nyata yang tidak relevan (seperti warna cat mobil saat merencanakan rute navigasi).
3. **Search (Pencarian)**: Proses komputasi internal untuk mengeksplorasi ruang keadaan simulasi guna menemukan urutan tindakan yang membawa agen dari status awal ke status tujuan.
4. **Execution (Eksekusi)**: Setelah rencana (*plan*) ditemukan, agen menjalankan tindakan satu per satu ke lingkungan nyata.

Jika lingkungan bersifat *fully observable*, *deterministic*, *static*, dan *discrete*, solusi pencarian dijamin berupa urutan aksi tetap (*fixed action sequence*). Namun, jika lingkungan stokastik atau parsial teramati, agen memerlukan rencana kontingensi (*contingency planning*) atau kebijakan percabangan."""

c2_1_code = """from dataclasses import dataclass
from typing import List

@dataclass
class ProblemSolvingAgentPhase:
    phase_name: str
    input_data: str
    computation_output: str
    operational_role: str

phases: List[ProblemSolvingAgentPhase] = [
    ProblemSolvingAgentPhase("1. Goal Formulation", "Ukuran Kinerja & Persepsi", "Kriteria Goal State", "Membatasi ruang sasaran yang ingin dicapai"),
    ProblemSolvingAgentPhase("2. Problem Formulation", "Status Terkini & Tujuan", "Definisi State Space & Actions", "Abstraksi matematika dari realitas fisik"),
    ProblemSolvingAgentPhase("3. Search (Pencarian)", "Model Formal Masalah", "Urutan Tindakan (Plan)", "Eksplorasi simulasi ruang keadaan mental"),
    ProblemSolvingAgentPhase("4. Execution (Eksekusi)", "Urutan Plan", "Aksi Fisik ke Lingkungan", "Menggerakkan aktuator di dunia nyata")
]

print("FASE KERJA PROBLEM-SOLVING AGENT (RUSSELL & NORVIG AIMA BAB 3):")
print("=" * 75)
for p in phases:
    print(f"Fase       : {p.phase_name}")
    print(f"Masukan    : {p.input_data}")
    print(f"Luaran     : {p.computation_output}")
    print(f"Fungsi     : {p.operational_role}")
    print("-" * 75)"""

c2_1_out = """FASE KERJA PROBLEM-SOLVING AGENT (RUSSELL & NORVIG AIMA BAB 3):
===========================================================================
Fase       : 1. Goal Formulation
Masukan    : Ukuran Kinerja & Persepsi
Luaran     : Kriteria Goal State
Fungsi     : Membatasi ruang sasaran yang ingin dicapai
---------------------------------------------------------------------------
Fase       : 2. Problem Formulation
Masukan    : Status Terkini & Tujuan
Luaran     : Definisi State Space & Actions
Fungsi     : Abstraksi matematika dari realitas fisik
---------------------------------------------------------------------------
Fase       : 3. Search (Pencarian)
Masukan    : Model Formal Masalah
Luaran     : Urutan Tindakan (Plan)
Fungsi     : Eksplorasi simulasi ruang keadaan mental
---------------------------------------------------------------------------
Fase       : 4. Execution (Eksekusi)
Masukan    : Urutan Plan
Luaran     : Aksi Fisik ke Lingkungan
Fungsi     : Menggerakkan aktuator di dunia nyata
---------------------------------------------------------------------------"""

c2_1_pit = "Memulai proses pencarian (*search*) sebelum memformulasikan tujuan (*goal*) dan masalah (*problem*) secara presisi. Tanpa kriteria tujuan yang matematis, agen akan mengeksplorasi ruang keadaan tanpa arah dan mengalami ledakan kombinatorik yang fatal."
c2_1_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.1: Problem-Solving Agents", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.1", "Paradigma Problem-Solving Agents: Formulasi Masalah & Formulasi Tujuan", c2_1_desc, c2_1_md, c2_1_code, c2_1_out, c2_1_pit, c2_1_ref))


# ==============================================================================
# SUBCHAPTER 2.2
# ==============================================================================
c2_2_desc = "Lima komponen formal pembentuk masalah pencarian: Initial State, Actions, Transition Model, Goal Test, dan Path Cost."
c2_2_md = """Secara matematis, Stuart Russell & Peter Norvig mendefinisikan sebuah masalah pencarian (*search problem*) secara formal melalui lima komponen pembentuk:

1. **Initial State ($s_0$)**: Status awal di mana agen memulai proses. Misalnya, posisi agen berada di kota Arad pada peta Romania.
2. **Actions Function ($\text{Actions}(s)$)**: Diberikan suatu status $s$, fungsi ini mengembalikan himpunan tindakan yang valid dan dapat dieksekusi oleh agen dari status tersebut:
   $$\text{Actions}(s) = \{a \mid a \text{ adalah aksi yang legal di state } s\}$$
3. **Transition Model ($\text{Result}(s, a)$)**: Deskripsi formal mengenai status apa yang dicapai ketika agen mengeksekusi aksi $a$ dari status $s$:
   $$s' = \text{Result}(s, a)$$
   Istilah *successor* merujuk pada setiap status $s'$ yang dapat dicapai dari $s$ melalui satu aksi legal.
4. **Goal Test**: Pengujian untuk menentukan apakah suatu status tertentu merupakan status tujuan (*goal state*). Pengujian dapat berupa himpunan eksplisit berhingga (misal: $\{\text{Bucharest}\}$) atau fungsi predikat abstrak (misal: kondisi sekakmat pada papan catur).
5. **Path Cost Function ($c(s, a, s')$)**: Fungsi numerik yang memberikan biaya dari langkah transisi dari status $s$ ke $s'$ melalui aksi $a$. Biaya total lintasan (*step cost*) diasumsikan aditif non-negatif:
   $$\text{Cost}(p) = \sum_{i=1}^k c(s_{i-1}, a_i, s_i)$$

Solusi dari sebuah masalah adalah urutan aksi yang membawa agen dari status awal ke status yang memenuhi pengujian tujuan. Solusi dikatakan **optimal** jika memiliki biaya lintasan terkecil di antara seluruh solusi yang mungkin."""

c2_2_code = """from typing import Dict, List, Tuple, Set

class SearchProblemFormal:
    def __init__(self, initial_state: str, goal_states: Set[str], transitions: Dict[str, List[Tuple[str, str, float]]]):
        self.initial_state = initial_state
        self.goal_states = goal_states
        # transisi: state_asal -> [(aksi, state_tujuan, biaya)]
        self.transitions = transitions

    def actions(self, state: str) -> List[str]:
        return [action for action, _, _ in self.transitions.get(state, [])]

    def result(self, state: str, action: str) -> str:
        for act, next_state, _ in self.transitions.get(state, []):
            if act == action:
                return next_state
        raise ValueError(f"Aksi {action} tidak valid pada state {state}")

    def step_cost(self, state: str, action: str, next_state: str) -> float:
        for act, nxt, cost in self.transitions.get(state, []):
            if act == action and nxt == next_state:
                return cost
        raise ValueError("Transisi tidak ditemukan")

    def is_goal(self, state: str) -> bool:
        return state in self.goal_states

# Contoh Mini Peta Romania (Arad -> Sibiu -> Bucharest)
graph_data = {
    "Arad": [("Go_Zerind", "Zerind", 75.0), ("Go_Sibiu", "Sibiu", 140.0), ("Go_Timisoara", "Timisoara", 118.0)],
    "Sibiu": [("Go_Fagaras", "Fagaras", 99.0), ("Go_Rimnicu", "Rimnicu Vilcea", 80.0)],
    "Fagaras": [("Go_Bucharest", "Bucharest", 211.0)]
}

problem = SearchProblemFormal(initial_state="Arad", goal_states={"Bucharest"}, transitions=graph_data)

print("KOMPONEN FORMAL MASALAH PENCARIAN (AIMA BAB 3.1):")
print(f"1. Initial State : {problem.initial_state}")
print(f"2. Actions(Arad) : {problem.actions('Arad')}")
nxt = problem.result('Arad', 'Go_Sibiu')
cost = problem.step_cost('Arad', 'Go_Sibiu', nxt)
print(f"3. Result('Arad', 'Go_Sibiu') : {nxt} (Cost: {cost})")
print(f"4. Goal Test('Sibiu')        : {problem.is_goal('Sibiu')}")
print(f"5. Goal Test('Bucharest')    : {problem.is_goal('Bucharest')}")"""

c2_2_out = """KOMPONEN FORMAL MASALAH PENCARIAN (AIMA BAB 3.1):
1. Initial State : Arad
2. Actions(Arad) : ['Go_Zerind', 'Go_Sibiu', 'Go_Timisoara']
3. Result('Arad', 'Go_Sibiu') : Sibiu (Cost: 140.0)
4. Goal Test('Sibiu')        : False
5. Goal Test('Bucharest')    : True"""

c2_2_pit = "Memperbolehkan biaya langkah (*step cost*) bernilai negatif dalam masalah pencarian standar. Biaya langkah negatif dapat menyebabkan siklus penurunan biaya tanpa batas (*negative cost cycles*), merusak asumsi optimalitas algoritma seperti Dijkstra / Uniform-Cost Search dan A*."
c2_2_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.1: Well-Defined Problems and Solutions", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.2", "Lima Komponen Formal Masalah Pencarian: Initial State, Actions, Result, Goal Test, & Path Cost", c2_2_desc, c2_2_md, c2_2_code, c2_2_out, c2_2_pit, c2_2_ref))


# ==============================================================================
# SUBCHAPTER 2.3
# ==============================================================================
c2_3_desc = "Konsep Ruang Keadaan (State Space), Graf Ruang Keadaan, dan prinsip abstraksi matematis dalam memodelkan realitas ke bentuk komputasi."
c2_3_md = """**Ruang Keadaan (State Space)** dari suatu masalah pencarian adalah himpunan seluruh status yang dapat dicapai dari status awal melalui sembarang urutan tindakan. Ruang keadaan membentuk sebuah graf terarah (*directed graph*), di mana:
- **Simpul (Nodes)** merepresentasikan status abstrak sistem.
- **Sisi Terarah (Directed Edges)** merepresentasikan transisi tindakan legal yang menghubungkan satu status ke status berikutnya, dengan bobot sisi menyatakan biaya langkah (*step cost*).

Prinsip krusial dalam pemodelan ruang keadaan adalah **Abstraksi (Abstraction)**. Dunia nyata sangat kompleks: sebuah mobil yang melaju di jalan raya memiliki jutaan variabel kontinu (temperatur ban, getaran mesin, arah angin, frekuensi radio). Jika seluruh detail dimasukkan ke dalam representasi status, ruang keadaan akan berukuran tak hingga dan mustahil diselesaikan secara komputasi.

Abstraksi yang valid harus memenuhi dua syarat fundamental:
1. Menghilangkan seluruh variabel yang tidak memengaruhi ketercapaian tujuan atau keoptimalan biaya lintasan.
2. Memastikan bahwa setiap aksi abstrak di ruang keadaan dapat dipetakan kembali ke urutan aksi konkret yang dapat dieksekusi oleh aktuator nyata (*implementability*).

Sebuah ruang keadaan dapat bersifat berhingga (*finite*, seperti Rubik's Cube dengan $4.3 \\times 10^{19}$ status) atau tak berhingga (*infinite*, seperti ruang bilangan bulat kontinu)."""

c2_3_code = """from typing import Dict, Set

# Representasi Graf Ruang Keadaan Sederhana
class StateSpaceGraph:
    def __init__(self):
        self.adj: Dict[str, Dict[str, float]] = {}

    def add_edge(self, u: str, v: str, cost: float):
        if u not in self.adj: self.adj[u] = {}
        self.adj[u][v] = cost

    def get_state_space_size(self) -> int:
        states: Set[str] = set(self.adj.keys())
        for targets in self.adj.values():
            states.update(targets.keys())
        return len(states)

    def branching_factor(self, u: str) -> int:
        return len(self.adj.get(u, {}))

g = StateSpaceGraph()
g.add_edge("S", "A", 2.0)
g.add_edge("S", "B", 5.0)
g.add_edge("A", "C", 4.0)
g.add_edge("A", "D", 7.0)
g.add_edge("B", "D", 2.0)
g.add_edge("C", "G", 3.0)
g.add_edge("D", "G", 1.0)

print("ANALISIS GRAF RUANG KEADAAN (STATE SPACE GRAPH):")
print(f"Total Simpul Status Abstrak  : {g.get_state_space_size()}")
print(f"Faktor Percabangan di Node S : {g.branching_factor('S')}")
print(f"Faktor Percabangan di Node A : {g.branching_factor('A')}")
print(f"Suksesor dari S              : {list(g.adj['S'].items())}")"""

c2_3_out = """ANALISIS GRAF RUANG KEADAAN (STATE SPACE GRAPH):
Total Simpul Status Abstrak  : 6
Faktor Percabangan di Node S : 2
Faktor Percabangan di Node A : 2
Suksesor dari S              : [('A', 2.0), ('B', 5.0)]"""

c2_3_pit = "Membuat representasi ruang keadaan yang terlalu rinci (*over-specification*) sehingga mencakup variabel lingkungan yang tidak relevan dengan tujuan pencarian. Hal ini memperbesar faktor percabangan secara eksponensial tanpa memberikan manfaat heuristik apapun."
c2_3_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.1: Abstraction", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.3", "Konsep Ruang Keadaan (State Space), Graf Ruang Keadaan, & Prinsip Abstraksi Matematis", c2_3_desc, c2_3_md, c2_3_code, c2_3_out, c2_3_pit, c2_3_ref))


# ==============================================================================
# SUBCHAPTER 2.4
# ==============================================================================
c2_4_desc = "Studi kasus perumusan formal masalah mainan (Toy Problems) vs masalah dunia nyata (Real-World Problems): 8-Puzzle, 8-Queens, dan Peta Rute Romania."
c2_4_md = """Dalam literatur AI, masalah pencarian diklasifikasikan ke dalam dua kelompok: **Toy Problems** (masalah mainan terstandardisasi untuk tolok ukur algoritma) dan **Real-World Problems** (masalah terapan dunia nyata).

### 1. Masalah 8-Puzzle (Sliding-Tile Puzzle)
- **Status (States)**: Konfigurasi penempatan ubin bernomor 1 sampai 8 beserta satu petak kosong pada kisi $3 \\times 3$. Terdapat $9! / 2 = 181.440$ status yang dapat dijangkau.
- **Initial State**: Sembarang konfigurasi awal yang valid.
- **Actions**: Pergerakan petak kosong ke arah `{Kiri, Kanan, Atas, Bawah}`.
- **Transition Model**: Menghasilkan konfigurasi baru dengan posisi ubin yang ditukar dengan petak kosong.
- **Goal Test**: Ubin tersusun rapi sesuai urutan sasaran standar.
- **Path Cost**: Setiap pergeseran bernilai biaya 1 ($c = 1$).

### 2. Masalah 8-Queens (Constraint/State Formulation)
- **Formulasi Lengkap**: Menempatkan 8 ratu pada papan catur $8 \\times 8$ sehingga tidak ada ratu yang saling menyerang ($64 \\times 63 \\times \\dots \\approx 1.8 \\times 10^{14}$ status).
- **Formulasi Inkremental Cerdas**: Menempatkan ratu satu per satu pada setiap kolom dari kolom 1 hingga 8, pada baris yang tidak diserang ($8^8 = 16.777.216$ status, tereduksi drastis).

### 3. Masalah Dunia Nyata: Navigasi Peta Rute Romania
- Masalah penentuan rute jalan raya dengan jarak tempuh kilometer nyata sebagai biaya langkah antar kota. Masalah ini menjadi tolok ukur universal di seluruh bab pencarian AIMA."""

c2_4_code = """from typing import Tuple, List

# Representasi State 8-Puzzle menggunakan Tuple Imutabel
State8Puzzle = Tuple[int, ...]

class EightPuzzleProblem:
    GOAL_STATE: State8Puzzle = (1, 2, 3, 4, 5, 6, 7, 8, 0) # 0 merepresentasikan petak kosong

    def __init__(self, initial_state: State8Puzzle):
        self.initial_state = initial_state

    def find_blank(self, state: State8Puzzle) -> int:
        return state.index(0)

    def actions(self, state: State8Puzzle) -> List[str]:
        blank = self.find_blank(state)
        row, col = divmod(blank, 3)
        legal_moves = []
        if row > 0: legal_moves.append("UP")
        if row < 2: legal_moves.append("DOWN")
        if col > 0: legal_moves.append("LEFT")
        if col < 2: legal_moves.append("RIGHT")
        return legal_moves

    def result(self, state: State8Puzzle, action: str) -> State8Puzzle:
        blank = self.find_blank(state)
        row, col = divmod(blank, 3)
        new_row, new_col = row, col
        if action == "UP": new_row -= 1
        elif action == "DOWN": new_row += 1
        elif action == "LEFT": new_col -= 1
        elif action == "RIGHT": new_col += 1
        new_blank = new_row * 3 + new_col
        
        state_list = list(state)
        state_list[blank], state_list[new_blank] = state_list[new_blank], state_list[blank]
        return tuple(state_list)

init = (1, 2, 3, 0, 4, 6, 7, 5, 8)
p = EightPuzzleProblem(init)

print("FORMULASI FORMAL TOY PROBLEM: 8-PUZZLE:")
print(f"Status Awal         : {init}")
print(f"Posisi Petak Kosong : {p.find_blank(init)} (Baris {p.find_blank(init)//3}, Kolom {p.find_blank(init)%3})")
legal = p.actions(init)
print(f"Aksi Legal Tersedia : {legal}")
for act in legal:
    print(f" -> Aksi '{act}' menghasilkan State: {p.result(init, act)}")"""

c2_4_out = """FORMULASI FORMAL TOY PROBLEM: 8-PUZZLE:
Status Awal         : (1, 2, 3, 0, 4, 6, 7, 5, 8)
Posisi Petak Kosong : 3 (Baris 1, Kolom 0)
Aksi Legal Tersedia : ['UP', 'DOWN', 'RIGHT']
 -> Aksi 'UP' menghasilkan State: (0, 2, 3, 1, 4, 6, 7, 5, 8)
 -> Aksi 'DOWN' menghasilkan State: (1, 2, 3, 7, 4, 6, 0, 5, 8)
 -> Aksi 'RIGHT' menghasilkan State: (1, 2, 3, 4, 0, 6, 7, 5, 8)"""

c2_4_pit = "Memformulasikan aksi 8-puzzle dengan memindahkan ubin angka, alih-alih memindahkan petak kosong (blank). Memindahkan ubin angka memerlukan 8 kemungkinan aksi terpisah, sedangkan memindahkan petak kosong menyederhanakan ruang aksi menjadi maksimal 4 arah kardinal."
c2_4_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.2: Example Problems", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.4", "Studi Kasus Formal Masalah Pencarian: 8-Puzzle, 8-Queens, & Peta Rute Romania", c2_4_desc, c2_4_md, c2_4_code, c2_4_out, c2_4_pit, c2_4_ref))


# ==============================================================================
# SUBCHAPTER 2.5
# ==============================================================================
c2_5_desc = "Struktur data simpul pohon pencarian (Node Data Structure): pemisahan konseptual antara State dan Node, serta atribut Parent, Action, Path-Cost, dan Depth."
c2_5_md = """Salah satu pembedaan paling mendasar dalam rekayasa algoritma pencarian adalah membedakan antara **State** dan **Node**:
- **State**: Konfigurasi fisik atau matematis dari lingkungan (misal: kota Sibiu pada peta, atau penataan 8-puzzle). State tidak memiliki orang tua, biaya lintasan, maupun kedalaman.
- **Node**: Struktur data akuntansi yang digunakan oleh algoritma pencarian untuk menyusun pohon pencarian (*search tree*). Dua simpul node yang berbeda dalam pohon pencarian dapat merujuk pada status (*state*) fisik yang persis sama, namun dicapai melalui rute lintasan dan biaya yang berbeda!

Sebuah `Node` standar dalam algoritma pencarian memuat lima atribut kunci:
1. `node.STATE`: Status lingkungan yang direpresentasikan oleh simpul ini.
2. `node.PARENT`: Pointer ke simpul node yang menghasilkan simpul ini.
3. `node.ACTION`: Tindakan yang dieksekusi oleh simpul orang tua untuk menghasilkan simpul ini.
4. `node.PATH_COST` ($g(n)$): Biaya akumulatif dari simpul akar awal menuju simpul $n$.
5. `node.DEPTH`: Jumlah langkah transisi dari simpul akar awal ($d = 0$ untuk akar).

Fungsi rekonstruksi lintasan (`solution()`) bekerja dengan menelusuri pointer `PARENT` secara terbalik dari simpul tujuan hingga mencapai simpul akar awal."""

c2_5_code = """from dataclasses import dataclass
from typing import Any, List, Optional

@dataclass
class SearchNode:
    state: Any
    parent: Optional['SearchNode'] = None
    action: Optional[str] = None
    path_cost: float = 0.0
    depth: int = 0

    def get_path(self) -> List[Any]:
        curr = self
        path = []
        while curr:
            path.append(curr.state)
            curr = curr.parent
        return path[::-1]

    def get_action_sequence(self) -> List[str]:
        curr = self
        actions = []
        while curr and curr.action:
            actions.append(curr.action)
            curr = curr.parent
        return actions[::-1]

# Konstruksi Lintasan Manual: Arad -> Sibiu -> Fagaras -> Bucharest
root = SearchNode(state="Arad", path_cost=0.0, depth=0)
node_sibiu = SearchNode(state="Sibiu", parent=root, action="Go_Sibiu", path_cost=root.path_cost + 140.0, depth=1)
node_fagaras = SearchNode(state="Fagaras", parent=node_sibiu, action="Go_Fagaras", path_cost=node_sibiu.path_cost + 99.0, depth=2)
node_goal = SearchNode(state="Bucharest", parent=node_fagaras, action="Go_Bucharest", path_cost=node_fagaras.path_cost + 211.0, depth=3)

print("STRUKTUR DATA NODE PADA POHON PENCARIAN (AIMA BAB 3.3):")
print(f"Goal Node State : {node_goal.state}")
print(f"Kedalaman (d)   : {node_goal.depth}")
print(f"Total Biaya g(n): {node_goal.path_cost}")
print(f"Lintasan State  : {' -> '.join(node_goal.get_path())}")
print(f"Urutan Aksi     : {node_goal.get_action_sequence()}")"""

c2_5_out = """STRUKTUR DATA NODE PADA POHON PENCARIAN (AIMA BAB 3.3):
Goal Node State : Bucharest
Kedalaman (d)   : 3
Total Biaya g(n): 450.0
Lintasan State  : Arad -> Sibiu -> Fagaras -> Bucharest
Urutan Aksi     : ['Go_Sibiu', 'Go_Fagaras', 'Go_Bucharest']"""

c2_5_pit = "Menyamakan antara objek `State` dengan `Node`. Menggunakan objek `State` langsung sebagai node pencarian menyebabkan hilangnya informasi riwayat lintasan (*parent pointers*) dan kalkulasi akumulasi biaya $g(n)$."
c2_5_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.3: Search Algorithms - Nodes and States", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.5", "Struktur Data Node vs State: Atribut Parent, Action, Path-Cost g(n), & Kedalaman Depth", c2_5_desc, c2_5_md, c2_5_code, c2_5_out, c2_5_pit, c2_5_ref))


# ==============================================================================
# SUBCHAPTER 2.6
# ==============================================================================
c2_6_desc = "Analisis bahaya jalur berulang (Loopy Paths) dan jalur redundan (Redundant Paths): penyebab ledakan kombinatorik dan rekursi tak hingga."
c2_6_md = """Perbedaan topologi paling mendasar antara graf ruang keadaan dan pohon pencarian adalah potensi terjadinya **Jalur Berulang (Loopy Paths)** dan **Jalur Redundan (Redundant Paths)**.

1. **Jalur Berulang (Loopy Paths / Cycles)**: Terjadi ketika lintasan pencarian mengunjungi kembali status yang telah dikunjungi sebelumnya pada rantai leluhur (*ancestor path*). Contoh ekstrem: bolak-balik antara Arad $\\leftrightarrow$ Sibiu. Pada algoritma pencarian pohon murni (*tree-search*), siklus ini menciptakan cabang pohon dengan kedalaman tak berhingga, mengubah ruang keadaan berhingga menjadi pohon pencarian tak berhingga!
2. **Jalur Redundan (Redundant Paths)**: Terjadi ketika ada lebih dari satu cara untuk mencapai status fisik yang sama dari status awal. Misalnya, pada kisi petak $N \\times N$, terdapat banyak kombinasi pergerakan yang berbeda (misal: Kanan kemudian Bawah vs Bawah kemudian Kanan) yang berakhir pada koordinat petak yang sama.

Jumlah lintasan dalam graf kisi $N \\times N$ bertumbuh secara faktorial terhadap jumlah langkah, sedangkan jumlah status fisik unik hanya sebesar $N^2$. Tanpa deteksi redundansi, algoritma pencarian akan mengevaluasi kembali status yang sama secara berulang-ulang, menghabiskan memori dan waktu komputasi."""

c2_6_code = """def simulate_loopy_tree_search(max_depth: int = 4):
    # Simulasi graf 2 node yang saling terhubung: A <-> B
    print("DEMONSTRASI PERTUMBUHAN CABANG LOOPY TREE SEARCH (A <-> B):")
    frontier = [("A", ["A"])]
    for d in range(1, max_depth + 1):
        next_frontier = []
        for state, path in frontier:
            next_state = "B" if state == "A" else "A"
            next_frontier.append((next_state, path + [next_state]))
        frontier = next_frontier
        print(f"Kedalaman {d} | Jumlah Cabang di Frontier: {len(frontier)} | Contoh: {' -> '.join(frontier[0][1])}")

simulate_loopy_tree_search()"""

c2_6_out = """DEMONSTRASI PERTUMBUHAN CABANG LOOPY TREE SEARCH (A <-> B):
Kedalaman 1 | Jumlah Cabang di Frontier: 1 | Contoh: A -> B
Kedalaman 2 | Jumlah Cabang di Frontier: 1 | Contoh: A -> B -> A
Kedalaman 3 | Jumlah Cabang di Frontier: 1 | Contoh: A -> B -> A -> B
Kedalaman 4 | Jumlah Cabang di Frontier: 1 | Contoh: A -> B -> A -> B -> A"""

c2_6_pit = "Mengabaikan pemeriksaan status berulang pada graf yang memiliki aksi dua arah (*reversible actions*). Hal ini menyebabkan algoritma Depth-First Search terjebak dalam loop rekursi tanpa henti (*infinite loop*)."
c2_6_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.3: Avoiding Repeated States", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.6", "Bahaya Jalur Berulang (Loopy Paths) & Jalur Redundan: Mengapa Pohon Menjadi Tak Hingga", c2_6_desc, c2_6_md, c2_6_code, c2_6_out, c2_6_pit, c2_6_ref))


# ==============================================================================
# SUBCHAPTER 2.7
# ==============================================================================
c2_7_desc = "Komparasi Tree-Search vs Graph-Search dan mekanisme pemeliharaan himpunan Reached / Explored Set."
c2_7_md = """Untuk mengatasi masalah jalur berulang dan redundansi, algoritma pencarian terbagi menjadi dua paradigma arsitektur:

1. **Pencarian Pohon (Tree-Search)**: Algoritma mengekspansi simpul tanpa mengingat status mana yang telah dikunjungi sebelumnya. Pohon pencarian dibangun murni dari eksplorasi cabang. Keuntungan: hemat memori karena tidak perlu menyimpan riwayat kunjungan. Kelemahan: dapat terjebak dalam siklus tak berhingga dan melakukan perhitungan ulang redundan.
2. **Pencarian Graf (Graph-Search)**: Algoritma memelihara sebuah struktur data tambahan yang mencatat seluruh status yang telah dicapai (*reached / explored table*). Sebelum sebuah simpul diekspansi atau dimasukkan ke dalam antrean frontier, algoritma memeriksa tabel *reached*:
   - Pada AIMA Edisi ke-4, tabel **`reached`** diimplementasikan sebagai kamus (*hash table / dictionary*) yang memetakan $\\text{state} \\to \\text{Node}$.
   - Jika sebuah status baru belum pernah dicapai, atau dicapai dengan biaya $g(n)$ yang lebih murah daripada sebelumnya, status tersebut ditambahkan ke `reached` dan dimasukkan ke antrean frontier.

Pencarian graf menjamin kelengkapan (*completeness*) pada ruang keadaan berhingga yang memiliki siklus berulang, dengan imbalan kompromi kebutuhan memori ruang $\\mathcal{O}(|V|)$ untuk menyimpan tabel *reached*."""

c2_7_code = """from typing import Dict, List

def graph_search_cycle_check():
    # Graf dengan siklus: S -> A -> B -> S ... dan S -> G
    graph = {
        "S": [("A", 1.0), ("G", 10.0)],
        "A": [("B", 1.0)],
        "B": [("S", 1.0), ("G", 2.0)], # Siklus kembali ke S
        "G": []
    }
    
    frontier = ["S"]
    reached: Dict[str, float] = {"S": 0.0}
    expansion_order = []
    
    while frontier:
        curr = frontier.pop(0)
        expansion_order.append(curr)
        if curr == "G":
            break
            
        for nxt, cost in graph[curr]:
            new_cost = reached[curr] + cost
            if nxt not in reached or new_cost < reached[nxt]:
                reached[nxt] = new_cost
                frontier.append(nxt)
                
    print("EKSEKUSI GRAPH-SEARCH DENGAN TABEL REACHED:")
    print(f"Urutan Ekspansi Simpul : {expansion_order}")
    print(f"Tabel Biaya Reached    : {reached}")
    print(f"Biaya Optimal ke Goal G: {reached['G']}")

graph_search_cycle_check()"""

c2_7_out = """EKSEKUSI GRAPH-SEARCH DENGAN TABEL REACHED:
Urutan Ekspansi Simpul : ['S', 'A', 'G']
Tabel Biaya Reached    : {'S': 0.0, 'A': 1.0, 'G': 10.0, 'B': 2.0}
Biaya Optimal ke Goal G: 10.0"""

c2_7_pit = "Memasukkan status ke dalam *explored set* hanya berdasarkan identitas state tanpa memperhitungkan biaya $g(n)$. Jika status yang sama ditemukan kembali dengan jalur alternatif yang jauh lebih murah, penolakan buta dapat membuang solusi optimal."
c2_7_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.3: Best-First Search and the Reached Table", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.7", "Tree-Search vs Graph-Search: Mekanisme Reached Table untuk Menjamin Terminasi", c2_7_desc, c2_7_md, c2_7_code, c2_7_out, c2_7_pit, c2_7_ref))


# ==============================================================================
# SUBCHAPTER 2.8
# ==============================================================================
c2_8_desc = "Struktur data Frontier Queue: FIFO Queue, LIFO Stack, dan Priority Queue sebagai motor penggerak variasi algoritma pencarian."
c2_8_md = """Antrean perbatasan (**Frontier**) adalah struktur data yang menampung seluruh simpul daun (*leaf nodes*) yang telah digenerasikan tetapi belum diekspansi oleh algoritma pencarian. Strategi pemilihan simpul dari frontier menentukan secara mutlak perilaku algoritma pencarian:

1. **FIFO Queue (First-In, First-Out)**:
   - Simpul yang paling awal masuk akan dikeluarkan terlebih dahulu.
   - Digunakan oleh **Breadth-First Search (BFS)**.
2. **LIFO Queue (Last-In, First-Out / Stack)**:
   - Simpul yang paling akhir masuk akan dikeluarkan terlebih dahulu.
   - Digunakan oleh **Depth-First Search (DFS)**.
3. **Priority Queue (Antrean Berprioritas)**:
   - Simpul dikeluarkan berdasarkan nilai terendah dari suatu fungsi evaluasi $f(n)$.
   - Jika $f(n) = g(n)$ (biaya lintasan), menghasilkan **Uniform-Cost Search (UCS)**.
   - Jika $f(n) = h(n)$ (estimasi heuristik), menghasilkan **Greedy Best-First Search**.
   - Jika $f(n) = g(n) + h(n)$, menghasilkan **A* Search**.

Dalam Python, implementasi efisien FIFO menggunakan `collections.deque`, LIFO menggunakan `list` standar (`append`/`pop`), dan Priority Queue menggunakan modul `heapq` berbasis struktur data Binary Heap dengan kompleksitas penyisipan dan ekstraksi $\\mathcal{O}(\\log |V|)$."""

c2_8_code = """from collections import deque
import heapq
from typing import List, Tuple

# 1. FIFO Demo
fifo = deque(["Node_1", "Node_2", "Node_3"])
fifo.append("Node_4")
fifo_out = [fifo.popleft(), fifo.popleft()]

# 2. LIFO Demo
lifo = ["Node_1", "Node_2", "Node_3"]
lifo.append("Node_4")
lifo_out = [lifo.pop(), lifo.pop()]

# 3. Priority Queue Demo (f-cost, state)
pq: List[Tuple[float, str]] = []
heapq.heappush(pq, (140.0, "Sibiu"))
heapq.heappush(pq, (75.0, "Zerind"))
heapq.heappush(pq, (118.0, "Timisoara"))
pq_out = [heapq.heappop(pq), heapq.heappop(pq)]

print("OPERASIONAL STRUKTUR DATA FRONTIER QUEUE (AIMA BAB 3.3):")
print(f"1. FIFO Queue Keluar (BFS)     : {fifo_out}")
print(f"2. LIFO Stack Keluar (DFS)     : {lifo_out}")
print(f"3. PriorityQueue Keluar (UCS/A*): {pq_out} (Prioritas biaya terendah pertama)")"""

c2_8_out = """OPERASIONAL STRUKTUR DATA FRONTIER QUEUE (AIMA BAB 3.3):
1. FIFO Queue Keluar (BFS)     : ['Node_1', 'Node_2']
2. LIFO Stack Keluar (DFS)     : ['Node_4', 'Node_3']
3. PriorityQueue Keluar (UCS/A*): [(75.0, 'Zerind'), (118.0, 'Timisoara')] (Prioritas biaya terendah pertama)"""

c2_8_pit = "Menggunakan `list.pop(0)` untuk antrean FIFO. Pada Python, `pop(0)` memerlukan pergeseran seluruh elemen memori dengan kompleksitas $\\mathcal{O}(N)$, menyebabkan bottleneck performa parah pada antrean besar. Wajib menggunakan `collections.deque.popleft()` dengan $\\mathcal{O}(1)$."
c2_8_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.3: Queues", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.8", "Struktur Data Frontier Queue: FIFO Queue, LIFO Stack, & Priority Queue Terurut", c2_8_desc, c2_8_md, c2_8_code, c2_8_out, c2_8_pit, c2_8_ref))


# ==============================================================================
# SUBCHAPTER 2.9
# ==============================================================================
c2_9_desc = "Empat kriteria evaluasi kinerja algoritma pencarian: Completeness, Optimality, Time Complexity, dan Space Complexity."
c2_9_md = """Untuk membandingkan keunggulan analitis berbagai algoritma pencarian, Stuart Russell & Peter Norvig menetapkan **Empat Kriteria Evaluasi Kinerja**:

1. **Kelengkapan (Completeness)**: Apakah algoritma dijamin akan menemukan solusi jika solusi memang ada di ruang keadaan, serta melaporkan kegagalan secara benar jika tidak ada solusi?
2. **Optimalitas (Optimality)**: Apakah strategi pencarian menjamin bahwa solusi yang pertama kali ditemukan memiliki biaya lintasan terendah (*lowest path cost*) di antara semua solusi yang mungkin?
3. **Kompleksitas Waktu (Time Complexity)**: Berapa lama waktu komputasi yang dibutuhkan untuk menemukan solusi, diukur dalam jumlah simpul (*nodes*) yang digenerasikan selama proses pencarian?
4. **Kompleksitas Ruang / Memori (Space Complexity)**: Berapa banyak konsumsi memori yang dibutuhkan selama proses pencarian, diukur dalam jumlah simpul maksimum yang disimpan di memori kerja (*RAM*) pada satu waktu?

Dalam analisis kompleksitas asimtotik AI, tiga parameter ruang keadaan selalu digunakan:
- $b$ (**branching factor**): Faktor percabangan rata-rata atau maksimum (jumlah suksesor per simpul).
- $d$ (**depth of shallowest goal**): Kedalaman simpul tujuan paling dangkal dari akar.
- $m$ (**maximum depth**): Kedalaman maksimum dari sembarang lintasan di ruang keadaan (bisa bernilai $\\infty$)."""

c2_9_code = """# Perbandingan Kebutuhan Memori dan Waktu Asimtotik b^d
b = 10 # 10 suksesor per node
depths = [2, 4, 6, 8]
bytes_per_node = 1000 # 1 KB per node
nodes_per_sec = 1_000_000 # 1 juta node/detik

print("SKALABILITAS ASIMTOTIK KOMPLEKSITAS RUANG & WAKTU O(b^d) [b=10]:")
print("=" * 70)
print(f"{'Depth (d)':<10} | {'Total Nodes':<15} | {'Waktu Komputasi':<20} | {'Konsumsi Memori'}")
print("-" * 70)
for d in depths:
    nodes = b ** d
    time_sec = nodes / nodes_per_sec
    mem_mb = (nodes * bytes_per_node) / (1024 * 1024)
    time_str = f"{time_sec:.4f} detik" if time_sec < 60 else f"{time_sec/60:.1f} menit"
    mem_str = f"{mem_mb:.2f} MB" if mem_mb < 1024 else f"{mem_mb/1024:.2f} GB"
    print(f"{d:<10} | {nodes:<15,d} | {time_str:<20} | {mem_str}")"""

c2_9_out = """SKALABILITAS ASIMTOTIK KOMPLEKSITAS RUANG & WAKTU O(b^d) [b=10]:
======================================================================
Depth (d)  | Total Nodes     | Waktu Komputasi      | Konsumsi Memori
----------------------------------------------------------------------
2          | 100             | 0.0001 detik         | 0.10 MB
4          | 10,000          | 0.0100 detik         | 9.54 MB
6          | 1,000,000       | 1.0000 detik         | 953.67 MB
8          | 100,000,000     | 1.7 menit            | 93.13 GB"""

c2_9_pit = "Hanya mengkhawatirkan kompleksitas waktu dan mengabaikan kompleksitas ruang memori. Pada banyak masalah AI dunia nyata (seperti BFS pada $b=10, d=8$), memori komputer akan habis (*Out of Memory / OOM*) jauh sebelum waktu proses komputasi selesai."
c2_9_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.4: Measuring Problem-Solving Performance", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.9", "Empat Kriteria Evaluasi Algoritma Pencarian: Completeness, Optimality, Time, & Space", c2_9_desc, c2_9_md, c2_9_code, c2_9_out, c2_9_pit, c2_9_ref))


# ==============================================================================
# SUBCHAPTER 2.10
# ==============================================================================
c2_10_desc = "Praktikum komprehensif: Membangun kelas Problem dan Node generik standar AIMA di Python untuk menyelesaikan masalah graf berbobot."
c2_10_md = """Dalam praktikum penutup Bab 2 ini, kita membangun kerangka kerja berorientasi objek (*Object-Oriented Framework*) standar pustaka AIMA (`aima-python`) yang memisahkan secara bersih antara abstraksi masalah (`Problem`) dan abstraksi algoritma penelusuran (`Node`).

Kerangka kerja ini menyediakan fondasi modular untuk seluruh algoritma pencarian yang akan diimplementasikan pada Bab 3 (BFS, DFS, UCS, IDS) dan Bab 4 (Greedy, A*):
- Kelas abstrak `Problem` mendefinisikan kontrak fungsi `initial`, `actions()`, `result()`, `is_goal()`, dan `action_cost()`.
- Kelas `Node` mengelola pembungkusan status, pointer orang tua, kalkulasi akumulatif $g(n)$, dan metode utilitas `expand()` yang membangkitkan simpul-simpul anak (*child nodes*).
- Fungsi `reconstruct_path()` mengembalikan urutan tindakan dan status lengkap dari akar awal ke status tujuan."""

c2_10_code = """from typing import Any, Dict, List, Optional

class Problem:
    def __init__(self, initial: Any, goal: Optional[Any] = None):
        self.initial = initial
        self.goal = goal

    def actions(self, state: Any) -> List[Any]:
        raise NotImplementedError

    def result(self, state: Any, action: Any) -> Any:
        raise NotImplementedError

    def is_goal(self, state: Any) -> bool:
        return state == self.goal

    def action_cost(self, s: Any, a: Any, s_prime: Any) -> float:
        return 1.0

class Node:
    def __init__(self, state: Any, parent: Optional['Node'] = None, action: Optional[Any] = None, path_cost: float = 0.0):
        self.state = state
        self.parent = parent
        self.action = action
        self.path_cost = path_cost
        self.depth = 0 if parent is None else parent.depth + 1

    def expand(self, problem: Problem) -> List['Node']:
        s = self.state
        children = []
        for action in problem.actions(s):
            s_prime = problem.result(s, action)
            cost = self.path_cost + problem.action_cost(s, action, s_prime)
            children.append(Node(state=s_prime, parent=self, action=action, path_cost=cost))
        return children

    def path(self) -> List[Any]:
        node, path_back = self, []
        while node:
            path_back.append(node.state)
            node = node.parent
        return path_back[::-1]

# Implementasi Nyata Peta Sederhana
class GraphMapProblem(Problem):
    def __init__(self, initial: str, goal: str, roads: Dict[str, Dict[str, float]]):
        super().__init__(initial, goal)
        self.roads = roads

    def actions(self, state: str) -> List[str]:
        return list(self.roads.get(state, {}).keys())

    def result(self, state: str, action: str) -> str:
        return action # Pada peta ini, aksi adalah nama kota tujuan

    def action_cost(self, s: str, a: str, s_prime: str) -> float:
        return self.roads[s][s_prime]

romania_mini = {
    "Arad": {"Sibiu": 140.0, "Zerind": 75.0},
    "Sibiu": {"Fagaras": 99.0, "Rimnicu": 80.0},
    "Fagaras": {"Bucharest": 211.0}
}

prob = GraphMapProblem(initial="Arad", goal="Bucharest", roads=romania_mini)
root_node = Node(prob.initial)
print(f"Root Node : {root_node.state} (Cost: {root_node.path_cost})")
children_lvl1 = root_node.expand(prob)
print(f"Ekspansi Level 1 ({len(children_lvl1)} anak):")
for child in children_lvl1:
    print(f" -> Anak: {child.state:<10} | Aksi: {child.action:<10} | Biaya g(n): {child.path_cost}")"""

c2_10_out = """Root Node : Arad (Cost: 0.0)
Ekspansi Level 1 (2 anak):
 -> Anak: Sibiu      | Aksi: Sibiu      | Biaya g(n): 140.0
 -> Anak: Zerind     | Aksi: Zerind     | Biaya g(n): 75.0"""

c2_10_pit = "Memodifikasi status internal simpul orang tua saat membangkitkan simpul anak. Simpul harus bersifat imutabel atau memiliki salinan independen agar percabangan lain di pohon pencarian tidak terkorupsi efek samping (*side effects*)."
c2_10_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 3.3: Search Algorithms Infrastructure", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("2.10", "Praktikum Komprehensif: Membangun Kelas Abstraksi Problem & Node Standar AIMA di Python", c2_10_desc, c2_10_md, c2_10_code, c2_10_out, c2_10_pit, c2_10_ref))

# Chapter metadata
chapter_2 = {
    "chapter": 2,
    "title": "Formulasi Pemecahan Masalah & Ruang Keadaan",
    "description": "Metodologi perumusan formal pemecahan masalah (Russell & Norvig AIMA Bab 3): formulasi tujuan, lima komponen masalah formal (Initial State, Actions, Transition Model, Goal Test, Path Cost), ruang keadaan dan graf ruang keadaan, abstraksi komputasional, studi kasus 8-puzzle dan peta Romania, struktur data Node vs State, bahaya loopy paths dan siklus tak terhingga, tree-search vs graph-search dengan reached table, struktur data antrean frontier (FIFO, LIFO, PriorityQueue), kriteria kinerja (Completeness, Optimality, Time, Space), serta praktikum kelas Problem dan Node generik di Python.",
    "subchapters": subchapters
}

output_path = os.path.join(os.path.dirname(__file__), "ai_ch2_data.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(chapter_2, f, indent=2, ensure_ascii=False)

print(f"Chapter 2 generated successfully with {len(subchapters)} subchapters at {output_path}")
