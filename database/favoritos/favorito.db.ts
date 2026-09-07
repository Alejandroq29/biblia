import { prisma } from '../client';

export const userFavoriteDB = {
  async create(data: {
    userId: string;
    storyId: string;
  }) {
    return prisma.userFavorite.create({
      data,
      include: { user: true, story: true },
    });
  },

  async findById(id: string) {
    return prisma.userFavorite.findUnique({
      where: { id },
      include: { user: true, story: true },
    });
  },

  async findByUser(userId: string, params?: { skip?: number; take?: number }) {
    return prisma.userFavorite.findMany({
      where: { userId },
      include: { story: true },
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
    });
  },

  async delete(id: string) {
    return prisma.userFavorite.delete({
      where: { id },
    });
  },

  async deleteByUserAndStory(userId: string, storyId: string) {
    return prisma.userFavorite.deleteMany({
      where: { userId, storyId },
    });
  },

  async countUserFavorites(userId: string) {
    return prisma.userFavorite.count({
      where: { userId },
    });
  },
};
