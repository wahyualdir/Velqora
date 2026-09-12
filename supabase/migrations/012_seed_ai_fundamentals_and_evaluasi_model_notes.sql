-- ============================================================
-- Migration 012: Seed Catatan Kurikulum — AI Fundamentals & Evaluasi Model
-- Velqora Academic Knowledge Base
-- ============================================================

DO $SEED_AI_FUNDAMENTALS_NOTES$
DECLARE
  v_user_id UUID;
  v_cat_fund UUID;
  v_id_agent UUID := '00000000-0000-0000-0001-000000000010';
  v_id_eval UUID := '00000000-0000-0000-0001-000000000011';
  v_id_linreg UUID := '00000000-0000-0000-0001-000000000001';
BEGIN
  -- 1. Cari kategori Artificial Intelligence Fundamentals
  SELECT id INTO v_cat_fund FROM categories 
  WHERE LOWER(name) = 'artificial intelligence fundamentals'
     OR LOWER(name) LIKE '%artificial intelligence fundamentals%'
     OR LOWER(name) = 'ai fundamentals'
  LIMIT 1;

  -- 2. Jika belum ada kategori dengan nama 'Artificial Intelligence Fundamentals',
  -- buat kategori baru dengan user_id yang valid
  IF v_cat_fund IS NULL THEN
    SELECT user_id INTO v_user_id FROM categories WHERE user_id IS NOT NULL LIMIT 1;
    IF v_user_id IS NULL THEN
      SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    END IF;

    IF v_user_id IS NOT NULL THEN
      INSERT INTO categories (name, color, icon, user_id)
      VALUES ('Artificial Intelligence Fundamentals', '#8B5CF6', 'machine_learning', v_user_id)
      RETURNING id INTO v_cat_fund;
    END IF;
  END IF;

  -- 3. Fallback jika kategori masih NULL
  IF v_cat_fund IS NULL THEN
    SELECT id INTO v_cat_fund FROM categories 
    WHERE LOWER(name) = 'kecerdasan buatan' OR LOWER(name) LIKE '%kecerdasan buatan%'
    LIMIT 1;
  END IF;

  -- ============================================================
  -- 1. CATATAN: PRINSIP DASAR KECERDASAN BUATAN & AGEN CERDAS
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_agent,
    v_cat_fund,
    'prinsip-dasar-kecerdasan-buatan-agen-cerdas',
    'Prinsip Dasar Kecerdasan Buatan & Agen Cerdas',
    $md$# Prinsip Dasar Kecerdasan Buatan & Agen Cerdas

Kecerdasan Buatan modern didefinisikan melalui paradigma **Agen Rasional (*Rational Agents*)** — sebuah entitas komputasi yang mengamati lingkungannya melalui sensor dan mengambil tindakan terbaik melalui aktuator untuk memaksimalkan ukuran keberhasilan kinerja (*performance measure*).

Fungsi agen secara matematis dapat dimodelkan sebagai pemetaan dari riwayat urutan persepsi $P^*$ menuju himpunan tindakan $A$:

$$f: P^* \to A$$

---

## 1. Kerangka Spesifikasi Lingkungan: PEAS
Sebelum merancang agen, arsitek sistem AI harus merumuskan deskripsi tugas menggunakan kerangka **PEAS**:

1. **Performance Measure (Ukuran Kinerja)**: Kriteria objektif keberhasilan perilaku agen (misal: keselamatan penumpang, efisiensi bahan bakar, waktu tempuh).
2. **Environment (Lingkungan)**: Dunia luar tempat agen beroperasi beserta sifat fisik atau virtualnya.
3. **Actuators (Aktuator)**: Instrumen keluaran untuk melakukan manipulasi atau tindakan fisik/digital (misal: setir kemudi, rem, display layar).
4. **Sensors (Sensor)**: Perangkat masukan untuk menerima observasi dan data lingkungan (misal: kamera optik, LiDAR, mikrofon, sensor sonar).

### Matriks Contoh Kasus PEAS:
| Sistem AI | Performance Measure | Environment | Actuators | Sensors |
| :--- | :--- | :--- | :--- | :--- |
| **Mobil Otonom** | Keselamatan, kecepatan, kenyamanan, kepatuhan hukum | Jalan raya, pejalan kaki, cuaca, marka jalan | Setir, pedal gas, rem, sinyal lampu | Kamera, LiDAR, radar, GPS, odometer |
| **Sistem Diagnosis Medis** | Kesembuhan pasien, minimalisasi biaya/efek samping | Pasien, staf klinis, riwayat rekam medis | Layar rekomendasi tes, resep obat | Keyboard input data gejala, hasil lab |
| **Robot Pembersih Ruangan** | Kebersihan lantai, efisiensi baterai, integritas furnitur | Ruangan rumah tangga, karpet, meja, tangga | Roda penggerak, motor penyedot, sikat | Sensor bumper inframerah, sensor debu |

