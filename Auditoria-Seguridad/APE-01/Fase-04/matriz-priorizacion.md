# Matriz de priorización de hallazgos

**Proyecto:** Kalpa-UNL · **Fecha:** 22 de octubre de 2026 · **Edición:** OWASP Top 10:2025.

## Criterio de valoración

La puntuación es **impacto × probabilidad**, en escala de 1 a 5. Es una valoración contextual preliminar, no una puntuación CVSS ni una medición estadística. Impacto: 1 = efecto menor; 2 = exposición técnica limitada; 3 = afectación acotada de información u operación; 4 = acceso o modificación relevante de datos personales/deportivos; 5 = compromiso de una cuenta privilegiada o afectación amplia. Probabilidad: 1 = condiciones excepcionales; 2 = requiere acceso previo difícil o despliegue no verificado; 3 = escenario plausible con prerrequisitos; 4 = ruta accesible y pocos requisitos; 5 = exposición inmediata demostrada de forma repetible. No se asigna 5 a probabilidad sin esa demostración.

**Prioridad:** 1–4 baja; 5–9 media; 10–16 alta; 17–25 muy alta. En empates se atiende antes la exposición sin autenticación o la integridad de los registros. La certeza se registra por separado: S = estática; R = comunicada por el estudiante; C = condicionada a configuración, requisito o control externo no verificado. Las condiciones reducen la probabilidad, pero no eliminan el impacto potencial.

| Orden | ID y hallazgo | OWASP principal | CIA | Impacto | Probabilidad | Total | Prioridad | Evidencia y certeza |
|---|---|---|---|---:|---:|---:|---|---|
| 1 | H01 Permisos de API inconsistentes con los roles de la interfaz | A01 | C, I | 4 | 4 | 16 | Alta | E01, E02; S. Listado y borrado; sin borrado real durante la revisión. |
| 2 | H02 Consulta pública de datos personales de representantes por DNI | A01 | C | 4 | 4 | 16 | Alta | E03; S. Requiere conocer un DNI existente. |
| 3 | H03 Autenticación general sin distinguir el propósito del JWT | A07 | C, I | 5 | 3 | 15 | Alta | E04; S. Requiere un token válido de recuperación o renovación de la cuenta objetivo. |
| 4 | H04 Cambio de contraseña sin revocar sesiones ni refresh tokens anteriores | A07; relacionado A06 | C, I | 4 | 3 | 12 | Alta | E04, E05; S + R02. Requiere sesión previa. |
| 5 | H05 Enlace de recuperación reutilizable durante su vigencia | A07; relacionado A06 | C, I | 4 | 3 | 12 | Alta | E04, E05; S. Requiere poseer el enlace válido. |
| 6 | H06 Sin limitación de intentos en el login revisado | A07; relacionado A06 | C, D | 4 | 3 | 12 | Alta | E05, E06; S + R01. Éxito depende de credenciales y controles externos. |
| 7 | H11 Excepciones internas incluidas en respuestas al cliente | A10 | C | 3 | 3 | 9 | Media | E11; S. El detalle concreto depende del error. |
| 8 | H07 Perfil local sin endurecimiento suficiente para exposición externa | A02; relacionado A04 | C, I, D | 4 | 2 | 8 | Media | E07; S + C. Firewall, entorno y TLS externo no verificados. |
| 9 | H09 Token de recuperación escrito en logs cuando falta SMTP | A09 | C, I | 4 | 2 | 8 | Media | E10; S + C. Requiere activar esa rama y acceder al log. |
| 10 | H08 Imágenes mutables y garantías incompletas de cadena de suministro | A03; relacionado A08 | C, I, D | 4 | 2 | 8 | Media | E08; S + C. No se constató paquete comprometido ni CVE. |
| 11 | H10 Alertas y auditoría de autenticación no acreditadas | A09 | C, I, D | 3 | 2 | 6 | Media | E05, E10, G01; S + C. Puede existir monitoreo externo. |

## Condiciones y medidas para cerrar cada hallazgo

