<?php
////////////////////////////////////////////////////////////////////////////////////////
//Title:flowur.php								      //
//Database and testing related functions.							      //
//I will be revising all of these one at a time to make sure they are done properly.  //
//										      //
//										      //
////////////////////////////////////////////////////////////////////////////////////////

include_once($_SERVER['DOCUMENT_ROOT'] . '/uniqueId.php');

function connect()
{
	try 
	{
		// PHP data object
		$connection = new PDO('mysql:host=localhost;dbname=', '', '');	
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





///////////////////
///Add functions///
///////////////////





function addUser($username,$password,$firstName,$lastName,$email)
{

		
	//check for conflicting username
		if(conflictingUsername($username))
		{
		print $username . " is already in use.<BR>";
		return;
		}

	//check for conflicting email
		if(conflictingEmail($email))
		{
		print $email . " is already in use.<BR>";
		return;
		}


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
		if(conflictingChartTitle($title,$userId))
		{
		print $title . " is already in use.<BR>";
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





////////////////////////
///Get List functions///
////////////////////////





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
//function retrieves all templates whether or not the chart has been published with the template
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
	
	//temporary!!
	$chartTitle = getChartTitle($chartId);
	echo "Working With your chart:	".$chartTitle."<br><br>";
	echo "Pick a template:<br><br>";

	if(!$list)
	{
		echo "none";
		return;
	}
	foreach($list as $item)
	{
	$status = "Publish";
	if($item[3]){$status = "Already Published]<br>[Click for link";}
	$title = $item[1];
	$info = $item[2];

	echo "Template Name: ".$title."<br>Info: ".$info."<br>[".$status."]<br><br>";

	}
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

function getUserChartsWithPubs($userId,$username)
{
	//scan userChartAssoc table for user id 
	$sql = 
	"
	SELECT userChartAssoc.chartId,charts.title
	FROM userChartAssoc 
	LEFT JOIN charts
	ON userChartAssoc.chartId = charts.id
	WHERE userChartAssoc.userId = :userId
	"
	;
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

	//create array of chartId,title
	$list = $statement->fetchAll();

	disconnect($connection);


	//print title block
	echo "User: ".$username."<BR><BR>";
	echo "My Charts<br><br>";


	foreach($list as $chart)
	{
		echo "____________________________<br>";
		echo $chart['title']."<br>";
		getPubsForChart($chart['chartId']);	

	}

	return;
}

function getUserPubs($userId)
{

	echo "USER:	".$userId."<br>";
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

			$chartTitle = getChartTitle($chartId);
			$templateInfo = getTemplateInfo($templateId);

			echo "Title:	".$chartTitle."<br>Published With:	".$templateInfo['title']."<br><br>";
		}	

}

function getPubsForChart($chartId)
//userId could be found with chartId
{

	//scan published for chartId 
		$sql = "SELECT id,templateId FROM published WHERE chartId = :chartId";
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
		
	//create array of ids
		$arr = $statement->fetchAll();
		disconnect($connection);



	//check if there are any publications
		if(!$arr)
		{
		echo "Not Yet Published!<BR><BR>";
		return;
		}

	//get templateId info

		foreach($arr as $value)
		{
		//user the template's id to gather info
			$templateId = $value['templateId'];
			$templateInfo = getTemplateInfo($templateId);

		//grab the publication id
			$pubId = $value['id'];
						//temporarily makes things more interesting
							$pubId += rand();
		//make address out of the id
			$address = makeUrlExtension($pubId);

			
			echo "Published With:	".$templateInfo['title']."<br>";
			echo "[Link: flowur.me/".$address."]<br><br>";
		}	


}




///////////////////////
///Utility functions///
///////////////////////







function getTemplateInfo($templateId)
//returns title and info in an array as [0] and [1]
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
	disconnect($connection);
	$file = $row['file'];

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
	disconnect($connection);
	$data = $row['title'];

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
	disconnect($connection);
	$data = $row['data'];

	return $data;
}






///////////////////
//Check functions//
///////////////////





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
{

	$sql =
	"
	SELECT charts.title
	FROM charts
	RIGHT JOIN userChartAssoc
	ON charts.id = userChartAssoc.chartId
	WHERE userChartAssoc.userId = :userId AND charts.title = :title
	";
	$connection = connect();
	$statement = $connection->prepare($sql);
	try
	{
		$statement->bindValue(':userId', $userId, PDO::PARAM_INT);
		$statement->bindValue(':title', $title, PDO::PARAM_STR);

		$statement->execute();
	}
	catch(PDOException $e)
	{
		disconnect($connection);
		echo 'Query failed: ' . $e->getMessage();
	}
	$all = $statement->fetch();
	disconnect($connection);

	//echo sizeof($all)."<BR>";
	//works, but why is sizeof($all) == 2 and not 1?


	if($all)
	{
		return 1;
	}
	return 0;
	
}

function conflictingUsername($username)
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
		disconnect($connection);
		if($row)
		{
			return 1;
		}
		return 0;
}
function conflictingEmail($email)
{


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
		disconnect($connection);
		if ($row)
		{
			return 1;
		}
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
	{
		return 1;
	}
	return 0;
}


?>
