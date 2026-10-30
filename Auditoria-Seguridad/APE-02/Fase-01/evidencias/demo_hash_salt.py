"""Demostración práctica: hash con y sin salt, y cifrado reversible.

APE 02 - Fase 1 - Kallpa UNL.

Se ejecuta con el mismo entorno del backend para usar la configuración real
de bcrypt del proyecto (passlib, 10 rondas):

    docker cp demo_hash_salt.py kallpa-backend:/tmp/
    docker exec kallpa-backend /app/.venv/bin/python /tmp/demo_hash_salt.py

Todas las contraseñas usadas son ficticias. No lee la base de datos.
"""

import base64
import hashlib
import os
import time

from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from passlib.context import CryptContext

# Misma configuración que BackendFutbol/app/utils/security.py
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=10)

# Clave por defecto del microservicio de personas (docker-compose.yml y app.jar)
MS_KEY = b"1234567FDUCAMETB"

# Dos usuarios ficticios que eligieron la misma contraseña
USERS = [("ana@unl.edu.ec", "Futbol2026!"), ("luis@unl.edu.ec", "Futbol2026!")]

# Diccionario pequeño de contraseñas comunes (ficticio, para la demostración)
COMMON = [
    "123456", "12345678", "password", "admin", "qwerty", "futbol", "Futbol123",
    "Admin123!", "unl2026", "Loja2026", "Kallpa123", "Futbol2026!", "barcelona",
]


def section(title):
    print("\n" + "=" * 72)
    print(title)
    print("=" * 72)


def aes_ecb_encrypt(text):
    padder = padding.PKCS7(128).padder()
    data = padder.update(text.encode()) + padder.finalize()
    enc = Cipher(algorithms.AES(MS_KEY), modes.ECB()).encryptor()
    return base64.b64encode(enc.update(data) + enc.finalize()).decode()


def aes_ecb_decrypt(b64):
    dec = Cipher(algorithms.AES(MS_KEY), modes.ECB()).decryptor()
    data = dec.update(base64.b64decode(b64)) + dec.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    return (unpadder.update(data) + unpadder.finalize()).decode()


def rate(fn, seconds=1.0):
    """Cuántas operaciones por segundo se pueden hacer con fn en este equipo."""
    count, start = 0, time.perf_counter()
    while time.perf_counter() - start < seconds:
        fn(f"candidata{count}")
        count += 1
    return count / (time.perf_counter() - start)


def main():
    section("1. Hash SIN salt: misma contraseña -> mismo hash")
    for algo in ("md5", "sha1", "sha256"):
        for email, pwd in USERS:
            print(f"{algo:7} {email:18} {hashlib.new(algo, pwd.encode()).hexdigest()}")
    print("-> Quien vea la tabla sabe que ambos usuarios comparten contraseña.")

    section("2. Hash CON salt por usuario (SHA-256 + salt aleatorio)")
    for email, pwd in USERS:
        salt = os.urandom(16)
        digest = hashlib.sha256(salt + pwd.encode()).hexdigest()
        print(f"{email:18} salt={salt.hex()[:16]}... hash={digest[:32]}...")
    print("-> Hashes distintos, pero SHA-256 sigue siendo muy rápido de probar.")

    section("3. bcrypt del proyecto (salt automático + 10 rondas)")
    for email, pwd in USERS:
        h = PWD_CONTEXT.hash(pwd)
        print(f"{email:18} {h}")
        print(f"{'':18} algoritmo={h[1:3]} coste={h[4:6]} salt={h[7:29]}")
    print("-> El salt viaja dentro del hash; cada usuario obtiene uno distinto.")

    section("4. Ataque de diccionario contra un hash MD5 sin salt")
    target = hashlib.md5(b"Futbol2026!").hexdigest()
    start = time.perf_counter()
    found = next(p for p in COMMON if hashlib.md5(p.encode()).hexdigest() == target)
    print(f"MD5 objetivo {target} -> '{found}' en {(time.perf_counter()-start)*1000:.3f} ms")

    section("5. Velocidad de prueba de contraseñas en este equipo (1 núcleo)")
    md5_rate = rate(lambda s: hashlib.md5(s.encode()).hexdigest())
    sha1_rate = rate(lambda s: hashlib.sha1(s.encode()).hexdigest())
    sha256_rate = rate(lambda s: hashlib.sha256(s.encode()).hexdigest())
    bcrypt_rate = rate(lambda s: PWD_CONTEXT.hash(s), seconds=3.0)
    rows = [("MD5", md5_rate), ("SHA-1", sha1_rate), ("SHA-256", sha256_rate),
            ("bcrypt (10 rondas)", bcrypt_rate)]
    for name, r in rows:
        print(f"{name:20} {r:>14,.0f} intentos/s")
    wordlist = 14_000_000  # tamaño aproximado del diccionario rockyou.txt
    print(f"\nTiempo para recorrer un diccionario de {wordlist:,} contraseñas:")
    for name, r in rows:
        secs = wordlist / r
        human = f"{secs:,.1f} s" if secs < 3600 else f"{secs/3600:,.1f} h"
        print(f"{name:20} {human}")
    print(f"bcrypt es ~{md5_rate / bcrypt_rate:,.0f} veces más lento que MD5 por intento.")

    section("6. Cifrado reversible del microservicio (AES-ECB, clave por defecto)")
    for email, pwd in USERS:
        print(f"{email:18} {aes_ecb_encrypt(pwd)}")
    c = aes_ecb_encrypt("Futbol2026!")
    print(f"-> Mismo texto cifrado para la misma contraseña (sin IV ni salt).")
    print(f"-> Con la clave se recupera el original: {c} -> '{aes_ecb_decrypt(c)}'")


if __name__ == "__main__":
    main()
