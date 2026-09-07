import { prisma } from '../client';

export const userProgressDB = {
  async create(data: {
    userId: string;
    levelId: string;
    gameId?: string;
    score?: number;
    completed?: boolean;
  }) {
    return prisma.userProgress.create({
      data,
      include: { user: true, level: true, game: true },
    });
  },

  async findById(id: string) {
    return prisma.userProgress.findUnique({
      where: { id },
      include: { user: true, level: true, game: true },
    });
  },

  async findByUserAndLevel(userId: string, levelId: string) {
    return prisma.userProgress.findMany({
      where: { userId, levelId },
      include: { level: true, game: true },
    });
  },

  async findByUser(userId: string, params?: { skip?: number; take?: number }) {
    return prisma.userProgress.findMany({
      where: { userId },
      include: { level: true, game: true },
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: string, data: Partial<{ score: number; completed: boolean; attempts: number }>) {
    return prisma.userProgress.update({
      where: { id },
      data,
      include: { user: true, level: true, game: true },
    });
  },

  async delete(id: string) {
    return prisma.userProgress.delete({
      where: { id },
    });
  },

  async countUserProgress(userId: string) {
    return prisma.userProgress.count({
      where: { userId },
    });
  },
};
