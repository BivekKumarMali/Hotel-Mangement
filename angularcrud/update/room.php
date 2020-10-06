<?php
require '../database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);

  // Sanitize.
  $rid    = mysqli_real_escape_string($con, (int)$request->rid);
  $rtid    = mysqli_real_escape_string($con, (int)$request->rtid);
  $status = mysqli_real_escape_string($con, trim($request->status));
  $room_no = mysqli_real_escape_string($con, (float)$request->room_no);

  // Update.
  $sql = "UPDATE `rooms` SET `status`='$status',`room_no`='$room_no',`rtid`='$rtid' WHERE `rid` = '{$rid}' LIMIT 1";

  if(mysqli_query($con, $sql))
  {
    http_response_code(204);
  }
  else
  {
    return http_response_code(422);
  }  
}