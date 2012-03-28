$(document).ready(function()
{
	// CLOSURED VARIABLES --------------------------------------------------
	
	var $isVisible = false;
	$('#sign-in').hide();
	
	$('ul#navigation .sign-in').click(function()
	{
		if($isVisible == false)
		{
			$('#sign-in').show();
			$isVisible = true;
		}
		else
		{
			$('#sign-in').hide();
			$isVisible = false;
		}
	})
	
	//#('ul#navigation .sign-in').toggle($('#sign-in').show(), $('sign-in').hide());
	
	var $isExpanded = true;
	
	// -------------------------------------------------/ CLOSURED VARIABLES
		
	// slide up/down
	// BUG: .not() is not working, pun not intended
	$('#fixed-header').not('p').click(toggleSlide);

	function toggleSlide()
	{
		if($isExpanded == false)
		{
			$(this).animate({height: '+=30px'}, 250, function()
			{
				$('#fixed-header p').show();
				$('#links').show();
			})
			
			$isExpanded = true;
		}
		else
		{
			$(this).animate({height: '-=30px'}, 250, function()
			{
				$('#fixed-header p').hide();
				$('#links').hide();

			})
			
			$isExpanded = false;
		}
	}
	
	// FLOWCHART SLIDER APPLET ---------------------------------------------
	
	// array of images
	// FEATURE: fetch images with PHP, 36 images total for 36 full-sized slides, 9 quarter-sized slides, and 4 nano-sized slides
	
	var $count = $('#slider').attr("data-count");
	
	//$('ul#slider li:even').css('margin-right', '6px');
	//$($ul + 'li:nth-child(' + $mode + ' + ' + $mode + 'n').after('</div');
	
	
	
	/*
	{
		click: function(event) 
		{
		 // handle clicks  
		},
		mouseenter: function(event)
		{ // handle mouseenters
		},
		mouseleave: function(event)
		{ // handle mouseleaves
		}		
	});
	
	$.noop();
	*/
	
	// --------------------------------------------/ FLOWCHART SLIDER APPLET
	
	// LOGIN FORM ----------------------------------------------------------
	/*
	$('.submit').click(function()
	{
		$username = $('#username').val();
		$password = $('#password').val();
		
		$.ajax(
		{
			type:		"POST",
			url:		"/php/signin.php",
			data:		"username="+$username+"&password="+$password,
			success:	$('ul#navigation li a.sign-in').html('Sign out'),
			//beforeSend:	$('ul#navigation li a.sign-in').html('Loading...'),
		})
	});
	*/
	
	// ---------------------------------------------------------/ LOGIN FORM
});
