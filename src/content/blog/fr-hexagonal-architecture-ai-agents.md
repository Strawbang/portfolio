---
title: "L'architecture hexagonale est le plus beau cadeau à faire à un agent IA"
description: "Les ports et adaptateurs n'ont pas été conçus pour l'IA. Mais isoler sa logique métier derrière des frontières propres se révèle être le moyen le plus efficace de laisser un agent de code travailler vite sans saccager le domaine. Voici pourquoi, avec un vrai avant/après en Java."
publishDate: 2026-07-08
tags: ["IA", "Software Engineering", "Architecture"]
keywords: ["architecture hexagonale agent IA", "ports et adaptateurs", "agents de code IA", "Claude Code", "architecture adaptée à l'IA", "refactoring Java legacy", "revue de code IA", "conception logicielle pour l'IA"]
img: "/assets/blog/hexagonal-architecture-ai-agents.webp"
img_alt: "Un schéma hexagonal ports-et-adaptateurs avec un agent IA travaillant sur les adaptateurs externes tandis que le cœur métier reste protégé"
draft: false
lang: "fr"
relatedPosts: ["software-craftsmanship-ai-era", "claude-code-jira-mcp-legacy-codebase"]
relatedWork: ["rustkit-ai"]
---

On a adopté l'architecture hexagonale pour les humains qui reliraient le code plus tard. Il se trouve qu'on l'a aussi bâtie pour un lecteur qu'on n'avait pas vu venir : l'agent IA qui travaille sur la codebase aujourd'hui.

Je ne l'ai pas planifié. Je l'ai constaté. Le même agent de code, face au même type de tâche, se comportait de façon radicalement différente selon la forme du code dans lequel il atterrissait. Dans une codebase emmêlée, c'était un danger. Dans une codebase proprement structurée, il était réellement rapide et réellement sûr. La différence, ce n'était ni le modèle, ni le prompt, ni l'outillage. C'était l'architecture.

Voici pourquoi **les ports et adaptateurs sont le plus beau cadeau à faire à un agent IA**, et les limites honnêtes de cette affirmation.

## La même tâche, deux codebases

Donne à un agent cette tâche : *« Ajoute une notification Slack quand une commande est expédiée. »*

Dans un service emmêlé, la logique d'expédition, la persistance et les appels sortants vivent dans une seule classe de 600 lignes. L'agent la lit, décide que l'endroit naturel pour se brancher est juste après la mise à jour du statut, et édite là. Ça marche. Ça déplace aussi discrètement une ligne, change le moment où le timestamp `shippedAt` est fixé, et voilà qu'une règle de facturation vieille de dix ans, indexée sur ce timestamp, se déclenche un jour trop tôt. Aucun test ne l'a attrapé, parce que le test vérifiait « un email est envoyé », pas « le timestamp est intact ». Ça remonte en production. (Si ce mode de défaillance te dit quelque chose, c'est parce que [j'ai vu un agent casser en silence une règle métier non documentée en production](/fr/blog/software-craftsmanship-ai-era) : une autre règle, la même forme d'erreur.)

Dans une codebase hexagonale, la même tâche est ennuyeuse dans le meilleur sens du terme. Il existe une interface `NotificationPort`. L'agent implémente un `SlackNotificationAdapter`, le branche, et ne touche jamais au domaine. La règle métier sur `shippedAt` vit dans un cœur pur que l'agent n'avait aucune raison d'ouvrir. Le rayon de destruction du changement était borné *par l'architecture*, avant même que l'agent ne tape un caractère.

C'est toute la thèse. La suite du billet détaille pourquoi la seconde histoire arrive à dessein, et non par chance.

## Pourquoi l'hexagonal marche *pour un agent* en particulier

L'architecture hexagonale n'a rien de neuf pour les humains. Ce qui est neuf, c'est que ses propriétés exactes se trouvent être celles dont un agent IA a le plus besoin.

### 1. Elle borne le rayon de destruction

Le pire mode de défaillance d'un agent n'est pas d'écrire du code faux : c'est d'écrire du code plausible au mauvais endroit. Il optimise localement pour « faire marcher la tâche » et n'a aucun instinct de ce qu'il met en péril trois couches plus loin.

Les ports et adaptateurs répondent à ça structurellement. Le domaine n'a aucune dépendance vers l'extérieur ; tout ce qui est volatil (HTTP, base de données, API tierces, files de messages) vit dans des adaptateurs, à la périphérie. Ainsi, la surface où l'agent *doit* travailler (les adaptateurs) est physiquement séparée de celle qu'il ne devrait presque jamais toucher (le cœur métier). Tu n'espères pas que l'agent respecte une frontière. La frontière est porteuse.

### 2. Le cœur est testable en isolation, donc l'agent a une boucle de feedback rapide

Un domaine pur, sans I/O, se teste sans démarrer une base de données ni un serveur web. Ça compte plus pour un agent que pour toi, parce que toute la boucle de travail de l'agent c'est *éditer → lancer → lire le résultat → corriger*. Plus cette boucle est rapide et ciblée, meilleur est l'agent.

Quand la logique métier est un cœur pur, l'agent peut écrire un test, le lancer en quelques millisecondes, et obtenir un signal sans ambiguïté : « la règle tient toujours » ou « non ». Quand la logique est étalée dans une classe couplée à l'infra, le seul moyen de la tester est un test d'intégration lent, instable et vague sur *ce qui* a cassé. Une bonne architecture donne à l'agent un oracle de vérité. Une mauvaise lui donne un haussement d'épaules.

