// JavaScript Document
var Creation_Button = new Class({
	initialize: function(x,y){
		this.x = x;
		this.y = y;
		this.width = 20.85;
		this.height = 20.85;
		this.myColor = '#000000';
		this.myNode;
		this.onStage = false;
	},
	setColor: function(newColor){
		this.myColor = newColor;
		this.back_box.attr({fill: this.myColor});
		this.top_box.attr({fill: this.myColor});
	},
	getColor: function(){return this.myColor;},
	setNode: function(node){this.myNode = node;},
	getNode: function(){return this.myNode;},
	draw: function(){
		this.back_box = paper.rect(this.x, this.y+1.75, this.width, this.height, 2);
		this.back_box.attr({fill: this.myColor, stroke: 'none'});	
		this.shader_box = paper.rect(this.x, this.y+1.75, this.width, this.height, 2);
		this.shader_box.attr({
			fill: '#000000',
			opacity: .45,
			stroke: 'none'
		});
		this.top_box = paper.rect(this.x+1.75, this.y, this.width, this.height, 2);
		this.top_box.attr({fill: this.myColor, stroke: 'none'});
		this.onStage = true;
	},
	undraw: function(){
		this.back_box.remove();
		this.shader_box.remove();
		this.top_box.remove();
		this.onStage = false;
	},
	set_x: function(new_x){
		this.x = new_x;
		this.back_box.attr({x: this.x});
		this.shader_box.attr({x: this.x});
		this.top_box.attr({x: this.x+1.75});
	},
	set_y: function(new_y){
		this.y = new_y;
		this.back_box.attr({y: this.y+1.75});
		this.shader_box.attr({y: this.y+1.75});
		this.top_box.attr({y: this.y});
	},
	
});