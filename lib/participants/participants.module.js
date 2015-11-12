module.exports = 'participants';

var angular = require('angular');

angular
    .module(module.exports, [])
    .factory('participantsService', require('./participantsService.factory'))
    .config(stateConfig);

stateConfig.$inject = ['$stateProvider'];
function stateConfig($stateProvider) {
    $stateProvider
        .state('participants', {
            url: "/participants",
            templateUrl: "participants/views/participants.html"
        });
}
