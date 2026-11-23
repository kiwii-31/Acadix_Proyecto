# SPEC — ACADIX

## 1. Descripción
ACADIX es una plataforma web educativa para centralizar y organizar programas académicos y materiales de estudio de una institución.

## 2. Objetivo
Facilitar la administración de contenidos por parte de los docentes y el acceso organizado de los estudiantes a sus materiales.

## 3. Alcance
La primera versión estará destinada a una única institución e incluirá:
- Autenticación y gestión de usuarios.
- Roles y permisos.
- Administración de la estructura académica.
- Gestión de años y períodos.
- Gestión de programas, temas y materiales PDF.
- Consulta de contenidos publicados e históricos.

Quedan excluidas las calificaciones, entregas de trabajos, evaluaciones internas y contenidos de audio o video.

## 4. Actores y permisos

### Administrador
- Crear y gestionar cuentas de docentes.
- Gestionar años lectivos, cursos, divisiones y materias.
- Asignar docentes a materias, cursos y divisiones.
- Abrir y cerrar períodos académicos.
- Reasignar responsables de programas cuando corresponda.

### Docente
- Consultar sus asignaciones.
- Crear programas como borradores.
- Editar y publicar programas de los que sea responsable.
- Gestionar temas y materiales de sus programas.
- Crear y gestionar cuentas de estudiantes de sus cursos y divisiones asignados.
- Restablecer contraseñas de estudiantes.

### Estudiante
- Consultar sus materias.
- Consultar programas publicados.
- Acceder y descargar materiales PDF.
- Consultar períodos y años anteriores en modo de solo lectura.

## 5. Organización académica

La información seguirá esta jerarquía:

Institución → Año lectivo → Curso → División → Materia → Período → Programa → Tema → Material.

Cada año lectivo tendrá:
- Dos cuatrimestres.
- Cuatro bimestres.
- Un período especial de recuperación entre diciembre y febrero.

Cada materia estará asociada a un curso y una división específicos.

Cada estudiante tendrá una inscripción por año lectivo, vinculada a su curso y división. El historial se conservará para permitir consultar los contenidos de años anteriores.

Los años anteriores se conservarán para consulta histórica.

## 6. Programas y contenidos
- Cada programa pertenece a una materia, curso, división y un único período académico.
- Los programas se crean como borradores.
- La publicación es manual y permite su consulta por estudiantes.
- Solo el responsable actual puede modificar y publicar el programa.
- Inicialmente, el creador es el responsable.
- El administrador puede designar otro docente asignado como responsable.
- Los programas publicados pueden editarse sin despublicarlos.
- Los cambios se reflejan inmediatamente para los estudiantes.
- Cada programa contiene temas y cada tema puede contener materiales.
- Los materiales serán exclusivamente PDF de hasta 20 MB.

## 7. Reglas de eliminación
- Eliminar un programa elimina definitivamente sus temas y materiales.
- Eliminar un tema elimina definitivamente sus materiales.
- Eliminar un material afecta únicamente a ese archivo y su registro.

Las eliminaciones requieren confirmación.

## 8. Períodos y permisos
- Solo el administrador puede abrir y cerrar períodos.
- Los docentes gestionan contenido únicamente dentro de sus asignaciones.
- La modificación de contenido requiere que el período esté abierto.
- Los períodos cerrados y los históricos son de solo lectura.
- Los estudiantes acceden a contenidos correspondientes a sus inscripciones, cursos, divisiones y materias.
- Los estudiantes únicamente consultan programas publicados.

## 9. Cuentas y autenticación
- No habrá registro público.
- El administrador crea cuentas de docentes.
- Los docentes crean y gestionan cuentas de estudiantes dentro de sus asignaciones.
- Los docentes no pueden modificar los roles.
- La recuperación de contraseñas puede realizarse mediante enlace por correo o contraseña temporal.
- Las contraseñas temporales deben cambiarse en el siguiente inicio de sesión.

## 10. Requisitos técnicos
- Lenguaje: JavaScript.
- Frontend: React + Vite.
- Backend: Node.js + Express.
- Base de datos: PostgreSQL.
- ORM: Prisma.
- Autenticación: sesiones tradicionales administradas por el servidor.
- Archivos: almacenamiento directo en PostgreSQL mediante BYTEA.
- Despliegue inicial: hosting gratuito con posible suspensión por inactividad.

## 11. Requisitos de calidad
El sistema deberá:
- Validar permisos y reglas de negocio en el backend.
- Proteger contraseñas y sesiones.
- Mantener privados los materiales.
- Adaptarse a computadoras, tablets y celulares.
- Mostrar mensajes claros de error y confirmación.
- Mantener una arquitectura modular y documentada.
- Contar con pruebas funcionales y de seguridad.

## 12. Documentación de referencia
- `idea.md`
- `decisiones.md`
- `glosario.md`
- `preguntas-abiertas.md`
- `reglas-negocio.md`
- `requisitos-funcionales.md`
- `requisitos-no-funcionales.md`
- `historias-usuario.md`
- `casos-uso.md`

Estos documentos contienen el detalle de las reglas, requisitos y criterios que deben respetarse durante el desarrollo.

## 13. Restricciones
- Una sola institución en la primera versión.
- Acceso privado mediante cuentas autorizadas.
- Archivos PDF de hasta 20 MB.
- Sin integración con sistemas escolares externos.
- Sin funcionalidades fuera del alcance aprobado.

## 14. Criterio general de aceptación
ACADIX se considerará funcional cuando cada rol pueda realizar sus operaciones autorizadas, se respeten las reglas de negocio, los estudiantes accedan correctamente a sus contenidos y la aplicación esté desplegada y disponible para su utilización.