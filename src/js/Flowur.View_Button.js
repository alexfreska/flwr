// JavaScript Document
//Viewing Button, purely for testing...
var View_Button = new Class({
	initialize: function(){
		this.x;
		this.y;
		this.width;
		this.height;
		this.myText;
		this.myColor = '#00CC99';;
		this.top_text;
		this.top_box;
		this.hit_area;
		this.draw();
	},
	draw: function(){
		this.top_text = paper.text(this.x+5, this.y+15, "View").attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 18});
		this.width = this.top_text.getBBox().width + 10;
		this.height = this.top_text.getBBox().height + 10;
		this.back_box = paper.rect(this.x-2, this.y+2, this.width, this.height, 3).attr({fill: this.myColor, 'stroke': 'none'});
		this.shader_box = this.back_box.clone().attr({'fill-opacity': .45, 'fill': '#000000'});
		this.top_box = paper.rect(this.x, this.y, this.width, this.height, 3).attr({fill: this.myColor, 'stroke': 'none'});
		this.top_text.toFront();
	},
	undraw: function(){
		this.top_text.remove();
		this.top_box.remove();
		this.back_box.remove();
		this.shader_box.remove();
	},
	set_x: function(new_x){
		this.x = new_x;
		this.undraw();
		this.draw();
	},
	set_y: function(new_y){
		this.y = new_y;
		this.undraw();
		this.draw();
	}
});