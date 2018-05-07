const Instructor = angular.module('Instructor', [])
.factory('Instructor', ['$http', function($http) {
	function Instructor(instructorData) {
		if (instructorData) {
			this.setData(instructorData);
		}
	}
	Instructor.prototype = {
			setData: function(instructorData) {
				angular.extend(this, instructorData);
			}
	};
	return Instructor;
}]);

export default Instructor;