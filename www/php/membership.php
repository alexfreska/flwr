<?php

session_start();

function isLoggedIn()
{
	if(isset($_SESSION['isLoggedIn'], $_SESSION['username']))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function isLoggingIn()
{
	if(isset($_POST['username'], $_SESSION['password']))
	{
		return true;
	}
	else
	{
		return false;
	}
}

?>
