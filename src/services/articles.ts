import type { Article, DevToArticle, MediumRssItem } from '../types/article';

const CONFIG = {
  medium: {
    username: 'strawbang',
    apiUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@',
    maxDescriptionLength: 150
  },
  devto: {
    username: 'strawbang',
    apiUrl: 'https://dev.to/api/articles?username='
  },
  maxArticles: 6
};

function extractMediumImageUrl(item: MediumRssItem): string {
  if (item.thumbnail && item.thumbnail !== '') {
    return item.thumbnail;
  }
  
  const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch && imgMatch[1] ? imgMatch[1] : '';
}

async function fetchMediumArticles(username: string): Promise<Article[]> {
  try {
    const response = await fetch(`${CONFIG.medium.apiUrl}${username}`);
    const data = await response.json();
    
    return data.items.map((item: MediumRssItem) => ({
      title: item.title,
      description: item.description.replace(/<[^>]*>/g, '').slice(0, CONFIG.medium.maxDescriptionLength) + '...',
      url: item.link,
      platform: 'Medium' as const,
      publishDate: new Date(item.pubDate),
      imageUrl: extractMediumImageUrl(item) || undefined
    }));
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

export async function fetchArticles(): Promise<Article[]> {
  const [mediumArticles, devtoArticles] = await Promise.all([
    fetchMediumArticles(CONFIG.medium.username),
    fetchDevToArticles(CONFIG.devto.username)
  ]);

  return [...mediumArticles, ...devtoArticles]
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
    .slice(0, CONFIG.maxArticles);
}