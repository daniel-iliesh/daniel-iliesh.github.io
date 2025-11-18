# Hire Me / Quote Builder – Implementation TODO

## 1. Routing & Page Shell
- [x] Create `app/hire-me/page.tsx` that uses the global layout and navbar.
- [x] Decide on URL: `/hire-me` (match nav label and internal links).
- [x] Add a nav entry/button in `app/components/nav.tsx` pointing to `/hire-me`.
- [ ] Set page-level metadata (title, description, OG) consistent with other pages.

## 2. Feature Module Structure (src/features/hireme)
- [ ] Create `src/features/hireme/components/` folder for UI components.
- [ ] Create `src/features/hireme/state/` (or `store/`) for quote builder state.
- [x] Create `src/features/hireme/config/` or `constants.ts` for:
  - [x] Project types, base prices and timelines.
  - [x] Feature lists per project type and add-on prices.
  - [x] Complexity options and multipliers.
  - [x] Timeline rules & multipliers.
  - [x] Budget ranges and labels.
- [x] Create `src/features/hireme/types.ts` for TS types (ProjectType, Feature, QuoteState, etc.).

## 3. State Management & Price Logic
- [x] Decide on state strategy: local `useReducer`/`useState` vs. small custom store (similar to Pinia example but idiomatic React/Next).
- [x] Implement a `useQuoteBuilder` hook or `quoteStore` with:
  - [x] `currentStep` and navigation (`nextStep`, `prevStep`, `goToStep`).
  - [x] Step 1: `projectType`, `basePrice`, `baseTimeline`.
  - [x] Step 2: `selectedFeatures`, `featureAddOns` (sum of optional features).
  - [x] Step 3: `complexity`, `complexityMultiplier` with auto-suggestion logic.
  - [x] Step 4: `timeline`, `timelineMultiplier`, `estimatedWeeks`, `estimatedDelivery`.
  - [x] Step 5: `budgetRange`, `budgetMismatch`.
  - [x] Step 6: `contact` object (name, email, company, additionalInfo, agreeToTerms).
  - [x] Derived values: `subtotalBeforeComplexity`, `priceAfterComplexity`, `priceAfterTimeline`, `finalPrice`, `roundedFinalPrice`.
- [x] Implement the full price formula as per `Hire Me Page.md` and `Services.md`.
- [x] Implement dynamic timeline calculation (standard/rush/flexible/extended) based on project type, complexity and feature count.
- [x] Implement budget mismatch detection.

## 4. UI Components – Steps
Create reusable components under `src/features/hireme/components`:

- [x] **Step navigation / layout**
  - [x] `QuoteStepper` shell that renders the current step and controls navigation.
  - [x] Progress indicator ("Step X of 6").
  - [x] Live price summary panel (non-sticky version).

- [x] **Step 1 – Project Type**
  - [x] `ProjectTypeStep` with 4 cards: Landing page, SaaS dashboard, API/Backend, Full MVP.
  - [x] Disable Next until one type is selected.
  - [x] On select: update base price & base timeline in state.

- [x] **Step 2 – Features/Scope**
  - [x] `FeaturesStep` that renders conditional feature checklists based on `projectType`.
  - [x] Base features pre-checked and non-removable.
  - [x] Optional add-ons with prices; update `selectedFeatures` and `featureAddOns` in state.
  - [ ] Live update price summary.

- [x] **Step 3 – Complexity**
  - [x] `ComplexityStep` with three options, descriptions conditional on project type.
  - [x] Implement auto-suggestion of default complexity based on feature count & advanced flags.
  - [x] When user changes complexity, recalc multipliers and timeline.

- [x] **Step 4 – Timeline**
  - [x] `TimelineStep` that shows Rush / Standard / Flexible (+ optional Extended for MVP).
  - [x] Apply rules: hide Rush if standard timeline > 4 weeks, etc.
  - [x] Show derived weeks range and estimated delivery date.

- [x] **Step 5 – Budget**
  - [x] `BudgetStep` with predefined ranges + "Not sure yet".
  - [x] Auto-select suggested range based on calculated price.
  - [x] If user picks lower range, surface warning and set `budgetMismatch`.

- [x] **Step 6 – Contact**
  - [x] `ContactStep` form with validation and consent checkbox.
  - [x] Submit button wired to quote submission handler (client-side stub for now).

## 5. Validation & UX
- [ ] Implement per-step validation rules from `Hire Me Page.md`.
- [ ] Disable Next until current step is valid (except optional steps).
- [ ] Show inline error messages for invalid fields.
- [ ] Ensure keyboard accessibility for all interactive elements.
- [ ] Ensure appropriate ARIA labels for cards, stepper, and form fields.

## 6. Email / Backend Integration
- [ ] Decide on submission strategy:
  - [ ] Next.js route handler under `app/api/hire-quote/route.ts`, or
  - [ ] External email service (e.g. EmailJS, existing backend if any).
- [ ] Define `QuotePayload` DTO matching the state shape.
- [ ] Implement API route that:
  - [ ] Receives JSON payload.
  - [ ] Constructs email to YOU using conditional templates (budget mismatch vs aligned).
  - [ ] Triggers confirmation email to client (simple version first).
- [ ] Wire `submitQuote` in the client to POST to this API and handle loading/success/error states.
- [ ] Add basic server-side validation and spam protection (honeypot field or rate limiting, if needed).

## 7. Styling & Responsiveness
- [ ] Follow existing Tailwind utility patterns from `app/` components.
- [ ] Implement layouts for:
  - [ ] Mobile: stacked steps, sticky bottom price bar.
  - [ ] Tablet: two-column features grid.
  - [ ] Desktop: larger layout with sticky price sidebar and 2–3 column grids.
- [ ] Match overall visual style of site (fonts, colors, spacing).

## 8. Analytics & Tracking
- [ ] Reuse existing GA setup from `layout.tsx`.
- [ ] Add event helpers for:
  - [ ] `quote_step_1_project_type`, `quote_step_2_features`, …, `quote_step_6_submit`.
  - [ ] `quote_abandoned` when user leaves mid-flow (best-effort implementation).
  - [ ] `quote_completed` on successful submit.
- [ ] Ensure events are only sent in browser (guard with `typeof window !== "undefined"`).

## 9. Copy & Content
- [ ] Adapt copy from docs into concise UI text (headlines, descriptions, warnings).
- [ ] Ensure price values and multipliers match `Services.md` and `Prices.md`.
- [ ] Add disclaimers about estimates vs final proposal.

## 10. Testing & QA
- [ ] Implement test scenarios from `Hire Me Page.md` (3 main scenarios) manually.
- [ ] Check boundary cases: many features, complex MVP, no budget selected.
- [ ] Test on mobile, tablet, desktop.
- [ ] Verify email templates (subject lines, content) are correct.

## 11. Launch Checklist
- [ ] Add `/hire-me` to sitemap / SEO if needed.
- [ ] Verify nav and internal links to Hire Me page.
- [ ] Smoke test quote submissions in production-like environment.
- [ ] Monitor first real usage and adjust pricing/UX as needed.
