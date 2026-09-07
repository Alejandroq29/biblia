# Feature 023: Favoritos del Usuario

## Especificación

Permitir que los usuarios marquen historias como favoritas para acceso rápido.

### Endpoints

- `GET /api/usuarios/{usuarioId}/favoritos` - Listar favoritos del usuario
- `POST /api/usuarios/{usuarioId}/favoritos` - Agregar favorito
- `DELETE /api/usuarios/{usuarioId}/favoritos/{favoritoId}` - Eliminar favorito

### Modelo

```prisma
model UserFavorite {
  id        String
  userId    String       // Dueño del favorito
  storyId   String       // Historia favorita
  createdAt DateTime
  user      User
  story     BiblicalStory
  
  @@unique([userId, storyId])  // Una historia una vez por usuario
}
```

### Validación

- `userId` y `storyId`: UUIDs válidos
- Unicidad: `(userId, storyId)` debe ser única

## Status

- [ ] API routes implementadas
- [ ] Validaciones
- [ ] Tests (verificar que solo el usuario propietario puede gestionar sus favoritos)
- [ ] OpenAPI spec
