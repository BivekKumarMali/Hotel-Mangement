<?php

require '../database.php';

// Extract, validate and sanitize the rtid.
$rtid = ($_GET['rtid'] !== null && (int)$_GET['rtid'] > 0)? mysqli_real_escape_string($con, (int)$_GET['rtid']) : false;

if(!$rtid)
{
  return http_response_code(400);
}

// Delete.
$sql = "DELETE FROM `roomtype` WHERE `rtid` ='{$rtid}' LIMIT 1";

if(mysqli_query($con, $sql))
{
  http_response_code(204);
}
else
{
  return http_response_code(422);
}