# Fase 1 — Criptografía aplicada: hashing, salting y almacenamiento de credenciales

**Proyecto:** Kallpa UNL · **Asignatura:** Software Security · **Semana 5** (29 y 30 de octubre de 2026)
**Código revisado:** `dae76d1` con el stack local levantado mediante Docker Compose.

## Entregables

| Actividad de la guía | Documento | Estado |
|---|---|---|
| S1-A1 Repaso criptográfico | Resumen en la sección 2 del [informe criptográfico](informe-criptografico.md) | Completado |
| S1-A2 Laboratorio de verificación del almacenamiento | [Informe, sección 4](informe-criptografico.md#4-laboratorio-de-verificación-del-almacenamiento-s1-a2) y evidencias C01–C04 | Completado |
| S1-A3 Registro de hallazgos | [Informe, sección 5](informe-criptografico.md#5-registro-de-hallazgos-y-clasificación-de-riesgo-s1-a3): 8 hallazgos clasificados | Completado |
| S2-A1 Criterios de evaluación | [Informe, sección 3](informe-criptografico.md#3-criterios-de-evaluación-s2-a1) | Completado |
| S2-A2 Búsqueda de secretos y propuesta de migración | [Informe, sección 6](informe-criptografico.md#6-propuesta-de-migración-del-almacenamiento-de-contraseñas-s2-a2) y [plan de gestión de secretos](plan-gestion-secretos.md) | Completado |
| S2-A3 Informe de la fase | [Informe-Fase1-Criptografia-Kallpa-UNL.docx](Informe-Fase1-Criptografia-Kallpa-UNL.docx) para el EVA | Completado |
| Evidencias | [Registro de evidencias](evidencias/registro.md), con scripts reproducibles y salidas | Completado; capturas de CyberChef opcionales |

## Resultado en una línea por hallazgo

| ID | Riesgo | Hallazgo |
|---|---|---|
| F1-01 | Alta | El microservicio de personas guarda las contraseñas con AES-ECB reversible; 85 de 85 son descifrables con la clave por defecto. |
| F1-02 | Alta | Hay 6 secretos con valor por defecto en el código y en Compose; 4 están en uso. |
| F1-03 | Alta | El despliegue a Azure hereda `Admin123!`, `12345678` y la clave AES pública. |
| F1-04 | Alta | No hay HTTPS en local ni en Azure. |
| F1-05 | Alta | PostgreSQL y MariaDB son accesibles desde la red Wi-Fi con las credenciales por defecto. |
| F1-06 | Media | Las cabeceras de seguridad de nginx no llegan al navegador (herencia de `add_header`) y falta CSP. |
| F1-07 | Media | Datos personales, contraseñas y tokens de recuperación quedan en los logs. |
| F1-08 | Baja | bcrypt con coste 10 y passlib sin mantenimiento; se propone coste 12 y luego Argon2id. |

El backend Kallpa almacena las contraseñas correctamente, con bcrypt y salt por cuenta. Los problemas están en el microservicio externo, en la gestión de secretos y en el transporte.
