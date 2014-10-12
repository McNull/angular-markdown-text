
# angular-markdown-text

An easy to use _markdown directive_ with _static outlining_, _html escaping/sanitization_, _resource loading_ and _model binding_.

## Demo

A demonstration can be found [here](http://angular-markdown-text.nullest.com).

## Dependencies

* [angular.js](https://angularjs.org/) _~1.2.26_
* [angular-sanitize](https://docs.angularjs.org/api/ngSanitize/service/$sanitize) _~1.2.26_ (optional)
* [showdown](https://github.com/showdownjs/showdown) _~0.3.1_

## Installation

Either copy the contents of the `dist` folder found on [GitHub](https://github.com/McNull/angular-markdown-text) or install with [Bower](http://bower.io/).

```
$ bower install angular-markdown-text
$ bower install angular-sanitize
```

Installation of `angular-sanitize` is recommended but optional; the module will detect if it's available.

## Usage

The `markdown` directive can work with static content, model binding and external resources.

### Static Content

The simplest form is wrapping the `markdown` directive around your text. The directive will automatically outline the content so that you don't have to worry about spaces or tabs in your html markup.

```
<markdown>
  # Hello World!
</markdown>
```

### Model Binding

Provide the `markdown-model` attribute a model expression to convert its value to html.

```
<textarea ng-model="my.model"></textarea>
<markdown markdown-model="my.model"></markdown>
```

### External Resources

The directive allows you to load markdown files from a server by specifying a url expression in the `markdown-src` attribute. Note that, like the `ng-include` attribute, this is an expression; static values should be surrounded by a single quote (`'`).

```
<markdown markdown-src="'my/external/resource.md'"></markdown>
```

### Other Attributes

These attributes are simply overrides of the configuration. If no value (true/false) is provided the default found in the `markdownConfig` is used.

`markdown-escape-html` - escape any html content.

`markdown-sanitize` - sanitize the html output.

`markdown-outline` - outline the markup.

## Configuration

Global configuration can be modified by injecting the `markdownConfig` at the `config` phase of your module.

```
angular.module('myApp').config(function(markdownConfig){
  // Disable sanitization.
  markdownConfig.sanitize = false;
});
```

### Configuration Properties

```
markdownConfig = {
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
};
```
