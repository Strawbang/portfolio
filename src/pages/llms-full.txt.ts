import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';

export const GET: APIRoute = async () => {
  const site = 'https://djamel-bougouffa.com';

  const allPosts = await getCollection('blog');
  const enPosts = allPosts
    .filter(p => !p.data.draft && p.data.lang !== 'fr')
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  const lines: string[] = [
    '# Djamel Bougouffa — Full Content',
    '',
    '> Full-Stack Software Engineer based in Paris, France. TypeScript, React, Node.js, Rust, MCP, RAG, agentic AI.',
    '> Portfolio: https://djamel-bougouffa.com',
    '',
    '---',
    '',
  ];

  for (const post of enPosts) {
    const slug = post.id.replace(/\.md$/, '');
    const url = `${site}/blog/${slug}/`;
    const date = post.data.publishDate.toISOString().split('T')[0];
    const tags = post.data.tags?.join(', ') ?? '';

    lines.push(`# ${post.data.title}`);
    lines.push('');
    lines.push(`URL: ${url}`);
    lines.push(`Date: ${date}`);
    if (tags) lines.push(`Tags: ${tags}`);
    if (post.data.canonicalURL) lines.push(`Canonical: ${post.data.canonicalURL}`);
    lines.push('');
    lines.push(`> ${post.data.description}`);
    lines.push('');
    lines.push(post.body ?? '');
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
