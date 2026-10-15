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
- Money: payments in, refunds, wallet balances, SMS spend, boost revenue, AI spend, margin per entry
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
- lottie-web (or dotLottie) for animated emoji and the typing indicator; loaded lazily
- dnd-kit for the form builder; MapLibre GL for maps and heat layers; visx for charts
- i18next for Swahili and English

**Offline and sync**

- IndexedDB via Dexie on web and desktop; encrypted SQLite (SQLCipher) on Android
- For the camp deadline use a simple outbox: every write is a client-generated UUID upsert, so retries are idempotent. Evaluate PowerSync only if the outbox proves insufficient.
- Capacitor plugins: background geolocation, secure storage, filesystem, camera, push

**Backend**

- Supabase: Postgres, Auth, Realtime, Storage, row level security
- Edge functions for Payme Africa and Textify webhooks
- Search: Postgres full-text search (tsvector) with pg_trgm for typo tolerance; no separate search service for now
- Zenodo client in the VPS worker (REST API, OAuth 2.0 per author, sandbox.zenodo.org for testing)
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
- User-written text (posts, chat): emoji are allowed only through Kambi's own emoji system (section 4.1). Native operating-system emoji glyphs are never drawn anywhere in the app.

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

### 4.1 Emoji system

- Storage stays plain Unicode in the database, so text is portable, searchable and moderatable.
- Rendering is always from Kambi's bundled set, never the device font. Source set: Noto Animated Emoji (Google, Lottie format, CC BY 4.0, roughly 36 to 66 KB each). Static fallback: Noto SVG for emoji without an animation and for reduced motion.
- Animation: an emoji sent alone or in a short message plays once, springing in from the send action, then rests on its first frame. Reactions play on tap. Emoji inside long text render static. Reduced motion shows static only.
- Picker: bottom sheet with search, recents, and categories; no emoji appear in the picker chrome itself, only in the grid.
- Allowed: emoji from the bundled set only. Anything else is stripped on input. Forms, system text, notifications and AI output stay emoji-free.
- Licence: CC BY 4.0 requires attribution, so credit Google and the Noto Emoji project on a Credits screen under You. Do not use the popular "Animated Fluent Emojis" repositories; they are personal-use only. Public wrappers exist on GitHub and pub.dev, but Kambi needs only the Lottie JSON files, vendored into packages/ui/assets/emoji and bundled for offline use.

### 4.2 Typing and thinking indicators

- Typing: three dots inside a small bubble, rising and falling on staggered springs, with a gentle opacity breath. When the message arrives the bubble morphs into the real one (shared element) rather than popping.
- Thinking (AI draft being prepared, sync in progress): a soft shimmer or slow pulse on a vector shape, with a short plain sentence of what is happening. No emojis, no spinners.
- Both respect reduced motion by falling back to static dots with a slow fade.

**Navigation.** The bottom bar on mobile is personal: a maximum of three primary tabs, chosen by the answer to "What brings you here?" in onboarding. The first tab is the landing screen.

| Intent | Tabs |
| --- | --- |
| Read research | Home, Library, Community |
| Socialize and follow | Home, Community, Chats |
| Run or join a camp | Camps, Capture, Community |

Everything else (Inbox, You, settings) lives behind the top bar: search, notifications, and the avatar menu. Camps is the camp board and the person's own camps (section 4.5); until the person belongs to an event, Home stands in for Capture. Inbox sits in the top bar with a badge, and when an event closes and outputs arrive the badge and a push notification announce them. Joining or creating an event offers to add Capture; the person can change their tabs any time under You, Navigation. Desktop uses a sidebar that can show all sections. Modal tasks open as bottom sheets.

**Key screens**

- *Capture:* one large new-entry action; sections scroll with a thin progress line; save is instant and silent; a quiet pill shows offline state and queue size; tapping it opens the sync sheet.
- *Event dashboard:* goal ring, entries today, per-collector bars, one chart at a time with a segmented switch; heat map as a full-bleed layer.
- *Inbox:* AI outputs as documents with preview thumbnails, labeled as AI drafts, plus system notices.
- *Form builder:* canvas with field palette as a sheet; drag to reorder; each field shows its identifying or safe tag.
- *Community (Threads-like):* single column feed; replies as indented threads with a thin vertical connector; composer as a bottom sheet; quiet icon actions; optimistic updates so nothing waits on the network.
- *Chat:* grouped bubbles, swipe to reply, typing indicator (see 4.2), read state, offline queue with a clear pending mark; messages send instantly and reconcile later.
- *Reader mode:* a person can join only to read research from Africa. They have a User account with no event membership, so nothing new in the role model. Their tabs follow their onboarding intent (see Navigation); Capture is offered only after they join or create an event. Onboarding offers an optional choice of topics and regions to follow, and the Library and feed work fully without ever touching field tools.
- *Library, forums, profile and Wrapped:* same components, no special cases.

