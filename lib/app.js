module.exports = 'wheelOfFortune';

var angular = require('angular');

angular
    .module(module.exports, [
        require('angular-animate'),
        require('angular-ui-bootstrap'),
        require('angular-ui-router'),
        require('angular-ui-router-anim-in-out'),
        require('./wheel/wheel.module'),
        require('./winners/winners.module'),
        require('./participants/participants.module')
    ])
    .config(decoratorConfig)
    .config(stateConfig);


decoratorConfig.$inject = ['$provide'];
function decoratorConfig($provide) {
    /**
     * Angular $rootScope.Scope.$once
     * Copyright (c) 2014 marlun78
     * MIT License, https://gist.github.com/marlun78/bd0800cf5e8053ba9f83
     */
    $provide.decorator('$rootScope', function ($delegate) {
        var Scope = $delegate.__proto__.constructor;
        Scope.prototype.$once = function (name, listener) {
            var deregister = this.$on(name, function () {
                deregister();
                listener.apply(this, arguments);
            });
            return deregister;
        };
        return $delegate;
    });
}

stateConfig.$inject = ['$urlRouterProvider', '$locationProvider'];
function stateConfig($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled: true, requireBase: false});
    $urlRouterProvider.otherwise("/wheel");
}
