module.exports = 'navigation';

var angular = require('angular');

angular
    .module('navigation', [
        require('angular-translate')
    ])
    .directive('navigation', require('./navigation.directive'));
