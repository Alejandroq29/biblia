import { bookDB } from '../../database/libros';

export const bookService = {
  async create(data: {
    code: string;
    name: string;
    testament: string;
    order: number;
  }) {
    return bookDB.create(data);
  },

  async getById(id: string) {
    return bookDB.findById(id);
  },

  async listAll(page: number = 1, pageSize: number = 66) {
    const skip = (page - 1) * pageSize;
    const [books, total] = await Promise.all([
      bookDB.findMany(),
      bookDB.count(),
    ]);

    return {
      data: books,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async listByTestament(testament: string) {
    return bookDB.findMany({ testament });
  },
};
