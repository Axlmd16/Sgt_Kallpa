# Matriz de activos y amenazas — Fase 2 (8 de octubre)

**Asignatura:** Software Security · Universidad Nacional de Loja
**Proyecto:** Sgt_Kallpa / Kallpa UNL
**Integrantes consignados en la documentación previa:** Jostin Santiago Jimenez Ulloa; Jhostin Alexander Tapia Marquez; Elias Sebastian Poma Granda.

## Criterio de clasificación

**Alta** indica impacto grave sobre privacidad u operación; **Media**, afectación relevante pero recuperable; **Baja**, impacto limitado. Las valoraciones son preliminares y se basan en código y configuración, no en explotación. C, I y D representan confidencialidad, integridad y disponibilidad. La [ficha](../Fase-01/ficha-proyecto.md) y el [inventario](../Fase-01/inventario-superficie.md) delimitan el sistema analizado.

| ID | Activo | Tipo | Confidencialidad | Integridad | Disponibilidad | Amenaza principal |
|---|---|---|---|---|---|---|
| A-01 | Datos personales de deportistas y representantes, incluidos menores | Datos | Alta | Alta | Media | Consulta o alteración por un actor no autorizado |
| A-02 | Credenciales y hashes de cuentas | Identidad | Alta | Alta | Media | Compromiso de contraseña o cambio de cuenta indebido |
| A-03 | Tokens JWT de acceso y refresco | Sesión | Alta | Alta | Media | Sustracción y reutilización de token |
| A-04 | Datos de usuarios y asignaciones de rol | Datos | Alta | Alta | Media | Cambio no autorizado de rol o estado |
| A-05 | Registros de asistencia | Datos | Media | Alta | Media | Alteración o pérdida de asistencias |
| A-06 | Evaluaciones y resultados de pruebas deportivas | Datos | Media | Alta | Media | Manipulación de resultados |
| A-07 | Estadísticas y reportes exportados | Información derivada | Media | Alta | Baja | Exportación o distribución fuera del ámbito autorizado |
| A-08 | PostgreSQL y sus registros de aplicación | Almacenamiento | Alta | Alta | Alta | Acceso, corrupción o indisponibilidad de la base |
| A-09 | API FastAPI y enlace navegador–API | Servicio y tránsito | Alta | Alta | Alta | Uso de endpoints fuera de los permisos esperados |
| A-10 | Servicio de personas Spring Boot y MariaDB | Integración y almacenamiento | Alta | Alta | Media | Consulta indebida o falla de sincronización |

## Justificación individual y consecuencias

### A-01. Datos de deportistas y representantes

**Importancia:** sustentan la inscripción y la identidad de deportistas; el esquema de menores incluye representante, contacto y parentesco. **C Alta:** contiene DNI, contacto, dirección y datos de menores. **I Alta:** una identidad alterada puede asociar erróneamente a un menor y su representante. **D Media:** una caída temporal retrasa altas y consultas, aunque el servicio puede recuperarse. **Amenaza:** consulta o edición por un actor sin permiso suficiente; **consecuencia potencial:** exposición de privacidad o inscripciones incorrectas. Evidencia: [athlete_schema.py](../../../BackendFutbol/app/schemas/athlete_schema.py), [representative_schema.py](../../../BackendFutbol/app/schemas/representative_schema.py).

### A-02. Credenciales y hashes

**Importancia:** habilitan la autenticación y recuperación de acceso. **C Alta:** una contraseña conocida permitiría suplantación; los hashes requieren protección. **I Alta:** un cambio indebido bloquea al titular o concede acceso. **D Media:** fallos de cuentas impiden entrar a algunos usuarios, pero la disponibilidad general depende también de la API. **Amenaza:** compromiso de credenciales; **consecuencia:** acceso indebido a funciones protegidas. Evidencia: [account_schema.py](../../../BackendFutbol/app/schemas/account_schema.py), [security.py](../../../BackendFutbol/app/utils/security.py).

### A-03. Tokens JWT

**Importancia:** el cliente usa tokens de acceso y refresco y los guarda en `localStorage`. **C Alta:** su revelación permitiría reutilizar una sesión vigente. **I Alta:** la validación de firma y tipo debe preservar la identidad autorizada. **D Media:** la imposibilidad de renovar tokens interrumpe sesiones hasta un nuevo inicio. **Amenaza:** sustracción y reutilización; **consecuencia:** suplantación temporal de una cuenta. Evidencia: [http.js](../../../FrontendFutbol/src/app/config/http.js), [security.py](../../../BackendFutbol/app/utils/security.py).

### A-04. Usuarios y roles