### H01 Permisos por rol inconsistentes

La interfaz reserva /users al administrador y configura canDeleteEvaluations=false para Coach e Intern. En el servidor, users/all y DELETE /evaluations/{evaluation_id} solo exigen cuenta activa. El controlador de borrado no recibe la identidad para comprobar un permiso adicional. La lectura exclusiva para administradores debe ratificarse como requisito; la discrepancia del borrado está documentada en los permisos del frontend. Crear y editar usuarios sí exige administrador.

**Mitigación:** definir una matriz rol × operación y aplicar dependencias de autorización en la API. **Cierre:** probar Administrator, Coach e Intern con registros ficticios; las operaciones prohibidas devuelven 403 y no alteran datos. Si la lectura es compartida por decisión del negocio, alinear la interfaz y minimizar los campos devueltos. **Responsable propuesto:** backend y responsable funcional.

### H02 Consulta pública de representantes

GET /representatives/by-dni/{dni} no exige autenticación. El controlador retorna nombre, DNI, teléfono, correo y, cuando responde el microservicio, dirección. La finalidad de facilitar una inscripción no justifica exponer el registro completo a quien conozca el identificador. No se consultaron personas reales para esta revisión.

**Mitigación:** rediseñar el flujo público con verificación de titularidad y respuestas mínimas; reservar los datos completos a roles autorizados. **Cierre:** una consulta anónima de un DNI ficticio existente no devuelve datos personales ni permite enumeración innecesaria; el flujo legítimo sigue funcionando. **Responsable propuesto:** backend y responsable de datos.

### H03 Propósito de los tokens

get_current_account valida firma, expiración, sub y cuenta activa, pero no exige un tipo de acceso. Los tokens de recuperación y renovación se firman con la misma configuración y también incluyen sub. Por ello, el código no impide usar esos tokens en la dependencia general de autenticación. La firma válida no garantiza que el token sea apropiado para esa operación. No se ejecutó una suplantación real.

**Mitigación:** incorporar y exigir un propósito explícito en cada token; separar validadores y, cuando corresponda, audiencias. **Cierre:** una prueba aislada con cuenta ficticia acepta access en recursos protegidos y rechaza refresh y reset; refresh y reset solo funcionan en sus operaciones previstas. **Responsable propuesto:** backend.

### H04 Revocación de sesiones

Cambiar o recuperar la contraseña actualiza el hash; no incrementa una versión de sesión ni revoca refresh tokens. El refresh se reutiliza. El estudiante informó persistencia en incógnito; queda por guardar una solicitud nueva posterior al cambio para descartar contenido en caché.

**Mitigación:** revocar sesiones según una política explícita de cambio y recuperación, usando estado de sesión o versión por cuenta; rotar refresh tokens. **Cierre:** tokens previos dejan de consultar datos y renovar acceso después de la revocación; un nuevo login válido funciona. **Responsable propuesto:** backend.

### H05 Recuperación sin consumo único

El reset caduca a los 900 segundos, pero confirmar el cambio no registra el token como consumido ni cambia un estado que lo invalide. La reutilización durante esa ventana es una conclusión del flujo de código; no se probaron dos cambios reales.

**Mitigación:** identificador aleatorio de recuperación, persistencia protegida y consumo atómico con caducidad. **Cierre:** el primer uso válido funciona, el segundo y cualquier uso expirado se rechazan; no se permite reutilización concurrente. **Responsable propuesto:** backend.

### H06 Intentos de login

No aparece un contador o limitador en el router, controlador o middleware revisados. Se comunicaron diez fallos seguidos sin restricción observable. Esto no prueba un número infinito de solicitudes ni descarta un proxy externo.

**Mitigación:** límites por cuenta y origen, esperas progresivas, alertas y protección adicional adaptativa; evitar bloqueos permanentes que permitan denegación de servicio contra una cuenta. **Cierre:** con umbrales previamente definidos, comprobar que los fallos activan la restricción del servidor, se registra el evento y la recuperación del acceso funciona. **Responsable propuesto:** backend y operaciones.

