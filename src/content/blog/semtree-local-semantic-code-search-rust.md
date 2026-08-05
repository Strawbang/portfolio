---
title: "semtree: Semantic Code Search That Runs on Your Machine, No API Keys"
description: "An agent on a big repo can waste half a session just rediscovering structure, because grep matches words, not meaning. semtree gives it semantic code search that runs entirely on your machine: tree-sitter parsing, local embeddings, an HNSW index, no cloud, no keys. Here's how it works and why Rust is what made it practical."
publishDate: 2026-09-09
tags: ["Rust", "AI", "Software Engineering"]
keywords: ["semantic code search", "semtree", "on-device embeddings", "tree-sitter", "HNSW", "local code search Rust", "AI agent code context", "fastembed", "vector search offline"]
img: "/assets/blog/semtree-local-semantic-code-search-rust.webp"
img_alt: "A diagram of code being parsed by tree-sitter, embedded locally, and indexed for semantic search"
draft: true
lang: "en"
relatedPosts: ["the-ai-era-runs-on-rust", "why-i-left-the-ai-ide-for-the-terminal"]
relatedWork: ["rustkit-ai"]
---

Give a coding agent a real repository and watch where the time goes. A surprising amount of it isn't spent writing code. It's spent *finding* the code: greping for a symbol, opening the wrong file, greping again with a different guess, following an import, backing out. On a small project that's a few seconds. On a large or legacy codebase it can eat half a session, and every one of those dead-end reads is tokens you paid for.

The root cause is simple and old: `grep` matches words, not meaning. If the logic you want is called `computeInvoiceTotal` and you search for "billing," you get nothing, even though that function *is* the billing. A human bridges that gap with memory and intuition. An agent dropped into an unfamiliar repo has neither. It needs a way to ask "where is the code that does X?" and get an answer based on what the code *means*, not which words happen to be in it.

That's the gap [semtree](https://github.com/rustkit-ai/semtree) fills, and the interesting part is the constraint I put on it: it all runs on your own machine. No cloud, no API keys, nothing leaves your laptop. This post is how that works, and why it only became practical because of the Rust shift I wrote about in [the last post](/blog/the-ai-era-runs-on-rust).

## What "semantic" actually buys you

Lexical search asks: which files contain these characters? Semantic search asks: which pieces of code are *about* this idea? The difference is the difference between searching for "germany vat" and finding a function called `applyEuReverseCharge` because the model understands that EU reverse-charge VAT and Germany-B2B tax live in the same conceptual neighborhood.

You get there by turning code into vectors. Each chunk of code is run through an embedding model that maps it into a high-dimensional space where "closeness" means "similar in meaning." Your query gets embedded the same way, and the search becomes: find the chunks whose vectors sit nearest to the query's. Now "where's the billing logic?" returns `computeInvoiceTotal` even though the two share no words.

That's not a new idea. What was hard was doing all of it locally, fast, with no cloud dependency. That's where the engineering lives.

## The three pieces, and why each one is deliberate

semtree is really three stages, and I chose each to keep the whole thing on-device.

### 1. Chunking with tree-sitter, not by line count

Most naive approaches split code into fixed-size windows, say every 50 lines. That's easy and it's wrong, because it slices functions in half and glues unrelated fragments together, and the embeddings you get are mush. semtree parses each file with [tree-sitter](https://tree-sitter.github.io/) and chunks along the *syntax tree*: a function, a method, a class becomes a coherent unit. The embedding then describes a real semantic thing instead of an arbitrary window. Tree-sitter is itself a Rust-friendly, language-agnostic parser, which is exactly why this is cheap to do across many languages.

### 2. Embeddings that run on your machine

This is the constraint that shapes everything. The obvious way to embed code is to call a cloud embedding API. It's also the way that ships your proprietary source code to a third party, adds per-call latency, costs money per index, and stops working on a plane. semtree uses local embedding models via [fastembed](https://github.com/qdrant/fastembed), so the vectors are computed on your own CPU. Your code never leaves the machine. There's a quality trade-off, which I'll be honest about below, but for code search the local models are more than good enough, and "good enough and private and free" beats "marginally better and leaky and metered."

### 3. An HNSW index for nearest-neighbor search

Once every chunk is a vector, "find the nearest ones to my query" has to be fast even with tens of thousands of chunks. A brute-force scan works but scales badly. semtree uses an HNSW (Hierarchical Navigable Small World) index, the standard structure for approximate nearest-neighbor search, which gets you results in milliseconds instead of a linear scan. The whole index lives on disk next to your repo. No vector database to stand up, no service to run.

The result: the agent asks a question in plain terms, and semtree hands back the handful of code chunks that actually mean what it asked, in the time it takes to run a normal command.

## Why this is a Rust story, not just an AI story

I could have prototyped this in Python in an afternoon. I didn't, and the reason connects straight to the previous post: this tool lives in an agent's hot path.

An agent might query the index many times per session, so the search has to be fast from cold with no runtime to boot. It has to ship as a single binary an agent can just run, with no Python environment to reconcile on whatever machine it lands on. And the heavy lifting, tree-sitter parsing and embedding inference, has building blocks that are already native and fast in Rust. On-device embeddings that would be sluggish in a scripting language are practical when the parsing, the model inference, and the index all run as compiled code with no glue-language tax between them. The privacy and cost win (nothing leaves your machine, nothing is metered) is only worth having if the local version is also fast, and Rust is what makes the local version fast.

## The honest limits

Semantic search is not magic, and I'd rather you know its edges than be disappointed by them.

- **It's a recall tool, not an oracle.** semtree gets the agent to the right *neighborhood* fast. It doesn't replace reading the code or understanding the call graph; it removes the blind fumbling that comes before that.
- **Local embeddings trade a little quality for a lot of independence.** The biggest cloud embedding models are stronger. For ranking code by conceptual similarity, the gap is small and, in my experience, not worth the price of shipping your source code off-machine.
- **The index has a build cost.** You pay once to parse and embed the repo, and you keep it fresh as the code changes. That's a real cost, amortized over every search that follows.
- **It complements grep, it doesn't retire it.** When you know the exact symbol, `grep` is still the right, instant answer. Semantic search earns its keep precisely when you *don't* know the word.

## The takeaway

The reason semtree can run entirely on your machine, with no keys and no cloud, isn't a clever trick. It's that the building blocks for on-device parsing, embedding, and vector search have all become fast and Rust-native at the same moment agents made local, private, hot-path tooling worth building. That's the whole thread of this series in one tool: the AI era created the need, and the Rust ecosystem quietly made meeting it locally practical.

Next, and last in this series, I'll get personal about the language itself: [what actually clicked when I moved from JavaScript and Java to Rust](/blog/from-javascript-java-to-rust-what-clicked), and what didn't.

*semtree is open source and part of [rustkit-ai](/work/rustkit-ai), the org where I build my Rust tooling for AI-assisted development.*
