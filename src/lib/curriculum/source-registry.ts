import { SourceRelevanceClassification } from "./types";

export interface VerifiedSourceRecord {
  id: string; // Stable Source ID
  url: string;
  title: string;
  authorOrOrg: string;
  publicationYear?: number;
  sourceType: "academic-book" | "paper" | "official-documentation" | "benchmark-dataset" | "standard-framework";
  publisherOrDomain: string;
  licenseOrAccess: string;
  verificationTimestamp: string;
  relevanceNotes: string;
  conceptsSupported: string[];
  verificationStatus: SourceRelevanceClassification;
  doi?: string;
}

/**
 * SINGLE SOURCE REGISTRY (SSOT) UNTUK KURIKULUM VELQORA
 * Berisi sumber akademis, dokumentasi resmi, dan dataset terverifikasi.
 * Menggantikan referensi berulang (47 URL generik) dengan sumber spesifik berbobot ilmiah.
 */
export const VERIFIED_SOURCE_REGISTRY: Record<string, VerifiedSourceRecord> = {
  // --------------------------------------------------------------------------
  // BUKU TEKS STANDAR ACUAN DUNIA
  // --------------------------------------------------------------------------
  "src-russell-norvig-aima": {
    id: "src-russell-norvig-aima",
    url: "https://aima.cs.berkeley.edu/",
    title: "Artificial Intelligence: A Modern Approach (4th Edition)",
    authorOrOrg: "Stuart Russell & Peter Norvig",
    publicationYear: 2020,
    sourceType: "academic-book",
    publisherOrDomain: "Pearson",
    licenseOrAccess: "Commercial Textbook / Reference Edition",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Buku rujukan utama kurikulum AI dunia untuk agen cerdas, pencarian ruang keadaan, logika, dan probabilitas.",
    conceptsSupported: ["Intelligent Agents", "State Space Search", "Heuristic Search", "Adversarial Search", "Markov Decision Processes", "Knowledge Representation"],
    verificationStatus: "VERIFIED_RELEVANT",
  },
  "src-goodfellow-deep-learning": {
    id: "src-goodfellow-deep-learning",
    url: "https://www.deeplearningbook.org/",
    title: "Deep Learning",
    authorOrOrg: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    publicationYear: 2016,
    sourceType: "academic-book",
    publisherOrDomain: "MIT Press",
    licenseOrAccess: "Free Online HTML / Commercial Print",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Buku teks definitif deep learning MIT Press yang membahas fondasi aljabar linier, optimasi, regulasi, CNN, dan arsitektur sekuensial.",
    conceptsSupported: ["Feedforward Networks", "Backpropagation", "Regularization", "Optimization Algorithms", "Convolutional Networks", "Sequence Modeling"],
    verificationStatus: "VERIFIED_RELEVANT",
  },
  "src-hastie-elements-statistical-learning": {
    id: "src-hastie-elements-statistical-learning",
    url: "https://hastie.su.domains/ElemStatLearn/",
    title: "The Elements of Statistical Learning: Data Mining, Inference, and Prediction (2nd Edition)",
    authorOrOrg: "Trevor Hastie, Robert Tibshirani, Jerome Friedman",
    publicationYear: 2009,
    sourceType: "academic-book",
    publisherOrDomain: "Springer Series in Statistics",
    licenseOrAccess: "Free Official PDF (Stanford) / Springer",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Fondasi matematika statistik paling ketat untuk supervised/unsupervised learning, bias-variance trade-off, regularisasi L1/L2, dan ensemble.",
    conceptsSupported: ["Bias-Variance Decomposition", "Ridge Regression (L2)", "Lasso (L1)", "Kernel Methods", "Boosting & Bagging", "Cross-Validation"],
    verificationStatus: "VERIFIED_RELEVANT",
  },
  "src-bishop-prml": {
    id: "src-bishop-prml",
    url: "https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/",
    title: "Pattern Recognition and Machine Learning",
    authorOrOrg: "Christopher M. Bishop",
    publicationYear: 2006,
    sourceType: "academic-book",
    publisherOrDomain: "Springer",
    licenseOrAccess: "Free Official PDF (Microsoft Research)",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Rujukan kanonikal untuk pendekatan Bayesian dalam machine learning, estimasi densitas, graphical models, dan regresi polinomial.",
    conceptsSupported: ["Polynomial Curve Fitting", "Maximum Likelihood Estimation", "Bayesian Linear Regression", "EM Algorithm", "Gaussian Processes"],
    verificationStatus: "VERIFIED_RELEVANT",
  },
  "src-sutton-barto-rl": {
    id: "src-sutton-barto-rl",
    url: "http://incompleteideas.net/book/the-book-2nd.html",
    title: "Reinforcement Learning: An Introduction (2nd Edition)",
    authorOrOrg: "Richard S. Sutton & Andrew G. Barto",
    publicationYear: 2018,
    sourceType: "academic-book",
    publisherOrDomain: "MIT Press",
    licenseOrAccess: "Free Official Online Draft / MIT Press",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Karya definitif untuk seluruh cabang reinforcement learning dari tabuler Q-learning hingga function approximation.",
    conceptsSupported: ["Multi-armed Bandits", "Markov Decision Processes", "Dynamic Programming", "Monte Carlo Methods", "Temporal-Difference Learning", "Policy Gradients"],
    verificationStatus: "VERIFIED_RELEVANT",
  },

  // --------------------------------------------------------------------------
  // PAPER ILMIAH TONGGAK SEJARAH (MILESTONE RESEARCH PAPERS)
  // --------------------------------------------------------------------------
  "src-vaswani-attention-2017": {
    id: "src-vaswani-attention-2017",
    url: "https://arxiv.org/abs/1706.03762",
    title: "Attention Is All You Need",
    authorOrOrg: "Ashish Vaswani, Noam Shazeer, Niki Parmar, et al. (Google Brain & Research)",
    publicationYear: 2017,
    sourceType: "paper",
    publisherOrDomain: "Advances in Neural Information Processing Systems (NeurIPS 2017)",
    licenseOrAccess: "Open Access (arXiv)",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Paper penemu arsitektur Transformer yang menjadi basis seluruh arsitektur LLM modern (GPT, BERT, Gemini, Claude).",
    conceptsSupported: ["Scaled Dot-Product Attention", "Multi-Head Attention", "Positional Encoding", "Encoder-Decoder Architecture", "Layer Normalization"],
    verificationStatus: "VERIFIED_RELEVANT",
    doi: "10.48550/arXiv.1706.03762",
  },
  "src-he-resnet-2015": {
    id: "src-he-resnet-2015",
    url: "https://arxiv.org/abs/1512.03385",
    title: "Deep Residual Learning for Image Recognition",
    authorOrOrg: "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
    publicationYear: 2015,
    sourceType: "paper",
    publisherOrDomain: "IEEE CVPR 2016",
    licenseOrAccess: "Open Access (arXiv)",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Paper terobosan residual shortcut connections yang memecahkan masalah vanishing gradient pada deep neural networks beratus lapis.",
    conceptsSupported: ["Residual Connections", "Skip Connections", "Deep CNN", "Vanishing Gradient Mitigation", "Bottleneck Architecture"],
    verificationStatus: "VERIFIED_RELEVANT",
    doi: "10.48550/arXiv.1512.03385",
  },
  "src-ho-ddpm-2020": {
    id: "src-ho-ddpm-2020",
    url: "https://arxiv.org/abs/2006.11239",
    title: "Denoising Diffusion Probabilistic Models",
    authorOrOrg: "Jonathan Ho, Ajay Jain, Pieter Abbeel (UC Berkeley)",
    publicationYear: 2020,
    sourceType: "paper",
    publisherOrDomain: "NeurIPS 2020",
    licenseOrAccess: "Open Access (arXiv)",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Fondasi teoritis model difusi modern yang digunakan pada Stable Diffusion, Midjourney, dan model generasi citra/audio.",
    conceptsSupported: ["Diffusion Process", "Forward Noise Schedule", "Reverse Denoising Step", "Score Matching", "Variational Bound"],
    verificationStatus: "VERIFIED_RELEVANT",
    doi: "10.48550/arXiv.2006.11239",
  },
  "src-kingma-adam-2014": {
    id: "src-kingma-adam-2014",
    url: "https://arxiv.org/abs/1412.6980",
    title: "Adam: A Method for Stochastic Optimization",
    authorOrOrg: "Diederik P. Kingma, Jimmy Ba",
    publicationYear: 2014,
    sourceType: "paper",
    publisherOrDomain: "ICLR 2015",
    licenseOrAccess: "Open Access (arXiv)",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Paper penemu optimizer Adam yang menggabungkan keunggulan AdaGrad dan RMSProp dengan estimasi momen pertama dan kedua.",
    conceptsSupported: ["First Moment Estimation", "Second Moment Estimation", "Bias Correction", "Adaptive Learning Rate", "Gradient Descent"],
    verificationStatus: "VERIFIED_RELEVANT",
    doi: "10.48550/arXiv.1412.6980",
  },
  "src-devlin-bert-2018": {
    id: "src-devlin-bert-2018",
    url: "https://arxiv.org/abs/1810.04805",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authorOrOrg: "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova (Google AI Language)",
    publicationYear: 2018,
    sourceType: "paper",
    publisherOrDomain: "NAACL-HLT 2019",
    licenseOrAccess: "Open Access (arXiv)",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Terobosan masked language modeling (MLM) dan representasi kontekstual dua arah dalam NLP.",
    conceptsSupported: ["Masked Language Model", "Next Sentence Prediction", "Bidirectional Encoder", "Fine-tuning", "Token Embeddings"],
    verificationStatus: "VERIFIED_RELEVANT",
    doi: "10.48550/arXiv.1810.04805",
  },

  // --------------------------------------------------------------------------
  // DOKUMENTASI RESMI FRAMEWORK & LIBRARY (OFFICIAL DOCUMENTATION)
  // --------------------------------------------------------------------------
  "src-scikit-learn-pipeline-doc": {
    id: "src-scikit-learn-pipeline-doc",
    url: "https://scikit-learn.org/stable/modules/compose.html#pipeline",
    title: "Pipelines and composite estimators",
    authorOrOrg: "Scikit-learn Developers",
    publicationYear: 2024,
    sourceType: "official-documentation",
    publisherOrDomain: "scikit-learn.org",
    licenseOrAccess: "BSD 3-Clause",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Dokumentasi resmi arsitektur Pipeline untuk menjamin tidak terjadinya data leakage antara train dan test set.",
    conceptsSupported: ["Pipeline", "ColumnTransformer", "StandardScaler", "Cross-Validation without Data Leakage", "Estimator Composability"],
    verificationStatus: "VERIFIED_RELEVANT",
  },
  "src-scikit-learn-model-evaluation": {
    id: "src-scikit-learn-model-evaluation",
    url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
    title: "Metrics and scoring: quantifying the quality of predictions",
    authorOrOrg: "Scikit-learn Developers",
    publicationYear: 2024,
    sourceType: "official-documentation",
    publisherOrDomain: "scikit-learn.org",
    licenseOrAccess: "BSD 3-Clause",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Rujukan resmi untuk formulasi metrik MSE, RMSE, MAE, R², Confusion Matrix, Precision, Recall, F1-Score, dan ROC-AUC.",
    conceptsSupported: ["Mean Squared Error", "R2 Score", "Classification Report", "Confusion Matrix", "ROC Curve", "Log Loss"],
    verificationStatus: "VERIFIED_RELEVANT",
  },
  "src-pytorch-nn-module-doc": {
    id: "src-pytorch-nn-module-doc",
    url: "https://pytorch.org/docs/stable/generated/torch.nn.Module.html",
    title: "PyTorch Documentation: torch.nn.Module",
    authorOrOrg: "PyTorch Contributors",
    publicationYear: 2024,
    sourceType: "official-documentation",
    publisherOrDomain: "pytorch.org",
    licenseOrAccess: "Modified BSD",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Dokumentasi resmi pembuatan modular layers, registrasi parameter, forward pass, hooks, dan state management neural network.",
    conceptsSupported: ["Module Subclassing", "Parameters Management", "Forward Method", "CUDA/MPS Device Transfer", "State Dict"],
    verificationStatus: "VERIFIED_RELEVANT",
  },
  "src-pytorch-autograd-doc": {
    id: "src-pytorch-autograd-doc",
    url: "https://pytorch.org/docs/stable/notes/autograd.html",
    title: "Autograd mechanics in PyTorch",
    authorOrOrg: "PyTorch Contributors",
    publicationYear: 2024,
    sourceType: "official-documentation",
    publisherOrDomain: "pytorch.org",
    licenseOrAccess: "Modified BSD",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Dokumentasi detail mekanisme dynamic computation graph, backward pass, dan pengelolaan gradien pada PyTorch.",
    conceptsSupported: ["Computational Graph", "Automatic Differentiation", "no_grad Context", "Grad Accumulation", "Retain Graph"],
    verificationStatus: "VERIFIED_RELEVANT",
  },

  // --------------------------------------------------------------------------
  // BENCHMARK DATASET PROVENANCE
  // --------------------------------------------------------------------------
  "src-dataset-california-housing": {
    id: "src-dataset-california-housing",
    url: "https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html",
    title: "California Housing Dataset",
    authorOrOrg: "R. Kelley Pace and Ronald Barry (1997)",
    publicationYear: 1997,
    sourceType: "benchmark-dataset",
    publisherOrDomain: "Statistics & Probability Letters / Scikit-learn",
    licenseOrAccess: "Public Domain / Open Data",
    verificationTimestamp: "2026-09-16T00:00:00Z",
    relevanceNotes: "Dataset benchmark 20.640 sampel dengan 8 fitur kontinu dari sensus California 1990. Standar industri pengganti Boston Housing yang didepresiasi karena bias etis.",
    conceptsSupported: ["Dataset Inspection", "Target Distribution", "Spatial Features", "Feature Scaling", "Multivariate Linear Regression"],
    verificationStatus: "VERIFIED_RELEVANT",
  },
};

/**
 * Helper untuk mendapatkan sumber dari registry dengan jaminan validitas.
 */
export function getVerifiedSource(id: string): VerifiedSourceRecord | undefined {
  return VERIFIED_SOURCE_REGISTRY[id];
}

/**
 * Daftar seluruh ID sumber terverifikasi.
 */
export const ALL_VERIFIED_SOURCE_IDS = Object.keys(VERIFIED_SOURCE_REGISTRY);
