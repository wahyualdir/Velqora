import json
import os
import sys
import io
import numpy as np

output_file = os.path.join(os.path.dirname(__file__), "de_ch6_data.json")

subchapters = [
    # 10.6.1
    {
        "id": "10.6.1",
        "title": "Arsitektur Master-Worker Apache Spark (Driver, Cluster Manager, dan Executors)",
        "learningObjectives": [
            "Menganalisis dekomposisi topologi master-worker pada Apache Spark dan peran Driver Program.",
            "Memahami alur interaksi antara Driver, Cluster Manager (YARN, K8s, Standalone), dan Executor JVM workers.",
            "Mengimplementasikan simulator penjadwalan task komputasi terdistribusi dengan alokasi slot thread paralel."
        ],
        "prerequisites": [
            "10.1.1 (Arsitektur Data Modern).",
            "Prinsip Komputasi Terdistribusi & Multi-threading OS."
        ],
        "commonPitfalls": [
            "Mengalokasikan memori driver terlalu kecil saat memanggil operasi `collect()` pada dataset berskala besar, memicu error Driver Out-Of-Memory (OOM).",
            "Mengonfigurasi jumlah core per executor terlalu tinggi (> 5 core), memicu persaingan memori JVM dan lonjakan durasi Garbage Collection (GC) pauses."
        ],
        "academicReferences": [
            "Zaharia, M., et al. (2016). Apache Spark: A Unified Engine for Big Data Processing. Communications of the ACM, 59(11), 56–65.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Sebuah platform komputasi analitik di Uber menjalankan 15.000 job Spark harian. Dengan mengonfigurasi rasio optimal 4 virtual core dan 28 GB RAM per executor pada kluster Kubernetes, pemborosan alokasi resource berkurang sebesar 32% dan waktu penyelesaian job meningkat 28%.",
        "content": {
            "theory": (
                "**Apache Spark** mengadopsi arsitektur komputasi terdistribusi berbasis paradigma **Master-Worker (Driver-Executor Architecture)** yang dirancang untuk mengeksekusi beban kerja pemrosesan data paralel skala besar di atas kluster komoditas. "
                "Komponen fisik utama arsitektur Spark terdiri dari: "
                "1. **Spark Driver**: Proses master pusat yang mengeksekusi fungsi `main()` dari aplikasi pengguna. Driver bertanggung jawab atas: "
                "   - Menginisialisasi `SparkSession` dan `SparkContext`. "
                "   - Mengonversi kode logika pengguna menjadi **Directed Acyclic Graph (DAG)**. "
                "   - Mengorkestrasi pembagian DAG menjadi tahapan eksekusi (*Stages*) dan paket tugas atomik (*Tasks*). "
                "   - Mengoordinasikan penugasan task ke executor melalui komponen `DAGScheduler` dan `TaskScheduler`. "
                "2. **Cluster Manager**: Layanan eksternal (Apache YARN, Kubernetes, Apache Mesos, atau Standalone Manager) yang bertugas menegosiasikan dan mengalokasikan sumber daya perangkat keras (CPU core dan RAM) pada node fisik kluster. "
                "3. **Executors**: Proses worker JVM independen yang berjalan pada node pekerja kluster. Setiap executor memiliki slot thread paralel yang mengeksekusi task dan menyimpan partisi data dalam memori cache: "
                "$$N_{\\text{parallel\\_tasks}} = \\sum_{e=1}^{E} \\text{Cores}_e$$ "
                "Data hasil eksekusi dikembalikan ke driver hanya jika diminta secara eksplisit, atau dituliskan langsung ke media penyimpanan persisten terdistribusi."
            ),
            "realWorldApplication": (
                "Apple, Netflix, dan Databricks menjalankan jutaan executor Spark secara dinamis di atas kluster Kubernetes untuk memproses log telemetri dan melatih model machine learning terdistribusi."
            ),
            "codeSnippet": (
                "# Simulasi Topologi Master-Worker Apache Spark: Driver, TaskScheduler, & Multi-Executor\n"
                "class SparkClusterSimulator:\n"
                "    def __init__(self, num_executors=3, cores_per_executor=2):\n"
                "        self.num_executors = num_executors\n"
                "        self.cores = cores_per_executor\n"
                "        self.total_slots = num_executors * cores_per_executor\n"
                "        # Inisialisasi pool executor\n"
                "        self.executors = {f'exec-{i+1}': {'active_tasks': 0, 'completed': 0} for i in range(num_executors)}\n"
                "        \n"
                "    def schedule_stage_tasks(self, task_payloads):\n"
                "        # Simulasi TaskScheduler: Driver memetakan partisi tugas ke executor yang tersedia\n"
                "        assignments = []\n"
                "        exec_keys = list(self.executors.keys())\n"
                "        \n"
                "        for idx, task in enumerate(task_payloads):\n"
                "            assigned_exec = exec_keys[idx % self.num_executors]\n"
                "            self.executors[assigned_exec]['active_tasks'] += 1\n"
                "            # Simulasi komputasi paralel task: transform kuadrat nilai partisi\n"
                "            res = sum(x**2 for x in task)\n"
                "            self.executors[assigned_exec]['completed'] += 1\n"
                "            self.executors[assigned_exec]['active_tasks'] -= 1\n"
                "            assignments.append({'task_id': idx, 'executor': assigned_exec, 'result': res})\n"
                "            \n"
                "        return assignments\n"
                "\n"
                "cluster = SparkClusterSimulator(num_executors=3, cores_per_executor=2)\n"
                "# Driver membagi 6 partisi data (total 6 tasks)\n"
                "dataset_partitions = [\n"
                "    [10, 20, 30], [40, 50, 60], [70, 80, 90],\n"
                "    [15, 25, 35], [45, 55, 65], [75, 85, 95]\n"
                "]\n"
                "\n"
                "scheduled = cluster.schedule_stage_tasks(dataset_partitions)\n"
                "\n"
                "print(f'Topologi Klaster Spark: {cluster.num_executors} Executors x {cluster.cores} Cores = {cluster.total_slots} Total Slots')\n"
                "print('Hasil Distribusi Tugas oleh Driver:')\n"
                "for t in scheduled:\n"
                "    print(f'  - Task #{t[\"task_id\"]} -> Dijalankan pada [{t[\"executor\"]}] -> Hasil Parsial={t[\"result\"]:,}')\n"
                "print(f'Status Akhir Executors: {cluster.executors}')\n"
                "print('Kesimpulan: Driver membagi beban kerja secara adil (round-robin task allocation).')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.6.2
    {
        "id": "10.6.2",
        "title": "Resilient Distributed Datasets (RDD - Zaharia et al., NSDI 2012)",
        "learningObjectives": [
            "Memahami konsep fundamental Resilient Distributed Datasets (RDD) sebagai abstraksi memori terdistribusi toleran kesalahan.",
            "Menganalisis makalah kanonikal Matei Zaharia et al. (NSDI 2012) mengenai toleransi kesalahan berbasis silsilah (lineage graph).",
            "Mengimplementasikan simulator RDD mandiri dengan mekanisme evaluasi transformasi lazy dan rekonstruksi partisi otomatis."
        ],
        "prerequisites": [
            "10.6.1 (Arsitektur Master-Worker).",
            "Dasar Struktur Data Graf Berarah dan Teori Rekursi."
        ],
        "commonPitfalls": [
            "Menggunakan RDD mentah berorientasi objek Java/Python ketika operasi tabular DataFrame tersedia, kehilangan optimasi kueri Catalyst dan Tungsten.",
            "Memutus rantai silsilah (lineage) secara tidak sengaja melalui checkpointing berlebihan, menyebabkan overhead persistensi I/O disk tinggi."
        ],
        "academicReferences": [
            "Zaharia, M., Chowdhury, M., Das, T., Dave, A., Ma, J., McCauley, M., Franklin, M. J., Shenker, S., & Stoica, I. (2012). Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing. In Proceedings of the 9th USENIX Symposium on Networked Systems Design and Implementation (NSDI 12), 15–28.",
            "Dean, J., & Ghemawat, S. (2004). MapReduce: Simplified Data Processing on Large Clusters. Communications of the ACM, 51(1), 107–113."
        ],
        "caseStudy": "Algoritma iteratif PageRank dan K-Means pada platform pencarian web mengalami akselerasi 20x lebih cepat pada Apache Spark dibandingkan Apache Hadoop MapReduce karena data state intermediate dipertahankan di RAM melalui RDD tanpa perlu menulis ulang ke HDFS pada setiap iterasi.",
        "content": {
            "theory": (
                "Kelemahan paling fatal dari sistem kluster generasi awal seperti Hadoop MapReduce adalah ketergantungannya pada penyimpanan disk persisten (HDFS) untuk berbagi data antar-langkah komputasi. "
                "Hal ini menyebabkan algoritma iteratif (seperti pelatihan machine learning dan analisis graf) menghabiskan lebih dari 90% waktu komputasinya hanya untuk membaca dan menulis berkas disk. "
                "Makalah kanonikal oleh **Matei Zaharia et al. (USENIX NSDI 2012)** memperkenalkan inovasi fundamental: "
                "> \"We present Resilient Distributed Datasets (RDDs), a distributed memory abstraction that lets programmers perform in-memory computations on large clusters in a fault-tolerant manner. RDDs are motivated by two types of applications that current computing frameworks handle inefficiently: iterative algorithms and interactive data mining tools. In both cases, keeping data in memory can improve performance by an order of magnitude. To achieve fault tolerance efficiently, RDDs provide a restricted form of shared memory, based on coarse-grained transformations rather than fine-grained updates to shared state. However, we show that RDDs are expressive enough to capture a wide class of computations, including recent specialized programming models for iterative jobs, such as Pregel, and new applications that these models do not capture. We have implemented RDDs in a system called Spark, which we evaluate through a variety of user applications and benchmarks.\" "
                "Secara formal, RDD didefinisikan sebagai koleksi objek elemen terdistribusi yang bersifat **immutable (tak dapat diubah)** dan terbagi ke dalam partisi-partisi deterministik. "
                "Alih-alih mereplikasi data melintasi jaringan untuk toleransi kesalahan, RDD mencatat **Silsilah Komputasi (Lineage Graph)**: rantai transformasi deterministik yang digunakan untuk membangun dataset tersebut: "
                "$$\\text{PartisiLost}(P_k) \\implies P_k = f_n(f_{n-1}(\\dots f_1(P_k^{\\text{source}})))$$ "
                "Jika suatu node pekerja mengalami kegagalan (*node crash*), Spark cukup menghitung ulang partisi yang hilang dari titik awal silsilahnya."
            ),
            "realWorldApplication": (
                "Sistem pelatihan model machine learning iteratif (seperti Logistic Regression dan Gradient Boosted Trees pada Spark MLlib) mengandalkan silsilah RDD untuk caching vektor gradien di memori RAM."
            ),
            "codeSnippet": (
                "# Implementasi Simulator RDD Mini: Transformasi Lazy & Rekonstruksi Partisi Berbasis Lineage\n"
                "class MiniRDD:\n"
                "    def __init__(self, partitions, parent=None, transform_fn=None):\n"
                "        self.partitions = partitions  # List of lists (partisi terdistribusi)\n"
                "        self.parent = parent\n"
                "        self.transform_fn = transform_fn\n"
                "        \n"
                "    def map(self, fn):\n"
                "        # Transformasi lazy: simpan silsilah graf tanpa eksekusi langsung\n"
                "        return MiniRDD(partitions=None, parent=self, transform_fn=fn)\n"
                "        \n"
                "    def compute_partition(self, part_idx):\n"
                "        if self.partitions is not None:\n"
                "            return self.partitions[part_idx]\n"
                "        # Rekonstruksi rekursif dari parent lineage\n"
                "        parent_data = self.parent.compute_partition(part_idx)\n"
                "        return [self.transform_fn(x) for x in parent_data]\n"
                "        \n"
                "    def get_num_partitions(self):\n"
                "        curr = self\n"
                "        while curr.partitions is None:\n"
                "            curr = curr.parent\n"
                "        return len(curr.partitions)\n"
                "        \n"
                "    def collect(self):\n"
                "        # Action: picu evaluasi seluruh partisi dari silsilah\n"
                "        num_parts = self.get_num_partitions()\n"
                "        results = []\n"
                "        for i in range(num_parts):\n"
                "            results.extend(self.compute_partition(i))\n"
                "        return results\n"
                "\n"
                "# Dataset awal 3 partisi\n"
                "raw_partitions = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\n"
                "rdd_root = MiniRDD(partitions=raw_partitions)\n"
                "# Rantai silsilah: x -> x * 10 -> x + 5\n"
                "rdd_mapped = rdd_root.map(lambda x: x * 10)\n"
                "rdd_final = rdd_mapped.map(lambda x: x + 5)\n"
                "\n"
                "# Simulasi kegagalan partisi 1: rekonstruksi langsung dari silsilah\n"
                "recovered_part_1 = rdd_final.compute_partition(part_idx=1)\n"
                "all_collected = rdd_final.collect()\n"
                "\n"
                "print('Demonstrasi Resilient Distributed Datasets (Zaharia et al., 2012):')\n"
                "print(f'  Partisi Awal #1        : {raw_partitions[1]}')\n"
                "print(f'  Rekonstruksi Partisi #1: {recovered_part_1} (Dihitung ulang via lineage: [4,5,6]*10 + 5)')\n"
                "print(f'  Hasil Action Collect   : {all_collected}')\n"
                "print('  Kesimpulan: Toleransi kesalahan dicapai efisien via lineage tanpa replikasi storage.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.6.3
    {
        "id": "10.6.3",
        "title": "Transformasi vs Tindakan (Transformations vs Actions) & Evaluasi Lazy",
        "learningObjectives": [
            "Membedakan secara tegas karakteristik operasional antara Transformations dan Actions pada Apache Spark.",
            "Menganalisis arsitektur evaluasi malas (Lazy Evaluation) dalam mendukung penggabungan pipeline (pipelining) dan optimasi eksekusi.",
            "Mengimplementasikan simulator execution engine yang memisahkan pembentukan rencana logis dari pemicuan komputasi fisik."
        ],
        "prerequisites": [
            "10.6.2 (Fondasi RDD).",
            "Prinsip Pemrograman Fungsional dan Evaluasi Non-Strict."
        ],
        "commonPitfalls": [
            "Memanggil operator Action (seperti `count()` atau `show()`) berulang kali di dalam loop iteratif, memicu eksekusi penuh pipeline dari awal pada setiap iterasi.",
            "Mengasumsikan bahwa pemanggilan fungsi `filter()` atau `map()` langsung memproses data di cluster, padahal belum ada instruksi fisik yang dikirim sebelum Action dipanggil."
        ],
        "academicReferences": [
            "Zaharia, M., et al. (2012). Resilient Distributed Datasets. NSDI 2012.",
            "Armbrust, M., et al. (2015). Spark SQL: Relational Data Processing in Spark. ACM SIGMOD 2015."
        ],
        "caseStudy": "Sebuah pipeline analitik log di Spotify memiliki 12 tahap transformasi data. Tanpa evaluasi lazy, sistem harus menulis hasil perantara ke memori sebanyak 12 kali. Evaluasi lazy menggabungkan seluruh filter dan map menjadi satu pass eksekusi terpadu (*pipelining*), memangkas siklus CPU hingga 60%.",
        "content": {
            "theory": (
                "Dalam model pemrograman Apache Spark, seluruh operasi komputasi diklasifikasikan secara ketat ke dalam dua kategori biner: "
                "1. **Transformations (Transformasi)**: Operasi yang menerima satu RDD/DataFrame dan menghasilkan RDD/DataFrame baru (seperti `map`, `filter`, `flatMap`, `groupByKey`, `join`). "
                "Sifat paling mendasar dari transformasi adalah **Evaluasi Malas (Lazy Evaluation)**: Spark sama sekali tidak mengeksekusi komputasi data ketika fungsi transformasi dipanggil. "
                "Sebagai gantinya, Spark hanya mencatat operasi tersebut ke dalam silsilah logis graf komputasi (DAG). "
                "Keuntungan arsitektural evaluasi lazy: "
                "   - *Operator Pipelining*: Beberapa operasi transformasi sekuensial (misal `filter` lalu `map`) digabungkan ke dalam satu fungsi tunggal yang dieksekusi dalam satu lintasan memori kontinu tanpa materialisasi perantara. "
                "   - *Global Query Optimization*: Spark dapat menunda eksekusi hingga rencana kueri lengkap terbentuk, memungkinkan Catalyst Optimizer memangkas kolom tak terpakai (*projection pruning*) dan mendorong predikat (*filter pushdown*). "
                "2. **Actions (Tindakan)**: Operasi yang memicu evaluasi nyata terhadap silsilah transformasi dan mengembalikan hasil ke program Driver atau menuliskannya ke penyimpanan eksternal (seperti `count`, `collect`, `take`, `saveAsTextFile`, `saveAsParquet`): "
                "$$\\text{TriggerExecution}(Job) \\iff \\text{InvokeAction}(R_k)$$"
            ),
            "realWorldApplication": (
                "Data engineers memanfaatkan sifat evaluasi lazy Spark untuk membangun modul transformasi modular yang bersih, membiarkan engine mengoptimasi eksekusi secara holistik saat fungsi `.write` dipanggil."
            ),
            "codeSnippet": (
                "# Demonstrasi Evaluasi Lazy (Transformations) vs Eksekusi Pemicu (Actions)\n"
                "class LazyExecutionSimulator:\n"
                "    def __init__(self, raw_data):\n"
                "        self.raw_data = raw_data\n"
                "        self.ops_pipeline = []\n"
                "        \n"
                "    def filter(self, predicate_fn):\n"
                "        # Transformation: Hanya simpan metadata operasi ke pipeline\n"
                "        self.ops_pipeline.append(('FILTER', predicate_fn))\n"
                "        return self\n"
                "        \n"
                "    def map(self, map_fn):\n"
                "        # Transformation: Simpan ke pipeline (tidak ada eksekusi data!)\n"
                "        self.ops_pipeline.append(('MAP', map_fn))\n"
                "        return self\n"
                "        \n"
                "    def count(self):\n"
                "        # Action: Picu eksekusi riil dari seluruh antrean pipeline\n"
                "        print(f'  [ACTION TRIGGERED] Menjalankan {len(self.ops_pipeline)} tahap transformasi...')\n"
                "        current = self.raw_data\n"
                "        for op_type, fn in self.ops_pipeline:\n"
                "            if op_type == 'FILTER':\n"
                "                current = [x for x in current if fn(x)]\n"
                "            elif op_type == 'MAP':\n"
                "                current = [fn(x) for x in current]\n"
                "        return len(current)\n"
                "\n"
                "data = list(range(1, 101))\n"
                "engine = LazyExecutionSimulator(data)\n"
                "\n"
                "print('1. Membangun Rantai Transformasi (Lazy Phase):')\n"
                "lazy_ref = engine.filter(lambda x: x % 2 == 0).map(lambda x: x * 3).filter(lambda x: x > 50)\n"
                "print(f'   Panjang antrean operasi: {len(lazy_ref.ops_pipeline)} (Data fisik belum disentuh!)')\n"
                "\n"
                "print('2. Mengeksekusi Action Count (Execution Phase):')\n"
                "result_count = lazy_ref.count()\n"
                "print(f'   Jumlah Record Hasil: {result_count}')\n"
                "print('Kesimpulan: Transformasi bersifat murni deklaratif hingga Action dipanggil.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.6.4
    {
        "id": "10.6.4",
        "title": "Directed Acyclic Graph (DAG) Execution Plan & Silsilah (Lineage Graph)",
        "learningObjectives": [
            "Memahami arsitektur internal DAG Scheduler dalam membedah alur komputasi menjadi Stages dan Tasks.",
            "Menganalisis perbedaan dependensi sempit (Narrow Dependency) dan dependensi lebar (Wide Dependency/Shuffle).",
            "Mengimplementasikan simulator pemecahan DAG menjadi stage boundaries berdasarkan jenis dependensi data."
        ],
        "prerequisites": [
            "10.6.3 (Transformations vs Actions).",
            "Teori Graf: Directed Acyclic Graph (DAG) & Topological Sorting."
        ],
        "commonPitfalls": [
            "Tidak menyadari bahwa dependensi lebar (seperti `groupByKey` atau `join`) memicu Stage Barrier yang memaksa seluruh task pada stage sebelumnya selesai sebelum stage berikutnya dapat berjalan.",
            "Menggunakan transformasi wide dependency beruntun tanpa partisi yang selaras, memicu berkali-kali pertukaran data shuffle lintas jaringan."
        ],
        "academicReferences": [
            "Zaharia, M., et al. (2012). Resilient Distributed Datasets. NSDI 2012.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Sebuah tim rekayasa data di eBay mengoptimalkan kueri agregasi transaksi dengan mengganti operasi `groupByKey` menjadi `reduceByKey`. Perubahan ini memungkinkan map-side combine lokal (Narrow Dependency sebagian), mereduksi data shuffle lintas stage DAG dari 1.2 TB menjadi 45 GB.",
        "content": {
            "theory": (
                "Ketika operator Action dipanggil, Apache Spark menyerahkan seluruh silsilah operasi ke komponen **DAGScheduler**. "
                "DAGScheduler bertugas mengonversi rantai transformasi logis menjadi rencana eksekusi fisik multi-tahap. "
                "Inti dari optimasi DAG scheduler bertumpu pada klasifikasi jenis dependensi antar-partisi RDD: "
                "1. **Dependensi Sempit (Narrow Dependency)**: "
                "Setiap partisi dari RDD induk digunakan oleh paling banyak **satu partisi** dari RDD anak (misalnya pada operasi `map`, `filter`, `mapPartitions`). "
                "Karakteristik: tidak membutuhkan pertukaran data lintas jaringan (*no shuffle*). Seluruh operasi narrow dapat dieksekusi secara terpipa (*pipelined*) di dalam thread memori CPU yang sama. "
                "2. **Dependensi Lebar (Wide Dependency / Shuffle Dependency)**: "
                "Setiap partisi dari RDD induk dapat dikonsumsi oleh **banyak partisi** dari RDD anak (misalnya pada operasi `groupByKey`, `reduceByKey`, `join`, `repartition`). "
                "Karakteristik: mengharuskan terjadinya **Shuffle**: data harus dipartisi ulang berdasarkan nilai hash kunci dan ditransfer melintasi jaringan kluster. "
                "DAGScheduler menggunakan wide dependency sebagai pemisah batas tahapan (**Stage Boundary**): "
                "$$\\text{Stage}_{k} \\xrightarrow{\\text{Shuffle Exchange}} \\text{Stage}_{k+1}$$ "
                "Sebuah Job fisik dipecah menjadi beberapa Stages, dan setiap Stage terdiri dari sekumpulan Task paralel yang independen."
            ),
            "realWorldApplication": (
                "Spark UI menampilkan visualisasi DAG rinci dengan kotak-kotak Stages dan garis panah Shuffle Exchange, memungkinkan engineer mendiagnosis bottleneck transfer jaringan secara visual."
            ),
            "codeSnippet": (
                "# Implementasi Simulator DAG Scheduler: Pemecahan Stage Boundary Berbasis Dependensi\n"
                "class DAGSchedulerSimulator:\n"
                "    def __init__(self):\n"
                "        self.stages = []\n"
                "        \n"
                "    def build_stages(self, transformation_chain):\n"
                "        current_stage = {'stage_id': 0, 'operations': [], 'type': 'NARROW'}\n"
                "        stage_counter = 0\n"
                "        \n"
                "        for op_name, dep_type in transformation_chain:\n"
                "            if dep_type == 'WIDE':\n"
                "                # Batas Stage: Wide dependency memicu Shuffle barrier baru!\n"
                "                current_stage['operations'].append(op_name)\n"
                "                self.stages.append(current_stage)\n"
                "                stage_counter += 1\n"
                "                current_stage = {'stage_id': stage_counter, 'operations': [], 'type': 'SHUFFLE_RECEIVER'}\n"
                "            else:\n"
                "                current_stage['operations'].append(op_name)\n"
                "                \n"
                "        self.stages.append(current_stage)\n"
                "        return self.stages\n"
                "\n"
                "# Rantai operasi: textFile -> map -> filter -> reduceByKey (WIDE) -> map -> count\n"
                "pipeline_ops = [\n"
                "    ('textFile', 'NARROW'),\n"
                "    ('map(parse)', 'NARROW'),\n"
                "    ('filter(valid)', 'NARROW'),\n"
                "    ('reduceByKey(sum)', 'WIDE'),   # Stage Boundary!\n"
                "    ('map(format)', 'NARROW'),\n"
                "    ('sortBy(val)', 'WIDE')         # Stage Boundary!\n"
                "]\n"
                "\n"
                "scheduler = DAGSchedulerSimulator()\n"
                "stages = scheduler.build_stages(pipeline_ops)\n"
                "\n"
                "print(f'Dekomposisi Graf DAG Spark ({len(pipeline_ops)} Operasi):')\n"
                "for s in stages:\n"
                "    print(f'  [Stage {s[\"stage_id\"]}] Tipe: {s[\"type\"]:16s} | Operasi Pipelined: {s[\"operations\"]}')\n"
                "print('Kesimpulan: DAGScheduler memotong stage persis pada operasi shuffle wide dependency.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.6.5
    {
        "id": "10.6.5",
        "title": "Spark DataFrame & Dataset API Teroptimasi",
        "learningObjectives": [
            "Menganalisis evolusi representasi data di Spark: dari RDD mentah berorientasi objek menuju DataFrame dan Dataset bertipe skema.",
            "Memahami keunggulan format data struktural yang memungkinkan inferensi skema deklaratif dan optimasi kueri otomatis.",
            "Mengimplementasikan model DataFrame terstruktur yang mendukung validasi tipe data dan manipulasi kolom berkecepatan tinggi."
        ],
        "prerequisites": [
            "10.6.2 (Fondasi RDD).",
            "10.4.1 (Format Kolumnar & Skema Relasional)."
        ],
        "commonPitfalls": [
            "Melakukan fallback manual ke RDD murni (`df.rdd.map(...)`) di tengah pipeline analitik, yang menghancurkan struktur skema dan menonaktifkan optimasi Catalyst.",
            "Mengabaikan nullability pada deklarasi StructType, memicu NullPointerExceptions saat memproses data anomali."
        ],
        "academicReferences": [
            "Armbrust, M., et al. (2015). Spark SQL: Relational Data Processing in Spark. ACM SIGMOD 2015.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Sebuah platform machine learning di Twitter memigrasikan seluruh pipeline ekstraksi fitur teks dari RDD Python mentah ke Spark DataFrames. Migrasi ini mengeliminasi serialisasi Py4J overhead dan memangkas penggunaan memori kluster hingga 4.5x berkat representasi biner terstruktur.",
        "content": {
            "theory": (
                "Meskipun RDD menyediakan abstraksi toleran kesalahan yang revolusioner, RDD memiliki dua kelemahan performa mendasar: "
                "1. **Ketiadaan Informasi Skema Semantik**: Bagi mesin eksekusi Spark, RDD hanyalah kumpulan objek buram (*opaque Java/Python objects*). Spark tidak memahami tipe kolom, distribusi data, atau operasi relasional yang sedang dijalankan. "
                "2. **Overhead Objek JVM & Serialisasi GC**: Objek Java memiliki header memori besar (16 byte per objek) dan menuntut Garbage Collection yang intensif. Dalam Python (PySpark), data harus diserialisasi bolak-balik antara Python VM dan JVM melalui soket Py4J (*pickle overhead*). "
                "Untuk mengatasi persoalan ini, Spark memperkenalkan **DataFrame API** (diadopsi dari R/Pandas namun terdistribusi) dan **Dataset API** (`Dataset[T]` berorientasi strongly-typed pada Scala/Java): "
                "DataFrame adalah koleksi data terdistribusi yang diorganisasikan ke dalam kolom-kolom bernama (*named columns*), ekuivalen dengan tabel basis data relasional: "
                "$$\\text{DataFrame} = \\text{Dataset}[\\text{Row}] \\quad \\text{dengan skema } \\mathcal{S} = \\{ (c_1, \\tau_1), \\dots, (c_m, \\tau_m) \\}$$ "
                "DataFrame menyematkan metadata skema eksplisit, memungkinkan query engine menerapkan teknik optimasi basis data relasional (Catalyst) dan manajemen memori biner off-heap (Tungsten)."
            ),
            "realWorldApplication": (
                "PySpark DataFrame merupakan standar de facto di industri untuk ETL big data modern, menggantikan MapReduce dan RDD di lebih dari 95% beban kerja produksi global."
            ),
            "codeSnippet": (
                "# Implementasi Model Mini DataFrame: Skema Terstruktur, Tipe Data, & Proyeksi Kolom\n"
                "class StructField:\n"
                "    def __init__(self, name, data_type):\n"
                "        self.name = name\n"
                "        self.data_type = data_type\n"
                "\n"
                "class MiniDataFrame:\n"
                "    def __init__(self, records, schema):\n"
                "        self.schema = {f.name: f.data_type for f in schema}\n"
                "        self.records = records\n"
                "        self._validate_records()\n"
                "        \n"
                "    def _validate_records(self):\n"
                "        for r in self.records:\n"
                "            for col, expected_type in self.schema.items():\n"
                "                if col in r and not isinstance(r[col], expected_type):\n"
                "                    raise TypeError(f'Kolom {col} mengharuskan {expected_type}, diterima {type(r[col])}')\n"
                "                    \n"
                "    def select(self, *cols):\n"
                "        new_schema = [StructField(c, self.schema[c]) for c in cols]\n"
                "        projected = [{c: r[c] for c in cols} for r in self.records]\n"
                "        return MiniDataFrame(projected, new_schema)\n"
                "        \n"
                "    def filter(self, condition_fn):\n"
                "        new_schema = [StructField(c, t) for c, t in self.schema.items()]\n"
                "        filtered = [r for r in self.records if condition_fn(r)]\n"
                "        return MiniDataFrame(filtered, new_schema)\n"
                "\n"
                "schema_def = [\n"
                "    StructField('user_id', int),\n"
                "    StructField('tier', str),\n"
                "    StructField('score', float)\n"
                "]\n"
                "raw_rows = [\n"
                "    {'user_id': 101, 'tier': 'GOLD', 'score': 92.5},\n"
                "    {'user_id': 102, 'tier': 'SILVER', 'score': 74.0},\n"
                "    {'user_id': 103, 'tier': 'GOLD', 'score': 88.0}\n"
                "]\n"
                "\n"
                "df = MiniDataFrame(raw_rows, schema_def)\n"
                "filtered_df = df.filter(lambda r: r['tier'] == 'GOLD').select('user_id', 'score')\n"
                "\n"
                "print(f'Struktur Skema DataFrame: {df.schema}')\n"
                "print(f'Hasil Transformasi DataFrame (Filter GOLD & Proyeksi):')\n"
                "for r in filtered_df.records:\n"
                "    print(f'  - Record: {r}')\n"
                "print('Kesimpulan: DataFrame mengikat data dengan skema kuat untuk optimasi relasional.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.6.6
    {
        "id": "10.6.6",
        "title": "Inisialisasi SparkSession dan Pembacaan Data Skala Terdistribusi",
        "learningObjectives": [
            "Memahami arsitektur SparkSession sebagai titik masuk terpadu (unified entry point) aplikasi Spark modern.",
            "Menganalisis konfigurasi alokasi memori, parallelism, dan dynamic allocation pada runtime Spark.",
            "Mengimplementasikan simulator inisialisasi sesi komputasi dan pembacaan partisi data terdistribusi."
        ],
        "prerequisites": [
            "10.6.1 (Arsitektur Master-Worker).",
            "10.6.5 (DataFrame API)."
        ],
        "commonPitfalls": [
            "Membuat beberapa instance SparkSession secara bersamaan di dalam satu proses driver, memicu kebocoran memori dan konflik konfigurasi.",
            "Mengabaikan parameter `spark.default.parallelism`, memicu pembacaan file dengan jumlah partisi yang tidak seimbang dengan kapasitas CPU worker."
        ],
        "academicReferences": [
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media.",
            "Spark Documentation: Initializing Spark and Cluster Configuration."
        ],
        "caseStudy": "Migrasi dari Spark 1.x ke Spark 2.x/3.x pada sebuah unicorn finansial menyatukan konfigurasi `SQLContext`, `HiveContext`, dan `SparkContext` ke dalam satu objek `SparkSession.builder()`, menyederhanakan kode inisialisasi pada 120 repositori pipeline data.",
        "content": {
            "theory": (
                "Pada era awal Apache Spark (versi 1.x), pengembang diwajibkan mengelola beberapa konteks berbeda secara manual: `SparkContext` untuk operasi RDD dasar, `SQLContext` untuk manipulasi relasional, `HiveContext` untuk konektivitas metadata warehouse, dan `StreamingContext` untuk streaming. "
                "Sejak Spark 2.0, seluruh fungsionalitas tersebut disatukan ke dalam satu titik masuk tunggal bernama **SparkSession**. "
                "SparkSession mengadopsi pola perancangan *Builder Pattern* (`SparkSession.builder`) yang mengonsolidasikan seluruh konfigurasi runtime: "
                "1. **Nama Aplikasi & Master URL**: `.appName('DataEngineJob')` dan `.master('k8s://...' atau 'yarn' atau 'local[*]')`. "
                "2. **Konfigurasi Dynamic Allocation**: "
                "$$\\text{DynamicAllocation} \\implies E(t) = \\min(E_{\\max}, \\max(E_{\\min}, \\lceil \\text{BacklogTasks} / \\text{TasksPerExec} \\rceil))$$ "
                "Secara otomatis menambah jumlah executor saat beban antrean task melonjak dan membebaskan worker saat menganggur (*idle timeout*). "
                "3. **Unified Data Source API**: Antarmuka pembacaan data standar `spark.read.format('parquet').load(path)` yang secara otomatis memetakan blok penyimpanan terdistribusi menjadi partisi-partisi DataFrame di dalam memori kluster."
            ),
            "realWorldApplication": (
                "Dalam produksi, job PySpark di AWS EMR atau Databricks selalu dimulai dengan pemanggilan singleton `spark = SparkSession.builder.getOrCreate()` untuk berbagi context lintas modul aplikasi."
            ),
            "codeSnippet": (
                "# Implementasi Builder Pattern SparkSession & Pembacaan Partisi Terdistribusi\n"
                "class SparkSessionSimulator:\n"
                "    _instance = None\n"
                "    \n"
                "    def __init__(self, app_name, master, configs):\n"
                "        self.app_name = app_name\n"
                "        self.master = master\n"
                "        self.configs = configs\n"
                "        self.is_active = True\n"
                "        \n"
                "    class Builder:\n"
                "        def __init__(self):\n"
                "            self._app_name = 'DefaultApp'\n"
                "            self._master = 'local[*]'\n"
                "            self._configs = {}\n"
                "            \n"
                "        def appName(self, name):\n"
                "            self._app_name = name\n"
                "            return self\n"
                "            \n"
                "        def master(self, m):\n"
                "            self._master = m\n"
                "            return self\n"
                "            \n"
                "        def config(self, key, value):\n"
                "            self._configs[key] = value\n"
                "            return self\n"
                "            \n"
                "        def getOrCreate(self):\n"
                "            if SparkSessionSimulator._instance is None:\n"
                "                SparkSessionSimulator._instance = SparkSessionSimulator(self._app_name, self._master, self._configs)\n"
                "            return SparkSessionSimulator._instance\n"
                "            \n"
                "    builder = Builder()\n"
                "\n"
                "session = SparkSessionSimulator.builder \\\n"
                "    .appName('CustomerChurnFeaturePipeline') \\\n"
                "    .master('yarn') \\\n"
                "    .config('spark.executor.memory', '8g') \\\n"
                "    .config('spark.sql.shuffle.partitions', '400') \\\n"
                "    .getOrCreate()\n"
                "\n"
                "print(f'Status Inisialisasi SparkSession:')\n"
                "print(f'  App Name : {session.app_name}')\n"
                "print(f'  Master   : {session.master}')\n"
                "print(f'  Configs  : {session.configs}')\n"
                "print(f'  Session Is Active: {session.is_active} (Singleton instance terverifikasi)')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.6.7
    {
        "id": "10.6.7",
        "title": "Transformasi PySpark: Select, Filter, WithColumn, GroupBy, dan Agg",
        "learningObjectives": [
            "Menguasai implementasi operasi aljabar relasional inti menggunakan PySpark DataFrame API.",
            "Menganalisis efisiensi komputasi ekspresi kolom ter-vektorisasi dibandingkan Python User-Defined Functions (UDFs).",
            "Mengimplementasikan pipeline analitik end-to-end dengan pengelompokan multi-dimensi dan agregasi statistik."
        ],
        "prerequisites": [
            "10.6.5 (DataFrame API).",
            "Konsep Aljabar Relasional (Proyeksi, Seleksi, Agregasi)."
        ],
        "commonPitfalls": [
            "Menggunakan Python UDF biasa (`@udf`) untuk operasi aritmatika sederhana alih-alih fungsi bawaan `pyspark.sql.functions`, memicu overhead serialisasi Py4J yang memperlambat komputasi hingga 10x lipat.",
            "Memanggil `withColumn` di dalam loop ratusan kali, memicu pembengkakan pohon rencana logis Catalyst yang menyebabkan stack overflow pada driver."
        ],
        "academicReferences": [
            "Armbrust, M., et al. (2015). Spark SQL: Relational Data Processing in Spark. ACM SIGMOD 2015.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Sebuah e-commerce global memproses 100 juta klik pengguna harian. Menggantikan Python UDF kustom dengan fungsi built-in PySpark `when().otherwise()` dan ekspresi relasional native mempercepat waktu eksekusi agregasi harian dari 3.5 jam menjadi 18 menit.",
        "content": {
            "theory": (
                "Dalam manipulasi data analitis skala besar, PySpark menyediakan antarmuka deklaratif yang memetakan operasi aljabar relasional secara langsung ke engine eksekusi terdistribusi: "
                "1. **Proyeksi (`select`) & Seleksi (`filter` / `where`)**: "
                "$$\\pi_{c_1, \\dots, c_k}(R) \\quad \\text{dan} \\quad \\sigma_{\\phi}(R)$$ "
                "Memungkinkan engine membaca hanya atribut yang dibutuhkan dan membuang baris yang tidak memenuhi predikat secara instan. "
                "2. **Mutasi Kolom (`withColumn`)**: Menambahkan kolom baru atau menimpa kolom lama menggunakan ekspresi kolom (*Column expressions*). "
                "3. **Pengelompokan & Agregasi (`groupBy` & `agg`)**: "
                "Operasi agregasi terdistribusi dieksekusi melalui **Two-Phase Aggregation**: "
                "   - *Fase Parsial (Map-Side Partial Aggregate)*: Setiap task menghitung jumlahan parsial $\\sum_{i} x_i$ dan cacah parsial $N$ di dalam partisi lokalnya. "
                "   - *Fase Final (Reduce-Side Global Aggregate)*: Hasil parsial dikirim melalui shuffle dan digabungkan secara global: "
                "$$\\mu = \\frac{\\sum \\text{PartialSum}_j}{\\sum \\text{PartialCount}_j}$$ "
                "Pendekatan two-phase aggregation secara dramatis mengurangi volume data yang harus ditransfer melintasi jaringan kluster."
            ),
            "realWorldApplication": (
                "Data science pipeline di Airbnb dan Uber menggunakan PySpark `groupBy().agg()` untuk menghitung fitur historis pengguna (seperti rata-rata nilai transaksi 30 hari) pada dataset miliaran baris."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Implementasi Simulasi Operasi Relasional PySpark: Select, Filter, WithColumn, & GroupBy Agg\n"
                "class PySparkEngineSimulator:\n"
                "    def __init__(self, data_rows):\n"
                "        self.data = data_rows\n"
                "        \n"
                "    def with_column(self, new_col_name, transform_fn):\n"
                "        for r in self.data:\n"
                "            r[new_col_name] = transform_fn(r)\n"
                "        return self\n"
                "        \n"
                "    def filter(self, predicate_fn):\n"
                "        self.data = [r for r in self.data if predicate_fn(r)]\n"
                "        return self\n"
                "        \n"
                "    def group_by_agg(self, group_col, agg_col):\n"
                "        # Two-phase aggregation simulation\n"
                "        groups = {}\n"
                "        for r in self.data:\n"
                "            k = r[group_col]\n"
                "            val = r[agg_col]\n"
                "            if k not in groups:\n"
                "                groups[k] = {'sum': 0.0, 'count': 0}\n"
                "            groups[k]['sum'] += val\n"
                "            groups[k]['count'] += 1\n"
                "            \n"
                "        # Compute global average\n"
                "        results = []\n"
                "        for k, stats in sorted(groups.items()):\n"
                "            results.append({\n"
                "                group_col: k,\n"
                "                'total_amount': stats['sum'],\n"
                "                'avg_amount': stats['sum'] / stats['count'],\n"
                "                'tx_count': stats['count']\n"
                "            })\n"
                "        return results\n"
                "\n"
                "raw_transactions = [\n"
                "    {'tx_id': 1, 'category': 'Elektronik', 'price': 500.0, 'discount': 0.1},\n"
                "    {'tx_id': 2, 'category': 'Fashion', 'price': 100.0, 'discount': 0.2},\n"
                "    {'tx_id': 3, 'category': 'Elektronik', 'price': 800.0, 'discount': 0.05},\n"
                "    {'tx_id': 4, 'category': 'Buku', 'price': 40.0, 'discount': 0.0},\n"
                "    {'tx_id': 5, 'category': 'Fashion', 'price': 250.0, 'discount': 0.15}\n"
                "]\n"
                "\n"
                "engine = PySparkEngineSimulator(raw_transactions)\n"
                "# Pipeline: withColumn(net_amount) -> filter(price > 50) -> groupBy(category).agg(sum, avg)\n"
                "summary = engine \\\n"
                "    .with_column('net_amount', lambda r: r['price'] * (1 - r['discount'])) \\\n"
                "    .filter(lambda r: r['price'] > 50.0) \\\n"
                "    .group_by_agg('category', 'net_amount')\n"
                "\n"
                "print('Hasil Eksekusi Relasional PySpark Pipeline:')\n"
                "for s in summary:\n"
                "    print(f'  - Kategori {s[\"category\"]:11s}: Total Net=${s[\"total_amount\"]:6.2f} | Rata-rata=${s[\"avg_amount\"]:6.2f} | N={s[\"tx_count\"]}')\n"
                "print('Kesimpulan: Two-phase aggregation meminimalkan footprint pertukaran data lintas partisi.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.6.8
    {
        "id": "10.6.8",
        "title": "Operasi Join Terdistribusi: Shuffle Hash Join vs Broadcast Hash Join",
        "learningObjectives": [
            "Membandingkan karakteristik algoritmik dan biaya transfer jaringan antara Shuffle Hash Join dan Broadcast Hash Join.",
            "Menganalisis mekanisme kerja Map-Side Broadcast Join dalam mengeliminasi tahapan shuffle untuk tabel dimensi kecil.",
            "Mengimplementasikan simulator join terdistribusi yang menghitung volume pertukaran byte lintas jaringan secara presisi."
        ],
        "prerequisites": [
            "10.6.4 (DAG & Shuffle).",
            "10.3.2 (Star Schema: Fact & Dimension)."
        ],
        "commonPitfalls": [
            "Melakukan broadcast pada tabel yang melebihi batas memori driver (`autoBroadcastJoinThreshold` default 10 MB dinaikkan sembarangan ke 2 GB), memicu crash Driver OOM.",
            "Membiarkan dua tabel berukuran masif di-join tanpa partisi kunci yang selaras, memicu Shuffle Hash Join berskala petabyte yang melumpuhkan jaringan kluster."
        ],
        "academicReferences": [
            "Armbrust, M., et al. (2015). Spark SQL: Relational Data Processing in Spark. ACM SIGMOD 2015.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Analisis kueri analitik pada 5 miliar baris tabel fakta klik dengan tabel dimensi 500 kategori di Walmart. Pengaktifan Broadcast Hash Join (`broadcast(dim_df)`) mengeliminasi proses shuffle 450 GB data, memangkas durasi join dari 42 menit menjadi 1.5 menit.",
        "content": {
            "theory": (
                "Operasi penggabungan relasional (*JOIN*) adalah operasi paling mahal dalam komputasi data terdistribusi karena potensi perpindahan data fisik melintasi kabel jaringan kluster. "
                "Spark menyediakan dua strategi join utama dengan trade-off arsitektural yang berbeda: "
                "1. **Shuffle Hash Join (Sort-Merge / Hash)**: "
                "Digunakan ketika kedua tabel yang digabungkan berukuran besar ($T_A$ dan $T_B$ sama-sama masif). "
                "Spark mengharuskan seluruh baris dari kedua tabel di-hash berdasarkan join key dan dikirimkan melintasi jaringan kluster (*all-to-all shuffle*) sehingga baris dengan key identik mendarat pada executor yang sama: "
                "$$\\text{NetworkTraffic}(\\text{SHJ}) = \\text{Size}(T_A) + \\text{Size}(T_B)$$ "
                "2. **Broadcast Hash Join (BHJ / Map-Side Join)**: "
                "Digunakan ketika salah satu tabel berukuran kecil (tabel dimensi $\\le 10$ MB secara default). "
                "Driver mengunduh tabel kecil tersebut dan menyiarkannya (*broadcast*) ke seluruh executor node dalam kluster. "
                "Setiap executor menyimpan tabel kecil dalam hash table di RAM lokal dan mengeksekusi pencarian langsung terhadap partisi tabel fakta lokal tanpa melakukan shuffle data besar: "
                "$$\\text{NetworkTraffic}(\\text{BHJ}) = E \\times \\text{Size}(T_{\\text{small}}) \\ll \\text{Size}(T_{\\text{large}})$$ "
                "Hal ini mengeliminasi 100% biaya pertukaran jaringan untuk tabel fakta yang besar."
            ),
            "realWorldApplication": (
                "Optimizer Spark SQL (Catalyst) secara otomatis memilih Broadcast Hash Join jika estimasi statistik tabel berada di bawah ambang batas `spark.sql.autoBroadcastJoinThreshold`."
            ),
            "codeSnippet": (
                "# Komparasi Komputasi & Jaringan: Shuffle Hash Join vs Broadcast Hash Join\n"
                "class DistributedJoinSimulator:\n"
                "    @staticmethod\n"
                "    def simulate_shuffle_hash_join(fact_records, dim_records, num_executors=4):\n"
                "        # Seluruh record kedua tabel harus di-hash dan dikirim melintasi jaringan\n"
                "        fact_bytes = len(fact_records) * 64  # Estimasi 64 byte/baris\n"
                "        dim_bytes = len(dim_records) * 32   # Estimasi 32 byte/baris\n"
                "        total_network_transfer = fact_bytes + dim_bytes\n"
                "        return {\n"
                "            'strategy': 'Shuffle Hash Join',\n"
                "            'network_transfer_bytes': total_network_transfer,\n"
                "            'shuffle_required': True\n"
                "        }\n"
                "        \n"
                "    @staticmethod\n"
                "    def simulate_broadcast_join(fact_records, dim_records, num_executors=4):\n"
                "        # Hanya tabel dimensi kecil yang disiarkan ke setiap executor\n"
                "        dim_bytes = len(dim_records) * 32\n"
                "        total_network_transfer = dim_bytes * num_executors\n"
                "        return {\n"
                "            'strategy': 'Broadcast Hash Join',\n"
                "            'network_transfer_bytes': total_network_transfer,\n"
                "            'shuffle_required': False\n"
                "        }\n"
                "\n"
                "# Kasus: 100.000 transaksi fakta di-join dengan 50 kategori dimensi pada 4 executor\n"
                "fact_count = 100000\n"
                "dim_count = 50\n"
                "execs = 4\n"
                "\n"
                "shj_res = DistributedJoinSimulator.simulate_shuffle_hash_join(range(fact_count), range(dim_count), execs)\n"
                "bhj_res = DistributedJoinSimulator.simulate_broadcast_join(range(fact_count), range(dim_count), execs)\n"
                "\n"
                "traffic_shj = shj_res['network_transfer_bytes']\n"
                "traffic_bhj = bhj_res['network_transfer_bytes']\n"
                "reduction_pct = (1 - traffic_bhj / traffic_shj) * 100\n"
                "\n"
                "print(f'Evaluasi Strategi Join Terdistribusi ({fact_count:,} Fakta x {dim_count:,} Dimensi):')\n"
                "print(f'  1. {shj_res[\"strategy\"]:<22s}: Network Transfer = {traffic_shj:,} bytes (Shuffle={shj_res[\"shuffle_required\"]})')\n"
                "print(f'  2. {bhj_res[\"strategy\"]:<22s}: Network Transfer = {traffic_bhj:,} bytes (Shuffle={bhj_res[\"shuffle_required\"]})')\n"
                "print(f'  Penghematan Beban Jaringan: {reduction_pct:.2f}% data transfer berhasil dieliminasi!')\n"
                "print('  Kesimpulan: Broadcast join mengeliminasi shuffle stage untuk tabel dimensi kecil.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.6.9
    {
        "id": "10.6.9",
        "title": "Manajemen Memori Spark: Storage Memory vs Execution Memory",
        "learningObjectives": [
            "Memahami arsitektur Unified Memory Manager Apache Spark dan pembagian pool memori JVM.",
            "Menganalisis mekanisme peminjaman dinamis (Dynamic Borrowing) antara Storage Memory dan Execution Memory.",
            "Mengimplementasikan simulator alokasi memori yang memodelkan aturan penggusuran (eviction policy) saat lonjakan eksekusi."
        ],
        "prerequisites": [
            "10.6.1 (Arsitektur Master-Worker).",
            "Manajemen Memori Heap vs Non-Heap pada JVM."
        ],
        "commonPitfalls": [
            "Mengira memori cache RDD/DataFrame dijamin tidak akan pernah hilang; Execution memory berhak menggusur Storage memory ke disk saat kueri shuffle membutuhkan ruang.",
            "Mengabaikan porsi `spark.memory.offHeap.enabled`, membatasi pemanfaatan memori native untuk akselerasi Project Tungsten."
        ],
        "academicReferences": [
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media.",
            "Apache Spark Core Architecture: Unified Memory Management Model."
        ],
        "caseStudy": "Analisis kegagalan OOM pada kluster Spark di Netflix menemukan bahwa job sort-merge join berskala besar kehabisan memori karena cache DataFrame lama tidak dapat digusur secara efisien. Menerapkan tuning batas `spark.memory.storageFraction` mencegah disk thrashing dan menstabilkan alokasi memori kluster.",
        "content": {
            "theory": (
                "Pada versi awal Spark (model Static Memory), memori executor dibagi secara kaku menjadi partisi statis untuk eksekusi dan penyimpanan cache. "
                "Jika ruang eksekusi penuh sementara ruang cache kosong, Spark tetap terpaksa melakukan disk spill. "
                "Sejak Spark 1.6, diperkenalkan arsitektur **Unified Memory Manager** yang menyatukan alokasi memori di bawah aturan dinamis fleksibel: "
                "Total Heap Memory yang dialokasikan untuk worker diatur sebagai berikut: "
                "1. **Reserved Memory**: 300 MB dicadangkan untuk keperluan internal sistem Spark. "
                "2. **User Memory**: $(1 - \\text{spark.memory.fraction}) \\times (\\text{Heap} - 300\\text{MB})$ (default 40%) untuk struktur data pengguna, metadata, dan pelacakan UDF. "
                "3. **Spark Memory Pool**: $\\text{spark.memory.fraction} \\times (\\text{Heap} - 300\\text{MB})$ (default 60%), yang dibagi menjadi dua area dinamis: "
                "   - **Execution Memory**: Digunakan untuk buffer komputasi shuffle, sort, hash join, dan agregasi. "
                "   - **Storage Memory**: Digunakan untuk menyimpan cache RDD/DataFrame dan broadcast variables. "
                "**Aturan Peminjaman Dinamis (Borrowing & Eviction Policy)**: "
                "- Jika Storage meminjam ruang Execution, dan tiba-tiba Execution membutuhkan ruang tersebut, **Execution berhak menggusur (evict) blok Storage ke disk secara paksa**. "
                "- Sebaliknya, Storage **tidak pernah boleh menggusur Execution Memory** karena tugas eksekusi yang sedang berjalan tidak dapat diganggu tanpa memicu crash task."
            ),
            "realWorldApplication": (
                "Data engineers mengonfigurasi `spark.memory.fraction=0.8` pada job analitik berat untuk meminimalisir frekuensi disk spill pada komputasi join ratusan gigabyte."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Unified Memory Manager Apache Spark (Storage vs Execution)\n"
                "class UnifiedMemorySimulator:\n"
                "    def __init__(self, total_pool_mb=1000, storage_fraction=0.5):\n"
                "        self.total_pool = total_pool_mb\n"
                "        self.storage_limit = total_pool_mb * storage_fraction\n"
                "        self.storage_used = 0\n"
                "        self.execution_used = 0\n"
                "        \n"
                "    def allocate_storage(self, mb):\n"
                "        available = self.total_pool - (self.storage_used + self.execution_used)\n"
                "        if mb <= available:\n"
                "            self.storage_used += mb\n"
                "            return True\n"
                "        return False  # Storage tidak boleh menggusur Execution!\n"
                "        \n"
                "    def allocate_execution(self, mb):\n"
                "        available = self.total_pool - (self.storage_used + self.execution_used)\n"
                "        if mb <= available:\n"
                "            self.execution_used += mb\n"
                "            return {'status': 'ALLOCATED', 'evicted_storage_mb': 0}\n"
                "        \n"
                "        # Aturan Penggusuran: Execution menggusur Storage yang melebihi batas bebas\n"
                "        deficit = mb - available\n"
                "        evictable_storage = min(self.storage_used, deficit)\n"
                "        self.storage_used -= evictable_storage\n"
                "        self.execution_used += mb\n"
                "        return {'status': 'ALLOCATED_WITH_EVICTION', 'evicted_storage_mb': evictable_storage}\n"
                "\n"
                "mem_mgr = UnifiedMemorySimulator(total_pool_mb=1000, storage_fraction=0.5)\n"
                "# 1. Cache DataFrame mengisi 400 MB storage\n"
                "mem_mgr.allocate_storage(400)\n"
                "\n"
                "# 2. Kueri join besar membutuhkan 700 MB execution\n"
                "alloc_res = mem_mgr.allocate_execution(700)\n"
                "\n"
                "print('Simulasi Unified Memory Management Apache Spark:')\n"
                "print(f'  Alokasi Execution 700 MB: {alloc_res[\"status\"]}')\n"
                "print(f'  Storage Cache Digusur   : {alloc_res[\"evicted_storage_mb\"]} MB (Dipindahkan ke disk spill)')\n"
                "print(f'  Penggunaan Memori Terkini:')\n"
                "print(f'    - Execution Memory: {mem_mgr.execution_used} MB')\n"
                "print(f'    - Storage Memory  : {mem_mgr.storage_used} MB')\n"
                "print(f'    - Total Digunakan : {mem_mgr.execution_used + mem_mgr.storage_used} / {mem_mgr.total_pool} MB')\n"
                "print('Kesimpulan: Execution memory diprioritaskan di atas storage cache untuk mencegah kegagalan job.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.6.10
    {
        "id": "10.6.10",
        "title": "Teknik Caching & Persistence DataFrame (MEMORY_ONLY, MEMORY_AND_DISK)",
        "learningObjectives": [
            "Memahami taksonomi StorageLevel pada Apache Spark dan perbedaan perlakuan serialisasi.",
            "Menganalisis perbandingan kinerja trade-off memori vs CPU antara MEMORY_ONLY, MEMORY_ONLY_SER, dan MEMORY_AND_DISK.",
            "Mengimplementasikan pengujian benchmarking akses berulang untuk mengevaluasi efisiensi latensi data caching."
        ],
        "prerequisites": [
            "10.6.9 (Manajemen Memori Spark).",
            "10.6.3 (Evaluasi Lazy & Transformations)."
        ],
        "commonPitfalls": [
            "Melakukan `.cache()` pada setiap DataFrame perantara tanpa pernah memanggil `.unpersist()`, menyebabkan memori RAM penuh dan penurunan performa sistem.",
            "Menggunakan `MEMORY_ONLY` pada dataset raksasa yang tidak muat di RAM, memicu penghitungan ulang partisi yang hilang dari awal silsilah pada setiap akses."
        ],
        "academicReferences": [
            "Zaharia, M., et al. (2012). Resilient Distributed Datasets. NSDI 2012.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Pipeline deteksi anomali fraud mengakses tabel fitur pengguna yang sama sebanyak 10 kali dalam satu alur kerja. Tanpa caching, kueri memakan waktu 48 menit karena harus memindai data mentah dari S3 10 kali. Menggunakan `.persist(StorageLevel.MEMORY_AND_DISK_SER)` memangkas waktu menjadi 4.5 menit.",
        "content": {
            "theory": (
                "Dalam alur kerja analitik Big Data dan pelatihan model AI, sering kali suatu DataFrame perantara yang dihasilkan dari komputasi berat digunakan berulang kali oleh beberapa operasi Action hilir. "
                "Secara default, evaluasi lazy Spark akan menghitung ulang seluruh silsilah dari sumber awal setiap kali Action dipanggil. "
                "Spark menyediakan mekanisme **Persistence (Caching)** untuk mempertahankan partisi data di memori kluster: "
                "Tingkatan penyimpanan (**StorageLevel**) diklasifikasikan berdasarkan tiga dimensi ortogonal: "
                "1. **UseDisk**: Jika partisi tidak muat di RAM, tuliskan ke disk lokal worker. "
                "2. **UseMemory**: Simpan partisi di dalam RAM executor. "
                "3. **Deserialized vs Serialized (`_SER`)**: Menyimpan data sebagai objek Java mentah vs byte array terkompresi. "
                "Ringkasan taksonomi StorageLevel kanonikal: "
                "- `MEMORY_ONLY`: Standar default `.cache()`. Sangat cepat diakses (tanpa deserialisasi), namun memakan RAM paling besar. "
                "- `MEMORY_ONLY_SER`: Menyimpan sebagai serial byte array. Mengurangi ukuran footprint memori hingga 60%, namun membutuhkan CPU cost saat pembacaan. "
                "- `MEMORY_AND_DISK`: Menyimpan di RAM; jika partisi meluap (*overflow*), secara mulus dialihkan ke disk lokal tanpa memicu recompute. "
                "- `OFF_HEAP`: Menyimpan di luar manajemen garbage collection JVM (Project Tungsten). "
                "Pembersihan cache dilakukan secara deterministik menggunakan perintah `df.unpersist()`."
            ),
            "realWorldApplication": (
                "Framework Machine Learning seperti Spark MLlib secara otomatis memanggil `.cache()` pada dataset pelatihan sebelum memulai loop iterasi konvergensi gradien numerik."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Mekanisme Caching & Persistence DataFrame\n"
                "class CachedDataFrameSimulator:\n"
                "    def __init__(self, data_generator_fn):\n"
                "        self.gen_fn = data_generator_fn\n"
                "        self.is_cached = False\n"
                "        self.cache_storage = None\n"
                "        self.compute_cost_count = 0\n"
                "        \n"
                "    def cache(self):\n"
                "        self.is_cached = True\n"
                "        return self\n"
                "        \n"
                "    def unpersist(self):\n"
                "        self.is_cached = False\n"
                "        self.cache_storage = None\n"
                "        return self\n"
                "        \n"
                "    def count(self):\n"
                "        if self.is_cached and self.cache_storage is not None:\n"
                "            # Cache hit: Baca instan dari memori tanpa recompute\n"
                "            return len(self.cache_storage), 'CACHE_HIT'\n"
                "            \n"
                "        # Cache miss / Uncached: Jalankan generator komputasi berat\n"
                "        self.compute_cost_count += 1\n"
                "        data = self.gen_fn()\n"
                "        if self.is_cached:\n"
                "            self.cache_storage = data\n"
                "        return len(data), 'COMPUTED_FROM_SOURCE'\n"
                "\n"
                "# Generator data transaksi simulasi\n"
                "def heavy_data_pipeline():\n"
                "    return [x**2 for x in range(10000)]\n"
                "\n"
                "df_sim = CachedDataFrameSimulator(heavy_data_pipeline).cache()\n"
                "\n"
                "# Akses 1: Pertama kali dipanggil (Cache Miss -> Eksekusi komputasi & simpan ke cache)\n"
                "cnt1, status1 = df_sim.count()\n"
                "# Akses 2: Kedua kali dipanggil (Cache Hit -> Ambil langsung dari memori)\n"
                "cnt2, status2 = df_sim.count()\n"
                "# Akses 3: Ketiga kali dipanggil\n"
                "cnt3, status3 = df_sim.count()\n"
                "\n"
                "print('Evaluasi Caching DataFrame:')\n"
                "print(f'  Akses #1 (First Run) : Status={status1:20s} | Hasil={cnt1:,} baris')\n"
                "print(f'  Akses #2 (Cached Run): Status={status2:20s} | Hasil={cnt2:,} baris')\n"
                "print(f'  Akses #3 (Cached Run): Status={status3:20s} | Hasil={cnt3:,} baris')\n"
                "print(f'  Total Siklus Komputasi Sumber: {df_sim.compute_cost_count} kali (Seharusnya 3 kali tanpa cache!)')\n"
                "print('Kesimpulan: Caching mengeliminasi evaluasi berulang pada DAG komputasi iteratif.')"
            ),
            "codeSnippetOutput": ""
        }
    }
]

# Run all snippets to get exact deterministic output
for sub in subchapters:
    code = sub["content"]["codeSnippet"]
    old_stdout = sys.stdout
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
    print(f"Subchapter {sub['id']} generated. Output len: {len(out)} chars.")

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"[OK] Berhasil menghasilkan 10 subbab Bab 6 Topik 10 ke {output_file}")
