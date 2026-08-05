---
title: "L'ère de l'IA tourne sur Rust : pourquoi tes outils dev ont tous changé de langage"
description: "Les outils que tu dégaines chaque jour se révèlent presque tous écrits en Rust : ripgrep, fd, uv, ruff, biome, et maintenant une vague d'outillage IA. Ce n'est pas une mode. L'ère de l'IA a changé ce qu'un outil dev doit faire, et ces nouvelles exigences tombent pile sur les points forts de Rust."
publishDate: 2026-09-02
tags: ["Rust", "IA", "Software Engineering"]
keywords: ["outils développeur Rust", "pourquoi Rust", "outillage dev IA", "ripgrep uv ruff biome", "outils CLI Rust", "distribution binaire unique", "performance Rust", "outils agents de code IA"]
img: "/assets/blog/the-ai-era-runs-on-rust.webp"
img_alt: "Un terminal montrant une chaîne d'outils dev en Rust alimentant un agent de code IA"
draft: true
lang: "fr"
relatedPosts: ["semtree-local-semantic-code-search-rust", "why-i-left-the-ai-ide-for-the-terminal"]
relatedWork: ["rustkit-ai"]
---

Regarde les outils que tu dégaines vraiment dans une journée. Pas les frameworks dont tu débats, les petits, tranchants, ceux que tu lances sans réfléchir. `ripgrep` pour la recherche. `fd` pour trouver des fichiers. `uv` pour les environnements Python. `ruff` pour le linting. `biome` pour formater du JavaScript. Delta pour les diffs. Il y a un motif caché dans cette liste, et une fois que tu le vois tu ne peux plus l'ignorer : ils sont presque tous écrits en Rust.

Longtemps, j'ai rangé ça dans la case « mode ». Rust est le langage dont les gens aiment parler, donc forcément les outils dont on parle sont écrits avec. Mais cette explication a fini par lâcher, parce que la tendance s'est accélérée exactement au moment où autre chose s'accélérait : l'arrivée des agents de code. Ce timing n'a rien d'un hasard. L'ère de l'IA a discrètement changé ce qu'un outil de développeur doit *faire*, et la nouvelle fiche de poste ressemble à s'y méprendre à la liste des points forts de Rust.

## Le métier a changé sous les outils

Pendant l'essentiel de ma carrière, un outil CLI avait un seul utilisateur : moi. Je le tapais, je lisais la sortie, je passais à autre chose. La vitesse comptait un peu, mais « assez rapide pour un humain » est une barre basse. Un quart de seconde de démarrage est invisible quand c'est une personne aux commandes.

Les agents ont fait sauter cette barre. Quand un agent de code travaille, il invoque des outils en boucle serrée, des dizaines ou des centaines de fois par session, et il lit chaque octet de sortie comme des tokens qu'il paie. L'outil n'est plus sollicité par un humain patient une fois par minute. Il est appelé par une machine dans un chemin critique, et sa sortie est consommée par une autre machine, avec un budget.

Ce seul glissement change toutes les exigences. Un temps de démarrage qui m'était invisible devient une taxe multipliée par cent appels. Une sortie qu'un humain survole devient des tokens facturés à un agent. Un crash qu'un humain balaierait d'un relancer devient une étape cassée dans une boucle autonome. L'outil est passé d'*accessoire* à *infrastructure*, et l'infrastructure se juge sur d'autres critères.

## Pourquoi ces critères favorisent Rust

Une fois qu'on voit l'outillage dev comme de l'infrastructure dans le chemin critique d'un agent, les avantages de Rust cessent d'être des arguments abstraits de puriste pour devenir des gains opérationnels concrets.

### 1. Rapide dès le premier octet, sans chauffe

Pas de runtime à démarrer, pas de JIT à chauffer. Un binaire Rust est à pleine vitesse dès la première invocation. C'est un confort modeste quand tu lances un outil une fois. C'est un vrai chiffre quand un agent le lance deux cents fois dans une session, ou quand la CI le démarre à froid dans chaque job. La performance à froid, que quasiment personne n'optimisait à l'ère humaine, se révèle décisive quand l'appelant est une boucle.

### 2. Un binaire statique, rien à installer autour

Celui-là est sous-estimé et, pour l'ère de l'IA, peut-être le plus important. Un outil Rust se distribue comme un binaire unique et autonome. Pas de `node_modules`, pas de virtualenv, pas de runtime à la bonne version installé sur la machine. Un agent, un runner de CI, un collègue : chacun le télécharge et le lance. Quand tes outils sont câblés dans des environnements automatisés que tu ne contrôles pas et ne peux pas materner, « c'est un seul fichier qui tourne partout » l'emporte sur « c'est rapide » plus souvent qu'on ne le croit.

