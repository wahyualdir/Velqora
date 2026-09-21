# -*- coding: utf-8 -*-
"""
Script untuk memperkaya dan menyempurnakan seluruh 40 subbab Chunk 2 (Bab 6 - 9) Topik 10:
1. Menjamin setiap subbab memiliki Gambaran Teori >= 210 kata dengan formulasi formal LaTeX ($ dan $$).
2. Memastikan ketiga kutipan kanonikal verbatim (Zaharia 2012, Armbrust 2015, Kreps 2011) dipertahankan 100% persis.
3. Memperbaiki kode snippet nondeterministik di Bab 7 (10.7.4, 10.7.6, 10.7.7) menjadi 100% deterministik.
4. Mengeksekusi ulang seluruh 40 kode snippet Python 3 dan menyinkronkan output aktual ke codeSnippetOutput.
5. Menyimpan data yang sudah disempurnakan ke berkas JSON masing-masing.
"""

import os
import sys
import json
import io
import contextlib

sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.dirname(os.path.abspath(__file__))

print("=== MEMULAI PENYEMPURNAAN KONTEN SUBSTANTIF CHUNK 2 (BAB 6 - 9) ===")

# -------------------------------------------------------------
# 1. PERBAIKAN & ENRICHMENT BAB 6
# -------------------------------------------------------------
ch6_file = os.path.join(base_dir, "de_ch6_data.json")
with open(ch6_file, "r", encoding="utf-8") as f:
    ch6 = json.load(f)

# 10.6.1
ch6[0]["content"]["theory"] = (
    "**Apache Spark** mengadopsi arsitektur komputasi terdistribusi berbasis paradigma **Master-Worker (Driver-Executor Architecture)** yang dirancang untuk mengeksekusi beban kerja pemrosesan data paralel skala besar di atas kluster komoditas. "
    "Komponen fisik utama arsitektur Spark terdiri dari: "
    "1. **Spark Driver**: Proses master pusat yang mengeksekusi fungsi `main()` dari aplikasi pengguna. Driver bertanggung jawab atas: "
    "   - Menginisialisasi `SparkSession` dan `SparkContext` sebagai titik kontak utama ekosistem. "
    "   - Mengonversi kode logika pengguna menjadi **Directed Acyclic Graph (DAG)** komputasi terdistribusi. "
    "   - Mengorkestrasi pembagian DAG menjadi tahapan eksekusi (*Stages*) dan paket tugas atomik (*Tasks*). "
    "   - Mengoordinasikan penugasan task ke executor melalui komponen `DAGScheduler` dan `TaskScheduler`. "
    "2. **Cluster Manager**: Layanan eksternal (Apache YARN, Kubernetes, Apache Mesos, atau Standalone Manager) yang bertugas menegosiasikan dan mengalokasikan sumber daya perangkat keras (CPU core dan RAM) pada node fisik kluster. "
    "3. **Executors**: Proses worker JVM independen yang berjalan pada node pekerja kluster. Setiap executor memiliki slot thread paralel yang mengeksekusi task dan menyimpan partisi data dalam memori cache: "
    "$$N_{\\text{parallel\\_tasks}} = \\sum_{e=1}^{E} \\text{Cores}_e$$ "
    "Total kapasitas memori kluster yang dapat dialokasikan dihitung melalui relasi: "
    "$$M_{\\text{cluster}} = N_{\\text{executors}} \\times (M_{\\text{heap}} + M_{\\text{offheap}})$$ "
    "Setiap executor mengirimkan sinyal detak jantung (*heartbeat*) secara periodik ke Driver dengan interval $\\tau_{\\text{heartbeat}} = 10\\text{ detik}$. "
    "Jika sebuah executor tidak merespons dalam ambang batas $\\tau_{\\text{timeout}} = 120\\text{ detik}$, Driver menganggap worker tersebut telah gagal (*node failure*) dan secara otomatis menjadwalkan ulang seluruh task yang hilang ke executor lain yang masih sehat berdasarkan silsilah DAG (*lineage recovery*)."
)

# 10.6.2 (Zaharia quote preserved verbatim)
ch6[1]["content"]["theory"] = (
    "Fondasi konseptual revolusi Apache Spark berakar pada makalah mani Matei Zaharia et al. (USENIX NSDI 2012) yang memperkenalkan abstraksi **Resilient Distributed Datasets (RDD)**. Makalah tersebut menyatakan secara resmi dalam abstraknya: "
    "\"We present Resilient Distributed Datasets (RDDs), a distributed memory abstraction that lets programmers perform in-memory computations on large clusters in a fault-tolerant manner. RDDs are motivated by two types of applications that current computing frameworks handle inefficiently: iterative algorithms and interactive data mining tools. In both cases, keeping data in memory can improve performance by an order of magnitude. To achieve fault tolerance efficiently, RDDs provide a restricted form of shared memory, based on coarse-grained transformations rather than fine-grained updates to shared state. However, we show that RDDs are expressive enough to capture a wide class of computations, including recent specialized programming models for iterative jobs, such as Pregel, and new applications that these models do not capture. We have implemented RDDs in a system called Spark, which we evaluate through a variety of user applications and benchmarks.\" "
    "Secara formal, RDD dimodelkan sebagai tupel 5 komponen esensial: "
    "$$\\mathcal{R} = \\langle \\mathcal{P}, \\text{deps}, f_{\\text{compute}}, \\text{partitioner}, \\text{preferredLocations} \\rangle$$ "
    "Di mana $\\mathcal{P} = \\{p_1, p_2, \\dots, p_k\\}$ adalah himpunan partisi data terdistribusi atomik, $\\text{deps}$ adalah silsilah ketergantungan deterministik (*deterministic lineage*), $f_{\\text{compute}}$ adalah fungsi iterator untuk menghasilkan data partisi dari partisi induk, $\\text{partitioner}$ mendefinisikan skema pembagian kunci (misalnya `HashPartitioner`), dan $\\text{preferredLocations}$ mencatat informasi penempatan fisik blok untuk mengoptimalkan lokalisasi komputasi data (*data locality*). "
    "Dengan mengandalkan transformasi coarse-grained dan pelacakan silsilah lineage ketimbang replikasi fisik data secara sinkron melintasi disk jaringan, RDD mencapai toleransi kesalahan yang sangat hemat biaya overhead komputasi."
)

# 10.6.3
ch6[2]["content"]["theory"] = (
    "Komputasi pada Apache Spark beroperasi di bawah dua kategori operasi yang berbeda secara mendasar: **Transformations** dan **Actions**. "
    "1. **Transformations (Transformasi)**: Operasi yang menerima satu RDD/DataFrame dan menghasilkan RDD/DataFrame baru (seperti `map`, `filter`, `flatMap`, `groupByKey`, `select`). "
    "Transformasi bersifat **Lazy (Evaluasi Malas)**: Spark tidak langsung mengeksekusi operasi atau membaca data saat baris kode transformasi dipanggil. Sebaliknya, Spark hanya mencatat operasi tersebut ke dalam silsilah logis (*Lineage Graph*): "
    "$$\\mathcal{L}(R_n) = f_n(\\mathcal{L}(R_{n-1})) = (f_n \\circ f_{n-1} \\circ \\dots \\circ f_1)(R_0)$$ "
    "Keuntungan utama evaluasi malas adalah memberikan kesempatan bagi mesin pengoptimal kueri (Catalyst Optimizer) untuk menganalisis keseluruhan alur kerja secara holistik dan melakukan optimasi agresif, seperti penggabungan filter (*predicate pushdown*) dan eliminasi kolom yang tidak terpakai (*projection pruning*). "
    "2. **Actions (Tindakan)**: Operasi yang memicu eksekusi nyata dari seluruh rangkaian transformasi yang telah dicatat sebelumnya (seperti `count()`, `collect()`, `save()`, `take()`, `reduce()`). "
    "Saat suatu tindakan dipanggil, Spark Driver mengubah grafik silsilah menjadi rencana eksekusi fisik, membaginya menjadi beberapa Stage dan Task, lalu mengirimkannya ke kluster pekerja untuk dieksekusi secara instan. Total durasi komputasi tervektorisasi memenuhi: "
    "$$T_{\\text{pipelined}} \\ll \\sum_{i=1}^n T(f_i)$$"
)

# 10.6.4
ch6[3]["content"]["theory"] = (
    "Saat aplikasi Spark memicu suatu Action, Driver mengonversi silsilah transformasi menjadi **Directed Acyclic Graph (DAG)**. "
    "DAG Scheduler bertugas memecah DAG besar tersebut menjadi serangkaian tahapan fisik yang disebut **Stages**. "
    "Batas pemisahan stage (*Stage Boundary*) ditentukan secara ketat oleh jenis ketergantungan antar-partisi data: "
    "1. **Narrow Dependency (Ketergantungan Sempit)**: "
    "Setiap partisi pada RDD induk digunakan oleh paling banyak satu partisi pada RDD anak (relasi $1:1$ atau $N:1$, misal pada `map()`, `filter()`). Operasi ini tidak memerlukan pertukaran data antar-node jaringan, sehingga beberapa transformasi berturutan dapat digabungkan (*pipelined*) ke dalam satu Stage eksekusi tunggal: "
    "$$\\text{Complexity}_{\\text{Narrow}} = \\mathcal{O}(N_{\\text{local\\_records}})$$ "
    "2. **Wide Dependency / Shuffle Dependency (Ketergantungan Lebar)**: "
    "Beberapa partisi anak bergantung pada data dari seluruh partisi induk (relasi $M:N$, misal pada `groupByKey()`, `reduceByKey()`, `join()`). Ketergantungan lebar memaksa terjadinya **Shuffle**: data harus disortir, dipartisi ulang berdasarkan kunci, dan ditransfer melintasi jaringan ke worker lain. "
    "Shuffle berfungsi sebagai **Tembok Pemisah Stage (Stage Barrier)**, membagi eksekusi menjadi: "
    "$$\\text{Stage}_k \\xrightarrow{\\text{Shuffle Write (Disk)}} \\text{Network Transfer} \\xrightarrow{\\text{Shuffle Read}} \\text{Stage}_{k+1}$$ "
    "Jika terjadi kegagalan node pada partisi narrow, Spark cukup menghitung ulang partisi lokal yang hilang tanpa mengulang seluruh stage."
)

