---
title: "L'IA a cassé notre code de production. Voilà la règle du Craftsmanship qui aurait tout évité"
description: "Un agent IA a silencieusement cassé une règle métier vieille de 10 ans sur une codebase Java legacy. Aucun test ne l'a attrapé. Ça a remonté en production. Voici ce que ça m'a appris sur le Software Craftsmanship, et pourquoi ces principes comptent plus que jamais quand l'IA écrit votre code."
publishDate: 2026-05-04
tags: ["Software Engineering"]
keywords: ["Software Craftsmanship", "Clean Code", "TDD", "Software Engineering", "Bonnes Pratiques", "IA"]
img: "/assets/software-craftmanship-ai-era.png"
img_alt: "Un développeur qui relit du code à l'écran, les principes du craftsmanship à l'ère de l'IA"
lang: "fr"
relatedPosts: ["claude-code-jira-mcp-legacy-codebase", "spec-driven-development", "stack-standardization-80-percent-faster"]
---

Quand des outils capables de générer du code à grande échelle deviennent courants, on est tenté de penser que les anciennes règles ne s'appliquent plus. Pourquoi se battre sur le nommage si l'IA comprend n'importe quel nom de variable ? Pourquoi écrire des tests si l'IA va de toute façon réécrire la fonction ? Pourquoi refactorer quand générer une nouvelle implémentation est plus rapide que nettoyer l'ancienne ?

Ce raisonnement est dangereux. Et dans mon expérience, les codebases qui souffrent le plus du développement assisté par IA sont ceux qui ont abandonné la discipline en premier.

## Ce qu'est vraiment le Software Craftsmanship

