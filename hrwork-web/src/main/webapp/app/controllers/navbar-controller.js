define([ "angular", "app", "services/context-service" ], function(angular, app, contextService) {

	var navbarController = app.controller("NavbarController", [ "$log", "$scope", "$timeout", "ContextService", "$rootScope",
			function($log, $scope, $timeout, contextService, $rootScope) {
				var self = $scope;
				self.userName = "";
				self.init = function() {
					$log.log("loading navbar controller!");
					$log.log("Data: " + JSON.stringify(contextService.userData));
					self.userName = contextService.userData.userName;
					// self.role=contextService.userData.role;
				};

				self.logout = function() {
					$rootScope.$broadcast("doLogout");
				};

				self.init();

			} ]);

	return navbarController;

});