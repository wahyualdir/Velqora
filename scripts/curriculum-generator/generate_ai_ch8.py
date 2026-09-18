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
# SUBCHAPTER 8.1: Sintaks dan Semantik Logika Proposisional
# ==============================================================================
c8_1_desc = "Definisi sintaksis formal tata bahasa BNF logika proposisional, semantik tabel kebenaran penghubung logis, dan evaluasi nilai kebenaran kalimat komposit."
c8_1_md = """Logika Proposisional (sering disebut *Boolean Logic*) adalah sistem formal representasi pengetahuan paling mendasar dalam kecerdasan buatan. Sistem ini memungkinkan agen cerdas merepresentasikan fakta tentang dunia dan menarik kesimpulan baru yang tak terbantahkan secara matematis.

**1. Sintaksis Formal (BNF Grammar)**:
Sintaksis mendefinisikan kalimat-kalimat legal (*well-formed formulas* / WFF) dalam bahasa:
- **Simbol Proposisi (Atomic Sentences)**: Simbol individual yang merepresentasikan proposisi fakta, biasanya dilambangkan dengan huruf kapital ($P, Q, R, \\dots$) atau nama bermakna (misal: $\\text{Hujan}, \\text{Basah}$).
- **Penghubung Logika (Logical Connectives)** yang mengonstruksi kalimat kompleks (*complex sentences*):
  1. Negasi ($\\neg P$): 'bukan $P$' (*NOT*).
  2. Konjungsi ($P \\land Q$): '$P$ dan $Q$' (*AND*), elemennya disebut konjungsi.
  3. Disjungsi ($P \\lor Q$): '$P$ atau $Q$' (*OR*), elemennya disebut disjungsi.
  4. Implikasi ($P \\implies Q$): 'jika $P$ maka $Q$' (*IF-THEN*). $P$ adalah anteseden (*premise*), $Q$ adalah konsekuen (*conclusion*).
  5. Bikondisional ($P \\iff Q$): '$P$ jika dan hanya jika $Q$' (*IFF*).

**2. Semantik Formal**:
Semantik mendefinisikan arti kalimat berdasarkan kebenaran objektif dalam suatu **model** (penetapan nilai $\\{\\text{True}, \\text{False}\\}$ untuk setiap simbol proposisi). Nilai kebenaran kalimat komposit dihitung secara rekursif:
- Implikasi $P \\implies Q$ bernilai $\\text{False}$ **hanya jika** $P = \\text{True}$ dan $Q = \\text{False}$. Jika anteseden $P = \\text{False}$, kalimat implikasi selalu bernilai $\\text{True}$ secara trivial (*vacuously true*)."""

c8_1_code = """from typing import Dict, Any

class Expr:
    pass

class Symbol(Expr):
    def __init__(self, name: str):
        self.name = name
    def evaluate(self, model: Dict[str, bool]) -> bool:
        return model[self.name]

class Not(Expr):
    def __init__(self, op: Expr):
        self.op = op
    def evaluate(self, model: Dict[str, bool]) -> bool:
        return not self.op.evaluate(model)

class And(Expr):
    def __init__(self, left: Expr, right: Expr):
        self.left, self.right = left, right
    def evaluate(self, model: Dict[str, bool]) -> bool:
        return self.left.evaluate(model) and self.right.evaluate(model)

class Implies(Expr):
    def __init__(self, ante: Expr, conseq: Expr):
        self.ante, self.conseq = ante, conseq
    def evaluate(self, model: Dict[str, bool]) -> bool:
        # P => Q ekuivalen dengan (not P) or Q
        return (not self.ante.evaluate(model)) or self.conseq.evaluate(model)

# Kalimat: (Hujan => Basah) and Hujan
hujan = Symbol("Hujan")
basah = Symbol("Basah")
kb_sentence = And(Implies(hujan, basah), hujan)

models = [
    {"Hujan": True, "Basah": True},
    {"Hujan": True, "Basah": False},
    {"Hujan": False, "Basah": True},
    {"Hujan": False, "Basah": False}
]

print("EVALUASI SEMANTIK LOGIKA PROPOSISIONAL PADA MODEL DUNIA:")
print("-" * 65)
print(f"{'Model (Penetapan Nilai)':<35} | {'(Hujan => Basah) & Hujan':<25}")
print("-" * 65)
for m in models:
    val = kb_sentence.evaluate(m)
    m_str = f"Hujan={m['Hujan']!s:<5}, Basah={m['Basah']!s:<5}"
    print(f"{m_str:<35} | {val!s:<25}")
print("-" * 65)
print("Hanya model {Hujan: True, Basah: True} yang memuaskan seluruh kalimat.")"""

c8_1_pit = "Menganggap implikasi logika formal identik dengan sebab-akibat (kausalitas waktu). Dalam logika formal, implikasi P => Q murni merupakan fungsi kebenaran matematis: pernyataan 'Jika 2+2=5 maka Bulan terbuat dari keju' bernilai Benar (True) karena premisnya Salah."
c8_1_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 7.4: Propositional Logic", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("8.1", "8.1. Sintaks dan Semantik Logika Proposisional", c8_1_desc, c8_1_md, c8_1_code, c8_1_pit, c8_1_ref))

