<?php
require '../database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);


  // Sanitize.
  $room_no = mysqli_real_escape_string($con, (int)$request->room_no);
  $rtid = mysqli_real_escape_string($con, (int)$request->rtid);
  $status = mysqli_real_escape_string($con, trim($request->status));


  // Create.
  $sql = "INSERT INTO `rooms` VALUES (null,'{$room_no}','{$status}','{$rtid}')";

  if(mysqli_query($con,$sql))
  {
    http_response_code(201);
    $room = [
      'status' => $status,
      'room_no' => $room_no,
      'rtid' => $rtid,
      'rid'    => mysqli_insert_id($con)
    ];
    echo json_encode($room);
  }
  else
  {
    http_response_code(422);
  }
}