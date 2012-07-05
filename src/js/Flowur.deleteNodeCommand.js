// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: deleteNodeCommand						      //
//This class is a subclass of clickCommand, and is used to populate the click //
//navigator with a button to delete a node from the stage.		      //
////////////////////////////////////////////////////////////////////////////////
var deleteNodeCommand = new Class({
	Extends: clickCommand,
	
	initialize: function(){
		this.parent();
	},
	draw: function(cx, cy, tot_el, this_el){
		this.parent(cx, cy, tot_el, this_el);
		this.top_text.attr({'text': "Delete"});
	},
	doCommand: function(node){
		creator.delete_node(node);	
	}
});
