// JavaScript Document
// Written by Patrick Teague
// Last update: 8/10/12
var Boundary_Box = new Class({
	initialize: function(){
		this.width;
		this.height;
		this.x;
		this.y;
	},
	get_direction: function(box, parent, viewer){
		var box_x, box_y;
		//check right
		box_x = parent.x + parent.width + parent.buffer + box.buffer;
		box_y = parent.y + parent.height/2 - box.height/2;
		var right_expansion;
		var right_avail = false;
		if(viewer.check_for_interference(box_x, box_y, box)){		
			right_avail = true;
			right_expansion = (box.width) - (this.x + this.width - (box_x-box.buffer));
			if(right_expansion < 0)
				right_expansion = 0;
		}
		//check left
		box_x = parent.x - (parent.buffer + box.width + box.buffer);
		box_y = parent.y + parent.height/2 - box.height/2;
		
		var left_expansion;
		var left_avail = false;
		if(viewer.check_for_interference(box_x, box_y, box)){
			left_avail = true;
			left_expansion = this.x - (box_x + box.buffer);
			if(left_expansion < 0)
				left_expansion = 0;
		}
		//check up
		box_x = parent.x + parent.width/2 - box.width/2;
		box_y = parent.y - (parent.buffer + box.buffer + box.height);
		
		var up_expansion;
		var up_avail = false;
		if(viewer.check_for_interference(box_x, box_y, box)){
			("c");
			up_avail = true;
			up_expansion = this.y - (box_y + box.buffer);
			if(up_expansion < 0)
				up_expansion = 0;
		}
		//check down
		box_x = parent.x + parent.width/2 - box.width/2;
		box_y = parent.y + parent.height + parent.buffer + box.buffer;
		
		var down_expansion;
		var down_avail = false;
		if(viewer.check_for_interference(box_x, box_y, box)){
			down_avail = true;
			down_expansion = (box.height) - (this.y + this.height - (box_y-box.buffer));
			if(down_expansion < 0)
				down_expansion = 0;
		}
		//Now that you have all of the total expansions, find the direction with the smallest amount of expansion required, then return the direction.	
		var width_expansion, height_expansion;
		var left_or_right, up_or_down;
		
		if(right_avail && left_avail){
			if(left_expansion > right_expansion){
				width_expansion = left_expansion;
				left_or_right = "left";	
			}
			else{
				width_expansion = right_expansion;
				left_or_right = "right";	
			}
		}
		else if(right_avail && !left_avail){
			width_expansion = right_expansion;
			left_or_right = "right";	
		}
		else if(!right_avail && left_avail){
			width_expansion = left_expansion;
			left_or_right = "left";	
		}
		
		if(up_avail && down_avail){
			if(down_expansion <= up_expansion){
				height_expansion = down_expansion;
				up_or_down = "down";	
			}
			else{
				height_expansion = up_expansion;
				up_or_down = "up";	
			}
		}
		else if(up_avail && !down_avail){
			height_expansion = up_expansion;
			up_or_down = "up";	
		}
		else if(!up_avail && down_avail){
			height_expansion = down_expansion;
			up_or_down = "down";	
		}
		else{
			return left_or_right;
		}
		//Now compare the expansions to see which one gives the best aspect ratio for the current screen size.
		var screen_ratio = (stage.innerWidth / stage.innerHeight);
		var width_diff = Math.abs( ((this.width + width_expansion)/this.height) - screen_ratio);
		var height_diff = Math.abs( ( this.width/(this.height + height_expansion) ) - screen_ratio);
		if( width_diff <= height_diff )
			return left_or_right;
		else
			return up_or_down;
	},
});