define([ "angular", "app", "services/ajaxService", "services/userservice", "services/context-service" ], function(angular, app) {

	var TeamDesign = app.controller("TeamDesign", [ "$log", "$scope", "AjaxService", "UserService", "$window", "ContextService", "$location", "$rootScope",
			"$cookieStore", function($log, $scope, ajaxService, UserService, $window, contextService, $location, $rootScope, $cookieStore) {

				var self = $scope;
				self.managerList = [];
				self.otherUser = [];
				self.hr = '';
				self.user = '';
				self.test = [];

				self.init = function() {
					$log.log("initializing user list controller controller!");

					ajaxService.get({
						url : contextService.getUrl("listOfUser"),
						success : function(data) {
							if (data && data.responseSuccess) {
								$log.log("in teamDesign", data.result);
								console.log("-------", angular.toJson(data.result));
								$scope.userList = data.result;
								for (i = 0; i < $scope.userList.length; i++) {
									self.managerList.push(self.userList[i].userName + '-' + self.userList[i].id);
									console.log("self.userList[i].userNamue;", angular.toJson(self.userList[i].userName));
								}
							}
							angular.copy(self.managerList, self.otherUser);
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

				self.selecthr = function(hr) {
					angular.copy(self.managerList, self.otherUser);
					console.log("hr value", self.hr);
					var s = self.otherUser.indexOf(self.hr);
					console.log(" splice value", s);
					self.otherUser.splice(s, 1);
					console.log("other spliced data", angular.toJson(self.otherUser));
				};

				self.creatTeam = function(hr, ser) {
					angular.copy(ser, self.test);
					console.log("hr--", hr);
					console.log("user-test--", self.test);
				 
							$("#dropdown").prop("disabled", true);
				};

				self.init();

			} ]);

	return TeamDesign;

});