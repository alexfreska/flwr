<?php	

// Create an output buffer. This prevents PHP from sending content to the browser
// until the content has loaded completely and offers us other conveniences.
// ob_start();

function connect()
{
	try 
	{
		// PHP data object
		$connection = new PDO($dsn, $username, $password);	
		$connection->setAttribute(PDO::ATTR_PERSISTENT, true);					
		$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		return $connection;
	} 
	catch (PDOException $e)
	{
		echo "Connection failed: " . $e->getMessage();
	}
	
	return $connection;
}
	
function disconnect($connection)
{
	$connection = '';
}

?>
