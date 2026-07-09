import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

export async function GET(context) {
  const posts = await getCollection('blog');
  const publishedPosts = posts
    .filter(post => !post.data.draft && post.data.lang !== 'fr')
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  // Render each post to full HTML so RSS readers — and dev.to's RSS import —
  // get the complete article, not just the excerpt. Same markdown pipeline as
  // the site itself (no extra deps).
  const container = await AstroContainer.create();
  const base = context.site.toString().replace(/\/$/, '');
  const absUrl = (url) => (url.startsWith('http') ? url : `${base}${url}`);

  // dev.to tag rules: lowercase, alphanumeric only, max 4. Best-effort — dev.to's
  // RSS import may still require setting tags by hand on the draft.
  const devtoTags = (tags = []) =>
    tags.map(t => t.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean).slice(0, 4);

  const items = await Promise.all(publishedPosts.map(async (post) => {
    const { Content } = await render(post);
    let content = await container.renderToString(Content);
    // Absolutize root-relative URLs so images/links resolve off-site (dev.to, etc.).
    content = content
      .replace(/src="\//g, `src="${base}/`)
      .replace(/href="\//g, `href="${base}/`);

    // Prepend the cover image so dev.to's RSS import picks it up as the cover
    // (the frontmatter `img` is otherwise not part of the rendered body).
    if (post.data.img) {
      const alt = (post.data.img_alt || post.data.title || '').replace(/"/g, '&quot;');
      content = `<img src="${absUrl(post.data.img)}" alt="${alt}" />\n${content}`;
    }

    return {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id.replace(/\.md$/, '')}/`,
      categories: devtoTags(post.data.tags),
      content,
      customData: post.data.canonicalURL
        ? `<atom:link href="${post.data.canonicalURL}" rel="canonical" />`
        : '',
    };
  }));

  return rss({
    title: 'Djamel Bougouffa | Blog',
    description: 'Articles and tutorials on web development, TypeScript, React, Node.js and best practices.',
    site: context.site,
    items,
    customData: `<language>en-US</language><atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />`,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
  });
}
