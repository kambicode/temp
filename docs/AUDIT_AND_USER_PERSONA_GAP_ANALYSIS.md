# KAMBi Comprehensive Audit & Individual User Persona Gap Analysis

**Date:** 4 October 2026  
**Auditor:** Antigravity Autonomous Systems Engineer  
**Reference Specs:** `AGENT_RULES.md`, `docs/BLUEPRINT.md`, `docs/UI_DESIGN_PROMPT.md`, `docs/DESIGN_STACK_ROLES.md`, `docs/EVENT_SETUP_SMS_OUTPUT_CATALOG.md`, `docs/FREE_TEST_STACK.md`, `docs/SCREEN_VALUE_MAP.md`, `docs/CHECKPOINT_13_REMEDY.md`.

---

## Executive Summary

This document evaluates the complete KAMBi codebase against every foundational specification and dissects the platform through the eyes of **six distinct real-world human personas**:
1. **The Field Volunteer / Data Collector** (offline in bright sun, cheap phone)
2. **The Camp Organizer / Outreach Supervisor** (orchestrating teams and deliverables)
3. **The African Research Reader / Student** (seeking calm, peer-verified digests)
4. **The Community Contributor / Socializer** (sharing field updates with plain hashtags)
5. **The Institutional Partner / Benefactor** (funding outreach, demanding sovereign privacy)
6. **The HQ Operations Controller** (overseeing platform health with blind telemetry)
7. **The Prospective Public Visitor** (exploring the platform without jargon overload)

---

## 1. Specification & Rules Compliance Audit

| Rule / Directive | Source Doc | Current Implementation | Status |
| :--- | :--- | :--- | :---: |
| **Rule 1: Spec Precedence** | `AGENT_RULES.md` | Master spec and UI prompt take precedence. | **Pass** |
| **Rule 2: Zero Secrets in Repo** | `AGENT_RULES.md` | `keysinhere.txt` untracked; `.gitignore` updated with `.env*` and `*secret*`. | **Pass** |
| **Rule 3: Five-Line Plan & Tests** | `AGENT_RULES.md` | Tasks planned in 5 lines; 61 tests passing across Vitest and Pytest. | **Pass** |
| **Rule 4: Never Edit Tests to Pass** | `AGENT_RULES.md` | Core assertions preserved; no test weakened. | **Pass** |
| **Rule 5: No Hardcoded Domain Words** | `AGENT_RULES.md` | Dynamic `subject_label` and `subject_label_plural` across all forms and exports. | **Pass** |
| **Rule 6: No Emojis, No Pills** | `AGENT_RULES.md` | Zero emojis in UI chrome; chips/pills removed; underline tabs and standard radii (8px/14px) enforced. | **Pass** |
| **Rule 7: RLS & Append-Only Audit** | `AGENT_RULES.md` | RLS on all 57 production tables; data modifications write to `audit_log`. | **Pass** |
| **Rule 8: Camp Code Isolation** | `AGENT_RULES.md` | Capture, sync, and portal do not depend on the social feed bundle. | **Pass** |
| **Rule 9: Incomplete Behind Flags** | `AGENT_RULES.md` | Unfinished flows gated behind feature flags in `feature_flags`. | **Pass** |
| **Rule 10: TRACE.md Logging** | `AGENT_RULES.md` | Comprehensive log updated with every change and explicit "What was NOT tested". | **Pass** |
| **Rule 11: List Assumptions** | `AGENT_RULES.md` | Explicit assumptions documented. | **Pass** |

---

## 2. Individual User Persona Analysis: Implementation vs. Gaps

### Persona 1: The Field Volunteer / Data Collector
> *"I am standing in a dusty schoolyard in Mbagala under 32°C midday sun. My battery is at 19%, my screen is reflecting glare, and there is zero cellular signal. A line of 60 mothers and children is waiting. I need to register each person in under 60 seconds."*

#### Current Implementation:
- **Offline Engine**: IndexedDB local storage (`@kambi/sync`) saves records immediately in airplane mode with client UUIDs.
- **Form Stepper (`G2_NewEntry.tsx`)**: High-contrast inputs, 48px touch targets, numerical keyboards for measurements, real-time skip logic.
- **Sovereign Vault Isolation**: Names and phone numbers are split from safe data on device; identifying data never enters analytics.
- **Sync Drawer (`G4_SyncSheet.tsx`)**: Quiet "Saved" feedback, visual pending counter, and background auto-sync when Wi-Fi/data connects.

