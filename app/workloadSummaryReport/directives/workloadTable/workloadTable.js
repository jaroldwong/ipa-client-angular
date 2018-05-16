import './workloadTable.css';

let workloadTable = function () {
	return {
		restrict: 'E',
		template: require('./workloadTable.html'),
		replace: true,
		scope: {
			instructors: '<'
		},
		link: function(scope, element, attrs) {
			// Intentionally blank
		}
	};
};

export default workloadTable;
