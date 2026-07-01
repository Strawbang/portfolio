---
title: "L'IA écrit le code maintenant, raison de plus pour maîtriser l'architecture"
description: "L'IA n'a pas rendu les développeurs obsolètes. Elle a déplacé la valeur. Écrire du code se banalise ; décider de la forme du système, non. Voici pourquoi l'architecture et le craft sont devenus les compétences qui prennent de la valeur, et pourquoi le développeur « classique » a intérêt à monter en compétence dès maintenant."
publishDate: 2026-07-15
tags: ["IA", "Software Engineering", "Tech Leadership"]
keywords: ["architecture logicielle ère IA", "compétences développeur IA", "piloter les agents de code IA", "se former au craft", "carrière développeur IA", "Claude Code", "jugement de conception", "montée en compétence IA"]
img: "/assets/blog/why-developers-should-learn-architecture-ai-era.webp"
img_alt: "Un développeur pilotant un agent IA depuis un schéma d'architecture plutôt qu'en tapant le code ligne par ligne"
draft: true
lang: "fr"
relatedPosts: ["hexagonal-architecture-ai-agents", "software-craftsmanship-ai-era"]
relatedWork: ["rustkit-ai"]
---

Pendant l'essentiel de ma carrière, être un bon développeur voulait dire être bon pour *produire* du code. Vite, juste, idiomatique. Cette compétence compte toujours, mais elle a discrètement cessé d'être celle qui te distingue. Un agent produit désormais du code vite, juste et idiomatique, à la demande. La partie du métier devenue rare, et donc précieuse, c'est celle qui décide *ce qu'il faut produire et quelle forme lui donner*.

Ce n'est pas un petit glissement. Il déplace l'endroit où vit la valeur d'un développeur : du clavier vers la conception. Et il a une implication inconfortable pour toute une catégorie de développeurs qui ont bâti leur identité sur la vitesse d'implémentation. Voici pourquoi l'architecture et le craft sont les compétences qui viennent de prendre de la valeur, et pourquoi les développeurs « classiques » ont intérêt à s'y former maintenant plutôt que plus tard.

## L'IA est douée exactement pour la partie qui n'a jamais été la difficile

Voici ce qu'on ne dit pas assez : écrire une fonction a rarement été le point dur du logiciel. Savoir *quelle* fonction, où elle doit vivre, ce qu'elle doit ou ne doit pas toucher, et comment elle s'imbrique dans le reste du système : ça, ça a toujours été le point dur. L'IA est spectaculaire sur le premier et structurellement faible sur le second.

