<?php
require '../database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);

  // Sanitize.
  $rtid    = mysqli_real_escape_string($con, (int)$request->rtid);
  $name = mysqli_real_escape_string($con, trim($request->name));
  $rent = mysqli_real_escape_string($con, (int)$request->rent);
  $tax = mysqli_real_escape_string($con, (int)$request->tax);
  $nop = mysqli_real_escape_string($con, (int)$request->nop);

  // Update.
  $sql = "UPDATE `roomtype` SET `name`='$name',`rent`='$rent', `tax`='$tax', `nop`='$nop' WHERE `rtid` = '{$rtid}' LIMIT 1";

  if(mysqli_query($con, $sql))
  {
    http_response_code(204);
  }
  else
  {
    return http_response_code(422);
  }  
}