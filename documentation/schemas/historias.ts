import { registry } from '../registry';
import { z } from 'zod';

const BiblicalStorySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  levelId: z.string().uuid(),
  imageUrl: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  level: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
});

registry.registerComponent('schemas', 'BiblicalStory', BiblicalStorySchema);

registry.registerPath({
  method: 'get',
  path: '/api/historias',
  tags: ['Historias'],
  summary: 'Listar historias bíblicas',
  parameters: [
    { name: 'page', schema: { type: 'integer', default: 1 }, in: 'query' },
    { name: 'pageSize', schema: { type: 'integer', default: 20 }, in: 'query' },
    { name: 'levelId', schema: { type: 'string' }, in: 'query' },
  ],
  responses: {
    200: {
      description: 'Listado de historias',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(BiblicalStorySchema),
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
  path: '/api/historias',
  tags: ['Historias'],
  summary: 'Crear historia bíblica',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: z.object({
          title: z.string(),
          description: z.string(),
          content: z.string(),
          levelId: z.string().uuid(),
          imageUrl: z.string().optional(),
        }),
      },
    },
  },
  responses: {
    201: {
      description: 'Historia creada',
      content: {
        'application/json': {
          schema: z.object({ data: BiblicalStorySchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/historias/{historiaId}',
  tags: ['Historias'],
  summary: 'Obtener historia por ID',
  parameters: [{ name: 'historiaId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: {
    200: {
      description: 'Historia encontrada',
      content: {
        'application/json': {
          schema: z.object({ data: BiblicalStorySchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/historias/{historiaId}',
  tags: ['Historias'],
  summary: 'Actualizar historia',
  parameters: [{ name: 'historiaId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: { 200: { description: 'Historia actualizada' } },
});

registry.registerPath({
  method: 'delete',
  path: '/api/historias/{historiaId}',
  tags: ['Historias'],
  summary: 'Eliminar historia',
  parameters: [{ name: 'historiaId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: { 204: { description: 'Historia eliminada' } },
});
