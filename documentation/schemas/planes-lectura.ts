import { registry } from '../registry';
import { z } from 'zod';

const ReadingPlanSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  duration: z.number(),
  startDate: z.string().date(),
  status: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

registry.registerComponent('schemas', 'ReadingPlan', ReadingPlanSchema);

registry.registerPath({
  method: 'get',
  path: '/api/planes-lectura',
  tags: ['Planes de lectura'],
  summary: 'Listar planes de lectura',
  parameters: [
    { name: 'page', schema: { type: 'integer', default: 1 }, in: 'query' },
    { name: 'pageSize', schema: { type: 'integer', default: 20 }, in: 'query' },
  ],
  responses: {
    200: {
      description: 'Listado de planes',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(ReadingPlanSchema),
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
  path: '/api/planes-lectura',
  tags: ['Planes de lectura'],
  summary: 'Crear plan de lectura',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: z.object({
          title: z.string(),
          description: z.string().optional(),
          duration: z.number(),
          startDate: z.string().date(),
        }),
      },
    },
  },
  responses: {
    201: {
      description: 'Plan creado',
      content: {
        'application/json': {
          schema: z.object({ data: ReadingPlanSchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/planes-lectura/{planId}',
  tags: ['Planes de lectura'],
  summary: 'Obtener plan por ID',
  parameters: [{ name: 'planId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: {
    200: {
      description: 'Plan encontrado',
      content: {
        'application/json': {
          schema: z.object({ data: ReadingPlanSchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/planes-lectura/{planId}',
  tags: ['Planes de lectura'],
  summary: 'Actualizar plan',
  parameters: [{ name: 'planId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: { 200: { description: 'Plan actualizado' } },
});

registry.registerPath({
  method: 'delete',
  path: '/api/planes-lectura/{planId}',
  tags: ['Planes de lectura'],
  summary: 'Eliminar plan',
  parameters: [{ name: 'planId', schema: { type: 'string' }, in: 'path', required: true }],
  responses: { 204: { description: 'Plan eliminado' } },
});
