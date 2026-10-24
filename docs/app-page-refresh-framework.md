# Arbor app-page refresh framework

Working brief and review checklist for the eight individual app pages. This document is the baseline before product walkthroughs begin. Product capabilities, release state, platform support, integrations, and privacy claims must be confirmed in the simulator or against current product documentation before publication.

## Shared page framework

Every page should answer the same visitor questions, in this order, without forcing every app into the same composition.

1. **Identity and positioning** — app icon, name, guide role, life domain, one-sentence promise, and current access state.
2. **Problem and outcome** — the recognisable tension the visitor has now, followed by the change the app helps them make. Avoid feature language here.
3. **How it works** — a concrete three-to-five-step primary workflow, shown with real interface states.
4. **Features and benefits** — a selective set of differentiators tied to outcomes rather than an exhaustive feature grid.
5. **People and situations** — representative users and moments of use. Do not invent testimonials, usage numbers, or clinical/financial outcomes.
6. **Product proof** — purposeful, current screenshots that show input, guidance, personalisation, and a useful result or progress state.
7. **The wider Arbor system** — one specific, benefit-led example of what this guide can learn from or contribute to another guide through the shared understanding that comes with an Arbor account.
8. **Practical details** — platform and device support, eligibility, development/access state, account requirements, external data sources, storage and privacy, AI use, relevant limitations, and links to policies/support.
9. **Final action** — one primary CTA matched to availability, plus a low-commitment secondary route where useful.

### Family system

- Keep the existing Arbor navigation, footer, core type system, spacing scale, dark/paper surfaces, app icon treatment, and guide naming convention.
- Give each page an app-colour accent, but never rely on colour alone for meaning. Respect the existing contrast rules, especially Thrive red.
- Use the same screenshot standards: real simulator captures, consistent device frame geometry, honest captions, readable crops, no status-bar clutter, and alt text that describes the product state rather than the decoration.
- Use a consistent CTA grammar: **Join the beta** or **Download** when access is open; **Request early access** when gated; **Follow its progress** when it is not available. Never imply that a roadmap stage guarantees access.
- Treat connected intelligence as a core Arbor benefit. Show how shared context makes two or more guides more useful, specific and realistic instead of repeatedly framing connection as a warning or permission choice.
- Keep necessary privacy and data-handling facts concise and in the practical-details section or dedicated policies. Do not interrupt the marketing story with repeated consent reminders.
- End every page with a compact app-family hand-off: the current guide's role, one or two meaningful connections, a link to how Arbor works, and the availability-appropriate CTA.

### Individual storytelling directions

| App | Page rhythm and visual device |
| --- | --- |
| Aevo | A training-cycle story: goal → week → session → review. Athletic pacing, dense performance detail, and a calendar-led proof sequence. |
| Salus | A quiet reflection journey: moment → expression → response → pattern. More space, softer transitions, and journal/conversation pairings. |
| Thrive | A day-in-motion story: overwhelm → prioritise → plan → adapt. Modular blocks and timeline movement that feel organised without rigidity. |
| Nura | A progressive clarity story: position → priorities → plan → confidence. Calm data hierarchy, annotated numbers, and transparent explanations. |
| Wend | A branching discovery story: mood and constraints → possibilities → chosen plan → experience. Editorial imagery and itinerary/map rhythm. |
| Kith | A relationship constellation: people → context → thoughtful prompt → connection. Warm clusters and human-scale moments, never a CRM aesthetic. |
| Telos | A decision-path story: values and strengths → options → trade-offs → next step. Reflective editorial layout with branching routes. |
| Sage | A learning-loop story: curiosity → explanation → practice → recall/progress. Layered notes and visible knowledge-building. |

## Eight-app content matrix

This matrix records the current website baseline and the screens needed to prove or correct it. “Verify” items are deliberate placeholders for the simulator review, not publishable claims.

