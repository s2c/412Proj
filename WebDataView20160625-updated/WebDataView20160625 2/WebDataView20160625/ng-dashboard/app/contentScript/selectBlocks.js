var currentField = 0;
var data = [];
/*
for (var i = 0; i < fields.length; i++) {
	var row = {};
	for(var key in fields[i]) {
		row[key] = '';
	}
	data.push(row);
}
*/

if (typeof showBorderForDomSelection != 'function') {
	showBorderForDomSelection = function(event){
		event.preventDefault();
		if(event.target.selected != true) {
			event.target.style.border = '3px solid #FF0000';
		}
	}
}

if (typeof hideBorderForDomSelection != 'function') {
	hideBorderForDomSelection = function (event){    
		event.preventDefault();
		if(event.target.selected != true) {
		    event.target.style.border = '';
		}
	}
}

if (typeof showCurrentField != 'function') {
	var mouseLabel = document.createElement('span');
    mouseLabel.innerHTML = fields[currentField].name;
    mouseLabel.style.color = 'white';
    mouseLabel.style.background = 'black';
    mouseLabel.style.position = "absolute";
	mouseLabel.style.top = '-100px';
	mouseLabel.style.left = '=100px';
	mouseLabel.style.padding = '5px';

	document.body.appendChild(mouseLabel);

	showCurrentField = function (event){    
		event.preventDefault();
		mouseLabel.style.top = event.pageY - 5 + 'px';
		mouseLabel.style.left = event.pageX + 5 + 'px';
		
		
	}
}

