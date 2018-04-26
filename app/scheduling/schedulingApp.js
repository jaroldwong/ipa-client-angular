// Controllers
import SchedulingCtrl from './controllers/SchedulingCtrl.js';

// Services
import SchedulingActionCreators from './services/schedulingActionCreators.js';
import SchedulingService from './services/schedulingService.js';
import SchedulingStateService from './services/schedulingStateService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';

// Directives
import termCalendar from './directives/termCalendar/termCalendar.js';
import timeInput from './directives/timeInput/timeInput.js';
import activityDetails from './directives/activityDetails/activityDetails.js';
import locationEditor from './directives/activityDetails/locationEditor/locationEditor.js';
import timeEditor from './directives/activityDetails/timeEditor/timeEditor.js';
import freeformTimeInput from './directives/activityDetails/timeEditor/freeformTimeInput/freeformTimeInput.js';
import standardTimeSelector from './directives/activityDetails/timeEditor/standardTimeSelector/standardTimeSelector.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/:termShortCode", {
		template: require('./templates/SchedulingCtrl.html'),
		controller: "SchedulingCtrl"
	})
	.when("/", {
		template: require('./templates/SchedulingCtrl.html'),
		controller: "SchedulingCtrl"
	})
	.otherwise({
		redirectTo: function () {
			window.location = "/not-found.html";
		}
	});

};

config.$inject = ['$routeProvider'];

// App declaration
const schedulingApp = angular.module("schedulingApp", dependencies)
.config(config)
.controller('SchedulingCtrl', SchedulingCtrl)
.service('CourseActionCreators', CourseActionCreators)
.service('CourseService', CourseService)
.service('CourseStateService', CourseStateService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.directive('termCalendar', termCalendar)
.directive('timeInput', timeInput)
.directive('activityDetails', activityDetails)
.directive('locationEditor', locationEditor)
.directive('timeEditor', timeEditor)
.directive('freeformTimeInput', freeformTimeInput)
.directive('standardTimeSelector', standardTimeSelector)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	SECTION_GROUP_SELECTED: "SECTION_GROUP_SELECTED",
	SECTION_GROUP_TOGGLED: "SECTION_GROUP_TOGGLED",
	ACTIVITY_SELECTED: "ACTIVITY_SELECTED",
	TOGGLE_DAY: "TOGGLE_DAY",
	UPDATE_TAG_FILTERS: "UPDATE_TAG_FILTERS",
	UPDATE_LOCATION_FILTERS: "UPDATE_LOCATION_FILTERS",
	UPDATE_INSTRUCTOR_FILTERS: "UPDATE_INSTRUCTOR_FILTERS",
	UPDATE_ACTIVITY: "UPDATE_ACTIVITY",
	REMOVE_ACTIVITY: "REMOVE_ACTIVITY",
	CREATE_SHARED_ACTIVITY: "CREATE_SHARED_ACTIVITY",
	CREATE_ACTIVITY: "CREATE_ACTIVITY",
	CHECK_ALL_TOGGLED: "CHECK_ALL_TOGGLED",
	FETCH_COURSE_ACTIVITY_TYPES: "FETCH_COURSE_ACTIVITY_TYPES",
	CREATE_SECTION: "CREATE_SECTION",
	DELETE_SECTION: "DELETE_SECTION",
	GET_ACTIVITIES: "GET_ACTIVITIES",

});

export default schedulingApp;
