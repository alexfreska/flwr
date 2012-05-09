<?php

//session_start();

function connect()
{
	try 
	{
		// PHP data object
		$connection = new PDO('mysql:host=localhost;dbname=accounts', 'root', 'flowur');	
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

