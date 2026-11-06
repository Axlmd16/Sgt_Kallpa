# Fase 4 — Lista de cotejo OWASP Top 10 y priorización

**Proyecto:** Kalpa-UNL · **Asignatura:** Software Security · **Fecha de revisión:** 22 de octubre de 2026.
**Referencia:** OWASP Top 10:2025. **Código revisado:** `dae76d130211b1b051456e87dfd213f2dd60bc1a` y archivos locales de esta fecha.

La revisión identifica debilidades de autorización, gestión de tokens y exposición de información. También reconoce controles existentes: contraseñas con bcrypt, validación de contraseñas en el servidor, consultas mediante SQLAlchemy y comprobaciones de administrador en determinadas operaciones. No se concluye que todas las funciones sean vulnerables ni que todas las categorías estén completamente verificadas.

## Objetivo y alcance

Completar la Actividad 3 de la sesión 1 de la Fase 4, sistematizando la evidencia por categoría, y preparar la matriz de impacto y probabilidad de la sesión 2. Se revisaron React, FastAPI, Docker Compose, los archivos de dependencias y la configuración de Nginx. El microservicio externo de personas se evaluó solo a través de la integración y su configuración; no se dispone aquí de una revisión de su código fuente.

Se contrastó el avance de `APE_Guia_01_Analisis_y_Superficie_de_Ataque_del_Proyecto-signed-signed-firmad (1).docx`, el manual de aula de OWASP 2025 y `Avance_Practica_OWASP_Top10_2025(1).json`. La guía solicita una conclusión por categoría, pero no contiene una tabla específica cumplimentable en el apartado del entregable. Por ello se utiliza la tabla de categoría, resultado, evidencia y conclusión que sigue, y se conserva aparte el autorregistro del manual.

**Método:** revisión estática reproducible y contraste con las pruebas comunicadas por el estudiante. No se ejecutaron ataques, consultas de datos personales, cambios de contraseñas ni modificaciones funcionales durante esta revisión. No se ejecutó un escáner de dependencias ni se comprobó el despliegue de producción. Los resultados del simulador de aula no se consideran pruebas sobre Kalpa-UNL.

**Tipos de evidencia:** E = código o configuración conservados con líneas y hashes en [el registro de evidencias](evidencias/registro.md); R = observación previa comunicada por el estudiante; G = contenido del avance de la guía. Una observación R no equivale a una prueba HTTP reproducida por esta revisión.

**Estados:** No cumple = existe una deficiencia concreta en el alcance revisado; Parcial = existen controles y limitaciones; Pendiente = falta evidencia para resolver una comprobación. Una categoría con controles positivos no se declara segura en su totalidad.

## Actividad 3 — Lista de cotejo por categoría

