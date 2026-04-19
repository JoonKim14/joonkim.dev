import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['TECH', 'MIND', 'BODY', 'MISC']),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: file('./src/content/projects/index.json'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    status: z.enum(['COMPLETED', 'IN_PROGRESS', 'ABANDONED']),
    difficulty: z.number().min(1).max(5),
    tech: z.array(z.string()),
    description: z.string(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

export const collections = { blog, projects };
