# Kambi Build Plan

Synthesised from the Blueprint, Design/Stack/Roles v2, Event Setup and Output Catalog, UI Design Prompt, Roadmap and Screen Value Map. Precedence, per the UI prompt: newest document wins, and the UI prompt wins on anything visual.

## 0. Constraints that shape everything

- Deadline: first camp Mon **2 Nov 2026**, about 4 weeks away. Only the camp-critical path is a hard gate. Everything else ships behind flags.
- Offline-first. Local write first, outbox with idempotent client UUID upserts.
- Identity never reaches AI. Locked identity table, default-unsafe field tags, photos never in the AI path.
- Two account types (User, HQ). Capability comes from per-event membership: Owner, Supervisor, Collector, Viewer.
- Monochrome UI with an ember accent under 5% of the screen. No emojis in the UI, no spinners, no sharp corners. The ring is the signature motif.
- Targets: mid-range Android at 60fps, Capture path under 200 KB gzipped JS, en and sw, light and dark.

## 1. Repo layout (pnpm monorepo)

```
apps/web  apps/android  apps/desktop  apps/hq
packages/ui  packages/forms-engine  packages/sync
services/worker (Python 3.12)
supabase/ (migrations, RLS, edge functions)
docs/ (blueprint + companion docs)
```

## 2. Phases

### Phase 0: Setup (day 1-2)
- Move all docs into `docs/` and add an ADR log for the decisions in section 5.
- pnpm workspace scaffold, TS strict, ESLint, CI (GitHub Actions), Supabase project, `.env` handling.
- Tokens in `packages/ui` (colour table, 4pt grid, radii 8/14/24, springs 300/30, type scale).
- A contrast test that checks every token pair.
- Logo and icons: **waiting on your assets**. Use a placeholder until they arrive. The ring and arch components are built in SVG.

### Phase 1: Foundation (week 1, 5-11 Oct)
- Supabase Auth with magic link and six-digit code. Token and QR join links.
- Schema: `profiles`, `events`, `event_members` (invited, requested, approved, revoked), `tokens`, `consents` (versioned), `audit_log` (append-only), `identity_vault` (locked).
- RLS scoped by event membership, tested with pgTAP: a collector sees only their own event.
- UI: A1-A3 (Welcome, Sign in, Consent), event wizard skeleton (basics, domain, branch, team), member approval table.
- **Exit:** sign in, create an event, invite a collector, and the collector sees only that event.

### Phase 2: Capture (week 2, 12-18 Oct), the riskiest phase
- `forms-engine`: versioned JSON schema, validation, skip logic, field tags (identifying or safe), duplicate-key setting.
- Form builder (dnd-kit), Health starter template, preview as collector.
- `sync`: Dexie outbox on web, SQLCipher on Android, retry with backoff, sync sheet, offline pill, pull-to-sync.
- Photo conversion on the device (max 1 MB each, 5 MB per entry). Duplicate flag and merge (H6).
- SMS opt-out notice on the registration screen.
- G1-G6 screens, built and tested on a real mid-range phone.
- **Exit:** 20 entries in airplane mode, synced after reconnect, zero loss and zero duplicates.

### Phase 3: Portal, money, share kit (week 3, 19-25 Oct)
- Event dashboard (H1), per-collector bars, goal ring, CSV and Excel export (H5).
- Ledger: Payme webhook edge function, wallet, debit per unique entry, one batched payment at event creation.
- Three SMS slots (G7): templates in en and sw, segment counter, blocked-content rules, Textify with STOP and sender name.
- Share kit (F7): join link, QR with ring mark at level H, on-device poster templates, export to square, story and A4 PDF.
- Capacitor Android build, telemetry opt-in and sampling (heat map H2 and tracks H3 can slip behind a flag).
- **Exit:** organizer creates an event, pays, shares the QR, a volunteer scans and collects, and the organizer sees live counts and exports.

### Phase 4: Close path and hardening (week 4, 26 Oct-1 Nov)
- Worker: Postgres queue (SKIP LOCKED), snapshot reads, field safety classifier, anonymiser, OpenRouter batches, Pydantic validation, renderers (WeasyPrint, python-docx, openpyxl, matplotlib), AI-draft labels and data-basis note, emoji filter.
- Outputs: **up to 5** chosen at setup, from the branch's default 10 or the catalog. The cap is enforced in the UI and on the server. Only the **Health branch (SCI-1)** for the camp.
- Inbox (I1, I2), H7 output status.
- Backups, phone alerts, missed-batch catch-up, per-entry cost log, minimal HQ view, feature flags set.
- Field test with a deliberately messy sync, a 10-person dry run, a dry-run close, an unaided first-use test (under 1 minute).
- **Exit:** the dry-run close delivers the selected outputs. Then freeze, with no deploys on camp day.

### Phase 5: Social launch (Nov-Dec, behind flags)
Order from the roadmap: community core, moderation pipeline, Home and search, library and articles, Zenodo (sandbox first), streaks, chats and forums, Kambi emoji (Noto Lottie, attribution on Credits).

### Phase 6: Growth (2027)
Camp board, contributor rating, partners and boosts, recommender, full HQ, Wrapped, desktop (Tauri), then the marketplace and later bets.

## 3. Feature flags at 2 Nov
All **off**: community, search, zenodo, streaks, camp_board, boosts, promo_sms, contributor_rating, wrapped, hq_full.

## 4. Definition of done (every screen)
Works offline, en and sw, light and dark, has loading/empty/error/reduced-motion states, 44px targets, 4.5:1 contrast, one primary action, tokens only, audit-log write where data changes.

## 5. Conflicts and decisions to flag

| # | Issue | Proposed resolution |
| --- | --- | --- |
| 1 | Blueprint names 4 roles (Admin, Supervisor, Collector, Viewer), but v2 uses Owner and per-event roles. | Follow v2. |
| 2 | Blueprint says "about ten outputs", Catalog says "up to five". | Follow the Catalog. |
| 3 | Older doc listed 5 tabs, UI prompt and v2 say at most 3, set by intent. | Follow v2 and the UI prompt. |
| 4 | UI prompt F5 wizard has 11 steps, which is heavy for camp week. | Build 6 steps for the camp: basics, domain/branch, form, outputs, SMS, team/assets and pay. Defer boost and partner. |
| 5 | The 600-item output catalog is large. | Store as seed JSON. Only SCI-1 templates are written for the camp. |
| 6 | Catalog typo: ECO-5-18 and ECO-5-19 (a proposal and a grant template) are tagged `X P`. | Likely `W P`. Please confirm. |
| 7 | Android uses SQLCipher, web uses Dexie. | Hide both behind one `sync` interface. Web first. |
| 8 | Background geolocation is impossible in browsers. | Android and desktop only, with opt-in. |
| 9 | Open: Payme refund and fee behaviour, Textify sender name, Swahili copy review, retention periods. | Needed by week 3. |

## 6. Housekeeping findings
- `notebook_export.py` contains a **live Kaggle API token in plaintext**. It is unrelated to Kambi. Rotate it and do not commit it.
- `extracted_reader_app.py` (PyMuPDF and Gradio PDF highlighter) and `notebook_export.py` (Ames housing model) are not Kambi specs, so they feed nothing in this plan. The `(1)` copy of Design Stack v2 is identical to v2.
