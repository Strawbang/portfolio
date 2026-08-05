#!/usr/bin/env node
/**
 * Syndicate blog posts OUT to Dev.to / Medium — the reverse of import-articles.mjs.
 *
 * Generates, for each published English post, a ready-to-paste Markdown file with
 * `canonical_url` ALREADY pointing back to your site. This is the whole point:
 * syndicating without a canonical pointing home gets you penalized for duplicate
 * content. This script makes forgetting it impossible.
 *
 * Usage:
 *   node scripts/syndicate.mjs              → generate for all published EN posts
 *   node scripts/syndicate.mjs <slug>       → generate for one post
 *
 * Output: ./syndication/<slug>.devto.md  (git-ignored, disposable artifacts)
 *
 * Then:
 *   - Dev.to:  New post → "..." menu → import Markdown, OR paste the file (front
 *              matter included). The canonical_url is already set. Publish.
 *   - Medium:  Import a story (https://medium.com/p/import) using your post URL —
 *              Medium then sets rel=canonical to your site automatically.
 */

import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

const SITE = 'https://djamel-bougouffa.com';
const CONTENT_DIR = './src/content/blog';
const OUT_DIR = './syndication';

const args = process.argv.slice(2);
const ONLY_SLUG = args.find(a => !a.startsWith('-'));

// ─── Minimal frontmatter parsing ─────────────────────────────────────────────

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: raw };
  const block = m[1];
  const body = raw.slice(m[0].length);
  const data = {};

  const scalar = (key) => {
    const r = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    if (!r) return undefined;
    return r[1].trim().replace(/^["']|["']$/g, '');
  };
  const array = (key) => {
    const r = block.match(new RegExp(`^${key}:\\s*\\[(.*)\\]`, 'm'));
    if (!r) return [];
    return [...r[1].matchAll(/"([^"]+)"|'([^']+)'/g)].map(x => x[1] ?? x[2]);
  };

  data.title = scalar('title');
  data.description = scalar('description');
  data.img = scalar('img');
  data.lang = scalar('lang') ?? 'en';
  data.draft = scalar('draft') === 'true';
  data.tags = array('tags');
  return { data, body };
}

// ─── Transforms ──────────────────────────────────────────────────────────────

/** Dev.to tags: lowercase, alphanumeric only, max 4. */
function devtoTags(tags) {
  return tags
    .map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 4);
}

/** Make every root-relative URL absolute so images/links work off-site. */
function absolutize(body) {
  return body
    .replace(/\]\(\//g, `](${SITE}/`)       // markdown links & images: ](/...)
    .replace(/src="\//g, `src="${SITE}/`)    // raw <img src="/...">
    .replace(/href="\//g, `href="${SITE}/`); // raw <a href="/...">
}

function abs(url) {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${SITE}${url}`;
}

function buildDevtoFrontmatter({ title, description, tags, cover, canonical }) {
  const lines = ['---'];
  lines.push(`title: ${JSON.stringify(title)}`);
  lines.push('published: false');
  if (description) lines.push(`description: ${JSON.stringify(description)}`);
  if (tags.length) lines.push(`tags: ${tags.join(', ')}`);
  if (cover) lines.push(`cover_image: ${cover}`);
  lines.push(`canonical_url: ${canonical}`);
  lines.push('---');
  return lines.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0, skipped = 0;
  console.log('🚀 Syndication export → Dev.to-ready Markdown\n');

  for (const file of files) {
    const slug = basename(file, '.md');
    if (ONLY_SLUG && slug !== ONLY_SLUG) continue;

    const raw = readFileSync(join(CONTENT_DIR, file), 'utf-8');
    const { data, body } = parseFrontmatter(raw);

    // Only syndicate published English posts (French versions live at /fr/blog).
    if (data.lang === 'fr' || slug.startsWith('fr-')) { skipped++; continue; }
    if (data.draft) { console.log(`  ⏭  draft, skipped: ${slug}`); skipped++; continue; }

    const canonical = `${SITE}/blog/${slug}/`;
    const frontmatter = buildDevtoFrontmatter({
      title: data.title,
      description: data.description,
      tags: devtoTags(data.tags),
      cover: abs(data.img),
      canonical,
    });

    const out = `${frontmatter}\n\n${absolutize(body).trim()}\n`;
    const outPath = join(OUT_DIR, `${slug}.devto.md`);
    writeFileSync(outPath, out, 'utf-8');
    console.log(`  ✅ ${outPath}\n     canonical → ${canonical}`);
    generated++;
  }

  if (ONLY_SLUG && generated === 0) {
    console.log(`  ❌ No published EN post found for slug "${ONLY_SLUG}"`);
  }

  console.log(`\n✨ ${generated} generated, ${skipped} skipped → ${OUT_DIR}/`);
  console.log('\nNext:');
  console.log('  • Dev.to  → New post → paste the .devto.md file (front matter included), publish.');
  console.log('  • Medium  → Import a story (medium.com/p/import) with the post URL; canonical is set automatically.');
  console.log('  • Then share the post on LinkedIn / the relevant subreddit / Hacker News.');
}

main();
