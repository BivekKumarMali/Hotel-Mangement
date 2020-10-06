<?php

require '../database.php';

// Extract, validate and sanitize the cid.
$cid = ($_GET['cid'] !== null && (int)$_GET['cid'] > 0)? mysqli_real_escape_string($con, (int)$_GET['cid']) : false;

if(!$cid)
{
  return http_response_code(400);
}

// Delete.
$sql = "DELETE FROM `customer` WHERE `cid` ='{$cid}' LIMIT 1";

if(mysqli_query($con, $sql))
{
  http_response_code(204);
}
else
{
  return http_response_code(422);
}