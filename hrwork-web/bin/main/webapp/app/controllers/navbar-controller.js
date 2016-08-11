define([ "angular", "app", "services/context-service" ], function(angular, app) {

	var navbarController = app.controller("NavbarController", [ "$log",
			"$scope","$timeout","ContextService","$rootScope",
			function($log, $scope, $timeout, contextService, $rootScope) {
		var self = $scope;
		
		self.init=function(){
			$log.log("loading navbar controller!");
			
		};		
	
		self.logout=function(){
			$rootScope.$broadcast("doLogout");
		};
		
		self.init();
				
	} ]);

	return navbarController;

});