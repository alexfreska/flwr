// JavaScript Document
// Written by Patrick Teague 8/7/12
var Arrow_Router = new Class({
	initialize: function(col, boxes){
		this.myColor = col;
		this.buffer = 2;
		this.largeBuffer = 20; //10
		//this.seg_width = 2;
		this.offset_dist = 10;
		this.thickness = 2;
		this.allBoxes = boxes;
		
		this.all_arrows = new Array();
	},
	//Determine which side each box to route an arrow from/to
	route: function(from, to){
		var arrow = new Array();
		var fSides = from.sides;
		var tSides = to.sides;
		var lTSide ,rTSide, lFSide, rFSide, uTSide, dTSide, uFSide, dFSide; //The left/right and up/down sides distance		
		//Now find the side on the "from" that is closest to the "to" && is open
		if(fSides['left']){ //If "from" left side is open
			//Calculate the distance from "from" right side to the "to" box.
			lFSide = Math.sqrt( Math.pow(from.x-(to.x+to.width/2), 2)+Math.pow( (to.y+to.height/2)-(from.y+from.height/2), 2) );
		}
		if(fSides['right']){ //If "from" right side is open
			//Calculate the distance from "from" left side to the "to" box.
			rFSide = Math.sqrt( Math.pow( (from.x+from.width)-(to.x+to.width/2), 2)+Math.pow( (to.y+to.height/2)-(from.y+from.height/2), 2) );
		}
		if(fSides['top']){ //If "from" top side is open
			//Calculate the distance from "from" top side to the "to" box.
			uFSide = Math.sqrt( Math.pow( (from.x+from.width/2)-(to.x+to.width/2), 2)+Math.pow( from.y-(to.y+to.height/2), 2) );
		}
		if(fSides['bottom']){ //If "from" top side is open
			//Calculate the distance from "from" bottom side to the "to" box.
			dFSide = Math.sqrt( Math.pow( (from.x+from.width/2)-(to.x+to.width/2), 2)+Math.pow( (from.y+from.height)-(to.y+to.height/2), 2) );
		}
		var lrT, lrF, udT, udF;
		if(lFSide == null && rFSide != null)//Go right side
			lrF = 'right';
		else if(rFSide == null && lFSide != null)//Go left side
			lrF = 'left';
		else if(rFSide == null && lFSide == null)//Neither left nor right
			lrF = 'none';
		else{ //Otherwise, actually compare the two values
			if(lFSide < rFSide)//Go left side
				lrF = 'left';
			else
				lrF = 'right';
		}
		if(uFSide == null && dFSide != null)//Go bottom side
			udF = 'bottom';
		else if(dFSide == null && uFSide != null)//Go top side
			udF = 'top';
		else if(dFSide == null && uFSide == null)//Neither top nor bottom
			udF = 'none';
		else{ //Otherwise, actually compare the two values
			if(uFSide < dFSide)//Go top side
				udF = 'top';
			else
				udF = 'bottom';
		}
		
		if(lrF === 'none' && udF != 'none'){ //Use "to" top/bottom side
			fromSideToUse = udF;	
		}
		else if(udF === 'none' && lrF != 'none'){ //Use "to" left/right side
			fromSideToUse = lrF;	
		}
		else if(udF === 'none' && lrF === 'none'){ //Don't use any side...
			fromSideToUse = 'none';
		}
		else{ //Otherwise, actually compare the two values
			var lrVal, udVal;
			if(lrF === 'left')
				lrVal = lFSide;
			else
				lrVal = rFSide;
			if(udF === 'top')
				udVal = uFSide;
			else
				udVal = dFSide;
				
			if(lrVal < udVal)
				fromSideToUse = lrF;
			else
				fromSideToUse = udF;		
		}
		var fSideX, fSideY;
		if(fromSideToUse === 'left'){
			fSideX = from.x;
			fSideY = from.y+from.height/2;
		}
		else if(fromSideToUse === 'right'){
			fSideX = from.x+from.width;
			fSideY = from.y+from.height/2;
		}
		else if(fromSideToUse === 'top'){
			fSideX = from.x+from.width/2;
			fSideY = from.y;
		}
		else{
			fSideX = from.x+from.width/2;
			fSideY = from.y+from.height;
		}
		lTSide = Math.sqrt( Math.pow(to.x-fSideX, 2)+Math.pow((to.y+to.height/2)-fSideY, 2) );
		rTSide = Math.sqrt( Math.pow((to.x+to.width)-fSideX, 2)+Math.pow((to.y+to.height/2)-fSideY, 2) );
		uTSide = Math.sqrt( Math.pow((to.x+to.width/2)-fSideX, 2)+Math.pow(to.y-fSideY, 2) );
		dTSide = Math.sqrt( Math.pow((to.x+to.width/2)-fSideX, 2)+Math.pow((to.y+to.height)-fSideY, 2) );

		//Now compare the calculated distances and decide which side on each box will be used
		//var lrT, lrF, udT, udF;
		//Compare the left and right sides
		if(lTSide == null && rTSide != null)//Go right side
			lrT = 'right';
		else if(rTSide == null && lTSide != null)//Go left side
			lrT = 'left';
		else if(rTSide == null && lTSide == null)//Neither left nor right
			lrT = 'none';
		else{ //Otherwise, actually compare the two values
			if(lTSide < rTSide)//Go left side
				lrT = 'left';
			else
				lrT = 'right';
		}
		//Compare the top and bottom sides
		if(uTSide == null && dTSide != null)//Go bottom side
			udT = 'bottom';
		else if(dTSide == null && uTSide != null)//Go top side
			udT = 'top';
		else if(dTSide == null && uTSide == null)//Neither top nor bottom
			udT = 'none';
		else{ //Otherwise, actually compare the two values
			if(uTSide < dTSide)//Go top side
				udT = 'top';
			else
				udT = 'bottom';
		}
		//Now compare the left/right and up/down values
		var toSideToUse, fromSideToUse;
		if(lrT === 'none' && udT != 'none'){ //Use "to" top/bottom side
			toSideToUse = udT;	
		}
		else if(udT === 'none' && lrT != 'none'){ //Use "to" left/right side
			toSideToUse = lrT;	
		}
		else if(udT === 'none' && lrT === 'none'){ //Don't use any side...
			toSideToUse = 'none';
		}
		else{ //Otherwise, actually compare the two values
			var lrVal, udVal;
			if(lrT === 'left')
				lrVal = lTSide;
			else
				lrVal = rTSide;
			if(udT === 'top')
				udVal = uTSide;
			else
				udVal = dTSide;
				
			if(lrVal < udVal)
				toSideToUse = lrT;
			else
				toSideToUse = udT;		
		}
		//Now, finally actually route the arrows depending on the sides chosen
		var toX, toY, fromX, fromY, adjustArw;
		adjustArw = false;
		//If there are no open sides to route to, we need to try something else.
		if(fromSideToUse != 'none' && toSideToUse != 'none'){			
			if(toSideToUse === 'left'){
				toX = to.x-this.buffer;
				to.sides['left'] = false;
				//arrow[0] = new Arrow_Head(this.myColor, "right", to.x-10-this.buffer, (to.y+to.height/2)-5);
			}
			else if(toSideToUse === 'right'){
				toX = to.x + to.width+this.buffer;
				to.sides['right'] = false;
				//arrow[0] = new Arrow_Head(this.myColor, "left", to.x+to.width+this.buffer, (to.y+to.height/2)-5);
			}
			else{
				adjustArw = true;
				toX = to.x + to.width/2;
			}
			
			if(toSideToUse === 'top'){
				toY = to.y-this.buffer;
				to.sides['top'] = false;
				//arrow[0] = new Arrow_Head(this.myColor, "down", toX-5, to.y-10-this.buffer);
				
			}
			else if(toSideToUse === 'bottom'){
				toY = to.y + to.height+this.buffer;
				to.sides['bottom'] = false;
				//arrow[0] = new Arrow_Head(this.myColor, "up", toX-5, to.y+to.height+this.buffer);
			}
			else{
				toY = to.y + to.height/2 - this.thickness/2;
			}
			if(adjustArw)
				toX-= this.thickness/2;
				
			//Now for from
			if(fromSideToUse === 'left'){
				fromX = from.x-this.buffer;
				//from.sides['left'] = false;
			}
			else if(fromSideToUse === 'right'){
				fromX = from.x + from.width+this.buffer;
				//from.sides['right'] = false;
			}
			else{
				fromX = from.x + from.width/2 - this.thickness/2;
			}
			
			if(fromSideToUse === 'top'){
				fromY = from.y-this.buffer;
				//from.sides['top'] = false;
			}
			else if(fromSideToUse === 'bottom'){
				fromY = from.y + from.height+this.buffer;
				//from.sides['bottom'] = false;
			}
			else{
				fromY = from.y + from.height/2 - this.thickness/2;
			}
			
			var tis = this;
			var offset = function(box){
				 var seg, side, final_x, final_y, arwAdj;
				 if(box === to){
				 	side = toSideToUse;
					arwAdj = 10;
				 }
				else{
					side = fromSideToUse;
					arwAdj = 0;
				}
				 if(side === "left"){
					 final_x = box.x-tis.offset_dist-tis.buffer-arwAdj;
					 final_y = box.y+box.height/2-(tis.thickness/2);
					 seg = new Router_Line(final_x, final_y, box.x-tis.buffer-arwAdj, final_y, tis.myColor);
				 }
				 else if(side === "right"){
					 final_x = box.x+box.width+tis.offset_dist+tis.buffer+arwAdj;
					 final_y = box.y+box.height/2-(tis.thickness/2);
					 seg = new Router_Line(box.x+box.width+tis.buffer+arwAdj, final_y, final_x, final_y, tis.myColor);
				 }
				 else if(side === "top"){
					 final_x = box.x+box.width/2-(tis.thickness/2);
					 final_y = box.y-tis.offset_dist-tis.buffer-arwAdj;
					 seg = new Router_Line(final_x, final_y, final_x, box.y-tis.buffer-arwAdj, tis.myColor);
				 }
				 else if(side === "bottom"){
					 final_x = box.x+box.width/2-(tis.thickness/2);
					 final_y = box.y+box.height+tis.buffer+tis.offset_dist+arwAdj;
					 seg = new Router_Line(final_x, box.y+box.height+tis.buffer+arwAdj, final_x, final_y, tis.myColor);
				 }
				 arrow.push(seg);
				 //return lead off position
				 return {
					 'x': final_x,
					 'y': final_y
				 };
			 };
			 var vert = function(fx, fy, ty){
				 if(fy != ty){
					var seg = new Router_Line(fx, fy, fx, ty, tis.myColor);
				 	arrow.push(seg);
				 }
			 };
			 var horiz = function(fx, fy, tx){
				 if(fx != tx){
				 	var seg = new Router_Line(fx, fy, tx, fy, tis.myColor);
				 	arrow.push(seg);
				 }
			 };
			 
			 //Checks for interference between a box and a line
			 //then applies necessary fixes and returns point where it left off
			 var interfering = function(box, point, distX, distY, pmod){
				if(point['x'] === box.x-tis.buffer){ //If x on left side
					if(distX > 0){ //If line goes through box
						var lead = offset(box);	//Create an offset to the left
						if(distY > 0){ //If line will go down
							if(pmod){
								vert(lead['x'], lead['y'], pmod['y']);
								return {
									'x': lead['x'],
									'y': pmod['y']
								};
							}
							else{
								vert(lead['x'], lead['y'], box.y+box.height+tis.largeBuffer);
								return {
									'x': lead['x'],
									'y': box.y+box.height+tis.largeBuffer
								};
							}
						}
						else{ //Otherwise if line goes up or just around.
							if(pmod){
								vert(lead['x'], pmod['y'], lead['y']);
								return {
									'x': lead['x'],
									'y': pmod['y']
								};
							}
							else{
								vert(lead['x'], box.y-tis.largeBuffer, lead['y']);
								return {
									'x': lead['x'],
									'y': box.y-tis.largeBuffer
								};
							}
						}
					}
					else if(point['y'] === box.y+box.height/2-tis.thickness/2){ //If line comes into side vertically
						return offset(box); //Create a simple offset and return point
					}
					//Otherwise just return the point with no modifications
					return point;
				}
				else if(point['x'] === box.x+box.width+tis.buffer){ //If x on right side
					if(distX < 0){ //If line goes through box
						var lead = offset(box);	//Create an offset to the right
						if(distY > 0){ //If line will go down
							if(pmod){
								vert(lead['x'], lead['y'], pmod['y']);
								return {
									'x': lead['x'],
									'y': pmod['y']
								};
							}
							else{
								vert(lead['x'], lead['y'], box.y+box.height+tis.largeBuffer);
								return {
									'x': lead['x'],
									'y': box.y+box.height+tis.largeBuffer
								};
							}
						}
						else{ //Otherwise if line goes up or just around.
							if(pmod){
								vert(lead['x'], pmod['y'], lead['y']+tis.thickness);
								return {
									'x': lead['x'],
									'y': pmod['y']
								};

							}
							else{
								vert(lead['x'], box.y-tis.largeBuffer, lead['y']+tis.thickness);
								return {
									'x': lead['x'],
									'y': box.y-tis.largeBuffer
								};
							}
						}
					}
					else if(point['y'] === box.y+box.height/2-tis.thickness/2){ //If line comes into side vertically
						return offset(box); //Create a simple offset and return point
					}
					//Otherwise just return the point with no modifications
					return point;
				}
				else{ //If x between box width
					if(point['y'] === box.y-tis.buffer){ //If y on top side
						if(distY > 0){ //If line goes through box
							var lead = offset(box);	//Create an offset on the top
							if(distX > 0){ //If line will go right
								if(pmod){
									horiz(lead['x'], lead['y'], pmod['x']);
									return {
										'x': pmod['x'],
										'y': lead['y']
									};
								}
								else{
									horiz(lead['x'], lead['y'], box.x+box.width+tis.largeBuffer);
									return {
										'x': box.x+box.width+tis.largeBuffer,
										'y': lead['y']
									};
								}
							}
							else{ //Otherwise if line goes left or just around.
								if(pmod){
									horiz(pmod['x'], lead['y'], lead['x']);
									return {
										'x': pmod['x'],
										'y': lead['y']
									};
								}
								else{
									horiz(box.x-tis.largeBuffer, lead['y'], lead['x']);
									return {
										'x': box.x-tis.largeBuffer,
										'y': lead['y']
									};
								}
							}
						}
						else if(point['x'] === box.x+box.width/2-tis.thickness/2){ //If line comes into side horizontally
							return offset(box); //Create a simple offset and return point
						}
						//Otherwise just return the point with no modifications
						return point;
					}
					else if(point['y'] === box.y+box.height+tis.buffer){ //If y on bottom side
						if(distY < 0){ //If line goes through box
							var lead = offset(box);	//Create an offset on the bottom
							if(distX > 0){ //If line will go right
								if(pmod){
									horiz(lead['x'], lead['y'], pmod['x']);
									return {
										'x': pmod['x'],
										'y': lead['y']
									};
								}
								else{
									horiz(lead['x'], lead['y'], box.x+box.width+tis.largeBuffer);
									return {
										'x': box.x+box.width+tis.largeBuffer,
										'y': lead['y']
									};
								}
							}
							else{ //Otherwise if line goes left or just around.
								if(pmod){
									horiz(pmod['x'], lead['y'], lead['x']+tis.thickness);
									return {
										'x': pmod['x'],
										'y': lead['y']
									};
								}
								else{
									horiz(box.x-tis.largeBuffer, lead['y'], lead['x']);
									return {
										'x': box.x-tis.largeBuffer,
										'y': lead['y']
									};
								}
							}
						}
						else if(point['x'] === box.x+box.width/2-tis.thickness/2){ //If line comes into side horizontally
							return offset(box); //Create a simple offset and return point
						}
						//Otherwise just return the point with no modifications
						return point;
					}
				}
			 };
			 
			 var connect = function(p1, p2){
				 if(p1['y'] >= to.y && p1['y'] <= to.y+to.height){
					 if(toSideToUse === 'left'){
						  arrow.push(new Arrow_Head(tis.myColor, "right", p2['x']-10-tis.buffer, p1['y']+(tis.thickness/2)-5));
						  horiz(p1['x'], p1['y'], p2['x']-tis.buffer);
					 }
					 else if(toSideToUse === 'right'){
						  arrow.push(new Arrow_Head(tis.myColor, "left", p2['x']+tis.buffer, p1['y']+(tis.thickness/2)-5));
						  horiz(p1['x'], p1['y'], p2['x']+tis.buffer);
					 }
			 	 }
				 else if(p1['x'] >= to.x && p1['x'] <= to.x+to.width){
					 if(toSideToUse === 'top'){ 
						  arrow.push(new Arrow_Head(tis.myColor, "down", p1['x']+(tis.thickness/2)-5, p2['y']-10-tis.buffer));
						  vert(p1['x'], p1['y'], p2['y']-tis.buffer);
					 }
					 else if(toSideToUse === 'bottom'){
						  arrow.push(new Arrow_Head(tis.myColor, "up", p1['x']+(tis.thickness/2)-5, p2['y']+tis.buffer));
						  vert(p1['x'], p1['y'], p2['y']+tis.buffer);
					 }
				 }
				 else{
					if(toSideToUse === 'left'){
						arrow.push(new Arrow_Head(tis.myColor, "right", to.x-10-tis.buffer, (to.y+to.height/2)-5));
						horiz(p2['x']-10, p2['y']-(tis.thickness/2), p2['x']-10-tis.offset_dist);
						p2['x'] -= (tis.offset_dist+10);
					}
					else if(toSideToUse === 'right'){
						arrow.push(new Arrow_Head(tis.myColor, "left", to.x+to.width+tis.buffer, (to.y+to.height/2)-5));
						horiz(p2['x']+10, p2['y'], p2['x']+10+tis.offset_dist);
						p2['x'] += (tis.offset_dist+10);
					}
					if(toSideToUse === 'top'){
						arrow.push(new Arrow_Head(tis.myColor, "down", toX-5+(tis.thickness/2), to.y-10-tis.buffer));	
						vert(p2['x']-(tis.thickness/2), p2['y']-10, p2['y']-10-tis.offset_dist);
						p2['y'] -= (tis.offset_dist+10);
					}
					else if(toSideToUse === 'bottom'){
						arrow.push(new Arrow_Head(tis.myColor, "up", toX-5+(tis.thickness/2), to.y+to.height+tis.buffer));
						vert(p2['x'], p2['y']+10, p2['y']+10+tis.offset_dist);
						p2['y'] += (tis.offset_dist+10);
					}
					var mod_x = p1['x'];
					if(p2['x'] - p1['x'] > 0){ //If p2 to right of p1
						horiz(p1['x'], p1['y'], p2['x']);
						mod_x = p2['x'];
					}
					else if(p2['x'] - p1['x'] < 0){ //If p2 to left of p1
						horiz(p2['x'], p2['y'], p1['x']);
						mod_x = p1['x'];
					}
					//else{} do nothing because the two points share the same vertical line
					
					if(p2['y'] - p1['y'] > 0){ //If p2 below p1
						vert(mod_x, p1['y'], p2['y']+tis.thickness);
					}
					else if(p2['y'] - p1['y'] < 0){ //If p2 above p1
						vert(mod_x, p2['y'], p1['y']+tis.thickness);
					}
					//else{} do nothing becase the two points share the same horizontal line
				 }
			 };
			 var advConnect = function(p1, p2){
				 var interferes = function(b, pA, pB){
					 var distX, distY, endX, endY;
					 distX = pA['x'] - pB['x'];
					 distY = pA['y'] - pB['y'];
					 //console.log("run on: "+b.myText+", FROM: "+from.myText);
					 if(pA['x'] <= b.x && distX < 0){
						 //If point to the left of box and able to intersect
						 //if(pB['y'] >= b.y-tis.largeBuffer && pB['y'] <= b.y+b.height+tis.largeBuffer && pB['x'] >= b.x+b.width){
						 if(pB['y'] >= b.y && pB['y'] <= b.y+b.height && pB['x'] >= b.x+b.width){ 
							 //If connecting line will intersect left face
							 if(pA['y'] <= b.y-tis.largeBuffer){
							 	endY = b.y-tis.largeBuffer;
								vert(pA['x'], pA['y'], endY);
								endX = b.x+b.width+tis.largeBuffer;
								horiz(pA['x']+tis.thickness, endY, endX);
							 }
							 else if(pA['y'] >= b.y+b.height+tis.largeBuffer){
							 	endY = b.y+b.height+tis.largeBuffer;
								vert(pA['x'], pA['y'], endY);
								endX = b.x+b.width+tis.largeBuffer;
								horiz(pA['x']+tis.thickness, endY, endX);
							 }
							 else{
								 endX = b.x-tis.largeBuffer;
								 horiz(pA['x'], pA['y'], endX);
								 if(distY < 0){ //Vertical line down
									endY = b.y+b.height+tis.largeBuffer;
									vert(endX, pA['y'], endY);					
								 }
								 else if(distY > 0){ //Vertical line up
									endY = b.y-tis.largeBuffer;
									vert(endX, pA['y'], endY);							
								 }
								 else{ //Otherwise determine which direction would require the shorter distance
									var modY;
									if(Math.abs(b.y-pA['y']) < Math.abs(b.y+b.height-pA['y'])){ //Vertical line up
										vert(endX, pA['y'], b.y-tis.largeBuffer);
										modY = b.y-tis.largeBuffer;
									}
									else{ //Vertical line down
										vert(endX, pA['y'], b.y+b.height+tis.largeBuffer);
										modY = b.y+b.height+tis.largeBuffer;
									}
									horiz(endX, modY, b.x+b.width+tis.largeBuffer); //Horizontal line to the right
									endY = modY;
									endX = b.x+b.width+tis.largeBuffer;
								 }
							 }
						 }
						 else if((pB['y'] <= b.y-tis.largeBuffer) && ((pA['y'] < b.y-tis.largeBuffer && pB['y'] >= b.y-tis.largeBuffer) || pA['y'] > b.y+b.height+tis.largeBuffer && pB['y'] <= b.y+b.height+tis.largeBuffer)){
							//If vertical line will intersect box 
							endY = pA['y'];
							endX = b.x+b.width+tis.largeBuffer;
							horiz(pA['x'], pA['y'], endX);
						 }
						 else if(pA['y'] >= b.y-tis.largeBuffer && pA['y'] <= b.y+b.height+tis.largeBuffer && pB['y'] < b.y-tis.largeBuffer){
							 endX = b.x-tis.largeBuffer;
							 horiz(pA['x'], pA['y'], endX+tis.thickness);
							 endY = b.y-tis.largeBuffer;
							 vert(endX, pA['y'], endY);
						 }
						 else if(pA['y'] >= b.y-tis.largeBuffer && pA['y'] <= b.y+b.height+tis.largeBuffer && pB['y'] > b.y+b.height+tis.largeBuffer){
							 endX = b.x-tis.largeBuffer;
							 horiz(pA['x'], pA['y'], endX);
							 endY = b.y+b.height+tis.largeBuffer;
							 horiz(endX, pA['y'], endY+tis.thickness);
						 }
						 else{
							 endX = pA['x'];
							 endY = pA['y'];
						 }
					 }
					 else if(pA['x'] >= b.x+b.width && distX > 0){
						 //If pA to the right of the box and able to intersect
						 //console.log("CASE 3");
						 //if(pB['y'] >= b.y-tis.largeBuffer && pB['y'] <= b.y+b.height+tis.largeBuffer && pB['x'] <= b.x-tis.largeBuffer){
						 if(pB['y'] >= b.y && pB['y'] <= b.y+b.height && pB['x'] <= b.x){
							 //If connecting line will intersect right face
							 if(pA['y'] <= b.y-tis.largeBuffer){
							 	endY = b.y-tis.largeBuffer;
								vert(pA['x'], pA['y'], endY);
								endX = b.x-tis.largeBuffer;
								horiz(pA['x']+tis.thickness, endY, endX);
							 }
							 else if(pA['y'] >= b.y+b.height+tis.largeBuffer){
							 	endY = b.y+b.height+tis.largeBuffer;
								vert(pA['x'], pA['y'], endY);
								endX = b.x-tis.largeBuffer;
								horiz(pA['x']+tis.thickness, endY, endX);
							 }
							 else{
								 endX = b.x+b.width+tis.largeBuffer;
								 horiz(pA['x'], pA['y'], endX); 
								 if(distY < 0){ //Vertical line down
									endY = b.y+b.height+tis.largeBuffer;
									vert(endX, pA['y'], endY);					
								 }
								 else if(distY > 0){ //Vertical line up
									endY = b.y-tis.largeBuffer;
									vert(endX, pA['y'], endY);
								 }
								 else{ //Otherwise determine which direction would require the shorter distance
									var modY;
									if(Math.abs(b.y-pA['y']) < Math.abs(b.y+b.height-pA['y'])){ //Vertical line up
										vert(endX, pA['y'], b.y-tis.largeBuffer);
										modY = b.y-tis.largeBuffer;
									}
									else{ //Vertical line down
										vert(endX, pA['y'], b.y+b.height+tis.largeBuffer);
										modY = b.y+b.height+tis.largeBuffer;
									}
									horiz(endX, modY, b.x-tis.largeBuffer); //Horizontal line to the right
									endY = modY;
									endX = b.x+b.width+tis.largeBuffer;
								 }
							 }
						 }
						 else if((pB['y'] <= b.y-tis.largeBuffer) && ((pA['y'] < b.y-tis.largeBuffer && pB['y'] >= b.y-tis.largeBuffer) || pA['y'] > b.y+b.height+tis.largeBuffer && pB['y'] <= b.y+b.height+tis.largeBuffer)){ //Upper/Lower left
							 endX = b.x-tis.largeBuffer;
							 endY = pA['y'];	
							 horiz(pA['x'], pA['y'], endX);			 
						 }
						 else{
							 endX = pA['x'];
							 endY = pA['y'];
						 }
					 }
					 else if(pA['y'] <= b.y && distY < 0 ){
						 //If pA above the box and able to intersect
						 //console.log("CASE 2");
						 //if(pB['x'] >= b.x-tis.largeBuffer && pB['x'] <= b.x+b.width+tis.largeBuffer && pB['y'] >= b.y+b.height){
						 if(pB['x'] >= b.x && pB['x'] <= b.x+b.width && pB['y'] >= b.y+b.height){
							 //If line intersects top face of box
							 endY = b.y-tis.largeBuffer;
							 vert(pA['x'], pA['y'], endY);
							 if(distX < 0){ //Horizontal line right
								endX = b.x+b.width+tis.largeBuffer;
							 	horiz(pA['x'], endY, endX);
							 }
							 else if(distX > 0){ //Horizontal line left
							 	endX = b.x-tis.largeBuffer;
							 	horiz(pA['x'], endY, endX);
							 }
							 else{ //Otherwise determine which direction would require the shorter distance
							    var modX;
							 	if(Math.abs(b.x-pA['x']) < Math.abs(b.x+b.width-pA['x'])){ //Horizontal line left
									horiz(pA['x'], endY, b.x-tis.largeBuffer);
									modX = b.x-tis.largeBuffer;
								}
								else{ //Horizontal line right
									horiz(pA['x'], endY, b.x+b.width+tis.largeBuffer);
									modX = b.x+b.width+tis.largeBuffer;
								}
								vert(modX, endY, b.y+b.height+tis.largeBuffer); //Vertical line down
								endX = modX;
								endY = b.y+b.height+tis.largeBuffer;
							 }
						 }
						 else if((pB['y'] >= b.y-tis.largeBuffer) && ((pA['x'] < b.x-tis.largeBuffer && pB['x'] >= b.x-tis.largeBuffer) || (pA['x'] > b.x+b.width+tis.largeBuffer && pB['x'] <= b.x+b.width+tis.largeBuffer))){ //Upper left/right
							 endY = b.y+b.height+tis.largeBuffer;
							 endX = pA['x'];
							 vert(pA['x'], pA['y'], endY);			 
						 } 
						 else if(pA['x'] >= b.x-tis.largeBuffer && pA['x'] <= b.x+b.width+tis.largeBuffer && pB['x'] < b.x-tis.largeBuffer){
							 endY = b.y-tis.largeBuffer;
							 vert(pA['x'], pA['y'], endY);
							 endX = b.x-tis.largeBuffer;
							 horiz(pA['x']+tis.thickness, endY, endX);
						 }
						 else if(pA['x'] >= b.x-tis.largeBuffer && pA['x'] <= b.x+b.width+tis.largeBuffer && pB['x'] > b.x+b.width+tis.largeBuffer){
							 endY = b.y-tis.largeBuffer;
							 vert(pA['x'], pA['y'], endY);
							 endX = b.x+b.width+tis.largeBuffer;
							 horiz(pA['x'], endY, endX+tis.thickness);
						 }
						 else{
							 endX = pA['x'];
							 endY = pA['y'];
						 }
					 }
					 else if(pA['y'] >= b.y+b.height && distY > 0){
						 //If pA below the box and able to intersect
						 //console.log("CASE 1");
						 //if(pB['x'] >= b.x-tis.largeBuffer && pB['x'] <= b.x+b.width+tis.largeBuffer && pB['y'] <= b.y){
						 if(pB['x'] >= b.x && pB['x'] <= b.x+b.width && pB['y'] <= b.y){
							 //If line intersects bottom face of box
							 endY = b.y+b.height+tis.largeBuffer;
							 vert(pA['x'], pA['y'], endY);
							 if(distX > 0){ //Horizontal line right
								endX = b.x+b.width+tis.largeBuffer;
							 	horiz(pA['x'], endY, endX);
							 }
							 else if(distX <0){ //Horizontal line left
							 	endX = b.y-tis.largeBuffer;
							 	horiz(pA['x'], endY, endX);
							 }
							 else{ //Otherwise determine which direction would require the shorter distance
							    var modX;
							 	if(Math.abs(b.x-pA['x']) < Math.abs(b.x+b.width-pA['x'])){ //Horizontal line left
									horiz(pA['x'], endY, b.x-tis.largeBuffer);
									modX = b.x-tis.largeBuffer;
								}
								else{ //Horizontal line right
									horiz(pA['x'], endY, b.x+b.width+tis.largeBuffer);
									modX = b.x+b.width+tis.largeBuffer;
								}
								vert(modX, endY, b.y-tis.largeBuffer); //Vertical up down
								endX = modX;
								endY = b.y-tis.largeBuffer;
							 }
						 }
						 else if( (pA['x'] < b.x-tis.largeBuffer && pB['x'] >= b.x-tis.largeBuffer) || (pA['x'] > b.x+b.width+tis.largeBuffer && pB['x'] <= b.x+b.width+tis.largeBuffer)){ //Upper left/right
							 endY = b.y-tis.largeBuffer;
							 endX = pA['x'];
							 vert(pA['x'], pA['y'], endY);			 
						 }
						 //Newly added in BS
						 /*
						 else if(pA['x'] >= b.x-tis.largeBuffer && pA['x'] <= b.x+b.width+tis.largeBuffer && pB['y'] < b.x-tis.largeBuffer){
							 endY = b.y-tis.largeBuffer;
							 vert(pA['x'], pA['y'], endY);
							 endX = b.x-tis.largeBuffer;
							 horiz(pA['x']+tis.thickness, endY, endX);
						 }
						 else if(pA['x'] >= b.x-tis.largeBuffer && pA['x'] <= b.x+b.width+tis.largeBuffer && pB['x'] > b.x+b.width+tis.largeBuffer){
							 endY = b.y-tis.largeBuffer;
							 vert(pA['x'], pA['y'], endY);
							 endX = b.x+b.width+tis.largeBuffer;
							 horiz(pA['x'], endY, endX+tis.thickness);
						 }
						 */
						 //End new BS
						 else{
							 endX = pA['x'];
							 endY = pA['y'];
						 }
					 }
					 else{
						endX = pA['x'];
						endY = pA['y']; 
					 }
					 //Returns the leave off point for the function
					 return {
						'x': endX,
						'y': endY
					 };
				 };
				 var logBoxes = function(logThese){
					console.log("***********Start log************");
					for(var k=0; k<logThese.length; k++){
						console.log(logThese[k].myText);	
					}
					console.log("************End log**************");
				 };
				
				 var interference = true;
				 var noInterfereYet = true;
				 var boxes;
				 var possibleBoxes = tis.allBoxes;
				 var newP1 = p1;
				 var oldP1 = p1;
				 var n = 0;
				 while(interference){
					 boxes = orderNodes(newP1, possibleBoxes);
					 //logBoxes(possibleBoxes);
					 possibleBoxes = boxes;
					 noInterfereYet = true;
					 var j=0;
					 while(noInterfereYet && j<boxes.length){
						 if(boxes[j] === to){ //If the box we are routing to is the closest
						 	 newP1 = interferes(boxes[j], oldP1, p2);
							 if(newP1['x'] != oldP1['x'] || newP1['y'] != oldP1['y']){
								 //noInterfereYet = false;
								 oldP1 = newP1;
								 var marker = viewPaper.circle(newP1['x']+tis.thickness/2, newP1['y']+tis.thickness/2, 3).attr({fill: '#0000FF', stroke: 'none'});
								 //console.log("To case reached");
							 }
							 noInterfereYet = false;
							 j = boxes.length; //Ensure that we leave the loop
							 //console.log("to box reached");
						 }
						 else{
							 newP1 = interferes(boxes[j], oldP1, p2);
							 if(newP1['x'] != oldP1['x'] || newP1['y'] != oldP1['y']){
								 noInterfereYet = false;
								 oldP1 = newP1;
								 possibleBoxes.splice(possibleBoxes.indexOf(boxes[j]), 1);
								 var marker = viewPaper.circle(newP1['x']+tis.thickness/2, newP1['y']+tis.thickness/2, 3).attr({fill: '#0000FF', stroke: 'none'});
								 //console.log("Interfered");
							 }
							 j++;
						 }
						 n++;
					 }
					 //n++;
					 //console.log("through inside loop");
					 if(j === boxes.length || n == 100) //If it made it through the entire array of boxes 
					 	interference = false;
				 }
				 //console.log("*******end reached after n = "+n+" run throughs********");
				 connect(newP1, p2);
			 };
			 //Sends back a list of boxes ordered from closest to farthest from point, and takes out any boxes not to be considered
			 var orderNodes = function(point, boxesToDealWith){
				  var tmp;
				  var partition = function(array, begin, end, pivot)
				  {
					  var piv=array[pivot].dist;
					  tmp=array[pivot];
					  array[pivot]=array[end-1];
					  array[end-1]=tmp;
					  var store=begin;
					  var ix;
					  for(ix=begin; ix<end-1; ++ix) {
						  if(array[ix].dist<=piv) {
							  tmp=array[store];
							  array[store]=array[ix];
							  array[ix]=tmp;
							  ++store;
						  }
					  }
					  tmp=array[end-1];
					  array[end-1]=array[store];
					  array[store]=tmp;
				  
					  return store;
				  };
				  var qsort = function(array, begin, end)
				  {
					  if(end-1>begin) {
						  var pivot=begin+Math.floor(Math.random()*(end-begin));
				  
						  pivot=partition(array, begin, end, pivot);
				  
						  qsort(array, begin, pivot);
						  qsort(array, pivot+1, end);
					  }
				  };
				 
				 var sortedBoxes = new Array();
				 for(var i=0; i<boxesToDealWith.length; i++){
					boxesToDealWith[i].dist = null;
					if(boxesToDealWith[i] != from){ //boxesToDealWith != to && 
						//Point undefined here...
						boxesToDealWith[i].dist = Math.pow(point['x']-(boxesToDealWith[i].x+boxesToDealWith[i].width/2), 2)+Math.pow(point['y']-(boxesToDealWith[i].y+boxesToDealWith[i].height/2), 2);
						sortedBoxes.push(boxesToDealWith[i]);
					}
				 }
				 
				 var quick_sort = function(array)
				 {
					 qsort(array, 0, array.length);
				 }
				 quick_sort(sortedBoxes);
				 return sortedBoxes;
			 };
			 //Function takes the arrow we have constructed and attempt to condense it's 
			 //segments into as few horizontal and vertical segments as possible without 
			 //interfering with any boxes
			 var condense = function(){
				 //Take the direction of the first segment (up/down) or (left/right)
				 for(var i=0; i<arrow.length; i++){
					console.log(arrow[i]); 
				 }
				 console.log("---------------------------------");
			 };
			 
			 var point1 = interfering(from, {'x': fromX, 'y': fromY}, toX-fromX, toY-fromY);
			 var point2 = {'x': toX, 'y': toY};
			 //var marker1 = viewPaper.circle(point1['x']+this.thickness/2, point1['y']+this.thickness/2, 3).attr({fill: '#00FF00', stroke: 'none'});
			 //var marker2 = viewPaper.circle(toX+this.thickness/2, toY+this.thickness/2, 3).attr({fill: '#FF0000', stroke: 'none'});
			 advConnect(point1, point2);
			 //console.log("---------------------------");
			 condense(); //Take the arrow and condense it's segments
			 this.all_arrows.push(arrow);
		}
		else{
			console.log("Arrow Routing Error");
		}
		
	},
});