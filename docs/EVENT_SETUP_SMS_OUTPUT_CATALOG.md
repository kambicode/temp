# KAMBi - Event Setup, SMS and Output Catalog

Companion to the Blueprint and the Design, Stack and Roles doc. Written so a coding agent can build from it directly. Items marked "proposed" are my drafts and need your confirmation.

## 1. Event setup (onboarding for organizers)

The setup is dynamic: each answer changes what the next screen shows.

1. **Event basics.** Name, dates, fixed or rolling, language (Swahili, English or both).
2. **Domain.** Four cards: Sciences, Arts and Humanities, Liberties (law, philosophy, governance and social work), Economics and Finance.
3. **Where do you fit?** A second question inside the chosen domain, asking for the branch. Sciences: Health and Life Sciences (biology is part of health), Chemistry, Physics, Earth and Environment. Arts and Humanities: Visual and Performing Arts, Literature and Language, History and Heritage, Culture and Communities, Media and Communication. Liberties: Law and Justice, Governance and Policy, Philosophy and Ethics, Education and Society, Community and Development. Economics and Finance: Economics, Finance and Fintech, Business and Markets, Public Finance and Development, Technology and Innovation. The branch decides the starter form templates and the default ten outputs.
4. **Outputs at event end.** The screen shows the branch's default ten (the [D] items in section 5) with their format chips. A search box sits above the list and searches the whole catalog, so an organizer can add any item, from any branch or domain. The organizer selects up to five in total. Exactly the selected outputs are generated when the event closes, once, with no regeneration. The cap is enforced in the interface and again on the server. Each selected output shows its default formats as chips that can be toggled (section 5).
5. **Follow-ups.** Chosen the same way: the branch's follow-up outputs first, search for the rest, up to five.
6. **SMS messages.** See section 2.
7. **Team.** Invites, as already specified, plus approval of people who request to join from the camp board.
8. **Assets.** Logo, cover image and partner logos, converted on the device. These feed the camp dashboard's share kit: a join link, a QR code, and on-device poster templates.
9. **Boost.** Optional. The organizer can include a boost, and the entry package and the boost are paid together in a single batched payment (Design doc, section 4.6).
10. **Are you a Kambi partner?** Last step, optional. See section 3.

The Blueprint line "about ten output types chosen at form creation" becomes "up to five, from the branch's default ten or the full catalog, chosen at setup".

## 2. SMS messages

Each participant can receive three messages per event. For each of the three slots:

- The system generates a **rule-based template**, filled from the participant's entry using only fields tagged safe. The organizer sees it as a placeholder and can send it as is or edit it.
- Slot triggers (proposed): **Message 1** when the entry is saved (thanks, event name, organizer contact). **Message 2** a reminder before the follow-up date (date, place, contact). **Message 3** after the event closes (thanks, where to ask questions, how to reach the organizer).
- Placeholders: first name, event name, organizer name, follow-up date, follow-up place, contact number. Anything not tagged safe cannot be inserted.
- A live counter shows characters and segments (160 per segment for plain text). Emoji and some special characters push a message into 70-character segments, so they are blocked here as everywhere else.
- Guardrails: no diagnosis, test result or condition name may appear in any SMS, in templates or in edits. Edits pass the same rule check as AI input, and a blocked edit explains why.
- Templates exist in Swahili and English; the participant's language is recorded at registration.
- Delivery status per message, and cost posted to the event ledger (about 20 shillings each).

### 2.1 SMS notice and opt-out at registration

