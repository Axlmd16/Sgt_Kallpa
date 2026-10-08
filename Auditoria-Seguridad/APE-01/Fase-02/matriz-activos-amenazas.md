# Matriz de activos de información y amenazas

**Asignatura:** Software Security  
**Práctica:** APE 01 – Análisis y superficie de ataque del proyecto  
**Fase:** 2 – Tríada CIA y matriz de activos y amenazas  
**Proyecto:** Kallpa UNL  
**Fecha:** 8 de octubre de 2026  
**Integrantes:**

- Jostin Santiago Jimenez Ulloa
- Jhostin Alexander Tapia Marquez
- Elias Sebastian Poma Granda

## 1. Objetivo

Identificar los principales activos de información de la aplicación Kallpa UNL, clasificarlos de acuerdo con los principios de confidencialidad, integridad y disponibilidad, y determinar las amenazas que podrían afectar su seguridad.

## 2. Tríada CIA

La tríada CIA está compuesta por tres principios fundamentales de seguridad de la información:

**Confidencialidad:** Garantiza que la información únicamente sea accesible para las personas o sistemas autorizados.

**Integridad:** Busca preservar la exactitud y consistencia de la información, evitando modificaciones no autorizadas.

**Disponibilidad:** Garantiza que la información y los servicios puedan utilizarse cuando los usuarios autorizados los necesiten.

La valoración de cada principio se realizará mediante tres niveles:

- **Alta:** Su afectación podría generar consecuencias importantes para la operación, la seguridad o la información tratada.
- **Media:** Su afectación produciría inconvenientes relevantes, pero potencialmente recuperables.
- **Baja:** Su afectación tendría consecuencias limitadas para el funcionamiento o la protección de la información.

## 3. Identificación y clasificación de activos

| ID   | Activo                                           | Tipo                             | C     | I    | D     |
| ---- | ------------------------------------------------ | -------------------------------- | ----- | ---- | ----- |
| A-01 | Datos personales de deportistas y representantes | Datos almacenados                | Alta  | Alta | Media |
| A-02 | Credenciales de autenticación                    | Credenciales                     | Alta  | Alta | Alta  |
| A-03 | Registros de asistencia                          | Datos almacenados                | Media | Alta | Media |
| A-04 | Resultados de evaluaciones deportivas            | Datos almacenados                | Media | Alta | Media |
| A-05 | Base de datos PostgreSQL                         | Servicio y almacenamiento        | Alta  | Alta | Alta  |
| A-06 | API REST de FastAPI                              | Servicio                         | Alta  | Alta | Alta  |
| A-07 | Tokens de autenticación JWT                      | Datos en tránsito y credenciales | Alta  | Alta | Alta  |
| A-08 | Servicio de personas y MariaDB                   | Servicio y almacenamiento        | Alta  | Alta | Media |

**Nota:** Las valoraciones son preliminares y se establecen a partir de las funciones conocidas del proyecto. Deben ajustarse según los requisitos reales del sistema.

## 4. Análisis de amenazas por activo

### A-01. Datos personales de deportistas y representantes

**Confidencialidad: Alta.** La aplicación administra información personal de deportistas y representantes, incluidos registros asociados a menores de edad. Una divulgación no autorizada podría afectar su privacidad.

**Integridad: Alta.** La alteración indebida de los registros podría generar errores de identificación e inconsistencias en la información de los deportistas.

**Disponibilidad: Media.** La falta temporal de acceso podría dificultar las actividades de gestión e inscripción, aunque su criticidad dependerá de los procesos afectados.

**Amenaza principal:** Acceso no autorizado a datos personales.

**Consecuencia potencial:** Divulgación de información privada.

### A-02. Credenciales de autenticación

**Confidencialidad: Alta.** Las credenciales permiten acceder a cuentas y funcionalidades del sistema. Su divulgación podría facilitar la suplantación de usuarios.

**Integridad: Alta.** La modificación no autorizada de credenciales podría permitir el control indebido de cuentas o impedir el acceso de sus propietarios.

**Disponibilidad: Alta.** Si el mecanismo de autenticación deja de estar disponible, los usuarios podrían quedar imposibilitados para acceder a las funciones protegidas.

**Amenaza principal:** Compromiso de credenciales.

**Consecuencia potencial:** Suplantación de identidad y acceso indebido.

### A-03. Registros de asistencia

**Confidencialidad: Media.** La información de asistencia debe estar disponible únicamente para los usuarios autorizados.

**Integridad: Alta.** La alteración de los registros podría ocasionar información incorrecta sobre la participación de los deportistas.

