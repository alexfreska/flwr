<?php
////////////////////////////////////////////////////////////////////////////////////////
//Title:flowur.php								      //
//Database related functions.							      //
//I will be revising all of these one at a time to make sure they are done properly.  //
//										      //
//										      //
////////////////////////////////////////////////////////////////////////////////////////
function connect()
{
	try 
	{
		// PHP data object
		$connection = new PDO('mysql:host=localhost;dbname=**FILLIN**', '**USERNAME**', '**PASSWORD**');	
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


function addUser($username,$password,$firstName,$lastName,$email)
{


	//check for conflicting username

		$sql = "SELECT username FROM users WHERE username= :username";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':username', $username, PDO::PARAM_STR);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
	
		$row = $statement->fetch();

		if($row['username'])
		{
			print $row['username'] . " is already in use.<BR>";
			return;
		}
		disconnect($connection);

	//check for conflicting email

		$sql = "SELECT email FROM users WHERE email = :email";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':email', $email, PDO::PARAM_STR);

			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
		$row = $statement->fetch();

		if ($row['email'])
		{
			print $row['email'] . " is already in use.<BR>";
			return;
		}
		disconnect($connection);
	

		$sql = "INSERT INTO users(username, password, firstName, lastName, email) VALUE (:username,:password,:firstName,:lastName,:email)";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':username', $username, PDO::PARAM_STR);
			$statement->bindValue(':password', $password, PDO::PARAM_STR);
			$statement->bindValue(':firstName', $firstName, PDO::PARAM_STR);
			$statement->bindValue(':lastName', $lastName, PDO::PARAM_STR);
			$statement->bindValue(':email', $email, PDO::PARAM_STR);

			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
		print "User added to the database";
		disconnect($connection);
	
}

function addChart($title,$data,$userId) 
//NEED TO FIGURE OUT PROPER WAY OF ADDING TO CHARTS AND USERCHART ASSOC TABLE
//function does not test for a non existant userId number
//
//
{

	//check for conflicting chart title amongst users charts
		if(conflictingChartTitle($title,$userId)==1)
		{
		return;
		}

//next add chart to database in 'charts' table and 'userChartAssoc' table

	//first add chart to 'charts' table
		$sql = "INSERT INTO charts(title,data) VALUE (:title,:data)";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':title',$title, PDO::PARAM_STR);
			$statement->bindValue(':data',$data, PDO::PARAM_STR);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
		print "The chart was added to your collection.";
		disconnect($connection);

	//get the chart id NOT BEST METHOD BECAUSE SQL QUERY COULD RETURN OTHER DUPLICATE CHARTS
		$sql = "SELECT id FROM charts WHERE title = :title AND data = :data";
		$connection = connect();		
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':title',$title, PDO::PARAM_STR);
			$statement->bindValue(':data',$data, PDO::PARAM_STR);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
		$row = $statement->fetchAll();
		echo "<br>".$row[sizeof($row)-1]['id']."<br>";

		disconnect($connection);
	//next add new charts chartId + userId TO ASSOC TABLE ????NEED CHART ID
	

		$sql = "INSERT INTO userChartAssoc(userId,chartId) VALUE (:userId,:chartId)";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':userId',$userId, PDO::PARAM_INT);
			$statement->bindValue(':chartId',$row[sizeof($row)-1]['id'], PDO::PARAM_INT);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
		disconnect($connection);
	

}

function getUserCharts($userId)
{
	//scan userChartAssoc table for user id 
	$sql = "SELECT chartId FROM userChartAssoc WHERE userId = :userId";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':userId',$userId,PDO::PARAM_INT);
		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}

	//create array
	$arr = $statement->fetchAll();

	disconnect($connection);

	//for each chartId display title in list, connect each time
	foreach($arr as $val)
	{
		$sql = "SELECT title FROM charts WHERE id = :val";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':val',$val['chartId'],PDO::PARAM_INT);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
		$row = $statement->fetch();
		disconnect($connection);
		echo "<br>Title:	".$row['title']."<br>";


	}
	return;
}

function getUserPubs($userId)
{
	//scan published for userId 
		$sql = "SELECT chartId,templateId FROM published WHERE userId = :userId";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':userId',$userId,PDO::PARAM_INT);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
		
	//create array of ids
		$arr = $statement->fetchAll();
		disconnect($connection);

	//get associated chartId and templateId
		foreach($arr as $value)
		{
			$chartId = $value['chartId'];
			$templateId = $value['templateId'];
			
			$sql = "SELECT * FROM published WHERE id = :value";
			$connection = connect();
			$statement = $connection->prepare($sql);
			try
			{
				$statement->bindValue(':value',$chartId,PDO::PARAM_INT);
				$statement->execute();
			}
			catch(PDOException $e)
			{
				disconnect($connection);
				echo 'Query failed: ' . $e->getMessage();
			}
			$row = $statement->fetch();
			disconnect($connection);
			//get chartId's associated name
			//get template Id's associated name
			$template = getTemplateInfo($row['templateId']);

			$chartTitle = getChartTitle($chartId);
			$templateInfo = getTemplateInfo($templateId);

			echo "Title:	".$chartTitle."<br>Published With:	".$templateInfo['title']."<br><br>";
		}	
	//get associated template
}
function publishChart($userId,$templateId,$chartId)
{
//***
//this section may not be necessary since getTemplatesForAChart() will retrieve whether or not a chart has been
//published with a template, and therefore the website would not give the option to republish with identical options	

	$sql = "SELECT * FROM published WHERE userId = :userId AND templateId = :templateId AND chartId = :chartId";
	$connection = connect();
	$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':userId',$userId,PDO::PARAM_INT);
			$statement->bindValue(':templateId',$templateId,PDO::PARAM_INT);
			$statement->bindValue(':chartId',$chartId,PDO::PARAM_INT);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
		$row = $statement->fetch();
		if($row)
		{
		disconnect($connection);
		echo "You have already published this chart using the selected template.<br><br>";
		return;
		}
