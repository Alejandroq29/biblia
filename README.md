# Biblia Kids — API REST Backend

**Biblia Kids** es el backend REST de una plataforma educativa para gestionar contenido bíblico interactivo y gamificado dirigido a niños. La API proporciona acceso a la Biblia completa, historias bíblicas personalizadas, juegos educativos y seguimiento del progreso del usuario.

> **Estado actual**: API funcional con autenticación, gestión de usuarios, contenido bíblico, historias, juegos, progreso y favoritos. La fuente de especificaciones está en [`spec/`](spec/README.md).

## Arquitectura

```text
Cliente (Web/Mobile/TV)
        │ REST / JSON
        ▼
Next.js 16 (Pages Router, pages/api)
        │ next-connect + auth/autorización
        ▼
services/ → database/ → Prisma 7 → PostgreSQL
       │
       └── Redis (caché + BullMQ para tareas)
```

Es un monolito modular exclusivamente API REST. Las rutas coordinan middlewares y servicios; la lógica de negocio vive en `services/`; las consultas Prisma se encapsulan en `database/`. Una única instancia de `PrismaClient` en `database/client.ts`. OpenAPI documentado en `/api/docs`.

**Stack verificado**: Node.js ≥22, Next.js 16.2.9, TypeScript estricto, `next-connect`, Prisma 7.8, PostgreSQL, Zod 4, Pino y Vitest. BullMQ y Redis incluidos para caché y colas asíncronas (opcionales en MVP).

## Requisitos previos

- Git.
- Node.js 22 o posterior.
- Corepack y Yarn (Berry con node_modules linking). Nunca npm ni pnpm.
- PostgreSQL accesible (local o remoto con permisos de creación de tablas).
- Docker con Docker Compose v2 (opcional, para Keycloak si usa OAuth).

Verifique:

```bash
git --version
node --version       # v22 o superior
corepack --version
yarn --version
psql --version       # si usa PostgreSQL desde CLI
docker --version
docker compose version
```

Si `yarn` no funciona, ejecute `corepack enable` y reinicie la terminal.

## Instalación inicial

### 1. Obtener el repositorio

```bash
git clone <URL-DEL-REPOSITORIO-BIBLIA_KIDS>
cd biblia
```

Si ya recibió la carpeta, entre en ella. Los comandos siguientes se ejecutan desde `bibliakids/`.

### 2. Instalar dependencias

```bash
yarn install
yarn generate
yarn typecheck
```

`install` restaura el lockfile; `generate` crea Prisma Client desde `prisma/schema.prisma`; `typecheck` comprueba la instalación TypeScript.

### 3. Crear PostgreSQL

`docker-compose.yml` solo contiene Keycloak. Cree una base, usuario y contraseña de desarrollo mediante `psql`, pgAdmin o el servicio institucional. Si su usuario local tiene permiso:

```bash
createdb biblia_1
psql 'postgresql://USUARIO:CONTRASENA@localhost:5432/biblia_1?schema=public' -c 'select 1;'
```

No cree otra base si ya existe ni aplique estos pasos sobre producción. Solicite una URL aislada si trabaja con un servidor compartido.

### 4. Configurar `.env`

```bash
cp .env.example .env
```

`.env` está ignorado por Git. Ajuste:

- `DATABASE_URL`: conexión PostgreSQL.
- `SESSION_SECRET`: valor aleatorio de 32 caracteres como mínimo.
- URL `OAUTH_*`: la plantilla corresponde a Keycloak local en `localhost:8081`.
- `OAUTH_CLIENT_SECRET`: el valor de plantilla es solo del realm didáctico; cámbielo fuera del laboratorio.

`lib/config/env.ts` exige base de datos, `APP_BASE_URL`, proveedor, URLs/clientes OAuth, `OAUTH_MOBILE_CLIENT_ID` y secreto de sesión. Revocación, JWKS, logout, clave pública, rotación del secreto y dominio de cookie son opcionales. Los scopes y tiempos tienen valores predeterminados.

Mantenga `BYPASS_AUTH=false` y `BYPASS_ACCESS_CONTROL=false` para probar seguridad real. Solo operan fuera de producción y no reemplazan Keycloak.

### 5. Iniciar Keycloak

```bash
docker compose up -d
docker compose ps
curl -I http://localhost:8081/realms/biblia
```

