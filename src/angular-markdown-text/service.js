markdown.factory('markdown', function (markdownConfig, $injector) {

  var _converter, $sanitize;

  if ($injector.has('$sanitize')) {
    $sanitize = $injector.get('$sanitize');
  }

  function _getConverter() {
    _converter = _converter || new Showdown.converter(markdownConfig.options);
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
        html = '';
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

});