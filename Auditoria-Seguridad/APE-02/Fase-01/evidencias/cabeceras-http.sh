#!/usr/bin/env bash
# APE 02 - Fase 1: verificación del cifrado en tránsito y cabeceras de seguridad.
# Requiere el stack levantado con `docker compose up -d`.
set -uo pipefail

echo "# Ejecutado el $(date '+%Y-%m-%d %H:%M')"

for url in http://localhost:5173/ http://localhost:5173/login http://localhost:5173/favicon.ico \
           http://localhost:8001/docs http://localhost:8096/; do
  echo
  echo "## GET $url"
  curl -s -o /dev/null -D - "$url" | tr -d '\r' | grep -iE \
    '^HTTP/|^server|strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy|x-xss'
done

echo
echo "## Resumen de cabeceras de seguridad (frontend /)"
headers=$(curl -s -o /dev/null -D - http://localhost:5173/ | tr -d '\r')
for h in Strict-Transport-Security Content-Security-Policy X-Frame-Options \
         X-Content-Type-Options Referrer-Policy Permissions-Policy; do
  if grep -qi "^$h:" <<<"$headers"; then echo "PRESENTE  $h"; else echo "AUSENTE   $h"; fi
done

echo
echo "## ¿Responde algún servicio por HTTPS?"
for port in 5173 8001 8096; do
  if curl -sk -o /dev/null --max-time 3 "https://localhost:$port/"; then
    echo "https://localhost:$port -> responde"
  else
    echo "https://localhost:$port -> NO responde (solo HTTP)"
  fi
done

echo
echo "## Login viaja en texto claro por HTTP (cuenta inexistente, contraseña ficticia)"
curl -s -v -X POST http://localhost:8001/api/v1/accounts/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"prueba@unl.edu.ec","password":"ClaveFicticia123!"}' 2>&1 \
  | grep -E '^> (POST|Host)|^\* (Connected|using HTTP)|^< HTTP' | head -5
echo '(el cuerpo {"email":...,"password":"ClaveFicticia123!"} se envía sin cifrar)'

echo
echo "## Configuración declarada en FrontendFutbol/nginx.conf"
grep -nE 'listen|location|add_header' ../../../../FrontendFutbol/nginx.conf
