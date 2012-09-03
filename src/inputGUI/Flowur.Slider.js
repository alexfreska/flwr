// JavaScript Document
// Written By: Patrick Teague
// Last update: 8/15/12

//Slider class

var Slider = new Class({
	initialize: function(){
		this.x;
		this.y;
		this.width;
		this.height;
		this.myColor = '#000000';
		this.f_opacity = .8;
		this.stroke = 'none';
		this.onStage = false;
		this.top_box;
	},
	undraw: function(){
		this.top_box.remove();	
	},
	set_y: function(new_y){
		this.y = new_y;
		if(this.onStage)
			this.top_box.remove();
		this.onStage = true;
		this.top_box = paper.rect(this.x, this.y, this.width, this.height,2).attr({'fill': this.myColor, 'stroke': this.stroke, 'fill-opacity': this.f_opacity});
	},
	set_x: function(new_x){
		this.x = new_x;
		if(this.onStage)
			this.top_box.remove();
		this.onStage = true;
		this.top_box = paper.rect(this.x, this.y, this.width, this.height,2).attr({'fill': this.myColor, 'stroke': this.stroke, 'fill-opacity': this.f_opacity});
	},
	
});