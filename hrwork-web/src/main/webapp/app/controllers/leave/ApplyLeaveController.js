define(
		[ "angular", "app", "services/context-service", "services/userservice","moment" ],
		function(angular, app, moment) {
			var ApplyLeaveController = app.controller("ApplyLeaveController",
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
								console.log("in scope of leave controller");
								
								self=$scope;
								self.leave={};
									self.applyleave = function(leave) {
										
										var d1 = new Date(leave.leaveFromDate);
										var d2 = new Date(leave.leaveToDate);
										var miliseconds = d2-d1;
										var seconds = miliseconds/1000;
										var minutes = seconds/60;
										var hours = minutes/60;
										self.days = hours/24;
										console.log("d1",d1);
										console.log("d2",d2);
										console.log("milisdeconds",miliseconds);
										console.log("days",self.days);
										
										console.log("LeaveFromDate",leave.leaveFromDate);
										console.log("leaveToDate",leave.leaveToDate);
									//	var d1 = moment(d1);
										//var d2 = moment(d2);
										//self.days = moment.duration(d2.diff(d1)).asDays();
										
										//To get the Current system Date
										 $scope.date = $filter('date')(Date.now(),'yyyy-MM-dd');
										 console.log("CreatedDate",$scope.date);
									 var leave={	
											 "leaveFor":{
												 "id": contextService.userData.id,
											        "firstName":contextService.userData.firstName,
											        "lastName": contextService.userData.lastName,
											        "dateOfBirth": contextService.userData.dateOfBirth,
											        "contact": {
											            "id": 1,
											            "address": "velore",
											            "photoUrl": "killerurl",
											            "phone": [
											                "022222334",
											                "877655432"
											            ],
											            "emailAddress": [
											                "sri@gmail.com",
											                "dhina@gmail.com"
											            ]
											        },
											        "resume": "b.e",
											        "status": 1,
											        "role": ["EMPLOYEE"],
											        "userName": "jilla",
											        "password": "jilla",
											        "skills": [
											            "spring",
											            "c++",
											            "c"										           
											        ]
											 },
											 "createOn":$scope.date,
											 "status":0,
											 "leaveType":1,
											 "leaveFromDate":leave.leaveFromDate,
											 "leaveToDate":leave.leaveToDate,
											  "numberOfDays": self.days,
											  "summary": leave.summary
									
									         };	
									 console.log("user----status in object",leave.status);
									 
									 console.log("object before ajax service",angular.toJson(leave));
									 
										ajaxService.post({
											url:contextService.getUrl("applyleave"),
											data:angular.toJson(leave),
											headers:{
													"Content-Type":"application/json"
												},
											success:function(data){
																	
												$log.log("leave data after leave have applied!", data);
												
												
												if(data && data.responseSuccess){
													$log.log("reponse from rest controller after  applying leave!", angular.toJson(data.result));
													
													console.log("dataresponse",angular.toJson(data.responseSuccess));
													$location.url("/dashBoard");
												}
												$scope.$apply();
											},
											error:function(data){
												$log.log("Error: ",data);
												$scope.$apply();
											}
										});			 
									 				 
								 
								}

							} ]);
			return ApplyLeaveController;
		});
