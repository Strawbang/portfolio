---
title: rustkit-ai
publishDate: 2025-12-01 00:00:00
img: /assets/optimized/rustkit-ai.webp
img_alt: Logo de l'organisation open source rustkit-ai
imgType: logo
role: Fondateur & Mainteneur Open Source
startDate: 2025-12-01
description: |
  Organisation open source développant des outils AI-native en Rust — mémoire persistante, compression de tokens, intelligence sémantique du code et proxy MCP. Publié sur crates.io, sous licence MIT.
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

### rustkit-ai — Outils de développement AI-native en Rust

<p>rustkit-ai est une organisation open source que j'ai fondée pour construire des outils qui résolvent les vrais points de friction dans le développement assisté par l'IA : perte de contexte entre les sessions, coûts en tokens qui s'accumulent, et absence de recherche sémantique locale. Tous les outils sont sous licence MIT, publiés sur crates.io, et fonctionnent immédiatement avec les principaux agents de code IA.</p>

<p>Ces outils sont nés de besoins pratiques rencontrés lors de travaux R&D internes chez Ippon Technologies, où les mêmes problèmes — perte de contexte, coûts en tokens, intelligence du code — apparaissaient régulièrement sur des bases de code de production réelles.</p>

#### Outils

**[aimemo](https://github.com/rustkit-ai/aimemo)** `v0.1.11`
Mémoire persistante pour les agents de code IA. Écrit un contexte structuré dans `CLAUDE.md`, `.cursor/rules`, `.windsurfrules` ou `.github/copilot-instructions.md` selon l'éditeur. Une seule commande pour la configuration, zéro configuration manuelle. Compatible avec Claude Code, Cursor, Windsurf et GitHub Copilot.

```
cargo install aimemo
aimemo setup --claude
```

**[trimcp](https://github.com/rustkit-ai/trimcp)** `v0.1.3`
Proxy MCP qui réduit les coûts LLM en tokens de 60 à 90% via la compression et la mise en cache des sorties des outils MCP avant qu'elles n'atteignent le modèle. Détecte automatiquement les configurations MCP de Claude Code et Cursor.

```
cargo install trimcp
trimcp setup
```

**[tersify](https://github.com/rustkit-ai/tersify)** `v0.5.1`
Compresse le code et le texte pour les LLM en supprimant le bruit — commentaires, lignes vides, espaces redondants — réduisant les tokens jusqu'à 50% sans perte de sens. Utile comme étape de prétraitement avant d'injecter du code dans un contexte LLM.

```
cargo install tersify
tersify src/main.rs | pbcopy
```

**[semtree](https://github.com/rustkit-ai/semtree)** `v0.1.5`
Intelligence sémantique du code en Rust — parsing Tree-sitter, embeddings et RAG pour les bases de code multi-langages. Parse et indexe Rust, Python, JavaScript, TypeScript et Go depuis une architecture unifiée.

```
cargo install semtree-cli
```

**[semstore](https://github.com/rustkit-ai/semstore)** `v0.1.0`
Recherche sémantique locale pour les applications Rust — stocker du texte, rechercher par sens, sans API cloud. Embeddings on-device qui fonctionnent partout où Rust tourne.

#### Références

- [rustkit-ai — Site officiel](https://rustkit-ai.github.io/)
- [rustkit-ai — Organisation GitHub](https://github.com/rustkit-ai)
