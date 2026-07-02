export const languages = {
   en: 'English',
   fr: 'Français',
 };

export const defaultLang = 'en';

export const showDefaultLang = false;

export const routes: Record<string, Record<string, string>> = {
  fr: {
    'work': 'experiences',
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
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'cta.title': 'Interested in working together?',
    'cta.button': 'Send Me a Message',
    'skills.fullstack': 'Full Stack',
    'skills.fullstack.desc': 'Experienced full stack developer proficient in TypeScript, React, Node.js, GraphQL, and Express.js, with a track record of creating 7 operational web applications.',
    'skills.devops': 'DevOps',
    'skills.devops.desc': 'Hands-on experience with Docker, Kubernetes, Swarm, and CI/CD pipelines, ensuring efficient deployment and high-quality code delivery.',
    'skills.agile': 'Agile Methodologies',
    'skills.agile.desc': 'Well-versed in Agile and Scrum methodologies, with a collaborative mindset and strategic leadership on projects that saw 2x higher reaction.',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.work': 'Expériences',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'cta.title': 'Intéressé par une collaboration ?',
    'cta.button': 'Envoyez-moi un message',
    'skills.fullstack': 'Full Stack',
    'skills.fullstack.desc': 'Développeur full stack expérimenté maîtrisant les technologies frontend et backend, capable de créer des applications web réactives et dynamiques.',
    'skills.devops': 'DevOps',
    'skills.devops.desc': 'Expérience pratique avec Docker, Kubernetes, Swarm et les pipelines CI/CD, garantissant un déploiement efficace et une livraison de code de haute qualité.',
    'skills.agile': 'Méthodologies Agile',
    'skills.agile.desc': 'Maîtrise des méthodologies Agile et Scrum, avec un esprit collaboratif et un leadership stratégique sur des projets ayant connu une réaction 2x plus élevée.',
  },
} as const;