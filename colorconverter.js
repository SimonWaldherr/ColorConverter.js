/*
 *
 * ColorConverter
 * Version   0.01
 * License:   MIT
 * Simon Waldherr
 *
 */


function convRGBtoHSL(rgb) {
  "use strict";
  var r = Math.max(Math.min(rgb[0] / 255, 255), 0),
      g = Math.max(Math.min(rgb[1] / 255, 255), 0),
      b = Math.max(Math.min(rgb[2] / 255, 255), 0),
      max = Math.max(r, g, b), 
      min = Math.min(r, g, b),
      d, h, s, l = (max + min) / 2;
  if(max !== min) {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if(max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h = h / 6;
  } else {
    h = s = 0;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function convHSLtoRGB(hsl) {
  "use strict";
  var h = Math.max(Math.min(hsl[0], 360), 0) / 360,
      s = Math.max(Math.min(hsl[1], 100), 0) / 100,
      l = Math.max(Math.min(hsl[2], 100), 0) / 100,
      v, min, sv, six, fract, vsfract, r, g, b;
  if (l <= 0.5) {
    v = l * (1 + s);
  } else {
    v = l + s - l * s;
  }
  if(v === 0) {
    return [0, 0, 0];
  }
  min = 2 * l - v;
  sv = (v - min) / v;
  h = 6 * h;
  six = Math.floor(h);
  fract = h - six;
  vsfract = v * sv * fract;
  if (six === 0 || six === 6) {
    r = v;
    g = min + vsfract; 
    b = min;
  }
  else if (six === 1) {
    r = v - vsfract;
    g = v;
    b = min;
  }
  else if (six === 2) {
    r = min;
    g = v;
    b = min + vsfract;
  }
  else if (six === 3) {
    r = min;
    g = v - vsfract;
    b = v;
  }
  else if (six === 4) {
    r = min + vsfract;
    g = min;
    b = v;
  }
  else if (six === 5) {
    r = v;
    g = min;
    b = v - vsfract;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function convHEXtoRGB(hex) {
  "use strict";
  if((hex.length < 2)||(hex.length > 6)) {
    return false;
  }
  var values = hex.split(''),
      r, g, b;
  if(hex.length === 2) {
    r = parseInt(values[0].toString() + values[1].toString(), 16);
    g = r;
    b = r;
  } else if(hex.length === 3) {
    r = parseInt(values[0].toString(), 16);
    g = parseInt(values[1].toString(), 16);
    b = parseInt(values[2].toString(), 16);
  } else if(hex.length === 6) {
    r = parseInt(values[0].toString() + values[1].toString(), 16);
    g = parseInt(values[2].toString() + values[3].toString(), 16);
    b = parseInt(values[4].toString() + values[5].toString(), 16);
  } else {
    return false;
  }
  return [r, g, b];
}

function convRGBtoHEX(rgb) {
  "use strict";
  var hexr = Math.max(Math.min(parseInt(rgb[0], 10), 255), 0),
      hexg = Math.max(Math.min(parseInt(rgb[1], 10), 255), 0),
      hexb = Math.max(Math.min(parseInt(rgb[2], 10), 255), 0);
  hexr = hexr > 15 ? hexr.toString(16) : '0'+hexr.toString(16);
  hexg = hexg > 15 ? hexg.toString(16) : '0'+hexg.toString(16);
  hexb = hexb > 15 ? hexb.toString(16) : '0'+hexb.toString(16);
  return hexr+hexg+hexb;
}

function convHSLtoHEX(hsl) {
  "use strict";
  return convRGBtoHEX( convHSLtoRGB( hsl ) );
}

function convHEXtoHSL(hex) {
  "use strict";
  return convRGBtoHSL( convHEXtoRGB( hex ) );
}
