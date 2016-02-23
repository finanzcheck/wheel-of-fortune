var shuffle = require('array-shuffle');

module.exports = ParticipantsServiceFactory;

ParticipantsServiceFactory.$inject = ['$q', 'localStorageService'];
function ParticipantsServiceFactory($q, localStorageService) {
    var participants = localStorageService.get('participants') || [];

    if ((!participants.length)) {
        participants = [];
    }

    return {
        add: function (p) {
            return $q(function (resolve) {
                if (null !== p) {
                    participants.push(p);
                }
                updateStorage();
                resolve();
            });
        },

        decrease: function (p) {
            return $q(function (resolve) {
                participants.forEach(function (participant) {
                    if (p.name === participant.name) {
                        participant.spokes--;
                        return false;
                    }
                });

                updateStorage();
                resolve();
            });
        },

        update: function (pOld, pNew) {
            return $q(function (resolve) {
                participants = participants.map(function (participant) {
                    if (participant.name === pOld.name) {
                        return pNew;
                    }

                    return participant;
                });

                updateStorage();
                resolve();
            });
        },

        remove: function (p) {
            return $q(function (resolve) {
                participants = participants.filter(function (participant) {
                    return participant.name !== p.name;
                });

                updateStorage();
                resolve();
            });
        },

        getAll: function () {
            return $q(function (resolve) {
                resolve(participants);
            });
        },

        clear: function () {
            return $q(function (resolve) {
                participants = [];
                updateStorage();
                resolve();
            });
        }
    };

    function updateStorage() {
        localStorageService.set('participants', participants);
    }
}
