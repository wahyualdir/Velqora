import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: KNOWLEDGE REPRESENTATION (TOPIK 17)
 * Rujukan Utama:
 * - Brachman, R., & Levesque, H. (2004). Knowledge Representation and Reasoning. Morgan Kaufmann.
 * - Baader, F., Calvanese, D., McGuinness, D., Nardi, D., & Patel-Schneider, P. (Eds.). (2003). The Description Logic Handbook. Cambridge University Press.
 * - Berners-Lee, T., Hendler, J., & Lassila, O. (2001). The Semantic Web. Scientific American, 284(5), 34-43.
 * - W3C (2014). RDF 1.1 Concepts and Abstract Syntax & SPARQL 1.1 Query Language. W3C Recommendations.
 * - Horrocks, I., Kutz, O., & Sattler, U. (2006). The Even More Irresistible SROIQ. KR 2006.
 */
export const knowledgeRepresentationCurriculum: AcademicCurriculum = {
  id: "knowledge-representation",
  slug: "knowledge-representation",
  title: "Knowledge Representation",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Struktur representasi pengetahuan formal dan penalaran logis terkomputasi: logika first-order dan pembatasan ekspresivitas komputasi, formalisme logika deskripsi (*Description Logics* $\\mathcal{ALC}$ & $\\mathcal{SROIQ}$), pemisahan terminologi (TBox) dan asersi fakta (ABox), jaring semantik (*Semantic Networks*) dan sistem Frame, ekosistem Web Semantik (RDF Triples, RDF Schema, OWL 2), penalaran berbasis algoritma Tableau, serta eksekusi kueri semantik analitik menggunakan SPARQL.",
  estimatedHours: 48,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Knowledge Representation and Reasoning",
      authors: ["Ronald Brachman", "Hector Levesque"],
      type: "book",
      url: "https://www.elsevier.com/books/knowledge-representation-and-reasoning/brachman/978-1-55860-932-7",
      relevance: "Buku teks fundamental logika formal, trade-off ekspresivitas versus traktabilitas komputasi (*The Fundamental Tradeoff*), jaring semantik, dan penalaran non-monotonik.",
      year: 2004,
      publisherOrVenue: "Morgan Kaufmann / Elsevier",
    },
    {
      title: "The Description Logic Handbook: Theory, Implementation, and Applications",
      authors: ["Franz Baader", "Diego Calvanese", "Deborah L. McGuinness", "Daniele Nardi", "Peter F. Patel-Schneider"],
      type: "book",
      url: "https://www.cambridge.org/core/books/description-logic-handbook/60824EFE97FF9EC5A6112C7FF8879669",
      relevance: "Sintaks formal, semantik model-teoretis TBox dan ABox, dan algoritma Tableau untuk penalaran ontologi OWL.",
      year: 2003,
      publisherOrVenue: "Cambridge University Press",
    },
    {
      title: "The Semantic Web",
      authors: ["Tim Berners-Lee", "James Hendler", "Ora Lassila"],
      type: "paper",
      url: "https://www.scientificamerican.com/article/the-semantic-web/",
      relevance: "Visi arsitektur web data terhubung (Linked Data) berbasis URI global, RDF graph, dan ontologi mesin.",
      year: 2001,
      publisherOrVenue: "Scientific American",
    },
  ],
  chapters: [
    {
      id: "kr-bab-1",
      slug: "fondasi-logika-formal-dan-trade-off-komputasi",
      title: "BAB 1: Fondasi Logika & Trade-off Ekspresivitas Komputasi",
      orderIndex: 1,
      description: "Logika Proposisional vs First-Order Logic (FOL), semi-decidability FOL, dan Teorema Levesque mengenai trade-off antara daya ekspresi bahasa representasi dan traktabilitas komputasi.",
      subchapters: [
        {
          id: "kr-bab-1-1",
          slug: "the-fundamental-tradeoff-levesque",
          title: "1.1. The Fundamental Trade-off: Ekspresivitas vs Traktabilitas Komputasi",
          orderIndex: 1,
          description: "Mengapa First-Order Logic murni tidak dapat digunakan untuk ontologi skala web secara real-time karena masalah ketidaktuntasan komputasi (semi-decidability).",
          content_markdown: `# 1.1. The Fundamental Trade-off: Ekspresivitas vs Traktabilitas Komputasi

## 1. Tujuan Pembelajaran
Mahasiswa mampu:
1. Menjelaskan Teorema Ketuntasan Turing dan batasan pembuktian pada First-Order Logic (Church-Turing Theorem: Entailment pada FOL bersifat semi-decidable).
2. Memahami *The Fundamental Trade-off in Knowledge Representation* (Levesque & Brachman, 1987):
   $$\\text{Semakin ekspresif suatu bahasa representasi} \\implies \\text{Semakin tinggi kompleksitas komputasi penalaran (NP-Hard / Undecidable)}$$
3. Menjustifikasi perlunya fragmen logika yang dapat diputuskan (*decidable fragments*), yang melahirkan keluarga **Logika Deskripsi (Description Logics)**.

## 2. Perbandingan Paradigma Bahasa Logika
| Formalisme | Ekspresivitas | Traktabilitas / Decidability | Kompleksitas Inferensi |
|:---|:---|:---|:---|
| **Propositional Logic** | Rendah (tidak ada objek/relasi) | Decidable | NP-Complete (SAT) |
| **Description Logics ($\mathcal{ALC}$)** | Sedang-Tinggi (konsep & peranan) | Decidable | PSPACE-Complete |
| **First-Order Logic (FOL)** | Sangat Tinggi (kuantor $\forall, \exists$ sembarang) | **Semi-Decidable** | Tidak terbatas (dapat infinite loop) |
| **Higher-Order Logic** | Maksimal (kuantifikasi predikat) | **Undecidable** | Non-computable |
`,
        },
      ],
    },
    {
      id: "kr-bab-2",
      slug: "logika-deskripsi-dan-ontologi-formal",
      title: "BAB 2: Logika Deskripsi (Description Logics $\\mathcal{ALC}$) & TBox/ABox",
      orderIndex: 2,
      description: "Sintaks formal konsep dan peranan, semantik interpretasi domain $\\Delta^\\mathcal{I}$, aksioma Terminological Box (TBox), Assertional Box (ABox), dan subsumpsi konsep $C \\sqsubseteq D$.",
      subchapters: [
        {
          id: "kr-bab-2-1",
          slug: "sintaks-dan-semantik-model-teoretis-alc",
          title: "2.1. Sintaks & Semantik Model-Teoretis Logika Deskripsi $\\mathcal{ALC}$",
          orderIndex: 1,
          description: "Formulasi matematis konstruktor konsep atomik, konjungsi, disjungsi, negasi, dan pembatas kuantor peranan.",
          content_markdown: `# 2.1. Sintaks & Semantik Model-Teoretis Logika Deskripsi $\\mathcal{ALC}$

## 1. Sintaks Konstruktor $\\mathcal{ALC}$ (Attributive Language with Complements)
Konsep $C, D$ dalam $\\mathcal{ALC}$ dibangun secara induktif melalui:

$$C, D \\longrightarrow A \\mid \\top \\mid \\bot \\mid \\neg C \\mid C \\sqcap D \\mid C \\sqcup D \\mid \\forall R.C \\mid \\exists R.C$$

Di mana:
- $A$: Nama konsep atomik (misal: $\\text{Mahasiswa}$, $\\text{MataKuliah}$).
- $R$: Nama peranan atomik / relasi biner (misal: $\\text{mengambil}$, $\\text{mengajar}$).

## 2. Semantik Interpretasi Model
Sebuah interpretasi $\\mathcal{I} = (\\Delta^\\mathcal{I}, \\cdot^\\mathcal{I})$ terdiri dari himpunan domain tak-kosong $\\Delta^\\mathcal{I}$ dan fungsi penafsiran $\\cdot^\\mathcal{I}$:

- $(C \\sqcap D)^\\mathcal{I} = C^\\mathcal{I} \\cap D^\\mathcal{I}$
- $(C \\sqcup D)^\\mathcal{I} = C^\\mathcal{I} \\cup D^\\mathcal{I}$
- $(\\neg C)^\\mathcal{I} = \\Delta^\\mathcal{I} \\setminus C^\\mathcal{I}$
- $(\\forall R.C)^\\mathcal{I} = \\{a \\in \\Delta^\\mathcal{I} \\mid \\forall b \\in \\Delta^\\mathcal{I}, (a, b) \\in R^\\mathcal{I} \\implies b \\in C^\\mathcal{I}\\}$
- $(\\exists R.C)^\\mathcal{I} = \\{a \\in \\Delta^\\mathcal{I} \\mid \\exists b \\in \\Delta^\\mathcal{I}, (a, b) \\in R^\\mathcal{I} \\land b \\in C^\\mathcal{I}\\}$

## 3. Subsumpsi & Kepuasan Konsep
- Konsep $C$ **disubsumsi** oleh $D$ ($C \\sqsubseteq D$) jika dan hanya jika $C^\\mathcal{I} \\subseteq D^\\mathcal{I}$ untuk setiap interpretasi $\\mathcal{I}$.
- Konsep $C$ **satisfiable** (dapat dipenuhi) jika terdapat minimal satu interpretasi $\\mathcal{I}$ sehingga $C^\\mathcal{I} \\ne \\emptyset$.
`,
        },
      ],
    },
    {
      id: "kr-bab-3",
      slug: "jaring-semantik-frame-dan-pewarisan",
      title: "BAB 3: Jaring Semantik (Semantic Networks) & Sistem Frame",
      orderIndex: 3,
      description: "Representasi graf berarah terlabel Quillian, relasi taksonomi IS-A dan Part-Of, slot and filler Minsky, serta anomali penalaran pewarisan jamak (Nixon Diamond).",
      subchapters: [
        {
          id: "kr-bab-3-1",
          slug: "jaring-semantik-dan-nixon-diamond",
          title: "3.1. Pewarisan Taksonomi & Anomali Non-Monotonik Nixon Diamond",
          orderIndex: 1,
          description: "Menganalisis konflik pewarisan sifat ketika sebuah simpul mewarisi nilai default yang kontradiktif dari dua superkelas berbeda.",
          content_markdown: `# 3.1. Pewarisan Taksonomi & Anomali Non-Monotonik Nixon Diamond

## 1. Paradigma Sistem Frame (Minsky, 1974)
Sebuah *Frame* adalah struktur data representasi objek prototipikal yang memiliki sekumpulan *Slots* (atribut) dan *Fillers* (nilai atau penunjuk ke frame lain):
- Mendukung nilai default (*Default Values*).
- Mendukung prosedur terlampir (*Attached Procedures / If-Needed Daemons*).

## 2. Dilema Nixon Diamond
Diberikan basis pengetahuan:
1. $\\text{Quaker}(x) \\implies \\text{Pacifist}(x)$ (Default: Penganut Quaker cinta damai).
2. $\\text{Republican}(x) \\implies \\neg \\text{Pacifist}(x)$ (Default: Penganut Republik tidak cinta damai).
3. $\\text{Nixon}$ adalah seorang $\\text{Quaker}$ dan seorang $\\text{Republican}$.

Apakah Nixon seorang pasifis?
$$\\text{Quaker}(\\text{Nixon}) \\land \\text{Republican}(\\text{Nixon}) \\implies \\text{Kontradiksi Pewarisan!}$$

Fenomena ini memicu lahirnya **Non-Monotonic Logic** (Default Logic Reiter & Circumscription McCarthy), membuktikan bahwa penambahan premis baru dapat membatalkan kesimpulan yang sebelumnya valid.
`,
        },
      ],
    },
    {
      id: "kr-bab-4",
      slug: "ekosistem-web-semantik-dan-rdf",
      title: "BAB 4: Ekosistem Web Semantik: RDF Triples & Turtle",
      orderIndex: 4,
      description: "Model data graf terhubung global (Linked Open Data), Internationalized Resource Identifiers (IRI), Tripel Subject-Predicate-Object, dan serialisasi Turtle / JSON-LD.",
      subchapters: [
        {
          id: "kr-bab-4-1",
          slug: "arsitektur-rdf-tripel-dan-turtle",
          title: "4.1. Representasi RDF Triples & Serialisasi Formal Turtle",
          orderIndex: 1,
          description: "Mendefinisikan pernyataan pengetahuan mesin yang terdistribusi secara global tanpa konflik nama namespace.",
          content_markdown: `# 4.1. Representasi RDF Triples & Serialisasi Formal Turtle

## 1. Anatomi Tripel RDF (W3C Standard)
Seluruh informasi dalam graf RDF didekomposisi ke dalam pernyataan tiga elemen:

$$\\langle s, \\; p, \\; o \\rangle \\in (\\mathcal{I} \\cup \\mathcal{B}) \\times \\mathcal{I} \\times (\\mathcal{I} \\cup \\mathcal{B} \\cup \\mathcal{L})$$

Di mana:
- $\\mathcal{I}$: Himpunan IRI global (Internationalized Resource Identifier).
- $\\mathcal{B}$: Himpunan Blank Nodes (simpul anonim tanpa nama publik).
- $\\mathcal{L}$: Himpunan Literal (nilai primitif string, integer, float, date dengan tipe data XML Schema \`xsd:*\`).

## 2. Serialisasi Turtle (Terse RDF Triple Language)
\`\`\`turtle
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl:  <http://www.w3.org/2002/07/owl#> .
@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .
@prefix vq:   <https://velqora.web.id/ontology/ai#> .

# Definisi Kelas Taksonomi
vq:MataKuliahAI rdf:type owl:Class ;
               rdfs:label "Mata Kuliah AI"@id .

# Definisi Relasi Properti Objek
vq:memilikiPrasyarat rdf:type owl:ObjectProperty ;
                     rdfs:domain vq:MataKuliahAI ;
                     rdfs:range vq:MataKuliahAI .

# Instansiasi Individu Pengetahuan
vq:cs_nlp_202 rdf:type vq:MataKuliahAI ;
              rdfs:label "Natural Language Processing" ;
              vq:bobotSKS "3"^^xsd:integer ;
              vq:memilikiPrasyarat vq:cs_ai_101 .
\`\`\`
`,
        },
      ],
    },
    {
      id: "kr-bab-5",
      slug: "ontologi-formal-owl-2-dan-tableau-reasoner",
      title: "BAB 5: Ontologi Formal OWL 2 & Algoritma Tableau",
      orderIndex: 5,
      description: "Profil bahasa ontologi W3C (OWL 2 EL, QL, RL, DL), aksioma kesetaraan dan disjoin, serta algoritma pembuktian Tableau untuk inferensi otomatis.",
      subchapters: [
        {
          id: "kr-bab-5-1",
          slug: "algoritma-tableau-dan-profil-owl2",
          title: "5.1. Algoritma Tableau untuk Uji Konsistensi Ontologi",
          orderIndex: 1,
          description: "Mencoba membangun pohon model interpretasi $\\mathcal{I}$ secara sistematis dan mendeteksi benturan (*clash*) konsep.",
          content_markdown: `# 5.1. Algoritma Tableau untuk Uji Konsistensi Ontologi

## 1. Prinsip Algoritma Tableau
Untuk membuktikan bahwa aksioma $C \\sqsubseteq D$ valid:
1. Ubah masalah subsumpsi menjadi uji ketidakterpenuhan (*unsatisfiability test*):
   $$C \\sqsubseteq D \\iff C \\sqcap \\neg D \\text{ bersifat unsatisfiable}$$
2. Inisialisasi graf pohon dengan satu individu $x$ yang memenuhi konsep $C \\sqcap \\neg D$.
3. Terapkan aturan ekspansi Tableau secara deterministik:
   - **Aturan $\\sqcap$**: Jika $(C_1 \\sqcap C_2) \\in \\mathcal{L}(x)$, tambahkan $C_1$ dan $C_2$ ke $\\mathcal{L}(x)$.
   - **Aturan $\\sqcup$**: Jika $(C_1 \\sqcup C_2) \\in \\mathcal{L}(x)$, buat cabang pencarian bercabang dua: satu dengan $C_1$, satu dengan $C_2$.
   - **Aturan $\\exists$**: Jika $\\exists R.C \\in \\mathcal{L}(x)$, buat simpul anak baru $y$ dengan tepi $R(x, y)$ dan $C \\in \\mathcal{L}(y)$.
   - **Aturan $\\forall$**: Jika $\\forall R.C \\in \\mathcal{L}(x)$ dan ada tepi $R(x, y)$, tambahkan $C$ ke $\\mathcal{L}(y)$.
4. Jika setiap cabang menghasilkan benturan (*Clash* / memuat $A$ dan $\\neg A$), maka konsep terbukti tidak dapat dipenuhi, sehingga $C \\sqsubseteq D$ **terbukti valid**!
`,
        },
      ],
    },
    {
      id: "kr-bab-6",
      slug: "praktikum-knowledge-graph-dan-sparql",
      title: "BAB 6: Praktikum Knowledge Graph & Kueri SPARQL Analitik",
      orderIndex: 6,
      description: "Membangun graf pengetahuan mandiri menggunakan Python library rdflib: konstruksi graf terprogram, inferensi RDFS/OWL, dan kueri analitik SPARQL.",
      subchapters: [
        {
          id: "kr-bab-6-1",
          slug: "proyek-rdflib-graph-engine",
          title: "6.1. Proyek Akhir: Pembangunan Knowledge Graph Kurikulum & Kueri SPARQL",
          orderIndex: 1,
          description: "Membangun Knowledge Graph akademik lengkap yang menghubungkan topik kuliah, prasyarat, dan modul pembelajaran dengan kueri relasi transitif.",
          content_markdown: `# 6.1. Proyek Akhir: Pembangunan Knowledge Graph Kurikulum & Kueri SPARQL

## 1. Spesifikasi Proyek Terapan
Mahasiswa menyelesaikan modul Python:
1. Membangun objek \`rdflib.Graph\`.
2. Menyusun tripel entitas mata kuliah dan relasi \`hasPrerequisite\`.
3. Menjalankan SPARQL analitik untuk menemukan seluruh mata kuliah yang memiliki beban $\ge 3$ SKS atau jalur prasyarat transitif.
4. Mengekspor graf ke format Turtle (\`.ttl\`) dan JSON-LD.

## 2. Kode Solusi Acuan Proyek
\`\`\`python
import rdflib
from rdflib import Graph, Literal, RDF, RDFS, Namespace, URIRef
from rdflib.namespace import XSD

# 1. Inisialisasi Graf Pengetahuan
g = Graph()
VQ = Namespace("https://velqora.web.id/ontology/curriculum#")
g.bind("vq", VQ)
g.bind("rdfs", RDFS)

# 2. Pembuatan Tripel Pengetahuan
courses = [
    ("cs101", "Dasar Pemrograman", 4, None),
    ("cs201", "Struktur Data & Algoritma", 4, "cs101"),
    ("cs301", "Artificial Intelligence Fundamentals", 3, "cs201"),
    ("cs302", "Machine Learning", 3, "cs301"),
    ("cs401", "Deep Learning", 3, "cs302"),
    ("cs402", "Large Language Model", 3, "cs401")
]

for cid, title, sks, prereq_id in courses:
    course_uri = VQ[cid]
    g.add((course_uri, RDF.type, VQ.Course))
    g.add((course_uri, RDFS.label, Literal(title, datatype=XSD.string)))
    g.add((course_uri, VQ.creditUnits, Literal(sks, datatype=XSD.integer)))
    if prereq_id:
        g.add((course_uri, VQ.hasPrerequisite, VQ[prereq_id]))

print(f"Total Tripel Tersimpan: {len(g)}")

# 3. Eksekusi Kueri SPARQL: Jalur Prasyarat Berantai
query_str = """
PREFIX vq: <https://velqora.web.id/ontology/curriculum#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?courseTitle ?prereqTitle ?sks
WHERE {
    ?course a vq:Course ;
            rdfs:label ?courseTitle ;
            vq:creditUnits ?sks ;
            vq:hasPrerequisite ?prereq .
    ?prereq rdfs:label ?prereqTitle .
}
ORDER BY ?courseTitle
"""

results = g.query(query_str)
print("\\nHasil Kueri SPARQL (Relasi Prasyarat Langsung):")
for row in results:
    print(f"  • {row.courseTitle} ({row.sks} SKS) -> Butuh: {row.prereqTitle}")
\`\`\`
`,
        },
      ],
    },
  ],
};
