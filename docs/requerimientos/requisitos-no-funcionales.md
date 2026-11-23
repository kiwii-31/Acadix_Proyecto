# Requisitos no funcionales — ACADIX

## 1. Seguridad

- **RNF-001 — Autenticación:** Verificar la identidad de los usuarios antes de permitir el acceso.
- **RNF-002 — Contraseñas:** Almacenar contraseñas mediante hashing seguro, nunca en texto plano.
- **RNF-003 — Control de acceso:** Aplicar permisos según roles y asignaciones académicas.
- **RNF-004 — Validación del servidor:** Validar las operaciones en el backend para impedir acciones no autorizadas.
- **RNF-005 — Protección de archivos:** Validar formato, tamaño y condiciones de almacenamiento de los PDF.
- **RNF-006 — Privacidad:** Proteger los datos personales y académicos mediante permisos de acceso.
- **RNF-007 — Comunicación segura:** Utilizar HTTPS en la aplicación publicada.
- **RNF-008 — Sesiones:** Proteger las sesiones y establecer mecanismos de expiración.

## 2. Rendimiento

- **RNF-009 — Tiempo de respuesta:** Evitar demoras innecesarias en las operaciones habituales.
- **RNF-010 — Carga de contenidos:** Cargar programas, temas y materiales según sea necesario.
- **RNF-011 — Archivos:** Permitir la carga y descarga eficiente de PDF de hasta 20 MB.
- **RNF-012 — Base de datos:** Optimizar las consultas para evitar operaciones innecesarias.

## 3. Usabilidad y accesibilidad

- **RNF-013 — Interfaz:** Mantener una interfaz clara y fácil de utilizar.
- **RNF-014 — Navegación:** Mantener una organización visual coherente.
- **RNF-015 — Diseño adaptable:** Adaptarse a computadoras, tablets y celulares.
- **RNF-016 — Mensajes:** Mostrar errores y confirmaciones comprensibles.
- **RNF-017 — Accesibilidad visual:** Utilizar contrastes adecuados, textos legibles y controles identificables.

## 4. Compatibilidad

- **RNF-018 — Navegadores:** Funcionar en versiones recientes de Chrome, Edge y Firefox.
- **RNF-019 — Dispositivos:** Permitir el uso desde computadoras, notebooks, tablets y celulares.
- **RNF-020 — Documentos:** Permitir consultar o descargar PDF mediante las herramientas del dispositivo.

## 5. Disponibilidad y confiabilidad

- **RNF-021 — Disponibilidad:** Estar publicada en internet y ser accesible fuera del entorno de desarrollo.
- **RNF-022 — Integridad:** Mantener la consistencia de los datos durante las operaciones.
- **RNF-023 — Manejo de errores:** Gestionar errores sin interrumpir innecesariamente el sistema ni exponer información sensible.
- **RNF-024 — Copias de seguridad:** Contar con mecanismos de respaldo y recuperación de información.

## 6. Mantenibilidad y escalabilidad

- **RNF-025 — Arquitectura modular:** Organizar el sistema en módulos y capas con responsabilidades diferenciadas.
- **RNF-026 — Código mantenible:** Mantener el código organizado, claro y reutilizable.
- **RNF-027 — Separación de responsabilidades:** Separar interfaz, lógica de negocio y acceso a datos.
- **RNF-028 — Documentación:** Documentar arquitectura, funcionamiento, instalación y mantenimiento.
- **RNF-029 — Expansión:** Permitir incorporar funcionalidades sin afectar innecesariamente las existentes.

## 7. Calidad y pruebas

- **RNF-030 — Pruebas funcionales:** Verificar mediante pruebas el funcionamiento de las funcionalidades principales.
- **RNF-031 — Pruebas de seguridad:** Comprobar autenticación, autorización, permisos y acceso a materiales.
- **RNF-032 — Resultados:** Documentar lo probado, el resultado esperado, el obtenido y el estado de cada prueba.
- **RNF-033 — Versionado:** Mantener el código y la documentación principal en un repositorio Git.

## Consideraciones

- Los requisitos deberán contemplarse durante el diseño y desarrollo.
- La seguridad y los permisos deberán validarse en el backend.
- El rendimiento y la disponibilidad deberán comprobarse en el entorno publicado.
- Las decisiones técnicas se definirán en `PLAN.md`.
