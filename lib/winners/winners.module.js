module.exports = 'winners';

var angular = require('angular');

angular
    .module(module.exports, ['LocalStorageModule'])
    .factory('winnersService', require('./winnersService.factory'))
    .directive('winners', require('./winners.directive'))
    .config(stateConfig);

stateConfig.$inject = ['$stateProvider'];
function stateConfig($stateProvider) {
    $stateProvider
        .state('winners', {
            url: "/winners",
            template: "<winners></winners>"
        });
}