Compose inicia Keycloak 26, publica el puerto 8081 e importa `keycloak/realm-bibliakids.json`. Espere el estado saludable. El realm contiene clientes y cuentas didácticas: `administrador`, con contraseña pública de laboratorio `bibliakids123`. Nunca reutilice esas credenciales ni despliegue el realm sin cambiarlas.

Keycloak importa el JSON al crear el contenedor, no en cada inicio. Si modifica el realm y trabaja en un laboratorio desechable:

```bash
docker compose down
docker compose up -d
```

### 6. Aplicar migraciones y ejecutar las semillas obligatorias

Una **semilla** (_seed_) introduce los datos mínimos que la aplicación necesita para funcionar. En biblia hay dos semillas diferentes y deben ejecutarse en este orden, después de las migraciones:

```bash
# 1. Crear o actualizar la estructura de tablas en desarrollo.
yarn migrate-dev

# 2. Crear el catálogo de permisos que comprueban los endpoints.
yarn seed

# 3. Crear los roles base y relacionar Administrador con todos los permisos.
yarn seed-dev
```

No omita ni invierta los dos últimos comandos: `seed-dev` busca los permisos creados por `yarn seed`. Si el catálogo está vacío, crea los roles, pero muestra una advertencia y el rol Administrador queda sin permisos.

#### Qué crea exactamente `yarn seed`

Ejecuta `prisma/seed.ts` a través de la configuración oficial de Prisma y crea estos 12 permisos:

Usuarios: `usuarios.read`, `usuarios.create`, `usuarios.update`, `usuarios.delete`, `usuarios.manage`.

Historias: `historias.read`, `historias.create`, `historias.update`, `historias.delete`.

Niveles: `niveles.read`, `niveles.create`, `niveles.update`, `niveles.delete`.

Juegos: `juegos.read`, `juegos.create`, `juegos.update`, `juegos.delete`.

Progreso: `progreso.read`, `progreso.create`, `progreso.update`, `progreso.delete`.

Favoritos: `favoritos.read`, `favoritos.create`, `favoritos.delete`.

Planes de lectura: `planes.read`, `planes.create`, `planes.update`, `planes.delete`.

Libros: `libros.read`.

Capítulos: `capitulos.read`.

Versículos: `versiculos.read`.

La semilla consulta cada código antes de crearlo. Puede volver a ejecutarla: los permisos existentes se conservan y aparecen en la terminal como `Permiso ya existe`.

#### Qué crea exactamente `yarn seed-dev`

Ejecuta `prisma/seed-dev.ts` y prepara datos de desarrollo:

1. Crear roles base: `Administrador`, `Libro` y `Gestor de Historia`.
2. Asignar permisos: el rol `Administrador` recibe todos los permisos del catálogo (`usuarios`, `historias`, `niveles`, `juegos`, `progreso`, `favoritos`, `planes de lectura`, `libros`, `capítulos`, `versículos`).
3. Roles adicionales: `Libro` y `Gestor de Historia` se crean sin depender de organizaciones ni sedes.
4. Upsert seguro: el script usa upsert para evitar duplicados y permitir repetir la semilla cuando se agreguen nuevos permisos.

También es segura para repetición: busca los roles activos antes de crearlos y usa una operación `upsert` para las relaciones entre Administrador y permisos. Conviene repetir ambas semillas cuando una migración o feature añada permisos nuevos:

```bash
yarn seed
yarn seed-dev
```

#### Verificar las semillas

Revise primero que ambos comandos terminen con sus mensajes de confirmación y después abra Prisma Studio:

```bash
yarn prisma migrate status
yarn prisma-studio
```

En `http://localhost:5555`, compruebe:

Permission: catálogo con todos los códigos de permisos reales (usuarios, historias, niveles, juegos, progreso, favoritos, planes de lectura, libros, capítulos, versículos).
Role: `libro`, `administrador`, `gestor-de-historia`.
RolePermission: relaciones del rol `administrador` con todos los permisos del catálogo.
Sin organizaciones: no se requiere ninguna organización activa; los roles son globales y no dependen de sedes ni entidades externas.


Prisma Studio se detiene con `Ctrl+C`. No edite datos compartidos desde Studio sin comprender su alcance.

#### Crear el primer superadministrador

Las semillas crean el **rol** Administrador, pero no crean ni privilegian automáticamente a una persona. Keycloak gestiona identidades y contraseñas; PostgreSQL solo conoce al usuario después de que se registra o inicia sesión por primera vez.

