import { ModuleSection } from "@/types/module-drive";
import {
  getAiAgentSections,
  getAiEthicsSections,
  getAiGovernanceSections,
  getAiSecuritySections,
  getAiFundamentalsSections,
} from "./curriculum-batch1-defaults";
import {
  getAutoMlSections,
  getComputationalIntelligenceSections,
  getComputerVisionSections,
  getDataAnalystSections,
  getDataEngineeringAiSections,
} from "./curriculum-batch2-defaults";
import {
  getDataScienceSections,
  getDeepLearningSections,
  getEdgeAiSections,
  getExpertSystemSections,
  getGenerativeAiSections,
} from "./curriculum-batch3-defaults";
import {
  getGraphNeuralNetworkSections,
  getKnowledgeRepresentationSections,
  getLargeLanguageModelSections,
  getMachineLearningSections,
  getMlopsSections,
} from "./curriculum-batch4-defaults";
import {
  getMultimodalAiSections,
  getRecommendationSystemSections,
  getNaturalLanguageProcessingSections,
  getReinforcementLearningSections,
  getRoboticsEmbodiedAiSections,
} from "./curriculum-batch5-defaults";
import {
  getSpeechAudioAiSections,
  getTimeSeriesForecastingSections,
  getVectorDatabaseRetrievalSections,
} from "./curriculum-batch6-defaults";

/**
 * Generator silabus default untuk Bahasa Pemrograman
 */
function getProgrammingLanguageSections(langName: string): ModuleSection[] {
  const chapters = [
    { title: `Pengenalan Sintaks Dasar & Lingkungan Eksekusi ${langName}`, desc: "Instalasi compiler/interpreter, struktur berkas proyek, sintaksis fundamental, dan eksekusi instruksi perdana." },
    { title: "Tipe Data Primitif, Variabel, Konstanta, & Operator", desc: "Sistem pengetikan data, mutabilitas, konversi tipe (type casting), dan operator aritmatika/logika." },
    { title: "Kontrol Alur Eksekusi, Percabangan Logika, & Perulangan", desc: "Pernyataan kondisional (if-else, switch-case), loop iteratif (for, while), dan pengendalian alur eksekusi." },
    { title: "Fungsi, Dekomposisi Modular, Parameter, & Rekursi", desc: "Perancangan fungsi modular, penanganan argumen default/variadik, fungsi murni, dan rekursi." },
    { title: "Struktur Data Koleksi Bawaan & Manipulasi Memori", desc: "Pengelolaan array/list terurut, kamus/peta asosiatif (hash map), set unik, dan efisiensi mutasi." },
    { title: "Paradigma Pemrograman & Manajemen Keadaan (State)", desc: "Pemrograman Berorientasi Objek (Class, Inheritance, Polymorphism) atau Paradigma Fungsional murni." },
    { title: "Penanganan Error, Eksepsi, & Manajemen Berkas I/O", desc: "Mekanisme try-catch/except, tipe data Result/Option, pembacaan berkas stream, dan serialisasi data." },
    { title: "Manajemen Paket, Pengujian Unit, & Standar Rekayasa", desc: "Ekosistem manajer paket, penulisan test otomatis (unit test), linter, dan praktik penulisan kode bersih." },
  ];

  return chapters.map((c, i) => ({
    id: `sec-prog-${i + 1}`,
    title: `Bab ${i + 1}: ${c.title}`,
    orderIndex: i + 1,
    isCompleted: false,
    description: c.desc,
  }));
}

/**
 * Generator silabus default untuk Algoritma & Struktur Data
 */
