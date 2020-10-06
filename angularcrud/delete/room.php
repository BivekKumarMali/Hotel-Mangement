<?php

require '../database.php';

// Extract, validate and sanitize the rid.
$rid = ($_GET['rid'] !== null && (int)$_GET['rid'] > 0)? mysqli_real_escape_string($con, (int)$_GET['rid']) : false;

if(!$rid)
{
  return http_response_code(400);
}

// Delete.
$sql = "DELETE FROM `rooms` WHERE `rid` ='{$rid}' LIMIT 1";

if(mysqli_query($con, $sql))
{
  http_response_code(204);
}
else
{
  return http_response_code(422);
}