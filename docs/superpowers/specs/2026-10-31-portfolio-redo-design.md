# Portfolio site redo — design

Date: 2026-10-31. Aou chose "Data story scroll" and then said: build it all,
I'll review once at the end. So this records the calls made, for that review.

## Why

The first restructure kept the old 7,700-line stylesheet and the old brochure
layout. Aou's verdict: no Duck Dose-style features, and the UI and colours were
poor. Research on standout personal sites (Bruno Simon, Josh Comeau, Nadieh
Bremer, DataExpert.io, Luke Barousse) showed one pattern: the site itself
proves the owner's skill, and a clear ladder (free thing → product → call)
does the selling.

## Goals

- Within one scroll, a visitor sees a BI analyst work alongside AI on real data,
  from question to decision (the Core idea in `CONTEXT.md`).
- Duck Dose-style play: things to try, not read (Playground, Echo demo, games),
  plus collectibles (6 North Stars hidden across the site).
- The site sells: free (Playground, free SQL lesson, articles) → Blueprint
  (course) → Done-for-you / consulting call.
- Looks like it was made by someone who designs dashboards for a living.
- TH and EN for every visible text.

## Non-goals

- No backend, no live LLM, no API keys. Echo is a scripted demo whose answers
  are computed in the browser from the real sample data.
- No new fake stats (client counts, ratings, response times were removed).
- The SQL lesson player (`courses/course-sql-lesson.html`) is not redesigned;
  it keeps its own stylesheet.

## Anti-goals

- Template look: identical cards everywhere, ALL-CAPS eyebrows, emoji, a
  dark theme.
- Claims that the data can't back.

## Design system (my calls)

- Colours: cream page `#F7EFD6`, raised paper `#FFFBF0`, navy ink `#14305F`,
  deep navy `#0E2347`, gold `#C99A2E` (marks and accents only), gold text
  `#7A5A12`, muted `#4F5D7A`, rule `#E3D6B4`.
- Type: Kanit (headings), IBM Plex Sans Thai (body, tabular figures), Prompt
  (buttons, nav). Same set as Duck Dose, as Aou asked.
- Signature: the Me/AI mark. Filled navy dot = me, gold ring = AI. Used on every
  story step and Work item.
- One bold element: the homepage hero. 24 months of hotel RevPAR as dots that
  settle into the Great Bear and point at the North Star (the metric). Every
  other surface stays quiet.
- Icons: inline Lucide-style line icons, no emoji, no Font Awesome.

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Hero + the data story (6 chapters) + Work highlights + ladder + contact |
| Work | `projects.html` | Filterable: NorthBear / Day job / Personal, each with Me/AI split |
| Playground | `playground.html` | Echo demo, Spot the misleading chart, Pick the metric, Data health check |
| Learn | `courses.html` | Blueprint (waitlist), free SQL / Excel / Power BI outlines |
| Work with me | `services.html` | Done-for-you setup (from $499), dashboards and data health check by quote |
| Writing | `blog.html` + `blog-stock-data-pipeline.html` | Articles (Medium) |
| About | `about.html` | Story, timeline, skills, education |

Old course detail pages (`courses/course-excel|powerbi|sql.html`) redirect to
their section on Learn.

## The data story (homepage)

Data: Phra Nang House, the fictional hotel used in both NorthBear products,
aggregated from `northbear-blueprint/starter-pack/phra_nang_house.xlsx` into
`assets/nb/data.js` (last 24 months, monthly + 12-month splits).

1. The question: "We sell more rooms, so why isn't more money left over?"
2. The data: a messy export becomes a clean table (AI drafts the cleaning,
   I check that totals reconcile).
3. The model: one fact table, four dimensions.
4. The trend: RevPAR, this year against last year.
5. The leak: OTA commission, ฿2.69M = 10.7% of room revenue in 12 months.
6. The decision: a slider that moves OTA bookings to direct and shows the
   yearly saving (assumes direct bookings cost 3% in perks).

## North Stars (collectibles)

Stored in localStorage only. Earned by: finishing the story, using the
decision slider, asking Echo a question, finishing the chart game, finishing
the metric quiz, finishing the health check. A counter sits in the header.

## Calls made without Aou (check these)

- Blueprint shown as "launching soon" with a notify-me form, no price.
- Old fixed THB dashboard packages replaced by Done-for-you from $499
  (from `context/business.md`) and "by quote" for dashboards/pipelines.
