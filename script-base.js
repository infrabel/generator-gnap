'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var utils = require('./utils.js');

var Generator = module.exports = function Generator() {
    yeoman.generators.NamedBase.apply(this, arguments);

    try {
        this.appName = require(path.join(process.cwd(), 'package.json')).name;
    } catch (e) {
        this.appName = path.basename(process.cwd());
    }

    this.appName = this._.slugify(this._.humanize(this.appName));
    this.scriptAppName = this.appName + utils.appName(this);

    this.cameledName = this._.camelize(this.name);
    this.classedName = this._.classify(this.name);

    // general
    this.appTitle = this.config.get('appTitle');
    this.portNumber = this.config.get('portNumber');

    // client
    this.themeName = this.config.get('themeName');
    this.filters = this.config.get('filters');

    this.sourceRoot(path.join(__dirname, '/templates'));
};

util.inherits(Generator, yeoman.generators.NamedBase);
