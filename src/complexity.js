/**
 * Estimate the "complexity" of a string by counting upper-case, lower-case,
 * digit and special-character classes. The result is the original
 * library's heuristic and is preserved unchanged for compatibility.
 *
 * @param {string} string
 * @returns {number}
 */
export const complexity2int = (string) => {
  const keys = string.split('');
  let numbers = 1;
  let uletter = 1;
  let lletter = 1;
  let special = 1;

  for (let i = 0; i < keys.length; i += 1) {
    const code = keys[i].charCodeAt(0);
    if (code > 0x40 && code < 0x5b) {
      // Uppercase A–Z
      uletter += 1;
    } else if (code > 0x60 && code < 0x7b) {
      // Lowercase a–z
      lletter += 1;
    } else if (code > 0x2f && code < 0x3a) {
      // Digits 0–9
      numbers += 1;
    } else if (code > 0x20 && code < 0x7f) {
      // Special printable ASCII
      special += 1;
    }
  }

  return (
    (uletter * lletter * numbers * special) +
    Math.round(uletter * 1.8 + lletter * 1.5 + numbers + special * 2) -
    6
  );
};

/**
 * Map a complexity score to a representative `[r, g, b]` color. The
 * numeric mapping is:
 *
 * - `2..114`   → red shading toward orange
 * - `116..229` → orange shading toward yellow
 * - `> 230`    → green
 *
 * Boolean `true` returns neutral gray; any other input (numbers in the
 * gaps `0..1`, `115`, `230`, non-numeric strings, `false`, etc.) returns
 * `false`. The behaviour mirrors the original implementation exactly.
 *
 * @param {number|string|boolean} intval
 * @returns {[number, number, number]|false}
 */
export const int2RGB = (intval) => {
  let value = intval;
  if (typeof value !== 'number' && value !== false && value !== true) {
    value = parseInt(value, 10);
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    if (value < 115 && value > 1) {
      return [255, 153 + value, 153 - value];
    }
    if (value > 115 && value < 230) {
      return [255 - value, 243, 63];
    }
    if (value > 230) {
      return [145, 243, 63];
    }
  }
  if (value === true) {
    return [204, 204, 204];
  }
  return false;
};

/**
 * Convenience helper: convert a string directly to a complexity color.
 *
 * @param {string} string
 * @returns {[number, number, number]|false}
 */
export const complexity2RGB = (string) => int2RGB(complexity2int(string));
