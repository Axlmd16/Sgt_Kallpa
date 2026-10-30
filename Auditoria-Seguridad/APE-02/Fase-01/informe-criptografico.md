# Informe criptográfico — Kallpa UNL

**Asignatura:** Software Security · **Guía:** APE 02, Fase 1 (Semana 5) · **Fecha:** 30 de octubre de 2026
**Proyecto:** [Sgt_Kallpa](https://github.com/Axlmd16/Sgt_Kallpa) · **Commit revisado:** `dae76d1`
**Evidencias:** [registro de evidencias](evidencias/registro.md) (C01 a C07)

## 1. Alcance y método

Se verificó cómo el sistema guarda y transmite la información sensible:

- contraseñas en las dos bases de datos: PostgreSQL del backend Kallpa y MariaDB del microservicio de personas;
- secretos de configuración;
- cifrado en tránsito.

Se levantó el stack completo con Docker Compose y se ejecutaron consultas SQL de solo lectura. Se compararon hashes con un script propio, que usa la misma librería y configuración del backend. Se inspeccionaron las cabeceras HTTP, se buscaron secretos de forma manual y con Trivy, y se revisó el workflow de despliegue a Azure.

Este informe cubre las seis actividades de la Fase 1. Las actividades de repaso (S1-A1 y S2-A1) aparecen solo como resumen en las secciones 2 y 3.

## 2. Resumen del repaso criptográfico (S1-A1)

| Concepto | Idea clave aplicada al proyecto |
|---|---|
| Función hash | Transforma una entrada en una huella de tamaño fijo y no se puede revertir. Es lo adecuado para contraseñas, porque el sistema solo necesita comprobarlas, no recuperarlas. |
| Cifrado | Sí es reversible: quien tiene la clave recupera el original. Sirve para datos que se deben volver a leer, pero **no para contraseñas**. |
| Salt | Valor aleatorio distinto por usuario que se mezcla con la contraseña antes del hash. Hace que dos contraseñas iguales generen hashes distintos e invalida las tablas precalculadas. |
| Algoritmos rápidos (MD5, SHA-1, SHA-256) | Están pensados para verificar archivos, no contraseñas. Un equipo común prueba cerca de un millón por segundo y una GPU, miles de millones. El salt no corrige esa velocidad. |
| Algoritmos lentos (bcrypt, Argon2id) | Tienen un coste ajustable que hace cada intento deliberadamente caro. Argon2id también consume memoria, lo que limita los ataques con GPU. Son los que recomienda OWASP. |
| Cifrado en tránsito | HTTPS (TLS) protege credenciales y tokens mientras viajan por la red. Se complementa con cabeceras como HSTS, CSP y X-Frame-Options. |

## 3. Criterios de evaluación (S2-A1)

| Criterio | Pregunta que responde | Resultado en Kallpa |
|---|---|---|
| Fortaleza del algoritmo | ¿Se usa un algoritmo lento y diseñado para contraseñas? | **Cumple** en el backend (bcrypt). **No cumple** en el microservicio (AES reversible). |
| Salt por usuario | ¿Cada contraseña tiene un salt único? | **Cumple** en el backend: 3 de 3 salts distintos. **No cumple** en el microservicio: AES-ECB sin IV ni salt. |
| Gestión de secretos | ¿Los secretos están fuera del código y sin valores por defecto? | **Parcial.** El `.env` nunca se versionó y el JWT real es propio, pero hay 6 secretos con valor por defecto en el código o en Compose. |
| Separación de entornos | ¿Desarrollo y producción usan secretos y configuraciones distintas? | **Parcial.** Azure usa GitHub Secrets para la base y el JWT, pero hereda tres valores por defecto de desarrollo. |
| Cifrado en tránsito | ¿Se usa HTTPS y las cabeceras llegan al navegador? | **No cumple**, ni en local ni en el despliegue a Azure. |

## 4. Laboratorio de verificación del almacenamiento (S1-A2)

### 4.1 Base del backend Kallpa (PostgreSQL) — evidencia C01

La tabla `accounts` guarda la columna `password_hash` (60 caracteres). Las tres cuentas existentes muestran el formato `$2b$10$<salt de 22 caracteres><hash>`:

| Cuenta | Algoritmo y coste | Salt |
|---|---|---|
| usuario1@ejemplo.com (admin) | `$2b$10$` | `E8y3nH7RBX/GNZopQSXLju` |
| usuario2@ejemplo.com (admin) | `$2b$10$` | `7qF5uQi3zdkj4X/KktcZru` |
| usuario3@ejemplo.com (entrenador) | `$2b$10$` | `WjWwMDATiwtI6gfWrbyM/u` |

Esto coincide con `BackendFutbol/app/utils/security.py:20`, que configura passlib con `schemes=["bcrypt"]` y `bcrypt__rounds=10`. También se comprobó que la contraseña del administrador **ya no es** `Admin123!`, el valor de ejemplo.

### 4.2 Base del microservicio de personas (MariaDB) — evidencia C02

La tabla `accounts` del microservicio tiene 85 cuentas con la columna `password`. Todas miden exactamente 24 caracteres. Ese tamaño corresponde a un único bloque AES de 16 bytes en Base64, no a un hash.

Al extraer el `app.jar` de la imagen `joseguaman1/users-docker:v1` se encontró:

- `application.properties` contiene `others.key` (valor redactado), la misma clave que el valor por defecto de `OTHERS_KEY` en `docker-compose.yml:63`;
- la clase `com/sport/user/security/AESUtil` usa `Cipher.getInstance("AES")`, que en Java equivale a **AES/ECB/PKCS5Padding**, y tiene métodos `encrypt` y `decrypt`.

Con esa clave se descifró la contraseña de la cuenta de servicio `admin@admin.com` y se obtuvo `12345678`, la misma que figura en `.env.example`. Después se comprobó, **sin mostrar el resultado**, que **85 de 85** contraseñas se descifran correctamente.

Factor que reduce el impacto: Kallpa no usa estas contraseñas para iniciar sesión. Al registrar a una persona, `person_ms_service.py:159` le envía al microservicio una contraseña aleatoria de usar y tirar, y la contraseña real del usuario queda en bcrypt en PostgreSQL. Aun así, la tabla contiene correos institucionales y la cuenta de servicio permite leer y modificar datos personales.

### 4.3 Comparación práctica de hashes con y sin salt — evidencia C03

Se usaron dos usuarios ficticios con la misma contraseña, `Futbol2026!`:

| Método | ¿Hashes iguales para la misma contraseña? | Intentos por segundo (1 núcleo) | Tiempo para 14 millones de contraseñas |
|---|---|---|---|
| MD5 sin salt | Sí (`b99da7bd…`) | ~900 000 | ~16 s |
| SHA-1 sin salt | Sí | ~1 030 000 | ~14 s |
| SHA-256 sin salt | Sí | ~1 030 000 | ~14 s |
| SHA-256 con salt | No | ~1 030 000 | ~14 s por usuario |
| **bcrypt coste 10 (Kallpa)** | No | **~9** | **~417 h por usuario** |
| AES-ECB (microservicio) | Sí (`N3EivrWM…`) | — | Instantáneo si se tiene la clave |

Conclusiones de la demostración:

1. Sin salt, la base revela qué usuarios comparten contraseña. Además, un hash MD5 se rompe con un diccionario en **0,02 ms**.
2. El salt resuelve la repetición, pero **no la velocidad**: SHA-256 con salt sigue siendo igual de rápido de atacar. Por eso la guía pregunta por qué MD5 o SHA-1 siguen siendo inseguros incluso con salt.
3. bcrypt es unas **96 000 veces** más lento por intento que MD5. Esa lentitud es justamente la defensa.
4. El cifrado del microservicio tiene los dos defectos a la vez. Es determinista, porque la misma contraseña da el mismo texto cifrado, y es reversible.

### 4.4 Cifrado en tránsito y cabeceras — evidencia C04

| Comprobación | Resultado |
|---|---|
| HTTPS en el frontend (5173), el backend (8001) y el microservicio (8096) | Ninguno responde por HTTPS. |
| Login `POST /api/v1/accounts/login` | Viaja por `http://` con el correo y la contraseña en texto claro. |
| Despliegue a Azure (`deploy-aci.yml`) | `FRONTEND_URL` y `ALLOWED_ORIGINS` usan `http://…azurecontainer.io` y solo publican los puertos 80 y 8000. |
| Cabeceras en `index.html`, `/login` y recursos | Faltan `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`. |

Sobre las cabeceras: `FrontendFutbol/nginx.conf:25-27` **sí declara** X-Frame-Options, nosniff y X-XSS-Protection en el bloque `server`. El problema es que los bloques `location` de las líneas 13 y 19 tienen su propio `add_header`, y en nginx eso anula todos los heredados del bloque superior. La prueba confirma lo que APE 01 (Fase 4, H07) había dejado como hipótesis.

## 5. Registro de hallazgos y clasificación de riesgo (S1-A3)

Escala: **Alta** = demostrado y explotable con poco esfuerzo, con impacto sobre credenciales o datos personales. **Media** = demostrado, pero requiere una condición adicional o tiene un impacto acotado. **Baja** = mejora sobre un control que ya es correcto.

| ID | Hallazgo | Evidencia | Riesgo | Corrección |
|---|---|---|---|---|
| F1-01 | El microservicio guarda las contraseñas con cifrado reversible AES-ECB y la clave está fija en la imagen; 85 de 85 son descifrables. | C02, C03 | **Alta** | Migrar a bcrypt o Argon2id y destruir la clave (sección 6.2). |
| F1-02 | Secretos con valor por defecto en `config.py` (`Admin123!`, `12345678`) y en `docker-compose.yml` (`dev_password`, `rootpass`, `desarrollo`, `OTHERS_KEY`). En local se usan `DB_PASSWORD` y `PERSON_MS_ADMIN_PASSWORD` de ejemplo. | C05 | **Alta** | Quitar los valores por defecto y hacer obligatorias las variables ([plan de secretos](plan-gestion-secretos.md)). |
| F1-03 | El despliegue a Azure no define `DEFAULT_ADMIN_PASSWORD`, `PERSON_MS_ADMIN_PASSWORD` ni `OTHERS_KEY`. Producción arrancaría con `Admin123!`, `12345678` y la clave AES pública. | C05 | **Alta** | Definirlos como GitHub Secrets con `secureValue`. |
| F1-04 | Sin HTTPS en local ni en Azure: credenciales y JWT viajan en claro. | C04 | **Alta** | Terminar TLS en un proxy inverso, redirigir 80→443 y activar HSTS. |
| F1-05 | PostgreSQL (5432) y MariaDB (3306) están publicados en `0.0.0.0` y aceptan conexiones por la IP de la red Wi-Fi con las credenciales por defecto. Combinado con F1-01, cualquiera en la misma red obtiene las 85 contraseñas. | C07 | **Alta** | No publicar los puertos de las bases o limitarlos a `127.0.0.1`, y cambiar sus credenciales. |
| F1-06 | Las cabeceras de seguridad declaradas en nginx no se aplican por la regla de herencia de `add_header`, y no hay CSP. | C04 | **Media** | Mover las cabeceras a un archivo incluido en cada `location` y añadir CSP y Referrer-Policy. |
| F1-07 | Los logs registran datos personales y la contraseña enviada al microservicio (`person_ms_service.py:36`) y, sin SMTP, el token de recuperación (`email_client.py:179`). Azure no configura SMTP. | C06 | **Media** | Eliminar esos `logger.info` o enmascarar los campos. No registrar tokens nunca. |
| F1-08 | bcrypt con coste 10 es el mínimo aceptable. passlib 1.7.4 ya no se mantiene y muestra un aviso con bcrypt 4.x. No hay rehash automático. | C01, C03 | **Baja** | Subir el coste a 12 con rehash al iniciar sesión, y luego migrar a Argon2id (sección 6.1). |

**Controles positivos comprobados:**

- bcrypt con salt único por cuenta;
- hash ficticio para igualar los tiempos de login (`account_controller.py:27`);
- `.env` nunca versionado (0 commits en el historial) y bien excluido en `.gitignore`;
- el `JWT_SECRET` local es propio (43 caracteres, no el de ejemplo);
- Azure toma `JWT_SECRET` y las contraseñas de las bases desde GitHub Secrets;
- ninguna variable `VITE_` con secretos en el frontend.

## 6. Propuesta de migración del almacenamiento de contraseñas (S2-A2)

### 6.1 Backend Kallpa: de bcrypt coste 10 a bcrypt 12 y luego a Argon2id

No hace falta una migración masiva: el algoritmo ya es adecuado. Se propone endurecerlo de forma gradual, aprovechando que el hash se puede rehacer en el momento del login, cuando el sistema tiene la contraseña en claro.

**Paso 1 (inmediato, sin romper nada).** Subir el coste mínimo y rehacer el hash al iniciar sesión:

```python
# app/utils/security.py
_pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__default_rounds=12,
    bcrypt__min_rounds=12,   # los hashes de coste 10 quedan marcados para actualizar
)

def verify_and_update(password: str, password_hash: str) -> tuple[bool, str | None]:
    return _pwd_context.verify_and_update(password, password_hash)
```

```python
# app/controllers/account_controller.py, dentro de login()
valid, new_hash = verify_and_update(payload.password, account.password_hash)
if not valid:
    raise UnauthorizedException(...)
if new_hash:
    account.password_hash = new_hash   # el usuario migra sin darse cuenta
    db.commit()
```

**Paso 2 (siguiente versión).** Reemplazar passlib por `pwdlib` con Argon2id como esquema principal y bcrypt solo para verificar los hashes antiguos. Se usarían los parámetros mínimos de OWASP: 19 MiB de memoria, 2 iteraciones y 1 hilo. El mismo `verify_and_update` convierte cada cuenta de `$2b$` a `$argon2id$` en su siguiente login.

**Paso 3.** Limitar la longitud máxima de la contraseña a 72 bytes en los validadores, porque bcrypt ignora lo que pasa de ese tamaño. También se puede aplicar un pre-hash documentado.

**Verificación:** una consulta que cuente cuántas cuentas siguen con coste 10, para seguir el avance de la migración:

```sql
SELECT left(password_hash, 7) AS esquema, count(*) FROM accounts GROUP BY 1;
```

### 6.2 Microservicio de personas: de AES-ECB a bcrypt

En este caso la reversibilidad, que es justo el defecto, también facilita la migración. Como las contraseñas se pueden descifrar, se convierten todas en una sola ejecución, sin esperar a que cada usuario inicie sesión.

1. **Contención inmediata** (no requiere el código fuente del microservicio):
   - quitar los `ports` de MariaDB (3306) y del microservicio (8096) en `docker-compose.yml`, porque el backend llega a ellos por la red interna de Docker;
   - cambiar `MARIADB_PASSWORD`, `MARIADB_ROOT_PASSWORD` y la contraseña de `admin@admin.com` por valores aleatorios.
2. **Migración** (requiere el código fuente o una nueva versión de la imagen):
   - añadir la columna `password_bcrypt`;
   - ejecutar un script único que, para cada cuenta, haga `bcrypt(decrypt(password))` y guarde el resultado;
   - cambiar el login de `AccountController` para que use `BCryptPasswordEncoder(12)` de Spring Security;
   - eliminar `AESUtil.decrypt`, borrar la columna antigua y destruir `others.key`.
3. **Alternativa si no se puede modificar la imagen:** como Kallpa no usa estas contraseñas, reemplazar las 85 por valores aleatorios largos y fijar un `OTHERS_KEY` propio, guardado como secreto. Esto reduce el impacto, pero no corrige el diseño, así que se debe reportar al responsable del microservicio.

**Advertencia:** cambiar solo `OTHERS_KEY` sin volver a cifrar deja inservibles las contraseñas existentes. La clave nueva y la conversión deben aplicarse en el mismo paso.

## 7. Plan de gestión de secretos (S2-A2)

Está detallado en [plan-gestion-secretos.md](plan-gestion-secretos.md). Incluye el inventario de los 10 secretos del proyecto, las reglas para cada entorno, la generación y rotación de claves, y los controles para que el problema no vuelva a aparecer.

## 8. Respuesta a la pregunta de control 1

> ¿Por qué MD5 o SHA-1 son inseguros incluso con salt? ¿Qué propiedades debe reunir un algoritmo como bcrypt?

El salt impide comparar contraseñas iguales y usar tablas precalculadas, pero no cambia la velocidad del algoritmo. En la evidencia C03, MD5 y SHA-1 se calculan a cerca de un millón por segundo en un solo núcleo. Con salt, el atacante simplemente prueba el diccionario contra cada usuario por separado, y aun así termina en segundos por cuenta. Un algoritmo de almacenamiento de credenciales necesita:

- **lentitud configurable** (factor de coste), que se pueda subir a medida que el hardware mejora;
- **salt aleatorio incorporado** en cada hash;
- **consumo de memoria** (Argon2id), para encarecer el ataque con GPU y hardware dedicado;
- **verificación en tiempo constante**.

En Kallpa, bcrypt redujo la velocidad de ataque de ~900 000 a ~9 intentos por segundo.
