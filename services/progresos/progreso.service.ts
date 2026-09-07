import { userProgressDB } from '../../database/progresos';

export const userProgressService = {
  async create(data: {
    userId: string;
    levelId: string;
    gameId?: string;
    score?: number;
    completed?: boolean;
  }) {
    return userProgressDB.create(data);
  },

  async getById(id: string) {
    return userProgressDB.findById(id);
  },

  async getByUserAndLevel(userId: string, levelId: string) {
    return userProgressDB.findByUserAndLevel(userId, levelId);
  },

  async listByUser(userId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [progresses, total] = await Promise.all([
      userProgressDB.findByUser(userId, { skip, take: pageSize }),
      userProgressDB.countUserProgress(userId),
    ]);

    return {
      data: progresses,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async update(id: string, data: Partial<{ score: number; completed: boolean; attempts: number }>) {
    return userProgressDB.update(id, data);
  },

  async delete(id: string) {
    return userProgressDB.delete(id);
  },
};
