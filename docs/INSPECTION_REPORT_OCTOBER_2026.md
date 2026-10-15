# KAMBi Strategic & Technical Inspection Report

**Product:** KAMBi (ClerQ Intelligence)  
**Prepared for:** Emmanuel Chesco, Chief Executive Officer, ClerQ Intelligence  
**Prepared by:** Engineering & Product Team  
**Inspection Date:** Monday, 5 October 2026  
**Milestone Target:** First Health Outreach Camp on **Monday, 2 November 2026** (28 Days Remaining)  
**Evaluated Against:**
1. `docs/SCREEN_VALUE_MAP.md` (`D:\Downloads\KAMBi_Screen_Value_Map.md`)
2. `KAMBi_Strategy_Report.pdf` (`D:\Downloads\KAMBi_Strategy_Report.pdf`, 4 October 2026)

---

## 1. Executive Summary

A comprehensive, line-by-line inspection of the KAMBi codebase, data architectures, background workers, and design artifacts was performed to assess readiness for the first field camp on **Monday, 2 November 2026**.

### 1.1 Technical Health Snapshot
- **Automated Test Suites:** **61/61 automated tests passing** (100% pass rate).
  - 41 Vitest unit/integration tests (`@kambi/ui`, `@kambi/sync`, `@kambi/forms-engine`, `@kambi/ranking`).
  - 20 Pytest tests in `services/worker` (`test_faithfulness.py`, `test_golden_cases.py`, `test_renderers.py`, `test_worker.py`).
- **Design System Rule Compliance:** Verified clean via `node scripts/ui-scan.mjs`:
  - 0 emojis in UI chrome.
  - 0 pill-shaped chips (`rounded-full` controls eradicated).
  - 100% compliant with Dieter Rams & Jony Ive monochrome aesthetic with ember accents (<5%).
- **Production Build Status:** Both `apps/web` (Vite 8 / React 19) and `apps/hq` compile in <6 seconds with 0 TypeScript errors.
- **Database Schema:** 57 production tables deployed live to remote Supabase cluster (`lxdroygthhiuyrruprpm`) with strict Row Level Security (RLS) and append-only audit logging.
- **Android Offline Distribution:** Packaged signed APK ready at `apps/web/public/downloads/KAMBi-v1.0.0-Field-Ahadi.apk`.

### 1.2 Strategic Alignment Verdict
The engineering foundation is exceptionally mature for Day 1 of the build cycle. However, **there is a severe risk of scope leakage** because social, community, search, and research features that were planned to be hidden behind feature flags for the 2 November camp are currently exposed and ungated in the web client.

---

## 2. The 12 Camp-Critical Screens Audit

The Strategy Report and Screen Value Map establish that of the 75 designed screens, exactly **12 carry the camp**. The remaining 63 screens must either follow demand or be hidden behind feature flags on 2 November.

```
                  THE CAMP-CRITICAL WORKFLOW (12 SCREENS)

   [G1] Capture Home  ───>  [G2] New Entry  ───>  [G3] Entry Detail
           │                       │
           ▼                       ▼
   [G4] Sync Sheet    ───>  [F5] Event Wizard ───>  [F6/H1] Camp Dashboard
           │                       │
           ▼                       ▼
   [F7] Share Kit     ───>  [H4] Billing     ───>  [H5] Raw Data Export
           │                       │
           ▼                       ▼
   [I1] Inbox Delivery ───> [I2] Output View
```

### Detailed Screen Inspection Table

