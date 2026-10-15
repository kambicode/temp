# KAMBi Master: Legacy Brand Assets & 3D Kinetic Mascot

This repository directory contains exclusively the legacy brand assets (logos, wordmarks, icons, brand sheet) and the procedural 3D Three.js kinetic mascot code for KAMBi.

All active production codebase, applications, monorepo packages, and database migrations reside in the `main` directory (and the `main` Git branch).

---

## Contents

### 1. `logos/` (Brand Identity & Assets)
- **`logos/logo/svg/`**: Vector brand assets in black and white:
  - `kambi-stacked-black.svg` / `kambi-stacked-white.svg`
  - `kambi-wordmark-black.svg` / `kambi-wordmark-white.svg`
  - `kambi-symbol-black.svg` / `kambi-symbol-white.svg`
  - `kambi-icon-black.svg` / `kambi-icon-white.svg`
- **`logos/logo/png/`**: Crisp raster renderings at 1x, 2x, and 4x resolutions.
- **`logos/brand-sheet.svg` & `logos/brand-sheet.png`**: Complete visual design specifications and color tokens.
- **`logos/app-icons/`**: Native icon packaging for Android, iOS, and Web PWA.

### 2. `mascot/` (3D Kinetic Arch Mascot)
- **`mascot/KambiMascot3D.tsx`**: Official React + Three.js component featuring the procedural arch geometry, ember core beacon, white aperture, and African data constellation particles.
- **`mascot/Ahadi3DCanvas.tsx`**: Canvas wrapper for integration into application hero surfaces.
- **`mascot/index.html`**: Zero-dependency standalone browser preview. Open directly in any web browser to view, rotate, and interact with the 3D mascot.

---

<sub>KAMBi • A ClerQ Intelligence product</sub>
