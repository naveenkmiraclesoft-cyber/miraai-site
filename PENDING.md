# miraAI landing page — content pending (to be filled later)

Placeholders deliberately left blank until the owning stakeholders provide inputs.
Not a defect: the live page ships fully functional with qualified, non-fabricated copy.

## To be filled later

1. **Approved product evidence**
   Customer outcomes, quantified metrics, case-study numbers, compliance certifications, and SLA figures. Until provided, all claims remain qualifier-led ("designed to support…", "confirmed during solution design") and no numbers are invented.

2. **Executive-briefing scheduling URL**
   All primary CTAs currently resolve to https://www.miraclesoft.com/contact. When an approved scheduling link exists, update `briefingUrl` in `src/content.js` (single source of truth) and rebuild.

3. **Native-language review**
   `fr/`, `de/`, `ja/`, and `zh-Hans/` are draft translations. Each non-English page carries a visible `translation-note` banner until a native reviewer signs off, matching the `draft` field in `src/content.js`.

4. **English copy sign-off**
   English copy awaits final approval by an authorized C-suite stakeholder.

5. **Autonomous-demo copy**
   The hero pipeline simulation, theater scenarios, and controls in all five locales (`demo` block in `src/content.js`) are drafted but not yet reviewed by owners for accuracy (e.g., claim wording, scenario realism). Translations likewise await the native reviewers in item 3. The demos are data-decoration, not fabricated evidence — no metrics are claimed.

## Where this lives

- Every built page (all 6 routes) contains an HTML `<head>` comment listing the pending items, generated from `common.pending` in `src/content.js`.
- `npm run validate:site` fails if any page is missing that comment, so the note cannot silently disappear.

## How to clear an item

Update the relevant content in `src/content.js`, remove the entry from `common.pending`, run `npm run build` + `npm run validate:site`, commit, push. CI + GitHub Pages deploy automatically.