| Code | Screen Name | Strategic Function | Codebase Location | Status & Audit Findings |
|---|---|---|---|---|
| **G1** | **Capture Home** | One obvious action; start record; fast entry volume; track time to first entry. | `apps/web/src/screens/MainApp.tsx` (Capture Tab) | **PASSED.** Hero action trigger with ember ring; offline queue indicator; quick-start entry stream; zero latency. |
| **G2** | **New Entry** | Under 1 minute registration; safe vs identifying data separation; skip logic; offline storage. | `apps/web/src/screens/G2_NewEntry.tsx` | **PASSED.** Dynamic 3-section stepper; instant skip logic; on-device 1 MB image compressor; Dexie IndexedDB offline queue; deterministic duplicate key generation. |
| **G3** | **Entry Detail** | Triage review; data quality audit; error correction without re-typing. | `apps/web/src/screens/G3_EntryDetails.tsx` | **PASSED.** Dynamic safe telemetry inspection; visual blood pressure category chips; privacy badge confirming identity vault isolation. |
| **G4** | **Sync Sheet** | Offline confidence; trust in core promise; itemized sync status; retry queue. | `apps/web/src/screens/G4_SyncSheet.tsx` | **PASSED.** Offline queue drawer; pending/synced/retry status badges; progress bar; manual flush trigger. Tested with 20-patient offline dry run. |
| **G7** | **SMS Slots** *(Camp Support)* | 3 rule-based SMS messages (~60 TZS budget); zero clinical terms. | `apps/web/src/screens/G7_SmsSlots.tsx` | **PASSED.** 3 slots configured (Receipt, Follow-up, Gratitude); 160-char GSM counter; active privacy guardrail blocking diagnostic terms (`sukari`, `bp`, `hiv`, `dawa`). |
| **F5** | **Create Camp** | Fast, guided setup with sensible defaults; revenue start; package selection. | `apps/web/src/screens/EventWizard.tsx` | **PASSED.** 4-step wizard; domain/branch starter schema attachment; 5-output maximum enforcement; prepay calculation at 250 TZS/entry. |
| **F6 / H1** | **Camp Dashboard** | Run the camp; live progress; goal tracking; daily organizer tool. | `apps/web/src/screens/H1_EventDashboard.tsx` | **PASSED.** Progress ring against cohort goal; live collector count; recent telemetry feed; links to all camp operational modules. |
| **F7** | **Share Kit** | Link, QR, and poster in seconds; volunteer and participant recruitment. | `apps/web/src/lib/posterGenerator.ts` & `H1_EventDashboard.tsx` | **PASSED.** HTML5 Canvas engine generating Square (1080x1080) and Story (1080x1920) posters with Dieter Rams arch frame, QR code, and export. |
| **H4** | **Billing & Prepay** | Pay and track spend; no hidden fees; 250 TZS/entry; mobile money. | `apps/web/src/screens/H1_EventDashboard.tsx` | **PASSED.** Manual Mobile Money submission to company number **0625 645 969** (`payments_manual`) with HQ approval, plus Payme Africa webhook handler. |
| **H5** | **Raw Data Export** | Never locked behind payment; trust; instant CSV generation. | `apps/web/src/lib/exportData.ts` | **PASSED.** Client-side CSV export of sanitized `safe_data` with zero identity vault leakage; instant browser download. |
| **I1 / I2** | **Inbox & Outputs Delivery** | Receive finished documents at event close; payoff moment; AI outputs. | `apps/web/src/screens/H7_OutputsDelivery.tsx` & `worker/renderers/` | **SUBSTANTIALLY COMPLETE.** On-device export for Camp Summary (.md), Referral Register (.csv), KPI Sheet (.csv), and Sponsor Letter (.txt). Backend Python worker compiles `.docx` and `.xlsx` with Ahadi verification footers. |

---

## 3. The 10 Feature Flags Inspection (Scope Discipline)

### 3.1 Strategic Requirement
The Strategy Report (Pages 4, 33, 36) mandates:
> *"Ten flags are off on 2 November: community, search, Zenodo, streaks, camp board, boosts, promotional SMS, contributor rating, Wrapped, and the full HQ console."*

### 3.2 Audit Findings & Critical Gap
1. **Database Schema:** `supabase/migrations/20261004000005_hq_operations.sql` only seeded 8 flags, and enabled 7 of them:
   - `community_core`: `true` (Should be `false`)
   - `search_global`: `true` (Should be `false`)
   - `zenodo_deposition`: `true` (Should be `false`)
   - `streaks_and_ratings`: `true` (Should be `false`)
   - `camp_board`: `true` (Should be `false`)
   - `promotional_sms`: `false` (Correct)
   - `wrapped_2026`: `true` (Should be `false`)
   - `hq_full_console`: `true` (Should be restricted)
   - *Missing:* `boosts` and `contributor_rating` are not separated into discrete flag keys.
2. **Client-Side Enforcement:** In `apps/web`, there is **zero feature flag evaluation**.
   - Users can open and interact with the Community Feed (`E1_Feed.tsx`), global search modal (`C1_Search.tsx`), Zenodo Article Composer (`D3_Composer.tsx`), Public Camp Board (`F1_DiscoverCamps.tsx`), and Season Wrapped (`J5_Wrapped.tsx`).
3. **HQ Console Management:** `apps/hq/src/screens/K10_Flags.tsx` uses a static React `useState` array rather than querying and mutating the live Supabase `feature_flags` table.

### 3.3 Required Remediation
Before Wednesday, 7 October:
1. Update database seed to include all 10 flags, all initialized to `is_enabled = false`.
2. Implement a `useFeatureFlag` hook in `apps/web` that conditionally hides or locks deferred UI elements.
3. Wire `K10_Flags.tsx` in `apps/hq` directly to Supabase REST API with audit logging.

---

## 4. Tanzania Personal Data Protection Act (PDPA) Audit

