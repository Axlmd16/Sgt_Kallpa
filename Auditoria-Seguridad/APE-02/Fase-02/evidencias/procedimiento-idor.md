# Procedimiento de las pruebas IDOR — APE 02, Fase 2, Sesión 2

Pruebas manuales ejecutadas desde el cliente de API de la documentación (`/scalar` / `/docs`) y desde la interfaz web, con **cuentas y datos ficticios** creados para la auditoría. Cada petición lleva el token de la cuenta indicada en la cabecera `Authorization: Bearer <token>`.

## Datos de prueba

| Cuenta | Rol | `user_id` | Evaluación propia (ficticia) |
|---|---|---|---|
| Usuario A (`captura-...-a@example.com`) | Pasante | 6 | id 3 — "Evaluacion privada de A" |
| Usuario B (`captura-...-b@example.com`) | — | 7 | id 4 — "Evaluacion privada de B" |

Las evaluaciones llevan en sus observaciones la nota «Registro ficticio… No contiene datos reales».

## Pruebas realizadas y resultado observado

| # | Prueba (quién → qué) | Petición | Resultado | ¿Correcto? |
|---|---|---|---|---|
| IDOR-1 | Usuario A lee la evaluación de B | `GET /api/v1/evaluations/4` | 200 OK, devuelve "Evaluacion privada de B" (`user_id: 7`) | No: accede a un recurso ajeno |
| IDOR-2 | Usuario A lee otra evaluación ajena | `GET /api/v1/evaluations/3` | 200 OK, devuelve "Evaluacion privada de A" | No (mismo defecto, recurso por id) |
| IDOR-3 | Usuario A lista las evaluaciones de B | `GET /api/v1/evaluations/user/7` | 200 OK, devuelve la evaluación de B | No: enumera recursos de otro usuario |
| IDOR-4 | Un pasante ve y abre evaluaciones ajenas en la interfaz | Módulo «Evaluaciones» → «Ver» | Muestra "Evaluacion privada de A" y "…de B" con botón «Editar Evaluación» | No: sin filtro por dueño |
| ROL-1 | Rol no autorizado a un endpoint de staff | `GET /api/v1/users/interns` (rol común) | 403 Forbidden, "Solo entrenadores o administradores pueden realizar esta acción" | **Sí: control positivo** |
| ROL-2 | Rol autorizado al mismo endpoint | `GET /api/v1/users/interns` (entrenador/admin) | 200 OK, "Pasantes obtenidos correctamente" | **Sí: control positivo** |

## Interpretación

- **IDOR-1 a IDOR-4** confirman una **autorización rota a nivel de objeto**: los endpoints `/evaluations/{id}` y `/evaluations/user/{id}` solo comprueban que exista una sesión válida (`get_current_account`), no que el recurso pertenezca al solicitante. Verificado en `BackendFutbol/app/services/routers/evaluation_router.py` (líneas 58, 88, 117, 162, 199) y en `evaluation_controller.py`, que no filtra por dueño. Los métodos `PUT` y `DELETE` de `/evaluations/{id}` comparten la misma dependencia, por lo que el mismo acceso aplica a modificar y eliminar; en la interfaz el botón «Editar» queda disponible para un recurso ajeno (imagen de IDOR-4).
- **ROL-1 y ROL-2** muestran que **otros endpoints sí aplican rol** (`get_current_coach_or_admin` en `user_router.py:30`, y `get_current_admin` en activar/desactivar usuarios). El control de acceso existe, pero no está aplicado de forma homogénea.

## Reglas éticas aplicadas

- Solo se usaron cuentas y evaluaciones ficticias creadas para la prueba.
- Las lecturas no exponen datos reales. Cualquier modificación de prueba se revierte dejando el valor original.
- Las pruebas se ejecutaron en el entorno local del proyecto.
