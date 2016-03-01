module.exports = 'participants';

var angular = require('angular');

angular
    .module('participants', [
        require('angular-sort-button'),
        require('angular-translate'),
        require('./views/participants.html')
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