# 10.6.5
ch6[4]["content"]["theory"] = (
    "Evolusi abstraksi data Apache Spark bergerak dari tingkat rendah (Low-Level RDD) menuju API terstruktur tingkat tinggi: **DataFrame** dan **Dataset**. "
    "1. **Keterbatasan RDD**: RDD beroperasi pada objek Java/Python mentah tanpa pemahaman skema (*opaque objects*). Akibatnya, JVM menanggung biaya overhead objek yang sangat besar (header objek, garbage collection overhead) dan mesin komputasi tidak dapat mengoptimalkan rencana eksekusi kueri. "
    "2. **Spark DataFrame**: Koleksi data terdistribusi yang diorganisir ke dalam kolom-kolom bernama (*named columns*), setara secara konseptual dengan tabel basis data relasional. "
    "DataFrame bersifat *untyped* pada waktu kompilasi di Java/Scala (`Dataset[Row]`), namun dioptimalkan secara penuh oleh **Catalyst Optimizer** dan disimpan dalam format biner kompak off-heap oleh **Project Tungsten**. Rasio jejak memori memenuhi: "
    "$$\\text{Size}_{\\text{Tungsten}} \\le 0.2 \\times \\text{Size}_{\\text{Java Object Heap}}$$ "
    "3. **Spark Dataset**: Ekstensi berorientasi tipe data kuat (*strongly typed*) yang tersedia pada Scala dan Java (`Dataset[T]`). Dataset menggabungkan kenyamanan pemrograman berorientasi objek (type-safety pada waktu kompilasi) dengan keunggulan performa Catalyst melalui *Encoders*: serialisasi biner tanpa memerlukan overhead Java Serialization standar: "
    "$$\\mathcal{E}: T \\xrightarrow{\\text{CodeGen}} \\text{InternalRow (Off-Heap Binary)}$$"
)

# 10.6.6
ch6[5]["content"]["theory"] = (
    "Dalam ekosistem Apache Spark 2.0 ke atas, **SparkSession** bertindak sebagai titik masuk (*unified entry point*) terpadu untuk berinteraksi dengan seluruh kapabilitas Spark (Spark Core, Spark SQL, Streaming, dan integrasi Hive). "
    "Saat membaca data terdistribusi (misalnya file Parquet, CSV, atau tabel database), SparkSession mengoordinasikan pembagian data fisik menjadi partisi-partisi komputasi logis (*Input Splits*): "
    "$$S_{\\text{split}} = \\max\\left(\\text{minSplitSize}, \\min\\left(\\text{maxSplitSize}, \\text{blockSize}\\right)\\right)$$ "
    "Di mana $\\text{blockSize}$ adalah ukuran blok penyimpanan fisik (misal 128 MB pada HDFS atau blok Cloud Storage). "
    "Setiap Input Split dipetakan secara deterministik menjadi tepat satu partisi Spark, yang selanjutnya dieksekusi oleh satu thread Task independen pada executor. "
    "Spark menerapkan prinsip **Data Locality (Lokalisasi Data)** untuk meminimalkan transfer I/O jaringan. Tingkat hierarki kedekatan data diprioritaskan dari yang paling efisien: "
    "1. `PROCESS_LOCAL`: Data berada di memori JVM executor yang sama dengan task. "
    "2. `NODE_LOCAL`: Data berada di disk atau cache node fisik yang sama. "
    "3. `RACK_LOCAL`: Data berada di rak jaringan server yang sama. "
    "4. `ANY`: Data berada di luar rak dan harus ditransfer melintasi switch jaringan utama kluster."
)

# 10.6.7
ch6[6]["content"]["theory"] = (
    "**PySpark** memungkinkan praktisi data mengeksekusi komputasi data terdistribusi menggunakan sintaks Python modern melalui antarmuka DataFrame terstruktur. "
    "Operasi dasar PySpark mencakup transformasi relasional inti: "
    "1. `select()`: Proyeksi kolom data yang diinginkan untuk memangkas atribut yang tidak relevan (*projection pruning*). "
    "2. `filter()` atau `where()`: Evaluasi kondisi baris menggunakan predikat logika, yang dipasok langsung ke lapisan penyimpanan fisik (*predicate pushdown*). "
    "3. `withColumn()`: Pembuatan kolom turunan baru atau transformasi nilai kolom yang ada. "
    "4. `groupBy()` dan fungsi agregasi `agg()` (`sum`, `avg`, `count`, `max`): Mengelompokkan data berdasarkan satu atau lebih dimensi kunci. "
    "Secara arsitektural, kueri PySpark diterjemahkan menjadi rencana pohon ekspresi Catalyst di sisi JVM driver melalui jembatan Py4J atau Apache Arrow. "
    "Dengan demikian, operasi transformasi relasional pada PySpark memiliki kecepatan eksekusi yang identik dengan kode Scala asli karena seluruh kalkulasi berlangsung di mesin biner C++/Java Tungsten tanpa melalui overhead interpreter Python: "
    "$$\\text{Throughput}_{\\text{PySpark Catalyst}} \\approx \\text{Throughput}_{\\text{Scala Spark SQL}} \\gg \\text{Throughput}_{\\text{Python UDF}}$$"
)

# 10.6.8
ch6[7]["content"]["theory"] = (
    "Operasi penggabungan dua dataset terdistribusi (**Distributed Join**) merupakan salah satu operasi komputasi paling intensif sumber daya dalam pemrosesan data skala besar. "
    "Spark menyediakan dua strategi fisik join yang fundamental: "
    "1. **Shuffle Hash Join / Sort Merge Join (SMJ)**: "
    "Kedua tabel (Dataset A dan Dataset B) berukuran besar ($|A|, |B| \\gg \\text{RAM Executor}$). "
    "Spark harus melakukan **Full Network Shuffle**: kedua tabel dipartisi ulang berdasarkan nilai hash kolom join kunci: "
    "$$P(K) = \\text{Hash}(K) \\pmod{N_{\\text{partitions}}}$$ "
    "Setelah transfer data jaringan selesai, data pada setiap partisi disortir berdasarkan kunci sebelum digabungkan. Biaya komputasi dan jaringan: "
    "$$\\text{Cost}_{\\text{Shuffle}} = \\mathcal{O}(|A| + |B|) \\text{ transfer jaringan} + \\mathcal{O}(|A| \\log |A| + |B| \\log |B|) \\text{ penyortiran lokal}$$ "
    "2. **Broadcast Hash Join (BHJ)**: "
    "Salah satu tabel berukuran kecil (misal tabel dimensi $B \\le 10\\text{ MB}$). "
    "Spark Driver mengunduh tabel kecil tersebut, lalu mengirimkan salinan utuhnya ke seluruh executor kluster melalui protokol broadcast efisien. "
    "Executor membangun hash table di memori lokal dan memindai partisi lokal tabel besar $A$ secara streaming: "
    "$$\\text{Cost}_{\\text{BHJ}} = \\mathcal{O}(|A|) \\quad (\\text{Zero Network Shuffle pada Tabel } A!)$$"
)

# 10.6.9
ch6[8]["content"]["theory"] = (
    "Mulai dari Spark 1.6, **Unified Memory Manager (Manajer Memori Terpadu)** diperkenalkan untuk menggantikan model alokasi memori statis lawas yang kaku. "
    "Pada model Unified Memory, total memori heap JVM pada setiap executor dibagi menjadi wilayah fungsional yang terdefinisi secara ketat: "
    "1. **Reserved Memory**: 300 MB memori sistem yang dicadangkan mutlak untuk keperluan internal Spark framework. "
    "2. **User Memory**: 40% dari sisa memori, digunakan untuk struktur data buatan pengguna, metadata RDD, dan pencegahan error OOM. "
    "3. **Spark Memory (Unified Pool)**: 60% dari total memori yang dapat digunakan: "
    "$$M_{\\text{usable}} = (M_{\\text{total}} - 300\\text{ MB}) \\times 0.60$$ "
    "Kolam terpadu ini dibagi secara fleksibel menjadi dua sub-wilayah: "
    "   - **Storage Memory**: Digunakan untuk menyimpan partisi RDD yang di-cache dan data broadcast (default 50% dari Spark Memory). "
    "   - **Execution Memory**: Digunakan untuk komputasi aktif selama shuffle, join, sort, dan agregasi sementara. "
    "Aturan batas dinamis (*dynamic borrowing rule*) menetapkan bahwa Execution Memory berhak meminjam ruang Storage Memory yang sedang menganggur. "
    "Bahkan, jika Execution Memory membutuhkan ruang tambahan untuk operasi shuffle yang mendesak, Execution Memory berhak **menggusur (evict)** blok cache Storage Memory ke disk. Sebaliknya, Storage Memory tidak pernah diizinkan menggusur Execution Memory yang sedang aktif."
)

# 10.6.10
ch6[9]["content"]["theory"] = (
    "Dalam pipeline analitik dan pelatihan model machine learning iteratif (seperti k-means atau gradient descent), dataset yang sama sering kali diakses berulang kali oleh puluhan Action yang berbeda. "
    "Secara default, Spark akan mengevaluasi ulang silsilah transformasi dari sumber penyimpanan awal setiap kali suatu Action dipanggil. "
    "Untuk menghindari komputasi ulang yang boros I/O, Spark menyediakan mekanisme **Caching** dan **Persistence**: "
    "1. `.cache()`: Menyimpan DataFrame ke dalam memori menggunakan tingkat penyimpanan default `MEMORY_AND_DISK` (pada DataFrame) atau `MEMORY_ONLY` (pada RDD). "
    "2. `.persist(StorageLevel)`: Memberikan fleksibilitas penuh untuk memilih strategi penyimpanan fisik: "
    "   - `MEMORY_ONLY`: Data disimpan sebagai objek Java mentah yang tidak diserialisasi di RAM. Memberikan latensi akses tercepat namun jejak memori paling boros. "
    "   - `MEMORY_ONLY_SER`: Data disimpan sebagai byte array terkompresi di RAM. Menghemat ruang RAM hingga 3x lipat dengan sedikit penalti deserialisasi CPU. "
    "   - `MEMORY_AND_DISK`: Jika data meluap melebihi kapasitas RAM, partisi yang meluap dituliskan ke disk lokal worker. "
    "   - `OFF_HEAP`: Disimpan di luar heap JVM menggunakan memori Tungsten untuk menghindari overhead Garbage Collection. "
    "Kriteria matematis keputusan caching didasarkan pada trade-off: "
    "$$\\Delta T = (K - 1) \\times T_{\\text{recompute}} - (T_{\\text{cache\\_write}} + K \\times T_{\\text{cache\\_read}}) > 0$$ "
    "Di mana $K$ adalah frekuensi kueri downstream yang menggunakan dataset tersebut."
)

with open(ch6_file, "w", encoding="utf-8") as f:
    json.dump(ch6, f, indent=6, ensure_ascii=False)
print("[OK] Bab 6 disempurnakan (teori expanded, Zaharia quote preserved).")

# -------------------------------------------------------------
# 2. PERBAIKAN & ENRICHMENT BAB 7
# -------------------------------------------------------------
ch7_file = os.path.join(base_dir, "de_ch7_data.json")
with open(ch7_file, "r", encoding="utf-8") as f:
    ch7 = json.load(f)