# ==============================================================================
# SUBCHAPTER 8.2: Model, Entailment, dan Validitas
# ==============================================================================
c8_2_desc = "Konsep relasi keterikatan logis (Entailment alpha |= beta), himpunan model M(alpha), validitas tautologi, dan satisfiabilitas (SAT)."
c8_2_md = """Hubungan inferensi paling sentral dalam logika adalah **Entailment (Keterikatan Logis)**, yang dilambangkan dengan simbol:

$$\\alpha \\models \\beta$$

Dibaca: *"$\\alpha$ meng-entail $\\beta$*" atau *"dari kalimat $\\alpha$ secara logis diturunkan kalimat $\\beta$*".

**Definisi Berbasis Model (Model-Theoretic Definition)**:
Misalkan $M(\\alpha)$ merepresentasikan himpunan seluruh model di mana kalimat $\\alpha$ bernilai $\\text{True}$. Hubungan entailment dirumuskan secara eksak sebagai relasi himpunan bagian (*subset*):

$$\\alpha \\models \\beta \\iff M(\\alpha) \\subseteq M(\\beta)$$

Artinya: dalam **setiap** kemungkinan dunia (model) di mana $\\alpha$ bernilai benar, kalimat $\\beta$ **pasti** bernilai benar pula. Kalimat $\\beta$ tidak dapat bernilai salah jika $\\alpha$ benar.

Konsep Turunan:
1. **Validitas (Tautologi)**: Kalimat $\\alpha$ dikatakan valid jika bernilai $\\text{True}$ di *seluruh* kemungkinan model (misal: $P \\lor \\neg P$). Teorema Deduksi: $\\alpha \\models \\beta \\iff (\\alpha \\implies \\beta)$ adalah valid.
2. **Satisfiabilitas (Satisfiable / SAT)**: Kalimat $\\alpha$ dikatakan satisfiable jika terdapat *setidaknya satu* model di mana $\\alpha$ bernilai $\\text{True}$.
3. **Koneksi Kontradiksi**: $\\alpha \\models \\beta \\iff (\\alpha \\land \\neg \\beta)$ bersifat **Unsatisfiable** (tidak dapat dipuaskan / kontradiksi). Properti ini merupakan landasan matematis dari pembuktian kontradiksi (*proof by refutation*)."""

c8_2_code = """import itertools

def check_entailment(kb_fn, query_fn, symbols):
    # Enumerate seluruh 2^n kemungkinan model
    models = []
    for p in itertools.product([False, True], repeat=len(symbols)):
        models.append(dict(zip(symbols, p)))

    m_kb = []
    m_query = []
    entails = True

    for m in models:
        kb_val = kb_fn(m)
        q_val = query_fn(m)
        if kb_val:
            m_kb.append(m)
            if not q_val:
                entails = False
        if q_val:
            m_query.append(m)

    return entails, len(m_kb), len(m_query), len(models)

# Uji: KB = (P => Q) dan P. Query = Q (Modus Ponens)
symbols = ['P', 'Q']
kb = lambda m: (not m['P'] or m['Q']) and m['P']
query = lambda m: m['Q']

is_entailed, count_kb, count_q, total_m = check_entailment(kb, query, symbols)

print("PEMBUKTIAN FORMAL ENTAILMENT (KB |= QUERY):")
print("-" * 60)
print(f"Total Model Ruang Keadaan : {total_m} model (2^{len(symbols)})")
print(f"Jumlah Model M(KB)         : {count_kb} model")
print(f"Jumlah Model M(Query)      : {count_q} model")
print(f"Apakah M(KB) subset M(Q)?  : {is_entailed}")
print(f"Kesimpulan Logis           : {'KB |= Q (VALID ENTAILMENT)' if is_entailed else 'TIDAK ENTAIL'}")
print("-" * 60)
print("Setiap dunia di mana premis benar, kesimpulan pasti benar.")"""

c8_2_pit = "Menyamakan keterikatan logis (entailment |=) dengan inferensi algoritmik (derivation |-). Entailment adalah relasi kebenaran semantik antara kalimat dan model, sedangkan derivasi adalah proses mekanis manipulasi simbolik oleh algoritma pembuktian."
c8_2_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 7.3: Logic and Entailment", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("8.2", "8.2. Model, Entailment, dan Validitas", c8_2_desc, c8_2_md, c8_2_code, c8_2_pit, c8_2_ref))

# ==============================================================================
# SUBCHAPTER 8.3: Inferensi Menggunakan Tabel Kebenaran (TT-Entails)
# ==============================================================================
c8_3_desc = "Algoritma enumerasi tabel kebenaran TT-Entails, eksplorasi 2^n model secara rekursif, kelengkapan (completeness), dan keterbatasan kompleksitas O(2^n)."
c8_3_md = """Algoritma inferensi paling sederhana dan fundamental untuk logika proposisional adalah **TT-Entails (Truth-Table Entailment)**. Algoritma ini memverifikasi entailment $KB \\models \\alpha$ secara langsung sesuai definisi semantik model:

**Algoritma TT-Entails**:
1. Ekstrak seluruh simbol proposisi yang muncul di $KB$ dan query $\\alpha$: $S = \\text{Symbols}(KB) \\cup \\text{Symbols}(\\alpha)$.
2. Jalankan fungsi rekursif `TT-Check-All(KB, alpha, symbols, model)`:
   - **Kasus Basis**: Jika himpunan simbol $S$ kosong (seluruh simbol telah diberi nilai Boolean dalam `model`):
     - Jika $KB$ bernilai $\\text{True}$ dalam `model`, maka kembalikan nilai kebenaran dari $\\alpha$ dalam `model`.
     - Jika $KB$ bernilai $\\text{False}$, kembalikan $\\text{True}$ (karena model ini bukan anggota $M(KB)$, sehingga tidak melanggar syarat subset).
   - **Kasus Rekursif**: Ambil simbol pertama $P$ dari $S$:
     - Uji cabang pertama dengan penugasan $\\text{model} \\cup \\{P = \\text{True}\\}$.
     - Uji cabang kedua dengan penugasan $\\text{model} \\cup \\{P = \\text{False}\\}$.
     - Kembalikan $\\text{True}$ jika dan hanya jika **kedua cabang bernilai True**.

**Analisis Formal**:
- **Soundness (Kebenaran)**: 100% sound. Jika algoritma mengembalikan $\\text{True}$, maka $KB \\models \\alpha$ pasti valid.
- **Completeness (Kelengkapan)**: 100% complete. Jika $KB \\models \\alpha$ benar, algoritma dijamin akan menemukannya.
- **Kompleksitas Waktu**: $\\mathcal{O}(2^n)$, di mana $n$ adalah jumlah simbol proposisi.
- **Kompleksitas Ruang**: $\\mathcal{O}(n)$, karena penelusuran dilakukan secara DFS."""

