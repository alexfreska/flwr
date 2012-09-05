// JavaScript Document
// Application Holder Class
//0xFFAD00, 0xFF0033, 0x0074FA, 0xFF6431, 0x00A300, 0xFFEC00, 0xFF98C6, 0x001598, 0x00F787, 0xFF10BB
var paper;
var creator;
var creator_up = true;
var viewer_up = false;
var viewer;
var current_chart;
var navigate;
var background;
var stage = window;

window.onresize = function()//Resize and reposition everything here.
{
	document.getElementById('application').width = stage.innerWidth;
	document.getElementById('application').height = stage.innerHeight;
	paper.setSize(stage.innerWidth, stage.innerHeight);
	background.attr({width: stage.innerWidth, height: stage.innerHeight});
	if(creator_up)
		creator.reposition_new();	
};
window.addEvent('domready', function(){
    paper = new Raphael(document.getElementById('application'), stage.innerWidth, stage.innerHeight);
	background = paper.rect(0,0,stage.innerWidth, stage.innerHeight);
	//background.attr({fill: "90-#DADADA-#F5F5F5:50-#DADADA", stroke: 'none', 'fill-opacity': .1});
	background.attr({fill: "90-#DADADA-#F5F5F5:50-#DADADA", stroke: 'none', 'fill-opacity': .1});
	//background = paper.image('images/whitey.png', 0, 0, 654, 654);
	//background.attr({'fill': 'images/whitey.png', stroke: 'none'});
	/* 
	var container = document.id('application');
	//console.log(container.get('id'));

	container.addEvent('mousedown', function(event){
		event.preventDefault();	
		//console.log('click');
	});
	*/
	navigate = new Command_Navigator();
	creator = new Creation_Mode();
});

var go_to_view = function(){
	creator.close_all();
	creator_up = false;
	creator = null;
	navigate.close_it();
	navigate = null;
	viewer = new Viewing_Mode();
	viewer_up = true;
	
};