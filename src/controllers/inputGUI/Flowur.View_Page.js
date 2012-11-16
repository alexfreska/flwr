// JavaScript Document
var View_Page = new Class({
	initialize: function(){
		this.fontName = "Myriad Pro";
		this.drawer = this.draw(this.fontName);
		this.selector_up = true;
	},
	draw: function(font){
		this.graphic = viewPaper.set();
		var selectInfo = viewPaper.print(-2, 4, "Select a template to view:", viewPaper.getFont(font), 30).attr({'fill': '#888'});
		selectInfo.translate((stage.innerWidth-selectInfo.getBBox().width)/2, selectInfo.getBBox().height*3/2);
		this.graphic.push(selectInfo);
		if(current_chart == null){
			var warning = viewPaper.print(-2, 4, "Looks like you haven't made a chart yet.\nClick CREATE above to make one.", viewPaper.getFont(font), 20).attr({'fill': '#666'});
			warning.translate((stage.innerWidth-warning.getBBox().width)/2, (stage.innerHeight-warning.getBBox().height)/2 - 40);
			this.graphic.push(warning);	
		}
		else{
			this.removeSelf = function(){
				this.selector_up = false;
				this.graphic.remove();
				standard.remove();
				tree.remove();
				diagnostic.remove();
			};
			var standard = new Button((stage.innerWidth-150)/2, 200, '#FF0034', "STANDARD");
			standard.addClick(function(e){
				this.removeSelf();
				viewer = new Viewing_Mode();
			},this);
			var tree = new Button((stage.innerWidth-150)/2, 300, '#FF0034', "TREE");
			tree.addClick(function(e){
				this.removeSelf();
				//viewer = new Tree_Mode();
			},this);
			var diagnostic = new Button((stage.innerWidth-150)/2, 250, '#FF0034', "DIAGNOSTIC");
			diagnostic.addClick(function(e){
				this.removeSelf();
				//viewer = new Diagnostic_Mode();
			},this);
		}
		function Button(x, y, backColor, myText){
			this.x = x;
			this.y = y;
			this.width = 150;
			this.height = 30;
			var radius = 0;
			this.myColor = backColor;
			this.graphic = viewPaper.set();
			
			this.draw = function(){
				this.graphic.push( viewPaper.rect(this.x, this.y, this.width, this.height, radius).attr({'fill': this.myColor, 'stroke': 'none'}) );
				this.graphic.push( viewPaper.rect(this.x, this.y, this.width, this.height, radius).attr({'fill': '#FFF', 'stroke': 'none', 'fill-opacity': 0}) );
				var text = viewPaper.print(this.x-4, this.y+2, myText, paper.getFont(font), 18, "baseline").attr({'fill': '#FFFFFF', 'text-anchor': 'start'});
				text.translate(this.width/2-text.getBBox().width/2, text.getBBox().height*3/2);
				this.graphic.push( text );
				this.graphic.push( paper.rect(this.x, this.y, this.width, this.height, radius).attr({'fill': '#000', 'stroke': 'none', 'fill-opacity': 0}) );
				
				this.graphic.mouseover(mouseOverFun, this);
				this.graphic.mouseout(mouseOutFun, this);
			};
			var mouseOverFun = function(e){
				this.graphic[1].attr({'fill-opacity': .1});
			};
			var mouseOutFun = function(e){
				this.graphic[1].attr({'fill-opacity': 0});
			};
			this.move = function(newX, newY){
				this.graphic.translate(newX - this.x, newY - this.y);
			};
			
			this.addClick = function(actionFun, that){
				this.graphic.click(actionFun, that);	
			};
			
			this.reposition = function(){
				//graphic.translate(
			};
			this.remove = function(){
				this.graphic.remove();
			};
			this.draw();
		};
	},
	close_all: function(){
		this.graphic.remove();
		if(current_chart != null)
			this.removeSelf();
	},
	
});