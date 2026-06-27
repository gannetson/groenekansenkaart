#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_BACKUP=""
ENV_LOCAL_BACKUP=""
ENV_TMP=".env.production.seed.tmp"

if [[ -f .env ]]; then
  ENV_BACKUP="$(mktemp)"
  mv .env "$ENV_BACKUP"
fi

if [[ -f .env.local ]]; then
  ENV_LOCAL_BACKUP="$(mktemp)"
  mv .env.local "$ENV_LOCAL_BACKUP"
fi

cleanup() {
  rm -f "$ENV_TMP"
  if [[ -n "$ENV_LOCAL_BACKUP" && -f "$ENV_LOCAL_BACKUP" ]]; then
    mv "$ENV_LOCAL_BACKUP" .env.local
  fi
  if [[ -n "$ENV_BACKUP" && -f "$ENV_BACKUP" ]]; then
    mv "$ENV_BACKUP" .env
  fi
}
trap cleanup EXIT

echo "→ Downloading production env vars from Vercel..."
npx vercel env pull "$ENV_TMP" --environment=production

set -a
# shellcheck disable=SC1090
source "$ENV_TMP"
set +a

# Neon on Vercel may expose different variable names
export DATABASE_URL="${DATABASE_URL:-${POSTGRES_URL:-${POSTGRES_PRISMA_URL:-${POSTGRES_URL_NON_POOLING:-}}}}"
DB_PUSH_URL="${POSTGRES_URL_NON_POOLING:-${DATABASE_URL_UNPOOLED:-$DATABASE_URL}}"

if [[ -z "$DATABASE_URL" ]]; then
  echo ""
  echo "Error: no database URL found in Vercel production env."
  echo "In Vercel: Storage → your Neon database → Connect to Project → groenekansenkaart"
  echo "Then run this script again."
  exit 1
fi

echo "→ Creating tables on production Postgres..."
DATABASE_URL="$DB_PUSH_URL" npx prisma db push

echo "→ Seeding Leiden projects..."
DATABASE_URL="$DATABASE_URL" npm run db:seed:leiden

echo "Done. Refresh your Vercel site to see the markers."
