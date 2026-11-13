# Registro de evidencias — APE 02, Fase 2

**Entorno:** stack local levantado con `docker compose up -d`. **Cuentas de prueba:** cuentas y evaluaciones ficticias creadas solo para esta auditoría (ver [procedimiento-idor.md](procedimiento-idor.md)). Las contraseñas no están en el repositorio.

## Sesión 1 — Análisis del token

| Código | Fecha | Qué demuestra | Evidencia |
|---|---|---|---|
| T01 | 12 nov 2026 | Estructura, claims y vigencia de los tokens; refresh aceptado como token de acceso; sin rotación; almacenamiento en `localStorage` | [salida-analisis-token.txt](salida-analisis-token.txt) · [analisis-token.sh](analisis-token.sh) · [captura](capturas/T01-jwt-decodificado.png) |

## Sesión 2 — Pruebas IDOR y control de roles

| Código | Fecha | Qué demuestra | Captura |
|---|---|---|---|
| T02 | 13 nov 2026 | Un usuario lee evaluaciones de otros por su id (`GET /evaluations/{id}`) | [de A](capturas/T02-idor-lee-evaluacion-de-A.png) · [de B](capturas/T02-idor-lee-evaluacion-de-B.png) |
| T03 | 13 nov 2026 | Un usuario lista las evaluaciones de otro (`GET /evaluations/user/7`) | [captura](capturas/T03-idor-lista-evaluaciones-de-otro.png) |
| T04 | 13 nov 2026 | En la interfaz, un pasante ve y abre evaluaciones ajenas (con botón «Editar») | [listado](capturas/T04-ui-pasante-ve-evaluaciones-ajenas.png) · [detalle](capturas/T04-ui-pasante-abre-evaluacion-ajena.png) |
| T05 | 13 nov 2026 | Control de rol: `GET /users/interns` da 403 a un rol común y 200 a entrenador/admin | [403](capturas/T05-rol-bloqueado-403.png) · [200](capturas/T05-rol-permitido-200.png) |
| T06 | 13 nov 2026 | IDOR de modificación/eliminación: un pasante modifica (`PUT`) y elimina (`DELETE`) la evaluación de otro → 200 OK y luego 404 | [salida-idor-modificacion.txt](salida-idor-modificacion.txt) |

El procedimiento detallado de la Sesión 2 está en [procedimiento-idor.md](procedimiento-idor.md).

## Cómo reproducir la Sesión 1

```bash
cd Auditoria-Seguridad/APE-02/Fase-02/evidencias
AUDIT_EMAIL=<correo> AUDIT_PASSWORD='<contraseña>' ./analisis-token.sh > salida-analisis-token.txt
```

## Reglas éticas

Solo se usaron cuentas y evaluaciones ficticias, con la nota «Registro ficticio… No contiene datos reales». Las lecturas no exponen datos reales y las modificaciones de prueba se revierten. Todo se ejecutó en el entorno local.

## Limpieza al terminar la Fase 2

```sql
DELETE FROM accounts WHERE email LIKE 'auditoria.%@ejemplo.com' OR email LIKE 'captura-%@example.com';
DELETE FROM users    WHERE dni   LIKE '99000000%' OR full_name LIKE 'APE02 Captura%';
DELETE FROM evaluations WHERE observations LIKE 'Registro ficticio%';
```
