require
		.config({

			paths : {
				"angular" : "../lib/angular/angular.min",
				"angularRoute" : "../lib/angular/angular-route.min",
				"app" : "module/app-module",
				"init" : "controllers/app",

				/* theme related scripts */
				"jquery" : "../lib/theme/js/jquery",
				"bootstrap" : "../lib/theme/js/bootstrap.min",
				"datePicker" : "../lib/app/js/angular-datepicker",
				"pace" : "../lib/theme/js/pace.min",
				"scripts" : "../lib/theme/js/scripts",
				"nanoscroller" : "../lib/theme/js/jquery.nanoscroller.min",
				"bootstrap-datepicker" : "../lib/theme/js/bootstrap-datepicker",
				"bootstrap-timepicker" : "../lib/theme/js/bootstrap-timepicker.min",
				"bootstrap-wizard" : "../lib/theme/js/bootstrap-wizard.min",
				"d3" : "../lib/theme/js/d3.min",
				"daterange-picker" : "../lib/theme/js/daterangepicker",
				"fullcalendar" : "../lib/theme/js/fullcalendar.min",
				"animateOnScroll" : "../lib/theme/js/AnimOnScroll",
				"bootstrapEditable" : "../lib/theme/js/bootstrap-editable.min",
				"bootstrapWysiwyg" : "../lib/theme/js/bootstrap-wysiwyg",
				"classie" : "../lib/theme/js/classie",
				"dataTablesFixedHeader" : "../lib/theme/js/dataTables.fixedHeader",
				"dataTablesTools" : "../lib/theme/js/dataTables.tableTools.min",
				"dropzone" : "../lib/theme/js/dropzone",
				"dygraph" : "../lib/theme/js/dygraph.min",
				"dygraphData" : "../lib/theme/js/dygraph-data",
				"dygraphInteraction" : "../lib/theme/js/dygraph-interaction",
				"gdpData" : "../lib/theme/js/gdp-data",
				"hogan" : "../lib/theme/js/hogan",
				"hopscotch" : "../lib/theme/js/hopscotch.min",
				"eventEmitter" : "../lib/theme/js/imagesloaded",
				"jqueryCountTo" : "../lib/theme/js/jquery.countTo",
				"jqueryDataTablesBootstrap" : "../lib/theme/js/jquery.dataTables.bootstrap",
				"datatables" : "../lib/theme/js/jquery.dataTables.min",
				"jqueryEasyPieChart" : "../lib/theme/js/jquery.easypiechart.min",
				"jqueryGridALicious" : "../lib/theme/js/jquery.grid-a-licious.min",
				"jqueryHotKeys" : "../lib/theme/js/jquery.hotkeys",
				"jqueryKnob" : "../lib/theme/js/jquery.knob",
				"jqueryMagnificPopup" : "../lib/theme/js/jquery.magnific-popup.min",
				"jqueryMaskedInput" : "../lib/theme/js/jquery.maskedinput.min",
				"jqueryNestable" : "../lib/theme/js/jquery.nestable",
				"jquery.nouislider" : "../lib/theme/js/jquery.nouislider.min",
				"jqueryPwstrength" : "../lib/theme/js/jquery.pwstrength",
				"jquerySlimScroll" : "../lib/theme/js/jquery.slimscroll.min",
				"jquerySparkline" : "../lib/theme/js/jquery.sparkline.min",
				"jqueryJvectorMap" : "../lib/theme/js/jquery-jvectormap-1.2.2.min",
				"jqueryJVectorMapWorld" : "../lib/theme/js/jquery-jvectormap-world-merc-en",
				"jqueryUI" : "../lib/theme/js/jquery-ui.custom.min",
				"masonryPkged" : "../lib/theme/js/masonry.pkgd.min",
				"modalEffects" : "../lib/theme/js/modalEffects",
				"modernizrCustom" : "../lib/theme/js/modernizr.custom",
				"moment" : "../lib/theme/js/moment.min",
				"morris" : "../lib/theme/js/morris.min",
				"notification" : "../lib/theme/js/notificationFx",
				"rainbow" : "../lib/theme/js/rainbow.min",
				"raphael" : "../lib/theme/js/raphael-min",
				"respond" : "../lib/theme/js/respond.min",
				"screenfull" : "../lib/theme/js/screenfull",
				"select2" : "../lib/theme/js/select2.min",
				"skycons" : "../lib/theme/js/skycons",
				"snapSvg" : "../lib/theme/js/snap.svg-min",
				"summernote" : "../lib/theme/js/summernote.min",
				"timeline" : "../lib/theme/js/timeline",
				"typeahead" : "../lib/theme/js/typeahead.min",
				"wizard" : "../lib/theme/js/wizard",
				"xcharts" : "../lib/theme/js/xcharts.min",
				"skinchanger" : "../lib/theme/js/demo-skin-changer",
				"uibootstrap" : "../lib/theme/js/ui-bootstrap",

				/* jquery flot libs */
				"excanvas" : "../lib/theme/js/flot/excanvas.min",
				"jqueryFlotAxislabels" : "../lib/theme/js/flot/jquery.flot.axislabels",
				"jqueryFlotCanvas" : "../lib/theme/js/flot/jquery.flot.canvas.min",
				"jqueryFlotCategories" : "../lib/theme/js/flot/jquery.flot.categories.min",
				"jqueryFlorCrosshair" : "../lib/theme/js/flot/jquery.flot.crosshair.min",
				"jqueryFlotErrorBars" : "../lib/theme/js/flot/jquery.flot.errorbars.min",
				"jqueryFlotFillbetween" : "../lib/theme/js/flot/jquery.flot.fillbetween.min",
				"jqueryFlotImage" : "../lib/theme/js/flot/jquery.flot.image.min",
				"jqueryFlot" : "../lib/theme/js/flot/jquery.flot.min",
				"jqueryFlotNavigate" : "../lib/theme/js/flot/jquery.flot.navigate.min",
				"jqueryFlotOrderBars" : "../lib/theme/js/flot/jquery.flot.orderBars",
				"jqueryFlotPie" : "../lib/theme/js/flot/jquery.flot.pie.min",
				"jqueryFlotResize" : "../lib/theme/js/flot/jquery.flot.resize.min",
				"jqueryFlotSelection" : "../lib/theme/js/flot/jquery.flot.selection.min",
				"jqueryFlotStack" : "../lib/theme/js/flot/jquery.flot.stack.min",
				"jqueryFlotSymbol" : "../lib/theme/js/flot/jquery.flot.symbol.min",
				"jqueryFlotThreshold" : "../lib/theme/js/flot/jquery.flot.threshold.min",
				"jqueryFlotTime" : "../lib/theme/js/flot/jquery.flot.time.min",
			},
			shim : {
				"angular" : {
					exports : "angular"
				},
				"jquery" : {
					exports : "jQuery"
				},
				"angularRoute" : {
					deps : [ "angular" ]
				},
				"bootstrap" : {
					deps : [ "jquery" ]
				},
				"jquery" : {
					exports : "jQuery"
				},
				"datePicker" : {
					deps : [ "angular" ]
				},
				"nanoscroller" : {
					deps : [ "jquery" ]
				},
				"scripts" : {
					deps : [ "jquery", "nanoscroller" ]
				},
				"bootstrap-datepicker" : {
					deps : [ "bootstrap" ]
				},
				"bootstrap-timepicker" : {
					deps : [ "bootstrap" ]
				},
				"bootstrap-wizard" : {
					deps : [ "bootstrap" ]
				},
				"daterange-picker" : {
					deps : [ "jquery" ]
				},
				"fullcalendar" : {
					deps : [ "jquery" ]
				},
				"bootstrapEditable" : {
					deps : [ "bootstrap" ]
				},
				"bootstrapWysiwyg" : {
					deps : [ "bootstrap" ]
				},
				"jqueryCountTo" : {
					deps : [ "jquery" ]
				},
				"jqueryDataTablesBootstrap" : {
					deps : [ "jquery", "bootstrap" ]
				},
				"datatables" : {
					deps : [ "jquery" ]
				},
				"jqueryEasyPieChart" : {
					deps : [ "jquery" ]
				},
				"jqueryGridALicious" : {
					deps : [ "jquery" ]
				},
				"jqueryHotKeys" : {
					deps : [ "jquery" ]
				},
				"jqueryKnob" : {
					deps : [ "jquery" ]
				},
				"jqueryMagnificPopup" : {
					deps : [ "jquery" ]
				},
				"jqueryMaskedInput" : {
					deps : [ "jquery" ]
				},
				"jqueryNestable" : {
					deps : [ "jquery" ]
				},
				"jquery.nouislider" : {
					deps : [ "jquery" ]
				},
				"jqueryPwstrength" : {
					deps : [ "jquery" ]
				},
				"jquerySlimScroll" : {
					deps : [ "jquery" ]
				},
				"jquerySparkline" : {
					deps : [ "jquery" ]
				},
				"jqueryJvectorMap" : {
					deps : [ "jquery" ]
				},
				"jqueryJVectorMapWorld" : {
					deps : [ "jquery" ]
				},
				"jqueryUI" : {
					deps : [ "jquery" ]
				},
				"timeline" : {
					deps : [ "jquery" ]
				},
				"typeahead" : {
					deps : [ "jquery" ]
				},
				"wizard" : {
					deps : [ "jquery" ]
				},
				"morris" : {
					deps : [ "jquery" ]
				},
				"classie" : {
					exports : "classie"
				},
				"modernizrCustom" : {
					exports : "Modernizr"
				},
				"notification" : {
					deps : [ "modernizrCustom" ]
				},
				"masonryPkged" : {
					deps : [ "jquery" ]
				},
				"select2" : {
					deps : [ "jquery" ]
				},
				"eventEmitter" : {
					exports : "eventEmitter"
				},
				"skinchanger" : {
					deps : [ "jquery", "bootstrap" ]
				},
				"jqueryFlotAxislabels" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotCanvas" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotCategories" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlorCrosshair" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotErrorBars" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotFillbetween" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotImage" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlot" : {
					deps : [ "jquery" ]
				},
				"jqueryFlotNavigate" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotOrderBars" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotPie" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotResize" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotSelection" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotStack" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotSymbol" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotThreshold" : {
					deps : [ "jquery", "jqueryFlot" ]
				},
				"jqueryFlotTime" : {
					deps : [ "jquery", "jqueryFlot" ]
				}
			},
			deps : [ "init", "jquery", "bootstrap", "pace", "scripts",
					"nanoscroller", "bootstrap-datepicker",
					"bootstrap-timepicker", "bootstrap-wizard",
					"daterange-picker", "fullcalendar", "select2",
					"jqueryMaskedInput", "notification","classie", "modernizrCustom", "modalEffects" ]

		});