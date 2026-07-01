---
title: "Pourquoi j'ai quitté l'IDE IA pour le terminal, et l'outillage que j'ai dû construire"
description: "J'ai troqué mon IDE boosté à l'IA contre un agent en terminal. Ça a tenu, non pas parce que le terminal est plus cool, mais parce qu'il est composable. Voici ce qui a changé, les vrais compromis, et les outils que j'ai dû bâtir."
publishDate: 2026-07-01
tags: ["IA", "Software Engineering"]
keywords: ["Claude Code", "agents CLI", "IDE IA vs terminal", "agent IA terminal", "trimcp", "semtree", "MCP", "outils développeur Rust"]
img: "/assets/blog/why-i-left-the-ai-ide-for-the-terminal.webp"
img_alt: "Une session terminal exécutant un agent IA aux côtés de git, du shell et de CLIs maison"
draft: false
lang: "fr"
relatedPosts: ["claude-code-jira-mcp-legacy-codebase", "model-context-protocol-mcp-cli-rust-ide"]
relatedWork: ["rustkit-ai"]
---

Pendant environ un an, mon assistant de code a vécu dans mon éditeur. L'autocomplétion dans la marge, un panneau de chat à droite, des diffs en ligne que j'acceptais d'une touche. C'était bien. Puis un après-midi, je l'ai fermé, j'ai ouvert un terminal, et j'ai confié les mêmes tâches à un agent en ligne de commande.

Je pensais revenir en arrière sous une semaine. Je ne l'ai pas fait. Des mois plus tard, l'IDE est toujours là. Je ne lui demande simplement plus de *réfléchir*. Voici le compte rendu honnête de pourquoi le terminal l'a emporté pour moi, ce qu'il perd encore, et l'outillage que j'ai dû construire pour que le changement soit réellement rentable.

## Le jour où j'ai fermé le panneau

Ce qui m'a fait basculer n'était pas une fonctionnalité. C'était une impression qui revenait : l'assistant de l'IDE était un passager dans mon éditeur, et l'agent du terminal était un collègue à mon bureau.

Dans l'IDE, l'assistant *suggérait*, surtout. Il proposait un diff, je l'acceptais ou le rejetais, et la boucle s'arrêtait là. Tout ce qui dépassait l'édition d'un fichier (lancer les tests, consulter l'historique git, reproduire un bug, appeler une API interne), c'était mon boulot. L'assistant regardait.

Dans le terminal, l'agent *agit*. Il lit les fichiers, lance le build, analyse l'échec, modifie, relance les tests, et ne revient vers moi que quand il a quelque chose à montrer ou une décision à demander. L'unité de travail n'était plus « un diff » mais « une tâche ».

C'est cette différence qui a tout fait tenir. Le reste n'est que ma tentative de me l'expliquer.

## Pourquoi ça a tenu (et non, pas parce que le terminal est plus cool)

Trois raisons, par ordre d'importance réelle.

### 1. La composabilité

C'est la vraie. Le terminal est le seul endroit où tous les outils qu'un développeur utilise déjà parlent la même langue : du texte en entrée, du texte en sortie. Dès que l'agent y vit, il peut se composer avec tout, sans que personne n'écrive d'intégration.

Il lance `git` directement. Il pipe la sortie du build dans un grep. Il appelle mes propres CLIs. Il dialogue avec des systèmes externes via [MCP](/fr/blog/model-context-protocol-mcp-cli-rust-ide). Rien de tout cela n'a demandé un plugin, une API d'extension ou la bénédiction d'un éditeur. L'assistant de l'IDE, lui, ne pouvait faire que ce que sa surface d'extension autorisait : un jardin clos, aussi joli soit le mur.

Un IDE est un produit. Le terminal est un protocole. On peut bâtir sur un protocole.

### 2. Un contexte qui survit à la session

Sur une vraie codebase, surtout legacy, l'essentiel du travail, c'est *comprendre* avant de modifier. L'agent du terminal traite tout le dépôt comme son espace de travail : il greppe, suit les chaînes d'appels, lit ce dont il a besoin, et garde ce contexte sur une longue session. Je ne réexplique pas la structure du projet toutes les cinq minutes.

Dans l'IDE, le contexte était implicitement « les fichiers que j'ai ouverts ». Puissant pour la fonction sous mon curseur, faible pour « trace comment cette valeur traverse huit couches de services ». Le terminal a inversé ça, et tracer des flux, c'est l'essentiel du travail sur du legacy.

### 3. Le contrôle

Dans le terminal, je vois exactement ce que l'agent s'apprête à faire, je peux l'interrompre et le réorienter. La boucle est lisible. Quand l'agent compose de vraies commandes plutôt que de piloter une API d'éditeur cachée, je peux le superviser au lieu de lui faire confiance. Pour tout ce qui touche au code de production, cette lisibilité vaut plus que le confort.

## Le compromis honnête

Si je ne te racontais que les gains, ce serait un argumentaire commercial, pas un compte rendu. L'IDE fait encore plusieurs choses mieux, et prétendre le contraire serait malhonnête.

- **La navigation visuelle.** Aller à la définition, trouver les références, la hiérarchie d'appels, un vrai debugger avec points d'arrêt et fenêtre de surveillance : c'est *meilleur* dans l'IDE, point. Quand je dois *dérouler* du code pas à pas, je reviens dans l'éditeur.
- **Les éditions locales et serrées.** Pour un petit changement bien cadré dans un fichier que je regarde déjà, l'autocomplétion en ligne est plus rapide que de décrire la tâche à un agent. Tout changement ne mérite pas une phrase.
- **La découvrabilité.** L'IDE te montre ce qui est possible. Le terminal suppose que tu sais. C'est une vraie barrière, et j'y reviens.
- **Les artefacts visuels.** Rendre un composant, inspecter une UI, lire un flame graph : le terminal est le mauvais outil, et je ne fais pas semblant du contraire.

Donc ce n'est pas « le CLI bat l'IDE ». J'utilise toujours les deux. La version exacte : **le terminal est là où l'agent doit réfléchir ; l'IDE est là où je vais encore regarder.**

## Ce que le terminal a débloqué (et m'a forcé à construire)

Voici la partie que la plupart des billets « j'ai switché vers le terminal » sautent. La composabilité est une promesse, pas une fonctionnalité. Le terminal te *permet* de composer des outils ; il ne te les offre pas. Une fois l'agent devenu un véritable acteur à mon bureau, les manques sont apparus vite, et j'ai dû construire la couche qui rend le changement rentable.

Trois problèmes ont surgi presque immédiatement.

**La sortie était trop bruyante.** Les agents lisent la sortie des outils comme des tokens, et la sortie brute d'un développeur est surtout du bruit : codes de couleur ANSI, JSON verbeux, frames de pile dupliquées. L'agent payait, en contexte et en dollars, pour lire de la camelote. J'ai donc construit [**trimcp**](https://github.com/rustkit-ai/trimcp), un proxy MCP en Rust qui s'intercale entre l'agent et ses outils et compresse ce qui revient : il retire l'ANSI, minifie le JSON et déduplique les blocs répétitifs avant même que l'agent ne les voie. Même information, une fraction des tokens.

**Les commandes étaient trop coûteuses.** Beaucoup d'opérations de dev courantes produisent bien plus de sortie que ce dont l'agent a besoin. Celui-là, je n'ai pas eu à le construire : [**RTK**](https://www.rtk-ai.app/) (Rust Token Killer) est un proxy CLI open source qui réécrit de façon transparente les commandes usuelles pour ne renvoyer que le signal. Je l'ai branché via les hooks de Claude Code, donc sans surcoût dans le prompt et sans rien à retenir de ma part.

**Trouver le bon code était trop lent.** Sur un gros dépôt, un agent peut gâcher la moitié d'une session juste à redécouvrir la structure. [**semtree**](https://github.com/rustkit-ai/semtree) fait de la recherche de code sémantique en local (parsing tree-sitter, embeddings locaux, index HNSW, zéro clé d'API) pour que l'agent demande « où est la logique qui fait X ? » et obtienne le code pertinent, pas mille résultats de grep.

