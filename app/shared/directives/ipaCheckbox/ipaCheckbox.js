sharedApp.directive("ipaCheckbox", this.ipaCheckbox = function() {
	return {
		restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
		templateUrl: 'ipaCheckbox.html', // directive html found here:
		scope: {
			isChecked: '=',
			clickAction: '&'
		},
		replace: true, // Replace with the template below
		link: function(scope, element, attrs) {
			/* Example Usage:
			<ipa-checkbox
				is-checked="supportCall.commentsRequired"
				click=action="toggleThing()">
			</ipa-checkbox>
			*/

		}
	};
});