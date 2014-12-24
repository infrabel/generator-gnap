'use strict';

(function () {
    angular
        .module('<%= scriptAppName %>')
        .controller('PublicController', PublicController);

    PublicController.$inject = [];

    function PublicController() {
    }
})();
