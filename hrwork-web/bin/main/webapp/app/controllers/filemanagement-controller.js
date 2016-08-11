define([ "angular", "app" ], function(angular, app) {

	var filemanagementController = app.controller("FileManagementController", [ "$log",
			"$scope", function($log, $scope) {

				var self = $scope;

				self.init = function() {
					$log.log("initializing filemanagement controller!");
					angular.element("#theme-wrapper").show();
					
				};

				self.init();

	} ]);

	return filemanagementController;

});