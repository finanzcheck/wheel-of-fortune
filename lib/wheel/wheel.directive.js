module.exports = WheelDirective;

var Raphael = require('raphael'),
    Hammer = require('hammerjs');

WheelDirective.$inject = ['participantsService', '$animate', '$timeout', '$q'];
function WheelDirective(participantsService, $animate, $timeout, $q) {

    var className = 'wheel-transition',
        currentRotation = 0,
        wheelContainer,
        ngWheelContainer,
        wheel,
        ngWheelElement;

    WheelDirectiveController.$inject = ['$scope'];
    function WheelDirectiveController (scope) {
        participantsService.getAll().then(function (participants) {
            scope.participants = participants;

            // we need to execute init() after an delay of 100ms, cause we need to wait for stateChange to complete
            // transitioning to have the correct url in window.location for gradients to work correctly
            $timeout(init, 100);
        });

        function init() {
            scope.total = 0;
            scope.participants.forEach(function (p) {
                scope.total += p.spokes;
            });

            wheel = new Raphael(wheelContainer, 700, 700).wheelOfFortune(scope, 350, 350, 250, scope.participants, '#fff');
            ngWheelElement = ngWheelContainer.find('svg');

            // append event listener on transitionend to catch animation end
            ngWheelElement.on('transitionend', function () {
                scope.$emit('transitionend');
            });

            // enable auto resizing of svg
            wheel.paper.setViewBox(0, 0, 700, 700, true);
            ngWheelElement.removeAttr('height');
            ngWheelElement.removeAttr('width');
        }
    }

    return {
        restrict: 'E',
        templateUrl: '/wheel/views/wheel.html',
        controller: WheelDirectiveController,
        link: function (scope, element, attr) {
            scope.tap = tap;
            scope.panEnd = panEnd;
            scope.resetRotation = resetRotation;
            scope.resetTextRotation = resetTextRotation;
            scope.disabled = false;
            scope.participants = [];
            scope.total = 0;

            scope.$on('transitionstart', transitionStart);
            scope.$on('transitionend', transitionEnd);

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

                rotate(Math.round(event.deltaX * 10) + (event.deltaX > 0 ? 3600 : -3600));
            }

            function tap() {
                rotate(3600 + Math.round(Math.random() * 3600));
            }

            function rotate(deg) {
                if (!ngWheelElement) {
                    return;
                }

                scope.disabled = true;
                scope.$emit('transitionstart');

                console.log(['Transitioning from', currentRotation, 'to', currentRotation + deg].join(' '));
                currentRotation += deg;

                ngWheelElement
                    .addClass(className)
                    .css({transform: 'rotate(' + currentRotation + 'deg)'});

                scope.$once('transitionend', function () {
                    //alert('success');
                });
            }

            function resetRotation() {
                if (!ngWheelElement || scope.disabled) {
                    return;
                }

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
    };
}

Raphael.fn.wheelOfFortune = function (scope, cx, cy, r, participants, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = paper.set(),
        angle = 0,
        start = 0,
        total = 0,
        disabled = false,

        sector = function sector(cx, cy, r, startAngle, endAngle, params) {
            var x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad);
            return paper.path(['M', cx, cy, 'L', x1, y1, 'A', r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, 'z']).attr(params);
        },

        process = function (participant) {
            var angleplus = 360 * participant.spokes / total,
                popangle = angle + angleplus / 2,
                color = Raphael.hsb(start, 0.75, 1),
                ms = 250,
                delta = 30,
                bcolor = Raphael.hsb(start, 1, 1),
                spoke = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, 'stroke-width': 3}),
                txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), participant.name).attr({fill: bcolor, stroke: 'none', opacity: 0, 'font-size': 20});

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

            chart.push(spoke);
            chart.push(txt);
        };

    participants.forEach(function (p) {
        total += p.spokes;
    });

    participants.forEach(function (p) {
        process.bind(this)(p);
    }.bind(this));

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

    return chart;
};
