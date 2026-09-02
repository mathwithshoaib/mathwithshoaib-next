This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Live schedule feature (`/courses/calc1-fa26/schedule`)

One-time setup, before this route works:

1. **Run the migration.** Open the Supabase project's SQL editor (same project already used for `course_reviews`) and run [supabase/schedule_schema.sql](supabase/schedule_schema.sql) once. It creates the tables/functions and enables RLS with no policies, so only the service-role key (never the public anon key) can read or write them.
2. **Set four environment variables** — in Vercel (Project → Settings → Environment Variables) and in a local `.env.local` for `npm run dev`:

   | Variable | Where to get it |
   |---|---|
   | `SUPABASE_URL` | Same project URL already hardcoded in `app/courses/calc1/page.js` (`https://ujmxucxfqohlvssoxpsc.supabase.co`) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → `service_role` secret. **Never** the `anon`/publishable key. |
   | `ADMIN_SECRET` | Any passcode you choose — this is what you type into `/courses/calc1-fa26/schedule/admin` |
   | `SESSION_SECRET` | A long random string used to sign session cookies, e.g. generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

3. **Populate the page.** The database ships empty on purpose — log into `/courses/calc1-fa26/schedule/admin` with `ADMIN_SECRET` and add lectures, instructor office hours, TF recitations, the 8 tutorial slots, and the TA roster (each TA gets an auto-generated passcode, shown once — copy it before dismissing).

TAs and students use the public page directly; no login is needed to view it, only to book a tutorial seat or an office-hour block.
