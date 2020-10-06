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
  $rent = mysqli_real_escape_string($con, (int)$request->rent);
  $tax = mysqli_real_escape_string($con, (int)$request->tax);
  $nop = mysqli_real_escape_string($con, (int)$request->nop);


  // Create.
  $sql = "INSERT INTO `roomtype` VALUES (null,'{$name}','{$rent}','{$tax}','{$nop}')";

  if(mysqli_query($con,$sql))
  {
    http_response_code(201);
    $roomtype = [
      'name' => $name,
      'rent' => $rent,
      'tax' => $tax,
      'nop' => $nop,
      'rtid'    => mysqli_insert_id($con)
    ];
    echo json_encode($roomtype);
  }
  else
  {
    http_response_code(422);
  }
}