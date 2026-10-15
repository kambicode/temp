# KAMBi - Design, Tech Stack and Roles

Companion to the KAMBi Blueprint. Written so a coding agent can build from it directly.

## 1. Accounts and roles

There are exactly two account types.

**User.** Anyone with a Kambi account. Nothing about the account says "admin" or "collector". Capability comes from **event membership**: creating an event makes you its Owner; being invited makes you a Supervisor, Collector or Viewer for that event only. One person can be Owner of one event and Collector in another.

**HQ (ClerQ / Kambi).** Internal staff accounts, created only by an HQ Owner, always with two-factor and a hardware key or authenticator. HQ is one account type with scoped permissions: Support, Safety, Finance, Engineering.

### Event roles (per event, enforced by row level security)

| Role | Can do |
| --- | --- |
| Owner | Everything in the event: forms, members, billing, outputs, publishing, close event, share ownership |
| Supervisor | See all entries and telemetry, merge duplicates, manage follow-ups, invite collectors |
| Collector | Create and edit own entries, see own progress |
| Viewer | Read dashboards and outputs only |

## 2. HQ God mode

An operations console, separate app and separate login, never reachable from the user app.

**What HQ sees**

- Live map of active collectors, heat layers, session tracks (telemetry)
- Fleet health: app versions, battery, connectivity, sync failures, queue depth per device
- Every event: status, entries, balance, goals, owner, last sync
- Money: payments in, refunds, wallet balances, SMS spend, AI spend, margin per entry
- AI job queue, failures, token and cost per generation, nightly synopsis runs
- Moderation queue: held posts, model decisions and disagreements, reports, appeals
- Anomaly alerts: impossible travel, entry bursts, duplicate floods, device tampering
- Audit viewer, feature flags, announcements

**What HQ can do**

- Suspend an event, revoke tokens, force-lock or wipe a device at next connection
- Toggle feature flags per event, per user, or globally
- Resolve moderation disagreements, ban or restore accounts
- Issue refunds and credits

**Limits that protect you**

- HQ sees operations and aggregates, never patient identities. The locked identity table is not readable by any HQ role.
- Break-glass access to any identifiable record requires a written reason, a second HQ approver, a time limit, and an immutable log entry.
- Collector telemetry is disclosed in onboarding and terms, collected only in opted-in sessions.
- Every HQ action is written to the audit log.

## 3. Tech stack

**Monorepo (pnpm workspaces)**

- apps/web - the product (React + TypeScript + Vite)
- apps/android - Capacitor wrapper of apps/web
- apps/desktop - Tauri 2 wrapper of apps/web
- apps/hq - God mode console (React + TypeScript + Vite)
- packages/ui - design system and components
- packages/forms-engine - schema, renderer, validation, skip logic
- packages/sync - offline outbox and sync client
- services/worker - Python VPS worker
- supabase/ - migrations, row level security policies, edge functions

**Frontend**

- React, TypeScript, Vite; Tailwind with design tokens; Radix UI primitives
- Motion (Framer Motion) for all animation; TanStack Query; Zustand for local state
- Lucide icons, 1.5px stroke, as the only iconography
- dnd-kit for the form builder; MapLibre GL for maps and heat layers; visx for charts
- i18next for Swahili and English

**Offline and sync**

- IndexedDB via Dexie on web and desktop; encrypted SQLite (SQLCipher) on Android
- For the camp deadline use a simple outbox: every write is a client-generated UUID upsert, so retries are idempotent. Evaluate PowerSync only if the outbox proves insufficient.
- Capacitor plugins: background geolocation, secure storage, filesystem, camera, push

**Backend**

- Supabase: Postgres, Auth, Realtime, Storage, row level security
- Edge functions for Payme Africa and Textify webhooks
- VPS worker: Python 3.12, systemd timers, psycopg, Pydantic for validating model output
- Job queue: Postgres table with row locking (SKIP LOCKED), idempotent jobs, snapshot reads
- Rendering: WeasyPrint for PDF, python-docx for Word, openpyxl for Excel, matplotlib for charts
- AI: OpenRouter with Qwen-class models, non-logging providers only
- Recommender: short Python script on a 30 minute cron

