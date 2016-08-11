define([ "angular", "app", "services/context-service", "services/ajaxService" ],
  function(angular, app) {

   var loginController = app.controller("LoginController", [ "$log",
     "$scope", "$rootScope", "ContextService", "AjaxService",
     function($log, $scope, $rootScope, contextService, ajaxService) {

      var self = $scope;
      
      self.user={};
      
      self.userObjTemp={};
      
      self.projects=[];
      
      self.isMasterAdmin=false; 
      
      self.pro={};           

      self.doLogin = function() {
       var login=contextService.getUrl("login");
       ajaxService.post({
        url:login,
        data:angular.toJson(self.user),
        headers:{
         "Content-Type":"application/json"
        },
        success:function(data){
         $log.log("Success: ",data);
         if(data && data.responseSuccess){
          
          contextService.isLoggedIn=true;
          
          $rootScope.$broadcast("Notify", {
           
           message : "You have logged in successfully!",
           type : "success",
           layout : "bar",
           effect : 'slidetop'
           
          });
          
          //      
          self.userObjTemp=angular.fromJson(data.result);
          //self.userObjTemp.roles=self.userObjTemp.roles.storedSnapshot;
          $log.log("user info:", self.userObjTemp, angular.toJson(self.userObjTemp));
          contextService.userData=self.userObjTemp;
          
          /*if(contextService.hasRole('M_ADMIN')){
           self.isMasterAdmin=true;
           self.getAllProjectsByUser(o);
          }else{
           self.getAllProjectsByUser(contextService.userData.userId);
          }  */   

          $rootScope.$broadcast("doLogin",self.userObjTemp);
          $scope.$apply();          
         }
         
         if(data && data.responseError){
          
          $rootScope.$broadcast("Notify", {
           message : data.responseError,
           type : "error",
           layout : "bar",
           effect : 'slidetop'
          });
         }
         
         $scope.$apply();
        },error:function(data){
         $log.log("Error: ",data);
         $rootScope.$broadcast("Notify", {
          message : "Internal server error, please try again!",
          type : "error",
          layout : "bar",
          effect : 'slidetop'
         });
        }        
       });       
      };
      
//      self.proceedLogin=function(){
//       $rootScope.$broadcast("doLogin",self.userObjTemp);
//       contextService.project=self.pro.project;
//       $rootScope.projectName=self.pro.project.projectName;
//       $log.log("project selected!",self.pro.project);
//      };
//      
//      self.getAllProjectsByUser=function(id){
//       
//       var url='';
//       if(id==0){
//        url=contextService.getUrl("loadAllProjects");
//       }else{
//        url=contextService.getUrl("getProjectsByUser");
//        url+="?userId="+id;
//       }
//       
//       ajaxService.get({
//        url:url,
//        headers:{
//         "Content-Type":"application/json"
//        },
//        success:function(data){
//         $log.log("projects success:", data);
//         if(data && data.result){
//          $log.log("projects found!", data.result);
//          self.projects=data.result;
//         }
//         
//         if(data && data.responseSuccess && !data.result){
//          $rootScope.$broadcast("Notify", {
//           message : "Currently you are not associated with any project(s) so, please contact your administartor.",
//           type : "warning",
//           layout : "bar",
//           effect : 'slidetop'
//          });
//         }
//         
//         
//         $scope.$apply();
//        },
//        error:function(data){
//         $log.log("error:", data);
//        }
//       });
//       
//      };
//
    } ]);

   return loginController;
  });




/*define([ "angular", "app", "services/context-service", "services/ajaxService" ],
		function(angular, app) {

			var loginController = app.controller("LoginController", [ "$log",
					"$scope", "$rootScope", "ContextService", "AjaxService",
					function($log, $scope, $rootScope, contextService, ajaxService) {

						var self = $scope;
						
						self.user={};
						
						self.userObjTemp={};
						
						self.projects=[];
						
						self.isMasterAdmin=false;
						
						self.pro={};											

						self.doLogin = function() {
							var login=contextService.getUrl("login");
							ajaxService.post({
								url:login,
								data:angular.toJson(self.user),
								headers:{
									"Content-Type":"application/json"
								},
								success:function(data){
									$log.log("Success: ",data);
									if(data && data.responseSuccess){
										
										contextService.isLoggedIn=true;
										
										$rootScope.$broadcast("Notify", {
											
											message : "You have logged in successfully!",
											type : "success",
											layout : "bar",
											effect : 'slidetop'
											
										});
										
										//						
										self.userObjTemp=angular.fromJson(data.result);
										self.userObjTemp.roles=self.userObjTemp.roles.storedSnapshot;
										$log.log("user info:", self.userObjTemp, angular.toJson(self.userObjTemp));
										contextService.userData=self.userObjTemp;
										
										if(contextService.hasRole('M_ADMIN')){
											self.isMasterAdmin=true;
											self.getAllProjectsByUser(0);
										}else{
											self.getAllProjectsByUser(contextService.userData.userId);
										}																				
										$scope.$apply();										
									}
									
									if(data && data.responseError){
										
										$rootScope.$broadcast("Notify", {
											message : data.responseError,
											type : "error",
											layout : "bar",
											effect : 'slidetop'
										});
									}
									
									$scope.$apply();
								},error:function(data){
									$log.log("Error: ",data);
									$rootScope.$broadcast("Notify", {
										message : "Internal server error, please try again!",
										type : "error",
										layout : "bar",
										effect : 'slidetop'
									});
								}								
							});							
						};
						
						self.proceedLogin=function(){
							$rootScope.$broadcast("doLogin",self.userObjTemp);
							contextService.project=self.pro.project;
							$rootScope.projectName=self.pro.project.projectName;
							$log.log("project selected!",self.pro.project);
						};
						
						self.getAllProjectsByUser=function(id){
							
							var url='';
							if(id==0){
								url=contextService.getUrl("loadAllProjects");
							}else{
								url=contextService.getUrl("getProjectsByUser");
								url+="?userId="+id;
							}
							
							ajaxService.get({
								url:url,
								headers:{
									"Content-Type":"application/json"
								},
								success:function(data){
									$log.log("projects success:", data);
									if(data && data.result){
										$log.log("projects found!", data.result);
										self.projects=data.result;
									}
									
									if(data && data.responseSuccess && !data.result){
										$rootScope.$broadcast("Notify", {
											message : "Currently you are not associated with any project(s) so, please contact your administartor.",
											type : "warning",
											layout : "bar",
											effect : 'slidetop'
										});
									}
									
									
									$scope.$apply();
								},
								error:function(data){
									$log.log("error:", data);
								}
							});
							
						};

					} ]);

			return loginController;
		});*/