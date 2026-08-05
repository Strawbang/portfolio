---
title: "De JavaScript et Java à Rust : ce qui a fini par cliquer"
description: "J'ai grandi dans des langages à ramasse-miettes, j'ai rebondi deux fois sur Rust, et ça n'a pris qu'à la troisième. Voici le compte rendu honnête de ce qui a fini par cliquer, de ce qui est resté dur, et pourquoi ce langage m'a plus appris sur JavaScript et Java que sur Rust."
publishDate: 2026-09-16
tags: ["Rust", "Software Engineering"]
keywords: ["Rust pour développeurs JavaScript", "Rust pour développeurs Java", "apprendre Rust", "borrow checker", "ownership Rust", "de JavaScript à Rust", "gestion d'erreurs Result", "courbe d'apprentissage Rust"]
img: "/assets/blog/from-javascript-java-to-rust-what-clicked.webp"
img_alt: "Le parcours d'un développeur de JavaScript et Java vers Rust, avec le borrow checker comme tournant"
draft: true
lang: "fr"
relatedPosts: ["the-ai-era-runs-on-rust", "why-developers-should-learn-architecture-ai-era"]
relatedWork: ["rustkit-ai"]
---

J'ai grandi dans des langages à ramasse-miettes. JavaScript a payé mes factures pendant des années, Java construisait les back-ends sérieux, et dans les deux je n'ai jamais une seule fois pensé à qui *possédait* un bout de mémoire. J'allouais des choses, je les utilisais, et je faisais confiance à un runtime pour nettoyer derrière moi. Ce n'est pas de la paresse, c'est tout l'intérêt de ces langages, et ça marchait.

Alors mon premier contact avec Rust s'est passé comme pour beaucoup de gens venant de ce monde : j'ai rebondi dessus. Violemment. J'ai écrit un truc trivial, le borrow checker l'a rejeté, je me suis battu avec le compilateur une heure, j'ai décrété que le langage était hostile au fait d'avancer, et je l'ai refermé. J'ai fait ça deux fois, à des mois d'intervalle. Ça a pris à la troisième, et ce qui a changé n'était pas mon niveau. C'était mon *cadrage*. Voici ce qui a fini par cliquer et, tout aussi honnêtement, ce qui n'a pas cliqué.

## Le recadrage qui a tout débloqué

Pendant deux tentatives, j'ai lu le borrow checker comme un videur : un obstacle entre moi et du code qui tourne, appliquant des règles pour le plaisir. Chaque rejet ressemblait au langage faisant le difficile exprès.

La troisième fois, le recadrage fut celui-ci : le borrow checker n'invente pas de règles, il me force à *écrire noir sur blanc des décisions que je prenais déjà, et souvent mal*. En Java et en JavaScript, je prenais en permanence des décisions d'ownership, qui a le droit de muter ça, combien de temps ça doit vivre, deux choses peuvent-elles le détenir en même temps, sauf que je les prenais implicitement et découvrais mes erreurs à l'exécution, sous forme de race condition, de référence périmée, d'une mutation que quelqu'un d'autre n'attendait pas. Rust tire chacune de ces décisions au moment de la compilation et m'oblige à la formuler à voix haute.

À l'instant où j'ai cessé de lire le compilateur comme un adversaire pour le lire comme une liste de questions auxquelles j'aurais dû répondre de toute façon, le combat s'est arrêté. Je ne me battais pas contre le borrow checker. On me demandait d'être explicite sur des choses que j'avais passé une carrière à laisser floues.

## Ce qui a cliqué, concrètement

Au-delà du recadrage sur l'ownership, quelques éléments précis sont passés de la friction à l'atout.

**Les erreurs comme valeurs, pas comme surprises.** En Java, une exception peut jaillir de n'importe où et remonter à travers du code qui ne la mentionnait jamais. En Rust, une fonction qui peut échouer le dit dans son type de retour avec `Result`, et je dois la gérer ou la remonter explicitement. Au début, ça ressemblait à de la cérémonie. Puis j'ai compris que c'est juste de l'honnêteté : les chemins d'échec sont inscrits dans les types au lieu de se cacher derrière une stack trace que je découvre en production.

**Rendre les mauvais états impossibles à écrire.** Venant de TypeScript, j'aimais déjà les types union. Les enums de Rust ont poussé ça plus loin que prévu. Je peux modéliser une chose de sorte que ses combinaisons invalides n'existent tout simplement pas dans le système de types, et le compilateur me force à traiter chaque cas par pattern matching. Toute une catégorie de bugs « mais et s'il était dans cet état bâtard » cesse d'être possible au lieu d'être attrapée.

