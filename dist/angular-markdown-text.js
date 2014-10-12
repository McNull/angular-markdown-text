/*!
   angular-markdown-text v0.0.1
   (c) 2014 (null) McNull https://github.com/McNull/angular-markdown-text
   License: MIT
*/
(function(angular,Showdown) {

var markdown = angular.module('markdown', []);

markdown.constant('markdownConfig', {
  // Outline static markup
  outline: true,
  // Escape html
  escapeHtml: false,
  // Sanitize html,
  sanitize: true,
  // Showdown options
  showdown: {
    extensions: []
  }
});
markdown.directive('markdown', ["markdown", "markdownConfig", "$http", "$templateCache", function (markdown, markdownConfig, $http, $templateCache) {

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
}]);
markdown.factory('markdown', ["markdownConfig", "$injector", function (markdownConfig, $injector) {

  var _converter, $sanitize;

  if ($injector.has('$sanitize')) {
    $sanitize = $injector.get('$sanitize');
  }

  function _getConverter() {
    _converter = _converter || new Showdown.converter(markdownConfig.showdown);
    return _converter;
  }

  function makeHtml(text, options) {

    options = options || markdownConfig;

    if(options.outline) {
      text = outline(text);
    }

    if(options.escapeHtml) {
      text = escapeHtml(text);
    }

    var html = _getConverter().makeHtml(text);

    if (options.sanitize) {

      if (!$sanitize) {
        throw new Error('Missing dependency angular-sanitize.');
      }

      try {
        html = $sanitize(html);
      } catch(ex) {
        console.log(ex);
        html = undefined;
      }

    }

    return html;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function outline(text) {

    if (text) {

      // trim leading empty lines

      text = text.replace(/^\s*\n/, '');

      // grab the first ident on the first line

      var m = text.match(/^[ \t]+/);
      if (m && m.length) {

        // build a pattern to strip out the located ident from all lines

        var p = '^[ \t]{' + m[0].length + '}';
        var r = new RegExp(p, 'gm');
        text = text.replace(r, '');
      }
    }

    return text;
  }

  return {
    _converter: _getConverter,
    makeHtml: makeHtml,
    outline: outline,
    escapeHtml: escapeHtml
  };

}]);
})(angular,Showdown);
//# sourceMappingURL=angular-markdown-text.js.map