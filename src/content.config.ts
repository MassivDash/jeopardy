import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const gameLevelQuestionSchema = z.object({
    value: z.number(),
    question: z.string(),
    answer: z.string(),
});

const gameCategorySchema = z.object({
    name: z.string(),
    questions: z.array(gameLevelQuestionSchema),
});

const gameLevelSchema = z.object({
    level: z.number(),
    categories: z.array(gameCategorySchema).optional(),
    final: z.object({
        question: z.string(),
        answer: z.string(),
        value: z.number(),
    }).optional(),
});

const games = defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/games' }),
    schema: z.object({
        id: z.string(),
        title: z.string(),
        levels: z.array(gameLevelSchema),
    }),
});

export const collections = { games };
