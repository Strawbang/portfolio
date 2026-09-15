---
title: rustkit-ai
relatedPosts:
  - model-context-protocol-mcp-cli-rust-ide
  - why-i-left-the-ai-ide-for-the-terminal
  - deploying-rust-rag-app-aws-terraform-ec2-bedrock
relatedWork:
  - ippon-technologies
publishDate: 2025-12-01 00:00:00
img: /assets/optimized/rustkit-ai.webp
img_alt: Logo de l'organisation open source rustkit-ai
imgType: logo
role: Fondateur & Mainteneur Open Source
startDate: 2025-12-01
description: |
  Organisation open source d'outils Rust pour le développement assisté par IA. Projet principal : semtree, une recherche sémantique de code locale par défaut, publiée sur crates.io sous licence MIT.
tags:
  - Open Source
  - IA
  - Rust
keywords:
  - Rust
  - IA
  - MCP
  - RAG
  - Tree-sitter
  - Open Source
  - crates.io
  - Claude Code
  - Cursor
  - Windsurf
  - GitHub Copilot
engagementType: opensource
stack:
  Language:
    - Rust
  AI/ML:
    - RAG
    - Embeddings
    - Tree-sitter
  Protocol:
    - MCP
---

### rustkit-ai : des outils Rust pour le développement assisté par IA

<p>rustkit-ai est l'organisation open source où je publie les outils Rust que je construis pour le développement assisté par IA. Tout est sous licence MIT et publié sur crates.io.</p>

<p>Ces outils sont nés de besoins concrets rencontrés pendant la R&D interne chez Ippon Technologies, où les mêmes problèmes (perte de contexte, coût des tokens, compréhension d'une grosse base de code) revenaient sur du vrai code de production.</p>

#### semtree

**[semtree](https://github.com/rustkit-ai/semtree)** est le projet principal : une recherche sémantique de code, locale par défaut.

- Analyse une base de code avec tree-sitter (20 langages) et la découpe en suivant l'arbre syntaxique : un morceau correspond à une fonction ou une classe, pas à une fenêtre arbitraire de lignes.
- Calcule les embeddings sur votre machine avec fastembed et les range dans un index HNSW à côté du dépôt.
- Classe les résultats en combinant similarité vectorielle et BM25 (hybride par défaut), avec des modes purement sémantique ou purement lexical.
- Place l'embedder et le stockage vectoriel derrière des traits : un modèle Ollama local ou une API distante peut remplacer ceux par défaut.
- Se distribue en bibliothèque, en CLI et en serveur MCP pour les agents de code, découpée en 9 crates sur crates.io.

```
cargo install semtree-cli
```

#### Autres outils

**[aimemo](https://github.com/rustkit-ai/aimemo)**
Mémoire persistante pour les agents de code IA. Écrit un contexte structuré dans `CLAUDE.md`, `.cursor/rules`, `.windsurfrules` ou `.github/copilot-instructions.md` selon l'éditeur.

```
cargo install aimemo
aimemo setup --claude
```

**[trimcp](https://github.com/rustkit-ai/trimcp)**
Proxy MCP qui compresse et met en cache la sortie des outils MCP avant qu'elle n'atteigne le modèle. Détecte automatiquement les configurations MCP de Claude Code et Cursor.

```
cargo install trimcp
trimcp setup
```

**[tersify](https://github.com/rustkit-ai/tersify)**
Retire le bruit (commentaires, lignes vides, espaces redondants) du code et du texte avant de l'injecter dans un contexte LLM.

```
cargo install tersify
tersify src/main.rs | pbcopy
```

**[semstore](https://github.com/rustkit-ai/semstore)**
Recherche sémantique locale pour les applications Rust : stocker du texte, chercher par le sens, sans API cloud.

#### Références

- [rustkit-ai : site officiel](https://rustkit-ai.github.io/)
- [rustkit-ai : organisation GitHub](https://github.com/rustkit-ai)
- [Tous mes produits et outils open source](/fr/projets)
