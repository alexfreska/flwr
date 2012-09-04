// JavaScript Document
// Written by Patrick Teague
// Last update: 8/10/12
// Viewing mode code

var Viewing_Mode = new Class({
	initialize: function(){
		this.current_scheme = 1;
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
		//Get the current_chart here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
		
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
		//this.log_input();
		this.parse_chart();
		//this.create_layers();
		//this.log_layers();
		var first_box = this.layers[0][0];
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
		
		for(var i=1; i< this.layers.length; i++){
			for(var j=0; j<this.layers[i].length; j++){
				var box = this.layers[i][j];
				var parent_box = this.get_box_by_id(box.fromNodeId);
				this.place_box( box, parent_box, this.current_bounds);
				box.draw();
				this.router.route(parent_box, box);
			}	
		}		
	},
	log_layers: function(){
		console.log("Start Log");
		for(var i=0; i<this.layers.length; i++){
			for(var j=0; j<this.layers[i].length; j++){
				console.log(this.layers[i][j].get_text()+" at: "+i+", "+j);	
			}
		}
		console.log("End log");
	},
	log_input: function(){
		console.log("Start input log");
		var nodes_info = current_chart[1];
		for(var i=0; i<nodes_info.length; i++){
			console.log(nodes_info[i].data+ " with id: "+nodes_info[i].id);	
		}
		console.log("End input log");
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
		if(Raphael.isBBoxIntersect(box.get_bounds(box_x, box_y), this.layers[0][0].get_bounds(this.layers[0][0].x, this.layers[0][0].y))){
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
	get_box_by_id: function(fromId){
		for(var i=0; i< this.layers.length; i++){
			for(var j=0; j< this.layers[i].length; j++){
				if(this.layers[i][j].myId == fromId)
					return this.layers[i][j];	
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
	/*
	parse_chart: function(){
		for(var i=0; i<current_chart.length; i++){
			this.address_array[i] = current_chart[i].substring(0, current_chart[i].indexOf('&'));
			this.text_array[i] = current_chart[i].substring(current_chart[i].indexOf('&')+1, current_chart[i].length+1);
		}
	},
	*/
	parse_chart: function(){
		var title_info = current_chart[0];
		var nodes_info = current_chart[1];
		var arrows_info = current_chart[2];
		
		//Create the nodes, with the proper data in them
		var all_nodes = new Array();
		for(var i=0; i<nodes_info.length; i++){
			var new_node = new Viewing_Box();
			new_node.set_text(nodes_info[i].data);
			new_node.myId = nodes_info[i].id;
			for(var j=0; j<arrows_info.length; j++){
				if(arrows_info[j].from === new_node.myId){
					if(!arrows_info[j].isLink)
						new_node.toNodeId = arrows_info[j].to;
					else
						new_node.linkToNodeId = arrows_info[j].to;
				}
				else if(arrows_info[j].to === new_node.myId){
					if(!arrows_info[j].isLink)
						new_node.fromNodeId = arrows_info[j].from;
				}
			}
			all_nodes.push(new_node);
		}
		
		//Now create the layers
		var current_layer = 1;
		var tis = this;
		var skip_step;
		var recursive_sort_layers = function(layer){
			for(var i=1; i<all_nodes.length; i++){
				skip_step = false;
				for(var u=0; u<layer.length; u++){
					if(all_nodes[i].myId === layer[u].myId)
						skip_step = true;
				}
				if(!skip_step){
					var prev_layer = tis.layers[current_layer-1];
					for(var j=0; j<prev_layer.length; j++){
						//console.log("In here");
						if(prev_layer[j].myId === all_nodes[i].fromNodeId){ /*If node on previous layer points to tis node*/
							if(current_layer%2 == 1){
								all_nodes[i].myType = 'A';
								all_nodes[i].set_color(tis.color_schemes[tis.current_scheme][1]);
							}
							else if(all_nodes[i].toNodeId != null){
								all_nodes[i].myType = 'Q';
								all_nodes[i].set_color(tis.color_schemes[tis.current_scheme][0]);
							}
							else{
								all_nodes[i].myType = 'S';
								all_nodes[i].set_color(tis.color_schemes[tis.current_scheme][2]);
							}
							layer.push(all_nodes[i]);
							console.log(all_nodes[i].get_text());
						}
						if(all_nodes[i].toNodeId != null){
							current_layer++;
							if(tis.layers.length < current_layer+1){
								var next_layer = new Array();
								tis.layers[current_layer] = next_layer;
							}
							recursive_sort_layers(tis.layers[current_layer]);
							current_layer--;
						}
					}
				}
				
			}
		};
		
		var first_layer = new Array();
		first_layer.push(all_nodes[0]); //This is the first node...
		all_nodes[0].set_type('Q');
		all_nodes[0].myColor = this.color_schemes[this.current_scheme][0];
		this.layers[0] = first_layer;
		var second_layer = new Array();
		this.layers.push(second_layer);
		recursive_sort_layers(this.layers[1]);
	},
	
	/*
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