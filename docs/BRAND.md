# MakerHelp Brand System

> Claude Code: Read this before building any UI component, page, or layout.
> This is the single source of truth for visual decisions. Never deviate without a comment explaining why.

---

## Aesthetic Direction

**Tone:** Expert workshop. Dark, premium, grounded — not startup-playful, not corporate-sterile.
**Differentiation:** The only marketplace in this space that looks like it was designed for serious makers. Feels like walking into a well-equipped studio, not a course platform.
**What users remember:** The ember orange spark on a deep forest green field. The serif/sans contrast. The editorial feel.

---

## Color Tokens

All colors are defined in `src/styles/brand.css` as CSS variables and in `tailwind.config.ts` as named keys.
**Always use token names, never raw hex values in components.**

| Token | Hex | Role |
|---|---|---|
| `--ember` | `#FF4D1A` | Primary CTA, accents, logo right-stroke. Use sparingly — one ember element per view. |
| `--ember-light` | `#FF7A4D` | Ember hover state |
| `--ember-dark` | `#CC3600` | Ember active/pressed state |
| `--forest` | `#1B3D2A` | Logo bg, card surfaces, primary surface. The dominant brand color. |
| `--forest-mid` | `#2A5C3F` | Hover states, secondary surfaces |
| `--forest-light` | `#3D7A57` | Borders on forest bg, tertiary surfaces |
| `--charcoal` | `#0D1710` | Page background, nav |
| `--midnight` | `#060D09` | Deepest bg, footer |
| `--steel` | `#3A4F44` | Dividers, borders, muted elements |
| `--sage` | `#7BA893` | Secondary text, supporting copy, muted UI |
| `--ivory` | `#F5F0E8` | Primary text on dark, light backgrounds |
| `--ivory-dim` | `#E3DDD4` | Ivory hover, slightly dimmed text |
| `--amber` | `#E8900A` | Ratings, stars, warnings — never mix with ember on same element |
| `--amber-light` | `#F5B030` | Amber hover |

### Semantic color rules
- **1 ember element per view.** If you're using ember on a button, don't also use it on a badge in the same card.
- **Forest is the surface.** Cards, modals, sidebars — forest green, not white, not gray.
- **Ivory, not white.** Never `#ffffff` for text or backgrounds. Always `--ivory`.
- **Amber for ratings only.** Stars, score displays, review accents.

---

## Typography

Fonts are loaded via `next/font/google` in `src/app/layout.tsx`. Never use `@import` for fonts.

| Role | Family | Weight | Usage |
|---|---|---|---|
| Display / Brand | Cormorant Garamond | 500 (regular+italic) | Hero headings, pricing display, section titles, the wordmark |
| UI / Body | Outfit | 300, 400, 500, 700 | All interface text, buttons, labels, body copy |
| Mono / Labels | JetBrains Mono | 400, 500 | Badges, tags, data labels, code, technical metadata |

### Typography rules
- **Cormorant italic in ember** is a brand signature. Use it for the hero "emphasis" word and in the logo. Don't overuse.
- **Outfit 700** for UI headings and button text. **Outfit 300** for supporting body copy.
- **JetBrains Mono** for any badge, tag, data label, or mono metadata — never Outfit for these.
- **Never use Inter, Roboto, system-ui** as font fallbacks beyond the CSS stack. The declared fonts always load.

### Type scale
```
Display:  60px / CG 500 / tracking -0.02em / lh 1.0
H1:       36px / Outfit 700 / tracking -0.01em / lh 1.15
H2:       24px / Outfit 600 / lh 1.25
H3:       18px / Outfit 600 / lh 1.35
Body:     15px / Outfit 400 / lh 1.75
Caption:  13px / Outfit 300 / lh 1.65
Label:    11px / JetBrains Mono 500 / tracking 0.12em / UPPERCASE
```

---

## The Logo Mark

Import from `src/components/brand/LogoMark.tsx`.
The M is split: left stroke (ivory or forest) = the maker. Right stroke (ember) = the help. Spark dot at apex = the moment of connection.

```tsx
// Variants: 'dark' | 'forest' | 'light'
<LogoMark variant="dark" size={44} />
```

