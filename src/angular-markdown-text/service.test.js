describe('markdown-service', function() {

  var markdown, $sanitize;

  beforeEach(function() {

    module('markdown');
    module('ngSanitize');

    inject(function(_markdown_, _$sanitize_) {

      markdown = _markdown_;
      $sanitize = _$sanitize_;

    });

  });

  it('should inject the service', function() {

    expect(markdown).toBeDefined();

  });

  describe('converter', function() {

    it('should return a converter', function() {
      var result = markdown._converter();
      expect(result).toBeDefined();
    });

    it('should return the same instance', function() {
      var result1 = markdown._converter();
      var result2 = markdown._converter();
      expect(result1).toBe(result2);
    });

  });

  describe('makeHtml', function() {

    it('should return html text', function() {

      var options = {
        escapeHtml: false,
        sanitize: false
      };

      var input =
        "# lorem ipsum\n" +
        "lorem ipsum";

      var expected = (new Showdown.converter()).makeHtml(input);
      var result = markdown.makeHtml(input, options);

      expect(result).toEqual(expected);
    });

    it('should return html text with escaped html', function() {

      var options = {
        escapeHtml: true,
        sanitize: false
      };

      var html = "<script>alert('pwnd');</script>";
      var escapedHtml = markdown.escapeHtml(html);

      var input =
        "# lorem ipsum\n" +
        "lorem ipsum\n\n";

      var expected = (new Showdown.converter()).makeHtml(input) + '\n\n<p>' + escapedHtml + '</p>';
      var result = markdown.makeHtml(input + html, options);

      expect(result).toEqual(expected);
    });

    it('should return sanitized html text', function() {

      var options = {
        escapeHtml: false,
        sanitize: true
      };

      var html = "<script>alert('pwnd');</script>";

      var input =
        "# lorem ipsum\n" +
        "lorem ipsum";

      var expected = $sanitize((new Showdown.converter()).makeHtml(input + html));

      var result = markdown.makeHtml(input, options);

      expect(result).toEqual(expected);
    });


    it('should return outlined html text', function() {

      var options = {
        escapeHtml: false,
        sanitize: false,
        outline: true
      };

      var input =
        "  # lorem ipsum\n" +
        "    lorem ipsum";

      var outlined = markdown.outline(input);
      var expected = (new Showdown.converter()).makeHtml(outlined);

      var result = markdown.makeHtml(input, options);

      expect(result).toEqual(expected);
    });

  });


  describe('outline', function() {

    it('should return text', function() {

      var input = 'lorem del ipsum';
      var result = markdown.outline(input);

      expect(result).toEqual(input);

    });

    it('should outline a single line', function() {

      var input = '    lorem del ipsum';
      var expected = 'lorem del ipsum';

      var result = markdown.outline(input);

      expect(result).toEqual(expected);

    });

    it('should outline a single line', function() {

      var lines = [
        '', 'lorem del', 'ipsum', 'tra lalala', 'very much'
      ];

      var input = lines.join('\n\t  ');
      var expected = lines.splice(1).join('\n');

      var result = markdown.outline(input);

      expect(result).toEqual(expected);

    });
  });
});

