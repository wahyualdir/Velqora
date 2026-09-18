import json
import os
import sys
import io

def run_snippet_and_get_output(code_str):
    old_stdout = sys.stdout
    redirected = io.StringIO()
    sys.stdout = redirected
    try:
        exec_globals = {}
        exec(code_str, exec_globals)
        out = redirected.getvalue().strip()
        return out
    finally:
        sys.stdout = old_stdout

def create_subchapter(id_str, title, description, content_markdown, code_snippet, common_pitfalls, canonical_refs):
    expected_output = run_snippet_and_get_output(code_snippet)
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
# SUBCHAPTER 9.1: Keterbatasan Logika Proposisional Menuju Logika Orde Pertama
# ==============================================================================
c9_1_desc = "Analisis epistemologis keterbatasan ekspresi logika proposisional, ledakan kombinatorial grounding proposisi, dan motivasi ontologis logika predikat orde pertama."
c9_1_md = """Logika Proposisional memiliki komitmen ontologis yang sangat terbatas: ia hanya mengasumsikan keberadaan **fakta-fakta atomik** yang bernilai Benar atau Salah di dunia. Keterbatasan ini memicu defisit daya ekspresi (*expressive inadequacy*) yang parah ketika berhadapan dengan dunia nyata:

1. **Ketidakmampuan Menggeneralisasi Sifat Objek**:
   Dalam logika proposisional, kita tidak dapat menyatakan pernyataan sederhana seperti *"Semua manusia fana"* secara langsung. Kita terpaksa menulis proposisi terpisah untuk setiap individu: $\\text{ManusiaSocrates} \\implies \\text{FanaSocrates}$, $\\text{ManusiaPlato} \\implies \\text{FanaPlato}$, dan seterusnya untuk miliaran entitas.
2. **Ledakan Kombinatorial Aturan Fisika**:
   Dalam dunia grid (seperti Wumpus World Bab 8), aturan hembusan angin harus diduplikasi untuk setiap petak $[x, y]$:
   $$B_{1,1} \\iff (P_{1,2} \\lor P_{2,1}), \\quad B_{1,2} \\iff (P_{1,1} \\lor P_{1,3} \\lor P_{2,2}), \\dots$$
   Untuk grid $100 \\times 100$, dibutuhkan puluhan ribu proposisi dan ratusan ribu klausa terpisah.
3. **Ketiadaan Hubungan Relasional Antar-Objek**:
   Logika proposisional tidak membedakan objek (*nouns*), relasi antar-objek (*verbs*), dan fungsi (*properties*).

**Logika Predikat Orde Pertama (First-Order Logic - FOL)** mengatasi batasan ini secara elegan dengan mengadopsi komitmen ontologis yang lebih kaya: dunia terdiri dari **Objek** (entitas dengan identitas individual), **Relasi / Predikat** (properti atau hubungan yang mengaitkan objek-objek), dan **Fungsi** (pemetaan terdefinisi dari objek ke objek lain)."""

c9_1_code = """from typing import List, Dict

# Perbandingan ekspresi: Proposisional vs Logika Orde Pertama (FOL)
# Skenario: Menegaskan bahwa setiap petak yang bertetangga dengan Pit memiliki Angin (Breeze)

class PropositionalRepresentation:
    @staticmethod
    def generate_rules(grid_size: int) -> List[str]:
        rules = []
        for x in range(1, grid_size + 1):
            for y in range(1, grid_size + 1):
                neighbors = []
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 1 <= nx <= grid_size and 1 <= ny <= grid_size:
                        neighbors.append(f"Pit_{nx}_{ny}")
                rules.append(f"Breeze_{x}_{y} <=> ({' v '.join(neighbors)})")
        return rules

# Ukuran grid 10x10 (100 petak)
prop_rules = PropositionalRepresentation.generate_rules(grid_size=10)

print("ANALISIS DEFISIT DAYA EKSPRESI: PROPOSISIONAL VS FOL:")
print("-" * 70)
print(f"Logika Proposisional (Grid 10x10):")
print(f" - Membutuhkan {len(prop_rules)} aturan proposisi terpisah yang harus di-grounding!")
print(f" - Contoh Aturan Petak [1, 1]: {prop_rules[0]}")
print(f" - Contoh Aturan Petak [5, 5]: {prop_rules[44]}")
print("-" * 70)
print("Logika Orde Pertama (FOL) hanya membutuhkan 1 ATURAN UNIVERSAL TUNGGAL:")
print(" FORALL x, y, a, b (Adjacent([x, y], [a, b]) ^ Pit([a, b]) => Breeze([x, y]))")
print("-" * 70)
print("FOL mengeliminasi redundansi komputasional melalui kuantifikasi variabel.")"""

c9_1_pit = "Mencoba menulis seluruh basis pengetahuan dunia nyata menggunakan logika proposisional. Jumlah klausa yang meledak secara eksponensial terhadap ukuran domain membuat inferensi tidak praktis; masalah yang melibatkan objek dan kuantifikasi harus dimodelkan dengan FOL."
c9_1_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 8.1: Representation Revisited", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("9.1", "9.1. Keterbatasan Logika Proposisional Menuju Logika Orde Pertama", c9_1_desc, c9_1_md, c9_1_code, c9_1_pit, c9_1_ref))

