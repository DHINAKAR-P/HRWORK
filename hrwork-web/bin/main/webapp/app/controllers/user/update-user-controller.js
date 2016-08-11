define([ "angular", "app", "services/ajaxService",
		"services/userservice", "services/context-service" ], function(angular, app) {

	var userUpdateController = app.controller("userUpdateController", [ "$log",
			"$scope", "AjaxService", "UserService",'$timeout', "$rootScope", "ContextService",
			function($log, $scope, ajaxService, UserService, $timeout, $rootScope, contextService) {

				var self = $scope;
				self.user = {};

				self.isAdmin=false;


				self.isAjax=false;
				$scope.roleList=[];
				$scope.role=false;
				self.password="";
				self.confirmpassword="";
				self.currentpassword="";
				
				self.init = function() {
					$log.log("initializing updateuser controller!");
					self.user=UserService.editUser;
					$log.log(JSON.stringify(self.user));
					
					tempCurrentPassword=self.user.owner.password;
					
					self.isAdmin=self.hasAdminRole(self.user);
					
					ajaxService.get({
						url:contextService.getUrl("getAllRoles"),
						success:function(data){
							$log.log("success", data);
							if(data && data.responseSuccess){
								self.roleList=data.result;
								$log.log("got roles!");
							}
						},
						error:function(data){
							$log.log("error while fetching roles!");
						}						
					});
							
				};
				
				
				self.hasAdminRole=function(user){
					$log.log("checking role!");
					if(!user || !user.owner){
						return false;					
					}
					for(var idx in user.owner.roles){
						if(user.owner.roles[idx].id==1){		
							return true;
						}
					}
					return false;
				};

				self.init();
				 
				
				self.updateUser =function(){
					
					$log.log("Update user Role");
					$log.log("user id",self.user.id);
					$log.log("role", self.user.owner.roles);
					$log.log("isAdmin",self.isAdmin);
				
					/**
					 * Check current password 
					 */
					$log.log("Current password is  .",self.user.owner.password);
					$log.log("Confirm password is  .",self.currentpassword);
					
					if( self.currentpassword != "" && self.user.owner.password !=self.currentpassword){ 
						 $log.log("Current password is wrong.");
						 $rootScope.$broadcast("Notify", {
								message : "Current password is wrong",
								type : "error",
								layout : "bar",
								effect : 'slidetop'
							});
						 return ; 
					}
					 if( self.password != "" && self.password != self.confirmpassword){
						 $log.log("Confirm password does not match");
						 $rootScope.$broadcast("Notify", {
								message : "Confirm password does not match",
								type : "error",
								layout : "bar",
								effect : 'slidetop'
							});
						 return ;
					 }
					 if(self.password.length != 0){
						 self.user.owner.password=self.password;
					 }
					 
					
					 if(!self.isAdmin){
						 $log.log("resetting role to user");
						 self.user.owner.roles[0]=self.roleList[1];
					 }else{
						 $log.log("resetting role to admin");
						 self.user.owner.roles[0]=self.roleList[0];
					 }
						 
					
					$scope.isAjax=true;
					ajaxService.post({
						url: contextService.getUrl("updateUser"),
						data:angular.toJson(self.user),
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
								$log.log("Error while performing user updation", data.responseError);
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
							$log.log("  project updation error block: ", data);
							$rootScope.$broadcast("Notify", {
								message : "Error while updating existing user, please try again!",
								type : "error",
								layout : "bar",
								effect : 'slidetop'
							});
							$scope.isAjax=false;
							$scope.$apply();
						}
					});						
				};

			} ]);

	return userUpdateController;

});