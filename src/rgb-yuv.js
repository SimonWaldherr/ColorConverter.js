import { toInt } from './utils.js';

/**
 * Convert an `[r, g, b]` triple (each 0–255) to a `[y, u, v]` triple
 * where each channel is mapped into the 0–255 range. The Y channel is
 * computed using the BT.601 luminance coefficients; U and V are scaled
 * and offset so they fit unsigned bytes.
 *
 * @param {[number, number, number]} RGB
 * @returns {[number, number, number]}
 */
export const RGB2YUV = (RGB) => {
  const r = toInt(RGB[0]);
  const g = toInt(RGB[1]);
  const b = toInt(RGB[2]);
  const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  const u = Math.round((((b - y) * 0.493) + 111) / 222 * 255);
  const v = Math.round((((r - y) * 0.877) + 155) / 312 * 255);
  return [y, u, v];
};

/**
 * Convert a `[y, u, v]` triple (each 0–255 with the same encoding used
 * by `RGB2YUV`) back to an `[r, g, b]` triple with each channel as an
 * integer 0–255.
 *
 * @param {[number, number, number]} YUV
 * @returns {[number, number, number]}
 */
export const YUV2RGB = (YUV) => {
  const y = toInt(YUV[0]);
  const u = toInt(YUV[1]) / 255 * 222 - 111;
  const v = toInt(YUV[2]) / 255 * 312 - 155;
  const r = Math.round(y + v / 0.877);
  const g = Math.round(y - 0.39466 * u - 0.5806 * v);
  const b = Math.round(y + u / 0.493);
  return [r, g, b];
};
