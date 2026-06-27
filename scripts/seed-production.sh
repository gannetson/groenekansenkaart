#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_BACKUP=""
if [[ -f .env ]]; then
  ENV_BACKUP="$(mktemp)"
  mv .env "$ENV_BACKUP"
fi

cleanup() {
  if [[ -n "$ENV_BACKUP" && -f "$ENV_BACKUP" ]]; then
    mv "$ENV_BACKUP" .env
  fi
}
trap cleanup EXIT

echo "→ Creating tables on production Postgres..."
npx vercel env run --environment production -- npx prisma db push

echo "→ Seeding Leiden projects..."
npx vercel env run --environment production -- npm run db:seed:leiden

echo "Done. Redeploy on Vercel if you have not pushed the postgresql schema yet."
