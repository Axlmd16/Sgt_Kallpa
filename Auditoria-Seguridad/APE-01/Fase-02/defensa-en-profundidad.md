# Actividad 1. Defensa en profundidad

## 1. Información general

| Campo | Dato |
|---|---|
| Asignatura | Software Security, Universidad Nacional de Loja |
| Proyecto | Sgt_Kallpa (Kallpa UNL) |
| Práctica y fase | APE 01, Fase 2 |
| Actividad | Identificación de capas de control: autenticación, validación de entradas, cifrado y respaldo |
| Fecha | 9 de octubre de 2026 |
| Integrantes | Pendiente de confirmación para esta actividad |

## 2. Objetivo

Identificar, a partir del código y la configuración del repositorio, los controles presentes en las cuatro capas, su alcance y las comprobaciones que aún requieren ejecución. El análisis se relaciona con la [ficha del proyecto](../Fase-01/ficha-proyecto.md), el [inventario de superficie](../Fase-01/inventario-superficie.md) y la [matriz CIA](matriz-activos-amenazas.md) de la sesión anterior.

## 3. Defensa en profundidad

La defensa en profundidad combina controles que actúan en puntos distintos de una misma operación. En Kallpa UNL, una inscripción o consulta puede atravesar el formulario React, la API FastAPI, sus dependencias de autenticación, los esquemas de entrada y las bases de datos. Si un control de interfaz se omite o falla, los controles del servidor y de la infraestructura deben seguir delimitando la operación. La presencia de una capa no demuestra por sí sola que las demás estén cubiertas.

## 4. Metodología y alcance

Se revisaron de forma estática `FrontendFutbol/src/app/router/`, `AuthProvider.jsx`, `http.js`, formularios de autenticación, inscripción y usuarios; `BackendFutbol/app/utils/security.py`, controladores y routers de cuentas, usuarios, deportistas, representantes, seguimiento y reportes; esquemas Pydantic, DAO, configuración, manejadores de excepciones y cliente del servicio de personas. Para infraestructura se revisaron `docker-compose.yml`, ambos Dockerfiles, `FrontendFutbol/nginx.conf`, archivos de exclusión de Git y los scripts/versionados relacionados con respaldo. Se buscaron mecanismos de limitación de intentos, respaldo y restauración en el código del proyecto, excluyendo dependencias instaladas. No se leyó ni reprodujo ningún archivo de secretos, no se levantaron servicios y no se hicieron pruebas de acceso o recuperación. El código interno de la imagen Spring Boot no está en el repositorio.

**Criterios de estado:** *Implementado* significa que el mecanismo consta en código o configuración; no califica su eficacia operacional. *Parcialmente implementado* indica alcance restringido o inconsistente. *No encontrado* significa ausencia de evidencia en los archivos revisados, sin equivaler a vulnerabilidad confirmada. *Pendiente de verificación* exige datos de ejecución o infraestructura externa.

## 5. Matriz de controles de seguridad