---

## 2. Taksonomi Sifat Lingkungan Operasi
- **Fully Observable vs Partially Observable**: Apakah sensor agen mampu menangkap seluruh kondisi state lingkungan pada setiap waktu tanpa *blind spot*.
- **Deterministic vs Stochastic**: Apakah state lingkungan berikutnya ditentukan secara pasti oleh state saat ini dan aksi agen, atau mengandung unsur acak.
- **Episodic vs Sequential**: Apakah aksi saat ini memengaruhi pilihan aksi di masa depan (seperti catur) atau independen antar episode.
- **Static vs Dynamic**: Apakah lingkungan dapat berubah saat agen sedang memproses kalkulasi keputusan.
- **Discrete vs Continuous**: Apakah jumlah state dan aksi terbatas diskrit atau berupa variabel kontinu.

---

## 3. Arsitektur Agen Cerdas
1. **Simple Reflex Agent**: Bertindak hanya berdasarkan persepsi saat ini melalui aturan kondisi-tindakan (*condition-action rules*).
2. **Model-Based Reflex Agent**: Mempertahankan memori internal (*internal state*) untuk melacak bagian lingkungan yang tidak terpantau sensor.
3. **Goal-Based Agent**: Menggabungkan informasi state dengan tujuan eksplisit (*goals*) untuk merencanakan sekuens aksi.
4. **Utility-Based Agent**: Menggunakan fungsi utilitas untuk menimbang trade-off ketika terdapat beberapa tujuan yang saling bertentangan.
5. **Learning Agent**: Terdiri dari komponen pembelajaran (*learning element*) dan komponen eksekusi (*performance element*) untuk meningkatkan akurasi dari pengalaman.

---

## 4. Implementasi Kode Python

Berikut contoh simulasi **Reflex Agent dengan Internal State** dalam Python:

```python
class Environment:
    def __init__(self):
        self.locations = {"A": "kotor", "B": "bersih"}

    def get_percept(self, agent_loc):
        return (agent_loc, self.locations[agent_loc])

    def execute_action(self, agent_loc, action):
        if action == "membersihkan":
            self.locations[agent_loc] = "bersih"
            return agent_loc
        elif action == "pindah_ke_B":
            return "B"
        elif action == "pindah_ke_A":
            return "A"
        return agent_loc

class ModelBasedReflexAgent:
    def __init__(self):
        self.model = {"A": "unknown", "B": "unknown"}

    def act(self, percept):
        location, status = percept
        self.model[location] = status

        # Logika aturan refleks berbasis model internal
        if status == "kotor":
            return "membersihkan"
        elif location == "A" and self.model["B"] != "bersih":
            return "pindah_ke_B"
        elif location == "B" and self.model["A"] != "bersih":
            return "pindah_ke_A"
        return "diam"

# Jalankan simulasi
env = Environment()
agent = ModelBasedReflexAgent()
current_loc = "A"

print("Status Awal Lingkungan:", env.locations)
for step in range(3):
    percept = env.get_percept(current_loc)
    action = agent.act(percept)
    print(f"Langkah {step+1}: Lokasi={current_loc}, Status={percept[1]} -> Aksi={action}")
    current_loc = env.execute_action(current_loc, action)

print("Status Akhir Lingkungan:", env.locations)
```

Untuk mengukur efektivitas dan akurasi prediksi model agen dalam tugas klasifikasi, pelajari panduan metrik pada [[Evaluasi Model & Metrik Performa AI]].

