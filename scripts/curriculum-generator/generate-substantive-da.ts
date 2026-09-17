import { AcademicCurriculum, AcademicChapter, AcademicSubchapter, AcademicCitation } from "../../src/lib/curriculum/types";
import * as fs from "fs";
import * as path from "path";

// 1. Primary References yang benar-benar dikunjungi dan diverifikasi
const PRIMARY_REFERENCES: AcademicCitation[] = [
  {
    id: "ref-pandas-docs",
    title: "pandas Documentation: User Guide & API Reference",
    authors: ["The pandas development team"],
    type: "documentation",
    url: "https://pandas.pydata.org/docs/user_guide/index.html",
    sourceType: "official-documentation",
    provider: "PyData / NumFOCUS",
    relevance: "Rujukan resmi kanonikal untuk manipulasi struktur DataFrame, Series, pembersihan nilai hilang, agregasi group-by, dan pemodelan deret waktu.",
    verified: true,
    lastChecked: "2026-09-16",
    isPrimarySource: true
  },
  {
    id: "ref-numpy-userguide",
    title: "NumPy: The Fundamental Package for Scientific Computing with Python",
    authors: ["Charles R. Harris", "K. Jarrod Millman", "Stéfan J. van der Walt", "et al."],
    type: "paper",
    url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
    doi: "10.1038/s41586-020-2649-2",
    sourceType: "official-documentation",
    provider: "Nature / NumPy",
    relevance: "Fondasi komputasi array multidimensi tervektorisasi, broadcasting semantics, aljabar linier numerik, dan manajemen memori kontigu.",
    verified: true,
    lastChecked: "2026-09-16",
    isPrimarySource: true
  },
  {
    id: "ref-ossu-datascience",
    title: "Open Source Society University: Path to a free self-taught education in Data Science",
    authors: ["OSSU Contributors"],
    type: "course",
    url: "https://github.com/ossu/data-science",
    sourceType: "university-course",
    provider: "Open Source Society University",
    relevance: "Kurikulum standar internasional sains data setara sarjana (undergraduate), mencakup statistika bisnis, pemrograman analitik, dan metode empiris.",
    verified: true,
    lastChecked: "2026-09-16"
  },
  {
    id: "ref-kaggle-learn-pandas",
    title: "Kaggle Learn: Hands-on Data Analysis & Data Cleaning",
    authors: ["Alexis Cook", "Dan Becker", "Colin Morris"],
    type: "course",
    url: "https://www.kaggle.com/learn/pandas",
    sourceType: "official-documentation",
    provider: "Kaggle / Google",
    relevance: "Panduan praktikum industri penanganan data kotor, imputasi nilai hilang, transformasi data, dan validasi tipe data tabular.",
    verified: true,
    lastChecked: "2026-09-16"
  },
  {
    id: "ref-python-sqlite",
    title: "Python Standard Library: sqlite3 — DB-API 2.0 interface for SQLite databases",
    authors: ["Python Software Foundation"],
    type: "documentation",
    url: "https://docs.python.org/3/library/sqlite3.html",
    sourceType: "official-documentation",
    provider: "Python Software Foundation",
    relevance: "Dokumentasi standar eksekusi kueri SQL relasional, transaksi ACID, dan integrasi kueri analitik berbasis Python.",
    verified: true,
    lastChecked: "2026-09-16"
  },
  {
    id: "ref-seaborn-tutorial",
    title: "Seaborn: Statistical Data Visualization in Python",
    authors: ["Michael L. Waskom"],
    type: "documentation",
    url: "https://seaborn.pydata.org/tutorial.html",
    doi: "10.21105/joss.03021",
    sourceType: "official-documentation",
    provider: "Journal of Open Source Software",
    relevance: "Prinsip visualisasi statistik, pemetaan variabel kategori ke atribut estetika, dan distribusi data multivariat.",
    verified: true,
    lastChecked: "2026-09-16"
  },
  {
    id: "ref-scipy-stats",
    title: "SciPy Reference Guide: Statistical functions (scipy.stats)",
    authors: ["Pauli Virtanen", "Ralf Gommers", "Travis E. Oliphant", "et al."],
    type: "paper",
    url: "https://docs.scipy.org/doc/scipy/reference/stats.html",
    doi: "10.1038/s41592-019-0686-2",
    sourceType: "official-documentation",
    provider: "Nature Methods / SciPy",
    relevance: "Rujukan komputasi uji hipotesis parametrik dan non-parametrik (t-test, ANOVA, Mann-Whitney, Pearson, Spearman).",
    verified: true,
    lastChecked: "2026-09-16"
  },
  {
    id: "ref-vanderplas-python-ds",
    title: "Python Data Science Handbook: Essential Tools for Working with Data",
    authors: ["Jake VanderPlas"],
    type: "book",
    url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
    sourceType: "academic-book",
    provider: "O'Reilly Media",
    relevance: "Buku teks fundamental operasi komputasi data, agregasi teroptimasi, manipulasi datetime, dan visualisasi grafik.",
    verified: true,
    lastChecked: "2026-09-16"
  }
];

export { PRIMARY_REFERENCES };
console.log("Primary references helper defined.");
