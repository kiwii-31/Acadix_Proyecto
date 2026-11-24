# ACADIX

**Sistema web de gestión y consulta de materiales educativos.**

## EQUIPO
- Laura Martinez
- Emanuel Flores
- Elmer Flores Arce
- Andrew Talavera
- Leandro Vilchez

## Descripción

ACADIX es una aplicación web desarrollada para organizar y centralizar los materiales educativos de una institución escolar.

El sistema permite que los docentes publiquen programas de estudio, organicen sus contenidos en temas y adjunten materiales en formato PDF. Los estudiantes pueden consultar esos contenidos desde una misma plataforma, tanto del ciclo lectivo actual como de años anteriores.

Además, cuenta con un panel de administración para gestionar la estructura académica, los usuarios y las asignaciones docentes.

## Objetivos

- Centralizar los materiales educativos de la institución.
- Facilitar el acceso de los estudiantes a los contenidos de cada materia.
- Permitir que los docentes organicen y actualicen sus programas.
- Mantener organizada la información académica por año, curso, división y materia.
- Conservar el acceso a materiales de años lectivos anteriores.

## Funcionalidades

### Administrador

- Gestionar usuarios y sus estados de actividad.
- Crear y administrar años lectivos, cursos y divisiones.
- Crear y administrar materias.
- Asignar docentes a las materias.
- Gestionar los períodos académicos y sus estados de apertura y cierre.
- Transferir la responsabilidad de programas cuando se elimina una asignación docente.

### Docente

- Consultar las materias que tiene asignadas.
- Crear programas de estudio.
- Guardar programas como borradores y publicarlos cuando estén listos.
- Organizar los programas mediante temas.
- Adjuntar materiales educativos en formato PDF.
- Editar los programas y sus contenidos.
- Eliminar programas, temas y materiales según los permisos correspondientes.

### Estudiante

- Consultar los programas publicados de sus materias.
- Acceder a los temas y materiales disponibles.
- Descargar archivos PDF.
- Consultar materiales de sus inscripciones de años anteriores.

## Organización académica

La información se organiza de la siguiente manera:

**Año lectivo → Curso → División → Materia → Período académico → Programa → Tema → Material**

Los períodos académicos contemplan dos cuatrimestres, cuatro bimestres y un período de recuperatorio.

## Tecnologías utilizadas
- Frontend: React
- Backend: Node.js y Express
- Base de datos: PostgreSQL
- ORM: Prisma
- Despliegue del frontend:Vercel
- Despliegue del backend: Render
- Base de datos alojada en Neon
- Control de versiones: Git y GitHub

## Acceso a la aplicación

La aplicación se encuentra desplegada y puede utilizarse desde un navegador, sin necesidad de instalar el proyecto localmente.

- **Aplicación web:** https://acadix-proyecto-seven.vercel.app/

Para ingresar se necesita una cuenta habilitada. Las cuentas de prueba y sus respectivos roles se facilitarán por separado.
- ADMINISTRADOR: Gmail: admin.prueba@gmail.com y Contraseña: Admin.Prueba12345
- DOCENTE: Gmail: docente.prueba@acadix.com y Contraseña: Docente12345
- ESTUDIANTE: Gmail: alumno.prueba@acadix.com y Contraseña: Alumno.prueba123

## Consideraciones

- El acceso a las funcionalidades depende del rol del usuario.
- Los programas se crean como borradores y deben publicarse para que los estudiantes puedan consultarlos.
- Los docentes solo pueden administrar programas de materias que tienen asignadas y sobre los que tienen la responsabilidad correspondiente.
- Los períodos académicos deben estar abiertos para realizar las operaciones docentes que dependen de ellos.
- Los materiales se admiten en formato PDF, con un tamaño máximo de 20 MB.
- Los materiales se almacenan en la base de datos.
