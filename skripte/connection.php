<?php
function OpenCon()
 {

 $dbconn = pg_connect("host=localhost port=5434 dbname=postgres user=postgres password=postgres");
 
 return $dbconn;
 }
 
function CloseCon($dbconn)
 {
 $dbconn -> close();
 }
   
?>

