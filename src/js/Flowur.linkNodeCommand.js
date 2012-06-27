// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: linkNodeCommand						      //
//This class is a subclass of clickCommand, and is used to populate the click //
//navigator with a button to link a node to another.			      //
////////////////////////////////////////////////////////////////////////////////
var linkNodeCommand = new Class({
	Extends: clickCommand,
	
	initialize: function(){
		this.parent();
	},
	draw: function(cx, cy, tot_el, this_el){
		this.parent(cx, cy, tot_el, this_el);
		this.top_text.attr({'text': "Link"});
	},
	doCommand: function(node){
		creator.link_node(node);	
	}
});
