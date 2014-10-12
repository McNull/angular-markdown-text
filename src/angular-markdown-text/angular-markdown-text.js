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