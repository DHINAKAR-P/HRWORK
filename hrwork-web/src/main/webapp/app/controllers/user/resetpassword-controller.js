define([ "angular", "app","services/ajaxService","services/context-service" ], function(angular, app) {

	var resetpasswordController = app.controller("ResetPasswordController", [ "$log",
			"$scope", "AjaxService", "$timeout","ContextService",function($log, $scope, ajaxService,$timeout, contextService) {

				var self = $scope;
				self.pass={};
				self.init = function() {
					$log.log("I am in  resetpassword controller!");
				};

				self.init();
			 	/**
				 * Display notification for specific time
				 */
				$scope.removeNotification =function(){
					 $timeout(function(){
						 self.message="";
						 self.error="";
						 $scope.$apply();
			         }, 2000);
				};
				self.checkPassword = function(pass)
				{
					if(pass.password !== pass.retypePassword){
						$scope.error="Confirm password does not match";
						$scope.removeNotification();
						return;
					}
					
					console.log(contextService.userData.id);
					pass.id=contextService.userData.id;
					ajaxService.get({
						
						url: contextService.getUrl("resetPassword")+"/?password="+pass.password+"&oldpassword="+pass.oldpassword+"&id="+pass.id,
						success:function(data){
							$log.log(" success block: ", data);
							if(data && data.responseInfo){
								$log.log(" is success!", data); 
								if(data.responseCode==="2"){
									$scope.message="";
									$scope.error="Current password is not correct.! ";
								}
								else{
									$scope.error="";
									$scope.message="Password updated successfully ";
									self.pass={};
								}
							}
							if(data && data.responseError){
								$log.log("password mismatch.", data.responseError);
							}
							$scope.$apply();
							$scope.removeNotification();
						},
						error: function(data){
							$log.log("  password mismatch: ", data);
							$scope.$apply();
						}
					});	
				}
	} ]);

	return resetpasswordController;

});