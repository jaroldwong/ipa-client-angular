'use strict';

/**
 * @ngdoc service
 * @name courseApp.courseActionCreators
 * @description
 * # courseActionCreators
 * Service in the courseApp.
 * Central location for sharedState information.
 */
courseApp.service('courseActionCreators', function (courseStateService, courseService, $rootScope, Role) {
	return {
		getInitialState: function (workgroupId, year) {
			courseService.getScheduleByWorkgroupIdAndYear(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		setActiveCell: function (courseId, termCode) {
			var action = {
				type: CELL_SELECTED,
				payload: {
					courseId: courseId,
					termCode: termCode
				}
			};
			courseStateService.reduce(action);
		},
		closeDetails: function () {
			var action = {
				type: CLOSE_DETAILS,
				payload: {}
			};
			courseStateService.reduce(action);
		},
		closeNewCourseDetails: function () {
			var action = {
				type: CLOSE_NEW_COURSE_DETAILS,
				payload: {}
			};
			courseStateService.reduce(action);
		},
		toggleTermFilter: function (termId) {
			var action = {
				type: TOGGLE_TERM_FILTER,
				payload: {
					termId: termId
				}
			};
			courseStateService.reduce(action);
		},
		addSectionGroup: function (sectionGroup) {
			courseService.addSectionGroup(sectionGroup).then(function (sectionGroup) {
				$rootScope.$emit('toast', {message: "Created course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS"});
				var action = {
					type: ADD_SECTION_GROUP,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		updateSectionGroup: function (sectionGroup) {
			courseService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
				$rootScope.$emit('toast', {message: "Updated course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS"});
				var action = {
					type: UPDATE_SECTION_GROUP,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		deleteCourse: function (course) {
			var courseTitle = course.title;
			courseService.deleteCourse(course).then(function () {
				$rootScope.$emit('toast', { message: "Deleted course " + courseTitle, type: "SUCCESS"} );
				var action = {
					type: REMOVE_COURSE,
					payload: {
						course: course
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"} );
			});
		},
		newCourse: function (index) {
			var action = {
				type: NEW_COURSE,
				payload: {
					index: index
				}
			};
			courseStateService.reduce(action);
			// This needs to run after the reducer
			this.setActiveCell(0);
		},
		/**
		 * POSTs to create a course
		 *
		 * @param  newCourse		new course object
		 * @param  workgroupId
		 * @param  year
		 * @returns							created course
		 */
		createCourse: function (newCourse, workgroupId, year) {
			courseService.createCourse(newCourse, workgroupId, year).then(function (createdCourse) {
				$rootScope.$emit('toast', { message: "Created course " + createdCourse.title, type: "SUCCESS"} );
				var action = {
					type: CREATE_COURSE,
					payload: {
						course: createdCourse
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"} );
			});

		},
		updateCourse: function (course) {
			courseService.updateCourse(course).then(function (updatedCourse) {
				$rootScope.$emit('toast', { message: "Updated course " + updatedCourse.title, type: "SUCCESS"} );
				var action = {
					type: UPDATE_COURSE,
					payload: {
						course: updatedCourse
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"} );
			});
		},
		addTagToCourse: function (course, tag) {
			courseService.addTagToCourse(course, tag).then(function (updatedCourse) {
				$rootScope.$emit('toast', { message: "Added tag " + tag.name, type: "SUCCESS"} );
				var action = {
					type: UPDATE_COURSE,
					payload: {
						course: updatedCourse
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"} );
			});
		},
		removeTagFromCourse: function (course, tag) {
			courseService.removeTagFromCourse(course, tag).then(function (updatedCourse) {
				$rootScope.$emit('toast', { message: "Removed tag " + tag.name, type: "SUCCESS"} );
				var action = {
					type: UPDATE_COURSE,
					payload: {
						course: updatedCourse
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"} );
			});
		},
		getSectionsBySectionGroup: function (sectionGroup) {
			courseService.getSectionsBySectionGroupId(sectionGroup.id).then(function (sections) {
				var action = {
					type: FETCH_SECTIONS,
					payload: {
						sectionGroup: sectionGroup,
						sections: sections
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"} );
			});
		},
		updateSection: function (section) {
			courseService.updateSection(section).then(function (section) {
				$rootScope.$emit('toast', { message: "Updated section " + section.sequenceNumber, type: "SUCCESS"} );
				var action = {
					type: UPDATE_SECTION,
					payload: {
						section: section
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"} );
			});
		}
	}
});