| Capa | Control evaluado | Estado | Evidencia en el proyecto | Observación |
|---|---|---|---|---|
| Autenticación | A1. Inicio de sesión con comprobación de credenciales | Implementado | [`AccountController.login`](../../../BackendFutbol/app/controllers/account_controller.py), [`LoginRequest`](../../../BackendFutbol/app/schemas/account_schema.py) | Busca cuenta activa, compara contraseña con hash y devuelve tokens. |
| Autenticación | A2. Firma y expiración de JWT | Implementado | [`create_access_token`, `create_refresh_token`, `decode_token`](../../../BackendFutbol/app/utils/security.py), [`Settings`](../../../BackendFutbol/app/core/config.py) | HS256 configurado; `iat` y `exp` presentes. Los tiempos configurados son 1 hora y 7 días. |
| Autenticación | A3. Separación de token de acceso y de refresco | Parcialmente implementado | [`validate_refresh_token`, `get_current_account`](../../../BackendFutbol/app/utils/security.py) | La renovación exige `type=refresh`; `get_current_account` valida firma, expiración, `sub` y cuenta activa, pero no rechaza explícitamente tokens `type=refresh` o `action=reset_password`. |
| Autenticación | A4. Autorización por rol en la API | Parcialmente implementado | [`get_current_admin`](../../../BackendFutbol/app/utils/security.py), [`get_current_coach_or_admin`](../../../BackendFutbol/app/services/routers/user_router.py), [`validate_report_permissions`](../../../BackendFutbol/app/services/routers/report_router.py), [routers](../../../BackendFutbol/app/services/routers/) | Hay dependencias de rol, pero `GET /users/all`, operaciones de atletas y eliminación de evaluaciones/pruebas solo exigen cuenta autenticada. |
| Autenticación | A5. Rutas y funciones restringidas en React | Parcialmente implementado | [`ProtectedRoute.jsx`](../../../FrontendFutbol/src/app/router/ProtectedRoute.jsx), [`RoleRoute.jsx`](../../../FrontendFutbol/src/app/router/RoleRoute.jsx), [`roles.js`](../../../FrontendFutbol/src/app/config/roles.js) | Se comprueba presencia de token y rol almacenado localmente; no se valida el JWT en la navegación. La configuración de permisos del cliente no es una autorización de servidor. |
| Autenticación | A6. Renovación y cierre local de sesión | Parcialmente implementado | [`http.js`](../../../FrontendFutbol/src/app/config/http.js), [`AuthProvider.jsx`](../../../FrontendFutbol/src/app/providers/AuthProvider.jsx), [`AccountController.refresh_token`](../../../BackendFutbol/app/controllers/account_controller.py) | Ante 401 se intenta renovar y, si falla, se limpian tokens locales; no se encontró endpoint de revocación/logout. El token de refresco se reutiliza hasta expirar. |
| Autenticación | A7. Recuperación y cambio de contraseña | Implementado | [`account_router.py`](../../../BackendFutbol/app/services/routers/account_router.py), [`account_controller.py`](../../../BackendFutbol/app/controllers/account_controller.py), [`account_schema.py`](../../../BackendFutbol/app/schemas/account_schema.py) | Hay token de recuperación con acción y expiración, cambio con contraseña actual y nuevas contraseñas validadas. El envío real de correo no se verificó. |
| Autenticación | A8. Limitación de intentos de login o bloqueo temporal | No encontrado | Búsqueda en [`app/`](../../../BackendFutbol/app/) y [`account_router.py`](../../../BackendFutbol/app/services/routers/account_router.py) | No se halló limitador, contador de intentos ni bloqueo en el código revisado. La comprobación contra hash ficticio para cuentas inexistentes no limita solicitudes. |
| Autenticación | A9. Política de orígenes CORS | Parcialmente implementado | [`_configure_middlewares`](../../../BackendFutbol/main.py), [`Settings.ALLOWED_ORIGINS`](../../../BackendFutbol/app/core/config.py) | CORSMiddleware está activo, pero el valor predeterminado admite todos los orígenes; el valor efectivo podría cambiar por entorno. CORS no reemplaza autenticación. |
| Validación | V1. Tipos, formatos y rangos en esquemas de API | Implementado | [`account_schema.py`](../../../BackendFutbol/app/schemas/account_schema.py), [`athlete_schema.py`](../../../BackendFutbol/app/schemas/athlete_schema.py), [`attendance_schema.py`](../../../BackendFutbol/app/schemas/attendance_schema.py) | `EmailStr`, fechas, enumeraciones y `Field` restringen entradas de endpoints concretos. |
| Validación | V2. Reglas de negocio en el servidor | Implementado | [`validate_ec_dni`](../../../BackendFutbol/app/utils/security.py), [`AttendanceBulkCreate`](../../../BackendFutbol/app/schemas/attendance_schema.py), [`ReportFilter`](../../../BackendFutbol/app/schemas/report_schema.py) | Hay validaciones de identificación, fecha no futura, lista de asistencia no vacía y orden del rango de reporte. |
| Validación | V3. Validación de formularios React | Parcialmente implementado | [`LoginForm.jsx`](../../../FrontendFutbol/src/features/auth/components/LoginForm.jsx), [`DeportistaForm.jsx`](../../../FrontendFutbol/src/features/inscription/components/DeportistaForm.jsx), [`UserForm.jsx`](../../../FrontendFutbol/src/features/users/components/UserForm.jsx) | Se comprueban campos, patrones y longitudes, pero el cliente puede omitirse; las reglas del servidor son las que reciben solicitudes directas. |
| Validación | V4. Tratamiento de campos inesperados | Parcialmente implementado | [`AthleteInscriptionDTO`](../../../BackendFutbol/app/schemas/athlete_schema.py), [`RepresentativeInscriptionDTO`](../../../BackendFutbol/app/schemas/representative_schema.py), [`ReportFilter`](../../../BackendFutbol/app/schemas/report_schema.py) | Algunos DTO usan `extra="forbid"`; `ReportFilter` usa `extra="ignore"`. No hay política uniforme de rechazo de campos adicionales. |
| Validación | V5. Acceso a PostgreSQL mediante ORM | Implementado | [`base.py`](../../../BackendFutbol/app/dao/base.py), [`athlete_dao.py`](../../../BackendFutbol/app/dao/athlete_dao.py), [`database.py`](../../../BackendFutbol/app/core/database.py) | Las consultas revisadas usan filtros de SQLAlchemy y una instrucción estática para timeout. No se infiere protección completa contra inyección SQL. |
| Validación | V6. Manejo de errores de solicitud y servidor | Parcialmente implementado | [`_register_exception_handlers`](../../../BackendFutbol/main.py), [`exception_handlers.py`](../../../BackendFutbol/app/core/exception_handlers.py), [routers de pruebas](../../../BackendFutbol/app/services/routers/) | Se registran respuestas para validación y fallos generales; varios routers construyen errores 500 con `str(exc)`, cuyo contenido efectivo debe examinarse. |
| Cifrado | C1. Hash de contraseñas almacenadas | Implementado | [`hash_password`, `verify_password`](../../../BackendFutbol/app/utils/security.py), [`AccountController`](../../../BackendFutbol/app/controllers/account_controller.py), [`seeder.py`](../../../BackendFutbol/app/core/seeder.py) | Se usa bcrypt mediante Passlib; esto es hash, no cifrado reversible. No se inspeccionaron registros reales. |
| Cifrado | C2. TLS entre navegador y frontend/API | No encontrado | [`docker-compose.yml`](../../../docker-compose.yml), [`nginx.conf`](../../../FrontendFutbol/nginx.conf), [`http.js`](../../../FrontendFutbol/src/app/config/http.js) | El despliegue local declara HTTP y Nginx escucha en 80; no hay terminación TLS configurada en estos archivos. Un proxy externo no se evaluó. |
| Cifrado | C3. TLS en enlaces internos a personas y bases | No encontrado | [`docker-compose.yml`](../../../docker-compose.yml), [`config.py`](../../../BackendFutbol/app/core/config.py), [`person_client.py`](../../../BackendFutbol/app/client/person_client.py), [`database.py`](../../../BackendFutbol/app/core/database.py) | La URL del servicio de personas usa HTTP; no se halló configuración TLS para enlaces a PostgreSQL/MariaDB. El transporte efectivo externo requiere verificación. |
| Cifrado | C4. Cifrado de datos en reposo | No encontrado | [`docker-compose.yml`](../../../docker-compose.yml), [modelos](../../../BackendFutbol/app/models/) | Se definen volúmenes y modelos, sin configuración de cifrado de volumen, campo o base en el proyecto. No se examinó el cifrado del equipo anfitrión. |
| Cifrado | C5. Gestión de secretos fuera del código | Parcialmente implementado | [`Settings`](../../../BackendFutbol/app/core/config.py), [`docker-compose.yml`](../../../docker-compose.yml), [`.gitignore`](../../../.gitignore) | JWT y base de datos admiten variables de entorno y `.env` se excluye de Git; también existen valores predeterminados de credenciales o claves en archivos versionados. Aquí no se reproducen sus valores. |
| Cifrado | C6. TLS para correo de recuperación | Parcialmente implementado | [`email_client.py`](../../../BackendFutbol/app/utils/email_client.py), [`Settings.SMTP_SSL`](../../../BackendFutbol/app/core/config.py) | El cliente admite SMTP sobre SSL o STARTTLS según configuración; la negociación y el envío reales están pendientes de ejecución. |
| Respaldo | R1. Persistencia de PostgreSQL y MariaDB | Implementado | [`docker-compose.yml`](../../../docker-compose.yml) | Ambos servicios montan volúmenes nombrados. La persistencia no es una copia de seguridad. |
| Respaldo | R2. Script o tarea automática de respaldo | No encontrado | Búsqueda en [`BackendFutbol/`](../../../BackendFutbol/), [`FrontendFutbol/`](../../../FrontendFutbol/) y [`docker-compose.yml`](../../../docker-compose.yml) | No se hallaron tareas `pg_dump`, `mariadb-dump` ni scripts equivalentes versionados. |
| Respaldo | R3. Procedimiento documentado de restauración | No encontrado | Búsqueda en [documentación del proyecto](../../../README.md) y [`Auditoria-Seguridad/`](../../) | No se halló un procedimiento operativo de recuperación de ambas bases. |
| Respaldo | R4. Frecuencia, retención y destino de copias | No encontrado | [`docker-compose.yml`](../../../docker-compose.yml) y documentación revisada | Los volúmenes no especifican programación, retención ni copia fuera del anfitrión. |
| Respaldo | R5. Evidencia de prueba de restauración | No encontrado | Documentación y scripts versionados revisados | No constan actas o resultados de recuperación en el repositorio. |
| Respaldo | R6. Respaldo externo o recuperación efectiva del entorno | Pendiente de verificación | Fuera del código versionado | El administrador del entorno debe confirmar si hay copias externas y una restauración comprobada. No se presume que existan. |

