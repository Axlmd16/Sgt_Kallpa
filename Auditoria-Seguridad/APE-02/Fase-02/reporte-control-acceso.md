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

## 6. Laboratorio de pruebas IDOR (S2-A2)

Se usaron cuentas y evaluaciones ficticias: un **entrenador A** y un **entrenador B**, cada uno con su evaluación propia, y un **pasante** (rol más bajo). Procedimiento completo en [procedimiento-idor.md](evidencias/procedimiento-idor.md). Se cubren los tres escenarios obligatorios de la rúbrica.

### Escenario 1 — IDOR horizontal: leer datos de otro usuario

| Prueba | Petición | Resultado | Esperado |
|---|---|---|---|
| A lee la evaluación de B | `GET /evaluations/4` | 200 OK, devuelve datos de B (T02) | 403 ✘ |
| A lee otra evaluación ajena | `GET /evaluations/3` | 200 OK (T02) | 403 ✘ |
| A lista las evaluaciones de B | `GET /evaluations/user/7` | 200 OK, evaluación de B (T03) | 403 ✘ |
| En la interfaz, un pasante ve y abre evaluaciones ajenas | Módulo Evaluaciones → Ver | Las muestra, con botón «Editar» (T04) | Sin acceso ✘ |

### Escenario 2 — IDOR en modificación y eliminación (PUT/DELETE con id ajeno)

Un **pasante**, que no es el dueño, modificó y luego eliminó una evaluación de otro usuario (evidencia T06, [salida-idor-modificacion.txt](evidencias/salida-idor-modificacion.txt)):

| Prueba | Petición | Resultado | Esperado |
|---|---|---|---|
| El pasante modifica la evaluación de B | `PUT /evaluations/3` | **200 OK**; las observaciones quedaron cambiadas | 403 ✘ |
| El pasante elimina la evaluación de B | `DELETE /evaluations/3` | **200 OK**; luego `GET` devuelve 404 | 403 ✘ |

### Escenario 3 — Control de roles (usuario común vs. administrador)

| Prueba | Petición | Resultado | Esperado |
|---|---|---|---|
| Rol común en un endpoint reservado a staff | `GET /users/interns` | **403 Forbidden** (T05) | 403 ✔ |
| Rol autorizado (entrenador/admin) en el mismo endpoint | `GET /users/interns` | 200 OK (T05) | 200 ✔ |

**Qué significa.** Los escenarios 1 y 2 demuestran una **autorización rota a nivel de objeto**: los endpoints `/evaluations/{id}` y `/evaluations/user/{id}` solo exigen una sesión válida (`get_current_account`), sin comprobar quién es el dueño ni el rol (`evaluation_router.py:58,88,117,162,199`; el controlador no filtra por dueño). El escenario 3 muestra que otros endpoints **sí** aplican rol (`get_current_coach_or_admin` en `user_router.py:30`, `get_current_admin` en activar/desactivar): el control existe, pero no se aplica de forma homogénea. Ese es el problema de fondo.

## 7. Hallazgos de la Sesión 2 (S2-A3)

| ID | Hallazgo | Evidencia | Riesgo | Corrección propuesta |
|---|---|---|---|---|
| F2-06 | Cualquier usuario autenticado puede leer, modificar y eliminar evaluaciones de otros cambiando el id en la URL (IDOR). | T02, T03, T04, T06 | **Alta** | Verificar en cada endpoint de evaluaciones que el recurso pertenece al solicitante o que su rol lo autoriza (sección 8). |
| F2-07 | La autorización por rol se aplica en unos endpoints (usuarios) pero no en otros (evaluaciones, tests). El criterio no es homogéneo. | T04, T05 | **Media** | Definir una dependencia central de autorización y aplicarla a todos los recursos con identificador. |
| F2-08 | Al crear una evaluación, el evaluador se toma del campo `user_id` del cuerpo (`evaluation_controller.py:40`), no de la cuenta autenticada. | `evaluation_router.py:28` | **Media** | Tomar el evaluador del token (`current_account`) y no de la petición. |

## 8. Corrección en el servidor (código por cada IDOR)

La regla de fondo es: **el servidor nunca debe confiar en el id que envía el navegador para decidir el acceso.** Debe comparar el dueño del recurso con la cuenta autenticada.

