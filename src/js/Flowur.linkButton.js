// JavaScript Document
var linkButton = new Class({
	Extends: creationButton,
	
	initialize: function(x,y){
		this.parent(x,y);
		this.draw();
		this.addListeners();
	},
	draw: function(){
		this.parent();
		this.top_graphic = paper.image("Make_Link.png", this.x+3.675, this.y+1.925, 17, 17);
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
		this.top_graphic.attr({x: this.x+3.675});
		this.hit_area.attr({x: this.x+1.75});
	},
	set_y: function(new_y){
		this.parent(new_y);
		this.top_graphic.attr({y: this.y+1.925});
		this.hit_area.attr({y: this.y});
	},
	addListeners: function(){
		var k2 = this;
		this.hit_area.click(function(){
			k2.top_box.animate({x: k2.x, y: k2.y+1.75}, 100, '>');
			k2.top_graphic.animate({x: k2.x+1.925, y: k2.y+3.675}, 100, '>');
			var anim1 = Raphael.animation({x: k2.x+3.675, y: k2.y+1.925}, 100, '>');
			var anim2 = Raphael.animation({x: k2.x+1.75, y: k2.y}, 100, '>');
			k2.top_graphic.animate(anim1.delay(100));
			k2.top_box.animate(anim2.delay(100));
			make_link();
		});
	},
});