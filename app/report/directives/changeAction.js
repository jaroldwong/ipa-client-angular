/**
 * example:
 * <change-action
 *	title="Planned Seats don't match"
 *	sis-value-message="Apply banner maximum enrollment to IPA"
 *	ipa-value-message="Apply IPA maximum enrollment to Banner"
 *	apply-sis="methodToApplyBannerValueToIpa()"
 *	apply-ipa="methodToApplyIpaValueToBanner()"
 *	hide-ipa-message="true"
 * ></change-action>
 */
reportApp.directive("changeAction", this.changeAction = function () {
	return {
		restrict: "E",
		templateUrl: 'changeAction.html',
		replace: true,
		scope: {
			title: '@',
			sisValueMessage: '@',
			ipaValueMessage: '@',
			applySis: '&',
			applyIpa: '&'
		},
		link: function (scope, element, attrs) {
			scope.hideSisMessage = attrs.hideSisMessage == 'true';
			scope.hideIpaMessage = attrs.hideIpaMessage == 'true';
		}
	};
});