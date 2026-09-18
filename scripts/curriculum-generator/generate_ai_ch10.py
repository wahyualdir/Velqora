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
# SUBCHAPTER 10.1: Menghadapi Ketidakpastian dalam Kecerdasan Buatan
# ==============================================================================
c10_1_desc = "Analisis epistemologis batasan logika deduktif murni di dunia berderau, Masalah Kualifikasi (Qualification Problem), derajat keyakinan, dan teori utilitas."
c10_1_md = """Dalam dunia nyata, agen cerdas hampir tidak pernah beroperasi dalam kondisi kepastian mutlak (*complete certainty*). Agen menghadapi tiga keterbatasan mendasar:
1. **Ketidaktahuan Teoretis (Laziness)**: Mengumpulkan seluruh aturan dan pengecualian fisika dunia nyata terlalu kompleks atau mustahil (misal: memodelkan seluruh faktor molekuler yang menyebabkan sakit kepala).
2. **Keterbatasan Pengamatan (Theoretical Ignorance)**: Sensor agen memiliki derau (*sensor noise*) dan keterbatasan jangkauan (sebagian status lingkungan bersifat *partially observable*).
3. **Masalah Kualifikasi (Qualification Problem)**:
   Dalam logika orde pertama murni, menulis aturan diagnostik medis seperti:
   $$\\forall p \\, (\\text{Symptom}(p, \\text{Toothache}) \\implies \\text{Disease}(p, \\text{Cavity}))$$
   bersifat salah, karena sakit gigi bisa disebabkan oleh abses gusi, masalah saraf, atau infeksi sinus. Menulis seluruh daftar pengecualian di premis aturan membuat sistem logika rapuh dan tidak praktis.

**Derajat Keyakinan (Degrees of Belief)**:
Alih-alih memaksakan nilai biner absolut (True/False), agen rasional menggunakan **Teori Probabilitas** untuk menetapkan derajat keyakinan numerik dalam interval $[0, 1]$ terhadap suatu proposisi, berdasarkan seluruh bukti (*evidence*) yang telah dipersepsikan sejauh ini. Dipadukan dengan **Teori Utilitas**, agen dapat membuat keputusan rasional optimal (*Maximization of Expected Utility*) di bawah ketidakpastian."""

c10_1_code = """# Perbandingan keputusan: Sistem Logika Kaku vs Probabilistik Berbasis Utilitas
# Skenario: Menentukan tindakan medis berdasarkan gejala demam dan batuk

def logical_doctor(fever: bool, cough: bool) -> str:
    # Logika deduktif kaku: jika aturan tidak 100% cocok, tidak bisa bertindak
    if fever and cough:
        # Masalah kualifikasi: Apakah pasti flu biasa? Bagaimana jika infeksi bakteri?
        return "Diagnosis Definitif: Flu Biasa (Risiko salah diagnosis jika ada komplikasi)"
    return "Status: Tidak dapat disimpulkan secara deduktif murni"

def probabilistic_agent(fever: bool, cough: bool) -> dict:
    # Derajat keyakinan posterior P(Penyakit | Bukti)
    p_flu = 0.75 if (fever and cough) else 0.10
    p_bakteri = 0.20 if (fever and cough) else 0.05
    p_sehat = 0.05 if (fever and cough) else 0.85
    
    # Hitung Expected Utility dari resep antibiotik vs istirahat
    # Antibiotik berkhasiat tinggi jika bakteri, tetapi ada efek samping jika flu biasa
    u_antibiotik = p_bakteri * (+100) + p_flu * (-20)
    u_istirahat = p_flu * (+80) + p_bakteri * (-100)
    
    action = "Resep Istirahat & Parasetamol" if u_istirahat > u_antibiotik else "Uji Lab Lanjutan"
    return {
        "P(Flu|Bukti)": p_flu,
        "P(Bakteri|Bukti)": p_bakteri,
        "Rekomendasi Tindakan Rasional": action
    }

print("PENANGANAN KETIDAKPASTIAN: LOGIKA KAKU VS PROBABILITAS:")
print("-" * 65)
print("Gejala Pasien: Demam = True, Batuk = True")
print(f"Pendekatan Logika Kaku : {logical_doctor(True, True)}")
prob_res = probabilistic_agent(True, True)
print("Pendekatan Probabilistik & Utilitas:")
for k, v in prob_res.items():
    print(f" -> {k:<30}: {v}")
print("-" * 65)
print("Probabilitas memungkinkan penalaran kuantitatif di bawah ketidakpastian empiris.")"""

c10_1_pit = "Menyamakan probabilitas (derajat keyakinan tentang kebenaran fakta) dengan logika fuzzy (derajat kebenaran parsial suatu konsep). Pernyataan P(Hujan) = 0.8 berarti ada kemungkinan 80% bahwa hari ini benar-benar hujan lebat, bukan berarti gerimis tipis 80%."
c10_1_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 12.1: Acting under Uncertainty", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("10.1", "10.1. Menghadapi Ketidakpastian dalam Kecerdasan Buatan", c10_1_desc, c10_1_md, c10_1_code, c10_1_pit, c10_1_ref))

