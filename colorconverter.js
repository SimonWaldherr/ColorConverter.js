/**
 * ColorConverter.js v0.3.0
 * Convert between RGB, HSL, HSV, YUV, CMYK and HEX color spaces with a tiny zero-dependency JavaScript library.
 *
 * @license MIT
 * @author Simon Waldherr <contact@simonwaldherr.de>
 * @see https://github.com/SimonWaldherr/ColorConverter.js
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.colorconv = factory();
    // Backwards-compat alias used by the original library:
    root.returnExports = root.colorconv;
  }
}(typeof self !== 'undefined' ? self : this, function () {
var __colorconvModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.js
  var index_exports = {};
  __export(index_exports, {
    CMYK2HEX: () => CMYK2HEX,
    CMYK2RGB: () => CMYK2RGB,
    HEX2CMYK: () => HEX2CMYK,
    HEX2HSL: () => HEX2HSL,
    HEX2HSV: () => HEX2HSV,
    HEX2RGB: () => HEX2RGB,
    HSL2HEX: () => HSL2HEX,
    HSL2RGB: () => HSL2RGB,
    HSV2HEX: () => HSV2HEX,
    HSV2RGB: () => HSV2RGB,
    RGB2CMYK: () => RGB2CMYK,
    RGB2HEX: () => RGB2HEX,
    RGB2HSL: () => RGB2HSL,
    RGB2HSV: () => RGB2HSV,
    RGB2YUV: () => RGB2YUV,
    YUV2RGB: () => YUV2RGB,
    complexity2RGB: () => complexity2RGB,
    complexity2int: () => complexity2int,
    default: () => index_default,
    int2RGB: () => int2RGB,
    mixRGB: () => mixRGB,
    parse: () => parse
  });

  // src/utils.js
  var toInt = (value) => parseInt(value, 10);
  var clamp = (value, min, max) => Math.max(Math.min(value, max), min);
  var byteToHex = (byte) => byte > 15 ? byte.toString(16) : `0${byte.toString(16)}`;

  // src/rgb-hsl.js
  var RGB2HSL = (RGB) => {
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
  var HSL2RGB = (HSL) => {
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

  // src/rgb-hsv.js
  var RGB2HSV = (RGB) => {
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
  var HSV2RGB = (HSV) => {
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

  // src/rgb-cmyk.js
  var RGB2CMYK = (RGB) => {
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
      Math.round(k * 100)
    ];
  };
  var CMYK2RGB = (CMYK) => {
    const c = clamp(toInt(CMYK[0]), 0, 100) / 100;
    const m = clamp(toInt(CMYK[1]), 0, 100) / 100;
    const y = clamp(toInt(CMYK[2]), 0, 100) / 100;
    const k = clamp(toInt(CMYK[3]), 0, 100) / 100;
    const r = (1 - c) * (1 - k);
    const g = (1 - m) * (1 - k);
    const b = (1 - y) * (1 - k);
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // src/rgb-yuv.js
  var RGB2YUV = (RGB) => {
    const r = toInt(RGB[0]);
    const g = toInt(RGB[1]);
    const b = toInt(RGB[2]);
    const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    const u = Math.round(((b - y) * 0.493 + 111) / 222 * 255);
    const v = Math.round(((r - y) * 0.877 + 155) / 312 * 255);
    return [y, u, v];
  };
  var YUV2RGB = (YUV) => {
    const y = toInt(YUV[0]);
    const u = toInt(YUV[1]) / 255 * 222 - 111;
    const v = toInt(YUV[2]) / 255 * 312 - 155;
    const r = Math.round(y + v / 0.877);
    const g = Math.round(y - 0.39466 * u - 0.5806 * v);
    const b = Math.round(y + u / 0.493);
    return [r, g, b];
  };

  // src/hex.js
  var HEX2RGB = (hex) => {
    let value = hex;
    if (value.charAt(0) === "#") {
      value = value.substr(1);
    }
    if (value.length < 2 || value.length > 6) {
      return false;
    }
    const v = value.split("");
    if (value.length === 2) {
      const gray = parseInt(v[0] + v[1], 16);
      return [gray, gray, gray];
    }
    if (value.length === 3) {
      return [
        parseInt(v[0] + v[0], 16),
        parseInt(v[1] + v[1], 16),
        parseInt(v[2] + v[2], 16)
      ];
    }
    if (value.length === 6) {
      return [
        parseInt(v[0] + v[1], 16),
        parseInt(v[2] + v[3], 16),
        parseInt(v[4] + v[5], 16)
      ];
    }
    return false;
  };
  var RGB2HEX = (RGB) => {
    const r = clamp(toInt(RGB[0]), 0, 255);
    const g = clamp(toInt(RGB[1]), 0, 255);
    const b = clamp(toInt(RGB[2]), 0, 255);
    return byteToHex(r) + byteToHex(g) + byteToHex(b);
  };

  // src/mix.js
  var mixRGB = (RGB1, RGB2) => [
    parseInt((RGB1[0] + RGB2[0]) / 2, 10),
    parseInt((RGB1[1] + RGB2[1]) / 2, 10),
    parseInt((RGB1[2] + RGB2[2]) / 2, 10)
  ];

  // src/parse.js
  var FUNC3_RE = /(rgb|hsl|yuv)\s*\(\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*\)/i;
  var CMYK_RE = /cmyk\s*\(\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*[, ]\s*(\d+)\s*%?\s*\)/i;
  var HEX_RE = /#([a-f0-9]{2,6})\b/i;
  var parse = (input) => {
    if (typeof input !== "string") {
      return false;
    }
    const cmykMatch = CMYK_RE.exec(input);
    if (cmykMatch) {
      return CMYK2RGB([
        parseInt(cmykMatch[1], 10),
        parseInt(cmykMatch[2], 10),
        parseInt(cmykMatch[3], 10),
        parseInt(cmykMatch[4], 10)
      ]);
    }
    const funcMatch = FUNC3_RE.exec(input);
    if (funcMatch) {
      const triple = [
        parseInt(funcMatch[2], 10),
        parseInt(funcMatch[3], 10),
        parseInt(funcMatch[4], 10)
      ];
      switch (funcMatch[1].toLowerCase()) {
        case "rgb":
          return triple;
        case "hsl":
          return HSL2RGB(triple);
        case "yuv":
          return YUV2RGB(triple);
        default:
          return false;
      }
    }
    const hexMatch = HEX_RE.exec(input);
    if (hexMatch) {
      return HEX2RGB(hexMatch[1]);
    }
    return false;
  };

  // src/complexity.js
  var complexity2int = (string) => {
    const keys = string.split("");
    let numbers = 1;
    let uletter = 1;
    let lletter = 1;
    let special = 1;
    for (let i = 0; i < keys.length; i += 1) {
      const code = keys[i].charCodeAt(0);
      if (code > 64 && code < 91) {
        uletter += 1;
      } else if (code > 96 && code < 123) {
        lletter += 1;
      } else if (code > 47 && code < 58) {
        numbers += 1;
      } else if (code > 32 && code < 127) {
        special += 1;
      }
    }
    return uletter * lletter * numbers * special + Math.round(uletter * 1.8 + lletter * 1.5 + numbers + special * 2) - 6;
  };
  var int2RGB = (intval) => {
    let value = intval;
    if (typeof value !== "number" && value !== false && value !== true) {
      value = parseInt(value, 10);
    }
    if (typeof value === "number" && !Number.isNaN(value)) {
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
  var complexity2RGB = (string) => int2RGB(complexity2int(string));

  // src/index.js
  var HSL2HEX = (HSL) => RGB2HEX(HSL2RGB(HSL));
  var HEX2HSL = (hex) => RGB2HSL(HEX2RGB(hex));
  var HSV2HEX = (HSV) => RGB2HEX(HSV2RGB(HSV));
  var HEX2HSV = (hex) => RGB2HSV(HEX2RGB(hex));
  var CMYK2HEX = (CMYK) => RGB2HEX(CMYK2RGB(CMYK));
  var HEX2CMYK = (hex) => RGB2CMYK(HEX2RGB(hex));
  var colorconv = {
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
    parse
  };
  var index_default = colorconv;
  return __toCommonJS(index_exports);
})();

  return __colorconvModule.default;
}));
