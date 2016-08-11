define([ "angular", "app", 
         "controllers/login-controller",
		"controllers/navbar-controller",
		"services/context-service",
		"controllers/menubar-controller",
		"controllers/dashboard-controller",
		"controllers/project/project-controller",
		"controllers/template-controller",
		"controllers/user/createuser-controller",
		"controllers/user/users-list",
		"controllers/user/resetpassword-controller",
		"controllers/user/editprofile-controller",
		"services/userservice",
		"controllers/user/update-user-controller","directives/template-column"], 
		function(angular, appModule) {

	/**
	 * Configuration block of this application
	 */
	appModule.config([ "$routeProvider", function($routeProvider) {
		$routeProvider.when("/login", {
			templateUrl : "app/views/login.html"
		}).when("/s", {
			templateUrl : "app/views/s.html",
		}).when("/Registration", {
			templateUrl : "app/views/Registration.html",
			}).when("/dashBoard", {
			templateUrl : "app/views/dashboard.html",
			
		/*}).when("/project", {
			templateUrl : "app/views/projects/project.html",
			hasRole:"ROLE_USER",
			allow:"M_ADMIN,P_ADMIN,USER"
		}).when("/template/:templateId", {
			templateUrl : "app/views/templates/template.html",
			hasRole:"ROLE_USER",
			allow:"M_ADMIN,P_ADMIN,USER"
		}).when("/createUser", {
			templateUrl : "app/views/user/createuser.html",
			hasRole:"ROLE_USER",
			allow:"M_ADMIN"
		}).when("/updateUserList", {
			templateUrl : "app/views/user/userlist.html",
			hasRole:"ROLE_USER",
			allow:"M_ADMIN"
		}).when("/updateUser", {
			templateUrl : "app/views/updateuser.html",
			hasRole:"ROLE_USER",
			allow:"M_ADMIN"
		}).when("/editProfile", {
			templateUrl : "app/views/user/editprofile.html",
			hasRole:"ROLE_USER",
			allow:"M_ADMIN,P_ADMIN,USER"
		}).when("/userUpdate", {
			templateUrl : "app/views/user/updateuser.html",
			hasRole:"ROLE_USER",
			allow:"M_ADMIN"
		}).when("/error404", {
			templateUrl : "app/views/error404.html",
			hasRole:"ROLE_USER"
		}).when("/error501", {
			templateUrl : "app/views/error501.html",
			hasRole:"ROLE_USER"*/
		}).otherwise({
			redirectTo : "/login"
		});

	} ]);

	/**
	 * start point for this application
	 */
	appModule.run([ "$log", "ContextService", "$rootScope", "$location",
			function($log, contextService, $rootScope, $location) {
				$log.log("Starting message quality center app")

				/**
				 * login state
				 */
				$rootScope.active = false;

				$rootScope.$on("doLogin", function(eve, data) {
					$log.log("Logging in into the system!");
					contextService.isLoggedIn=true;
					contextService.userData=data;
				/*	$rootScope.userName=data.profile.firstName+" "+data.profile.lastName;*/
					$rootScope.active = true;
					$location.url("/dashBoard");
				});

				$rootScope.$on("doLogout", function(eve, data) {
					$log.log("Logging out from the system!");
					contextService.isLoggedIn=false;
					contextService.userData={};
					$rootScope.userName="";
					$rootScope.active = false;
					$location.url("/login");
				});
				
				
				/**
				 * Listening the root changes
				 */
				$rootScope.$on('$routeChangeStart',function(ev, next, current){
					$log.log("Route change interceptor has been called!");
					
					/**
					 * Not considering public pages
					 */
					if(!next.hasRole){
						$log.log("No role has been associated.. progressing..");
						return;
					}
					
					/**
					 * Checking whether user is authenticated!
					 */
					if(!contextService.isLoggedIn){
						$log.log("No user has logged into the system!");
						$rootScope.active = false;
						$location.path("/login");					
					}
					
					/**
					 * Checking whether user is authorized to view this page
					 */
					if(!contextService.hasRole(next.allow)){
						$log.log("user is unauthorized!");
						$log.log("Un authorized access!");						
						$location.path("/error404");		
					}
					
				});
				
				/**
				 * Listens for notification
				 * 
				 * data contains following object { message:"message",
				 * type:"info", effect:"bounce" or etc... icon:"fa fa-xxx",
				 * layout: "growl" or bar, attached, other }
				 * 
				 */
				$rootScope.$on("Notify", function(eve, data) {
					if (!data) {
						$log.log("provided data for notification is not valid!");
						return;
					}
					$log.log("Displaying message!");
					show(data);
				});

				var show = function(data) {

					var messageObj = {
						message : data.message
								|| "does not contains any valid messge!",
						icon : data.icon || "fa fa-bullhorn",
						effect : data.effect || "bouncyflip",
						type : data.type || "notice",
						layout : data.layout || "attached",
						ttl : 9000
					};
					if (messageObj.layout == "attached") {
						messageObj.message = '<span class="'
								+ messageObj.icon
								+ ' fa-3x  pull-left"></span><p>'
								+ messageObj.message + '</p>';
					} else if (messageObj.layout == "bar") {
						messageObj.message = '<span class="icon '
								+ messageObj.icon
								+ ' fa-2x"></span><p>'
								+ messageObj.message + '</p>';
					} else if (messageObj.layout == "growl") {
						messageObj.message = '<p>'
								+ messageObj.message + '</p>';
					} else if (messageObj.layout == "growl") {
						messageObj.message = '<p><span class="icon '
								+ messageObj.icon
								+ '"></span>'
								+ messageObj.message + '</p>';
					} else {
						messageObj.message = '<span class="'
								+ messageObj.icon
								+ ' fa-3x  pull-left"></span><p>'
								+ messageObj.message + '</p>';
					}

					// create the notification
					var notification = new NotificationFx({
						message : messageObj.message,
						layout : messageObj.layout, // growl ,
						// bar,
						// attached,
						// other
						effect : messageObj.effect, // flip,
						// genie,
						// slide,
						// jelly,scale,
						// bouncyflip,
						// slidetop
						/**
						 * layout : 'other', effect : 'boxspinner', ttl : 9000,
						 */
						ttl : 5000,
						type : messageObj.type, // notice,
						// warning or
						// error,
						// success
						onClose : function() {
							/* bttnSlideOnTop.disabled = false; */
						}
					});

					// show the notification
					notification.show();
				};


			} ]);

	return angular.bootstrap(document, [ "MessageCenter" ]);
});