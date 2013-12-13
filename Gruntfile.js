module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        cssmin: {
            combine: {
                options: {
                    banner: '/*! Pomodorino Uses the MIT Licence */'
                },
                files: {
                    'css/production.min.css': ['css/*.css']
                }
            }
        },

        concat: {
            dist: {
                src: [
                    'js/jquery.js',
                    'js/foundation.min.js',
                    'js/notify.min.js',
                    'js/main.js'
                ],
                dest: 'js/production.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! Pomodorino Uses the MIT Licence */'
            },
            build: {
                files: {
                    'js/production.min.js': ['js/production.js']
                }
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'img/'
                }]
            }
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['cssmin', 'concat', 'uglify', 'imagemin']);

};