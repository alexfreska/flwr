$(document).ready(function()
{
	// hide form elements
	//$('input.email-address').hide();
	//$('input.join-us').hide();
	//$('form#log-in-register img.email-address').hide();
	
	// HEADER -------------------------------------------------------------------
	
	// -----------------------------------------------------------------/ HEADER
	
	// FORMS -------------------------------------------------------------------
	
	//slideLogInForm();
	//slideRegistrationForm();
	//toggleLogInRegistrationForm();
	
	$('form#log-in-register img').css({'opacity' : '0.3'});
	
	$('form#log-in-register input[type = "text"], form#log-in-register input[type = "password"]').focus(function()
	{	
		$(this).prev().fadeTo(500, 1);
		$(this).css({'color' : '#000000'});
		if(this.value == this.defaultValue)
		{
			this.value = '';
		}
	});
	
	$('form#log-in-register input[type = "text"], form#log-in-register input[type = "password"]').blur(function()
	{
		if($.trim(this.value) == '')
		{
			if(this.defaultValue)
			{
				this.value = this.defaultValue;
				//$(this).prev().fadeTo(500, 0.4);
				//$(this).css({'color' : '#999999'});
			}
			else
			{
				this.value = '';
			}
			$(this).prev().fadeTo(300, 0.3);
		}
		else
		{
			//this.value = '';
		}
	});
	
	// ------------------------------------------------------------------/ FORMS
	
	// IMAGE SWAP --------------------------------------------------------------
	
	// fix: rel is not semantically correct
    $('img.collection, img.flowchart-create').mouseover(function() 
    {
        var temp = $(this).attr('src');
        $(this).attr('src', $(this).attr('rel'));
        $(this).attr('rel', temp);
    }).mouseout(function() 
    {
    	$(this).trigger('mouseover');
    });
    
    $('input.log-in, input.join-us').mouseover(function() 
    {
    	var style = 'transparent url(' + $(this).attr('rel') + ')';
        $(this).css({'background' : style});
    }).mouseout(function() 
    {
    	style = 'transparent url(' + $(this).attr('src') + ')';
        $(this).css({'background' : style});
    });
    
    // -------------------------------------------------------------/ IMAGE SWAP
    
	var hasSlidedDown = false;
	var hasSlidedUp = false;
	var logInClicked = false;
	
	// fix: base on offet of inner elements and state of form
	var formState = 'logIn';

	$('#header p.user').hide();
	
    $('a.log-in').click(function(event)
    {
    	event.preventDefault();
    	
    	logInClicked = true;
    	if(!hasSlidedDown)
    	{
			slide('down', 252);
			hasSlidedDown = true;
		}
		else
		{
			slide('up', 252, 0, 750, 'easeOutBounce', 300, 'easeInCirc');		
			hasSlidedDown = false;
		}
    });
    
    $('#catch-phrase a').click(function(event)
    {
    	event.preventDefault();
    	
    	if(!hasSlidedUp)
    	{
			slide('up', 252, 96);
    		hasSlidedUp = true;
    	}
    });
    
    $('#feed p').click(function(event)
    {
    	event.preventDefault();
    	
    	if(hasSlidedUp)
    	{
    		slide('down', 252, 96, 750, 'easeOutBounce');
    		hasSlidedUp = false;
    	}
    });
    
	var isMenuVisible = false;
	
	bindMenuEvent();
	function bindMenuEvent()
    {
		$('#header a.user').click(function(event)
		{
			event.preventDefault();
			
			if(isMenuVisible == false)
			{
				$('ul#dropdown-menu').css('display' , 'block');
				isMenuVisible = true;
			}
			else if(isMenuVisible == true)
			{
				$('ul#dropdown-menu').css('display' , 'none');
				isMenuVisible = false;
			}
		});
	}
    
    $('a.register').click(function(event)
    {
    	event.preventDefault();
    	
		if(logInClicked  && formState != 'register')
		{
			formState = 'register';
			
			$('form#log-in-register').attr({'name' : 'register', 'action' : '/php/register.php'});
			
			$('input.log-in').hide();
			$('input.join-us').show();
			
			$('#log-in-icons').effect("slide", {'direction' : 'down', 'mode' : 'hide'}, 100, function()
			{
				$('input.email-address').effect("slide", {'direction' : 'up', 'mode' : 'show'}, 120, function()
				{
					$('form#log-in-register img.email-address').show();
				});
			});
		}
		else if(logInClicked && formState == 'register')
		{	
			formState = 'logIn';
			
			$('form#log-in-register').attr({'name' : 'register', 'action' : '/php/log_in.php'});
			
			$('input.log-in').show();
			$('input.join-us').hide();
			
			$('form#log-in-register img.email-address').hide();
			$('input.email-address').effect("slide", {'direction' : 'up', 'mode' : 'hide'}, 120, function()
			{
				$('#log-in-icons').effect("slide", {'direction' : 'down', 'mode' : 'show'}, 100); 
			});
		}		
    });
    
    $('h1').click(function()
    {
    	$('#feed p').append('val: ' + $('input.email-address').val());
    });

	// LOG IN FORM -------------------------------------------------------------
	
	$('input.log-in, input.join-us').click(function()
	{
		var username = $('input.username').val();
		var password = $('input.password').val();
		var emailAddress = $('input.email-address').val();
	
		var url = '/php/log_in.php';
		var dataString = 'username=' + username + '&password=' + password;
		
		if(formState == 'register')
		{
			url = '/php/register.php';
			dataString += '&emailAddress=' + emailAddress;
		}
		
		//alert(dataString);
		
		var url
		
		$.ajax(
		{
			type:		"POST",
			url:		url,
			data:		dataString,
			cache:		false,
			success:	function(response)
			{

    			alert(response);
			},
			complete:	function()
			{
				if(formState == 'logIn')
				{
					$('#header p.account').html('<a href = "" class = "user">Your account</a>');
					$('ul#dropdown-menu div.dropdown-profile b').text(username);
					bindMenuEvent();
				}
			},
			error:		function(xhr) 
			{
       			alert('Error!  Status = ' + xhr.status);
     		}
			//beforeSend:	$('ul#navigation li a.sign-in').html('Loading...'),
		});
		
		// cancel the submit button default behaviours
		return false;
	});
	
	// ------------------------------------------------------------/ LOG IN FORM
	
	// PROFILE -----------------------------------------------------------------
	
	$('#input.save-profile').click(function()
	{
		var currentPassword = $('input.current-password').val();
		var newPassword = $('input.new-password').val();
		var emailAddress = $('input.email-address').val();
	
		var url = '/php/save_profile.php';
		var dataString = 'username=' + username + '&password=' + password;
		
		if(formState == 'register')
		{
			url = '/php/register.php';
			dataString += '&emailAddress=' + emailAddress;
		}
		
		//alert(dataString);
		
		var url
		
		$.ajax(
		{
			type:		"POST",
			url:		url,
			data:		dataString,
			cache:		false,
			success:	function(response)
			{

    			alert(response);
			},
			complete:	function()
			{
				if(formState == 'logIn')
				{
					$('#header p.account').html('<a href = "" class = "user">You</a>');
					$('ul#dropdown-menu div.dropdown-profile b').text(username);
					bindMenuEvent();
				}
			},
			error:		function(xhr) 
			{
       			alert('Error!  Status = ' + xhr.status);
     		}
			//beforeSend:	$('ul#navigation li a.sign-in').html('Loading...'),
		});
		
		// cancel the submit button default behaviours
		return false;
	});
	
	// ----------------------------------------------------------------/ PROFILE
	
	function slide(direction, offset, height, innerEasingSpeed, innerEasing, outerEasingSpeed, outerEasing)
	{
		// default parameters
		if(height == undefined)				height = 0;
		if(innerEasingSpeed == undefined)	innerEasingSpeed = 300;
		if(innerEasing == undefined)		innerEasing = 'easeOutCirc';
		if(outerEasingSpeed == undefined)	outerEasingSpeed = 300;
		if(outerEasing == undefined)		outerEasing = 'easeOutCirc';
		
		if(direction == 'up')
		{
			_offset = '-=' + offset + 'px';
			_height = '+=' + height + 'px';
		}
		else if(direction == 'down')
		{
			_offset = '+=' + offset + 'px';
			_height = '-=' + height + 'px';
		}
		 
		$('#main > *').animate(
		{
			top: _offset
		},
		innerEasingSpeed,
		innerEasing,
		function()
		{
			// animation done
		});
		
		$('#main').animate(
		{
			height: _height
		},
		outerEasingSpeed,
		outerEasing,
		function()
		{
			//	animation done
		});
	}
});
