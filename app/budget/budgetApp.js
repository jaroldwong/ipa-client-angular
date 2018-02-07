window.budgetApp = angular.module("budgetApp", ["sharedApp", "ngRoute"]);

budgetApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "BudgetCtrl.html",
			controller: "BudgetCtrl",
			resolve: {
				validate: BudgetCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";
var CREATE_BUDGET_SCENARIO = "CREATE_BUDGET_SCENARIO";
var DELETE_BUDGET_SCENARIO = "DELETE_BUDGET_SCENARIO";
var CREATE_LINE_ITEM = "CREATE_LINE_ITEM";
var UPDATE_LINE_ITEM = "UPDATE_LINE_ITEM";
var DELETE_LINE_ITEM = "DELETE_LINE_ITEM";
var UPDATE_BUDGET = "UPDATE_BUDGET";
var UPDATE_BUDGET_SCENARIO = "UPDATE_BUDGET_SCENARIO";
var CREATE_SECTION_GROUP_COST = "CREATE_SECTION_GROUP_COST";
var UPDATE_SECTION_GROUP_COST= "UPDATE_SECTION_GROUP_COST";
var UPDATE_INSTRUCTOR_COST = "UPDATE_INSTRUCTOR_COST";
var CREATE_SECTION_GROUP_COST_COMMENT = "CREATE_SECTION_GROUP_COST_COMMENT";
var CREATE_LINE_ITEM_COMMENT = "CREATE_LINE_ITEM_COMMENT";
var DELETE_LINE_ITEMS = "DELETE_LINE_ITEMS";
var UPDATE_BUDGET_SCENARIO = "UPDATE_BUDGET_SCENARIO";
var CREATE_INSTRUCTOR_TYPE = "CREATE_INSTRUCTOR_TYPE";
var UPDATE_INSTRUCTOR_TYPE = "UPDATE_INSTRUCTOR_TYPE";
var DELETE_INSTRUCTOR_TYPE = "DELETE_INSTRUCTOR_TYPE";

/* UI manipulation actions */
var SELECT_BUDGET_SCENARIO = "SELECT_BUDGET_SCENARIO";
var SELECT_TERM = "SELECT_TERM";

/* Modal UI */
var OPEN_ADD_LINE_ITEM_MODAL = "OPEN_ADD_LINE_ITEM_MODAL";
var CLOSE_ADD_LINE_ITEM_MODAL = "CLOSE_ADD_LINE_ITEM_MODAL";
var OPEN_ADD_COURSE_COMMENT_MODAL = "OPEN_ADD_COURSE_COMMENT_MODAL";
var CLOSE_ADD_COURSE_COMMENT_MODAL = "CLOSE_ADD_COURSE_COMMENT_MODAL";
var TOGGLE_ADD_BUDGET_SCENARIO_MODAL = "TOGGLE_ADD_BUDGET_SCENARIO_MODAL";
var OPEN_ADD_LINE_ITEM_COMMENT_MODAL = "OPEN_ADD_LINE_ITEM_COMMENT_MODAL";
var CLOSE_BUDGET_CONFIG_MODAL = "CLOSE_BUDGET_CONFIG_MODAL";
var OPEN_BUDGET_CONFIG_MODAL = "OPEN_BUDGET_CONFIG_MODAL";

/* Line item UI */
var TOGGLE_SELECT_LINE_ITEM = "TOGGLE_SELECT_LINE_ITEM";
var SELECT_ALL_LINE_ITEMS = "SELECT_ALL_LINE_ITEMS";
var DESELECT_ALL_LINE_ITEMS = "DESELECT_ALL_LINE_ITEMS";
var SET_ROUTE = "SET_ROUTE";

/* Calculations */
var CALCULATE_SCENARIO_TERMS = "CALCULATE_SCENARIO_TERMS";
var CALCULATE_SECTION_GROUPS = "CALCULATE_SECTION_GROUPS";
var CALCULATE_TOTAL_COST = "CALCULATE_TOTAL_COST";
var CALCULATE_INSTRUCTOR_TYPES = "CALCULATE_INSTRUCTOR_TYPES";
var CALCULATE_INSTRUCTORS = "CALCULATE_INSTRUCTORS";