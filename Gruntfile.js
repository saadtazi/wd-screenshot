module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['lib-cov/**', 'examples/**', 'node_modules/**']
      },
      all: ['**/*.js']
    },

    clean: {
      coverage: {
        src: ['lib-cov/', 'coverage/*.html']
      }
    },
    copy: {
      test: {
        src: ['test/**'],
        dest: 'lib-cov/'
      }
    },
    blanket: {
      spec: {
        src: ['lib/'],
        dest: 'lib-cov/lib/'
      }
    },

    mochaTest: {
      options: {
        require: ['lib-cov/test/globals.js']
      },
      'mocha-lcov-reporter': {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: 'lcov.info'
        },
        src: ['lib-cov/test/spec/**/*.js']
      },
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['lib-cov/test/spec/**/*.js']
      },

      testLocal: {
        options: {
          reporter: 'spec'
        },
        src: ['lib-cov/test/spec/**/*.spec.js']
      },
      testpure: {
        options: {
          reporter: 'spec',
          require: ['test/globals.js']
        },
        src: ['test/spec/**/*.spec.js']
      },
      'htmlcov': {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'lib-cov/coverage.html'

        },
        src: ['lib-cov/test/spec/**/*.js']
      }

    },

    coveralls: {
      options: {
        force: true
      },
      all: {
        src: 'lcov.info'
      }
    },

    watch: {
      test: {
        files: ['**/*.js'],
        tasks: ['test']
      },
      puretest: {
        files: ['**/*.js'],
        tasks: ['clean', 'mochaTest:testpure']
      },

      cov: {
        files: ['**/*.js'],
        tasks: ['cov']
      }
    }


  });

  grunt.registerTask('prepare', [ 'clean',
                                  'copy',
                                  'blanket'
                                ]);

  grunt.registerTask('puretest', [ 'watch:puretest']);

  grunt.registerTask('test', [ 'jshint',
                               'mochaTest:testpure'
                              ]);

  grunt.registerTask('default', 'test');

  grunt.registerTask('cov', [ 'test',
                              'prepare',
                              'mochaTest:htmlcov'
                            ]);


  grunt.registerTask('travis', [  'jshint',
                                  'prepare',
                                  'mochaTest:mocha-lcov-reporter',
                                   'mochaTest:travis-cov',
                                   'coveralls'
                                ]);
  grunt.registerTask('default', ['jshint', 'test']);

};