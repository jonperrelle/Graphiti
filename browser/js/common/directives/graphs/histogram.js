app.directive('histogram', function (d3Service, $window) {
  return {
    restrict: 'E',
    scope: {
      rows: "=",
      column: "=",
      settings: "="
    },
    link: function (scope, ele, attrs) {
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
          return scope.column;
        }, function () {
          scope.render();
        }, true);

        scope.render = function () {
          let data = d3.range(1000).map(d3.random.logNormal(Math.log(30), .4));

          let anchor = d3.select(ele[0]);
          anchor.selectAll('*').remove();

          let //formatColX = scope.column.name.replace(/\_+/g, " "),
              margin = {
                        top: 30,
                        right: 20,
                        bottom: 40, //(xLabelLength + 6) * 5,
                        left: 50 //(yLabelLength + 6) * 7
                    },
              width = scope.settings.width || ele[0].parentNode.offsetWidth,
              height = scope.settings.height || width,
              xAxisLabel = scope.settings.xAxisLabel || 'stuff' ,//formatColX,
              yAxisLabel = scope.settings.yAxisLabel || 'frequency',
              title = scope.settings.title || 'frequency for stuff'// + formatColX;

          let svg = anchor
              .append('svg')
              .style('width', width)
              .style('height', height)
              .style('background-color', '#ffffff')
              .style('border-radius', '10px')
              .append("g");

          let xScale = d3.scale.linear()
                // .rangeRound([0, width]),
                .domain([0, 120])
                .range([0, width]),
              bins = d3.layout.histogram()
                .bins(xScale.ticks(20))
                (data),
                // .domain(xScale.domain())
              //   .thresholds(xScale.ticks(10))
              //   (data),
              yScale = d3.scale.linear()
                .domain([0, d3.max(bins, d => d.y)])
                .range([height, 0]);

          let bar = svg.selectAll('.bar')
                .data(bins)
              .enter()
                .append('g')
                .attr('class', 'bar')
                .attr("transform", d => { 
                  return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; 
                });

              bar.append('rect')
                .attr('x', 1)
                .attr('width', 10)
                // .attr('width', xScale(bins[0].x1) - xScale(bins[0].x0) - 1)
                .attr('height', d => height - yScale(d.y));
        };
      });
    }
  }
});























