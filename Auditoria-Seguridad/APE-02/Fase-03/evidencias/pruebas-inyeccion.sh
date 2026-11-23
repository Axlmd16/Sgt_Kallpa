#!/usr/bin/env bash
# APE 02 - Fase 3: Pruebas de concepto y verificación de mitigaciones de SQLi y XSS
# Ejecuta las pruebas sobre:
#   1. Entorno controlado DVWA (niveles Low vs. Impossible) si está activo en DVWA_URL
#   2. Proyecto propio Kallpa UNL (API FastAPI, SQLAlchemy ORM, Jinja2 y cabeceras HTTP)
#
# Uso:
#   AUDIT_EMAIL=auditoria.fase3@ejemplo.com AUDIT_PASSWORD='...' ./pruebas-inyeccion.sh > salida-pruebas-inyeccion.txt
set -uo pipefail

API=${API:-http://localhost:8001/api/v1}
FRONTEND=${FRONTEND:-http://localhost:5173}
DVWA_URL=${DVWA_URL:-http://127.0.0.1:4280}
: "${AUDIT_EMAIL:?Defina AUDIT_EMAIL}"
: "${AUDIT_PASSWORD:?Defina AUDIT_PASSWORD}"

echo "# APE 02 — Fase 3: Explotación controlada y verificación de SQLi y XSS"
echo "# Ejecutado contra API=$API | FRONTEND=$FRONTEND | DVWA=$DVWA_URL"

echo
echo "======================================================================"
echo "## PARTE 1. Entorno controlado DVWA (Sesión 1: Explotación vs. Sesión 2: Mitigación)"
echo "======================================================================"

python3 -I - "$DVWA_URL" << 'PYEOF'
import sys, urllib.request, urllib.parse, http.cookiejar, re

dvwa = sys.argv[1]
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def get_tok(html):
    m = re.search(r"user_token['\"]\s+value=['\"]([a-f0-9]+)['\"]", html)
    return m.group(1) if m else ""

try:
    r = opener.open(f"{dvwa}/login.php", timeout=5).read().decode()
except Exception as e:
    print(f"[AVISO] DVWA no accesible en {dvwa}: {e}")
    sys.exit(0)

# Setup DB por si es primera ejecución
r_setup = opener.open(f"{dvwa}/setup.php").read().decode()
opener.open(f"{dvwa}/setup.php", urllib.parse.urlencode({
    "create_db": "Create / Reset Database", "user_token": get_tok(r_setup)
}).encode())

# Login en DVWA
r_login = opener.open(f"{dvwa}/login.php").read().decode()
opener.open(f"{dvwa}/login.php", urllib.parse.urlencode({
    "username": "admin", "password": "password", "Login": "Login", "user_token": get_tok(r_login)
}).encode())

def set_level(level):
    r_sec = opener.open(f"{dvwa}/security.php").read().decode()
    opener.open(f"{dvwa}/security.php", urllib.parse.urlencode({
        "security": level, "seclev_submit": "Submit", "user_token": get_tok(r_sec)
    }).encode())

# --- NIVEL LOW (Vulnerable: concatenación SQL y salida sin escapar) ---
set_level("low")
print("\n### 1.1 DVWA Nivel LOW (Vulnerable)")

q_quote = urllib.parse.urlencode({"id": "'", "Submit": "Submit"})
try:
    resp_quote = opener.open(f"{dvwa}/vulnerabilities/sqli/?{q_quote}").read().decode()
except urllib.error.HTTPError as e:
    resp_quote = e.read().decode()
print("[PoC-1] SQLi comilla simple (id='):")
print("  Respuesta:", re.sub(r"<[^>]+>", "", resp_quote).strip())

q_taut = urllib.parse.urlencode({"id": "' OR '1'='1", "Submit": "Submit"})
resp_taut = opener.open(f"{dvwa}/vulnerabilities/sqli/?{q_taut}").read().decode()
pres = re.findall(r"<pre>(.*?)</pre>", resp_taut, re.S)
print(f"[PoC-2] SQLi tautología (id=' OR '1'='1) -> {len(pres)} registros extraídos:")
for p in pres:
    print("  -", p.replace("<br />", " | "))

q_xss = urllib.parse.urlencode({"name": "<script>alert('XSS-APE02')</script>"})
resp_xss = opener.open(f"{dvwa}/vulnerabilities/xss_r/?{q_xss}").read().decode()
xss_pre = re.findall(r"<pre>(.*?)</pre>", resp_xss, re.S)
print("[PoC-3] XSS reflejado (name=<script>alert('XSS-APE02')</script>):")
print("  HTML devuelto sin escapar:", xss_pre[0] if xss_pre else "N/A")

# --- NIVEL IMPOSSIBLE (Mitigado: PDO prepare/bindParam + htmlspecialchars) ---
set_level("impossible")
print("\n### 1.2 DVWA Nivel IMPOSSIBLE (Mitigado con PDO parametrizado y htmlspecialchars)")

r_sqli_page = opener.open(f"{dvwa}/vulnerabilities/sqli/").read().decode()
q_taut_imp = urllib.parse.urlencode({
    "id": "' OR '1'='1", "Submit": "Submit", "user_token": get_tok(r_sqli_page)
})
resp_taut_imp = opener.open(f"{dvwa}/vulnerabilities/sqli/?{q_taut_imp}").read().decode()
pres_imp = re.findall(r"<pre>(.*?)</pre>", resp_taut_imp, re.S)
print(f"[Verif-1] SQLi tautología en nivel Impossible -> {len(pres_imp)} registros devueltos (ataque bloqueado)")

r_xss_page = opener.open(f"{dvwa}/vulnerabilities/xss_r/").read().decode()
q_xss_imp = urllib.parse.urlencode({
    "name": "<script>alert('XSS-APE02')</script>", "user_token": get_tok(r_xss_page)
})
resp_xss_imp = opener.open(f"{dvwa}/vulnerabilities/xss_r/?{q_xss_imp}").read().decode()
xss_pre_imp = re.findall(r"<pre>(.*?)</pre>", resp_xss_imp, re.S)
print("[Verif-2] XSS reflejado en nivel Impossible:")
print("  HTML devuelto con htmlspecialchars:", xss_pre_imp[0] if xss_pre_imp else "N/A")
PYEOF

echo
echo "======================================================================"
echo "## PARTE 2. Verificación en el proyecto propio Kallpa UNL"
echo "======================================================================"

echo
echo "### 2.1 Intento de SQLi por tautología en login (POST /accounts/login)"
SQLI_LOGIN=$(curl -s -w '\nHTTP_STATUS:%{http_code}' -X POST "$API/accounts/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"admin@unl.edu.ec' OR '1'='1\",\"password\":\"' OR '1'='1\"}")
echo "$SQLI_LOGIN"

echo
echo "### 2.2 Intento de SQLi en contraseña con correo válido (POST /accounts/login)"
SQLI_PASS=$(curl -s -w '\nHTTP_STATUS:%{http_code}' -X POST "$API/accounts/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$AUDIT_EMAIL\",\"password\":\"' OR '1'='1\"}")
echo "$SQLI_PASS"

echo
echo "### 2.3 Inicio de sesión legítimo con cuenta ficticia de auditoría"
LOGIN=$(curl -s -X POST "$API/accounts/login" -H 'Content-Type: application/json' \
  -d "$(jq -n --arg e "$AUDIT_EMAIL" --arg p "$AUDIT_PASSWORD" '{email:$e,password:$p}')")
ACCESS=$(echo "$LOGIN" | jq -r '.data.access_token')
echo "$LOGIN" | jq '{status, message, token_type: .data.token_type}'

echo
echo "### 2.4 Payloads de SQLi sobre buscadores y endpoints con parámetros (GET)"
for PAYLOAD in "'" "' OR '1'='1" "100%'" "1; DROP TABLE users;--"; do
  ENC=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1]))" "$PAYLOAD")
  RES_ATH=$(curl -s -H "Authorization: Bearer $ACCESS" "$API/athletes/all?search=$ENC")
  RES_USR=$(curl -s -H "Authorization: Bearer $ACCESS" "$API/users/all?search=$ENC")
  RES_EVL=$(curl -s -H "Authorization: Bearer $ACCESS" "$API/evaluations/?search=$ENC")
  RES_REP=$(curl -s "$API/representatives/by-dni/$ENC")
  echo "Payload: [$PAYLOAD]"
  echo "  /athletes/all?search=...        -> status=$(echo "$RES_ATH" | jq -r '.status') | total=$(echo "$RES_ATH" | jq -r '.data.total')"
  echo "  /users/all?search=...           -> status=$(echo "$RES_USR" | jq -r '.status') | total=$(echo "$RES_USR" | jq -r '.data.total')"
  echo "  /evaluations/?search=...        -> status=$(echo "$RES_EVL" | jq -r '.status') | total=$(echo "$RES_EVL" | jq -r '.data.total')"
  echo "  /representatives/by-dni/...     -> status=$(echo "$RES_REP" | jq -r '.status') | message=$(echo "$RES_REP" | jq -r '.message')"
