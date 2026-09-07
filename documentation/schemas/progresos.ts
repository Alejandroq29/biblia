import { registry } from '../registry';
import { z } from 'zod';

const UserProgressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  levelId: z.string().uuid(),
  gameId: z.string().uuid().optional(),
  score: z.number(),
  completed: z.boolean(),
  attempts: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

registry.registerComponent('schemas', 'UserProgress', UserProgressSchema);

registry.registerPath({
  method: 'get',
  path: '/api/usuarios/{usuarioId}/progresos',
  tags: ['Progresos'],
  summary: 'Listar progreso del usuario',
  parameters: [
    { name: 'usuarioId', schema: { type: 'string' }, in: 'path', required: true },
    { name: 'page', schema: { type: 'integer', default: 1 }, in: 'query' },
    { name: 'pageSize', schema: { type: 'integer', default: 20 }, in: 'query' },
  ],
  responses: {
    200: {
      description: 'Listado de progresos',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(UserProgressSchema),
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
  path: '/api/usuarios/{usuarioId}/progresos',
  tags: ['Progresos'],
  summary: 'Registrar progreso',
  parameters: [{ name: 'usuarioId', schema: { type: 'string' }, in: 'path', required: true }],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: z.object({
          levelId: z.string(),
          gameId: z.string().optional(),
          score: z.number(),
          completed: z.boolean(),
        }),
      },
    },
  },
  responses: {
    201: {
      description: 'Progreso registrado',
      content: {
        'application/json': {
          schema: z.object({ data: UserProgressSchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/usuarios/{usuarioId}/progresos/{progresoId}',
  tags: ['Progresos'],
  summary: 'Obtener progreso específico',
  parameters: [
    { name: 'usuarioId', schema: { type: 'string' }, in: 'path', required: true },
    { name: 'progresoId', schema: { type: 'string' }, in: 'path', required: true },
  ],
  responses: {
    200: {
      description: 'Progreso encontrado',
      content: {
        'application/json': {
          schema: z.object({ data: UserProgressSchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/usuarios/{usuarioId}/progresos/{progresoId}',
  tags: ['Progresos'],
  summary: 'Actualizar progreso',
  parameters: [
    { name: 'usuarioId', schema: { type: 'string' }, in: 'path', required: true },
    { name: 'progresoId', schema: { type: 'string' }, in: 'path', required: true },
  ],
  responses: { 200: { description: 'Progreso actualizado' } },
});

registry.registerPath({
  method: 'delete',
  path: '/api/usuarios/{usuarioId}/progresos/{progresoId}',
  tags: ['Progresos'],
  summary: 'Eliminar progreso',
  parameters: [
    { name: 'usuarioId', schema: { type: 'string' }, in: 'path', required: true },
    { name: 'progresoId', schema: { type: 'string' }, in: 'path', required: true },
  ],
  responses: { 204: { description: 'Progreso eliminado' } },
});
