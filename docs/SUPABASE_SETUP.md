# Supabase setup

The repository contains the database foundation, but it is not connected to a
Supabase project until the owner supplies project credentials and applies the
migration.

## Configure the project

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and select the
   LinkUp project.
2. Open **Project Settings → API**.
3. Copy **Project URL** into `EXPO_PUBLIC_SUPABASE_URL`.
4. Copy the **anon public** key into `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
5. Copy the **service_role** key into `SUPABASE_SERVICE_ROLE_KEY` on the server
   only. Never put it in an `EXPO_PUBLIC_*` variable.
6. In Render, open the service's **Environment** settings and add the four
   variables listed in `.env.example`. Redeploy after saving them.
7. Apply `supabase/migrations/001_auth_registration.sql` using either:

   - Supabase Dashboard → **SQL Editor** → **New query**, paste the migration,
     review it, and select **Run**; or
   - Supabase CLI: run `supabase login`, then
     `supabase link --project-ref <project-ref>`, and finally
     `supabase db push` from the repository root.

8. In **Table Editor**, confirm `accounts`, `auth_identities`, `profiles`, and
   `legal_acceptances` exist. In each table's policy view, confirm RLS is enabled
   and the policies from the migration are present.

## Runtime boundary

The checked-in application is a Next.js 14 App Router project, not an Expo
Router project. A non-static Render Next.js service can host a server route, but
no Telegram verification endpoint exists yet. If Render is configured as a
static site, Telegram `initData` verification must run in a separate backend or
a Supabase Edge Function.

The browser client uses only the project URL and anon key. The service-role key
and `TELEGRAM_BOT_TOKEN` are reserved for trusted server code. Telegram identity
rows must be created only after server-side `initData` signature verification;
the migration deliberately gives browser roles no write access to
`auth_identities`.
