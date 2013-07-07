var directives = {
	init : function(app){

		"use strict";

		app.directive('ngTap', function() {
			return function(scope, element, attrs) {
				var tapping;
				tapping = false;
				element.bind('touchstart', function(e) {
					// element.addClass('active');
					tapping = true;
				});
				element.bind('touchmove', function(e) {
					// element.removeClass('active');
					tapping = false;
				});
				element.bind('touchend', function(e) {
					// element.removeClass('active');
					if (tapping) {
						scope.$apply(attrs['ngTap'], element);
					}
				});
				// element.bind('click', function(e) {
				// 	// element.removeClass('active');
				// 		scope.$apply(attrs['ngTap'], element);
				// });
			};
		});

		app.directive('ngSwipeleft', function() {
			return function(scope, element, attrs) {
				element.bind('swipeLeft', function(e) {
					element.addClass(attrs.ngSwipeleft);
					scope.$apply(attrs['ngSwipeleft'], element);
				});

				element.bind('swipeRight', function(e) {
					element.removeClass(attrs.ngSwipeleft);
					scope.$apply(attrs['ngSwipeleft'], element);
				});

				element.bind('click', function(e) {
					element.toggleClass(attrs.ngSwipeleft);
					scope.$apply(attrs['ngSwipeleft'], element);
				});				
			};
		});

	}
};