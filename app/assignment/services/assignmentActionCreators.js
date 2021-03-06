/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
class AssignmentActionCreators {
	constructor (AssignmentStateService, $route, AssignmentService, $rootScope, $window, Role, ActionTypes) {
		var _self = this;
		this.AssignmentStateService = AssignmentStateService;
		this.AssignmentService = AssignmentService;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.Role = Role;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function () {
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;
				var tab = $route.current.params.tab;

				_self.AssignmentService.getInitialState(workgroupId, year).then(function (payload) {
					var action = {
						type: ActionTypes.INIT_ASSIGNMENT_VIEW,
						payload: payload,
						year: year,
						tab: tab
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not load assignment view.", type: "ERROR" });
				});
			},
			updateTagFilters: function (tagIds) {
				var action = {
					type: ActionTypes.UPDATE_TAG_FILTERS,
					payload: {
						tagIds: tagIds
					}
				};
				_self.AssignmentStateService.reduce(action);
			},
			updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
				_self.AssignmentService.updateAssignmentsOrder(sortedTeachingAssignmentIds, scheduleId).then(function (sortedTeachingAssignmentIds) {
					$rootScope.$emit('toast', { message: "Updated Assignment Priority", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TEACHING_ASSIGNMENT_ORDER,
						payload: {
							sortedTeachingAssignmentIds: sortedTeachingAssignmentIds
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update assignment order.", type: "ERROR" });
				});
			},
			addScheduleInstructorNote: function (instructorId, year, workgroupId, comment, assignmentsCompleted) {
				_self.AssignmentService.addScheduleInstructorNote(instructorId, year, workgroupId, comment, assignmentsCompleted).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not add instructor comment.", type: "ERROR" });
				});
			},
			updateScheduleInstructorNote: function (scheduleInstructorNote) {
				_self.AssignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Updated instructor comment", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update instructor comment.", type: "ERROR" });
				});
			},
			markInstructorComplete: function (scheduleInstructorNote) {
				_self.AssignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Instructor marked completed", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not mark instructor complete.", type: "ERROR" });
				});
			},
			markInstructorIncomplete: function (scheduleInstructorNote) {
				_self.AssignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Instructor marked incomplete", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not mark instructor incomplete.", type: "ERROR" });
				});
			},
			updateTeachingCallResponse: function (teachingCallResponse) {
				_self.AssignmentService.updateTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
					_self.$rootScope.$emit('toast', { message: "Updated availabilities", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TEACHING_CALL_RESPONSE,
						payload: {
							teachingCallResponse: teachingCallResponse
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
				});
			},
			updateTeachingCallReceipt: function (teachingCallReceipt) {
				_self.AssignmentService.updateTeachingCallReceipt(teachingCallReceipt).then(function (teachingCallReceipt) {
					_self.$rootScope.$emit('toast', { message: "Updated Preferences", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TEACHING_CALL_RECEIPT,
						payload: {
							teachingCallReceipt: teachingCallReceipt
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
				});
			},
			addInstructorAssignment: function (instructorId, year, workgroupId, comment) {
				var scheduleInstructorNote = {};
				scheduleInstructorNote.instructorId = instructorId;
				scheduleInstructorNote.comment = comment;
	
				_self.AssignmentService.addScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not add instructor comment.", type: "ERROR" });
				});
			},
			removeInstructorAssignment: function (teachingAssignment) {
				_self.AssignmentService.removeInstructorAssignment(sectionGroupId, instructorId).then(function (sectionGroupId) {
					_self.$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_TEACHING_ASSIGNMENT,
						payload: {
							sectionGroup: sectionGroup
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			addAndApproveInstructorAssignment: function (teachingAssignment, scheduleId) {
				_self.AssignmentService.addInstructorAssignment(teachingAssignment, scheduleId).then(function (teachingAssignment) {
					_self.$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: teachingAssignment
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not assign instructor to course.", type: "ERROR" });
				});
			},
			assignInstructorType: function (teachingAssignment) {
				var scheduleId = AssignmentStateService._state.userInterface.scheduleId;
	
				_self.AssignmentService.addInstructorAssignment(teachingAssignment, scheduleId).then(function (newTeachingAssignment) {
					_self.$rootScope.$emit('toast', { message: "Assigned instructor type", type: "SUCCESS" });
					_self.AssignmentStateService.reduce({
						type: ActionTypes.ADD_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: newTeachingAssignment
						}
					});
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not assign instructor type.", type: "ERROR" });
				});
			},
			unassignInstructorType: function (originalTeachingAssignment) {
				_self.AssignmentService.updateInstructorAssignment(originalTeachingAssignment).then(function (teachingAssignment) {
					_self.$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
	
					_self.AssignmentStateService.reduce({
						type: ActionTypes.REMOVE_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: originalTeachingAssignment
						}
					});
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			assignStudentToAssociateInstructor: function (sectionGroup, supportStaff) {
				var here = this;
				_self.AssignmentService.assignStudentToAssociateInstructor(sectionGroup.id, supportStaff.id).then(function (teachingAssignment) {
					_self.$rootScope.$emit('toast', { message: "Assigned Associate Instructor", type: "SUCCESS" });
	
					var instructor = {
						id: teachingAssignment.instructorId,
						firstName: supportStaff.firstName,
						lastName: supportStaff.lastName,
						fullName: supportStaff.fullName,
						email: supportStaff.emailAddress,
						loginId: supportStaff.loginId
					};
	
					_self.AssignmentStateService.reduce({
						type: ActionTypes.ASSIGN_ASSOCIATE_INSTRUCTOR,
						payload: {
							teachingAssignment: teachingAssignment,
							instructor: instructor,
							year: AssignmentStateService._state.userInterface.year
						}
					});
	
					here.addAndApproveInstructorAssignment(teachingAssignment, AssignmentStateService._state.userInterface.scheduleId);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			approveInstructorAssignment: function (teachingAssignment, workgroupId, year) {
				teachingAssignment.approved = true;
	
				_self.AssignmentService.updateInstructorAssignment(teachingAssignment).then(function (teachingAssignment) {
					$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
						var action = {
							type: ActionTypes.UPDATE_TEACHING_ASSIGNMENT,
							payload: {
								teachingAssignment: teachingAssignment
							}
						};
						_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not assign instructor to course.", type: "ERROR" });
				});
			},
			createPlaceholderStaff: function (sectionGroup) {
				_self.AssignmentService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
					_self.$rootScope.$emit('toast', { message: "Assigned The Staff", type: "SUCCESS" });
						var action = {
							type: CREATE_PLACEHOLDER_STAFF,
							payload: {
								sectionGroup: sectionGroup
							}
						};
						_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not assign The Staff.", type: "ERROR" });
				});
			},
			removePlaceholderStaff: function (sectionGroup) {
				_self.AssignmentService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
					_self.$rootScope.$emit('toast', { message: "Removed The Staff", type: "SUCCESS" });
						var action = {
							type: ActionTypes.REMOVE_PLACEHOLDER_STAFF,
							payload: {
								sectionGroup: sectionGroup
							}
						};
						_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not remove The Staff.", type: "ERROR" });
				});
			},
			unapproveInstructorAssignment: function (originalTeachingAssignment) {
				originalTeachingAssignment.approved = false;
				_self.AssignmentService.updateInstructorAssignment(originalTeachingAssignment).then(function (teachingAssignment) {
					_self.$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
					var action;
					// If unapproving a teachingPreference that was not created by the instructor, delete it instead
					if (originalTeachingAssignment.fromInstructor === false && originalTeachingAssignment.approved === false) {
						action = {
							type: ActionTypes.REMOVE_TEACHING_ASSIGNMENT,
							payload: {
								teachingAssignment: originalTeachingAssignment
							}
						};
						_self.AssignmentStateService.reduce(action);
	
					} else {
						action = {
							type: ActionTypes.UPDATE_TEACHING_ASSIGNMENT,
							payload: {
								teachingAssignment: teachingAssignment
							}
						};
						_self.AssignmentStateService.reduce(action);
					}
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			addTeachingCallResponse: function (teachingCallResponse) {
				_self.AssignmentService.addTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
					_self.$rootScope.$emit('toast', { message: "Updated availablities", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_TEACHING_CALL_RESPONSE,
						payload: {
							teachingCallResponse: teachingCallResponse
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
				});
			},
			showCourses: function () {
				var action = {
					type: ActionTypes.SWITCH_MAIN_VIEW,
					payload: {
						showInstructors: false,
						showCourses: true
					}
				};
				_self.AssignmentStateService.reduce(action);
			},
			toggleDisplayCompletedInstructors: function (showCompletedInstructors) {
				var action = {
					type: ActionTypes.TOGGLE_COMPLETED_INSTRUCTORS,
					payload: {
						showCompletedInstructors: showCompletedInstructors
					}
				};
				_self.AssignmentStateService.reduce(action);
			},
			showInstructors: function () {
				var action = {
					type: ActionTypes.SWITCH_MAIN_VIEW,
					payload: {
						showInstructors: true,
						showCourses: false
					}
				};
				_self.AssignmentStateService.reduce(action);
			},
			toggleTermFilter: function (termId) {
				var action = {
					type: ActionTypes.TOGGLE_TERM_FILTER,
					payload: {
						termId: termId
					}
				};
				_self.AssignmentStateService.reduce(action);
			},
			updateTableFilter: function (query) {
				var action = {
					type: ActionTypes.UPDATE_TABLE_FILTER,
					payload: {
						query: query
					}
				};
				_self.AssignmentStateService.reduce(action);
			}
		};
	}
}

AssignmentActionCreators.$inject = ['AssignmentStateService', '$route', 'AssignmentService', '$rootScope', '$window', 'Role', 'ActionTypes'];

export default AssignmentActionCreators;
