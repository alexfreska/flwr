<!DOCTYPE html>
<html lang = "en">
<head>
	<title>Application</title>
	<meta charset="UTF-8">
	<link rel = "stylesheet" href = "/css/reset.css" media = "screen, projection" type = "text/css" title = "flowur" />
	<style type = "text/css">
	body
	{
		background: #dddddd;
	}
	#paper
	{
		width: 100%;
	}
	</style>
	<script src = "/lib/mootools-core-1.4.5-full-compat.js"></script>
	<script src = "/lib/mootools-more-1.4.0.1_all.js"></script>
	<script src = "/lib/raphael.js"></script>
	<script>
	var Flowur = {};
	var snap = function(x)
	{
		return x * 10;
	}
	
	// need to define a good grid system
	// (rows, columns, space between dots)
	// define as optional parameter to abide to in templates?
	// -----
	// manage z-indexes
	// --- graphical notes
	// x to mark middle points
	// colored x to mark semi-middle points? or just x's?
	//		just x's
	// --
	// implement own drag later to integrate into iScroll
	// change everything so that is it is scroll based.
	/*

	*/
	Flowur.App = new Class(
	{
		paper: {},
		
		width: 0,
		height: 0,
		
		// grid
		grid:
		{
			'spacing': 10,
			'rows': undefined,
			'columns': undefined,
			'to': function(x)
			{
				return this.spacing * x;
			}
		},
		
		// center
		cx: 0,
		cy: 0,
		
		// start
		sx: 0,
		sy: 0,
		
		// end
		ex: 0,
		ey: 0,
		
		// grid
		gx: 0,
		gy: 0,
		dot: undefined,
		verticalLine: undefined,
		horizontalLine: undefined,
		
		//// should definitely group some of these variables into objects
		// default end node attributes
		radius: 80,
		fill: '#9999ff',
		strokeColor: '#ffffff',
		
		// temporary
		currentNode: undefined,
		
		// node properties
		// should node attributes be passed or Raphael element attributes?
		// for now do this
		node:
		{
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			// grid x/y
			gx: 0,
			gy: 0,
			gw: 0,
			gh: 0,
		},
		
		//default arrow nodes
		
		// node relationship
		minimumArrow: 100,
		
		// program flow (algorithmic flow)
		// in degrees (north is 0 degrees)
		// lock directions to angles possible only a grid
		// actually this must be in radians
		direction: 0,
		
		nodes: [],
		arrows: [],
		
		Implements: [Options, Events],

		options:
		{
			title: ''
		},

		initialize: function(elementId, options)
		{	
			this.width = document.getSize().x;
			this.height = document.getSize().y;
			
			this.cx = this.width / 2;
			this.cy = this.height / 2;
			
			this.paper = Raphael(elementId, this.width, this.height);
			
			// draw grid
			/*
				definitely need to optimize
				also, react to change window event (keep rows and columns so class
				will need to add dots to existing grid from rows and columns as starting points
				actually, grid might have to be an image
			*/
			
			/*
			this.grid.spacing = 25;
			this.grid.rows = this.width / this.grid.spacing;
			this.grid.columns = this.height / this.grid.spacing;
			
			for(r = 0; r <= this.width; r+=this.grid.spacing)
			{
				for(c = 0; c <= this.height; c+=this.grid.spacing)
				{
					var dot = this.paper.circle(r, c, 1);
					dot.attr({'stroke-width': 0, 'fill': '#cccccc'});
					
				}
			}
			*/
			
			
			// dot "cursor"
			
			this.dot = this.paper.circle(-9999, -9999, 3);
			this.dot.attr(
			{
				'fill': '#ffffff',
				'stroke-width': 0
			});
			
			// set first nodes
			this.drawCircularNode(200, 350, function()
			{
				this.drawCircularNode(400, 350);
			}.bind(this));
		
			// set 'x' guides for middle points of nodes
			var diam = this.paper.rect(snap(10), snap(15), snap(30), snap(15));
			diam.attr(
			{
				'fill': '#000000',
				//'fill-opacity': 0.1,
				'stroke-width': 0
			});
			diam.data(
			{
				'type': 'textNode'
			});
			
			this.horizontalLine = this.paper.path('M0,0,l' + this.width + ',0');
			this.horizontalLine.attr(
			{
				'y': -9999,
				'stroke': '#ffffff',
				'fill': '#000000',
				'stroke-width': 0.5
			});
			this.verticalLine = this.paper.path('M0,0,l0,' + this.height);
			this.verticalLine.attr(
			{
				'x': -9999,
				'stroke': '#ffffff',
				'fill': '#000000',
				'stroke-width': 0.5
			});
			// universal events
			
			// before start
			this.isMouseDown = false;
			this.isMouseOut = false;
			this.lastGrid = {};
			this.currentGrid = {};
			this.anchorGrid = {};
			this.isAnchored = false;
			this.guide;
			//var line = this.paper.path(-9999, -9999, 5);
			
			window.addEvent('dblclick', function(event)
			{
				console.log('dbl');
				gridX = this.grid.spacing * Math.round(event.client.x/this.grid.spacing);
				gridY = this.grid.spacing * Math.round(event.client.y/this.grid.spacing);
				
				var node = this.paper.circle(gridX, gridY, snap(1));
				node.attr(
				{
					'fill': this.fill,
					'stroke-width': 0,
					'stroke': this.strokeColor,
					//'fill-opacity': 0.1,
					//'stroke-opacity': 0.25,
					'stroke-miterlimit': 10,
				});
			
				node.data(
				{
					'type': 'textNode'
				});
			
				// to make it less confusing...
				var element = node.node;
			
				/*
				element.addEvent('mouseover', function()
				{
					node.attr(
					{
						'r': this.radius * 1.5,
						'stroke-width': (this.radius * 1.5 * 2) / 10 
					});
				}.bind(this));
			
				element.addEvent('mouseout', function()
				{
					node.attr(
					{
						'r': this.radius,
						'stroke-width': this.radius * 2 / 10
					});
				}.bind(this));
				*/
			
				// ... integrate with Graph class
				this.nodes.push(node);
			
				
				node.animate(
				{
					'r': snap(8),
					//'stroke-width': 10,
				}, 400, 'bounce', function()
				{
				});
				
				
			}.bind(this));
			
			window.addEvent('mousedown', function(event)
			{

				this.isMouseDown = true;
				// on start
				event.preventDefault();
				var element = this.paper.getElementByPoint(event.client.x, event.client.y);

				this.snapToGrid;
				if(element !== null && element.data('type') === 'textNode')
				{	
					// before start
					this.currentNode = element;
					if(typeof this.lastGrid.x === undefined || typeof this.lastGrid.y === undefined)
					{
						this.lastNode = this.currentNode;
					}
					// on drag
					// need to take this event outside
					window.addEvent('mousemove', function(event)
					{
						// if mouse is down
						if(this.isMouseDown === true)
						{
							this.snapToGrid;
							this.currentGrid.x = this.gx;
							this.currentGrid.y = this.gy;
						
							// if grid position has changed
							if(this.lastGrid.x !== this.currentGrid.x || this.lastGrid.y !== this.currentGrid.y)
							{	
								// isPointInside is not working properly (diamond function is the issue)
								// if grid position is not inside current node
								if(!this.currentNode.isPointInside(this.currentGrid.x, this.currentGrid.y))
								{
									// start snap
									this.isMouseOut = true;
									
									// if the last grid point is inside the node
									if(this.currentNode.isPointInside(this.lastGrid.x, this.lastGrid.y))
									{
										// make line start point more accurate
										this.anchorGrid.x = this.lastGrid.x;
										this.anchorGrid.y = this.lastGrid.y;
										
										this.guide = this.paper.path('M' + this.anchorGrid.x + ',' + this.anchorGrid.y + 'L' + this.currentGrid.x + ',' + this.currentGrid.y);
										this.guide.attr(
										{
											'stroke': '#ffffff',
											'stroke-width': 5,
											'stroke-dasharray': '. ',
											'stroke-linecap': 'round'
										});
									}
									else if(!this.currentNode.isPointInside(this.lastGrid.x, this.lastGrid.y))
									{
										// fix snap
										var snap = 5;
										if(true || Math.abs(this.currentGrid.x - this.anchorGrid.x) <= this.grid.spacing * snap && Math.abs(this.currentGrid.y - this.anchorGrid.y) <= this.grid.spacing * snap)
										{
											// start drag
											// find angle (horizontal or diagonal)
											// if path intersects, highlight path as illegal 
											this.guide.attr(
											{
												'path': 'M' + this.anchorGrid.x + ',' + this.anchorGrid.y + 'L' + this.currentGrid.x + ',' + this.currentGrid.y
											});
										}
										else
										{
										}
									}
								}
								else
								{
									//this.isMouseOut = false
									if(this.guide)
									{
										this.guide.remove();
									}
								}
							}
							this.lastGrid.x = this.currentGrid.x;
							this.lastGrid.y = this.currentGrid.y;
						}
					}.bind(this));					
				}
			}.bind(this));
			window.addEvent('mouseup', function(event)
			{
				this.isMouseDown = false;
				if(this.guide)
				{
					this.guide.remove();
				}
				if(this.isMouseOut === true)
				{
					this.isMouseOut = false;
					this.isAnchored = false;
				}
			}.bind(this));
			
			document.id(elementId).addEvent('mousemove', function(event)
			{
				this.snapToGrid(event.client.x, event.client.y);
			}.bind(this));

			
			this.setOptions(options)
		},
		
		snapToGrid: function(mx, my)
		{
			newGridX = this.grid.spacing * Math.round(mx/this.grid.spacing);
			newGridY = this.grid.spacing * Math.round(my/this.grid.spacing);
			
			// if mouse position has moved to a new grid point
			if(this.gx !== newGridX || this.gy !== newGridY)
			{
				/*
				this.dot.attr(
				{
					'cx': newGridX,
					'cy': newGridY
				});
				*/
				this.horizontalLine.attr(
				{
					'path': 'M0,' + newGridY + ',L' + this.width + ',' + newGridY
				});
				this.verticalLine.attr(
				{
					'path': 'M' + newGridX + ',0,L' + newGridX + ',' + this.height
				});

				this.gx = newGridX;
				this.gy = newGridY;
			}
			var point = {};
			point.x = newGridX;
			point.y = newGridY;
			return point;
		},
		
		// mouse x, mouse y
		/* notes
		if(mouse point is a straight line (horizontally, vertically, or perfectly diagonally( from initial mouse point)
			draw a straight line
		else
			draw an appropriate 45 degree line and then a straight line to connect
			the initial mouse point to the current mouse point
			
		on(initial contact)
			while(mouse is on the node)
				store grid point in lastGridPoint
			if(mouse is outside node)
				startGridPoint is last node Point
			if(first difference between current mouse grid point to startGridPoint is diagonal)
				start diagonal
			else if(first difference ... is horizontal/vertical)
				start horizontal.vertical
		then(keep going in direction until you reach wanted x or y coordinate)
		
		on(near end node)
			highlight node to show user end node has been connected
		*/
		
		// path finding
			// before start
			// start
			// snap
			// drag
			// complete
		lineFunction: function(mx, my)
		{
			// convert mx and my to grid
			var a;
		},
			
		// function does not belong in this class (necessary to class though)
		// generalize to any paper object
		// x and y corners are in center lije how circles are drawn
		diamond: function(x, y, base, height)
		{
			// convert later
			var pathString = 'M' + (x - base / 2) + ',' + y + 'l' + base / 2 + ',' + height / 2 + 'l' + base / 2 + ',' + (-height / 2) + 'l' + (-base / 2) + ',' + (-height / 2) + 'Z';
			var diamond = this.paper.path(pathString);
			
			diamond.attr(
			{
				//'stroke-width': Math.max(base / 2, height / 2) / 10,
				'stroke-width': 0,
				//'stroke': '#ffffff',
			});
			
			return diamond;
		},

		// node is a circle for now... but need to generalize for all shapes
		drawCircularNode: function(x, y, callback)
		{			
			// optional parameter
			callback = (typeof callback === 'undefined') ? function(){return;} : callback;

			var startRadius = 0;
			var startStroke = 0;
			
			var node = this.paper.circle(x, y, 0);
			node.attr(
			{
				'fill': this.fill,
				'stroke-width': 0,
				'stroke': this.strokeColor,
				//'fill-opacity': 0.1,
				//'stroke-opacity': 0.25,
				'stroke-miterlimit': 10,
			});
			
			node.data(
			{
				'type': 'textNode'
			});
			
			// to make it less confusing...
			var element = node.node;
			
			/*
			element.addEvent('mouseover', function()
			{
				node.attr(
				{
					'r': this.radius * 1.5,
					'stroke-width': (this.radius * 1.5 * 2) / 10 
				});
			}.bind(this));
			
			element.addEvent('mouseout', function()
			{
				node.attr(
				{
					'r': this.radius,
					'stroke-width': this.radius * 2 / 10
				});
			}.bind(this));
			*/
			
			// ... integrate with Graph class
			this.nodes.push(node);
			
			node.animate(
			{
				'r': this.radius,
				//'stroke-width': 10,
			}, 400, 'bounce', function()
			{
				callback.call();
			});
		
		},
		
		drawNode: function(type, x, y, width, height)
		{
			switch(type)
			{
				case 'circle':
					break;
				case 'rectangle':
					break;
				case 'diamond':
					break;
				default:
					// custom path
					break;
			}
			
			
			//graph.addNode
		},
	});
	
	// SANDBOX -----------------------------------------------------------------
	
	window.addEvent('domready', function(event)
	{

		// arrows nodes align long aarrow
		// new nodes are drawn towards right (direction of borttom
		var app = new Flowur.App('paper', document.body);
		
		/*
		app.drawNode(app.radius * 4, app.cy, function()
		{
			app.drawNode(app.radius * 7, app.cy);
		});
		*/

	});
	
	window.addEvent('beforeunload', function()
	{
		alert('Unsaved changes will be lost.');
	});
	</script>
</head>
<body>
	<div id = "paper">
	</div>
</body>
</html>