if (typeof selectDomElement != 'function') {
	var selectionOrder = 1;
	var firstXPath = '';
	selectDomElement = function (event){    
		event.preventDefault();

		if(currentField < fields.length) {
			if(selectionOrder == 1) {
		    	event.target.style.border = '3px solid blue';
			    event.target.selected = true;

			    var fieldLabel = document.createElement('span');
			    fieldLabel.innerHTML = fields[currentField].name;
			    fieldLabel.style.color = 'white';
			    fieldLabel.style.background = 'black';
			    fieldLabel.style.position = "absolute";
				fieldLabel.style.top = event.pageY - 5 + 'px';
				fieldLabel.style.left = event.pageX + 5 + 'px';
				fieldLabel.style.padding = '5px';

			    document.body.appendChild(fieldLabel);

			    firstXPath = getPathTo(event.target);//.split("/");
			    console.log('first' + getPathTo(event.target));
			    selectionOrder++;
	    	}
	    	else {
	    		var secondXPath = getPathTo(event.target);//.split("/");

	    		
	    		console.log('second' + getPathTo(event.target));
				/*var parent = '';
				var i = 1;
				firstXPath.shift();
				while((element = firstXPath.shift()) == secondXPath[i]) {
					parent = parent + '/' + element;
					i++;
				}


				var currentNode = element.substr(0, element.indexOf('['));
				//element.substr(element.indexOf('['), element.indexOf(']'));

				// to do: check if same children
				var child = '';
				while(element = firstXPath.shift()) {
					child = child + '/' + element;
				}
				*/
				var parent = '';
				var child = '';
				var i = 0;
				while(firstXPath[i] == secondXPath[i]) {
					parent = parent + firstXPath[i];
					i++;
				}
				i++;
				while(i < firstXPath.length) {
					child = child + firstXPath[i];
					i++;
				}
				console.log(parent);
				console.log(child);
				var k = 1;
				//while((node = document.evaluate(parent + '/' + currentNode + '[' + k + ']' + child, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) != null)
				while((node = document.evaluate(parent + k + child, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) != null)
				{
					if(data.length < k) {
						row = {};
						row[fields[currentField].name] = node.innerText;
						data.push(row);
					}
					else {
						data[k -1][fields[currentField].name] = node.innerText;
					}
				  	k++;
				}

	    		currentField++;

	    		if(currentField == fields.length) {
					document.removeEventListener('mouseover', showBorderForDomSelection);
					document.removeEventListener('mouseout', hideBorderForDomSelection);
					document.removeEventListener('mousemove', showCurrentField);
					document.removeEventListener('click', selectDomElement);

					document.body.removeChild(mouseLabel);
					event.target.style.border = 'none';

					var strout = JSON.stringify(data);
						filename = 'extracted_data.json';
						var blob = new Blob([strout], {type: "text/json;charset=utf-8"});
						saveAs(blob, filename);
					}
				else {
					mouseLabel.innerHTML = fields[currentField].name;
					
					firstXPath = '';
					selectionOrder = 1;
				}
	    	}
		}
	}
}


document.addEventListener('mouseover', showBorderForDomSelection);
document.addEventListener('mouseout', hideBorderForDomSelection);
document.addEventListener('mousemove', showCurrentField);
document.addEventListener('click', selectDomElement);

//code from: http://stackoverflow.com/questions/2631820/im-storing-click-coordinates-in-my-db-and-then-reloading-them-later-and-showing/2631931#2631931
function getPathTo(element) {
    if (element.id!=='')
        return "//*[@id='"+element.id+"']";
    
    if (element===document.body)
        return element.tagName.toLowerCase();

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        
        if (sibling===element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        
        if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}


/*
USING DOM AND VIPS
var currentField = 0;
var data = [];
for (var i = 0; i < fields.length; i++) {
	var row = {};
	for(var key in fields[i]) {
		row[key] = '';
	}
}

var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();
root = vips.getVisualBlockTree();

for (var i = 0; i < globalBlocks.length; i++) {
	globalBlocks[i]['-att-box'].vips_block = true;
	
	var cur = root.first(function (node) {
	    return node.model.data['-vips-id'] === globalBlocks[i]['-vips-id'];
	});
	var siblings = root.all(function (node) {
	    return node.parent === cur.parent;
	});

	globalBlocks[i]['-att-box'].siblings = siblings;
}

if (typeof showBorderForDomSelection != 'function') {
	showBorderForDomSelection = function(event){
		event.preventDefault();
		if(event.target.selected != true && event.target.vips_block == true) {
			event.target.style.border = '2px solid #FF0000';
		}
	}
}

if (typeof hideBorderForDomSelection != 'function') {
	hideBorderForDomSelection = function (event){    
		event.preventDefault();
		if(event.target.selected != true) {
		    event.target.style.border = '';
		}
	}
}

if (typeof selectDomElement != 'function') {
	selectDomElement = function (event){    
		event.preventDefault();

		
		if(currentField < fields.length && event.target.vips_block == true) {
	    	event.target.style.border = '4px solid blue';
		    event.target.selected = true;

		    var label = document.createElement('span');
		    label.innerHTML = fields[currentField].name;
		    label.style.color = 'white';
		    label.style.background = 'black';
		    label.style.position = "absolute";
			label.style.top = event.pageY - 5 + 'px';
			label.style.left = event.pageX + 'px';
			label.style.padding = '5px';

		    document.body.appendChild(label);

    		currentField++;

    		for(var i = 0; i < event.target.siblings.length; i++) {
    			event.target.siblings[i].model.data['-att-box'].style.border = '2px solid green';
    		}
    		
		}

		if(currentField == fields.length) {
			document.removeEventListener('mouseover', showBorderForDomSelection);
			document.removeEventListener('mouseout', hideBorderForDomSelection);
			document.removeEventListener('click', selectDomElement);
		}
	}
}

document.addEventListener('mouseover', showBorderForDomSelection);
document.addEventListener('mouseout', hideBorderForDomSelection);
document.addEventListener('click', selectDomElement);
*/

/*
USING VIPS ONLY
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();
root = vips.getVisualBlockTree();

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
	box.selected = false;

	box.addEventListener('click', function(e){
		e.preventDefault();
		currentField++;
		console.log(currentField);
		if(currentField < fields.length) {
			var siblings = this.siblings;
			for (var k = 0; k < siblings.length; k++) {
				if(this.className == siblings[k].model.data['-att-className']) {
					siblings[k].model.data['-att-box'].style.border = '4px solid blue';
				}
			}
		}
		else {
			for (var i = 0; i < globalBlocks.length; i++) {
				var box = globalBlocks[i]['-att-box'];
				if (box.selected == false) {
					box.style.border = 'none';
				}
			}
		}
	});
}
*/