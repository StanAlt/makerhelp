# MakerHelp — Claude Code Instructions

## Project

Next.js 14 (App Router) · Supabase · Tailwind CSS · TypeScript
Two-sided marketplace: equipment owners book paid video sessions with vetted laser engraving experts.

---

## Before writing any UI code

1. Read `docs/BRAND.md` completely. It is the single source of truth for all visual decisions.
2. Check `src/styles/brand.css` for available CSS custom properties.
3. Check `tailwind.config.ts` for brand-extended Tailwind tokens.
4. Import components from `src/components/brand/LogoMark.tsx` for any logo/wordmark usage.

---

## Non-negotiable design rules

- **Dark theme only.** Page bg = `--charcoal` (#0D1710). Card surfaces = `--charcoal`. Section surfaces = `--forest` (#1B3D2A).
- **Never use white (#fff).** Ivory (`--ivory` / `#F5F0E8`) only.
- **Fonts: Outfit (UI), Cormorant Garamond (display/brand), JetBrains Mono (labels/badges).** Never Inter, Roboto, or system-ui as primary fonts.
- **Ember orange (`#FF4D1A`) is reserved for: primary CTA buttons, the right side of the logo M, and active/selected states.** One ember element per view section. Never use ember decoratively.
- **Amber (`#E8900A`) is for ratings and stars only.** Never mix amber and ember on the same element.
- **No drop shadows.** Use `1px solid var(--steel)` borders instead.
- **Border radius:** 2px (badges), 4px (buttons/inputs), 8px (cards), 12px (large containers).
- **The expert card has a 2px ember top accent line** (`border-top: 2px solid var(--ember)`). This is the only place a 2px border appears.
- Read `docs/BRAND.md` → Anti-patterns section before writing any new component.

---

## Font loading

Fonts are declared in `src/app/layout.tsx` using `next/font/google`. CSS variables are:
- `--font-cormorant` — Cormorant Garamond
- `--font-outfit` — Outfit  
- `--font-jetbrains` — JetBrains Mono

Tailwind aliases: `font-display`, `font-ui`, `font-mono` (configured in `tailwind.config.ts`).

---

## Component locations

```
src/components/
  brand/
    LogoMark.tsx      ← LogoMark, Wordmark, NavBrand exports
  ui/
    Button.tsx        ← btn-primary, btn-secondary, btn-ghost
    Badge.tsx         ← badge-expert, badge-vetted, badge-new, badge-live
    ExpertCard.tsx    ← The expert booking card
    Input.tsx         ← Form inputs with ember focus state
    Nav.tsx           ← Top navigation bar
```

---

## Auth & routing

- Supabase SSR auth via `@supabase/ssr`
- Roles: `expert` | `learner` — stored in `profiles` table
- Route protection via middleware (`src/middleware.ts`)
- Post-login routing: experts → `/dashboard/expert`, learners → `/dashboard/learner`
- Onboarding role selection → `/onboarding`

---

## Key environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
WHEREBY_API_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY   ← pending
STRIPE_SECRET_KEY                    ← pending
STRIPE_WEBHOOK_SECRET                ← pending
STRIPE_CONNECT_CLIENT_ID             ← pending
```

---

## Build check

Run `npm run build` after any significant change. Zero tolerance for TypeScript errors.
