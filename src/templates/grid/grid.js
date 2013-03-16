$(function() {
TESTING = 1;
var GridApp = function (chart, inputBox ) {

	windowWidth = $(inputBox).width();
	windowHeight = $(inputBox).height();

	var container = document.createElement('div');
	inputBox.appendChild(container);

	$(container).width = windowWidth;
	$(container).height = windowHeight;

	var paper = Raphael(container, windowWidth, windowHeight);

	Grid = {
		'title': chart.title,
		'nodes': []
	}
	var buffer 		= 10;
	var boxBuffer 	= 2;
	var paths 		= [];
	var stack 		= [];
	var aColor 		= '#FF2C18';
	var aFontFill 	= '#FFFFFF';
	var qsColor 	= '#3B5998';
	var qsFontFill 	= '#FFFFFF';
	var fontSize 	= 0;

	/*
	*	Chose nuberOf based on windowWidth, if windowWidth is negligable throw error 
	*	or simply set minimum 
	* 	?????
	*/

	numberOf = 12;
	smallestDimension = (windowWidth - (numberOf+2)*boxBuffer) / numberOf;
	console.log('Smallest Dimension: '+ smallestDimension);
	var boxSizes = [
			{'x': smallestDimension, 'y': smallestDimension },
			{'x': smallestDimension*2+boxBuffer, 'y': smallestDimension },
			{'x': smallestDimension*2+boxBuffer, 'y': smallestDimension*2+boxBuffer },
			{'x': smallestDimension*4+boxBuffer*3, 'y': smallestDimension*2+boxBuffer },
			{'x': smallestDimension*4+boxBuffer*3, 'y': smallestDimension*4+boxBuffer*3 }
	]

	//REVISE linkage
	/*
	var checkForAdjacencies = function (node) {
		var adjacencies = [];

		_.each(arrows, function (arrow) {
			if(node.id === arrow.from) {
				var retrievedNode = Tree.getNode(arrow.to);
				adjacencies.push(retrievedNode);				
			}
		});
		return adjacencies;
	}
	*/
	
	//Node initialization function
	nodeInit = function (provDat) {
		newNode 			= {};
		newNode.paths 		= [];
		newNode.adjacent	= [];
		newNode.id 			= provDat.id;
		newNode.data 		= provDat.data;

		newNode.box 		= paper.rect(0,0,50,50);
		newNode.text 		= paper.text(50,50,newNode.data).attr(
			{'text-anchor': 'start', 'font-family': "Lucidia Grande", 'fill': qsFontFill, 'font-size': '18px'});
		newNode.textSpace 	= newNode.text.getBBox().width * newNode.text.getBBox().height;

		// function for computing textbox for given size dimensions
		var computeTextBox = function (w) {
			var words = newNode.data.split(" ");
			
			var tempText = "";
			//console.log('overflow per line');
			_.each(words, function (word) {
					newNode.text.attr("text", tempText + " " + word);
					//console.log(newNode.text.getBBox().width);
					//console.log(newNode.text.getBBox().width - (newNode.width - buffer*2) );
					if(newNode.text.getBBox().width > w - buffer*2){
						tempText += "\n" + word;	
					} else {
						tempText += " " + word;	
					}
			});
			newNode.text.attr('text', tempText.substring(1));
		}
		//setup size based on space taken by text

		
		var current = 99999999;
		_.each(boxSizes, function (size,index) {

			var computeSize 		= (size.x - buffer * 2)*(size.y - buffer * 2);
			var diff 				= computeSize - newNode.textSpace;

			//2000 from minor testing
			var wordWrapErrorFactor = 2000;

			if( diff < current && diff > wordWrapErrorFactor) {
				computeTextBox(size.x);
				if(newNode.text.getBBox().height < size.y ) {
					newNode.box.attr({'width': size.x, 'height': size.y});
					newNode.width 	= size.x;
					newNode.height 	= size.y;
					current = diff;
				}
			}
			

		});

		//IN PROGRESS - NOT OLD
		// CONVERTING TO SUPPORT AUTO NODE SIZE GENERATION
		/*
		var sizeFound	= 0;
		var loopCount 	= 1;
		var curX 		= smallestDimension;
		var curY		= smallestDimension;
		var scale		= 2;
		//?? BASE OFF SIZE OF SMALLEST
		var wordWrapErrorFactor = 2000;

		while(!sizeFound) {
			var computeSize 	= (curX - buffer * 2)*(curY - buffer * 2);
			var diff 			= computeSize - newNode.textSpace;

			if(diff > wordWrapErrorFactor) {
				computeTextBox(curX);
				if(newNode.text.getBBox().height < curY ) {
					newNode.box.attr({'width': curX, 'height': curY});
					newNode.width 	= curX;
					newNode.height 	= curY;
					sizeFound = 1;
				}
			}
			console.log(scale);
			scale *= 2;
			if(loopCount % 2 == 1) {

				curX = smallestDimension*(scale) + boxBuffer*(scale-1);
			}
			else {
				curY = smallestDimension*(scale) + boxBuffer*(scale-1);
			}
			loopCount++;

		}
		if(!sizeFound)
			console.log('not found');
		*/
		//console.log("width: "+newNode.width);

		newNode.box.attr({fill: qsColor, 'stroke': 'none', 'stroke-width': .5, 'stroke-linecap': "square"}).toBack();

		newNode.setX = function (x) {
			this.box.attr({'x': x});
			var horizCenter 		= ( this.box.attr('width') - this.text.getBBox().width ) / 2;
			this.text.attr({'x': x+horizCenter});
		}
		newNode.setY = function (y) {

			this.box.attr({'y': y});

			var halfTextHeight 	= this.text.getBBox().height / 2;
			var vertCenter 		= ( this.box.attr('height') - this.text.getBBox().height ) / 2;

			this.text.attr({'y': y+halfTextHeight+vertCenter});
		}
		newNode.getTopRight = function ( ) {
			return { 'x': this.box.attr('x') + this.box.attr('width') , 'y': this.box.attr('y') };
		}
		newNode.getTopLeft = function ( ) {
			return { 'x': this.box.attr('x') , 'y': this.box.attr('y') };
		}
		newNode.getBottomRight = function ( ) {
			return { 'x': this.box.attr('x') + this.box.attr('width') , 'y': this.box.attr('y') + this.box.attr('height') };
		}
		newNode.getBottomLeft = function ( ) {
			return { 'x': this.box.attr('x') , 'y': this.box.attr('y') + this.box.attr('height') };
		}
		//setup adjacent here or after
		return newNode;
	}

	//initialization Loop
	_.each(chart.nodes, function (data) {
		//node.adjacent = checkForAdjacencies(node);
		Grid.nodes.push(nodeInit(data));
	});
	//console.log(Grid);


	//Layout procedure

	var zones = {
		l: [],
		'add': function (x,y,w,p) {
			z = {};
			z.priority = p;
			z.toBeDeleted = 0;
			z.x = x;
			z.y = y;
			z.width = w;
			if(TESTING)
			z.pap = paper.rect(z.x,z.y,z.width,1);

			z.endX = function ( ) {
				return this.x + this.width;
			}
			z.used = function (width) {
				this.width -= (width+boxBuffer);
				this.x += boxBuffer + width;
				if(this.width > 0 && TESTING)
				this.pap.attr({'x': this.x,'width':this.width});
			}
			z.added = function (width) {
				this.width += (width+boxBuffer);
				if(TESTING)
				this.pap.attr({'width':this.width});			
			}
			this.l.push(z);
		}
	}
	zones.add(boxBuffer,boxBuffer, windowWidth - boxBuffer*2,1);
	if(TESTING) {
		paper.rect(0,0,windowWidth - boxBuffer*2,1);
	}

	var found = 0;

	_.each(Grid.nodes, function (node) {
		//find next zone that fits width
		found = 0;
		zones.l = _.sortBy(zones.l, function (zone) {
			//FIX TO: sort by smallest within 2 layers
			return zone.priority;
		});
		//Try to combine zones

		_.each(zones.l, function (zone1,index1) {
			_.each(zones.l, function (zone2,index2) {
				if(zone1.y == zone2.y && !zone1.toBeDeleted && !zone2.toBeDeleted ) {
					if(zone1.x == zone2.endX()+boxBuffer ) {
						zone2.added(zone1.width);
						zone1.toBeDeleted = 1;
					}
					else if(zone1.endX() + boxBuffer == zone2.x ) {
						zone1.added(zone2.width);
						zone2.toBeDeleted = 1;
					}
				}
			});
		});
		_.each(zones.l, function (zone,index) {
			if(zone.toBeDeleted) {
				if(TESTING)
				zones.l[index].pap.attr({'width': 0, 'height': 0});
				zones.l.splice(index,1);
				//console.log("delete!")
			}
		});
		_.each(zones.l, function (zone,index) {
			//console.log('width: '+node.width+', zonewidth: '+zone.width);
			if(Math.floor(1000*node.width)/1000 <= Math.floor(1000*zone.width)/1000 && !found) {
				found = 1;
				//place node
				node.setX(zone.x);
				node.setY(zone.y);
				if(TESTING)
				paper.text(zone.x+15,zone.y+10,'priority: '+zone.priority);
				//adjust zone for used space
				zone.used(node.width);
				//retrieve node coordinates
				var coordinates = node.getBottomLeft();
				//add new zone below node
				zones.add(coordinates.x,coordinates.y + boxBuffer,node.width,zone.priority+boxBuffer+node.height);

				//check and destroy if zone z must be removed
				if(zone.width <= 0) {
					if(TESTING)
					zones.l[index].pap.attr({'width': 0, 'height': 0});
					zones.l.splice(index,1);
				}
			}
		});
		if(!found)
			console.log('no zone found');
	});
	var maxDepth = 0;
	_.each(zones.l, function (zone) {
		if(zone.priority > maxDepth)
			maxDepth = zone.priority; 
	});
	paper.setSize(windowWidth,maxDepth);

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

GridApp(chart,document.getElementById('inputBox'));

});