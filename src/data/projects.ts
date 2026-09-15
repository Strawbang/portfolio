// Data for the /projects (and /fr/projets) page.
// These are personal builds, kept distinct from client `work`. Everything
// links OUT (product site, GitHub repos), so no detail pages are needed.

export type ProjectLang = 'en' | 'fr';

type Localized = Record<ProjectLang, string>;

export interface FeaturedProject {
  name: string;
  tagline: Localized;
  description: Localized;
  role: Localized;
  highlights: Localized[];
  status: Localized;
  stack: string[];
  href: string;          // dofollow: the marketing site (backlink target)
  cta: Localized;
}

export interface OssTool {
  name: string;
  href: string;          // GitHub repo
  desc: Localized;
  tags: string[];
  crates: string[];      // crates.io crate names to sum downloads for
}

/** Featured product: the end-to-end, multi-surface build. */
export const featured: FeaturedProject = {
  name: 'Go Togother',
  tagline: {
    en: 'Intercity carpooling for Thailand, built end to end.',
    fr: 'Covoiturage interurbain pour la Thaïlande, construit de bout en bout.',
  },
  description: {
    en: 'Intercity carpooling built as a real product, not a demo: riders and drivers share long-distance trips between Thai cities. One TypeScript codebase powers four distinct surfaces, from the backend to a marketing site engineered for search.',
    fr: "Du covoiturage interurbain pensé comme un vrai produit, pas une démo : passagers et conducteurs partagent des trajets longue distance entre villes thaïlandaises. Une seule base TypeScript alimente quatre surfaces distinctes, du backend jusqu'à un site vitrine pensé pour le référencement.",
  },
  role: {
    en: 'Solo build: product, design, engineering and go-to-market.',
    fr: 'Réalisé en solo : produit, design, développement et go-to-market.',
  },
  highlights: [
    {
      en: 'NestJS API: authentication, ride matching and bookings.',
      fr: 'API NestJS : authentification, mise en relation et réservations.',
    },
    {
      en: 'Cross-platform React Native app for riders and drivers.',
      fr: 'App React Native cross-platform pour passagers et conducteurs.',
    },
    {
      en: 'Next.js web app for search and booking on the web.',
      fr: 'Web app Next.js pour la recherche et la réservation sur le web.',
    },
    {
      en: 'Astro marketing site, bilingual EN/Thai with programmatic SEO.',
      fr: 'Site vitrine Astro, bilingue EN/thaï avec SEO programmatique.',
    },
  ],
  status: {
    en: 'Pre-launch · waitlist open',
    fr: "Pré-lancement · liste d'attente ouverte",
  },
  stack: ['NestJS', 'React Native', 'Next.js', 'Astro', 'TypeScript', 'PostgreSQL', 'SEO'],
  href: 'https://gotogother.com',
  cta: { en: 'Visit the site', fr: 'Voir le site' },
};

/** Open-source suite: the rustkit-ai org (all public on GitHub). */
export const ossOrg = {
  name: 'rustkit-ai',
  href: 'https://github.com/rustkit-ai',
  site: 'https://rustkit-ai.github.io/',
  intro: {
    en: 'An open-source organization of Rust tools for AI-assisted development, co-founded with Gokhan Kabar. Below, the tools I built.',
    fr: "Une organisation open source d'outils Rust pour le développement assisté par IA, cofondée avec Gokhan Kabar. Ci-dessous, les outils que j'ai construits.",
  } as Localized,
  install: 'brew install rustkit-ai/tap/semtree',
};

export const ossTools: OssTool[] = [
  {
    name: 'semtree',
    href: 'https://github.com/rustkit-ai/semtree',
    desc: {
      en: 'Semantic code search, local by default: tree-sitter parsing, on-device embeddings, hybrid vector and BM25 ranking, MCP server.',
      fr: 'Recherche sémantique de code, locale par défaut : parsing tree-sitter, embeddings sur la machine, classement hybride vecteurs et BM25, serveur MCP.',
    },
    tags: ['Rust', 'tree-sitter', 'RAG'],
    crates: ['semtree', 'semtree-core', 'semtree-embed', 'semtree-parse', 'semtree-store', 'semtree-rag', 'semtree-analyze', 'semtree-cli', 'semtree-mcp'],
  },
  {
    name: 'trimcp',
    href: 'https://github.com/rustkit-ai/trimcp',
    desc: {
      en: 'MCP proxy that cuts LLM token costs by compressing tool output.',
      fr: 'Proxy MCP qui réduit les coûts de tokens LLM en compressant la sortie des outils.',
    },
    tags: ['Rust', 'MCP'],
    crates: ['trimcp'],
  },
  {
    name: 'semstore',
    href: 'https://github.com/rustkit-ai/semstore',
    desc: {
      en: 'Local semantic search for Rust apps: store text, search by meaning, no cloud. Co-written with Gokhan Kabar.',
      fr: 'Recherche sémantique locale pour apps Rust : stocke du texte, cherche par sens, sans cloud. Coécrit avec Gokhan Kabar.',
    },
    tags: ['Rust', 'embeddings'],
    crates: ['semstore'],
  },
];

/** Page chrome copy. */
export const projectsLabels: Record<ProjectLang, {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroTagline: string;
  productsHeading: string;
  ossHeading: string;
  ossOrgCta: string;
  siteCta: string;
  installHint: string;
  statusLabel: string;
}> = {
  en: {
    metaTitle: 'Projects | Djamel Bougouffa',
    metaDescription: 'Products and open-source tools built by Djamel Bougouffa: a full-stack carpooling marketplace and a suite of local-first Rust tools for AI-assisted development.',
    heroTitle: 'Projects',
    heroTagline: 'What I build on my own: products taken end to end, and open-source tools I ship and maintain.',
    productsHeading: 'Products',
    ossHeading: 'Open source',
    ossOrgCta: 'View the org on GitHub',
    siteCta: 'Visit rustkit-ai.github.io',
    installHint: 'Install any tool via Homebrew:',
    statusLabel: 'Status',
  },
  fr: {
    metaTitle: 'Projets | Djamel Bougouffa',
    metaDescription: "Produits et outils open source construits par Djamel Bougouffa : une marketplace de covoiturage full-stack et une suite d'outils Rust local-first pour le développement assisté par IA.",
    heroTitle: 'Projets',
    heroTagline: "Ce que je construis en propre : des produits menés de bout en bout, et des outils open source que je publie et maintiens.",
    productsHeading: 'Produits',
    ossHeading: 'Open source',
    ossOrgCta: "Voir l'organisation sur GitHub",
    siteCta: 'Voir rustkit-ai.github.io',
    installHint: 'Installez n’importe quel outil via Homebrew :',
    statusLabel: 'Statut',
  },
};
