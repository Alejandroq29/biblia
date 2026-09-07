# Tareas — Feature 018

## Setup inicial
- [ ] Revisar schema Prisma (Book, Chapter, Verse)
- [ ] Revisar Database layer (libro.db.ts)
- [ ] Revisar Service layer (libro.service.ts)

## API Routes
- [ ] Crear `pages/api/libros/index.ts`
- [ ] Crear `pages/api/libros/[libroId].ts`
- [ ] Crear `pages/api/libros/[libroId]/capitulos/index.ts`
- [ ] Crear `pages/api/libros/[libroId]/capitulos/[capituloId].ts`
- [ ] Crear `pages/api/capitulos/[capituloId]/versiculos/index.ts`
- [ ] Crear `pages/api/capitulos/[capituloId]/versiculos/[versiculoId].ts`

## Tests
- [ ] Crear `services/libros/libro.service.test.ts`
- [ ] Crear `tests/integration/libros.test.ts`

## Seed
- [ ] Crear `prisma/seed-biblia.ts`
- [ ] Ejecutar `yarn seed-dev` para cargar datos

## Documentación
- [ ] Verificar OpenAPI spec en `documentation/schemas/libros.ts`
- [ ] Ejecutar `GET /api/docs` y validar

## Verificación final
- [ ] `yarn lint` — sin errores
- [ ] `yarn typecheck` — sin errores
- [ ] `yarn test` — todos los tests pasan
- [ ] `yarn build` — sin errores
- [ ] Actualizar roadmap en `spec/constitution/roadmap.md`

**Estado**: No iniciado
