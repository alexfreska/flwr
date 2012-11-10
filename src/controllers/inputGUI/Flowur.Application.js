// JavaScript Document
// Application Holder Class
// Written by Patrick Teague
// Last updated: 9/4/12
var paper;
var creator;
var creator_up = true;
var viewer_up = false;
var viewer;
var current_chart;
var navigate;
var stage = window;

window.onresize = function()//Resize and reposition everything here.
{
	document.getElementById('application').width = stage.innerWidth;
	document.getElementById('application').height = stage.innerHeight;
	paper.setSize(stage.innerWidth, stage.innerHeight);
	//background.attr({width: stage.innerWidth, height: stage.innerHeight});
	if(creator_up)
		creator.reposition_new();	
};
window.addEvent('domready', function(){
    paper = new Raphael(document.getElementById('application'), stage.innerWidth, stage.innerHeight);
	//background = paper.rect(0,0,stage.innerWidth, stage.innerHeight);
	//background.attr({fill: "90-#DADADA-#F5F5F5:50-#DADADA", stroke: 'none', 'fill-opacity': 0}); //'fill-opacity': .1
	navigate = new Command_Navigator();
	creator = new Creation_Mode();
	
});

var go_to_view = function(){
	creator.close_all();
	creator_up = false;
	creator = null;
	navigate.close_it();
	navigate = null;
	//console.log(JSON.stringify(current_chart));
	viewer = new Viewing_Mode();
	viewer_up = true;
	
};