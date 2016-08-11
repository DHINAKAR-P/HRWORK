define(
		[ "angular", "app", "services/context-service", "services/userservice" ],
		function(angular, app) {
			var ListuserLeaveController = app.controller("ListuserLeaveController",
					[
							"$log",
							"$scope",
							"ContextService",
							"UserService",
							"AjaxService",
							"$rootScope",
							"$location",
							"$cookieStore",
							function($log, $scope, contextService, UserService,
									ajaxService, $rootScope, $location,$cookieStore) {
								self=$scope;							
								var userid='';
								self.init = function() {
									var variable=$cookieStore.get('dashBoard');
									console.log("variable",variable);
									if(variable=='listUserLeave/fromListOfUser')
										{ userid=UserService.userid;	
										console.log("userid from contextservice in if loop true part",contextService.userData.id);
										console.log("userid",userid); 
										$cookieStore.put('dashBoard',' ');										
										var finalStore=$cookieStore.get('dashBoard');	
										console.log("finalStore",finalStore);
										}
									else{
									userid =contextService.userData.id;
									console.log("userid from contextService else part",userid);
									}
									console.log("userid in ListOfUserLeave Controller",userid);
									var url=contextService.getUrl("listuserleave");
									url+="?id="+userid ;
									
									ajaxService.get({
										url:url,
										success:function(data){
											console.log(data);
											$log.log("Success! ", angular.toJson(data));
											console.log("data.result",data.result);
											if(data && data.responseSuccess){
												$log.log("fetching all User's  Leave list ", data.responseSuccess);
													$scope.leaveList=data.result;
													console.log("LeaveList "+$scope.leaveList);
																								
											}
											$scope.$apply();
										},
										error:function(data){
											$log.log("Error: ",data);
											$scope.$apply();
										}
									});	
				};	

self.edit=function(leave)
{
	console.log("to edit the leave details",angular.toJson(leave));
	UserService.leaveDetails=leave;	
$location.url("/updateLeaveDetails");	
}
//dhina
self.cancelleave=function(leave)
{
	console.log("in CANCEL method leave id",leave.id);
	 	console.log("to change status of leave ");
		var ch=leave.status;
		console.log("leave Status",ch);
	  	 switch (ch)
		 {
		  
		  case 'APPROVED':{leave.status='CANCEL';
		// color.style.backgroundColor = "#FFFFFF"
		// $("#submitBtn").removeClass("btn-success").addClass("btn-danger");
		 }
		 break;
		 case 'REJECTED':{leave.status='CANCEL';
		// color.style.backgroundColor = "#7FFF00"
		// $("submitBtn").removeClass("btn-danger").addClass("btn-success");									 
		 }
		 break;
		 case 'PENDING_APPROVAL':leave.status='CANCEL';
		 break;
		 }
	console.log("status after loop",leave.status);
		leave={
				"id":leave.id,
				"status":leave.status
				}
		
		ajaxService.post({										
			url:contextService.getUrl("leaveStatus"),
			data:angular.toJson(leave),
			headers:{
				"Content-Type":"application/json",
			},
			success:function(data){
				$log.log("leaves status!", data);
				if(data && data.responseSuccess){	
				$scope.$apply();											
				}
				$scope.$apply();
			},
			error:function(data){
				$log.log("Error: ",data);
				$scope.$apply();
			}
		});	
		
	}

self.deleteleave=function(leave)
{
	console.log("in delete method leave id",leave.id);

	var index = -1;
	var leavelistindex = eval($scope.leaveList);
	for (var i = 0; i < leavelistindex.length; i++) {
		if (leavelistindex[i].id === leave.id) {
			index = i;
			break;
		}
	}
	if (index === -1) {
		alert("Something gone wrong");
	}
	self.leaveList.splice(index, 1);
	
	var url=contextService.getUrl("DeleteLeave");
	ajaxService.get({
		url:url+="?id="+leave.id,
		success:function(data){
			console.log(data);
			$log.log("Success! ", angular.toJson(data));
			if(data && data.responseSuccess){
				$log.log("delete Leave ", data.responseSuccess);
				$rootScope.$broadcast("Notify", {
					message : data.responseSuccess,
					type : "success",
					layout : "bar",
					effect : 'slidetop'
				});
			}
			$scope.$apply();
		},
		error:function(data){
			
			$rootScope.$broadcast("Notify", {
				message : data.responseError,
				type : "error",
				layout : "bar",
				effect : 'slidetop'
			});
			$log.log("Error: ",data);
			$scope.$apply();
		}
	});	

}

				self.init();
				} ]);
			return ListuserLeaveController;
		});