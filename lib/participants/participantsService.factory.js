var shuffle = require('array-shuffle');

module.exports = ParticipantsServiceFactory;

ParticipantsServiceFactory.$inject = ['$q', 'localStorageService'];
function ParticipantsServiceFactory($q, localStorageService) {
    var participants = localStorageService.get('participants') || [];

    if ((!participants.length)) {
        participants = [];

        participants.push({name: 'Alf', spokes: 18});
        participants.push({name: 'Ralf', spokes: 15});
        participants.push({name: 'Ulf', spokes: 20});
        participants.push({name: 'Jan', spokes: 35});
        participants.push({name: 'Johann', spokes: 8});
        participants.push({name: 'Sebastian', spokes: 10});
        participants.push({name: 'Henrik', spokes: 36});
        participants.push({name: 'Susanne', spokes: 30});
        participants.push({name: 'Erik', spokes: 25});
        participants.push({name: 'Alex', spokes: 2});
        participants.push({name: 'Felix', spokes: 12});
        participants.push({name: 'Mark', spokes: 12});
        participants.push({name: 'Phil', spokes: 30});
        participants.push({name: 'Andreas', spokes: 10});
        participants.push({name: 'Thoralf', spokes: 22});

        participants = shuffle(participants);
    }

    return {
        add: function (p) {
            return $q(function (resolve) {
                participants.push(p);
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