#ai-fundamentals #agents #peas #rational-agent$md$,
    1,
    'compass'
  )
  ON CONFLICT (id) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index;

  -- ============================================================
  -- 2. CATATAN: EVALUASI MODEL & METRIK PERFORMA AI
  -- ============================================================

  INSERT INTO notes (id, category_id, slug, title, content_markdown, order_index, icon)
  VALUES (
    v_id_eval,
    v_cat_fund,
    'evaluasi-model-metrik-performa-ai',
    'Evaluasi Model & Metrik Performa AI',
    $md$# Evaluasi Model & Metrik Performa AI

Dalam pengembangan model pembelajaran mesin dan kecerdasan buatan, akurasi mentah (*raw accuracy*) sering kali menyesatkan, terutama ketika berhadapan dengan dataset yang memiliki ketimpangan kelas (*imbalanced data*). Pemilihan metrik evaluasi yang tepat menentukan apakah model benar-benar dapat diandalkan saat dideploy di lingkungan produksi.

---

## 1. Confusion Matrix (Matriks Kebingungan)
Tabel kontingensi 2x2 yang membandingkan prediksi model dengan label kebenaran sesungguhnya (*ground truth*):

| | **Aktual Positif ($Y=1$)** | **Aktual Negatif ($Y=0$)** |
| :--- | :--- | :--- |
| **Prediksi Positif ($\hat{Y}=1$)** | **True Positive ($TP$)** | **False Positive ($FP$)** *(Type I Error)* |
| **Prediksi Negatif ($\hat{Y}=0$)** | **False Negative ($FN$)** *(Type II Error)* | **True Negative ($TN$)** |

---

## 2. Metrik Kunci Klasifikasi

### A. Accuracy (Akurasi)
Proporsi seluruh prediksi yang benar dari total seluruh data:
$$\text{Accuracy} = \frac{TP + TN}{TP + FP + FN + TN}$$
> *Peringatan*: Jika 99% data bernilai negatif (seperti deteksi penipuan kartu kredit), model pasif yang selalu memprediksi negatif akan memiliki akurasi 99%, namun gagal total mendeteksi kasus penipuan.

### B. Precision (Presisi)
Mengukur seberapa akurat prediksi positif model dari seluruh data yang diprediksi positif:
$$\text{Precision} = \frac{TP}{TP + FP}$$
- **Fokus Prioritas**: Ketika dampak *False Positive* sangat mahal (misal: filter spam email yang tidak boleh salah membuang email penting pekerjaan).

### C. Recall / Sensitivity (Sensitivitas)
Mengukur kemampuan model menemukan seluruh sampel positif yang ada di dunia nyata:
$$\text{Recall} = \frac{TP}{TP + FN}$$
- **Fokus Prioritas**: Ketika dampak *False Negative* berakibat fatal (misal: diagnosis kanker ganas atau deteksi pejalan kaki pada mobil otonom).

### D. $F_1$-Score
Rata-rata harmonik (*harmonic mean*) antara Precision dan Recall:
$$F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2TP}{2TP + FP + FN}$$

---

## 3. Trade-Off Bias vs Variance
- **High Bias (Underfitting)**: Model terlalu sederhana sehingga gagal menangkap pola penting pada data latih maupun data uji (misal: menggunakan garis linear untuk pola eksponensial).
- **High Variance (Overfitting)**: Model terlalu kompleks dan menghafal noise data latih secara berlebihan, sehingga performa anjlok ketika menerima data baru.

---

## 4. Implementasi Kode Python

Berikut implementasi kalkulator metrik evaluasi klasifikasi menggunakan Python murni:

```python
def hitung_metrik_evaluasi(tp, fp, fn, tn):
    total = tp + fp + fn + tn
    accuracy = (tp + tn) / total if total > 0 else 0.0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (
        2 * (precision * recall) / (precision + recall)
        if (precision + recall) > 0
        else 0.0
    )
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0

    return {
        "Akurasi": round(accuracy, 4),
        "Presisi": round(precision, 4),
        "Recall": round(recall, 4),
        "F1-Score": round(f1, 4),
        "Spesifisitas": round(specificity, 4),
    }

# Simulasi hasil uji model skrining penyakit
# 85 pasien terdeteksi benar, 15 false alarm, 10 pasien luput, 890 non-pasien benar negatif
metrik = hitung_metrik_evaluasi(tp=85, fp=15, fn=10, tn=890)

print("=== LAPORAN EVALUASI PERFORMA MODEL AI ===")
for k, v in metrik.items():
    print(f"{k:<15}: {v * 100:.2f}%")
```

Pelajari juga penerapan metrik error kontinu (MSE, RMSE, $R^2$) pada modul regresi di [[Regresi Linear & Prediksi Kontinu]].

#ai-fundamentals #evaluation #metrics #confusion-matrix$md$,
    2,
    'award'
  )
  ON CONFLICT (id) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    order_index = EXCLUDED.order_index;

  -- ============================================================
  -- SEED TAGS & NOTE_LINKS
  -- ============================================================

  INSERT INTO note_tags (note_id, tag) VALUES
    (v_id_agent, 'ai-fundamentals'), (v_id_agent, 'agents'), (v_id_agent, 'peas'), (v_id_agent, 'rational-agent'),
    (v_id_eval, 'ai-fundamentals'), (v_id_eval, 'evaluation'), (v_id_eval, 'metrics'), (v_id_eval, 'confusion-matrix')
  ON CONFLICT DO NOTHING;

  INSERT INTO note_links (source_note_id, target_note_id, target_title_raw) VALUES
    (v_id_agent, v_id_eval, 'Evaluasi Model & Metrik Performa AI'),
    (v_id_eval, v_id_linreg, 'Regresi Linear & Prediksi Kontinu'),
    (v_id_eval, v_id_agent, 'Prinsip Dasar Kecerdasan Buatan & Agen Cerdas')
  ON CONFLICT DO NOTHING;

END $SEED_AI_FUNDAMENTALS_NOTES$;
