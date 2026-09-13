import { ModuleSection } from "@/types/module-drive";

/**
 * Kurikulum Lengkap: Graph Neural Network (GNN) (11 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getGraphNeuralNetworkSections(): ModuleSection[] {
  return [
    {
      id: "gnn-sec-1",
      title: "BAB 1: Konsep Dasar Graph",
      orderIndex: 1,
      isCompleted: false,
      description: "Representasi data relasional non-Euclidean sebagai graph, jenis graph (directed, undirected, weighted, bipartite), serta representasi matematis adjacency matrix dan degree matrix.",
      codeSnippets: [{
        id: "gnn-snip-1",
        language: "python",
        caption: "graph_representation_basics.py",
        code: "import numpy as np\nimport networkx as nx\n\n# Membangun graf berarah dan berbobot menggunakan NetworkX\nG = nx.DiGraph()\nedges = [(\"A\", \"B\", 1.5), (\"A\", \"C\", 2.0), (\"B\", \"D\", 0.8), (\"C\", \"D\", 1.2)]\nG.add_weighted_edges_from(edges)\n\n# Ekstraksi matriks adjasensi\nadj_matrix = nx.to_numpy_array(G)\nnodes = list(G.nodes())\n\nprint(f\"Daftar Node: {nodes}\")\nprint(\"Matriks Adjasensi:\\n\", adj_matrix)\nprint(\"In-degree tiap node:\", dict(G.in_degree()))",
      }],
    },
    {
      id: "gnn-sec-2",
      title: "BAB 2: Graph Embedding",
      orderIndex: 2,
      isCompleted: false,
      description: "Pemetaan struktur topologi graf ke representasi vektor berdimensi rendah: DeepWalk, Node2Vec (parameter bias p dan q), serta Graph Embedding untuk Knowledge Graph.",
      codeSnippets: [{
        id: "gnn-snip-2",
        language: "python",
        caption: "node2vec_walk_simulation.py",
        code: "import random\nimport numpy as np\n\ndef simulate_random_walk(adj_dict, start_node, walk_length=5):\n    walk = [start_node]\n    current = start_node\n    for _ in range(walk_length - 1):\n        neighbors = adj_dict.get(current, [])\n        if not neighbors:\n            break\n        current = random.choice(neighbors)\n        walk.append(current)\n    return walk\n\ngraph = {\n    'User1': ['User2', 'ItemA'],\n    'User2': ['User1', 'ItemB', 'ItemC'],\n    'ItemA': ['User1'],\n    'ItemB': ['User2'],\n    'ItemC': ['User2']\n}\n\nprint(\"Simulasi Random Walk DeepWalk/Node2Vec:\")\nfor node in ['User1', 'User2']:\n    print(f\"Start {node}: {simulate_random_walk(graph, node)}\")",
      }],
    },
    {
      id: "gnn-sec-3",
      title: "BAB 3: Dasar Graph Neural Network",
      orderIndex: 3,
      isCompleted: false,
      description: "Message Passing Framework (Aggregate, Update), Graph Convolutional Network (GCN) oleh Kipf & Welling, dan normalisasi simetris inv(D^1/2) * A * inv(D^1/2).",
      codeSnippets: [{
        id: "gnn-snip-3",
        language: "python",
        caption: "gcn_layer_numpy.py",
        code: "import numpy as np\n\n# Implementasi GCN Layer manual: H^(l+1) = ReLU(D_hat^(-1/2) * A_hat * D_hat^(-1/2) * H^(l) * W)\nA = np.array([[0, 1, 1], [1, 0, 0], [1, 0, 0]]) # Adjacency\nX = np.array([[1.0, 0.5], [0.2, 1.1], [0.9, 0.1]]) # Feature matrix\nW = np.random.randn(2, 4) # Weight matrix\n\nA_hat = A + np.eye(A.shape[0]) # Add self-loops\ndeg = np.sum(A_hat, axis=1)\nD_hat_inv_sqrt = np.diag(1.0 / np.sqrt(deg))\n\n# Normalized Adjacency\nA_norm = D_hat_inv_sqrt @ A_hat @ D_hat_inv_sqrt\nH_next = np.maximum(0, A_norm @ X @ W)\n\nprint(\"Dimensi Feature Input:\", X.shape)\nprint(\"Dimensi Output GCN:\", H_next.shape)\nprint(\"Representasi Node Pertama:\\n\", H_next[0])",
      }],
    },
    {
      id: "gnn-sec-4",
      title: "BAB 4: Arsitektur GNN Lanjutan",
      orderIndex: 4,
      isCompleted: false,
      description: "GraphSAGE untuk representasi induktif dengan neighborhood sampling (Mean, LSTM, Pooling) dan Graph Attention Network (GAT) dengan mekanisme self-attention antar node tetangga.",
      codeSnippets: [{
        id: "gnn-snip-4",
        language: "python",
        caption: "gat_attention_mechanism.py",
        code: "import numpy as np\n\ndef compute_gat_attention(h_i, h_j, a_vec):\n    # h_i, h_j: feature vektor (F_out,)\n    # a_vec: weight parameter attention (2 * F_out,)\n    concat = np.concatenate([h_i, h_j])\n    score = np.dot(a_vec, concat)\n    # LeakyReLU dengan alpha 0.2\n    return score if score > 0 else 0.2 * score\n\nh_nodes = np.array([[0.5, 0.8], [0.9, 0.1], [0.2, 0.4]])\na_param = np.array([0.1, -0.2, 0.3, 0.05])\n\nraw_scores = [compute_gat_attention(h_nodes[0], h_nodes[k], a_param) for k in range(3)]\nexp_scores = np.exp(raw_scores - np.max(raw_scores))\nattention_coeffs = exp_scores / np.sum(exp_scores)\n\nprint(\"Koefisien Attention GAT Node 0 terhadap tetangganya:\", attention_coeffs)",
      }],
    },
    {
      id: "gnn-sec-5",
      title: "BAB 5: Graph Transformer & Model Terbaru",
      orderIndex: 5,
      isCompleted: false,
      description: "Arsitektur Graph Transformer untuk mengatasi masalah oversmoothing dan bottlenecks, Positional & Structural Encoding (Laplacian PE), serta foundation models untuk graf.",
      codeSnippets: [{
        id: "gnn-snip-5",
        language: "python",
        caption: "laplacian_positional_encoding.py",
        code: "import numpy as np\n\n# Menghitung Laplacian Positional Encoding untuk Graph Transformer\nA = np.array([[0, 1, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 1, 0]], dtype=float)\nD = np.diag(np.sum(A, axis=1))\nL = D - A # Unnormalized Laplacian\n\neigenvalues, eigenvectors = np.linalg.eigh(L)\n# Ambil k eigenvector terkecil (tidak termasuk trivial k=0)\nk_pe = eigenvectors[:, 1:3]\n\nprint(\"Eigenvalues Laplacian:\", np.round(eigenvalues, 4))\nprint(\"Laplacian Positional Encoding (dim=2):\\n\", np.round(k_pe, 4))",
      }],
    },
    {
      id: "gnn-sec-6",
      title: "BAB 6: Tugas pada Graph",
      orderIndex: 6,
      isCompleted: false,
      description: "Tiga tugas utama pada pembelajaran graf: Node Classification (semi-supervised), Link Prediction (prediksi tepi masa depan), dan Graph Classification dengan global readout/pooling.",
      codeSnippets: [{
        id: "gnn-snip-6",
        language: "python",
        caption: "graph_tasks_readout.py",
        code: "import numpy as np\n\n# Global Mean & Sum Pooling untuk Graph Classification\nnode_embeddings_graph1 = np.array([[1.2, 0.5], [0.8, 1.1], [0.3, 0.9]])\nnode_embeddings_graph2 = np.array([[0.1, 0.2], [0.4, 0.3]])\n\ndef global_mean_pool(embeddings):\n    return np.mean(embeddings, axis=0)\n\ng1_rep = global_mean_pool(node_embeddings_graph1)\ng2_rep = global_mean_pool(node_embeddings_graph2)\n\n# Link prediction score (dot product similarity)\nlink_prob = 1 / (1 + np.exp(-np.dot(node_embeddings_graph1[0], node_embeddings_graph1[1])))\n\nprint(\"Vektor Representasi Graf 1:\", g1_rep)\nprint(\"Vektor Representasi Graf 2:\", g2_rep)\nprint(f\"Probabilitas Koneksi Link (Node 0 & 1): {link_prob:.4f}\")",
      }],
    },
    {
      id: "gnn-sec-7",
      title: "BAB 7: Knowledge Graph & GNN",
      orderIndex: 7,
      isCompleted: false,
      description: "Knowledge Graph Embedding (TransE, RotatE, DistMult), Relational Graph Convolutional Networks (R-GCN), dan multi-hop reasoning atas basis pengetahuan.",
      codeSnippets: [{
        id: "gnn-snip-7",
        language: "python",
        caption: "transe_kg_loss.py",
        code: "import numpy as np\n\ndef transe_distance(head, relation, tail):\n    # Skor TransE: ||h + r - t||_L2\n    return np.linalg.norm(head + relation - tail, ord=2)\n\n# Embedding entitas dan relasi\ne_paris = np.array([0.8, 0.2, -0.5])\ne_france = np.array([0.9, 0.3, -0.4])\nr_capital = np.array([0.1, 0.1, 0.1])\ne_berlin = np.array([-0.5, 0.7, 0.8])\n\npos_score = transe_distance(e_paris, r_capital, e_france)\nneg_score = transe_distance(e_berlin, r_capital, e_france)\n\nmargin = 1.0\nloss = max(0.0, margin + pos_score - neg_score)\nprint(f\"Jarak Positif (Paris -> CapitalOf -> France): {pos_score:.4f}\")\nprint(f\"Jarak Negatif (Berlin -> CapitalOf -> France): {neg_score:.4f}\")\nprint(f\"Margin Ranking Loss: {loss:.4f}\")",
      }],
    },
    {
      id: "gnn-sec-8",
      title: "BAB 8: Scalable & Dynamic GNN",
      orderIndex: 8,
      isCompleted: false,
      description: "Skalabilitas GNN untuk graf berskala miliaran node (Cluster-GCN, GraphSAINT, neighborhood sampling) dan Temporal Graph Neural Network (TGN) untuk continuous-time dynamic graphs.",
      codeSnippets: [{
        id: "gnn-snip-8",
        language: "python",
        caption: "neighborhood_sampler_demo.py",
        code: "import random\n\ndef sample_neighbors(adj_list, batch_nodes, num_samples=2):\n    sampled_edges = []\n    for node in batch_nodes:\n        neighbors = adj_list.get(node, [])\n        if neighbors:\n            chosen = random.sample(neighbors, min(len(neighbors), num_samples))\n            for n in chosen:\n                sampled_edges.append((node, n))\n    return sampled_edges\n\ngraph_adj = {\n    'A': ['B', 'C', 'D', 'E'],\n    'B': ['A', 'C', 'F'],\n    'C': ['A', 'B', 'G', 'H']\n}\n\nsampled = sample_neighbors(graph_adj, ['A', 'B'], num_samples=2)\nprint(\"Edge hasil Neighborhood Sampling untuk mini-batch:\", sampled)",
      }],
    },
    {
      id: "gnn-sec-9",
      title: "BAB 9: Evaluasi Model GNN",
      orderIndex: 9,
      isCompleted: false,
      description: "Metrik evaluasi khusus graph tasks (Accuracy, Micro/Macro F1, Mean Reciprocal Rank MRR, Hits@K) dan benchmark dataset standar (Cora, Citeseer, OGB Open Graph Benchmark).",
      codeSnippets: [{
        id: "gnn-snip-9",
        language: "python",
        caption: "gnn_evaluation_metrics.py",
        code: "import numpy as np\n\ndef compute_mrr_and_hits_k(true_ranks, k=10):\n    mrr = np.mean([1.0 / r for r in true_ranks])\n    hits_k = np.mean([1.0 if r <= k else 0.0 for r in true_ranks])\n    return mrr, hits_k\n\n# Peringkat target sejati dari hasil scoring link prediction\nsample_ranks = [1, 3, 2, 15, 4, 1, 20, 2]\nmrr, hits_10 = compute_mrr_and_hits_k(sample_ranks, k=10)\n\nprint(f\"Mean Reciprocal Rank (MRR): {mrr:.4f}\")\nprint(f\"Hits@10: {hits_10 * 100:.2f}%\")",
      }],
    },
    {
      id: "gnn-sec-10",
      title: "BAB 10: Integrasi GNN dengan LLM",
      orderIndex: 10,
      isCompleted: false,
      description: "GraphRAG (integrasi entitas dan relasi graph untuk retrieval-augmented generation) serta Graph-Augmented Reasoning pada LLM untuk inferensi fakta terstruktur.",
      codeSnippets: [{
        id: "gnn-snip-10",
        language: "python",
        caption: "graphrag_context_builder.py",
        code: "def build_graphrag_context(entity, knowledge_graph):\n    triples = []\n    for (src, rel, tgt) in knowledge_graph:\n        if src.lower() == entity.lower():\n            triples.append(f\"({src}) --[{rel}]--> ({tgt})\")\n    return \"\\n\".join(triples) if triples else \"Tidak ada subgraph terkait.\"\n\nkg_triples = [\n    (\"Transformer\", \"introduced_in\", \"Attention Is All You Need\"),\n    (\"Transformer\", \"uses\", \"Self-Attention\"),\n    (\"BERT\", \"based_on\", \"Transformer Encoder\"),\n    (\"GPT-4\", \"based_on\", \"Transformer Decoder\")\n]\n\nsubgraph_context = build_graphrag_context(\"Transformer\", kg_triples)\nprint(\"[GraphRAG Context Injection untuk LLM]:\\n\" + subgraph_context)",
      }],
    },
    {
      id: "gnn-sec-11",
      title: "BAB 11: Aplikasi Graph Neural Network",
      orderIndex: 11,
      isCompleted: false,
      description: "Implementasi GNN industri: sistem rekomendasi (PinSage, LightGCN), analisis jaringan sosial dan deteksi penipuan finansial, serta penemuan obat (molecular graph drug discovery).",
      codeSnippets: [{
        id: "gnn-snip-11",
        language: "python",
        caption: "molecular_graph_demo.py",
        code: "# Representasi molekul Etanol (C2H5OH) sebagai graf\natom_features = {\n    0: {\"symbol\": \"C\", \"valency\": 4},\n    1: {\"symbol\": \"C\", \"valency\": 4},\n    2: {\"symbol\": \"O\", \"valency\": 2}\n}\nchemical_bonds = [(0, 1, \"single\"), (1, 2, \"single\")]\n\nprint(f\"Jumlah Atom dalam Backbone Molekul: {len(atom_features)}\")\nprint(f\"Ikatan Kimia (Edges): {chemical_bonds}\")\nprint(\"GNN siap memproses matriks atom untuk prediksi bioaktivitas farmasi.\")",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Knowledge Representation (10 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getKnowledgeRepresentationSections(): ModuleSection[] {
  return [
    {
      id: "kr-sec-1",
      title: "BAB 1: Konsep Dasar Knowledge Representation",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi & tujuan Knowledge Representation, perbedaan data, informasi, dan pengetahuan, serta karakteristik representasi yang baik (expressive adequacy, ontological commitment).",
      codeSnippets: [{
        id: "kr-snip-1",
        language: "python",
        caption: "knowledge_rep_struct.py",
        code: "class KnowledgeNode:\n    def __init__(self, entity, attributes=None, relations=None):\n        self.entity = entity\n        self.attributes = attributes or {}\n        self.relations = relations or {}\n\n    def add_relation(self, predicate, target_entity):\n        self.relations.setdefault(predicate, []).append(target_entity)\n\nai = KnowledgeNode(\"Artificial Intelligence\", {\"domain\": \"Computer Science\"})\nai.add_relation(\"subfield_of\", \"Computer Science\")\nai.add_relation(\"includes\", \"Machine Learning\")\nai.add_relation(\"includes\", \"Knowledge Representation\")\n\nprint(f\"Entitas: {ai.entity}\")\nprint(\"Atribut:\", ai.attributes)\nprint(\"Relasi Taksonomi:\", ai.relations)",
      }],
    },
    {
      id: "kr-sec-2",
      title: "BAB 2: Logika sebagai Representasi Pengetahuan",
      orderIndex: 2,
      isCompleted: false,
      description: "Logika Proposisional (syntax, semantics), Logika Predikat Orde Pertama (First-Order Logic: quantifiers forall dan exists), serta Logika Deskripsi (Description Logic: TBox & ABox).",
      codeSnippets: [{
        id: "kr-snip-2",
        language: "python",
        caption: "fol_inference_simulation.py",
        code: "# Simulasi Modus Ponens: (P -> Q) dan P => Q\nknowledge_base = {\n    \"rules\": [(\"is_human(X)\", \"is_mortal(X)\")],\n    \"facts\": {\"is_human('Socrates')\"}\n}\n\ndef infer_mortality(kb, entity):\n    premise = f\"is_human('{entity}')\"\n    if premise in kb[\"facts\"]:\n        deduced = f\"is_mortal('{entity}')\"\n        return deduced\n    return None\n\nresult = infer_mortality(knowledge_base, \"Socrates\")\nprint(\"Hasil Inferensi First-Order Logic:\", result)",
      }],
    },
    {
      id: "kr-sec-3",
      title: "BAB 3: Representasi Berbasis Jaringan",
      orderIndex: 3,
      isCompleted: false,
      description: "Semantic Network (node sebagai konsep dan arc sebagai relasi), Frame-Based Representation (slot, facet, default values, inheritance), dan Conceptual Graph (Sowa).",
      codeSnippets: [{
        id: "kr-snip-3",
        language: "python",
        caption: "frame_system_inheritance.py",
        code: "class Frame:\n    def __init__(self, name, parent=None):\n        self.name = name\n        self.parent = parent\n        self.slots = {}\n\n    def set_slot(self, key, value):\n        self.slots[key] = value\n\n    def get_slot(self, key):\n        if key in self.slots:\n            return self.slots[key]\n        if self.parent:\n            return self.parent.get_slot(key)\n        return None\n\n# Definisi hirarki Frame\nmammal = Frame(\"Mammal\")\nmammal.set_slot(\"blood_temp\", \"warm\")\nmammal.set_slot(\"has_hair\", True)\n\ncat = Frame(\"Cat\", parent=mammal)\ncat.set_slot(\"sound\", \"meow\")\n\nprint(f\"Frame {cat.name} sound: {cat.get_slot('sound')}\")\nprint(f\"Inherited blood_temp: {cat.get_slot('blood_temp')}\")\nprint(f\"Inherited has_hair: {cat.get_slot('has_hair')}\")",
      }],
    },
    {
      id: "kr-sec-4",
      title: "BAB 4: Representasi Berbasis Aturan",
      orderIndex: 4,
      isCompleted: false,
      description: "Production Rules (IF condition THEN action), arsitektur Rule-Based System (Working Memory, Rule Base, Inference Engine), dan konsep dasar algoritma pattern matching Rete.",
      codeSnippets: [{
        id: "kr-snip-4",
        language: "python",
        caption: "production_rule_engine.py",
        code: "working_memory = {\"temperature\": 39.5, \"cough\": True}\nrules = [\n    {\n        \"if\": lambda wm: wm.get(\"temperature\", 0) > 38.0 and wm.get(\"cough\", False),\n        \"then\": lambda wm: wm.update({\"diagnosis\": \"Demam / Infeksi Saluran Nafas\", \"fever\": True})\n    }\n]\n\nprint(\"Working Memory Awal:\", working_memory)\nfor rule in rules:\n    if rule[\"if\"](working_memory):\n        rule[\"then\"](working_memory)\nprint(\"Working Memory Pasca Eksekusi Rule:\", working_memory)",
      }],
    },
    {
      id: "kr-sec-5",
      title: "BAB 5: Ontology & Web Semantik",
      orderIndex: 5,
      isCompleted: false,
      description: "Konsep Ontology, Resource Description Framework (RDF triples), Web Ontology Language (OWL classes and properties), serta teknik query semantik menggunakan SPARQL.",
      codeSnippets: [{
        id: "kr-snip-5",
        language: "python",
        caption: "rdf_triples_demo.py",
        code: "# Representasi RDF Triples: (Subject, Predicate, Object)\nrdf_triples = [\n    (\"<ex:DeepSeek>\", \"<rdf:type>\", \"<ex:LargeLanguageModel>\"),\n    (\"<ex:DeepSeek>\", \"<ex:developedBy>\", \"<ex:DeepSeekAI>\"),\n    (\"<ex:LargeLanguageModel>\", \"<rdfs:subClassOf>\", \"<ex:AIModel>\")\n]\n\ndef query_sparql_mock(triples, subject=None, predicate=None):\n    results = []\n    for s, p, o in triples:\n        match_s = (subject is None or s == subject)\n        match_p = (predicate is None or p == predicate)\n        if match_s and match_p:\n            results.append(o)\n    return results\n\ndeveloper = query_sparql_mock(rdf_triples, subject=\"<ex:DeepSeek>\", predicate=\"<ex:developedBy>\")\nprint(\"Hasil Query SPARQL mock untuk developer DeepSeek:\", developer)",
      }],
    },
    {
      id: "kr-sec-6",
      title: "BAB 6: Knowledge Graph",
      orderIndex: 6,
      isCompleted: false,
      description: "Konsep Knowledge Graph enterprise, konstruksi Knowledge Graph dari data tidak terstruktur (Named Entity Recognition + Relation Extraction), dan Knowledge Graph Embedding.",
      codeSnippets: [{
        id: "kr-snip-6",
        language: "python",
        caption: "kg_construction_pipeline.py",
        code: "import re\n\nraw_corpus = \"Alan Turing created the Turing Machine in 1936 at Cambridge.\"\n\ndef mock_ie_pipeline(text):\n    # Ekstraksi entitas & relasi berbasis pola teratur\n    triples = []\n    if \"Turing Machine\" in text and \"Alan Turing\" in text:\n        triples.append((\"Alan Turing\", \"created\", \"Turing Machine\"))\n    if \"Cambridge\" in text:\n        triples.append((\"Alan Turing\", \"associated_with\", \"Cambridge\"))\n    return triples\n\ntriples = mock_ie_pipeline(raw_corpus)\nprint(\"Diekstrak ke Knowledge Graph Triples:\")\nfor t in triples:\n    print(f\"[{t[0]}] ---({t[1]})---> [{t[2]}]\")",
      }],
    },
    {
      id: "kr-sec-7",
      title: "BAB 7: Penalaran atas Pengetahuan",
      orderIndex: 7,
      isCompleted: false,
      description: "Reasoning dengan Deskripsi Logika (Tableaux algorithm), Non-Monotonic Reasoning (penarikan kesimpulan saat ada informasi baru yang membatalkan asumsi), dan Default Reasoning.",
      codeSnippets: [{
        id: "kr-snip-7",
        language: "python",
        caption: "non_monotonic_reasoning.py",
        code: "class NonMonotonicKB:\n    def __init__(self):\n        self.birds = set()\n        self.penguins = set()\n\n    def add_bird(self, name): self.birds.add(name)\n    def add_penguin(self, name):\n        self.birds.add(name)\n        self.penguins.add(name)\n\n    def can_fly(self, name):\n        if name in self.penguins:\n            return False # Pengecualian membatalkan aturan umum\n        return name in self.birds\n\nkb = NonMonotonicKB()\nkb.add_bird(\"Tweety\")\nkb.add_penguin(\"Tux\")\n\nprint(f\"Dapatkah Tweety terbang? {kb.can_fly('Tweety')}\")\nprint(f\"Dapatkah Tux terbang? {kb.can_fly('Tux')}\")",
      }],
    },
    {
      id: "kr-sec-8",
      title: "BAB 8: Integrasi Knowledge Graph dengan LLM",
      orderIndex: 8,
      isCompleted: false,
      description: "GraphRAG, Knowledge-Grounded Generation untuk memitigasi halusinasi, dan multi-hop graph exploration untuk penalaran faktual pada model bahasa besar.",
      codeSnippets: [{
        id: "kr-snip-8",
        language: "python",
        caption: "multi_hop_graph_reasoning.py",
        code: "graph = {\n    \"Einstein\": [\"Theory of Relativity\", \"Princeton\"],\n    \"Theory of Relativity\": [\"Modern Physics\", \"Nobel Prize\"],\n    \"Modern Physics\": [\"Quantum Mechanics\"]\n}\n\ndef find_reasoning_path(start, target, path=None):\n    if path is None: path = [start]\n    if start == target: return path\n    for neighbor in graph.get(start, []):\n        if neighbor not in path:\n            res = find_reasoning_path(neighbor, target, path + [neighbor])\n            if res: return res\n    return None\n\npath = find_reasoning_path(\"Einstein\", \"Quantum Mechanics\")\nprint(\"Multi-hop Reasoning Path untuk Grounded LLM:\", \" -> \".join(path))",
      }],
    },
    {
      id: "kr-sec-9",
      title: "BAB 9: Graph Database",
      orderIndex: 9,
      isCompleted: false,
      description: "Arsitektur Neo4j dan model Labeled Property Graph (LPG), bahasa query Cypher (MATCH, WHERE, RETURN), serta perbandingan mendalam performa Graph DB vs Relational DB.",
      codeSnippets: [{
        id: "kr-snip-9",
        language: "python",
        caption: "cypher_query_builder.py",
        code: "def build_cypher_query(start_person, relation_type, max_depth=2):\n    return (\n        f\"MATCH (p:Person {{name: '{start_person}'}})\"\n        f\"-[:{relation_type}*1..{max_depth}]->(target:Person)\\n\"\n        f\"WHERE target.active = true\\n\"\n        f\"RETURN p.name, target.name, count(*) AS paths\"\n    )\n\nquery = build_cypher_query(\"Alice\", \"FRIENDS_WITH\", max_depth=2)\nprint(\"[Contoh Query Cypher Neo4j]:\\n\" + query)",
      }],
    },
    {
      id: "kr-sec-10",
      title: "BAB 10: Aplikasi Knowledge Representation",
      orderIndex: 10,
      isCompleted: false,
      description: "Sistem pencarian semantik perusahaan, Knowledge Base Question Answering (KBQA), serta integrasi Knowledge Representation dengan Expert System dan automated compliance.",
      codeSnippets: [{
        id: "kr-snip-10",
        language: "python",
        caption: "kbqa_matcher_demo.py",
        code: "kb_data = {\n    (\"indonesia\", \"ibukota\"): \"Nusantara (IKN)\",\n    (\"jepang\", \"ibukota\"): \"Tokyo\",\n    (\"python\", \"kreator\"): \"Guido van Rossum\"\n}\n\ndef answer_question(user_query):\n    q = user_query.lower()\n    for (entity, prop), answer in kb_data.items():\n        if entity in q and prop in q:\n            return f\"Berdasarkan Knowledge Graph: {prop.capitalize()} dari {entity.capitalize()} adalah {answer}.\"\n    return \"Jawaban tidak ditemukan dalam basis pengetahuan.\"\n\nprint(answer_question(\"Siapakah kreator dari bahasa Python?\"))\nprint(answer_question(\"Apa ibukota dari Indonesia saat ini?\"))",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Large Language Model (15 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getLargeLanguageModelSections(): ModuleSection[] {
  return [
    {
      id: "llm-sec-1",
      title: "BAB 1: Fondasi Large Language Model",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi & karakteristik LLM (skala parameter miliaran, in-context learning, emergent abilities), dan sejarah evolusi dari model bahasa n-gram ke LLM modern.",
      codeSnippets: [{
        id: "llm-snip-1",
        language: "python",
        caption: "temperature_sampling.py",
        code: "import numpy as np\n\ndef sample_with_temperature(logits, temperature=1.0):\n    logits = np.array(logits) / max(temperature, 1e-5)\n    exp_logits = np.exp(logits - np.max(logits))\n    probs = exp_logits / np.sum(exp_logits)\n    return probs\n\nraw_logits = [2.0, 1.0, 0.1, -1.5]\nvocab = [\"AI\", \"Robot\", \"Algoritma\", \"Batu\"]\n\nprint(\"Probabilitas Temp 0.2 (Konservatif/Faktual):\", np.round(sample_with_temperature(raw_logits, 0.2), 3))\nprint(\"Probabilitas Temp 1.0 (Standar):\", np.round(sample_with_temperature(raw_logits, 1.0), 3))\nprint(\"Probabilitas Temp 1.8 (Kreatif/Divergen):\", np.round(sample_with_temperature(raw_logits, 1.8), 3))",
      }],
    },
    {
      id: "llm-sec-2",
      title: "BAB 2: Arsitektur Transformer untuk LLM",
      orderIndex: 2,
      isCompleted: false,
      description: "Self-Attention & Multi-Head Attention, keunggulan Decoder-Only dibandingkan Encoder-Decoder pada generative scaling, serta Positional Encoding (RoPE & ALiBi).",
      codeSnippets: [{
        id: "llm-snip-2",
        language: "python",
        caption: "rope_embedding_demo.py",
        code: "import numpy as np\n\ndef rotary_position_embedding(x, seq_pos, dim=4):\n    angles = seq_pos / (10000 ** (np.arange(0, dim, 2) / dim))\n    sin_val = np.sin(angles)\n    cos_val = np.cos(angles)\n    \n    x1, x2 = x[0::2], x[1::2]\n    rotated_x1 = x1 * cos_val - x2 * sin_val\n    rotated_x2 = x1 * sin_val + x2 * cos_val\n    \n    res = np.empty_like(x)\n    res[0::2] = rotated_x1\n    res[1::2] = rotated_x2\n    return res\n\nvec = np.array([1.0, 0.0, 1.0, 0.0])\nprint(\"Vektor Awal:\", vec)\nprint(\"Vektor setelah RoPE Posisi 1:\", rotary_position_embedding(vec, seq_pos=1))\nprint(\"Vektor setelah RoPE Posisi 10:\", rotary_position_embedding(vec, seq_pos=10))",
      }],
    },
    {
      id: "llm-sec-3",
      title: "BAB 3: Pretraining LLM & Scaling Law",
      orderIndex: 3,
      isCompleted: false,
      description: "Data pretraining, subword tokenization (BPE, SentencePiece), objective function Next Token Prediction (Cross-Entropy loss), dan Chinchilla Scaling Law.",
      codeSnippets: [{
        id: "llm-snip-3",
        language: "python",
        caption: "chinchilla_scaling_law.py",
        code: "def calculate_chinchilla_optimal(compute_flops):\n    N = (compute_flops / 120.0) ** 0.5\n    D = 20 * N\n    return N, D\n\nflops = 1e23\nparams, tokens = calculate_chinchilla_optimal(flops)\nprint(f\"Compute Budget: {flops:.1e} FLOPs\")\nprint(f\"Ukuran Model Optimal: {params / 1e9:.2f} Miliar Parameter\")\nprint(f\"Jumlah Token Optimal: {tokens / 1e9:.2f} Miliar Token\")",
      }],
    },
    {
      id: "llm-sec-4",
      title: "BAB 4: Data untuk LLM",
      orderIndex: 4,
      isCompleted: false,
      description: "Kurasi dataset skala besar (Common Crawl, code, books), synthetic data generation (Self-Instruct, UltraFeedback), serta filtering & deduplication dengan MinHash LSH.",
      codeSnippets: [{
        id: "llm-snip-4",
        language: "python",
        caption: "text_deduplication_minhash.py",
        code: "def get_shingles(text, k=3):\n    return set([text[i:i+k] for i in range(len(text) - k + 1)])\n\ndef jaccard_similarity(set_a, set_b):\n    intersection = len(set_a.intersection(set_b))\n    union = len(set_a.union(set_b))\n    return intersection / union if union > 0 else 0.0\n\ndoc1 = \"Model bahasa besar dilatih dengan ribuan GPU.\"\ndoc2 = \"Model bahasa besar dilatih dengan ribuan GPU canggih.\"\n\ns1 = get_shingles(doc1, k=3)\ns2 = get_shingles(doc2, k=3)\nsim = jaccard_similarity(s1, s2)\nprint(f\"Jaccard Similarity Dokumen: {sim:.4f}\")\nprint(\"Status Deduplikasi:\", \"Duplikat dibuang!\" if sim > 0.8 else \"Dokumen unik disimpan.\")",
      }],
    },
    {
      id: "llm-sec-5",
      title: "BAB 5: Fine-Tuning & Adaptasi Model",
      orderIndex: 5,
      isCompleted: false,
      description: "Full Fine-Tuning vs Parameter-Efficient Fine-Tuning (PEFT), matematika dekomposisi rank rendah LoRA (W = W0 + B*A), QLoRA (NF4 quantization), dan Instruction Tuning.",
      codeSnippets: [{
        id: "llm-snip-5",
        language: "python",
        caption: "lora_low_rank_decomposition.py",
        code: "import numpy as np\n\nd_in, d_out = 4096, 4096\nrank = 8\nalpha = 16\n\nW0_param_count = d_in * d_out\nlora_param_count = (d_in * rank) + (rank * d_out)\n\nprint(f\"Parameter Matriks Penuh W0: {W0_param_count:,}\")\nprint(f\"Parameter LoRA (Rank {rank}): {lora_param_count:,}\")\nprint(f\"Penghematan Parameter: {100 * (1 - lora_param_count / W0_param_count):.2f}%\")",
      }],
    },
    {
      id: "llm-sec-6",
      title: "BAB 6: Alignment Model",
      orderIndex: 6,
      isCompleted: false,
      description: "Penyelarasan etika dan instruksi: Reinforcement Learning from Human Feedback (RLHF dengan PPO), Direct Preference Optimization (DPO), serta Constitutional AI & RLAIF.",
      codeSnippets: [{
        id: "llm-snip-6",
        language: "python",
        caption: "dpo_loss_formula.py",
        code: "import numpy as np\n\ndef sigmoid(x):\n    return 1.0 / (1.0 + np.exp(-x))\n\ndef calculate_dpo_loss(logprob_pi_win, logprob_ref_win, logprob_pi_lose, logprob_ref_lose, beta=0.1):\n    log_ratio_win = logprob_pi_win - logprob_ref_win\n    log_ratio_lose = logprob_pi_lose - logprob_ref_lose\n    diff = beta * (log_ratio_win - log_ratio_lose)\n    loss = -np.log(sigmoid(diff) + 1e-10)\n    return loss\n\nloss = calculate_dpo_loss(logprob_pi_win=-0.5, logprob_ref_win=-1.2, \n                          logprob_pi_lose=-2.0, logprob_ref_lose=-1.5, beta=0.1)\nprint(f\"DPO (Direct Preference Optimization) Loss: {loss:.4f}\")",
      }],
    },
    {
      id: "llm-sec-7",
      title: "BAB 7: Prompt Engineering & In-Context Learning",
      orderIndex: 7,
      isCompleted: false,
      description: "Zero-shot & few-shot prompting, Chain-of-Thought (CoT) prompting, Self-Consistency, dan framework otomatisasi prompt optimization (DSPy).",
      codeSnippets: [{
        id: "llm-snip-7",
        language: "python",
        caption: "cot_prompt_template.py",
        code: "few_shot_cot_template = \"\"\"Q: Roger punya 5 bola tenis. Dia membeli 2 kaleng berisi masing-masing 3 bola. Berapa total bola tenis Roger sekarang?\nA: Roger awalnya punya 5 bola. 2 kaleng x 3 bola = 6 bola baru. Jadi 5 + 6 = 11 bola tenis. Jawabannya 11.\n\nQ: Toko buku memiliki 20 buku. Setengahnya terjual di pagi hari, lalu 5 buku datang sebagai stok baru di sore hari. Berapa buku sekarang?\nA:\"\"\"\n\nprint(\"[Prompt Berbasis Chain-of-Thought]:\")\nprint(few_shot_cot_template)",
      }],
    },
    {
      id: "llm-sec-8",
      title: "BAB 8: Retrieval-Augmented Generation (RAG)",
      orderIndex: 8,
      isCompleted: false,
      description: "Arsitektur RAG komprehensif: strategi chunking dokumen, vector database & indexing HNSW, similarity search, reranking (Cross-Encoder), dan context augmentation.",
      codeSnippets: [{
        id: "llm-snip-8",
        language: "python",
        caption: "simple_rag_pipeline.py",
        code: "import numpy as np\n\nchunks = [\n    \"Velqora adalah platform belajar cerdas berbasis kurikulum AI komprehensif.\",\n    \"Python dirancang oleh Guido van Rossum dan dirilis pertama kali tahun 1991.\",\n    \"HNSW adalah algoritma indexing graf untuk pencarian ANN dalam database vektor.\"\n]\n\ndef mock_embed(text):\n    return np.array([float('ai' in text.lower()), float('belajar' in text.lower()), float('vektor' in text.lower())])\n\ndb_embeddings = np.array([mock_embed(c) for c in chunks])\nquery = \"Bagaimana platform belajar AI bekerja?\"\nq_emb = mock_embed(query)\n\nscores = np.dot(db_embeddings, q_emb)\nbest_idx = np.argmax(scores)\n\nprint(f\"Query: '{query}'\")\nprint(f\"Top Retrieved Context: '{chunks[best_idx]}' (Score: {scores[best_idx]})\")",
      }],
    },
    {
      id: "llm-sec-9",
      title: "BAB 9: Reasoning & Test-Time Compute",
      orderIndex: 9,
      isCompleted: false,
      description: "Model penalaran (Reasoning Models, System 2 Thinking), Tree of Thought (ToT), self-verification, dan alokasi komputasi waktu inferensi (test-time compute).",
      codeSnippets: [{
        id: "llm-snip-9",
        language: "python",
        caption: "test_time_compute_tot.py",
        code: "def evaluate_candidate_thought(thought):\n    if \"verifikasi\" in thought or \"analisis\" in thought:\n        return 0.95\n    return 0.60\n\nthoughts = [\n    \"Langkah 1: Langsung tebak jawaban akhir tanpa bukti.\",\n    \"Langkah 1: Lakukan analisis langkah demi langkah dan verifikasi asumsi dasar.\"\n]\n\nscored = [(t, evaluate_candidate_thought(t)) for t in thoughts]\nbest_thought = max(scored, key=lambda x: x[1])\n\nprint(\"Seleksi Jalur Berpikir Terbaik (Tree of Thought):\")\nprint(f\"Pilihan: {best_thought[0]} (Skor Evaluasi: {best_thought[1]})\")",
      }],
    },
    {
      id: "llm-sec-10",
      title: "BAB 10: Efisiensi & Optimisasi LLM",
      orderIndex: 10,
      isCompleted: false,
      description: "Teknik kuantisasi (GPTQ, AWQ, GGUF), Model Distillation, Mixture of Experts (MoE routing), dan akselerasi inferensi (Speculative Decoding, KV Cache management).",
      codeSnippets: [{
        id: "llm-snip-10",
        language: "python",
        caption: "moe_router_dispatch.py",
        code: "import numpy as np\n\ndef moe_top_k_routing(token_repr, router_weights, top_k=2):\n    logits = np.dot(token_repr, router_weights)\n    top_indices = np.argsort(logits)[-top_k:][::-1]\n    \n    top_logits = logits[top_indices]\n    exp_l = np.exp(top_logits - np.max(top_logits))\n    weights = exp_l / np.sum(exp_l)\n    return top_indices, weights\n\ntoken_emb = np.array([0.5, -0.2, 1.1])\nW_router = np.random.randn(3, 8)\n\nexperts, routing_weights = moe_top_k_routing(token_emb, W_router, top_k=2)\nprint(f\"Dipetakan ke Expert Index: {experts}\")\nprint(f\"Bobot Kontribusi Expert: {np.round(routing_weights, 4)}\")",
      }],
    },
    {
      id: "llm-sec-11",
      title: "BAB 11: Model Merging & Composition",
      orderIndex: 11,
      isCompleted: false,
      description: "Metode penggabungan bobot model LLM tanpa retraining: Spherical Linear Interpolation (SLERP), TIES-Merging, DARE, dan arsitektur komposisi multi-model.",
      codeSnippets: [{
        id: "llm-snip-11",
        language: "python",
        caption: "slerp_weight_interpolation.py",
        code: "import numpy as np\n\ndef slerp(v0, v1, t):\n    v0_norm = v0 / np.linalg.norm(v0)\n    v1_norm = v1 / np.linalg.norm(v1)\n    dot = np.dot(v0_norm, v1_norm)\n    \n    dot = np.clip(dot, -1.0, 1.0)\n    theta = np.arccos(dot)\n    \n    sin_theta = np.sin(theta)\n    if sin_theta < 1e-6:\n        return (1 - t) * v0 + t * v1\n    \n    w0 = np.sin((1 - t) * theta) / sin_theta\n    w1 = np.sin(t * theta) / sin_theta\n    return w0 * v0 + w1 * v1\n\nw_model_a = np.array([1.0, 0.5, 0.0])\nw_model_b = np.array([0.0, 0.5, 1.0])\nw_merged = slerp(w_model_a, w_model_b, t=0.5)\n\nprint(\"Bobot Model A:\", w_model_a)\nprint(\"Bobot Model B:\", w_model_b)\nprint(\"Bobot Hasil Merge SLERP (t=0.5):\", np.round(w_merged, 4))",
      }],
    },
    {
      id: "llm-sec-12",
      title: "BAB 12: Evaluasi LLM",
      orderIndex: 12,
      isCompleted: false,
      description: "Benchmark standar (MMLU, HumanEval, GSM8k, MT-Bench), deteksi halusinasi, metriks factual correctness, evaluasi keamanan, red teaming, dan jailbreak resistance.",
      codeSnippets: [{
        id: "llm-snip-12",
        language: "python",
        caption: "llm_as_a_judge.py",
        code: "def format_judge_prompt(question, reference_ans, candidate_ans):\n    return f\"\"\"[Evaluator Mode]\nPertanyaan: {question}\nKunci Jawaban: {reference_ans}\nJawaban Model: {candidate_ans}\n\nKriteria Penilaian:\n1. Ketepatan Faktual (1-5)\n2. Kelengkapan Penjelasan (1-5)\n3. Kejelasan Bahasa (1-5)\nBerikan skor total (1-15) dan justifikasi singkat.\"\"\"\n\nprompt = format_judge_prompt(\n    \"Apa fungsi dari Transformer Attention?\",\n    \"Memetakan relasi antar token dalam sekuens secara paralel.\",\n    \"Attention memungkinkan token memperhatikan token lain secara kontekstual.\"\n)\nprint(\"[Contoh Prompt LLM-as-a-Judge]:\\n\" + prompt)",
      }],
    },
    {
      id: "llm-sec-13",
      title: "BAB 13: Deployment LLM",
      orderIndex: 13,
      isCompleted: false,
      description: "Infrastruktur serving LLM berkinerja tinggi (vLLM, TGI), algoritma manajemen memori PagedAttention, KV-cache sizing, streaming responses, dan cost optimization.",
      codeSnippets: [{
        id: "llm-snip-13",
        language: "python",
        caption: "vram_kv_cache_estimator.py",
        code: "def calculate_vram_requirement(params_billion, precision_bits=16, context_length=4096, batch_size=1):\n    bytes_per_param = precision_bits / 8.0\n    weight_memory_gb = (params_billion * 1e9 * bytes_per_param) / (1024**3)\n    kv_cache_gb = (batch_size * context_length * 2 * 32 * 128 * bytes_per_param) / (1024**3)\n    total_gb = weight_memory_gb + kv_cache_gb + 2.0\n    return weight_memory_gb, kv_cache_gb, total_gb\n\nw_mem, kv_mem, total = calculate_vram_requirement(params_billion=8, precision_bits=16, context_length=4096)\nprint(f\"Memori Bobot Model (8B FP16): {w_mem:.2f} GB\")\nprint(f\"Memori KV Cache (4k Context): {kv_mem:.2f} GB\")\nprint(f\"Total VRAM Minimum: {total:.2f} GB (Cocok untuk GPU 24GB)\")",
      }],
    },
    {
      id: "llm-sec-14",
      title: "BAB 14: Multimodal & Long-Context LLM",
      orderIndex: 14,
      isCompleted: false,
      description: "Arsitektur Vision-Language Models (VLM: CLIP, Perceiver, MLP projection), audio processing integration, dan scaling panjang konteks hingga jutaan token (YaRN, LongLoRA).",
      codeSnippets: [{
        id: "llm-snip-14",
        language: "python",
        caption: "vlm_projection_pipeline.py",
        code: "import numpy as np\n\nvision_patch_dim = 768\nllm_embedding_dim = 4096\n\nW_vision_proj = np.random.randn(vision_patch_dim, llm_embedding_dim) * 0.02\nimage_features = np.random.randn(49, vision_patch_dim)\n\nvisual_tokens = image_features @ W_vision_proj\n\nprint(f\"Bentuk Fitur Visual Awal: {image_features.shape}\")\nprint(f\"Bentuk Visual Tokens yang siap disambung ke Prompt Teks LLM: {visual_tokens.shape}\")",
      }],
    },
    {
      id: "llm-sec-15",
      title: "BAB 15: Ekosistem LLM",
      orderIndex: 15,
      isCompleted: false,
      description: "Perbandingan lanskap model Open Source (Llama 3, Mistral, DeepSeek) vs Closed Source (GPT-4o, Claude 3.5), ekosistem tooling pengembang, dan tren masa depan LLM.",
      codeSnippets: [{
        id: "llm-snip-15",
        language: "python",
        caption: "unified_llm_client.py",
        code: "class UnifiedLLMClient:\n    def __init__(self, provider=\"ollama\", model=\"llama3:8b\"):\n        self.provider = provider\n        self.model = model\n\n    def generate(self, prompt):\n        print(f\"[{self.provider.upper()}] Memproses prompt dengan model: {self.model}\")\n        return f\"Jawaban cerdas untuk prompt: '{prompt[:30]}...'\"\n\nclient_local = UnifiedLLMClient(provider=\"ollama\", model=\"deepseek-r1:8b\")\nclient_cloud = UnifiedLLMClient(provider=\"openai\", model=\"gpt-4o\")\n\nprint(client_local.generate(\"Jelaskan masa depan AI di era multimodal.\"))\nprint(client_cloud.generate(\"Jelaskan masa depan AI di era multimodal.\"))",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Machine Learning (22 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getMachineLearningSections(): ModuleSection[] {
  return [
    {
      id: "ml-sec-1",
      title: "BAB 1: Fondasi Matematika & Pemrograman",
      orderIndex: 1,
      isCompleted: false,
      description: "Aljabar Linear (vektor, matriks, rank), kalkulus diferensial multivariabel (gradien, chain rule), probabilitas & statistika, serta pustaka komputasi Python (NumPy, Pandas, Matplotlib).",
      codeSnippets: [{
        id: "ml-snip-1",
        language: "python",
        caption: "gradient_descent_fundamentals.py",
        code: "import numpy as np\n\nw = 0.0\nlr = 0.1\nfor epoch in range(25):\n    gradient = 2 * (w - 4)\n    w = w - lr * gradient\n\nprint(f\"Bobot Optimal Konvergen w: {w:.4f} (Target Asli: 4.0)\")",
      }],
    },
    {
      id: "ml-sec-2",
      title: "BAB 2: Dasar-Dasar Data",
      orderIndex: 2,
      isCompleted: false,
      description: "Data cleaning, Exploratory Data Analysis (EDA), rekayasa fitur (feature engineering & scaling), penanganan missing values & imbalanced data (SMOTE), dan paradigma Data-Centric AI.",
      codeSnippets: [{
        id: "ml-snip-2",
        language: "python",
        caption: "data_preprocessing_pipeline.py",
        code: "import numpy as np\nfrom sklearn.preprocessing import RobustScaler\nfrom sklearn.impute import SimpleImputer\n\nraw_data = np.array([[10.0, np.nan], [12.0, 300.0], [9.0, 310.0], [100.0, 290.0]])\n\nimputer = SimpleImputer(strategy='median')\ncleaned_data = imputer.fit_transform(raw_data)\n\nscaler = RobustScaler()\nscaled_data = scaler.fit_transform(cleaned_data)\n\nprint(\"Data Bersih & diskalakan:\\n\", np.round(scaled_data, 3))",
      }],
    },
    {
      id: "ml-sec-3",
      title: "BAB 3: Konsep Inti Machine Learning",
      orderIndex: 3,
      isCompleted: false,
      description: "Supervised vs Unsupervised vs Reinforcement Learning, Bias-Variance Tradeoff, pencegahan overfitting/underfitting, Cross-Validation, regularisasi (L1, L2, Elastic Net), dan Hyperparameter Tuning.",
      codeSnippets: [{
        id: "ml-snip-3",
        language: "python",
        caption: "bias_variance_cv.py",
        code: "from sklearn.model_selection import KFold\nimport numpy as np\n\nX = np.arange(20).reshape(10, 2)\ny = np.array([0, 1] * 5)\n\nkf = KFold(n_splits=5, shuffle=True, random_state=42)\nfor fold, (train_idx, val_idx) in enumerate(kf.split(X)):\n    print(f\"Fold {fold+1}: Train size = {len(train_idx)}, Val size = {len(val_idx)}\")",
      }],
    },
    {
      id: "ml-sec-4",
      title: "BAB 4: Probabilistic & Bayesian Machine Learning",
      orderIndex: 4,
      isCompleted: false,
      description: "Inferensi Bayesian (Prior, Likelihood, Posterior), Gaussian Process untuk regresi non-parametrik, Bayesian Optimization untuk tuning hyperparameter cerdas, dan Naive Bayes lanjutan.",
      codeSnippets: [{
        id: "ml-snip-4",
        language: "python",
        caption: "bayesian_update_demo.py",
        code: "prior = 0.5\nlikelihood_head = 0.8\nlikelihood_tail = 0.2\n\np_evidence = (prior * likelihood_head) + ((1 - prior) * 0.5)\nposterior = (prior * likelihood_head) / p_evidence\n\nprint(f\"Prior Probabilitas: {prior:.2f}\")\nprint(f\"Posterior Probabilitas setelah 1 Head: {posterior:.4f}\")",
      }],
    },
    {
      id: "ml-sec-5",
      title: "BAB 5: Supervised Learning - Regresi",
      orderIndex: 5,
      isCompleted: false,
      description: "Linear & Polynomial Regression, Ridge Regression (L2 penalty), Lasso Regression (L1 feature selection), Elastic Net, serta Support Vector Regression (SVR).",
      codeSnippets: [{
        id: "ml-snip-5",
        language: "python",
        caption: "regularized_regression_comparison.py",
        code: "from sklearn.linear_model import Ridge, Lasso\nimport numpy as np\n\nX = np.array([[1, 2], [2, 4], [3, 6], [4, 8]])\ny = np.array([2.1, 3.9, 6.1, 7.9])\n\nridge = Ridge(alpha=1.0).fit(X, y)\nlasso = Lasso(alpha=0.1).fit(X, y)\n\nprint(\"Koefisien Ridge (L2 menyusutkan bobot):\", ridge.coef_)\nprint(\"Koefisien Lasso (L1 membuat fitur 0):\", lasso.coef_)",
      }],
    },
    {
      id: "ml-sec-6",
      title: "BAB 6: Supervised Learning - Klasifikasi",
      orderIndex: 6,
      isCompleted: false,
      description: "Algoritma klasifikasi komprehensif: Logistic Regression, K-Nearest Neighbors (KNN), Decision Tree, Random Forest, Support Vector Machine (SVM), serta Gradient Boosted Trees (XGBoost, LightGBM, CatBoost).",
      codeSnippets: [{
        id: "ml-snip-6",
        language: "python",
        caption: "gradient_boosting_demo.py",
        code: "from sklearn.ensemble import GradientBoostingClassifier\nimport numpy as np\n\nX = np.array([[1.5, 2.0], [2.0, 1.8], [0.5, 0.4], [0.2, 0.8]])\ny = np.array([1, 1, 0, 0])\n\nclf = GradientBoostingClassifier(n_estimators=10, random_state=42)\nclf.fit(X, y)\npred = clf.predict([[1.8, 1.9]])\nprob = clf.predict_proba([[1.8, 1.9]])[0]\n\nprint(f\"Prediksi Kelas: {pred[0]} dengan Keyakinan: {prob[pred[0]] * 100:.1f}%\")",
      }],
    },
    {
      id: "ml-sec-7",
      title: "BAB 7: Unsupervised Learning",
      orderIndex: 7,
      isCompleted: false,
      description: "K-Means & Hierarchical Clustering, DBSCAN untuk kluster arbitrary shape, Gaussian Mixture Model (GMM), reduksi dimensi (PCA, t-SNE, UMAP), Association Rules, dan Anomaly Detection.",
      codeSnippets: [{
        id: "ml-snip-7",
        language: "python",
        caption: "pca_clustering_pipeline.py",
        code: "from sklearn.decomposition import PCA\nfrom sklearn.cluster import KMeans\nimport numpy as np\n\ndata = np.random.randn(50, 6)\npca = PCA(n_components=2)\nreduced_data = pca.fit_transform(data)\n\nkmeans = KMeans(n_clusters=3, random_state=42, n_init='auto')\nlabels = kmeans.fit_predict(reduced_data)\n\nprint(f\"Rasio Varian Terjelaskan PCA 2D: {np.sum(pca.explained_variance_ratio_) * 100:.2f}%\")\nprint(f\"Distribusi Kluster: {np.bincount(labels)}\")",
      }],
    },
    {
      id: "ml-sec-8",
      title: "BAB 8: Online & Continual Learning",
      orderIndex: 8,
      isCompleted: false,
      description: "Konsep Online Learning untuk streaming data, Incremental Learning dengan partial_fit, mitigasi Catastrophic Forgetting, dan Experience Replay.",
      codeSnippets: [{
        id: "ml-snip-8",
        language: "python",
        caption: "streaming_partial_fit.py",
        code: "from sklearn.linear_model import SGDClassifier\nimport numpy as np\n\nclf = SGDClassifier(loss='log_loss', random_state=42)\nclasses = np.array([0, 1])\n\nX_batch1 = np.array([[1.0, 1.2], [0.8, 0.9], [-1.0, -0.8], [-1.2, -1.1]])\ny_batch1 = np.array([1, 1, 0, 0])\nclf.partial_fit(X_batch1, y_batch1, classes=classes)\n\nX_batch2 = np.array([[1.5, 1.6], [-0.9, -1.0]])\ny_batch2 = np.array([1, 0])\nclf.partial_fit(X_batch2, y_batch2)\n\nprint(\"Skor Akurasi Online Model:\", clf.score(X_batch2, y_batch2))",
      }],
    },
    {
      id: "ml-sec-9",
      title: "BAB 9: Evaluasi & Validasi Model",
      orderIndex: 9,
      isCompleted: false,
      description: "Metrik regresi (MAE, MSE, RMSE, R2), metrik klasifikasi (Precision, Recall, F1-Score, ROC-AUC), Confusion Matrix, kalibrasi probabilitas, dan protokol pengujian A/B testing.",
      codeSnippets: [{
        id: "ml-snip-9",
        language: "python",
        caption: "classification_evaluation_metrics.py",
        code: "from sklearn.metrics import confusion_matrix, roc_auc_score\nimport numpy as np\n\ny_true = np.array([0, 0, 1, 1, 1, 0, 1, 0])\ny_pred = np.array([0, 0, 1, 1, 0, 0, 1, 1])\ny_prob = np.array([0.1, 0.2, 0.9, 0.8, 0.4, 0.3, 0.85, 0.7])\n\nprint(\"Confusion Matrix:\\n\", confusion_matrix(y_true, y_pred))\nprint(f\"ROC-AUC Score: {roc_auc_score(y_true, y_prob):.4f}\")",
      }],
    },
    {
      id: "ml-sec-10",
      title: "BAB 10: Ensemble Learning",
      orderIndex: 10,
      isCompleted: false,
      description: "Teknik ensembling mutakhir: Bagging, Boosting (AdaBoost, Gradient Boosting), Stacking dengan meta-learner kustom, dan Soft/Hard Voting Classifier.",
      codeSnippets: [{
        id: "ml-snip-10",
        language: "python",
        caption: "stacking_ensemble_demo.py",
        code: "from sklearn.ensemble import StackingClassifier, RandomForestClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.neighbors import KNeighborsClassifier\nimport numpy as np\n\nbase_estimators = [\n    ('rf', RandomForestClassifier(n_estimators=10, random_state=42)),\n    ('knn', KNeighborsClassifier(n_neighbors=3))\n]\nstack = StackingClassifier(estimators=base_estimators, final_estimator=LogisticRegression())\n\nX = np.random.randn(30, 4)\ny = np.random.randint(0, 2, size=30)\nstack.fit(X, y)\n\nprint(\"Stacking Model berhasil dilatih dengan Meta-Learner Logistic Regression.\")",
      }],
    },
    {
      id: "ml-sec-11",
      title: "BAB 11: Interpretability Model Machine Learning",
      orderIndex: 11,
      isCompleted: false,
      description: "Interpretabilitas model kotak hitam: Feature Importance (Mean Decrease Impurity vs Permutation Importance), Partial Dependence Plot (PDP), dan SHAP & LIME untuk model klasik.",
      codeSnippets: [{
        id: "ml-snip-11",
        language: "python",
        caption: "permutation_feature_importance.py",
        code: "from sklearn.inspection import permutation_importance\nfrom sklearn.ensemble import RandomForestClassifier\nimport numpy as np\n\nX = np.random.randn(40, 3)\ny = np.random.randint(0, 2, size=40)\nclf = RandomForestClassifier(random_state=42).fit(X, y)\n\nresult = permutation_importance(clf, X, y, n_repeats=5, random_state=42)\nfor i in range(X.shape[1]):\n    print(f\"Fitur {i}: Importance Mean = {result.importances_mean[i]:.4f}\")",
      }],
    },
    {
      id: "ml-sec-12",
      title: "BAB 12: Dasar Deep Learning",
      orderIndex: 12,
      isCompleted: false,
      description: "Transisi dari ML ke Deep Learning: Perceptron & Multi-Layer Perceptron (MLP), fungsi aktivasi non-linear, Backpropagation dengan optimizers (SGD, Adam), Batch Normalization, dan Dropout.",
      codeSnippets: [{
        id: "ml-snip-12",
        language: "python",
        caption: "simple_mlp_pytorch.py",
        code: "import torch\nimport torch.nn as nn\n\nclass SimpleMLP(nn.Module):\n    def __init__(self, in_features, hidden_dim, out_classes):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(in_features, hidden_dim),\n            nn.BatchNorm1d(hidden_dim),\n            nn.ReLU(),\n            nn.Dropout(0.2),\n            nn.Linear(hidden_dim, out_classes)\n        )\n    def forward(self, x):\n        return self.net(x)\n\nmodel = SimpleMLP(in_features=10, hidden_dim=32, out_classes=2)\ndummy_x = torch.randn(4, 10)\nout = model(dummy_x)\nprint(\"Output logits MLP:\", out.shape)",
      }],
    },
    {
      id: "ml-sec-13",
      title: "BAB 13: Computer Vision",
      orderIndex: 13,
      isCompleted: false,
      description: "Convolutional Neural Network (CNN), arsitektur modern (ResNet, EfficientNet), Transfer Learning, Object Detection (YOLO), Segmentasi Citra (U-Net), dan Vision Transformer (ViT).",
      codeSnippets: [{
        id: "ml-snip-13",
        language: "python",
        caption: "conv2d_feature_map.py",
        code: "import torch\nimport torch.nn as nn\n\nconv = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1)\npool = nn.MaxPool2d(kernel_size=2, stride=2)\n\ndummy_img = torch.randn(1, 3, 64, 64)\nfeat = pool(conv(dummy_img))\n\nprint(f\"Dimensi Input Citra: {dummy_img.shape}\")\nprint(f\"Dimensi Feature Map setelah Conv & Pooling: {feat.shape}\")",
      }],
    },
    {
      id: "ml-sec-14",
      title: "BAB 14: Natural Language Processing",
      orderIndex: 14,
      isCompleted: false,
      description: "Text preprocessing & tokenization, word embeddings, pemodelan sekuensial (RNN, LSTM, GRU), mekanisme Attention, Transformer (BERT & GPT), serta tugas-tugas inti NLP.",
      codeSnippets: [{
        id: "ml-snip-14",
        language: "python",
        caption: "tfidf_text_classifier.py",
        code: "from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\n\ncorpus = [\n    \"Machine learning memudahkan analisis data prediktif\",\n    \"Deep learning memerlukan GPU komputasi tinggi\",\n    \"Sepak bola dan olahraga sangat menyenangkan\"\n]\nlabels = [1, 1, 0]\n\nvectorizer = TfidfVectorizer()\nX = vectorizer.fit_transform(corpus)\n\nclf = LogisticRegression().fit(X, labels)\ntest_text = [\"Belajar AI dan algoritma deep learning\"]\npred = clf.predict(vectorizer.transform(test_text))\nprint(\"Prediksi Kategori Teks:\", \"Topik AI\" if pred[0] == 1 else \"Topik Umum\")",
      }],
    },
    {
      id: "ml-sec-15",
      title: "BAB 15: Large Language Model",
      orderIndex: 15,
      isCompleted: false,
      description: "Konsep dasar LLM dalam kurikulum ML: siklus pretraining vs fine-tuning, adaptasi PEFT/LoRA, prompt engineering praktis, evaluasi RLHF, RAG, serta teknik kompresi kuantisasi.",
      codeSnippets: [{
        id: "ml-snip-15",
        language: "python",
        caption: "prompt_formatter_ml.py",
        code: "def create_structured_prompt(task_desc, context, query):\n    return f\"\"\"### SYSTEM: Anda adalah asisten Machine Learning berpengalaman.\n### TUGAS: {task_desc}\n### KONTEKS: {context}\n### PERTANYAAN: {query}\n### JAWABAN:\"\"\"\n\nprompt = create_structured_prompt(\n    \"Klasifikasi Sentimen\",\n    \"Dataset ulasan aplikasi edutech\",\n    \"Aplikasi ini sangat responsif dan membantu saya belajar!\"\n)\nprint(\"[Format Prompt Terstruktur]:\\n\" + prompt)",
      }],
    },
    {
      id: "ml-sec-16",
      title: "BAB 16: AI Agents & Sistem Generatif",
      orderIndex: 16,
      isCompleted: false,
      description: "AI Agents otonom: Function Calling & Tool Use, arsitektur Multi-Agent, Model Context Protocol (MCP), dan pengantar sistem generatif multimodal (Text-to-Image & Video).",
      codeSnippets: [{
        id: "ml-snip-16",
        language: "python",
        caption: "react_agent_loop.py",
        code: "def execute_tool(tool_name, argument):\n    if tool_name == \"calculator\":\n        return eval(argument)\n    return \"Tool tidak dikenal.\"\n\ndef agent_reasoning_step(query):\n    thought = \"Saya butuh menghitung biaya komputasi.\"\n    action = \"calculator\"\n    action_input = \"24 * 30 * 1.5\"\n    observation = execute_tool(action, action_input)\n    return f\"Thought: {thought}\\nAction: {action}({action_input})\\nObservation: USD {observation}\"\n\nprint(\"[Simulasi ReAct Agent Loop]:\\n\" + agent_reasoning_step(\"Berapa biaya sewa GPU sebulan?\"))",
      }],
    },
    {
      id: "ml-sec-17",
      title: "BAB 17: Reinforcement Learning",
      orderIndex: 17,
      isCompleted: false,
      description: "Pembelajaran penguatan: Markov Decision Process (MDP: S, A, R, P, gamma), Bellman Equation, Q-Learning tabular, Deep Q-Network (DQN), dan algoritma Policy Gradient (PPO).",
      codeSnippets: [{
        id: "ml-snip-17",
        language: "python",
        caption: "q_learning_tabular.py",
        code: "import numpy as np\n\nq_table = np.zeros((4, 2))\nlr = 0.1\ngamma = 0.95\n\nstate = 0\naction = 1\nreward = 10.0\nnext_state = 1\n\nbest_future_q = np.max(q_table[next_state])\nq_table[state, action] += lr * (reward + gamma * best_future_q - q_table[state, action])\n\nprint(\"Q-Table setelah pembaruan Bellman:\\n\", q_table)",
      }],
    },
    {
      id: "ml-sec-18",
      title: "BAB 18: MLOps & Deployment",
      orderIndex: 18,
      isCompleted: false,
      description: "Transisi model ML ke produksi: Model Versioning & Registry (MLflow), CI/CD pipeline otomatis, serving model via container Docker dan FastAPI, serta monitoring data drift.",
      codeSnippets: [{
        id: "ml-snip-18",
        language: "python",
        caption: "fastapi_ml_endpoint.py",
        code: "from pydantic import BaseModel\n\nclass PredictionRequest(BaseModel):\n    features: list[float]\n\nclass PredictionResponse(BaseModel):\n    prediction: int\n    probability: float\n\ndef predict_service(req: PredictionRequest) -> PredictionResponse:\n    score = sum(req.features)\n    pred_class = 1 if score > 0 else 0\n    return PredictionResponse(prediction=pred_class, probability=0.88)\n\nsample_input = PredictionRequest(features=[0.5, -0.2, 1.2])\nprint(\"Hasil Inferensi Service:\", predict_service(sample_input).model_dump())",
      }],
    },
    {
      id: "ml-sec-19",
      title: "BAB 19: Etika & Responsible AI",
      orderIndex: 19,
      isCompleted: false,
      description: "Tanggung jawab etis: bias data & keadilan model (Fairness metrics), interpretabilitas XAI (SHAP/LIME), perlindungan privasi (Federated Learning & Differential Privacy), dan tata kelola AI.",
      codeSnippets: [{
        id: "ml-snip-19",
        language: "python",
        caption: "fairness_disparate_impact.py",
        code: "def calculate_disparate_impact(favorable_unprivileged, total_unprivileged, favorable_privileged, total_privileged):\n    rate_unprivileged = favorable_unprivileged / total_unprivileged\n    rate_privileged = favorable_privileged / total_privileged\n    di_ratio = rate_unprivileged / rate_privileged\n    return di_ratio\n\ndi = calculate_disparate_impact(40, 100, 70, 100)\nprint(f\"Disparate Impact Ratio: {di:.2f}\")\nprint(\"Status Keadilan:\", \"Memenuhi aturan 80%\" if di >= 0.8 else \"Terindikasi Bias!\")",
      }],
    },
    {
      id: "ml-sec-20",
      title: "BAB 20: Topik Lanjutan & Riset Terkini",
      orderIndex: 20,
      isCompleted: false,
      description: "Evolusi mutakhir ML: Self-Supervised & Contrastive Learning, Graph Neural Network (GNN), AutoML & Neural Architecture Search, time series forecasting, dan Causal Inference.",
      codeSnippets: [{
        id: "ml-snip-20",
        language: "python",
        caption: "simclr_contrastive_loss.py",
        code: "import numpy as np\n\ndef info_nce_loss(z_i, z_j, temperature=0.5):\n    sim_pos = np.dot(z_i, z_j) / (np.linalg.norm(z_i) * np.linalg.norm(z_j))\n    loss = -np.log(np.exp(sim_pos / temperature) / (np.exp(sim_pos / temperature) + 10 * np.exp(0.1 / temperature)))\n    return loss\n\nz1 = np.array([1.0, 0.5])\nz2 = np.array([0.9, 0.6])\nprint(f\"InfoNCE Loss (SimCLR): {info_nce_loss(z1, z2):.4f}\")",
      }],
    },
    {
      id: "ml-sec-21",
      title: "BAB 21: Tools & Ekosistem",
      orderIndex: 21,
      isCompleted: false,
      description: "Lanskap perkakas machine learning modern: Scikit-learn, PyTorch, Hugging Face Transformers, LangChain, vector databases (Qdrant, Pinecone), dan platform Cloud ML (AWS, GCP, Azure).",
      codeSnippets: [{
        id: "ml-snip-21",
        language: "python",
        caption: "huggingface_pipeline_mock.py",
        code: "print(\"[Ecosystem Setup Standard ML Stack]:\")\nprint(\"1. Scikit-learn (Algoritma Tabular & Preprocessing)\")\nprint(\"2. PyTorch (Deep Learning & Neural Network Research)\")\nprint(\"3. Hugging Face (Model Hub & Pretrained Transformers)\")\nprint(\"4. MLflow / WandB (Experiment Tracking & Model Registry)\")",
      }],
    },
    {
      id: "ml-sec-22",
      title: "BAB 22: Proyek & Studi Kasus",
      orderIndex: 22,
      isCompleted: false,
      description: "Integrasi portofolio praktis: Proyek Klasifikasi Citra & Computer Vision, Proyek Chatbot NLP, Sistem Rekomendasi E-Commerce, Aplikasi RAG/LLM, serta tips sukses kompetisi Kaggle.",
      codeSnippets: [{
        id: "ml-snip-22",
        language: "python",
        caption: "kaggle_baseline_pipeline.py",
        code: "from sklearn.model_selection import cross_val_score\nfrom sklearn.ensemble import RandomForestClassifier\nimport numpy as np\n\nX_train = np.random.randn(100, 5)\ny_train = np.random.randint(0, 2, size=100)\n\nbaseline_model = RandomForestClassifier(n_estimators=50, random_state=42)\nscores = cross_val_score(baseline_model, X_train, y_train, cv=5, scoring='accuracy')\n\nprint(f\"CV Skor Rata-rata Baseline: {np.mean(scores) * 100:.2f}% (+/- {np.std(scores) * 100:.2f}%)\")",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: MLOps & AI Deployment (14 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getMlopsSections(): ModuleSection[] {
  return [
    {
      id: "mlops-sec-1",
      title: "BAB 1: Konsep Dasar MLOps",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi & tujuan MLOps (DevOps untuk Machine Learning), mengatasi Technical Debt pada sistem ML, dan tingkat kematangan MLOps (Level 0: Manual, Level 1: ML Pipeline, Level 2: CI/CD Otomatis).",
      codeSnippets: [{
        id: "mlops-snip-1",
        language: "python",
        caption: "mlops_manifest_logger.py",
        code: "import json\nimport time\n\npipeline_metadata = {\n    \"pipeline_id\": \"pipe-cust-churn-001\",\n    \"timestamp\": int(time.time()),\n    \"mlops_level\": 2,\n    \"stages\": [\"Data Validation\", \"Auto-Retraining\", \"Model Evaluation\", \"Canary Deployment\"],\n    \"status\": \"SUCCESS\"\n}\n\nprint(json.dumps(pipeline_metadata, indent=2))",
      }],
    },
    {
      id: "mlops-sec-2",
      title: "BAB 2: Version Control untuk ML",
      orderIndex: 2,
      isCompleted: false,
      description: "Manajemen versi kode vs data vs model: implementasi Data Version Control (DVC) dengan remote storage dan Model Versioning & Registry pada MLflow.",
      codeSnippets: [{
        id: "mlops-snip-2",
        language: "python",
        caption: "dvc_pipeline_stage.py",
        code: "# Simulasi pipeline definition DVC (dvc.yaml)\ndvc_stage_config = \"\"\"\nstages:\n  train:\n    cmd: python train.py --data data/features.csv --epochs 10\n    deps:\n      - data/features.csv\n      - train.py\n    params:\n      - train.lr\n      - train.batch_size\n    outs:\n      - models/model.pkl\n    metrics:\n      - report/metrics.json:\n          cache: false\n\"\"\"\nprint(\"[Konfigurasi Pipeline DVC]:\" + dvc_stage_config)",
      }],
    },
    {
      id: "mlops-sec-3",
      title: "BAB 3: CI/CD untuk Machine Learning",
      orderIndex: 3,
      isCompleted: false,
      description: "Continuous Integration untuk ML (validasi kualitas data, unit testing, model performance gate) dan Continuous Training & Deployment dengan GitHub Actions atau GitLab CI.",
      codeSnippets: [{
        id: "mlops-snip-3",
        language: "python",
        caption: "model_quality_gate_test.py",
        code: "def test_model_performance_gate(candidate_auc, baseline_auc, threshold_improvement=0.01):\n    diff = candidate_auc - baseline_auc\n    assert diff >= threshold_improvement, (\n        f\"Gagal Quality Gate: Peningkatan AUC hanya {diff:.4f}, butuh minimal {threshold_improvement}\"\n    )\n    return \"Lolos Quality Gate! Model disetujui untuk deployment.\"\n\ntry:\n    print(test_model_performance_gate(candidate_auc=0.92, baseline_auc=0.90))\nexcept AssertionError as e:\n    print(e)",
      }],
    },
    {
      id: "mlops-sec-4",
      title: "BAB 4: Model Serving",
      orderIndex: 4,
      isCompleted: false,
      description: "Arsitektur serving model: pembuatan REST API dengan FastAPI, perbandingan model serving framework performa tinggi (TorchServe, Triton, vLLM), dan batch vs real-time streaming inference.",
      codeSnippets: [{
        id: "mlops-snip-4",
        language: "python",
        caption: "fastapi_production_serving.py",
        code: "from fastapi import FastAPI\nfrom pydantic import BaseModel\nimport numpy as np\n\napp = FastAPI(title=\"MLOps Serving API\")\n\nclass IrisInput(BaseModel):\n    sepal_length: float\n    sepal_width: float\n    petal_length: float\n    petal_width: float\n\n@app.post(\"/predict\")\ndef predict_iris(payload: IrisInput):\n    features = np.array([[payload.sepal_length, payload.sepal_width, payload.petal_length, payload.petal_width]])\n    pred_class = int(np.argmax(features))\n    return {\"class_id\": pred_class, \"status\": \"200 OK\"}\n\nprint(\"FastAPI Application initialized for production ASGI serving.\")",
      }],
    },
    {
      id: "mlops-sec-5",
      title: "BAB 5: Containerization & Orchestration",
      orderIndex: 5,
      isCompleted: false,
      description: "Docker containerization untuk reproducible ML environments (multi-stage build, CUDA support) dan orkestrasi skala besar dengan Kubernetes (Pods, Services, Horizontal Pod Autoscaler).",
      codeSnippets: [{
        id: "mlops-snip-5",
        language: "python",
        caption: "dockerfile_ml_sample.py",
        code: "dockerfile_content = \"\"\"FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY ./src ./src\nCOPY ./models ./models\nEXPOSE 8000\nCMD [\"uvicorn\", \"src.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n\"\"\"\nprint(\"[Contoh Dockerfile untuk Microservice ML]:\\n\" + dockerfile_content)",
      }],
    },
    {
      id: "mlops-sec-6",
      title: "BAB 6: Monitoring & Observability",
      orderIndex: 6,
      isCompleted: false,
      description: "Pemantauan performa model di produksi: latensi, throughput, deteksi Data Drift & Concept Drift dengan Population Stability Index (PSI) dan Kolmogorov-Smirnov Test, serta logging & alerting.",
      codeSnippets: [{
        id: "mlops-snip-6",
        language: "python",
        caption: "psi_drift_detection.py",
        code: "import numpy as np\n\ndef calculate_psi(expected_dist, actual_dist, eps=1e-4):\n    expected = np.array(expected_dist) + eps\n    actual = np.array(actual_dist) + eps\n    expected /= np.sum(expected)\n    actual /= np.sum(actual)\n    psi = np.sum((actual - expected) * np.log(actual / expected))\n    return psi\n\nbaseline_bins = [0.2, 0.3, 0.3, 0.2]\nprod_bins_nodrift = [0.21, 0.29, 0.31, 0.19]\nprod_bins_drift = [0.05, 0.15, 0.40, 0.40]\n\nprint(f\"PSI Normal: {calculate_psi(baseline_bins, prod_bins_nodrift):.4f} (< 0.1: Tidak ada drift)\")\nprint(f\"PSI Drift: {calculate_psi(baseline_bins, prod_bins_drift):.4f} (> 0.25: Signifikan Drift)\")",
      }],
    },
    {
      id: "mlops-sec-7",
      title: "BAB 7: Feature Store & Data Pipeline",
      orderIndex: 7,
      isCompleted: false,
      description: "Konsep Feature Store (Feast, Hopsworks) untuk menjamin point-in-time correctness, mencegah data leakage antara training & serving, serta sinkronisasi online store (Redis) & offline store (Parquet/Snowflake).",
      codeSnippets: [{
        id: "mlops-snip-7",
        language: "python",
        caption: "feature_store_feast_def.py",
        code: "feature_definition = \"\"\"from feast import Entity, FeatureView, Field, Int64, Float32\nfrom datetime import timedelta\n\nuser_entity = Entity(name=\"user_id\", join_keys=[\"user_id\"])\n\nuser_features_view = FeatureView(\n    name=\"user_click_stats\",\n    entities=[user_entity],\n    ttl=timedelta(days=30),\n    schema=[\n        Field(name=\"avg_daily_clicks\", dtype=Float32),\n        Field(name=\"total_orders_30d\", dtype=Int64)\n    ],\n    online=True\n)\n\"\"\"\nprint(\"[Contoh Konfigurasi Feature Store]:\\n\" + feature_definition)",
      }],
    },
    {
      id: "mlops-sec-8",
      title: "BAB 8: Experiment Tracking",
      orderIndex: 8,
      isCompleted: false,
      description: "Tracking eksperimen otomatis dengan MLflow Tracking dan Weights & Biases (W&B): pencatatan hyperparameter, logging kurva loss, penyimpanan artefak model, dan reproduktibilitas.",
      codeSnippets: [{
        id: "mlops-snip-8",
        language: "python",
        caption: "mlflow_tracking_script.py",
        code: "def mock_mlflow_run(params, metrics, model_name):\n    print(f\"--- [MLflow Run: {model_name}] ---\")\n    for k, v in params.items():\n        print(f\"Log Param: {k} = {v}\")\n    for k, v in metrics.items():\n        print(f\"Log Metric: {k} = {v}\")\n    print(\"Model Artifacts: Saved to s3://mlflow-artifacts/model.pkl\\n\")\n\nmock_mlflow_run(\n    params={\"learning_rate\": 0.001, \"batch_size\": 64, \"optimizer\": \"AdamW\"},\n    metrics={\"val_loss\": 0.231, \"val_accuracy\": 0.945},\n    model_name=\"ResNet50-Transfer\"\n)",
      }],
    },
    {
      id: "mlops-sec-9",
      title: "BAB 9: LLMOps",
      orderIndex: 9,
      isCompleted: false,
      description: "Operasional model bahasa besar (LLMOps): manajemen versi prompt, versioning pipeline RAG, evaluasi output LLM berkelanjutan (LangSmith, TruLens), dan monitoring token usage & latency.",
      codeSnippets: [{
        id: "mlops-snip-9",
        language: "python",
        caption: "llm_latency_token_tracker.py",
        code: "import time\n\ndef track_llm_inference(prompt, mock_response, input_tokens, output_tokens):\n    start = time.time()\n    time.sleep(0.05)\n    duration = time.time() - start\n    \n    cost_estimate = (input_tokens * 0.0000015) + (output_tokens * 0.000002)\n    return {\n        \"latency_sec\": round(duration, 3),\n        \"total_tokens\": input_tokens + output_tokens,\n        \"cost_usd\": round(cost_estimate, 6)\n    }\n\nmetrics = track_llm_inference(\"Jelaskan CI/CD dalam AI\", \"CI/CD adalah...\", 35, 120)\nprint(\"LLMOps Monitoring Metrics:\", metrics)",
      }],
    },
    {
      id: "mlops-sec-10",
      title: "BAB 10: Skalabilitas & Optimasi",
      orderIndex: 10,
      isCompleted: false,
      description: "Teknik optimasi skala produksi: Load Balancing, kompresi model (ONNX Runtime, TensorRT quantization INT8/FP16), dan strategi deployment ke edge device.",
      codeSnippets: [{
        id: "mlops-snip-10",
        language: "python",
        caption: "onnx_conversion_check.py",
        code: "import numpy as np\n\npytorch_output = np.array([0.1234, 0.8766])\nonnx_output = np.array([0.1235, 0.8765])\n\ndiff = np.max(np.abs(pytorch_output - onnx_output))\nassert diff < 1e-3, \"Perbedaan output melebihi batas toleransi kuantisasi!\"\nprint(f\"Verifikasi Berhasil! Deviasi maksimum ONNX vs PyTorch: {diff:.6f}\")",
      }],
    },
    {
      id: "mlops-sec-11",
      title: "BAB 11: Keamanan dalam MLOps",
      orderIndex: 11,
      isCompleted: false,
      description: "Keamanan sistem ML produksi: kontrol akses berbasis peran (RBAC) pada model registry, audit trail deployment, pengamanan supply chain model (SafeTensors vs kerentanan Pickle).",
      codeSnippets: [{
        id: "mlops-snip-11",
        language: "python",
        caption: "safetensors_security_check.py",
        code: "def verify_model_security(file_path):\n    if file_path.endswith(\".pkl\") or file_path.endswith(\".pickle\"):\n        return \"PERINGATAN RISIKO TINGGI: File pickle rentan terhadap arbitrary code execution!\"\n    elif file_path.endswith(\".safetensors\") or file_path.endswith(\".onnx\"):\n        return \"AMAN: Format SafeTensors/ONNX kebal terhadap eksekusi kode berbahaya.\"\n    return \"Format tidak dikenal.\"\n\nprint(verify_model_security(\"models/weights.pkl\"))\nprint(verify_model_security(\"models/model.safetensors\"))",
      }],
    },
    {
      id: "mlops-sec-12",
      title: "BAB 12: Cost Management & FinOps untuk AI",
      orderIndex: 12,
      isCompleted: false,
      description: "FinOps untuk AI: optimasi biaya inferensi GPU/TPU, pemanfaatan spot instances, dynamic scale-to-zero autoscaling, dan manajemen alokasi kuota token LLM.",
      codeSnippets: [{
        id: "mlops-snip-12",
        language: "python",
        caption: "finops_cost_calculator.py",
        code: "def calculate_monthly_gpu_cost(hours_per_day, gpu_price_hourly, spot_discount=0.7):\n    on_demand_monthly = hours_per_day * 30 * gpu_price_hourly\n    spot_monthly = on_demand_monthly * (1 - spot_discount)\n    savings = on_demand_monthly - spot_monthly\n    return on_demand_monthly, spot_monthly, savings\n\non_demand, spot, saved = calculate_monthly_gpu_cost(24, 2.5, 0.65)\nprint(f\"Biaya On-Demand Bulanan (A10G): USD {on_demand:.2f}\")\nprint(f\"Biaya Spot Instance Bulanan: USD {spot:.2f}\")\nprint(f\"Penghematan FinOps: USD {saved:.2f}\")",
      }],
    },
    {
      id: "mlops-sec-13",
      title: "BAB 13: Studi Kasus MLOps",
      orderIndex: 13,
      isCompleted: false,
      description: "Penerapan arsitektur MLOps end-to-end pada industri: data ingestion terorkestrasi, automated training, model validation gate, canary deployment, dan automated drift remediation.",
      codeSnippets: [{
        id: "mlops-snip-13",
        language: "python",
        caption: "end_to_end_mlops_dag.py",
        code: "stages = [\n    {\"stage\": 1, \"task\": \"Data Ingestion & Schema Check\", \"status\": \"PASS\"},\n    {\"stage\": 2, \"task\": \"AutoML Model Training\", \"status\": \"PASS\"},\n    {\"stage\": 3, \"task\": \"Bias & Performance Verification\", \"status\": \"PASS\"},\n    {\"stage\": 4, \"task\": \"Canary 10% Traffic Rollout\", \"status\": \"DEPLOYED\"}\n]\n\nprint(\"=== PIPELINE STATUS ORCHESTRATION ===\")\nfor s in stages:\n    print(f\"Stage {s['stage']}: {s['task']} -> [{s['status']}]\")",
      }],
    },
    {
      id: "mlops-sec-14",
      title: "BAB 14: Best Practice Deployment Model Produksi",
      orderIndex: 14,
      isCompleted: false,
      description: "Checklist kesiapan deployment produksi (liveness/readiness probes, graceful shutdown, fallback logic), dan prosedur Disaster Recovery serta automated rollback jika terjadi degradasi performa.",
      codeSnippets: [{
        id: "mlops-snip-14",
        language: "python",
        caption: "blue_green_rollback_router.py",
        code: "class DeploymentRouter:\n    def __init__(self):\n        self.active_version = \"BLUE (v1.0.0)\"\n        self.standby_version = \"GREEN (v1.1.0)\"\n\n    def trigger_rollback(self, reason):\n        print(f\"[ALERT] Performa menurun karena: {reason}\")\n        print(f\"Mengembalikan lalu lintas dari {self.standby_version} kembali ke {self.active_version}...\")\n        self.standby_version, self.active_version = self.active_version, self.standby_version\n        print(f\"Rollback selesai! Versi aktif sekarang: {self.active_version}\")\n\nrouter = DeploymentRouter()\nrouter.trigger_rollback(\"Tingkat error 5xx melebihi 1%\")",
      }],
    },
  ];
}

export const CURRICULUM_BATCH4_MAP: Record<string, () => ModuleSection[]> = {
  "graph-neural-network": getGraphNeuralNetworkSections,
  "gnn": getGraphNeuralNetworkSections,
  "knowledge-representation": getKnowledgeRepresentationSections,
  "knowledge-rep": getKnowledgeRepresentationSections,
  "large-language-model": getLargeLanguageModelSections,
  "llm": getLargeLanguageModelSections,
  "machine-learning": getMachineLearningSections,
  "ml": getMachineLearningSections,
  "mlops": getMlopsSections,
  "mlops-ai-deployment": getMlopsSections,
};

export function getBatch4CurriculumNote(slug: string): { title: string; content_markdown: string; category_name: string } | null {
  const clean = slug.toLowerCase().trim();
  const allGroups = [
    { name: "Graph Neural Network (GNN)", sections: getGraphNeuralNetworkSections() },
    { name: "Knowledge Representation", sections: getKnowledgeRepresentationSections() },
    { name: "Large Language Model", sections: getLargeLanguageModelSections() },
    { name: "Machine Learning", sections: getMachineLearningSections() },
    { name: "MLOps & AI Deployment", sections: getMlopsSections() },
  ];

  for (const group of allGroups) {
    for (const sec of group.sections) {
      const sSlug = sec.title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
      if (sSlug === clean || clean.includes(sSlug) || sSlug.includes(clean)) {
        const code = sec.codeSnippets?.[0]?.code || '# Contoh kode materi';
        const caption = sec.codeSnippets?.[0]?.caption || 'script.py';
        const codeBlock = String.fromCharCode(96, 96, 96) + 'python\n# ' + caption + '\n' + code + '\n' + String.fromCharCode(96, 96, 96);
        const content = '# ' + sec.title + '\n\n' + sec.description + '\n\n## Konsep Utama\n- Memahami teori dan metodologi fundamental terkait ' + sec.title + '.\n- Penerapan praktis dengan arsitektur modern dan standar industri AI.\n- Analisis performa, kelebihan, dan limitasi teknis implementasi.\n\n## Implementasi Kode Praktikum\n\n' + codeBlock + '\n\n## Rangkuman Materi\nTopik ini memberikan dasar komprehensif bagi praktisi data dan AI dalam menguasai kompetensi sesuai kurikulum standar industri Velqora.';
        return {
          title: sec.title,
          content_markdown: content,
          category_name: group.name,
        };
      }
    }
  }
  return null;
}
