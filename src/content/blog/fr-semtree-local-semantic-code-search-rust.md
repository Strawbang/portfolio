---
title: "semtree : de la recherche de code sémantique en local, sans clé d'API"
description: "Sur un gros dépôt, un agent peut gâcher la moitié d'une session juste à redécouvrir la structure, parce que grep cherche des mots, pas du sens. semtree lui offre une recherche de code sémantique qui tourne entièrement sur ta machine : parsing tree-sitter, embeddings locaux, index HNSW, zéro cloud, zéro clé. Voici comment ça marche et pourquoi Rust l'a rendu praticable."
publishDate: 2026-09-09
tags: ["Rust", "IA", "Software Engineering"]
keywords: ["recherche de code sémantique", "semtree", "embeddings on-device", "tree-sitter", "HNSW", "recherche de code locale Rust", "contexte code agent IA", "fastembed", "recherche vectorielle hors ligne"]
img: "/assets/blog/semtree-local-semantic-code-search-rust.webp"
img_alt: "Schéma de code parsé par tree-sitter, embarqué en local et indexé pour la recherche sémantique"
draft: true
lang: "fr"
relatedPosts: ["the-ai-era-runs-on-rust", "why-i-left-the-ai-ide-for-the-terminal"]
relatedWork: ["rustkit-ai"]
---

Confie un vrai dépôt à un agent de code et observe où part le temps. Une part étonnante ne va pas à écrire du code. Elle va à le *trouver* : grepper un symbole, ouvrir le mauvais fichier, re-grepper avec une autre intuition, suivre un import, faire marche arrière. Sur un petit projet, c'est quelques secondes. Sur une codebase grande ou legacy, ça peut avaler la moitié d'une session, et chacune de ces lectures en cul-de-sac, ce sont des tokens que tu as payés.

La cause racine est simple et ancienne : `grep` cherche des mots, pas du sens. Si la logique que tu veux s'appelle `computeInvoiceTotal` et que tu cherches « facturation », tu n'obtiens rien, alors même que cette fonction *est* la facturation. Un humain comble ce fossé avec sa mémoire et son intuition. Un agent lâché dans un dépôt inconnu n'a ni l'une ni l'autre. Il lui faut un moyen de demander « où est le code qui fait X ? » et d'obtenir une réponse fondée sur ce que le code *veut dire*, pas sur les mots qui s'y trouvent par hasard.

C'est le fossé que [semtree](https://github.com/rustkit-ai/semtree) comble, et le point intéressant est la contrainte que je lui ai imposée : tout tourne sur ta propre machine. Pas de cloud, pas de clé d'API, rien ne quitte ton portable. Ce billet explique comment ça marche, et pourquoi ce n'est devenu praticable qu'à cause du glissement Rust dont je parlais dans [le billet précédent](/fr/blog/the-ai-era-runs-on-rust).

## Ce que « sémantique » t'apporte vraiment

La recherche lexicale demande : quels fichiers contiennent ces caractères ? La recherche sémantique demande : quels morceaux de code *parlent* de cette idée ? La différence, c'est celle entre chercher « tva allemagne » et tomber sur une fonction nommée `applyEuReverseCharge` parce que le modèle comprend que l'autoliquidation de TVA intra-UE et la taxe B2B allemande vivent dans le même voisinage conceptuel.

On y arrive en transformant le code en vecteurs. Chaque morceau de code passe dans un modèle d'embedding qui le projette dans un espace de grande dimension où « proximité » veut dire « sens proche ». Ta requête est projetée de la même façon, et la recherche devient : trouver les morceaux dont les vecteurs sont les plus proches de celui de la requête. Désormais « où est la logique de facturation ? » renvoie `computeInvoiceTotal` même si les deux ne partagent aucun mot.

L'idée n'est pas neuve. Ce qui était difficile, c'était de tout faire en local, vite, sans dépendance au cloud. C'est là que se niche l'ingénierie.

## Les trois pièces, et pourquoi chacune est délibérée

semtree, c'est vraiment trois étapes, et j'ai choisi chacune pour garder l'ensemble on-device.

### 1. Découper avec tree-sitter, pas au nombre de lignes

