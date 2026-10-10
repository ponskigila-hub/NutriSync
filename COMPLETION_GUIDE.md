# Theraria completion guide

## Status at commit `ec7395f`

Theraria is a **browser-local Next.js 15.5.26 / React 19.1 / TypeScript prototype**. The current runtime is intentionally a seeded demo: it has no account boundary, backend, cloud sync, AI service, native device bridge, commerce, or clinical validation.

The baseline was verified in this checkout with:

```bash
npm install
npm run typecheck
npm run build
```

`typecheck` and `build` completed successfully. To explore the prototype:

```bash
npm run dev
# open http://localhost:3000
```

The exact current behavior and constraints are documented in [README.md](./README.md) and [MANUAL_SETUP.md](./MANUAL_SETUP.md). The one-page root route and `/manifest.webmanifest` are static in the current build; there is no service worker or offline data synchronization.

### What already works as a demo

- Responsive dashboard and in-app navigation for overview, food journal, plans, movement, food library, gentle coach, and progress card.
- Manual meal entry, an in-memory photo preview, a visible sample voice-transcript flow, example nutrition estimates, portion adjustment, ingredient notes, and an optional illustrative hidden-oil adjustment.
- Editable sample calorie/macro targets, searchable sample catalog, hydration quick-add, and browser-local workout scheduling/completion.
- Seven-day sample plan with swap/skip behavior and recalculated example totals; sample recipes and categorized grocery list.
- Daily summary and share-text preview.
- Demo persistence in this browser's `localStorage` key `theraria-demo-v1`.

These are **not** production integrations. In particular, a photo is not uploaded, voice is not transcribed, Gemini is not called, displayed metrics are not device readings, and health/disease/cholesterol labels are illustrative placeholders only. The local-storage data is not a protected medical-record store.

## Dependency order and decision gates

Do not start by adding credentials or wiring every button to a service. Use the following gates:

1. **Gate 0 — baseline:** preserve the local demo, record a browser smoke-test checklist, and keep the no-secrets build passing.
2. **Gate 1 — product, safety, data, and market decisions:** the owner, qualified nutrition/clinical reviewer, privacy/security reviewer, and legal/regulatory counsel decide what the product is allowed to say, which data it collects, which regions and users it serves, the retention/deletion model, food-data licensing, and whether any health-risk output is in scope. Until this gate passes, keep all scoring and medical language in demo mode.
3. **Gate 2 — architecture:** choose **one** mobile route (Expo/React Native or Capacitor), choose the deployment/account owners, and approve the data model and API boundaries. These are different architectures; they are not an automatically shared native shell.
4. **Gate 3 — backend and account boundary:** create the Supabase project, review and migrate [supabase/schema.sql](./supabase/schema.sql), implement Auth, test RLS with separate users, and prove export/deletion before importing real user data.
5. **Gate 4 — AI/data contracts:** only after data licensing, privacy treatment, usage limits, and safety copy are approved, add a server-side Gemini boundary, versioned schemas, validation, monitoring, and rate/credit accounting.
6. **Gate 5 — native, billing, and release:** complete device permission review, OAuth redirects, store/developer accounts, entitlement verification, legal copy, accessibility, incident response, and production deployment. A staging release must pass before any live release.

A failed gate is a stop condition, not a reason to expose a placeholder as a real capability.

### Decisions the owner and reviewers need to provide

- **Product:** target users and regions, supported languages, whether the product is wellness-only, and how it handles minors, pregnancy, chronic conditions, allergies, injuries, and other high-risk situations.
- **Data and privacy:** exact data collected, what remains on-device, photo/audio retention, consent, deletion/export, analytics, storage region, and vendor disclosures.
- **Architecture:** web host/domain, account owner for Supabase/Gemini/OAuth, and one mobile direction. A useful decision rule is Capacitor when keeping this Next.js UI is the priority; Expo when native UX/device work justifies a significant React Native rebuild. Prove feasibility before committing.
- **Business:** whether subscriptions exist at launch; if yes, owner-approved plans, prices, currencies/regions, cancellation/refund terms, and credit rules. This guide does not choose them.
- **Qualified review:** nutrition/clinical and legal/regulatory reviewers for health claims, score terminology, user exclusions, and launch markets; security/privacy review for sensitive data flows.

Create accounts and enter credentials directly into provider consoles or protected secret stores. **Do not send passwords, API keys, Apple private keys, payment credentials, or other secrets in chat or commit them to the repository.**

