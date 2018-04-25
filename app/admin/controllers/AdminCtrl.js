/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the ipaClientAngularApp
 */
class AdminCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, AdminActionCreators, AuthService) {
		var self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.adminActionCreators = AdminActionCreators;
		this.authService = AuthService;

		this.$scope.workgroupId = this.$routeParams.workgroupId;
		this.$scope.year = this.$routeParams.year || moment().year();
		this.$scope.view = {};

		this.getPayload().then( function() {
			self.initialize();
		})
	}

	initialize () {
		var self = this;
		this.$rootScope.$on('adminStateChanged', function (event, data) {
			self.$scope.view.state = data.state;
		});

		this.$scope.updateWorkgroup = function (workgroup) {
			self.adminActionCreators.updateWorkgroup(workgroup);
		};

		this.$scope.removeWorkgroup = function (workgroup) {
			workgroup.isRemoving = true;
			self.adminActionCreators.removeWorkgroup(workgroup);
		};

		this.$scope.addWorkgroup = function () {
			self.adminActionCreators.addWorkgroup(self.$scope.view.state.workgroups.newWorkgroup);
		};

		this.$scope.setActiveWorkgroup = function (workgroupId, year) {
			self.authService.setSharedState(self.$scope.view.state.workgroups.list[workgroupId], year);
		};
	}

	getPayload () {
		var self = this;
		var ignoreFallBackUrl = true;
		return self.authService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year, ignoreFallBackUrl).then(function () {
			return self.adminActionCreators.getInitialState();
		});
	}
}

AdminCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', 'AdminActionCreators', 'AuthService'];

export default AdminCtrl;
