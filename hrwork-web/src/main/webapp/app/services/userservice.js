define([ "angular", "app" ], function(angular, app) {
	var userService = app.service("UserService", [ "$log", "$http",
			function($log, $http) {

				var self = this;
				/**
				 * loading all environment data's
				 */
				self.init = function() {
					$log.log("init user services");
				};

				self.init();

				var editableObject = "";
				var editUser = "";
				var userid='';
				 var leaveDetails='';

			} ]);
	return userService;
});
