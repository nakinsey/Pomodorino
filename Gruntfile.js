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
                banner: '/*! Pomodorino Uses the MIT Licence */\n'
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

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask('default', ['cssmin', 'concat', 'uglify', 'imagemin']);

};