app.directive('playState', function($templateCache) {

  var template = $templateCache.get('app/play-state.ng.html');

  return {
    compile: function(tElement, tAttrs) {

      tElement.addClass('play-state');
      tElement.append(template);

      return {
        pre: function($scope, $element, $attrs) {

        }
      };
    }
  };
});
