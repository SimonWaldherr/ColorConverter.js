/**
 * Shared utilities for color conversion functions.
 *
 * The original library used `parseInt(x, 10)` on every input to coerce
 * strings into integers and to truncate floats. We keep that behaviour for
 * full backwards compatibility, but localize it in a single helper.
 */

/**
 * Coerce a value into an integer the same way the original library did:
 * `parseInt(value, 10)`. This accepts numeric strings and truncates floats.
 * @param {number|string} value
 * @returns {number}
 */
export const toInt = (value) => parseInt(value, 10);

/**
 * Clamp a number to the inclusive range [min, max].
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

/**
 * Coerce a value to an integer and clamp it to the inclusive range
 * [min, max] (defaults to [0, 255], the byte range used for RGB).
 * @param {number|string} value
 * @param {number} [min=0]
 * @param {number} [max=255]
 * @returns {number}
 */
export const toByte = (value, min = 0, max = 255) =>
  clamp(toInt(value), min, max);

/**
 * Format a single byte value as a two-character lower-case hexadecimal
 * string, padding with a leading zero when required.
 * @param {number} byte
 * @returns {string}
 */
export const byteToHex = (byte) =>
  byte > 15 ? byte.toString(16) : `0${byte.toString(16)}`;