**Escenario 1 y 2 — F2-06: verificar dueño o rol antes de leer, modificar o eliminar.** Se añade una comprobación en `evaluation_controller.py` y se usa en los endpoints `GET`, `PUT` y `DELETE` de `/evaluations/{id}`:

```python
# app/utils/authorization.py  (nuevo)
from app.models.account import Account
from app.models.enums.rol import Role
from app.utils.exceptions import UnauthorizedException

def assert_owner_or_admin(account: Account, owner_user_id: int) -> None:
    """El acceso solo se permite al administrador o al dueño del recurso."""
    if account.role == Role.ADMINISTRATOR:
        return
    if account.user_id != owner_user_id:        # el id viene del recurso, no de la URL
        raise UnauthorizedException("No tiene permiso sobre este recurso")
```

```python
# app/services/routers/evaluation_router.py  (GET, PUT y DELETE de /{evaluation_id})
evaluation = evaluation_controller.get_evaluation(db, evaluation_id)
if not evaluation:
    raise HTTPException(status_code=404, detail="Evaluación no encontrada")

# CORRECCIÓN IDOR: comparar el dueño del recurso con la cuenta autenticada
assert_owner_or_admin(current_account, evaluation.user_id)
# ... recién aquí se devuelve, modifica o elimina la evaluación
```

**Escenario 2 — F2-08: no confiar en el `user_id` del cuerpo al crear.** El evaluador debe salir del token, no de la petición:

```python
# app/services/routers/evaluation_router.py  (POST /)
# Antes:  payload.user_id  (lo elige quien envía la petición)
# Después: se usa el dueño de la sesión
evaluation = evaluation_controller.create_evaluation(
    db=db, payload=payload, owner_user_id=current_account.user_id,
)
```

**Escenario 3 — F2-07: aplicar la autorización de forma homogénea.** El control de rol que ya existe en los endpoints de usuarios (`get_current_coach_or_admin`) debe extenderse, junto con `assert_owner_or_admin`, a todos los recursos con identificador (evaluaciones, tests, estadísticas), para no depender de revisar endpoint por endpoint.

## 9. Pregunta de control N.º 2

> ¿Qué riesgos introduce un token JWT sin expiración o aceptado con el algoritmo `none`? ¿En qué se diferencia un fallo de autenticación de un fallo de autorización como IDOR, y por qué los controles deben verificarse en el servidor y no en el cliente?

Un token **sin expiración** sirve para siempre: si alguien lo roba, mantiene el acceso de forma indefinida, porque no hay un momento en que el servidor deje de aceptarlo. El algoritmo **`none`** es aún más grave: declara que el token no tiene firma, de modo que, si el servidor confía en lo que dice la cabecera, cualquiera puede fabricar un token con el rol que quiera sin conocer la clave. La defensa, que Kallpa aplica, es fijar en el servidor el algoritmo (HS256) y una expiración, en lugar de confiar en el token.

La diferencia entre los dos tipos de fallo es: la **autenticación** responde a «¿quién eres?» y la **autorización** a «¿qué te está permitido hacer?». Un fallo de autenticación deja entrar a alguien que no debería (por ejemplo, aceptar un token inválido). Un fallo de **autorización como IDOR** ocurre cuando el usuario sí está autenticado, pero alcanza datos que no le corresponden: en Kallpa el pasante inicia sesión correctamente, pero puede leer, modificar y eliminar evaluaciones de otros.

Los controles deben verificarse **en el servidor** porque el cliente (el navegador) está bajo el control del usuario: puede cambiar el id de una URL, editar lo que guarda o enviar peticiones a mano, como hicimos en las pruebas. Ocultar un botón en la interfaz no impide nada si el servidor acepta la petición igual. Solo el servidor puede decidir de forma confiable, comparando el recurso con la sesión, si una acción está permitida.

## 10. Consolidación y enlace al repositorio

El reporte y sus evidencias se cargan en el repositorio del proyecto, en `Auditoria-Seguridad/APE-02/Fase-02/`. La carpeta [`evidencias/capturas`](evidencias/capturas) contiene las pruebas visuales (T01 a T05) y [`salida-idor-modificacion.txt`](evidencias/salida-idor-modificacion.txt) la del escenario 2 (T06).

**Repositorio:** https://github.com/Axlmd16/Sgt_Kallpa/tree/master/Auditoria-Seguridad/APE-02/Fase-02

Las cuentas y datos ficticios se eliminan con el script de limpieza de [registro.md](evidencias/registro.md).
