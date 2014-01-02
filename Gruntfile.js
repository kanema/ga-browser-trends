module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    watch: {
      files: ['<%= jshint.client.src %>', '<%= jshint.server.src %>'],
      tasks: 'default'
    },
    jshint: {
      options: {
        sub: true
      },
      client: {
        options: {
          globals: {
            window: true,
            jQuery: true,
            Highcharts: true
          },
        },
        src: [
          'public/javascripts**/*.js',
        ]
      },
      server: {
        options: {
          sub: true,
          globals: {
            exports: true
          },
        },
        src: [
          'lib/**/*.js',
          'routes/**/*.js',
          'app.js',
          'config.js',
          'Gruntfile.js'
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint',  'watch']);

};