import { z } from 'zod';

export const createLevelSchema = z.object({
  code: z.string().min(2).max(50),
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  order: z.number().int().positive(),
  minAge: z.number().int().min(1).optional(),
  maxAge: z.number().int().min(1).optional(),
});

export const updateLevelSchema = createLevelSchema.partial();

export const levelIdSchema = z.object({
  nivelId: z.string().uuid(),
});

export type CreateLevel = z.infer<typeof createLevelSchema>;
export type UpdateLevel = z.infer<typeof updateLevelSchema>;
