import json
import os
import sys
import io
import zlib
import struct
import numpy as np

output_file = os.path.join(os.path.dirname(__file__), "de_ch8_data.json")

subchapters = [
    # 10.8.1
    {
        "id": "10.8.1",
        "title": "Konsep Event Streaming & Log Terdistribusi Append-Only",
        "learningObjectives": [
            "Membedakan paradigma antrean pesan tradisional (Message Queues) dengan log commit terdistribusi append-only.",
            "Menganalisis makalah kanonikal Jay Kreps, Neha Narkhede, dan Jun Rao (ACM NetDB 2011) mengenai arsitektur Apache Kafka.",
            "Mengimplementasikan model log terdistribusi append-only dengan pengalamatan offset sekuensial dan zero-copy retrieval."
        ],
        "prerequisites": [
            "10.1.4 (Paradigma Batch vs Streaming).",
            "Struktur Data Log Sequential & Sistem File Biner."
        ],
        "commonPitfalls": [
            "Memperlakukan Kafka seperti broker pesan AMQP (RabbitMQ) dengan mengharapkan pesan otomatis terhapus dari log setelah dibaca oleh consumer.",
            "Mengabaikan biaya random disk seeks saat menulis log; Kafka mencapai throughput jutaan event per detik murni karena operasi penulisan sekuensial (Sequential I/O)."
        ],
        "academicReferences": [
            "Kreps, J., Narkhede, N., & Rao, J. (2011). Kafka: a Distributed Messaging System for Log Processing. In Proceedings of 6th International Workshop on Networking Meets Databases (NetDB 11), 1–7.",
            "Kleppmann, M. (2017). Designing Data-Intensive Applications. O'Reilly Media."
        ],
        "caseStudy": "LinkedIn memproses lebih dari 7 triliun pesan event streaming setiap hari di atas Apache Kafka. Menggantikan antrean pesan berbasis database dengan log terdistribusi append-only meningkatkan throughput transfer data sebesar 100x lipat dan memangkas latensi end-to-end menjadi sub-detik.",
        "content": {
            "theory": (
                "Dalam arsitektur data enterprise tradisional, pertukaran data antar-layanan mengandalkan Message Queues (seperti RabbitMQ, ActiveMQ) di mana pesan disimpan sementara dan dihapus segera setelah di-acknowledge oleh consumer tunggal. "
                "Pendekatan ini runtuh ketika volume data telemetri web meledak menjadi miliaran event yang harus dikonsumsi secara bersamaan oleh puluhan sistem hilir (Search, Machine Learning, Data Lake, Fraud Detection). "
                "Makalah kanonikal oleh **Jay Kreps, Neha Narkhede, dan Jun Rao (ACM NetDB 2011)** mendefinisikan paradigma revolusioner ini: "
                "> \"Log processing has become a critical component of the data pipeline for consumer internet companies. We introduce Kafka, a distributed messaging system that we developed for collecting and delivering high volumes of log data with low latency. Our system incorporates ideas from existing log aggregators and messaging systems, and is suitable for both offline and online message consumption. We made quite a few unconventional yet practical design choices in Kafka to make our system efficient and scalable. Our experimental results show that Kafka has superior performance when compared to two popular messaging systems. We have been using Kafka in production for some time and it is processing hundreds of gigabytes of new data each day.\" "
                "Fondasi teknis Apache Kafka bertumpu pada **Log Terdistribusi Append-Only**: "
                "Sebuah deret rekaman biner terurut dan kekal (*immutable sequence of records*) yang hanya dapat ditambah di bagian akhir (*append-only*): "
                "$$\\text{Log} = [R_0, R_1, R_2, \\dots, R_k] \\quad \\text{dengan indeks offset } k \\in \\mathbb{N}_0$$ "
                "Karakteristik kunci: (1) Penulisan sekuensial disk menandingi throughput memori RAM ($> 600$ MB/s pada disk modern), (2) Pesan tidak dihapus saat dibaca, memungkinkan pembacaan berulang (*replayability*) oleh banyak kelompok konsumen independen, dan (3) Pemanfaatan *OS PageCache* dan panggilan sistem `sendfile` untuk transfer zero-copy langsung ke soket jaringan."
            ),
            "realWorldApplication": (
                "Netflix, Uber, dan ribuan institusi finansial dunia menggunakan Apache Kafka sebagai saraf pusat (*central event bus*) yang menghubungkan microservices dan real-time AI pipelines."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Log Terdistribusi Append-Only (Kreps et al., 2011)\n"
                "class AppendOnlyDistributedLog:\n"
                "    def __init__(self, topic_name, partition_id=0):\n"
                "        self.topic = topic_name\n"
                "        self.partition = partition_id\n"
                "        self.log_entries = []  # Simulasi berkas log fisik di disk\n"
                "        self.next_offset = 0\n"
                "        \n"
                "    def append(self, key, payload):\n"
                "        # Penulisan sekuensial murni: sematkan offset monoton naik\n"
                "        current_offset = self.next_offset\n"
                "        record = {\n"
                "            'offset': current_offset,\n"
                "            'key': key,\n"
                "            'payload': payload\n"
                "        }\n"
                "        self.log_entries.append(record)\n"
                "        self.next_offset += 1\n"
                "        return current_offset\n"
                "        \n"
                "    def read_from_offset(self, start_offset, max_messages=10):\n"
                "        # Pembacaan sekuensial berkecepatan tinggi berbasis offset\n"
                "        if start_offset >= len(self.log_entries):\n"
                "            return []\n"
                "        return self.log_entries[start_offset : start_offset + max_messages]\n"
                "\n"
                "log = AppendOnlyDistributedLog(topic_name='user_activity_stream', partition_id=0)\n"
                "\n"
                "# Produser menambahkan 4 event transaksi sekuensial\n"
                "off0 = log.append('user_101', {'event': 'LOGIN', 'ts': 1710000001})\n"
                "off1 = log.append('user_102', {'event': 'ADD_TO_CART', 'ts': 1710000002})\n"
                "off2 = log.append('user_101', {'event': 'CHECKOUT', 'ts': 1710000003})\n"
                "off3 = log.append('user_103', {'event': 'SEARCH', 'ts': 1710000004})\n"
                "\n"
                "# Konsumen 1 (Real-time Fraud): Baca dari offset 1\n"
                "fraud_events = log.read_from_offset(start_offset=1, max_messages=2)\n"
                "# Konsumen 2 (Data Warehouse Replay): Baca ulang dari offset awal 0\n"
                "dwh_events = log.read_from_offset(start_offset=0, max_messages=4)\n"
                "\n"
                "print(f'Status Log Kafka [{log.topic}-P{log.partition}]:')\n"
                "print(f'  Next Offset Tersedia: {log.next_offset}')\n"
                "print('  Konsumsi 1 (Real-Time Service, Start Offset=1):')\n"
                "for r in fraud_events:\n"
                "    print(f'    - Offset #{r[\"offset\"]}: Key={r[\"key\"]} | Data={r[\"payload\"][\"event\"]}')\n"
                "print(f'  Konsumsi 2 (Audit Replay, Total Terbaca): {len(dwh_events)} event dari offset 0')\n"
                "print('Kesimpulan: Log append-only mendukung multi-consumer replay tanpa menghapus data.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.8.2
    {
        "id": "10.8.2",
        "title": "Arsitektur Klaster Apache Kafka: Brokers, Controllers (KRaft), dan ZooKeeper",
        "learningObjectives": [
            "Memahami arsitektur klaster Kafka dan peran Broker Node dalam menyimpan partisi log.",
            "Menganalisis pergeseran arsitektur dari koordinasi ZooKeeper menuju KRaft (Kafka Raft Metadata Mode - KIP-500).",
            "Mengimplementasikan simulator konsensus metadata KRaft untuk pemilihan controller quorum."
        ],
        "prerequisites": [
            "10.8.1 (Konsep Event Streaming & Log).",
            "Algoritma Konsensus Terdistribusi (Raft Consensus Protocol)."
        ],
        "commonPitfalls": [
            "Menjalankan arsitektur lama berbasis ZooKeeper pada kluster jutaan partisi, memicu latensi sinkronisasi metadata pohon znode yang lambat.",
            "Mengabaikan konfigurasi quorum controller KRaft (jumlah voter ganjil minimal 3 node), menyebabkan risiko split-brain."
        ],
        "academicReferences": [
            "Kreps, J., et al. (2011). Kafka: a Distributed Messaging System for Log Processing. NetDB 2011.",
            "Ongaro, D., & Ousterhout, J. (2014). In Search of an Understandable Consensus Algorithm. USENIX ATC 2014."
        ],
        "caseStudy": "Kluster Kafka berskala 500 node di sebuah bank digital memigrasikan kluster dari ZooKeeper ke KRaft. Waktu pemulihan saat controller broker crash menyusut drastis dari 4.5 menit menjadi 200 milidetik, dan skalabilitas partisi per kluster meningkat dari 200.000 menjadi jutaan partisi.",
        "content": {
            "theory": (
                "Sebuah kluster Apache Kafka terdiri dari sekumpulan server independen yang disebut **Brokers**. "
                "Setiap broker bertanggung jawab untuk menerima pesan dari producer, menulisnya ke berkas segmen disk lokal, dan melayani pembacaan consumer. "
                "Secara historis, kluster Kafka mengandalkan sistem koordinasi eksternal **Apache ZooKeeper** untuk memelihara metadata kluster (daftar broker aktif, status partisi, dan penugasan leader). "
                "Namun, ZooKeeper menimbulkan batasan skalabilitas parah (bottleneck sinkronisasi metadata saat jutaan partisi beroperasi). "
                "Melalui inisiatif **KIP-500**, Kafka memperkenalkan **KRaft (Kafka Raft Metadata Mode)**: "
                "KRaft mengeliminasi ZooKeeper secara total dan mengintegrasikan protokol konsensus Raft langsung ke dalam broker Kafka: "
                "1. **Metadata Quorum**: Sekelompok broker khusus dipilih sebagai *Controller Nodes*. Metadata kluster diperlakukan persis seperti topik Kafka internal bernama `@metadata`. "
                "2. **Active Controller**: Satu controller bertindak sebagai *Leader* yang menerima seluruh permintaan mutasi metadata (misal penambahan topik, perubahan partisi). "
                "3. **Event-Driven Propagation**: Perubahan metadata direplikasi secara instan ke seluruh broker pengikut (*follower brokers*) melalui log Raft internal: "
                "$$T_{\\text{failover}}(\\text{KRaft}) \\approx \\mathcal{O}(\\text{Raft Election}) \\ll T_{\\text{failover}}(\\text{ZooKeeper})$$"
            ),
            "realWorldApplication": (
                "Apache Kafka versi 3.3+ secara resmi mendeklarasikan KRaft siap untuk beban kerja produksi (Production-Ready), dan ZooKeeper sepenuhnya dihapus pada Kafka 4.0."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Quorum Metadata KRaft Controller (KIP-500 Consensus)\n"
                "class KRaftControllerQuorumSimulator:\n"
                "    def __init__(self, voter_node_ids):\n"
                "        self.voters = voter_node_ids\n"
                "        self.current_term = 0\n"
                "        self.active_leader = None\n"
                "        self.metadata_log = []\n"
                "        \n"
                "    def elect_leader(self, candidate_id):\n"
                "        self.current_term += 1\n"
                "        # Membutuhkan suara mayoritas kuorum: floor(N/2) + 1\n"
                "        votes = [v for v in self.voters]\n"
                "        majority = (len(self.voters) // 2) + 1\n"
                "        \n"
                "        if len(votes) >= majority:\n"
                "            self.active_leader = candidate_id\n"
                "            print(f'  [KRAFT ELECTION] Node {candidate_id} terpilih sebagai Active Controller Term {self.current_term} ({len(votes)}/{len(self.voters)} suara)')\n"
                "            return True\n"
                "        return False\n"
                "        \n"
                "    def commit_metadata_record(self, record_type, details):\n"
                "        if self.active_leader is None:\n"
                "            raise RuntimeError('Tidak ada active controller!')\n"
                "        log_entry = {\n"
                "            'term': self.current_term,\n"
                "            'leader': self.active_leader,\n"
                "            'type': record_type,\n"
                "            'details': details\n"
                "        }\n"
                "        self.metadata_log.append(log_entry)\n"
                "        return len(self.metadata_log) - 1\n"
                "\n"
                "quorum = KRaftControllerQuorumSimulator(voter_node_ids=[1, 2, 3])\n"
                "quorum.elect_leader(candidate_id=1)\n"
                "\n"
                "# Leader mencatat pembuatan topik baru langsung ke @metadata log\n"
                "offset0 = quorum.commit_metadata_record('REGISTER_BROKER', {'broker_id': 101, 'host': 'broker-1.internal'})\n"
                "offset1 = quorum.commit_metadata_record('CREATE_TOPIC', {'topic': 'orders', 'partitions': 8, 'replication': 3})\n"
                "\n"
                "print(f'Status KRaft Metadata Quorum (Term {quorum.current_term}):')\n"
                "print(f'  Active Controller: Node #{quorum.active_leader}')\n"
                "print(f'  Entri Log @metadata Terkini ({len(quorum.metadata_log)} record):')\n"
                "for idx, m in enumerate(quorum.metadata_log):\n"
                "    print(f'    [Metadata #{idx}] Tipe={m[\"type\"]:16s} | Details={m[\"details\"]}')\n"
                "print('Kesimpulan: KRaft memusatkan konsensus metadata internal tanpa dependensi ZooKeeper.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.8.3
    {
        "id": "10.8.3",
        "title": "Topik, Partisi, dan Replikasi (Replication Factor)",
        "learningObjectives": [
            "Memahami hubungan hierarkis antara Topik, Partisi terdistribusi, dan Faktor Replikasi (Replication Factor).",
            "Menganalisis mekanisme kerja Leader Partition, Follower Replicas, dan In-Sync Replicas (ISR).",
            "Mengimplementasikan simulator replikasi partisi Kafka dengan pelacakan High Watermark (HW) dan Log End Offset (LEO)."
        ],
        "prerequisites": [
            "10.8.1 (Log Append-Only).",
            "10.1.3 (Prinsip Toleransi Kesalahan Sistem Terdistribusi)."
        ],
        "commonPitfalls": [
            "Mengatur `min.insync.replicas` sama dengan `replication.factor`, menyebabkan produser gagal menulis setiap kali ada satu broker yang sedang restart untuk maintenance rutin.",
            "Membuat ribuan partisi pada kluster kecil tanpa kapasitas disk controller yang memadai, memicu keterlambatan replikasi dan lag."
        ],
        "academicReferences": [
            "Kreps, J., et al. (2011). Kafka: a Distributed Messaging System for Log Processing. NetDB 2011.",
            "Wang, G., et al. (2015). Building a Replicated Logging System with Apache Kafka. Proceedings of the VLDB Endowment, 8(12), 1654–1655."
        ],
        "caseStudy": "Sebuah gateway pembayaran memproses 50.000 otorisasi kartu per detik. Topik `card_transactions` dikonfigurasi dengan `replication.factor=3` dan `min.insync.replicas=2`. Ketika satu broker data center mengalami pemadaman listrik mendadak, transaksi tetap berjalan tanpa ada satu data pun yang hilang (zero data loss).",
        "content": {
            "theory": (
                "Dalam arsitektur Kafka, data diorganisasikan secara logis ke dalam **Topik (Topics)**. "
                "Untuk mendukung skalabilitas horizontal melintasi banyak server, setiap Topik dipecah menjadi beberapa **Partisi (Partitions)** fisik yang dapat ditempatkan pada broker yang berbeda-beda. "
                "Untuk menjamin ketersediaan tinggi dan toleransi kegagalan perangkat keras, Kafka menerapkan mekanisme **Replikasi Partisi (Partition Replication)**: "
                "1. **Leader Replica**: Tepat satu broker bertindak sebagai Leader untuk setiap partisi. Seluruh operasi penulisan (*writes*) dari producer dan operasi pembacaan (*reads*) dari consumer secara default dilayani oleh Leader. "
                "2. **Follower Replicas**: Broker-broker lain bertindak sebagai pengikut pasif yang terus menarik (*fetch*) pesan dari Leader untuk menyelaraskan status log lokal mereka. "
                "3. **In-Sync Replicas (ISR)**: Himpunan replika (termasuk Leader) yang status log-nya selalu mutakhir mengikuti Leader dalam jendela waktu toleransi `replica.lag.time.max.ms`: "
                "$$\\text{ISR} = \\{ r \\in \\text{Replicas} \\mid \\text{LagTime}(r) \\le \\Delta_{\\text{max}} \\}$$ "
                "4. **High Watermark (HW)** vs **Log End Offset (LEO)**: "
                "   - *LEO*: Offset rekaman berikutnya yang akan ditulis ke log pada replika tertentu. "
                "   - *HW*: Offset tertinggi yang telah berhasil direplikasi ke **seluruh anggota ISR**. "
                "Hanya pesan di bawah High Watermark yang diizinkan untuk dibaca oleh consumer, menjamin bahwa consumer tidak akan pernah membaca pesan yang berpotensi hilang saat terjadi pergantian Leader."
            ),
            "realWorldApplication": (
                "Rekomendasi standar produksi perbankan dan enterprise untuk topik kritis adalah `replication.factor=3` dan `min.insync.replicas=2` pada 3 Availability Zones (AZ) terpisah."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Replikasi Partisi Kafka: Leader, Follower ISR, & High Watermark (HW)\n"
                "class PartitionReplicaSimulator:\n"
                "    def __init__(self, partition_id, replica_ids, min_isr=2):\n"
                "        self.partition_id = partition_id\n"
                "        self.leader_id = replica_ids[0]\n"
                "        self.followers = replica_ids[1:]\n"
                "        self.min_isr = min_isr\n"
                "        self.isr = set(replica_ids)\n"
                "        # Status log di masing-masing broker: {broker_id: [messages]}\n"
                "        self.logs = {b: [] for b in replica_ids}\n"
                "        self.high_watermark = 0\n"
                "        \n"
                "    def write_leader(self, payload):\n"
                "        # 1. Tulis ke Leader (Log End Offset Leader bertambah)\n"
                "        self.logs[self.leader_id].append(payload)\n"
                "        leo_leader = len(self.logs[self.leader_id])\n"
                "        \n"
                "        # 2. Replikasi ke Followers ISR\n"
                "        for f in self.followers:\n"
                "            if f in self.isr:\n"
                "                self.logs[f].append(payload)\n"
                "                \n"
                "        # 3. Hitung High Watermark (minimum LEO di seluruh anggota ISR)\n"
                "        min_leo_isr = min(len(self.logs[b]) for b in self.isr)\n"
                "        self.high_watermark = min_leo_isr\n"
                "        return {'committed_offset': self.high_watermark - 1, 'hw': self.high_watermark}\n"
                "        \n"
                "    def read_consumer(self):\n"
                "        # Consumer hanya diizinkan membaca pesan di bawah High Watermark!\n"
                "        return self.logs[self.leader_id][: self.high_watermark]\n"
                "\n"
                "sim = PartitionReplicaSimulator(partition_id=0, replica_ids=[101, 102, 103], min_isr=2)\n"
                "res1 = sim.write_leader({'tx': 'A1', 'val': 100})\n"
                "res2 = sim.write_leader({'tx': 'A2', 'val': 250})\n"
                "\n"
                "visible_to_consumer = sim.read_consumer()\n"
                "\n"
                "print(f'Status Replikasi Partisi 0 (Leader: Broker #{sim.leader_id}, ISR={sim.isr}):')\n"
                "print(f'  High Watermark Terkini: {sim.high_watermark}')\n"
                "print('  Kondisi Log Fisik Tiap Broker:')\n"
                "for b_id, records in sim.logs.items():\n"
                "    print(f'    - Broker {b_id}: LEO={len(records)} | Records={[r[\"tx\"] for r in records]}')\n"
                "print(f'  Pesan Terbaca Consumer: {[r[\"tx\"] for r in visible_to_consumer]} (Di bawah batas HW)')\n"
                "print('Kesimpulan: High Watermark menjamin konsistensi pembacaan data antar-replika.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.8.4
    {
        "id": "10.8.4",
        "title": "Struktur Pesan Kafka: Key, Value, Timestamp, dan Headers",
        "learningObjectives": [
            "Memahami struktur internal format biner record Kafka (RecordBatch V2).",
            "Menganalisis fungsi semantik setiap field: Key (partisi/ordering), Value (payload), Timestamp (event/ingest), dan Headers (metadata tracing).",
            "Mengimplementasikan serializer dan deserializer biner mandiri lengkap dengan perhitungan checksum CRC32."
        ],
        "prerequisites": [
            "10.8.1 (Log Append-Only).",
            "Format Serialisasi Biner & Algoritma Checksum CRC32."
        ],
        "commonPitfalls": [
            "Mengirimkan pesan dengan Key bernilai `null` saat urutan kejadian mutlak diperlukan, menyebabkan pesan terlempar ke partisi acak dan merusak urutan bisnis.",
            "Menyimpan metadata pelacakan (*tracing correlation ID*) di dalam payload JSON alih-alih memanfaatkan Kafka Headers, memaksa consumer mem-parse seluruh payload."
        ],
        "academicReferences": [
            "Kreps, J., et al. (2011). Kafka: a Distributed Messaging System for Log Processing. NetDB 2011.",
            "Apache Kafka Official Specification: RecordBatch Format V2."
        ],
        "caseStudy": "Platform observabilitas telemetri di Uber mengadopsi Kafka Headers untuk menyematkan metadata `trace_id` OpenTelemetry pada 2 juta pesan per detik. Filter gateway dapat merutekan pesan anomali langsung di tingkat broker tanpa perlu mendeserialisasi payload biner yang berat.",
        "content": {
            "theory": (
                "Dalam sistem Apache Kafka, data tidak disimpan sebagai teks mentah melainkan sebagai **Record Batch Biner (V2 Format)** yang sangat teroptimasi. "
                "Sebuah record Kafka individual memuat lima elemen struktural fundamental: "
                "1. **Key**: Array byte yang digunakan oleh partitioner untuk menentukan partisi target. Seluruh pesan dengan key yang sama dijamin mendarat pada partisi yang sama (*per-key ordering guarantee*). "
                "2. **Value**: Payload isi data aktual (dapat berupa teks JSON, biner Apache Avro, Protobuf, atau byte array mentah). "
                "3. **Timestamp**: Integer 64-bit yang merepresentasikan waktu kejadian. Dapat dikonfigurasi sebagai *CreateTime* (Event Time saat dibuat produser) atau *LogAppendTime* (Ingestion Time saat ditulis broker). "
                "4. **Headers**: Pasangan *key-value* metadata opsional yang disematkan pada pesan tanpa memodifikasi payload utama (ideal untuk context propagation, JWT token, schema ID, dan tracing headers). "
                "5. **CRC32 Checksum & Attributes**: Kode redundansi siklis untuk mendeteksi korupsi data akibat kerusakan bit disk atau jaringan: "
                "$$\\text{CRC32} = \\text{CRC}(\\text{Magic} \\parallel \\text{Attributes} \\parallel \\text{Key} \\parallel \\text{Value} \\parallel \\text{Headers})$$"
            ),
            "realWorldApplication": (
                "Sistem tracing terdistribusi (Jaeger, Zipkin) menyematkan trace parent ID di Kafka Headers untuk melacak jalur request yang melintasi puluhan microservices."
            ),
            "codeSnippet": (
                "import struct\n"
                "import zlib\n"
                "\n"
                "# Implementasi Serializer & Deserializer Format Pesan Biner Kafka (Record V2)\n"
                "class KafkaRecordBinaryCodec:\n"
                "    @staticmethod\n"
                "    def encode_record(key_bytes, val_bytes, timestamp_ms, headers_dict):\n"
                "        # Serialisasi Headers: count + [key_len, key, val_len, val]\n"
                "        h_buf = bytearray()\n"
                "        h_buf.extend(struct.pack('<H', len(headers_dict)))\n"
                "        for hk, hv in headers_dict.items():\n"
                "            hk_bytes = hk.encode('utf-8')\n"
                "            hv_bytes = hv.encode('utf-8')\n"
                "            h_buf.extend(struct.pack('<H', len(hk_bytes)) + hk_bytes)\n"
                "            h_buf.extend(struct.pack('<H', len(hv_bytes)) + hv_bytes)\n"
                "            \n"
                "        # Payload sebelum CRC32: [timestamp (8B), key_len (4B), key, val_len (4B), val, headers]\n"
                "        body = bytearray()\n"
                "        body.extend(struct.pack('<Q', timestamp_ms))\n"
                "        body.extend(struct.pack('<I', len(key_bytes)) + key_bytes)\n"
                "        body.extend(struct.pack('<I', len(val_bytes)) + val_bytes)\n"
                "        body.extend(h_buf)\n"
                "        \n"
                "        # Hitung Checksum CRC32\n"
                "        crc = zlib.crc32(body) & 0xFFFFFFFF\n"
                "        # Header biner: [Magic Byte (1B) = 2, CRC32 (4B)]\n"
                "        return struct.pack('<B I', 2, crc) + bytes(body)\n"
                "\n"
                "k = b'user_404'\n"
                "v = b'{\"action\": \"BUY\", \"item_id\": 9921}'\n"
                "ts = 1710000500123\n"
                "headers = {'trace_id': 'abc-123-xyz', 'env': 'production'}\n"
                "\n"
                "encoded = KafkaRecordBinaryCodec.encode_record(k, v, ts, headers)\n"
                "\n"
                "print('Struktur Enkoding Biner Pesan Kafka:')\n"
                "print(f'  Magic Byte & CRC Header: {encoded[:5].hex()}')\n"
                "print(f'  Total Ukuran Payload   : {len(encoded)} bytes')\n"
                "print(f'  Key: {k.decode()} | Value: {v.decode()}')\n"
                "print(f'  Headers Disematkan     : {headers}')\n"
                "print('Kesimpulan: Format biner Kafka memadatkan metadata dan menjamin integritas via CRC32.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.8.5
    {
        "id": "10.8.5",
        "title": "Mekanisme Partisi Pesan: Murmur2 Hash vs Round-Robin",
        "learningObjectives": [
            "Memahami algoritma perutean partisi bawaan Kafka (DefaultPartitioner).",
            "Menganalisis fungsi hash Murmur2 32-bit dalam memetakan kunci ke nomor partisi deterministik.",
            "Mengimplementasikan algoritma Murmur2 hashing untuk memverifikasi jaminan urutan pesan lokal per-partisi."
        ],
        "prerequisites": [
            "10.8.4 (Struktur Pesan Kafka).",
            "Teori Fungsi Hash Non-Kriptografis (MurmurHash)."
        ],
        "commonPitfalls": [
            "Mengharapkan urutan pesan global lintas topik; Kafka hanya menjamin urutan FIFO secara ketat **di dalam partisi yang sama**.",
            "Menambahkan jumlah partisi pada topik aktif tanpa menyadari bahwa perubahan $N_{\\text{partitions}}$ akan mengubah hasil rumus modulo hash dan memecah urutan data masa lalu."
        ],
        "academicReferences": [
            "Appleby, A. (2008). MurmurHash2 Specification and Source Code.",
            "Kreps, J., et al. (2011). Kafka: a Distributed Messaging System for Log Processing. NetDB 2011."
        ],
        "caseStudy": "Sebuah e-commerce logistik menyematkan `order_id` sebagai Kafka message key. Berkat perutean Murmur2 hash ke 16 partisi, seluruh pembaruan status untuk pesanan tertentu ('DIBUAT', 'DIBAYAR', 'DIKIRIM') selalu masuk ke partisi yang sama dan diproses berurutan secara sempurna.",
        "content": {
            "theory": (
                "Ketika produser mengirimkan pesan ke suatu topik yang memiliki $N$ partisi, sistem harus menentukan partisi spesifik mana yang akan menerima pesan tersebut. "
                "Komponen **Partitioner** mengeksekusi logika perutean ini: "
                "1. **Pesan dengan Kunci (Keyed Messages)**: "
                "Jika produser menyertakan *Key* yang tidak kosong, Kafka menggunakan implementasi fungsi hash non-kriptografis **Murmur2** 32-bit. "
                "Nomor partisi target dihitung melalui rumus modulo: "
                "$$\\text{Partition}(K) = (\\text{toPositive}(\\text{Murmur2}(K))) \\pmod{N_{\\text{partitions}}}$$ "
                "Sifat deterministik Murmur2 menjamin bahwa: "
                "$$\\forall K_1, K_2, \\quad K_1 = K_2 \\implies \\text{Partition}(K_1) = \\text{Partition}(K_2)$$ "
                "Hal ini memberikan jaminan krusial bahwa **seluruh peristiwa untuk entitas bisnis yang sama akan tersimpan dan diproses secara terurut sesuai waktu kedatangan (Per-Key Strict Ordering)**. "
                "2. **Pesan Tanpa Kunci (Null-Key Messages)**: "
                "Jika key bernilai `null`, versi modern Kafka menerapkan *Sticky Partitioning*: pesan-pesan dikumpulkan dan dikirimkan ke partisi yang sama hingga mencapai ukuran batch penuh (`batch.size`), sebelum beralih ke partisi berikutnya secara round-robin guna memaksimalkan throughput dan rasio kompresi."
            ),
            "realWorldApplication": (
                "Sistem order-matching pada platform bursa saham dan cryptocurrency mewajibkan pengikatan akun ID sebagai message key untuk menjamin eksekusi perdagangan terurut tanpa race condition."
            ),
            "codeSnippet": (
                "import struct\n"
                "\n"
                "# Implementasi Algoritma Murmur2 Hashing 32-bit (Kafka DefaultPartitioner Specification)\n"
                "class KafkaMurmur2Partitioner:\n"
                "    @staticmethod\n"
                "    def murmur2(data_bytes):\n"
                "        # Konstanta Murmur2 32-bit standar Kafka\n"
                "        m = 0x5bd1e995\n"
                "        r = 24\n"
                "        length = len(data_bytes)\n"
                "        h = 0 ^ length\n"
                "        \n"
                "        idx = 0\n"
                "        while length >= 4:\n"
                "            k = struct.unpack_from('<I', data_bytes, idx)[0]\n"
                "            k = (k * m) & 0xFFFFFFFF\n"
                "            k ^= (k >> r)\n"
                "            k = (k * m) & 0xFFFFFFFF\n"
                "            h = (h * m) & 0xFFFFFFFF\n"
                "            h ^= k\n"
                "            idx += 4\n"
                "            length -= 4\n"
                "            \n"
                "        # Handle sisa byte (1-3 bytes)\n"
                "        if length == 3:\n"
                "            h ^= (data_bytes[idx + 2] << 16)\n"
                "        if length >= 2:\n"
                "            h ^= (data_bytes[idx + 1] << 8)\n"
                "        if length >= 1:\n"
                "            h ^= data_bytes[idx]\n"
                "            h = (h * m) & 0xFFFFFFFF\n"
                "            \n"
                "        h ^= (h >> 13)\n"
                "        h = (h * m) & 0xFFFFFFFF\n"
                "        h ^= (h >> 15)\n"
                "        return h\n"
                "        \n"
                "    @staticmethod\n"
                "    def get_partition(key_str, num_partitions=4):\n"
                "        b = key_str.encode('utf-8')\n"
                "        raw_hash = KafkaMurmur2Partitioner.murmur2(b)\n"
                "        # Kafka toPositive mask: hilangkan sign bit bitwise AND 0x7fffffff\n"
                "        positive_hash = raw_hash & 0x7FFFFFFF\n"
                "        return positive_hash % num_partitions\n"
                "\n"
                "# Uji perutean deterministik 5 entitas kunci pada 4 partisi\n"
                "test_keys = ['ORDER_1001', 'ORDER_1002', 'ORDER_1001', 'ORDER_1003', 'USER_VIP']\n"
                "partitions = [KafkaMurmur2Partitioner.get_partition(k, num_partitions=4) for k in test_keys]\n"
                "\n"
                "print('Hasil Perutean Partisi Kafka Berbasis Murmur2 Hash (4 Partisi):')\n"
                "for k, p in zip(test_keys, partitions):\n"
                "    print(f'  - Kunci \"{k:10s}\" -> Dialokasikan ke Partisi #{p}')\n"
                "print(f'Verifikasi Konsistensi: ORDER_1001 selalu ke Partisi #{partitions[0]} == #{partitions[2]} (Deterministik)')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.8.6
    {
        "id": "10.8.6",
        "title": "Consumer Groups & Rebalancing Protokol",
        "learningObjectives": [
            "Memahami model skalabilitas konsumsi data paralel melalui abstraksi Consumer Groups.",
            "Menganalisis protokol Consumer Group Rebalance: Eager Rebalance (Stop-the-world) vs Incremental Cooperative Rebalance.",
            "Mengimplementasikan simulator alokasi partisi dinamis saat ada konsumen baru yang bergabung ke dalam kelompok."
        ],
        "prerequisites": [
            "10.8.3 (Topik & Partisi).",
            "Konkurensi & Alokasi Beban Terdistribusi."
        ],
        "commonPitfalls": [
            "Membuat jumlah consumer di dalam satu group lebih banyak daripada jumlah partisi topik; kelebihan consumer tersebut akan menganggur (*idle*) 100% tanpa menerima data.",
            "Thread pemrosesan data memblokir terlalu lama (> `max.poll.interval.ms`), menyebabkan broker menganggap consumer telah mati dan memicu rebalance badai yang berulang."
        ],
        "academicReferences": [
            "Kreps, J., et al. (2011). Kafka: a Distributed Messaging System for Log Processing. NetDB 2011.",
            "Kafka Improvement Proposal KIP-429: Incremental Cooperative Rebalance Protocol."
        ],
        "caseStudy": "Sebuah consumer group analitik di Shopify sering mengalami jeda pemrosesan 30 detik setiap kali ada worker baru di-deploy (Eager Rebalance menangguhkan seluruh konsumsi). Migrasi ke Cooperative Sticky Assignor (KIP-429) mengeliminasi downtime rebalance menjadi zero-interruption untuk partisi yang tidak berpindah.",
        "content": {
            "theory": (
                "Untuk mendukung pemrosesan data paralel berkecepatan tinggi, Kafka memperkenalkan konsep **Kelompok Konsumen (Consumer Groups)**. "
                "Consumer Group menyatukan banyak proses konsumen di bawah satu identitas logis (`group.id`). "
                "Aturan mendasar alokasi partisi Kafka menetapkan bahwa: **Tepat satu konsumen di dalam kelompok yang sama yang diizinkan mengonsumsi tepat satu partisi pada satu waktu**: "
                "$$\\forall P_j, \\quad \\exists ! c \\in \\text{ConsumerGroup} \\quad \\text{s.t.} \\quad c \\text{ membaca } P_j$$ "
                "Jika jumlah konsumen $C > N_{\\text{partitions}}$, maka $(C - N)$ konsumen akan menganggur (*idle*). "
                "Ketika terjadi perubahan keanggotaan (konsumen baru bergabung, konsumen crash, atau partisi baru ditambahkan), sistem memicu proses **Rebalance**: "
                "1. **Eager Rebalance Protocol**: Seluruh konsumen melepaskan partisi mereka secara serentak (*stop-the-world pause*), lalu koordinator membagikan ulang partisi dari awal. "
                "2. **Incremental Cooperative Rebalance (KIP-429)**: Hanya partisi yang perlu dipindahkan yang dicabut dan ditugaskan ulang; konsumen yang tidak terpengaruh tetap melanjutkan pemrosesan data tanpa jeda."
            ),
            "realWorldApplication": (
                "Kubernetes Horizontal Pod Autoscaler (HPA) secara otomatis menambah atau mengurangi pod consumer Kafka berdasarkan metrik *consumer lag*."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Alokasi Partisi Consumer Group (Range & Round-Robin Assignor)\n"
                "class ConsumerGroupCoordinator:\n"
                "    @staticmethod\n"
                "    def assign_partitions_round_robin(consumer_ids, partition_ids):\n"
                "        if not consumer_ids:\n"
                "            return {}\n"
                "        assignments = {c: [] for c in consumer_ids}\n"
                "        # Bagikan partisi secara bergilir (Round-Robin)\n"
                "        for idx, p in enumerate(partition_ids):\n"
                "            assigned_c = consumer_ids[idx % len(consumer_ids)]\n"
                "            assignments[assigned_c].append(p)\n"
                "        return assignments\n"
                "\n"
                "# Skenario: Topik dengan 6 partisi (0 s.d. 5)\n"
                "topic_partitions = [0, 1, 2, 3, 4, 5]\n"
                "\n"
                "# Fase 1: 2 Consumer aktif di grup\n"
                "state_1 = ConsumerGroupCoordinator.assign_partitions_round_robin(['C-1', 'C-2'], topic_partitions)\n"
                "# Fase 2: Skala bertambah -> Consumer C-3 bergabung (Rebalance terjadi!)\n"
                "state_2 = ConsumerGroupCoordinator.assign_partitions_round_robin(['C-1', 'C-2', 'C-3'], topic_partitions)\n"
                "\n"
                "print(f'Alokasi Partisi Kafka Consumer Group ({len(topic_partitions)} Partisi):')\n"
                "print('Fase 1 (2 Konsumen):')\n"
                "for c, parts in state_1.items():\n"
                "    print(f'  - {c}: Mengonsumsi Partisi {parts} (Beban: {len(parts)} partisi)')\n"
                "print('Fase 2 (Pasca-Rebalance, 3 Konsumen):')\n"
                "for c, parts in state_2.items():\n"
                "    print(f'  - {c}: Mengonsumsi Partisi {parts} (Beban: {len(parts)} partisi)')\n"
                "print('Kesimpulan: Beban kerja terbagi seimbang sempurna (2 partisi/konsumen) pasca-rebalance.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.8.7
    {
        "id": "10.8.7",
        "title": "Manajemen Offset & Strategi Commit: Auto-Commit vs Manual Sync/Async",
        "learningObjectives": [
            "Memahami mekanisme pelacakan posisi konsumsi data melalui topik internal `__consumer_offsets`.",
            "Menganalisis risiko kehilangan data dan duplikasi pada Auto-Commit vs Manual Commit.",
            "Mengimplementasikan simulator strategi commit offset: Synchronous Commit vs Asynchronous Commit."
        ],
        "prerequisites": [
            "10.8.6 (Consumer Groups).",
            "10.1.7 (Semantik Pengiriman Data)."
        ],
        "commonPitfalls": [
            "Menggunakan `enable.auto.commit=true` pada pipeline transfer finansial, memicu risiko data hilang jika aplikasi crash di tengah pemrosesan batch.",
            "Memanggil `commitSync()` pada setiap pesan individual, memangkas throughput consumer dari 100.000 pesan/detik menjadi hanya 500 pesan/detik akibat latensi round-trip RPC."
        ],
        "academicReferences": [
            "Kreps, J., et al. (2011). Kafka: a Distributed Messaging System for Log Processing. NetDB 2011.",
            "Chambers, B., & Zaharia, M. (2018). Spark: The Definitive Guide. O'Reilly Media."
        ],
        "caseStudy": "Sebuah sistem pemrosesan transaksi perbankan mengalami duplikasi laporan rekening saat terjadi restart pod Kubernetes karena strategi auto-commit 5 detik. Mengubah implementasi ke Manual Asynchronous Commit dengan fallback Synchronous Commit pada shutdown mengeliminasi anomali duplikasi 100%.",
        "content": {
            "theory": (
                "Dalam sistem log terdistribusi, broker tidak melacak apakah suatu pesan telah dibaca oleh setiap konsumen secara individual. "
                "Sebagai gantinya, konsumen secara aktif mencatat posisi baca terakhir mereka yang disebut **Offset**. "
                "Kafka menyimpan offset konsumen di dalam topik internal yang sangat terdistribusi dan terkompresi bernama **`__consumer_offsets`**. "
                "Tiga strategi komitmen offset utama yang digunakan dalam industri: "
                "1. **Auto-Commit (`enable.auto.commit=true`)**: "
                "Konsumen secara periodik (setiap `auto.commit.interval.ms`, default 5 detik) melakukan commit terhadap offset tertinggi yang diterima dari fungsi `poll()`. "
                "Risiko: jika aplikasi mengalami kegagalan di tengah pemrosesan data, offset yang telah di-commit melebihi data yang sebenarnya selesai diproses, menyebabkan **Kehilangan Data (Data Loss)**. "
                "2. **Manual Synchronous Commit (`commitSync()`)**: "
                "Aplikasi secara eksplisit memanggil commit setelah seluruh batch pesan selesai diproses secara sukses. "
                "Karakteristik: thread eksekusi diblokir hingga broker mengembalikan acknowledgement sukses. Sangat aman dan reliabel, namun memiliki penalti latensi I/O. "
                "3. **Manual Asynchronous Commit (`commitAsync()`)**: "
                "Aplikasi mengirimkan permintaan commit offset ke broker tanpa memblokir thread eksekusi, memanfaatkan callback untuk penanganan kesalahan. "
                "Throughput sangat tinggi, ideal untuk beban kerja streaming latensi rendah."
            ),
            "realWorldApplication": (
                "Pola standar industri adalah memproses batch dengan `commitAsync()` di dalam loop utama, dan mengeksekusi `commitSync()` di blok `finally` saat shutdown aplikasi."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Manajemen Offset & Strategi Commit Consumer\n"
                "class ConsumerOffsetManagerSimulator:\n"
                "    def __init__(self):\n"
                "        self.committed_offsets = {}  # Simulasi topik __consumer_offsets\n"
                "        \n"
                "    def commit_sync(self, group_id, topic, partition, offset):\n"
                "        # Synchronous: Memblokir hingga ack tersimpan\n"
                "        key = f\"{group_id}:{topic}-{partition}\"\n"
                "        self.committed_offsets[key] = offset\n"
                "        return {'status': 'ACK_SYNC_COMMITTED', 'offset': offset}\n"
                "        \n"
                "    def simulate_failure_recovery(self, group_id, topic, partition, current_processed_offset, auto_committed_offset):\n"
                "        # Evaluasi anomali: jika crash terjadi, restart membaca dari committed offset terakhir\n"
                "        unprocessed_gap = current_processed_offset - auto_committed_offset\n"
                "        return {\n"
                "            'resumed_from_offset': auto_committed_offset,\n"
                "            'duplicate_records_reprocessed': max(0, unprocessed_gap)\n"
                "        }\n"
                "\n"
                "mgr = ConsumerOffsetManagerSimulator()\n"
                "group = 'risk_scoring_service'\n"
                "\n"
                "# Skenario: Batch 10 pesan (offset 100 - 109) selesai diproses secara sukses\n"
                "res = mgr.commit_sync(group, 'payments', partition=0, offset=110)\n"
                "\n"
                "# Skenario Crash pada Auto-Commit: Terakhir commit di offset 100, crash di offset 108\n"
                "crash_eval = mgr.simulate_failure_recovery(group, 'payments', 0, current_processed_offset=108, auto_committed_offset=100)\n"
                "\n"
                "print('Hasil Evaluasi Strategi Commit Offset:')\n"
                "print(f'  1. Manual Sync Commit : Status={res[\"status\"]} -> Terkunci di Offset #{res[\"offset\"]}')\n"
                "print(f'  2. Simulasi Crash Recovery (Auto-Commit Lag):')\n"
                "print(f'     - Lanjut Membaca dari Offset #{crash_eval[\"resumed_from_offset\"]}')\n"
                "print(f'     - Potensi Duplikasi Data     : {crash_eval[\"duplicate_records_reprocessed\"]} record diproses ulang!')\n"
                "print('Kesimpulan: Manual commit setelah proses selesai menjamin konsistensi status data.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.8.8
    {
        "id": "10.8.8",
        "title": "Jaminan Pengiriman Pesan: At-Most-Once, At-Least-Once, dan Exactly-Once (EOS)",
        "learningObjectives": [
            "Memahami spektrum jaminan semantik pengiriman pesan pada sistem terdistribusi.",
            "Menganalisis konfigurasi broker, producer, dan consumer untuk mencapai At-Most-Once dan At-Least-Once.",
            "Mengimplementasikan mekanisme Exactly-Once Semantics (EOS) berbasis idempotensi dan pemfilteran pesan duplikat."
        ],
        "prerequisites": [
            "10.8.7 (Manajemen Offset).",
            "10.1.7 (Prinsip Transaksi Data ACID vs BASE)."
        ],
        "commonPitfalls": [
            "Mengira konfigurasi `enable.idempotence=true` pada producer otomatis menjamin Exactly-Once end-to-end; EOS membutuhkan penanganan transaksi terpadu di sisi sink/database.",
            "Menggunakan `acks=0` pada sistem transaksi finansial, memicu risiko data hilang permanen tanpa peringatan saat broker restart."
        ],
        "academicReferences": [
            "Kreps, J., et al. (2011). Kafka: a Distributed Messaging System for Log Processing. NetDB 2011.",
            "Apache Kafka Design Whitepaper: Exactly-Once Semantics in Apache Kafka."
        ],
        "caseStudy": "Sebuah sistem transfer perbankan digital mengalami kegagalan jaringan saat mengirim instruksi debit rekening. Pada mode At-Least-Once, retry jaringan memicu transfer ganda $500. Mengaktifkan Kafka Exactly-Once Semantics (Transactional Producer & Consumer) mengeliminasi transfer duplikat tanpa mengorbankan durabilitas.",
        "content": {
            "theory": (
                "Dalam sistem terdistribusi yang tidak dapat diprediksi (di mana kegagalan jaringan dan crash node dapat terjadi kapan saja), sistem pesan menawarkan tiga tingkatan **Jaminan Semantik Pengiriman (Message Delivery Semantics)**: "
                "1. **At-Most-Once (Paling Banyak Sekali)**: "
                "Pesan dapat hilang, tetapi tidak pernah terkirim lebih dari satu kali. "
                "Konfigurasi: Producer `acks=0` (tidak menunggu konfirmasi), Consumer melakukan commit offset sebelum memproses pesan. Cocok untuk data metrik sensor berfrekuensi tinggi di mana kehilangan 1 sampel dapat ditoleransi. "
                "2. **At-Least-Once (Paling Sedikit Sekali)**: "
                "Pesan dijamin tidak pernah hilang, namun dapat terduplikasi. "
                "Konfigurasi: Producer `acks=all` (seluruh ISR mengonfirmasi), `retries > 0`, Consumer melakukan commit offset **hanya setelah** pesan selesai diproses. Merupakan standar default industri. "
                "3. **Exactly-Once Semantics (EOS - Tepat Satu Kali)**: "
                "Setiap pesan diproses tepat satu kali secara efektif, bahkan jika terjadi kegagalan jaringan atau crash broker/consumer. "
                "Kafka mencapai EOS melalui kombinasi: "
                "- **Idempotent Producer**: Menghapus duplikasi pesan di sisi broker akibat retry produser. "
                "- **Transactional Coordinator & 2PC**: Menautkan commit offset consumer dan penulisan partisi downstream ke dalam transaksi atomik tunggal: "
                "$$\\text{TxCommit} \\iff \\text{StateModified} \\land \\text{OffsetCommitted} \\quad (\\text{All-or-Nothing})$$"
            ),
            "realWorldApplication": (
                "Kafka Streams dan Flink menggunakan Exactly-Once Semantics untuk memastikan kalkulasi finansial (seperti saldo dompet digital) bernilai 100% presisi matematis."
            ),
            "codeSnippet": (
                "# Demonstrasi Jaminan Pengiriman: At-Least-Once (Duplikasi) vs Exactly-Once (Idempotent Filter)\n"
                "class DeliverySemanticsSimulator:\n"
                "    @staticmethod\n"
                "    def process_at_least_once(incoming_messages_with_retries):\n"
                "        # At-least-once menerima seluruh pesan tanpa filter duplikat\n"
                "        processed_ledger = []\n"
                "        for msg in incoming_messages_with_retries:\n"
                "            processed_ledger.append(msg['amount'])\n"
                "        return {'mode': 'At-Least-Once', 'total_amount': sum(processed_ledger), 'entries': len(processed_ledger)}\n"
                "        \n"
                "    @staticmethod\n"
                "    def process_exactly_once(incoming_messages_with_retries):\n"
                "        # Exactly-once menyaring pesan duplikat berdasarkan Message ID unik\n"
                "        processed_ledger = []\n"
                "        seen_message_ids = set()\n"
                "        \n"
                "        for msg in incoming_messages_with_retries:\n"
                "            m_id = msg['msg_id']\n"
                "            if m_id not in seen_message_ids:\n"
                "                seen_message_ids.add(m_id)\n"
                "                processed_ledger.append(msg['amount'])\n"
                "                \n"
                "        return {'mode': 'Exactly-Once', 'total_amount': sum(processed_ledger), 'entries': len(processed_ledger)}\n"
                "\n"
                "# Skenario: 3 transaksi asli, namun transaksi TX-102 terkirim 3 kali akibat network retry timeout\n"
                "network_stream = [\n"
                "    {'msg_id': 'TX-101', 'amount': 100.0},\n"
                "    {'msg_id': 'TX-102', 'amount': 250.0},  # Kiriman pertama\n"
                "    {'msg_id': 'TX-102', 'amount': 250.0},  # Retry duplikat 1\n"
                "    {'msg_id': 'TX-102', 'amount': 250.0},  # Retry duplikat 2\n"
                "    {'msg_id': 'TX-103', 'amount': 50.0}\n"
                "]\n"
                "\n"
                "alo_res = DeliverySemanticsSimulator.process_at_least_once(network_stream)\n"
                "eos_res = DeliverySemanticsSimulator.process_exactly_once(network_stream)\n"
                "\n"
                "print(f'Evaluasi Semantik Pengiriman Pesan ({len(network_stream)} Pesan Masuk):')\n"
                "print(f'  1. {alo_res[\"mode\"]} : Total Saldo=${alo_res[\"total_amount\"]:,.2f} ({alo_res[\"entries\"]} entri, Terjadi Overcounting Duplikat!)')\n"
                "print(f'  2. {eos_res[\"mode\"]}   : Total Saldo=${eos_res[\"total_amount\"]:,.2f} ({eos_res[\"entries\"]} entri, Tepat & Presisi!)')\n"
                "print('Kesimpulan: EOS mutlak diwajibkan untuk integritas transaksi analitik dan finansial.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.8.9
    {
        "id": "10.8.9",
        "title": "Konfigurasi Idempotent Producer pada Kafka (enable.idempotence=true)",
        "learningObjectives": [
            "Memahami arsitektur internal Idempotent Producer pada Apache Kafka.",
            "Menganalisis mekanisme pelacakan Producer ID (PID) dan Sequence Number per partisi.",
            "Mengimplementasikan simulator broker deduplication engine untuk menolak retry penulisan duplikat secara transparan."
        ],
        "prerequisites": [
            "10.8.8 (Semantik Pengiriman Pesan).",
            "Protokol Jaringan TCP & Deteksi Paket Duplikat."
        ],
        "commonPitfalls": [
            "Mengira idempotensi producer bekerja lintas sesi setelah produser me-restart; restart produser menghasilkan PID baru kecuali jika dipadukan dengan `transactional.id`.",
            "Menonaktifkan idempotensi demi menghemat CPU broker, memicu anomali duplikasi data pada jaringan cloud yang berfluktuasi."
        ],
        "academicReferences": [
            "Apache Kafka Improvement Proposal KIP-98: Exactly Once Delivery and Transactional Messaging.",
            "Kreps, J., et al. (2011). Kafka: a Distributed Messaging System for Log Processing. NetDB 2011."
        ],
        "caseStudy": "Analisis pipeline ingestion klik iklan di sistem programmatic ads mendapati bahwa 1.8% impresi terduplikasi akibat lonjakan latensi timeout jaringan broker. Mengaktifkan `enable.idempotence=true` mengeliminasi duplikasi tersebut secara instan tanpa memerlukan perubahan kode aplikasi.",
        "content": {
            "theory": (
                "Dalam skenario jaringan nyata, produser dapat mengirimkan pesan ke broker, broker berhasil menuliskannya ke commit log, namun respons pengakuan (*acknowledgement / ACK*) hilang di kabel jaringan akibat *network glitch*. "
                "Karena produser tidak menerima ACK, produser akan melakukan **Retry** mengirimkan pesan yang sama. "
                "Pada produser standar non-idempotent, broker akan menuliskan kembali pesan tersebut, menghasilkan rekaman duplikat di log. "
                "Apache Kafka menyelesaikan persoalan ini melalui fitur **Idempotent Producer (`enable.idempotence=true`)**: "
                "1. **Producer ID (PID)**: Saat produser pertama kali melakukan inisialisasi, broker menetapkan ID numerik unik 64-bit yang disebut PID. "
                "2. **Sequence Numbers**: Setiap pesan yang dikirimkan ke suatu partisi diberi nomor urut sekuensial monoton naik ($0, 1, 2, \\dots$). "
                "3. **Deduplikasi di Broker**: Broker menyimpan nomor urut terakhir yang berhasil ditulis untuk setiap pasangan $(\\text{PID}, \\text{Partition})$. "
                "Ketika pesan baru tiba dengan nomor urut $S$: "
                "- Jika $S = S_{\\text{last}} + 1$: Pesan diterima dan ditulis ke log. "
                "- Jika $S \\le S_{\\text{last}}$: Broker mendeteksi bahwa pesan ini adalah **duplikat akibat retry jaringan**. Broker **mengabaikan penulisan ke disk**, namun tetap mengembalikan respons ACK sukses ke produser: "
                "$$\\text{Action}(S) = \\begin{cases} \\text{WriteAndAck}, & \\text{jika } S = S_{\\text{last}} + 1 \\\\ \\text{AckOnly (NoWrite)}, & \\text{jika } S \\le S_{\\text{last}} \\\\ \\text{OutOfOrderException}, & \\text{jika } S > S_{\\text{last}} + 1 \\end{cases}$$"
            ),
            "realWorldApplication": (
                "Sejak Apache Kafka versi 3.0, opsi `enable.idempotence=true` diaktifkan secara default untuk seluruh client Kafka produser."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Idempotent Producer & Broker Sequence Tracking Engine\n"
                "class BrokerIdempotenceGuard:\n"
                "    def __init__(self):\n"
                "        # Pelacakan sequence terakhir: {(PID, partition): last_sequence_number}\n"
                "        self.pid_sequences = {}\n"
                "        self.committed_log = []\n"
                "        \n"
                "    def receive_produce_request(self, pid, partition, sequence_num, payload):\n"
                "        key = (pid, partition)\n"
                "        last_seq = self.pid_sequences.get(key, -1)\n"
                "        \n"
                "        if sequence_num == last_seq + 1:\n"
                "            # Pesan baru terurut valid: Tulis ke log fisik & perbarui state\n"
                "            self.committed_log.append({'pid': pid, 'seq': sequence_num, 'data': payload})\n"
                "            self.pid_sequences[key] = sequence_num\n"
                "            return {'status': 'COMMITTED', 'ack': True, 'action': 'WRITE_TO_LOG'}\n"
                "            \n"
                "        elif sequence_num <= last_seq:\n"
                "            # Deteksi DUPLIKAT: Abaikan penulisan disk, kembalikan ACK sukses!\n"
                "            return {'status': 'DUPLICATE_IGNORED', 'ack': True, 'action': 'ACK_ONLY_NO_WRITE'}\n"
                "            \n"
                "        else:\n"
                "            # Terjadi celah urutan pesan (Out of order)\n"
                "            return {'status': 'OUT_OF_ORDER_ERROR', 'ack': False, 'action': 'REJECT'}\n"
                "\n"
                "broker_guard = BrokerIdempotenceGuard()\n"
                "producer_id = 998877\n"
                "\n"
                "# 1. Produser kirim pesan Seq 0 (Berhasil)\n"
                "req1 = broker_guard.receive_produce_request(producer_id, partition=0, sequence_num=0, payload='Order Created')\n"
                "# 2. Produser kirim pesan Seq 1 (Berhasil)\n"
                "req2 = broker_guard.receive_produce_request(producer_id, partition=0, sequence_num=1, payload='Payment Success')\n"
                "# 3. Jaringan putus saat kirim ACK: Produser retry mengirim ulang Seq 1\n"
                "req3_retry = broker_guard.receive_produce_request(producer_id, partition=0, sequence_num=1, payload='Payment Success')\n"
                "\n"
                "print('Simulasi Mekanisme Idempotent Producer Kafka:')\n"
                "print(f'  Pengiriman Seq 0 : Status={req1[\"status\"]} -> {req1[\"action\"]}')\n"
                "print(f'  Pengiriman Seq 1 : Status={req2[\"status\"]} -> {req2[\"action\"]}')\n"
                "print(f'  Retry Seq 1 (Dup): Status={req3_retry[\"status\"]} -> {req3_retry[\"action\"]}')\n"
                "print(f'  Total Record di Log Fisik: {len(broker_guard.committed_log)} record (Zero Duplication!)')\n"
                "print('Kesimpulan: Idempotent producer mengamankan log dari duplikasi akibat gangguan jaringan.')"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 10.8.10
    {
        "id": "10.8.10",
        "title": "Implementasi Producer & Consumer Menggunakan Python confluent-kafka",
        "learningObjectives": [
            "Menguasai implementasi pipeline streaming produser dan konsumen menggunakan pustaka resmi `confluent-kafka`.",
            "Menganalisis mekanisme pengiriman asinkron berbasis Delivery Callback dan Event Polling Loop.",
            "Mengimplementasikan penanganan kesalahan jaringan dan pembersihan resource pada proses streaming."
        ],
        "prerequisites": [
            "10.8.1 hingga 10.8.9.",
            "Dasar Pemrograman Python Terapan & Pengelolaan Threading/Event-Loop."
        ],
        "commonPitfalls": [
            "Lupa memanggil `producer.poll(0)` atau `producer.flush()` sebelum proses aplikasi berhenti, menyebabkan pesan yang masih berada di buffer lokal hilang tanpa sempat terkirim.",
            "Menjalankan pemrosesan CPU berat di dalam thread consumer polling loop yang sama, memicu timeout `max.poll.interval.ms` dan rebalance kluster berulang."
        ],
        "academicReferences": [
            "Confluent Official Documentation: Python Client for Apache Kafka (confluent-kafka).",
            "Kreps, J., et al. (2011). Kafka: a Distributed Messaging System for Log Processing. NetDB 2011."
        ],
        "caseStudy": "Sebuah sistem pengolahan event IoT armada armada truk menggunakan `confluent-kafka` untuk mengalirkan 50.000 titik koordinat GPS per detik. Penerapan delivery report callbacks dan batch buffering (`linger.ms=20`, `batch.size=65536`) menaikkan throughput pengiriman produser sebesar 5.5x lipat.",
        "content": {
            "theory": (
                "Dalam ekosistem Python Big Data, terdapat dua pustaka utama untuk berinteraksi dengan Apache Kafka: pustaka Python murni (`kafka-python`) dan pustaka performa tinggi **`confluent-kafka-python`** yang dibangun di atas binding C pustaka kanonikal **`librdkafka`**. "
                "`confluent-kafka` menjadi standar industri karena kemampuannya memproses ratusan ribu event per detik dengan overhead CPU minimal. "
                "Pola arsitektur implementasi terbagi menjadi dua komponen: "
                "1. **High-Throughput Producer Pattern**: "
                "Produser bekerja secara asinkron. Fungsi `producer.produce(topic, key, value, callback=delivery_report)` menempatkan pesan ke dalam buffer memori internal produser. "
                "Fungsi `poll(timeout)` melayani event queue untuk mengeksekusi fungsi callback pengakuan (*delivery acknowledgment*) dari broker. "
                "Sebelum aplikasi dimatikan, fungsi `flush()` mutlak dipanggil untuk memastikan seluruh antrean pesan terkirim. "
                "2. **Reliable Consumer Polling Loop**: "
                "Konsumen mendaftarkan langganan topik (`consumer.subscribe([topic])`) dan menjalankan loop pembacaan berkelanjutan: "
                "$$\\text{Loop} \\implies \\text{msg} = \\text{consumer.poll}(\\Delta t) \\longrightarrow \\text{Process}(\\text{msg}) \\longrightarrow \\text{commitSync}()$$ "
                "Pola ini menjamin isolasi kesalahan dan pemrosesan stream berkelanjutan tanpa kebocoran thread."
            ),
            "realWorldApplication": (
                "Pipeline ingestion streaming di Pinterest, Spotify, dan Goldman Sachs menstandarisasi seluruh microservice produser dan konsumen berbasis Python menggunakan `confluent-kafka`."
            ),
            "codeSnippet": (
                "# Implementasi Simulator Client confluent-kafka: Asynchronous Producer Callback & Consumer Polling Loop\n"
                "class ConfluentKafkaClientSimulator:\n"
                "    def __init__(self):\n"
                "        self.broker_storage = []\n"
                "        self.delivery_callbacks_fired = 0\n"
                "        \n"
                "    def produce(self, topic, key, value, on_delivery=None):\n"
                "        # Simulasi pengiriman asinkron ke broker\n"
                "        msg_record = {'topic': topic, 'key': key, 'value': value, 'offset': len(self.broker_storage)}\n"
                "        self.broker_storage.append(msg_record)\n"
                "        \n"
                "        # Picu callback pengiriman sukses jika disediakan\n"
                "        if on_delivery:\n"
                "            self.delivery_callbacks_fired += 1\n"
                "            on_delivery(err=None, msg=msg_record)\n"
                "            \n"
                "    def poll_messages(self, start_idx=0, max_batch=5):\n"
                "        return self.broker_storage[start_idx : start_idx + max_batch]\n"
                "\n"
                "# Inisialisasi client simulator\n"
                "client = ConfluentKafkaClientSimulator()\n"
                "delivery_receipts = []\n"
                "\n"
                "def ack_callback(err, msg):\n"
                "    if err is None:\n"
                "        delivery_receipts.append(f\"ACK_OK: Topic={msg['topic']} Offset={msg['offset']} Key={msg['key']}\")\n"
                "\n"
                "# 1. Producer mengirim 3 event transaksi finansial\n"
                "client.produce('card_authorizations', key='USR_881', value='AUTH_REQUEST_$120', on_delivery=ack_callback)\n"
                "client.produce('card_authorizations', key='USR_882', value='AUTH_REQUEST_$450', on_delivery=ack_callback)\n"
                "client.produce('card_authorizations', key='USR_881', value='AUTH_APPROVED_$120', on_delivery=ack_callback)\n"
                "\n"
                "# 2. Consumer membaca event dari broker\n"
                "consumed_batch = client.poll_messages(start_idx=0, max_batch=3)\n"
                "\n"
                "print('Demonstrasi Implementasi Client Kafka Python (confluent-kafka pattern):')\n"
                "print(f'  Total Callback Pengiriman Berhasil: {client.delivery_callbacks_fired}')\n"
                "for rcp in delivery_receipts:\n"
                "    print(f'    - {rcp}')\n"
                "print(f'  Consumer Berhasil Mengonsumsi: {len(consumed_batch)} event dari broker')\n"
                "for msg in consumed_batch:\n"
                "    print(f'    - [Offset #{msg[\"offset\"]}] Payload: {msg[\"value\"]}')\n"
                "print('Kesimpulan: Pola asynchronous delivery callback dan polling loop menjamin stream throughput tinggi.')"
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

print(f"[OK] Berhasil menghasilkan 10 subbab Bab 8 Topik 10 ke {output_file}")
