// Copy for the home page (/ and /fr/).
// Every ledger line states something that can be checked through its link:
// no adjectives standing in for evidence, no numbers that are not on record.

export type HomeLang = 'en' | 'fr';

export interface LedgerEntry {
  when: string;
  title: string;
  org: string;
  fact: string;
  proof: { label: string; href: string };
  /** Optional second proof, e.g. a third-party page confirming the entry. */
  secondary?: { label: string; href: string };
  /** Optional recording. The caption must say exactly what the recording shows. */
  media?: { mp4: string; poster: string; caption: string };
}

export interface HomeCopy {
  lead: string;
  status: string;
  resumeLabel: string;
  emailLabel: string;
  portraitAlt: string;
  builtTitle: string;
  builtIntro: string;
  ledger: LedgerEntry[];
  allWorkLabel: string;
  allWorkHref: string;
  writingTitle: string;
  allPostsLabel: string;
  allPostsHref: string;
  contactTitle: string;
  contactText: string;
}

export const home: Record<HomeLang, HomeCopy> = {
  en: {
    lead: 'Senior software engineer with 7+ years of experience. I design and build AI tooling for large, long-lived codebases: code parsing, retrieval, agents over MCP, and the product on top.',
    status: 'Based in France. Open to remote roles with international teams.',
    resumeLabel: 'Download resume',
    emailLabel: 'Email me',
    portraitAlt: 'Portrait of Djamel Bougouffa',
    builtTitle: 'Built and shipped',
    builtIntro: 'Recent work, each with a link you can check.',
    ledger: [
      {
        when: 'Since 2025',
        title: 'Lumio, AI documentation for legacy code',
        org: 'Ippon Technologies',
        fact: 'Designed and built Lumio, which Ippon now offers to its clients. It analyzes a codebase (Git repository or archive up to 20 GB), maps its dependencies and generates business and technical documentation linked to the code, queryable in natural language or from the CLI. Rust CLI, web app and MCP server on one core, with per-organization workspaces and LLM cost tracking. Rolled out to 120+ consultants.',
        proof: { label: 'Case study', href: '/work/ippon-technologies/' },
        secondary: { label: 'Ippon page (FR)', href: 'https://fr.ippon.tech/ia-advisory/lumio-documentation-legacy/' },
      },
      {
        when: 'Since 2025',
        title: 'semtree',
        org: 'Open source, Rust',
        fact: 'Semantic code search, local by default: tree-sitter chunking across 20 languages, on-device embeddings, hybrid vector and BM25 ranking, and an MCP server for coding agents. 9 crates on crates.io.',
        proof: { label: 'Source on GitHub', href: 'https://github.com/rustkit-ai/semtree' },
        media: {
          mp4: '/assets/semtree/demo.mp4',
          poster: '/assets/semtree/demo-poster.webp',
          caption: 'Terminal recording from the semtree README: indexing semtree’s own source (9 files), then two searches in semantic mode.',
        },
      },
      {
        when: 'Since 2026',
        title: 'Regulated B2B extranet',
        org: 'Suez IWS, client engagement',
        fact: 'Hazardous-waste tracking for industrial customers. Rebuilt the CI/CD pipeline, worked on security hardening, and contribute to the ongoing move of a legacy Liferay front end toward Angular micro frontends, while shipping Java features in the core.',
        proof: { label: 'Case study', href: '/work/suez-iws/' },
      },
      {
        when: 'Since 2025',
        title: 'Go Togother',
        org: 'Own product',
        fact: 'Intercity carpooling for Thailand, built solo end to end: NestJS API, React Native app, Next.js web app and PromptPay QR payments. Pre-launch.',
        proof: { label: 'Product site', href: 'https://gotogother.com' },
      },
      {
        when: '2022 – 2024',
        title: 'Bonus and store operations',
        org: 'METRO France, via Wemanity',
        fact: 'Led the front-end repository of a bonus-by-objectives product used by 4,000+ employees and 1,000 managers. Shipped point-of-sale, kiosk and order-tracking features across the 93 METRO France warehouses.',
        proof: { label: 'Case study', href: '/work/metro-france/' },
      },
    ],
    allWorkLabel: 'All experience',
    allWorkHref: '/work/',
    writingTitle: 'Writing',
    allPostsLabel: 'All articles',
    allPostsHref: '/blog/',
    contactTitle: 'Hiring for a remote engineering role?',
    contactText: 'Email me with the role and a few words about the team. I usually reply within two days.',
  },
  fr: {
    lead: "Ingénieur logiciel senior, plus de 7 ans d'expérience. Je conçois et construis de l'outillage IA pour les bases de code volumineuses et anciennes : parsing du code, recherche, agents via MCP, et le produit par-dessus.",
    status: "Basé en France. Ouvert au remote, pour des équipes en France ou à l'international.",
    resumeLabel: 'Télécharger le CV',
    emailLabel: "M'écrire",
    portraitAlt: 'Portrait de Djamel Bougouffa',
    builtTitle: 'Construit et livré',
    builtIntro: 'Travaux récents, chacun avec un lien vérifiable.',
    ledger: [
      {
        when: 'Depuis 2025',
        title: 'Lumio, documentation IA du code legacy',
        org: 'Ippon Technologies',
        fact: "Conception et réalisation de Lumio, qu'Ippon propose aujourd'hui à ses clients. Il analyse une base de code (dépôt Git ou archive jusqu'à 20 Go), cartographie ses dépendances et génère une documentation métier et technique liée au code, interrogeable en langage naturel ou en ligne de commande. CLI Rust, application web et serveur MCP sur un même cœur, avec des espaces par organisation et le suivi des coûts LLM. Déployé auprès de plus de 120 consultants.",
        proof: { label: 'Étude de cas', href: '/fr/experiences/ippon-technologies/' },
        secondary: { label: 'Page Ippon', href: 'https://fr.ippon.tech/ia-advisory/lumio-documentation-legacy/' },
      },
      {
        when: 'Depuis 2025',
        title: 'semtree',
        org: 'Open source, Rust',
        fact: 'Recherche sémantique de code, locale par défaut : découpage tree-sitter sur 20 langages, embeddings calculés sur la machine, classement hybride vecteurs et BM25, et un serveur MCP pour les agents de code. 9 crates sur crates.io.',
        proof: { label: 'Code sur GitHub', href: 'https://github.com/rustkit-ai/semtree' },
        media: {
          mp4: '/assets/semtree/demo.mp4',
          poster: '/assets/semtree/demo-poster.webp',
          caption: 'Enregistrement du README de semtree : indexation du propre code source de semtree (9 fichiers), puis deux recherches en mode sémantique.',
        },
      },
      {
        when: 'Depuis 2026',
        title: 'Extranet B2B réglementé',
        org: 'Suez IWS, mission client',
        fact: 'Suivi des déchets dangereux pour des clients industriels. Pipeline CI/CD reconstruite, travail sur la sécurité, et contribution à la migration en cours d’un front Liferay legacy vers des micro frontends Angular, en livrant des fonctionnalités Java dans le cœur applicatif.',
        proof: { label: 'Étude de cas', href: '/fr/experiences/suez-iws/' },
      },
      {
        when: 'Depuis 2025',
        title: 'Go Togother',
        org: 'Produit personnel',
        fact: 'Covoiturage interurbain en Thaïlande, construit seul de bout en bout : API NestJS, app React Native, web app Next.js et paiement par QR PromptPay. En pré-lancement.',
        proof: { label: 'Site du produit', href: 'https://gotogother.com' },
      },
      {
        when: '2022 – 2024',
        title: 'Primes et opérations en magasin',
        org: 'METRO France, via Wemanity',
        fact: "Responsable du dépôt front d'un produit de primes sur objectifs utilisé par plus de 4 000 salariés et 1 000 managers. Fonctionnalités de caisse, bornes et suivi de commandes dans les 93 entrepôts METRO.",
        proof: { label: 'Étude de cas', href: '/fr/experiences/metro-france/' },
      },
    ],
    allWorkLabel: 'Toutes les expériences',
    allWorkHref: '/fr/experiences/',
    writingTitle: 'Articles',
    allPostsLabel: 'Tous les articles',
    allPostsHref: '/fr/blog/',
    contactTitle: 'Vous recrutez pour un poste en remote ?',
    contactText: "Écrivez-moi avec le poste et quelques mots sur l'équipe. Je réponds en général sous deux jours.",
  },
};
