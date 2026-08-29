import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { jsPDF } from "jspdf";

const fixturesDir = path.join(__dirname, "../fixtures");
if (!fs.existsSync(fixturesDir)) {
  fs.mkdirSync(fixturesDir, { recursive: true });
}

// 1. TXT Fixture
const txtContent = `JADWAL PERKULIAHAN SEMESTER GANJIL 2026/2027
Nama Mahasiswa: Wahyu Aldi Riyanto

1. Senin, 08:00 - 10:00 WIB | Rekayasa Perangkat Lunak | Ruang Teori 301 | Dosen: Dr. Aris Purnomo
2. Selasa, 10:00 - 12:30 | Sistem Basis Data Terdistribusi | Lab Basis Data | Dosen: Ir. Siti Nurhaliza
3. Rabu, 13:00 - 15:00 | Machine Learning & Deep Learning | Lab AI Gedung B | Dosen: Prof. Budi Raharjo
4. Kamis, 08.00 s/d 10.30 | Jaringan Komputer Lanjut | Ruang 204 | Dosen: Hendra Wijaya, M.T.
5. Jumat, 08:00 - 10:00 | Keamanan Informasi & Kriptografi | Lab Cyber Security | Dosen: Dr. Maya Lestari`;

fs.writeFileSync(path.join(fixturesDir, "jadwal_kuliah.txt"), txtContent, "utf-8");

// 2. CSV Fixture
const csvContent = `Mata Kuliah,Hari,Jam,Ruangan,Dosen
Kecerdasan Buatan,Senin,08:00 - 10:00,Ruang 401,Dr. Dian Pratama
Pemrograman Web Lanjut,Rabu,10:00 - 12:30,Lab Komputer 2,Ahmad Fauzi M.Kom
Etika Profesi & Komunikasi,Kamis,13:00 - 14:40,Ruang 102,Dra. Ratna Juwita
Sistem Operasi,Jumat,08:00 - 10:00,Lab Sistem,Prof. Bambang`;

fs.writeFileSync(path.join(fixturesDir, "jadwal_semester.csv"), csvContent, "utf-8");

// 3. XLSX Fixture
const wb = XLSX.utils.book_new();
const xlsxData = [
  ["Kode MK", "Mata Kuliah", "Hari", "Jam Mulai", "Jam Selesai", "Ruang", "Dosen Pengampu"],
  ["IF301", "Pengolahan Citra Digital", "Senin", "10:00", "12:00", "Lab Grafika", "Dr. Eko Prasetyo"],
  ["IF302", "Interaksi Manusia dan Komputer", "Selasa", "13:00", "15:00", "Ruang 305", "Rina Susanti, M.Cs."],
  ["IF303", "Analisis & Perancangan Algoritma", "Kamis", "08:00", "10:30", "Ruang 201", "Prof. Agus Mulyadi"],
  ["IF304", "Proyek Perangkat Lunak", "Jumat", "13:30", "16:00", "Lab Software", "Dr. Taufik Hidayat"],
];
const ws = XLSX.utils.aoa_to_sheet(xlsxData);
XLSX.utils.book_append_sheet(wb, ws, "Jadwal_Kelas");
const xlsxBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
fs.writeFileSync(path.join(fixturesDir, "jadwal_komputer.xlsx"), xlsxBuffer);

// 4. DOCX Fixture
async function createDocxFixture() {
  const zip = new JSZip();
  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>JADWAL KULIAH RESMI TEKNIK INFORMATIKA</w:t></w:r></w:p>
    <w:p><w:r><w:t>Senin, 08:00 - 10:00 : Pemrograman Berorientasi Objek (Lab 3)</w:t></w:r></w:p>
    <w:p><w:r><w:t>Rabu, 10:00 - 12:00 : Grafika Komputer (Ruang 402)</w:t></w:r></w:p>
    <w:p><w:r><w:t>Jumat, 08:30 - 10:30 : Kewirausahaan Berbasis Teknologi (Gedung D)</w:t></w:r></w:p>
  </w:body>
</w:document>`;

  zip.file("word/document.xml", docXml);
  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  fs.writeFileSync(path.join(fixturesDir, "jadwal_akademik.docx"), buffer);
}

// 5. PDF Fixture
function createPdfFixture() {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("JADWAL KULIAH SEMESTER 5", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("1. Senin, 08:00 - 10:00 : Kecerdasan Komputasional (Ruang 301)", 20, 40);
  doc.text("2. Selasa, 10:00 - 12:00 : Data Mining & Big Data (Lab Komputer)", 20, 55);
  doc.text("3. Kamis, 13:00 - 15:30 : Cloud Computing Architecture (Ruang 205)", 20, 70);
  doc.text("4. Jumat, 08:00 - 10:00 : Metodologi Penelitian Ilmiah (Auditorium)", 20, 85);

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(path.join(fixturesDir, "jadwal_kuliah.pdf"), pdfBuffer);
}

Promise.all([createDocxFixture(), Promise.resolve(createPdfFixture())]).then(() => {
  console.log("All sample schedule fixtures generated in fixtures/ directory!");
});
