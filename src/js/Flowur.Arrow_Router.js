// JavaScript Document
// Written by Patrick Teague 8/7/12
var Arrow_Router = new Class({
	initialize: function(col){
		//this.width;
		//this.height;
		this.myColor = col;
		this.buffer = 2;
		this.seg_width = 2;
		
		this.all_arrows = new Array();
	},
	//Route arrow from box, to box
	route: function(from, to){
		 // arrow[0] = arrow_head
		 // arrow[1] = vert_segment
		 // arrow[2] = horiz_segment
		 // arrow[3] = third_segment
		 var arrow = new Array();
		 
		 var f_mid_y = from.y+from.height/2;
		 var f_mid_x = from.x+from.width/2;
		 var t_mid_y = to.y+to.height/2;
		 var t_mid_x = to.x+to.width/2;
		 
		 if( Math.abs(f_mid_y - t_mid_y) > Math.abs(f_mid_x - t_mid_x) ){
			 //If above
			if(f_mid_y - t_mid_y > 0){
				//Up right
				if(f_mid_x - t_mid_x < 0){
					if(f_mid_x >= to.x ){
						//Up right up
						arrow[0] = new Arrow_Head(this.myColor, "up", t_mid_x-5, to.y+to.height+this.buffer);
						arrow[1] = paper.rect(f_mid_x - this.seg_width/2, (from.y-this.buffer-this.seg_width/2) - (((from.y-this.buffer-this.seg_width/2)-(arrow[0].y+arrow[0].height))/2), this.seg_width, ((from.y-this.buffer-this.seg_width/2)-(arrow[0].y+arrow[0].height))/2);
						arrow[2] = paper.rect(f_mid_x-this.seg_width/2, (from.y-this.buffer-this.seg_width/2) - (((from.y-this.buffer-this.seg_width/2)-(arrow[0].y+arrow[0].height))/2), (t_mid_x+this.seg_width/2)-(f_mid_x-this.seg_width/2), this.seg_width);
						arrow[3] = paper.rect(t_mid_x-this.seg_width/2, arrow[0].y+arrow[0].height, this.seg_width, ((from.y-this.buffer-this.seg_width/2)-(arrow[0].y+arrow[0].height))/2);
						arrow[3].attr({'fill': this.myColor, 'stroke': 'none' });
					}
					else{
						//Just Up Right
						arrow[0] = new Arrow_Head(this.myColor, "right", to.x-this.buffer-10, t_mid_y-5);
						arrow[1] = paper.rect(f_mid_x - this.seg_width/2, t_mid_y+this.seg_width/2, this.seg_width, from.y-(t_mid_y+this.buffer+this.seg_width) );
						arrow[2] = paper.rect(f_mid_x - this.seg_width/2, t_mid_y-this.seg_width/2, arrow[0].x - (f_mid_x - this.seg_width/2), this.seg_width);
					}
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				}
				//Up left
				else if(f_mid_x - t_mid_x > 0){
					if(f_mid_x <= to.x+to.width ){
						//Up left up
						arrow[0] = new Arrow_Head(this.myColor, "up", t_mid_x-5, to.y+to.height+this.buffer);
						arrow[1] = paper.rect(f_mid_x - this.seg_width/2, (from.y-this.buffer-this.seg_width/2) - (((from.y-this.buffer-this.seg_width/2)-(arrow[0].y+arrow[0].height))/2), this.seg_width, ((from.y-this.buffer-this.seg_width/2)-(arrow[0].y+arrow[0].height))/2);
						arrow[2] = paper.rect(t_mid_x-this.seg_width/2, (from.y-this.buffer-this.seg_width/2) - (((from.y-this.buffer-this.seg_width/2)-(arrow[0].y+arrow[0].height))/2), (f_mid_x+this.seg_width/2)-(t_mid_x-this.seg_width/2), this.seg_width);
						arrow[3] = paper.rect(t_mid_x-this.seg_width/2, arrow[0].y+arrow[0].height, this.seg_width, ((from.y-this.buffer-this.seg_width/2)-(arrow[0].y+arrow[0].height))/2); 
						arrow[3].attr({'fill': this.myColor, 'stroke': 'none' });
					}
					else{
						//Just Up left
						arrow[0] = new Arrow_Head(this.myColor, "left", to.x+to.width+this.buffer, t_mid_y-5);
						arrow[1] = paper.rect(f_mid_x - this.seg_width/2, t_mid_y+this.seg_width/2, this.seg_width, from.y-(t_mid_y+this.buffer+this.seg_width) );
						arrow[2] = paper.rect(arrow[0].x+arrow[0].width, t_mid_y-this.seg_width/2, (f_mid_x+this.seg_width/2) - (arrow[0].x+arrow[0].width), this.seg_width);
					}
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				}
				//Just Up
				else{
					arrow[0] = new Arrow_Head(this.myColor, "up", t_mid_x-5, to.y + to.height + this.buffer);
					arrow[1] = paper.rect(f_mid_x-this.seg_width/2, arrow[0].y + arrow[0].height, this.seg_width, (from.y-this.buffer-this.seg_width) - (arrow[0].y+arrow[0].height) );
					
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
				}
			}
			//Else below
			else{
				//Down right
				if(f_mid_x - t_mid_x < 0){
					if(f_mid_x >= to.x){
						//Down right down	
						arrow[0] = new Arrow_Head(this.myColor, "down", t_mid_x-5, to.y-this.buffer-10);
						arrow[1] = paper.rect(f_mid_x-this.seg_width/2, from.y+from.height+this.buffer+this.seg_width, this.seg_width, (arrow[0].y - (from.y+from.height+this.buffer+this.seg_width) )/2);
						arrow[2] = paper.rect(f_mid_x-this.seg_width/2, (from.y+from.height+this.buffer+this.seg_width) + ((arrow[0].y - (from.y+from.height+this.buffer+this.seg_width) )/2), (t_mid_x+this.seg_width/2)-(f_mid_x-this.seg_width/2), this.seg_width);
						arrow[3] = paper.rect(t_mid_x-this.seg_width/2, (from.y+from.height+this.buffer+(this.seg_width*2)) + ((arrow[0].y - (from.y+from.height+this.buffer+this.seg_width) )/2), this.seg_width, (arrow[0].y - (from.y+from.height+this.buffer+this.seg_width) )/2);
						arrow[3].attr({'fill': this.myColor, 'stroke': 'none' });
					}
					else{
						//Just down right
						arrow[0] = new Arrow_Head(this.myColor, "right", to.x-this.buffer-10, t_mid_y-5);
						arrow[1] = paper.rect(f_mid_x - this.seg_width/2, from.y+from.height+this.buffer+this.seg_width, this.seg_width, (t_mid_y-this.seg_width) - (from.y+from.height+this.buffer) );
						arrow[2] = paper.rect(f_mid_x - this.seg_width/2, t_mid_y-this.seg_width/2, arrow[0].x - (f_mid_x - this.seg_width/2), this.seg_width);
					}
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				}
				//Down left
				else if(f_mid_x - t_mid_x > 0){
					if(f_mid_x <= to.x+to.width ){
						//Down left down
						arrow[0] = new Arrow_Head(this.myColor, "down", t_mid_x-5, to.y-this.buffer-10);
						arrow[1] = paper.rect(f_mid_x-this.seg_width/2, from.y+from.height+this.buffer+this.seg_width, this.seg_width, (arrow[0].y - (from.y+from.height+this.buffer+this.seg_width) )/2);
						arrow[2] = paper.rect(t_mid_x-this.seg_width/2, (from.y+from.height+this.buffer+this.seg_width) + ((arrow[0].y - (from.y+from.height+this.buffer+this.seg_width) )/2), (f_mid_x+this.seg_width/2)-(t_mid_x-this.seg_width/2), this.seg_width);
						arrow[3] = paper.rect(t_mid_x-this.seg_width/2, (from.y+from.height+this.buffer+(this.seg_width*2)) + ((arrow[0].y - (from.y+from.height+this.buffer+this.seg_width) )/2), this.seg_width, (arrow[0].y - (from.y+from.height+this.buffer+this.seg_width) )/2);
						arrow[3].attr({'fill': this.myColor, 'stroke': 'none' });
					}
					else{
						//Just down left
						arrow[0] = new Arrow_Head(this.myColor, "left", to.x+to.width+this.buffer, t_mid_y-5);
						arrow[1] = paper.rect(f_mid_x - this.seg_width/2, from.y+from.height+this.buffer+this.seg_width, this.seg_width, (t_mid_y-this.seg_width) - (from.y+from.height+this.buffer) );
						arrow[2] = paper.rect(arrow[0].x+arrow[0].width, t_mid_y-this.seg_width/2, (f_mid_x+this.seg_width/2) - (arrow[0].x+arrow[0].width), this.seg_width );
					}
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				}
				//Just Down
				else{
					arrow[0] = new Arrow_Head(this.myColor, "down", t_mid_x-5, to.y-this.buffer-10);
					arrow[1] = paper.rect(f_mid_x - this.seg_width/2, from.y+from.height+this.buffer+this.seg_width, this.seg_width, arrow[0].y - (from.y+from.height+this.buffer+this.seg_width) );
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
				}
			}
		 }
		 //Left or Right
		 else{
			 //Left
			 if(f_mid_x - t_mid_x > 0){
			 	//Left down
				if(f_mid_y - t_mid_y < 0){
					if(to.y <= f_mid_y){
						//Left down left	
						arrow[0] = new Arrow_Head(this.myColor, "left", to.x+to.width+this.buffer, t_mid_y-5);
						arrow[2] = paper.rect( (from.x-this.buffer-this.seg_width)- ( ( ((from.x-this.buffer-this.seg_width)-(arrow[0].x+arrow[0].width))/2) ), f_mid_y-this.seg_width/2, ( ((from.x-this.buffer-this.seg_width)-(arrow[0].x+arrow[0].width))/2), this.seg_width);
						arrow[1] = paper.rect((from.x-this.buffer-(this.seg_width*2))-( ((from.x-this.buffer-this.seg_width)-(arrow[0].x+arrow[0].width))/2), f_mid_y-this.seg_width/2, this.seg_width, (t_mid_y+this.seg_width/2)-(f_mid_y-this.seg_width/2));
						arrow[3] = paper.rect(arrow[0].x+arrow[0].width, t_mid_y-this.seg_width/2, ( ((from.x-this.buffer-this.seg_width)-(arrow[0].x+arrow[0].width))/2), this.seg_width);
						arrow[3].attr({'fill': this.myColor, 'stroke': 'none' });
					}
					else{
						//Just left down
						arrow[0] = new Arrow_Head(this.myColor, "down", t_mid_x-5, to.y-this.buffer-10);
						arrow[1] = paper.rect(t_mid_x-this.seg_width/2, f_mid_y-this.seg_width/2, this.seg_width, arrow[0].y-(f_mid_y-this.seg_width/2) );
						arrow[2] = paper.rect(t_mid_x+this.seg_width/2, f_mid_y-this.seg_width/2, (from.x-this.buffer-this.seg_width)-(t_mid_x+this.seg_width/2), this.seg_width);
					}
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				}
				//Left up
				else if(f_mid_y - t_mid_y > 0){
					if(f_mid_y <= to.y+to.height ){
						//Left up left
						arrow[0] = new Arrow_Head(this.myColor, "left", to.x+to.width+this.buffer, t_mid_y-5);
						arrow[2] = paper.rect( (from.x-this.buffer-this.seg_width)- ( ( ((from.x-this.buffer-this.seg_width)-(arrow[0].x+arrow[0].width))/2) ), f_mid_y-this.seg_width/2, ( ((from.x-this.buffer-this.seg_width)-(arrow[0].x+arrow[0].width))/2), this.seg_width);
						arrow[1] = paper.rect((from.x-this.buffer-(this.seg_width*2))-( ((from.x-this.buffer-this.seg_width)-(arrow[0].x+arrow[0].width))/2), t_mid_y-this.seg_width/2, this.seg_width, (f_mid_y+this.seg_width/2)-(t_mid_y-this.seg_width/2));
						arrow[3] = paper.rect(arrow[0].x+arrow[0].width, t_mid_y-this.seg_width/2, ( ((from.x-this.buffer-this.seg_width)-(arrow[0].x+arrow[0].width))/2), this.seg_width);
						arrow[3].attr({'fill': this.myColor, 'stroke': 'none' });
					}
					else{
						//Just Left up
						arrow[0] = new Arrow_Head(this.myColor, "up", t_mid_x-5, to.y+to.height+this.buffer);
						arrow[1] = paper.rect(t_mid_x-this.seg_width/2, arrow[0].y+arrow[0].height, this.seg_width, (f_mid_y-this.seg_width/2)-(arrow[0].y+arrow[0].height));
						arrow[2] = paper.rect(t_mid_x-this.seg_width/2, f_mid_y-this.seg_width/2, (from.x-this.buffer-this.seg_width)-(t_mid_x+this.seg_width/2), this.seg_width);
					}
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				}
				//Just left
				else{
					arrow[0] = new Arrow_Head(this.myColor, "left", to.x+to.width+this.buffer, t_mid_y-5);
					arrow[2] = paper.rect(arrow[0].x+arrow[0].width, t_mid_y-this.seg_width/2, from.x - this.buffer - this.seg_width -(arrow[0].x+arrow[0].width), this.seg_width);
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				}
			 }
			 //Right
			 else{
				//Right down
				if(f_mid_y - t_mid_y < 0){
					if(to.y <= f_mid_y){
						//Right down right	
						arrow[0] = new Arrow_Head(this.myColor, "right", to.x-this.buffer-10,t_mid_y-5);
						arrow[2] = paper.rect(from.x+from.width+this.buffer+this.seg_width, f_mid_y-this.seg_width/2, (arrow[0].x - (from.x+from.width+this.buffer+this.seg_width) )/2, this.seg_width);
						arrow[1] = paper.rect(from.x+from.width+this.buffer+this.seg_width + ((arrow[0].x - (from.x+from.width+this.buffer+this.seg_width))/2), f_mid_y-this.seg_width/2, this.seg_width, (t_mid_y+this.seg_width/2)-(f_mid_y-this.seg_width/2));
						arrow[3] = paper.rect(from.x+from.width+this.buffer+(this.seg_width*2) + ((arrow[0].x - (from.x+from.width+this.buffer+this.seg_width))/2), t_mid_y-this.seg_width/2, (arrow[0].x - (from.x+from.width+this.buffer+this.seg_width))/2, this.seg_width);
						arrow[3].attr({'fill': this.myColor, 'stroke': 'none' });
					}
					else{
						//Just right down
						arrow[0] = new Arrow_Head(this.myColor, "down", t_mid_x-5, to.y-this.buffer-10);
						arrow[1] = paper.rect(t_mid_x-this.seg_width/2, f_mid_y-this.seg_width/2, this.seg_width, arrow[0].y-(f_mid_y-this.seg_width/2) );
						arrow[2] = paper.rect(from.x+from.width+this.buffer+this.seg_width, f_mid_y-this.seg_width/2, (t_mid_x-this.seg_width/2)-(from.x+from.width+this.buffer+this.seg_width), this.seg_width);
					}
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				}
				//Right up
				else if(f_mid_y - t_mid_y > 0){
					if(f_mid_y <= to.y+to.height ){
						//Right up right
						arrow[0] = new Arrow_Head(this.myColor, "right", to.x-this.buffer-10,t_mid_y-5);
						arrow[2] = paper.rect(from.x+from.width+this.buffer+this.seg_width, f_mid_y-this.seg_width/2, (arrow[0].x - (from.x+from.width+this.buffer+this.seg_width) )/2, this.seg_width);
						arrow[1] = paper.rect(from.x+from.width+this.buffer+this.seg_width + ((arrow[0].x - (from.x+from.width+this.buffer+this.seg_width))/2), t_mid_y-this.seg_width/2, this.seg_width, (f_mid_y+this.seg_width/2)-(t_mid_y-this.seg_width/2));
						arrow[3] = paper.rect(from.x+from.width+this.buffer+(this.seg_width*2) + ((arrow[0].x - (from.x+from.width+this.buffer+this.seg_width))/2), t_mid_y-this.seg_width/2, (arrow[0].x - (from.x+from.width+this.buffer+this.seg_width))/2, this.seg_width);
						arrow[3].attr({'fill': this.myColor, 'stroke': 'none' });
					}
					else{
						//Just right up
						arrow[0] = new Arrow_Head(this.myColor, "up", t_mid_x-5, to.y+to.height+this.buffer);
						arrow[1] = paper.rect(t_mid_x-this.seg_width/2, arrow[0].y+arrow[0].height, this.seg_width, (f_mid_y-this.seg_width/2)-(arrow[0].y+arrow[0].height));
						arrow[2] = paper.rect(from.x+from.width+this.buffer+this.seg_width/2, f_mid_y-this.seg_width/2, (t_mid_x+this.seg_width/2)-(from.x+from.width+this.buffer+this.seg_width/2), this.seg_width);
					}
					arrow[1].attr({'fill': this.myColor, 'stroke': 'none' });
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				}
				//Just Right
				else{
					arrow[0] = new Arrow_Head(this.myColor, "right", to.x -this.buffer-10, t_mid_y-5);
					arrow[2] = paper.rect(from.x+from.width+this.buffer+this.seg_width/2, f_mid_y-this.seg_width/2, arrow[0].x-(from.x+from.width+this.buffer+this.seg_width/2), this.seg_width);
					arrow[2].attr({'fill': this.myColor, 'stroke': 'none' });
				} 
			 }
		 }
		 this.all_arrows.push(arrow);
	},
	
});