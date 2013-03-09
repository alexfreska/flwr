$(function() {

var GridApp = function (chart, container, windowWidth, windowHeight ) {

	var paper = Raphael(container, windowWidth, windowHeight);

	Grid = {
		'title': chart.title,
		'nodes': []
	}

	var buffer = 10;
	var paths = [];
	var stack = [];
	//actual dimensions are 60x60 120x120 240x240 480x480
	var boxSizes = [
			{'x': 160,'y': 80},
			{'x': 160,'y': 160},
			{'x': 320,'y': 320},
			{'x': 640,'y': 320}
	]
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
	
	
	nodeInit = function (data) {
		self 			= {};
		self.paths 		= [];
		self.adjacent	= [];
		self.id 		= data.id;
		self.data 		= data.data;

		self.box 		= paper.rect(0,0,50,50);
		self.text 		= paper.text(50,50,self.data).attr(
			{'text-anchor': 'start', 'font-family': "Lucidia Grande", 'fill': 'black', 'font-size': 24});
		self.textSpace 	= self.text.getBBox().width * self.text.getBBox().height;

		//setup size based on space taken by text
		var current = 99999999;
		_.each(boxSizes, function (size) {

			var computeSize 		= (size.x - buffer * 2)*(size.y - buffer * 2);
			var diff 				= computeSize - self.textSpace;
			var wordWrapErrorFactor = 100;
			//console.log(diff + ' ' + current);

			if( diff < current && diff > wordWrapErrorFactor) {
				current = diff;
				self.box.attr({'width': size.x, 'height': size.y});
				self.width 	= size.x;
				self.height = size.y;
			}

		});
		//console.log("width: "+self.width);

		var words = self.data.split(" ");
		
		var tempText = "";
		//console.log('overflow per line');
		_.each(words, function (word) {
				self.text.attr("text", tempText + " " + word);
				//console.log(self.text.getBBox().width);
				//console.log(self.text.getBBox().width - (self.width - buffer*2) );
				if(self.text.getBBox().width > self.width - buffer*2){
					tempText += "\n" + word;	
				} else {
					tempText += " " + word;	
				}
				//console.log(tempText);
		});

		self.text.attr('text', tempText.substring(1));

		self.setX = function (x) {
			console.log('x'+self.box.attr('x'));
			self.box.attr({'x': x});
			self.text.attr({'x': x+buffer});
		}
		self.setY = function (y) {
			self.box.attr({'y': y});
			self.text.attr({'y': y+buffer});
		}

		//setup adjacent here or after
		return self;
	}
	_.each(chart.nodes, function (data) {
		//node.adjacent = checkForAdjacencies(node);
		Grid.nodes.push(nodeInit(data));
	});
	console.log(Grid);

	var d = 0;
	_.each(Grid.nodes, function (node) {
		//console.log("ggggg");
		console.log(node.box.attr('x'));
		node.setX(d);
		console.log(node.box.attr('x'));
		node.setY(d);
		d = d +100;
	});

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

GridApp(chart,document.getElementById("container"),windowWidth,windowHeight);

});