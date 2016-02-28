module.exports = ParticipantsDirective;

function ParticipantsDirective() {
    ParticipantsDirectiveController.$inject = ['$scope', 'participantsService'];

    return {
        controller: ParticipantsDirectiveController,
        templateUrl: 'participants/views/participants.html',
        link: function (scope, element, attrs, ngModel) {
            scope.isDragging = false;
            element.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            element.on('dragenter', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            element.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (e.dataTransfer) {
                    if (e.dataTransfer.files.length > 0) {
                        var files = Array.prototype.slice.call(e.dataTransfer.files);
                        files.forEach(function (file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var text = reader.result;
                                scope.upload(JSON.parse(text));
                            };

                            if ('application/json' === file.type) {
                                reader.readAsText(file);
                            }
                        });
                    }
                }
                return false;
            });
        }
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
        scope.upload = upload;

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

        function upload(participants) {
            if (Array.isArray(participants)) {
                participants.forEach(function (p) {
                    participantsService.add(p).then(load);
                });
            } else {
                participantsService.add(participants).then(load);
            }
        }
    }
}
