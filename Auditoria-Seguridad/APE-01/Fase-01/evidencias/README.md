# Evidencias pendientes de ejecución

No hay capturas de ejecución verificadas en esta revisión. Tomarlas manualmente en el entorno local autorizado, con datos ficticios y sin mostrar contraseñas, tokens, cookies, identificaciones reales ni información de menores.

| Captura sugerida | Qué debe mostrar | Relación con el inventario |
|---|---|---|
| `01-login.png` | Pantalla `/login`, campos de correo y contraseña sin valores | N-05, A-01 |
| `02-registro-publico.png` | Elección `/register` y formulario `/register/club` o `/register/escuela` con campos vacíos/ficticios | N-02–N-04, A-06–A-07 |
| `03-usuarios.png` | Lista y formulario de usuarios con cuenta de prueba Administrator; ocultar filas reales | N-09–N-11, API de `/users` |
| `04-deportistas.png` | Consulta, detalle o alta de deportista ficticio; si es menor, anonimizar representante | N-12–N-18, API de `/athletes` y `/representatives` |
| `05-asistencia.png` | Fecha, filtros y controles de registro de asistencia sin datos reales | N-22, API de `/attendances` |
| `06-evaluaciones.png` | Lista/formulario de evaluación y una prueba deportiva con datos ficticios | N-19, API de `/evaluations` y pruebas |
| `07-swagger.png` | `/docs` y grupos de endpoints visibles, sin ejecutar operaciones de escritura | D-06 |
| `08-docker.png` | Resultado de `docker compose ps` con nombres, estado y puertos; revisar que no aparezcan secretos | S-01–S-05 |
| `09-network.png` | Solicitudes observadas en DevTools Network: URL, método y estado de una operación inocua; ocultar `Authorization`, cuerpos y respuestas sensibles | Endpoints A-*, D-* |

Registrar fecha, entorno y rol de prueba de cada captura al incorporarla. Si el servicio o la cuenta no están disponibles, mantener la evidencia como pendiente. No ejecutar inscripciones reales ni operaciones de borrado para obtener capturas.