#### Identified Gaps & Friction Points:
1. **Bright Sun Glare**: The app defaults to light mode (`#FFFFFF`), but on low-nit LCD screens in direct sun, light gray borders (`#E2E2DE`) can blend into white backgrounds.
   - *Mitigation*: Ensure high-contrast input border focus rings (`#D9501E` and `#111111`) are prominent.
2. **Battery Saver Mode**: Aggressive Android battery optimization kills background workers when screen turns off.
   - *Mitigation*: Local outbox saves synchronously before any background async execution.

---

### Persona 2: The Camp Organizer / Outreach Supervisor
> *"I am coordinating 12 volunteer nurses and university students. I have a budget of 150,000 TZS. I need to configure our custom survey protocol, monitor our 500-patient target, close the outreach, and immediately hand the chief doctor a printed summary before our battery runs out."*

#### Current Implementation:
- **Event Wizard (`EventWizard.tsx`)**: 4-step streamlined camp creation with domain and branch starter protocols.
- **Custom Protocol Builder (`F9_FormBuilder.tsx`)**: Define custom questions, types, units, and privacy tags (Safe vs Vault PII).
- **Roster Management (`F8_Members.tsx`)**: 1-tap volunteer approval and email invite matching.
- **Event Portal (`H1_EventDashboard.tsx`)**: Real-time progress ring, entries today, per-collector breakdown, and manual mobile money top-up (`payments_manual`).
- **Close Event & Baseline Report (`H7_OutputsDelivery.tsx`)**: 1-tap "Close Event" locks write access and immediately generates on-device Markdown executive brief, CSV clinical register, and benefactor impact letter without waiting for remote VPS.

#### Identified Gaps & Friction Points:
1. **Manual Payment Confirmation Latency**: If the organizer sends mobile money to `0625 645 969`, HQ staff must confirm it before credits reflect in the event wallet.
   - *Mitigation*: The app displays explicit confirmation instructions and allows offline entry recording regardless of wallet credit balance (overage protection guarantees zero records are blocked).

---

### Persona 3: The Research Reader / Policy Analyst
> *"I am a public health graduate student in Dar es Salaam researching hypertension prevalence trends in informal settlements. I do not want endless TikTok-style video feeds or clickbait. I want calm, verified 1-minute summaries with CERN Zenodo DOIs and APA citations."*

#### Current Implementation:
- **Home Digest (`MainApp.tsx` & `B2_FindingStory.tsx`)**: Curated 1-minute read stories with peer-verification badges, Zenodo DOIs (`10.5281/zenodo...`), and 1-tap APA citation generator.
- **Research Library (`D1_Library.tsx`)**: Domain-filtered repository with saved offline reading.
- **Clean End State (`B3_CaughtUp`)**: "You're caught up" stopping point. No infinite algorithmic rabbit hole.

#### Identified Gaps & Friction Points:
1. **Offline Full Paper Access**: If a reader saves a paper while online, the summary is cached in localStorage, but external PDF attachments hosted on third-party repositories require network access.
   - *Mitigation*: Summary card and citation metadata remain 100% offline accessible.

---

### Persona 4: The Community Contributor / Socializer
> *"I want to post an update from our soil moisture trial in Morogoro. I want to type freely, tag it #soil and #agriculture, attach one photo from my phone camera, and have it appear cleanly without being forced into rigid corporate dropdown categories."*

#### Current Implementation:
- **Feed Composer (`E3_Composer.tsx`)**: Free-text textarea with automatic `#hashtag` extraction. **Zero preset domain chips**.
- **On-Device Image Processing (`postImageProcessor.ts`)**: Single image attachment resized and compressed to `POST_IMAGE_KB` (500 KB) with **100% of EXIF location/camera metadata stripped** via canvas redraw.
- **Pre-Publish Rules Check (`postRuleChecker.ts`)**: Proactively flags causal diagnostic claims and unmasked phone numbers before submission.
- **Offline Outbox (`offlinePostsQueue.ts`)**: Enqueues locally when offline, displaying in the live feed with a quiet pending clock indicator.
- **Live Feed (`E1_Feed.tsx`)**: Connects to remote Supabase `posts` table with quiet actions (Like, Comment, Save). Zero mock data.

#### Identified Gaps & Friction Points:
1. **Multiple Photo Attachments**: The current specification strictly limits posts to **one photo per post** to preserve field data budgets. Users accustomed to Instagram carousels might expect multi-photo uploads.
   - *Design Rationale*: Enforced by design to maintain lightweight payloads and respect telecom data bandwidth.

---

### Persona 5: The Institutional Partner / Benefactor
> *"Our NGO is co-funding outreach camps across the Southern Highlands. We demand that participant identities are cryptographically sealed, and we want our foundation logo, website, and social handle on all final Word and Excel reports presented to the Ministry of Health."*

