'use strict';

(function () {
    angular
        .module('<%= scriptAppName %>')
        .controller('<%= stateNameCapitalized %>Controller', <%= stateNameCapitalized %>Controller);

    <%= stateNameCapitalized %>Controller.$inject = [];

    function <%= stateNameCapitalized %>Controller() {
    }
})();