# 10.7.1 (Armbrust quote preserved verbatim)
ch7[0]["content"]["theory"] = (
    "Revolusi integrasi kueri relasional dan komputasi fungsional dalam Apache Spark dirumuskan secara formal dalam publikasi tengara Michael Armbrust et al. (ACM SIGMOD 2015) berjudul *Spark SQL: Relational Data Processing in Spark*. Abstrak resmi makalah tersebut menegaskan: "
    "\"Spark SQL is a new module in Apache Spark that integrates relational processing with Spark’s functional programming API. Built on our experience with Shark, Spark SQL lets Spark programmers leverage the benefits of relational processing (e.g., declarative queries and optimized storage), and lets SQL users call complex analytics libraries in Spark (e.g., machine learning). Compared to previous systems, Spark SQL makes two main additions. First, it offers much tighter integration between relational and procedural processing, through a declarative DataFrame API that integrates with procedural Spark code. Second, it includes a highly extensible optimizer, Catalyst, built using features of the Scala programming language, that makes it easy to add composable rules, control code generation, and define extension points. Using Catalyst, we have built a variety of features (e.g., schema inference for JSON, machine learning types, and query federation to external databases) tailored for the complex needs of modern data analysis. We see Spark SQL as an evolution of both SQL-on-Spark and of Spark itself, offering richer APIs and optimizations while keeping the benefits of the Spark programming model.\" "
    "Landasan teori Spark SQL berpusat pada pemanfaatan representasi relasional deklaratif untuk membuka pintu bagi serangkaian optimasi komputasi otomatis yang mustahil dilakukan pada kode prosedural RDD mentah. "
    "Rencana kueri deklaratif dimodelkan sebagai pohon operator relasional: "
    "$$\\mathcal{T}_{\\text{plan}} = \\text{Project}(\\text{Filter}(\\text{Join}(\\text{Relation}_A, \\text{Relation}_B)))$$ "
    "Setiap simpul pada pohon merepresentasikan ekspresi atau operator aljabar relasional yang dapat ditransformasikan secara ekuivalen menggunakan aturan optimasi formal (*rewrite rules*)."
)

# 10.7.2
ch7[1]["content"]["theory"] = (
    "**Catalyst Optimizer** adalah mesin pengoptimal kueri ekstensibel berbasis bahasa Scala yang menjadi jantung pemrosesan Spark SQL dan DataFrame API. "
    "Catalyst mentransformasikan representasi pohon ekspresi kueri pengguna melalui empat fase sistematis yang terdefinisi secara matematis: "
    "1. **Analysis (Analisis Logis)**: "
    "Kueri SQL atau DataFrame mentah dikonversi menjadi *Unresolved Logical Plan*. Pada tahap ini, nama tabel dan kolom belum diverifikasi keberadaannya. Analyzer memanfaatkan antarmuka `Catalog` (penyimpan metadata skema) untuk memvalidasi tipe data dan menyelesaikan referensi atribut menjadi *Resolved Logical Plan*: "
    "$$\\mathcal{P}_{\\text{unresolved}} \\xrightarrow{\\text{Catalog Verification}} \\mathcal{P}_{\\text{resolved}}$$ "
    "2. **Logical Optimization (Optimasi Logis)**: "
    "Menerapkan serangkaian aturan optimasi aljabar relasional berbasis pola (*Pattern-Matching Rule Batches*). Aturan utama meliputi: "
    "   - **Predicate Pushdown**: Memindahkan operasi pemfilteran (`WHERE` / `Filter`) sedekat mungkin ke lapisan penyimpanan data untuk mengurangi volume baris yang dibaca: "
    "$$\\sigma_p(R \\bowtie S) \\equiv (\\sigma_p(R)) \\bowtie S$$ "
    "   - **Projection Pruning**: Mengeliminasi kolom yang tidak pernah digunakan oleh kueri hilir. "
    "   - **Constant Folding**: Menyederhanakan kalkulasi statis pada waktu kompilasi (misal $1000 \\times 60 \\to 60000$). "
    "3. **Physical Planning (Perencanaan Fisik)**: "
    "Mengubah satu rencana logis teroptimasi menjadi beberapa kandidat rencana eksekusi fisik. Catalyst mengevaluasi biaya komputasi masing-masing kandidat menggunakan **Cost-Based Optimizer (CBO)** untuk memilih strategi terbaik (misal memilih antara Broadcast Hash Join vs Sort-Merge Join). "
    "4. **Code Generation (Pembangkitan Kode Mesin)**: "
    "Menghasilkan bytecode Java yang sangat efisien menggunakan Whole-Stage Code Generation untuk mengeksekusi rencana fisik secara native."
)

# 10.7.3
ch7[2]["content"]["theory"] = (
    "Seiring berkembangnya perangkat keras modern dengan jaringan berkecepatan tinggi (10GbE/100GbE) dan media penyimpanan NVMe SSD ultra-cepat, bottleneck komputasi Big Data bergeser dari I/O disk/jaringan ke **efisiensi CPU dan arsitektur memori**. "
    "Untuk mengatasi keterbatasan ini, Spark meluncurkan **Project Tungsten** yang merevolusi mesin komputasi melalui tiga pilar arsitektur utama: "
    "1. **Memory Management & Binary Processing (Off-Heap Binary)**: "
    "Alih-alih membuat objek Java berukuran besar di heap JVM yang membebani Garbage Collector, Tungsten menyimpan baris data dalam format biner kompak (*Tungsten Binary Row*) langsung di luar heap (menggunakan `sun.misc.Unsafe`): "
    "$$\\text{Row}_{\\text{Tungsten}} = \\langle \\text{NullBitset}, \\text{FixedLengthFields}, \\text{VariableLengthBytes} \\rangle$$ "
    "Desain ini mengeliminasi overhead referensi objek 64-bit dan memangkas jeda Garbage Collection (*zero GC pause*). "
    "2. **Cache-Aware Computation (Keselarasan Hierarki Cache CPU)**: "
    "Menata tata letak memori algoritma sortir dan hash join agar selaras dengan ukuran garis cache prosesor L1, L2, dan L3 (64-byte cache lines), memaksimalkan *CPU cache hits* dan menghindari *cache miss latency* yang memakan ratusan siklus CPU. "
    "3. **Whole-Stage Code Generation (WSCG)**: "
    "Menggantikan paradigma eksekusi klasik **Volcano Iterator Model** (di mana setiap baris data memanggil fungsi virtual `next()` berulang kali) dengan mengompilasi seluruh tahapan operator fisik menjadi satu fungsi Java monolitik datar (*single flat loop*): "
    "$$\\text{CallOverhead}_{\\text{Volcano}} = \\mathcal{O}(N_{\\text{records}} \\times N_{\\text{operators}}) \\longrightarrow \\text{CodeGen} = \\mathcal{O}(1)$$"
)

# 10.7.4 (Deterministic hash fix!)
ch7[3]["content"]["theory"] = (
    "**Shuffle** adalah operasi penataan ulang data (*all-to-all data redistribution*) melintasi seluruh partisi dan node kluster untuk menyatukan data dengan kunci yang sama pada satu tempat (misal pada `groupBy`, `join`, `distinct`). "
    "Shuffle merupakan fase paling rentan mengalami kegagalan dan bottleneck performa karena melibatkan gabungan beban CPU, RAM, disk I/O, dan bandwidth jaringan. "
    "Anatomi proses Shuffle terbagi menjadi dua fase utama: "
    "1. **Shuffle Write (Map Side)**: "
    "Setiap map task mempartisi baris data berdasarkan nilai hash kunci secara deterministik: "
    "$$\\text{TargetPartition} = \\text{Hash}(K) \\pmod{N_{\\text{reduce\\_partitions}}}$$ "
    "Data dimasukkan ke dalam buffer memori `AppendOnlyMap`. "
    "Jika volume data di buffer memori melampaui ambang batas keamanan RAM ($V_{\\text{records}} \\ge M_{\\text{buffer\\_limit}}$), Spark secara terpaksa melakukan **Disk Spill**: menyortir data di memori dan menumpahkannya ke disk lokal worker sebagai file sementara terkompresi. "
    "2. **Shuffle Read (Reduce Side)**: "
    "Setiap reduce task menghubungi seluruh executor lain via jaringan (Netty server) untuk mengambil (*fetch*) blok-blok partisi yang menjadi hak miliknya. "
    "Metrik **Spill (Memory)** menunjukkan ukuran data sebelum kompresi saat berada di RAM, sedangkan **Spill (Disk)** menunjukkan ukuran data fisik setelah dikompresi di disk lokal: "
    "$$\\text{SpillRatio} = \\frac{\\text{Size}_{\\text{Spill (Memory)}}}{\\text{Size}_{\\text{Spill (Disk)}}} \\approx 2.5 - 4.0$$ "
    "Tingginya disk spill menandakan kebutuhan mendesak untuk memperbesar memori executor atau menaikkan jumlah partisi shuffle."
)
ch7[3]["content"]["codeSnippet"] = (
    "# Implementasi Simulator Map-Side Shuffle Partitioning & Disk Spilling Deterministik\n"
    "class ShuffleMapSimulator:\n"
    "    def __init__(self, num_reducers=3, memory_buffer_limit=5):\n"
    "        self.num_reducers = num_reducers\n"
    "        self.buffer_limit = memory_buffer_limit\n"
    "        self.memory_buffer = []\n"
    "        self.spill_files = []\n"
    "        \n"
    "    def process_record(self, key, value):\n"
    "        # Hashing deterministik: jumlah nilai ordinal karakter kunci\n"
    "        target_reducer = sum(ord(c) for c in key) % self.num_reducers\n"
    "        self.memory_buffer.append((target_reducer, key, value))\n"
    "        \n"
    "        # Evaluasi apakah buffer memori meluap -> Lakukan Disk Spill!\n"
    "        if len(self.memory_buffer) >= self.buffer_limit:\n"
    "            self._spill_to_disk()\n"
    "            \n"
    "    def _spill_to_disk(self):\n"
    "        # Urutkan berdasarkan target_reducer lalu simpan ke disk simulasi\n"
    "        sorted_records = sorted(self.memory_buffer, key=lambda x: (x[0], x[1]))\n"
    "        spill_id = len(self.spill_files) + 1\n"
    "        self.spill_files.append({\n"
    "            'spill_id': spill_id,\n"
    "            'records_count': len(sorted_records),\n"
    "            'data': sorted_records\n"
    "        })\n"
    "        self.memory_buffer = []  # Kosongkan buffer memori\n"
    "\n"
    "sim = ShuffleMapSimulator(num_reducers=3, memory_buffer_limit=4)\n"
    "input_events = [\n"
    "    ('k1', 10), ('k2', 20), ('k3', 30), ('k1', 40), # Memicu Spill 1\n"
    "    ('k2', 50), ('k1', 60), ('k3', 70), ('k2', 80), # Memicu Spill 2\n"
    "    ('k1', 90)\n"
    "]\n"
    "\n"
    "for k, v in input_events:\n"
    "    sim.process_record(k, v)\n"
    "\n"
    "print(f'Simulasi Shuffle Map-Side ({len(input_events)} Event, Batas Buffer={sim.buffer_limit}):')\n"
    "print(f'  Jumlah File Disk Spill: {len(sim.spill_files)} berkas tumpahan')\n"
    "for s in sim.spill_files:\n"
    "    print(f'    - [Spill File #{s[\"spill_id\"]}] Berisi {s[\"records_count\"]} record terurut: {s[\"data\"]}')\n"
    "print(f'  Sisa Data di Memori Buffer: {sim.memory_buffer}')\n"
    "print('Kesimpulan: Disk spill menjaga task tidak OOM namun menimbulkan penalti latensi I/O.')"
)