**Quality floor.** 44 point touch targets, visible focus, contrast of at least 4.5 to 1, text that survives Swahili being longer, skeleton loaders instead of spinners, empty states that say what to do next.

### 4.3 Search

- One search box in the top bar, available to everyone, including Reader mode.
- Results are grouped under a segmented control: Top, People, Tags, Articles, Camps, Forums. Hashtags are first-class: tapping one opens its page with posts and articles.
- Scope is the Kambi repository only. There are no web results. Anything not in Kambi yields an honest empty state that offers to follow the topic.
- Only what the viewer may see is indexed for them: no held or blocked posts, no private events, nothing from blocked or muted accounts, and never any content from the locked identity table.
- Keyword and fuzzy match work in Swahili and English; recents and suggested topics appear before typing; results appear as the person types.

### 4.4 Publishing to Zenodo

- Zenodo is a free, open research repository run by CERN that issues a DOI for each record. Authors can push an article or an approved finding there from the composer or from an output in the Inbox.
- Linking: the author connects their Zenodo account once through OAuth 2.0 (scopes deposit:write and deposit:actions). Tokens are stored encrypted and used only by the worker.
- Flow: draft, metadata (title, authors, optional ORCID, licence, keywords, language), preview, an explicit confirmation, then the worker creates the deposition, uploads files, and publishes. The DOI returns to the post and the author can publish new versions later.
- The mark: a published post shows a refined Zenodo chip with the DOI beneath the title, in the monochrome style of the design system, with a single quiet entrance animation. Tapping it opens the record. Check Zenodo's logo and branding terms before shipping the real logo; until then use a neutral "DOI" chip.
- Guardrails, because Zenodo is public and long-lived. Records are meant to be kept for the life of the repository, and removal after the one-month grace period needs a valid justification. Therefore:
  - Only organizer-approved articles and anonymized aggregate outputs can be pushed, never raw entries, never anything linked to the identity table.
  - The same rule checks as moderation run first (identifiers, small-cell counts).
  - AI drafts must be edited and approved by a human, and keep their AI-draft label and data-basis note.
  - The confirmation screen states that the record will be public and permanent.
  - The event's consent text must cover publication of aggregate findings; if it does not, the option stays off.
- Limits: 50 GB and 100 files per record, far above Kambi's needs. Build and test against the sandbox first.
- Every push, version and withdrawal is written to the audit log.

### 4.5 Camp board

Kambi is impact research, not only a place to publish. The camp board is where people find and run real field work.

- **Listing.** Any User can list a camp and becomes its Owner. A listing has a title, domain and branch, dates, area (district or ward, not an exact address until a person is approved), the roles needed with counts (Supervisors, Collectors), requirements, a contact route, and a status of open, full or closed. A listing can be linked to an event, so approved applicants flow straight into it.
- **Discover.** The Camps tab opens on a Discover view and a Mine view. Discover has a list and a MapLibre map, filters for domain, branch, date, distance and role, and shows Verified Partner badges. Camps also appear in search.
- **Join.** One tap on "Request to join" with an optional short note. This creates an event_members row with status "requested" (new, beside invited, approved and revoked), and the organizer approves each request in the existing approval table with an in-app notice back to the applicant.
- **Applicant card.** The organizer sees the applicant's contributor rating, camps completed, entries submitted and a short quality breakdown.
- **Contributor rating.** Computed from camps completed, accepted entries, data quality (missing fields, duplicates, sync discipline) and organizer feedback after each camp. Volume alone never raises it, so rushing is not rewarded, as in Wrapped. New users show "New" rather than a number. Public on the profile by default. A person can switch it off, but organizers of any camp they apply to always see it, and the join screen says so. Organizers see the full breakdown, not only the overall number.
- **Impact card.** When a camp closes, its listing shows an aggregate impact summary (collectors, entries, follow-ups completed), subject to the same small-count rule as moderation. No individual data ever appears.
- **Safety.** At launch listings are not pre-reviewed; they go live at once and moderation is report-driven. Listings are for medical and field work, so HQ Safety can hide a listing and Verified Partner status is shown prominently. Exact location is shown only to approved members.

