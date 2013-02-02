// JavaScript Document
//Viewing Button, purely for testing...
var View_Button = new Class({
	initialize: function(){
		this.x;
		this.y;
		this.width;
		this.height;
		this.myText;
		this.myColor = '#00CC99';
		this.draw();
	},
	draw: function(){
		this.top_text = paper.text(this.x+5, this.y+10, "Done").attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 18});
		this.width = this.top_text.getBBox().width + 10;
		this.height = this.top_text.getBBox().height;
		this.fill_area = paper.rect(this.x, this.y, this.width, this.height,3).attr({'fill': '#000000', 'fill-opacity': 0, 'stroke': 'none'});
		this.hit_area = paper.rect(this.x, this.y, this.width, this.height,3).attr({'fill': '#000000', 'fill-opacity': 0, 'stroke': 'none'});
		
		this.rightLine = paper.rect(this.x+this.width+10, this.y, 1, this.height).attr({fill: '#555555', stroke: 'none'});
		this.top_text.toFront();
		this.hit_area.toFront();
		this.addListener();
	},
	toFront: function(){
		this.fill_area.toFront();
		this.top_text.toFront();
		this.hit_area.toFront();
		this.rightLine.toFront();
	},
	addListener: function(){
		var t = this;
		this.hit_area.hover(this.mouseoverFun, this.mouseoutFun);
		this.mouseoverFun = function(e){
			t.fill_area.attr({'fill-opacity': .3});
		};
		this.mouseoutFun = function(e){
			t.fill_area.attr({'fill-opacity': 0});
		};
	},
	removeListener: function(){
		this.hit_area.unhover(this.mouseoverFun, this.mouseoutFun);
	},
	undraw: function(){
		this.top_text.remove();
		this.fill_area.remove();
		this.hit_area.remove();
		this.rightLine.remove();
		this.removeListener();
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