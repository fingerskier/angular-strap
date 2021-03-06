angular.module('$strap.directives')

.directive('bsModal', ['$parse', '$compile', '$http', '$timeout', '$q', '$templateCache', function($parse, $compile, $http, $timeout, $q, $templateCache) {
  'use strict';

  return {
    restrict: 'A',
    scope: true,
    link: function postLink(scope, element, attr, ctrl) {

      var getter = $parse(attr.bsModal),
        setter = getter.assign,
        value = getter(scope);

      $q.when($templateCache.get(value) || $http.get(value, {cache: true})).then(function onSuccess(template) {

        // Handle response from $http promise
        if(angular.isObject(template)) {
          template = template.data;
        }

        // Build modal object
        var id = getter(scope).replace('.html', '').replace(/[\/|\.|:]/g, "-") + '-' + scope.$id;
        var $modal = $('<div class="modal hide" tabindex="-1"></div>')
          .attr('id', id)
          .attr('data-backdrop', attr.backdrop || true)
          .attr('data-keyboard', attr.keyboard || true)
          .addClass(attr.modalClass ? 'fade ' + attr.modalClass : 'fade')
          .html(template);

        $('body').append($modal);

        // Configure element
        element.attr('href', '#' + id).attr('data-toggle', 'modal');

        // Compile modal content
        $timeout(function(){
          $compile($modal)(scope);
        });

        // Provide scope display functions
        scope.$modal = function(name) {
          $modal.modal(name);
        };
        scope.hide = function() {
          $modal.modal('hide');
        };
        scope.show = function() {
          $modal.modal('show');
        };
        scope.dismiss = scope.hide;

        $modal.on('show', function(event) {
          scope.$emit('modal-show', event);
        });
        $modal.on('shown', function(event) {
          scope.$emit('modal-shown', event);
          $('input[autofocus]').first().trigger('focus');
        });
        $modal.on('hide', function(event) {
          scope.$emit('modal-hide', event);
        });
        $modal.on('hidden', function(event) {
          scope.$emit('modal-hidden', event);
        });

      });
    }
  };
}]);
