import { HEX2RGB } from './hex.js';
import { HSL2RGB } from './rgb-hsl.js';
import { YUV2RGB } from './rgb-yuv.js';
import { CMYK2RGB } from './rgb-cmyk.js';

// Three-number functional form: rgb(r, g, b) / hsl(h, s%, l%) / yuv(y, u, v).
// Numbers are separated by any combination of commas, percent signs and
// whitespace. We anchor each digit run so the engine cannot backtrack
// across the separators (avoids the ReDoS that the original pattern had).
const FUNC3_RE =
  /(rgb|hsl|yuv)\s*\(\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*\)/i;

// Four-number functional form: cmyk(c%, m%, y%, k%).
const CMYK_RE =
  /cmyk\s*\(\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*\)/i;

// Hex form: a leading '#' followed by 2-6 hex digits.
const HEX_RE = /#([a-f0-9]{2,6})\b/i;

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
  if (typeof input !== 'string') {
    return false;
  }

  const cmykMatch = CMYK_RE.exec(input);
  if (cmykMatch) {
    return CMYK2RGB([
      parseInt(cmykMatch[1], 10),
      parseInt(cmykMatch[2], 10),
      parseInt(cmykMatch[3], 10),
      parseInt(cmykMatch[4], 10),
    ]);
  }

  const funcMatch = FUNC3_RE.exec(input);
  if (funcMatch) {
    const triple = [
      parseInt(funcMatch[2], 10),
      parseInt(funcMatch[3], 10),
      parseInt(funcMatch[4], 10),
    ];
    switch (funcMatch[1].toLowerCase()) {
      case 'rgb':
        return triple;
      case 'hsl':
        return HSL2RGB(triple);
      case 'yuv':
        return YUV2RGB(triple);
      default:
        return false;
    }
  }

  const hexMatch = HEX_RE.exec(input);
  if (hexMatch) {
    return HEX2RGB(hexMatch[1]);
  }

  return false;
};

