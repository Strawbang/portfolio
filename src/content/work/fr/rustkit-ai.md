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
role: Cofondateur & Mainteneur Open Source
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

<p>rustkit-ai est une organisation open source d'outils Rust pour le développement assisté par IA, que j'ai cofondée avec <a href="https://github.com/GokhanKabar" rel="noopener">Gokhan Kabar</a>. Tout est sous licence MIT et publié sur crates.io.</p>

<p>Ces outils sont nés de besoins concrets rencontrés pendant la R&D interne chez Ippon Technologies, où les mêmes problèmes (perte de contexte, coût des tokens, compréhension d'une grosse base de code) revenaient sur du vrai code de production.</p>

#### semtree

**[semtree](https://github.com/rustkit-ai/semtree)** est mon projet principal, que j'ai construit et que je maintiens : une recherche sémantique de code, locale par défaut.

- Analyse une base de code avec tree-sitter (20 langages) et la découpe en suivant l'arbre syntaxique : un morceau correspond à une fonction ou une classe, pas à une fenêtre arbitraire de lignes.
- Calcule les embeddings sur votre machine avec fastembed et les range dans un index HNSW à côté du dépôt.
- Classe les résultats en combinant similarité vectorielle et BM25 (hybride par défaut), avec des modes purement sémantique ou purement lexical.
- Place l'embedder et le stockage vectoriel derrière des traits : un modèle Ollama local ou une API distante peut remplacer ceux par défaut.
- Se distribue en bibliothèque, en CLI et en serveur MCP pour les agents de code, découpée en 9 crates sur crates.io.

```
cargo install semtree-cli
```

#### Mes autres outils

**[trimcp](https://github.com/rustkit-ai/trimcp)**
Proxy MCP qui compresse et met en cache la sortie des outils MCP avant qu'elle n'atteigne le modèle. Détecte automatiquement les configurations MCP de Claude Code et Cursor.

```
cargo install trimcp
trimcp setup
```

**[semstore](https://github.com/rustkit-ai/semstore)**, coécrit avec Gokhan
Recherche sémantique locale pour les applications Rust : stocker du texte, chercher par le sens, sans API cloud.

#### Aussi dans l'organisation

<p><a href="https://github.com/GokhanKabar" rel="noopener">Gokhan Kabar</a> développe <a href="https://github.com/rustkit-ai/aimemo">aimemo</a> (mémoire persistante pour les agents de code IA), <a href="https://github.com/rustkit-ai/tersify">tersify</a> (retire le bruit du code et du texte avant de l'injecter dans un contexte LLM) et <a href="https://github.com/rustkit-ai/mcpkill">mcpkill</a> (un proxy de cache sémantique pour serveurs MCP).</p>


#### Références

- [rustkit-ai : site officiel](https://rustkit-ai.github.io/)
- [rustkit-ai : organisation GitHub](https://github.com/rustkit-ai)
- [Tous mes produits et outils open source](/fr/projets)
