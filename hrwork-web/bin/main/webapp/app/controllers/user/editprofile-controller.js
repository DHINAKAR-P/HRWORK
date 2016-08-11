define([ "angular", "app","services/ajaxService", "services/context-service" ], function(angular, app) {

	var editprofileController = app.controller("EditProfileController", [ "$log",
			"$scope", "AjaxService","$timeout", "ContextService",function($log, $scope, ajaxService, $timeout, contextService) {

				$scope.init = function() {
					$log.log("initializing editprofile controller!");
					
				};
				
				
				$scope.user={
						"id":"1",
						"firstName":"Boopathi",
						"lastName":"Raja",
						"emailAddress":"Boopathi@gmail.com",
						"phone":"9942216787",
						"address1":"Coimbatore",
						"address2":"Namakkal",
						"city":"Coimbatore",
						"country":"India",
						"state":"TN" 
				};
				
				$scope.isAjax=false;
				$scope.message="";
				
				
				/**
				 * Display notification for specific time
				 */
				$scope.removeNotification =function(){
					 $timeout(function(){
						 $scope.message="";
						 $scope.$apply();
			         }, 2000);
				};
				
				$scope.updateProfile=function(user){
					$scope.isAjax=true;
					$log.log("  profile update init ");
					ajaxService.post({
								url: contextService.getUrl("editProfile"),
								data:{
									id:user.id,
									firstName:user.firstName,
									lastName:user.lastName,
									emailAddress:user.emailAddress,
									phone:user.phone
								// age:user.age,
								// address1:user.address1,
								// address2:user.address2,
								// city:user.city,
								//	contry:user.country,
								//	state:user.state
								},
								success:function(data){
									$log.log(" success block: ", data);
									if(data && data.responseInfo){
										$log.log(" is success!",data);
										$scope.message="Profile updated successfully";
									}
									if(data && data.responseError){
										$log.log("Error while performing project creation", data.responseError);
									}
									$scope.isAjax=false;
									$scope.$apply();
									$scope.removeNotification();
								},
								error: function(data){
									$log.log("  project creation error block: ", data);
									$scope.isAjax=false;
									$scope.$apply();
								}
							});						
					};
				}

	 ]);

	return editprofileController;

});