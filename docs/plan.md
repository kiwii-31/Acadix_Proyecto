# PLAN — ACADIX

## 1. Objetivo y estado

Definir una propuesta técnica para implementar ACADIX a partir del SPEC y la documentación del proyecto.

Este plan corresponde a TASK-011. **Todavía no está aprobado**: debe revisarse en TASK-012. Las decisiones técnicas que no estén confirmadas se consideran propuestas, no reglas definitivas.

## 2. Arquitectura

ACADIX será una aplicación web para una sola institución. La arquitectura propuesta separa interfaz, lógica de negocio y datos:

- **Frontend:** React + Vite.
- **Backend:** Node.js + Express, mediante una API REST.
- **Base de datos:** PostgreSQL.
- **ORM:** Prisma.
- **Autenticación:** sesiones administradas por el servidor y cookies.
- **Archivos:** PDF almacenados en PostgreSQL mediante BYTEA, con un máximo de 20 MB por archivo.

El backend se organiza en middleware, controllers, services y repositories. Las reglas de negocio y los permisos se validan en el servidor; el frontend no reemplaza esos controles.

### Módulos principales

1. Autenticación y recuperación de acceso.
2. Usuarios y roles: administrador, docente y alumno.
3. Estructura académica: año, curso, división, materia y períodos.
4. Asignaciones de docentes.
5. Inscripciones anuales de alumnos.
6. Programas, temas y materiales PDF.
7. Consulta de contenidos actuales e históricos.

### Estructura de carpetas propuesta

```text
frontend/
  src/
    components/
    pages/
    services/
    hooks/
    context/
server/
  src/
    routes/
    controllers/
    services/
    repositories/
    middleware/
    validators/
prisma/
  schema.prisma
docs/
```

La estructura definitiva debe revisarse con las reglas de Cursor antes de implementarla.

## 3. Modelo de datos

Entidades principales propuestas:

- **Usuario:** datos de acceso, rol y estado.
- **Alumno:** información propia del alumno.
- **Inscripción:** vincula al alumno con un año lectivo, curso y división. Cada alumno puede tener una inscripción por año lectivo y conservar las anteriores.
- **Docente:** información propia del docente.
- **Curso y División:** estructura académica de la institución.
- **Materia:** pertenece a una combinación específica de curso y división; no se comparte automáticamente entre divisiones.
- **Asignación docente:** vincula docentes con materias y divisiones correspondientes.
- **Período:** representa cuatrimestres, bimestres o el período de recuperación, según la estructura académica que se termine de definir.
- **Programa:** pertenece a una materia y a un único período.
- **Tema:** pertenece a un programa.
- **Material:** PDF asociado a un tema.

### Relaciones y restricciones confirmadas

- El historial de inscripciones conserva el curso y la división de cada año lectivo.
- Cada materia corresponde a un curso y división específicos.
- Cada programa pertenece a un único período.
- Los programas se guardan como borradores y se publican manualmente.
- La eliminación de un programa elimina sus temas y materiales; la eliminación de un tema elimina sus materiales. La eliminación es definitiva.
- Los períodos cerrados no permiten modificaciones, pero sus contenidos publicados siguen disponibles para consulta histórica.

Los nombres definitivos de tablas, campos, índices y restricciones se definirán en el esquema de Prisma, respetando estas reglas.

## 4. Reglas principales del backend

- El administrador gestiona la estructura académica, los usuarios, las asignaciones y la apertura o cierre de períodos.
- Los docentes solo gestionan contenidos dentro de sus asignaciones y períodos habilitados.
- Solo el docente responsable de un programa puede editarlo y publicarlo. Inicialmente, el responsable es quien lo crea.
- Si el responsable pierde su asignación, el administrador elige a otro docente actualmente asignado para asumir la responsabilidad.
- Los docentes pueden editar programas publicados; los cambios se reflejan en la consulta de los alumnos.
- Los alumnos consultan los contenidos publicados correspondientes a sus inscripciones actuales y anteriores.
- El servidor valida sesión, rol, asignaciones, período y pertenencia de cada recurso antes de permitir una operación.

### Endpoints orientativos

