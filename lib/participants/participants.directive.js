module.exports = ParticipantsDirective;

function ParticipantsDirective() {
    ParticipantsDirectiveController.$inject = ['$scope', 'participantsService'];

    return {
        controller: ParticipantsDirectiveController,
        templateUrl: require('./views/participants.html')
    };

    function ParticipantsDirectiveController(scope, participantsService) {
        load();

        scope.order = {};
        scope.pEdit = null;
        scope.isNew = false;
        scope.pEditOld = null;
        scope.save = save;
        scope.add = add;
        scope.edit = edit;
        scope.create = create;
        scope.cancel = cancel;
        scope.remove = remove;
        scope.update = update;
        scope.clear = clear;

        function load() {
            participantsService.getAll().then(function (p) {
                scope.participants = p;

                scope.isNew = false;
                scope.pEdit = null;
                scope.pEditOld = null;
            });
        }

        function edit(p) {
            scope.pEditOld = p;
            scope.pEdit = angular.copy(p);
        }

        function create() {
            scope.isNew = true;
            scope.pEdit = {};
        }

        function cancel() {
            scope.pEdit = null;
        }

        function save() {
            if (null === scope.pEditOld) {
                add();
            } else {
                update();
            }
        }

        function add() {
            participantsService.add(scope.pEdit).then(load);
        }

        function update() {
            participantsService.update(scope.pEditOld, scope.pEdit).then(load);
        }

        function remove(p) {
            participantsService.remove(p).then(load);
        }

        function clear() {
            participantsService.clear().then(load);
        }
    }
}
