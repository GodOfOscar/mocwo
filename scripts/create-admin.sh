#!/usr/bin/env bash
set -e

# Usage: export SERVER_URL, ADMIN_CREATION_KEY, ADMIN_EMAIL, ADMIN_PASSWORD, FULL_NAME
# then run: ./scripts/create-admin.sh

: "${SERVER_URL:?Need SERVER_URL (e.g. https://your-server.example.com)}"
: "${ADMIN_CREATION_KEY:?Need ADMIN_CREATION_KEY}"
: "${ADMIN_EMAIL:?Need ADMIN_EMAIL}"
: "${ADMIN_PASSWORD:?Need ADMIN_PASSWORD}"
: "${FULL_NAME:?Need FULL_NAME}"

curl -s -X POST "${SERVER_URL}/api/create-admin" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: ${ADMIN_CREATION_KEY}" \
  -d '{"email":"'"${ADMIN_EMAIL}"'","password":"'"${ADMIN_PASSWORD}"'","full_name":"'"${FULL_NAME}"'"}' \
  -w "\nHTTP STATUS: %{http_code}\n"