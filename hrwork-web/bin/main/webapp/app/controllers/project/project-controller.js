define([ "angular", "app", "jquery", "services/ajaxService", "services/context-service" ],
		function(angular, app, $) {
			var ProjectController = app.controller("ProjectController", [
					"$log",
					"$scope",
					"AjaxService","ContextService","$rootScope","$location",
					function($log, $scope, ajaxService, contextService, $rootScope, $location) {

						var self = $scope;
						
						/**
						 * for scope maintanence
						 */
						self.parent={};

						self.projectList = [];

						self.parent.selectedProject = null;
						
						/**
						 * contains user object for selected project
						 */
						self.projectUsers=[];
						
						/**
						 * Project user suggestion list
						 */
						self.usersSuggestionList=[];
						
						self.isSelecteUserAdmin=false;
						
						self.selectedUser=null;

						self.project = {};

						self.message = '';
						
						/**
						 * is current user authorized to view this page; 
						 */
						self.isCurrentUserAuthorized=false;
						
						/**
						 * is current logged in user is admin 
						 */
						self.isAdmin=false;
						

						self.init = function() {
							$log.log("initializing project controller!");
							$log.log("loading.. Projects..");
							
							self.getProjectUserSuggestions();
							
							if(contextService.hasRole('M_ADMIN')){
								self.isAdmin=true;
								/**
								 * Project List
								 */
								$scope.isAjax = true;
								self.loadProjects();
							}else{
								self.parent.selectedProject=contextService.project;								
								self.loadProjectUsers();
							}	
							
						};
						
						/**
						 * checks the project user list to view the project management screen
						 */
						self.checkUserAuthorization=function(){
							$log.log("checking whether the user is authorized to view!");
							for(var idx in self.projectUsers){
								//$log.log("checking puser admin:", self.projectUsers[idx].admin ," comparing puser and user:",self.projectUsers[idx].projectUser.userId==contextService.userData.userId);
								if(self.projectUsers[idx].admin && self.projectUsers[idx].projectUser.userId==contextService.userData.userId){
									self.isCurrentUserAuthorized=true;
									break; 
								}
							}
							
							if(!self.isCurrentUserAuthorized){
								$location.url("/error501");
							}
						};
						
						self.loadProjects=function(){
							var projects=contextService.getUrl("loadAllProjects");
							$log.log("loading all projects!");
							ajaxService.get({
								url : projects,
								success : function(data) {
									$log.log(" success block: ", data);
									if (data && data.responseInfo) {
										$log.log(" is success!", data.result);
										self.projectList = data.result;
									}
									if (data && data.responseError) {
										$log.log("Error while loading project",
												data.responseError);
									}
									$scope.isAjax = false;
									$scope.$apply();
								},
								error : function(data) {
									$log.log("  project loading error block: ",
											data);
									$scope.isAjax = false;
									$scope.$apply();
								}
							});
						};
						

						self.loadProjectUsers = function() {
							self.projectUsers = [];
							if(!self.parent.selectedProject){
								return;
							}
							// this is used to get all the users for selected
							// project.
							$log.log("loading project users!");
							var baseUrl=contextService.getUrl("getProjectUsers");
							baseUrl+="?projectId="+self.parent.selectedProject.projectId;
							ajaxService.get({
								url:baseUrl,
								success:function(data){
									$log.log("Success for project users:!",data);
									if(data && data.responseSuccess){
										self.projectUsers=data.result;
										if(!self.isAdmin){
											self.checkUserAuthorization();
										}
										$scope.$apply();
									}									
								},
								error:function(data){
									$log.log("Error for project users:!",data);
								}
							});
						};

						self.createNewProject = function() {
							$log.log("creating new project!", self.project);
							self.project.owner={
								userId:1
							};
							
							var baseUrl=contextService.getUrl("createProject");
							
							ajaxService.post({
								url : baseUrl,
								data : angular.toJson(self.project),
								headers:{
									"Content-Type":"application/json"
								},
								success : function(data) {
									$log.log("Success Result:", data);
									if(data && data.responseSuccess){
										$rootScope.$broadcast("Notify",{
											message:"Your project has been created successfully!",
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"success"
										});
										self.project={};
										self.projectList.push(data.result);
										$scope.$apply();
									}	
									
									if(data && data.responseError){
										$rootScope.$broadcast("Notify",{
											message: data.responseError,
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"error"
										});
									}
									$("#myModal").modal('hide');
								},
								error : function(data) {
									$log.log("Error Result:", data);
									
									$rootScope.$broadcast("Notify",{
										message:"Internal service error while creating new project, please try again!",
										icon:"fa fa-cog",
										layout:"bar",
										effect:"exploader",
										type:"success"
									});
									
									$("#myModal").modal('hide');
								}
							});
							
						
						};

						self.getProjectUserSuggestions=function(){
							$log.log("Loading suggestions..");
							var baseUrl=contextService.getUrl("getAllUsers");
							ajaxService.get({
								url:baseUrl,
								success:function(data){
									$log.log("Success :",data);
									if(data && data.responseSuccess){
										self.usersSuggestionList=data.result;
										$scope.$apply();
									}
								},
								error:function(data){
									$log.log("Error :",data);
								}
							});
						};
						
						self.addNewUser=function(){
							$log.log("selected user:", self.selectedUser);
							$log.log("selected user:", self.parent.selectedProject);
							$log.log("is user admin:", self.isSelecteUserAdmin);
							var obj={
								"createdBy":contextService.userData.userId,
								"updatedBy":contextService.userData.userId,
								"projectId":self.parent.selectedProject, 
								"projectUser":self.selectedUser,
								"admin":self.isSelecteUserAdmin};
							ajaxService.post({
								url:contextService.getUrl("addProjectUser"),
								data:angular.toJson(obj),
								headers:{
									"Content-Type":"application/json"
								},
								success:function(data){
									$log.log("success: ",data);
									if(data && data.responseSuccess){
										$rootScope.$broadcast("Notify",{
											message: "User is added successfully!",
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"success"
										});
										self.selectedUser=null;
										self.isSelecteUserAdmin=false;
										self.projectUsers.push(data.result);
										$scope.$apply();										
									}
									
									if(data && data.responseError){
										$rootScope.$broadcast("Notify",{
											message: data.responseError,
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"error"
										});
									}
									
									if(data && data.responseWarning){
										$rootScope.$broadcast("Notify",{
											message: data.responseWarning,
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"warning"
										});
									}
								},
								error:function(data){
									$log.log("error: ",data);
									$rootScope.$broadcast("Notify",{
										message: "Error while adding new user, please try again!",
										icon:"fa fa-cog",
										layout:"bar",
										effect:"exploader",
										type:"error"
									});
								}
							});
							
						};
						
						self.updateUser=function(user){
							$log.log("selected user to update:",JSON.stringify(user));   
							user.createdBy=contextService.userData.userId;
							user.updatedBy=contextService.userData.userId; 
							
							ajaxService.post({
								url:contextService.getUrl("updateprojectuser"),
								data:angular.toJson(user),
								headers:{
									"Content-Type":"application/json"
								},
								success:function(data){
									$log.log("success: ",data);
									if(data && data.responseSuccess){
										$rootScope.$broadcast("Notify",{
											message: "User is updated successfully!",
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"success"
										});
										$scope.$apply();										
									}
									
									if(data && data.responseError){
										$rootScope.$broadcast("Notify",{
											message: data.responseError,
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"error"
										});
									}
									
									if(data && data.responseWarning){
										$rootScope.$broadcast("Notify",{
											message: data.responseWarning,
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"warning"
										});
									}
								},
								error:function(data){
									$log.log("error: ",data);
									$rootScope.$broadcast("Notify",{
										message: "Error while adding new user, please try again!",
										icon:"fa fa-cog",
										layout:"bar",
										effect:"exploader",
										type:"error"
									});
								}
							});
							
						};
						

						
						self.deleteUser=function(user){
							$log.log("delete user has been called!");
							var baseUrl=contextService.getUrl("deleteProjectUser");
							ajaxService.post({
								url:baseUrl,
								data:{
									projectId:user.projectId.projectId,
									userId:user.projectUser.userId
								},
								success:function(data){
									$log.log("Success :", data);
									if(data && data.responseSuccess){
										$rootScope.$broadcast("Notify",{
											message: data.responseSuccess,
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"success"
										});
										
										var idx=self.projectUsers.indexOf(user);
										if(idx>=0){
											self.projectUsers.splice(idx,1);
										}
										$scope.$apply();
									}
									if(data && data.responseError){
										$rootScope.$broadcast("Notify",{
											message: data.responseError,
											icon:"fa fa-cog",
											layout:"bar",
											effect:"exploader",
											type:"error"
										});
									}
								},error:function(data){
									$log.log("Error :", data);
									$rootScope.$broadcast("Notify",{
										message: "Error while deleting existing user, please try again!",
										icon:"fa fa-cog",
										layout:"bar",
										effect:"exploader",
										type:"error"
									});
								}
							});
						};
						
						

						self.init();

					} ]);

			return ProjectController;
		});