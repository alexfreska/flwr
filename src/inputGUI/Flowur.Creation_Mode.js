// JavaScript Document
//Creation Mode Code

var Creation_Mode = new Class({
	initialize: function(){
		this.node_colors = ['#FFAD00', '#FF0033', '#0074FA', '#FF6431', '#00A300', '#FFEC00', '#FF98C6', '#001598', '#00F787', '#FF10BB'];
		this.counter;
		this.linking;
		this.maxNodes = 3;
		this.currentArray = new Array();
		this.itemsOnStage = new Array();
		this.nodes_info = new Array();
		this.arrows_info = new Array();
		this.flowchart = new Array();
		this.baseChain = new Array();
		this.save_text = paper.text(0,0,"Not Saved").attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#555555', 'font-size': 14});
		this.save_text.attr({'x': (stage.innerWidth - this.save_text.getBBox().width - 10), 'y': (stage.innerHeight - this.save_text.getBBox().height - 10) });
		this.saving_counter;
		this.address_string;
		this.current_color = 1;
		this.arrow_in;
		//this.node_in;
		this.before_node;
		this.linkingNode;
		this.edittingNode;
		this.baseNode;
		this.title = new Title();
		this.baseNode=new Node(stage.innerWidth/2 - 115, stage.innerHeight/2 - 42.5, 230, 85);
		//this.data_in = JSON.parse(string_in);
		/*Sample JSON array input */
		var test_title_info = "This is the title.";
		var test_nodes_info = [ {'id': 0, 'data': "This is the first base."}, {'id': 1, 'data': "Yes"}, {'id': 2, 'data': "No"}, {'id': 3, 'data': "Off of yes"}, {'id': 4, 'data': "Off of no"}];
		var test_arrows_info = [ {'to': 1, 'from': 0, 'isLink': false}, {'to': 2, 'from': 0, 'isLink': false}, {'to': 3, 'from': 1, 'isLink': false}, {'to': 4, 'from': 2, 'isLink': false}, {'to': 4, 'from': 0, 'isLink': true}];
		this.data_in = [test_title_info, test_nodes_info, test_arrows_info];
		//this.data_in = /*get user chart data from server*/ null;
		//If loading data in to be editted
		if( this.data_in != null){
			//Load the text from the title_info into title box
			this.title.setText(this.data_in[0]);
			var nodes_info_temp = this.data_in[1];
			//Find the baseNode text from the nodes_info struct (should be id: 0)
			this.baseNode.setText(nodes_info_temp[0].data);
			this.baseNode.setsize(this.baseNode.textField.getBBox().width + 20, this.baseNode.textField.getBBox().height + 20);
			this.baseNode.position_text();
			//Now add the rest of the nodes to the stage
			var arrows_info_temp = this.data_in[2];
			var unsorted_nodes = new Array();
			unsorted_nodes.push(this.baseNode);
			
			for(var z=0; z<nodes_info_temp.length; z++){
				for(var w=0; w<arrows_info_temp.length; w++){
					if(arrows_info_temp[w].from === z && !arrows_info_temp[w].isLink){
						var to_node;
						//Find connected node
						for(var u=0; u<nodes_info_temp.length; u++){
							if(nodes_info_temp[u].id === arrows_info_temp[w].to){
								to_node = nodes_info_temp[u];
								break;
							}
						}
						//create strait arrow link and new node
						var str_arw = new Strait_Arrow(0,0,to_node.id, nodes_info_temp[z].id);
						str_arw.undraw();
						var next_node = new Node(0,0,230,85);
						next_node.myId = to_node.id;
						next_node.setArrow(str_arw);
						next_node.setText(to_node.data);
						next_node.setsize(next_node.textField.getBBox().width + 20, next_node.textField.getBBox().height + 20);
						next_node.position_text();
						next_node.undraw();
						unsorted_nodes.push(next_node);
					}
				}
			}
			//Create all child arrays
			for(var z=0; z<arrows_info_temp.length; z++){
				if(!arrows_info_temp[z].isLink){
					for(var w=0; w<unsorted_nodes.length; w++){
						if(arrows_info_temp[z].from == unsorted_nodes[w].myId){
							var child_array = new Array();
							child_array.push(unsorted_nodes[w]);
							unsorted_nodes[w].setChildArray(child_array);
						}
					}
				}
			}
			for(var z=0; z<arrows_info_temp.length; z++){
				if(!arrows_info_temp[z].isLink){
					for(var w=0; w<unsorted_nodes.length; w++){
						if(arrows_info_temp[z].to == unsorted_nodes[w].myId){
							for(var u=0; u<unsorted_nodes.length; u++){
								if(arrows_info_temp[z].from === unsorted_nodes[u].myId){
									if(unsorted_nodes[w].getChildArray() != null)
										unsorted_nodes[u].getChildArray().push(unsorted_nodes[w].getChildArray());	
									else
										unsorted_nodes[u].getChildArray().push(unsorted_nodes[w]);	
								}
							}
						}
					}
				}
			}
			//Add in the parent array connections
			var recurse_add_parent = function(base){
				if(base.getChildArray() != null){
					for(var j=1; j<base.getChildArray().length; j++){
						var tempNode;
						if(typeOf(base.getChildArray()[j]) === 'array'){
							tempNode = base.getChildArray()[j][0];
							recurse_add_parent(tempNode);	
						}
						else
							tempNode = base.getChildArray()[j];
						tempNode.setParentArray(base.getChildArray());
					}
				}
			};
			recurse_add_parent(this.baseNode);
			//Now add in the linking arrows
			for(var z=0; z<unsorted_nodes.length; z++){
				for(var w=0; w<arrows_info_temp.length; w++){
					if(arrows_info_temp[w].from === z && arrows_info_temp[w].isLink){
						var to_node;
						//Find connected node
						for(var u=0; u<unsorted_nodes.length; u++){
							if(unsorted_nodes[u].myId === arrows_info_temp[w].to){
								to_node = unsorted_nodes[u];
								break;
							}
						}
						//Create out_link_arrow and in_link_arrow
						var link_out = new Linking_Arrow(0,0, to_node.myId, unsorted_nodes[z].myId, to_node);
						var link_in = new Linked_Arrow(0,0, unsorted_nodes[z]);
						link_in.undraw();
						link_out.undraw();
						unsorted_nodes[z].myLinkedNode = to_node;
						link_out.myLinkedArrow = link_in;
						to_node.addInLinkArrow(link_in);
						unsorted_nodes[z].setOutLinkArrow(link_out);
						
					}
				}
			}	
			//Now position the baseNode
			this.baseNode.set_x(stage.innerWidth/2 - this.baseNode.width/2);
			this.baseNode.set_y(stage.innerHeight/2 - this.baseNode.height/2);
			this.baseNode.setColor(this.node_colors[0]);
			this.baseChain.push(this.baseNode);
			this.counter++;
			this.currentArray = this.baseNode.getChildArray();
			for(var z=1; z<this.currentArray.length; z++){
				var tempNode;
				if(typeOf( this.currentArray[z] ) === 'array'){
					tempNode = this.currentArray[z][0];
				}
				else
					tempNode = this.currentArray[z];
				tempNode.setColor(this.node_colors[this.counter]);	
				tempNode.draw();
				tempNode.setsize(tempNode.textField.getBBox().width + 20, tempNode.textField.getBBox().height + 20);
				tempNode.position_text();
			}
			this.reposition_nodes();
		}
		//Otherwise make a new chart
		else{
			this.baseNode.set_x(stage.innerWidth/2 - this.baseNode.width/2);
			this.baseNode.set_y(stage.innerHeight/2 - this.baseNode.height/2);
			this.baseNode.setColor(this.node_colors[0]);
			this.baseChain.push(this.baseNode);
			this.counter++;
			this.currentArray.push(this.baseNode);
		}
		
		this.v_button = new View_Button();
		this.v_button.set_x(10);
		this.v_button.set_y(stage.innerHeight - (this.v_button.height+20));
		
	},
	getObjectAt: function(click_x, click_y){
		if( this.baseNode.getParentArray() != null){
			if( this.clickedOn( this.baseNode.getParentArray()[0], click_x, click_y) ){
				return this.baseNode.getParentArray()[0];
			}
		}
		for(var i=0; i<this.currentArray.length; i++)
		{
			if( typeOf(this.currentArray[i]) === 'array' && i != 0)
			{
				if( this.clickedOn(this.currentArray[i][0], click_x, click_y) )
					return this.currentArray[i][0];	
			}
			else if( this.clickedOn(this.currentArray[i], click_x, click_y) )
				return this.currentArray[i];
		}
		if( this.clickedOn(this.title, click_x, click_y))
			return this.title;
		if( this.clickedOn(this.v_button, click_x, click_y))
			return this.v_button;
		return null;
	},
	clickedOn: function(node, clk_x, clk_y){
		if(clk_x < node.x || clk_x > node.x+node.width) //If outside x boundaries
			return false;
		else if(clk_y < node.y || clk_y > node.y+node.height) //If outside y boundaries
			return false;
		return true;
	},
	getCurrentArray: function(){ return this.currentArray;},
	displayMessage: function(str){
		var messageBox = new Display_Message(str);
	},
	new_node: function(){
		if(this.currentArray.length < this.maxNodes+1)
		{
			if(this.current_color === (this.node_colors.length))
				this.current_color = 0;
			var new_node = new Node(0, 0, 230, 85);
			var new_str_arw = new Strait_Arrow(0,0, new_node.myId, this.baseNode.myId);
			this.currentArray.push(new_node);
			new_node.setParentArray(this.currentArray);
			new_node.setArrow(new_str_arw);
			new_node.setColor(this.node_colors[this.current_color]);
			//If current layer is a question layer
			if(this.current_color%2){
				if(this.currentArray.length == 2)
					new_node.setText("Yes");
				else if(this.currentArray.length == 3)
					new_node.setText("No");
				else
					new_node.setText("Maybe");
				new_node.setsize(new_node.textField.getBBox().width + 20, new_node.textField.getBBox().height + 20);
				new_node.position_text();
			}
				
			this.reposition_nodes();
			this.counter++;
			this.baseNode.setChildArray(this.currentArray);
			this.save_structure();
		}
		else
			this.displayMessage("Max number of buds reached.");
	},
	reposition_nodes: function(){
		var z_angle = 0;
		if(this.arrow_in != null){
			z_angle = -this.arrow_in.getAngle()*Math.PI/180 + Math.PI;
		}
		this.update_Arrays();
		if(this.arrow_in == null){
			//this.baseNode.set_x( stage.innerWidth/2 - this.baseNode.width/2);
			//this.baseNode.set_y( stage.innerHeight/2 - this.baseNode.height/2);
			this.baseNode.move_to(stage.innerWidth/2 - this.baseNode.width/2, stage.innerHeight/2 - this.baseNode.height/2);
		}
		else{
			var offset = 10;
			var base = this.currentArray[0].getParentArray()[0];
			var rad = Math.atan( (base.height/2)/(base.width/2) ); //Get angle of corner
			var node_x, node_y;
			var node = this.baseNode;
			var arw = this.arrow_in;
			z_angle -= Math.PI;
			
			//Top
			if( z_angle >= rad && z_angle < (Math.PI - rad) ){
				node_y = arw.y - arw.height - node.height - offset;
				node_x = base.x + base.width/2 + (base.height/2 + node.height/2 + arw.height)/Math.tan(z_angle) - node.width/2;
			}
			//Left
			else if( z_angle >= (Math.PI - rad) && z_angle < (Math.PI + rad)){
				node_x = arw.x - arw.width - node.width - offset;
				node_y = base.y + base.height/2 + (node.width/2 + base.width/2 + arw.width + offset*2)*Math.tan(z_angle) - node.height/2;
			}
			//Bottom
			else if( z_angle >= (Math.PI + rad) && z_angle < (2*Math.PI - rad)){
				node_y = arw.y + arw.height + offset;
				node_x = base.x + base.width/2 - (base.height/2 + node.height/2 + arw.height)/Math.tan(z_angle) - node.width/2;
			}
			//Right
			else{
				node_x = arw.x + arw.width + offset;
				node_y = base.y + base.height/2 - (node.width/2 + base.width/2 + arw.width + offset*2)*Math.tan(z_angle) - node.height/2;
			}
			z_angle += Math.PI;
			this.baseNode.move_to(node_x, node_y, 200);
		}
		if(this.baseNode.getOutLinkArrow() != null || this.baseNode.getInLinkArrow() != null)
			this.reposition_linking_arrows(this.baseNode);
		
		var j = this.currentArray.length;
		for(var i =1; i<this.currentArray.length; i++){
			j--;
			var tempNode;
			if(typeOf(this.currentArray[i]) === 'array')
				tempNode = this.currentArray[i][0];
			else
				tempNode = this.currentArray[i];	
	
			tempNode.setColor(this.node_colors[this.current_color]);
			this.distribute_arrows(z_angle, tempNode.getArrow(), tempNode, j);
			/*
			if(tempNode.getOutLinkArrow() != null || tempNode.getInLinkArrow() != null)
					this.reposition_linking_arrows(tempNode);
			*/		
		}
	},
	isLinking: function(){return this.linking},
	distribute_arrows: function(z_angle, arw, node, num){
		var offset = 10;
		arw.setPrevAngle(-arw.getAngle()*Math.PI/180);
		arw.setAngle(0);
		var arw_theta;
		if( this.arrow_in != null) //If there is an arrow in
			arw_theta = (2*Math.PI/(this.currentArray.length))*num + z_angle;
		else
			arw_theta = (2*Math.PI/(this.currentArray.length-1))*num;
		while(arw_theta >= 2*Math.PI)
			arw_theta -= 2*Math.PI;
		this.arrow_to(arw, node, arw.getPrevAngle(), arw_theta);		
	},
	arrow_to: function(arw, node, current_angle, final_angle, z_angle){
		var klass = this;
		var bouncing = false;
		var can_bounce = false;
		var i = 1;
		var animate_to = function()
		{
			//Do calculations here
			var offset = 10;
			var base = klass.currentArray[0];
			var x_and_y = base.getArrowPoint(arw, current_angle);
			var rad = Math.atan( (base.height/2)/(base.width/2) );
			var node_y;
			var node_x;
			
			arw.setAngle(0);
			arw.set_x(x_and_y[0]);
			arw.set_y(x_and_y[1] + arw.height/2);
			arw.setAngle(current_angle*180/Math.PI);
			//Top
			if( current_angle >= rad && current_angle < (Math.PI - rad) ){
				node_y = arw.y - arw.height - node.height - offset;
				node_x = base.x + base.width/2 + (base.height/2 + node.height/2 + arw.height)/Math.tan(current_angle) - node.width/2;
			}
			//Left
			else if( current_angle >= (Math.PI - rad) && current_angle < (Math.PI + rad)){
				node_x = arw.x - arw.width - node.width - offset;
				node_y = base.y + base.height/2 + (node.width/2 + base.width/2 + arw.width + offset*2)*Math.tan(current_angle) - node.height/2;
			}
			//Bottom
			else if( current_angle >= (Math.PI + rad) && current_angle < (2*Math.PI - rad)){
				node_y = arw.y + arw.height + offset;
				node_x = base.x + base.width/2 - (base.height/2 + node.height/2 + arw.height)/Math.tan(current_angle) - node.width/2;
			}
			//Right
			else{
				node_x = arw.x + arw.width + offset;
				node_y = base.y + base.height/2 - (node.width/2 + base.width/2 + arw.width + offset*2)*Math.tan(current_angle) - node.height/2;
			}
			//End calculations here	

			if(!navigate.editting){
				node.move_to(node_x, node_y);
			}
			else{
				node.move_to(node_x, node_y, 200);
			}
			if(node.getOutLinkArrow() != null ){
				klass.reposition_linking_arrows(node);
			}
			
			if(!bouncing)
				increment_arrow.delay(20);
			else
				bounce_arrow.delay(10*i);
		};
		var increment_arrow = function(){
			var direction;
			if(final_angle - current_angle >= 0)
				direction = final_angle - current_angle;
			else
				direction = current_angle - final_angle;
			if(current_angle < final_angle - Math.PI/20){
			//if(direction > Math.PI/20){
				current_angle += Math.PI/10;
				can_bounce = true;
				animate_to();
			}
			else if(current_angle > final_angle + Math.PI/20){ 
			//else if(direction < -Math.PI/20){
				current_angle -= Math.PI/10;
				can_bounce = true;
				animate_to();
			}
			else if(can_bounce){
				bounce_arrow();	
			}
			else{
				//node.reposition_linking_arrows();
			}
		};
		var bounce_arrow = function(){
			bouncing = true;
			if(i<6){
			 	if(i%2){
					current_angle = final_angle + Math.PI/(35*i);
				}
				else{	
					current_angle = final_angle - Math.PI/(35*i);
				}
				i++;
				animate_to();
			}
			else{
				current_angle = final_angle;
				bouncing = false;
				can_bounce = false;
				animate_to();
			}
		};
		animate_to();
	},
	glow_nodes: function(linking_node, glow, base){
		var tmp_array = base.getChildArray();
		if(base != linking_node)
			base.linkingMode(glow);
		if(tmp_array != null){
			for(var i = 1; i<tmp_array.length; i++){
				if( typeOf(tmp_array[i]) === 'array')
					this.glow_nodes(linking_node, glow, tmp_array[i][0]);
				else
					if(tmp_array[i] != linking_node)
						tmp_array[i].linkingMode(glow);
			}
		}
	},
	link_node: function(node){
		if(!this.linking){
			this.linking = true;	
			this.linkingNode = node;
			node.linkingMode('glow');
			this.glow_nodes(node, 'dark', this.find_base(this.baseNode));	
		}
		else {
			this.linkTo(node);	
			node.linkingMode('glow');
			this.glow_nodes(node, 'glow', this.find_base(this.baseNode));
		}
		this.save_structure();
	},
	linkThis: function(node){
		this.linkingNode = node;
		this.linking = true;	
	},
	linkTo: function(node){
		this.linking = false;
		if(node === this.linkingNode) //If trying to link to self, delete all out links
		{
			//Remove the in arrow from this node and on its linked node
			if(node.getOutLinkArrow() != null)
			{ 
				//var linked_node = node.getOutLinkArrow().myLinkedArrow.linked_node;
				var linked_node = node.myLinkedNode;
				node.getOutLinkArrow().undraw();
				linked_node.removeInLinkArrow(node.getOutLinkArrow().getLinkedArrow());
				node.setOutLinkArrow(null);
			}
			
		}
		else if((this.linkingNode.getLinkedNode() != node) && (node.getLinkedNode() === this.linkingNode)) //If trying to form an immediate loop
			this.displayMessage("Action not permitted: Linking these would create an infinite loop.");
		else //Otherwise, just create a new link between nodes
		{
			var linked_arrow = new Linked_Arrow(0,0, this.linkingNode);
			this.linkingNode.myLinkNode = node;
			if(this.linkingNode.getOutLinkArrow() != null) //Remove links, links to new node
			{
				this.linkingNode.getLinkedNode().removeInLinkArrow(this.linkingNode.getOutLinkArrow().getLinkedArrow());
				this.linkingNode.setLinkedNode(node);
				node.addInLinkArrow(linked_arrow);
				this.linkingNode.getOutLinkArrow().setLinkedArrow(linked_arrow);
				this.linkingNode.getOutLinkArrow().set_node(node);
			}
			else
			{
				var linking_arrow = new Linking_Arrow(0,0, node.myId, this.linkingNode.myId, node);
				linking_arrow.undraw();
				this.linkingNode.setLinkedNode(node);
				this.linkingNode.setOutLinkArrow(linking_arrow);
				node.addInLinkArrow(linked_arrow);
				this.linkingNode.getOutLinkArrow().setLinkedArrow(linked_arrow);
				if(this.linkingNode.onStage)
					linking_arrow.draw();
			}
			if(this.linkingNode.onStage)
				this.reposition_linking_arrows(this.linkingNode);
			this.reposition_linking_arrows(node);
		}
	},
	reposition_linking_arrows: function(node){
		var x1 = 0;
		var x2 = 0;
		var i = 0;
		
		var toX, toY, us;
		//Linked Node stuff
		x1 = node.x;
		if(node.getOutLinkArrow() != null)
		{
			node.getOutLinkArrow().set_x(node.x);
			node.getOutLinkArrow().set_y(node.y - (node.getOutLinkArrow().height + 10));
			x2 = x1 + node.getOutLinkArrow().width + 5;	
			node.getOutLinkArrow().draw();
		}
		else
			x2 = x1;
		if(node.getInLinkArrow() != null)
		{
			for(i = 0; i<node.getInLinkArrow().length; i++)
			{
				node.getInLinkArrow()[i].set_x(x2+ i*(node.getInLinkArrow()[i].width + 5));
				node.getInLinkArrow()[i].set_y(node.y - (node.getInLinkArrow()[i].height + 10));
				node.getInLinkArrow()[i].draw();
			}
		}
	},
	remove_linking_arrows: function(node){
		if( node.onStage)
		{
			if(node.getOutLinkArrow() != null)
				node.getOutLinkArrow().draw();
			if(node.getInLinkArrow() != null)
			{
				for(var i = 0; i<node.getInLinkArrow().length; i++)
					node.getInLinkArrow()[i].draw();	
			}
		}	
	},
	add_linking_arrows: function(node){
		if(node.onStage)
		{
			if(node.getOutLinkArrow() != null)
				node.getOutLinkArrow().draw();
			if(node.getInLinkArrow() != null)
			{
				for(var i = 0; i<node.getInLinkArrow().length; i++)
					node.getInLinkArrow()[i].draw();
			}	
		}
	},
	edit_node: function(node){
		this.edittingNode = node;
		node.editText();
		navigate.editting = true;
		//this.reposition_nodes();
	},
	edit_title: function(title){
		this.edittingNode = true;
		title.editText();
		navigate.editting = true;
	},
	done_node: function(node){
		//this.reposition_nodes();
		node.doneEdit();
		this.save_structure();
		//navigate.editting = false;
	},
	done_title: function(title){
		title.doneEdit();
		navigate.editting = false;
		this.save_structure();
	},
	select_node: function(node){
		this.makeThisBase(node);
	},
	makeThisBase: function(newBase){
		this.baseNode.setChildArray(this.currentArray);
		this.arrow_in = newBase.getArrow();
		var final_x = stage.innerWidth/2 - newBase.width/2;
		var final_y = stage.innerHeight/2 - newBase.height/2;
		var anim_time = 120;
		var newBase_x = newBase.x;
		var newBase_y = newBase.y;
		
		//Compress all the previous children
		for(var i = 1; i<this.currentArray.length; i++){
			var tempNode;
			var arw;
			var arwInArray;
			var arwOut;
			if( typeOf(this.currentArray[i]) === 'array')
				tempNode = this.currentArray[i][0];
			else
				tempNode = this.currentArray[i];
			if(tempNode != newBase){
				arw = tempNode.getArrow();
				tempNode.undraw();
				arw.undraw();	
			}
		}
		//End compression algorithm
		var test_base = this.baseNode;
		if(this.baseNode.getOutLinkArrow() != null || this.baseNode.getInLinkArrow() != null){
				this.reposition_linking_arrows(this.baseNode);
			}
		this.baseNode = newBase;
		this.baseChain.push(this.baseNode);
		this.current_color++;
		if(newBase.getChildArray() != null)
			this.currentArray = newBase.getChildArray();
		else
			this.setUpNewArray(newBase);
		this.arrow_in = newBase.getArrow();
		for(var z=1; z<this.currentArray.length; z++){
			var tempNode;
			if(typeOf( this.currentArray[z] ) === 'array')
				tempNode = this.currentArray[z][0];
			else
				tempNode = this.currentArray[z];
			tempNode.setColor(this.node_colors[this.current_color]);	
		}
		var k;
		for(var i=0; i<this.baseChain.length; i++){
			k = this.baseChain.length - i;
			var temp = this.baseChain[i];
			temp.determineOnStage();
			arw = temp.getArrow();
			if(arw != null){
				var pre_angle = -arw.getAngle();
				arw.setAngle(0);
				arw.set_x(arw.x+(final_x-newBase_x));
				arw.set_y(arw.y+(final_y-newBase_y));
				arw.setAngle(pre_angle);
			}
			if(temp.onStage && k<4){
				temp.move_to(temp.x+(final_x-newBase_x), temp.y+(final_y-newBase_y),anim_time);
			}
			else{
				if(temp.onStage)
					temp.undraw();
				temp.x = temp.x+(final_x-newBase_x);
				temp.y = temp.y+(final_y-newBase_y);
				if(arw != null)
					arw.undraw();
			}
		}
		//this.node_in = newBase.getParentArray()[0];
		this.arrow_in = newBase.getArrow();
		var z_angle = -this.arrow_in.getAngle()*Math.PI/180 + Math.PI;
		if(this.baseNode.getOutLinkArrow() != null || this.baseNode.getInLinkArrow() != null)
			this.reposition_linking_arrows(this.baseNode);
		var j = this.currentArray.length;
		for(var i =1; i<this.currentArray.length; i++){
			j--;
			var tempNode;
			if(typeOf(this.currentArray[i]) === 'array')
				tempNode = this.currentArray[i][0];
			else
				tempNode = this.currentArray[i];
				
			if(tempNode.getOutLinkArrow() != null || tempNode.getInLinkArrow() != null){
				this.reposition_linking_arrows(tempNode);
			}
			
			if(!tempNode.onStage)
				tempNode.draw();
			this.distribute_arrows(z_angle, tempNode.getArrow(), tempNode, j);	
		}
		if(test_base.getOutLinkArrow() != null || test_base.getInLinkArrow() != null){
			this.reposition_linking_arrows(test_base);
		}
		if(this.baseNode.getText() === "Enter your text here."){
			navigate.currentNode = this.baseNode;
			this.edit_node(this.baseNode);	
		}
	},
	done_shifting: function(){
		for(var i=0; i<this.currentArray.lenght; i++){
			var tempNode;
			var arw;
			if( typeOf(this.currentArray[i]) === 'array')
				tempNode = this.currentArray[i][0];
			else
				tempNode = this.currentArray[i];
				
			arw = tempNode.getArrow();
			tempNode.determineOnStage();
			arw.determineOnStage();
			if( tempNode.onStage && (this.itemsOnStage.indexOf(tempNode) == -1) )
				this.itemsOnStage.push(tempNode);
			else if(!tempNode.onStage && (this.itemsOnStage.indexOf(tempNode) != -1) )
				this.itemsOnStage.splice(this.itemsOnStage.indexOf(tempNode),1);
				
			if( arw.onStage && (this.itemsOnStage.indexOf(arw) == -1) )
				this.itemsOnStage.push(arw);
			else if(!arw.onStage && (this.itemsOnStage.indexOf(tempNode) != -1) )
				this.itemsOnStage.splice(this.itemsOnStage.indexOf(tempNode), 1);
		}
	},
	back_node: function(node){
		this.advanced_goBack(node);
	},
	advanced_goBack: function(node){
		var newBase = node.getParentArray()[0];
		if(this.currentArray.length == 1){
			newBase.getChildArray().splice(newBase.getChildArray().indexOf(this.baseNode.getChildArray()), 1, this.baseNode);
			this.baseNode.setChildArray(null);
			this.currentArray = null;	
		}
		else{ //Compress all current children.
			node.setChildArray(this.currentArray);
			
			for(var i = 1; i<this.currentArray.length; i++){
				var tempNode;
				var arw;
				var arwInArray;
				var arwOut;
				if( typeOf(this.currentArray[i]) === 'array')
					tempNode = this.currentArray[i][0];
				else
					tempNode = this.currentArray[i];
				arw = tempNode.getArrow();
				tempNode.undraw();
				arw.undraw();	
				arwInArray = tempNode.getInLinkArrow();
				if(arwInArray != null){
					for(var l=0; l < arwInArray.length; l++){
						arwInArray[l].undraw();
						arwInArray[l].onStage = false;	
					}
				}
				arwOut = tempNode.getOutLinkArrow();
				if(arwOut != null){
					arwOut.undraw();	
					arwOut.onStage = false;
				}	
			}
		}
		this.baseChain.pop();
		this.baseNode = newBase;
		this.current_color--;
		if(this.current_color < 0)
			this.current_color = this.node_colors.length-1;
		this.currentArray = newBase.getChildArray();
		
		this.arrow_in = newBase.getArrow();
		
		var final_x = stage.innerWidth/2 - newBase.width/2;
		var final_y = stage.innerHeight/2 - newBase.height/2;
		var anim_time = 60;
		var newBase_x = newBase.x;
		var newBase_y = newBase.y;
		
		var k;
		var t1;
		for(var i=0; i<this.baseChain.length; i++){
			k = this.baseChain.length - i;
			var temp = this.baseChain[i];
			arw = temp.getArrow();
			t1 = temp.onStage;
			temp.x = temp.x+(final_x-newBase_x);
			temp.y = temp.y+(final_y-newBase_y);
			temp.determineOnStage();
			temp.x = temp.x-(final_x-newBase_x);
			temp.y = temp.y-(final_y-newBase_y);
			if(!t1 && temp.onStage)
				temp.draw();
			if(arw != null){
				var pre_angle = -arw.getAngle();
				arw.setAngle(0);
				arw.set_x(arw.x+(final_x-newBase_x));
				arw.set_y(arw.y+(final_y-newBase_y));
				arw.setAngle(pre_angle);
			}
			if(temp.onStage && k<4){
				temp.move_to(temp.x+(final_x-newBase_x), temp.y+(final_y-newBase_y),anim_time); 		
			}
			else{
				if(temp.onStage)
					temp.undraw();
				temp.x = temp.x+(final_x-newBase_x);
				temp.y = temp.y+(final_y-newBase_y);
				if(arw != null)
					arw.undraw();
			}
			
		}
		var z_angle = 0;
		if(this.arrow_in != null){
			z_angle = -this.arrow_in.getAngle()*Math.PI/180 + Math.PI;
		}
		if(this.baseNode.getOutLinkArrow() != null || this.baseNode.getInLinkArrow() != null)
			this.reposition_linking_arrows(this.baseNode);
		var j = this.currentArray.length;
		for(var i =1; i<this.currentArray.length; i++){
			var tempNode;
			var arwInArray;
			var arwOut;
			j--;
			if(typeOf(this.currentArray[i]) === 'array')
				tempNode = this.currentArray[i][0];
			else
				tempNode = this.currentArray[i];

			if(!tempNode.onStage)
				tempNode.draw();
			this.distribute_arrows(z_angle, tempNode.getArrow(), tempNode, j);
			if(tempNode.getOutLinkArrow() != null || tempNode.getInLinkArrow() != null){
				this.reposition_linking_arrows(tempNode);
			}
			arwInArray = tempNode.getInLinkArrow();
			arwOut = tempNode.getOutLinkArrow();
			this.reposition_linking_arrows(tempNode);
		}
	},
	setUpNewArray: function(node){
		//if node doesn't already have an array associated with it, create one for it.
		if( node.getChildArray() == null)
		{
			var tempArray = node.getParentArray();
			var newArray = new Array; //Create a newArray used to hold everything attached to this node
			newArray.push(node); //Add this node as the this.baseNode of the newArray
			node.setChildArray(newArray); //Add this array to the this.baseNode
			tempArray[node.getParentArray().indexOf(node)] = node.getChildArray(); //Replace this node with the newArray holding it	
		}
		node.setParentArray(this.currentArray);
		this.currentArray = node.getChildArray(); //Make this the current array we edit.
		for(var i = 1; i<this.currentArray.length; i++)
		{
			var tempNode;
			if( typeOf(this.currentArray[i]) === 'array')
				tempNode = this.currentArray[i][0];
			else
				tempNode = this.currentArray[i];	
			tempNode.draw();
			tempNode.getArrow().draw();
			this.add_linking_arrows(tempNode);
		}
		this.reposition_nodes.delay(300, this);	
	},
	update_Arrays: function(){
		this.baseNode.setChildArray(this.currentArray);
	},
	delete_node: function(node){
		this.back_node(node);
		this.deleteNode(node, node.getArrow(), node.getOutLinkArrow(), node.getInLinkArrow());
		this.save_structure();
	},
	deleteNode: function(node, arw, lArw, ldArw){		
		if(node.getChildArray() != null){
			this.currentArray.splice(this.currentArray.indexOf(node.getChildArray()), 1);
		}
		else{
			this.currentArray.splice(this.currentArray.indexOf(node), 1);
		}
		this.counter--;
		if(lArw != null){
			lArw.undraw();
			lArw.getLinkedArrow().undraw();
			node.getLinkedNode().removeInLinkArrow(lArw.getLinkedArrow());
			lArw = null;
		}
		if(ldArw != null){
			for(var i = 0; i<ldArw.length; i++){
				ldArw[i].undraw();
				node.removeInLinkArrow(ldArw[i]);	
			}
		}
		if(arw != null){
			arw.undraw();
			arw = null;
		}
		if(node != null){
			node.undraw();
			node.setArrow(null);
			node = null;
		}
		this.reposition_nodes();	
	},
	//This function converts the current structure to test held in this.nodes_info.
	//Then it sends this.nodes_info to our PHP for storage on server.
	save_structure: function(){
		this.saving_counter = 0; //Clear so index of this.nodes_info starts out at 0
		this.address_string = ""; //Clear so address starts out new.
		while(this.nodes_info.length > 0) //Remove all elements from the last save
			this.nodes_info.pop();
		this.create_node_info_array(this.find_base(this.baseNode)); //Find the first base and send it to initiate sorting
		//current_chart = this.nodes_info;
		this.flowchart[0] = this.title.getText();
		this.flowchart[1] = this.nodes_info;
		this.flowchart[2] = this.arrows_info;
		current_chart = this.flowchart;
		this.update_save();
		//Uncomment once PHP is up and running
		//Send everything to our PHP
		/*
		var flow_output = JSON.stringify(this.flowchart);
		var urlVariables = new URLVariables();
		urlVariables.flowchart = flow_output;
		//Replace the http://localhost.retrive.php with our PHP
		var urlRequest = new URLRequest("http://localhost/retrive.php");
		urlRequest.data = urlVariables;
		sendToURL(urlRequest);
		//You can then use $_GET["flowchart"]; in PHP to retrieve the variables
		*/
		
	},
	update_save: function(){
		var time_stamp = new Date();
		var hour_stamp = time_stamp.getHours();
		var minute_stamp = time_stamp.getMinutes();
		var AM_PM;
		if(minute_stamp < 10)
			minute_stamp = "0" + minute_stamp;
		if(hour_stamp > 11)
			AM_PM = "PM";
		else
			AM_PM = "AM";
		if(hour_stamp > 12)
			hour_stamp -= 12;
		this.save_text.remove();
		this.save_text = null;
		
		this.save_text = paper.text(0,0, "Saved: "+hour_stamp+":"+minute_stamp+" "+AM_PM).attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#555555', 'font-size': 14});
		var save_x = stage.innerWidth - this.save_text.getBBox().width - 10;
		var save_y = stage.innerHeight - this.save_text.getBBox().height - 10;
		this.save_text.attr({'x': save_x, 'y': save_y});
		
	},
	//The following is a recursive function that sorts through the current node structure
	//and returns the first base node, which doesn't have a parent array.(ie. It's the first)
	find_base: function(currentBase){
		if(currentBase.getParentArray() != null)//This isn't it
			currentBase = this.find_base( (currentBase.getParentArray())[0] );
		return currentBase;
	},
	create_node_info_array: function(currentNode){
		this.nodes_info.push(currentNode.get_info_struct());
		if(currentNode.getArrow() != null)
			this.arrows_info.push(currentNode.getArrow().get_info_struct());
		if(currentNode.getOutLinkArrow() != null)
			this.arrows_info.push(currentNode.getOutLinkArrow().get_info_struct());
		if(currentNode.getChildArray() != null){
			for(var i = 1; i<currentNode.getChildArray().length; i++){
				if( typeOf(currentNode.getChildArray()[i]) === 'array')
					this.create_node_info_array(currentNode.getChildArray()[i][0]);	
				else
					this.create_node_info_array(currentNode.getChildArray()[i]);
			}
		}
	},
	get_address_of: function(node){
		if(node.getParentArray() != null){
			var str;
			for(var i = 1; i<node.getParentArray().length; i++){
				if( typeOf(node.getParentArray()[i]) === 'array'){
					if(node.getParentArray()[i][0] === node)
						str = String(this.get_address_of(node.getParentArray()[i][0].getParentArray()[0]))+'B'+String(i);	
				}
				if( node.getParentArray()[i] === node)
					str = String(this.get_address_of(node.getParentArray()[0]))+'B'+String(i);
			}
			return str;
		}
		else
			return '';
	},
	reposition_new: function(){
		this.title.reposition();
		this.save_text.attr({'x': (stage.innerWidth - this.save_text.getBBox().width - 10), 'y': (stage.innerHeight - this.save_text.getBBox().height - 10) }); 
		this.reposition_nodes();
	},
	delete_choice_node: function(node, arw, lArw, ldArray){
		if(arw != null){
			//if(arw.onStage)
				arw.undraw();
			arw = null;
		}
		if(lArw != null){
			if(lArw.onStage)
				lArw.undraw();
			lArw = null;
		}
		if(ldArray != null){
			for(var i = 0; i<ldArray.length; i++){
				if(ldArray[i] != null){
					if( ldArray[i].onStage)
						ldArray[i].undraw();
					ldArray[i] = null;	
				}
			}
			ldArray = null;
		}
		if( node.onStage)
			node.undraw();
		node = null;
	},
	close_all: function(){
		this.title.undraw();
		this.title = null;
		this.v_button.undraw();
		this.v_button = null;
		this.save_text.remove();
		this.save_text = null;
		this.close_it(this.find_base(this.baseNode));
	},
	close_it: function(currentNode){
		if(currentNode.getChildArray() != null){
			for(var i = 1; i< currentNode.getChildArray().length; i++){
				if( typeOf(currentNode.getChildArray()[i]) === 'array')
					this.close_it( currentNode.getChildArray()[i][0] );
				else
					this.delete_choice_node( currentNode.getChildArray()[i], currentNode.getChildArray()[i].getArrow(), currentNode.getChildArray()[i].getOutLinkArrow(), currentNode.getChildArray()[i].getInLinkArrow());	
			}
			this.delete_choice_node(currentNode, currentNode.getArrow(), currentNode.getOutLinkArrow(), currentNode.getInLinkArrow());
		}
		else
			this.delete_choice_node(currentNode, currentNode.getArrow(), currentNode.getOutLinkArrow(), currentNode.getInLinkArrow());
	},
});