module.exports = function(grunt) {
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compare_size: {
      files: [ "colorconverter.js", "colorconverter.min.js" ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip( contents, {} ).length;
          }
        },
        cache: ".sizecache.json"
      }
    },
    uglify: {
      options: {
        banner: '/* * * * * * * * * * * *\n' +
                ' *  ColorConverter.js  *\n' +
                ' * Version:     <%= pkg.version %>  *\n' +
                ' * License:  MIT / BSD *\n' +
                ' * By:  Simon Waldherr *\n' +
                ' * * * * * * * * * * * */\n\n'
      },
      dist: {
        files: {
          './colorconverter.min.js': ['./colorconverter.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, src: 'colorconverter.min.js', dest: '/', ext: '.gz.js'}
        ]
      }
    }
  });
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify', 'compare_size']);
};