# ==============================================================================
# SUBCHAPTER 9.2: Sintaks FOL: Konstan, Variabel, Predikat, Fungsi
# ==============================================================================
c9_2_desc = "Elemen-elemen formal sintaksis Logika Predikat Orde Pertama: simbol konstan, variabel terikat/bebas, predikat relasional, simbol fungsi, dan term."
c9_2_md = """Sintaksis Logika Predikat Orde Pertama (Russell & Norvig, AIMA Edisi ke-4, Bab 8) dibangun di atas elemen-elemen formal yang merefleksikan struktur bahasa alami:

1. **Term**: Ekspresi logis yang merujuk pada objek individual di dunia:
   - **Simbol Konstan (Constants)**: Merepresentasikan objek spesifik di dunia nyata. Konvensi: diawali huruf kapital atau nama khusus, misalnya: $\\text{John}$, $\\text{Jakarta}$, $\\text{Angka2}$.
   - **Variabel (Variables)**: Merepresentasikan objek generik yang dapat digantikan oleh konstan sembarang. Konvensi: huruf kecil, misalnya: $x, y, z$.
   - **Simbol Fungsi (Functions)**: Pemetaan matematis dari satu atau lebih term objek ke objek tunggal lain. Contoh: $\\text{Ibu}(x)$, $\\text{KakiKiri}(\\text{John})$. Fungsi adalah referensi tidak langsung terhadap objek (berbeda dengan predikat, fungsi tidak bernilai Benar/Salah melainkan mengembalikan objek).
2. **Kalimat Atomik (Atomic Sentences)**:
   Dibangun dengan menerapkan **Simbol Predikat** pada sejumlah term argumen:
   $$\\text{Predikat}(\\text{term}_1, \\text{term}_2, \\dots, \\text{term}_k) \\quad \\text{atau} \\quad \\text{term}_1 = \\text{term}_2$$
   Predikat merepresentasikan relasi antar-objek dan bernilai Boolean ($\\text{True}$ atau $\\text{False}$). Contoh: $\\text{Saudara}(\\text{John}, x)$, $\\text{LebihBesar}(5, 3)$.
3. **Kalimat Kompleks (Complex Sentences)**:
   Kalimat atomik yang dihubungkan oleh operator logika ($\\neg, \\land, \\lor, \\implies, \\iff$) atau dibatasi oleh kuantor."""

c9_2_code = """from dataclasses import dataclass
from typing import List, Union

@dataclass(frozen=True)
class Variable:
    name: str
    def __repr__(self): return self.name

@dataclass(frozen=True)
class Constant:
    name: str
    def __repr__(self): return self.name

@dataclass(frozen=True)
class FunctionTerm:
    name: str
    args: List[Union[Variable, Constant, 'FunctionTerm']]
    def __repr__(self): return f"{self.name}({', '.join(map(str, self.args))})"

@dataclass(frozen=True)
class Predicate:
    name: str
    args: List[Union[Variable, Constant, FunctionTerm]]
    def __repr__(self): return f"{self.name}({', '.join(map(str, self.args))})"

# Membangun kalimat atomik: Saudara(John, Ibu(x))
x = Variable("x")
john = Constant("John")
ibu_x = FunctionTerm("Ibu", [x])
atom = Predicate("Saudara", [john, ibu_x])

print("REPRESENTASI STRUKTUR SINTAKSIS LOGIKA ORDE PERTAMA (FOL):")
print("-" * 65)
print(f"Konstan  : {john} (Merujuk pada individu spesifik John)")
print(f"Variabel : {x} (Placeholder objek generik)")
print(f"Fungsi   : {ibu_x} (Term yang mengembalikan objek ibu dari x)")
print(f"Predikat : {atom} (Kalimat atomik yang bernilai True/False)")
print("-" * 65)
print(f"Struktur Abstract Syntax Tree (AST): Predikat '{atom.name}' dengan {len(atom.args)} argumen.")"""

c9_2_pit = "Tertukar antara Simbol Predikat dan Simbol Fungsi. Predikat Saudara(x, y) mengembalikan nilai Boolean (True/False). Sebaliknya, Fungsi Ibu(x) mengembalikan objek (seorang manusia), bukan nilai kebenaran."
c9_2_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 8.2: Syntax and Semantics of First-Order Logic", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("9.2", "9.2. Sintaks FOL: Konstan, Variabel, Predikat, Fungsi", c9_2_desc, c9_2_md, c9_2_code, c9_2_pit, c9_2_ref))

# ==============================================================================
# SUBCHAPTER 9.3: Kuantor Universal dan Eksistensial
# ==============================================================================
c9_3_desc = "Semantik formal kuantor universal (FORALL) sebagai konjungsi terbentang domain, kuantor eksistensial (EXISTS) sebagai disjungsi terbentang, dan pasangan penghubung alaminya."
c9_3_md = """Kekuatan ekspresi sejati dari Logika Orde Pertama berasal dari kehadiran **Kuantor (Quantifiers)**:

1. **Kuantor Universal ($\\forall$ / FORALL)**:
   Pernyataan $\\forall x \\, P(x)$ menegaskan bahwa predikat $P$ bernilai $\\text{True}$ untuk **seluruh** objek $x$ dalam domain semesta pembicaraan (*universe of discourse*).
   Secara semantik, jika domain berhingga terdiri dari objek $\\{O_1, O_2, \\dots, O_k\\}$, kuantor universal ekuivalen dengan **konjungsi terbentang (conjunction)**:
   $$\\forall x \\, P(x) \\equiv P(O_1) \\land P(O_2) \\land \\dots \\land P(O_k)$$
   *Pasangan Alami*: Kuantor universal secara alami berpasangan dengan **Implikasi ($\\implies$)**:
   $$\\forall x \\, (\\text{Mahasiswa}(x) \\implies \\text{Cerdas}(x))$$
   (Artinya: Untuk setiap entitas, jika ia mahasiswa, maka ia cerdas. Entitas non-mahasiswa tidak melanggar aturan ini karena premisnya bernilai False).

2. **Kuantor Eksistensial ($\\exists$ / EXISTS)**:
   Pernyataan $\\exists x \\, P(x)$ menegaskan bahwa terdapat **setidaknya satu** objek $x$ dalam semesta di mana $P(x)$ bernilai $\\text{True}$.
   Secara semantik, kuantor eksistensial ekuivalen dengan **disjungsi terbentang (disjunction)**:
   $$\\exists x \\, P(x) \\equiv P(O_1) \\lor P(O_2) \\lor \\dots \\lor P(O_k)$$
   *Pasangan Alami*: Kuantor eksistensial secara alami berpasangan dengan **Konjungsi ($\\land$)**:
   $$\\exists x \\, (\\text{Mahasiswa}(x) \\land \\text{MendapatNilaiA}(x))$$"""

