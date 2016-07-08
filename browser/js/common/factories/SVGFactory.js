app.factory('SVGFactory', function ($window) {
  let SVGFactory = {};

  SVGFactory.watchForChanges = function (scope) {
    window.onresize = function() {
      scope.$parent.$parent.$digest();
    };

    scope.$watch(function() {
      return angular.element($window)[0].innerWidth;
    }, function() {
      scope.render();
    });

    scope.$watch(function () {
      return scope.settings;
    }, function() {
      scope.render();
    }, true);

    scope.$watch(function () {
      return scope.columns;
    }, function () {  
      scope.render();
    }, true);
  };

  SVGFactory.setColor = function (colorScale) {
    switch (colorScale) {
      case '10':
        return d3.scale.category10();
      case '20a':
        return d3.scale.category20();
      case '20b':
        return d3.scale.category20b();
      case '20c':
        return d3.scale.category20c();
      default: 
        return colorScale;
    }
  };

  return SVGFactory;
});
