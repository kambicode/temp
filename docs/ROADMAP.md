# KAMBi - Roadmap

A ClerQ Intelligence product. Drafted 4 October 2026. First camp: Monday 2 November 2026. This roadmap sequences everything in the Blueprint and the companion documents into phases. Each phase has an exit test. The Blueprint's rule applies throughout: anything not stable at a freeze goes behind a feature flag rather than shipping half-working.

## 1. Shape of the plan

Three horizons:

- **Camp-critical (now to 2 November).** What must work on camp day and at event close.
- **Social launch (November to December 2026).** The community, Home, search, library, Zenodo, streaks.
- **Growth (2027).** Camp board with boosts, contributor rating, partners, full HQ console, Wrapped, then the marketplace and the later bets.

The camp-critical path is deliberately narrow. Everything else is built in the same codebase and design system, but is shipped behind flags so it can arrive without risking camp day.

## 2. Camp-critical horizon (4 October to 2 November)

### Week 1 (5 to 11 October): Foundation
- Monorepo scaffold, design tokens, ui package with core components.
- Auth, magic links, the two account types, per-event roles, row level security, append-only audit log.
- Event creation wizard skeleton: basics, domain, branch, team.
- **Exit test:** a new user signs in, creates an event, invites a collector, and the collector can only see that event.

### Week 2 (12 to 18 October): Capture
- Forms engine (versioned JSON schema, validation, skip logic), form builder with identifying and safe tags, Health starter template.
- Capture screen, instant local save, outbox with idempotent UUID upserts, sync sheet, offline pill, photo conversion.
- Duplicate detection and merge.
- **Exit test:** twenty entries recorded in airplane mode on a mid-range Android phone, synced after reconnect with no loss and no duplicates.

### Week 3 (19 to 25 October): Portal, money and share kit
- Event dashboard, per-collector counts, goal ring, raw CSV and Excel export.
- Billing ledger, Payme webhooks, prepaid entry package, one batched payment at event creation.
- Three SMS slots with rule-based templates, opt-out notice at registration, Textify with STOP and sender name.
- Camp share kit: join link, QR code, on-device poster templates, asset upload.
- Android build via Capacitor.
- **Exit test:** an organizer creates an event, pays, shares the QR, a volunteer joins by scan, collects, and the organizer sees live counts and exports the data.

### Week 4 (26 October to 1 November): Hardening and the close path
- Field test on real phones, fully offline, with a deliberately messy sync.
- Training session, and an unaided first-use test (can a new volunteer register a patient in under a minute).
- Backups, failure alerts to your phone, missed-batch catch-up on restart, per-entry cost log.
- Close-event path: the VPS queue, safety check, anonymization, and the Health branch's default outputs generating into the Inbox so that the up to five selected outputs arrive on close.
- Written terms with the camp organizer.
- Feature flags set; anything unstable stays hidden.
- **Exit test:** a dry-run camp with ten people, then a dry-run close that delivers the selected outputs.

### Camp day: 2 November
Support channel open, HQ minimal view for you, a rollback plan, and no new deployments after the freeze.

## 3. Social launch horizon (November to December 2026)

Built behind flags during the camp-critical horizon where possible, released in this order after camp stabilizes:

1. **Community core.** Feed, threads, composer, profile, block, mute, report. Pre-publish rule checks.
2. **Moderation pipeline.** Rule layer, five-minute hold, two-model decision and audit, human review queue, appeals.
3. **Home and search.** Adaptive tabs from onboarding intent, Personalise in settings, Home modules, search over people, tags, articles, camps and forums.
4. **Library and articles.** Reader, composer, saved collections, citation copy.
5. **Zenodo publishing.** Account linking, the publish sheet, the DOI chip. Sandbox first. Only organizer-approved, anonymized outputs and articles.
6. **Streaks.** Daily launch counting, ember ring, public by default, hideable.
7. **Chats and forums.** Direct messages, groups, forum pages, Kambi emoji.

**Exit test:** two hundred real users across the three intents, with the median reader reaching content within two taps and zero identifying data in any post.

## 4. Growth horizon (2027)

1. **Camp board.** Listings (not pre-reviewed at launch, report-driven moderation), Discover with map, request to join, applicant card, impact cards.
2. **Contributor rating.** Computed from camps, accepted entries, data quality and organizer feedback. Public by default, hideable, always visible to organizers a person applies to.
3. **Verified Partner badge and boosts.** Partner approvals by you in HQ; the capped visibility boost; paid boost tiers; promotional SMS to opted-in matched people.
4. **Recommender.** The thirty-minute job, matching posts and camps to interests and region.
5. **Full HQ console.** Live fleet map, moderation tools, money, anomalies, break-glass.
6. **Wrapped.** Quality-weighted recap in quota batches.
7. **Desktop build.** Tauri 2 wrapper.

## 5. Later bets

- **Data marketplace**, only after regulator assurance. Requires organizer approval, a record of each participant's consent, versioned terms and fresh opt-in for new uses.
- **Simulations** and **video capture** once the core is proven.
- **More output templates** per branch beyond the first catalog, and "Ask your data" over anonymized aggregate views.

## 6. Dependencies and gates

| Gate | What must be true | Blocks |
| --- | --- | --- |
| Consent text | Covers SMS, aggregate publication and (later) marketplace use | Zenodo publishing, promotional SMS, marketplace |
| Regulatory check | Tanzania data protection and telecom rules confirmed for health data, SMS and sender names | Promotional SMS, public launch of community |
| Ethics approval | Camp's research use approved where required | Publishing findings |
| Zenodo licensing | Logo and branding terms confirmed | The Zenodo mark (a neutral DOI chip ships first) |
| Payment provider | Payme refund and fee behavior confirmed | Prepaid package, boosts |
| Sender name | Registered and approved | Custom SMS sender name |
| Moderation quality | Disagreement rate and false blocks measured | Opening community beyond invited users |

## 7. Feature flags

| Flag | Default for 2 November | Turns on when |
| --- | --- | --- |
| community | off | moderation pipeline passes its test |
| search | off | community is on |
| zenodo | off | consent and licensing gates are clear |
| streaks | off | Home ships |
| camp_board | off | listings and join flow tested |
| boosts | off | camp board is on and Payme batching is proven |
| promo_sms | off | regulatory gate is clear |
| contributor_rating | off | at least two camps of data exist |
| wrapped | off | enough entries exist to rank fairly |
| hq_full | off (minimal view only) | HQ build complete |

## 8. Risks and how the plan handles them

| Risk | Handling |
| --- | --- |
| Sync loss on camp day | Idempotent outbox, the messy-sync field test, manual sync, local encryption, and export always available |
| Identity reaching an AI model | Default-unsafe field classification, locked identity table, photos never in the AI path, free-text excluded until the scrubber is proven |
| Permanent publication of sensitive data | Zenodo only for approved, anonymized outputs, small-count rule, confirmation of permanence |
| Moderation misses | Layered checks, a human queue, reports, appeals, forum owners, and the community kept off until tested |
| Scope pressure | The flag list above; camp-critical exit tests are the only hard gates |
| Provider outage (Payme, Textify, OpenRouter) | Queues with retry, idempotent jobs, and clear states in the interface |
| Cost drift | Per-entry cost log, per-generation limits against loops, SMS counted in segments |

## 9. Measures of success

- **Camp-critical:** entries lost is zero; median time to register a first patient under one minute for first-time volunteers; sync success rate; the selected outputs delivered at close.
- **Social:** weekly returning readers; articles published; share of posts passing pre-publish checks; reports per thousand posts.
- **Growth:** camps listed and filled; applications per listing; boost conversion; margin per entry.
