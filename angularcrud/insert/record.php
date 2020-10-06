<?php
require '../database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);


  // Sanitize.
  $name = mysqli_real_escape_string($con, trim($request->name));
  $date = mysqli_real_escape_string($con, trim($request->date));
  $time = mysqli_real_escape_string($con, trim($request->time));
  $section = mysqli_real_escape_string($con, trim($request->section));
  $action = mysqli_real_escape_string($con, trim($request->action));
  $status = mysqli_real_escape_string($con, ($request->status));
  $status2 = mysqli_real_escape_string($con, ($request->status2));


  // Create.
  $sql = "INSERT INTO `record` VALUES (null, '{$name}', '{$section}' ,'{$date}','{$time}', '{$action}', '{$status}', '{$status2}')";

  if(mysqli_query($con,$sql))
  {
    http_response_code(201);
    $record = [
      'name' => $name,
      'date' => $date,
      'time' => $time,
      'action' => $action,
      'status' => $status,
      'status2' => $status2,
      'rdid'    => mysqli_insert_id($con)
    ];
    echo json_encode($record);
  }
  else
  {
    http_response_code(422);
  }
}