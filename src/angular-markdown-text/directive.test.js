describe('markdown-directive', function () {

  var $compile, $scope, converter, $sanitize;

  beforeEach(function() {

    module('ngSanitize');
    module('markdown');

    inject(function(_$compile_, $rootScope, _$sanitize_) {

      $sanitize = _$sanitize_;
      $compile = _$compile_;
      $scope = $rootScope.$new();

    });
  });

  it('should convert the innerText', function () {

    var converter = new Showdown.converter();

    var input =
      '# Hello\n' +
      '* ein\n' +
      '* zwein\n' +
      '* drein';

    var expected = angular.element('<div>' + $sanitize(converter.makeHtml(input)) + '</div>').html();

    var template = '<div markdown>' + input + '</div>';

    var $element = angular.element(template);

    $compile($element)($scope);
    $scope.$digest();

    var result = $element.html();

    expect(result).toEqual(expected);
  });

  it('should outline the innerText', function () {

    var converter = new Showdown.converter();

    var lines = [
      '  ', 'lorem del', 'ipsum', 'tra lalala', 'very much'
    ];

    var input = lines.join('\n  ');
    var expected = angular.element('<div>' + $sanitize(converter.makeHtml(lines.splice(1).join('\n'))) + '</div>').html();

    var template = '<div markdown>' + input + '</div>';

    var $element = angular.element(template);

    $compile($element)($scope);
    $scope.$digest();

    var result = $element.html();

    expect(result).toEqual(expected);
  });

  it('should convert expression output', function () {

    var converter = new Showdown.converter();

    var input = '# Lorem\n*ipsum*';

    var expected = angular.element('<div>' + $sanitize(converter.makeHtml(input)) + '</div>').html();

    var template = '<div markdown="input"></div>';

    $scope.input = input;

    var $element = angular.element(template);

    $compile($element)($scope);
    $scope.$digest();

    var result = $element.html();

    expect(result).toEqual(expected);
  });


});
