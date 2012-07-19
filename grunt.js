module.exports = function(grunt) {
  grunt.initConfig({
    lint: {
      test: 'test/*.js',
      main: 'photographer.js'
    },
    jasmine: {
      main: {
        src: ['test/spec_runner.html'],
        timeout: 2000
      }
    },
    min: {
     main: {
        src: 'photographer.js',
        dest: 'photographer.min.js',
      }
    },
    jshint: {
      options: {
        // enforcing
        bitwise: true,
        curly: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        trailing: true,
        // relaxing
        boss: true,
        es5: true,
        evil: true,
        expr: true,
        // environment
        browser: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-task');

  grunt.registerTask('prod', 'lint jasmine min');
};
