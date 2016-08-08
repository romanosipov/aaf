module.exports = function(grunt) {
  var loadNpmTasks = function() {
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-bump');
  };
  loadNpmTasks();

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'clean': {
      debug: ['_dist/'],
      release: ['dist/'],
    },

    'sass': {
      debug: {
        options: {
          style: 'expanded',
        },
        files: {
          '_dist/debug/css/app.css': 'src/sass/app.scss',
        }
      },
      release: {
        options: {
          style: 'compressed',
        },
        files: {
          'dist/css/app.css': 'src/sass/app.scss',
        }
      },
    },

    'copy': {
      'html': {
        files: [
          {expand: true, cwd: 'src/html/', src: '**', dest: '_dist/debug/'},
        ],
      },

      'html-release': {
        files: [
          {expand: true, cwd: 'src/html/', src: '**', dest: 'dist/'},
        ],
      },

      'livereload': {
        files: [{expand: true, cwd: 'bower_components/livereload-js/', src: 'livereload.js', dest: '_dist/debug/js/'}],
      },

      'fonts': {
        files: [{expand: true, cwd: 'bower_components/bootstrap-sass/assets/fonts/bootstrap/', src: '**', dest: '_dist/debug/css/fonts/'}],
      },

      'fonts-release': {
        files: [{expand: true, cwd: 'bower_components/bootstrap-sass/assets/fonts/bootstrap/', src: '**', dest: 'dist/css/fonts/'}],
      },

      'sample': {
        files: [
          {
            expand: true,
            cwd: 'sample',
            src: '**',
            dest: 'dist/sample',
          },
          {
            expand: true,
            cwd: 'bower_components/angular',
            src: 'angular.min.js',
            dest: 'dist/sample/js',
          },
          {
            expand: true,
            cwd: 'bower_components/angular-route',
            src: 'angular-route.min.js',
            dest: 'dist/sample/js',
          },
          {
            expand: true,
            cwd: 'bower_components/pouchdb/dist',
            src: 'pouchdb.min.js',
            dest: 'dist/sample/js',
          },
          {
            expand: true,
            cwd: 'bower_components/pouchdb-find/dist',
            src: 'pouchdb.find.min.js',
            dest: 'dist/sample/js',
          },
          {
            expand: true,
            cwd: 'bower_components/angular-pouchdb',
            src: 'angular-pouchdb.min.js',
            dest: 'dist/sample/js',
          },
        ],
      },
    },

    'concat': {
      'js': {
        src: [
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
          'bower_components/angular/angular.min.js',
          'bower_components/angular-route/angular-route.min.js',
          'bower_components/pouchdb/dist/pouchdb.min.js',
          'bower_components/pouchdb-find/dist/pouchdb.find.min.js',
          'bower_components/angular-pouchdb/angular-pouchdb.min.js',
          'src/js/**/*.js',
        ],
        dest: '_dist/debug/js/app.js',
      },
    },

    'http-server': {
      debug: {
        root: 'dist',
        port: 8282,
        openBrowser: false,
      },
    },

    'watch': {
      options: {
        livereload: true,
      },

      'html': {
        files: 'src/html/**/*.html',
        tasks: ['copy:html'],
      },

      'css': {
        files: 'src/sass/**/*.scss',
        tasks: ['sass:debug'],
      },

      'js': {
        files: 'src/js/**/*.js',
        tasks: ['concat'],
      },
    },

    'uglify': {
      release: {
        options: {
          sourceMap: true,
        },
        files: {
          'dist/aaf-min.js': [
            'src/js/**/*.js',
          ],
        }
      },
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
      },
    },
  });

  grunt.registerTask('build:debug',     ['clean:debug', 'sass:debug', 'copy:html', 'copy:fonts', 'concat:js']);
  grunt.registerTask('build:release',   ['clean:release', 'uglify', 'build:sample']);
  grunt.registerTask('package:release', ['clean:release', 'uglify', 'build:sample', 'bump']);
  grunt.registerTask('build:sample', ['copy:sample']);

  grunt.registerTask('default', ['build:debug']);

};
