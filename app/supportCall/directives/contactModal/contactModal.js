let contactModal = function (SupportCallStatusActionCreators) {
	return {
		restrict: 'E',
		template: require('./contactModal.html'),
		replace: true,
		scope: {
			state: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.nextYear = parseInt(year) + 1;
			scope.supportCallConfigData = {};
			scope.supportCallConfigData.selectedParticipants = selectedParticipants;
			scope.supportCallConfigData.dueDate = new Date();
		
			// Generate termCode
			if (scope.termShortCode < 4) {
				scope.supportCallConfigData.termCode = scope.nextYear + scope.termShortCode;
			} else {
				scope.supportCallConfigData.termCode = scope.year + scope.termShortCode;
			}
	
			// Indicates which button started this support call: 'student' or 'instructor'
			scope.supportCallConfigData.mode = supportCallMode;
			scope.supportCallConfigData.message = "Please consider your preferences for next year. As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";
			scope.formats = ['MMMM dd, yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
			scope.format = scope.formats[0];
	
			// Datepicker config
			scope.inlineOptions = {
				minDate: new Date(),
				showWeeks: false
			};
	
			scope.dateOptions = {
				formatYear: 'yy',
				maxDate: new Date(2020, 5, 22),
				minDate: new Date(),
				startingDay: 1,
				showWeeks: false,
				initDate: new Date()
			};
	
			scope.popup1 = {};
			scope.open1 = function() {
				scope.popup1.opened = true;
			};
		
			scope.submit = function () {
				var messageInput = $('.support-call-message-input').val();
				if (messageInput) {
					scope.supportCallConfigData.message = messageInput.replace(/\r?\n/g, '<br />');
				}
		
				if (scope.supportCallConfigData.mode == "instructor") {
					SupportCallStatusActionCreators.contactInstructorsSupportCall(scope.scheduleId, scope.supportCallConfigData);
				} else {
					SupportCallStatusActionCreators.contactSupportStaffSupportCall(scope.scheduleId, scope.supportCallConfigData);
				}
		
				scope.close();
			};
		
			scope.close = function() {
				scope.isVisible = false;
			};
		
			scope.isFormIncomplete = function() {
				if (!scope.supportCallConfigData.message || scope.supportCallConfigData.message.length == 0) {
					return true;
				}
		
				return false;
			};
	
		}
	};
};

export default contactModal;
