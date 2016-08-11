define([ "angular", "app", "services/ajaxService", "services/userservice", "services/context-service" ], function(angular, app) {

	var ListUserController = app.controller("ListUserController", [ "$log", "$scope", "AjaxService", "UserService", "$window", "ContextService", "$location",
			"$rootScope", "$cookieStore", function($log, $scope, ajaxService, UserService, $window, contextService, $location, $rootScope, $cookieStore) {

				var self = $scope;
				self.user = {};
				var userid;
				var statusno;
				$scope.email = [];
				$scope.phone = [];
				$scope.skills = [];
				$scope.query = '';
				self.init = function() {
					$log.log("initializing user list controller controller!");
					/**
					 * fetching all users
					 */
					ajaxService.get({
						url : contextService.getUrl("listOfUser"),
						success : function(data) {
							if (data && data.responseSuccess) {
								$log.log("fetching all users is success", data.result);
								console.log("data.result", angular.toJson(data.result));
								$scope.userList = data.result;
								console.log("user list " + $scope.userList);
								console.log("$scope.userList", angular.toJson($scope.userList));
							}
							$scope.$apply();
						},
						error : function(data) {
							$log.log("Error: ", data);
							$rootScope.$broadcast("Notify", {
								message : "fail to list Users!",
								type : "success",
								layout : "bar",
								effect : 'slidetop'
							});
							$scope.$apply();
						}
					});

				};

				/*
				 * self.hasAdminRole=function(user){ $log.log("checking role!");
				 * if(!user || !user.owner){ return false; } for(var idx in
				 * user.owner.roles){ if(user.owner.roles[idx].id==1){ return
				 * true; } } return false; };
				 * 
				 * $scope.isAjax=true;
				 */
				self.init();
				self.edit = function(user) {
					$log.log("Edit User Init");
					UserService.editUser = user;
					$location.url("/updateuser");
					// $window.location.href="#/updateuser";
				};

				self.applyleave = function(user) {
					console.log("to apply leave in dashboard controller", angular.toJson(user));
					contextService.userData = user;
					console.log("contextSerice user object", angular.toJson(contextService.userData));
					console.log("to call applly leave");
					$location.url("/applyleave");
				}

				$scope.search = '';
				$scope.filterOnLocation = function(user) {
					return (user.userName + user.id + user.skills).indexOf($scope.search) >= 0;
				};

				self.listLeaveOfUser = function(userid) {
					console.log("to list user leave--input userid--", userid);
					UserService.userid = userid;
					console.log("userid in user service ---", UserService.userid);
					$cookieStore.put('dashBoard', 'listUserLeave/fromListOfUser');
					var s = $cookieStore.get("dashBoard");
					console.log("cookie store in dashboard controller routing", s);
					$location.url("/listuserleave");
				}

				$scope.changestatus = function(user) {
					var ch = user.status;
					console.log("ch -----", ch);
					switch (ch) {

					case 'ACTIVATED': {
						user.status = 'DEACTIVATED';
					}
						break;
					case 'DEACTIVATED': {
						user.status = 'ACTIVATED';
					}
						break;
					}

					$log.log(user.status);
					userid = user.id;
					statusno = user.status;
					$scope.skills = user.skills;
					$scope.email[0] = user.contact.emailAddress[0];
					$scope.email[1] = user.contact.emailAddress[1];
					$scope.phone[0] = user.contact.phone[0];
					$scope.phone[1] = user.contact.phone[1];

					$log.log("To change the status of User..!!!", user.id);
					$log.log("status of user", statusno);
					// UserService.editUser=user;

					var user = {
						"id" : userid,
						"firstName" : user.firstName,
						"lastName" : user.lastName,
						"userName" : user.userName,
						"password" : user.password,
						"resume" : user.resume,
						"dateOfBirth" : user.dateOfBirth,
						"role" : 2,
						"status" : statusno,
						"contact" : {
							"address" : user.contact.address,
							"photoUrl" : "llali",// photoUrl is hard Coded
							"phone" : $scope.phone,
							"emailAddress" : $scope.email
						}
					};
					console.log("user----status in object", user.status);

					console.log("object before ajax service", angular.toJson(user));

					ajaxService.post({
						url : contextService.getUrl("userStatus"),
						data : angular.toJson(user),
						type : "POST",
						headers : {
							"Content-Type" : "application/json"
						},
						success : function(data) {

							$log.log("Success after Changing the Status of User!", data);

							if (data && data.responseSuccess) {
								$log.log("To change the Status of User!", angular.toJson(data.result));

								console.log("dataresponse", angular.toJson(data.responseSuccess));

							}
							$scope.$apply();
						},
						error : function(data) {
							$log.log("Error: ", data);
							$scope.$apply();
						}
					});

				}

			} ]);

	return ListUserController;

});