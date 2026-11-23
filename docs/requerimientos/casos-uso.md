# Casos de uso — ACADIX

## 1. Actores

- **Administrador:** gestiona docentes, estructura académica, períodos y responsables de programas.
- **Docente:** gestiona estudiantes y contenidos dentro de sus asignaciones.
- **Estudiante:** consulta programas publicados y materiales correspondientes.
- **Sistema:** valida permisos, procesa operaciones y almacena información.

# Casos de uso — ACADIX

## Acceso
- **CU-001 — Iniciar sesión:** El usuario ingresa sus credenciales y accede según su rol.
- **CU-002 — Cerrar sesión:** El usuario finaliza su sesión.

## Administrador
- **CU-003 — Gestionar docentes:** El administrador crea, consulta, modifica y desactiva cuentas de docentes.
- **CU-004 — Asignar docentes:** El administrador asigna docentes a materias, cursos y divisiones.
- **CU-005 — Reasignar responsable de programa:** El administrador designa a otro docente asignado cuando el responsable actual deja de estarlo.
- **CU-006 — Gestionar estructura académica:** El administrador crea y administra años lectivos, cursos, divisiones y materias.
- **CU-007 — Abrir y cerrar períodos:** El administrador habilita o cierra períodos académicos.

## Docente
- **CU-008 — Consultar asignaciones:** El docente consulta sus materias, cursos y divisiones asignados.
- **CU-009 — Crear programa:** al crear un programa, el docente debe seleccionar un único período académico.
- **CU-010 — Editar programa:** El docente responsable modifica el contenido de su programa mientras el período esté abierto. Puede hacerlo aunque esté publicado.
- **CU-011 — Publicar programa:** El docente responsable publica manualmente un programa para habilitar su consulta por los estudiantes.
- **CU-012 — Gestionar temas:** El docente responsable crea, modifica, ordena y elimina temas. La eliminación de un tema elimina también sus materiales.
- **CU-013 — Gestionar materiales:** El docente responsable sube, modifica y elimina archivos PDF de hasta 20 MB.
- **CU-014 — Eliminar programa:** El docente responsable elimina definitivamente un programa junto con sus temas y materiales.
- **CU-015 — Crear cuenta de estudiante:** al crear un estudiante, se debe registrar su inscripción en el año lectivo correspondiente, con curso y división.
- **CU-016 — Modificar cuenta de estudiante:** El docente modifica los datos permitidos de un estudiante bajo su ámbito de asignación, sin cambiar su rol.
- **CU-017 — Restablecer contraseña de estudiante:** El docente genera una contraseña temporal para un estudiante.

## Estudiante
- **CU-018 — Consultar materias:** El estudiante consulta las materias correspondientes a su curso y división.
- **CU-019 — Consultar programas publicados:** El estudiante consulta los programas publicados de sus materias.
- **CU-020 — Consultar y descargar materiales:** El estudiante accede a los temas y descarga sus archivos PDF.
- **CU-021 — Consultar períodos históricos:** El estudiante consulta contenidos de años y períodos anteriores en modo de solo lectura.
- **CU-022 — Consultar período de recuperación:** El estudiante consulta los contenidos publicados que le correspondan.

## Recuperación de contraseña
- **CU-023 — Recuperar contraseña por correo:** El usuario solicita un enlace para restablecer su contraseña.
- **CU-024 — Cambiar contraseña temporal:** El usuario que ingresó con una contraseña temporal debe establecer una nueva.

## Relaciones entre casos de uso
- **CU-009:** Permite continuar con la gestión de temas (CU-012) y materiales (CU-013).
- **CU-011:** La publicación habilita la consulta del programa por parte de los estudiantes (CU-019).
- **CU-019:** Permite acceder a los temas y materiales del programa (CU-020).
- **CU-012:** La eliminación de un tema incluye la eliminación de sus materiales.
- **CU-014:** La eliminación de un programa incluye la eliminación de sus temas y materiales.
- **CU-017:** El restablecimiento mediante contraseña temporal requiere el cambio de contraseña (CU-024).
- **CU-023:** Permite iniciar el proceso de recuperación mediante correo electrónico.
- **CU-005:** La reasignación cambia al docente responsable del programa cuando lo determina el administrador.
- **CU-025:** Consultar historial de inscripciones del estudiante.