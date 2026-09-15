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
img_alt: rustkit-ai open source organization logo
imgType: logo
role: Founder & Open Source Maintainer
startDate: 2025-12-01
description: |
  Open source organization for Rust developer tools used in AI-assisted work. Main project: semtree, semantic code search that runs locally by default, published on crates.io under MIT.
tags:
  - Open Source
  - AI
  - Rust
keywords:
  - Rust
  - AI
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

### rustkit-ai: Rust tools for AI-assisted development

<p>rustkit-ai is the open source organization where I publish the Rust tools I build for AI-assisted development. Everything is MIT licensed and published on crates.io.</p>

<p>The tooling was born out of practical needs met during internal R&D work at Ippon Technologies, where the same problems (context loss, token costs, understanding a large codebase) kept coming back on real production code.</p>

#### semtree

**[semtree](https://github.com/rustkit-ai/semtree)** is the main project: semantic code search that runs locally by default.

- Parses a codebase with tree-sitter (20 languages) and chunks it along the syntax tree, so a chunk is a function or a class rather than an arbitrary window of lines.
- Embeds the chunks on your machine with fastembed and stores them in an HNSW index next to the repository.
- Ranks results by fusing vector similarity with BM25 (hybrid by default), with semantic-only and lexical-only modes available.
- Keeps the embedder and the vector store behind traits, so a local Ollama model or a remote API can replace the defaults.
- Ships as a library, a CLI and an MCP server for coding agents, split into 9 crates on crates.io.

```
cargo install semtree-cli
```

#### Other tools

**[aimemo](https://github.com/rustkit-ai/aimemo)**
Persistent memory for AI coding agents. Writes structured context to `CLAUDE.md`, `.cursor/rules`, `.windsurfrules` or `.github/copilot-instructions.md` depending on the editor.

```
cargo install aimemo
aimemo setup --claude
```

**[trimcp](https://github.com/rustkit-ai/trimcp)**
MCP proxy that compresses and caches MCP tool output before it reaches the model. Auto-detects Claude Code and Cursor MCP configurations.

```
cargo install trimcp
trimcp setup
```

**[tersify](https://github.com/rustkit-ai/tersify)**
Strips noise (comments, blank lines, redundant whitespace) from code and text before it goes into an LLM context.

```
cargo install tersify
tersify src/main.rs | pbcopy
```

**[semstore](https://github.com/rustkit-ai/semstore)**
Local semantic search for Rust applications: store text, search by meaning, no cloud API required.

#### References

- [rustkit-ai: official website](https://rustkit-ai.github.io/)
- [rustkit-ai: GitHub organization](https://github.com/rustkit-ai)
- [All my products and open-source tools](/projects)
