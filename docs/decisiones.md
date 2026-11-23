# Registro de decisiones — ACADIX

Este documento registra las decisiones conceptuales y funcionales confirmadas para el desarrollo de ACADIX.

Las decisiones aquí documentadas sirven como referencia para elaborar los requisitos, las reglas de negocio, la arquitectura y el desarrollo del sistema.

## Identidad y alcance

- **DEC-001:** El proyecto se llamará ACADIX.
- **DEC-002:** Será una aplicación web educativa (EdTech).
- **DEC-003:** La primera versión estará destinada a una sola institución.
- **DEC-004:** Se utilizará una arquitectura modular.
- **DEC-005:** El alcance inicial incluye programas, temas y materiales educativos. No incluye calificaciones, entregas de trabajos, evaluaciones ni contenido de audio o video.
- **DEC-006:** La organización será: institución → año lectivo → curso → división → materia → período → programa → tema → material.
- **DEC-007:** Los estudiantes accederán a los contenidos correspondientes a sus asignaciones. Los períodos anteriores estarán disponibles en modo de solo lectura.
- **DEC-008:** El contenido será privado y estará disponible únicamente para usuarios autorizados de la institución.

## Contenido educativo

- **DEC-009:** Los materiales serán archivos PDF de hasta 20 MB cada uno.
- **DEC-010:** Existirán tres roles: administrador, docente y estudiante.
- **DEC-011:** El administrador creará cuentas de docentes y los docentes crearán y gestionarán cuentas de estudiantes. No habrá registro público.
- **DEC-012:** Los docentes podrán modificar los datos permitidos de sus estudiantes, pero no sus roles.
- **DEC-013:** Un docente podrá tener varias asignaciones de materia, curso y división.
- **DEC-014:** Cada material pertenecerá a un tema.
- **DEC-015:** Los docentes gestionarán contenido únicamente dentro de sus asignaciones y en períodos habilitados.
- **DEC-016:** La eliminación de programas y temas será definitiva y en cascada sobre sus contenidos asociados.
- **DEC-017:** Los programas se crearán como borradores y deberán publicarse manualmente.
- **DEC-018:** Cada año lectivo tendrá dos cuatrimestres, cuatro bimestres y un período especial de recuperación entre diciembre y febrero.
- **DEC-019:** Cada año lectivo será independiente y los anteriores se conservarán para consulta histórica.
- **DEC-020:** Los períodos cerrados serán de solo lectura.
- **DEC-021:** La recuperación de contraseñas podrá realizarse mediante un enlace por correo o una contraseña temporal que deberá cambiarse en el siguiente inicio de sesión.
- **DEC-022:** Los docentes gestionarán únicamente las cuentas de estudiantes de sus cursos y divisiones asignados.

## Responsabilidad y administración

- **DEC-023:** Solo el administrador podrá abrir y cerrar períodos académicos.
- **DEC-024:** Los docentes responsables podrán editar programas publicados sin despublicarlos. Los cambios se reflejarán inmediatamente para los estudiantes.
- **DEC-025:** El docente responsable será quien creó el programa inicialmente. Solo el responsable actual podrá modificarlo, incluso si está publicado.
- **DEC-026:** Si el responsable deja de estar asignado, el administrador seleccionará a otro docente asignado para asumir la responsabilidad.

## Decisiones técnicas

- **DEC-027:** El lenguaje será JavaScript.
- **DEC-028:** El frontend utilizará React y Vite.
- **DEC-029:** El backend utilizará Node.js y Express.
- **DEC-030:** La base de datos será PostgreSQL.
- **DEC-031:** Se utilizará Prisma como ORM.
- **DEC-032:** La autenticación utilizará sesiones tradicionales administradas por el servidor y cookies de sesión.
- \*\*DEC-033: Los archivos PDF se almacenarán directamente en PostgreSQL mediante columnas BYTEA, con un límite de 20 MB por archivo.
- \*\*DEC-034 — Historial académico: cada estudiante tendrá una inscripción por año lectivo, con su curso y división correspondientes.
- \*\*DEC-035 — Materias: cada materia estará asociada a un curso y una división específicos.
- \*\*DEC-036 — Programas: cada programa pertenecerá a un único período académico.

## Decisiones técnicas pendientes

- Almacenamiento de archivos PDF.
- Hosting y despliegue.
- Estrategia de pruebas.
- Herramientas y metodología de trabajo con Cursor Agents.
