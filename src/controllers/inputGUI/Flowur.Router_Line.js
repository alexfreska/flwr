// JavaScript Document
// Written by Patrick Teague 9/24/12
var Router_Line = new Class({
	initialize: function(fx, fy, tx, ty, col){
		this.myColor = col;
		this.thickness = 2;
		if(fx <= tx)
			this.x = fx;
		else
			this.x = tx;
		if(fy <= ty)
			this.y = fy;
		else
			this.y = ty;
			
		if(fx == tx){//then vertical line
			this.length = Math.abs(fy-ty);
			this.horOrVert = 'v';
		}
		else{ //then horizontal line
			this.length = Math.abs(fx-tx);
			this.horOrVert = 'h';
		}
		
		this.draw();
	},
	draw: function(){
		var line;
		if(this.horOrVert === 'h'){ //Draw a horizontal line
			line = viewPaper.rect(this.x,this.y,this.length,this.thickness);
		}
		else{ //Draw a vertical line
			line = viewPaper.rect(this.x,this.y,this.thickness,this.length);
		}
		line.attr({'fill': this.myColor, 'stroke': 'none'});
	},
});