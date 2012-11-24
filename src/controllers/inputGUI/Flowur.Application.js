// JavaScript Document
// Application Holder Class
// Written by Patrick Teague
// Last updated: 9/4/12
var paper;
var viewPaper;
var creator;
var creator_up = false;
var viewer_up = false;
var share_up = false;
var demo_up = true;
var viewPage;
var viewer;
var current_chart;
var navigate;
var demoPage;
var stage = window;

window.onresize = function()//Resize and reposition everything here.
{
	document.getElementById('application').width = stage.innerWidth;
	document.getElementById('application').height = stage.innerHeight;
	paper.setSize(stage.innerWidth, stage.innerHeight);
	if(creator_up)
		creator.reposition_new();	
	if(demo_up)
		demoPage.reposition();
	if(viewer_up)
		viewPaper.setSize(stage.innerWidth, stage.innerHeight-60);
};
window.addEvent('domready', function(){
    paper = new Raphael(document.getElementById('application'), stage.innerWidth, stage.innerHeight);
	
	demoPage = new Demo_Page();
	
});

var go_to_home = function(){
	creator.close_all();
	creator_up = false;
	creator = null;
	navigate.close_it();
	navigate = null;
	console.log(JSON.stringify(current_chart));
	demoPage.show();
	demo_up = true;
	if(viewPage && viewer_up && !viewPage.selector_up)
		viewer.remove();
	if(viewPage)
		viewPaper.remove();
	viewer_up = false;
};

var go_to_creator = function(){
	demoPage.close_all();
	if((viewPage != null) && viewer_up && (!viewPage.selector_up) ){
		console.log(viewPage.selector_up);
		viewer.remove();
	}
	if(viewPage != null){
		if(viewPaper)
			viewPaper.remove();
		viewPage = null;
	}
	if(viewPage && viewPage.selector_up){
		viewPage.close_all();
		viewPaper.remove();
		viewPaper = null;
	}
	navigate = new Command_Navigator();
	creator = new Creation_Mode();
	creator_up = true;
	
	viewer_up = false;
	share_up = false;
};

var go_to_view = function(){
	demoPage.close_all();
	//demo_up = false;
	if(creator_up){
		creator.close_all();
		creator_up = false;
		navigate.close_it();
		navigate = null;	
	}
	viewPaper = Raphael(0, 60, stage.innerWidth, stage.innerHeight-60);
	viewPage = new View_Page();
	viewer_up = true;
	share_up = false;
};

var go_to_share = function(){
	if(creator_up){
		creator.close_all();
		creator_up = false;
		navigate.close_it();
		navigate = null;	
	}
	if(viewPage && viewer_up && !viewPage.selector_up)
		viewer.remove();
	if(viewPage)
		viewPaper.remove();
	viewer_up = false;
	share_up = true;
};