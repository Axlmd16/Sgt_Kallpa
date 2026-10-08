"""Initialize the person microservice account before starting the API."""

import json
import os
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = os.environ.get("PERSON_MS_BASE_URL", "http://app:8096").rstrip("/")
EMAIL = os.environ["PERSON_MS_ADMIN_EMAIL"]
PASSWORD = os.environ["PERSON_MS_ADMIN_PASSWORD"]


def request(method: str, path: str, payload: dict | None = None) -> tuple[int, bytes]:
    data = json.dumps(payload).encode() if payload is not None else None
    headers = {"Content-Type": "application/json"} if data is not None else {}
    req = Request(f"{BASE_URL}{path}", data=data, headers=headers, method=method)
    try:
        with urlopen(req, timeout=10) as response:
            return response.status, response.read()
    except HTTPError as error:
        return error.code, error.read()


def login() -> tuple[int, bool]:
    status, body = request(
        "POST",
        "/api/person/login",
        {"email": EMAIL, "password": PASSWORD},
    )
    try:
        token_exists = bool(json.loads(body).get("data", {}).get("token"))
    except (AttributeError, json.JSONDecodeError):
        token_exists = False
    return status, token_exists


for attempt in range(60):
    try:
        status, _ = request("GET", "/v3/api-docs")
        if status == 200:
            break
    except (TimeoutError, URLError, OSError):
        pass
    if attempt == 59:
        raise SystemExit("Spring no respondió a tiempo; no se inicia el backend.")
    time.sleep(2)

status, token_exists = login()
if status == 200 and token_exists:
    print("La cuenta del microservicio ya existe; login verificado.")
elif status in (400, 401):
    status, _ = request("GET", "/api/config/create")
    if not 200 <= status < 300:
        raise SystemExit(f"Falló la inicialización del microservicio (HTTP {status}).")
    status, token_exists = login()
    if status != 200 or not token_exists:
        raise SystemExit("La inicialización terminó, pero el login no fue válido.")
    print("Cuenta del microservicio inicializada y login verificado.")
else:
    raise SystemExit(f"No se pudo verificar el login del microservicio (HTTP {status}).")
