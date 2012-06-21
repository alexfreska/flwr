// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: commandNavigator	                                              //
//This class generates the circle surrounding a mouse click and hold sequence,//
//which contains all of the possible operations that may be run on an object. //
//This code is designed to speed up the flowchart creation process.	      //
////////////////////////////////////////////////////////////////////////////////

var commandNavigator = new Class({
	initialize: function(){
		this.command_set = new Array;
		this.command_wheel = new Array;
		this.currentNode;
		this.editting = false;
		this.addListeners();
	},
	addListeners: function(){
		var cmd_nav = this;
		document.id('application').addEvent('mousedown', function(e){
			e.stop();
			if(cmd_nav.editting)
			{
				cmd_nav.command_set.push('done');
				cmd_nav.command_set.push('save');
			}
			else{
				
				//If clicked element is a node
				if( creator.getObjectAt(e.page.x, e.page.y) instanceof Node )
				{
					var temp_node = creator.getObjectAt(e.page.x, e.page.y);
					cmd_nav.currentNode = temp_node;
					if(!cmd_nav.editting)
						cmd_nav.command_set.push('edit');
					cmd_nav.command_set.push('link');
					if( creator.getCurrentArray()[0] === temp_node ){
						if(temp_node.getParentArray() != null){
							//cmd_nav.command_set.push('delete');
							cmd_nav.command_set.push('back');
							
						}
						cmd_nav.command_set.push('add');
					}
					else{
						cmd_nav.command_set.push('delete');
						cmd_nav.command_set.push('select');
					}
				}
				else if(creator.getObjectAt(e.page.x, e.page.y) instanceof Title){
					cmd_nav.currentNode = creator.title;
					cmd_nav.command_set.push('edit');
					cmd_nav.command_set.push('save');
				}
				else{
					cmd_nav.command_set.push('add');
					cmd_nav.command_set.push('save');
				}
			}
			cmd_nav.create_wheel(e.page.x, e.page.y);
		});
		//Make descision on what command to execute, get rid of navigator from stage
		document.id('application').addEvent('mouseup', function(e){
			e.stop();
			var num_commands = cmd_nav.command_set.length;
			for(var i= 0; i<num_commands; i++)
			{
				if(cmd_nav.command_wheel[i].point_in(e.page.x, e.page.y))
					cmd_nav.command_wheel[i].doCommand(cmd_nav.currentNode);	
			}
			for(var i = num_commands-1; i>-1; i--)
			{
				cmd_nav.command_set.pop();
				cmd_nav.command_wheel[i].undraw();
				cmd_nav.command_wheel.pop();	
			}
		});
	},
	add_command: function(str){
		this.command_set.push(str);
	},
	create_wheel: function(x_center, y_center){
		var num_commands = this.command_set.length;
		for(var i = 0; i<num_commands; i++) //Create new buttons to occupy the wheel
		{
			switch(this.command_set[i])
			{
				case 'add':
					var add_btn = new addNodeCommand();
					this.command_wheel.push(add_btn);
					break;	
				case 'delete':
					var delete_btn = new deleteNodeCommand();
					this.command_wheel.push(delete_btn);
					break;
				case 'link':
					var link_btn = new linkNodeCommand();
					this.command_wheel.push(link_btn);
					break;
				case 'edit':
					var edit_btn = new editNodeCommand();
					this.command_wheel.push(edit_btn);
					break;
				case 'save':
					var save_btn = new saveNodeCommand();
					this.command_wheel.push(save_btn);
					break;
				case 'select':
					var select_btn = new selectNodeCommand();
					this.command_wheel.push(select_btn);
					break;
				case 'back':
					var back_btn = new backNodeCommand();
					this.command_wheel.push(back_btn);
					break;
				case 'done':
					var done_btn = new doneNodeCommand();
					this.command_wheel.push(done_btn);
					break;
			}
		}
		for(var i=0; i<num_commands; i++)
		{
			this.command_wheel[i].draw(x_center, y_center, num_commands, i);
		}
	},
	
});
