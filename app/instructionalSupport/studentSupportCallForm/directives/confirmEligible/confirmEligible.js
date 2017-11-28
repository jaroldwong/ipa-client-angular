summaryApp.directive("confirmEligible", this.confirmEligible = function () {
	return {
		restrict: 'E',
		templateUrl: 'confirmEligible.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.props = {};
			scope.mapStateToProps(scope.state);

			$rootScope.$on('supportStaffFormStateChanged', function (event, data) {
				scope.mapStateToProps(data);
			});

			scope.mapStateToProps = function(state) {
				return state;
			};
		}
	};
});