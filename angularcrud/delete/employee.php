<?php

require '../database.php';

// Extract, validate and sanitize the eid.
$eid = ($_GET['eid'] !== null && (int)$_GET['eid'] > 0)? mysqli_real_escape_string($con, (int)$_GET['eid']) : false;

if(!$eid)
{
  return http_response_code(400);
}

// Delete.
$sql = "DELETE FROM `employee` WHERE `eid` ='{$eid}' LIMIT 1";

if(mysqli_query($con, $sql))
{
  http_response_code(204);
}
else
{
  return http_response_code(422);
}