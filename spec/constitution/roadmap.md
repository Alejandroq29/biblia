# Roadmap — Biblia Kids

Estado del proyecto y features implementadas vs. pendientes.

## Hecho ✅

Features completadas y foundacionales:

1. **002 · Autenticación Core** — OAuth 2.0 Authorization Code + PKCE, sesiones cifradas con `@hapi/iron`, callback, refresh, logout, documentación OpenAPI.
2. **003 · Gestión de Usuarios** — CRUD de usuarios, perfiles, roles simplificados (admin, editor, user), paginación, soft delete, validación.
3. **007 · Manejo Robusto de Errores** — Errores tipados, mensajes en español, logging estructurado sin información sensible.
4. **008 · Entorno de Demostración** — Keycloak en Docker Compose, usuarios de demo, seeds iniciales, roles base (admin, editor, user).
5. **009 · Sesiones Persistentes** — `UserSession` con tokens sellados, logout invalida servidor, lectura de usuarios sin re-login.
6. **010 · Caché Redis** — ioredis integrado, caché por 24h en GET, invalidación selectiva.
7. **012 · Procesamiento Asincrónico** — BullMQ para tareas pesadas, workers de email/notificación, retry automático.

## Refactorización a Biblia Kids ✅ (Completa)

**Cambio de dominio de negocio**: De Canchago (gestión de espacios deportivos multi-tenant) a **Biblia Kids** (plataforma de contenido bíblico educativo para niños).

**Eliminado:**
- Modelos: Organization, Venue, OrganizationAccessRequest, Role, Permission, RolePermission, UserRole, Menu, MenuPermission
- Directorios: `database/organizaciones-sedes/`, `pages/api/organizaciones/`, `services/organizaciones-sedes/`, `validations/organizaciones-sedes/`, `validations/roles-permisos/`
- Features: 004, 005, 006, 016 (todas multi-tenant, ya no aplicables)

**Creado:**
- Modelos: Book, Chapter, Verse, BiblicalStory, Level, Game, UserProgress, UserFavorite, ReadingPlan
- Database layer: `biblicalStory.db`, `level.db`, `game.db`, `userProgress.db`, `userFavorite.db`, `readingPlan.db`, `book.db`
- Service layer: `biblicalStory.service`, `level.service`, `game.service`, `userProgress.service`, `userFavorite.service`, `readingPlan.service`, `book.service`
- Validaciones: Zod schemas para todos los recursos nuevos
- Documentación OpenAPI: schemas completos para historias, niveles, juegos, progresos, favoritos, planes de lectura, libros

**Stack técnico:** sin cambios (Node.js 22, Next.js 16.2.9, Prisma, PostgreSQL, Zod, Redis, BullMQ, Pino, Vitest)

## Siguiente 🔜

_Lo próximo a abordar, en orden de prioridad._

### 018 · Contenido Bíblico (Libros, Capítulos, Versículos) 🔜
API read-only para la Biblia completa (66 libros, capítulos, versículos). Endpoints: `GET /api/libros`, `GET /api/libros/{id}`, capítulos y versículos anidados.

**Estado**: 
- ✅ Modelos Prisma (Book, Chapter, Verse)
- ✅ Database layer (libro.db.ts)
- ✅ Service layer (libro.service.ts)
- ✅ Validaciones Zod
- ✅ Documentación OpenAPI
- ⏳ API routes (`pages/api/libros/...`)
- ⏳ Seed de 66 libros bíblicos
- ⏳ Tests de integración
- ⏳ Verificación OpenAPI

### 019 · Historias Bíblicas 🔜
CRUD para narrativas educativas basadas en pasajes bíblicos. Endpoints: `GET/POST/PATCH/DELETE /api/historias`

**Estado**:
- ✅ Modelos, DB, Service, OpenAPI, Validaciones
- ⏳ API routes
- ⏳ Tests

### 020 · Niveles de Dificultad 🔜
5 niveles predefinidos (principiante → experto) con rango de edad. Read-only para usuarios normales.

**Estado**:
- ✅ Modelos, DB, Service, OpenAPI
- ⏳ API routes
- ⏳ Seed de 5 niveles
- ⏳ Tests

### 021 · Juegos Educativos 🔜
Quiz, memory, puzzle, match, multiple-choice. CRUD por admin/editor, lectura pública.

**Estado**:
- ✅ Modelos, DB, Service, OpenAPI, Validaciones
- ⏳ API routes
- ⏳ Tests

### 022 · Progreso del Usuario 🔜
Seguimiento: niveles completados, juegos jugados, puntuaciones. Solo usuario puede ver/editar su progreso.

**Estado**:
- ✅ Modelos, DB, Service, OpenAPI, Validaciones
- ⏳ API routes
- ⏳ Autorización (verificar user == token.sub)
- ⏳ Tests

### 023 · Favoritos del Usuario 🔜
Marcar/desmarcar historias. Solo usuario puede gestionar sus favoritos.

**Estado**:
- ✅ Modelos, DB, Service, OpenAPI, Validaciones
- ⏳ API routes
- ⏳ Autorización
- ⏳ Tests

### 024 · Planes de Lectura 🔜
Planes estructurados (7, 30, 90, 365 días). CRUD por admin, lectura pública.

**Estado**:
- ✅ Modelos, DB, Service, OpenAPI, Validaciones
- ⏳ API routes
- ⏳ Tests

## Backlog / Futuro 💡

- **025 · Notificaciones Push** — Firebase Cloud Messaging para recordatorios de lectura
- **026 · Dashboard y Analytics** — Progreso agregado, estadísticas por nivel
- **027 · Exportar Datos** — Descargar progreso como PDF/Excel
- **028 · Búsqueda de Versículos** — Búsqueda full-text en la Biblia
- **029 · Logros y Badges** — Sistema de logros por hito alcanzado
- **030 · Comentarios en Versículos** — Anotaciones personales (futuro)

## Próximos Pasos Inmediatos

1. ✅ Refactorizar schema Prisma (Biblia Kids)
2. ✅ Crear validaciones Zod
3. ✅ Crear Database + Service layers
4. ✅ Crear documentación OpenAPI
5. ⏳ **Implementar Feature 018**: API routes para contenido bíblico
6. ⏳ Crear seed masivo: 66 libros + capítulos + versículos
7. ⏳ Implementar Features 019-024 (API routes CRUD)
8. ⏳ Tests de integración completos
9. ⏳ Verificar `yarn lint`, `yarn typecheck`, `yarn test`, `yarn build`
10. ⏳ Despliegue MVP (Docker + CI/CD)

---

> Cada feature se desarrolla siguiendo: `spec/features/NNN-nombre/spec.md` (qué), `plan.md` (cómo), `tasks.md` (checklist). Se completa primero la spec antes de tocar código.
