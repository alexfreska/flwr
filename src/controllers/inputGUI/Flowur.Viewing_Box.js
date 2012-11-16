// JavaScript Document
// Written by Patrick Teague 
// Last update: 8/10/12
var Viewing_Box = new Class({
	initialize: function(){
		this.myText;
		this.myColor;
		this.myTexture;
		this.myType;
		this.myId;
		this.fromNodeId;
		this.toNodeId;
		this.linkToNodeId;
		this.myLayer;
		this.sides = {'top': true, 'right': true, 'bottom': true, 'left': true};
		this.dist;
		
		this.onStage = false;
		this.x;
		this.y;
		this.width;
		this.height;
		this.buffer = 25; //25
		this.radius = 0;  //2
	},
	draw: function(){
		this.top_text.attr({'x': (this.x+10), 'y': (this.y+this.height/2)});		
		this.back_box = viewPaper.rect(this.x, this.y, this.width, this.height, this.radius).attr({'fill': this.myColor, 'stroke': 'none'});
		this.top_box = viewPaper.rect(this.x, this.y, this.width, this.height, this.radius).attr({'fill': this.myColor, 'stroke': 'none'});
		if(this.myTexture != null){
			this.top_box.attr({'fill': 'url('+this.myTexture+')'});
		}
		this.top_text.toFront();
	},
	set_x: function(new_x){this.x = new_x;},
	set_y: function(new_y){this.y = new_y;},
	set_radius: function(new_rad){this.radius = new_rad;},
	set_color: function(new_color){this.myColor = new_color;},
	set_text: function(new_text){
		this.myText = new_text;
		var temp_text = viewPaper.text(0, 0, this.myText).attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 18});
		this.width = temp_text.getBBox().width + 20;
		this.height = temp_text.getBBox().height + 20;
		temp_text.remove();
		temp_text = null;
		
		this.top_text = viewPaper.text( this.x, this.y, this.myText).attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 18});
		if(this.width > 200){
			this.width = 200;
			var content = this.myText;
			var words = content.split(" ");
			var tempText = "";
			this.top_text.remove();
			this.top_text = viewPaper.text( this.x, this.y).attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 18});
			for(var i=0; i<words.length; i++){
					this.top_text.attr("text", tempText + " " + words[i]);
					if(this.top_text.getBBox().width > this.width-10){
						tempText += "\n" + words[i];	
					} else {
						tempText += " " + words[i];	
					}
			}
			this.top_text.attr("text", tempText.substring(1));
			this.width = this.top_text.getBBox().width + 20;
			this.height = this.top_text.getBBox().height + 20;	
		}
		
	},
	toFront: function(){
		this.back_box.toFront();
		this.top_box.toFront();
		this.top_text.toFront();
	},
	get_bounds: function(new_x, new_y){
		this.temp_box = viewPaper.rect(new_x, new_y, this.width, this.height, this.radius);
		var bounds = this.temp_box.getBBox();
		this.temp_box.remove();
		this.temp_box = null;
		return bounds;
	},
	get_text: function(){return this.myText;},
	get_type: function(){return this.myType;},
	set_type: function(new_type){this.myType = new_type;},
});