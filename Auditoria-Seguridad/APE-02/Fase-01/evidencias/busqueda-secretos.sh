#!/usr/bin/env bash
# APE 02 - Fase 1: búsqueda de credenciales y secretos fijos en el repositorio.
# Ejecutar desde la raíz del repositorio. Solo lectura.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

echo "# Ejecutado el $(date '+%Y-%m-%d %H:%M') sobre $(git rev-parse --short HEAD)"

echo
echo "## 1. ¿Algún .env real fue versionado alguna vez? (historial completo)"
hist=$(git log --all --oneline -- '*.env' '**/.env' | wc -l)
echo "commits que tocan archivos .env: $hist"
echo "reglas en .gitignore:"; grep -nE '^\.env|^\*\.env|!\.env' .gitignore BackendFutbol/.gitignore 2>/dev/null

echo
echo "## 2. Valores por defecto de secretos escritos en el código"
git ls-files -- ':!Auditoria-Seguridad' ':!*.lock' ':!*package-lock.json' ':!*/tests/*' \
  | xargs grep -nIE \
    'PASSWORD[A-Z_]*: *str *= *"|_PASSWORD:-|_KEY:-|OTHERS_KEY|JWT_SECRET=|"password": *"[^"]+"' \
  2>/dev/null

echo
echo "## 3. Credenciales documentadas en README"
git ls-files '*README.md' -- ':!Auditoria-Seguridad' \
  | xargs grep -nIE 'Admin123!|12345678$|PASSWORD=|WITH PASSWORD' 2>/dev/null

echo
echo "## 4. Variables sensibles que el despliegue a Azure NO define"
wf=BackendFutbol/.github/workflows/deploy-aci.yml
for v in JWT_SECRET POSTGRES_PASSWORD MARIADB_PASSWORD DEFAULT_ADMIN_PASSWORD \
         PERSON_MS_ADMIN_PASSWORD OTHERS_KEY; do
  if grep -q "$v" "$wf"; then
    printf '%-26s definida (%s)\n' "$v" "$(grep -m1 -oE 'secrets\.[A-Z_]+' <<<"$(grep -A1 "$v" "$wf")" || echo valor fijo)"
  else
    printf '%-26s NO definida -> se usa el valor por defecto\n' "$v"
  fi
done

echo
echo "## 5. Datos sensibles enviados a los logs"
git ls-files 'BackendFutbol/app/*.py' | xargs grep -nE 'logger\.[a-z]+\(.*(payload|password|token)' 2>/dev/null

echo "Variables SMTP definidas en el despliegue a Azure: $(grep -c SMTP "$wf")"
echo "(sin SMTP, send_reset_email() escribe el token de recuperación en el log)"
echo
echo "Líneas reales en el log de kallpa-backend (valores enmascarados):"
docker logs kallpa-backend 2>&1 | grep "Sending to MS" | head -2 | sed -E \
  "s/'(identification|password|email|first_name|last_name|phono|direction)': '[^']*'/'\1': '<oculto>'/g"

echo
echo "## 6. Secretos en el frontend (variables VITE_ se incrustan en el bundle público)"
found=$(git ls-files 'FrontendFutbol/*' | xargs grep -nIE 'VITE_[A-Z_]*(KEY|SECRET|TOKEN|PASS)' 2>/dev/null)
echo "${found:-ninguna variable VITE_ con nombre de secreto}"

echo
echo "## 7. Escaneo automático con Trivy (reglas de secretos conocidos)"
tmp=$(mktemp -d)
git ls-files -z | tar --null -T - -cf - | tar -xf - -C "$tmp"
docker run --rm -v "$tmp:/src:ro" mirror.gcr.io/aquasec/trivy:latest fs \
  --scanners secret --skip-dirs /src/Auditoria-Seguridad --quiet /src 2>&1 | tail -12
rm -rf "$tmp"
echo "(Trivy busca formatos conocidos como claves de AWS o tokens de GitHub;"
echo " no reconoce contraseñas simples como las de los puntos 2 y 3.)"