| Categoría OWASP 2025 | Control o aspecto revisado | Resultado | Evidencia y hallazgos | Conclusión fundamentada |
|---|---|---|---|---|
| A01 Broken Access Control | Autorización por rol en la API, consultas de datos personales y coherencia con la interfaz | No cumple | E01, E02, E03; H01 y H02 | La API permite listar usuarios con cualquier cuenta activa. El borrado de evaluaciones solo exige autenticación, aunque la configuración de permisos de la interfaz lo reserva al administrador. La consulta de representantes por DNI es pública y devuelve datos personales. Existen comprobaciones de administrador en crear y editar usuarios: el fallo no afecta por igual a todos los endpoints. |
| A02 Security Misconfiguration | Puertos publicados, documentación, CORS y cabeceras | Parcial | E07; H07 | Compose publica bases de datos y el microservicio sin limitar explícitamente la interfaz a loopback; el acceso real depende del firewall y de la red. Nginx configura DENY y nosniff a nivel de servidor, pero sus bloques con add_header pueden alterar la herencia según la versión. No aparece CSP. La configuración CORS predeterminada es amplia; no se comprobó el valor efectivo del entorno. Falta verificar cabeceras reales y endurecer el perfil de despliegue. |
| A03 Software Supply Chain Failures | Versiones, archivos de bloqueo, procedencia y análisis de dependencias | Parcial; CVE pendientes | E08; H08 | npm ci y uv sync --frozen utilizan archivos de bloqueo. Docker usa etiquetas mutables, incluida uv:latest, sin digest fijado. No se encontró un flujo de CI en .github/workflows. Sin un informe SCA actualizado no se puede afirmar que existan o no componentes con CVE explotables. |
| A04 Cryptographic Failures | Hash de contraseñas, firma de tokens y protección del transporte | Parcial | E04, E07 | Las contraseñas usan bcrypt y los JWT se verifican con el algoritmo configurado. El entorno local usa HTTP, y no se encontró terminación TLS en el Compose revisado. Esto no demuestra que un despliegue externo carezca de HTTPS ni que la clave JWT efectiva sea débil. Antes de desplegar, verificar TLS, gestión de claves y protección de datos en reposo. |
| A05 Injection | Consultas a base de datos y tratamiento de contenido en React | Parcial; explotación no demostrada | E09 | Las consultas de cuentas y filtros revisados usan SQLAlchemy. Construir el patrón de ilike con una cadena no equivale por sí solo a concatenar SQL ejecutable. La búsqueda en src no encontró dangerouslySetInnerHTML ni innerHTML; ello no descarta todos los vectores XSS. No se demostró SQLi, XSS ni inyección de comandos; faltan pruebas de entradas y salidas representativas. |
| A06 Insecure Design | Abuso de recuperación, revocación de sesiones y confianza en datos del navegador | No cumple | E01, E04, E05; R02; H01, H04 y H05 | La recuperación utiliza enlaces con vencimiento de 15 minutos, pero no registra su consumo. Cambiar la contraseña no revoca sesiones previas. La interfaz decide rutas a partir de un rol editable; la seguridad depende de que el servidor aplique los permisos. Estos casos deben incorporarse como escenarios de abuso al diseño. No se duplican sus puntuaciones en la matriz. |
| A07 Authentication Failures | Límites de login, propósito de tokens, revocación y política de contraseñas | No cumple | E04, E05, E06; R01 y R02; H03, H04, H05 y H06 | Se informó de diez fallos seguidos sin bloqueo observado y no se encontró limitación en el flujo revisado. La autenticación general no distingue un token de acceso de uno de renovación o recuperación. Las contraseñas nuevas sí se validan en el servidor. No es correcto afirmar que se probaron infinitos intentos. |
| A08 Software or Data Integrity Failures | Integridad de tokens y artefactos; confianza en el estado del cliente | Parcial | E01, E04, E08; H03 y H08 relacionados | Los JWT tienen firma y los archivos de bloqueo incluyen información de integridad. Editar kallpa_user_data no altera la firma del JWT ni el rol en la base de datos. No se encontró una verificación explícita de firma o procedencia de imágenes en la configuración revisada. No se demostró una actualización maliciosa ni una deserialización insegura. |
| A09 Security Logging and Alerting Failures | Registro de fallos, alertas y exclusión de secretos | Parcial | E10; G01; H09 y H10 | El avance documenta respuestas 401 en registros y el código registra errores: no hay ausencia total de logs. No se encontró una regla de alertas de autenticación en el código revisado; un servicio externo no está descartado. Si falta la configuración SMTP, el código escribe el token de recuperación en logs, lo cual expone un secreto reutilizable. |
| A10 Mishandling of Exceptional Conditions | Mensajes al cliente, manejadores globales y fallos de inicio | No cumple | E11; H11 | Hay un manejador global con mensaje genérico, pero varios routers capturan excepciones y devuelven str(exc) antes de llegar a él. Esto permite filtrar detalles según el error producido. El inicio también captura fallos de creación de tablas y continúa; debe comprobarse su efecto en readiness. No se afirma haber obtenido una traza SQL real durante esta revisión. |

## Comprobaciones específicas de la guía

| Ítem solicitado | Resultado sustentado | Comprobación adicional necesaria |
|---|---|---|
| Sesiones | H03 y H04 documentan propósito de tokens y ausencia de revocación. | Repetir con una cuenta ficticia y guardar respuestas HTTP antes y después del cambio de contraseña. |
| Tokens CSRF | La API revisada utiliza Authorization: Bearer añadido por JavaScript, no una cookie de autenticación enviada automáticamente. La falta de token CSRF no demuestra por sí sola una vulnerabilidad en este esquema. E12. | Confirmar que ninguna ruta protegida acepte autenticación ambiental por cookies; revisar CORS efectivo. Si se migra a cookies, definir SameSite y protección CSRF. |
| Cabeceras | Se observan directivas de seguridad parciales en Nginx; no hay CSP en ese archivo. E07. | Capturar cabeceras de index.html, assets y API; no asumir que las directivas se aplican a todas las respuestas. |
| Contraseñas | bcrypt y validadores de longitud y composición en cambio y recuperación; mensaje genérico de login y hash ficticio cuando no existe la cuenta. E04 y E06. | Comprobar la política en todos los caminos de alta y cambio; verificar valores efectivos sin publicar secretos. |
| Exposición de datos | Consulta pública de representantes y listado de usuarios autenticado sin rol específico. E02 y E03. | Validar con datos ficticios la respuesta y formalizar quién está autorizado a consultar cada campo. |
| Componentes vulnerables | Se dispone de package-lock.json y uv.lock, pero no de un informe SCA actualizado. E08. | Ejecutar npm audit, auditoría Python y escaneo de imágenes; conservar fecha, versiones y condiciones de cada aviso. |

## Evidencias procedentes del trabajo previo

