module.exports = 'winners';

var angular = require('angular');

angular
    .module(module.exports, [])
    .factory('winnersService', require('./winnersService.factory'))
    .config(stateConfig);

stateConfig.$inject = ['$stateProvider'];
function stateConfig($stateProvider) {
    $stateProvider
        .state('winners', {
            url: "/winners",
            templateUrl: "winners/views/winners.html"
        });
}
