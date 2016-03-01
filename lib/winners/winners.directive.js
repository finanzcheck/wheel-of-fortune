module.exports = WinnersDirective;


function WinnersDirective() {
    WinnersDirectiveController.$inject = ['$scope', 'winnersService'];

    return {
        controller: WinnersDirectiveController,
        templateUrl: require('./views/winners.html')
    };

    function WinnersDirectiveController(scope, winnersService) {
        load();

        scope.clear = clear;

        function clear() {
            winnersService.clear().then(load);
        }

        function load() {
            winnersService.getAll().then(function (winners) {
                scope.winners = winners;
            });
        }
    }
}
