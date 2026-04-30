/**
 * Mix two `[r, g, b]` triples by averaging each channel (truncated to an
 * integer, matching the original implementation).
 *
 * @param {[number, number, number]} RGB1
 * @param {[number, number, number]} RGB2
 * @returns {[number, number, number]}
 */
export const mixRGB = (RGB1, RGB2) => [
  parseInt((RGB1[0] + RGB2[0]) / 2, 10),
  parseInt((RGB1[1] + RGB2[1]) / 2, 10),
  parseInt((RGB1[2] + RGB2[2]) / 2, 10),
];