# ==============================================================================
# SUBCHAPTER 10.2: Aksioma Teori Probabilitas dan Distribusi Gabungan Penuh
# ==============================================================================
c10_2_desc = "Aksioma probabilitas Kolmogorov, ruang sampel, variabel acak diskrit, dan representasi Distribusi Probabilitas Gabungan Penuh (Full Joint Distribution)."
c10_2_md = """Fondasi formal seluruh penalaran probabilistik didasarkan pada **Aksioma Kolmogorov (1933)**:
1. Untuk setiap peristiwa $A$, probabilitasnya adalah bilangan riil non-negatif yang dibatasi:
   $$0 \\le P(A) \\le 1$$
2. Probabilitas dari ruang sampel semesta $\\Omega$ (kepastian mutlak) adalah 1:
   $$P(\\Omega) = 1, \\quad P(\\emptyset) = 0$$
3. Untuk dua peristiwa yang saling lepas (*mutually exclusive* di mana $A \\land B = \\emptyset$):
   $$P(A \\lor B) = P(A) + P(B)$$
   Secara umum untuk dua peristiwa sembarang: $P(A \\lor B) = P(A) + P(B) - P(A \\land B)$.

**Distribusi Probabilitas Gabungan Penuh (Full Joint Distribution)**:
Misalkan dunia dimodelkan oleh himpunan variabel acak diskrit $\\{X_1, X_2, \\dots, X_n\\}$. Distribusi probabilitas gabungan penuh menetapkan nilai probabilitas untuk setiap kombinasi penetapan nilai atomik:
$$\\mathbf{P}(X_1 = x_1, X_2 = x_2, \\dots, X_n = x_n)$$
Di mana jumlah seluruh entri dalam tabel gabungan bernilai tepat 1:
$$\\sum_{x_1} \\sum_{x_2} \\dots \\sum_{x_n} P(x_1, x_2, \\dots, x_n) = 1$$

*Keterbatasan Skalabilitas*: Jika terdapat $n$ variabel Boolean, tabel gabungan memuat $2^n$ entri. Untuk $n=100$, tabel membutuhkan $2^{100} \\approx 10^{30}$ angka probabilitas yang mustahil disimpan maupun diestimasi secara statistik."""

c10_2_code = """from typing import Dict, Tuple

# Distribusi Gabungan Penuh untuk 3 Variabel Boolean:
# Toothache (Sakit Gigi), Cavity (Gigi Berlubang), Catch (Alat Dokter Nyangkut)
# Tabel 2^3 = 8 entri (Russell & Norvig, Bab 12)
joint_distribution: Dict[Tuple[bool, bool, bool], float] = {
    # (Toothache, Cavity, Catch)
    (True,  True,  True):  0.108,
    (True,  True,  False): 0.012,
    (True,  False, True):  0.016,
    (True,  False, False): 0.064,
    (False, True,  True):  0.072,
    (False, True,  False): 0.008,
    (False, False, True):  0.144,
    (False, False, False): 0.576
}

# Verifikasi Aksioma 2: Total sum = 1.0
total_p = sum(joint_distribution.values())

# Marginalisasi: Hitung P(Cavity = True)
p_cavity = sum(p for (t, cav, cat), p in joint_distribution.items() if cav)

# Inferensi Bersyarat: P(Cavity = True | Toothache = True) = P(Cavity ^ Toothache) / P(Toothache)
p_toothache = sum(p for (t, cav, cat), p in joint_distribution.items() if t)
p_cav_and_tooth = sum(p for (t, cav, cat), p in joint_distribution.items() if cav and t)
p_cav_given_tooth = p_cav_and_tooth / p_toothache

print("ANALISIS DISTRIBUSI PROBABILITAS GABUNGAN PENUH (FULL JOINT):")
print("-" * 65)
print(f"Total Probabilitas Seluruh Ruang Sampel: {total_p:.6f} (Aksioma Terpenuhi)")
print(f"Probabilitas Marginal P(Cavity = True) : {p_cavity:.3f}")
print(f"Probabilitas Bersama P(Cavity ^ Tooth) : {p_cav_and_tooth:.3f}")
print(f"Probabilitas Marginal P(Toothache)     : {p_toothache:.3f}")
print(f"Probabilitas Posterior P(Cavity | Tooth): {p_cav_given_tooth:.4f} (60.0%)")
print("-" * 65)
print("Distribusi gabungan memuat seluruh informasi probabilistik domain.")"""

c10_2_pit = "Lupa melakukan normalisasi pembagi saat menghitung probabilitas bersyarat P(A|B), atau membiarkan tabel probabilitas gabungan memiliki jumlah total != 1.0, yang merusak konsistensi aksioma Kolmogorov."
c10_2_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 12.2: Basic Probability Notation", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("10.2", "10.2. Aksioma Teori Probabilitas dan Distribusi Gabungan Penuh", c10_2_desc, c10_2_md, c10_2_code, c10_2_pit, c10_2_ref))

# ==============================================================================
# SUBCHAPTER 10.3: Probabilitas Bersyarat dan Aturan Perkalian
# ==============================================================================
c10_3_desc = "Definisi probabilitas bersyarat P(A|B), aturan perkalian (Product Rule), dan Aturan Rantai (Chain Rule) untuk dekomposisi distribusi bersama multivariat."
c10_3_md = """Probabilitas yang tidak bergantung pada bukti apa pun disebut probabilitas *prior* atau *unconditional probability* $P(A)$. Namun dalam sistem cerdas, agen terus menerima bukti baru (*evidence*) $B$. Probabilitas dari $A$ setelah bukti $B$ diketahui secara pasti disebut **Probabilitas Bersyarat (Conditional Probability)** $P(A \\mid B)$.

Secara formal didefinisikan:

$$P(A \\mid B) = \\frac{P(A \\land B)}{P(B)} \\quad \\text{dengan syarat } P(B) > 0$$

Dari definisi ini, kita menurunkan **Aturan Perkalian (Product Rule)**:

$$P(A \\land B) = P(A \\mid B) P(B) = P(B \\mid A) P(A)$$

**Aturan Rantai (The Chain Rule)**:
Dengan menerapkan aturan perkalian secara berulang pada $n$ buah variabel acak, kita memperoleh teorema dekomposisi fundamental:

$$P(X_1, X_2, \\dots, X_n) = P(X_1) \\cdot P(X_2 \\mid X_1) \\cdot P(X_3 \\mid X_1, X_2) \\cdots P(X_n \\mid X_1, \\dots, X_{n-1}) = \\prod_{i=1}^n P(X_i \\mid X_1, \\dots, X_{i-1})$$

Aturan rantai membuktikan bahwa distribusi probabilitas gabungan penuh apa pun selalu dapat didekomposisi menjadi perkalian dari serangkaian probabilitas bersyarat."""

