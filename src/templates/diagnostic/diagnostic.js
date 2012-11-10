/*diagnostic.js
*
*	Warning:
*		Assumes answers only have 1 outgoing question or statement
*		
*
*	Todo: 
*		add jQuery animations at:
*			FORWARD_ANIMATIONS,
*			BACKWARD_ANIMATIONS,
*			INITIAL_ANIMATIONS				
*
*/
$(function() {

//helpers
var newNode = '<div class="node"></div>';
var newArrow = '<div class="arrow"></div>';
var oldBoxes = '.node,.arrow';

//json file from constructor
var jsonChart;

var title = []; 
var nodes = []; 
var arrows = [];
var stack = [];

var addGlobalButtons = function() {

	//Add back button div
	$('<img src="back.png" alt= "Back">').addClass('back').addClass('back-button').appendTo('#top')
	.html('Back');//INITIAL_ANIMATIONS

	//Add reset button div
	$('<img src="reset.png" alt= "Back">').addClass('reset').addClass('reset-button').appendTo('#top')
	.attr('onClick','window.location.href=window.location.href').html('Start Over');//INITIAL_ANIMATIONS
}


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
	


/*******************************************************
*	Create diag
*	
*	diag = array of { Node id, Array of adjacent nodes}
********************************************************/
var diag = [];

var findNodeById = function (id) {
	var node = _.find(nodes, function(node) {
		return node.id == id;
	});
	return node;
}
var checkForAdjacencies = function (node) {
	var adjacencies = [];

	_.each(arrows, function (arrow) {
		if(node.id === arrow.from) {
			adjacencies.push(findNodeById(arrow.to));
		}
	});
	return adjacencies;
}	


_.each(nodes, function (node) {

	diag.push( { id: node.id, data: node.data, 
							type: node.type, pre: -1, post: -1, 
							layer: -1, adjacent: checkForAdjacencies(node) } );

});

var findNodeById = function (id) {
	var node = _.find(diag, function(node) {
		return node.id == id;
	});
	return node;
}

var findNext = function (id) {

	var node = _.find(diag, function (node) {
		return node.id == id;
	});

	if(node.adjacent.length == 0) {
		return -1;
	}

	var question = node.adjacent[0];

	node = _.find(diag, function (node) {
		return node.id == question.id;
	});
	return node.id;
}


addGlobalButtons();

//Add title menu
$('<div>'+title+'</div>').attr('id','title').appendTo('#top');
var origin = $(newNode).appendTo('#data').html(title);//INITIAL_ANIMATIONS
$(newArrow).appendTo('#arrows').html("Click to Continue...").attr("id",nodes[0].id);//INITIAL_ANIMATIONS

stack.push(0);


$('body').on({
	'click': function() {		
		var id = $(this).attr("id");

		//clear stack if they have been reset
		if(id == 0)
			stack = [];

		stack.push(id);

		//special check for charts with end answers that are not followed by
		//statements
		if(id == -1) {
			var currentNode = { id: -1, data: 'The End', 
							type: 'statement', pre: -1, post: -1, 
							layer: -1, adjacent: [] };
		}
		else {
			var currentNode = findNodeById(id);
		}

		$(oldBoxes).remove();

		$(newNode).appendTo('#data').html(currentNode.data).attr("id", currentNode.id);
		if(currentNode.adjacent.length == 0) {
			$(newArrow).appendTo('#arrows').attr("id",nodes[0].id).html('Start Over');
		}
		_.each(currentNode.adjacent, function (adj) {
			$(newArrow).appendTo('#arrows').html(adj.data).attr("id", findNext(adj.id));
		});
	}
},'.arrow');

$('body').on({
	'click': function() {
		if(stack.length > 1) {
			stack.pop();
			var id = stack[stack.length-1];
			var currentNode = findNodeById(id);


			$(oldBoxes).remove();

			$(newNode).appendTo('#data').html(currentNode.data).attr("id", currentNode.id);
			if(currentNode.adjacent.length == 0) {
				$(newArrow).appendTo('#arrows').attr("id",nodes[0].id).html('Start Over');
			}
			_.each(currentNode.adjacent, function (adj) {
				$(newArrow).appendTo('#arrows').html(adj.data).attr("id", findNext(adj.id));
			});



		}
	}
},'.back');

});//closemain
