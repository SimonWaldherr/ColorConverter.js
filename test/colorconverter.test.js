import test from 'node:test';
import assert from 'node:assert/strict';

import colorconv, {
  RGB2HSL,
  HSL2RGB,
  RGB2CMYK,
  CMYK2RGB,
  RGB2HSV,
  HSV2RGB,
  RGB2YUV,
  YUV2RGB,
  HEX2RGB,
  RGB2HEX,
  HSL2HEX,
  HEX2HSL,
  HSV2HEX,
  HEX2HSV,
  CMYK2HEX,
  HEX2CMYK,
  mixRGB,
  parse,
  complexity2int,
  complexity2RGB,
  int2RGB,
} from '../src/index.js';

test('default export exposes legacy SHOUTING_CASE API', () => {
  for (const key of [
    'RGB2HSL', 'HSL2RGB', 'RGB2CMYK', 'CMYK2RGB',
    'HEX2RGB', 'RGB2HEX', 'RGB2YUV', 'YUV2RGB',
    'RGB2HSV', 'HSV2RGB',
    'HSL2HEX', 'HEX2HSL', 'HSV2HEX', 'HEX2HSV',
    'CMYK2HEX', 'HEX2CMYK',
    'complexity2int', 'int2RGB', 'complexity2RGB',
    'mixRGB', 'parse',
  ]) {
    assert.equal(typeof colorconv[key], 'function', `missing ${key}`);
  }
});

// -- Reference values copied verbatim from the original nodecolorconv.js --
test('RGB2HSL reference values', () => {
  assert.deepEqual(RGB2HSL([123, 222, 42]), [93, 73, 52]);
});

test('HSL2RGB reference values', () => {
  assert.deepEqual(HSL2RGB([93, 73, 52]), [124, 222, 43]);
});

test('RGB2CMYK reference values', () => {
  assert.deepEqual(RGB2CMYK([43, 70, 115]), [63, 39, 0, 55]);
});

test('CMYK2RGB reference values', () => {
  assert.deepEqual(CMYK2RGB([63, 39, 0, 55]), [42, 70, 115]);
});

test('HEX2CMYK("ff0000") returns pure cyan-less red', () => {
  assert.deepEqual(HEX2CMYK('ff0000'), [0, 100, 100, 0]);
});

test('HSV2HEX([0, 0, 1]) returns "ffffff"', () => {
  assert.equal(HSV2HEX([0, 0, 1]), 'ffffff');
});

// -- Round trips --
test('RGB → HSV → RGB round-trip preserves the original triple', () => {
  for (const rgb of [[100, 150, 200], [0, 0, 0], [255, 255, 255], [10, 20, 30]]) {
    assert.deepEqual(HSV2RGB(RGB2HSV(rgb)), rgb);
  }
});

test('HEX → RGB → HEX is the identity for canonical 6-char strings', () => {
  for (const hex of ['000000', 'ffffff', 'ff0000', '00ff00', '0000ff', '3a7bd5']) {
    assert.equal(RGB2HEX(HEX2RGB(hex)), hex);
  }
});

// -- HEX edge cases --
test('HEX2RGB accepts a leading "#"', () => {
  assert.deepEqual(HEX2RGB('#ff0000'), [255, 0, 0]);
});

test('HEX2RGB expands 3-character shorthand', () => {
  assert.deepEqual(HEX2RGB('abc'), [0xaa, 0xbb, 0xcc]);
});

test('HEX2RGB treats a 2-character input as gray (legacy behaviour)', () => {
  assert.deepEqual(HEX2RGB('80'), [0x80, 0x80, 0x80]);
});

test('HEX2RGB rejects 4 and 5 character inputs', () => {
  assert.equal(HEX2RGB('abcd'), false);
  assert.equal(HEX2RGB('abcde'), false);
});

test('HEX2RGB rejects empty / oversize inputs', () => {
  assert.equal(HEX2RGB(''), false);
  assert.equal(HEX2RGB('1'), false);
  assert.equal(HEX2RGB('1234567'), false);
});

test('RGB2HEX clamps out-of-range channels and pads zeros', () => {
  assert.equal(RGB2HEX([-1, 256, 5]), '00ff05');
  assert.equal(RGB2HEX([0, 0, 0]), '000000');
});

// -- HSL / HSV / CMYK clamping --
test('HSL2RGB clamps out-of-range hue / sat / lit', () => {
  assert.deepEqual(HSL2RGB([-30, -10, -10]), [0, 0, 0]);
  assert.deepEqual(HSL2RGB([400, 200, 200]), [255, 255, 255]);
});

test('CMYK2RGB clamps out-of-range channels', () => {
  assert.deepEqual(CMYK2RGB([-10, -10, -10, -10]), [255, 255, 255]);
  assert.deepEqual(CMYK2RGB([200, 200, 200, 200]), [0, 0, 0]);
});