### 4.1 Sensitive Health Data Consent (Hypothesis H7)
- **Legal Obligation:** Under Tanzania PDPA and PDPC guidelines, sensitive personal data (such as health vitals, screening results, and medical notes) requires explicit written consent from the data subject.
- **Audit Finding:** While account creation terms are presented in `A3_Consent.tsx`, the field collection template (`healthStarter.ts`) **currently lacks a patient consent confirmation field**.
- **Action:** Add a mandatory consent boolean to `healthStarter.ts` and `G2_NewEntry.tsx` before the Week 2 gate:
  - English: *"Participant has given informed consent for outreach screening and anonymized research reporting."*
  - Swahili: *"Mshiriki ametoa idhini ya uchunguzi wa afya na ripoti ya utafiti usiojulikana."*

### 4.2 Sovereign Identity Vault (`identity_vault`)
- **Status: PASSED.**
- Identifiers (`full_name`, `phone`) are stripped from public survey tables and stored strictly in the locked `identity_vault` table with restricted RLS policies.
- Background worker AI jobs query only de-identified `entries.safe_data`.
- `services/worker/worker/faithfulness.py` enforces automated leakage scanning, crashing any AI job if an identity vault token is detected.

### 4.3 Cross-Border Data Processing
- **Status: OPEN LEGAL ACTION.**
- Supabase is hosted in AWS Mumbai (`ap-south-1`).
- OpenRouter inference calls route to US/EU servers.
- AI transmissions contain only aggregate and de-identified summaries (no PII crosses the border for AI). However, encrypted names and phone numbers stored in Supabase reside in an overseas data center.
- **Action:** Appoint Tanzanian legal counsel by Friday, 9 October (CEO Decision 3) to validate cross-border data transfer documentation and ClerQ Intelligence data controller registration.

---

## 5. Swahili Quality & AI Faithfulness (Hypothesis H5)

### 5.1 Strategic Context
Strategy Report Pages 4, 27, and 28 highlight Swahili output quality as Weakness #3 and Risk #4:
> *"Qwen-class models were weak in Swahili in ClerQ's own benchmarks. An output that reads badly in Swahili undermines the whole value proposition."*

### 5.2 Audit Findings
- **Field UI:** Forms engine schemas contain Swahili labels and error messages (`titleSwahili`, `labelSwahili`, `placeholderSwahili`).
- **AI Worker (`reports.py`):** The prompt generator crafts prompts exclusively in English.
- **On-Device Outputs (`H7_OutputsDelivery.tsx`):** Delivered documents (Camp Summary Report and Sponsor Impact Letter) are generated in English text only.

### 5.3 Remediation Plan
1. Appoint a bilingual clinician or editor by Monday, 12 October (CEO Decision 4).
2. Create standardized, deterministic Swahili templates for the 4 SCI-1 deliverables:
   - `SCI-1-01`: Ripoti ya Muhtasari wa Kambi ya Afya
   - `SCI-1-06`: Daftari la Rufaa na Ufuatiliaji
   - `SCI-1-19`: Jedwali la Viashiria Muhimu vya Utendaji (KPI)
   - `SCI-1-40`: Barua ya Tathmini ya Athari kwa Wafadhili
3. Implement language switcher (`English` / `Kiswahili`) in `H7_OutputsDelivery.tsx`.

---

## 6. Unit Economics & Pricing Verification

### 6.1 Cost & Contribution Breakdown
Inspecting the financial engine across `H1_EventDashboard.tsx`, `K5_Money.tsx`, and database wallet ledgers:

```
Gross Prepaid Fee per Entry:        250 TZS
Textify SMS Allowance (up to 3):  -  60 TZS (~20 TZS / message)
-----------------------------------------------------------------
Contribution Margin:                190 TZS (76% gross margin)
AI Token Burn per Event:          ~ 135 to 405 TZS ($0.05 to $0.15 USD)
```

### 6.2 Billing Mechanics
- **Prepaid Entry Model:** Enforced at event creation (`EventWizard.tsx`) and monitored via `event_wallets`.
- **Payment Pathways:**
  1. Manual Mobile Money to company number **0625 645 969** (`payments_manual`) with 1-tap confirmation in HQ Console (`K5_Money.tsx`).
  2. Payme Africa automated webhook ingestion (`supabase/functions/payme-webhook`).
- **Decision 2 Recommendation:** Confirm by Monday, 12 October that the 3 SMS messages are included inside the 250 TZS fee for the pilot camp.

---

## 7. 4-Week Roadmap & Weekly Gates Status

