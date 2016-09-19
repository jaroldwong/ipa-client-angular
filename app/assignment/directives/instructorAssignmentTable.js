/**
 * Provides the main course table in the Courses View
 */
assignmentApp.directive("instructorAssignmentTable", this.instructorAssignmentTable = function ($rootScope, assignmentActionCreators) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.view = {};

			// Filter instructors with assignmentsCompleted if filter is active
			scope.showCompletedInstructor = function(instructor) {
				var scheduleInstructorNote = scope.view.state.scheduleInstructorNotes.list[instructor.scheduleInstructorNoteId];
				var assignmentsCompleted = false;
				if (scheduleInstructorNote) {
					assignmentsCompleted = scheduleInstructorNote.assignmentsCompleted;
				}
				if (scope.view.state.filters.showCompletedInstructors && assignmentsCompleted) {
					return false;
				}

				return true;
			}

			// Build a string of html to display a column header (course, terms, etc.)
			scope.renderHeader = function() {
				// Render the header
				var header = "<div class=\"course-list-row\">";
				header += "<div class=\"course-header course-description-cell\">Course</div>";

				$.each(scope.view.state.userInterface.enabledTerms.ids, function(i, termCodeId) {

					var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];
					header += "<div class=\"term-header term-cell\">" + termCode.getTermCodeDisplayName(true) + "</div>";
				});

				header += "</div>";

				return header;
			}

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				scope.view.state = data;
				// Clear the table
				$('.tooltip').remove();
				element.empty();

				// Render the header
				var header = scope.renderHeader();
				element.append(header);

				var coursesHtml = "";
				var rowsSinceHeaderWasAdded = 0;

				// Loop over instructors
				$.each(scope.view.state.instructors.ids, function(i, instructorId) {
					var instructor = scope.view.state.instructors.list[instructorId];

					if (instructor.isFiltered == false && scope.showCompletedInstructor(instructor) ) {
						var scheduleInstructorNote = scope.view.state.scheduleInstructorNotes.list[instructor.scheduleInstructorNoteId];
						var teachingCallReceipt = scope.view.state.teachingCallReceipts.list[instructor.teachingCallReceiptId];

						var courseHtml = "";
						courseHtml += "<div class=\"course-list-row\">";
						courseHtml += "<div class=\"description-cell\">";
						courseHtml += "<div>";

						courseHtml += "<span style=\"margin-right:5px;\">";

						// Instructor assignmentCompleted UI
						courseHtml += "<i class=\"glyphicon";
						if (scheduleInstructorNote && scheduleInstructorNote.assignmentsCompleted) {
							courseHtml += " glyphicon-check";
						} else {
							courseHtml += " glyphicon-unchecked";
						}
						courseHtml += " assignments-complete clickable\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"Toggle completed assigning instructor\" data-container=\"body\"";
						courseHtml += " data-instructor-id=" + instructor.id + " data-schedule-instructor-note-id=" + instructor.scheduleInstructorNoteId + "></i>";
						courseHtml += "</span>";
						courseHtml += "<div><strong>";
						courseHtml += instructor.fullName;
						courseHtml += "</strong>";
						courseHtml += "</div>";

						// Instructor Comment UI
						courseHtml += "<div class=\"description-cell__comment-btn-container\">";
						courseHtml += "<i class=\"glyphicon comment-btn glyphicon-pencil\" data-instructor-id=" + instructor.id;
						courseHtml += " data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"Instructor comments\" data-container=\"body\"></i>";
						courseHtml += "</div>";

						// If they don't have any teachingCallResponses, there won't be any unavailabilities to show
						courseHtml += "<div class=\"description-cell__avail-btn-container\">";

						if (instructor.teachingCallResponses.length > 0) {
							// Instructor Availabilities UI
							courseHtml += "<i class=\"glyphicon avail-btn glyphicon-calendar\" data-instructor-id=" + instructor.id;
							courseHtml += " data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"Instructor unavailabilities\" data-container=\"body\"></i>";
						} else {
							courseHtml += "<div data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"No unavailabilities\" data-container=\"body\">";
							courseHtml += "<i class=\" disabled-calendar glyphicon glyphicon-calendar\"></i>";
							courseHtml += "</div>";
						}

						courseHtml += "</div>";
						courseHtml += "</div>";


						// Instructor TeachingCall submitted preferences checkmark
						if (teachingCallReceipt && teachingCallReceipt.isDone) {
							courseHtml += "<div style=\"color:#B3B3B3; display: flex;\">";
							courseHtml += "Preferences Submitted";
							courseHtml += "</div>";
						}

						courseHtml += "</div>"; // end description-cell
						
						// Loop over active terms
						$.each(scope.view.state.userInterface.enabledTerms.ids, function(i, termCodeId) {
							var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];

							courseHtml += "<div class=\"term-cell\">";

							// Loop over teachingAssignments within a term
							$.each(scope.view.state.instructors.list[instructor.id].teachingAssignmentTermCodeIds[termCode], function(j, teachingAssignmentId) {
								// Ensure it is approved already
								if (scope.view.state.teachingAssignments.list[teachingAssignmentId].approved) {
									var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId]
									var sectionGroup = scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];

									var displayTitle = "";
									var plannedSeats = "";
									var unitsLow = "";

									if (sectionGroup) {
										var course = scope.view.state.courses.list[sectionGroup.courseId];
										displayTitle += course.subjectCode + " " + course.courseNumber + "-" + course.sequencePattern;
										plannedSeats = "<small>Seats: " + sectionGroup.plannedSeats + "</small>";
										unitsLow = "<small>Units: " + course.unitsLow + "</small>";
									} else {
										if (teachingAssignment.buyout) {
											displayTitle += "BUYOUT";
										} else if (teachingAssignment.courseRelease) {
											displayTitle += "COURSE RELEASE";
										} else if (teachingAssignment.sabbatical) {
											displayTitle += "SABBATICAL";
										}
									}

									courseHtml += "<div class=\"alert alert-info tile-assignment\">";
									courseHtml += "<p>" + displayTitle + "</p>";
									courseHtml += "<div class=\"tile-assignment-details\">";
									courseHtml += plannedSeats;
									courseHtml += "<br />";
									courseHtml += unitsLow;
									courseHtml += "</div>";
									courseHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary\" data-toggle=\"tooltip\" data-placement=\"top\"";
									courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\"";
									courseHtml += "data-original-title=\"Unassign\" data-container=\"body\"></i>";
									courseHtml += "</div>";
								}
							});

							// Add an assign button to add more instructors
							courseHtml += "<div class=\"dropdown assign-dropdown\">";
							courseHtml += "<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">";
							courseHtml += "Assign..<span class=\"caret\"></span></button>";
							courseHtml += "<ul class=\"dropdown-menu dropdown-menu-right scrollable-menu\" aria-labelledby=\"dropdownMenu1\">";

							// Track courses that were already present in 'interested', and should be filtered from 'other'
							var interestedCourseIds = [];
							var firstInterestedCourseAdded = false;

							// If the instructor has teachingAssignments in this term, show them first
							if (instructor.teachingAssignmentTermCodeIds[termCode] && instructor.teachingAssignmentTermCodeIds[termCode].length > 0) {

								// Loop over teachingAssignments
								$.each(instructor.teachingAssignmentTermCodeIds[termCode], function(i, teachingAssignmentId) {
									var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
									var sectionGroup = scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];

									if (teachingAssignment.sectionGroupId == 0) {
										return true;
									}

									var course = scope.view.state.courses.list[sectionGroup.courseId];
									interestedCourseIds.push(course.id);

									// Show option if the TeachingAssignments parent Course is not being suppressed and Assignment is not already approved
									if (teachingAssignment.approved == false && course.isHidden == false) {
										if (firstInterestedCourseAdded == false) {
											courseHtml += "<li><div class=\"dropdown-assign-header\">Interested</div></li>";
											firstInterestedCourseAdded = true;
										}

										var instructor = scope.view.state.instructors.list[teachingAssignment.instructorId];
										courseHtml += "<li><a";
										courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\"";

										courseHtml += " href=\"#\">" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</a></li>";
									}
								});
								if (firstInterestedCourseAdded) {
									courseHtml += "<li><div class=\"dropdown-assign-header\">Other</div></li>";
								}
							}

							// Add Buyout, Sabbatical, Course Release options
							courseHtml += "<li><a";
							courseHtml += " data-is-buyout=\"true\"";
							courseHtml += " data-term-code=\"" + termCode + "\"";
							courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
							courseHtml += " href=\"#\">Buyout</a></li>";

							courseHtml += "<li><a";
							courseHtml += " data-is-sabbatical=\"true\"";
							courseHtml += " data-term-code=\"" + termCode + "\"";
							courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
							courseHtml += " href=\"#\">Sabbatical</a></li>";

							courseHtml += "<li><a";
							courseHtml += " data-is-course-release=\"true\"";
							courseHtml += " data-term-code=\"" + termCode + "\"";
							courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
							courseHtml += " href=\"#\">Course Release</a></li>";
							courseHtml += "<li role=\"presentation\" class=\"divider courses-separator\"></li>";

							// Loop over all other courses
							$.each(scope.view.state.courses.ids, function(i, courseId) {
								var course = scope.view.state.courses.list[courseId]
								// Show option if course has a sectionGroup in this term, course is not suppressed, and course did not already show up in the interested section
								if (course.sectionGroupTermCodeIds[termCode] && course.isHidden == false && interestedCourseIds.indexOf(course.id) < 0) {
									var sectionGroupId = course.sectionGroupTermCodeIds[termCode];
									var instructor = scope.view.state.instructors.list[instructorId];
									courseHtml += "<li><a";
									courseHtml += " data-section-group-id=\"" + sectionGroupId + "\"";
									courseHtml += " data-term-code=\"" + termCode + "\"";
									courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
									courseHtml += " href=\"#\">" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</a></li>";
								}
							});

							courseHtml += "</ul></div>"; // End dropdown assign list
							courseHtml += "</div>"; // Ending term-cell div
						});
						courseHtml += "</div>"; // Ending course-row div

						coursesHtml += courseHtml;

						// Add a header after each 10 displayed instructor rows
						if (rowsSinceHeaderWasAdded == 10) {
							coursesHtml += scope.renderHeader();
							rowsSinceHeaderWasAdded = 0;
						}
						rowsSinceHeaderWasAdded++;
					}
				}); // Ending loop over courses

				element.append(coursesHtml);

				// Manually activate bootstrap tooltip triggers
				$('body').tooltip({
    			selector: '[data-toggle="tooltip"]'
				});
			}); // end on event 'assignmentStateChanged'

			// Handle Instructor UI events
			element.click(function(e) {
				$el = $(e.target);
				// Approving a teachingAssignment or creating a new one
				if ($el.is('a')) {
					var sectionGroupId = $el.data('section-group-id');
					var isCourseRelease = $el.data('is-course-release');
					var isSabbatical = $el.data('is-sabbatical');
					var isBuyout = $el.data('is-buyout');
					var termCode = $el.data('term-code');

					var instructorId = $el.data('instructor-id');
					var teachingAssignmentId = $el.data('teaching-assignment-id');

					// Approving an existing teachingAssignment
					if (teachingAssignmentId) {

						var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
						assignmentActionCreators.approveInstructorAssignment(teachingAssignment);
					} else { // Creating a new teachingAssignment, and then approving it
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						var teachingAssignment = {
							sectionGroupId: sectionGroupId,
							instructorId: instructorId,
							termCode: termCode,
							priority: 1,
							approved: true,
							buyout: isBuyout,
							courseRelease: isCourseRelease,
							sabbatical: isSabbatical
						}

						assignmentActionCreators.addAndApproveInstructorAssignment(teachingAssignment, scope.view.state.userInterface.scheduleId);
					}
				}
				// Unapproving a teachingAssignment
				else if ($el.hasClass('assignment-remove')) {
					var teachingAssignmentId = $el.data('teaching-assignment-id');
					var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
					assignmentActionCreators.unapproveInstructorAssignment(teachingAssignment);
				}
				else if ($el.hasClass('comment-btn')) {
					var instructorId = $el.data('instructor-id');
					scope.openCommentModal(instructorId);
				}
				else if ($el.hasClass('avail-btn')) {
					var instructorId = $el.data('instructor-id');
					scope.openUnavailabilityModal(instructorId);
				}
				else if ($el.hasClass('assignments-complete')) {
					var scheduleInstructorNoteId = $el.data('schedule-instructor-note-id');
					var instructorId = $el.data('instructor-id');
					var scheduleInstructorNote = scope.view.state.scheduleInstructorNotes.list[scheduleInstructorNoteId];

					// Properly toggle assignmentsCompleted of existing scheduleInstructorNote
					if (scheduleInstructorNote) {
						if ($el.hasClass('glyphicon-unchecked')) {
							scheduleInstructorNote.assignmentsCompleted = true;
						} else {
							scheduleInstructorNote.assignmentsCompleted = false;
						}
						assignmentActionCreators.updateScheduleInstructorNote(scheduleInstructorNote);
					}
					// Make a new scheduleInstructorNote
					else {
						assignmentActionCreators.addScheduleInstructorNote(instructorId, scope.year, scope.workgroupId, "", true);
					}
				}
			}); // end UI event handler
		} // end link
	}
});
