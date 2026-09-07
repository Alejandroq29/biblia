# Plan de Implementación — Feature 018

## Arquitectura de Capas

```
GET /api/libros
    ↓ (pages/api/libros/index.ts)
    ├─ auth middleware (si es requerida)
    ├─ parser + validación
    └─ BookService.listAll()
        └─ BookDB.findMany()
            └─ Prisma.book.findMany()
```

## Dependencias

- Modelos Prisma: ✅ Ya existen (Book, Chapter, Verse)
- Database layer: ✅ Ya existe (database/libros/libro.db.ts)
- Service layer: ✅ Ya existe (services/libros/libro.service.ts)

## Implementación

### 1. API Routes a crear

- `pages/api/libros/index.ts` — GET (listar todos)
- `pages/api/libros/[libroId].ts` — GET (obtener libro + capítulos)
- `pages/api/libros/[libroId]/capitulos/index.ts` — GET (listar capítulos)
- `pages/api/libros/[libroId]/capitulos/[capituloId].ts` — GET (capítulo + versículos)
- `pages/api/capitulos/[capituloId]/versiculos/index.ts` — GET (listar versículos)
- `pages/api/capitulos/[capituloId]/versiculos/[versiculoId].ts` — GET (versículo)

### 2. Validaciones

Usar Zod schemas existentes en `validations/libros/`. Parámetros:
- Query: `page`, `pageSize`, `testament`
- Path: `libroId`, `capituloId`, `versiculoId` (todos UUIDs)

### 3. Middleware Chain

```
requestContext → rateLimit → parser → cache → apiResponse → handler
```

No requiere auth para lectura (endpoint público). Cache por 24h en Redis.

### 4. Seed

Crear `prisma/seed-biblia.ts` que inserte:
- 39 libros OT (Génesis → Malaquías)
- 27 libros NT (Mateo → Apocalipsis)
- Capítulos y versículos completos

## Testing

- Unit: `services/libros/libro.service.test.ts`
- Integration: `tests/integration/libros.test.ts`
- Casos: GET todos, GET por ID, filtro por testamento, paginación

## Aceptación

- ✅ Todos los 4 endpoints funcionan y retornan datos correo
- ✅ OpenAPI spec es válida
- ✅ Paginación funciona
- ✅ Filtro por testamento funciona
- ✅ Cache activo
