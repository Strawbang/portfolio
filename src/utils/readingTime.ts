export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export function getReadingTimeText(minutes: number, lang: 'en' | 'fr' = 'en'): string {
  if (lang === 'fr') {
    return minutes === 1 ? '1 min de lecture' : `${minutes} min de lecture`;
  }
  return minutes === 1 ? '1 min read' : `${minutes} min read`;
}
