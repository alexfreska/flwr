// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: selectNodeCommand					     	      //
//This class is a subclass of clickCommand, and is used to populate the click //
//navigator with a button to select a node as base.			      //
////////////////////////////////////////////////////////////////////////////////
var selectNodeCommand = new Class({
	Extends: clickCommand,
	
	initialize: function(){
		this.parent();
	},
	draw: function(cx, cy, tot_el, this_el){
		this.parent(cx, cy, tot_el, this_el);
		this.top_text.attr({'text': "Select"});
	},
	doCommand: function(node){
		creator.select_node(node);	
	}
});
