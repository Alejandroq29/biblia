import { z } from 'zod';

export const createGameSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  type: z.enum(['quiz', 'memory', 'puzzle', 'match', 'multiple-choice']),
  storyId: z.string().uuid().optional(),
  levelId: z.string().uuid(),
  rules: z.string().min(10), // JSON serializado
  imageUrl: z.string().url().optional(),
});

export const updateGameSchema = createGameSchema.partial();

export const gameIdSchema = z.object({
  juegoId: z.string().uuid(),
});

export type CreateGame = z.infer<typeof createGameSchema>;
export type UpdateGame = z.infer<typeof updateGameSchema>;
