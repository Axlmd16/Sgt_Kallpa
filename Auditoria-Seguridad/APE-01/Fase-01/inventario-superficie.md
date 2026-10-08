# Inventario inicial de superficie de ataque

**Proyecto:** Kallpa UNL  
**Asignatura:** Software Security  
**Práctica:** APE 01  
**Fase:** 1 – Inventario de superficie de ataque  
**Fecha:** 2 de octubre de 2026  
**Integrantes:**

- Jostin Santiago Jimenez Ulloa
- Jhostin Alexander Tapia Marquez
- Elias Sebastian Poma Granda

## 1. Objetivo

Identificar y documentar los principales puntos de interacción y exposición de la aplicación Kallpa UNL, incluyendo formularios, rutas web, servicios, endpoints y componentes que podrían representar puntos de entrada para amenazas de seguridad.

## 2. Metodología

El inventario se elabora a partir de la revisión de la estructura del proyecto, las rutas definidas en el frontend, los servicios registrados en el backend y la configuración de Docker.

Para completar la identificación se realizará un recorrido por las funcionalidades de la aplicación en su entorno local, utilizando el navegador y las herramientas de desarrollador para observar las solicitudes HTTP.

Cada elemento se registrará con su descripción, tipo de exposición, posible amenaza y evidencia correspondiente.

Las amenazas indicadas son hipótesis de análisis y no representan vulnerabilidades confirmadas.

## 3. Inventario de elementos

| ID    | Elemento                      | Tipo de exposición        | Posible amenaza                                           |
| ----- | ----------------------------- | ------------------------- | --------------------------------------------------------- |
| SA-01 | Inicio de sesión              | Formulario público        | Intentos de acceso mediante credenciales comprometidas    |
| SA-02 | Recuperación de contraseña    | Formulario público        | Abuso de recuperación o enumeración de cuentas            |
| SA-03 | Inscripción pública           | Formularios web           | Manipulación de entradas y exposición de datos personales |
| SA-04 | Administración de usuarios    | Módulo protegido          | Acceso o modificación sin autorización                    |
| SA-05 | Gestión de deportistas        | Módulo protegido          | Consulta o modificación indebida de registros             |
| SA-06 | Gestión de asistencia         | Módulo protegido          | Alteración de registros de asistencia                     |
| SA-07 | Evaluaciones deportivas       | Módulo protegido          | Manipulación no autorizada de resultados                  |
| SA-08 | Reportes y estadísticas       | Módulo protegido          | Acceso indebido a información y exportaciones             |
| SA-09 | API REST de FastAPI           | Endpoints HTTP            | Solicitudes no autorizadas o entradas maliciosas          |
| SA-10 | Swagger UI                    | Documentación de API      | Exposición de información sobre endpoints                 |
| SA-11 | PostgreSQL                    | Servicio de base de datos | Acceso no autorizado o pérdida de información             |
| SA-12 | Servicio de personas          | Servicio HTTP             | Acceso indebido o abuso de la integración                 |
| SA-13 | MariaDB                       | Servicio de base de datos | Acceso no autorizado a datos                              |
| SA-14 | Perfil y cambio de contraseña | Funcionalidad autenticada | Modificación no autorizada de información de cuenta       |

## 4. Descripción de los principales puntos de exposición

### SA-01. Inicio de sesión

Permite el acceso a los usuarios registrados mediante el ingreso de credenciales.

**Amenazas potenciales:** ataques de fuerza bruta, uso de credenciales comprometidas y fallos en la validación de autenticación.

**Verificación pendiente:** identificar la ruta exacta, el endpoint de autenticación, el método HTTP y la respuesta del sistema ante credenciales inválidas.

**Evidencia:** evidencias/SA-01-login.png

### SA-02. Recuperación de contraseña

Permite iniciar el proceso de recuperación de acceso a una cuenta.

**Amenazas potenciales:** enumeración de usuarios, abuso de solicitudes y uso indebido de mecanismos de recuperación.

**Verificación pendiente:** revisar las respuestas ante cuentas existentes e inexistentes, sin utilizar cuentas ajenas.

**Evidencia:** evidencias/SA-02-recuperacion.png

### SA-03. Inscripción pública

Contiene formularios para registrar información de deportistas y representantes.

**Amenazas potenciales:** introducción de datos no válidos, manipulación de parámetros y exposición de información personal.

**Verificación pendiente:** identificar los campos recibidos, las validaciones disponibles y los endpoints utilizados.

**Evidencia:** evidencias/SA-03-inscripcion.png

### SA-04. Administración de usuarios

El frontend restringe esta sección al rol de administrador.

**Amenaza potencial:** acceso a funciones administrativas mediante permisos insuficientes o validaciones incompletas.

