define([ "angular", "app" ], function(angular, app) {

	var initService = app.service("ContextService", [
			"$log",
			"$http",
			function($log, $http) {
				var self = this;

				self.urls = {};
				self.menus = {};

				/**
				 * used to hold the current user informations
				 * 
				 * http://localhost:8080/hrwork-rest
				 * 
				 * http://hrwork-10d.rhcloud.com/hrwork-rest
				 */
				self.isLoggedIn = true;
				self.userData={};

				/**
				 * loading all environment data's
				 */
				self.init = function() {
					$log.log("loading context data's");

					self.loadMenus();
					self.loadUrls();

				};

				self.getMenus = function(callback) {
					if (self.menus) {
						callback(self.menus);
						return;
					}
					self.loadMenus(callback);
				};

				self.loadUrls = function() {
					$log.log("loading urls");

					$http.get("app/assets/urls.json").success(function(data) {
						if (data) {
							$log.log("Urls are loaded!");
							self.urls = data;
						}
					}).error(function(data) {
						$log.log("Error while loading urls!");
					});
				};

				self.loadMenus = function(callback) {
					$log.log("loading menus!");
					$http.get("app/assets/menus.json").success(function(data) {
						if (data) {
							$log.log("Menus are loaded!");
							self.menus = data;

							if (callback) {
								callback(data);
							}
						}
					}).error(function(data) {
						$log.log("Error while loading menus!");
					});
				};

				self.getUrl = function(key) {
					$log.log("getting url for: ", key);
					if (self.urls) {
						var url = self.urls.baseUrl + self.urls[key];
						$log.log("url is ", url);
						return url;
					}
					return null;
				};

				self.init();

				/**
				 * used to hold the current project informations
				 */
				self.project = {};
				self.hasRole = function(role) {
					console.log("role in context service",role);
					if (!role) {
						return true;
					}
					for ( var idx in self.userData.role) {
						var index = role
								.indexOf(self.userData.role[idx]);
						$log.log("index: ", index);
						if (index >= 0) {
							return true;
						}
					}
					return false;
				};

			} ]);

	return initService;
});