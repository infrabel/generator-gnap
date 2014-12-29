// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            js: {
                files: ['./src/web/app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: '<%%= connect.options.livereload %>',
                    livereloadOnError: false
                }
            },
            css: {
                files: ['./src/web/css/**/*.css'],
                tasks: ['newer:encoding:all', 'copy:css', 'autoprefixer']
            },
            livereload: {
                files: [
                    './src/web/index.html',
                    './src/web/app/**/*.html',
                    './src/web/app/**/*.json',
                    './.tmp/css/**/*.css'
                ],
                tasks: ['newer:encoding:all'],
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
                            connect.static('./src/web'),
                            connect().use('/node_modules/<%= themeName %>', connect.static('./node_modules/<%= themeName %>')),
                            connect().use('/js/gnap', connect.static('./node_modules/<%= themeName %>/js/gnap')),
                            connect().use('/js/angular', connect.static('./node_modules/<%= themeName %>/js/angular')),
                            connect().use('/js/debug/angular', connect.static('./node_modules/<%= themeName %>/js/debug/angular'))
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: './dist/web',
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
                dest: 'dist/web/'
            },
            html: './src/web/index.html'
        },

        usemin: {
            options: {
                assetsDirs: [
                    'dist/web',
                    'dist/web/vendor/images',
                    'dist/web/vendor/css',
                    'dist/web/vendor/fonts'
                ],
                patterns: {
                    js: [
                        [/templateUrl:"(.+?\.html)"/gm, 'Update the JS to reference our revved templates']
                    ]
                }
            },
            html: ['./dist/web/index.html'],
            css: ['./dist/web/app/css/*.css', './dist/web/vendor/css/*.css'],
            js: ['./dist/web/app/js/*.js'],
        },

        rev: {
            predist: {
                files: {
                    src: [
                        // TODO: dist/app/ *.json
                        './dist/web/app/**/*.html',
                        './dist/web/app/js/*.js',
                        './dist/web/app/css/*.css',
                        './dist/web/vendor/css/*.css',
                        './dist/web/vendor/fonts/*.*',
                        './dist/web/vendor/images/**/*.*',
                        './dist/web/vendor/js/*.js'
                    ]
                }
            },
            dist: {
                files: {
                    src: [
                        './dist/web/app/css/*.css',
                        './dist/web/vendor/css/*.css',
                        './dist/web/app/js/*.js'
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
                            'dist/web/*',
                            '!dist/web/.git*'
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
                cwd: './src/web/css/',
                dest: '.tmp/css/',
                src: '**/*.css'
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: 'src/web',
                        dest: 'dist/web',
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
                        dest: './dist/web/vendor',
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
                src: ['./dist/web/vendor/js/vendor.js'],
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
                    './dist/web/index.html',
                    './dist/web/app/js/app.js',
                    './dist/web/vendor/js/vendor.js',
                    './dist/web/vendor/css/*.css'],
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
                        cwd: './dist/web/vendor/js/angular/i18n/',
                        src: ['./*.js'],
                        dest: './dist/web/vendor/js/angular/i18n/'
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
                        cwd: './dist/web',
                        src: '**/*.html',
                        dest: './dist/web'
                    }
                ]
            }
        },

        concat: {
            translations: {
                files: [
                    {
                        dest: '.tmp/translations.json',
                        src: ['./dist/web/vendor/**/translations.en.json',
                              './dist/web/vendor/**/translations.fr.json',
                              './dist/web/vendor/**/translations.nl.json',
                              './dist/web/app/**/translations.en.json',
                              './dist/web/app/**/translations.fr.json',
                              './dist/web/app/**/translations.nl.json']
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
                './src/web/app/*.js',
                './src/web/app/**/*.js'
            ]
        },

        encoding: {
            options: {
                encoding: 'UTF-8'
            },
            all: {
                files: {
                    src: [
                        './src/web/*.*',
                        './src/web/**/*.*'
                    ]
                }
            },
            dist: {
                files: {
                    src: [
                    './dist/web/*.*',
                    './dist/web/**/*.*',
                    '!./dist/web/vendor/*.*',
                    '!./dist/web/vendor/**/*.*'
                    ]
                }
            },
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
            'newer:encoding:all',
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
        'encoding:all',
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
        'htmlmin',
        'encoding:dist'
    ]);
};
