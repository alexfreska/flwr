<?php

session_start();
$_SESSION = array();
session_destroy();

?>

<meta http-equiv = "refresh" content="0;/index.php">