**Resumen de la matriz:** 27 controles: **8 implementados**, **10 parcialmente implementados**, **8 no encontrados** y **1 pendiente de verificación**.

## 6. Análisis por capa

### Autenticación

`POST /api/v1/accounts/login` recibe un correo y una contraseña, localiza una cuenta activa y compara el secreto con un hash bcrypt. Los tokens JWT se firman con el algoritmo configurado y contienen expiración. `decode_token` valida la firma y la fecha; `get_current_account` busca una cuenta activa por `sub`. La renovación valida `type=refresh`, mientras que el acceso ordinario no exige explícitamente un tipo de token de acceso: esto limita la separación entre clases de token en el código. React conserva tokens y datos de usuario en `localStorage`, restaura la sesión por presencia de esos datos y renueva ante respuestas 401. El tiempo de expiración lo hace cumplir la API, no `ProtectedRoute`. No se encontró contador de intentos ni revocación de tokens; la existencia de protección externa queda fuera de este análisis. La autorización por rol se aplica a determinadas operaciones, pero no reproduce todas las restricciones declaradas por la interfaz y `roles.js`.

### Validación de entradas

Los routers reciben esquemas Pydantic para credenciales, deportistas, representantes, asistencia, evaluaciones y reportes. Además de tipos y longitudes, hay reglas como identificación por tipo, fechas de asistencia no futuras y rango cronológico de reportes. React valida campos antes de enviar formularios, pero una solicitud directa no pasa por React. La política de campos adicionales varía por esquema: algunos los rechazan y otros los ignoran. Los DAO consultados construyen filtros mediante SQLAlchemy; este patrón reduce la necesidad de concatenar SQL con entradas, pero el análisis estático no demuestra ausencia completa de inyección SQL. Tampoco las validaciones de campos demuestran protección completa frente a XSS. Los manejadores de excepciones estructuran errores de validación; las respuestas creadas en routers con texto de excepciones requieren comprobarse sin datos sensibles.

