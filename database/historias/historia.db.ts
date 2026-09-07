import { prisma } from '../client';

export const biblicalStoryDB = {
  async create(data: {
    title: string;
    description: string;
    content: string;
    levelId: string;
    imageUrl?: string;
  }) {
    return prisma.biblicalStory.create({
      data,
      include: { level: true },
    });
  },

  async findById(id: string) {
    return prisma.biblicalStory.findUnique({
      where: { id },
      include: { level: true, games: true, favorites: true },
    });
  },

  async findMany(params?: { levelId?: string; skip?: number; take?: number }) {
    return prisma.biblicalStory.findMany({
      where: {
        deletedAt: null,
        ...(params?.levelId && { levelId: params.levelId }),
      },
      include: { level: true },
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: string, data: Partial<{ title: string; description: string; content: string; levelId: string; imageUrl: string }>) {
    return prisma.biblicalStory.update({
      where: { id },
      data,
      include: { level: true },
    });
  },

  async delete(id: string) {
    return prisma.biblicalStory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async count(params?: { levelId?: string }) {
    return prisma.biblicalStory.count({
      where: {
        deletedAt: null,
        ...(params?.levelId && { levelId: params.levelId }),
      },
    });
  },
};
