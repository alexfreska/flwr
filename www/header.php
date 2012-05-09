<?php session_start(); ?>
<body id = "<?php echo $pageId ?>">
	<div id = "header">
		<div id = "header-wrap">
			<h1><a href = "/index.php"><em>*</em>flowur</a></h1>
			<div class = "account">
				<p class = "account">
					<?php if(isLoggedIn()) { ?>
						<a href = "" class = "user">You</a>
					<?php } else { ?>
						<a href = "" class = "log-in">log in</a> or <a href = "" class = "register">register</a>
					<?php } ?>
				</p>
				<ul id = "dropdown-menu">
					<img class = "dropdown-caret" src = "/images/caret.png" alt = "" />
					<li class = "dropdown-profile">
						<a class = "dropdown-profile" href = "/my_flowcharts.php">
							<div class = "dropdown-profile">
								<b><?php echo $_SESSION['username']; ?></b>
								<p><em>0</em></p>
								<p class = "flowcharts">flowcharts</p>
							</div>
						</a>
					</li>
					<li><hr /></li>
					<li><a href = "/profile.php">Settings</a></li>
					<li><a href = "/php/feedback.php">Feedback</a></li>
					<li><a href = "/php/log_out.php">Log out</a></li>
				</ul>
			</div>
		</div>
	
	</div> <!-- /header -->

	<div class = "wrap group">