### 3. Les ports nomment le travail dans la langue du domaine

Un port `PaymentGateway` avec `authorize(Payment)` et `capture(Payment)` dit à l'agent ce que fait le système en termes métier. Un fouillis d'appels `HttpClient` et de mapping de DTO ne lui dit rien, sinon comment la plomberie se trouve câblée cette semaine.

Les LLM sont exceptionnellement bons pour suivre une intention bien nommée et facilement perdus dans la complexité accidentelle. Les ports sont, de fait, une interface curée sur laquelle un agent peut raisonner, la même raison pour laquelle [l'ubiquitous language](/fr/blog/claude-code-jira-mcp-legacy-codebase) aide un humain à embarquer. Tu n'organises pas seulement le code ; tu tends à l'agent une carte écrite dans le bon vocabulaire.

## Ce que ça donne en Java

Voici la version emmêlée qu'un agent abîmera avec plaisir :

```java
// OrderService.java : tout au même endroit
public void ship(Long orderId) {
    Order order = jpaRepository.findById(orderId).orElseThrow();
    order.setStatus(SHIPPED);
    order.setShippedAt(Instant.now());        // la facturation s'indexe là-dessus
    jpaRepository.save(order);
    // l'agent ajoute sa feature juste ici, à côté d'un timestamp qu'il ne comprend pas
    emailClient.send(order.getCustomerEmail(), "Votre commande est expédiée");
}
```

Et la version hexagonale, où la même feature a un foyer évident et sûr :

```java
// Cœur du domaine : pur, sans framework, sans I/O
public final class ShipOrder {
    private final OrderRepository orders;      // un port
    private final NotificationPort notifier;   // un port

    public void handle(OrderId id) {
        Order order = orders.byId(id);
        order.markShipped();                   // la règle du shippedAt vit dans Order
        orders.save(order);
        notifier.orderShipped(order);          // l'agent étend derrière ce port
    }
}

// Adaptateur : le seul fichier que l'agent a besoin d'ajouter
public final class SlackNotificationAdapter implements NotificationPort {
    public void orderShipped(Order order) { /* appel Slack */ }
}
```

Le domaine n'a pas bougé. `markShipped()` possède toujours la règle du timestamp, scellée à l'intérieur de l'agrégat. L'agent ajoute un adaptateur, implémente une méthode, et il n'a jamais existé de chemin pour qu'il perturbe l'invariant. Non parce qu'il a été prudent, mais parce que l'architecture ne lui a jamais tendu la corde.

## Les limites honnêtes

Une thèse aussi propre mérite d'être bousculée, alors cadrons-la avant de la surappliquer. Trois réserves auxquelles je tiens :

- **L'hexagonal a un coût de cérémonie.** Pour un petit script ou un service jetable, la surcharge ports-et-adaptateurs est de la pure friction, et un agent qui bosse dans un projet de deux fichiers n'en a pas besoin. Ça paie sur de vrais domaines, avec des règles qui méritent d'être protégées, pas partout.
- **Des ports poreux laissent fuir la protection.** Si ton « port » est en réalité une entité JPA ou un objet de réponse HTTP déguisé, le domaine n'est pas isolé, et le rayon de destruction de l'agent non plus. L'architecture aide *exactement à la mesure de son honnêteté.* À moitié hexagonal, tu n'as que la moitié du garde-fou.
- **Elle réduit le rayon de destruction ; elle ne le supprime pas.** Un agent peut toujours écrire une règle métier fausse à l'intérieur d'un cœur parfaitement pur. Les bonnes frontières rendent les mauvais changements *contenus et visibles*, pas impossibles. Tu relis toujours. Tu restes propriétaire de la sortie.

## Le basculement qu'il faut nommer

Pendant vingt ans, on a justifié les frontières propres par un argument sur le futur : *quelqu'un devra maintenir ça.* La récompense était toujours différée, et c'est bien pour ça que la discipline était la première chose sacrifiée sous la pression des délais.

L'agent IA écrase cette temporalité. Le mainteneur pour qui tu construisais travaille désormais dans ton dépôt cet après-midi, et l'architecture du code détermine directement si cet agent est un accélérateur ou un danger. Une bonne structure a cessé d'être un cadeau à un hypothétique ingénieur futur. C'est du levier que tu encaisses aujourd'hui.

La conclusion surprenante est donc le conseil le moins surprenant du métier, avec des enjeux nouveaux : **isole ton domaine.** Pas parce qu'un livre l'a dit, mais parce que la chose qui écrit désormais la moitié de ton code performe exactement aussi bien que tes frontières le permettent. L'architecture hexagonale a toujours été du bon craftsmanship. C'est maintenant aussi l'interface à travers laquelle tes agents font leur meilleur travail.

*Ça rejoint deux choses que j'ai écrites : [pourquoi la discipline d'architecture compte plus, pas moins, quand l'IA écrit le code](/fr/blog/software-craftsmanship-ai-era), et [comment je fais passer une codebase Java legacy du ticket à la pull request avec un agent](/fr/blog/claude-code-jira-mcp-legacy-codebase).*
