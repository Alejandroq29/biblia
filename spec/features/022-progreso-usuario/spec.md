# Feature 022: Progreso del Usuario

## Especificación

Seguimiento del progreso del usuario: niveles completados, juegos jugados, puntuaciones y logros.

### Endpoints

- `GET /api/usuarios/{usuarioId}/progresos` - Listar progreso del usuario
- `POST /api/usuarios/{usuarioId}/progresos` - Registrar progreso
- `GET /api/usuarios/{usuarioId}/progresos/{progresoId}` - Obtener progreso específico
- `PATCH /api/usuarios/{usuarioId}/progresos/{progresoId}` - Actualizar
- `DELETE /api/usuarios/{usuarioId}/progresos/{progresoId}` - Eliminar

### Modelo

```prisma
model UserProgress {
  id        String
  userId    String      // Quién hace el progreso
  levelId   String      // Qué nivel
  gameId    String?     // Qué juego (opcional)
  score     Int         // Puntos obtenidos
  completed Boolean     // ¿Completado?
  attempts  Int         // Intentos realizados
  createdAt DateTime
  updatedAt DateTime
  user      User
  level     Level
  game      Game?
}
```

### Validación

- `userId` y `levelId`: UUIDs válidos
- `score`: número no negativo
- `completed`: booleano
- `attempts`: número positivo

## Status

- [ ] API routes implementadas
- [ ] Validaciones Zod
- [ ] Tests (verificar que solo el usuario propietario puede ver su progreso)
- [ ] OpenAPI spec