# 10.7.5
ch7[4]["content"]["theory"] = (
    "Jumlah dan ukuran partisi data terdistribusi merupakan tuas kontrol paling berpengaruh terhadap pemanfaatan CPU dan memori kluster Spark. "
    "Secara default, parameter `spark.sql.shuffle.partitions` bernilai **200**. Angka ini sering kali terlalu besar untuk dataset kecil (< 1 GB) dan terlalu kecil untuk dataset skala terabyte (di mana ukuran partisi ideal berkisar antara 100 MB hingga 200 MB). "
    "Untuk mengatur ulang partisi data, Spark menyediakan dua metode fundamental: "
    "1. **`repartition(N)` (Full Shuffle Partitioning)**: "
    "Melakukan pembagian ulang data secara acak terdistribusi seragam atau berdasarkan hash kolom kunci. "
    "Karakteristik: melibatkan dependensi lebar (**Wide Dependency** / Full Shuffle). "
    "Dapat digunakan untuk **menambah maupun mengurangi** jumlah partisi. Menghasilkan ukuran partisi yang sangat seimbang merata di seluruh executor kluster. "
    "2. **`coalesce(N)` (Narrow Partition Consolidation)**: "
    "Menggabungkan partisi-partisi lokal yang berdampingan pada worker yang sama tanpa melakukan pertukaran jaringan (*no shuffle*). "
    "Karakteristik: bersifat dependensi sempit (**Narrow Dependency**). "
    "Hanya dapat digunakan untuk **mengurangi** jumlah partisi ($N_{\\text{new}} < N_{\\text{current}}$): "
    "$$\\text{Complexity}(\\text{coalesce}) = \\mathcal{O}(N_{\\text{local}}) \\ll \\text{Complexity}(\\text{repartition}) = \\mathcal{O}(N \\log N + \\text{Network})$$ "
    "Jika `coalesce` dipanggil secara keliru untuk menaikkan partisi, Spark mengabaikannya secara diam-diam karena partisi tidak mungkin dipecah tanpa transfer jaringan."
)

# 10.7.6 (Deterministic hash fix!)
ch7[5]["content"]["theory"] = (
    "Dalam sistem terdistribusi skala besar, kinerja paralel kluster dibatasi oleh fenomena **Straggler Tasks (Tugas Tertinggal)**. "
    "Penyebab paling dominan dari straggler task di tingkat aplikasi adalah **Ketimpangan Data (Data Skew)**: kondisi di mana satu atau beberapa kunci data memiliki frekuensi kemunculan yang jauh melampaui kunci lainnya (sering mengikuti hukum pangkat Zipf's Law). "
    "Ketika operasi shuffle dijalankan, partisi hash menempatkan seluruh rekaman dengan kunci yang sama ke dalam satu partisi fisik yang identik: "
    "$$P(\\text{Key}) = \\text{Hash}(\\text{Key}) \\pmod{N_{\\text{partitions}}}$$ "
    "Jika kunci populer $K_{\\text{skew}}$ memiliki $10^7$ record sementara kunci lain rata-rata hanya memiliki $10^3$ record, maka executor yang menerima partisi tersebut akan kebanjiran beban data raksasa. "
    "Total waktu penyelesaian job ditentukan secara mutlak oleh task paling lambat: "
    "$$T_{\\text{Job}} = \\max_{i \\in [1, N_{\\text{tasks}}]} T_i \\gg \\text{Median}(T_i)$$ "
    "Rasio disparitas skewness dihitung melalui rumus: "
    "$$\\text{SkewRatio} = \\frac{\\max_{p}(|P_p|)}{\\frac{1}{N}\\sum_{p=1}^N |P_p|}$$ "
    "Hal ini menyebabkan 99% resource kluster menganggur menunggu satu worker yang mengalami kelebihan beban (*idle resource starvation*)."
)
ch7[5]["content"]["codeSnippet"] = (
    "import numpy as np\n"
    "\n"
    "# Simulator Deteksi Data Skew & Dampak Straggler Task pada Kluster Terdistribusi Deterministik\n"
    "class DataSkewAnalyzer:\n"
    "    def __init__(self, key_distribution):\n"
    "        self.keys = key_distribution\n"
    "        \n"
    "    def simulate_hash_partitioning(self, num_partitions=4):\n"
    "        partitions = [[] for _ in range(num_partitions)]\n"
    "        for k in self.keys:\n"
    "            # Hash deterministik berbasis kode karakter\n"
    "            part_idx = sum(ord(c) for c in k) % num_partitions\n"
    "            partitions[part_idx].append(k)\n"
    "            \n"
    "        sizes = [len(p) for p in partitions]\n"
    "        max_size = max(sizes)\n"
    "        mean_size = np.mean(sizes)\n"
    "        skew_ratio = max_size / max(1, mean_size)\n"
    "        \n"
    "        # Estimasi waktu task sebanding dengan ukuran partisi\n"
    "        task_durations_sec = [round(s * 0.01, 2) for s in sizes]\n"
    "        job_total_walltime = max(task_durations_sec)\n"
    "        \n"
    "        return {\n"
    "            'partition_sizes': sizes,\n"
    "            'skew_ratio': skew_ratio,\n"
    "            'task_durations_sec': task_durations_sec,\n"
    "            'job_walltime_sec': job_total_walltime\n"
    "        }\n"
    "\n"
    "# Simulasi distribusi data: Kunci 'GUEST_USER' muncul 5.000 kali, kunci normal 2.000 kali\n"
    "# sum(ord(c) for c in 'GUEST_USER') % 4 = 806 % 4 = 2\n"
    "normal_keys = [f'user_{i}' for i in range(1, 41) for _ in range(50)]  # 2.000 record normal\n"
    "skewed_keys = ['GUEST_USER'] * 5000                                    # 5.000 record miring!\n"
    "dataset = normal_keys + skewed_keys\n"
    "\n"
    "analyzer = DataSkewAnalyzer(dataset)\n"
    "metrics = analyzer.simulate_hash_partitioning(num_partitions=4)\n"
    "\n"
    "print(f'Analisis Data Skew ({len(dataset):,} Total Record pada 4 Partisi):')\n"
    "print(f'  Distribusi Ukuran Partisi: {metrics[\"partition_sizes\"]}')\n"
    "print(f'  Estimasi Durasi per Task : {metrics[\"task_durations_sec\"]} detik')\n"
    "print(f'  Rasio Disparitas Skew    : {metrics[\"skew_ratio\"]:.2f}x lebih besar dari rata-rata')\n"
    "print(f'  Total Waktu Job Selesai  : {metrics[\"job_walltime_sec\"]} detik (Dibatasi oleh Straggler Task!)')\n"
    "print('Kesimpulan: Straggler task menahan penyelesaian job meskipun 3 partisi lain selesai instan.')"
)

# 10.7.7 (Deterministic salt fix!)
ch7[6]["content"]["theory"] = (
    "Teknik paling ampuh dan teruji dalam industri untuk menanggulangi data skew pada operasi join adalah **Teknik Penggaraman Kunci (Key Salting)**. "
    "Tujuan utama salting adalah menyebarkan rekaman yang menumpuk pada satu kunci populer ke beberapa partisi acak yang berbeda. "
    "Mekanisme algoritmik Key Salting dieksekusi melalui langkah-langkah sistematis berikut: "
    "1. **Penggaraman Tabel Miring (Fact Table Salting)**: "
    "Untuk setiap baris pada tabel fakta yang miring, kunci join dimodifikasi dengan menyematkan bilangan bulat acak yang ditarik dari distribusi seragam $[0, K-1]$: "
    "$$\\text{Key}_{\\text{salted}} = \\text{Key} \\parallel \\text{RandomInt}(0, K-1)$$ "
    "Faktor $K$ (salting factor) biasanya dipilih antara 5 hingga 20 tergantung tingkat keparahan skew. "
    "2. **Replikasi Tabel Pendamping (Dimension Table Exploding)**: "
    "Agar setiap baris yang telah digarami tetap dapat menemukan pasangannya pada saat join, tabel dimensi pendamping direplikasi sebanyak $K$ kali menggunakan fungsi `explode`: "
    "$$\\text{Row}_{\\text{dim}}(\\text{Key}) \\longrightarrow \\bigcup_{i=0}^{K-1} \\text{Row}_{\\text{dim}}(\\text{Key} \\parallel i)$$ "
    "3. **Join & Agregasi**: Kedua tabel yang telah digarami di-join berdasarkan `Key_salted`. "
    "Beban data kini terbagi merata ke $K$ executor berbeda tanpa ada satu pun worker yang kelebihan beban: "
    "$$\\max_{p}(|P_p|) \\approx \\frac{|\\text{FactTable}|}{K} \\ll |\\text{FactTable}|$$ "
    "Dengan demikian, seluruh executor menyelesaikan komputasi secara serempak tanpa straggler."
)
ch7[6]["content"]["codeSnippet"] = (
    "import random\n"
    "\n"
    "# Implementasi Algoritma Key Salting Deterministik untuk Mengatasi Data Skew\n"
    "class KeySaltingEngine:\n"
    "    @staticmethod\n"
    "    def apply_salting(fact_records, dim_records, salt_factor=4):\n"
    "        # 1. Tambahkan salt terdistribusi seragam [0, salt_factor-1] pada tabel fakta\n"
    "        salted_facts = []\n"
    "        for idx, r in enumerate(fact_records):\n"
    "            salt = idx % salt_factor  # Distribusi deterministik seragam\n"
    "            salted_key = f\"{r['key']}_SALT_{salt}\"\n"
    "            salted_facts.append({'salted_key': salted_key, 'orig_key': r['key'], 'val': r['val'], 'salt': salt})\n"
    "            \n"
    "        # 2. Replikasi tabel dimensi sebanyak salt_factor kali (Explode)\n"
    "        exploded_dims = {}\n"
    "        for r in dim_records:\n"
    "            for s in range(salt_factor):\n"
    "                s_key = f\"{r['key']}_SALT_{s}\"\n"
    "                exploded_dims[s_key] = r['name']\n"
    "                \n"
    "        # 3. Eksekusi Join berbasis salted key\n"
    "        joined_results = []\n"
    "        for sf in salted_facts:\n"
    "            dim_name = exploded_dims.get(sf['salted_key'], 'UNKNOWN')\n"
    "            joined_results.append({\n"
    "                'key': sf['orig_key'],\n"
    "                'name': dim_name,\n"
    "                'val': sf['val'],\n"
    "                'partition_bucket': sf['salt']\n"
    "            })\n"
    "            \n"
    "        return joined_results\n"
    "\n"
    "# Fakta: 100 record bertumpuk pada kunci 'HOT_KEY'\n"
    "fact_table = [{'key': 'HOT_KEY', 'val': i * 10} for i in range(100)]\n"
    "dim_table = [{'key': 'HOT_KEY', 'name': 'Mega Influencer'}]\n"
    "\n"
    "joined = KeySaltingEngine.apply_salting(fact_table, dim_table, salt_factor=4)\n"
    "\n"
    "# Hitung persebaran partisi hasil salting\n"
    "partition_counts = {}\n"
    "for j in joined:\n"
    "    p = j['partition_bucket']\n"
    "    partition_counts[p] = partition_counts.get(p, 0) + 1\n"
    "\n"
    "print(f'Hasil Mitigasi Data Skew Menggunakan Key Salting (Salt Factor = 4):')\n"
    "print(f'  Total Record Selesai di-Join: {len(joined)} record')\n"
    "print(f'  Contoh Record Hasil Join    : {joined[0]}')\n"
    "print(f'  Distribusi Beban per Bucket  : {partition_counts}')\n"
    "print('Kesimpulan: 100 record miring berhasil didistribusikan merata ke 4 partisi seimbang.')"
)

