// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            js: {
                files: ['./src/client/app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: '<%%= connect.options.livereload %>',
                    livereloadOnError: false
                }
            },
            css: {
                files: ['./src/client/css/**/*.css'],
                tasks: ['copy:css', 'autoprefixer']
            },
            livereload: {
                files: [
                    './src/client/index.html',
                    './src/client/app/**/*.html',
                    './src/client/app/**/*.json',
                    './.tmp/css/**/*.css'
                ],
                options: {
                    livereload: '<%%= connect.options.livereload %>',
                    livereloadOnError: false
                }
            }
        },

        connect: {
            options: {
                port: <%= portNumber %>,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect().use('/css', connect.static('./.tmp/css')),
                            connect.static('./src/client'),
                            connect().use('/node_modules/<%= themeName %>', connect.static('./node_modules/<%= themeName %>')),
                            connect().use('/js/gnap', connect.static('./node_modules/<%= themeName %>/js/gnap')),
                            connect().use('/js/angular', connect.static('./node_modules/<%= themeName %>/js/angular'))
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: './dist/client',
                    livereload: false
                }
            }
        },

        // https://github.com/postcss/autoprefixer#browsers
        // npm update caniuse-db
        autoprefixer: {
            options: {
                browsers: ['> 0%', 'last 2 versions', 'ie 8', 'ie 9']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: '**/*.css',
                    dest: '.tmp/css/'
                }]
            }
        },

        useminPrepare: {
            options: {
                dest: 'dist/client/'
            },
            html: './src/client/index.html'
        },

        usemin: {
            options: {
                assetsDirs: [
                    'dist/client',
                    'dist/client/vendor/images',
                    'dist/client/vendor/css',
                    'dist/client/vendor/fonts'
                ],
                patterns: {
                    js: [
                        [/templateUrl:"(.+?\.html)"/gm, 'Update the JS to reference our revved templates']
                    ]
                }
            },
            html: ['./dist/client/index.html'],
            css: ['./dist/client/app/css/*.css', './dist/client/vendor/css/*.css'],
            js: ['./dist/client/app/js/*.js'],
        },

        rev: {
            predist: {
                files: {
                    src: [
                        // TODO: dist/app/ *.json
                        './dist/client/app/**/*.html',
                        './dist/client/app/js/*.js',
                        './dist/client/app/css/*.css',
                        './dist/client/vendor/css/*.css',
                        './dist/client/vendor/fonts/*.*',
                        './dist/client/vendor/images/**/*.*',
                        './dist/client/vendor/js/*.js'
                    ]
                }
            },
            dist: {
                files: {
                    src: [
                        './dist/client/app/css/*.css',
                        './dist/client/vendor/css/*.css',
                        './dist/client/app/js/*.js'
                    ]
                }
            }
        },

        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            'dist/client/*',
                            '!dist/client/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        copy: {
            css: {
                expand: true,
                dot: true,
                cwd: './src/client/css/',
                dest: '.tmp/css/',
                src: '**/*.css'
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: 'src/client',
                        dest: 'dist/client',
                        src: [
                            './index.html',
                            './**/*.html',
                            './**/*.json'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'node_modules/<%= themeName %>',
                        dest: './dist/client/vendor',
                        src: [
                            './fonts/*.*',
                            './images/*.*',
                            './images/**/*.*',
                            './js/gnap/*.json',
                            './js/angular/i18n/*.js'
                        ]
                    }
                ]
            }
        },

        replace: {
            translations: {
                src: ['./dist/client/vendor/js/vendor.js'],
                overwrite: true,
                replacements: [
                    {
                        from: '{part}/translations.{lang}.json', // TODO: In the future this should probably come from a replace token
                        to: '{part}/translations.{lang}.json?<%%= grunt.task.current.args[0] %>'
                    }
                ]
            },

            dist: {
                src: [
                    './dist/client/index.html',
                    './dist/client/app/js/app.js',
                    './dist/client/vendor/js/vendor.js',
                    './dist/client/vendor/css/*.css'],
                overwrite: true,
                replacements: [
                    {
                        from: 'node_modules/<%= themeName %>/images/',
                        to: 'vendor/images/'
                    },
                    {
                        from: 'url("../../fonts',
                        to: 'url("../fonts',
                    },
                    {
                        from: 'url(\'../../fonts',
                        to: 'url(\'../fonts',
                    },
                    {
                        from: 'url(../../fonts',
                        to: 'url(../fonts',
                    },
                    {
                        from: 'url("../../images',
                        to: 'url("../images',
                    },
                    {
                        from: 'url(\'../../images',
                        to: 'url(\'../images',
                    },
                    {
                        from: 'url(../../images',
                        to: 'url(../images',
                    },
                    {
                        from: 'js/angular/i18n',
                        to: 'vendor/js/angular/i18n',
                    },
                    {
                        from: 'addPart("js/gnap")',
                        to: 'addPart("vendor/js/gnap")',
                    }
                ]
            }
        },

        uglify: {
            dist: {
                files: [
                    {
                        expand: true,
                        flatten: false,
                        cwd: './dist/client/vendor/js/angular/i18n/',
                        src: ['./*.js'],
                        dest: './dist/client/vendor/js/angular/i18n/'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    preserveLineBreaks: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true
                },
                files: [
                    {
                        expand: true,
                        cwd: './dist/client',
                        src: '**/*.html',
                        dest: './dist/client'
                    }
                ]
            }
        },

        concat: {
            translations: {
                files: [
                    {
                        dest: '.tmp/translations.json',
                        src: ['./dist/client/vendor/**/translations.en.json',
                              './dist/client/vendor/**/translations.fr.json',
                              './dist/client/vendor/**/translations.nl.json',
                              './dist/client/app/**/translations.en.json',
                              './dist/client/app/**/translations.fr.json',
                              './dist/client/app/**/translations.nl.json']
                    }
                ]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                './src/client/app/*.js',
                './src/client/app/**/*.js'
            ]
        }
    });

    grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function(target) {
        if (grunt.option('allow-remote')) {
            grunt.config.set('connect.options.hostname', '0.0.0.0');
        }

        if (target === 'dist') {
            return grunt.task.run(['dist', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'copy:css',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('hash-translations', function() {
        var hash = require('crypto').createHash('md5');
        hash.update(grunt.file.read('.tmp/translations.json'), 'utf8');
        var translationHash = hash.digest('hex').slice(0, 8);

        grunt.log.write('Translation hash: ' + translationHash);
        grunt.task.run(['replace:translations:' + translationHash]);
    });

    grunt.registerTask('dist', [
        'clean:dist',
        'useminPrepare',
        'copy:css',
        'autoprefixer',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'copy:dist',
        'concat:translations',
        'replace:dist',
        'uglify:dist',
        'hash-translations',
        'rev:predist',
        'usemin',
        'rev:dist',
        'usemin:html',
        'htmlmin'
    ]);
};
