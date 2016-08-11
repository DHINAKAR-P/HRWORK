define([ "angular", "app" ], function(angular, app) {

	var initService = app.service("ContextService", [ "$log", "$http",
			function($log, $http) {
				var self = this;

				self.urls = {};
				self.menus = {};
				self.dataTypes=[];
				self.rowPositions=[];
				
				
				/**
				 * used to hold the current user informations
				 */
				self.isLoggedIn=false;
				self.userData={
					roles:[{
						roleId:1,
						roleName:"P_AMDIN"
					}]
				};
				
				
				/**
				 * used to hold the current project informations
				 */
				self.project={};
				
				self.hasRole=function(role){
					if(!role){
						return true;
					}					
					
					//$log.log(self.userData.roles);
										
					for(var idx in self.userData.roles){
						var index=role.indexOf(self.userData.roles[idx].roleCode);
						//$log.log("index: ",index);
						if(index >= 0 ){
							return true;
						}
					}			
					return false;
				};				
				
				
				/**
				 * loading all environment data's
				 */
				self.init = function() {
					$log.log("loading context data's");
					self.loadMenus();
					self.loadUrls();
				};
				
				self.getMenus=function(callback){
					if(self.menus){
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
							self.urls=data;
							self.getAllDataTypes();
							self.getAllRowPositions();
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
							if(callback){
								callback(data);
							}							
						}
					}).error(function(data) {
						$log.log("Error while loading menus!");
					});
				};
				
				self.getUrl=function(key){
					$log.log("getting url for: ",key);
					if(self.urls){
						var url=self.urls.baseUrl+self.urls[key];
						$log.log("url is ",url);
						return url;
					}
					return null;
				};
				
				/**
				 * Load all data types for template
				 */
				self.getAllDataTypes=function(){
					var url=self.getUrl("getAllDataTypes");
					$http({
						method:"GET",
						url:url
					}).success(function(data){
						$log.log("response success!", data);
						if(data && data.responseSuccess){
							$log.log("data types are loaded!");
							self.dataTypes=data.result;
						}
						
						if(data && data.responseError){
							$log.log("Error while loading data types!",data);
						}
						
					}).error(function(data){
						$log.log("Error: ", data);
					});
				};
				
				/**
				 * load all row position
				 */
				self.getAllRowPositions=function(){
					var url=self.getUrl("getAllRowPositions");
					$http({
						method:"GET",
						url:url
					}).success(function(data){
						$log.log("response success!", data);
						if(data && data.responseSuccess){
							$log.log("row positions are loaded!");
							self.rowPositions=data.result;
						}
						
						if(data && data.responseError){
							$log.log("Error while loading rowpositions !",data);
						}
						
					}).error(function(data){
						$log.log("Error: ", data);
					});
				};

				self.init();

			} ]);

	return initService;

});