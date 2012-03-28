<?php

/*
global $server, $db, $dsn, $username, $password;
$server		= '127.0.0.1';
$db			= 'accounts';
// MYSQL data source name; http://us3.php.net/manual/en/ref.pdo-mysql.connection.php
$dsn		= 'mysql:host=127.0.0.1;dbname=accounts';								
$username	= 'root';
$password	= 'flowur';
*/

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

