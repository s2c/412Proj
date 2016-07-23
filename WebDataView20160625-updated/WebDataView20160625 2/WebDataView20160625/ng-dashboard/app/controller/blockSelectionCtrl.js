'use strict';

var app = angular.module('app')
app.controller('blockSelectionCtrl', function ($scope, $rootScope, $window) {
	chrome.tabs.executeScript(null, {file: "lib/TreeModel.js"});
	chrome.tabs.executeScript(null, {file: "app/contentScript/vips.js"});

	var init = function() {
		$scope.fields = [];
    };
    init();

    $scope.displayFields = function() {
    	$scope.fields = [];
    	for(var i = 0 ; i < $scope.total_fields; i++) {
    		$scope.fields.push({
    			name: '',
    			type: 0
    		});
    	}

    	angular.element('#field_form').show();
	};

	$scope.reset = function() {
		$scope.fields = [];
	}

	$scope.selectBlocks = function() {
		chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"}, function() {
	    	chrome.tabs.executeScript(null, {
	    		code: 'var fields = ' + JSON.stringify($scope.fields)
			}, function() {
				chrome.tabs.executeScript(null, {file: "app/contentScript/selectBlocks.js"});
			});
		});
	};
});