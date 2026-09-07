import { prisma } from '@/database/client';
import { env } from '@/lib/config/env';

const main = async (): Promise<void> => {
	console.log('🌱 Sembrando datos para Biblia Kids...\n');

	// Crear los 5 niveles de dificultad
	console.log('📚 Creando niveles...');
	const levels = await Promise.all([
		prisma.level.upsert({
			where: { code: 'principiante' },
			update: {},
			create: {
				code: 'principiante',
				name: 'Principiante',
				description: 'Para niños de 3-5 años',
				order: 1,
				minAge: 3,
				maxAge: 5,
			},
		}),
		prisma.level.upsert({
			where: { code: 'basico' },
			update: {},
			create: {
				code: 'basico',
				name: 'Básico',
				description: 'Para niños de 6-8 años',
				order: 2,
				minAge: 6,
				maxAge: 8,
			},
		}),
		prisma.level.upsert({
			where: { code: 'intermedio' },
			update: {},
			create: {
				code: 'intermedio',
				name: 'Intermedio',
				description: 'Para niños de 9-11 años',
				order: 3,
				minAge: 9,
				maxAge: 11,
			},
		}),
		prisma.level.upsert({
			where: { code: 'avanzado' },
			update: {},
			create: {
				code: 'avanzado',
				name: 'Avanzado',
				description: 'Para niños de 12-14 años',
				order: 4,
				minAge: 12,
				maxAge: 14,
			},
		}),
		prisma.level.upsert({
			where: { code: 'experto' },
			update: {},
			create: {
				code: 'experto',
				name: 'Experto',
				description: 'Para niños de 15+ años',
				order: 5,
				minAge: 15,
			},
		}),
	]);

	console.log(`✅ ${levels.length} niveles creados.\n`);

	// Crear usuario admin de demostración
	console.log('👤 Creando usuario admin...');
	const adminUser = await prisma.user.upsert({
		where: { email: 'admin@biblia-kids.test' },
		update: {},
		create: {
			email: 'admin@biblia-kids.test',
			role: 'admin',
			active: true,
			profile: {
				create: {
					firstName: 'Admin',
					lastName: 'Biblia Kids',
				},
			},
			authAccounts: {
				create: {
					provider: env.OAUTH_PROVIDER_NAME,
					providerAccountId: 'admin-test-subject',
				},
			},
		},
	});

	console.log(`✅ Usuario admin creado: ${adminUser.email}\n`);

	// Crear usuario editor de demostración
	console.log('👤 Creando usuario editor...');
	const editorUser = await prisma.user.upsert({
		where: { email: 'editor@biblia-kids.test' },
		update: {},
		create: {
			email: 'editor@biblia-kids.test',
			role: 'editor',
			active: true,
			profile: {
				create: {
					firstName: 'Editor',
					lastName: 'Contenidos',
				},
			},
			authAccounts: {
				create: {
					provider: env.OAUTH_PROVIDER_NAME,
					providerAccountId: 'editor-test-subject',
				},
			},
		},
	});

	console.log(`✅ Usuario editor creado: ${editorUser.email}\n`);

	// Crear usuario normal de demostración
	console.log('👤 Creando usuario normal...');
	const normalUser = await prisma.user.upsert({
		where: { email: 'user@biblia-kids.test' },
		update: {},
		create: {
			email: 'user@biblia-kids.test',
			role: 'user',
			active: true,
			profile: {
				create: {
					firstName: 'Juan',
					lastName: 'Pérez',
					dateOfBirth: new Date('2018-03-15'),
				},
			},
			authAccounts: {
				create: {
					provider: env.OAUTH_PROVIDER_NAME,
					providerAccountId: 'user-test-subject',
				},
			},
		},
	});

	console.log(`✅ Usuario normal creado: ${normalUser.email}\n`);

	console.log('✅ Datos de demostración sembradores correctamente.');
};

main()
	.catch((error: unknown) => {
		console.error('❌ Error en seed-dev:', error instanceof Error ? error.message : error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
