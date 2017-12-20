window.instructionalSupportApp = angular.module("instructionalSupportApp", ["sharedApp", "ngRoute"]);

instructionalSupportApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year/:termShortCode/instructorSupportCallForm", {
			templateUrl: "InstructorSupportCallForm.html",
			controller: "InstructorSupportCallFormCtrl",
			resolve: {
				payload: InstructorSupportCallFormCtrl.getPayload
			}
		})
		.when("/:workgroupId/:year/:termShortCode/studentSupportCallForm", {
			templateUrl: "StudentSupportCallForm.html",
			controller: "StudentSupportCallFormCtrl",
			resolve: {
				payload: StudentSupportCallFormCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

// UNSORTED ACTIONS
var INIT_STATE = "INIT_STATE";
var ADD_ASSIGNMENT_SLOTS = "ADD_ASSIGNMENT_SLOTS";
var TOGGLE_ASSIGNMENT_PIVOT_VIEW = "TOGGLE_ASSIGNMENT_PIVOT_VIEW";
var DELETE_ASSIGNMENT = "DELETE_ASSIGNMENT";
var ADD_STUDENT_SUPPORT_CALL = "ADD_STUDENT_SUPPORT_CALL";
var DELETE_STUDENT_SUPPORT_CALL = "DELETE_STUDENT_SUPPORT_CALL";
var ADD_INSTRUCTOR_SUPPORT_CALL = "ADD_INSTRUCTOR_SUPPORT_CALL";
var DELETE_INSTRUCTOR_SUPPORT_CALL = "DELETE_INSTRUCTOR_SUPPORT_CALL";
var ADD_STUDENT_PREFERENCE = "ADD_STUDENT_PREFERENCE";
var DELETE_STUDENT_PREFERENCE = "DELETE_STUDENT_PREFERENCE";
var ASSIGN_STAFF_TO_SLOT = "ASSIGN_STAFF_TO_SLOT";
var REMOVE_STAFF_FROM_SLOT = "REMOVE_STAFF_FROM_SLOT";
var UPDATE_SUPPORT_CALL_RESPONSE = "UPDATE_SUPPORT_CALL_RESPONSE";
var UPDATE_PREFERENCES_ORDER = "UPDATE_PREFERENCES_ORDER";
var OPEN_INSTRUCTOR_SUPPORT_CALL_REVIEW = "OPEN_INSTRUCTOR_SUPPORT_CALL_REVIEW";
var OPEN_STUDENT_SUPPORT_CALL_REVIEW = "OPEN_STUDENT_SUPPORT_CALL_REVIEW";
var ADD_INSTRUCTOR_PREFERENCE = "ADD_INSTRUCTOR_PREFERENCE";
var DELETE_INSTRUCTOR_PREFERENCE = "DELETE_INSTRUCTOR_PREFERENCE";
var CONTACT_STUDENT_SUPPORT_CALL = "CONTACT_STUDENT_SUPPORT_CALL";
var CONTACT_INSTRUCTOR_SUPPORT_CALL = "CONTACT_INSTRUCTOR_SUPPORT_CALL";
var UPDATE_TABLE_FILTER = "UPDATE_TABLE_FILTER";
var UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW = "UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW";
var UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW = "UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW";
var UPDATE_PREFERENCE = "UPDATE_PREFERENCE";
var ASSIGN_STAFF_TO_SECTION_GROUP_SLOT = "ASSIGN_STAFF_TO_SECTION_GROUP_SLOT";

// Student Support Call Form
var OPEN_PREFERENCE_COMMENT_MODAL = "OPEN_PREFERENCE_COMMENT_MODAL";
var CLOSE_PREFERENCE_COMMENT_MODAL = "CLOSE_PREFERENCE_COMMENT_MODAL";
var CALCULATE_TIMESLOTS_FOR_CRN = "CALCULATE_TIMESLOTS_FOR_CRN";
var CALCULATE_FORM_VALID = "CALCULATE_FORM_VALID";
var BEGIN_FETCH_ACTIVITIES_BY_CRN = "BEGIN_FETCH_ACTIVITIES_BY_CRN";
var COMPLETE_FETCH_ACTIVITIES_BY_CRN = "COMPLETE_FETCH_ACTIVITIES_BY_CRN";