La plupart des approches naïves découpent le code en fenêtres de taille fixe, disons toutes les 50 lignes. C'est facile et c'est faux, parce que ça coupe des fonctions en deux et colle ensemble des fragments sans rapport, et les embeddings obtenus sont de la bouillie. semtree parse chaque fichier avec [tree-sitter](https://tree-sitter.github.io/) et découpe le long de *l'arbre syntaxique* : une fonction, une méthode, une classe devient une unité cohérente. L'embedding décrit alors une vraie chose sémantique au lieu d'une fenêtre arbitraire. tree-sitter est lui-même un parser agnostique du langage et bien intégré à Rust, ce qui est précisément pourquoi c'est peu coûteux à faire sur beaucoup de langages.

### 2. Des embeddings qui tournent sur ta machine

C'est la contrainte qui façonne tout le reste. La façon évidente d'embarquer du code, c'est d'appeler une API d'embedding dans le cloud. C'est aussi la façon d'envoyer ton code source propriétaire à un tiers, d'ajouter de la latence par appel, de payer à chaque indexation, et de ne plus rien pouvoir faire dans un avion. semtree utilise des modèles d'embedding locaux via [fastembed](https://github.com/qdrant/fastembed), donc les vecteurs sont calculés sur ton propre CPU. Ton code ne quitte jamais la machine. Il y a un compromis de qualité, que j'assume plus bas, mais pour la recherche de code les modèles locaux sont largement assez bons, et « assez bon, privé et gratuit » l'emporte sur « marginalement meilleur, fuyard et facturé ».

### 3. Un index HNSW pour la recherche du plus proche voisin

Une fois chaque morceau devenu un vecteur, « trouve les plus proches de ma requête » doit rester rapide même avec des dizaines de milliers de morceaux. Un scan par force brute marche mais passe mal à l'échelle. semtree utilise un index HNSW (Hierarchical Navigable Small World), la structure standard pour la recherche approximative du plus proche voisin, qui te donne les résultats en millisecondes au lieu d'un balayage linéaire. Tout l'index vit sur le disque, à côté de ton dépôt. Aucune base vectorielle à monter, aucun service à faire tourner.

Résultat : l'agent pose une question en termes simples, et semtree lui rend la poignée de morceaux de code qui veulent réellement dire ce qu'il a demandé, dans le temps qu'il faut pour lancer une commande normale.

## Pourquoi c'est une histoire de Rust, pas seulement d'IA

J'aurais pu prototyper ça en Python en un après-midi. Je ne l'ai pas fait, et la raison rejoint le billet précédent : cet outil vit dans le chemin critique d'un agent.

Un agent peut interroger l'index plusieurs fois par session, donc la recherche doit être rapide à froid, sans runtime à démarrer. Il doit se distribuer comme un binaire unique que l'agent lance directement, sans environnement Python à réconcilier sur la machine où il atterrit. Et le gros du travail, le parsing tree-sitter et l'inférence des embeddings, dispose de briques déjà natives et rapides en Rust. Des embeddings on-device qui traîneraient dans un langage de script deviennent praticables quand le parsing, l'inférence du modèle et l'index tournent tous en code compilé, sans taxe de langage de colle entre eux. Le gain de confidentialité et de coût (rien ne quitte ta machine, rien n'est facturé) ne vaut la peine que si la version locale est aussi rapide, et c'est Rust qui rend la version locale rapide.

## Les limites honnêtes

La recherche sémantique n'est pas magique, et je préfère que tu en connaisses les bords plutôt que d'en être déçu.

- **C'est un outil de rappel, pas un oracle.** semtree amène l'agent au bon *voisinage* vite. Il ne remplace pas la lecture du code ni la compréhension du graphe d'appels ; il supprime le tâtonnement à l'aveugle qui vient avant.
- **Les embeddings locaux échangent un peu de qualité contre beaucoup d'indépendance.** Les plus gros modèles d'embedding cloud sont plus forts. Pour classer du code par similarité conceptuelle, l'écart est petit et, d'expérience, ne vaut pas le prix d'expédier ton source hors de la machine.
- **L'index a un coût de construction.** Tu paies une fois pour parser et embarquer le dépôt, et tu le maintiens à jour à mesure que le code change. C'est un vrai coût, amorti sur chaque recherche qui suit.
- **Il complète grep, il ne le remplace pas.** Quand tu connais le symbole exact, `grep` reste la bonne réponse, instantanée. La recherche sémantique gagne sa place précisément quand tu *ne connais pas* le mot.

## À retenir

Si semtree peut tourner entièrement sur ta machine, sans clé et sans cloud, ce n'est pas un tour de passe-passe. C'est que les briques du parsing, de l'embedding et de la recherche vectorielle on-device sont toutes devenues rapides et natives Rust au moment même où les agents rendaient utile de construire de l'outillage local, privé, en chemin critique. C'est tout le fil de cette série dans un seul outil : l'ère de l'IA a créé le besoin, et l'écosystème Rust a discrètement rendu praticable d'y répondre en local.

Ensuite, et pour clore la série, je passe au personnel sur le langage lui-même : [ce qui a vraiment cliqué quand je suis passé de JavaScript et Java à Rust](/fr/blog/from-javascript-java-to-rust-what-clicked), et ce qui n'a pas cliqué.

*semtree est open source et fait partie de [rustkit-ai](/fr/experiences/rustkit-ai), l'org où je construis mon outillage Rust pour le développement assisté par IA.*
