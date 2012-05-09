<?php

session_start();

$title = 'Flowur';
$pageId = 'profile';

include($_SERVER['DOCUMENT_ROOT'] . '/php/membership.php');
include($_SERVER['DOCUMENT_ROOT'] . '/databases/accounts.php');
include($_SERVER['DOCUMENT_ROOT'] . '/top.php');					
include($_SERVER['DOCUMENT_ROOT'] . '/header.php');

?>
        <div id = "main" class = "group">
        	<ul>
        		<li><a href = "">basic</a></li>
        		<li><a href = "">privacy</a></li>
        		<li><a href = "">notifications</a></li>
        		<li><a href = "">security</a></li>
        	</ul>
        		
        	<h2>Basic</h2>
        	<form id = "edit-account" name = "edit-account" method = "" action = "">
        		<fieldset>
                        <label for = "username">Username</label>
                        <input class = "username" type = "text" name = "username" placeholder = "<?php echo $_SESSION['username']; ?>" disabled = "disabled" />
                        
                        <label for = "email-address">Email address</label>
                        <input class = "email-address" type = "text" name = "emailAddress" placeholder = "<?php echo $_SESSION['emailAddress']; ?>" />
                        
                   		<label for = "new-password">New password</label>
                        <input class = "new-password" type = "password" name = "new-password" />
                        <label for = "confirm-password">Confirm password</label>
                        <input class = "confirm-password" type = "password" name = "confirm-password" />
                        
                        <input class = "save-profile" type = "submit" name = "submit" value = "Save changes" alt = "Save changes">
                        
                        <a class = "deactivate-account" href = "">Deactivate my account</a>
                        <p>Not registered? Join now.</p>
                </fieldset>
            </form>
            <h3>Linked accounts</h3>
            <table>
            	<thead>
            		<tr>
            			<td colspan = "5">These logins grant access to flowur's special features, just a normal account would; add as mant as you need</td>
            		</tr>
            	</thead>
		        <tbody>
		        	<tr>
		        		<td colspan = "2">
		        		<b>Facebook</b>
		        		</td>
		        		<td>last used</td>
		        		<td colspan = "2"></td>
		        	</tr>
		        	<tr>
		        		<td>icon</td>
		        		<td>Brian Le</td>
		        		<td>10 minutes ago</td>
		        	</tr>
		        </tbody>
		        <tbody>
		        	<tr>
		        		<th colspan = "5">
		        		<a title = "some link info" href = "">add more logins</a>
		        		</th>
		        	</tr>
		        </tbody>
            </table>
            <h2>Privacy</h2>
            <form id = "" name = "" method = "" action = "" />
            	<fieldset>
            		<label for = "">
            			<input class = "" type = "checkbox" name = "" title = "" />
            			Automatically make my flowcharts open to the public.
            		</label>
            	</fieldset>
            </form>
            <h2>Notifications</h2>

            <form id = "notifications" name = "notifications" method = "" action = "" />
            	<fieldset>
            		            <p>Send me an email when...</p>
            		<label for = "">
            			<input class = "" type = "checkbox" name = "flowchart-comment" title = "Someone comments on my flowchart" checked = "checked">
            		Someone comments on my flowchart.
            		</label>
            		<label for = "">
            			<input class = "" type = "checkbox" name = "" title = "" checked = "checked">
            		Someone tags my flowchart.
            		</label>
            		<label for = "">
            			<input class = "" type = "checkbox" name = "" title = "">
            		My flowchart reaches an additional <input class = "" type = "text" name = "" title = "" value = "100" /> views.
            		</label>
            		<label for = "">
            			<input class = "" type = "checkbox" name = "" title = "" checked = "checked">
            		My flowchart is shared on another site.
            		</label>
            	</fieldset>
            	<fieldset>
            		<p>Send me an email when...</p>
            		<label for = "">
            			<input class = "" type = "checkbox" name = "" title = "" checked = "checked">
            			Flowur reaches beta.
            		</label>
            		<label for = "">
            			<input class = "" type = "checkbox" name = "" title = "" checked = "checked">
            			New features are added.
            		</label>
            	</fieldset>
            </form>
            <p class = "to-do">You can set these settings for a particular chart through the flowchart manager</p>
            <h2>Security</h2>
            <form id = "notifications" name = "" method= "" action = "">
            	<fieldset>
            	<p>Automatically log me out...</p>
            		<label for = "">
            			<input class = "" type = "checkbox" name = "" title = "" checked = "checked">
            			after <input class = "" type = "text" name = "" value = "14" /> days of inactivity.
            		</label>
            		<label for = "">
            			<input class = "" type = "checkbox" name = "" title = "" checked = "">
            			whenever I close my Internet browser.
            		</label>
        		</fieldset>
        	</form>
        	<p class = "to-do"> <b>TO DO</b>, account status, confirmation box with password, account sessions, adult content filter</p>
       	</div>
        <?php 

        include($_SERVER['DOCUMENT_ROOT'] . '/bottom.php');

        ?>
    </div> <!-- /wrap -->
</body>

</html>
