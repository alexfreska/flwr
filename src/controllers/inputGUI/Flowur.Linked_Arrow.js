// JavaScript Document
// Written by Patrick Teague
// Last update: 9/4/12
/*
   ||
   ||
  _||_
  \  /
   \/
*/
var Linked_Arrow = new Class({
	initialize: function(x,y, lnode){
		this.x = x;
		this.y = y;
		//Arrow graphic related variables
		this.width = 17;
		this.height = 35;//45
		this.thickness = 2;
		this.head_height = 8;
		this.head_width = 10;
		//End arrow graphic related variables
		this.onStage = false;
		this.myLinkingArrow;
		this.linked_node = lnode;
		var b = this;
		var setup_obs = function(){
			var scale = .7;
			var obs_radius = 0; //4
			var node_offset = 1.2;
			var node_radius = 0; //4
			var n_color =  b.linked_node.getColor();
			var n_width = b.linked_node.width * scale;
			var n_height = b.linked_node.height * scale;
			var obs_width = n_width+40;//220;
			var obs_height = n_height+40;//120;
			var obs_offset = 5;
			var n_x = b.x + (b.width/2 - obs_width/2) + (obs_width/2 - n_width/2);
			var n_y = b.y - (b.height+obs_offset) - (obs_height/2) + (obs_height/2 - n_height/2);
			
			b.obs_box_back = paper.rect(b.x + (b.width/2 - obs_width/2), b.y - (b.height+obs_offset) - (obs_height/2), obs_width, obs_height, obs_radius).attr({fill: '#000000', stroke: 'none', 'opacity': .7});
			b.obs_box_top = paper.rect(b.x + (b.width/2 - (obs_width-10)/2), b.y - (b.height+obs_offset) - (obs_height-obs_offset)/2, (obs_width-obs_offset), (obs_height-obs_offset), obs_radius).attr({fill: '#EEEEEE', stroke: 'none', 'opacity': 1});
			
			b.obs_node_back_box = paper.rect(n_x, n_y +(node_offset*scale), n_width, n_height, node_radius*scale).attr({'fill': n_color, 'stroke': 'none'});
			
			b.obs_node_back_shader = b.obs_node_back_box.clone();
			b.obs_node_back_shader.attr({'fill': '#000000', 'opacity': .45});
			
			b.obs_node_top_box = paper.rect(n_x+(node_offset*scale), n_y , n_width, n_height, node_radius*scale).attr({'fill': n_color, 'stroke': 'none'});
			
			var content = b.linked_node.myText;
			var words = content.split(" ");
			var tempText = "";
			
			b.obs_node_text = paper.text( b.x, b.y).attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': (20*scale)});
			for(var i=0; i<words.length; i++){
					b.obs_node_text.attr("text", tempText + " " + words[i]);
					if(b.obs_node_text.getBBox().width > n_width - (10*scale) ){
						tempText += "\n" + words[i];	
					} else {
						tempText += " " + words[i];	
					}
			}
			b.obs_node_text.attr("text", tempText.substring(1));
			var txt_x = n_x + (n_width/2 - b.obs_node_text.getBBox().width/2);
			var txt_y = n_y + ((n_height - b.obs_node_text.getBBox().height + b.obs_node_text.getBBox().height)/2);
			b.obs_node_text.attr({x: txt_x, y: txt_y});
			b.arrow_out();
		};
		this.arrow_over = function(e){
			b.obs_node_back_box.attr({fill: b.linked_node.getColor()});
			b.obs_node_top_box.attr({fill: b.linked_node.getColor()});
			
			b.obs_box_back.toFront();
			b.obs_box_top.toFront();
			b.obs_node_back_box.toFront();
			b.obs_node_back_shader.toFront();
			b.obs_node_top_box.toFront();
			b.obs_node_text.toFront();
			
			b.obs_box_back.show();
			b.obs_box_top.show();
			b.obs_node_back_box.show();
			b.obs_node_back_shader.show();
			b.obs_node_top_box.show();
			b.obs_node_text.show();
		};
		this.arrow_out = function(e){
			b.obs_box_back.hide();
			b.obs_box_top.hide();
			b.obs_node_back_shader.hide();
			b.obs_node_back_box.hide();
			b.obs_node_top_box.hide();
			b.obs_node_text.hide();
		};
		setup_obs();
		this.top_graphic = paper.path('M'+this.x+','+(this.y+(this.height-this.head_height))+'h'+((this.head_width/2)-(this.thickness/2))+'v'+(-(this.height-this.head_height))+'h'+this.thickness+'v'+(this.height-this.head_height)+'h'+((this.head_width/2)-(this.thickness/2))+'l'+(-(this.head_width/2))+','+this.head_height+'l'+(-(this.head_width/2))+','+(-this.head_height)).attr({fill: '#999999', stroke: 'none'});
		this.back_graphic = this.top_graphic.clone().attr({'fill': '#000000'});
		this.back_graphic.translate(-.4,.8);
		this.top_graphic.toFront();
		this.striker_box = paper.rect(this.x, this.y, this.width, this.height).attr({'fill': '#000000', 'stroke': 'none', 'fill-opacity': 0});
		this.draw();
	},
	draw: function(){
		this.back_graphic.show();
		this.top_graphic.show();
		this.striker_box.show();
		this.addListeners();
		this.onStage = true;
	},
	addListeners: function(){
		this.striker_box.mouseover(this.arrow_over);		
		this.striker_box.mouseout(this.arrow_out);	
	},
	removeListeners: function(){
		this.striker_box.unmouseover(this.arrow_over);
		this.striker_box.unmouseout(this.arrow_out);
	},
	undraw: function(){
		this.arrow_out();
		this.back_graphic.hide();
		this.top_graphic.hide();
		this.striker_box.hide();
		this.removeListeners();
		this.onStage = false;
	},
	move_to: function(new_x, new_y, us){
		this.x = new_x;
		this.y = new_y;
		this.top_graphic.remove();
		this.back_graphic.remove();
		this.top_graphic = paper.path('M'+this.x+','+(this.y+(this.height-this.head_height))+'h'+((this.head_width/2)-(this.thickness/2))+'v'+(-(this.height-this.head_height))+'h'+this.thickness+'v'+(this.height-this.head_height)+'h'+((this.head_width/2)-(this.thickness/2))+'l'+(-(this.head_width/2))+','+this.head_height+'l'+(-(this.head_width/2))+','+(-this.head_height)).attr({fill: '#999999', stroke: 'none'});
		this.back_graphic = this.top_graphic.clone().attr({'fill': '#000000'});
		this.back_graphic.translate(-.4,.8);
		this.top_graphic.toFront();
		this.striker_box.attr({'x': this.x, 'y': this.y});
		this.striker_box.toFront();
	},
	set_node: function(node){
		this.linked_node = node;
	},
	set_x: function(new_x){
		this.x = new_x;
		this.top_graphic.remove();
		this.back_graphic.remove();
		this.top_graphic = paper.path('M'+this.x+','+(this.y+(this.height-this.head_height))+'h'+((this.head_width/2)-(this.thickness/2))+'v'+(-(this.height-this.head_height))+'h'+this.thickness+'v'+(this.height-this.head_height)+'h'+((this.head_width/2)-(this.thickness/2))+'l'+(-(this.head_width/2))+','+this.head_height+'l'+(-(this.head_width/2))+','+(-this.head_height)).attr({fill: '#999999', stroke: 'none'});
		this.back_graphic = this.top_graphic.clone().attr({'fill': '#000000'});
		this.back_graphic.translate(-.4,.8);
		this.top_graphic.toFront();
		this.striker_box.attr({'x': this.x, 'y': this.y});
		this.striker_box.toFront();
		///////////////////////////////////////
		var scale = .7;
		var node_offset = 1.2;
		var n_width = this.linked_node.width * scale;
		var obs_width = n_width+40;//220;
		var obs_offset = 5;
		var n_x = this.x + (this.width/2 - obs_width/2) + (obs_width/2 - n_width/2);
		
		this.obs_box_back.attr({x: this.x + (this.width/2 - obs_width/2)});
		this.obs_box_top.attr({x: this.x + (this.width/2 - (obs_width-obs_offset)/2)});
		this.obs_node_back_shader.attr({x: n_x});
		this.obs_node_back_box.attr({x: n_x});
		this.obs_node_top_box.attr({x: n_x+(node_offset*scale)});
		this.obs_node_text.attr({x: n_x + (n_width/2 - this.obs_node_text.getBBox().width/2)});
	},
	set_y: function(new_y){
		this.y = new_y;
		this.top_graphic.remove();
		this.back_graphic.remove();
		this.top_graphic = paper.path('M'+this.x+','+(this.y+(this.height-this.head_height))+'h'+((this.head_width/2)-(this.thickness/2))+'v'+(-(this.height-this.head_height))+'h'+this.thickness+'v'+(this.height-this.head_height)+'h'+((this.head_width/2)-(this.thickness/2))+'l'+(-(this.head_width/2))+','+this.head_height+'l'+(-(this.head_width/2))+','+(-this.head_height)).attr({fill: '#999999', stroke: 'none'});
		this.back_graphic = this.top_graphic.clone().attr({'fill': '#000000'});
		this.back_graphic.translate(-.4,.8);
		this.top_graphic.toFront();
		this.striker_box.attr({'x': this.x, 'y': this.y});
		this.striker_box.toFront();
		///////////////////////////////////
		var scale = .7;
		var node_offset = 1.2;
		var n_height = this.linked_node.height * scale;
		var obs_height = n_height+40;//120;
		var obs_offset = 5;
		var n_y = this.y - (this.height+obs_offset) - (obs_height/2) + (obs_height/2 - n_height/2);
		
		this.obs_box_back.attr({y: this.y - (this.height+obs_offset) - (obs_height/2)});
		this.obs_box_top.attr({y: this.y - (this.height+obs_offset) - (obs_height-obs_offset)/2});
		this.obs_node_back_shader.attr({y: n_y +(node_offset*scale)});
		this.obs_node_back_box.attr({y: n_y +(node_offset*scale)});
		this.obs_node_top_box.attr({y: n_y});
		this.obs_node_text.attr({y: n_y + ((n_height - this.obs_node_text.getBBox().height + this.obs_node_text.getBBox().height)/2)});
	},
});