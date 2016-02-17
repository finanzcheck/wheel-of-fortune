module.exports = 'navigation';

var angular = require('angular');

angular
    .module('navigation', [])
    .directive('navigation', require('./navigation.directive'));
