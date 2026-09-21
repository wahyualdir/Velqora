import json
import os
import sys
import io
import numpy as np

output_file = os.path.join(os.path.dirname(__file__), "de_ch9_data.json")

subchapters = [
    # 10.9.1
    {
        "id": "10.9.1",
        "title": "Paradigma Stream Processing: Micro-batching vs Native Event-Driven Streaming",
        "learningObjectives": [
            "Membandingkan karakteristik arsitektural antara pendekatan Micro-batching (Spark) dan Native Event-Driven Streaming (Flink).",
            "Menganalisis trade-off laten antara throughput maksimum data per detik vs latensi sub-milidetik pemrosesan pesan tunggal.",
            "Mengimplementasikan simulator perbandingan pemrosesan batch interval teratur dengan pemrosesan record-by-record instan."
        ],
        "prerequisites": [
            "10.1.4 (Batch vs Streaming).",
            "10.8.1 (Event Streaming & Kafka Log)."
        ],
        "commonPitfalls": [
            "Memaksa menggunakan engine micro-batching dengan interval 10 ms untuk sistem trading berkecepatan tinggi, memicu CPU thrashing akibat overhead penjadwalan task.",
            "Mengabaikan kompleksitas pengelolaan state pada native stream processing yang menuntut checkpointing asinkron berbutir halus."
        ],
        "academicReferences": [
            "Armbrust, M., et al. (2018). Structured Streaming: A Declarative API for Real-Time Applications in Apache Spark. In Proceedings of the 2018 International Conference on Management of Data (SIGMOD 18), 601–613.",
            "Carbone, P., et al. (2015). Apache Flink: Stream and Batch Processing in a Single Engine. IEEE Data Engineering Bulletin, 38(4), 28–38."
        ],
        "caseStudy": "Sebuah sistem pemantauan armada IoT memproses 200.000 event per detik. Untuk analitik dasbor pembaruan metrik agregat 1 menit, mereka menggunakan Spark Structured Streaming (Micro-batching) karena efisiensi throughput kompresi tinggi; sedangkan untuk sistem pengereman darurat otonom, mereka menggunakan Apache Flink (Native Event-Driven) dengan latensi respons 2 milidetik.",
        "content": {
            "theory": (
                "Dalam domain komputasi aliran data waktu nyata (*real-time stream processing*), terdapat dua filosofi arsitektural yang saling bersaing: "
                "1. **Micro-batching (Apache Spark Structured Streaming)**: "
                "Memperlakukan stream data sebagai urutan batch-batch data diskrit yang sangat kecil yang dikumpulkan dalam interval waktu trigger tetap (misalnya setiap 100 ms hingga 2 detik). "
                "Keunggulan: mengeksploitasi seluruh optimasi engine batch (Catalyst Optimizer, Whole-Stage Codegen, kompresi vektor columnar) dan menghasilkan throughput data masif. "
                "Kelemahan: memiliki batas bawah latensi teoritis yang dibatasi oleh interval trigger penjadwalan task: "
                "$$\\text{Latency}_{\\text{micro-batch}} = \\Delta t_{\\text{trigger}} + T_{\\text{scheduling}} + T_{\\text{execution}} \\approx 50 - 500 \\text{ ms}$$ "
                "2. **Native Event-Driven Streaming (Continuous Processing / Apache Flink)**: "
                "Memproses setiap rekaman data secara individual seketika saat data tiba di operator tanpa menunggu pengumpulan batch (*record-by-record pipelined execution*). "
                "Keunggulan: latensi pemrosesan sangat rendah pada tingkat sub-milidetik (1–5 ms). "
                "Kelemahan: overhead per-pesan yang lebih tinggi dan menuntut mekanisme checkpointing terdistribusi asinkron yang rumit."
            ),
            "realWorldApplication": (
                "Uber menggunakan Apache Flink untuk penyesuaian harga dinamis (surge pricing) dan pencocokan pengemudi instan, sementara menggunakan Spark Structured Streaming untuk agregasi data analitik historis."
            ),
            "codeSnippet": (
                "# Komparasi Paradigma Stream Processing: Micro-batching vs Native Event-Driven Stream\n"
                "class StreamProcessingParadigmSimulator:\n"
                "    @staticmethod\n"
                "    def process_micro_batch(events_stream, batch_size=4):\n"
                "        # Mengumpulkan sejumlah N event sebelum mengeksekusi komputasi sekaligus\n"
                "        batches = [events_stream[i : i + batch_size] for i in range(0, len(events_stream), batch_size)]\n"
                "        processed_batches = []\n"
                "        for b_idx, b in enumerate(batches):\n"
                "            # Vektor komputasi batch: sum(x^2)\n"
                "            batch_sum = sum(x['val']**2 for x in b)\n"
                "            processed_batches.append({'batch_id': b_idx, 'items': len(b), 'result': batch_sum})\n"
                "        return processed_batches\n"
                "        \n"
                "    @staticmethod\n"
                "    def process_native_event_driven(events_stream):\n"
                "        # Setiap event diproses instan saat tiba secara kontinu\n"
                "        event_responses = []\n"
                "        running_state = 0\n"
                "        for e in events_stream:\n"
                "            # Perbarui state per event\n"
                "            running_state += e['val']**2\n"
                "            event_responses.append({'event_id': e['id'], 'val': e['val'], 'accumulated_state': running_state})\n"
                "        return event_responses\n"
                "\n"
                "stream = [{'id': i+1, 'val': (i+1)*2} for i in range(8)]\n"
                "mb_res = StreamProcessingParadigmSimulator.process_micro_batch(stream, batch_size=4)\n"
                "ev_res = StreamProcessingParadigmSimulator.process_native_event_driven(stream)\n"
                "\n"
                "print(f'Evaluasi Paradigma Stream Processing ({len(stream)} Event):')\n"
                "print('1. Micro-batching Engine (Spark-style, Batch Size=4):')\n"
                "for b in mb_res:\n"
                "    print(f'   - Batch #{b[\"batch_id\"]}: Diproses sebagai {b[\"items\"]} baris serentak -> Hasil Agregat={b[\"result\"]}')\n"
                "print('2. Native Event-Driven Engine (Flink-style, Continuous):')\n"
                "for r in ev_res[:4]:\n"
                "    print(f'   - Event #{r[\"event_id\"]}: Diproses instan -> Nilai={r[\"val\"]} | State Akumulasi={r[\"accumulated_state\"]}')\n"
                "print('Kesimpulan: Micro-batching mengoptimalkan throughput batch; Native streaming meminimalkan latensi per-event.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.9.2
    {
        "id": "10.9.2",
        "title": "Spark Structured Streaming: Model Tabel Tak Terbatas (Unbounded Table)",
        "learningObjectives": [
            "Memahami konsep konseptual Unbounded Table pada Spark Structured Streaming.",
            "Menganalisis bagaimana Catalyst Optimizer secara otomatis mengonversi kueri statis menjadi rencana eksekusi inkremental.",
            "Mengimplementasikan simulator model tabel tak terbatas dengan penambahan baris streaming dan pembaruan hasil kueri."
        ],
        "prerequisites": [
            "10.9.1 (Paradigma Stream Processing).",
            "10.6.5 (Spark DataFrame API)."
        ],
        "commonPitfalls": [
            "Mencoba menggunakan operasi yang tidak didukung pada streaming DataFrame (seperti multiple full outer joins tanpa watermark atau `show()`), memicu AnalysisException.",
            "Menganggap model Unbounded Table menyimpan seluruh data historis di memori; Spark hanya mempertahankan state agregasi yang relevan."
        ],
        "academicReferences": [
            "Armbrust, M., et al. (2018). Structured Streaming: A Declarative API for Real-Time Applications in Apache Spark. ACM SIGMOD 2018.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Sebuah sistem analitik ad-tech menggantikan kode kustom Spark DStream 2.000 baris dengan kueri Structured Streaming deklaratif 50 baris. Model tabel tak terbatas secara otomatis menangani toleransi kesalahan dan pembaruan hasil inkremental, mereduksi bug produksi sebesar 75%.",
        "content": {
            "theory": (
                "Kunci elegan dari **Spark Structured Streaming** adalah filosofi penyatuan antara pemrosesan batch dan streaming di bawah satu abstraksi tunggal: **Tabel Tak Terbatas (Unbounded Table)**. "
                "Alih-alih memaksa developer memikirkan konsep streaming yang rumit (seperti time-slices atau DStreams), Structured Streaming memodelkan aliran data sebagai sebuah tabel relasional standar yang terus bertambah barisnya secara tak terhingga: "
                "$$\\text{Table}(t) = \\text{Table}(t-1) \\cup \\Delta \\text{NewRows}(t)$$ "
                "Prinsip operasional Unbounded Table: "
                "1. **Kueri Deklaratif Standar**: Pengembang mengekspresikan logika analitik menggunakan sintaks SQL atau DataFrame biasa (persis seperti kueri batch pada tabel statis). "
                "2. **Incremental Execution Engine**: Catalyst Optimizer secara otomatis membedah kueri deklaratif tersebut menjadi rencana eksekusi inkremental. Setiap kali data baru tiba dari stream source (Kafka/Kinesis), Spark mengeksekusi rencana inkremental untuk memperbarui **Result Table**. "
                "3. **State Management Otomatis**: Spark secara otomatis melacak state perantara (seperti count atau sum berjalan) di dalam fault-tolerant state store tanpa perlu kode manual dari pengguna."
            ),
            "realWorldApplication": (
                "Databricks Lakehouse Platform menggunakan Structured Streaming Unbounded Table sebagai fondasi Delta Live Tables (DLT) untuk pipeline ingestion Medallion Bronze-to-Silver."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Model Tabel Tak Terbatas (Unbounded Table) Spark Structured Streaming\n"
                "class UnboundedTableSimulator:\n"
                "    def __init__(self):\n"
                "        self.unbounded_input_table = []  # Aliran data masuk append-only\n"
                "        self.result_table = {}           # Tabel hasil analitis terkini (Result Table)\n"
                "        \n"
                "    def trigger_batch(self, new_records):\n"
                "        # Tambahkan data baru ke Unbounded Table\n"
                "        self.unbounded_input_table.extend(new_records)\n"
                "        \n"
                "        # Eksekusi kueri agregasi inkremental: SELECT device, COUNT(*), SUM(temp)\n"
                "        for r in new_records:\n"
                "            dev = r['device']\n"
                "            if dev not in self.result_table:\n"
                "                self.result_table[dev] = {'count': 0, 'sum_temp': 0.0}\n"
                "            self.result_table[dev]['count'] += 1\n"
                "            self.result_table[dev]['sum_temp'] += r['temp']\n"
                "            \n"
                "        return self.result_table\n"
                "\n"
                "stream_table = UnboundedTableSimulator()\n"
                "\n"
                "# Trigger 1: Masuk 3 record awal\n"
                "res1 = stream_table.trigger_batch([\n"
                "    {'device': 'sensor_A', 'temp': 24.5},\n"
                "    {'device': 'sensor_B', 'temp': 31.0},\n"
                "    {'device': 'sensor_A', 'temp': 25.5}\n"
                "])\n"
                "\n"
                "# Trigger 2: Masuk 2 record tambahan\n"
                "res2 = stream_table.trigger_batch([\n"
                "    {'device': 'sensor_A', 'temp': 26.0},\n"
                "    {'device': 'sensor_B', 'temp': 30.5}\n"
                "])\n"
                "\n"
                "print('Hasil Evaluasi Model Unbounded Table (Incremental Stream Execution):')\n"
                "print(f'  Total Baris di Input Unbounded Table: {len(stream_table.unbounded_input_table)} baris')\n"
                "print('  Status Terkini Result Table (Pasca Trigger #2):')\n"
                "for dev, stats in res2.items():\n"
                "    avg = stats['sum_temp'] / stats['count']\n"
                "    print(f'    - [{dev}]: Cekatan={stats[\"count\"]} event | Rata-rata Suhu={avg:.2f}°C')\n"
                "print('Kesimpulan: Structured Streaming mengabstraksikan stream sebagai tabel relasional dinamis.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.9.3
    {
        "id": "10.9.3",
        "title": "Event Time vs Processing Time vs Ingestion Time",
        "learningObjectives": [
            "Membedakan secara mendalam tiga domain waktu dalam stream processing: Event Time, Ingestion Time, dan Processing Time.",
            "Menganalisis dampak keterlambatan jaringan (Network Jitter) dan antrean buffering terhadap anomali urutan data.",
            "Mengimplementasikan simulator perbandingan agregasi yang membuktikan distorsi analitis saat mengandalkan Processing Time."
        ],
        "prerequisites": [
            "10.9.2 (Model Tabel Tak Terbatas).",
            "Konsep Waktu Terdistribusi & Sinkronisasi Jam (NTP Clock Skew)."
        ],
        "commonPitfalls": [
            "Mengelompokkan transaksi keuangan berdasarkan Processing Time mesin worker, memicu distorsi laporan ketika terjadi penundaan jaringan seluler pada perangkat pengguna.",
            "Mengabaikan data yang datang terlambat (*out-of-order data*) saat menggunakan Event Time tanpa mekanisme windowing yang tepat."
        ],
        "academicReferences": [
            "Akidau, T., et al. (2015). The Dataflow Model: A Practical Approach to Balancing Correctness, Latency, and Cost in Massive-Scale, Unbounded, Out-of-Order Data Processing. Proceedings of the VLDB Endowment, 8(12), 1792–1803.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Game online multipemain global mengalami kesalahan penentuan pemenang turnamen karena kueri agregasi skor menggunakan Processing Time server. Pengguna di jaringan mobile dengan latensi 5 detik salah diklasifikasikan ke ronde permainan berikutnya. Mengalihkan pipeline ke Event Time menyelaraskan skor turnamen 100% akurat.",
        "content": {
            "theory": (
                "Dalam sistem terdistribusi, waktu tidak pernah bersifat monolitik. "
                "Pemrosesan aliran data modern membedakan tiga domain waktu (**Time Domains**) yang sangat berbeda: "
                "1. **Event Time (Waktu Peristiwa)**: "
                "Waktu ketika suatu peristiwa fisik sebenarnya terjadi pada perangkat produser (disematkan sebagai stempel waktu `event_timestamp` di payload data). Merupakan satu-satunya domain waktu yang mencerminkan realitas bisnis secara objektif. "
                "2. **Ingestion Time (Waktu Penyerapan)**: "
                "Waktu ketika pesan pertama kali diterima dan dicatat ke dalam log broker perantara (seperti Kafka broker). "
                "3. **Processing Time (Waktu Pemrosesan)**: "
                "Waktu jam sistem lokal (*wall-clock time*) pada node komputasi worker (Spark/Flink executor) saat operator mengeksekusi data tersebut. "
                "Analisis pergeseran waktu (**Time Skew**): "
                "$$\\Delta_{\\text{skew}} = T_{\\text{processing}} - T_{\\text{event}} = \\text{NetworkLatency} + \\text{QueueBufferDelay}$$ "
                "Jika pipeline analitik mengelompokkan data berdasarkan Processing Time, peristiwa yang terjadi pada menit 10:00 namun tertahan jaringan hingga 10:05 akan salah diklasifikasikan ke dalam bucket jam 10:05. "
                "Oleh karena itu, seluruh sistem pemrosesan stream modern wajib menggunakan **Event Time** untuk menjamin kebenaran komputasi."
            ),
            "realWorldApplication": (
                "Google Cloud Dataflow, Apache Flink, dan Spark Structured Streaming menstandarisasi seluruh operasi windowing berbasis Event Time untuk menjamin hasil analitik yang deterministik."
            ),
            "codeSnippet": (
                "# Demonstrasi Distorsi Analitis: Event Time vs Processing Time pada Data Tertunda Jaringan\n"
                "class TimeDomainAnalyzer:\n"
                "    @staticmethod\n"
                "    def aggregate_by_processing_time(events):\n"
                "        # Pengelompokan berdasarkan waktu worker memproses (misal: semua masuk bucket Menit 12)\n"
                "        buckets = {}\n"
                "        for e in events:\n"
                "            p_minute = e['processing_time_min']\n"
                "            buckets[p_minute] = buckets.get(p_minute, 0) + e['amount']\n"
                "        return buckets\n"
                "        \n"
                "    @staticmethod\n"
                "    def aggregate_by_event_time(events):\n"
                "        # Pengelompokan objektif berdasarkan stempel waktu kejadian asli (Event Time)\n"
                "        buckets = {}\n"
                "        for e in events:\n"
                "            e_minute = e['event_time_min']\n"
                "            buckets[e_minute] = buckets.get(e_minute, 0) + e['amount']\n"
                "        return buckets\n"
                "\n"
                "# Skenario: 3 transaksi terjadi di Menit 10, namun tertahan buffering jaringan dan baru diproses di Menit 12\n"
                "stream_events = [\n"
                "    {'tx_id': 1, 'amount': 100, 'event_time_min': 10, 'processing_time_min': 12},\n"
                "    {'tx_id': 2, 'amount': 200, 'event_time_min': 10, 'processing_time_min': 12},\n"
                "    {'tx_id': 3, 'amount': 150, 'event_time_min': 11, 'processing_time_min': 12}\n"
                "]\n"
                "\n"
                "proc_agg = TimeDomainAnalyzer.aggregate_by_processing_time(stream_events)\n"
                "event_agg = TimeDomainAnalyzer.aggregate_by_event_time(stream_events)\n"
                "\n"
                "print('Evaluasi Dampak Domain Waktu pada Agregasi Finansial:')\n"
                "print(f'  1. Agregasi Processing Time : {proc_agg} (Seluruh $450 menumpuk di Menit 12 - BIAS!)')\n"
                "print(f'  2. Agregasi Event Time      : {event_agg} (Menit 10=$300, Menit 11=$150 - AKURAT!)')\n"
                "print('Kesimpulan: Event Time menjaga kebenaran temporal data terlepas dari latensi jaringan.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.9.4
    {
        "id": "10.9.4",
        "title": "Tipe Windowing: Tumbling (Fixed), Sliding (Hopping), dan Session Window",
        "learningObjectives": [
            "Memahami taksonomi algoritma Windowing pada aliran data kontinu tak berujung.",
            "Menganalisis formulasi matematis dan kasus penggunaan Tumbling Windows, Sliding Windows, dan Session Windows.",
            "Mengimplementasikan generator alokasi window multi-tipe untuk deret waktu event streaming."
        ],
        "prerequisites": [
            "10.9.3 (Event Time vs Processing Time).",
            "Aljabar Himpunan & Interval Waktu Kontinu."
        ],
        "commonPitfalls": [
            "Memilih interval slide ($S$) yang terlalu kecil pada Sliding Window (misal: durasi window 1 jam, slide 1 detik), memicu pembengkakan state memori hingga 3.600x lipat.",
            "Mengabaikan penanganan sesi yang tidak pernah ditutup pada Session Window akibat ketiadaan timeout gap yang eksplisit."
        ],
        "academicReferences": [
            "Akidau, T., et al. (2015). The Dataflow Model. VLDB Endowment, 8(12), 1792–1803.",
            "Carbone, P., et al. (2015). Apache Flink: Stream and Batch Processing in a Single Engine. IEEE Data Engineering Bulletin."
        ],
        "caseStudy": "Platform e-commerce mengombinasikan tiga tipe window: Tumbling Window 1 jam untuk laporan penjualan kasir, Sliding Window 5 menit dengan slide 1 menit untuk deteksi lonjakan lalu lintas server, dan Session Window dengan gap 30 menit untuk melacak durasi kunjungan aktif pembeli.",
        "content": {
            "theory": (
                "Karena aliran data streaming bersifat tak terbatas (*unbounded*), operasi agregasi (seperti rata-rata atau total) tidak dapat dieksekusi pada seluruh dataset secara global. "
                "Sistem streaming membagi aliran waktu kontinu menjadi interval-interval diskrit terhingga yang disebut **Jendela Waktu (Windows)**: "
                "1. **Tumbling Window (Fixed Window)**: "
                "Jendela waktu dengan durasi tetap $W$ yang berdampingan tanpa tumpang tindih (*non-overlapping*) dan tanpa celah: "
                "$$\\text{Window}_k = [k \\cdot W, (k+1) \\cdot W), \\quad k \\in \\mathbb{Z}$$ "
                "Setiap peristiwa masuk ke dalam tepat satu jendela waktu. Ideal untuk pelaporan berkala (misal total penjualan per jam). "
                "2. **Sliding Window (Hopping Window)**: "
                "Jendela waktu dengan durasi tetap $W$ yang bergeser secara periodik setiap interval slide $S$ (di mana $S < W$): "
                "$$\\text{Window}_k = [k \\cdot S, k \\cdot S + W)$$ "
                "Karena durasi window lebih besar daripada interval gesernya, satu peristiwa dapat masuk ke dalam beberapa jendela waktu secara bersamaan. Ideal untuk moving averages dan deteksi anomali. "
                "3. **Session Window**: "
                "Jendela waktu dinamis yang diatur oleh periode ketidakaktifan (*inactivity gap threshold* $G$). "
                "Jendela tetap terbuka selama jarak waktu antar-peristiwa berurutan $\\Delta t \\le G$. "
                "Ketika $\\Delta t > G$, sesi dianggap berakhir dan jendela ditutup."
            ),
            "realWorldApplication": (
                "Google Analytics dan aplikasi streaming perbankan mengandalkan Session Windows untuk menghitung durasi aktivitas pengguna sebelum sesi login kadaluwarsa."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Algoritma Windowing: Tumbling, Sliding, & Session Windows\n"
                "class WindowingEngineSimulator:\n"
                "    @staticmethod\n"
                "    def assign_tumbling_window(event_time, window_size=60):\n"
                "        # Tumbling: [k*W, (k+1)*W)\n"
                "        start = (event_time // window_size) * window_size\n"
                "        return [(start, start + window_size)]\n"
                "        \n"
                "    @staticmethod\n"
                "    def assign_sliding_windows(event_time, window_size=60, slide_size=20):\n"
                "        # Sliding: event masuk ke seluruh window yang mencakup event_time\n"
                "        windows = []\n"
                "        first_start = ((event_time - window_size + slide_size) // slide_size) * slide_size\n"
                "        current = first_start\n"
                "        while current <= event_time:\n"
                "            if current <= event_time < current + window_size:\n"
                "                windows.append((current, current + window_size))\n"
                "            current += slide_size\n"
                "        return windows\n"
                "        \n"
                "    @staticmethod\n"
                "    def compute_session_windows(event_timestamps, gap_threshold=30):\n"
                "        # Session: gabungkan rentang jika jeda <= gap_threshold\n"
                "        sorted_ts = sorted(event_timestamps)\n"
                "        sessions = []\n"
                "        if not sorted_ts:\n"
                "            return []\n"
                "        cur_start = sorted_ts[0]\n"
                "        cur_end = sorted_ts[0]\n"
                "        for t in sorted_ts[1:]:\n"
                "            if t - cur_end <= gap_threshold:\n"
                "                cur_end = t\n"
                "            else:\n"
                "                sessions.append((cur_start, cur_end + gap_threshold))\n"
                "                cur_start = t\n"
                "                cur_end = t\n"
                "        sessions.append((cur_start, cur_end + gap_threshold))\n"
                "        return sessions\n"
                "\n"
                "sample_t = 75  # Detik ke-75\n"
                "tumb = WindowingEngineSimulator.assign_tumbling_window(sample_t, window_size=60)\n"
                "slide = WindowingEngineSimulator.assign_sliding_windows(sample_t, window_size=60, slide_size=20)\n"
                "user_clicks = [10, 25, 40, 120, 135]  # Ada jeda 80 detik antara 40 dan 120\n"
                "sess = WindowingEngineSimulator.compute_session_windows(user_clicks, gap_threshold=30)\n"
                "\n"
                "print(f'Evaluasi Alokasi Window Streaming (Event Time={sample_t}s):')\n"
                "print(f'  1. Tumbling Window (W=60s)         : {tumb}')\n"
                "print(f'  2. Sliding Windows (W=60s, Slide=20s): {slide} (Masuk ke {len(slide)} window sekaligus)')\n"
                "print(f'  3. Session Windows (Gap=30s)        : {sess} (Terbagi 2 sesi independen)')\n"
                "print('Kesimpulan: Tipe window menentukan bagaimana aliran kontinu diabstraksikan menjadi unit terukur.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.9.5
    {
        "id": "10.9.5",
        "title": "Watermarking: Penanganan Data yang Datang Terlambat (Late-Arriving Data)",
        "learningObjectives": [
            "Memahami konsep Watermark sebagai penanda kemajuan waktu logis (progress of time) pada stream processing.",
            "Menganalisis formulasi penentuan batas ambang watermark dan dampaknya terhadap trade-off kelengkapan data vs latensi.",
            "Mengimplementasikan simulator Watermarking Engine yang mengevaluasi pembersihan state dan penolakan data terlambat."
        ],
        "prerequisites": [
            "10.9.4 (Tipe Windowing).",
            "10.9.3 (Event Time vs Processing Time)."
        ],
        "commonPitfalls": [
            "Mengatur ambang batas delay watermark terlalu longgar (misal 24 jam), menyebabkan memori state store membengkak karena jendela lama tidak pernah ditutup.",
            "Mengatur watermark terlalu ketat (0 detik), menyebabkan sejumlah besar data yang mengalami latensi jaringan normal dibuang (*dropped late data*)."
        ],
        "academicReferences": [
            "Akidau, T., et al. (2015). The Dataflow Model. VLDB Endowment, 8(12), 1792–1803.",
            "Armbrust, M., et al. (2018). Structured Streaming: A Declarative API for Real-Time Applications in Apache Spark. ACM SIGMOD 2018."
        ],
        "caseStudy": "Aplikasi pelaporan armada taksi online menerima data GPS dengan penundaan jaringan seluler hingga 5 menit saat melewati terowongan. Menetapkan Watermark `withWatermark('event_time', '10 minutes')` memungkinkan sistem memproses 99.8% data terlambat secara akurat sambil tetap membebaskan memori jendela yang sudah berusia lebih dari 10 menit.",
        "content": {
            "theory": (
                "Dalam sistem pemrosesan aliran data berbasis Event Time, masalah paling pelik adalah: **Bagaimana sistem mengetahui kapan seluruh data untuk jendela waktu tertentu telah selesai tiba?** "
                "Jika sistem menunggu tanpa batas, memori state tidak akan pernah bisa dibersihkan (*memory leak*). "
                "Diilhami oleh makalah kanonikal Google MillWheel dan Google Dataflow (Akidau et al., VLDB 2015), Spark Structured Streaming dan Flink mengadopsi konsep **Watermark**: "
                "Watermark adalah penanda monotonik yang menyatakan bahwa sistem berasumsi tidak ada lagi data dengan stempel waktu $T < W(t)$ yang akan tiba di masa depan. "
                "Watermark dihitung secara dinamis dari nilai maksimum Event Time yang pernah diamati dikurangi ambang batas keterlambatan yang ditoleransi ($\\Delta_{\\text{delay}}$): "
                "$$W(t) = \\max_{\\tau \\le t}(\\text{EventTime}(\\tau)) - \\Delta_{\\text{delay}}$$ "
                "Aturan operasional Watermark: "
                "1. **Pembersihan State**: Seluruh jendela waktu yang batas akhirnya berada di bawah Watermark ($T_{\\text{window\\_end}} \\le W(t)$) dianggap telah final dan **dihapus dari memori state store**. "
                "2. **Penolakan Data Terlambat (Late Data Dropping)**: Jika tiba peristiwa baru dengan $\\text{EventTime} < W(t)$, peristiwa tersebut dikategorikan sebagai *Data Kadaluwarsa* dan langsung dibuang (*dropped*) tanpa memodifikasi hasil agregasi."
            ),
            "realWorldApplication": (
                "Sistem deteksi fraud transaksi kartu kredit menggunakan watermark 15 menit untuk mengunci jendela agregasi transaksi per pengguna sebelum memicu peringatan kepatuhan."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Watermarking Engine & Evaluasi Pembersihan State Window\n"
                "class WatermarkingEngineSimulator:\n"
                "    def __init__(self, delay_threshold_sec=10):\n"
                "        self.delay_threshold = delay_threshold_sec\n"
                "        self.max_event_time = 0\n"
                "        self.current_watermark = 0\n"
                "        self.active_window_states = {}  # {window_end_time: aggregated_sum}\n"
                "        \n"
                "    def process_event(self, event_time, amount):\n"
                "        # Perbarui max event time & hitung watermark terkini\n"
                "        if event_time > self.max_event_time:\n"
                "            self.max_event_time = event_time\n"
                "            self.current_watermark = max(0, self.max_event_time - self.delay_threshold)\n"
                "            \n"
                "        # Evaluasi apakah data datang terlambat melewati watermark\n"
                "        if event_time < self.current_watermark:\n"
                "            return {'status': 'DROPPED_TOO_LATE', 'event_time': event_time, 'watermark': self.current_watermark}\n"
                "            \n"
                "        # Tentukan window end (Tumbling 30s)\n"
                "        w_end = ((event_time // 30) + 1) * 30\n"
                "        self.active_window_states[w_end] = self.active_window_states.get(w_end, 0) + amount\n"
                "        \n"
                "        # Bersihkan window yang sudah melewati watermark\n"
                "        evicted_windows = []\n"
                "        for w in list(self.active_window_states.keys()):\n"
                "            if w <= self.current_watermark:\n"
                "                evicted_windows.append(w)\n"
                "                del self.active_window_states[w]\n"
                "                \n"
                "        return {\n"
                "            'status': 'ACCEPTED',\n"
                "            'event_time': event_time,\n"
                "            'watermark': self.current_watermark,\n"
                "            'evicted_windows': evicted_windows\n"
                "        }\n"
                "\n"
                "engine = WatermarkingEngineSimulator(delay_threshold_sec=15)  # Toleransi delay 15 detik\n"
                "\n"
                "# Aliran 4 event dengan stempel waktu berfluktuasi\n"
                "e1 = engine.process_event(event_time=20, amount=100)  # Watermark = 20 - 15 = 5\n"
                "e2 = engine.process_event(event_time=50, amount=200)  # Watermark = 50 - 15 = 35 (Window 30 kadaluwarsa!)\n"
                "e3 = engine.process_event(event_time=40, amount=150)  # 40 > 35 -> Diterima!\n"
                "e4 = engine.process_event(event_time=25, amount=300)  # 25 < 35 -> DIBUANG (Terlalu lambat!)\n"
                "\n"
                "print('Hasil Simulasi Mekanisme Watermarking Streaming:')\n"
                "print(f'  Event 1 (t=20s): Status={e1[\"status\"]} | Watermark={e1[\"watermark\"]}s')\n"
                "print(f'  Event 2 (t=50s): Status={e2[\"status\"]} | Watermark={e2[\"watermark\"]}s | Window Digusur={e2[\"evicted_windows\"]}')\n"
                "print(f'  Event 3 (t=40s): Status={e3[\"status\"]} | Watermark={e3[\"watermark\"]}s (Late but within watermark)')\n"
                "print(f'  Event 4 (t=25s): Status={e4[\"status\"]} | Watermark={e4[\"watermark\"]}s (Dropped late data)')\n"
                "print('Kesimpulan: Watermark membatasi retensi state memori dan membuang data kadaluwarsa secara terkontrol.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.9.6
    {
        "id": "10.9.6",
        "title": "Stateful Stream Processing & State Store (RocksDB Provider)",
        "learningObjectives": [
            "Memahami arsitektur pemrosesan aliran data berstatus (Stateful Stream Processing).",
            "Menganalisis keterbatasan penyimpanan state berbasis in-memory JVM vs embedded LSM-tree RocksDB State Store.",
            "Mengimplementasikan simulator penyimpanan state persisten untuk operasi agregasi kumulatif terdistribusi."
        ],
        "prerequisites": [
            "10.9.5 (Watermarking).",
            "Struktur Data Log-Structured Merge-Tree (LSM-Tree)."
        ],
        "commonPitfalls": [
            "Menggunakan In-Memory HDFS backing state store untuk state berukuran ratusan gigabyte, memicu pause GC JVM berdurasi puluhan detik.",
            "Lupa menentukan kebijakan retensi TTL pada state kustom (`mapGroupsWithState`), menyebabkan kebocoran memori permanen."
        ],
        "academicReferences": [
            "Dong, S., et al. (2021). Evolution of Development Priorities in Key-value Stores Serving Large-scale Applications: The RocksDB Experience. In Proceedings of the 19th USENIX Conference on File and Storage Technologies (FAST 21), 33–49.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Pipeline analitik sesi pengguna di Netflix melacak 50 juta kunci sesi aktif. Penyimpanan state berbasis default JVM heap memicu crash OOM harian. Migrasi ke RocksDB State Store Provider memindahkan state 120 GB ke off-heap SSD lokal, menstabilkan pipeline dengan ketersediaan 99.99%.",
        "content": {
            "theory": (
                "Dalam stream processing, operasi diklasifikasikan menjadi: **Stateless** (setiap record diproses independen tanpa memori masa lalu, misal `map` atau `filter`) dan **Stateful** (pemrosesan membutuhkan ingatan historis terhadap rekaman sebelumnya, misal `count`, `groupBy`, windowed aggregates, dan stream-stream joins). "
                "Untuk mendukung operasi stateful, mesin stream membutuhkan komponen **State Store**: "
                "1. **In-Memory HDFS State Store (Default Spark)**: "
                "Menyimpan state objek di dalam JVM Heap executor dan menuliskan snapshot delta ke file system persisten (HDFS/S3) pada setiap checkpoint. "
                "Kelemahan: ukuran state dibatasi oleh kapasitas RAM JVM, dan objek Java dalam jumlah jutaan memicu kelumpuhan Garbage Collection. "
                "2. **RocksDB State Store Provider**: "
                "Mesin penyimpanan key-value berkinerja tinggi berbasis **Log-Structured Merge-Tree (LSM-Tree)** yang ditulis dalam C++ (dikembangkan oleh Meta). "
                "RocksDB menyimpan state di memori off-heap dan disk SSD lokal worker: "
                "$$\\text{TotalStateSize} \\le \\text{DiskStorage}_{\n                \\text{worker}} \\gg \\text{RAM}_{\\text{heap}}$$"
                "Pendekatan ini memungkinkan pipeline mempertahankan state berukuran ratusan gigabyte hingga terabyte tanpa membebani heap JVM."
            ),
            "realWorldApplication": (
                "Apache Flink dan Spark Structured Streaming 3.2+ secara resmi merekomendasikan RocksDB State Backend sebagai standar untuk seluruh aplikasi stateful berskala enterprise."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Stateful Stream Processing dengan LSM-Style State Store\n"
                "class RocksDBStateStoreSimulator:\n"
                "    def __init__(self):\n"
                "        # Simulasi LSM-Tree MemTable (RAM) dan SSTables (Disk)\n"
                "        self.memtable = {}\n"
                "        self.sstables_disk = {}\n"
                "        \n"
                "    def put_state(self, key, value):\n"
                "        self.memtable[key] = value\n"
                "        if len(self.memtable) >= 3:\n"
                "            # Flush MemTable ke SSTable disk lokal\n"
                "            self._flush_to_disk()\n"
                "            \n"
                "    def _flush_to_disk(self):\n"
                "        self.sstables_disk.update(self.memtable)\n"
                "        self.memtable = {}\n"
                "        \n"
                "    def get_state(self, key):\n"
                "        # Cari di MemTable dulu, jika tidak ada cari di disk SSTable\n"
                "        if key in self.memtable:\n"
                "            return self.memtable[key]\n"
                "        return self.sstables_disk.get(key, None)\n"
                "\n"
                "class StatefulUserSessionTracker:\n"
                "    def __init__(self):\n"
                "        self.state_store = RocksDBStateStoreSimulator()\n"
                "        \n"
                "    def process_user_action(self, user_id, action_val):\n"
                "        # Ambil state lama pengguna dari State Store\n"
                "        prev_state = self.state_store.get_state(user_id) or {'total_actions': 0, 'total_spent': 0.0}\n"
                "        # Mutasi state inkremental\n"
                "        new_state = {\n"
                "            'total_actions': prev_state['total_actions'] + 1,\n"
                "            'total_spent': prev_state['total_spent'] + action_val\n"
                "        }\n"
                "        # Simpan kembali ke state store\n"
                "        self.state_store.put_state(user_id, new_state)\n"
                "        return new_state\n"
                "\n"
                "tracker = StatefulUserSessionTracker()\n"
                "tracker.process_user_action('user_1', 50.0)\n"
                "tracker.process_user_action('user_2', 120.0)\n"
                "tracker.process_user_action('user_1', 75.0)  # Pembaruan state user_1\n"
                "u1_final = tracker.process_user_action('user_1', 25.0)\n"
                "\n"
                "print('Hasil Evaluasi Stateful Stream Processing (RocksDB State Store):')\n"
                "print(f'  Status Akhir User 1: Total Aksi={u1_final[\"total_actions\"]} | Akumulasi Belanja=${u1_final[\"total_spent\"]:.2f}')\n"
                "print(f'  Kondisi MemTable RAM : {tracker.state_store.memtable}')\n"
                "print(f'  Kondisi SSTable Disk : {tracker.state_store.sstables_disk}')\n"
                "print('Kesimpulan: State store mempertahankan konteks historis pengguna secara persisten dan efisien.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.9.7
    {
        "id": "10.9.7",
        "title": "Mode Output Streaming: Append Mode, Complete Mode, dan Update Mode",
        "learningObjectives": [
            "Membedakan semantik ketiga Output Mode pada Spark Structured Streaming: Append, Complete, dan Update.",
            "Menganalisis kompatibilitas antara jenis kueri streaming (agregasi, filter, watermark) dengan output mode yang dipilih.",
            "Mengimplementasikan simulator penulisan hasil streaming ke external sink untuk memverifikasi payload data yang dikirim."
        ],
        "prerequisites": [
            "10.9.2 (Unbounded Table).",
            "10.9.5 (Watermarking)."
        ],
        "commonPitfalls": [
            "Menggunakan Append Mode pada kueri agregasi tanpa mendefinisikan Watermark, memicu `AnalysisException` karena engine tidak tahu kapan baris dianggap final.",
            "Menggunakan Complete Mode pada tabel yang memiliki miliaran kunci unik, memaksa seluruh tabel ditulis ulang ke sink pada setiap siklus trigger."
        ],
        "academicReferences": [
            "Armbrust, M., et al. (2018). Structured Streaming: A Declarative API for Real-Time Applications in Apache Spark. ACM SIGMOD 2018.",
            "Spark Documentation: Structured Streaming Output Modes."
        ],
        "caseStudy": "Dasbor pemantauan transaksi penipuan memilih Update Mode saat menulis ke basis data analitik Redis/ClickHouse, sehingga hanya akun yang mengalami perubahan saldo pada trigger 5 detik terakhir yang dikirim, memangkas beban I/O sink sebesar 95% dibandingkan Complete Mode.",
        "content": {
            "theory": (
                "Setelah kueri streaming memproses data baru dan memperbarui Result Table, sistem harus memutuskan bagaimana data hasil tersebut ditulis ke media penyimpanan eksternal (*External Sink* seperti Kafka, Delta Lake, atau RDBMS). "
                "Spark Structured Streaming menyediakan tiga **Mode Output (Output Modes)**: "
                "1. **Append Mode**: "
                "Hanya baris-baris baru yang ditambahkan ke Result Table sejak trigger terakhir yang ditulis ke sink. "
                "Karakteristik: menjamin bahwa setiap baris hasil yang telah ditulis **tidak akan pernah dimodifikasi lagi**. "
                "Pada kueri agregasi berbasis window, Append Mode hanya diizinkan jika disertai **Watermark**, dan baris hanya ditulis saat jendela waktu telah kadaluwarsa (final). "
                "2. **Complete Mode**: "
                "Seluruh Result Table ditulis ulang ke sink secara penuh pada setiap siklus trigger: "
                "$$\\text{OutputSink}(t) = \\text{ResultTable}(t)$$ "
                "Hanya valid untuk kueri yang memuat agregasi. "
                "3. **Update Mode**: "
                "Hanya baris-baris pada Result Table yang mengalami **perubahan nilai** sejak trigger terakhir yang ditulis ke sink. "
                "Jika kueri tidak memuat agregasi, Update Mode berperilaku identik dengan Append Mode."
            ),
            "realWorldApplication": (
                "Pola penulisan ke Delta Lake menggunakan Append Mode untuk ingestion raw log, dan Update/Complete Mode saat mengekspor metrik agregat ke basis data KV (seperti Cassandra atau DynamoDB)."
            ),
            "codeSnippet": (
                "# Simulator Evaluasi Tiga Output Mode Structured Streaming (Append, Complete, Update)\n"
                "class StreamingOutputModeSimulator:\n"
                "    @staticmethod\n"
                "    def evaluate_output_modes(prev_state, current_state):\n"
                "        # Complete Mode: Kirim SELURUH tabel terkini\n"
                "        complete_payload = current_state.copy()\n"
                "        \n"
                "        # Update Mode: Hanya kirim baris yang nilainya berubah atau baru muncul\n"
                "        update_payload = {}\n"
                "        for k, v in current_state.items():\n"
                "            if k not in prev_state or prev_state[k] != v:\n"
                "                update_payload[k] = v\n"
                "                \n"
                "        # Append Mode: Hanya kirim baris baru yang sebelumnya belum ada (untuk stateless)\n"
                "        append_payload = {}\n"
                "        for k, v in current_state.items():\n"
                "            if k not in prev_state:\n"
                "                append_payload[k] = v\n"
                "                \n"
                "        return {\n"
                "            'complete_count': len(complete_payload),\n"
                "            'update_count': len(update_payload),\n"
                "            'append_count': len(append_payload),\n"
                "            'update_items': update_payload\n"
                "        }\n"
                "\n"
                "# State Trigger 1: Kategori A=$100, B=$200\n"
                "state_t1 = {'A': 100, 'B': 200}\n"
                "# State Trigger 2: Kategori B diperbarui jadi $250, C baru muncul $50 (A tidak berubah)\n"
                "state_t2 = {'A': 100, 'B': 250, 'C': 50}\n"
                "\n"
                "modes_res = StreamingOutputModeSimulator.evaluate_output_modes(state_t1, state_t2)\n"
                "\n"
                "print('Evaluasi Output Mode Structured Streaming pada Trigger #2:')\n"
                "print(f'  1. Complete Mode: Menulis seluruh {modes_res[\"complete_count\"]} record (A, B, C ditulis ulang)')\n"
                "print(f'  2. Update Mode  : Menulis {modes_res[\"update_count\"]} record termutasi: {modes_res[\"update_items\"]}')\n"
                "print(f'  3. Append Mode  : Menulis {modes_res[\"append_count\"]} record entri baru murni')\n"
                "print('Kesimpulan: Update mode sangat efisien untuk sink basis data key-value.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.9.8
    {
        "id": "10.9.8",
        "title": "End-to-End Exactly-Once Processing dengan Checkpointing & Write-Ahead Logs (WAL)",
        "learningObjectives": [
            "Memahami arsitektur pemrosesan Exactly-Once ujung-ke-ujung (End-to-End EOS).",
            "Menganalisis tiga pilar integrasi: Replayable Source, Deterministic Stateful Engine, dan Idempotent/Two-Phase Commit Sink.",
            "Mengimplementasikan simulator Two-Phase Commit (2PC) Transactional Sink untuk menjamin konsistensi atomik all-or-nothing."
        ],
        "prerequisites": [
            "10.8.8 (Jaminan Pengiriman Pesan).",
            "10.5.5 (Protokol Transaksi ACID & ARIES)."
        ],
        "commonPitfalls": [
            "Mengasumsikan Spark checkpointing otomatis memberikan Exactly-Once saat menulis ke REST API eksternal non-idempotent.",
            "Membiarkan transaksi pre-commit terbuka menggantung (*hanging prepared transactions*) tanpa mekanisme timeout rollback."
        ],
        "academicReferences": [
            "Armbrust, M., et al. (2018). Structured Streaming: A Declarative API for Real-Time Applications in Apache Spark. ACM SIGMOD 2018.",
            "Gray, J. (1978). Notes on Data Base Operating Systems. Operating Systems, An Advanced Course, 393–481."
        ],
        "caseStudy": "Sebuah sistem pengiriman notifikasi saldo perbankan mengimplementasikan Two-Phase Commit sink antara Spark Streaming dan PostgreSQL. Saat worker node crash di detik ke-59, transaksi yang masih berada di fase Prepare otomatis di-rollback, menjamin nol debit ganda.",
        "content": {
            "theory": (
                "Mencapai jaminan **End-to-End Exactly-Once Semantics (EOS)** melintasi seluruh pipeline streaming membutuhkan koordinasi harmonis antara tiga komponen independen: "
                "1. **Replayable Source**: Sumber data streaming harus mendukung pelacakan posisi dan mampu memutar ulang data historis dari offset tertentu saat terjadi kegagalan (misalnya Kafka offset rewind). "
                "2. **Deterministic & Fault-Tolerant Engine**: Mesin streaming (Spark/Flink) harus mencatat offset sumber dan status state internal ke dalam **Checkpoint Directory** menggunakan Write-Ahead Log (WAL) atomik sebelum mengeksekusi trigger berikutnya. "
                "3. **Idempotent or Two-Phase Commit (2PC) Sink**: Media tujuan harus mampu menolak duplikasi (misal *upsert* berbasis primary key) atau mengimplementasikan protokol **Two-Phase Commit**: "
                "   - *Phase 1 (Prepare / Pre-Commit)*: Data ditulis ke area staging sementara. Sink mengunci transaksi namun belum mempublikasikannya ke pengguna kueri. "
                "   - *Phase 2 (Commit)*: Setelah engine berhasil mencatat checkpoint secara permanen, engine mengirimkan perintah commit final: "
                "$$\\text{TxState} \\implies \\text{PreCommit} \\xrightarrow{\\text{WAL Checkpoint OK}} \\text{FinalCommit} \\quad (\\text{Atomic})$$"
            ),
            "realWorldApplication": (
                "Format tabel Delta Lake dan Apache Iceberg berfungsi sebagai ACID Sink bawaan yang menyediakan garansi End-to-End Exactly-Once secara alami untuk Spark Structured Streaming."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Two-Phase Commit (2PC) Transactional Sink untuk End-to-End EOS\n"
                "class TwoPhaseCommitSinkSimulator:\n"
                "    def __init__(self):\n"
                "        self.staging_area = {}      # Data prepared (belum visible)\n"
                "        self.committed_storage = []  # Data final visible publik\n"
                "        self.checkpoint_wal = []    # Log transaksi engine\n"
                "        \n"
                "    def prepare_transaction(self, tx_id, records):\n"
                "        # Fase 1: Tulis data ke staging sementara\n"
                "        self.staging_area[tx_id] = records\n"
                "        return {'phase': 'PREPARED', 'tx_id': tx_id, 'records': len(records)}\n"
                "        \n"
                "    def commit_transaction(self, tx_id):\n"
                "        # Fase 2: Checkpoint engine sukses -> Commit final all-or-nothing\n"
                "        if tx_id not in self.staging_area:\n"
                "            return {'status': 'FAILED_TX_NOT_FOUND'}\n"
                "            \n"
                "        # Catat ke WAL lalu pindahkan data ke penyimpanan publik\n"
                "        self.checkpoint_wal.append({'tx_id': tx_id, 'status': 'COMMITTED'})\n"
                "        self.committed_storage.extend(self.staging_area[tx_id])\n"
                "        del self.staging_area[tx_id]\n"
                "        return {'status': 'SUCCESS_COMMITTED', 'total_visible': len(self.committed_storage)}\n"
                "        \n"
                "    def rollback_transaction(self, tx_id):\n"
                "        if tx_id in self.staging_area:\n"
                "            del self.staging_area[tx_id]\n"
                "        return {'status': 'ROLLED_BACK'}\n"
                "\n"
                "sink = TwoPhaseCommitSinkSimulator()\n"
                "# Batch 1 Berhasil: Prepare -> Commit\n"
                "sink.prepare_transaction('TX-101', [{'id': 1, 'val': 100}, {'id': 2, 'val': 200}])\n"
                "c1 = sink.commit_transaction('TX-101')\n"
                "\n"
                "# Batch 2 Mengalami Kegagalan: Prepare -> Crash -> Rollback!\n"
                "sink.prepare_transaction('TX-102', [{'id': 3, 'val': 300}])\n"
                "r2 = sink.rollback_transaction('TX-102')\n"
                "\n"
                "print('Hasil Evaluasi Two-Phase Commit Transactional Sink:')\n"
                "print(f'  Status Commit TX-101   : {c1[\"status\"]} (Data menjadi visible: {c1[\"total_visible\"]} record)')\n"
                "print(f'  Status Rollback TX-102 : {r2[\"status\"]} (Data di staging dibuang bersih)')\n"
                "print(f'  Penyimpanan Publik Akhir: {sink.committed_storage}')\n"
                "print('Kesimpulan: 2PC Sink mengeliminasi partial writes saat terjadi kegagalan sistem.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.9.9
    {
        "id": "10.9.9",
        "title": "Arsitektur Apache Flink: Chandy-Lamport Distributed Checkpointing",
        "learningObjectives": [
            "Memahami arsitektur internal Apache Flink dan algoritma Asynchronous Barrier Snapshotting (ABS).",
            "Menganalisis adaptasi algoritma klasik Chandy-Lamport (1985) untuk pelacakan snapshot global terdistribusi tanpa jeda komputasi.",
            "Mengimplementasikan simulator Barrier Alignment pada operator multi-channel stream processing."
        ],
        "prerequisites": [
            "10.9.1 (Native Event-Driven Stream).",
            "Algoritma Distributed Snapshot Chandy & Lamport (1985)."
        ],
        "commonPitfalls": [
            "Terjadinya Backpressure berat pada satu channel yang menyebabkan penundaan penyelarasan barrier (Barrier Alignment Delay), memicu lonjakan penggunaan buffer memory Flink.",
            "Mengabaikan mode unaligned checkpointing pada kluster dengan data skew tinggi, menyebabkan timeout kegagalan checkpoint."
        ],
        "academicReferences": [
            "Carbone, P., et al. (2015). Apache Flink: Stream and Batch Processing in a Single Engine. IEEE Data Engineering Bulletin, 38(4), 28–38.",
            "Chandy, K. M., & Lamport, L. (1985). Distributed Snapshots: Determining Global States of Distributed Systems. ACM Transactions on Computer Systems (TOCS), 3(1), 63–75."
        ],
        "caseStudy": "Platform pengawasan telekomunikasi di Ericsson memproses jutaan panggilan telepon per detik di atas kluster Flink 200 node. Pemanfaatan Asynchronous Barrier Snapshotting setiap 10 detik menjamin toleransi kesalahan stateful tanpa menghentikan pemrosesan stream (zero-pause snapshotting).",
        "content": {
            "theory": (
                "**Apache Flink** adalah mesin komputasi terdistribusi yang dirancang dengan filosofi *Stream-First*: pemrosesan batch diperlakukan sebagai kasus khusus dari pemrosesan stream terhingga. "
                "Untuk menyediakan garansi Exactly-Once tanpa menghentikan aliran data (*zero-pause*), Flink mengadaptasi algoritma klasik **Chandy-Lamport (1985)** ke dalam varian modern yang disebut **Asynchronous Barrier Snapshotting (ABS)**: "
                "Mekanisme kerja Barrier Snapshotting: "
                "1. **Penyisipan Barrier**: Koordinator checkpoint menyuntikkan pesan khusus yang disebut **Checkpoint Barrier** ($B_k$) ke dalam aliran data pada setiap stream source. "
                "2. **Barrier Flow**: Barrier mengalir bersama rekaman data normal tanpa mendahului atau tertinggal dari data di sekitarnya. "
                "3. **Barrier Alignment**: Ketika suatu operator menerima input dari beberapa channel paralel: "
                "Operator menunggu hingga menerima Barrier $B_k$ dari **seluruh channel input** sebelum mengambil snapshot state lokalnya: "
                "$$\\text{SnapshotTriggered}(k) \\iff \\forall c \\in \\text{InputChannels}, \\quad B_k \\in c$$ "
                "4. **Asynchronous State Upload**: Operator menyimpan state memori lokalnya secara asinkron ke penyimpanan objek persisten (S3/HDFS), sementara pemrosesan data stream terus berlanjut tanpa jeda blokade (*lock-free*)."
            ),
            "realWorldApplication": (
                "Alibaba dan Uber mengoperasikan kluster Apache Flink terbesar di dunia dengan jutaan core untuk melayani kueri analitik real-time menggunakan checkpointing asinkron."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Asynchronous Barrier Snapshotting Apache Flink (Chandy-Lamport variant)\n"
                "class FlinkBarrierAlignmentSimulator:\n"
                "    def __init__(self, num_input_channels=2):\n"
                "        self.num_channels = num_input_channels\n"
                "        self.received_barriers = {}\n"
                "        self.operator_state = {'counter': 0}\n"
                "        self.persisted_snapshots = []\n"
                "        \n"
                "    def receive_input(self, channel_id, item):\n"
                "        # Jika item adalah Barrier Checkpoint\n"
                "        if isinstance(item, str) and item.startswith('BARRIER_'):\n"
                "            barrier_id = item\n"
                "            if barrier_id not in self.received_barriers:\n"
                "                self.received_barriers[barrier_id] = set()\n"
                "            self.received_barriers[barrier_id].add(channel_id)\n"
                "            \n"
                "            # Periksa apakah seluruh channel telah menyelaraskan barrier (Alignment Complete)\n"
                "            if len(self.received_barriers[barrier_id]) == self.num_channels:\n"
                "                # Ambil snapshot state operator secara atomik!\n"
                "                snapshot_data = self.operator_state.copy()\n"
                "                self.persisted_snapshots.append({'barrier': barrier_id, 'state': snapshot_data})\n"
                "                del self.received_barriers[barrier_id]\n"
                "                return {'action': 'SNAPSHOT_TAKEN', 'barrier': barrier_id, 'state': snapshot_data}\n"
                "            else:\n"
                "                return {'action': 'WAITING_FOR_ALIGNMENT', 'received_from': list(self.received_barriers[barrier_id])}\n"
                "                \n"
                "        # Jika item adalah data stream normal: proses dan mutasi state\n"
                "        self.operator_state['counter'] += item\n"
                "        return {'action': 'PROCESSED', 'state': self.operator_state['counter']}\n"
                "\n"
                "operator = FlinkBarrierAlignmentSimulator(num_input_channels=2)\n"
                "# Channel 0 memproses data dan mengirim Barrier #1\n"
                "operator.receive_input(channel_id=0, item=10)\n"
                "a1 = operator.receive_input(channel_id=0, item='BARRIER_1')\n"
                "\n"
                "# Channel 1 memproses data lalu mengirim Barrier #1 (Alignment Selesai!)\n"
                "operator.receive_input(channel_id=1, item=25)\n"
                "a2 = operator.receive_input(channel_id=1, item='BARRIER_1')\n"
                "\n"
                "print('Demonstrasi Asynchronous Barrier Snapshotting Apache Flink:')\n"
                "print(f'  Channel 0 Kirim Barrier 1: {a1[\"action\"]} (Menunggu channel 1)')\n"
                "print(f'  Channel 1 Kirim Barrier 1: {a2[\"action\"]} -> State Terkunci={a2.get(\"state\")}')\n"
                "print(f'  Snapshot Tersimpan di Storage Persisten: {operator.persisted_snapshots}')\n"
                "print('Kesimpulan: Barrier mengalir bersama data untuk snapshotting global tanpa downtime.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.9.10
    {
        "id": "10.9.10",
        "title": "Studi Kasus Deteksi Penipuan (Real-Time Fraud Detection) dengan PySpark Streaming",
        "learningObjectives": [
            "Merancang arsitektur pipeline deteksi anomali penipuan finansial secara real-time dari stream Kafka.",
            "Mengimplementasikan integrasi Stateful Windowing dan penilaian skor risiko (Risk Scoring) pada transaksi perbankan.",
            "Memvalidasi pengujian simulasi deteksi transaksi abnormal berkecepatan tinggi dengan peringatan seketika."
        ],
        "prerequisites": [
            "10.9.1 hingga 10.9.9.",
            "10.8.10 (Kafka Client Python)."
        ],
        "commonPitfalls": [
            "Melakukan panggilan HTTP synchronous ke API eksternal di dalam loop streaming untuk setiap transaksi, memicu bottleneck latensi jaringan.",
            "Mengabaikan cold-start problem saat pengguna baru bertransaksi tanpa profil historis yang tersimpan di state store."
        ],
        "academicReferences": [
            "Armbrust, M., et al. (2018). Structured Streaming: A Declarative API for Real-Time Applications in Apache Spark. ACM SIGMOD 2018.",
            "Carbone, P., et al. (2015). Apache Flink: Stream and Batch Processing in a Single Engine. IEEE Data Engineering Bulletin."
        ],
        "caseStudy": "Sebuah fintech bank digital mendeteksi serangan pengurasan rekening (Card Testing Attack) yang mengirim 20 otorisasi mikro per detik. Pipeline Structured Streaming dengan sliding window 1 menit dan stateful anomaly scoring memblokir kartu dalam waktu 250 milidetik setelah mendeteksi lonjakan transaksi.",
        "content": {
            "theory": (
                "Praktikum studi kasus ini menyatukan seluruh konsep teoritis stream processing yang telah dipelajari pada Bab 8 dan Bab 9 ke dalam implementasi arsitektur **Deteksi Penipuan Finansial Waktu Nyata (Real-Time Fraud Detection Pipeline)**. "
                "Arsitektur pipeline produksi beroperasi melalui tahapan terkoordinasi: "
                "1. **Ingestion Layer (Apache Kafka)**: Transaksi pembayaran dari ribuan terminal POS dan aplikasi mobile diserap ke dalam topik terdistribusi `transactions.raw` dengan partisi berbasis `account_id` untuk menjamin ketertiban urutan lokal. "
                "2. **Stateful Streaming Processing Engine**: Mesin streaming mengeksekusi penilaian anomali multi-faktor: "
                "   - *Velocity Rule*: Menghitung frekuensi transaksi akun dalam jendela geser (Sliding Window) 5 menit: "
                "$$\\text{Velocity}(\\text{acc}, W) = \\sum_{t \\in W} \\mathbb{I}(\\text{Account} = \\text{acc})$$ "
                "   - *Amount Volatility*: Membandingkan nilai transaksi terkini terhadap deviasi standar historis di state store: "
                "$$Z_{\\text{score}} = \\frac{\\text{Amount} - \\mu_{\\text{hist}}}{\\sigma_{\\text{hist}}}$$ "
                "3. **Alert & Action Sink**: Jika $\\text{Velocity} > \\theta_{\\text{freq}}$ atau $Z_{\\text{score}} > \\theta_{\\text{risk}}$, sistem secara instan mengirimkan instruksi pembekuan rekening sementara ke topik Kafka `fraud.alerts` dengan garansi Exactly-Once."
            ),
            "realWorldApplication": (
                "Mastercard dan Visa memproses puluhan ribu otorisasi transaksi per detik menggunakan pipeline streaming terdistribusi untuk mendeteksi penipuan dalam jendela waktu < 100 milidetik."
            ),
            "codeSnippet": (
                "# Implementasi Praktikum End-to-End: Pipeline Deteksi Penipuan Streaming (Real-Time Fraud Engine)\n"
                "class RealTimeFraudDetectionPipeline:\n"
                "    def __init__(self, velocity_threshold=3, amount_threshold=1000.0):\n"
                "        self.vel_limit = velocity_threshold\n"
                "        self.amount_limit = amount_threshold\n"
                "        # In-memory State Store per akun: {account_id: [recent_timestamps]}\n"
                "        self.account_history = {}\n"
                "        \n"
                "    def process_transaction_stream(self, tx_event):\n"
                "        acc = tx_event['account_id']\n"
                "        amount = tx_event['amount']\n"
                "        ts = tx_event['timestamp']\n"
                "        \n"
                "        # 1. Bersihkan riwayat transaksi di luar sliding window 60 detik\n"
                "        if acc not in self.account_history:\n"
                "            self.account_history[acc] = []\n"
                "        self.account_history[acc] = [t for t in self.account_history[acc] if ts - t <= 60]\n"
                "        \n"
                "        # 2. Tambahkan transaksi terkini ke state\n"
                "        self.account_history[acc].append(ts)\n"
                "        current_velocity = len(self.account_history[acc])\n"
                "        \n"
                "        # 3. Evaluasi Aturan Anomali Fraud\n"
                "        is_fraud = False\n"
                "        reasons = []\n"
                "        \n"
                "        if current_velocity > self.vel_limit:\n"
                "            is_fraud = True\n"
                "            reasons.append(f'High Velocity Spike ({current_velocity} transaksi dalam 60s)')\n"
                "            \n"
                "        if amount >= self.amount_limit:\n"
                "            is_fraud = True\n"
                "            reasons.append(f'High Value Anomaly (${amount:,.2f} >= batas ${self.amount_limit})')\n"
                "            \n"
                "        return {\n"
                "            'tx_id': tx_event['tx_id'],\n"
                "            'account_id': acc,\n"
                "            'amount': amount,\n"
                "            'is_fraud_alert': is_fraud,\n"
                "            'reasons': reasons,\n"
                "            'velocity_in_window': current_velocity\n"
                "        }\n"
                "\n"
                "pipeline = RealTimeFraudDetectionPipeline(velocity_threshold=3, amount_threshold=1000.0)\n"
                "\n"
                "# Aliran transaksi simulasi pengguna ACC-991 (Lonjakan transaksi beruntun dalam 10 detik)\n"
                "stream_feed = [\n"
                "    {'tx_id': 'TX-1', 'account_id': 'ACC-991', 'amount': 150.0, 'timestamp': 1000},\n"
                "    {'tx_id': 'TX-2', 'account_id': 'ACC-991', 'amount': 200.0, 'timestamp': 1002},\n"
                "    {'tx_id': 'TX-3', 'account_id': 'ACC-991', 'amount': 180.0, 'timestamp': 1005},\n"
                "    {'tx_id': 'TX-4', 'account_id': 'ACC-991', 'amount': 250.0, 'timestamp': 1008}, # Memicu Velocity Alert (> 3)\n"
                "    {'tx_id': 'TX-5', 'account_id': 'ACC-102', 'amount': 2500.0, 'timestamp': 1010} # Memicu High Value Alert\n"
                "]\n"
                "\n"
                "print('Hasil Eksekusi Real-Time Fraud Detection Pipeline:')\n"
                "for tx in stream_feed:\n"
                "    res = pipeline.process_transaction_stream(tx)\n"
                "    status_flag = '🚨 FRAUD ALERT' if res['is_fraud_alert'] else '✅ PASSED'\n"
                "    print(f'  [{res[\"tx_id\"]}] Akun={res[\"account_id\"]} Nilai=${res[\"amount\"]:6.2f} -> {status_flag}')\n"
                "    if res['is_fraud_alert']:\n"
                "        print(f'     Alasan Pemicu: {res[\"reasons\"]}')\n"
                "print('Kesimpulan: Stateful sliding window berhasil mendeteksi serangan penipuan secara instan.')"
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

print(f"[OK] Berhasil menghasilkan 10 subbab Bab 9 Topik 10 ke {output_file}")
