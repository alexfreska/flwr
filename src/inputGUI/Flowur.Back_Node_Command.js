// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: Back_Node_Command												  	  //
//By: Patrick Teague														  //
//Date: 5/15/2012															  //
//This class is a subclass of Click_Command, and is used to populate the click//
//navigator with a button to navigate back up the tree.						  //
////////////////////////////////////////////////////////////////////////////////
var Back_Node_Command = new Class({
	Extends: Click_Command,
	
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