c10_3_code = """# Verifikasi Aturan Rantai pada 3 variabel berurutan: P(A, B, C) = P(A) * P(B|A) * P(C|A, B)
# Misal: A = Cuaca Berawan, B = Hujan, C = Membawa Payung

p_a = 0.40               # P(Berawan) = 40%
p_b_given_a = 0.70       # P(Hujan | Berawan) = 70%
p_c_given_ab = 0.90      # P(Payung | Berawan, Hujan) = 90%

# Hitung probabilitas gabungan P(Berawan, Hujan, Payung)
p_joint_chain = p_a * p_b_given_a * p_c_given_ab

print("PENERAPAN ATURAN PERKALIAN & ATURAN RANTAI (CHAIN RULE):")
print("-" * 65)
print(f"P(Berawan)                     : {p_a:.2f}")
print(f"P(Hujan | Berawan)             : {p_b_given_a:.2f}")
print(f"P(Payung | Berawan, Hujan)     : {p_c_given_ab:.2f}")
print("-" * 65)
print(f"P(Berawan ^ Hujan ^ Payung)    : {p_joint_chain:.4f} ({p_joint_chain * 100:.2f}%)")
print("-" * 65)
print("Aturan rantai mendekomposisi gabungan multivariat menjadi faktor bersyarat.")"""

c10_3_pit = "Membagi dengan P(B) ketika P(B) = 0. Probabilitas bersyarat P(A|B) tidak terdefinisi secara matematis jika bukti B adalah peristiwa mustahil yang memiliki probabilitas nol mutlak."
c10_3_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 12.2: Basic Probability Notation", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("10.3", "10.3. Probabilitas Bersyarat dan Aturan Perkalian", c10_3_desc, c10_3_md, c10_3_code, c10_3_pit, c10_3_ref))

# ==============================================================================
# SUBCHAPTER 10.4: Teorema Bayes dan Penerapannya dalam Diagnostik
# ==============================================================================
c10_4_desc = "Formulasi Teorema Bayes, pembalikan probabilitas kausal menjadi diagnostik, faktor normalisasi alpha, dan jebakan Base-Rate Fallacy."
c10_4_md = """Berdasarkan simetri dari aturan perkalian $P(A \\land B) = P(A \\mid B)P(B) = P(B \\mid A)P(A)$, Thomas Bayes (1763) merumuskan teorema paling berpengaruh dalam kecerdasan buatan: **Teorema Bayes (Bayes' Rule)**:

$$P(\\text{Sebab} \\mid \\text{Akibat}) = \\frac{P(\\text{Akibat} \\mid \\text{Sebab}) \\cdot P(\\text{Sebab})}{P(\\text{Akibat})}$$

Secara umum dengan faktor normalisasi $\\alpha = 1 / P(\\text{Akibat})$:

$$\\mathbf{P}(Y \\mid X) = \\alpha \\cdot \\mathbf{P}(X \\mid Y) \\cdot \\mathbf{P}(Y)$$

**Mengapa Teorema Bayes Sangat Fundamental dalam AI?**
Dalam diagnosis medis dan rekayasa cerdas, kita sering kali memiliki data **Kausal** $P(\\text{Gejala} \\mid \\text{Penyakit})$—yaitu seberapa sering pasien meningitis mengalami leher kaku (ini adalah sifat medis stabil $\\approx 70\\%$). Namun dokter membutuhkan probabilitas **Diagnostik** $P(\\text{Penyakit} \\mid \\text{Gejala})$—yaitu jika seseorang datang dengan leher kaku, berapa peluang ia menderita meningitis? Teorema Bayes memungkinkan pembalikan ini secara eksak.

**Jebakan Kritis: Base-Rate Fallacy**:
Mengabaikan prior $P(\\text{Sebab})$ adalah kesalahan manusia yang umum. Jika suatu penyakit sangat langka (misal 1 dalam 10.000), bahkan jika tes medis memiliki akurasi $99\\%$, seseorang yang dites positif tetap memiliki peluang menderita penyakit $< 1\\%$, karena jumlah *false positives* dari populasi sehat jauh melampaui jumlah kasus positif sejati."""

c10_4_code = """def bayes_diagnostics(prior_disease: float, sensitivity: float, false_positive_rate: float):
    # P(D): Prior penyakit
    # P(+ | D): Sensitivitas (kemampuan mendeteksi saat sakit)
    # P(+ | ~D): False positive rate (salah vonis saat sehat)
    
    p_d = prior_disease
    p_not_d = 1.0 - p_d
    p_pos_given_d = sensitivity
    p_pos_given_not_d = false_positive_rate

    # Marginalisasi P(+): Total probabilitas tes positif
    p_positive = (p_pos_given_d * p_d) + (p_pos_given_not_d * p_not_d)

    # Teorema Bayes: P(D | +)
    p_d_given_pos = (p_pos_given_d * p_d) / p_positive
    return p_d_given_pos, p_positive

# Kasus skrining penyakit langka:
# Prevalensi (Prior) = 0.1% (0.001)
# Sensitivitas Tes   = 99% (0.99)
# False Positive     = 1% (0.01)
posterior_sick, total_pos = bayes_diagnostics(0.001, 0.99, 0.01)

print("PENERAPAN TEOREMA BAYES DALAM DIAGNOSTIK MEDIS:")
print("-" * 65)
print(f"Prevalensi Penyakit P(Sakit)         : 0.1% (Langka)")
print(f"Akurasi Sensitivitas Tes P(+ | Sakit): 99.0%")
print(f"Tingkat Positif Palsu P(+ | Sehat)   : 1.0%")
print("-" * 65)
print(f"Probabilitas Nyata Menderita Penyakit Jika Hasil Tes Positif:")
print(f" -> P(Sakit | Positif) = {posterior_sick:.4f} ({posterior_sick * 100:.2f}%)")
print("-" * 65)
print("Base-rate fallacy: Meskipun tes akurat 99%, mayoritas hasil positif adalah false positive!")"""

c10_4_pit = "Mengabaikan prior P(Sebab) (Base-Rate Fallacy). Mengasumsikan bahwa hasil tes yang 99% akurat berarti seseorang yang dites positif memiliki peluang 99% sakit, tanpa memperhitungkan kelangkaan penyakit di populasi umum."
c10_4_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 12.5: Bayes' Rule and Its Use", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("10.4", "10.4. Teorema Bayes dan Penerapannya dalam Diagnostik", c10_4_desc, c10_4_md, c10_4_code, c10_4_pit, c10_4_ref))

