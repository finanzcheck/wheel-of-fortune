module.exports = NavigationDirective;
require('./views/navigation.html');
var styles = require('./navigation.css');

function NavigationDirective() {
    return {
        'templateUrl': require('./views/navigation.html'),
        'link': function (scope, element) {
            scope.styles = styles;
            element.addClass(styles.container);
        }
    };
}
