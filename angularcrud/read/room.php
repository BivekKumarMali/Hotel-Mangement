<?php
/**
 * Returns the list of rooms.
 */
require '../database.php';

$rooms = [];
$sql = "SELECT * FROM rooms";

if($result = mysqli_query($con,$sql))
{
  $i = 0;
  while($row = mysqli_fetch_assoc($result))
  {
    $rooms[$i]['rid']    = $row['rid'];
    $rooms[$i]['room_no'] = $row['room_no'];
    $rooms[$i]['status'] = $row['status'];
    $rooms[$i]['rtid']    = $row['rtid'];
    $i++;
  }

  echo json_encode($rooms);
}
else
{
  http_response_code(404);
}