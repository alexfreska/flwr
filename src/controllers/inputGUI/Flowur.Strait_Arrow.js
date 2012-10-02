// JavaScript Document
// Written by Patrick Teague
// Last update: 9/4/12
var Strait_Arrow = new Class({
	initialize: function(x,y,t,f){
		this.id = 'arrow';
		this.to_id = t;
		this.from_id = f;
		this.x = x;
		this.y = y;
		this.perm_width = 80; //135
		this.perm_height = 8; //8
		this.light_angle = Math.PI/4;
		this.offset = .8;
		this.width = this.perm_width; //135
		this.height = this.perm_height*2; //16
		this.head_width = 10;
		this.thickness = 1;
		this.myAngle = 0;
		this.prevAngle = 0;
		this.onStage = false;
		this.draw();
	},
	setAngle: function(newAngle){
		this.myAngle = -newAngle;
		var shade_x = this.x -  this.offset*Math.cos(this.light_angle - this.myAngle*Math.PI/180) ;
		var shade_y = this.y + this.offset*Math.sin(this.light_angle - this.myAngle*Math.PI/180) ;
		var y_dim = this.y + this.height/2;
		this.height = Math.abs(Math.sin(this.myAngle*Math.PI/180)*this.perm_width);
		//this.width = Math.abs(Math.cos(this.myAngle*Math.PI/180)*this.perm_width);		
		this.bottom_graphic.remove();
		this.bottom_graphic = paper.path('M'+shade_x+','+shade_y+'h'+(this.width-this.head_width)+'v'+(-((this.perm_height/2)-this.thickness))+'l'+this.head_width+','+(this.perm_height/2)+'l'+(-this.head_width)+','+(this.perm_height/2)+'v'+(-((this.perm_height/2)-this.thickness))+'h'+(-(this.width-this.head_width))+'v'+(-this.thickness)).attr({fill: '#000000', stroke: 'none'});
		this.top_graphic.transform('r'+this.myAngle+','+this.x+','+y_dim);
		this.bottom_graphic.transform('r'+this.myAngle+','+this.x+','+y_dim);
		//this.bottom_graphic.translate(this.x - shade_x, this.y +shade_y);
		this.top_graphic.toFront();
	},
	getAngle: function(){return this.myAngle;},
	setPrevAngle: function(newAngle){this.prevAngle = newAngle;},
	getPrevAngle: function(){return this.prevAngle;},
	draw: function(){
		var shade_x = this.x-this.offset;
		var shade_y = this.y+this.offset;
		this.bottom_graphic = paper.path('M'+shade_x+','+shade_y+'h'+(this.width-this.head_width)+'v'+(-((this.perm_height/2)-this.thickness))+'l'+this.head_width+','+(this.perm_height/2)+'l'+(-this.head_width)+','+(this.perm_height/2)+'v'+(-((this.perm_height/2)-this.thickness))+'h'+(-(this.width-this.head_width))+'v'+(-this.thickness)).attr({fill: '#000000', stroke: 'none'});
		
		this.top_graphic = paper.path("M100,100h"+(this.width-this.head_width)+'v'+(-((this.perm_height/2)-this.thickness))+'l'+this.head_width+','+(this.perm_height/2)+'l'+(-this.head_width)+','+(this.perm_height/2)+'v'+(-((this.perm_height/2)-this.thickness))+'h'+(-(this.width-this.head_width))+'v'+(-this.thickness)).attr({fill: '#999999', stroke: 'none'});
		this.onStage = true;
	},
	undraw: function(){
		this.top_graphic.remove();
		this.bottom_graphic.remove();
		this.onStage = false;
	},
	set_x: function(new_x){
		this.x = new_x;
		var shade_x = this.x - Math.abs( Math.cos(this.myAngle) );
		var shade_y = this.y + Math.abs( Math.sin(this.myAngle) );
		this.top_graphic.remove();
		this.bottom_graphic.remove();
		this.bottom_graphic = paper.path('M'+shade_x+','+shade_y+'h'+(this.width-this.head_width)+'v'+(-((this.perm_height/2)-this.thickness))+'l'+this.head_width+','+(this.perm_height/2)+'l'+(-this.head_width)+','+(this.perm_height/2)+'v'+(-((this.perm_height/2)-this.thickness))+'h'+(-(this.width-this.head_width))+'v'+(-this.thickness)).attr({fill: '#000000', stroke: 'none'});
		//this.bottom_graphic = paper.path("M"+shade_x+","+shade_y+"h120v"+(-(this.perm_height-3))+"l12,"+(this.perm_height-1.1)+"l-12,"+(this.perm_height-1.1)+"v"+(-(this.perm_height-3))+"h-120v-"+(this.perm_height-4.2)+"").attr({fill: '#000000', stroke: 'none'});
		this.top_graphic = paper.path("M"+this.x+","+this.y+"h"+(this.width-this.head_width)+'v'+(-((this.perm_height/2)-this.thickness))+'l'+this.head_width+','+(this.perm_height/2)+'l'+(-this.head_width)+','+(this.perm_height/2)+'v'+(-((this.perm_height/2)-this.thickness))+'h'+(-(this.width-this.head_width))+'v'+(-this.thickness)).attr({fill: '#999999', stroke: 'none'});
	},
	determineOnStage: function(){
		if(this.x > stage.innerWidth || this.x+this.width<0)
			this.onStage = false;
		else if(this.y > stage.innerHeight || this.y+this.height<0)
			this.onStage = false;
		else
			this.onStage = true;
	},
	set_y: function(new_y){
		this.y = new_y;
		var shade_x = this.x - Math.abs( Math.cos(this.myAngle) );
		var shade_y = this.y + Math.abs( Math.sin(this.myAngle) );
		this.top_graphic.remove();
		this.bottom_graphic.remove();
		this.bottom_graphic = paper.path('M'+shade_x+','+shade_y+'h'+(this.width-this.head_width)+'v'+(-((this.perm_height/2)-this.thickness))+'l'+this.head_width+','+(this.perm_height/2)+'l'+(-this.head_width)+','+(this.perm_height/2)+'v'+(-((this.perm_height/2)-this.thickness))+'h'+(-(this.width-this.head_width))+'v'+(-this.thickness)).attr({fill: '#000000', stroke: 'none'});
		//this.bottom_graphic = paper.path("M"+shade_x+","+shade_y+"h120v"+(-(this.perm_height-3))+"l12,"+(this.perm_height-1.1)+"l-12,"+(this.perm_height-1.1)+"v"+(-(this.perm_height-3))+"h-120v-"+(this.perm_height-4.2)+"").attr({fill: '#000000', stroke: 'none'});
		this.top_graphic = paper.path("M"+this.x+","+this.y+"h"+(this.width-this.head_width)+'v'+(-((this.perm_height/2)-this.thickness))+'l'+this.head_width+','+(this.perm_height/2)+'l'+(-this.head_width)+','+(this.perm_height/2)+'v'+(-((this.perm_height/2)-this.thickness))+'h'+(-(this.width-this.head_width))+'v'+(-this.thickness)).attr({fill: '#999999', stroke: 'none'});
	},
	get_info_struct: function(){
		var info_struct = {
			'to': this.to_id,
			'from': this.from_id,
			'isLink': false
		};
		return info_struct;
	}
});