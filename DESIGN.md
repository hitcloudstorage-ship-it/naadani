# Design Brief

## Direction

Naadani.in — Warm, playful baby products store for Indian parents. Innocent wonder, accessible, home-like.

## Tone

Friendly, approachable, trustworthy — soft pastel playfulness balanced with professional care and product clarity.

## Differentiation

Warm cream + rose pink + mint green palette creates a non-generic, culturally-resonant baby brand identity distinct from cold corporate commerce.

## Color Palette

| Token      | OKLCH            | Role                            |
| ---------- | ---------------- | ------------------------------- |
| background | 0.96 0.015 75    | Warm cream base                 |
| foreground | 0.18 0.03 50     | Deep brown text                 |
| card       | 0.99 0.01 75     | Off-white card surfaces         |
| primary    | 0.55 0.18 330    | Rose pink (CTAs, badges)        |
| accent     | 0.65 0.14 150    | Mint green (secondary actions)  |
| muted      | 0.92 0.02 75     | Light beige (secondary content) |
| border     | 0.88 0.025 75    | Soft taupe dividers             |

## Typography

- Display: Bricolage Grotesque — warm, rounded geometry for headings and hero text
- Body: DM Sans — clean, friendly sans-serif for product descriptions and UI labels
- Scale: hero `text-5xl md:text-7xl font-bold`, h2 `text-3xl md:text-4xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth

Soft card layering with subtle shadows (`shadow-xs` to `shadow-md`) on product cards and modals. No harsh drop shadows — all surfaces feel warm and approachable.

## Structural Zones

| Zone    | Background            | Border          | Notes                              |
| ------- | --------------------- | --------------- | ---------------------------------- |
| Header  | cream (0.96 0.015 75) | mint divider    | Sticky, white/cream with icon nav  |
| Content | background (0.96)     | —               | Alternating card sections          |
| Footer  | cream (0.92)          | taupe (0.88)    | Trust signals, links, newsletter   |

## Spacing & Rhythm

Spacious layout with breathing room — 1.5rem gaps between sections, 1rem padding inside cards. Micro-spacing (0.5rem) between icon + label in UI elements.

## Component Patterns

- Buttons: Rose pink primary, mint accent, rounded (full pill for small, `rounded-lg` for normal). Subtle hover lift and color shift.
- Cards: `rounded-xl` (12px), soft shadow, cream background, hover: slight scale + shadow increase.
- Badges: Rounded pill (full), primary/accent palette swap, small text label.
- Forms: Light beige input (`0.92`), rose pink focus ring, clear labels.

## Motion

- Entrance: Fade + 50ms stagger on product grid. Cart icon pulse on add. Checkout slide-in from bottom on mobile.
- Hover: Cards scale 1.02 + shadow lift. Buttons shift color. Links underline with mint accent.
- Decorative: Floating icons in hero, gentle page transitions. No bouncy animations.

## Constraints

- No dark mode for MVP — light mode only, warm pastels throughout.
- Max 3 colors per UI region. Badges and accent elements use mint/primary only.
- No arbitrary borders — use soft taupe dividers or shadows for separation.
- Product imagery must be centered, clean backgrounds — no clashing patterns.

## Signature Detail

Warm cream background with alternating rose pink/mint accents on cards creates a soft, home-like nursery aesthetic that feels caring and culturally warm — distinctly Indian in its hospitality tone, not generic e-commerce.
