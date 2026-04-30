import { clamp, toInt } from './utils.js';

/**
 * Convert an `[r, g, b]` triple (each 0–255) to `[c, m, y, k]` where
 * each channel is an integer percentage (0–100).
 *
 * @param {[number, number, number]} RGB
 * @returns {[number, number, number, number]}
 */
export const RGB2CMYK = (RGB) => {
  const r = clamp(toInt(RGB[0]), 0, 255) / 255;
  const g = clamp(toInt(RGB[1]), 0, 255) / 255;
  const b = clamp(toInt(RGB[2]), 0, 255) / 255;
  const k = 1 - Math.max(r, g, b);

  if (k === 1) {
    return [0, 0, 0, 100];
  }
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return [
    Math.round(c * 100),
    Math.round(m * 100),
    Math.round(y * 100),
    Math.round(k * 100),
  ];
};

/**
 * Convert a `[c, m, y, k]` quadruple (each 0–100) back to an `[r, g, b]`
 * triple with each channel as an integer 0–255.
 *
 * @param {[number, number, number, number]} CMYK
 * @returns {[number, number, number]}
 */
export const CMYK2RGB = (CMYK) => {
  const c = clamp(toInt(CMYK[0]), 0, 100) / 100;
  const m = clamp(toInt(CMYK[1]), 0, 100) / 100;
  const y = clamp(toInt(CMYK[2]), 0, 100) / 100;
  const k = clamp(toInt(CMYK[3]), 0, 100) / 100;
  const r = (1 - c) * (1 - k);
  const g = (1 - m) * (1 - k);
  const b = (1 - y) * (1 - k);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
