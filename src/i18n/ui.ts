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
  }
}
 
export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.work': 'Work',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.work': 'Travaux',
  },
} as const;