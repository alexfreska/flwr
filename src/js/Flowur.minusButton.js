// JavaScript Document
var minusButton = new Class({
	Extends: creationButton,
	
	initialize: function(x,y){
		this.parent(x,y);
		this.draw();
		this.addListeners();
	},
	draw: function(){
		this.parent();
		this.top_graphic = paper.image("Minus_Sign.png", this.x+5.675, this.y+9.425, 13, 2);
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
		this.top_graphic.attr({x: this.x+5.675});
		this.hit_area.attr({x: this.x+1.75});
	},
	set_y: function(new_y){
		this.parent(new_y);
		this.top_graphic.attr({y: this.y+9.425});
		this.hit_area.attr({y: this.y});
	},
	addListeners: function(){
		var k3 = this;
		this.hit_area.click(function(){
			k3.top_box.animate({x: k3.x, y: k3.y+1.75}, 100, '>');
			k3.top_graphic.animate({x: k3.x+3.925, y: k3.y+11.175}, 100, '>');
			var anim1 = Raphael.animation({x: k3.x+5.675, y: k3.y+9.425}, 100, '>');
			var anim2 = Raphael.animation({x: k3.x+1.75, y: k3.y}, 100, '>');
			k3.top_graphic.animate(anim1.delay(100));
			k3.top_box.animate(anim2.delay(100));
			delete_node();
		});
	},
});