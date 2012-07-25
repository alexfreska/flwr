// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: saveNodeCommand						      //
//This class is a subclass of clickCommand, and is used to populate the click //
//navigator with a button to save the structure on stage.		      //
////////////////////////////////////////////////////////////////////////////////
var saveNodeCommand = new Class({
	Extends: clickCommand,
	
	initialize: function(){
		this.parent();
	},
	draw: function(cx, cy, tot_el, this_el){
		this.parent(cx, cy, tot_el, this_el);
		this.top_text.attr({'text': "Save"});
	},
	doCommand: function(node){
		creator.save_structure();	
	}
});