Un agent génère du code localement plausible. Demande-lui une feature et il produira quelque chose qui a l'air juste, et qui souvent marche. Ce qu'il n'a pas, c'est le goût au niveau système : le sens de ce qu'il faut protéger, du couplage qui te fera mal dans six mois, de l'endroit où placer une frontière, de ce que le domaine signifie vraiment sous les tickets. Il optimise pour « faire passer cette tâche », pas pour « garder ce système cohérent ». (J'ai vu cet écart précis [casser une règle métier vieille de dix ans en production](/fr/blog/software-craftsmanship-ai-era).)

La capacité n'a donc pas disparu. Elle s'est inversée. Ce qui était cher est devenu abondant. Ce qui était rare, le jugement sur la structure, est devenu le goulet d'étranglement. Et c'est dans les goulets que se concentre la valeur.

## L'architecture, c'est le volant

Voici la raison pratique pour laquelle ce n'est pas de la philosophie de carrière abstraite. Si tu ne sais pas décrire la forme que tu veux, tu ne peux pas diriger un agent. Tu peux seulement accepter ce qu'il te tend.

Bien travailler avec un agent de code est un acte de *direction*. Tu lui dis : mets la logique métier dans un cœur pur, garde l'appel Slack derrière un port, ne laisse pas la couche de persistance fuir dans le domaine. Cette instruction ne t'est accessible que si tu comprends les ports et adaptateurs, le couplage, la cohésion, où placer les frontières et pourquoi. [L'architecture est ce qui rend un agent sûr et rapide](/fr/blog/hexagonal-architecture-ai-agents), mais seulement entre les mains de quelqu'un qui sait nommer la cible.

Le développeur qui connaît l'architecture traite l'agent comme un implémenteur très rapide de *sa* conception. Celui qui ne la connaît pas traite l'agent comme un oracle, accepte sa sortie, et accumule lentement un système que plus personne ne comprend. Même outil. Résultats opposés. Le facteur différenciant, c'est entièrement la culture de conception de l'humain.

C'est le renversement : l'IA n'a pas remplacé le jugement de l'architecte. Elle a fait de ce jugement l'interface par laquelle tout le reste se construit.

## La partie inconfortable pour le développeur « classique »

Je veux être direct, parce que l'optimisme vague n'aide personne à planifier une carrière.

Si ta valeur pour une équipe, c'était *implémenter des tickets que quelqu'un d'autre a conçus* (transformer vite une tâche bien spécifiée en code fonctionnel), c'est précisément la couche que l'IA absorbe le plus vite. Non parce que tu n'es pas bon ; parce que c'est la part du travail la plus compressible en « génère du code plausible pour une spec claire ». L'implémenteur qui ne fait qu'implémenter se tient exactement là où l'eau monte.

Ce n'est pas une prophétie catastrophiste. C'est un panneau de direction. Le mouvement, c'est *monter d'une couche* : de « je sais construire ce qu'on me demande » à « je sais décider ce qu'il faut construire et comment le structurer ». D'implémenteur à concepteur. D'écrivain de code à *directeur* de code. Et les compétences qui t'y amènent, ce n'est pas plus de vitesse de frappe ni un framework de plus : ce sont les compétences durables et peu glamour que l'industrie sous-estime depuis des années parce qu'elles font une mauvaise démo.

Ceux qui ont passé la dernière décennie à railler les « astronautes de l'architecture » et le « craft, c'est du luxe, livre et c'est tout » vont découvrir que le luxe, c'était les douves.

## Ce que « se former au craft » veut dire concrètement (pas des buzzwords)

« Mets-toi au craftsmanship » est facile à dire et facile à transformer en liste de lecture qu'on n'applique jamais. Concrètement, voici ce qui prend de la valeur :

- **Frontières et couplage.** Ports et adaptateurs, sens des dépendances, ce qui appartient au domaine par rapport aux bords. C'est le vocabulaire avec lequel tu diriges un agent. Commence là.
- **Le test comme outil de conception, pas comme corvée.** Pas la course à la couverture, mais se servir des tests pour figer le comportement et attraper les changements *silencieux* d'un agent. Le test qui aurait attrapé la règle métier cassée est une compétence de conception, pas une tâche de QA.
- **La modélisation du domaine.** Comprendre le métier assez profondément pour nommer les choses correctement. L'ubiquitous language n'est pas de la cérémonie ; c'est la carte que toi et l'agent suivez tous les deux.
- **Lire et relire le code de façon critique.** La compétence la plus importante dans un workflow saturé d'IA, c'est distinguer le *bon* code du code *plausible*. Si tu ne repères pas un diff confiant mais faux, la vitesse de l'agent est un handicap, pas un levier.
- **La pensée système.** Comment un changement se propage. Ce qu'il faut protéger. Ce que « cohérent » veut dire pour *cette* codebase précisément. C'est le goût que l'IA n'a pas, et il s'apprend : par l'exposition, la lecture de grandes codebases, et l'erreur volontaire dans des endroits sans enjeu.

Rien de tout ça n'est la nouvelle mode. Tout ça, c'est ce que les ingénieurs seniors ont toujours fait, discrètement. La différence, c'est que ce n'est plus la part *cachée* du métier derrière l'acte visible de taper. C'est *le* métier, désormais.

## La version optimiste (parce qu'elle l'est)

Je ne pense pas que ce soit un mauvais moment pour être développeur. Je pense que c'est le meilleur moment pour être un développeur *qui sait architecturer*, et un moment stressant pour celui qui ne fait qu'implémenter. Et ce sont deux phrases très différentes.

Pour qui veut monter en compétence, le levier est extraordinaire. Un développeur cultivé en architecture, avec un bon agent, fait le travail d'une petite équipe : il conçoit, l'agent implémente, il relit, il oriente. Le plafond de ce qu'une seule personne peut construire vient de bondir, mais seulement pour ceux dont la compétence est de décider la forme, pas de la remplir.

Alors si je devais donner un seul conseil de carrière à un développeur « classique » aujourd'hui, il serait court : **arrête de concurrencer l'agent sur ce qu'il fait mieux que toi.** Il tape plus vite que toi et ne fatigue jamais. Va sur ce qu'il ne sait pas faire : tenir tout le système en tête, savoir quoi protéger, décider la structure, et distinguer le bon du plausible. Apprends l'architecture. Apprends le craft. Pas parce que c'est vertueux, mais parce que c'est la part de ton métier qui vient de devenir tout le métier.

*Si tu veux la version concrète de « structure ton code pour qu'un agent y prospère », j'ai écrit [pourquoi l'architecture hexagonale est le plus beau cadeau à faire à un agent IA](/fr/blog/hexagonal-architecture-ai-agents). Et pour l'histoire vraie derrière tout ça, [voici comment l'IA a cassé notre code de production, et la règle de craftsmanship qui aurait tout évité](/fr/blog/software-craftsmanship-ai-era).*
