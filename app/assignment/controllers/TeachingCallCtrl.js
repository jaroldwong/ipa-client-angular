'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:TeachingCallCtrl
 * @description
 * # TeachingCallCtrl
 * Controller of the ipaClientAngularApp
 */
assignmentApp.controller('TeachingCallCtrl', ['$scope', '$rootScope', '$routeParams', 'assignmentActionCreators',
		this.TeachingCallCtrl = function ($scope, $rootScope, $routeParams, assignmentActionCreators) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.view = {};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				$scope.view.state = data;
				console.log($scope.view.state);
			});
	}]);

TeachingCallCtrl.validate = function (authService, assignmentActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then( function() {
		assignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	})
}