### Cifrado

Las contraseñas se almacenan como hash bcrypt y los JWT se **firman** con HS256; ninguna de estas operaciones cifra el contenido de un JWT. Para el despliegue local, la URL del navegador a la API y la URL interna del servicio de personas son HTTP, Nginx escucha en el puerto 80 y no se halló terminación TLS en Compose o Dockerfiles. El cliente de correo sí contempla SSL/STARTTLS, sin evidencia de conexión ejecutada. Tampoco se encontró cifrado de datos en reposo en la configuración del proyecto. `Settings` obtiene el secreto JWT y parámetros de base desde el entorno y `.gitignore` excluye `.env`, pero existen valores predeterminados sensibles versionados en configuración y Compose; este documento omite esos valores. El estado de un proxy, certificados o cifrado del anfitrión no se infiere del repositorio.

### Respaldo y recuperación

PostgreSQL y MariaDB usan volúmenes Docker persistentes. Estos conservan datos entre recreaciones ordinarias de contenedores, pero no acreditan copias separadas ni recuperación ante corrupción o pérdida del anfitrión. No se encontraron scripts automáticos, frecuencia, retención, procedimiento de restauración ni resultados de pruebas de recuperación versionados. La existencia de respaldos operados fuera del repositorio y la capacidad real de restaurar datos siguen pendientes de confirmación.

## 7. Relación con activos y amenazas de la matriz CIA

