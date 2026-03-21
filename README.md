# Earth Tools

Earth Tools is a Next.js 16 App Router application for open ecological intelligence. It provides a shared shell and route structure around external tools such as Wildfire Nowcast and MeteoWatch EU.

## Tech Stack

- Next.js 16 + React 19 + TypeScript (strict)
- Tailwind CSS v4 with semantic design tokens
- Zod-validated domain contracts and repository adapters
- Vitest + Testing Library + Playwright + axe-core + Lighthouse CI

## Routes

- `/` - Home and tool directory
- `/wildfire` - Embedded Wildfire Nowcast app (iframe)
- `/meteo-watch` - Embedded MeteoWatch EU app (iframe)
- `/methods` - Methods and transparency
- `/status` - Pipeline and service status
- `/api/status` - Mock system status and latest runs

## Development

```bash
pnpm install
pnpm dev
```

Set the external wildfire tool URL (for example Streamlit `wildfire-nowcast`) with:

```bash
NEXT_PUBLIC_WILDFIRE_NOWCAST_URL=http://localhost:8501
```

`/wildfire` always renders the iframe when this value is set.

Set the external MeteoWatch URL with:

```bash
NEXT_PUBLIC_METEO_WATCH_URL=http://localhost:5174
```

`/meteo-watch` always renders the iframe when this value is set.

## Quality Gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
pnpm a11y
pnpm build
pnpm lhci
```

## Notes

- E2E and a11y tests use port `4173`.
- Playwright browser binaries can be installed with `pnpm e2e:install`.
- Lighthouse results are written to `.lighthouseci/`.
