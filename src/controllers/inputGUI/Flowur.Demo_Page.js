// JavaScript Document
var Demo_Page = new Class({
	initialize: function(){
		this.fontName = "Myriad Pro";
		document.getElementById('application').style.backgroundColor = '#DAD7C8';
		this.introUp = true;
		this.intro(10, 70);
		this.draw(this.fontName);
		
	},
	intro: function(x, y){
		this.introGraphic = paper.set();
		
		this.introGraphic.push( paper.image("src/controllers/inputGUI/images/FlowurIntroBack.png", (stage.innerWidth-1856)/2, (stage.innerHeight-1044)/2, 1856, 1044));
		this.introGraphic.push( paper.image("src/controllers/inputGUI/images/FlowurIntroTop.png", (stage.innerWidth-372)/2, (stage.innerHeight-373)/2, 372, 373));
		//this.introGraphic.push( paper.image("src/controllers/inputGUI/images/FlowurIntro.png", (stage.innerWidth-372)/2, (stage.innerHeight-373)/2, 372, 373));
	},
	draw: function(font){
		this.topHeader = new TopHeader();
		
		function TopHeader(){
			var graphic = paper.set();
			var x = 0;
			var y = 0;
			var width = stage.innerWidth;
			var height = 60;
			var backColor = '#FFFFFF';
			
			graphic.push( paper.rect(x, y, width, height).attr({'fill': backColor, 'stroke': 'none'}) );
			//graphic.push( paper.image("src/controllers/inputGUI/images/FlowurLogoAlt.png", 15, 15, 33, 28));
			graphic.push( paper.image("src/controllers/inputGUI/images/FlowurLogoAlt2.png", 10, 10, 35, 40));
			var logoText = paper.print(x-4, y+2, "FLOWUR", paper.getFont(font), 30).attr({'fill': '#888'});
			logoText.translate(50, logoText.getBBox().height*3/2);
			graphic.push( logoText);
			var share = new CompletionBox(width-20, y+5, "SHARE");
			share.addClick(function(e){
				if(!share_up){
					share.graphic.attr({'fill': share.fillOn});
					share.fillOut = share.fillOn;
					view.turnOff();
					create.turnOff();
					go_to_share();
				}
			});
			var view = new CompletionBox(width - share.width-19.5, y+5.752, "VIEW");
			view.addClick(function(e){
				if(!viewer_up){
					view.graphic.attr({'fill': view.fillOn});
					view.fillOut = view.fillOn;
					share.turnOff();
					create.turnOff();
					go_to_view();
				}
			});
			var create = new CompletionBox(width - share.width - view.width-20, y+5, "CREATE");
			create.addClick(function(e){
				if(!creator_up){
					create.graphic.attr({'fill': create.fillOn});
					create.fillOut = create.fillOn;
					view.turnOff();
					share.turnOff();
					go_to_creator();
				}
			});
			
			this.reposition = function(){
				width = stage.innerWidth;
				graphic[0].attr({'width': stage.innerWidth});
				share.move(width-20, y+5);
				view.move(width-share.width-19.5, y+5.752);
				create.move(width-share.width-view.width-20, y+5);
			};
			
			this.hide = function(){
				graphic.hide();
				share.hide();
				view.hide();
				create.hide();
			};
			this.show = function(){
				graphic.show();
				share.show();
				view.show();
				create.show();
			};
			
			this.getGraphic = function(index){
				if(index && index < graphic.length){
					return graphic[index];	
				}
				else
					return graphic;
			};
			this.getBtn = function(btn){
				if(btn === "share")
					return share;
				else if(btn === "view")
					return view;
				else if(btn === "create")
					return create;
			};
			
			function CompletionBox(x, y, myText){
				this.x = x;
				this.y = y;
				var fillOff = '#CCCCCC';
				this.fillOver = '#999999';
				this.fillOut = '#CCCCCC';
				this.fillOn = '#FF2C18';
				this.graphic = paper.set();
				var text = paper.print(x-4, y+2, myText, paper.getFont(font), 16).attr({'fill': fillOff});
				text.translate(-(text.getBBox().width), text.getBBox().height*3/2);
				this.graphic.push(text);
				this.graphic.push( paper.rect(text.getBBox().x, text.getBBox().y2+10, text.getBBox().width+10, 2).attr({'fill': fillOff, 'stroke': 'none'}) );
				this.width = text.getBBox().width+10;
				this.height = text.getBBox().height+15;
				
				var mouseOverFun = function(e){
					this.graphic.attr({'fill': this.fillOver});
				};
				var mouseOutFun = function(e){
					this.graphic.attr({'fill': this.fillOut});
				};
				this.addClick = function(actionFun){
					this.graphic[2].click(actionFun);	
				};
				this.graphic.push( paper.rect(text.getBBox().x, text.getBBox().y-15, text.getBBox().width+10, text.getBBox().height+40).attr({'fill': '#000', 'fill-opacity': 0, 'stroke': 'none'}) );
				this.graphic[2].mouseover(mouseOverFun, this);
				this.graphic[2].mouseout(mouseOutFun, this);
				
				this.move = function(newX, newY){
					this.graphic.translate(newX - this.x, newY - this.y);
					this.x = newX;
					this.y = newY;
				};
				this.hide = function(){
					this.graphic.hide();
				};
				this.show = function(){
					this.graphic.show();
				};
				this.turnOff = function(){
					this.fillOut = fillOff;
					this.graphic.attr({'fill': this.fillOut});
				};
			};
			
		};
	},
	reposition: function(){
		this.topHeader.reposition();
		if(this.introUp){
			this.introGraphic[0].attr({'x': (stage.innerWidth-1856)/2, 'y': (stage.innerHeight-1044)/2 });
			this.introGraphic[1].attr({'x': (stage.innerWidth-372)/2, 'y': (stage.innerHeight-373)/2}); 
		}
	},
	close_all: function(){
		this.introUp = false;
		this.introGraphic.remove();
		document.getElementById('application').style.backgroundColor = '#EEEEEE';
	},
	show: function(){
		this.topHeader.show();
	},
});

