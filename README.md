# Theraria — NutriSync AI

A browser-first, responsive nutrition and wellness prototype built with Next.js 15, React 19, and TypeScript, with a minimal installable-web-app manifest.

## Run the prototype

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. This project uses a local-only preview with seeded sample content. Food entries, target edits, water, movement, and plan changes are saved in this browser's `localStorage` under `theraria-demo-v1`. They are not synced, backed up, or protected as medical records. The PWA manifest does not add offline caching or offline data sync. Do not enter real sensitive health information.

## What works in this prototype

- Responsive dashboard and internal navigation for overview, food journal, plans, movement, food library, gentle coach, and progress card.
- Manual meal entries, local-only photo preview, sample voice transcript flow, simple example nutrition estimates, portion adjustment, manual ingredient notes, and an optional illustrative hidden-oil adjustment.
- Editable sample calorie/macro targets; a searchable sample food catalog; hydration quick-add; local workout scheduling and completion toggles.
- Seven-day sample meal plan with swap/skip actions and recalculated example totals; sample recipes and a categorized grocery list.
- Daily summary and a share-text preview.

## Not connected

Gemini vision/NLP, clinically validated health or disease scoring, blood-sugar/cholesterol evaluation, Supabase authentication/database/storage, cloud sync, OAuth, subscriptions/checkout, actual speech transcription, and Apple HealthKit/Google Health Connect are **not implemented or connected**. Displayed health metrics are examples only, not diagnoses or medical advice. Photo files are previewed temporarily in the tab and are not uploaded or persisted.

## Backend starter

[`supabase/schema.sql`](./supabase/schema.sql) contains a reviewable version of the requested starter schema, including owner-bound RLS checks and a read-only public food catalog policy. It is not connected to this prototype; review it before applying it to a real project. The scoring columns remain placeholders. See [MANUAL_SETUP.md](./MANUAL_SETUP.md) for integration, security, research, mobile, and deployment work.

The `.env.example` file is a names-only variable template with no keys. The project is licensed under MIT; see [LICENSE](./LICENSE).
