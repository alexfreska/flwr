// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: Link_Node_Command												  	  //
//By: Patrick Teague														  //
//Date: 5/15/2012															  //
//This class is a subclass of Click_Command, and is used to populate the click//
//navigator with a button to link a node to another.						  //
////////////////////////////////////////////////////////////////////////////////
var Link_Node_Command = new Class({
	Extends: Click_Command,
	
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