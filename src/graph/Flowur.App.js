// imports ---------------------------------------------------------------------
Asset.javascript('/Flowur.Stage.js');

/*
 * Maybe I could use this?
 *
 * snapToGrip = function(val,gridSize){
    var snap_candidate = gridSize * Math.round(val/gridSize);
    if (Math.abs(val-snap_candidate) < 2) {
        return snap_candidate;
    }
    else {
        return null;
    }
};

 */


/**
 * Flowur Flowchart class
 *
 * This class contains the primary functionality for flowcharts. A Flowur.Flowchart
 * constitutes a directed acyclic graph (DAG).
 *
 * @todo	(o) a way for the class to hold instances of itself, i.e. "subgraphs"
 *			(o) a way for the class to identify cycles within the flowchart
 *      	(o) split class into modules/components like operations, visualizations,
 * 				and primary functions
 *      	(o) make sure graph is directed and no nodes can reference each other back
 * 				and forth
 * 			(o) implement options (specify which properties should be optional
 * 				or required): layout, id*, depth*
 *
 *				* denotes a required property
 * 			(o) implement methods: create(), merge(),updateEach(), getMiniFlowchart(),
 * 				cleanFlags(), getChildren(), isAdjacent(), getParents(), isChild(),
 *				isParent(), isDescendant(), isAncestor(), isRelative(), isNeighbor()
 * 			(o) clean the way the Flowchart references nodes, i.e. updates to node should
 * 				also be found in "from" and "to" parameters
 *
 * @see		http://www.martinbroadhurst.com/graph-data-structures.html#intuitive
 * @example	(start js code)
 *
 *			someFlowchart = new Flowur.Flowchart(
 *			{
 *				title: 'how do I make a flowchart?',	// converts to 'How do I Make a Flowchart?'
 *				layout: 'standard'
 *			});
 *
 *			(end js code)
 */

