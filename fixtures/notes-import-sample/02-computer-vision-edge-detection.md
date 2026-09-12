---
kategori: "Computer Vision"
title: "Deteksi Tepi Sobel & Algoritma Canny"
tags: [computer-vision, edge-detection, sobel, canny]
---

# Deteksi Tepi Sobel & Algoritma Canny

Deteksi tepi (*edge detection*) adalah teknik dasar dalam pengolahan citra digital untuk mengidentifikasi titik-titik diskontinuitas kecerahan atau intensitas spasial dalam citra visual. Titik-titik ini biasanya mencerminkan batas fisik objek, orientasi permukaan, atau variasi material.

## 1. Operator Sobel
Operator Sobel menghitung estimasi gradien intensitas citra menggunakan dua kernel konvolusi $3 \times 3$, masing-masing untuk sumbu horizontal $G_x$ dan vertikal $G_y$:

$$G_x = \begin{bmatrix} -1 & 0 & +1 \\ -2 & 0 & +2 \\ -1 & 0 & +1 \end{bmatrix} * I, \quad G_y = \begin{bmatrix} +1 & +2 & +1 \\ 0 & 0 & 0 \\ -1 & -2 & -1 \end{bmatrix} * I$$

Besaran gradien (*gradient magnitude*) dihitung dengan:
$$G = \sqrt{G_x^2 + G_y^2}$$

## 2. Tahapan Algoritma Canny
Algoritma Canny adalah detektor tepi optimal bertingkat ganda (*multi-stage*):
1. **Gaussian Smoothing**: Mereduksi noise frekuensi tinggi dengan filter Gaussian kernel $5 \times 5$.
2. **Gradient Calculation**: Menghitung magnitudo dan sudut arah gradien $\theta = \arctan(G_y / G_x)$.
3. **Non-Maximum Suppression (NMS)**: Menipiskan tepi dengan mempertahankan piksel lokal maksimum di sepanjang arah gradien.
4. **Hysteresis Thresholding**: Menggunakan dua ambang batas ($T_{\text{high}}$ dan $T_{\text{low}}$) untuk membedakan tepi kuat, tepi lemah terhubung, dan noise.

## 3. Implementasi Kode Python

```python
import numpy as np

def apply_sobel_kernel(patch_3x3: np.ndarray) -> float:
    """Menghitung respons konvolusi kernel Sobel horizontal."""
    sobel_x = np.array([
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ], dtype=float)
    return float(np.sum(patch_3x3 * sobel_x))

dummy_patch = np.array([
    [10, 10, 200],
    [10, 10, 200],
    [10, 10, 200]
], dtype=float)

response = apply_sobel_kernel(dummy_patch)
print(f"Sobel Horizontal Gradient: {response:.2f}")
```

## 4. Tautan Konsep Terkait
- Ekstraksi fitur visual tingkat lanjut: [[Convolutional Neural Network (CNN)]]
- Representasi data multimodal: [[Multimodal AI & Contrastive Vision-Language]]
