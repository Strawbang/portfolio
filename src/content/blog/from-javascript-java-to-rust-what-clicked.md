---
title: "From JavaScript and Java to Rust: What Finally Clicked"
description: "I came up in garbage-collected languages, bounced off Rust twice, and only got it on the third try. This is the honest account of what finally clicked, what stayed hard, and why the language taught me more about JavaScript and Java than about Rust."
publishDate: 2026-09-16
tags: ["Rust", "Software Engineering"]
keywords: ["Rust for JavaScript developers", "Rust for Java developers", "learning Rust", "borrow checker", "Rust ownership", "from JavaScript to Rust", "Result error handling", "Rust learning curve"]
img: "/assets/blog/from-javascript-java-to-rust-what-clicked.webp"
img_alt: "A developer's path from JavaScript and Java into Rust, with the borrow checker as the turning point"
draft: true
lang: "en"
relatedPosts: ["the-ai-era-runs-on-rust", "why-developers-should-learn-architecture-ai-era"]
relatedWork: ["rustkit-ai"]
---

I came up in garbage-collected languages. JavaScript paid my bills for years, Java built the serious backends, and in both I never once thought about who *owned* a piece of memory. I allocated things, used them, and trusted a runtime to clean up behind me. That's not laziness, it's the whole point of those languages, and it worked.

So my first contact with Rust went the way it goes for a lot of people from that world: I bounced off it. Hard. I wrote something trivial, the borrow checker rejected it, I fought the compiler for an hour, I decided the language was hostile to getting things done, and I closed it. I did that twice, months apart. It stuck on the third try, and the thing that changed wasn't my skill. It was my *framing*. This is what finally clicked, and, just as honestly, what didn't.

## The reframe that unlocked it

For two attempts I read the borrow checker as a bouncer: an obstacle standing between me and running code, enforcing rules for its own sake. Every rejection felt like the language being difficult on purpose.

The third time, the reframe was this: the borrow checker isn't inventing rules, it's forcing me to *write down decisions I was already making, and often getting wrong*. In Java and JavaScript I was constantly making ownership decisions, who's allowed to mutate this, how long does it need to live, can two things hold it at once, I just made them implicitly and discovered my mistakes at runtime, as a race condition, a stale reference, a mutation someone else didn't expect. Rust drags every one of those decisions to compile time and makes me state it out loud.

The moment I stopped reading the compiler as an adversary and started reading it as a checklist of questions I should have been answering anyway, the fight ended. I wasn't fighting the borrow checker. I was being asked to be explicit about things I'd spent a career leaving vague.

## What clicked, concretely

Beyond the ownership reframe, a few specific things flipped from friction to feature.

**Errors as values, not surprises.** In Java an exception can erupt from anywhere and unwind through code that never mentioned it. In Rust, a function that can fail says so in its return type with `Result`, and I have to handle it or explicitly pass it up. At first this felt like ceremony. Then I realized it's just honesty: the failure paths are written into the types instead of hiding behind a stack trace I discover in production.

**Making bad states impossible to write.** Coming from TypeScript, I already liked union types. Rust's enums took that further than I expected. I can model a thing so that its invalid combinations simply don't exist in the type system, and the compiler forces me to handle every case with pattern matching. A whole category of "but what if it's in this weird half-state" bugs stops being possible rather than being caught.

**No null.** The billion-dollar mistake is just absent. Absence is a type, `Option`, that you have to open before you can use what's inside. After years of defensive null checks in Java and `undefined` surprises in JavaScript, the compiler simply refusing to let me forget is a quiet relief.

## What stayed hard, and I won't pretend otherwise

If I only told you about the enlightenment, I'd be doing the same dishonest thing the "Rust changed my life" posts do. Several things stayed genuinely hard.

- **Compile times.** They're a real cost. The fast inner loop I had in JavaScript, save and see it instantly, is gone. You adapt, but you pay.
- **Lifetimes in anger.** The basic borrow rules click fast. Explicit lifetime annotations in more involved code took much longer, and I still occasionally restructure code to avoid a fight I could technically win.
- **Async Rust.** Async has rough edges that the synchronous language doesn't. It's usable and improving, but it's the part where I most often feel the language is younger than Java's ecosystem.
- **The upfront tax is real.** For the first couple of weeks I was slower in Rust than I'd have been in a language I already knew. That's not a footnote, it's the actual barrier, and pretending it away helps no one deciding whether to invest.

## Was it worth it?

For me, clearly yes, but I want to be precise about *why*, because "learn Rust" as blanket advice is how people end up frustrated.

It was worth it because of exactly the layer this series has been about: the tooling I build for AI-assisted development sits in an agent's hot path, and there Rust's demands stop being annoyances and become the reason the tools are fast, single-binary, and reliable. If I were writing glue scripts or a quick backend, I would not reach for it, and I'd tell you the same.

But there's a second payoff I didn't expect, and it's the one I'd actually sell to a JS or Java developer on the fence. **Rust made me better in the languages I already knew.** After being forced to be explicit about ownership, lifetimes, and failure, I write clearer Java and more deliberate JavaScript. I think about who mutates what and where things can fail *before* runtime tells me, because Rust trained the reflex. You don't have to migrate your career to Rust to get that. You have to spend enough time in it to internalize the questions it refuses to let you dodge.

If you want to try, one piece of concrete advice: don't grind through toy exercises. Build one small *real* tool you'd actually use, a CLI you reach for, and let the borrow checker teach you on real problems. And budget two or three weeks of feeling slow. The clicking happens on the far side of that, not before it.

## The takeaway

I didn't fall in love with Rust because it's elegant or fast, though it's both. I stuck with it because it forced into the open a set of decisions I'd been making badly and invisibly for years. The borrow checker I once read as a gatekeeper turned out to be a teacher, and the lesson transferred back to every language I use.

That closes this little series on Rust and the AI era: [why the tools switched](/blog/the-ai-era-runs-on-rust), [what that looks like in one tool](/blog/semtree-local-semantic-code-search-rust), and now what it took to actually learn the language underneath them.

*The Rust tooling I build lives at [rustkit-ai](/work/rustkit-ai). If you're a JS or Java developer weighing the jump, the honest summary is: hard for two weeks, worth it for a lifetime of clearer thinking.*
