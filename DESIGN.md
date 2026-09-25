# Portfolio Redesign — Design Spec

## Style anchor

Japanese product-page softness (nani.now) × award-winning editorial magazine.
Warm, human, slightly playful — never SaaS-template, never dark-glassmorphism.

## Palette

| Token          | Hex       | Use                 |
| -------------- | --------- | ------------------- |
| paper          | `#F5F1EA` | page background     |
| surface        | `#FFFFFF` | cards, nav pill     |
| ink            | `#12100E` | primary text        |
| muted          | `#6B655E` | secondary text      |
| cobalt         | `#2B4CFF` | interactive accent  |
| cobalt-soft    | `#E6ECFF` | tinted surfaces     |
| tangerine      | `#FF7A45` | awards / highlights |
| tangerine-soft | `#FFEDE4` | warm tints          |
| line           | `#E4DCD1` | hairline borders    |

Light only. No dark mode.

## Typography

- **Display:** Bricolage Grotesque (variable) — bold, slightly quirky, human
- **Body:** Inter (local woff2)
- Scale contrast: hero clamp(3.5rem, 10vw, 7.5rem); section titles clamp(2rem, 4vw, 3.25rem); body 1.05–1.15rem
- Tight tracking on display (-0.03em), normal on body

## Layout

- Content max 1120px; full-bleed tinted sections
- Section rhythm 6–10rem vertical
- Cards radius 28px, soft warm shadow
- Asymmetric hero (type + floating visual)
- Sticky floating pill nav
- Mobile: single column, stacked cards, condensed hero

## Signature moments

1. Hero kinetic type + rotating role word
2. Scrolling impact marquee
3. Count-up stats for OSS numbers
4. Hand-drawn annotation arrows (SVG)
5. Award polaroids with slight rotation
6. Magnetic CTA buttons + scroll-reveal choreography

## Content (cut fluff)

Keep: who, impact (Yamada UI / Zen / sonner / shadcn), 3 featured builds,
short human story, 2 awards with real photos, contact.
Drop: dark mode, wallet cards, generic game grid, wall-of-text CV.

## Assets

- Real: hackathon award photos in `src/assets/hackathon/`
- Generated: soft abstract hero art matching palette
- Icons: inline SVG only
