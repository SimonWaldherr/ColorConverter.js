var colorconv = require('./colorconverter.js'),
  colors = require('colors'),
  error = false;

process.stdout.write("\ncolorconverter.js\nnode-test\n\n");

function arrayIsEqual(array1, array2) {
  var i = 0;
  if(array1.length !== array2.length) {
    return false;
  }
  for(i = array1.length; i--;) {
    if(array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

process.stdout.write("RGB2HSL([123,222,42]): \t");
var test_hsl = colorconv.RGB2HSL([123,222,42]);
if(arrayIsEqual(test_hsl,[ 93, 73, 52 ])) {
  console.log(test_hsl.join().green);
} else {
  console.log(test_hsl.join().red);
  error = true;
}

process.stdout.write("HSL2RGB([93,73,52]): \t");
var test_rgb = colorconv.HSL2RGB([93,73,52]);
if(arrayIsEqual(test_rgb,[ 124, 222, 43 ])) {
  console.log(test_rgb.join().green);
} else {
  console.log(test_rgb.join().red);
  error = true;
}

process.stdout.write("RGB2CMYK([43,70,115]): \t");
var test_cmyk = colorconv.RGB2CMYK([43,70,115]);
if(arrayIsEqual(test_cmyk,[ 63, 39, 0, 55 ])) {
  console.log(test_cmyk.join().green);
} else {
  console.log(test_cmyk.join().red);
  error = true;
}

process.stdout.write("CMYK2RGB([63,39,0,55]): \t");
var test_cmyk2rgb = colorconv.CMYK2RGB([63,39,0,55]);
if(arrayIsEqual(test_cmyk2rgb,[ 42, 70, 115 ])) {
  console.log(test_cmyk2rgb.join().green);
} else {
  console.log(test_cmyk2rgb.join().red);
  error = true;
}

process.stdout.write("RGB2HSV([100,150,200]): \t");
var test_hsv = colorconv.RGB2HSV([100,150,200]);
var test_hsv_back = colorconv.HSV2RGB(test_hsv);
if(arrayIsEqual(test_hsv_back,[ 100, 150, 200 ])) {
  console.log(test_hsv_back.join().green);
} else {
  console.log(test_hsv_back.join().red);
  error = true;
}

process.stdout.write("HEX2CMYK(ff0000): \t");
var test_hex2cmyk = colorconv.HEX2CMYK('ff0000');
if(arrayIsEqual(test_hex2cmyk,[ 0, 100, 100, 0 ])) {
  console.log(test_hex2cmyk.join().green);
} else {
  console.log(test_hex2cmyk.join().red);
  error = true;
}

process.stdout.write("HSV2HEX([0,0,1]): \t");
var test_hsv2hex = colorconv.HSV2HEX([0,0,1]);
if(test_hsv2hex === 'ffffff') {
  console.log(test_hsv2hex.green);
} else {
  console.log(test_hsv2hex.red);
  error = true;
}

process.stdout.write("\nStatus: ");
if(error) {
  console.log("ERROR".red);
} else {
  console.log("PASS".green);
}
process.stdout.write("\n");
