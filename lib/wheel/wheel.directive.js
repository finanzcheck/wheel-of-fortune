module.exports = WheelDirective;

var Raphael = require('raphael');

WheelDirective.$inject = ['participantsService'];
function WheelDirective(participantsService) {
    return {
        restrict: 'E',
        templateUrl: '/wheel/views/wheel.html',
        link: function (scope, element, attr) {
            scope.panEnd = panEnd;
            scope.tap = tap;
            scope.resetTextRotation = resetTextRotation;
            scope.disabled = false;

            scope.$on('transitionstart', transitionStart);
            scope.$on('transitionend', transitionEnd);

            var className = 'wheel-transition',
                wheelContainer = element[0].getElementsByClassName('wheel')[0],
                ngWheelContainer = angular.element(wheelContainer),
                wheel,
                ngWheelElement;

            participantsService.getAll().then(function (participants) {
                wheel = new Raphael(wheelContainer, 700, 700).wheelOfFortune(scope, 350, 350, 250, participants, '#fff');
                ngWheelElement = ngWheelContainer.find('svg');

                ngWheelElement.addClass('zoom');

                ngWheelElement.on('transitionend', function () {
                    scope.$emit('transitionend');
                });

                wheel.paper.setViewBox(0, 0, 700, 700, true);
                ngWheelElement.removeAttr('height');
                ngWheelElement.removeAttr('width');
            });

            function transitionStart() {
                scope.disabled = true;
            }

            function transitionEnd() {
                scope.disabled = false;
                resetTextRotation();
            }

            function panEnd(event) {
                console.log(event);
                rotate(3600 + Math.round(event.distance * 5));
            }

            function tap() {
                rotate(3600 + Math.round(Math.random() * 3600));
            }

            function rotate(deg) {
                if (!ngWheelElement) {
                    return;
                }

                resetRotation();
                scope.disabled = true;
                ngWheelElement.addClass(className).css('transform', 'rotate(' + deg + 'deg)');
                scope.$emit('transitionstart');
            }

            function resetRotation() {
                if (!ngWheelElement || scope.disabled) {
                    return;
                }

                ngWheelElement.removeClass(className).css('transform', 'rotate(0deg)');
            }

            function resetTextRotation() {
                if (scope.disabled) {
                    return;
                }

                var cssRotation = ngWheelElement.css('transform');
                if (!cssRotation) {
                    return;
                }

                var rotation = /rotate\((\d+)deg\)/.exec(cssRotation);
                if (2 !== rotation.length) {
                    return;
                }

                rotation = rotation[1];
                wheel.forEach(function (elem) {
                    if ('text' === elem.type) {
                        elem.transform('r-' + rotation);
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
