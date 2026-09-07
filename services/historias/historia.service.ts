import { biblicalStoryDB } from '../../database/historias';

export const biblicalStoryService = {
  async create(data: {
    title: string;
    description: string;
    content: string;
    levelId: string;
    imageUrl?: string;
  }) {
    return biblicalStoryDB.create(data);
  },

  async getById(id: string) {
    return biblicalStoryDB.findById(id);
  },

  async listByLevel(levelId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [stories, total] = await Promise.all([
      biblicalStoryDB.findMany({ levelId, skip, take: pageSize }),
      biblicalStoryDB.count({ levelId }),
    ]);

    return {
      data: stories,
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
    const [stories, total] = await Promise.all([
      biblicalStoryDB.findMany({ skip, take: pageSize }),
      biblicalStoryDB.count(),
    ]);

    return {
      data: stories,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async update(id: string, data: Partial<{ title: string; description: string; content: string; levelId: string; imageUrl: string }>) {
    return biblicalStoryDB.update(id, data);
  },

  async delete(id: string) {
    return biblicalStoryDB.delete(id);
  },
};
