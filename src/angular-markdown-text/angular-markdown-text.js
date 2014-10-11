/**
 * Created by null on 10/10/14.
 */

var markdown = angular.module('markdown', []);

markdown.value('markdownConfig', {
  // Outline static markup
  outline: true,
  // Escape html
  escapeHtml: false,
  // Sanitize html,
  sanitize: true,
  // Showdown options
  showdown: {

  }
});