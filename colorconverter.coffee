#
# *
# * ColorConverter .js
# * Version:      0.08
# * License: MIT / BSD
# * By: Simon Waldherr
# *
# 

#jslint browser: true, indent: 2 
colorconv =
  RGB2HSL: (RGB) ->
    "use strict"
    r = Math.max(Math.min(parseInt(RGB[0], 10) / 255, 1), 0)
    g = Math.max(Math.min(parseInt(RGB[1], 10) / 255, 1), 0)
    b = Math.max(Math.min(parseInt(RGB[2], 10) / 255, 1), 0)
    max = Math.max(r, g, b)
    min = Math.min(r, g, b)
    l = (max + min) / 2
    d = undefined
    h = undefined
    s = undefined
    if max isnt min
      d = max - min
      s = (if l > 0.5 then d / (2 - max - min) else d / (max + min))
      if max is r
        h = (g - b) / d + ((if g < b then 6 else 0))
      else if max is g
        h = (b - r) / d + 2
      else
        h = (r - g) / d + 4
      h = h / 6
    else
      h = s = 0
    [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]

  HSL2RGB: (HSL) ->
    "use strict"
    h = Math.max(Math.min(parseInt(HSL[0], 10), 360), 0) / 360
    s = Math.max(Math.min(parseInt(HSL[1], 10), 100), 0) / 100
    l = Math.max(Math.min(parseInt(HSL[2], 10), 100), 0) / 100
    v = undefined
    min = undefined
    sv = undefined
    six = undefined
    fract = undefined
    vsfract = undefined
    r = undefined
    g = undefined
    b = undefined
    if l <= 0.5
      v = l * (1 + s)
    else
      v = l + s - l * s
    return [0, 0, 0]  if v is 0
    min = 2 * l - v
    sv = (v - min) / v
    h = 6 * h
    six = Math.floor(h)
    fract = h - six
    vsfract = v * sv * fract
    switch six
      when 1
        r = v - vsfract
        g = v
        b = min
      when 2
        r = min
        g = v
        b = min + vsfract
      when 3
        r = min
        g = v - vsfract
        b = v
      when 4
        r = min + vsfract
        g = min
        b = v
      when 5
        r = v
        g = min
        b = v - vsfract
      else
        r = v
        g = min + vsfract
        b = min
    [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]

  RGB2CMYK: (RGB) ->
    "use strict"
    red = Math.max(Math.min(parseInt(RGB[0], 10), 255), 0)
    green = Math.max(Math.min(parseInt(RGB[1], 10), 255), 0)
    blue = Math.max(Math.min(parseInt(RGB[2], 10), 255), 0)
    cyan = 1 - red
    magenta = 1 - green
    yellow = 1 - blue
    black = 1
    if red or green or blue
      black = Math.min(cyan, Math.min(magenta, yellow))
      cyan = (cyan - black) / (1 - black)
      magenta = (magenta - black) / (1 - black)
      yellow = (yellow - black) / (1 - black)
    else
      black = 1
    [Math.round(cyan * 255), Math.round(magenta * 255), Math.round(yellow * 255), Math.round(black + 254)]

  CMYK2RGB: (CMYK) ->
    "use strict"
    cyan = Math.max(Math.min(parseInt(CMYK[0], 10) / 255, 1), 0)
    magenta = Math.max(Math.min(parseInt(CMYK[1], 10) / 255, 1), 0)
    yellow = Math.max(Math.min(parseInt(CMYK[2], 10) / 255, 1), 0)
    black = Math.max(Math.min(parseInt(CMYK[3], 10) / 255, 1), 0)
    red = (1 - cyan * (1 - black) - black)
    green = (1 - magenta * (1 - black) - black)
    blue = (1 - yellow * (1 - black) - black)
    [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)]

  HEX2RGB: (hex) ->
    "use strict"
    return false  if (hex.length < 2) or (hex.length > 6)
    values = hex.split("")
    r = undefined
    g = undefined
    b = undefined
    if hex.length is 2
      r = parseInt(values[0].toString() + values[1].toString(), 16)
      g = r
      b = r
    else if hex.length is 3
      r = parseInt(values[0].toString(), 16)
      g = parseInt(values[1].toString(), 16)
      b = parseInt(values[2].toString(), 16)
    else if hex.length is 6
      r = parseInt(values[0].toString() + values[1].toString(), 16)
      g = parseInt(values[2].toString() + values[3].toString(), 16)
      b = parseInt(values[4].toString() + values[5].toString(), 16)
    else
      return false
    [r, g, b]

  RGB2HEX: (RGB) ->
    "use strict"
    hexr = Math.max(Math.min(parseInt(RGB[0], 10), 255), 0)
    hexg = Math.max(Math.min(parseInt(RGB[1], 10), 255), 0)
    hexb = Math.max(Math.min(parseInt(RGB[2], 10), 255), 0)
    hexr = (if hexr > 15 then hexr.toString(16) else "0" + hexr.toString(16))
    hexg = (if hexg > 15 then hexg.toString(16) else "0" + hexg.toString(16))
    hexb = (if hexb > 15 then hexb.toString(16) else "0" + hexb.toString(16))
    hexr + hexg + hexb

  RGB2YUV: (RGB) ->
    "use strict"
    r = parseInt(RGB[0], 10)
    g = parseInt(RGB[1], 10)
    b = parseInt(RGB[2], 10)
    y = undefined
    u = undefined
    v = undefined
    y = Math.round(0.299 * r + 0.587 * g + 0.114 * b)
    u = Math.round((((b - y) * 0.493) + 111) / 222 * 255)
    v = Math.round((((r - y) * 0.877) + 155) / 312 * 255)
    [y, u, v]

  YUV2RGB: (YUV) ->
    "use strict"
    y = parseInt(YUV[0], 10)
    u = parseInt(YUV[1], 10) / 255 * 222 - 111
    v = parseInt(YUV[2], 10) / 255 * 312 - 155
    r = undefined
    g = undefined
    b = undefined
    r = Math.round(y + v / 0.877)
    g = Math.round(y - 0.39466 * u - 0.5806 * v)
    b = Math.round(y + u / 0.493)
    [r, g, b]

  RGB2HSV: (RGB) ->
    "use strict"
    r = parseInt(RGB[0], 10) / 255
    g = parseInt(RGB[1], 10) / 255
    b = parseInt(RGB[2], 10) / 255
    max = Math.max(r, g, b)
    min = Math.min(r, g, b)
    d = max - min
    v = max
    h = undefined
    s = undefined
    if max is 0
      s = 0
    else
      s = d / max
    if max is min
      h = 0
    else
      switch max
        when r
          h = (g - b) / d + ((if g < b then 6 else 0))
        when g
          h = (b - r) / d + 2
        when b
          h = (r - g) / d + 4
      h = h / 6
    [h, s, v]

  HSV2RGB: (HSV) ->
    "use strict"
    r = undefined
    g = undefined
    b = undefined
    h = HSV[0]
    s = HSV[1]
    v = HSV[2]
    i = Math.floor(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    switch i % 6
      when 0
        r = v
        g = t
        b = p
      when 1
        r = q
        g = v
        b = p
      when 2
        r = p
        g = v
        b = t
      when 3
        r = p
        g = q
        b = v
      when 4
        r = t
        g = p
        b = v
      when 5
        r = v
        g = p
        b = q
    [r * 255, g * 255, b * 255]

  HSL2HEX: (HSL) ->
    "use strict"
    colorconv.RGB2HEX colorconv.HSL2RGB(HSL)

  HEX2HSL: (hex) ->
    "use strict"
    colorconv.RGB2HSL colorconv.HEX2RGB(hex)

  mixRGB: (RGB1, RGB2) ->
    "use strict"
    r = undefined
    g = undefined
    b = undefined
    r = parseInt((RGB1[0] + RGB2[0]) / 2, 10)
    g = parseInt((RGB1[1] + RGB2[1]) / 2, 10)
    b = parseInt((RGB1[2] + RGB2[2]) / 2, 10)
    [r, g, b]
