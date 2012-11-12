// JavaScript Document
// Written by Patrick Teague
// Last update: 9/4/12
//Title box
//Text can be entered into this box, and will create a title for the chart.
var Title = new Class({
	initialize: function(){
		this.id = 'title';
		this.myId = 'unique';
		this.myColor = '#333333';
		this.fontFill = '#999999';
		this.fontName = 'Myriad Pro';
		this.repo = true;
		this.backOffset = 1.2;
		this.x = demoPage.topHeader.getGraphic(2).getBBox().x2+20;
		this.startX = this.x;
		this.beforeX = this.x;
		this.y = 10;
		this.width = demoPage.topHeader.getBtn("create").graphic[2].getBBox().x - this.x-20;
		this.height = 40;
		this.done_edit = true;
		this.myText = "Enter your title here.";
		this.draw();
		this.setText("Enter your title here.");
	},
	draw: function(){
		this.textField = paper.print(stage.innerWidth/2, this.y+this.height/2, this.myText, paper.getFont(this.fontName), 30);
		this.startX = (stage.innerWidth - this.textField.getBBox().width)/2 -10; 
		this.beforeX = this.startX;
		this.textField.translate(-this.textField.getBBox().width/2-5, -this.textField.getBBox().height/2+this.y);
		this.textField.attr({fill: this.fontFill});
		this.textField.toFront();
		
	},
	toFront: function(){
		this.textField.toFront();
	},
	undraw: function(){
		this.textField.remove();
		this.textField = null;
	},
	editText: function(){
		this.done_edit = false;
		var textArea = new Element('textarea',
		{
			rows: 1,
			cols: 40,
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
			'font-family': this.fontName,
			'color' : this.fontFill,
			'font-size' : '30px',
			'position' : 'absolute',
			'left' : this.x,
			'top' : this.y+3.4,
			'background-color' : 'transparent',
			'width' : this.width,
			'height' : this.height,
		});
		this.textField.remove();
		if(this.myText == "Enter your title here.")
			this.myText = "";
		document.getElement('.'+this.myId).value = this.myText;
		document.getElement('.'+this.myId).focus();
	},
	doneEdit: function(){
		this.done_edit = true;
		this.myText = document.getElement('.'+this.myId).value;
		if( this.myText === "" || this.myText === "\n")
		{
			this.myText = "Enter your text here.";
			this.textField = paper.print(this.x, this.y+this.height/2, this.myText, paper.getFont(this.fontName), 30).attr({'text-anchor': 'start','fill': this.fontFill});
		}
		else{
			var content = this.myText;
			var words = content.split(" ");
			var tempText = "";
			this.textField = paper.text( this.x, this.y+this.height/2).attr({'text-anchor': 'start', 'font-family': this.fontName, 'fill': '#FFFFFF', 'font-size': 30});
			for(var i=0; i<words.length; i++){
					this.textField.attr("text", tempText + " " + words[i]);
					if(this.textField.getBBox().width > this.width){
						tempText += "\n" + words[i];	
					} else {
						tempText += " " + words[i];	
					}
			}
			this.textField.remove();
			this.textField = paper.print(-5,2, tempText.substring(1), paper.getFont(this.fontName), 30).attr({'fill': this.fontFill});	
		}
		this.textField.translate((stage.innerWidth/2 -this.textField.getBBox().width/2), this.y + this.height/2);
		this.textField.toFront();
		document.getElement('.'+this.myId).destroy();
	},
	setText: function(new_text){
		this.myText = new_text;
		this.textField.remove();
		var content = this.myText;
		var words = content.split(" ");
		var tempText = "";
		this.textField = paper.text( this.x, this.y).attr({'text-anchor': 'start', 'font-family': this.fontName, 'fill': '#FFFFFF', 'font-size': 30});
		for(var i=0; i<words.length; i++){
				this.textField.attr("text", tempText + " " + words[i]);
				if(this.textField.getBBox().width > stage.innerWidth-100){
					tempText += "\n" + words[i];	
				} else {
					tempText += " " + words[i];	
				}
		}
		this.textField.remove();
		this.textField = paper.print(-5, 2, tempText.substring(1), paper.getFont(this.fontName), 30).attr({'fill': this.fontFill});
		this.textField.translate(stage.innerWidth/2 - this.textField.getBBox().width/2, this.y+this.height/2);
		this.textField.toFront();
	},
	getText: function(){
		return this.myText;
	},
	reposition: function(){	
		this.width = demoPage.topHeader.getBtn("create").graphic[2].getBBox().x - this.x-20;
		this.setText(this.myText);
		this.startX = (stage.innerWidth - this.textField.getBBox().width)/2 -10;
		this.textField.translate(this.startX-this.beforeX,0);
		this.beforeX = (stage.innerWidth - this.textField.getBBox().width)/2 -10;	
	}
});

