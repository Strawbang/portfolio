---
title: Ippon Technologies
publishDate: 2025-11-01 00:00:00
img: /assets/optimized/ippon.webp
imgType: logo
img_alt: Ippon Technologies logo
role: Full-Stack Software Engineer
startDate: 2025-11-01
description: |
  Designed and built Lumio at Ippon Technologies: an AI platform that documents legacy codebases (Rust CLI, web app and MCP server on one core), rolled out to 120+ consultants and offered to Ippon's clients.
tags:
  - AI
  - Software Engineering
keywords:
  - Rust
  - TypeScript
  - AI
  - MCP
  - RAG
  - Tree-sitter
  - Node.js
  - LLM APIs
relatedPosts:
  - claude-code-jira-mcp-legacy-codebase
  - model-context-protocol-mcp-cli-rust-ide
  - spec-driven-development
engagementType: esn
companySize: "~600"
context: legacy
workplace: Hybrid
stack:
  Language:
    - Rust
    - TypeScript
  AI/ML:
    - RAG
    - LLM APIs
    - Tree-sitter
  Protocol:
    - MCP
  Runtime:
    - Node.js
---

### Lumio: an AI platform for legacy codebases

<p>Ippon Technologies is a consulting firm of about 600 people working on cloud and software engineering for large clients. Since November 2025 I have split my time between client delivery and internal R&D. The R&D side produced Lumio, a platform that helps engineers understand and modernize legacy codebases, which Ippon now offers to its clients (<a href="https://fr.ippon.tech/ia-advisory/lumio-documentation-legacy/" rel="noopener">product page, in French</a>).</p>

#### What Lumio does

<p>Lumio imports a codebase from a Git repository, an archive of up to 20 GB or a local path, with sub-project selection in monorepos. It maps the dependencies and generates business and technical documentation linked to the code, refreshed on every re-indexing. Engineers query it in natural language through a chatbot or from the command line. The analysis engine runs on Claude Sonnet 4.6.</p>

#### What I built

<p>I designed and built the whole product. It has three surfaces that share one core:</p>

<ul>
  <li><strong>A Rust CLI</strong> that parses codebases with tree-sitter, chunks them along the syntax tree and indexes them for retrieval.</li>
  <li><strong>A web app</strong> where engineers index their projects, read the generated documentation, explore a graph of the code and ask questions about it.</li>
  <li><strong>An MCP server</strong> that gives coding agents and IDE assistants the same index, for exploration, testing and refactoring tasks.</li>
</ul>

<p>Around that core sit the parts that make it a product rather than a demo: separate workspaces per organization, user and access management, logs, and tracking of LLM usage and cost per organization.</p>

<p>The core is written in Rust so that one engine serves the CLI, the web app and the MCP server, and so that parsing large repositories stays fast. Tree-sitter keeps the parsing language-agnostic, which matters when the codebases in question span several legacy languages.</p>

#### Where it stands

<p>Lumio is rolled out internally to 120+ consultants, and Ippon now offers it to its clients.</p>

#### Client delivery

<p>Alongside the platform I work on client engagements, currently <a href="/work/suez-iws/">Suez IWS</a>: a regulated B2B extranet for hazardous-waste tracking, where I rebuilt the CI/CD pipeline and moved a legacy Liferay front end to Angular micro frontends.</p>

#### Writing

<p>I also publish technical articles on the <a href="https://blog.ippon.fr/author/djamel-bougouffa/" rel="noopener">Ippon Tech Blog</a>, on topics explored during this R&D work.</p>
