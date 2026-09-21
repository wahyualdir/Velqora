# -*- coding: utf-8 -*-
"""
Script untuk menambahkan analisis arsitektural dan elaborasi teoretis mendalam
pada setiap subbab yang kata teorinya < 210 kata, sehingga mencapai >= 215 kata
dengan mempertahankan formulasi matematika LaTeX ($) dan integritas kutipan resmi.
"""

import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.dirname(os.path.abspath(__file__))

substantive_expansions = {
    # BAB 6
    "10.6.3": (
        " Dalam arsitektur sistem berskala petabyte, pemisahan antara transformasi dan tindakan memungkinkan Spark membangun rencana eksekusi yang optimal melalui teknik pipelining. "
        "Alih-alih menyimpan hasil perantara (*intermediate materialized datasets*) ke disk lokal seperti pada paradigma MapReduce konvensional, Spark mengalirkan data secara streaming melintasi rangkaian fungsi iterator di memori RAM. "
        "Hal ini mereduksi frekuensi I/O disk hingga $100\\%$ pada operasi linear berurutan, sehingga kompleksitas ruang penyimpanan perantara tereduksi dari $\\mathcal{O}(N \\times K)$ menjadi $\\mathcal{O}(1)$ di mana $K$ adalah jumlah langkah transformasi."
    ),
    "10.6.4": (
        " Silsilah ketergantungan (lineage graph) juga menjadi landasan utama bagi mekanisme pemulihan kesalahan (*fault tolerance*) yang efisien. "
        "Jika sebuah partisi pada stage narrow mengalami kehilangan data akibat crash pada node pekerja, Spark Driver tidak perlu memutar ulang keseluruhan job dari awal. "
        "Driver hanya menjadwalkan ulang perhitungan ulang (*recomputation task*) khusus untuk partisi tunggal yang hilang tersebut pada simpul pekerja lain yang masih aktif, dengan memanfaatkan catatan fungsi transformasi yang tersimpan rapi dalam grafik silsilah logis: "
        "$$P_{\\text{lost}} \\leftarrow f_{\\text{compute}}(P_{\\text{parent}})$$"
    ),
    "10.6.5": (
        " Keunggulan performa DataFrame dan Dataset semakin diperkuat oleh integrasi mendalam dengan katalog metadata skema. "
        "Catalyst memanfaatkan informasi tipe data yang terdefinisi secara presisi untuk melakukan optimasi berbasis biaya (Cost-Based Optimization) dan memproyeksikan representasi biner kompak ke register CPU. "
        "Struktur data internal `InternalRow` pada Tungsten menghindari sepenuhnya proses pembungkusan objek (*boxing*) tipe primitif (seperti `int` atau `double`), yang pada Java standar dapat memakan 16 hingga 24 byte per nilai skalar tunggal, mereduksinya menjadi tepat 4 atau 8 byte representasi biner murni."
    ),
    "10.6.6": (
        " Dalam topologi kluster modern berbasis komputasi awan (Cloud Object Storage seperti AWS S3, Google Cloud Storage, dan Azure ADLS), lokalisasi data mengalami redefinisi arsitektural. "
        "Karena media penyimpanan terpisah secara fisik dari node komputasi (*storage-compute decoupling*), tingkat lokalisasi umumnya berada pada status `NO_PREF` atau `ANY`. "
        "Untuk memitigasi latensi transfer jaringan jarak jauh, SparkSession mengimplementasikan pembacaan terbagi secara paralel (*parallel chunk fetching*) dan memanfaatkan teknik pembacaan spekulatif (*speculative execution*) untuk mendeteksi serta meluncurkan salinan task duplikat jika terdapat node yang mengalami perlambatan I/O jaringan abnormal."
    ),
    "10.6.7": (
        " Selain operasi transformasi bawaan, PySpark mendukung integrasi dengan pustaka saintifik Python tingkat tinggi (seperti NumPy, SciPy, dan Scikit-Learn) melalui **Pandas UDF (Vectorized UDF)**. "
        "Pandas UDF memanfaatkan format pertukaran data dalam memori **Apache Arrow** untuk mentransfer batch kolom secara langsung antara JVM dan interpreter Python tanpa serialisasi berbasis teks atau pickle yang lambat. "
        "Dengan Apache Arrow, data dipetakan langsung (*zero-copy memory mapping*), menghasilkan lonjakan throughput komputasi fungsi kustom hingga puluhan kali lipat dibandingkan UDF Python standar baris-demi-baris: "
        "$$\\text{Throughput}_{\\text{Arrow UDF}} \\gg 50 \\times \\text{Throughput}_{\\text{Standard Python UDF}}$$"
    ),
    "10.6.8": (
        " Pemilihan antara Broadcast Hash Join dan Sort-Merge Join juga dipengaruhi oleh tingkat selektivitas predikat kueri. "
        "Jika kueri menerapkan filter ketat terhadap tabel besar sebelum operasi penggabungan, ukuran data efektif yang tersisa dapat menyusut secara drastis hingga memenuhi ambang batas siaran (`spark.sql.autoBroadcastJoinThreshold`). "
        "Oleh karena itu, penyusunan urutan filter sebelum join (*predicate pushdown before join*) sangat krusial agar perencana kueri Catalyst dapat mendegradasi operasi yang semula membutuhkan shuffle mahal menjadi operasi siaran memori lokal instan."
    ),
    "10.6.9": (
        " Kebijakan pengelolaan memori terpadu ini diatur oleh parameter `spark.memory.fraction` dan `spark.memory.storageFraction`. "
        "Jika aplikasi data engineering memiliki karakteristik beban kerja analitik murni dengan agregasi dan pengurutan masif tanpa kebutuhan caching berulang, engineer dapat menurunkan alokasi penyimpanan cache guna memberikan ruang ekstra bagi buffer shuffle execution memory: "
        "$$M_{\\text{execution\\_buffer}} \\ge \\alpha \\times M_{\\text{usable}}$$ "
        "Hal ini mencegah terjadinya tumpahan data ke disk lokal (*disk spill*) yang dapat melipatgandakan waktu eksekusi secara signifikan."
    ),
    "10.6.10": (
        " Manajemen siklus hidup cache juga mencakup pembersihan memori secara terencana menggunakan metode `.unpersist()`. "
        "Membiarkan DataFrame yang tidak lagi digunakan tetap berada di dalam memori cache akan memicu tekanan memori (*memory pressure*), yang memaksa Spark menggusur blok data penting lainnya atau memicu jeda Garbage Collection berulang. "
        "Pada pipeline produksi skala besar, data engineer menerapkan pola *Context-Managed Caching*, di mana data hanya di-cache selama iterasi kalkulasi aktif dan segera dilepaskan dari RAM setelah seluruh metrik atau prediksi model selesai diekstraksi."
    ),

    # BAB 7
    "10.7.3": (
        " Lebih lanjut, Tungsten mengoptimalkan operasi sortir dalam memori (*Tungsten Sort*) dengan memanfaatkan format representasi pointer 8-byte yang menggabungkan awalan kunci biner (*normalized key prefix*) dan alamat memori data secara berdampingan. "
        "Saat melakukan pembandingan data selama penyortiran, CPU hanya perlu membandingkan byte awalan kunci secara langsung di register prosesor tanpa perlu dereferensi pointer ke lokasi memori yang jauh. "
        "Teknik ini mereduksi fenomena *branch misprediction* dan meningkatkan throughput pemrosesan data sortir hingga 3x lipat pada perangkat keras arsitektur x86_64 modern."
    ),
    "10.7.4": (
        " Dampak lanjutan dari disk spill adalah timbulnya fragmentasi I/O pada subsistem penyimpanan lokal worker. "
        "Ketika ratusan task paralel secara bersamaan menulis dan membaca ribuan file tumpahan sementara (*temporary spill files*), disk antrean (I/O queue depth) akan mengalami kejenuhan ekstrem. "
        "Untuk meminimalkan risiko spill, data engineer mengonfigurasi parameter penyangga penulisan `spark.shuffle.file.buffer` (misalnya dinaikkan dari nilai bawaan 32 KB menjadi 1 MB) dan mengaktifkan kompresi shuffle berbasis pustaka algoritma kompresi berkecepatan tinggi seperti LZ4 atau Zstandard (`spark.io.compression.codec=zstd`)."
    ),
    "10.7.5": (
        " Pedoman praktis (*rule of thumb*) dalam menentukan jumlah partisi shuffle yang optimal dirumuskan dengan membagi total ukuran data yang dihasilkan oleh fase shuffle write dengan target ukuran partisi ideal sebesar 128 MB hingga 200 MB: "
        "$$N_{\\text{target\\_partitions}} = \\left\\lceil \\frac{\\text{Total Shuffle Write Volume}}{128\\text{ MB}} \\right\\rceil$$ "
        "Jika nilai $N$ yang dihasilkan jauh melampaui jumlah total CPU core kluster, eksekusi akan terbagi menjadi banyak gelombang tugas (*waves of tasks*) yang seimbang tanpa membebani memori kerja masing-masing thread komputasi."
    ),
    "10.7.6": (
        " Selain disebabkan oleh dominasi nilai kunci tunggal yang populer, data skew juga kerap dipicu oleh fenomena *partition skew* akibat fungsi hash yang menghasilkan tabrakan nilai hash (*hash collision*) pada ruang modular partisi yang sempit. "
        "Dalam kueri berskala besar, deteksi skew secara visual pada Spark Web UI ditandai oleh perbedaan ekstrem antara persentil ke-75 durasi task dengan nilai maksimum durasi task: "
        "$$\\Delta_{\\text{skew}} = \\text{Duration}_{\\max} - \\text{Duration}_{p75} \\gg 10 \\times \\text{Median}$$ "
        "Kondisi ini merupakan indikasi pasti bahwa optimasi skema partisi atau teknik salting harus segera diterapkan."
    ),
    "10.7.7": (
        " Dalam implementasi skala industri, penerapan salting dapat dioptimalkan lebih lanjut menggunakan teknik **Selective Salting (Penggaraman Selektif)**. "
        "Alih-alih menggarami seluruh baris pada dataset, sistem terlebih dahulu melakukan profiling frekuensi kunci: hanya kunci-kunci pencilan (*outlier heavy keys*) yang frekuensinya melampaui ambang batas tertentu yang digarami, sedangkan kunci-kunci normal tetap di-join menggunakan jalur pemrosesan standar. "
        "Pendekatan selektif ini mengeliminasi pemborosan replikasi pada tabel dimensi, menjaga konsumsi memori dan bandwidth jaringan tetap pada tingkat minimal yang efisien."
    ),
    "10.7.8": (
        " Keunggulan fundamental dari AQE adalah kemampuannya untuk beroperasi secara transparan tanpa mengubah semantik kueri SQL pengguna. "
        "Pada kluster multi-tenant di mana volume data masukan berfluktuasi secara dinamis setiap hari (misalnya lonjakan trafik saat kampanye diskon e-commerce), konfigurasi partisi statis manual hampir selalu tidak efisien. "
        "AQE secara otonom menyesuaikan arsitektur eksekusi fisik kueri dengan karakteristik data aktual di lapangan, menghilangkan kebutuhan tuning manual berulang dan meningkatkan stabilitas pipeline data produksi secara berkelanjutan."
    ),
    "10.7.9": (
        " Dalam arsitektur kueri analitik bertingkat, Broadcast Hash Join juga mendukung mekanisme **Dynamic Partition Pruning (DPP)**. "
        "Ketika tabel dimensi kecil disaring menggunakan predikat selektif, Spark menghitung himpunan kunci yang lolos filter pada tabel dimensi tersebut, lalu menyiarkannya sebagai filter dinamis (*dynamic filter set*) ke tabel fakta raksasa sebelum tabel fakta dipindai. "
        "Hal ini mencegah Spark membaca partisi-partisi tabel fakta yang tidak memiliki relasi dengan tabel dimensi, memangkas volume pemindaian data fisik dari penyimpanan objek hingga lebih dari $80\\%$."
    ),
    "10.7.10": (
        " Metrik memori off-heap dan metrik tumpahan disk pada Spark UI juga memberikan wawasan mendalam mengenai alokasi memori sistem. "
        "Jika metrik menunjukkan tingginya `Shuffle Spill (Memory)` dan `Shuffle Spill (Disk)` pada tahapan tertentu, tindakan mitigasi terarah mencakup penyesuaian parameter `spark.memory.fraction` atau penambahan alokasi memori overhead eksternal melalui `spark.executor.memoryOverhead`. "
        "Dengan memantau metrik Garbage Collection dan metrik antrean task secara berkelanjutan, stabilitas SLA pipeline data berkecepatan tinggi dapat dipertahankan secara konsisten."
    ),

    # BAB 8
    "10.8.2": (
        " Keandalan konsistensi replikasi diatur oleh parameter konfirmasi pengiriman producer (`acks`). "
        "Jika producer mengonfigurasi `acks=all` (atau `acks=-1`), broker Leader hanya akan mengirimkan konfirmasi keberhasilan setelah pesan berhasil dituliskan ke seluruh replika yang tergabung dalam himpunan ISR. "
        "Jika dipadukan dengan konfigurasi `min.insync.replicas=2`, sistem menjamin bahwa data tidak akan pernah hilang meskipun salah satu broker fisik mengalami kegagalan listrik mendadak (*zero data loss durability guarantee*)."
    ),
    "10.8.3": (
        " Mekanisme batching pada RecordAccumulator juga terintegrasi secara harmonis dengan algoritma kompresi data tingkat blok (seperti LZ4, Snappy, atau Zstandard). "
        "Alih-alih mengompresi setiap event secara terpisah yang menghasilkan rasio kompresi rendah akibat kamus data yang sempit, Kafka mengompresi keseluruhan batch pesan di tingkat producer sebelum dikirimkan melintasi jaringan. "
        "Broker Kafka menyimpan batch terkompresi tersebut secara langsung ke disk tanpa melakukan dekompresi, menghemat ruang penyimpanan persisten dan mengeliminasi beban CPU broker secara signifikan."
    ),
    "10.8.4": (
        " Ketika terjadi penambahan atau pengurangan instans konsumen di dalam consumer group (misalnya saat autoscaling pod Kubernetes aktif), Kafka memicu proses **Rebalancing**. "
        "Pada protokol rebalance modern (*Cooperative Sticky Assignor*), proses pengalokasian ulang partisi dilakukan secara inkremental tanpa menghentikan konsumsi pada partisi-partisi yang tidak mengalami perpindahan pemilik (*zero stop-the-world rebalance*). "
        "Hal ini menjaga kelancaran pemrosesan data streaming dan mencegah lonjakan Consumer Lag selama proses pemeliharaan sistem atau deployment berkala."
    ),
    "10.8.5": (
        " Koordinator Transaksi Kafka bekerja sama dengan topik internal khusus bernama `__transaction_state` untuk melacak siklus hidup transaksi data. "
        "Saat aplikasi streaming mengeksekusi pola *consume-transform-produce*, producer menuliskan data hasil transformasi ke topik tujuan dan offset konsumsi ke topik internal secara atomik di bawah id transaksi tunggal. "
        "Jika aplikasi mengalami crash di tengah komputasi, transaksi dibatalkan (*aborted*) dan pesan yang belum ter-commit diabaikan oleh konsumen yang beroperasi di bawah tingkat isolasi `read_committed`."
    ),
    "10.8.7": (
        " Skema Avro didefinisikan dalam format deklaratif JSON yang mendokumentasikan nama field, tipe data, serta nilai default secara eksplisit. "
        "Ketika aplikasi klien memproduksi atau mengonsumsi pesan, pustaka serialisasi mengunduh skema yang relevan dari Schema Registry dan menyimpannya di cache memori lokal. "
        "Hal ini menjamin bahwa validasi struktur data hanya memerlukan verifikasi byte id lokal berkecepatan tinggi tanpa overhead latensi jaringan HTTP pada setiap transmisi event data."
    ),
    "10.8.8": (
        " Menggabungkan Kafka Connect CDC dengan arsitektur Event-Driven Architecture (EDA) mengeliminasi kebutuhan kueri polling terjadwal yang membebani CPU basis data transaksional. "
        "Karena CDC beroperasi di lapisan replikasi log biner penyimpanan, penangkapan perubahan data berlangsung secara non-intrusif dengan overhead performa di bawah $2\\%$ pada sistem basis data sumber. "
        "Pendekatan ini memungkinkan data engineer mereplikasi mutasi data inventaris atau pesanan pelanggan ke data warehouse dalam hitungan ratusan milidetik."
    ),
    "10.8.9": (
        " Penggunaan RocksDB sebagai mesin penyimpanan status lokal pada Kafka Streams memungkinkan pemrosesan stateful skala besar melampaui batas kapasitas memori RAM fisik simpul worker. "
        "Setiap operasi pembaruan status dituliskan ke buffer memori memtable RocksDB dan secara paralel dicatat ke changelog topic Kafka yang terkompaksi (*compacted changelog topic*). "
        "Jika kontainer aplikasi streaming mengalami crash dan dipindahkan ke mesin baru, Kafka Streams dapat memulihkan status lokal RocksDB secara deterministik dengan membaca ulang changelog topic dari awal."
    ),
    "10.8.10": (
        " Dalam aspek tata kelola operasional, Kafka mengimplementasikan kebijakan retensi data berbasis waktu (`log.retention.hours`) dan berbasis ukuran penyimpanan (`log.retention.bytes`). "
        "Untuk topik-topik dimensi yang mewakili status entitas terkini (seperti profil saldo akun pengguna), Kafka menyediakan fitur **Log Compaction**: broker secara periodik membersihkan record-record usang dan hanya mempertahankan versi nilai terakhir untuk setiap kunci unik. "
        "Fitur ini memungkinkan retensi data historis esensial secara tak terbatas dengan jejak penyimpanan fisik yang sangat hemat dan terprediksi."
    ),

    # BAB 9
    "10.9.1": (
        " Pertimbangan arsitektural antara micro-batch dan continuous streaming juga mencakup konsumsi sumber daya komputasi dan biaya infrastruktur. "
        "Mesin continuous streaming mengharuskan thread dan koneksi jaringan tetap aktif mengalokasikan siklus CPU sepanjang waktu untuk mendengarkan kedatangan data per-record, bahkan saat volume aliran data sedang surut. "
        "Sebaliknya, mesin micro-batching dapat menidurkan thread komputasi di antara interval pemicu, memungkinkan pemanfaatan sumber daya komputasi yang lebih hemat pada beban kerja data yang memiliki pola lonjakan fluktuatif musiman."
    ),
    "10.9.2": (
        " Struktur direktori Checkpoint pada Structured Streaming terdiri dari beberapa subdirektori fungsional: `offsets` (mencatat offset batch yang sedang diproses), `commits` (mencatat batch yang telah berhasil diselesaikan), `sources` (metadata sumber), dan `state` (status agregasi stateful). "
        "Proses pemulihan bencana (*disaster recovery*) berlangsung secara otonom: saat aplikasi dijalankan kembali setelah insiden kegagalan, Spark membaca log commit terakhir dan melanjutkan pemrosesan data tepat dari offset yang belum ter-commit tanpa risiko duplikasi data ke lapisan sink."
    ),
    "10.9.3": (
        " Ketidaksesuaian antara Event Time dan Processing Time sering kali memicu anomali analitik yang fatal jika tidak ditangani dengan benar. "
        "Sebagai contoh, jika sebuah sensor telemetri kendaraan kehilangan koneksi jaringan seluler selama 2 jam lalu mengirimkan seluruh data tumpukannya secara serentak saat sinyal kembali stabil, pemrosesan berbasis Processing Time akan mencatat lonjakan aktivitas anomali palsu (*false spike*) pada jam tersebut. "
        "Pemrosesan berbasis Event Time memastikan data ditempatkan pada jendela historis yang sebenarnya, menjamin akurasi model machine learning prediktif hilir."
    ),
    "10.9.4": (
        " Nilai ambang batas keterlambatan watermark (delay threshold $\\Delta_{\\text{delay}}$) mencerminkan trade-off fundamental antara kelengkapan data (*completeness*) dan latensi hasil analitik. "
        "Memilih ambang batas yang terlalu besar (misalnya 24 jam) menjamin bahwa hampir seluruh data yang terlambat akan tertampung, namun hasil agregasi jendela waktu akan tertahan lama dan memori status akan membengkak. "
        "Sebaliknya, memilih ambang batas yang terlalu pendek (misalnya 10 detik) memangkas latensi namun meningkatkan risiko terbuangnya data valid yang terlambat akibat fluktuasi jaringan seluler."
    ),
    "10.9.5": (
        " Pada jendela sesi dinamis (Session Windows), tantangan teknis terbesar adalah penggabungan jendela (*window merging*). "
        "Ketika sebuah event terlambat tiba di antara dua sesi aktif yang terpisah, event tersebut dapat menjembatani jeda ketidakaktifan di antara kedua sesi tersebut. "
        "Mesin streaming harus mampu menggabungkan kedua status jendela sesi lama menjadi satu sesi besar tunggal yang koheren, memperbarui batas waktu awal dan akhir sesi, serta mengoreksi metrik analitik yang telah dipancarkan sebelumnya menggunakan logika pembaruan stateful yang canggih."
    ),
    "10.9.6": (
        " Penggunaan RocksDB State Store pada Spark Structured Streaming dan Apache Flink juga mendukung fitur pemadatan data (*compaction*) otomatis di latar belakang menggunakan algoritma Leveled Compaction. "
        "Data status yang jarang diakses secara bertahap dipindahkan ke lapisan penyimpanan disk yang lebih rendah tanpa mengganggu performa akses data hangat (*hot state*) di memori RAM. "
        "Dengan memisahkan memori kerja dari heap JVM, risiko jeda Garbage Collection sistem terdistribusi dapat ditekan hingga tingkat yang hampir tidak terdeteksi pada operasional harian."
    ),
    "10.9.7": (
        " Dalam implementasi nyata, Stream-Stream Join sering kali diterapkan untuk mengorelasikan event tayangan iklan (*ad impression stream*) dengan event konversi pembelian (*purchase conversion stream*). "
        "Karena pengguna dapat melakukan pembelian beberapa menit atau beberapa jam setelah melihat iklan, batasan interval waktu join dikonfigurasi secara eksplisit (misalnya `purchase.time BETWEEN impression.time AND impression.time + INTERVAL 2 HOURS`). "
        "Mesin streaming secara otomatis mengelola siklus hidup buffer kedua stream dan membuang impresi yang tidak menghasilkan pembelian setelah interval 2 jam terlampaui."
    ),
    "10.9.8": (
        " Flink TaskManager mengeksekusi operator streaming sebagai serangkaian thread paralel di dalam slot tugas terisolasi. "
        "Selama proses penyelarasan barrier (barrier alignment), Flink memastikan bahwa operator tidak memproses data baru dari saluran yang telah menerima barrier $B_k$ sampai seluruh saluran input lainnya juga telah menerima barrier yang sama. "
        "Prosedur ini menjamin bahwa snapshot status yang disimpan ke penyimpanan persisten benar-benar merefleksikan kondisi komputasi yang konsisten dan atomik melintasi seluruh topologi grafik aliran paralel."
    ),
    "10.9.9": (
        " Pengaturan memori pada Flink TaskManager diatur melalui model alokasi memori berjenjang: Framework Heap/Off-Heap, Task Heap/Off-Heap, Managed Memory, dan JVM Metaspace/Overhead. "
        "Saat menggunakan EmbeddedRocksDBStateBackend, sebagian besar memori kerja dialokasikan ke **Managed Memory**, yang dikelola langsung oleh Flink untuk buffer memtable dan block cache RocksDB di luar kendali Garbage Collector Java. "
        "Struktur ini menjamin performa throughput I/O yang sangat stabil dan memitigasi risiko error Out-Of-Memory pada level container."
    ),
    "10.9.10": (
        " Untuk menguji ketahanan dan integritas jaminan End-to-End Exactly-Once pada sistem produksi, praktisi data engineering secara rutin melakukan pengujian injeksi kegagalan (*Chaos Engineering*). "
        "Pengujian mencakup pemadaman paksa kontainer worker, pemutusan koneksi jaringan secara acak, dan pembatalan transaksi di tengah jalan. "
        "Jika seluruh komponen pipeline mematuhi kontrak replayability sumber, determinisme status internal, dan idempotensi/2PC pada sink, sistem terbukti mampu pulih secara mandiri tanpa ada satu pun event fitur AI yang terduplikasi atau hilang."
    )
}

# Terapkan ekspansi ke berkas JSON
chapters = [
    (6, os.path.join(base_dir, "de_ch6_data.json")),
    (7, os.path.join(base_dir, "de_ch7_data.json")),
    (8, os.path.join(base_dir, "de_ch8_data.json")),
    (9, os.path.join(base_dir, "de_ch9_data.json"))
]

total_expanded = 0

for ch_num, jpath in chapters:
    with open(jpath, "r", encoding="utf-8") as f:
        subs = json.load(f)
        
    for sub in subs:
        sub_id = sub["id"]
        if sub_id in substantive_expansions:
            sub["content"]["theory"] += substantive_expansions[sub_id]
            total_expanded += 1
            
    with open(jpath, "w", encoding="utf-8") as f:
        json.dump(subs, f, indent=6, ensure_ascii=False)
        
print(f"Berhasil menambahkan ekspansi substantif pada {total_expanded} subbab.")
