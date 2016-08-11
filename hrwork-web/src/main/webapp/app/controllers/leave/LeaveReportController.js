define([ "angular", "app" ], function(angular, app) {
	var LeaveReportController = app.controller("LeaveReportController", [ "$log", "$scope", "$location", "AjaxService", "ContextService", "UserService",
			"$rootScope", function($log, $scope, $location, ajaxService, ContextService, UserService, $rootScope) {
				self = $scope;
				self.leaveYear = [];
				$scope.leaveList = '';
				self.Months = '';
				self.leaveMonths = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
				self.years = '';

				self.init = function() {
					for (var i = 1990; i <= 2015; i++) {
						self.leaveYear.push(i.toString());
					}
					console.log("leave Years ", self.leaveYear);
					console.log("leave Months ", self.leaveMonths);

				}
				self.init();

				$scope.filterLeaveStatus = function(leave) {
					return (leave.status == 'PENDING_APPROVAL');
				};

				/*
				 * To Search the Leave For employees for particular Month and
				 * Year
				 */
				self.SearchLeaves = function() {
					console.log("month selected", self.Months);
					$log.log("years", self.years);
					var d = self.years + "-" + self.Months + "-01";
					var c = self.years + "-" + self.Months + "-31";
					console.log("year+Month+10-----", d);
					self.leave = {
						"tempdate" : d,
						"tempdate1" : c
					};

					ajaxService.post({
						url : ContextService.getUrl("leaveReport"),
						data : angular.toJson(self.leave),
						headers : {
							"Content-Type" : "application/json"
						},
						success : function(data) {

							console.log(data);
							$log.log("Success! ", angular.toJson(data));
							console.log("data.result", data.result);
							if (data && data.responseSuccess) {
								$log.log("fetching all MOnthly  Leave list ", data.responseSuccess);
								$scope.leaveList = data.result;
								console.log("LeaveList " + $scope.leaveList);

							}
							$scope.$apply();
						},
						error : function(data) {
							$log.log("Error: ", data);
							$scope.$apply();
						}

					});
				}

				/* To update the Leave */
				self.edit = function(leave) {
					console.log("to edit the leave details", angular.toJson(leave));
					UserService.leaveDetails = leave;
					$location.url("/updateLeaveDetails");
				}

				/* To Delete the Leave */
				self.deleteleave = function(leave) {
					console.log("in delete method leave id", leave.id);

					var index = -1;
					var leavelistindex = eval($scope.leaveList);
					for (var i = 0; i < leavelistindex.length; i++) {
						if (leavelistindex[i].id === leave.id) {
							index = i;
							break;
						}
					}
					if (index === -1) {
						alert("Something gone wrong");
					}
					self.leaveList.splice(index, 1);

					var url = ContextService.getUrl("DeleteLeave");
					ajaxService.get({
						url : url += "?id=" + leave.id,
						success : function(data) {
							console.log(data);
							$log.log("Success! ", angular.toJson(data));
							if (data && data.responseSuccess) {
								$log.log("delete Leave ", data.responseSuccess);
								$rootScope.$broadcast("Notify", {
									message : data.responseSuccess,
									type : "success",
									layout : "bar",
									effect : 'slidetop'
								});
							}
							$scope.$apply();
						},
						error : function(data) {

							$rootScope.$broadcast("Notify", {
								message : data.responseError,
								type : "error",
								layout : "bar",
								effect : 'slidetop'
							});
							$log.log("Error: ", data);
							$scope.$apply();
						}
					});

				}

				/* To change the Leave Status */
				self.changeleavestatus = function(leave) {
					console.log("to change status of leave ");
					var ch = leave.status;
					console.log("leave Status", ch);
					switch (ch) {

					case 'APPROVED': {
						leave.status = 'REJECTED';
						// color.style.backgroundColor = "#FFFFFF"
						// $("#submitBtn").removeClass("btn-success").addClass("btn-danger");
					}
						break;
					case 'REJECTED': {
						leave.status = 'APPROVED';
						// color.style.backgroundColor = "#7FFF00"
						// $("submitBtn").removeClass("btn-danger").addClass("btn-success");
					}
						break;
					case 'PENDING_APPROVAL':
						leave.status = 'APPROVED';
						break;
					}
					console.log("status after loop", leave.status);
					leave = {
						"id" : leave.id,
						"status" : leave.status
					}

					ajaxService.post({
						url : ContextService.getUrl("leaveStatus"),
						data : angular.toJson(leave),
						headers : {
							"Content-Type" : "application/json",
						},
						success : function(data) {
							$log.log("leaves status!", data);
							if (data && data.responseSuccess) {
								$scope.$apply();
							}
							$scope.$apply();
						},
						error : function(data) {
							$log.log("Error: ", data);
							$scope.$apply();
						}
					});

				}

			} ]);

	return LeaveReportController;
});