- The registration screen shows a short notice before saving: this event may send up to three SMS, the messages will not mention health details, and the person can opt out. An "I do not want SMS" choice is one tap, and the notice is read aloud by the collector in the same words.
- The notice also warns that the phone number may be on a shared phone, so people should only give a number where they are comfortable receiving messages.
- Opt-out is recorded with a timestamp and the terms version, and the SMS queue skips that participant. A reply STOP is honored; Textify supports STOP replies and custom sender names.
- Draft English: "This event may send you up to 3 text messages about your visit. They will not mention your health. If you do not want them, choose 'No SMS' or reply STOP to any message."
- Draft Swahili (needs a native speaker's check): "Tukio hili linaweza kukutumia hadi ujumbe mfupi (SMS) 3 kuhusu ziara yako. Ujumbe huo hautataja hali yako ya afya. Ikiwa hutaki kuupokea, chagua 'Hapana SMS' au jibu STOP kwa ujumbe wowote."

## 3. Community branding and the Verified Partner badge

- The community (feed, chats, forums, library) is its own product. Reader surfaces carry no Kambi or camp branding.
- A **Verified Partner** badge exists for Kambi partners. It is a profile attribute, not an event role, so section 1 of the Design doc is unchanged.
- Flow: the last onboarding step asks "Are you a Kambi partner?". If yes, the person enters a description and contact details. This creates a request in the HQ queue.
- Approval is done by the HQ Owner, who approves or declines. Approval shows the badge on the profile and posts. The HQ Owner can revoke it. Every decision is written to the audit log.
- Benefit: visibility. Verified partners rank higher in search, in the camp board, and in the recommender. The badge says "Verified Partner" so the boost is never hidden. The boost is capped: boosted and partner items together fill at most one in eight slots on any feed or search page and never take the top result for an exact name or tag search, so organic results are never buried. Paid boosts are described in the Design doc, section 4.6.

## 4. Output formats

Every output ships in the formats that suit it. The catalog tags each item with a format string after the bar, with the primary format first.

| Code | Format | Used for |
| --- | --- | --- |
| P | PDF | the finished, shareable document |
| W | Word | editable text the organizer will adapt |
| X | Excel | registers, logs, KPI sheets, rankings, anything with rows |
| C | Charts | PNG and SVG charts, also embedded in the document |

Rules (the agent applies them by keyword on the output name, and a person can override per output at setup):

- Data reports, audits and briefs: P W C (PDF with charts, plus an editable Word copy).
- Proposals, grant templates, articles, essays, letters, newsletters, statements and plans: W P (Word first because people edit them).
- Registers, logs, inventories, KPI sheets, catalogues and indexes: X P.
- Charts, maps and trends: C P.
- Question banks, exams, quizzes and case sets: W P, with the answer key in a separate file so it is never shared by accident.
- Every file carries the AI-draft label and a data-basis note, as already specified. Excel files never contain identity-table fields.

## 5. Changes to apply to the other documents

- Blueprint, Stage 4: outputs are "up to five, from the branch's default ten or the full catalog".
- Blueprint, Stage 3: SMS has three slots with editable rule-based templates, an opt-out notice at registration, and a no-health-content rule.
- Blueprint, Stage 5: add the Verified Partner badge (approved by the HQ Owner, boosts visibility) and the camp board; reader surfaces are unbranded.
- Design doc: see sections 4.5 (camp board), 4.6 (boosts) and 4.7 (Home), and the updated navigation.

## 5.1 Open questions

1. Boost tier prices.
2. Promotional SMS: opt-in wording, sender name registration, and the legal basis under Tanzanian rules.

## 6. Output catalog

IDs are domain letters, branch number, item number (for example SCI-1-04). Items marked [D] are the default ten for that branch. The catalog is searchable at setup by keyword. Health and Life Sciences is the first branch to be tuned because the first camp is a health camp.


### Sciences (100 outputs)


**SCI-1 Health and Life Sciences** (60 outputs, 10 default)

- SCI-1-01 Camp summary report [D] | P W C
- SCI-1-02 Full study report | P W C
- SCI-1-03 Demographic profile | P W C
- SCI-1-04 Prevalence summary [D] | P W C
- SCI-1-05 Screening outcomes report [D] | P W C
- SCI-1-06 Referral and follow-up register [D] | X P
- SCI-1-07 Service coverage report | P W C
- SCI-1-08 Disease burden by age and sex | P W C
- SCI-1-09 Maternal and child health snapshot | P W C
- SCI-1-10 Non-communicable disease risk summary | P W C
- SCI-1-11 Infectious disease signals | P W C
- SCI-1-12 Nutrition and anthropometry summary | P W C
- SCI-1-13 Immunization coverage report | P W C
- SCI-1-14 Vision and hearing screening report | P W C
- SCI-1-15 Oral health summary | P W C
- SCI-1-16 Mental wellbeing screening aggregate | P W C
- SCI-1-17 Medicine and supply use report | P W C
- SCI-1-18 Community health worker performance | P W C
- SCI-1-19 KPI sheet [D] | X P
- SCI-1-20 Collector productivity report | P W C
- SCI-1-21 Data quality audit [D] | P W C
- SCI-1-22 Geographic heat map brief | C P
- SCI-1-23 Trend charts pack [D] | C P
- SCI-1-24 Follow-up question set [D] | W P
- SCI-1-25 Patient follow-up message set | W P
- SCI-1-26 Health education leaflet | W P
- SCI-1-27 Exam questions from findings | W P
- SCI-1-28 OSCE station case | W P
- SCI-1-29 Clinical teaching case | W P
- SCI-1-30 Quiz bank | W P
- SCI-1-31 Research proposal | W P
- SCI-1-32 Grant template | W P
- SCI-1-33 Conference abstract | W P
- SCI-1-34 Poster text | W P
- SCI-1-35 Manuscript draft (IMRaD) | W P
- SCI-1-36 Ethics committee summary | P W C
- SCI-1-37 Literature context brief | W P
- SCI-1-38 Newsletter article [D] | W P
- SCI-1-39 Investigative article | W P
- SCI-1-40 Sponsor impact letter [D] | W P
- SCI-1-41 Species survey report | P W C
- SCI-1-42 Biodiversity index summary | X P
- SCI-1-43 Specimen log | X P
- SCI-1-44 Field transect analysis | P W C
- SCI-1-45 Population estimate report | P W C
- SCI-1-46 Habitat assessment | P W C
- SCI-1-47 Vector and pest survey | P W C
- SCI-1-48 Crop disease survey | P W C
- SCI-1-49 Livestock health survey | P W C
- SCI-1-50 Water quality biology report | X P
- SCI-1-51 Genetic sampling record summary | P W C
- SCI-1-52 Lab practical report | P W C
- SCI-1-53 Field notebook digest | P W C
- SCI-1-54 Conservation status brief | P W C
- SCI-1-55 Ecology trend charts | X P
- SCI-1-56 Citizen science summary | P W C
- SCI-1-57 Practical exam questions | W P
- SCI-1-58 Journal article draft | W P
- SCI-1-59 Clinical audit report | P W C
- SCI-1-60 Systematic review protocol | W P

**SCI-2 Chemistry** (15 outputs, 10 default)

- SCI-2-01 Sample analysis report [D] | P W C
- SCI-2-02 Water chemistry report [D] | P W C
- SCI-2-03 Soil chemistry report [D] | P W C
- SCI-2-04 Contaminant screening summary [D] | P W C
- SCI-2-05 Lab safety audit [D] | P W C
- SCI-2-06 Calibration and QC report [D] | P W C
- SCI-2-07 Reagent inventory report | X P
- SCI-2-08 Titration practical report | P W C
- SCI-2-09 Environmental exposure brief | P W C
- SCI-2-10 Product testing report [D] | P W C
- SCI-2-11 Method validation summary | P W C
- SCI-2-12 Practical exam questions [D] | W P
- SCI-2-13 Research proposal [D] | W P
- SCI-2-14 Grant template [D] | W P
- SCI-2-15 Technical article | W P

**SCI-3 Physics** (15 outputs, 10 default)

- SCI-3-01 Measurement campaign report [D] | P W C
- SCI-3-02 Instrument calibration log [D] | X P
- SCI-3-03 Uncertainty analysis [D] | P W C
- SCI-3-04 Experiment results pack [D] | P W C
- SCI-3-05 Radiation and noise survey | P W C
- SCI-3-06 Energy resource assessment | P W C
- SCI-3-07 Weather station summary | P W C
- SCI-3-08 Field measurement report [D] | P W C
- SCI-3-09 Data fit and regression brief [D] | P W C
- SCI-3-10 Practical exam questions [D] | W P
- SCI-3-11 Lab report [D] | P W C
- SCI-3-12 Research proposal [D] | W P
- SCI-3-13 Grant template | W P
- SCI-3-14 Technical article [D] | W P
- SCI-3-15 Public explainer (physics) | W P

**SCI-4 Earth and Environment** (10 outputs, 10 default)

- SCI-4-01 Environmental baseline report [D] | P W C
- SCI-4-02 Water access survey [D] | P W C
- SCI-4-03 Air quality summary [D] | P W C
- SCI-4-04 Land use change report [D] | P W C
- SCI-4-05 Waste audit [D] | P W C
- SCI-4-06 Climate risk brief [D] | P W C
- SCI-4-07 Flood and drought impact report [D] | P W C
- SCI-4-08 Soil erosion survey [D] | P W C
- SCI-4-09 Environmental impact summary [D] | P W C
- SCI-4-10 Community environmental newsletter [D] | W P

### Arts and Humanities (100 outputs)


**ART-1 Visual and Performing Arts** (20 outputs, 10 default)

- ART-1-01 Audience survey report [D] | P W C
- ART-1-02 Exhibition feedback report [D] | P W C
- ART-1-03 Attendance and engagement summary [D] | P W C
- ART-1-04 Artist interview digest [D] | P W C
- ART-1-05 Programme evaluation [D] | P W C
- ART-1-06 Creative practice study | P W C
- ART-1-07 Festival impact report [D] | P W C
- ART-1-08 Venue accessibility audit | P W C
- ART-1-09 Audience demographic profile [D] | P W C
- ART-1-10 Critical review essay | W P
- ART-1-11 Curatorial statement | W P
- ART-1-12 Artist statement set | W P
- ART-1-13 Programme notes | W P
- ART-1-14 Press kit | W P
- ART-1-15 Funding application [D] | W P
- ART-1-16 Grant template (arts) | W P
- ART-1-17 Research proposal (arts) | W P
- ART-1-18 Teaching questions (arts) | W P
- ART-1-19 Case study (arts) [D] | W P
- ART-1-20 Newsletter article (arts) [D] | W P

**ART-2 Literature and Language** (20 outputs, 10 default)

- ART-2-01 Readership survey [D] | P W C
- ART-2-02 Reading habits report [D] | P W C
- ART-2-03 Language use survey [D] | P W C
- ART-2-04 Dialect and vocabulary record [D] | P W C
- ART-2-05 Oral literature collection index [D] | X P
- ART-2-06 Translation quality review | P W C
- ART-2-07 Corpus summary [D] | P W C
- ART-2-08 Library usage report | P W C
- ART-2-09 Literacy assessment summary | P W C
- ART-2-10 Textual analysis essay [D] | W P
- ART-2-11 Annotated bibliography [D] | P W C
- ART-2-12 Book review set | W P
- ART-2-13 Interview transcript digest [D] | P W C
- ART-2-14 Discourse analysis brief | P W C
- ART-2-15 Essay questions (literature) | W P
- ART-2-16 Reading guide | W P
- ART-2-17 Research proposal (literature) [D] | W P
- ART-2-18 Grant template (literature) | W P
- ART-2-19 Journal article draft (literature) | W P
- ART-2-20 Newsletter article (literature) | W P

**ART-3 History and Heritage** (20 outputs, 10 default)

- ART-3-01 Oral history collection report [D] | W P
- ART-3-02 Archive survey [D] | P W C
- ART-3-03 Heritage site assessment [D] | P W C
- ART-3-04 Artefact catalogue [D] | X P
- ART-3-05 Community memory digest [D] | W P
- ART-3-06 Timeline of events [D] | X P
- ART-3-07 Source analysis brief [D] | P W C
- ART-3-08 Heritage condition report [D] | P W C
- ART-3-09 Visitor study | P W C
- ART-3-10 Interview consent register summary | X P
- ART-3-11 Exhibition text | W P
- ART-3-12 Museum education pack | P W C
- ART-3-13 Local history article [D] | W P
- ART-3-14 Documentary treatment | W P
- ART-3-15 Annotated sources (history) | W P
- ART-3-16 Essay questions (history) | W P
- ART-3-17 Research proposal (history) [D] | W P
- ART-3-18 Grant template (history) | W P
- ART-3-19 Conservation funding appeal | W P
- ART-3-20 Journal article draft (history) | W P

**ART-4 Culture and Communities** (20 outputs, 10 default)

- ART-4-01 Ethnographic field report [D] | P W C
- ART-4-02 Cultural practices survey [D] | P W C
- ART-4-03 Community profile [D] | P W C
- ART-4-04 Belief and practice study [D] | P W C
- ART-4-05 Ritual and festival record [D] | P W C
- ART-4-06 Intergenerational study | P W C
- ART-4-07 Migration and identity study | P W C
- ART-4-08 Language and identity brief | P W C
- ART-4-09 Food and craft heritage record | P W C
- ART-4-10 Participant observation digest [D] | P W C
- ART-4-11 Thematic coding report [D] | P W C
- ART-4-12 Quote bank (anonymized) [D] | X P
- ART-4-13 Community feedback report [D] | P W C
- ART-4-14 Cultural impact assessment | P W C
- ART-4-15 Case study (culture) | W P
- ART-4-16 Essay questions (culture) | W P
- ART-4-17 Research proposal (culture) | W P
- ART-4-18 Grant template (culture) | W P
- ART-4-19 Journal article draft (culture) | W P
- ART-4-20 Public explainer (culture) [D] | W P

**ART-5 Media and Communication** (20 outputs, 10 default)

- ART-5-01 Audience research report [D] | P W C
- ART-5-02 Media consumption survey [D] | P W C
- ART-5-03 Content analysis [D] | P W C
- ART-5-04 Message testing report [D] | P W C
- ART-5-05 Campaign evaluation [D] | P W C
- ART-5-06 Social media sentiment summary [D] | P W C
- ART-5-07 Newsroom source audit | P W C
- ART-5-08 Misinformation exposure brief [D] | P W C
- ART-5-09 Podcast listener study | P W C
- ART-5-10 Brand perception report | P W C
- ART-5-11 Communication plan | W P
- ART-5-12 Editorial brief | P W C
- ART-5-13 Investigative article (media) [D] | W P
- ART-5-14 Feature story [D] | W P
- ART-5-15 Press release [D] | W P
- ART-5-16 Newsletter (media) | W P
- ART-5-17 Fact-check summary | P W C
- ART-5-18 Research proposal (media) | W P
- ART-5-19 Grant template (media) | W P
- ART-5-20 Teaching questions (media) | W P

### Liberties (100 outputs)


**LIB-1 Law and Justice** (25 outputs, 10 default)

- LIB-1-01 Legal needs survey [D] | P W C
- LIB-1-02 Access to justice report [D] | P W C
- LIB-1-03 Legal awareness study [D] | P W C
- LIB-1-04 Case file audit (anonymized) | P W C
- LIB-1-05 Court user experience report | P W C
- LIB-1-06 Paralegal clinic report [D] | P W C
- LIB-1-07 Rights awareness brief [D] | P W C
- LIB-1-08 Land and tenure dispute survey [D] | P W C
- LIB-1-09 Labour rights survey | P W C
- LIB-1-10 Gender-based legal issues summary (aggregate) | P W C
- LIB-1-11 Consumer rights survey | P W C
- LIB-1-12 Detention conditions observation report | P W C
- LIB-1-13 Compliance audit | P W C
- LIB-1-14 Policy gap analysis [D] | P W C
- LIB-1-15 Legal aid referral register [D] | X P
- LIB-1-16 Case summary memo | W P
- LIB-1-17 Legal brief outline | P W C
- LIB-1-18 Moot problem set | W P
- LIB-1-19 Exam questions (law) | W P
- LIB-1-20 Client follow-up question set [D] | W P
- LIB-1-21 Advocacy brief | P W C
- LIB-1-22 Research proposal (law) | W P
- LIB-1-23 Grant template (law) | W P
- LIB-1-24 Journal article draft (law) | W P
- LIB-1-25 Public legal education leaflet [D] | W P

**LIB-2 Governance and Policy** (20 outputs, 10 default)

- LIB-2-01 Policy evaluation report [D] | P W C
- LIB-2-02 Service delivery scorecard [D] | P W C
- LIB-2-03 Citizen satisfaction survey [D] | P W C
- LIB-2-04 Public participation report [D] | P W C
- LIB-2-05 Budget awareness survey | P W C
- LIB-2-06 Local government assessment | P W C
- LIB-2-07 Election observation summary | P W C
- LIB-2-08 Policy brief [D] | P W C
- LIB-2-09 Evidence brief for decision makers [D] | P W C
- LIB-2-10 Stakeholder mapping [D] | C P
- LIB-2-11 Needs assessment [D] | P W C
- LIB-2-12 Baseline report [D] | P W C
- LIB-2-13 Midline and endline comparison [D] | P W C
- LIB-2-14 Theory of change | P W C
- LIB-2-15 Logframe | X P
- LIB-2-16 Council briefing note | P W C
- LIB-2-17 Advocacy petition summary | P W C
- LIB-2-18 Research proposal (governance) | W P
- LIB-2-19 Grant template (governance) | W P
- LIB-2-20 Journal article draft (governance) | W P

**LIB-3 Philosophy and Ethics** (15 outputs, 10 default)

- LIB-3-01 Ethical review summary [D] | P W C
- LIB-3-02 Values survey report [D] | P W C
- LIB-3-03 Moral reasoning study [D] | P W C
- LIB-3-04 Conceptual analysis essay [D] | W P
- LIB-3-05 Argument map [D] | C P
- LIB-3-06 Dilemma case set [D] | W P
- LIB-3-07 Stakeholder ethics brief | P W C
- LIB-3-08 Consent practice audit [D] | P W C
- LIB-3-09 Position paper [D] | W P
- LIB-3-10 Discussion guide [D] | W P
- LIB-3-11 Seminar questions | W P
- LIB-3-12 Exam questions (philosophy) | W P
- LIB-3-13 Research proposal (philosophy) [D] | W P
- LIB-3-14 Grant template (philosophy) | W P
- LIB-3-15 Journal article draft (philosophy) | W P

**LIB-4 Education and Society** (20 outputs, 10 default)

- LIB-4-01 Learning outcomes report [D] | P W C
- LIB-4-02 School readiness survey [D] | P W C
- LIB-4-03 Attendance and dropout analysis [D] | P W C
- LIB-4-04 Teacher survey [D] | P W C
- LIB-4-05 Curriculum feedback report [D] | P W C
- LIB-4-06 Classroom observation summary [D] | P W C
- LIB-4-07 Student wellbeing aggregate | P W C
- LIB-4-08 Literacy and numeracy assessment [D] | P W C
- LIB-4-09 Scholarship needs survey | P W C
- LIB-4-10 Education access map [D] | C P
- LIB-4-11 Learner profile | P W C
- LIB-4-12 Lesson plan set | W P
- LIB-4-13 Assessment items | W P
- LIB-4-14 Exam questions (education) | W P
- LIB-4-15 Parent report [D] | P W C
- LIB-4-16 Programme evaluation (education) [D] | P W C
- LIB-4-17 Research proposal (education) | W P
- LIB-4-18 Grant template (education) | W P
- LIB-4-19 Journal article draft (education) | W P
- LIB-4-20 Newsletter article (education) | W P

**LIB-5 Community and Development** (20 outputs, 10 default)

- LIB-5-01 Household survey report [D] | P W C
- LIB-5-02 Poverty and livelihoods profile [D] | P W C
- LIB-5-03 WASH survey report [D] | P W C
- LIB-5-04 Food security survey [D] | P W C
- LIB-5-05 Gender and inclusion report [D] | P W C
- LIB-5-06 Youth survey | P W C
- LIB-5-07 Disability inclusion audit | P W C
- LIB-5-08 Social protection coverage report | P W C
- LIB-5-09 Community needs assessment [D] | P W C
- LIB-5-10 Beneficiary register summary | X P
- LIB-5-11 Monitoring and evaluation report [D] | P W C
- LIB-5-12 Impact story set [D] | W P
- LIB-5-13 Donor report [D] | P W C
- LIB-5-14 Partner briefing | P W C
- LIB-5-15 NGO annual report section | P W C
- LIB-5-16 Community feedback loop report [D] | P W C
- LIB-5-17 Case study set (development) | W P
- LIB-5-18 Research proposal (development) | W P
- LIB-5-19 Grant template (development) | W P
- LIB-5-20 Public explainer (development) | W P

### Economics and Finance (100 outputs)


**ECO-1 Economics** (20 outputs, 10 default)

- ECO-1-01 Household income and expenditure profile [D] | P W C
- ECO-1-02 Cost of living survey [D] | P W C
- ECO-1-03 Price monitoring report [D] | P W C
- ECO-1-04 Labour market survey [D] | P W C
- ECO-1-05 Informal sector profile [D] | P W C
- ECO-1-06 Local economy snapshot [D] | P W C
- ECO-1-07 Supply chain mapping | C P
- ECO-1-08 Willingness-to-pay study [D] | P W C
- ECO-1-09 Cost-benefit analysis [D] | P W C
- ECO-1-10 Impact evaluation brief | P W C
- ECO-1-11 Demand estimate | P W C
- ECO-1-12 Economic trend charts [D] | C P
- ECO-1-13 Regional comparison | P W C
- ECO-1-14 Gender and economic participation report | P W C
- ECO-1-15 Remittance flows survey | P W C
- ECO-1-16 Agricultural market survey [D] | P W C
- ECO-1-17 Scenario analysis | P W C
- ECO-1-18 Research proposal (economics) | W P
- ECO-1-19 Grant template (economics) | W P
- ECO-1-20 Journal article draft (economics) | W P

**ECO-2 Finance and Fintech** (25 outputs, 10 default)

- ECO-2-01 Financial inclusion survey [D] | P W C
- ECO-2-02 Mobile money usage report [D] | P W C
- ECO-2-03 Savings and credit behaviour study [D] | P W C
- ECO-2-04 Loan portfolio quality sample | P W C
- ECO-2-05 Customer onboarding experience audit | P W C
- ECO-2-06 Fintech product-market fit report [D] | P W C
- ECO-2-07 Customer discovery summary [D] | P W C
- ECO-2-08 Pricing test results [D] | P W C
- ECO-2-09 Fraud and scam exposure brief [D] | P W C
- ECO-2-10 Digital literacy and trust report | P W C
- ECO-2-11 Agent network assessment | P W C
- ECO-2-12 KYC friction analysis | P W C
- ECO-2-13 Customer segmentation [D] | P W C
- ECO-2-14 Churn drivers report | P W C
- ECO-2-15 Financial wellbeing index [D] | X P
- ECO-2-16 Insurance uptake survey | P W C
- ECO-2-17 Pension awareness survey | P W C
- ECO-2-18 SACCO member survey | P W C
- ECO-2-19 Investor update [D] | W P
- ECO-2-20 Pitch deck narrative | W P
- ECO-2-21 Due diligence summary | P W C
- ECO-2-22 Risk register | X P
- ECO-2-23 Regulatory compliance checklist | X P
- ECO-2-24 Research proposal (finance) | W P
- ECO-2-25 Grant template (finance) | W P

**ECO-3 Business and Markets** (20 outputs, 10 default)

- ECO-3-01 Market size estimate [D] | P W C
- ECO-3-02 Customer survey report [D] | P W C
- ECO-3-03 Competitor scan [D] | P W C
- ECO-3-04 Brand awareness study [D] | P W C
- ECO-3-05 Customer satisfaction and NPS report [D] | P W C
- ECO-3-06 Retail audit [D] | P W C
- ECO-3-07 Product feedback summary [D] | P W C
- ECO-3-08 Feasibility study [D] | P W C
- ECO-3-09 Business plan section | W P
- ECO-3-10 SWOT analysis | P W C
- ECO-3-11 Go-to-market brief | P W C
- ECO-3-12 Pricing study [D] | P W C
- ECO-3-13 Small business owner survey | P W C
- ECO-3-14 Supplier survey | P W C
- ECO-3-15 Employee survey | P W C
- ECO-3-16 Sales territory heat map | C P
- ECO-3-17 Customer personas [D] | P W C
- ECO-3-18 Case study (business) | W P
- ECO-3-19 Research proposal (business) | W P
- ECO-3-20 Newsletter article (business) | W P

**ECO-4 Public Finance and Development** (15 outputs, 10 default)

- ECO-4-01 Budget tracking survey [D] | P W C
- ECO-4-02 Public service cost report [D] | P W C
- ECO-4-03 Tax compliance perception survey [D] | P W C
- ECO-4-04 Subsidy targeting review [D] | P W C
- ECO-4-05 Value for money review [D] | P W C
- ECO-4-06 Donor funding landscape | P W C
- ECO-4-07 Programme cost per beneficiary [D] | P W C
- ECO-4-08 Financial report for partners [D] | P W C
- ECO-4-09 Grant reporting pack [D] | P W C
- ECO-4-10 Impact investment brief | P W C
- ECO-4-11 Procurement observation report [D] | P W C
- ECO-4-12 Revenue collection survey [D] | P W C
- ECO-4-13 Policy brief (public finance) | P W C
- ECO-4-14 Grant template (public finance) | W P
- ECO-4-15 Journal article draft (public finance) | W P

**ECO-5 Technology and Innovation** (20 outputs, 10 default)

- ECO-5-01 User research report [D] | P W C
- ECO-5-02 Usability test findings [D] | P W C
- ECO-5-03 Technology adoption survey [D] | X P
- ECO-5-04 Digital access and device survey [D] | P W C
- ECO-5-05 Connectivity map [D] | C P
- ECO-5-06 App feedback summary [D] | P W C
- ECO-5-07 Feature request ranking [D] | X P
- ECO-5-08 Beta test report [D] | P W C
- ECO-5-09 Digital skills assessment [D] | P W C
- ECO-5-10 AI readiness survey [D] | P W C
- ECO-5-11 Data governance review | P W C
- ECO-5-12 Product requirements brief | P W C
- ECO-5-13 Deployment case study | W P
- ECO-5-14 Innovation pipeline report | P W C
- ECO-5-15 Developer survey | P W C
- ECO-5-16 Open data inventory | X P
- ECO-5-17 Security awareness survey | P W C
- ECO-5-18 Research proposal (technology) | X P
- ECO-5-19 Grant template (technology) | X P
- ECO-5-20 Technical article | W P
