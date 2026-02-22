import type { Article, DevToArticle } from '../types/article';

const CONFIG = {
  medium: {
    username: 'strawbang',
    rssUrl: 'https://medium.com/feed/@',
    maxDescriptionLength: 150
  },
  devto: {
    username: 'strawbang',
    apiUrl: 'https://dev.to/api/articles?username='
  },
};

function getTextBetween(xml: string, tag: string): string {
  const plainMatch = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!plainMatch) return '';
  let value = plainMatch[1].trim();
  const cdataMatch = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i);
  if (cdataMatch) return cdataMatch[1].trim();
  return value;
}

function extractMediumImage(itemXml: string): string | undefined {
  const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/);
  return imgMatch ? imgMatch[1] : undefined;
}

async function fetchMediumArticles(username: string): Promise<Article[]> {
  try {
    const response = await fetch(`${CONFIG.medium.rssUrl}${username}`);
    const xml = await response.text();

    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

    return itemMatches.map((itemXml) => {
      const title = getTextBetween(itemXml, 'title');
      const link = getTextBetween(itemXml, 'link') ||
        (itemXml.match(/<link\/>\s*([^<]+)/) ?? [])[1]?.trim() ||
        (itemXml.match(/<guid[^>]*>([^<]+)<\/guid>/) ?? [])[1]?.trim() || '';
      const pubDate = getTextBetween(itemXml, 'pubDate');
      const contentEncoded = getTextBetween(itemXml, 'content:encoded');
      const description = contentEncoded
        ? contentEncoded.replace(/<[^>]*>/g, '').slice(0, CONFIG.medium.maxDescriptionLength) + '...'
        : '';
      const imageUrl = extractMediumImage(contentEncoded);

      return {
        title,
        description,
        url: link,
        platform: 'Medium' as const,
        publishDate: new Date(pubDate),
        imageUrl,
      };
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles Medium:', error);
    return [];
  }
}

async function fetchDevToArticles(username: string): Promise<Article[]> {
  try {
    const response = await fetch(`${CONFIG.devto.apiUrl}${username}`);
    const articles: DevToArticle[] = await response.json();
    
    return articles.map(article => ({
      title: article.title,
      description: article.description || '',
      url: `https://dev.to/${username}/${article.slug}`,
      platform: 'Dev.to' as const,
      publishDate: new Date(article.published_at),
      imageUrl: article.cover_image || article.social_image
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des articles Dev.to:', error);
    return [];
  }
}

const PLATFORM_PRIORITY: Record<string, number> = { 'Medium': 0, 'Dev.to': 1, 'Blog': 2 };

export function deduplicateArticles(articles: Article[]): Article[] {
  const seenMap = new Map<string, Article>();
  articles
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
    .forEach(p => {
      const key = p.title.toLowerCase().trim().replace(/\s+/g, ' ');
      if (seenMap.has(key)) {
        const existing = seenMap.get(key)!;
        const existingPriority = PLATFORM_PRIORITY[existing.platform] ?? 99;
        const newPriority = PLATFORM_PRIORITY[p.platform] ?? 99;
        if (newPriority < existingPriority) {
          seenMap.set(key, {
            ...p,
            platforms: [...(existing.platforms ?? [existing.platform]), p.platform]
              .sort((a, b) => (PLATFORM_PRIORITY[a] ?? 99) - (PLATFORM_PRIORITY[b] ?? 99)),
          });
        } else {
          existing.platforms = [...(existing.platforms ?? [existing.platform]), p.platform]
            .sort((a, b) => (PLATFORM_PRIORITY[a] ?? 99) - (PLATFORM_PRIORITY[b] ?? 99));
        }
      } else {
        seenMap.set(key, { ...p });
      }
    });
  return Array.from(seenMap.values());
}

export async function fetchArticles(): Promise<Article[]> {
  const [mediumArticles, devtoArticles] = await Promise.all([
    fetchMediumArticles(CONFIG.medium.username),
    fetchDevToArticles(CONFIG.devto.username)
  ]);

  return deduplicateArticles([...mediumArticles, ...devtoArticles]);
}