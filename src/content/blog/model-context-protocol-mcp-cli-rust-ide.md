---
title: "Model Context Protocol (MCP): Exposing a Rust CLI to Your IDE"
description: "A practical deep-dive on using MCP to expose a Rust CLI to an AI agent in the IDE: architecture, best practices, and TypeScript implementation."
publishDate: 2026-03-11
tags: ["AI", "Software Engineering"]
keywords: ["MCP", "Rust", "TypeScript", "AI Agents", "Developer Tools"]
img: "https://blog.ippon.fr/content/images/2026/03/mcp-cli-rust-ide-schema-architecture.png"
img_alt: "MCP architecture: Rust CLI connected to an IDE via an MCP server"
draft: false
lang: en
source: Ippon
relatedPosts: ["spec-driven-development"]
relatedWork: ["ippon-technologies"]
---

**Quick answer:** The Model Context Protocol (MCP) lets an AI agent inside your IDE call your own tools directly, with no IDE-specific plugin. You keep your Rust CLI as the engine, wrap it in a small TypeScript MCP server that declares its capabilities, and any MCP-compatible host (Claude Code, Cursor, Windsurf) can then run real actions on your codebase instead of just suggesting them.

The **Model Context Protocol (MCP)** allows you to expose internal tools to an AI agent directly in your IDE, without IDE-specific plugins, without ad hoc integrations. Instead of giving suggestions, the agent can execute real actions on your codebase.

## The problem MCP solves

AI agents embedded in IDEs are great at understanding context: analyzing code, explaining errors, suggesting refactors. But when it comes to executing real actions (running internal scripts, triggering business logic, validating outputs against proprietary rules), a friction loop appears: the agent proposes → you run it elsewhere → you paste the output back in. Every time.

MCP closes this gap by providing a **standard to expose capabilities** (CLIs, APIs, internal services) via a structured contract that any compatible IDE or AI assistant can directly consume.

## MCP vs REST: not just another API

The difference isn't in the message format, it's in the integration model:

- **REST** exposes endpoints. The orchestration is written client-side, the client is known in advance, nothing standardizes usage by an agent.
- **MCP** exposes declared capabilities (`tools`, `resources`, `prompts`). The host discovers them dynamically, the agent decides how to chain them, responses are structured to be interpretable and re-plannable.

REST exposes services. MCP exposes actions exploitable by agents.

## Architecture: motor / façade / cockpit

In our implementation at Ippon:

- **Rust CLI** = the motor: business logic, performance, source of truth. Nothing changes here.
- **TypeScript MCP server** = the façade: the contract, parameter validation, capability exposure via the MCP SDK.
- **IDE/agent** = the cockpit: orchestration and UX.

A single integration target replaces N IDE-specific plugins. Exposing a tool is surprisingly concise:

```typescript
server.tool("analyze_module", {
  inputSchema: { type: "object", properties: { module: { type: "string" } }, required: ["module"] }
}, async ({ module }) => {
  const result = await runCli(["analyze", module]);
  return JSON.parse(result);
});
```

## Why not a VSCode plugin?

The "smart plugin" approach hits structural problems fast: the N-IDE effect (every host is a new target), duplicated business logic that drifts from the CLI, fragile stdout parsing that turns logs into an implicit API, and IDE lock-in. MCP inverts the posture: start from the capabilities, not the interface.

## 3 design principles for agent-ready tools

1. **Decision-oriented outputs:** don't dump state, return what the agent needs to act next.
2. **Actionable errors:** structured `code + message + recoveryHint` so the agent can self-correct without human intervention.
3. **Atomic and composable tools:** `analyze_module()` → `generate_patch()` → `apply_patch()` → `run_tests()`. One tool, one intent. The agent orchestrates.

## Making a CLI agent-ready (3 changes)

1. **JSON-first stdout:** stable machine-readable output; human logs go to stderr.
2. **Separated logs:** don't mix result and diagnostic output.
3. **Categorized errors:** error code + message + recovery hint.

## Frequently asked questions

### What is the Model Context Protocol (MCP)?

MCP is an open standard that lets an AI agent discover and call external capabilities (CLIs, APIs, internal services) through a structured contract. The host discovers the declared tools dynamically, and the agent decides how to chain them, so the same tool works across any MCP-compatible IDE or assistant.

### How is MCP different from a REST API?

REST exposes endpoints and leaves orchestration to a client that is known in advance. MCP exposes declared capabilities (`tools`, `resources`, `prompts`) that a host discovers at runtime, and returns structured responses an agent can interpret and re-plan around. REST exposes services; MCP exposes actions an agent can use.

### Do I need to rewrite my Rust CLI to make it agent-ready?

No rewrite, three adjustments. Emit machine-readable JSON on stdout and send human logs to stderr, keep result and diagnostic output separated, and return categorized errors (code, message, recovery hint) so the agent can self-correct without a human in the loop.

---

This article was first published, in French, on the [Ippon Technologies blog](https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/).
