<?php

require '../database.php';

// Extract, validate and sanitize the bid.
$bid = ($_GET['bid'] !== null && (int)$_GET['bid'] > 0)? mysqli_real_escape_string($con, (int)$_GET['bid']) : false;

if(!$bid)
{
  return http_response_code(400);
}

// Delete.
$sql = "DELETE FROM `reservation` WHERE `bid` ='{$bid}' LIMIT 1";

if(mysqli_query($con, $sql))
{
  http_response_code(204);
}
else
{
  return http_response_code(422);
}