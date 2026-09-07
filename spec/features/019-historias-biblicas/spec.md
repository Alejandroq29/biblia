# Feature 019: Historias Bíblicas

## Especificación

Gestionar historias bíblicas educativas basadas en pasajes. Cada historia tiene un nivel de dificultad asociado.

### Endpoints

- `GET /api/historias` - Listar historias (filtrable por nivel, paginada)
- `POST /api/historias` - Crear historia (admin/editor)
- `GET /api/historias/{historiaId}` - Obtener historia
- `PATCH /api/historias/{historiaId}` - Actualizar (admin/editor)
- `DELETE /api/historias/{historiaId}` - Eliminar (admin)

### Modelo

```prisma
model BiblicalStory {
  id           String
  title        String       // "La creación"
  description  String
  content      String       // Texto HTML o markdown
  levelId      String       // Referencia al nivel
  imageUrl     String?
  status       String       // "published", "draft"
  createdAt    DateTime
  updatedAt    DateTime
  deletedAt    DateTime?
  level        Level        // Relación
  games        Game[]       // Historias pueden tener juegos asociados
  favorites    UserFavorite[]
}
```

### Validación

- `title`: 3-200 caracteres
- `description`: 10-1000 caracteres
- `content`: mínimo 50 caracteres
- `levelId`: UUID válido
- `imageUrl`: URL válida (opcional)

## Status

- [ ] API routes implementadas
- [ ] Validaciones Zod completas
- [ ] Tests de integración
- [ ] OpenAPI spec verificada