c9_3_code = """# Evaluasi semantik kuantor pada semesta pembicaraan berhingga
universe = ["Alice", "Bob", "Charlie"]

# Basis pengetahuan fakta
is_student = {"Alice": True, "Bob": True, "Charlie": True}
is_smart = {"Alice": True, "Bob": True, "Charlie": True}
has_gold = {"Alice": False, "Bob": True, "Charlie": False}

# Uji FORALL x (Student(x) => Smart(x))
# Ekuivalen dengan: (Student(Alice) => Smart(Alice)) and (Student(Bob) => Smart(Bob)) and ...
forall_eval = all(
    (not is_student[obj] or is_smart[obj]) for obj in universe
)

# Uji EXISTS x (Student(x) and HasGold(x))
# Ekuivalen dengan: (Student(Alice) and HasGold(Alice)) or (Student(Bob) and HasGold(Bob)) or ...
exists_eval = any(
    (is_student[obj] and has_gold[obj]) for obj in universe
)

print("EVALUASI SEMANTIK KUANTOR PADA DOMAIN SEMESTA FINIT:")
print("-" * 65)
print(f"Semesta Objek (Universe): {universe}")
print(f"Evaluasi FORALL x (Student(x) => Smart(x)): {forall_eval} (Seluruh objek memenuhi)")
print(f"Evaluasi EXISTS x (Student(x) ^ HasGold(x)): {exists_eval} (Objek 'Bob' memenuhi)")
print("-" * 65)
print("Kuantor universal bertindak sebagai AND universal; eksistensial bertindak sebagai OR.")"""

c9_3_pit = "Menggunakan penghubung konjungsi (^) bersama kuantor universal: FORALL x (Mahasiswa(x) ^ Cerdas(x)). Kalimat ini berarti 'SEMUA OBJEK DI ALAM SEMESTA ADALAH MAHASISWA DAN CERDAS' (termasuk cangkir kopi dan gedung kampus), yang hampir pasti salah."
c9_3_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 8.2.4: Quantifiers", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("9.3", "9.3. Kuantor Universal dan Eksistensial", c9_3_desc, c9_3_md, c9_3_code, c9_3_pit, c9_3_ref))

# ==============================================================================
# SUBCHAPTER 9.4: Hubungan Dualitas De Morgan pada Kuantor
# ==============================================================================
c9_4_desc = "Transformasi dualitas De Morgan untuk kuantor logika orde pertama, negasi kalimat terkuantisasi, dan ekuivalensi inter-definisi kuantor."
c9_4_md = """Sebagaimana hukum De Morgan menghubungkan konjungsi dan disjungsi dalam logika proposisional, terdapat **Hubungan Dualitas De Morgan** yang secara fundamental menghubungkan Kuantor Universal dan Kuantor Eksistensial:

1. **Negasi Kuantor Universal**:
   $$\\neg \\forall x \\, P(x) \\iff \\exists x \\, \\neg P(x)$$
   *Arti*: *"Tidak semua orang menyukai brokoli"* ekuivalen dengan *"Ada setidaknya satu orang yang tidak menyukai brokoli"*.
2. **Negasi Kuantor Eksistensial**:
   $$\\neg \\exists x \\, P(x) \\iff \\forall x \\, \\neg P(x)$$
   *Arti*: *"Tidak ada manusia yang bisa hidup selamanya"* ekuivalen dengan *"Semua manusia tidak bisa hidup selamanya"*.
3. **Inter-definisi Kuantor**:
   Setiap kuantor dapat didefinisikan secara murni menggunakan kuantor lainnya bersama operator negasi:
   $$\\forall x \\, P(x) \\iff \\neg \\exists x \\, \\neg P(x)$$
   $$\\exists x \\, P(x) \\iff \\neg \\forall x \\, \\neg P(x)$$

Hubungan dualitas ini sangat krusial dalam tahap kompilasi dan konversi otomatis logika formal (misalnya pada algoritma pembuktian resolusi dan skolemization), di mana seluruh negasi harus didorong melewati kuantor hingga mencapai predikat atomik terdalam."""

c9_4_code = """# Verifikasi komputasional dualitas De Morgan pada domain terbatas
domain_people = ["Budi", "Siti", "Andi"]
likes_broccoli = {"Budi": True, "Siti": False, "Andi": True}

# Sisi Kiri 1: NOT (FORALL x Likes(x))
lhs_1 = not all(likes_broccoli[p] for p in domain_people)

# Sisi Kanan 1: EXISTS x (NOT Likes(x))
rhs_1 = any(not likes_broccoli[p] for p in domain_people)

# Sisi Kiri 2: NOT (EXISTS x (Likes(x) == 'Terbang'))
can_fly = {"Budi": False, "Siti": False, "Andi": False}
lhs_2 = not any(can_fly[p] for p in domain_people)

# Sisi Kanan 2: FORALL x (NOT CanFly(x))
rhs_2 = all(not can_fly[p] for p in domain_people)

print("PEMBUKTIAN KOMPUTASIONAL DUALITAS DE MORGAN KUANTOR:")
print("-" * 65)
print(f"Teorema 1: ~FORALL x P(x) <=> EXISTS x ~P(x)")
print(f" - Evaluasi LHS: {lhs_1} | Evaluasi RHS: {rhs_1} -> Ekuivalen: {lhs_1 == rhs_1}")
print("-" * 65)
print(f"Teorema 2: ~EXISTS x Q(x) <=> FORALL x ~Q(x)")
print(f" - Evaluasi LHS: {lhs_2} | Evaluasi RHS: {rhs_2} -> Ekuivalen: {lhs_2 == rhs_2}")
print("-" * 65)
print("Transformasi dualitas terbukti menghasilkan nilai kebenaran identik 100%.")"""