## Ordered workstreams

### 1. Freeze the demo baseline and test contract

**Depends on:** none. **Unblocks:** all other workstreams.

1. Create a branch from `ec7395f` and preserve the seeded/local-only mode behind an explicit configuration flag.
2. Add a short manual smoke checklist covering first load, navigation, meal add/edit/delete, photo preview, sample transcript, hydration, workout completion, plan swap/skip, catalog search, and share preview.
3. Keep the `theraria-demo-v1` reset behavior documented. Add automated tests for deterministic sample calculations and local-storage migration/clearing if the project test stack is introduced.
4. Make every future connected feature fail closed to a clearly labeled demo state when its environment variables or provider is absent.

**Acceptance checks:**

- `npm run typecheck` and `npm run build` pass from a clean install.
- The smoke checklist passes on a current desktop browser and a narrow mobile viewport.
- No test, demo seed, screenshot, or log contains real health data or credentials.
- Disconnecting all providers still produces an honest local demo; it does not show “synced,” “analyzed,” “transcribed,” or “subscribed.”

### 2. Resolve product, safety, nutrition, and data decisions

**Depends on:** workstream 1. **Blocks:** scoring, AI, catalog, cloud data, and release.

1. Write a product decision record defining whether Theraria is a general wellness tool or will make any medical/clinical claim. Define target users, excluded users/use cases, supported regions, age policy, escalation language, and the exact meaning of every score, flag, goal, and recommendation.
2. Have a qualified nutrition/clinical reviewer approve user-facing copy and the boundary between education, wellness guidance, and medical advice. Do not invent thresholds, diagnoses, disease categories, cholesterol logic, blood-sugar flags, or clinical next-food rules in code.
3. Define the data inventory: profile fields, meals, biometrics, photos, transcripts, AI prompts/outputs, device data, logs, analytics, support data, and billing records. For each field decide purpose, lawful/consent basis as advised by counsel, access, retention, deletion, export format, region, processor, and whether it can remain local-only.
4. Decide whether photos and voice data are transient. The privacy promise should be implementable: if they are not needed after parsing, do not retain them; if retention is needed, document it and implement deletion.
5. Select a maintained food/nutrient source with the necessary license and provenance. Define handling for portions, packaged labels, regional foods, allergens, missing values, and uncertainty. Do not copy a catalog into production until licensing and review are complete.

**Acceptance checks:**

- Signed decision records exist for claims, user scope, data inventory, retention/deletion/export, food source/license, and safety escalation.
- Every score and warning in the UI has an approved definition or is visibly labeled “illustrative demo only.”
- A reviewer can trace each displayed nutrient value to a source and unit, or the UI states that it is sample content.
- Privacy and safety copy is approved for the first intended region; unknown regions remain out of scope.

**Approval-dependent:** all clinical meaning, claims, thresholds, user exclusions, consent wording, regions, food-data licensing, and retention choices require human owner/reviewer decisions. This guide does not supply clinical scoring recommendations.

### 3. Convert the Supabase starter schema into reviewed migrations and RLS tests

**Depends on:** workstream 2 and the architecture choice at Gate 2. **Unblocks:** accounts and sync.

