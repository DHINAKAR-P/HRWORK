define([ "angular", "app", "services/context-service", "services/ajaxService" ], function(angular, app) {

	var loginController = app.controller("LoginController", [
			"$log",
			"$scope",
			"$rootScope",
			"$location",
			"ContextService",
			"AjaxService",
			function($log, $scope, $rootScope, $location, contextService, ajaxService) {

				console.log("i am in login controller");
				var self = $scope;
				self.user = {};
				self.userObjTemp = {};
				self.userName = '';

				self.doLogin = function() {
					var login = contextService.getUrl("login");
					$log.log("User value ", self.user);
					ajaxService.post({
						url : 'http://hrwork-10d.rhcloud.com/hrwork-rest/j_spring_security_check?j_username=' + self.user.userName + '&j_password='
								+ self.user.password,
						success : function(data) {
							$log.log("Success: ", data);
							if (data.status == "success") {
								console.log("We are inside ", angular.toJson(data));
								contextService.isLoggedIn = true;
								$rootScope.$broadcast("Notify", {
									message : "You have logged in successfully!",
									type : "success",
									layout : "bar",
									effect : 'slidetop'
								});

								contextService.userData = angular.fromJson(data.userdetails);
								console.log("login succesfully and data fund------------", angular.fromJson(data.userdetails));
								$rootScope.active = true;
								console.log("redirect to dashboard");
								$location.url("/dashBoard");
								$scope.$apply();
							}
							if (data.status == "failed") {
								$rootScope.$broadcast("Notify", {

									message : "userName and password is invalid",
									type : "error",
									layout : "bar",
									effect : 'slidetop'
								});
							}
							$scope.$apply();
						},
						error : function(data) {
							$log.log("Error: ", data);
							$rootScope.$broadcast("Notify", {
								message : "Internal server error, please try again!",
								type : "error",
								layout : "bar",
								effect : 'slidetop'
							});
						}
					});
				};

			} ]);

	return loginController;
});
