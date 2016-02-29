module.exports = 'navigation';

var angular = require('angular');

angular
    .module('navigation', [
        require('./views/navigation.html'),
        require('angular-translate')
    ])
    .directive('navigation', require('./navigation.directive'));
