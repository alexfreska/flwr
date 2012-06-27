// JavaScript Document
//Node class
var Node = new Class({	
	initialize: function(x,y,width,height){
		this.nodeID = 'node';
		this.id = 'node';
		this.x = x;
		this.y = y;
		this.myId = 'text-box-' + Node.getUniqueId();
		this.width = width;
		this.height = height;
		this.myColor = '#000000';
		this.myArrow;
		this.myLinkedNode;
		this.childArray;
		this.parentArray;
		this.outLinkArrow;
		this.inLinkArrow = new Array();
		this.onStage = false;
		this.done_edit = true;
		this.resized = false;
		this.myText = "";
		this.draw();
		this.setText("Enter your text here.");
	},
	hasChildArray: function(){
		if(childArray == null)
			return false;
		return true;
	},
	getChildArray: function(){return this.childArray;},
	setChildArray: function(newArray){this.childArray = newArray;},
	getParentArray: function(){return this.parentArray;},
	setParentArray: function(newArray){this.parentArray = newArray;},
	editText: function(){
		this.done_edit = false;
		this.textField.remove();
		this.textField = null;
		this.resize(230, 85);
		var textArea = new Element('textarea',
		{
			rows: 2,
			cols: 20,
			name: 'text-box',
			class: this.myId
		});
		document.id('application').grab(textArea);
		document.getElement('.'+this.myId).setStyles({
			'border' : 'none',
			'outline' : 'none',
			'resize' : 'none',
			'text-align' : 'center',
			'overflow' : 'hidden',
			'font-family': '"Myriad Pro", sans-serif',
			'color' : '#FFFFFF',
			'font-size' : '20px',
			'position' : 'absolute',
			'left' : this.x+16,
			'top' : this.y+13,
			'background-color' : 'transparent',
			'width' : this.width-16,
			'height' : this.height-13,
		});
		if(this.myText == "Enter your text here.")
			this.myText = "";
		document.getElement('.'+this.myId).value = this.myText;
		document.getElement('.'+this.myId).focus();
		
	},
	doneEdit: function(){
		this.done_edit = true;
		if(this.textField == null){
			this.myText = document.getElement('.'+this.myId).value;
			if( this.myText === "")
			{
				this.myText = "Enter your text here.";
				this.textField = paper.text( this.x, this.y).attr({'text-anchor': 'start','font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 20});
				this.textField.attr({'text': this.myText});
			}
			else{
				var content = this.myText;
				var words = content.split(" ");
				var tempText = "";
				this.textField = paper.text( this.x, this.y).attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 20});
				for(var i=0; i<words.length; i++){
						this.textField.attr("text", tempText + " " + words[i]);
						if(this.textField.getBBox().width > this.width-10){
							tempText += "\n" + words[i];	
						} else {
							tempText += " " + words[i];	
						}
				}
				this.textField.attr("text", tempText.substring(1));	
			}
			document.getElement('.'+this.myId).destroy();
		}
		this.resize(this.textField.getBBox().width + 20, this.textField.getBBox().height + 20);
		this.position_text();
	},
	resize: function(w, h){
		this.height = h;
		this.width = w;
		this.resized = true;
		var wait_done = function(){
			creator.reposition_nodes();
			if(this.done_edit == true)
				navigate.editting = false;
			this.back_box.animate({width: this.width, height: this.height},200);
			this.shader_box.animate({width: this.width, height: this.height},200);
			this.top_box.animate({width: this.width, height: this.height},200);
			var temp = this.back_box.clone().attr({'fill-opacity': 0});
		};
		wait_done.delay(2, this);
		
		
		/*
		temp.animate({x: 0}, 1, function(){
			creator.reposition_nodes();
			if(kuppy.done_edit == true)
				navigate.editting = false;
		});
		*/
	},
	draw: function(){
		this.back_box = paper.rect(this.x, this.y+3, this.width, this.height, 6);
		this.back_box.attr({fill: this.myColor, stroke: 'none'});	
		this.shader_box = paper.rect(this.x, this.y+3, this.width, this.height, 6);
		this.shader_box.attr({
			fill: '#000000',
			opacity: .45,
			stroke: 'none'
		});
		this.top_box = paper.rect(this.x+3, this.y, this.width, this.height, 6);
		this.top_box.attr({fill: this.myColor, stroke: 'none'});
		this.textField = paper.text(this.x, this.y, this.myText).attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 20});

		this.position_text();
		this.onStage = true;
	},
	move_to: function(new_x, new_y, us){
		this.x = new_x;
		this.y = new_y;
	
		this.back_box.animate({x: new_x, y: new_y+3}, us);
		this.shader_box.animate({x: new_x, y: new_y+3}, us);
		this.top_box.animate({x: new_x+3, y: new_y}, us);
		this.position_text();
	},
	undraw: function(){
		this.back_box.remove();
		this.shader_box.remove();
		this.top_box.remove();
		if(this.textField != null)
			this.textField.remove();
		this.onStage = false;
	},
	determineOnStage: function(){
		if(this.x > stage.innerWidth || this.x+this.width<0)
			this.onStage = false;
		else if(this.y > stage.innerHeight || this.y+this.height<0)
			this.onStage = false;
		else
			this.onStage = true;
	},
	position_text: function(){ //Assumes this.textField != null
		if(this.textField != null){
			var txt_x = this.x + (this.width/2 - this.textField.getBBox().width/2);
			var txt_y = this.y + ((this.height - this.textField.getBBox().height + this.textField.getBBox().height)/2);
			/*
			if(this.resized == true){
				this.textField.animate({x: txt_x, y: txt_y},200);
				this.resized = false;
			}
			else
			*/
				this.textField.attr({x: txt_x, y: txt_y});
		}
		else{
			document.getElement('.'+this.myId).setStyles({'left' : this.x+16, 'top' : this.y+13,});	
		}
	},
	set_x: function(new_x){
		this.x = new_x;
		this.back_box.attr({x: this.x});
		this.shader_box.attr({x: this.x});
		this.top_box.attr({x: this.x+3});
		if(this.textField != null)
			this.position_text();
		else {
			document.getElement('.'+this.myId).setStyles({'left' : this.x+16, 'top' : this.y+13,});	
		}
	},
	set_y: function(new_y){
		this.y = new_y;
		this.back_box.attr({y: this.y+3});
		this.shader_box.attr({y: this.y+3});
		this.top_box.attr({y: this.y});
		if(this.textField != null)
			this.position_text();
		else {
			document.getElement('.'+this.myId).setStyles({'left' : this.x+16, 'top' : this.y+13,});	
		}
	},
	setColor: function(newColor){
		this.myColor = newColor;
		this.back_box.attr({fill: this.myColor});
		this.top_box.attr({fill: this.myColor});
	},
	getColor: function(){return this.myColor;},
	getArrowPoint: function(arw, arw_theta){ // arw_theta in radians
		var offset = 10;
		var rad = Math.atan( (this.height/2)/(this.width/2) ); //Get angle of corner
		var x_and_y = new Array(); //This is what is returned, and it contains the point
		if(arw_theta < 0) //Convert arw_theta to positive values only
			arw_theta += 2*Math.PI;
		
		if(arw_theta <= (2*Math.PI - rad) && arw_theta > (Math.PI + rad)){ //Bottom
			x_and_y[1] = this.y + this.height + offset;
			x_and_y[0] = this.x + this.width/2 - (this.height/2)/Math.tan(arw_theta);
		}
		else if(arw_theta <= (Math.PI - rad) && arw_theta > rad){ //Top
			x_and_y[1] = this.y - offset;	
			x_and_y[0] = this.x + this.width/2 + (this.height/2)/Math.tan(arw_theta);
		}
		else if(arw_theta <= (Math.PI + rad) && arw_theta > (Math.PI -rad) ){ //Left
			x_and_y[0] = this.x - offset;
			x_and_y[1] = this.y + this.height/2 + (this.width/2 + offset)*Math.tan(arw_theta);	
		}
		else //Right
		{
			x_and_y[0] = this.x + this.width + offset;
			x_and_y[1] = this.y + this.height/2 - (this.width/2+ offset)*Math.tan(arw_theta) - arw.perm_height/2;
		}
		return x_and_y;
			
	},
	//Getter and Setter Functions for Buttons and Arrows
	setArrow: function(new_arrow){this.myArrow = new_arrow;},
	getArrow: function(){return this.myArrow;},	
	setLinkedNode: function(node){this.myLinkedNode = node;},
	getLinkedNode: function(){return this.myLinkedNode;},
	setOutLinkArrow: function(new_arrow){this.outLinkArrow = new_arrow;},
	getOutLinkArrow: function(){return this.outLinkArrow;},
	addInLinkArrow: function(new_arrow){this.inLinkArrow.push(new_arrow);},
	removeInLinkArrow: function(arw){this.inLinkArrow.splice(inLinkArrowArray.indexOf(arw), 1);},
	getInLinkArrow: function(){return this.inLinkArrow;},
	//End of Getter and Setter Functions for Buttons and Arrows
	getText: function(){
		return this.myText;
	},
	setText: function(new_text){
		this.myText = new_text;
		this.undraw();
		this.draw();	
	}
});

Node.extend(
{
	uniqueId: 0,
	getUniqueId: function()
	{
		return this.uniqueId++;
	}
});