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
var treeMain = function (chart, container, windowWidth, windowHeight, maxNodeWidth, nodeBuffer, spacingX, spacingY ) {

	var viewPaper = Raphael(container, windowWidth, windowHeight);
	var testing = 0;
	var title = chart.title;
	var nodes = chart.nodes;
	var arrows = chart.arrows;
	var paths = [];
	var stack = [];

	/***********************************************
	*	Initialize Tree Object and Helper functions
	*	
	***********************************************/
	var Tree = {
		nodes: [],
		getNode: function ( id ) {
			
			var that = this;
			var node = _.find(that.nodes, function (node) {
				return node.id == id;
			});
			return node;
			
			/*
			var self = this;
			for(var each in self.nodes) {
				if(self.nodes[each].id === id)
				return self.nodes[each];
			}
			*/
		},
		getStart: function ( ) {
				//temporary fix for:
				//if (this.nodes[each].type === "start")
			var temp = _.find(this.nodes, function (node) {
				return node.id == 0;
			});
			return temp;
		},
		printPrePost: function ( ) {
			this.nodes = _.sortBy(this.nodes, function (node) { 
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
			var arr = [];
			_.each(this.nodes, function (node) {
				if(node.layer === layer) {
					arr.push(node);
				}
			});
			return arr;
		},
		//returns list of layer numbers
		listOfLayers: function ( ) {
			return _.uniq(_.pluck(Tree.nodes, 'layer'));
		},
		getLayers: function ( ) {
			var layers = this.listOfLayers();
			var arr = [];
			var that = this;
			_.each(layers, function (val) {
				arr.push(that.getLayer(val));
			});
			return arr;
		}
	}

	/*******************************************************
	*	Create Nodes
	*	
	*	nodes = array of { Node id, Array of adjacent nodes}
	********************************************************/
	Tree.nodes = nodes;

	//change to extend prototype
	_.each(arrows, function (arrow) {
		arrow.used = 0;
	});


	var checkForAdjacencies = function (node) {
		var adjacencies = [];
		console.log("node: "+node.id);
		_.each(arrows, function (arrow) {
			if(node.id === arrow.from) {

				console.log(arrow.to);
				var retrievedNode = Tree.getNode(arrow.to);
				if(retrievedNode.used == 0) {
					arrow.used = 1;
					retrievedNode.used = 1;
					adjacencies.push(retrievedNode);
				}
				
			}
		});
		return adjacencies;
	}	

	_.each(Tree.nodes, function (node) {
		node.pre = -1;
		node.post = -1;
		node.layer = -1;
		node.parent = -1;
		node.zone = 0;
		node.zoneXpos = 0;
		node.xCurrent = 0;
		node.used = 0;
		node.paths = [];
	});
	_.each(Tree.nodes, function (node) {
		node.adjacent = checkForAdjacencies(node);
	});

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
				adjacency.parent = node;
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
	/*
	Tree.nodes = _.sortBy(Tree.nodes, function(node) { 
		return node.post;
	});
	*/
	//build layers // could change to just have Tree.layers
	Tree.layers = Tree.getLayers();
	var maxTextWidth = maxNodeWidth - nodeBuffer*2;
	var aColor = '#FF2C18';
	var aFontFill = '#FFFFFF';
	var qsColor = '#FFFFFF';
	var qsFontFill = '#999999';

	//console.log(Tree.layers);
	

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
	var currentY = spacingY*3;
	_.each(Tree.layers, function (layer) {

	var greatestTextHeightInLayer = 0;
	layer.width = ( ( layer.length - 1 ) * spacingX );

		//for each node in the layer
		_.each(layer, function (node) {

			var content = node.data;
			var words = content.split(" ");
			
			var tempText = "";

			node.textBox = viewPaper.text(0,0).attr({'text-anchor': 'start', 'font-family': "Lucidia Grande", 'fill': 'black', 'font-size': 18});
			_.each(words, function (word) {
					node.textBox.attr("text", tempText + " " + word);
					if(node.textBox.getBBox().width > maxTextWidth){
						tempText += "\n" + word;	
					} else {
						tempText += " " + word;	
					}
					//console.log(tempText);
			});
			//textBox.remove();
			//textBox = viewPaper.print(-4,2, tempText.substring(1), viewPaper.getFont("Myriad Pro"), 18, "baseline").attr({'text-anchor': 'start', 'fill': qsFontFill});
			node.textBox.attr("text", tempText.substring(1));
			if(node.textBox.getBBox().height > greatestTextHeightInLayer) {
				greatestTextHeightInLayer = node.textBox.getBBox().height;
			}

			node.designBox = viewPaper.rect(0,0,node.textBox.getBBox().width + nodeBuffer*2,node.textBox.getBBox().height + nodeBuffer*2);

			layer.width += node.textBox.getBBox().width + nodeBuffer*2;
			//console.log(node.textBox.getBBox().width+ ": "+node.designBox.attr("width"));
			node.width = node.designBox.attr("width")+spacingX;
			node.height = node.designBox.attr("height");

		});

	layer.height = greatestTextHeightInLayer + nodeBuffer*2;
	//console.log("width: "+layer.width);
	layer.startX = windowWidth/2 - layer.width / 2;
	layer.startY = currentY;
	currentY += layer.height + spacingY;

	});


	var initZone = function (node) {
		node.zone = 0;
		/*
		if(node.adjacent>0) {
		node.zone -= spacingX;
		*/
		//console.log(node.id);
		_.each(node.adjacent, function (adj) {

			node.zone += initZone(adj);
		});
		if(node.zone < node.width) {
			node.zone = node.width;
		}
		//console.log("node #"+node.id+" zone: "+node.zone);
		return node.zone;
	}	

	var zoneBalancer = function (node) {

		var totalAdjZones = 0;
		_.each(node.adjacent, function (adj) {
			totalAdjZones += adj.zone;
		});
		if(totalAdjZones < node.zone) {

			var newZoneSize = node.zone / node.adjacent.length;

			_.each(node.adjacent, function (adj) {
				 adj.zone = newZoneSize;
				zoneBalancer(adj);
			});
		}
		else {
			_.each(node.adjacent, function (adj) {
				zoneBalancer(adj);
			});
		}

	}

	var createZones = function (node) {
		initZone(node);
		zoneBalancer(node);
	}
	createZones(start);

	var setNodePositions = function (node) {
		if(node.parent == -1) {
			node.zoneXpos = windowWidth / 2 - node.zone / 2;
			node.xCurrent = node.zoneXpos;
		}
		else {
			node.zoneXpos = node.parent.xCurrent;
			node.parent.xCurrent += node.zone;
			node.xCurrent = node.zoneXpos;
		}

		node.textBox.attr({ 'x': node.zoneXpos + node.zone / 2 + nodeBuffer - node.designBox.attr('width') / 2, 
							'y': Tree.layers[node.layer].startY + node.designBox.attr('height') / 2, 'fill': qsFontFill});
		if(testing) {
		viewPaper.rect(node.zoneXpos + 2,Tree.layers[node.layer].startY,node.zone - 4,1);//TESTING 
		viewPaper.rect(node.zoneXpos+node.zone / 2,Tree.layers[node.layer].startY,1,4);//TESTING 
		}
		node.designBox.attr({'x': node.zoneXpos + node.zone / 2  - node.designBox.attr('width') / 2
									,'y': Tree.layers[node.layer].startY })
								.attr({fill: qsColor, 'stroke': '#999999', 'stroke-width': .5, 'stroke-linecap': "square"}).toBack();

		_.each(node.adjacent, function (adj) {
			setNodePositions(adj);
		});
	}
	setNodePositions(start);
	//draw title
	Tree.title = viewPaper.text(0,0).attr({'text': title,'text-anchor': 'start', 'font-family': "Lucidia Grande", 'fill': qsFontFill, 'font-size': 80});
	Tree.title.attr({'x': start.zoneXpos + start.zone / 2 - Tree.title.getBBox().width/2, 'y': spacingY*1.5});
	var routePaths = function (node) {
		_.each(node.adjacent, function (adj) {
			var pathStartX, pathStartY, pathTurn1X, pathTurn1Y, pathTurn2X, pathTurn2Y, pathEndX, pathEndY;

			//console.log(node.designBox.attr('x'));

			pathStartX 	= node.designBox.attr('x') + node.designBox.attr('width') / 2;
			pathStartY 	= node.designBox.attr('y') + node.designBox.attr('height') /2;
			pathTurn1X 	= pathStartX;
			pathTurn1Y 	= node.designBox.attr('y') + node.designBox.attr('height')/2;
			pathTurn2X 	= adj.designBox.attr('x') + adj.designBox.attr('width') / 2;
			pathTurn2Y 	= pathTurn1Y;
			pathEndX 	= pathTurn2X;
			pathEndY 	= adj.designBox.attr('y') + adj.designBox.attr('height') / 2;
			var pathString = 'M'+pathStartX+','+pathStartY+'L'+pathTurn1X+','+pathTurn1Y+'L'+pathTurn2X+','+pathTurn2Y
				+'L'+pathEndX+','+pathEndY;
			//console.log(pathString);
			var newPath = viewPaper.path(pathString).attr({'stroke': '#999'}).toBack();
			newPath.child = adj;
			node.paths.push(newPath);
		});
	}

	_.each(arrows, function (arrow) {
		if(arrow.used == 0) {
			var fromNode = Tree.getNode(arrow.from);
			var toNode = Tree.getNode(arrow.to);
			var pathString = 'M'+fromNode.designBox.attr('x')+','+fromNode.designBox.attr('y')
			+'L'+toNode.designBox.attr('x')+','+toNode.designBox.attr('y');
			var newPath = viewPaper.path(pathString).attr({'stroke': '#999'}).toBack();
		}
	});
	
	_.each(Tree.nodes, function (node) {
		routePaths(node);
		
		node.designBox.hover(
			function () {

				node.g = node.designBox.glow(1,false,10);
				var rec = function (currNode,prevNode) {
					
					if(currNode != -1) {
						
						currNode.g = currNode.designBox.glow(1,false,10);
						_.each(currNode.paths, function (path) {
							if(path.child === prevNode) {
								path.g = path.glow(1,false,10);
							}
						});

						rec(currNode.parent,currNode);
					}

				}
				rec(node.parent,node);
			},
			function () {

				node.g.remove();
				var rec = function (currNode,prevNode) {
					
					if(currNode != -1) {
						
						currNode.g.remove();
						_.each(currNode.paths, function (path) {
							if(path.child === prevNode) {
								path.g.remove();
							}
						});

						rec(currNode.parent,currNode);
					}

				}
				rec(node.parent,node);
			}
		);
		node.textBox.hover(
			function () {
				node.g = node.designBox.glow(1,false,10);
				var rec = function (currNode,prevNode) {
					
					if(currNode != -1) {
						
						currNode.g = currNode.designBox.glow(1,false,10);
						_.each(currNode.paths, function (path) {
							if(path.child === prevNode) {
								path.g = path.glow(1,false,10);
							}
						});

						rec(currNode.parent,currNode);
					}

				}
				rec(node.parent,node);
			},
			function () {
				
				node.g.remove();
				var rec = function (currNode,prevNode) {
					
					if(currNode != -1) {
						
						currNode.g.remove();
						_.each(currNode.paths, function (path) {
							if(path.child === prevNode) {
								path.g.remove();
							}
						});

						rec(currNode.parent,currNode);
					}

				}
				rec(node.parent,node);
			}
		);
		node.designBox.click(
			function () {

				//FIRST RUN DOWNWARD REC FUNCTION THAT REMOVES ALL GLOW
				var recRemove = function (currNode) {
					currNode.c.remove();
						_.each(currNode.paths, function (path) {
								path.c.remove();
								recRemove(path.child);
						});			
				}
				recRemove(start);
				////////////

				node.c = node.designBox.glow(1,false,10);

				var rec = function (currNode,prevNode) {
					
					if(currNode != -1) {
						
						currNode.c = currNode.designBox.glow(1,false,10);
						_.each(currNode.paths, function (path) {
							if(path.child === prevNode) {
								path.c = path.glow(1,false,10);
							}
						});

						rec(currNode.parent,currNode);
					}

				}
				rec(node.parent,node);
			}
		);
		node.textBox.click(
			function () {

				//FIRST RUN DOWNWARD REC FUNCTION THAT REMOVES ALL GLOW
				var recRemove = function (currNode) {
					currNode.c.remove();
						_.each(currNode.paths, function (path) {
								path.c.remove();
								recRemove(path.child);
						});			
				}
				recRemove(start);
				////////////

				node.c = node.designBox.glow(1,false,10);

				var rec = function (currNode,prevNode) {
					
					if(currNode != -1) {
						
						currNode.c = currNode.designBox.glow(1,false,10);
						_.each(currNode.paths, function (path) {
							if(path.child === prevNode) {
								path.c = path.glow(1,false,10);
							}
						});

						rec(currNode.parent,currNode);
					}

				}
				rec(node.parent,node);
			}
		);

	});




	}
	else {
		console.log("Not a tree!");
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

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
treeMain(chart,document.getElementById("container"),windowWidth,windowHeight,150,5,50,50);

});