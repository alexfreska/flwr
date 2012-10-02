/*diagnostic.js
*
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
	
	var title = ""; 
	var nodes = ""; 
	var arrows = "";
	var stack = [];
	
	var addGlobalButtons = function() {

		//Add back button div
		$('<img src="back.png" alt= "Back">').addClass('back').addClass('back-button').appendTo('#top')
		.html('Back');//INITIAL_ANIMATIONS

		//Add reset button div
		$('<img src="reset.png" alt= "Back">').addClass('reset').addClass('reset-button').appendTo('#top')
		.attr('onClick','window.location.href=window.location.href').html('Start Over');//INITIAL_ANIMATIONS
	}

	var getNodeIdIndex = function(checkId) {

		for(var i=0;i<nodes.length;i++) {
			if(nodes[i].id===checkId) {
				return i;
			}
		}
	}

	var getArrowsForNodeId = function(checkId) {

		var keys = [];

		$.each(arrows,function(key,value) {
				//alert("hii");
			if(arrows[key].from.id===checkId) {
				keys.push(key);
			}
		});

		return keys;
	}
	
	//temporary json retrieval
	$.getJSON('chart.json', function(data) {

		title = data.title;
		nodes = data.nodes;
		arrows = data.arrows;
	
		addGlobalButtons();
	
		//Add title menu
		$('<div>'+title+'</div>').attr('id','title').appendTo('#top');
		var origin = $(newNode).appendTo('#data').html(title);//INITIAL_ANIMATIONS
		$(newArrow).appendTo('#arrows').html("Click to Continue...").attr("id",nodes[0].id);//INITIAL_ANIMATIONS
	
		stack.push(0);
		
		});//close getJSON()	

	
	$('body').on({
		'click': function() {			
				var index = getNodeIdIndex($(this).attr("id"));
				stack.push(index);
			
				$(oldBoxes).remove();
			
				var newTop = $(newNode).appendTo('#data').html(nodes[index].data).attr("id",nodes[index].id);//FORWARD_ANIMATIONS

			
				//check id for arrows
				arrowIndexes = getArrowsForNodeId(newTop.attr("id"));	
			
				//incase its the last node
				if(arrowIndexes.length===0) {
					$(newArrow).addClass('reset').addClass('reset-button').appendTo('#arrows')
					.attr('onClick','window.location.href=window.location.href').html('Start Over');//INITIAL_ANIMATIONS
					return;
				}
			
				$.each(arrowIndexes, function(key,val) {
					var temp = $(newArrow).appendTo('#arrows').attr("id",arrows[val].to.id).html(arrows[val].data);//FORWARD_ANIMATIONS
				});
		}
	},'.arrow');
	
	$('body').on({
		'click': function() {
			if(stack.length>1) {
			
				stack.pop();
				var previous = stack[stack.length-1];
				$(oldBoxes).remove();
		
				var newTop = $(newNode).appendTo('#data').html(nodes[previous].data).attr("id",nodes[previous].id);//BACKWARD_ANIMATIONS
		
				//check id for arrows
				arrowIndexes = getArrowsForNodeId(newTop.attr("id"));
		
				//incase its the last node
				if(arrowIndexes.length===0) {
					return;
				}
		
				$.each(arrowIndexes, function(key,val) {
					var temp = $(newArrow).appendTo('#arrows').attr("id",arrows[val].to.id).html(arrows[val].data);//BACKWARD_ANIMATIONS
				});
			}
		}
	},'.back');

});//closemain
