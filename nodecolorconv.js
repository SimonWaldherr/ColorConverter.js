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
if(arrayIsEqual(test_cmyk,[ 160, 100, 0, 140 ])) {
  console.log(test_cmyk.join().green);
} else {
  console.log(test_cmyk.join().red);
  error = true;
}

process.stdout.write("\nStatus: ");
if(error) {
  console.log("ERROR".red);
} else {
  console.log("PASS".green);
  error = true;
}
process.stdout.write("\n");
