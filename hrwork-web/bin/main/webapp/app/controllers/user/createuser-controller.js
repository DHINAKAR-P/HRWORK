define([ "angular", "app","services/ajaxService","services/context-service"  ], function(angular, app) {
	var createuserController = app.controller("CreateUserController", [ "$log",
			"$scope", "UserService", "AjaxService","$timeout","$rootScope", "ContextService", 
			function($log, $scope, UserService, ajaxService, $timeout, $rootScope, contextService) {


				$scope.isAjax=false;
				
			 
				$scope.roleList={};
				$scope.user={};
				
				$scope.init = function() {
					$log.log("initializing createuser controller!");
					
					/**
					 * Roles List
					 */
					$scope.isAjax = true;
					ajaxService.get({
						/*url : contextService.getUrl("getAllRoles"),*/
						data : {
						},
						success : function(data) {
							$log.log(" success block: ", data);
							if (data && data.responseInfo) {
								$log.log(" is success!", data.result);
								$scope.roleList = data.result;
							}
							if (data && data.responseError) {
								$log.log("Error while loading Roles",data.responseError);
							}
							$scope.isAjax = false;
							$scope.$apply();
						},
						error : function(data) {
							$log.log("  project loading error Roles: ",	data);
							$scope.isAjax = false;
							$scope.$apply();
						}
					});					
				};

				$scope.init();
				
				
			 
								
				$scope.saveUser = function(user)
				{
					 if(user.password!=user.retypePassword){
						 $log.log("Current password is wrong.");
						 $rootScope.$broadcast("Notify", {
								message : "Confirm password does not match",
								type : "error",
								layout : "bar",
								effect : 'slidetop'
							});
						 return ; 
					}
					 
					 var roleId=2;
					 if(user.isAdmin==true)
						 roleId=1;
					 
					 var user={
						"emailAddress":user.emailAddress,
				         "firstName":user.firstName,
				         "lastName":user.lastName,
				         "phoneNumber":user.phoneNumber,
				         "address":user.address,
				         "password":user.password,
				            "tempPassword":null,
				        
				      };
					 
					 
					 $scope.message="";
					 $scope.error="";
					 $log.log("Save Project");
					 $scope.isAjax=true;
						ajaxService.post({
							url: contextService.getUrl("createUser"),
							data:angular.toJson(user),
							headers:{
								"Content-Type":"application/json"
							},
							success:function(data){
								$log.log(" success block: ", data);
								if(data && data.responseSuccess){
									$log.log(" is success!", data);
									$rootScope.$broadcast("Notify", {
										message : data.responseSuccess,
										type : "success",
										layout : "bar",
										effect : 'slidetop'
									});
									$scope.user={};
									$scope.isAjax=false; 
								}
								if(data && data.responseError){
									$log.log("Error while performing project creation", data.responseError);
									$rootScope.$broadcast("Notify", {
										message : data.responseError,
										type : "error",
										layout : "bar",
										effect : 'slidetop'
									});
								} 
								$scope.isAjax=false;
								$scope.$apply();
							},
							error: function(data){
								$log.log("  project creation error block: ", data);
								$rootScope.$broadcast("Notify", {
									message : "Error while creating new user, please try again!",
									type : "error",
									layout : "bar",
									effect : 'slidetop'
								});
								$scope.isAjax=false;
								$scope.$apply();
							}
						});						
				}; 
				//$scope.users = UserService.list();

	} ]);

	return createuserController;

});