// JavaScript Document
var saveButton = new Class({
	initialize: function(x,y){
		this.x = x;
		this.y = y;
		this.width = 50;
		this.height = 30;
		this.myColor = '#0099FF';
		this.onStage = false;
		this.draw();
		this.addListeners();
	},
	draw: function(){
		this.back_box = paper.rect(this.x, this.y+2.25, this.width, this.height, 2);
		this.back_box.attr({fill: this.myColor, stroke: 'none'});	
		this.shader_box = paper.rect(this.x, this.y+2.25, this.width, this.height, 2);
		this.shader_box.attr({
			fill: '#000000',
			opacity: .45,
			stroke: 'none'
		});
		this.top_box = paper.rect(this.x+2.25, this.y, this.width, this.height, 2);
		this.top_box.attr({fill: this.myColor, stroke: 'none'});
		this.top_graphic = paper.text(this.x+7, this.y+16, "Save");
		this.top_graphic.attr({'text-anchor': 'start', fill: '#FFFFFF', 'font-family': 'Myriad Pro', 'font-size': '20px'});
		this.hit_area = paper.rect(this.x, this.y, this.width+1.75, this.height+1.75, 2);
		this.hit_area.attr({fill: '#000000', opacity: 0, stroke: 'none'});
		this.onStage = true;
	},
	undraw: function(){
		this.back_box.remove();
		this.shader_box.remove();
		this.top_box.remove();
		this.top_graphic.remove();
		this.hit_area.remove();
		this.onStage = false;
	},
	set_x: function(new_x){
		this.x = this.x;
		this.back_box.attr({x: this.x});
		this.shader_box.attr({x: this.x});
		this.top_box.attr({x:this.x+2.25});
		this.top_graphic.attr({x: this.x+7});
		this.hit_area.attr({x: this.x+1.75});
	},
	set_y: function(new_y){
		this.y = new_y;
		this.back_box.attr({y: this.y+2.25});
		this.shader_box.attr({y: this.y+2.25});
		this.top_box.attr({y: this.y});
		this.top_graphic.attr({y: this.y+13});
		this.hit_area.attr({y: this.y});
	},
	setColor: function(newColor){
		this.myColor = newColor;
		this.back_box.attr({fill: this.myColor});
		this.top_box.attr({fill: this.myColor});
	},
	addListeners: function(){
		var k6 = this;
		this.hit_area.click(function(event){
			event.preventDefault();
			k6.top_box.animate({x: k6.x, y: k6.y+2.25}, 100, '>');
			k6.top_graphic.animate({x: k6.x+4.75, y: k6.y+15.25}, 100, '>');
			var anim1 = Raphael.animation({x: k6.x+7, y: k6.y+13}, 100, '>');
			var anim2 = Raphael.animation({x: k6.x+2.25, y: k6.y}, 100, '>');
			k6.top_graphic.animate(anim1.delay(100));
			k6.top_box.animate(anim2.delay(100));
			save_chart();
		});
	},
});