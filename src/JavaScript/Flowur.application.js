// JavaScript Document
// Application Holder Class
//0xFFAD00, 0xFF0033, 0x0074FA, 0xFF6431, 0x00A300, 0xFFEC00, 0xFF98C6, 0x001598, 0x00F787, 0xFF10BB
var paper;
var creator;
var navigate;
var background;
var stage = window;

window.onresize = function()//Resize and reposition everything here.
{
	document.getElementById('application').width = stage.innerWidth;
	document.getElementById('application').height = stage.innerHeight;
	paper.setSize(stage.innerWidth, stage.innerHeight);
	background.attr({width: stage.innerWidth, height: stage.innerHeight});
	creator.reposition_new();	
};
window.addEvent('domready', function(){
    paper = new Raphael(document.getElementById('application'), stage.innerWidth, stage.innerHeight);
	background = paper.rect(0,0,stage.innerWidth, stage.innerHeight);
	background.attr({fill: "90-#DADADA-#F5F5F5:50-#DADADA", stroke: 'none'});
	/* 
	var container = document.id('application');
	//console.log(container.get('id'));

	container.addEvent('mousedown', function(event){
		event.preventDefault();	
		//console.log('click');
	});
	*/
	navigate = new Command_Navigator();
	creator = new Creation_Mode();
});