c8_3_code = """from typing import List, Dict, Callable

def tt_entails(kb_fn: Callable[[Dict[str, bool]], bool], alpha_fn: Callable[[Dict[str, bool]], bool], symbols: List[str]) -> bool:
    def tt_check_all(kb, alpha, syms, model):
        if not syms:
            if kb(model):
                return alpha(model)
            else:
                return True  # Model di mana KB False diabaikan
        else:
            p = syms[0]
            rest = syms[1:]
            # Uji cabang p=True dan p=False
            model_true = {**model, p: True}
            model_false = {**model, p: False}
            return (tt_check_all(kb, alpha, rest, model_true) and 
                    tt_check_all(kb, alpha, rest, model_false))

    return tt_check_all(kb_fn, alpha_fn, symbols, {})

# KB: (A => B) dan (B => C) dan A. Apakah KB |= C? (Silogisme Hipotetis)
symbols_list = ['A', 'B', 'C']
kb_rule = lambda m: ((not m['A'] or m['B']) and 
                     (not m['B'] or m['C']) and 
                     m['A'])
query_rule = lambda m: m['C']

result = tt_entails(kb_rule, query_rule, symbols_list)

print("HASIL EKSEKUSI ALGORITMA TT-ENTAILS REKURSIF:")
print("-" * 60)
print("Premis KB: A => B, B => C, A (Fakta)")
print("Query    : C")
print(f"Hasil Inferensi TT-Entails: {result}")
print("-" * 60)
print("TT-Entails membuktikan bahwa C pasti benar di seluruh model di mana KB benar.")"""

c8_3_pit = "Mencoba menggunakan TT-Entails pada basis pengetahuan skala industri dengan ratusan simbol proposisi. Kompleksitas 2^n membuat algoritma ini membeku jika n > 30 (2^30 > 1 miliar iterasi)."
c8_3_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 7.4.4: A Simple Inference Procedure", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("8.3", "8.3. Inferensi Menggunakan Tabel Kebenaran (TT-Entails)", c8_3_desc, c8_3_md, c8_3_code, c8_3_pit, c8_3_ref))

# ==============================================================================
# SUBCHAPTER 8.4: Bentuk Normal Konjungtif (CNF)
# ==============================================================================
c8_4_desc = "Struktur kanonikal Bentuk Normal Konjungtif (Conjunctive Normal Form - CNF): literal, klausa disjungsi, konjungsi klausa, dan representasi struktur data."
c8_4_md = """Untuk menerapkan algoritma inferensi yang jauh lebih cepat dan terukur daripada enumerasi tabel kebenaran (seperti Algoritma Resolusi dan DPLL SAT Solver), seluruh kalimat proposisi arbitrer harus ditransformasikan ke dalam format standar: **Bentuk Normal Konjungtif (Conjunctive Normal Form - CNF)**.

Hierarki struktur CNF:
1. **Literal**: Simbol proposisi tunggal positif ($P$) atau simbol proposisi bernegasi ($\\neg P$). Jika literal bernilai negatif, ia melambangkan penyangkalan atom.
2. **Klausa (Clause)**: **Disjungsi (OR)** dari sekumpulan literal:
   $$C_i = (l_1 \\lor l_2 \\lor \\dots \\lor l_k)$$
   Sebuah klausa bernilai $\\text{True}$ jika setidaknya satu literal di dalamnya bernilai $\\text{True}$. Klausa dengan 0 literal disebut **Klausa Kosong (Empty Clause / $\\Box$)**, yang secara definisi selalu bernilai $\\text{False}$ (kontradiksi mutlak).
3. **Kalimat CNF**: **Konjungsi (AND)** dari sekumpulan klausa:
   $$\\text{CNF} = \\bigwedge_{i=1}^m C_i = C_1 \\land C_2 \\land \\dots \\land C_m$$

**Representasi Struktur Data**:
Dalam rekayasa kecerdasan buatan, kalimat CNF direpresentasikan secara efisien sebagai **Himpunan dari Himpunan (Set of Sets)**:
$$\\text{KB} = \\{ \\{l_{11}, l_{12}\\}, \\{l_{21}, l_{22}, l_{23}\\}, \\dots \\}$$
Representasi set secara otomatis mengeliminasi literal duplikat di dalam klausa ($(P \\lor P) \\equiv P$) dan mengabaikan urutan konjungsi serta disjungsi karena sifat komutatif dan asosiatif logika."""

c8_4_code = """from typing import Set, FrozenSet

# Representasi klausa CNF menggunakan frozenset of strings
# 'P' merepresentasikan literal positif, '~P' merepresentasikan literal negatif
Clause = FrozenSet[str]
CNF_KB = Set[Clause]

def print_cnf(kb: CNF_KB):
    clause_strs = []
    for c in kb:
        if len(c) == 0:
            clause_strs.append("[] (Empty Clause / Contradiction)")
        else:
            clause_strs.append("(" + " v ".join(sorted(c)) + ")")
    return " ^ ".join(clause_strs)

# Contoh KB dalam bentuk CNF: (A v B) ^ (~B v C) ^ (~A)
kb_example: CNF_KB = {
    frozenset({'A', 'B'}),
    frozenset({'~B', 'C'}),
    frozenset({'~A'})
}

print("REPRESENTASI STRUKTUR DATA BENTUK NORMAL KONJUNGTIF (CNF):")
print("-" * 65)
print(f"Format Formula Logika: {print_cnf(kb_example)}")
print(f"Representasi Python Set-of-Sets:")
for idx, cl in enumerate(kb_example, 1):
    print(f" - Klausa {idx}: {set(cl)}")
print("-" * 65)
print("Struktur set-of-sets memfasilitasi operasi pemangkasan resolusi berkecepatan tinggi.")"""