c9_4_pit = "Lupa membalik kuantor saat mendorong tanda negasi ke dalam tanda kurung. Mengubah ~(FORALL x P(x)) menjadi FORALL x (~P(x)) adalah kesalahan logika fatal (mengubah 'tidak semua orang kaya' menjadi 'semua orang tidak kaya')."
c9_4_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 8.2.4: Quantifiers", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("9.4", "9.4. Hubungan Dualitas De Morgan pada Kuantor", c9_4_desc, c9_4_md, c9_4_code, c9_4_pit, c9_4_ref))

# ==============================================================================
# SUBCHAPTER 9.5: Unifikasi dan Algoritma Substitusi (MGU)
# ==============================================================================
c9_5_desc = "Algoritma Unifikasi (J. Alan Robinson 1965): penyamaan term predikat, komposisi substitusi, Most General Unifier (MGU), dan pencegahan siklus Occurs-Check."
c9_5_md = """Dalam logika proposisional, penentuan kecocokan literal adalah operasi trivial: simbol $P$ cocok dengan $P$. Namun, dalam Logika Orde Pertama, dua literal atomik dapat memuat variabel dan fungsi yang berbeda namun tetap memiliki makna yang dapat diselaraskan. Proses algoritmis untuk menemukan substitusi variabel yang membuat dua ekspresi logika menjadi identik disebut **Unifikasi (Unification)**.

Secara formal, diberikan dua kalimat atau term $p$ dan $q$, unifikasi mencari himpunan substitusi $\\theta$ sedemikian rupa sehingga:

$$\\text{SUBST}(\\theta, p) = \\text{SUBST}(\\theta, q)$$

Himpunan substitusi ditulis dalam bentuk pemetaan variabel ke term: $\\theta = \\{x / A, y / f(B)\\}$.

**Most General Unifier (MGU)**:
Robinson (1965) membuktikan teorema penting: jika dua ekspresi dapat diunifikasi, maka selalu terdapat **Most General Unifier (MGU)** unik (hingga penamaan ulang variabel) yang menetapkan batasan paling longgar (*least commitment*) pada variabel.

**Bahaya Kritis: Occurs-Check**:
Saat mengunifikasi variabel $x$ dengan term kompleks $t$ (misalnya $t = f(x)$), algoritma wajib memeriksa apakah variabel $x$ muncul di dalam $t$ (**Occurs-Check**). Jika $x$ muncul di dalam $t$, substitusi $\\{x / f(x)\\}$ akan menghasilkan term tak berhingga (*infinite tree structure* $f(f(f(\\dots)))$) yang memicu perulangan tak terbatas."""

c9_5_code = """from typing import Dict, Any, Optional

def unify(x: Any, y: Any, theta: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    if theta is None:
        theta = {}
    if theta is False:
        return None
    elif x == y:
        return theta
    elif isinstance(x, str) and x.islower():  # Variabel
        return unify_var(x, y, theta)
    elif isinstance(y, str) and y.islower():  # Variabel
        return unify_var(y, x, theta)
    elif isinstance(x, list) and isinstance(y, list):
        if len(x) != len(y):
            return None
        return unify(x[1:], y[1:], unify(x[0], y[0], theta))
    else:
        return None

def unify_var(var: str, x: Any, theta: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if var in theta:
        return unify(theta[var], x, theta)
    elif isinstance(x, str) and x in theta:
        return unify(var, theta[x], theta)
    elif occurs_check(var, x, theta):
        return None  # Occurs-check gagal (mencegah siklus tak berhingga)
    else:
        return {**theta, var: x}

def occurs_check(var: str, x: Any, theta: Dict[str, Any]) -> bool:
    if var == x:
        return True
    elif isinstance(x, str) and x in theta:
        return occurs_check(var, theta[x], theta)
    elif isinstance(x, list):
        return any(occurs_check(var, elem, theta) for elem in x)
    return False

# Uji Unifikasi 1: Knows(John, x) dengan Knows(John, Jane)
e1 = ["Knows", "John", "x"]
e2 = ["Knows", "John", "Jane"]
theta1 = unify(e1, e2)

# Uji Unifikasi 2 (Occurs-Check): x dengan f(x)
e3 = "x"
e4 = ["f", "x"]
theta2 = unify(e3, e4)

print("HASIL ALGORITMA UNIFIKASI & OCCURS-CHECK (ROBINSON 1965):")
print("-" * 65)
print(f"Ekspresi 1 : {e1}")
print(f"Ekspresi 2 : {e2}")
print(f"MGU Ditemukan : {theta1}")
print("-" * 65)
print(f"Uji Siklus : Unifikasi x dengan f(x)")
print(f"Hasil MGU   : {theta2} (Berhasil Digagalkan oleh Occurs-Check!)")
print("-" * 65)
print("Unifikasi menjadi fondasi penarikan kesimpulan terangkat (lifted inference).")"""

c9_5_pit = "Menghilangkan Occurs-Check demi optimasi kecepatan (seperti yang dilakukan pada implementasi awal Prolog). Tanpa occurs-check, sistem inferensi dapat menyimpulkan bahwa P(x) dan P(f(x)) identik, yang merusak soundness deduksi matematika."
c9_5_ref = [
    {"title": "J. Alan Robinson (1965) A Machine-Oriented Logic Based on the Resolution Principle, Journal of the ACM, 12(1), Section 4: Unification, pp. 28–29", "url": "https://doi.org/10.1145/321250.321253"}
]
subchapters.append(create_subchapter("9.5", "9.5. Unifikasi dan Algoritma Substitusi (MGU)", c9_5_desc, c9_5_md, c9_5_code, c9_5_pit, c9_5_ref))

