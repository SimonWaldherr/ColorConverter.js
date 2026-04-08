#
# *
# * ColorConverter .js
# * Version:     0.2.0
# * License: MIT / BSD
# * By: Simon Waldherr
# *
#

#jslint browser: true, indent: 2

#
#  RGB2HSL
#  HSL2RGB
#  RGB2CMYK
#  CMYK2RGB
#  HEX2RGB
#  RGB2HEX
#  RGB2YUV
#  YUV2RGB
#  RGB2HSV
#  HSV2RGB
#  HSL2HEX
#  HEX2HSL
#  HSV2HEX
#  HEX2HSV
#  CMYK2HEX
#  HEX2CMYK
#  complexity2int
#  mixRGB
#  parse
#
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
    [
      Math.round(h * 360)
      Math.round(s * 100)
      Math.round(l * 100)
    ]

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
    if v is 0
      return [
        0
        0
        0
      ]
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
    [
      Math.round(r * 255)
      Math.round(g * 255)
      Math.round(b * 255)
    ]

  RGB2CMYK: (RGB) ->
    "use strict"
    r = Math.max(Math.min(parseInt(RGB[0], 10), 255), 0) / 255
    g = Math.max(Math.min(parseInt(RGB[1], 10), 255), 0) / 255
    b = Math.max(Math.min(parseInt(RGB[2], 10), 255), 0) / 255
    k = 1 - Math.max(r, Math.max(g, b))
    c = undefined
    m = undefined
    y = undefined
    if k is 1
      return [0, 0, 0, 100]
    c = (1 - r - k) / (1 - k)
    m = (1 - g - k) / (1 - k)
    y = (1 - b - k) / (1 - k)
    [
      Math.round(c * 100)
      Math.round(m * 100)
      Math.round(y * 100)
      Math.round(k * 100)
    ]

  CMYK2RGB: (CMYK) ->
    "use strict"
    c = Math.max(Math.min(parseInt(CMYK[0], 10), 100), 0) / 100
    m = Math.max(Math.min(parseInt(CMYK[1], 10), 100), 0) / 100
    y = Math.max(Math.min(parseInt(CMYK[2], 10), 100), 0) / 100
    k = Math.max(Math.min(parseInt(CMYK[3], 10), 100), 0) / 100
    r = (1 - c) * (1 - k)
    g = (1 - m) * (1 - k)
    b = (1 - y) * (1 - k)
    [
      Math.round(r * 255)
      Math.round(g * 255)
      Math.round(b * 255)
    ]

  HEX2RGB: (hex) ->
    "use strict"
    hex = hex.substr(1)  if hex.charAt(0) is "#"
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
      r = parseInt(values[0].toString() + values[0].toString(), 16)
      g = parseInt(values[1].toString() + values[1].toString(), 16)
      b = parseInt(values[2].toString() + values[2].toString(), 16)
    else if hex.length is 6
      r = parseInt(values[0].toString() + values[1].toString(), 16)
      g = parseInt(values[2].toString() + values[3].toString(), 16)
      b = parseInt(values[4].toString() + values[5].toString(), 16)
    else
      return false
    [
      r
      g
      b
    ]

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
    [
      y
      u
      v
    ]

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
    [
      r
      g
      b
    ]

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
    [
      h
      s
      v
    ]

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
    [
      Math.round(r * 255)
      Math.round(g * 255)
      Math.round(b * 255)
    ]

  HSL2HEX: (HSL) ->
    "use strict"
    colorconv.RGB2HEX colorconv.HSL2RGB(HSL)

  HEX2HSL: (hex) ->
    "use strict"
    colorconv.RGB2HSL colorconv.HEX2RGB(hex)

  HSV2HEX: (HSV) ->
    "use strict"
    colorconv.RGB2HEX colorconv.HSV2RGB(HSV)

  HEX2HSV: (hex) ->
    "use strict"
    colorconv.RGB2HSV colorconv.HEX2RGB(hex)

  CMYK2HEX: (CMYK) ->
    "use strict"
    colorconv.RGB2HEX colorconv.CMYK2RGB(CMYK)

  HEX2CMYK: (hex) ->
    "use strict"
    colorconv.RGB2CMYK colorconv.HEX2RGB(hex)

  complexity2int: (string) ->
    "use strict"
    valunicode = undefined
    keys = string.split("")
    numbers = 1
    uletter = 1
    lletter = 1
    special = 1
    complex = 0
    i = undefined
    i = 0
    while i < keys.length
      valunicode = keys[i].charCodeAt(0)
      if (valunicode > 0x40) and (valunicode < 0x5B)

        #Großbuchstaben A-Z
        uletter += 1
      else if (valunicode > 0x60) and (valunicode < 0x7B)

        #Kleinbuchstaben a-z
        lletter += 1
      else if (valunicode > 0x2F) and (valunicode < 0x3A)

        #Zahlen 0-9
        numbers += 1

      #Sonderzeichen
      else special += 1  if (valunicode > 0x20) and (valunicode < 0x7F)
      i += 1
    complex = ((uletter * lletter * numbers * special) + Math.round(uletter * 1.8 + lletter * 1.5 + numbers + special * 2)) - 6
    complex

  int2RGB: (intval) ->
    "use strict"
    intval = parseInt(intval, 10)  if (typeof intval isnt "number") and (intval isnt false) and (intval isnt true)
    if typeof intval is "number"
      if (intval < 115) and (intval > 1)
        return [
          255
          153 + intval
          153 - intval
        ]
      if (intval > 115) and (intval < 230)
        return [
          255 - intval
          243
          63
        ]
      if (intval > 230) or (intval is true)
        return [
          145
          243
          63
        ]
    if intval is "none"
      return [
        204
        204
        204
      ]
    if intval is true
      return [
        204
        204
        204
      ]
    false

  complexity2RGB: (string) ->
    "use strict"
    colorconv.int2RGB colorconv.complexity2int(string)

  mixRGB: (RGB1, RGB2) ->
    "use strict"
    r = undefined
    g = undefined
    b = undefined
    r = parseInt((RGB1[0] + RGB2[0]) / 2, 10)
    g = parseInt((RGB1[1] + RGB2[1]) / 2, 10)
    b = parseInt((RGB1[2] + RGB2[2]) / 2, 10)
    [
      r
      g
      b
    ]

  parse: (input) ->
    "use strict"
    geregext = undefined
    pattern = /((rgb|hsl|#|yuv)(\(([%, ]*([\d]+)[%, ]+([\d]+)[%, ]+([\d]+)[%, ]*)+\)|([a-f0-9]+)))/g
    geregext = pattern.exec(input)
    if geregext isnt null
      switch geregext[2]
        when "#"
          return colorconv.HEX2RGB(geregext[3])
        when "rgb"
          return [

          ]
        when "hsl"
          return colorconv.HSL2RGB([

          ])
        when "yuv"
          return colorconv.YUV2RGB([

          ])
        else
          return false
    false