function getAlgorithmAndDataStructureSections(topicName: string): ModuleSection[] {
  const chapters = [
    { title: "Fondasi Analisis Kompleksitas & Notasi Asimptotik Big-O", desc: "Analisis kompleksitas waktu dan ruang (Time & Space Complexity), Master Theorem, dan batas asimptotik." },
    { title: `Invarian Struktur Data & Representasi Memori ${topicName}`, desc: "Pemodelan struktur data pada memori fisik, pointer, alokasi dinamis vs statis, dan invarian sistem." },
    { title: "Operasi Primitif: Penyisipan, Penghapusan, & Pencarian", desc: "Implementasi algoritma operasi dasar dengan pemeliharaan konsistensi batas indeks dan penanganan galat." },
    { title: "Algoritma Penelusuran & Pengurutan Teroptimasi", desc: "Teknik traversal (Linier, Biner, DFS, BFS) dan perbandingan algoritma pengurutan stabil vs tidak stabil." },
    { title: "Pola Desain Masalah: Divide and Conquer & Rekursi", desc: "Dekomposisi masalah besar menjadi sub-masalah independen dan rekurensi pohon pemanggilan fungsi." },
    { title: "Optimasi Ruang Keadaan dengan Dynamic Programming", desc: "Identifikasi tumpang-tindih sub-masalah (Overlapping Subproblems) dan struktur optimal melalui memoization & tabulasi." },
    { title: "Strategi Greedy, Backtracking, & Penanganan Kasus Batas", desc: "Pemilihan keputusan optimal lokal, penjelajahan ruang kombinatorial dengan pemangkasan cabang (pruning)." },
    { title: "Benchmark Kinerja & Penerapan Kasus Rekayasa Riil", desc: "Pengukuran latensi eksekusi riil pada dataset masif dan pemilihan struktur data adaptif di industri." },
  ];

  return chapters.map((c, i) => ({
    id: `sec-algo-${i + 1}`,
    title: `Bab ${i + 1}: ${c.title}`,
    orderIndex: i + 1,
    isCompleted: false,
    description: c.desc,
  }));
}

/**
 * Generator silabus default untuk Database & SQL
 */
function getDatabaseSections(dbName: string): ModuleSection[] {
  const chapters = [
    { title: `Fondasi Sistem Basis Data & Arsitektur ${dbName}`, desc: "Konsep dasar penyimpanan terstruktur, perbandingan model relasional vs non-relasional, dan instalasi mesin database." },
    { title: "Perancangan Skema, Normalisasi Data, & Integritas Relasional", desc: "Aturan normalisasi 1NF hingga BCNF, pemodelan Entity Relationship Diagram (ERD), dan foreign key constraints." },
    { title: "Data Definition Language (DDL) & Struktur Tabel", desc: "Sintaks pembuatan tabel, tipe data spesifik kolom, penguncian domain, dan migrasi skema database." },
    { title: "Data Manipulation Language (DML) & Kueri Analitik", desc: "Sintaks INSERT, UPDATE, DELETE, operasi penggabungan JOIN ganda, dan fungsi agregasi bertingkat." },
    { title: "Strategi Pengindeksan & Optimasi Rencana Eksekusi (Query Plan)", desc: "Struktur indeks B-Tree, Hash, GIN, pemanfaatan EXPLAIN ANALYZE, dan penghindaran full table scan." },
    { title: "Transaksi Atomik, Isolasi ACID, & Penanganan Konkurensi", desc: "Tingkat isolasi transaksi (Read Committed hingga Serializable), mekanisme locking, dan pemulihan WAL." },
    { title: "Prosedur Tersimpan, Trigger, & Tampilan Virtual (View/CTE)", desc: "Otomasi logika bisnis di sisi database menggunakan Common Table Expressions, View, dan Trigger fungsi." },
    { title: "Keamanan Basis Data, Cadangan (Backup), & Pemulihan Sistem", desc: "Manajemen kontrol akses pengguna (RBAC), enkripsi data in-transit/at-rest, dan strategi replikasi data." },
  ];

  return chapters.map((c, i) => ({
    id: `sec-db-${i + 1}`,
    title: `Bab ${i + 1}: ${c.title}`,
    orderIndex: i + 1,
    isCompleted: false,
    description: c.desc,
  }));
}