| App | Audience | Core job and promised outcome | Primary workflow to verify |
| --- | --- | --- | --- |
| **Aevo** | People combining strength, running, conditioning, or sport; people who want structured training that fits real weeks. | Turn goals, current ability, and available time into coherent training, then adapt it from completed work. | Set starting point and goal → establish weekly availability → build/review the combined plan → open and complete a session → review progress and adjust. |
| **Salus** | Journalers; people navigating a busy or unsettled period; people wanting a private space to understand thoughts, mood, and patterns. | Make reflection easier to begin and more useful over time, without judgement or forced positivity. | Check in or choose a prompt → write or talk in your own words → receive a reflection or useful question → revisit entries/patterns → choose what, if anything, to share. |
| **Thrive** | People balancing work, home, study, and routines; people who need flexible structure rather than a rigid productivity system. | Turn commitments and intentions into a realistic day, then re-plan when life changes. | Bring in tasks/commitments → choose what matters → break work into next actions → shape a day or routine → adapt and review. |
| **Nura** | People building money habits, households coordinating costs, and people saving toward a personally meaningful goal. | Understand the current money picture and connect everyday choices to future plans in plain language. | Establish accounts/position → understand spending and commitments → set a goal or scenario → explore a plan → monitor change and revisit choices. **Verify exact data-entry or connection model.** |
| **Wend** | People planning travel, local days out, hobbies, quiet weekends, and low-cost free time. | Replace endless browsing with ideas and a workable plan that fit interests, time, company, and budget. | Share mood/constraints → explore personalised ideas → inspect useful details → save or assemble a plan → revisit during or after the experience. |
| **Kith** | People who want to care for friendships, family, partners, or community more intentionally. | Remember what matters and turn good intentions into considerate connection, while keeping outreach under the user's control. | Add or understand a relationship → capture meaningful context → receive a timely prompt/idea → choose and prepare an action → reflect on connection. **Verify current scope and whether any messaging occurs in-app.** |
| **Telos** | People beginning work, considering a change, feeling stuck, or shaping a new professional chapter. | Clarify what matters in work, explore plausible directions, and turn reflection into a useful next step. | Reflect on values/strengths/constraints → name a question or direction → compare paths and trade-offs → choose a next step → revisit progress. |
| **Sage** | Students, career skill-builders, and lifelong learners following practical or personal curiosity. | Turn curiosity into understandable, retained knowledge through explanation, practice, and visible progress. | Choose a subject/outcome → assess starting point → receive an explanation or learning path → practise and get feedback → revisit/track understanding. |

| App | Strongest proof screens to capture | Relationship to the Arbor ecosystem | Practical details that must appear or be verified |
| --- | --- | --- | --- |
| **Aevo** | Goal/onboarding summary; combined weekly training calendar; detailed strength or running session; completed-session result; progress/review state; coach adapting a plan. | Thrive availability can inform training load; sleep/recovery signals can shape a session; Aevo can give the other guides a grounded view of training demand and recovery. | Current testing/access status and TestFlight route; supported Apple devices/OS; account and age requirements; AI coaching; connected health/training sources; Apple Health/Garmin status; what is stored locally vs shared; not medical diagnosis, treatment, or injury care. |
| **Salus** | First check-in; journal entry or conversation; prompt selection; useful reflection; mood/pattern history; personalisation such as neurodivergence reflection if currently shipped. | Mood, energy and mental-load patterns can help Thrive shape a gentler day and Aevo match training to current capacity, without moving private journal text out of Salus. | Current testing/access status and TestFlight route; supported devices/OS; 18+ account; sensitive wellbeing-data handling; journals/reflections currently described as staying on the phone; optional neurodivergence data; deletion/export controls; not therapy, treatment, or crisis support. |
| **Thrive** | Today view containing tasks and commitments; assistant turning natural language into actions; routine builder; calendar/plan view; re-planned day; completed/progress state. | Commitments and capacity can help Aevo schedule training, Sage right-size learning and Wend suggest plans that fit the time actually available. | Current testing/access route; supported devices/OS; calendar/reminder integrations; AI processing; tasks, routines, and notes currently described as staying on the phone; offline behaviour, notifications, account and age requirements. |
| **Nura** | Financial overview; categorised spending/commitments; savings goal; scenario or plan; plain-language guide explanation; progress over time. Use representative/demo data only. | Thrive can supply upcoming commitments while goals in Telos or Wend give money decisions a purpose; Nura can add a realistic financial dimension to plans across Arbor. | Actual development/access state; supported devices/OS; manual entry vs bank connection/open-banking support; providers/territories; security and encryption; financial-data and AI processing; storage/deletion; pricing; not regulated financial advice or personal investment recommendations. |
| **Wend** | Preference/constraint input; personalised discovery set; place/activity detail; map or saved collection; assembled itinerary/day plan; completed or memory/progress state. | Thrive contributes free time, Nura a realistic budget, Kith who the plan is with, and Aevo useful activity context—turning generic inspiration into a plan that fits. | Actual development/access state; supported devices/OS; location access; booking/map/transport partners; geography and content coverage; pricing; storage/deletion; AI personalisation; whether the app books or only recommends. |
| **Kith** | People/relationship overview; individual context view; important-date/detail capture; a considerate nudge; connection plan; user-controlled completion/history state. Use fictional contacts and safe data. | Thrive can find time, Wend can suggest shared experiences, and Salus can add a sense of the user's social capacity so good intentions become timely, thoughtful connection. | Actual development/access state; supported devices/OS; contacts/calendar integrations; whether messages can be drafted or sent; notification controls; sensitive relationship-data storage/deletion; AI processing; age/account requirements; safeguarding and blocking controls if social discovery exists. |
| **Telos** | Values/strengths reflection; career question; option comparison; recommended next-step plan; working document or action; progress/review state. | Sage can support a skill gap, Thrive can make room for next actions, and Nura can add chosen financial constraints without turning Telos into financial advice. | Actual development/access state; supported devices/OS; document/profile imports; job-data sources; AI processing and storage; deletion/export; pricing; no guaranteed employment outcomes; boundaries around legal, financial, and professional advice. |
| **Sage** | Learning-goal setup; diagnostic/starting point; clear explanation; interactive practice; feedback/correction; knowledge/progress view. | Telos can supply a career direction, Thrive the time available to study, and the wider Arbor picture the reason learning matters—making each path more relevant and achievable. | Actual development/access state; supported devices/OS; source/citation behaviour; content or file imports; AI processing and storage; deletion/export; pricing; age/account requirements; academic-integrity positioning and limits of generated explanations. |