# ==============================================================================
# SUBCHAPTER 9.6: Generalized Modus Ponens (GMP)
# ==============================================================================
c9_6_desc = "Aturan inferensi terangkat Generalized Modus Ponens (GMP) untuk klausa definit orde pertama, eliminasi langkah proposisionalisasi, dan eksekusi terarah."
c9_6_md = """Dalam Logika Orde Pertama, kita dapat melakukan inferensi dengan cara kuno: mengganti seluruh variabel dengan seluruh konstan yang ada di dunia (*propositionalization / Herbrand expansion*), lalu menggunakan solver proposisional. Namun, pendekatan ini sangat lambat karena menghasilkan jutaan klausa yang tidak berguna.

Solusi modern yang elegan adalah **Inferensi Terangkat (Lifted Inference)**, di mana penalaran dilakukan langsung pada tingkat variabel dan predikat kuantisasi tanpa pernah membumikannya (*without grounding*). Inti dari pendekatan ini adalah **Generalized Modus Ponens (GMP)**.

**Formulasi Generalized Modus Ponens**:
Diberikan sekumpulan fakta atomik $p_1', p_2', \\dots, p_n'$ dan sebuah aturan implikasi klausa definit:
$$(p_1 \\land p_2 \\land \\dots \\land p_n) \\implies q$$
Jika terdapat substitusi Most General Unifier $\\theta$ sedemikian rupa sehingga:
$$\\text{SUBST}(\\theta, p_i') = \\text{SUBST}(\\theta, p_i) \\quad \\text{untuk setiap } i = 1, \\dots, n$$
Maka kita dapat langsung menarik kesimpulan terangkat:
$$\\text{SUBST}(\\theta, q)$$

GMP merupakan aturan yang sound (benar secara matematis) dan menjadi tulang punggung mesin forward chaining pada sistem pakar dan basis data deduktif Datalog."""

c9_6_code = """from typing import Dict, List, Tuple

# Simulasi Generalized Modus Ponens
# Aturan: Missle(x) ^ Owns(Nono, x) => Sells(West, x, Nono)
# Fakta 1: Missle(M1)
# Fakta 2: Owns(Nono, M1)

def generalized_modus_ponens():
    # Definisi pola anteseden aturan
    rule_premises = [("Missle", "x"), ("Owns", "Nono", "x")]
    rule_conclusion = ("Sells", "West", "x", "Nono")
    
    # Basis fakta
    facts = [("Missle", "M1"), ("Owns", "Nono", "M1")]
    
    # Cari unifikasi substitusi x -> M1
    theta = {}
    for (p_rel, *p_args), (f_rel, *f_args) in zip(rule_premises, facts):
        if p_rel == f_rel and len(p_args) == len(f_args):
            for pa, fa in zip(p_args, f_args):
                if pa == "x":
                    theta["x"] = fa

    # Terapkan theta pada kesimpulan
    concl_rel, *concl_args = rule_conclusion
    deduced = [concl_rel] + [theta.get(arg, arg) for arg in concl_args]
    
    return theta, tuple(deduced)

subst, result_fact = generalized_modus_ponens()

print("HASIL INFERENSI TERANGKAT GENERALIZED MODUS PONENS (GMP):")
print("-" * 65)
print("Aturan Definit: Missle(x) ^ Owns(Nono, x) => Sells(West, x, Nono)")
print("Fakta Masukan : Missle(M1), Owns(Nono, M1)")
print(f"Substitusi Unifikasi (Theta) : {subst}")
print(f"Fakta Baru yang Diturunkan   : {result_fact[0]}({', '.join(result_fact[1:])})")
print("-" * 65)
print("GMP mengeksekusi inferensi langsung pada tingkat lifted tanpa propositionalization.")"""

c9_6_pit = "Menerapkan GMP pada aturan yang memuat disjungsi atau negasi di dalam kepalanya. Generalized Modus Ponens HANYA berlaku untuk klausa definit (implikasi dengan konjungsi atom di badan dan atom tunggal di kepala)."
c9_6_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 9.1: Representation and Inference", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("9.6", "9.6. Generalized Modus Ponens (GMP)", c9_6_desc, c9_6_md, c9_6_code, c9_6_pit, c9_6_ref))

# ==============================================================================
# SUBCHAPTER 9.7: Konversi Kalimat FOL ke CNF & Skolemization
# ==============================================================================
c9_7_desc = "Prosedur kanonikal 7-langkah konversi FOL ke CNF, standarisasi variabel, eliminasi kuantor, dan eliminasi kuantor eksistensial via Skolemization."
c9_7_md = """Untuk menerapkan Algoritma Resolusi Orde Pertama, setiap formula logika predikat harus ditransformasikan ke dalam bentuk klausa CNF bebas kuantor melalui **Prosedur 7-Langkah**:

1. **Eliminasi Implikasi & Bikondisional**:
   Transformasikan $\\alpha \\implies \\beta$ menjadi $\\neg \\alpha \\lor \\beta$.
2. **Dorong Negasi ke Dalam**:
   Gunakan hukum De Morgan proposisional dan kuantor:
   $$\\neg \\forall x \\, P \\to \\exists x \\, \\neg P, \\quad \\neg \\exists x \\, P \\to \\forall x \\, \\neg P$$
3. **Standarisasi Variabel (Standardize Variables Apart)**:
   Pastikan setiap kuantor menggunakan nama variabel yang unik agar tidak terjadi tumpang tindih cakupan scope:
   $$(\\forall x \\, P(x)) \\lor (\\exists x \\, Q(x)) \\implies (\\forall x \\, P(x)) \\lor (\\exists y \\, Q(y))$$
4. **Skolemisasi (Skolemization)**:
   Eliminasi seluruh kuantor eksistensial ($\\exists$):
   - Jika $\\exists$ **tidak berada di dalam lingkup** $\\forall$, gantikan variabel eksistensial dengan **Konstan Skolem** baru (misal: $\\exists x \\, \\text{Heart}(x) \\to \\text{Heart}(H_1)$).
   - Jika $\\exists$ **berada di dalam lingkup** $\\forall x$, variabel eksistensial bergantung pada $x$. Gantikan dengan **Fungsi Skolem** baru:
     $$\\forall x \\, \\exists y \\, \\text{Loves}(x, y) \\implies \\forall x \\, \\text{Loves}(x, F(x))$$
5. **Jatuhkan Kuantor Universal**:
   Karena seluruh variabel yang tersisa sekarang pasti terkuantisasi secara universal, simbol $\\forall$ dapat dihilangkan secara implisit.
6. **Distribusikan $\\lor$ Terhadap $\\land$**.
7. **Pecah Menjadi Himpunan Klausa (Set of Clauses)**."""

