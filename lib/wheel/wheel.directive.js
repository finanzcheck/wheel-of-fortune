module.exports = WheelDirective;

require('chance');

var Raphael = require('raphael'),
    shuffle = require('array-shuffle');

WheelDirective.$inject = ['participantsService', 'winnersService', '$timeout', '$q', '$location'];
function WheelDirective(participantsService, winnersService, $timeout, $q, $location) {

    var className = 'wheel-transition',
        currentRotation = 0,
        wheelContainer,
        ngWheelContainer,
        wheel,
        ngWheelElement,
        angles = [];

    WheelDirectiveController.$inject = ['$scope'];

    return {
        restrict: 'E',
        templateUrl: require('./views/wheel.html'),
        controller: WheelDirectiveController,
        link: link
    };

    function WheelDirectiveController(scope) {
        scope.render = render;
        scope.next = next;

        render();

        function render() {
            participantsService.getAll().then(function (participants) {
                if (!participants.length) {
                    $location.path('/participants');
                } else {
                    // we need to execute init() after an delay of 100ms, cause we need to wait for stateChange to complete
                    // transitioning to have the correct url in window.location for gradients to work correctly
                    $timeout(handleParticipantsResult.bind(this, participants), 100);
                }
            });
        }

        function next() {
            scope.resetRotation();

            scope.zoom = false;
            scope.disabled = true;

            participantsService.decrease(scope.winner).then(function () {
                scope.winner = null;

                return participantsService.getAll();
            }).then(handleParticipantsResult);
        }

        function handleParticipantsResult(participants) {
            scope.participants = participants;

            init();
        }

        function init() {
            scope.total = 0;
            scope.participants.forEach(function (p) {
                if (p && p.spokes) {
                    scope.total += p.spokes;
                }
            });

            ngWheelContainer.empty();

            wheel = new Raphael(wheelContainer, 800, 800).wheelOfFortune(scope, 400, 400, 250, scope.participants, '#fff', function (a) {
                angles = a;
            });

            ngWheelElement = ngWheelContainer.find('svg');

            // append event listener on transitionend to catch animation end
            ngWheelElement.on('transitionend', function () {
                scope.$emit('transitionend');
            });

            // enable auto resizing of svg
            wheel.paper.setViewBox(0, 0, 800, 800, true);
            ngWheelElement.removeAttr('height');
            ngWheelElement.removeAttr('width');

            scope.disabled = false;
        }
    }

    function link(scope, element, attr) {
        scope.zoom = false;
        scope.zoom2x = false;
        scope.tap = tap;
        scope.panEnd = panEnd;
        scope.resetRotation = resetRotation;
        scope.resetTextRotation = resetTextRotation;
        scope.disabled = false;
        scope.participants = [];
        scope.total = 0;

        scope.$on('transitionstart', transitionStart);
        scope.$on('transitionend', transitionEnd);

        // though transitionend is fired by $animate and we animate via class adding, we cannot access the `transitionend` event and need to listen manually
        scope.$watch('zoom', function () {
            $timeout(scope.$emit.bind(scope, 'transitionend'), 1050);
        });

        wheelContainer = element[0].getElementsByClassName('wheel')[0];
        ngWheelContainer = angular.element(wheelContainer);

        function transitionStart() {
            scope.disabled = true;
        }

        function transitionEnd() {
            scope.disabled = false;
            resetTextRotation();
        }

        function panEnd(event) {
            console.log(event);
            if (event.deltaX > 0) {
                rotate(event.deltaX + 3600);
            } else {
                rotate(event.deltaX - 3600);
            }
        }

        function tap() {
            rotate(Math.abs(3600 + chance.integer({min: 0, max: 2}) * 360 + chance.integer({
                        min: 0,
                        max: 360
                    })) * (chance.bool() ? 1 : -1));
        }

        function rotate(deg) {
            if (!ngWheelElement || scope.disabled || !!scope.winner) {
                return;
            }

            $q(function (resolve) {
                if (false === scope.zoom) {
                    return resolve();
                }

                scope.$once('transitionend', resolve);
                scope.zoom = false;
            }).then(function () {
                return $q(function (resolve) {

                    scope.disabled = true;
                    scope.$emit('transitionstart');

                    console.log(['Transitioning from', currentRotation, 'to', currentRotation + deg].join(' '));
                    currentRotation += deg;

                    scope.$once('transitionend', resolve);

                    ngWheelElement
                        .addClass(className)
                        .css({transform: 'rotate(' + currentRotation + 'deg)'});

                });
            }).then(function () {

                var winAngle = (currentRotation + 90) % 360,
                    winner;
                console.log('winAngle ' + winAngle);

                if (winAngle < 0) {
                    winAngle = 360 - Math.abs(winAngle);
                }

                angles.forEach(function (angle) {
                    if (winAngle <= angle.angle) {
                        return;
                    }

                    winner = angle.participant;
                });

                console.log(winner, winAngle);

                winnersService.add(winner);

                scope.winner = winner;
            }).then(function () {
                return $q(function (resolve) {
                    scope.$once('transitionend', resolve.bind(this));
                    scope.zoom = true;
                });
            }).then(function () {
                scope.disabled = false;
            });
        }

        function resetRotation() {
            if (!ngWheelElement || scope.disabled) {
                return;
            }

            currentRotation = 0;

            ngWheelElement
                .removeClass(className)
                .css({transform: 'rotate(0deg)'});

            return $q(function (resolve) {
                $timeout(function () {
                    ngWheelElement.addClass(className);
                    resolve();
                }, 10);
            });
        }

        function resetTextRotation() {
            if (!ngWheelElement || scope.disabled) {
                return;
            }

            var cssRotation = ngWheelElement.css('transform');
            if (!cssRotation) {
                return;
            }

            var match = /rotate\((-?\d+)deg\)/.exec(cssRotation);
            if (2 !== match.length) {
                return;
            }

            var deg = match[1],
                rotation = deg > 0 ? 'r-' + deg : 'r' + deg * -1;

            wheel.forEach(function (elem) {
                if ('text' === elem.type) {
                    elem.transform(rotation);
                }
            });
        }
    }
}