**Disponibilidad: Media.** La interrupción del servicio dificultaría el registro y consulta de asistencias.

**Amenaza principal:** Modificación no autorizada de asistencias.

**Consecuencia potencial:** Pérdida de confiabilidad de los registros.

### A-04. Resultados de evaluaciones deportivas

**Confidencialidad: Media.** Los resultados corresponden a información individual de seguimiento deportivo y deben protegerse frente a consultas no autorizadas.

**Integridad: Alta.** Los valores deben mantenerse correctos para permitir un seguimiento confiable del rendimiento de los deportistas.

**Disponibilidad: Media.** La falta de acceso podría interrumpir temporalmente las actividades de evaluación y seguimiento.

**Amenaza principal:** Alteración indebida de resultados.

**Consecuencia potencial:** Estadísticas y evaluaciones incorrectas.

### A-05. Base de datos PostgreSQL

**Confidencialidad: Alta.** Almacena información necesaria para el funcionamiento del backend.

**Integridad: Alta.** La modificación o corrupción de sus registros podría comprometer la información utilizada por la aplicación.

**Disponibilidad: Alta.** La pérdida de conectividad o disponibilidad de la base de datos podría impedir el funcionamiento de diversas operaciones del sistema.

**Amenaza principal:** Acceso indebido, pérdida o corrupción de información.

**Consecuencia potencial:** Compromiso de datos e interrupción de funcionalidades.

### A-06. API REST de FastAPI

**Confidencialidad: Alta.** La API procesa solicitudes que pueden involucrar información personal y operaciones protegidas.

**Integridad: Alta.** Debe impedir que solicitudes no autorizadas modifiquen registros del sistema.

**Disponibilidad: Alta.** Una interrupción de la API afectaría la comunicación entre el frontend y los servicios del backend.

**Amenaza principal:** Solicitudes no autorizadas y abuso de los endpoints.

**Consecuencia potencial:** Acceso indebido, modificación de información o interrupción de servicios.

### A-07. Tokens de autenticación JWT

**Confidencialidad: Alta.** Un token válido comprometido podría permitir el uso no autorizado de una sesión.

**Integridad: Alta.** Es necesario garantizar que los tokens sean verificados correctamente y no puedan alterarse sin ser detectados.

**Disponibilidad: Alta.** La generación y validación de tokens es importante para el acceso continuo a las funcionalidades autenticadas.

**Amenaza principal:** Robo, reutilización o validación incorrecta de tokens.

**Consecuencia potencial:** Suplantación de sesión y acceso no autorizado.

### A-08. Servicio de personas y MariaDB

**Confidencialidad: Alta.** El servicio gestiona información relacionada con personas, por lo que es necesario restringir el acceso a sus datos.

**Integridad: Alta.** Las modificaciones no autorizadas podrían ocasionar inconsistencias entre los registros del sistema y los del servicio externo.

**Disponibilidad: Media.** La interrupción del servicio podría afectar las funcionalidades que dependen de esta integración.

**Amenaza principal:** Acceso indebido o indisponibilidad de la integración.

**Consecuencia potencial:** Exposición de información y fallos en operaciones dependientes del servicio.

## 5. Priorización preliminar de activos

Con base en la clasificación realizada, se consideran especialmente relevantes:

**Datos personales de deportistas:** Por su sensibilidad y por el impacto que tendría una divulgación o modificación indebida.

**Credenciales y tokens de autenticación:** Porque permiten controlar la identidad y el acceso a las funcionalidades de la aplicación.

**Base de datos PostgreSQL:** Por su importancia en la conservación y disponibilidad de los datos.

**API REST:** Porque centraliza las solicitudes del frontend y permite acceder a las operaciones del sistema.

Esta priorización es preliminar. La identificación de controles existentes y la propuesta formal de mitigaciones se desarrollarán en la siguiente sesión de la Fase 2.

## 6. Conclusión

El análisis de activos de Kallpa UNL permite identificar recursos cuya protección es fundamental para la seguridad del sistema, entre ellos los datos personales, las credenciales, los registros deportivos, los servicios de autenticación y la infraestructura de almacenamiento.

La clasificación mediante la tríada CIA evidencia que un mismo activo puede presentar necesidades de protección distintas según el impacto de una divulgación, modificación o interrupción.

Se destaca la importancia de mantener la confidencialidad de los datos personales y las credenciales, preservar la integridad de los registros deportivos y garantizar la disponibilidad de los servicios principales.

Las amenazas identificadas constituyen escenarios potenciales que servirán como base para analizar los controles de seguridad existentes y proponer medidas de mitigación en las siguientes actividades.