c8_4_pit = "Membiarkan tautologi internal seperti (P v ~P) tetap berada dalam basis pengetahuan CNF. Klausa yang memuat sepasang literal komplementer selalu bernilai True independen dari model apa pun, dan harus segera dieliminasi karena tidak memberikan batasan informasi logis."
c8_4_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 7.5.2: Conjunctive Normal Form", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("8.4", "8.4. Bentuk Normal Konjungtif (CNF)", c8_4_desc, c8_4_md, c8_4_code, c8_4_pit, c8_4_ref))

# ==============================================================================
# SUBCHAPTER 8.5: Konversi Kalimat Arbitrer Menuju Format CNF
# ==============================================================================
c8_5_desc = "Prosedur mekanis 5-langkah konversi kalimat logika proposisional sembarang menjadi CNF: eliminasi bikondisional, implikasi, hukum De Morgan, dan distributivitas."
c8_5_md = """Setiap kalimat logika proposisional dapat ditransformasikan secara ekuivalen ke dalam bentuk CNF melalui **Prosedur Mekanis 5-Langkah**:

1. **Langkah 1: Eliminasi Bikondisional ($\\iff$)**
   Gantikan setiap sub-kalimat $\\alpha \\iff \\beta$ dengan dua implikasi konjungtif:
   $$(\\alpha \\iff \\beta) \\implies (\\alpha \\implies \\beta) \\land (\\beta \\implies \\alpha)$$
2. **Langkah 2: Eliminasi Implikasi ($\\implies$)**
   Gantikan setiap $\\alpha \\implies \\beta$ dengan disjungsi ekuivalen:
   $$(\\alpha \\implies \\beta) \\implies (\\neg \\alpha \\lor \\beta)$$
3. **Langkah 3: Pindahkan Negasi ke Dalam (Hukum De Morgan & Eliminasi Negasi Ganda)**
   Dorong operator $\\neg$ ke tingkat literal atomik:
   - $\\neg(\\neg \\alpha) \\equiv \\alpha$
   - $\\neg(\\alpha \\land \\beta) \\equiv (\\neg \\alpha \\lor \\neg \\beta)$ (De Morgan)
   - $\\neg(\\alpha \\lor \\beta) \\equiv (\\neg \\alpha \\land \\neg \\beta)$ (De Morgan)
4. **Langkah 4: Distribusikan $\\lor$ Terhadap $\\land$ (Distributivitas OR over AND)**
   Gunakan hukum distributif agar operator $\\land$ menjadi penghubung terluar dan $\\lor$ berada di dalam tanda kurung:
   $$\\alpha \\lor (\\beta \\land \\gamma) \\equiv (\\alpha \\lor \\beta) \\land (\\alpha \\lor \\gamma)$$
5. **Langkah 5: Pecah Menjadi Himpunan Klausa Murni**
   Pisahkan konjungsi terluar menjadi elemen-elemen klausa terpisah dalam himpunan basis pengetahuan."""

c8_5_code = """# Demonstrasi konversi bertahap: P <=> (Q v R)
# Langkah 1: Eliminasi <=>
# (P => (Q v R)) ^ ((Q v R) => P)
step1 = "(P => (Q v R)) ^ ((Q v R) => P)"

# Langkah 2: Eliminasi =>
# (~P v Q v R) ^ (~(Q v R) v P)
step2 = "(~P v Q v R) ^ (~(Q v R) v P)"

# Langkah 3: Dorong negasi ke dalam (De Morgan)
# (~P v Q v R) ^ ((~Q ^ ~R) v P)
step3 = "(~P v Q v R) ^ ((~Q ^ ~R) v P)"

# Langkah 4: Distribusikan v terhadap ^
# (~P v Q v R) ^ (~Q v P) ^ (~R v P)
step4 = "(~P v Q v R) ^ (~Q v P) ^ (~R v P)"

# Langkah 5: Himpunan klausa final
clauses = [
    {"~P", "Q", "R"},
    {"~Q", "P"},
    {"~R", "P"}
]

print("TRANSFORMASI 5-LANGKAH KALIMAT LOGIKA MENUJU CNF:")
print("-" * 65)
print(f"Kalimat Awal : P <=> (Q v R)")
print(f"Langkah 1    : {step1}")
print(f"Langkah 2    : {step2}")
print(f"Langkah 3    : {step3}")
print(f"Langkah 4    : {step4}")
print("-" * 65)
print("Himpunan Klausa Final (Set-of-Clauses):")
for idx, c in enumerate(clauses, 1):
    print(f" - Klausa {idx}: {c}")
print("-" * 65)
print("Transformasi menghasilkan representasi standar yang siap untuk mesin resolusi.")"""

c8_5_pit = "Distributivitas berulang pada kalimat disjungsi panjang tanpa faktorisasi dapat memicu ledakan ukuran formula eksponensial (misal: (A1 ^ B1) v (A2 ^ B2) v ...). Untuk formula sangat besar, sering digunakan teknik Tseitin Transformation yang menambahkan variabel proposisi perantara."
c8_5_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 7.5.2: Conjunctive Normal Form", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("8.5", "8.5. Konversi Kalimat Arbitrer Menuju Format CNF", c8_5_desc, c8_5_md, c8_5_code, c8_5_pit, c8_5_ref))

