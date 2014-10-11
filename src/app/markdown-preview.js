/**
 * Created by null on 11/10/14.
 */

app.directive('markdownPreview', function() {

  return {
    scope: {
      markdownModel: '=?',
      onFocus: '&?',
      onBlur: '&?'
    },
    templateUrl: 'app/markdown-preview.ng.html'
  }
});