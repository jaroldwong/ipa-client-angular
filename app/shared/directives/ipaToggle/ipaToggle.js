let ipaToggle = function () {
	return {
		restrict: 'E',
		template: require('./ipaToggle.html'),
		replace: true,
		scope: {
			isActive: '<',
			onClick: '&?',
			inactiveText: '<?', // Will override text, displays when toggle is inactive
			activeText: '<?', // Will override text, displays when toggle is active
			text: '<?' // Text to display on the button
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
};

export default ipaToggle;
