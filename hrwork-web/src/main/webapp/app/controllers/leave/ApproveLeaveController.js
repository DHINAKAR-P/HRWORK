define(
    ["angular", "app", "services/context-service", "services/userservice"],
    function(angular, app) {
        var ApproveLeaveController = app.controller("ApproveLeaveController", [
            "$log",
            "$scope",
            "ContextService",
            "UserService",
            "AjaxService",
            "$rootScope",
            "$location",
            "$filter",
            function($log, $scope, contextService, UserService,
                ajaxService, $rootScope, $location, $filter) {
                console.log("in scope of ApproveLeave controller");
                self = $scope;
                self.leave = {};
                /* self.checkbox = function(ch)
                 {
                	      $scope.$apply();
                	    	   
                	     };*/
                self.init = function() {
                    ajaxService.get({

                        url: contextService.getUrl("listalluserLeaves"),
                        success: function(data) {
                            $log.log("list of leaves to be approved!", data);
                            if (data && data.responseSuccess) {

                                $scope.ApproveLeave = data.result;
                                console.log("dataresponse", angular.toJson(data.responseSuccess));
                                console.log("$scope.ApproveLeave", angular.toJson($scope.ApproveLeave));
                                //as if now
                                /*$rootScope.$broadcast("Notify", {
                                		message : data.responseSuccess,
                                		type : "success",
                                		layout : "bar",
                                		effect : 'slidetop'
                                	});*/

                            }
                            if (data && data.responseError) {
                                $log.log("Error while  approve leave ", data.responseError);
                                $rootScope.$broadcast("Notify", {
                                    message: data.responseError,
                                    type: "error",
                                    layout: "bar",
                                    effect: 'slidetop'
                                });
                            }
                            $scope.$apply();
                        },
                        error: function(data) {
                            $log.log("Error: ", data);
                            $rootScope.$broadcast("Notify", {
                                message: "Error while approve leave, please try again!",
                                type: "error",
                                layout: "bar",
                                effect: 'slidetop'
                            });
                            $scope.$apply();
                        }

                    });
                }
                self.init();

                self.changeleavestatus = function(leave) {
                    console.log("to change status of leave ");
                    var ch = leave.status;
                    console.log("leave Status", ch);
                    switch (ch) {

                        case 'APPROVED':
                            {
                                leave.status = 'REJECTED';
                                // color.style.backgroundColor = "#FFFFFF"
                                // $("#submitBtn").removeClass("btn-success").addClass("btn-danger");
                            }
                            break;
                        case 'REJECTED':
                            {
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
                        "id": leave.id,
                        "status": leave.status
                    }

                    ajaxService.post({
                        url: contextService.getUrl("leaveStatus"),
                        data: angular.toJson(leave),
                        headers: {
                            "Content-Type": "application/json",
                        },
                        success: function(data) {
                            $log.log("leaves status!", data);
                            if (data && data.responseSuccess) {
                                $scope.$apply();
                            }
                            $scope.$apply();
                        },
                        error: function(data) {
                            $log.log("Error: ", data);
                            $scope.$apply();
                        }
                    });

                }
            }
        ]);
        return ApproveLeaveController;
    });




/*		self.approveleave = function(leave) {		
			
		 var leave={	
				 "leaveFor":{
					 "id": 2,
				        "firstName": "vicky",
				        "lastName": "p",
				        "dateOfBirth": "1781-08-24",
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
				        "role": "EMPLOYEE",
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
				 "leaveFromDate":leave.leaveFromDate,
				 "leaveToDate":leave.leaveToDate,
				  "numberOfDays": "4",
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
						if(data.result){
							$scope.userList=data.result;
						}
						$location.url("/dashBoard");
					}
					$scope.isAjax=false;
					$scope.$apply();
				},
				error:function(data){
					$log.log("Error: ",data);
					$scope.isAjax=false;
					$scope.$apply();
				}
			});			 
		 				 
	 
	}*/