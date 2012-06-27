// JavaScript Document
var displayMessage = new Class({
	initialize: function(str){
		this.myText = str;
		this.myHeight = 40;
		this.draw();
	},
	
	draw: function(){
		
		this.bottom_box = paper.rect(0, stage.innerHeight-this.myHeight-20, stage.innerWidth, this.myHeight);
		this.bottom_box.attr({fill: '#000000', 'fill-opacity': .6, stroke: 'none'});
		this.message = paper.text(stage.innerWidth/2, stage.innerHeight - this.myHeight/2 - 20, this.myText);
		this.message.attr({'font': 'Myriad Pro', fill: '#FFFFFF', 'font-size': 20, 'text-anchor': "middle"});
		
		animate_out = function(){
			var klass = this;
			this.bottom_box.animate({'fill-opacity':0}, 500, 'easeIn', function(){
				klass.bottom_box.remove();
				klass.message.remove();	});
		};
		
		animate_out.delay(1500, this);	
	}
	
});