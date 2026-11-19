export type InteractiveLabId =
  | "bias-variance-poly"
  | "gradient-descent-2d"
  | "threshold-cost-matrix"
  | "svm-kernel-margin"
  | "boosting-iterations"
  | "density-clustering"
  | "conformal-intervals"
  | "drift-wasserstein";

export interface MLLabMeta {
  id: InteractiveLabId;
  title: string;
  subtitle: string;
  badge: string;
  takeaway: string;
}

export const ML_LAB_REGISTRY: Record<InteractiveLabId, MLLabMeta> = {
  "bias-variance-poly": {
    id: "bias-variance-poly",
    title: "Lab Interaktif: Bias-Variance Trade-Off & Regularisasi Ridge",
    subtitle: "Eksplorasi langsung bagaimana derajat polinomial (d) dan penalti L2 (λ) menggeser Train vs Test MSE.",
    badge: "POLYNOMIAL & RIDGE",
    takeaway: "Saat derajat d naik tanpa penalti λ, varians meledak dan Test MSE melonjak meski Train MSE mendekati nol. Penalti Ridge menyusutkan norm bobot untuk menstabilkan generalisasi.",
  },
  "gradient-descent-2d": {
    id: "gradient-descent-2d",
    title: "Lab Interaktif: Trajektori Gradient Descent vs Momentum",
    subtitle: "Amati osilasi lembah ill-conditioned (κ = 9) ketika learning rate (η) terlalu besar vs diredam Momentum (β).",
    badge: "OPTIMASI NUMERIK",
    takeaway: "Pada kontur anisometrik (κ >> 1), GD murni berosilasi di sumbu kurvatur tajam; Momentum (β ≈ 0.7–0.85) meredam osilasi vertikal dan mempercepat gerak di sepanjang lembah.",
  },
  "threshold-cost-matrix": {
    id: "threshold-cost-matrix",
    title: "Lab Interaktif: Decision Threshold & Business Cost Matrix",
    subtitle: "Mengapa threshold default τ = 0.50 hampir selalu suboptimal pada kasus asimetris (Fraud / Credit / Medis).",
    badge: "DECISION THEORY",
    takeaway: "Threshold optimal τ* secara teoretis ditentukan oleh rasio biaya FP/(FP+FN) sesuai Teorema Elkan (2001), bukan 0.50 statis.",
  },
  "svm-kernel-margin": {
    id: "svm-kernel-margin",
    title: "Lab Interaktif: SVM Soft Margin (C) & RBF Kernel Bandwidth (γ)",
    subtitle: "Geser parameter C dan γ untuk melihat perubahan jumlah Support Vector serta batas keputusan non-linier.",
    badge: "MARGIN & KERNEL",
    takeaway: "γ yang terlalu besar membuat setiap titik latih menjadi 'pulau' terisolasi (overfitting ekstrem), sedangkan C besar memaksa margin sempit demi nol galat latih.",
  },
  "boosting-iterations": {
    id: "boosting-iterations",
    title: "Lab Interaktif: Sequential Residual Fitting (Gradient Boosting)",
    subtitle: "Lihat bagaimana setiap pohon dangkal baru hanya memprediksi residual (gradien negatif) dari ensemble sebelumnya.",
    badge: "GBDT SEQUENTIAL",
    takeaway: "Learning rate (shrinkage η) kecil + jumlah pohon M terkontrol memberikan konvergensi lebih halus dan Test RMSE lebih stabil dibandingkan langkah besar yang agresif.",
  },
  "density-clustering": {
    id: "density-clustering",
    title: "Lab Interaktif: K-Means (Konveks) vs DBSCAN (Densitas & Noise)",
    subtitle: "Bandingkan kegagalan partisi Voronoi K-Means pada manifold non-konveks (two-moons) melawan DBSCAN.",
    badge: "MANIFOLD & DENSITY",
    takeaway: "K-Means memaksakan batas linier konveks dan gagal pada struktur sabit/cincin; DBSCAN menelusuri konektivitas densitas lokal sekaligus menandai outlier secara eksplisit.",
  },
  "conformal-intervals": {
    id: "conformal-intervals",
    title: "Lab Interaktif: Split Conformal Prediction & Adaptive CQR (2026)",
    subtitle: "Uji jaminan cakupan matematis bebas distribusi P(Y ∈ C(X)) ≥ 1 − α pada data heteroskedastik.",
    badge: "CONFORMAL UQ 2026",
    takeaway: "Split Conformal menjamin cakupan marginal ≥ 1 − α dengan lebar pita konstan; CQR (Conformalized Quantile Regression) mengadaptasi lebar pita sesuai varians lokal fitur.",
  },
  "drift-wasserstein": {
    id: "drift-wasserstein",
    title: "Lab Interaktif: Deteksi Data Drift — KS-Test vs Wasserstein W₁ vs PSI",
    subtitle: "Buktikan mengapa p-value KS-Test memicu false alarm pada N besar, sementara Wasserstein W₁ tetap stabil secara fisik.",
    badge: "DRIFT METROLOGY",
    takeaway: "Pada N = 50.000, pergeseran mikro Δμ = 0.05 sudah membuat p-value KS < 0.001 (false alert). Wasserstein W₁ mengukur pergeseran rata-rata dalam satuan unit asli fitur.",
  },
};

export function isInteractiveLabId(value: string): value is InteractiveLabId {
  return value in ML_LAB_REGISTRY;
}
