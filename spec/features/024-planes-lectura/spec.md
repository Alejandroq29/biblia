# Feature 024: Planes de Lectura

## Especificación

Planes estructurados para acompañar a los usuarios en el estudio de la Biblia a lo largo de un período (ej: 90 días, 365 días).

### Endpoints

- `GET /api/planes-lectura` - Listar planes (paginada)
- `POST /api/planes-lectura` - Crear plan (admin/editor)
- `GET /api/planes-lectura/{planId}` - Obtener plan
- `PATCH /api/planes-lectura/{planId}` - Actualizar
- `DELETE /api/planes-lectura/{planId}` - Eliminar

### Modelo

```prisma
model ReadingPlan {
  id          String
  title       String        // "90 días con la Biblia"
  description String?
  duration    Int           // Días (90, 365, etc.)
  startDate   DateTime      // Fecha de inicio
  status      String        // "published", "draft"
  createdAt   DateTime
  updatedAt   DateTime
  deletedAt   DateTime?
}
```

### Validación

- `title`: 3-200 caracteres
- `duration`: número positivo (1-1000)
- `startDate`: fecha válida

## Status

- [ ] API routes implementadas
- [ ] Validaciones
- [ ] Tests
- [ ] OpenAPI spec
