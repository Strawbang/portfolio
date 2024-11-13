interface Article {
  title: string;
  description: string;
  url: string;
  platform: 'Medium' | 'Dev.to';
  publishDate: Date;
}

interface DevToArticle {
  title: string;
  description: string;
  url: string;
  slug: string;
  published_at: string;
}

async function fetchMediumArticles(username: string): Promise<Article[]> {
  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`);
    const data = await response.json();
    
    return data.items.map((item: any) => ({
      title: item.title,
      description: item.description.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
      url: item.link,
      platform: 'Medium' as const,
      publishDate: new Date(item.pubDate)
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des articles Medium:', error);
    return [];
  }
}

async function fetchDevToArticles(username: string): Promise<Article[]> {
  try {
    const response = await fetch(`https://dev.to/api/articles?username=${username}`);
    const articles: DevToArticle[] = await response.json();
    
    return articles.map(article => ({
      title: article.title,
      description: article.description || '',
      url: `https://dev.to/${username}/${article.slug}`,
      platform: 'Dev.to' as const,
      publishDate: new Date(article.published_at)
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des articles Dev.to:', error);
    return [];
  }
}

export async function fetchArticles(): Promise<Article[]> {
  const mediumUsername = 'strawbang';
  const devtoUsername = 'strawbang';
  
  const [mediumArticles, devtoArticles] = await Promise.all([
    fetchMediumArticles(mediumUsername),
    fetchDevToArticles(devtoUsername)
  ]);

  return [...mediumArticles, ...devtoArticles]
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
    .slice(0, 6);
} 