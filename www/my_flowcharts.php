<?php

session_start();

$title = 'Flowur';
$pageId = 'profile';

include($_SERVER['DOCUMENT_ROOT'] . '/php/membership.php');
include($_SERVER['DOCUMENT_ROOT'] . '/databases/accounts.php');
include($_SERVER['DOCUMENT_ROOT'] . '/top.php');					
include($_SERVER['DOCUMENT_ROOT'] . '/header.php');

?>
        <div id = "main" class = "group">
        	<h2>My flowcharts</h2>
        </div>
        <?php 

        include($_SERVER['DOCUMENT_ROOT'] . '/bottom.php');

        ?>
    </div> <!-- /wrap -->
</body>

</html>
