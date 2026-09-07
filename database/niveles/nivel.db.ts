import { prisma } from '../client';

export const levelDB = {
  async create(data: {
    code: string;
    name: string;
    description?: string;
    order: number;
    minAge?: number;
    maxAge?: number;
  }) {
    return prisma.level.create({ data });
  },

  async findById(id: string) {
    return prisma.level.findUnique({
      where: { id },
      include: { stories: true, games: true },
    });
  },

  async findMany(params?: { skip?: number; take?: number }) {
    return prisma.level.findMany({
      skip: params?.skip,
      take: params?.take,
      orderBy: { order: 'asc' },
    });
  },

  async update(id: string, data: Partial<{ name: string; description: string; minAge: number; maxAge: number }>) {
    return prisma.level.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.level.delete({
      where: { id },
    });
  },

  async count() {
    return prisma.level.count();
  },
};
