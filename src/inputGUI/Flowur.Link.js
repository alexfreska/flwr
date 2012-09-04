// JavaScript Document
var Link = new Class({
	initialize: function(from_x, from_y, to_x, to_y){
		//Fix any issues with direction of line
		if(to_x<from_x){
			var temp = to_x;
			to_x = from_x;
			from_x = temp;	
		}
		if(to_y<from_y){
			var temp = to_y;
			to_y = from_y;
			from_y = temp;	
		}
		
		this.x = from_x;
		this.y = from_y;
		this.thickness = 3;
		this.myColor = '#999999';
		this.onStage = false;
		//SVG path version
		var rx = (to_x - from_x)/5;
		var ry = (to_y - from_y)/5;
		var x_axis_rot = 0;
		var large_arc_flag = 0;
		var sweep_flag = 1;
		var horiz_seg_length = (to_x - from_x) - rx;
		var vert_seg_length = (to_y - from_y) - ry;
		
		this.linking_line_top = paper.path('M'+this.x+','+this.y+'L'+(this.x+horiz_seg_length)+','+this.y+'A'+rx+','+ry+',0,0,1,'+(this.x+horiz_seg_length+rx)+','+(this.y+ry)+'L'+(this.x+horiz_seg_length+rx)+','+(this.y+ry+vert_seg_length)).attr({stroke: this.myColor, 'stroke-width': this.thickness}).toBack();
		this.linking_line_back = paper.path('M'+(this.x-1)+','+(this.y+1)+'L'+(this.x+horiz_seg_length-1)+','+(this.y+1)+'A'+rx+','+ry+',0,0,1,'+(this.x+horiz_seg_length+rx-1)+','+(this.y+ry+1)+'L'+(this.x+horiz_seg_length+rx-1)+','+(this.y+ry+vert_seg_length+1)).attr({stroke: '#000000', 'stroke-width': this.thickness}).toBack();
		
		background.toBack();
	},
});