import { prisma } from '../client';

export const bookDB = {
  async create(data: {
    code: string;
    name: string;
    testament: string;
    order: number;
  }) {
    return prisma.book.create({ data });
  },

  async findById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: { chapters: { include: { verses: true } } },
    });
  },

  async findMany(params?: { testament?: string }) {
    return prisma.book.findMany({
      where: params?.testament ? { testament: params.testament } : undefined,
      orderBy: { order: 'asc' },
    });
  },

  async count() {
    return prisma.book.count();
  },
};
