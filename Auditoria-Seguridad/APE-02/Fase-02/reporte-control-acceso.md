# Reporte de control de acceso — Kallpa UNL

**Asignatura:** Software Security · **Guía:** APE 02, Fase 2 (Semana 6) · **Commit revisado:** `54f6c46`
**Evidencias:** [registro de evidencias](evidencias/registro.md)

> Este corte cubre la **Sesión 1** (análisis del token de sesión, 12 de noviembre de 2026). Las pruebas IDOR y las correcciones de la Sesión 2 se agregarán en la sección 5.

## 1. Repaso: JWT e IDOR (S1-A1)

| Concepto | Resumen |
|---|---|
| Estructura de un JWT | Tiene tres partes en Base64URL separadas por puntos: **cabecera** (algoritmo y tipo), **payload** (claims: quién es el usuario, cuándo se emitió, cuándo expira) y **firma**. La cabecera y el payload solo están codificados, no cifrados: cualquiera puede leerlos. La firma impide modificarlos sin conocer la clave. |
| Algoritmo `none` | Un JWT puede declarar que no tiene firma. Si el servidor acepta lo que dice la cabecera, alguien podría fabricar un token sin firmar. La defensa es que el servidor fije en su código qué algoritmos acepta. |
| Tokens sin expiración | Un token robado sin `exp` funciona para siempre. La expiración limita el tiempo durante el cual se puede abusar de un token robado. |
| IDOR | Referencia directa insegura a objetos: el servidor entrega o modifica un recurso solo porque el usuario conoce su identificador (por ejemplo `/athletes/15`), sin comprobar si tiene permiso sobre ese recurso concreto. Es un fallo de autorización, no de autenticación. |

## 2. Método (S1-A2)

1. Se creó en la base local una cuenta de prueba con rol **entrenador** (`auditoria.coach@ejemplo.com`, id 6) y datos ficticios, para no usar cuentas reales.
2. Se inició sesión contra la API y se capturaron el token de acceso y el de renovación (refresh).
3. Se decodificaron la cabecera y el payload, y se analizaron el algoritmo, los claims y la vigencia. La decodificación se puede repetir en CyberChef (receta *JWT Decode*) o en jwt.io.
4. Se comprobó cómo responde una ruta protegida (`GET /athletes/all`) según el token enviado, y si el endpoint `/accounts/refresh` entrega un refresh nuevo.
5. Se revisaron en el código la validación del token (`security.py`) y dónde lo guarda el frontend.

Todo se reproduce con [analisis-token.sh](evidencias/analisis-token.sh). La salida está en [salida-analisis-token.txt](evidencias/salida-analisis-token.txt) (evidencia T01).

## 3. Resultados del análisis del token

### 3.1 Token de acceso

| Parte | Valor observado | Valoración |
|---|---|---|
| Cabecera | `{"alg": "HS256", "typ": "JWT"}` | HS256 con una clave de 43 caracteres propia del entorno (verificada en la Fase 1). Adecuado para una sola API. |
| `sub` | `"6"` | Identifica la cuenta. Correcto. |
| `iat` / `exp` | Emitido 15:16:31, expira 16:16:31 UTC | **Vigencia de 1 hora.** Correcto. |
| `role` | `"Coach"` | Solo informativo: el servidor vuelve a leer el rol desde la base de datos (`get_current_account`), así que cambiar este claim no da más permisos. |
| `email`, `full_name` | Correo y nombre completo | Datos personales legibles por cualquiera que vea el token. |
| Tipo de token | No existe un claim que diga "acceso" | Permite confundirlo con otros tokens (hallazgo F2-01). |
| `iss`, `aud`, `jti` | Ausentes | Sin emisor, sin destinatario y sin identificador único: no se puede revocar un token concreto. |

### 3.2 Token de renovación (refresh)

| Parte | Valor observado |
|---|---|
| Cabecera | `{"alg": "HS256", "typ": "JWT"}`, la misma clave que el de acceso |
| Claims | `sub`, `iat`, `exp`, `type: "refresh"` |
| Vigencia | **7 días** (604 800 segundos) |
| Renovación | `/accounts/refresh` devuelve **el mismo** refresh token: no hay rotación |

### 3.3 Comportamiento del servidor

| Prueba | Resultado | Esperado |
|---|---|---|
| Ruta protegida sin token | HTTP 401 | 401 ✔ |
| Ruta protegida con token de acceso | HTTP 200 | 200 ✔ |
| Ruta protegida con **refresh token** | **HTTP 200** | 401 ✘ |

La causa está en `BackendFutbol/app/utils/security.py:273`. `get_current_account` valida la firma y la expiración, pero solo lee `sub`: no comprueba el tipo de token. Por la misma razón, el token de recuperación de contraseña (`action: reset_password`, 15 minutos) también sería aceptado como sesión. Esto último se deduce del código, no se probó.

### 3.4 Validación de firma y algoritmo

`decode_token` (`security.py:195-198`) llama a `jwt.decode` con `algorithms=[settings.JWT_ALGORITHM]`. El algoritmo está **fijado por el servidor** y no se toma de la cabecera del token, de modo que un token con `alg: none` o con otro algoritmo es rechazado por la librería. python-jose también exige que la firma sea válida y que el token no haya expirado. Este punto se respalda con el código; la verificación dinámica de la firma corresponde a los controles de la Sesión 2.

### 3.5 Almacenamiento en el navegador

El frontend guarda en `localStorage` el token de acceso (`kallpa_auth_token`), el refresh (`kallpa_refresh_token`) y los datos del usuario (`AuthProvider.jsx:81-84`). Cualquier script que se ejecute en la página puede leerlos, así que una falla XSS (Fase 3) permitiría robar el refresh de 7 días.

## 4. Registro de hallazgos (S1-A3)

| ID | Hallazgo | Evidencia | Riesgo | Corrección propuesta |
|---|---|---|---|---|
| F2-01 | El refresh token (7 días) se acepta como token de acceso; lo mismo ocurriría con el de recuperación. La expiración de 1 hora pierde su efecto. | T01 §4, `security.py:273` | **Alta** | Agregar `type: "access"` al token de acceso y exigirlo en `get_current_account`. Usar una clave distinta para cada tipo de token. |
| F2-02 | No hay rotación ni revocación: el refresh se reutiliza, no hay `jti` y cerrar sesión o cambiar la contraseña no invalida los tokens ya emitidos. | T01 §5; APE 01 H04 | **Media** | Rotar el refresh en cada renovación, guardar su `jti` y añadir un contador `token_version` en `accounts` que se incremente al cerrar sesión o cambiar la contraseña. |
| F2-03 | Los tokens se guardan en `localStorage`, accesibles para cualquier script de la página. | T01 §6 | **Media** | Mover el refresh a una cookie `HttpOnly`, `Secure` y `SameSite=Strict`, y mantener el de acceso solo en memoria. |
| F2-04 | El payload incluye correo y nombre completo, legibles sin la clave. | T01 §2 | **Baja** | Dejar solo `sub`, `role`, `type`, `iat`, `exp` y `jti`; obtener los datos del perfil desde la API. |
| F2-05 | Faltan los claims `iss` y `aud`. | T01 §2 | **Baja** | Añadirlos y validarlos en `jwt.decode`. |

**Controles positivos:** algoritmo fijado en el servidor (protege frente a `alg: none`), expiración presente y verificada, vigencia corta del token de acceso, rol leído desde la base de datos y no desde el token, rechazo de cuentas inactivas y clave de firma propia.

## 5. Pruebas IDOR y correcciones (Sesión 2)

*Pendiente: se completará el viernes 13 de noviembre.*