| Activo de la matriz | Capas relacionadas | Lectura del estado actual |
|---|---|---|
| **A-01** Datos de deportistas y representantes | Autorización, validación, cifrado en tránsito y respaldo | Hay esquemas y algunas operaciones protegidas; las inscripciones son públicas y varios accesos a atletas solo exigen autenticación. Sin TLS local ni respaldo documentado, la confidencialidad y recuperación dependen de controles no acreditados aquí. |
| **A-02** Credenciales y hashes; **A-03** JWT | Login, bcrypt, firma, expiración y sesión | Los mecanismos criptográficos de hash y firma están en código. La separación de tipos de token y la gestión de secretos tienen límites documentados. |
| **A-04** Usuarios y roles | Autorización de API y navegación | Crear o modificar usuarios exige Administrator, pero `GET /users/all` solo exige autenticación; la navegación React aplica una restricción distinta. |
| **A-05** Asistencia; **A-06** Evaluaciones | Validación de datos y autorización | Los esquemas revisan fechas, listas y campos; varios endpoints de seguimiento no aplican filtro de rol. |
| **A-07** Reportes | Autorización, filtros y exportación | FastAPI permite generar reportes a Administrator y Coach; React muestra la sección también a Intern. `ReportFilter` valida formato y rango de fechas. |
| **A-08** PostgreSQL; **A-10** servicio de personas/MariaDB | Persistencia, comunicaciones y respaldo | Los volúmenes conservan datos, mientras que copias y restauración no tienen evidencia versionada; la imagen Spring Boot no aporta código inspeccionable. |
| **A-09** API y datos en tránsito | JWT, CORS, esquemas, ORM y TLS | Existen controles a nivel aplicación, con cobertura variable por endpoint. El despliegue local declarado no configura HTTPS. |

## 8. Controles ausentes o insuficientes

| Control | Estado observado | Activo afectado | Riesgo potencial |
|---|---|---|---|
| Limitación de intentos de inicio de sesión | No encontrado en el código revisado | A-02, A-09 | Solicitudes reiteradas podrían no tener una barrera propia de la aplicación. |
| Separación de tipos de JWT en `get_current_account` | Parcial; no comprueba `type` ni `action` | A-03, A-09 | Un token firmado y vigente para otra finalidad podría ser aceptado como portador ordinario; falta verificar el comportamiento en un entorno controlado. |
| Autorización homogénea por rol | Parcial; difiere entre React y algunos routers | A-01, A-04, A-06, A-09 | Una operación podría estar disponible para un rol que la interfaz no presenta como autorizado. |
| Política estricta de CORS | Parcial; valor predeterminado amplio | A-09 | El alcance de orígenes admitidos puede ser mayor que el previsto; valor efectivo pendiente. |
| TLS del despliegue local web e interno | No encontrado en Compose, Nginx y URL del cliente | A-01–A-04, A-09, A-10 | Datos y tokens circularían sin cifrado de transporte si el entorno se usa tal como está declarado. |
| Cifrado de datos en reposo | No encontrado en configuración del proyecto | A-01, A-08, A-10 | Una copia de almacenamiento obtenida fuera de la aplicación podría revelar datos; cifrado del anfitrión desconocido. |
| Exclusión total de secretos del código | Parcial; algunas variables de entorno coexisten con valores predeterminados versionados | A-02, A-03, A-08, A-10 | El uso de valores predeterminados en un despliegue puede facilitar acceso no previsto. |
| Copias y restauración documentadas | No encontradas; solo volúmenes persistentes | A-01, A-05, A-06, A-08, A-10 | No se puede afirmar recuperabilidad ante corrupción o pérdida del anfitrión. |

Estas son observaciones de alcance de controles, no una lista de vulnerabilidades explotadas ni una evaluación OWASP Top 10. No se proponen aún dos mitigaciones por activo crítico.

## 9. Conclusión

Kallpa UNL cuenta con autenticación basada en contraseñas con hash bcrypt, JWT firmados con expiración, validaciones de servidor y cliente, acceso mediante ORM y persistencia en volúmenes. La autorización por rol y la separación de tokens tienen cobertura parcial; el despliegue local versionado no configura TLS ni un sistema de respaldo. La eficacia de CORS, correo, posibles controles externos y recuperación de datos requiere evidencia operacional. La combinación de capas importa especialmente para los datos personales y la API: las restricciones de una vista React no pueden sostener por sí solas la protección de un endpoint, del transporte ni de la información almacenada.