Flowur.Flowchart = new Class(
{	
	Implements: [Options, Events],

	options:
	{
		title: ''
	},

	initialize: function(options)
	{
		// class properties ----------------------------------------------------
		
		// sets of nodes and arrows
		this.nodes = [];
		this.arrows = [];
		this.sourceNode = {};
		
		// set options
		this.title = this.options.title;
		this.setOptions(options)

		//this.create();
	},

	/**
 	 * create()
 	 *
	 * prepare and produce a flowchart object
	 *
	 * @todo 	(o) reevaluate how to implement: (a) hidden source node with hidden 
	 *				arrows pointing to multiple start nodes, (b) multiple graphs linked
	 *				together, (c) limit to one graph
	 *
	 * @return	(Null)
	 */
	 
	create: function()
	{
		//this.source = new Node('source', 'Start here!');
	},

	/**
 	 * addNode([data])
 	 *
	 * add a node to the flowchart
	 *
	 * @todo 	(o) Extend the data parameter to hold more than just text. Perhaps the
	 * 				data can be implemented as an object.
	 *
	 * @param	data 	(string)	(optional) the text on the node
	 * @return			(Node)		the node that was added to the flowchart
	 */
	 
	addNode: function(data)
	{
		data = data || Flowur.Flowchart.getAlphaId();
		
		id = Flowur.Flowchart.assignId();

		var node = new Flowur.Node(id, data);
		
		// initialize start node
		if(this.nodes.length == 0)
		{
			this.sourceNode = node;
		}
		
		this.nodes.push(node);
	
		return node;
	},	

	/**
 	 * removeNode(id)
 	 *
	 * remove a node from the flowchart as well as any arrows that reference that node
	 *
	 *
	 * @todo	(o) Clean the return statements. Just verify whether the node to remove
	 * 				exists and then return null.
	 * 			(o) Perhaps make it so that a Node reference can be passed into the
	 * 				method instead of an id.
	 *			(o) logic with source node
	 *
	 * @param	id	(number)		the id of the node to be removed
	 * @return 		(Node | Null)	the node that was removed from the flowchart
	 *								or Null if the removal was unsuccessful	
	 *
	 * @trivial	<paroX> girl in the red 12 oclock pretty hot. 
	 			<unblevable> red sweatpants? 
	 			<unblevable> is that econ girl?
	 *          <unblevable> she looks so indie.
	 */
	 
	removeNode: function(id)
	{
		// remove any arrows that reference the node to be removed
		this.arrows.each(function(arrow)
		{	
			if(arrow.getFrom.getId == id) arrow.getFrom.setId(null);
			if(arrow.getTo.getId == id) arrow.getTo.setId(null);
		});
	
		// remove the node
		this.nodes.some(function(node, index)
		{
			if(node.getId == id)
			{
				// reevaluate sourceNode
				// fix
				if(node === this.sourceNode)
				{
					return false;
				}
				nodes.splice(index, index + 1);
				return true;
			}
			else
			{
				console.log("Node with _id_ " + id + " does not exist.");
				return false;
			}
		});
	},


	/**
 	 * addArrow(from, to [,data])
 	 *
	 * add an arrow to the flowchart
	 *
	 * @todo 	(o) Extend the data parameter to hold more than just text. Perhaps the
	 * 				data can be implemented as an object.
	 *
	 * @param	from	(Node)			the arrow's source node
	 * @param	to		(Node)			the arrow's target node
	 * @param	data	(String)		(optional) the text on the arrow
	 * @return 			(Node)			the node that was removed from the flowchart
	 *									if successful
	 * @return			(Null)			if unsuccessful
	 *
	 */
	 
	addArrow: function(from, to, data)
	{
		data = data || '';
		
		if(from == null)
		{
			console.log("_from_ does not exist.");
			return null;
		}
		else if(to == null)
		{
			console.log("_to_ does not exist.");
			return null;
		}
	
		this.arrows.each(function(arrow, index)
		{
			if(arrow.from == to && arrow.to == from)
			{
				console.log("Two Nodes cannot refer to each other in both directions.");
				return null;
			}
		});
	
		this.arrows.push(new Flowur.Arrow(from, to, data));
	},
	
	/**
 	 * removeArrow(from, to)
 	 *
	 * remove an arrow from the flowchart
	 *
	 * @param	from	(Node)	the arrow's source node
	 * @param	to		(Node)	the arrow's target node
	 *
	 */
	
	removeArrow: function(from, to)
	{	
		this.arrows.each(function(arrow)
		{
			if(arrow.getFrom == from && arrow.getTo == to)
			{
				arrows.splice(index, index + 1);
			}
		});
	},
	
	/**
 	 * updateEach()
 	 *
	 * update the properties of each node in the flowchart
	 *
	 * @todo 	(o) implement the entire function
	 */
	
	updateEach: function()
	{
	},
	
	/**
 	 * invokeEach()
 	 *
	 * invoke an action upon each node in the flowchart
	 *
	 * @todo 	(o) implement the entire function
	 */
	
	invokeEach: function()
	{
	},
	
	/**
 	 * getNeighbors(node)
 	 *
	 * get the neighbors of a node. A node that is the source of an arrow is called
	 * the "neighbor" of the node that is the arrow's target.
	 *
	 * @todo	(o) implement as a static method instead?
	 *
	 * @param	node	(Node)	the node from which to retrive neighbors
	 * @return			(Array)	an array of the node's neighbors and an empty array
	 *							if the node has no neighbors
	 */
	
	getNeighbors: function(node)
	{
		neighbors = [];
		this.arrows.each(function(arrow)
		{
			if(arrow.from == node) neighbors.push(node);
		});
	
		return neighbors;
	},
	
	getNeighborsCount: function(node)
	{
		count = 0;
	
		this.arrows.each(function(arrow)
		{
			if(arrow.from == node) count++;
		});
	
		return count;
	},
	
	/**
 	 * getNodes()
	 *
	 * @return	(Array)	the nodes in the flowchart
	 */

	getNodes: function()
	{
		return this.nodes;
	},
	
	/**
 	 * getArrows()
	 *
	 * @return	(Array)	the arrows in the flowchart
	 */

	getArrows: function()
	{
		return this.arrows;
	},

	/**
 	 * getNodesCount()
	 *
	 * @return	(Number)	the number of nodes in the flowchart	
	 */
	 
	getNodesCount: function()
	{
		return this.nodes.length;
	},
	
	/**
 	 * getArrowsCount()
	 *
	 * @return	(Number)	the number of arrows in the flowchart	
	 */
	 
	getArrowsCount: function()
	{
		return this.arrows.length;
	},
	
	/**
 	 * find(query)
 	 *
 	 * find a node in the flowchart with a search query
 	 *
 	 * @todo	(o) Implement the entire function.	
	 *
	 * @param	query	(Object)	a JSON object of properties and/or values to
	 *								be searched
	 * @return			(Node)		the node 
	 * @return			(Array)		an array of nodes that match the given query
	 */
	 
	find: function(query)
	{
	},
	
	/**
 	 * toJSON()
 	 *
 	 *
 	 *
 	 * @todo	(o) Implement the entire function.	
 	 *			(o) recursively "cleanse" node data
	 *
	 * @param	query	(Object)	a JSON object of properties and/or values to
	 *								be searched
	 * @return			(Node)		the node 
	 * @return			(Array)		an array of nodes that match the given query
	 */
	 
	toJSON: function()
	{
		nodes = [];
		this.nodes.each(function(node)
		{
			nodes.push(Object.subset(node, ['id', 'data']));
		});
		
		arrows = [];
		this.arrows.each(function(arrow)
		{
			from = Object.subset(arrow.from, ['id', 'data']);
			to = Object.subset(arrow.to, ['id', 'data']);
			
			cleansedArrow =
			{
				from: from,
				to: to,
				data: arrow.data
			}
			
			arrows.push(cleansedArrow);
		});
		
		flowchart =
		{
			title: this.options.title,
			nodes:	nodes,
			arrows: arrows,
		}
		
		return JSON.encode(flowchart);
	},
	
	fromJSON: function(flowchart)
	{
	},

	// UTILITY FUNCTIONS -------------------------------------------------------
	listNodes: function()
	{
		console.log('Nodes ' + '(' + this.getNodesCount() + ')');
		this.nodes.each(function(node, index, data)
		{
			//console.log('(' + node.id + ') ' + node.data);
			console.log(data);
		});
	},
	
	store: function()
	{
		data = 'title=' + this.options.title + '&data=' + this.toJSON();
		request = new Request(
		{
			url: '/php/json.php',
			data:'title=' + this.options.title + '&data=' + this.toJSON(),
			link: 'ignore',
			method: 'post',
			onSuccess: function(responseText)
			{
				document.id('main').appendText(data);
				alert(responseText);
			},
			onFailure: function(xhr)
			{
       			alert('Error!  Status = ' + xhr.status);
     		}
		});

		request.send();
	},

	print: function()
	{
		klass = this;
	
		// print title and node(s) count
		console.log(this.options.title + ' (' + this.getNodesCount() + ')');

		// print neighbors
		message = "";
		var currentNeighborsCount;
	
		//while there is still a node in the graph
		klass.nodes.each(function(node)
		{
			neighborsCount = klass.getNeighborsCount(node);
			message = '[(' + node.id + ') ' + node.data + '](' + neighborsCount + '): ';		
			currentNeighborsCount = 0;
		
			if(neighborsCount > 0)
			{
				klass.arrows.each(function(arrow)
				{
					if(arrow.from == node)
					{
						message += '[' + arrow.data + '] -> ' + '(' + arrow.to.id + ') '/*+ '[' + arrow.to.data + ']' */;
		
						if(neighborsCount < neighborsCount - 1) message += ', ';

						currentNeighborsCount++;
					}
				});
			}

			console.log(message);
		});
	},
	
	Mutators: ['sourceNode']
});

Flowur.Flowchart.extend(
{
	alphaId: '',
	alphaIndex: 0,

	generateId: function()
	{
		// alpha ids are only temporary
		// number ids will be easier to code and maintain
		chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLKMNOPQRSTUVWXYZ";
		this.alphaId = chars.substring(this.alphaIndex, this.alphaIndex + 1);
	
		// increment index
		this.alphaIndex++;
	
		if(this.alphaIndex > chars.length + 1)
		{
			// cycle to the beginning
			this.alphaIndex = 0;
		}
	},

	getAlphaId: function()
	{
		return this.alphaId;
	},

	assignId: function()
	{
		this.generateId();
		return this.alphaId;
	}

});

