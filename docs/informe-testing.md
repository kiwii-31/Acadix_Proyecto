# Informe de Testing – ACADIX

## 1. Objetivo

Documentar las pruebas realizadas sobre ACADIX para comprobar el funcionamiento de sus principales funcionalidades, las validaciones y el acceso según los roles de usuario.

## 2. Pruebas funcionales

| IDn   | Qué se probó                                       | Comportamiento esperado                                                                           | Resultado obtenido                                                              | Estado   |
| ----- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------- |
| TF-01 | Gestión de usuarios, cursos, divisiones y materias | Permitir al administrador crear y gestionar los registros.                                        | Las operaciones se realizaron correctamente.                                    | Aprobada |
| TF-02 | Asignaciones docentes                              | Permitir gestionar las asignaciones de docentes a materias, cursos y divisiones.                  | Las asignaciones funcionaron correctamente.                                     | Aprobada |
| TF-03 | Generación de períodos académicos                  | Generar dos cuatrimestres, cuatro bimestres y un período de recuperatorio.                        | La estructura se generó correctamente.                                          | Aprobada |
| TF-04 | Creación y edición de programas                    | Permitir al docente crear programas en borrador y modificarlos.                                   | Las operaciones funcionaron correctamente.                                      | Aprobada |
| TF-05 | Publicación de programas                           | Permitir publicar un programa y mostrarlo a los estudiantes correspondientes.                     | El programa publicado apareció correctamente en el panel del estudiante.        | Aprobada |
| TF-06 | Gestión de temas                                   | Permitir crear, editar y numerar temas automáticamente.                                           | Las operaciones funcionaron correctamente.                                      | Aprobada |
| TF-07 | Eliminación de temas                               | Eliminar el tema y sus materiales asociados.                                                      | Se eliminaron correctamente el tema y sus materiales.                           | Aprobada |
| TF-08 | Carga de materiales PDF                            | Permitir subir archivos PDF válidos de hasta 20 MB.                                               | Los archivos válidos se guardaron correctamente.                                | Aprobada |
| TF-09 | Validación de archivos                             | Rechazar archivos que no sean PDF o superen los 20 MB.                                            | Los archivos inválidos fueron rechazados tanto en frontend como en backend.     | Aprobada |
| TF-10 | Descarga y eliminación de materiales               | Permitir abrir, descargar y eliminar materiales individuales.                                     | Las operaciones funcionaron correctamente.                                      | Aprobada |
| TF-11 | Consulta de materiales por estudiantes             | Mostrar los materiales de programas publicados correspondientes a sus inscripciones.              | Los estudiantes pudieron consultar y descargar los materiales correspondientes. | Aprobada |
| TF-12 | Materias actuales e historial                      | Mostrar las materias del año actual y permitir consultar las de años anteriores.                  | La información se mostró correctamente según las inscripciones.                 | Aprobada |
| TF-13 | Consulta de temas actuales e históricos            | Permitir consultar los temas de programas publicados de las divisiones y años correspondientes.   | La consulta funcionó correctamente.                                             | Aprobada |
| TF-14 | Recorrido completo docente-estudiante              | Permitir crear un programa, agregar temas y materiales, publicarlo y consultarlo como estudiante. | El recorrido completo se realizó correctamente.                                 | Aprobada |

## 3. Pruebas de seguridad y acceso

Se comprobó el acceso a las distintas secciones utilizando cuentas con diferentes roles.

| ID    | Qué se probó                                  | Comportamiento esperado                                      | Resultado obtenido                      | Estado   |
| ----- | --------------------------------------------- | ------------------------------------------------------------ | --------------------------------------- | -------- |
| TS-01 | Docente intentando acceder a `/admin`         | Bloquear el acceso y redirigir al inicio correspondiente.    | El acceso fue bloqueado.                | Aprobada |
| TS-02 | Estudiante intentando acceder a `/admin`      | Bloquear el acceso y redirigir al inicio correspondiente.    | El acceso fue bloqueado.                | Aprobada |
| TS-03 | Estudiante intentando acceder a `/teacher`    | Bloquear el acceso y redirigir al inicio correspondiente.    | El acceso fue bloqueado.                | Aprobada |
| TS-04 | Administrador accediendo a `/admin`           | Permitir el acceso al panel administrativo.                  | El acceso funcionó correctamente.       | Aprobada |
| TS-05 | Docente intentando acceder a `/student`       | Impedir el acceso a una sección de otro rol.                 | Fue redirigido a su propio inicio.      | Aprobada |
| TS-06 | Administrador intentando acceder a `/teacher` | Impedir el acceso a una sección que no corresponde a su rol. | Fue redirigido al panel administrativo. | Aprobada |
| TS-07 | Administrador intentando acceder a `/student` | Impedir el acceso a una sección que no corresponde a su rol. | Fue redirigido al panel administrativo. | Aprobada |

**Aclaración:** estas pruebas verificaron la navegación y las restricciones visibles desde el frontend. No representan una auditoría completa de seguridad del backend.

## 4. Pruebas de caja negra

Se realizaron pruebas de caja negra sobre las funcionalidades del sistema, comprobando las entradas, las respuestas y los resultados observables sin analizar el código interno durante la ejecución.

Las pruebas realizadas fueron satisfactorias. Se corrigieron los errores encontrados durante el desarrollo y se volvieron a comprobar las funcionalidades afectadas.

## 5. Resultado general

Las pruebas documentadas finalizaron correctamente. Se verificaron las principales operaciones de administración, gestión de programas, temas y materiales, consulta de información por parte de estudiantes y restricciones de acceso según los roles.

Durante el desarrollo se encontraron errores que fueron corregidos y posteriormente comprobados.

**Conclusión:** ACADIX cumple con el funcionamiento esperado en las funcionalidades que fueron probadas. Las pruebas permitieron comprobar el recorrido principal del sistema desde la administración hasta la consulta de materiales por parte de los estudiantes.