/**
 * Generator silabus default untuk Web Development
 */
function getWebDevelopmentSections(topicName: string): ModuleSection[] {
  const chapters = [
    { title: "Fondasi Arsitektur Web & Protokol Komunikasi HTTP", desc: "Model interaksi Client-Server, siklus Request-Response, DNS resolution, dan standar protokol web modern." },
    { title: "Struktur Semantik Dokumen & Tata Letak Responsif", desc: "Penggunaan elemen semantik HTML5, CSS Grid, Flexbox, dan perancangan antarmuka adaptif multi-perangkat." },
    { title: `Arsitektur Komponen Modular & Manajemen Status (${topicName})`, desc: "Pemisahan presentasi UI ke dalam komponen mandiri yang dapat digunakan kembali serta siklus reaktivitas data." },
    { title: "Integrasi Data Asinkronus & Konsumsi Layanan REST API", desc: "Pengambilan data asinkron via fetch/axios, penanganan status loading, caching klien, dan mitigasi galat jaringan." },
    { title: "Perutean Halaman Dinamis & Strategi Rendering (SSR/SSG)", desc: "Arsitektur Server-Side Rendering vs Static Site Generation, hidrasi komponen, dan optimasi Core Web Vitals." },
    { title: "Keamanan Aplikasi Web & Proteksi Kerentanan Klien", desc: "Pencegahan Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), sanitasi masukan, dan CORS header." },
    { title: "Pengujian Komponen, Aksesibilitas (a11y), & Audit Performa", desc: "Automated component testing, kepatuhan standar WCAG, optimasi bundle size, dan lazy loading aset." },
    { title: "Pipeline Build, Kontainerisasi, & Penerapan Produksi", desc: "Konfigurasi bundler modern, lingkungan staging/produksi, edge caching, dan deployment serverless." },
  ];

  return chapters.map((c, i) => ({
    id: `sec-web-${i + 1}`,
    title: `Bab ${i + 1}: ${c.title}`,
    orderIndex: i + 1,
    isCompleted: false,
    description: c.desc,
  }));
}

/**
 * Generator silabus default untuk Cyber Security
 */
function getCyberSecuritySections(topicName: string): ModuleSection[] {
  const chapters = [
    { title: "Prinsip Keamanan Informasi, CIA Triad, & Pemodelan Ancaman", desc: "Konsep Kerahasiaan, Integritas, Ketersediaan, metodologi STRIDE/DREAD, dan identifikasi vektor serangan." },
    { title: "Arsitektur Keamanan Jaringan & Protokol Komunikasi Terproteksi", desc: "Segmentasi jaringan, pemfilteran firewall, inspeksi paket jaringan, dan implementasi TLS/SSL." },
    { title: "Kriptografi Simetris, Asimetris, & Manajemen Kunci Publik", desc: "Penerapan enkripsi blok AES, pertukaran kunci RSA/ECC, sertifikat X.509, dan fungsi hash resisten benturan." },
    { title: "Autentikasi Modern, Otorisasi RBAC, & Protokol Token", desc: "Mekanisme Multi-Factor Authentication (MFA), OAuth 2.0, OpenID Connect, dan verifikasi JSON Web Token (JWT)." },
    { title: "Analisis Kerentanan Perangkat Lunak Standar OWASP Top 10", desc: "Eksplorasi dan mitigasi serangan Injection, Broken Access Control, Security Misconfiguration, dan XSS." },
    { title: "Pengerasan Server (Server Hardening) & Keamanan Sistem Operasi", desc: "Prinsip Least Privilege, penonaktifan port/layanan tidak terpakai, audit konfigurasi OS, dan patch management." },
    { title: "Sistem Deteksi Intrusi (IDS/IPS) & Tanggap Insiden Keamanan", desc: "Pemantauan log telemetri, SIEM, identifikasi anomali lalu lintas, dan protokol penanganan insiden siber." },
    { title: "Pengujian Penetrasi (Penetration Testing) & Kepatuhan Regulasi", desc: "Metodologi ethical hacking, pemindaian kerentanan otomatis, pelaporan temuan, dan standar audit keamanan." },
  ];

  return chapters.map((c, i) => ({
    id: `sec-sec-${i + 1}`,
    title: `Bab ${i + 1}: ${c.title}`,
    orderIndex: i + 1,
    isCompleted: false,
    description: c.desc,
  }));
}