**Ops**

- Docker Compose on the VPS, Caddy for HTTPS, GitHub Actions for builds
- Sentry for errors, uptime check with alerts to your phone, nightly encrypted backups

## 4. Design system

**Feeling.** Calm, quiet, precise. Apple-inspired: generous space, large titles, content first, chrome that disappears. The interface should feel like it is paying attention to the person, not decorating itself.

**Hard rules**

- No emojis anywhere in the interface: not in buttons, empty states, notifications, or system messages. Icons and vector illustration only.
- AI outputs are instructed not to use emojis and are filtered after generation.
- User-written text (posts, chat): open decision, see section 8.

**Tokens**

- Color: neutral grays for surface and text, one accent derived from the logo's ember and tent character, used sparingly. Full light and dark themes. Semantic colors for success, warning, danger.
- Type: system font stack (SF Pro on Apple devices, Inter elsewhere). Scale of 12, 14, 16, 20, 28, 34. Large title navigation. Tabular numbers for data.
- Space: 4 point grid. Radius: 8 for controls, 14 for cards, 24 for sheets.
- Elevation: borders and subtle blur, not heavy shadows.

**Motion**

- Springs, not linear tweens: stiffness about 300, damping about 30 for most movement; 180 to 280 ms for fades.
- Motion explains change: shared-element transitions from list to detail, sheets rise from the action that opened them, counters count up, charts draw in once.
- Gesture driven where natural: swipe to reply, pull to sync, drag to reorder.
- Respect the reduced motion setting. Keep 60 frames per second on a mid-range Android phone; test there, not on a flagship.

**Navigation.** Bottom tab bar on mobile: Capture, Events, Inbox, Community, You. Sidebar on desktop. Modal tasks open as bottom sheets.

**Key screens**

- *Capture:* one large new-entry action; sections scroll with a thin progress line; save is instant and silent; a quiet pill shows offline state and queue size; tapping it opens the sync sheet.
- *Event dashboard:* goal ring, entries today, per-collector bars, one chart at a time with a segmented switch; heat map as a full-bleed layer.
- *Inbox:* AI outputs as documents with preview thumbnails, labeled as AI drafts, plus system notices.
- *Form builder:* canvas with field palette as a sheet; drag to reorder; each field shows its identifying or safe tag.
- *Community (Threads-like):* single column feed; replies as indented threads with a thin vertical connector; composer as a bottom sheet; quiet icon actions; optimistic updates so nothing waits on the network.
- *Chat:* grouped bubbles, swipe to reply, typing indicator, read state, offline queue with a clear pending mark; messages send instantly and reconcile later.
- *Library, forums, profile and Wrapped:* same components, no special cases.

**Quality floor.** 44 point touch targets, visible focus, contrast of at least 4.5 to 1, text that survives Swahili being longer, skeleton loaders instead of spinners, empty states that say what to do next.

## 5. Build sequence for the agent

1. Monorepo scaffold, design tokens, ui package, auth and role model, row level security
2. Forms engine, builder, capture screen, outbox and sync, media conversion
3. Event dashboard, billing ledger, Payme and Textify edge functions
4. Worker: queue, safety check, anonymization, generation, file rendering, inbox
5. Community: feed, threads, chat, forums, moderation pipeline, recommender
6. HQ console and God mode
7. Android and desktop builds, field test, hardening

## 6. Definition of done for any screen

Works offline, works in both languages, works in both themes, animates with reduced motion respected, has an empty state and an error state, and writes to the audit log where it changes data.

## 7. Telemetry design

Device state and location are sampled by a small collector service in the app, batched, and uploaded with the outbox. Sampling rate drops automatically at low battery. Raw points older than the retention window are aggregated into heat cells and deleted.

## 8. Open decisions

1. Emoji in user-written posts and chat: strip them on input to honor the rule everywhere, or allow them in user text only. Recommendation: block in forms and system text, decide for posts after the camp.
2. HQ staff list and which scoped permission each person holds.
3. Retention periods for telemetry and for event data after the access window.