import { beforeEach, describe, expect, it, vi } from 'vitest';

const findByEmail = vi.fn();
const createFromRegistration = vi.fn();
const createKeycloakUser = vi.fn();
const deleteKeycloakUser = vi.fn();

vi.mock('@/database/users', () => ({
	findByEmail: (...args: unknown[]) => findByEmail(...args),
	createFromRegistration: (...args: unknown[]) => createFromRegistration(...args),
}));

vi.mock('@/lib/oauth/admin', () => ({
	createKeycloakUser: (...args: unknown[]) => createKeycloakUser(...args),
	deleteKeycloakUser: (...args: unknown[]) => deleteKeycloakUser(...args),
	KeycloakUserConflictError: class KeycloakUserConflictError extends Error {},
}));

vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));

import { register } from './register.service';

const body = {
	email: 'nuevo@example.com',
	password: 'contrasenaSegura123',
	firstName: 'Nuevo',
	lastName: 'Usuario',
};

describe('register', () => {
	beforeEach(() => {
		findByEmail.mockReset();
		createFromRegistration.mockReset();
		createKeycloakUser.mockReset();
		deleteKeycloakUser.mockReset();
	});

	it('rechaza un correo que ya pertenece a un usuario de Biblia Kids', async () => {
		findByEmail.mockResolvedValue({ id: 'user-1' });

		await expect(register(body)).rejects.toMatchObject({ statusCode: 409 });
		expect(createKeycloakUser).not.toHaveBeenCalled();
	});

	it('crea una cuenta local vinculada a la identidad de Keycloak', async () => {
		findByEmail.mockResolvedValue(null);
		createKeycloakUser.mockResolvedValue({ keycloakId: 'keycloak-user-1' });
		createFromRegistration.mockResolvedValue({
			id: 'user-1',
			email: body.email,
			profile: { firstName: body.firstName, lastName: body.lastName },
		});

		await expect(register(body)).resolves.toEqual({
			user: { id: 'user-1', email: body.email, firstName: body.firstName, lastName: body.lastName },
		});
		expect(createFromRegistration).toHaveBeenCalledWith('keycloak', 'keycloak-user-1', {
			email: body.email,
			firstName: body.firstName,
			lastName: body.lastName,
		});
	});

	it('elimina la identidad externa cuando falla la creación local', async () => {
		findByEmail.mockResolvedValue(null);
		createKeycloakUser.mockResolvedValue({ keycloakId: 'keycloak-user-1' });
		createFromRegistration.mockRejectedValue(new Error('fallo de base de datos'));
		deleteKeycloakUser.mockResolvedValue(undefined);

		await expect(register(body)).rejects.toThrow('fallo de base de datos');
		expect(deleteKeycloakUser).toHaveBeenCalledWith('keycloak-user-1');
	});
});
