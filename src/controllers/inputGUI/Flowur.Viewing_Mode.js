// JavaScript Document
// Written by Patrick Teague
// Last update: 9/4/12
// Viewing mode code

var Viewing_Mode = new Class({
	initialize: function(){
		document.getElementById('application').style.backgroundColor = '#F0F0F0';
		this.current_scheme = 3;
		this.color_scheme_1 = ['#287BDB', '#F0E400', '#646464'];//Blue/Yellow scheme
		this.color_scheme_2 = ['#E51B2A', '#F79000', '#444444'];//Red/orange scheme
		this.color_scheme_3 = ['#5670CF', '#68D019', '#555555'];//Green/Blue scheme
		this.color_scheme_4 = ['#FF8C00', '#1D9ACF', '#777777'];//Orange/Blue scheme
		this.color_schemes = [this.color_scheme_1, this.color_scheme_2, this.color_scheme_3, this.color_scheme_4];
		
		this.use_textures = true;
		this.texture_scheme = 0;
		this.texture_scheme_1 = ['src/controllers/inputGUI/images/tinyStripes.png', 'src/controllers/inputGUI/images/tinyStripes.png', 'src/controllers/inputGUI/images/tinyStripes.png', 'src/controllers/inputGUI/images/stripes.png']; //Dark scheme
		this.texture_schemes = [this.texture_scheme_1]; 
		
		this.text_array = new Array();
		this.address_array = new Array();
		this.current_array = new Array();
		this.layers = new Array();
		this.current_bounds;
		this.router;
		//Get the current_chart here----------------------------------------------------------
		this.draw();	
		this.view_nav = new Viewer_Navigator();
		//This is for debugging purposes, comment out when done
		
		this.current_bounds.width = stage.innerWidth + 1000;
		this.current_bounds.height = stage.innerHeight + 1000;
		this.current_bounds.x = stage.innerWidth/2 - this.current_bounds.width/2;
		this.current_bounds.y = stage.innerHeight/2 - this.current_bounds.height/2;
		
		//End debugging code
	},
	draw: function(){
		//this.log_input();
		this.fast_parse();
		var allNodes = new Array();
		for(var i=0; i< this.layers.length; i++){
			for(var j=0; j<this.layers[i].length; j++){
				allNodes.push(this.layers[i][j]);
			}
		}
		this.router = new Arrow_Router('#AAAAAA', allNodes);
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
				//this.router.route(parent_box, box);
			}	
		}	
		for(var i=1; i<this.layers.length; i++){
			for(var j=0; j<this.layers[i].length; j++){
				var box = this.layers[i][j];
				var parent_box = this.get_box_by_id(box.fromNodeId);
				this.router.route(parent_box, box);
			}		
		}
		for(var i=0; i< this.layers.length; i++){
			for(var j=0; j<this.layers[i].length; j++){
				var box = this.layers[i][j];
				if(box.linkToNodeId != null){
					var linked_box = this.get_box_by_id(box.linkToNodeId);
					this.router.route(box, linked_box);
				}
			}
		}
		/*
		for(var i=0; i< this.layers.length; i++){
			for(var j=0; j<this.layers[i].length; j++){
				var box = this.layers[i][j];
				box.toFront();
			}
		}
		*/
			
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
		//console.log(direction);
		var expansion;
		
		if(direction === undefined){
			//console.log("SPECIAL CASE");
			//Find closest open location and dump the node there
			//Find an open spot for box to fit in. The closer to the parent, the better.
			var fartherUpParent = this.get_box_by_id(parent.fromNodeId);
			while(boundary_box.get_direction(box, fartherUpParent, this) === undefined){
				if(fartherUpParent.myId != 0)
					fartherUpParent = this.get_box_by_id(fartherUpParent);
				else{
					console.log("larger direction error");
					break;
				}
			}
			parent = fartherUpParent;
			direction = boundary_box.get_direction(box, parent, this);
			//console.log("DIRECTION ERROR");
		}
		
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
	
	fast_parse: function(){
		//Sort all the relations and create all viewing boxes
		var title_info = current_chart[0];
		var nodes_info = current_chart[1];
		var arrows_info = current_chart[2];
		
		//Create the nodes, with the proper data in them
		var all_nodes = new Array();
		for(var i=0; i<nodes_info.length; i++){
			var new_node = new Viewing_Box();
			//new_node.myTexture = this.viewing_box_texture;
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
		//Now sort nodes to layers
		var currLayer = 0;		
		var maxLayer = 0;
		for(var i= 0; i<all_nodes.length; i++){
			var nodeToSort = all_nodes[i]; //node we are trying to find a layer for
			var parentNode = nodeToSort;
			while(parentNode.myId != 0){
				for(var j = 0; j<all_nodes.length; j++){
					if(parentNode.fromNodeId == all_nodes[j].myId){
						parentNode = all_nodes[j];
						break;	
					}
				}
				currLayer++;
			}
			nodeToSort.myLayer = currLayer;
			if(currLayer > maxLayer)
				maxLayer = currLayer;
			currLayer = 0;
		}
		//Create all the layers for things to go on
		for(var i=0; i<=maxLayer; i++){
			var layer = new Array();
			this.layers.push(layer);	
		}
		
		//Now actually create layers structure: into this.layers
		for(var i=0; i<all_nodes.length; i++){
			//console.log(all_nodes[i].myLayer);
			this.layers[all_nodes[i].myLayer].push(all_nodes[i]);
			if(all_nodes[i].myLayer%2 == 1){
				all_nodes[i].myType = 'A';
				if(this.use_textures)
					all_nodes[i].myTexture = this.texture_schemes[this.texture_scheme][1];
				
				all_nodes[i].set_color(this.color_schemes[this.current_scheme][1]);
			}
			else if(all_nodes[i].toNodeId != null){
				all_nodes[i].myType = 'Q';
				if(this.use_textures)
					all_nodes[i].myTexture = this.texture_schemes[this.texture_scheme][0];
				
				all_nodes[i].set_color(this.color_schemes[this.current_scheme][0]);
			}
			else{
				all_nodes[i].myType = 'S';
				if(this.use_textures)
					all_nodes[i].myTexture = this.texture_schemes[this.texture_scheme][2];
				
				all_nodes[i].set_color(this.color_schemes[this.current_scheme][2]);
			}
		}
		if(this.use_textures)
			all_nodes[0].myTexture = this.texture_schemes[this.texture_scheme][3];
		
		all_nodes[0].myColor = this.color_schemes[this.current_scheme][0];
			
		//all_nodes[0].myTexture = 'images/stripes.png';
	},
	//Debugging Functions
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
	}
});