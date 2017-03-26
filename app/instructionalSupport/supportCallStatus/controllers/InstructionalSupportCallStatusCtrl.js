/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('InstructionalSupportCallStatusCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'instructionalSupportCallStatusActionCreators',
		this.InstructionalSupportCallStatusCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, instructionalSupportCallStatusActionCreators) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.termShortCode = $routeParams.termShortCode;

			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};
			$scope.termShortCode = $routeParams.termShortCode;

			$rootScope.$on('supportCallStatusStateChanged', function (event, data) {
				$scope.view.state = data;
				console.log($scope.view.state);
			});

			$scope.deleteStudentSupportCall = function(studentSupportCall) {
				instructionalSupportCallStatusActionCreators.deleteStudentSupportCall(studentSupportCall);
			};

			$scope.deleteInstructorSupportCall = function(instructorSupportCall) {
				instructionalSupportCallStatusActionCreators.deleteInstructorSupportCall(instructorSupportCall);
			};

			$scope.numberToFloor = function(number) {
				return Math.floor(number);
			};

			$scope.openSupportCallConfig = function(supportCallMode) {

				modalInstance = $uibModal.open({
					templateUrl: 'AddSupportCallModal.html',
					controller: ModalAddSupportCallCtrl,
					size: 'lg',
					resolve: {
						supportCallMode: function () {
							return supportCallMode;
						},
						scheduleId: function () {
							return $scope.view.state.userInterface.scheduleId;
						},
						mastersIds: function () {
							return $scope.view.state.mastersIds;
						},
						phdIds: function () {
							return $scope.view.state.phdIds;
						},
						instructionalSupportIds: function () {
							return $scope.view.state.instructionalSupportIds;
						},
						instructionalSupportStaffs: function () {
							return $scope.view.state.instructionalSupportStaffs;
						},
						instructors: function () {
							return $scope.view.state.instructors;
						},
						instructorsByShortTermCode: function () {
							return $scope.view.state.userInterface.instructorsByShortTermCode;
						},
						year: function () {
							return $scope.year;
						},
						nextYear: function () {
							return $scope.nextYear;
						}
					}
				});
			};

			$scope.getTermDescription = function(term) {
				var endingYear = "";
				if (term.length == 6) {
					endingYear = term.substring(0,4);
					term = term.slice(-2);
				}

				termNames = {
					'05': 'Summer Session 1',
					'06': 'Summer Special Session',
					'07': 'Summer Session 2',
					'08': 'Summer Quarter',
					'09': 'Fall Semester',
					'10': 'Fall Quarter',
					'01': 'Winter Quarter',
					'02': 'Spring Semester',
					'03': 'Spring Quarter'
				};

				return termNames[term];
			};
	}]);

InstructionalSupportCallStatusCtrl.getPayload = function (authService, instructionalSupportCallStatusActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportCallStatusActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode);
	});
};