done

echo
echo "### 2.5 Prueba de XSS almacenado/reflejado en API y escapado en Jinja2 (Reportes PDF)"
docker exec kallpa-backend /app/.venv/bin/python -c '
from jinja2 import Environment, FileSystemLoader, select_autoescape
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import Session
from app.core.database import engine
from app.models.athlete import Athlete
from app.models.account import Account

# 1. Demostrar cómo SQLAlchemy compila la consulta con bind parameters
session = Session(bind=engine)
payload = "\x27 OR \x271\x27=\x271"
q_login = session.query(Account).filter(Account.email == payload)
q_search = session.query(Athlete).filter(Athlete.full_name.ilike(f"%{payload}%"))
print("[SQLAlchemy Login Query]:", str(q_login.statement.compile(dialect=postgresql.dialect())))
print("  Parámetros enlazados:", q_login.statement.compile(dialect=postgresql.dialect()).params)
print("[SQLAlchemy Search Query]:", str(q_search.statement.compile(dialect=postgresql.dialect())))
print("  Parámetros enlazados:", q_search.statement.compile(dialect=postgresql.dialect()).params)

# 2. Demostrar cómo Jinja2 con select_autoescape escapa payloads XSS en report_base.html
env = Environment(loader=FileSystemLoader("app/templates"), autoescape=select_autoescape(["html", "xml"]))
tmpl = env.from_string("<td>{{ athlete_name }}</td> | <strong>Generado por:</strong> {{ generated_by }}")
rendered = tmpl.render(
    athlete_name="<script>alert(\x27XSS-APE02\x27)</script>",
    generated_by="Entrenador <img src=x onerror=alert(1)>"
)
print("[Jinja2 Autoescape Render]:", rendered)
session.close()
'

echo
echo "### 2.6 Verificación de cabeceras de defensa en profundidad contra XSS (Frontend Nginx)"
curl -s -I "$FRONTEND/" | grep -iE 'HTTP/|Content-Security-Policy|X-XSS-Protection|X-Content-Type-Options|X-Frame-Options|Cache-Control'
