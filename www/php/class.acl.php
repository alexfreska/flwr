<?php
// access control list
// generates object to hold permissions for a user
class acl
{  
	var $_permissions		= array();	//:array	permissions for the user  
	var $_user_id			= 0;		//:int		the ID of the current user  
	var $_user_roles		= array();	//:array	the roles of the current user  
      
	function __constructor($user_id = '')  
	{  
		if ($user_id != '')  
		{  
			$_user_id = floatval($user_id);  
		}
		else
		{  
			$_user_id = floatval($_SESSION['user_id']);  
		}
		  
		$_user_roles = $this->get_user_roles('ids');  
		$this->build(); 	 
	}
	
	function get_user_roles()
	{
		$sql = "SELECT * FROM 'user_roles' WHERE 'user_id' = " . floatval( . ":_user_id" . ) . " ORDER BY 'add_date' ASC";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':_user_id', $_user_id, PDO::PARAM_STR);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo “Query failed: “ . $e->getMessage();
		}
		
		foreach($statement->fetchAll() as $row)
		{
			$roles[] = $row['role_id'];
		}
		
		disconnect($connection);
		
		return $roles;
	}
	
	function get_all_roles($format = 'ids')
	{
		$format = strtolower($format);
		$sql = "SELECT * FROM 'roles' ORDER BY 'name' ASC";
		$connection = connect();
		$statement->execute();
		
		foreach($statement->fetchAll() as $row)
		{
			if($format == 'full')
			{
				$roles = array(
					'id' => $row['id'],
					'name' => $row['name']
				);
			else
			{
				$roles = $row['id'];
			}
		}
		
		disconnect($connection);
		
		return $roles;
	}
  
	function build()
	{
		// First, get the rules for the user's role.
		if(count($_user_roles_ > 0)
		{
			$_permissions = array_merge($_permissions, $this->get_role_permissions($_user_roles));
		}
		
		// Then, get the individual user permissions.
		$_permissions = array_merge($_permissions, $this->get_user_permissions($_user_id));
	}

	function get_permission_key_from_id($permission_id)
	{
		$sql = "SELECT 'key' FROM 'permissions' WHERE 'id' = " . floatval( . ":permission_id" . ) " LIMIT 1";
		$connection = connect();
		$statement = $connection->prepare($sql);
		try
		{
			$statement->bindValue(':permission_id', $permission_id, PDO::PARAM_STR);
			$statement->execute();
		}
		catch(PDOException $e)
		{
			disconnect($connection);
			echo “Query failed: “ . $e->getMessage();
		}
		
		$rows = $statement->fetchAll();
		disconnect($connection);
	
		return	$rows[0];
	}
  
    function getPermNameFromID($permID)  
    {  
        $strSQL = "SELECT `permName` FROM `permissions` WHERE `ID` = " . floatval($permID) . " LIMIT 1";  
        $data = mysql_query($strSQL);  
        $row = mysql_fetch_array($data);  
        return $row[0];  
    }  
    function getRoleNameFromID($roleID)  
    {  
        $strSQL = "SELECT `roleName` FROM `roles` WHERE `ID` = " . floatval($roleID) . " LIMIT 1";  
        $data = mysql_query($strSQL);  
        $row = mysql_fetch_array($data);  
        return $row[0];  
    }  
    function getUsername($userID)  
    {  
        $strSQL = "SELECT `username` FROM `users` WHERE `ID` = " . floatval($userID) . " LIMIT 1";  
        $data = mysql_query($strSQL);  
        $row = mysql_fetch_array($data);  
        return $row[0];  
    }  
}
?>       
