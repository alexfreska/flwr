/**
 * Overlay tool (Mootools version)
 * Ported to Mootools and programatic column control by Mark Story (http://mark-story.com)
 *
 * http://github.com/dotjay/hashgrid
 * Version 1, 21 Dec 2009
 * By Jon Gibbins, accessibility.co.uk
 */
var GRID_OPTIONS = {
	width: 1008,  //width of your layout.
	gutters: 12, //space between each column
	columns: 42 // Number of columns you want on your grid.
};

window.addEvent('domready', function () {
	var grid = new GridOverlay('grid', GRID_OPTIONS);
})

var GridOverlay = new Class({
	Implements: Options,

	options : {
		cookiePrefix: 'gridOverlay',
		width: 980,
		gutters: 20,
		columns: 6
	},
	overlay: null,
	visible: false,
	sticky: false,
	originalZIndex: null,

	initialize: function (id, options) {
		this.setOptions(options || {});
		var overlayEl = new Element('div', {
			id: id,
			styles: {
				display: 'none',
				width: this.options.width
			}
		});

		//remove the existing element if any and append to the DOM
		if (document.id(id)) document.id(id).destroy();
		document.id(document.body).adopt(overlayEl);
		this.overlay = document.id(id);

		//set the z-index
		var zIndex = this.originalZIndex = this.overlay.getStyle('zIndex');
		if (zIndex == 'auto') {
			//this.originalZIndex = '-1';										// change
			this.originalZIndex = '9999';
			//this.overlay.setStyle('zIndex', '-1');							// change
			this.overlay.setStyle('zIndex', '9999');
		}
		this.horizontalLines();
		this.verticalLines();
		this.checkCookie();
		this.bindEvents();
	},

	horizontalLines: function () {
		// Override the default overlay height with the actual page height
		var pageHeight = document.id(document).getScrollSize().y;
		this.overlay.set('height', pageHeight);

		// Add the first grid line so that we can measure it
		this.overlay.adopt(new Element('div', {'class': 'horiz first-line'}));
		
		// Calculate the number of grid lines needed
		var gridLines = this.overlay.getChildren('.horiz'),
			gridLineHeight = gridLines[0].getStyle('height').toFloat() + gridLines[0].getStyle('borderBottomWidth').toFloat(),
			numGridLines = Math.floor(pageHeight / gridLineHeight),
			i = numGridLines - 1;

		// Add the remaining grid lines
		while (i--) {
			this.overlay.adopt(new Element('div', {'class': 'horiz'}));
		}
	},
	
	verticalLines: function () {
		var columns = this.options.columns,
			gutterCount = columns + 1,
			columnWidth = (this.options.width - (gutterCount * this.options.gutters)) / columns,
			i = columns - 1;

		var pageHeight = document.id(document).getScrollSize().y;
		var firstColumn = new Element('div', {
			'class': 'vert',
			styles: {
				position: 'absolute',
				height: pageHeight,
				top: 0
			}
		});
		this.overlay.adopt(firstColumn);
		var leftBorder = firstColumn.getStyle('borderLeftWidth').toInt(),
			rightBorder = firstColumn.getStyle('borderRightWidth').toInt(),
			gutterWidth = this.options.gutters - leftBorder, //gutter includes 1 border
			columnWidth = columnWidth - rightBorder, //column includes the other border
			columnOffset = gutterWidth + columnWidth + leftBorder + rightBorder; //offset = gutter + column + borders

		firstColumn.setStyles({
			left: gutterWidth,
			width: columnWidth
		});

		var offset = gutterWidth + columnOffset;
		while (i--) {
			this.overlay.adopt(new Element('div', {
				'class': 'vert',
				styles: {
					position: 'absolute',
					height: pageHeight,
					width: columnWidth,
					left: offset,
					top: 0
				}
			}));
			offset += columnOffset
		}
	},

	checkCookie: function () {
		this.Cookie = new Cookie(this.options.cookiePrefix + this.overlay.get('id'));
		if (this.Cookie.read()) {
			//this.visible = true;												// change
			this.visible = true;												// change
			this.sticky = true;
			this.overlay.setStyle('display', 'block');
		}
	},
	
	bindEvents: function () {
		var self = this;
		document.addEvent('keydown', function (event) {
			if (self.visible) {
				// alt+b toggles front/back for overlay
				//if (event.alt && event.key == 'b') {							// change
				if (event.key == 'b') {
					//if (self.overlay.getStyle('zIndex') == 9999) {			// change
					if (self.overlay.getStyle('zIndex') == -1) {
						self.overlay.setStyle('zIndex', self.originalZIndex);
					} else {
						//self.overlay.setStyle('zIndex', 9999);				// change
						self.overlay.setStyle('zIndex', -1);
					}
				}
				// alt+g+enter makes the grid stick.
				//if (event.alt && event.key == 'enter') {						// change
				if (event.key == 'f') {
					self.sticky = true;
					self.Cookie.write(1);
				} else if (self.sticky && event.alt && event.key == 'g') {
					self.overlay.setStyle('display', 'none');
					self.visible = self.sticky = false;
					self.Cookie.dispose()
				}
			} else {
				//alt+g shows the grid
				//if (event.alt && event.key == 'g') {							// change
				if (event.key == 'g') {
					self.overlay.setStyle('display', 'block');
					self.visible = true;
				}
			}
		});

		// Hide the overlay on alt+g
		document.addEvent('keyup', function (event) {
			//if (!self.sticky && event.alt && event.key == 'g') {				// change
			if (event.key == 'h') {				
				self.overlay.setStyle('display', 'none');
				self.visible =  false;
			}
		});
	}
});
