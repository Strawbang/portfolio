---
title: Ippon Technologies
publishDate: 2025-11-01 00:00:00
img: /assets/optimized/ippon.webp
imgType: logo
img_alt: Logo Ippon Technologies
role: Ingénieur Logiciel Full-Stack
startDate: 2025-11-01
description: |
  Conception et réalisation de Lumio chez Ippon Technologies : une plateforme IA qui documente les bases de code legacy (CLI Rust, application web et serveur MCP sur un même cœur), déployée auprès de plus de 120 consultants et proposée aux clients d'Ippon.
tags:
  - IA
  - Software Engineering
keywords:
  - Rust
  - TypeScript
  - IA
  - MCP
  - RAG
  - Tree-sitter
  - Node.js
  - APIs LLM
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

### Lumio : une plateforme IA pour les bases de code legacy

<p>Ippon Technologies est un cabinet de conseil d'environ 600 personnes, spécialisé dans le cloud et l'ingénierie logicielle pour de grands clients. Depuis novembre 2025, je partage mon temps entre les missions client et la R&D interne. La R&D a donné Lumio, une plateforme qui aide les ingénieurs à comprendre et moderniser des bases de code legacy, qu'Ippon propose aujourd'hui à ses clients (<a href="https://fr.ippon.tech/ia-advisory/lumio-documentation-legacy/" rel="noopener">page produit</a> ; <a href="https://fr.linkedin.com/posts/ippon-technologies_comprendre-une-application-ancienne-ou-un-activity-7511092942816669699-SSAH" rel="noopener">post de lancement sur LinkedIn</a>).</p>

#### Ce que fait Lumio

<p>Lumio importe une base de code depuis un dépôt Git, une archive jusqu'à 20 Go ou un chemin local, avec la sélection de sous-projets dans un monorepo. Il cartographie les dépendances et génère une documentation métier et technique liée au code, rafraîchie à chaque ré-indexation. Les ingénieurs l'interrogent en langage naturel via un chatbot ou en ligne de commande. Le moteur d'analyse s'appuie sur Claude Sonnet 4.6.</p>

#### Ce que j'ai construit

<p>J'ai conçu et construit tout le produit. Il a trois surfaces qui partagent un même cœur :</p>

<ul>
  <li><strong>Une CLI Rust</strong> qui analyse les bases de code avec tree-sitter, les découpe en suivant l'arbre syntaxique et les indexe pour la recherche.</li>
  <li><strong>Une application web</strong> où les ingénieurs indexent leurs projets, lisent la documentation générée, explorent un graphe du code et lui posent des questions.</li>
  <li><strong>Un serveur MCP</strong> qui donne le même index aux agents de code et aux assistants d'IDE, pour l'exploration, les tests et le refactoring.</li>
</ul>

<p>Autour de ce cœur, il y a ce qui en fait un produit plutôt qu'une démo : des espaces séparés par organisation, la gestion des utilisateurs et des accès, les logs, et le suivi de l'usage et du coût des LLM par organisation.</p>

<p>Le cœur est écrit en Rust pour qu'un seul moteur serve la CLI, l'application web et le serveur MCP, et pour que l'analyse de gros dépôts reste rapide. Tree-sitter rend le parsing indépendant du langage, ce qui compte quand les bases de code concernées mélangent plusieurs langages legacy.</p>

#### Où en est la plateforme

<p>Lumio est déployé en interne auprès de plus de 120 consultants, et Ippon le propose aujourd'hui à ses clients.</p>

#### Missions client

<p>En parallèle, je travaille en mission client, actuellement chez <a href="/fr/experiences/suez-iws/">Suez IWS</a> : un extranet B2B réglementé de suivi des déchets dangereux, où j'ai reconstruit la pipeline CI/CD et migré un front Liferay legacy vers des micro frontends Angular.</p>

#### Publications

<p>Je publie aussi des articles techniques sur le <a href="https://blog.ippon.fr/author/djamel-bougouffa/" rel="noopener">Blog Tech Ippon</a>, sur des sujets explorés pendant ces travaux de R&D.</p>
