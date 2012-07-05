// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: backNodeCommand				                      //
//This class is a subclass of clickCommand, and is used to populate the click //
//navigator with a button to navigate back up the tree.			      //
////////////////////////////////////////////////////////////////////////////////
var backNodeCommand = new Class({
	Extends: clickCommand,
	
	initialize: function(){
		this.parent();
	},
	draw: function(cx, cy, tot_el, this_el){
		this.parent(cx, cy, tot_el, this_el);
		this.top_text.attr({'text': "Back"});
	},
	doCommand: function(node){
		creator.back_node(node);	
	}
});
