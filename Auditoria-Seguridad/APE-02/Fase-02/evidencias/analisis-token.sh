#!/usr/bin/env bash
# APE 02 - Fase 2, Sesión 1: captura y análisis del token de sesión de Kallpa.
# Requiere el stack levantado (`docker compose up -d`) y una cuenta de prueba:
#   AUDIT_EMAIL=... AUDIT_PASSWORD=... ./analisis-token.sh
# Las credenciales no se guardan en el repositorio. Las firmas se recortan.
set -uo pipefail

API=${API:-http://localhost:8001/api/v1}
: "${AUDIT_EMAIL:?Defina AUDIT_EMAIL}"
: "${AUDIT_PASSWORD:?Defina AUDIT_PASSWORD}"

echo "# Ejecutado el $(date '+%Y-%m-%d %H:%M') contra $API"

# Decodifica cabecera y payload (Base64URL) e imprime los tiempos legibles
decode() {
  python3 -I -c '
import base64, json, sys, datetime as dt
tok = sys.argv[1]
head, body, sig = tok.split(".")
d = lambda s: json.loads(base64.urlsafe_b64decode(s + "=" * (-len(s) % 4)))
h, p = d(head), d(body)
print("cabecera:", json.dumps(h))
print("payload :", json.dumps(p, ensure_ascii=False))
print("firma   :", sig[:10] + "... (" + str(len(sig)) + " caracteres)")
ts = lambda t: dt.datetime.fromtimestamp(t, dt.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
if "iat" in p and "exp" in p:
    print("emitido :", ts(p["iat"]))
    print("expira  :", ts(p["exp"]))
    print("vigencia:", p["exp"] - p["iat"], "segundos =", round((p["exp"] - p["iat"]) / 3600, 1), "horas")
print("claims  :", ", ".join(p.keys()))
' "$1"
}

echo
echo "## 1. Inicio de sesión (POST /accounts/login)"
LOGIN=$(curl -s -X POST "$API/accounts/login" -H 'Content-Type: application/json' \
  -d "$(jq -n --arg e "$AUDIT_EMAIL" --arg p "$AUDIT_PASSWORD" '{email:$e,password:$p}')")
echo "$LOGIN" | jq '{status, message, campos_de_data: (.data | keys),
  token_type: .data.token_type, expires_in: .data.expires_in,
  refresh_expires_in: .data.refresh_expires_in}'
ACCESS=$(echo "$LOGIN" | jq -r '.data.access_token')
REFRESH=$(echo "$LOGIN" | jq -r '.data.refresh_token')

echo
echo "## 2. Token de acceso decodificado"
decode "$ACCESS"

echo
echo "## 3. Token de renovación (refresh) decodificado"
decode "$REFRESH"

echo
echo "## 4. Uso del token en una ruta protegida (GET /athletes/all)"
code() { curl -s -o /dev/null -w '%{http_code}' "$API/athletes/all" "$@"; }
echo "sin token                         -> HTTP $(code)"
echo "con token de acceso               -> HTTP $(code -H "Authorization: Bearer $ACCESS")"
echo "con token de renovación (refresh) -> HTTP $(code -H "Authorization: Bearer $REFRESH")"

echo
echo "## 5. Renovación (POST /accounts/refresh): ¿se entrega un refresh nuevo?"
RENEW=$(curl -s -X POST "$API/accounts/refresh" -H 'Content-Type: application/json' \
  -d "$(jq -n --arg r "$REFRESH" '{refresh_token:$r}')")
NEW_REFRESH=$(echo "$RENEW" | jq -r '.data.refresh_token')
if [ "$NEW_REFRESH" = "$REFRESH" ]; then
  echo "el servidor devuelve el MISMO refresh token (no hay rotación)"
else
  echo "el servidor entrega un refresh token nuevo"
fi

echo
echo "## 6. Dónde guarda el frontend los tokens"
cd "$(git rev-parse --show-toplevel)"
grep -n "localStorage.setItem" FrontendFutbol/src/app/providers/AuthProvider.jsx
grep -n "AUTH_TOKEN_KEY\|AUTH_REFRESH_TOKEN_KEY\|USER_DATA_KEY" FrontendFutbol/src/app/config/constants.js

echo
echo "## 7. Validación del token en el servidor (BackendFutbol/app/utils/security.py)"
grep -n "jwt.decode\|algorithms=\|def get_current_account\|payload.get(\"sub\")\|payload.get(\"type\")\|payload.get(\"action\")" \
  BackendFutbol/app/utils/security.py