# ==============================================================================
# SUBCHAPTER 8.6: Prinsip Inferensi Resolusi Propositional
# ==============================================================================
c8_6_desc = "Prinsip Inferensi Resolusi (J. Alan Robinson 1965): pasangan literal komplementer, resolvent, dan soundness aturan penarikan kesimpulan tunggal."
c8_6_md = """Pada tahun 1965, John Alan Robinson mempublikasikan makalah monumental *A Machine-Oriented Logic Based on the Resolution Principle* yang merevolusi penalaran otomatis (*automated theorem proving*). Robinson memperkenalkan aturan inferensi tunggal yang elegan, efisien secara mekanis, dan terbukti sound: **Aturan Resolusi (The Resolution Rule)**.

**Formulasi Aturan Resolusi Proposisional**:
Diberikan dua klausa yang memuat **sepasang literal komplementer** (satu bernilai positif $P$, dan yang lain bernilai negatif $\\neg P$):

$$\\frac{l_1 \\lor \\dots \\lor l_i \\lor \\dots \\lor l_k, \\quad m_1 \\lor \\dots \\lor \\neg l_i \\lor \\dots \\lor m_p}{(l_1 \\lor \\dots \\lor l_{i-1} \\lor l_{i+1} \\lor \\dots \\lor l_k) \\lor (m_1 \\lor \\dots \\lor m_p)}$$

Klausa baru yang dihasilkan disebut **resolvent**.

**Mekanisme Intuisi**:
Misalkan kita memiliki klausa $(P \\lor A)$ dan $(\\neg P \\lor B)$. Jika $P = \\text{True}$, maka agar klausa kedua bernilai benar, $B$ harus bernilai $\\text{True}$. Jika $P = \\text{False}$, maka agar klausa pertama bernilai benar, $A$ harus bernilai $\\text{True}$. Karena dalam setiap model $P$ pasti bernilai $\\text{True}$ atau $\\text{False}$, maka dalam model apa pun setidaknya salah satu dari $A$ atau $B$ harus bernilai $\\text{True}$. Oleh karena itu, kita dapat menarik kesimpulan yang sah: $(A \\lor B)$.

Kasus Khusus: Resolusi antara $P$ dan $\\neg P$ menghasilkan **Klausa Kosong ($\\Box$)**, yang melambangkan kontradiksi mutlak."""

c8_6_code = """from typing import FrozenSet, Set, Optional

def pl_resolve(c1: FrozenSet[str], c2: FrozenSet[str]) -> Set[FrozenSet[str]]:
    resolvents = set()
    for lit in c1:
        # Cari komplemen dari lit
        comp = lit[1:] if lit.startswith('~') else f"~{lit}"
        if comp in c2:
            # Bentuk resolvent: (c1 \ {lit}) U (c2 \ {comp})
            new_clause = (c1 - {lit}) | (c2 - {comp})
            resolvents.add(frozenset(new_clause))
    return resolvents

# Uji resolusi 1: (A v B) dengan (~B v C) -> Hasil: (A v C)
c1 = frozenset({'A', 'B'})
c2 = frozenset({'~B', 'C'})
res1 = pl_resolve(c1, c2)

# Uji resolusi 2: (P) dengan (~P) -> Hasil: [] (Klausa Kosong)
c3 = frozenset({'P'})
c4 = frozenset({'~P'})
res2 = pl_resolve(c3, c4)

print("HASIL EKSEKUSI PRINSIP RESOLUSI ROBINSON (1965):")
print("-" * 60)
print(f"Klausa 1 : {set(c1)} | Klausa 2 : {set(c2)}")
print(f"Resolvent: {[set(r) for r in res1]} -> Terbukti: (A v C)")
print("-" * 60)
print(f"Klausa 3 : {set(c3)} | Klausa 4 : {set(c4)}")
print(f"Resolvent: {[set(r) for r in res2]} -> Terbukti: Klausa Kosong (Kontradiksi!)")
print("-" * 60)
print("Aturan resolusi menjamin soundness penarikan kesimpulan secara mekanis.")"""

c8_6_pit = "Meresolusikan LEBIH DARI SATU pasang literal komplementer sekaligus dalam satu langkah. Misalnya meresolusikan (P v Q) dengan (~P v ~Q) menjadi klausa kosong. Resolusi hanya boleh mengeliminasi TEPAT SATU pasang literal per langkah (hasil yang benar adalah (P v ~P) atau (Q v ~Q), yang merupakan tautologi)."
c8_6_ref = [
    {"title": "J. Alan Robinson (1965) A Machine-Oriented Logic Based on the Resolution Principle, Journal of the ACM, 12(1), Section 2, pp. 23–41", "url": "https://doi.org/10.1145/321250.321253"}
]
subchapters.append(create_subchapter("8.6", "8.6. Prinsip Inferensi Resolusi Propositional", c8_6_desc, c8_6_md, c8_6_code, c8_6_pit, c8_6_ref))

# ==============================================================================
# SUBCHAPTER 8.7: Pembuktian Kontradiksi (Proof by Refutation)
# ==============================================================================
c8_7_desc = "Metodologi pembuktian kontradiksi (Proof by Refutation / Reductio ad Absurdum): negasi query, penambahan ke KB, dan derivasi klausa kosong."
c8_7_md = """Dalam logika komputasi, aturan resolusi tidak digunakan untuk menghasilkan seluruh kesimpulan acak yang mungkin diturunkan dari $KB$ (karena jumlah konsekuensi logis tak terbatas). Sebaliknya, resolusi dioperasikan dalam kerangka **Pembuktian Kontradiksi (Proof by Refutation / Reductio ad Absurdum)**.

**Teorema Refutasi**:
$$KB \\models \\alpha \\iff (KB \\land \\neg \\alpha) \\text{ bersifat kontradiktif (Unsatisfiable)}$$

Langkah-langkah Prosedur Refutasi:
1. Ambil query hipotesis yang ingin dibuktikan: $\\alpha$.
2. Bentuk negasinya: $\\neg \\alpha$.
3. Konversikan $\\neg \\alpha$ ke dalam bentuk klausa CNF.
4. Gabungkan klausa-klausa $\\neg \\alpha$ ke dalam basis pengetahuan:
   $$S = \\text{Clauses}(KB) \\cup \\text{Clauses}(\\neg \\alpha)$$
5. Terapkan aturan resolusi secara sistematis pada pasangan-pasangan klausa dalam $S$.
6. Jika proses penarikan kesimpulan berhasil menurunkan **Klausa Kosong ($\\Box$)**, maka terbukti bahwa asumsi $\\neg \\alpha$ mustahil benar bersama-sama dengan $KB$. Dengan demikian, query asli $\\alpha$ **terbukti sah secara deduktif** ($KB \\models \\alpha$)."""