**Pas de null.** L'erreur à un milliard de dollars est tout bonnement absente. L'absence est un type, `Option`, qu'il faut ouvrir avant de pouvoir se servir de ce qu'il y a dedans. Après des années de vérifications défensives de null en Java et de surprises `undefined` en JavaScript, le compilateur qui refuse simplement de me laisser oublier est un soulagement discret.

## Ce qui est resté dur, et je ne vais pas faire semblant du contraire

Si je ne te racontais que l'illumination, je ferais la même chose malhonnête que les billets « Rust a changé ma vie ». Plusieurs choses sont restées franchement dures.

- **Les temps de compilation.** C'est un vrai coût. La boucle rapide que j'avais en JavaScript, sauvegarder et voir tout de suite, a disparu. On s'adapte, mais on paie.
- **Les lifetimes pour de vrai.** Les règles d'emprunt de base cliquent vite. Les annotations de lifetime explicites dans du code plus tordu ont pris bien plus longtemps, et il m'arrive encore de restructurer du code pour éviter un combat que je pourrais techniquement gagner.
- **Le Rust asynchrone.** L'async a des aspérités que le langage synchrone n'a pas. C'est utilisable et ça s'améliore, mais c'est la partie où je sens le plus que le langage est plus jeune que l'écosystème Java.
- **La taxe d'entrée est réelle.** Les deux premières semaines, j'étais plus lent en Rust que je ne l'aurais été dans un langage que je connaissais déjà. Ce n'est pas une note de bas de page, c'est la vraie barrière, et la nier n'aide personne qui hésite à investir.

## Est-ce que ça valait le coup ?

Pour moi, clairement oui, mais je veux être précis sur le *pourquoi*, parce que « apprends Rust » en conseil passe-partout est la meilleure façon de finir frustré.

Ça valait le coup à cause précisément de la couche dont parle cette série : l'outillage que je construis pour le développement assisté par IA se trouve dans le chemin critique d'un agent, et là les exigences de Rust cessent d'être des agacements pour devenir la raison pour laquelle les outils sont rapides, en binaire unique, et fiables. Si j'écrivais des scripts de colle ou un back-end vite fait, je ne le dégainerais pas, et je te dirais la même chose.

Mais il y a un second bénéfice que je n'attendais pas, et c'est celui que je vendrais vraiment à un développeur JS ou Java qui hésite. **Rust m'a rendu meilleur dans les langages que je connaissais déjà.** Après avoir été forcé d'être explicite sur l'ownership, les lifetimes et l'échec, j'écris du Java plus clair et du JavaScript plus délibéré. Je réfléchis à qui mute quoi et à où les choses peuvent échouer *avant* que l'exécution me le dise, parce que Rust en a fait un réflexe. Pas besoin de migrer ta carrière vers Rust pour ça. Il faut y passer assez de temps pour intérioriser les questions qu'il refuse de te laisser esquiver.

Si tu veux essayer, un conseil concret : ne t'épuise pas sur des exercices jouets. Construis un petit outil *réel* que tu utiliserais vraiment, un CLI que tu dégaines, et laisse le borrow checker t'apprendre sur de vrais problèmes. Et prévois deux ou trois semaines à te sentir lent. Le déclic arrive de l'autre côté de ça, pas avant.

## À retenir

Je ne suis pas tombé amoureux de Rust parce qu'il est élégant ou rapide, même s'il est les deux. J'y suis resté parce qu'il a mis au grand jour un ensemble de décisions que je prenais mal et invisiblement depuis des années. Le borrow checker que je lisais autrefois comme un videur s'est révélé un professeur, et la leçon s'est transférée à tous les langages que j'utilise.

Ça referme cette petite série sur Rust et l'ère de l'IA : [pourquoi les outils ont changé de langage](/fr/blog/the-ai-era-runs-on-rust), [à quoi ça ressemble dans un outil](/fr/blog/semtree-local-semantic-code-search-rust), et maintenant ce qu'il a fallu pour apprendre réellement le langage qui est dessous.

*L'outillage Rust que je construis vit sur [rustkit-ai](/fr/experiences/rustkit-ai). Si tu es développeur JS ou Java à peser le saut, le résumé honnête est : dur pendant deux semaines, rentable pour une vie de pensée plus claire.*
