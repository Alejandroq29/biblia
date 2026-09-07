import { prisma } from '@/database/client';
import { env } from '@/lib/config/env';

type SessionUser = {
	id: string;
	email: string;
	role: 'admin' | 'editor' | 'user';
	name: string;
};

/**
 * Obtiene datos del usuario para la sesión autenticada.
 */
export const getSessionUser = async (userId: string): Promise<SessionUser | null> => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			role: true,
			profile: { select: { firstName: true, lastName: true } },
		},
	});

	if (!user) return null;

	const name = [user.profile?.firstName, user.profile?.lastName]
		.filter(Boolean)
		.join(' ')
		.trim() || user.email;

	return {
		id: user.id,
		email: user.email,
		role: user.role as 'admin' | 'editor' | 'user',
		name,
	};
};

/**
 * Sincroniza un usuario desde OAuth.
 */
export const findOrSyncByOAuth = async (
	provider: string,
	providerAccountId: string,
	email: string,
	displayName: string,
) => {
	// Buscar cuenta existente
	const existingAccount = await prisma.authAccount.findUnique({
		where: {
			provider_providerAccountId: {
				provider,
				providerAccountId,
			},
		},
	});

	if (existingAccount) {
		// Actualizar usuario existente
		await prisma.user.update({
			where: { id: existingAccount.userId },
			data: { email },
		});

		return getSessionUser(existingAccount.userId);
	}

	// Buscar usuario existente por email
	const existingUser = await prisma.user.findUnique({ where: { email } });

	if (existingUser) {
		// Re-enlazar cuenta OAuth
		await prisma.authAccount.create({
			data: {
				userId: existingUser.id,
				provider,
				providerAccountId,
			},
		});

		return getSessionUser(existingUser.id);
	}

	// Crear nuevo usuario
	const [firstName = '', lastName = ''] = displayName.split(/\s+/, 2);

	const newUser = await prisma.user.create({
		data: {
			email,
			role: 'user',
			profile: {
				create: {
					firstName,
					lastName,
				},
			},
			authAccounts: {
				create: {
					provider,
					providerAccountId,
				},
			},
		},
	});

	return getSessionUser(newUser.id);
};

/**
 * Crea un usuario desde registro público.
 */
export const createFromRegistration = async (
	provider: string,
	providerAccountId: string,
	data: { email: string; firstName: string; lastName: string },
) => {
	return await prisma.user.create({
		data: {
			email: data.email,
			role: 'user',
			profile: {
				create: {
					firstName: data.firstName,
					lastName: data.lastName,
				},
			},
			authAccounts: {
				create: {
					provider,
					providerAccountId,
				},
			},
		},
		select: {
			id: true,
			email: true,
			role: true,
			status: true,
			profile: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

export const findByEmail = async (email: string) =>
	prisma.user.findFirst({
		where: { email, deletedAt: null },
		select: { id: true },
	});

/**
 * Obtiene lista paginada de usuarios.
 */
export const getAll = async (page: number = 1, pageSize: number = 20) => {
	const skip = (page - 1) * pageSize;

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			select: {
				id: true,
				email: true,
				role: true,
				status: true,
				profile: { select: { firstName: true, lastName: true } },
				createdAt: true,
				updatedAt: true,
			},
			skip,
			take: pageSize,
			orderBy: { createdAt: 'desc' },
			where: { deletedAt: null },
		}),
		prisma.user.count({ where: { deletedAt: null } }),
	]);

	return {
		data: users,
		meta: {
			page,
			pageSize,
			total,
			totalPages: Math.ceil(total / pageSize),
		},
	};
};

/**
 * Obtiene un usuario por ID.
 */
export const getById = async (userId: string) => {
	return prisma.user.findUnique({
		where: { id: userId, deletedAt: null },
		select: {
			id: true,
			email: true,
			role: true,
			status: true,
			profile: { select: { firstName: true, lastName: true, dateOfBirth: true } },
			createdAt: true,
			updatedAt: true,
		},
	});
};

/**
 * Actualiza un usuario.
 */
export const update = async (
	userId: string,
	data: {
		firstName?: string;
		lastName?: string;
		dateOfBirth?: string | null;
		role?: 'admin' | 'editor' | 'user';
		status?: string;
	},
) => {
	return prisma.user.update({
		where: { id: userId },
		data: {
			...(data.role && { role: data.role }),
			...(data.status && { status: data.status }),
			...(data.firstName || data.lastName || data.dateOfBirth !== undefined
				? {
						profile: {
							update: {
								...(data.firstName && { firstName: data.firstName }),
								...(data.lastName && { lastName: data.lastName }),
								...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }),
							},
						},
					}
				: {}),
		},
		select: {
			id: true,
			email: true,
			role: true,
			status: true,
			profile: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

/**
 * Soft-delete: marca usuario como eliminado.
 */
export const softDelete = async (userId: string) => {
	return prisma.user.update({
		where: { id: userId },
		data: { deletedAt: new Date() },
		select: { id: true, deletedAt: true },
	});
};
