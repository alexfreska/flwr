// JavaScript Document
var Select_Button = new Class({
	Extends: Creation_Button,
	
	initialize: function(x,y){
		this.parent(x,y);
		this.draw();
		this.addListeners();
	},
	draw: function(){
		this.parent();
		this.top_graphic = paper.image("Select_Arrow.png", this.x+4.675, this.y+6.425, 15, 8);
		this.hit_area = paper.rect(this.x, this.y, this.width+1.75, this.height+1.75, 2);
		this.hit_area.attr({fill: '#000000', opacity: 0, stroke: 'none'});
	},
	undraw: function(){
		this.parent();
		this.top_graphic.remove();
		this.hit_area.remove();
	},
	set_x: function(new_x){
		this.parent(new_x);
		this.top_graphic.attr({x: this.x+4.675});
		this.hit_area.attr({x: this.x+1.75});
	},
	set_y: function(new_y){
		this.parent(new_y);
		this.top_graphic.attr({y: this.y+6.425});
		this.hit_area.attr({y: this.y});
	},
	addListeners: function(){
		var k5 = this;
		this.hit_area.click(function(){
			k5.top_box.animate({x: k5.x, y: k5.y+1.75}, 100, '>');
			k5.top_graphic.animate({x: k5.x+2.925, y: k5.y+8.175}, 100, '>');
			var anim1 = Raphael.animation({x: k5.x+4.675, y: k5.y+6.425}, 100, '>');
			var anim2 = Raphael.animation({x: k5.x+1.75, y: k5.y}, 100, '>');
			k5.top_graphic.animate(anim1.delay(100));
			k5.top_box.animate(anim2.delay(100));
			make_base();
		});
	},
});