var csv = require('csv');

module.exports = ParticipantsDirective;

function parseJson(file, cb) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var text = reader.result;
        cb(JSON.parse(text));
    };
    reader.readAsText(file);
}

function parseCsv(file, cb) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var text = reader.result;
        csv.parse(text, { delimiter: ';', skip_empty_lines: true }, function (err, data) {
            var header = data.shift();
            var dataExpo = data.map(function (row) {
                var obj = {};
                header.forEach(function (name, key) {
                    obj[name] = ('spokes' === name) ? parseInt(row[key]) : row[key];
                });
                return obj;
            });
            cb(dataExpo);
        });

        //cb(JSON.parse(text));
    };
    reader.readAsText(file);
}

function ParticipantsDirective() {
    ParticipantsDirectiveController.$inject = ['$scope', 'participantsService'];

    return {
        controller: ParticipantsDirectiveController,
        templateUrl: require('./views/participants.html'),
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
                            if ('application/json' === file.type || file.name.lastIndexOf('.json') !== -1) {
                                parseJson(file, function (data) {
                                    scope.upload(data);
                                });
                            } else if ('text/csv' === file.type || file.name.lastIndexOf('.csv') !== -1) {
                                parseCsv(file, function (data) {
                                    scope.upload(data);
                                });
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
