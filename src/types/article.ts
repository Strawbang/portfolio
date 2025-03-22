export interface Article {
  title: string;
  description: string;
  url: string;
  platform: 'Medium' | 'Dev.to';
  publishDate: Date;
  imageUrl?: string;
}

export interface DevToArticle {
  title: string;
  description: string;
  url: string;
  slug: string;
  published_at: string;
  cover_image?: string;
  social_image?: string;
}

export interface MediumRssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  content: string;
}
