module.exports = NavigationDirective;
require('./views/navigation.html');

function NavigationDirective() {
    return {
        'templateUrl': require('./views/navigation.html'),
        'link': function (scope, element) {
            scope.styles = require('./navigation.css');
            element.addClass(styles.container);
        }
    };
}