var Creation_Mode = new Class({
	initialize: function(){
		this.node_colors = ['#FFAD00', '#FF0033', '#0074FA', '#FF6431', '#00A300', '#FFEC00', '#FF98C6', '#001598', '#00F787', '#FF10BB'];
		this.counter;
		this.linking;
		this.maxNodes = 3;
		this.currentArray = new Array();
		this.itemsOnStage = new Array();
		this.textArray = new Array();
		this.saving_counter;
		this.address_string;
		this.current_color = 1;
		this.arrow_in;
		this.node_in;
		this.before_node;
		this.baseNode=new Node(stage.innerWidth/2 - 115, stage.innerHeight/2 - 42.5, 230, 85);
		this.baseChain = new Array();
		this.linkingNode;
		this.edittingNode;
		//End variable definitions
		
		this.baseNode.set_x(stage.innerWidth/2 - this.baseNode.width/2);
		this.baseNode.set_y(stage.innerHeight/2 - this.baseNode.height/2);
		this.baseNode.setColor(this.node_colors[0]);
		this.baseChain.push(this.baseNode);
		this.counter++;
		this.title = new Title();
		
		this.currentArray.push(this.baseNode);
	},
	getObjectAt: function(click_x, click_y){
		for(var i=0; i<this.currentArray.length; i++)
		{
			if( typeOf(this.currentArray[i]) === 'array'	&& i != 0)
			{
				if( this.clickedOn(this.currentArray[i][0], click_x, click_y) )
					return this.currentArray[i][0];	
			}
			else if( this.clickedOn(this.currentArray[i], click_x, click_y) )
				return this.currentArray[i];
		}
		if( this.clickedOn(this.title, click_x, click_y))
			return this.title;
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
			var new_str_arw = new Strait_Arrow(0,0);
			this.currentArray.push(new_node);
			new_node.setParentArray(this.currentArray);
			new_node.setArrow(new_str_arw);
			new_node.setColor(this.node_colors[this.current_color]);
			//this.distribute_arrows(new_str_arw, new_node, this.currentArray.length-1);	
			this.reposition_nodes();
			this.counter++;
			this.baseNode.setChildArray(this.currentArray);
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
			this.baseNode.move_to(stage.innerWidth/2 - this.baseNode.width/2, stage.innerHeight/2 - this.baseNode.height/2, 200);
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
			//this.baseNode.set_x(node_x);
			//this.baseNode.set_y(node_y);
		}
		if(this.baseNode.getOutLinkArrow() != null || this.baseNode.getInLinkArrow() != null)
			this.reposition_linking_arrows(this.baseNode);
		var j = this.currentArray.length;
		for(var i =1; i<this.currentArray.length; i++){
			j--;
			if(typeOf(this.currentArray[i]) === 'array'){
				var tempNode = this.currentArray[i][0];
				tempNode.setColor(this.node_colors[this.current_color]);
				this.distribute_arrows(z_angle, tempNode.getArrow(), tempNode, j);
			}
			else{
				this.currentArray[i].setColor(this.node_colors[this.current_color]);
				this.distribute_arrows(z_angle, this.currentArray[i].getArrow(), this.currentArray[i], j);	
			}
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
		if( (node.getOutLinkArrow() != null) || (node.getInLinkArrow() != null))
		{
			this.reposition_linking_arrows(node);
		}
	},
	arrow_to: function(arw, node, current_angle, final_angle, z_angle){
		var klass = this;
		var bouncing = false;
		var can_bounce = false;
		var i = 1;
		var animate_to = function(){
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
			
			//node.set_x(node_x);
			//node.set_y(node_y);
			if(!navigate.editting){
				node.move_to(node_x, node_y);
			}
			else{
				node.move_to(node_x, node_y, 200);
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
	link_node: function(node){
		if(!this.linking){
			this.linking = true;	
			this.linkingNode = node;
		}
		else {
			this.linkTo(node);		
		}
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
			if(node.getLinkedNode() != null)
			{
				if(node.getLinkedNode().getInLinkArrow()[node.getLinkedNode().getInLinkArrow().indexOf(node.getOutLinkArrow().getLinkedArrow())].onStage)
					node.getLinkedNode().getInLinkArrow()[node.getLinkedNode().getInLinkArrow().indexOf(node.getOutLinkArrow().getLinkedArrow())].draw();
				node.getOutLinkArrow().draw();
				node.getLinkedNode().removeInLinkArrow(node.getOutLinkArrow().getLinkedArrow());
			}
			node.setLinkedNode(null);
			node.setOutLinkArrow(null);
		}
		else if((this.linkingNode.getLinkedNode() != node) && (node.getLinkedNode() === this.linkingNode)) //If trying to form an immediate loop
			this.displayMessage("Action not permitted: Linking these would create an infinite loop.");
		else //Otherwise, just create a new link between nodes
		{
			var linked_arrow = new Linked_Arrow(0,0);
			if(this.linkingNode.getOutLinkArrow() != null) //Remove links, links to new node
			{
				if( this.linkingNode.getLinkedNode().getInLinkArrow()[this.linkingNode.getLinkedNode().getInLinkArrow().indexOf(this.linkingNode.getOutLinkArrow().getLinkedArrow())].onStage)
					this.linkingNode.getLinkedNode().getInLinkArrow()[this.linkingNode.getLinkedNode().getInLinkArrow().indexOf(this.linkingNode.getOutLinkArrow().getLinkedArrow())].draw();
				this.linkingNode.getLinkedNode().removeInLinkArrow(this.linkingNode.getOutLinkArrow().getLinkedArrow());
				this.linkingNode.setLinkedNode(node);
				node.addInLinkArrow(linked_Arrow);
				this.linkingNode.getOutLinkArrow().setLinkedArrow(linked_Arrow);
			}
			else
			{
				var linking_Arrow = new Linking_Arrow(0,0);
				this.linkingNode.setLinkedNode(node);
				this.linkingNode.setOutLinkArrow(linking_Arrow);
				node.addInLinkArrow(linked_arrow);
				this.linkingNode.getOutLinkArrow().setLinkedArrow(linked_arrow);
				if(!this.linkingNode.onStage)
					this.linking_Arrow.draw();
			}
			this.reposition_linking_arrows(node);
		}
	},
	reposition_linking_arrows: function(node){
		var x1 = 0;
		var x2 = 0;
		var i = 0;
		//Linked Node stuff
		x1 = node.x;
		if(node.getOutLinkArrow() != null)
		{
			if(node.getArrow().x < (node.x+node.width/2) )
				node.getOutLinkArrow().set_x(node.x+node.width/2 + 10);
			else
				node.getOutLinkArrow().set_x(node.x+10);
			node.getOutLinkArrow().set_x(node.x);
			node.getOutLinkArrow().set_y(node.y - (node.getOutLinkArrow().height + 10));
			x2 = x1 + node.getOutLinkArrow().width + 5;	
		}
		else
			x2 = x1;
		if(node.getInLinkArrow() != null)
		{
			for(i = 0; i<node.getInLinkArrow().length; i++)
			{
				node.getInLinkArrow()[i].set_x(x2+ i*(node.getInLinkArrow()[i].width + 5));
				node.getInLinkArrow()[i].set_y(node.y - (node.getInLinkArrow()[i].height + 10));	
			}
		}
		//LinkingNode Stuff
		x1 = 0;
		x2 = 0;
		if(this.linkingNode != null && this.linkingNode.getOutLinkArrow() != null)
		{
			this.linkingNode.getOutLinkArrow().set_x(this.linkingNode.x);
			this.linkingNode.getOutLinkArrow().set_y(this.linkingNode.y - (this.linkingNode.getOutLinkArrow().height + 10));
			x2 = this.linkingNode.getOutLinkArrow().x + this.linkingNode.getOutLinkArrow().width + 5;	
		}
		if(this.linkingNode != null && this.linkingNode.getInLinkArrow() != null)
		{
			for(i = 0; i<this.linkingNode.getInLinkArrow().length; i++)
			{
				this.linkingNode.getInLinkArrow()[i].x = x2 + i*(this.linkingNode.getInLinkArrow()[i].width + 5);
				this.linkingNode.getInLinkArrow()[i].y = this.linkingNode.y - (this.linkingNode.getInLinkArrow()[i].height + 10);
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
		//navigate.editting = false;
	},
	done_title: function(title){
		title.doneEdit();
		navigate.editting = false;
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
		
		for(var i = 1; i<this.currentArray.length; i++){
			var tempNode;
			var arw;
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
		this.baseNode = newBase;
		this.baseChain.push(this.baseNode);
		this.current_color++;
		if(newBase.getChildArray() != null)
			this.currentArray = newBase.getChildArray();
		else
			this.setUpNewArray(newBase);
		this.arrow_in = newBase.getArrow();
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
				//console.log(temp.getText());
				//temp.move_to(temp.x+(final_x-newBase_x), temp.y+(final_y-newBase_y),300);
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
		this.node_in = newBase.getParentArray()[0];
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
			if(!tempNode.onStage)
				tempNode.draw();
			this.distribute_arrows(z_angle, tempNode.getArrow(), tempNode, j);	
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
			this.baseNode.setChildArray(null);
			this.currentArray = null;	
		}
		else{ //Compress all current children.
			node.setChildArray(this.currentArray);
			
			for(var i = 1; i<this.currentArray.length; i++){
				var tempNode;
				var arw;
				if( typeOf(this.currentArray[i]) === 'array')
					tempNode = this.currentArray[i][0];
				else
					tempNode = this.currentArray[i];
				arw = tempNode.getArrow();
				tempNode.undraw();
				arw.undraw();	
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
			j--;
			if(typeOf(this.currentArray[i]) === 'array')
				tempNode = this.currentArray[i][0];
			else
				tempNode = this.currentArray[i];

			if(!tempNode.onStage)
				tempNode.draw();
			this.distribute_arrows(z_angle, tempNode.getArrow(), tempNode, j);
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
		this.deleteNode(node, node.getArrow(), node.getOutLinkArrow(), node.getInLinkArrow());
	},
	deleteNode: function(node, arw, lArw, ldArw){
		if(node.getChildArray() != null)
			this.currentArray.splice(this.currentArray.indexOf(node.getChildArray()), 1);
		else
			this.currentArray.splice(this.currentArray.indexOf(node), 1);
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
		if(node != null)
			node.undraw();
		if(arw != null)
			arw.undraw();
		arw = null;
		node = null;
		this.reposition_nodes();	
	},
	//This function converts the current structure to test held in this.textArray.
	//Then it sends this.textArray to our PHP for storage on server.
	save_structure: function(){
		this.saving_counter = 0; //Clear so index of this.textArray starts out at 0
		this.address_string = ""; //Clear so address starts out new.
		while(this.textArray.length > 0) //Remove all elements from the last save
			this.textArray.pop();
		this.create_text_Array(this.find_base(this.baseNode)); //Find the first base and send it to initiate sorting
		//this.set_current_chart(this.textArray);
		this.displayMessage("Flowchart Saved!");
		//Uncomment once PHP is up and running
		//Send everything to our PHP
		/*
		var urlVariables = new URLVariables();
		urlVariables.flowchart = this.textArray;
		//Replace the http://localhost.retrive.php with our PHP
		var urlRequest = new URLRequest("http://localhost/retrive.php");
		urlRequest.data = urlVariables;
		sendToURL(urlRequest);
		//You can then use $_GET["flowchart"]; in PHP to retrieve the variables
		*/
	},
	//The following is a recursive function that sorts through the current node structure
	//and returns the first base node, which doesn't have a parent array.(ie. It's the first)
	find_base: function(currentBase){
		if(currentBase.getParentArray() != null)//This isn't it
			currentBase = this.find_base( (currentBase.getParentArray())[0] );
		return currentBase;
	},
	//The following is a recursive function that sorts through the current node structure
	//and creates an address (this.address_string), which contains 1)the location of the node,
	//and 2)A stop character "&", and 3)the text that goes in that location.
	//To use this function properly, set this.saving_counter = 0, and pass this.baseNode to it.
	create_text_Array: function(currentNode){
		if(currentNode.getChildArray() != null){
			this.address_string += 'B';
			for(var i = 1; i<currentNode.getChildArray().length; i++){
				this.address_string += String(i);
				if( typeOf(currentNode.getChildArray()[i]) === 'array'){
					this.create_text_Array(currentNode.getChildArray()[i][0]);
					this.address_string = this.address_string.slice(0, this.address_string.length-1);	
				}
				else
					this.create_text_Array(currentNode.getChildArray()[i]);
			}
		}
		if(currentNode.getOutLinkArrow() != null){
			this.address_string += 'L'+String(this.get_address_of(currentNode.getLinkedNode()));
			if(this.address_string.indexOf("null",0) != -1)
				this.address_string.replace("null", "");	
		}
		this.address_string += "&";
		this.textArray[this.saving_counter] = this.address_string.concat(currentNode.getText());
		if(currentNode.getOutLinkArrow() != null)
			this.address_string = this.address_string.slice(0, this.address_string.indexOf("L"));
		else
			this.address_string = this.address_string.slice(0, this.address_string.indexOf("&"));
		this.address_string = this.address_string.slice(0, this.address_string.length-1);
		this.saving_counter++;
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
		this.reposition_nodes();
	},
	delete_choice_node: function(node, arw, lArw, ldArray){
		if(arw != null){
			if(arw.onStage)
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