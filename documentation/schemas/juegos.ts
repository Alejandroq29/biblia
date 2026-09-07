import { registry } from '../registry';
import { z } from 'zod';

const GameSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  storyId: z.string().uuid().optional(),
  levelId: z.string().uuid(),
  imageUrl: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

registry.registerComponent('schemas', 'Game', GameSchema);

registry.registerPath({
  method: 'get',
  path: '/api/juegos',
  tags: ['Juegos'],
  summary: 'Listar juegos',
  parameters: [
    { name: 'page', schema: { type: 'integer', default: 1 }, in: 'query' },
    { name: 'pageSize', schema: { type: 'integer', default: 20 }, in: 'query' },
    { name: 'levelId', schema: { type: 'string' }, in: 'query' },
  ],
  responses: {
    200: {
      description: 'Listado de juegos',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(GameSchema),
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
  method: 'post',
  path: '/api/juegos',
  tags: ['Juegos'],
  summary: 'Crear juego',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: z.object({
          title: z.string(),
          description: z.string(),
          type: z.enum(['quiz', 'memory', 'puzzle', 'match', 'multiple-choice']),
          storyId: z.string().optional(),
          levelId: z.string(),
          rules: z.string(),
          imageUrl: z.string().optional(),
        }),
      },
    },
  },
  responses: {
    201: {
      description: 'Juego creado',
      content: {
        'application/json': {
          schema: z.object({ data: GameSchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/juegos/{juegoId}',
  tags: ['Juegos'],
  summary: 'Obtener juego por ID',
  parameters: [{ name: 'juegoId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: {
    200: {
      description: 'Juego encontrado',
      content: {
        'application/json': {
          schema: z.object({ data: GameSchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/juegos/{juegoId}',
  tags: ['Juegos'],
  summary: 'Actualizar juego',
  parameters: [{ name: 'juegoId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: { 200: { description: 'Juego actualizado' } },
});

registry.registerPath({
  method: 'delete',
  path: '/api/juegos/{juegoId}',
  tags: ['Juegos'],
  summary: 'Eliminar juego',
  parameters: [{ name: 'juegoId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: { 204: { description: 'Juego eliminado' } },
});
