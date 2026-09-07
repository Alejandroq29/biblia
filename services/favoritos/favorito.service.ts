import { userFavoriteDB } from '../../database/favoritos';

export const userFavoriteService = {
  async add(userId: string, storyId: string) {
    return userFavoriteDB.create({ userId, storyId });
  },

  async getById(id: string) {
    return userFavoriteDB.findById(id);
  },

  async listByUser(userId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [favorites, total] = await Promise.all([
      userFavoriteDB.findByUser(userId, { skip, take: pageSize }),
      userFavoriteDB.countUserFavorites(userId),
    ]);

    return {
      data: favorites,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async remove(id: string) {
    return userFavoriteDB.delete(id);
  },

  async removeByUserAndStory(userId: string, storyId: string) {
    return userFavoriteDB.deleteByUserAndStory(userId, storyId);
  },
};
