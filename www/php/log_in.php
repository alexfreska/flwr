<?php

//session_start();

include($_SERVER['DOCUMENT_ROOT'] . '/php/membership.php');
include($_SERVER['DOCUMENT_ROOT'] . '/databases/accounts.php');
// create login class?

logIn();

function logIn()
{	
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
		$row = $statement->fetch();

        $_SESSION['username'] = $row['username'];
       	$_SESSION['emailAddress'] = $row['emailAddress'];
        $_SESSION['isLoggedIn'] = 1;
        
        echo "Log in successful. \n";
        echo 'Welcome ' . $username . "\n";
        
        disconnect($connection);
    }
    else
    {
    	disconnect($connection);
    }
}

?>
