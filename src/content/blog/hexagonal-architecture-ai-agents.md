---
title: "Hexagonal Architecture Is the Best Gift You Can Give an AI Agent"
description: "Ports and adapters weren't designed for AI. But isolating your business logic behind clean boundaries turns out to be the single most effective way to let a coding agent work fast without wrecking your domain. Here's why, with a real Java before/after."
publishDate: 2026-07-08
tags: ["AI", "Software Engineering", "Architecture"]
keywords: ["hexagonal architecture AI agents", "ports and adapters", "AI coding agents", "Claude Code", "agent-friendly architecture", "legacy Java refactoring", "AI code review", "software design for AI"]
img: "/assets/blog/hexagonal-architecture-ai-agents.webp"
img_alt: "A hexagonal ports-and-adapters diagram with an AI agent working on the outer adapters while the domain core stays protected"
draft: false
lang: "en"
relatedPosts: ["software-craftsmanship-ai-era", "claude-code-jira-mcp-legacy-codebase", "stack-standardization-80-percent-faster"]
relatedWork: ["rustkit-ai"]
---

We adopted hexagonal architecture for the humans who would read the code later. It turns out we also built it for a reader we didn't see coming: the AI agent working on the codebase today.

I didn't plan this. I noticed it. The same coding agent, given the same kind of task, behaved completely differently depending on the shape of the code it landed in. In a tangled codebase it was a liability. In a cleanly layered one it was genuinely fast and genuinely safe. The difference wasn't the model, the prompt, or the tooling. It was the architecture.

This is the case for why **ports and adapters is the best gift you can give an AI agent**, and the honest limits of that claim.

## The same task, two codebases

Give an agent this task: *"Add a Slack notification when an order ships."*

In a tangled service, the shipping logic, the persistence, and the outbound calls all live in one 600-line class. The agent reads it, decides the natural place to hook in is right after the status update, and edits there. It works. It also quietly moves a line, changes when the `shippedAt` timestamp is set, and now a ten-year-old billing rule that keyed off that timestamp fires a day early. No test caught it, because the test asserted "an email is sent," not "the timestamp is untouched." It surfaces in production. (If that failure mode sounds familiar, it's because [I've watched an agent silently break an undocumented business rule in production](/blog/software-craftsmanship-ai-era): a different rule, the same shape of mistake.)

In a hexagonal codebase, the same task is boring in the best way. There's a `NotificationPort` interface. The agent implements a `SlackNotificationAdapter`, wires it in, and never touches the domain at all. The business rule about `shippedAt` lives in a pure core the agent had no reason to open. The blast radius of the change was bounded *by the architecture*, before the agent typed a character.

That's the whole thesis. The rest of this post unpacks why the second story happens by design, not by luck.

## Why hexagonal works *for an agent* specifically

Hexagonal architecture is old news for humans. What's new is that its exact properties happen to be the ones an AI agent needs most.

### 1. It bounds the blast radius

An agent's biggest failure mode isn't writing wrong code: it's writing plausible code in the wrong place. It optimizes locally for "make the task work" and has no instinct for what it's endangering three layers away.

Ports and adapters answer that structurally. The domain has no outward dependencies; all the volatile stuff (HTTP, the database, third-party APIs, message queues) lives in adapters on the outside. So the surface where an agent *should* work (adapters) is physically separated from the surface it should almost never touch (the domain core). You're not hoping the agent respects a boundary. The boundary is load-bearing.

### 2. The core is testable in isolation, so the agent has a fast feedback loop

A pure domain, free of I/O, can be tested without spinning up a database or a web server. That matters more for an agent than for you, because the agent's whole working loop is *edit → run → read the result → correct*. The faster and more focused that loop, the better the agent performs.

When the business logic is a pure core, the agent can write a test, run it in milliseconds, and get an unambiguous signal: "the rule still holds" or "it doesn't." When the logic is smeared across an infrastructure-coupled class, the only way to test it is an integration test that's slow, flaky, and vague about *what* broke. A good architecture gives the agent a truth oracle. A bad one gives it a shrug.

