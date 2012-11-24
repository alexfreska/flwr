<!doctype html>
<html lang = "en">
<head>
	<!-- meta tags here -->
	<meta charset = "utf-8" />

	<!-- advanced typekit code later -->
	<script type="text/javascript" src="//use.typekit.net/yxz0qgs.js"></script>
	<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
	<script data-type = "js/main" src = "lib/require.js"></script>
	<script src = "../../lib/jquery-1.7.2.js"></script>
	<script src = "../../lib/raphael.js"></script>
	<script src = "../../lib/underscore-min.js"></script>
	<script src = "../../lib/json2.js"></script>
	<script src = "../../lib/backbone-min.js"></script>
	<script src = "../../lib/jquery.zoomooz.js"></script>
	<script src = "http://canvg.googlecode.com/svn/trunk/rgbcolor.js"></script> 
	<script src = "http://canvg.googlecode.com/svn/trunk/canvg.js"></script> 
	<script src = "ui.js"></script>
	<script src = "demo.js"></script>
	<link rel = "stylesheet" href = "../../css/reset.css" media = "screen, projection" type = "text/css" />
	<link rel = "stylesheet" href = "demo.css" media = "screen, projection" type = "text/css" />
	<link rel = "stylesheet" href = "ui.css" media = "screen, projection" type = "text/css" />

	<title>A Flowur demo.</title>
</head>
<body>
	<!-- templates (load from an outside source later) -->
	<script type = "text/template" class = "node-template">
		<div class = "node" contenteditable = "true"></div>
	</script>
	<script type = "text/template" class = "layout-menu-template">
	</script>
	<script type = "text/template" class = "style-menu-template">
	</script>

	<div id = "scrolling-bar">
		<div id = "progress">
			<ul class = "titles">
				<li>Input</li>
				<li>Visualize</li>
				<li>Share</li>
			</ul>
			<div class = "bar-container">
				<div class = "bar-fill">
				</div>
			</div>
		</div>
	</div>
	<button id = "toggle-settings"></button>
	<div class = "zoomViewPort">
		<div class = "zoomContainer">
			<div id = "phase-input">
				<div id = "settings-menu"></div>
			</div>
		</div>
	</div>
	<div id = "phase-visualize">
		<button id = "toggle-layout"></button>
		<button id = "toggle-style"></button>
		<div id = "wrapper">
			<div id = "visualize-preview"></div>
		</div>
	</div>
	<div id = "phase-share">
		<div id = "share-container">
			<div id = "share-option"></div>
			<div id = "share-prompt">
				<p>I want to share this by</p>
				<div id = "share-chart-container">
					<select id = "share-chart">
						<option value = "url">permalink</option>
						<option value = "image">saving a picture</option>
						<option value = "code">embedded code</option>
					</select>
				</div>.
			</div>
		</div>
		<canvas id = "blank-canvas" width = "500" height = "500"></canvas>
		<div id = "container"></div>
	</div>
</body>
</html>
