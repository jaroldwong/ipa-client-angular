class SupportCallStatusCtrl {
	constructor ($scope, $rootScope, $window, $location, $route, $routeParams, $uibModal, SupportCallStatusActionCreators, AuthService) {
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$location = $location;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$uibModal = $uibModal;
		this.SupportCallStatusActionCreators = SupportCallStatusActionCreators;
		this.AuthService = AuthService;

		var self = this;
		$window.document.title = "Instructional Support";
		$scope.workgroupId = self.$routeParams.workgroupId;
		$scope.year = self.$routeParams.year;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.termShortCode = self.$routeParams.termShortCode;

		$scope.instructorsSelected = false;
		$scope.supportStaffSelected = false;

		// Generate termCode
		if ($scope.termShortCode < 4) {
			$scope.termCode = (parseInt($scope.year) + 1) + $scope.termShortCode;
		} else {
			$scope.termCode = $scope.year + $scope.termShortCode;
		}

		$scope.view = {
			year: $scope.year,
			nextYear: $scope.nextYear,
			termShortCode: $scope.termShortCode,
			workgroupId: $scope.workgroupId,
			modalStyles: {
				width: "70%"
			}
		};

		self.$rootScope.$on('supportCallStatusStateChanged', function (event, data) {
			$scope.view.state = data;
		});

		$scope.removeInstructor = function(instructor) {
			SupportCallStatusActionCreators.removeInstructorFromSupportCall(instructor, $scope.view.state.misc.scheduleId, $scope.termCode);
		};

		$scope.removeSupportStaff = function(supportStaff) {
			SupportCallStatusActionCreators.removeSupportStaffFromSupportCall(supportStaff, $scope.view.state.misc.scheduleId, $scope.termCode);
		};

		$scope.numberToFloor = function(number) {
			return Math.floor(number);
		};

		$scope.openAddInstructorsModal = function() {
			$scope.openAddParticipantsSupportCall("instructor");
		};

		$scope.openAddSupportStaffModal = function () {
			$scope.openAddParticipantsSupportCall("supportStaff");
		};

		$scope.toggleParticipantSelection = function(participant) {
			if (participant.selected) {
				participant.selected = false;
			} else {
				participant.selected = true;
			}
		};

		$scope.toggleInstructorsSelection = function() {
			$scope.instructorsSelected = !$scope.instructorsSelected;

			$scope.view.state.supportCall.instructors.forEach(function(instructor) {
				instructor.selected = $scope.instructorsSelected;
			});
		};

		$scope.toggleSupportStaffSelection = function() {
			$scope.supportStaffSelected = !$scope.supportStaffSelected;

			$scope.view.state.supportCall.supportStaff.forEach(function(slotSupportStaff) {
				slotSupportStaff.selected = $scope.supportStaffSelected;
			});
		};

		$scope.atLeastOneInstructorSelected = function() {
			var instructorIsSelected = false;

			if ($scope.view.state) {
				$scope.view.state.supportCall.instructors.forEach(function(instructor) {
					if (instructor.selected) {
						instructorIsSelected = true;
					}
				});
			}

			return instructorIsSelected;
		};

		$scope.atLeastOneStudentSelected = function() {
			var instructorIsSelected = false;

			if ($scope.view.state) {
				$scope.view.state.supportCall.supportStaff.forEach(function(participant) {
					if (participant.selected) {
						instructorIsSelected = true;
					}
				});
			}

			return instructorIsSelected;
		};

		$scope.openAddParticipantsSupportCall = function(supportCallMode) {
			$scope.view.supportCallMode = supportCallMode;
			$scope.view.state.openAddSupportCallModal = true;
			console.log("Attempted to trigger");
		};

		$scope.openContactStudentsModal = function() {
			$scope.openContactParticipantModal("supportStaff");
		};

		$scope.openContactInstructorsModal = function() {
			$scope.openContactParticipantModal("instructor");
		};

		// Launches Contact Modal
		$scope.openContactParticipantModal = function(supportCallMode) {
			selectedParticipants = [];

			if (supportCallMode == "instructor") {
				$scope.view.state.supportCall.instructors.forEach(function(instructor) {
					if (instructor.selected) {
						selectedParticipants.push(instructor);
					}
				});
			}
			if (supportCallMode == "supportStaff") {
				$scope.view.state.supportCall.supportStaff.forEach(function(slotSupportStaff) {
					if (slotSupportStaff.selected) {
						selectedParticipants.push(slotSupportStaff);
					}
				});
			}

			modalInstance = self.$uibModal.open({
				templateUrl: 'ContactSupportCallModal.html',
				controller: ModalContactSupportCallCtrl,
				size: 'lg',
				resolve: {
					supportCallMode: function () {
						return supportCallMode;
					},
					scheduleId: function () {
						return $scope.view.state.misc.scheduleId;
					},
					state: function () {
						return $scope.view.state;
					},
					year: function () {
						return $scope.year;
					},
					termShortCode: function () {
						return $scope.termShortCode;
					},
					selectedParticipants: function () {
						return selectedParticipants;
					}
				}
			});

			modalInstance.result.then(function () {
				// This modal does not 'submit' in a traditional sense.
			},
			function () {
				// Modal closed
			});
		};

		this.getPayload();
	}


	getPayload () {
		var self = this;
		return self.AuthService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			self.SupportCallStatusActionCreators.getInitialState(self.$route.current.params.workgroupId, self.$route.current.params.year, self.$route.current.params.termShortCode);
		});	
	}
}

SupportCallStatusCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', '$uibModal', 'SupportCallStatusActionCreators', 'AuthService'];

export default SupportCallStatusCtrl;
