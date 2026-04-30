import { HEX2RGB } from './hex.js';
import { HSL2RGB } from './rgb-hsl.js';
import { YUV2RGB } from './rgb-yuv.js';
import { CMYK2RGB } from './rgb-cmyk.js';

/**
 * Parse a CSS-like color string and return an `[r, g, b]` triple.
 *
 * Recognized formats:
 *
 * - `#rgb` / `#rrggbb` (and 2-char gray, mirroring `HEX2RGB`)
 * - `rgb(r, g, b)`
 * - `hsl(h, s%, l%)`
 * - `yuv(y, u, v)`
 * - `cmyk(c%, m%, y%, k%)`
 *
 * Whitespace, percent signs and commas between numbers are tolerated.
 * Returns `false` if the input cannot be parsed.
 *
 * @param {string} input
 * @returns {[number, number, number]|false}
 */
export const parse = (input) => {
  // Try CMYK first because it has four numeric components.
  const cmykPattern =
    /cmyk\s*\(\s*([%, \d]+)\s*\)/i;
  const cmykMatch = cmykPattern.exec(input);
  if (cmykMatch) {
    const parts = cmykMatch[1]
      .split(/[%, ]+/)
      .filter((s) => s.length > 0)
      .map((s) => parseInt(s, 10));
    if (parts.length >= 4) {
      return CMYK2RGB([parts[0], parts[1], parts[2], parts[3]]);
    }
  }

  const pattern =
    /((rgb|hsl|#|yuv)(\(([%, ]*([\d]+)[%, ]+([\d]+)[%, ]+([\d]+)[%, ]*)+\)|([a-f0-9]+)))/gim;
  const match = pattern.exec(input);
  if (match === null) {
    return false;
  }
  switch (match[2]) {
    case '#':
      return HEX2RGB(match[3]);
    case 'rgb':
      return [
        parseInt(match[5].trim(), 10),
        parseInt(match[6].trim(), 10),
        parseInt(match[7].trim(), 10),
      ];
    case 'hsl':
      return HSL2RGB([
        parseInt(match[5].trim(), 10),
        parseInt(match[6].trim(), 10),
        parseInt(match[7].trim(), 10),
      ]);
    case 'yuv':
      return YUV2RGB([
        parseInt(match[5].trim(), 10),
        parseInt(match[6].trim(), 10),
        parseInt(match[7].trim(), 10),
      ]);
    default:
      return false;
  }
};