### 4.6 Boosts and the partner cap

- **Cap.** Partner and paid items together fill at most one in eight slots on any feed or search page (proposed), and never take the top result for an exact name or tag search. Organic results are never pushed out of view by them. Every boosted item is labeled "Promoted" or shows the Verified Partner badge.
- **Boost request.** At event creation the Owner can include a boost, and the event package and the boost are paid together in one batched payment. A boost can also be added later from the listing or announcement: the Owner taps Boost, picks a tier, sets a budget and dates, sees an estimated reach, and pays from the wallet through Payme. The post passes the normal rule checks and moderation before it goes live. Unused budget is refunded, and results (reach, requests to join) are shown afterwards.
- **Tier 1, Feed.** The camp is shown to more people in the feed and in search, matched by interest, branch and region.
- **Tier 2, Feed plus SMS.** As Tier 1, plus SMS invitations to matched people who fit the camp's needs (roles, distance, branch interest, contributor rating). The audience is only users who turned on "Camp alerts" in settings, which is asked with one clear toggle in onboarding. The organizer never sees phone numbers; Kambi sends the messages. Each person receives at most a few per week (proposed), every message carries a custom sender name and STOP instructions, and a STOP reply ends all promotional SMS. The budget is fixed in advance and priced at SMS cost plus a margin (about 20 shillings per message at cost).
- HQ sees boost revenue and spend in the Money view and can pause any boost.

### 4.7 Home

Home is one screen with the same modules for everyone, ordered by intent: readers get the digest first, socializers get the feed first. It aims to be rewarding and useful at once.

- **Impact ticker.** A line at the top that counts up the day's entries collected across Kambi. It is quiet proof that the platform is doing real work.
- **Today in African research.** Three swipeable cards, each a finding explained in about a minute, with the DOI chip when it came from Zenodo. This reuses the nightly synopsis.
- **Mixed feed.** Interleaved by rule (proposed starting mix): about 40 percent research, 30 percent people and threads, 15 percent camps, 10 percent prompts (follow a topic, a short poll), and promoted items within the cap. One discovery card now and then shows a surprising finding from another domain.
- **Every card does something.** One-tap Save to library, Take to a forum, and a "why you see this" line. Value comes from what people can do, not from scrolling.
- **Caught-up state.** The digest ends with a satisfying "you're caught up" screen and an invitation to a camp or forum, rather than endless scroll. No autoplay. The streak ember (section 4.8) sits in the header.
- Motion follows the design system: counters count up, cards spring in, and reduced motion is respected.

### 4.8 Streaks and Personalise

- **Streak.** A day counts when the app is launched on a device connected to the person's account, using the device's local day. It is shown as the ember ring with a day count: lit once today's launch is counted, unlit before. It is public on the profile by default and can be hidden in Settings.
- Milestones at 7, 30, 100 and 365 days pulse the ring once. The streak is separate from the contributor rating and never feeds it.
- Proposed: one rest day per week keeps the streak alive, so a single missed day does not reset a long run. Confirm or remove.
- **Personalise.** In Settings, a person can rerun the onboarding questions (intent, interests, alerts) and Home and the tabs rearrange to match. Tabs can also be chosen directly under Navigation, up to three.
- Language: feature names stay in English in every language.

### 4.9 Camp share kit

- At event creation the Owner can upload assets: logo, cover image, partner logos. Images are converted on the device (up to 1 MB each).
- The camp dashboard then shows the assets and a unique join link with a QR code for posting on social media or printing.
- A cheap, on-device poster generator offers three to four templates (centered, split, minimal, photo), variable by color, title, date, area and the uploaded images. It exports a square image, a story-sized image, and an A4 PDF, works offline, and needs no server.

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

1. HQ staff list and which scoped permission each person holds.
2. Retention periods for telemetry and for event data after the access window.
3. Zenodo account model: each author links their own account, or Kambi deposits on their behalf from an organizational account with the author named. Recommendation: own account first, as it keeps authorship and takedown with the author.
4. Zenodo logo use: confirm Zenodo's branding terms before using the logo on posts.
5. Boost tier prices.
6. Promotional SMS: opt-in wording, sender name registration, and the legal basis under Tanzanian rules, to confirm with Textify.
