# Theraria — manual setup checklist

The current preview is intentionally local-only. No Supabase or Gemini credentials were available in the project, and the matching Manus service connectors were disabled when this build began. The features below need service accounts, credentials, code, and/or native-device work before production use.

## 1. Run and explore the current prototype

1. Install Node.js 20 or 22 and npm.
2. From the project root run `npm install` and `npm run dev`.
3. Open `http://localhost:3000`.
4. Try the food journal, hydration buttons, activity controls, meal swaps/skips, catalog search, and share preview. Changes live only in that browser's `localStorage`; clear the `theraria-demo-v1` key to restore the seed data.
5. Do not use this local prototype to store real health records. Browser storage has no account, cloud backup, multi-device sync, or production security boundary.
6. The site includes an installable-web-app manifest, but no service worker, offline caching, or offline data sync.

## 2. Create and secure the Supabase backend

1. Create a Supabase project and record the project URL and publishable/anon key. Keep the `service_role` key server-only; never add it to a `NEXT_PUBLIC_*` variable or browser code.
2. Review and apply [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor. It includes the supplied tables and owner-bound RLS policies; commit future schema changes as reproducible migrations.
3. Before storing real data, review the schema with a Supabase/PostgreSQL engineer. The template enables RLS on every table, gives `foods` a public read-only policy, binds per-user policies to `auth.uid()` in both `USING` and `WITH CHECK`, and creates profiles from Auth sign-ups. It keeps `subscription_tier` and `ai_credits_remaining` out of client insert/update grants. Verify grants, triggers, indexes, consent fields, and deletion/retention rules against your project before applying it.
4. Implement a Supabase client for the browser using only the public URL and anon/publishable key, then enforce authorization with RLS. Add server-side or Edge Function handlers for privileged work. Never bypass RLS with a service key in the client.
5. Add authentication flows, profile creation/onboarding, session restore, sign-out, password/email handling (if offered), and user-owned CRUD for meals, plans, recipes, workouts, and biometrics. Configure exact production and local redirect URLs.
6. Set up backups, environment separation, database migrations, monitoring, and data deletion/export workflows before inviting real users.

## 3. Connect Gemini safely

1. Create a Google AI Studio / Gemini API project and obtain an API key under your own Google account.
2. Implement Next.js server routes or Supabase Edge Functions for image analysis, text parsing, recipe/meal planning, and coaching. Do not call Gemini from browser code with a secret key.
3. Add `GEMINI_API_KEY` to local `.env.local` and to the hosting provider's protected environment settings. Keep the key out of Git, screenshots, logs, and client-visible variables. Use `.env.example` as a names-only reminder.
4. Define versioned JSON output schemas, validate units/ranges, handle timeouts and malformed responses, and show uncertainty/confidence. Keep meal photos transient if that remains the privacy promise; enforce upload limits and delete temporary files.
5. Add server-side rate limits, per-user usage accounting, abuse controls, and real AI-credit deduction before enabling paid limits.
6. Have a qualified nutrition/clinical reviewer approve health copy and the limits of any recommendations. A model's output is not a diagnosis.

## 4. Finish scoring and food data research

The original specification explicitly leaves the health-points, disease-points, cholesterol-style score, risk thresholds, and AI-credit economics undecided. Resolve these with qualified experts before implementing medical or risk claims. Do not expose a “cholesterol detector” or “diabetes detector” as clinically reliable based on the current demo heuristic. Define a sourced, licensed, maintainable food catalog and a policy for portion uncertainty, regional foods, packaged-food labels, allergies, and nutrient values.

## 5. Choose and implement the mobile route

The supplied architecture names both React Native/Expo and Capacitor. These are different approaches, not a single automatically shared mobile shell. Manually choose one:

- **Expo / React Native:** build a native UI and integrate compatible Expo/native modules for camera, microphone, social login, HealthKit, and Health Connect.
- **Capacitor:** package the existing Next.js web experience inside a native shell and implement/purchase appropriate Capacitor plugins and platform configuration.

Then configure the actual iOS Bundle ID/Apple Developer signing, HealthKit entitlement and usage strings, App Store privacy disclosures, Android package ID/signing, Health Connect permissions and policy declarations, OAuth redirect/deep-link schemes, camera/microphone permission copy, and physical-device testing. The README's example IDs are placeholders, not ready-to-ship identifiers. Users must explicitly grant health permissions; the app should request only the data types it needs and provide a clear off switch.

## 6. Complete authentication and account providers

1. Configure Google OAuth credentials and redirect URIs for Supabase Auth.
2. Configure Sign in with Apple with the required Apple Developer account, Service ID, team/key details, callback URL, native entitlement, and platform-specific redirect scheme.
3. Store provider secrets in Supabase/hosting secret stores. Test new-user, returning-user, cancellation, account deletion, and redirect behavior separately on web, iOS, and Android.

## 7. Decide subscriptions before activating payments

Define tiers, billing cadence, price, usage costs per AI action, refunds/cancellations, terms, and whether credits roll over. Implement server-verified entitlements and subscription webhooks, not a client-side credit counter. Configure a payment processor and test mode first; live billing, taxes, refunds, and consumer disclosures require owner decisions. The current credits card is only a visual concept and does not charge or sell anything.

## 8. Deploy the real web application

1. Connect the managed project's code to the repository and hosting account you choose.
2. Configure the production domain and Supabase redirect URLs.
3. Add production Supabase URL/public key and server-only Gemini credentials to the host's protected environment settings. Do not commit `.env.local`.
4. Run migrations, test RLS using separate test accounts, verify account deletion and backups, and test mobile breakpoints and keyboard accessibility.
5. Publish only after privacy, security, legal, nutrition, and user-consent review. The current Preview is not a production deployment.

## 9. Privacy, safety, and product readiness

Health and biometrics are sensitive. Decide what is collected, where it is processed, how long it is retained, how users can export/delete it, and which regions you will serve. Obtain appropriate privacy/security and regulatory advice for your intended market and claims. Add consent, incident response, data minimization, encryption, access logging, and content disclaimers. Do not promise HIPAA/GDPR compliance based on this prototype; actual obligations depend on your role, jurisdiction, product, and deployment.
