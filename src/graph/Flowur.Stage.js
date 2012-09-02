// @todo
// stage.visual
// separate logic from visuals

// inject within parent tags
// otherwise, inject within specified parameter

// add single event listener (for each event) to stage

// smoother scrolling
// limit zoom
// reset zoom
// ease zoom?
// touch capabilities

// flowchart algorithm


// pseudo-constants for development
var	FILL = '#a5c54b',
	STROKE = '#fafafa',
	STROKE_WIDTH = '5';

Flowur.Stage = new Class(
{
	Implements: [Options, Events],

	id: '',
	window: {},
	background: '',
	// rename context
	stage: '',
	canvas: '',
	container: '',
	box: '',
	
	// ids for all 

	width: 1024,
	height: 576,

	translateOffsetX: 0,
	translateOffsetY: 0,
	scaleOffsetX: 0,
	scaleOffsetY: 0,
	
	//does the stage have to redraw everything?
	isValid: 0,
	buffer: '',
	
	//graphics
	nodes: [],
	arrows: [],
	tooltips: [],
	
	initialize: function(options)
	{	
		this.container = document.id(options.id);
		this.stage = new Raphael(this.container, this.width, this.height);
		
		// prepare pan/zoom functionality
		this.stage.setViewBox(0, 0, this.width, this.height);
		
		// set viewport/window
		this.window.width = this.width;
		this.window.height = this.height;
		this.window.x = 0;
		this.window.y = 0;
		
		var CONSTANT = 1.5;
		
		this.window.maxWidth = this.width * CONSTANT;
		this.window.maxHeight = this.width * CONSTANT;
		this.window.minWidth = this.width / CONSTANT;
		this.window.minHeight = this.width / CONSTANT;
		
		// @todo implement minimal scroll
		var isMouseDown = false;
		
		// store mouse position on the start of 'mousedown' events
		var xLocal = 0;
		var yLocal = 0;
		
		// hold change in mouse position during 'mousedown' events
		var deltaX = 0;
		var deltaY = 0;
		
		// physics
		var momentum;
		var bounce;
		
		// viewport for the application
		var window = 
		{
			x: 0,
			y: 0,
			width: this.width,
			height: this.height,
			maxWidth: this.width * 1.5,
			maxHeight: this.width * 0.5,
			minWidth: this.width / 2,
			minHeight: this.width / 2,
		};
		
		// release mouse drag (on 'mousedown' and 'mouseout' events)
		var release = function()
		{
			window.x += deltaX;
			window.y += deltaY
			isMouseDown = false;
		};
		
		var isOverStage = function(event)
		{
			if(this.stage.getElementByPoint(event.page.x, event.page.y) == null)
			{
				return true;
			}	
			
			return false;
		}.bind(this);
		
		
		// event listeners
		this.container.addEvent('mouseover', function(event)
		{
			if(isOverStage(event))
			{
				this.container.setStyle('cursor', 'move');
			}
			else
			{
				this.container.setStyle('cursor', 'default');
			}
		}.bind(this));
		
		this.container.addEvent('mousedown', function(event)
		{
			// prevent text highlight
			event.preventDefault();
			
			//console.log(this.stage.getElementByPoint(event.page.x, event.page.y).id);
			
			if(isOverStage(event))
			{
				isMouseDown = true;
				xLocal = event.page.x;
				yLocal = event.page.y;
			}
		}.bind(this));
		
		this.container.addEvent('mousemove', function(event)
		{
			if(isMouseDown == true)
			{
				// scale paper to window with multiplier operands
				deltaX = (xLocal - event.page.x) * (window.width / this.stage.width);
				deltaY = (yLocal - event.page.y) * (window.height / this.stage.height);
				this.stage.setViewBox(window.x + deltaX, window.y + deltaY, window.width, window.height);
			}	
		}.bind(this));
		
		this.container.addEvent('mouseup', function(event)
		{
			if(isMouseDown == true)
			{ 
				release(event);
			}
		}.bind(this));
		
		this.container.addEvent('mouseleave', function(event)
		{
			if(isMouseDown == true)
			{ 
				release(event);
			}
		}.bind(this));
		
		this.container.addEvent('mousewheel', function(event)
		{
			event.stop();
		
			initialWidth = window.width;
			initialHeight = window.height;
		
			// fix max
			if(event.wheel < 0)
			{
				window.width *= 1.05;
				window.height *= 1.05;
				
			}
			// fix max
			else if(event.wheel > 0)
			{
				window.width *= 0.95;
				window.height *= 0.95;
				
			}
		
			// reposition (center) window by subtracting changes in dimensions
			deltaWidth = window.width - initialWidth;
			deltaHeight = window.height - initialHeight;
		
			// ?
			window.width -= deltaWidth / 2;
			window.height -= deltaHeight / 2;
		
			this.stage.setViewBox(window.x, window.y, window.width, window.height);

		}.bind(this));
		
		this.setOptions(options);
	},
	
		/*
		this.heart = this.stage.path('M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z');
		this.heart.attr(
		{
			'stroke': '#eeeeee',
			'stroke-width': 10,
			'fill': '#0099ff'
		});
		
		this.heart.transform('t800, 300s8');
		*/
	
	Mutators: ['id', 'data', 'stage']
});

