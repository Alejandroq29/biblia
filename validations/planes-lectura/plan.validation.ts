import { z } from 'zod';

export const createReadingPlanSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  startDate: z.string().date(),
});

export const updateReadingPlanSchema = createReadingPlanSchema.partial();

export const readingPlanIdSchema = z.object({
  planId: z.string().uuid(),
});

export type CreateReadingPlan = z.infer<typeof createReadingPlanSchema>;
export type UpdateReadingPlan = z.infer<typeof updateReadingPlanSchema>;
