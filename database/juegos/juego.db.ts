import { prisma } from '../client';

export const gameDB = {
  async create(data: {
    title: string;
    description: string;
    type: string;
    storyId?: string;
    levelId: string;
    rules: string;
    imageUrl?: string;
  }) {
    return prisma.game.create({
      data,
      include: { story: true, level: true },
    });
  },

  async findById(id: string) {
    return prisma.game.findUnique({
      where: { id },
      include: { story: true, level: true, progresses: true },
    });
  },

  async findMany(params?: { levelId?: string; type?: string; skip?: number; take?: number }) {
    return prisma.game.findMany({
      where: {
        deletedAt: null,
        ...(params?.levelId && { levelId: params.levelId }),
        ...(params?.type && { type: params.type }),
      },
      include: { story: true, level: true },
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: string, data: Partial<{ title: string; description: string; rules: string; imageUrl: string }>) {
    return prisma.game.update({
      where: { id },
      data,
      include: { story: true, level: true },
    });
  },

  async delete(id: string) {
    return prisma.game.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async count(params?: { levelId?: string }) {
    return prisma.game.count({
      where: {
        deletedAt: null,
        ...(params?.levelId && { levelId: params.levelId }),
      },
    });
  },
};
