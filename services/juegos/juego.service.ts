import { gameDB } from '../../database/juegos';

export const gameService = {
  async create(data: {
    title: string;
    description: string;
    type: string;
    storyId?: string;
    levelId: string;
    rules: string;
    imageUrl?: string;
  }) {
    return gameDB.create(data);
  },

  async getById(id: string) {
    return gameDB.findById(id);
  },

  async listByLevel(levelId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [games, total] = await Promise.all([
      gameDB.findMany({ levelId, skip, take: pageSize }),
      gameDB.count({ levelId }),
    ]);

    return {
      data: games,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async listAll(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [games, total] = await Promise.all([
      gameDB.findMany({ skip, take: pageSize }),
      gameDB.count(),
    ]);

    return {
      data: games,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async update(id: string, data: Partial<{ title: string; description: string; rules: string; imageUrl: string }>) {
    return gameDB.update(id, data);
  },

  async delete(id: string) {
    return gameDB.delete(id);
  },
};
