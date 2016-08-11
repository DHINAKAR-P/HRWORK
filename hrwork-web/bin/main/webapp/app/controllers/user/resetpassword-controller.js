define([ "angular", "app","services/ajaxService","services/context-service" ], function(angular, app) {

	var resetpasswordController = app.controller("ResetPasswordController", [ "$log",
			"$scope", "AjaxService", "$timeout","ContextService",function($log, $scope, ajaxService,$timeout, contextService) {

				var self = $scope;

				self.message="";
				self.error="";
				self.pass={};
				
				self.init = function() {
					$log.log("initializing resetpassword controller!");
					
				};

				self.init();
				$scope.isAjax=false;
				
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
					if(pass.newPassword !== pass.retypePassword){
						$scope.error="Confirm password does not match";
						$scope.removeNotification();
						return;
					}
					
					$scope.isAjax=true;
					ajaxService.post({
						url: contextService.getUrl("resetPassword"),
						data:{
							oldPassword:pass.oldpassword,
							newPassword:pass.newPassword,
							id:1,
						},
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
							$scope.isAjax=false;
							$scope.$apply();
							$scope.removeNotification();
						},
						error: function(data){
							$log.log("  password mismatch: ", data);
							$scope.isAjax=false;
							$scope.$apply();
						}
					});	
				}
	} ]);

	return resetpasswordController;

});