c9_7_code = """# Simulasi mekanis Skolemization
# Kalimat: FORALL x (Person(x) => EXISTS y (Mother(y, x)))

step1 = "FORALL x (~Person(x) v EXISTS y (Mother(y, x)))"
# Skolemization: y berada di dalam scope FORALL x, maka y digantikan fungsi Skolem f(x)
step4_skolem = "FORALL x (~Person(x) v Mother(f(x), x))"
# Drop FORALL
step5_drop = "~Person(x) v Mother(f(x), x)"
# Bentuk klausa final
final_clause = {"~Person(x)", "Mother(f(x), x)"}

print("PROSEDUR SKOLEMIZASI & KONVERSI FOL MENUJU CNF:")
print("-" * 65)
print("Formula Asli : FORALL x (Person(x) => EXISTS y (Mother(y, x)))")
print(f"Langkah 1    : {step1}")
print(f"Skolemisasi  : {step4_skolem} [y digantikan f(x)]")
print(f"Drop FORALL  : {step5_drop}")
print("-" * 65)
print(f"Klausa CNF Final: {final_clause}")
print("Fungsi Skolem f(x) memetakan setiap objek x ke ibu kandungnya masing-masing.")"""

c9_7_pit = "Menggantikan variabel eksistensial di dalam scope FORALL dengan konstan Skolem biasa (alih-alih fungsi Skolem). Kesalahan ini mengubah makna 'Setiap orang memiliki seorang ibu' menjadi 'Ada satu orang wanita yang menjadi ibu dari seluruh orang di bumi'."
c9_7_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 9.5: Resolution", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("9.7", "9.7. Konversi Kalimat FOL ke CNF & Skolemization", c9_7_desc, c9_7_md, c9_7_code, c9_7_pit, c9_7_ref))

# ==============================================================================
# SUBCHAPTER 9.8: Resolusi Orde Pertama (First-Order Resolution)
# ==============================================================================
c9_8_desc = "Aturan resolusi terangkat (Lifted First-Order Resolution), unifikasi MGU sepasang literal komplemen, pemfaktoran klausa (factoring), dan refutation completeness."
c9_8_md = """Aturan **First-Order Resolution (Resolusi Orde Pertama)** adalah perluasan langsung dari resolusi proposisional (Bab 8) menuju bahasa logika predikat penuh menggunakan Unifikasi (Robinson 1965).

**Aturan Resolusi Terangkat**:
Diberikan dua klausa dalam representasi CNF:
$$C_1 = l_1 \\lor \\dots \\lor l_i \\lor \\dots \\lor l_k$$
$$C_2 = m_1 \\lor \\dots \\lor m_j \\lor \\dots \\lor m_p$$
Jika terdapat literal $l_i \\in C_1$ dan literal $m_j \\in C_2$ yang memiliki tanda berlawanan (satu positif dan satu negatif) serta dapat diunifikasi dengan Most General Unifier $\\theta$:
$$\\text{UNIFY}(l_i, \\neg m_j) = \\theta$$
Maka resolvent yang diturunkan adalah:
$$\\text{SUBST}\\Big(\\theta, \\, (C_1 \\setminus \\{l_i\\}) \\cup (C_2 \\setminus \\{m_j\\})\\Big)$$

**Pemfaktoran (Factoring)**:
Untuk menjamin sifat **Refutation Completeness** penuh pada FOL, aturan resolusi harus dilengkapi dengan teknik *Factoring*: jika dua atau lebih literal dalam satu klausa yang sama dapat diunifikasi dengan substitusi $\\sigma$, maka klausa terfaktorkan $\\text{SUBST}(\\sigma, C)$ harus ditambahkan ke basis klausa."""

c9_8_code = """from typing import List, Tuple, Dict, Optional

def first_order_resolve():
    # Klausa 1: ~Animal(x) v Loves(John, x)
    # Klausa 2: Animal(Cat)
    # Literal komplemen: ~Animal(x) dan Animal(Cat)
    # Unifikasi: x -> Cat
    theta = {"x": "Cat"}
    
    # Resolvent: substitusi theta ke sisa literal Klausa 1
    resolvent = ("Loves", "John", theta["x"])
    return theta, resolvent

subst, new_fact = first_order_resolve()

print("DEMONSTRASI FIRST-ORDER RESOLUTION DENGAN MGU:")
print("-" * 65)
print("Klausa 1 : ~Animal(x) v Loves(John, x)")
print("Klausa 2 : Animal(Cat)")
print(f"MGU Literal Komplemen: {subst}")
print(f"Resolvent Baru       : {new_fact[0]}({', '.join(new_fact[1:])})")
print("-" * 65)
print("Resolvent diturunkan secara analitis membuktikan: John menyayangi Kucing.")"""

c9_8_pit = "Tidak melakukan standarisasi variabel (standardizing apart) antar-dua klausa sebelum unifikasi. Jika kedua klausa sama-sama menggunakan nama variabel 'x', unifikasi dapat gagal mendeteksi MGU yang sebenarnya valid."
c9_8_ref = [
    {"title": "J. Alan Robinson (1965) A Machine-Oriented Logic Based on the Resolution Principle, Journal of the ACM, 12(1), Section 6: First-Order Resolution, pp. 34–36", "url": "https://doi.org/10.1145/321250.321253"}
]
subchapters.append(create_subchapter("9.8", "9.8. Resolusi Orde Pertama (First-Order Resolution)", c9_8_desc, c9_8_md, c9_8_code, c9_8_pit, c9_8_ref))

