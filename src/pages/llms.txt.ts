import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const site = 'https://djamel-bougouffa.com';

  const allPosts = await getCollection('blog');
  const enPosts = allPosts
    .filter(p => !p.data.draft && p.data.lang !== 'fr')
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
  const frPosts = allPosts
    .filter(p => !p.data.draft && p.data.lang === 'fr')
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  const works = await getCollection('work');

  const lines: string[] = [
    '# Djamel Bougouffa',
    '',
    '> Full-Stack Software Engineer based in Paris, France. Specializing in TypeScript, React, Node.js, Rust, MCP, and agentic AI workflows. Currently at Ippon Technologies building AI-driven legacy modernization tools.',
    '',
    '## About',
    '',
    `- [About](${site}/about/): Professional background, experience (Ippon Technologies, SYSTRAN, Wemanity), skills, education, and contact`,
    `- [Uses](${site}/uses/): Hardware and software setup — MacBook Pro M4, Windsurf, TypeScript, Rust, Docker, Kubernetes`,
    `- [Experience](${site}/work/): Portfolio of professional projects`,
    '',
    '## Blog (English)',
    '',
  ];

  for (const post of enPosts) {
    const slug = post.id.replace(/\.md$/, '');
    const url = `${site}/blog/${slug}/`;
    lines.push(`- [${post.data.title}](${url}): ${post.data.description}`);
  }

  lines.push('');
  lines.push('## Blog (Français)');
  lines.push('');

  for (const post of frPosts) {
    const slug = post.id.replace(/\.md$/, '').replace(/^fr-/, '');
    const url = `${site}/fr/blog/${slug}/`;
    lines.push(`- [${post.data.title}](${url}): ${post.data.description}`);
  }

  lines.push('');
  lines.push('## Work / Projects');
  lines.push('');

  for (const work of works) {
    const url = `${site}/work/${work.id.replace(/\.md$/, '')}/`;
    lines.push(`- [${work.data.title}](${url}): ${work.data.description ?? ''}`);
  }

  lines.push('');
  lines.push('## Social & RSS');
  lines.push('');
  lines.push(`- [RSS (EN)](${site}/rss.xml): English blog feed`);
  lines.push(`- [RSS (FR)](${site}/fr/rss.xml): French blog feed`);
  lines.push(`- [GitHub](https://github.com/strawbang)`);
  lines.push(`- [LinkedIn](https://www.linkedin.com/in/djamel-bougouffa)`);
  lines.push(`- [Medium](https://medium.com/@strawbang)`);
  lines.push(`- [Dev.to](https://dev.to/strawbang)`);

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
