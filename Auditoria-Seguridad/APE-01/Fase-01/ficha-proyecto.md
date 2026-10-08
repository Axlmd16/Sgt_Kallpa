# Ficha de identificación y alcance — Fase 1

**Asignatura:** Software Security, Universidad Nacional de Loja
**Práctica:** APE 01 · sesiones del 1 y 2 de octubre de 2026
**Proyecto:** Sgt_Kallpa (Kallpa UNL), sistema web de gestión deportiva
**Repositorio:** https://github.com/Axlmd16/Sgt_Kallpa
**Integrantes consignados en la documentación previa:** Jostin Santiago Jimenez Ulloa; Jhostin Alexander Tapia Marquez; Elias Sebastian Poma Granda.

## Finalidad y funciones

La aplicación organiza inscripciones del club y escuela de fútbol, con datos de deportistas y, para menores, de representantes. El personal autenticado administra usuarios, deportistas y pasantes; registra asistencia; crea evaluaciones y pruebas físicas o técnicas; consulta estadísticas y genera reportes PDF, XLSX o CSV. La interfaz pública incluye portada, elección de inscripción, registro de club/escuela, inicio de sesión y recuperación de contraseña. Evidencia: [AppRouter.jsx](../../../FrontendFutbol/src/app/router/AppRouter.jsx), [routers](../../../BackendFutbol/app/services/routers/) y [report_router.py](../../../BackendFutbol/app/services/routers/report_router.py).

## Usuarios, roles y permisos observados

Los valores de rol son `Administrator`, `Coach` e `Intern` ([rol.py](../../../BackendFutbol/app/models/enums/rol.py), [roles.js](../../../FrontendFutbol/src/app/config/roles.js)). Los solicitantes de inscripción pública no son un rol autenticado.

| Actor | Navegación React | Autorización FastAPI comprobada en código |
|---|---|---|
| Público | Portada, registro de club/escuela, login y recuperación | Login, recuperación y renovación de token; inscripción de deportistas y menores; consulta de representante por DNI |
| Administrator | Usuarios, deportistas, asistencia, evaluaciones, estadísticas, reportes y perfil | Crear/editar/activar/desactivar usuarios y representantes; operaciones autenticadas de seguimiento y deportistas; reportes |
| Coach | Deportistas, seguimiento, reportes y perfil | Puede listar y gestionar pasantes, operaciones autenticadas de deportistas/seguimiento y generar reportes; no tiene dependencia de administrador en usuarios |
| Intern | Seguimiento, reportes y perfil; sin rutas React de usuarios/deportistas | Puede invocar endpoints que solo usan `get_current_account`, incluidos varios de atletas, evaluaciones, pruebas, asistencia y estadísticas; el backend le niega la generación de reportes |

`ProtectedRoute` solo verifica la presencia de un token local y `RoleRoute` usa el rol guardado en `localStorage`. Las restricciones efectivas de API dependen de `get_current_account`, `get_current_admin`, `get_current_coach_or_admin` y `validate_report_permissions` ([security.py](../../../BackendFutbol/app/utils/security.py), [user_router.py](../../../BackendFutbol/app/services/routers/user_router.py), [report_router.py](../../../BackendFutbol/app/services/routers/report_router.py)). Por ello, la interfaz y la API no tienen siempre el mismo alcance: React muestra reportes a `Intern`, pero la generación en FastAPI admite únicamente `Administrator` y `Coach`; React restringe deportistas a los dos primeros roles, mientras varios endpoints de atletas solo exigen autenticación. La eliminación de evaluaciones y pruebas también exige solo autenticación en FastAPI, aunque `roles.js` declara esa acción deshabilitada para Coach e Intern. Son diferencias de implementación, no resultados de explotación.

## Tecnologías y arquitectura

| Componente | Implementación confirmada |
|---|---|
| Cliente | React 19, Vite 7, React Router, Axios, React Hook Form y Tailwind CSS 4 ([package.json](../../../FrontendFutbol/package.json)) |
| API | Python con FastAPI, Pydantic y SQLAlchemy ([pyproject.toml](../../../BackendFutbol/pyproject.toml), [main.py](../../../BackendFutbol/main.py)) |
| Identidad | Contraseñas con bcrypt y tokens JWT de acceso/refresco; cliente guarda tokens en `localStorage` ([security.py](../../../BackendFutbol/app/utils/security.py), [http.js](../../../FrontendFutbol/src/app/config/http.js)) |
| Persistencia | PostgreSQL 16 para FastAPI; MariaDB 11 para el servicio de personas ([docker-compose.yml](../../../docker-compose.yml)) |
| Servicio integrado | Imagen Docker de aplicación Spring Boot para personas; FastAPI se comunica mediante `PersonClient`. Su código fuente no consta en este repositorio ([person_client.py](../../../BackendFutbol/app/client/person_client.py)) |
| Despliegue local | Docker Compose; cliente Vite compilado y servido por Nginx ([FrontendFutbol/Dockerfile](../../../FrontendFutbol/Dockerfile), [BackendFutbol/Dockerfile](../../../BackendFutbol/Dockerfile)) |

El navegador llama a la API FastAPI bajo `/api/v1`. FastAPI gestiona cuentas, deportistas y seguimiento en PostgreSQL y usa el servicio de personas para datos de identidad asociados, almacenados por este en MariaDB. El backend registra routers en `main.py`; los controladores, esquemas y modelos se hallan en `BackendFutbol/app/`. La documentación HTTP se configura en `/docs`, `/redoc`, `/scalar` y `/openapi.json`.

## Entorno local declarado

| Servicio | Puerto del anfitrión → contenedor |
|---|---|
| Frontend Nginx | `5173 → 80` |
| FastAPI | `8001 → 8000` |
| PostgreSQL | `5432 → 5432` |
| MariaDB | `3306 → 3306` |
| Spring Boot (personas) | `8096 → 8096` |

`person-ms-init` es una tarea auxiliar sin puerto publicado. La URL de API compilada por defecto en Docker es `http://localhost:8001/api/v1`; fuera de Docker, `http.js` usa `http://localhost:8000/api/v1` si no se define `VITE_API_URL`. Estas son configuraciones, no prueba de servicios activos. Evidencia: [docker-compose.yml](../../../docker-compose.yml), [http.js](../../../FrontendFutbol/src/app/config/http.js).

## Delimitación y justificación

El alcance de las sesiones del 1, 2 y 8 de octubre comprende identificación del proyecto, componentes, rutas, formularios, servicios, activos, clasificación CIA y escenarios de amenaza preliminares. Se analizó código y configuración local; no se ejecutaron pruebas dinámicas, ni se verificaron cuentas, datos reales, disponibilidad de contenedores o respuestas HTTP. La imagen externa de Spring Boot queda limitada a la integración y configuración visible. La guía PDF indicada en la tarea no se encontró en el entorno.

Sgt_Kallpa es pertinente porque combina entrada pública de datos personales, roles, autenticación, API, dos bases de datos y un servicio integrado. Esto permite estudiar superficies y activos concretos sin recurrir a supuestos genéricos. El [inventario](inventario-superficie.md) y la [matriz CIA](../Fase-02/matriz-activos-amenazas.md) documentan las observaciones correspondientes. Las amenazas allí descritas requieren comprobación posterior y no constituyen hallazgos confirmados.