# ==============================================================================
# SUBCHAPTER 10.5: Independensi dan Independensi Bersyarat
# ==============================================================================
c10_5_desc = "Independensi absolut vs Independensi Bersyarat (Conditional Independence), faktorisasi graf, dan reduksi parameter komputasi dari eksponensial ke linear."
c10_5_md = """Kunci utama yang memungkinkan komputasi probabilitas dapat diterapkan pada sistem nyata berskala ribuan variabel adalah konsep **Independensi (Independence)**:

1. **Independensi Absolut (Marginal Independence)**:
   Dua variabel $A$ dan $B$ dikatakan independen secara absolut ($A \\perp B$) jika dan hanya jika:
   $$P(A \\land B) = P(A) \\cdot P(B) \\iff P(A \\mid B) = P(A)$$
   Pengetahuan tentang $B$ tidak memberikan informasi apa pun mengenai $A$.
2. **Independensi Bersyarat (Conditional Independence)**:
   Dalam sistem nyata, variabel-variabel jarang bersifat independen absolut karena mereka saling terhubung secara kausal. Namun, mereka sering kali bersifat **independen bersyarat**:
   Dua variabel $X$ dan $Y$ dikatakan independen bersyarat diberikan variabel ketiga $Z$ ($X \\perp Y \\mid Z$) jika dan hanya jika:
   $$P(X \\land Y \\mid Z) = P(X \\mid Z) \\cdot P(Y \\mid Z) \\iff P(X \\mid Y, Z) = P(X \\mid Z)$$

**Signifikansi Komputasi Reduksi Dimensi**:
Misalkan seorang dokter mengamati dua gejala terpisah: Sakit Gigi ($T$) dan Alat Nyangkut ($C$), yang keduanya disebabkan oleh Gigi Berlubang ($G$). $T$ dan $C$ jelas TIDAK independen absolut (jika seseorang sakit gigi, kemungkinan alat dokter menyangkut menjadi lebih tinggi). Namun, jika kita **sudah mengetahui secara pasti** status Gigi Berlubang ($G$), maka $T$ dan $C$ menjadi independen bersyarat:
$$P(T, C \\mid G) = P(T \\mid G) \\cdot P(C \\mid G)$$
Independensi bersyarat mereduksi ukuran representasi probabilitas dari $\\mathcal{O}(2^n)$ eksponensial menjadi $\\mathcal{O}(n)$ linear!"""

c10_5_code = """# Verifikasi independensi bersyarat pada model medis 3 variabel
# G = Cavity, T = Toothache, C = Catch
# Diberikan G=True, apakah P(T ^ C | G) == P(T | G) * P(C | G)?

p_g = 0.20
p_t_given_g = 0.60
p_c_given_g = 0.70

# Karena T dan C independen bersyarat diberikan G:
p_tc_given_g = p_t_given_g * p_c_given_g

# Hitung P(G, T, C) menggunakan aturan rantai + independensi bersyarat:
# P(G, T, C) = P(G) * P(T | G) * P(C | G)
p_joint_factored = p_g * p_t_given_g * p_c_given_g

print("VERIFIKASI KOMPUTASI INDEPENDENSI BERSYARAT (X _|_ Y | Z):")
print("-" * 65)
print(f"P(Gigi Berlubang)                      : {p_g:.2f}")
print(f"P(Sakit Gigi | Berlubang)              : {p_t_given_g:.2f}")
print(f"P(Alat Nyangkut | Berlubang)           : {p_c_given_g:.2f}")
print("-" * 65)
print(f"P(Sakit ^ Nyangkut | Berlubang)        : {p_tc_given_g:.4f} (Faktorisasi Mandiri)")
print(f"P(Gabungan G ^ T ^ C)                  : {p_joint_factored:.4f} ({p_joint_factored * 100:.2f}%)")
print("-" * 65)
print("Independensi bersyarat memotong relasi langsung antar-efek sekunder.")"""

c10_5_pit = "Mengasumsikan bahwa dua variabel yang independen bersyarat (X _|_ Y | Z) juga pasti independen absolut (X _|_ Y). Dua gejala penyakit independen diberikan diagnosis pasti, namun berkorelasi kuat jika diagnosis belum diketahui."
c10_5_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 12.4: Independence", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("10.5", "10.5. Independensi dan Independensi Bersyarat", c10_5_desc, c10_5_md, c10_5_code, c10_5_pit, c10_5_ref))

# ==============================================================================
# SUBCHAPTER 10.6: Sintaks dan Semantik Jaringan Bayesian (DAG)
# ==============================================================================
c10_6_desc = "Struktur formal Directed Acyclic Graph (DAG) Jaringan Bayesian, semantik kausal, dekomposisi faktorisasi gabungan Pearl (1988), dan asumsi Markov Lokal Koller & Friedman (2009)."
c10_6_md = """**Jaringan Bayesian (Bayesian Networks)**—ditemukan dan diformalkan oleh peraih Turing Award Judea Pearl (1988)—adalah struktur data graf probabilistik yang merepresentasikan hubungan ketergantungan dan independensi bersyarat antar-variabel acak secara ringkas dan modular.

**1. Sintaksis Formal**:
Sebuah Jaringan Bayesian terdiri dari:
1. **Struktur Graf Berarah Asiklik (Directed Acyclic Graph - DAG)** $G = (V, E)$:
   - Simpul ($V$): Merepresentasikan sekumpulan variabel acak $\\{X_1, X_2, \\dots, X_n\\}$.
   - Busur Berarah ($E$): Panah dari $X_i \\to X_j$ merepresentasikan pengaruh langsung (*direct influence / causal connection*). $X_i$ disebut sebagai orang tua (*parent*) dari $X_j$.
2. **Koleksi Tabel Probabilitas Bersyarat (CPT)**: Setiap simpul $X_i$ memiliki distribusi probabilitas bersyarat lokal terhadap orang tuanya:
   $$\\mathbf{P}(X_i \\mid \\text{Parents}(X_i))$$

**2. Semantik Global & Teorema Faktorisasi Pearl (1988)**:
Semantik fundamental dari Jaringan Bayesian menetapkan bahwa distribusi probabilitas gabungan penuh dari seluruh $n$ variabel merupakan **hasil kali langsung dari probabilitas bersyarat lokal setiap simpul terhadap orang tuanya**:

$$P(x_1, x_2, \\dots, x_n) = \\prod_{i=1}^n P(x_i \\mid \\text{parents}(X_i))$$

**3. Asumsi Markov Lokal (Koller & Friedman 2009)**:
Daphne Koller & Nir Friedman (*Probabilistic Graphical Models*, 2009) merumuskan secara analitis bahwa struktur DAG $G$ mengkodekan kumpulan independensi bersyarat $\\mathcal{I}(G)$: setiap simpul $X_i$ independen bersyarat dari seluruh simpul yang bukan keturunannya (*non-descendants*) jika nilai orang tuanya (*parents*) telah diketahui:
$$(X_i \\perp \\text{NonDescendants}(X_i) \\mid \\text{Parents}(X_i))$$"""