/**
 * Generator silabus default untuk Ilmu Komputer & Rekayasa Umum
 */
function getGeneralComputerScienceSections(topicName: string): ModuleSection[] {
  const chapters = [
    { title: `Fondasi Teori & Konseptual ${topicName}`, desc: "Pengantar komprehensif landasan teoritis, sejarah perkembangan, dan ruang lingkup permasalahan inti." },
    { title: "Representasi Data, Format Masukan, & Struktur Informasi", desc: "Pemodelan entitas data, standardisasi format pertukaran data, dan validasi integritas masukan." },
    { title: "Prinsip Arsitektur Komputasi & Alur Eksekusi Sistem", desc: "Analisis alur pemrosesan data, dekomposisi modul sistem, dan ketergantungan antar-komponen." },
    { title: "Implementasi Algoritma Dasar & Logika Pemecahan Masalah", desc: "Penyusunan langkah algoritmik sistematis untuk menyelesaikan studi kasus terarah." },
    { title: "Optimasi Kinerja, Efisiensi Eksekusi, & Skalabilitas", desc: "Analisis bottlenecks komputasi, reduksi latensi pemrosesan, dan pemanfaatan sumber daya berimbang." },
    { title: "Penanganan Galat (Error Handling) & Keandalan Sistem", desc: "Strategi penanganan kondisi batas (edge cases), logging terstruktur, dan pemulihan dari kegagalan." },
    { title: "Pengujian Fungsional, Verifikasi, & Kriteria Kualitas", desc: "Metodologi pengujian kebenaran logika, pengujian batas masukan, dan evaluasi metrik kinerja." },
    { title: "Proyek Terapan Mandiri & Rekomendasi Praktik Terbaik", desc: "Studi kasus integrasi menyeluruh dan panduan implementasi berkelanjutan di lingkungan produksi." },
  ];

  return chapters.map((c, i) => ({
    id: `sec-gen-${i + 1}`,
    title: `Bab ${i + 1}: ${c.title}`,
    orderIndex: i + 1,
    isCompleted: false,
    description: c.desc,
  }));
}

/**
 * Fallback Preset Silabus Materi Seluruh Kategori Velqora
 * Menyediakan silabus terstruktur otentik sesuai domain masing-masing
 * agar tidak terjadi penyeragaman kurikulum yang tidak relevan.
 */
