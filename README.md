# Chromaspec

Utility to create OKLCH color scales for a design system.

Define a **scale** (a hue plus a chroma curve) and a set of **levels** (lightness
steps), and Chromaspec generates a perceptually even color ramp for each scale.
Tune everything live — hue, chroma peak/curvature/multiplier, and levels — then
export to SVG (Figma), CSS variables, a Tailwind config, or JSON design tokens.
It also lists foreground/background pairs grouped by WCAG contrast (3:1, 4.5:1,
7:1) so you can check accessibility at a glance.

Colors are computed in OKLCH and gamut-clamped to P3. It runs entirely in the
browser — your palette is encoded in the URL, so the address bar is a shareable
link with no backend or sign-in.

## Development

Requires [pnpm](https://pnpm.io/) and Node 22.

```bash
pnpm install
pnpm dev      # start the dev server at http://localhost:3000
pnpm build    # production build
pnpm check    # lint + format check
pnpm format   # auto-format
```

## Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Jotai · culori.

## Contributing

See [CLAUDE.md](./CLAUDE.md) for an architecture overview and notes on the data
model and persistence.
