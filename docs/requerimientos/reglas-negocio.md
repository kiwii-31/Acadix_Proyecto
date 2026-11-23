# Reglas de negocio — ACADIX

## Usuarios y permisos

- **RN-001:** El administrador crea cuentas de docentes; los docentes crean y gestionan cuentas de estudiantes.
- **RN-002:** Cada usuario tiene un único rol: administrador, docente o estudiante.
- **RN-003:** Los docentes gestionan únicamente estudiantes de sus cursos y divisiones asignados. No pueden modificar roles.
- **RN-004:** Un docente puede tener varias asignaciones de materia, curso y división.
- **RN-005:** Cada usuario solo puede acceder a las funciones y datos autorizados para su rol y asignaciones.

## Organización académica

- **RN-006:** El contenido se organiza por año lectivo, curso, división, materia y período.
- **RN-007:** Cada año lectivo tiene dos cuatrimestres, cuatro bimestres y un período especial de recuperación entre diciembre y febrero.
- **RN-008:** Cada año lectivo es independiente; los anteriores se conservan para consulta histórica.
- **RN-009:** Solo el administrador gestiona la estructura académica y abre o cierra períodos.
- **RN-010:** Los docentes gestionan contenido únicamente dentro de sus asignaciones y en períodos habilitados.

## Programas y contenidos

- **RN-011:** Cada programa pertenece a una materia, curso, división y período.
- **RN-012:** Los programas se crean como borradores y requieren publicación manual.
- **RN-013:** Los estudiantes solo pueden consultar programas publicados.
- **RN-014:** Solo el docente responsable puede modificar un programa. Inicialmente, el responsable es quien lo crea; si deja de estar asignado, el administrador puede designar a otro docente asignado.
- **RN-015:** Si el responsable deja de estar asignado, el administrador selecciona al nuevo responsable entre los docentes asignados a esa materia, curso y división.
- **RN-016:** El docente responsable puede editar programas publicados sin despublicarlos. Los cambios se reflejan inmediatamente para los estudiantes.
- **RN-017:** Cada tema pertenece a un programa y cada material pertenece a un tema.
- **RN-018:** Solo se permiten archivos PDF de hasta 20 MB.

## Eliminación y consulta

- **RN-019:** Eliminar un programa elimina definitivamente sus temas y materiales asociados.
- **RN-020:** Eliminar un tema elimina definitivamente sus materiales asociados.
- **RN-021:** Eliminar un material afecta únicamente a ese material y su archivo.
- **RN-022:** Los estudiantes solo consultan contenidos correspondientes a sus materias, cursos y divisiones.
- **RN-023:** Los períodos cerrados y los años anteriores son de solo lectura.
- **RN-024:** Los estudiantes pueden consultar los contenidos publicados del período de recuperación que les correspondan.

## Seguridad

- **RN-025:** El backend valida los permisos y las reglas de negocio en cada operación.
- **RN-026:** Los materiales requieren autenticación y autorización para accederse.
- **RN-027:** Las contraseñas se almacenan mediante mecanismos seguros de hash, nunca en texto plano.
- **RN-028:** Las contraseñas temporales deben cambiarse en el siguiente inicio de sesión.
- **RN-029:** La recuperación asistida de contraseñas la realiza el administrador para docentes y los docentes para estudiantes.
- **RN-030:** Cada estudiante tendrá una inscripción por año lectivo, con su curso y división.
- **RN-031:** Cada materia estará asociada a un curso y una división específicos.
- **RN-032:** Cada programa pertenecerá a un único período académico.
