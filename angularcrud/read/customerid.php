<?php
/**
 * Returns the list of customer.
 */
require '../database.php';
$cid = ($_GET['cid'] !== null && (int)$_GET['cid'] > 0)? mysqli_real_escape_string($con, (int)$_GET['cid']) : false;



$sql = "SELECT * FROM customer WHERE `cid` ='{$cid}' LIMIT 1";

if($result = mysqli_query($con,$sql))
{
  
  $row = mysqli_fetch_assoc($result);

  echo json_encode($row);
}
else
{
  http_response_code(404);
}