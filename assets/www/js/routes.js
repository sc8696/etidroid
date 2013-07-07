var routes = {
	init : function(app){

		"use strict";

		app.config(function($routeProvider, $locationProvider){

			// $locationProvider.html5Mode(true);

			$routeProvider
				.when('/mainView.html', {
					templateUrl: 'partials/boards.html',
					controller: 'boardsCtrl'
				})
				.when('/topics', {
					templateUrl: 'partials/topics.html',
					controller: 'topicsCtrl'
				})
				.when('/posts', {
					templateUrl: 'partials/posts.html',
					controller: 'postsCtrl'
				})
				.otherwise({
					redirectTo: 'nope'
				});
			// $locationProvider.html5Mode( true );
		});
	}
};