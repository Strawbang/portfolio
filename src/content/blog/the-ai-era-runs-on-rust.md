---
title: "The AI Era Runs on Rust: Why Your Favorite Dev Tools All Switched"
description: "The tools you reach for every day keep turning out to be written in Rust: ripgrep, fd, uv, ruff, biome, and now a wave of AI tooling. It's not fashion. The AI era changed what a dev tool has to do, and those new demands happen to be exactly what Rust is good at."
publishDate: 2026-09-02
tags: ["Rust", "AI", "Software Engineering"]
keywords: ["Rust developer tools", "why Rust", "AI dev tooling", "ripgrep uv ruff biome", "Rust CLI tools", "single binary distribution", "Rust performance", "AI coding agents tooling"]
img: "/assets/blog/the-ai-era-runs-on-rust.webp"
img_alt: "A terminal showing a chain of Rust-based developer tools feeding an AI coding agent"
draft: true
lang: "en"
relatedPosts: ["semtree-local-semantic-code-search-rust", "why-i-left-the-ai-ide-for-the-terminal"]
relatedWork: ["rustkit-ai"]
---

Look at the tools you actually reach for in a day. Not the frameworks you argue about, the small sharp ones you invoke without thinking. `ripgrep` for search. `fd` for finding files. `uv` for Python environments. `ruff` for linting. `biome` for JavaScript formatting. Delta for diffs. There's a pattern hiding in that list, and once you see it you can't unsee it: they're almost all written in Rust.

For a while I filed that under fashion. Rust is the language people enjoy talking about, so of course the tools people talk about are written in it. But that explanation stopped holding up, because the trend accelerated exactly when something else did: the arrival of coding agents. That timing isn't a coincidence. The AI era quietly changed what a developer tool has to *do*, and the new job description reads like a list of Rust's strengths.

## The job changed under the tools

For most of my career, a CLI tool had one user: me. I typed it, I read the output, I moved on. Speed mattered a little, but "fast enough for a human" is a low bar. A quarter-second of startup is invisible when a person is driving.

Agents broke that bar. When a coding agent works, it invokes tools in a tight loop, dozens or hundreds of times per session, and it reads every byte of output as tokens it pays for. The tool is no longer talked to by a patient human once a minute. It's called by a machine in a hot path, and its output is consumed by another machine on a budget.

That single shift changes every requirement. Startup time that was invisible to me becomes a tax multiplied by a hundred calls. Output that a human skims becomes tokens an agent is billed for. A crash a human would shrug off and rerun becomes a broken step in an autonomous loop. The tool moved from *accessory* to *infrastructure*, and infrastructure is judged on different terms.

## Why those terms favor Rust

Once you frame dev tooling as infrastructure in an agent's hot path, Rust's advantages stop being abstract language-nerd talking points and become concrete operational wins.

### 1. Fast from the first byte, with no warm-up

There's no runtime to boot and no JIT to warm up. A Rust binary is at full speed on the first invocation. That's a modest nicety when you run a tool once. It's a real number when an agent runs it two hundred times in a session, or when CI spins it up fresh in every job. Cold-start performance, which almost nobody optimized for in the human era, turns out to matter a lot when the caller is a loop.

### 2. One static binary, nothing to install around it

This one is underrated and, for the AI era, maybe the most important. A Rust tool ships as a single self-contained binary. No `node_modules`, no virtualenv, no runtime of the right version installed on the host. An agent, a CI runner, or a colleague just downloads it and runs it. When your tools are being wired into automated environments that you don't control and can't babysit, "it's one file that runs anywhere" beats "it's fast" more often than you'd expect.

### 3. Predictable, because the loop can't afford surprises

No garbage-collector pauses, no mystery latency spikes, and a compiler that refuses to let whole categories of bugs through. In a human workflow, an occasional hiccup is a shrug. In an autonomous loop, a tool that crashes or hangs at step 40 poisons everything after it. The value of "it does not fall over" scales with how little supervision the caller has, and agents supervise their tools very little.

### 4. The building blocks are already there

This is the flywheel. The primitives you need to build AI tooling are increasingly Rust-native: `tree-sitter` for parsing, the `tokenizers` library, `candle` and `fastembed` for running embeddings on-device, `qdrant` for vector search. Each Rust-native building block makes the next Rust tool easier to write, which produces more building blocks. The ecosystem is compounding in exactly the corner where AI tooling lives.

## The honest counterpoint

If I stopped here it would read like a language pitch, and I don't think in those terms. Rust is not winning everywhere, and it shouldn't.

For glue code, a quick script, a one-off transformation, reaching for Rust is masochism. Python or a shell script will out-develop it every time, and development speed is the thing that matters for throwaway work. Rust's compile times are a real cost, and its learning curve is a real wall, especially if you came up in a garbage-collected world (I did, and [I've written about what that transition actually felt like](/blog/from-javascript-java-to-rust-what-clicked)).

So the claim isn't "Rust is eating software." It's narrower and, I think, more interesting: Rust is winning a *specific layer*. The hot, distributed, machine-invoked tooling layer, the one the AI era just made load-bearing. That's precisely the layer where fast-from-cold, single-binary, and doesn't-fall-over stop being preferences and start being requirements.

## Why I build my own tooling in Rust

This isn't a spectator take for me. When I moved my own agent workflow into the terminal, the pieces I had to build sat directly in the agent's hot path, and that made the language choice obvious.

[trimcp](https://github.com/rustkit-ai/trimcp) is an MCP proxy that sits between an agent and its tools and compresses what comes back, so the agent pays for signal instead of noise. A proxy on the hot path cannot itself be slow or flaky, or it defeats its own purpose. [semtree](https://github.com/rustkit-ai/semtree) does on-device semantic code search using tree-sitter and local embeddings, which only works because the Rust building blocks for parsing and embedding already exist. Both are part of [rustkit-ai](/work/rustkit-ai). I also lean on [RTK](https://www.rtk-ai.app/) (Rust Token Killer), an open-source CLI proxy I didn't build but wired into my setup, and it's telling that a third-party tool solving the same class of problem landed on the same language.

None of us coordinated that. We each independently reached for Rust because the problem, tooling in an agent's hot path, kept pointing there.

## The takeaway

The next time you notice that a tool you love is written in Rust, don't read it as fashion. Read it as a signal about what that tool is now expected to do. The AI era turned developer tooling into infrastructure, and infrastructure gets built on the language that's fast from cold, ships as one file, and doesn't fall over in a loop.

In the next post I'll go one level down and take apart a concrete example: [semtree](/blog/semtree-local-semantic-code-search-rust), and why doing semantic code search *on your own machine*, with no API keys, only became practical because of this same shift.

*trimcp and semtree are the Rust tooling I build under [rustkit-ai](/work/rustkit-ai). This is the first post in a short series on why Rust and the AI era found each other.*
