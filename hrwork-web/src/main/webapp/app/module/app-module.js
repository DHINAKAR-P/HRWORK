define([ "angular", "angularRoute" ], function(angular, angularRoute) {
	var app = angular.module("HrWork", [ "ngRoute", "ngCookies","naif.base64"]);
	return app;
});