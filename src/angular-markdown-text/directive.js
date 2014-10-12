markdown.directive('markdown', function (markdown, markdownConfig, $http, $templateCache) {

  function parseBoolAttr($attrs, name, defaultValue) {
    return $attrs[name] ? $attrs[name] == 'true' : defaultValue;
  }

  return {
    restrict: 'AE',
    terminal: true,
    compile: function (tElement, tAttrs) {

      var options = angular.copy(markdownConfig);

      options.escapeHtml = parseBoolAttr(tAttrs, 'markdownEscapeHtml', options.escapeHtml);
      options.outline = parseBoolAttr(tAttrs, 'markdownOutline', options.outline);
      options.sanitize = parseBoolAttr(tAttrs, 'markdownSanitize', options.sanitize);

      var modelExpr = tAttrs.markdown || tAttrs.markdownModel;
      var srcExpr = tAttrs.markdownSrc;

      return {
        pre: function ($scope, $element) {
          $element.data('markdown', true);
        },
        post: function ($scope, $element) {

          // Only link if we're not in markdown scope.
          if (!$element.parent().inheritedData('markdown')) {
            if (srcExpr) {

              var counter = 0;

              $scope.$watch(srcExpr, function (value) {

                // Keep track of outstanding requests

                var id = ++counter;

                if (value) {
                  $http.get(value, { cache: $templateCache }).success(function (response) {

                    // Only update if this is the latest response.

                    if (id == counter) {
                      var result = response ? markdown.makeHtml(response, options) : '';
                      if (result != undefined) {
                        $element.html(result);
                      }
                    }
                  }).error(function () {

                    // Only update if this is the latest response.

                    if (id == counter) {
                      $element.html('');
                    }
                  });
                } else {

                  // No expression, no html

                  $element.html('');
                }

              });

            } else if (modelExpr) {
              // Watch and convert the expression output
              $scope.$watch(modelExpr, function (value) {
                var result = value ? markdown.makeHtml(value, options) : '';
                if (result != undefined) {
                  $element.html(result);
                }
              });
            } else {
              // Convert the static innerHtml
              var result = markdown.makeHtml($element.html(), options);

              if (result != undefined) {
                $element.html(result);
              }

            }
          }
        }
      }
    }
  };
});