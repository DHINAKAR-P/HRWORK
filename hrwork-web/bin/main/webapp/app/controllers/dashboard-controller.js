define([ "angular", "app", "services/context-service", "services/ajaxService"], function(angular, app) {

	var dashboardController = app.controller("DashBoardController", [ "$log",
			"$scope", "$timeout", "ContextService", "AjaxService","$rootScope",
			function($log, $scope, $timeout, contextService, ajaxService, $rootScope) {

				var self = $scope;

				self.templateList=[];
				
				self.init = function() {
					$log.log("initializing dashboard controller!");
					
					if(angular.element("#theme-wrapper")){
						$timeout(function(){
							angular.element("#theme-wrapper").show();
						},100);						
					}
					ajaxService.get({
						url:contextService.getUrl("contactlist"),
						success:function(data){
							$log.log("Success!", data);
							if(data && data.responseSuccess){
								$log.log("fetching all users is success!", data.result);
								if(data.result){
									$scope.contactList=data.result;
								}
							}
							$scope.isAjax=false;
							$scope.$apply();
						},
						error:function(data){
							$log.log("Error: ",data);
							$scope.isAjax=false;
							$scope.$apply();
						}
					});	
					
				};
				

				self.init();

			} ]);

	return dashboardController;
});