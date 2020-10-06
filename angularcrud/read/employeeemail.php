<?php
/**
 * Returns the list of employee.
 */
require '../database.php';
$mail = ($_GET['mail'] !== null && $_GET['mail'] != '')? mysqli_real_escape_string($con, $_GET['mail']) : false;



$sql = "SELECT * FROM employee WHERE `mail` ='{$mail}' LIMIT 1";

if($result = mysqli_query($con,$sql))
{
  
  $row = mysqli_fetch_assoc($result);

  echo json_encode($row);
}
else
{
  http_response_code(404);
}