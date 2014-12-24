'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var utils = require('../utils.js');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', {
    desc: 'Application name',
    type: String,
    required: false
  });

  this.option('app-suffix', {
    desc: 'Appends \'app\' suffix to the module name',
    type: String,
    required: false
  });
};

util.inherits(Generator, yeoman.generators.Base);

// Start up the generator and analyse arguments and options
// Gives us: appName, scriptAppName, pkg, filters (empty)
Generator.prototype.init = function init() {
    // Either the user passed an application name,
    // or we use the current directory name
    this.appName = this.name || path.basename(process.cwd());
    this.appName = this._.slugify(this._.humanize(this.appName));
    this.scriptAppName = this.appName + (this.options['app-suffix'] ? '-app' : '');

    this.pkg = require('../package.json');

    this.filters = {};
};

Generator.prototype.info = function info() {
    var yellow = chalk.bold.yellow,
        blue = chalk.bold.blue;

    this.log(yosay(yellow('Welcome to the outstanding ') + blue('GNaP') + yellow(' generator!')));
    this.log('Out of the box I create an AngularJS app with an ASP.NET Web API server.\n');
};

// Check if there is already a config file and if we should re-use it
// Gives us: configExists, useExistingConfig
Generator.prototype.checkForConfig = function checkForConfig() {
    var done = this.async();

    this.configExists = this.config.get('appTitle');

    if (this.configExists) {
        this.prompt([{
            type: 'confirm',
            name: 'useExistingConfig',
            message: 'Existing .yo-rc configuration found, would you like to use it?',
            default: true,
        }], function (answers) {
            this.useExistingConfig = answers.useExistingConfig;

            this.log('');
            done();
        }.bind(this));
    } else {
        done();
    }
};

// Load the existing config if it is present and if we need to re-use it
// Gives us: appTitle, portNumber, themeName, filters
Generator.prototype.loadConfig = function loadConfig() {
    if (!this.configExists)
      return;

    if (!this.useExistingConfig)
      return;

    // general
    this.appTitle = this.config.get('appTitle');
    this.portNumber = this.config.get('portNumber');

    // client
    this.themeName = this.config.get('themeName');
    this.filters = this.config.get('filters');
};

// Asks general questions to set up the generator
// Gives us: appTitle, portNumber
Generator.prototype.generalPrompts = function generalPrompts() {
    if (this.useExistingConfig)
      return;

    var done = this.async();

    this.log('# General\n');

    var generalPrompts = [{
        type: 'input',
        name: 'appTitle',
        message: 'What is the title of your application?',
        default: this._.titleize(this._.humanize(this.appName)),
        validate: function (input) { return utils.inputRequired(input, 'Project title'); }
    },

    {
        type: 'input',
        name: 'portNumber',
        message: 'Which port should the development server run on?',
        validate: function (input) { return utils.isValidPortNumber(input); },
        default: 9000
    }];


    this.prompt(generalPrompts, function (answers) {
        this.appTitle = answers.appTitle;
        this.portNumber = answers.portNumber;

        done();
    }.bind(this));
};

// Asks client side questions to set up the generator
// Gives us: themeName, filters.js, filters.html, filters.css, filters.uirouter
Generator.prototype.clientPrompts = function clientPrompts() {
    if (this.useExistingConfig)
      return;

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
        validate: function (input) { return utils.inputRequired(input, 'Theme'); },
        filter: function (input) { return input.toLowerCase(); }
    }];

    var otherThemePrompt = [{
        type: 'input',
        name: 'themeName',
        message: 'What is the npm name of the theme you wish to use?',
        validate: function (input) { return utils.inputRequired(input, 'Theme'); },
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
};

// serverPrompts: function() {
//     if (this.useExistingConfig) return;
//     var cb = this.async();
//
//     this.log('\n# Server\n');
// },

// Saves the settings in case we don't reuse an existing config
Generator.prototype.saveSettings = function saveSettings() {
    // some settings need to be always persisted
    this.config.set('appName', this.appName);
    this.config.set('scriptAppName', this.scriptAppName);

    if (this.useExistingConfig)
      return;

    // general
    this.config.set('appTitle', this.appTitle);
    this.config.set('portNumber', this.portNumber);

    // client
    this.config.set('themeName', this.themeName);
    this.config.set('filters', this.filters);

    this.config.forceSave();
};

Generator.prototype.generate = function generate() {
    this.log('\n# Generate\n');

    this.sourceRoot(path.join(__dirname, './templates'));
    utils.processDirectory(this, '.', '.');
};

Generator.prototype.end = function end() {
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
};