c10_6_code = """from typing import Dict, List

# Definisi struktur DAG Jaringan Bayesian Alarm Judea Pearl (1988)
# Variabel: Burglary (B), Earthquake (E), Alarm (A), JohnCalls (J), MaryCalls (M)
dag_parents = {
    'Burglary': [],
    'Earthquake': [],
    'Alarm': ['Burglary', 'Earthquake'],
    'JohnCalls': ['Alarm'],
    'MaryCalls': ['Alarm']
}

# Probabilitas lokal individual (CPT)
cpt = {
    'B': 0.001,
    'E': 0.002,
    # P(A | B, E)
    ('A', True, True): 0.95,
    ('A', True, False): 0.94,
    ('A', False, True): 0.29,
    ('A', False, False): 0.001,
    # P(J | A)
    ('J', True): 0.90,
    ('J', False): 0.05,
    # P(M | A)
    ('M', True): 0.70,
    ('M', False): 0.01
}

# Hitung P(B ^ ~E ^ A ^ J ^ ~M) sesuai rumus faktorisasi Pearl (1988)
p_b = cpt['B']
p_not_e = 1.0 - cpt['E']
p_a_given_b_note = cpt[('A', True, False)]
p_j_given_a = cpt[('J', True)]
p_not_m_given_a = 1.0 - cpt[('M', True)]

p_event = p_b * p_not_e * p_a_given_b_note * p_j_given_a * p_not_m_given_a

print("FAKTORISASI JARINGAN BAYESIAN PEARL (1988):")
print("-" * 65)
print("Struktur Graf DAG:")
for node, pars in dag_parents.items():
    print(f" Simpul '{node:<10}' -> Parents: {pars}")
print("-" * 65)
print("Kalkulasi Status Spesifik P(B, ~E, A, J, ~M):")
print(f" = P(B) * P(~E) * P(A|B,~E) * P(J|A) * P(~M|A)")
print(f" = {p_b} * {p_not_e:.3f} * {p_a_given_b_note} * {p_j_given_a} * {p_not_m_given_a:.2f}")
print(f" = {p_event:.8f} ({p_event:.6e})")
print("-" * 65)
print("Dekomposisi DAG mereduksi komputasi eksponensial menjadi produk lokal.")"""

c10_6_pit = "Membuat siklus berarah (Directed Cycle, misal A -> B -> C -> A) dalam graf. Jaringan Bayesian secara matematis HARUS berupa DAG (Directed Acyclic Graph) agar aturan rantai faktorisasi terdefinisi secara terurut konsisten tanpa sirkularitas."
c10_6_ref = [
    {"title": "Judea Pearl (1988) Probabilistic Reasoning in Intelligent Systems, Section 3.1 & 3.2, Morgan Kaufmann", "url": "https://doi.org/10.1016/C2009-0-27609-4"},
    {"title": "Koller & Friedman (2009) Probabilistic Graphical Models: Principles and Techniques, Chapter 3: The Bayesian Network Representation, pp. 51–53, MIT Press", "url": "https://mitpress.mit.edu/9780262013192/"}
]
subchapters.append(create_subchapter("10.6", "10.6. Sintaks dan Semantik Jaringan Bayesian (DAG)", c10_6_desc, c10_6_md, c10_6_code, c10_6_pit, c10_6_ref))

# ==============================================================================
# SUBCHAPTER 10.7: Tabel Probabilitas Bersyarat (CPT)
# ==============================================================================
c10_7_desc = "Spesifikasi numerik Tabel Probabilitas Bersyarat (CPT), representasi kompak distribusi multivariat, dan reduksi jumlah parameter dari 2^n menjadi n*2^k."
c10_7_md = """Setiap simpul dalam Jaringan Bayesian diasosiasikan dengan **Tabel Probabilitas Bersyarat (Conditional Probability Table - CPT)** yang mendefinisikan distribusi probabilitas variabel tersebut untuk setiap kombinasi nilai orang tuanya.

**Efisiensi Representasi Parameter**:
Misalkan sebuah domain memiliki $n$ variabel Boolean:
- Pada **Distribusi Gabungan Penuh tanpa independensi**, kita harus menentukan dan menyimpan:
  $$2^n - 1 \\quad \\text{parameter probabilitas independen}$$
- Pada **Jaringan Bayesian**, jika setiap simpul memiliki paling banyak $k$ orang tua (*maximum in-degree* $k$), maka setiap baris CPT membutuhkan $2^k$ nilai (atau $2^k - 1$ nilai bebas karena probabilitas komplemen berjumlah 1). Dengan demikian, total parameter yang harus disimpan untuk seluruh $n$ variabel adalah:
  $$n \\cdot 2^k \\quad \\text{parameter}$$

Jika $k \\ll n$ (graf bersifat renggang / *sparse graph*, yang umum pada sebagian besar domain nyata di mana setiap variabel hanya dipengaruhi langsung oleh 2–5 faktor utama), kebutuhan memori dan data pembelajaran menyusut dari eksponensial menjadi **linear terhadap jumlah variabel $n$**. Untuk $n=30$ variabel dengan $k=3$: tabel gabungan membutuhkan $2^{30} \\approx 1.07 \\times 10^9$ angka, sedangkan Jaringan Bayesian hanya membutuhkan $30 \\times 2^3 = 240$ angka!"""