Le Software Craftsmanship, formalisé dans le [manifeste de 2009](https://manifesto.softwarecraftsmanship.org/), est un ensemble de standards professionnels : code propre, développement piloté par les tests, refactoring continu, design simple, et ownership collectif. Il traite le code comme un artisanat : quelque chose dont on est fier, quelque chose qu'on entretient.

Ce n'est pas une quête de perfection. C'est une responsabilité professionnelle.

## Les principes qui ont survécu

Après avoir travaillé avec des outils IA sur des codebases de production pendant plus d'un an, voici ce que j'ai constaté : les principes du craftsmanship ne disparaissent pas. Ils deviennent porteurs.

### 1. Les tests sont votre seul filet de sécurité

C'était vrai avant l'IA. C'est critique maintenant.

L'IA génère du code rapidement mais sans compréhension profonde de l'intention. Elle peut produire du code qui passe la revue manuelle et casse silencieusement une règle métier qui n'a jamais été écrite. Les tests sont le seul moyen systématique de détecter ça.

Je l'ai vécu directement. Sur une codebase Java legacy sans couverture de tests, un agent IA a refactorisé en toute confiance un calcul qui tournait depuis des années. Le changement semblait correct, passait le linter, et introduisait une régression silencieuse sur une règle métier que personne n'avait documentée. Il n'y avait aucun test pour l'attraper. Ça a remonté en production. C'est cette session qui m'a fait arrêter de traiter le craftsmanship comme optionnel avec l'IA. J'ai commencé à le traiter comme une précondition.

Le TDD en particulier change la dynamique : écrire le test en premier vous force à définir ce que "correct" signifie avant que l'IA ne propose une implémentation. L'IA a alors une cible à atteindre. Sans cette cible, vous relisez du code en espérant qu'il soit juste. Ce n'est pas de l'ingénierie, c'est de l'optimisme.

J'ai arrêté de traiter la couverture de tests comme une métrique. Je la traite comme une précondition. Si l'IA fait un changement qui n'est pas couvert par des tests, soit les tests passent en premier, soit le changement n'a pas lieu.

Certains dans la communauté craftsmanship avancent que le TDD ne s'applique plus de la même façon quand c'est l'IA qui écrit le code, et ils ont raison sur un point : la *mécanique* change. Le cycle classique Rouge → Vert → Refactoring était conçu pour un humain qui écrit à la fois le test et l'implémentation, où l'acte de coder est lui-même une activité de design.

Avec l'IA, cette partie change. Mais le contrat que crée le test, lui, ne change pas.

Le test écrit avant l'implémentation définit toujours ce que "correct" signifie. Il vous force toujours à réfléchir au comportement attendu avant de générer quoi que ce soit. L'IA écrit le Vert, mais vous possédez le Rouge. Et le Refactoring reste entièrement le vôtre. Ce qui disparaît, c'est la boucle de feedback design-par-implémentation. Ce qui reste, et ce qui compte le plus sur des codebases legacy avec l'IA, c'est le contrat de sécurité.

Concrètement, avant de demander à une IA de toucher de la logique métier, j'écris d'abord un test de caractérisation :

```java
// Étape 1 : écrire le test qui définit ce que "correct" signifie
@Test
void shouldApplyReducedVatRateForB2bGermanOrders() {
    Order order = Order.builder()
        .amount(new BigDecimal("1000"))
        .customerType(CustomerType.B2B)
        .country("DE")
        .build();

    BigDecimal vat = vatService.calculateVat(order);

    // Allemagne B2B : 19%, pas le taux standard de 20%
    assertThat(vat).isEqualByComparingTo(new BigDecimal("190"));
}

// Étape 2 : maintenant l'IA a une cible — et un filet de sécurité
```

Sans ce test, l'IA aurait refactorisé `calculateVat()` pour utiliser une constante `VAT_RATE = 0.20` : propre, cohérent, et silencieusement faux pour toutes les commandes B2B allemandes.

### 2. La lisibilité, c'est pour le prochain humain

L'IA peut parser n'importe quel code. Les humains, non.

L'argument "l'IA le comprend, donc le nommage n'a pas d'importance" confond l'outil et le processus. Quand un bug remonte à 2h du matin, ce n'est pas l'IA qui est réveillée. Quand un nouveau développeur rejoint l'équipe, il lit le code dans une revue de PR, pas dans une fenêtre de chat. Quand votre tech lead remet en question un choix d'architecture, il a besoin de comprendre l'intention, pas seulement la mécanique.

Le code propre est une documentation qui ne vieillit jamais mal. Dans le développement assisté par IA, où le volume de code généré augmente, la lisibilité devient une propriété plus précieuse, pas moins.

Une variable nommée `result` est de la dette technique. Une variable nommée `facturesEligiblesAuRecouvrement` est autodocumentée. L'IA s'en fiche. Votre équipe, non.

```java
// Ce que l'IA génère souvent — correct, illisible
BigDecimal r = o.getA().multiply(getR(o.getC(), o.getT()));

// Ce que le craftsmanship exige
BigDecimal montantTVA = commande.getSousTotal()
    .multiply(resolveurTauxTVA.resoudre(commande.getPays(), commande.getTypeClient()));
```

La deuxième version ne fait pas que mieux paraître. Quand le bug TVA remonte à 2h du matin, votre collègue trouve la bonne classe en 10 secondes plutôt qu'en 10 minutes.

### 3. Des changements petits, réversibles par défaut

Les outils IA adorent générer de grands changements. Une seule invite peut toucher 20 fichiers, renommer 3 abstractions et restructurer 2 modules. C'est genuinement utile, et genuinement dangereux.

Le principe du craftsmanship ici est : *gardez les changements petits et réversibles*. Un concept par commit. Les tests avant le refactoring. Un diff qu'un collègue peut relire en 15 minutes sans perdre le contexte.

C'est aussi là que la règle du Boy Scout prend tout son sens : *laissez le code un peu meilleur que vous l'avez trouvé*. Pas complètement redesigné. Pas entièrement modernisé. Juste un peu plus propre. Cette discipline évite le problème "l'IA a fait un gros refactoring en corrigeant un bug" qui transforme une PR de routine en une session de revue de 3 heures.

```bash
# Ce que l'IA tend à produire : un commit massif impossible à relire
git log --oneline
# a3f9c12 refactor order processing
# (touche : OrderService, VatCalculator, InvoiceGenerator,
#  PaymentProcessor, OrderRepository, OrderMapper — 847 lignes modifiées)

# Ce que le craftsmanship donne
# 1f2a3b4 PROJ-421: extraire VatRateResolver de OrderService
# 8c9d0e1 PROJ-421: ajouter taux TVA B2B pour DE, AT, CH
# 2e3f4a5 PROJ-421: couvrir VatRateResolver avec des tests unitaires
# 7b8c9d0 PROJ-421: corriger taux TVA incorrect sur les commandes B2B allemandes
```

Le deuxième historique est relisible, bisectable et réversible. Le premier est un pari.

### 4. Le refactoring est une pratique continue, pas un sprint

Le code généré par IA tend vers la duplication. Demandez à une IA d'implémenter une fonctionnalité, et elle créera souvent une nouvelle version de quelque chose qui existe déjà à proximité. Ce n'est pas faux. Elle répond au problème immédiat sans connaître toute la codebase.

La discipline, c'est l'étape de refactoring qui suit. Avant de merger, posez-vous la question : est-ce que ça duplique quelque chose ? Est-ce que ça appartient ici ? Y a-t-il une meilleure abstraction ?

Ce n'est pas le travail de l'IA. C'est le vôtre. L'IA est bonne pour exécuter. Elle n'est pas bonne pour savoir quand quelque chose est déjà fait correctement ailleurs dans une codebase de 200k lignes. C'est la connaissance institutionnelle. C'est le craftsmanship.

```java
// L'IA a généré ça dans OrderService — correct en isolation
private BigDecimal appliquerRemise(BigDecimal montant, String typeClient) {
    if ("B2B".equals(typeClient)) return montant.multiply(new BigDecimal("0.90"));
    return montant;
}

// Mais ça existait déjà dans PricingService — depuis 3 ans
public BigDecimal appliquerRemiseClient(BigDecimal prixBase, TypeClient type) {
    return prixBase.multiply(configRemise.getTauxPour(type));
}
```

Deux implémentations de la même logique, divergeant silencieusement. L'IA ne savait pas. Vous, si, à condition de regarder.

### 5. L'ownership collectif exige des standards explicites

Le principe le plus sous-estimé du manifeste craftsmanship est l'ownership collectif du code : l'idée que toute l'équipe est responsable de toute la codebase, pas seulement de "ses" modules.

Les outils IA rendent ça plus difficile par défaut. Tout le monde utilise ses propres prompts, son propre modèle, son propre style. Sans standards partagés explicites, le développement assisté par IA accélère la divergence : conventions de nommage différentes, styles de tests différents, niveaux d'abstraction différents dans le même service.

La solution est explicite : un `CLAUDE.md`, un `CONTRIBUTING.md`, des règles de linting sans exceptions, des templates de PR qui imposent la checklist de revue. Ce n'est pas de la bureaucratie. C'est l'échafaudage qui rend l'ownership collectif possible quand une partie de l'équipe est une IA.

```markdown
# CLAUDE.md (extrait)

## Règles non négociables
- Ne jamais modifier `LegacyOrderMapper` sans tests de caractérisation d'abord
- Toutes les valeurs monétaires en **centimes (Long)** — jamais BigDecimal en base de données
- Les taux de TVA vivent dans `VatRateConfig` — ne jamais les coder en dur
- Ne PAS ajouter `@Transactional` aux jobs du scheduler — ils maintiennent des connexions pendant des minutes

## Avant tout refactoring
1. Écrire des tests qui décrivent le comportement actuel
2. Confirmer que les tests passent sur le code non modifié
3. Refactoriser
4. Confirmer que les tests passent toujours
```

Ce fichier est le contrat partagé. Chaque développeur le lit. L'agent IA le lit. Les standards cessent d'être des habitudes individuelles et deviennent de l'infrastructure d'équipe.

Mais le `CLAUDE.md` est une contrainte *douce* : l'IA le respecte si vous le configurez. Les règles de linting sont des contraintes *dures* : le CI casse si quiconque, humain ou IA, les viole.

Pour l'architecture hexagonale en particulier, `eslint-plugin-boundaries` impose l'isolation des couches au niveau des imports :

```js
// .eslintrc — les frontières architecturales comme règles de linting
"boundaries/element-types": ["error", {
  default: "disallow",
  rules: [
    // Le domaine est pur : aucun import externe autorisé
    { from: "domain", allow: [] },
    // La couche application ne dépend que du domaine
    { from: "application", allow: ["domain"] },
    // Seuls les adapters peuvent toucher l'infrastructure
    { from: "adapters", allow: ["application", "domain"] },
  ]
}]
```

Si l'IA génère `import { PrismaClient } from '@prisma/client'` à l'intérieur de votre domaine, le pipeline échoue immédiatement, avant la revue, avant le merge, avant la production. L'architecture s'applique d'elle-même.

En Java, vous avez trois options selon jusqu'où vous souhaitez aller :

**ArchUnit** — appliqué comme assertion de test, utile sur les codebases legacy où restructurer n'est pas une option :

```java
@Test
void domainShouldNotDependOnInfrastructure() {
    noClasses().that().resideInAPackage("..domain..")
        .should().dependOnClassesThat()
        .resideInAPackage("..infrastructure..")
        .check(importedClasses);
}
```

**Multi-module Maven/Gradle** — contrainte structurelle. Si `domain` ne déclare pas `infrastructure` comme dépendance, l'import ne peut physiquement pas compiler :

```xml
<!-- domain/pom.xml — infrastructure n'est tout simplement pas là -->
<dependencies>
    <!-- pas de dépendance infrastructure = aucun import possible -->
</dependencies>
```

**JPMS (Java 9+)** — l'option la plus native. `module-info.java` déclare exactement ce que chaque module peut voir. Pas de `requires infrastructure` = erreur de compilation, point final :

```java
// domain/src/main/java/module-info.java
module com.example.domain {
    exports com.example.domain.model;
    exports com.example.domain.port;
    // pas de 'requires infrastructure' — l'import est une erreur de compilation
}
```

Sur un projet greenfield, multi-module ou JPMS est la bonne réponse. ArchUnit brille sur les codebases legacy où vous ne pouvez pas encore restructurer mais avez besoin du garde-fou immédiatement.

C'est la différence entre les *guidelines* et la *gouvernance*. Le `CLAUDE.md` dit à l'IA quoi faire. Le linter, ou le compilateur, rend impossible de faire autrement.

## Ce que l'IA change vraiment

Pour être honnête : l'IA change bien certaines choses.

**L'exploration est plus rapide.** Comprendre une nouvelle codebase, tracer un flux de données, trouver où vit un bug. L'IA compresse ça de plusieurs heures à quelques minutes. C'est genuinement bon. La partie archéologie du travail logiciel est de toute façon la moins porteuse de valeur artisanale.

**Le boilerplate a disparu.** Écrire un endpoint CRUD, un DTO, un mapper — ces choses ne nécessitent plus de craft. Elles nécessitent une spec claire. C'est un gain net : ça déplace le focus là où le jugement compte vraiment.

**Le craft est dans les contraintes.** La compétence n'est plus dans la frappe. Elle est dans la définition de ce qui est correct avant de générer. La spécification, le test, le `CLAUDE.md`, la revue : ce sont les surfaces du craft. Elles ont toujours été les parties les plus importantes. L'IA ne fait que le rendre évident.

**Le risque se multiplie sans discipline.** Un développeur sans rigueur écrit du mauvais code lentement. Un développeur sans rigueur avec l'IA écrit du mauvais code vite. Le volume d'output augmente, mais la surface des régressions silencieuses, du couplage caché, et des règles métier cassées par un modèle confiant qui n'avait aucun test pour le corriger, augmente avec lui.

## La responsabilité reste la vôtre

Voici où j'en suis arrivé : l'IA ne réduit pas la responsabilité d'un développeur senior. Elle la déplace en amont.

Avant : écrire le code, relire le code, tester le code.  
Avec l'IA : définir ce que correct signifie, contraindre la génération, valider l'output.

La deuxième boucle demande autant de discipline. Peut-être plus. Parce que le volume d'output est plus élevé, la surface de revue est plus large, et les raccourcis cognitifs sont plus faciles à prendre.

Le Software Craftsmanship est la discipline qui vous garde honnête dans cette boucle.

Les principes n'ont pas été remplacés. Ils sont devenus le travail.

Et si vous managez une équipe, votre responsabilité est double : pratiquer ces standards vous-même, mais aussi en faire le socle commun depuis lequel tout le monde — humain et IA — opère.

## Points clés à retenir

- **Les tests sont une précondition, pas une métrique.** Si l'IA fait un changement sans couverture de tests, soit les tests passent en premier, soit le changement n'a pas lieu.
- **La lisibilité est pour les humains, pas les modèles.** L'IA peut parser n'importe quoi. Votre équipe, non. Le code propre est une documentation qui ne vieillit jamais mal.
- **Gardez les changements petits et réversibles.** L'IA génère de grands diffs par défaut. Votre discipline est de la contraindre : un concept par commit, relisible en 15 minutes.
- **Le refactoring est votre travail, pas celui de l'IA.** L'IA ne sait pas ce qui existe déjà ailleurs dans une codebase de 200k lignes. Vous, si.
- **Les standards explicites permettent l'ownership collectif.** Sans `CLAUDE.md`, sans `CONTRIBUTING.md`, sans linting appliqué, le développement assisté par IA accélère la divergence dans votre équipe.
- **Le risque se multiplie sans discipline.** Une équipe sans rigueur avec l'IA n'écrit pas du mauvais code lentement — elle en écrit vite.
