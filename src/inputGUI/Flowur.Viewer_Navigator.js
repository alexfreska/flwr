// JavaScript Document
// Written by: Patrick Teague
// Last update: 8/13/12

var Viewer_Navigator = new Class({
	initialize: function(){
		this.drag_space = paper.rect(0,0,stage.innerWidth, stage.innerHeight).attr({'fill': '#000000', 'fill-opacity': 0, 'stroke': 'none'});
		this.h_slider = new Horizontal_Slider(); //Horizontal Slider
		this.v_slider = new Vertical_Slider(); //Vertical Slider
		this.addListeners();
	},
	addListeners: function(){
		var t = this;
		var start_x;
		var start_y;
		paper.setViewBox(0,0,stage.innerWidth, stage.innerHeight);
		var onMove = function(dx, dy){
			dx = -dx;
			dy = -dy;
			//dx, dy the amount to shift everything.
			//test_box.animate({'x': start_x+dx, 'y': start_y+dy});
			//paper.setViewBox(x, y, w, h, fit);
			//console.log(paper._viewBox);
			var x_loc = start_x + dx;
			var y_loc = start_y + dy;
			if(x_loc < viewer.current_bounds.x)
				x_loc = viewer.current_bounds.x;
			else if(x_loc+stage.innerWidth > viewer.current_bounds.x+viewer.current_bounds.width)
				x_loc = (viewer.current_bounds.width+viewer.current_bounds.x) - stage.innerWidth;
			if(y_loc < viewer.current_bounds.y)
				y_loc = viewer.current_bounds.y;
			else if(y_loc+stage.innerHeight > viewer.current_bounds.y+viewer.current_bounds.height)
				y_loc = (viewer.current_bounds.height+viewer.current_bounds.y) - stage.innerHeight;
			paper.setViewBox(x_loc, y_loc, stage.innerWidth, stage.innerHeight);
			background.attr({'x': x_loc, 'y': y_loc});
			t.h_slider.set_y( y_loc+5);
			t.v_slider.set_x( x_loc + stage.innerWidth - 5 - t.v_slider.width);
			t.drag_space.attr({'x': x_loc, 'y': y_loc});
		};
		var onStart = function(){
			if(viewer.current_bounds.width > stage.innerWidth){
				var slider_x = viewer.current_bounds.x + (viewer.current_bounds.width/2);
				var slider_width = stage.innerWidth - (viewer.current_bounds.width - stage.innerWidth);
				if(slider_width < 50){
					//Then set slider_width = 50 and just move proportionally to difference in width
					//console.log("Proportional width");
				}
				else{
					t.h_slider.width = slider_width;
					t.h_slider.set_x(slider_x-(slider_width/2));
				}
			}
			if(viewer.current_bounds.height > stage.innerHeight){
				var slider_y = viewer.current_bounds.y + (viewer.current_bounds.height/2);
				var slider_height = stage.innerHeight - (viewer.current_bounds.height - stage.innerHeight);
				if(slider_height < 50){
					//Then set slider_height = 50 and just move proportionally to difference in height
					//console.log("Proportional Height");
				}
				else{
					t.v_slider.height = slider_height;
					t.v_slider.set_y(slider_y-(slider_height/2));
				}
			}
			start_x = paper._viewBox[0];
			start_y = paper._viewBox[1];
			
		};
		var onEnd = function(){
			if(t.h_slider.onStage)
				t.h_slider.undraw();
			if(t.v_slider.onStage)
				t.v_slider.undraw();
		};
		
		
		this.drag_space.drag(onMove, onStart, onEnd);
	},
	removeListeners: function(){
		
	},
});