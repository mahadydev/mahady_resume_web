# MD Mahady Hasan — Resume · Three Directions

Personal resume site. Built with Next.js 16 + React 19 + TypeScript. Deployed to Vercel.

The site is the landing hub plus three "direction" pages — each a different visual interpretation of the same résumé:

- `/` — landing hub showing the three directions
- `/career-app` — phone-shaped UI; tap app icons for sections, tap-tempo, parallax
- `/terminal` — macOS terminal with file explorer + tabs + Snake game
- `/studio` — editorial magazine scroll with drag-stack polaroid project deck

## Development

```bash
cd web
npm install
npm run dev   # http://localhost:3000
```

## Build

```bash
cd web
npm run build
npm start
```

## Deploy

Connected to Vercel. Pushes to `main` deploy automatically.

## Design source

The original Claude Design handoff is at `~/Downloads/resume-website/` (external to this repo) and is the single source of truth for visual decisions.
