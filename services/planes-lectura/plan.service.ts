import { readingPlanDB } from '../../database/planes-lectura';

export const readingPlanService = {
  async create(data: {
    title: string;
    description?: string;
    duration: number;
    startDate: Date;
  }) {
    return readingPlanDB.create(data);
  },

  async getById(id: string) {
    return readingPlanDB.findById(id);
  },

  async listAll(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [plans, total] = await Promise.all([
      readingPlanDB.findMany({ skip, take: pageSize }),
      readingPlanDB.count(),
    ]);

    return {
      data: plans,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async update(id: string, data: Partial<{ title: string; description: string; duration: number; startDate: Date }>) {
    return readingPlanDB.update(id, data);
  },

  async delete(id: string) {
    return readingPlanDB.delete(id);
  },
};
