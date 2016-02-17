module.exports = winnersServiceFactory;

winnersServiceFactory.$inject = ['$q', 'localStorageService'];
function winnersServiceFactory($q, localStorageService) {
    var winners = Array.prototype.slice.call(this, localStorageService.get('winners'));

    return {
        add: function (w) {
            return $q(function (resolve) {
                winners.push(w);
                updateStorage();
                resolve(winners);
            });
        },

        remove: function (w) {
            return $q(function (resolve) {
                if (0 >= winners.indexOf(w)) {
                    winners.splice(winners.indexOf(w), 1);
                }

                updateStorage();
                resolve();
            });
        },

        clear: function () {
            return $q(function (resolve) {
                winners = [];
                updateStorage();
                resolve();
            });
        },

        getAll: function () {
            return $q(function (resolve) {
                resolve(winners);
            });
        }
    };

    function updateStorage() {
        localStorageService.set('winners', winners);
    }
}