**Verificación pendiente:** comprobar si el backend también aplica las restricciones correspondientes.

**Evidencia:** evidencias/SA-04-usuarios.png

### SA-05. Gestión de deportistas

Permite consultar, registrar y actualizar información de los deportistas.

**Amenazas potenciales:** acceso a información personal sin autorización y alteración de registros.

**Verificación pendiente:** comprobar las restricciones por rol y los controles aplicados a las operaciones de consulta y modificación.

**Evidencia:** evidencias/SA-05-deportistas.png

### SA-06. Gestión de asistencia

Permite registrar y consultar la asistencia de los deportistas.

**Amenaza potencial:** alteración de información de asistencia por usuarios no autorizados.

**Verificación pendiente:** comprobar los permisos asociados a la creación y modificación de registros.

**Evidencia:** evidencias/SA-06-asistencia.png

### SA-07. Evaluaciones deportivas

Permite registrar y consultar resultados de evaluaciones físicas y técnicas.

**Amenaza potencial:** modificación indebida de resultados y consulta de información restringida.

**Verificación pendiente:** revisar los roles autorizados y las validaciones de los datos registrados.

**Evidencia:** evidencias/SA-07-evaluaciones.png

### SA-08. Reportes y estadísticas

Permite consultar información de seguimiento deportivo y exportar reportes.

**Amenazas potenciales:** divulgación de información mediante reportes y exportación no autorizada.

**Verificación pendiente:** comprobar el acceso según el rol y la información incluida en las exportaciones.

**Evidencia:** evidencias/SA-08-reportes.png

### SA-09. API REST

La aplicación dispone de una API desarrollada en FastAPI, organizada bajo el prefijo `/api/v1`.

**Amenazas potenciales:** falta de autorización, entradas maliciosas y exposición de información mediante respuestas.

**Verificación pendiente:** enumerar los endpoints exactos, métodos HTTP, parámetros y requerimientos de autenticación utilizando Swagger UI y las herramientas de desarrollador.

**Evidencia:** evidencias/SA-09-api.png

### SA-10. Documentación Swagger

La documentación interactiva se encuentra configurada en `/docs` dentro del backend.

**Amenaza potencial:** divulgación de información sobre la estructura y operaciones de la API cuando se expone a usuarios que no deberían consultarla.

**Verificación pendiente:** comprobar su accesibilidad y documentar los endpoints visibles.

**Evidencia:** evidencias/SA-10-swagger.png

### SA-11, SA-12 y SA-13. Servicios de datos y personas

Docker Compose publica PostgreSQL, MariaDB y el servicio de personas en puertos del equipo anfitrión.

**Amenazas potenciales:** accesos no autorizados, exposición innecesaria de servicios y utilización de credenciales débiles.

**Verificación pendiente:** comprobar los puertos publicados, las interfaces de escucha y los controles de acceso locales.

**Evidencia:** evidencias/SA-11-servicios-docker.png

## 5. Registro complementario de rutas, métodos y parámetros

Completar durante la exploración de la aplicación:

| ID    | Ruta o endpoint       | Método HTTP     | Parámetros o datos recibidos | Autenticación | Evidencia |
| ----- | --------------------- | --------------- | ---------------------------- | ------------- | --------- |
| SA-01 | [Observar en Network] | [GET/POST/etc.] | [Campos reales]              | [Verificar]   | SA-01     |
| SA-02 | [Observar en Network] | [Verificar]     | [Campos reales]              | [Verificar]   | SA-02     |
| SA-03 | [Observar en Network] | [Verificar]     | [Campos reales]              | [Verificar]   | SA-03     |
| SA-04 | [Observar en Swagger] | [Verificar]     | [Parámetros reales]          | [Verificar]   | SA-04     |
| SA-05 | [Observar en Swagger] | [Verificar]     | [Parámetros reales]          | [Verificar]   | SA-05     |

Añadir los demás endpoints identificados durante la exploración.

## 6. Evidencias

Las capturas de pantalla se almacenarán en la carpeta `evidencias/` de la Fase 1.

Cada captura debe corresponder al elemento identificado y permitir verificar su existencia o exposición.

No se incluirán contraseñas, tokens, información personal real ni otros datos sensibles.

## 7. Conclusión preliminar

La revisión de la estructura de Kallpa UNL permite identificar diferentes puntos de exposición relacionados con autenticación, formularios públicos, módulos protegidos, API REST y servicios de infraestructura.

Estos elementos constituyen la base del inventario inicial de superficie de ataque y permitirán orientar las siguientes fases del análisis de seguridad.

La existencia de un punto de exposición no implica necesariamente una vulnerabilidad. Para determinar fallos concretos será necesario efectuar verificaciones controladas y registrar sus resultados.
