module.exports = 'navigation';

var angular = require('angular');

angular
    .module('navigation', [
        require('angular-translate'),
        require('./views/navigation.html')
    ])
    .directive('navigation', require('./navigation.directive'));