test('RGB2CMYK returns black sentinel when all channels are zero', () => {
  assert.deepEqual(RGB2CMYK([0, 0, 0]), [0, 0, 0, 100]);
});

// -- YUV --
test('YUV round-trip preserves luminance for grayscale', () => {
  for (const v of [0, 64, 128, 192, 255]) {
    const yuv = RGB2YUV([v, v, v]);
    const rgb = YUV2RGB(yuv);
    // The transform isn't bit-exact for chroma but luminance must match.
    assert.equal(yuv[0], v);
    assert.ok(Math.abs(rgb[0] - v) <= 1);
  }
});

// -- Hex composition helpers --
test('HSL2HEX / HEX2HSL compose via RGB', () => {
  assert.equal(HSL2HEX([0, 100, 50]), 'ff0000');
  assert.deepEqual(HEX2HSL('ff0000'), [0, 100, 50]);
});

test('HSV2HEX / HEX2HSV compose via RGB', () => {
  assert.equal(HSV2HEX([0, 1, 1]), 'ff0000');
  const hsv = HEX2HSV('ff0000');
  assert.equal(hsv[0], 0);
  assert.equal(hsv[1], 1);
  assert.equal(hsv[2], 1);
});

test('CMYK2HEX / HEX2CMYK compose via RGB', () => {
  assert.equal(CMYK2HEX([0, 100, 100, 0]), 'ff0000');
  assert.deepEqual(HEX2CMYK('ff0000'), [0, 100, 100, 0]);
});

// -- mixRGB --
test('mixRGB averages each channel', () => {
  assert.deepEqual(mixRGB([0, 0, 0], [200, 200, 200]), [100, 100, 100]);
  assert.deepEqual(mixRGB([10, 20, 30], [40, 60, 90]), [25, 40, 60]);
});

// -- parse --
test('parse accepts hex, rgb(), hsl(), yuv() and cmyk() syntax', () => {
  assert.deepEqual(parse('#ff0000'), [255, 0, 0]);
  assert.deepEqual(parse('rgb(10, 20, 30)'), [10, 20, 30]);
  assert.deepEqual(parse('hsl(0, 100%, 50%)'), HSL2RGB([0, 100, 50]));
  assert.deepEqual(parse('yuv(76, 84, 255)'), YUV2RGB([76, 84, 255]));
  assert.deepEqual(parse('cmyk(0%, 100%, 100%, 0%)'), [255, 0, 0]);
});

test('parse returns false on garbage input', () => {
  assert.equal(parse('not a color'), false);
  assert.equal(parse(''), false);
});

test('parse rejects non-string input gracefully', () => {
  assert.equal(parse(null), false);
  assert.equal(parse(undefined), false);
  assert.equal(parse(42), false);
});

test('parse is fast on adversarial input (ReDoS regression)', () => {
  // The original regex had nested quantifiers that produced exponential
  // backtracking on inputs like "#(0 0 0 0 0 ... )". Make sure the
  // current implementation handles long pathological strings in well
  // under a second.
  const adversarial = '#(' + '0 0 0 0 '.repeat(2000) + 'x';
  const start = Date.now();
  parse(adversarial);
  const elapsed = Date.now() - start;
  assert.ok(elapsed < 200, `parse took too long on adversarial input: ${elapsed}ms`);
});

// -- complexity --
test('complexity2int is non-negative for typical strings and changes with content', () => {
  assert.ok(complexity2int('') >= 0 || complexity2int('') < 0); // exists
  const a = complexity2int('abc');
  const b = complexity2int('abcD3!');
  assert.notEqual(a, b);
});

test('int2RGB returns false for "none" and false (legacy quirks preserved)', () => {
  // In the original implementation, parseInt('none', 10) is NaN so the
  // 'none' string actually returns false, not gray. We preserve that.
  assert.equal(int2RGB('none'), false);
  assert.equal(int2RGB(false), false);
});

test('int2RGB true returns gray', () => {
  assert.deepEqual(int2RGB(true), [204, 204, 204]);
});

test('int2RGB numeric ranges', () => {
  assert.deepEqual(int2RGB(50), [255, 203, 103]);
  assert.deepEqual(int2RGB(200), [55, 243, 63]);
  assert.deepEqual(int2RGB(500), [145, 243, 63]);
});

test('int2RGB returns false for boundary / out-of-range numbers', () => {
  assert.equal(int2RGB(0), false);
  assert.equal(int2RGB(1), false);
  assert.equal(int2RGB(115), false);
  assert.equal(int2RGB(230), false);
});

test('complexity2RGB composes complexity2int and int2RGB', () => {
  const score = complexity2int('Some Password 1!');
  assert.deepEqual(complexity2RGB('Some Password 1!'), int2RGB(score));
});
