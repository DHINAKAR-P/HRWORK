define([ "angular", "app", "controllers/login-controller", "controllers/registration-controller", "controllers/TeamDesign", "controllers/navbar-controller",
		"services/context-service", "controllers/menubar-controller", "controllers/dashboard-controller", "controllers/user/createuser-controller",
		"controllers/user/users-list", "controllers/user/resetpassword-controller", "controllers/leave/ApplyLeaveController",
		"controllers/leave/ApproveLeaveController", "controllers/leave/UpdateLeaveController", "controllers/leave/LeaveReportController",
		"controllers/leave/listuserleave", "services/userservice", "controllers/user/update-user-controller" ], function(angular, appModule) {

	/**
	 * Configuration block of this application
	 */
	appModule.config([ "$routeProvider", function($routeProvider) {
		$routeProvider.when("/login", {
			templateUrl : "app/views/login.html",
		}).when("/Registration", {
			templateUrl : "app/views/Registration.html",
		}).when("/dashBoard", {
			templateUrl : "app/views/dashboard.html",
			allow : "ADMIN,HR,EMPLOYEE,MANAGER,CONTRACTOR"
		}).when("/createUser", {
			templateUrl : "app/views/user/createuser.html",
			allow : "ADMIN"
		}).when("/updateuser", {
			templateUrl : "app/views/user/updateuser.html",
			allow : "ADMIN,HR,MANAGER,CONTRACTOR"
		}).when("/listOfUser", {
			templateUrl : "app/views/user/listofuser.html",
			allow : "ADMIN"
		}).when("/applyleave", {
			templateUrl : "app/views/applyLeave.html",
			allow : "EMPLOYEE,HR,ADMIN,MANAGER,CONTRACTOR"
		}).when("/listuserleave", {
			templateUrl : "app/views/listuserleave.html",
			allow : "EMPLOYEE,HR,ADMIN,MANAGER,CONTRACTOR"
		}).when("/listalluserLeaves", {
			templateUrl : "app/views/approveleave.html",
			allow : "MANAGER"
		}).when("/updateLeaveDetails", {
			templateUrl : "app/views/updateLeaveDetails.html",
			allow : "ADMIN,HR,EMPLOYEE,MANAGER,CONTRACTOR"
		}).when("/leaveReport", {
			templateUrl : "app/views/leaveReport.html",
			allow : "HR"
		}).when("/error404", {
			templateUrl : "app/views/error404.html",
		}).when("/teamDesign", {
			templateUrl : "app/views/TeamDesignUi.html",
		}).otherwise({
			redirectTo : "/login"
		});

	} ]);

	/**
	 * start point for this application
	 */
	appModule.run([ "$log", "ContextService", "$rootScope", "$location", function($log, contextService, $rootScope, $location) {
		$log.log("Starting HrWork Application")

		/**
		 * login state
		 */
		$rootScope.active = false;

		$rootScope.$on("doLogin", function(eve, data) {
			$log.log("Logging in into the system!");
			contextService.isLoggedIn = true;
			contextService.userData = data;
			/*
			 * $rootScope.userName=data.profile.firstName+"
			 * "+data.profile.lastName;
			 */
			$rootScope.active = true;
			$location.url("/dashBoard");
		});

		$rootScope.$on("doLogout", function(eve, data) {
			$log.log("Logging out from the system!");
			contextService.isLoggedIn = true;
			contextService.userData = {};
			$rootScope.userName = "";
			$rootScope.active = false;
			$location.url("/login");
		});

		/**
		 * http://localhost:8081/hrwork-rest/
		 * http://hrwork-10d.rhcloud.com/hrwork-rest
		 * 
		 * 
		 * Listening the root changes
		 */
		$rootScope.$on('$routeChangeStart', function(ev, next, current) {

			/**
			 * Not considering public pages
			 */
			if (next.hasRole) {
				alert("No role has been associated.. progressing..")
				$log.log("No role has been associated.. progressing..");
				return;
			}

			/**
			 * Checking whether user is authenticated!
			 */
			if (!contextService.isLoggedIn) {
				$log.log("No user has logged into the system!");
				$rootScope.active = false;
				$location.path("/login");
			}

			/**
			 * Checking whether user is authorized to view this page
			 */
			if (!contextService.hasRole(next.allow)) {
				$log.log("user is unauthorized!");
				$log.log("Un authorized access!");
				$location.path("/error404");
			}

		});

		/**
		 * Listens for notification
		 * 
		 * data contains following object { message:"message", type:"info",
		 * effect:"bounce" or etc... icon:"fa fa-xxx", layout: "growl" or bar,
		 * attached, other }
		 * 
		 */
		$rootScope.$on("Notify", function(eve, data) {
			if (!data) {
				$log.log("provided data for notification is not valid!");
				return;
			}

			show(data);
		});

		var show = function(data) {

			var messageObj = {
				message : data.message || "does not contains any valid messge!",
				icon : data.icon || "fa fa-bullhorn",
				effect : data.effect || "bouncyflip",
				type : data.type || "notice",
				layout : data.layout || "attached",
				ttl : 9000
			};
			if (messageObj.layout == "attached") {
				messageObj.message = '<span class="' + messageObj.icon + ' fa-3x  pull-left"></span><p>' + messageObj.message + '</p>';
			} else if (messageObj.layout == "bar") {
				messageObj.message = '<span class="icon ' + messageObj.icon + ' fa-2x"></span><p>' + messageObj.message + '</p>';
			} else if (messageObj.layout == "growl") {
				messageObj.message = '<p>' + messageObj.message + '</p>';
			} else if (messageObj.layout == "growl") {
				messageObj.message = '<p><span class="icon ' + messageObj.icon + '"></span>' + messageObj.message + '</p>';
			} else {
				messageObj.message = '<span class="' + messageObj.icon + ' fa-3x  pull-left"></span><p>' + messageObj.message + '</p>';
			}

			// create the notification
			var notification = new NotificationFx({
				message : messageObj.message,
				layout : messageObj.layout, // growl ,
				effect : messageObj.effect, // flip,
				/**
				 * layout : 'other', effect : 'boxspinner', ttl : 9000,
				 */
				ttl : 1500,
				type : messageObj.type, // notice,
				onClose : function() {
				}
			});
			// show the notification
			notification.show();
		};
	} ]);

	return angular.bootstrap(document, [ "HrWork" ]);
});