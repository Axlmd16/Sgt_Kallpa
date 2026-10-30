# Plan de gestión de secretos — Kallpa UNL

**Guía:** APE 02, Fase 1, Sesión 2, Actividad 2 · **Fecha:** 30 de octubre de 2026
**Relacionado con:** [informe criptográfico](informe-criptografico.md), hallazgos F1-01, F1-02, F1-03, F1-05 y F1-07 · evidencia [C05](evidencias/salida-busqueda-secretos.txt)

## 1. Inventario de secretos

| # | Secreto | Para qué sirve | Dónde está hoy | Valor por defecto expuesto | Estado en Azure |
|---|---|---|---|---|---|
| S1 | `JWT_SECRET` | Firmar los tokens de sesión | `.env` local (propio, 43 caracteres) | Ejemplo en `.env.example` y README | GitHub Secret ✔ |
| S2 | `DB_PASSWORD` / `POSTGRES_PASSWORD` | Base del backend | `.env` y `docker-compose.yml:11` | `dev_password` (**en uso en local**) | GitHub Secret ✔ |
| S3 | `MARIADB_ROOT_PASSWORD` | Administración de MariaDB | `docker-compose.yml:27` | `rootpass` | GitHub Secret ✔ |
| S4 | `MARIADB_PASSWORD` | Base del microservicio | `docker-compose.yml:30,54` y `app.jar` | `desarrollo` (**en uso**) | GitHub Secret ✔ |
| S5 | `OTHERS_KEY` | Clave AES de las contraseñas del microservicio | `docker-compose.yml:63` y `app.jar` | `1234567FDUCAMETB` (**en uso**) | ✘ no definida |
| S6 | `PERSON_MS_ADMIN_PASSWORD` | Cuenta de servicio del backend ante el microservicio | `config.py:47` y `.env` | `12345678` (**en uso**) | ✘ no definida |
| S7 | `DEFAULT_ADMIN_PASSWORD` | Primer administrador creado por el seeder | `config.py:51` y `.env` | `Admin123!` (cambiado en local) | ✘ no definida |
| S8 | `SMTP_PASSWORD` | Envío de correos de recuperación | `.env` local | Ninguno | ✘ no definida (y, sin SMTP, los tokens van al log) |
| S9 | `AZURE_CREDENTIALS` | Despliegue a Azure Container Instances | GitHub Secrets | Ninguno | ✔ |
| S10 | `DOCKER_PASSWORD` | Publicar imágenes en Docker Hub | GitHub Secrets | Ninguno | ✔ |

Los valores fijos de `fastapi-ci.yml`, `staging-ci.yml` y `production-ci.yml` (`ci_password`, `secreto_staging` y otros) pertenecen a bases de prueba temporales que el CI crea y destruye. Son aceptables siempre que **no se reutilicen** en ningún entorno real.

## 2. Principios

1. **Ningún secreto con valor por defecto en el código.** Si falta un secreto, la aplicación no debe arrancar: es mejor fallar que funcionar con una clave pública.
2. **Un juego de secretos por entorno.** Desarrollo, CI y producción nunca comparten valores.
3. **Los secretos no se escriben en el repositorio, ni en los logs, ni en el frontend.**
4. **Mínimo privilegio y mínima exposición.** Las bases de datos solo son accesibles desde la red interna de Docker.
5. **Rotación planificada,** y rotación inmediata si un secreto se expone.

## 3. Medidas por componente

### 3.1 Código del backend (`app/core/config.py`)

Quitar los valores por defecto de los secretos para que Pydantic exija la variable:

```python
PERSON_MS_ADMIN_EMAIL: str
PERSON_MS_ADMIN_PASSWORD: str
DEFAULT_ADMIN_PASSWORD: str
```

Además, conviene añadir una validación al arranque que rechace valores conocidos o débiles, por ejemplo una longitud mínima de 32 caracteres para `JWT_SECRET` y una lista de valores prohibidos (`Admin123!`, `12345678`, `cambiar_este_secreto…`).

### 3.2 Docker Compose

- Reemplazar `${VAR:-valor}` por `${VAR:?Defina VAR en .env}` en las cinco variables sensibles. Compose se detiene si falta alguna.
- Quitar `ports` de `postgres`, `mariadb` y `app` (microservicio). El backend se conecta a ellos por nombre de servicio. Si en desarrollo se necesita un cliente gráfico, publicar solo en `127.0.0.1:5432:5432`.
- Crear un `.env` en la raíz (ya ignorado por git) para las variables de Compose y un `.env.example` sin valores reales.

