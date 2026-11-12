# Registro de evidencias — APE 02, Fase 2

**Entorno:** stack local levantado con `docker compose up -d`. **Cuenta de prueba:** `auditoria.coach@ejemplo.com` (rol entrenador, id 6, datos ficticios), creada solo para esta auditoría. Su contraseña no está en el repositorio.

| Código | Fecha | Qué demuestra | Script | Salida |
|---|---|---|---|---|
| T01 | 12 nov 2026 | Estructura, claims y vigencia de los tokens de acceso y refresh; refresh aceptado como token de acceso; sin rotación; almacenamiento en `localStorage` | [analisis-token.sh](analisis-token.sh) | [salida-analisis-token.txt](salida-analisis-token.txt) |

## Cómo reproducir

```bash
cd Auditoria-Seguridad/APE-02/Fase-02/evidencias
AUDIT_EMAIL=auditoria.coach@ejemplo.com AUDIT_PASSWORD='<contraseña>' ./analisis-token.sh > salida-analisis-token.txt
```

## Capturas sugeridas

1. **CyberChef**, receta *JWT Decode*, con el token de acceso de la cuenta de prueba: cabecera `HS256` y payload con `sub`, `role`, `exp`.
2. **Navegador**, herramientas de desarrollador → Aplicación → Almacenamiento local de `http://localhost:5173`, después de iniciar sesión: claves `kallpa_auth_token` y `kallpa_refresh_token`.

Usar solo tokens de la cuenta de prueba, que expiran en una hora. No pegar tokens de cuentas reales en sitios externos.

## Limpieza al terminar la Fase 2

```sql
DELETE FROM accounts WHERE email = 'auditoria.coach@ejemplo.com';
DELETE FROM users    WHERE dni   = '9900000001';
```
