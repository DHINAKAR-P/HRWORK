define([ "angular", "app", "services/ajaxService", "services/userservice", "services/context-service" ], function(angular, app) {

	var userUpdateController = app.controller("userUpdateController", [ "$log", "$scope", "AjaxService", "UserService", '$timeout', "$rootScope",
			"ContextService", "$location", function($log, $scope, ajaxService, UserService, $timeout, $rootScope, contextService, $location) {

				var self = $scope;
				self.user = {};
				self.email = [];
				self.emailobj = [];
				self.phone = [];
				self.fetcheduser = {};
				var userid;
				var statusno;
				self.init = function() {
					$log.log("initializing updateuser controller for updation!");
					self.user = UserService.editUser;
					self.user.dateOfBirth = new Date(UserService.editUser.dateOfBirth);
					$log.log(JSON.stringify(self.user));
					var findurl = contextService.getUrl("findUserById")
					findurl += "?id=" + self.user.id;
					userid = self.user.id

					self.addSkills = function() {
						self.skills = {
							skill : ''
						};
						self.userSkill.uskills.push(self.skills);
					};

					$scope.table = {
						fields : []
					};

					$scope.addFormField = function() {
						$scope.table.fields.push('');
					}

					self.removeFormField = function(index) {
						$scope.table.fields.splice(index, 1);

					};
					ajaxService.get({
						url : findurl,
						success : function(data) {
							$log.log("success", data);
							statusno = data.status;
							if (data && data.responseSuccess) {
								self.fetcheduser = data.result;
								console.log("self.fetcheduser", angular.toJson(self.fetcheduser));
								self.emailobj[0] = self.fetcheduser.contact.emailAddress[0];
								self.emailobj[1] = self.fetcheduser.contact.emailAddress[1];
								console.log("email array[0]", self.emailobj[0]);
								console.log("email array[1]", self.emailobj[1]);
								console.log("status", self.fetcheduser.status);
								statusno = self.fetcheduser.status;
								$log.log("user object got for updation!", angular.toJson(self.fetcheduser));
							}
						},
						error : function(data) {
							$log.log("error while finding user!");
						}
					});

				};

				self.init();
				$scope.saveUser = function(updateuser) {
					$log.log("user Updation  initiated");
					$log.log("address of user", updateuser.contact.address);
					var str = (updateuser.skills);
					var result = str.split(",");
					console.log("result", result);
					console.log(updateuser);
					console.log("user email.", updateuser.contact.emailAddress[1]);
					if (updateuser.contact.emailAddress[1] == undefined) {
						$scope.email[0] = updateuser.contact.emailAddress[0];
						console.log("emailAddress", $scope.email);
						console.log("Alternate email address is optional");
					} else {
						console.log("in side else  ie two email address r present");
						$scope.email[0] = updateuser.contact.emailAddress[0];
						$scope.email[1] = updateuser.contact.emailAddress[1];
						console.log($scope.email);
					}

					if (updateuser.contact.phone[1] == undefined) {
						console.log("To check phoneNumeber");
						$scope.phone[0] = updateuser.contact.phone[0];
						console.log("phoneNumber array", $scope.phone);
						console.log("phone number in 0th position", $scope.phone[0]);
						console.log("Alternate phone Number isoptional");
					} else {
						console.log("to store both the phone number");
						$scope.phone[0] = updateuser.contact.phone[0];
						$scope.phone[1] = updateuser.contact.phone[1];
						console.log("phone number in 0th position", $scope.phone[0]);
						console.log("phone number in 1st position", $scope.phone[1]);
						console.log("user phone Number", $scope.phone);
					}

					var updateuser = {
						"id" : userid,
						"firstName" : updateuser.firstName,
						"lastName" : updateuser.lastName,
						"userName" : updateuser.userName,
						"password" : updateuser.password,
						"resume" : updateuser.resume,
						"dateOfBirth" : updateuser.dateOfBirth,
						"role" : 2,
						"status" : statusno,
						"skills" : result,
						"contact" : {
							"address" : updateuser.contact.address,
							"photoUrl" : "llali",// photoUrl
							// is
							// hard
							// Coded
							"phone" : $scope.phone,
							"emailAddress" : $scope.email
						}
					};
					console.log("user object--", angular.toJson(updateuser));

					ajaxService.post({
						url : contextService.getUrl("updateuser"),
						data : angular.toJson(updateuser),
						headers : {
							"Content-Type" : "application/json"
						},
						success : function(data) {
							$log.log(" is success in update controller !", angular.toJson(data));
							console.log(" To list  user");
							$location.url("/dashBoard");
							if (data != null) {
								$rootScope.$broadcast("Notify", {
									message : data.responseSuccess,
									type : "success",
									layout : "bar",
									effect : 'slidetop'
								});
							}
							$scope.user = {};
							if (data && data.responseError) {
								$log.log("Error while performing updating ", data.responseError);
								$rootScope.$broadcast("Notify", {
									message : data.responseError,
									type : "error",
									layout : "bar",
									effect : 'slidetop'
								});
							}
							$scope.$apply();
							$location.url("/dashBoard");
						},
						error : function(data) {
							$log.log("Signing in  error block: ", data);
							$rootScope.$broadcast("Notify", {
								message : "Error while signing Up for  new user, please try again!",
								type : "error",
								layout : "bar",
								effect : 'slidetop'
							});
							$location.url("/login");
						}
					});
				};

			} ]);

	return userUpdateController;

});