---
title: "Spec-Driven Development : de la spécification au code avec l'IA"
description: "Découvrez le Spec-Driven Development (SDD) et comment l'IA, avec Kiro, transforme une spécification en code structuré et vérifié par les tests."
publishDate: 2026-02-18
tags: ["IA", "Software Engineering"]
keywords: ["Agents IA", "LLM", "Architecture", "Outils Développeur", "Kiro"]
img: "https://blog.ippon.fr/content/images/2026/02/spec-driven-developement.png"
img_alt: "Spec-Driven Development avec l'IA"
canonicalURL: "https://blog.ippon.fr/2026/02/18/spec-driven-development/"
draft: false
lang: fr
source: Ippon
relatedPosts: ["model-context-protocol-mcp-cli-rust-ide"]
---

Cet article a été co-écrit et publié sur le [blog Ippon Technologies](https://blog.ippon.fr/2026/02/18/spec-driven-development/).

Le **Spec-Driven Development (SDD)** propose un changement simple mais radical : la spécification devient la source de vérité du projet. Avant d'écrire du code, on décrit précisément ce que le système doit garantir. Ces garanties guident directement l'architecture, l'implémentation et les tests.

## L'idée centrale

Le SDD est une approche où la spécification formalisée — exigences, critères d'acceptation, invariants — devient l'artefact central du projet. Elle est versionnée avec le code et sert de référence pour le design, l'implémentation et les tests.

Ce qui définit réellement une approche Spec-Driven, ce n'est pas la présence d'un document « requirements ». Ce sont trois principes :

- **La spec agit comme un contrat** — si une implémentation s'en écarte, c'est un défaut, pas une variante acceptable.
- **Chaque décision est traçable** — un composant répond à une exigence, un test vérifie un critère d'acceptation, une validation protège un invariant.
- **La spec est vivante** — elle évolue au même rythme que le code, versionnée dans le même repository et intégrée au même cycle de revue.

## Le cycle SDD

Le cycle est itératif : **Spécifier → Planifier → Développer & Tester → Itérer**.

La discipline clé est de séparer le *quoi* du *comment* : on s'accorde sur les comportements attendus avant de débattre de la meilleure façon de les implémenter. Cela évite que l'architecture ne dicte accidentellement le produit.

## SDD vs BDD vs PDD

- **BDD** formalise le comportement via des tests (Given/When/Then). Le SDD organise tout le projet autour de la spec. Les deux peuvent coexister.
- **PDD** (Prompt-Driven Development) optimise l'échange avec l'IA via des prompts — efficace pour prototyper, mais le prompt est éphémère. Le SDD utilise les prompts comme outil, la spec reste la référence.

## Ce que l'IA change vraiment

Des outils comme **Kiro** permettent aujourd'hui d'organiser le travail autour de **Requirements → Design → Tasks**, rendant la spec un artefact actif plutôt qu'un document statique.

L'IA peut désormais :
- transformer une intention produit en exigences structurées
- dériver un design cohérent
- générer des tâches d'implémentation
- produire des tests alignés sur les critères d'acceptation
- vérifier que le code respecte toujours la promesse initiale

La spécification cesse d'être un poids. Elle devient un accélérateur.

Retrouvez l'article complet sur le blog Ippon : [Spec-Driven Development : de la spécification au code avec l'IA](https://blog.ippon.fr/2026/02/18/spec-driven-development/)
