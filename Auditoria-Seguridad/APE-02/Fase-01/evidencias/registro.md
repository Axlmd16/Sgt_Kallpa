# Registro de evidencias — APE 02, Fase 1

**Fecha de ejecución:** 30 de octubre de 2026 · **Commit revisado:** `dae76d1` · **Entorno:** stack local levantado con `docker compose up -d` desde la raíz del repositorio.

Todas las evidencias se pueden reproducir con los scripts de esta carpeta. Las salidas enmascaran correos, cédulas y contraseñas. La única contraseña mostrada en claro es la de la cuenta de servicio `admin@admin.com`, que ya figura en `BackendFutbol/.env.example`.

| Código | Qué demuestra | Script | Salida |
|---|---|---|---|
| C01 | Contraseñas de Kallpa (PostgreSQL) guardadas con bcrypt, coste 10 y salt distinto por cuenta | [consultas-bd.sh](consultas-bd.sh) | [salida-consultas-bd.txt](salida-consultas-bd.txt) |
| C02 | Contraseñas del microservicio de personas (MariaDB) cifradas con AES-ECB de forma reversible; 85 de 85 descifrables con la clave por defecto | [consultas-bd.sh](consultas-bd.sh) | [salida-consultas-bd.txt](salida-consultas-bd.txt) |
| C03 | Comparación práctica de MD5, SHA-1, SHA-256, SHA-256 con salt, bcrypt y AES-ECB; ataque de diccionario y velocidades | [demo_hash_salt.py](demo_hash_salt.py) | [salida-demo-hash.txt](salida-demo-hash.txt) |
| C04 | Solo HTTP en los tres servicios; las seis cabeceras de seguridad revisadas no llegan al navegador | [cabeceras-http.sh](cabeceras-http.sh) | [salida-cabeceras-http.txt](salida-cabeceras-http.txt) |
| C05 | Secretos con valor por defecto en código, Compose, README y despliegue a Azure; `.env` nunca versionado | [busqueda-secretos.sh](busqueda-secretos.sh) | [salida-busqueda-secretos.txt](salida-busqueda-secretos.txt) |
| C06 | Datos personales y contraseñas en los logs del backend; token de recuperación registrado cuando no hay SMTP | [busqueda-secretos.sh](busqueda-secretos.sh) | [salida-busqueda-secretos.txt](salida-busqueda-secretos.txt) |
| C07 | PostgreSQL y MariaDB accesibles desde la red Wi-Fi con las credenciales por defecto | [consultas-bd.sh](consultas-bd.sh) | [salida-consultas-bd.txt](salida-consultas-bd.txt) |

## Cómo reproducir

```bash
docker compose up -d                       # desde la raíz del repositorio
cd Auditoria-Seguridad/APE-02/Fase-01/evidencias
./consultas-bd.sh       > salida-consultas-bd.txt
./cabeceras-http.sh     > salida-cabeceras-http.txt
./busqueda-secretos.sh  > salida-busqueda-secretos.txt
docker cp demo_hash_salt.py kallpa-backend:/tmp/
docker exec kallpa-backend /app/.venv/bin/python /tmp/demo_hash_salt.py > salida-demo-hash.txt
```

## Capturas opcionales para el informe

Si el docente exige capturas de CyberChef o del navegador, tomarlas con datos ficticios:

1. **CyberChef**, receta `MD5` con la entrada `Futbol2026!`: debe dar `b99da7bd04b1dcf2c5d63822d16c160a`, igual que la salida C03.
2. **CyberChef**, receta `From Base64` → `AES Decrypt` (clave `1234567FDUCAMETB` en UTF8, modo ECB) con la entrada `N3EivrWMd/0xRhzUNZhSEw==`: debe dar `Futbol2026!`.
3. **Navegador**, pestaña Red de las herramientas de desarrollador en `http://localhost:5173`: cabeceras de respuesta de `index.html`, sin `X-Frame-Options` ni `Content-Security-Policy`.
4. **Navegador**, petición `login` en la pestaña Red: la carga útil muestra el correo y la contraseña sobre `http://`.

## Límites éticos aplicados

- Solo se descifró la contraseña de la cuenta de servicio ya publicada. Para las otras 84 se comprobó si se podían descifrar, sin imprimir el resultado.
- No se modificaron datos ni código funcional. Todas las consultas son `SELECT`, `DESCRIBE` o `\d`.
- Las pruebas de red se hicieron desde el mismo equipo, contra su propia IP.
