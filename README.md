# ColorConverter.js

[![npm](https://img.shields.io/npm/v/colorconverter.svg)](https://www.npmjs.com/package/colorconverter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A tiny zero-dependency JavaScript library for converting between RGB, HSL,
HSV, YUV, CMYK and HEX color spaces, plus helpers for parsing CSS-style
color strings, mixing colors and visualizing string complexity.

> Looking for the PHP port? See
> [SimonWaldherr/ColorConverter.php](https://github.com/SimonWaldherr/ColorConverter.php).

## Features

- Conversions between **RGB ↔ HSL / HSV / YUV / CMYK / HEX**
- Composite helpers: `HSL2HEX`, `HEX2HSL`, `HSV2HEX`, `HEX2HSV`, `CMYK2HEX`, `HEX2CMYK`
- A simple `parse()` for `#hex`, `rgb()`, `hsl()`, `yuv()` and `cmyk()` strings
- `mixRGB` to average two RGB colors
- `complexity2RGB` / `complexity2int` to colorize string "complexity"
- Ships as **ESM**, **CommonJS** and a browser **UMD** bundle
- Backwards-compatible with the original `colorconv` global

## Install

```sh
npm install colorconverter
```

Or load the UMD bundle directly in the browser:

```html
<script src="https://unpkg.com/colorconverter/dist/colorconverter.umd.min.js"></script>
<script>
  const rgb = colorconv.HEX2RGB('3a7bd5'); // [58, 123, 213]
</script>
```

## Quick start

### ES Modules

```js
import { RGB2HSL, HEX2RGB, parse } from 'colorconverter';

RGB2HSL([123, 222, 42]);     // [93, 73, 52]   — [hue°, sat%, lit%]
HEX2RGB('#3a7bd5');          // [58, 123, 213]
parse('hsl(0, 100%, 50%)');  // [255, 0, 0]
```

### CommonJS

```js
const colorconv = require('colorconverter');

colorconv.RGB2HEX([255, 0, 0]); // 'ff0000'
```

### Browser global

```html
<script src="dist/colorconverter.umd.js"></script>
<script>
  colorconv.RGB2CMYK([255, 0, 0]); // [0, 100, 100, 0]
</script>
```

## API

All functions are pure and accept/return arrays. Channel ranges are listed
below.

### Conversions between RGB and other color spaces

| Function     | Input                                  | Output                                 |
| ------------ | -------------------------------------- | -------------------------------------- |
| `RGB2HSL`    | `[r, g, b]`, each `0–255`              | `[h, s, l]` — `h°` `0–360`, `s%`/`l%` `0–100` |
| `HSL2RGB`    | `[h, s, l]` (`0–360`, `0–100`, `0–100`) | `[r, g, b]`, each `0–255`              |
| `RGB2HSV`    | `[r, g, b]`, each `0–255`              | `[h, s, v]`, each `0–1`*               |
| `HSV2RGB`    | `[h, s, v]`, each `0–1`                | `[r, g, b]`, each `0–255`              |
| `RGB2CMYK`   | `[r, g, b]`, each `0–255`              | `[c, m, y, k]`, each `0–100`           |
| `CMYK2RGB`   | `[c, m, y, k]`, each `0–100`           | `[r, g, b]`, each `0–255`              |
| `RGB2YUV`    | `[r, g, b]`, each `0–255`              | `[y, u, v]`, each `0–255`              |
| `YUV2RGB`    | `[y, u, v]`, each `0–255`              | `[r, g, b]`, each `0–255`              |
| `RGB2HEX`    | `[r, g, b]`, each `0–255`              | string `'rrggbb'`                      |
| `HEX2RGB`    | string `'#rgb'`, `'#rrggbb'`, or `'gg'` (gray) | `[r, g, b]`, each `0–255`, or `false`  |

\* `RGB2HSV` returns each component normalized to `0–1` for backwards
compatibility with the original library; multiply `h` by `360` and
`s`/`v` by `100` if you need degrees and percentages.

### Composite hex helpers

| Function    | Input                            | Output                              |
| ----------- | -------------------------------- | ----------------------------------- |
| `HSL2HEX`   | `[h, s, l]`                      | string `'rrggbb'`                   |
| `HEX2HSL`   | hex string                       | `[h, s, l]`                         |
| `HSV2HEX`   | `[h, s, v]`                      | string `'rrggbb'`                   |
| `HEX2HSV`   | hex string                       | `[h, s, v]`                         |
| `CMYK2HEX`  | `[c, m, y, k]`                   | string `'rrggbb'`                   |
| `HEX2CMYK`  | hex string                       | `[c, m, y, k]`                      |

### Other utilities

| Function          | Input                                                            | Output                                |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------- |
| `mixRGB`          | `[r, g, b]`, `[r, g, b]`                                         | `[r, g, b]` — channel-wise mean       |
| `parse`           | `'#fff'`, `'rgb(...)'`, `'hsl(...)'`, `'yuv(...)'`, `'cmyk(...)'` | `[r, g, b]` or `false`                |
| `complexity2int`  | string                                                           | numeric "complexity" score            |
| `int2RGB`         | number (or `true`)                                               | `[r, g, b]` or `false`                |
| `complexity2RGB`  | string                                                           | `[r, g, b]` or `false`                |

### Conversion matrix

Direct conversions implemented in a single call. Combinations marked `via`
are still available through the named composite helpers (e.g. `HSV2HEX`
goes via RGB internally).

|        | RGB | HSL | HSV | YUV | HEX | CMYK |
| ------ | :-: | :-: | :-: | :-: | :-: | :--: |
| **RGB**  |  ·  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓   |
| **HSL**  |  ✓  |  ·  | via | via |  ✓  | via  |
| **HSV**  |  ✓  | via |  ·  | via |  ✓  | via  |
| **YUV**  |  ✓  | via | via |  ·  | via | via  |
| **HEX**  |  ✓  |  ✓  |  ✓  | via |  ·  |  ✓   |
| **CMYK** |  ✓  | via | via | via |  ✓  |  ·   |

## Demos

Live demos are published via GitHub Pages at
[simonwaldherr.github.io/ColorConverter.js/](https://simonwaldherr.github.io/ColorConverter.js/),
or you can open [`index.html`](./index.html) locally and click through.
Each demo lives under [`examples/`](./examples).

## Development

```sh
git clone https://github.com/SimonWaldherr/ColorConverter.js.git
cd ColorConverter.js
npm install
npm test          # run the test suite
npm run build     # produce dist/ (ESM + CJS + UMD + min)
npm run lint      # ESLint
npm run format    # Prettier
```

The library source lives under [`src/`](./src) as ES modules; tests use
Node's built-in [`node:test`](https://nodejs.org/api/test.html) runner;
the build is a small [esbuild](https://esbuild.github.io/) script in
[`scripts/build.js`](./scripts/build.js).

## Contributing

Bug reports, fixes and pull requests are welcome — please open an issue
to discuss any larger changes first.

## License

[MIT](./LICENSE) © Simon Waldherr

Feel free to reach out via
[email](mailto:contact@simonwaldherr.de) or on
[Twitter / X](https://twitter.com/simonwaldherr).