1. Create a Supabase project owned by the project owner. Review [supabase/schema.sql](./supabase/schema.sql) with a PostgreSQL/Supabase engineer before applying it. It defines `profiles`, `meals`, `foods`, `workouts`, `meal_plans`, `recipes`, `biometrics`, and `disease_categories`, with RLS and a public-read `foods` policy; it is **not connected** to the current app.
2. Move the reviewed SQL into timestamped `supabase/migrations/` files. Use the [Supabase migration workflow](https://supabase.com/docs/guides/deployment/database-migrations) rather than making untracked remote edits.
3. Re-check all constraints, nullable fields, units, indexes, timestamps/time zones, ownership columns, profile trigger behavior, and server-managed fields. Reconsider placeholder scoring columns before any real health data is stored.
4. Set grants deliberately. The [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security) explains that grants and policies both matter, and that a service role bypasses RLS and must remain server-side.
5. Add positive and negative RLS tests for anonymous users, user A, user B, public catalog reads, inserts, updates, deletes, profile fields, and server-managed subscription/credit fields. Test the Auth signup trigger and cascade deletion in a disposable project.
6. Add backup, environment separation, migration review, monitoring, and a documented restore rehearsal before production data.

**Acceptance checks:**

- A fresh disposable database can be created from migrations and reset to a known state.
- `supabase test db` (or an equivalent reviewed SQL test harness) proves that user A cannot read or mutate user B's rows and cannot change billing/credit fields.
- `foods` exposes only the deliberately approved public-read surface; no client write path exists unless separately designed and tested.
- Account deletion removes or anonymizes dependent data according to the approved retention decision, and export returns the documented fields.
- No browser code uses a service-role key.

### 4. Add authentication, onboarding, account lifecycle, and cloud CRUD

**Depends on:** workstream 3. **Unblocks:** authenticated sync, provider integrations, and private AI usage.

1. Implement browser/server Supabase clients using the current Next.js App Router pattern in the [Supabase Next.js Auth guide](https://supabase.com/docs/guides/auth/quickstarts/nextjs). Use only the public project URL and publishable/anon key in browser-visible configuration.
2. Add sign-up/sign-in, session restoration, sign-out, profile creation, onboarding, email/password handling if offered, and clear loading/error states. Configure exact local, preview, and production redirect URLs.
3. Replace local-only CRUD progressively, not all at once: meals first, then goals/profile, hydration/activity, plans/recipes, and finally approved biometrics. Keep a migration path for an existing demo user without silently uploading demo seed data.
4. Add optimistic UI only where conflict behavior is defined. Decide timestamps, idempotency, retries, pagination, timezone/date semantics, and multi-device merge behavior.
5. Implement account export, deletion, consent withdrawal, session revocation, and support recovery before inviting real users.

**Acceptance checks:**

- New, returning, signed-out, expired-session, cancelled, and deleted-account flows work in staging.
- Two test accounts prove private data isolation through the UI and direct API attempts.
- Refreshing or signing in on a second browser restores only the signed-in user's approved data.
- Offline/local-only mode does not pretend that unsent data is backed up; failed sync is visible and retryable.
- Export and deletion are exercised against a disposable account and leave no unintended private rows or files.

### 5. Establish the private data and media boundary

**Depends on:** workstreams 2–4. **Unblocks:** photo AI and production privacy review.

1. Decide whether meal photos, voice recordings, transcripts, and AI prompts are stored at all. Prefer transient processing where possible.
2. If storage is approved, create private storage buckets with per-user object paths, size/type limits, short-lived signed URLs, malware/content checks as appropriate, and deletion jobs. Do not use public URLs for private health-related media.
3. Keep image bytes out of `localStorage`, logs, analytics payloads, error reports, and client-visible source maps. Redact prompts and outputs in logs.
4. Add explicit consent and a visible delete/clear action for any retained media or derived transcript. Document provider subprocessors and cross-border processing only after counsel confirms the applicable disclosure.

**Acceptance checks:**

- An unauthenticated request cannot read an object; user B cannot read user A's object.
- Upload rejection covers oversize, unsupported, malformed, and expired requests.
- Deleting the source record deletes or schedules deletion of related media and derived data according to the retention policy.
- Logs and analytics contain identifiers only where approved and never raw photos, transcripts, tokens, or full health payloads.

### 6. Add Gemini through a server-side, validated AI boundary

**Depends on:** workstreams 2, 4, and 5. **Blocks:** live photo/voice/coach claims.

1. Create a Google AI Studio/Gemini project only when the owner approves the data-processing and usage plan. Implement Next.js server routes or a Supabase Edge Function; never call Gemini from browser code with a secret.
2. Use a versioned request contract for photo interpretation, actual speech-to-text, text parsing, recipe/plan generation, and coaching. Choose and verify a supported transcription provider/API separately; define audio formats, languages, size/time limits, consent, retention, errors, and an editable transcript. Do not treat the current sample transcript as real transcription.
3. Use a JSON Schema response format where useful, then validate the result again in application code. The official [Gemini structured-output documentation](https://ai.google.dev/gemini-api/docs/generate-content/structured-output) notes that schema-compliant JSON can still be semantically wrong and requires application validation.
4. Treat image and voice results as estimates. Ask for user confirmation before saving a meal; preserve the source label and uncertainty instead of presenting an estimate as a measurement.
5. Add authentication, per-user rate limits, abuse controls, request size limits, provider error handling, audit events without sensitive payloads, and real server-side usage accounting. Do not activate paid credits until entitlements are defined and verified.
6. Keep model-generated medical, disease, blood-sugar, cholesterol, or treatment content disabled unless workstream 2 has approved a reviewed, non-diagnostic product scope and a qualified reviewer has approved the exact copy and safeguards.

**Acceptance checks:**

- With `GEMINI_API_KEY` absent, the app remains honest demo mode; with it present, only the server boundary can reach Gemini.
- A test suite rejects malformed JSON, out-of-range numbers, missing units, prompt injection attempts, oversized inputs, timeout/error responses, and semantically unsafe output.
- Every AI result is labeled as AI-estimated, shows uncertainty where relevant, and requires user confirmation before persistence.
- Provider calls and usage are attributable to the authenticated user without logging sensitive content.
- A red-team test cannot extract the key from browser bundles, network responses, logs, or source control.

**Credential rule:** the [official Gemini API-key guidance](https://ai.google.dev/gemini-api/docs/api-key) says to treat keys like passwords, keep them out of source control and production client code, and use environment variables or a secret manager. For local development, put the key only in an ignored `.env.local` as `GEMINI_API_KEY=...`; for hosting, use protected server environment settings. Never use `NEXT_PUBLIC_GEMINI_API_KEY`, screenshots, chat messages, or committed files. Rotate and revoke any leaked key.

### 7. Replace sample catalog and nutrition estimates with governed food data

**Depends on:** workstream 2 and the reviewed schema in workstream 3. **Unblocks:** trustworthy logging and plan generation.

1. Choose the licensed/owned source and record attribution, version, update cadence, region, serving units, and allowed transformations.
   As one candidate, review [USDA FoodData Central's API guide](https://fdc.nal.usda.gov/api-guide) and [data-type documentation](https://fdc.nal.usda.gov/data-documentation); its data types have different provenance and update cadences, so retain identifiers and source type rather than merging them invisibly.
2. Create an import/normalization pipeline with stable source IDs, provenance, unit conversion tests, locale handling, allergen fields, package-label overrides, and missing-value behavior.
3. Keep public catalog data separate from private user meals. Preserve the source and version used for each estimate so a later catalog update does not silently rewrite history.
4. Replace hard-coded examples incrementally. Provide manual correction and show when a value is estimated, user-entered, label-derived, or source-derived.

**Acceptance checks:**

- Every production catalog row has provenance, units, license status, and an import version.
- Golden test fixtures cover serving conversion, rounding, duplicate foods, regional names, allergens, and missing nutrients.
- A catalog update is repeatable and does not alter prior user records without an explicit migration.
- The UI never describes a sample or uncertain estimate as a laboratory or clinical measurement.

### 8. Decide and validate scores, coaching, and safety behavior

**Depends on:** workstreams 2, 6, and 7. **Must remain demo-only until approved.**

1. Inventory every current placeholder: daily health score, health points, disease points, cholesterol-style categories, blood-sugar flags, risk labels, “healthy/not yet,” and adaptive coaching.
2. For each item, choose one of: remove it; keep it explicitly illustrative; or submit a documented methodology for qualified clinical/nutrition, safety, and legal review. NIH [nutrient recommendation references](https://ods.od.nih.gov/HealthInformation/nutrientrecommendations.aspx) are population-level references, not automatically individualized targets. Review FDA [Clinical Decision Support](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software) and [General Wellness](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices) guidance with counsel if claims may be clinical. This guide does not choose thresholds or scoring formulas.
3. If a reviewed methodology is approved, version it, cite its evidence, define validation and monitoring, specify contraindications and uncertainty, and add a user-visible explanation and correction path. Separate wellness education from diagnosis, treatment, or risk prediction.
4. Add safe refusal and escalation copy for symptoms, emergencies, eating-disorder signals, allergies, pregnancy, medication interactions, and other out-of-scope contexts as determined by reviewers. Do not direct users to change treatment based on app output.
5. Remove or rename schema/UI fields that imply clinical validity if the product decision does not support them. Placeholder columns in [supabase/schema.sql](./supabase/schema.sql) are not a methodology.

**Acceptance checks:**

- A qualified reviewer signs off on any non-demo health claim; otherwise the feature remains disabled or visibly demo-only.
- No UI, API, database field, analytics event, or marketing copy calls an illustrative output a diagnosis, detector, validated risk score, or medical recommendation.
- Adversarial and edge-case fixtures produce a safe non-diagnostic response and do not invent certainty.
- Version changes are auditable and can be rolled back.

### 9. Choose and implement the mobile route and device integrations

**Depends on:** Gate 2, workstreams 2–4, and a working web data boundary. **Do not build both routes in parallel.**

1. Choose **Expo/React Native** for a native UI, or **Capacitor** to package the web experience. Record why, what code is shared, and which features are native-only. Capacitor is the reuse-first route only if a compatible static build and required plugins are proven; Expo is the native-first route and requires a separate app surface/rebuild. The current project contains neither native route.
2. For iOS, configure the real Bundle ID, Apple Developer signing, entitlements, usage descriptions, and physical-device test plan. Review [Apple HealthKit documentation](https://developer.apple.com/documentation/healthkit): HealthKit requires user permission and apps must protect sensitive health data.
3. For Android, configure the real package ID, signing, manifest permissions, privacy-policy rationale, and physical-device test plan. Review the [Health Connect getting-started guide](https://developer.android.com/health-and-fitness/health-connect/get-started): declare only required data types, request permissions at runtime, and handle later revocation.
4. Ask only for the minimum needed read/write types. Implement a clear connect/disconnect switch, permission status, revoked-permission state, unavailable-device state, manual fallback, and source/date labels.
5. Keep native readings distinct from user-entered data and demo metrics. Define time zones, deduplication, source precedence, backfill, deletion, and whether data is sent to the cloud.
6. Test camera, microphone, deep links, keyboard/accessibility, permissions denied/limited/revoked, fresh installs, upgrades, and real devices. Do not call a simulator value a device integration.

**Acceptance checks:**

- A signed test build can request only approved permissions and correctly handles grant, denial, later revocation, unavailable provider, and disconnect.
- Health data is not read or written before consent and is not silently uploaded.
- A user can delete imported records or disconnect without losing unrelated app data, subject to the approved retention policy.
- Store privacy disclosures, permission text, and in-app copy agree.

**User/device/account dependent:** Apple and Google developer accounts, real identifiers/signing, platform review, physical devices, user permissions, and store disclosures are required. No HealthKit or Health Connect integration is live in the current prototype.

### 10. Complete Google and Apple account providers

**Depends on:** workstreams 3–4 and the chosen web/mobile redirect architecture.

1. Configure Google OAuth client IDs and exact redirect URIs for local, preview, production, iOS, and Android where applicable. Follow Google's [OAuth 2.0 web-server documentation](https://developers.google.com/identity/protocols/oauth2/web-server); do not use a copied client secret in browser code.
2. Configure Sign in with Apple using the owner's Apple Developer account, Services ID/native entitlement, callback URL, key/team details, and platform redirect/deep-link scheme. Apple's [Sign in with Apple documentation](https://developer.apple.com/documentation/signinwithapple) distinguishes website support from native app support and server communication.
3. Store provider secrets in Supabase/hosting secret stores. Map provider subject IDs to one account without trusting an email as a permanent identifier. Define account linking, duplicate-account handling, email privacy relay behavior, cancellation, and deletion.
4. Test first sign-in, returning sign-in, cancelled consent, wrong redirect, expired session, revoked provider authorization, account linking, and deletion on each target platform.

**Acceptance checks:**

- All redirect URIs are exact and environment-specific; no wildcard production redirect is used.
- Provider secrets are absent from browser bundles and Git.
- New and returning users land in the right profile, and deleting/revoking a provider account follows the approved account policy.
- OAuth failure messages do not leak tokens or personal data.

**Account-dependent:** Google Cloud/Google OAuth ownership, Apple Developer membership and identifiers, Supabase Auth configuration, and platform review are not present in this checkout.

### 11. Define and implement subscriptions and AI credits only after entitlements are decided

**Depends on:** workstreams 2, 4, 6, and legal/owner decisions. **No processor or price is assumed here.**

1. Decide tiers, billing cadence, regional availability, taxes, trials, refunds, cancellations, grace periods, usage units, credit expiry/rollover, support policy, and consumer disclosures. Record decisions before writing checkout UI. Do not copy values from the demo card.
2. Select a payment processor and verify its current technical and legal requirements directly with the owner and counsel. Use test mode first; do not state pricing or provider policy until verified for the target region and date.
3. Make the server authoritative: checkout session creation, webhook signature verification, idempotent event handling, entitlement state, refunds/cancellations, and credit ledger. Do not trust a client-side counter or a client-supplied subscription tier.
4. Keep `subscription_tier` and `ai_credits_remaining` server-managed. Review the starter grants in [supabase/schema.sql](./supabase/schema.sql) and add a ledger/audit model only after the entitlement design is approved.
5. Gate AI actions on server-verified entitlement and usage; show a clear non-commerce placeholder when billing is disabled.

**Acceptance checks:**

- Test-mode purchase, renewal, failed payment, cancellation, refund, duplicate webhook, delayed webhook, and account deletion produce deterministic entitlement states.
- Client tampering cannot grant credits or paid access.
- Webhook handlers are authenticated, idempotent, replay-safe, observable, and do not log payment secrets.
- Receipts, cancellation, refund, and support paths match approved disclosures.

**Owner/legal/provider dependent:** tiers, prices, credits, processor choice, taxes, refunds, store billing rules, and consumer terms are intentionally unresolved. This guide makes no pricing or policy claim.

### 12. Add progress-card image export and accessible sharing

**Depends on:** workstreams 1–2. **Can ship locally without accounts or a backend.**

1. Keep the progress card as semantic HTML with headings and readable values; an image/canvas is an export, never the only way to access the data.
2. Add a user-initiated **Download PNG** action from the current card model. Use a meaningful filename, handle image-generation failure, and avoid including name/email or unnecessary health-related values by default.
3. Optionally offer native file sharing only after feature-detection and a direct user action; keep download as the fallback. Do not create a public ID/link until a server-backed record, access model, consent, expiry/revocation, and abuse controls exist.
4. Provide visible success/failure status and keyboard access. Check focus, contrast, zoom/reflow, labels, and screen-reader equivalents against [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

**Acceptance checks:**

- A user can download a PNG without login, API credentials, or network access; it matches the values and units shown in the accessible card.
- Unsupported browsers, denied/cancelled sharing, or image-generation errors leave the card usable and provide a clear fallback.
- A local reference is never described as a public share link, and users are told that exported files may expose their chosen progress data.

### 13. Production web, PWA, privacy, security, and release readiness

**Depends on all prior workstreams and Gate 5.**

1. Choose the hosting/project owner and connect the repository only after staging has passed. Configure production domain, TLS, Supabase redirect URLs, preview isolation, cache rules, and private/no-store handling for authenticated data.
2. Add only approved variables to each environment. The [Vercel environment-variable documentation](https://vercel.com/docs/environment-variables) explains that variables are configured outside source and apply to new deployments; use protected access and separate development, preview, and production values.
3. Keep public values limited to what must be browser-visible, such as a Supabase URL and publishable key. Keep service-role, Gemini, OAuth private keys, webhook secrets, storage signing keys, and payment secrets server-only. Do not commit `.env.local`; keep `.env.example` names-only.
4. Add a real service worker/offline strategy only if the product decision supports it. Define what can be cached, how auth/private data is excluded, how queued local changes reconcile, and how users are warned when they are offline. Follow the [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps), but verify its recommendations against this project's pinned Next.js 15 version. Do not describe the current manifest as offline support.
5. Add CSP and security headers, input validation, CSRF/session protections appropriate to the chosen architecture, dependency/update review, error boundaries, rate limits, access logging, alerting, backup/restore, incident response, and secret rotation.
6. Complete privacy notice, consent screens, data export/deletion UI, retention jobs, subprocessor disclosures, age/user restrictions, accessibility review, localization/time-zone review, and support contact. Obtain legal/regulatory advice for the intended market; do not promise HIPAA, GDPR, or other compliance based on this prototype.
7. Run a staging release with separate test accounts and test devices. Publish only after product, clinical/nutrition, privacy/security, legal, platform, and owner sign-offs are recorded.

**Acceptance checks:**

- A clean production-like build starts with no secrets in the repository or client bundle; `npm run typecheck` and `npm run build` pass in CI.
- Authenticated responses are private and uncached where required; public catalog caching does not expose private data.
- Backup restore, account export/deletion, secret rotation, incident alert, and rollback are rehearsed.
- Mobile viewport, keyboard, screen-reader, focus, reduced-motion, and error-state checks pass.
- Production monitoring can distinguish demo mode, provider outage, sync failure, AI failure, and billing webhook lag without logging sensitive payloads.
- Release notes and UI never claim that an integration is live unless its staging and production checks actually passed.

## Safe credential placement summary

- **Local:** use an ignored `.env.local`; never commit it. Keep `.env.example` names-only. `NEXT_PUBLIC_*` values are browser-visible by design; use that prefix only for values that are safe to expose.
- **Server:** read `GEMINI_API_KEY`, Supabase service-role credentials, OAuth private keys, webhook secrets, and payment secrets only in server routes, server actions, or Edge Functions. Validate that these variables are absent from client modules and responses.
- **Hosted:** use the hosting provider's protected environment/secret store, with separate development, preview, and production values. The server-side environment is the right place for secrets; a browser proxy is not a secret boundary if it returns the secret.
- **Operations:** restrict access by role, rotate on staff/provider changes or suspected exposure, audit usage, and revoke leaked credentials. Never paste secrets into issues, chat, screenshots, test fixtures, logs, analytics, or Git history.

## Explicit non-medical and privacy limits

Until the relevant review and validation work is completed, Theraria must say plainly that it is a **wellness prototype, not a medical device, diagnostic service, clinician, emergency service, or substitute for professional care**. It must not diagnose diabetes or cholesterol problems, predict disease risk, prescribe treatment, calculate a clinically validated health score, recommend changing medication, or imply that sample/device/AI values are measurements.

The current local prototype stores demo edits in browser `localStorage`. That storage has no account isolation, cloud backup, multi-device synchronization, production access control, or medical-record safeguards. Do not enter real sensitive health information. If real health data is later accepted, minimize collection, obtain appropriate consent, restrict access, encrypt in transit and at rest through the selected providers, define retention and deletion, provide export, protect logs, and obtain jurisdiction-specific privacy/security/legal advice. HealthKit and Health Connect permissions are user-controlled and do not by themselves authorize arbitrary cloud processing.

## Preserved research gaps, failures, and unresolved decisions

- Official platform documentation explains provider APIs and general requirements; it does not establish that the current app is compatible with every target device, SDK, provider account, legal context, or future policy revision. Revalidate versions and account-specific requirements during implementation.
- No Supabase project, Gemini credential, OAuth client, payment processor, native project, device entitlement, production domain, or managed deployment is connected in this checkout. Any such setup remains future work.
- The original health-points, disease-points, cholesterol-style score, risk thresholds, blood-sugar flags, and AI-credit economics remain unresolved. No clinical formula, threshold, recommendation, price, or subscription policy is supplied here.
- Food catalog provenance/licensing, regional nutrient coverage, portion uncertainty, allergy handling, data retention regions, subprocessors, age policy, and legal/regulatory classification remain decisions for the owner and qualified advisers.
- Expo versus Capacitor remains an architecture choice. HealthKit and Health Connect behavior, permission text, data types, store requirements, and platform policy must be rechecked against the exact target SDKs and release date.
- Billing and provider pricing/policies are intentionally not stated. Confirm current terms directly with the selected providers and counsel before implementation.
- The current PWA manifest is not offline support. Service worker, cache invalidation, offline queueing, and conflict resolution remain unimplemented.

## Official references used for implementation boundaries

- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Gemini API key security](https://ai.google.dev/gemini-api/docs/api-key)
- [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/generate-content/structured-output)
- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide)
- [NIH nutrient recommendation references](https://ods.od.nih.gov/HealthInformation/nutrientrecommendations.aspx)
- [FDA Clinical Decision Support guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software)
- [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Expo guidance for using Next.js](https://docs.expo.dev/guides/using-nextjs/)
- [Capacitor installation for an existing web app](https://capacitorjs.com/docs/getting-started)
- [Apple HealthKit](https://developer.apple.com/documentation/healthkit)
- [Apple HealthKit access configuration](https://developer.apple.com/documentation/xcode/configuring-healthkit-access)
- [Android Health Connect getting started](https://developer.android.com/health-and-fitness/health-connect/get-started)
- [Android Health Connect data types](https://developer.android.com/health-and-fitness/health-connect/data-types)
- [Apple Sign in with Apple](https://developer.apple.com/documentation/signinwithapple)
- [Google OAuth 2.0 for web-server applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Stripe webhook signatures and event handling](https://docs.stripe.com/webhooks) (example only; no processor is selected)
- [WCAG 2.2 accessibility standard](https://www.w3.org/TR/WCAG22/)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
