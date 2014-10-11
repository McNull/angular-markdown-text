describe('markdown-directive', function () {

  var markdown, $compile, $scope, $sanitize, $templateCache, $ = angular.element;

  beforeEach(function() {

    module('ngSanitize');
    module('markdown');

    inject(function(_$compile_, $rootScope, _$sanitize_, _$templateCache_, _markdown_) {

      $sanitize = _$sanitize_;
      $compile = _$compile_;
      $scope = $rootScope.$new();
      $templateCache = _$templateCache_;
      markdown = _markdown_;

    });
  });

  describe('static innerhtml', function() {
    it('should convert static text', function() {

      var input = '# Hello world';
      var expected = markdown.makeHtml(input);

      var template = '<div markdown>' + input + '</div>';

      var $element = $compile(template)($scope);
      $scope.$digest();

      expect($element.html()).toBe(expected);
    });

    it('should outline static text', function() {

      var input = '# Hello world\n*fun*';
      var expected = $('<div>' + markdown.makeHtml(input) + '</div>').html();

      var template = '<div markdown>     ' + input + '</div>';

      var $element = $compile(template)($scope);
      $scope.$digest();

      expect($element.html()).toBe(expected);
    });

    it('should not convert nested markdown directives', function() {

      var input =
        '# Hello world\n' +
        '<div markdown>\n' +
          '## Hello to you too\n' +
        '</div>';

      var expected = $('<div>' + markdown.makeHtml(input) + '</div>').html();

      var template = '<div markdown>' + input + '</div>';

      var $element = $compile(template)($scope);
      $scope.$digest();

      expect($element.html().replace('markdown=""', 'markdown')).toBe(expected);

    });

  });

  describe('scope expression', function() {

    it('should convert the output of the expression', function() {

      var input = '# Hello world';
      var expected = markdown.makeHtml(input);

      var template = '<div markdown="myMarkDown"></div>';

      $scope.myMarkDown = input;

      var $element = $compile(template)($scope);
      $scope.$digest();

      expect($element.html()).toBe(expected);
    });

  });

  describe('markdown include', function() {

    it('should convert the server side resource', function() {

      var input = '# Hello world';
      var expected = markdown.makeHtml(input);

      $templateCache.put('my-markdown.md', input);

      var template = '<div markdown markdown-src="\'my-markdown.md\'"></div>';

      var $element = $compile(template)($scope);
      $scope.$digest();

      expect($element.html()).toBe(expected);
    });

  });

//  it('should convert the innerText', function () {
//
//    var converter = new Showdown.converter();
//
//    var input =
//      '# Hello\n' +
//      '* ein\n' +
//      '* zwein\n' +
//      '* drein';
//
//    var expected = angular.element('<div>' + $sanitize(converter.makeHtml(input)) + '</div>').html();
//
//    var template = '<div markdown>' + input + '</div>';
//
//    var $element = angular.element(template);
//
//    $compile($element)($scope);
//    $scope.$digest();
//
//    var result = $element.html();
//
//    expect(result).toEqual(expected);
//  });
//
//  it('should outline the innerText', function () {
//
//    var converter = new Showdown.converter();
//
//    var lines = [
//      '  ', 'lorem del', 'ipsum', 'tra lalala', 'very much'
//    ];
//
//    var input = lines.join('\n  ');
//    var expected = angular.element('<div>' + $sanitize(converter.makeHtml(lines.splice(1).join('\n'))) + '</div>').html();
//
//    var template = '<div markdown>' + input + '</div>';
//
//    var $element = angular.element(template);
//
//    $compile($element)($scope);
//    $scope.$digest();
//
//    var result = $element.html();
//
//    expect(result).toEqual(expected);
//  });
//
//  it('should convert expression output', function () {
//
//    var converter = new Showdown.converter();
//
//    var input = '# Lorem\n*ipsum*';
//
//    var expected = angular.element('<div>' + $sanitize(converter.makeHtml(input)) + '</div>').html();
//
//    var template = '<div markdown="input"></div>';
//
//    $scope.input = input;
//
//    var $element = angular.element(template);
//
//    $compile($element)($scope);
//    $scope.$digest();
//
//    var result = $element.html();
//
//    expect(result).toEqual(expected);
//  });
//
//  it('should convert the included template', function() {
//
//    var converter = new Showdown.converter();
//
//    var input = '# Lorem\n*ipsum*';
//
//    var expected = angular.element('<div>' + $sanitize(converter.makeHtml(input)) + '</div>').html();
//
//    $templateCache.put('my-markdown.md', input);
//
//    var template = '<div><div markdown ng-include="\'my-markdown.md\'"></div></div>';
//
//    $scope.input = input;
//
//    var $element = angular.element(template);
//
//    $element = $compile($element)($scope);
//    $scope.$digest();
//
//    var result = $element.find('span').html();
//
//    expect(result).toEqual(expected);
//
//  });
//
//  it('should not link nested markdown directives', function() {
//
//    var template =
//      '<div markdown>\n' +
//        '# Parent\n' +
//        '```\n' +
//        '<div markdown>\n' +
//          '# Child\n' +
//        '</div>\n' +
//        '```\n' +
//      '</div>\n';
//
//    var $element = angular.element(template);
//    $element = $compile($element)($scope);
//    $scope.$digest();
//
//    var result = $element.html();
//
//    expect(result.indexOf('# Child')).toNotEqual(-1);
//  });


});
