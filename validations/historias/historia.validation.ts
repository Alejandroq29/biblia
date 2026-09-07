import { z } from 'zod';

export const createBiblicalStorySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  content: z.string().min(50),
  levelId: z.string().uuid(),
  imageUrl: z.string().url().optional(),
});

export const updateBiblicalStorySchema = createBiblicalStorySchema.partial();

export const biblicalStoryIdSchema = z.object({
  historiaId: z.string().uuid(),
});

export type CreateBiblicalStory = z.infer<typeof createBiblicalStorySchema>;
export type UpdateBiblicalStory = z.infer<typeof updateBiblicalStorySchema>;
