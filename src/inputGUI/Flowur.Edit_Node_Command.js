// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: Edit_Node_Command												  	  //
//By: Patrick Teague														  //
//Date: 5/15/2012															  //
//This class is a subclass of Click_Command, and is used to populate the click//
//navigator with a button to edit a node on the stage.						  //
////////////////////////////////////////////////////////////////////////////////
var Edit_Node_Command = new Class({
	Extends: Click_Command,
	
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