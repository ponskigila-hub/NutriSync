# Theraria MVP implementation plan

## Goal and accepted scope

Build the confirmed browser-first Next.js 15 MVP from the Theraria/NutriSync AI specification. The application should run without secrets, use sample content and browser-local persistence, be responsive and navigable, and state plainly that Gemini AI, clinical/medical scoring, user accounts, cloud sync, subscriptions, and HealthKit/Health Connect are demo or not connected.

Deliver the approved feature groups:

1. Responsive daily dashboard: daily health score and calorie target, nutrition progress, hydration, recent meals, activity, sleep, and navigation across the MVP sections.
2. Meal logging: typed food entries, demo photo and voice entry flows, portion/ingredient correction including hidden oils/sauces, estimated calories/macros/micronutrients/food scores, healthy/not-yet summary, and day/week/month summaries using transparent demo methodology. Label health/disease/cholesterol points, blood-sugar flags, and next-food suggestions as unvalidated, non-medical demonstration outputs.
3. Macro controls and searchable sample food catalog: descriptions, nutrition, type, origin, benefits/drawbacks, placeholder health/disease points, and placeholder cholesterol categories.
4. Hydration: quick-add amounts, daily progress, streak presentation, browser-local persistence.
5. Workout/activity: workout logging/scheduling and sample steps, active calories, resting heart rate, HRV, and sleep; distinguish sample metrics from disconnected wearable integrations and coaching.
6. Meal planning: daily and seven-day previews; goals include fat loss, muscle gain, keto, and vegan; swap/skip actions recalculate sample totals.
7. Recipes and grocery list: sample recipe previews guided by goals/available ingredients and categorized grocery lists derived from the chosen sample plan.
8. Progress sharing and credits: previewable share card and subscription/AI-credit placeholders, not functioning commerce.
9. Integration/setup documentation: explain the manual work for Supabase Auth/PostgreSQL/RLS/Edge Functions/Storage, Gemini, Capacitor camera/microphone/social login/HealthKit/Health Connect, React Native/Expo, and Vercel. Include the research/product decisions still needed for scoring, health/disease-point methodology, subscription/credit tiers, and food catalog sourcing.

## Technical approach

- Use Next.js 15 with React 19 and TypeScript, configured for the Cloud Preview environment. Keep one root application route and make section navigation stateful inside the application shell; the root route is the only current page route. Include a minimal installable web-app manifest, while leaving offline caching/service-worker behavior for a later production pass.
- Use a responsive client-rendered interface. For this prototype, hydrate demo seed data in the browser and persist only demo meals, goals, hydration, workouts, and plan edits in `localStorage`. Do not treat browser storage as secure storage for real health data.
- Use CSS variables and CSS modules/global styles for the accepted Botanical Editorial visual direction. Use Lucide icons and lightweight CSS-generated progress visuals; avoid unnecessary chart/data or image dependencies.
- Photo entry may preview a selected image only in memory and must not save image bytes. Since no Gemini service is connected, show static/sample nutrition results only. Voice entry uses a visible demo transcript action or typed transcript; do not claim transcription works.
- Scores and disease-related labels are illustrative, rule-based demo outputs only, with visible non-medical disclaimers. Do not represent cholesterol scores or diabetes detection as validated.
- Keep integration boundaries explicit: no credentials are present and the Supabase and Google Gemini session connectors are disabled. Do not call external services or fabricate secrets.

## Serving and deployment

For this preview-only MVP, serve the client-rendered Next.js application on the existing Cloud Preview runtime. The current project has no managed server, database, or public deployment enabled; this avoids implying that private user data or integrations persist in a cloud backend. A future production system should keep browser assets static/cached and route authenticated private data and AI work through a server-side API, with uncached/private handling for user-specific data. Production publishing is outside the current task and requires the owner to finish service setup first.

## Project structure

- `app/` — Next.js App Router root page, layout, installable PWA manifest route, and global styles.
- `components/` — application shell, dashboard cards, meal editor, catalog, activity, planning, and share-preview UI.
- `lib/` — strongly typed demo data, deterministic sample calculations, local persistence helpers, and integration-boundary constants.
- `public/` — full-bleed project logo used as the site icon and root route manifest; the generated dashboard meal visual is served from the reserved managed-media URL.
- `supabase/` — reviewable RLS-enabled starter schema and Auth signup trigger for future manual backend integration; not used by the local demo runtime.
- `README.md` — run instructions and manual production integration checklist.
- `ideas.md` — accepted design brief.

## Verification

Use the project's automatic TypeScript diagnostics and the established package scripts for type/lint/build checks when available. Start the app only after the root route and `/manus-routes.json` manifest exist; verify the listener and request that manifest over HTTP. Keep all claims limited to checks that actually ran. Do not publish or claim real AI, data sync, or native capabilities are connected.
