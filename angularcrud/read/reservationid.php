<?php
/**
 * Returns the list of reservation.
 */
require '../database.php';
$bid = ($_GET['bid'] !== null && (int)$_GET['bid'] > 0)? mysqli_real_escape_string($con, (int)$_GET['bid']) : false;



$sql = "SELECT * FROM reservation WHERE `bid` ='{$bid}' LIMIT 1";

if($result = mysqli_query($con,$sql))
{
  
  $row = mysqli_fetch_assoc($result);

  echo json_encode($row);
}
else
{
  http_response_code(404);
}