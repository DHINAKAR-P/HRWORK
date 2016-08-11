define([ "angular", "app","services/ajaxService","services/userservice","services/context-service" ], 
		function(angular, app) {

	var updateuserController = app.controller("UpdateUserController", [ "$log",
			"$scope", "AjaxService","UserService","$window", "ContextService",
			function($log, $scope, ajaxService,UserService,$window, contextService) {

				var self = $scope;
				
				self.init = function() {
					$log.log("initializing updateuser controller!");

					/**
					 * fetching all users
					 */
					ajaxService.get({
						url:contextService.getUrl("getAllUsers"),
						success:function(data){
							$log.log("Success!", data);
							if(data && data.responseSuccess){
								$log.log("fetching all users is success!", data.result);
								if(data.result){
									$scope.userList=data.result;
								}
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
				
				$scope.isAjax=true;
				
				self.init();
				 
				/**
				 * Edit User
				 */
				 self.edit=function(user){
					 $log.log("Edit User Init");
					 UserService.editUser=user;
					 $window.location.href="#/userUpdate";
				 };
				 
				 /**
				  * Delete User
				  */
				self.deleteUser = function(userId)
				{
					$scope.isAjax=true;
					
					self.init();
					ajaxService.post({
						url:contextService.getUrl("deleteUser"),
						data:{
							userId: userId,
							},
						success:function(data){
							$log.log(" success block: ", data);
							if(data && data.responseInfo){
								$scope.$apply();
								$log.log(" delete is success!", data);
								
								var len = $scope.userList.length;
						        var index = -1;

						        // find the element in the array
						        for (var i = 0; i < len; i += 1) {
						            if ($scope.userList[i].id === userId) {
						                index = i;
						                break;
						            }
						        }
						        // remove the element
						        if (index !== -1) {
						            console.log ("removing the element from the array, index: ", index);
						            $scope.userList.splice(index,1);
						        }
							}
							if(data && data.responseError){
								$log.log("Error while performing project deletion", data.responseError);
							}
							$scope.isAjax=false;
							$scope.$apply();
						}
					});			
				}

	} ]);

	return updateuserController;

});