### 3.3 Despliegue a Azure (`deploy-aci.yml`)

- Crear los GitHub Secrets `DEFAULT_ADMIN_PASSWORD`, `PERSON_MS_ADMIN_PASSWORD`, `OTHERS_KEY` y `SMTP_PASSWORD`, y pasarlos con `secureValue`, igual que `JWT_SECRET`.
- Pasar también `OTHERS_KEY` al contenedor `users-ms`, que hoy usa la clave incluida en `app.jar`.
- A mediano plazo, mover los secretos a **Azure Key Vault** y referenciarlos desde el contenedor, para no copiarlos en cada workflow.

### 3.4 Documentación y ejemplos

- `README.md:124` y `README.md:222` publican `12345678` y `Admin123!` como credenciales. Hay que sustituirlos por marcadores (`<generar>`).
- En `.env.example`, dejar todos los secretos vacíos o como `CAMBIAR_<nombre>`, con el comando para generarlos.

### 3.5 Logs

- Eliminar `logger.info(f"[DEBUG] Sending to MS: {person_payload}")` en `person_ms_service.py:36`, o registrar solo los campos no sensibles.
- Eliminar el registro del token en `email_client.py:179`. Si SMTP no está configurado en producción, la recuperación debe fallar con un error, no escribir el token en el log.
- Purgar los logs actuales del contenedor `kallpa-backend`, que ya contienen datos personales (evidencia C06).

## 4. Generación de secretos

```bash
# JWT_SECRET (64 caracteres URL-safe)
python -c "import secrets; print(secrets.token_urlsafe(48))"

# Contraseñas de bases de datos y cuentas de servicio
python -c "import secrets; print(secrets.token_urlsafe(24))"

# OTHERS_KEY: AES-128 exige exactamente 16 bytes
python -c "import secrets, string; a=string.ascii_letters+string.digits; print(''.join(secrets.choice(a) for _ in range(16)))"
```

`OTHERS_KEY` solo sirve mientras el microservicio siga usando AES. El objetivo es eliminarla (propuesta 6.2 del informe).

## 5. Rotación

| Secreto | Frecuencia | Efecto de rotar | Procedimiento |
|---|---|---|---|
| `JWT_SECRET` | Cada 6 meses o ante exposición | Cierra todas las sesiones activas | Cambiar el secreto y redesplegar. Avisar a los usuarios. |
| Contraseñas de bases | Cada 6 meses o ante exposición | Ninguno, si se actualiza a la vez en la base y en la app | `ALTER USER` y luego actualizar el secreto y redesplegar. |
| `PERSON_MS_ADMIN_PASSWORD` | Ante exposición | Ninguno | Cambiarla en el microservicio y luego en el secreto del backend. |
| `DEFAULT_ADMIN_PASSWORD` | Solo para el primer arranque | Ninguno | El administrador la cambia en su primer acceso. |
| `OTHERS_KEY` | **Inmediata** (es pública) | Inutiliza las contraseñas cifradas si no se vuelven a cifrar | Solo junto con la migración del microservicio. |

**Rotación inmediata recomendada hoy:** S2, S4, S5 y S6, porque son públicos y están en uso.

## 6. Prevención

- **Antes de cada commit:** instalar `gitleaks` como hook de pre-commit con reglas propias para patrones como `PASSWORD.*=.*"` y valores conocidos. Trivy no detectó ninguno de estos secretos (evidencia C05, punto 7), porque solo reconoce formatos conocidos.
- **En CI:** añadir el escaneo de secretos al workflow `fastapi-ci.yml`.
- **En revisión de código:** cualquier `str = "…"` en `config.py` sobre un campo con `PASSWORD`, `SECRET` o `KEY` se rechaza.

## 7. Lista de verificación

- [ ] `config.py` sin valores por defecto en S5, S6 y S7
- [ ] Compose usa `${VAR:?}` en todas las variables sensibles
- [ ] Puertos 5432, 3306 y 8096 retirados o limitados a `127.0.0.1`
- [ ] S2, S4, S5 y S6 rotados en local
- [ ] GitHub Secrets creados para S5, S6, S7 y S8, y usados en `deploy-aci.yml`
- [ ] README y `.env.example` sin credenciales reales
- [ ] `logger.info` sensibles eliminados y logs purgados
- [ ] `gitleaks` en pre-commit y en CI
