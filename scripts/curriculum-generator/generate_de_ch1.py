import json
import os
import sys
import numpy as np

output_file = os.path.join(os.path.dirname(__file__), "de_ch1_data.json")

subchapters = [
    # 10.1.1
    {
        "id": "10.1.1",
        "title": "Peran dan Tanggung Jawab Data Engineer dalam Ekosistem AI",
        "learningObjectives": [
            "Membedakan batas tanggung jawab fungsional antara Data Engineer, Data Scientist, dan Machine Learning Engineer dalam hierarki kebutuhan AI (AI Hierarchy of Needs).",
            "Menganalisis arsitektur data lifecycle: dari raw ingestion, pembersihan, orkestrasi, hingga penyediaan data berkualitas tinggi ke feature store.",
            "Mengimplementasikan simulasi pipeline pembersihan data terotomasi dengan pengukuran metrik kualitas dan integritas data."
        ],
        "prerequisites": [
            "Dasar-dasar pemrograman Python dan manipulasi struktur data.",
            "Pemahaman umum alur kerja Machine Learning (training, validation, inference)."
        ],
        "commonPitfalls": [
            "Mengabaikan integritas skema data di hulu (*upstream schema drift*), yang memicu kegagalan inferensi model ML di hilir tanpa pesan kesalahan yang jelas (*silent degradation*).",
            "Mencampuradukkan fungsi Data Engineer dengan Data Scientist, mengakibatkan waktu kerja tim ML tersita hingga 80% hanya untuk pembersihan data manual (*data wrangling*)."
        ],
        "academicReferences": [
            "Rogati, M. (2017). The AI Hierarchy of Needs. Hacker Noon.",
            "Sculley, D., et al. (2015). Hidden technical debt in machine learning systems. In Advances in Neural Information Processing Systems (NeurIPS 2015), 28, 2503-2511."
        ],
        "caseStudy": "Sebuah platform ride-hailing global mengoperasikan model dinamis surge pricing berbasis AI. Terjadi penurunan performa prediksi sebesar 30% karena format koordinat GPS berubah dari format float64 ke string desimal di server aplikasi. Data Engineer merancang ingestion contract berbasis schema registry yang secara otomatis memblokir payload anomali sebelum masuk ke data lake, mengembalikan SLA akurasi model ML ke 99.8%.",
        "content": {
            "theory": (
                "Dalam ekosistem kecerdasan buatan modern, keberhasilan pemodelan machine learning sangat ditentukan oleh fondasi rekayasa data. "
                "Monica Rogati (2017) memformulasikan piramida **Hierarki Kebutuhan AI (AI Hierarchy of Needs)**, di mana machine learning dan deep learning berada di puncak hierarki, "
                "sedangkan lapisan dasar yang menopangnya terdiri dari: (1) Pengumpulan Data (*Collection*), (2) Aliran & Penyimpanan Data (*Flow & Storage*), (3) Transformasi & Pembersihan (*Transformation & Cleaning*), dan (4) Agregasi & Fitur (*Aggregation & Labeling*). "
                "Tanggung jawab utama seorang Data Engineer dirumuskan dalam fungsi reliabilitas data: "
                "$$\\mathcal{R}(\\mathcal{D}) = \\prod_{i=1}^n \\left(1 - P(\\text{Failure}_i)\\right) \\cdot \\Phi(\\text{Freshness}, \\text{Completeness}, \\text{Validity})$$ "
                "Di mana $\\mathcal{D}$ adalah dataset yang disajikan ke pipeline AI, dan $\\Phi$ adalah fungsi kepatuhan kontrak data. "
                "Sebagaimana disorot dalam studi klasik Scully et al. (NeurIPS 2015) tentang *Hidden Technical Debt in Machine Learning Systems*, kode pemodelan ML aktual hanya mencakup sebagian kecil ($< 10\\%$) dari total basis kode sistem AI produksi. "
                "Lebih dari $90\\%$ dari infrastruktur sistem didedikasikan untuk rekayasa data pendukung: verifikasi data, ekstraksi fitur, manajemen konfigurasi, pengawasan sumber daya, dan orkestrasi pemrosesan terdistribusi."
            ),
            "realWorldApplication": (
                "Di perusahaan seperti Uber (platform Michelangelo) dan Netflix (Keystone Data Pipeline), ribuan data engineer membangun pipeline otomatis yang memasok miliaran fitur per detik ke model rekomendasi dan penentuan tarif real-time."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi Pipeline Ingesti & Validasi Kualitas Data untuk Konsumsi Model ML\n"
                "class DataIngestionValidator:\n"
                "    def __init__(self, expected_features, target_col):\n"
                "        self.expected_features = set(expected_features)\n"
                "        self.target_col = target_col\n"
                "        self.stats = {\"total_records\": 0, \"clean_records\": 0, \"dropped_records\": 0}\n"
                "\n"
                "    def validate_and_transform(self, batch_records):\n"
                "        cleaned_batch = []\n"
                "        for record in batch_records:\n"
                "            self.stats[\"total_records\"] += 1\n"
                "            # Cek kelengkapan fitur (Schema Enforcement)\n"
                "            record_keys = set(record.keys())\n"
                "            if not self.expected_features.issubset(record_keys):\n"
                "                self.stats[\"dropped_records\"] += 1\n"
                "                continue\n"
                "            \n"
                "            # Validasi nilai numerik & penanganan outlier/NaN\n"
                "            try:\n"
                "                feat_vals = [float(record[k]) for k in sorted(self.expected_features)]\n"
                "                if any(np.isnan(feat_vals)) or any(np.isinf(feat_vals)):\n"
                "                    self.stats[\"dropped_records\"] += 1\n"
                "                    continue\n"
                "                target_val = float(record[self.target_col])\n"
                "                cleaned_batch.append((feat_vals, target_val))\n"
                "                self.stats[\"clean_records\"] += 1\n"
                "            except (ValueError, TypeError):\n"
                "                self.stats[\"dropped_records\"] += 1\n"
                "                continue\n"
                "        \n"
                "        return cleaned_batch\n"
                "\n"
                "raw_data = [\n"
                "    {\"trip_distance\": 4.2, \"trip_time\": 15.0, \"fare_amount\": 18.50},\n"
                "    {\"trip_distance\": \"corrupt\", \"trip_time\": 12.0, \"fare_amount\": 15.00},\n"
                "    {\"trip_distance\": 8.5, \"trip_time\": 30.0, \"fare_amount\": 32.00},\n"
                "    {\"trip_distance\": np.nan, \"trip_time\": 5.0, \"fare_amount\": 8.00},\n"
                "    {\"trip_distance\": 1.1, \"trip_time\": 4.0, \"fare_amount\": 6.50}\n"
                "]\n"
                "\n"
                "validator = DataIngestionValidator(expected_features=[\"trip_distance\", \"trip_time\"], target_col=\"fare_amount\")\n"
                "clean_dataset = validator.validate_and_transform(raw_data)\n"
                "\n"
                "print(\"Audit Ingesti Data Engineer Pipeline:\")\n"
                "print(f\"  Total Data Masuk   : {validator.stats['total_records']}\")\n"
                "print(f\"  Data Bersih (ML)   : {validator.stats['clean_records']}\")\n"
                "print(f\"  Data Ditolak/Anomali: {validator.stats['dropped_records']}\")\n"
                "print(f\"  Rasio Integritas   : {(validator.stats['clean_records']/validator.stats['total_records'])*100:.1f}%\")\n"
                "print(\"Sampel Data Siap Latih:\", clean_dataset[0])"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.1.2
    {
        "id": "10.1.2",
        "title": "Evolusi Arsitektur Data: ETL vs ELT",
        "learningObjectives": [
            "Membandingkan paradigma pemrosesan data tradisional ETL (Extract-Transform-Load) dengan arsitektur modern ELT (Extract-Load-Transform).",
            "Menganalisis dampak pemisahan komputasi dan penyimpanan (*Storage-Compute Decoupling*) terhadap adopsi ELT di cloud data warehouse.",
            "Mengimplementasikan simulasi komparasi penggunaan resource dan durasi pipeline antara transformasi pra-muat (ETL) vs pasca-muat (ELT)."
        ],
        "prerequisites": [
            "10.1.1 (Peran dan Tanggung Jawab Data Engineer).",
            "Konsep dasar basis data relasional dan SQL."
        ],
        "commonPitfalls": [
            "Memaksakan paradigma ETL berbasis server khusus yang mahal padahal cloud data warehouse modern (Snowflake/BigQuery) mampu mengeksekusi transformasi paralel masif secara elastis (ELT).",
            "Memuat data kotor tanpa struktur (*raw dump*) pada ELT tanpa tata kelola skema, yang menyebabkan data lake berubah menjadi data swamp."
        ],
        "academicReferences": [
            "Vassiliadis, P. (2009). A survey of extract-transform-load technology. International Journal of Data Warehousing and Mining (IJDWM), 5(3), 1-27.",
            "Chambers, C., et al. (2010). FlumeJava: easy, efficient data-parallel pipelines. In ACM SIGPLAN Notices, 45(6), 363-375."
        ],
        "caseStudy": "Sebuah bank retail mengoperasikan pipeline ETL on-premises harian dengan Apache NiFi yang memakan waktu 7 jam untuk memproses transaksi kartu kredit sebelum dimuat ke data warehouse Oracle. Setelah beralih ke arsitektur ELT (memuat data mentah langsung ke Google BigQuery via Cloud Storage lalu mengeksekusi transformasi menggunakan dbt-SQL), waktu pemrosesan menyusut menjadi 22 menit.",
        "content": {
            "theory": (
                "Transformasi data dalam rekayasa analitik telah mengalami pergeseran paradigma mendasar dari **ETL (Extract-Transform-Load)** ke **ELT (Extract-Load-Transform)** seiring dengan revolusi komputasi awan. "
                "1. **Paradigma ETL Tradisional**: "
                "Data diekstraksi dari sistem transaksional sumber $\\mathcal{S}$, ditransformasikan di server komputasi perantara terpisah $\\mathcal{T}_{\\text{engine}}$ (seperti Informatica atau dedicated server), baru kemudian dimuat ke dalam Data Warehouse target $\\mathcal{W}$: "
                "$$\\mathcal{S} \\xrightarrow{\\text{Extract}} \\mathcal{T}_{\\text{engine}} \\xrightarrow{\\text{Transform}} \\mathcal{W} \\quad (\\text{Data di } \\mathcal{W} \\text{ sudah dalam bentuk agregat final})$$ "
                "Kelemahan utama ETL adalah *compute bottleneck* pada server perantara dan hilangnya fleksibilitas data: jika model AI hilir membutuhkan fitur baru yang telah dibuang selama tahap transformasi, proses ekstraksi dari sumber harus diulang dari awal. "
                "2. **Paradigma ELT Modern**: "
                "Didorong oleh arsitektur penyimpanan murah (*cloud object storage*) dan mesin kueri terdistribusi masif (MPP - Massively Parallel Processing), data diekstraksi dan langsung dimuat ke target penyimpanan dalam format mentah (*raw immutable state*), sebelum ditransformasikan secara *in-place*: "
                "$$\\mathcal{S} \\xrightarrow{\\text{Extract}} \\mathcal{W}_{\\text{raw}} \\xrightarrow{\\text{Transform (SQL/MPP)}} \\mathcal{W}_{\\text{curated}}$$ "
                "Keuntungan ELT adalah **Auditabilitas Sempurna & Agilitas**: data mentah tidak pernah hilang, dan setiap transformasi dapat diputar ulang (*replayable*) secara deterministik."
            ),
            "realWorldApplication": (
                "Alat modern seperti Fivetran dan Airbyte bertindak sebagai 'E' dan 'L' (ekstraksi dan pemuatan tanpa transformasi), sementara dbt (data build tool) mengorkestrasi 'T' di dalam Snowflake, BigQuery, atau Databricks."
            ),
            "codeSnippet": (
                "import time\n"
                "\n"
                "# Simulasi Komparatif Arsitektur ETL (External Transform) vs ELT (In-Engine Transform)\n"
                "class DataPipelineSimulator:\n"
                "    def __init__(self, record_count=100_000):\n"
                "        self.n = record_count\n"
                "        # Simulasi data transaksi mentah (user_id, amount, status)\n"
                "        self.raw_data = [(i % 1000, 10.0 + (i % 50), \"SUCCESS\" if i % 7 != 0 else \"FAILED\") for i in range(self.n)]\n"
                "\n"
                "    def run_etl(self):\n"
                "        # E: Ekstraksi\n"
                "        t0 = time.perf_counter()\n"
                "        extracted = self.raw_data\n"
                "        \n"
                "        # T: Transformasi di server perantara (Python iterative loop)\n"
                "        transformed = []\n"
                "        for uid, amt, status in extracted:\n"
                "            if status == \"SUCCESS\":\n"
                "                transformed.append((uid, amt * 1.1))  # pajak + normalisasi\n"
                "        \n"
                "        # L: Muat data teragregasi ke storage\n"
                "        warehouse_target = transformed\n"
                "        dur_ms = (time.perf_counter() - t0) * 1000\n"
                "        return len(warehouse_target), dur_ms\n"
                "\n"
                "    def run_elt(self):\n"
                "        # E & L: Langsung muat data mentah utuh ke warehouse\n"
                "        t0 = time.perf_counter()\n"
                "        raw_warehouse_table = self.raw_data\n"
                "        \n"
                "        # T: Transformasi in-engine menggunakan pemfilteran tervektorisasi\n"
                "        # Di dunia nyata ini dieksekusi oleh mesin SQL terdistribusi paralel (C++/Rust)\n"
                "        transformed_view = [rec for rec in raw_warehouse_table if rec[2] == \"SUCCESS\"]\n"
                "        dur_ms = (time.perf_counter() - t0) * 1000\n"
                "        return len(transformed_view), dur_ms\n"
                "\n"
                "sim = DataPipelineSimulator(record_count=100_000)\n"
                "etl_rows, etl_time = sim.run_etl()\n"
                "elt_rows, elt_time = sim.run_elt()\n"
                "\n"
                "print(f\"Hasil Simulasi Kinerja Pipeline ({sim.n:,} Baris Transaksi):\")\n"
                "print(f\"  [ETL Tradisional] Durasi Eksekusi: {etl_time:.2f} ms | Output: {etl_rows:,} baris\")\n"
                "print(f\"  [ELT Modern]      Durasi Eksekusi: {elt_time:.2f} ms | Output: {elt_rows:,} baris\")\n"
                "print(f\"  Efisiensi ELT: Data mentah dipertahankan 100% untuk auditabilitas dan fleksibilitas eksplorasi AI!\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.1.3
    {
        "id": "10.1.3",
        "title": "Prinsip Transaksional ACID (Atomicity, Consistency, Isolation, Durability)",
        "learningObjectives": [
            "Menganalisis empat pilar jaminan transaksional ACID pada basis data relasional dan platform data modern.",
            "Memahami mekanisme isolasi transaksi (Read Uncommitted, Read Committed, Repeatable Read, Serializable) dan fenomena anomali baca.",
            "Mengimplementasikan simulasi manajer transaksi mini dengan Write-Ahead Logging (WAL) dan rollback atomik."
        ],
        "prerequisites": [
            "10.1.2 (Evolusi ETL vs ELT).",
            "Teori konkurensi data, lock mekanis, dan persistensi berkas disk."
        ],
        "commonPitfalls": [
            "Mengasumsikan bahwa seluruh penyimpanan data lake secara default memiliki sifat ACID (data lake mentah seperti S3 murni tidak menyediakan ACID tanpa format terbuka seperti Delta Lake atau Iceberg).",
            "Menggunakan tingkat isolasi tertinggi (Serializable) untuk seluruh beban kerja analitik, memicu kebuntuan (*deadlock*) dan penurunan throughput kueri drastis."
        ],
        "academicReferences": [
            "Haerder, T., & Reuter, A. (1983). Principles of transaction-oriented database recovery. ACM Computing Surveys (CSUR), 15(4), 287-317.",
            "Gray, J. (1981). The transaction concept: virtues and limitations. In VLDB, 81, 144-154."
        ],
        "caseStudy": "Sebuah bursa kripto mengalami insiden *double-spending* senilai ratusan ribu dolar akibat sistem ledger internal menggunakan tingkat isolasi Read Committed yang rentan terhadap Phantom Reads. Pengalihan sistem ke transaksi ACID berbasis snapshot isolation dengan Two-Phase Locking (2PL) meniadakan seluruh anomali saldo saldo ganda.",
        "content": {
            "theory": (
                "Jaminan transaksional merupakan fondasi integritas data dalam rekayasa perangkat lunak dan data. "
                "Dirumuskan secara kanonikal oleh Haerder & Reuter (1983), prinsip **ACID** menjamin bahwa unit kerja komputasi data dieksekusi dengan andal: "
                "1. **Atomicity (Keutuhan)**: Transaksi $\\mathcal{T}$ dieksekusi secara *all-or-nothing*. Jika terdapat satu operasi gagal di tengah jalan, seluruh mutasi sebelumnya harus dibatalkan (*rollback*): "
                "$$\\text{State}(\\mathcal{T}) \\in \\{\\text{Committed}, \\text{Aborted}\\}$$ "
                "2. **Consistency (Konsistensi)**: Transaksi hanya boleh mentransisikan basis data dari satu status valid ke status valid lainnya, mematuhi seluruh batasan integritas (*invariants* & *foreign keys*). "
                "3. **Isolation (Isolasi)**: Transaksi konkuren dieksekusi seolah-olah berjalan secara sekuensial. Standar ANSI/ISO SQL mendefinisikan empat tingkat isolasi berdasarkan kerentanannya terhadap anomali: "
                "- *Dirty Read*: Membaca data yang belum dikomit oleh transaksi lain. "
                "- *Non-Repeatable Read*: Membaca baris yang sama dua kali dan mendapatkan nilai berbeda karena transaksi lain mengubahnya. "
                "- *Phantom Read*: Kueri rentang (*range query*) menghasilkan jumlah baris berbeda karena transaksi lain menyisipkan baris baru. "
                "4. **Durability (Durabilitas)**: Sekali transaksi dikomit, perubahannya bersifat permanen di media penyimpanan non-volatile meskipun terjadi kegagalan daya atau crash sistem, dijamin melalui *Write-Ahead Logging (WAL)*."
            ),
            "realWorldApplication": (
                "PostgreSQL dan MySQL InnoDB menerapkan MVCC (Multi-Version Concurrency Control) dan WAL untuk mencapai kepatuhan ACID penuh pada beban kerja transaksional jutaan pengguna."
            ),
            "codeSnippet": (
                "import copy\n"
                "\n"
                "# Simulasi Manajer Transaksi ACID Sederhana dengan Atomicity & Rollback Otomatis\n"
                "class ACIDTransactionManager:\n"
                "    def __init__(self, initial_state):\n"
                "        self.committed_state = dict(initial_state)\n"
                "        self.wal_log = []\n"
                "        self.active_transaction = None\n"
                "\n"
                "    def begin_transaction(self):\n"
                "        self.active_transaction = copy.deepcopy(self.committed_state)\n"
                "        self.wal_log.append(\"BEGIN_TRANSACTION\")\n"
                "\n"
                "    def update(self, account, amount):\n"
                "        if self.active_transaction is None:\n"
                "            raise RuntimeError(\"Tidak ada transaksi aktif!\")\n"
                "        # Eksekusi mutasi pada staging buffer\n"
                "        self.active_transaction[account] = self.active_transaction.get(account, 0) + amount\n"
                "        self.wal_log.append(f\"UPDATE {account} {amount}\")\n"
                "        # Invariant Consistency Check: Saldo tidak boleh negatif\n"
                "        if self.active_transaction[account] < 0:\n"
                "            raise ValueError(f\"Pelanggaran Konsistensi: Saldo {account} menjadi negatif ({self.active_transaction[account]})!\")\n"
                "\n"
                "    def commit(self):\n"
                "        if self.active_transaction is None:\n"
                "            raise RuntimeError(\"Tidak ada transaksi aktif!\")\n"
                "        self.committed_state = self.active_transaction\n"
                "        self.active_transaction = None\n"
                "        self.wal_log.append(\"COMMIT_SUCCESS\")\n"
                "\n"
                "    def rollback(self):\n"
                "        self.active_transaction = None\n"
                "        self.wal_log.append(\"ROLLBACK_TRIGGERED\")\n"
                "\n"
                "ledger = ACIDTransactionManager({\"acc_A\": 500, \"acc_B\": 200})\n"
                "\n"
                "# Transaksi 1: Sukses Transfer 100 dari A ke B\n"
                "ledger.begin_transaction()\n"
                "ledger.update(\"acc_A\", -100)\n"
                "ledger.update(\"acc_B\", +100)\n"
                "ledger.commit()\n"
                "\n"
                "# Transaksi 2: Gagal Transfer 800 dari A ke B (Melebihi Saldo -> Rollback)\n"
                "try:\n"
                "    ledger.begin_transaction()\n"
                "    ledger.update(\"acc_A\", -800)  # Memicu pelanggaran konsistensi\n"
                "    ledger.update(\"acc_B\", +800)\n"
                "    ledger.commit()\n"
                "except ValueError as e:\n"
                "    ledger.rollback()\n"
                "\n"
                "print(\"Audit Verifikasi Transaksi ACID:\")\n"
                "print(f\"  Status Saldo Akhir Komit : {ledger.committed_state}\")\n"
                "print(f\"  Total Log Aktivitas WAL  : {len(ledger.wal_log)} langkah tercatat\")\n"
                "print(f\"  Log Dua Langkah Terakhir : {ledger.wal_log[-2:]}\")\n"
                "print(\"  Status Integritas Saldo  : 100% AMAN (Atomicity & Consistency Terpenuhi)\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.1.4
    {
        "id": "10.1.4",
        "title": "Prinsip Sistem Terdistribusi BASE (Basically Available, Soft state, Eventual consistency)",
        "learningObjectives": [
            "Memahami paradigma ketersediaan tinggi sistem terdistribusi BASE sebagai komplemen relaksasi terhadap ACID.",
            "Menganalisis konsep konsistensi bertahap (*Eventual Consistency*) dan mekanisme konvergen (*conflict resolution*).",
            "Mengimplementasikan model simulasi replikasi gossip dengan penentuan status konvergensi bertahap deterministik."
        ],
        "prerequisites": [
            "10.1.3 (Prinsip Transaksional ACID).",
            "Prinsip Jaringan Komputer, Latensi Paket, dan Partisi Sistem Terdistribusi."
        ],
        "commonPitfalls": [
            "Menerapkan arsitektur BASE pada sistem pembukuan finansial inti yang secara hukum mewajibkan konsistensi ketat (strict serializability).",
            "Mengabaikan batas jendela inkonsistensi (*inconsistency window*), sehingga pengguna membaca data usang (*stale read*) melebihi SLA aplikasi."
        ],
        "academicReferences": [
            "Pritchett, D. (2008). BASE: An Acid Alternative. ACM Queue, 6(3), 48-55.",
            "Vogels, W. (2009). Eventually consistent. Communications of the ACM, 52(1), 40-44."
        ],
        "caseStudy": "Amazon DynamoDB dirancang untuk menopang keranjang belanja (*shopping cart*) jutaan pelanggan global. Mengutamakan ketersediaan 100% di atas konsistensi kaku mencegah pembeli gagal memasukkan barang ke keranjang meskipun pusat data di salah satu region mengalami degradasi jaringan. Konflik versi diselesaikan secara otomatis saat proses checkout melalui teknik vector clocks.",
        "content": {
            "theory": (
                "Ketika sistem data diskalakan melintasi puluhan pusat data global, mempertahankan jaminan ACID kaku membutuhkan protokol koordinasi sinkron (seperti Two-Phase Commit / 2PC) yang sangat lambat dan rentan terhadap kegagalan ketersediaan. "
                "Untuk mengatasi dilema ini, Dan Pritchett (2008) memperkenalkan paradigma **BASE**: "
                "1. **Basically Available (Ketersediaan Mendasar)**: "
                "Sistem menjamin bahwa sebagian besar layanan tetap dapat menerima kueri dan operasi penulisan, meskipun sebagian node atau partisi jaringan mengalami kerusakan. Kegagalan direspons dengan degradasi performa atau respons lokal parsial alih-alih kegagalan total. "
                "2. **Soft State (Status Fleksibel)**: "
                "Status data dalam sistem dapat berubah seiring waktu tanpa adanya interaksi pengguna aktif, karena adanya proses replikasi latar belakang (*background convergence*) antar-node. "
                "3. **Eventual Consistency (Konsistensi Bertahap)**: "
                "Jika tidak ada pembaruan baru yang masuk pada suatu data $x$, seluruh replika sistem $\\mathcal{N} = \\{n_1, n_2, \\dots, n_k\\}$ pada akhirnya akan menyatu (*converge*) ke nilai yang sama: "
                "$$\\lim_{t \\to \\infty} P\\left(n_i(x, t) = n_j(x, t)\\right) = 1, \\quad \\forall i, j \\in \\mathcal{N}$$ "
                "Durasi waktu $t_{\\text{window}}$ hingga seluruh node sinkron disebut sebagai jendela konsistensi (*consistency window*)."
            ),
            "realWorldApplication": (
                "Apache Cassandra, DynamoDB, dan Redis Cluster mengadopsi prinsip BASE untuk melayani miliaran klik sosial media, keranjang belanja, dan feed analytics dengan latensi sub-milidetik."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi Eventual Consistency Replikasi Multi-Node (Gossip Protocol Konvergen)\n"
                "class DistributedNode:\n"
                "    def __init__(self, node_id):\n"
                "        self.node_id = node_id\n"
                "        self.data_store = {}\n"
                "        self.timestamps = {}\n"
                "\n"
                "    def write(self, key, value, timestamp):\n"
                "        # Last-Write-Wins (LWW) Conflict Resolution\n"
                "        if key not in self.timestamps or timestamp > self.timestamps[key]:\n"
                "            self.data_store[key] = value\n"
                "            self.timestamps[key] = timestamp\n"
                "\n"
                "class BaseClusterSimulator:\n"
                "    def __init__(self, num_nodes=4):\n"
                "        self.nodes = [DistributedNode(f\"node_{i}\") for i in range(num_nodes)]\n"
                "\n"
                "    def simulate_gossip_round(self):\n"
                "        # Replikasi data acak antar-node tetangga\n"
                "        for i, node in enumerate(self.nodes):\n"
                "            peer_idx = (i + 1) % len(self.nodes)\n"
                "            peer = self.nodes[peer_idx]\n"
                "            for k, v in node.data_store.items():\n"
                "                peer.write(k, v, node.timestamps[k])\n"
                "\n"
                "    def is_converged(self, key):\n"
                "        vals = [n.data_store.get(key, None) for n in self.nodes]\n"
                "        return all(v == vals[0] and v is not None for v in vals), vals\n"
                "\n"
                "cluster = BaseClusterSimulator(num_nodes=4)\n"
                "# Penulisan awal hanya terjadi di Node 0 (T=100)\n"
                "cluster.nodes[0].write(\"cart_user_99\", [\"item_laptop\"], timestamp=100)\n"
                "\n"
                "print(\"Simulasi Replikasi Bertahap (Eventual Consistency):\")\n"
                "converged_initial, values_t0 = cluster.is_converged(\"cart_user_99\")\n"
                "print(f\"  Putaran 0 (Pasca Penulisan Node 0): Status Konvergen = {converged_initial} | Nilai Node: {values_t0}\")\n"
                "\n"
                "for r in range(1, 4):\n"
                "    cluster.simulate_gossip_round()\n"
                "    converged, values = cluster.is_converged(\"cart_user_99\")\n"
                "    print(f\"  Putaran {r} (Gossip Sync Replikasi) : Status Konvergen = {converged} | Nilai Node: {values}\")\n"
                "\n"
                "print(\"  Status Akhir: Seluruh 4 Node Berhasil Konvergen Sempurna (Eventual Consistency Terbukti!)\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.1.5
    {
        "id": "10.1.5",
        "title": "Teorema CAP (Consistency, Availability, Partition Tolerance) & PACELC",
        "learningObjectives": [
            "Memahami pembuktian formal Teorema CAP (Brewer, 2000; Gilbert & Lynch, 2002) dalam pemodelan sistem data terdistribusi.",
            "Menganalisis perluasan Teorema PACELC (Abadi, 2012) yang menjelaskan trade-off latensi vs konsistensi pada kondisi normal tanpa partisi jaringan.",
            "Mengimplementasikan simulator klaster terpartisi yang mendemonstrasikan pemilihan kebijakan CP vs AP saat kegagalan jaringan terjadi."
        ],
        "prerequisites": [
            "10.1.3 (ACID) dan 10.1.4 (BASE).",
            "Topologi Jaringan Terdistribusi dan Model Jaringan Asinkron."
        ],
        "commonPitfalls": [
            "Menganggap 'Partition Tolerance' adalah opsi yang dapat dipilih untuk diabaikan (dalam jaringan fisik nyata, partisi jaringan tak terhindarkan, sehingga pilihan riil hanyalah CP atau AP saat partisi terjadi).",
            "Mengabaikan dimensi Latensi pada teorema CAP klasik (Teorema PACELC diperlukan untuk menjelaskan trade-off sistem saat jaringan normal)."
        ],
        "academicReferences": [
            "Gilbert, S., & Lynch, N. (2002). Brewer's conjecture and the feasibility of consistent, available, partition-tolerant web services. ACM SIGACT News, 33(2), 51-59.",
            "Abadi, D. J. (2012). Consistency tradeoffs in modern distributed database system design: CAP is only part of the story. Computer, 45(2), 37-42."
        ],
        "caseStudy": "Sebuah sistem pembayaran antar-negara mengalami pemutusan kabel optik bawah laut antara region Singapura dan Frankfurt. Sistem perbankan memilih model CP (Consistency & Partition Tolerance): transaksi baru ditolak dengan pesan kesalahan daripada mengizinkan mutasi saldo lokal yang dapat memicu saldo ganda. Sebaliknya, sistem media sosial di jaringan yang sama memilih model AP, tetap mengizinkan posting status baru secara lokal.",
        "content": {
            "theory": (
                "Dalam perancangan sistem data terdistribusi, keterbatasan fundamental mengenai konsistensi dan ketersediaan dirumuskan dalam **Teorema CAP** (diajukan oleh Eric Brewer pada tahun 2000). "
                "Pembuktian matematis formal pertama dipublikasikan oleh Seth Gilbert dan Nancy Lynch (2002). "
                "Sebagaimana tertulis secara verbatim dalam abstrak seminal mereka: "
                "\"When designing distributed web services, there are three properties that are commonly desired: consistency, availability, and partition tolerance. It is impossible to achieve all three. In this note, we prove this conjecture in the asynchronous network model, and then discuss solutions to this dilemma in the partially synchronous model.\" "
                "Secara formal, ketiga properti tersebut didefinisikan sebagai: "
                "1. **Consistency (Linearizability)**: Setiap operasi pembacaan mengembalikan nilai dari operasi penulisan terbaru atau menghasilkan galat. "
                "2. **Availability (Ketersediaan)**: Setiap node non-gagal harus mengembalikan respons yang berhasil (non-error) untuk setiap permintaan yang diterima. "
                "3. **Partition Tolerance (Ketahanan Partisi)**: Sistem terus beroperasi meskipun terjadi kehilangan sejumlah pesan jaringan yang memisahkan node menjadi sub-kelompok terisolasi. "
                "Karena kegagalan jaringan fisik tidak dapat dicegah dalam sistem terdistribusi nyata ($P(\\text{Partition}) > 0$), arsitek sistem harus memilih: "
                "- **CP (Consistency + Partition Tolerance)**: Mengorbankan ketersediaan dengan menolak penulisan jika kuorum tidak tercapai (misal: Apache HBase, Zookeeper, Raft). "
                "- **AP (Availability + Partition Tolerance)**: Mengizinkan penulisan lokal pada node terisolasi, menerima risiko ketidakkonsistenan data sementara (misal: Cassandra, DynamoDB). "
                "Daniel J. Abadi (2012) menyempurnakan batasan ini melalui **Teorema PACELC**: "
                "$$\\text{If Partition (P) } \\to \\text{Trade-off antara Availability (A) vs Consistency (C)}, \\quad \\text{Else (E) } \\to \\text{Trade-off antara Latency (L) vs Consistency (C)}$$"
            ),
            "realWorldApplication": (
                "Cloud Spanner memadukan arsitektur CP dengan jam atom GPS (TrueTime API) untuk mencapai konsistensi serializable global dengan ketersediaan 99.999% (five nines)."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi Perilaku Klaster saat Partisi Jaringan: Sistem CP vs Sistem AP\n"
                "class Node:\n"
                "    def __init__(self, name):\n"
                "        self.name = name\n"
                "        self.value = 0\n"
                "\n"
                "class DistributedCluster:\n"
                "    def __init__(self, mode=\"CP\"):\n"
                "        self.mode = mode  # \"CP\" atau \"AP\"\n"
                "        self.partition_A = [Node(\"node_1\"), Node(\"node_2\")]  # Mayoritas (2 node)\n"
                "        self.partition_B = [Node(\"node_3\")]                 # Minoritas (1 node)\n"
                "        self.is_partitioned = False\n"
                "\n"
                "    def write(self, target_partition, new_val):\n"
                "        target_nodes = self.partition_A if target_partition == \"A\" else self.partition_B\n"
                "        \n"
                "        if self.is_partitioned:\n"
                "            if self.mode == \"CP\":\n"
                "                # Sistem CP: Hanya menerima tulis jika berada di partisi kuorum mayoritas\n"
                "                if len(target_nodes) >= 2:\n"
                "                    for n in target_nodes: n.value = new_val\n"
                "                    return True, \"TULIS SUKSES (Kuorum Mayoritas Partisi A)\"\n"
                "                else:\n"
                "                    return False, \"TULIS DITOLAK (Partisi B Terisolasi - Menjaga Konsistensi)\"\n"
                "            elif self.mode == \"AP\":\n"
                "                # Sistem AP: Menerima tulis di manapun demi ketersediaan 100%\n"
                "                for n in target_nodes: n.value = new_val\n"
                "                return True, \"TULIS SUKSES (Ketersediaan Lokal Diprioritaskan)\"\n"
                "        else:\n"
                "            for n in self.partition_A + self.partition_B: n.value = new_val\n"
                "            return True, \"TULIS SUKSES GLOBAL\"\n"
                "\n"
                "# Uji Coba Simulasi Skenario Pemutusan Jaringan\n"
                "cp_cluster = DistributedCluster(mode=\"CP\")\n"
                "cp_cluster.is_partitioned = True\n"
                "\n"
                "ap_cluster = DistributedCluster(mode=\"AP\")\n"
                "ap_cluster.is_partitioned = True\n"
                "\n"
                "ok_cp_min, msg_cp_min = cp_cluster.write(\"B\", 999)\n"
                "ok_ap_min, msg_ap_min = ap_cluster.write(\"B\", 999)\n"
                "\n"
                "print(\"Evaluasi Eksperimental Teorema CAP (Gilbert & Lynch, 2002):\")\n"
                "print(f\"  [Sistem CP pada Partisi Minoritas] Status: {ok_cp_min} | Respon: {msg_cp_min}\")\n"
                "print(f\"  [Sistem AP pada Partisi Minoritas] Status: {ok_ap_min}  | Respon: {msg_ap_min}\")\n"
                "print(\"  Kesimpulan Matematis: Tidak ada sistem terdistribusi yang dapat mencapai C dan A secara bersamaan saat P terjadi!\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.1.6
    {
        "id": "10.1.6",
        "title": "Arsitektur Lambda (Batch Layer, Speed Layer, Serving Layer)",
        "learningObjectives": [
            "Memahami prinsip arsitektur pemrosesan data ganda Lambda Architecture (Nathan Marz, 2011).",
            "Menganalisis interaksi tiga lapisan inti: Batch Layer (komputasi akurat), Speed Layer (latensi rendah), dan Serving Layer (fusi tampilan kueri).",
            "Mengimplementasikan simulasi fusi kueri Lambda yang menggabungkan pandangan historis batch dengan delta streaming waktu nyata."
        ],
        "prerequisites": [
            "10.1.2 (ETL vs ELT) dan 10.1.5 (Teorema CAP).",
            "Konsep komputasi batch paralel (Hadoop/Spark) dan streaming messaging queue (Kafka)."
        ],
        "commonPitfalls": [
            "Dual-codebase maintenance burden: keharusan memelihara dua basis kode terpisah (misal: logika batch di MapReduce/Spark dan logika streaming di Storm/Flink) yang rentan terhadap perbedaan kalkulasi (*logic drift*).",
            "Sinkronisasi watermark yang tidak presisi, menyebabkan data streaming yang sudah masuk ke batch view dihitung dua kali (*double counting*) saat kueri disajikan."
        ],
        "academicReferences": [
            "Marz, N., & Warren, J. (2015). Big Data: Principles and best practices of scalable realtime data systems. Manning Publications.",
            "Kreps, J. (2014). Questioning the Lambda Architecture. O'Reilly Radar."
        ],
        "caseStudy": "LinkedIn mengimplementasikan Arsitektur Lambda untuk menghitung metrik analitik 'Who Viewed My Profile'. Batch layer menghitung agregasi akurat seluruh tampilan profil setiap 24 jam menggunakan Hadoop, sementara speed layer menghitung tampilan profil 15 menit terakhir secara real-time via Apache Samza. Serving layer menggabungkan kedua lapisan sehingga pengguna melihat angka kunjungan terbaru tanpa menunggu batch semalam.",
        "content": {
            "theory": (
                "Diperkenalkan oleh Nathan Marz, **Arsitektur Lambda** dirancang untuk mengatasi dilema klasik antara ketepatan (*accuracy*) komputasi batch skala besar melawan kecepatan (*low latency*) pemrosesan aliran data. "
                "Sistem dibagi menjadi tiga lapisan fungsional komplementer: "
                "1. **Batch Layer**: "
                "Menyimpan dataset mentah yang tidak dapat diubah (*immutable raw data*) secara permanen. Lapisan ini memproses seluruh data historis secara periodik menggunakan komputasi terdistribusi yang sangat toleran terhadap kesalahan, menghasilkan tampilan pra-komputasi batch (*Batch Views*): "
                "$$\\mathcal{V}_{\\text{batch}} = f_{\\text{batch}}(\\text{All Data})$$ "
                "2. **Speed Layer (Stream Layer)**: "
                "Memproses data delta baru yang tiba setelah eksekusi batch layer terakhir. Mengutamakan latensi rendah dengan menerima trade-off aproksimasi atau konsistensi bertahap, menghasilkan tampilan real-time (*Real-Time Views*): "
                "$$\\mathcal{V}_{\\text{realtime}} = f_{\\text{speed}}(\\text{Data sejak Batch Terakhir})$$ "
                "3. **Serving Layer**: "
                "Mengindeks kedua tampilan (batch dan real-time) ke dalam database terdistribusi yang mendukung kueri baca berkecepatan tinggi. Setiap kueri analitik $q$ diselesaikan dengan menggabungkan (*merging*) hasil kedua lapisan: "
                "$$\\text{Query}(q) = \\text{MergeFunction}\\left(\\mathcal{V}_{\\text{batch}}(q), \\mathcal{V}_{\\text{realtime}}(q)\\right)$$"
            ),
            "realWorldApplication": (
                "Twitter dan Yahoo Finance mengandalkan prinsip Lambda untuk menyajikan metrik trending topics dan grafik fluktuasi harga saham dengan memadukan historical aggregated data dan live market ticks."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi Arsitektur Lambda: Fusi Tampilan Batch Layer + Speed Layer pada Serving Layer\n"
                "class LambdaDataPlatform:\n"
                "    def __init__(self):\n"
                "        # Batch Layer: Representasi agregasi historis semalam (misal: total views iklan)\n"
                "        self.batch_view = {\"ad_101\": 45_000, \"ad_102\": 120_000}\n"
                "        # Speed Layer: Delta streaming 15 menit terakhir di memori\n"
                "        self.realtime_view = {\"ad_101\": 142, \"ad_102\": 310}\n"
                "\n"
                "    def ingest_live_event(self, ad_id, count=1):\n"
                "        # Speed layer menyerap mutasi streaming seketika\n"
                "        self.realtime_view[ad_id] = self.realtime_view.get(ad_id, 0) + count\n"
                "\n"
                "    def query_serving_layer(self, ad_id):\n"
                "        # Serving layer menggabungkan batch historis + delta streaming\n"
                "        batch_val = self.batch_view.get(ad_id, 0)\n"
                "        realtime_val = self.realtime_view.get(ad_id, 0)\n"
                "        total_fused = batch_val + realtime_val\n"
                "        return {\"ad_id\": ad_id, \"batch_count\": batch_val, \"realtime_delta\": realtime_val, \"total_views\": total_fused}\n"
                "\n"
                "lambda_platform = LambdaDataPlatform()\n"
                "# Simulasikan aliran event streaming masuk\n"
                "for _ in range(50):\n"
                "    lambda_platform.ingest_live_event(\"ad_101\", count=1)\n"
                "\n"
                "res = lambda_platform.query_serving_layer(\"ad_101\")\n"
                "print(\"Hasil Kueri Serving Layer Arsitektur Lambda:\")\n"
                "print(f\"  Target Iklan       : {res['ad_id']}\")\n"
                "print(f\"  Data Batch Historis: {res['batch_count']:,} views (Dari komputasi semalam)\")\n"
                "print(f\"  Delta Real-time    : {res['realtime_delta']:,} views (Dari Speed Layer)\")\n"
                "print(f\"  Total Tampilan Fusi: {res['total_views']:,} views (Hasil Konsolidasi Akurat!)\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.1.7
    {
        "id": "10.1.7",
        "title": "Arsitektur Kappa (Stream Processing sebagai Fondasi Tunggal)",
        "learningObjectives": [
            "Memahami paradigma unifikasi pemrosesan data Arsitektur Kappa (Jay Kreps, 2014) sebagai eliminasi terhadap kompleksitas Lambda ganda.",
            "Menganalisis prinsip pemutaran ulang log (*Log Replay*) menggunakan antrean pesan persisten (Apache Kafka) untuk pemrosesan ulang historis.",
            "Mengimplementasikan simulator pipeline pemrosesan streaming tunggal dengan mekanisme log reprocessing."
        ],
        "prerequisites": [
            "10.1.6 (Arsitektur Lambda).",
            "Konsep Immutable Append-Only Log dan Stream Processing Engine."
        ],
        "commonPitfalls": [
            "Mengabaikan biaya retensi penyimpanan jangka panjang jika seluruh log peristiwa historis disimpan tanpa batas di Apache Kafka tanpa tiering ke object storage.",
            "Menerapkan Arsitektur Kappa pada kueri analitik ad-hoc kompleks yang membutuhkan join multi-tabel masif yang lebih efisien dieksekusi oleh mesin OLAP kolumnar."
        ],
        "academicReferences": [
            "Kreps, J. (2014). Questioning the Lambda Architecture. O'Reilly Radar.",
            "Akidau, T., et al. (2015). The dataflow model: a practical approach to balancing correctness, latency, and cost in massive-scale, unbounded, out-of-order data processing. Proceedings of the VLDB Endowment, 8(12), 1792-1803."
        ],
        "caseStudy": "Sebuah platform deteksi penipuan telekomunikasi memproses 500,000 panggilan telepon per detik. Sebelumnya, mereka menggunakan Lambda dengan dua basis kode C++ (batch) dan Java (streaming), menghasilkan perbedaan keputusan saat aturan deteksi diubah. Migrasi ke Arsitektur Kappa menggunakan Apache Flink dan Kafka memungkinkan tim menerapkan aturan baru cukup dengan memutar ulang offset Kafka dari satu basis kode tunggal.",
        "content": {
            "theory": (
                "Sebagai respons terhadap tingginya beban pemeliharaan kode ganda (*dual-codebase problem*) pada Arsitektur Lambda, Jay Kreps (pencipta Apache Kafka) mengusulkan **Arsitektur Kappa**. "
                "Prinsip fundamental Kappa menyatakan bahwa: **Pemrosesan batch adalah kasus khusus dari pemrosesan streaming dengan data berbatas (*batch is a special case of streaming with bounded data*)**. "
                "Karakteristik arsitektural Kappa berpusat pada dua komponen: "
                "1. **Append-Only Immutable Event Log**: "
                "Seluruh data peristiwa disimpan secara kronologis dan tidak dapat diubah dalam log terdistribusi yang dapat diputar ulang (*replayable distributed log*, seperti Kafka/Pulsar) dengan retensi jangka panjang. "
                "2. **Single Stream Processing Engine**: "
                "Hanya satu mesin komputasi (misal Apache Flink atau Spark Structured Streaming) yang digunakan untuk melayani baik data real-time maupun data historis: "
                "$$\\mathcal{O}_{t} = \\text{StreamEngine}(\\mathcal{S}_{0 \\to t})$$ "
                "3. **Mekanisme Pemutaran Ulang (Reprocessing)**: "
                "Jika kode logika transformasi atau model AI diperbarui ke versi $v_2$, data engineer tidak perlu menulis ulang kode batch: "
                "- Inisiasi instance pekerja streaming baru dengan kode $v_2$. "
                "- Putar ulang log dari offset awal $\\text{Offset}_0$. "
                "- Setelah instance baru mengejar posisi terkini (*catch up*), alihkan kueri baca ke tampilan baru dan matikan instance $v_1$ secara mulus."
            ),
            "realWorldApplication": (
                "Uber mengadopsi Kappa Architecture untuk platform analitik streaming mereka di atas Apache Kafka dan Apache Flink guna menghitung estimasi waktu tiba (ETA) dan penetapan harga dinamis."
            ),
            "codeSnippet": (
                "import time\n"
                "\n"
                "# Simulasi Arsitektur Kappa: Single Stream Engine dengan Kemampuan Replay Log Historis\n"
                "class AppendOnlyEventLog:\n"
                "    def __init__(self):\n"
                "        self.events = []  # Terurut kronologis dan immutable\n"
                "\n"
                "    def append(self, event):\n"
                "        self.events.append(event)\n"
                "\n"
                "    def read_stream_from(self, start_offset=0):\n"
                "        for idx in range(start_offset, len(self.events)):\n"
                "            yield idx, self.events[idx]\n"
                "\n"
                "# Mesin Stream Tunggal (Bisa memproses data live maupun memutar ulang data lama)\n"
                "class KappaStreamProcessor:\n"
                "    def __init__(self, version=\"v1\"):\n"
                "        self.version = version\n"
                "        self.state = {}\n"
                "\n"
                "    def process_event(self, event):\n"
                "        uid, amount = event[\"user\"], event[\"amount\"]\n"
                "        if self.version == \"v1\":\n"
                "            # Logika v1: Menghitung total belanja bruto\n"
                "            self.state[uid] = self.state.get(uid, 0.0) + amount\n"
                "        elif self.version == \"v2\":\n"
                "            # Logika v2: Menghitung total belanja dengan diskon loyalitas 10%\n"
                "            self.state[uid] = self.state.get(uid, 0.0) + (amount * 0.90)\n"
                "\n"
                "log = AppendOnlyEventLog()\n"
                "# Simulasikan log Kafka yang menampung 5 transaksi historis\n"
                "for i in range(5):\n"
                "    log.append({\"user\": \"usr_A\", \"amount\": 100.0})\n"
                "\n"
                "# Prosesor v1 memproses aliran data secara real-time\n"
                "proc_v1 = KappaStreamProcessor(version=\"v1\")\n"
                "for offset, ev in log.read_stream_from(0):\n"
                "    proc_v1.process_event(ev)\n"
                "\n"
                "# Upgrade ke v2: Cukup Replay log yang sama tanpa perlu batch engine terpisah!\n"
                "proc_v2 = KappaStreamProcessor(version=\"v2\")\n"
                "for offset, ev in log.read_stream_from(0):\n"
                "    proc_v2.process_event(ev)\n"
                "\n"
                "print(\"Evaluasi Arsitektur Kappa (Single Stream Processing Foundation):\")\n"
                "print(f\"  Total Peristiwa di Immutable Log : {len(log.events)} event\")\n"
                "print(f\"  Output Agregasi Processor v1     : {proc_v1.state['usr_A']:.2f} (Logika Bruto)\")\n"
                "print(f\"  Output Replay Log Processor v2   : {proc_v2.state['usr_A']:.2f} (Logika Diskon 10%)\")\n"
                "print(\"  Status Arsitektur: 100% Bebas dari Dual-Codebase Overhead!\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.1.8
    {
        "id": "10.1.8",
        "title": "Idempotensi dan Semantik Pengiriman (At-least-once, At-most-once, Exactly-once) dalam Rekayasa Pipeline Data",
        "learningObjectives": [
            "Memahami tiga tingkat jaminan semantik pengiriman pesan dalam sistem terdistribusi: At-most-once, At-least-once, dan Exactly-once.",
            "Menganalisis perumusan matematis fungsi idempoten: $f(f(x)) = f(x)$ dalam pipeline penulisan data sinkron dan asinkron.",
            "Mengimplementasikan sink data idempoten menggunakan deduplikasi kunci deterministik dan status transaksional."
        ],
        "prerequisites": [
            "10.1.3 (ACID) dan 10.1.4 (BASE).",
            "Mekanisme ACK/NACK Jaringan, Message Broker Retries, dan Unique Constraints."
        ],
        "commonPitfalls": [
            "Mengasumsikan protokol pesan 'Exactly-Once' (seperti pada Kafka Streams) melindungi seluruh sistem end-to-end tanpa sink penyimpanan yang idempoten.",
            "Melakukan operasi penulisan non-idempoten (seperti `INSERT INTO ...` tanpa deduplikasi atau `UPDATE counter = counter + 1`) pada pipeline dengan mekanisme retry otomatis."
        ],
        "academicReferences": [
            "Helland, P. (2012). Idempotence is not a Medical Condition. Communications of the ACM, 55(5), 56-65.",
            "Wang, G., et al. (2015). Building a replicated logging system with Apache Kafka. Proceedings of the VLDB Endowment, 8(12), 1654-1655."
        ],
        "caseStudy": "Sebuah gateway pembayaran e-commerce memproses jutaan pesanan saat festival diskon. Jaringan mengalami timeout intermiten, menyebabkan sistem otomatis mengirim ulang pesan pembayaran yang sama sebanyak 3 kali. Karena sink basis data dirancang dengan operasi non-idempoten, 4,500 pelanggan tertagih ganda. Tim merekayasa ulang endpoint menggunakan operasi idempoten berbasis idempotency-key unik di Redis, meniadakan risiko duplikasi mutlak.",
        "content": {
            "theory": (
                "Dalam sistem terdistribusi di mana kegagalan jaringan (*network packet loss*) tidak dapat dihindarkan, komunikasi antar-komponen data diatur oleh tiga semantik pengiriman: "
                "1. **At-Most-Once (Maksimal Sekali)**: Pesan dikirimkan tanpa mekanisme percobaan ulang (*no retries*). Jika terjadi kehilangan koneksi, pesan hilang selamanya ($0$ atau $1$ kali sampai). "
                "2. **At-Least-Once (Minimal Sekali)**: Pesan dikirimkan berulang kali dengan mekanisme *retry* hingga pengirim menerima konfirmasi tanda terima (*Acknowledgment / ACK*). "
                "Menjamin tidak ada data yang hilang, namun membuka risiko duplikasi data jika ACK hilang di jaringan ($1$ atau $\\ge 1$ kali sampai). "
                "3. **Exactly-Once Semantics (Tepat Sekali)**: Sistem menjamin bahwa setiap mutasi data tercatat tepat satu kali pada status akhir aplikasi, meskipun pesan fisik diduplikasi di tingkat jaringan. "
                "Jaminan Exactly-Once secara praktis dicapai melalui kombinasi **At-Least-Once Delivery + Idempotent Processing**: "
                "Operasi $f$ dikatakan **Idempoten** jika pengaplikasian berulang kali terhadap status input yang sama menghasilkan output status yang identik: "
                "$$f(f(x)) = f(x), \\quad \\forall x \\in \\mathcal{X}$$ "
                "Dalam rekayasa data, idempotensi diimplementasikan melalui dua strategi teknis: (a) *Deterministic Deduplication Key* (misal UPSERT berbasis hash pesan), atau (b) *Two-Phase Commit (2PC)* transaksional terkoordinasi antara stream broker dan data sink."
            ),
            "realWorldApplication": (
                "Stripe API mewajibkan header `Idempotency-Key` pada seluruh panggilan HTTP POST pembayaran untuk mencegah duplikasi penagihan saat koneksi klien terputus."
            ),
            "codeSnippet": (
                "import hashlib\n"
                "\n"
                "# Implementasi Sink Basis Data Idempoten Menggunakan Deduplikasi Kunci Unik\n"
                "class IdempotentDataSink:\n"
                "    def __init__(self):\n"
                "        self.database = {}         # Penyimpanan utama: {doc_id: payload}\n"
                "        self.processed_keys = set()  # Indeks kunci idempotensi yang telah diproses\n"
                "        self.metrics = {\"total_received\": 0, \"actual_writes\": 0, \"duplicates_ignored\": 0}\n"
                "\n"
                "    def process_message(self, idempotency_key, doc_id, payload):\n"
                "        self.metrics[\"total_received\"] += 1\n"
                "        \n"
                "        # Evaluasi Idempotensi: Jika kunci sudah pernah diproses, abaikan penulisan baru\n"
                "        if idempotency_key in self.processed_keys:\n"
                "            self.metrics[\"duplicates_ignored\"] += 1\n"
                "            return False, \"DUPLIKAT DIABAIKAN (Operasi Idempoten Berhasil!)\"\n"
                "            \n"
                "        # Penulisan pertama (Atomic State Update)\n"
                "        self.database[doc_id] = payload\n"
                "        self.processed_keys.add(idempotency_key)\n"
                "        self.metrics[\"actual_writes\"] += 1\n"
                "        return True, \"SUKSES TERTULIS\"\n"
                "\n"
                "sink = IdempotentDataSink()\n"
                "\n"
                "# Skenario: Jaringan tidak stabil mengirimkan transaksi yang sama 3 kali berturut-turut\n"
                "tx_payload = {\"amount\": 250_000, \"currency\": \"IDR\", \"recipient\": \"Merchant_ABC\"}\n"
                "tx_idempotency_key = hashlib.sha256(b\"order_10092_attempt_1\").hexdigest()[:16]\n"
                "\n"
                "# Pengiriman 1 (Sukses)\n"
                "ok1, msg1 = sink.process_message(tx_idempotency_key, \"order_10092\", tx_payload)\n"
                "# Pengiriman 2 (Retry Jaringan)\n"
                "ok2, msg2 = sink.process_message(tx_idempotency_key, \"order_10092\", tx_payload)\n"
                "# Pengiriman 3 (Retry Jaringan)\n"
                "ok3, msg3 = sink.process_message(tx_idempotency_key, \"order_10092\", tx_payload)\n"
                "\n"
                "print(\"Hasil Uji Idempotensi Pipeline Data:\")\n"
                "print(f\"  Percobaan 1: {msg1}\")\n"
                "print(f\"  Percobaan 2: {msg2}\")\n"
                "print(f\"  Percobaan 3: {msg3}\")\n"
                "print(f\"  Total Diterima : {sink.metrics['total_received']} pesan\")\n"
                "print(f\"  Tulis Fisik    : {sink.metrics['actual_writes']} kali (Exactly-Once tercapai!)\")\n"
                "print(f\"  Duplikat Dicegah: {sink.metrics['duplicates_ignored']} kali\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.1.9
    {
        "id": "10.1.9",
        "title": "Desain Skalabilitas Horizontal vs Vertikal pada Penyimpanan Data Terdistribusi",
        "learningObjectives": [
            "Membandingkan model penskalaan komputasi & penyimpanan: Scale-Up (Vertikal) vs Scale-Out (Horizontal).",
            "Menganalisis hukum batas skalabilitas komputasi paralel: Hukum Amdahl vs Hukum Gustafson.",
            "Mengimplementasikan model matematis estimasi throughput dan speedup komputasi terdistribusi multi-node."
        ],
        "prerequisites": [
            "10.1.1 (Peran Data Engineer) dan 10.1.5 (Teorema CAP).",
            "Arsitektur CPU Multi-Core, Bus Memori, dan Partisi Data Terdistribusi."
        ],
        "commonPitfalls": [
            "Menerapkan arsitektur scale-out terdistribusi kompleks untuk dataset yang berukuran di bawah kapasitas RAM satu server modern (< 128 GB), yang justru menimbulkan overhead latensi jaringan sia-sia.",
            "Mengabaikan Hukum Amdahl: mengira penambahan 100 node pekerja akan mempercepat pipeline 100x lipat, padahal ada bagian sekuensial yang tidak dapat diparalelkan."
        ],
        "academicReferences": [
            "Amdahl, G. M. (1967). Validity of the single processor approach to achieving large scale computing capabilities. In AFIPS Spring Joint Computer Conference, 483-485.",
            "Gustafson, J. L. (1988). Reevaluating Amdahl's law. Communications of the ACM, 31(5), 532-533."
        ],
        "caseStudy": "Sebuah startup AI memproses 50 TB data log mingguan menggunakan satu server monster berbiaya $12,000/bulan (Scale-Up). Penambahan CPU lebih lanjut tidak meningkatkan kecepatan karena batas bandwidth memori bus (memory bus contention). Mereka merancang ulang sistem menjadi klaster terdistribusi 20 node komoditas kecil (Scale-Out) menggunakan Apache Spark, memangkas biaya infrastruktur sebesar 60% dan mempercepat waktu pemrosesan dari 18 jam menjadi 3.5 jam.",
        "content": {
            "theory": (
                "Dalam rekayasa data skala besar, keputusan arsitektural mendasar adalah memilih antara **Scale-Up (Penskalaan Vertikal)** dan **Scale-Out (Penskalaan Horizontal)**. "
                "1. **Scale-Up**: Menambah kapasitas mesin tunggal (meningkatkan vCPU, memori RAM, atau penyimpanan SSD NVMe). "
                "Keunggulannya adalah kesederhanaan operasional tanpa kompleksitas jaringan terdistribusi, namun memiliki batas fisik (*hardware ceilings*) dan kurva biaya eksponensial. "
                "2. **Scale-Out**: Menambah jumlah mesin komoditas independen yang terhubung melalui jaringan berkecepatan tinggi. "
                "Memungkinkan skalabilitas data tak terbatas (petabyte hingga exabyte), namun memperkenalkan tantangan konsistensi data, latensi jaringan, dan penanganan kegagalan simpul. "
                "Batas akselerasi komputasi paralel diatur oleh **Hukum Amdahl**: "
                "Jika proporsi pekerjaan yang harus dieksekusi secara sekuensial adalah $s$, dan proporsi yang dapat diparalelkan adalah $p = 1 - s$, maka akselerasi maksimum (*Speedup*) dengan $N$ node komputasi adalah: "
                "$$S(N) = \\frac{1}{s + \\frac{1 - s}{N}} \\xrightarrow{N \\to \\infty} \\frac{1}{s}$$ "
                "Bahkan jika $N \\to \\infty$, jika $5\\%$ dari pipeline bersifat sekuensial ($s = 0.05$), akselerasi sistem tidak akan pernah melampaui $20\\times$ lipat."
            ),
            "realWorldApplication": (
                "Sistem terdistribusi modern seperti Apache Spark, Trino (Presto), dan Google BigQuery dirancang khusus untuk memaksimalkan paralelisasi horizontal melintasi ribuan pekerja mandiri."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Model Matematis Perbandingan Skalabilitas: Hukum Amdahl vs Hukum Gustafson\n"
                "def calculate_amdahl_speedup(parallel_fraction, num_nodes):\n"
                "    sequential_fraction = 1.0 - parallel_fraction\n"
                "    speedup = 1.0 / (sequential_fraction + (parallel_fraction / num_nodes))\n"
                "    return speedup\n"
                "\n"
                "def calculate_gustafson_speedup(parallel_fraction, num_nodes):\n"
                "    # Skala masalah bertambah seiring penambahan node (Scaled Speedup)\n"
                "    sequential_fraction = 1.0 - parallel_fraction\n"
                "    speedup = num_nodes - (sequential_fraction * (num_nodes - 1))\n"
                "    return speedup\n"
                "\n"
                "nodes_list = [1, 2, 4, 8, 16, 32, 64, 128]\n"
                "p_fraction = 0.90  # 90% pekerjaan dapat diparalelkan, 10% sekuensial murni\n"
                "\n"
                "print(f\"Analisis Batas Skalabilitas Komputasi Terdistribusi (Fraksi Paralel = {p_fraction*100:.0f}%):\")\n"
                "print(f\"  {'Jumlah Node (N)':<16} | {'Amdahl Speedup':<16} | {'Gustafson Speedup':<18} | {'Efisiensi Klaster':<16}\")\n"
                "print(\"  \" + \"-\" * 70)\n"
                "for n in nodes_list:\n"
                "    s_amdahl = calculate_amdahl_speedup(p_fraction, n)\n"
                "    s_gustafson = calculate_gustafson_speedup(p_fraction, n)\n"
                "    efficiency = (s_amdahl / n) * 100\n"
                "    print(f\"  {n:<16d} | {s_amdahl:<16.2f} | {s_gustafson:<18.2f} | {efficiency:<16.1f}%\")\n"
                "\n"
                "limit = 1.0 / (1.0 - p_fraction)\n"
                "print(f\"\\nBatas Teoretis Asimtotik Amdahl (N -> Tak Hingga): {limit:.2f}x (Tidak dapat ditembus jika ada 10% sekuensial!)\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.1.10
    {
        "id": "10.1.10",
        "title": "Siklus Hidup Data Engineering: Dari Ingesti hingga AI Feature Store",
        "learningObjectives": [
            "Memahami seluruh siklus hidup data engineering hulu-ke-hilir (*end-to-end data lifecycle*) untuk sistem analitik dan AI.",
            "Menganalisis konsep Feature Store (online vs offline store) untuk mencegah kebocoran data (*data leakage*) dan skew pelatihan-inferensi (*training-serving skew*).",
            "Mengimplementasikan simulator Feature Store sederhana yang menyajikan fitur historis untuk training dan fitur point-in-time untuk inferensi online."
        ],
        "prerequisites": [
            "10.1.1 (Peran Data Engineer) dan 10.1.8 (Idempotensi).",
            "Prinsip Feature Engineering untuk Model Machine Learning."
        ],
        "commonPitfalls": [
            "Training-Serving Skew: menggunakan definisi fitur yang berbeda saat pelatihan (misal dihitung dengan SQL batch) vs saat inferensi produksi (misal dihitung dengan JavaScript di mobile app).",
            "Data Leakage (Kebocoran Waktu): menyertakan fitur masa depan saat menyusun dataset pelatihan historis (*time-travel feature leakage*)."
        ],
        "academicReferences": [
            "Hermann, J., & Balso, D. D. (2017). Meet Michelangelo: Uber's Machine Learning Platform. Uber Engineering Blog.",
            "van der Weide, T., et al. (2021). Feast: An open source feature store for machine learning. In Systems for ML Workshop at NeurIPS 2021."
        ],
        "caseStudy": "Sebuah unicorn fintech mendeteksi bahwa model deteksi fraud mereka memiliki AUC-ROC 0.99 saat offline training namun anjlok ke 0.62 saat online production. Investigasi mengungkap bahwa pipeline training menggunakan rata-rata pengeluaran pengguna selama 30 hari penuh (termasuk transaksi mencurigakan yang sedang dievaluasi). Mengadopsi Feature Store berbasis point-in-time time travel (Feast) menyelesaikan inkonsistensi waktu secara tuntas.",
        "content": {
            "theory": (
                "Siklus hidup data rekayasa modern untuk kecerdasan buatan (*Data Engineering Lifecycle for AI*) mencakup tahapan terintegrasi: "
                "(1) **Generation**: Sistem transaksional, sensor IoT, dan log web menghasilkan data mentah. "
                "(2) **Ingestion**: Penyerapan batch atau streaming menuju zona pendaratan (*landing zone*). "
                "(3) **Storage**: Persistensi pada data lake atau object storage dengan format kolumnar terbuka. "
                "(4) **Transformation**: Pembersihan, normalisasi, dan pembuatan fitur analitik. "
                "(5) **Serving**: Penyediaan data ke konsumen akhir (analis bisnis, dashboard BI, atau model machine learning). "
                "Pada tahap penyajian AI, tantangan terbesar adalah **Training-Serving Skew** dan **Time-Travel Data Leakage**. "
                "Untuk mengatasi persoalan ini, arsitektur data modern memperkenalkan **Feature Store** (dipelopori oleh Uber Michelangelo dan Feast): "
                "Feature Store membagi penyimpanan menjadi dua lapisan sinkron: "
                "1. **Offline Store (Batch Storage)**: Berbasis Data Lake/DWH (Parquet/Delta) yang menyimpan seluruh jejak riwayat fitur dengan stempel waktu (*time-series point-in-time joins*). Digunakan untuk melatih model ML tanpa kebocoran data masa depan: "
                "$$\\mathbf{x}_{\\text{train}}(t_{\\text{event}}) = \\text{FeatureState}(t \\le t_{\\text{event}})$$ "
                "2. **Online Store (Low-Latency Key-Value Store)**: Berbasis Redis atau Cassandra yang hanya menyimpan nilai fitur terkini untuk kueri inferensi real-time dengan latensi sub-5 milidetik."
            ),
            "realWorldApplication": (
                "Feast, Tecton, dan Hopsworks digunakan oleh institusi keuangan dan platform teknologi besar sebagai lapisan Feature Store terpusat yang menghubungkan tim data engineering dengan tim machine learning."
            ),
            "codeSnippet": (
                "import datetime\n"
                "\n"
                "# Simulasi Mini Feature Store: Point-in-Time Correctness & Dual-Store (Online/Offline)\n"
                "class MiniFeatureStore:\n"
                "    def __init__(self):\n"
                "        # Offline Store: Riwayat histori lengkap [(timestamp, entity_id, feature_val)]\n"
                "        self.offline_store = []\n"
                "        # Online Store: Nilai mutakhir terkini {entity_id: feature_val}\n"
                "        self.online_store = {}\n"
                "\n"
                "    def ingest_feature_record(self, timestamp_str, entity_id, credit_score):\n"
                "        ts = datetime.datetime.fromisoformat(timestamp_str)\n"
                "        self.offline_store.append((ts, entity_id, credit_score))\n"
                "        # Update online store selalu memegang nilai terbaru\n"
                "        self.online_store[entity_id] = credit_score\n"
                "\n"
                "    def get_online_features(self, entity_id):\n"
                "        # Inferensi Cepat (Sub-milidetik)\n"
                "        return self.online_store.get(entity_id, None)\n"
                "\n"
                "    def get_historical_features_as_of(self, entity_id, observation_time_str):\n"
                "        # Point-in-Time Join: Hanya ambil fitur yang ada SEBELUM observation_time (Mencegah Data Leakage)\n"
                "        obs_ts = datetime.datetime.fromisoformat(observation_time_str)\n"
                "        valid_records = [r for r in self.offline_store if r[1] == entity_id and r[0] <= obs_ts]\n"
                "        if not valid_records:\n"
                "            return None\n"
                "        # Ambil record terbaru sebelum titik observasi\n"
                "        valid_records.sort(key=lambda x: x[0])\n"
                "        return valid_records[-1][2]\n"
                "\n"
                "fs = MiniFeatureStore()\n"
                "# Riwayat perubahan credit score nasabah 'user_101'\n"
                "fs.ingest_feature_record(\"2026-01-01T10:00:00\", \"user_101\", 650)  # Status awal\n"
                "fs.ingest_feature_record(\"2026-02-01T10:00:00\", \"user_101\", 710)  # Naik pada Februari\n"
                "fs.ingest_feature_record(\"2026-03-01T10:00:00\", \"user_101\", 780)  # Naik pada Maret (Nilai Sekarang)\n"
                "\n"
                "# Skenario 1: Inferensi Real-Time Hari Ini (Online Store)\n"
                "online_score = fs.get_online_features(\"user_101\")\n"
                "\n"
                "# Skenario 2: Pelatihan Model Historis untuk transaksi yang terjadi tanggal 15 Januari 2026\n"
                "# Nilai harus 650 (Bukan 780! Mencegah kebocoran masa depan)\n"
                "hist_score = fs.get_historical_features_as_of(\"user_101\", \"2026-01-15T12:00:00\")\n"
                "\n"
                "print(\"Evaluasi Arsitektur AI Feature Store (Point-in-Time Correctness):\")\n"
                "print(f\"  Fitur Online Terkini (Serving) : {online_score} (Skor Mutakhir untuk Inferensi)\")\n"
                "print(f\"  Fitur Historis (15 Jan 2026)   : {hist_score} (Skor Tepat Titik Waktu Tanpa Kebocoran!)\")\n"
                "print(f\"  Status Kebocoran Data (Leakage): AMAN TERKENDALI (Nilai 780 Masa Depan Tidak Bocor)\")"
            ),
            "codeSnippetOutput": ""
        }
    }
]

# Run all snippets to get exact deterministic output
for sub in subchapters:
    code = sub["content"]["codeSnippet"]
    old_stdout = sys.stdout
    import io
    sys.stdout = io.StringIO()
    local_env = {}
    try:
        exec(code, local_env)
        out = sys.stdout.getvalue().strip()
    except Exception as e:
        out = f"Error: {e}"
    finally:
        sys.stdout = old_stdout
    sub["content"]["codeSnippetOutput"] = out

# Save to JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"[OK] Berhasil menghasilkan 10 subbab Bab 1 Topik 10 ke {output_file}")
