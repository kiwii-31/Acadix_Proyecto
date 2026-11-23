# Requisitos funcionales — ACADIX

## 1. Autenticación y acceso

- **RF-001 — Inicio de sesión:** Permitir ingresar con usuario o correo electrónico y contraseña.
- **RF-002 — Cierre de sesión:** Permitir finalizar la sesión de forma segura.
- **RF-003 — Identificación del usuario:** Identificar el rol y mostrar las funciones correspondientes.
- **RF-004 — Recuperación por correo:** Permitir solicitar un enlace para restablecer la contraseña.
- **RF-005 — Recuperación asistida:** Permitir al administrador restablecer contraseñas de docentes y a los docentes las de sus estudiantes mediante claves temporales.
- **RF-006 — Cambio obligatorio:** Exigir el cambio de contraseña al ingresar con una clave temporal.

## 2. Gestión de usuarios

- **RF-007 — Administración de docentes:** Permitir al administrador crear, consultar, modificar y desactivar cuentas docentes.
- **RF-008 — Administración de estudiantes:** Permitir a los docentes crear, consultar, modificar y gestionar cuentas de estudiantes de sus cursos y divisiones asignados.
- **RF-009 — Asignación académica de estudiantes:** Asignar un curso y una división a cada estudiante.
- **RF-010 — Modificación de estudiantes:** Permitir modificar sus datos personales y académicos, sin cambiar su rol.
- **RF-011 — Asignación de docentes:** Permitir asignar docentes a varias materias, cursos y divisiones.
- **RF-012 — Consulta de usuarios:** Mostrar usuarios según los permisos de cada rol.

## 3. Organización académica

- **RF-013 — Gestión de años lectivos:** Permitir al administrador crear y gestionar años lectivos.
- **RF-014 — Organización de períodos:** Organizar cada año en dos cuatrimestres y cuatro bimestres.
- **RF-015 — Período de recuperación:** Contemplar un período especial entre diciembre y febrero, independiente de los bimestres.
- **RF-016 — Gestión de cursos y divisiones:** Permitir administrar cursos y sus divisiones.
- **RF-017 — Gestión de materias:** Permitir administrar materias y relacionarlas con cursos y divisiones.
- **RF-018 — Habilitación de períodos:** Permitir exclusivamente al administrador abrir y cerrar períodos académicos.
- **RF-019 — Consulta histórica:** Permitir consultar información académica de años y períodos anteriores en modo de solo lectura.

## 4. Gestión de programas

- **RF-020 — Creación de programas:** Permitir crear programas en las materias, cursos, divisiones y períodos asignados al docente.
- **RF-021 — Edición de programas:** Permitir modificar programas únicamente a su docente responsable.
- **RF-022 — Eliminación de programas:** Permitir eliminar programas y todos sus contenidos asociados de forma definitiva.
- **RF-023 — Guardado de borradores:** Permitir guardar programas sin publicarlos.
- **RF-024 — Publicación de programas:** Permitir que el docente responsable publique manualmente sus programas.
- **RF-025 — Estado de publicación:** Diferenciar los programas en borrador de los publicados.

## 5. Gestión de temas

- **RF-026 — Creación de temas:** Permitir agregar temas a un programa.
- **RF-027 — Edición de temas:** Permitir modificar los datos de los temas.
- **RF-028 — Eliminación de temas:** Permitir eliminar temas y sus materiales asociados.
- **RF-029 — Organización de temas:** Permitir ordenar los temas dentro de un programa.

## 6. Gestión de materiales educativos

- **RF-030 — Carga de materiales:** Permitir adjuntar documentos PDF a los temas.
- **RF-031 — Validación de archivos:** Comprobar que los archivos sean PDF y no superen los 20 MB.
- **RF-032 — Edición de materiales:** Permitir modificar sus datos y reemplazar archivos.
- **RF-033 — Eliminación de materiales:** Permitir eliminar materiales de forma definitiva.
- **RF-034 — Consulta de materiales:** Permitir visualizar y descargar materiales según los permisos.
- **RF-035 — Organización de materiales:** Mostrar los materiales agrupados dentro de sus temas.

## 7. Consulta para estudiantes

- **RF-036 — Panel del estudiante:** Ofrecer un espacio personal para acceder a materias y contenidos.
- **RF-037 — Consulta por materia:** Mostrar programas correspondientes a las materias del estudiante.
- **RF-038 — Consulta por período:** Organizar contenidos por año lectivo, cuatrimestre, bimestre y recuperación.
- **RF-039 — Acceso a programas publicados:** Mostrar únicamente programas publicados y autorizados.
- **RF-040 — Acceso histórico:** Permitir consultar contenidos anteriores sin modificarlos.
- **RF-041 — Descarga de materiales:** Permitir descargar archivos PDF autorizados.

## 8. Interfaz y navegación

- **RF-042 — Navegación según rol:** Adaptar las opciones disponibles al rol del usuario.
- **RF-043 — Búsqueda de contenidos:** Permitir buscar programas, temas y materiales autorizados.
- **RF-044 — Filtros académicos:** Permitir filtrar por año lectivo, curso, división, materia y período.
- **RF-045 — Mensajes de operación:** Informar resultados, errores y confirmaciones.
- **RF-046 — Confirmación de eliminaciones:** Solicitar confirmación antes de eliminar y advertir sobre los contenidos afectados.

## 9. Responsabilidad y edición de programas

- **RF-047 — Edición de programas publicados:** Permitir al docente responsable editar programas publicados sin despublicarlos. Los cambios deberán reflejarse inmediatamente para los estudiantes.
- **RF-048 — Reasignación de responsables:** Permitir al administrador designar un nuevo responsable cuando el creador deje de estar asignado. El reemplazo deberá ser otro docente asignado a la misma materia, curso y división.
- **RF-049:** El sistema debe permitir registrar el historial de inscripciones de cada estudiante por año lectivo.
- **RF-050:** El sistema debe permitir consultar las inscripciones anteriores de cada estudiante.
- **RF-051:** El sistema debe asociar cada materia a un curso y una división específicos.
- **RF-052:** El sistema debe asociar cada programa a un único período académico.

## Consideraciones

- Cada requisito debe respetar las reglas de negocio correspondientes.
- Los permisos deben validarse en el backend.
- Las funcionalidades deben estar disponibles únicamente para los roles autorizados.
- Los cambios en los requisitos deben reflejarse en los documentos relacionados.