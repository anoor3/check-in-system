# PulseCheck

PulseCheck is a modern attendance platform with professor and student portals, rotating QR check-ins, realtime dashboards, and exportable reports. The project is built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- 🔐 Supabase Auth with onboarding for professors and students
- 🧾 Structured data model with RLS, RPCs, and audit logging
- 🧭 Rotating QR tokens, optional geofencing, and secure check-in endpoint
- 📊 Realtime dashboards, attendance history, and CSV export hooks
- 🧪 Vitest unit tests and Playwright E2E scaffolding

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or npm
- Supabase CLI (`npm install -g supabase`)

### Installation

```bash
npm install
```

### Environment variables

Create a `.env.local` file with the following keys:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TOKEN_SIGNING_SECRET=generate-a-strong-secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Supabase setup

```bash
supabase link --project-ref your-project-ref
supabase db push
```

This applies the schema, policies, and RPCs located in `supabase/migrations`.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Testing

```bash
npm run test        # Vitest unit tests
npm run e2e         # Playwright E2E (requires running dev server)
npm run lint        # ESLint
npm run type-check  # TypeScript
```

### Deployment

1. Deploy Supabase migrations via the dashboard or CLI.
2. Set environment variables on Vercel/Netlify as described above.
3. Import the repository into Vercel and deploy (build command: `next build`).
4. After deployment, run through the smoke test described in `DEPLOYMENT_CHECKLIST` below.

### Deployment checklist

- Create professor and student accounts.
- Professor creates a class and starts a 5-minute session.
- Student joins via join code or QR and checks in.
- Professor sees realtime updates and closes the session.
- Export CSV from class and verify.

## Project structure

```
app/              # Next.js routes
components/       # UI primitives and feature components
src/lib/          # Supabase helpers, token utilities, shared utils
supabase/         # SQL migrations, policies, RPC definitions
tests/            # Vitest unit tests
e2e/              # Playwright tests
```

## License

MIT
