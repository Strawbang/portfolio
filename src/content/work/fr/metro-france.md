---
title: METRO France
publishDate: 2023-06-15 00:00:00
img: /assets/optimized/metro-france.webp
img_alt: Parking of METRO France Nanterre
role: Développeur Full-Stack
startDate: 2022-03-01
endDate: 2024-03-31
description: |
  Consultant chez METRO France (2022-2024) : responsable du front d'un produit de primes utilisé par plus de 4 000 salariés et 1 000 managers dans 93 entrepôts, et fonctionnalités de bornes de commande et de suivi de commandes.
tags:
  - Front-End
  - Back-End
  - Cloud
keywords:
  - TypeScript
  - React
  - Node.js
  - GraphQL
  - GCP
  - Kubernetes
  - TypeORM
  - GitHub Actions
  - Scrum
relatedPosts:
  - software-craftsmanship-ai-era
  - stack-standardization-80-percent-faster
relatedWork:
  - wemanity
engagementType: client
teamSize: "~6"
companySize: "~3000"
context: legacy
workplace: Hybrid
stack:
  Frontend:
    - TypeScript
    - React
  Backend:
    - Node.js
    - GraphQL
    - TypeORM
  DevOps:
    - GCP
    - Kubernetes
    - GitHub Actions
  Methodology:
    - Agile Scrum
---

### Un produit de primes et la commande en Halle pour 93 entrepôts

<p>METRO France exploite 93 entrepôts cash-and-carry pour les clients professionnels. De mars 2022 à mars 2024, j'y ai travaillé comme consultant pour Wemanity Group, dans une équipe produit d'environ six personnes.</p>

#### Produit de primes sur objectifs

<p>Les primes des entrepôts étaient gérées dans des tableurs : les directeurs de magasin saisissaient les données à la main, les RH les consolidaient plus tard, et les erreurs s'accumulaient en route. L'équipe a remplacé ce circuit par un produit qui calcule et distribue les primes, utilisé par plus de 4 000 salariés et 1 000 managers dans tout le réseau.</p>

<p>J'étais responsable de son dépôt front (React et TypeScript), structuré en architecture hexagonale et en Atomic Design pour que les règles métier restent en dehors des composants d'interface.</p>

#### Bornes de commande et suivi des commandes

<p>J'ai livré des fonctionnalités de caisse et travaillé sur les bornes de commande en Halle, où les clients professionnels commandent des produits lourds ou volumineux depuis l'entrepôt et les récupèrent en 30 minutes maximum. J'ai aussi travaillé sur l'écran de suivi, qui affiche en temps réel le statut de préparation des commandes en cours. Les deux s'appuient sur le système click-and-collect de METRO : commande en ligne, terminaux en Halle et suivi des commandes.</p>

#### Une seule stack pour tous les produits

<p>À mon arrivée, chaque produit avait ses propres technologies, conventions et déploiements. Nous nous sommes alignés sur une stack commune (TypeScript, React, Node.js, TypeORM et GraphQL, sur GCP et Kubernetes, avec GitHub Actions pour la CI/CD), puis nous avons ajouté des composants, des configurations et un modèle de CI/CD partagés. L'équipe a mesuré des cycles de création de produit raccourcis de 80 % ensuite. J'explique comment, et ce que ça a coûté, dans <a href="/fr/blog/stack-standardization-80-percent-faster/">un article dédié</a>.</p>

#### Références

- [METRO France Lyon-Gerland, bornes de commande pour produits lourds/volumineux](https://www.metro.fr/halles/lyon-gerland)
- [Clic & Retrait, service click-and-collect METRO France](https://www.metro.fr/service/approvisionnement/clic-retrait)
