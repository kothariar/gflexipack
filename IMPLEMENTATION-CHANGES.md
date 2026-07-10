# G Flexipack — Changes to Implement

**Source of truth (new design):** `gflexipack-standalone_9.html` (single-file SPA)
**Target (current live site):** the deployed Eleventy multi-page site (`src/` → `_site/`)
**Goal:** update the live site so it matches the new design.
**Date compiled:** 2026-07-09

## Legend
- **TEXT** = copy change (headline, body, label, number)
- **DESIGN** = spacing, section added/removed/reordered, tag/heading change, new component
- Each item lists the **file to edit** in `src/`.

## Decisions locked (from review)
1. ✅ **Real client names/logos are approved** — implement the named-brand clientele as-is.
2. ✅ **New numbers are verified** — update `60,000+ sq ft`, `250+ tons/month`, `MOQ 500kg` everywhere.
3. ✅ **Keep the FAQ** on the Quality page — this is the ONE place we deviate from the new design: the standalone drops the FAQ + FAQ schema, but we are **keeping** them.

---

## 0. Global number changes (do this first)

These values are templated from `src/_data/site.json` and reused across many pages. Change them once here and most pages update automatically.

**File: `src/_data/site.json`**

| Key | Current (live) | New (verified) |
|---|---|---|
| `moq` | `5,000 units` | `500kg` |
| `capacity` | `300+ MT / month` | `250+ tons / month` |
| `plantSize` | `8,000 sq ft` | `60,000+ sq ft` |
| `description` (meta) | "…300+ MT/month capacity." | update to "…250+ tons/month capacity." |

**Also hardcoded — search & replace separately (not templated):**
- `src/_data/products.json` — every product `metaDescription` contains **"MOQ 5,000"** → change to **"MOQ 500kg"** (13 entries).
- Any place that literally prints `8,000 sq ft`, `300+ MT`, or `5,000 units` in a template rather than via `site.*` (e.g. the Infrastructure headline and the home ticker — see §1). Verify each after the site.json change; if the number is hardcoded, edit it in the template.
- Drop the **"FOB Mundra / CIF"** clause from the inquiry terms line and product CTA terms line (see §1 and §2).

---

## 1. HOMEPAGE — `src/index.njk`

**No change:** Nav, Hero, Vision/Mission, Products carousel, Industries accordion.

| Section | Type | Change |
|---|---|---|
| Meta bar ("At a glance") | TEXT | Middle stat `From 5,000 units` → `500kg` (drop the "From" prefix) |
| About-teaser | DESIGN | Section id `about` → `about-teaser` |
| About-teaser | TEXT | Rewrite lead paragraph → "G Flexipack is a Bharuch-based flexible packaging manufacturer producing custom-printed pouches for food, beverage, pharma, personal care, agrochemical, industrial and household brands — 13 formats, printed, laminated and converted under one roof." |
| Ticker divider | TEXT | `300+ MT a month` → `250+ tons a month`; `8,000 sq ft` → `60,000+ sq ft` |
| Products-teaser | DESIGN | id `products` → `products-teaser`; remove inline `padding-bottom:30px` on inner `.sec` |
| Industries-teaser | DESIGN | id `industries` → `industries-teaser` |
| Infrastructure | TEXT | Headline `8,000 sq ft in Bharuch, Gujarat.` → `60,000+ sq ft in Bharuch, Gujarat.` |
| Why-us | DESIGN | Card glyphs change from roman numerals (i–vi) to emoji: 🛡️ 🚚 🎯 ⚙️ 🧑‍🏭 ♻️ — add `aria-hidden="true"` to each glyph span |
| **Clientele** | DESIGN + TEXT | Replace the 8 anonymized text badges with the ~22 real named-brand logo badges (see list below). Change note text: "Client identities protected under supply agreements — references available on request." → **"Trusted by 200+ Indian brands across agrochemical, food, pharma and FMCG — a few of the names we pack for."** |
| **Certification teaser** | DESIGN | **Remove** the entire `.certs #certifications` section (ISO / ASTM / Recyclable emblems + "Inside our quality lab" CTA) |
| Section order | DESIGN | Reorder to: Infrastructure → **Why-us → Clientele** → Inquiry (why-us and clientele swap; certs removed) |

