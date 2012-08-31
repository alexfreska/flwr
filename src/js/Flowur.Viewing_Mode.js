// JavaScript Document
// Written by Patrick Teague
// Last update: 8/10/12
// Viewing mode code

var Viewing_Mode = new Class({
	initialize: function(){
		this.current_scheme = 3;
		this.color_scheme_1 = ['#287BDB', '#F0E400', '#646464'];//Blue/Yellow scheme
		this.color_scheme_2 = ['#E51B2A', '#F79000', '#444444'];//Red/orange scheme
		this.color_scheme_3 = ['#5670CF', '#68D019', '#555555'];//Green/Blue scheme
		this.color_scheme_4 = ['#FF8C00', '#1D9ACF', '#777777'];//Orange/Blue scheme
		this.color_schemes = [this.color_scheme_1, this.color_scheme_2, this.color_scheme_3, this.color_scheme_4];
		
		this.text_array = new Array();
		this.address_array = new Array();
		this.current_array = new Array();
		this.layers = new Array();
		this.current_bounds;
		this.router = new Arrow_Router('#AAAAAA');
		//this.demo_draw();
		//current_chart = ["B1B&Yes", "B1B1B&Could it interfere with your employment?", "B1B1B1B&Yes", "B1B1B1B1&Delete that tweet!", "B1B1B2B&No", "B1B1B2B1&You're in the clear!", "B2B&No", "B2B1B&Is it about an ex?", "B2B1B1B&Yes", "B2B1B1B1&Delete it!", "B2B1B2B&No", "B2B1B2B1&You should be good!", "B&Does it involve your boss?"];
		
		this.draw();	
		
		this.view_nav = new Viewer_Navigator();
		//This is for debugging purposes, comment out when done
		this.current_bounds.width = stage.innerWidth + 600;
		this.current_bounds.height = stage.innerHeight + 500;
		this.current_bounds.x = stage.innerWidth/2 - this.current_bounds.width/2;
		this.current_bounds.y = stage.innerHeight/2 - this.current_bounds.height/2;
		//End debugging code
	},
	draw: function(){
		this.create_layers();
		//this.log_layers();
		var first_box = this.layers[0];
		first_box.set_x(stage.innerWidth/2 - first_box.width/2);
		first_box.set_y(stage.innerHeight/2 - first_box.height/2);
		first_box.draw();
		first_box.onStage = true;
		
		var buffer = 20;
		//Decide on an x and y location, then call the draw function 
		this.current_bounds = new Boundary_Box();
		this.current_bounds.x = first_box.x - buffer/2;
		this.current_bounds.y = first_box.y - buffer/2;
		this.current_bounds.width = first_box.width + buffer;
		this.current_bounds.height = first_box.height + buffer;
		var s = this;
		var recursive_draw = function(){
			for(var i = 1; i< s.layers.length; i++){
				var layer = s.layers[i]; //Get all the boxes on this current layer
				//console.log("i "+i);
				for(var j = 0; j< layer.length; j++){
					var box = layer[j];
					var temp_addr = box.get_address();
					if( temp_addr.substring(temp_addr.length-1, temp_addr.length) == 'B'){
						temp_addr = temp_addr.substring(0, temp_addr.length-2);
						//console.log("base");
					}
					else{
						temp_addr = temp_addr.substring(0, temp_addr.length-1);
						//console.log("not base");
					}
			
					var parent_box = s.get_box_by_address(temp_addr);
					//console.log(parent_box);
					s.place_box( box, parent_box, s.current_bounds );
					box.draw();
					s.router.route(parent_box, box);
					//console.log("j "+j);
				}
			}
			//Now move everything so that the boundary box is in the middle of the page.
		};
		recursive_draw();
		
	},
	move_view: function(to_x, to_y){
		
	},
	log_layers: function(){
		console.log("First Base: "+this.layers[0].get_text());
		for(var i=1; i<this.layers.length; i++){
			for(var j=0; j<this.layers[i].length; j++){
				console.log(this.layers[i][j].get_text()+" at: "+i+", "+j);	
			}
		}
		console.log("End log");
	},
	place_box: function(box, parent, boundary_box){
		/*
		Decision making process on where to put the box...
		
		Place box so as to best maintain a ratio closest to the current screen ratio.
			(ie. innerHeight / innerWidth ~= boundary_box.height / boundary_box.width ) 
			
		This means you have to examine each possible scenario available for placement of 
		the box, (to the right, left, up, down) to see which mantains the aspect ratio the 
		best. 
		*/
		var direction =  boundary_box.get_direction(box, parent, this);
		var expansion;
		if(direction == 'right'){
			box.set_x(parent.x + parent.width + parent.buffer + box.buffer);
			box.set_y(parent.y + parent.height/2 - box.height/2);
			//console.log(box.get_text()+", right");
			expansion = (box.width) - (boundary_box.x + boundary_box.width - (box.x-box.buffer));
			if(expansion < 0)
				expansion = 0;
			boundary_box.width += expansion;
		}
		else if(direction == 'left'){
			box.set_x(parent.x - (parent.buffer + box.width + box.buffer));
			box.set_y(parent.y + parent.height/2 - box.height/2); 
			//console.log(box.get_text()+", left");
			
			expansion = boundary_box.x - (box.x + box.buffer);
			if(expansion < 0)
				expansion = 0;
			boundary_box.width += expansion;
			boundary_box.x -= expansion;
		}
		else if(direction == 'down'){
			box.set_x(parent.x + parent.width/2 - box.width/2);
			box.set_y(parent.y + parent.height + parent.buffer + box.buffer);
			//console.log(box.get_text()+", down");
			
			expansion = (box.height+box.buffer) - (boundary_box.y + boundary_box.height - (box.y-box.buffer));
			if(expansion < 0)
				expansion = 0;
			boundary_box.height += expansion;
		}
		else if(direction == 'up'){
			box.set_x(parent.x + parent.width/2 - box.width/2);
			box.set_y(parent.y - (parent.buffer + box.buffer + box.height));
			//console.log(box.get_text()+", up");
			
			expansion = boundary_box.y - (box.y + box.buffer);
			if(expansion < 0)
				expansion = 0;
			boundary_box.height += expansion;
			boundary_box.y -= expansion;
		}
		else
			console.log("DIRECTION ERROR");
		box.draw();
		box.onStage = true;
	},
	check_for_interference: function(box_x, box_y, box){
		if(Raphael.isBBoxIntersect(box.get_bounds(box_x, box_y), this.layers[0].get_bounds(this.layers[0].x, this.layers[0].y))){
			return false;	
		}
		for(var i = 1; i<this.layers.length; i++){
			var layer = this.layers[i];
			for(var j = 0; j<layer.length; j++){
				var other_box = layer[j];
				if(	other_box.onStage ){
					if( Raphael.isBBoxIntersect(box.get_bounds(box_x, box_y), other_box.get_bounds(other_box.x, other_box.y)) ){
						return false;
					}
				}
			}
		}
		return true;
	},
	create_layers: function(){
		this.parse_chart();
		
		var master_box = new Question_Box();
		master_box.set_text(this.text_array[this.text_array.length-1]);
		master_box.set_color(this.color_schemes[this.current_scheme][0]);
		master_box.set_address('B');
		this.layers[0] = master_box;
		var curr_layer = 1;
		
		var addr = 'B'
		var t = this;
		var recursive_sort = function(layer){
			for(var i=1; i<4; i++){
				addr = addr.concat(i);
				var temp_addr = addr;
				temp_addr = temp_addr.concat('B');
				var addr_result = t.search_chart(addr);
				//console.log('addr: '+addr+', Result: '+addr_result);
				if(addr_result != -1){
					//If this is the case, then we stop here and go onto the next until we go a level up
					var s_box = new Statement_Box();
					s_box.set_color(t.color_schemes[t.current_scheme][2]);
					s_box.set_text(t.text_array[addr_result]);
					s_box.set_address(addr);
					//console.log("Current Layer: "+curr_layer);
					layer.push(s_box);
					addr = addr.substring(0, addr.length-1);
					//console.log("s_box");
				}
				else if(t.search_chart(temp_addr) != -1){
					//If this is the case, then we need to go a level deeper	
					//console.log(t.layers.length+", "+curr_layer);
					curr_layer++;
					if(t.layers.length <= curr_layer){
						var boxes = new Array();
						t.layers[curr_layer] = boxes;
					}
					var temp_box;
					//If the one before was a question box, then this one is an answer
					var parent_addr = temp_addr.substring(0, temp_addr.length-2);
					var parent_box = t.get_box_by_address(parent_addr);
					
					if(parent_box.get_type() === 'Q'){
						temp_box = new Answer_Box();
						temp_box.set_color(t.color_schemes[t.current_scheme][1]);
					}
					//Otherwise this one is a question box
					else{
						temp_box = new Question_Box();
						temp_box.set_color(t.color_schemes[t.current_scheme][0]);
					}
					temp_box.set_text(t.text_array[t.search_chart(temp_addr)]);
					temp_box.set_address(temp_addr);
					layer.push(temp_box);
					
					addr = addr.concat('B');
					
					recursive_sort(t.layers[curr_layer]);
					//curr_layer--;
					addr = addr.substring(0, addr.length-2);
				}
				else{
					//Otherwise, we just exit the current layer.
					addr = addr.substring(0, addr.length-1);
					curr_layer--;
					break;
				}
			}
		};
		this.layers[curr_layer] = new Array();
		recursive_sort(this.layers[curr_layer]);
	},
	get_box_by_address: function(addr){
		if(this.layers[0].get_address() == addr)
			return this.layers[0];
		for(var i=1; i< this.layers.length; i++){
			var layer = this.layers[i];
			for(var j=0; j< layer.length; j++){
				if(layer[j].get_address() == addr)
					return layer[j];	
			}
		}
		return null;
	},
	
	//Search chart and return index of address, or -1 if not found
	search_chart: function(addr){
		for(var i=0; i<this.address_array.length; i++){
			if(this.address_array[i] == addr)
				return i;
		}
		return -1;
	},
	parse_chart: function(){
		for(var i=0; i<current_chart.length; i++){
			this.address_array[i] = current_chart[i].substring(0, current_chart[i].indexOf('&'));
			this.text_array[i] = current_chart[i].substring(current_chart[i].indexOf('&')+1, current_chart[i].length+1);
		}
	},
	/*
	recreate_structure: function(){
		this.parse_chart();
		
		var master_box = new Question_Box();
		master_box.set_text(this.text_array[this.text_array.length-1]);
		master_box.set_color(this.color_schemes[this.current_scheme][0]);
		master_box.set_address('B');
		this.current_array[0] = master_box;
		
		var addr = 'B'
		var t = this;
		var recursive_sort = function(curr_array){
			for(var i=1; i<4; i++){
				addr.concat(i);
				var temp_addr = addr;
				temp_addr.concat('B');
				var addr_result = t.search_chart(addr);
				console.log(addr_result);
				if(addr_result != -1){
					//If this is the case, then we stop here and go onto the next until we go a level up
					var s_box = new Statement_Box();
					s_box.set_color(t.color_schemes[t.current_scheme][2]);
					s_box.set_text(t.text_array[addr_result]);
					curr_array[i] = s_box;
					console.log("addr before: "+addr);
					addr = addr.substring(0, addr.length-1);
					console.log("addr after: "+addr);
				}
				else if(t.search_chart(temp_addr) != -1){
					//If this is the case, then we need to go a level deeper	
					curr_array[i] = new Array();
					var temp_box;
					//If the one before was a question box, then this one is an answer
					if(curr_array[0].getType() === 'Q'){
						temp_box = new Answer_Box();
						temp_box.set_color(this.color_schemes[this.current_scheme][0]);
					}
					//Otherwise this one is a question box
					else{
						temp_box = new Question_Box();
						s_box.set_color(this.color_schemes[this.current_scheme][1]);
					}
					temp_box.set_text(t.text_array[t.search_chart(temp_addr)]);
					curr_array[i][0] = temp_box;
					addr.concat('B');
					this.recursive_sort(addr, curr_array[i]);
					addr = addr.substring(0, addr.length);
				}
				else{
					//Otherwise, we just exit the current layer.
					addr = addr.substring(0, addr.length);
					break;
				}
			}
		};
		recursive_sort(this.current_array);
	},
	*/
	/*
	recursive_sort: function(addr, curr_array){
		for(var i=1; i<4; i++){
			addr.concat(i);
			var temp_addr = addr;
			temp_addr.concat('B');
			var addr_result = this.search_chart(addr);
			if(addr_result != -1){
				//If this is the case, then we stop here and go onto the next until we go a level up
				curr_array[i] = this.text_array[addr_result];
				addr = addr.substring(0, addr.length);
			}
			else if(this.search_chart(temp_addr) != -1){
				//If this is the case, then we need to go a level deeper	
				curr_array[i] = new Array();
				curr_array[i][0] = this.text_array[this.search_chart(temp_addr)];
				addr.concat('B');
				this.recursive_sort(addr, curr_array[i]);
				addr = addr.substring(0, addr.length);
			}
			else{
				//Otherwise, we just exit the current layer.
				addr = addr.substring(0, addr.length);
				break;
			}
		}
	},
	demo_draw: function(){
		var title = new Question_Box();
		title.set_color('#FF4000');
		title.set_text("Is Flowur Right For You");
		title.set_x(stage.innerWidth/2 - title.width/2);
		title.set_y(20);
		title.draw();
		
		var base1 = new Question_Box();
		base1.set_color('#0078FF');
		base1.set_text("Are you a student?");
		base1.set_x(stage.innerWidth/2 - base1.width/2);
		base1.set_y(stage.innerHeight/2 - base1.height/2);
		
		var base2 = new Answer_Box();
		base2.set_color('#646464');
		base2.set_text("Yes");
		base2.set_x(base1.x + base1.width + base1.buffer + base2.buffer);
		base2.set_y(stage.innerHeight/2 - base2.height/2);
		
		var base3 = new Answer_Box();
		base3.set_color('#646464');
		base3.set_text("No");
		base3.set_x(base1.x - base1.buffer - base2.buffer - base2.width);
		base3.set_y(stage.innerHeight/2 - base3.height/2);
		
		var base4 = new Answer_Box();
		base4.set_color('#646464');
		base4.set_text("Dunno");
		base4.set_x(base1.x + base1.width/2 - base4.width/2);
		base4.set_y(base1.y + base1.height + base1.buffer + base4.buffer);
		
		var base5 = new Question_Box();
		base5.set_color('#E21E22');
		base5.set_text("You'll need it for your classes.");
		base5.set_x(base2.x + base2.width + base2.buffer + base5.buffer);
		base5.set_y(stage.innerHeight/2 - base5.height/2);
		
		var base6 = new Question_Box();
		base6.set_color('#E21E22');
		base6.set_text("You'll need it for your buisness.");
		base6.set_x(base3.x - base3.buffer - base6.buffer - base6.width);
		base6.set_y(stage.innerHeight/2 - base6.height/2);
		
		var base7 = new Question_Box();
		base7.set_color('#E21E22');
		base7.set_text("You'll need it for life.");
		base7.set_x(base4.x + base4.width/2 - base7.width/2);
		base7.set_y(base4.y + base4.height + base4.buffer + base7.buffer);
		
		var line1 = paper.rect(base6.x, (base6.y+base6.height/2 - 1), (base5.x - base6.x), 2).attr({"fill": '#444444', 'stroke': 'none' });
		var line2 = paper.rect( (base1.x+base1.width/2 - 1), base1.y, 2, (base7.y - base1.y)).attr({"fill": '#444444', 'stroke': 'none' });
		
		base1.draw();
		base2.draw();
		base3.draw();
		base4.draw();
		base5.draw();
		base6.draw();
		base7.draw();
		
	},
	*/
	
});