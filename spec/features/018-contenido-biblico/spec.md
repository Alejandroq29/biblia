# Feature 018: Contenido Bíblico (Libros, Capítulos, Versículos)

## Especificación

### Descripción
Gestionar y servir el contenido bíblico completo (66 libros del Antiguo y Nuevo Testamento) con estructura de capítulos y versículos. Esta es la base de datos de contenido para todas las demás features.

### Criterios de Aceptación

1. **Obtener Libros**
   - `GET /api/libros` lista todos los 66 libros ordenados por orden canónico
   - Filtrable por testamento (OT, NT)
   - Con paginación: `?page=1&pageSize=66`

2. **Obtener Libro Específico**
   - `GET /api/libros/{libroId}` retorna el libro con todos sus capítulos y versículos
   - Estructura anidada: Libro → Capítulos → Versículos

3. **Obtener Capítulos de un Libro**
   - `GET /api/libros/{libroId}/capitulos` lista capítulos
   - Cada capítulo incluye número e ID

4. **Obtener Versículos de un Capítulo**
   - `GET /api/capitulos/{capituloId}/versiculos` lista versículos
   - Cada versículo incluye número, texto completo e ID

5. **Obtener Versículo Específico**
   - `GET /api/capitulos/{capituloId}/versiculos/{versiculoId}` retorna un versículo con su texto completo

### Modelo de Datos

```prisma
model Book {
  id        String
  code      String        // "genesis", "exodus", etc.
  name      String        // "Génesis", "Éxodo", etc.
  testament String        // "OT" o "NT"
  order     Int           // 1-66
  chapters  Chapter[]
}

model Chapter {
  id        String
  bookId    String
  number    Int           // 1-150+
  verses    Verse[]
  book      Book
}

model Verse {
  id        String
  chapterId String
  number    Int
  text      String        // Texto completo del versículo
  chapter   Chapter
}
```

### Validación

- `GET /api/libros`: parámetros opcionales `page` (int, default 1), `pageSize` (int, default 66), `testament` (enum: OT, NT)
- `GET /api/libros/{libroId}`: libroId debe ser UUID válido
- Todos los endpoints retornan 404 si el recurso no existe

### API Response

Éxito (200):
```json
{
  "data": [...],
  "meta": { "page": 1, "pageSize": 66, "total": 66, "totalPages": 1 }
}
```

Error (400):
```json
{
  "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] }
}
```

## Plan Técnico

1. **Modelos Prisma**: Ya creados en `prisma/schema.prisma`
2. **Database Layer**: Crear `database/libros/libro.db.ts`
3. **Service Layer**: Crear `services/libros/libro.service.ts`
4. **API Routes**: Crear `pages/api/libros/index.ts`, `pages/api/libros/[libroId].ts`, etc.
5. **Validaciones**: Usar Zod schemas en `validations/libros/`
6. **Documentación**: OpenAPI 3 en `documentation/schemas/libros.ts`

## Tareas

- [ ] Crear API route `GET /api/libros`
- [ ] Crear API route `GET /api/libros/{libroId}`
- [ ] Crear API route `GET /api/libros/{libroId}/capitulos`
- [ ] Crear API route `GET /api/libros/{libroId}/capitulos/{capituloId}`
- [ ] Crear API route `GET /api/capitulos/{capituloId}/versiculos`
- [ ] Crear API route `GET /api/capitulos/{capituloId}/versiculos/{versiculoId}`
- [ ] Seed del contenido bíblico (66 libros)
- [ ] Tests de integración
- [ ] Verificar OpenAPI spec