/*

//Here is the old Title Class with the black background.
var Title = new Class({
	initialize: function(){
		this.id = 'title';
		this.myId = 'unique';
		this.myColor = '#333333';
		this.fontName = 'Myriad Pro';
		this.repo = true;
		this.backOffset = 1.2;
		this.x = 0;
		this.startX = 0;
		this.beforeX = 0;
		this.y = 0;
		this.width = stage.innerWidth;
		this.height = 40;
		this.done_edit = true;
		this.myText = "Enter your title here.";
		this.draw();
		this.setText("Enter your title here.");
	},
	draw: function(){
		this.textField = paper.print(stage.innerWidth/2, this.y+this.height/2, this.myText, paper.getFont(this.fontName), 30);
		this.startX = (stage.innerWidth - this.textField.getBBox().width)/2 -10; 
		this.beforeX = this.startX;
		this.textField.translate(-this.textField.getBBox().width/2-5, -this.textField.getBBox().height/2+this.y);
		this.textField.attr({fill: '#FFFFFF'});
		this.back_box = paper.rect(this.x,this.y,this.width,this.height).attr({fill: this.myColor, stroke: 'none', 'fill-opacity': 1});
		this.shadow_box = this.back_box.clone().attr({'fill': '#555555', translation: "-2,-2"});
		this.shadow_box.blur(2);
		this.back_box.toFront();
		this.textField.toFront();
		
	},
	toFront: function(){
		this.shadow_box.toFront();
		this.back_box.toFront();
		this.textField.toFront();
		//c.saveDisplay.saveText.toFront();
		//c.v_button.toFront();
	},
	undraw: function(){
		this.textField.remove();
		this.textField = null;
		this.back_box.remove();
		this.back_box = null;
		this.shadow_box.remove();
		this.shadow_box = null;
	},
	editText: function(){
		this.done_edit = false;
		//this.back_box.animate({width: stage.innerWidth-100, x:50}, 300);
		var textArea = new Element('textarea',
		{
			rows: 1,
			cols: 80,
			name: 'text-box',
			class: this.myId
		});
		document.id('application').grab(textArea);
		document.getElement('.'+this.myId).setStyles({
			'border' : 'none',
			'outline' : 'none',
			'resize' : 'none',
			'text-align' : 'start',
			'overflow' : 'hidden',
			'font-family': this.fontName,
			'color' : '#FFFFFF',
			'font-size' : '30px',
			'position' : 'absolute',
			'left' : 150,
			'top' : this.y+3.4,
			'background-color' : 'transparent',
			'width' : stage.innerWidth-300,
			'height' : this.height,
		});
		this.textField.remove();
		if(this.myText == "Enter your title here.")
			this.myText = "";
		document.getElement('.'+this.myId).value = this.myText;
		document.getElement('.'+this.myId).focus();
	},
	doneEdit: function(){
		this.done_edit = true;
		this.myText = document.getElement('.'+this.myId).value;
		if( this.myText === "" || this.myText === "\n")
		{
			this.myText = "Enter your text here.";
			this.textField = paper.print(this.x, this.y+this.height/2, this.myText, paper.getFont(this.fontName), 30).attr({'text-anchor': 'start','fill': '#FFFFFF'});
		}
		else{
			var content = this.myText;
			var words = content.split(" ");
			var tempText = "";
			this.textField = paper.text( this.x, this.y+this.height/2).attr({'text-anchor': 'start', 'font-family': this.fontName, 'fill': '#FFFFFF', 'font-size': 30});
			for(var i=0; i<words.length; i++){
					this.textField.attr("text", tempText + " " + words[i]);
					if(this.textField.getBBox().width > stage.innerWidth-100){
						tempText += "\n" + words[i];	
					} else {
						tempText += " " + words[i];	
					}
			}
			this.textField.remove();
			this.textField = paper.print(-5,2, tempText.substring(1), paper.getFont(this.fontName), 30).attr({'fill': '#FFFFFF'});	
		}
		//this.resize(this.textField.getBBox().width + 20, this.textField.getBBox().height+5);
		this.textField.translate((stage.innerWidth/2 -this.textField.getBBox().width/2), this.y + this.height/2);
		this.textField.toFront();
		document.getElement('.'+this.myId).destroy();
	},
	setText: function(new_text){
		this.myText = new_text;
		this.textField.remove();
		var content = this.myText;
		var words = content.split(" ");
		var tempText = "";
		this.textField = paper.text( this.x, this.y).attr({'text-anchor': 'start', 'font-family': this.fontName, 'fill': '#FFFFFF', 'font-size': 30});
		for(var i=0; i<words.length; i++){
				this.textField.attr("text", tempText + " " + words[i]);
				if(this.textField.getBBox().width > stage.innerWidth-100){
					tempText += "\n" + words[i];	
				} else {
					tempText += " " + words[i];	
				}
		}
		this.textField.remove();
		this.textField = paper.print(-5, 2, tempText.substring(1), paper.getFont(this.fontName), 30).attr({'fill': '#FFFFFF'});
		//this.resize(this.textField.getBBox().width + 20, this.textField.getBBox().height+5);
		this.textField.translate(stage.innerWidth/2 - this.textField.getBBox().width/2, this.y+this.height/2);
		this.textField.toFront();
	},
	getText: function(){
		return this.myText;
	},
	reposition: function(){	
		this.width = stage.innerWidth;
		this.startX = (stage.innerWidth - this.textField.getBBox().width)/2 -10;
		this.back_box.attr({'width': this.width});
		this.textField.translate(this.startX-this.beforeX,0);
		this.beforeX = (stage.innerWidth - this.textField.getBBox().width)/2 -10;	
	}
	
});
*/