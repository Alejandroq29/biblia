import { z } from 'zod';

export const createUserFavoriteSchema = z.object({
  storyId: z.string().uuid(),
});

export const userFavoriteIdSchema = z.object({
  favoritoId: z.string().uuid(),
});

export type CreateUserFavorite = z.infer<typeof createUserFavoriteSchema>;
