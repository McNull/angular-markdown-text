var app = angular.module('app', ['ngLogo', 'githubLogo', 'markdown', 'ngSanitize', 'ngRoute']);

app.config(['$locationProvider', function($location) {
  $location.hashPrefix('!');
}]);

app.config(function ($routeProvider) {

  $routeProvider.when('/', {
    templateUrl: 'app/home.html'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

});

app.config(function (markdownConfig) {

  markdownConfig.showdown.extensions = [
    'github'
  ];

});

app.factory('isPrerender', function($window) {

  return $window.navigator.userAgent.indexOf('Prerender')!=-1;

});

app.controller('MarkdownModelCtrl', function ($scope, $http, typeEmulator, $timeout, $element, isPrerender) {
  $scope.input = {
    markdown: '# Hello',
    tPromise: null,
    exampleMarkdown: '',
    state: 'stopped'
  };

  function startTyping() {
    typeEmulator.start($scope.input, 'markdown', $scope.input.exampleMarkdown).then(function () {
      $timeout(function () {
        startTyping();
      }, 5000);
    });
  }

  $http.get('app/README.md').success(function (response) {

    if(isPrerender) {
      $scope.input.markdown = response;
    } else {
      $scope.input.exampleMarkdown = response;
      $scope.play();
    }

  });

  $scope.play = function () {
    if(!isPrerender) {
      $scope.input.state = 'playing';
      startTyping();
    }
  };

  $scope.stop = function () {

    if(!isPrerender) {
      $scope.input.state = 'stopped';
      typeEmulator.stop();

      if ($scope.tPromise) {
        $timeout.cancel($scope.tPromise);
      }

      $scope.input.markdown = $scope.input.exampleMarkdown;
    }
  };
});

app.directive('scrollToBottom', function () {

  function locateElementsByClass($element, className) {

    var result = [];

    function collect($e) {

      if ($e.hasClass(className)) {
        result.push($e);
      }

      angular.forEach($e.children(), function (child) {
        collect(angular.element(child));
      });
    }

    collect($element);

    return result;
  }

  return {
    link: function ($scope, $element) {

      var formControls = [];

      $scope.$watch('input.markdown', function (value, oldValue) {

        if (value != oldValue && $scope.input.state == 'playing') {

          formControls = !formControls.length ? locateElementsByClass($element, 'form-control') : formControls;

          angular.forEach(formControls, function ($e) {

            $e[0].scrollTop = $e[0].scrollHeight;

          });
        }

      });

    }
  };

});

app.factory('typeEmulator', function ($timeout, $q) {

  var tObj, tProp, idx, tPromise, queue, cb, defer;

  function start(targetObject, targetProperty, text) {
    tObj = targetObject;
    tProp = targetProperty;

    tObj[tProp] = '';

    idx = 0;
    queue = text;

    defer = $q.defer();

    step();

    return defer.promise;
  }

  function step() {

    if (idx < queue.length) {

      tObj[tProp] = queue.substr(0, idx);

      idx += 1;
      tPromise = $timeout(step, Math.random() * 170 + 20);
    } else {
      defer.resolve();
    }
  }

  function stop() {
    $timeout.cancel(tPromise);
  }

  return {
    start: start,
    stop: stop
  };
});