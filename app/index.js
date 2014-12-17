'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var genUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var GNaPGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.argument('name', { type: String, required: false });
        this.appName = this.name || path.basename(process.cwd());
        this.appName = this._.slugify(this._.humanize(this.appName));

        this.option('app-suffix', {
            desc: 'Allow a custom suffix to be added to the module name',
            type: String,
            required: 'false'
        });

        this.scriptAppName = this.appName + genUtils.appName(this);
        this.appPath = this.env.options.appPath;
        this.pkg = require('../package.json');

        this.filters = {};
    },

    info: function () {
        var yellow = chalk.bold.yellow,
            blue = chalk.bold.blue;

        this.log(yosay(yellow('Welcome to the outstanding ') + blue('GNaP') + yellow(' generator!')));
        this.log('Out of the box I create an AngularJS app with an ASP.NET Web API server.\n');
    },

    checkForConfig: function() {
        var done = this.async();

        this.configExists = this.config.get('filters');

        if (this.configExists) {
            this.prompt([{
                type: 'confirm',
                name: 'skipConfig',
                message: 'Existing .yo-rc configuration found, would you like to use it?',
                default: true,
            }], function (answers) {
                this.skipConfig = answers.skipConfig;

                this.log('');
                done();
            }.bind(this));
        } else {
            done();
        }
    },

    loadConfig: function() {
        if (!this.configExists) return;
        if (!this.skipConfig) return;

        // general
        this.appTitle = this.config.get('appTitle');
        this.portNumber = this.config.get('portNumber');

        // client
        this.themeName = this.config.get('themeName');
        this.filters = this.config.get('filters');
    },

    generalPrompts: function() {
        if (this.skipConfig) return;
        var done = this.async();

        this.log('# General\n');

        var generalPrompts = [{
            type: 'input',
            name: 'appTitle',
            message: 'What is the title of your application?',
            default: this._.titleize(this._.humanize(this.appName)),
            validate: function (input) { return genUtils.inputRequired(input, 'Project title'); }
        },

        {
            type: 'input',
            name: 'portNumber',
            message: 'Which port should the development server run on?',
            validate: function (input) { return genUtils.isValidPortNumber(input); },
            default: 9000
        }];


        this.prompt(generalPrompts, function (answers) {
            this.appTitle = answers.appTitle;
            this.portNumber = answers.portNumber;

            done();
        }.bind(this));
    },

    clientPrompts: function() {
        if (this.skipConfig) return;
        var done = this.async();

        this.log('\n# Client\n');

        var themePrompt = [{
            type: 'list',
            name: 'themeName',
            message: 'Which theme does your application use?',
            choices: [{
                name: 'gnap-theme-gnap-angular',
                value: 'gnap-theme-gnap-angular'
            },
            {
                name: 'other',
                value: 'other'
            }],
            default: 'gnap-theme-gnap-angular',
            validate: function (input) { return genUtils.inputRequired(input, 'Theme'); },
            filter: function (input) { return input.toLowerCase(); }
        }];

        var otherThemePrompt = [{
            type: 'input',
            name: 'themeName',
            message: 'What is the npm name of the theme you wish to use?',
            validate: function (input) { return genUtils.inputRequired(input, 'Theme'); },
            filter: function (input) { return input.toLowerCase(); }
        }];

        this.prompt(themePrompt, function (answers) {
            if (answers.themeName === 'other') {
                this.prompt(otherThemePrompt, function (answers) {
                    this.themeName = answers.themeName;

                    done();
                }.bind(this));
            } else {
                this.themeName = answers.themeName;

                done();
            }
        }.bind(this));

        // These are currently hardcoded
        this.filters.js = true;
        this.filters.html = true;
        this.filters.css = true;
        this.filters.uirouter = true;
    },

    // serverPrompts: function() {
    //     if (this.skipConfig) return;
    //     var cb = this.async();
    //
    //     this.log('\n# Server\n');
    // },

    saveSettings: function() {
        if (this.skipConfig) return;

        // general
        this.config.set('appTitle', this.appTitle);
        this.config.set('portNumber', this.portNumber);

        // client
        this.config.set('themeName', this.themeName);
        this.config.set('filters', this.filters);

        this.config.forceSave();
    },

    generate: function() {
        this.log('\n# Generate\n');

        this.sourceRoot(path.join(__dirname, './templates'));
        genUtils.processDirectory(this, '.', '.');
    },

    end: function () {
        var done = this.async(),
            green = chalk.green,
            cyan = chalk.cyan,
            white = chalk.white,
            yellow = chalk.bold.yellow;

        this.log(green('   create') + ' theme (' + cyan(this.themeName) + ')');
        this.npmInstall([this.themeName], {}, function() {
            this.npmInstall(['grunt',
                             'grunt-autoprefixer',
                             'grunt-contrib-clean',
                             'grunt-contrib-concat',
                             'grunt-contrib-connect',
                             'grunt-contrib-copy',
                             'grunt-contrib-cssmin',
                             'grunt-contrib-htmlmin',
                             'grunt-contrib-jshint',
                             'grunt-contrib-uglify',
                             'grunt-contrib-watch',
                             'grunt-rev',
                             'grunt-text-replace',
                             'grunt-usemin',
                             'jshint-stylish',
                             'load-grunt-tasks',
                             'time-grunt'], { 'saveDev': true }, function() {
                this.log();
                this.log(green('!') + white(' Successfully created ') + cyan(this.appName));
                this.log(green('!') + white(' To see your site, run:'));
                this.log('\t' + yellow('grunt serve'));

                done();
            }.bind(this));
        }.bind(this));
    }
});

module.exports = GNaPGenerator;
