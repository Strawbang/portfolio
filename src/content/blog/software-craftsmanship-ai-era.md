---
title: "AI Broke Our Production Code. Here's the Craftsmanship Rule That Would Have Prevented It"
description: "An AI agent silently broke a 10-year-old business rule on a legacy Java codebase. No test caught it. It surfaced in production. Here's what that taught me about Software Craftsmanship, and why these principles matter more than ever when AI is writing your code."
publishDate: 2026-05-04
tags: ["Software Engineering"]
keywords: ["Software Craftsmanship", "Clean Code", "TDD", "Software Engineering", "Best Practices", "AI"]
img: "/assets/software-craftmanship-ai-era.png"
img_alt: "A developer reviewing code on screen, craftsmanship principles in the age of AI"
lang: "en"
relatedPosts: ["claude-code-jira-mcp-legacy-codebase", "spec-driven-development", "stack-standardization-80-percent-faster"]
---

When tools that generate code at scale become mainstream, it's tempting to assume the old rules no longer apply. Why obsess over naming when an AI can understand any variable name? Why write tests when the AI will rewrite the function anyway? Why refactor when generating a new implementation is faster than cleaning up the old one?

That reasoning is dangerous. And in my experience, the codebases that suffer most from AI-assisted development are the ones that abandoned discipline first.

## What Software Craftsmanship Actually Is

