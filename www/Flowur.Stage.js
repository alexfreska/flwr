Flowur.Stage = new Class(
{
	Implements: [Options, Events],
	
	width: 1024,
	height: 384,

	initialize: function(width, height, options)
	{
		this.width = width;
		this.height = height;
		
		this.setOptions(options);
	},

	Mutators: ['id', 'data']
});
