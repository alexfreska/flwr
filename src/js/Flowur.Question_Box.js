// JavaScript Document
// Question Box, for use in Viewing_Mode
var Question_Box = new Class({
	Extends: Viewing_Box,
	
	initialize: function(){
		this.parent();
	},
	get_type: function(){return 'Q';},
});