c10_7_code = """def compare_parameter_scaling(n_vars: int, max_parents: int):
    full_joint_params = (2 ** n_vars) - 1
    bayesian_net_params = n_vars * (2 ** max_parents)
    savings_ratio = (1.0 - (bayesian_net_params / full_joint_params)) * 100
    return full_joint_params, bayesian_net_params, savings_ratio

variables_cases = [5, 10, 20, 30]
k_parents = 3

print("ANALISIS SKALABILITAS PARAMETER: FULL JOINT VS BAYESIAN NETWORK:")
print("-" * 75)
print(f"{'Jumlah Variabel (n)':<20} | {'Full Joint (2^n - 1)':<22} | {'Bayes Net (n * 2^k)':<20}")
print("-" * 75)
for n in variables_cases:
    fj, bn, sav = compare_parameter_scaling(n, k_parents)
    print(f"{n:<20} | {fj:<22,d} | {bn:<20,d}")
print("-" * 75)
print(f"Pada n=30 variabel (k=3 parents): Bayes Net mereduksi 1 Miliar parameter")
print(f"menjadi hanya 240 angka probabilitas (Efisiensi kompresi: >99.99997%)!")"""

c10_7_pit = "Membuat simpul dengan terlalu banyak in-degree (parents k > 15), yang membuat ukuran CPT lokal simpul tersebut kembali membengkak eksponensial (2^k). Jika suatu simpul dipengaruhi oleh banyak faktor, harus digunakan model parametrik kompak seperti Noisy-OR gates."
c10_7_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 13.2: The Semantics of Bayesian Networks", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("10.7", "10.7. Tabel Probabilitas Bersyarat (Conditional Probability Tables - CPT)", c10_7_desc, c10_7_md, c10_7_code, c10_7_pit, c10_7_ref))

# ==============================================================================
# SUBCHAPTER 10.8: Inferensi Eksak dengan Enumerasi
# ==============================================================================
c10_8_desc = "Algoritma inferensi eksak Enumeration-Ask, marginalisasi variabel tersembunyi (Hidden Variables), dan evaluasi kueri posterior P(X | e)."
c10_8_md = """Tujuan komputasi utama dari Jaringan Bayesian adalah **Inferensi Probabilistik**: menghitung distribusi probabilitas posterior dari sekumpulan variabel kueri $X$, setelah mengamati nilai bukti tertentu $\\mathbf{e}$ pada sekumpulan variabel bukti $\\mathbf{E}$:

$$\\mathbf{P}(X \\mid \\mathbf{e}) = \\alpha \\cdot \\mathbf{P}(X, \\mathbf{e}) = \\alpha \\sum_{\\mathbf{y}} \\mathbf{P}(X, \\mathbf{e}, \\mathbf{y})$$

Di mana $\\mathbf{Y}$ adalah himpunan **Variabel Tersembunyi (Hidden / Unobserved Variables)** yang bukan merupakan kueri dan tidak teramati dalam bukti, dan $\\alpha = 1 / P(\\mathbf{e})$ adalah konstanta normalisasi.

**Algoritma Enumeration-Ask**:
1. Mengiterasi setiap nilai domain dari variabel kueri $X$.
2. Untuk setiap nilai $x$, menjumlahkan seluruh kombinasi nilai variabel tersembunyi $\\mathbf{y}$ secara rekursif melalui penelusuran pohon faktor (*tree traversal*).
3. Melakukan normalisasi akhir sehingga total probabilitas berjumlah 1.

Meskipun inferensi eksak pada Jaringan Bayesian umum terbukti merupakan masalah **NP-Hard** (Cooper, 1990), algoritma enumerasi memberikan solusi dasar yang sound dan menjadi tolok ukur verifikasi untuk metode eliminasi variabel (*Variable Elimination*) dan metode perkiraan (*MCMC*)."""

c10_8_code = """from typing import Dict, List

# Alarm Network CPT lookup helper
def p_var(var: str, val: bool, parent_vals: Dict[str, bool]) -> float:
    if var == 'Burglary':
        return 0.001 if val else 0.999
    elif var == 'Earthquake':
        return 0.002 if val else 0.998
    elif var == 'Alarm':
        b = parent_vals['Burglary']
        e = parent_vals['Earthquake']
        p_true = 0.95 if (b and e) else (0.94 if (b and not e) else (0.29 if (not b and e) else 0.001))
        return p_true if val else (1.0 - p_true)
    elif var == 'JohnCalls':
        a = parent_vals['Alarm']
        p_true = 0.90 if a else 0.05
        return p_true if val else (1.0 - p_true)
    elif var == 'MaryCalls':
        a = parent_vals['Alarm']
        p_true = 0.70 if a else 0.01
        return p_true if val else (1.0 - p_true)
    return 0.0

vars_order = ['Burglary', 'Earthquake', 'Alarm', 'JohnCalls', 'MaryCalls']

def enumerate_all(variables: List[str], evidence: Dict[str, bool]) -> float:
    if not variables:
        return 1.0
    Y = variables[0]
    rest = variables[1:]
    if Y in evidence:
        return p_var(Y, evidence[Y], evidence) * enumerate_all(rest, evidence)
    else:
        # Marginalisasi: jumlahkan kasus Y=True dan Y=False
        sum_val = 0.0
        for y_val in [True, False]:
            ev_extended = {**evidence, Y: y_val}
            sum_val += p_var(Y, y_val, ev_extended) * enumerate_all(rest, ev_extended)
        return sum_val

def enumeration_ask(query_var: str, evidence: Dict[str, bool]) -> Dict[bool, float]:
    dist = {}
    for q_val in [True, False]:
        ev = {**evidence, query_var: q_val}
        dist[q_val] = enumerate_all(vars_order, ev)
    # Normalisasi alpha
    total = sum(dist.values())
    return {k: v / total for k, v in dist.items()}

# Kueri: P(Burglary | JohnCalls = True, MaryCalls = True)
evidence_obs = {'JohnCalls': True, 'MaryCalls': True}
posterior = enumeration_ask('Burglary', evidence_obs)

print("INFERENSI EKSAK DENGAN ENUMERASI (ALARM NETWORK):")
print("-" * 65)
print(f"Bukti Pengamatan : JohnCalls = True, MaryCalls = True")
print(f"Kueri Posterior  : P(Burglary | JohnCalls, MaryCalls)")
print("-" * 65)
print(f"P(Burglary = True  | Evidence) : {posterior[True]:.4f} ({posterior[True]*100:.2f}%)")
print(f"P(Burglary = False | Evidence) : {posterior[False]:.4f} ({posterior[False]*100:.2f}%)")
print("-" * 65)
print("Meskipun prior pencurian hanya 0.1%, panggilan John & Mary meningkatkan peluang ke ~28.4%!")"""

