fs = require('fs');

// This builds the library itself
module.exports = function (grunt) {

  // Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: { banner: '/* Modern Editor ' + require('./package').version + ' */\n'},
      build: { src: 'editor.js', dest: 'editor.min.js' }
    },

    watch: {
      scripts: {
        files: ['package.js', 'Gruntfile.js', 'src/*.*', 'src/**/*.*'],
        tasks: ['default'],
        options: { spawn: false, },
      }
    },

    concat: {
      files: {
        'editor.js': [
          'bower_components/mousetrap/mousetrap.js',
          'bower_components/umbrella/umbrella.js',
          'src/editor.js',
          'src/**/*.js'
        ]
      }
    },

    jade: {
      compile: {
        options: {
          client: false
        },
        files: [ {
          cwd: "web",
          src: "**/*.html.jade",
          dest: ".",
          expand: true,
          ext: ".html"
        } ]
      }
    },

    mocha_phantomjs: {
      all: './tests.html'
    },

    bytesize: {
      all: {
        src: [
          'editor.min.js'
        ]
      }
    }
  });

  // Concatenate
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-bytesize');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal
  grunt.registerTask('default', ['concat', 'uglify', 'bytesize' /*'jade', 'mocha_phantomjs'*/]);
};