Flowur.Visual = new Class(
{
	stage: {},	// Raphael paper
	flowchart: {},
	initialize: function(stage, flowchart)
	{
		//rename get stage
		this.stage = stage.getStage();
		this.flowchart = flowchart;
	},
	
	plot: function()
	{
		var	x = -100,
			y = 230;
			
		nodes = this.flowchart.getNodes();
		nodes.each(function(node)
		{
			x+= 500;
			node.x = x;
			node.y = y;

			node.visual = this.stage.circle(node.x, node.y, 100);
			node.visual.attr({'fill': FILL, 'stroke' : STROKE, 'stroke-width': STROKE_WIDTH});
			node.visual.text = this.stage.text(node.x, node.y, node.getData());
			node.visual.text.attr({'font-family': 'Georgia', 'font-size': 12, 'fill': '#ffffff'});
		}.bind(this));
		
		
		// CONSTANTS
		var	STREAMS = 3;
		
		// other vars...
		var	xInit = 25,
			yInit = 25,
			
			yDistance = 100,
			
			stream =
			{
				x: xInit,
				y: yInit
			},
	
			streams = [];
		
		for(i = 0; i < STREAMS; i++)
		{
			streams.push(new stream());
			stream.y += yDistance;
		}
		
		console.log(streams);

		
		/*
		 * theory time
		 *
		 * the goal is to have the nodes going in the first stream
		 */
	},
	
	plotNode: function()
	{
	
	}
});

window.addEvent('load', function()
{
	var stage = new Flowur.Stage({id: 'flowur'});
	
	var flow = new Flowur.Flowchart({title: 'Should I delete my tweet?'});

	var a = flow.addNode('Is it cringe-worthy about your boss?');
	var b = flow.addNode('Is there a twitpic of a private part?');
	var c = flow.addNode("Is it your boss's private part?");
	var d = flow.addNode('Ask for a raise.');
	var e = flow.addNode('Is it your private part?');
	var f = flow.addNode('Delete that tweet!');
	var g = flow.addNode('Do you want more followers?');
	var h = flow.addNode("You're sitting pretty. Leave it up.");
	var i = flow.addNode('Come on, what are you doing on Twitter?');
	var j = flow.addNode('Is it about an ex, your ATM pin, or that Twilight hunk?');
	var k = flow.addNode('Were you drunk-twittering at 3am?');
	var l = flow.addNode('Yes, you were. Try again.');
	var m = flow.addNode('The coordinates of a "package" from Columbia?');
	var n = flow.addNode("Are you using someone else's Twitter account?");

	flow.addArrow(a, b, 'Yes');
	flow.addArrow(b, c, 'Yes');
	flow.addArrow(c, d, 'Yes');
	flow.addArrow(c, e, 'No');
	flow.addArrow(e, f, 'Yes');
	flow.addArrow(e, g, 'No');
	flow.addArrow(g, h, 'Yes');
	flow.addArrow(g, i, 'No');
	flow.addArrow(b, f, 'No');
	flow.addArrow(a, j, 'No');
	flow.addArrow(j, k, 'Yes');
	flow.addArrow(k, f, 'Yes');
	flow.addArrow(k, l, 'No');
	flow.addArrow(j, m, 'No');
	flow.addArrow(m, n, 'Yes');
	flow.addArrow(n, h, 'Yes');
	flow.addArrow(n, f, 'No');
	flow.addArrow(m, h, 'No');
	
	var visual = new Flowur.Visual(stage, flow);
	visual.plot();
	
	/*	
	var canvas = new Flowur.Stage({id: 'canvas'});	
	var lausiv = new Flowur.Visual(canvas, flow);
	lausiv.plot();
	*/
});



