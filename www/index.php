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

//session_start();

$title = 'Flowur';
$pageId = 'index';

include($_SERVER['DOCUMENT_ROOT'] . '/php/membership.php');
include($_SERVER['DOCUMENT_ROOT'] . '/databases/accounts.php');
include($_SERVER['DOCUMENT_ROOT'] . '/top.php');					
include($_SERVER['DOCUMENT_ROOT'] . '/header.php');

?>
        <div id = "main">
            <div class = "two-column left">
            </div>
            <div class = "two-column right">
                <form id = "log-in-register" name = "log-in" method = "post" action = "log_in.php">
                    <fieldset>
                        <div>
                            <img class = "username" src = "/images/icons/input_username.gif" alt = "" />
                            <input class = "username" type = "text" name = "username" />
                        </div>
                        <div>
                            <img class = "password" src = "/images/icons/input_password.gif" alt = "" />
                            <input class = "password" type = "password" name = "password" />
                        </div>
                        <div>
                            <img class = "email-address" src = "/images/icons/input_email_address.gif" alt = "" />
                            <input class = "email-address" type = "text" name = "emailAddress"  />
                        </div>
                        <input class = "log-in" type = "submit" name = "submit" value = "submit" src = "/images/log_in.png" rel = "/images/log_in_hover.png" alt = "Log in">
                        <input class = "join-us" type = "submit" name = "submit" value = "submit" src = "/images/join_us.png" rel = "/images/join_us_hover.png" alt = "Log in">
                    </fieldset>
                </form>
                <div id = "log-in-icons">
                    <img src = "/images/icons/facebook.png" alt = "Log in with Facebook." />
                    <img src = "/images/icons/twitter.png" alt = "Log in with Twitter." />
                    <img src = "/images/icons/google.png" alt = "Log in with Google." />
                    <img class = "forgot" src = "/images/icons/forgot_password.png" alt = "Forgot your password?" />
                </div>
            </div>
            <div id = "catch-phrase">
		        <p>Easily create and share your flowcharts in like <a href ="#">60 seconds</a>.</p>
		        <form id = "create-chart" class = "jqtransform" action = "" method = "">
		            <fieldset>
		                <input class = "flowchart-title" type = "text" name = "title" tabindex = "1" placeholder = "Enter a flowchart title." />
		                <img class = "flowchart-create" src = "/images/create_chart.png" rel = "/images/create_chart_hover.png" alt = "Create chart" />
		            </fieldset>
		        </form>
            </div>
            <div id = "demo-video">
                <iframe src="http://player.vimeo.com/video/26734344?title=0&amp;byline=0&amp;portrait=0&amp;color=c9ff23" width="512" height="288" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
            </div>
        </div>
        <hr class = "left" /><span class = "or">OR</span><hr class = "right" />
		<div id = "feed" class = "group">
		    <p>Flowchart feed goes here...</p>
		</div> <!-- /feed -->

        <?php 

        include($_SERVER['DOCUMENT_ROOT'] . '/bottom.php');

        ?>
    </div> <!-- /wrap -->
</body>

</html>
