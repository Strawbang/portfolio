---
title: "Model Context Protocol (MCP): Exposing a Rust CLI to Your IDE"
description: "A practical deep-dive on using MCP to expose a Rust CLI to an AI agent in the IDE — architecture, best practices, and TypeScript implementation."
publishDate: 2026-03-11
tags: ["mcp", "ai-agents", "rust", "typescript", "devtools"]
img: "https://blog.ippon.fr/content/images/2026/03/mcp-cli-rust-ide-schema-architecture.png"
img_alt: "MCP architecture: Rust CLI connected to an IDE via an MCP server"
canonicalURL: "https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/"
draft: false
lang: en
source: Ippon
relatedPosts: ["spec-driven-development"]
---

This article was published on the [Ippon Technologies blog](https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/) (in French).

The **Model Context Protocol (MCP)** allows you to expose internal tools to an AI agent directly in your IDE — without IDE-specific plugins, without ad hoc integrations. Instead of giving suggestions, the agent can execute real actions on your codebase.

In this article, I walk through our implementation: a Rust CLI exposed via a TypeScript MCP server, the design principles that make tools genuinely useful for an agent, and the pitfalls to avoid.

- Why MCP instead of a classic VSCode plugin
- How to structure outputs so an agent can make decisions
- Concrete implementation: Rust CLI + TypeScript façade

Read the full article on the Ippon blog: [Model Context Protocol (MCP): Exposing a Rust CLI to Your IDE](https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/)