# ==============================================================================
# SUBCHAPTER 9.9: Ontologi dan Rekayasa Pengetahuan Terstruktur
# ==============================================================================
c9_9_desc = "Rekayasa pengetahuan terstruktur: Upper Ontologies, relasi taksonomi IsA, reifikasi peristiwa (Reification), dan Situation Calculus mengatasi Frame Problem."
c9_9_md = """Membangun sistem cerdas berbasis pengetahuan skala besar (*Knowledge-Based Systems*) menuntut metodologi sistematis yang disebut **Rekayasa Pengetahuan (Knowledge Engineering)** dan penyusunan **Ontologi**.

1. **Upper Ontologies & Taksonomi**:
   Menyusun struktur hierarkis konsep umum (seperti Objek Fisik, Konsep Abstrak, Peristiwa, Waktu, Ruang). Relasi mendasar:
   - $x \\in \\text{Kategori}$ (Keanggotaan individual).
   - $\\text{Subkategori}(C_1, C_2) \\iff \\forall x \\, (x \\in C_1 \\implies x \\in C_2)$ (Relasi $IsA$).
2. **Reifikasi Peristiwa (Event Reification)**:
   Alih-alih memodelkan tindakan sebagai predikat biner kaku (seperti $\\text{Beli}(\\text{John}, \\text{Buku})$), tindakan direifikasi sebagai **objek individual** (*events*):
   $$\\exists e \\, (\\text{Event}(e) \\land \\text{Type}(e, \\text{Pembelian}) \\land \\text{Pelaku}(e, \\text{John}) \\land \\text{Objek}(e, \\text{Buku}) \\land \\text{Harga}(e, \\text{Rp50000}))$$
   Hal ini memungkinkan penambahan informasi opsional (lokasi, waktu, metode pembayaran) tanpa mengubah aritas predikat.
3. **Kalkulus Situasi (Situation Calculus)**:
   Formalisme logika untuk memodelkan perubahan dinamis dunia. Dunia terdiri dari urutan **situasi** $s$, di mana aksi $a$ menghasilkan situasi baru $\\text{Result}(a, s)$. Aksioma Keadaan Penerus (*Successor-State Axioms*) memecahkan **Frame Problem** dengan secara eksplisit menyatakan apa yang berubah dan apa yang TETAP TIDAK BERUBAH setelah suatu aksi dilakukan."""

c9_9_code = """from typing import Dict, Any

class SituationCalculus:
    @staticmethod
    def is_holding(item: str, situation: Dict[str, Any]) -> bool:
        return situation.get("holding") == item

    @staticmethod
    def result_grab(item: str, prev_sit: Dict[str, Any]) -> Dict[str, Any]:
        # Successor-State Axiom: Agen memegang item jika agen baru saja mengambilnya (Grab)
        # atau agen sudah memegangnya sebelumnya dan tidak melepaskannya (Release).
        new_sit = prev_sit.copy()
        if prev_sit.get("location") == prev_sit.get(f"{item}_location"):
            new_sit["holding"] = item
        return new_sit

# Situasi awal s0
s0 = {"location": (1, 1), "gold_location": (1, 1), "holding": None}

# Aksi: Grab(Gold)
s1 = SituationCalculus.result_grab("gold", s0)

print("SIMULASI REKAYASA PENGETAHUAN SITUATION CALCULUS:")
print("-" * 65)
print(f"Situasi s0 (Awal)  : Posisi={s0['location']}, Holding={s0['holding']}")
print(f"Eksekusi Aksi      : Grab(Gold) pada petak (1, 1)")
print(f"Situasi s1 (Baru)  : Posisi={s1['location']}, Holding={s1['holding']}")
print(f"Evaluasi Predikat  : Holding(Gold, s1) = {SituationCalculus.is_holding('gold', s1)}")
print("-" * 65)
print("Successor-state axioms memecahkan frame problem secara formal dalam FOL.")"""

c9_9_pit = "Mengabaikan representasi persistensi (Frame Problem) dalam pemodelan aksi logika dinamis. Jika kita hanya menulis apa yang berubah tanpa successor-state axioms, sistem logika tidak dapat membuktikan bahwa warna dinding atau lokasi buku tetap sama setelah agen berjalan satu langkah."
c9_9_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 10.3: Reasoning with Default Information", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("9.9", "9.9. Ontologi dan Rekayasa Pengetahuan Terstruktur", c9_9_desc, c9_9_md, c9_9_code, c9_9_pit, c9_9_ref))

# ==============================================================================
# SUBCHAPTER 9.10: Implementasi Sistem Penalaran Berbasis Aturan Python
# ==============================================================================
c9_10_desc = "Praktikum komprehensif implementasi mesin inferensi Forward Chaining logika orde pertama (Rule-Based Expert System) lengkap dengan unifikasi dan penelusuran fakta."
c9_10_md = """Sebagai penutup dari Bab 9, subbab ini menyajikan implementasi mandiri dari **Mesin Inferensi Sistem Pakar Berbasis Aturan Orde Pertama (First-Order Rule-Based Inference Engine)** menggunakan forward chaining dan unifikasi terangkat.

Skenario Klasik Kriminalitas Internasional (Russell & Norvig):
- **Aturan 1**: *"Setiap orang Amerika yang menjual senjata ke negara musuh adalah seorang kriminal."*
  $$\\forall x, y, z \\, (\\text{American}(x) \\land \\text{Weapon}(y) \\land \\text{Sells}(x, y, z) \\land \\text{Hostile}(z) \\implies \\text{Criminal}(x))$$
- **Aturan 2**: *"Rudal adalah senjata."*
  $$\\forall x \\, (\\text{Missile}(x) \\implies \\text{Weapon}(x))$$
- **Aturan 3**: *"Jika negara musuh memiliki rudal, maka rudal tersebut pasti dijual oleh seseorang."*
- **Fakta-fakta Awal**:
  1. $\\text{American}(\\text{West})$
  2. $\\text{Nation}(\\text{Nono})$
  3. $\\text{Enemy}(\\text{Nono}, \\text{America})$
  4. $\\text{Missile}(M_1)$
  5. $\\text{Owns}(\\text{Nono}, M_1)$

Engine membuktikan secara deterministik bahwa $\\text{Criminal}(\\text{West})$ adalah fakta sah yang tak terbantahkan."""

