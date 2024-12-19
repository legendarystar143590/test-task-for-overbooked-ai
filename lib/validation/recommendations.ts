import { z } from 'zod';

export const preferenceSchema = z.object({
  categories: z.array(z.string()).min(1, 'Categories cannot be empty'),
  genres: z.array(z.string()).min(1, 'Genres cannot be empty'),
  maxResults: z.number().optional(),
});

export const recommendationRequestSchema = z.object({
  userId: z.string(),
  preferences: preferenceSchema,
});
