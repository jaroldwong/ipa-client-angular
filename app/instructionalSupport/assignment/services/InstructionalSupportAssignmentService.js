instructionalSupportApp.factory("instructionalSupportAssignmentService", this.instructionalSupportAssignmentService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year, termShortCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode, { withCredentials: true })
			.success(function(assignmentView) {
				deferred.resolve(assignmentView);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addAssignmentSlots: function(appointmentType, appointmentPercentage, numberOfAssignments, sectionGroupId) {

			var instructionalSupportAssignment = {appointmentPercentage : appointmentPercentage, appointmentType: appointmentType};

			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportView/sectionGroups/" + sectionGroupId + "/instructionalSupportAssignments/" + numberOfAssignments, instructionalSupportAssignment, { withCredentials: true })
			.success(function(assignmentView) {
				deferred.resolve(assignmentView);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});