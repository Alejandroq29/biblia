import { prisma } from '../client';

export const readingPlanDB = {
  async create(data: {
    title: string;
    description?: string;
    duration: number;
    startDate: Date;
  }) {
    return prisma.readingPlan.create({ data });
  },

  async findById(id: string) {
    return prisma.readingPlan.findUnique({
      where: { id },
    });
  },

  async findMany(params?: { skip?: number; take?: number }) {
    return prisma.readingPlan.findMany({
      where: { deletedAt: null },
      skip: params?.skip,
      take: params?.take,
      orderBy: { startDate: 'asc' },
    });
  },

  async update(id: string, data: Partial<{ title: string; description: string; duration: number; startDate: Date }>) {
    return prisma.readingPlan.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.readingPlan.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async count() {
    return prisma.readingPlan.count({
      where: { deletedAt: null },
    });
  },
};
