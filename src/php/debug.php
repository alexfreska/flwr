<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/flowur.php');

	

	$user = "";
	$pass = '';
	$first = '';
	$last = '';
	$email = '';
	//addUser($user, $pass, $first, $last, $email);

	addChart('trucks222s','datatatfafew',16);

	//getUserCharts(1);
	//publishChart(1,1,1);//userId,tempId,chartId
	//getUserPubs(1);
	echo "<br><br>";
	getTemplatesForAChart(1,1);
	//getTemplates();

?>
