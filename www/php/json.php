<?php

session_start();

include($_SERVER['DOCUMENT_ROOT'] . '/databases/flowcharts.php');

storeJSON();

function storeJSON()
{	
	$title = $_POST['title'];
	$data = $_POST['data'];
	
	$connection = connect();
	
	$sql = "INSERT INTO flowcharts(title, data) VALUES(:title, :data)";
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':title', $title, PDO::PARAM_STR);
		$statement->bindValue(':data', $data, PDO::PARAM_STR);
		
		if($statement->execute())
		{
			echo "JSON store successful \n";
		}
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
}
	disconnect($connection);

?>
