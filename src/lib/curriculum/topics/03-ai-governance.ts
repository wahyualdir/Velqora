import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: AI GOVERNANCE & REGULASI (TOPIK 3) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - European Parliament and Council (2024). Regulation (EU) 2024/1689 (EU AI Act).
 * - National Institute of Standards and Technology (2023). NIST AI Risk Management Framework (AI RMF 1.0).
 * - International Organization for Standardization (2023). ISO/IEC 42001: Artificial Intelligence Management System.
 * - Mitchell, M., et al. (2019). Model Cards for Model Reporting. ACM FAccT.
 * - Kementerian Komunikasi dan Informatika RI (2023). Surat Edaran Menkominfo No. 9 Tahun 2023 tentang Etika Kecerdasan Artifisial.
 */
export const aiGovernanceCurriculum: AcademicCurriculum = {
  id: "ai-governance",
  slug: "ai-governance-regulasi",
  title: "AI Governance & Regulasi",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Kerangka kerja tata kelola dan kepatuhan regulasi kecerdasan buatan komprehensif: piramida klasifikasi risiko EU AI Act (Regulation 2024/1689), fungsi inti manajemen risiko NIST AI RMF 1.0 (GOVERN, MAP, MEASURE, MANAGE), standar sertifikasi ISO/IEC 42001 AIMS, auditabilitas jejak siklus hidup (lineage & Model Cards), regulasi nasional SE Menkominfo No. 9/2023, serta engine asesmen risiko otomatis.",
  estimatedHours: 46,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "The European Artificial Intelligence Act (EU AI Act - Regulation 2024/1689)",
      authors: ["European Union"],
      type: "standard",
      url: "https://artificialintelligenceact.eu/",
      relevance: "Kerangka regulasi hukum komprehensif pertama di dunia yang mengikat secara legal berbasis klasifikasi risiko.",
      year: 2024,
      publisherOrVenue: "Official Journal of the European Union",
    },
    {
      title: "NIST Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
      authors: ["NIST Information Technology Laboratory"],
      type: "standard",
      url: "https://www.nist.gov/itl/ai-risk-management-framework",
      relevance: "Panduan resmi pengelolaan risiko AI dengan fungsi inti GOVERN, MAP, MEASURE, dan MANAGE.",
      year: 2023,
      publisherOrVenue: "NIST",
    },
    {
      title: "ISO/IEC 42001:2023 Information technology — Artificial intelligence — Management system",
      authors: ["ISO/IEC JTC 1/SC 42"],
      type: "standard",
      url: "https://www.iso.org/standard/81230.html",
      relevance: "Standar internasional pertama yang dapat disertifikasi untuk Sistem Manajemen Kecerdasan Buatan (AIMS).",
      year: 2023,
      publisherOrVenue: "International Organization for Standardization",
    },
  ],
  chapters: [
    {
      id: "gov-bab-1",
      slug: "kerangka-regulasi-global-eu-ai-act",
      title: "BAB 1: Kerangka Regulasi Global & EU AI Act (Regulation 2024/1689)",
      orderIndex: 1,
      description: "Piramida 4 tingkat klasifikasi risiko EU AI Act, larangan praktik AI terlarang (Unacceptable Risk), persyaratan wajib sistem berisiko tinggi (High-Risk AI Systems), kewajiban transparansi khusus, dan regulasi General-Purpose AI (GPAI).",
      subchapters: [
        {
          id: "gov-bab-1-1",
          slug: "piramida-risiko-eu-ai-act",
          title: "1.1. Piramida Klasifikasi Risiko EU AI Act & Kriteria High-Risk (Annex III)",
          orderIndex: 1,
          description: "Menganalisis empat tingkatan risiko: Unacceptable, High Risk, Specific Transparency, dan Minimal Risk, serta sanksi denda hingga 35 juta Euro.",
          content_markdown: `# 1.1. Piramida Klasifikasi Risiko EU AI Act & Kriteria High-Risk (Annex III)

## 1. Empat Tingkatan Piramida Risiko EU AI Act
1. **Unacceptable Risk (DILARANG KERAS)**:
   Sistem yang mengancam keselamatan atau hak-hak fundamental warga negara:
   - *Social Scoring* oleh otoritas publik atau entitas swasta.
   - Manipulasi perilaku bawah sadar (*subliminal manipulation*) yang menyebabkan bahaya fisik/psikologis.
   - Pemanfaatan kerentanan usia, disabilitas, atau status sosial ekonomi.
   - Pengenalan wajah biometrik jarak jauh secara real-time di ruang publik untuk penegakan hukum (dengan pengecualian sangat ketat).
2. **High-Risk AI Systems (DIREGULASI KETAT)**:
   Sistem AI dalam infrastruktur kritis, penentuan kelulusan pendidikan, penerimaan tenaga kerja, penilaian kelayakan kredit, serta penegakan hukum (Annex III).
   *Persyaratan Wajib*:
   - Manajemen risiko berkelanjutan (*continuous risk management*).
   - Tata kelola data latih bermutu tinggi tanpa bias diskriminatif.
   - Pencatatan log peristiwa otomatis (*automatic event logging*).
   - Dokumentasi teknis terinci sebelum dipasarkan (*conformity assessment*).
   - Pengawasan manusia yang efektif (*human oversight*).
3. **Specific Transparency Risk**:
   Sistem seperti chatbot generatif atau deepfakes wajib mencantumkan label bahwa konten dihasilkan oleh mesin.
4. **Minimal / Low Risk**:
   Filter spam, video game AI, dsb. (bebas regulasi khusus).
`,
        },
      ],
    },
    {
      id: "gov-bab-2",
      slug: "manajemen-risiko-nist-ai-rmf",
      title: "BAB 2: Kerangka Manajemen Risiko NIST AI RMF 1.0",
      orderIndex: 2,
      description: "Panduan teknis dan institusional NIST: Empat fungsi inti (GOVERN, MAP, MEASURE, MANAGE), taksonomi karakteristik Trustworthy AI, dan implementasi profil risiko organisasi.",
      subchapters: [
        {
          id: "gov-bab-2-1",
          slug: "empat-fungsi-inti-nist-ai-rmf",
          title: "2.1. Empat Fungsi Inti NIST AI RMF (GOVERN, MAP, MEASURE, MANAGE)",
          orderIndex: 1,
          description: "Struktur operasional pengelolaan risiko AI dari kebijakan kepemimpinan hingga mitigasi teknis di tingkat kode program.",
          content_markdown: `# 2.1. Empat Fungsi Inti NIST AI RMF (GOVERN, MAP, MEASURE, MANAGE)

## 1. Empat Pilar Inti AI RMF 1.0 (NIST, 2023)
1. **GOVERN (Tata Kelola)**:
   Fungsi transversal yang menumbuhkan budaya kepatuhan risiko, struktur akuntabilitas, kebijakan formal organisasi, dan keterlibatan pemangku kepentingan.
2. **MAP (Pemetaan)**:
   Mengidentifikasi konteks sistem, tujuan bisnis, ketergantungan teknologi, pihak terdampak, dan potensi risiko negatif sebelum model dibangun.
3. **MEASURE (Pengukuran)**:
   Menerapkan metrik kuantitatif dan kualitatif untuk menguji akurasi, kekokohan (*robustness*), keadilan (*fairness*), privasi, dan keterjelasan sistem.
4. **MANAGE (Pengelolaan)**:
   Mengalokasikan sumber daya untuk memprioritaskan, memitigasi, dan memantau risiko yang teridentifikasi secara berkala selama fase operasional.

## 2. Karakteristik Trustworthy AI menurut NIST
- Valid & Andal (*Valid and Reliable*).
- Aman & Terlindungi (*Safe and Secure*).
- Akuntabel & Transparan (*Accountable and Transparent*).
- Menjaga Privasi (*Privacy-Enhanced*).
- Adil & Bebas Bias Berbahaya (*Fair with Harmful Bias Managed*).
`,
        },
      ],
    },
    {
      id: "gov-bab-3",
      slug: "standar-internasional-iso-iec-42001",
      title: "BAB 3: Standar Internasional ISO/IEC 42001:2023 (AIMS)",
      orderIndex: 3,
      description: "Sistem Manajemen Kecerdasan Buatan (Artificial Intelligence Management System): struktur Harmonized Structure (HLS), integrasi dengan ISO 27001 (keamanan informasi) dan ISO 27701 (privasi), serta proses AI Impact Assessment (AIIA).",
      subchapters: [
        {
          id: "gov-bab-3-1",
          slug: "struktur-aims-dan-aiia",
          title: "3.1. Struktur Sistem Manajemen AIMS & Penilaian Dampak AI (AIIA)",
          orderIndex: 1,
          description: "Klausul 4-10 standar ISO/IEC 42001, kontrol kepatuhan siklus hidup data, dan metodologi asesmen dampak terhadap individu dan masyarakat.",
          content_markdown: `# 3.1. Struktur Sistem Manajemen AIMS & Penilaian Dampak AI (AIIA)

## 1. Arsitektur ISO/IEC 42001 (AIMS)
Mengikuti *Harmonized Structure* (HLS) standar manajemen ISO internasional:
- **Klausul 4**: Konteks organisasi dan harapan pihak yang berkepentingan.
- **Klausul 5**: Kepemimpinan dan komitmen direksi.
- **Klausul 6**: Perencanaan dan penentuan sasaran AI.
- **Klausul 8**: Operasional dan kontrol siklus hidup sistem AI.
- **Klausul 9**: Evaluasi kinerja dan audit internal berkala.
- **Klausul 10**: Perbaikan berkelanjutan (*continuous improvement*).

## 2. Penilaian Dampak AI (AI Impact Assessment - AIIA)
Proses sistematis sebelum sistem AI diterapkan untuk mengevaluasi:
1. Dampak terhadap hak asasi dan privasi individu.
2. Potensi bias sistemik pada proses pengambilan keputusan.
3. Ketergantungan dan risiko kegagalan sistem pada kondisi ekstrem.
4. Rencana kontinjensi pemulihan (*disaster recovery & fallback plan*).
`,
        },
      ],
    },
    {
      id: "gov-bab-4",
      slug: "auditabilitas-dan-data-lineage",
      title: "BAB 4: Auditabilitas Siklus Hidup, Data Lineage & Model Cards",
      orderIndex: 4,
      description: "Menjamin keterlacakan komputasi: silsilah asal-usul data (Data Lineage), registri model terpusat, logging telemetri inferensi terenkripsi yang tahan manipulasi, dan standar Model Cards.",
      subchapters: [
        {
          id: "gov-bab-4-1",
          slug: "data-lineage-dan-audit-trail-forensik",
          title: "4.1. Silsilah Data (Data Lineage) & Audit Trail Forensik",
          orderIndex: 1,
          description: "Mencatat hubungan hash kriptografis antara versi data mentah, skrip pelatihan kode Git, dan bobot biner model.",
          content_markdown: `# 4.1. Silsilah Data (Data Lineage) & Audit Trail Forensik

## 1. Konsep Data Lineage Kriptografis
Setiap artefak model yang diproduksi wajib memiliki rantai keterlacakan (*immutable provenance chain*):
$$\\text{Model Hash} \\longleftarrow \\text{Training Code Git Commit} \\longleftarrow \\text{Dataset DVC Snapshot Hash}$$

Jika terjadi penyelidikan hukum atas keputusan diskriminatif, auditor dapat merekonstruksi:
1. Data apa persisnya yang digunakan untuk melatih model pada tanggal tersebut.
2. Siapa engineer yang menyetujui promosi model ke lingkungan produksi.
3. Nilai input sensor/pengguna yang menghasilkan keputusan tersebut di berkas log inferensi.

## 2. Format JSON-LD Provenance (W3C PROV-O)
Pencatatan silsilah data terstruktur yang menghubungkan entitas (*Entity*), aktivitas (*Activity*), dan agen (*Agent*).
`,
        },
      ],
    },
    {
      id: "gov-bab-5",
      slug: "regulasi-nasional-dan-se-menkominfo",
      title: "BAB 5: Lanskap Regulasi Nasional & Tanggung Jawab Hukum",
      orderIndex: 5,
      description: "Strategi Nasional AI Indonesia (Stranas KA), Surat Edaran Menkominfo No. 9 Tahun 2023 tentang Etika AI, UU No. 27/2022 tentang Perlindungan Data Pribadi (UU PDP), dan doktrin pertanggungjawaban hukum perdata/pidana sistem otonom.",
      subchapters: [
        {
          id: "gov-bab-5-1",
          slug: "se-menkominfo-dan-uu-pdp-indonesia",
          title: "5.1. Analisis Yuridis SE Menkominfo No. 9/2023 & Kepatuhan UU PDP",
          orderIndex: 1,
          description: "Prinsip inklusivitas, keamanan, keterbukaan, dan akuntabilitas dalam kerangka hukum digital Indonesia.",
          content_markdown: `# 5.1. Analisis Yuridis SE Menkominfo No. 9/2023 & Kepatuhan UU PDP

## 1. Surat Edaran Menkominfo No. 9 Tahun 2023
SE Menkominfo menetapkan pedoman etika bagi penyelenggara sistem elektronik (PSE) publik dan privat yang memanfaatkan AI:
1. **Inklusivitas**: Menghormati keberagaman dan tidak mendiskriminasi kelompok masyarakat.
2. **Kemanusiaan**: Mempertahankan nilai-nilai martabat manusia dan perlindungan hak asasi.
3. **Keamanan**: Menjamin perlindungan integritas sistem dari gangguan siber.
4. **Aksesibilitas & Keterbukaan**: Kemudahan akses informasi mengenai keberadaan sistem AI bagi pengguna.
5. **Akuntabilitas**: Tanggung jawab hukum tetap melekat pada penyelenggara sistem elektronik dan pengembang, bukan pada algoritma AI itu sendiri.

## 2. Keterkaitan dengan UU No. 27 Tahun 2022 (UU PDP)
Pemrosesan data pribadi oleh model AI (termasuk pelatihan LLM dan pengenalan wajah) wajib memiliki dasar pemrosesan yang sah (*legal basis*), persetujuan eksplisit (*explicit consent*), serta memenuhi hak subjek data (hak akses, hak koreksi, hak penghapusan/right to be forgotten).
`,
        },
      ],
    },
    {
      id: "gov-bab-6",
      slug: "proyek-framework-audit-kepatuhan-ai",
      title: "BAB 6: Proyek Terapan: Framework Audit Kepatuhan Regulasi & Asesmen Risiko",
      orderIndex: 6,
      description: "Membangun sistem asesmen kepatuhan AI otomatis: evaluasi kepatuhan terhadap EU AI Act Annex III, pemetaan profil risiko NIST AI RMF, dan generasi laporan audit kepatuhan terstruktur.",
      subchapters: [
        {
          id: "gov-bab-6-1",
          slug: "proyek-akhir-governance-audit-python",
          title: "6.1. Proyek Akhir: Automated AI Governance & Risk Assessment Engine",
          orderIndex: 1,
          description: "Kode Python mandiri: engine evaluasi kepatuhan regulasi, kalkulasi skor risiko gabungan, dan ekspor sertifikat kepatuhan JSON/Markdown.",
          content_markdown: `# 6.1. Proyek Akhir: Automated AI Governance & Risk Assessment Engine

## 1. Kode Program Lengkap (Python Murni)
\`\`\`python
from typing import Dict, List, Any

class AIGovernanceRiskAssessor:
    """Engine Asesmen Kepatuhan Regulasi EU AI Act & NIST AI RMF."""
    def __init__(self, system_name: str, domain: str):
        self.system_name = system_name
        self.domain = domain
        self.risk_score: float = 0.0
        self.compliance_checks: List[Dict[str, Any]] = []

    def evaluate_unacceptable_risk(self, has_social_scoring: bool, has_subliminal_manipulation: bool) -> bool:
        """Memeriksa pelanggaran pasal risiko yang tidak dapat diterima (EU AI Act)."""
        if has_social_scoring or has_subliminal_manipulation:
            self.compliance_checks.append({
                "category": "EU AI Act - Prohibited Practice",
                "status": "FAIL",
                "detail": "Sistem melanggar larangan social scoring atau manipulasi bawah sadar!"
            })
            return True
        self.compliance_checks.append({
            "category": "EU AI Act - Prohibited Practice",
            "status": "PASS",
            "detail": "Bebas dari praktik manipulasi terlarang."
        })
        return False

    def evaluate_high_risk_compliance(self, has_human_oversight: bool, has_logging: bool, has_data_governance: bool):
        """Mengevaluasi prasyarat wajib sistem berisiko tinggi (Annex III)."""
        checks = [
            ("Human-in-the-Loop Oversight", has_human_oversight, 30),
            ("Automatic Event Logging", has_logging, 35),
            ("Data Quality & Governance", has_data_governance, 35)
        ]
        total_score = 0
        for name, passed, weight in checks:
            status = "PASS" if passed else "FAIL"
            if passed:
                total_score += weight
            self.compliance_checks.append({
                "category": f"High-Risk Requirement: {name}",
                "status": status,
                "weight": weight
            })
        self.risk_score = 100.0 - total_score

    def generate_audit_report(self) -> Dict[str, Any]:
        is_compliant = (self.risk_score <= 20.0) and all(
            c["status"] == "PASS" for c in self.compliance_checks if "Prohibited" in c["category"]
        )
        tier = "High-Risk" if self.domain in ["recruitment", "credit", "healthcare"] else "Minimal Risk"
        
        return {
            "system_name": self.system_name,
            "domain": self.domain,
            "classification_tier": tier,
            "overall_risk_score": self.risk_score,
            "is_market_ready": is_compliant,
            "audit_log": self.compliance_checks
        }

# --- Demonstrasi Eksekusi Asesmen Tata Kelola AI ---
assessor = AIGovernanceRiskAssessor("Velqora-CreditScorer-v2", domain="credit")

# 1. Uji Praktik Terlarang
is_prohibited = assessor.evaluate_unacceptable_risk(
    has_social_scoring=False, 
    has_subliminal_manipulation=False
)
assert is_prohibited is False, "Sistem komersial legal tidak boleh memiliki fitur terlarang."

# 2. Uji Prasyarat Sistem Berisiko Tinggi (Kredit Perbankan)
assessor.evaluate_high_risk_compliance(
    has_human_oversight=True,
    has_logging=True,
    has_data_governance=True
)

report = assessor.generate_audit_report()
print("=== LAPORAN AUDIT TATA KELOLA & REGULASI AI ===")
print(f"Nama Sistem       : {report['system_name']}")
print(f"Klasifikasi Risiko: {report['classification_tier']}")
print(f"Skor Risiko Sisa  : {report['overall_risk_score']:.1f} / 100")
print(f"Status Kepatuhan  : {'MEMENUHI SYARAT REGULASI (COMPLIANT)' if report['is_market_ready'] else 'NON-COMPLIANT'}")

print("\\nDetail Hasil Pemeriksaan Kepatuhan:")
for item in report["audit_log"]:
    print(f"  - [{item['status']}] {item['category']}")

assert report["is_market_ready"] is True
print("=== VERIFIKASI ENGINE GOVERNANCE BERHASIL ===")
\`\`\`

## 2. Rubrik Penilaian Proyek
- **Kesesuaian dengan Regulasi EU AI Act & NIST (35%)**: Pemetaan akurat kriteria Annex III dan fungsi GOVERN/MANAGE.
- **Kelengkapan Pengecekan Kepatuhan (35%)**: Pemeriksaan menyeluruh aspek human oversight, logging, dan tata kelola data.
- **Struktur Laporan Audit Formal (15%)**: Output data yang terstruktur rapi dan siap dikonsumsi auditor eksternal.
- **Kerapian & Keandalan Kode (15%)**: Kode Python modular, deterministik, dan terdokumentasi.
`,
        },
      ],
    },
  ],
};
