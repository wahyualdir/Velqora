-- ============================================================
-- Migration 016: Seed AI Curriculum Notes (Batch 4 - 5 Topik)
-- Topik:
-- 1. Graph Neural Network (GNN) (11 Bab)
-- 2. Knowledge Representation (10 Bab)
-- 3. Large Language Model (15 Bab)
-- 4. Machine Learning (22 Bab)
-- 5. MLOps & AI Deployment (14 Bab)
-- Total: 72 Bab Catatan Lengkap Kurikulum & Praktikum AI
-- ============================================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;

DO $$
DECLARE
  v_user_id UUID;
  v_parent_ai_id UUID;
  v_cat_gnn UUID;
  v_cat_kr UUID;
  v_cat_llm UUID;
  v_cat_ml UUID;
  v_cat_mlops UUID;
  v_has_icon BOOLEAN;
  v_has_parent BOOLEAN;
BEGIN
  -- 1. Dapatkan user admin/owner atau user pertama yang ada di sistem
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'wahyualdiriyanto80@gmail.com' LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'icon'
  ) INTO v_has_icon;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'parent_id'
  ) INTO v_has_parent;

  -- Dapatkan ID Kategori Induk Kecerdasan Buatan
  SELECT id INTO v_parent_ai_id FROM categories WHERE name = 'Kecerdasan Buatan' LIMIT 1;
  IF v_parent_ai_id IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (''Kecerdasan Buatan'', ''#8B5CF6'', ''machine_learning'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_parent_ai_id;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Kecerdasan Buatan', '#8B5CF6', v_user_id) RETURNING id INTO v_parent_ai_id;
    END IF;
  END IF;

  -- Kategori: Graph Neural Network (GNN)
  SELECT id INTO v_cat_gnn FROM categories WHERE name = 'Graph Neural Network (GNN)' LIMIT 1;
  IF v_cat_gnn IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Graph Neural Network (GNN)') || ', ''#8B5CF6'', ''gnn'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_gnn;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Graph Neural Network (GNN)') || ', ''#8B5CF6'', ''gnn'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_gnn;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Graph Neural Network (GNN)', '#8B5CF6', v_user_id) RETURNING id INTO v_cat_gnn;
    END IF;
  END IF;

  -- Kategori: Knowledge Representation
  SELECT id INTO v_cat_kr FROM categories WHERE name = 'Knowledge Representation' LIMIT 1;
  IF v_cat_kr IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Knowledge Representation') || ', ''#06B6D4'', ''knowledge_rep'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_kr;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Knowledge Representation') || ', ''#06B6D4'', ''knowledge_rep'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_kr;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Knowledge Representation', '#06B6D4', v_user_id) RETURNING id INTO v_cat_kr;
    END IF;
  END IF;

  -- Kategori: Large Language Model
  SELECT id INTO v_cat_llm FROM categories WHERE name = 'Large Language Model' LIMIT 1;
  IF v_cat_llm IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Large Language Model') || ', ''#F59E0B'', ''generative_ai'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_llm;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Large Language Model') || ', ''#F59E0B'', ''generative_ai'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_llm;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Large Language Model', '#F59E0B', v_user_id) RETURNING id INTO v_cat_llm;
    END IF;
  END IF;

  -- Kategori: Machine Learning
  SELECT id INTO v_cat_ml FROM categories WHERE name = 'Machine Learning' LIMIT 1;
  IF v_cat_ml IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('Machine Learning') || ', ''#8B5CF6'', ''machine_learning'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ml;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('Machine Learning') || ', ''#8B5CF6'', ''machine_learning'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_ml;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('Machine Learning', '#8B5CF6', v_user_id) RETURNING id INTO v_cat_ml;
    END IF;
  END IF;

  -- Kategori: MLOps & AI Deployment
  SELECT id INTO v_cat_mlops FROM categories WHERE name = 'MLOps & AI Deployment' LIMIT 1;
  IF v_cat_mlops IS NULL AND v_user_id IS NOT NULL THEN
    IF v_has_icon AND v_has_parent AND v_parent_ai_id IS NOT NULL THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, parent_id, user_id) VALUES (' || quote_literal('MLOps & AI Deployment') || ', ''#0284C7'', ''mlops'', ' || quote_literal(v_parent_ai_id) || ', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_mlops;
    ELSIF v_has_icon THEN
      EXECUTE 'INSERT INTO categories (name, color, icon, user_id) VALUES (' || quote_literal('MLOps & AI Deployment') || ', ''#0284C7'', ''mlops'', ' || quote_literal(v_user_id) || ') RETURNING id' INTO v_cat_mlops;
    ELSE
      INSERT INTO categories (name, color, user_id) VALUES ('MLOps & AI Deployment', '#0284C7', v_user_id) RETURNING id INTO v_cat_mlops;
    END IF;
  END IF;

  -- ------------------------------------------------------------
  -- BAGIAN 1: GRAPH NEURAL NETWORK (GNN) (11 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Graph',
    'bab-1-konsep-dasar-graph',
    '# BAB 1: Konsep Dasar Graph

Representasi data relasional non-Euclidean sebagai graph, jenis graph (directed, undirected, weighted, bipartite), serta representasi matematis adjacency matrix dan degree matrix.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Graph dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# graph_representation_basics.py
import numpy as np
import networkx as nx

# Membangun graf berarah dan berbobot menggunakan NetworkX
G = nx.DiGraph()
edges = [("A", "B", 1.5), ("A", "C", 2.0), ("B", "D", 0.8), ("C", "D", 1.2)]
G.add_weighted_edges_from(edges)

# Ekstraksi matriks adjasensi
adj_matrix = nx.to_numpy_array(G)
nodes = list(G.nodes())

print(f"Daftar Node: {nodes}")
print("Matriks Adjasensi:\n", adj_matrix)
print("In-degree tiap node:", dict(G.in_degree()))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Graph** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    1,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Graph Embedding',
    'bab-2-graph-embedding',
    '# BAB 2: Graph Embedding

Pemetaan struktur topologi graf ke representasi vektor berdimensi rendah: DeepWalk, Node2Vec (parameter bias p dan q), serta Graph Embedding untuk Knowledge Graph.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Graph Embedding dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# node2vec_walk_simulation.py
import random
import numpy as np

def simulate_random_walk(adj_dict, start_node, walk_length=5):
    walk = [start_node]
    current = start_node
    for _ in range(walk_length - 1):
        neighbors = adj_dict.get(current, [])
        if not neighbors:
            break
        current = random.choice(neighbors)
        walk.append(current)
    return walk

graph = {
    ''User1'': [''User2'', ''ItemA''],
    ''User2'': [''User1'', ''ItemB'', ''ItemC''],
    ''ItemA'': [''User1''],
    ''ItemB'': [''User2''],
    ''ItemC'': [''User2'']
}

print("Simulasi Random Walk DeepWalk/Node2Vec:")
for node in [''User1'', ''User2'']:
    print(f"Start {node}: {simulate_random_walk(graph, node)}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Graph Embedding** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    2,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Dasar Graph Neural Network',
    'bab-3-dasar-graph-neural-network',
    '# BAB 3: Dasar Graph Neural Network

Message Passing Framework (Aggregate, Update), Graph Convolutional Network (GCN) oleh Kipf & Welling, dan normalisasi simetris inv(D^1/2) * A * inv(D^1/2).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Dasar Graph Neural Network dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# gcn_layer_numpy.py
import numpy as np

# Implementasi GCN Layer manual: H^(l+1) = ReLU(D_hat^(-1/2) * A_hat * D_hat^(-1/2) * H^(l) * W)
A = np.array([[0, 1, 1], [1, 0, 0], [1, 0, 0]]) # Adjacency
X = np.array([[1.0, 0.5], [0.2, 1.1], [0.9, 0.1]]) # Feature matrix
W = np.random.randn(2, 4) # Weight matrix

A_hat = A + np.eye(A.shape[0]) # Add self-loops
deg = np.sum(A_hat, axis=1)
D_hat_inv_sqrt = np.diag(1.0 / np.sqrt(deg))

# Normalized Adjacency
A_norm = D_hat_inv_sqrt @ A_hat @ D_hat_inv_sqrt
H_next = np.maximum(0, A_norm @ X @ W)

print("Dimensi Feature Input:", X.shape)
print("Dimensi Output GCN:", H_next.shape)
print("Representasi Node Pertama:\n", H_next[0])
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Dasar Graph Neural Network** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Network',
    3,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Arsitektur GNN Lanjutan',
    'bab-4-arsitektur-gnn-lanjutan',
    '# BAB 4: Arsitektur GNN Lanjutan

GraphSAGE untuk representasi induktif dengan neighborhood sampling (Mean, LSTM, Pooling) dan Graph Attention Network (GAT) dengan mekanisme self-attention antar node tetangga.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Arsitektur GNN Lanjutan dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# gat_attention_mechanism.py
import numpy as np

def compute_gat_attention(h_i, h_j, a_vec):
    # h_i, h_j: feature vektor (F_out,)
    # a_vec: weight parameter attention (2 * F_out,)
    concat = np.concatenate([h_i, h_j])
    score = np.dot(a_vec, concat)
    # LeakyReLU dengan alpha 0.2
    return score if score > 0 else 0.2 * score

h_nodes = np.array([[0.5, 0.8], [0.9, 0.1], [0.2, 0.4]])
a_param = np.array([0.1, -0.2, 0.3, 0.05])

raw_scores = [compute_gat_attention(h_nodes[0], h_nodes[k], a_param) for k in range(3)]
exp_scores = np.exp(raw_scores - np.max(raw_scores))
attention_coeffs = exp_scores / np.sum(exp_scores)

print("Koefisien Attention GAT Node 0 terhadap tetangganya:", attention_coeffs)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Arsitektur GNN Lanjutan** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Layers',
    4,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Graph Transformer & Model Terbaru',
    'bab-5-graph-transformer-model-terbaru',
    '# BAB 5: Graph Transformer & Model Terbaru

Arsitektur Graph Transformer untuk mengatasi masalah oversmoothing dan bottlenecks, Positional & Structural Encoding (Laplacian PE), serta foundation models untuk graf.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Graph Transformer & Model Terbaru dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# laplacian_positional_encoding.py
import numpy as np

# Menghitung Laplacian Positional Encoding untuk Graph Transformer
A = np.array([[0, 1, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 1, 0]], dtype=float)
D = np.diag(np.sum(A, axis=1))
L = D - A # Unnormalized Laplacian

eigenvalues, eigenvectors = np.linalg.eigh(L)
# Ambil k eigenvector terkecil (tidak termasuk trivial k=0)
k_pe = eigenvectors[:, 1:3]

print("Eigenvalues Laplacian:", np.round(eigenvalues, 4))
print("Laplacian Positional Encoding (dim=2):\n", np.round(k_pe, 4))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Graph Transformer & Model Terbaru** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Layers',
    5,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Tugas pada Graph',
    'bab-6-tugas-pada-graph',
    '# BAB 6: Tugas pada Graph

Tiga tugas utama pada pembelajaran graf: Node Classification (semi-supervised), Link Prediction (prediksi tepi masa depan), dan Graph Classification dengan global readout/pooling.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Tugas pada Graph dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# graph_tasks_readout.py
import numpy as np

# Global Mean & Sum Pooling untuk Graph Classification
node_embeddings_graph1 = np.array([[1.2, 0.5], [0.8, 1.1], [0.3, 0.9]])
node_embeddings_graph2 = np.array([[0.1, 0.2], [0.4, 0.3]])

def global_mean_pool(embeddings):
    return np.mean(embeddings, axis=0)

g1_rep = global_mean_pool(node_embeddings_graph1)
g2_rep = global_mean_pool(node_embeddings_graph2)

# Link prediction score (dot product similarity)
link_prob = 1 / (1 + np.exp(-np.dot(node_embeddings_graph1[0], node_embeddings_graph1[1])))

print("Vektor Representasi Graf 1:", g1_rep)
print("Vektor Representasi Graf 2:", g2_rep)
print(f"Probabilitas Koneksi Link (Node 0 & 1): {link_prob:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Tugas pada Graph** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    6,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Knowledge Graph & GNN',
    'bab-7-knowledge-graph-gnn',
    '# BAB 7: Knowledge Graph & GNN

Knowledge Graph Embedding (TransE, RotatE, DistMult), Relational Graph Convolutional Networks (R-GCN), dan multi-hop reasoning atas basis pengetahuan.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Knowledge Graph & GNN dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# transe_kg_loss.py
import numpy as np

def transe_distance(head, relation, tail):
    # Skor TransE: ||h + r - t||_L2
    return np.linalg.norm(head + relation - tail, ord=2)

# Embedding entitas dan relasi
e_paris = np.array([0.8, 0.2, -0.5])
e_france = np.array([0.9, 0.3, -0.4])
r_capital = np.array([0.1, 0.1, 0.1])
e_berlin = np.array([-0.5, 0.7, 0.8])

pos_score = transe_distance(e_paris, r_capital, e_france)
neg_score = transe_distance(e_berlin, r_capital, e_france)

margin = 1.0
loss = max(0.0, margin + pos_score - neg_score)
print(f"Jarak Positif (Paris -> CapitalOf -> France): {pos_score:.4f}")
print(f"Jarak Negatif (Berlin -> CapitalOf -> France): {neg_score:.4f}")
print(f"Margin Ranking Loss: {loss:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Knowledge Graph & GNN** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Network',
    7,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Scalable & Dynamic GNN',
    'bab-8-scalable-dynamic-gnn',
    '# BAB 8: Scalable & Dynamic GNN

Skalabilitas GNN untuk graf berskala miliaran node (Cluster-GCN, GraphSAINT, neighborhood sampling) dan Temporal Graph Neural Network (TGN) untuk continuous-time dynamic graphs.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Scalable & Dynamic GNN dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# neighborhood_sampler_demo.py
import random

def sample_neighbors(adj_list, batch_nodes, num_samples=2):
    sampled_edges = []
    for node in batch_nodes:
        neighbors = adj_list.get(node, [])
        if neighbors:
            chosen = random.sample(neighbors, min(len(neighbors), num_samples))
            for n in chosen:
                sampled_edges.append((node, n))
    return sampled_edges

graph_adj = {
    ''A'': [''B'', ''C'', ''D'', ''E''],
    ''B'': [''A'', ''C'', ''F''],
    ''C'': [''A'', ''B'', ''G'', ''H'']
}

sampled = sample_neighbors(graph_adj, [''A'', ''B''], num_samples=2)
print("Edge hasil Neighborhood Sampling untuk mini-batch:", sampled)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Scalable & Dynamic GNN** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Network',
    8,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Evaluasi Model GNN',
    'bab-9-evaluasi-model-gnn',
    '# BAB 9: Evaluasi Model GNN

Metrik evaluasi khusus graph tasks (Accuracy, Micro/Macro F1, Mean Reciprocal Rank MRR, Hits@K) dan benchmark dataset standar (Cora, Citeseer, OGB Open Graph Benchmark).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Evaluasi Model GNN dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# gnn_evaluation_metrics.py
import numpy as np

def compute_mrr_and_hits_k(true_ranks, k=10):
    mrr = np.mean([1.0 / r for r in true_ranks])
    hits_k = np.mean([1.0 if r <= k else 0.0 for r in true_ranks])
    return mrr, hits_k

# Peringkat target sejati dari hasil scoring link prediction
sample_ranks = [1, 3, 2, 15, 4, 1, 20, 2]
mrr, hits_10 = compute_mrr_and_hits_k(sample_ranks, k=10)

print(f"Mean Reciprocal Rank (MRR): {mrr:.4f}")
print(f"Hits@10: {hits_10 * 100:.2f}%")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Evaluasi Model GNN** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Network',
    9,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Integrasi GNN dengan LLM',
    'bab-10-integrasi-gnn-dengan-llm',
    '# BAB 10: Integrasi GNN dengan LLM

GraphRAG (integrasi entitas dan relasi graph untuk retrieval-augmented generation) serta Graph-Augmented Reasoning pada LLM untuk inferensi fakta terstruktur.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Integrasi GNN dengan LLM dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# graphrag_context_builder.py
def build_graphrag_context(entity, knowledge_graph):
    triples = []
    for (src, rel, tgt) in knowledge_graph:
        if src.lower() == entity.lower():
            triples.append(f"({src}) --[{rel}]--> ({tgt})")
    return "\n".join(triples) if triples else "Tidak ada subgraph terkait."

kg_triples = [
    ("Transformer", "introduced_in", "Attention Is All You Need"),
    ("Transformer", "uses", "Self-Attention"),
    ("BERT", "based_on", "Transformer Encoder"),
    ("GPT-4", "based_on", "Transformer Decoder")
]

subgraph_context = build_graphrag_context("Transformer", kg_triples)
print("[GraphRAG Context Injection untuk LLM]:\n" + subgraph_context)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Integrasi GNN dengan LLM** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Network',
    10,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Aplikasi Graph Neural Network',
    'bab-11-aplikasi-graph-neural-network',
    '# BAB 11: Aplikasi Graph Neural Network

Implementasi GNN industri: sistem rekomendasi (PinSage, LightGCN), analisis jaringan sosial dan deteksi penipuan finansial, serta penemuan obat (molecular graph drug discovery).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Aplikasi Graph Neural Network dalam domain Graph Neural Network (GNN).
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# molecular_graph_demo.py
# Representasi molekul Etanol (C2H5OH) sebagai graf
atom_features = {
    0: {"symbol": "C", "valency": 4},
    1: {"symbol": "C", "valency": 4},
    2: {"symbol": "O", "valency": 2}
}
chemical_bonds = [(0, 1, "single"), (1, 2, "single")]

print(f"Jumlah Atom dalam Backbone Molekul: {len(atom_features)}")
print(f"Ikatan Kimia (Edges): {chemical_bonds}")
print("GNN siap memproses matriks atom untuk prediksi bioaktivitas farmasi.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Aplikasi Graph Neural Network** merupakan pilar fundamental dalam spesialisasi Graph Neural Network (GNN).
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Network',
    11,
    v_cat_gnn,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 2: KNOWLEDGE REPRESENTATION (10 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar Knowledge Representation',
    'bab-1-konsep-dasar-knowledge-representation',
    '# BAB 1: Konsep Dasar Knowledge Representation

Definisi & tujuan Knowledge Representation, perbedaan data, informasi, dan pengetahuan, serta karakteristik representasi yang baik (expressive adequacy, ontological commitment).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar Knowledge Representation dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# knowledge_rep_struct.py
class KnowledgeNode:
    def __init__(self, entity, attributes=None, relations=None):
        self.entity = entity
        self.attributes = attributes or {}
        self.relations = relations or {}

    def add_relation(self, predicate, target_entity):
        self.relations.setdefault(predicate, []).append(target_entity)

ai = KnowledgeNode("Artificial Intelligence", {"domain": "Computer Science"})
ai.add_relation("subfield_of", "Computer Science")
ai.add_relation("includes", "Machine Learning")
ai.add_relation("includes", "Knowledge Representation")

print(f"Entitas: {ai.entity}")
print("Atribut:", ai.attributes)
print("Relasi Taksonomi:", ai.relations)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar Knowledge Representation** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    1,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Logika sebagai Representasi Pengetahuan',
    'bab-2-logika-sebagai-representasi-pengetahuan',
    '# BAB 2: Logika sebagai Representasi Pengetahuan

Logika Proposisional (syntax, semantics), Logika Predikat Orde Pertama (First-Order Logic: quantifiers forall dan exists), serta Logika Deskripsi (Description Logic: TBox & ABox).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Logika sebagai Representasi Pengetahuan dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# fol_inference_simulation.py
# Simulasi Modus Ponens: (P -> Q) dan P => Q
knowledge_base = {
    "rules": [("is_human(X)", "is_mortal(X)")],
    "facts": {"is_human(''Socrates'')"}
}

def infer_mortality(kb, entity):
    premise = f"is_human(''{entity}'')"
    if premise in kb["facts"]:
        deduced = f"is_mortal(''{entity}'')"
        return deduced
    return None

result = infer_mortality(knowledge_base, "Socrates")
print("Hasil Inferensi First-Order Logic:", result)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Logika sebagai Representasi Pengetahuan** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    2,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Representasi Berbasis Jaringan',
    'bab-3-representasi-berbasis-jaringan',
    '# BAB 3: Representasi Berbasis Jaringan

Semantic Network (node sebagai konsep dan arc sebagai relasi), Frame-Based Representation (slot, facet, default values, inheritance), dan Conceptual Graph (Sowa).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Representasi Berbasis Jaringan dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# frame_system_inheritance.py
class Frame:
    def __init__(self, name, parent=None):
        self.name = name
        self.parent = parent
        self.slots = {}

    def set_slot(self, key, value):
        self.slots[key] = value

    def get_slot(self, key):
        if key in self.slots:
            return self.slots[key]
        if self.parent:
            return self.parent.get_slot(key)
        return None

# Definisi hirarki Frame
mammal = Frame("Mammal")
mammal.set_slot("blood_temp", "warm")
mammal.set_slot("has_hair", True)

cat = Frame("Cat", parent=mammal)
cat.set_slot("sound", "meow")

print(f"Frame {cat.name} sound: {cat.get_slot(''sound'')}")
print(f"Inherited blood_temp: {cat.get_slot(''blood_temp'')}")
print(f"Inherited has_hair: {cat.get_slot(''has_hair'')}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Representasi Berbasis Jaringan** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    3,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Representasi Berbasis Aturan',
    'bab-4-representasi-berbasis-aturan',
    '# BAB 4: Representasi Berbasis Aturan

Production Rules (IF condition THEN action), arsitektur Rule-Based System (Working Memory, Rule Base, Inference Engine), dan konsep dasar algoritma pattern matching Rete.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Representasi Berbasis Aturan dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# production_rule_engine.py
working_memory = {"temperature": 39.5, "cough": True}
rules = [
    {
        "if": lambda wm: wm.get("temperature", 0) > 38.0 and wm.get("cough", False),
        "then": lambda wm: wm.update({"diagnosis": "Demam / Infeksi Saluran Nafas", "fever": True})
    }
]

print("Working Memory Awal:", working_memory)
for rule in rules:
    if rule["if"](working_memory):
        rule["then"](working_memory)
print("Working Memory Pasca Eksekusi Rule:", working_memory)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Representasi Berbasis Aturan** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    4,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Ontology & Web Semantik',
    'bab-5-ontology-web-semantik',
    '# BAB 5: Ontology & Web Semantik

Konsep Ontology, Resource Description Framework (RDF triples), Web Ontology Language (OWL classes and properties), serta teknik query semantik menggunakan SPARQL.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Ontology & Web Semantik dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# rdf_triples_demo.py
# Representasi RDF Triples: (Subject, Predicate, Object)
rdf_triples = [
    ("<ex:DeepSeek>", "<rdf:type>", "<ex:LargeLanguageModel>"),
    ("<ex:DeepSeek>", "<ex:developedBy>", "<ex:DeepSeekAI>"),
    ("<ex:LargeLanguageModel>", "<rdfs:subClassOf>", "<ex:AIModel>")
]

def query_sparql_mock(triples, subject=None, predicate=None):
    results = []
    for s, p, o in triples:
        match_s = (subject is None or s == subject)
        match_p = (predicate is None or p == predicate)
        if match_s and match_p:
            results.append(o)
    return results

developer = query_sparql_mock(rdf_triples, subject="<ex:DeepSeek>", predicate="<ex:developedBy>")
print("Hasil Query SPARQL mock untuk developer DeepSeek:", developer)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Ontology & Web Semantik** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Share2',
    5,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Knowledge Graph',
    'bab-6-knowledge-graph',
    '# BAB 6: Knowledge Graph

Konsep Knowledge Graph enterprise, konstruksi Knowledge Graph dari data tidak terstruktur (Named Entity Recognition + Relation Extraction), dan Knowledge Graph Embedding.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Knowledge Graph dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# kg_construction_pipeline.py
import re

raw_corpus = "Alan Turing created the Turing Machine in 1936 at Cambridge."

def mock_ie_pipeline(text):
    # Ekstraksi entitas & relasi berbasis pola teratur
    triples = []
    if "Turing Machine" in text and "Alan Turing" in text:
        triples.append(("Alan Turing", "created", "Turing Machine"))
    if "Cambridge" in text:
        triples.append(("Alan Turing", "associated_with", "Cambridge"))
    return triples

triples = mock_ie_pipeline(raw_corpus)
print("Diekstrak ke Knowledge Graph Triples:")
for t in triples:
    print(f"[{t[0]}] ---({t[1]})---> [{t[2]}]")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Knowledge Graph** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    6,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Penalaran atas Pengetahuan',
    'bab-7-penalaran-atas-pengetahuan',
    '# BAB 7: Penalaran atas Pengetahuan

Reasoning dengan Deskripsi Logika (Tableaux algorithm), Non-Monotonic Reasoning (penarikan kesimpulan saat ada informasi baru yang membatalkan asumsi), dan Default Reasoning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Penalaran atas Pengetahuan dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# non_monotonic_reasoning.py
class NonMonotonicKB:
    def __init__(self):
        self.birds = set()
        self.penguins = set()

    def add_bird(self, name): self.birds.add(name)
    def add_penguin(self, name):
        self.birds.add(name)
        self.penguins.add(name)

    def can_fly(self, name):
        if name in self.penguins:
            return False # Pengecualian membatalkan aturan umum
        return name in self.birds

kb = NonMonotonicKB()
kb.add_bird("Tweety")
kb.add_penguin("Tux")

print(f"Dapatkah Tweety terbang? {kb.can_fly(''Tweety'')}")
print(f"Dapatkah Tux terbang? {kb.can_fly(''Tux'')}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Penalaran atas Pengetahuan** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    7,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Integrasi Knowledge Graph dengan LLM',
    'bab-8-integrasi-knowledge-graph-dengan-llm',
    '# BAB 8: Integrasi Knowledge Graph dengan LLM

GraphRAG, Knowledge-Grounded Generation untuk memitigasi halusinasi, dan multi-hop graph exploration untuk penalaran faktual pada model bahasa besar.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Integrasi Knowledge Graph dengan LLM dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# multi_hop_graph_reasoning.py
graph = {
    "Einstein": ["Theory of Relativity", "Princeton"],
    "Theory of Relativity": ["Modern Physics", "Nobel Prize"],
    "Modern Physics": ["Quantum Mechanics"]
}

def find_reasoning_path(start, target, path=None):
    if path is None: path = [start]
    if start == target: return path
    for neighbor in graph.get(start, []):
        if neighbor not in path:
            res = find_reasoning_path(neighbor, target, path + [neighbor])
            if res: return res
    return None

path = find_reasoning_path("Einstein", "Quantum Mechanics")
print("Multi-hop Reasoning Path untuk Grounded LLM:", " -> ".join(path))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Integrasi Knowledge Graph dengan LLM** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    8,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Graph Database',
    'bab-9-graph-database',
    '# BAB 9: Graph Database

Arsitektur Neo4j dan model Labeled Property Graph (LPG), bahasa query Cypher (MATCH, WHERE, RETURN), serta perbandingan mendalam performa Graph DB vs Relational DB.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Graph Database dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# cypher_query_builder.py
def build_cypher_query(start_person, relation_type, max_depth=2):
    return (
        f"MATCH (p:Person {{name: ''{start_person}''}})"
        f"-[:{relation_type}*1..{max_depth}]->(target:Person)\n"
        f"WHERE target.active = true\n"
        f"RETURN p.name, target.name, count(*) AS paths"
    )

query = build_cypher_query("Alice", "FRIENDS_WITH", max_depth=2)
print("[Contoh Query Cypher Neo4j]:\n" + query)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Graph Database** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    9,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Aplikasi Knowledge Representation',
    'bab-10-aplikasi-knowledge-representation',
    '# BAB 10: Aplikasi Knowledge Representation

Sistem pencarian semantik perusahaan, Knowledge Base Question Answering (KBQA), serta integrasi Knowledge Representation dengan Expert System dan automated compliance.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Aplikasi Knowledge Representation dalam domain Knowledge Representation.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# kbqa_matcher_demo.py
kb_data = {
    ("indonesia", "ibukota"): "Nusantara (IKN)",
    ("jepang", "ibukota"): "Tokyo",
    ("python", "kreator"): "Guido van Rossum"
}

def answer_question(user_query):
    q = user_query.lower()
    for (entity, prop), answer in kb_data.items():
        if entity in q and prop in q:
            return f"Berdasarkan Knowledge Graph: {prop.capitalize()} dari {entity.capitalize()} adalah {answer}."
    return "Jawaban tidak ditemukan dalam basis pengetahuan."

print(answer_question("Siapakah kreator dari bahasa Python?"))
print(answer_question("Apa ibukota dari Indonesia saat ini?"))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Aplikasi Knowledge Representation** merupakan pilar fundamental dalam spesialisasi Knowledge Representation.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Cpu',
    10,
    v_cat_kr,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 3: LARGE LANGUAGE MODEL (15 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Fondasi Large Language Model',
    'bab-1-fondasi-large-language-model',
    '# BAB 1: Fondasi Large Language Model

Definisi & karakteristik LLM (skala parameter miliaran, in-context learning, emergent abilities), dan sejarah evolusi dari model bahasa n-gram ke LLM modern.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Fondasi Large Language Model dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# temperature_sampling.py
import numpy as np

def sample_with_temperature(logits, temperature=1.0):
    logits = np.array(logits) / max(temperature, 1e-5)
    exp_logits = np.exp(logits - np.max(logits))
    probs = exp_logits / np.sum(exp_logits)
    return probs

raw_logits = [2.0, 1.0, 0.1, -1.5]
vocab = ["AI", "Robot", "Algoritma", "Batu"]

print("Probabilitas Temp 0.2 (Konservatif/Faktual):", np.round(sample_with_temperature(raw_logits, 0.2), 3))
print("Probabilitas Temp 1.0 (Standar):", np.round(sample_with_temperature(raw_logits, 1.0), 3))
print("Probabilitas Temp 1.8 (Kreatif/Divergen):", np.round(sample_with_temperature(raw_logits, 1.8), 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Fondasi Large Language Model** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    1,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Arsitektur Transformer untuk LLM',
    'bab-2-arsitektur-transformer-untuk-llm',
    '# BAB 2: Arsitektur Transformer untuk LLM

Self-Attention & Multi-Head Attention, keunggulan Decoder-Only dibandingkan Encoder-Decoder pada generative scaling, serta Positional Encoding (RoPE & ALiBi).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Arsitektur Transformer untuk LLM dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# rope_embedding_demo.py
import numpy as np

def rotary_position_embedding(x, seq_pos, dim=4):
    angles = seq_pos / (10000 ** (np.arange(0, dim, 2) / dim))
    sin_val = np.sin(angles)
    cos_val = np.cos(angles)
    
    x1, x2 = x[0::2], x[1::2]
    rotated_x1 = x1 * cos_val - x2 * sin_val
    rotated_x2 = x1 * sin_val + x2 * cos_val
    
    res = np.empty_like(x)
    res[0::2] = rotated_x1
    res[1::2] = rotated_x2
    return res

vec = np.array([1.0, 0.0, 1.0, 0.0])
print("Vektor Awal:", vec)
print("Vektor setelah RoPE Posisi 1:", rotary_position_embedding(vec, seq_pos=1))
print("Vektor setelah RoPE Posisi 10:", rotary_position_embedding(vec, seq_pos=10))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Arsitektur Transformer untuk LLM** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Layers',
    2,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Pretraining LLM & Scaling Law',
    'bab-3-pretraining-llm-scaling-law',
    '# BAB 3: Pretraining LLM & Scaling Law

Data pretraining, subword tokenization (BPE, SentencePiece), objective function Next Token Prediction (Cross-Entropy loss), dan Chinchilla Scaling Law.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Pretraining LLM & Scaling Law dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# chinchilla_scaling_law.py
def calculate_chinchilla_optimal(compute_flops):
    N = (compute_flops / 120.0) ** 0.5
    D = 20 * N
    return N, D

flops = 1e23
params, tokens = calculate_chinchilla_optimal(flops)
print(f"Compute Budget: {flops:.1e} FLOPs")
print(f"Ukuran Model Optimal: {params / 1e9:.2f} Miliar Parameter")
print(f"Jumlah Token Optimal: {tokens / 1e9:.2f} Miliar Token")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Pretraining LLM & Scaling Law** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    3,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Data untuk LLM',
    'bab-4-data-untuk-llm',
    '# BAB 4: Data untuk LLM

Kurasi dataset skala besar (Common Crawl, code, books), synthetic data generation (Self-Instruct, UltraFeedback), serta filtering & deduplication dengan MinHash LSH.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Data untuk LLM dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# text_deduplication_minhash.py
def get_shingles(text, k=3):
    return set([text[i:i+k] for i in range(len(text) - k + 1)])

def jaccard_similarity(set_a, set_b):
    intersection = len(set_a.intersection(set_b))
    union = len(set_a.union(set_b))
    return intersection / union if union > 0 else 0.0

doc1 = "Model bahasa besar dilatih dengan ribuan GPU."
doc2 = "Model bahasa besar dilatih dengan ribuan GPU canggih."

s1 = get_shingles(doc1, k=3)
s2 = get_shingles(doc2, k=3)
sim = jaccard_similarity(s1, s2)
print(f"Jaccard Similarity Dokumen: {sim:.4f}")
print("Status Deduplikasi:", "Duplikat dibuang!" if sim > 0.8 else "Dokumen unik disimpan.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Data untuk LLM** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    4,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Fine-Tuning & Adaptasi Model',
    'bab-5-fine-tuning-adaptasi-model',
    '# BAB 5: Fine-Tuning & Adaptasi Model

Full Fine-Tuning vs Parameter-Efficient Fine-Tuning (PEFT), matematika dekomposisi rank rendah LoRA (W = W0 + B*A), QLoRA (NF4 quantization), dan Instruction Tuning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Fine-Tuning & Adaptasi Model dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# lora_low_rank_decomposition.py
import numpy as np

d_in, d_out = 4096, 4096
rank = 8
alpha = 16

W0_param_count = d_in * d_out
lora_param_count = (d_in * rank) + (rank * d_out)

print(f"Parameter Matriks Penuh W0: {W0_param_count:,}")
print(f"Parameter LoRA (Rank {rank}): {lora_param_count:,}")
print(f"Penghematan Parameter: {100 * (1 - lora_param_count / W0_param_count):.2f}%")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Fine-Tuning & Adaptasi Model** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sliders',
    5,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Alignment Model',
    'bab-6-alignment-model',
    '# BAB 6: Alignment Model

Penyelarasan etika dan instruksi: Reinforcement Learning from Human Feedback (RLHF dengan PPO), Direct Preference Optimization (DPO), serta Constitutional AI & RLAIF.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Alignment Model dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# dpo_loss_formula.py
import numpy as np

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

def calculate_dpo_loss(logprob_pi_win, logprob_ref_win, logprob_pi_lose, logprob_ref_lose, beta=0.1):
    log_ratio_win = logprob_pi_win - logprob_ref_win
    log_ratio_lose = logprob_pi_lose - logprob_ref_lose
    diff = beta * (log_ratio_win - log_ratio_lose)
    loss = -np.log(sigmoid(diff) + 1e-10)
    return loss

loss = calculate_dpo_loss(logprob_pi_win=-0.5, logprob_ref_win=-1.2, 
                          logprob_pi_lose=-2.0, logprob_ref_lose=-1.5, beta=0.1)
print(f"DPO (Direct Preference Optimization) Loss: {loss:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Alignment Model** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    6,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Prompt Engineering & In-Context Learning',
    'bab-7-prompt-engineering-in-context-learning',
    '# BAB 7: Prompt Engineering & In-Context Learning

Zero-shot & few-shot prompting, Chain-of-Thought (CoT) prompting, Self-Consistency, dan framework otomatisasi prompt optimization (DSPy).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Prompt Engineering & In-Context Learning dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# cot_prompt_template.py
few_shot_cot_template = """Q: Roger punya 5 bola tenis. Dia membeli 2 kaleng berisi masing-masing 3 bola. Berapa total bola tenis Roger sekarang?
A: Roger awalnya punya 5 bola. 2 kaleng x 3 bola = 6 bola baru. Jadi 5 + 6 = 11 bola tenis. Jawabannya 11.

Q: Toko buku memiliki 20 buku. Setengahnya terjual di pagi hari, lalu 5 buku datang sebagai stok baru di sore hari. Berapa buku sekarang?
A:"""

print("[Prompt Berbasis Chain-of-Thought]:")
print(few_shot_cot_template)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Prompt Engineering & In-Context Learning** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    7,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Retrieval-Augmented Generation (RAG)',
    'bab-8-retrieval-augmented-generation-rag',
    '# BAB 8: Retrieval-Augmented Generation (RAG)

Arsitektur RAG komprehensif: strategi chunking dokumen, vector database & indexing HNSW, similarity search, reranking (Cross-Encoder), dan context augmentation.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Retrieval-Augmented Generation (RAG) dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# simple_rag_pipeline.py
import numpy as np

chunks = [
    "Velqora adalah platform belajar cerdas berbasis kurikulum AI komprehensif.",
    "Python dirancang oleh Guido van Rossum dan dirilis pertama kali tahun 1991.",
    "HNSW adalah algoritma indexing graf untuk pencarian ANN dalam database vektor."
]

def mock_embed(text):
    return np.array([float(''ai'' in text.lower()), float(''belajar'' in text.lower()), float(''vektor'' in text.lower())])

db_embeddings = np.array([mock_embed(c) for c in chunks])
query = "Bagaimana platform belajar AI bekerja?"
q_emb = mock_embed(query)

scores = np.dot(db_embeddings, q_emb)
best_idx = np.argmax(scores)

print(f"Query: ''{query}''")
print(f"Top Retrieved Context: ''{chunks[best_idx]}'' (Score: {scores[best_idx]})")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Retrieval-Augmented Generation (RAG)** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    8,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Reasoning & Test-Time Compute',
    'bab-9-reasoning-test-time-compute',
    '# BAB 9: Reasoning & Test-Time Compute

Model penalaran (Reasoning Models, System 2 Thinking), Tree of Thought (ToT), self-verification, dan alokasi komputasi waktu inferensi (test-time compute).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Reasoning & Test-Time Compute dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# test_time_compute_tot.py
def evaluate_candidate_thought(thought):
    if "verifikasi" in thought or "analisis" in thought:
        return 0.95
    return 0.60

thoughts = [
    "Langkah 1: Langsung tebak jawaban akhir tanpa bukti.",
    "Langkah 1: Lakukan analisis langkah demi langkah dan verifikasi asumsi dasar."
]

scored = [(t, evaluate_candidate_thought(t)) for t in thoughts]
best_thought = max(scored, key=lambda x: x[1])

print("Seleksi Jalur Berpikir Terbaik (Tree of Thought):")
print(f"Pilihan: {best_thought[0]} (Skor Evaluasi: {best_thought[1]})")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Reasoning & Test-Time Compute** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Share2',
    9,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Efisiensi & Optimisasi LLM',
    'bab-10-efisiensi-optimisasi-llm',
    '# BAB 10: Efisiensi & Optimisasi LLM

Teknik kuantisasi (GPTQ, AWQ, GGUF), Model Distillation, Mixture of Experts (MoE routing), dan akselerasi inferensi (Speculative Decoding, KV Cache management).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Efisiensi & Optimisasi LLM dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# moe_router_dispatch.py
import numpy as np

def moe_top_k_routing(token_repr, router_weights, top_k=2):
    logits = np.dot(token_repr, router_weights)
    top_indices = np.argsort(logits)[-top_k:][::-1]
    
    top_logits = logits[top_indices]
    exp_l = np.exp(top_logits - np.max(top_logits))
    weights = exp_l / np.sum(exp_l)
    return top_indices, weights

token_emb = np.array([0.5, -0.2, 1.1])
W_router = np.random.randn(3, 8)

experts, routing_weights = moe_top_k_routing(token_emb, W_router, top_k=2)
print(f"Dipetakan ke Expert Index: {experts}")
print(f"Bobot Kontribusi Expert: {np.round(routing_weights, 4)}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Efisiensi & Optimisasi LLM** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    10,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Model Merging & Composition',
    'bab-11-model-merging-composition',
    '# BAB 11: Model Merging & Composition

Metode penggabungan bobot model LLM tanpa retraining: Spherical Linear Interpolation (SLERP), TIES-Merging, DARE, dan arsitektur komposisi multi-model.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Model Merging & Composition dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# slerp_weight_interpolation.py
import numpy as np

def slerp(v0, v1, t):
    v0_norm = v0 / np.linalg.norm(v0)
    v1_norm = v1 / np.linalg.norm(v1)
    dot = np.dot(v0_norm, v1_norm)
    
    dot = np.clip(dot, -1.0, 1.0)
    theta = np.arccos(dot)
    
    sin_theta = np.sin(theta)
    if sin_theta < 1e-6:
        return (1 - t) * v0 + t * v1
    
    w0 = np.sin((1 - t) * theta) / sin_theta
    w1 = np.sin(t * theta) / sin_theta
    return w0 * v0 + w1 * v1

w_model_a = np.array([1.0, 0.5, 0.0])
w_model_b = np.array([0.0, 0.5, 1.0])
w_merged = slerp(w_model_a, w_model_b, t=0.5)

print("Bobot Model A:", w_model_a)
print("Bobot Model B:", w_model_b)
print("Bobot Hasil Merge SLERP (t=0.5):", np.round(w_merged, 4))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Model Merging & Composition** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    11,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Evaluasi LLM',
    'bab-12-evaluasi-llm',
    '# BAB 12: Evaluasi LLM

Benchmark standar (MMLU, HumanEval, GSM8k, MT-Bench), deteksi halusinasi, metriks factual correctness, evaluasi keamanan, red teaming, dan jailbreak resistance.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Evaluasi LLM dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# llm_as_a_judge.py
def format_judge_prompt(question, reference_ans, candidate_ans):
    return f"""[Evaluator Mode]
Pertanyaan: {question}
Kunci Jawaban: {reference_ans}
Jawaban Model: {candidate_ans}

Kriteria Penilaian:
1. Ketepatan Faktual (1-5)
2. Kelengkapan Penjelasan (1-5)
3. Kejelasan Bahasa (1-5)
Berikan skor total (1-15) dan justifikasi singkat."""

prompt = format_judge_prompt(
    "Apa fungsi dari Transformer Attention?",
    "Memetakan relasi antar token dalam sekuens secara paralel.",
    "Attention memungkinkan token memperhatikan token lain secara kontekstual."
)
print("[Contoh Prompt LLM-as-a-Judge]:\n" + prompt)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Evaluasi LLM** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
    12,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Deployment LLM',
    'bab-13-deployment-llm',
    '# BAB 13: Deployment LLM

Infrastruktur serving LLM berkinerja tinggi (vLLM, TGI), algoritma manajemen memori PagedAttention, KV-cache sizing, streaming responses, dan cost optimization.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Deployment LLM dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vram_kv_cache_estimator.py
def calculate_vram_requirement(params_billion, precision_bits=16, context_length=4096, batch_size=1):
    bytes_per_param = precision_bits / 8.0
    weight_memory_gb = (params_billion * 1e9 * bytes_per_param) / (1024**3)
    kv_cache_gb = (batch_size * context_length * 2 * 32 * 128 * bytes_per_param) / (1024**3)
    total_gb = weight_memory_gb + kv_cache_gb + 2.0
    return weight_memory_gb, kv_cache_gb, total_gb

w_mem, kv_mem, total = calculate_vram_requirement(params_billion=8, precision_bits=16, context_length=4096)
print(f"Memori Bobot Model (8B FP16): {w_mem:.2f} GB")
print(f"Memori KV Cache (4k Context): {kv_mem:.2f} GB")
print(f"Total VRAM Minimum: {total:.2f} GB (Cocok untuk GPU 24GB)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Deployment LLM** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    13,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Multimodal & Long-Context LLM',
    'bab-14-multimodal-long-context-llm',
    '# BAB 14: Multimodal & Long-Context LLM

Arsitektur Vision-Language Models (VLM: CLIP, Perceiver, MLP projection), audio processing integration, dan scaling panjang konteks hingga jutaan token (YaRN, LongLoRA).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 14: Multimodal & Long-Context LLM dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# vlm_projection_pipeline.py
import numpy as np

vision_patch_dim = 768
llm_embedding_dim = 4096

W_vision_proj = np.random.randn(vision_patch_dim, llm_embedding_dim) * 0.02
image_features = np.random.randn(49, vision_patch_dim)

visual_tokens = image_features @ W_vision_proj

print(f"Bentuk Fitur Visual Awal: {image_features.shape}")
print(f"Bentuk Visual Tokens yang siap disambung ke Prompt Teks LLM: {visual_tokens.shape}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 14: Multimodal & Long-Context LLM** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    14,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 15: Ekosistem LLM',
    'bab-15-ekosistem-llm',
    '# BAB 15: Ekosistem LLM

Perbandingan lanskap model Open Source (Llama 3, Mistral, DeepSeek) vs Closed Source (GPT-4o, Claude 3.5), ekosistem tooling pengembang, dan tren masa depan LLM.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 15: Ekosistem LLM dalam domain Large Language Model.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# unified_llm_client.py
class UnifiedLLMClient:
    def __init__(self, provider="ollama", model="llama3:8b"):
        self.provider = provider
        self.model = model

    def generate(self, prompt):
        print(f"[{self.provider.upper()}] Memproses prompt dengan model: {self.model}")
        return f"Jawaban cerdas untuk prompt: ''{prompt[:30]}...''"

client_local = UnifiedLLMClient(provider="ollama", model="deepseek-r1:8b")
client_cloud = UnifiedLLMClient(provider="openai", model="gpt-4o")

print(client_local.generate("Jelaskan masa depan AI di era multimodal."))
print(client_cloud.generate("Jelaskan masa depan AI di era multimodal."))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 15: Ekosistem LLM** merupakan pilar fundamental dalam spesialisasi Large Language Model.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    15,
    v_cat_llm,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 4: MACHINE LEARNING (22 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Fondasi Matematika & Pemrograman',
    'bab-1-fondasi-matematika-pemrograman',
    '# BAB 1: Fondasi Matematika & Pemrograman

Aljabar Linear (vektor, matriks, rank), kalkulus diferensial multivariabel (gradien, chain rule), probabilitas & statistika, serta pustaka komputasi Python (NumPy, Pandas, Matplotlib).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Fondasi Matematika & Pemrograman dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# gradient_descent_fundamentals.py
import numpy as np

w = 0.0
lr = 0.1
for epoch in range(25):
    gradient = 2 * (w - 4)
    w = w - lr * gradient

print(f"Bobot Optimal Konvergen w: {w:.4f} (Target Asli: 4.0)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Fondasi Matematika & Pemrograman** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
    1,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Dasar-Dasar Data',
    'bab-2-dasar-dasar-data',
    '# BAB 2: Dasar-Dasar Data

Data cleaning, Exploratory Data Analysis (EDA), rekayasa fitur (feature engineering & scaling), penanganan missing values & imbalanced data (SMOTE), dan paradigma Data-Centric AI.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Dasar-Dasar Data dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# data_preprocessing_pipeline.py
import numpy as np
from sklearn.preprocessing import RobustScaler
from sklearn.impute import SimpleImputer

raw_data = np.array([[10.0, np.nan], [12.0, 300.0], [9.0, 310.0], [100.0, 290.0]])

imputer = SimpleImputer(strategy=''median'')
cleaned_data = imputer.fit_transform(raw_data)

scaler = RobustScaler()
scaled_data = scaler.fit_transform(cleaned_data)

print("Data Bersih & diskalakan:\n", np.round(scaled_data, 3))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Dasar-Dasar Data** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Database',
    2,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: Konsep Inti Machine Learning',
    'bab-3-konsep-inti-machine-learning',
    '# BAB 3: Konsep Inti Machine Learning

Supervised vs Unsupervised vs Reinforcement Learning, Bias-Variance Tradeoff, pencegahan overfitting/underfitting, Cross-Validation, regularisasi (L1, L2, Elastic Net), dan Hyperparameter Tuning.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: Konsep Inti Machine Learning dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# bias_variance_cv.py
from sklearn.model_selection import KFold
import numpy as np

X = np.arange(20).reshape(10, 2)
y = np.array([0, 1] * 5)

kf = KFold(n_splits=5, shuffle=True, random_state=42)
for fold, (train_idx, val_idx) in enumerate(kf.split(X)):
    print(f"Fold {fold+1}: Train size = {len(train_idx)}, Val size = {len(val_idx)}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: Konsep Inti Machine Learning** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    3,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Probabilistic & Bayesian Machine Learning',
    'bab-4-probabilistic-bayesian-machine-learning',
    '# BAB 4: Probabilistic & Bayesian Machine Learning

Inferensi Bayesian (Prior, Likelihood, Posterior), Gaussian Process untuk regresi non-parametrik, Bayesian Optimization untuk tuning hyperparameter cerdas, dan Naive Bayes lanjutan.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Probabilistic & Bayesian Machine Learning dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# bayesian_update_demo.py
prior = 0.5
likelihood_head = 0.8
likelihood_tail = 0.2

p_evidence = (prior * likelihood_head) + ((1 - prior) * 0.5)
posterior = (prior * likelihood_head) / p_evidence

print(f"Prior Probabilitas: {prior:.2f}")
print(f"Posterior Probabilitas setelah 1 Head: {posterior:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Probabilistic & Bayesian Machine Learning** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    4,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Supervised Learning - Regresi',
    'bab-5-supervised-learning---regresi',
    '# BAB 5: Supervised Learning - Regresi

Linear & Polynomial Regression, Ridge Regression (L2 penalty), Lasso Regression (L1 feature selection), Elastic Net, serta Support Vector Regression (SVR).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Supervised Learning - Regresi dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# regularized_regression_comparison.py
from sklearn.linear_model import Ridge, Lasso
import numpy as np

X = np.array([[1, 2], [2, 4], [3, 6], [4, 8]])
y = np.array([2.1, 3.9, 6.1, 7.9])

ridge = Ridge(alpha=1.0).fit(X, y)
lasso = Lasso(alpha=0.1).fit(X, y)

print("Koefisien Ridge (L2 menyusutkan bobot):", ridge.coef_)
print("Koefisien Lasso (L1 membuat fitur 0):", lasso.coef_)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Supervised Learning - Regresi** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    5,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Supervised Learning - Klasifikasi',
    'bab-6-supervised-learning---klasifikasi',
    '# BAB 6: Supervised Learning - Klasifikasi

Algoritma klasifikasi komprehensif: Logistic Regression, K-Nearest Neighbors (KNN), Decision Tree, Random Forest, Support Vector Machine (SVM), serta Gradient Boosted Trees (XGBoost, LightGBM, CatBoost).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Supervised Learning - Klasifikasi dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# gradient_boosting_demo.py
from sklearn.ensemble import GradientBoostingClassifier
import numpy as np

X = np.array([[1.5, 2.0], [2.0, 1.8], [0.5, 0.4], [0.2, 0.8]])
y = np.array([1, 1, 0, 0])

clf = GradientBoostingClassifier(n_estimators=10, random_state=42)
clf.fit(X, y)
pred = clf.predict([[1.8, 1.9]])
prob = clf.predict_proba([[1.8, 1.9]])[0]

print(f"Prediksi Kelas: {pred[0]} dengan Keyakinan: {prob[pred[0]] * 100:.1f}%")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Supervised Learning - Klasifikasi** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    6,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Unsupervised Learning',
    'bab-7-unsupervised-learning',
    '# BAB 7: Unsupervised Learning

K-Means & Hierarchical Clustering, DBSCAN untuk kluster arbitrary shape, Gaussian Mixture Model (GMM), reduksi dimensi (PCA, t-SNE, UMAP), Association Rules, dan Anomaly Detection.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Unsupervised Learning dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# pca_clustering_pipeline.py
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
import numpy as np

data = np.random.randn(50, 6)
pca = PCA(n_components=2)
reduced_data = pca.fit_transform(data)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=''auto'')
labels = kmeans.fit_predict(reduced_data)

print(f"Rasio Varian Terjelaskan PCA 2D: {np.sum(pca.explained_variance_ratio_) * 100:.2f}%")
print(f"Distribusi Kluster: {np.bincount(labels)}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Unsupervised Learning** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    7,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Online & Continual Learning',
    'bab-8-online-continual-learning',
    '# BAB 8: Online & Continual Learning

Konsep Online Learning untuk streaming data, Incremental Learning dengan partial_fit, mitigasi Catastrophic Forgetting, dan Experience Replay.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Online & Continual Learning dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# streaming_partial_fit.py
from sklearn.linear_model import SGDClassifier
import numpy as np

clf = SGDClassifier(loss=''log_loss'', random_state=42)
classes = np.array([0, 1])

X_batch1 = np.array([[1.0, 1.2], [0.8, 0.9], [-1.0, -0.8], [-1.2, -1.1]])
y_batch1 = np.array([1, 1, 0, 0])
clf.partial_fit(X_batch1, y_batch1, classes=classes)

X_batch2 = np.array([[1.5, 1.6], [-0.9, -1.0]])
y_batch2 = np.array([1, 0])
clf.partial_fit(X_batch2, y_batch2)

print("Skor Akurasi Online Model:", clf.score(X_batch2, y_batch2))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Online & Continual Learning** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    8,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: Evaluasi & Validasi Model',
    'bab-9-evaluasi-validasi-model',
    '# BAB 9: Evaluasi & Validasi Model

Metrik regresi (MAE, MSE, RMSE, R2), metrik klasifikasi (Precision, Recall, F1-Score, ROC-AUC), Confusion Matrix, kalibrasi probabilitas, dan protokol pengujian A/B testing.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: Evaluasi & Validasi Model dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# classification_evaluation_metrics.py
from sklearn.metrics import confusion_matrix, roc_auc_score
import numpy as np

y_true = np.array([0, 0, 1, 1, 1, 0, 1, 0])
y_pred = np.array([0, 0, 1, 1, 0, 0, 1, 1])
y_prob = np.array([0.1, 0.2, 0.9, 0.8, 0.4, 0.3, 0.85, 0.7])

print("Confusion Matrix:\n", confusion_matrix(y_true, y_pred))
print(f"ROC-AUC Score: {roc_auc_score(y_true, y_prob):.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: Evaluasi & Validasi Model** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BarChart2',
    9,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Ensemble Learning',
    'bab-10-ensemble-learning',
    '# BAB 10: Ensemble Learning

Teknik ensembling mutakhir: Bagging, Boosting (AdaBoost, Gradient Boosting), Stacking dengan meta-learner kustom, dan Soft/Hard Voting Classifier.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Ensemble Learning dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# stacking_ensemble_demo.py
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
import numpy as np

base_estimators = [
    (''rf'', RandomForestClassifier(n_estimators=10, random_state=42)),
    (''knn'', KNeighborsClassifier(n_neighbors=3))
]
stack = StackingClassifier(estimators=base_estimators, final_estimator=LogisticRegression())

X = np.random.randn(30, 4)
y = np.random.randint(0, 2, size=30)
stack.fit(X, y)

print("Stacking Model berhasil dilatih dengan Meta-Learner Logistic Regression.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Ensemble Learning** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    10,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Interpretability Model Machine Learning',
    'bab-11-interpretability-model-machine-learning',
    '# BAB 11: Interpretability Model Machine Learning

Interpretabilitas model kotak hitam: Feature Importance (Mean Decrease Impurity vs Permutation Importance), Partial Dependence Plot (PDP), dan SHAP & LIME untuk model klasik.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Interpretability Model Machine Learning dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# permutation_feature_importance.py
from sklearn.inspection import permutation_importance
from sklearn.ensemble import RandomForestClassifier
import numpy as np

X = np.random.randn(40, 3)
y = np.random.randint(0, 2, size=40)
clf = RandomForestClassifier(random_state=42).fit(X, y)

result = permutation_importance(clf, X, y, n_repeats=5, random_state=42)
for i in range(X.shape[1]):
    print(f"Fitur {i}: Importance Mean = {result.importances_mean[i]:.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Interpretability Model Machine Learning** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    11,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Dasar Deep Learning',
    'bab-12-dasar-deep-learning',
    '# BAB 12: Dasar Deep Learning

Transisi dari ML ke Deep Learning: Perceptron & Multi-Layer Perceptron (MLP), fungsi aktivasi non-linear, Backpropagation dengan optimizers (SGD, Adam), Batch Normalization, dan Dropout.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Dasar Deep Learning dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# simple_mlp_pytorch.py
import torch
import torch.nn as nn

class SimpleMLP(nn.Module):
    def __init__(self, in_features, hidden_dim, out_classes):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim, out_classes)
        )
    def forward(self, x):
        return self.net(x)

model = SimpleMLP(in_features=10, hidden_dim=32, out_classes=2)
dummy_x = torch.randn(4, 10)
out = model(dummy_x)
print("Output logits MLP:", out.shape)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Dasar Deep Learning** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Network',
    12,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Computer Vision',
    'bab-13-computer-vision',
    '# BAB 13: Computer Vision

Convolutional Neural Network (CNN), arsitektur modern (ResNet, EfficientNet), Transfer Learning, Object Detection (YOLO), Segmentasi Citra (U-Net), dan Vision Transformer (ViT).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Computer Vision dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# conv2d_feature_map.py
import torch
import torch.nn as nn

conv = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1)
pool = nn.MaxPool2d(kernel_size=2, stride=2)

dummy_img = torch.randn(1, 3, 64, 64)
feat = pool(conv(dummy_img))

print(f"Dimensi Input Citra: {dummy_img.shape}")
print(f"Dimensi Feature Map setelah Conv & Pooling: {feat.shape}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Computer Vision** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Eye',
    13,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Natural Language Processing',
    'bab-14-natural-language-processing',
    '# BAB 14: Natural Language Processing

Text preprocessing & tokenization, word embeddings, pemodelan sekuensial (RNN, LSTM, GRU), mekanisme Attention, Transformer (BERT & GPT), serta tugas-tugas inti NLP.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 14: Natural Language Processing dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# tfidf_text_classifier.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

corpus = [
    "Machine learning memudahkan analisis data prediktif",
    "Deep learning memerlukan GPU komputasi tinggi",
    "Sepak bola dan olahraga sangat menyenangkan"
]
labels = [1, 1, 0]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(corpus)

clf = LogisticRegression().fit(X, labels)
test_text = ["Belajar AI dan algoritma deep learning"]
pred = clf.predict(vectorizer.transform(test_text))
print("Prediksi Kategori Teks:", "Topik AI" if pred[0] == 1 else "Topik Umum")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 14: Natural Language Processing** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    14,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 15: Large Language Model',
    'bab-15-large-language-model',
    '# BAB 15: Large Language Model

Konsep dasar LLM dalam kurikulum ML: siklus pretraining vs fine-tuning, adaptasi PEFT/LoRA, prompt engineering praktis, evaluasi RLHF, RAG, serta teknik kompresi kuantisasi.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 15: Large Language Model dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# prompt_formatter_ml.py
def create_structured_prompt(task_desc, context, query):
    return f"""### SYSTEM: Anda adalah asisten Machine Learning berpengalaman.
### TUGAS: {task_desc}
### KONTEKS: {context}
### PERTANYAAN: {query}
### JAWABAN:"""

prompt = create_structured_prompt(
    "Klasifikasi Sentimen",
    "Dataset ulasan aplikasi edutech",
    "Aplikasi ini sangat responsif dan membantu saya belajar!"
)
print("[Format Prompt Terstruktur]:\n" + prompt)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 15: Large Language Model** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    15,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 16: AI Agents & Sistem Generatif',
    'bab-16-ai-agents-sistem-generatif',
    '# BAB 16: AI Agents & Sistem Generatif

AI Agents otonom: Function Calling & Tool Use, arsitektur Multi-Agent, Model Context Protocol (MCP), dan pengantar sistem generatif multimodal (Text-to-Image & Video).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 16: AI Agents & Sistem Generatif dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# react_agent_loop.py
def execute_tool(tool_name, argument):
    if tool_name == "calculator":
        return eval(argument)
    return "Tool tidak dikenal."

def agent_reasoning_step(query):
    thought = "Saya butuh menghitung biaya komputasi."
    action = "calculator"
    action_input = "24 * 30 * 1.5"
    observation = execute_tool(action, action_input)
    return f"Thought: {thought}\nAction: {action}({action_input})\nObservation: USD {observation}"

print("[Simulasi ReAct Agent Loop]:\n" + agent_reasoning_step("Berapa biaya sewa GPU sebulan?"))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 16: AI Agents & Sistem Generatif** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    16,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 17: Reinforcement Learning',
    'bab-17-reinforcement-learning',
    '# BAB 17: Reinforcement Learning

Pembelajaran penguatan: Markov Decision Process (MDP: S, A, R, P, gamma), Bellman Equation, Q-Learning tabular, Deep Q-Network (DQN), dan algoritma Policy Gradient (PPO).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 17: Reinforcement Learning dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# q_learning_tabular.py
import numpy as np

q_table = np.zeros((4, 2))
lr = 0.1
gamma = 0.95

state = 0
action = 1
reward = 10.0
next_state = 1

best_future_q = np.max(q_table[next_state])
q_table[state, action] += lr * (reward + gamma * best_future_q - q_table[state, action])

print("Q-Table setelah pembaruan Bellman:\n", q_table)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 17: Reinforcement Learning** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    17,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 18: MLOps & Deployment',
    'bab-18-mlops-deployment',
    '# BAB 18: MLOps & Deployment

Transisi model ML ke produksi: Model Versioning & Registry (MLflow), CI/CD pipeline otomatis, serving model via container Docker dan FastAPI, serta monitoring data drift.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 18: MLOps & Deployment dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# fastapi_ml_endpoint.py
from pydantic import BaseModel

class PredictionRequest(BaseModel):
    features: list[float]

class PredictionResponse(BaseModel):
    prediction: int
    probability: float

def predict_service(req: PredictionRequest) -> PredictionResponse:
    score = sum(req.features)
    pred_class = 1 if score > 0 else 0
    return PredictionResponse(prediction=pred_class, probability=0.88)

sample_input = PredictionRequest(features=[0.5, -0.2, 1.2])
print("Hasil Inferensi Service:", predict_service(sample_input).model_dump())
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 18: MLOps & Deployment** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Server',
    18,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 19: Etika & Responsible AI',
    'bab-19-etika-responsible-ai',
    '# BAB 19: Etika & Responsible AI

Tanggung jawab etis: bias data & keadilan model (Fairness metrics), interpretabilitas XAI (SHAP/LIME), perlindungan privasi (Federated Learning & Differential Privacy), dan tata kelola AI.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 19: Etika & Responsible AI dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# fairness_disparate_impact.py
def calculate_disparate_impact(favorable_unprivileged, total_unprivileged, favorable_privileged, total_privileged):
    rate_unprivileged = favorable_unprivileged / total_unprivileged
    rate_privileged = favorable_privileged / total_privileged
    di_ratio = rate_unprivileged / rate_privileged
    return di_ratio

di = calculate_disparate_impact(40, 100, 70, 100)
print(f"Disparate Impact Ratio: {di:.2f}")
print("Status Keadilan:", "Memenuhi aturan 80%" if di >= 0.8 else "Terindikasi Bias!")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 19: Etika & Responsible AI** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'ShieldCheck',
    19,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 20: Topik Lanjutan & Riset Terkini',
    'bab-20-topik-lanjutan-riset-terkini',
    '# BAB 20: Topik Lanjutan & Riset Terkini

Evolusi mutakhir ML: Self-Supervised & Contrastive Learning, Graph Neural Network (GNN), AutoML & Neural Architecture Search, time series forecasting, dan Causal Inference.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 20: Topik Lanjutan & Riset Terkini dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# simclr_contrastive_loss.py
import numpy as np

def info_nce_loss(z_i, z_j, temperature=0.5):
    sim_pos = np.dot(z_i, z_j) / (np.linalg.norm(z_i) * np.linalg.norm(z_j))
    loss = -np.log(np.exp(sim_pos / temperature) / (np.exp(sim_pos / temperature) + 10 * np.exp(0.1 / temperature)))
    return loss

z1 = np.array([1.0, 0.5])
z2 = np.array([0.9, 0.6])
print(f"InfoNCE Loss (SimCLR): {info_nce_loss(z1, z2):.4f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 20: Topik Lanjutan & Riset Terkini** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    20,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 21: Tools & Ekosistem',
    'bab-21-tools-ekosistem',
    '# BAB 21: Tools & Ekosistem

Lanskap perkakas machine learning modern: Scikit-learn, PyTorch, Hugging Face Transformers, LangChain, vector databases (Qdrant, Pinecone), dan platform Cloud ML (AWS, GCP, Azure).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 21: Tools & Ekosistem dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# huggingface_pipeline_mock.py
print("[Ecosystem Setup Standard ML Stack]:")
print("1. Scikit-learn (Algoritma Tabular & Preprocessing)")
print("2. PyTorch (Deep Learning & Neural Network Research)")
print("3. Hugging Face (Model Hub & Pretrained Transformers)")
print("4. MLflow / WandB (Experiment Tracking & Model Registry)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 21: Tools & Ekosistem** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    21,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 22: Proyek & Studi Kasus',
    'bab-22-proyek-studi-kasus',
    '# BAB 22: Proyek & Studi Kasus

Integrasi portofolio praktis: Proyek Klasifikasi Citra & Computer Vision, Proyek Chatbot NLP, Sistem Rekomendasi E-Commerce, Aplikasi RAG/LLM, serta tips sukses kompetisi Kaggle.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 22: Proyek & Studi Kasus dalam domain Machine Learning.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# kaggle_baseline_pipeline.py
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
import numpy as np

X_train = np.random.randn(100, 5)
y_train = np.random.randint(0, 2, size=100)

baseline_model = RandomForestClassifier(n_estimators=50, random_state=42)
scores = cross_val_score(baseline_model, X_train, y_train, cv=5, scoring=''accuracy'')

print(f"CV Skor Rata-rata Baseline: {np.mean(scores) * 100:.2f}% (+/- {np.std(scores) * 100:.2f}%)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 22: Proyek & Studi Kasus** merupakan pilar fundamental dalam spesialisasi Machine Learning.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Rocket',
    22,
    v_cat_ml,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  -- ------------------------------------------------------------
  -- BAGIAN 5: MLOPS & AI DEPLOYMENT (14 Bab)
  -- ------------------------------------------------------------
  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 1: Konsep Dasar MLOps',
    'bab-1-konsep-dasar-mlops',
    '# BAB 1: Konsep Dasar MLOps

Definisi & tujuan MLOps (DevOps untuk Machine Learning), mengatasi Technical Debt pada sistem ML, dan tingkat kematangan MLOps (Level 0: Manual, Level 1: ML Pipeline, Level 2: CI/CD Otomatis).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 1: Konsep Dasar MLOps dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# mlops_manifest_logger.py
import json
import time

pipeline_metadata = {
    "pipeline_id": "pipe-cust-churn-001",
    "timestamp": int(time.time()),
    "mlops_level": 2,
    "stages": ["Data Validation", "Auto-Retraining", "Model Evaluation", "Canary Deployment"],
    "status": "SUCCESS"
}

print(json.dumps(pipeline_metadata, indent=2))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 1: Konsep Dasar MLOps** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Server',
    1,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 2: Version Control untuk ML',
    'bab-2-version-control-untuk-ml',
    '# BAB 2: Version Control untuk ML

Manajemen versi kode vs data vs model: implementasi Data Version Control (DVC) dengan remote storage dan Model Versioning & Registry pada MLflow.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 2: Version Control untuk ML dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# dvc_pipeline_stage.py
# Simulasi pipeline definition DVC (dvc.yaml)
dvc_stage_config = """
stages:
  train:
    cmd: python train.py --data data/features.csv --epochs 10
    deps:
      - data/features.csv
      - train.py
    params:
      - train.lr
      - train.batch_size
    outs:
      - models/model.pkl
    metrics:
      - report/metrics.json:
          cache: false
"""
print("[Konfigurasi Pipeline DVC]:" + dvc_stage_config)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 2: Version Control untuk ML** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    2,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 3: CI/CD untuk Machine Learning',
    'bab-3-cicd-untuk-machine-learning',
    '# BAB 3: CI/CD untuk Machine Learning

Continuous Integration untuk ML (validasi kualitas data, unit testing, model performance gate) dan Continuous Training & Deployment dengan GitHub Actions atau GitLab CI.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 3: CI/CD untuk Machine Learning dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# model_quality_gate_test.py
def test_model_performance_gate(candidate_auc, baseline_auc, threshold_improvement=0.01):
    diff = candidate_auc - baseline_auc
    assert diff >= threshold_improvement, (
        f"Gagal Quality Gate: Peningkatan AUC hanya {diff:.4f}, butuh minimal {threshold_improvement}"
    )
    return "Lolos Quality Gate! Model disetujui untuk deployment."

try:
    print(test_model_performance_gate(candidate_auc=0.92, baseline_auc=0.90))
except AssertionError as e:
    print(e)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 3: CI/CD untuk Machine Learning** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Server',
    3,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 4: Model Serving',
    'bab-4-model-serving',
    '# BAB 4: Model Serving

Arsitektur serving model: pembuatan REST API dengan FastAPI, perbandingan model serving framework performa tinggi (TorchServe, Triton, vLLM), dan batch vs real-time streaming inference.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 4: Model Serving dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# fastapi_production_serving.py
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="MLOps Serving API")

class IrisInput(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float

@app.post("/predict")
def predict_iris(payload: IrisInput):
    features = np.array([[payload.sepal_length, payload.sepal_width, payload.petal_length, payload.petal_width]])
    pred_class = int(np.argmax(features))
    return {"class_id": pred_class, "status": "200 OK"}

print("FastAPI Application initialized for production ASGI serving.")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 4: Model Serving** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Server',
    4,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 5: Containerization & Orchestration',
    'bab-5-containerization-orchestration',
    '# BAB 5: Containerization & Orchestration

Docker containerization untuk reproducible ML environments (multi-stage build, CUDA support) dan orkestrasi skala besar dengan Kubernetes (Pods, Services, Horizontal Pod Autoscaler).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 5: Containerization & Orchestration dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# dockerfile_ml_sample.py
dockerfile_content = """FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./src ./src
COPY ./models ./models
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
"""
print("[Contoh Dockerfile untuk Microservice ML]:\n" + dockerfile_content)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 5: Containerization & Orchestration** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    5,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 6: Monitoring & Observability',
    'bab-6-monitoring-observability',
    '# BAB 6: Monitoring & Observability

Pemantauan performa model di produksi: latensi, throughput, deteksi Data Drift & Concept Drift dengan Population Stability Index (PSI) dan Kolmogorov-Smirnov Test, serta logging & alerting.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 6: Monitoring & Observability dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# psi_drift_detection.py
import numpy as np

def calculate_psi(expected_dist, actual_dist, eps=1e-4):
    expected = np.array(expected_dist) + eps
    actual = np.array(actual_dist) + eps
    expected /= np.sum(expected)
    actual /= np.sum(actual)
    psi = np.sum((actual - expected) * np.log(actual / expected))
    return psi

baseline_bins = [0.2, 0.3, 0.3, 0.2]
prod_bins_nodrift = [0.21, 0.29, 0.31, 0.19]
prod_bins_drift = [0.05, 0.15, 0.40, 0.40]

print(f"PSI Normal: {calculate_psi(baseline_bins, prod_bins_nodrift):.4f} (< 0.1: Tidak ada drift)")
print(f"PSI Drift: {calculate_psi(baseline_bins, prod_bins_drift):.4f} (> 0.25: Signifikan Drift)")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 6: Monitoring & Observability** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    6,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 7: Feature Store & Data Pipeline',
    'bab-7-feature-store-data-pipeline',
    '# BAB 7: Feature Store & Data Pipeline

Konsep Feature Store (Feast, Hopsworks) untuk menjamin point-in-time correctness, mencegah data leakage antara training & serving, serta sinkronisasi online store (Redis) & offline store (Parquet/Snowflake).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 7: Feature Store & Data Pipeline dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# feature_store_feast_def.py
feature_definition = """from feast import Entity, FeatureView, Field, Int64, Float32
from datetime import timedelta

user_entity = Entity(name="user_id", join_keys=["user_id"])

user_features_view = FeatureView(
    name="user_click_stats",
    entities=[user_entity],
    ttl=timedelta(days=30),
    schema=[
        Field(name="avg_daily_clicks", dtype=Float32),
        Field(name="total_orders_30d", dtype=Int64)
    ],
    online=True
)
"""
print("[Contoh Konfigurasi Feature Store]:\n" + feature_definition)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 7: Feature Store & Data Pipeline** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sparkles',
    7,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 8: Experiment Tracking',
    'bab-8-experiment-tracking',
    '# BAB 8: Experiment Tracking

Tracking eksperimen otomatis dengan MLflow Tracking dan Weights & Biases (W&B): pencatatan hyperparameter, logging kurva loss, penyimpanan artefak model, dan reproduktibilitas.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 8: Experiment Tracking dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# mlflow_tracking_script.py
def mock_mlflow_run(params, metrics, model_name):
    print(f"--- [MLflow Run: {model_name}] ---")
    for k, v in params.items():
        print(f"Log Param: {k} = {v}")
    for k, v in metrics.items():
        print(f"Log Metric: {k} = {v}")
    print("Model Artifacts: Saved to s3://mlflow-artifacts/model.pkl\n")

mock_mlflow_run(
    params={"learning_rate": 0.001, "batch_size": 64, "optimizer": "AdamW"},
    metrics={"val_loss": 0.231, "val_accuracy": 0.945},
    model_name="ResNet50-Transfer"
)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 8: Experiment Tracking** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    8,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 9: LLMOps',
    'bab-9-llmops',
    '# BAB 9: LLMOps

Operasional model bahasa besar (LLMOps): manajemen versi prompt, versioning pipeline RAG, evaluasi output LLM berkelanjutan (LangSmith, TruLens), dan monitoring token usage & latency.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 9: LLMOps dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# llm_latency_token_tracker.py
import time

def track_llm_inference(prompt, mock_response, input_tokens, output_tokens):
    start = time.time()
    time.sleep(0.05)
    duration = time.time() - start
    
    cost_estimate = (input_tokens * 0.0000015) + (output_tokens * 0.000002)
    return {
        "latency_sec": round(duration, 3),
        "total_tokens": input_tokens + output_tokens,
        "cost_usd": round(cost_estimate, 6)
    }

metrics = track_llm_inference("Jelaskan CI/CD dalam AI", "CI/CD adalah...", 35, 120)
print("LLMOps Monitoring Metrics:", metrics)
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 9: LLMOps** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'MessageSquareCode',
    9,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 10: Skalabilitas & Optimasi',
    'bab-10-skalabilitas-optimasi',
    '# BAB 10: Skalabilitas & Optimasi

Teknik optimasi skala produksi: Load Balancing, kompresi model (ONNX Runtime, TensorRT quantization INT8/FP16), dan strategi deployment ke edge device.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 10: Skalabilitas & Optimasi dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# onnx_conversion_check.py
import numpy as np

pytorch_output = np.array([0.1234, 0.8766])
onnx_output = np.array([0.1235, 0.8765])

diff = np.max(np.abs(pytorch_output - onnx_output))
assert diff < 1e-3, "Perbedaan output melebihi batas toleransi kuantisasi!"
print(f"Verifikasi Berhasil! Deviasi maksimum ONNX vs PyTorch: {diff:.6f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 10: Skalabilitas & Optimasi** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Sliders',
    10,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 11: Keamanan dalam MLOps',
    'bab-11-keamanan-dalam-mlops',
    '# BAB 11: Keamanan dalam MLOps

Keamanan sistem ML produksi: kontrol akses berbasis peran (RBAC) pada model registry, audit trail deployment, pengamanan supply chain model (SafeTensors vs kerentanan Pickle).

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 11: Keamanan dalam MLOps dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# safetensors_security_check.py
def verify_model_security(file_path):
    if file_path.endswith(".pkl") or file_path.endswith(".pickle"):
        return "PERINGATAN RISIKO TINGGI: File pickle rentan terhadap arbitrary code execution!"
    elif file_path.endswith(".safetensors") or file_path.endswith(".onnx"):
        return "AMAN: Format SafeTensors/ONNX kebal terhadap eksekusi kode berbahaya."
    return "Format tidak dikenal."

print(verify_model_security("models/weights.pkl"))
print(verify_model_security("models/model.safetensors"))
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 11: Keamanan dalam MLOps** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'ShieldCheck',
    11,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 12: Cost Management & FinOps untuk AI',
    'bab-12-cost-management-finops-untuk-ai',
    '# BAB 12: Cost Management & FinOps untuk AI

FinOps untuk AI: optimasi biaya inferensi GPU/TPU, pemanfaatan spot instances, dynamic scale-to-zero autoscaling, dan manajemen alokasi kuota token LLM.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 12: Cost Management & FinOps untuk AI dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# finops_cost_calculator.py
def calculate_monthly_gpu_cost(hours_per_day, gpu_price_hourly, spot_discount=0.7):
    on_demand_monthly = hours_per_day * 30 * gpu_price_hourly
    spot_monthly = on_demand_monthly * (1 - spot_discount)
    savings = on_demand_monthly - spot_monthly
    return on_demand_monthly, spot_monthly, savings

on_demand, spot, saved = calculate_monthly_gpu_cost(24, 2.5, 0.65)
print(f"Biaya On-Demand Bulanan (A10G): USD {on_demand:.2f}")
print(f"Biaya Spot Instance Bulanan: USD {spot:.2f}")
print(f"Penghematan FinOps: USD {saved:.2f}")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 12: Cost Management & FinOps untuk AI** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'BookOpen',
    12,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 13: Studi Kasus MLOps',
    'bab-13-studi-kasus-mlops',
    '# BAB 13: Studi Kasus MLOps

Penerapan arsitektur MLOps end-to-end pada industri: data ingestion terorkestrasi, automated training, model validation gate, canary deployment, dan automated drift remediation.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 13: Studi Kasus MLOps dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# end_to_end_mlops_dag.py
stages = [
    {"stage": 1, "task": "Data Ingestion & Schema Check", "status": "PASS"},
    {"stage": 2, "task": "AutoML Model Training", "status": "PASS"},
    {"stage": 3, "task": "Bias & Performance Verification", "status": "PASS"},
    {"stage": 4, "task": "Canary 10% Traffic Rollout", "status": "DEPLOYED"}
]

print("=== PIPELINE STATUS ORCHESTRATION ===")
for s in stages:
    print(f"Stage {s[''stage'']}: {s[''task'']} -> [{s[''status'']}]")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 13: Studi Kasus MLOps** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Server',
    13,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

  INSERT INTO notes (title, slug, content_markdown, icon, order_index, category_id, is_folder, created_by)
  VALUES (
    'BAB 14: Best Practice Deployment Model Produksi',
    'bab-14-best-practice-deployment-model-produksi',
    '# BAB 14: Best Practice Deployment Model Produksi

Checklist kesiapan deployment produksi (liveness/readiness probes, graceful shutdown, fallback logic), dan prosedur Disaster Recovery serta automated rollback jika terjadi degradasi performa.

## Konsep Utama
- **Definisi & Teori Dasar**: Pemahaman komprehensif mengenai latar belakang, prinsip kerja, dan signifikansi BAB 14: Best Practice Deployment Model Produksi dalam domain MLOps & AI Deployment.
- **Arsitektur & Komponen**: Menjelajahi struktur internal, parameter utama, dan relasi logis dengan tahapan pipeline sebelumnya.
- **Standar & Best Practice**: Menerapkan kaidah praktis yang umum diadopsi di skala produksi industri teknologi kecerdasan buatan.

## Implementasi Kode Praktikum

```python
# blue_green_rollback_router.py
class DeploymentRouter:
    def __init__(self):
        self.active_version = "BLUE (v1.0.0)"
        self.standby_version = "GREEN (v1.1.0)"

    def trigger_rollback(self, reason):
        print(f"[ALERT] Performa menurun karena: {reason}")
        print(f"Mengembalikan lalu lintas dari {self.standby_version} kembali ke {self.active_version}...")
        self.standby_version, self.active_version = self.active_version, self.standby_version
        print(f"Rollback selesai! Versi aktif sekarang: {self.active_version}")

router = DeploymentRouter()
router.trigger_rollback("Tingkat error 5xx melebihi 1%")
```

## Ringkasan & Poin Penting
1. Materi pada **BAB 14: Best Practice Deployment Model Produksi** merupakan pilar fundamental dalam spesialisasi MLOps & AI Deployment.
2. Implementasi kode di atas dapat dijalankan langsung dan disesuaikan untuk kebutuhan dataset praktikum.
3. Dokumentasi ini terhubung secara otomatis ke kurikulum belajar Obsidian-style Velqora.',
    'Server',
    14,
    v_cat_mlops,
    false,
    v_user_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content_markdown = EXCLUDED.content_markdown,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    category_id = COALESCE(EXCLUDED.category_id, notes.category_id),
    updated_at = now();

END $$;