## Simulator review and screenshot checklist

For each app, complete the following before changing its page:

1. Record build/version, device, OS, account state, and any seeded/demo data used.
2. Walk the primary workflow from a clean or representative starting point.
3. Note the strongest differentiator, the “aha” moment, and any feature the current page overstates, understates, or omits.
4. Capture at least five purposeful states: orientation, input, guide/personalisation, core work, and result/progress. Prioritise screens that demonstrate the power of connected context.
5. Remove or avoid personal information, secrets, debug UI, notifications, and third-party data that cannot be published.
6. Save original-resolution PNGs under `public/images/apps/<app>/` with descriptive names. Keep originals; create web-optimised derivatives separately if required.
7. Log the screenshot filename, feature shown, intended page section, caption, alt text, and whether the screen is current or provisional.
8. Reconcile the walkthrough with the current roadmap, app-store/TestFlight status, data behaviour, policies, and page metadata before writing final claims.

## Per-app completion record

An app page is complete when:

- every shared-framework question is answered;
- simulator evidence supports the workflow and feature copy;
- all displayed screenshots are current, legible, purposeful, and safe to publish;
- the page has an individual storytelling rhythm without breaking the family system;
- practical and limitation copy has been checked;
- metadata and structured data match the visible page;
- mobile and desktop layouts, keyboard navigation, reduced motion, image loading, and contrast have been verified;
- the CTA matches actual access at the time of publication.

## Aevo review record

- **Reviewed experience:** representative seeded athlete profile on the iPhone simulator, October 2026.
- **Primary story:** goal and athlete context → joined-up programme → adaptive weekly decision → coached session → evidence-led progress review.
- **Strongest differentiator:** Aevo treats strength, running, conditioning, classes, recovery and programme phase as one coaching problem rather than separate workout libraries.
- **Important product behaviours:** missed sessions are explicit decisions; the pre-session coach check can ease, move or protect work; progress reads expose their evidence and can be corrected; athlete capabilities carry confidence rather than presenting every number as equally certain.
- **Current-page correction:** the old generic page understated the coach check, evidence model, programme structure and athlete profile, while its screenshots no longer represented the current product.

| File | Product proof | Page use |
| --- | --- | --- |
| `today-adaptive-plan.png` | Missed-session decision, today's work, weekly coaching read and multi-discipline schedule | Hero and adaptive-week promise |
| `program-overview.png` | Six-week All-round Base Block with running, strength, riding and full-body work | Programme story |
| `session-coach-check.png` | Build-phase context, coach check, exact exercises, loads and repetitions | Session detail and adjustment |
| `progress-coaching-read.png` | Coaching read, visible evidence, recent totals and capability status | Evidence-led progress |
| `athlete-profile.png` | Coaching focus, goals, current programme and confidence-labelled capabilities | Personalisation and use cases |

