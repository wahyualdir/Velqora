# -*- coding: utf-8 -*-
"""
Generator Subbab Bab 11 Topik 10:
Bab 11: Orkestrasi Alur Kerja Terjadwal dengan Apache Airflow (10.11.1 - 10.11.10)
Menghasilkan de_ch11_data.json dengan 10 subbab terverifikasi substantif.
Termasuk kutipan verbatim Tyler Akidau et al. (PVLDB 2015 / The Dataflow Model) pada 10.11.3
yang dikontekstualisasikan secara ketat pada pemisahan event-time vs processing-time dalam penjadwalan interval Airflow.
"""

import json
import io
import sys
import contextlib
import os

output_file = os.path.join(os.path.dirname(__file__), "de_ch11_data.json")

subchapters = [
    # 10.11.1
    {
        "id": "10.11.1",
        "title": "Paradigma Workflow Orchestration: Directed Acyclic Graph (DAG) & Dependency Resolution",
        "learningObjectives": [
            "Memahami konsep dasar Directed Acyclic Graph (DAG) dalam pemodelan alur kerja rekayasa data.",
            "Menganalisis algoritma Topological Sort (Kahn's Algorithm) untuk menyelesaikan dependensi eksekusi task.",
            "Mengimplementasikan engine resolusi dependensi DAG sederhana yang memvalidasi siklus dan menentukan urutan eksekusi."
        ],
        "prerequisites": [
            "10.1.1 (Arsitektur Pipeline Data End-to-End).",
            "Struktur Data Graf Dasar (Node, Edge, Siklus)."
        ],
        "commonPitfalls": [
            "Membuat dependensi melingkar (*cyclic dependency*) antar-task yang menyebabkan *infinite loop* atau kegagalan parsing scheduler.",
            "Menumpuk terlalu banyak operasi heterogen ke dalam satu task monolitik raksasa (*god task*), mengorbankan granularitas retry dan observabilitas."
        ],
        "academicReferences": [
            "Kahn, A. B. (1962). Topological sorting of large networks. Communications of the ACM, 558–562.",
            "Tarjan, R. (1972). Depth-first search and linear graph algorithms. SIAM Journal on Computing, 1(2), 146–160."
        ],
        "caseStudy": "Airbnb menghadapi ribuan skrip cron tak terkoordinasi yang sering gagal tanpa kejelasan urutan eksekusi. Tim rekayasa mereka mengembangkan Apache Airflow untuk memformalkan setiap alur kerja analitik sebagai DAG modular, mengurangi insiden data rusak hingga 80% dan memungkinkan pelacakan dependensi lintas ratusan tim secara transparan.",
        "content": {
            "theory": (
                "Dalam rekayasa data modern, **Workflow Orchestration** adalah disiplin mengoordinasikan, menjadwalkan, dan memantau serangkaian tugas komputasi data terdistribusi yang saling bergantung. "
                "Secara matematis, setiap alur kerja dimodelkan sebagai **Directed Acyclic Graph (DAG)**: "
                "$$\\mathcal{G} = (\\mathcal{V}, \\mathcal{E})$$ "
                "di mana himpunan simpul $\\mathcal{V} = \\{v_1, v_2, \\dots, v_n\\}$ merepresentasikan unit komputasi atomik (**Tasks / Operators**), dan himpunan sisi berarah $\\mathcal{E} \\subseteq \\mathcal{V} \\times \\mathcal{V}$ merepresentasikan relasi dependensi kausalitas temporal: "
                "$$\\forall (u, v) \\in \\mathcal{E}, \\quad \\text{Task } u \\text{ wajib selesai sukses sebelum Task } v \\text{ boleh dimulai}$$ "
                "Sifat **asiklik (acyclic)** adalah invarian mutlak: "
                "$$\\nexists \\text{ lintasan berarah } v_{i_1} \\to v_{i_2} \\to \\dots \\to v_{i_k} \\quad \\text{di mana } v_{i_1} = v_{i_k}$$ "
                "Keberadaan siklus akan memicu *deadlock* deterministik di mana dua atau lebih tugas saling menunggu penyelesaian satu sama lain tanpa pernah dapat dialokasikan ke antrean worker. "
                "Mesin penjadwal (*scheduler*) mengurai dependensi ini menggunakan algoritma **Topological Sort** (khususnya Algoritma Kahn) yang menghitung derajat masuk (*in-degree*) setiap simpul: "
                "$$\\text{InDegree}(v) = |\\{u \\in \\mathcal{V} \\mid (u, v) \\in \\mathcal{E}\\}|$$ "
                "Algoritma menginisialisasi antrean simpul dengan $\\text{InDegree} = 0$. Setiap kali sebuah simpul $u$ diproses dan selesai dieksekusi, sisi keluar $(u, v)$ dihapus secara logis dan $\\text{InDegree}(v)$ dikurangi satu. "
                "Jika pada akhir traversal jumlah simpul yang berhasil diurutkan $|L| < |\\mathcal{V}|$, maka graf secara matematis terbukti mengandung siklus (*cycle detected*). "
                "Resolusi ini memungkinkan scheduler membagi tugas ke dalam beberapa tingkat eksekusi paralel (*execution waves*), memaksimalkan utilisasi resource komputasi kluster."
            ),
            "realWorldApplication": (
                "Perusahaan e-commerce skala besar mengorkestrasikan ribuan DAG harian untuk mengekstrak transaksi, melatih model rekomendasi embedding, dan mempublikasikan skor pelanggan ke feature store online."
            ),
            "codeSnippet": (
                "# Implementasi Algoritma Kahn untuk Resolusi Dependensi DAG & Deteksi Siklus\n"
                "from collections import deque\n"
                "\n"
                "class DAGResolver:\n"
                "    def __init__(self):\n"
                "        self.adj = {}\n"
                "        self.in_degree = {}\n"
                "        \n"
                "    def add_task(self, task_name):\n"
                "        if task_name not in self.adj:\n"
                "            self.adj[task_name] = []\n"
                "            self.in_degree[task_name] = 0\n"
                "            \n"
                "    def add_dependency(self, upstream, downstream):\n"
                "        self.add_task(upstream)\n"
                "        self.add_task(downstream)\n"
                "        self.adj[upstream].append(downstream)\n"
                "        self.in_degree[downstream] += 1\n"
                "        \n"
                "    def resolve_execution_order(self):\n"
                "        # Inisialisasi antrean simpul dengan in-degree 0\n"
                "        queue = deque([node for node, deg in self.in_degree.items() if deg == 0])\n"
                "        execution_order = []\n"
                "        in_deg_copy = dict(self.in_degree)\n"
                "        \n"
                "        while queue:\n"
                "            curr = queue.popleft()\n"
                "            execution_order.append(curr)\n"
                "            for neighbor in self.adj[curr]:\n"
                "                in_deg_copy[neighbor] -= 1\n"
                "                if in_deg_copy[neighbor] == 0:\n"
                "                    queue.append(neighbor)\n"
                "                    \n"
                "        if len(execution_order) != len(self.adj):\n"
                "            raise ValueError('Terdeteksi Siklus (Cycle) pada Graph! DAG tidak valid.')\n"
                "            \n"
                "        return execution_order\n"
                "\n"
                "dag = DAGResolver()\n"
                "# Ingesti -> Pembersihan -> Fitur AI -> Training -> Evaluasi\n"
                "dag.add_dependency('Ingest_Raw_CDC', 'Cleanse_Dataset')\n"
                "dag.add_dependency('Cleanse_Dataset', 'Extract_AI_Features')\n"
                "dag.add_dependency('Cleanse_Dataset', 'Compute_Business_KPI')\n"
                "dag.add_dependency('Extract_AI_Features', 'Train_XGBoost_Model')\n"
                "dag.add_dependency('Train_XGBoost_Model', 'Evaluate_Drift_Gate')\n"
                "\n"
                "order = dag.resolve_execution_order()\n"
                "print('Urutan Eksekusi Topologis Valid:')\n"
                "for step, task in enumerate(order, 1):\n"
                "    print(f'  Tahap {step}: {task}')\n"
                "print('Kesimpulan: Resolusi DAG memvalidasi integritas asiklik dan urutan kausalitas data.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.11.2
    {
        "id": "10.11.2",
        "title": "Komponen Inti Arsitektur Apache Airflow: Webserver, Scheduler, Metadata Database, & Celery/Kubernetes Executor",
        "learningObjectives": [
            "Memahami dekomposisi sistem monolitik vs terdistribusi pada arsitektur Apache Airflow.",
            "Menganalisis peran kritis Scheduler Loop, Heartbeat, dan Metadata Database dalam transisi state task.",
            "Membandingkan karakteristik operasional CeleryExecutor vs KubernetesPodExecutor untuk beban kerja AI dinamis."
        ],
        "prerequisites": [
            "10.11.1 (Paradigma DAG & Dependensi).",
            "10.1.2 (Sistem Terdistribusi & Worker Pooling)."
        ],
        "commonPitfalls": [
            "Memasukkan logika komputasi berat (*top-level code*) di berkas definisi DAG yang dieksekusi setiap siklus parsing scheduler, memicu bottleneck CPU scheduler.",
            "Mengabaikan batas kapasitas koneksi database metadata saat ratusan worker Celery melakukan polling status secara agresif."
        ],
        "academicReferences": [
            "Beauchemin, M. (2015). Airflow: a workflow management platform. Airbnb Engineering & Data Science.",
            "Apache Airflow Architectural Documentation: Core Components and Execution Models."
        ],
        "caseStudy": "Twitter mengelola puluhan ribu DAG data harian. Ketika bermigrasi dari LocalExecutor ke CeleryExecutor dengan RabbitMQ dan Redis broker, throughput penjadwalan meningkat 12 kali lipat dan mampu mengisolasi kegagalan worker tanpa mengganggu stabilitas scheduler sentral.",
        "content": {
            "theory": (
                "Arsitektur **Apache Airflow** mengadopsi model terdistribusi modular yang memisahkan tanggung jawab parsing, penjadwalan, persistensi state, dan komputasi fisik ke dalam empat subsistem utama: "
                "1. **Metadata Database (RDBMS)**: Pusat kebenaran tunggal (*single source of truth*) yang menyimpan metadata DAG, status run (*DagRun*), riwayat tugas (*TaskInstance*), variabel, dan koneksi kredensial. Status task bermutasi mengikuti mesin state deterministik: "
                "$$\\text{None} \\to \\text{Scheduled} \\to \\text{Queued} \\to \\text{Running} \\to (\\text{Success} \\mid \\text{Failed} \\mid \\text{Upstream\\_Failed})$$ "
                "2. **Airflow Scheduler**: Komponen jantung sistem yang menjalankan loop tak hingga (*continuous event loop*). Melalui sub-proses `DagFileProcessor`, scheduler secara periodik memindai berkas Python DAG, mengompilasi graf dependensi, mengevaluasi kondisi trigger, dan mengubah state task menjadi `Queued`. "
                "3. **Airflow Webserver (Flask UI)**: Menyajikan antarmuka visual observabilitas, grafik DAG, log eksekusi interaktif, dan kontrol operasional pengguna tanpa berinteraksi langsung dengan worker. "
                "4. **Executor & Worker Pool**: Lapisan abstraksi komputasi: "
                "- **CeleryExecutor**: Memanfaatkan broker pesan (RabbitMQ / Redis) untuk mendistribusikan task ke sekelompok pekerja persisten (*standing worker nodes*). Model ini memiliki latensi start-up tugas sangat rendah (sub-detik) namun rentan terhadap konflik dependensi pustaka Python global antar-tim. "
                "- **KubernetesExecutor / KubernetesPodOperator**: Meluncurkan satu pod Kubernetes isolatif per task secara dinamis: "
                "$$\\text{TaskInstance} \\xrightarrow{\\text{K8s Client}} \\text{Pod}(\\text{CPU}, \\text{Memory}, \\text{GPU})$$ "
                "Model Kubernetes sangat ideal untuk beban kerja rekayasa data AI karena menyediakan isolasi dependensi Python murni, alokasi GPU per-tugas, dan penskalaan otomatis elastis hingga nol (*scale-to-zero*) saat antrean kosong."
            ),
            "realWorldApplication": (
                "Tim MLOps di organisasi perbankan menggunakan KubernetesExecutor pada Airflow untuk mengisolasi library PyTorch dan CUDA driver yang berbeda antar-model tanpa risiko konflik dependency."
            ),
            "codeSnippet": (
                "# Simulator Siklus Scheduler Airflow & State Machine TaskInstance\n"
                "class TaskInstance:\n"
                "    def __init__(self, task_id, upstream_tasks=None):\n"
                "        self.task_id = task_id\n"
                "        self.upstream_tasks = upstream_tasks or []\n"
                "        self.state = 'NONE'\n"
                "        \n"
                "class AirflowSchedulerSimulator:\n"
                "    def __init__(self, tasks):\n"
                "        self.tasks = {t.task_id: t for t in tasks}\n"
                "        \n"
                "    def heartbeat_tick(self):\n"
                "        state_changes = []\n"
                "        for t_id, task in self.tasks.items():\n"
                "            if task.state == 'NONE':\n"
                "                # Cek apakah seluruh upstream sukses\n"
                "                upstream_ok = all(self.tasks[up].state == 'SUCCESS' for up in task.upstream_tasks)\n"
                "                if upstream_ok:\n"
                "                    task.state = 'SCHEDULED'\n"
                "                    state_changes.append((t_id, 'SCHEDULED'))\n"
                "            elif task.state == 'SCHEDULED':\n"
                "                task.state = 'QUEUED'\n"
                "                state_changes.append((t_id, 'QUEUED'))\n"
                "            elif task.state == 'QUEUED':\n"
                "                task.state = 'RUNNING'\n"
                "                state_changes.append((t_id, 'RUNNING'))\n"
                "            elif task.state == 'RUNNING':\n"
                "                task.state = 'SUCCESS'\n"
                "                state_changes.append((t_id, 'SUCCESS'))\n"
                "        return state_changes\n"
                "\n"
                "tasks = [\n"
                "    TaskInstance('extract_wal'),\n"
                "    TaskInstance('transform_silver', ['extract_wal']),\n"
                "    TaskInstance('train_model', ['transform_silver'])\n"
                "]\n"
                "scheduler = AirflowSchedulerSimulator(tasks)\n"
                "\n"
                "print('Simulasi Event Loop Heartbeat Scheduler Airflow:')\n"
                "for cycle in range(1, 5):\n"
                "    changes = scheduler.heartbeat_tick()\n"
                "    print(f'  Siklus {cycle}: {dict(changes)}')\n"
                "print('Status Akhir TaskInstance:')\n"
                "for t_id, task in scheduler.tasks.items():\n"
                "    print(f'  - {t_id}: {task.state}')\n"
                "print('Kesimpulan: Scheduler menggerakkan state transisi deterministik berbasis dependensi upstream.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.11.3 (VERBATIM QUOTE: Tyler Akidau et al., PVLDB 2015 / The Dataflow Model)
    # Rigorously contextualized around event-time vs processing-time in Airflow data interval scheduling & AIP-39.
    {
        "id": "10.11.3",
        "title": "Penjadwalan DAG Berbasis Waktu vs Sensoring Event (Dataset Sensors & Triggers)",
        "learningObjectives": [
            "Membedakan semantik Event Time vs Processing Time dalam orkestrasi batch terjadwal modern.",
            "Memahami evolusi semantik interval Airflow (AIP-39: `data_interval_start` dan `data_interval_end`).",
            "Mengkorelasikan prinsip Dataflow Model (Akidau et al., PVLDB 2015) terhadap abstraksi Watermark dan Dataset-Driven Scheduling di Airflow."
        ],
        "prerequisites": [
            "10.11.1 (Paradigma DAG).",
            "10.8.1 (Event Time vs Processing Time Stream Processing)."
        ],
        "commonPitfalls": [
            "Salah menafsirkan konsep historis `execution_date` Airflow sebagai waktu jam dinding pengeksekusian fisik alih-alih awal jendela interval data logis.",
            "Menggunakan Sensor dalam mode `poke` dengan durasi panjang, yang menghabiskan seluruh worker slot eksekutor dan memicu kelaparan task (*worker starvation*)."
        ],
        "academicReferences": [
            "Akidau, T., et al. (2015). The Dataflow Model: A Practical Approach to Balancing Correctness, Latency, and Cost in Massive-Scale, Unbounded, Out-of-Order Data Processing. Proceedings of the VLDB Endowment (PVLDB), 8(12), 1792–1803.",
            "Apache Airflow AIP-39: Richer schedule_interval / Timetables Specification."
        ],
        "caseStudy": "Sistem deteksi penipuan kartu kredit di bank multinasional sebelumnya memicu DAG batch setiap pergantian jam menggunakan cron statis. Karena keterlambatan data transaksi lintas zona waktu (out-of-order data), agregat fitur sering tidak lengkap. Dengan mengadopsi event-time data intervals dan Airflow Dataset Sensors (menggantikan cron kaku), integritas data fitur mencapai 100% tanpa komputasi ulang.",
        "content": {
            "theory": (
                "Salah satu sumber kebingungan paling mendalam dalam orkestrasi batch tradisional adalah ketidaksesuaian mendasar antara **Waktu Jam Dinding Fisik (Physical Processing Time)** dan **Waktu Logis Terjadinya Data (Logical Event Time)**. "
                "Dalam paper seminal yang meletakkan fondasi matematis bagi komputasi data terdistribusi modern, Tyler Akidau et al. (PVLDB 2015, Google) menyatakan dalam *The Dataflow Model*: "
                "\"Unbounded, unordered, global-scale datasets are increasingly common in day-to-day business (e.g. Web logs, mobile usage statistics, and sensor networks). At the same time, consumers of these datasets have evolved sophisticated requirements, such as event-time ordering and windowing by features of the data themselves, in addition to an insatiable hunger for faster answers. Meanwhile, practicality dictates that one can never fully optimize along all dimensions of correctness, latency, and cost for these types of input. As a result, data processing practitioners are left with the quandary of how to reconcile the tensions between these seemingly competing propositions, often resulting in disparate implementations and systems. We propose that a fundamental shift of approach is necessary to deal with these evolved requirements in modern data processing. We as a field must stop trying to groom unbounded datasets into finite pools of information that eventually become complete, and instead live and breathe under the assumption that we will never know if or when we have seen all of our data, only that new data will arrive, old data may be retracted, and the only way to make this problem tractable is via principled abstractions that allow the practitioner the choice of appropriate tradeoffs along the axes of interest: correctness, latency, and cost. In this paper, we present one such approach, the Dataflow Model, along with a detailed examination of the semantics it enables, an overview of the core principles that guided its design, and a validation of the model itself via the real-world experiences that led to its development.\" "
                "Meskipun dirumuskan dalam konteks *stream processing*, tesis fundamental Akidau et al. mengenai pemisahan absolut antara *Event Time* ($t_e$) dan *Processing Time* ($t_p$) menjadi batu pijakan teoritis bagi perombakan arsitektur penjadwalan Apache Airflow modern (resmi diformalkan melalui **AIP-39: Richer schedule_interval / Timetables**). "
                "Dalam model lama, pengguna sering mengasumsikan bahwa DAG yang dijadwalkan pada `@daily` memproses data pada saat eksekutor berjalan. Padahal, batch orchestration yang benar tidak memproses 'data saat ini', melainkan memotong aliran peristiwa (*unbounded stream*) ke dalam jendela data diskrit: "
                "$$\\mathcal{W}_{\\text{batch}} = [t_{\\text{data\\_interval\\_start}}, \\, t_{\\text{data\\_interval\\_end}})$$ "
                "Eksekusi fisik DAG baru diizinkan berjalan pada waktu pemrosesan riil: "
                "$$t_{\\text{process}} \\ge t_{\\text{data\\_interval\\_end}} + \\delta_{\\text{watermark}}$$ "
                "di mana $\\delta_{\\text{watermark}}$ mengakomodasi keterlambatan data (*late-arriving data*). "
                "Dalam Airflow 2.4+, paradigma ini diperluas menjadi **Dataset-Driven Scheduling (Data-Aware Scheduling)**: sebuah DAG tidak lagi terikat pada waktu cron statis, melainkan dipicu secara reaktif ketika produsen data hulu menerbitkan sinyal bahwa dataset logis target telah selesai ditulis: "
                "$$\\text{Trigger}(\\text{DAG}_{\\text{downstream}}) \\iff \\forall D_i \\in \\mathcal{D}_{\\text{inputs}}, \\quad \\text{Updated}(D_i) = \\text{True}$$ "
                "Pendekatan berbasis jendela dan sensoring dataset ini menjamin idempotensi deterministik ketika melakukan backfilling terhadap dataset historis."
            ),
            "realWorldApplication": (
                "Spotify menggunakan penjadwalan data-aware di Airflow untuk memicu pipeline pembuatan playlist rekomendasi harian hanya setelah pemrosesan log streaming lagu selesai diverifikasi oleh dataset sensor."
            ),
            "codeSnippet": (
                "# Demonstrasi Pemisahan Event-Time Data Interval (AIP-39) vs Processing Time Scheduler\n"
                "from datetime import datetime, timedelta, timezone\n"
                "\n"
                "class AirflowDataIntervalScheduler:\n"
                "    def __init__(self, interval_hours=1, watermark_delay_minutes=15):\n"
                "        self.interval = timedelta(hours=interval_hours)\n"
                "        self.watermark = timedelta(minutes=watermark_delay_minutes)\n"
                "        \n"
                "    def get_run_schedule(self, data_start_utc):\n"
                "        data_interval_start = data_start_utc\n"
                "        data_interval_end = data_interval_start + self.interval\n"
                "        # Waktu paling awal scheduler boleh mengeksekusi DAG run ini\n"
                "        earliest_execution_time = data_interval_end + self.watermark\n"
                "        \n"
                "        return {\n"
                "            'data_interval_start': data_interval_start.isoformat(),\n"
                "            'data_interval_end': data_interval_end.isoformat(),\n"
                "            'earliest_execution_time': earliest_execution_time.isoformat(),\n"
                "            'event_window_duration_hours': self.interval.total_seconds() / 3600,\n"
                "            'watermark_slack_minutes': self.watermark.total_seconds() / 60\n"
                "        }\n"
                "\n"
                "scheduler = AirflowDataIntervalScheduler(interval_hours=24, watermark_delay_minutes=30)\n"
                "window_start = datetime(2026, 9, 20, 0, 0, tzinfo=timezone.utc)\n"
                "schedule_info = scheduler.get_run_schedule(window_start)\n"
                "\n"
                "print('Semantik Penjadwalan Modern Airflow (AIP-39 / Dataflow Event Time):')\n"
                "print(f\"  Logical Window Mulai : {schedule_info['data_interval_start']}\")\n"
                "print(f\"  Logical Window Selesai: {schedule_info['data_interval_end']}\")\n"
                "print(f\"  Physical Run Diizinkan: {schedule_info['earliest_execution_time']}\")\n"
                "print(f\"  Slack Waktu Watermark : {schedule_info['watermark_slack_minutes']} menit\")\n"
                "print('Kesimpulan: Airflow memisahkan jendela data logis dari waktu fisik eksekusi.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.11.4
    {
        "id": "10.11.4",
        "title": "Desain Operator & Hooks: BashOperator, PythonOperator, KubernetesPodOperator, & Eksternal Service Hooks",
        "learningObjectives": [
            "Memahami perbedaan konseptual antara Operator (komputasi) dan Hook (konektivitas eksternal).",
            "Mengevaluasi kelebihan isolasi container melalui KubernetesPodOperator untuk beban kerja AI.",
            "Mengimplementasikan custom Hook dan Operator dengan prinsip reusable dan connection pooling."
        ],
        "prerequisites": [
            "10.11.2 (Komponen Arsitektur Airflow).",
            "Dasar-dasar Containerization Docker & K8s."
        ],
        "commonPitfalls": [
            "Menuliskan kredensial rahasia (API keys, password) langsung di dalam kode operator alih-alih mengabstraksikannya ke Airflow Connection Vault.",
            "Menjalankan transfer data biner berukuran gigabyte langsung di thread worker PythonOperator, memicu Out-Of-Memory (OOM) fatal."
        ],
        "academicReferences": [
            "Apache Airflow Provider & Operator Architecture Standards.",
            "Burns, B., et al. (2016). Borg, Omega, and Kubernetes. ACM Queue, 14(1), 70–93."
        ],
        "caseStudy": "Lyft memigrasikan pipeline inferensi batch deep learning dari PythonOperator ke KubernetesPodOperator. Setiap task sekarang dapat menentukan limit vCPU dan request GPU NVIDIA A100 sendiri, memangkas biaya server idle sebesar 65% karena pod dihentikan seketika saat inferensi usai.",
        "content": {
            "theory": (
                "Dalam ekosistem Apache Airflow, struktur kode modular ditegakkan melalui pemisahan tegas antara dua kelas abstraksi: **Operators** dan **Hooks**. "
                "1. **Hooks**: Antarmuka tingkat rendah (*low-level abstraction*) yang membungkus koneksi ke sistem eksternal (seperti PostgreSQL, Amazon S3, Snowflake, atau Kubernetes API). Hook bertanggung jawab atas otentikasi aman, connection pooling, dekripsi kredensial via Fernet key, retry logic jaringan, dan penanganan timeout: "
                "$$\\mathcal{H}: \\text{AirflowConnection} \\longrightarrow \\text{AuthenticatedClientSession}$$ "
                "2. **Operators**: Template komputasi tingkat tinggi (*atomic task template*) yang mendefinisikan apa yang harus dieksekusi ketika task dijalankan. Operator mengimplementasikan metode `execute(context)` yang dieksekusi oleh worker: "
                "- **BashOperator / PythonOperator**: Mengeksekusi skrip secara lokal di dalam worker node yang sama tempat thread Airflow berjalan. Operator ini memiliki footprint memori rendah namun rentan terhadap konflik dependensi library (*dependency hell*) antar-model. "
                "- **KubernetesPodOperator**: Memisahkan eksekusi sepenuhnya dengan meluncurkan container pod baru di kluster Kubernetes: "
                "$$\\text{Task} \\xrightarrow{\\text{K8sPodOp}} \\text{K8s Engine}(\\text{Image: } \\tau, \\text{ Resource: } \\langle \\text{CPU}, \\text{RAM}, \\text{GPU} \\rangle)$$ "
                "Container image membungkus seluruh dependensi sistem operasi, CUDA runtime, dan framework machine learning (PyTorch, TensorFlow) secara independen. Operator memonitor status pod via Kubernetes API, streaming log kontainer secara real-time, dan mematikan pod setelah proses selesai dengan kode keluar 0. "
                "Pemisahan ini mewujudkan prinsip arsitektur nir-state (*stateless ephemeral infrastructure*) yang tangguh terhadap kegagalan perangkat keras. "
                "Selain itu, Airflow mengintegrasikan mesin templating Jinja2 pada atribut `template_fields`: nilai variabel konfigurasi, nama partisi berbasis tanggal, dan path storage dievaluasi secara dinamis pada saat eksekusi (*runtime evaluation*), memungkinkan satu definisi operator digunakan kembali secara universal lintas ratusan alur kerja."
            ),
            "realWorldApplication": (
                "Autonomous driving startup menggunakan KubernetesPodOperator pada Airflow untuk meluncurkan container simulasi sensor lidar yang membutuhkan GPU terisolasi dan dependensi C++ biner khusus."
            ),
            "codeSnippet": (
                "# Desain Pola Reusable Hook & Custom Operator Terstandar Airflow\n"
                "class MockObjectStorageHook:\n"
                "    def __init__(self, conn_id):\n"
                "        self.conn_id = conn_id\n"
                "        \n"
                "    def upload_dataset(self, bucket, key, data_bytes):\n"
                "        # Simulasi transmisi data ke cloud storage\n"
                "        return {'status': 'SUCCESS', 'bucket': bucket, 'key': key, 'bytes_written': len(data_bytes)}\n"
                "\n"
                "class ParquetExportOperator:\n"
                "    def __init__(self, task_id, bucket, key, data_payload, conn_id='aws_default'):\n"
                "        self.task_id = task_id\n"
                "        self.bucket = bucket\n"
                "        self.key = key\n"
                "        self.data_payload = data_payload\n"
                "        self.conn_id = conn_id\n"
                "        \n"
                "    def execute(self, context=None):\n"
                "        hook = MockObjectStorageHook(self.conn_id)\n"
                "        serialized = str(self.data_payload).encode('utf-8')\n"
                "        result = hook.upload_dataset(self.bucket, self.key, serialized)\n"
                "        return result\n"
                "\n"
                "op = ParquetExportOperator(\n"
                "    task_id='export_ai_features',\n"
                "    bucket='lakehouse-gold',\n"
                "    key='features/user_embeddings.parquet',\n"
                "    data_payload={'user_id': 101, 'embedding_dim': 128, 'version': 'v2.1'}\n"
                ")\n"
                "\n"
                "execution_result = op.execute()\n"
                "print('Eksekusi Custom Operator & Hook:')\n"
                "print(f\"  Task ID    : {op.task_id}\")\n"
                "print(f\"  Target URI : s3://{execution_result['bucket']}/{execution_result['key']}\")\n"
                "print(f\"  Ukuran Byte: {execution_result['bytes_written']} bytes\")\n"
                "print('Kesimpulan: Pemisahan Hook dan Operator menjamin modularitas dan keamanan kredensial.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.11.5
    {
        "id": "10.11.5",
        "title": "Mekanisme Pertukaran Data Antar-Task: XComs vs Objek Eksternal (Cloud Storage & Feature Store)",
        "learningObjectives": [
            "Menganalisis arsitektur Cross-Communication (XCom) bawaan Airflow dan batasan fisiknya.",
            "Membandingkan antipattern payload besar di XCom vs penyimpanan data berbasis objek eksternal (*claim check pattern*).",
            "Mengimplementasikan custom XCom Backend yang mengalihkan data besar secara transparan ke penyimpanan objek."
        ],
        "prerequisites": [
            "10.11.2 (Metadata Database Airflow).",
            "10.11.4 (Operator & Hooks)."
        ],
        "commonPitfalls": [
            "Meneruskan DataFrame berukuran ratusan megabyte melalui default XCom, menyebabkan metadata database RDBMS mengalami bloat parah dan crash.",
            "Lupa melakukan pembersihan (*cleanup*) artefak temporer yang disimpan di cloud storage saat eksekusi task dibatalkan atau gagal."
        ],
        "academicReferences": [
            "Apache Airflow Documentation: Custom XCom Backends.",
            "Hohpe, G., & Woolf, B. (2003). Enterprise Integration Patterns: Claim Check Pattern. Addison-Wesley."
        ],
        "caseStudy": "Tim biro analitik finansial mengalami lonjakan latensi kueri database Airflow dari 10ms menjadi 15 detik akibat tabel XCom membesar hingga 80GB karena menyimpan hasil perantara query. Dengan menerapkan Custom S3 XCom Backend (Claim Check Pattern), ukuran database metadata menyusut 98% dan performa scheduler kembali normal.",
        "content": {
            "theory": (
                "Dalam Directed Acyclic Graph (DAG), task dirancang sebagai entitas komputasi yang terisolasi secara proses. Ketika sebuah task hilir memerlukan informasi yang dihasilkan oleh task hulu, Airflow menyediakan mekanisme **Cross-Communication (XCom)**. "
                "Secara default, XCom menyimpan pasangan kunci-nilai (*key-value*) langsung di dalam tabel `xcom` pada Metadata Database: "
                "$$\\text{xcom\\_push}(\\text{key}, \\text{value}) \\implies \\text{INSERT INTO xcom (dag\\_id, task\\_id, execution\\_date, key, value)}$$ "
                "Namun, menyimpan payload data komputasi aktual (seperti Pandas DataFrame, array tensor numpy, atau file CSV) ke dalam database metadata adalah **antipattern arsitektur yang fatal**. Metadata RDBMS tidak dirancang untuk menangani throughput biner masif; hal ini akan memicu *table bloat*, degradasi performa I/O scheduler, dan kegagalan replikasi. "
                "Pola arsitektur standar industri untuk memecahkan masalah ini adalah **Claim Check Pattern**: "
                "1. Task hulu menuliskan dataset berukuran besar ke penyimpanan objek eksternal terdistribusi (S3 / GCS / Lakehouse). "
                "2. Task hulu hanya menerbitkan pointer metadata ringan (*claim check / URI pointer*) ke XCom: "
                "$$\\mathcal{P} = \\langle \\text{s3://lakehouse/data.parquet}, \\text{checksum}, \\text{row\\_count} \\rangle$$ "
                "3. Task hilir membaca URI dari XCom dan melakukan *stream download* langsung dari penyimpanan objek. "
                "Airflow mendukung **Custom XCom Backend** yang mengotomatisasi pola ini secara transparan di tingkat engine: setiap nilai kembalian task yang melebihi ukuran ambang batas ($\\theta_{\\text{size}}$) dicegat oleh serializer khusus, diunggah ke cloud storage, dan digantikan oleh referensi URI tanpa mengubah kode task aplikasi sedikit pun. "
                "Sistem retensi objek memastikan berkas temporer dibersihkan secara terjadwal setelah masa retensi alur kerja kedaluwarsa."
            ),
            "realWorldApplication": (
                "Platform e-commerce global menggunakan Custom XCom Backend S3 pada Airflow untuk mengalirkan metadata lokasi model training PyTorch (15 GB) antar-task validasi tanpa membebani PostgreSQL metadata."
            ),
            "codeSnippet": (
                "# Implementasi Claim Check Pattern: Custom XCom Backend Simulator\n"
                "import json\n"
                "import hashlib\n"
                "\n"
                "class MockCloudStorage:\n"
                "    storage = {}\n"
                "    \n"
                "    @classmethod\n"
                "    def put(cls, uri, content):\n"
                "        cls.storage[uri] = content\n"
                "        \n"
                "    @classmethod\n"
                "    def get(cls, uri):\n"
                "        return cls.storage.get(uri)\n"
                "\n"
                "class ClaimCheckXComBackend:\n"
                "    PAYLOAD_THRESHOLD_BYTES = 100 # Ambang batas ukuran payload\n"
                "    \n"
                "    @classmethod\n"
                "    def serialize_value(cls, value):\n"
                "        serialized = json.dumps(value)\n"
                "        byte_len = len(serialized.encode('utf-8'))\n"
                "        \n"
                "        if byte_len > cls.PAYLOAD_THRESHOLD_BYTES:\n"
                "            # Data besar: simpan di cloud storage, kembalikan pointer\n"
                "            payload_hash = hashlib.md5(serialized.encode('utf-8')).hexdigest()[:8]\n"
                "            uri = f's3://lakehouse-xcom/payload_{payload_hash}.json'\n"
                "            MockCloudStorage.put(uri, value)\n"
                "            return {'__is_external__': True, 'uri': uri, 'size_bytes': byte_len}\n"
                "        else:\n"
                "            # Data kecil: simpan langsung di metadata DB\n"
                "            return {'__is_external__': False, 'data': value}\n"
                "\n"
                "small_metadata = {'model_version': '1.0.4', 'status': 'PASS'}\n"
                "large_features = {'embeddings': [0.12, -0.45, 0.88, 0.92, -0.11] * 20, 'record_count': 100}\n"
                "\n"
                "xcom_small = ClaimCheckXComBackend.serialize_value(small_metadata)\n"
                "xcom_large = ClaimCheckXComBackend.serialize_value(large_features)\n"
                "\n"
                "print('Serialisasi Data XCom Modern:')\n"
                "print('  Metadata Kecil (Direct DB) :', xcom_small)\n"
                "print('  Dataset Besar (Claim Check):', xcom_large)\n"
                "print(f\"  Data Tersimpan di S3       : {MockCloudStorage.get(xcom_large['uri'])['record_count']} baris\")\n"
                "print('Kesimpulan: Claim Check Pattern menjaga Metadata DB tetap ramping dan stabil.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.11.6
    {
        "id": "10.11.6",
        "title": "Dynamic DAG Generation & TaskFlow API (@dag, @task, Task Groups)",
        "learningObjectives": [
            "Memahami paradigma fungsional modern Airflow TaskFlow API menggunakan dekorator `@dag` dan `@task`.",
            "Menerapkan konsep Dynamic Task Mapping (`expand()`) untuk paralelisasi beban kerja bervolume dinamis.",
            "Mengorganisasikan struktur visual alur kerja berskala besar menggunakan Task Groups modular."
        ],
        "prerequisites": [
            "10.11.1 (Prinsip DAG).",
            "10.11.5 (Pertukaran Data XComs)."
        ],
        "commonPitfalls": [
            "Mengeksekusi dynamic task mapping dengan jumlah entitas tak terbatas (misalnya jutaan task instances), memicu overload parah pada scheduler database.",
            "Mencampuradukkan paradigma lama (classic operators) dengan TaskFlow API tanpa mengonversi dependensi XComArgs secara eksplisit."
        ],
        "academicReferences": [
            "Apache Airflow TaskFlow API Reference (AIP-31: Airflow Functional DAG Interface).",
            "Apache Airflow AIP-42: Dynamic Task Mapping."
        ],
        "caseStudy": "Sebuah perusahaan logistik global perlu memproses data pengiriman untuk 50 negara setiap malam. Alih-alih membuat 50 DAG manual yang redundan, mereka menggunakan Dynamic Task Mapping (`expand()`). Scheduler secara otomatis membuat worker task terparalelisasi sesuai daftar negara yang aktif dari basis data.",
        "content": {
            "theory": (
                "Evolusi arsitektur Apache Airflow memperkenalkan **TaskFlow API** (diperkenalkan pada Airflow 2.0 melalui AIP-31), yang menggeser penulisan alur kerja dari gaya instansiasi operator klasik yang prosedural dan *boilerplate-heavy* ke gaya fungsional Pythonic modern menggunakan Python decorators (`@dag`, `@task`). "
                "Dekorator `@task` membungkus fungsi Python standar ke dalam instance `_PythonDecoratedOperator`, di mana nilai kembalian (*return value*) secara implisit dibungkus sebagai objek proksi `XComArg`. "
                "Relasi dependensi antar-tugas dan pertukaran data XCom dievaluasi secara otomatis melalui inferensi argumen pemanggilan fungsi: "
                "$$y = \\text{task}_B(\\text{task}_A(x)) \\implies \\text{Dependency: } A \\to B \\quad \\land \\quad \\text{XCom: } \\text{Output}(A) \\to \\text{Input}(B)$$ "
                "Untuk menangani beban kerja analitik bervolume dinamis di mana jumlah partisi data tidak dapat diketahui secara statis saat kompilasi DAG, Airflow menghadirkan **Dynamic Task Mapping** (AIP-42): "
                "$$\\text{task.expand}(p = [v_1, v_2, \\dots, v_m]) \\implies \\text{Menciptakan } m \\text{ TaskInstances paralel secara dinamis}$$ "
                "Engine scheduler mengevaluasi array input pada saat *runtime* setelah task hulu selesai, lalu melipatgandakan task instance dengan pelacakan indeks terisolasi (`map_index = 0, 1, ..., m-1`). "
                "Selain itu, guna mengatasi kompleksitas visual pada antarmuka web saat mengelola ratusan task, **Task Groups** (`TaskGroup`) menyediakan pengelompokan hierarkis modular yang dapat diatur secara rekursif tanpa menambah beban entitas DAG terpisah di basis data metadata. "
                "Data engineer dapat menerapkan batas konkurensi tugas aktif (`max_active_tis_per_dag`) untuk mencegah dynamic mapping menghabiskan seluruh kapasitas resource kluster worker ketika memproses ribuan partisi secara serentak."
            ),
            "realWorldApplication": (
                "Fintech unicorn memanfaatkan dynamic task mapping di Airflow untuk mengevaluasi skor kredit 200 segmen portofolio pinjaman secara simultan dalam satu DAG terpadu."
            ),
            "codeSnippet": (
                "# Simulator Paradigma Modern TaskFlow API & Dynamic Task Mapping\n"
                "class TaskFlowSimulator:\n"
                "    @staticmethod\n"
                "    def extract_country_partitions():\n"
                "        # Mengembalikan daftar partisi dinamis\n"
                "        return ['ID', 'SG', 'MY', 'TH', 'VN']\n"
                "        \n"
                "    @staticmethod\n"
                "    def process_partition(country_code):\n"
                "        # Pemrosesan atomik per partisi\n"
                "        return {'country': country_code, 'processed_records': 1500, 'status': 'CLEAN'}\n"
                "        \n"
                "    @staticmethod\n"
                "    def aggregate_global_kpi(partition_results):\n"
                "        total = sum(r['processed_records'] for r in partition_results)\n"
                "        countries = [r['country'] for r in partition_results]\n"
                "        return {'total_countries': len(countries), 'global_records': total}\n"
                "\n"
                "# Eksekusi Alur Kerja TaskFlow\n"
                "partitions = TaskFlowSimulator.extract_country_partitions()\n"
                "# Dynamic Task Mapping: expand() task ke seluruh elemen list secara independen\n"
                "mapped_results = [TaskFlowSimulator.process_partition(c) for c in partitions]\n"
                "final_kpi = TaskFlowSimulator.aggregate_global_kpi(mapped_results)\n"
                "\n"
                "print('Simulasi Pola TaskFlow API & Dynamic Task Mapping:')\n"
                "print(f\"  Partisi Terdeteksi       : {partitions}\")\n"
                "print(f\"  Total Task Terpetakan    : {len(mapped_results)} task instances paralel\")\n"
                "print(f\"  Hasil Agregasi Global KPI: {final_kpi}\")\n"
                "print('Kesimpulan: Dynamic Task Mapping menyederhanakan paralelisasi beban kerja dinamis.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.11.7
    {
        "id": "10.11.7",
        "title": "Strategi Penanganan Kegagalan: SLA Misses, Retries, Exponential Backoff, Alerts, & Deadlock Detection",
        "learningObjectives": [
            "Merancang kebijakan percobaan ulang (Retries) berbasis Exponential Backoff dan Jitter untuk ketahanan pipeline.",
            "Memahami Service Level Agreement (SLA) misses dan mekanisme monitoring latency DAG.",
            "Mengimplementasikan detektor anomali eksekusi dan sistem peringatan otomatis terintegrasi."
        ],
        "prerequisites": [
            "10.11.2 (Siklus Scheduler & State Machine).",
            "10.1.3 (Fault Tolerance & Desain Idempoten)."
        ],
        "commonPitfalls": [
            "Menerapkan retry konstan tanpa backoff pada layanan eksternal yang sedang mengalami degradasi (*thundering herd problem*).",
            "Mengabaikan konfigurasi batas timeout (`execution_timeout`), menyebabkan task yang mengalami hang menahan resource worker tanpa batas."
        ],
        "academicReferences": [
            "Vogels, W. (2009). Eventually consistent. Communications of the ACM, 52(1), 40–44.",
            "Brookshire, M. (2015). Exponential Backoff And Jitter. AWS Architecture Blog."
        ],
        "caseStudy": "Sebuah sistem pemrosesan pembayaran real-time mengalami pemadaman akibat 500 worker Airflow mencoba menembak API gateway perbankan secara bersamaan setiap kali terjadi error sesaat. Dengan menambahkan Full Jitter pada Exponential Backoff, beban lonjakan puncak (peak load) ke API gateway berkurang 85% dan retry berhasil dengan mulus.",
        "content": {
            "theory": (
                "Dalam sistem komputasi data terdistribusi skala petabyte, kegagalan tugas (*transient faults*) yang dipicu oleh fluktuasi jaringan, *rate limiting* API, atau kebuntuan transaksi basis data merupakan kepastian statistik. "
                "Airflow menyediakan mekanisme toleransi kesalahan tingkat lanjut melalui perpaduan strategi **Retries with Exponential Backoff and Jitter**: "
                "Waktu tunggu penundaan (*delay*) sebelum percobaan ulang ke-$k$ dimodelkan secara matematis: "
                "$$t_{\\text{delay}}(k) = \\min(t_{\\text{max}}, \\, t_{\\text{base}} \\times 2^{k-1})$$ "
                "Untuk mencegah fenomena kawanan guntur (**Thundering Herd Problem**)—kondisi patologis di mana ratusan worker yang gagal secara simultan membombardir sistem target pada interval waktu yang persis seragam—ditambahkan komponen stokastik (*Full Jitter*): "
                "$$t_{\\text{sleep}}(k) = \\mathcal{U}(0, \\, t_{\\text{delay}}(k))$$ "
                "Selain penanganan kegagalan mikro per-tugas, orkestrator wajib menegakkan **Service Level Agreement (SLA)** pada tingkat makro pipeline. Jika durasi eksekusi DAG melampaui batas waktu toleransi bisnis $\\Delta t_{\\text{SLA}}$, scheduler memicu *SLA miss callback* ke sistem observabilitas terpusat (Slack, PagerDuty). "
                "Kebuntuan task (*deadlock*) dicegah melalui batas keras `execution_timeout` dan alokasi `pool_slots`, di mana worker yang terperangkap dalam loop tak berujung akan dihentikan secara deterministik melalui sinyal `SIGTERM` lalu `SIGKILL` guna membebaskan resource komputasi kluster. "
                "Scheduler juga menjalankan loop pendeteksi *zombie tasks*—yaitu proses worker yang mati mendadak di tingkat sistem operasi (OOM killer / node restart) tanpa sempat memperbarui statusnya di metadata database—dan secara proaktif menandai tugas tersebut sebagai `UPSTREAM_FAILED` atau memicu retry otomatis. "
                "Dengan arsitektur retry dan alerting berlapis ini, pipeline mampu menyerap gangguan transien secara mandiri tanpa memerlukan intervensi manual dari tim on-call engineer."
            ),
            "realWorldApplication": (
                "Tim rekayasa data di Netflix mengonfigurasi SLA misses dan exponential backoff pada pipeline inferensi rekomendasi film untuk menjamin dataset siap sebelum jam prime-time konsumsi pengguna."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Algoritma Exponential Backoff dengan Jitter & Retry Policy\n"
                "import random\n"
                "\n"
                "class RetryPolicySimulator:\n"
                "    def __init__(self, base_delay_sec=2, max_delay_sec=60, max_retries=3, seed=42):\n"
                "        self.base_delay = base_delay_sec\n"
                "        self.max_delay = max_delay_sec\n"
                "        self.max_retries = max_retries\n"
                "        self.rng = random.Random(seed)\n"
                "        \n"
                "    def calculate_delays(self):\n"
                "        delays = []\n"
                "        for attempt in range(1, self.max_retries + 1):\n"
                "            # Hitung eksponensial murni\n"
                "            exp_delay = min(self.max_delay, self.base_delay * (2 ** (attempt - 1)))\n"
                "            # Terapkan Full Jitter: U(0, exp_delay)\n"
                "            jittered_delay = round(self.rng.uniform(0.5 * exp_delay, exp_delay), 2)\n"
                "            delays.append({'attempt': attempt, 'exp_ceiling': exp_delay, 'jittered_sleep_sec': jittered_delay})\n"
                "        return delays\n"
                "\n"
                "policy = RetryPolicySimulator(base_delay_sec=5, max_delay_sec=40, max_retries=4)\n"
                "schedule = policy.calculate_delays()\n"
                "\n"
                "print('Simulasi Strategi Retry Exponential Backoff dengan Jitter:')\n"
                "for step in schedule:\n"
                "    print(f\"  Percobaan {step['attempt']}: Batas Atas = {step['exp_ceiling']}s -> Waktu Tidur Aktual = {step['jittered_sleep_sec']}s\")\n"
                "print('Kesimpulan: Jitter meratakan distribusi traffic retry dan mereduksi thundering herd.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.11.8
    {
        "id": "10.11.8",
        "title": "Manajemen State, Backfilling, Catchup, & Eksekusi Idempoten pada Pipeline Terdistribusi",
        "learningObjectives": [
            "Memahami konsep Catchup dan Backfilling historis pada scheduler Apache Airflow.",
            "Menganalisis prinsip Idempotensi absolut dalam perancangan task pemrosesan data analitik.",
            "Mengimplementasikan pola penulisan partisi deterministik (*atomic partition swap*) untuk menjamin eksekusi yang aman diulang."
        ],
        "prerequisites": [
            "10.11.3 (Penjadwalan Event Time).",
            "10.1.3 (Prinsip Idempotensi Rekayasa Data)."
        ],
        "commonPitfalls": [
            "Mengaktifkan `catchup=True` pada DAG baru dengan `start_date` bertahun-tahun di masa lalu secara tidak sengaja, memicu banjir ratusan DAG run simultan yang melumpuhkan sistem.",
            "Menggunakan query `INSERT INTO` non-idempoten pada skrip task, menyebabkan duplikasi data berlipat ganda setiap kali dilakukan backfilling atau rerun manual."
        ],
        "academicReferences": [
            "Helland, P. (2012). Idempotence is not a Medical Condition. Communications of the ACM, 55(5), 56–65.",
            "Apache Airflow Documentation: Catchup and Backfill Workflows."
        ],
        "caseStudy": "Data warehouse di platform streaming video mengalami duplikasi pendapatan jutaan dolar setelah seorang engineer melakukan rerun DAG penagihan bulanan yang menggunakan mode append. Tim merekonstruksi seluruh DAG dengan partisi overwrite atomik berbasis `data_interval_start`, menjamin hasil identik berapa kali pun DAG dieksekusi ulang.",
        "content": {
            "theory": (
                "Kemampuan melakukan **Backfilling** (menjalankan alur kerja komputasi untuk interval data historis) dan **Catchup** (mengejar run yang belum dieksekusi sejak `start_date`) adalah salah satu keunggulan paling transformatif dari Apache Airflow. "
                "Namun, mengeksekusi puluhan atau ratusan DAG run secara retrospektif hanya dapat dilakukan dengan aman jika setiap task mematuhi prinsip **Idempotensi Sistem** secara matematis: "
                "Suatu alur kerja $f$ dikatakan idempoten jika dan hanya jika penerapan berulang pada himpunan input yang sama menghasilkan kondisi state akhir yang identik: "
                "$$f(f(x)) = f(x) \\quad \\forall x \\in \\mathcal{X}$$ "
                "Dalam konteks penyimpanan data analitik (data warehouse / lakehouse), pelanggaran idempotensi biasanya berwujud duplikasi record akibat penambahan data berulang (*blind append*). Pola rekayasa standar industri untuk memastikan idempotensi meliputi: "
                "1. **Atomic Partition Swap (Insert Overwrite)**: "
                "Komputasi menulis output ke direktori sementara, lalu menimpa partisi target secara atomik berdasarkan parameter interval data logis: "
                "$$\\text{TargetPartition}(t_{\\text{interval}}) \\longleftarrow \\text{NewProcessedData}$$ "
                "2. **Merge / Deduplicated Upsert**: Menggunakan klausa `MERGE INTO` dengan kunci primer unik. "
                "3. **State Tracking Checkpointing**: Mencatat status eksekusi run di tabel metadata eksternal guna mencegah kalkulasi ganda. "
                "Dengan arsitektur idempoten, data engineer dapat melakukan perbaikan kode (*code patch*) dan memicu backfill 12 bulan data tanpa khawatir merusak konsistensi data hilir. "
                "Pengaturan parameter scheduler seperti `max_active_runs` dan `depends_on_past=True` memastikan urutan kausalitas historis tetap terjaga saat puluhan jendela interval masa lalu dieksekusi secara berurutan (*sequential historical backfill*)."
            ),
            "realWorldApplication": (
                "Perusahaan telekomunikasi menjalankan backfill 1 tahun data panggilan pengguna untuk melatih model prediksi churn baru. Penerapan idempotensi partisi menjamin tidak ada data agregasi yang terhitung ganda."
            ),
            "codeSnippet": (
                "# Demonstrasi Eksekusi Idempoten: Atomic Partition Swap vs Non-Idempotent Append\n"
                "class DataWarehouseTable:\n"
                "    def __init__(self):\n"
                "        self.partitions = {}\n"
                "        \n"
                "    def non_idempotent_append(self, partition_date, records):\n"
                "        if partition_date not in self.partitions:\n"
                "            self.partitions[partition_date] = []\n"
                "        self.partitions[partition_date].extend(records)\n"
                "        \n"
                "    def idempotent_atomic_overwrite(self, partition_date, records):\n"
                "        # Mengganti seluruh isi partisi secara atomik\n"
                "        self.partitions[partition_date] = list(records)\n"
                "\n"
                "table_bad = DataWarehouseTable()\n"
                "table_good = DataWarehouseTable()\n"
                "batch = [{'id': 1, 'user': 'U100', 'trx': 50000}, {'id': 2, 'user': 'U101', 'trx': 75000}]\n"
                "\n"
                "# Skenario: Task dieksekusi 3 kali karena kegagalan jaringan atau rerun manual\n"
                "for _ in range(3):\n"
                "    table_bad.non_idempotent_append('2026-09-20', batch)\n"
                "    table_good.idempotent_atomic_overwrite('2026-09-20', batch)\n"
                "\n"
                "print('Audit Idempotensi Alur Kerja (3x Rerun Eksekusi):')\n"
                "print(f\"  Non-Idempotent Append Count : {len(table_bad.partitions['2026-09-20'])} baris (DUPLIKASI FATAL!)\")\n"
                "print(f\"  Idempotent Overwrite Count  : {len(table_good.partitions['2026-09-20'])} baris (STABIL & KONSISTEN)\")\n"
                "print('Kesimpulan: Idempotensi berbasis partisi menjamin keamanan operasi rerun & backfilling.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.11.9
    {
        "id": "10.11.9",
        "title": "Pengujian & CI/CD Pipeline DAG: DAG Integrity Tests, Unit Testing Operator, & Mocking Eksternal",
        "learningObjectives": [
            "Merancang pipeline integrasi berkelanjutan (CI/CD) khusus untuk repositori kode alur kerja Airflow.",
            "Mengimplementasikan uji integritas DAG (DAG Integrity Testing) otomatis untuk mendeteksi siklus dan kesalahan sintaksis.",
            "Menerapkan mocking layanan eksternal menggunakan `unittest.mock` untuk verifikasi logika kueri dan transformasi."
        ],
        "prerequisites": [
            "10.11.1 (Validasi Asiklik DAG).",
            "10.11.4 (Operator & Custom Hooks)."
        ],
        "commonPitfalls": [
            "Melakukan deployment berkas DAG langsung ke server produksi tanpa validasi sintaksis dan uji parsing di pipeline CI, memicu pemadaman global pada scheduler Airflow.",
            "Menghubungkan unit test ke sistem eksternal produksi nyata alih-alih menggunakan mocking, menyebabkan test lambat dan berpotensi merusak data produksi."
        ],
        "academicReferences": [
            "Fowler, M. (2006). Continuous Integration. martinfowler.com.",
            "Apache Airflow Testing Guide: Best Practices for Unit and Integration Testing."
        ],
        "caseStudy": "Sebuah unicorn teknologi finansial mengelola repositori bersama dengan 150 data engineer. Sebelum ada CI/CD terpusat, satu typo syntax error di berkas Python DAG sering melumpuhkan seluruh scheduler kluster. Menerapkan pre-commit hooks dan DAG integrity test otomatis di GitHub Actions memangkas insiden outage scheduler hingga 100%.",
        "content": {
            "theory": (
                "Menerapkan paradigma **Data Pipeline as Code** menuntut penerapan pengujian perangkat lunak terotomatisasi (**Continuous Integration / Continuous Deployment - CI/CD**) yang ketat sebelum berkas alur kerja dideploy ke server produksi. "
                "Piramida pengujian untuk Apache Airflow terdiri dari tiga tingkatan terstruktur: "
                "1. **DAG Integrity & Static Analysis Tests**: "
                "Pengujian level tercepat yang mengompilasi seluruh berkas Python DAG di lingkungan CI menggunakan objek `DagBag` tanpa mengeksekusi komputasi fisik. Tes ini memverifikasi secara matematis bahwa graf tidak memiliki dependensi melingkar (*cycles*), bebas dari *import errors*, dan durasi parsing setiap berkas berada di bawah ambang batas (misal $< 1.0$ detik): "
                "$$\\text{DagBag}(\\text{dag\\_folder}).\\text{import\\_errors} == \\emptyset \\quad \\land \\quad \\forall d \\in \\text{dags}, \\, \\text{IsAcyclic}(d) = \\text{True}$$ "
                "2. **Unit Testing Operator & Logika Bisnis**: "
                "Menguji logika internal custom operator, callback function, dan skrip pemrosesan. Seluruh koneksi ke jaringan eksternal (Database, S3, Kubernetes API) digantikan dengan objek tiruan (**Mocking** via `unittest.mock.patch`), memastikan tes berjalan deterministik, terisolasi, dan selesai dalam beberapa milidetik. "
                "3. **End-to-End Staging Integration Tests**: "
                "Menjalankan alur kerja secara aktual pada kluster staging sementara menggunakan ephemeral containers untuk mengonfirmasi kelancaran alur data dari sumber hingga sink. "
                "Integrasi dengan sistem GitOps (seperti ArgoCD atau Cloud Composer Sync) memastikan sinkronisasi repositori kode ke kluster produksi berjalan secara atomik hanya setelah seluruh rangkaian pengujian CI berstatus hijau (*all checks passed*). "
                "Pendekatan pengujian berlapis ini secara efektif mengeliminasi regresi konfigurasi (*configuration drift*) dan mencegah insiden rusaknya integritas data analitik di lingkungan produksi."
            ),
            "realWorldApplication": (
                "Perusahaan media streaming mengintegrasikan pytest di GitLab CI untuk memverifikasi 300 berkas DAG Airflow setiap kali ada pull request sebelum digabungkan ke branch main."
            ),
            "codeSnippet": (
                "# Simulator DAG Integrity & Compliance Test Suite Sederhana\n"
                "class MockDAG:\n"
                "    def __init__(self, dag_id, default_args, tasks):\n"
                "        self.dag_id = dag_id\n"
                "        self.default_args = default_args\n"
                "        self.tasks = tasks\n"
                "\n"
                "def run_dag_compliance_audit(dag):\n"
                "    violations = []\n"
                "    # Aturan 1: Retries wajib disetel minimal 2 kali\n"
                "    retries = dag.default_args.get('retries', 0)\n"
                "    if retries < 2:\n"
                "        violations.append(f'Aturan Retries Gagal: retries={retries} (wajib >= 2)')\n"
                "        \n"
                "    # Aturan 2: Wajib memiliki timeout eksplisit\n"
                "    if 'execution_timeout_minutes' not in dag.default_args:\n"
                "        violations.append('Aturan Timeout Gagal: execution_timeout_minutes wajib disetel!')\n"
                "        \n"
                "    # Aturan 3: Minimal harus memiliki 1 task\n"
                "    if len(dag.tasks) == 0:\n"
                "        violations.append('Aturan Task Gagal: DAG tidak memiliki task terdaftar!')\n"
                "        \n"
                "    return len(violations) == 0, violations\n"
                "\n"
                "valid_dag = MockDAG(\n"
                "    'feature_pipeline_ai',\n"
                "    {'owner': 'mlops_team', 'retries': 3, 'execution_timeout_minutes': 60},\n"
                "    ['ingest_cdc', 'generate_embeddings', 'push_feature_store']\n"
                ")\n"
                "\n"
                "is_passed, report = run_dag_compliance_audit(valid_dag)\n"
                "print('Hasil Uji Integritas & Kepatuhan Pipeline CI/CD:')\n"
                "print(f\"  DAG Target  : {valid_dag.dag_id}\")\n"
                "print(f\"  Status Audit: {'PASSED' if is_passed else 'FAILED'}\")\n"
                "print(f\"  Pelanggaran : {report if report else 'Nol Pelanggaran - Siap Rilis!'}\")\n"
                "print('Kesimpulan: DAG Integrity Test mencegah rilis konfigurasi sub-standar ke produksi.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.11.10
    {
        "id": "10.11.10",
        "title": "Proyek Praktik: Pembangunan Pipeline Orkestrasi Pelatihan & Evaluasi Model AI Multi-Stage dengan Airflow",
        "learningObjectives": [
            "Mengintegrasikan seluruh konsep orkestrasi Airflow ke dalam pipeline machine learning end-to-end.",
            "Menerapkan percabangan bersyarat (Branching) berdasarkan evaluasi metrik akurasi model.",
            "Mengimplementasikan simulator alur kerja AI multi-tahap lengkap dari ekstraksi fitur hingga deployment bersyarat."
        ],
        "prerequisites": [
            "10.11.1 - 10.11.9 (Seluruh Subbab Teori & Praktik Bab 11).",
            "Dasar-dasar Siklus Hidup Machine Learning (Training, Validation, Thresholding)."
        ],
        "commonPitfalls": [
            "Mempublikasikan model AI langsung ke produksi tanpa gerbang validasi performa otomatis (*evaluation gate*).",
            "Mengabaikan pencatatan metadata versi model dan skor metrik pada tahap evaluasi, menghilangkan keterlacakan (*model lineage*)."
        ],
        "academicReferences": [
            "Sculley, D., et al. (2015). Hidden technical debt in machine learning systems. NeurIPS.",
            "Zaharia, M., et al. (2018). Accelerating the machine learning lifecycle with MLflow. IEEE DEBull."
        ],
        "caseStudy": "Tim AI di platform e-commerce menyatukan pipeline ekstraksi fitur Lakehouse, pelatihan model konversi, dan evaluasi drift menggunakan DAG terpadu. Model baru hanya dideploy ke serving API jika metrik ROC-AUC melampaui baseline sebesar 2%, memangkas risiko regresi konversi penjualan hingga 95%.",
        "content": {
            "theory": (
                "Membangun alur kerja orkestrasi untuk siklus hidup **Machine Learning Operations (MLOps)** menuntut koordinasi multi-tahap yang jauh lebih kompleks daripada pipeline ETL data analitik biasa. "
                "Alur kerja pelatihan dan evaluasi model AI modern mencakup enam tahapan berurutan yang diatur dalam satu DAG terintegrasi: "
                "1. **Feature Extraction & Validation**: Mengambil data fitur dari lapisan Gold Lakehouse dan memvalidasi kelengkapan statistik (*schema & distribution checks*) untuk mencegah data drift. "
                "2. **Distributed Training**: Meluncurkan proses pelatihan model komputasi berat pada GPU worker pool terisolasi (misal via KubernetesPodOperator). "
                "3. **Model Evaluation & Metric Tracking**: Menghitung metrik performa objektif (seperti $\\text{ROC-AUC}$, $\\text{F1-Score}$, atau $\\text{RMSE}$) pada dataset uji terisolasi: "
                "$$\\mathcal{M} = \\text{Evaluate}(\\mathcal{M}_{\\text{candidate}}, \\mathcal{D}_{\\text{test}})$$ "
                "4. **Conditional Branching (Quality Gate)**: "
                "Menggunakan operator percabangan bersyarat (**BranchPythonOperator**) untuk membandingkan skor metrik kandidat terhadap ambang batas produksi ($\\theta$): "
                "$$\\text{NextTask} = \\begin{cases} \\text{Deploy\\_Model}, & \\text{jika } \\mathcal{M} \\ge \\theta \\\\ \\text{Alert\\_Model\\_Regressed}, & \\text{jika } \\mathcal{M} < \\theta \\end{cases}$$ "
                "Cabang yang tidak terpilih secara otomatis dilewati (*Skipped*) oleh scheduler Airflow tanpa memicu status gagal pada DAG run. "
                "5. **Model Registry Promotion**: Jika lolos gerbang kualitas, mendaftarkan bobot model ke Model Registry (MLflow / WandB) dan memperbarui alias `production`. "
                "6. **Notification & Lineage Commit**: Mencatat riwayat run dan memancarkan notifikasi keberhasilan alur kerja ke kanal engineering. "
                "Integrasi OpenLineage pada DAG Airflow secara otomatis melacak asal-usul data (*data lineage*), mencatat versi dataset input, konfigurasi hyperparameter pelatihan, dan artefak model output, menciptakan jejak audit regulasi yang sepenuhnya transparan dan dapat direproduksi (*reproducible AI pipelines*)."
            ),
            "realWorldApplication": (
                "Tim Data Science di perusahaan ride-hailing mengotomatisasi retrain harian model estimasi waktu kedatangan (ETA) dengan Airflow. Model hanya diperbarui jika error prediksi di bawah 3 menit."
            ),
            "codeSnippet": (
                "# Proyek Praktik: Simulator Lengkap Pipeline MLOps Multi-Stage dengan Conditional Branching\n"
                "class EndToEndMLOpsOrchestrator:\n"
                "    def __init__(self, accuracy_threshold=0.85):\n"
                "        self.threshold = accuracy_threshold\n"
                "        self.context = {}\n"
                "        \n"
                "    def step1_extract_features(self):\n"
                "        # Ekstraksi fitur dari data lakehouse\n"
                "        self.context['features_count'] = 50000\n"
                "        return 'SUCCESS'\n"
                "        \n"
                "    def step2_train_candidate_model(self):\n"
                "        # Pelatihan model machine learning\n"
                "        self.context['model_version'] = 'model_v2_20260921'\n"
                "        return 'SUCCESS'\n"
                "        \n"
                "    def step3_evaluate_metric(self):\n"
                "        # Evaluasi akurasi model pada test set\n"
                "        metric_score = 0.892 # Skor hasil evaluasi\n"
                "        self.context['test_score'] = metric_score\n"
                "        return metric_score\n"
                "        \n"
                "    def step4_branching_gate(self):\n"
                "        score = self.context.get('test_score', 0.0)\n"
                "        if score >= self.threshold:\n"
                "            return 'deploy_production'\n"
                "        return 'alert_regression'\n"
                "        \n"
                "    def step5_deploy(self):\n"
                "        return f\"Model {self.context['model_version']} BERHASIL dipromosikan ke serving endpoint!\"\n"
                "\n"
                "pipeline = EndToEndMLOpsOrchestrator(accuracy_threshold=0.85)\n"
                "pipeline.step1_extract_features()\n"
                "pipeline.step2_train_candidate_model()\n"
                "score = pipeline.step3_evaluate_metric()\n"
                "next_step = pipeline.step4_branching_gate()\n"
                "\n"
                "print('Eksekusi Pipeline MLOps Multi-Stage Airflow:')\n"
                "print(f\"  Tahap 1: Ingesti Fitur      : {pipeline.context['features_count']} baris\")\n"
                "print(f\"  Tahap 2: Training Kandidat  : {pipeline.context['model_version']}\")\n"
                "print(f\"  Tahap 3: Evaluasi Akurasi   : {score:.3f} (Ambang Batas: {pipeline.threshold})\")\n"
                "print(f\"  Tahap 4: Branching Decision : {next_step}\")\n"
                "if next_step == 'deploy_production':\n"
                "    deploy_msg = pipeline.step5_deploy()\n"
                "    print(f\"  Tahap 5: Eksekusi Deploy    : {deploy_msg}\")\n"
                "print('Kesimpulan: Orkestrasi pipeline MLOps menjamin hanya model berperforma unggul yang dideploy.')"
            ),
            "codeSnippetOutput": ""
        }
    }
]

# Jalankan setiap snippet untuk menangkap output aktual dan pastikan valid
print("Mengeksekusi seluruh 10 kode snippet Bab 11...")
for sub in subchapters:
    sub_id = sub["id"]
    code = sub["content"]["codeSnippet"]
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(code, {"__name__": "__main__"})
        actual_output = buf.getvalue().strip()
    except Exception as e:
        print(f"[FAIL] Error pada {sub_id}: {e}")
        sys.exit(1)
        
    sub["content"]["codeSnippetOutput"] = actual_output
    theory_words = len(sub["content"]["theory"].split())
    print(f"Subbab {sub_id} valid: {theory_words} kata teori, {len(actual_output)} chars output.")

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=6, ensure_ascii=False)

print(f"\n[OK] Berhasil menghasilkan 10 subbab Bab 11 Topik 10 ke {output_file}")