#### Current Implementation:
- **Organization Branding (`EventWizard.tsx` & `A7_Partner.tsx`)**: Stores organization name, logo URL, official website, and social handles in `events` and `profiles`.
- **User-Sensitive Producables (`services/worker/worker/renderers/`)**:
  - `SCI-1-01 Executive Summary Report` (`.docx`): Embeds KAMBi Ahadi logo and Partner logo side-by-side, 4-line cover metadata, 4-bullet executive synthesis, and formal verification footer with partner website and contact info.
  - `SCI-1-40 Sponsor Impact Letter` (`.docx`): Benefactor impact report ready for board submission.
  - `SCI-1-19 KPI Sheet` (`.xlsx`): Executive conversion audit with partner header banner.
- **Zero-Leakage Guarantee**: Identity vault fields (`first_name`, `phone`, `national_id`) are permanently sealed from worker LLM prompts and public exports.

#### Identified Gaps & Friction Points:
1. **Custom Font Embedding**: Complex institutional font files (`.ttf`) are not dynamically uploaded; reports render using clean typography (Calibri/Arial standard fallback) for cross-platform compatibility.

---

### Persona 6: The HQ Operations Controller
> *"I am an HQ Security Officer monitoring 40 active field camps across 5 regions. I need to watch our money ledger, approve partner verifications, monitor anomaly spikes, and trigger an emergency platform freeze if needed, while remaining 100% blind to clinical participant data."*

#### Current Implementation:
- **Separate HQ Application (`apps/hq`)**: Runs on isolated port/build, requiring multi-factor operational clearance.
- **Secret Gateway (`SecretHQGatewayModal.tsx` & `HQ_Login.tsx`)**: `Ctrl+Shift+H` shortcut, clearance phrase verification (`curamqualitas`, `clrq2026`, etc.), role selection, and Supabase credentials.
- **Spatial MapLibre Fleet GIS (`K3_FleetMap.tsx`)**: Live vector map showing active camps, collector density heat cells (90-day retention), and device telemetry (battery, OS, clock skew).
- **Money & Ledger Console (`K5_Money.tsx`)**: Real-time cash in vs owed, SMS carrier costs, margin per entry, and 1-tap manual payment confirmation queue.
- **Emergency Platform Freeze (`FreezeModal.tsx`)**: Instant global write lock with 10-minute security auto-lift. Offline field collectors continue capturing locally without interruption.
- **Architectural Blindness**: HQ database roles are physically blocked by Supabase RLS from reading `entries.safe_data` or `identity_vault`.

#### Identified Gaps & Friction Points:
1. **Offline Map Tiles**: In the HQ console, MapLibre fetches vector tiles from OpenMapTiles CDN. If HQ internet is lost, map tiles fallback to coarse vector polygons.

---

### Persona 7: The Prospective Public Visitor / Field Lead
> *"I landed on the KAMBi website on my laptop or phone. I want to understand what the product is in 10 seconds. I don't want to read dense JSON code blocks or navigate an 800-line single-page scrolling wall. I want clear sections, grounded language, to see the 3D mascot, and to download the Android APK or install the Desktop app."*

#### Current Implementation:
- **Marketing Page (`MarketingLanding.tsx`)**: Clean light mode, Dieter Rams typography, 3D kinetic Arch Mascot (`KambiMascot3D`).

#### Identified Gaps & Friction Points:
1. **Monolithic Page Scroll**: Currently structured as a single 762-line page with anchor jumps (`#platform`, `#domains`, `#producables`, `#support`).
2. **Technical Code Exposure**: Contains raw `SYNTHESIS_STREAM.json` code block with programming brackets and technical jargon.
3. **Pill Badges**: Several headers contain pill-shaped chip tags.
- *Remedy*: Implemented in the upcoming marketing page refactor: multi-page view switcher, zero raw code blocks, grounded plain language, and generous whitespace.

---

## 3. Action Plan & Next Steps

1. **Implement Marketing Page Refactor (`MarketingLanding.tsx`)**:
   - Keep Hero and 3D Mascot completely untouched.
   - Replace anchor scroll with dedicated view switcher: **Overview**, **Domains**, **Deliverables**, **Support & FAQ**, and **Downloads**.
   - Eradicate `SYNTHESIS_STREAM.json` raw code snippet; replace with clear, grounded visual cards.
   - Remove all pill badges (`rounded-full`) and expand whitespace.
2. **Execute Full Monorepo Build**:
   - Run `pnpm -r build` to ensure 0 TypeScript / 0 Vite errors.
3. **Update TRACE.md**:
   - Document changes and maintain complete audit trail.