**Importancia:** los roles `Administrator`, `Coach` e `Intern` regulan operaciones. **C Alta:** los registros de usuario incluyen identificación y correo. **I Alta:** alterar rol o estado cambia los permisos. **D Media:** la indisponibilidad dificulta administración y consultas, sin necesariamente detener todos los registros deportivos. **Amenaza:** cambio de rol no autorizado; **consecuencia:** privilegios indebidos o bloqueo de cuentas. Evidencia: [user_router.py](../../../BackendFutbol/app/services/routers/user_router.py), [rol.py](../../../BackendFutbol/app/models/enums/rol.py).

### A-05. Asistencia

**Importancia:** registra fecha, deportista, presencia y justificación. **C Media:** revela participación individual. **I Alta:** falsificar presencia distorsiona el seguimiento. **D Media:** una caída impide el registro oportuno de una jornada, con posibilidad de reconstrucción posterior. **Amenaza:** modificación indebida; **consecuencia:** historial de participación no confiable. Evidencia: [attendance_schema.py](../../../BackendFutbol/app/schemas/attendance_schema.py), [attendance_router.py](../../../BackendFutbol/app/services/routers/attendance_router.py).

### A-06. Evaluaciones y pruebas

**Importancia:** documentan rendimiento mediante evaluaciones y pruebas de velocidad, resistencia, YoYo y técnica. **C Media:** son datos individuales de rendimiento. **I Alta:** cambios de valores afectan seguimiento y estadísticas. **D Media:** una interrupción retrasa consulta o registro de pruebas. **Amenaza:** edición o eliminación indebida; **consecuencia:** decisiones deportivas basadas en resultados erróneos. Evidencia: [evaluation_router.py](../../../BackendFutbol/app/services/routers/evaluation_router.py), [sprint_test_router.py](../../../BackendFutbol/app/services/routers/sprint_test_router.py).

### A-07. Estadísticas y reportes

**Importancia:** consolidan asistencia, pruebas y métricas, con exportación PDF, XLSX y CSV. **C Media:** pueden incluir información individual; el alcance exacto de cada archivo requiere inspección de ejecución. **I Alta:** un reporte incorrecto comunica conclusiones falsas. **D Baja:** su falta temporal afecta análisis, sin impedir altas o asistencia. **Amenaza:** exportación o difusión fuera del ámbito autorizado; **consecuencia:** divulgación o interpretación incorrecta. Evidencia: [report_router.py](../../../BackendFutbol/app/services/routers/report_router.py), [report_schema.py](../../../BackendFutbol/app/schemas/report_schema.py).

### A-08. PostgreSQL

**Importancia:** persiste cuentas y registros deportivos de FastAPI. **C Alta:** reúne datos personales y de cuenta. **I Alta:** corrupción impacta varios módulos. **D Alta:** sin conexión fallan operaciones centrales y la comprobación de preparación. **Amenaza:** acceso o corrupción de la base; **consecuencia:** pérdida de datos e interrupción del sistema. Evidencia: [database.py](../../../BackendFutbol/app/core/database.py), [docker-compose.yml](../../../docker-compose.yml).

### A-09. API y datos en tránsito

**Importancia:** conecta navegador y backend y aplica dependencias de autenticación. **C Alta:** transporta tokens y datos personales. **I Alta:** solicitudes alteradas pueden afectar registros si se aceptan. **D Alta:** una caída impide casi todas las funciones del cliente. **Amenaza:** uso de un endpoint con permisos menos restrictivos que los de la interfaz; **consecuencia:** lectura o modificación de información fuera del rol previsto. El inventario muestra diferencias de controles, sin afirmar explotación. Evidencia: [main.py](../../../BackendFutbol/main.py), [security.py](../../../BackendFutbol/app/utils/security.py), [http.js](../../../FrontendFutbol/src/app/config/http.js).

### A-10. Servicio de personas y MariaDB

**Importancia:** la API integra identidades mediante un servicio Spring Boot asociado a MariaDB. **C Alta:** maneja datos de personas y contacto. **I Alta:** cambios divergentes causan incoherencia de identidad con PostgreSQL. **D Media:** su caída afecta operaciones dependientes de personas, aunque el alcance exacto requiere comprobar la aplicación. **Amenaza:** consulta indebida o falla de sincronización; **consecuencia:** exposición de datos o registros inconsistentes. El código interno de la imagen externa no está disponible para esta revisión. Evidencia: [person_client.py](../../../BackendFutbol/app/client/person_client.py), [person_ms_service.py](../../../BackendFutbol/app/client/person_ms_service.py), [docker-compose.yml](../../../docker-compose.yml).

## Priorización preliminar

Se priorizan **A-01** por datos de menores y representantes; **A-02–A-04** por control de identidad y permisos; **A-08** por concentración de registros; y **A-09** por centralizar operaciones y datos en tránsito. **A-10** también requiere atención por su acoplamiento con identidades y por la visibilidad limitada del servicio externo. Esta selección orienta la revisión entre pares del 8 de octubre. No se formula aún la propuesta de controles de la actividad del 9 de octubre.
