module.exports = 'wheel';

var angular = require('angular');

require('hammerjs');

angular
    .module(module.exports, [
        require('angular-animate'),
        require('angular-hammer'),
        require('./views/wheel.html')
    ])
    .directive('wheel', require('./wheel.directive'))
    .config(stateConfig);

stateConfig.$inject = ['$stateProvider'];
function stateConfig($stateProvider) {
    $stateProvider
        .state('wheel', {
            url: "/wheel",
            template: "<wheel></wheel>"
        });
}
