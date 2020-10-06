<?php
require '../database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);

  // Sanitize.
  $eid    = mysqli_real_escape_string($con, (int)$request->eid);
  $name = mysqli_real_escape_string($con, trim($request->name));
  $role = mysqli_real_escape_string($con, trim($request->role));
  $mobile = mysqli_real_escape_string($con, (int)$request->mobile);
  $mail = mysqli_real_escape_string($con, trim($request->mail));
  $password = mysqli_real_escape_string($con, trim($request->password));
  $status = mysqli_real_escape_string($con, trim($request->status));
  $joining = mysqli_real_escape_string($con, date($request->joining));
  $remarks = mysqli_real_escape_string($con, trim($request->remarks));
  $paid = mysqli_real_escape_string($con, trim($request->paid));

  // Update.
  $sql = " UPDATE `employee` SET `name` = '$name',  `role` = '$role',  `password` = '$password',  `mobile` = '$mobile', `joining` = '$joining',  `status` = '$status',  `remarks` = '$remarks',  `mail` = '$mail', `paid` = '$paid' WHERE  `eid` = '{$eid}' LIMIT 1 ";

  if(mysqli_query($con, $sql))
  {
    http_response_code(204);
  }
  else
  {
    return http_response_code(422);
  }  
}