La API puede agruparse bajo `/api`:

- `/auth`: inicio y cierre de sesión, recuperación y cambio de contraseña.
- `/usuarios`: administración de cuentas y datos de alumnos/docentes.
- `/estructura`: años, cursos, divisiones, materias y períodos.
- `/asignaciones`: asignaciones y responsables docentes.
- `/inscripciones`: inscripción anual e historial del alumno.
- `/programas`: creación, edición, publicación y consulta.
- `/temas`: gestión de temas de un programa.
- `/materiales`: carga, consulta y descarga de PDF.

Los métodos y rutas definitivos se establecerán durante el diseño detallado de cada módulo.

## 5. Interfaz

La interfaz se adapta al rol:

- **Administrador:** panel de gestión de usuarios, estructura académica, períodos y asignaciones.
- **Docente:** materias asignadas, programas, temas y materiales.
- **Alumno:** materias y contenidos publicados del año actual, con acceso al historial de años anteriores en modo de consulta.

Las pantallas deben contemplar estados de carga, errores, confirmaciones para eliminaciones y validaciones de formularios. La navegación no debe mostrar acciones que el rol no puede realizar, aunque la autorización siempre se controla también en el servidor.

## 6. Seguridad y archivos

- Acceso privado; no hay registro público.
- Sesiones administradas por el servidor y cookies seguras en producción.
- Contraseñas almacenadas mediante hash seguro.
- Cambio obligatorio de contraseña temporal en el primer ingreso.
- Validación de permisos en cada operación del backend.
- Validación de tipo, tamaño y contenido de los PDF; límite de 20 MB.
- No exponer contraseñas, hashes, datos internos ni errores técnicos al usuario.
- HTTPS en el entorno publicado.

## 7. Orden de implementación propuesto

1. Preparar repositorio, entorno, estructura y conexión con PostgreSQL/Prisma.
2. Crear el modelo de datos y sus relaciones.
3. Implementar autenticación, sesiones, roles y permisos.
4. Implementar estructura académica, períodos y asignaciones.
5. Implementar usuarios e inscripciones anuales con historial.
6. Implementar programas, temas, materiales y publicación.
7. Implementar las pantallas específicas para cada rol.
8. Integrar módulos y realizar pruebas funcionales, de permisos y de seguridad.
9. Preparar el despliegue y verificar el funcionamiento en el hosting elegido.

Este orden es una propuesta del arquitecto y queda sujeto a TASK-012.

## 8. Temas pendientes

Antes de cerrar el diseño detallado, hay que definir o confirmar:

- Si los bimestres dependen de los cuatrimestres y qué tipos de período pueden contener programas.
- Cómo se resuelve la diferencia documental entre “docente creador” y “docente responsable” al reasignar un programa. La regla vigente establece que puede editar el responsable actual.
- Qué datos personales se solicitan a alumnos y docentes y qué campos de correo son obligatorios.
- Qué ocurre al desactivar docentes, eliminar asignaciones o modificar la estructura académica.
- Si se permiten varios programas para la misma materia y período.
- Cómo se entregan las contraseñas temporales y qué proveedor de correo se utilizará.
- Qué proveedor de hosting gratuito se elegirá y cuáles serán sus límites.
- Qué herramientas y criterios se usarán para las pruebas.
- Ajustar las reglas de Cursor a la estructura de carpetas que finalmente se apruebe.

Estas cuestiones no deben resolverse por suposición: se documentarán como decisiones cuando se acuerden.

## 9. Documentación relacionada

Este plan se basa en `SPEC.md`, `decisiones.md`, `reglas-negocio.md`, `requisitos-funcionales.md`, `requisitos-no-funcionales.md`, `historias-usuario.md`, `casos-uso.md`, `glosario.md` y `preguntas-abiertas.md`.

Las decisiones DEC-035 a DEC-037 y las reglas RN-030 a RN-032 quedan reflejadas en el modelo de datos y las relaciones de este plan. Los requisitos RF-049 a RF-052 y las historias HU-025 y HU-026 deben contemplarse en la implementación.

---

**Estado:** propuesta técnica pendiente de revisión y aprobación en TASK-012.
