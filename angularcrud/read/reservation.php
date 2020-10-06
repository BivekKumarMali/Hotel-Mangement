<?php
/**
 * Returns the list of reservation.
 */
require '../database.php';

$reservation = [];
$sql = "SELECT * FROM reservation";

if($result = mysqli_query($con,$sql))
{
  $i = 0;
  while($row = mysqli_fetch_assoc($result))
  {
    $reservation[$i]['bid']    = $row['bid'];
    $reservation[$i]['cid'] = $row['cid'];
    $reservation[$i]['rid'] = $row['rid'];
    $reservation[$i]['checkin']    = $row['checkin'];
    $reservation[$i]['checkout'] = $row['checkout'];
    $reservation[$i]['payment'] = $row['payment'];
    $reservation[$i]['deposit']    = $row['deposit'];
    $reservation[$i]['payment1'] = $row['payment1'];
    $reservation[$i]['deposit1']    = $row['deposit1'];
    $reservation[$i]['due'] = $row['due'];
    $reservation[$i]['status'] = $row['status'];
    $reservation[$i]['comment'] = $row['comment'];
    $reservation[$i]['extra'] = $row['extra'];
    $i++;
  }

  echo json_encode($reservation);
}
else
{
  http_response_code(404);
}