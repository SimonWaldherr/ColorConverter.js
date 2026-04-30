import { clamp, toInt } from './utils.js';

/**
 * Convert an `[r, g, b]` triple (each 0–255) to `[h, s, l]` with
 * `h` in degrees (0–360) and `s`/`l` as integer percentages (0–100).
 *
 * @param {[number, number, number]} RGB
 * @returns {[number, number, number]}
 */
export const RGB2HSL = (RGB) => {
  const r = clamp(toInt(RGB[0]) / 255, 0, 1);
  const g = clamp(toInt(RGB[1]) / 255, 0, 1);
  const b = clamp(toInt(RGB[2]) / 255, 0, 1);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h;
  let s;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h /= 6;
  } else {
    h = 0;
    s = 0;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

/**
 * Convert an `[h, s, l]` triple (`h` in 0–360, `s`/`l` as 0–100 percents)
 * back to `[r, g, b]` with each channel as an integer 0–255.
 *
 * @param {[number, number, number]} HSL
 * @returns {[number, number, number]}
 */
export const HSL2RGB = (HSL) => {
  const h = clamp(toInt(HSL[0]), 0, 360) / 360;
  const s = clamp(toInt(HSL[1]), 0, 100) / 100;
  const l = clamp(toInt(HSL[2]), 0, 100) / 100;

  const v = l <= 0.5 ? l * (1 + s) : l + s - l * s;
  if (v === 0) {
    return [0, 0, 0];
  }

  const min = 2 * l - v;
  const sv = (v - min) / v;
  const sextant = h * 6;
  const six = Math.floor(sextant);
  const fract = sextant - six;
  const vsfract = v * sv * fract;

  let r;
  let g;
  let b;
  switch (six) {
    case 1:
      r = v - vsfract;
      g = v;
      b = min;
      break;
    case 2:
      r = min;
      g = v;
      b = min + vsfract;
      break;
    case 3:
      r = min;
      g = v - vsfract;
      b = v;
      break;
    case 4:
      r = min + vsfract;
      g = min;
      b = v;
      break;
    case 5:
      r = v;
      g = min;
      b = v - vsfract;
      break;
    default:
      r = v;
      g = min + vsfract;
      b = min;
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
