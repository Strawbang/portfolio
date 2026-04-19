#!/usr/bin/env node
/**
 * Import articles from Dev.to and Medium into src/content/blog/
 *
 * Usage:
 *   node scripts/import-articles.mjs              → import all
 *   node scripts/import-articles.mjs --dry-run    → preview only
 *   node scripts/import-articles.mjs --source devto
 *   node scripts/import-articles.mjs --source medium
 *
 * After import:
 *   - Dev.to articles: fully imported with markdown content
 *   - Medium articles: stubs created (draft: true), paste content manually
 *
 * Then go to Dev.to / Medium and set their canonical_url to your blog URL.
 */

import { writeFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';

const CONFIG = {
  devto: {
    username: 'strawbang',
    apiUrl: 'https://dev.to/api/articles?username=',
  },
  medium: {
    username: 'strawbang',
    rssUrl: 'https://medium.com/feed/@',
  },
};

const CONTENT_DIR = './src/content/blog';
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SOURCE = args.find((_, i) => args[i - 1] === '--source') ?? 'all';

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function formatDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}

function stripMarkdown(text) {
  return (text ?? '')
    .replace(/#+\s/g, '')
    .replace(/\*\*?|__?|~~|`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 150);
}

function buildFrontmatter(fields) {
  const lines = ['---'];
  const add = (key, val) => {
    if (val === undefined || val === null || val === '') return;
    if (typeof val === 'boolean') lines.push(`${key}: ${val}`);
    else if (Array.isArray(val) && val.length) lines.push(`${key}: [${val.map(v => JSON.stringify(v)).join(', ')}]`);
    else if (Array.isArray(val)) return;
    else lines.push(`${key}: ${JSON.stringify(val)}`);
  };
  add('title', fields.title);
  add('description', fields.description);
  add('publishDate', fields.publishDate);
  add('tags', fields.tags);
  if (fields.img) add('img', fields.img);
  if (fields.canonicalURL) add('canonicalURL', fields.canonicalURL);
  if (fields.draft) add('draft', true);
  lines.push('---');
  return lines.join('\n');
}

/** Load existing titles from src/content/blog to avoid duplicates */
function loadExistingTitles() {
  const titles = new Set();
  try {
    const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const content = readFileSync(join(CONTENT_DIR, file), 'utf-8');
      const match = content.match(/^title:\s*"?(.+?)"?\s*$/m);
      if (match) titles.add(match[1].toLowerCase().trim());
    }
  } catch {}
  return titles;
}

function writeFile(filepath, content) {
  if (DRY_RUN) return;
  writeFileSync(filepath, content, 'utf-8');
}

// ─── Dev.to ─────────────────────────────────────────────────────────────────

async function importDevTo(existingTitles) {
  console.log('\n📡 Fetching Dev.to articles...');
  let articles;
  try {
    const res = await fetch(`${CONFIG.devto.apiUrl}${CONFIG.devto.username}&per_page=100`);
    articles = await res.json();
  } catch (e) {
    console.error('  ❌ Failed to fetch Dev.to:', e.message);
    return;
  }

  let imported = 0, skipped = 0;

  for (const article of articles) {
    const titleKey = article.title.toLowerCase().trim();
    const slug = slugify(article.title);
    const filename = `${slug}.md`;
    const filepath = join(CONTENT_DIR, filename);

    if (existsSync(filepath) || existingTitles.has(titleKey)) {
      console.log(`  ⏭  Skipped (exists): ${filename}`);
      skipped++;
      continue;
    }

    const description = article.description || stripMarkdown(article.body_markdown ?? '');
    const frontmatter = buildFrontmatter({
      title: article.title,
      description,
      publishDate: formatDate(article.published_at),
      tags: article.tag_list ?? [],
      img: article.cover_image || article.social_image || undefined,
      canonicalURL: `https://dev.to/${CONFIG.devto.username}/${article.slug}`,
    });

    const body = (article.body_markdown ?? '').trim();
    const fileContent = `${frontmatter}\n\n${body}\n`;

    if (DRY_RUN) {
      console.log(`  [dry-run] Would create: ${filename}`);
    } else {
      writeFile(filepath, fileContent);
      console.log(`  ✅ Imported: ${filename}`);
    }
    existingTitles.add(titleKey);
    imported++;
  }

  console.log(`  → ${imported} imported, ${skipped} skipped`);
}

// ─── Medium ──────────────────────────────────────────────────────────────────

function getTextBetween(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!match) return '';
  const val = match[1].trim();
  const cdata = val.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i);
  return cdata ? cdata[1].trim() : val;
}

async function importMedium(existingTitles) {
  console.log('\n📡 Fetching Medium articles...');
  let xml;
  try {
    const res = await fetch(`${CONFIG.medium.rssUrl}${CONFIG.medium.username}`);
    xml = await res.text();
  } catch (e) {
    console.error('  ❌ Failed to fetch Medium:', e.message);
    return;
  }

  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  let imported = 0, skipped = 0;

  for (const item of items) {
    const title = getTextBetween(item, 'title');
    if (!title) continue;

    const titleKey = title.toLowerCase().trim();
    const slug = slugify(title);
    const filename = `${slug}.md`;
    const filepath = join(CONTENT_DIR, filename);
    const link =
      getTextBetween(item, 'link') ||
      (item.match(/<link\/>\s*([^<]+)/) ?? [])[1]?.trim() ||
      '';
    const pubDate = getTextBetween(item, 'pubDate');

    if (existsSync(filepath) || existingTitles.has(titleKey)) {
      console.log(`  ⏭  Skipped (exists): ${filename}`);
      skipped++;
      continue;
    }

    const frontmatter = buildFrontmatter({
      title,
      description: '',
      publishDate: pubDate ? formatDate(pubDate) : new Date().toISOString().split('T')[0],
      canonicalURL: link,
      draft: true,
    });

    const body = [
      `<!-- ⚠️  Medium stub: paste your article content below, then remove "draft: true" from the frontmatter -->`,
      `<!-- Original: ${link} -->`,
      '',
      `> 📝 **TODO**: Add article content here.`,
    ].join('\n');

    const fileContent = `${frontmatter}\n\n${body}\n`;

    if (DRY_RUN) {
      console.log(`  [dry-run] Would create stub: ${filename}`);
    } else {
      writeFile(filepath, fileContent);
      console.log(`  📝 Stub created (draft): ${filename}`);
    }
    existingTitles.add(titleKey);
    imported++;
  }

  console.log(`  → ${imported} stubs created, ${skipped} skipped`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🚀 Article importer${DRY_RUN ? ' (DRY RUN)' : ''}`);
  console.log(`   Source: ${SOURCE === 'all' ? 'Dev.to + Medium' : SOURCE}`);
  console.log(`   Output: ${CONTENT_DIR}\n`);

  if (!existsSync(CONTENT_DIR)) {
    mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const existingTitles = loadExistingTitles();
  console.log(`   Existing articles: ${existingTitles.size}`);

  if (SOURCE === 'all' || SOURCE === 'devto') await importDevTo(existingTitles);
  if (SOURCE === 'all' || SOURCE === 'medium') await importMedium(existingTitles);

  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to create the files.');
  } else {
    console.log('\n✨ Done!');
    console.log('\nNext steps:');
    console.log('  1. Review imported files in src/content/blog/');
    console.log('  2. For Medium stubs: paste content and remove "draft: true"');
    console.log('  3. For Dev.to articles: remove "canonicalURL" once you update');
    console.log('     the canonical on Dev.to to point back to your blog');
    console.log('     (Dev.to: edit article → "Canonical URL" field)');
  }
}

main().catch(console.error);
