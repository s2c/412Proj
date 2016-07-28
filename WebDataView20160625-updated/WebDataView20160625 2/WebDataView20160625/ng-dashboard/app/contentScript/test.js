var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();
root = vips.getVisualBlockTree();

patterns = [];
matrix = new Array(globalBlocks.length);
for (var i = 0; i < globalBlocks.length; i++) {
  matrix[i] = new Array(globalBlocks.length);
}

for (var i = 0; i < globalBlocks.length; i++) {
	for (var j = i + 1; j < globalBlocks.length; j++) {
		matrix[i][j] = {}
		if(globalBlocks[i]['-att-box']['className'] != "" && 
			globalBlocks[i]['-att-box']['className'] == globalBlocks[j]['-att-box']['className']) {
			matrix[i][j]['class'] = 0;
		}
		else {
			matrix[i][j]['class'] = 1;
		}
		matrix[i][j]['vips-id'] = levDist(globalBlocks[i]['-vips-id'], globalBlocks[j]['-vips-id']);
		matrix[i][j]['xpath'] = levDist(getPathTo(globalBlocks[i]['-att-box']), 
			getPathTo(globalBlocks[j]['-att-box']));
		matrix[i][j]['i'] = globalBlocks[i]['-att-box'];
		matrix[i][j]['j'] = globalBlocks[j]['-att-box'];
	}
	if(globalBlocks[i]['-att-box'].pattern_index == undefined) {
		globalBlocks[i]['-att-box'].pattern_index = patterns.length;

		var cluster = [];
		cluster.push(globalBlocks[i]['-att-box']);
		for (var j = i + 1; j < globalBlocks.length; j++) {
			if(matrix[i][j]['class'] == 0){
				globalBlocks[j]['-att-box'].pattern_index = patterns.length;
				cluster.push(globalBlocks[j]['-att-box']);
			}
		}
		patterns.push(cluster);
	}			
}

console.log(patterns);
for (var i = 0; i < globalBlocks.length; i++) {
	var box = globalBlocks[i]['-att-box'];
	box.addEventListener('mouseover', function(e) {
		e.preventDefault();
		this.style.border = "2px solid #FF0000";
		for (var k = 0; k < patterns[this.pattern_index].length; k++) {
			console.log('here');
			patterns[this.pattern_index][k].style.border = "2px solid #FF0000"; 
		}
	});
	box.addEventListener('mouseout', function(e){
		for (var k= 0; k < globalBlocks.length; k++) {
			var box = globalBlocks[k]['-att-box'];
			box.style.border = 'none'; 
		}
	});
}
/*
for (var i = 0; i < globalBlocks.length; i++) {
	var box = globalBlocks[i]['-att-box'];
	//box.style.border = "2px solid #FF0000"; 
	box.title = globalBlocks[i]['-vips-id'];
	console.log(box.title);
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
	for(var j = 0; j < box.title.length; j = j + 2) {
		var key = box.title;
		key[j] = 'X';
		if(patterns[key] == undefined) {
			patterns[key] = [];
		}
		patterns[key].push(box);
	}
/*
	if(box.pattern_index == undefined) {
		xpath = getPathTo(box);
		vips_blocks = [];
		for(var j = 0; j < box.siblings.length; j++) {
			if(box['className'] == box.siblings[j].model.data['-att-box'].className) {
				box.siblings[j].model.data['-att-box'].pattern_index = patterns.length;
				vips_blocks.push(box.siblings[j].model.data['-att-box']);
			}
			else if(levDist(xpath, getPathTo(box.siblings[j].model.data['-att-box'])) < 5) {
				box.siblings[j].model.data['-att-box'].pattern_index = patterns.length;
				vips_blocks.push(box.siblings[j].model.data['-att-box']);
			}
		}
		patterns.push(vips_blocks);
	}

	box.addEventListener('mouseover', function(e) {
		e.preventDefault();
		this.style.border = "2px solid #FF0000";
		for (var k = 0; k < patterns[this.pattern_index]; k++) {
			patterns[this.pattern_index][k].style.border = "2px solid #FF0000"; 
		}
	/*	currentField++;
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
		}*/
//	});
/*
	box.addEventListener('mouseout', function(e){
		for (var k= 0; k < globalBlocks.length; k++) {
			var box = globalBlocks[k]['-att-box'];
			box.style.border = 'none'; 
		}
	});*/
//}

//console.log(patterns);

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

//http://stackoverflow.com/questions/11919065/sort-an-array-by-the-levenshtein-distance-with-best-performance-in-javascript
function levDist(s, t) {
    var d = []; //2d matrix

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    //Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4
        for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
}