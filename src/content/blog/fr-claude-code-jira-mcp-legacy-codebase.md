---
title: "Comment j'utilise Claude Code et Jira MCP pour moderniser les codebases legacy"
description: "Un retour d'expérience concret sur mon workflow avec Claude Code, CLAUDE.md et le Jira MCP pour naviguer et implémenter des changements dans des codebases Java legacy — du ticket à la pull request."
publishDate: 2026-04-28
tags: ["IA", "Software Engineering"]
keywords: ["Claude Code", "MCP", "Jira", "Java", "Legacy Code", "IA"]
img: "/assets/claude-code-jira-mcp-legacy-code.png"
img_alt: "Session Claude Code dans le terminal naviguant une codebase legacy avec le Jira MCP"
lang: "fr"
draft: true
---

Le code legacy, c'est le squelette de chaque entreprise qui a réussi. Il gère la facturation, traite les commandes, et contient des règles métier que personne ne comprend plus vraiment depuis des années. Il ne va nulle part — et c'est précisément pour ça que le moderniser est essentiel.

Depuis plusieurs mois, j'utilise **Claude Code** avec le **Jira MCP** et un `CLAUDE.md` soigneusement rédigé pour naviguer et implémenter des changements dans des codebases Java legacy. Cet article est un retour concret sur ce workflow — comment ça se passe, pourquoi ça fonctionne, et où ça échoue encore.

![Schéma du workflow : le Jira MCP et CLAUDE.md alimentent Claude Code, qui navigue la codebase legacy et produit une pull request](/assets/blog/claude-code-jira-mcp-workflow.svg)

## Le problème avec le code legacy

Avant de parler du setup, il faut nommer le vrai problème. Le code legacy n'est pas difficile parce qu'il est vieux. Il est difficile à cause de tout ce qui l'entoure :

- **Aucune documentation** (ou pire, une doc qui ment)
- **Règles métier implicites** enfouies dans des conditions que personne n'ose toucher
- **Pas de tests** qui confirmeraient que ton changement ne casse rien
- **Les auteurs originaux sont partis**, leur connaissance est partie avec eux
- **La peur**, le vrai tueur de vélocité sur les projets legacy

L'approche classique c'est de lire le code, poser des questions, et faire des changements prudents. Ça marche, mais c'est lent. Un agent IA ne résout pas tout ça, mais il réduit drastiquement le temps passé sur la phase d'archéologie.

## Le stack

Mon setup comporte trois éléments :

### 1. Claude Code

