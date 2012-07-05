// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: doneNodeCommand					              //
//This class is a subclass of clickCommand, and is used to populate the click //
//navigator with a button to end editting a node on the stage.		      //
////////////////////////////////////////////////////////////////////////////////
var doneNodeCommand = new Class({
	Extends: clickCommand,
	
	initialize: function(){
		this.parent();
	},
	draw: function(cx, cy, tot_el, this_el){
		this.parent(cx, cy, tot_el, this_el);
		this.top_text.attr({'text': "Done"});
	},
	doCommand: function(node){
		if(node.id === 'title')
			creator.done_title(node);
		else
			creator.done_node(node);	
	}
});
