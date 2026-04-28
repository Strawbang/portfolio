import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const publishedPosts = posts
    .filter(post => !post.data.draft && post.data.lang === 'fr')
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  return rss({
    title: 'Djamel Bougouffa | Blog',
    description: 'Articles sur le développement web, TypeScript, React, Node.js et les meilleures pratiques de développement.',
    site: context.site,
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/fr/blog/${post.id.replace(/\.md$/, '').replace(/^fr-/, '')}/`,
      categories: post.data.tags,
      customData: post.data.canonicalURL
        ? `<atom:link href="${post.data.canonicalURL}" rel="canonical" />`
        : '',
    })),
    customData: `<language>fr-FR</language><atom:link href="${context.site}fr/rss.xml" rel="self" type="application/rss+xml" />`,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
  });
}
