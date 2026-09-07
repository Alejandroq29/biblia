# 031 · Limpieza del dominio legado para Biblia Kids

**Estado:** propuesta

## Qué hace

El proyecto deja de contener referencias, configuraciones o contratos del dominio deportivo legado (cancha, Canchago, fútbol, organizaciones y sedes) y conserva únicamente conceptos compatibles con Biblia Kids.

## Por qué

Las referencias heredadas contradicen la misión actual y pueden inducir configuraciones, pruebas y documentación incorrectas.

## Criterios de aceptación

- [ ] El código de ejecución, pruebas, configuración, Docker/Keycloak y documentación activa no contienen referencias al dominio legado.
- [ ] Los nombres de base de datos, clientes OAuth, cookies y datos de demostración identifican a Biblia Kids.
- [ ] Los endpoints, servicios, validaciones, schemas OpenAPI y modelos que dependan de organizaciones o sedes se retiran o se sustituyen por una capacidad definida de Biblia Kids.
- [ ] Las especificaciones históricas se archivan o reescriben para que no presenten el dominio legado como funcionalidad vigente.
- [ ] `yarn lint`, `yarn typecheck`, `yarn test` y `yarn build` terminan sin regresiones atribuibles a esta migración.

## Fuera de alcance

- Implementar nuevos endpoints de contenido bíblico; se realiza en las features 018 a 024.
- Eliminar entidades genéricas de usuarios, autenticación o administración que sigan siendo necesarias para Biblia Kids.
