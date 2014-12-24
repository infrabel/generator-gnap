'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var utils = require('../utils.js');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
    ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.init = function init() {
    if (!this.configExists)
        return;

    // stateName: main.test.show
    this.stateName = this.name.toLowerCase();

    // stateNameCapitalized: MainTestShow
    this.stateNameCapitalized = this._.classify(this.stateName);

    // stateNameParts: [src, web, app, main, test, show]
    this.stateNameParts = this.stateName.split('.');
    this.stateNameParts.splice(0, 0, 'src', 'web', 'app');

    // stateNameLast: show
    this.stateNameLast = this.stateNameParts[this.stateNameParts.length - 1];
    this.name = this.stateNameLast;

    // stateNameGuessedPath: /test/show
    if (this._.count(this.stateName, '.') > 1) {
        var stateNameSplitted = this.stateName.split('.');
        stateNameSplitted.splice(0, 1);

        this.stateNameGuessedPath = '/' + stateNameSplitted.join('/');
    } else {
        this.stateNameGuessedPath = '/' + this.stateNameLast;
    }

    this.fullPath = this.stateNameParts.join('/');

    this.generatedPath = this.fullPath.replace('src/web/', '');
};

Generator.prototype.generalPrompts = function generalPrompts() {
    if (!this.configExists)
        return;

    var done = this.async(),
        red = chalk.bold.red;

    var generalPrompts = [{
        type: 'input',
        name: 'url',
        message: 'What will the url of your state be?',
        default: this.stateNameGuessedPath,
        validate: function (input) { return utils.inputRequired(input, 'Url'); },
        filter: function (input) { return input.toLowerCase(); }
    },

    {
        type: 'input',
        name: 'titleEnglish',
        message: 'What is the ' + red('english') + ' title of the state?',
        validate: function (input) { return utils.inputRequired(input, 'English title'); }
    },

    {
        type: 'input',
        name: 'titleDutch',
        message: 'What is the ' + red('dutch') + ' title of the state?',
        validate: function (input) { return utils.inputRequired(input, 'Dutch title'); }
    },

    {
        type: 'input',
        name: 'titleFrench',
        message: 'What is the ' + red('french') + ' title of the state?',
        validate: function (input) { return utils.inputRequired(input, 'French title'); }
    },

    {
        type: 'confirm',
        name: 'sidebar',
        message: 'Will the state show up in the sidebar?',
        default: false
    }];

    this.prompt(generalPrompts, function (answers) {
        this.stateUrl = answers.url;

        this.stateTitleEnglish = answers.titleEnglish;
        this.stateTitleDutch = answers.titleDutch;
        this.stateTitleFrench = answers.titleFrench;

        this.stateVisibleInSidebar = answers.sidebar;

        done();
    }.bind(this));
};

Generator.prototype.generate = function generate() {
    utils.processDirectory(this, '.', this.destinationPath(this.fullPath));
};

/*
    writing: {
        app: function () {

            self.updateFile = function (path, hook, replacement) {
                var file = self.readFileAsString(path);
                file = file.replace(hook, replacement);
                self.writeFileFromString(file, path);
            };

            // TODO: We should only rewrite things on first add? Right now it always appends

            // update index.html
            var appHook = '<script src="app/app.config.js"></script>';
            self.updateFile('src/index.html', appHook, appHook + '\r\n\r\n        <script src="' + generatedPath + '/' + self.stateNameLast + '.state.js"></script>\r\n        <script src="' + generatedPath + '/' + self.stateNameLast + '.controller.js"></script>');

            // add to sidebar if required, as well as the translations for the sidebar
            if (self.stateVisibleInSidebar) {
                var sidebarHook = '// ======= yeoman sidebar hook =======';
                var sidebarItem = ",\n" +
                    "            {\n" +
                    "                key: '" + self.stateName + "',\n" +
                    "                titleTranslationId: 'sidebar.items." + self.stateName + "',\n" +
                    "                icon: 'icon-circle-blank',\n" +
                    "                state: '" + self.stateName + "'\n" +
                    "            }" + sidebarHook;

                var translationHook = '"items": {';
                var translationItemEnglish = translationHook + '\n            "' + self.stateName + '": "' + self.stateTitleEnglish + '",';
                var translationItemDutch = translationHook + '\n            "' + self.stateName + '": "' + self.stateTitleDutch + '",';
                var translationItemFrench = translationHook + '\n            "' + self.stateName + '": "' + self.stateTitleFrench + '",';

                self.updateFile('src/app/main/main.state.js', sidebarHook, sidebarItem);
                self.updateFile('src/app/main/translations.en.json', translationHook, translationItemEnglish);
                self.updateFile('src/app/main/translations.nl.json', translationHook, translationItemDutch);
                self.updateFile('src/app/main/translations.fr.json', translationHook, translationItemFrench);
            }

            // TODO: Need to check if parent states are present and warn the user if they are not
        }
    },
*/

Generator.prototype.end = function end() {
    var green = chalk.green,
        cyan = chalk.cyan,
        white = chalk.white;

    this.log();
    this.log(green('!') + white(' Successfully created state ') + cyan(this.stateName));
};
