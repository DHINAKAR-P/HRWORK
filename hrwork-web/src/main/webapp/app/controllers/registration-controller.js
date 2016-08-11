define([ "angular", "app", "services/ajaxService", "services/context-service" ], function(angular, app) {

	app.directive('bindFile', [ function() {
		console.log("it works");
		return {
			require : "ngModel",
			restrict : 'A',
			link : function($scope, el, attrs, ngModel) {
				el.bind('change', function(event) {
					ngModel.$setViewValue(event.target.files[0]);
					$scope.$apply();
				});

				$scope.$watch(function() {
					return ngModel.$viewValue;
				}, function(value) {
					if (!value) {
						el.val("");
					}
				});
			}
		};
	} ]);

	var RegistrationController = app.controller("RegistrationController", [ "$log", "$location", "$scope", "UserService", "AjaxService", "$timeout",
			"$rootScope", "ContextService", "$window", "$http",
			function($log, $location, $scope, UserService, ajaxService, $timeout, $rootScope, contextService, $window, $http) {
				$scope.user = {};
				$scope.email = [];
				$scope.phone = [];
				$scope.userSkill = {
					uskills : []
				}
				var self = $scope;

				self.init = function() {
					self.addFormField();
				}

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

				self.init();

				$scope.checkuserName = function(userName) {
					var checkUseNameAvailability = {
						"userName" : userName
					}
					console.log("i am in checkuserName");
					ajaxService.post({
						url : contextService.getUrl("checkuserName"),
						data : angular.toJson(checkUseNameAvailability),
						headers : {
							"Content-Type" : "application/json"
						},
						success : function(data) {
							$log.log("Success in registration controller user name availability: ", data);
							if (data && data.responseSuccess) {
								$rootScope.$broadcast("Notify", {
									message : "user name is ok !",
									type : "success",
									layout : "bar",
									effect : 'slidetop'
								});

							}
							$scope.$apply();
							if (data && data.responseError) {
								$rootScope.$broadcast("Notify", {
									message : data.responseError,
									type : "error",
									layout : "bar",
									effect : 'slidetop'
								});
							}
							$scope.$apply();
						},
						error : function(data) {
							a1
							$log.log("Error: ", data);
							$rootScope.$broadcast("Notify", {
								message : "Internal server error, please try again!",
								type : "error",
								layout : "bar",
								effect : 'slidetop'
							});
						}
					});
				}

				$scope.cancel = function() {
					console.log("cancel registeration");
					$location.url("/login");
				}

				/** To download the file  it will support for MZ-FireFox oly*/
				$scope.download = function() {

					// var filename="SpringSecurityHelloController.java";
					var url = "http://hrwork-10d.rhcloud.com/hrwork-rest/login/download/";
					// var url=
					// "http://localhost:8080/dropbox_api_.10/login/downloadFileFromDropbox/";
					$http({
						method : 'GET',
						url : url,
						responseType : 'arraybuffer',

					}).success(function(data, status) {

						var a = document.createElement('a');
						document.body.appendChild(a);
						console.log("file-----------------", data);
						var blob = new Blob([ data ], {
							type : 'application/pdf'
						}); // trick to download store a file having its URL
						var fileURL = window.URL.createObjectURL(blob);
						a.href = fileURL;
						a.target = '_blank';
						a.download = 'kk.pdf';

						a.click();
						// //var blob = new Blob([data], {type: 'image/jpg'});
						var filename = "sample.pdf";
//						saveAs(blob, filename);
						console.log("file downloading is successful!!");
					}).error(function(data, status) {
						console.log("file downloading error!!");
					})
				}

				$scope.saveUser = function(user) {
					console.log('The selected file is ', $scope.theFile);
					console.log('bind file', $scope.theFile);

					console.log(angular.toJson($scope.table.fields));
					$log.log("user Registration initiated");
					var result = $scope.table.fields;
					console.log(user);
					if (user.contact.emailAddress1 == undefined) {
						$scope.email[0] = user.contact.emailAddress;
						console.log("emailAddress", $scope.email);
						console.log("Alternate email address is optional");
					} else {
						console.log("in side else  ie two email address r present");
						$scope.email[0] = user.contact.emailAddress;
						$scope.email[1] = user.contact.emailAddress1;
						console.log($scope.email);
					}
					if (user.contact.phoneNumber1 == undefined) {
						console.log("To check phoneNumeber");
						$scope.phone[0] = user.contact.phoneNumber;
						console.log("phoneNumber array", $scope.phone);
						console.log("phone number in 0th position", $scope.phone[0]);
						console.log("Alternate phone Number isoptional");
					} else {
						console.log("to store both the phone number");
						$scope.phone[0] = user.contact.phoneNumber;
						$scope.phone[1] = user.contact.phoneNumber1;
						console.log("phone number in 0th position", $scope.phone[0]);
						console.log("phone number in 1st position", $scope.phone[1]);
						console.log("user phone Number", $scope.phone);
					}
					var user = {
						"firstName" : user.firstName,
						"lastName" : user.lastName,
						"userName" : user.userName,
						"password" : user.password,
						"dateOfBirth" : user.dateOfBirth,
						"status" : 0,
						"role" : [2],
						"skills" : result,
						"contact" : {
							"address" : user.address,
							"photoUrl" : "llali",
							"phone" : $scope.phone,
							"emailAddress" : $scope.email
						}
					};
					console.log("user object--", angular.toJson(user));

					var fd = new FormData();
					console.log('user data---', JSON.stringify(user));

					fd.append("user",JSON.stringify(user));
					fd.append("file",$scope.theFile);
					
					console.log("forma data",angular.toJson(fd));

					$http({
						method : 'POST',
						url : contextService.getUrl("registration"),
						headers : {
							'Content-Type' : undefined
						},
						data : fd,
						transformRequest : function(data, headersGetterFunction) {
							return data;
						}
					}).success(function(data, status) {
						console.log("new ajax call success");
						alert("ajax success");
						$rootScope.$broadcast("Notify", {
							message : "sign up succesfull",
							type : "success",
							layout : "bar",
							effect : 'slidetop'
						});
						$location.url("/login");
					});

				};

			} ]);

	return RegistrationController;

});