**Clientele named brands (approved):** Mahindra Agri Solutions, Jagdish Farsan & Chemical, Hindalco, ADAMA India, Insecticides (India) Ltd, Tea Post, DCM Shriram, Heranba Industries, Indofil, Dhanuka Agritech, Ajanta Pharma, Meghmani, Zydex, Hanuram, Shanmukha Aggrotech, United Biotech, Euro Foods, Amul, Sumul, Kerala Cashew Corporation — plus text badges "Mass Enterprise" and "Al Zahidi Dates & Chocolates". (Logo images sourced from the standalone file's embedded assets.)

### Inquiry form — `src/_includes/partials/inquiry-form.njk`
| Type | Change |
|---|---|
| TEXT | Quantity placeholder `e.g. 25,000 units` → `e.g. 500kg` |
| DESIGN | Remove the **Plant address row** from the sidebar (5 rows → 4) |
| TEXT | Terms line `MOQ 5,000 units · 30/70 payment · 3–5 weeks lead · FOB Mundra / CIF` → `MOQ 500kg · 30 / 70 payment · 3–5 weeks lead` (drop the FOB/CIF clause) |

### Footer — `src/_includes/partials/footer.njk`
| Type | Change |
|---|---|
| TEXT | Add **"Blog"** link to the Company column (after "Quality & certifications") |

---

## 2. PRODUCTS — `src/products/index.njk`, `src/products/product.njk`, `src/_data/products.json`

### Products index (`src/products/index.njk`)
| Type | Change |
|---|---|
| TEXT | H1 `Thirteen formats, printed to spec.` → `Custom-printed pouches, in thirteen formats.` |
| TEXT | Rewrite intro → "Custom-printed flexible pouches for food, beverage, pharma, personal care, agrochemical, industrial and household brands — engineered to your dimensions, laminate structure and barrier level, printed in up to 8-colour rotogravure and converted in-house in Bharuch, Gujarat. MOQ from 500kg." |

The 13 cards themselves = **no change**.

### Product detail template (`src/products/product.njk`) — applies to all 13 pages
Per-product copy (features, structures, apps, closures, glance counts) is **identical** — no product-specific text changes. All changes are in the shared template:

| Type | Change |
|---|---|
| TEXT | Glance "Min. order" `5,000 units` → `500kg` (via `site.moq`) |
| DESIGN | Remove the glance **"Shipping: FOB Mundra / CIF"** row (6 items → 5) |
| DESIGN | Remove the structure-section footnote: "Not sure which structure fits? Send your product — we recommend a build within 24 hours." |
| DESIGN | Remove the standalone **"Applications / Product market"** `.sec` section and fold its chips **into** the dark structure section as an inline block (`.pp-market-inline`). Eyebrow becomes "Commonly packed products"; drop the H2 title. Chip content unchanged. |
| TEXT | CTA terms line: drop `· FOB Mundra / CIF`; MOQ → `500kg` |

---

## 3. INDUSTRIES — NO CHANGES

Index + all 7 sector pages (Food, Beverages, Pharma, Personal Care, Agrochemical, Household, Industrial) are **identical** in the new design. Nothing to port.

---

## 4. ABOUT — `src/about.njk`

| Type | Change |
|---|---|
| TEXT | Eyebrow `Our company` → `About G Flexipack · Bharuch, Gujarat · Est. 2016` |
| TEXT | Headline `Quality packaging, since 2016.` → `The pouches behind India's everyday brands.` |
| TEXT | Replace single intro paragraph with **two leads**: (1) "For nearly a decade, G Flexipack has quietly manufactured the flexible packaging that carries India's food, medicine, harvest, and homes — from D2C launches on Mumbai shelves to pharma sachets in rural clinics to agrochemicals on Gujarat farms." (2) "One roof. Thirteen pouch formats. Seven industries. Every pouch printed, laminated and converted in-house at our Bharuch facility." |
| DESIGN | **Remove** the Vision/Mission block from About (it stays on the home page only) |
| DESIGN | **Add new section** "Built for brands that can't afford compromises." — 5 feature cards (`.pp-features`):<br>🏭 One-roof manufacturing · 📏 13 formats, one call · 🧪 Compliance-ready films · ⚡ Growth-friendly MOQs · 🎨 Print that sells |
| DESIGN | **Add new section** "Four values, one standard." — 4-panel values grid: Precision · Partnership · Pace · Proof |
| DESIGN | Why-us glyphs roman → emoji (same as home) |

**New About section order:** intro → "Built for brands…" features → "Four values…" → why-us → CTA band.

### New section copy — "Built for brands that can't afford compromises."
- 🏭 **One-roof manufacturing** — "Print, laminate, convert — every step happens under our supervision. No vendor chains, no quality drift."
- 📏 **13 formats, one call** — "From stand-up pouches to retort packs to spouted formats — you don't need multiple suppliers."
- 🧪 **Compliance-ready films** — "Food-grade, pharma-approved, agrochemical-tough. The right barrier for the right shelf."
- ⚡ **Growth-friendly MOQs** — "Whether you're launching or scaling, we make it work — without dropping standards."
- 🎨 **Print that sells** — "Rotogravure precision, consistent shade-matching, artwork that survives the supply chain."

### New section copy — "Four values, one standard."
- **Precision** — "Every micron, every millimetre, every registration mark — measured and matched."
- **Partnership** — "We treat your pouch like a product, not a purchase order — we stay in the loop."
- **Pace** — "From artwork approval to airtight pouch — we own every step."
- **Proof** — "Quality-checked, shade-verified, seal-tested — if it doesn't meet the standard, it doesn't ship."

---

## 5. QUALITY — `src/quality.njk`

Lab ("Eight tests. Every batch."), Anatomy ("Inside the film"), cert emblems, CTA, and the `#filmStack` scroll interaction are **word-for-word identical** — no change.

| Type | Change |
|---|---|
| — | ✅ **KEEP the FAQ section + FAQPage JSON-LD** (decision: we deviate from the standalone here — do NOT remove it) |

**Net result: Quality page needs NO changes.**

---

## 6. BLOG — NEW PAGE (create `src/blog.njk` → `/blog/`)

No live equivalent exists. Create a placeholder/"coming soon" page. Only reachable via the new footer link (not added to primary nav).

- Breadcrumb: `Home / Blog`
- Eyebrow: `Insights`
- Headline: `Notes on packaging, print and film.`
- Lead: "We're building out a library of notes on laminate structures, MOQs, print finishes and what it takes to launch a pouch from spec to shelf. Check back soon — or send us a question and we'll cover it."
- CTA (ghost): `Ask us a question →` → inquiry
- Page `<title>`: "Blog — Packaging Insights | G Flexipack"
- Add to sitemap.

---

## Summary of files to touch

| File | Why |
|---|---|
| `src/_data/site.json` | moq, capacity, plantSize, description numbers |
| `src/_data/products.json` | "MOQ 5,000" → "MOQ 500kg" in 13 meta-descriptions |
| `src/index.njk` | meta bar, about-teaser, ticker, ids, why-us glyphs, clientele, remove certs, reorder |
| `src/_includes/partials/inquiry-form.njk` | placeholder, remove plant row, terms line |
| `src/_includes/partials/footer.njk` | add Blog link |
| `src/products/index.njk` | H1 + intro |
| `src/products/product.njk` | glance shipping row, footnote, applications relocation, terms line |
| `src/about.njk` | eyebrow/headline/lead, remove V/M, add 2 new sections, glyphs |
| `src/quality.njk` | **no change** (keep FAQ) |
| `src/blog.njk` (new) | new placeholder page + sitemap |
| `src/industries/*` | **no change** |
