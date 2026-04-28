---
title: "Model Context Protocol (MCP) : exposer un CLI Rust dans votre IDE"
description: "Retour d'expérience sur l'utilisation de MCP pour exposer un CLI Rust à un agent IA dans l'IDE — architecture, bonnes pratiques et implémentation TypeScript."
publishDate: 2026-03-11
tags: ["mcp", "ai-agents", "rust", "typescript", "devtools"]
img: "https://blog.ippon.fr/content/images/2026/03/mcp-cli-rust-ide-schema-architecture.png"
img_alt: "Architecture MCP : CLI Rust connecté à un IDE via un serveur MCP"
canonicalURL: "https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/"
draft: false
lang: fr
source: Ippon
relatedPosts: ["spec-driven-development"]
---

Cet article a été publié sur le [blog Ippon Technologies](https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/).

Le **Model Context Protocol (MCP)** permet d'exposer des outils internes à un agent IA directement dans l'IDE — sans plugin spécifique, sans intégration ad hoc. Plutôt que de donner des suggestions, l'agent peut exécuter de vraies actions sur votre codebase.

Dans cet article, je reviens sur notre implémentation : un CLI Rust exposé via un serveur MCP TypeScript, les principes de design qui rendent les outils vraiment utilisables par un agent, et les pièges à éviter.

Retrouvez l'article complet sur le blog Ippon : [Model Context Protocol (MCP) : exposer un CLI Rust dans votre IDE](https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/)
