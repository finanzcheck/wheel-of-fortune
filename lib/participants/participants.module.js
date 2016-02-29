module.exports = 'participants';

var angular = require('angular');

angular
    .module('participants', [
        require('./views/participants.html'),
        require('angular-sort-button'),
        require('angular-translate')
    ])
    .factory('participantsService', require('./participantsService.factory'))
    .directive('participants', require('./participants.directive'))
    .config(stateConfig);

stateConfig.$inject = ['$stateProvider'];
function stateConfig($stateProvider) {
    $stateProvider
        .state('participants', {
            url: "/participants",
            template: "<participants></participants>"
        });
}
