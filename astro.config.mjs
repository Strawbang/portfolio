import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
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
					userAgent: 'Claude',
					allow: '/',
				},
				{
					userAgent: 'Anthropic-AI',
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
			lastmod: new Date(),
			filter: (page) => !page.includes('/og/'),
			customPages: [],
			serialize(item) {
				// Homepage (no path after domain)
				if (/https:\/\/djamel-bougouffa\.com\/?$/.test(item.url) ||
					/https:\/\/djamel-bougouffa\.com\/[a-z]{2}\/?$/.test(item.url)) {
					return { ...item, changefreq: 'weekly', priority: 1.0 };
				}
				// Blog posts
				if (item.url.includes('/blog/') && item.url.split('/').length > 5) {
					return { ...item, changefreq: 'monthly', priority: 0.6 };
				}
				// Work/experience detail pages
				if ((item.url.includes('/work/') || item.url.includes('/experiences/')) && item.url.split('/').length > 5) {
					return { ...item, changefreq: 'monthly', priority: 0.6 };
				}
				// Main section pages (about, blog, work, experiences)
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
	},
	// experimental: { assets: true },
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'fr', 'ja', 'zh', 'th', 'vi', 'ms', 'ko', 'id', 'tl', 'ar', 'hi', 'de', 'es', 'pt'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	vite: {
		ssr: {
			noExternal: ['astro-seo-schema']
		}
	}
});
