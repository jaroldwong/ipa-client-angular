budgetApp.service('budgetActions', function ($rootScope, $window, budgetService, budgetReducers, termService) {
	return {
		getInitialState: function (workgroupId, year, selectedBudgetScenarioId, selectedTerm) {
			var self = this;

			budgetService.getInitialState(workgroupId, year).then(function (results) {
				// Set a default active budget scenario if one was not set in local storage
				if (!selectedBudgetScenarioId) {
					if (results.budgetScenarios && results.budgetScenarios.length > 0) {
						selectedBudgetScenarioId = results.budgetScenarios[0].id;
						localStorage.setItem('selectedBudgetScenarioId', selectedBudgetScenarioId);
					}
				}

				var action = {
					type: INIT_STATE,
					payload: results,
					year: year,
					workgroupId: workgroupId,
					selectedBudgetScenarioId: selectedBudgetScenarioId,
					selectedTerm: selectedTerm
				};

				budgetReducers.reduce(action);
				self.calculateSelectedScenario();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load initial budget state.", type: "ERROR" });
			});
		},
		updateBudgetScenario: function (budgetScenario) {
			var self = this;

			budgetService.updateBudgetScenario(budgetScenario).then(function (results) {
				$rootScope.$emit('toast', { message: "Updated budget scenario", type: "SUCCESS" });

				budgetReducers.reduce({
					type: UPDATE_BUDGET_SCENARIO,
					payload: {
						budgetScenario: results
					}
				});
				self.calculateScenarioTerms();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update budget scenario.", type: "ERROR" });
			});
		},
		createBudgetScenario: function (newBudgetScenario, budgetId, scenarioId) {
			var self = this;
			if (scenarioId == null) { scenarioId = 0;}

			budgetService.createBudgetScenario(newBudgetScenario, budgetId, scenarioId).then(function (results) {
				var action = {
					type: CREATE_BUDGET_SCENARIO,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Created budget scenario", type: "SUCCESS" });
				budgetReducers.reduce(action);
				self.selectBudgetScenario(results.budgetScenario.id);
				self.calculateScenarioTerms();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not create budget scenario.", type: "ERROR" });
			});
		},
		deleteBudgetScenario: function (budgetScenarioId) {
			var self = this;

			budgetService.deleteBudgetScenario(budgetScenarioId).then(function (budgetScenarioId) {
				var action = {
					type: DELETE_BUDGET_SCENARIO,
					payload: {
						budgetScenarioId: budgetScenarioId
					}
				};

				$rootScope.$emit('toast', { message: "Deleted budget scenario", type: "SUCCESS" });
				budgetReducers.reduce(action);
				self.calculateSelectedScenario();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not delete budget scenario.", type: "ERROR" });
			});
		},
		updateInstructorCost: function (instructorCostDto) {
			var instructorCost = Object.assign({}, instructorCostDto);

			// InstructorCosts in the front end are blended instructor + instructorCosts
			instructorCost.id = instructorCost.instructorCostId;
			// Ensure cost is passed as a number
			instructorCost.cost = parseFloat(instructorCost.cost);

			budgetService.updateInstructorCost(instructorCost).then(function (newInstructorCost) {
				var action = {
					type: UPDATE_INSTRUCTOR_COST,
					payload: {
						instructorCost: newInstructorCost
					}
				};
				budgetReducers.reduce(action);
				$rootScope.$emit('toast', { message: "Updated instructor cost", type: "SUCCESS" });
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update instructor cost.", type: "ERROR" });
			});
		},
		createLineItem: function (newLineItem, budgetScenarioId) {
			var self = this;
			// Ensure amount is properly formatted as a float
			newLineItem.amount = parseFloat(newLineItem.amount);

			budgetService.createLineItem(newLineItem, budgetScenarioId).then(function (results) {
				var action = {
					type: CREATE_LINE_ITEM,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Created line item", type: "SUCCESS" });
				budgetReducers.reduce(action);

				// Close modal
				self.closeAddLineItemModal();
				self.calculateScenarioLineItems();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not create line item.", type: "ERROR" });
			});
		},
		updateLineItem: function (lineItem) {
			var self = this;
			// Ensure amount is properly formatted as a float
			lineItem.amount = parseFloat(lineItem.amount);

			budgetService.updateLineItem(lineItem, lineItem.budgetScenarioId).then(function (results) {
				var action = {
					type: UPDATE_LINE_ITEM,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Saved line item", type: "SUCCESS" });
				budgetReducers.reduce(action);

				// Close modal
				self.closeAddLineItemModal();
				self.calculateScenarioLineItems();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not save line item.", type: "ERROR" });
			});
		},
		deleteLineItem: function(lineItem) {
			budgetService.deleteLineItem(lineItem).then(function (lineItemId) {
				var action = {
					type: DELETE_LINE_ITEM,
					payload: {
						lineItemId: lineItemId
					}
				};

				$rootScope.$emit('toast', { message: "Deleted line item", type: "SUCCESS" });
				budgetReducers.reduce(action);
				self.calculateScenarioLineItems();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not delete line item.", type: "ERROR" });
			});
		},
		updateSectionGroupCost: function (sectionGroupCost) {
			budgetService.updateSectionGroupCost(sectionGroupCost).then(function (newSectionGroupCost) {
				var action = {
					type: UPDATE_SECTION_GROUP_COST,
					payload: {
						sectionGroupCost: newSectionGroupCost
					}
				};
				$rootScope.$emit('toast', { message: "Updated course", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update course.", type: "ERROR" });
			});
		},
		updateBudget: function (budget) {
			budgetService.updateBudget(budget).then(function (budget) {
				var action = {
					type: UPDATE_BUDGET,
					payload: {
						budget: budget
					}
				};
				$rootScope.$emit('toast', { message: "Updated costs", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update costs.", type: "ERROR" });
			});
		},
		createSectionGroupCostComment: function (comment, sectionGroupCost, currentUserLoginId) {
			var sectionGroupCostComment = {};
			sectionGroupCostComment.comment = comment;
			sectionGroupCostComment.loginId = currentUserLoginId;
			sectionGroupCostComment.sectionGroupCostId = parseInt(sectionGroupCost.id);

			budgetService.createSectionGroupCostComment(sectionGroupCostComment).then(function (newSectionGroupCostComment) {
				var action = {
					type: CREATE_SECTION_GROUP_COST_COMMENT,
					payload: {
						sectionGroupCostComment: newSectionGroupCostComment
					}
				};
				$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
			});
		},
		createLineItemComment: function (comment, lineItem, currentUserLoginId) {
			var self = this;

			var lineItemComment = {};
			lineItemComment.comment = comment;
			lineItemComment.loginId = currentUserLoginId;
			lineItemComment.lineItemId = parseInt(lineItem.id);

			budgetService.createLineItemComment(lineItemComment).then(function (newLineItemComment) {
				var action = {
					type: CREATE_LINE_ITEM_COMMENT,
					payload: {
						lineItemComment: newLineItemComment
					}
				};
				$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
				budgetReducers.reduce(action);
				self.calculateScenarioLineItems();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
			});
		},
		setRoute: function(selectedRoute) {
			budgetReducers.reduce({
				type: SET_ROUTE,
				payload: {
					selectedRoute: selectedRoute
				}
			});
		},
		closeAddLineItemModal: function() {
			var action = {
				type: CLOSE_ADD_LINE_ITEM_MODAL,
				payload: {}
			};

			budgetReducers.reduce(action);
		},
		openAddLineItemModal: function(lineItemToEdit) {
			var action = {
				type: OPEN_ADD_LINE_ITEM_MODAL,
				payload: {
					lineItemToEdit: lineItemToEdit
				}
			};

			budgetReducers.reduce(action);
		},
		closeBudgetConfigModal: function() {
			budgetReducers.reduce({
				type: CLOSE_BUDGET_CONFIG_MODAL,
				payload: {}
			});
		},
		openBudgetConfigModal: function() {
			budgetReducers.reduce({
				type: OPEN_BUDGET_CONFIG_MODAL,
				payload: {}
			});
		},
		toggleAddBudgetScenarioModal: function() {
			var action = {
				type: TOGGLE_ADD_BUDGET_SCENARIO_MODAL,
				payload: {}
			};

			budgetReducers.reduce(action);
		},
		openAddCourseCommentsModal: function(course) {
			var action = {
				type: OPEN_ADD_COURSE_COMMENT_MODAL,
				payload: {
					course: course
				}
			};

			budgetReducers.reduce(action);
		},
		openAddLineItemCommentsModal: function(lineItem) {
			var action = {
				type: OPEN_ADD_LINE_ITEM_COMMENT_MODAL,
				payload: {
					lineItem: lineItem
				}
			};

			budgetReducers.reduce(action);
		},
		closeAddCourseCommentsModal: function() {
			var action = {
				type: OPEN_ADD_COURSE_COMMENT_MODAL,
				payload: {}
			};

			budgetReducers.reduce(action);
		},
		toggleSupportCostModal: function() {
			var action = {
				type: TOGGLE_SUPPORT_COST_MODAL,
				payload: {}
			};

			budgetReducers.reduce(action);
		},
		selectBudgetScenario: function(budgetScenarioId) {
			localStorage.setItem('selectedBudgetScenarioId', budgetScenarioId);

			var action = {
				type: SELECT_BUDGET_SCENARIO,
				payload: {
					budgetScenarioId: budgetScenarioId
				}
			};

			budgetReducers.reduce(action);
			this.calculateScenarioTerms();
		},
		selectTerm: function(termTab) {
			var descriptionTerms = {
				'Summer Session 1': '05',
				'Summer Special Session': '06',
				'Summer Session 2': '07',
				'Summer Quarter': '08',
				'Fall Semester': '09',
				'Fall Quarter': '10',
				'Winter Quarter': '01',
				'Spring Semester': '02',
				'Spring Quarter': '03'
			};

			budgetReducers.reduce({
				type: SELECT_TERM,
				payload: {
					term: descriptionTerms[termTab],
					activeTermTab: termTab
				}
			});
		},
		toggleSelectLineItem: function(lineItem) {
			budgetReducers.reduce({
				type: TOGGLE_SELECT_LINE_ITEM,
				payload: {
					lineItem: lineItem
				}
			});
		},
		selectAllLineItems: function(lineItems) {
			budgetReducers.reduce({
				type: SELECT_ALL_LINE_ITEMS,
				payload: {
					lineItems: lineItems
				}
			});
		},
		deselectAllLineItems: function() {
			budgetReducers.reduce({
				type: DESELECT_ALL_LINE_ITEMS,
				payload: {}
			});
		},
		deleteLineItems: function(budgetScenario, lineItemIds) {
			budgetService.deleteLineItems(budgetScenario, lineItemIds).then(function (results) {
				$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
				budgetReducers.reduce({
					type: DELETE_LINE_ITEMS,
					payload: {
						lineItemIds: lineItemIds
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
			});
		},
		calculateSelectedScenario: function() {
			var selectedScenarioId = angular.copy(budgetReducers._state.ui.selectedBudgetScenarioId);

			// If a scenario is not already selected, default to first scenario
			selectedScenarioId == selectedScenarioId || budgetReducers._state.budgetScenarios.ids[0];

			budgetReducers.reduce({
				type: CALCULATE_SELECTED_SCENARIO,
				payload: {
					budgetScenarioId: selectedScenarioId
				}
			});

			this.calculateScenarioTerms();
			this.calculateScenarioLineItems();
			this.calculateSectionGroups();
		},
		calculateScenarioTerms: function() {
			var allTermTabs = [];
			var activeTermTab = null;

			var selectedBudgetScenario = budgetReducers._state.budgetScenarios.list[budgetReducers._state.ui.selectedBudgetScenarioId];

			selectedBudgetScenario.terms.forEach(function(term) {
				allTermTabs.push(termService.getShortTermName(term));
				activeTermTab = activeTermTab || termService.getShortTermName(term);
			});

			budgetReducers.reduce({
				type: CALCULATE_SCENARIO_TERMS,
				payload: {
					allTermTabs: allTermTabs,
					activeTermTab: activeTermTab,
					selectedScenarioTerms: selectedBudgetScenario.terms
				}
			});
		},
		calculateScenarioLineItems: function() {
			var selectedBudgetScenario = budgetReducers._state.budgetScenarios.list[budgetReducers._state.ui.selectedBudgetScenarioId];

			// Add lineItems
			selectedBudgetScenario.lineItems = [];

			budgetReducers._state.lineItems.ids.forEach( function (lineItemId) {
				var lineItem = budgetReducers._state.lineItems.list[lineItemId];

				// Ensure lineItem belongs to selected budget scenario
				if (lineItem.budgetScenarioId != selectedBudgetScenario.id) {
					return;
				}

				// Set lineItemComments on lineItems
				lineItem.comments = [];

				budgetReducers._state.lineItemComments.ids.forEach(function(commentId) {
					var comment = budgetReducers._state.lineItemComments.list[commentId];

					if (comment.lineItemId == lineItem.id) {
						lineItem.comments.push(comment);
					}
				});

				// Sort sectionGroupCostComments
				var reverseOrder = true;
				lineItem.comments =_array_sortByProperty(lineItem.comments, "lastModifiedOn", reverseOrder);

				// Add lineItemCategory description
				lineItem.categoryDescription = budgetReducers._state.lineItemCategories.list[lineItem.lineItemCategoryId].description;

				selectedBudgetScenario.lineItems.push(lineItem);

				// Set 'lastModifiedBy'
				// Expected formats are 'system' or 'user:bobsmith'
				// Will convert 'user:bobsmith' to 'Smith, Bob'
				if (lineItem.lastModifiedBy) {
					var split = lineItem.lastModifiedBy.split(":");
					if (split.length > 0 && split[0] == "user") {
						var loginId = split[1];

						budgetReducers._state.users.ids.forEach(function(userId) {
							var user = budgetReducers._state.users.list[userId];
							if (user.loginId == loginId) {
								lineItem.lastModifiedBy = user.firstName + " " + user.lastName;
							}
						});
					}
				}
			});
		},
		calculateSectionGroups: function() {
			var self = this;

			var selectedBudgetScenario = budgetReducers._state.budgetScenarios.list[budgetReducers._state.ui.selectedBudgetScenarioId];
			var sectionGroups = budgetReducers._state.scheduleSectionGroups;

			// A 'sectionGroupContainer' contains all sectionGroups for that term/subjectCode/courseNumber
			var sectionGroupContainers = [];

			sectionGroups.uniqueKeys.forEach(function(uniqueKey) {
				var sectionGroup = sectionGroups.list[uniqueKey];
				var shortTerm = sectionGroup.termCode.slice(-2);

				// Ensure sectionGroup belongs to an active term in this scenario
				if (selectedBudgetScenario.terms.indexOf(shortTerm) == -1) {
					return;
				}

				// Generate container if one does not already exist
				var container = self.calculateSectionGroupContainer(sectionGroup, sectionGroupContainers);
				container.sectionGroups.push(sectionGroup);
			});

			budgetReducers.reduce({
				type: CALCULATE_SECTION_GROUPS,
				payload: {
					sectionGroupContainers: sectionGroupContainers
				}
			});
		},
		// Find or create a sectionGroupContainer for this sectionGroup
		calculateSectionGroupContainer: function(sectionGroup, currentContainers) {
			var course = budgetReducers._state.courses.list[sectionGroup.courseId];
			var sectionGroupKey = course.subjectCode + course.courseNumber;

			if (currentContainers[sectionGroupKey] == null) {
				currentContainers[sectionGroupKey] = {
					subjectCode: course.subjectCode,
					courseNumber: course.courseNumber,
					title: course.title,
					uniqueKey: course.subjectCode + course.courseNumber,
					sectionGroups: []
				};
			}

			return currentContainers[sectionGroupKey];
		}
	};
});