# 10.7.8
ch7[7]["content"]["theory"] = (
    "Diperkenalkan secara penuh pada Apache Spark 3.0, **Adaptive Query Execution (AQE)** merupakan paradigma pengoptimalan kueri dinamis yang memanfaatkan statistik runtime aktual (*runtime feedback metrics*) untuk mengoptimalkan kembali rencana eksekusi fisik selama kueri sedang berjalan. "
    "Sebelum AQE, seluruh keputusan optimasi dibuat secara statis pada fase kompilasi berdasarkan estimasi katalog yang kerap kali tidak akurat. "
    "AQE mengaktifkan tiga kemampuan terobosan utama: "
    "1. **Dynamically Coalescing Shuffle Partitions**: "
    "Setelah fase shuffle write selesai, Spark memeriksa ukuran fisik setiap partisi. Jika partisi-partisi shuffle berukuran terlalu kecil, AQE menggabungkan partisi-partisi yang berdekatan secara dinamis: "
    "$$N_{\\text{coalesced}} = \\left\\lceil \\frac{\\sum_{i=1}^M \\text{Size}(P_i)}{\\text{targetPostShuffleInputSize}} \\right\\rceil$$ "
    "2. **Dynamically Switching Join Strategies**: "
    "Jika estimasi awal mengira tabel berukuran 100 MB sehingga memilih Sort-Merge Join, namun setelah filter runtime ukurannya menyusut menjadi 8 MB ($< \\text{broadcastThreshold}$), AQE secara otomatis mengubah rencana menjadi Broadcast Hash Join di tengah jalan. "
    "3. **Dynamically Optimizing Skew Joins**: "
    "AQE mendeteksi partisi yang ukurannya melampaui ambang batas: "
    "$$\\text{Size}(P) > \\text{medianSize} \\times \\text{skewFactor} \\quad \\land \\quad \\text{Size}(P) > \\text{skewThreshold}$$ "
    "Lalu memecah partisi miring tersebut menjadi beberapa sub-partisi kecil dan mereplikasi pasangan join-nya secara otomatis tanpa perlu intervensi manual kode aplikasi."
)

# 10.7.9
ch7[8]["content"]["theory"] = (
    "**Broadcast Hash Join (BHJ)** merupakan strategi join fisik tercepat dalam Apache Spark karena sepenuhnya mengeliminasi fase shuffle network yang membebani I/O kluster. "
    "Mekanisme internal BHJ diatur oleh parameter `spark.sql.autoBroadcastJoinThreshold` (default 10 MB). "
    "Jika ukuran tabel yang akan di-join memenuhi kriteria: "
    "$$\\text{Size}(\\text{Table}_{\\text{small}}) \\le \\text{spark.sql.autoBroadcastJoinThreshold}$$ "
    "Maka Catalyst Optimizer akan secara otomatis memilih BHJ alih-alih Sort-Merge Join (SMJ). "
    "Driver Spark mengunduh data tabel kecil tersebut ke memori lokalnya, menyusunnya dalam struktur serialisasi yang ringkas, lalu menyebarkannya (*broadcast*) ke seluruh executor di kluster menggunakan pohon distribusi peer-to-peer (BitTorrent-like protocol) dengan kompleksitas transfer jaringan: "
    "$$C_{\\text{broadcast}} = \\mathcal{O}(S_{\\text{table}} \\log N_{\\text{executors}})$$ "
    "Meskipun sangat cepat, data engineer harus berhati-hati: membroadcast tabel yang terlalu besar (> 1 GB) atau menggunakan hint `/*+ BROADCAST(table) */` secara sembrono akan memicu Out-Of-Memory (OOM) fatal pada Driver Spark atau overhead Garbage Collection ekstrem pada Executor."
)

# 10.7.10
ch7[9]["content"]["theory"] = (
    "Diagnosa performa dan debugging aplikasi Apache Spark skala besar bertumpu pada interpretasi mendalam terhadap metrik **Spark Web UI** dan profil konsumsi memori JVM. "
    "Tab-tab kunci pada Spark UI mencakup: "
    "1. **Jobs & Stages**: Memvisualisasikan DAG, waktu eksekusi tiap stage, serta mendeteksi bottleneck shuffle write/read. "
    "2. **Event Timeline**: Menampilkan durasi task, overhead penjadwalan (*scheduler delay*), waktu deserialisasi task, dan waktu Garbage Collection (*GC Time*). "
    "Metrik kesehatan Garbage Collection dievaluasi melalui rasio: "
    "$$R_{\\text{GC}} = \\frac{\\text{GC Time}}{\\text{Total Task Duration}} \\times 100\\%$$ "
    "Jika $R_{\\text{GC}} > 10\\%$, aplikasi mengalami degradasi memori yang serius. Solusi rekayasa meliputi beralih ke pengumpul sampah modern **G1GC (Garbage-First Collector)** dengan konfigurasi `-XX:+UseG1GC -XX:InitiatingHeapOccupancyPercent=35`, memperbesar ukuran executor RAM, atau mengonversi struktur RDD objek ke DataFrame bertipe Tungsten compact binary untuk meminimalkan alokasi objek Java pada heap."
)

with open(ch7_file, "w", encoding="utf-8") as f:
    json.dump(ch7, f, indent=6, ensure_ascii=False)
print("[OK] Bab 7 disempurnakan (teori expanded, snippets made deterministic, Armbrust quote preserved).")

# -------------------------------------------------------------
# 3. PERBAIKAN & ENRICHMENT BAB 8
# -------------------------------------------------------------
ch8_file = os.path.join(base_dir, "de_ch8_data.json")
with open(ch8_file, "r", encoding="utf-8") as f:
    ch8 = json.load(f)

# 10.8.1 (Kreps quote preserved verbatim)
ch8[0]["content"]["theory"] = (
    "Fondasi arsitektur sistem pengiriman pesan dan log commit terdistribusi modern dirumuskan oleh Jay Kreps, Neha Narkhede, dan Jun Rao (ACM NetDB 2011) di LinkedIn melalui makalah mani mereka mengenai **Apache Kafka**. Abstrak resmi makalah tersebut menegaskan: "
    "\"Log processing has become a critical component of the data pipeline for consumer internet companies. We introduce Kafka, a distributed messaging system that we developed for collecting and delivering high volumes of log data with low latency. Our system incorporates ideas from existing log aggregators and messaging systems, and is suitable for both offline and online message consumption. We made quite a few unconventional yet practical design choices in Kafka to make our system efficient and scalable. Our experimental results show that Kafka has superior performance when compared to two popular messaging systems. We have been using Kafka in production for some time and it is processing hundreds of gigabytes of new data each day.\" "
    "Kreps et al. mendefinisikan ulang sistem antrean pesan tradisional dengan membuang paradigma antrean berbasis status (*in-memory broker queue with destructive reads*) dan menggantinya dengan paradigma **Distributed Append-Only Commit Log**. "
    "Data disimpan secara berurutan dan persisten di disk. Konsumen tidak menghapus data saat membaca, melainkan hanya menggeser penunjuk offset baca secara independen: "
    "$$\\text{Offset}_{c, p}(t+1) = \\text{Offset}_{c, p}(t) + 1$$ "
    "Pendekatan ini memungkinkan multi-tenant fan-out tanpa batas beban tambahan pada broker, serta mendukung pembacaan ulang historis (*replayability*) deterministik."
)

# 10.8.2
ch8[1]["content"]["theory"] = (
    "Topologi fisik Apache Kafka dibangun di atas empat konsep struktural fundamental: **Topics**, **Partitions**, **Brokers**, dan **In-Sync Replicas (ISR)**. "
    "1. **Topic & Partition**: Topic adalah saluran logis tempat data dipublikasikan. Setiap topic dipecah menjadi beberapa **Partisi** fisik yang bertindak sebagai unit dasar paralelisme dan skalabilitas horizontal Kafka. Baris pesan di dalam suatu partisi diidentifikasi oleh angka pengenal urutan yang unik dan tak berubah (*immutable monotonically increasing identifier*) yang disebut **Offset**: "
    "$$\\mathcal{O} = \\{0, 1, 2, \\dots, N-1\\}$$ "
    "2. **Broker**: Simpul server independen dalam kluster Kafka yang mengelola penyimpanan partisi dan melayani permintaan baca/tulis dari klien. "
    "3. **Replication & In-Sync Replicas (ISR)**: "
    "Untuk menjamin ketersediaan tinggi (*High Availability*), setiap partisi direplikasi sebanyak faktor replikasi $R$ ($R \\ge 3$ pada lingkungan produksi). "
    "Satu replika bertindak sebagai **Leader** (melayani seluruh operasi baca dan tulis), sementara $R-1$ replika lainnya bertindak sebagai **Followers** yang menyalin log dari Leader. "
    "Himpunan replika yang berhasil menjaga sinkronisasi data secara mutakhir terhadap Leader disebut **ISR (In-Sync Replicas)**. Status konsensus partisi aman jika memenuhi ambang batas quorum: "
    "$$|ISR| \\ge \\text{min.insync.replicas}$$ "
    "Jika sebuah follower tertinggal melebihi parameter `replica.lag.time.max.ms`, follower tersebut segera dikeluarkan dari ISR untuk mencegah degradasi latensi commit."
)

# 10.8.3
ch8[2]["content"]["theory"] = (
    "Di sisi klien pengirim data, **Kafka Producer** mengadopsi arsitektur asinkron berbasis batching untuk mencapai throughput transmisi data yang sangat tinggi (jutaan pesan per detik). "
    "Alur kerja internal Producer terdiri dari dua komponen utama: "
    "1. **Partitioner & Serializer**: "
    "Producer menserialisasikan kunci dan nilai pesan ke dalam bentuk biner. "
    "Jika pesan memiliki kunci $K$, partitioner menentukan partisi tujuan secara deterministik menggunakan fungsi hash: "
    "$$\\text{Partition}(K) = \\text{Murmur2}(K) \\pmod{N_{\\text{partitions}}}$$ "
    "Jika kunci bernilai `null`, partitioner mendistribusikan pesan secara round-robin atau sticky batching. "
    "2. **RecordAccumulator & Sender Thread**: "
    "Pesan tidak langsung dikirim ke broker satu per satu melalui soket TCP. Sebaliknya, pesan dimasukkan ke dalam buffer memori `RecordAccumulator` yang mengelompokkan pesan berdasarkan partisi tujuan menjadi batch-batch kompak. "
    "Batch dikirimkan ke broker oleh thread latar belakang (*Sender Thread*) ketika salah satu dari dua kondisi terpenuhi: "
    "$$\\text{Trigger} = (\\text{BatchSize} \\ge \\text{batch.size}) \\quad \\lor \\quad (\\text{ElapsedWaitTime} \\ge \\text{linger.ms})$$ "
    "Menyetel `linger.ms` antara 5 hingga 20 milidetik memberikan waktu bagi akumulator untuk mengumpulkan ratusan pesan ke dalam satu paket transmisi jaringan, melipatgandakan throughput produsen secara dramatis."
)

