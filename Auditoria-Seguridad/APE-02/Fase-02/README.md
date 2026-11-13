# Fase 2 — Control de acceso y autenticación: análisis de JWT y prueba de IDOR

**Proyecto:** Kallpa UNL · **Asignatura:** Software Security · **Semana 6** (12 y 13 de noviembre de 2026)

| Actividad de la guía | Documento | Estado |
|---|---|---|
| S1-A1 Repaso de JWT e IDOR | [Reporte, sección 1](reporte-control-acceso.md#1-repaso-jwt-e-idor-s1-a1) | Completado |
| S1-A2 Laboratorio de análisis de tokens | [Reporte, secciones 2 y 3](reporte-control-acceso.md#3-resultados-del-análisis-del-token) y evidencia T01 | Completado |
| S1-A3 Registro de hallazgos | [Reporte, sección 4](reporte-control-acceso.md#4-registro-de-hallazgos-s1-a3): 5 hallazgos | Completado |
| S2-A1 Controles de referencia | [Reporte, sección 5](reporte-control-acceso.md#5-controles-de-referencia-s2-a1) | Completado |
| S2-A2 Laboratorio de pruebas IDOR | [Reporte, sección 6](reporte-control-acceso.md#6-pruebas-idor-y-control-de-roles-s2-a2), evidencias T02–T05 | Completado |
| S2-A3 Cierre del reporte | [Reporte, secciones 7–9](reporte-control-acceso.md#7-hallazgos-de-la-sesión-2-s2-a3) | Completado |
| Informe para el EVA | [Reporte-Fase2-Control-Acceso-Kallpa-UNL.docx](Reporte-Fase2-Control-Acceso-Kallpa-UNL.docx) | Completado |

| ID | Riesgo | Hallazgo |
|---|---|---|
| F2-01 | Alta | El refresh token de 7 días funciona como token de acceso. |
| F2-06 | Alta | IDOR: un usuario accede a evaluaciones de otros cambiando el id en la URL. |
| F2-02 | Media | No hay rotación ni revocación de tokens. |
| F2-03 | Media | Los tokens se guardan en `localStorage`. |
| F2-07 | Media | La autorización por rol no se aplica de forma homogénea. |
| F2-08 | Media | El evaluador se toma del cuerpo de la petición, no del token. |
| F2-04 | Baja | Correo y nombre completo dentro del token. |
| F2-05 | Baja | Faltan los claims `iss` y `aud`. |
