import { defaultLang, routes, showDefaultLang, ui } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    const pathName = path.replaceAll('/', '')
    const hasTranslation = defaultLang !== l && routes[l] !== undefined && routes[l][pathName] !== undefined
    const translatedPath = hasTranslation ? '/' + routes[l][pathName] : path

    return !showDefaultLang && l === defaultLang ? translatedPath : `/${l}${translatedPath}`
  }
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split('/').filter(Boolean);

  if (parts.length === 0) {
    return undefined;
  }

  const currentLang = getLangFromUrl(url);

  const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  // Try each segment from last to first to find a known route
  for (let i = parts.length - 1; i >= 0; i--) {
    const segment = parts[i];

    if (defaultLang === currentLang) {
      const route = Object.values(routes)[0];
      // Check if segment is a direct route key (e.g. 'work', 'about', 'blog') first
      if (Object.keys(route).includes(segment)) return segment;
      // Then check if segment matches a translated value
      if (route[segment] !== undefined) return route[segment];
    } else {
      const reversedKey = getKeyByValue(routes[currentLang], segment);
      if (reversedKey !== undefined) return reversedKey;
      // Also check if segment is a direct route key
      if (routes[currentLang] && Object.keys(routes[currentLang]).includes(segment)) return segment;
    }
  }

  return undefined;
}
