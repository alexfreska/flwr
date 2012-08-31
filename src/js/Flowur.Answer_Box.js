// JavaScript Document
// Question Box, for use in Viewing_Mode
var Answer_Box = new Class({
	Extends: Viewing_Box,
	
	initialize: function(){
		this.parent();
	},
	get_type: function(){return 'A';},
});