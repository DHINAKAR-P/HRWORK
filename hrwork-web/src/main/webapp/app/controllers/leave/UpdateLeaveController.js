define(
		[ "angular", "app", "services/context-service", "services/userservice" ],
		function(angular, app) {
			var UpdateLeaveController = app.controller("UpdateLeaveController",
					[
							"$log",
							"$scope",
							"ContextService",
							"UserService",
							"AjaxService",
							"$rootScope",
							"$location",
							"$filter",
							function($log, $scope, contextService, UserService,
									ajaxService, $rootScope, $location,$filter) {
						
								self=$scope;
								self.leave={};
								self.init=function()
								{
									console.log("userservice leave details.",UserService.leaveDetails);
									UserService.leaveDetails.leaveFromDate = new Date(UserService.leaveDetails.leaveFromDate);
									UserService.leaveDetails.leaveToDate=new Date(UserService.leaveDetails.leaveToDate);
									console.log("userservice leave details after date format",UserService.leaveDetails);
									self.leave=UserService.leaveDetails;
								}
								self.init();
									self.updateleave = function(leave) {
										console.log("leave obj",angular.toJson(leave));
										console.log(contextService.userData.id);
										 $scope.date = $filter('date')(Date.now(),'yyyy-MM-dd');
										 console.log(angular.toJson(UserService.leaveDetails));
										 console.log(angular.toJson(contextService.userData));
										 //console.log("user id for leave update",leave.leaveFor.id);
								
								var leave= {
								        "id": UserService.leaveDetails.id,
								        "leaveFor": {
								            "id":contextService.userData.id,							            
								        },
								        "createdBy": null,
								        "createOn": $scope.date,
								        "status": 0,
								        "approvedBy": null,
								        "leaveFromDate": leave.leaveFromDate,
								        "leaveToDate": leave.leaveToDate,
								        "numberOfDays": 3,
								        "summary": leave.summary
								    };
									 							 
									 console.log("object before ajax service",angular.toJson(leave));
									 
										ajaxService.post({
											url:contextService.getUrl("updateLeaveDetails"),
											data:angular.toJson(leave),
											headers:{
												"Content-Type":"application/json"
											},
											success:function(data){
																	
												$log.log("leave data after leave have applied!", data);
												if(data && data.responseSuccess){
													$log.log("reponse from rest controller after  updating leave!", angular.toJson(data.result));
													console.log("dataresponse",angular.toJson(data.responseSuccess));
													$location.url("/listuserleave");
												}
											},
											error:function(data){
												$log.log("Error: ",data);
											}
										});			 
								}

							} ]);
			return UpdateLeaveController;
		});
