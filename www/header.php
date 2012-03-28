<body>
	<div id = "fixed-header">
		<p>This is an open-source project under development. Please visit our code repository and contribute to our work! Welcome 
		<?php 
		if(isset($_POST['username'], $_POST['password']))
		{
			session_start();
	
			$username = $_POST['username'];
			$password = md5($_POST['password']);
	
			$sql = "SELECT * FROM users WHERE username = :username AND password = :password";
			$connection = connect();
			$statement = $connection->prepare($sql);
			try
			{
				$statement->bindValue(':username', $username, PDO::PARAM_STR);
				$statement->bindValue(':password', $password, PDO::PARAM_STR);
				$statement->execute();
			}
			catch(PDOException $e)
			{
				disconnect($connection);
				echo 'Query failed: ' . $e->getMessage();
			}
	
	
			if($statement->rowCount() == 1)
			{
				$row = $statement->fetchAll();

				$_SESSION['username'] = $username;
				$_SESSION['isLoggedIn'] = 1;
				
				disconnect($connection);
			}
			else
			{
				disconnect($connection);
			}
		

	
			// if element not found or user no longer exists
			// show regular page
	
			// else if
	
			// profile view
		}
		if(isLoggedIn())
		{
			echo $_SESSION['username'];
		}
		else
		{
			echo 'guest';
		}
		
		?>	
		!</p>
		<ul id = "links">
			<li><a href = "http://flowur.blogspot.com">Blog</a></li>
			<li><a href = "https://github.com/alexfreska/Flowur/blob/master/README">Wiki</a></li>
			<li><a href = "https://github.com/alexfreska/Flowur">GitHub</a></li>
		</ul>
	</div> <!-- /fixed-header -->

	<div class = "wrap group">
		<div id = "header" class = "group">
			<a href = "#"><h1><em>*</em>flowur</h1></a>
			<div id = "sign-in">
				<form action = "" method = "post">
					<p>Sign in through us or <a href = "#">Facebook</a>. Not a member? <a href = "#">Join for free</a>.
					<fieldset>
							<input id = "username" type = "text" name = "username" placeholder = "Username" />
							<input id = "password" type = "password" name = "password" placeholder = "Password" />
							<input class = "submit" type = "submit"  value = "Sign in" />
							<div id = "keep-me">
								<input type = "checkbox" name = "keep-me" />
								<label for = "keep-me" class = "keep-me">Keep me signed in</label>
							</div>
							<input class = "action" type = "hidden" name = "action" value = "sign-in" /> 
					</fieldset>
				</form>
			</div>
			<ul id = "navigation">
					
						<li><a class = "sign-in" href = "#">Sign in</a></li>
						<li><a class = "learn" href = "#">Learn</a></li>
						<li><a class = "browse" href = "#">Browse</a></li>
						<li><a class = "create" href = "#">Create</a></li>
			</ul>
		</div> <!-- /header -->