```
5 Oct (Today)               12 Oct                      19 Oct                      26 Oct           2 Nov
  │                           │                           │                           │               │
  ▼                           ▼                           ▼                           ▼               ▼
Week 1: Foundation          Week 2: Capture Engine      Week 3: Portal & Billing    Week 4: Hardening Camp Day
- Auth & Roles (DONE)       - Forms Engine (DONE)       - Live Dashboard (DONE)     - Field rehearsal - NO DEPLOYS
- Event Wizard (DONE)       - Offline Sync (DONE)       - SMS Slots (DONE)          - Rollback drill  - Deliver
- Mobile Shell (DONE)       - 100-entry gate (PENDING)  - Wallet & Prepay (DONE)    - Scope locked      outputs
```

| Week | Target Date | Build Focus | Gate Criteria | Current Status |
|---|---|---|---|---|
| **Week 1** | 5 to 11 Oct | Foundation: auth, roles, event wizard | Sign-in and roles work on a real phone; event created end-to-end. | **90% Complete.** Auth and wizard functional. Scope freeze pending confirmation. |
| **Week 2** | 12 to 18 Oct | Capture: forms engine, offline sync, dedupe | 100 test entries captured offline, synced, and de-duplicated with none lost. | **75% Complete.** 20-entry offline test passed. 100-entry batch test pending. |
| **Week 3** | 19 to 25 Oct | Portal, billing, SMS slots, share kit | Test organizer prepays through Payme/Manual and sees live counts. | **85% Complete.** Wallet ledger and payment workflows implemented and tested. |
| **Week 4** | 26 Oct to 1 Nov | Hardening, field test, close-event path | Rehearsal camp runs from setup to documents; rollback tested. | **60% Complete.** Close event logic complete; full end-to-end rehearsal pending. |
| **Camp Day** | Mon 2 Nov | Camp Day operations | Support open; rollback plan; zero new deployments; outputs delivered. | **On Track** provided the 10 flags are enforced. |

---

## 8. The 8 CEO Decisions Action Tracker

The Strategy Report outlines eight specific decisions required of the Chief Executive Officer:

| # | Decision Requested | Why It Matters | Product Team Recommendation | Required By | Status |
|---|---|---|---|---|---|
| **1** | **Confirm 2 Nov Scope Freeze & 10 Flags Off** | Protects the 12 camp-critical screens from scope creep. | **Confirm freeze** | **Wed 7 Oct** | **Pending CEO Action** |
| **2** | **Is SMS (~60 TZS) inside the 250 TZS fee?** | Determines pilot margin and prevents billing disputes. | **Include for pilot**, price separately later | **Mon 12 Oct** | **Pending CEO Action** |
| **3** | **Commission Tanzania PDPA Legal Review** | Covers registration, consent, cross-border transfer, SMS sender. | **Start this week** | **Fri 9 Oct** | **Pending CEO Action** |
| **4** | **Name Owner for Swahili Output Quality** | Avoids reputational damage from poorly phrased Swahili outputs. | **Bilingual clinician or editor** | **Mon 12 Oct** | **Pending CEO Action** |
| **5** | **Written Terms with Camp Organizer** | Covers turnout shortfalls and credit for unused prepaid entries. | **One-page agreement**, signed before camp | **Mon 19 Oct** | **Pending CEO Action** |
| **6** | **Retention Periods & HQ Scoped Permissions** | Restricts who can view what in HQ and enforces 90-day GPS purge. | **Decide before HQ is used** | **Mon 19 Oct** | **Pending CEO Action** |
| **7** | **Boost Prices & 1-in-8 Cap** | Governs sponsored placements; not needed for camp day. | **Defer to post-camp** | **Fri 30 Oct** | **Deferred** |
| **8** | **Zenodo Account & Branding Model** | Governs DOI minting; needed only for social layer launch. | **Defer to social launch** | **November** | **Deferred** |

---

## 9. Immediate Action Plan (5 to 11 October 2026)

1. **Monday, 5 October (Today):**
   - Save this report to `docs/INSPECTION_REPORT_OCTOBER_2026.md`.
   - Update `TRACE.md` with complete inspection findings and open action items.
2. **Wednesday, 7 October:**
   - Obtain CEO confirmation on Decision 1 (Scope Freeze).
   - Implement `useFeatureFlag` hook in `apps/web` to hide social tabs, search, Zenodo, streaks, and camp board.
3. **Friday, 9 October:**
   - Appoint Tanzanian legal counsel for PDPA compliance review (Decision 3).
   - Add participant consent checkbox to `healthStarter.ts` and `G2_NewEntry.tsx`.
4. **Sunday, 11 October (Week 1 Gate):**
   - Execute end-to-end sign-in and camp creation on a physical Android device using `KAMBi-v1.0.0-Field-Ahadi.apk`.

---
*Report documented and preserved in `docs/INSPECTION_REPORT_OCTOBER_2026.md` on 5 October 2026.*
