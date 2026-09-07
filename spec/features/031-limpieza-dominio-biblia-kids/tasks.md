# 031 · Limpieza del dominio legado para Biblia Kids — Tareas

- [ ] Clasificar las 264 referencias inventariadas por tipo y consumidor.
- [ ] Renombrar la configuración activa y los datos de prueba a Biblia Kids.
- [ ] Auditar y retirar los módulos de organizaciones y sedes que aún existan.
- [ ] Crear y aplicar una migración Prisma nueva si el esquema contiene entidades del dominio legado.
- [ ] Retirar o actualizar endpoints, servicios, validaciones y documentación OpenAPI afectados.
- [ ] Actualizar las pruebas para conceptos propios de Biblia Kids.
- [ ] Archivar o reescribir documentación y specs heredadas sin perder trazabilidad.
- [ ] Verificar que no quedan referencias a cancha, Canchago, fútbol, futbolistas, organizaciones ni sedes en el código y configuración activos.

## Cierre

- [ ] Validar contra los criterios de aceptación de `spec.md`.
- [ ] Ejecutar `yarn lint && yarn typecheck && yarn test && yarn build`.
- [ ] Mover la feature a "Hecho" en `../../constitution/roadmap.md`.
