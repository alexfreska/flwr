<?php

include($_SERVER['DOCUMENT_ROOT'] . '/php/membership.php');
include($_SERVER['DOCUMENT_ROOT'] . '/databases/accounts.php');
// create login class?

// USER AUTHENTICATION
// check if any values are empty
// on login display confirmation
/*
if(!isLoggedIn() && isLoggingIn())
{
	logIn();
}
*/

logIn();

function logIn()
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

?>
