/**
 * Created by null on 10/10/14.
 */

var markdown = angular.module('markdown', []);

markdown.value('markdownConfig', {
  outline: true,
  sanitize: true,
  options: {
    // Showdown options
  }
});