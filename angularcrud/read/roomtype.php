<?php
/**
 * Returns the list of policies.
 */
require '../database.php';

$roomtype = [];
$sql = "SELECT * FROM roomtype";

if($result = mysqli_query($con,$sql))
{
  $i = 0;
  while($row = mysqli_fetch_assoc($result))
  {
    $roomtype[$i]['rtid']    = $row['rtid'];
    $roomtype[$i]['name'] = $row['name'];
    $roomtype[$i]['rent'] = $row['rent'];
    $roomtype[$i]['tax'] = $row['tax'];
    $roomtype[$i]['nop'] = $row['nop'];
    $i++;
  }

  echo json_encode($roomtype);
}
else
{
  http_response_code(404);
}