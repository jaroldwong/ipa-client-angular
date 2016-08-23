'use strict';

/**
 * @ngdoc service
 schedulingApp.schedulingStateService
 * @description
 * # schedulingStateService
 schedulingApp.
 * Central location for sharedState information.
 */
schedulingApp.service('schedulingStateService', function ($rootScope, Course, SectionGroup, Section, Activity, Tag, Location) {
	return {
		_state: {},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					courses = {
						newCourse: null,
						ids: []
					};
					var coursesList = {};
					var length = action.payload.courses ? action.payload.courses.length : 0;
					for (var i = 0; i < length; i++) {
						var courseData = action.payload.courses[i];
						coursesList[courseData.id] = new Course(courseData);
					}
					courses.ids = _array_sortIdsByProperty(coursesList, ["subjectCode", "courseNumber", "sequencePattern"]);
					courses.list = coursesList;
					return courses;
				case UPDATE_TAG_FILTERS:
					// Set the course.matchesTagFilters flag to true if any tag matches the filters
					courses.ids.forEach(function (courseId) {
						courses.list[courseId].matchesTagFilters = courses.list[courseId].tagIds
							.some(function (tagId) {
								return action.payload.tagIds.indexOf(tagId) >= 0;
							});
					});
					return courses;
				default:
					return courses;
			}
		},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sectionGroups = {
						newSectionGroup: {},
						ids: []
					};
					var sectionGroupsList = {};
					var length = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
					for (var i = 0; i < length; i++) {
						var sectionGroupData = action.payload.sectionGroups[i];
						sectionGroupsList[sectionGroupData.id] = new SectionGroup(sectionGroupData);
						sectionGroups.ids.push(sectionGroupData.id);
					}
					sectionGroups.list = sectionGroupsList;
					return sectionGroups;
				case FETCH_SECTION_GROUP_DETAILS:
					sectionGroups.list[action.payload.sectionGroup.id].sectionIds = action.payload.sections
						.sort(function (sectionA, sectionB) {
							if (sectionA.sequenceNumber < sectionB.sequenceNumber) { return -1; }
							if (sectionA.sequenceNumber > sectionB.sequenceNumber) { return 1; }
							return 0;
 						})
						.map(function (section) { return section.id; });
					sectionGroups.list[action.payload.sectionGroup.id].sharedActivityIds = action.payload.sharedActivities
						.map(function (a) { return a.id; });
					return sectionGroups;
				case REMOVE_ACTIVITY:
					var sectionGroup = sectionGroups.list[action.payload.activity.sectionGroupId];
					if (!sectionGroup.sharedActivityIds) { return sectionGroups; }

					var activityIndex = sectionGroup.sharedActivityIds.indexOf(action.payload.activity.id);
					if (activityIndex >= 0) {
						sectionGroup.sharedActivityIds.splice(activityIndex, 1);
					}
					return sectionGroups;
				case CREATE_SHARED_ACTIVITY:
					sectionGroups.list[action.payload.sectionGroup.id].sharedActivityIds.push(action.payload.activity.id);
					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		_sectionReducers: function (action, sections) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sections = {
						list: {},
						ids: []
					};
					return sections;
				case FETCH_SECTION_GROUP_DETAILS:
					action.payload.sections.forEach(function (section) {
						section.activityIds = action.payload.unsharedActivities
							.filter(function (a) { return a.sectionId == section.id; })
							.map(function (a) { return a.id; });
						sections.list[section.id] = new Section(section);
						sections.ids.push(section.id);
					});
					return sections;
				case REMOVE_ACTIVITY:
					var section = sections.list[action.payload.activity.sectionId];
					var activityIndex = section.activityIds.indexOf(action.payload.activity.id);
					if (activityIndex >= 0) {
						section.activityIds.splice(activityIndex, 1);
					}
					return sections;
				case CREATE_ACTIVITY:
					sections.list[action.payload.activity.sectionId].activityIds.push(action.payload.activity.id);
					return sections;
				default:
					return sections;
			}
		},
		_activityReducers: function (action, activities) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					activities = {
						list: {},
						ids: []
					};
					return activities;
				case FETCH_SECTION_GROUP_DETAILS:
					action.payload.sharedActivities.forEach(function (activity) {
						activities.list[activity.id] = new Activity(activity);
						activities.list[activity.id].courseId = action.payload.sectionGroup.courseId;
						activities.ids.push(activity.id);
					});
					action.payload.unsharedActivities.forEach(function (activity) {
						activities.list[activity.id] = new Activity(activity);
						activities.list[activity.id].courseId = action.payload.sectionGroup.courseId;
						activities.ids.push(activity.id);
					});
					return activities;
				case UPDATE_ACTIVITY:
					activities.list[action.payload.activity.id] = new Activity(action.payload.activity);
					return activities;
				case REMOVE_ACTIVITY:
					var activityIndex = activities.ids.indexOf(action.payload.activity.id);
					activities.ids.splice(activityIndex, 1);
					delete activities.list[action.payload.activity.id];
					return activities;
				case CREATE_SHARED_ACTIVITY:
				case CREATE_ACTIVITY:
					activities.list[action.payload.activity.id] = new Activity(action.payload.activity);
					activities.list[action.payload.activity.id].courseId = action.payload.sectionGroup.courseId;
					activities.ids.push(action.payload.activity.id);
					return activities;
				default:
					return activities;
			}
		},
		_tagReducers: function (action, tags) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					tags = {
						ids: []
					};
					var tagsList = {};
					var length = action.payload.tags ? action.payload.tags.length : 0;
					for (var i = 0; i < length; i++) {
						var tagData = action.payload.tags[i];
						if (tagData.archived == false) {
							tagsList[tagData.id] = new Tag(tagData);
						}
					}
					tags.ids = _array_sortIdsByProperty(tagsList, "name");
					tags.list = tagsList;
					return tags;
				default:
					return tags;
			}
		},
		_locationReducers: function (action, locations) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					locations = {
						list: {},
						ids: []
					};
					var locationsList = {};
					var length = action.payload.locations ? action.payload.locations.length : 0;
					for (var i = 0; i < length; i++) {
						var locationData = action.payload.locations[i];
						if (locationData.archived == false) {
							locationsList[locationData.id] = new Location(locationData);
						}
					}
					locations.ids = _array_sortIdsByProperty(locationsList, "description");
					locations.list = locationsList;
					return locations;
				default:
					return locations;
			}
		},
		_filterReducers: function (action, filters) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					// A filter is 'enabled' if it is checked, i.e. the category it represents
					// is selected to be shown/on/active.
					filters = {
						enabledTagIds: [],
						hiddenDays: [0, 6], // Default hidden days: Sat and Sun
						enableUnpublishedCourses: false
					};
					// Here is where we might load stored data about what filters
					// were left on last time.
					return filters;
				case TOGGLE_DAY:
					var tagIndex = filters.hiddenDays.indexOf(action.payload.dayIndex);
					if (tagIndex >= 0) {
						filters.hiddenDays.splice(tagIndex, 1);
					} else if (filters.hiddenDays.length < 6) { // Make sure not to hide all days
						filters.hiddenDays.push(action.payload.dayIndex);
					}
					return filters;
				case UPDATE_TAG_FILTERS:
					filters.enabledTagIds = action.payload.tagIds;
					return filters;
				default:
					return filters;
			}
		},
		_uiStateReducers: function (action, uiState) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					uiState = {
						selectedSectionGroupId: null,
						selectedCourseId: null,
						selectedActivityId: null,
						checkedSectionGroupIds: []
					};
					return uiState;
				case SECTION_GROUP_SELECTED:
					uiState.selectedActivityId = null;
					if (uiState.selectedSectionGroupId != action.payload.sectionGroup.id) {
						uiState.selectedSectionGroupId = action.payload.sectionGroup.id;
						uiState.selectedCourseId = action.payload.sectionGroup.courseId;
					} else {
						uiState.selectedSectionGroupId = null;
						uiState.selectedCourseId = null;
					}
					return uiState;
				case SECTION_GROUP_TOGGLED:
					var sectionGroupCheckedIndex = uiState.checkedSectionGroupIds.indexOf(action.payload.sectionGroupId);
					if (sectionGroupCheckedIndex < 0) {
						uiState.checkedSectionGroupIds.push(action.payload.sectionGroupId);
					} else {
						uiState.checkedSectionGroupIds.splice(sectionGroupCheckedIndex, 1);
					}
					return uiState;
				case ACTIVITY_SELECTED:
					if (uiState.selectedActivityId != action.payload.activity.id) {
						uiState.selectedActivityId = action.payload.activity.id;
						uiState.selectedSectionGroupId = action.payload.activity.sectionGroupId;
						uiState.selectedCourseId = action.payload.activity.courseId;
					} else {
						uiState.selectedActivityId = null;
					}
					return uiState;
				case UPDATE_TAG_FILTERS:
					// TODO: needs re-visiting, ultimately this should clear
					// checkedSectionGroupIds, selectedSectionGroupId, selectedCourseId,
					// and selectedActivityId ONLY if they don't match the filters
					uiState.selectedSectionGroupId = null;
					uiState.selectedCourseId = null;
					uiState.selectedActivityId = null;
					uiState.checkedSectionGroupIds = [];
					return uiState;
				case REMOVE_ACTIVITY:
					if (uiState.selectedActivityId == action.payload.activity.id) {
						uiState.selectedActivityId = null;
					}
					return uiState;
				default:
					return uiState;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.sections = scope._sectionReducers(action, scope._state.sections);
			newState.activities = scope._activityReducers(action, scope._state.activities);
			newState.tags = scope._tagReducers(action, scope._state.tags);
			newState.locations = scope._locationReducers(action, scope._state.locations);
			newState.filters = scope._filterReducers(action, scope._state.filters);
			newState.uiState = scope._uiStateReducers(action, scope._state.uiState);

			scope._state = newState;
			$rootScope.$emit('schedulingStateChanged', {
				state: scope._state,
				actionType: action.type
			});

			console.debug("Scheduling state updated:");
			console.debug(scope._state);
		}
	}
});