### 3. Prévisible, parce que la boucle ne peut pas se permettre de surprise

Pas de pauses du ramasse-miettes, pas de pics de latence mystérieux, et un compilateur qui refuse de laisser passer des catégories entières de bugs. Dans un workflow humain, un accroc occasionnel est un haussement d'épaules. Dans une boucle autonome, un outil qui plante ou se fige à l'étape 40 empoisonne tout ce qui suit. La valeur du « ça ne s'écroule pas » croît avec le peu de supervision de l'appelant, et les agents supervisent très peu leurs outils.

### 4. Les briques de base sont déjà là

C'est l'effet volant d'inertie. Les primitives dont tu as besoin pour bâtir de l'outillage IA sont de plus en plus natives Rust : `tree-sitter` pour le parsing, la bibliothèque `tokenizers`, `candle` et `fastembed` pour faire tourner des embeddings en local, `qdrant` pour la recherche vectorielle. Chaque brique native Rust rend le prochain outil Rust plus facile à écrire, ce qui produit d'autres briques. L'écosystème se renforce précisément dans le coin où vit l'outillage IA.

## Le contrepoint honnête

Si je m'arrêtais là, ça sonnerait comme un argumentaire pour un langage, et ce n'est pas ma façon de penser. Rust ne gagne pas partout, et il ne devrait pas.

Pour du code de colle, un script vite fait, une transformation à usage unique, dégainer Rust est du masochisme. Python ou un script shell te battront à chaque fois côté vitesse de développement, et la vitesse de dev est ce qui compte pour du jetable. Les temps de compilation de Rust sont un vrai coût, et sa courbe d'apprentissage un vrai mur, surtout si tu viens d'un monde à ramasse-miettes (c'est mon cas, et [j'ai raconté ce que cette transition a vraiment donné](/fr/blog/from-javascript-java-to-rust-what-clicked)).

Donc la thèse n'est pas « Rust dévore le logiciel ». Elle est plus étroite et, je trouve, plus intéressante : Rust gagne une *couche précise*. La couche chaude, distribuée, appelée par des machines, celle que l'ère de l'IA vient de rendre porteuse. C'est exactement la couche où « rapide à froid », « binaire unique » et « ne s'écroule pas » cessent d'être des préférences pour devenir des exigences.

## Pourquoi je construis mon propre outillage en Rust

Ce n'est pas un avis de spectateur, pour moi. Quand j'ai déplacé mon workflow d'agent dans le terminal, les pièces que j'ai dû construire se trouvaient pile dans le chemin critique de l'agent, et ça a rendu le choix du langage évident.

[trimcp](https://github.com/rustkit-ai/trimcp) est un proxy MCP qui s'intercale entre un agent et ses outils et compresse ce qui revient, pour que l'agent paie du signal et non du bruit. Un proxy sur le chemin critique ne peut pas être lui-même lent ou instable, sinon il ruine son propre intérêt. [semtree](https://github.com/rustkit-ai/semtree) fait de la recherche de code sémantique en local avec tree-sitter et des embeddings locaux, ce qui ne marche que parce que les briques Rust de parsing et d'embedding existent déjà. Les deux font partie de [rustkit-ai](/fr/experiences/rustkit-ai). Je m'appuie aussi sur [RTK](https://www.rtk-ai.app/) (Rust Token Killer), un proxy CLI open source que je n'ai pas construit mais branché à mon setup, et c'est parlant qu'un outil tiers qui résout la même classe de problème ait atterri sur le même langage.

Aucun de nous ne s'est concerté. On a chacun choisi Rust indépendamment parce que le problème, de l'outillage dans le chemin critique d'un agent, y ramenait sans cesse.

## À retenir

La prochaine fois que tu remarques qu'un outil que tu adores est écrit en Rust, n'y vois pas une mode. Vois-y un signal sur ce qu'on attend désormais de cet outil. L'ère de l'IA a transformé l'outillage dev en infrastructure, et l'infrastructure se construit dans le langage qui est rapide à froid, se distribue en un seul fichier, et ne s'écroule pas dans une boucle.

Dans le prochain article, je descends d'un cran et je démonte un exemple concret : [semtree](/fr/blog/semtree-local-semantic-code-search-rust), et pourquoi faire de la recherche de code sémantique *sur ta propre machine*, sans clé d'API, n'est devenu praticable qu'à cause de ce même glissement.

*trimcp et semtree sont l'outillage Rust que je construis sous [rustkit-ai](/fr/experiences/rustkit-ai). C'est le premier billet d'une courte série sur pourquoi Rust et l'ère de l'IA se sont trouvés.*