Software Craftsmanship, formalized in the [2009 manifesto](https://manifesto.softwarecraftsmanship.org/), is a set of professional standards: clean code, test-driven development, continuous refactoring, simple design, and collective ownership. It treats code as a craft: something you take pride in, something you maintain.

It's not about perfection. It's about professional responsibility.

## The Principles That Survived

After working with AI tools on production codebases for over a year, here's what I've found: the craftsmanship principles don't disappear. They become load-bearing.

### 1. Tests Are Your Only Safety Net

This was true before AI. It's critical now.

AI generates code quickly but without deep understanding of intent. It can produce code that passes manual review and silently breaks a business rule that was never written down. Tests are the only systematic way to catch this.

I've seen it directly. Working on a legacy Java codebase with no test coverage, an AI agent confidently refactored a calculation that had been running for years. The change looked correct, passed the linter, and introduced a silent regression on a business rule nobody had documented. There was no test to catch it. It surfaced in production. That session was the moment I stopped treating craftsmanship as optional when working with AI. I started treating it as the precondition.

TDD in particular changes the dynamic: writing the test first forces you to define what "correct" means before the AI proposes an implementation. The AI then has a target to hit. Without that target, you're reviewing code hoping it's right. That's not engineering, it's optimism.

I've stopped treating test coverage as a metric. I treat it as a precondition. If the AI makes a change that isn't covered by tests, either the tests come first or the change doesn't happen.

Some in the craftsmanship community argue that TDD doesn't apply the same way when AI is writing the code — and they're right that the *mechanics* change. The classic Red → Green → Refactor cycle was designed for a human writing both the test and the implementation, where the act of coding is itself a design activity.

With AI, that part changes. But the contract the test creates doesn't.

The test written before the implementation still defines what "correct" means. It still forces you to think through the expected behavior before generating anything. The AI writes the Green — but you own the Red. And the Refactor is entirely yours. What disappears is the design-through-implementation feedback loop. What remains — and what matters most on legacy codebases with AI — is the safety contract.

Concretely, before asking an AI to touch any business logic, I write a characterization test first:

```java
// Step 1: write the test that defines what "correct" means
@Test
void shouldApplyReducedVatRateForB2bGermanOrders() {
    Order order = Order.builder()
        .amount(new BigDecimal("1000"))
        .customerType(CustomerType.B2B)
        .country("DE")
        .build();

    BigDecimal vat = vatService.calculateVat(order);

    // Germany B2B: 19%, not the standard 20%
    assertThat(vat).isEqualByComparingTo(new BigDecimal("190"));
}

// Step 2: now the AI has a target — and a safety net
```

Without that test, the AI would have refactored `calculateVat()` to use a constant `VAT_RATE = 0.20`: clean, consistent, and silently wrong for every B2B German order.

### 2. Readability Is for the Next Human

AI can parse any code. Humans can't.

The argument "the AI understands it, so naming doesn't matter" confuses the tool with the process. When a bug surfaces at 2am, it's not the AI that's paged. When a new developer joins the team, they're reading the code in a PR review, not in a chat window. When your tech lead questions an architecture choice, they need to understand the intent, not just the mechanics.

Clean code is documentation that never goes stale. In AI-assisted development, where the volume of generated code increases, readability becomes a more valuable property, not less.

A variable named `result` is technical debt. A variable named `eligibleInvoicesForRecovery` is self-documenting. The AI doesn't care. Your team does.

```java
// What AI often generates — correct, unreadable
BigDecimal r = o.getA().multiply(getR(o.getC(), o.getT()));

// What craftsmanship demands
BigDecimal vatAmount = order.getSubtotal()
    .multiply(vatRateResolver.resolve(order.getCountry(), order.getCustomerType()));
```

The second version doesn't just look better. When the VAT bug surfaces at 2am, your colleague finds the right class in 10 seconds instead of 10 minutes.

### 3. Small Changes, Reversible by Default

AI tools love generating large changes. A single prompt can touch 20 files, rename 3 abstractions, and restructure 2 modules. This is genuinely useful, and genuinely dangerous.

The craftsmanship principle here is: *keep changes small and reversible*. One concept per commit. Tests before the refactor. A diff that a colleague can review in 15 minutes without losing context.

This is also where the Boy Scout Rule earns its keep: *leave the code a little better than you found it*. Not completely redesigned. Not fully modernized. Just a little cleaner. That discipline prevents the "AI did a big refactor while fixing a bug" problem that turns a routine PR into a 3-hour review session.

```bash
# What AI tends to produce: one massive, hard-to-review commit
git log --oneline
# a3f9c12 refactor order processing
# (touches: OrderService, VatCalculator, InvoiceGenerator,
#  PaymentProcessor, OrderRepository, OrderMapper — 847 lines changed)

# What craftsmanship looks like
# 1f2a3b4 PROJ-421: extract VatRateResolver from OrderService
# 8c9d0e1 PROJ-421: add B2B VAT rate for DE, AT, CH
# 2e3f4a5 PROJ-421: cover VatRateResolver with unit tests
# 7b8c9d0 PROJ-421: fix incorrect VAT rate on B2B German orders
```

The second history is reviewable, bisectable, and revertable. The first is a gamble.

### 4. Refactoring Is a Continuous Practice, Not a Sprint

AI-generated code tends toward duplication. Ask an AI to implement a feature, and it will often create a new version of something that already exists nearby. It's not wrong. It's responding to the immediate problem without knowing the full codebase.

The discipline is in the refactoring step that follows. Before merging, ask: does this duplicate something? Does this belong here? Is there a better abstraction?

This isn't the AI's job. It's yours. AI is good at executing. It's not good at knowing when something is already done correctly somewhere else in a 200k-line codebase. That's institutional knowledge. That's craftsmanship.

```java
// AI generated this in OrderService — looks fine in isolation
private BigDecimal applyDiscount(BigDecimal amount, String customerType) {
    if ("B2B".equals(customerType)) return amount.multiply(new BigDecimal("0.90"));
    return amount;
}

// But this already existed in PricingService — for 3 years
public BigDecimal applyCustomerDiscount(BigDecimal basePrice, CustomerType type) {
    return basePrice.multiply(discountConfig.getRateFor(type));
}
```

Two implementations of the same logic, diverging silently. The AI didn't know. You do — if you look.

### 5. Collective Ownership Requires Explicit Standards

The most underrated principle in the craftsmanship manifesto is collective code ownership: the idea that the whole team is responsible for the whole codebase, not just "their" modules.

AI tools make this harder by default. Everyone uses their own prompts, their own model, their own style. Without explicit shared standards, AI-assisted development accelerates divergence: different naming conventions, different test styles, different levels of abstraction in the same service.

The fix is explicit: a `CLAUDE.md`, a `CONTRIBUTING.md`, linting rules with no exceptions, PR templates that enforce the review checklist. These aren't bureaucracy. They're the scaffolding that makes collective ownership possible when part of the team is an AI.

```markdown
# CLAUDE.md (extract)

## Non-negotiable rules
- Never modify `LegacyOrderMapper` without characterization tests first
- All monetary values in **cents (Long)** — never BigDecimal in the DB layer
- VAT rates live in `VatRateConfig` — never hardcode them
- Do NOT add `@Transactional` to scheduler jobs — they hold connections for minutes

## Before any refactoring
1. Write tests that describe current behavior
2. Confirm tests pass on the unmodified code
3. Refactor
4. Confirm tests still pass
```

This file is the shared contract. Every developer reads it. The AI agent reads it. Standards stop being individual habits and become team infrastructure.

But `CLAUDE.md` is a *soft* constraint: the AI reads it if you configure it to. Linting rules are *hard* constraints: the CI breaks if anyone, human or AI, violates them.

For hexagonal architecture specifically, `eslint-plugin-boundaries` enforces layer isolation at the import level:

```js
// .eslintrc — architectural boundaries as linting rules
"boundaries/element-types": ["error", {
  default: "disallow",
  rules: [
    // Domain is pure: no external imports allowed
    { from: "domain", allow: [] },
    // Application layer can only depend on domain
    { from: "application", allow: ["domain"] },
    // Only adapters can touch infrastructure
    { from: "adapters", allow: ["application", "domain"] },
  ]
}]
```

If the AI generates `import { PrismaClient } from '@prisma/client'` inside your domain, the pipeline fails immediately, before review, before merge, before production. The architecture enforces itself.

For Java, you have three options depending on how far you want to go:

**ArchUnit** — enforced as a test assertion, useful on legacy codebases where restructuring isn't an option:

```java
@Test
void domainShouldNotDependOnInfrastructure() {
    noClasses().that().resideInAPackage("..domain..")
        .should().dependOnClassesThat()
        .resideInAPackage("..infrastructure..")
        .check(importedClasses);
}
```

**Multi-module Maven/Gradle** — structural enforcement. If `domain` doesn't declare `infrastructure` as a dependency, the import physically can't compile:

```xml
<!-- domain/pom.xml — infrastructure simply isn't here -->
<dependencies>
    <!-- no infrastructure dependency = no possible import -->
</dependencies>
```

**JPMS (Java 9+)** — the most native option. `module-info.java` declares exactly what each module can see. No `requires infrastructure` means a compile error, full stop:

```java
// domain/src/main/java/module-info.java
module com.example.domain {
    exports com.example.domain.model;
    exports com.example.domain.port;
    // no 'requires infrastructure' — import is a compile error
}
```

On a greenfield project, multi-module or JPMS is the right answer. ArchUnit shines on legacy codebases where you can't restructure yet but need the guardrail immediately.

This is the difference between *guidelines* and *governance*. `CLAUDE.md` tells the AI what to do. The linter — or the compiler — makes it impossible to do otherwise.

## What AI Actually Changes

To be fair: AI does change some things.

**Exploration is faster.** Understanding a new codebase, tracing a data flow, finding where a bug lives. AI compresses this from hours to minutes. This is genuinely good. The archaeology part of software work is the least craft-intensive part anyway.

**Boilerplate is gone.** Writing a CRUD endpoint, a DTO, a mapper — these things no longer require craft. They require a clear spec. That's a net positive: it shifts focus to where judgment actually matters.

**The craft is in the constraints.** The skill is no longer in typing. It's in defining what is correct before generating. The specification, the test, the `CLAUDE.md`, the review: these are the craft surfaces. They've always been the most important parts. AI just makes it obvious.

**The risk multiplies without discipline.** An undisciplined developer writes messy code slowly. An undisciplined developer with AI writes messy code fast. The volume of output increases, but so does the surface area for silent regressions, hidden coupling, and business rules broken by a confident model that had no test to tell it otherwise.

## The Responsibility Stays Yours

Here's what I've come to: AI doesn't reduce the responsibility of a senior developer. It moves it upstream.

Before: write the code, review the code, test the code.  
With AI: define what correct means, constrain the generation, validate the output.

The second loop requires just as much discipline. Possibly more. Because the output volume is higher, the review surface is wider, and the cognitive shortcuts are easier to take.

Software Craftsmanship is the discipline that keeps you honest in that loop.

The principles didn't get replaced. They became the job.

And if you're leading a team, your responsibility is double: not just practicing these standards yourself, but making them the baseline everyone — human and AI — operates from.

## Key Takeaways

- **Tests are a precondition, not a metric.** If the AI makes a change without test coverage, either tests come first or the change doesn't happen.
- **Readability is for humans, not models.** AI can parse anything. Your team can't. Clean code is documentation that never goes stale.
- **Keep changes small and reversible.** AI generates large diffs by default. Your discipline is in constraining it: one concept per commit, reviewable in 15 minutes.
- **Refactoring is your job, not the AI's.** AI doesn't know what already exists in a 200k-line codebase. You do.
- **Explicit standards enable collective ownership.** Without a `CLAUDE.md`, a `CONTRIBUTING.md`, and enforced linting, AI-assisted development accelerates divergence across your team.
- **The risk multiplies without discipline.** An undisciplined team with AI doesn't write bad code slowly — it writes bad code fast.