[Claude Code](https://claude.ai/code) est l'outil de coding agentique d'Anthropic. Il tourne dans ton terminal, a accès à ton système de fichiers, peut exécuter des commandes, et itère de lui-même. Contrairement à une interface de chat, il ne se contente pas de suggérer du code — il lit des fichiers, fait des modifications, lance des tests, et corrige des erreurs.

Ce qui le rend puissant pour le travail legacy, c'est sa capacité à naviguer une large codebase sans que je lui dicte chaque étape. Je lui donne une tâche et du contexte, il détermine quels fichiers lire.

### 2. CLAUDE.md — Le manuel du projet

Chaque projet reçoit un `CLAUDE.md` à la racine. Ce fichier, c'est le document d'onboarding de Claude Code. Il indique à l'agent ce qu'il doit savoir avant de toucher quoi que ce soit.

Voici le type de contenu que je mets dans un `CLAUDE.md` pour un projet Java enterprise typique :

```markdown
## Vue d'ensemble

Application Spring Boot multi-modules Maven, Java 17.
Deux bases de données : PostgreSQL (données applicatives) + Oracle (ERP legacy, lecture seule).
Tous les services tournent en Docker en local.

## Commandes du quotidien

### Environnement
docker compose up -d          # démarre tous les conteneurs
docker compose logs -f api    # suit les logs de l'API
docker compose down           # arrête tous les conteneurs

### Build & run
./mvnw clean install -DskipTests   # build complet
./mvnw -pl api spring-boot:run     # lance uniquement le module api
./mvnw test -pl api                # lance les tests unitaires du module api

### Base de données
# PostgreSQL — localhost:5432, base: appdb, user: appuser
./scripts/db-reset.sh              # drop + recréation + seed en local
./scripts/db-load-dump.sh prod     # charge un dump prod anonymisé (~5min)

# Oracle (ERP legacy) — lecture seule, localhost:1521
# Ne jamais écrire directement — utiliser le wrapper OracleService dédié

## Architecture
- api/          Contrôleurs REST + logique métier
- domain/       Entités, repositories (Spring Data JPA)
- integration/  Adaptateurs vers l'ERP Oracle (polling via Apache Camel)
- scheduler/    Jobs batch (Spring Batch)
- common/       DTOs, utils, constantes partagées

## Points sensibles
- L'ERP Oracle est en lecture seule — ne jamais tenter d'écriture, ça corrompt les données en aval
- OrderService.createOrder() n'est PAS idempotent — toujours vérifier les doublons avant
- LegacyCodeMapper utilise la réflexion, ajouter des champs casse silencieusement sans tests
- Ne PAS ajouter @Transactional aux jobs scheduler — ils gardent les connexions ouvertes des minutes

## Git
Branches : main (prod), develop (intégration), PROJ-XXXX-description-courte (feature)
Commits : toujours préfixer avec le ticket — "PROJ-123: ajout calcul TVA commandes EU"
Push : --force-with-lease uniquement, jamais --force
```

Ce fichier fait la différence entre Claude Code qui fait un changement correct et confiant, et un agent qui casse quelque chose par ignorance. Plus tu es précis, meilleurs sont les résultats.

La section **points sensibles** est la plus précieuse. Ce sont les choses qu'un nouveau développeur mettrait des semaines à découvrir. Les écrire une fois protège tout le monde — y compris l'agent — des régressions douloureuses.

### 3. Jira MCP

Le [Jira MCP](https://github.com/sooperset/mcp-atlassian) expose ton projet Jira comme un ensemble d'outils que Claude Code peut appeler. Concrètement, ça signifie que Claude Code peut :

- Lire la description du ticket, les critères d'acceptance et les commentaires
- Comprendre le contexte complet avant d'écrire la moindre ligne
- Référencer les tickets liés et les sous-tâches
- Poster un commentaire avec un résumé de ce qui a été fait

Mais la chose la plus puissante que j'ai construite par-dessus, c'est un **skill custom dans `CLAUDE.md`** :

```markdown
## Skills disponibles

| Commande                    | Description                                                  |
|-----------------------------|--------------------------------------------------------------|
| `/tester-ticket <PROJ-XXXX>`| Lance les tests Playwright des critères d'acceptance Jira    |
| `/mr-push [app\|connector]` | Amend + rebase + force-push with lease                       |
| `/mr-comment [répondre\|poster]` | Lit et répond aux commentaires de MR GitLab             |
| `/build [app\|connector]`   | Build l'app ou le connecteur                                 |
| `/sonar [app\|connector]`   | Analyse SonarQube locale                                     |
```

Le skill `/tester-ticket` est celui qui a changé ma façon de travailler. Je lui donne une référence de ticket, Claude Code lit les critères d'acceptance depuis Jira, identifie les fichiers Playwright correspondants, les lance, et rapporte les résultats. La boucle complète — écrire le code, tester contre le ticket réel — sans quitter le terminal.

**Mise en garde honnête cependant** : il brûle beaucoup de tokens par exécution. Lire le ticket, naviguer les fichiers de test, lancer Playwright, interpréter les résultats — tout ça s'accumule. Sur un ticket complexe avec plusieurs critères d'acceptance, une seule exécution de `/tester-ticket` peut coûter plus que tout le reste de la session réunis. Je l'utilise encore, mais de façon sélective — pas comme étape par défaut à chaque changement.

## Le workflow : du ticket à l'implémentation

Voici à quoi ressemble une session type.

### Étape 1 — Démarrer avec une référence de ticket

J'ouvre un terminal à la racine du projet et je lance Claude Code avec un prompt simple :

```
Lis le ticket JIRA PROJ-4821 et implémente le changement demandé.
Utilise CLAUDE.md pour le contexte du projet avant de toucher des fichiers.
```

C'est tout. Claude Code lit d'abord `CLAUDE.md`, puis appelle le Jira MCP pour récupérer le ticket, lit la description et les critères d'acceptance, et commence à explorer la codebase.

### Étape 2 — Claude Code explore la codebase

À partir du contenu du ticket, l'agent recherche les fichiers pertinents. Pour un ticket comme *"Corriger le calcul de TVA incorrect pour les commandes B2B en Allemagne"*, il va :

1. Chercher `TVA`, `tax`, `germany`, `B2B` dans toute la codebase
2. Lire les fichiers de service et de modèle concernés
3. Suivre la chaîne d'appels pour comprendre ce qui alimente le calcul
4. Vérifier s'il existe des tests pour ce flux

C'est la phase d'archéologie. La faire manuellement prend 30 à 60 minutes sur une codebase inconnue. Claude Code le fait en 2-3 minutes.

### Étape 3 — Implémentation avec des guardrails

Claude Code propose des changements basés sur ce qu'il a trouvé. Parce que `CLAUDE.md` établit les contraintes (pas de Lombok, montants en centimes, ne pas toucher les tables `legacy_`), les changements respectent les conventions existantes du projet.

Si l'agent est incertain, il demande. S'il trouve quelque chose de suspect dans le code qui pourrait être lié au ticket, il le signale.

### Étape 4 — Review et itération

Je review le diff, lance les tests, et itère. Claude Code ne remplace pas la review — il compresse le temps passé avant la review.

## Ce qui fonctionne vraiment bien

Après plusieurs mois d'utilisation de ce workflow, voici ce qui apporte de la valeur de manière constante :

**Comprendre les flux de données :** tracer comment une valeur passe de la base de données à la réponse API à travers 8 couches de services est fastidieux. Claude Code le fait bien.

**Écrire des tests pour du code non testé :** c'est sous-estimé. Avant de faire un changement, je demande à Claude Code d'écrire des tests de caractérisation pour le code concerné. Il lit le comportement existant et écrit des tests qui le décrivent. Ces tests détectent les régressions pendant le changement.

**Faire remonter le code associé :** l'agent trouve souvent du code lié au ticket mais non mentionné dedans. Logique dupliquée, code mort, une fonction similaire dans un autre module. Cette connaissance s'accumule avec le temps.

**Traduire le langage du ticket en code :** les parties prenantes métier rédigent des tickets en langage business. Les développeurs doivent traduire mentalement. Claude Code comble ce fossé plus efficacement que je ne l'aurais anticipé.

## Ce qui ne fonctionne pas encore

L'honnêteté s'impose ici. Ce workflow n'est pas magique.

**Les règles métier implicites :** si la règle n'est pas écrite (dans `CLAUDE.md`, les commentaires, ou les tests), Claude Code ne l'inférera pas depuis les patterns du code. Une codebase legacy pleine d'hypothèses silencieuses le reste.

**Les modules fortement couplés :** quand tout dépend de tout, l'agent a du mal à faire un changement ciblé sans trop toucher. La solution, c'est l'architecture, pas le prompt.

**Le coût en tokens des boucles de test automatisées :** automatiser le cycle complet test-contre-ticket est techniquement impressionnant mais coûteux. Plus le contexte que l'agent doit charger est important (ticket + fichiers de test + output Playwright), plus ça brûle de tokens. Certaines automatisations qui semblent parfaites sur le papier ne survivent pas au contact d'une vraie facture mensuelle.

**L'opération 100% autonome :** Claude Code est un junior développeur senior. Il est rapide, minutieux, et suit bien les instructions. Mais il a toujours besoin d'un humain pour définir ce que "correct" signifie et valider le résultat. Le traiter comme un agent totalement autonome mène à de mauvais résultats.

**Les préoccupations transversales :** sécurité, performance, observabilité. Elles requièrent un jugement qui dépasse l'implémentation de ce que le ticket demande. Je les revois toujours séparément.

## Le CLAUDE.md est le vrai débloquant

Si je devais nommer la partie la plus impactante de ce setup, c'est le `CLAUDE.md` — pas le modèle, pas les outils.

Un bon `CLAUDE.md` capture la connaissance institutionnelle qui vit normalement uniquement dans la tête des personnes qui ont le plus travaillé sur le projet. L'écrire te force à articuler des choses qui sont habituellement implicites. Et une fois qu'il existe, n'importe quel développeur (humain ou IA) s'onboard plus vite.

Je le mets à jour chaque fois que je découvre quelque chose qui m'a surpris pendant une session. Avec le temps, il devient la documentation vivante que le projet n'a jamais eue.

## Conclusion

La combinaison Claude Code, Jira MCP et un `CLAUDE.md` bien maintenu n'élimine pas les parties difficiles de la modernisation legacy. Elle compresse le temps passé sur les parties mécaniques — lire du code, tracer des flux, écrire du boilerplate — pour que plus de ton temps aille au jugement, à l'architecture, et à la vraie résolution de problèmes.

Ce décalage vaut plus que n'importe quelle fonctionnalité individuelle des outils.

Si tu travailles sur une codebase legacy et que tu n'as pas essayé ce workflow, commence par le `CLAUDE.md`. Même sans Claude Code, te forcer à écrire ce que le projet nécessite que les nouveaux venus sachent est les 30 minutes les mieux investies de ta semaine.

---

*Je travaille chez [Ippon Technologies](https://ippon.tech) sur des projets de modernisation legacy avec de l'outillage IA. Si ton équipe fait face aux mêmes défis, n'hésite pas à [me contacter](/fr/contact/).*
