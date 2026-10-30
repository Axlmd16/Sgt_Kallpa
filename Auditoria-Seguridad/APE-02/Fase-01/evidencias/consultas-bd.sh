#!/usr/bin/env bash
# APE 02 - Fase 1: inspección del almacenamiento de contraseñas.
# Requiere el stack levantado con `docker compose up -d` desde la raíz del repo.
# Solo lectura. Enmascara correos y no imprime hashes ni contraseñas completas.
set -euo pipefail

echo "# Ejecutado el $(date '+%Y-%m-%d %H:%M')"

echo
echo "## PostgreSQL (backend Kallpa) - tabla accounts"
docker exec kallpa-postgres psql -U dev_user -d futbol_db -c "\d accounts" | sed -n '1,13p'

docker exec kallpa-postgres psql -U dev_user -d futbol_db -c "
SELECT id,
       'usuario' || id || '@ejemplo.com' AS email_anonimizado,
       role,
       left(password_hash, 7)          AS algoritmo_coste,
       substring(password_hash, 8, 22) AS salt,
       length(password_hash)           AS largo
FROM accounts ORDER BY id;"

docker exec kallpa-postgres psql -U dev_user -d futbol_db -c "
SELECT count(*)                                                    AS total,
       count(DISTINCT password_hash)                               AS hashes_distintos,
       count(DISTINCT substring(password_hash, 8, 22))             AS salts_distintos,
       count(*) FILTER (WHERE password_hash LIKE '\$2b\$10\$%')    AS bcrypt_coste_10
FROM accounts;"

echo
echo "## MariaDB (microservicio de personas) - tabla accounts"
docker exec mariadb-db mariadb -udesarrollo -pdesarrollo sportDB -e "DESCRIBE accounts;"

docker exec mariadb-db mariadb -udesarrollo -pdesarrollo sportDB -e "
SELECT id,
       CONCAT('persona', id, '@ejemplo.com') AS email_anonimizado,
       LEFT(password, 4)  AS inicio,
       LENGTH(password)   AS largo
FROM accounts ORDER BY id LIMIT 5;"

docker exec mariadb-db mariadb -udesarrollo -pdesarrollo sportDB -e "
SELECT COUNT(*) AS total,
       COUNT(DISTINCT password) AS distintos,
       MIN(LENGTH(password)) AS largo_min,
       MAX(LENGTH(password)) AS largo_max
FROM accounts;"

echo
echo "## Clave del microservicio dentro de la imagen (app.jar)"
JAR_DIR=$(mktemp -d)
docker cp springboot-app:/app/app.jar "$JAR_DIR/app.jar" >/dev/null
unzip -p "$JAR_DIR/app.jar" BOOT-INF/classes/application.properties \
  | grep -E "others.key|datasource.password"
echo "Algoritmo usado por AESUtil.class:"
unzip -p "$JAR_DIR/app.jar" BOOT-INF/classes/com/sport/user/security/AESUtil.class \
  | strings -n 3 | grep -xE 'AES|encrypt|decrypt' | sort -u | tr '\n' ' '
echo '(Cipher.getInstance("AES") en Java = AES/ECB/PKCS5Padding)'
rm -rf "$JAR_DIR"

echo
echo "## Prueba de reversibilidad: SOLO la cuenta de servicio admin@admin.com"
echo "## (su contraseña ya es pública en BackendFutbol/.env.example)"
KEY_HEX=$(printf '1234567FDUCAMETB' | xxd -p)
CIPHER=$(docker exec mariadb-db mariadb -udesarrollo -pdesarrollo sportDB -N -e \
  "SELECT password FROM accounts WHERE email='admin@admin.com'")
printf 'admin@admin.com -> '
echo "$CIPHER" | base64 -d | openssl enc -d -aes-128-ecb -K "$KEY_HEX"
echo

echo
echo "## Alcance: cuántas contraseñas se pueden descifrar (sin mostrarlas)"
ok=0; fail=0
while read -r c; do
  if echo "$c" | base64 -d 2>/dev/null | openssl enc -d -aes-128-ecb -K "$KEY_HEX" >/dev/null 2>&1; then
    ok=$((ok + 1))
  else
    fail=$((fail + 1))
  fi
done < <(docker exec mariadb-db mariadb -udesarrollo -pdesarrollo sportDB -N -e \
  "SELECT password FROM accounts WHERE password IS NOT NULL")
echo "descifrables=$ok no_descifrables=$fail"

echo
echo "## Exposición en red: conexión a las bases usando la IP de la red local"
LAN_IP=$(ip -4 route get 1.1.1.1 | awk '{for (i = 1; i < NF; i++) if ($i == "src") print $(i + 1)}')
echo "IP del equipo en la red local: $LAN_IP"
docker ps --filter name=kallpa-postgres --filter name=mariadb-db --format '{{.Names}} -> {{.Ports}}'
docker run --rm --network host postgres:16-alpine psql \
  "postgresql://dev_user:dev_password@$LAN_IP:5432/futbol_db" \
  -tAc "SELECT 'PostgreSQL con credenciales por defecto: ' || count(*) || ' cuentas' FROM accounts"
docker run --rm --network host mariadb:11 mariadb -h "$LAN_IP" -udesarrollo -pdesarrollo sportDB \
  -N -e "SELECT CONCAT('MariaDB con credenciales por defecto: ', COUNT(*), ' cuentas') FROM accounts"
