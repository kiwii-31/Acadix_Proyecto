# Arquitectura general – ACADIX

## 1. Descripción

ACADIX es una aplicación web para gestionar y consultar materiales educativos organizados por año lectivo, curso, división, materia y período académico.

El sistema cuenta con tres roles: administrador, docente y estudiante. Cada uno tiene permisos y funcionalidades específicas.

## 2. Arquitectura del sistema

El sistema utiliza una arquitectura cliente-servidor dividida en dos partes principales:

- **Frontend:** interfaz web con React. Permite iniciar sesión, navegar por los paneles y realizar las operaciones correspondientes a cada rol.
- **Backend:** API REST desarrollada con Node.js y Express. Procesa las solicitudes, aplica las reglas de negocio, controla los permisos y se comunica con la base de datos.

La comunicación entre ambas partes se realiza mediante solicitudes HTTP y respuestas en formato JSON. La autenticación utiliza sesiones.

## 3. Tecnologías utilizadas

| Tecnología | Función                               |
| ---------- | ------------------------------------- |
| React      | Desarrollo de la interfaz de usuario. |
| Node.js    | Entorno de ejecución del backend.     |
| Express    | Desarrollo de la API REST.            |
| Prisma ORM | Acceso y gestión de los datos.        |
| PostgreSQL | Base de datos relacional.             |
| JavaScript | Lenguaje de programación.             |

## 4. Organización del backend

El backend se organiza en módulos con responsabilidades separadas:

- **Routes:** definen los endpoints y las rutas de la API.
- **Controllers:** procesan las solicitudes y aplican las reglas de negocio.
- **Middlewares:** controlan la autenticación, los permisos y las validaciones de solicitudes.
- **Prisma:** permite consultar y modificar los datos de PostgreSQL.

## 5. Autenticación y autorización

El acceso al sistema requiere iniciar sesión. No existe registro público de usuarios.

Se utilizan sesiones para mantener la autenticación. Las cookies de sesión tienen las opciones `httpOnly`, `sameSite` y `secure` según el entorno.

Los permisos se organizan por roles:

- **Administrador:** administra usuarios, estructura académica, asignaciones y períodos.
- **Docente:** gestiona programas, temas y materiales de sus materias asignadas.
- **Estudiante:** consulta programas publicados y sus materiales según sus inscripciones.

El backend verifica el rol antes de permitir el acceso a las rutas protegidas.

## 6. Almacenamiento de materiales

Los materiales educativos se almacenan en PostgreSQL.

Se admiten archivos PDF de hasta 20 MB. El contenido se guarda en un campo binario de la base de datos, mientras que el nombre, tipo, tamaño y demás datos descriptivos se almacenan por separado.

## 7. Organización académica

La información se organiza de la siguiente manera:

Año lectivo → Curso → División → Materia → Período académico → Programa → Tema → Material.

Cada año lectivo cuenta con dos cuatrimestres, cuatro bimestres y un período de recuperatorio. Los bimestres se relacionan con su cuatrimestre correspondiente.

Los programas pueden pertenecer a un bimestre o al período de recuperatorio.

## 8. Flujo general de funcionamiento

1. El usuario inicia sesión.
2. El sistema identifica su rol y muestra el panel correspondiente.
3. El administrador configura la estructura académica y las asignaciones.
4. Los docentes crean programas, agregan temas y cargan materiales.
5. Los programas se publican cuando están listos.
6. Los estudiantes consultan los programas publicados correspondientes a sus inscripciones actuales e históricas.

## 9. Seguridad

Se implementan controles de acceso por rol, validaciones en el backend, protección de rutas y validación de archivos.

También se utiliza Helmet para establecer encabezados de seguridad y CORS para controlar los orígenes permitidos.