c8_7_code = """from typing import Set, FrozenSet

def refute_step_by_step():
    # KB: P => Q (yaitu ~P v Q) dan P
    # Query yang ingin dibuktikan: Q
    # Langkah 1: Negasikan query -> ~Q
    kb_clauses = [
        frozenset({'~P', 'Q'}),  # C1
        frozenset({'P'})         # C2
    ]
    negated_query = frozenset({'~Q'})  # C3
    
    all_clauses = kb_clauses + [negated_query]
    
    print("LANGKAH PEMBUKTIAN KONTRADIKSI (PROOF BY REFUTATION):")
    print("-" * 65)
    print("Klausa Awal:")
    print(" (1) ~P v Q   [Dari aturan P => Q]")
    print(" (2) P        [Fakta premis]")
    print(" (3) ~Q       [Negasi dari query Q yang diasumsikan]")
    print("-" * 65)
    
    # Resolusi C1 dan C2 pada P dan ~P -> menghasilkan Q
    res_1_2 = frozenset({'Q'})
    print(f"Langkah 4: Resolusi (1) dan (2) menghasilkan -> (4) Q")
    
    # Resolusi (4) dengan (3) pada Q dan ~Q -> menghasilkan []
    res_4_3 = frozenset()
    print(f"Langkah 5: Resolusi (4) dan (3) menghasilkan -> (5) [] (KLAUSA KOSONG)")
    print("-" * 65)
    print("Kontradiksi mutlak tercapai! Asumsi ~Q tertolak secara formal.")
    print("Kesimpulan: Query Q terbukti sah secara deduktif (KB |= Q).")

refute_step_by_step()"""

c8_7_pit = "Lupa menegasikan query dan langsung mencoba meresolusikan KB dengan query asli. Resolusi refutasi mensyaratkan penambahan negasi query (~alpha), bukan query itu sendiri."
c8_7_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 7.5.2: Resolution", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("8.7", "8.7. Pembuktian Kontradiksi (Proof by Refutation)", c8_7_desc, c8_7_md, c8_7_code, c8_7_pit, c8_7_ref))

# ==============================================================================
# SUBCHAPTER 8.8: Algoritma PL-Resolution Lengkap
# ==============================================================================
c8_8_desc = "Algoritma PL-Resolution lengkap: loop saturasi klausa, jaminan terminasi (teorema kelengkapan refutasi Robinson), dan deteksi ekuivalensi resolvent."
c8_8_md = """Algoritma **PL-Resolution** adalah realisasi algoritmik lengkap dari pembuktian kontradiksi resolusi proposisional. Algoritma ini memiliki sifat yang sangat didambakan dalam ilmu komputer: **Refutation Completeness (Kelengkapan Refutasi)**. Robinson (1965) membuktikan bahwa jika sekumpulan klausa proposisional bersifat *unsatisfiable*, algoritma resolusi dijamin akan selalu mampu menurunkan klausa kosong dalam jumlah langkah berhingga.

**Struktur Algoritma PL-Resolution**:
```
function PL-Resolution(KB, alpha) returns true or false
  clauses <- himpunan klausa dalam CNF(KB ^ ~alpha)
  new <- himpunan kosong
  loop do
    for each pair of clauses C_i, C_j in clauses do
      resolvents <- PL-Resolve(C_i, C_j)
      if resolvents memuat klausa kosong then return true
      new <- new U resolvents
    if new adalah subset dari clauses then return false
    clauses <- clauses U new
```

**Jaminan Terminasi**:
Mengapa algoritma ini dijamin tidak akan mengalami *infinite loop*?
Karena himpunan simbol proposisi yang terlibat bersifat berhingga ($n$ simbol). Jumlah klausa unik yang mungkin dibentuk dari $n$ simbol literal maksimal adalah $3^n$ (karena setiap simbol dapat bernilai positif, negatif, atau tidak muncul dalam klausa). Karena ruang pembentukan klausa berhingga, penambahan klausa baru pada akhirnya harus berhenti (mencapai kondisi $\\text{new} \\subseteq \\text{clauses}$), menjamin terminasi deterministik."""

