# Feature 020: Niveles de Dificultad

## Especificación

Sistema de 5 niveles de dificultad (principiante → avanzado) con rango de edad sugerido.

### Endpoints

- `GET /api/niveles` - Listar todos (sin auth)
- `POST /api/niveles` - Crear (admin)
- `GET /api/niveles/{nivelId}` - Obtener (sin auth)
- `PATCH /api/niveles/{nivelId}` - Actualizar (admin)
- `DELETE /api/niveles/{nivelId}` - Eliminar (admin)

### Niveles Predefinidos

```
1. Principiante (3-5 años)
2. Básico (6-8 años)
3. Intermedio (9-11 años)
4. Avanzado (12-14 años)
5. Experto (15+ años)
```

### Modelo

```prisma
model Level {
  id          String
  code        String      // "principiante"
  name        String      // "Principiante"
  description String?
  order       Int         // 1-5
  minAge      Int?        // 3
  maxAge      Int?        // 5
  stories     BiblicalStory[]
  games       Game[]
  progresses  UserProgress[]
}
```

## Status

- [ ] API routes implementadas
- [ ] Seed de 5 niveles predefinidos
- [ ] Tests
- [ ] OpenAPI spec
