module.exports = 'wheelOfFortune';

var angular = require('angular');

angular
    .module(module.exports, [
        require('angular-animate'),
        require('angular-ui-bootstrap'),
        require('angular-ui-router'),
        require('angular-ui-router-anim-in-out'),
        require('./wheel/wheel.module'),
        require('./participants/participants.module')
    ])
    .config(stateConfig);

stateConfig.$inject = ['$urlRouterProvider', '$locationProvider'];
function stateConfig($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.html5Mode = true;
    $urlRouterProvider.otherwise("/wheel");
}
