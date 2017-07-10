/**
 * Provides the main course table in the Courses View
 */
budgetApp.directive("addBudgetScenario", this.addBudgetScenario = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addBudgetScenario.html',
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			scope.newBudgetScenario = {};
			scope.newBudgetScenario.name = "";
			scope.newBudgetScenario.budgetScenarioId = 0;
			scope.newBudgetScenario.description = "Schedule Data";

			scope.budgetId = attrs.budgetId;

			scope.selectBudgetScenario = function(budgetScenario) {
				if (budgetScenario == null) {
					scope.newBudgetScenario.budgetScenarioId = 0;
					scope.newBudgetScenario.description = "Schedule Data";
				} else {
					scope.newBudgetScenario.budgetScenarioId = budgetScenario.id;
					scope.newBudgetScenario.description = budgetScenario.name;
				}
			};
			scope.submitBudgetScenarioForm = function () {
				budgetActions.createBudgetScenario(scope.newBudgetScenario, scope.budgetId, scope.newBudgetScenario.budgetScenarioId);
			};
		} // end link
	};
});