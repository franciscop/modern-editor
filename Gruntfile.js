fs = require('fs');

// This builds the library itself
module.exports = function (grunt) {

  // Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        options: {
          process: function (src, file) {
            return /test\.js/.test(file) ? '' : src;
          }
        },
        src: [
          'bower_components/umbrella/umbrella.js',
          'bower_components/mousetrap/mousetrap.js',
          'src/editor.js',
          'src/*/*.*',
        ],
        dest: 'editor.js'
      },
      test: {
        files: {
          'test/test.js': ['src/test.js', 'src/*/test.js']
        }
      }
    },

    uglify: {
      options: { banner: '/* Modern Editor ' + require('./package').version + ' */\n'},
      build: { src: 'editor.js', dest: 'editor.min.js' }
    },

    bytesize: {
      all: {
        src: [
          'editor.min.js'
        ]
      }
    },

    sass: {
      dev: {
        files: {
          'editor.css': 'src/editor.scss'
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'editor.min.css': 'src/editor.scss'
        }
      }
    },

    watch: {
      scripts: {
        files: ['package.js', '*.js', 'src/*.*', 'src/**/*.*', 'test/*.*'],
        tasks: ['default'],
        options: { spawn: false, livereload: true },
      }
    }
  });

  // Concatenate
  grunt.loadNpmTasks('grunt-rollup');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-bytesize');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal
  grunt.registerTask('default', ['concat', 'uglify', 'sass', 'bytesize']);
};
