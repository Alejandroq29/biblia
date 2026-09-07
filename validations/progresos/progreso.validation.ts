import { z } from 'zod';

export const createUserProgressSchema = z.object({
  userId: z.string().uuid(),
  levelId: z.string().uuid(),
  gameId: z.string().uuid().optional(),
  score: z.number().int().min(0).default(0),
  completed: z.boolean().default(false),
});

export const updateUserProgressSchema = z.object({
  score: z.number().int().min(0),
  completed: z.boolean(),
  attempts: z.number().int().min(0),
});

export const userProgressIdSchema = z.object({
  usuarioId: z.string().uuid(),
  progresoId: z.string().uuid(),
});

export type CreateUserProgress = z.infer<typeof createUserProgressSchema>;
export type UpdateUserProgress = z.infer<typeof updateUserProgressSchema>;
