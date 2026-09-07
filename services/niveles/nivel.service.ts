import { levelDB } from '../../database/niveles';

export const levelService = {
  async create(data: {
    code: string;
    name: string;
    description?: string;
    order: number;
    minAge?: number;
    maxAge?: number;
  }) {
    return levelDB.create(data);
  },

  async getById(id: string) {
    return levelDB.findById(id);
  },

  async listAll(page: number = 1, pageSize: number = 50) {
    const skip = (page - 1) * pageSize;
    const [levels, total] = await Promise.all([
      levelDB.findMany({ skip, take: pageSize }),
      levelDB.count(),
    ]);

    return {
      data: levels,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async update(id: string, data: Partial<{ name: string; description: string; minAge: number; maxAge: number }>) {
    return levelDB.update(id, data);
  },

  async delete(id: string) {
    return levelDB.delete(id);
  },
};
