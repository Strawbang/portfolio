import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import { defineConfig, fontProviders } from 'astro/config';
import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

function buildLastmodMap() {
	const map = new Map();
	const dirs = ['./src/content/blog', './src/content/work'];
	for (const dir of dirs) {
		try {
			const files = readdirSync(dir, { recursive: true })
				.map(String)
				.filter(f => /\.(md|mdx)$/.test(f));
			for (const file of files) {
				try {
					const content = readFileSync(join(dir, file), 'utf-8');
					const updated = content.match(/updatedDate:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
					const published = content.match(/publishDate:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
					const dateStr = updated ?? published;
					if (dateStr) {
						const slug = basename(file).replace(/\.(mdx?)$/, '');
						const isFrSubdir = file.startsWith('fr/');
						const key = isFrSubdir ? `fr/${slug}` : slug;
						map.set(key, new Date(dateStr));
						if (isFrSubdir) map.set(slug.replace(/^fr-/, ''), new Date(dateStr));
					}
				} catch {}
			}
		} catch {}
	}
	return map;
}

const lastmodMap = buildLastmodMap();

// https://astro.build/config
export default defineConfig({
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Public Sans',
			cssVariable: '--font-public-sans',
			weights: [400, 700],
			styles: ['normal'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Public Sans',
			cssVariable: '--font-public-sans',
			weights: [400],
			styles: ['italic'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Rubik',
			cssVariable: '--font-rubik',
			weights: [500, 600],
			styles: ['normal'],
		},
	],
	site: 'https://djamel-bougouffa.com',
	integrations: [
		robotsTxt({
			policy: [
				{
					userAgent: '*',
					allow: '/',
				},
				// OpenAI / ChatGPT
				{
					userAgent: 'GPTBot',
					allow: '/',
				},
				{
					userAgent: 'ChatGPT-User',
					allow: '/',
				},
				// Google
				{
					userAgent: 'Googlebot',
					allow: '/',
				},
				// Microsoft / Bing
				{
					userAgent: 'Bingbot',
					allow: '/',
				},
				{
					userAgent: 'BingPreview',
					allow: '/',
				},
				// Anthropic / Claude
				{
					userAgent: 'ClaudeBot',
					allow: '/',
				},
				{
					userAgent: 'Claude-Web',
					allow: '/',
				},
				{
					userAgent: 'Anthropic-AI',
					allow: '/',
				},
				// Google Extended (Gemini / AI Overviews)
				{
					userAgent: 'Google-Extended',
					allow: '/',
				},
				// Apple
				{
					userAgent: 'Applebot-Extended',
					allow: '/',
				},
				// Common Crawl (used to train many LLMs)
				{
					userAgent: 'CCBot',
					allow: '/',
				},
				// Baidu
				{
					userAgent: 'Baiduspider',
					allow: '/',
				},
				// Perplexity
				{
					userAgent: 'PerplexityBot',
					allow: '/',
				},
				// Cohere
				{
					userAgent: 'CohereBot',
					allow: '/',
				},
				// Meta / Facebook
				{
					userAgent: 'FacebookBot',
					allow: '/',
				},
				{
					userAgent: 'MetaBot',
					allow: '/',
				},
				// Mistral
				{
					userAgent: 'MistralBot',
					allow: '/',
				},
				// Yandex
				{
					userAgent: 'YandexBot',
					allow: '/',
				},
				// Hugging Face
				{
					userAgent: 'HuggingFaceBot',
					allow: '/',
				},
				// AI21
				{
					userAgent: 'AI21Bot',
					allow: '/',
				},
			],
		}),
		sitemap({
			filter: (page) => {
			if (page.includes('/og/')) return false;
			const url = new URL(page);
			const parts = url.pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
			const noIndexLocales = ['ja', 'zh', 'th', 'vi', 'ms', 'ko', 'id', 'tl', 'ar', 'hi', 'de', 'es', 'pt'];
			if (parts.length > 0 && noIndexLocales.includes(parts[0])) return false;
			return true;
		},
			customPages: [],
			serialize(item) {
				const url = new URL(item.url);
				const parts = url.pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
				const isFrPage = parts[0] === 'fr';
				const slugKey = parts[parts.length - 1];
				const lookupKey = isFrPage ? `fr/${slugKey}` : slugKey;
				const lastmod = lastmodMap.get(lookupKey) ?? lastmodMap.get(slugKey);
				// Homepage: / or /[lang]/
				if (parts.length === 0 || (parts.length === 1 && parts[0].length === 2)) {
					return { ...item, changefreq: 'weekly', priority: 1.0 };
				}
				// Blog post detail: /blog/[slug]/ or /[lang]/blog/[slug]/
				const isBlogPost = parts.includes('blog') && parts[parts.length - 1] !== 'blog';
				if (isBlogPost) {
					return { ...item, changefreq: 'monthly', priority: 0.6, ...(lastmod && { lastmod }) };
				}
				// Work/experience detail: /work/[slug]/ or /[lang]/experiences/[slug]/
				const isWorkDetail = (parts.includes('work') || parts.includes('experiences')) && parts[parts.length - 1] !== 'work' && parts[parts.length - 1] !== 'experiences';
				if (isWorkDetail) {
					return { ...item, changefreq: 'monthly', priority: 0.6, ...(lastmod && { lastmod }) };
				}
				// All other pages: listing pages, about, etc.
				return { ...item, changefreq: 'weekly', priority: 0.8 };
			},
			i18n: {
				defaultLocale: 'en',
				locales: {
					en: 'en-US',
					fr: 'fr-FR',
					ja: 'ja-JP',
					zh: 'zh-CN',
					th: 'th-TH',
					vi: 'vi-VN',
					ms: 'ms-MY',
					ko: 'ko-KR',
					id: 'id-ID',
					tl: 'fil-PH',
					ar: 'ar-SA',
					hi: 'hi-IN',
					de: 'de-DE',
					es: 'es-ES',
					pt: 'pt-BR',
				},
			},
		}),
	],
	redirects: {
		'/fr/travaux': '/fr/experiences',
		'/fr/travaux/[...slug]': '/fr/experiences/[...slug]',
		'/fr/travaux/fr/[...slug]': '/fr/experiences/[...slug]',
		'/articles': '/blog',
		'/fr/articles': '/fr/blog',
		'/work/fr/[...slug]': '/work/[...slug]',
	},
	experimental: {
		rustCompiler: true,
		queuedRendering: { enabled: true },
	},
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'fr', 'ja', 'zh', 'th', 'vi', 'ms', 'ko', 'id', 'tl', 'ar', 'hi', 'de', 'es', 'pt'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