El procedimiento de bootstrap es:

1. Inicie Keycloak y el backend.

   ```bash
   docker compose up -d
   yarn dev
   ```

2. Inicie sesión una vez con `administrador` / `bibliakids123`, usando el frontend o `http://localhost:3000/api/auth/login`. Esto sincroniza `administrador@biblia.local` en PostgreSQL. Después cierre sesión.

3. En otra terminal, desde `bibliakids/`, asigne el rol global:

   ```bash
   yarn asignar-rol --email administrador@bibliakids.local --rol administrador
   ```

4. Inicie sesión nuevamente. La nueva sesión cargará el rol y sus permisos. Una sesión creada antes de la asignación no se actualiza automáticamente.

`yarn asignar-rol` es la única vía soportada para aprovisionar el primer Administrador; no existe un endpoint público de bootstrap. El comando es idempotente: repetir la misma asignación y alcance no crea otra fila.

Para preparar las otras cuentas didácticas, primero inicie sesión una vez con cada cuenta y después ejecute:

```bash
yarn asignar-rol --email libro@bibliakids.local --rol libro
yarn asignar-rol --email gestor@bibliakids.local --rol gestor-de-historia
```

El rol de gestor adopta por defecto la organización a la que pertenece su definición. Para fijar explícitamente el alcance, use UUID reales obtenidos en Prisma Studio:

```bash
yarn asignar-rol \
  --email gestor@bibliakids.local \
  --rol gestor-de-historia \
  --organizacion <UUID-ORGANIZACION>

yarn asignar-rol \
  --email gestor@bibliakids.local \
  --rol gestor-de-historia \
  --organizacion <UUID-ORGANIZACION> \
  --sede <UUID-SEDE>
```

Una sede solo puede asignarse junto con su organización y debe pertenecer a ella. Tras cualquier cambio de rol, cierre sesión y vuelva a entrar.

> El registro público actual asigna automáticamente `Libro` a las cuentas nuevas de ese tipo. Las cuentas didácticas importadas directamente por el realm de Keycloak siguen necesitando su primera sincronización y la asignación manual anterior.

#### Desarrollo frente a despliegue

En despliegues use `yarn migrate-deploy`, que aplica únicamente migraciones versionadas. `seed-dev` contiene datos de laboratorio y no debe ejecutarse automáticamente en producción. Defina un proceso explícito y auditado para permisos, roles y primer administrador del entorno real. No use `prisma db push` como sustituto de migraciones.

## Ejecutar y verificar

```bash
yarn dev
```

Next.js escucha por defecto en `http://localhost:3000`. Mantenga esa terminal abierta y compruebe desde otra:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/api/docs/spec
```

Debe responder `200`. Swagger UI está en `http://localhost:3000/api/docs`; un `401` en una ruta protegida sin sesión es correcto. Detenga Next.js con `Ctrl+C`. Use `docker compose stop`/`start` para detener/reanudar Keycloak sin recrearlo.

### Autenticación real

- Navegador: `GET /api/auth/login` usa Authorization Code + OIDC + PKCE y una cookie `HttpOnly` cifrada.
- Capacitor: `POST /api/auth/mobile/login` usa `Bi-mobile`, devuelve una sesión Bearer y el cliente la guarda en almacenamiento nativo seguro.

El flujo móvil usa Resource Owner Password Credentials por decisión explícita de su feature. Es una excepción del laboratorio que contradice una prohibición antigua aún presente en parte de la constitución; requiere revisión antes de producción.

## Backend y frontend juntos

Ubique ambos como carpetas hermanas:

```text
proyectos/
├── biblia/
└── biblia-ionic/
```

```bash
# Terminal 1, biblia/
docker compose up -d
yarn dev

# Terminal 2, biblia-ionic/
yarn dev
```

En navegador, Vite reenvía `/api` desde 5173 hacia 3000, conservando el flujo de cookie. Android/iOS usan URL absoluta y Bearer. Consulte el [README móvil](../biblia-ionic/README.md) para emuladores y dispositivos.

## Flujo diario

Después del setup: `docker compose up -d` y `yarn dev`. Tras cambiar Prisma, use `yarn migrate-dev` y `yarn generate`. Antes de integrar:

```bash
yarn lint
yarn typecheck
yarn test
yarn build
```

