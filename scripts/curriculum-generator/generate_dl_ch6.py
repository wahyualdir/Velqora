# scripts/curriculum-generator/generate_dl_ch6.py
import json
from generate_dl_ch6_9 import ch6_subchapters

ch6_data = {
    "ch_num": 6,
    "id": "deep-learning-ch-6",
    "slug": "bab-6-algoritma-optimasi-lanjut-dan-penjadwalan-learning-rate",
    "title": "BAB 6: Algoritma Optimasi Lanjut & Penjadwalan Learning Rate",
    "desc": "Stokastisitas gradien mini-batch, inersia momentum fisik Polyak & Nesterov, penskalaan adaptif AdaGrad, RMSProp, Adam, perbaikan dekopel weight decay AdamW, optimasi orde kedua L-BFGS, mitigasi ledakan gradien, dan kurva penjadwalan kosinus.",
    "coreConcepts": [
        "Mini-Batch Stochasticity",
        "Polyak Momentum",
        "Nesterov Accelerated Gradient",
        "AdaGrad Adaptive Scaling",
        "RMSProp Moving Average",
        "Adam Moment Fusion",
        "AdamW Decoupled Weight Decay",
        "L-BFGS Quasi-Newton",
        "Gradient Clipping Norms",
        "Cosine Annealing & Warmup"
    ],
    "competencies": [
        "Pemilihan algoritma optimizer yang tepat berdasarkan karakteristik lanskap loss",
        "Pencegahan ledakan gradien menggunakan pemotongan norma global di PyTorch",
        "Konfigurasi strategi penjadwalan laju belajar adaptif bertahap (warmup + annealing)"
    ],
    "subchapters": ch6_subchapters
}

with open("scripts/curriculum-generator/ch6_data.json", "w", encoding="utf-8") as f:
    json.dump(ch6_data, f, indent=2, ensure_ascii=False)

print("Chapter 6 JSON generated successfully!")