Au-dessus, il y a les pièces ennuyeuses mais essentielles : un `CLAUDE.md` par projet qui encode les conventions et les pièges (le fichier au plus fort effet de levier que je maintiens ; [j'en ai parlé ailleurs](/fr/blog/claude-code-jira-mcp-legacy-codebase)), et quelques skills maison pour les workflows que je répète.

Rien d'exotique là-dedans. C'est de la plomberie. Mais une plomberie que l'IDE ne m'a jamais laissé construire, parce que je ne possédais pas les tuyaux. **C'est tout l'argument en une phrase : le terminal a gagné parce que j'ai pu construire autour.**

## Pour qui c'est, et pour qui ça ne l'est pas

Je me méfie des conseils universels, alors cadrons.

Ce setup convient à un **ingénieur sénior et autonome** qui connaît déjà assez la codebase pour superviser un agent et juger sa production. Si tu sais distinguer le bon travail du travail qui *a l'air* bon, le terminal te démultiplie. La composabilité et le contrôle sont du levier entre des mains expérimentées.

Il convient particulièrement au **legacy et au back-end**, où le travail est surtout comprendre, tracer et modifier avec prudence, et où l'outillage visuel compte moins.

Il convient **moins bien** si tu vis toute la journée dans le debug visuel et l'UI, ou si tu es assez tôt dans ta carrière pour ne pas encore repérer les erreurs assurées d'un agent. Les garde-fous et la découvrabilité de l'IDE y ont une vraie valeur, et « le terminal suppose que tu sais » cesse d'être une bizarrerie pour devenir un mur.

## À retenir

L'opposition « IDE IA vs agent en terminal » est un peu un piège. Ce n'est pas vraiment le CLI contre l'IDE ; c'est **la composabilité contre le verrouillage.** Je ne suis pas passé au terminal parce qu'il est minimaliste ou nostalgique. J'y suis passé parce que c'est le seul environnement où l'agent peut atteindre tous les outils que j'utilise, où je vois ce qu'il fait, et, surtout, où je peux construire moi-même les pièces manquantes.

L'IDE est toujours ouvert dans une autre fenêtre. J'ai juste arrêté de lui demander de réfléchir.

*trimcp et semtree, l'outillage Rust que j'ai construit, font partie de [rustkit-ai](/fr/experiences/rustkit-ai). Je détaillerai les chiffres de tokens derrière trimcp dans un prochain article.*
