module.exports = ParticipantsDirective;

function ParticipantsDirective() {
    ParticipantsDirectiveController.$inject = ['$scope', 'participantsService'];

    return {
        controller: ParticipantsDirectiveController,
        templateUrl: 'participants/views/participants.html',
    }

    function ParticipantsDirectiveController(scope, participantsService) {
        //scope.add = add;
        //scope.remove = remove;
        //scope.clear = clear;

        participantsService.getAll().then(function (p) {
            scope.participants = p;
        });
    }
}
