// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: addNodeCommand					     		      //
//This class is a subclass of clickCommand, and is used to populate the click //
//navigator with a button to add a new node to the stage.		      //
////////////////////////////////////////////////////////////////////////////////
var addNodeCommand = new Class({
	Extends: clickCommand,
	
	initialize: function(){
		this.parent();
	},
	draw: function(cx, cy, tot_el, this_el){
		this.parent(cx, cy, tot_el, this_el);
		this.top_text.attr({'text': "Add"});
	},
	doCommand: function(node){
		creator.new_node(node);	
	}
});
