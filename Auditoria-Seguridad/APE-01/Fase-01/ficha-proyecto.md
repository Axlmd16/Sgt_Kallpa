# Ficha de identificación del proyecto

**Asignatura:** Software Security  
 **Práctica:** APE 01 – Análisis y superficie de ataque del proyecto  
 **Fase:** 1 – Selección de la aplicación objetivo  
 **Proyecto:** Kallpa UNL  
 **Repositorio:** [https://github.com/Axlmd16/Sgt_Kallpa](https://github.com/Axlmd16/Sgt_Kallpa)  
 **Integrantes:**

- Jostin Santiago Jimenez Ulloa
- Jhostin Alexander Tapia Marquez
- Elias Sebastian Poma Granda
  **Fecha:** 1 y 2 de octubre de 2026

## 1. Nombre del proyecto

Kallpa UNL – Sistema de Gestión Deportiva.

## 2. Descripción del proyecto

Kallpa UNL es una aplicación web desarrollada para apoyar la gestión administrativa y deportiva del Club de Fútbol Kallpa de la Universidad Nacional de Loja.

El sistema centraliza el registro de deportistas y representantes, la administración de usuarios, el control de asistencias, las evaluaciones físicas, las estadísticas deportivas y la generación de reportes.

La aplicación cuenta con diferentes roles de usuario, lo que permite asignar funcionalidades y permisos según las responsabilidades de cada persona dentro del sistema.

## 3. Funcionalidades principales

- Autenticación de usuarios y recuperación de contraseñas.
- Administración de usuarios del sistema.
- Registro e inscripción de deportistas y representantes.
- Consulta y actualización de información de deportistas.
- Registro y seguimiento de asistencias.
- Gestión de evaluaciones físicas y técnicas.
- Consulta de estadísticas deportivas.
- Generación y exportación de reportes en PDF, Excel y CSV.
- Gestión del perfil de usuario y cambio de contraseña.

## 4. Usuarios y roles

El sistema contempla tres roles de acceso autenticado:

**Administrador (Administrator):** Tiene acceso a la administración de usuarios, gestión de inscripciones, evaluaciones, asistencias, estadísticas, reportes y funcionalidades de configuración autorizadas.

**Entrenador (Coach):** Puede gestionar inscripciones, registrar y modificar evaluaciones, controlar asistencias, consultar estadísticas y generar reportes. No dispone de permisos para administrar usuarios ni eliminar evaluaciones según la configuración de roles.

**Pasante (Intern):** Puede acceder a las funcionalidades de seguimiento habilitadas, entre ellas el registro de asistencia, evaluaciones, estadísticas y reportes. Tiene restricciones sobre la gestión de usuarios e inscripciones.

Además, la aplicación dispone de formularios públicos de inscripción para deportistas y representantes.

Estos permisos corresponden a la configuración del frontend y deberán contrastarse con los controles del backend durante la auditoría.

## 5. Tecnologías empleadas

| Componente                             | Tecnología              |
| -------------------------------------- | ----------------------- |
| Frontend                               | React 19, Vite 7        |
| Backend                                | Python 3.11+, FastAPI   |
| Base de datos principal                | PostgreSQL 16           |
| Servicio de personas                   | Spring Boot             |
| Base de datos del servicio de personas | MariaDB 11              |
| Autenticación                          | JSON Web Tokens (JWT)   |
| Comunicación                           | API REST mediante HTTP  |
| Contenedores                           | Docker y Docker Compose |
| Control de versiones                   | Git y GitHub            |

## 6. Arquitectura general

La aplicación utiliza una arquitectura basada en frontend, backend y servicios de persistencia.

El frontend desarrollado con React permite la interacción del usuario mediante el navegador. Las solicitudes son procesadas por el backend FastAPI, el cual implementa la lógica de negocio, la autenticación y la comunicación con PostgreSQL.

Adicionalmente, el backend se integra con un servicio de personas desarrollado en Spring Boot, que utiliza MariaDB para el almacenamiento de su información.

Los componentes se ejecutan localmente mediante Docker Compose.

## 7. Entorno de ejecución

La aplicación se ejecuta en un entorno local utilizando Docker Compose.

| Servicio             | Dirección o puerto                                           |
| -------------------- | ------------------------------------------------------------ |
| Frontend             | [http://localhost:5173](http://localhost:5173/)              |
| Backend              | [http://localhost:8001](http://localhost:8001/)              |
| API REST             | [http://localhost:8001/api/v1](http://localhost:8001/api/v1) |
| Swagger UI           | [http://localhost:8001/docs](http://localhost:8001/docs)     |
| PostgreSQL           | 5432                                                         |
| Servicio de personas | 8096                                                         |
| MariaDB              | 3306                                                         |

**Estado del entorno:** [Registrar el resultado real de `docker compose ps`].

## 8. Alcance de la auditoría

La auditoría de seguridad se realizará sobre la instalación local del proyecto Kallpa UNL.

Se analizarán los siguientes componentes:

- Mecanismos de autenticación y recuperación de contraseñas.
- Controles de acceso según los roles del sistema.
- Formularios de registro e inscripción.
- Funcionalidades de administración y seguimiento deportivo.
- Endpoints disponibles en la API REST.
- Validación de datos recibidos desde el frontend.
- Gestión y exposición de datos personales.
- Configuración y exposición de los servicios desplegados mediante Docker.
- Manejo de errores y excepciones.

La evaluación del servicio externo de personas se limitará inicialmente a su integración, los servicios expuestos y las configuraciones disponibles. No se incluye una auditoría interna de código de terceros que no esté disponible.

Todas las pruebas se realizarán exclusivamente en el entorno local autorizado, utilizando cuentas y datos ficticios.

## 9. Justificación de la selección

Se seleccionó Kallpa UNL porque es un proyecto de software con código fuente disponible, ejecutable localmente y que incorpora autenticación, distintos roles, bases de datos y múltiples funcionalidades web.

Estas características permiten identificar superficies de ataque, analizar activos de información y evaluar mecanismos de seguridad sobre una aplicación funcional.

Además, el sistema administra información de deportistas y representantes, por lo que la confidencialidad, integridad y disponibilidad de los datos constituyen aspectos relevantes para su evaluación.

## 10. Conclusión

Kallpa UNL reúne las características necesarias para servir como aplicación objetivo de la práctica de Software Security.

Su arquitectura, funcionalidades y tratamiento de información permiten desarrollar un proceso de análisis de seguridad progresivo, comenzando por la identificación de su superficie de ataque y los activos de información.

La auditoría continuará con el análisis de amenazas, la gestión de errores y la evaluación de riesgos conforme al OWASP Top 10.