### H07 Configuración de despliegue

Compose publica PostgreSQL, MariaDB y Spring Boot en interfaces no limitadas explícitamente a localhost; la aplicación local utiliza HTTP. El CORS predeterminado es amplio y Nginx no define CSP. Existen cabeceras parciales. No se atribuye esta configuración a una producción no inspeccionada.

**Mitigación:** separar perfiles local y producción, restringir exposición de bases de datos, concretar orígenes, activar HTTPS y definir cabeceras compatibles con la aplicación. **Cierre:** verificar puertos accesibles desde redes previstas, cabeceras reales y CORS; documentar terminación TLS. **Responsable propuesto:** operaciones.

### H08 Cadena de suministro

Hay lockfiles y modos de instalación reproducibles para dependencias, pero las imágenes usan etiquetas mutables y uv:latest. No se encontró configuración local de CI con SCA o verificación de procedencia. Falta un inventario de vulnerabilidades de versiones e imágenes; no se inventan CVE.

**Mitigación:** fijar imágenes por digest, conservar procedencia y automatizar SCA de Python, npm e imágenes con actualización controlada. **Cierre:** resultados fechados, inventario de versiones, revisión de avisos aplicables y artefactos verificables. **Responsable propuesto:** mantenimiento y operaciones.

### H09 Secretos en registros

send_reset_email registra el reset_token si faltan host, puerto o remitente SMTP. La revisión no comprueba que esa rama esté activa; la exposición exige acceso a logs durante la vigencia del token.

**Mitigación:** eliminar tokens de los logs incluso en desarrollo y utilizar un capturador de correo local para pruebas. **Cierre:** una prueba sin SMTP registra únicamente un evento no sensible; no aparecen enlaces o tokens. **Responsable propuesto:** backend.

### H10 Detección y alertas

La guía acredita logs HTTP 401 y el código registra errores; no se encontró en el flujo de login un evento estructurado de seguridad con correlación y reglas de alerta. Una herramienta externa podría cubrirlo y debe verificarse antes de declarar ausencia absoluta.

**Mitigación:** registrar resultados de autenticación, fecha, origen e identificador de correlación sin secretos; definir reglas y responsables de respuesta. **Cierre:** ejecutar un escenario controlado, observar el evento y su alerta, o aportar evidencia de la herramienta externa. **Responsable propuesto:** backend y operaciones.

### H11 Errores y condiciones excepcionales

El manejador global devuelve un mensaje genérico, pero el auxiliar de routers incluye str(exc) y evaluaciones genera HTTPException con ese detalle. Estos caminos evitan la sanitización global. No se han probado caídas de base de datos ni mostrado consultas SQL reales. El inicio continúa tras errores de tablas/seeding y requiere evaluar readiness.

**Mitigación:** centralizar respuestas genéricas, conservar detalles sanitizados en el servidor con identificador de correlación y definir comportamiento de fallo de inicialización. **Cierre:** pruebas controladas de validación, recurso inexistente y excepciones simuladas no filtran rutas, consultas ni secretos; readiness refleja fallos críticos. **Responsable propuesto:** backend.

## Tres hallazgos seleccionados para APE 02

**H01:** revisar control de acceso en operaciones concretas, especialmente borrado de evaluaciones; no limitar la demostración a cambiar el rol visual.

**H02:** verificar con registros ficticios el alcance de la consulta pública de representantes y reducir exposición de datos personales.

**H03:** comprobar la separación entre tokens de acceso, renovación y recuperación. Corresponde a la validación de autenticación y complementa la revisión criptográfica: no implica ruptura de la firma.

H04–H06 conservan prioridad alta y cubren las demostraciones iniciales del estudiante. El examen de inyecciones de APE 02 queda pendiente porque la revisión actual no ha demostrado un fallo de esa clase.

No se ejecutan mitigaciones en esta fase documental. La repetición de pruebas después de corregir deberá conservar resultados esperados y obtenidos, fecha, versión del código y evidencias sin datos personales ni secretos.
