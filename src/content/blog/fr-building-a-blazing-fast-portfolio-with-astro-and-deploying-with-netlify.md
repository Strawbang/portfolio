---
title: "Créer un portfolio ultra-rapide avec Astro et le déployer sur Netlify"
description: "Comment créer un portfolio performant avec Astro et le thème Portfolio, puis le déployer facilement sur Netlify."
publishDate: "2023-07-24"
tags: ["astro", "javascript", "webdev", "tutorial"]
img: "/assets/stats-website.webp"
img_alt: "Métriques de performance du portfolio Astro — score Lighthouse 100/100"
lang: fr
relatedPosts: ["model-context-protocol-mcp-cli-rust-ide", "full-remote-bliss-fullstack-devs-jet-lag-advantage"]
---

## Introduction

Dans cet article, nous allons voir comment créer un portfolio ultra-rapide avec Astro et son thème Portfolio, puis le déployer facilement sur Netlify. Avec cette combinaison puissante, vous pouvez mettre votre portfolio en ligne rapidement et impressionner clients et recruteurs.

## Qu'est-ce qu'Astro ?

Astro est un générateur de sites statiques moderne qui combine les meilleures caractéristiques des générateurs traditionnels avec la puissance des frameworks contemporains. Son approche unique compile votre site en une application JavaScript entièrement optimisée, offrant des performances exceptionnelles et une expérience utilisateur fluide. De plus, Astro supporte les frameworks populaires comme React, Vue et Svelte, permettant aux développeurs de créer des applications web complexes en toute simplicité.

## Le thème Portfolio

Ce thème inclut les fonctionnalités essentielles comme les sections projets. Il constitue une excellente base pour mettre en valeur votre travail et vos réalisations efficacement.

## Démarrer avec Astro et le thème Portfolio

Suivez ces étapes pour créer votre portfolio rapide avec Astro et le thème Portfolio :

### Étape 1 : Configurer votre environnement de développement

Assurez-vous d'avoir Node.js et npm installés sur votre système. Vous pouvez vérifier leur présence en exécutant les commandes suivantes dans votre terminal :

```bash
node -v
npm -v
```

### Étape 2 : Créer un nouveau projet Astro avec le template portfolio

Ouvrez votre terminal et créez un nouveau projet Astro avec la commande suivante :

```bash
npm create astro@latest -- --template portfolio
```

### Étape 3 : Personnaliser votre portfolio

Remplacez le contenu par défaut du répertoire `src` par vos propres projets, images et informations. Vous pouvez facilement modifier les composants et mises en page du thème Portfolio pour qu'ils correspondent à votre style et vos préférences.

### Étape 4 : Tester votre portfolio en local

Pour visualiser votre portfolio en local, lancez le serveur de développement :

```bash
npm run dev
```

Votre portfolio sera accessible à l'adresse `http://localhost:4321`.

## Déployer avec Netlify

Netlify simplifie considérablement le processus de déploiement, offrant une expérience fluide pour les sites statiques. Suivez ces étapes pour déployer votre portfolio Astro sur Netlify :

### Étape 1 : Créer un compte Netlify

Si vous n'en avez pas encore, inscrivez-vous gratuitement sur Netlify à [netlify.com](https://www.netlify.com/).

### Étape 2 : Installer la CLI Netlify

Installez la CLI Netlify globalement sur votre machine pour interagir avec Netlify depuis la ligne de commande :

```bash
npm install netlify-cli -g
```

### Étape 3 : Builder votre portfolio

Avant de déployer, buildez votre projet Astro pour générer les fichiers optimisés :

```bash
npm run build
```

### Étape 4 : Initialiser Netlify

Naviguez vers le répertoire de votre projet dans le terminal et lancez :

```bash
netlify init
```

Suivez les instructions pour lier votre compte Netlify et sélectionner le projet à déployer.

### Étape 5 : Déployer votre portfolio

Enfin, déployez votre portfolio avec la commande suivante :

```bash
netlify deploy --prod
```

Votre portfolio sera automatiquement déployé sur Netlify, et vous recevrez une URL unique où votre portfolio ultra-rapide sera accessible par tous, partout dans le monde.

## Conclusion

Créer un portfolio rapide et impressionnant n'a jamais été aussi simple grâce à Astro et son thème Portfolio. L'approche orientée performance d'Astro et son intégration fluide avec les frameworks modernes vous permettent de construire un portfolio de qualité sans effort. De plus, déployer votre portfolio sur Netlify garantit qu'il soit accessible au monde entier en quelques clics. Alors, pourquoi attendre ? Créez votre portfolio avec Astro et mettez en valeur vos compétences auprès de la communauté tech mondiale dès aujourd'hui !
