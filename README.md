# FocusFlow — Student Task Tracker

Production-oriented Next.js + Prisma + PostgreSQL student task tracker with authenticated task ownership, reminders, overdue processing, notifications, and Vercel Cron support.

## Local development

1. Install Node.js 20+ and PostgreSQL (Neon or Supabase works well).
2. Clone the repository and checkout `feature/daily-task-tracker`.
3. Install dependencies:

```bash
npm install
```

4. Copy `.env.example` to `.env` and set:

```env
DATABASE_URL="your Neon/Supabase pooled PostgreSQL URL"
AUTH_SECRET="a long random secret"
NEXTAUTH_URL="http://localhost:3000"
CRON_SECRET="another long random secret"
```

5. Create the database schema:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000, register, and create tasks.

## Reminder testing

The server-side processor is protected and does not require a persistent worker:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/process-reminders
```

It atomically claims reminder/overdue work, so repeated cron invocations do not duplicate processing. Browser notifications require a browser permission layer to be added on the client; database notifications are created by the processor.

## Vercel deployment

1. Create a Neon or Supabase PostgreSQL database.
2. Import this GitHub repository into Vercel.
3. Add these Vercel environment variables for Preview and Production:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL, for example `https://your-app.vercel.app`)
   - `CRON_SECRET`
4. Deploy.
5. Run `npx prisma migrate deploy` against the production database, or configure the deployment pipeline to run it before the application starts.
6. Confirm Vercel Cron is enabled. `vercel.json` invokes `/api/cron/process-reminders` every five minutes. Vercel supplies the cron authorization header only when configured according to the project’s cron settings; for manual testing use the bearer secret shown above.

## Important production notes

- Never commit `.env` or credentials.
- Use a strong random `AUTH_SECRET` and `CRON_SECRET`.
- Configure rate limiting at Vercel/edge or with a provider before public launch.
- Run lint, type-check, migration, and build checks in CI before merging.
