$(function() {
/******************************************************
*	Tree Visualization
*
*		chart: takes data
*		container: the html element
*		
*	OPTIONAL PARAMETERS:
*		maxNodeWidth
*		nodeBuffer
*		spacingX
*		spacingY
*
*	DEFAULTS:  maxNodeWidth = 150,nodeBuffer = 10, spacingX = 50, spacingY = 50 
******************************************************/
var tree = function (chart, container, windowWidth, windowHeight, maxNodeWidth, nodeBuffer, spacingX, spacingY ) {

	var viewPaper = Raphael(container, windowWidth, windowHeight);

	var title = chart.title;
	var nodes = chart.nodes;
	var arrows = chart.arrows;
	var paths = [];
	var stack = [];
	console.log(nodes);
	/***********************************************
	*	Initialize Tree Object and Helper functions
	*	
	***********************************************/
	var Tree = {
		nodes: [],
		getNode: function (id) {
			var node = _.find(this.nodes, function(node){
				console.log("hii");
				return node.id == id;
			});
			return node;
		},
		getStart: function ( ) {
				//temporary fix for:
				//if (this.nodes[each].type === "start")
			var temp = _.find(this.nodes, function (node){
				return node.id == 0;
			});
			return temp;
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
			_.each(this.nodes, function (node) {
				if(node.layer === layer) {
					array.push(node);
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
	var formatedNodes = [];


	console.log("Type of Tree.getLayers(): "+ typeof Tree.getLayers());
	console.log("Type of Tree.getNode(): "+ typeof Tree.getNode());

	var checkForAdjacencies = function (node) {
		var adjacencies = [];

		_.each(arrows, function (arrow) {
			if(node.id === arrow.from) {
				adjacencies.push(Tree.getNode(arrow.to));
			}
		});
		return adjacencies;
	}	

	_.each(nodes, function (node) {

		formatedNodes.push( { id: node.id, data: node.data, 
								type: node.type, pre: -1, post: -1, 
								layer: -1, adjacent: checkForAdjacencies(node) } );

	});

	//update node data
	Tree.nodes = formatedNodes;

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

	/************************************************************
	*	Temporary Tree Check Helper function
	*
	*	FIX: by modifying node drawing to only draw adjacencies 
	*	if the particular node has not been used
	*
	*	OR JUST CHECK FOR BACK EDGE or CROSS EDGE
	*
	************************************************************/
	var isRealTree =  function ( ) {

		var isTree = 1;
		_.each(arrows, function (arrow) {
			if(arrow.isLink && arrow.isLink === true)
				isTree = 0;
		});
		return isTree;

	}
	//add Pre and Post numbering to nodes through depth first search procedure
	var dfs = function (node,layer) {
		//set nodes pre and then increment counter
		node.pre = numbering++;
		node.layer = layer; 
		//for each of the nodes adjacencies

		_.each(node.adjacent,function(adjacency) {

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
	//build layers // could change to just have Tree.layers
	Tree.layers = Tree.getLayers();

	//Tree check
	if(isRealTree())
	{

	/******************************************************
	*	Calculate Node and Layer Graphical Information
	*
	*		each nodes:
	*			textWidth & height based on maxNodeWidth
	*		each layers:
	*			layer height
	*			( maxTextHeight+nodeBuffer = layerHeight )
	******************************************************/
	_.each(Tree.layers, function (layer) {

	var layerHeight = 0;
	var greatestTextHeightInLayer = 0;
	var layerWidth = ( ( layer.length - 1 ) * spacingX );


		//for each node in the layer
		_.each(layer, function (node) {

			var content = node.data;
			var words = content.split(" ");
			var tempText = "";

			textBox = viewPaper.text(0,0).attr({'text-anchor': 'start', 'font-family': "Ubuntu", 'fill': '#FFFFFF', 'font-size': 18});
			_.each(words, function (word) {
					textBox.attr("text", tempText + " " + word);
					if(textBox.getBBox().width > maxTextWidth){
						tempText += "\n" + word;	
					} else {
						tempText += " " + word;	
					}
					//console.log(tempText);
			});
			textBox.remove();
			textBox = viewPaper.print(-4,2, tempText.substring(1), viewPaper.getFont("Myriad Pro"), 18, "baseline").attr({'text-anchor': 'start', 'fill': qsFontFill});
			//textBox.attr("text", tempText.substring(1));
			if(textBox.getBBox().height > greatestTextHeightInLayer) {
				greatestTextHeightInLayer = textBox.getBBox().height;
			}
			node.textBox = textBox;
			node.designBox = viewPaper.rect(0,0,node.textBox.getBBox().width + nodeBuffer*2,node.textBox.getBBox().height + nodeBuffer*2).attr({'stroke': 'none'});

			layerWidth += node.textBox.getBBox().width + nodeBuffer*2;
			//console.log(node.textBox.getBBox().width+ ": "+node.designBox.attr("width"));
		});

	layerHeight = greatestTextHeightInLayer + nodeBuffer*2;
	layer.height = layerHeight;
	layer.width = layerWidth;
	//console.log("width: "+layer.width);
	layer.startX = windowWidth/2 - layerWidth / 2;

	});

	_.each(Tree.layers, function(layer){
		console.log(layer.width);
	});












	}
	else {
		console.log("not tree");
	}
}


/******************************
*	Temporary JSON Retrieval
*
******************************/
var chart = [];

$.ajax({
	url: 'chart.json',
	async: false,
	dataType: 'json',
	success: function(data) {
		chart = data;
	},
	error: function(e,header) {
		console.log(header);
	}
});//close ajax


tree(chart,document.getElementById("container"),500,500,150,10,50,50);

});