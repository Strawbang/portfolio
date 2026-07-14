import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

export async function GET(context) {
  const posts = await getCollection('blog');
  const publishedPosts = posts
    .filter(post => !post.data.draft && post.data.lang === 'fr')
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  // Rendu de chaque article en HTML complet — pour les lecteurs RSS et l'import
  // RSS de dev.to (article complet, pas juste l'extrait). Même pipeline markdown
  // que le site (aucune dépendance en plus).
  const container = await AstroContainer.create();
  const base = context.site.toString().replace(/\/$/, '');
  const absUrl = (url) => (url.startsWith('http') ? url : `${base}${url}`);

  // Règles de tags dev.to : minuscules, alphanumérique, max 4.
  const devtoTags = (tags = []) =>
    tags.map(t => t.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean).slice(0, 4);

  const items = await Promise.all(publishedPosts.map(async (post) => {
    const { Content } = await render(post);
    let content = await container.renderToString(Content);
    // Absolutise les URLs racine pour que images/liens résolvent hors-site (dev.to, etc.).
    content = content
      .replace(/src="\//g, `src="${base}/`)
      .replace(/href="\//g, `href="${base}/`);

    // Préfixe l'image de couverture pour que l'import RSS de dev.to la prenne comme
    // cover (l'`img` du frontmatter n'est sinon pas dans le corps rendu).
    if (post.data.img) {
      const alt = (post.data.img_alt || post.data.title || '').replace(/"/g, '&quot;');
      content = `<img src="${absUrl(post.data.img)}" alt="${alt}" />\n${content}`;
    }

    return {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/fr/blog/${post.id.replace(/\.md$/, '').replace(/^fr-/, '')}/`,
      categories: devtoTags(post.data.tags),
      content,
      customData: post.data.canonicalURL
        ? `<atom:link href="${post.data.canonicalURL}" rel="canonical" />`
        : '',
    };
  }));

  return rss({
    title: 'Djamel Bougouffa | Blog',
    description: 'Articles sur le développement web, TypeScript, React, Node.js et les meilleures pratiques de développement.',
    site: context.site,
    items,
    customData: `<language>fr-FR</language><atom:link href="${context.site}fr/rss.xml" rel="self" type="application/rss+xml" />`,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
  });
}
