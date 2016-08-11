define([ "angular", "app" ], function(angular, app) {

	var ajaxService = app.service("AjaxService", [ "$log", "$http",
			function($log, $http) {

				var self = this;

				/**
				 * Post method to post data's to the server and get back the
				 * response
				 */
				self.post = function(config) {

					$log.log('post is called!');
					$log.log("config object: ", config);

					self.config = {
						success : config.success,
						error : config.error,
						url : config.url,
						onBefore : config.onBefore || null,
						headers : config.headers || '',
						data : config.data || ''
					};

					if (self.config.onBefore != null) {
						self.config.onBefore();
					}

					$.ajax({
						url : self.config.url,
						type : "POST",
						dataType : "JSON",
						data : self.config.data,
						headers : self.config.headers || '',
						success : self.config.success,
						fail : self.config.error
					});
				};

				/**
				 * Get method is to get some data's from server based on the
				 * request input
				 */
				self.get = function(config) {

					$log.log('get is called!');

					$log.log("config object: ", config);

					self.config = {
						success : config.success,
						error : config.error,
						url : config.url,
						onBefore : config.onBefore || null,
						headers : config.headers || ''
					};

					if (self.config.onBefore != null) {
						self.config.onBefore();
					}

					$.ajax({
						url : self.config.url,
						type : "GET",
						dataType : "JSON",
						headers : self.config.headers || '',
						success : self.config.success,
						fail : self.config.error
					});
				};

			} ]);
	return ajaxService;
});