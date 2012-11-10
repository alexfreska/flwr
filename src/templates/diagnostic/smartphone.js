window.addEvent('moise


//document ready

var newBox = '<div class="box"></div>';
var newBox2 = '<div class="box2"></div>';
var newBoxInvisible = '<div class="boxInvisible"></div>';

function getNodeIdIndex(checkId,arr)
{
	//switched to a standard for loop, $.each didnt like a return inside
	for(var cnt=0;cnt<arr.length;cnt++)
	{
		if(arr[cnt].id===checkId)
		{
			return cnt;
		}
	}
}

function getArrowsForNodeId(checkId,arr)
{

	var array1 = new Array();

	$.each(arr,function(key,value)
	{
			//alert("hii");
		if(arr[key].from.id===checkId)
		{
			array1.push(key);
		}
	});

	return array1;
}

$(function() 
{

	var title = ""; 
	var nodes = ""; 
	var arrows = "";
	$.getJSON('jsonfile.json', function(data) 
	{

	title = data.title;
	nodes = data.nodes;
	arrows = data.arrows;
	

	var origin = $(newBox).appendTo('#container').html(title);
	$(newBox2).appendTo('#container').html("<br><br>Click to Continue...").attr("id",nodes[0].id).css("font-size","50px");


	});//close getJSON()
	
	$('.box2').live("click",function() 
	{	

			var index = getNodeIdIndex($(this).attr("id"),nodes);
			
			
			var oldBoxes = $('.box,.box2');
			oldBoxes.animate({left: '-=150%'}, 50).hide();
			//problem 1:
			//how do keep the old divs that have moved out of the way from blocking the horizontal position of the new divs
			//currently i have to use hide.
			
			var newTop = $(newBox).appendTo('#container').text(nodes[index].data).attr("id",nodes[index].id).css("left","185.5%");
			newTop.animate({left: '-=150%'}, 300);
			
			//check id for arrows
			arrowIndexes = getArrowsForNodeId(newTop.attr("id"),arrows);	
			
			//incase its the last node
			if(arrowIndexes.length===0)
			{
			newTop.css("background-color","#FF8888");
			$(newBoxInvisible).prependTo('#container');
			return;
			}
			
			$.each(arrowIndexes, function(key,val)
			{

				var temp = $(newBox2).appendTo('#container').attr("id",arrows[val].to.id).html("<br>"+arrows[val].data).css("left","185.5%");
				
				temp.animate({left: '-=150%'}, 300);

			});

	});
	
	/*need to fix problem 1 and then this would work fine:
	$('.box').live("click",function()
	{
	$('.box,.box2').animate({left: "+=150%"}).show();
	});
	*/
	
	//effects
	$(document).on('mouseenter','.box2', function()
	{
	$(this).addClass("hover");	
	});
	$(document).on('mouseleave','.box2', function()
	{
	$(this).removeClass("hover");
	});
	
});//closemain

//item first focused
runOnLoad(function()
{
	$('#container').select().focus();
});

