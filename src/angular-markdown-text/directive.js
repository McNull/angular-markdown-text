markdown.directive('markdown', function ($http, markdown, markdownConfig) {

  return {
    restrict: 'AE',
    link: function ($scope, $element, $attrs) {

      var input, result;

      if ($attrs.markdown) {
        $scope.$watch($attrs.markdown, function (value) {
          result = value ? markdown.makeHtml(value) : '';
          $element.html(result);
        });
      } else {
        input = $element.html();

        if (markdownConfig.outline) {
          input = markdown.outline(input);
        }

        result = markdown.makeHtml(input);

        $element.html(result);
      }


    }
  };

});