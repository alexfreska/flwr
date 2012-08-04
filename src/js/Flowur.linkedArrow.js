// JavaScript Document
var linkedArrow = new Class({
	initialize: function(x,y){
		this.x = x;
		this.y = y;
		this.width = 17;
		this.height = 46;
		this.onStage = false;
		this.draw();
	},
	draw: function(){
		this.top_graphic = paper.image("Linked_Arrow.png", this.x, this.y, this.width, this.height);
		this.onStage = true;
	},
	undraw: function(){
		this.top_graphic.remove();
		this.onStage = false;
	},
	set_x: function(new_x){
		this.x = new_x;
		this.top_graphic.attr({x: this.x});
	},
	set_y: function(new_y){
		this.y = new_y;
		this.top_graphic.attr({y: this.y});
	},
});