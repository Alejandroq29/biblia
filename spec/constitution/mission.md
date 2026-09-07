# Misión

_Proporcionar una plataforma educativa robusta y escalable de contenido bíblico interactivo y gamificado para niños, diseñada como API REST pura para integración flexible en múltiples interfaces de usuario._

## Qué construimos

Construimos un sistema modular que centraliza el contenido bíblico completo, narrativas educativas personalizadas y juegos interactivos para reforzar el aprendizaje de la Biblia en niños.

1. **Gestión de Contenido Bíblico** — Un núcleo que organiza la Biblia completa (66 libros, capítulos, versículos) permitiendo búsquedas, filtrado y presentación flexible.
2. **Sistema de Historias y Juegos** — Narrativas educativas basadas en pasajes bíblicos con juegos asociados para reforzar el aprendizaje.
3. **Seguimiento de Progreso y Gamificación** — Sistema de niveles, puntos, logros y planes de lectura que motivan la continuidad del aprendizaje.
4. **Flexibilidad de Integración** — API REST pura documentada en OpenAPI, lista para integrarse con apps móviles, web o cualquier cliente que necesite contenido bíblico.

## Para quién

- **Niños y jóvenes (6-17 años):** Buscan una experiencia interactiva y divertida para aprender sobre la Biblia sin intimidación, avanzando en niveles y alcanzando logros.

- **Padres y educadores:** Buscan herramientas de acompañamiento para guiar el aprendizaje bíblico de los niños, con planes estructurados y seguimiento de progreso.

- **Organizaciones religiosas y educativas:** Buscan una plataforma centralizada para servir contenido bíblico educativo a su comunidad de niños.

- **Desarrolladores de apps:** Se benefician de una API predecible, fuertemente tipada y bien documentada en OpenAPI para construir apps móviles y web sin fricción.

## Principios

- **Contenido sobre Interfaz** — La API define el negocio. Cualquier interfaz (web, móvil, TV) consume la misma API, asegurando consistencia y flexibilidad.

- **El Contrato es la Ley (Spec-Driven Development)** — Ningún endpoint se programa sin antes haber definido y aprobado el contrato en la spec. Esto asegura fiabilidad, pruebas automatizadas y aislamiento entre capas.

- **Modularidad Intransigente** — Los dominios (Usuarios, Historias, Juegos, Progresos, Favoritos) viven en silos funcionales estrictos dentro del monolito. Si un módulo falla, el resto del ecosistema no colapsa.

- **Trazabilidad Completa** — Todo cambio en el progreso del usuario, logros y planes de lectura queda registrado (auditoría, soft deletes). Nada desaparece de la base de datos.

## Qué NO es

- NO es una red social para padres ni un foro de discusión bíblica.

- NO es (en MVP) un sistema de gestión de iglesias o congregaciones con múltiples sedes.

- NO es una plataforma de venta o suscripción premium (aunque la arquitectura lo permite en fases futuras).

- NO es un sistema acoplado donde las reglas de presentación (UI) dicten la lógica del negocio o estructura interna de la base de datos.
