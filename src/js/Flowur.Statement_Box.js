// JavaScript Document
// Question Box, for use in Viewing_Mode
var Statement_Box = new Class({
	Extends: Viewing_Box,
	
	initialize: function(){
		this.parent();
	},
	get_type: function(){return 'S';},
});