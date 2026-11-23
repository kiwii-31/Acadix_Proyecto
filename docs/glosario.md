# ACADIX — Glosario

Este documento define los términos utilizados en el proyecto ACADIX. Su objetivo es mantener un lenguaje común durante el análisis, la documentación y el desarrollo.

## 1. Conceptos generales

**ACADIX:** Plataforma web educativa destinada a centralizar y organizar temarios y materiales de estudio de una institución educativa.

**EdTech:** Sector que utiliza tecnología para mejorar los procesos de enseñanza, aprendizaje y gestión educativa.

**Módulo:** Parte independiente de la plataforma que agrupa funcionalidades relacionadas.

**Usuario:** Persona que tiene una cuenta y puede acceder a la plataforma según sus permisos.

**Rol:** Conjunto de permisos que determina qué acciones puede realizar un usuario.

## 2. Organización académica

**Institución:** Establecimiento educativo al que pertenece la información administrada por ACADIX.

**Curso:** Nivel o año académico al que pertenece un grupo de estudiantes.

**División:** Grupo específico dentro de un curso, identificado mediante una letra, número u otra denominación.

**Materia:** Asignatura que forma parte de la estructura académica.

**Asignación docente:** Relación que indica qué docente está a cargo de una materia para un curso y división determinados.

**Período académico:** División temporal del ciclo lectivo en la que se organizan los contenidos.

## 3. Contenidos educativos

**Temario:** Conjunto organizado de contenidos correspondientes a una materia y un período académico.

**Tema:** Unidad o apartado que forma parte de un temario.

**Material educativo:** Recurso utilizado para acompañar el estudio de un tema o contenido.

**Documento PDF:** Archivo en formato PDF que puede adjuntarse a un temario o tema para su consulta.

**Publicación:** Acción mediante la cual un docente pone contenidos a disposición de los estudiantes.

**Período habilitado:** Período académico cuyos contenidos se encuentran disponibles para la consulta de los estudiantes.

**Período cerrado:** Período que ya no permite determinadas modificaciones o publicaciones, según las reglas del sistema.

## 4. Usuarios y permisos

**Administrador:** Usuario responsable de gestionar la estructura institucional y las cuentas y asignaciones correspondientes.

**Docente:** Usuario que administra los temarios y materiales de las materias que tiene asignadas.

**Estudiante:** Usuario que consulta los contenidos disponibles de las materias correspondientes a su curso y división.

**Autenticación:** Proceso mediante el cual se verifica la identidad de un usuario al ingresar.

**Autorización:** Control que determina si un usuario tiene permiso para realizar una acción o acceder a un recurso.

## 5. Conceptos técnicos

**Frontend:** Parte de la aplicación con la que interactúa directamente el usuario.

**Backend:** Parte del sistema que procesa las solicitudes, aplica las reglas de negocio y administra la información.

**API REST:** Interfaz que permite la comunicación entre aplicaciones mediante solicitudes HTTP.

**Endpoint:** Ruta específica de la API que permite ejecutar una operación.

**Base de datos:** Sistema utilizado para almacenar y organizar la información de ACADIX.

**Entidad:** Elemento del sistema que representa un concepto y cuyos datos se almacenan en la base de datos.

**Relación:** Asociación entre dos o más entidades.

**CRUD:** Operaciones de crear, consultar, actualizar y eliminar información.

**Controller:** Capa que recibe las solicitudes y coordina su procesamiento.

**Service:** Capa donde se implementa la lógica de negocio.

**Repository:** Capa responsable del acceso y la comunicación con la base de datos.

**Middleware:** Función que interviene durante el procesamiento de una solicitud, por ejemplo, para verificar la autenticación o los permisos.

## 6. Análisis y desarrollo

**Requisito funcional (RF):** Descripción de una funcionalidad que el sistema debe ofrecer.

**Requisito no funcional (RNF):** Condición de calidad o restricción que debe cumplir el sistema.

**Regla de negocio (RN):** Condición que determina cómo debe comportarse el sistema ante una situación específica.

**Historia de usuario (HU):** Descripción de una necesidad desde la perspectiva de un usuario, acompañada de criterios de aceptación.

**Criterio de aceptación:** Condición verificable que debe cumplirse para considerar terminada una historia de usuario.

**SPEC:** Documento que reúne la especificación del comportamiento esperado del sistema.

**PLAN:** Documento que define la arquitectura y la estrategia técnica de desarrollo.

**TASK:** Documento que organiza el trabajo en tareas concretas.

**Dependencia:** Relación entre tareas o funcionalidades que determina qué debe completarse antes de comenzar otra.

**Testing:** Proceso de comprobar que el sistema funciona según lo especificado.

**Prueba de caja negra:** Prueba que verifica el comportamiento del sistema a partir de entradas y resultados esperados, sin analizar su implementación interna.

**Despliegue:** Proceso de publicar la aplicación en un entorno accesible para sus usuarios.