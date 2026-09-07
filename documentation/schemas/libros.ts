import { registry } from '../registry';
import { z } from 'zod';

const BookSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  testament: z.enum(['OT', 'NT']),
  order: z.number(),
  createdAt: z.string().datetime(),
});

registry.registerComponent('schemas', 'Book', BookSchema);

registry.registerPath({
  method: 'get',
  path: '/api/libros',
  tags: ['Libros'],
  summary: 'Listar libros de la Biblia',
  parameters: [
    { name: 'testament', schema: { type: 'string', enum: ['OT', 'NT'] }, in: 'query' },
  ],
  responses: {
    200: {
      description: 'Listado de libros',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(BookSchema),
            meta: z.object({
              page: z.number(),
              pageSize: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/libros/{libroId}',
  tags: ['Libros'],
  summary: 'Obtener libro específico',
  parameters: [{ name: 'libroId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: {
    200: {
      description: 'Libro encontrado',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              ...BookSchema.shape,
              chapters: z.array(z.object({
                id: z.string().uuid(),
                number: z.number(),
                verses: z.array(z.object({
                  id: z.string().uuid(),
                  number: z.number(),
                  text: z.string(),
                })),
              })),
            }),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/libros/{libroId}/capitulos',
  tags: ['Capítulos'],
  summary: 'Listar capítulos de un libro',
  parameters: [{ name: 'libroId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: {
    200: {
      description: 'Listado de capítulos',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(z.object({
              id: z.string().uuid(),
              number: z.number(),
              bookId: z.string().uuid(),
            })),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/libros/{libroId}/capitulos/{capituloId}',
  tags: ['Capítulos'],
  summary: 'Obtener capítulo específico',
  parameters: [
    { name: 'libroId', schema: { type: 'string' }, in: 'path', required: true },
    { name: 'capituloId', schema: { type: 'string' }, in: 'path', required: true },
  ],
  responses: {
    200: {
      description: 'Capítulo encontrado con versículos',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/capitulos/{capituloId}/versiculos',
  tags: ['Versículos'],
  summary: 'Listar versículos',
  parameters: [{ name: 'capituloId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: {
    200: {
      description: 'Listado de versículos',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/capitulos/{capituloId}/versiculos/{versiculoId}',
  tags: ['Versículos'],
  summary: 'Obtener versículo específico',
  parameters: [
    { name: 'capituloId', schema: { type: 'string' }, in: 'path', required: true },
    { name: 'versiculoId', schema: { type: 'string' }, in: 'path', required: true },
  ],
  responses: {
    200: {
      description: 'Versículo encontrado',
    },
  },
});