- **R01:** el estudiante comunicó diez intentos de login fallidos sin bloqueo ni espera observados. No se conserva aquí una secuencia de diez respuestas con tiempos; no se afirma ausencia de límites en infraestructura no revisada.
- **R02:** el estudiante comunicó que una ventana de incógnito seguía mostrando datos después de cambiar la contraseña en otra sesión. El código respalda la falta de revocación. Para evidencia dinámica concluyente se debe conservar una nueva respuesta de la API tras el cambio, no solo la pantalla cargada.
- **R03:** se discutió y comunicó la visualización de información administrativa tras modificar el rol del navegador. La captura aportada muestra almacenamiento local con rol Coach, no una respuesta administrativa HTTP. El soporte concluyente actual de H01 es estático; no se atribuye a la captura una escalada de privilegios demostrada.
- **G01:** el avance de la guía describe fallos 401 registrados, una restricción de interfaz para pasantes, recuperación por correo y requisitos de contraseña. Son controles o indicios que requieren su alcance preciso; no son cinco fugas de información confirmadas.

## Correcciones fundamentadas al avance de la guía

1. Clasificar los intentos repetidos principalmente en A07:2025, con A06 como relación de diseño; no convertir diez intentos en una prueba de infinitud.
2. Sustituir «posible ausencia de caducidad del enlace» por «enlace con 15 minutos de vigencia sin consumo de un solo uso». E04 y E05.
3. Retirar como hallazgo confirmado la validación de contraseñas solo en frontend: los validadores del backend existen. E06.
4. Diferenciar modificar el rol de kallpa_user_data y modificar un JWT. El primero altera el estado del navegador; no cambia el rol persistido.
5. Sustituir la criticidad basada en «si no se verifica» por puntuaciones apoyadas en rutas y controles concretos. La matriz no usa «crítica» para hipótesis sin condiciones verificadas.
6. La sección de errores de la guía no acredita todavía cinco errores distintos con fuga, corrección y comprobación posterior. Completar la Fase 4 no sustituye esa evidencia de la Fase 3.

## Autorregistro del manual de aula

La columna «Realizada» corresponde al simulador, no a la revisión estática del proyecto. Se transcribe el avance JSON sin inventar prácticas terminadas.

| Práctica | Realizada según el avance | Hallazgo en Kalpa-UNL | Observaciones |
|---|---|---|---|
| A01 — La factura ajena | Marcada completa; pasos 1 y 3 marcados | H01, H02 | Hay inconsistencia entre completed y los pasos; no se corrige como ejecutado el paso 2. |
| A02 — La radiografía del servidor | Sí | H07 | Revisar configuración efectiva. |
| A03 — El escáner de dependencias | Sí | H08 | Simulación terminada no equivale a escaneo real del proyecto. |
| A04 — La carrera del hash | Sí | Controles positivos y transporte pendiente | bcrypt en el proyecto; HTTPS externo no verificado. |
| A05 — El login que se deja engañar | Parcial, pasos 1 y 2 | No se demostró inyección | No marcar como vulnerable por analogía con el simulador. |
| A06 — Dos diseños, dos finales | No registrada | H04, H05 relacionados | Revisión del proyecto completada dentro del alcance descrito. |
| A07 — Fuerza bruta con y sin freno | No registrada | H03 a H06 | R01 y R02 son pruebas del proyecto comunicadas aparte. |
| A08 — El paquete alterado | No registrada | H08 relacionado | Falta verificación de procedencia de imágenes. |
| A09 — El ataque invisible | Parcial, paso 1 | H09, H10 | Hay logs; alertas externas no verificadas. |
| A10 — Dos pantallas de error | Parcial, paso 1 | H11 | Manejadores con resultados inconsistentes. |

## Matriz de priorización y entrega a APE 02

La [matriz de priorización](matriz-priorizacion.md) asigna impacto y probabilidad, identifica condiciones de explotación, propone mitigaciones y fija criterios de cierre para once hallazgos. Los tres primeros son H01, H02 y H03. La selección amplía las tres demostraciones iniciales porque la revisión encontró una consulta pública de datos personales y una validación insuficiente del propósito del token.

Se completa el registro de las diez categorías con las evidencias disponibles; las verificaciones dinámicas, SCA y de producción pendientes quedan expresamente identificadas. Este documento no constituye una certificación de seguridad ni acredita pruebas no realizadas.

## Fuentes

- Guía APE 01 aportada, Fase 4, Actividad 3 y rúbrica de mapeo OWASP; archivo original conservado en Descargas.
- Manual_Practica_Aula_OWASP_Top10_2025.docx, sección 8; avance JSON de la práctica con sufijo (1).
- Código local y configuración identificados en [el registro trazable](evidencias/registro.md).
- OWASP Foundation, [OWASP Top 10:2025](https://top10.owasp.org/2025/), consultado el 22 de octubre de 2026. La numeración y los nombres de las categorías proceden de esta edición; los hallazgos y sus puntuaciones proceden del análisis del proyecto.