# 10.8.4
ch8[3]["content"]["theory"] = (
    "Di sisi penerima data, **Kafka Consumer** membaca pesan dari partisi topic menggunakan model penarikan data (*pull-based consumption*). "
    "Untuk memproses data secara paralel, beberapa konsumen dikelompokkan ke dalam sebuah **Consumer Group**: "
    "1. **Prinsip Alokasi Partisi**: "
    "Setiap partisi di dalam suatu topic hanya boleh dibaca oleh tepat satu konsumen di dalam consumer group yang sama. "
    "Jika jumlah konsumen $C$ sama dengan jumlah partisi $P$ ($C = P$), setiap konsumen membaca satu partisi. "
    "Jika $C > P$, maka $C - P$ konsumen akan berada dalam status menganggur (*idle*). "
    "Oleh karena itu, jumlah partisi merupakan batas atas paralelisme konsumsi data: "
    "$$\\text{MaxParallelConsumers} = N_{\\text{partitions}}$$ "
    "2. **Consumer Lag**: "
    "Metrik operasional paling krusial dalam streaming data adalah **Consumer Lag** (Ketertinggalan Konsumen). "
    "Lag didefinisikan sebagai selisih antara Log End Offset (offset pesan terbaru yang masuk ke partisi) dengan Current Offset (offset terakhir yang telah selesai diproses oleh konsumen): "
    "$$\\text{Lag}_p(t) = \\text{LEO}_p(t) - \\text{Offset}_{c, p}(t)$$ "
    "Lonjakan Consumer Lag menandakan bahwa kecepatan konsumsi aplikasi hilir lebih lambat daripada laju ingesti data hulu, yang memicu penumpukan antrean dan ancaman pelanggaran SLA waktu nyata."
)

# 10.8.5
ch8[4]["content"]["theory"] = (
    "Menghantarkan pesan secara tepat satu kali (**Exactly-Once Semantics / EOS**) melintasi jaringan terdistribusi yang tidak stabil merupakan tantangan rekayasa paling kompleks. "
    "Kafka menyediakan jaminan pengiriman pesan pada tiga tingkatan semantik: "
    "1. **At-Most-Once**: Pesan dapat hilang tetapi tidak pernah diduplikasi ($P(\\text{Delivery}) \\le 1$). Terjadi jika consumer meng-commit offset sebelum selesai memproses data. "
    "2. **At-Least-Once**: Pesan dijamin tidak pernah hilang tetapi dapat terduplikasi ($P(\\text{Delivery}) \\ge 1$). Merupakan mode default saat producer melakukan retry atas kegagalan jaringan. "
    "3. **Exactly-Once Semantics (EOS)**: Setiap pesan dijamin diproses tepat satu kali tanpa kehilangan dan tanpa duplikasi ($P(\\text{Delivery}) = 1$). "
    "Kafka mengimplementasikan EOS melalui kombinasi dua pilar teknologi: "
    "   - **Idempotent Producer**: Setiap producer diberi Producer ID (PID) unik 64-bit oleh broker. Setiap pesan yang dikirim dilengkapi dengan nomor urutan monolitik (*Sequence Number*): "
    "$$\\text{Condition: Accept} \\iff \\text{Seq}_{\\text{new}} = \\text{Seq}_{\\text{last}} + 1$$ "
    "Jika broker menerima pesan dengan nomor urutan yang sudah pernah dicatat, broker membuang duplikat tersebut tanpa melempar error. "
    "   - **Transactional API**: Mendukung operasi baca-proses-tulis atomik melintasi beberapa topic dan partisi menggunakan koordinator transaksi (*Transaction Coordinator*) dan protokol Two-Phase Commit (2PC)."
)

# 10.8.6
ch8[5]["content"]["theory"] = (
    "Efisiensi performa I/O Apache Kafka yang menakjubkan berakar langsung pada desain fisik **Storage Engine** dan pemanfaatan arsitektur kernel sistem operasi Linux. "
    "Setiap partisi pada disk disimpan sebagai sebuah direktori yang berisi serangkaian berkas segmen log berukuran tetap (default 1 GB per segmen): "
    "1. **File Struktur Segmen**: "
    "   - `.log`: Berkas data biner mentah yang menyimpan record pesan secara berurutan (*sequential append-only*). "
    "   - `.index`: Indeks sparse (jarang) yang memetakan offset pesan ke posisi offset biner fisik (byte offset) di dalam file `.log`. "
    "   - `.timeindex`: Indeks yang memetakan timestamp pesan ke offset, memungkinkan pencarian kueri berbasis waktu. "
    "Pencarian record dilakukan menggunakan algoritma binary search pada indeks sparse dengan kompleksitas: "
    "$$\\mathcal{O}(\\log N_{\\text{index\\_entries}}) + \\mathcal{O}(\\text{scan local})$$ "
    "2. **Zero-Copy Data Transfer (`sendfile`)**: "
    "Sistem antrean pesan konvensional menyalin data dari disk ke Page Cache kernel, lalu ke memori aplikasi di user space, lalu menyalin kembali ke soket buffer kernel, baru diteruskan ke kartu jaringan (NIC) — menimbulkan 4 perpindahan konteks (*context switches*) dan 3 duplikasi data di RAM. "
    "Kafka memanfaatkan panggilan sistem Linux `sendfile()`, yang mentransfer data langsung dari OS Page Cache ke buffer NIC via DMA (Direct Memory Access): "
    "$$\\text{Disk} \\xrightarrow{\\text{DMA}} \\text{Page Cache} \\xrightarrow{\\text{Zero-Copy}} \\text{NIC Buffer}$$ "
    "Hal ini memangkas overhead CPU secara signifikan dan mengeliminasi kejenuhan bus memori sistem."
)

# 10.8.7 (LaTeX formulas added!)
ch8[6]["content"]["theory"] = (
    "Dalam pipeline streaming data enterprise berskala besar, produsen dan konsumen data sering kali dikembangkan oleh tim yang berbeda secara independen. "
    "Ketiadaan tata kelola skema data yang ketat dapat memicu bencana hilir (*silent downstream schema breakage*) jika produsen secara sepihak mengubah struktur field payload. "
    "Untuk mengatasi masalah ini, ekosistem Kafka memanfaatkan **Schema Registry** dan format serialisasi kompak biner **Apache Avro**. "
    "1. **Wire Format Protocol**: "
    "Payload pesan Kafka tidak menyertakan skema JSON utuh pada setiap event (yang akan memboroskan bandwidth jaringan). Sebaliknya, payload diawali oleh header biner 5-byte standar: "
    "$$\\text{Payload} = \\langle \\underbrace{\\text{0x00}}_{\\text{Magic Byte (1B)}} \\parallel \\underbrace{\\text{SchemaId}}_{\\text{Schema Registry ID (4B)}} \\parallel \\underbrace{\\text{Avro Binary Data}}_{\\text{Serialized Record}} \\rangle$$ "
    "2. **Tingkat Kompatibilitas Skema (Schema Compatibility Levels)**: "
    "Schema Registry bertindak sebagai penjaga gerbang (*governance gatekeeper*) yang memvalidasi setiap versi skema baru $S_{\\text{new}}$ terhadap skema lama $S_{\\text{old}}$ melalui fungsi kompatibilitas: "
    "$$f_{\\text{compat}}(S_{\\text{new}}, S_{\\text{old}}) \\in \\{0, 1\\}$$ "
    "Tingkat kompatibilitas mencakup: "
    "   - **BACKWARD**: Konsumen dengan skema baru dapat membaca data yang diproduksi dengan skema lama. "
    "   - **FORWARD**: Konsumen dengan skema lama dapat membaca data yang diproduksi dengan skema baru. "
    "   - **FULL**: Memenuhi syarat kompatibilitas backward dan forward sekaligus. "
    "Jika produsen mencoba mempublikasikan data dengan skema yang merusak kompatibilitas, Schema Registry menolak pendaftaran skema tersebut secara otomatis."
)

# 10.8.8
ch8[7]["content"]["theory"] = (
    "Mengintegrasikan Apache Kafka dengan sistem penyimpanan eksternal (basis data transaksional, data lake, search index, dan data warehouse) membutuhkan framework konektivitas yang terstandarisasi, terukur, dan toleran terhadap kegagalan. "
    "Framework **Kafka Connect** menyediakan solusi integrasi deklaratif tanpa perlu menulis kode pipa (*zero custom pipeline code*). "
    "Kafka Connect beroperasi di bawah dua model konektor: "
    "1. **Source Connectors**: Menarik data dari sistem eksternal dan memasukkannya ke dalam topic Kafka (misalnya dari PostgreSQL, MongoDB, atau AWS S3). "
    "2. **Sink Connectors**: Membaca data dari topic Kafka dan menyalurkannya ke sistem target hilir (misalnya ke Snowflake, ClickHouse, Elasticsearch, atau Delta Lake). "
    "Penerapan paling vital dari Source Connector dalam arsitektur AI modern adalah **Change Data Capture (CDC)** menggunakan alat seperti **Debezium**. "
    "CDC membaca log transaksi basis data hulu secara langsung (misalnya PostgreSQL Write-Ahead Log / WAL atau MySQL binlog). "
    "Setiap operasi mutasi baris data (`INSERT`, `UPDATE`, `DELETE`) ditangkap pada tingkat latensi submili-detik dan dipancarkan sebagai event streaming ke Kafka: "
    "$$\\text{Latency}_{\\text{CDC}} = \\tau_{\\text{WAL flush}} + \\tau_{\\text{Kafka send}} \\ll \\text{Latency}_{\\text{Batch Polling}}$$"
)

# 10.8.9
ch8[8]["content"]["theory"] = (
    "**Kafka Streams** adalah pustaka klien Java yang ringan namun berkemampuan komputasi tinggi untuk membangun aplikasi streaming dan mikroservis berbasis event-driven secara native di atas Apache Kafka. "
    "Kafka Streams memperkenalkan konsep teoretis revolusioner yang dikenal sebagai **Dualitas Stream-Table (Stream-Table Duality)**: "
    "1. **KStream (Aliran Event)**: Abstraksi stream record data yang mewakili urutan peristiwa tak berujung (*unbounded changelog*). Setiap record baru merupakan penambahan event independen ke masa lalu: "
    "$$\\text{KStream} = \\{e_1, e_2, e_3, \\dots\\}$$ "
    "2. **KTable (Tabel Status Terkini)**: Abstraksi yang mewakili snapshot kondisi data saat ini (*current state of the world*). Setiap record baru dengan kunci yang sama bertindak sebagai operasi pembaruan (*UPSERT*) terhadap record sebelumnya: "
    "$$\\text{KTable}(K) = \\text{LatestValue}(K)$$ "
    "Dualitas ini dibuktikan melalui relasi: stream dapat diakumulasikan menjadi tabel melalui fungsi agregasi, dan mutasi tabel dapat dipancarkan kembali menjadi stream event: "
    "$$\\text{KStream} \\xrightarrow{\\text{Aggregate / Reduce}} \\text{KTable} \\xrightarrow{\\text{toStream()}} \\text{KStream}$$ "
    "Kafka Streams menyimpan status lokal (*local state*) pada mesin basis data key-value tertanam **RocksDB**, dengan backup persisten otomatis ke changelog topic Kafka."
)

