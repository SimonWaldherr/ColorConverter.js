/**
 * ColorConverter.js
 *
 * Convert between RGB, HSL, HSV, YUV, CMYK and HEX color spaces, plus a
 * few extras (parse, mix, complexity-based color).
 *
 * Two ways to use the library:
 *
 *   // Named imports (modern)
 *   import { RGB2HSL, HEX2RGB } from 'colorconverter';
 *
 *   // Default export — a single object that also exposes the legacy
 *   // SHOUTING_CASE keys used by older code:
 *   import colorconv from 'colorconverter';
 *   colorconv.RGB2HSL([123, 222, 42]);
 */

export { RGB2HSL, HSL2RGB } from './rgb-hsl.js';
export { RGB2HSV, HSV2RGB } from './rgb-hsv.js';
export { RGB2CMYK, CMYK2RGB } from './rgb-cmyk.js';
export { RGB2YUV, YUV2RGB } from './rgb-yuv.js';
export { HEX2RGB, RGB2HEX } from './hex.js';
export { mixRGB } from './mix.js';
export { parse } from './parse.js';
export { complexity2int, complexity2RGB, int2RGB } from './complexity.js';

import { RGB2HSL, HSL2RGB } from './rgb-hsl.js';
import { RGB2HSV, HSV2RGB } from './rgb-hsv.js';
import { RGB2CMYK, CMYK2RGB } from './rgb-cmyk.js';
import { RGB2YUV, YUV2RGB } from './rgb-yuv.js';
import { HEX2RGB, RGB2HEX } from './hex.js';
import { mixRGB } from './mix.js';
import { parse } from './parse.js';
import { complexity2int, complexity2RGB, int2RGB } from './complexity.js';

/** @param {[number, number, number]} HSL */
export const HSL2HEX = (HSL) => RGB2HEX(HSL2RGB(HSL));
/** @param {string} hex */
export const HEX2HSL = (hex) => RGB2HSL(HEX2RGB(hex));
/** @param {[number, number, number]} HSV */
export const HSV2HEX = (HSV) => RGB2HEX(HSV2RGB(HSV));
/** @param {string} hex */
export const HEX2HSV = (hex) => RGB2HSV(HEX2RGB(hex));
/** @param {[number, number, number, number]} CMYK */
export const CMYK2HEX = (CMYK) => RGB2HEX(CMYK2RGB(CMYK));
/** @param {string} hex */
export const HEX2CMYK = (hex) => RGB2CMYK(HEX2RGB(hex));

/**
 * Default export: an object containing every conversion function under
 * its legacy name. Provided for backwards compatibility with code written
 * against the original global `colorconv` object.
 */
const colorconv = {
  RGB2HSL,
  HSL2RGB,
  RGB2CMYK,
  CMYK2RGB,
  HEX2RGB,
  RGB2HEX,
  RGB2YUV,
  YUV2RGB,
  RGB2HSV,
  HSV2RGB,
  HSL2HEX,
  HEX2HSL,
  HSV2HEX,
  HEX2HSV,
  CMYK2HEX,
  HEX2CMYK,
  complexity2int,
  int2RGB,
  complexity2RGB,
  mixRGB,
  parse,
};

export default colorconv;
