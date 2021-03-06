define([ "angular", "app", "services/context-service" ], function(angular, app) {

	var menubarController = app.controller("MenuBarController", [ "$log",
			"$scope","$timeout","ContextService", "$rootScope", function($log, $scope, $timeout, contextService, $rootScope) {
		var self = $scope;
		
		self.menus=[];
		
		self.init=function(){
			$log.log("loading menubar controller!");
			self.loadMenus();
		};
		
		self.loadMenus=function(){
			contextService.getMenus(function(data){
				$log.log("menus are loaded!");
				self.menus=data;
				self.initializeNavBar();	
			});			
		};
		
		self.logout=function(){
			$rootScope.$broadcast("doLogout");
		};
		
		self.hasRole=function(nav){
			if(nav.hasRole){
				return contextService.hasRole(nav.hasRole);
			}
			else{
				return true;
			}				
		};
		
		
		/**
		 * Add templates names under the menu
		 */
		$rootScope.$on("onProjectTemplates",function(event, data){
			$log.log("on project template events:", data);
			var submenus=[];
			
			if(data && data.menus){
				submenus.push({
						submenu:"New Template",
						href:"#/template/0",
						icon:"fa fa-file"
					});
				for(var idx in data.menus){
					var obj={
						submenu:data.menus[idx].templateName,
						href:"#/template/"+data.menus[idx].id
					}
					submenus.push(obj);
				}
			}				
			var hasTemplates=false;
			if(self.menus && self.menus.length>0){
				for(var idx in self.menus){
					if(self.menus[idx].label && self.menus[idx].label=="Templates"){
						var menu={
								"menu":"Template Management",
								"label":"Templates",
								"hasRole":"M_ADMIN,P_ADMIN,USER",
								"href":"",
								"icon":"fa fa-cubes",
								"submenus":submenus
							};
						self.menus[idx]=(menu);
						hasTemplates=true;
						break;					
					}					
				}				
			}
			
			if(!hasTemplates){
				var menu={
						"menu":"Template Management",
						"label":"Templates",
						"hasRole":"M_ADMIN,P_ADMIN,USER",
						"href":"",
						"icon":"fa fa-cubes",
						"submenus":submenus
					};
					self.menus.push(menu);
			}
			
			$log.log("result:", self.menus);
			
		});
		
		self.initializeNavBar=function(){
			$timeout(function() {
				
				console.log("navbar functionalities has been initialized!");
				
				$timeout(function() {
					$('#content-wrapper > .row').css({
						opacity : 1
					});
				}, 200);

				$('#sidebar-nav,#nav-col-submenu').on('click', '.dropdown-toggle',
						function(e) {
							e.preventDefault();

							var $item = $(this).parent();

							if (!$item.hasClass('open')) {
								$item.parent().find('.open .submenu').slideUp('fast');
								$item.parent().find('.open').toggleClass('open');
							}

							$item.toggleClass('open');

							if ($item.hasClass('open')) {
								$item.children('.submenu').slideDown('fast');
							} else {
								$item.children('.submenu').slideUp('fast');
							}
						});

				$('body').on(
						'mouseenter',
						'#page-wrapper.nav-small #sidebar-nav .dropdown-toggle',
						function(e) {
							if ($(document).width() >= 992) {
								var $item = $(this).parent();

								if ($('body').hasClass('fixed-leftmenu')) {
									var topPosition = $item.position().top;

									if ((topPosition + 4 * $(this).outerHeight()) >= $(
											window).height()) {
										topPosition -= 6 * $(this).outerHeight();
									}

									$('#nav-col-submenu').html(
											$item.children('.submenu').clone());
									$('#nav-col-submenu > .submenu').css({
										'top' : topPosition
									});
								}

								$item.addClass('open');
								$item.children('.submenu').slideDown('fast');
							}
						});

				$('body').on('mouseleave',
						'#page-wrapper.nav-small #sidebar-nav > .nav-pills > li',
						function(e) {
							if ($(document).width() >= 992) {
								var $item = $(this);

								if ($item.hasClass('open')) {
									$item.find('.open .submenu').slideUp('fast');
									$item.find('.open').removeClass('open');
									$item.children('.submenu').slideUp('fast');
								}

								$item.removeClass('open');
							}
						});
				$('body').on('mouseenter',
						'#page-wrapper.nav-small #sidebar-nav a:not(.dropdown-toggle)',
						function(e) {
							if ($('body').hasClass('fixed-leftmenu')) {
								$('#nav-col-submenu').html('');
							}
						});
				$('body').on('mouseleave', '#page-wrapper.nav-small #nav-col',
						function(e) {
							if ($('body').hasClass('fixed-leftmenu')) {
								$('#nav-col-submenu').html('');
							}
						});

				$('#make-small-nav').click(function(e) {
					$('#page-wrapper').toggleClass('nav-small');
				});

				$(window).smartresize(function() {
					if ($(document).width() <= 991) {
						$('#page-wrapper').removeClass('nav-small');
					}
				});

				$('.mobile-search').click(function(e) {
					e.preventDefault();

					$('.mobile-search').addClass('active');
					$('.mobile-search form input.form-control').focus();
				});
				$(document).mouseup(function(e) {
					var container = $('.mobile-search');

					if (!container.is(e.target) // if the target of the click isn't the
												// container...
							&& container.has(e.target).length === 0) // ... nor a
																		// descendant of
																		// the container
					{
						container.removeClass('active');
					}
				});

				$('.fixed-leftmenu #col-left').nanoScroller({
					alwaysVisible : false,
					iOSNativeScrolling : false,
					preventPageScrolling : true,
					contentClass : 'col-left-nano-content'
				});

				// build all tooltips from data-attributes
				$("[data-toggle='tooltip']").each(function(index, el) {
					$(el).tooltip({
						placement : $(this).data("placement") || 'top'
					});
				});
			}, 2000);
		};
		
		self.init();
				
	} ]);

	return menubarController;

});