'use strict';

/**
 * @ngdoc service
 * @name courseApp.courseService
 * @description
 * # courseService
 * Service in the courseApp.
 * courseApp specific api calls.
 */
courseApp.factory("courseService", this.courseService = function($http, $q) {
	return {
		getScheduleByWorkgroupIdAndYear: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/courseView/workgroups/" + workgroupId + "/years/" + year, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});