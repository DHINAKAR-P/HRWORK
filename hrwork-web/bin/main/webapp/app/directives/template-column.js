define(['angular', 'app','services/context-service'], function(angular, app){
	
	var templateDirective=app.directive('templateColumn',['$log','ContextService', '$rootScope',function( $log, contextService, $rootScope){
		
		return{
			restrict:"EA",
			scope:{
				column:"=column"
			},
			link:function(element, $scope, attrs){
				$log.log("column tag has linked with ui!");
			},
			controller:['$scope',function($scope){
				
				var self=$scope;
				
				self.dataTypes=contextService.dataTypes;
				
				self.init=function(){
					$log.log("template column has been initialized!");
				};
				
				self.init();
				
				/**
				 * delete column handler
				 */
				self.deleteColumn=function(){
					$rootScope.$broadcast('onDeleteColumn',self.column);
				}
			}],
			controllerAs:'col',
			templateUrl:'app/views/directives/templateColumn.html'
			
		};		
	}]);
	
	return templateDirective;
	
});