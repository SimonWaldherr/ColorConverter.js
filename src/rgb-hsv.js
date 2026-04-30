import { toInt } from './utils.js';

/**
 * Convert an `[r, g, b]` triple (each 0–255) to `[h, s, v]` with all three
 * components in the 0–1 range.
 *
 * NOTE: For backwards compatibility this matches the original library's
 * unit choice. The companion `HSV2RGB` function expects the same 0–1
 * encoding.
 *
 * @param {[number, number, number]} RGB
 * @returns {[number, number, number]}
 */
export const RGB2HSV = (RGB) => {
  const r = toInt(RGB[0]) / 255;
  const g = toInt(RGB[1]) / 255;
  const b = toInt(RGB[2]) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, v];
};

/**
 * Convert an `[h, s, v]` triple (each in the 0–1 range, matching the
 * output of `RGB2HSV`) back to `[r, g, b]` with each channel as an
 * integer 0–255.
 *
 * @param {[number, number, number]} HSV
 * @returns {[number, number, number]}
 */
export const HSV2RGB = (HSV) => {
  const h = HSV[0];
  const s = HSV[1];
  const v = HSV[2];
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r;
  let g;
  let b;

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    default:
      r = v;
      g = p;
      b = q;
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
