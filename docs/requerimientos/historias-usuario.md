# Historias de usuario – ACADIX

## 1. Introducción

Este documento reúne las historias de usuario de ACADIX. Cada historia representa una necesidad de un usuario dentro del sistema y describe qué quiere realizar y para qué.

Las historias se organizan según los tres roles principales de la plataforma:

- Administrador.
- Profesor.
- Alumno.

Cada historia incluye criterios de aceptación que permiten determinar cuándo se considera correctamente implementada.

# Historias de usuario — ACADIX

## Acceso
- **HU-001 — Iniciar sesión:** Como usuario, quiero iniciar sesión para acceder a las funciones correspondientes a mi rol.
- **HU-002 — Cerrar sesión:** Como usuario, quiero cerrar mi sesión para proteger mi cuenta.

## Administrador
- **HU-003 — Gestionar docentes:** Como administrador, quiero crear, consultar, modificar y desactivar cuentas de docentes.
- **HU-004 — Asignar docentes:** Como administrador, quiero asignar docentes a materias, cursos y divisiones.
- **HU-005 — Gestionar estructura académica:** Como administrador, quiero crear y administrar años lectivos, cursos, divisiones y materias.
- **HU-006 — Gestionar períodos:** Como administrador, quiero abrir y cerrar períodos académicos para controlar cuándo se puede modificar su contenido.
- **HU-007 — Reasignar responsables:** Como administrador, quiero designar a otro docente asignado como responsable de un programa cuando su creador deje de estar asignado.

## Docente
- **HU-008 — Consultar asignaciones:** Como docente, quiero consultar las materias, cursos y divisiones que tengo asignados.
- **HU-009 — Crear programas:** Como docente, quiero crear programas para mis materias y divisiones, guardándolos inicialmente como borradores.
- **HU-010 — Editar programas:** Como docente responsable, quiero modificar mi programa, incluso después de publicarlo, siempre que el período esté abierto.
- **HU-011 — Publicar programas:** Como docente responsable, quiero publicar manualmente un programa para que los estudiantes puedan consultarlo.
- **HU-012 — Gestionar temas:** Como docente responsable, quiero crear, modificar, ordenar y eliminar los temas de un programa. Al eliminar un tema, también se eliminan sus materiales.
- **HU-013 — Gestionar materiales:** Como docente responsable, quiero subir, modificar y eliminar materiales PDF de los temas, respetando el límite de 20 MB por archivo.
- **HU-014 — Eliminar programas:** Como docente responsable, quiero eliminar un programa y todos sus temas y materiales asociados.
- **HU-015 — Crear cuentas de estudiantes:** Como docente, quiero crear cuentas para estudiantes de los cursos y divisiones que tengo asignados.
- **HU-016 — Modificar cuentas de estudiantes:** Como docente, quiero actualizar los datos permitidos de los estudiantes que tengo asignados, sin modificar sus roles.
- **HU-017 — Restablecer contraseñas:** Como docente, quiero generar una contraseña temporal para un estudiante que necesite recuperar el acceso.
- **HU-026:** Como docente, quiero seleccionar un único período académico al crear un programa para organizar correctamente sus contenidos.

## Estudiante
- **HU-018 — Consultar materias:** Como estudiante, quiero ver las materias correspondientes a mi curso y división.
- **HU-019 — Consultar programas:** Como estudiante, quiero consultar los programas publicados de mis materias.
- **HU-020 — Consultar materiales:** Como estudiante, quiero acceder a los temas y descargar sus materiales PDF.
- **HU-021 — Consultar períodos históricos:** Como estudiante, quiero consultar contenidos de años y períodos anteriores en modo de solo lectura.
- **HU-022 — Consultar período de recuperación:** Como estudiante, quiero acceder a los contenidos publicados del período de recuperación que me correspondan.
- **HU-025:** Como estudiante, quiero consultar mi historial de inscripciones para acceder a los contenidos de mis años anteriores.

## Todos los usuarios
- **HU-023 — Recuperar contraseña por correo:** Como usuario, quiero recibir un enlace de recuperación para restablecer mi contraseña.
- **HU-024 — Cambiar contraseña temporal:** Como usuario que ingresó con una contraseña temporal, quiero establecer una nueva contraseña para continuar usando mi cuenta.