### Estado de validación conocido

En la revisión documental del 21 de agosto de 2026, `yarn lint` terminó con dos advertencias y ningún error. La línea base no estaba completamente verde: `yarn typecheck` y `yarn build` fallaron por incompatibilidades OpenAPI/Zod, nulabilidad en usuarios y tipos de helpers/tests; `yarn test` aprobó 22 de 41 pruebas y las otras 19 fallaron porque `tests/integration/roles-permisos.test.ts` usa rutas de importación que no resuelven. Son defectos preexistentes del código, no señales de que deba cambiar Node, Yarn o esta configuración.

El proyecto es spec-driven: lea `spec/constitution/` y la feature antes de cambiar código. Cada endpoint nuevo debe registrarse también en OpenAPI.

## Estructura

| Ruta             | Responsabilidad                 |
| ---------------- | ------------------------------- |
| `pages/api/`     | Rutas REST y middlewares        |
| `middleware/`    | Autenticación y autorización    |
| `services/`      | Reglas de negocio               |
| `database/`      | Acceso mediante Prisma          |
| `prisma/`        | Schema, migraciones y seeds     |
| `documentation/` | Registro OpenAPI                |
| `keycloak/`      | Realm local                     |
| `spec/`          | Constitución y contratos        |
| `tests/`         | Pruebas unitarias e integración |

## Comandos

| Comando                                            | Función                                            |
| -------------------------------------------------- | -------------------------------------------------- |
| `yarn dev`                                         | Next.js con recarga                                |
| `yarn build` / `yarn start`                        | Construir / servir producción                      |
| `yarn lint` / `yarn lint:fix`                      | Comprobar / corregir ESLint                        |
| `yarn format` / `yarn format:check`                | Escribir / comprobar Prettier                      |
| `yarn typecheck`                                   | Validar TypeScript                                 |
| `yarn test` / `yarn test:watch`                    | Vitest una vez / observación                       |
| `yarn generate`                                    | Generar Prisma Client                              |
| `yarn migrate-dev` / `yarn migrate-deploy`         | Migrar desarrollo / despliegue                     |
| `yarn seed` / `yarn seed-dev`                      | Permisos / roles demo                              |
| `yarn asignar-rol --email <correo> --rol <codigo>` | Asignar un rol existente a un usuario sincronizado |
| `yarn prisma-studio`                               | Explorar la base                                   |

Los scripts `worker:email`, `worker:notification` y `worker:report` están declarados, pero no existen sus archivos `workers/*.ts`; actualmente no son operativos.

## Solución de problemas

### Variables inválidas

Confirme que creó `.env`, que el secreto tiene ≥32 caracteres y que las URL incluyen protocolo. Compare nombres con `.env.example` sin editar la plantilla.

### Prisma `P1000`/`P1001`

PostgreSQL no está iniciado, no es accesible o `DATABASE_URL` es incorrecta. Pruebe la misma URL con `psql ... -c 'select 1;'`.

### Faltan tablas

Ejecute `yarn prisma migrate status`; use `yarn migrate-dev` en desarrollo o `yarn migrate-deploy` en despliegue.

### Login falla

Revise `docker compose ps` y el realm con `curl -I`. Las URL externas usan 8081; dentro del contenedor Keycloak usa 8080.

### Respuesta 403

La sesión existe pero falta permiso/alcance. Ejecute `yarn seed` y luego `yarn seed-dev`; no active bypass para ocultarlo.

### Puerto ocupado

Use `lsof -i :3000` o `lsof -i :8081` y detenga la instancia previa. Cambiar puertos exige actualizar URLs, redirecciones, realm, proxy y configuración móvil.

### Yarn incorrecto o nuevos lockfiles

Ejecute `corepack enable` y use solo Yarn. No mezcle npm/pnpm.

### El frontend no conecta

Pruebe primero `/api/docs/spec` directamente en 3000; luego revise proxy o URL absoluta según plataforma. No combine cookies con CORS comodín como atajo.

## Seguridad y límites

- Nunca versionar `.env`, tokens, claves ni credenciales reales.
- Las credenciales del realm son datos públicos de laboratorio.
- PostgreSQL se administra fuera de Compose.
- No hay almacenamiento de archivos, Redis, colas ni workers activos en el arranque actual.
- Para cambios de código prevalecen `AGENTS.md` y `spec/constitution/`.