- Default language English (Blueprint market is global); TH one click away.
- Personal Work rows show no Me/AI split yet: I don't know which of them used
  AI, so I didn't guess. Aou to say; then each row gets its split.
- Old pages are kept in `archive/pre-redo-2026-10/` (and the unused
  `bi-ai.css`). The old `assets/css/` stylesheets stay only because the SQL
  lesson player still uses them.
- The article date was dropped (the old page said Jan 2025, the list said
  Nov 2025); the list keeps Nov 2025.

## Second pass (2026-10-31): "make first-time visitors go wow"

Aou's feedback on the first build: too ordinary, pages not well proportioned.

**The one bold thing: the data field.** Every dot on the homepage is one room
night Phra Nang House (fictional) sold in the last 12 months: 7,169 dots, built
from `assets/nb/nights.js` (rooms sold and average rate per night per channel,
generated from `northbear-blueprint/starter-pack/phra_nang_house.xlsx`). The same
dots change shape as you scroll:

| Where | Shape |
|---|---|
| Hero | the Great Bear pointing at a gold North Star, "Net RevPAR" |
| Step 1 | one sunflower of all 7,169 nights |
| Step 2 | a calendar: one square per night, one dot per room (out of 30) |
| Step 3 | five discs, one per booking channel |
| Step 4 | twelve month columns, dashed mark = same month last year |
| Step 5 | channel bands; red pile = commission counted in room nights (769) |
| Step 6 | the slider moves dots to Direct and turns commission green |

Pointing at a dot shows its real night, channel and rate. Clicking the hero sky
sends a ripple. On phones the picture is pinned on top and the text scrolls under
it. Reduced motion: dots jump between shapes with no animation.

**Proportions.** Bigger type scale; every page head and section head is two
columns (title left, text on the title's baseline right); chart-paper grid
behind page heads; wider page; a closing footer line on every inner page.

**Calls made without Aou (second pass):**
- Commission shown as room nights: commission per channel ÷ that channel's average rate (sold × commission %), about 769.
- Kept the cream palette (memory: no dark backgrounds) and put the wow in motion and scale instead of a dark night sky.
- Dropped the separate RevPAR line chart and channel bar chart; the dots replace them, with a table toggle on step 4.

## Third pass (2026-10-31): galaxy theme

Aou asked for a galaxy colour theme. This deliberately replaces the cream
"almanac" look for this site (it reverses the earlier cream-only preference,
which was about marketing visuals).

- Sky `#060A1C`, cards `#0E1530`, starlight ink `#DCE3FF`, headings warm white
  `#F7F2E4`, North Star gold `#F0B93E` (gold text `#F3C969`), good `#62D3A2`,
  bad `#FF8573`. All set as tokens at the top of `assets/nb/nb.css`; a "Galaxy
  layer" block at the end adds the nebula, a fixed starfield and dark fixes.
- In the hero the 7,169 dots glow and add up like real stars; in the charts
  they stay crisp so the numbers stay readable.
- Primary buttons are starlight with dark text; gold buttons stay gold.

## Fourth pass (2026-11-01): make the story sell what NorthBear sells now

Review question from Aou: is the hotel story the right first example? Finding:
it shows the BI craft well, but (1) Echo, the Blueprint product, was missing
from it, (2) the first thing a visitor saw was made-up data with real proof far
below, (3) it ended on the hotel owner rather than the buyer. Aou chose to fix both.

- **Real results strip** right under the hero, saying plainly that the hotel is
  made up and these are not: 500+ hotels in one view and 30% faster loads
  (Minor Hotels), 100% data accuracy up from 80% (Predictive), 90% raw data
  accuracy up from 60% (DHL). CV-level facts only.
- **Step 5 is Echo answering the owner's next question** ("where is the money
  going?") with the number, the SQL and the result rows (1,825 source rows of
  fct_nightly). Step 6's what-if is framed as the owner's next question to Echo.
- **The story ends on the Blueprint line**: "A dashboard answers the first
  question. Echo answers the next five." with "Build your own Echo" (gold) and
  "Have me set it up, from $499".
- Calls made: the Echo SQL is illustrative of the model in step 3, not copied
  from the Blueprint code; the AI box in steps 5 and 6 is now labelled "Echo".
