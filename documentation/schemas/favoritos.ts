import { registry } from '../registry';
import { z } from 'zod';

const UserFavoriteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  storyId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

registry.registerComponent('schemas', 'UserFavorite', UserFavoriteSchema);

registry.registerPath({
  method: 'get',
  path: '/api/usuarios/{usuarioId}/favoritos',
  tags: ['Favoritos'],
  summary: 'Listar favoritos del usuario',
  parameters: [
    { name: 'usuarioId', schema: { type: 'string' }, in: 'path', required: true },
    { name: 'page', schema: { type: 'integer', default: 1 }, in: 'query' },
    { name: 'pageSize', schema: { type: 'integer', default: 20 }, in: 'query' },
  ],
  responses: {
    200: {
      description: 'Listado de favoritos',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(UserFavoriteSchema),
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
  path: '/api/usuarios/{usuarioId}/favoritos',
  tags: ['Favoritos'],
  summary: 'Agregar favorito',
  parameters: [{ name: 'usuarioId', schema: { type: 'string' }, in: 'path', required: true }],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: z.object({
          storyId: z.string(),
        }),
      },
    },
  },
  responses: {
    201: {
      description: 'Favorito agregado',
      content: {
        'application/json': {
          schema: z.object({ data: UserFavoriteSchema }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/usuarios/{usuarioId}/favoritos/{favoritoId}',
  tags: ['Favoritos'],
  summary: 'Eliminar favorito',
  parameters: [
    { name: 'usuarioId', schema: { type: 'string' }, in: 'path', required: true },
    { name: 'favoritoId', schema: { type: 'string' }, in: 'path', required: true },
  ],
  responses: { 204: { description: 'Favorito eliminado' } },
});
