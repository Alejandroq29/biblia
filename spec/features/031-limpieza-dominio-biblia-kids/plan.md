# 031 · Limpieza del dominio legado para Biblia Kids — Plan

## Enfoque

Se realizará una migración por capas. Antes de borrar un módulo, se identificarán sus consumidores y se confirmará si ya fue reemplazado por una capacidad de Biblia Kids. La configuración y los datos de prueba adoptarán nombres neutros de Biblia Kids.

## Implementación

1. Inventariar referencias del dominio legado y clasificarlas como ejecutables, configuración, pruebas o documentación histórica.
2. Actualizar configuración activa: variables de entorno de ejemplo, Docker, realm de Keycloak, clientes OAuth, cookies, semillas y pruebas.
3. Retirar rutas, servicios, acceso a datos, validaciones, schemas OpenAPI y modelos que dependan exclusivamente de organizaciones o sedes; crear una migración de Prisma si el esquema aún los contiene.
4. Ajustar los consumidores y pruebas de los módulos eliminados para que cubran el comportamiento vigente de Biblia Kids.
5. Reescribir o archivar las specs históricas sin alterar el registro de decisiones; actualizar el roadmap.
6. Ejecutar la verificación completa y comprobar que no quedan referencias prohibidas fuera de un archivo de migración histórica, si se conserva.

## Decisiones

- **No sustituir términos a ciegas** — cada reemplazo debe mantener un significado válido; una organización no equivale automáticamente a un usuario, historia o plan de lectura.
- **Migraciones Prisma nuevas** — no se modifican migraciones ya aplicadas; cualquier eliminación de tabla o columna se expresa en una migración nueva y revisable.
- **Mantener auth y usuarios** — son capacidades transversales requeridas por Biblia Kids, aunque tengan origen previo.

## Riesgos

- **Datos o integraciones existentes dependen de nombres anteriores** — se documentará el cambio de configuración y se validará con pruebas.
- **Una eliminación deja imports huérfanos** — se realizarán typecheck y build después de cada grupo de módulos.
- **Las specs antiguas pierden trazabilidad** — se marcarán como archivadas, no se borrarán sin conservar el historial.