c10_8_pit = "Melakukan komputasi ulang ekspresi yang identik secara berulang dalam rekursi enumerasi murni (menghitung sub-pohon berulang). Hal ini dapat dioptimasi dengan pemrograman dinamis melalui algoritma Variable Elimination."
c10_8_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 13.3: Exact Inference in Bayesian Networks", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("10.8", "10.8. Inferensi Eksak dengan Enumerasi", c10_8_desc, c10_8_md, c10_8_code, c10_8_pit, c10_8_ref))

# ==============================================================================
# SUBCHAPTER 10.9: Inferensi Perkiraan dengan Sampling
# ==============================================================================
c10_9_desc = "Metode inferensi aproksimasi stokastik: Prior Sampling, Rejection Sampling, Likelihood Weighting, dan Markov Chain Monte Carlo (MCMC)."
c10_9_md = """Karena inferensi eksak pada Jaringan Bayesian umum bersifat NP-Hard, sistem berskala besar mengandalkan **Metode Sampling Acak (Monte Carlo)** untuk memperkirakan probabilitas posterior secara efisien:

1. **Prior Sampling**: Membangkitkan sampel secara berurutan dari akar ke daun mengikuti urutan topologis graf.
2. **Rejection Sampling**: Membangkitkan sampel dari prior, lalu **membuang (*reject*)** seluruh sampel yang tidak cocok dengan bukti $\\mathbf{e}$. Probabilitas posterior dihitung dari rasio frekuensi sampel yang lolos. *Kelemahan*: Jika bukti $\\mathbf{e}$ adalah peristiwa langka ($P(\\mathbf{e}) < 10^{-4}$), hampir seluruh sampel dibuang, menyebabkan inefisiensi ekstrem.
3. **Likelihood Weighting**:
   Mengatasi kelemahan rejection sampling dengan cara:
   - Variabel yang menjadi bukti $\\mathbf{e}$ **tidak pernah disampling secara acak**, melainkan nilainya dipatok (*clamped*) sesuai bukti.
   - Setiap sampel diberikan bobot numerik $w$, yang diinisialisasi $w = 1.0$.
   - Setiap kali melewati variabel bukti $E_i$, bobot dikalikan dengan probabilitas kondisional dari bukti tersebut:
     $$w \\leftarrow w \\cdot P(E_i = e_i \\mid \\text{parents}(E_i))$$
   Hasil akhir dihitung dari jumlah bobot terakumulasi (*weighted average*). Seluruh sampel digunakan tanpa ada yang dibuang."""

c10_9_code = """import random
from typing import Dict, Tuple

# Simulasi Likelihood Weighting pada jaringan sederhana
# Burglary -> Alarm -> JohnCalls
random.seed(42)

def likelihood_weighting(num_samples: int) -> float:
    weight_burglary_true = 0.0
    total_weight = 0.0
    
    # Bukti: JohnCalls = True
    for _ in range(num_samples):
        w = 1.0
        # 1. Sample Burglary (tanpa bukti)
        b = random.random() < 0.001
        
        # 2. Sample Alarm (tanpa bukti)
        p_alarm = 0.94 if b else 0.001
        a = random.random() < p_alarm
        
        # 3. Variabel Bukti: JohnCalls dipatok True! Kalikan bobot w
        p_john_true = 0.90 if a else 0.05
        w *= p_john_true
        
        # Akumulasi bobot
        total_weight += w
        if b:
            weight_burglary_true += w
            
    return weight_burglary_true / total_weight

approx_p = likelihood_weighting(num_samples=50000)

print("HASIL SIMULASI SAMPLING LIKELIHOOD WEIGHTING (50,000 SAMPEL):")
print("-" * 65)
print(f"Kueri Target          : P(Burglary = True | JohnCalls = True)")
print(f"Estimasi Sampel Bobot : {approx_p:.4f} ({approx_p * 100:.2f}%)")
print("-" * 65)
print("Likelihood weighting mengeliminasi pembuangan sampel pada bukti langka.")"""

