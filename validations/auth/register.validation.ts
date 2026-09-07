import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../schemas';

// Espeja la política real del realm de Keycloak (ver keycloak/realm-biblia-kids.json,
// `passwordPolicy: "length(8) and notUsername"`) — solo mejora UX, Keycloak sigue validando
// en última instancia al crear el usuario.
const passwordSchema = z.string().min(8, VALIDATION_MESSAGES.MIN_LENGTH(8));

export const registerSchema = z.object({
		email: z.string().email(VALIDATION_MESSAGES.EMAIL),
		password: passwordSchema,
		firstName: z
			.string()
			.min(1, VALIDATION_MESSAGES.REQUIRED)
			.max(100, VALIDATION_MESSAGES.MAX_LENGTH(100)),
		lastName: z
			.string()
			.min(1, VALIDATION_MESSAGES.REQUIRED)
			.max(100, VALIDATION_MESSAGES.MAX_LENGTH(100)),
	});

export type RegisterBody = z.infer<typeof registerSchema>;
