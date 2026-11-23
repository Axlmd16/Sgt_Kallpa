# Registro de evidencias — APE 02, Fase 3

**Entorno:** stack local de Kallpa UNL levantado con `docker compose up -d` y contenedor local aislado de DVWA (`vulnerables/web-dvwa` en `127.0.0.1:4280`). **Cuentas de prueba:** cuenta y evaluación ficticias creadas únicamente durante la prueba y eliminadas al finalizar.

## Sesión 1 — Explotación controlada en laboratorio (DVWA)

| Código | Fecha | Qué demuestra | Evidencia |
|---|---|---|---|
| I01 | 19 nov 2026 | SQLi con comilla simple (`'`) en DVWA (nivel *Low*): error de sintaxis de MariaDB que confirma concatenación directa en la consulta SQL | [captura](capturas/I01-dvwa-sqli-comilla.png) · [salida](salida-pruebas-inyeccion.txt) |
| I02 | 19 nov 2026 | SQLi por tautología (`' OR '1'='1`) en DVWA (nivel *Low*): la condición `WHERE` se vuelve siempre verdadera y vuelca los 5 usuarios de la tabla | [captura](capturas/I02-dvwa-sqli-tautologia.png) · [salida](salida-pruebas-inyeccion.txt) |
| I03 | 19 nov 2026 | XSS reflejado (`<script>alert('XSS-APE02')</script>`) en DVWA (nivel *Low*): el navegador ejecuta el script no escapado y accede a `document.domain` y `document.cookie` | [captura](capturas/I03-dvwa-xss-reflejado.png) · [salida](salida-pruebas-inyeccion.txt) |

## Sesión 2 — Mitigación y verificación (DVWA y Kallpa UNL)

| Código | Fecha | Qué demuestra | Evidencia |
|---|---|---|---|
| I04 | 20 nov 2026 | Verificación de mitigación SQLi en DVWA (nivel *Impossible*, PDO `prepare` + `bindParam` + `is_numeric`): el payload `' OR '1'='1` devuelve 0 filas | [captura](capturas/I04-dvwa-sqli-mitigado.png) · [salida](salida-pruebas-inyeccion.txt) |
| I05 | 20 nov 2026 | Verificación de mitigación XSS en DVWA (nivel *Impossible*, `htmlspecialchars`): el script se codifica como `&lt;script&gt;...` y se muestra como texto literal | [captura](capturas/I05-dvwa-xss-mitigado.png) · [salida](salida-pruebas-inyeccion.txt) |
| I06 | 20 nov 2026 | Verificación contra XSS en Kallpa UNL (listado de evaluaciones en React): `<script>alert('XSS-APE02')</script>` e `<img src=x onerror=alert('XSS')>` se renderizan como texto inofensivo, sin ejecutar código | [captura](capturas/I06-kallpa-xss-escapado-react.png) · [salida](salida-pruebas-inyeccion.txt) |
| I07 | 20 nov 2026 | Verificación contra SQLi en Kallpa UNL (buscador y API): el payload `' OR '1'='1` viaja como parámetro enlazado (`%(name_1)s`) en SQLAlchemy y devuelve 0 coincidencias | [captura](capturas/I07-kallpa-sqli-bloqueado-busqueda.png) · [salida](salida-pruebas-inyeccion.txt) |
| I08 | 20 nov 2026 | Verificación en detalle de evaluación y motor Jinja2 de reportes PDF: las etiquetas `<script>` e `<img>` quedan escapadas como texto y entidades HTML (`&lt;script&gt;`) | [captura](capturas/I08-kallpa-xss-detalle-evaluacion.png) · [salida](salida-pruebas-inyeccion.txt) |

## Cómo reproducir

```bash
# 1. Levantar el stack de Kallpa UNL y el contenedor temporal de DVWA (solo en loopback)
docker compose up -d
docker run --rm -d --name dvwa-lab -p 127.0.0.1:4280:80 vulnerables/web-dvwa

# 2. Ejecutar el script reproducible de pruebas de inyección y verificación
cd Auditoria-Seguridad/APE-02/Fase-03/evidencias
AUDIT_EMAIL=<correo_prueba> AUDIT_PASSWORD='<clave_prueba>' ./pruebas-inyeccion.sh > salida-pruebas-inyeccion.txt

# 3. Detener el contenedor de laboratorio al terminar
docker stop dvwa-lab
```

## Reglas éticas y limpieza

- El contenedor DVWA se publicó exclusivamente en la interfaz local `127.0.0.1:4280` y se detuvo y eliminó (`--rm`) al concluir las capturas.
- En Kallpa UNL se utilizaron payloads de diagnóstico mínimos (`'`, `' OR '1'='1`, `<script>alert('XSS-APE02')</script>`) sobre una cuenta y una evaluación ficticias.
- No se modificó el código funcional del proyecto y los registros de prueba se limpiaron con:

```sql
DELETE FROM evaluations WHERE observations LIKE 'Registro ficticio APE02%';
DELETE FROM accounts    WHERE email = 'auditoria.fase3@ejemplo.com';
DELETE FROM users       WHERE dni = '9900000301';
```
