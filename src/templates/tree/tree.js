$(function() {

//json file from constructor
// var jsonChart;

var title = []; 
var nodes = []; 
var arrows = [];
var stack = [];

/******************************
*	Temporary JSON Retrieval
*
******************************/
$.ajax({
	url: 'chart.json',
	async: false,
	dataType: 'json',
	success: function(data) {
		title = data.title;
		nodes = data.nodes;
		arrows = data.arrows;
	}
});//close ajax

/************************************************************
*	Temporary Tree Check Helper function
*
*	FIX: by modifying node drawing to only draw adjacencies 
*	if the particular node has not been used
************************************************************/
var isRealTree =  function ( ) {

	var isTree = 1;
	_.each(arrows, function (arrow) {
		if(arrow.isLink && arrow.isLink === true)
			isTree = 0;
	});
	return isTree;

}
/***********************************************
*	Initialize Tree Object and Helper functions
*	
***********************************************/
var Tree = {
	nodes: [],
	getNode: function (id) {
		for(var each in this.nodes) {
			if(this.nodes[each].id === id)
			return this.nodes[each];
		}
	},
	getStart: function ( ) {
		for(var each in this.nodes) {
			if(this.nodes[each].type === "start")
				return this.nodes[each];
		}
	},
	printPrePost: function ( ) {
		this.nodes = _.sortBy(this.nodes, function(node) { 
			return node.post;
		});
		_.each(this.nodes, function (val) {
			console.log(val.pre+", "+val.post);
		});
	},
	printNodes: function ( ) {
		_.each(this.nodes, function (val) {
			console.log(val.data);
		});
	},
	//returns array of nodes in given layer
	getLayer: function (layer) {
		var array = [];
		_.each(this.nodes, function (val) {
			if(val.layer === layer) {
				array.push(val);
			}
		});
		return array;
	},
	//returns list of layer numbers
	listOfLayers: function ( ) {
		var array = [];
		_.each(this.nodes, function (val,key) {
			if(_.indexOf(array, val.layer) === -1) {
				array.push(val.layer);
			}
		});
		_.sortBy(array, function(val){ return val; });
		return array;
	},
	getLayers: function ( ) {
		var layers = this.listOfLayers();
		var layersObject = {layers: []};
		var that = this;
		_.each(layers, function (val) {
			layersObject.layers.push(that.getLayer(val));
		});
		return layersObject;
	}
}
	

/*******************************************************
*	Create Nodes
*	
*	nodes = array of { Node id, Array of adjacent nodes}
********************************************************/
var treeFormatNodes = [];


var checkForAdjacencies = function (node) {
	var adjacencies = [];

	_.each(arrows, function (arrow) {
		if(node.id === arrow.from) {
			adjacencies.push(arrow.to);
		}
	});
	return adjacencies;
}	

_.each(nodes, function (node) {

	treeFormatNodes.push( { id: node.id, data: node.data, 
							type: node.type, pre: -1, post: -1, 
							layer: -1, adjacent: checkForAdjacencies(node) } );

});

//add formated nodes to Tree data structure
Tree.nodes = treeFormatNodes;


/***************************
*	Depth First Search
***************************/
var numbering = 1;
var parent = 0;
var start = Tree.getStart();

//a starting node is required
if(typeof start === undefined) {
	return;
}

//add Pre and Post numbering to nodes through depth first search procedure
var dfs = function (node,layer) {
	//set nodes pre and then increment counter
	node.pre = numbering++;
	node.layer = layer; 
	//for each of the nodes adjacencies
	_.each(node.adjacent,function(val) {
		//grab node from nodes
		parent = node.pre;
		var adjacency = Tree.getNode(val);
		
		//if it has not been visited
		if(adjacency.pre === -1) {
			//run dfs on adjacency
			dfs(adjacency,layer+1);
		}
	});
	node.post = numbering++;
}
//Run dfs to build Tree data structure
dfs(start,0);

/*********************************
*	Template specific code below
*
*********************************/

//sort Tree object's nodes for reverse usage
Tree.nodes = _.sortBy(Tree.nodes, function(node) { 
	return node.post;
});




/*****************************************************************
*	Standard Tree Template
*
*	Restrictions: 
*		Currently does not support: Back Edges, Forward Edges
*		Template could be modified to force a tree or awkwardly 
*		drawing in back and forward edges.
*
* 	Params:
* 		paper height:           windowHeight,
*		paper width:            windowWidth,    
*		horizontal spacing: 	spacingX,
*		vertical spacing:       spacingY,
*		maximum node width:     maxNodeWidth,
*			Forces long text string to take more vertical space.
*		node buffer:            nodeBuffer 
*
*****************************************************************/

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var paper = Raphael(document.getElementById("container"), windowWidth, windowHeight);

//Tree check
if(isRealTree())
{

/************************
*	Setting parameters
*
************************/
var spacingX = 50;
var spacingY = 100;
var maxNodeWidth = 150;
var nodeBuffer = 10;
var maxTextWidth = maxNodeWidth - nodeBuffer*2;

/***********************************************
*	Create layers object from Tree object
*
*	NOTE: Could be created with the tree object
*
***********************************************/
var layers = Tree.getLayers();


/******************************************************
*	Calculate Node and Layer Graphical Information
*
*		each nodes:
*			textWidth & height based on maxNodeWidth
*		each layers:
*			layer height
*			( maxTextHeight+nodeBuffer = layerHeight )
******************************************************/
_.each(layers.layers, function (layer) {

var layerHeight = 0;
var greatestTextHeightInLayer = 0;
var layerWidth = ( ( layer.length - 1 ) * spacingX );


	//for each node in the layer
	_.each(layer, function (node) {

		var content = node.data;
		var words = content.split(" ");
		var tempText = "";

		textBox = paper.text(0,0).attr({'text-anchor': 'start', 'font-family': "Ubuntu", 'fill': 'black', 'font-size': 18});
		_.each(words, function (word) {
				textBox.attr("text", tempText + " " + word);
				if(textBox.getBBox().width > maxTextWidth){
					tempText += "\n" + word;	
				} else {
					tempText += " " + word;	
				}
				//console.log(tempText);
		});
		textBox.attr("text", tempText.substring(1));
		if(textBox.getBBox().height > greatestTextHeightInLayer) {
			greatestTextHeightInLayer = textBox.getBBox().height;
		}
		node.textBox = textBox;
		node.designBox = paper.rect(0,0,node.textBox.getBBox().width + nodeBuffer*2,node.textBox.getBBox().height + nodeBuffer*2);

		layerWidth += node.textBox.getBBox().width + nodeBuffer*2;
		//console.log(node.textBox.getBBox().width+ ": "+node.designBox.attr("width"));
	});

layerHeight = greatestTextHeightInLayer + nodeBuffer*2;
layer.height = layerHeight;
layer.width = layerWidth;
//console.log("width: "+layer.width);
layer.startX = windowWidth/2 - layerWidth / 2;

});


/**********************************
*	Layout Graphics
*
**********************************/


// variables to track X and Y positions during layout
var currentX = currentY = 0;
var bottomLayerIndex = 0;

/******************************************************
*	Set currentY
*
*	Since layout is run from bottom up currentY is set
*	down the screen leaving room for layers above.
******************************************************/
_.each(layers.layers, function (layer) {
currentY += layer.height + spacingY;
});
/******************************************************
*	Set currentX
*
*	The center of the paper is selected and half of
*	the widest layer (bottom in a tree) is subtracted.
******************************************************/
currentX = windowWidth / 2 - layers.layers[bottomLayerIndex].width / 2;

/**************************
*	Layout Bottom Layer
*
**************************/
_.each(layers.layers[bottomLayerIndex], function (node) {

	node.designBox.attr({ "x": currentX, "y": currentY - (node.designBox.attr("height")/2) });
	node.textBox.attr({ "x": currentX + nodeBuffer, "y": currentY });
	console.log(currentX);
	currentX += (node.designBox.attr("width") + spacingX);

	//styling
	node.designBox.attr({fill: '#447744'}).toBack();

});

//move current y up the page
currentY -= (layers.layers[bottomLayerIndex].height + spacingY);

/******************************
*	Layout Remaining Layers
*
******************************/
_.each(layers.layers, function (layer,index) {

	var layerIndex = index;

	//skip the bottom layer since it is already drawn
	if(index !== bottomLayerIndex) {

		_.each(layer, function (node) {
			var amountOfAdjacent = node.adjacent.length;
			var firstAdjacent = node.adjacent[0];
			var lastAdjacent = node.adjacent[amountOfAdjacent-1];
			var firstAdjacentNode, lastAdjacentNode, nodePosition;

			//find first adjacenct in layer below
			firstAdjacentNode = _.find(layers.layers[layerIndex-1], function (node) {
				return node.id === firstAdjacent;
			});

			//find last adjacenct in layer below
			lastAdjacentNode = _.find(layers.layers[layerIndex-1], function (node) {
				return node.id === lastAdjacent;
			});

			var nodeSpanStart = firstAdjacentNode.designBox.attr("x");
			var nodeSpanEnd = lastAdjacentNode.designBox.attr("x") + lastAdjacentNode.designBox.attr("width");
			nodePosition = (nodeSpanEnd - nodeSpanStart)/2 + nodeSpanStart - node.designBox.attr("width")/2;
			
			console.log(node.id+": "+nodePosition);
			node.designBox.attr({"x": nodePosition, "y": currentY - (node.designBox.attr("height")/2)});
			node.textBox.attr({"x": nodePosition + nodeBuffer, "y": currentY });

			node.designBox.attr({fill: '#447744'}).toBack();
		});
		if(layers.layers[index+1]) {
			currentY -= (layer.height/2 + layers.layers[index+1].height/2 + spacingY);
		}
		else {
			currentY -= (layer.height/2 + spacingY);
		}
	}

});
/*****************************************************************
*	Arrow Routing
*
*	A line is drawn vertically down from each node. A second line 
*	is draw horizontally spanning adjacent nodes. Lines are drawn 
*	vertically down from the horizonal line to each adjacency.
*
*****************************************************************/
_.each(layers.layers, function (layer,index) {

	var layerIndex = index;

	//skip bottom layer since there are no outgoing edges
	if(index !== bottomLayerIndex) {

		_.each(layer, function (node) {

			var numAdj = node.adjacent.length;

			//draw line extending down from middle of node and set bottom end X and Y coordinates to lineX lineY

			var lineStartX, lineStartY, lineEndX, lineEndY;

			lineStartX = node.designBox.attr('x') + node.designBox.attr('width') / 2;
			lineStartY = node.designBox.attr('y') + node.designBox.attr('height');
			lineEndX = lineStartX + 0;
			lineEndY = lineStartY + 30;

			paper.path('M'+lineStartX+','+lineStartY+'L'+lineEndX+','+lineEndY);

			//find first and last adjacent node x positions.

			var firstA, lastA, lastAIndex, firstAX, lastAX;

			lastAIndex = node.adjacent.length - 1;

			firstA = _.find(layers.layers[layerIndex-1], function (val) {
						return val.id === node.adjacent[0];
					});
			lastA = _.find(layers.layers[layerIndex-1], function (val) {
						return val.id === node.adjacent[lastAIndex];
					});;

			firstAX = firstA.designBox.attr('x') + firstA.designBox.attr('width') / 2;
			lastAX = lastA.designBox.attr('x') + lastA.designBox.attr('width') / 2;

			//draw a horizontal line from firstX to lastX at lineY height
			paper.path('M'+firstAX+','+lineEndY+'L'+lastAX+','+lineEndY);

			//for each adjacent node draw a line down from lineY height to the middle of the node's top edge
			_.each(node.adjacent, function (adj) {

				var adjacentNode = _.find(layers.layers[layerIndex-1], function (node) {
					return node.id === adj;
				});

				var endX = adjacentNode.designBox.attr('x') + adjacentNode.designBox.attr('width')/2;
				var endY = adjacentNode.designBox.attr('y');

				paper.path('M'+endX+','+lineEndY+'L'+endX+','+endY);

			});
			

			
		});

	}
});
}
// if the data is not a tree output an error message
else {
	paper.text(windowWidth/2-40,windowHeight/2-40)
	.attr({'text-anchor': 'start', 'font-family': "Ubuntu", 'fill': 'black', 'font-size': 18, 'text': 'Not a Tree!'})
}


//console.log(layers);


});//endall



