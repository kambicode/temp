# KAMBi brand kit

Everything is generated from the supplied logo, traced to clean vector paths.

## What's inside

```
logo/svg/      symbol, wordmark, stacked + horizontal lockups; black, white, currentcolor
logo/png/      same, transparent PNG at 512 / 1024 / 2048 px wide
web/           favicon.ico, favicon.svg (switches to white in dark mode), PNG favicons,
               apple-touch-icon, android-chrome, maskable, mstile, safari-pinned-tab,
               site.webmanifest, browserconfig.xml, head-snippet.html
app-icons/
  ios/               1024 marketing icon (+ dark) and every standard size, no alpha
  android/res/       drop-in mipmaps: legacy, round, adaptive foreground + monochrome,
                     adaptive XML and background colour
  react-native-expo/ icon, adaptive-icon, splash-icon (+ dark), favicon
social/        Open Graph 1200x630, banner 1500x500, avatar 512 (light + dark)
brand-sheet.png / .svg   one-page overview of the system
source/        the original raster logo
tools/         build_kit.py to regenerate everything (edit INK / PAPER to recolour)
```

## Website setup

1. Copy the contents of `web/` to your site root.
2. Paste `web/head-snippet.html` into your `<head>`.

## Usage notes

- Clear space: keep one ring diameter (the circle at the base of the symbol) free on every side.
- Recommended minimum widths: symbol 16 px (use the favicon files, which carry a slightly heavier
  stroke), stacked lockup 96 px, horizontal lockup 120 px.
- Use the white files on dark or photographic backgrounds, the black files on light ones.
  `currentcolor` SVGs inherit the surrounding text colour.
- Icon tiles use #FFFFFF backgrounds; change `INK` / `PAPER` in `tools/build_kit.py` and re-run
  to produce a branded colour version of every icon.

## Heads-up

The vectors are traced from a 1024 px raster, so they are very close but not the designer's
original geometry, and the letters are outlines, not live text. If you have the original vector
master (.ai / .svg / .fig), prefer it and re-run the icon generation from that.
