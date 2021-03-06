let courseDetails = function () {
	return {
		restrict: 'E',
		template: require('./courseDetails.html'),
		replace: true,
		link: function (scope, element, attrs) {
			/**
			 * Filters out sequencePatterns based on the current course.
			 * It also filters out patterns that are already used for
			 * other courses of the same subjectCode and courseNumber
			 */
			scope.sequencePatternsScopedByCurrentType = function () {
				var course = scope.view.state.courses.list[scope.view.selectedEntity.id];
				var occupiedSequencePatterns = scope.view.state.courses.ids
					.filter(function (courseId) {
						return scope.view.state.courses.list[courseId].id != course.id &&
							scope.view.state.courses.list[courseId].subjectCode == course.subjectCode &&
							scope.view.state.courses.list[courseId].courseNumber == course.courseNumber;
					}).map(function (courseId) {
						return scope.view.state.courses.list[courseId].sequencePattern;
					});

				if (course.sequencePattern) {
					if (course.isSeries()) {
						return alphaSequencePatterns.filter(function (pattern) {
							return occupiedSequencePatterns.indexOf(pattern) < 0;
						});
					} else {
						return numericSequencePatterns.filter(function (pattern) {
							return occupiedSequencePatterns.indexOf(pattern) < 0;
						});
					}
				} else {
					return sequencePatterns.filter(function (pattern) {
						return occupiedSequencePatterns.indexOf(pattern) < 0;
					});
				}
			};

		}
	};
};

export default courseDetails;