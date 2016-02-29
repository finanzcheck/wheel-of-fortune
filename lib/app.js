module.exports = 'wheelOfFortune';

var angular = require('angular');

require('angular-local-storage');

angular
    .module(module.exports, [
        'LocalStorageModule',
        require('angular-animate'),
        require('angular-ui-router'),
        require('angular-ui-router-anim-in-out'),
        require('angular-translate'),
        require('./wheel/wheel.module'),
        require('./winners/winners.module'),
        require('./participants/participants.module'),
        require('./navigation/navigation.module')
    ])
    .config(translateConfig)
    .config(decoratorConfig)
    .config(localStorageConfig)
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

localStorageConfig.$inject = ['localStorageServiceProvider'];
function localStorageConfig(localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('wheelOfFortune');
}

stateConfig.$inject = ['$urlRouterProvider', '$locationProvider'];
function stateConfig($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled: false, requireBase: false});
    $urlRouterProvider.otherwise("/wheel");
}

translateConfig.$inject = ['$translateProvider'];
function translateConfig($translateProvider) {
    $translateProvider
        .translations('en', require('./translations/en.json'))
        .translations('de', require('./translations/de.json'))
        .fallbackLanguage(['en', 'de'])
        .uniformLanguageTag('bcp47')
        .registerAvailableLanguageKeys(['en', 'de'], {
            'en_*': 'en',
            'de_*': 'de'
        })
        .determinePreferredLanguage();
}
