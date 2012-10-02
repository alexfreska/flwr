// JavaScript Document
// Written by Patrick Teague 8/7/12
var Arrow_Router = new Class({
	initialize: function(col, boxes){
		this.myColor = col;
		this.buffer = 2;
		this.largeBuffer = 10;
		//this.seg_width = 2;
		this.offset_dist = 10;
		this.thickness = 2;
		this.allBoxes = boxes;
		
		this.all_arrows = new Array();
	},
	//Determine which side each box to route an arrow from/to
	route: function(from, to){
		this.times_run++;
		var arrow = new Array();
		var fSides = from.sides;
		var tSides = to.sides;
		var lTSide ,rTSide, lFSide, rFSide, uTSide, dTSide, uFSide, dFSide; //The left/right and up/down sides distance		
		
		//Find the side on the "to" that is closest to the "from" && is open
		if(tSides['left']){ //If "to" right side is open
			//Calculate the distance from "to" right side to the "from" box.
			lTSide = Math.sqrt( Math.pow(to.x-(from.x+from.width/2), 2)+Math.pow( (to.y+to.height/2)-(from.y+from.height/2), 2) );
		}
		if(tSides['right']){ //If "to" left side is open
			//Calculate the distance from "to" left side to the "from" box.
			rTSide = Math.sqrt( Math.pow( (to.x+to.width)-(from.x+from.width/2), 2)+Math.pow( (to.y+to.height/2)-(from.y+from.height/2), 2) );
		}
		if(tSides['top']){ //If "to" top side is open
			//Calculate the distance from "to" top side to the "from" box.
			uTSide = Math.sqrt( Math.pow( (to.x+to.width/2)-(from.x+from.width/2), 2)+Math.pow( to.y-(from.y+from.height/2), 2) );
		}
		if(tSides['bottom']){ //If "to" top side is open
			//Calculate the distance from "to" bottom side to the "from" box.
			dTSide = Math.sqrt( Math.pow( (to.x+to.width/2)-(from.x+from.width/2), 2)+Math.pow( (to.y+to.height)-(from.y+from.height/2), 2) );
		}
		
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
		
		//Now compare the calculated distances and decide which side on each box will be used
		var lrT, lrF, udT, udF;
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
		//Now, finally actually route the arrows depending on the sides chosen
		var toX, toY, fromX, fromY, adjustArw;
		adjustArw = false;
		//If there are no open sides to route to, we need to try something else.
		if(fromSideToUse != 'none' && toSideToUse != 'none'){			
			if(toSideToUse === 'left'){
				toX = to.x-this.buffer;
				to.sides['left'] = false;
				arrow[0] = new Arrow_Head(this.myColor, "right", to.x-10-this.buffer, (to.y+to.height/2)-5);
			}
			else if(toSideToUse === 'right'){
				toX = to.x + to.width+this.buffer;
				to.sides['right'] = false;
				arrow[0] = new Arrow_Head(this.myColor, "left", to.x+to.width+this.buffer, (to.y+to.height/2)-5);
			}
			else{
				adjustArw = true;
				toX = to.x + to.width/2;
			}
			
			if(toSideToUse === 'top'){
				toY = to.y-this.buffer;
				to.sides['top'] = false;
				arrow[0] = new Arrow_Head(this.myColor, "down", toX-5, to.y-10-this.buffer);
				
			}
			else if(toSideToUse === 'bottom'){
				toY = to.y + to.height+this.buffer;
				to.sides['bottom'] = false;
				arrow[0] = new Arrow_Head(this.myColor, "up", toX-5, to.y+to.height+this.buffer);
			}
			else{
				toY = to.y + to.height/2 - this.thickness/2;
			}
			if(adjustArw)
				toX-= this.thickness/2;
				
			//Now for from
			if(fromSideToUse === 'left'){
				fromX = from.x-this.buffer;
				from.sides['left'] = false;
			}
			else if(fromSideToUse === 'right'){
				fromX = from.x + from.width+this.buffer;
				from.sides['right'] = false;
			}
			else{
				fromX = from.x + from.width/2 - this.thickness/2;
			}
			
			if(fromSideToUse === 'top'){
				fromY = from.y-this.buffer;
				from.sides['top'] = false;
			}
			else if(fromSideToUse === 'bottom'){
				fromY = from.y + from.height+this.buffer;
				from.sides['bottom'] = false;
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
				 var seg = new Router_Line(fx, fy, fx, ty, tis.myColor);
				 arrow.push(seg);
			 };
			 var horiz = function(fx, fy, tx){
				 var seg = new Router_Line(fx, fy, tx, fy, tis.myColor);
				 arrow.push(seg);
			 };
			 
			 //Checks for interference between a box and a line
			 //then applies necessary fixes and returns point where it left off
			 var interferes = function(box, point, distX, distY, pmod){
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
				 var mod_x = p1['x'];
				if(p2['x'] - p1['x'] > 0){ //If p2 to right of p1
					horiz(p1['x'], p1['y'], p2['x']);
					mod_x = p2['x']
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
			 };
			 var advConnect = function(p1, p2){
				 /*
				 	for( each box ordered from closest to farthest from p1)
						if( line from p1 to p2 interferes with box )
							routeAround(box, p1, p2)
					routeAround = function(box, p1, p2){
						find which side the line interferes with
							find point on face of side that line interferes with
								draw line to that point
								if( p2 above box upper face )
									draw line up perpendicular to other line
								else if( p2 below box lower face )
									draw line down perpendicular to other line
								else
									draw line up perpendicular to other line
									then draw line perpendicular either right or left of that line
					};
				 */
				 var boxes = orderNodes(p1);
				 var interferes;
				 var distX, distY;
				 distX = p1['x'] - p2['x'];
				 distY = p1['y'] - p2['y'];
				 for( var i=0; i < boxes.length; i++){
					 
				 }
			 };
			 //Sends back a list of boxes ordered from closest to farthest from point, and takes out any boxes not to be considered
			 var orderNodes = function(point){
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
				 for(var i=0; i<tis.allBoxes.length; i++){
					tis.allBoxes[i].dist = null;
					if(tis.allBoxes[i] != to && tis.allBoxes[i] != from){
						tis.allBoxes[i].dist = Math.pow(point['x']-(tis.allBoxes[i].x+tis.allBoxes[i].width/2), 2)+Math.pow(point['y']-(tis.allBoxes[i].y+tis.allBoxes[i].height/2), 2);
						sortedBoxes.push(tis.allBoxes[i]);
					}
				 }
				 
				 var quick_sort = function(array)
				 {
					 qsort(array, 0, array.length);
				 }
				 quick_sort(sortedBoxes);
				 return sortedBoxes;
			 };
			 
			 var nodesOut = orderNodes({'x': 100, 'y': 100});
			 
			 /*
			 console.log("fromSide: "+fromSideToUse+", toSide: "+toSideToUse);
			 console.log("fromX: "+fromX+", fromY: "+fromY+", toX: "+toX+", toY: "+toY);
			 console.log("from.x: "+from.x+", from.y: "+from.y+", from.width: "+from.width+", from.height: "+from.height);
			 console.log("to.x: "+to.x+", to.y: "+to.y+", to.width: "+to.width+", to.height: "+to.height);
			 *//*
			 var point1 = interferes(from, {'x': fromX, 'y': fromY}, toX-fromX, toY-fromY);
			 var point2 = interferes(to, {'x': toX, 'y': toY}, point1['x']-toX, point1['y']-toY, point1);
			 while(point1['x'] != point2['x'] && point1['y'] != point2['y']){
				 advConnect(point1, point2);
			 }
			 */
			 /*
			 var point1 = interferes(from, {'x': fromX, 'y': fromY}, toX-fromX, toY-fromY);
			 //console.log(point1);
			 var point2 = interferes(to, {'x': toX, 'y': toY}, point1['x']-toX, point1['y']-toY, point1);
			 connect(point1, point2);
			 */
			 this.all_arrows.push(arrow);
		}
		else{
			console.log("Arrow Routing Error");
		}
		
	},
});