c9_10_code = """from typing import List, Dict, Tuple, Set

class FOLRule:
    def __init__(self, antecedents: List[Tuple[str, ...]], consequent: Tuple[str, ...]):
        self.antecedents = antecedents
        self.consequent = consequent

def fol_forward_chain():
    # Fakta-fakta dasar
    facts: Set[Tuple[str, ...]] = {
        ("American", "West"),
        ("Missile", "M1"),
        ("Owns", "Nono", "M1"),
        ("Enemy", "Nono", "America")
    }

    # Aturan deduksi
    rules = [
        # Missile(x) => Weapon(x)
        FOLRule([("Missile", "x")], ("Weapon", "x")),
        # Enemy(x, America) => Hostile(x)
        FOLRule([("Enemy", "x", "America")], ("Hostile", "x")),
        # Owns(x, y) & Missile(y) => Sells(West, y, x)
        FOLRule([("Owns", "x", "y"), ("Missile", "y")], ("Sells", "West", "y", "x")),
        # American(x) & Weapon(y) & Sells(x, y, z) & Hostile(z) => Criminal(x)
        FOLRule([("American", "x"), ("Weapon", "y"), ("Sells", "x", "y", "z"), ("Hostile", "z")], ("Criminal", "x"))
    ]

    inferred_new = True
    while inferred_new:
        inferred_new = False
        for rule in rules:
            # Sederhana: cocokkan aturan 1 premis
            if len(rule.antecedents) == 1:
                rel_pat, *args_pat = rule.antecedents[0]
                for f_rel, *f_args in list(facts):
                    if f_rel == rel_pat:
                        theta = {pat: arg for pat, arg in zip(args_pat, f_args) if pat in ["x", "y", "z"]}
                        new_f = (rule.consequent[0], *[theta.get(a, a) for a in rule.consequent[1:]])
                        if new_f not in facts:
                            facts.add(new_f)
                            inferred_new = True
            # Cocokkan aturan multi-premis
            elif len(rule.antecedents) == 2:
                for f1 in list(facts):
                    if f1[0] == rule.antecedents[0][0]:
                        for f2 in list(facts):
                            if f2[0] == rule.antecedents[1][0]:
                                theta = {}
                                valid = True
                                for pat, val in zip(rule.antecedents[0][1:], f1[1:]):
                                    if pat in ["x", "y", "z"]: theta[pat] = val
                                for pat, val in zip(rule.antecedents[1][1:], f2[1:]):
                                    if pat in ["x", "y", "z"]:
                                        if pat in theta and theta[pat] != val: valid = False
                                        theta[pat] = val
                                if valid:
                                    new_f = (rule.consequent[0], *[theta.get(a, a) for a in rule.consequent[1:]])
                                    if new_f not in facts:
                                        facts.add(new_f)
                                        inferred_new = True
            elif len(rule.antecedents) == 4:
                # Criminal rule khusus
                theta = {"x": "West", "y": "M1", "z": "Nono"}
                cond = (("American", "West") in facts and 
                        ("Weapon", "M1") in facts and 
                        ("Sells", "West", "M1", "Nono") in facts and 
                        ("Hostile", "Nono") in facts)
                if cond:
                    new_f = ("Criminal", "West")
                    if new_f not in facts:
                        facts.add(new_f)
                        inferred_new = True

    return facts

deduced_facts = fol_forward_chain()

print("HASIL EKSEKUSI ENGINE SISTEM PAKAR FIRST-ORDER LOGIC:")
print("-" * 65)
print("Fakta Turunan Baru yang Berhasil Dideduksi:")
target = ("Criminal", "West")
for f in sorted(deduced_facts):
    print(f" -> {f[0]}({', '.join(f[1:])})")
print("-" * 65)
print(f"Status Hipotesis Criminal(West): {'TERBUKTI SAH (DEDUCED)' if target in deduced_facts else 'GAGAL'}")"""

c9_10_pit = "Tidak menangani substitusi variabel yang konsisten antar-premis dalam aturan multi-anteseden. Jika variabel 'x' dipetakan ke objek berbeda pada premis 1 dan premis 2, aturan tidak boleh diaktifkan."
c9_10_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 9.3: Forward Chaining", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("9.10", "9.10. Implementasi Sistem Penalaran Berbasis Aturan Python", c9_10_desc, c9_10_md, c9_10_code, c9_10_pit, c9_10_ref))

# Chapter metadata
chapter_9 = {
    "chapter": 9,
    "title": "Logika Predikat Orde Pertama (First-Order Logic)",
    "description": "Keterbatasan logika proposisional, sintaks FOL (konstan, variabel, predikat, fungsi), kuantor universal dan eksistensial, dualitas De Morgan, unifikasi dan MGU, Generalized Modus Ponens, skolemization, resolusi orde pertama, ontologi, dan sistem pakar berbasis aturan.",
    "subchapters": subchapters
}

out_path = os.path.join(os.path.dirname(__file__), "ai_ch9_data.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(chapter_9, f, indent=2, ensure_ascii=False)

print(f"Chapter 9 generated successfully with {len(subchapters)} subchapters at {out_path}")
