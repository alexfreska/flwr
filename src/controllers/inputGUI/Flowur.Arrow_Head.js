// JavaScript Document
// Written by Patrick Teague 8/7/12
var Arrow_Head = new Class({
	initialize: function(col, dir, x, y){
		this.direction = dir;
		this.x = x;
		this.y = y;
		this.myColor = col;
		this.width = 10;
		this.height = 10;
		this.draw();
	},
	draw: function(){
		if(this.direction === "right"){
			this.head = paper.path("M"+this.x+","+this.y+"V"+(this.y + this.height)+"L"+(this.x+this.width)+","+(this.y+(this.height/2))+"Z");
		}
		else if(this.direction === "left"){
			this.head = paper.path("M"+this.x+","+(this.y+(this.height/2))+"L"+(this.x+this.width)+","+(this.y+this.height)+"V"+(this.y)+"Z");
		}
		else if(this.direction == "up"){
			this.head = paper.path("M"+this.x+","+(this.y+this.height)+"H"+(this.x+this.width)+"L"+(this.x+(this.width/2))+","+this.y+"Z");
		}
		else{
			this.head = paper.path("M"+this.x+","+this.y+"H"+(this.x+this.width)+"L"+(this.x+(this.width/2))+","+(this.y+this.height)+"Z");
		}
		this.head.attr({'fill': this.myColor, 'stroke': 'none'});
	},
});