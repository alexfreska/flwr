<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * Homepage for flowur
 *
 * Flowur is a web application for creating and sharing flowcharts.
 *
 * @author		Brian Le
 * @copyright	2012 Alex Freska, Brian Le, Patrick Teague
 * @version		0.0.1 (alpha)
 * @link        http://flowur.me
 * @see         https://rcos.rpi.edu
 * @since		0.0.1
 */

// include($_SERVER['DOCUMENT_ROOT'] . 'databases/accounts.php');					

$title = 'Flowur';

include($_SERVER['DOCUMENT_ROOT'] . '/php/membership.php');
include($_SERVER['DOCUMENT_ROOT'] . '/databases/accounts.php');
include($_SERVER['DOCUMENT_ROOT'] . '/top.php');					
include($_SERVER['DOCUMENT_ROOT'] . '/header.php');

/*
// Is the user logged in with a legitimate username?
if(!empty($_SESSION['isSignedIn']) && !empty($_SESSION['username']()
{
}
// Has the user already submitted their form details?

else if (!empty($_POST['username'] && !empty($_POST['password']))
{
}
else
{
}
*/

?>
		<div id = "main" class = "group">
			<div id = "application" class = "group">
			<p>Test text. Flowcharts are ideal tools for step-by-step visualizations. Start building your own flowcharts with our streamlined and intuitive application and finish them in a ridiculously short amount of time. Don't believe us? <a href = "/php/logout.php">Log out.</a></p>
            <?php
            
            if(!isLoggedIn())
            {
            
            ?>
                <form action = "php/register.php" method = "post">
                <p>Register with us now for free!</p>
                    <fieldset id = "register">
                        <input class = "username" type = "text" name = "username" placeholder = "Username" />
					    <input class = "password" type = "password" name = "password" placeholder = "Password" />
					    <input class = "email" type = "text" name = "emailAddress" placeholder = "Email Address" />
					    <input class = "submit" type = "submit"  value = "Register" />

					    <input class = "action" type = "hidden" name = "action" value = "register" /> 
				    </fieldset>
                </form> 
            
            <?php } ?>
			</div>
		</div> <!-- /main -->
		
		<div id = "secondary" class = "group">
			<div id = "create" class = "four-column">
				<h3>Create with ease</h3>
				<p>Flowcharts are ideal tools for step-by-step visualizations. Start building your own flowcharts with our streamlined and intuitive application and finish them in a ridiculously short amount of time. Don't believe us? <a href = "#">View our demo.</a></p>
			</div>
				<div id = "more" class = "four-column">
				<h3>More than just flowcharts...</h3>
				<p>Make use of innovative ways to customize and interact with your flowcharts. Give them a unique feel and look with just the right amount of settings. When you're done, view your flowcharts as they animate and respond to your inputs.
			</div>
			<div id = "share" class = "four-column">
				<h3>Share / Export / Explore</h3>
				<p>Share any flowchart with others with its unique url. For more flexibility, export the flowchart to another location as an image or embedded HTML. Plus, don't forget to <a href = "#">browse the full collection</a> from our community.</p>
			</div>
			<div id = "join" class = "four-column">
				<h3>Join the community</h3>
				<p><a href = "#">Sign up for a free account</a> so you can store your creations in a single, convenient location and associate them with a username. Also, get access to other features like favoriting, commenting and tagging.</p>
			</div>
		</div> <!-- /secondary -->
	</div> <!-- /wrap -->
    <?php 

    include($_SERVER['DOCUMENT_ROOT'] . '/bottom.php');

    ?>
	<script type = "text/javascript" src = "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type = "text/javascript" src = "https://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js"></script>
	
	<script type = "text/javascript" src = "/js/mootools/hashgrid.js"></script>
	<script type = "text/javascript" src = "/js/script.js"></script>
</body>

</html>

