
markdown.factory('markdown', function(markdownConfig, $injector) {

  var _converter, $sanitize;

  if(markdownConfig.sanitize) {
    if($injector.has('$sanitize')) {
      $sanitize = $injector.get('$sanitize');
    } else {
      throw new Error('Failed to locate $sanitize service.\n' +
        'Either allow unsafe-html by setting markdownConfig.sanitize to false or include angular-sanitize.');
    }
  }

  function _getConverter() {
    _converter = _converter || new Showdown.converter(markdownConfig.options);
    return _converter;
  }

  function makeHtml(text) {
    var html = _getConverter().makeHtml(text);

    if(markdownConfig.sanitize) {
      html = $sanitize(html);
    }

    return html;
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
    outline: outline
  };

});