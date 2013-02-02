;(function($){
	$(document).on('ready', function(){
		_.templateSettings = {
			variable	: 'template'
		};

		//	!	temporary
		var em = 16;

		var App			= Backbone.Model.extend({
			defaults	: {
			//	flowchart data structure
				flowchart	: {}
			},

			initialize	: function(){
			},
		});

		var AppView		= Backbone.View.extend({
			el			: $('body'),

			events		: {
				'keydown'	: 'onKeydown',
			},

			onKeydown	: function(event){
				if(event.which == 90)
				{
					$('#phase-input').zoomTo({
						root		: $('.zoomContainer'),
						targetsize	: 1.0,
						duration	: 600
					});
				}
				else if(event.which == 88)
				{
					$('#phase-input').zoomTo({
						root		: $('.zoomContainer'),
						targetsize	: .7,
						duration	: 600
					});
				}
			},
		});

		//	input phase
		//	--------------------------------------------------------------------

		//	!	extend from Phase
		//	!	separate interface variables from model
		var Input 		= Backbone.Model.extend({
			defaults	: {
				nodes			: [],
				arrows			: [],

				//	flags ------------------------------------------------------

				isMouseDownOnNode	: false,
				hasMouseLeftNode	: false,
				isThereADummyArrow	: false,

				//	relations --------------------------------------------------

				selectedNode		: {},
			},

			initialize	: function(){
			}
		});

		//	extend from PhaseView
		var InputView 	= Backbone.View.extend({
			el				: $('#phase-input'),

			events			: {
				'dblclick'						: 'onDblclick',
				'mousedown'						: 'onMousedown',
				'mouseover	.arrow-buffer'		: 'onMouseover',
				'mousemove'						: 'onMousemove',
				'mouseup'						: 'onMouseup',
			},

			initialize	: function(options){
				_.bindAll(this, 'drawNode', 'onDblclick', 'onMousedown', 'onMouseover', 'onMousemove', 'onMouseup', 'onNodeenter');

				//	flags ------------------------------------------------------
				this.isMouseDownOnNode = false;
				this.hasMouseLeftNode = false;
				this.isThereADummy = false;

				//	!	pre-calculate or optimize
				//	instansiate Raphael paper
				this.paper = Raphael('phase-input', $(window).width(), $(window).height() - $('#scrolling-bar').height());
				this.paper.canvas.id = 'paper';

				//	pre-render dummy arrow guide
				this.dummy = this.paper.path();
				this.dummy.attr({
					'stroke'	: 'rgba(0, 0, 0, .1)'
				});

				//	bind custom events
				this.on('nodeenter', this.onNodeenter, this);
				this.on('nodeleave', this.onNodeleave, this);
				this.on('nodeselect', this.onNodeselect, this);
			},

			drawArrow		: function(dummy){
				dummy.clone;


			},

			drawNode		: function(mx, my){
				//	!	don't use 'self'
				var self = this;
				var nodeView = new NodeView({
					inputView	: self,
					x			: mx - this.$el.offset().left,
					y			: my - this.$el.offset().top
				});

				this.$el.append(nodeView.render().el);
				nodeView.$el.find('.node').focus();
				nodeView.centerText();

				return nodeView;
			},

			//	events listeners -----------------------------------------------

			onDblclick		: function(event){
				if(event.target.id === 'paper')
				{
					this.drawNode(event.pageX, event.pageY);
				}
			},
			
			onMousedown		: function(event){
				//	!	optimize
				if($(event.target).attr('class') === 'node-container' || $(event.target).attr('class') === 'node'){
					//	set flag for mouse down on node ------------------------
					this.isMouseDownOnNode = true;

					if($(event.target).attr('class') === 'node-container'){
						//	prevent text selection -----------------------------
						event.preventDefault();
					}
					
				}
			},

			onMouseover	: function(event){
			},

			onMousemove		: function(event){
				if(this.isMouseDownOnNode){
					//	set flag for dummy -------------------------------------
					this.isThereADummy = true;
					
					//	have dummy follow mouse --------------------------------
					var self = this;
					this.dummy.attr('path', 'M'
							+ self.dummyX + ',' 
							+ self.dummyY + 'L'
							+ event.pageX + ','
							+ (event.pageY - self.$el.offset().top));

				}
			},

			onMouseup		: function(event){
				//	set flag for mouse down on node ----------------------------
				this.isMouseDownOnNode = false;

				if(this.isThereADummy){
					if($(event.target).attr('class') === 'node-container' || $(event.target).attr('class') === 'node'){
					} else{

						//	!	cleanup
						var nodeView = this.drawNode(event.pageX, event.pageY);
						var self = this;
						var arrowView = new ArrowView({
							'inputView'	: self,
							'svg'	: self.dummy
						});
						this.dummy.attr('path', '');
					
						nodeView.arrowViews.push(arrowView);
					}
						
				}

				//	reset dummy ------------------------------------------------
				this.dummy.attr('path', '');
				this.isThereADummy = false;

				//	set flag for mouse leave from node
				this.hasMouseLeftNode = false;
			},

			onNodeenter		: function(){
				this.hasMouseLeftNode = false;
			},

			onNodeleave		: function(){
				this.hasMouseLeftNode = true;
			},

			onNodeselect	: function(x, y)
			{
				this.dummyX = x;
				this.dummyY = y;
			}
		});

		var Node		= Backbone.Model.extend({
			defaults	:	{	
				data	: '',
				type	: 'question',
			},
		});

		var NodeView	= Backbone.View.extend({
			tagName			: 'div',

			className		: 'node-container',

			events			: {
				'blur .node'		: 'onBlur',
				'blur'				: 'onDeselect',
				'click'				: 'onClick',
				'focus .node'		: 'onFocus',
				'keypress .node'	: 'onKeypress',
				'keyup .node'		: 'onKeyup',
				'mousedown'			: 'onMousedown',
				'mouseenter'		: 'onMouseenter',
				'mouseleave'		: 'onMouseleave',	
				'mouseup'			: 'onMouseup'
			},

			initialize		: function(options){
				_.bindAll(this, 'render', 'unrender', 'centerText', 'onBlur', 'onClick', 'onDeselect', 'onFocus', 'onKeypress', 'onKeyup', 'onMousedown', 'onMouseenter', 'onMouseleave', 'onMouseup');

				this.inputView = options.inputView;

				//	!	move to parent object
				this.em = $('body').css('font-size').replace(/[^-\d\.]/g, '');

				this.width = this.em * 8;
				this.height = this.em * 8;
				this.nodeWidth = this.em * 2;
				this.nodeHeight = this.em * 2;
				this.top = options.y - this.height / 2 - this.nodeHeight / 2;
				this.left = options.x - this.width / 2 - this.nodeWidth / 2;
				this.x = options.x;
				this.y = options.y;

				this.arrowViews = [];
			},

			render			: function(){	
				this.$el.html(_.template($('.node-template').html(), {}));
				this.text = this.$el.find('.node');
					
				_.bind(this.$el.css, this);
				this.$el.css({
					'top'	: this.top,
					'left'	: this.left
				});

				return this;
			},

			unrender		: function(){
				_.each(this.arrowViews, function(arrowView){
					arrowView.unrender();
				});
				this.remove();
			},

			//	!	and adjust reclip; fire event on center?
			centerText		: function(){
				//	!	optimize
				_.bind(this.text.css, this);
				this.text.css({
					'top'			: '50%',
					'left'			: '50%',
					'margin-top'	: -(this.text.outerHeight()) / 2,
					'margin-left'	: -(this.text.outerWidth()) / 2
				});
			},

			onBlur			: function(){
				if(this.text.text() === ''){
					this.unrender();
				}
			},

			onClick			: function(event){
			},

			onDeselect		: function(){
			},

			onFocus			: function(){
			},

			onKeypress		: function(event){
				this.centerText();
			},

			onKeyup			: function(){
				this.centerText();
			},

			onTextfocus		: function(event){
			},

			onMousedown		: function(event){
				this.inputView.trigger('nodeselect', this.x, this.y);

				if(event.target == this.text[0]){
					//	if text is not selected
					if((window.getSelection && window.getSelection().isCollapsed
							|| document.getSelection && document.getSelection().isCollapsed
							|| document.selection && document.selection.createRange().endOffset > document.selection.createRange().startOffset)){
						if(!this.text.is(':focus')){
							event.preventDefault();
						}
					} else{
						if(window.getSelection){
						//window.getSelection().getRangeAt(0).setStartAfter(event.target.childNodes[0]);
						//	window.getSelection().getRangeAt(0).setEnd(this.text[0].childNodes[0], this.lastAnchorOffset);
						} else if(document.getSelection){
							document.getSelection().getRangeAt(0).setStart(this.text[0].childNodes[0], anchorOffset);
						} else if(document.selection){
							document.selection.empty();
						}
					}
				}
			},

			onMouseenter	: function(){
				this.inputView.trigger('nodeenter');
			},

			onMouseleave	: function(){
				this.inputView.trigger('nodeleave');
			},

			onMouseup		: function(event){
				if(event.target == this.text[0]){
					//	if text is not selected and text is not focused
					if((window.getSelection && window.getSelection().isCollapsed
							|| document.getSelection && document.getSelection().isCollapsed
							|| document.selection && document.selection.createRange().endOffset > document.selection.createRange().startOffset)){
						if(!this.text.is(':focus')){
							this.text.selectText();
							this.text.focus();
						}
					}
				}
			}

		});

		var ArrowView	= Backbone.View.extend({
			events		: {
			},

			initialize	: function(options){
				_.bindAll(this, 'render', 'unrender');

				//	! 	specify defaults in another way...
				this.x = 0;
				this.y = 0;

				this.svg = options.svg.clone();
				$(this.svg.node).attr('class', 'arrow');
				this.svg.attr({
					'stroke'	:	'rgba(0, 238, 238, 0.5)'
				});

				this.buffer = this.svg.clone();
				this.buffer.attr({
					'stroke'	: 'rgba(0, 0, 0, 0)',
					'stroke-width'	: 2 * em,
				});
				$(this.buffer.node).attr('class', 'arrow-buffer');
				$(this.buffer.node).css('cursor', 'not-allowed');
				this.buffer.mouseover(function(){
					console.log('fire');
				});
				this.el = this.svg.node;

				this.inputView = options.inputView;

				var self = this;
				this.inputView.$el.on('mouseenter', '.arrow-buffer', function(event){
					if(event.target === self.svg.node || event.target === self.buffer.node){
						self.svg.attr({
							'stroke-dasharray'	: '- '
						});
					}
				});
				this.inputView.$el.on('mouseleave', '.arrow-buffer', function(event){
					if(event.target === self.svg.node || event.target === self.buffer.node){
						self.svg.attr({
							'stroke-dasharray'	: ''
						});
					}
				});

				this.render();
			},

			render		: function(){
//				this.buffer = this.svg.clone();
//				this.buffer.attr({
//					'stroke'	: 'rgba(0, 0, 0, 0)',
//					'stroke-width'	: em,
//				});
//				$(this.buffer.node).attr('class', 'arrow-buffer');
			},

			unrender	: function(){
				this.svg.remove();
				this.buffer.remove();
				this.remove();
			}
		});

		//	! 	temporary
		var SettingsView = Backbone.View.extend({
			el		: $('#toggle-settings'),

			events	: {
				'click'	: 'onClick'
			},

			initialize	: function(){
				_.bindAll(this, 'onClick');

				this.menuVisible = false;
			},

			onClick		: function(event){
				if(!this.menuVisible){
					this.$el.css('background-color', '#f62525');
					$('#settings-menu').animate({
						'right'	: 0
					}, 250);
				}
				else{
					this.$el.css('background-color', 'rgba(220, 220, 220, 0.2)');
					$('#settings-menu').animate({
						'right'	: -$('#settings-menu').outerWidth()
					}, 250);
				}
				this.menuVisible = !this.menuVisible;
			}
		});

		var visualize = Backbone.Model.extend({
		});

		var visualizeInput = Backbone.Model.extend({
		});

		//	initialization
		//	--------------------------------------------------------------------

		$('#settings-menu').css({
			'right'	: -$(this).outerWidth()
		});
		var appView = new AppView();
		var settingsView = new SettingsView();
		var input = new Input();	
		var inputView = new InputView({
			model	: input
		});
	});
				$.fn.selectText = function(){
					var element = this[0];

					if(document.body.createTextRange){
						var range = document.body.createTextRange();
						range.moveToElementText(element);
						range.select();
					} else if(window.getSelection){
						var selection = window.getSelection();
						var range = document.createRange()

						range.selectNodeContents(element);
						selection.removeAllRanges();
						selection.addRange(range);
					}
				};
})(jQuery);
