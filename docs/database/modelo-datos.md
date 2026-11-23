# Modelo de datos – ACADIX

## 1. Descripción

ACADIX utiliza PostgreSQL como sistema de gestión de base de datos y Prisma ORM para definir los modelos, relaciones y operaciones sobre los datos.

La base de datos organiza la información de usuarios, estructura académica, inscripciones, asignaciones docentes y materiales educativos.

## 2. Entidades principales

### User

Almacena los datos generales de los usuarios.

- `id`: identificador único.
- `email`: correo electrónico único.
- `passwordHash`: contraseña almacenada mediante hash.
- `firstName`: nombre.
- `lastName`: apellido.
- `role`: rol del usuario.
- `isActive`: estado de la cuenta.
- `createdAt` y `updatedAt`: fechas de registro y actualización.

Roles disponibles: ADMIN, TEACHER y STUDENT.

### Student

Representa el perfil de un estudiante asociado a un usuario.

- `id`: identificador.
- `userId`: usuario relacionado.

Un estudiante puede tener varias inscripciones correspondientes a distintos años lectivos.

### Teacher

Representa el perfil de un docente asociado a un usuario.

- `id`: identificador.
- `userId`: usuario relacionado.

Se relaciona con sus asignaciones y con los programas que creó o de los que es responsable.

### AcademicYear

Representa un año lectivo.

- `id`: identificador.
- `name`: nombre único.
- `startDate`: fecha de inicio.
- `endDate`: fecha de finalización.
- `createdAt`: fecha de creación.

Contiene cursos, períodos académicos e inscripciones.

### Course

Representa un curso dentro de un año lectivo.

- `id`: identificador.
- `name`: nombre.
- `order`: orden del curso.
- `academicYearId`: año lectivo relacionado.

El nombre y el orden no pueden repetirse dentro del mismo año lectivo.

### Division

Representa una división perteneciente a un curso.

- `id`: identificador.
- `name`: nombre.
- `courseId`: curso relacionado.

Cada división puede tener materias e inscripciones.

### Enrollment

Representa la inscripción de un estudiante en un año lectivo y una división.

- `id`: identificador.
- `studentId`: estudiante.
- `academicYearId`: año lectivo.
- `divisionId`: división.
- `createdAt`: fecha de inscripción.

Un estudiante no puede tener más de una inscripción por año lectivo.

### Subject

Representa una materia perteneciente a una división.

- `id`: identificador.
- `name`: nombre.
- `divisionId`: división relacionada.

Una materia no puede repetirse dentro de la misma división.

### TeacherAssignment

Relaciona docentes con materias.

- `id`: identificador.
- `teacherId`: docente.
- `subjectId`: materia.
- `createdAt`: fecha de asignación.

Un docente no puede tener dos asignaciones duplicadas a la misma materia.

### AcademicPeriod

Representa un período académico.

- `id`: identificador.
- `name`: nombre.
- `type`: tipo de período.
- `status`: estado.
- `academicYearId`: año lectivo.
- `parentId`: cuatrimestre al que pertenece, cuando corresponde.

Tipos disponibles:

- CUATRIMESTER
- BIMESTER
- RECOVERY

Estados disponibles:

- OPEN
- CLOSED

Los períodos pueden tener una relación jerárquica: un cuatrimestre puede contener bimestres.

### Program

Representa un programa de contenidos de una materia.

- `id`: identificador.
- `title`: título.
- `description`: descripción opcional.
- `status`: estado del programa.
- `subjectId`: materia.
- `periodId`: período académico.
- `creatorTeacherId`: docente creador.
- `responsibleTeacherId`: docente responsable.
- `createdAt`: fecha de creación.
- `updatedAt`: fecha de actualización.
- `publishedAt`: fecha de publicación.

Estados disponibles:

- DRAFT
- PUBLISHED

Cada programa pertenece a una materia y a un período académico. Se registra quién lo creó y quién es responsable de administrarlo.

### Topic

Representa un tema dentro de un programa.

- `id`: identificador.
- `title`: título.
- `description`: descripción opcional.
- `order`: posición dentro del programa.
- `programId`: programa relacionado.

El orden de los temas no puede repetirse dentro del mismo programa.

### Material

Representa un material educativo asociado a un tema.

- `id`: identificador.
- `title`: título.
- `description`: descripción opcional.
- `fileName`: nombre del archivo.
- `mimeType`: tipo de archivo.
- `sizeBytes`: tamaño en bytes.
- `fileData`: contenido binario del archivo.
- `topicId`: tema relacionado.
- `createdAt`: fecha de creación.

Los archivos admitidos son PDF de hasta 20 MB.

## 3. Relaciones entre entidades

- Un usuario puede tener un perfil de estudiante o docente.
- Un estudiante puede tener varias inscripciones.
- Un docente puede tener varias asignaciones y programas.
- Un año lectivo contiene cursos, períodos e inscripciones.
- Un curso contiene divisiones.
- Una división contiene materias e inscripciones.
- Una materia puede tener varias asignaciones docentes y programas.
- Un período académico puede contener otros períodos.
- Un programa pertenece a una materia y un período.
- Un programa contiene varios temas.
- Un tema contiene varios materiales.

## 4. Reglas de integridad

La base de datos establece restricciones para evitar registros duplicados:

- El correo electrónico de cada usuario es único.
- El nombre de cada año lectivo es único.
- El nombre y el orden de los cursos son únicos dentro de un año lectivo.
- El nombre de una división es único dentro de un curso.
- Cada estudiante tiene una sola inscripción por año lectivo.
- El nombre de una materia es único dentro de una división.
- Un docente no puede repetir una asignación a la misma materia.
- El nombre de un período es único dentro de un año lectivo.
- El orden de los temas es único dentro de un programa.

También se utilizan relaciones entre tablas para mantener la integridad referencial.

## 5. Eliminación de registros relacionados

Se definen eliminaciones en cascada en determinadas relaciones:

- Al eliminar un usuario, se elimina su perfil de estudiante o docente.
- Al eliminar una asignación, se elimina la relación correspondiente.
- Al eliminar una materia, se eliminan sus asignaciones docentes.
- Al eliminar un programa, se eliminan sus temas.
- Al eliminar un tema, se eliminan sus materiales.

## 6. Almacenamiento de archivos

Los materiales se guardan directamente en PostgreSQL mediante el tipo binario `Bytes`, que se corresponde con `BYTEA`.

Además del contenido del archivo, se conservan sus datos descriptivos para identificarlo y permitir su descarga.
