import { ScheduleDayName } from "@/lib/schedule-import/types";

export interface GroundTruthRecord {
  title: string;
  day?: ScheduleDayName;
  date?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  location?: string;
  lecturer?: string;
  courseCode?: string;
}

export interface GroundTruthFixture {
  fixtureId: string;
  fileName: string;
  fileType: "pdf" | "docx" | "xlsx" | "csv" | "txt";
  description: string;
  expectedRecordsCount: number;
  groundTruthRecords: GroundTruthRecord[];
  isScanned?: boolean;
  isCorrupted?: boolean;
  isEmpty?: boolean;
  isUnrelated?: boolean;
}

/**
 * Independent Ground-Truth Dataset for Real-World Academic Schedules (23 Comprehensive Fixtures)
 */
export const GROUND_TRUTH_DATASET: GroundTruthFixture[] = [
  // 1. CSV Standard Comma
  {
    fixtureId: "csv_standard_comma",
    fileName: "jadwal_semester_ganjil.csv",
    fileType: "csv",
    description: "Standard Indonesian university schedule CSV with comma separator",
    expectedRecordsCount: 4,
    groundTruthRecords: [
      {
        title: "Pemrograman Web Lanjut",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:30",
        location: "Lab Komputer 3",
        lecturer: "Dr. Eng. Budi Santoso, M.T.",
        courseCode: "IF3101",
      },
      {
        title: "Kecerdasan Buatan",
        day: "Selasa",
        startTime: "13:00",
        endTime: "15:30",
        location: "Ruang 402 Gedung B",
        lecturer: "Prof. Dr. Ir. Siti Nurhaliza, M.Sc.",
        courseCode: "IF3102",
      },
      {
        title: "Sistem Basis Data Terdistribusi",
        day: "Rabu",
        startTime: "09:00",
        endTime: "11:30",
        location: "Lab Basis Data",
        lecturer: "Ahmad Fauzi, S.Kom., M.Cs.",
        courseCode: "IF3103",
      },
      {
        title: "Etika Profesi & Rekayasa Perangkat Lunak",
        day: "Jumat",
        startTime: "08:00",
        endTime: "10:00",
        location: "Auditorium Utama",
        lecturer: "Dra. Maya Safitri, M.Si.",
        courseCode: "IF3104",
      },
    ],
  },

  // 2. CSV Semicolon with Quoted Values and Out-of-order Columns
  {
    fixtureId: "csv_semicolon_quoted",
    fileName: "jadwal_akademik_quoted.csv",
    fileType: "csv",
    description: "CSV with semicolon separator, quoted multiline strings, and rearranged columns",
    expectedRecordsCount: 3,
    groundTruthRecords: [
      {
        title: "Jaringan Komputer dan Keamanan Siber",
        day: "Kamis",
        startTime: "10:00",
        endTime: "12:30",
        location: "Lab Jaringan Lt. 2",
        lecturer: "Rian Hidayat, M.T., CEH",
        courseCode: "CS401",
      },
      {
        title: "Interaksi Manusia dan Komputer",
        day: "Senin",
        startTime: "13:00",
        endTime: "15:00",
        location: "Ruang Kreatif 101",
        lecturer: "Dewi Lestari, S.Sn., M.Ds.",
        courseCode: "CS402",
      },
      {
        title: "Manajemen Proyek Teknologi Informasi",
        day: "Rabu",
        startTime: "08:00",
        endTime: "10:30",
        location: "Ruang Seminar 2",
        lecturer: "Ir. Hendra Gunawan, M.M., PMP",
        courseCode: "CS403",
      },
    ],
  },

  // 3. CSV Tab-Separated
  {
    fixtureId: "csv_tab_separated",
    fileName: "jadwal_kuliah_tsv.tsv",
    fileType: "csv",
    description: "Tab-separated TSV schedule file",
    expectedRecordsCount: 3,
    groundTruthRecords: [
      {
        title: "Sistem Operasi",
        day: "Selasa",
        startTime: "08:00",
        endTime: "10:30",
        location: "Lab OS 1",
        lecturer: "Fajar Pratama, M.Kom.",
        courseCode: "IF201",
      },
      {
        title: "Algoritma Pemrograman",
        day: "Kamis",
        startTime: "13:00",
        endTime: "15:30",
        location: "Lab Komputer 2",
        lecturer: "Ratna Sari, M.T.",
        courseCode: "IF202",
      },
      {
        title: "Statistika & Probabilitas",
        day: "Jumat",
        startTime: "09:00",
        endTime: "11:00",
        location: "Ruang 303",
        lecturer: "Dr. Bambang S.",
        courseCode: "IF203",
      },
    ],
  },

  // 4. XLSX with Offset Headers (Banners at Row 1–2, Headers at Row 4)
  {
    fixtureId: "xlsx_offset_headers",
    fileName: "jadwal_fakultas_teknik.xlsx",
    fileType: "xlsx",
    description: "Excel schedule with decorative banners on top rows and column headers at row 4",
    expectedRecordsCount: 3,
    groundTruthRecords: [
      {
        title: "Struktur Data & Algoritma",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        location: "Lab Pemrograman 1",
        lecturer: "Bambang Sudarsono, S.T., M.Kom.",
        courseCode: "TI-201",
      },
      {
        title: "Kalkulus Lanjut",
        day: "Selasa",
        startTime: "10:15",
        endTime: "12:15",
        location: "Ruang Teori 301",
        lecturer: "Drs. Joko Waluyo, M.Pd.",
        courseCode: "TI-202",
      },
      {
        title: "Arsitektur Komputer",
        day: "Kamis",
        startTime: "13:30",
        endTime: "16:00",
        location: "Ruang Multimedia",
        lecturer: "Dr. Wahyu Hidayat, M.T.",
        courseCode: "TI-203",
      },
    ],
  },

  // 5. XLSX Multi-Sheet Workbook
  {
    fixtureId: "xlsx_multisheet",
    fileName: "jadwal_gabungan_semester.xlsx",
    fileType: "xlsx",
    description: "Excel workbook containing separate sheets for Semester 1 and Semester 3",
    expectedRecordsCount: 4,
    groundTruthRecords: [
      {
        title: "Fisika Dasar II",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:30",
        location: "Lab Fisika",
        lecturer: "Dr. Sri Mulyani, M.Si.",
        courseCode: "FS102",
      },
      {
        title: "Matematika Diskrit",
        day: "Rabu",
        startTime: "13:00",
        endTime: "15:30",
        location: "Ruang 205",
        lecturer: "Agus Prasetyo, M.Sc.",
        courseCode: "MD103",
      },
      {
        title: "Machine Learning & Deep Learning",
        day: "Selasa",
        startTime: "09:00",
        endTime: "11:30",
        location: "Lab AI Gedung C",
        lecturer: "Prof. Dr. Ir. Siti Nurhaliza, M.Sc.",
        courseCode: "AI301",
      },
      {
        title: "Cloud Computing Architecture",
        day: "Kamis",
        startTime: "14:00",
        endTime: "16:30",
        location: "Lab Jaringan",
        lecturer: "Rian Hidayat, M.T., CEH",
        courseCode: "CC302",
      },
    ],
  },

  // 6. XLSX Merged Headers
  {
    fixtureId: "xlsx_merged_headers",
    fileName: "jadwal_merged_cells.xlsx",
    fileType: "xlsx",
    description: "Excel schedule with merged day headers across multiple rows",
    expectedRecordsCount: 3,
    groundTruthRecords: [
      {
        title: "Pengembangan Web",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        location: "Lab 1",
        lecturer: "Budi Santoso, M.T.",
        courseCode: "PW101",
      },
      {
        title: "Basis Data",
        day: "Senin",
        startTime: "10:30",
        endTime: "12:30",
        location: "Lab 2",
        lecturer: "Ahmad Fauzi, M.Cs.",
        courseCode: "BD102",
      },
      {
        title: "Keamanan Jaringan",
        day: "Selasa",
        startTime: "13:00",
        endTime: "15:00",
        location: "Lab 3",
        lecturer: "Rian Hidayat, M.T.",
        courseCode: "KJ103",
      },
    ],
  },

  // 7. DOCX Academic Table
  {
    fixtureId: "docx_academic_table",
    fileName: "jadwal_kuliah_fakultas_docx.docx",
    fileType: "docx",
    description: "Microsoft Word (.docx) document with structured academic schedule table",
    expectedRecordsCount: 3,
    groundTruthRecords: [
      {
        title: "Teori Graf dan Otomata",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        location: "Ruang 204",
        lecturer: "Dr. Anisa Rahmawati, M.Kom.",
        courseCode: "IF401",
      },
      {
        title: "Pengembangan Aplikasi Bergerak",
        day: "Selasa",
        startTime: "13:00",
        endTime: "15:30",
        location: "Lab Mobile Lt. 3",
        lecturer: "Kevin Sanjaya, S.Kom., M.Cs.",
        courseCode: "IF402",
      },
      {
        title: "Data Warehouse & Business Intelligence",
        day: "Jumat",
        startTime: "08:30",
        endTime: "11:00",
        location: "Ruang Riset 102",
        lecturer: "Prof. Dr. Ir. M. Yusuf, M.Eng.",
        courseCode: "IF403",
      },
    ],
  },

  // 8. DOCX Complex Table Multi Lecturer
  {
    fixtureId: "docx_complex_table_multi_lecturer",
    fileName: "jadwal_kolaboratif.docx",
    fileType: "docx",
    description: "Word docx schedule table with multiple team-teaching lecturers",
    expectedRecordsCount: 2,
    groundTruthRecords: [
      {
        title: "Kapita Selekta Komputasi",
        day: "Rabu",
        startTime: "09:00",
        endTime: "11:30",
        location: "Auditorium",
        lecturer: "Prof. Budi; Dr. Hendra",
        courseCode: "IF501",
      },
      {
        title: "Proyek Perangkat Lunak Terapan",
        day: "Kamis",
        startTime: "13:00",
        endTime: "16:00",
        location: "Lab Riset 1 / Lab Riset 2",
        lecturer: "Maya Safitri, M.Si.; Kevin Sanjaya, M.Cs.",
        courseCode: "IF502",
      },
    ],
  },

  // 9. PDF Standard Table
  {
    fixtureId: "pdf_standard_table",
    fileName: "jadwal_resmi_universitas.pdf",
    fileType: "pdf",
    description: "Standard PDF schedule export with academic tabular text",
    expectedRecordsCount: 2,
    groundTruthRecords: [
      {
        title: "Pemrograman Berbasis Objek",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:30",
        location: "Lab Komputer 1",
        lecturer: "Dr. Budi Santoso",
        courseCode: "IF201",
      },
      {
        title: "Kriptografi Modern",
        day: "Rabu",
        startTime: "13:00",
        endTime: "15:00",
        location: "Ruang Teori 101",
        lecturer: "Ahmad Fauzi, M.Cs.",
        courseCode: "IF202",
      },
    ],
  },

  // 10. PDF Multi-Page Document
  {
    fixtureId: "pdf_multi_page",
    fileName: "jadwal_semester_lengkap.pdf",
    fileType: "pdf",
    description: "Multi-page PDF schedule document across Semester 1 and Semester 3",
    expectedRecordsCount: 2,
    groundTruthRecords: [
      {
        title: "Jaringan Komputer",
        day: "Selasa",
        startTime: "08:00",
        endTime: "10:30",
        location: "Lab Jaringan",
        lecturer: "Rian Hidayat, M.T.",
        courseCode: "IF301",
      },
      {
        title: "Kecerdasan Buatan Lanjut",
        day: "Kamis",
        startTime: "13:00",
        endTime: "15:30",
        location: "Lab AI",
        lecturer: "Prof. Siti Nurhaliza",
        courseCode: "IF302",
      },
    ],
  },

  // 11. PDF Scanned Detect
  {
    fixtureId: "pdf_scanned_detect",
    fileName: "scan_jadwal_terpindai.pdf",
    fileType: "pdf",
    description: "Scanned image-only PDF without embedded text stream",
    expectedRecordsCount: 0,
    groundTruthRecords: [],
    isScanned: true,
  },

  // 12. PDF Corrupted Stream
  {
    fixtureId: "pdf_corrupt",
    fileName: "dokumen_rusak.pdf",
    fileType: "pdf",
    description: "Corrupted PDF binary payload",
    expectedRecordsCount: 0,
    groundTruthRecords: [],
    isCorrupted: true,
  },

  // 13. TXT Multi-Line Block Format
  {
    fixtureId: "txt_block_format",
    fileName: "catatan_jadwal_kuliah.txt",
    fileType: "txt",
    description: "Free-form structured notes with multi-line blocks per agenda",
    expectedRecordsCount: 3,
    groundTruthRecords: [
      {
        title: "Pemrograman Berorientasi Objek",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        location: "Lab Komputer 2",
        lecturer: "Ir. Hendra Gunawan, M.M.",
        courseCode: "IF2101",
      },
      {
        title: "Pengolahan Citra Digital",
        day: "Selasa",
        startTime: "13:30",
        endTime: "15:30",
        location: "Ruang Teori 105",
        lecturer: "Dr. Anisa Rahmawati, M.Kom.",
        courseCode: "IF2102",
      },
      {
        title: "Sistem Tertanam & IoT",
        day: "Kamis",
        startTime: "09:00",
        endTime: "11:30",
        location: "Lab Hardware Lt. 1",
        lecturer: "Kevin Sanjaya, M.Cs.",
        courseCode: "IF2103",
      },
    ],
  },

  // 14. TXT Inline Delimited Format with Indonesian Aliases
  {
    fixtureId: "txt_inline_delimited",
    fileName: "jadwal_kuliah_ringkas.txt",
    fileType: "txt",
    description: "Quick informal text notes with day abbreviations (Sen, Rab, Jum) and time with dots",
    expectedRecordsCount: 3,
    groundTruthRecords: [
      {
        title: "Sistem Terdistribusi",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        location: "Lab Terdistribusi",
        lecturer: "Dr. Eng. Budi Santoso",
        courseCode: "CS301",
      },
      {
        title: "Kriptografi & Keamanan Informasi",
        day: "Rabu",
        startTime: "10:30",
        endTime: "12:30",
        location: "Ruang 302",
        lecturer: "Rian Hidayat, M.T.",
        courseCode: "CS302",
      },
      {
        title: "Technopreneurship & Startup Digital",
        day: "Jumat",
        startTime: "13:30",
        endTime: "15:30",
        location: "Aula Startup Hub",
        lecturer: "Dewi Lestari, M.Ds.",
        courseCode: "CS303",
      },
    ],
  },

  // 15. TXT English Days & AM/PM Format
  {
    fixtureId: "txt_english_days_am_pm",
    fileName: "international_class_schedule.txt",
    fileType: "txt",
    description: "International schedule with English day names and AM/PM time ranges",
    expectedRecordsCount: 2,
    groundTruthRecords: [
      {
        title: "Advanced Data Structures",
        day: "Senin", // Normalized to Indonesian canonical
        startTime: "08:00",
        endTime: "10:00",
        location: "Room 401",
        lecturer: "Prof. John Doe",
        courseCode: "CS201",
      },
      {
        title: "Operating Systems Principles",
        day: "Rabu", // Wednesday normalized to Rabu
        startTime: "13:30",
        endTime: "15:30",
        location: "Lab 2",
        lecturer: "Dr. Alice Smith",
        courseCode: "CS202",
      },
    ],
  },

  // 16. TXT Ambiguous Time Missing End Time
  {
    fixtureId: "txt_ambiguous_time_missing_end",
    fileName: "jadwal_hanya_jam_mulai.txt",
    fileType: "txt",
    description: "Schedule items listing only start times without explicit end times",
    expectedRecordsCount: 2,
    groundTruthRecords: [
      {
        title: "Seminar Proposal Skripsi",
        day: "Selasa",
        startTime: "09:00",
        endTime: "10:30", // Estimated default 90m slot
        location: "Ruang Sidang 1",
        lecturer: "Dr. Budi Santoso",
      },
      {
        title: "Bimbingan Akademik",
        day: "Kamis",
        startTime: "14:00",
        endTime: "15:30",
        location: "Ruang Dosen",
        lecturer: "Prof. Siti Nurhaliza",
      },
    ],
  },

  // 17. TXT Multi-Lecturer & Multi-Room Notes
  {
    fixtureId: "txt_multi_lecturer_multi_room",
    fileName: "jadwal_team_teaching.txt",
    fileType: "txt",
    description: "Schedule notes containing team-teaching lecturers and combined rooms",
    expectedRecordsCount: 2,
    groundTruthRecords: [
      {
        title: "Kecerdasan Buatan Terapan",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:30",
        location: "Lab AI 1 / Lab AI 2",
        lecturer: "Prof. Siti Nurhaliza; Dr. Budi Santoso",
        courseCode: "AI401",
      },
      {
        title: "Praktikum Jaringan & Cloud",
        day: "Rabu",
        startTime: "13:00",
        endTime: "16:00",
        location: "Lab Jaringan Lt. 2",
        lecturer: "Rian Hidayat, M.T.; Kevin Sanjaya, M.Cs.",
        courseCode: "AI402",
      },
    ],
  },

  // 18. TXT Conflicting Schedules
  {
    fixtureId: "txt_conflicting_schedules",
    fileName: "jadwal_tumpang_tindih.txt",
    fileType: "txt",
    description: "Schedule notes with overlapping time slots on the same day",
    expectedRecordsCount: 2,
    groundTruthRecords: [
      {
        title: "Matematika Diskrit",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        location: "Ruang 101",
      },
      {
        title: "Fisika Komputasi",
        day: "Senin",
        startTime: "09:00",
        endTime: "11:00",
        location: "Ruang 102",
      },
    ],
  },

  // 19. TXT Duplicate Schedules
  {
    fixtureId: "txt_duplicate_schedules",
    fileName: "jadwal_duplikat.txt",
    fileType: "txt",
    description: "Schedule notes with exact duplicate entries",
    expectedRecordsCount: 2,
    groundTruthRecords: [
      {
        title: "Pemrograman Web Lanjut",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        location: "Lab 1",
      },
      {
        title: "Pemrograman Web Lanjut",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        location: "Lab 1",
      },
    ],
  },

  // 20. TXT Date Mismatch
  {
    fixtureId: "txt_date_mismatch",
    fileName: "jadwal_tanggal_mismatch.txt",
    fileType: "txt",
    description: "Schedule stating Senin, 25 Agustus 2026 (which is actually a Tuesday)",
    expectedRecordsCount: 1,
    groundTruthRecords: [
      {
        title: "Ujian Akhir Semester Pemrograman",
        day: "Senin",
        date: "2026-08-25",
        startTime: "08:00",
        endTime: "10:00",
        location: "Ruang Ujian 1",
      },
    ],
  },

  // 21. Unrelated Document (Essay / Makalah)
  {
    fixtureId: "unrelated_document_essay",
    fileName: "makalah_etika_teknologi.txt",
    fileType: "txt",
    description: "Academic essay without schedule structure",
    expectedRecordsCount: 0,
    groundTruthRecords: [],
    isUnrelated: true,
  },

  // 22. Empty Document
  {
    fixtureId: "empty_document",
    fileName: "dokumen_kosong.txt",
    fileType: "txt",
    description: "Zero byte or whitespace only document",
    expectedRecordsCount: 0,
    groundTruthRecords: [],
    isEmpty: true,
  },

  // 23. Malformed Archive
  {
    fixtureId: "malformed_archive_bomb",
    fileName: "arsip_rusak.docx",
    fileType: "docx",
    description: "Corrupted docx zip header archive",
    expectedRecordsCount: 0,
    groundTruthRecords: [],
    isCorrupted: true,
  },
];