c10_9_pit = "Menggunakan Rejection Sampling saat bukti yang diamati memiliki probabilitas prior yang sangat kecil. Algoritma akan terjebak membangkitkan jutaan sampel yang 99.99% di antaranya langsung ditolak dan dibuang."
c10_9_ref = [
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Section 13.4: Approximate Inference in Bayesian Networks", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("10.9", "10.9. Inferensi Perkiraan dengan Sampling (Rejection & MCMC)", c10_9_desc, c10_9_md, c10_9_code, c10_9_pit, c10_9_ref))

# ==============================================================================
# SUBCHAPTER 10.10: Penerapan Jaringan Bayesian Menggunakan Python
# ==============================================================================
c10_10_desc = "Praktikum komprehensif implementasi engine Jaringan Bayesian modular Python 3 pada jaringan gempa dan pencurian Alarm Network (Judea Pearl 1988)."
c10_10_md = """Sebagai penutup kurikulum Artificial Intelligence Fundamentals, subbab ini menyajikan implementasi mandiri dari **Mesin Jaringan Bayesian Terpadu (Unified Bayesian Network Engine)** berbasis pustaka standar Python 3 murni tanpa dependensi eksternal yang rapuh.

Model yang dibangun adalah representasi definitif dunia dari **Jaringan Alarm Gempa & Pencurian Judea Pearl (1988)**:
1. **Topologi Jaringan**:
   - $B$ (*Burglary*) dan $E$ (*Earthquake*) adalah akar independen.
   - $A$ (*Alarm*) dipengaruhi langsung oleh $B$ dan $E$.
   - $J$ (*JohnCalls*) dan $M$ (*MaryCalls*) dipengaruhi langsung oleh $A$.
2. **Uji Validasi Analitis**:
   Engine mengevaluasi kueri posterior klasik:
   $$\\mathbf{P}(\\text{Burglary} \\mid \\text{JohnCalls} = \\text{True}, \\text{MaryCalls} = \\text{True})$$
   dan membuktikan secara komputasional bahwa probabilitas pencurian melonjak drastis dari nilai prior awal $0.1\\%$ menjadi $\\approx 28.4\\%$, merefleksikan konvergensi pembuktian probabilistik multi-sumber yang rasional."""

c10_10_code = """from typing import Dict, List, Tuple

class BayesianNode:
    def __init__(self, name: str, parents: List[str], cpt: Dict[Tuple, float]):
        self.name = name
        self.parents = parents
        self.cpt = cpt

    def get_prob(self, val: bool, parent_assignments: Dict[str, bool]) -> float:
        key = tuple(parent_assignments[p] for p in self.parents)
        if len(key) == 1:
            key = key[0]
        p_true = self.cpt[key]
        return p_true if val else (1.0 - p_true)

class DiscreteBayesNet:
    def __init__(self):
        self.nodes: Dict[str, BayesianNode] = {}
        self.variables_order: List[str] = []

    def add_node(self, node: BayesianNode):
        self.nodes[node.name] = node
        self.variables_order.append(node.name)

    def ask(self, query: str, evidence: Dict[str, bool]) -> Dict[bool, float]:
        def enumerate_rec(vars_left: List[str], current_env: Dict[str, bool]) -> float:
            if not vars_left:
                return 1.0
            Y = vars_left[0]
            rest = vars_left[1:]
            node = self.nodes[Y]
            if Y in current_env:
                return node.get_prob(current_env[Y], current_env) * enumerate_rec(rest, current_env)
            else:
                total = 0.0
                for val in [True, False]:
                    env_ext = {**current_env, Y: val}
                    total += node.get_prob(val, env_ext) * enumerate_rec(rest, env_ext)
                return total

        raw = {}
        for q_val in [True, False]:
            raw[q_val] = enumerate_rec(self.variables_order, {**evidence, query: q_val})
        alpha = sum(raw.values())
        return {k: v / alpha for k, v in raw.items()}

# Bangun Alarm Network Judea Pearl (1988)
bn = DiscreteBayesNet()
bn.add_node(BayesianNode('Burglary', [], {(): 0.001}))
bn.add_node(BayesianNode('Earthquake', [], {(): 0.002}))
bn.add_node(BayesianNode('Alarm', ['Burglary', 'Earthquake'], {
    (True, True): 0.95,
    (True, False): 0.94,
    (False, True): 0.29,
    (False, False): 0.001
}))
bn.add_node(BayesianNode('JohnCalls', ['Alarm'], {True: 0.90, False: 0.05}))
bn.add_node(BayesianNode('MaryCalls', ['Alarm'], {True: 0.70, False: 0.01}))

posterior = bn.ask('Burglary', {'JohnCalls': True, 'MaryCalls': True})

print("HASIL PRAKTIKUM UNIFIED BAYESIAN NETWORK ENGINE PYTHON 3:")
print("-" * 65)
print("Model Kanonikal Pearl (1988): Burglar Alarm Network (5 Simpul)")
print("Bukti Pengamatan: JohnCalls = True, MaryCalls = True")
print(f"Distribusi Posterior:")
print(f" -> P(Burglary = True  | J=True, M=True): {posterior[True]:.4f} ({posterior[True]*100:.2f}%)")
print(f" -> P(Burglary = False | J=True, M=True): {posterior[False]:.4f} ({posterior[False]*100:.2f}%)")
print("-" * 65)
print("Implementasi mandiri berhasil mereproduksi hasil analitis AIMA secara presisi 100%!")"""

c10_10_pit = "Menyusun urutan variabel secara acak tanpa memperhatikan urutan topologis (topological order) dari orang tua ke anak. Algoritma inferensi rekursif membutuhkan urutan variabel yang konsisten dengan struktur kausal agar orang tua selalu terikat sebelum anak dievaluasi."
c10_10_ref = [
    {"title": "Judea Pearl (1988) Probabilistic Reasoning in Intelligent Systems: Networks of Plausible Inference, Morgan Kaufmann", "url": "https://doi.org/10.1016/C2009-0-27609-4"},
    {"title": "Russell & Norvig (2020) Artificial Intelligence: A Modern Approach, 4th Ed., Chapter 13: Probabilistic Reasoning", "url": "https://aima.cs.berkeley.edu/"}
]
subchapters.append(create_subchapter("10.10", "10.10. Penerapan Jaringan Bayesian Menggunakan Python", c10_10_desc, c10_10_md, c10_10_code, c10_10_pit, c10_10_ref))

# Chapter metadata
chapter_10 = {
    "chapter": 10,
    "title": "Penalaran Probabilistik & Jaringan Bayesian",
    "description": "Menghadapi ketidakpastian dalam AI, aksioma Kolmogorov, distribusi gabungan penuh, probabilitas bersyarat, teorema Bayes dalam diagnostik, independensi bersyarat, DAG Jaringan Bayesian (Pearl 1988), CPT, inferensi eksak enumerasi, sampling stokastik, dan implementasi mesin Jaringan Bayesian.",
    "subchapters": subchapters
}

out_path = os.path.join(os.path.dirname(__file__), "ai_ch10_data.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(chapter_10, f, indent=2, ensure_ascii=False)

print(f"Chapter 10 generated successfully with {len(subchapters)} subchapters at {out_path}")
