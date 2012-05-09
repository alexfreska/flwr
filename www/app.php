<?php

//session_start();

$title = 'Flowur';
$pageId = 'index';

include($_SERVER['DOCUMENT_ROOT'] . '/php/membership.php');
include($_SERVER['DOCUMENT_ROOT'] . '/databases/accounts.php');
include($_SERVER['DOCUMENT_ROOT'] . '/top.php');					
include($_SERVER['DOCUMENT_ROOT'] . '/header.php');

?>
        <div id = "main">
        <script type = "text/javascript">
        </script>
        </div>

        <?php 

        include($_SERVER['DOCUMENT_ROOT'] . '/bottom.php');

        ?>
    </div> <!-- /wrap -->
</body>

</html>
