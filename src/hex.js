import { byteToHex, clamp, toInt } from './utils.js';

/**
 * Convert a hexadecimal color string to an `[r, g, b]` triple of integers
 * in the 0–255 range. A leading `#` is optional. Three accepted lengths:
 *
 * - 2 chars: a single byte interpreted as a grayscale intensity
 *   (preserved from the original library for backwards compatibility).
 * - 3 chars: short form, each digit is doubled (`'abc'` → `'aabbcc'`).
 * - 6 chars: standard `rrggbb` form.
 *
 * Any other length returns `false`.
 *
 * @param {string} hex
 * @returns {[number, number, number]|false}
 */
export const HEX2RGB = (hex) => {
  let value = hex;
  if (value.charAt(0) === '#') {
    value = value.substr(1);
  }
  if (value.length < 2 || value.length > 6) {
    return false;
  }
  const v = value.split('');

  if (value.length === 2) {
    const gray = parseInt(v[0] + v[1], 16);
    return [gray, gray, gray];
  }
  if (value.length === 3) {
    return [
      parseInt(v[0] + v[0], 16),
      parseInt(v[1] + v[1], 16),
      parseInt(v[2] + v[2], 16),
    ];
  }
  if (value.length === 6) {
    return [
      parseInt(v[0] + v[1], 16),
      parseInt(v[2] + v[3], 16),
      parseInt(v[4] + v[5], 16),
    ];
  }
  return false;
};

/**
 * Convert an `[r, g, b]` triple (each 0–255) to a six-character lower-case
 * hexadecimal color string (without a leading `#`).
 *
 * @param {[number, number, number]} RGB
 * @returns {string}
 */
export const RGB2HEX = (RGB) => {
  const r = clamp(toInt(RGB[0]), 0, 255);
  const g = clamp(toInt(RGB[1]), 0, 255);
  const b = clamp(toInt(RGB[2]), 0, 255);
  return byteToHex(r) + byteToHex(g) + byteToHex(b);
};
