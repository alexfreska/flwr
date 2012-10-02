// JavaScript Document
// Written by Patrick Teague
// Last update: 9/4/12
//Title box
//Text can be entered into this box, and will create a title for the chart.
var Title = new Class({
	initialize: function(){
		this.id = 'title';
		this.myId = 'unique';
		this.repo = true;
		this.backOffset = 1.2;
		this.x = 0;
		this.y = 10;
		this.width = stage.innerWidth;
		this.height = 40;
		this.radius = 2;
		this.done_edit = true;
		this.myText = "Enter your title here.";
		this.draw();
		this.setText("Enter your title here.");
	},
	draw: function(){
		this.textField = paper.text(stage.innerWidth/2, this.y + this.height/2, this.myText);
		//this.textField.attr({'x': (stage.innerWidth - this.textField.getBBox().width)/2});
		this.textField.attr({'font': 'Myriad Pro', fill: '#FFFFFF', 'font-size': 30, 'text-anchor': "middle"});
		this.width = this.textField.getBBox().width + 20;
		this.height = this.textField.getBBox().height+5;
		this.x = (stage.innerWidth - this.width)/2;
		this.back_box = paper.rect(this.x,this.y,this.width,this.height,this.radius);
		this.back_box.attr({fill: '#3AA6D0', stroke: 'none'});
		this.bottom_box = this.back_box.clone().attr({x: this.x-this.backOffset, y: this.y +this.backOffset});
		this.top_box = this.bottom_box.clone();
		this.top_box.attr({fill:'#000000', 'fill-opacity': .45, stroke: 'none'});
		this.back_box.toFront();
		this.textField.toFront();
		
	},
	undraw: function(){
		this.textField.remove();
		this.textField = null;
		this.back_box.remove();
		this.back_box = null;
		this.bottom_box.remove();
		this.bottom_box = null;
		this.top_box.remove();
		this.top_box = null;
	},
	editText: function(){
		this.textField.remove();
		this.done_edit = false;
		this.back_box.animate({width: stage.innerWidth-100, x:50}, 300);
		this.bottom_box.animate({width: stage.innerWidth-100, x:50-this.backOffset}, 300);
		this.top_box.animate({width: stage.innerWidth-100, x:50-this.backOffset}, 300);
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
			'text-align' : 'center',
			'overflow' : 'hidden',
			'font-family': '"Myriad Pro", sans-serif',
			'color' : '#FFFFFF',
			'font-size' : '30px',
			'position' : 'absolute',
			'left' : 58,
			'top' : this.y+2,
			'background-color' : 'transparent',
			'width' : stage.innerWidth-100,
			'height' : this.height,
		});
		if(this.myText == "Enter your title here.")
			this.myText = "";
		document.getElement('.'+this.myId).value = this.myText;
		document.getElement('.'+this.myId).focus();
	},
	doneEdit: function(){
		this.done_edit = true;
		this.myText = document.getElement('.'+this.myId).value;
		if( this.myText === "")
		{
			this.myText = "Enter your text here.";
			this.textField = paper.text( this.x, this.y+this.height/2).attr({'text-anchor': 'start','font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 30});
			this.textField.attr({'text': this.myText});
		}
		else{
			var content = this.myText;
			var words = content.split(" ");
			var tempText = "";
			this.textField = paper.text( this.x, this.y+this.height/2).attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 30});
			for(var i=0; i<words.length; i++){
					this.textField.attr("text", tempText + " " + words[i]);
					if(this.textField.getBBox().width > stage.innerWidth-100){
						tempText += "\n" + words[i];	
					} else {
						tempText += " " + words[i];	
					}
			}
			this.textField.attr("text", tempText.substring(1));	
		}
		this.resize(this.textField.getBBox().width + 20, this.textField.getBBox().height+5);
		this.textField.attr({x: stage.innerWidth/2 - this.textField.getBBox().width/2, y: this.y + this.height/2});
		this.textField.toFront();
		document.getElement('.'+this.myId).destroy();
	},
	setText: function(new_text){
		this.myText = new_text;
		//this.undraw();
		//this.draw();
		this.textField.remove();
		var content = this.myText;
		var words = content.split(" ");
		var tempText = "";
		this.textField = paper.text( this.x, this.y).attr({'text-anchor': 'start', 'font-family': "Myriad Pro", 'fill': '#FFFFFF', 'font-size': 30});
		for(var i=0; i<words.length; i++){
				this.textField.attr("text", tempText + " " + words[i]);
				if(this.textField.getBBox().width > stage.innerWidth-100){
					tempText += "\n" + words[i];	
				} else {
					tempText += " " + words[i];	
				}
		}
		this.textField.attr("text", tempText.substring(1));
		this.resize(this.textField.getBBox().width + 20, this.textField.getBBox().height+5);
		this.textField.attr({x: stage.innerWidth/2 - this.textField.getBBox().width/2, y: this.y+this.height/2});
		this.textField.toFront();
	},
	getText: function(){
		return this.myText;
	},
	resize: function(w, h){
		this.width = w;
		this.height = h;
		
		this.back_box.animate({width: w, x:stage.innerWidth/2 - (w/2)}, 300);
		this.bottom_box.animate({width: w, x:stage.innerWidth/2 - (w/2)-this.backOffset}, 300);
		this.top_box.animate({width: w, x:stage.innerWidth/2 - (w/2)-this.backOffset}, 300);
	},
	reposition: function(){	
		this.width = this.textField.getBBox().width + 20;
		this.height = this.textField.getBBox().height + 5;
		this.x = stage.innerWidth/2 - this.width/2;

		this.back_box.animate({x: (stage.innerWidth - this.width)/2, y: this.y},100);
		this.bottom_box.animate({x: (stage.innerWidth - this.width)/2 -this.backOffset, y: this.y+this.backOffset},100);
		this.top_box.animate({x: (stage.innerWidth - this.width)/2 -this.backOffset, y: this.y+this.backOffset},100);
		this.textField.animate({x: (stage.innerWidth - this.width)/2 +10, y: this.y+this.height/2}, 100);
		
		//this.textField.attr({'x': (stage.innerWidth - this.textField.getBBox().width)/2});
		//this.textField.animate({x: this.x + this.width/2, y: this.y + this.height/2},300);
	}
	
});