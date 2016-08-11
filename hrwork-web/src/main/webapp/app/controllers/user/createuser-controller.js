define([ "angular", "app","services/ajaxService","services/context-service"  ], function(angular, app) {
	var createuserController = app.controller("CreateUserController", [ "$log",
			"$scope", "UserService", "AjaxService","$timeout","$rootScope", "ContextService", 
			function($log, $scope, UserService, ajaxService, $timeout, $rootScope, contextService) {
				$scope.roleList={};
				$scope.user={};
				$scope.saveUser = function(user)
				{
					 var user={
						"emailAddress":user.emailAddress,
				         "firstName":user.firstName,
				         "lastName":user.lastName,
				         "phoneNumber":user.phoneNumber,
				         "address":user.address,
				         "password":user.password,
				      };
					 
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
								$scope.$apply();
							}
						});						
				}; 

	} ]);

	return createuserController;

});