# 10.8.10
ch8[9]["content"]["theory"] = (
    "Pengelolaan dan pengoperasian kluster Apache Kafka skala enterprise menuntut pemahaman mendalam tentang protokol konsensus metadata, manajemen kapasitas, dan toleransi kegagalan simpul. "
    "1. **KRaft Consensus (Kafka Raft Metadata Mode)**: "
    "Secara historis, Kafka mengandalkan Apache ZooKeeper untuk mengelola metadata kluster dan pemilihan leader partisi. Arsitektur ini menimbulkan bottleneck sinkronisasi metadata saat kluster memiliki ratusan ribu partisi. "
    "Mulai Kafka 3.3+, **KRaft** resmi menggantikan ZooKeeper secara permanen. Metadata kluster kini disimpan sebagai log event internal khusus (`@metadata`) yang dikelola secara konsensus oleh quorum controller menggunakan algoritma konsensus Raft: "
    "$$Q_{\\text{controller}} = \\left\\lfloor \\frac{N_{\\text{controllers}}}{2} \\right\\rfloor + 1$$ "
    "Perpindahan ke KRaft mempercepat waktu pemulihan kegagalan kluster (*failover time*) hingga 10x lipat dan mendukung skalabilitas hingga jutaan partisi per kluster. "
    "2. **Perhitungan Kapasitas Penyimpanan**: "
    "Kebutuhan kapasitas disk harian untuk kluster dihitung melalui relasi deterministik: "
    "$$S_{\\text{disk}} = \\text{Throughput}_{\\text{MB/s}} \\times 86400\\text{ s/day} \\times R \\times (1 + \\text{Overhead}_{\\text{comp}})$$ "
    "Di mana $R$ adalah faktor replikasi dan $\\text{Overhead}$ mencakup alokasi indeks dan buffer keamanan kompresi."
)

with open(ch8_file, "w", encoding="utf-8") as f:
    json.dump(ch8, f, indent=6, ensure_ascii=False)
print("[OK] Bab 8 disempurnakan (teori expanded, Kreps quote preserved, LaTeX added).")

# -------------------------------------------------------------
# 4. PERBAIKAN & ENRICHMENT BAB 9
# -------------------------------------------------------------
ch9_file = os.path.join(base_dir, "de_ch9_data.json")
with open(ch9_file, "r", encoding="utf-8") as f:
    ch9 = json.load(f)

# 10.9.1
ch9[0]["content"]["theory"] = (
    "Dalam rekayasa sistem pemrosesan data aliran (*stream processing*), terdapat dua paradigma komputasi utama yang membedakan arsitektur mesin terdistribusi: **Micro-Batching** (diadopsi oleh Spark Streaming) dan **Continuous / Event-Driven Processing** (diadopsi oleh Apache Flink). "
    "1. **Paradigma Micro-Batching**: "
    "Mesin mengumpulkan aliran data event yang masuk selama interval waktu tertentu $\\Delta t$ (misalnya 500 milidetik hingga beberapa detik), lalu mengeksekusi kumpulan data tersebut sebagai batch kecil reguler menggunakan mesin komputasi batch standar: "
    "$$\\text{MicroBatch}_k = \\{e \\mid k \\cdot \\Delta t \\le t_{\\text{arrival}}(e) < (k+1) \\cdot \\Delta t\\}$$ "
    "Kelebihan: Mencapai throughput data masif yang sangat tinggi dan memanfaatkan algoritma optimasi batch (Catalyst/Tungsten). Kelemahan: Latensi komputasi dibatasi oleh batas bawah penjadwalan interval batch (umumnya $\\ge 100\\text{ ms}$). "
    "2. **Paradigma Continuous Stream Processing**: "
    "Setiap record data tunggal diproses seketika saat tiba di jaringan (*record-at-a-time*) oleh operator komputasi yang terus berjalan (*long-running streaming operators*). "
    "Kelebihan: Latensi ekstrem ultra-rendah pada tingkat submili-detik: "
    "$$\\tau_{\\text{continuous}} \\approx \\tau_{\\text{network}} + \\tau_{\\text{CPU}} \\le 10\\text{ ms}$$ "
    "Pemilihan paradigma ini ditentukan oleh karakteristik SLA sistem: deteksi penipuan kartu kredit menuntut continuous streaming, sedangkan agregasi fitur hourly dapat dilayani dengan micro-batching."
)

# 10.9.2
ch9[1]["content"]["theory"] = (
    "**Spark Structured Streaming** memperlakukan aliran data waktu nyata sebagai sebuah **Tabel Tak Berujung (Unbounded Table)** yang terus-menerus bertambah baris baru seiring berjalannya waktu. "
    "Model pemrograman ini menyatukan API komputasi batch dan streaming: kueri yang dieksekusi pada data batch statis dapat diterapkan secara langsung pada data streaming tanpa perubahan kode logika. "
    "Konsep inti Structured Streaming mencakup: "
    "1. **Mode Output (Output Modes)**: "
    "   - **Append Mode**: Hanya baris data baru yang telah final yang dituliskan ke sink penyimpanan (hanya valid untuk kueri tanpa agregasi atau kueri agregasi dengan watermark). "
    "   - **Complete Mode**: Seluruh tabel hasil agregasi yang telah diperbarui dituliskan ulang ke sink pada setiap batch. "
    "   - **Update Mode**: Hanya baris-baris pada tabel hasil yang mengalami perubahan nilai sejak batch terakhir yang dipancarkan ke sink. "
    "2. **Pemicu Eksekusi (Trigger)**: "
    "Mendefinisikan waktu eksekusi batch: default (segera setelah batch sebelumnya selesai), `Trigger.ProcessingTime('5 seconds')`, atau `Trigger.AvailableNow()` (mode efisien untuk memproses seluruh data antrean lalu mematikan kluster). "
    "3. **Toleransi Kesalahan Berbasis Checkpointing & WAL**: "
    "Structured Streaming mencatat offset pembacaan sumber data dan status agregasi ke dalam direktori persisten (*Checkpoint Location*) menggunakan **Write-Ahead Log (WAL)** deterministik: "
    "$$\\text{State}_t = f(\\text{State}_{t-1}, \\text{Batch}_t)$$"
)

# 10.9.3
ch9[2]["content"]["theory"] = (
    "Dalam sistem streaming terdistribusi, pemahaman yang tepat mengenai tiga sumbu waktu (*notions of time*) sangat krusial untuk menjamin kebenaran komputasi: "
    "1. **Event Time (Waktu Peristiwa)**: Waktu ketika peristiwa data sebenarnya terjadi dan dicatat oleh perangkat sumber (misalnya timestamp klik pengguna pada aplikasi ponsel pintar). "
    "2. **Ingestion Time (Waktu Ingesti)**: Waktu ketika event tersebut berhasil diterima dan dicatat ke dalam antrean log broker (misalnya offset timestamp partisi Apache Kafka). "
    "3. **Processing Time (Waktu Pemrosesan)**: Waktu lokal jam mesin server di mana operator komputasi Spark atau Flink mengeksekusi transformasi data. "
    "Pada jaringan internet nyata, data hampir selalu mengalami penundaan transmisi acak (*network latency, offline devices, retry buffers*), memicu fenomena **Skew Temporal**: "
    "$$\\Delta t = t_{\\text{processing}} - t_{\\text{event}} > 0$$ "
    "Akibatnya, data event tiba di mesin pemrosesan secara tidak berurutan (*out-of-order data arrival*). "
    "Jika sistem menghitung jendela analitik berbasis Processing Time, hasil agregasi akan bias dan tidak dapat direproduksi (*non-deterministic*). "
    "Oleh karena itu, arsitektur analitik modern mewajibkan seluruh kalkulasi jendela bisnis berbasis **Event Time** murni."
)

# 10.9.4
ch9[3]["content"]["theory"] = (
    "Untuk mengeksekusi agregasi berbasis Event Time pada aliran data yang tak teratur, mesin streaming harus mengetahui kapan suatu jendela waktu dapat dianggap 'selesai' agar hasil akhirnya dapat dipancarkan dan memori statusnya dapat dibersihkan. "
    "Mekanisme ini diatur oleh konsep formal **Watermarking**. "
    "Watermark bertindak sebagai penanda waktu global logis yang menyatakan bahwa sistem memperkirakan tidak ada lagi event dengan timestamp lebih kecil dari watermark yang akan tiba. "
    "Fungsi pembaruan watermark bergerak secara monoton naik (*monotonically increasing*) berdasarkan timestamp event tertinggi yang pernah diamati dikurangi ambang batas keterlambatan yang ditoleransi (*allowed delay* $\\Delta_{\\text{delay}}$): "
    "$$W_t = \\max\\left(W_{t-1}, \\max_{e \\in \\mathcal{B}_t}(e.\\text{timestamp}) - \\Delta_{\\text{delay}}\\right)$$ "
    "Aturan penyaringan data late arrival: "
    "1. Jika $e.\\text{timestamp} \\ge W_t$: Event diterima dan diikutsertakan ke dalam agregasi jendela stateful. "
    "2. Jika $e.\\text{timestamp} < W_t$: Event dinyatakan sebagai **Late Data yang Melewati Batas**, dan secara otomatis diabaikan (*dropped*) oleh mesin komputasi. "
    "Watermarking mencegah lonjakan memori tak terhingga (*unbounded state store growth*) dengan mengizinkan mesin menghapus status jendela lama yang timestamp akhirnya lebih kecil dari watermark."
)