export function getDefaultSectionsForCategory(categoryName: string): ModuleSection[] {
  const norm = categoryName.toLowerCase().trim();

  // 1. Machine Learning (16 Bab)
  if (norm.includes("machine learning") || norm.includes("pembelajaran mesin")) {
    return getMachineLearningSections();
  }

  // 2. Natural Language Processing (14 Bab)
  if (norm.includes("natural language") || norm.includes("nlp") || norm.includes("pemrosesan bahasa")) {
    return getNaturalLanguageProcessingSections();
  }

  // 3. Reinforcement Learning (13 Bab)
  if (norm.includes("reinforcement")) {
    return getReinforcementLearningSections();
  }

  // 4. Recommendation System (12 Bab)
  if (norm.includes("recommendation") || norm.includes("rekomendasi")) {
    return getRecommendationSystemSections();
  }

  // 5. Multimodal AI (10 Bab)
  if (norm.includes("multimodal")) {
    return getMultimodalAiSections();
  }

  // 6. Robotics & Embodied AI (13 Bab)
  if (norm.includes("robotics") || norm.includes("robot") || norm.includes("embodied")) {
    return getRoboticsEmbodiedAiSections();
  }

  // 7. Speech & Audio AI (12 Bab)
  if (norm.includes("speech") || norm.includes("audio") || norm.includes("suara")) {
    return getSpeechAudioAiSections();
  }

  // 8. Time Series Forecasting & Anomaly Detection (12 Bab)
  if (norm.includes("time series") || norm.includes("forecasting") || norm.includes("deret waktu") || norm.includes("anomaly")) {
    return getTimeSeriesForecastingSections();
  }

  // 9. Vector Database & Retrieval System (11 Bab)
  if (norm.includes("vector") || norm.includes("retrieval") || norm.includes("vektor")) {
    return getVectorDatabaseRetrievalSections();
  }

  // 10. AI Agent (14 Bab)
  if (norm.includes("agent")) {
    return getAiAgentSections();
  }

  // 11. AI Ethics & Responsible AI (12 Bab)
  if (norm.includes("ethics") || norm.includes("etika") || norm.includes("responsible")) {
    return getAiEthicsSections();
  }

  // 12. AI Governance & Regulasi (12 Bab)
  if (norm.includes("governance") || norm.includes("regulasi") || norm.includes("tata kelola")) {
    return getAiGovernanceSections();
  }

  // 13. AI Security & Adversarial Machine Learning (12 Bab)
  if (norm.includes("security") || norm.includes("keamanan") || norm.includes("adversarial")) {
    if (norm.includes("adversarial") || norm.includes("ai security")) {
      return getAiSecuritySections();
    }
    return getCyberSecuritySections(categoryName);
  }

  // 14. AutoML & Neural Architecture Search (10 Bab)
  if (norm.includes("automl") || norm.includes("neural architecture search") || norm.includes("nas")) {
    return getAutoMlSections();
  }

  // 15. Computational Intelligence (10 Bab)
  if (
    norm.includes("computational intelligence") ||
    norm.includes("fuzzy") ||
    norm.includes("genetic") ||
    norm.includes("genetika") ||
    norm.includes("swarm")
  ) {
    return getComputationalIntelligenceSections();
  }

  // 16. Computer Vision (14 Bab)
  if (norm.includes("computer vision") || norm.includes("vision") || norm.includes("citra")) {
    return getComputerVisionSections();
  }

  // 17. Data Analyst (14 Bab)
  if (norm.includes("data analyst") || norm.includes("analyst") || norm.includes("analisis data")) {
    return getDataAnalystSections();
  }

  // 18. Data Engineering & Big Data untuk AI (12 Bab)
  if (norm.includes("data engineering") || norm.includes("big data") || norm.includes("lakehouse")) {
    return getDataEngineeringAiSections();
  }

  // 19. Data Science (16 Bab)
  if (norm.includes("data science") || norm.includes("sains data")) {
    return getDataScienceSections();
  }

  // 20. Deep Learning (15 Bab)
  if (norm.includes("deep learning") || norm.includes("pembelajaran mendalam")) {
    return getDeepLearningSections();
  }

  // 21. Edge AI & TinyML (12 Bab)
  if (norm.includes("edge ai") || norm.includes("tinyml") || norm.includes("edge")) {
    return getEdgeAiSections();
  }

  // 22. Expert System (9 Bab)
  if (norm.includes("expert system") || norm.includes("sistem pakar") || norm.includes("expert")) {
    return getExpertSystemSections();
  }

  // 23. Generative AI (14 Bab)
  if (norm.includes("generative ai") || norm.includes("genai") || norm.includes("generatif")) {
    return getGenerativeAiSections();
  }

  // 24. Graph Neural Network (GNN) (11 Bab)
  if (norm.includes("graph neural network") || norm.includes("gnn")) {
    return getGraphNeuralNetworkSections();
  }

  // 25. Knowledge Representation (10 Bab)
  if (
    norm.includes("knowledge representation") ||
    norm.includes("representasi pengetahuan") ||
    norm.includes("knowledge rep")
  ) {
    return getKnowledgeRepresentationSections();
  }

  // 26. Large Language Model (15 Bab)
  if (norm.includes("large language model") || norm.includes("llm")) {
    return getLargeLanguageModelSections();
  }

  // 27. MLOps & AI Deployment (14 Bab)
  if (
    norm.includes("mlops") ||
    norm.includes("ai deployment") ||
    norm.includes("deployment")
  ) {
    return getMlopsSections();
  }

  // 28. Bahasa Pemrograman (Programming Languages)
  if (
    norm.includes("pemrograman") ||
    norm.includes("programming") ||
    norm.includes("python") ||
    norm.includes("javascript") ||
    norm.includes("typescript") ||
    norm.includes("c++") ||
    norm.includes("c#") ||
    norm.includes("java") ||
    norm.includes("golang") ||
    norm.includes("go") ||
    norm.includes("rust") ||
    norm.includes("php") ||
    norm.includes("ruby") ||
    norm.includes("swift") ||
    norm.includes("kotlin") ||
    norm.includes("dart") ||
    norm.includes("html") ||
    norm.includes("css")
  ) {
    return getProgrammingLanguageSections(categoryName);
  }

  // 29. Algoritma & Struktur Data
  if (
    norm.includes("algoritma") ||
    norm.includes("struktur data") ||
    norm.includes("algorithm") ||
    norm.includes("array") ||
    norm.includes("tree") ||
    norm.includes("graph") ||
    norm.includes("stack") ||
    norm.includes("queue") ||
    norm.includes("heap") ||
    norm.includes("hash table") ||
    norm.includes("linked list") ||
    norm.includes("sorting") ||
    norm.includes("searching") ||
    norm.includes("dynamic programming") ||
    norm.includes("greedy") ||
    norm.includes("backtracking") ||
    norm.includes("big o") ||
    norm.includes("complexity")
  ) {
    return getAlgorithmAndDataStructureSections(categoryName);
  }

  // 30. Basis Data (Database & SQL)
  if (
    norm.includes("database") ||
    norm.includes("basis data") ||
    norm.includes("sql") ||
    norm.includes("postgresql") ||
    norm.includes("mysql") ||
    norm.includes("mongodb") ||
    norm.includes("redis") ||
    norm.includes("sqlite") ||
    norm.includes("nosql")
  ) {
    return getDatabaseSections(categoryName);
  }

  // 31. Web Development
  if (
    norm.includes("web") ||
    norm.includes("frontend") ||
    norm.includes("backend") ||
    norm.includes("react") ||
    norm.includes("next.js") ||
    norm.includes("vue") ||
    norm.includes("angular") ||
    norm.includes("svelte") ||
    norm.includes("rest api")
  ) {
    return getWebDevelopmentSections(categoryName);
  }

  // 32. Cyber Security
  if (
    norm.includes("cyber security") ||
    norm.includes("keamanan") ||
    norm.includes("security") ||
    norm.includes("cryptography") ||
    norm.includes("kriptografi") ||
    norm.includes("encryption") ||
    norm.includes("owasp")
  ) {
    return getCyberSecuritySections(categoryName);
  }

  // 33. Kecerdasan Buatan Umum
  if (
    norm.includes("ai") ||
    norm.includes("artificial intelligence") ||
    norm.includes("kecerdasan buatan") ||
    norm.includes("fundamentals")
  ) {
    return getAiFundamentalsSections();
  }

  // 34. Fallback Universal untuk Kategori Lainnya (Ilmu Komputer Umum)
  return getGeneralComputerScienceSections(categoryName);
}

/**
 * Alias kompatibilitas mundur untuk pemanggil eksisting
 */
export const getDefaultAiSections = getDefaultSectionsForCategory;
