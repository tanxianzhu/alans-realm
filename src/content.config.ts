import { defineCollection, z } from 'astro:content';

const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    section: z.enum(['economics', 'art', 'wonder']),
    chapter: z.string().optional(),
    order: z.number(),
    description: z.string(),
    date: z.coerce.date().optional(),
    status: z.enum(['published', 'coming-soon']).default('coming-soon'),
  }),
});

export const collections = { lessons };
