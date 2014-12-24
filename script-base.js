'use strict';
var path = require('path');
var util = require('util');
var utils = require('./utils.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var Generator = module.exports = function Generator() {
    yeoman.generators.NamedBase.apply(this, arguments);

    this.configExists = this.config.get('appTitle');

    if (!this.configExists) {
        var red = chalk.bold.red,
            yellow = chalk.bold.yellow;

        this.log(red('!') + ' No existing config found, run \'' + yellow('yo gnap') + '\' first.');
        return;
    }

    this.pkg = require('./package.json');

    // general
    this.appName = this.config.get('appName');
    this.scriptAppName = this.config.get('scriptAppName');

    this.appTitle = this.config.get('appTitle');
    this.portNumber = this.config.get('portNumber');

    // client
    this.themeName = this.config.get('themeName');
    this.filters = this.config.get('filters');
};

util.inherits(Generator, yeoman.generators.NamedBase);
