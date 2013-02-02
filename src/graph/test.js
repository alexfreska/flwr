/*test.js
*
*	Tests that can be run on data set by a template
*	to catch unsupported relationships.
*					
*
*/
$(function() {

//json file from constructor
var jsonChart;

var title = []; 
var nodes = []; 
var arrows = [];

/******************************
*	Temporary JSON Retrieval
*
******************************/
$.ajax({
	//url: 'chart2.json',
	url: 'badchart.json',
	async: false,
	dataType: 'json',
	success: function(data) {
		title = data.title;
		nodes = data.nodes;
		arrows = data.arrows;
	}
});//close ajax

var initializePrePost = function ( ) {
	_.each(nodes, function(node) {
		node.pre = -1;
		node.post = -1;
	});
}


var nodeOfId = function (id) {
	var node = _.find(nodes, function (node) {
		return node.id == id;
	});
	return node;
}

//Is it formatted correctly at all?
var isFormatted = function ( ) {

	var isGood = 1;
	if(typeof title === undefined || typeof nodes === undefined || typeof arrows === undefined) {
		console.log("Missing element!");
		isGood = 0;
	}

	_.each(nodes, function (node) {
		if(typeof node.id === undefined || typeof node.data === undefined || node.type === undefined) {
			console.log("Node missing element.");
			isGood = 0;
		}
	});

	_.each(arrows, function (arrow) {
		if(typeof arrow.to === undefined || typeof arrow.from === undefined) {
			console.log("Arrow missing element.")
			isGood = 0;
		}
	});
	if(isGood) console.log("Data is Good.");
	return isGood;
}
isFormatted();

var outGoingCount = function (node) {
	var count = 0;
	_.each(arrows, function (arrow){
		if(arrow.from == node.id)
			count++;
	});
	return count;
}
//Does it have answered followed by multiple questions or statements?
var isAnswerOutgoingSafe = function ( ) {
	var isSafe = 1;
	_.each(nodes, function (node) {
		if(node.type == "answer" && outGoingCount(node) > 1) {
			console.log("Answer followed by multiple statements exists.");
			isSafe = 0;
		}
	});
	if(isSafe) console.log("Answers are all safe.");
	return isSafe;
}
isAnswerOutgoingSafe();

//Is it single sourced (alternative: simply check for start type if Taranchula creates multiple) ?
var isSourceNode = function (node) {
	var isSource = 1;
	_.each(arrows, function (arrow) {
		if(node.id == arrow.to) {
			isSource = 0;
		}
	});
	return isSource;
}
var sourceCount = function ( ) {
	var count = 0;
	_.each(nodes, function (node) {
		var isSource = 1;
		_.each(arrows, function (arrow) {
			if(node.id == arrow.to) {
				isSource = 0;
			}
		});
		if(isSource)
			count++;
	});
	return count;
}
console.log("Sources: "+sourceCount());

//Does it have multiple connected components?
var ccNum = 0;

var addDFSInfo = function () {

//graph is treated as directed

	var checkForAdjacencies = function (node) {
		var adjacencies = [];

		_.each(arrows, function (arrow) {
			if(node.id === arrow.from) {
				adjacencies.push(nodeOfId(arrow.to));
			}
		});
		return adjacencies;
	}

	//add Pre and Post numbering to nodes through depth first search procedure
	var numbering = 0;
	var layer = 0;

	//sets all node pre and post to -1
	initializePrePost ();

	var dfs = function (node,layer) {
		//set nodes pre and then increment counter
		node.pre = numbering++;
		node.layer = layer; 
		//for each of the nodes adjacencies
		_.each(checkForAdjacencies(node),function(adjacency) {
			
			//grab node from nodes		
			//if it has not been visited
			if(adjacency.pre === -1) {
				//run dfs on adjacency
				dfs(adjacency,layer+1);
			}
		});
		node.post = numbering++;
	}

	//checks if node is connected to a searched component
	var isConnected = function (node) {
		var isCon = false;
		_.each(arrows, function (arrow) {
			if(arrow.from === node.id && nodeOfId(arrow.to).pre !== -1)
				isCon = true;
		});
		return isCon;
	}

	//run dfs with directed adjacencies
		//find connected nodes not reached and run dfs with same cc num
		//then run dfs on any other components and increment cc num

	//need to prioritize new source nodes instead of running on next -1 node found
	_.each(nodes, function (node) {
		if(node.pre === -1) {
			if(isConnected(node)) {
				dfs(node,layer);
			}
			else {
				dfs(node,layer);
				ccNum++;
			}
		}
	});
//add edge types here
//Does it have back edges? Does it have forward edges?

	/*
	for all edges if: INCOMPLETE
		from.node's layer == to.node's layer -> cross edge
		from.node's pre < to.node's pre -> forward edge
		from.node's pre > to.node's pre -> back edge
	*/
	//add types to edges
}
addDFSInfo();
console.log("Connected components: "+ccNum);

//Are they all trees? (Is it a forest)




});
