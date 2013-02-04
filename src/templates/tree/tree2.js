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
	console.log(chart);
	var title = chart.title;
	var nodes = chart.nodes;
	var arrows = chart.arrows;
	var paths = [];
	var stack = [];

	/******************************
	*	Temporary JSON Retrieval
	*
	******************************/
	var chart = [];

	$.ajax({
		url: 'chart2.json',
		async: false,
		dataType: 'json',
		success: function(data) {
			console.log(data);
		},
		error: function(e,header) {
			console.log(header);
		}
	});//close ajax


	console.log(nodes);
	_.each(nodes, function(node){
		console.log(node);
	});

}

//////////
var chart = [];

tree(chart,document.getElementById("container"),500,500,150,10,50,50);

});