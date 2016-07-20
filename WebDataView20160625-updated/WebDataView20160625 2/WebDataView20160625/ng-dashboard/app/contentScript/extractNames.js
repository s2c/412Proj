console.log("Extracting names...");
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();
root = vips.getVisualBlockTree();
alert("Click a block containing the names");
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
		var ss = this.siblings;
		//console.log("You have just clicked on a block with vips-id " + this.title);
		//console.log("Here is the list of its siblings in the visual block tree:")
		if(names.length == 0) {
			for (var k = 0; k < ss.length; k++) {
				if(this.className == ss[k].model.data['-att-className']) {
					console.log(ss[k].model.data['-att-innerText']);
					if(ss[k].model.data['-att-innerText'].indexOf(";") != -1) {
						names.push(ss[k].model.data['-att-innerText'].split(";"));
					}
					else {
						names.push(ss[k].model.data['-att-innerText'].split(","));
					}
					
				}
			}
			console.log(names);
			this.style.border = "4px solid blue";
			alert("Click a block containing the titles");
		}
		else {
			data = [];
			titles = [];
			for (var k = 0; k < ss.length; k++) {
				if(this.className == ss[k].model.data['-att-className']) {
					console.log(ss[k].model.data['-att-innerText']);
					titles.push(ss[k].model.data['-att-innerText']);
					
				}
			}
			for (var k = 0; k < titles.length; k++) {
				data.push({
					'authors' : names[k],
					'title' : titles[k]
				 });
			}


			for (var i = 0; i < globalBlocks.length; i++) {
				var box = globalBlocks[i]['-att-box'];
				box.style.border = "none"; 
			}

			var strout = JSON.stringify(data);
			filename = 'vips_names.json';
			var blob = new Blob([strout], {type: "text/json;charset=utf-8"});
			saveAs(blob, filename);
			names = [];
		}
	});
}