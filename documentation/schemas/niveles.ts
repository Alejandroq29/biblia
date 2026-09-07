import { registry } from '../registry';
import { z } from 'zod';

const LevelSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  order: z.number(),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
});

registry.registerComponent('schemas', 'Level', LevelSchema);

registry.registerPath({
  method: 'get',
  path: '/api/niveles',
  tags: ['Niveles'],
  summary: 'Listar niveles de dificultad',
  parameters: [
    { name: 'page', schema: { type: 'integer', default: 1 }, in: 'query' },
    { name: 'pageSize', schema: { type: 'integer', default: 50 }, in: 'query' },
  ],
  responses: {
    200: {
      description: 'Listado de niveles',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(LevelSchema),
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
  path: '/api/niveles',
  tags: ['Niveles'],
  summary: 'Crear nivel',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: z.object({
          code: z.string(),
          name: z.string(),
          description: z.string().optional(),
          order: z.number(),
          minAge: z.number().optional(),
          maxAge: z.number().optional(),
        }),
      },
    },
  },
  responses: {
    201: {
      description: 'Nivel creado',
      content: {
        'application/json': {
          schema: z.object({ data: LevelSchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/niveles/{nivelId}',
  tags: ['Niveles'],
  summary: 'Obtener nivel por ID',
  parameters: [{ name: 'nivelId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: {
    200: {
      description: 'Nivel encontrado',
      content: {
        'application/json': {
          schema: z.object({ data: LevelSchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/niveles/{nivelId}',
  tags: ['Niveles'],
  summary: 'Actualizar nivel',
  parameters: [{ name: 'nivelId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: { 200: { description: 'Nivel actualizado' } },
});

registry.registerPath({
  method: 'delete',
  path: '/api/niveles/{nivelId}',
  tags: ['Niveles'],
  summary: 'Eliminar nivel',
  parameters: [{ name: 'nivelId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: { 204: { description: 'Nivel eliminado' } },
});
