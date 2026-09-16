# VELQORA — CANONICAL ACADEMIC SOURCE REGISTRY

**Dokumen**: Registri Sumber Akademik Kanonikal  
**Versi**: 2.0 (Gold Standard Rebuild)  
**Status**: VERIFIED_WITH_LIMITATIONS  
**Cakupan**: Data Science — Bab 1 & Fondasi Metodologis Kurikulum

---

## 1. Pendahuluan & Standar Sitasi Akademik

Setiap konsep, metodologi, dan formulasi matematis dalam modul Velqora diwajibkan memiliki rujukan kanonikal yang valid. Velqora menolak materi tanpa atribusi ilmiah (unattributed claims) dan sitasi fiktif (hallucinated DOIs).

Standar sitasi yang diadopsi adalah **APA 7th Edition** dengan menyertakan:
1. Identifier Unik Velqora (`sourceRefId`)
2. Pengarang & Tahun
3. Judul Lengkap Buku / Paper / Laporan Teknis
4. Penerbit / Jurnal Ilmiah
5. DOI, ISBN, atau URL Repositori Resmi
6. Bab & Subbab Modul Velqora yang Menggunakan Rujukan

---

## 2. Tabel Registri Sumber Kanonikal

| ID Sumber | Kategori | Sitasi Lengkap (APA 7th) | DOI / ISBN / URL | Subbab Velqora |
|---|---|---|---|---|
| `REF-CHAPMAN-2000` | Technical Report | Chapman, P., Clinton, J., Kerber, R., Khabaza, T., Reinartz, T., Shearer, C., & Wirth, R. (2000). *CRISP-DM 1.0: Step-by-step data mining guide*. Technical Report, The CRISP-DM Consortium. | [CRISP-DM Guide](https://www.the-modeling-agency.com/crisp-dm.pdf) | 1.3 |
| `REF-MASON-2010` | Industry Benchmark | Mason, H., & Wiggins, C. (2010). *A Taxonomy of Data Science*. O'Reilly Radar. | [O'Reilly Radar](http://radar.oreilly.com/2010/09/a-taxonomy-of-data-science.html) | 1.1, 1.4 |
| `REF-SIMPSON-1951` | Peer-Reviewed Paper | Simpson, E. H. (1951). *The Interpretation of Interaction in Contingency Tables*. Journal of the Royal Statistical Society: Series B (Methodological), 13(2), 238–241. | [DOI: 10.1111/j.2517-6161.1951.tb00088.x](https://doi.org/10.1111/j.2517-6161.1951.tb00088.x) | 1.5 |
| `REF-PACE-1997` | Peer-Reviewed Paper | Pace, R. K., & Barry, R. (1997). *Sparse Spatial Autoregressions*. Statistics & Probability Letters, 33(3), 291–297. | [DOI: 10.1016/S0167-7152(96)00140-X](https://doi.org/10.1016/S0167-7152(96)00140-X) | 1.6 |
| `REF-PROVOST-2013` | University Textbook | Provost, F., & Fawcett, T. (2013). *Data Science for Business: What You Need to Know about Data Mining and Data-Analytic Thinking*. O'Reilly Media. | ISBN: 978-1449361327 | 1.2, 1.3 |
| `REF-PEARL-2009` | Graduate Textbook | Pearl, J. (2009). *Causality: Models, Reasoning, and Inference* (2nd ed.). Cambridge University Press. | ISBN: 978-0521895606 / [DOI: 10.1017/CBO9780511803161](https://doi.org/10.1017/CBO9780511803161) | 1.5 |
| `REF-HASTIE-2009` | Graduate Textbook | Hastie, T., Tibshirani, R., & Friedman, J. (2009). *The Elements of Statistical Learning: Data Mining, Inference, and Prediction* (2nd ed.). Springer. | ISBN: 978-0387848570 / [DOI: 10.1007/978-0-387-84858-7](https://doi.org/10.1007/978-0-387-84858-7) | 1.2, 1.6 |
| `REF-JAMES-2021` | Undergraduate Textbook | James, G., Witten, D., Hastie, T., & Tibshirani, R. (2021). *An Introduction to Statistical Learning with Applications in R* (2nd ed.). Springer. | ISBN: 978-1071614174 / [ISLR e-Book](https://www.statlearning.com/) | 1.2, 1.5, 1.6 |
| `REF-WICKHAM-2014` | Peer-Reviewed Paper | Wickham, H. (2014). *Tidy Data*. Journal of Statistical Software, 59(10), 1–23. | [DOI: 10.18637/jss.v059.i10](https://doi.org/10.18637/jss.v059.i10) | 1.4 |
| `REF-BREIMAN-2001` | Foundational Essay | Breiman, L. (2001). *Statistical Modeling: The Two Cultures*. Statistical Science, 16(3), 199–231. | [DOI: 10.1214/ss/1009213726](https://doi.org/10.1214/ss/1009213726) | 1.1, 1.5 |
| `REF-SKLEARN-2024` | Software Documentation | Pedregosa, F., et al. (2011). *Scikit-learn: Machine Learning in Python*. JMLR, 12, 2825–2830. Documentation for `fetch_california_housing`. | [Scikit-learn California Housing](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html) | 1.6 |

---

## 3. Detail Analisis Rujukan per Subbab

### 3.1 Subbab 1.1: Taksonomi Peran & Spektrum Kompetensi Data
- **Rujukan Utama**: `REF-MASON-2010`, `REF-BREIMAN-2001`.
- **Signifikansi**: Menyediakan pemisahan ontologis formal antara Data Engineer, Data Analyst, Data Scientist, dan MLOps Engineer berdasarkan 5 dimensi keahlian: Matematika/Statistika, Pemrograman/Software Engineering, Rekayasa Data/Sistem Terdistribusi, Domain Knowledge Bisnis, dan Eksperimentasi Kausal.
- **Validasi Terhadap Mitos Unicorn**: Menghitung secara matematis deviasi keterampilan (skill deficit) bahwa 1 "Data Unicorn" mustahil menandingi kapabilitas tim lintas peran.

### 3.2 Subbab 1.2: Problem Framing & Metodologi Asimetris Biaya
- **Rujukan Utama**: `REF-PROVOST-2013`, `REF-HASTIE-2009`, `REF-JAMES-2021`.
- **Signifikansi**: Merumuskan teorema ambang batas keputusan optimal Bayesian ($\tau^*$) dengan mempertimbangkan matriks biaya kesalahan (False Positive Cost vs False Negative Cost). Menghilangkan kebiasaan keliru mahasiswa yang selalu memakai default threshold 0.50 pada klasifikasi data imbalanced.

### 3.3 Subbab 1.3: Metodologi Siklus Hidup Proyek: CRISP-DM
- **Rujukan Utama**: `REF-CHAPMAN-2000`, `REF-PROVOST-2013`.
- **Signifikansi**: Memformalkan 6 fase CRISP-DM bukan sebagai linear waterfall, melainkan siklus berulang (state machine) dengan gerbang kualitas empiris (*quality gates*) yang memaksa loopback jika metrik validasi (seperti RMSE > baseline) tidak terpenuhi.

### 3.4 Subbab 1.4: Framework OSEMN & Benchmark Efisiensi Pipeline
- **Rujukan Utama**: `REF-MASON-2010`, `REF-WICKHAM-2014`.
- **Signifikansi**: Membuktikan secara komputasional profil latensi OSEMN. Hasil benchmark pada 10.000 record menunjukkan bahwa fase *Scrubbing* mengonsumsi >50% waktu pemrosesan, memvalidasi kenyataan industri data science bahwa persiapan data adalah beban komputasi dan rekayasa terbesar.

### 3.5 Subbab 1.5: Inferensi vs Prediksi & Paradoks Simpson
- **Rujukan Utama**: `REF-SIMPSON-1951`, `REF-PEARL-2009`, `REF-BREIMAN-2001`.
- **Signifikansi**: Memperlihatkan secara numerik fenomena pembalikan arah korelasi akibat variabel pengganggu (confounder). Terapi Obat A terbukti lebih unggul pada pasien bergejala ringan (+5.3%) dan berat (+17.2%), namun tampak kalah pada agregat (-18.9%) karena alokasi pasien yang tidak seimbang. Mencegah kesalahan kausalitas fatal dalam pengambilan keputusan berbasis data.

### 3.6 Subbab 1.6: Studi Kasus Komprehensif: California Housing Dataset
- **Rujukan Utama**: `REF-PACE-1997`, `REF-SKLEARN-2024`, `REF-HASTIE-2009`.
- **Signifikansi**: Menggunakan dataset sensus riil tahun 1990 yang diautentikasi oleh Pace & Barry. Menemukan anomali sensorik nyata berupa ceiling-cap pada nilai rumah di atas $500,000 (4.81% dari data), serta divergensi masif antara Pearson $r$ (-0.0237) dan Spearman $\rho$ (-0.2566) pada fitur `AveOccup` akibat pencilan ekstrem (1243 orang per rumah tangga).

---

## 4. Protokol Verifikasi Sumber di CI/CD

1. Semua ID sumber yang digunakan pada properti `sourceRefIds` di `AcademicSubchapter` wajib terdaftar di file registri ini.
2. Setiap kali modul baru ditambahkan ke Velqora, pengembang harus menyertakan entri baru di file ini sebelum pull request disetujui.
3. Negative Quality Gate `QG-SOURCE-CANONICAL` secara otomatis memvalidasi bahwa tidak ada ID sumber liar (unregistered / orphan reference IDs).
