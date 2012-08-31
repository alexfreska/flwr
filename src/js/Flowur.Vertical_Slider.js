// JavaScript Document
// Written By: Patrick Teague
// Last update: 8/15/12

//Vertical_Slider class

var Vertical_Slider = new Class({
	Extends: Slider,
	
	initialize: function(){
		this.parent();
		this.width = 5;
		this.x = stage.innerWidth-5 - this.width;
	},	
});