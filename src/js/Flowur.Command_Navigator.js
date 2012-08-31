// JavaScript Document
////////////////////////////////////////////////////////////////////////////////
//Title: Command_Navigator													  //
//By: Patrick Teague														  //
//Date: 5/15/2012															  //
//This class generates the circle surrounding a mouse click and hold sequence,//
//which contains all of the possible operations that may be run on an object. //
//This code is designed to speed up the flowchart creation process.			  //
////////////////////////////////////////////////////////////////////////////////

var Command_Navigator = new Class({
	initialize: function(){
		this.command_set = new Array;
		this.command_wheel = new Array;
		this.currentNode;
		this.editting = false;
		this.mousedown_function;
		this.mouseup_function;
		this.addListeners();
	},
	addListeners: function(){
		var cmd_nav = this;
		this.mousedown_function = function(e){
			
			if(creator.getObjectAt(e.page.x, e.page.y) instanceof Title)
			{
				if(creator.getObjectAt(e.page.x, e.page.y).done_edit == true && !cmd_nav.editting){
					e.stop();
					cmd_nav.currentNode = creator.title;
					creator.edit_title(cmd_nav.currentNode);
					/*
					cmd_nav.command_set.push('edit');
					cmd_nav.command_set.push('save');
					*/
				}					
				else if(cmd_nav.editting && cmd_nav.currentNode != creator.title){
					e.stop();
					if(cmd_nav.currentNode.id === 'title')
						creator.done_title(cmd_nav.currentNode);
					else
						creator.done_node(cmd_nav.currentNode);
					/*
					cmd_nav.command_set.push('edit');
					cmd_nav.command_set.push('save');	
					*/
				}
			}
			else if(creator.getObjectAt(e.page.x, e.page.y) instanceof View_Button)
			{
				go_to_view();	
			}
			else if(cmd_nav.editting)
			{
				if(!(creator.getObjectAt(e.page.x, e.page.y) instanceof Node) ){
					e.stop();
					if(cmd_nav.currentNode.id === 'title')
						creator.done_title(cmd_nav.currentNode);
					else
						creator.done_node(cmd_nav.currentNode);
					/*
					cmd_nav.command_set.push('done');
					cmd_nav.command_set.push('save');
					*/
				}
				else if(creator.getObjectAt(e.page.x, e.page.y).done_edit == true){
					e.stop();
					if(cmd_nav.currentNode.id === 'title')
						creator.done_title(cmd_nav.currentNode);
					else
						creator.done_node(cmd_nav.currentNode);
						/*
					cmd_nav.command_set.push('done');
					cmd_nav.command_set.push('save');
					*/
				}
			}
			else{
				
				//If clicked element is a node
				if(creator.getObjectAt(e.page.x, e.page.y) instanceof Node)
				{	
					var temp_node = creator.getObjectAt(e.page.x, e.page.y);
					if(temp_node === creator.baseNode && temp_node.getText() === "Enter your text here."){
						e.stop();
						cmd_nav.currentNode = temp_node;
						creator.edit_node(temp_node);	
					}
					else if(temp_node != creator.baseNode){
						if(creator.baseNode.getParentArray() != null && temp_node === creator.baseNode.getParentArray()[0]){
							e.stop();
							creator.back_node(creator.baseNode);
						}
						else{
							e.stop();
							creator.select_node(temp_node);	
						}
					}
					else{
						cmd_nav.currentNode = temp_node;
						if(!cmd_nav.editting){
							e.stop();
							cmd_nav.command_set.push('link');
							if(!creator.isLinking()){
								cmd_nav.command_set.push('edit');
								if( creator.getCurrentArray()[0] === temp_node ){
									if(temp_node.getParentArray() != null){
										cmd_nav.command_set.push('delete');
									}
									cmd_nav.command_set.push('add');
								}
								else{
									cmd_nav.command_set.push('delete');
								}
							}	
						}
					}		
				}
				
				else{
					e.stop();
					cmd_nav.command_set.push('add');
					cmd_nav.command_set.push('save');
				}
			}	
			cmd_nav.create_wheel(e.page.x, e.page.y);
		};
		this.mouseup_function = function(e){
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
		};
		document.id('application').addEvent('mousedown', this.mousedown_function);
		//Make descision on what command to execute, get rid of navigator from stage
		document.id('application').addEvent('mouseup', this.mouseup_function);
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
					var add_btn = new Add_Node_Command();
					this.command_wheel.push(add_btn);
					break;	
				case 'delete':
					var delete_btn = new Delete_Node_Command();
					this.command_wheel.push(delete_btn);
					break;
				case 'link':
					var link_btn = new Link_Node_Command();
					this.command_wheel.push(link_btn);
					break;
				case 'edit':
					var edit_btn = new Edit_Node_Command();
					this.command_wheel.push(edit_btn);
					break;
				case 'save':
					var save_btn = new Save_Node_Command();
					this.command_wheel.push(save_btn);
					break;
			}
		}
		for(var i=0; i<num_commands; i++)
		{
			this.command_wheel[i].draw(x_center, y_center, num_commands, i);
		}
	},
	close_it: function(){
		document.id('application').removeEvent('mousedown', this.mousedown_function);
		document.id('application').removeEvent('mouseup', this.mouseup_function);
	},
	
});