Raphael.fn.wheelOfFortune = function (scope, cx, cy, r, participants, stroke, callback) {
    var paper = this,
        rad = Math.PI / 180,
        wheel = paper.set(),
        angle = 0,
        start = 0,
        total = 0,
        disabled = false,
        angles = [],

        sector = function sector(cx, cy, r, startAngle, endAngle, params) {
            var x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad);
            return paper.path(['M', cx, cy, 'L', x1, y1, 'A', r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, 'z']).attr(params);
        },

        process = function (participant) {
            if (!participant) {
                return;
            }
            var angleplus = 360 * participant.spokes / total,
                popangle = angle + angleplus / 2,
                color = Raphael.hsb(start, 0.75, 1),
                ms = 250,
                delta = 30,
                bcolor = Raphael.hsb(start, 1, 1),
                spoke = sector(cx, cy, r, angle, angle + angleplus, {
                    fill: "90-" + bcolor + "-" + color,
                    stroke: stroke,
                    'stroke-width': 1
                }),
                txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), [participant.name, '|', participant.spokes].join(' ')).attr({
                    fill: bcolor,
                    stroke: 'none',
                    opacity: 0,
                    'font-size': 20
                });

            angles.push({angle: angle, participant: participant});

            spoke.mouseover(function () {
                if (disabled) {
                    return;
                }

                spoke.stop().animate({transform: 's1.1 1.1 ' + cx + ' ' + cy}, ms, 'elastic');
                txt.stop().animate({opacity: 1}, ms, 'elastic');
            }).mouseout(function () {
                if (disabled) {
                    return;
                }

                spoke.stop().animate({transform: ''}, ms, 'elastic');
                txt.stop().animate({opacity: 0}, ms);
            });

            angle += angleplus;
            start += 0.1;

            wheel.push(spoke);
            wheel.push(txt);
        };

    participants.forEach(function (p) {
        if (p && p.spokes) {
            total += p.spokes;
        }
    });

    participants.forEach(function (p) {
        process.bind(this)(p);
    }.bind(this));

    // pass angles back
    if (callback) {
        callback(angles);
    }

    scope.$on('transitionstart', function () {
        disabled = true;
        paper.forEach(function (elem) {
            elem.stop();
            if (elem.type === 'text') {
                elem.animate({opacity: 0}, 0);
            } else if (elem.type === 'path') {
                elem.animate({transform: ''}, 0);
            }
        });
    });
    scope.$on('transitionend', function () {
        disabled = false;
    });

    return wheel;
};