Publishable practical claims are intentionally limited to what the product currently confirms: Aevo is in testing on iPhone; an 18+ Arbor account is required; AI coaching is part of the experience; connected health and training metrics can add useful context; and Aevo is not diagnosis, treatment or injury care. Apple Health, Garmin and wider platform claims remain off the page until their current release status is separately verified.

## Salus review record

- **Reviewed experience:** representative seeded reflection history on the iPhone simulator, October 2026.
- **Primary story:** name the moment → choose a reflection mode → keep the source attached to an insight → revisit themes and model signals over time.
- **Strongest differentiator:** Salus combines very lightweight check-ins with free, prompted and adaptive guided reflection, then makes insights inspectable through their meaning, source, possible next step and evidence/freshness.
- **Important product behaviours:** a person can choose the depth of reflection; daily and themed guided journals coexist; insights remain linked to original writing; the personal model grows from check-ins, journals and optional questionnaires; assessments are explicitly presented as mirrors for patterns rather than clinical labels.
- **Current-page correction:** the old page did not explain guided journals, source-linked insights, evidence/freshness, the personal model or the breadth of optional reflection questionnaires.

| File | Product proof | Page use |
| --- | --- | --- |
| `home-overview.png` | Check-in, journal and talk entry points plus a new insight | Hero and orientation |
| `check-in.png` | Lightweight mood and energy input | First-step proof |
| `reflect-options.png` | Free, prompted and guided journals, check-in and conversation | Choice of reflection mode |
| `guided-journals.png` | Daily practices, adaptive deep dives and themed reflection | Guided-reflection differentiator |
| `journal-reflection.png` | Original writing, emotion/theme labels and a linked observation | Source-linked insight story |
| `insight-detail.png` | Meaning, words, possible next step, source and guide note | Inspectable insight |
| `insights-overview.png` | Monthly themes and recent emotions | Pattern review |
| `personal-model.png` | Plain-language model signal with score and wider signal map | Personalisation and model transparency |

Publishable practical claims are limited to confirmed product behaviour: Salus is in testing on iPhone; an 18+ Arbor account is required; journals and reflections stay on the phone; AI reflections can surface useful patterns; optional neurodivergence questionnaires can deepen personalisation; and Salus is not a therapist, treatment, diagnosis or crisis service.

## Thrive review record

- **Reviewed experience:** representative seeded schedule, projects, tasks and routines on the iPhone simulator, October 2026.
- **Primary story:** capture unstructured work → connect it to an area or project → commit a realistic day around routines and schedule → close or move what remains.
- **Strongest differentiator:** Thrive treats capacity, routines, calendar blocks, projects and life areas as one planning problem instead of presenting another isolated task list.
- **Important product behaviours:** the assistant accepts individual tasks, brain-dumps and longer plans; projects contain milestones and linked tasks; task context includes place, travel, priority, energy, estimate, schedule, repeat, area and project; routines can be daily or weekly; the evening review explicitly offers tomorrow, no date or done for every open item.
- **Current-page correction:** the old page did not explain life areas, milestones, task energy/estimate/location context, focused starts, the committed day plan or the end-of-day rescheduling workflow.

| File | Product proof | Page use |
| --- | --- | --- |
| `home-today.png` | Assistant guidance, today's one thing, projects kept in sight and next tasks | Hero and focus promise |
| `assistant-capture.png` | Natural-language task, brain-dump and longer-plan capture | Input workflow |
| `area-work-purpose.png` | Focus, project progress, task and routine in one life area | Organising model |
| `project-milestones.png` | Project progress, milestones and linked task | Project structure |
| `task-detail.png` | Location, labels, priority, energy, estimate, schedule, repeat, area, project and focus controls | Actionable task context |
| `routines-overview.png` | Daily and weekly routines, habits, progress and recovery-friendly streak language | Routine system |
| `calendar-day-plan.png` | Month/day calendar, day-plan controls and scheduled blocks | Realistic day planning |
| `evening-wrap-up.png` | Open-task decisions, day feeling and tomorrow planning | Adaptation and closure |

Publishable practical claims are limited to confirmed product behaviour: Thrive is in testing on iPhone; public beta access has not been announced unless supplied by remote app state; an 18+ Arbor account is required; tasks, routines and notes stay on the phone; AI assistance turns raw input into structure; and calendar, reminder and cross-app context strengthen realistic planning.

