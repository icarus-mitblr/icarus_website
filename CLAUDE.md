# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ICARUS CubeSat mission website for MIT Bengaluru (Manipal Institute of Technology). Single-page React app deployed on Cloudflare Pages at `icarus-website.pages.dev`.

## Package Manager

**Always use `pnpm`.** Never use `npm` or `bun`. The repo has `pnpm-lock.yaml` as its lockfile. `package-lock.json` is gitignored.

```bash
pnpm install        # install deps
pnpm run dev        # dev server on http://localhost:5173
pnpm run build      # production build → dist/
pnpm run preview    # preview the production build locally
pnpm run lint       # ESLint
pnpm run test       # Vitest (unit tests)
pnpm run test:watch # Vitest in watch mode
```

## Architecture

Single-page app (`/`) with a 404 catch-all. All sections are scroll-based — there is no client-side routing between sections.

**Page composition (`src/pages/Index.tsx`):**
```
<Starfield />          ← canvas starfield, fixed background layer
<Navigation />         ← sticky top nav with section links
<MissionProgress />    ← progress bar showing mission phase
<HeroSection />        ← animated title, 3D CubeSat canvas, solar system bg
<SubsystemSection />   ← interactive CubeSat diagram with subsystem detail panels
<TeamSection />        ← OBC/EPS/COMM/ADCS/MECH team cards
<WorkSection />        ← sponsors carousel + project updates
<GallerySection />     ← photo gallery with filmstrip
<Footer />             ← stats (41u, 490km, etc.) + nav links
```

**Key architectural patterns:**
- Heavy use of Framer Motion (`motion.*` components, `useScroll`, `useTransform`) for scroll-driven animations throughout all sections
- Canvas-based rendering in `HeroSection` (solar system background, 3D CubeSat wireframe, orbiting satellites) — these are imperative `requestAnimationFrame` loops, not React state
- `Starfield.tsx` is a standalone canvas component used as the page-wide fixed background; separate star rendering also exists inline in `HeroSection` and `WorkSection`
- All custom colors (`gold`, `gold-dim`, `titanium`) are CSS variables defined in `src/index.css` and referenced via `tailwind.config.ts`
- `@` alias resolves to `src/`

**shadcn/ui:** The `src/components/ui/` directory contains the full shadcn component library. Only three are actually imported by app code: `tooltip`, `toaster`, `sonner`. The rest (`calendar`, `chart`, `carousel`, `command`, `drawer`, `input-otp`, `resizable`, `sidebar`, etc.) are installed but unused — do not import them without also cleaning up the corresponding unused `package.json` dependencies.

## Build & Bundler Notes

**Vite 8 uses Rolldown, not Rollup.** This matters for `vite.config.ts`:
- `manualChunks` **must be a function** — the object form (`manualChunks: { key: [...] }`) was valid in Vite 7/Rollup but throws `TypeError: manualChunks is not a function` in Rolldown.
- Current config splits `framer-motion` → `vendor-motion` and React/router → `vendor-react` for better CDN caching.

Expected production build output (~565 KB total JS, ~1s build time):
```
dist/assets/vendor-motion-*.js   ~140 KB (framer-motion)
dist/assets/vendor-react-*.js    ~171 KB (react, react-dom, react-router-dom)
dist/assets/index-*.js           ~189 KB (app code)
dist/assets/index-*.css          ~62 KB  (Tailwind purged)
```

## Cloudflare Pages Deployment

- **Branch:** `cloudflare-deploy-prep` (production branch)
- **Build command:** `pnpm install && pnpm run build`
- **Output directory:** `dist`
- **NODE_VERSION env var:** `22`
- **URL:** `icarus-website.pages.dev`

`public/_redirects` handles SPA routing (all paths → `index.html`).
`public/_headers` sets `Cache-Control: immutable` on hashed assets and `no-cache` on `index.html`.

**Do not use "Retry deployment"** after a failed build if code was pushed after the build started — Cloudflare retries the old commit hash. Trigger a new deployment instead (push a commit or use the dashboard "Create deployment" button).

## Known Issues & Pending Work

**Mobile navigation:** `Navigation.tsx:83` has `onClick={() => {}}` — the hamburger menu button is a noop. Mobile nav is not implemented.

**Unused shadcn UI files + their deps** — these are in `package.json` but nothing in app code imports them. Safe to remove together:
- Files: `ui/calendar.tsx`, `ui/chart.tsx`, `ui/command.tsx`, `ui/carousel.tsx`, `ui/drawer.tsx`, `ui/input-otp.tsx`, `ui/resizable.tsx`
- Deps: `@tanstack/react-query`, `@hookform/resolvers`, `zod`, `react-day-picker`, `cmdk`, `input-otp`, `vaul`, `embla-carousel-react`, `react-resizable-panels`, `recharts`, and most `@radix-ui/*` primitives

**Images not converted to WebP** — gallery images (`1.jpeg`, `4.jpeg`, `5.jpeg`) and `icarus-logo.jpg` are large JPEGs. Converting to WebP would reduce them ~60–70%.

**OG image** — `index.html` currently uses `favicon.ico` as the `og:image` placeholder. Replace with a real 1200×630 image when available.

## What Was Done to This Repo

This section documents the deploy-prep work done in May 2026 so future contributors understand why things are the way they are.

**Git cleanup:**
- Removed `bun.lock` — repo was accidentally tracking two lockfiles (`bun.lock` + `pnpm-lock.yaml`). Standardized on pnpm, added `package-lock.json` to `.gitignore`.
- Removed `node_modules/.vite/deps/_metadata.json` which was accidentally tracked.
- Added `.DS_Store` entries to `.gitignore` (three `.DS_Store` files were tracked but not removed from history to avoid rewriting commits).
- Added `dist/` and `.env*` to `.gitignore`.

**Cloudflare Pages config added:**
- `public/_redirects` — SPA catch-all routing
- `public/_headers` — aggressive caching for hashed assets

**`tailwind.config.ts`:** Removed three non-existent content paths (`./pages/`, `./components/`, `./app/`). Only `./src/**` and `./index.html` are valid.

**`index.html`:** Replaced hardcoded Lovable.dev OG image URL and `@Lovable` Twitter handle (scaffolding leftovers) with project placeholders.

**`src/App.tsx`:** Removed `QueryClientProvider` wrapper — `@tanstack/react-query` was installed but no queries were ever used. Added React Router v7 future flags to silence deprecation warnings.

**`vite.config.ts`:** Added `manualChunks` (function form, required by Rolldown) to split vendor chunks. The object form was tried first and caused the first Cloudflare build failure.
