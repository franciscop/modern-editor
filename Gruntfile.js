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
        files: [
          'package.js', // To bump versions
          'Gruntfile.js',
          'src/*.js',
          'src/*.md',
          'src/*/*.js',
          'src/*/*.md',
          'web/*.jade',
          'web/*'
        ],
        tasks: ['default'],
        options: { spawn: false, },
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
    }
  });

  // Dynamically add plugins to the concat
  // Order of include is irrelevant http://stackoverflow.com/q/7609276
  grunt.registerTask("parse", "Join and concatenate", function(){
    
    // get the current concat config
    var concat = {
      main: { src: [ 'src/editor.js' ], dest: 'editor.js' }//,
      //test: { src: [ 'src/test.js' ], dest: 'test/test.js' }
    };
    
    fs.readdirSync(__dirname + "/src").forEach(function(name, i){
      if (/\./.test(name)) return false;
      var file = 'src/' + name + '/' + name + '.js';
      //var test = 'src/plugins/' + name + '/test.js';
      
      if (!fs.existsSync(file)) throw new Error("File '" + file + "' doesn't exist");
      
      concat.main.src.push(file);
      //concat.test.src.push(test);
    });
    
    // save the new concat configuration
    grunt.config.set('concat', concat);
  });

  // Concatenate
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Minify
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Watch
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Jade
  grunt.loadNpmTasks('grunt-contrib-jade');
  
  // Testing
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  
  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal
  grunt.registerTask('default', ['parse', 'concat', 'uglify', /*'jade', 'mocha_phantomjs'*/]);
};
