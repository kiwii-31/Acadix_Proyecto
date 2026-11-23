# TASK — ACADIX

## Objetivo

Organizar el desarrollo en tareas ordenadas, indicando dependencias y estado.

## Estados

- Pendiente
- En progreso
- Bloqueada
- Completada

## Etapa 1 — Documentación y planificación

- [x] TASK-001: Definir la idea del proyecto.
- [x] TASK-002: Registrar decisiones.
- [x] TASK-003: Elaborar glosario.
- [x] TASK-004: Resolver preguntas abiertas.
- [x] TASK-005: Definir reglas de negocio.
- [x] TASK-006: Documentar requisitos funcionales y no funcionales.
- [x] TASK-007: Elaborar historias de usuario y casos de uso.
- [x] TASK-008: Preparar SPEC.
- [x] TASK-009: Definir agentes.
- [x] TASK-010: Preparar Cursor Rules.
- [x] TASK-011: Elaborar PLAN con el agente arquitecto.
- [x] TASK-012: Revisar y aprobar PLAN.

## Etapa 2 — Preparación del desarrollo

- [x] TASK-013: Definir estructura del repositorio.
- [x] TASK-014: Preparar entorno de desarrollo.
- [x] TASK-015: Configurar frontend y backend.
- [x] TASK-016: Configurar PostgreSQL y Prisma.

**Dependencia:** TASK-012.

## Etapa 3 — Implementación

- [x] TASK-017: Desarrollar autenticación y sesiones.
- [x] TASK-018: Implementar roles y permisos.
- [x] TASK-019: Desarrollar estructura académica.
- [x] TASK-020: Desarrollar asignaciones docentes.
- [x] TASK-021: Implementar gestión de años y períodos.
- [x] TASK-022: Desarrollar gestión de programas.
- [x] TASK-023: Desarrollar gestión de temas.
- [x] TASK-024: Implementar almacenamiento y gestión de PDF.
- [x] TASK-025: Desarrollar gestión de cuentas de estudiantes.
- [x] TASK-026: Desarrollar consulta de contenidos para estudiantes.
- [x] TASK-027: Implementar recuperación de contraseñas.

**Dependencia:** TASK-016 y orden definitivo según PLAN.

## Etapa 4 — Calidad e integración

- [x] TASK-028: Ejecutar pruebas funcionales.
- [x] TASK-029: Ejecutar pruebas de seguridad.
- [x] TASK-030: Corregir errores.
- [x] TASK-031: Verificar criterios de aceptación.
- [x] TASK-032: Elaborar informe de pruebas.

**Dependencia:** implementación funcional.

## Etapa 5 — Publicación

- [x] TASK-033: Preparar despliegue.
- [x] TASK-034: Configurar base de datos en producción.
- [x] TASK-035: Publicar frontend y backend.
- [x] TASK-036: Verificar funcionamiento online.
- [x] TASK-037: Preparar documentación final y presentación.

**Dependencia:** TASK-032.

## Reglas de gestión

- No comenzar tareas bloqueadas por dependencias.
- Actualizar el estado al avanzar.
- Dividir tareas grandes cuando sea necesario.
- No agregar funcionalidades fuera del SPEC.
- Registrar errores y cambios importantes.
- El PLAN aprobado determina el orden técnico definitivo.
