# KAMBi

**The social research tool for medical camps, outreaches and field studies.**  
A [ClerQ Intelligence](https://github.com/ClerQ-Intelligence-CQ) product.

---

## Repository Structure

This repository is organized into two primary tracks:

### 1. [`main/`](./main) • Active Production Codebase
Contains the complete active platform, monorepo packages, web application, HQ operations console, background worker service, and database migrations.

- **`main/apps/web`**: Mobile-first field capture PWA & Android app (React 19, Capacitor, Vite).
- **`main/apps/hq`**: Desktop operations console with spatial intelligence & multi-role governance.
- **`main/packages/forms-engine`**: Universal field schema engine with clinical validation & skip logic.
- **`main/packages/sync`**: Offline-first Dexie IndexedDB sync client & sovereign identity vault.
- **`main/packages/ranking`**: Pure TypeScript social ranking & camp recommendation engine.
- **`main/packages/ui`**: Dieter Rams & Jony Ive monochrome component system with tokens.
- **`main/services/worker`**: Python 3.12 Ahadi AI report generation & document renderers (.docx, .xlsx).
- **`main/supabase`**: Database migrations (57 tables), Edge Functions, and RLS policies.
- **`main/docs`**: Master specs, screen value map, strategy reports, and runbooks.

To build and run tests:
```bash
cd main
pnpm install
pnpm test
pnpm build
```

---

### 2. [`master/`](./master) • Legacy Brand Assets & 3D Kinetic Mascot
Contains the standalone legacy brand assets and the official 3D procedural kinetic arch mascot code.

- **`master/logos/`**: Vector SVG and raster PNG brand logos, wordmarks, icons, and official brand sheet.
- **`master/mascot/`**: Three.js procedural kinetic arch mascot (`KambiMascot3D.tsx`, `Ahadi3DCanvas.tsx`), plus zero-dependency standalone browser preview (`master/mascot/index.html`).

---

<sub>KAMBi • Pre-alpha • First Field Camp: 2 November 2026</sub>
