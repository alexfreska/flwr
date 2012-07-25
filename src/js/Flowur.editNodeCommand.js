// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: editNodeCommand						      //
//This class is a subclass of clickCommand, and is used to populate the click //
//navigator with a button to edit a node on the stage.			      //
////////////////////////////////////////////////////////////////////////////////
var editNodeCommand = new Class({
	Extends: clickCommand,
	
	initialize: function(){
		this.parent();
	},
	draw: function(cx, cy, tot_el, this_el){
		this.parent(cx, cy, tot_el, this_el);
		this.top_text.attr({'text': "Edit"});
	},
	doCommand: function(node){
		if(node.id === 'title')
			creator.edit_title(node);
		else
			creator.edit_node(node);	
	}
});
