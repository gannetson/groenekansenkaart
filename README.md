# Groene Kansen Kaart

Interactieve kaart van groene vergroeningsprojecten ("Vergroenen") in Leiden. Bezoekers verkennen projecten op een stylized Mapbox-kaart; beheerders kunnen projecten toevoegen, bewerken en publiceren via een admin-panel.

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** — speels groen thema
- **Mapbox GL JS** — stylized kaart van Leiden
- **Prisma + SQLite** (local dev) / **PostgreSQL** (Vercel production)
- **Vercel Blob** — foto-uploads
- **NextAuth.js v5** — admin-authenticatie

## Lokaal opstarten

### Vereisten

- **Node.js 20+** (Next.js 16 and Prisma do not work on older versions)
- Mapbox access token ([mapbox.com](https://www.mapbox.com/))

> **Node version:** If `npm install` fails with `SyntaxError: Unexpected token '.'`, your Node is too old. With nvm: `nvm install && nvm use` (this repo includes a `.nvmrc`).

No separate database server is needed for local dev — the app uses **SQLite** (`prisma/dev.db`).

### Stappen

1. **Node version & dependencies**

   ```bash
   nvm use          # or: nvm install (reads .nvmrc)
   npm install
   ```

2. **Environment variables**

   Kopieer `.env.example` naar `.env` en vul in:

   ```bash
   cp .env.example .env
   ```

   | Variabele | Beschrijving |
   |-----------|--------------|
   | `DATABASE_URL` | `file:./dev.db` (SQLite, default for local dev) |
   | `AUTH_SECRET` | Willekeurige string (`openssl rand -base64 32`) |
   | `AUTH_URL` | `http://localhost:3000` |
   | `ADMIN_EMAIL` | Admin login e-mail |
   | `ADMIN_PASSWORD` | Admin wachtwoord |
   | `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token |
   | `NEXT_PUBLIC_MAPBOX_STYLE_URL` | Mapbox style URL (optioneel) |
   | `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (optioneel lokaal; zonder token worden uploads naar `public/uploads/` geschreven) |

3. **Database initialiseren**

   ```bash
   npm run db:push
   npm run db:seed          # demo + Leiden projects
   # or only the 26 Leiden locations:
   npm run db:seed:leiden
   ```

4. **Development server**

   ```bash
   npm run dev
   ```

   - Kaart: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Deployen op Vercel

1. Push naar GitHub en importeer het project in [Vercel](https://vercel.com).
2. Voeg **Vercel Postgres** en **Vercel Blob** storage toe via het Vercel dashboard.
3. Stel environment variables in (zelfde als `.env.example`).
4. De build draait automatisch `prisma generate`. Voer eenmalig migratie uit:

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

   Of koppel `db:push` aan de build via `package.json` indien gewenst.

5. Log in op `/admin/login` en voeg projecten toe.

## Mapbox Studio style (speels groen)

Voor een speelsere kaart dan de standaard `outdoors-v12`:

1. Ga naar [Mapbox Studio](https://studio.mapbox.com/).
2. Maak een nieuwe style gebaseerd op **Outdoors** of **Light**.
3. Pas kleuren aan: zachte groene parken, pastel gebouwen, vereenvoudigde labels.
4. Publiceer de style en kopieer de Style URL.
5. Zet `NEXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/jouw-account/jouw-style-id`.

## Projectstructuur

```
app/
  page.tsx                    # Homepage met kaart
  projecten/[slug]/page.tsx   # Project detail
  admin/login/                # Admin login
  admin/(protected)/          # Beveiligd admin-panel
components/
  map/                        # Mapbox kaart, popups, sidebar
  admin/                      # Formulieren, upload, locatie-picker
lib/
  actions/projects.ts         # Server Actions (CRUD)
  auth.ts                     # NextAuth config
prisma/
  schema.prisma               # Project + ProjectImage modellen
  seed.ts                     # 5 voorbeeldprojecten in Leiden
```

## Admin functies

- Projecten aanmaken, bewerken, verwijderen
- Foto's uploaden (meerdere per project)
- Locatie kiezen via kaart of geocoding
- Concept / gepubliceerd status
- Zoeken in projectlijst

## Licentie

Privé project — Groene Kansen Kaart, Leiden.
