/**
 * example:
 * <activity-diff></activity-diff>
 */
reportApp.directive("activityDiff", this.activityDiff = function () {
	return {
		restrict: "E",
		templateUrl: 'activityDiff.html',
		replace: true
	};
});
