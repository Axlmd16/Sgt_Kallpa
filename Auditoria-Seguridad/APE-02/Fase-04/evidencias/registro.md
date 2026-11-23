# Registro de evidencias — APE 02, Fase 4

**Fecha de ejecución:** 23 de noviembre de 2026 · **Commit revisado:** `a3bb556` · **Herramientas:** Bandit v1.9.4 (`uvx bandit`), Docker Engine y Trivy v0.67.2 (`aquasec/trivy:0.67.2`).

## Sesión 1 — Análisis estático (SAST)

| Código | Qué demuestra | Archivo de salida | Captura |
|---|---|---|---|
| S01 | Ejecución de Bandit sobre `BackendFutbol/app`, `main.py` y `scripts` (15 hallazgos: 1 Medium, 14 Low) y auditoría de los 4 `# nosec` suprimidos | [salida-bandit.txt](salida-bandit.txt) · [salida-bandit-app-sin-nosec.txt](salida-bandit-app-sin-nosec.txt) | [S01-bandit-sast-ejecucion.png](capturas/S01-bandit-sast-ejecucion.png) |

## Sesión 2 — Endurecimiento de contenedores y escaneo Trivy

| Código | Qué demuestra | Archivo de salida | Captura |
|---|---|---|---|
| S02 | Construcción de `kallpa-backend:hardened` (802 MB, `uid=10001(appuser)`) y `kallpa-frontend:hardened` (114 MB, `uid=101(nginx)`), y exclusión de `.env` | [salida-build-backend.txt](salida-build-backend.txt) · [salida-build-frontend.txt](salida-build-frontend.txt) | [S02-docker-build-endurecido.png](capturas/S02-docker-build-endurecido.png) |
| S03 | Escaneo Trivy (`HIGH,CRITICAL`) de backend original (302 OS + 194 Python) vs. backend endurecido (77 OS + 119 Python, -74.5 % CVEs de OS) | [salida-trivy-backend-original.txt](salida-trivy-backend-original.txt) · [salida-trivy-backend-hardened.txt](salida-trivy-backend-hardened.txt) | [S03-trivy-escaneo-backend-comparativa.png](capturas/S03-trivy-escaneo-backend-comparativa.png) |
| S04 | Escaneo Trivy (`HIGH,CRITICAL`) de frontend original (19 CVEs) vs. frontend endurecido con `nginx-unprivileged` + `apk upgrade` (**0 CVEs**, *Clean*) | [salida-trivy-frontend-original.txt](salida-trivy-frontend-original.txt) · [salida-trivy-frontend-hardened.txt](salida-trivy-frontend-hardened.txt) | [S04-trivy-escaneo-frontend-comparativa.png](capturas/S04-trivy-escaneo-frontend-comparativa.png) |

## Cómo reproducir

```bash
# 1. Análisis estático con Bandit
uvx bandit -r BackendFutbol/app BackendFutbol/main.py BackendFutbol/scripts
uvx bandit -r BackendFutbol/app BackendFutbol/main.py --ignore-nosec

# 2. Construcción de las imágenes endurecidas
docker build -f Auditoria-Seguridad/APE-02/Fase-04/Dockerfile.backend.hardened  -t kallpa-backend:hardened  BackendFutbol/
docker build -f Auditoria-Seguridad/APE-02/Fase-04/Dockerfile.frontend.hardened -t kallpa-frontend:hardened FrontendFutbol/

# 3. Verificación de usuario no root y exclusión de .env
docker run --rm --entrypoint id kallpa-backend:hardened
docker run --rm --entrypoint id kallpa-frontend:hardened
docker run --rm --entrypoint ls kallpa-backend:hardened -la /app

# 4. Escaneo con Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:0.67.2 image --severity HIGH,CRITICAL --scanners vuln kallpa-backend:hardened
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:0.67.2 image --severity HIGH,CRITICAL --scanners vuln kallpa-frontend:hardened
```