c8_8_code = """from typing import Set, FrozenSet

def pl_resolve(c1: FrozenSet[str], c2: FrozenSet[str]) -> Set[FrozenSet[str]]:
    resolvents = set()
    for lit in c1:
        comp = lit[1:] if lit.startswith('~') else f"~{lit}"
        if comp in c2:
            new_clause = (c1 - {lit}) | (c2 - {comp})
            resolvents.add(frozenset(new_clause))
    return resolvents

def pl_resolution(kb_clauses: Set[FrozenSet[str]], query_clauses: Set[FrozenSet[str]]) -> bool:
    clauses = set(kb_clauses) | set(query_clauses)
    iteration = 0
    while True:
        iteration += 1
        new_clauses = set()
        clause_list = list(clauses)
        n = len(clause_list)
        
        for i in range(n):
            for j in range(i + 1, n):
                res = pl_resolve(clause_list[i], clause_list[j])
                if frozenset() in res:
                    print(f"Klausa kosong ditemukan pada iterasi ke-{iteration}!")
                    return True  # Kontradiksi! Query terbukti
                new_clauses |= res

        if new_clauses.issubset(clauses):
            return False  # Tidak ada klausa baru, query tidak dapat dibuktikan
            
        clauses |= new_clauses

# KB: A => B (~A v B), B => C (~B v C), A
# Query: C -> Negasi: ~C
kb = {
    frozenset({'~A', 'B'}),
    frozenset({'~B', 'C'}),
    frozenset({'A'})
}
neg_query = {frozenset({'~C'})}

is_proven = pl_resolution(kb, neg_query)

print("EKSEKUSI LENGKAP ENGINE ALGORITMA PL-RESOLUTION:")
print("-" * 60)
print(f"Status Pembuktian Teorema: {'VALID (Q.E.D.)' if is_proven else 'INVALID'}")
print("-" * 60)
print("PL-Resolution menjamin terminasi berhingga dan kelengkapan refutasi mutlak.")"""

