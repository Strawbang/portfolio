---
title: "Model Context Protocol (MCP) : exposer un CLI Rust dans votre IDE"
description: "Retour d'expérience sur l'utilisation de MCP pour exposer un CLI Rust à un agent IA dans l'IDE — architecture, bonnes pratiques et implémentation TypeScript."
publishDate: 2026-03-11
tags: ["IA", "Software Engineering"]
keywords: ["MCP", "Rust", "TypeScript", "Agents IA", "Outils Développeur"]
img: "https://blog.ippon.fr/content/images/2026/03/mcp-cli-rust-ide-schema-architecture.png"
img_alt: "Architecture MCP : CLI Rust connecté à un IDE via un serveur MCP"
canonicalURL: "https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/"
draft: false
lang: fr
source: Ippon
relatedPosts: ["spec-driven-development"]
---

Cet article a été publié sur le [blog Ippon Technologies](https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/).

Le **Model Context Protocol (MCP)** permet d'exposer des outils internes à un agent IA directement dans l'IDE — sans plugin spécifique, sans intégration ad hoc. Plutôt que de donner des suggestions, l'agent peut exécuter de vraies actions sur votre codebase.

## Le problème que MCP résout

Les agents IA intégrés aux IDE sont excellents pour comprendre le contexte — analyser du code, expliquer des erreurs, suggérer des refactors. Mais dès qu'il faut exécuter une action réelle (lancer un script interne, déclencher une logique métier, valider des sorties), une boucle inefficace apparaît : l'agent propose → on exécute ailleurs → on recolle la sortie dans le chat. À chaque fois.

MCP comble ce fossé en fournissant un **standard pour exposer des capacités** — CLIs, APIs, services internes — via un contrat structuré directement consommable par un IDE ou un assistant IA.

## MCP vs REST : pas juste une API de plus

La différence n'est pas dans le format des messages, elle est dans le modèle d'intégration :

- **REST** expose des endpoints. L'orchestration est écrite côté client, le client est connu à l'avance, rien ne standardise l'usage par un agent.
- **MCP** expose des capacités déclarées (`tools`, `resources`, `prompts`). Le host les découvre dynamiquement, l'agent décide comment les enchaîner, les réponses sont structurées pour être interprétables et replanifiables.

REST expose des services. MCP expose des actions pilotables par des agents.

## Architecture : moteur / façade / cockpit

Dans notre implémentation chez Ippon :

- **CLI Rust** = le moteur : logique métier, performances, source de vérité. Rien ne change ici.
- **Serveur MCP TypeScript** = la façade : le contrat, la validation des paramètres, l'exposition des capacités via le SDK MCP.
- **IDE/agent** = le cockpit : l'orchestration et l'expérience utilisateur.

Une cible d'intégration unique remplace N plugins spécifiques à chaque IDE. Exposer un outil est étonnamment concis :

```typescript
server.tool("analyze_module", {
  inputSchema: { type: "object", properties: { module: { type: "string" } }, required: ["module"] }
}, async ({ module }) => {
  const result = await runCli(["analyze", module]);
  return JSON.parse(result);
});
```

## Pourquoi pas un plugin VSCode ?

L'approche "plugin intelligent" se heurte rapidement à des problèmes structurels : l'effet N-IDE (chaque host devient une cible), la duplication de logique métier qui diverge du CLI, le parsing fragile de stdout qui transforme des logs en API implicite, et le lock-in IDE. MCP inverse la posture : on part des capacités, pas de l'interface.

## 3 principes de design pour des outils agent-ready

1. **Outputs orientés décision** — ne pas dumper de l'état, renvoyer ce dont l'agent a besoin pour agir.
2. **Erreurs actionnables** — `code + message + recoveryHint` structurés pour que l'agent puisse se corriger sans intervention humaine.
3. **Tools atomiques et composables** — `analyze_module()` → `generate_patch()` → `apply_patch()` → `run_tests()`. Un outil, une intention. L'agent orchestre.

## Rendre un CLI agent-ready (3 changements)

1. **JSON-first sur stdout** — sortie machine stable et prévisible ; les logs humains vont sur stderr.
2. **Logs séparés** — ne pas mélanger résultat et logs de diagnostic.
3. **Erreurs catégorisées** — code d'erreur + message + hint de recovery.

Retrouvez l'article complet sur le blog Ippon : [Model Context Protocol (MCP) : exposer un CLI Rust dans votre IDE](https://blog.ippon.fr/2026/03/11/model-context-protocol-mcp-cli-rust-ide/)
