import { z } from 'zod';

import { registry } from '@/documentation/registry';
import { ErrorResponseSchema, PaginationMetaSchema } from '@/documentation/responses/common';

const EXAMPLE_UUID = '123e4567-e89b-12d3-a456-426614174000';

const userIdParam = {
	name: 'userId',
	in: 'path' as const,
	required: true,
	schema: { type: 'string' as const, format: 'uuid' },
	example: EXAMPLE_UUID,
};

// Schemas para Biblia Kids
export const UserProfileSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	dateOfBirth: z.string().datetime().nullable(),
	avatar: z.string().nullable(),
});

export const UserResponseSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	role: z.enum(['admin', 'editor', 'user']),
	active: z.boolean(),
	profile: UserProfileSchema.nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const UpdateUserBodySchema = z.object({
	firstName: z.string().min(1).max(100).optional(),
	lastName: z.string().min(1).max(100).optional(),
	dateOfBirth: z.string().datetime().nullable().optional(),
	role: z.enum(['admin', 'editor', 'user']).optional(),
	active: z.boolean().optional(),
});

export const UpdateUserAvatarBodySchema = z.object({
	imageBase64: z.string(),
	mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
});

export const UserListResponseSchema = z.object({
	data: z.array(UserResponseSchema),
	meta: PaginationMetaSchema,
});

registry.register('UserProfile', UserProfileSchema);
registry.register('UserResponse', UserResponseSchema);
registry.register('UserListResponse', UserListResponseSchema);
registry.register('UpdateUserBody', UpdateUserBodySchema);
registry.register('UpdateUserAvatarBody', UpdateUserAvatarBodySchema);

const errorResponses = {
	400: {
		description: 'Solicitud inválida',
		content: { 'application/json': { schema: ErrorResponseSchema } },
	},
	401: {
		description: 'No autenticado',
		content: { 'application/json': { schema: ErrorResponseSchema } },
	},
	403: {
		description: 'Permisos insuficientes',
		content: { 'application/json': { schema: ErrorResponseSchema } },
	},
	404: {
		description: 'Usuario no encontrado',
		content: { 'application/json': { schema: ErrorResponseSchema } },
	},
};

registry.registerPath({
	method: 'get',
	path: '/users',
	tags: ['Users'],
	security: [{ cookieAuth: [] }],
	description: 'Obtiene una lista paginada de usuarios. Requiere rol admin.',
	parameters: [
		{
			name: 'page',
			in: 'query',
			schema: { type: 'integer', minimum: 1 },
			description: 'Número de página (default: 1)',
		},
		{
			name: 'pageSize',
			in: 'query',
			schema: { type: 'integer', minimum: 1, maximum: 100 },
			description: 'Registros por página (default: 20)',
		},
	],
	responses: {
		200: {
			description: 'Lista de usuarios',
			content: { 'application/json': { schema: UserListResponseSchema } },
		},
		401: errorResponses[401],
		403: errorResponses[403],
	},
});

registry.registerPath({
	method: 'get',
	path: '/users/{userId}',
	tags: ['Users'],
	security: [{ cookieAuth: [] }],
	description: 'Obtiene los detalles de un usuario específico.',
	parameters: [userIdParam],
	responses: {
		200: {
			description: 'Detalles del usuario',
			content: { 'application/json': { schema: z.object({ data: UserResponseSchema }) } },
		},
		401: errorResponses[401],
		404: errorResponses[404],
	},
});

registry.registerPath({
	method: 'patch',
	path: '/users/{userId}',
	tags: ['Users'],
	security: [{ cookieAuth: [] }],
	description: 'Actualiza un usuario. Requiere rol admin.',
	parameters: [userIdParam],
	requestBody: {
		required: true,
		content: { 'application/json': { schema: UpdateUserBodySchema } },
	},
	responses: {
		200: {
			description: 'Usuario actualizado',
			content: { 'application/json': { schema: z.object({ data: UserResponseSchema }) } },
		},
		400: errorResponses[400],
		401: errorResponses[401],
		403: errorResponses[403],
		404: errorResponses[404],
	},
});

registry.registerPath({
	method: 'delete',
	path: '/users/{userId}',
	tags: ['Users'],
	security: [{ cookieAuth: [] }],
	description: 'Elimina un usuario (soft delete). Requiere rol admin.',
	parameters: [userIdParam],
	responses: {
		204: { description: 'Usuario eliminado' },
		401: errorResponses[401],
		403: errorResponses[403],
		404: errorResponses[404],
	},
});

registry.registerPath({
	method: 'post',
	path: '/users/{userId}/avatar',
	tags: ['Users'],
	security: [{ cookieAuth: [] }],
	description: 'Sube un avatar para un usuario. Requiere ser el mismo usuario o admin.',
	parameters: [userIdParam],
	requestBody: {
		required: true,
		content: { 'application/json': { schema: UpdateUserAvatarBodySchema } },
	},
	responses: {
		200: {
			description: 'Avatar actualizado',
			content: { 'application/json': { schema: z.object({ data: UserResponseSchema }) } },
		},
		400: errorResponses[400],
		401: errorResponses[401],
		403: errorResponses[403],
		404: errorResponses[404],
	},
});