### 3. The ports name the work in the domain's language

A `PaymentGateway` port with `authorize(Payment)` and `capture(Payment)` tells an agent what the system does in business terms. A tangle of `HttpClient` calls and DTO mapping tells it nothing except how the plumbing happens to be wired this week.

LLMs are exceptionally good at following well-named intent and easily lost in incidental complexity. Ports are, in effect, a curated interface an agent can reason about, the same reason [ubiquitous language](/blog/claude-code-jira-mcp-legacy-codebase) helps a human onboard. You're not just organizing code; you're handing the agent a map written in the right vocabulary.

## What it looks like in Java

Here's the tangled version an agent will happily damage:

```java
// OrderService.java: everything in one place
public void ship(Long orderId) {
    Order order = jpaRepository.findById(orderId).orElseThrow();
    order.setStatus(SHIPPED);
    order.setShippedAt(Instant.now());        // billing keys off this
    jpaRepository.save(order);
    // agent adds its feature right here, next to the timestamp it doesn't understand
    emailClient.send(order.getCustomerEmail(), "Your order shipped");
}
```

And the hexagonal version, where the same feature has an obvious, safe home:

```java
// Domain core: pure, no framework, no I/O
public final class ShipOrder {
    private final OrderRepository orders;      // a port
    private final NotificationPort notifier;   // a port

    public void handle(OrderId id) {
        Order order = orders.byId(id);
        order.markShipped();                   // the shippedAt rule lives inside Order
        orders.save(order);
        notifier.orderShipped(order);          // the agent extends behind this port
    }
}

// Adapter: the only file the agent needs to add
public final class SlackNotificationAdapter implements NotificationPort {
    public void orderShipped(Order order) { /* Slack call */ }
}
```

The domain didn't move. `markShipped()` still owns the timestamp rule, sealed inside the aggregate. The agent adds one adapter, implements one method, and there was never a path for it to disturb the invariant. Not because it was careful, but because the architecture never offered it the rope.

## The honest limits

A thesis this tidy deserves some pushback, so let me bound it before you over-apply it. Three caveats I hold to:

- **Hexagonal has a ceremony cost.** For a small script or a throwaway service, the ports-and-adapters overhead is pure friction, and an agent working in a two-file project doesn't need it. This pays off on real domains with rules worth protecting, not everywhere.
- **Leaky ports leak the protection.** If your "port" is really a JPA entity or an HTTP response object in disguise, the domain isn't isolated and neither is the agent's blast radius. The architecture helps *to the exact degree that it's honest.* Half-hexagonal gives you half the guardrail.
- **It reduces the blast radius; it doesn't remove it.** An agent can still write a wrong domain rule inside a perfectly pure core. Good boundaries make bad changes *contained and visible*, not impossible. You still review. You still own the output.

## The shift worth naming

For twenty years we justified clean boundaries with an argument about the future: *someone will have to maintain this.* The payoff was always deferred, which is why the discipline was always the first thing dropped under deadline pressure.

The AI agent collapses that timeline. The maintainer you were building for is now working in your repo this afternoon, and the code's architecture directly determines whether that agent is an accelerator or a hazard. Good structure stopped being a gift to a hypothetical future engineer. It's leverage you cash in today.

So the surprising conclusion is the least surprising advice in software, with new stakes: **isolate your domain.** Not because a book said so, but because the thing now writing half your code performs exactly as well as your boundaries let it. Hexagonal architecture was always good craftsmanship. It's now also the interface through which your agents do their best work.

*This connects to two things I've written before: [why architecture discipline matters more, not less, when AI writes the code](/blog/software-craftsmanship-ai-era), and [how I take a legacy Java codebase from ticket to pull request with an agent](/blog/claude-code-jira-mcp-legacy-codebase).*
