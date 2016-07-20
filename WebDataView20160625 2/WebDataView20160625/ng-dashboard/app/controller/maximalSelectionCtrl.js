'use strict';

angular.module('app').controller('maximalSelectionCtrl', function ($scope) {

	$scope.init = function(){
		$('#select').hide();
    };

    $scope.displayFields = function() {
    	$("#canvas").append('<p>Enter field names:</p>');
		for(var i = 0 ; i < $scope.fields; i++) {
			$("#canvas").append('<p><input id="fields" type="text" ng-model="field_name" />'  + 
				'<select>' +
					'<option value="0">Field type (Optional)</option>' + 
					'<option value="1">Text</option>' + 
					'<option value="2">Number</option>' +
				'</select>' + 
				'</p>');
		}
		$('#select').show();
	}

	$scope.selectBlock = function() {
		//alert("Click a block containing the titles");
		var vips = new VipsAPI();
		globalBlocks = vips.getVisualBlockList();
		root = vips.getVisualBlockTree();
		var names = [];
		for (var i = 0; i < globalBlocks.length; i++) {
			var box = globalBlocks[i]['-att-box'];
			box.style.border = "2px solid #FF0000"; 
			box.title = globalBlocks[i]['-vips-id'];
			var cur = root.first(function (node) {
			    return node.model.data['-vips-id'] === globalBlocks[i]['-vips-id'];
			});
			// root.first() is a function of TreeModel. You can see the tutorial about TreeModel here: 
			// http://jnuno.com/tree-model-js/
			var siblings = root.all(function (node) {
			    return node.parent === cur.parent;
			});
			// root.all() is also a function of TreeModel.
			box.siblings = siblings;
			box.className = cur.model.data['-att-className'];
			box.addEventListener('click', function(e){
				e.preventDefault();
			});
		}
	};
    
	/**$scope.activateDomSelection = function() {
		chrome.tabs.executeScript(null, {file: "app/contentScript/activateDomSelection.js"});
	}
	
	$scope.deactivateDomSelection = function() {
		chrome.tabs.executeScript(null, {file: "app/contentScript/deactivateDomSelection.js"});
	}*/
    
});