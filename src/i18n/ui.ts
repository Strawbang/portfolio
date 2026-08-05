export const languages = {
   en: 'English',
   fr: 'Français',
 };

export const defaultLang = 'en';

export const showDefaultLang = false;

export const routes: Record<string, Record<string, string>> = {
  fr: {
    'work': 'experiences',
    'projects': 'projets',
    'about': 'a-propos',
    'blog': 'blog',
    'contact': 'contact'
  },
}

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.work': 'Experience',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'cta.title': 'Interested in working together?',
    'cta.button': 'Send Me a Message',
    'skills.craft': 'Craft & Architecture',
    'skills.craft.desc': 'Hexagonal architecture, TDD, clean boundaries. I think in systems built to last, not just today\'s feature. Foundations that survive change.',
    'skills.ownership': 'Ownership & Autonomy',
    'skills.ownership.desc': 'From idea to production, on my own. I own projects end to end, thrive in remote and async teams across time zones, and build the tools I\'m missing.',
    'skills.learning': 'Learning & Sharing',
    'skills.learning.desc': 'Always leveling up, out loud. I write, document, and open-source what I learn, because that is how craft compounds.',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.work': 'Expériences',
    'nav.projects': 'Projets',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'cta.title': 'Intéressé par une collaboration ?',
    'cta.button': 'Envoyez-moi un message',
    'skills.craft': 'Craft & Architecture',
    'skills.craft.desc': 'Architecture hexagonale, TDD, frontières claires. Je pense en systèmes conçus pour durer, pas seulement la feature du jour. Des fondations qui survivent au changement.',
    'skills.ownership': 'Ownership & Autonomie',
    'skills.ownership.desc': 'De l\'idée à la production, en autonomie. Je porte des projets de bout en bout, à l\'aise en remote et en async au-delà des fuseaux, et je construis les outils qui me manquent.',
    'skills.learning': 'Apprendre & Partager',
    'skills.learning.desc': 'En évolution constante, à voix haute. J\'écris, je documente et j\'open-source ce que j\'apprends, parce que c\'est comme ça que le craft se cumule.',
  },
} as const;