### Wordmark
```tsx
<span className="font-display text-2xl font-medium tracking-tight">
  <span className="text-ivory">Maker</span>
  <span className="text-ember italic">Help</span>
</span>
```

---

## Spacing Scale

```
4px   — micro (icon gap, tag internal)
8px   — tight (within a component row)
12px  — inner (card internal padding unit)
16px  — base (standard gap between elements)
24px  — group (between related components)
32px  — section-inner (within a section)
48px  — block (between major blocks)
64px  — page (section padding, hero spacing)
96px  — hero (top-level section separation)
```

---

## Border Radius

```
2px  — tags, badges, mono elements (sharp, intentional)
4px  — buttons, inputs, small elements
8px  — cards, modals, panels
12px — large containers, image frames
```

Never use `rounded-full` on rectangular elements. Pills only for toggle chips.

---

## Component Patterns

### Buttons
```tsx
// Primary — ember fill, white text. One per primary action per view.
<button className="btn-primary">Book a Session</button>

// Secondary — transparent, ivory border
<button className="btn-secondary">Browse Experts</button>

// Ghost — no border, sage text, hover to ivory
<button className="btn-ghost">View all →</button>
```

### Badges
| Type | Style |
|---|---|
| Expert | Ember 15% bg, ember text, ember 25% border, mono 11px |
| Vetted | Forest-mid bg, sage text, steel border, mono 11px |
| New | Amber 15% bg, amber text, amber 25% border, mono 11px |
| Live | Ember 8% bg, ember text, pulsing ember dot prefix |

### Cards (Expert card)
- Background: `--charcoal` (not forest — the card sits on a forest surface)
- Border: `1px solid var(--steel)`
- Border radius: `8px`
- Top accent: `2px solid var(--ember)` on the top edge (not all sides)
- Avatar: `48px` circle, forest-mid bg, ember initials text in Cormorant
- Price display: Cormorant 26px 500, not Outfit
- Book button: full-width, ember fill, white text, no border-radius variance

### Inputs
- Background: `--charcoal`
- Border: `1px solid var(--steel)` → `var(--ember)` on focus
- Border radius: `4px`
- Font: Outfit 14px 400, ivory text, sage placeholder

### Nav
- Background: `--charcoal`
- Border-bottom: `1px solid var(--steel)`
- Height: `60px`
- Logo: Cormorant wordmark (see above)
- Links: Outfit 14px, sage default, ivory active
- CTA: ember fill button, no outline

---

## Motion

```
Standard ease:   cubic-bezier(0.4, 0, 0.2, 1) — 200ms  (hover states, color transitions)
Spring entry:    cubic-bezier(0.34, 1.56, 0.64, 1) — 400ms  (modals, cards entering)
Fade:            opacity 0→1, 150ms ease-out  (tooltips, overlays)
```

Never animate layout (width, height, top, left). Only `transform` and `opacity`.

---

## Anti-patterns — Never Do These

- ❌ White backgrounds (`#fff` or `bg-white`) — use ivory or charcoal
- ❌ Purple, blue, or teal as accent colors — ember and amber only
- ❌ Inter or system fonts — always Outfit / Cormorant / JetBrains Mono
- ❌ Rounded-full on card or panel shapes
- ❌ Multiple ember elements in the same view section
- ❌ Gradient backgrounds — flat surfaces only (exception: the ember radial glow on hero only)
- ❌ Mixing amber and ember in the same component
- ❌ Gray backgrounds — always charcoal, forest, or midnight
- ❌ Generic "card shadow" drop shadows — use border instead
- ❌ Uppercase in Outfit font — only JetBrains Mono labels get uppercase

---

## File Map

```
src/
  app/
    layout.tsx          ← Font declarations live here (next/font/google)
    globals.css         ← @tailwind directives
  styles/
    brand.css           ← CSS custom properties (import in layout.tsx)
  components/
    brand/
      LogoMark.tsx      ← SVG logo, all variants
    ui/
      Button.tsx
      Badge.tsx
      ExpertCard.tsx
      Input.tsx
      Nav.tsx
docs/
  BRAND.md              ← This file (you are here)
tailwind.config.ts      ← Brand tokens wired into Tailwind
```
