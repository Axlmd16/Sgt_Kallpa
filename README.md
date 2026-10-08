# Kallpa UNL

Sistema de gestión deportiva para el Club de Fútbol Kallpa de la Universidad Nacional de Loja. Reúne el registro de deportistas y representantes, la administración de usuarios, el control de asistencia, las evaluaciones físicas, las estadísticas y la generación de reportes.

## Componentes

| Componente | Tecnologías | Función |
| --- | --- | --- |
| [FrontendFutbol](FrontendFutbol/) | React 19, Vite 7, React Router, TanStack Query, Tailwind CSS | Interfaz pública, inscripción y paneles según el rol del usuario |
| [BackendFutbol](BackendFutbol/) | Python 3.11+, FastAPI, SQLAlchemy, Pydantic | API REST, autenticación JWT, reglas de negocio y reportes |
| PostgreSQL | PostgreSQL 16 | Almacenamiento principal del backend |
| Servicio de personas | Spring Boot y MariaDB 11 | Integración externa utilizada por el backend para datos de personas |

El frontend consume la API bajo `/api/v1`. El backend se comunica con PostgreSQL y con el servicio de personas. El archivo [docker-compose.yml](docker-compose.yml) reúne estos componentes para el entorno local.

## Funcionalidades

- Página pública, formularios de registro para escuela y club, inicio de sesión y recuperación de contraseña.
- Paneles para administradores, entrenadores y pasantes; gestión de usuarios reservada al administrador.
- Inscripción y consulta de deportistas, incluidos menores y sus representantes.
- Registro de asistencia y evaluaciones de velocidad, resistencia, Yo-Yo y técnica.
- Estadísticas deportivas y exportación de reportes en PDF, Excel y CSV.

Las rutas de la interfaz están definidas en [AppRouter.jsx](FrontendFutbol/src/app/router/AppRouter.jsx) y los permisos de los roles en [roles.js](FrontendFutbol/src/app/config/roles.js). Los endpoints del backend se registran en [main.py](BackendFutbol/main.py) y pueden explorarse en la documentación interactiva de la API.

## Inicio rápido con Docker

Necesitas Docker con Compose. Desde la raíz del proyecto:

```bash
cp BackendFutbol/.env.example BackendFutbol/.env
docker compose up -d --build
```

Antes de iniciar, revisa `BackendFutbol/.env`: configura `JWT_SECRET`, las credenciales del administrador inicial y, si usarás la recuperación de contraseña, los datos SMTP. El ejemplo usa las mismas credenciales locales de PostgreSQL y del servicio de personas que trae `docker-compose.yml`. Si cambias las credenciales de PostgreSQL, define también `POSTGRES_DB`, `POSTGRES_USER` y `POSTGRES_PASSWORD` en un `.env` junto al archivo Compose para mantenerlas sincronizadas con `DB_NAME`, `DB_USER` y `DB_PASSWORD` del backend.

| Servicio | Dirección local |
| --- | --- |
| Interfaz | <http://localhost:5173> |
| API | <http://localhost:8001/api/v1> |
| Documentación Scalar | <http://localhost:8001/scalar> |
| Swagger UI | <http://localhost:8001/docs> |
| Estado de la API | <http://localhost:8001/health> |
| PostgreSQL | `localhost:5432` |
| Servicio de personas | `localhost:8096` |
| MariaDB | `localhost:3306` |

Compose construye el frontend con `VITE_API_URL=http://localhost:8001/api/v1` por defecto y publica el backend en el puerto `8001`. También inicializa la cuenta del servicio de personas antes de arrancar la API. Para revisar el estado o detener los servicios:

```bash
docker compose ps
docker compose logs -f backend frontend
docker compose down
```

`docker compose down` conserva los volúmenes de PostgreSQL y MariaDB.

## Desarrollo local

Para trabajar sin contenedores de frontend y backend, necesitas Node.js 20+, Python 3.11+, [uv](https://docs.astral.sh/uv/) y los servicios PostgreSQL y de personas en ejecución. Puedes iniciar solo las dependencias con `docker compose up -d postgres mariadb app`. Usa `BackendFutbol/.env.example` como base para `BackendFutbol/.env`; en este modo `DB_HOST=localhost` y `PERSON_MS_BASE_URL=http://localhost:8096`.

En una terminal, inicia el backend:

```bash
cd BackendFutbol
uv sync
uv run python scripts/init_person_ms.py
uv run python main.py
```

En otra terminal, inicia el frontend:

```bash
cd FrontendFutbol
npm ci
printf 'VITE_API_URL=http://localhost:8000/api/v1\n' > .env.local
npm run dev
```

La interfaz estará en <http://localhost:5173>, el backend en <http://localhost:8000> y sus documentos de API en `/scalar`, `/docs` y `/redoc`. `VITE_API_URL` se incorpora al compilar el frontend: si cambias la URL, vuelve a iniciar Vite o reconstruye la imagen.

Al iniciar, el backend crea las tablas faltantes y, si todavía no existe, una cuenta de administrador con los valores `DEFAULT_ADMIN_*` de `BackendFutbol/.env`. Define esas variables antes del primer arranque.

## Estructura

```text
.
├── BackendFutbol/
│   ├── app/
│   │   ├── client/         # Integración con el servicio de personas
│   │   ├── controllers/    # Reglas de negocio
│   │   ├── core/           # Configuración y base de datos
│   │   ├── dao/            # Acceso a datos
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── schemas/        # Contratos Pydantic
│   │   └── services/       # Routers y generación de reportes
│   ├── scripts/            # Inicialización y utilidades
│   └── tests/
├── FrontendFutbol/
│   └── src/
│       ├── app/            # Router, configuración y proveedores
│       ├── features/       # Módulos funcionales
│       └── shared/         # Componentes y utilidades comunes
└── docker-compose.yml
```

## Verificaciones

```bash
# Frontend
cd FrontendFutbol
npm run lint
npm run build

# Backend
cd ../BackendFutbol
uv run ruff check .
uv run ruff format --check .
uv run pytest
```

Consulta [el README del backend](BackendFutbol/README.md) y [la guía de seguimiento del frontend](FrontendFutbol/src/features/seguimiento/README.md) para detalles de cada módulo.
