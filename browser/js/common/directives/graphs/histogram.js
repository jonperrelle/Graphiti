app.directive('histogram', function (d3Service, $window) {
  return {
    restrict: 'E',
    scope: {
      rows: "=",
      column: "=",
      settings: "="
    },
    link: function (scope, element, attributes) {
      d3Service.d3().then(function (d3) {
        window.onresize = function() {
            scope.$apply();
        };

        // Watch for resize event
        scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
        }, function() {
            scope.render();
        });

        scope.$watch(function(scope) {
            return scope.settings;
        }, function() {
            scope.render();
        }, true);

        scope.$watch(function (scope) {
          return scope.columns;
        }, function () {
          scope.render();
        },true);

        scope.render = function () {
          let xScale = d3.scaleLinear()
                .rangeRound([0, width]),
              bins = d3.histogram()
                .domain(xScale.domain())
                .thresholds(xScale.ticks(10))
                (data);
        };
      });
    }
  }
});























