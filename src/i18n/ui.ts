export const languages = {
   en: 'English',
   fr: 'Français',
 };
 
export const defaultLang = 'en';

export const showDefaultLang = false;

export const routes = {
  fr: {
    'work': 'travaux',
    'about': 'a-propos',
    'articles': 'articles'
  }
}
 
export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.work': 'Work',
    'nav.articles' : 'Articles'
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.work': 'Travaux',
    'nav.articles' : 'Articles'
  },
} as const;