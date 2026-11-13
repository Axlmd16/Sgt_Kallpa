# Reporte de control de acceso — Kallpa UNL

**Asignatura:** Software Security · **Guía:** APE 02, Fase 2 (Semana 6) · **Commit revisado:** `54f6c46`
**Evidencias:** [registro de evidencias](evidencias/registro.md)

> Cubre la **Sesión 1** (análisis del token, 12 de noviembre de 2026) y la **Sesión 2** (pruebas IDOR y control de roles, 13 de noviembre de 2026).

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

## 5. Controles de referencia (S2-A1)

Antes de las pruebas se revisaron los tres controles que debería cumplir el acceso:

| Control | Qué exige | Estado en Kallpa |
|---|---|---|
| Autorización por objeto | Que el servidor compruebe que el recurso pedido pertenece al solicitante o que su rol lo autoriza, no solo que haya sesión. | **No se cumple** en evaluaciones (sección 6). |
| Expiración de sesión | Que un token vencido sea rechazado. | Se cumple: la firma y el `exp` se validan en `decode_token`. |
| Validación de la firma en el servidor | Que el servidor valide la firma con su propia clave y con el algoritmo que él fija. | Se cumple: `jwt.decode` con `algorithms=[JWT_ALGORITHM]` (Sesión 1, §3.4). |

## 6. Pruebas IDOR y control de roles (S2-A2)

Se usaron cuentas y evaluaciones ficticias. Un **usuario A** (rol pasante, `user_id` 6) y un **usuario B** (`user_id` 7), cada uno con una evaluación propia ("Evaluacion privada de A", id 3; "…de B", id 4). Procedimiento completo en [procedimiento-idor.md](evidencias/procedimiento-idor.md).

| # | Prueba | Petición | Resultado | Esperado |
|---|---|---|---|---|
| IDOR-1 | A lee la evaluación de B | `GET /evaluations/4` | 200 OK, datos de B (T02) | 403 ✘ |
| IDOR-2 | A lee otra evaluación ajena | `GET /evaluations/3` | 200 OK (T02) | 403 ✘ |
| IDOR-3 | A lista las evaluaciones de B | `GET /evaluations/user/7` | 200 OK, evaluación de B (T03) | 403 ✘ |
| IDOR-4 | Un pasante ve y abre evaluaciones ajenas en la interfaz, con botón «Editar» | Módulo Evaluaciones → Ver | Muestra las evaluaciones de A y B (T04) | Sin acceso ✘ |
| ROL-1 | Rol común en un endpoint de staff | `GET /users/interns` | **403 Forbidden** (T05) | 403 ✔ |
| ROL-2 | Rol autorizado en el mismo endpoint | `GET /users/interns` | 200 OK (T05) | 200 ✔ |

**Qué significa.** Las pruebas IDOR-1 a IDOR-4 demuestran una **autorización rota a nivel de objeto**: los endpoints `/evaluations/{id}` y `/evaluations/user/{id}` solo exigen una sesión válida (`get_current_account`), sin comprobar quién es el dueño ni el rol (`evaluation_router.py:58,88,117,162,199`; el controlador no filtra por dueño). Como `PUT` y `DELETE` de `/evaluations/{id}` usan la misma dependencia, el mismo acceso aplica a **modificar y eliminar**; la interfaz ya ofrece el botón «Editar» sobre un recurso ajeno. Esto no se demostró ejecutando una modificación destructiva, pero se deduce del mismo control ausente.

En cambio, ROL-1 y ROL-2 muestran que **otros endpoints sí aplican rol** (`get_current_coach_or_admin` en `user_router.py:30`, `get_current_admin` en activar/desactivar). El control existe, pero no se aplica de forma homogénea: ese es el problema de fondo.

## 7. Hallazgos de la Sesión 2 (S2-A3)

| ID | Hallazgo | Evidencia | Riesgo | Corrección propuesta |
|---|---|---|---|---|
| F2-06 | Cualquier usuario autenticado puede leer, y por el mismo control ausente modificar o eliminar, evaluaciones de otros cambiando el id en la URL (IDOR). | T02, T03, T04 | **Alta** | Verificar en cada endpoint de evaluaciones que el recurso pertenece al solicitante o que su rol lo autoriza, antes de devolver o modificar. |
| F2-07 | La autorización por rol se aplica en unos endpoints (usuarios) pero no en otros (evaluaciones, tests). El criterio no es homogéneo. | T04, T05 | **Media** | Definir una política central de autorización y aplicarla a todos los recursos con identificador, no caso por caso. |
| F2-08 | Al crear una evaluación, el evaluador se toma del campo `user_id` del cuerpo (`evaluation_controller.py:40`), no de la cuenta autenticada, por lo que se puede registrar a nombre de otro. | `evaluation_router.py:28` | **Media** | Tomar el evaluador del token (`current_account`) y no de la petición. |

## 8. Corrección propuesta (ejemplo)

Para F2-06, agregar la comprobación de dueño/rol en los endpoints de evaluaciones. En términos simples: antes de devolver o modificar una evaluación, el servidor debe confirmar que el usuario es administrador o el dueño del recurso; si no, responder 403. Hoy ese paso no existe y por eso devuelve 200 a cualquiera.

## 9. Consolidación

El reporte y sus evidencias se cargan en el repositorio del proyecto. La carpeta [`evidencias/capturas`](evidencias/capturas) contiene las pruebas visuales (T01 a T05). Las cuentas y datos ficticios se eliminan con el script de limpieza de [registro.md](evidencias/registro.md).