c8_8_pit = "Membuat loop resolusi tanpa pemeriksaan `new_clauses.issubset(clauses)`, yang dapat menyebabkan perulangan tak terbatas jika resolvent duplikat terus diproses ulang."
c8_8_ref = [
    {"title": "J. Alan Robinson (1965) A Machine-Oriented Logic Based on the Resolution Principle, Journal of the ACM, 12(1), Section 5: Soundness and Completeness, pp. 30–33", "url": "https://doi.org/10.1145/321250.321253"},
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 7.5.2: Resolution", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("8.8", "8.8. Algoritma PL-Resolution Lengkap", c8_8_desc, c8_8_md, c8_8_code, c8_8_pit, c8_8_ref))

# ==============================================================================
# SUBCHAPTER 8.9: Klausa Horn & Inferensi Maju/Mundur
# ==============================================================================
c8_9_desc = "Subkelas efisien Klausa Horn (Definite Clauses): inferensi linear O(n), algoritma Forward Chaining berbasis data, dan Backward Chaining berbasis tujuan."
c8_9_md = """Meskipun PL-Resolution bersifat lengkap, kompleksitas terburuknya tetap eksponensial. Namun, dalam banyak aplikasi praktis (seperti basis aturan sistem pakar, basis data deduktif, dan pemrograman logika Prolog), basis pengetahuan dapat dibatasi pada subkelas khusus: **Klausa Horn**.

**Definisi Klausa Horn**:
Klausa disjungsi yang memuat **paling banyak satu literal positif**:
1. **Definite Clause**: Klausa yang memiliki *tepat satu* literal positif:
   $$(\\neg P_1 \\lor \\neg P_2 \\lor \\dots \\lor \\neg P_k \\lor Q) \\equiv (P_1 \\land P_2 \\land \\dots \\land P_k \\implies Q)$$
   Di mana $P_i$ adalah premis/badan (*body*), dan $Q$ adalah kepala (*head*).
2. **Fakta (Fact)**: Definite clause tanpa literal negatif ($Q$).
3. **Goal Clause (Integrity Constraint)**: Klausa dengan 0 literal positif ($(\\neg P_1 \\lor \\neg P_2)$).

**Keunggulan Komputasi: Inferensi Linear $\\mathcal{O}(n)$**:
Inferensi pada klausa Horn dapat diselesaikan dalam waktu **linear proporsional terhadap ukuran basis pengetahuan** menggunakan dua algoritma:
- **Forward Chaining (Penalaran Maju)**: Berorientasi data (*data-driven*). Dimulai dari fakta-fakta yang diketahui, mengaktifkan aturan-aturan yang seluruh antesedennya telah terpenuhi, menambahkan konsekuen baru ke fakta, dan berulang hingga query tercapai.
- **Backward Chaining (Penalaran Mundur)**: Berorientasi tujuan (*goal-directed*). Dimulai dari query, mencari aturan yang kepalanya cocok dengan query, lalu membuktikan antesedennya secara rekursif."""

c8_9_code = """from collections import deque
from typing import Dict, List, Set

class DefiniteClause:
    def __init__(self, premises: List[str], conclusion: str):
        self.premises = premises
        self.conclusion = conclusion

def pl_fc_entails(clauses: List[DefiniteClause], facts: Set[str], query: str) -> bool:
    # count[c]: jumlah premis klausa c yang belum terbukti
    count = {c: len(c.premises) for c in clauses}
    inferred = {q: False for c in clauses for q in c.premises + [c.conclusion]}
    agenda = deque(list(facts))
    
    for f in facts:
        inferred[f] = True

    while agenda:
        p = agenda.popleft()
        if p == query:
            return True
        for c in clauses:
            if p in c.premises:
                count[c] -= 1
                if count[c] == 0:
                    head = c.conclusion
                    if not inferred[head]:
                        inferred[head] = True
                        agenda.append(head)
    return False

# Aturan: A & B => C, C & D => E, Fakta: A, B, D. Query: E
kb_rules = [
    DefiniteClause(['A', 'B'], 'C'),
    DefiniteClause(['C', 'D'], 'E')
]
initial_facts = {'A', 'B', 'D'}

success = pl_fc_entails(kb_rules, initial_facts, 'E')

print("INFERENSI LINEAR KLAUSA HORN (FORWARD CHAINING O(n)):")
print("-" * 60)
print("Aturan: (A ^ B => C), (C ^ D => E)")
print(f"Fakta Awal: {initial_facts}")
print(f"Query Goal: 'E'")
print(f"Apakah E Berhasil Diturunkan? {success}")
print("-" * 60)
print("Forward chaining menyelesaikan deduksi dalam kompleksitas linear murni O(n).")"""

c8_9_pit = "Menerapkan Forward Chaining murni pada basis data fakta yang sangat masif tanpa penyaringan query, yang menyebabkan inferensi menurunkan ribuan fakta turunan yang sama sekali tidak relevan dengan tujuan akhir (inefisiensi data-driven)."
c8_9_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 7.5.4: Forward and Backward Chaining", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("8.9", "8.9. Klausa Horn & Inferensi Maju/Mundur", c8_9_desc, c8_9_md, c8_9_code, c8_9_pit, c8_9_ref))

# ==============================================================================
# SUBCHAPTER 8.10: Studi Kasus Dunia Wumpus (Wumpus World)
# ==============================================================================
c8_10_desc = "Praktikum komprehensif penalaran agen cerdas berbasis logika pada simulasi klasik Wumpus World: deduksi petak aman bebas jurang dan monster Wumpus."
c8_10_md = """Sebagai sintesis praktikum dari Bab 8, subbab ini mengonstruksi agen berbasis pengetahuan (*Knowledge-Based Agent*) yang beroperasi dalam lingkungan legendaris **Dunia Wumpus (Wumpus World)** (Russell & Norvig).

Spesifikasi Lingkungan Wumpus World:
- Grid gua $4 \\times 4$.
- **Jurang (Pit)**: Menimbulkan sensasi Semilir Angin (*Breeze*) pada petak-petak tetangga langsungnya (atas, bawah, kiri, kanan).
- **Monster Wumpus**: Menimbulkan Bau Busuk (*Stench*) pada petak-petak tetangga langsungnya.
- Agen dilengkapi sensor angin dan bau busuk pada posisi aktifnya saat ini.

Aksioma Fisika Lingkungan dalam Logika Proposisional:
$$\\text{Breeze}_{x,y} \\iff (\\text{Pit}_{x-1,y} \\lor \\text{Pit}_{x+1,y} \\lor \\text{Pit}_{x,y-1} \\lor \\text{Pit}_{x,y+1})$$
$$\\text{Stench}_{x,y} \\iff (\\text{Wumpus}_{x-1,y} \\lor \\text{Wumpus}_{x+1,y} \\lor \\text{Wumpus}_{x,y-1} \\lor \\text{Wumpus}_{x,y+1})$$

Agen memulai eksplorasi dari petak $[1,1]$ yang dijamin aman (bukan pit, bukan wumpus). Agen menerima persepsi: tidak ada hembusan angin di $[1,1]$. Melalui inferensi deduktif, agen membuktikan secara pasti bahwa petak $[1,2]$ dan $[2,1]$ aman dimasuki tanpa perlu berspekulasi atau mengambil risiko kecelakaan."""

c8_10_code = """from typing import Dict, List

def simulate_wumpus_reasoning():
    # Model Wumpus sederhana 2x2 untuk kejelasan eksekusi
    # P_x_y: Ada pit di (x, y). B_x_y: Ada breeze di (x, y)
    
    # Fakta persepsi awal di (1, 1):
    # Agen di (1,1) merasakan ~B_1_1 dan ~P_1_1
    # Aturan fisika: B_1_1 <=> (P_1_2 v P_2_1)
    
    # Karena B_1_1 bernilai False, maka ~(P_1_2 v P_2_1) = (~P_1_2 ^ ~P_2_1)
    # Deduksi langsung: P_1_2 pasti False, dan P_2_1 pasti False!
    
    kb_percepts = {"B_1_1": False, "P_1_1": False}
    
    # Deduksi keamanan petak tetangga
    safe_squares = []
    if not kb_percepts["B_1_1"]:
        # Kedua petak dijamin bebas pit
        safe_squares.append((1, 2))
        safe_squares.append((2, 1))

    print("HASIL DEDUKSI LOGIS AGEN PADA DUNIA WUMPUS (WUMPUS WORLD):")
    print("-" * 65)
    print("Persepsi Sensor di Petak [1, 1]: Breeze = False (Tidak ada hembusan angin)")
    print("Aksioma Aturan Fisika: B_1_1 <=> (Pit_1_2 v Pit_2_1)")
    print("Penalaran Deduktif Logika: ~B_1_1 |= (~Pit_1_2 ^ ~Pit_2_1)")
    print("-" * 65)
    print("Status Petak Terverifikasi Aman Dikunjungi:")
    for sq in safe_squares:
        print(f" -> Petak {sq} : 100% AMAN (Bebas Jurang Maut)")
    print("-" * 65)
    print("Agen bergerak rasional berbasis deduksi analitis, bukan spekulasi acak.")

simulate_wumpus_reasoning()"""

c8_10_pit = "Mengasumsikan bahwa petak yang tidak memiliki indikator hembusan angin adalah berbahaya. Logika proposisional membuktikan sebaliknya: ketiadaan angin (~B) adalah bukti deduktif mutlak bahwa seluruh tetangga langsungnya bebas jurang."
c8_10_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 7.2: The Wumpus World", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("8.10", "8.10. Studi Kasus Dunia Wumpus (Wumpus World)", c8_10_desc, c8_10_md, c8_10_code, c8_10_pit, c8_10_ref))

# Chapter metadata
chapter_8 = {
    "chapter": 8,
    "title": "Logika Proposisional & Inferensi Deduktif",
    "description": "Sintaks dan semantik logika proposisional, model dan keterikatan logis (entailment), algoritma TT-Entails, bentuk normal konjungtif (CNF), konversi 5-langkah, prinsip resolusi Robinson, pembuktian kontradiksi, algoritma PL-Resolution, klausa Horn dan inferensi linear, serta studi kasus Dunia Wumpus.",
    "subchapters": subchapters
}

out_path = os.path.join(os.path.dirname(__file__), "ai_ch8_data.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(chapter_8, f, indent=2, ensure_ascii=False)

print(f"Chapter 8 generated successfully with {len(subchapters)} subchapters at {out_path}")
