;(function(){
//	sloppy, spontaneous ui code goes here
$(window).load(function(event) {
	var windowHeight = $(window).height();

	var progressBarWidth = $('.titles').width();
	$('.bar-container').css('width', progressBarWidth);

	var inputPhase = $('#phase-input');
	var height = $('#scrolling-bar').outerHeight();
	$('#phase-input').css('margin-top', height);
	inputPhase.css('height', windowHeight - height);
	$('#phase-visualize').css('height', windowHeight - height);
	$('#phase-share').css('height', windowHeight - height);

	var w = $(window);
	var wi = w.width();
	var he = w.height();
	var swi = wi * .75;
	var she = he * .5;

	var share = $('#share-container');
	share.css({
		'width'		: swi,
		'height'	: she,
		'top'		: he / 2 - she / 2,
		'left'		: wi / 2 - swi / 2
	});


	$('#share-chart').on('change', function(){
		var output = $('#container').html();
		canvg('blank-canvas', output, {
			'ignoreDimensions'	: false
		});
		console.log(output);
		var canvas = document.getElementById('blank-canvas');
		var img = canvas.toDataURL('image/png');
		$('#share-option').html('<img src = "' + img + '" />'); 
	});
});

$(window).on({
	resize:	function(event) {
	}
});
})();