/* Code for Brian

//this.treeLine = new MakeTrees();
function MakeTrees(){
			var treeColors = ['#4A9E3D', '#8BB831', '#30BA30'];
			var trees = [];
			var treeHeight = 135/2;
			var treeWidth = 75;
			var x = 0;
			var y = stage.innerHeight;
			var width = stage.innerWidth;
			var numTrees = Math.ceil(stage.innerWidth/(treeWidth-10));
			if(numTrees*(treeWidth-10) > stage.innerWidth)
				x = -(numTrees*(treeWidth-10) - stage.innerWidth)/2;
			sameColor = 0;
			prevColor = 0;
			thisColor = 0;
			for(var i=0; i<numTrees; i++){
				//Code makes it so you will never see more than 2 trees in a row of the same color
				thisColor = Math.floor(Math.random()*treeColors.length);
				if(thisColor === prevColor)
					sameColor++;
				if(sameColor === 2){
					sameColor = 0;
					thisColor += 1;
					if(thisColor > treeColors.length-1)
						thisColor = 0;	
				}
				prevColor = thisColor;
				
				trees.push(new Tree(x, y, treeColors[thisColor]));
				x += treeWidth-10;
			}
			
			function Tree(treeX, treeY, treeColor){
				this.graphic = paper.path('M'+treeX+','+treeY+'l'+(treeWidth/2)+','+(-treeHeight)+'l'+(treeWidth/2)+','+(treeHeight)+'z').attr({'fill': treeColor, 'stroke': 'none'});
				this.setY = function(newY){
					this.graphic.translate(0, newY - y);
				};
			};
			
			this.reposition = function(){
				width = stage.innerWidth;
				numTrees = Math.ceil(stage.innerWidth/(treeWidth-10));
				while(numTrees < trees.length){
					trees[trees.length-1].graphic.remove();
					x -= treeWidth-10;
					trees.pop();	
				}
				while(numTrees > trees.length){
					trees.push(new Tree(x, y, treeColors[Math.floor(Math.random()*treeColors.length)]));
					x += treeWidth-10;
				}
				for(var i=0; i<trees.length; i++){
					trees[i].setY(stage.innerHeight);	
				}
				y = stage.innerHeight;
			};
			
			this.remove = function(){
				while(0 < trees.length){
					trees[trees.length-1].graphic.remove();
					trees.pop();	
				}
			};
		};
//Generic Button class
function Button(x, y, backColor){
			this.x = x;
			this.y = y;
			this.width = 70;
			this.height = 30;
			var radius = 2;
			this.myColor = backColor;
			var graphic = paper.set();
			
			this.draw = function(myText){
				graphic.push( paper.rect(this.x, this.y, this.width, this.height, radius).attr({'fill': this.myColor, 'stroke': 'none'}) );
				graphic.push( paper.rect(this.x, this.y, this.width, this.height, radius).attr({'fill': '#FFF', 'stroke': 'none', 'fill-opacity': 0}) );
				var text = paper.print(this.x-4, this.y+2, myText, paper.getFont('Myriad Pro'), 18, "baseline").attr({'fill': '#FFFFFF', 'text-anchor': 'start'});
				text.translate(this.width/2-text.getBBox().width/2, text.getBBox().height*3/2);
				graphic.push( text );
				graphic.push( paper.rect(this.x, this.y, this.width, this.height, radius).attr({'fill': '#000', 'stroke': 'none', 'fill-opacity': 0}) );
				graphic[3].mouseover(mouseOverFun);
				graphic[3].mouseout(mouseOutFun);
			};
			
			this.move = function(newX, newY){
				graphic.translate(newX - this.x, newY - this.y);
			};
			var mouseOverFun = function(e){
				graphic[1].attr({'fill-opacity': .1});
			};
			var mouseOutFun = function(e){
				graphic[1].attr({'fill-opacity': 0});
			};
			this.addClick = function(actionFun){
				graphic[3].click(actionFun);	
			};
			
			this.reposition = function(){
				//graphic.translate(
			};
			
			this.remove = function(){
				graphic.remove();
			};
		};
		
		function NewButton(x, y, backColor){
			Button.call(this, x, y, backColor);
			this.draw('New');
			this.addClick( function(e){ 
				current_chart = null;
				go_to_creator();
			});
		};
		
		NewButton.prototype = new Button();
		
		function EditButton(x, y, backColor){
			Button.call(this, x, y, backColor);
			this.draw('Edit');
			this.addClick( function(e){ 
				go_to_creator();
			});
		};
		
		EditButton.prototype = new Button();
		
		function ViewButton(x, y, backColor){
			Button.call(this, x, y, backColor);
			this.draw('View');
			this.addClick( function(e){
				go_to_view();
			});
		};
		
		ViewButton.prototype = new Button();


*/