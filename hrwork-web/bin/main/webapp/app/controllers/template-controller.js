	define([ "angular", "app", "jquery", "utils/appUtils"], function(angular, app, $) {

	var dashboardController = app.controller("TemplateController", [ "$log",
			"$scope","ContextService", "AjaxService", "$rootScope", "$routeParams", "AppUtils", "$timeout",
			function($log, $scope, contextService, ajaxService, $rootScope, $routeParams, appUtils, $timeout) {

				var self = $scope;
				
				/**
				 * maintaining steps on the template screen
				 */
				self.currentStep=1;
				
				/**
				 * ajax loading listener
				 */
				self.isAjax=false;
				
				/**
				 * Project list holds the list of project informations
				 */
				self.projectList=[];
				
				/**
				 * Selected Project 
				 */
				self.selectedProject={};
				
				
				/**
				 * clone templates   
				 */
				self.clonableTemplates=[];
				
				/**
				 * cloned template 
				 */
				self.clonedTemplate={
						template:'',
						templateName:''
				};
				
				/**
				 * Templates which will hold all templates related to the current project  
				 */
				self.templateList=[];
				
				/**
				 * holds the template related informations
				 */
				self.template=null;
				
				/**
				 * columns for current template body
				 */
				self.columns=[];
				
				/**
				 * columns for the current template header
				 */
				self.headerColumns=[];
				
				
				/**
				 * columns for the current template footer
				 */
				self.footerColumns=[];
				
				
				/**
				 * row Position informations
				 */
				self.rowPos={
					HEADER:0,
					FOOTER:0,
					BODY:0
				};
				
				/**
				 * Modal Title to Display
				 */
				self.modalTitle="";
				
				/**
				 * File errors are notified using this 
				 */
				self.fileError=null;
				
				/**
				 * file upload and process inprogress identifier
				 */
				self.fileUploadInProgress=false;
				
				/**
				 * initializing template controller
				 */
				self.init = function() {
					$log.log("initializing template controller!");
					self.loadProjects();
					
					$log.log("Template Id is: ", $routeParams.templateId);
					
					
					/**
					 * loading row postions
					 */
					for(var idx in contextService.rowPositions){
						
						if(contextService.rowPositions[idx].lovVal==='Header'){
							self.rowPos.HEADER=contextService.rowPositions[idx].id;
						}
						
						if(contextService.rowPositions[idx].lovVal==='Footer'){
							self.rowPos.FOOTER=contextService.rowPositions[idx].id;
						}
						
						if(contextService.rowPositions[idx].lovVal==='Body'){
							self.rowPos.BODY=contextService.rowPositions[idx].id;
						}
						
					}
					
					/**
					 * loading project
					 */
					self.selectedProject=contextService.project;
									
					
					/**
					 * initialize modal effects
					 */
					/*appUtils.initializeModalEffect();*/
					
					/*if(selectedProject.projectId==0){
						self.modalTitle="Choose Project";
						self.openModal();
					}*/
					
					if($routeParams.templateId==0){
						self.createNewEmptyTemplate();
					}else if($routeParams.templateId>0){
						self.loadTemplateById($routeParams.templateId);
					}
					
					/**
					 * get all global templates to clone
					 */
					self.getAllGlobalTemplates();
					
					/**
					 * registering file change listener.
					 */
					self.handleFileSection();
				};
				
				
				
				/**
				 * file upload section
				 */
				self.handleFileSection=function(){
					$log.log("registering file upload changes!");
					$(function(){						
						$("#templateFile").on('change',self.onFileUpload);						
					});					
				};			
				
				/**
				 * on change event listerner of the file
				 */
				self.onFileUpload=function(evt){
					//$log.log("file has been detected: ", evt);
					//$log.log("file type:",evt.target.files[0].type);
					// no file is available!
					if(!evt.target.files[0]){
						$log.log("file is empty!");
						return;
					}
						
					 var regex = new RegExp("(.*?)\.(xml|plain)$");
					 if(!(regex.test(evt.target.files[0].type))) {
						 $log.log("File is invalid!");
							self.fileError="Invalid file or file type!";
							$scope.$apply();
							return; 
					 }else{
						self.fileError=null;
						self.fileUploadInProgress=true;
						$scope.$apply();
					}
					
					var reader=new FileReader();
					reader.onload=function(ev){
						//$log.log("file input:", ev.target.result);
						
						//text/plain
						if(evt.target.files[0].type=="text/plain"){
							try{
								var templateJson=angular.fromJson(ev.target.result);								
								if(templateJson && templateJson.templateName && templateJson.colSeparator &&
										templateJson.fileType && templateJson.headers && templateJson.footers && templateJson.body){
									$log.log("File has valid json content!");
									templateJson=self.refineUploadedTemplate(templateJson);
									self.initializeTemplateManagment(templateJson);						
								}else{
									throw new Error("Invalid file content!");
								}								
							}catch(e){
								self.fileError="Invalid file content!";
							}							
						}
						
						//text/xml
						if(evt.target.files[0].type=="text/xml"){
							try{
								var xmlDoc=$.parseXML(ev.target.result);
								if(!$(xmlDoc).find("fileType").text() || !$(xmlDoc).find("templateName").text()
										|| !$(xmlDoc).find("colSeparator").text() || !$(xmlDoc).find("hasHeaderRows").text() || !$(xmlDoc).find("hasFooterRows").text()
										|| !$(xmlDoc).find("headerRowsCount").text() || !$(xmlDoc).find("footerRowsCount").text() || !$(xmlDoc).find("headers").text()
										|| !$(xmlDoc).find("footers").text() || !$(xmlDoc).find("body").text()){
									throw new Error("invalid file content!");
								}else{
									$log.log("valid xml!");
									
									var jsonObj=self.parseXMLDoc(xmlDoc);
									jsonObj=self.refineUploadedTemplate(jsonObj);
									self.initializeTemplateManagment(jsonObj);	
								}								
							}catch(e){
								$log.log("invalid xml!", e.toString());
								self.fileError="Invalid file content!";
							}	
						}
						
						$scope.$apply();						
					};
					
					reader.onloadend=function(){
						self.fileUploadInProgress=false;
						$scope.$apply();
					}
					
					reader.readAsText(evt.target.files[0]);
				};
				
				/**
				 * This method is used to remove the unwanted content from the uploaded template
				 */
				self.refineUploadedTemplate=function(jsonObj){
					$log.log("refining templates");
					
					var tempObj={
					   "fileType":"text",
					   "templateName":null,
					   "colSeparator":null,
					   "isGlobal":false,
					   "headerRowsCount":0,
					   "footerRowsCount":0,
					   "hasHeaderRows":false,
					   "hasFooterRows":false,
					   "headers":[],
					   "footers":[],
					   "body":[]
					};
					
					
					if(jsonObj.fileType){
						tempObj.fileType=jsonObj.fileType;
					}
					
					if(jsonObj.templateName){
						tempObj.templateName=jsonObj.templateName;
					}
					
					if(jsonObj.colSeparator){
						tempObj.colSeparator=jsonObj.colSeparator;
					}
					
					if(jsonObj.isGlobal){
						tempObj.isGlobal=true;
					}
					
					if(jsonObj.hasHeaderRows){
						tempObj.hasHeaderRows=jsonObj.hasHeaderRows;
					}
					
					if(jsonObj.hasFooterRows){
						tempObj.hasFooterRows=jsonObj.hasFooterRows;
					}
					
					if(jsonObj.headerRowsCount){
						tempObj.headerRowsCount=jsonObj.headerRowsCount;
					}
					
					if(jsonObj.footerRowsCount){
						tempObj.footerRowsCount=jsonObj.footerRowsCount;
					}
					
					if(jsonObj.headers){
						tempObj.headers=self.refineColumns(jsonObj.headers, self.rowPos.HEADER);
					}
					
					if(jsonObj.footers){
						tempObj.footers=self.refineColumns(jsonObj.footers, self.rowPos.FOOTER);
					}
					
					if(jsonObj.body){
						tempObj.body=self.refineColumns(jsonObj.body, self.rowPos.BODY);
					}
					
					return tempObj;
					
				};
				
				/**
				 * removing unwanted things for columns
				 */
				self.refineColumns=function(cols, rowPos){
					$log.log("refining columns");
					
					if(!cols){
						return;						
					}
					
					var columns=[];
					
					var columnObj={};
					
					for(var idx in cols){
						columnObj={
							"rowPosition":null,
					        "columnName":null,
					        "columnType":null,
					        "colOrder":0
					    };
						
						columnObj.rowPosition=rowPos;
					    
						if(cols[idx].columnName){
							columnObj.columnName=cols[idx].columnName;	
						}else{
							columnObj.columnName="col"+idx;
						}
						
						if(cols[idx].columnType && cols[idx].columnType >= 3 && cols[idx].columnType <= 9){
							columnObj.columnType=cols[idx].columnType;
						}else{
							//set default to string
							columnObj.columnType=3;
						}						
						
						columnObj.colOrder=(parseInt(idx)+1);						
						
						$log.log("column:", columnObj)
						columns.push(columnObj);						
					}
				
					return columns;
				};
				
				/**
				 * parse the xmlDocument and convert it to json object
				 */
				self.parseXMLDoc=function(xmlDoc){
					var tempObj={};
					
					$(xmlDoc).find("template").each(function(){
						
						tempObj={
							   "fileType":"text",
							   "templateName":null,
							   "colSeparator":null,
							   "isGlobal":false,
							   "headerRowsCount":0,
							   "footerRowsCount":0,
							   "hasHeaderRows":false,
							   "hasFooterRows":false,
							   "headers":[],
							   "footers":[],
							   "body":[]
							}
					
						$log.log("file type:", $(this).find("fileType").text());
						
						if($(this).find("fileType").text()){
							tempObj.fileType=$(this).find("fileType").text();
						}
						
						if($(this).find("templateName").text()){
							tempObj.templateName=$(this).find("templateName").text();
						}
						
						if($(this).find("colSeparator").text()){
							tempObj.colSeparator=$(this).find("colSeparator").text();
						}
						
						if($(this).find("isGlobal").text()){
							tempObj.isGlobal=$(this).find("isGlobal").text()=="true"?true:false;
						}
						
						if($(this).find("headerRowsCount").text()){
							tempObj.headerRowsCount=$(this).find("headerRowsCont").text();
						}
						
						if($(this).find("footerRowsCount").text()){
							tempObj.footerRowsCount=$(this).find("footerRowsCount").text();
						}
						
						if($(this).find("hasHeaderRows").text()){
							tempObj.hasHeaderRows=$(this).find("hasHeaderRows").text()=="true"?true:false;
						}
						
						if($(this).find("hasFooterRows").text()){
							tempObj.hasFooterRows=$(this).find("hasFooterRows").text()=="true"?true:false;
						}
						
						var col={
								"columnName":null,
								"columnType":0
							};
						
						$(this).find("headers").each(function(){
							
							$(this).find("column").each(function(){
								col={
										"columnName":null,
										"columnType":0
									};
								
								col.columnName=$(this).find("columnName").text();
								col.columnType=$(this).find("columnType").text();
								
								tempObj.headers.push(col);
								
							});
							
						});
						
						$(this).find("footers").each(function(){
							
							$(this).find("column").each(function(){
								col={
										"columnName":null,
										"columnType":0
									};
								
								col.columnName=$(this).find("columnName").text();
								col.columnType=$(this).find("columnType").text();
	
								tempObj.footers.push(col);
							});
							
						});
						
						
						$(this).find("body").each(function(){
							
							$(this).find("column").each(function(){
								col={
										"columnName":null,
										"columnType":0
									};
								
								col.columnName=$(this).find("columnName").text();
								col.columnType=$(this).find("columnType").text();
	
								tempObj.body.push(col);
							});
							
						});
					
					});
					
					return tempObj;
					
				};
				
				
				/**
				 * load all the values properly from template to populate in the browser view.
				 */
				self.initializeTemplateManagment=function(template){
					if(template){
						self.template=template;
					}
					
					if(template.body){
						self.columns=template.body;
					}
					

					if(template.headers){
						self.headerColumns=template.headers;
					}
					
					if(template.footers){
						self.footerColumns=template.footers;
					}
					
					$log.log("template has been initalized!");
				};
				

				/**
				 * open a modal
				 */
				/*self.openModal=function(){
					$log.log("opening a modal!");
					$timeout(function(){
						$('#modal1').trigger('click');						
					},1000);
				};*/
				
				/**
				 * close a modal
				 */
				/*self.closeModal=function(){
					$log.log("closing a modal!");
					$timeout(function(){
						$('.md-close').trigger('click');
					},1000);
				};*/
				
				/**
				 * load existing project on selected project
				 */
				/*self.loadExistings=function(){
					self.closeModal();
					if(self.templateList.length >= 0){
						self.loadTemplate(self.templateList[0]);
					}					
				};*/
				
				/**
				 * change project
				 */
				/*self.changeProject=function(){
					self.openModal();
				};*/
				
				
				/**
				 * handle cloning
				 */
				self.cloneTemplate=function(){
					$log.log("clonned template:", self.clonedTemplate);
					
					self.clonedTemplate.template.project=self.selectedProject;
					
					self.resolveCreateOrUpdate();
					
					var url=contextService.getUrl("cloneExistingTemplate");
					ajaxService.post({
						url:url,
						data:angular.toJson(self.clonedTemplate),
						headers:{
							"Content-Type":"application/json"
						},
						success:function(data){
							$log.log("success!", data);
							if(data && data.responseSuccess){
								$log.log("you have cloned existing templates successfully!");
								$rootScope.$broadcast("Notify",{
									message: data.responseSuccess,
									icon:"fa fa-cog",
									layout:"bar",
									effect:"exploader",
									type:"success"
								});
								
								self.template=data.result;
								self.getAllDataColumns(self.template.id);
								/*if(self.templateList && self.templateList!=null){
									$log.log("add cloned template into existing templatelist!");
									self.templateList.push(self.template);
									self.getAllTemplatesBasedOnProjectId(self.selectedProject.projectId, false);
								}else{
									$log.log("loading templatelist!");*/
									self.getAllTemplatesBasedOnProjectId(self.selectedProject.projectId, true);
								/*}	*/
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
						},
						error:function(data){
							$log.log("error while cloning the template!");
							$rootScope.$broadcast("Notify",{
								message: "Error while cloning existing template, please try again.",
								icon:"fa fa-cog",
								layout:"bar",
								effect:"exploader",
								type:"error"
							});	
						}
					});
				};
				
				
				/**
				 * this is used to maintain the audit columns
				 */
				self.resolveCreateOrUpdate=function(){
					
					$log.log("template: ", self.template);
					if(self.template && self.template.id){					
						self.template.updatedBy=contextService.userData.userId;
						self.template.updatedDate=new Date();
					}else if(self.template){
						self.template.createdBy=contextService.userData.userId;
						self.template.updatedBy=contextService.userData.userId;
						self.template.createdDate=new Date();
						self.template.updatedDate=new Date();
					}
					
					$log.log("cloned template: ", self.clonedTemplate);
					if(self.clonedTemplate && self.clonedTemplate.template.id){					
						self.clonedTemplate.template.createdBy=contextService.userData.userId;
						self.clonedTemplate.template.updatedBy=contextService.userData.userId;
						self.clonedTemplate.template.createdDate=new Date();
						self.clonedTemplate.template.updatedDate=new Date();
					}else if(self.clonedTemplate.template){
						self.clonedTemplate.template.createdBy=contextService.userData.userId;
						self.clonedTemplate.template.updatedBy=contextService.userData.userId;
						self.clonedTemplate.template.createdDate=new Date();
						self.clonedTemplate.template.updatedDate=new Date();
					}
				};
				
				
				/**
				 * Getting all global templates
				 */
				self.getAllGlobalTemplates=function(){
					$log.log("getting all global templates!");
					self.clonableTemplates=[];
					ajaxService.get({
						url:contextService.getUrl("getAllGlobalTemplates"),
						success:function(data){
							$log.log("success:", data);
							if(data && data.responseSuccess){
								$log.log("global templates are loaded!");
								self.clonableTemplates=data.result;
								$scope.$apply();
							}
						},
						error:function(data){
							$log.log("error while loading global templates: ", data);
						}
					});
				};
				
				
				/**
				 * loading all projects
				 */
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
							$scope.$apply();
						},
						error : function(data) {
							$log.log("  project loading error block: ",
									data);
							$scope.$apply();
						}
					});
				};
				
				/**
				 * create new empty template
				 */				
				
				
				/**
				 * @deprecated
				 * Decides which screen it should show
				 */
				self.gotoTemplateView=function(screen){
					$log.log("screen: ", screen);
					if(screen && screen===1){
						self.currentStep=2;
					}
				};
				
				
				
				/**
				 * Create a new Template
				 */
				self.createNewTemplate=function(){
					
					self.isAjax=true;
					$log.log("creating new template");
					self.resolveTemplate();
					self.resolveCreateOrUpdate();
					
					var templateUrl='';
					if(self.template.id){
						templateUrl=contextService.getUrl("updateTemplate");
					}else{
						templateUrl=contextService.getUrl("createTemplate");
					}
					
					$log.log("template: ", angular.toJson(self.template));
					
					ajaxService.post({
						url:templateUrl,
						data:angular.toJson(self.template),
						headers:{
							"Content-Type":"application/json"
						},
						success:function(data){
							$log.log("Success", data);
							if(data && data.responseSuccess){
								$rootScope.$broadcast("Notify",{
									message: data.responseSuccess,
									icon:"fa fa-cog",
									layout:"bar",
									effect:"exploader",
									type:"success"
								});
								self.template=data.result;
								self.getAllDataColumns(self.template.id);
								/**
								 * here i need to manage the existing list instead of calling server every time.
								 */
								/*if(self.templateList){
									self.templateList.push(self.template);
									self.getAllTemplatesBasedOnProjectId(self.selectedProject.projectId, false);
								}else{*/
									self.getAllTemplatesBasedOnProjectId(self.selectedProject.projectId, true);
								/*}		*/					
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
							
							self.isAjax=false;
							self.currentStep=3;
							$scope.$apply();
						},
						error:function(data){
							$log.log("error", data);
							self.isAjax=false;
							$rootScope.$broadcast("Notify",{
								message: "Error while creating new template, please try again!",
								icon:"fa fa-cog",
								layout:"bar",
								effect:"exploader",
								type:"error"
							});
							$scope.$apply();
						}
					});
				};
				
				/**
				 * Resolve template: add proper values into the template
				 */
				self.resolveTemplate=function(){
					self.template.project=self.selectedProject;
					self.template.columns=self.columns;
					self.template.headers=self.headerColumns;
					self.template.footers=self.footerColumns;
					self.template.body=self.columns;
				};
				
				
				
				/**
				 * @deprecated
				 * moving steps
				 */
				self.gotoStep=function(step){
					if(step && step>0 && step<4){
						self.currentStep=step	
					}
					
					if(step==3){
						self.initializeTemplateScreen();
					}
				};
				
				/**
				 * @deprecated
				 * initialize all the needed data's for step3
				 */
				self.initializeTemplateScreen=function(){
					
					/**
					 * loading all avilable templates
					 */
					self.getAllTemplatesBasedOnProjectId(self.selectedProject.projectId);
					//self.initializeTreeView();
				};
				
				/**
				 * Loading all templates based on project id
				 */
				self.getAllTemplatesBasedOnProjectId=function(id, wantToLoadFromServer){
					
					if(!wantToLoadFromServer){
						$rootScope.$broadcast("onProjectTemplates",{menus:self.templateList});
						$log.log("existing template is populated to the menu!");
						return;
					}
					
					$log.log("loading all templates based on project id!");
					var url=contextService.getUrl("getAllTemplates")+'?projectId='+id;
					ajaxService.get({
						url:url,
						success:function(data){
							$log.log("success: ", data);
							if(data && data.responseSuccess){
								self.templateList=angular.fromJson(data.result);
							}
							$rootScope.$broadcast("onProjectTemplates",{menus:self.templateList});
							$scope.$apply();
							//self.initializeTreeView();
							
						},
						error:function(data){
							$log.log("error: ", data);
						}
					});
					
				};
				
				/**@deprecated
				 * initialize tree view
				 */
				self.initializeTreeView=function(){
					$(function () {
					    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
					    $('.tree li.parent_li > span').on('click', function (e) {
					        var children = $(this).parent('li.parent_li').find(' > ul > li');
					        if (children.is(":visible")) {
					            children.hide('fast');
					            $(this).attr('title', 'Expand this branch').find(' > i').addClass('fa-plus-circle').removeClass('fa-minus-circle ');
					        } else {
					            children.show('fast');
					            $(this).attr('title', 'Collapse this branch').find(' > i').addClass('fa-minus-circle').removeClass('fa-plus-circle');
					        }
					        //e.stopPropagation();
					    });
					});
				};
				
				/**
				 * load templates when you click on the template
				 */
				self.loadTemplate=function(template){
					if(self.template && self.template.id===template.id){
						return;
					}
					self.template=template;
					self.columns=template.columns;
					self.getAllDataColumns(template.id);
					$log.log("template has been loaded!");
				};
				
				
				/**
				 * delete column event handler
				 */
				$rootScope.$on('onDeleteColumn',function(eve, col){
					$log.log("delete columns has been called: ",col);
					
					if(!col.id){
						self.removeDataColumn(col);
						return;
					}
					
					self.deleteColumn(function(data){
						if(data && data.responseSuccess){
							$log.log("data column has been deleted!");
							$rootScope.$broadcast("Notify",{
								message: "Data column has been deleted!",
								icon:"fa fa-cog",
								layout:"bar",
								effect:"exploader",
								type:"success"
							});
							self.removeDataColumn(col);
							$scope.$apply();
							self.createNewTemplate();
							return;
						}
						
						if(data && data.responseError){
							$log.log("unable to delete data column!");
							$rootScope.$broadcast("Notify",{
								message: "Error while deleting data column, please try again!",
								icon:"fa fa-cog",
								layout:"bar",
								effect:"exploader",
								type:"error"
							});
							return;
						}					
						$rootScope.$broadcast("Notify",{
							message: "Error while deleting data column, please try again!",
							icon:"fa fa-cog",
							layout:"bar",
							effect:"exploader",
							type:"error"
						});
						
						$log.log("unable to delete data column!");												
					}, col.id);
				});
				
				/**
				 * remove data columns from array
				 */
				self.removeDataColumn=function(data){
					
					var deletableId=-1;
					var colOrder=-1;
					
					if(data.rowPosition==self.rowPos.BODY){
						colOrder=data.colOrder;
						deletableId=self.headerColumns.indexOf(data);
						$log.log("BODY deletable index: ", deletableId);
						self.headerColumns.splice(deletableId,1);
						self.sortAndResolveColumns(self.headerColumns,colOrder);
					}
					
					if(data.rowPosition==self.rowPos.HEADER){
						colOrder=data.colOrder;
						deletableId=self.headerColumns.indexOf(data);
						$log.log("HEADER deletable index: ", deletableId);
						self.headerColumns.splice(deletableId,1);
						self.sortAndResolveColumns(self.headerColumns,colOrder);
					}
					
					if(data.rowPosition==self.rowPos.FOOTER){
						colOrder=data.colOrder;
						deletableId=self.footerColumns.indexOf(data);
						$log.log("FOOTER deletable index: ", deletableId);
						self.footerColumns.splice(deletableId,1);
						self.sortAndResolveColumns(self.footerColumns,colOrder);
					}
					
					/*if(data.rowPosition==self.rowPos.BODY){

						for(var idx in self.columns){
							$log.log("BODY delete comparison: ",self.columns[idx].id, " == ", data.id);
							if(self.columns[idx].id===data.id){
								deletableId=idx;
								colOrder=self.columns[idx].colOrder;
							}						
							if(colOrder!=-1 && (colOrder+1) == self.columns[idx].colOrder){
								var temp=colOrder;
								colOrder=self.columns[idx].colOrder;
								self.columns[idx].colOrder=temp;
							}
						}
						
						if(deletableId>-1){
							self.columns.splice(deletableId,1);
							return;
						}

					}		
					
					if(data.rowPosition==self.rowPos.HEADER){

						for(var idx in self.headerColumns){
							$log.log("HEADER delete comparison: ",self.headerColumns[idx].id, " == ", data.id);
							if(self.headerColumns[idx].id===data.id ){
								deletableId=idx;
								colOrder=self.headerColumns[idx].colOrder;
							}						
							if(colOrder!=-1 && (colOrder+1) == self.headerColumns[idx].colOrder){
								var temp=colOrder;
								colOrder=self.headerColumns[idx].colOrder;
								self.headerColumns[idx].colOrder=temp;
							}
						}
						
						if(deletableId>-1){
							self.headerColumns.splice(deletableId,1);
							return;
						}

					}
					
					if(data.rowPosition==self.rowPos.FOOTER){

						for(var idx in self.footerColumns){
							$log.log("FOOTER delete comparison: ",self.footerColumns[idx].id, " == ", data.id);
							$log.log("index of the footer column:",self.footerColumns.indexOf(data));
							if(self.footerColumns[idx].id===data.id || idx==self.footerColumns.indexOf(data)){
								deletableId=idx;
								colOrder=self.footerColumns[idx].colOrder;
							}						
							if(colOrder!=-1 && (colOrder+1) == self.footerColumns[idx].colOrder){
								var temp=colOrder;
								colOrder=self.footerColumns[idx].colOrder;
								self.footerColumns[idx].colOrder=temp;
							}
						}
						
						if(deletableId>-1){
							self.footerColumns.splice(deletableId,1);
							return;
						}

					}		*/

				};
				
				/**
				 * Resolve the column order after deletion
				 */
				self.sortAndResolveColumns=function(columns, deletedColOrder){
					for(var idx in columns){
						if(deletedColOrder<columns[idx].colOrder){
							columns[idx].colOrder-=1;
						}
					}
				};
				
				
				/**
				 * add more column into the current template
				 */
				self.addColumn=function(rowPosition){
					
					$log.log("adding column for row position:", rowPosition);
					
					if(!self.template){
						$rootScope.$broadcast("Notify",{
							message: "Please choose template to add column!",
							icon:"fa fa-cog",
							layout:"bar",
							effect:"exploader",
							type:"warning"
						});
						return;
					}
					
					var position=1;
					var headerPos=1;
					var footerPos=1;
					
					if(self.columns && self.columns.length){
						position=self.columns.length + 1;
					}else{
						self.columns=[];
					}
					
					if(self.headerColumns && self.headerColumns.length){
						headerPos=self.headerColumns.length + 1;
					}else{
						self.headerColumns=[];
					}
					
					if(self.footerColumns && self.footerColumns.length){
						footerPos=self.footerColumns.length + 1;
					}else{
						self.footerColumns=[];
					}
				
					
					if(rowPosition==self.rowPos.BODY){						
						self.columns.push({
							colOrder:position,
							columnName:"",
							columnType:0,
							rowPosition:self.rowPos.BODY
						});
					}
					
					if(rowPosition==self.rowPos.HEADER){
						self.headerColumns.push({
							colOrder:headerPos,
							columnName:"",
							columnType:0,
							rowPosition:self.rowPos.HEADER
						});
					}
					
					if(rowPosition==self.rowPos.FOOTER){
						self.footerColumns.push({
							colOrder:footerPos,
							columnName:"",
							columnType:0,
							rowPosition:self.rowPos.FOOTER
						});
					}
					$log.log("columns is added!");
				};
				
				
				/**
				 * on project change listener
				 */
				self.onProjectChange=function(){
					$log.log("Loading new project templates!");
					if(!self.selectedProject)
						return;
					
					self.getAllTemplatesBasedOnProjectId(self.selectedProject.projectId, true);
					self.template=null;
					self.columns=null;
				};
				
				/**
				 * create new template for selected project
				 */
				self.createNewEmptyTemplate=function(){
					/*self.closeModal();*/
					self.template={
							project:{},
							hasHeaderRows:false,
							hasFooterRows:false,
							headerRowsCount:0,
							footerRowsCount:0,
							isGlobal:false,
							fileType:'text',
							columns:[],
							createdBy:contextService.userData.userId,
							updatedBy:contextService.userData.userId,
							createdDate:new Date(),
							updatedDate:new Date()
					};
					self.columns=[];
					self.template.project=self.selectedProject;
					self.template.templateName="New Template";
				};
				
				
				/**
				 * load all data columns for the template
				 */
				self.getAllDataColumns=function(id){
					var url=contextService.getUrl("getAllDataColumns");
					ajaxService.get({
						url:url+"?templateId="+id,
						success:function(data){
							$log.log("Success: ",data);
							if(data && data.result){
								self.columns=data.result.body;
								self.headerColumns=data.result.headers;
								self.footerColumns=data.result.footers;
								$scope.$apply();
							};
						},
						error:function(data){
							$log.log("Error: ",data);
						}
					});
				};
				
				/**
				 * Delete Data column on server side
				 */
				self.deleteColumn=function(callBack, id){
					var url=contextService.getUrl("deleteDataColumn");
					ajaxService.get({
						url: url+'?templateColumnId='+id,
						success:function(data){
							$log.log("success!");
							callBack(data);
						},
						error:function(data){
							$log.log("error:", data);
							callBack(data);
						}
					});
				};
				
				/**
				 * Load template by templateId
				 */
				self.loadTemplateById=function(id){
					$log.log("loading template based on the templateId:", id);
					ajaxService.get({
						url:contextService.getUrl('getTemplateById')+"?templateId="+id,
						success:function(data){
							$log.log("success:", data);
							if(data && data.responseSuccess){
								self.loadTemplate(data.result);
								$scope.$apply();
							}
						},
						error:function(data){
							$log.log("error:", data);
						}
					});
				};
				
				/**
				 * initializing template
				 */
				self.init();

			} ]);

	return dashboardController;
});