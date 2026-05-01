---
title: "Spec-Driven Development: From Specification to Code with AI"
description: "Discover Spec-Driven Development (SDD) and how AI, using Kiro, transforms a specification into structured, test-verified code."
publishDate: 2026-02-18
tags: ["AI", "Software Engineering"]
keywords: ["AI Agents", "LLM", "Architecture", "Developer Tools", "Kiro"]
img: "https://blog.ippon.fr/content/images/2026/02/spec-driven-developement.png"
img_alt: "Spec-Driven Development with AI"
canonicalURL: "https://blog.ippon.fr/2026/02/18/spec-driven-development/"
draft: false
lang: en
source: Ippon
relatedPosts: ["model-context-protocol-mcp-cli-rust-ide"]
relatedWork: ["ippon-technologies"]
---

This article was co-written and published on the [Ippon Technologies blog](https://blog.ippon.fr/2026/02/18/spec-driven-development/) (in French).

**Spec-Driven Development (SDD)** proposes a simple yet radical shift: the specification becomes the source of truth for the project. Before writing any code, you precisely describe what the system must guarantee. These guarantees directly guide the architecture, implementation, and tests.

## The core idea

SDD is a development approach where a formalized specification — requirements, acceptance criteria, invariants — becomes the central artifact of the project. It's versioned alongside the code and serves as the reference for design, implementation, and testing.

What makes an approach truly Spec-Driven isn't the presence of a "requirements document". It's three principles:

- **The spec acts as a contract** — if an implementation deviates from it, that's a defect, not a valid variant.
- **Every decision is traceable** — a component answers a requirement, a test checks an acceptance criterion, a validation protects an invariant.
- **The spec is alive** — it evolves at the same pace as the code, versioned in the same repository and reviewed in the same cycle.

## The SDD cycle

The cycle is iterative: **Specify → Plan → Develop & Test → Iterate**.

The key discipline is separating *what* from *how*: you agree on expected behaviors before debating the best way to implement them. This prevents architecture from accidentally dictating the product.

## SDD vs BDD vs PDD

- **BDD** formalizes behavior through tests (Given/When/Then). SDD structures the entire project around the spec. Both can coexist.
- **PDD** (Prompt-Driven Development) optimizes the exchange with AI via prompts — effective for prototyping, but the prompt is ephemeral. SDD uses prompts as a tool while the spec remains the reference.

## What AI changes

Tools like **Kiro** now allow you to organize work around **Requirements → Design → Tasks**, making the spec an active artifact rather than a static document.

Modern AI can:
- transform a product intention into structured requirements
- derive a coherent design from those requirements
- generate implementation tasks
- produce tests aligned with acceptance criteria
- verify that code still honors the original intent

The specification stops being a burden and becomes an accelerator.

Read the full article on the Ippon blog: [Spec-Driven Development: From Specification to Code with AI](https://blog.ippon.fr/2026/02/18/spec-driven-development/)