# 10.9.5
ch9[4]["content"]["theory"] = (
    "Pemotongan aliran data waktu nyata yang tak berujung menjadi segmen-segmen terhingga (*finite buckets*) untuk keperluan agregasi analitik dilakukan melalui teknik **Windowing**. "
    "Tiga kategori semantik jendela waktu yang fundamental meliputi: "
    "1. **Tumbling Windows (Jendela Bergulir)**: "
    "Jendela waktu dengan durasi tetap yang berdampingan tanpa tumpang tindih (*non-overlapping, contiguous*). Setiap event masuk ke tepat satu jendela waktu: "
    "$$\\text{Window}_k = [k \\cdot D, (k+1) \\cdot D)$$ "
    "Di mana $D$ adalah durasi jendela (misal jendela 5 menit: `[10:00, 10:05)`, `[10:05, 10:10)`). "
    "2. **Sliding Windows (Jendela Bergeser)**: "
    "Jendela waktu dengan durasi tetap $D$ yang bergeser secara periodik setiap interval geser $S$ ($S < D$). Jendela-jendela ini saling bertumpang tindih (*overlapping*): "
    "$$\\text{OverlapRatio} = \\frac{D - S}{D}$$ "
    "Satu event dapat dimasukkan ke beberapa jendela sekaligus (misal durasi 10 menit bergeser setiap 5 menit). "
    "3. **Session Windows (Jendela Sesi Dinamis)**: "
    "Jendela waktu dengan durasi fleksibel yang didefinisikan berdasarkan periode keaktifan pengguna yang dipisahkan oleh interval ketidakaktifan (*inactivity gap* $G$): "
    "$$\\text{Condition: Merge} \\iff t_{i+1} - t_i \\le G$$ "
    "Jika tidak ada aktivitas baru selama melebihi gap $G$, sesi dianggap berakhir dan ditutup."
)

# 10.9.6
ch9[5]["content"]["theory"] = (
    "Komputasi streaming tingkat lanjut (seperti agregasi kumulatif, deduplikasi event, join antar-aliran, dan machine learning online) bersifat **Stateful (Memiliki Status)**. "
    "Mesin streaming harus memelihara informasi historis (*state*) di antara kedatangan event-event data yang berbeda. "
    "Manajemen status terdistribusi dikelola oleh komponen **State Store**: "
    "1. **HDFS State Store (Default Spark)**: "
    "Menyimpan seluruh objek status aktif di dalam memori heap JVM worker. Status secara periodik diserialisasikan dan dituliskan ke HDFS/S3 checkpoint. "
    "Kelemahan: Dibatasi secara mutlak oleh kapasitas RAM heap JVM; ukuran status di atas puluhan gigabyte memicu lonjakan Garbage Collection pause fatal. "
    "2. **RocksDB State Store Provider**: "
    "Memanfaatkan mesin basis data key-value tertanam **RocksDB** yang beroperasi di luar heap JVM (*off-heap memory*). "
    "Data status aktif disimpan dalam memori RAM terkelola dan file SSTable pada disk lokal NVMe worker, dengan sinkronisasi changelog ke penyimpanan objek terdistribusi. "
    "Kapasitas stateful kini dibatasi oleh ukuran disk lokal worker ketimbang ukuran RAM heap: "
    "$$S_{\\text{max\\_state}} = \\mathcal{O}(\\text{Disk Capacity}) \\gg \\text{JVM Heap}$$ "
    "Menjadikan RocksDB standar de facto arsitektur streaming produksi skala enterprise."
)

# 10.9.7
ch9[6]["content"]["theory"] = (
    "Menggabungkan dua aliran data streaming waktu nyata (**Stream-Stream Join**) secara terdistribusi menghadirkan kompleksitas stateful yang jauh lebih tinggi daripada join data statis. "
    "Kedua aliran data (Stream A dan Stream B) bersifat tak terbatas dan dapat mengalami penundaan kedatangan yang tidak simetris. "
    "Agar suatu record dari Stream A dapat menemukan pasangannya dari Stream B yang mungkin tiba beberapa menit kemudian, mesin streaming harus menyimpan kedua aliran ke dalam State Store lokal: "
    "$$\\text{Buffer}(A) \\bowtie \\text{Buffer}(B)$$ "
    "Tanpa pembatasan waktu, ukuran State Store akan membengkak hingga memori habis (*infinite state explosion*). "
    "Oleh karena itu, operasi Stream-Stream Join mewajibkan dua batasan ketat: "
    "1. **Watermark pada Kedua Stream**: Mendefinisikan batas keterlambatan data event time untuk Stream A dan Stream B. "
    "2. **Batasan Interval Waktu (Time Range Join Constraint)**: "
    "Membatasi rentang waktu di mana kedua event diizinkan untuk berpasangan: "
    "$$e_B.\\text{time} \\in [e_A.\\text{time} - \\Delta t_{\\text{before}}, e_A.\\text{time} + \\Delta t_{\\text{after}}]$$ "
    "Ketika watermark kedua stream melampaui batas atas interval waktu join, rekaman yang telah kadaluarsa secara otomatis dibersihkan dari State Store."
)

# 10.9.8
ch9[7]["content"]["theory"] = (
    "**Apache Flink** adalah mesin pemrosesan stream terdistribusi sejati (*true stream-first processing engine*) yang memandang pemrosesan batch hanyalah kasus khusus dari pemrosesan streaming (aliran data terhingga / *bounded stream*). "
    "Keunggulan teknis Flink bertumpu pada algoritma snapshot status terdistribusi yang sangat inovatif: **Asynchronous Barrier Snapshotting (ABS)**, yang merupakan adaptasi modern dari algoritma klasik Chandy-Lamport (1985). "
    "Mekanisme Checkpointing Flink bekerja melalui langkah-langkah sistematis berikut: "
    "1. **Penyuntikan Barrier (Barrier Injection)**: "
    "Koordinator Checkpoint Flink menyuntikkan penanda khusus yang disebut **Checkpoint Barrier** $B_k$ ke dalam aliran input data pada operator sumber (*Source*). Barrier mengalir bersama-sama dengan record data normal tanpa menyela alur eksekusi. "
    "2. **Penyelarasan Barrier (Barrier Alignment)**: "
    "Ketika suatu operator menerima barrier $B_k$ dari seluruh saluran inputnya, operator tersebut mengetahui bahwa seluruh data sebelum $B_k$ telah selesai diproses. "
    "3. **Snapshot Asinkron**: "
    "Operator membekukan status lokalnya dan menuliskan salinan status (*state snapshot*) ke media penyimpanan persisten terdistribusi secara asinkron di latar belakang: "
    "$$\\text{Snapshot}(S_k) = \\text{State}(\\text{Data} < B_k)$$ "
    "Alur pemrosesan data terus berjalan seketika tanpa jeda pemblokiran (*zero stream pause*), menghasilkan overhead latensi mendekati nol."
)

# 10.9.9
ch9[8]["content"]["theory"] = (
    "Dalam Apache Flink, **State Backends** menentukan secara fisik bagaimana dan di mana status komputasi operator stateful disimpan dan dibuatkan salinan checkpoint. "
    "Flink menyediakan dua arsitektur State Backend utama untuk kebutuhan enterprise: "
    "1. **HashMapStateBackend (In-Memory Heap)**: "
    "Menyimpan seluruh status sebagai objek Java mentah di dalam memori heap JVM TaskManager. "
    "Membaca dan menulis status berlangsung sangat cepat karena hanya berupa manipulasi referensi pointer memori CPU: "
    "$$\\tau_{\\text{access}} = \\mathcal{O}(1) \\approx 10 - 50\\text{ nanodetik}$$ "
    "Namun, kapasitas status dibatasi oleh alokasi RAM heap TaskManager dan rentan terhadap gangguan Garbage Collection. "
    "2. **EmbeddedRocksDBStateBackend (Out-of-Core SSD)**: "
    "Menyimpan status di dalam basis data key-value off-heap RocksDB pada disk lokal NVMe TaskManager. "
    "Mendukung **Incremental Checkpointing**: Flink hanya menyalin file SSTable RocksDB baru yang termutasi sejak checkpoint sebelumnya ke penyimpanan persisten (S3/HDFS), memangkas volume penulisan checkpoint secara dramatis: "
    "$$\\text{Size}_{\\text{Incremental Checkpoint}} \\ll \\text{Size}_{\\text{Full State}}$$ "
    "Menjadikannya arsitektur standar untuk aplikasi streaming skala terabyte."
)

# 10.9.10
ch9[9]["content"]["theory"] = (
    "Membangun pipeline data streaming waktu nyata untuk memasok fitur ke model Artificial Intelligence (**Real-Time Feature Store / Online Inference Pipeline**) menuntut jaminan integritas semantik **End-to-End Exactly-Once (E2E EOS)**. "
    "Jika data event terduplikasi atau hilang di tengah jalan, model prediksi AI (seperti deteksi fraud transaksi atau sistem rekomendasi e-commerce) akan menghasilkan inferensi yang keliru dan merugikan bisnis secara finansial. "
    "Jaminan E2E EOS terdistribusi mensyaratkan pemenuhan simultan dari tiga pilar arsitektur: "
    "1. **Sumber Data yang Dapat Diulang (Replayable Source)**: Sistem antrean sumber (seperti Apache Kafka) harus mampu memutar ulang pembacaan pesan dari offset tertentu saat terjadi kegagalan: "
    "$$\\text{Rewind}: \\text{Offset} \\leftarrow \\text{CheckpointOffset}$$ "
    "2. **Mesin Pemrosesan Deterministik (Deterministic Stateful Engine)**: Mesin streaming (Spark Structured Streaming atau Flink) memelihara status komputasi fitur berbasis Event Time dan Watermarking yang deterministik melalui checkpointing berkala. "
    "3. **Sistem Penyimpanan Target yang Idempoten / Transaksional (Idempotent or Two-Phase Commit Sink)**: "
    "Sink target (Redis Feature Store, Cassandra, atau Delta Lake) harus mendukung: "
    "   - **Operasi Idempoten**: Penulisan berulang dengan kunci dan versi yang sama menghasilkan status data yang identik ($f(f(x)) = f(x)$). "
    "   - **Protokol Two-Phase Commit (2PC)**: Menulis data dalam status uncommitted dan hanya menerbitkan commit final secara atomik bersamaan dengan selesainya checkpoint mesin streaming."
)

with open(ch9_file, "w", encoding="utf-8") as f:
    json.dump(ch9, f, indent=6, ensure_ascii=False)
print("[OK] Bab 9 disempurnakan (teori expanded, LaTeX added).")

# -------------------------------------------------------------
# 5. EKSEKUSI KODE & SINKRONISASI OUTPUT SEMUA 40 SUBBAB
# -------------------------------------------------------------
print("\n--- Mengeksekusi ulang seluruh 40 snippet kode dan menyinkronkan output ---")

all_chapters = [(6, ch6_file), (7, ch7_file), (8, ch8_file), (9, ch9_file)]

for ch_num, fpath in all_chapters:
    with open(fpath, "r", encoding="utf-8") as f:
        subs = json.load(f)
    
    for sub in subs:
        sub_id = sub["id"]
        snippet = sub["content"]["codeSnippet"]
        
        # Eksekusi snippet secara mandiri dan tangkap output
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                exec(snippet, {"__name__": "__main__"})
            actual_output = buf.getvalue().strip()
        except Exception as e:
            print(f"[FAIL] Error pada {sub_id}: {e}")
            sys.exit(1)
            
        sub["content"]["codeSnippetOutput"] = actual_output
        
    with open(fpath, "w", encoding="utf-8") as f:
        json.dump(subs, f, indent=6, ensure_ascii=False)
    print(f"[OK] Bab {ch_num} (10 subbab) selesai dieksekusi dan output disinkronkan.")

print("\n=== SEMUA 40 SUBBAB CHUNK 2 BERHASIL DISEMPURNAKAN DAN TERVALIDASI PENUH! ===")
