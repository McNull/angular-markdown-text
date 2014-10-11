var app = angular.module('app', ['ngLogo', 'githubLogo', 'markdown', 'ngSanitize', 'ngRoute']);

app.config(function ($routeProvider) {

  $routeProvider.when('/', {
    templateUrl: 'app/home.html'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

});

app.controller('MarkdownModelCtrl', function ($scope, $http, typeEmulator, $timeout) {
  $scope.input = {
    markdown: '# Hello',
    state: 'stopped',
    tPromise: null,
    exampleMarkdown: ''
  };

  function startTyping() {
    typeEmulator.start($scope.input, 'markdown', $scope.input.exampleMarkdown).then(function () {
      $timeout(function() {
        startTyping();
      }, 5000);
    });
  }

  $http.get('app/example.md').success(function(response) {
    $scope.input.exampleMarkdown = response;
    $scope.play();
  });

  $scope.play = function() {
    $scope.state = 'playing';
    startTyping();
  };

  $scope.stop = function() {
    $scope.state = 'stopped';
    typeEmulator.stop();

    if($scope.tPromise) {
      $timeout.cancel($scope.tPromise);
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