//end of section
//***		

	$sql = "INSERT INTO published(userId,templateId,chartId) VALUE (:userId,:templateId,:chartId)";
	$connection = connect();
	$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':userId',$userId,PDO::PARAM_INT);
			$statement->bindValue(':templateId',$templateId,PDO::PARAM_INT);
			$statement->bindValue(':chartId',$chartId,PDO::PARAM_INT);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
		disconnect($connection);
}
function getTemplateInfo($templateId)
{
	$sql = "SELECT title,info FROM templates WHERE id = :id";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':id',$templateId,PDO::PARAM_INT);
		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
	$row = $statement->fetch();
	disconnect($connection);
	return $row;
}
function getTemplateFile($templateId)
{
	$sql = "SELECT file FROM templates WHERE id = :id";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':id',$templateId,PDO::PARAM_INT);
		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
	$row = $statement->fetch();
	$file = $row['file'];
	disconnect($connection);
	return $file;
}
function getChartTitle($chartId)
{
	$sql = "SELECT title FROM charts WHERE id = :id";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':id',$chartId,PDO::PARAM_INT);
		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
	$row = $statement->fetch();
	$data = $row['title'];
	disconnect($connection);
	return $data;
}
function getChartData($chartId)
{
	$sql = "SELECT data FROM charts WHERE id = :id";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':id',$chartId,PDO::PARAM_INT);
		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
	$row = $statement->fetch();
	$data = $row['data'];
	disconnect($connection);
	return $data;
}
function getTemplates()
//list of all templates
{
	//scan published for userId AND chartId retrieving used templates
	$sql = "SELECT * FROM templates";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
	//make list of templates
	$list = $statement->fetchAll();
	disconnect($connection);
	foreach($list as $row)
	{
		echo "Title: ".$row['title']."	<br>Info: ".$row['info']."<br><br>";
	}
}
function getTemplatesForAChart($userId,$chartId)
//function retrieves whether or not chart has been published with each template
{
	//scan published for userId AND chartId retrieving used templates
	$sql = 
	"
	SELECT templates.id, templates.title, templates.info, pubs.id
	FROM templates
	LEFT JOIN (SELECT * FROM published WHERE published.chartId = :chartId) pubs
	ON templates.id = pubs.templateId
	";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':chartId',$chartId,PDO::PARAM_INT);
		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
	//make list of used templates
	$list = $statement->fetchAll();
	disconnect($connection);
	if(!$list)
	{
		echo "error";
		return;
	}
	foreach($list as $item)
	{
	$status = "Publish";
	if($item[3]){$status = "Already Published";}
	$title = $item[1];
	$info = $item[2];

	echo "Template Name: ".$title."<br>Info: ".$info."<br>[".$status."]<br><br>";

	}
}
function alreadyPublished($list,$templateId)
{
	foreach($list as $row)
	{
		if($row[0]==$templateId)
			return 1;
	}
	return 0;
}

function conflictingChartTitle($title,$userId)
//checks if the user already has a chart with the requested title
{
	//check for conflicting chart title
	$sql = "SELECT chartId FROM userChartAssoc WHERE userId = :userId";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':userId', $userId, PDO::PARAM_INT);
		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
	$chartIdList = $statement->fetchAll();
	disconnect($connection);
	foreach($chartIdList as $row1)
	{
		//echo $row1['chartId']."\n";

		$sql = "SELECT title FROM charts WHERE id = :chartId";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':chartId', $row1['chartId'], PDO::PARAM_INT);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo 'Query failed: ' . $e->getMessage();
		}
			$row = $statement->fetch();
			//echo "<br>>>>".$row['title']."<br>";
			//echo $title."<br>";
		if ($row['title'] == $title)
		{
			print $row['title'] . " is already in use.<BR>";
			return 1;
		}
		disconnect($connection);
	}
	disconnect($connection);
	return 0;
}


function userExists($userId)
{
	$sql = "SELECT id FROM users WHERE id = :id";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':id',$userId,PDO::PARAM_INT);
		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
	
	$row = $statement->fetch();
	disconnect($connection);
	if($row)
	return 1;
	return 0;
}

?>
