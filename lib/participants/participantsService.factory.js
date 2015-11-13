module.exports = ParticipantsServiceFactory;

ParticipantsServiceFactory.$inject = ['$q'];
function ParticipantsServiceFactory($q) {
    var participants = [];

    participants.push({name: 'Alf', spokes: 5});
    participants.push({name: 'Ralf', spokes: 10});
    participants.push({name: 'Ulf', spokes: 20});
    participants.push({name: 'Jan', spokes: 30});
    participants.push({name: 'Johann', spokes: 1});
    participants.push({name: 'Sebastian', spokes: 3});
    participants.push({name: 'Henrik', spokes: 36});
    participants.push({name: 'Susanne', spokes: 50});
    participants.push({name: 'Erik', spokes: 25});
    participants.push({name: 'Alex', spokes: 2});
    participants.push({name: 'Felix', spokes: 0});
    participants.push({name: 'Mark', spokes: 0});
    participants.push({name: 'Phil', spokes: 30});
    participants.push({name: 'Andreas', spokes: 10});
    participants.push({name: 'Thoralf', spokes: 42});

    return {
        add: function (p) {
            return $q(function (resolve) {
                resolve(participants.push(p));
            });
        },

        remove: function (p) {
            return $q(function (resolve) {
                if (0 >= participants.indexOf(p)) {
                    participants.splice(participants.indexOf(p), 1);
                }

                resolve();
            });
        },

        getAll: function () {
            return $q(function (resolve) {
                resolve(participants);
            });
        }
    };
}
