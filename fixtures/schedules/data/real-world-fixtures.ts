import * as XLSX from "xlsx";
import JSZip from "jszip";
import { GROUND_TRUTH_DATASET, GroundTruthFixture } from "../ground-truth";

/**
 * Generates synthetic but 100% compliant file buffers for all 23 ground truth fixtures
 */
export async function getFixtureBuffer(fixtureId: string): Promise<{
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  fixture: GroundTruthFixture;
}> {
  const fixture = GROUND_TRUTH_DATASET.find((f) => f.fixtureId === fixtureId);
  if (!fixture) {
    throw new Error(`Fixture with id "${fixtureId}" not found in ground truth dataset.`);
  }

  let buffer: Buffer;
  let mimeType = "text/plain";

  switch (fixture.fixtureId) {
    // 1. CSV Standard Comma
    case "csv_standard_comma": {
      mimeType = "text/csv";
      const csvContent = [
        "Kode MK,Mata Kuliah,Hari,Waktu Mulai,Waktu Selesai,Ruangan,Dosen Pengampu",
        "IF3101,Pemrograman Web Lanjut,Senin,08:00,10:30,Lab Komputer 3,Dr. Eng. Budi Santoso, M.T.",
        "IF3102,Kecerdasan Buatan,Selasa,13:00,15:30,Ruang 402 Gedung B,Prof. Dr. Ir. Siti Nurhaliza, M.Sc.",
        "IF3103,Sistem Basis Data Terdistribusi,Rabu,09:00,11:30,Lab Basis Data,Ahmad Fauzi, S.Kom., M.Cs.",
        "IF3104,Etika Profesi & Rekayasa Perangkat Lunak,Jumat,08:00,10:00,Auditorium Utama,Dra. Maya Safitri, M.Si.",
      ].join("\n");
      buffer = Buffer.from(csvContent, "utf-8");
      break;
    }

    // 2. CSV Semicolon with Quoted Values and Out-of-order Columns
    case "csv_semicolon_quoted": {
      mimeType = "text/csv";
      const bom = "\uFEFF";
      const csvContent =
        bom +
        [
          '"Ruangan";"Dosen";"Hari";"Jam";"Kode";"Mata Kuliah"',
          '"Lab Jaringan Lt. 2";"Rian Hidayat, M.T., CEH";"Kamis";"10:00 - 12:30";"CS401";"Jaringan Komputer dan Keamanan Siber"',
          '"Ruang Kreatif 101";"Dewi Lestari, S.Sn., M.Ds.";"Senin";"13:00 - 15:00";"CS402";"Interaksi Manusia dan Komputer"',
          '"Ruang Seminar 2";"Ir. Hendra Gunawan, M.M., PMP";"Rabu";"08:00 - 10:30";"CS403";"Manajemen Proyek Teknologi Informasi"',
        ].join("\r\n");
      buffer = Buffer.from(csvContent, "utf-8");
      break;
    }

    // 3. CSV Tab-Separated
    case "csv_tab_separated": {
      mimeType = "text/tab-separated-values";
      const tsvContent = [
        "Kode MK\tMata Kuliah\tHari\tJam\tRuang\tDosen",
        "IF201\tSistem Operasi\tSelasa\t08:00 - 10:30\tLab OS 1\tFajar Pratama, M.Kom.",
        "IF202\tAlgoritma Pemrograman\tKamis\t13:00 - 15:30\tLab Komputer 2\tRatna Sari, M.T.",
        "IF203\tStatistika & Probabilitas\tJumat\t09:00 - 11:00\tRuang 303\tDr. Bambang S.",
      ].join("\n");
      buffer = Buffer.from(tsvContent, "utf-8");
      break;
    }

    // 4. XLSX Offset Headers
    case "xlsx_offset_headers": {
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const wsData = [
        ["UNIVERSITAS VELQORA INDONESIA"],
        ["JADWAL PERKULIAHAN SEMESTER GANJIL TAHUN AKADEMIK 2026/2027"],
        [""],
        ["No", "Kode MK", "Mata Kuliah", "Hari", "Waktu", "Ruangan", "Dosen"],
        ["1", "TI-201", "Struktur Data & Algoritma", "Senin", "08:00 - 10:00", "Lab Pemrograman 1", "Bambang Sudarsono, S.T., M.Kom."],
        ["2", "TI-202", "Kalkulus Lanjut", "Selasa", "10:15 - 12:15", "Ruang Teori 301", "Drs. Joko Waluyo, M.Pd."],
        ["3", "TI-203", "Arsitektur Komputer", "Kamis", "13:30 - 16:00", "Ruang Multimedia", "Dr. Wahyu Hidayat, M.T."],
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "Jadwal_TI");
      const out = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      buffer = Buffer.isBuffer(out) ? out : Buffer.from(out);
      break;
    }

    // 5. XLSX Multi-Sheet
    case "xlsx_multisheet": {
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const wb = XLSX.utils.book_new();

      const ws1Data = [
        ["Kode MK", "Mata Kuliah", "Hari", "Jam Mulai", "Jam Selesai", "Ruang", "Dosen"],
        ["FS102", "Fisika Dasar II", "Senin", "08:00", "10:30", "Lab Fisika", "Dr. Sri Mulyani, M.Si."],
        ["MD103", "Matematika Diskrit", "Rabu", "13:00", "15:30", "Ruang 205", "Agus Prasetyo, M.Sc."],
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);
      XLSX.utils.book_append_sheet(wb, ws1, "Semester 1");

      const ws2Data = [
        ["Kode MK", "Mata Kuliah", "Hari", "Jam Mulai", "Jam Selesai", "Ruang", "Dosen"],
        ["AI301", "Machine Learning & Deep Learning", "Selasa", "09:00", "11:30", "Lab AI Gedung C", "Prof. Dr. Ir. Siti Nurhaliza, M.Sc."],
        ["CC302", "Cloud Computing Architecture", "Kamis", "14:00", "16:30", "Lab Jaringan", "Rian Hidayat, M.T., CEH"],
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
      XLSX.utils.book_append_sheet(wb, ws2, "Semester 3");

      const out = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      buffer = Buffer.isBuffer(out) ? out : Buffer.from(out);
      break;
    }

    // 6. XLSX Merged Headers
    case "xlsx_merged_headers": {
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const wsData = [
        ["Hari", "Kode", "Mata Kuliah", "Jam", "Ruangan", "Dosen"],
        ["Senin", "PW101", "Pengembangan Web", "08:00 - 10:00", "Lab 1", "Budi Santoso, M.T."],
        ["", "BD102", "Basis Data", "10:30 - 12:30", "Lab 2", "Ahmad Fauzi, M.Cs."],
        ["Selasa", "KJ103", "Keamanan Jaringan", "13:00 - 15:00", "Lab 3", "Rian Hidayat, M.T."],
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "MergedSheet");
      const out = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      buffer = Buffer.isBuffer(out) ? out : Buffer.from(out);
      break;
    }

    // 7. DOCX Academic Table
    case "docx_academic_table": {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const zip = new JSZip();
      const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>JADWAL KULIAH FAKULTAS ILMU KOMPUTER</w:t></w:r></w:p>
    <w:tbl>
      <w:tr>
        <w:tc><w:p><w:r><w:t>Kode MK</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Mata Kuliah</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Hari</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Waktu</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Ruangan</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Dosen</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:p><w:r><w:t>IF401</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Teori Graf dan Otomata</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Senin</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>08:00 - 10:00</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Ruang 204</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Dr. Anisa Rahmawati, M.Kom.</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:p><w:r><w:t>IF402</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Pengembangan Aplikasi Bergerak</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Selasa</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>13:00 - 15:30</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Lab Mobile Lt. 3</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Kevin Sanjaya, S.Kom., M.Cs.</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:p><w:r><w:t>IF403</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Data Warehouse &amp; Business Intelligence</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Jumat</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>08:30 - 11:00</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Ruang Riset 102</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Prof. Dr. Ir. M. Yusuf, M.Eng.</w:t></w:r></w:p></w:tc>
      </w:tr>
    </w:tbl>
  </w:body>
</w:document>`;
      zip.file("word/document.xml", documentXml);
      buffer = await zip.generateAsync({ type: "nodebuffer" });
      break;
    }

    // 8. DOCX Complex Table Multi Lecturer
    case "docx_complex_table_multi_lecturer": {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const zip = new JSZip();
      const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:tbl>
      <w:tr>
        <w:tc><w:p><w:r><w:t>Kode</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Mata Kuliah</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Hari</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Jam</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Ruang</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Dosen Pengampu</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:p><w:r><w:t>IF501</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Kapita Selekta Komputasi</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Rabu</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>09:00 - 11:30</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Auditorium</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Prof. Budi; Dr. Hendra</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:p><w:r><w:t>IF502</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Proyek Perangkat Lunak Terapan</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Kamis</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>13:00 - 16:00</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Lab Riset 1 / Lab Riset 2</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Maya Safitri, M.Si.; Kevin Sanjaya, M.Cs.</w:t></w:r></w:p></w:tc>
      </w:tr>
    </w:tbl>
  </w:body>
</w:document>`;
      zip.file("word/document.xml", documentXml);
      buffer = await zip.generateAsync({ type: "nodebuffer" });
      break;
    }

    // 9. PDF Standard Table
    case "pdf_standard_table": {
      mimeType = "application/pdf";
      const pdfRaw = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 300 >>
stream
BT
/F1 12 Tf
50 700 Td
(Mata Kuliah: Pemrograman Berbasis Objek | Hari: Senin | Waktu: 08:00 - 10:30 | Ruang: Lab Komputer 1 | Dosen: Dr. Budi Santoso | Kode: IF201) Tj
0 -30 Td
(Mata Kuliah: Kriptografi Modern | Hari: Rabu | Waktu: 13:00 - 15:00 | Ruang: Ruang Teori 101 | Dosen: Ahmad Fauzi, M.Cs. | Kode: IF202) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000600 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
670
%%EOF`;
      buffer = Buffer.from(pdfRaw, "utf-8");
      break;
    }

    // 10. PDF Multi-Page Document
    case "pdf_multi_page": {
      mimeType = "application/pdf";
      const pdfRaw = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 7 0 R >> >> >>
endobj
4 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 7 0 R >> >> >>
endobj
5 0 obj
<< /Length 200 >>
stream
BT
/F1 12 Tf
50 700 Td
(Jaringan Komputer | Selasa | 08:00 - 10:30 | Lab Jaringan | Rian Hidayat, M.T. | IF301) Tj
ET
endstream
endobj
6 0 obj
<< /Length 200 >>
stream
BT
/F1 12 Tf
50 700 Td
(Kecerdasan Buatan Lanjut | Kamis | 13:00 - 15:30 | Lab AI | Prof. Siti Nurhaliza | IF302) Tj
ET
endstream
endobj
7 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 8
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000123 00000 n 
0000000242 00000 n 
0000000361 00000 n 
0000000620 00000 n 
0000000880 00000 n 
trailer
<< /Size 8 /Root 1 0 R >>
startxref
950
%%EOF`;
      buffer = Buffer.from(pdfRaw, "utf-8");
      break;
    }

    // 11. PDF Scanned Detect
    case "pdf_scanned_detect": {
      mimeType = "application/pdf";
      buffer = Buffer.from(`%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF`);
      break;
    }

    // 12. PDF Corrupted
    case "pdf_corrupt": {
      mimeType = "application/pdf";
      buffer = Buffer.from("NOT_A_VALID_PDF_BINARY_STREAM");
      break;
    }

    // 13. TXT Block Format
    case "txt_block_format": {
      mimeType = "text/plain";
      const txtContent = [
        "JADWAL PERKULIAHAN MAHASISWA",
        "============================",
        "",
        "Mata Kuliah : Pemrograman Berorientasi Objek (IF2101)",
        "Hari        : Senin",
        "Waktu       : 08:00 - 10:00 WIB",
        "Ruang       : Lab Komputer 2",
        "Dosen       : Ir. Hendra Gunawan, M.M.",
        "",
        "Mata Kuliah : Pengolahan Citra Digital (IF2102)",
        "Hari        : Selasa",
        "Waktu       : 13:30 - 15:30",
        "Ruang       : Ruang Teori 105",
        "Dosen       : Dr. Anisa Rahmawati, M.Kom.",
        "",
        "Mata Kuliah : Sistem Tertanam & IoT (IF2103)",
        "Hari        : Kamis",
        "Waktu       : 09:00 - 11:30 WIB",
        "Ruang       : Lab Hardware Lt. 1",
        "Dosen       : Kevin Sanjaya, M.Cs.",
      ].join("\n");
      buffer = Buffer.from(txtContent, "utf-8");
      break;
    }

    // 14. TXT Inline Delimited
    case "txt_inline_delimited": {
      mimeType = "text/plain";
      const txtContent = [
        "Sen, 08.00 - 10.00 | Sistem Terdistribusi (CS301) | Lab Terdistribusi | Dr. Eng. Budi Santoso",
        "Rab, 10.30 - 12.30 | Kriptografi & Keamanan Informasi (CS302) | Ruang 302 | Rian Hidayat, M.T.",
        "Jum, 13.30 - 15.30 | Technopreneurship & Startup Digital (CS303) | Aula Startup Hub | Dewi Lestari, M.Ds.",
      ].join("\n");
      buffer = Buffer.from(txtContent, "utf-8");
      break;
    }

    // 15. TXT English Days & AM/PM
    case "txt_english_days_am_pm": {
      mimeType = "text/plain";
      const txtContent = [
        "Course: Advanced Data Structures (CS201)",
        "Day: Monday",
        "Time: 8:00 AM - 10:00 AM",
        "Room: Room 401",
        "Lecturer: Prof. John Doe",
        "",
        "Course: Operating Systems Principles (CS202)",
        "Day: Wednesday",
        "Time: 1:30 PM - 3:30 PM",
        "Room: Lab 2",
        "Lecturer: Dr. Alice Smith",
      ].join("\n");
      buffer = Buffer.from(txtContent, "utf-8");
      break;
    }

    // 16. TXT Ambiguous Time Missing End Time
    case "txt_ambiguous_time_missing_end": {
      mimeType = "text/plain";
      const txtContent = [
        "Seminar Proposal Skripsi | Selasa | Pukul 09.00 WIB | Ruang Sidang 1 | Dr. Budi Santoso",
        "Bimbingan Akademik | Kamis | Pukul 14.00 WIB | Ruang Dosen | Prof. Siti Nurhaliza",
      ].join("\n");
      buffer = Buffer.from(txtContent, "utf-8");
      break;
    }

    // 17. TXT Multi-Lecturer & Multi-Room
    case "txt_multi_lecturer_multi_room": {
      mimeType = "text/plain";
      const txtContent = [
        "Kecerdasan Buatan Terapan (AI401) | Senin | 08:00 - 10:30 | Lab AI 1 / Lab AI 2 | Prof. Siti Nurhaliza; Dr. Budi Santoso",
        "Praktikum Jaringan & Cloud (AI402) | Rabu | 13:00 - 16:00 | Lab Jaringan Lt. 2 | Rian Hidayat, M.T.; Kevin Sanjaya, M.Cs.",
      ].join("\n");
      buffer = Buffer.from(txtContent, "utf-8");
      break;
    }

    // 18. TXT Conflicting Schedules
    case "txt_conflicting_schedules": {
      mimeType = "text/plain";
      const txtContent = [
        "Matematika Diskrit | Senin | 08:00 - 10:00 | Ruang 101",
        "Fisika Komputasi | Senin | 09:00 - 11:00 | Ruang 102",
      ].join("\n");
      buffer = Buffer.from(txtContent, "utf-8");
      break;
    }

    // 19. TXT Duplicate Schedules
    case "txt_duplicate_schedules": {
      mimeType = "text/plain";
      const txtContent = [
        "Pemrograman Web Lanjut | Senin | 08:00 - 10:00 | Lab 1",
        "Pemrograman Web Lanjut | Senin | 08:00 - 10:00 | Lab 1",
      ].join("\n");
      buffer = Buffer.from(txtContent, "utf-8");
      break;
    }

    // 20. TXT Date Mismatch
    case "txt_date_mismatch": {
      mimeType = "text/plain";
      const txtContent = [
        "Ujian Akhir Semester Pemrograman | Senin, 25 Agustus 2026 | 08:00 - 10:00 | Ruang Ujian 1",
      ].join("\n");
      buffer = Buffer.from(txtContent, "utf-8");
      break;
    }

    // 21. Unrelated Document Essay
    case "unrelated_document_essay": {
      mimeType = "text/plain";
      const txtContent = [
        "BAB I PENDAHULUAN",
        "Latar Belakang Penelitian",
        "Perkembangan teknologi informasi saat ini telah mengubah paradigma operasional industri modern.",
        "Metodologi Penelitian yang digunakan adalah metode kualitatif deskriptif.",
        "Daftar Pustaka:",
        "1. Smith, J. (2025). The Future of Artificial Intelligence. MIT Press.",
      ].join("\n");
      buffer = Buffer.from(txtContent, "utf-8");
      break;
    }

    // 22. Empty Document
    case "empty_document": {
      mimeType = "text/plain";
      buffer = Buffer.from("   \n\n\t  ", "utf-8");
      break;
    }

    // 23. Malformed Archive Bomb
    case "malformed_archive_bomb": {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      buffer = Buffer.from("PK\x03\x04CORRUPTED_ZIP_ARCHIVE_HEADER_PAYLOAD");
      break;
    }

    default:
      throw new Error(`Unhandled fixture buffer generation for "${fixtureId}"`);
  }

  return {
    buffer,
    fileName: fixture.fileName,
    mimeType,
    fixture,
  };
}
