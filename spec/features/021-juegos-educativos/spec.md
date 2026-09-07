# Feature 021: Juegos Educativos

## Especificación

Juegos interactivos para reforzar el aprendizaje de la Biblia. Tipos: quiz, memory, puzzle, match, multiple-choice.

### Endpoints

- `GET /api/juegos` - Listar (filtrable por nivel/tipo, paginada)
- `POST /api/juegos` - Crear (admin/editor)
- `GET /api/juegos/{juegoId}` - Obtener
- `PATCH /api/juegos/{juegoId}` - Actualizar
- `DELETE /api/juegos/{juegoId}` - Eliminar

### Modelo

```prisma
model Game {
  id          String
  title       String
  description String
  type        String      // "quiz", "memory", "puzzle", etc.
  storyId     String?     // Opcional: asociado a una historia
  levelId     String      // Nivel requerido
  rules       String      // JSON con reglas del juego
  imageUrl    String?
  status      String      // "published", "draft"
  createdAt   DateTime
  updatedAt   DateTime
  deletedAt   DateTime?
  level       Level
  story       BiblicalStory?
  progresses  UserProgress[]
}
```

## Status

- [ ] API routes implementadas
- [ ] Validaciones (tipo de juego enum)
- [ ] Tests
- [ ] OpenAPI spec
