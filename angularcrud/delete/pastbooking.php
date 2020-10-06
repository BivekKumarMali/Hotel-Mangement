<?php

require '../database.php';

// Extract, validate and sanitize the pbid.
$pbid = ($_GET['pbid'] !== null && (int)$_GET['pbid'] > 0)? mysqli_real_escape_string($con, (int)$_GET['pbid']) : false;

if(!$pbid)
{
  return http_response_code(400);
}

// Delete.
$sql = "DELETE FROM `pastbooking` WHERE `pbid` ='{$pbid}' LIMIT 1";

if(mysqli_query($con, $sql))
{
  http_response_code(204);
}
else
{
  return http_response_code(422);
}