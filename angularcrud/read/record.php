<?php
/**
 * Returns the list of record.
 */
require '../database.php';

$record = [];
$sql = "SELECT * FROM record";

if($result = mysqli_query($con,$sql))
{
  $i = 0;
  while($row = mysqli_fetch_assoc($result))
  {
    $record[$i]['rdid']    = $row['rdid'];
    $record[$i]['name'] = $row['name'];
    $record[$i]['section'] = $row['section'];
    $record[$i]['date'] = $row['date'];
    $record[$i]['time'] = $row['time'];
    $record[$i]['action'] = $row['action'];
    $record[$i]['status']    = $row['status'];
    $record[$i]['status2']    = $row['status2'];
    $i++;
  }

  echo json_encode($record);
}
else
{
  http_response_code(404);
}