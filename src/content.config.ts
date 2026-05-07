import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	work: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			keywords: z.array(z.string()).optional(),
			img: z.string(),
			img_alt: z.string().optional(),
			role: z.string().optional(),
			startDate: z.coerce.date().optional(),
			endDate: z.coerce.date().optional(),
			relatedPosts: z.array(z.string()).optional(),
			relatedWork: z.array(z.string()).optional(),
			engagementType: z.enum(['esn', 'company', 'client']).optional(),
			teamSize: z.string().optional(),
			companySize: z.string().optional(),
			context: z.enum(['legacy', 'greenfield', 'hybrid']).optional(),
			workplace: z.enum(['Remote', 'Hybrid', 'On-site']).optional(),
			stack: z.record(z.string(), z.array(z.string())).optional(),
		}),
	}),
	blog: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()),
			keywords: z.array(z.string()).optional(),
			img: z.string().optional(),
			img_alt: z.string().optional(),
			canonicalURL: z.string().url().optional(),
			draft: z.boolean().default(false),
			lang: z.enum(['en', 'fr']).default('en'),
			source: z.string().optional(),
			relatedPosts: z.array(z.string()).optional(),
			relatedWork: z.array(z.string()).optional(),
		}),
	}),
};
