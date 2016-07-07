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

          let filteredData = scope.rows.filter(obj => obj[scope.column.name] 
                    && (!!Number(obj[scope.column.name]) || Number(obj[scope.column.name]) === 0));

          let xScale = d3.scale.linear()
                .domain([d3.min(filteredData, d => d[scope.column.name]), d3.max(filteredData, d => d[scope.column.name])])
                .range([0, width - margin.left]);

          let histogram = d3.layout.histogram()
            .value(d => d[scope.column.name])
            .bins(xScale.ticks(10))
            (filteredData);

          let yScale = d3.scale.linear()
                .domain([0, d3.max(histogram, d => d.y)])
                .range([height - margin.bottom, margin.top]);

          let xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
              yAxis = d3.svg.axis().scale(yScale).orient("left");

          let bar = svg.selectAll('.bar')
                .data(histogram)
              .enter()
                .append('g')
                .attr('class', 'bar');

              bar.append('rect')
                .attr("x", d => xScale(d.x))
                .attr("y", d => yScale(d.y))
                .attr('width', (histogram[0].dx - 1))
                .attr('height', d => height - margin.bottom - yScale(d.y));

              svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "xlabel")
                    .text(xAxisLabel);

              svg.append("g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(" + margin.left + ",0)")
                  .call(yAxis)
                  .append("text")
                  .attr("class", "ylabel")
                  .attr("transform", "rotate(-90)translate(" + -((height + margin.bottom + margin.top) / 2) + ", " + -(margin.left-20) + ")")
                  .text(yAxisLabel);
        };
      });
    }
  };
});























